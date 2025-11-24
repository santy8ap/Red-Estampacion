'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

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
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Crear Nuevo Producto
            </h1>
            <ProductForm />
        </div>
    )
}