import type { Metadata } from "next";
import "./globals.css";
import { storeConfig } from "@/config/store.config";
import { AnnouncementBar } from "@/components/storefront/AnnouncementBar";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { CartDrawer } from "@/components/storefront/CartDrawer";
import { QuickViewModal } from "@/components/storefront/QuickViewModal";
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat";
import { SmoothScrollProvider } from "@/components/common/SmoothScrollProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://gleamnest.in"),
  title: {
    default: `${storeConfig.meta.name} | ${storeConfig.meta.tagline}`,
    template: `%s | ${storeConfig.meta.name}`,
  },
  description: storeConfig.meta.description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://gleamnest.in",
    siteName: "GleamNest",
    title: `${storeConfig.meta.name} | ${storeConfig.meta.tagline}`,
    description: storeConfig.meta.description,
    images: [
      {
        url: "/images/brand-logo-mark-raw.png",
        width: 1024,
        height: 1024,
        alt: "GleamNest Luxury Jewelry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${storeConfig.meta.name} | ${storeConfig.meta.tagline}`,
    description: storeConfig.meta.description,
    images: ["/images/brand-logo-mark-raw.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = storeConfig.brand;

  const dynamicThemeStyles = {
    "--primary": theme.primary,
    "--primary-hover": theme.primaryHover,
    "--primary-foreground": theme.primaryForeground,
    "--accent": theme.accent,
    "--accent-foreground": theme.accentForeground,
    "--radius": theme.borderRadius,
  } as React.CSSProperties;

  return (
    <html lang="en" style={dynamicThemeStyles}>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground">
        <SmoothScrollProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />

          {/* Global Slide-overs & Modals */}
          <CartDrawer />
          <QuickViewModal />
          <WhatsAppFloat />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
