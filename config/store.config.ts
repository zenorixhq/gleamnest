export interface StoreConfig {
  meta: {
    name: string;
    tagline: string;
    description: string;
    url: string;
    favicon: string;
  };
  brand: {
    logo: {
      text: string;
      subtext?: string;
      imageUrl?: string;
    };
    theme: {
      primary: string;         // HSL
      primaryHover: string;
      primaryForeground: string;
      accent: string;
      accentForeground: string;
      borderRadius: string;
      fontHeading: string;
      fontSans: string;
    };
    contact: {
      email: string;
      phone: string;
      whatsappNumber: string; // WhatsApp ordering phone without + or spaces
      address: string;
      hours: string;
    };
    socials: {
      instagram?: string;
      whatsapp?: string;
      facebook?: string;
    };
  };
  commerce: {
    defaultCurrency: "INR";
    supportedCurrencies: { code: string; symbol: string; name?: string; flag?: string; rate: number }[];
    freeShippingThreshold: number;
    flatShippingFee: number;
    taxRatePercent: number;
    taxInclusive: boolean;
    checkoutMode: "whatsapp" | "gateway"; // 'whatsapp' directed ordering
    activeCoupons: {
      code: string;
      discountType: "percentage" | "fixed";
      amount: number;
      minSpend?: number;
      description: string;
    }[];
  };
  features: {
    enableWishlist: boolean;
    enableReviews: boolean;
    enableQuickView: boolean;
    enableStockBadges: boolean;
    enableAnnouncementBar: boolean;
    announcementText: string;
    enableWhatsAppFloat: boolean;
    enableCurrencySwitcher: boolean;
  };
}

export const storeConfig: StoreConfig = {
  meta: {
    name: "GleamNest",
    tagline: "The place where elegance and sparkle come together.",
    description: "Waterproof & Anti-Tarnish Everyday Luxury Jewellery crafted in 18K Gold Plated 316L Stainless Steel. Wear it daily, anywhere.",
    url: "https://gleamnest.in",
    favicon: "/favicon.ico",
  },
  brand: {
    logo: {
      text: "GleamNest",
      subtext: "The place where elegance and sparkle come together.",
      imageUrl: "",
    },
    theme: {
      // Warm Champagne Gold & Rich Espresso Luxury Palette
      primary: "40 75% 38%",       // Elegant Royal Gold
      primaryHover: "40 75% 30%",
      primaryForeground: "0 0% 100%",
      accent: "158 64% 36%",        // Emerald Green accent
      accentForeground: "0 0% 100%",
      borderRadius: "0.75rem",
      fontHeading: "var(--font-heading)",
      fontSans: "var(--font-sans)",
    },
    contact: {
      email: "gleamnest.in@gmail.com",
      phone: "+91 96339 56222",
      whatsappNumber: "919633956222",
      address: "Kerala, India • Pan-India Express Delivery",
      hours: "Mon – Sat: 9:30 AM – 8:00 PM IST",
    },
    socials: {
      instagram: "https://instagram.com/gleamnest.in",
      whatsapp: "https://wa.me/919633956222",
      facebook: "https://facebook.com",
    },
  },
  commerce: {
    defaultCurrency: "INR",
    supportedCurrencies: [
      { code: "INR", symbol: "₹", name: "India (₹)", flag: "🇮🇳", rate: 1.0 },
      { code: "QAR", symbol: "QAR", name: "Qatar (QAR)", flag: "🇶🇦", rate: 1.0 },
    ],
    freeShippingThreshold: 799,
    flatShippingFee: 60,
    taxRatePercent: 0, // Direct chat pricing with inclusive pricing
    taxInclusive: true,
    checkoutMode: "whatsapp",
    activeCoupons: [
      {
        code: "GLEAM10",
        discountType: "percentage",
        amount: 10,
        description: "10% off your initial jewelry order",
      },
      {
        code: "FREESHIP",
        discountType: "fixed",
        amount: 60,
        minSpend: 500,
        description: "Complimentary Pan-India shipping",
      },
    ],
  },
  features: {
    enableWishlist: true,
    enableReviews: true,
    enableQuickView: true,
    enableStockBadges: true,
    enableAnnouncementBar: true,
    announcementText: "✨ 100% Anti-Tarnish & Waterproof Jewelry • Free Delivery in Qatar & Pan-India on Orders Above ₹799 • Order on WhatsApp",
    enableWhatsAppFloat: true,
    enableCurrencySwitcher: true,
  },
};
