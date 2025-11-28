import { Suspense } from 'react'
import ProductsContent from './products-content'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
            <Navbar />
            
            {/* Header Section */}
            <section className="pt-24 pb-8 bg-gradient-to-r from-red-600 to-red-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl font-bold mb-2">Nuestros Productos</h1>
                    <p className="text-red-100 text-lg">Descubre nuestra amplia colección de ropa personalizada</p>
                </div>
            </section>

            <Suspense fallback={<div className="py-16"><Loading /></div>}>
                <ProductsContent />
            </Suspense>

            <Footer />
        </div>
    )
}