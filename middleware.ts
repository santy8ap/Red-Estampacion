import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN"
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

    // Si es ruta de admin y no es admin, redirigir a home
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
        const isCheckoutRoute = req.nextUrl.pathname.startsWith("/checkout")
        const isOrdersRoute = req.nextUrl.pathname.startsWith("/mis-ordenes")

        // Rutas que requieren autenticación
        if (isAdminRoute || isCheckoutRoute || isOrdersRoute) {
          return !!token // true si hay token, false si no
        }

        return true // Permitir acceso a otras rutas
      },
    },
    pages: {
      signIn: '/auth/signin', // Página personalizada de login
    }
  }
)

export const config = {
  matcher: [
    "/admin/:path*", 
    "/checkout/:path*", 
    "/mis-ordenes/:path*"
  ]
}