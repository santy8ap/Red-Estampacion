import { NextRequest, NextResponse } from 'next/server'

// Cupones de ejemplo - En producción, esto vendría de una base de datos
const VALID_COUPONS: { [key: string]: { discount: number; minAmount: number; maxUses: number } } = {
    'WELCOME10': { discount: 10, minAmount: 0, maxUses: 999 },
    'SUMMER20': { discount: 20, minAmount: 50, maxUses: 999 },
    'FRIEND15': { discount: 15, minAmount: 30, maxUses: 999 },
    'VIP25': { discount: 25, minAmount: 100, maxUses: 100 },
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { code, total } = body

        if (!code || !total) {
            return NextResponse.json(
                { error: 'Código y total son requeridos' },
                { status: 400 }
            )
        }

        const coupon = VALID_COUPONS[code.toUpperCase()]

        if (!coupon) {
            return NextResponse.json(
                { error: 'Cupón no válido' },
                { status: 404 }
            )
        }

        if (total < coupon.minAmount) {
            return NextResponse.json(
                { error: `Compra mínima de $${coupon.minAmount} requerida` },
                { status: 400 }
            )
        }

        return NextResponse.json({
            code,
            discount: coupon.discount,
            message: `¡Descuento de ${coupon.discount}% aplicado!`
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al validar cupón' },
            { status: 500 }
        )
    }
}
