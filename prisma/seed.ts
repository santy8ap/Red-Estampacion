import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  const products = [
    {
      name: 'Camisa Vintage Rock',
      description: 'Camisa de algodón 100% con estampado vintage de bandas de rock clásicas. Perfecta para los amantes del rock.',
      price: 29.99,
      category: 'Vintage',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Negro', 'Gris']),
      stock: 50,
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500'])
    },
    {
      name: 'Camisa Deportiva Running',
      description: 'Camisa técnica transpirable ideal para running y deportes de alta intensidad.',
      price: 39.99,
      category: 'Deportiva',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Azul', 'Negro', 'Rojo']),
      stock: 75,
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'])
    },
    {
      name: 'Camisa Casual Básica',
      description: 'Camisa casual básica de algodón, perfecta para el día a día.',
      price: 19.99,
      category: 'Casual',
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Blanco', 'Negro', 'Gris', 'Azul']),
      stock: 100,
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'])
    },
    {
      name: 'Camisa Formal Elegante',
      description: 'Camisa formal de corte elegante, ideal para ocasiones especiales.',
      price: 49.99,
      category: 'Formal',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Blanco', 'Azul']),
      stock: 30,
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500'])
    },
    {
      name: 'Camisa Estampada Tropical',
      description: 'Camisa con estampado tropical vibrante. Perfecta para el verano.',
      price: 34.99,
      category: 'Estampada',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Verde', 'Azul', 'Amarillo']),
      stock: 45,
      featured: true,
      images: JSON.stringify(['https://images.unsplash.com/photo-1622445275576-721325763afe?w=500'])
    },
    {
      name: 'Camisa Casual Rayas',
      description: 'Camisa casual con rayas clásicas. Estilo atemporal.',
      price: 24.99,
      category: 'Casual',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Azul', 'Gris']),
      stock: 60,
      featured: false,
      images: JSON.stringify(['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'])
    },
  ]

  console.log('📦 Creando productos...')
  
  for (const product of products) {
    await prisma.product.create({
      data: product
    })
    console.log(`✅ Creado: ${product.name}`)
  }

  console.log('✨ Seed completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })