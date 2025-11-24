import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { prisma } from '@/lib/prisma'

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
      active: true
    },
    take: 6,
    orderBy: {
      createdAt: 'desc'
    }
  })
  return products
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Red Estampación
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Las mejores camisas estampadas con diseños únicos.
            Calidad premium y estilo incomparable.
          </p>
          <Link
            href="/productos"
            className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Ver Productos
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Productos Destacados
        </h2>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No hay productos destacados todavía
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Categorías
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Casual', 'Deportiva', 'Formal', 'Vintage', 'Estampada'].map(category => (
              <Link
                key={category}
                href={`/productos?category=${category}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition text-center"
              >
                <h3 className="font-semibold text-gray-800">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para renovar tu estilo?
          </h2>
          <p className="text-lg mb-8">
            Explora nuestra colección completa de camisas
          </p>
          <Link
            href="/productos"
            className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Explorar Ahora
          </Link>
        </div>
      </section>
    </div>
  )
}