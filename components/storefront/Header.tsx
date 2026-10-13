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

  const navLinks = [
    { label: "Shop All", href: "/products" },
    { label: "Necklaces", href: "/products?category=necklaces" },
    { label: "Bracelets", href: "/products?category=bracelets" },
    { label: "Earrings", href: "/products?category=earrings" },
    { label: "Rings", href: "/products?category=rings" },
    { label: "Anklets", href: "/products?category=anklets" },
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

            {/* Brand Logo & Tagline */}
            <div className="flex items-center">
              <BrandLogo variant="full" showTagline={true} />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                      isActive ? "text-primary font-semibold" : "text-foreground/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Currency Selector */}
              {storeConfig.features.enableCurrencySwitcher && (
                <div className="relative group hidden sm:flex items-center">
                  <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer text-muted-foreground hover:text-foreground">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{selectedCurrency}</span>
                    <ChevronDown className="w-3 h-3" />
                  </div>
                  <div className="absolute right-0 top-full mt-1 w-28 bg-card border border-border shadow-lg rounded-md py-1 hidden group-hover:block z-50">
                    {storeConfig.commerce.supportedCurrencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCurrency(c.code)}
                        className={`w-full text-left px-3 py-1.5 text-xs flex justify-between items-center hover:bg-muted ${
                          selectedCurrency === c.code ? "font-bold text-primary" : "text-foreground"
                        }`}
                      >
                        <span>{c.code}</span>
                        <span className="text-muted-foreground">{c.symbol}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-muted text-foreground transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              {storeConfig.features.enableWishlist && (
                <Link
                  href="/account?tab=wishlist"
                  className="p-2 sm:p-2.5 rounded-full hover:bg-muted text-foreground transition-colors relative flex items-center justify-center min-w-[40px] min-h-[40px]"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-accent text-accent-foreground text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                className="p-2 sm:p-2.5 rounded-full hover:bg-muted text-foreground transition-colors relative flex items-center justify-center min-w-[40px] min-h-[40px]"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-primary text-primary-foreground text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in-75">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Admin Portal Shortcut */}
              <Link
                href="/admin"
                className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary border border-border px-2.5 py-1.5 rounded-full hover:border-primary transition-all"
                title="Merchant Admin Panel"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
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

            <nav className="flex-1 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-semibold text-primary py-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Merchant Admin Dashboard</span>
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-muted-foreground py-2"
                >
                  Customer Account & Orders
                </Link>
              </div>
            </nav>

            <div className="pt-4 border-t border-border space-y-3">
              <p className="text-xs text-muted-foreground">Currency</p>
              <div className="grid grid-cols-4 gap-2">
                {storeConfig.commerce.supportedCurrencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    className={`py-1.5 text-xs font-semibold rounded border text-center ${
                      selectedCurrency === c.code
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {c.code}
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
                            {formatPrice(product.salePrice || product.price, selectedCurrency)}
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
