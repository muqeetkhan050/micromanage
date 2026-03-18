import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  session: { strategy: 'jwt' },

  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),

    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          await connectDB()

          const user = (await User.findOne({
            email: credentials.email,
          }).lean()) as any

          if (!user || !user.password) return null

          const valid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )
          if (!valid) return null

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image ?? null,
          }
        } catch (err) {
          console.error('authorize error:', err)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, trigger, account }) {
      // Always re-fetch user from DB to get latest organisationId and role
      if (token.email) {
        try {
          await connectDB()
          const dbUser = (await User.findOne({
            email: token.email,
          }).lean()) as any

          if (dbUser) {
            token.userId = dbUser._id.toString()
            token.role = dbUser.role ?? 'MEMBER'
            token.organisationId = dbUser.organisationId?.toString() ?? null
          }
        } catch (err) {
          console.error('jwt callback error:', err)
        }
      }

      if (account?.provider === 'github') {
        token.githubAccessToken = account.access_token
      }

      return token
    },

    async session({ session, token }) {
      session.user.id = token.userId as string
      session.user.role = token.role as string
      session.user.organisationId = token.organisationId as string | null
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
})
