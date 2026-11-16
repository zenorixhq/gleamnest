import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
  "CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
  "Vercel-CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
};

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

let memoryCachedSignatureIds: string[] | null = null;
let lastSignatureCacheTime = 0;
const SIGNATURE_CACHE_TTL = 120 * 1000;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const forceFresh = url.searchParams.get("fresh") === "true";

    if (!forceFresh && memoryCachedSignatureIds && Date.now() - lastSignatureCacheTime < SIGNATURE_CACHE_TTL) {
      return NextResponse.json({ productIds: memoryCachedSignatureIds }, { headers: CACHE_HEADERS });
    }

    const row = await prisma.siteContent.findUnique({
      where: { key: "signature_couture_product_ids" },
    });

    let productIds: string[] = [];
    if (row?.value) {
      const parsed = JSON.parse(row.value);
      if (Array.isArray(parsed)) {
        productIds = parsed;
      }
    }

    memoryCachedSignatureIds = productIds;
    lastSignatureCacheTime = Date.now();

    return NextResponse.json(
      { productIds },
      { headers: forceFresh ? NO_CACHE_HEADERS : CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error("GET /api/signature-couture error:", err);
    return NextResponse.json(
      { productIds: memoryCachedSignatureIds || [] },
      { headers: CACHE_HEADERS }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productIds = Array.isArray(body.productIds) ? body.productIds : [];

    const jsonStr = JSON.stringify(productIds);
    await prisma.siteContent.upsert({
      where: { key: "signature_couture_product_ids" },
      update: { value: jsonStr },
      create: { key: "signature_couture_product_ids", value: jsonStr },
    });

    memoryCachedSignatureIds = productIds;
    lastSignatureCacheTime = Date.now();

    return NextResponse.json({ success: true, productIds }, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    console.error("POST /api/signature-couture error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update signature couture selection" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
