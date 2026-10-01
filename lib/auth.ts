import { cookies } from "next/headers";
import crypto from "node:crypto";

const COOKIE_NAME = "carltoons_admin";

const SESSION_SECRET =
  process.env.CARLTOONS_SESSION_SECRET ||
  "CHANGE_THIS_SESSION_SECRET";

const ADMIN_PASSWORD =
  process.env.CARLTOONS_ADMIN_PASSWORD || "";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function sign(value: string) {
  return crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(value)
    .digest("hex");
}

function createToken() {
  const timestamp = Date.now().toString();
  const signature = sign(timestamp);

  return `${timestamp}.${signature}`;
}

function verifyToken(token: string | undefined) {
  if (!token) return false;

  const [timestamp, signature] = token.split(".");

  if (!timestamp || !signature) return false;

  const expected = sign(timestamp);

  if (signature.length !== expected.length) return false;

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    )
  ) {
    return false;
  }

  const created = Number(timestamp);

  if (!Number.isFinite(created)) return false;

  const age = Date.now() - created;

  return age >= 0 && age <= SESSION_MAX_AGE * 1000;
}

export async function login(password: string) {
  if (!ADMIN_PASSWORD) {
    console.error(
      "CARLTOONS_ADMIN_PASSWORD is missing from .env.local"
    );

    return false;
  }

  if (password !== ADMIN_PASSWORD) {
    return false;
  }

  const token = createToken();

  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return true;
}

export async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  return verifyToken(token);
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function clearSessionCookie() {
  return logout();
}