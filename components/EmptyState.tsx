'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  actionOnClick?: () => void
  variant?: 'default' | 'error' | 'info'
}

const variants = {
  default: 'from-gray-100 to-gray-50 border-gray-300',
  error: 'from-red-50 to-red-100 border-red-200',
  info: 'from-blue-50 to-blue-100 border-blue-200'
}

const iconVariants = {
  default: 'text-gray-400',
  error: 'text-red-400',
  info: 'text-blue-400'
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
  variant = 'default'
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${variants[variant]} rounded-lg p-12 text-center border-2 border-dashed`}
    >
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-6 flex justify-center"
      >
        <Icon className={`w-24 h-24 ${iconVariants[variant]}`} />
      </motion.div>

      <h3 className="text-2xl font-bold text-gray-700 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {description}
      </p>

      {actionLabel && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-block bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-lg transition font-semibold shadow-lg"
          >
            {actionLabel}
          </Link>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={actionOnClick}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-lg transition font-semibold shadow-lg"
          >
            {actionLabel}
          </motion.button>
        )
      )}
    </motion.div>
  )
}
