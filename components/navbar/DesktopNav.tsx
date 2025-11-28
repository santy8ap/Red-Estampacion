'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Settings, Home, ShoppingCart, Grid } from 'lucide-react'

interface DesktopNavProps {
    session: any
    t: (key: string) => string
}

export default function DesktopNav({ session, t }: DesktopNavProps) {
    const pathname = usePathname()

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
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="relative group"
                    >
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${active
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
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-semibold text-sm ${isActive('/admin')
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
    )
}
