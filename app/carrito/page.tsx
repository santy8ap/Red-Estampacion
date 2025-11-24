'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function CartPage() {
    const { items, removeItem, updateQuantity, total } = useCart()
    const router = useRouter()
    const { data: session } = useSession()

    const handleCheckout = () => {
        if (!session) {
            alert('Debes iniciar sesión para continuar')
            router.push('/api/auth/signin')
            return
        }
        router.push('/checkout')
    }

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Tu carrito está vacío
                    </h1>
                    <p className="text-gray-600 mb-8">
                        ¡Agrega algunos productos para comenzar!
                    </p>
                    <Link
                        href="/productos"
                        className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                    >
                        Explorar Productos
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Carrito de Compras
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item, index) => (
                        <div
                            key={`${item.productId}-${item.size}-${item.color}-${index}`}
                            className="bg-white p-4 rounded-lg shadow-md flex gap-4"
                        >
                            {/* Image */}
                            <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        Sin imagen
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    {item.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    Talla: {item.size} | Color: {item.color}
                                </p>
                                <p className="text-lg font-bold text-red-600">
                                    ${item.price.toFixed(2)}
                                </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex flex-col items-end justify-between">
                                <button
                                    onClick={() => removeItem(item.productId, item.size, item.color)}
                                    className="text-red-600 hover:text-red-700 text-sm"
                                >
                                    Eliminar
                                </button>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.productId,
                                                item.size,
                                                item.color,
                                                item.quantity - 1
                                            )
                                        }
                                        className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center font-semibold">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.productId,
                                                item.size,
                                                item.color,
                                                item.quantity + 1
                                            )
                                        }
                                        className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>

                                <p className="text-sm text-gray-600">
                                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Resumen del Pedido
                        </h2>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Envío</span>
                                <span>Calculado en checkout</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between text-xl font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                            Proceder al Pago
                        </button>

                        <Link
                            href="/productos"
                            className="block text-center text-red-600 hover:text-red-700 mt-4"
                        >
                            Continuar comprando
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}