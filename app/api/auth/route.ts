import { NextResponse } from "next/server";
import { isAdmin, login, logout } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    authenticated: await isAdmin(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body?.action === "logout") {
      await logout();

      return NextResponse.json({
        success: true,
        authenticated: false,
      });
    }

    const password = String(body?.password ?? "");

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: "Password is required.",
        },
        { status: 400 }
      );
    }

    const authenticated = await login(password);

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: "Invalid password.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        error: "Invalid request.",
      },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  await logout();

  return NextResponse.json({
    success: true,
    authenticated: false,
  });
}