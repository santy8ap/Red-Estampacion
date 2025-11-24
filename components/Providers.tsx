'use client'

import { Toaster } from 'sonner'
import { CartProvider } from '@/context/CartContext'
import { LanguageProvider } from '@/context/LanguageContext'
import SessionProvider from './SessionProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LanguageProvider>
                <CartProvider>
                    {children}
                    <Toaster
                        position="top-right"
                        richColors
                        closeButton
                        expand={false}
                        theme="light"
                        toastOptions={{
                            style: {
                                background: 'white',
                                border: '1px solid #e5e7eb',
                            },
                            duration: 3000,
                        }}
                    />
                </CartProvider>
            </LanguageProvider>
        </SessionProvider>
    )
}