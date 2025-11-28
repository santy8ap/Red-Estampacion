'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import ImageUpload from './ImageUpload'
import { productSchema } from '@/lib/validations/schemas'
import * as yup from 'yup'
import { AlertCircle, CheckCircle, Save, X } from 'lucide-react'

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
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

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

    const validateForm = async () => {
        try {
            await productSchema.validate(formData, { abortEarly: false })
            setErrors({})
            return true
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors: Record<string, string> = {}
                error.inner.forEach((err) => {
                    if (err.path) {
                        newErrors[err.path] = err.message
                    }
                })
                setErrors(newErrors)
                toast.error('Por favor corrige los errores en el formulario')
                return false
            }
            return false
        }
    }

    const toggleSize = (size: string) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter((s: string) => s !== size)
                : [...prev.sizes, size]
        }))
        if (errors.sizes) {
            setErrors(prev => ({ ...prev, sizes: '' }))
        }
    }

    const toggleColor = (color: string) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.includes(color)
                ? prev.colors.filter((c: string) => c !== color)
                : [...prev.colors, color]
        }))
        if (errors.colors) {
            setErrors(prev => ({ ...prev, colors: '' }))
        }
    }

    const handleFieldChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setTouched(prev => ({ ...prev, [field]: true }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!(await validateForm())) {
            return
        }

        const loadingToast = toast.loading(isEdit ? 'Actualizando producto...' : 'Creando producto...')
        setLoading(true)

        try {
            const url = isEdit ? `/api/products/${product.id}` : '/api/products'
            const method = isEdit ? 'PUT' : 'POST'

            const dataToSend = {
                ...formData,
                price: parseFloat(formData.price.toString()),
                stock: parseInt(formData.stock.toString()),
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

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al guardar producto')
            }

            toast.success(
                isEdit ? '✅ Producto actualizado exitosamente' : '✅ Producto creado exitosamente',
                { id: loadingToast }
            )

            router.push('/admin')
            router.refresh()
        } catch (error: any) {
            console.error('Error:', error)
            toast.error(error.message || '❌ Error al guardar el producto', { id: loadingToast })
        } finally {
            setLoading(false)
        }
    }

    const FormInput = ({ label, field, type = 'text', placeholder, required = false, children = null }: any) => {
        const hasError = touched[field] && errors[field]

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <label className="block text-sm font-semibold text-gray-900">
                    {label}
                    {required && <span className="text-red-600 ml-1">*</span>}
                </label>
                {children || (
                    <input
                        type={type}
                        step={type === 'number' ? '0.01' : undefined}
                        value={formData[field as keyof typeof formData]}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none ${
                            hasError
                                ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        }`}
                        placeholder={placeholder}
                    />
                )}
                {hasError && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-sm text-red-600 flex items-center gap-1"
                    >
                        <AlertCircle className="w-4 h-4" />
                        {errors[field]}
                    </motion.p>
                )}
            </motion.div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            {/* Images Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
            >
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 font-bold">1</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Imágenes del producto</h3>
                </div>
                <ImageUpload
                    value={formData.images}
                    onChange={(urls) => handleFieldChange('images', urls)}
                    maxFiles={8}
                />
                {touched['images'] && errors.images && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-red-600 flex items-center gap-1"
                    >
                        <AlertCircle className="w-4 h-4" />
                        {errors.images}
                    </motion.p>
                )}
            </motion.div>

            {/* Section 2: Basic Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 font-bold">2</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Información básica</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Nombre del producto"
                        field="name"
                        placeholder="Ej: Camisa estampada vintage"
                        required
                    />
                    <FormInput
                        label="Categoría"
                        field="category"
                        required
                    >
                        <select
                            value={formData.category}
                            onChange={(e) => handleFieldChange('category', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 transition cursor-pointer"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </FormInput>
                </div>

                <FormInput
                    label="Descripción"
                    field="description"
                    required
                >
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        rows={4}
                        className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none resize-none ${
                            touched['description'] && errors.description
                                ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                        }`}
                        placeholder="Describe las características del producto..."
                    />
                </FormInput>
            </motion.div>

            {/* Section 3: Pricing & Stock */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
            >
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 font-bold">3</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Precio e inventario</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInput
                        label="Precio"
                        field="price"
                        type="number"
                        placeholder="29.99"
                        required
                    />
                    <FormInput
                        label="Stock"
                        field="stock"
                        type="number"
                        placeholder="100"
                        required
                    />
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">Estado</label>
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <motion.label
                                whileHover={{ scale: 1.02 }}
                                className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${
                                    formData.featured
                                        ? 'border-yellow-500 bg-yellow-50'
                                        : 'border-gray-200 bg-white hover:border-yellow-300'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => handleFieldChange('featured', e.target.checked)}
                                    className="w-4 h-4 text-yellow-600 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Destacado</span>
                            </motion.label>

                            <motion.label
                                whileHover={{ scale: 1.02 }}
                                className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${
                                    formData.active
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 bg-white hover:border-green-300'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => handleFieldChange('active', e.target.checked)}
                                    className="w-4 h-4 text-green-600 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Activo</span>
                            </motion.label>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Section 4: Attributes */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
            >
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 font-bold">4</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Tallas y colores disponibles</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Tallas disponibles <span className="text-red-600">*</span>
                        </label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {SIZES.map(size => (
                                <motion.button
                                    key={size}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => toggleSize(size)}
                                    className={`px-4 py-3 rounded-lg border-2 font-bold text-center transition ${
                                        formData.sizes.includes(size)
                                            ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-red-400'
                                    }`}
                                >
                                    {size}
                                </motion.button>
                            ))}
                        </div>
                        {touched['sizes'] && errors.sizes && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-red-600 mt-2 flex items-center gap-1"
                            >
                                <AlertCircle className="w-4 h-4" />
                                {errors.sizes}
                            </motion.p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            Colores disponibles <span className="text-red-600">*</span>
                        </label>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {COLORS.map(color => (
                                <motion.button
                                    key={color}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button"
                                    onClick={() => toggleColor(color)}
                                    className={`px-4 py-3 rounded-lg border-2 font-bold text-center transition ${
                                        formData.colors.includes(color)
                                            ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-red-400'
                                    }`}
                                >
                                    {color}
                                </motion.button>
                            ))}
                        </div>
                        {touched['colors'] && errors.colors && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-red-600 mt-2 flex items-center gap-1"
                            >
                                <AlertCircle className="w-4 h-4" />
                                {errors.colors}
                            </motion.p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3 pt-8 border-t border-gray-200"
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-bold hover:from-red-700 hover:to-red-800 transition disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/50"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {isEdit ? 'Actualizando...' : 'Creando...'}
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            {isEdit ? 'Actualizar Producto' : 'Crear Producto'}
                        </>
                    )}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                    <X className="w-5 h-5" />
                    Cancelar
                </motion.button>
            </motion.div>
        </form>
    )
}
