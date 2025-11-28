'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useLanguage } from '@/context/LanguageContext'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShoppingCart,
    Heart,
    User,
    LogOut,
    Settings,
    Package,
    Menu,
    X,
    Globe,
    Home,
    Grid,
} from 'lucide-react'

export default function Navbar() {
    const { data: session } = useSession()
    const { items: cartItems, isLoaded: cartLoaded } = useCart()
    const { items: wishlistItems, isLoaded: wishlistLoaded } = useWishlist()
    const { locale, setLocale, t, isLoaded: langLoaded } = useLanguage()
    const pathname = usePathname()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Obtener la imagen del usuario con mejor fallback
    const getUserImage = () => {
        if (session?.user?.image) {
            // Si viene de Google, asegurar que sea accesible
            if (session.user.image.includes('googleusercontent')) {
                return session.user.image
            }
            return session.user.image
        }
        return null
    }

    const cartItemsCount = cartLoaded ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0
    const wishlistCount = wishlistLoaded ? wishlistItems.length : 0

    // Detectar scroll para cambiar estilo del navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Cerrar menú al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Cerrar mobile menu al cambiar ruta
    useEffect(() => {
        return () => {
            setShowMobileMenu(false)
        }
    }, [pathname])

    const toggleLocale = () => {
        setLocale(locale === 'es' ? 'en' : 'es')
    }

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    const navLinks = [
        { href: '/', label: t('nav.home'), icon: Home },
        { href: '/productos', label: t('nav.products'), icon: ShoppingCart },
        { href: '/colecciones', label: t('nav.collections'), icon: Grid },
    ]

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-gray-900/95 backdrop-blur-lg shadow-2xl'
                    : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">R</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent group-hover:from-red-400 group-hover:to-red-500 transition-all duration-300">
                                Red Estampación
                            </span>
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                        {navLinks.map((link) => {
                            const active = isActive(link.href)
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative group"
                                >
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                                        active 
                                            ? 'text-red-400 bg-red-500/10' 
                                            : 'text-white/80 hover:text-white hover:bg-white/5'
                                    }`}>
                                        <link.icon className="w-4 h-4" />
                                        <span className="font-medium hidden lg:inline text-sm">
                                            {link.label}
                                        </span>
                                    </div>
                                    {active && (
                                        <motion.div
                                            layoutId="active-nav"
                                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </Link>
                            )
                        })}

                        {session?.user?.role === 'ADMIN' && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/admin"
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-sm ${
                                        isActive('/admin')
                                            ? 'bg-red-700 text-white shadow-lg'
                                            : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/50'
                                    }`}
                                >
                                    <Settings className="w-4 h-4" />
                                    <span className="hidden lg:inline">Admin</span>
                                </Link>
                            </motion.div>
                        )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-3">
                        {/* Language Toggle - Desktop */}
                        {langLoaded && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleLocale}
                                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition backdrop-blur-sm"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-sm font-bold">{locale.toUpperCase()}</span>
                            </motion.button>
                        )}

                        {/* Wishlist */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/wishlist" className="relative">
                                <div className="p-2 hover:bg-white/10 rounded-lg transition">
                                    <motion.div
                                        whileHover={{ rotate: 10 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Heart className="w-6 h-6 text-red-400 group-hover:text-red-300 transition" />
                                    </motion.div>
                                </div>
                                {wishlistLoaded && wishlistCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0, y: -10 }}
                                        animate={{ scale: 1, y: 0 }}
                                        exit={{ scale: 0, y: -10 }}
                                        className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-gray-900 shadow-lg pointer-events-none"
                                    >
                                        {wishlistCount > 99 ? '99+' : wishlistCount}
                                    </motion.span>
                                )}
                            </Link>
                        </motion.div>

                        {/* Cart */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/carrito" className="relative group">
                                <div className="p-2 hover:bg-white/10 rounded-lg transition">
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <ShoppingCart className="w-6 h-6 text-red-400 group-hover:text-red-300 transition" />
                                    </motion.div>
                                </div>
                                {cartLoaded && cartItemsCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0, y: -10 }}
                                        animate={{ scale: 1, y: 0 }}
                                        exit={{ scale: 0, y: -10 }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-gray-900 shadow-lg pointer-events-none"
                                    >
                                        {cartItemsCount > 99 ? '99+' : cartItemsCount}
                                    </motion.span>
                                )}
                            </Link>
                        </motion.div>

                        {/* User menu - Desktop */}
                        <div className="hidden md:block">
                            {session ? (
                                <div className="relative" ref={menuRef}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center space-x-2 hover:opacity-80 transition focus:outline-none group"
                                        aria-label="User menu"
                                        aria-expanded={showUserMenu}
                                    >
                                        {getUserImage() ? (
                                            <motion.img
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                                src={getUserImage() || ''}
                                                alt={session.user.name || 'User'}
                                                className="w-9 h-9 rounded-full border-2 border-red-500 ring-2 ring-red-500/20 object-cover group-hover:ring-red-500/40 transition"
                                                crossOrigin="anonymous"
                                            />
                                        ) : (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold ring-2 ring-red-500/20 group-hover:ring-red-500/40 transition shadow-md"
                                            >
                                                {session.user.name?.charAt(0).toUpperCase() || 'U'}
                                            </motion.div>
                                        )}
                                        <div className="hidden lg:block text-left">
                                            <p className="text-sm font-medium text-white">
                                                {session.user.name?.split(' ')[0] || 'Usuario'}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {session.user.role === 'ADMIN' ? 'Admin' : 'Usuario'}
                                            </p>
                                        </div>
                                        <motion.svg
                                            animate={{ rotate: showUserMenu ? 180 : 0 }}
                                            className="w-4 h-4 text-gray-400 group-hover:text-gray-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </motion.svg>
                                    </motion.button>

                                    <AnimatePresence>
                                        {showUserMenu && (
                                            <>
                                                {/* Backdrop */}
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setShowUserMenu(false)}
                                                />

                                                {/* Dropdown */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 mt-3 w-72 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl py-2 z-20 border border-gray-200 overflow-hidden backdrop-blur-md"
                                                >
                                                    {/* User Info */}
                                                    <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 via-red-50 to-pink-50">
                                                        <div className="flex items-center gap-3">
                                                            {getUserImage() ? (
                                                                <motion.img
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    src={getUserImage() || ''}
                                                                    alt={session.user.name || 'User'}
                                                                    className="w-12 h-12 rounded-full border-2 border-red-500 object-cover"
                                                                    crossOrigin="anonymous"
                                                                />
                                                            ) : (
                                                                <motion.div 
                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-md"
                                                                >
                                                                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                                                                </motion.div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                                    {session.user.name || 'Usuario'}
                                                                </p>
                                                                <p className="text-xs text-gray-600 truncate">
                                                                    {session.user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {session.user.role === 'ADMIN' && (
                                                            <motion.span
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="inline-block mt-3 px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full border border-red-200"
                                                            >
                                                                {locale === 'es' ? 'Administrador' : 'Administrator'}
                                                            </motion.span>
                                                        )}
                                                    </div>

                                                    {/* Menu Items */}
                                                    <div className="py-2">
                                                        <Link
                                                            href="/mis-ordenes"
                                                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors group"
                                                            onClick={() => setShowUserMenu(false)}
                                                        >
                                                            <Package className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-500 transition-colors" />
                                                            <span className="group-hover:text-red-600 font-medium">
                                                                {t('nav.myOrders')}
                                                            </span>
                                                        </Link>

                                                        {session.user.role === 'ADMIN' && (
                                                            <Link
                                                                href="/admin"
                                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors group"
                                                                onClick={() => setShowUserMenu(false)}
                                                            >
                                                                <Settings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-500 transition-colors" />
                                                                <span className="group-hover:text-red-600 font-medium">
                                                                    {locale === 'es' ? 'Panel Admin' : 'Admin Panel'}
                                                                </span>
                                                            </Link>
                                                        )}

                                                        <div className="border-t border-gray-200 my-2"></div>

                                                        <motion.button
                                                            whileHover={{ scale: 1.01 }}
                                                            whileTap={{ scale: 0.99 }}
                                                            onClick={() => {
                                                                setShowUserMenu(false)
                                                                signOut({ callbackUrl: '/' })
                                                            }}
                                                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                                                        >
                                                            <LogOut className="w-4 h-4 mr-3 group-hover:text-red-700 transition-colors" />
                                                            <span className="group-hover:text-red-700 font-medium">
                                                                {t('nav.signOut')}
                                                            </span>
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => signIn('google', { callbackUrl: '/' })}
                                    className="bg-white text-gray-900 px-4 lg:px-6 py-2 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl text-sm lg:text-base"
                                >
                                    <User className="w-4 h-4" />
                                    {t('nav.signIn')}
                                </motion.button>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
                        >
                            <AnimatePresence mode="wait">
                                {showMobileMenu ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="w-6 h-6" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden border-t border-gray-700 overflow-hidden"
                        >
                            <div className="py-4 space-y-3 px-4">
                                {/* User info mobile */}
                                {session && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="px-4 py-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg border border-red-500/20 flex items-center gap-3"
                                    >
                                        {getUserImage() ? (
                                            <motion.img
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                src={getUserImage() || ''}
                                                alt={session.user.name || 'User'}
                                                className="w-12 h-12 rounded-full border-2 border-red-500 object-cover"
                                                crossOrigin="anonymous"
                                            />
                                        ) : (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg"
                                            >
                                                {session.user.name?.charAt(0).toUpperCase() || 'U'}
                                            </motion.div>
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-white">
                                                {session.user.name || 'Usuario'}
                                            </p>
                                            <p className="text-xs text-gray-300">{session.user.email}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Navigation links */}
                                <div className="space-y-2">
                                    {navLinks.map((link, idx) => {
                                        const active = isActive(link.href)
                                        return (
                                            <motion.div
                                                key={link.href}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                                        active
                                                            ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                                                            : 'hover:bg-white/5 text-white/80 hover:text-white'
                                                    }`}
                                                    onClick={() => setShowMobileMenu(false)}
                                                >
                                                    <link.icon className="w-5 h-5" />
                                                    <span className="font-medium">{link.label}</span>
                                                </Link>
                                            </motion.div>
                                        )
                                    })}
                                </div>

                                {/* My Orders */}
                                {session && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <Link
                                            href="/mis-ordenes"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 rounded-lg transition text-white/80 hover:text-white"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            <Package className="w-5 h-5 text-red-400" />
                                            <span className="font-medium">{t('nav.myOrders')}</span>
                                        </Link>
                                    </motion.div>
                                )}

                                {/* Admin Panel */}
                                {session?.user?.role === 'ADMIN' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition font-medium text-white shadow-lg"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            <Settings className="w-5 h-5" />
                                            <span>{locale === 'es' ? 'Panel Admin' : 'Admin Panel'}</span>
                                        </Link>
                                    </motion.div>
                                )}

                                {/* Language toggle mobile */}
                                {langLoaded && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.25 }}
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => {
                                                toggleLocale()
                                                setShowMobileMenu(false)
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 rounded-lg transition text-white/80 hover:text-white"
                                        >
                                            <Globe className="w-5 h-5 text-red-400" />
                                            <span className="font-medium">
                                                {locale === 'es' ? 'English' : 'Español'}
                                            </span>
                                        </motion.button>
                                    </motion.div>
                                )}

                                {/* Auth button mobile */}
                                <div className="pt-2 border-t border-gray-700">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {session ? (
                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => {
                                                    setShowMobileMenu(false)
                                                    signOut({ callbackUrl: '/' })
                                                }}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition font-medium"
                                            >
                                                <LogOut className="w-5 h-5" />
                                                <span>{t('nav.signOut')}</span>
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => {
                                                    setShowMobileMenu(false)
                                                    signIn('google', { callbackUrl: '/' })
                                                }}
                                                className="flex items-center gap-3 w-full px-4 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg transition font-semibold"
                                            >
                                                <User className="w-5 h-5" />
                                                <span>{t('nav.signIn')}</span>
                                            </motion.button>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    )
}