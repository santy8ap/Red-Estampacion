'use client'

import { motion } from 'framer-motion'
import FormInput from './FormInput'

interface ProductBasicInfoProps {
    formData: {
        name: string
        description: string
        category: string
    }
    handleFieldChange: (field: string, value: string | number) => void
    errors: Record<string, string>
    touched: Record<string, boolean>
    categories: string[]
}

export default function ProductBasicInfo({
    formData,
    handleFieldChange,
    errors,
    touched,
    categories
}: ProductBasicInfoProps) {
    return (
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
                    value={formData.name}
                    onChange={(value) => handleFieldChange('name', value)}
                    error={errors.name}
                    touched={touched.name}
                    placeholder="Ej: Camisa estampada vintage"
                    required
                />
                <FormInput
                    label="Categoría"
                    field="category"
                    value={formData.category}
                    onChange={(value) => handleFieldChange('category', value)}
                    error={errors.category}
                    touched={touched.category}
                    required
                >
                    <select
                        value={formData.category}
                        onChange={(e) => handleFieldChange('category', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 bg-white text-gray-900 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-100 hover:border-gray-400 transition cursor-pointer focus:outline-none"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </FormInput>
            </div>

            <FormInput
                label="Descripción"
                field="description"
                value={formData.description}
                onChange={(value) => handleFieldChange('description', value)}
                error={errors.description}
                touched={touched.description}
                required
            >
                <textarea
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none resize-none text-gray-900 placeholder-gray-400 ${touched.description && errors.description
                        ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-300 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 hover:border-gray-400'
                        }`}
                    placeholder="Describe las características del producto..."
                />
            </FormInput>
        </motion.div>
    )
}
