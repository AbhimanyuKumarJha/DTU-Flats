import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  console.log("Middleware called");
  console.log(process.env.NEXTAUTH_SECRET);
  const path = request.nextUrl.pathname;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("token", token);

  // Public paths that don't require authentication
  const publicPaths = ["/Login"];

  // Check if the path is public
  const isPublicPath = publicPaths.includes(path);

  if (!token && !isPublicPath) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  if (token && isPublicPath) {
    // Redirect to home if trying to access login page with token
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/",
    "/Add/:path*",
    "/View/:path*",
    "/Update/:path*",
    "/Transaction/:path*",
    "/Login",
    "/New",
    "/New/:path*",
    "/Transaction/:path*",
    "/Edit/:path*",
    "/Dashboard",
    "/Dashboard/:path*",
  ],
};
