import { NextResponse } from "next/server";
import { clearSessionCookie, isAdmin, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ authenticated: await isAdmin() });
}

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: "" }));
  const expected = process.env.CARLTOONS_ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  await setSessionCookie();
  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ authenticated: false });
}
