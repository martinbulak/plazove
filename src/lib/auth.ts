import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

/**
 * Minimalistická autentifikácia administrácie.
 * Prihlásenie jediným heslom (ADMIN_PASSWORD), session je HMAC-podpísaná cookie.
 * Pre viac redaktorov / roly je vhodné nasadiť plnohodnotné riešenie (napr.
 * Auth.js) – viď README.
 */

const COOKIE_NAME = "aqb_admin";
const MAX_AGE_SEC = 60 * 60 * 8; // 8 hodín

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || "insecure-dev-secret-change-me";
}

function sign(value: string): string {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

function timingSafeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/** Overí zadané heslo proti ADMIN_PASSWORD (v konštantnom čase). */
export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  return timingSafeEqual(password, expected);
}

/** Vytvorí podpísaný token session. */
export function createSessionToken(): string {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = `admin.${exp}`;
  return `${payload}.${sign(payload)}`;
}

/** Overí platnosť tokenu session. */
export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [, expStr, sig] = parts;
  const payload = `admin.${expStr}`;
  if (!timingSafeEqual(sig, sign(payload))) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  return true;
}

export async function setSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Zistí, či je aktuálny požiadavok prihlásený (server components / route handlers). */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(COOKIE_NAME)?.value);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
