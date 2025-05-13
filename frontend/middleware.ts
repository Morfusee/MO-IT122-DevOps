import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/", "/chat", "/quiz", "/reviewer"];
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(
    `/${path.split("/").filter(Boolean)[0]}`
  );
  const isPublicRoute = publicRoutes.includes(path);

  const token = req.cookies.get("accessToken")?.value;
  const isAuthenticated = await verifyToken(token);

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (
    isPublicRoute &&
    isAuthenticated &&
    !req.nextUrl.pathname.startsWith("/chat")
  ) {
    return NextResponse.redirect(new URL("/chat", req.nextUrl));
  }

  return NextResponse.next();
}

const verifyToken = async (token: string | undefined) => {
  const appKey = process.env.APP_KEY;

  if (!token || !appKey) {
    return false;
  }

  try {
    const encoder = new TextEncoder();
    await jwtVerify(token, encoder.encode(appKey));

    return true;
  } catch (err) {
    return false;
  }
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
