'use client'

import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

interface FormInputProps {
    label: string
    field: string
    value: string | number | undefined
    onChange: (value: string | number) => void
    error?: string
    touched?: boolean
    type?: string
    placeholder?: string
    required?: boolean
    children?: React.ReactNode
}

export default function FormInput({
    label,
    field,
    value,
    onChange,
    error,
    touched,
    type = 'text',
    placeholder,
    required = false,
    children = null
}: FormInputProps) {
    const hasError = touched && error

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
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none text-gray-900 placeholder-gray-400 ${hasError
                        ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                        : 'border-gray-300 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-100 hover:border-gray-400'
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
                    {error}
                </motion.p>
            )}
        </motion.div>
    )
}
