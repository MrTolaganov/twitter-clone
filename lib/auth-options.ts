import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDatabase } from '@/lib/mongoose'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import User from '@/model/user.model'

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        fullName: { label: 'Full name', type: 'text' },
        email: { label: 'Email address', type: 'email' },
      },

      async authorize(credentials) {
        await connectDatabase()
        const user = await User.findOne({ email: credentials?.email })
        return user
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      await connectDatabase()

      const existedUser = await User.findOne({ email: session.user.email })
      if (!existedUser) {
        const newUser = await User.create({
          fullName: session.user.name,
          username: `@${session.user.email?.split('@').at(0)}`,
          email: session.user.email,
          profileImage: session.user.image,
        })

        session.currentUser = newUser
        return session
      }

      session.currentUser = existedUser
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/auth', signOut: '/auth' },
}
