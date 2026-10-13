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
} from "lucide-react";
import { BrandLogo } from "@/components/storefront/BrandLogo";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-card border-t border-border mt-20">
      {/* Top Value Propositions */}
      <div className="border-b border-border/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Guaranteed Authenticity</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every material sustainably sourced & certified for enduring quality.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Complimentary Global Shipping</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Free standard delivery on orders exceeding ${storeConfig.commerce.freeShippingThreshold}.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">30-Day Hassle-Free Returns</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pre-printed prepaid return labels enclosed in every order package.
              </p>
            </div>
          </div>
        </div>
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
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
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
                <Link href="/products?category=necklaces" className="hover:text-primary transition-colors">
                  Necklaces & Pendants
                </Link>
              </li>
              <li>
                <Link href="/products?category=earrings" className="hover:text-primary transition-colors">
                  Hoops & Earrings
                </Link>
              </li>
              <li>
                <Link href="/products?category=bracelets" className="hover:text-primary transition-colors">
                  Bangles & Bracelets
                </Link>
              </li>
              <li>
                <Link href="/products?category=rings" className="hover:text-primary transition-colors">
                  Anti-Tarnish Rings
                </Link>
              </li>
              <li>
                <Link href="/products?category=anklets" className="hover:text-primary transition-colors">
                  Anklets & Charms
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
                <Link href="/account" className="hover:text-primary transition-colors">
                  Order Status & Tracking
                </Link>
              </li>
              <li>
                <Link href="/account?tab=wishlist" className="hover:text-primary transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition-colors font-medium text-foreground">
                  Merchant Admin
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
            <span>STRIPE & PAYPAL COMPLIANT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
