'use client'

import Link from 'next/link'
import Image from 'next/image'

type Product = {
    id: string
    name: string
    price: number
    images: string[]
    category: string
    featured?: boolean
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/productos/${product.id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="relative h-64 bg-gray-200">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Sin imagen
                        </div>
                    )}
                    {product.featured && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                            Destacado
                        </span>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                        {product.category}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red-600">
                            ${product.price.toFixed(2)}
                        </span>
                        <button className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition">
                            Ver más
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    )
}