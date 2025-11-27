'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type ProductCardProps = {
  product: {
    id: string
    name: string
    price: number
    images: string[] | string
    category: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)
  
  // Manejar diferentes formatos de imágenes
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

  return (
    <Link 
      href={`/productos/${product.id}`}
      data-cy="product-card"
      className="group"
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-64 overflow-hidden bg-gray-100">
          {imageUrl.startsWith('/') ? (
            // Imagen local
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-4xl text-gray-400">📸</span>
            </div>
          ) : (
            // Imagen remota
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImgError(true)}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          )}
          <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {product.category}
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-red-600">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </span>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition">
              Ver más
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
