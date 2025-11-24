'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { Sparkles, TrendingUp, Clock, Star } from 'lucide-react'

const collections = [
    {
        id: 'nuevos-lanzamientos',
        name: { es: 'Nuevos Lanzamientos', en: 'New Releases' },
        description: { es: 'Lo último en diseños frescos', en: 'Latest fresh designs' },
        emoji: '✨',
        gradient: 'from-purple-500 via-pink-500 to-red-500',
        filter: 'newest',
        icon: Sparkles
    },
    {
        id: 'mas-vendidos',
        name: { es: 'Más Vendidos', en: 'Best Sellers' },
        description: { es: 'Los favoritos de todos', en: 'Everyone\'s favorites' },
        emoji: '🔥',
        gradient: 'from-orange-500 via-red-500 to-pink-500',
        filter: 'bestseller',
        icon: TrendingUp
    },
    {
        id: 'edicion-limitada',
        name: { es: 'Edición Limitada', en: 'Limited Edition' },
        description: { es: 'Exclusivos y únicos', en: 'Exclusive and unique' },
        emoji: '💎',
        gradient: 'from-blue-500 via-purple-500 to-pink-500',
        filter: 'limited',
        icon: Star
    },
    {
        id: 'clasicos',
        name: { es: 'Clásicos Atemporales', en: 'Timeless Classics' },
        description: { es: 'Nunca pasan de moda', en: 'Never go out of style' },
        emoji: '⭐',
        gradient: 'from-gray-600 via-gray-700 to-gray-900',
        filter: 'classic',
        icon: Clock
    },
    {
        id: 'casual',
        name: { es: 'Casual Everyday', en: 'Casual Everyday' },
        description: { es: 'Para el día a día', en: 'For everyday wear' },
        emoji: '👕',
        gradient: 'from-blue-400 via-cyan-400 to-teal-400',
        category: 'Casual'
    },
    {
        id: 'deportiva',
        name: { es: 'Active Sports', en: 'Active Sports' },
        description: { es: 'Rendimiento y estilo', en: 'Performance and style' },
        emoji: '🏃',
        gradient: 'from-green-400 via-emerald-500 to-teal-500',
        category: 'Deportiva'
    },
    {
        id: 'formal',
        name: { es: 'Elegancia Formal', en: 'Formal Elegance' },
        description: { es: 'Para ocasiones especiales', en: 'For special occasions' },
        emoji: '👔',
        gradient: 'from-indigo-500 via-purple-500 to-pink-500',
        category: 'Formal'
    },
    {
        id: 'vintage',
        name: { es: 'Retro Vintage', en: 'Retro Vintage' },
        description: { es: 'Estilo retro auténtico', en: 'Authentic retro style' },
        emoji: '🎸',
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        category: 'Vintage'
    },
    {
        id: 'estampada',
        name: { es: 'Arte Estampado', en: 'Printed Art' },
        description: { es: 'Diseños únicos y creativos', en: 'Unique creative designs' },
        emoji: '🎨',
        gradient: 'from-yellow-400 via-pink-400 to-purple-400',
        category: 'Estampada'
    },
]

export default function ColeccionesPage() {
    const { locale, t } = useLanguage()
    const [stats, setStats] = useState<any>(null)

    useEffect(() => {
        // Obtener estadísticas de productos
        fetch('/api/products')
            .then(res => res.json())
            .then(products => {
                const total = products.length
                const featured = products.filter((p: any) => p.featured).length
                const categories = [...new Set(products.map((p: any) => p.category))].length
                setStats({ total, featured, categories })
            })
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity }}
                        className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-black mb-6">
                            {locale === 'es' ? 'Nuestras Colecciones' : 'Our Collections'}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                            {locale === 'es'
                                ? 'Explora nuestras colecciones cuidadosamente seleccionadas para cada estilo y ocasión'
                                : 'Explore our carefully curated collections for every style and occasion'}
                        </p>

                        {stats && (
                            <div className="flex justify-center gap-8 mt-8">
                                <div className="text-center">
                                    <p className="text-4xl font-black">{stats.total}</p>
                                    <p className="text-sm opacity-80">{locale === 'es' ? 'Productos' : 'Products'}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl font-black">{stats.categories}</p>
                                    <p className="text-sm opacity-80">{locale === 'es' ? 'Categorías' : 'Categories'}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-4xl font-black">{stats.featured}</p>
                                    <p className="text-sm opacity-80">{locale === 'es' ? 'Destacados' : 'Featured'}</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Collections Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {collections.map((collection, index) => (
                        <motion.div
                            key={collection.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group"
                        >
                            <Link
                                href={`/productos?${collection.category ? `category=${collection.category}` : `filter=${collection.filter}`}`}
                            >
                                <div className={`relative bg-gradient-to-br ${collection.gradient} rounded-2xl shadow-xl overflow-hidden h-64`}>
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />

                                    {/* Content */}
                                    <div className="relative h-full p-8 flex flex-col justify-between text-white">
                                        <div>
                                            <motion.div
                                                whileHover={{ scale: 1.2, rotate: 10 }}
                                                className="text-6xl mb-4"
                                            >
                                                {collection.emoji}
                                            </motion.div>
                                            <h3 className="text-2xl font-black mb-2">
                                                {collection.name[locale]}
                                            </h3>
                                            <p className="text-sm opacity-90">
                                                {collection.description[locale]}
                                            </p>
                                        </div>

                                        <motion.div
                                            initial={{ x: -10, opacity: 0 }}
                                            whileHover={{ x: 0, opacity: 1 }}
                                            className="flex items-center gap-2 font-semibold"
                                        >
                                            {locale === 'es' ? 'Explorar' : 'Explore'}
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </motion.div>
                                    </div>

                                    {/* Decorative circles */}
                                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                    <div className="absolute -left-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-12 text-center text-white overflow-hidden relative"
                >
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black mb-4">
                            {locale === 'es' ? '¿No encuentras lo que buscas?' : 'Can\'t find what you\'re looking for?'}
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            {locale === 'es'
                                ? 'Explora todos nuestros productos'
                                : 'Browse all our products'}
                        </p>
                        <Link
                            href="/productos"
                            className="inline-block bg-white text-red-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl"
                        >
                            {locale === 'es' ? 'Ver Todos' : 'View All'}
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}