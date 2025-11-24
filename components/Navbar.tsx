'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShoppingCart,
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
    const { items: cartItems, isLoaded: cartLoaded } = useCart() // ⬅️ Renombrado a cartItems
    const { locale, setLocale, t, isLoaded: langLoaded } = useLanguage()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const cartItemsCount = cartLoaded ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0

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

    const toggleLocale = () => {
        setLocale(locale === 'es' ? 'en' : 'es')
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
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative group flex items-center gap-2 text-white/80 hover:text-white transition"
                            >
                                <link.icon className="w-4 h-4" />
                                <span className="font-medium">{link.label}</span>
                                <motion.span
                                    className="absolute -bottom-1 left-0 h-0.5 bg-red-500"
                                    initial={{ width: 0 }}
                                    whileHover={{ width: '100%' }}
                                    transition={{ duration: 0.3 }}
                                />
                            </Link>
                        ))}

                        {session?.user?.role === 'ADMIN' && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/admin"
                                    className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold flex items-center gap-2 shadow-lg hover:shadow-red-500/50"
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

                        {/* Cart */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/carrito" className="relative">
                                <div className="p-2 hover:bg-white/10 rounded-lg transition">
                                    <ShoppingCart className="w-6 h-6" />
                                    {cartLoaded && cartItemsCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-gray-900"
                                        >
                                            {cartItemsCount}
                                        </motion.span>
                                    )}
                                </div>
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
                                        className="flex items-center space-x-2 hover:opacity-80 transition focus:outline-none"
                                    >
                                        {session.user.image ? (
                                            <img
                                                src={session.user.image}
                                                alt={session.user.name || 'User'}
                                                className="w-9 h-9 rounded-full border-2 border-red-500 ring-2 ring-red-500/20 object-cover"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold ring-2 ring-red-500/20">
                                                {session.user.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="hidden lg:block text-left">
                                            <p className="text-sm font-medium text-white">
                                                {session.user.name?.split(' ')[0]}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {session.user.role === 'ADMIN' ? 'Admin' : 'Usuario'}
                                            </p>
                                        </div>
                                        <motion.svg
                                            animate={{ rotate: showUserMenu ? 180 : 0 }}
                                            className="w-4 h-4 text-gray-400"
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
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-20 border border-gray-200 overflow-hidden"
                                                >
                                                    {/* User Info */}
                                                    <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-red-50 to-red-100">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {session.user.name}
                                                        </p>
                                                        <p className="text-xs text-gray-600 truncate">
                                                            {session.user.email}
                                                        </p>
                                                        {session.user.role === 'ADMIN' && (
                                                            <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
                                                                {locale === 'es' ? 'Administrador' : 'Administrator'}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Menu Items */}
                                                    <div className="py-2">
                                                        <Link
                                                            href="/mis-ordenes"
                                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 transition group"
                                                            onClick={() => setShowUserMenu(false)}
                                                        >
                                                            <Package className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-500" />
                                                            <span className="group-hover:text-red-600">
                                                                {t('nav.myOrders')}
                                                            </span>
                                                        </Link>

                                                        {session.user.role === 'ADMIN' && (
                                                            <Link
                                                                href="/admin"
                                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 transition group"
                                                                onClick={() => setShowUserMenu(false)}
                                                            >
                                                                <Settings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-500" />
                                                                <span className="group-hover:text-red-600">
                                                                    {locale === 'es' ? 'Panel Admin' : 'Admin Panel'}
                                                                </span>
                                                            </Link>
                                                        )}

                                                        <div className="border-t border-gray-200 my-2"></div>

                                                        <button
                                                            onClick={() => {
                                                                setShowUserMenu(false)
                                                                signOut()
                                                            }}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition group"
                                                        >
                                                            <LogOut className="w-4 h-4 mr-3 group-hover:text-red-700" />
                                                            <span className="group-hover:text-red-700">
                                                                {t('nav.signOut')}
                                                            </span>
                                                        </button>
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
                                    onClick={() => signIn('google')}
                                    className="bg-white text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center gap-2 shadow-lg"
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
                            className="md:hidden border-t border-gray-700 overflow-hidden"
                        >
                            <div className="py-4 space-y-2">
                                {/* User info mobile */}
                                {session && (
                                    <div className="px-4 py-3 bg-white/5 rounded-lg mb-3 flex items-center gap-3">
                                        {session.user.image ? (
                                            <img
                                                src={session.user.image}
                                                alt={session.user.name || 'User'}
                                                className="w-12 h-12 rounded-full border-2 border-red-500"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                                                {session.user.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-white">
                                                {session.user.name}
                                            </p>
                                            <p className="text-xs text-gray-400">{session.user.email}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation links */}
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        <link.icon className="w-5 h-5 text-red-400" />
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                ))}

                                {session?.user?.role === 'ADMIN' && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        <Settings className="w-5 h-5" />
                                        <span className="font-medium">Panel Admin</span>
                                    </Link>
                                )}

                                {session && (
                                    <Link
                                        href="/mis-ordenes"
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        <Package className="w-5 h-5 text-red-400" />
                                        <span className="font-medium">{t('nav.myOrders')}</span>
                                    </Link>
                                )}

                                {/* Language toggle mobile */}
                                {langLoaded && (
                                    <button
                                        onClick={() => {
                                            toggleLocale()
                                            setShowMobileMenu(false)
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/10 rounded-lg transition"
                                    >
                                        <Globe className="w-5 h-5 text-red-400" />
                                        <span className="font-medium">
                                            {locale === 'es' ? 'English' : 'Español'}
                                        </span>
                                    </button>
                                )}

                                {/* Auth button mobile */}
                                <div className="pt-3 border-t border-gray-700">
                                    {session ? (
                                        <button
                                            onClick={() => {
                                                setShowMobileMenu(false)
                                                signOut()
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span className="font-medium">{t('nav.signOut')}</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setShowMobileMenu(false)
                                                signIn('google')
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg transition font-semibold"
                                        >
                                            <User className="w-5 h-5" />
                                            <span>{t('nav.signIn')}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    )
}