'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Lock, Package, Truck, CreditCard, ChevronRight } from 'lucide-react'
import { checkoutSchema } from '@/lib/validations/schemas'

interface FormData {
    shippingName: string
    shippingEmail: string
    shippingAddress: string
    shippingCity: string
    shippingZip: string
    phone?: string
}

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart()
    const router = useRouter()
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: yupResolver(checkoutSchema),
        defaultValues: {
            shippingName: session?.user?.name || '',
            shippingEmail: session?.user?.email || '',
            shippingAddress: '',
            shippingCity: '',
            shippingZip: '',
            phone: '',
        },
        mode: 'onBlur', // Validación al perder el foco
    })

    const onSubmit = async (formData: FormData) => {
        setLoading(true)
        toast.loading('Procesando tu pedido...')

        try {
            const orderData = {
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size,
                    color: item.color,
                })),
                shipping: {
                    name: formData.shippingName,
                    email: formData.shippingEmail,
                    address: formData.shippingAddress,
                    city: formData.shippingCity,
                    zip: formData.shippingZip,
                    phone: formData.phone,
                },
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
            clearCart()
            toast.dismiss()
            toast.success('¡Pedido confirmado! Revisa tu email para más detalles.')
            router.push(`/mis-ordenes?orderId=${order.id}`)
        } catch (error) {
            toast.dismiss()
            toast.error(error instanceof Error ? error.message : 'Error al procesar la orden')
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-1 flex items-center justify-center pt-24">
                    <div className="text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Carrito Vacío
                        </h1>
                        <p className="text-gray-600 mb-6">No tienes productos para comprar</p>
                        <button
                            onClick={() => router.push('/productos')}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition font-semibold"
                        >
                            Volver a Productos
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Header */}
            <section className="pt-24 pb-8 bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-2">Finalizar Compra</h1>
                    <p className="text-red-100">Completa tu compra de forma segura</p>
                </div>
            </section>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        {[
                            { step: 1, title: 'Envío', icon: Truck },
                            { step: 2, title: 'Pago', icon: CreditCard },
                            { step: 3, title: 'Confirmación', icon: Lock },
                        ].map((item, index) => (
                            <div key={item.step} className="flex items-center flex-1">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition ${
                                        currentStep >= item.step
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div
                                    className={`h-1 flex-1 mx-2 ${
                                        index < 2 && currentStep > item.step ? 'bg-red-600' : 'bg-gray-300'
                                    }`}
                                />
                                {index < 2 && <div />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Truck className="w-6 h-6 text-red-600" />
                                Información de Envío
                            </h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* Nombre y Email */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nombre Completo *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Juan Pérez"
                                            {...register('shippingName')}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                                                errors.shippingName
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-red-500'
                                            }`}
                                        />
                                        {errors.shippingName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.shippingName.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="juan@example.com"
                                            {...register('shippingEmail')}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                                                errors.shippingEmail
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-red-500'
                                            }`}
                                        />
                                        {errors.shippingEmail && (
                                            <p className="text-red-500 text-sm mt-1">{errors.shippingEmail.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Teléfono (Opcional)
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        {...register('phone')}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                    />
                                </div>

                                {/* Dirección */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Dirección *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Calle, número, apartamento"
                                        {...register('shippingAddress')}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                                            errors.shippingAddress
                                                ? 'border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-red-500'
                                        }`}
                                    />
                                    {errors.shippingAddress && (
                                        <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.message}</p>
                                    )}
                                </div>

                                {/* Ciudad y Código Postal */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Ciudad *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Tu ciudad"
                                            {...register('shippingCity')}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                                                errors.shippingCity
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-red-500'
                                            }`}
                                        />
                                        {errors.shippingCity && (
                                            <p className="text-red-500 text-sm mt-1">{errors.shippingCity.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Código Postal *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ej: 28001"
                                            {...register('shippingZip')}
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition ${
                                                errors.shippingZip
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-red-500'
                                            }`}
                                        />
                                        {errors.shippingZip && (
                                            <p className="text-red-500 text-sm mt-1">{errors.shippingZip.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2 mt-8"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            Confirmar Pedido
                                            <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Security Info */}
                            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-2 text-gray-600">
                                <Lock className="w-4 h-4" />
                                <span className="text-sm">Tus datos están protegidos con encriptación SSL</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 sticky top-28">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Resumen de Compra
                            </h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                                {items.map((item, index) => (
                                    <div
                                        key={`${item.productId}-${item.size}-${item.color}-${index}`}
                                        className="flex gap-3 pb-4 border-b border-gray-200 last:border-0"
                                    >
                                        {item.image && (
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {item.size} | {item.color}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                Cantidad: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-red-600 text-sm">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Envío</span>
                                    <span className="text-green-600 font-semibold">Gratis</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Impuestos</span>
                                    <span>${(total * 0.09).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span className="text-red-600">${(total * 1.09).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-sm font-semibold text-gray-700 mb-3">Métodos de pago aceptados:</p>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-gray-100 rounded px-2 py-1 text-center text-xs font-semibold text-gray-700">
                                        Tarjeta
                                    </div>
                                    <div className="flex-1 bg-gray-100 rounded px-2 py-1 text-center text-xs font-semibold text-gray-700">
                                        PayPal
                                    </div>
                                    <div className="flex-1 bg-gray-100 rounded px-2 py-1 text-center text-xs font-semibold text-gray-700">
                                        Transferencia
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}