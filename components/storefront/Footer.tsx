"use client";

import { useState } from "react";
import Link from "next/link";
import { storeConfig } from "@/config/store.config";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Instagram,
  Twitter,
  Facebook,
  Ruler,
  Sparkles,
  Truck,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { BrandLogo } from "@/components/storefront/BrandLogo";
import { ProductFeatureSlider } from "@/components/storefront/ProductFeatureSlider";
import { PolicyModal, PolicyTab } from "@/components/storefront/PolicyModal";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [policyModalTab, setPolicyModalTab] = useState<PolicyTab | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-card border-t border-border mt-20">
      {/* Interactive Auto-Scrolling Feature Slider */}
      <div className="border-b border-border/60 py-8 sm:py-10 bg-muted/10">
        <ProductFeatureSlider onOpenPolicy={(tab) => setPolicyModalTab(tab)} />
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="full" showTagline={true} />
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm font-light">
              {storeConfig.meta.description}
            </p>

            <div className="pt-2 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{storeConfig.brand.contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{storeConfig.brand.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{storeConfig.brand.contact.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={storeConfig.brand.socials.instagram || "https://www.instagram.com/gleamnest.in?igsh=c3I4M2h1YmprdXI5"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={storeConfig.brand.socials.facebook || "https://www.facebook.com/share/1DXg9Puzkj/"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Shop Collections
            </h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=new-arrivals" className="hover:text-primary transition-colors text-primary font-medium">
                  ✦ New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?category=necklaces-and-chains" className="hover:text-primary transition-colors">
                  Necklaces & Chains
                </Link>
              </li>
              <li>
                <Link href="/products?category=rings" className="hover:text-primary transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/products?category=earrings" className="hover:text-primary transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/products?category=bracelets" className="hover:text-primary transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/products?category=bangles-kada" className="hover:text-primary transition-colors">
                  Bangles & Kada
                </Link>
              </li>
              <li>
                <Link href="/products?category=watches" className="hover:text-primary transition-colors">
                  Watches
                </Link>
              </li>
              <li>
                <Link href="/products?category=charms" className="hover:text-primary transition-colors">
                  Charms
                </Link>
              </li>
              <li>
                <Link href="/products?category=hip-chains" className="hover:text-primary transition-colors">
                  Hip Chains
                </Link>
              </li>
              <li>
                <Link href="/products?category=anklets" className="hover:text-primary transition-colors">
                  Anklets
                </Link>
              </li>
              <li>
                <Link href="/products?category=kids-collection" className="hover:text-primary transition-colors">
                  Kids Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Customer Concierge
            </h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => setPolicyModalTab("size-guide")}
                  className="hover:text-primary transition-colors text-left flex items-center gap-1.5"
                >
                  <Ruler className="w-3.5 h-3.5 text-primary" />
                  <span>Bangle & Ring Size Guide</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPolicyModalTab("care-guide")}
                  className="hover:text-primary transition-colors text-left flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Jewelry Care (304 & 306 Steel)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPolicyModalTab("shipping")}
                  className="hover:text-primary transition-colors text-left flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-primary" />
                  <span>Shipping via DTDC & India Post</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPolicyModalTab("return-refund")}
                  className="hover:text-primary transition-colors text-left flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-primary" />
                  <span>Return & Replacement Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPolicyModalTab("ordering-instructions")}
                  className="hover:text-primary transition-colors text-left flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-primary" />
                  <span>Important Instructions</span>
                </button>
              </li>
              <li className="pt-1 border-t border-border/50">
                <Link href="/account" className="hover:text-primary transition-colors">
                  Order Status & Tracking
                </Link>
              </li>
              <li>
                <Link href="/account?tab=wishlist" className="hover:text-primary transition-colors">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Stay Informed
            </h5>
            <p className="text-xs text-muted-foreground">
              Subscribe to receive private previews, seasonal catalogs, and 10% off your initial purchase.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Thank you! Check your inbox for your 10% welcome voucher.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-3 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Join the List
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Legal & Payment Badges */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {storeConfig.meta.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-medium tracking-wide">SECURE 256-BIT ENCRYPTION</span>
            <span>•</span>
            <span>100% SECURE DIRECT CHECKOUT</span>
          </div>
        </div>
      </div>

      {/* Interactive Policy & Size Guide Modal */}
      <PolicyModal
        isOpen={!!policyModalTab}
        onClose={() => setPolicyModalTab(null)}
        initialTab={policyModalTab || "size-guide"}
      />
    </footer>
  );
}
