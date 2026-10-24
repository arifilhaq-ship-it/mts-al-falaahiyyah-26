import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Jalur khusus login tidak diblokir
  if (pathname === "/admin/login") {
    const sessionCookie = request.cookies.get("falaahiyyah_admin_session")?.value;
    if (sessionCookie) {
      // Jika sudah punya session, redirect langsung ke dashboard admin
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Lindungi semua rute /admin/* lainnya
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("falaahiyyah_admin_session")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validasi token dasar di edge middleware
    try {
      const parts = sessionCookie.split(".");
      if (parts.length !== 3) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
