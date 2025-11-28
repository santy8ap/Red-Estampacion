'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Home, RefreshCw, Phone } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-8 flex justify-center"
        >
          <div className="p-6 bg-red-100 rounded-full">
            <AlertTriangle className="w-16 h-16 text-red-600" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Algo salió mal
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 mb-6"
        >
          Disculpa, hemos experimentado un error inesperado. Nuestro equipo ha sido notificado y estamos trabajando para resolverlo.
        </motion.p>

        {/* Error Details */}
        {process.env.NODE_ENV === 'development' && error?.message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-8 text-left max-h-40 overflow-y-auto"
          >
            <p className="font-mono text-sm text-red-700 break-words">
              {error.message}
            </p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Intentar de Nuevo
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 border-2 border-red-200 hover:border-red-400 rounded-xl font-semibold transition hover:bg-red-50"
          >
            <Home className="w-5 h-5" />
            Ir a Inicio
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="mailto:support@redestampacion.com"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-lg"
          >
            <Phone className="w-5 h-5" />
            Contactar
          </motion.a>
        </motion.div>

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-500"
        >
          Código de error: {error?.digest || 'UNKNOWN'} | <a href="/api/auth/signin" className="text-red-600 hover:underline">Contactar Soporte</a>
        </motion.p>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-10 right-20 w-96 h-96 bg-red-100 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-10 -left-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl"
          />
        </div>
      </motion.div>
    </div>
  )
}
