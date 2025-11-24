'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useSession } from 'next-auth/react'

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const { addItem } = useCart()

    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        fetchProduct()
    }, [params.id])

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${params.id}`)
            const data = await response.json()
            setProduct(data)

            // Set defaults
            if (data.sizes?.length > 0) setSelectedSize(data.sizes[0])
            if (data.colors?.length > 0) setSelectedColor(data.colors[0])
        } catch (error) {
            console.error('Error fetching product:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert('Por favor selecciona talla y color')
            return
        }

        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            size: selectedSize,
            color: selectedColor,
            image: product.images[0] || ''
        })

        alert('Producto agregado al carrito')
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Producto no encontrado</h2>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => router.back()}
                className="mb-6 text-red-600 hover:text-red-700 flex items-center"
            >
                ← Volver
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                    <div className="bg-gray-200 rounded-lg overflow-hidden mb-4">
                        {product.images && product.images.length > 0 ? (
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-96 object-cover"
                            />
                        ) : (
                            <div className="w-full h-96 flex items-center justify-center text-gray-400">
                                Sin imagen
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.map((image: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`border-2 rounded overflow-hidden ${selectedImage === index ? 'border-red-600' : 'border-gray-300'
                                        }`}
                                >
                                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-20 object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {product.name}
                    </h1>

                    <p className="text-4xl font-bold text-red-600 mb-6">
                        ${product.price.toFixed(2)}
                    </p>

                    <div className="mb-6">
                        <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {product.category}
                        </span>
                        {product.stock > 0 ? (
                            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm ml-2">
                                En stock ({product.stock})
                            </span>
                        ) : (
                            <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm ml-2">
                                Agotado
                            </span>
                        )}
                    </div>

                    <p className="text-gray-700 mb-6">
                        {product.description}
                    </p>

                    {/* Size Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Talla
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes?.map((size: string) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 border rounded-lg transition ${selectedSize === size
                                            ? 'bg-red-600 text-white border-red-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-red-600'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {product.colors?.map((color: string) => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`px-4 py-2 border rounded-lg transition ${selectedColor === color
                                            ? 'bg-red-600 text-white border-red-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-red-600'
                                        }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad
                        </label>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                -
                            </button>
                            <span className="text-xl font-semibold w-12 text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                    </button>
                </div>
            </div>
        </div>
    )
}