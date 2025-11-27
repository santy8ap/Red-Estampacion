'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loading from '@/components/Loading'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products?featured=true&limit=6')
      .then(res => res.json())
      .then(data => {
        // ✅ ARREGLADO: La API ahora retorna { products: [], pagination: {} }
        const products = data.products || data
        setFeaturedProducts(Array.isArray(products) ? products : [])
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      <FeaturesSection />

      {/* Productos Destacados */}
      <section className="py-16 px-4" data-cy="featured-products">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-gray-600 text-lg">
              Descubre nuestra selección especial
            </p>
          </div>

          {loading ? (
            <Loading />
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No hay productos destacados disponibles
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/productos"
              className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Ver todos los productos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
