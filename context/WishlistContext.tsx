'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type WishlistItem = {
    productId: string
    name: string
    price: number
    image: string
}

type WishlistContextType = {
    items: WishlistItem[]
    addItem: (item: WishlistItem) => void
    removeItem: (productId: string) => void
    isFavorite: (productId: string) => boolean
    isLoaded: boolean
    itemCount: number
    clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Cargar del localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('wishlist')
            if (saved) {
                setItems(JSON.parse(saved))
            }
        } catch (error) {
            console.error('Error loading wishlist:', error)
        } finally {
            setIsLoaded(true)
        }
    }, [])

    // Guardar en localStorage
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem('wishlist', JSON.stringify(items))
            } catch (error) {
                console.error('Error saving wishlist:', error)
            }
        }
    }, [items, isLoaded])

    const addItem = (item: WishlistItem) => {
        setItems(current => {
            const exists = current.find(i => i.productId === item.productId)
            if (exists) return current
            return [...current, item]
        })
    }

    const removeItem = (productId: string) => {
        setItems(current =>
            current.filter(i => i.productId !== productId)
        )
    }

    const isFavorite = (productId: string) => {
        return items.some(i => i.productId === productId)
    }

    const clearWishlist = () => {
        setItems([])
    }

    return (
        <WishlistContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                isFavorite,
                isLoaded,
                itemCount: items.length,
                clearWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    const context = useContext(WishlistContext)
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider')
    }
    return context
}
