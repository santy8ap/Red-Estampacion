'use client'

import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import ImageUpload from '../ImageUpload'

interface ProductImageUploadProps {
    images: string[]
    onChange: (urls: string[]) => void
    error?: string
    touched?: boolean
}

export default function ProductImageUpload({
    images,
    onChange,
    error,
    touched
}: ProductImageUploadProps) {
    return (
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
                value={images}
                onChange={onChange}
                maxFiles={8}
            />
            {touched && error && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-600 flex items-center gap-1"
                >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </motion.p>
            )}
        </motion.div>
    )
}
