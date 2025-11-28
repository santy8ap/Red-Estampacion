'use client'

import { useWishlist } from '@/context/WishlistContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmptyState from '@/components/EmptyState'
import Badge from '@/components/Badge'
import { Heart, ShoppingCart, Trash2, ArrowRight, Package, Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import type { WishlistItem } from '@/context/WishlistContext'

export default function WishlistPage() {
    const { items, removeItem, clearWishlist, isLoaded } = useWishlist()
    const { addItem: addToCart } = useCart()
    const router = useRouter()
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const toggleSelect = (productId: string) => {
        const newSelected = new Set(selectedItems)
        if (newSelected.has(productId)) {
            newSelected.delete(productId)
        } else {
            newSelected.add(productId)
        }
        setSelectedItems(newSelected)
    }

    const handleAddToCart = (item: WishlistItem) => {
        try {
            addToCart({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: 1,
                size: 'M',
                color: 'Blanco',
                image: item.image
            })
            toast.success('✅ Agregado al carrito')
        } catch {
            toast.error('Error al agregar al carrito')
        }
    }

    const handleAddSelectedToCart = () => {
        let count = 0
        items.forEach(item => {
            if (selectedItems.has(item.productId)) {
                handleAddToCart(item)
                count++
            }
        })
        if (count > 0) {
            toast.success(`✅ ${count} producto${count > 1 ? 's' : ''} agregado${count > 1 ? 's' : ''} al carrito`)
            setSelectedItems(new Set())
        }
    }

    const handleCopyLink = (productId: string) => {
        const link = `${window.location.origin}/productos/${productId}`
        navigator.clipboard.writeText(link)
        setCopiedId(productId)
        toast.success('Enlace copiado')
        setTimeout(() => setCopiedId(null), 2000)
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price, 0)

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-1 flex items-center justify-center pt-24">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600"
                    />
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
            <Navbar />

            {/* Header */}
            <section className="pt-24 pb-8 bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between flex-wrap gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <motion.div 
                                whileHover={{ scale: 1.1, rotate: 12 }}
                                className="p-3 bg-white/20 backdrop-blur rounded-xl"
                            >
                                <Heart className="w-8 h-8 fill-current" />
                            </motion.div>
                            <div>
                                <h1 className="text-4xl font-bold">Mis Favoritos</h1>
                                <p className="text-red-100 mt-1">{items.length} {items.length === 1 ? 'producto' : 'productos'}</p>
                            </div>
                        </div>
                        {items.length > 0 && (
                            <div className="text-right">
                                <p className="text-red-100 text-sm">Valor total</p>
                                <p className="text-3xl font-bold">${totalPrice.toFixed(2)}</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {items.length === 0 ? (
                    <EmptyState
                        icon={Heart}
                        title="Wishlist Vacío"
                        description="Agrega productos a favoritos y aparecerán aquí. ¡Comienza a explorar nuestras colecciones!"
                        actionLabel="Explorar Productos"
                        actionHref="/productos"
                    />
                ) : (
                    <div className="space-y-6">
                        {/* Toolbar */}
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex flex-wrap items-center justify-between gap-4"
                        >
                            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.size === items.length && items.length > 0}
                                    onChange={() => {
                                        if (selectedItems.size === items.length) {
                                            setSelectedItems(new Set())
                                        } else {
                                            setSelectedItems(new Set(items.map(i => i.productId)))
                                        }
                                    }}
                                    className="w-5 h-5 rounded border-gray-300 cursor-pointer accent-red-600"
                                />
                                <span className="text-gray-700 font-semibold">
                                    {selectedItems.size === 0 ? 'Seleccionar todo' : `${selectedItems.size} seleccionado${selectedItems.size > 1 ? 's' : ''}`}
                                </span>
                            </label>
                            <div className="flex gap-3 flex-wrap">
                                <AnimatePresence>
                                    {selectedItems.size > 0 && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            onClick={handleAddSelectedToCart}
                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition font-semibold"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Agregar {selectedItems.size} al carrito
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={clearWishlist}
                                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold border border-red-200"
                                >
                                    Limpiar todo
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Grid de Productos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {items.map((item, idx) => (
                                    <motion.div
                                        key={item.productId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition border border-gray-200 overflow-hidden group"
                                    >
                                        {/* Checkbox */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <motion.label 
                                                whileHover={{ scale: 1.1 }}
                                                className="flex items-center gap-2 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.has(item.productId)}
                                                    onChange={() => toggleSelect(item.productId)}
                                                    className="w-5 h-5 rounded border-gray-300 cursor-pointer accent-red-600"
                                                />
                                            </motion.label>
                                        </div>

                                        {/* Image */}
                                        <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                                            {item.image ? (
                                                <div className="w-full h-full relative">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, 33vw"
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Package className="w-12 h-12" />
                                                </div>
                                            )}
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => removeItem(item.productId)}
                                                className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition shadow-lg"
                                                title="Remover de favoritos"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </motion.button>
                                        </div>

                                        {/* Info */}
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-1">
                                                    {item.name}
                                                </h3>
                                            </div>
                                            <Badge label="❤️ En Favoritos" variant="error" size="sm" animated />
                                            <p className="text-3xl font-bold text-red-600 my-4">
                                                ${item.price.toFixed(2)}
                                            </p>

                                            <div className="space-y-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => router.push(`/productos/${item.productId}`)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold"
                                                >
                                                    <ArrowRight className="w-4 h-4" />
                                                    Ver Producto
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleAddToCart(item)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition font-semibold"
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                    Agregar al Carrito
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleCopyLink(item.productId)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm"
                                                >
                                                    {copiedId === item.productId ? (
                                                        <>
                                                            <Check className="w-4 h-4" />
                                                            Copiado!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-4 h-4" />
                                                            Copiar Enlace
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}
