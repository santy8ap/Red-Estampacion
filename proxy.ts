import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  // Por ahora solo logging, sin bloquear
  console.log('Proxy ejecutado para:', request.nextUrl.pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/mis-ordenes/:path*"
  ]
}