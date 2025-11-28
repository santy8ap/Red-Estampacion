'use client'

import { motion } from 'framer-motion'
import FormInput from './FormInput'

interface ProductPricingProps {
    formData: {
        price: number | string
        stock: number | string
        featured: boolean
        active: boolean
    }
    handleFieldChange: (field: string, value: any) => void
    errors: Record<string, string>
    touched: Record<string, boolean>
}

export default function ProductPricing({
    formData,
    handleFieldChange,
    errors,
    touched
}: ProductPricingProps) {
    return (
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
                    value={formData.price}
                    onChange={(value) => handleFieldChange('price', value)}
                    error={errors.price}
                    touched={touched.price}
                    placeholder="29.99"
                    required
                />
                <FormInput
                    label="Stock"
                    field="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(value) => handleFieldChange('stock', value)}
                    error={errors.stock}
                    touched={touched.stock}
                    placeholder="100"
                    required
                />
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">Estado</label>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <motion.label
                            whileHover={{ scale: 1.02 }}
                            className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${formData.featured
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
                            className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${formData.active
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
    )
}
