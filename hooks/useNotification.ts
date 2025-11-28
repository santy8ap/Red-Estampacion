'use client'

import { toast } from 'sonner'

type NotificationOptions = {
    duration?: number
    description?: string
}

export const useNotification = () => {
    const success = (title: string, options?: NotificationOptions) => {
        toast.success(title, {
            description: options?.description,
            duration: options?.duration || 4000,
            icon: '✨',
        })
    }

    const error = (title: string, options?: NotificationOptions) => {
        toast.error(title, {
            description: options?.description,
            duration: options?.duration || 4000,
            icon: '❌',
        })
    }

    const warning = (title: string, options?: NotificationOptions) => {
        toast.warning(title, {
            description: options?.description,
            duration: options?.duration || 4000,
            icon: '⚠️',
        })
    }

    const info = (title: string, options?: NotificationOptions) => {
        toast.info(title, {
            description: options?.description,
            duration: options?.duration || 4000,
            icon: 'ℹ️',
        })
    }

    const addToCart = (productName: string, quantity: number = 1) => {
        toast.success('¡Agregado al carrito!', {
            description: `${productName} x${quantity}`,
            duration: 3000,
            icon: '🛒',
        })
    }

    const removeFromCart = (productName: string) => {
        toast.success('Producto removido', {
            description: productName,
            duration: 2500,
            icon: '🗑️',
        })
    }

    const addToWishlist = (productName: string) => {
        toast.success('¡Agregado a Favoritos!', {
            description: productName,
            duration: 2500,
            icon: '❤️',
        })
    }

    const removeFromWishlist = (productName: string) => {
        toast.success('Removido de Favoritos', {
            description: productName,
            duration: 2500,
            icon: '💔',
        })
    }

    const couponApplied = (discount: number) => {
        toast.success('¡Cupón aplicado!', {
            description: `Descuento: ${discount}%`,
            duration: 3000,
            icon: '🎉',
        })
    }

    const checkoutSuccess = (orderNumber?: string) => {
        toast.success('¡Compra completada!', {
            description: orderNumber ? `Orden: ${orderNumber}` : undefined,
            duration: 5000,
            icon: '🎊',
        })
    }

    return {
        success,
        error,
        warning,
        info,
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        couponApplied,
        checkoutSuccess,
    }
}
