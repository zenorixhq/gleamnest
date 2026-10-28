import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      items,
      subtotal,
      discountTotal,
      shippingFee,
      taxTotal,
      grandTotal,
      orderNumber,
    } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Verify cryptographic signature if secret is defined and not placeholder
    if (keySecret && !keySecret.includes("YourKeySecretHere")) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, message: "Payment verification failed: Signature mismatch" },
          { status: 400 }
        );
      }
    }

    // Save confirmed order to Prisma database
    const savedOrder = await prisma.order.create({
      data: {
        orderNumber: orderNumber || `RZP-${Math.floor(10000 + Math.random() * 90000)}`,
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingAddress: `${customer.address}, ${customer.city}, ${customer.state} ${customer.postalCode}, ${customer.country}`,
        itemsJson: JSON.stringify(items),
        subtotal: parseFloat(subtotal),
        discountTotal: parseFloat(discountTotal || 0),
        shippingFee: parseFloat(shippingFee || 0),
        taxTotal: parseFloat(taxTotal || 0),
        grandTotal: parseFloat(grandTotal),
        paymentMethod: "razorpay",
        paymentStatus: "paid",
        orderStatus: "processing",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and order saved",
      order: savedOrder,
    });
  } catch (err: any) {
    console.error("Razorpay verification error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Server verification error" },
      { status: 500 }
    );
  }
}
