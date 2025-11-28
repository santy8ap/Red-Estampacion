'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
    Package,
    TrendingUp,
    DollarSign,
    Star,
    Search,
    Filter,
    Edit,
    Trash2,
    Plus,
    Eye,
    EyeOff,
    ChevronDown,
    CheckCircle,
    AlertCircle,
    ArrowUpDown
} from 'lucide-react'
import Loading from '@/components/Loading'

type SortField = 'name' | 'price' | 'stock' | 'active'
type SortOrder = 'asc' | 'desc'

export default function AdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [products, setProducts] = useState<any[]>([])
    const [filteredProducts, setFilteredProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('Todas')
    const [filterStatus, setFilterStatus] = useState('Todos')
    const [sortField, setSortField] = useState<SortField>('name')
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
            return
        }

        if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            toast.error('No tienes permisos de administrador')
            router.push('/')
            return
        }

        if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
            fetchProducts()
        }
    }, [status, session, router])

    useEffect(() => {
        filterProducts()
    }, [searchTerm, filterCategory, filterStatus, products, sortField, sortOrder])

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products')
            const data = await response.json()
            
            // ✅ FIX: Extraer el array de products correctamente
            const productsArray = data.products || data || []
            
            setProducts(productsArray)
            setFilteredProducts(productsArray)
        } catch (error) {
            console.error('Error fetching products:', error)
            toast.error('Error al cargar productos')
        } finally {
            setLoading(false)
        }
    }

    const filterProducts = () => {
        let filtered = [...products]

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Category filter
        if (filterCategory !== 'Todas') {
            filtered = filtered.filter(p => p.category === filterCategory)
        }

        // Status filter
        if (filterStatus === 'Activos') {
            filtered = filtered.filter(p => p.active)
        } else if (filterStatus === 'Inactivos') {
            filtered = filtered.filter(p => !p.active)
        } else if (filterStatus === 'Destacados') {
            filtered = filtered.filter(p => p.featured)
        } else if (filterStatus === 'Sin Stock') {
            filtered = filtered.filter(p => p.stock === 0)
        }

        // Sorting
        filtered.sort((a, b) => {
            let aVal = a[sortField]
            let bVal = b[sortField]

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase()
                bVal = bVal.toLowerCase()
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1
            } else {
                return aVal < bVal ? 1 : -1
            }
        })

        setFilteredProducts(filtered)
    }

    const handleDelete = async (id: string) => {
        const loadingToast = toast.loading('Eliminando producto...')

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Error al eliminar')

            toast.success('Producto eliminado exitosamente', { id: loadingToast })
            setDeleteConfirm(null)
            fetchProducts()
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al eliminar producto', { id: loadingToast })
        }
    }

    const toggleActive = async (id: string, currentStatus: boolean) => {
        const loadingToast = toast.loading('Actualizando estado...')

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !currentStatus })
            })

            if (!response.ok) throw new Error('Error al actualizar')

            toast.success(
                currentStatus ? 'Producto desactivado' : 'Producto activado',
                { id: loadingToast }
            )
            fetchProducts()
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al actualizar estado', { id: loadingToast })
        }
    }

    const toggleFeatured = async (id: string, currentStatus: boolean) => {
        const loadingToast = toast.loading('Actualizando destacado...')

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: !currentStatus })
            })

            if (!response.ok) throw new Error('Error al actualizar')

            toast.success(
                currentStatus ? 'Producto removido de destacados' : 'Producto marcado como destacado',
                { id: loadingToast }
            )
            fetchProducts()
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al actualizar destacado', { id: loadingToast })
        }
    }

    if (loading) {
        return <Loading />
    }

    const categories = ['Todas', ...new Set(products.map((p: any) => p.category))]
    const totalValue = products.reduce((sum: number, p: any) => sum + (p.price * p.stock), 0)

    const stats = [
        {
            icon: Package,
            label: 'Total Productos',
            value: products.length,
            color: 'from-blue-500 to-blue-600',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            icon: TrendingUp,
            label: 'Productos Activos',
            value: products.filter((p: any) => p.active).length,
            color: 'from-green-500 to-green-600',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600'
        },
        {
            icon: Star,
            label: 'Destacados',
            value: products.filter((p: any) => p.featured).length,
            color: 'from-yellow-500 to-yellow-600',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600'
        },
        {
            icon: DollarSign,
            label: 'Valor Inventario',
            value: `$${totalValue.toFixed(0)}`,
            color: 'from-purple-500 to-purple-600',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600'
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2">
                            Panel de Administración
                        </h1>
                        <p className="text-gray-600">
                            Gestiona tus productos y órdenes • {filteredProducts.length} productos mostrados
                        </p>
                    </div>
                    <Link href="/admin/productos/nuevo">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-red-500/50"
                        >
                            <Plus className="w-5 h-5" />
                            Nuevo Producto
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium mb-1">
                                        {stat.label}
                                    </p>
                                    <p className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`${stat.iconBg} p-3 rounded-xl`}>
                                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-2xl shadow-lg mb-6 border border-gray-100"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar productos por nombre, categoría..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                            />
                        </div>

                        {/* Category */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition appearance-none cursor-pointer"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition appearance-none cursor-pointer"
                            >
                                <option value="Todos">Todos los estados</option>
                                <option value="Activos">Activos</option>
                                <option value="Inactivos">Inactivos</option>
                                <option value="Destacados">Destacados</option>
                                <option value="Sin Stock">Sin Stock</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <span>
                            Mostrando <span className="font-bold text-red-600">{filteredProducts.length}</span> de <span className="font-bold">{products.length}</span> productos
                        </span>
                    </div>
                </motion.div>

                {/* Products Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th 
                                        className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition"
                                        onClick={() => {
                                            setSortField('name')
                                            setSortOrder(sortField === 'name' && sortOrder === 'asc' ? 'desc' : 'asc')
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            Producto
                                            {sortField === 'name' && <ArrowUpDown className="w-4 h-4" />}
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th 
                                        className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition"
                                        onClick={() => {
                                            setSortField('price')
                                            setSortOrder(sortField === 'price' && sortOrder === 'asc' ? 'desc' : 'asc')
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            Precio
                                            {sortField === 'price' && <ArrowUpDown className="w-4 h-4" />}
                                        </div>
                                    </th>
                                    <th 
                                        className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition"
                                        onClick={() => {
                                            setSortField('stock')
                                            setSortOrder(sortField === 'stock' && sortOrder === 'asc' ? 'desc' : 'asc')
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            Stock
                                            {sortField === 'stock' && <ArrowUpDown className="w-4 h-4" />}
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product: any, index) => (
                                        <motion.tr
                                            key={product.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="hover:bg-red-50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 flex-shrink-0 relative group">
                                                        {product.images?.[0] ? (
                                                            <img
                                                                className="h-12 w-12 rounded-lg object-cover border-2 border-gray-200 group-hover:scale-110 transition-transform duration-300"
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                                <Package className="w-6 h-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900">
                                                            {product.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            ID: {product.id.slice(0, 8)}...
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {product.category}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-lg font-bold text-gray-900">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`text-sm font-bold px-3 py-1 rounded-full inline-flex items-center gap-2 ${
                                                        product.stock > 10
                                                            ? 'text-green-600 bg-green-50'
                                                            : product.stock > 0
                                                                ? 'text-yellow-600 bg-yellow-50'
                                                                : 'text-red-600 bg-red-50'
                                                    }`}
                                                >
                                                    {product.stock > 0 ? (
                                                        <CheckCircle className="w-4 h-4" />
                                                    ) : (
                                                        <AlertCircle className="w-4 h-4" />
                                                    )}
                                                    {product.stock} und.
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => toggleActive(product.id, product.active)}
                                                        className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full cursor-pointer transition-all justify-center ${
                                                            product.active
                                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                        }`}
                                                    >
                                                        {product.active ? (
                                                            <>
                                                                <Eye className="w-3 h-3" />
                                                                Activo
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeOff className="w-3 h-3" />
                                                                Inactivo
                                                            </>
                                                        )}
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => toggleFeatured(product.id, product.featured)}
                                                        className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full cursor-pointer transition-all justify-center ${
                                                            product.featured
                                                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        <Star className={`w-3 h-3 ${product.featured ? 'fill-current' : ''}`} />
                                                        {product.featured ? 'Destacado' : 'Normal'}
                                                    </motion.button>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/productos/${product.id}`}>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-all"
                                                            title="Editar producto"
                                                        >
                                                            <Edit className="w-5 h-5" />
                                                        </motion.button>
                                                    </Link>

                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => setDeleteConfirm({ id: product.id, name: product.name })}
                                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Eliminar producto"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                            <p className="text-lg font-medium">No se encontraron productos</p>
                                            <p className="text-sm">Intenta con otros filtros o crea uno nuevo</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => setDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-4">
                                    <AlertCircle className="w-7 h-7 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Eliminar producto
                                </h3>
                                <p className="text-gray-600">
                                    ¿Estás seguro de que deseas eliminar <span className="font-bold">"{deleteConfirm.name}"</span>? Esta acción no se puede deshacer.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                                >
                                    Cancelar
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleDelete(deleteConfirm.id)}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                                >
                                    Eliminar
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}