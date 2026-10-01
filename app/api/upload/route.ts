import { handleUpload } from "@vercel/blob/client";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowed = ["image/", "video/", "application/pdf", "text/plain"];
const maxBytes = 100 * 1024 * 1024;

function allowedType(type: string) {
  return allowed.some((prefix) => prefix.endsWith("/") ? type.startsWith(prefix) : type === prefix);
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ mode: process.env.BLOB_READ_WRITE_TOKEN ? "blob-client" : "local" });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Vercel Blob client-upload handshake. This path is used by the browser only
  // when BLOB_READ_WRITE_TOKEN exists.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const body = await request.json();
      const result = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: ["image/*", "video/*", "application/pdf", "text/plain"],
          maximumSizeInBytes: maxBytes,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ owner: "carltoons" }),
        }),
        onUploadCompleted: async () => {},
      });
      return NextResponse.json(result);
    } catch (error) {
      console.error("Blob client token failed:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unable to create upload token." },
        { status: 400 }
      );
    }
  }

  // Local-development fallback. This avoids a broken Blob client when the
  // developer has not configured Vercel Blob yet.
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "BLOB_READ_WRITE_TOKEN is required for uploads in production." },
        { status: 503 }
      );
    }

    const form = await request.formData();
    const entry = form.get("file");
    if (!(entry instanceof File)) return NextResponse.json({ error: "No file supplied." }, { status: 400 });
    if (entry.size > maxBytes) return NextResponse.json({ error: "File is larger than 100 MB." }, { status: 413 });
    if (!allowedType(entry.type)) return NextResponse.json({ error: "File type is not allowed." }, { status: 415 });

    const ext = path.extname(entry.name).replace(/[^a-zA-Z0-9.]/g, "").slice(0, 12);
    const filename = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), Buffer.from(await entry.arrayBuffer()));

    return NextResponse.json({
      url: `/uploads/${filename}`,
      pathname: `uploads/${filename}`,
      contentType: entry.type,
    }, { status: 201 });
  } catch (error) {
    console.error("Local upload failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 }
    );
  }
}
