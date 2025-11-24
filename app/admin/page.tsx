'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin')
            return
        }

        if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            alert('No tienes permisos de administrador')
            router.push('/')
            return
        }

        if (session?.user?.role === 'ADMIN') {
            fetchProducts()
        }
    }, [status, session])

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products')
            const data = await response.json()
            setProducts(data)
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Error al eliminar')

            alert('Producto eliminado')
            fetchProducts()
        } catch (error) {
            console.error('Error:', error)
            alert('Error al eliminar producto')
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Panel de Administración
                </h1>
                <Link
                    href="/admin/productos/nuevo"
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
                >
                    + Nuevo Producto
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">
                        Total Productos
                    </h3>
                    <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">
                        Productos Activos
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                        {products.filter((p: any) => p.active).length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-600 text-sm font-medium mb-2">
                        Productos Destacados
                    </h3>
                    <p className="text-3xl font-bold text-red-600">
                        {products.filter((p: any) => p.featured).length}
                    </p>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Producto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Categoría
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product: any) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                {product.images?.[0] ? (
                                                    <img
                                                        className="h-10 w-10 rounded object-cover"
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded bg-gray-200"></div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-semibold text-gray-900">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`text-sm ${product.stock > 10
                                                    ? 'text-green-600'
                                                    : product.stock > 0
                                                        ? 'text-yellow-600'
                                                        : 'text-red-600'
                                                }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {product.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                        {product.featured && (
                                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                Destacado
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={`/admin/productos/${product.id}`}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}