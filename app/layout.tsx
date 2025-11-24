import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import SessionProvider from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Red Estampación - Tienda de Camisas',
  description: 'Las mejores camisas estampadas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}