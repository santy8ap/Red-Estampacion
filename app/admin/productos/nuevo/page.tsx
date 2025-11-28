'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Package } from 'lucide-react'
import ProductForm from '@/components/ProductForm'
import Loading from '@/components/Loading'

export default function NewProductPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin')
            return
        }

        if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            alert('No tienes permisos de administrador')
            router.push('/')
            return
        }
    }, [status, session])

    if (status === 'loading') {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header with breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Link href="/admin" className="group">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Volver al Panel
                            </motion.button>
                        </Link>
                    </div>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                                    <Plus className="w-8 h-8 text-white" />
                                </div>
                                Crear Nuevo Producto
                            </h1>
                            <p className="text-gray-600 max-w-2xl">
                                Completa el formulario a continuación para agregar un nuevo producto a tu catálogo. Asegúrate de incluir toda la información relevante y una imagen atractiva.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Info boxes */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
                >
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                        <div className="mt-1 text-blue-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-900">Campos requeridos</h3>
                            <p className="text-sm text-blue-700">Marca con * los campos obligatorios que debes completar</p>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                        <div className="mt-1 text-green-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10 10.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-green-900">Imagen de portada</h3>
                            <p className="text-sm text-green-700">La primera imagen será la que se muestre en el catálogo</p>
                        </div>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
                >
                    <ProductForm />
                </motion.div>

                {/* Help section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6"
                >
                    <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Consejos para un mejor producto
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-red-800">
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span>Utiliza un nombre descriptivo y atractivo</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span>Incluye detalles técnicos y especificaciones</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span>Carga imágenes en alta calidad (mínimo 800x800px)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-600 font-bold">•</span>
                            <span>Establece un precio competitivo y realista</span>
                        </li>
                    </ul>
                </motion.div>
            </div>
        </div>
    )
}