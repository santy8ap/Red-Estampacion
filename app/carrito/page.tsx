'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmptyState from '@/components/EmptyState'
import Badge from '@/components/Badge'
import { ShoppingCart, Trash2, Plus, Minus, Package, Tag, Sparkles, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart, applyCoupon, removeCoupon, couponCode, totalWithDiscount, discountAmount, isLoaded, itemCount } = useCart()
    const router = useRouter()
    const { data: session } = useSession()
    const [coupon, setCoupon] = useState('')
    const [loadingCoupon, setLoadingCoupon] = useState(false)
    const [promoOpen, setPromoOpen] = useState(false)

    useEffect(() => {
        if (!isLoaded) return
    }, [isLoaded])

    const handleCheckout = () => {
        if (!session) {
            toast.error('Debes iniciar sesión para continuar')
            router.push('/api/auth/signin')
            return
        }
        router.push('/checkout')
    }

    const handleApplyCoupon = async () => {
        if (!coupon.trim()) {
            toast.error('Ingresa un código de cupón')
            return
        }

        setLoadingCoupon(true)
        try {
            const success = await applyCoupon(coupon.toUpperCase())
            if (success) {
                toast.success('✅ Cupón aplicado correctamente')
                setCoupon('')
                setPromoOpen(false)
            } else {
                toast.error('❌ Código de cupón inválido o expirado')
            }
        } finally {
            setLoadingCoupon(false)
        }
    }

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

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
                <Navbar />
                <div className="flex-1 flex items-center justify-center pt-24">
                    <EmptyState
                        icon={ShoppingCart}
                        title="Carrito Vacío"
                        description="Tu carrito está vacío. ¡Comienza a agregar productos y disfruta de nuestras prendas premium!"
                        actionLabel="Explorar Productos"
                        actionHref="/productos"
                    />
                </div>
                <Footer />
            </div>
        )
    }

    const taxAmount = total * 0.09
    const finalTotal = totalWithDiscount * 1.09

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
            <Navbar />

            {/* Header */}
            <section className="pt-24 pb-8 bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4"
                    >
                        <motion.div 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="p-3 bg-white/20 backdrop-blur rounded-xl"
                        >
                            <ShoppingCart className="w-8 h-8" />
                        </motion.div>
                        <div>
                            <h1 className="text-4xl font-bold">Carrito de Compras</h1>
                            <p className="text-red-100 mt-1">{itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items Section */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            <AnimatePresence mode="popLayout">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={`${item.productId}-${item.size}-${item.color}-${index}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition border border-gray-200 p-6"
                                    >
                                        <div className="flex gap-6">
                                            {/* Image */}
                                            <motion.div 
                                                whileHover={{ scale: 1.05 }}
                                                className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 relative"
                                            >
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <Package className="w-10 h-10" />
                                                    </div>
                                                )}
                                            </motion.div>

                                            {/* Info */}
                                            <div className="flex-grow">
                                                <h3 className="font-bold text-lg text-gray-900 hover:text-red-600 transition">
                                                    {item.name}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 text-sm my-3">
                                                    <Badge label={`Talla: ${item.size}`} variant="info" size="sm" />
                                                    <Badge label={`Color: ${item.color}`} variant="default" size="sm" />
                                                </div>
                                                <p className="text-xl font-bold text-red-600">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    ${item.price.toFixed(2)} × {item.quantity}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col items-end justify-between">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => removeItem(item.productId, item.size, item.color)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                                                    title="Remover"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </motion.button>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition font-bold"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </motion.button>
                                                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition font-bold"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Summary Section */}
                    <div className="lg:col-span-1 h-fit sticky top-24 space-y-6">
                        {/* Promo Code */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-md border border-amber-200 p-6"
                        >
                            <button
                                onClick={() => setPromoOpen(!promoOpen)}
                                className="w-full flex items-center justify-between mb-4"
                            >
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-amber-600" />
                                    <h3 className="font-bold text-gray-900">Código de Descuento</h3>
                                </div>
                                <motion.div
                                    animate={{ rotate: promoOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ArrowRight className="w-5 h-5 text-amber-600" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {promoOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3"
                                    >
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={coupon}
                                                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                                                placeholder="Ej: WELCOME10"
                                                className="flex-1 px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                                disabled={loadingCoupon || !!couponCode}
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleApplyCoupon}
                                                disabled={loadingCoupon || !!couponCode}
                                                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-60 font-semibold transition"
                                            >
                                                {loadingCoupon ? '...' : 'Aplicar'}
                                            </motion.button>
                                        </div>
                                        {couponCode && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="bg-white rounded-lg p-3 border border-amber-300 flex items-center justify-between"
                                            >
                                                <span className="text-sm font-semibold">
                                                    Cupón: <span className="text-amber-600">{couponCode}</span>
                                                </span>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={removeCoupon}
                                                    className="text-xs text-red-600 font-semibold"
                                                >
                                                    Remover
                                                </motion.button>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Summary Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-md border border-gray-200 p-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">${total.toFixed(2)}</span>
                                </div>

                                {discountAmount > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex justify-between text-green-600 bg-green-50 p-3 rounded-lg"
                                    >
                                        <span>Descuento</span>
                                        <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                                    </motion.div>
                                )}

                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Impuestos (9%)</span>
                                    <span>${taxAmount.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Envío</span>
                                    <span className="text-green-600 font-semibold">Gratis</span>
                                </div>
                            </div>

                            <div className="border-t-2 border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between text-2xl font-bold">
                                    <span>Total</span>
                                    <span className="text-red-600">${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCheckout}
                                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold hover:shadow-lg transition text-lg mb-3 shadow-md"
                            >
                                Proceder al Pago
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={clearCart}
                                className="w-full text-red-600 bg-red-50 hover:bg-red-100 py-3 rounded-xl font-semibold border border-red-200 transition"
                            >
                                Vaciar Carrito
                            </motion.button>

                            <Link
                                href="/productos"
                                className="block text-center text-red-600 hover:text-red-700 mt-4 font-semibold transition"
                            >
                                ← Continuar comprando
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
