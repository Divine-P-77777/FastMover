import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { serviceSupabase } from "@/supabase/serviceClient";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Driver",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password", placeholder: "Password" }
      },
  async authorize(credentials) {
  if (!credentials?.username || !credentials?.password) return null;

  const { data, error } = await serviceSupabase
    .from("partner_credentials")
    .select("id, driver_id, username, password")
    .eq("username", credentials.username)
    .single();

  if (error || !data) return null;

  // bcrypt recommended in prod
  if (credentials.password !== data.password) return null;

  return {
    id: data.driver_id,
    credential_id: data.id,
    username: data.username,
    type: "driver",
  };
}

    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
    updateAge: 30 * 60
  },
  pages: {
    signIn: "/driver/login",
    error: "/driver/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.driver_id = user.id;
        token.username = user.username;
        token.credential_id = user.credential_id;
        token.type = user.type;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = {
        driver_id: token.driver_id,
        username: token.username,
        credential_id: token.credential_id,
        type: token.type,
      };
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
