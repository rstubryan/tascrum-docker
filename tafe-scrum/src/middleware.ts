import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const headers = new Headers(req.headers);

  headers.set("x-current-path", path);

  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(path);

  const isProtectedRoute =
    path === "/dashboard" ||
    path.startsWith("/dashboard/") ||
    path.startsWith("/dashboard-");

  const cookieStore = await cookies();
  const user_info = cookieStore.get("user_info")?.value;
  const auth_token = cookieStore.get("auth_token")?.value;

  const isAuthenticated = user_info && auth_token;

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next({ headers });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_next/data|favicon.ico|.*\\.png$).*)",
    "/dashboard/:path*",
  ],
};
