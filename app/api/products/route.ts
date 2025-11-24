import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

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

    if (category) where.category = category
    if (color) where.colors = { has: color }
    if (size) where.sizes = { has: size }
    if (featured === 'true') where.featured = true
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(products)
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
      featured
    } = body

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        images,
        category,
        sizes,
        colors,
        stock: parseInt(stock),
        featured: featured || false
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}