'use client'

import { motion } from 'framer-motion'

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'premium'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  animated?: boolean
}

const variants = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  success: 'bg-green-100 text-green-700 border-green-200',
  error: 'bg-red-100 text-red-700 border-red-200',
  warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  premium: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200'
}

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
}

export default function Badge({ 
  label, 
  variant = 'default', 
  size = 'md',
  icon,
  animated = false 
}: BadgeProps) {
  const content = (
    <span className={`inline-flex items-center gap-1.5 font-semibold border rounded-full ${variants[variant]} ${sizes[size]}`}>
      {icon}
      {label}
    </span>
  )

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        {content}
      </motion.div>
    )
  }

  return content
}
