'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import ProductForm from '@/components/ProductForm'

export default function EditProductPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const params = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

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

        if (session?.user?.role === 'ADMIN') {
            fetchProduct()
        }
    }, [status, session])

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${params.id}`)
            const data = await response.json()
            setProduct(data)
        } catch (error) {
            console.error('Error fetching product:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || status === 'loading') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Producto no encontrado</h2>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Editar Producto
            </h1>
            <ProductForm product={product} isEdit={true} />
        </div>
    )
}