import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folderType = (formData.get("folder") as string) || "screenshots"; // "screenshots" | "videos" | "images"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const safeFolder = folderType === "videos" ? "videos" : folderType === "images" ? "images" : "screenshots";
    const originalName = file.name || "upload";
    const ext = path.extname(originalName).toLowerCase() || (safeFolder === "videos" ? ".mp4" : ".jpg");
    const cleanBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
    const fileName = `${cleanBase}-${Date.now()}${ext}`;

    // 1. If Vercel Blob is configured (via BLOB_READ_WRITE_TOKEN env variable)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`uploads/${safeFolder}/${fileName}`, file, {
          access: "public",
          addRandomSuffix: true,
        });

        return NextResponse.json(
          {
            success: true,
            url: blob.url,
            fileName,
            size: file.size,
            provider: "vercel-blob",
          },
          {
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          }
        );
      } catch (blobErr: any) {
        console.error("Vercel Blob upload failed, falling back:", blobErr);
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. In local development or writable environments, attempt to save to /public/uploads
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${safeFolder}/${fileName}`;
      return NextResponse.json(
        {
          success: true,
          url: publicUrl,
          fileName,
          size: file.size,
          provider: "local-fs",
        },
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      );
    } catch (fsErr: any) {
      // Expected on Vercel serverless where /var/task is read-only
      console.warn("Local filesystem write skipped (read-only environment):", fsErr.message);
    }

    // 3. Resilient fallback for serverless (Vercel) when BLOB_READ_WRITE_TOKEN is not yet connected:
    // For images, thumbnails, and screenshots (or small videos under 4MB): return Data URL
    if (safeFolder !== "videos" || buffer.length <= 4 * 1024 * 1024) {
      const mimeType = file.type || (safeFolder === "videos" ? "video/mp4" : "image/jpeg");
      const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

      return NextResponse.json(
        {
          success: true,
          url: dataUrl,
          fileName,
          size: file.size,
          provider: "data-url",
        },
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        }
      );
    }

    // 4. For large videos on Vercel when Vercel Blob is not yet enabled in the dashboard
    return NextResponse.json(
      {
        error:
          "Video file is larger than 4MB. To upload video files directly on Vercel, please connect Vercel Blob in your Vercel Dashboard (Storage -> Create Blob Store), OR paste an Instagram Reel / public video URL.",
      },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message || "Failed to upload file" }, { status: 500 });
  }
}
