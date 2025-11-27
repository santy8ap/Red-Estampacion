'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'

export default function ColeccionesPage() {
    const [collections, setCollections] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        total: 0,
        featured: 0,
        categories: 0
    })

    useEffect(() => {
        // Cargar estadísticas
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                // La API retorna { products: [], pagination: {} }
                const products = data.products || []
                const total = products.length
                const featured = products.filter((p: any) => p.featured).length
                const categories = [...new Set(products.map((p: any) => p.category))].length
                setStats({ total, featured, categories })
            })
            .catch(error => {
                console.error('Error:', error)
            })

        // Definir colecciones
        const mockCollections = [
            {
                id: 1,
                name: 'Colección Verano 2024',
                description: 'Frescura y estilo para los días más calurosos',
                image: 'https://picsum.photos/600/400?random=1',
                products: 15
            },
            {
                id: 2,
                name: 'Urban Style',
                description: 'Moda urbana para el día a día',
                image: 'https://picsum.photos/600/400?random=2',
                products: 22
            },
            {
                id: 3,
                name: 'Deportiva Pro',
                description: 'Ropa técnica para alto rendimiento',
                image: 'https://picsum.photos/600/400?random=3',
                products: 18
            },
            {
                id: 4,
                name: 'Vintage Collection',
                description: 'Los clásicos nunca pasan de moda',
                image: 'https://picsum.photos/600/400?random=4',
                products: 12
            }
        ]

        setTimeout(() => {
            setCollections(mockCollections)
            setLoading(false)
        }, 500)
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4">Nuestras Colecciones</h1>
                    <p className="text-xl">Explora nuestras colecciones exclusivas</p>
                </div>
            </section>

            {/* Estadísticas */}
            <section className="py-8 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <p className="text-3xl font-bold text-red-600">{stats.total}</p>
                            <p className="text-gray-600">Productos Totales</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-red-600">{stats.featured}</p>
                            <p className="text-gray-600">Productos Destacados</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-red-600">{stats.categories}</p>
                            <p className="text-gray-600">Categorías</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Colecciones */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <Loading />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {collections.map(collection => (
                                <div key={collection.id} className="group cursor-pointer">
                                    <div className="relative overflow-hidden rounded-xl shadow-lg">
                                        <img
                                            src={collection.image}
                                            alt={collection.name}
                                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                            <div className="p-6 text-white">
                                                <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                                                <p className="mb-4">{collection.description}</p>
                                                <p className="text-sm opacity-90">{collection.products} productos</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link
                            href="/productos"
                            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                            Ver todos los productos
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
