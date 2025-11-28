'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'
import { ChevronLeft, ShoppingCart, Heart, Share2, Check } from 'lucide-react'

interface Product {
    id: string
    name: string
    price: number
    description: string
    images: string[] | string
    category: string
    stock: number
    sizes?: string[]
    colors?: string[]
    [key: string]: unknown
}

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { addItem } = useCart()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [addedToCart, setAddedToCart] = useState(false)
    const [isLiked, setIsLiked] = useState(false)

    useEffect(() => {
        fetchProduct()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id])

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${params.id}`)
            if (!response.ok) throw new Error('Producto no encontrado')
            
            const data = await response.json()
            setProduct(data)

            // Set defaults
            if (data.sizes?.length > 0) setSelectedSize(data.sizes[0])
            if (data.colors?.length > 0) setSelectedColor(data.colors[0])
        } catch (error) {
            console.error('Error fetching product:', error)
            setError('No se pudo cargar el producto')
        } finally {
            setLoading(false)
        }
    }

    const getImages = (): string[] => {
        if (!product?.images) return []
        if (typeof product.images === 'string') {
            try {
                const parsed = JSON.parse(product.images)
                return Array.isArray(parsed) ? parsed : [product.images]
            } catch {
                return [product.images]
            }
        }
        return Array.isArray(product.images) ? product.images : []
    }

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert('Por favor selecciona talla y color')
            return
        }

        const images = getImages()
        addItem({
            productId: product!.id,
            name: product!.name,
            price: product!.price,
            quantity,
            size: selectedSize,
            color: selectedColor,
            image: images[0] || ''
        })

        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-1 flex items-center justify-center pt-24">
                    <Loading />
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-1 flex items-center justify-center pt-24">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {error || 'Producto no encontrado'}
                        </h2>
                        <button
                            onClick={() => router.push('/productos')}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
                        >
                            Volver a Productos
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const images = getImages()
    const currentImage = images[selectedImage] || '/placeholder.jpg'

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-1 pt-24 pb-16">
                {/* Breadcrumb */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 transition font-medium"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Volver
                    </button>
                </div>

                {/* Product Container */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center relative group">
                                    {currentImage && currentImage !== '/placeholder.jpg' ? (
                                        <img
                                            src={currentImage}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <div className="text-center">
                                                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Sin imagen disponible
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative rounded-lg overflow-hidden border-2 transition-all h-24 ${
                                                selectedImage === index
                                                    ? 'border-red-600 ring-2 ring-red-300'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Header Info */}
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex gap-3 mb-3">
                                            <span className="inline-block bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-semibold">
                                                {product.category}
                                            </span>
                                            {product.stock > 0 ? (
                                                <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
                                                    ✓ En stock
                                                </span>
                                            ) : (
                                                <span className="inline-block bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-semibold">
                                                    Agotado
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                            {product.name}
                                        </h1>
                                        <p className="text-gray-600">{product.stock} unidades disponibles</p>
                                    </div>
                                    <button
                                        onClick={() => setIsLiked(!isLiked)}
                                        className={`p-3 rounded-full transition ${
                                            isLiked
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Heart className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} />
                                    </button>
                                </div>

                                <div className="flex items-baseline gap-4">
                                    <span className="text-5xl font-bold text-red-600">
                                        ${product.price.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                    <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Size Selector */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-3">
                                        Selecciona Talla
                                    </label>
                                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`py-2 px-3 rounded-lg font-semibold transition border-2 ${
                                                    selectedSize === size
                                                        ? 'bg-red-600 text-white border-red-600'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-red-600'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color Selector */}
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-3">
                                        Selecciona Color
                                    </label>
                                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                        {product.colors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                className={`py-2 px-3 rounded-lg font-semibold transition border-2 ${
                                                    selectedColor === color
                                                        ? 'bg-red-600 text-white border-red-600'
                                                        : 'bg-white text-gray-700 border-gray-300 hover:border-red-600'
                                                }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-3">
                                    Cantidad
                                </label>
                                <div className="flex items-center bg-white border border-gray-300 rounded-lg w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-100 transition"
                                    >
                                        −
                                    </button>
                                    <div className="w-16 text-center font-bold text-lg">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-12 h-12 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-100 transition"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2 ${
                                    product.stock === 0
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : addedToCart
                                        ? 'bg-green-600 text-white'
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                            >
                                {addedToCart ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        ¡Agregado al carrito!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5" />
                                        {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                                    </>
                                )}
                            </button>

                            {/* Share Button */}
                            <button className="w-full py-3 px-6 rounded-lg font-semibold transition border-2 border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                                <Share2 className="w-5 h-5" />
                                Compartir
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}