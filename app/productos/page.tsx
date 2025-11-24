'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'

const CATEGORIES = ['Todas', 'Casual', 'Deportiva', 'Formal', 'Vintage', 'Estampada']
const COLORS = ['Todos', 'Blanco', 'Negro', 'Gris', 'Azul', 'Rojo', 'Verde', 'Amarillo']
const SIZES = ['Todas', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ProductsPage() {
    const searchParams = useSearchParams()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || 'Todas',
        color: 'Todos',
        size: 'Todas',
        search: ''
    })

    useEffect(() => {
        fetchProducts()
    }, [filters])

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()

            if (filters.category !== 'Todas') params.append('category', filters.category)
            if (filters.color !== 'Todos') params.append('color', filters.color)
            if (filters.size !== 'Todas') params.append('size', filters.size)
            if (filters.search) params.append('search', filters.search)

            const response = await fetch(`/api/products?${params}`)
            const data = await response.json()
            setProducts(data)
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
                Nuestros Productos
            </h1>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoría
                        </label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Color Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color
                        </label>
                        <select
                            value={filters.color}
                            onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            {COLORS.map(color => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>

                    {/* Size Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Talla
                        </label>
                        <select
                            value={filters.size}
                            onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            {SIZES.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    <p className="mt-4 text-gray-600">Cargando productos...</p>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500">
                    No se encontraron productos con los filtros seleccionados
                </div>
            )}
        </div>
    )
}