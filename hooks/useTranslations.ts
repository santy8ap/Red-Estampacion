'use client'

import { useState, useEffect } from 'react'

const translations = {
  es: {
    common: {
      loading: "Cargando...",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      search: "Buscar",
      filter: "Filtrar",
      close: "Cerrar"
    },
    nav: {
      home: "Inicio",
      products: "Productos",
      categories: "Categorías",
      cart: "Carrito",
      admin: "Admin",
      signIn: "Iniciar Sesión",
      signOut: "Cerrar Sesión",
      myOrders: "Mis Órdenes"
    },
    notifications: {
      success: {
        productAdded: "Producto agregado al carrito",
        productUpdated: "Producto actualizado exitosamente",
        productDeleted: "Producto eliminado exitosamente",
        orderCreated: "Orden creada exitosamente"
      },
      error: {
        generic: "Ocurrió un error",
        unauthorized: "No autorizado",
        notFound: "No encontrado"
      }
    }
  },
  en: {
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      search: "Search",
      filter: "Filter",
      close: "Close"
    },
    nav: {
      home: "Home",
      products: "Products",
      categories: "Categories",
      cart: "Cart",
      admin: "Admin",
      signIn: "Sign In",
      signOut: "Sign Out",
      myOrders: "My Orders"
    },
    notifications: {
      success: {
        productAdded: "Product added to cart",
        productUpdated: "Product updated successfully",
        productDeleted: "Product deleted successfully",
        orderCreated: "Order created successfully"
      },
      error: {
        generic: "An error occurred",
        unauthorized: "Unauthorized",
        notFound: "Not found"
      }
    }
  }
}

export function useTranslations() {
  const [locale, setLocale] = useState<'es' | 'en'>('es')

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as 'es' | 'en'
    if (savedLocale) {
      setLocale(savedLocale)
    }
  }, [])

  const changeLocale = (newLocale: 'es' | 'en') => {
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[locale]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  return { t, locale, changeLocale }
}