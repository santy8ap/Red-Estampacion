'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Locale = 'es' | 'en'

type LanguageContextType = {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: string) => string
    isLoaded: boolean
}

const translations = {
    es: {
        nav: {
            home: 'Inicio',
            products: 'Productos',
            collections: 'Colecciones',
            cart: 'Carrito',
            admin: 'Admin',
            signIn: 'Iniciar Sesión',
            myOrders: 'Mis Órdenes',
            signOut: 'Cerrar Sesión'
        },
        home: {
            hero: {
                badge: 'Nueva Colección 2024',
                title: 'Red Estampación',
                subtitle: 'Las mejores camisas estampadas con diseños únicos.',
                description: 'Calidad premium y estilo incomparable.',
                cta: 'Ver Productos',
                explore: 'Explorar Categorías'
            },
            features: {
                shipping: {
                    title: 'Envío Gratis',
                    desc: 'En compras mayores a $50'
                },
                secure: {
                    title: 'Compra Segura',
                    desc: '100% protegido'
                },
                price: {
                    title: 'Mejor Precio',
                    desc: 'Garantizado'
                },
                quality: {
                    title: 'Calidad Premium',
                    desc: 'Productos seleccionados'
                }
            },
            featured: {
                title: 'Productos Destacados',
                subtitle: 'Descubre nuestra selección exclusiva de camisas más populares'
            },
            categories: {
                title: 'Categorías',
                subtitle: 'Encuentra el estilo perfecto para ti'
            },
            cta: {
                title: '¿Listo para renovar tu estilo?',
                subtitle: 'Explora nuestra colección completa de camisas premium',
                button: 'Explorar Ahora'
            }
        },
        products: {
            featured: 'Destacado',
            lastUnits: 'Últimas',
            viewDetails: 'Ver Detalles',
            addToCart: 'Agregar al Carrito'
        },
        common: {
            loading: 'Cargando...',
            noProducts: 'No hay productos disponibles'
        }
    },
    en: {
        nav: {
            home: 'Home',
            products: 'Products',
            collections: 'Collections',
            cart: 'Cart',
            admin: 'Admin',
            signIn: 'Sign In',
            myOrders: 'My Orders',
            signOut: 'Sign Out'
        },
        home: {
            hero: {
                badge: 'New Collection 2024',
                title: 'Red Estampación',
                subtitle: 'The best printed shirts with unique designs.',
                description: 'Premium quality and incomparable style.',
                cta: 'View Products',
                explore: 'Explore Categories'
            },
            features: {
                shipping: {
                    title: 'Free Shipping',
                    desc: 'On orders over $50'
                },
                secure: {
                    title: 'Secure Purchase',
                    desc: '100% protected'
                },
                price: {
                    title: 'Best Price',
                    desc: 'Guaranteed'
                },
                quality: {
                    title: 'Premium Quality',
                    desc: 'Selected products'
                }
            },
            featured: {
                title: 'Featured Products',
                subtitle: 'Discover our exclusive selection of most popular shirts'
            },
            categories: {
                title: 'Categories',
                subtitle: 'Find the perfect style for you'
            },
            cta: {
                title: 'Ready to renew your style?',
                subtitle: 'Explore our complete collection of premium shirts',
                button: 'Explore Now'
            }
        },
        products: {
            featured: 'Featured',
            lastUnits: 'Last',
            viewDetails: 'View Details',
            addToCart: 'Add to Cart'
        },
        common: {
            loading: 'Loading...',
            noProducts: 'No products available'
        }
    }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('es')
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const loadLocale = () => {
            try {
                const savedLocale = localStorage.getItem('locale') as Locale
                if (savedLocale && (savedLocale === 'es' || savedLocale === 'en')) {
                    setLocaleState(savedLocale)
                }
            } catch (error) {
                console.error('Error loading locale:', error)
            } finally {
                setIsLoaded(true)
            }
        }

        loadLocale()
    }, [])

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale)
        try {
            localStorage.setItem('locale', newLocale)
        } catch (error) {
            console.error('Error saving locale:', error)
        }
    }

    const t = (key: string): string => {
        const keys = key.split('.')
        let value: any = translations[locale]

        for (const k of keys) {
            value = value?.[k]
        }

        return value || key
    }

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t, isLoaded }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider')
    }
    return context
}