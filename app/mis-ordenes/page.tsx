'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function MyOrdersPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin')
            return
        }

        if (status === 'authenticated') {
            fetchOrders()
        }
    }, [status])

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders')
            const data = await response.json()
            setOrders(data)
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800'
            case 'PROCESSING':
                return 'bg-blue-100 text-blue-800'
            case 'SHIPPED':
                return 'bg-purple-100 text-purple-800'
            case 'DELIVERED':
                return 'bg-green-100 text-green-800'
            case 'CANCELLED':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'Pendiente'
            case 'PROCESSING':
                return 'Procesando'
            case 'SHIPPED':
                return 'Enviado'
            case 'DELIVERED':
                return 'Entregado'
            case 'CANCELLED':
                return 'Cancelado'
            default:
                return status
        }
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Órdenes</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No tienes órdenes todavía</p>
                    <button
                        onClick={() => router.push('/productos')}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        Explorar Productos
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order: any) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Orden #{order.id.slice(-8).toUpperCase()}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                        order.status
                                    )}`}
                                >
                                    {getStatusText(order.status)}
                                </span>
                            </div>

                            <div className="border-t border-b py-4 my-4">
                                {order.items.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 mb-3 last:mb-0"
                                    >
                                        <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                            {item.product.images?.[0] ? (
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                    Sin imagen
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium text-gray-900">
                                                {item.product.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Talla: {item.size} | Color: {item.color} | Cantidad:{' '}
                                                {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    <p>Envío a: {order.shippingAddress}</p>
                                    <p>
                                        {order.shippingCity}, {order.shippingZip}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Total</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        ${order.total.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}