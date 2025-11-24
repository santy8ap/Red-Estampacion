'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'

type ProductFormProps = {
    product?: any
    isEdit?: boolean
}

const CATEGORIES = ['Casual', 'Deportiva', 'Formal', 'Vintage', 'Estampada']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLORS = ['Blanco', 'Negro', 'Gris', 'Azul', 'Rojo', 'Verde', 'Amarillo', 'Rosa', 'Morado']

export default function ProductForm({ product, isEdit = false }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Parsear las imágenes, tallas y colores si vienen como string
    const parseField = (field: any) => {
        if (typeof field === 'string') {
            try {
                return JSON.parse(field)
            } catch {
                return []
            }
        }
        return field || []
    }

    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        category: product?.category || CATEGORIES[0],
        stock: product?.stock || '',
        featured: product?.featured || false,
        active: product?.active !== undefined ? product.active : true,
        images: parseField(product?.images),
        sizes: parseField(product?.sizes),
        colors: parseField(product?.colors),
    })

    const [errors, setErrors] = useState<any>({})

    const validateForm = () => {
        const newErrors: any = {}

        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
        if (!formData.description.trim()) newErrors.description = 'La descripción es requerida'
        if (!formData.price || formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0'
        if (!formData.stock || formData.stock < 0) newErrors.stock = 'El stock no puede ser negativo'
        if (formData.images.length === 0) newErrors.images = 'Agrega al menos una imagen'
        if (formData.sizes.length === 0) newErrors.sizes = 'Selecciona al menos una talla'
        if (formData.colors.length === 0) newErrors.colors = 'Selecciona al menos un color'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const toggleSize = (size: string) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }))
    }

    const toggleColor = (color: string) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.includes(color)
                ? prev.colors.filter(c => c !== color)
                : [...prev.colors, color]
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            alert('Por favor corrige los errores en el formulario')
            return
        }

        setLoading(true)

        try {
            const url = isEdit ? `/api/products/${product.id}` : '/api/products'
            const method = isEdit ? 'PUT' : 'POST'

            // Convertir arrays a strings para SQLite
            const dataToSend = {
                ...formData,
                images: JSON.stringify(formData.images),
                sizes: JSON.stringify(formData.sizes),
                colors: JSON.stringify(formData.colors),
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            })

            if (!response.ok) {
                throw new Error('Error al guardar producto')
            }

            alert(isEdit ? '✅ Producto actualizado exitosamente' : '✅ Producto creado exitosamente')
            router.push('/admin')
            router.refresh()
        } catch (error) {
            console.error('Error:', error)
            alert('❌ Error al guardar el producto')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
            {/* Header */}
            <div className="border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <p className="text-gray-600 mt-1">
                    Complete todos los campos para {isEdit ? 'actualizar' : 'crear'} el producto
                </p>
            </div>

            {/* Imágenes */}
            <div>
                <ImageUpload
                    value={formData.images}
                    onChange={(urls) => setFormData({ ...formData, images: urls })}
                    maxFiles={8}
                />
                {errors.images && (
                    <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                )}
            </div>

            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del producto *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Ej: Camisa estampada vintage"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                {/* Categoría */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría *
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Descripción */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Describe las características del producto..."
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio *
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                        </span>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.price ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="29.99"
                        />
                    </div>
                    {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock *
                    </label>
                    <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.stock ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="100"
                    />
                    {errors.stock && (
                        <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                    )}
                </div>

                <div className="flex items-center space-x-4 mt-8">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                            Destacado
                        </span>
                    </label>

                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                            Activo
                        </span>
                    </label>
                </div>
            </div>

            {/* Tallas */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tallas disponibles *
                </label>
                <div className="flex flex-wrap gap-2">
                    {SIZES.map(size => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`px-4 py-2 rounded-lg border-2 font-medium transition ${formData.sizes.includes(size)
                                    ? 'bg-red-500 text-white border-red-500'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
                {errors.sizes && (
                    <p className="mt-1 text-sm text-red-600">{errors.sizes}</p>
                )}
            </div>

            {/* Colores */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colores disponibles *
                </label>
                <div className="flex flex-wrap gap-2">
                    {COLORS.map(color => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => toggleColor(color)}
                            className={`px-4 py-2 rounded-lg border-2 font-medium transition ${formData.colors.includes(color)
                                    ? 'bg-red-500 text-white border-red-500'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
                                }`}
                        >
                            {color}
                        </button>
                    ))}
                </div>
                {errors.colors && (
                    <p className="mt-1 text-sm text-red-600">{errors.colors}</p>
                )}
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6 border-t">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                        </>
                    ) : (
                        <>
                            {isEdit ? 'Actualizar Producto' : 'Crear Producto'}
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                    Cancelar
                </button>
            </div>
        </form>
    )
}