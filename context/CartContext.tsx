'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type CartItem = {
    productId: string
    name: string
    price: number
    quantity: number
    size: string
    color: string
    image: string
}

type CartContextType = {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (productId: string, size: string, color: string) => void
    updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
    clearCart: () => void
    total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    // Cargar carrito del localStorage
    useEffect(() => {
        const saved = localStorage.getItem('cart')
        if (saved) {
            setItems(JSON.parse(saved))
        }
    }, [])

    // Guardar carrito en localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items))
    }, [items])

    const addItem = (item: CartItem) => {
        setItems(current => {
            const existing = current.find(
                i => i.productId === item.productId &&
                    i.size === item.size &&
                    i.color === item.color
            )

            if (existing) {
                return current.map(i =>
                    i.productId === item.productId &&
                        i.size === item.size &&
                        i.color === item.color
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                )
            }

            return [...current, item]
        })
    }

    const removeItem = (productId: string, size: string, color: string) => {
        setItems(current =>
            current.filter(
                i => !(i.productId === productId && i.size === size && i.color === color)
            )
        )
    }

    const updateQuantity = (
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
            current.map(i =>
                i.productId === productId && i.size === size && i.color === color
                    ? { ...i, quantity }
                    : i
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                total
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