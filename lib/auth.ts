
import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,

  providers: [
    ...authConfig.providers,

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
          }).select('+password').lean()) as any

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
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github' || account?.provider === 'google') {
        try {
          await connectDB()
          const existing = await User.findOne({ email: user.email })
          if (!existing) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image ?? null,
              provider: account.provider,
              role: 'MEMBER',
              organisationId: null,
            })
          }
        } catch (err) {
          console.error('signIn callback error:', err)
          return false
        }
      }
      return true
    },

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

      if (account?.provider === 'google') {
        token.googleAccessToken = account.access_token
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
})