'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { toast } from 'sonner'

type CartItem = {
    productId: string
    name: string
    price: number
    quantity: number
    size: string
    color: string
    image: string
    stock?: number
}

type CartContextType = {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (productId: string, size: string, color: string) => void
    updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
    clearCart: () => void
    total: number
    isLoaded: boolean
    itemCount: number
    applyCoupon: (code: string) => Promise<boolean>
    removeCoupon: () => void
    totalWithDiscount: number
    discountAmount: number
    couponCode: string | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [couponCode, setCouponCode] = useState<string | null>(null)
    const [discountPercentage, setDiscountPercentage] = useState(0)

    // Solo cargar del localStorage en el cliente
    useEffect(() => {
        const loadCart = () => {
            try {
                const saved = localStorage.getItem('cart')
                const savedCoupon = localStorage.getItem('cartCoupon')
                if (saved) {
                    setItems(JSON.parse(saved))
                }
                if (savedCoupon) {
                    const { code, discount } = JSON.parse(savedCoupon)
                    setCouponCode(code)
                    setDiscountPercentage(discount)
                }
            } catch (error) {
                console.error('Error loading cart:', error)
            } finally {
                setIsLoaded(true)
            }
        }

        loadCart()
    }, [])

    // Guardar en localStorage solo después de cargar
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('cart', JSON.stringify(items))
            } catch (error) {
                console.error('Error saving cart:', error)
            }
        }
    }, [items, isLoaded])

    const addItem = useCallback((item: CartItem) => {
        setItems(current => {
            // Validar stock disponible
            if (item.stock && item.stock <= 0) {
                toast.error('Producto sin stock', {
                    description: `${item.name} no está disponible en este momento`,
                    icon: '❌',
                })
                return current
            }

            const existing = current.find(
                i => i.productId === item.productId &&
                    i.size === item.size &&
                    i.color === item.color
            )

            if (existing) {
                const newQuantity = existing.quantity + item.quantity
                const maxQuantity = item.stock || 999
                
                // No permitir exceder el stock
                if (newQuantity > maxQuantity) {
                    toast.warning('Stock limitado', {
                        description: `Solo hay ${maxQuantity} unidades disponibles`,
                        icon: '⚠️',
                    })
                    return current.map(i =>
                        i.productId === item.productId &&
                            i.size === item.size &&
                            i.color === item.color
                            ? { ...i, quantity: maxQuantity }
                            : i
                    )
                }

                toast.success('Carrito actualizado', {
                    description: `${item.name} (${item.size}/${item.color}) cantidad: ${newQuantity}`,
                    icon: '🛒',
                })

                return current.map(i =>
                    i.productId === item.productId &&
                        i.size === item.size &&
                        i.color === item.color
                        ? { ...i, quantity: newQuantity }
                        : i
                )
            }

            toast.success('¡Agregado al carrito!', {
                description: `${item.name} (${item.size}/${item.color}) x${item.quantity}`,
                icon: '✨',
            })

            return [...current, item]
        })
    }, [])

    const removeItem = useCallback((productId: string, size: string, color: string) => {
        setItems(current => {
            const item = current.find(
                i => i.productId === productId && i.size === size && i.color === color
            )
            
            if (item) {
                toast.success('Producto removido', {
                    description: `${item.name} fue eliminado del carrito`,
                    icon: '🗑️',
                })
            }

            return current.filter(
                i => !(i.productId === productId && i.size === size && i.color === color)
            )
        })
    }, [])

    const updateQuantity = useCallback((
        productId: string,
        size: string,
        color: string,
        quantity: number
    ) => {
        if (quantity <= 0) {
            removeItem(productId, size, color)
            return
        }

        setItems(current =>
            current.map(i => {
                if (i.productId === productId && i.size === size && i.color === color) {
                    // Respetar stock máximo
                    const maxQuantity = i.stock || 999
                    const finalQuantity = Math.min(quantity, maxQuantity)
                    return { ...i, quantity: finalQuantity }
                }
                return i
            })
        )
    }, [removeItem])

    const clearCart = useCallback(() => {
        setItems([])
        setCouponCode(null)
        setDiscountPercentage(0)
        localStorage.removeItem('cartCoupon')
        toast.success('Carrito vaciado', {
            icon: '🧹',
        })
    }, [])

    const applyCoupon = useCallback(async (code: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, total })
            })
            
            if (response.ok) {
                const { discount } = await response.json()
                setCouponCode(code)
                setDiscountPercentage(discount)
                localStorage.setItem('cartCoupon', JSON.stringify({ code, discount }))
                
                toast.success('¡Cupón aplicado!', {
                    description: `Descuento: ${discount}%`,
                    icon: '🎉',
                })
                return true
            } else {
                const data = await response.json()
                toast.error('Cupón inválido', {
                    description: data.message || 'El código no es válido',
                    icon: '❌',
                })
            }
            return false
        } catch (error) {
            console.error('Error validating coupon:', error)
            toast.error('Error al validar cupón', {
                description: 'Intenta de nuevo más tarde',
                icon: '❌',
            })
            return false
        }
    }, [])

    const removeCoupon = useCallback(() => {
        setCouponCode(null)
        setDiscountPercentage(0)
        localStorage.removeItem('cartCoupon')
        toast.info('Cupón removido', {
            icon: '✂️',
        })
    }, [])

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discountAmount = (total * discountPercentage) / 100
    const totalWithDiscount = total - discountAmount
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                total,
                isLoaded,
                itemCount,
                applyCoupon,
                removeCoupon,
                totalWithDiscount,
                discountAmount,
                couponCode
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within CartProvider')
    }
    return context
}