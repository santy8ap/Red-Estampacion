'use client'

import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

interface ProductAttributesProps {
    formData: {
        sizes: string[]
        colors: string[]
    }
    toggleSize: (size: string) => void
    toggleColor: (color: string) => void
    errors: Record<string, string>
    touched: Record<string, boolean>
    sizes: string[]
    colors: string[]
}

export default function ProductAttributes({
    formData,
    toggleSize,
    toggleColor,
    errors,
    touched,
    sizes,
    colors
}: ProductAttributesProps) {
    return (
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
                        {sizes.map(size => (
                            <motion.button
                                key={size}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`px-4 py-3 rounded-lg border-2 font-bold text-center transition ${formData.sizes.includes(size)
                                    ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-red-400'
                                    }`}
                            >
                                {size}
                            </motion.button>
                        ))}
                    </div>
                    {touched.sizes && errors.sizes && (
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
                        {colors.map(color => (
                            <motion.button
                                key={color}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => toggleColor(color)}
                                className={`px-4 py-3 rounded-lg border-2 font-bold text-center transition ${formData.colors.includes(color)
                                    ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-red-400'
                                    }`}
                            >
                                {color}
                            </motion.button>
                        ))}
                    </div>
                    {touched.colors && errors.colors && (
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
    )
}
