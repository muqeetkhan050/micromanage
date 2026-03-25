import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string | null
      role: string
      organisationId: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId: string
    role: string
    organisationId: string | null
  }
}
