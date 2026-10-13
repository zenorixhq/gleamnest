import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sampleOrders } from "@/data/mockData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (dbOrders.length === 0) {
      return NextResponse.json(sampleOrders);
    }

    const formatted = dbOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      createdAt: o.createdAt.toISOString(),
      status: o.orderStatus,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      customer: {
        id: `cust-${o.id}`,
        name: o.customerName,
        email: o.customerEmail || "whatsapp@gleamnest.in",
        phone: o.customerPhone,
        shippingAddress: {
          line1: o.shippingAddress,
          city: "",
          state: "",
          postalCode: "",
          country: "India",
        },
      },
      items: o.itemsJson ? JSON.parse(o.itemsJson) : [],
      subtotal: o.subtotal,
      discount: o.discountTotal,
      shipping: o.shippingFee,
      tax: o.taxTotal,
      grandTotal: o.grandTotal,
      currency: "INR",
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json(sampleOrders);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const createdOrder = await prisma.order.create({
      data: {
        orderNumber: body.orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail || `${body.customerPhone}@whatsapp.customer`,
        customerPhone: body.customerPhone,
        shippingAddress: body.shippingAddress,
        itemsJson: JSON.stringify(body.items || []),
        subtotal: parseFloat(body.subtotal) || 0,
        discountTotal: parseFloat(body.discountTotal) || 0,
        shippingFee: parseFloat(body.shippingFee) || 0,
        taxTotal: 0,
        grandTotal: parseFloat(body.grandTotal) || 0,
        paymentMethod: body.paymentMethod || "WhatsApp UPI",
        paymentStatus: body.paymentStatus || "pending",
        orderStatus: body.orderStatus || "processing",
      },
    });

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
