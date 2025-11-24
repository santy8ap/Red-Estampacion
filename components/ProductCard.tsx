'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type Product = {
    id: string
    name: string
    price: number
    images: string | string[]
    category: string
    featured?: boolean
    stock?: number
}

function getImagesArray(images: string | string[]): string[] {
    if (Array.isArray(images)) return images
    if (typeof images === 'string') {
        try {
            const parsed = JSON.parse(images)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }
    return []
}

export default function ProductCard({ product }: { product: Product }) {
    const { t } = useLanguage()
    const [isLiked, setIsLiked] = useState(false)
    const images = getImagesArray(product.images)
    const firstImage = images[0]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="group"
        >
            <Link href={`/productos/${product.id}`}>
                <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border border-gray-100">
                    {/* Image Container */}
                    <div className="relative h-72 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {firstImage ? (
                            <motion.img
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.4 }}
                                src={firstImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ShoppingCart className="w-16 h-16" />
                            </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.featured && (
                                <motion.span
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                                >
                                    <Star className="w-3 h-3 fill-current" />
                                    {t('products.featured')}
                                </motion.span>
                            )}
                            {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    {t('products.lastUnits')} {product.stock}!
                                </span>
                            )}
                        </div>

                        {/* Wishlist Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.preventDefault()
                                setIsLiked(!isLiked)
                            }}
                            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition"
                        >
                            <Heart
                                className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                            />
                        </motion.button>

                        {/* Quick View Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                {t('products.viewDetails')}
                            </motion.button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                            {product.category}
                        </span>

                        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-red-600 transition">
                            {product.name}
                        </h3>

                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-3xl font-black bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                                    ${product.price.toFixed(2)}
                                </span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.preventDefault()
                                    // Add to cart logic
                                }}
                                className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3 rounded-xl hover:from-red-700 hover:to-red-800 transition shadow-lg hover:shadow-xl"
                            >
                                <ShoppingCart className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}