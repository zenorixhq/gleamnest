"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { storeConfig } from "@/config/store.config";
import { useCartStore } from "@/store/useCartStore";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Globe,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { formatPrice } from "@/lib/utils";
import { BrandLogo } from "@/components/storefront/BrandLogo";

export function Header() {
  const pathname = usePathname();

  // Hide storefront header completely on admin dashboard
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const products = useProductStore((s) => s.products);
  const items = useCartStore((s) => s.items);
  const wishlist = useCartStore((s) => s.wishlist);
  const selectedCurrency = useCartStore((s) => s.selectedCurrency);
  const setCurrency = useCartStore((s) => s.setCurrency);
  const openCart = useCartStore((s) => s.openCart);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // Track scroll position for sticky header styling
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 4)
    : [];

  const primaryNavLinks = [
    { label: "✦ New Arrivals", href: "/products?category=new-arrivals", highlight: true },
    { label: "Necklaces", href: "/products?category=necklaces-and-chains" },
    { label: "Rings", href: "/products?category=rings" },
    { label: "Earrings", href: "/products?category=earrings" },
    { label: "Bangles & Kada", href: "/products?category=bangles-kada" },
  ];

  const moreCategoryLinks = [
    { label: "Bracelets", href: "/products?category=bracelets" },
    { label: "Bangles & Kada", href: "/products?category=bangles-kada" },
    { label: "Watches", href: "/products?category=watches" },
    { label: "Charms", href: "/products?category=charms" },
    { label: "Hip Chains", href: "/products?category=hip-chains" },
    { label: "Anklets", href: "/products?category=anklets" },
    { label: "Kids", href: "/products?category=kids-collection" },
    { label: "✦ View All Jewelry", href: "/products" },
  ];

  const allNavLinks = [
    { label: "Shop All", href: "/products" },
    { label: "✦ New Arrivals", href: "/products?category=new-arrivals" },
    { label: "Necklaces & Chains", href: "/products?category=necklaces-and-chains" },
    { label: "Rings", href: "/products?category=rings" },
    { label: "Earrings", href: "/products?category=earrings" },
    { label: "Bangles & Kada", href: "/products?category=bangles-kada" },
    { label: "Bracelets", href: "/products?category=bracelets" },
    { label: "Watches", href: "/products?category=watches" },
    { label: "Charms", href: "/products?category=charms" },
    { label: "Hip Chains", href: "/products?category=hip-chains" },
    { label: "Anklets", href: "/products?category=anklets" },
    { label: "Kids", href: "/products?category=kids-collection" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-[#EADBBE]"
            : "bg-[#FAF7F2] border-b border-[#EADBBE]/70"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 rounded-md text-foreground hover:bg-[#F0E6D2]"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo (Clean wordmark + emblem, without crowded tagline on header) */}
            <div className="flex items-center flex-shrink-0">
              <BrandLogo variant="full" showTagline={false} />
            </div>

            {/* Desktop Navigation Links (Airy, centered, and generously spaced) */}
            <nav className="hidden lg:flex items-center justify-center flex-1 px-4 xl:px-8 gap-5 xl:gap-8">
              {primaryNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs xl:text-sm font-medium tracking-wide transition-colors whitespace-nowrap hover:text-primary ${
                      link.highlight
                        ? "text-[#8F7234] font-semibold"
                        : isActive
                        ? "text-primary font-semibold"
                        : "text-foreground/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* More Collections Dropdown */}
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs xl:text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2 cursor-pointer whitespace-nowrap"
                >
                  <span>More</span>
                  <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-200 text-muted-foreground" />
                </button>

                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                  <div className="w-52 bg-[#FFFDF9] border border-[#EADBBE] rounded-xl shadow-xl py-2 px-1 divide-y divide-[#EADBBE]/40">
                    <div className="py-1">
                      {moreCategoryLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-3 py-2 text-xs font-medium text-foreground/80 hover:text-primary hover:bg-[#FAF7F2] rounded-lg transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* Right Action Icons (Spacious, refined luxury styling) */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Currency / Region Selector */}
              {storeConfig.features.enableCurrencySwitcher && (
                <div className="relative group hidden sm:flex items-center">
                  <div className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-full border border-border/80 hover:bg-muted cursor-pointer text-foreground transition-colors shadow-2xs">
                    <span>{selectedCurrency === "QAR" ? "🇶🇦 QAR" : "🇮🇳 INR"}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div className="absolute right-0 top-full mt-1.5 w-36 bg-card border border-border shadow-xl rounded-xl py-1.5 hidden group-hover:block z-50 animate-in fade-in-0 zoom-in-95">
                    {storeConfig.commerce.supportedCurrencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCurrency(c.code)}
                        className={`w-full text-left px-3 py-2 text-xs flex justify-between items-center hover:bg-muted transition-colors ${
                          selectedCurrency === c.code ? "font-bold text-primary bg-primary/10" : "text-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{c.flag || (c.code === "QAR" ? "🇶🇦" : "🇮🇳")}</span>
                          <span>{c.code}</span>
                        </span>
                        <span className="text-[11px] text-muted-foreground">{c.symbol}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-full hover:bg-muted text-foreground flex items-center justify-center transition-colors"
                aria-label="Search products"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist Link */}
              {storeConfig.features.enableWishlist && (
                <Link
                  href="/account?tab=wishlist"
                  className="w-9 h-9 rounded-full hover:bg-muted text-foreground transition-colors relative flex items-center justify-center"
                  aria-label="Wishlist"
                >
                  <Heart className="w-4 h-4" />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-[9px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="w-9 h-9 rounded-full hover:bg-muted text-foreground transition-colors relative flex items-center justify-center"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {mounted && itemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in-75">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background shadow-2xl flex flex-col p-6 z-10 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <BrandLogo variant="full" showTagline={false} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
              {allNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-foreground hover:text-primary transition-colors py-1 px-2 rounded-lg hover:bg-muted/40"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-2 py-1">
                  Guides & Policies
                </p>
                <Link
                  href="/policies?tab=size-guide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-medium text-muted-foreground hover:text-primary py-1.5 px-2 rounded-lg hover:bg-muted/40"
                >
                  📐 Bangle & Ring Size Guide
                </Link>
                <Link
                  href="/policies?tab=care-guide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-medium text-muted-foreground hover:text-primary py-1.5 px-2 rounded-lg hover:bg-muted/40"
                >
                  ✨ Jewelry Care (304 & 306 Steel)
                </Link>
                <Link
                  href="/policies?tab=shipping"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-medium text-muted-foreground hover:text-primary py-1.5 px-2 rounded-lg hover:bg-muted/40"
                >
                  🚚 Shipping via DTDC & India Post
                </Link>
                <Link
                  href="/policies?tab=return-refund"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-medium text-muted-foreground hover:text-primary py-1.5 px-2 rounded-lg hover:bg-muted/40"
                >
                  🔄 360° Unboxing & Return Policy
                </Link>
              </div>

              <div className="pt-3 border-t border-border">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-primary py-2"
                >
                  Customer Account & Orders
                </Link>
              </div>
            </nav>

            <div className="pt-4 border-t border-border space-y-3">
              <p className="text-xs text-muted-foreground font-semibold">Destination Region & Currency</p>
              <div className="grid grid-cols-2 gap-2">
                {storeConfig.commerce.supportedCurrencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border text-center flex items-center justify-center gap-1.5 transition-all ${
                      selectedCurrency === c.code
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{c.flag || (c.code === "QAR" ? "🇶🇦" : "🇮🇳")}</span>
                    <span>{c.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
          />
          <div className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-xl overflow-hidden z-10 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Search clover necklaces, croissant hoops, anti-tarnish rings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Live Results */}
            {searchQuery.trim() && (
              <div className="p-4 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Matching Products ({searchResults.length})
                    </p>
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-muted/70 transition-colors group"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-14 h-14 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-foreground group-hover:text-primary truncate">
                            {product.title}
                          </h4>
                          <p className="text-xs text-muted-foreground capitalize">
                            {product.category}
                          </p>
                          <p className="text-xs font-bold text-foreground mt-0.5">
                            {formatPrice(
                              selectedCurrency === "QAR"
                                ? product.salePriceQatar || product.priceQatar || Math.max(10, Math.round((product.salePrice || product.price) / 20))
                                : product.salePrice || product.price,
                              selectedCurrency
                            )}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <div className="pt-2 text-center">
                      <Link
                        href={`/products?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View all results for &ldquo;{searchQuery}&rdquo; →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground text-sm">
                    No products found matching &ldquo;{searchQuery}&rdquo;. Try another term.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
