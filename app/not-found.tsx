'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Search, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        {/* Animated 404 */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-8"
        >
          <div className="text-9xl font-black">
            <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              404
            </span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
        >
          Página no encontrada
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-600 mb-8"
        >
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </motion.p>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { icon: Home, label: 'Ir a Inicio', href: '/' },
            { icon: Search, label: 'Explorar Productos', href: '/productos' },
            { icon: ArrowRight, label: 'Ver Categorías', href: '/colecciones' }
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-red-500 hover:shadow-lg transition group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="mb-3 flex justify-center"
              >
                <item.icon className="w-8 h-8 text-red-600 group-hover:text-red-700 transition" />
              </motion.div>
              <p className="font-semibold text-gray-700 group-hover:text-red-600 transition">
                {item.label}
              </p>
            </Link>
          ))}
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg hover:shadow-red-500/30"
          >
            <Home className="w-5 h-5" />
            Volver a Inicio
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-white text-red-600 border-2 border-red-200 hover:border-red-400 px-8 py-4 rounded-xl font-bold transition hover:bg-red-50"
          >
            Contactar Soporte
          </Link>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-20 -right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl"
          />
        </div>
      </motion.div>
    </div>
  )
}
