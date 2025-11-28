'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { productSchema } from '@/lib/validations/schemas'
import * as yup from 'yup'
import { Save, X } from 'lucide-react'
import ProductImageUpload from './product-form/ProductImageUpload'
import ProductBasicInfo from './product-form/ProductBasicInfo'
import ProductPricing from './product-form/ProductPricing'
import ProductAttributes from './product-form/ProductAttributes'

type ProductFormProps = {
    product?: {
        id?: string
        name?: string
        description?: string
        price?: number
        category?: string
        stock?: number
        featured?: boolean
        active?: boolean
        images?: string | string[]
        sizes?: string | string[]
        colors?: string | string[]
    }
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
            const url = isEdit && product?.id ? `/api/products/${product.id}` : '/api/products'
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

    return (
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <ProductImageUpload
                images={formData.images}
                onChange={(urls) => handleFieldChange('images', urls)}
                error={errors.images}
                touched={touched.images}
            />

            <ProductBasicInfo
                formData={formData}
                handleFieldChange={handleFieldChange}
                errors={errors}
                touched={touched}
                categories={CATEGORIES}
            />

            <ProductPricing
                formData={formData}
                handleFieldChange={handleFieldChange}
                errors={errors}
                touched={touched}
            />

            <ProductAttributes
                formData={formData}
                toggleSize={toggleSize}
                toggleColor={toggleColor}
                errors={errors}
                touched={touched}
                sizes={SIZES}
                colors={COLORS}
            />

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
