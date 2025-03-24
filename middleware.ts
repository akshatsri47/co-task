import { type NextRequest } from 'next/server'
import { updateSession } from './utils/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
    matcher: ["/protected", "/signin", "/admin/:path*"],
  }