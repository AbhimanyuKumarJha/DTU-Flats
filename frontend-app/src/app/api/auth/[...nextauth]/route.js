import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../lib/dbConnect";
import Admin from "../../../lib/adminmodel";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/Login",
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      await dbConnect();

      const admin = await Admin.findOne({ email: user.email });

      if (admin) {
        return true;
      } else {
        throw new Error("PermissionDenied");
      }
    },
    async session({ session, token, user }) {
      if (token?.isAdmin) {
        session.user.isAdmin = true;
      } else {
        session.user.isAdmin = false;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
  },
  events: {},
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
