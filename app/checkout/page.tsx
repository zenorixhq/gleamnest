"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { storeConfig } from "@/config/store.config";
import { formatPrice } from "@/lib/utils";
import {
  MessageCircle,
  Truck,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Sparkles,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Ruler,
} from "lucide-react";
import { PolicyModal, PolicyTab } from "@/components/storefront/PolicyModal";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [policyModalTab, setPolicyModalTab] = useState<PolicyTab | null>(null);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);
  const setCurrency = useCartStore((s) => s.setCurrency);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isQatar = selectedCurrency === "QAR";
  const subtotal = useCartStore((s) => s.getSubtotal)();
  const discount = useCartStore((s) => s.getDiscountAmount)();
  const shipping = useCartStore((s) => s.getShippingFee)();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    country: selectedCurrency === "QAR" ? "Qatar" : "India",
    fullName: "",
    phone: "",
    altPhone: "",
    address: "",
    city: "",
    state: selectedCurrency === "QAR" ? "Doha" : "Kerala",
    postalCode: "",
    notes: "",
  });

  const handleCountryChange = (country: string) => {
    setFormData((prev) => ({
      ...prev,
      country,
      state: country === "Qatar" ? "Doha" : "Kerala",
    }));
    setCurrency(country === "Qatar" ? "QAR" : "INR");
  };

  const grandTotal = Math.max(0, subtotal - discount + shipping);

  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-xs text-muted-foreground animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Your jewelry bag is empty</h2>
        <p className="text-xs text-muted-foreground">
          Select your favorite anti-tarnish pieces before ordering via WhatsApp.
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs"
        >
          Explore Jewelry Collection
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (res.success) {
      setCouponMsg({ type: "success", text: res.message });
      setCouponCode("");
    } else {
      setCouponMsg({ type: "error", text: res.message });
    }
  };

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderNumber = `GN-${Math.floor(1000 + Math.random() * 9000)}`;
    const whatsappPhone = storeConfig.brand.contact.whatsappNumber; // 916238920442

    const orderDate = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const itemsText = items
      .map((item, idx) => {
        const variantInfo = item.selectedVariant
          ? ` (${Object.values(item.selectedVariant.options).join(", ")})`
          : "";
        const itemUnit = isQatar
          ? item.priceQatar !== undefined && item.priceQatar !== null
            ? item.priceQatar
            : Math.max(10, Math.round(item.price / 20))
          : item.price;
        return `*${idx + 1}. ${item.title}*${variantInfo}
   • Qty: ${item.quantity}  |  ${formatPrice(itemUnit * item.quantity, selectedCurrency)}`;
      })
      .join("\n\n");

    const shippingText = isQatar
      ? "FREE (Complimentary Qatar Delivery)"
      : shipping === 0
      ? "FREE (Pan-India Express)"
      : `${formatPrice(shipping, selectedCurrency)} (Pan-India Express)`;

    const greetingMessage = isQatar
      ? `💬 *Hello GleamNest Team!*
I have placed this order on your website for delivery in Qatar (Free Delivery). 
Please share payment details (Card / Bank Transfer / Cash on Delivery) so I can complete my order! 💖`
      : `💬 *Hello GleamNest Team!*
I have placed this order on your website. 
Please share your *UPI QR Code / Payment details (GPay / PhonePe / Paytm)* so I can complete payment and confirm shipping! 💖`;

    const message = `━━━━━━━━━━━━━━━━━━━━━
✨ *G L E A M N E S T* ✨
_Everyday Anti-Tarnish & Waterproof Jewelry_
━━━━━━━━━━━━━━━━━━━━━

🛍️ *NEW ORDER CONFIRMATION*
• *Order Ref:* #${orderNumber}
• *Date:* ${orderDate}
• *Destination:* *${formData.country}*

━━━━━━━━━━━━━━━━━━━━━
👤 *CUSTOMER DETAILS*
━━━━━━━━━━━━━━━━━━━━━
• *Name:* ${formData.fullName}
• *WhatsApp:* ${formData.phone}${formData.altPhone ? `\n• *Alt Contact:* ${formData.altPhone}` : ""}
• *Shipping Address:*
  ${formData.address}
  ${[formData.city, formData.state].filter(Boolean).join(", ")}${formData.postalCode ? ` - ${formData.postalCode}` : ""}
  Country: ${formData.country}
${formData.notes ? `• *Special Note:* ${formData.notes}\n` : ""}
━━━━━━━━━━━━━━━━━━━━━
💍 *ITEMS ORDERED (${items.reduce((s, i) => s + i.quantity, 0)})*
━━━━━━━━━━━━━━━━━━━━━
${itemsText}

━━━━━━━━━━━━━━━━━━━━━
💳 *PAYMENT SUMMARY*
━━━━━━━━━━━━━━━━━━━━━
• Subtotal: ${formatPrice(subtotal, selectedCurrency)}
${discount > 0 ? `• Coupon Discount (${appliedCoupon?.code}): -${formatPrice(discount, selectedCurrency)}\n` : ""}• Shipping: ${shippingText}
─────────────────────
✨ *TOTAL AMOUNT PAYABLE:* *${formatPrice(grandTotal, selectedCurrency)}*
─────────────────────

${greetingMessage}
━━━━━━━━━━━━━━━━━━━━━`;

    const encodedMessage = encodeURIComponent(message);
    const isMobile = typeof window !== "undefined" && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    
    // On mobile devices, api.whatsapp.com launches the WhatsApp mobile app directly.
    // On desktop, web.whatsapp.com opens directly in the browser preserving 100% of emojis without Windows protocol corruption!
    const waUrl = isMobile
      ? `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${whatsappPhone}&text=${encodedMessage}`;

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("gleamnest_last_order_msg", message);
        sessionStorage.setItem("gleamnest_last_order_number", orderNumber);
      } catch (e) {
        console.error("Failed to save to sessionStorage:", e);
      }
    }

    // Persist order to database for admin visibility
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber,
        customerName: formData.fullName,
        customerPhone: formData.phone,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state}${formData.postalCode ? ` - ${formData.postalCode}` : ""}, ${formData.country}`,
        items: items.map((i) => ({
          productId: i.id,
          title: i.title,
          price: isQatar
            ? i.priceQatar !== undefined && i.priceQatar !== null
              ? i.priceQatar
              : Math.max(10, Math.round(i.price / 20))
            : i.price,
          quantity: i.quantity,
          image: i.image,
          selectedVariant: i.selectedVariant,
        })),
        subtotal,
        discountTotal: discount,
        shippingFee: shipping,
        grandTotal,
        paymentMethod: isQatar ? "WhatsApp Direct (Qatar)" : "WhatsApp Direct UPI",
        paymentStatus: "pending",
        orderStatus: "processing",
      }),
    }).catch((err) => console.error("Failed to save order to DB:", err));

    // Open WhatsApp directly
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }

    setTimeout(() => {
      clearCart();
      router.push(`/checkout/success?orderNumber=${orderNumber}&total=${encodeURIComponent(formatPrice(grandTotal, selectedCurrency))}&phone=${formData.phone}`);
    }, 600);
  };

  return (
    <div className="bg-muted/30 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/products"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Direct WhatsApp Order • 0% Extra Gateway Fees</span>
          </span>
        </div>

        {/* Important Ordering Instructions & Policy Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>Important Instructions Before Ordering</span>
            </div>
            <button
              type="button"
              onClick={() => setPolicyModalTab("ordering-instructions")}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Full Instructions & Size Guide</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-muted-foreground">
            <div className="flex items-start gap-1.5">
              <span className="text-primary font-bold">1.</span>
              <span>Provide 2 active phone numbers for DTDC / India Post courier dispatch.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-primary font-bold">2.</span>
              <span>Photo confirmation shared on WhatsApp prior to handover.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-primary font-bold">3.</span>
              <span>Mandatory continuous 360° unboxing video for transit damage replacement.</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleWhatsAppOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Delivery Details Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                    Shipping & Delivery Information
                  </h3>
                </div>
                {isQatar && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ✨ Free Delivery in Qatar
                  </span>
                )}
              </div>

              {/* Destination Country Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Delivery Destination Country *</span>
                  <span className="text-[10px] text-muted-foreground">Select your shipping destination</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleCountryChange("India")}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      formData.country === "India"
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span>🇮🇳</span>
                    <span>India (₹ INR)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCountryChange("Qatar")}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      formData.country === "Qatar"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span>🇶🇦</span>
                    <span>Qatar (QAR) • Free Shipping</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={isQatar ? "e.g. Fatima Al-Kuwari" : "e.g. Ananya Sharma"}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* WhatsApp Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp Mobile Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder={isQatar ? "e.g. 55123456 (Qatar +974)" : "e.g. 9876543210 (India +91)"}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-medium"
                />
                <p className="text-[11px] text-muted-foreground">
                  Primary number for instant order confirmation & tracking updates.
                </p>
              </div>

              {/* Secondary / Alternate Contact Number (Image 3 Requirement) */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>Secondary / Alternate Contact Number</span>
                  </span>
                  <span className="text-[10px] text-primary font-bold">Recommended</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876500000 (Alternate active mobile for DTDC / India Post courier)"
                  value={formData.altPhone}
                  onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-medium"
                />
                <p className="text-[11px] text-muted-foreground">
                  Providing 2 active contact numbers guarantees smooth courier delivery.
                </p>
              </div>

              {/* Street Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  {isQatar
                    ? "Building No., Street & Flat / Villa Address *"
                    : "House / Flat No., Building & Street Address *"}
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder={
                    isQatar
                      ? "e.g. Villa 12, Street 840, Zone 55, Al Aziziya"
                      : "e.g. Flat 402, Lotus Towers, MG Road, Near Central Mall"
                  }
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              {/* City, State / Municipality, Postal */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    {isQatar ? "City / Town *" : "City / Town *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isQatar ? "e.g. Doha" : "e.g. Kochi"}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    {isQatar ? "Municipality / Zone *" : "State *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isQatar ? "e.g. Al Rayyan" : "e.g. Kerala"}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    {isQatar ? "Zone / P.O. Box (Optional)" : "PIN Code *"}
                  </label>
                  <input
                    type="text"
                    required={!isQatar}
                    maxLength={10}
                    placeholder={isQatar ? "e.g. Zone 55" : "e.g. 682001"}
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none font-mono"
                  />
                </div>
              </div>

              {/* Optional Notes */}
              <div className="space-y-1 pt-2">
                <label className="text-xs font-semibold text-foreground">
                  Special Notes / Gift Message (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please pack as a gift / deliver in the evening"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {/* How WhatsApp Ordering Works Explainer Card */}
            <div className="bg-[#25D366]/10 border border-[#25D366]/30 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-[#075E54] font-bold text-xs uppercase tracking-wide">
                <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
                <span>How WhatsApp Payment Works:</span>
              </div>
              <ol className="text-xs text-foreground/80 space-y-1.5 list-decimal pl-4">
                <li>Clicking <strong>&ldquo;Complete Order on WhatsApp&rdquo;</strong> will open WhatsApp with your item list and delivery address already prepared.</li>
                {isQatar ? (
                  <>
                    <li>GleamNest concierge will confirm available stock and coordinate <strong>Complimentary Express Delivery in Qatar</strong>.</li>
                    <li>Pay conveniently via Card / Bank Transfer or Cash on Delivery upon receiving your order.</li>
                  </>
                ) : (
                  <>
                    <li>GleamNest concierge will confirm available stock and send their <strong>GPay / PhonePe / Paytm UPI QR code</strong>.</li>
                    <li>Send the payment screenshot on WhatsApp to confirm dispatch with your DTDC/India Post tracking code.</li>
                  </>
                )}
              </ol>
            </div>
          </div>

          {/* Right Column: Order Summary & Review */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card p-6 sm:p-7 rounded-2xl border border-border shadow-sm space-y-6 sticky top-28">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} Items)
              </h3>

              {/* Items Reel */}
              <div className="max-h-64 overflow-y-auto divide-y divide-border/60 pr-1 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#FAF8F5] dark:bg-stone-900/40 rounded-lg border border-border p-1 flex items-center justify-center flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-foreground truncate">
                        {item.title}
                      </h4>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-muted-foreground">
                          {Object.values(item.selectedVariant.options).join(" / ")}
                        </p>
                      )}
                      <p className="text-[11px] text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-foreground">
                      {formatPrice(
                        (isQatar
                          ? item.priceQatar !== undefined && item.priceQatar !== null
                            ? item.priceQatar
                            : Math.max(10, Math.round(item.price / 20))
                          : item.price) * item.quantity,
                        selectedCurrency
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Engine */}
              <div className="pt-2 border-t border-border">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-primary/10 border border-primary/20 px-3 py-2 rounded-lg text-xs">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedCoupon.code} applied (-{formatPrice(discount, selectedCurrency)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-primary hover:underline font-bold text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. GLEAM10)"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponMsg(null);
                      }}
                      className="flex-1 px-3 py-2 text-xs rounded-lg bg-muted/40 border border-border uppercase outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-foreground text-background hover:bg-foreground/80 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponMsg && (
                  <p
                    className={`text-[11px] mt-1.5 ${
                      couponMsg.type === "success" ? "text-emerald-600 font-medium" : "text-destructive"
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2 text-xs border-t border-border pt-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal, selectedCurrency)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(discount, selectedCurrency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>{isQatar ? "Qatar Express Delivery" : "Pan-India Delivery"}</span>
                  <span>{shipping === 0 ? (isQatar ? "FREE (Qatar)" : "FREE") : formatPrice(shipping, selectedCurrency)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-foreground pt-3 border-t border-border">
                  <span>Total Payable</span>
                  <span>{formatPrice(grandTotal, selectedCurrency)}</span>
                </div>
              </div>

              {/* Main Submit Button: Send Order via WhatsApp */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>
                  {isSubmitting
                    ? "Opening WhatsApp..."
                    : `Complete Order on WhatsApp • ${formatPrice(grandTotal, selectedCurrency)}`}
                </span>
              </button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  Anti-Tarnish Guarantee
                </span>
                <span>•</span>
                <span>Waterproof & 304/306 Steel</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Interactive Policy Modal */}
      <PolicyModal
        isOpen={!!policyModalTab}
        onClose={() => setPolicyModalTab(null)}
        initialTab={policyModalTab || "ordering-instructions"}
      />
    </div>
  );
}
