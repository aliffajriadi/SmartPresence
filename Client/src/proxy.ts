import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/guru/:path*", "/siswa/:path*", "/login"],
};

export function proxy(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split("; ")
    .find((v) => v.startsWith("token="))
    ?.split("=")[1];

  const pathname = req.nextUrl.pathname;

  // Belum login → boleh ke login
  if (!token && pathname === "/login") return;

  // Belum login → tolak
  if (!token) {
    return NextResponse.redirect(
      new URL("/login?error=unauth", req.url)
    );
  }

  // Decode JWT tanpa Buffer (Edge safe)
  let payload: { role?: string } = {};

  try {
    const base64 = token.split(".")[1];
    const json = atob(base64);
    payload = JSON.parse(json);
  } catch {
    return NextResponse.redirect(
      new URL("/login?error=invalid_token", req.url)
    );
  }

  const role = payload.role;

  // Proteksi role
  if (pathname.startsWith("/admin") && role !== "admin")
    return NextResponse.redirect(new URL("/login", req.url));

  if (pathname.startsWith("/guru") && role !== "guru")
    return NextResponse.redirect(new URL("/login", req.url));

  if (pathname.startsWith("/siswa") && role !== "siswa")
    return NextResponse.redirect(new URL("/login", req.url));

  // Sudah login → redirect dari halaman login
  if (pathname === "/login") {
    if (role === "admin") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "guru") return NextResponse.redirect(new URL("/guru", req.url));
    if (role === "siswa") return NextResponse.redirect(new URL("/siswa", req.url));
  }

  return NextResponse.next();
}
