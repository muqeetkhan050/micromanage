import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const session = req.auth
  const pathname = req.nextUrl.pathname

  const publicPaths = ['/', '/login', '/signup', '/invite']
  const isPublic = publicPaths.some((p) => pathname === p || (p !== '/' && pathname.startsWith(p)))

  // Not logged in — only allow public pages
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Logged in but no org — redirect to onboarding
  if (
    session &&
    !session.user.organisationId &&
    !pathname.startsWith('/dashboard/onboarding') &&
    !pathname.startsWith('/invite') &&
    !pathname.startsWith('/api') &&
    !isPublic
  ) {
    return NextResponse.redirect(new URL('/dashboard/onboarding', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth|api/signup).*)'],
}
