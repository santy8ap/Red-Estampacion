import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

// GET - Obtener un producto
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar producto (solo admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...body,
        price: body.price ? parseFloat(body.price) : undefined,
        stock: body.stock ? parseInt(body.stock) : undefined,
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar producto (solo admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Producto eliminado' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    )
  }
}