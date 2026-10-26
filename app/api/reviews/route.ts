import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "clientReviews.json");

function getInitialData() {
  return {
    reviews: [],
    videoReels: [],
    feedbackScreenshots: [],
    instagramVideos: [],
  };
}

function readData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, "utf8");
      const parsed = JSON.parse(content);
      if (!parsed.feedbackScreenshots) parsed.feedbackScreenshots = [];
      if (!parsed.instagramVideos) parsed.instagramVideos = [];
      return parsed;
    }
  } catch (e) {
    console.error("Error reading clientReviews.json:", e);
  }
  return getInitialData();
}

function writeData(data: any) {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing clientReviews.json:", e);
  }
}

export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = readData();

    if (body.type === "screenshot") {
      // Client feedback screenshot upload
      const newScreenshot = {
        id: `fb-${Date.now()}`,
        title: body.title || "WhatsApp / DM Customer Review",
        customerName: body.customerName || "Verified Buyer",
        location: body.location || "Kerala, India",
        piece: body.piece || "Anti-Tarnish Fine Jewelry",
        imageUrl: body.imageUrl,
        caption: body.caption || "",
        date: body.date || "Verified Recent Buyer",
      };
      if (!data.feedbackScreenshots) data.feedbackScreenshots = [];
      data.feedbackScreenshots.unshift(newScreenshot);
      writeData(data);
      return NextResponse.json({ success: true, item: newScreenshot });
    } else if (body.type === "instagramVideo") {
      // Instagram video for "Follow The House" section
      let videoUrl = body.videoUrl || "";
      let embedUrl = "";
      
      // If it's an Instagram post / reel URL, format embed
      const instaMatch = videoUrl.match(/instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/);
      if (instaMatch && instaMatch[1]) {
        embedUrl = `https://www.instagram.com/reel/${instaMatch[1]}/embed`;
      }

      const newInstaVideo = {
        id: `insta-${Date.now()}`,
        title: body.title || "Jewelry Styling Reel",
        handle: body.handle || "@gleamnest.in",
        caption: body.caption || "Everyday luxury waterproof jewelry in 304 & 306 steel",
        videoUrl: videoUrl,
        embedUrl: embedUrl,
        poster: body.poster || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=700",
        views: body.views || "15.2K",
        instagramLink: body.instagramLink || (videoUrl.includes("instagram.com") ? videoUrl : "https://www.instagram.com/gleamnest.in?igsh=c3I4M2h1YmprdXI5"),
      };
      if (!data.instagramVideos) data.instagramVideos = [];
      data.instagramVideos.unshift(newInstaVideo);
      writeData(data);
      return NextResponse.json({ success: true, item: newInstaVideo });
    } else if (body.type === "video") {
      const newVideo = {
        id: `vid-${Date.now()}`,
        influencer: body.influencer || "GleamNest Client",
        handle: body.handle || "@gleamnest.in",
        title: body.title || "Jewelry Styling Reel",
        poster: body.poster || "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=700",
        videoUrl: body.videoUrl,
        views: body.views || "1.2K views",
        productTitle: body.productTitle || "GleamNest Jewelry",
        productSlug: body.productSlug || "all",
        productPrice: Number(body.productPrice) || 150,
      };
      data.videoReels.unshift(newVideo);
      writeData(data);
      return NextResponse.json({ success: true, item: newVideo });
    } else {
      const newReview = {
        id: `rev-${Date.now()}`,
        author: body.author || "Verified Customer",
        location: body.location || "Kerala, India",
        piece: body.piece || "Anti-Tarnish Fine Jewelry",
        rating: Number(body.rating) || 5,
        quote: body.quote || "",
      };
      data.reviews.unshift(newReview);
      writeData(data);
      return NextResponse.json({ success: true, item: newReview });
    }
  } catch (err: any) {
    console.error("Error in POST /api/reviews:", err);
    return NextResponse.json({ error: err.message || "Failed to add" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // "review", "video", "screenshot", "instagramVideo"

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const data = readData();
    if (type === "screenshot") {
      data.feedbackScreenshots = (data.feedbackScreenshots || []).filter((s: any) => String(s.id) !== String(id));
    } else if (type === "instagramVideo") {
      data.instagramVideos = (data.instagramVideos || []).filter((v: any) => String(v.id) !== String(id));
    } else if (type === "video") {
      data.videoReels = (data.videoReels || []).filter((v: any) => String(v.id) !== String(id));
    } else {
      data.reviews = (data.reviews || []).filter((r: any) => String(r.id) !== String(id));
    }

    writeData(data);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error in DELETE /api/reviews:", err);
    return NextResponse.json({ error: err.message || "Failed to delete" }, { status: 500 });
  }
}
