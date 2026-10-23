import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "clientReviews.json");

function getInitialData() {
  return {
    reviews: [
      {
        id: "rev-1",
        author: "Isabella M.",
        location: "Kochi, Kerala",
        piece: "Statement Ring & Clover Bangle",
        rating: 5,
        quote: "Every piece feels like a whisper of the old couture houses. The gold finish is beyond reproach, and zero tarnish after 2 months of daily wear."
      },
      {
        id: "rev-2",
        author: "Camille R.",
        location: "Kannur, Kerala",
        piece: "White Stone Charm Chain",
        rating: 5,
        quote: "My solitaire arrived in a velvet box that already felt like an heirloom. The stone is extraordinary, and the WhatsApp ordering was so personal."
      },
      {
        id: "rev-3",
        author: "Sofia A.",
        location: "Bengaluru, Karnataka",
        piece: "Clover Bracelet - Gold",
        rating: 5,
        quote: "The atelier answered every question personally on WhatsApp. Rare, and quite lovely. Fast 2-day delivery across South India."
      },
      {
        id: "rev-4",
        author: "Meera K.",
        location: "Mumbai, Maharashtra",
        piece: "Simple Pearl Chain",
        rating: 5,
        quote: "I was skeptical about waterproof claims at this price point, but I've showered and swum in this necklace for weeks without a hint of fading."
      }
    ],
    videoReels: [
      {
        id: "vid-1",
        influencer: "Ananya Sanil",
        handle: "@ananya.styling",
        title: "100% Waterproof Shower Test 💧",
        poster: "https://images.unsplash.com/photo-1611591475806-039775089201?auto=format&fit=crop&q=80&w=700",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-jewelry-in-front-of-a-mirror-42407-large.mp4",
        views: "18.4K views",
        productTitle: "Clover Bracelet - Gold",
        productSlug: "clover-bracelet-gold",
        productPrice: 150
      },
      {
        id: "vid-2",
        influencer: "Devika Menon",
        handle: "@devika_curates",
        title: "Unboxing & Daily Stack Review ✨",
        poster: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=700",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-showing-a-gold-ring-42409-large.mp4",
        views: "24.1K views",
        productTitle: "Statement Ring",
        productSlug: "statement-ring",
        productPrice: 140
      }
    ]
  };
}

function readData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, "utf8");
      return JSON.parse(content);
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

    if (body.type === "video") {
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
    const type = searchParams.get("type"); // "review" or "video"

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const data = readData();
    if (type === "video") {
      data.videoReels = data.videoReels.filter((v: any) => String(v.id) !== String(id));
    } else {
      data.reviews = data.reviews.filter((r: any) => String(r.id) !== String(id));
    }

    writeData(data);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error in DELETE /api/reviews:", err);
    return NextResponse.json({ error: err.message || "Failed to delete" }, { status: 500 });
  }
}
