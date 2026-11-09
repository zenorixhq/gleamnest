"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { storeConfig } from "@/config/store.config";
import { MessageCircle, ArrowRight, Copy, Check, ExternalLink, Globe } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "GN-8841";
  const rawTotal = searchParams.get("total") || "799";
  const phone = searchParams.get("phone") || "";

  // Strip any leading currency symbol or extra spaces to ensure exactly one currency symbol
  const cleanedTotal = rawTotal.replace(/^[₹\s]+/, "");
  const displayTotal = rawTotal.startsWith("QAR") ? rawTotal : `₹${cleanedTotal}`;

  const [orderMessage, setOrderMessage] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const whatsappPhone = storeConfig.brand.contact.whatsappNumber; // 916238920442

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent));
    const savedMsg = sessionStorage.getItem("gleamnest_last_order_msg");
    if (savedMsg) {
      setOrderMessage(savedMsg);
    } else {
      setOrderMessage(
        `Hi GleamNest! ✨ I just completed my order #${orderNumber} on your website for ${displayTotal}. Please share your official UPI QR code so I can complete payment and confirm shipping! 💖`
      );
    }
  }, [orderNumber, displayTotal]);

  const encodedMessage = encodeURIComponent(
    orderMessage ||
      `Hi GleamNest! ✨ I just completed my order #${orderNumber} on your website for ${displayTotal}. Please share your official UPI QR code so I can complete payment and confirm shipping! 💖`
  );

  const waWebAppUrl = `https://web.whatsapp.com/send?phone=${whatsappPhone}&text=${encodedMessage}`;
  const waDirectAppUrl = `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodedMessage}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-8">
      {/* Animated Success Badge */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-[#25D366] flex items-center justify-center mx-auto shadow-md">
          <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 fill-current" />
        </div>

        <span className="text-xs uppercase tracking-widest font-bold text-primary">
          Order Sent to WhatsApp
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground">
          Thank you for choosing GleamNest!
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Your order details have been compiled and sent to our official WhatsApp concierge (+91 62389 20442).
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
          <div>
            <span className="text-xs text-muted-foreground">Order Reference</span>
            <p className="text-lg font-black text-foreground">{orderNumber}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Total Payable</span>
            <p className="text-lg font-black text-foreground">{displayTotal}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Order Channel</span>
            <p className="text-sm font-bold text-[#25D366] flex items-center gap-1">
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Direct</span>
            </p>
          </div>
        </div>

        {/* Steps to complete payment */}
        <div className="space-y-3 bg-muted/30 p-5 rounded-xl border border-border text-xs text-muted-foreground">
          <h4 className="font-bold text-foreground text-sm">Next Steps on WhatsApp:</h4>
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>Check your WhatsApp chat with <strong>GleamNest (+91 62389 20442)</strong>.</li>
            <li>Our concierge will verify your items and send our official <strong>GPay / PhonePe UPI QR</strong>.</li>
            <li>Once you send your payment screenshot, your parcel will be packed and dispatched with a courier tracking ID.</li>
          </ol>
        </div>

        {/* WhatsApp Actions (Web, App, Copy) */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {isMobile ? (
              <a
                href={waDirectAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Open WhatsApp App</span>
              </a>
            ) : (
              <>
                <a
                  href={waWebAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Globe className="w-4 h-4" />
                  <span>Open in WhatsApp Web (Recommended)</span>
                </a>
                <a
                  href={waDirectAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-border hover:bg-muted text-foreground font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Desktop App</span>
                </a>
              </>
            )}

            <button
              onClick={handleCopy}
              className={`w-full sm:w-auto px-5 py-3.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                copied
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "border-border text-foreground hover:bg-muted"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Order Copied! (Ctrl+V)</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-muted-foreground" />
                  <span>Copy Order Text</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground text-center sm:text-left">
            💡 Using WhatsApp Desktop on Windows? If emojis ever show as symbols, click <strong>&quot;Copy Order Text&quot;</strong> above and paste directly with <code>Ctrl + V</code>.
          </p>
        </div>

        {/* Formatted Order Message Preview */}
        {orderMessage && (
          <details className="group border border-border/70 rounded-xl overflow-hidden bg-muted/10 text-xs">
            <summary className="px-4 py-3 font-semibold text-muted-foreground cursor-pointer hover:bg-muted/30 select-none flex items-center justify-between">
              <span>View Order Message Details</span>
              <span className="text-[11px] text-primary group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="p-4 pt-2 border-t border-border/50">
              <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-muted-foreground bg-card p-3 rounded-lg border border-border overflow-x-auto">
                {orderMessage}
              </pre>
            </div>
          </details>
        )}

        <div className="pt-2 flex justify-end">
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border text-foreground hover:bg-muted font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto py-24 text-center">Loading confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
