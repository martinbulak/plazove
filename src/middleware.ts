import { NextResponse, type NextRequest } from "next/server";

/**
 * Ochrana administrácie. Beží v Edge runtime, preto podpis session cookie
 * overujeme cez Web Crypto (nie cez node:crypto). Logika musí zodpovedať
 * src/lib/auth.ts (rovnaký payload „admin.<exp>" a HMAC-SHA256 v hex).
 */

const COOKIE_NAME = "aqb_admin";

function hex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function isValid(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(`admin.${expStr}`));
  const expected = hex(mac);
  if (expected.length !== sig.length) return false;
  // konštantné porovnanie
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Prihlasovaciu stránku a jej API nechráníme.
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SESSION_SECRET || "insecure-dev-secret-change-me";
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (await isValid(token, secret)) {
    return NextResponse.next();
  }

  // API → 401, stránky → presmerovanie na login.
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Neprihlásený." }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
