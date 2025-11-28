'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Heart, ShoppingCart, Zap, TrendingUp, Eye } from 'lucide-react'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    images: string[] | string
    category: string
    stock?: number
    rating?: number
    featured?: boolean
    originalPrice?: number
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { isFavorite, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()
  
  const favorite = isFavorite(product.id)

  const getImageUrl = () => {
    if (imgError) return '/placeholder.jpg'
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0]
    }
    if (typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images)
        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '/placeholder.jpg'
      } catch {
        return product.images || '/placeholder.jpg'
      }
    }
    return '/placeholder.jpg'
  }

  const imageUrl = getImageUrl()
  const isOutOfStock = product.stock === 0
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = hasDiscount 
    ? Math.round((((product.originalPrice || 0) - product.price) / (product.originalPrice || 1)) * 100)
    : 0
  const lowStock = product.stock && product.stock > 0 && product.stock <= 5

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (favorite) {
      removeFromWishlist(product.id)
      toast.success('Removido de favoritos')
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: imageUrl
      })
      toast.success('Agregado a favoritos')
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isOutOfStock) {
      toast.error('Producto agotado')
      return
    }

    try {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: 'M',
        color: 'Blanco',
        image: imageUrl,
        stock: product.stock
      })
      toast.success('Agregado al carrito')
    } catch {
      toast.error('Error al agregar al carrito')
    }
  }

  return (
    <Link href={`/productos/${product.id}`} className="block h-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col cursor-pointer border border-gray-100"
      >
        {/* Image Container */}
        <motion.div 
          className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group"
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            unoptimized
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.featured && (
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
              >
                <Zap className="w-3 h-3 fill-current" />
                Destacado
              </motion.div>
            )}
            {discountPercentage > 0 && (
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                -{discountPercentage}%
              </motion.div>
            )}
            {lowStock && !isOutOfStock && (
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
              >
                <TrendingUp className="w-3 h-3" />
                Pocas unidades
              </motion.div>
            )}
            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
              {product.category}
            </div>
          </div>

          {/* Stock Indicator */}
          {isOutOfStock && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <span className="text-white font-bold text-2xl">Agotado</span>
            </motion.div>
          )}

          {/* Action Buttons Overlay */}
          {isHovered && !isOutOfStock && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end justify-center gap-3 p-4"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleFavorite}
                className={`p-3 rounded-full transition transform shadow-lg ${
                  favorite
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-red-50'
                }`}
                title={favorite ? 'Remover de favoritos' : 'Agregar a favoritos'}
              >
                <Heart className="w-6 h-6" fill={favorite ? 'currentColor' : 'none'} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition transform shadow-lg font-bold"
                title="Agregar al carrito"
              >
                <ShoppingCart className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition transform shadow-lg"
                title="Ver detalles"
              >
                <Eye className="w-6 h-6" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {product.category}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 text-sm">
                <span className="text-yellow-400">★</span>
                <span className="font-bold text-gray-700">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-3 hover:text-red-600 transition">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="mb-4 space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-600">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
            {lowStock && !isOutOfStock && (
              <p className="text-xs text-orange-600 font-semibold">
                Solo {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'} disponibles
              </p>
            )}
          </div>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-auto w-full"
          >
            <div className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition font-bold text-center shadow-md hover:shadow-lg">
              Ver Detalles
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  )
}
