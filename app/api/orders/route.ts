import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

// GET - Listar órdenes del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const where: any = {}

    // Si no es admin, solo ver sus propias órdenes
    if (session.user.role !== 'ADMIN') {
      where.userId = session.user.id
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener órdenes' },
      { status: 500 }
    )
  }
}

// POST - Crear orden
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items, shipping } = body

    // Calcular total
    let total = 0
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })
      if (product) {
        total += product.price * item.quantity
      }
    }

    // Crear orden con items
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        shippingName: shipping.name,
        shippingEmail: shipping.email,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingZip: shipping.zip,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Actualizar stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error al crear orden' },
      { status: 500 }
    )
  }
}