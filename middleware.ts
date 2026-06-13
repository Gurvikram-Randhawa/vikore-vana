import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isOldAdmin = request.nextUrl.pathname.startsWith("/old-admin");
  const isAdminApi = request.nextUrl.pathname.startsWith("/api/admin");

  if (!isOldAdmin && !isAdminApi) return NextResponse.next();

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "change-me-before-launch";
  const auth = request.headers.get("authorization");

  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const [user, pass] = atob(encoded).split(":");
      if (user === username && pass === password) return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Vikore Vana Admin"'
    }
  });
}

export const config = {
  matcher: ["/old-admin", "/old-admin/:path*", "/api/admin", "/api/admin/:path*"]
};
