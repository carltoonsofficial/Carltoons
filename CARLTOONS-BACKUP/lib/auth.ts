import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "carltoons_session";

function signature(value: string) {
  const secret = process.env.CARLTOONS_SESSION_SECRET;
  if (!secret) throw new Error("CARLTOONS_SESSION_SECRET is not configured.");
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionValue() {
  const value = `owner:${Date.now()}`;
  return `${value}.${signature(value)}`;
}

export function isValidSession(value?: string) {
  if (!value) return false;
  const dot = value.lastIndexOf(".");
  if (dot < 1) return false;
  const raw = value.slice(0, dot);
  const supplied = value.slice(dot + 1);
  const expected = signature(raw);
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin() {
  const store = await cookies();
  return isValidSession(store.get(COOKIE_NAME)?.value);
}

export async function setSessionCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
