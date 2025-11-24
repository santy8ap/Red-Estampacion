'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart()
    const router = useRouter()
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        address: '',
        city: '',
        zip: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const orderData = {
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    color: item.color,
                })),
                shipping: formData,
            }

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            })

            if (!response.ok) {
                throw new Error('Error al crear la orden')
            }

            const order = await response.json()

            // Limpiar carrito
            clearCart()

            // Redirect a página de éxito
            alert(`¡Orden creada exitosamente! ID: ${order.id}`)
            router.push('/mis-ordenes')
        } catch (error) {
            console.error('Error:', error)
            alert('Error al procesar la orden')
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                    No hay productos en el carrito
                </h1>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shipping Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Información de Envío
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dirección *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Calle, número, departamento"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ciudad *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) =>
                                            setFormData({ ...formData, city: e.target.value })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Código Postal *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.zip}
                                        onChange={(e) =>
                                            setFormData({ ...formData, zip: e.target.value })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
                            >
                                {loading ? 'Procesando...' : 'Confirmar Pedido'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Resumen de Compra
                        </h2>

                        <div className="space-y-3 mb-6">
                            {items.map((item, index) => (
                                <div
                                    key={`${item.productId}-${item.size}-${item.color}-${index}`}
                                    className="flex justify-between text-sm"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {item.name}
                                        </p>
                                        <p className="text-gray-600">
                                            {item.size} | {item.color} x{item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Envío</span>
                                <span>Gratis</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between text-xl font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}