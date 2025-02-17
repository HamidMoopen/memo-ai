import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password')
        }

        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })

        if (error) {
          throw new Error(error.message)
        }

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.user_metadata.full_name,
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          console.log('Google sign in attempt for:', user.email);
          
          const { data: existingUser, error: queryError } = await supabase
            .from('users')
            .select()
            .eq('email', user.email)
            .single();

          console.log('Existing user check:', { existingUser, queryError });

          if (queryError && queryError.code !== 'PGRST116') {
            console.error('Error checking existing user:', queryError);
            return false;
          }

          if (!existingUser) {
            console.log('Creating new user for:', user.email);
            const { data: newUser, error: createError } = await supabase
              .from('users')
              .insert([
                {
                  email: user.email,
                  full_name: user.name,
                }
              ])
              .select()
              .single();

            console.log('New user creation result:', { newUser, createError });

            if (createError) {
              console.error('Error creating user:', createError);
              return false;
            }
          }

          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // Fetch user data from Supabase and add to session
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (userData) {
          session.user.email = userData.email;
          session.user.name = userData.full_name;
          // Add any other user data you need in the session
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    newUser: '/signup',
  }
});

export { handler as GET, handler as POST }; 