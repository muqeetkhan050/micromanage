import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

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
    !pathname.startsWith('/onboarding') &&
    !pathname.startsWith('/invite') &&
    !pathname.startsWith('/api') &&
    !isPublic
  ) {
    return NextResponse.redirect(new URL('/onboarding', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
