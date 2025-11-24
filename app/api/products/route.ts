import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

// Helper para parsear JSON
function parseJSON(str: string): any {
  try {
    return JSON.parse(str)
  } catch {
    return []
  }
}

// GET - Listar productos con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const color = searchParams.get('color')
    const size = searchParams.get('size')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    const where: any = { active: true }

    if (category && category !== 'Todas') where.category = category
    if (featured === 'true') where.featured = true
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }

    let products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    // Parsear los campos JSON y filtrar por color/talla
    let parsedProducts = products.map(p => ({
      ...p,
      images: parseJSON(p.images),
      sizes: parseJSON(p.sizes),
      colors: parseJSON(p.colors)
    }))

    // Filtrar por color si se especifica
    if (color && color !== 'Todos') {
      parsedProducts = parsedProducts.filter(p => 
        p.colors.includes(color)
      )
    }

    // Filtrar por talla si se especifica
    if (size && size !== 'Todas') {
      parsedProducts = parsedProducts.filter(p => 
        p.sizes.includes(size)
      )
    }

    return NextResponse.json(parsedProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

// POST - Crear producto (solo admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      price,
      images,
      category,
      sizes,
      colors,
      stock,
      featured,
      active
    } = body

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        images: typeof images === 'string' ? images : JSON.stringify(images),
        category,
        sizes: typeof sizes === 'string' ? sizes : JSON.stringify(sizes),
        colors: typeof colors === 'string' ? colors : JSON.stringify(colors),
        stock: parseInt(stock),
        featured: featured || false,
        active: active !== undefined ? active : true
      }
    })

    // Devolver con campos parseados
    return NextResponse.json({
      ...product,
      images: parseJSON(product.images),
      sizes: parseJSON(product.sizes),
      colors: parseJSON(product.colors)
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}