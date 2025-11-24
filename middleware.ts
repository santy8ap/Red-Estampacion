import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Por ahora solo logging, sin bloquear
  console.log('Middleware ejecutado para:', request.nextUrl.pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/mis-ordenes/:path*"
  ]
}