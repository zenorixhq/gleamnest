import { Product } from "@/types/store";

export interface ColorSwatchInfo {
  label: string;
  cssBackground: string;
  borderColor?: string;
  isMetallic?: boolean;
}

export const KNOWN_COLOR_SWATCHES: Record<string, ColorSwatchInfo> = {
  gold: {
    label: "Gold",
    cssBackground: "linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #92400E 100%)",
    borderColor: "#B45309",
    isMetallic: true,
  },
  "yellow gold": {
    label: "Yellow Gold",
    cssBackground: "linear-gradient(135deg, #FDE68A 0%, #EAB308 50%, #A16207 100%)",
    borderColor: "#854D0E",
    isMetallic: true,
  },
  "rose gold": {
    label: "Rose Gold",
    cssBackground: "linear-gradient(135deg, #FED7AA 0%, #FB7185 50%, #BE123C 100%)",
    borderColor: "#9F1239",
    isMetallic: true,
  },
  silver: {
    label: "Silver",
    cssBackground: "linear-gradient(135deg, #FFFFFF 0%, #E5E7EB 50%, #9CA3AF 100%)",
    borderColor: "#9CA3AF",
    isMetallic: true,
  },
  rhodium: {
    label: "Rhodium Silver",
    cssBackground: "linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 50%, #94A3B8 100%)",
    borderColor: "#64748B",
    isMetallic: true,
  },
  platinum: {
    label: "Platinum",
    cssBackground: "linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 50%, #64748B 100%)",
    borderColor: "#475569",
    isMetallic: true,
  },
  white: {
    label: "White",
    cssBackground: "#FFFFFF",
    borderColor: "#D1D5DB",
  },
  black: {
    label: "Black",
    cssBackground: "#1C1917",
    borderColor: "#292524",
  },
  green: {
    label: "Green",
    cssBackground: "#15803D",
    borderColor: "#166534",
  },
  emerald: {
    label: "Emerald Green",
    cssBackground: "#047857",
    borderColor: "#065F46",
  },
  red: {
    label: "Red",
    cssBackground: "#DC2626",
    borderColor: "#991B1B",
  },
  ruby: {
    label: "Ruby Red",
    cssBackground: "#991B1B",
    borderColor: "#7F1D1D",
  },
  blue: {
    label: "Blue",
    cssBackground: "#2563EB",
    borderColor: "#1D4ED8",
  },
  sapphire: {
    label: "Sapphire Blue",
    cssBackground: "#1E40AF",
    borderColor: "#1E3A8A",
  },
  pink: {
    label: "Pink",
    cssBackground: "#F472B6",
    borderColor: "#DB2777",
  },
  yellow: {
    label: "Yellow",
    cssBackground: "#FACC15",
    borderColor: "#CA8A04",
  },
  purple: {
    label: "Purple",
    cssBackground: "#A855F7",
    borderColor: "#7E22CE",
  },
  lavender: {
    label: "Lavender",
    cssBackground: "linear-gradient(135deg, #EDE9FE 0%, #C4B5FD 50%, #8B5CF6 100%)",
    borderColor: "#7C3AED",
  },
  maroon: {
    label: "Maroon",
    cssBackground: "linear-gradient(135deg, #991B1B 0%, #7F1D1D 50%, #450A0A 100%)",
    borderColor: "#450A0A",
  },
  merroon: {
    label: "Maroon",
    cssBackground: "linear-gradient(135deg, #991B1B 0%, #7F1D1D 50%, #450A0A 100%)",
    borderColor: "#450A0A",
  },
  brown: {
    label: "Brown",
    cssBackground: "linear-gradient(135deg, #A16207 0%, #78350F 50%, #451A03 100%)",
    borderColor: "#451A03",
  },
  multi: {
    label: "Multi",
    cssBackground: "linear-gradient(135deg, #F43F5E 0%, #A855F7 35%, #3B82F6 70%, #10B981 100%)",
    borderColor: "#A855F7",
  },
  classic: {
    label: "Classic Gold",
    cssBackground: "linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #92400E 100%)",
    borderColor: "#B45309",
    isMetallic: true,
  },
  "two-tone": {
    label: "Two-Tone",
    cssBackground: "linear-gradient(135deg, #D4AF37 50%, #C0C0C0 50%)",
    borderColor: "#92400E",
    isMetallic: true,
  },
  "black & white": {
    label: "Black & White",
    cssBackground: "linear-gradient(135deg, #1C1917 50%, #FFFFFF 50%)",
    borderColor: "#57534E",
  },
};

export function getColorSwatch(colorName: string): ColorSwatchInfo {
  const normalized = (colorName || "").toLowerCase().trim();
  if (KNOWN_COLOR_SWATCHES[normalized]) {
    return KNOWN_COLOR_SWATCHES[normalized];
  }

  for (const [key, swatch] of Object.entries(KNOWN_COLOR_SWATCHES)) {
    if (normalized.includes(key)) {
      return swatch;
    }
  }

  return {
    label: colorName,
    cssBackground: "#D4AF37",
    borderColor: "#B45309",
    isMetallic: true,
  };
}

const COLOR_NAMES = [
  "Yellow Gold", "Rose Gold", "Gold", "Silver", "Rhodium", "Platinum",
  "White", "Black", "Green", "Emerald", "Red", "Ruby", "Blue", "Sapphire",
  "Pink", "Yellow", "Purple", "Lavender", "Maroon", "Merroon", "Brown",
  "Multi", "Two-Tone", "Black & White"
];
const colorRegexPart = COLOR_NAMES.map((c) => c.replace(/\s+/g, "\\s+")).join("|");

/**
 * Extracts base product title and color name from product titles like:
 * - "Simple Tulip Bracelet - Red" -> base: "Simple Tulip Bracelet", color: "Red"
 * - "Simple Tulip Bracelet- White " -> base: "Simple Tulip Bracelet", color: "White"
 * - "Adjustable Full Stone Ring - Blue" -> base: "Adjustable Full Stone Ring", color: "Blue"
 * - "Adjustable full stone ring - lavender" -> base: "Adjustable full stone ring", color: "lavender"
 * - "Wintage watch white Dial" -> base: "Wintage watch", color: "white"
 * - "White dial sleak watch" -> base: "sleak watch", color: "White"
 * - "Blue dial premium watch" -> base: "premium watch", color: "Blue"
 * - "Double shade sleak watch merroon" -> base: "Double shade sleak watch", color: "merroon"
 * - "Rose gold Bubble brown watch" -> base: "Rose gold bubble watch", color: "brown"
 */
export function extractBaseTitleAndColor(title: string): { baseTitle: string; color: string | null } {
  if (!title) return { baseTitle: "", color: null };
  const t = title.trim();

  // Pattern 1: Title with separator and color at the end (e.g. "Simple Tulip Bracelet - Red")
  const suffixSepRegex = new RegExp(`^(.*?)\\s*[-–—/]\\s*(${colorRegexPart})\\s*$`, "i");
  const mSuffixSep = t.match(suffixSepRegex);
  if (mSuffixSep && mSuffixSep[1].trim()) {
    return {
      baseTitle: mSuffixSep[1].trim(),
      color: mSuffixSep[2].trim(),
    };
  }

  // Pattern 2a: Watch with dial suffix (e.g. "Wintage watch white Dial", "Wintage watch pink dial")
  const dialSuffixRegex = new RegExp(`^(.*?)\\s+(${colorRegexPart})\\s+dial\\s*$`, "i");
  const mDialSuffix = t.match(dialSuffixRegex);
  if (mDialSuffix && mDialSuffix[1].trim()) {
    return {
      baseTitle: mDialSuffix[1].trim(),
      color: mDialSuffix[2].trim(),
    };
  }

  // Pattern 2b: Watch with dial prefix (e.g. "White dial sleak watch", "Blue dial premium watch")
  const dialPrefixRegex = new RegExp(`^(${colorRegexPart})\\s+dial\\s+(.*?)$`, "i");
  const mDialPrefix = t.match(dialPrefixRegex);
  if (mDialPrefix && mDialPrefix[2].trim()) {
    return {
      baseTitle: mDialPrefix[2].trim(),
      color: mDialPrefix[1].trim(),
    };
  }

  // Pattern 3: Bubble watch patterns (e.g. "Rose gold Bubble brown watch", "Rose gold green bubble watch")
  const bubbleRegex = new RegExp(`^Rose gold\\s+(Bubble\\s+)?(${colorRegexPart})\\s+(bubble\\s+)?watch$`, "i");
  const mBubble = t.match(bubbleRegex);
  if (mBubble) {
    return {
      baseTitle: "Rose gold bubble watch",
      color: mBubble[2].trim(),
    };
  }

  // Pattern 4: Color at the very end without separator (e.g. "Double shade sleak watch merroon")
  const endColorRegex = new RegExp(`^(.*?)\\s+(${colorRegexPart})\\s*$`, "i");
  const mEndColor = t.match(endColorRegex);
  if (mEndColor && mEndColor[1].trim()) {
    return {
      baseTitle: mEndColor[1].trim(),
      color: mEndColor[2].trim(),
    };
  }

  // Pattern 5: Title starting with color (e.g. "Red Tulip Bracelet", "Green Flies Bracelet")
  const prefixMatch = t.match(
    new RegExp(`^(${colorRegexPart})\\s+(.*?)$`, "i")
  );
  if (prefixMatch && prefixMatch[2].trim()) {
    return {
      baseTitle: prefixMatch[2].trim(),
      color: prefixMatch[1].trim(),
    };
  }

  return {
    baseTitle: t,
    color: null,
  };
}

export interface UnifiedColorOption {
  id: string;
  name: string;
  swatch: ColorSwatchInfo;
  image: string;
  isCurrent: boolean;
  productSlug?: string;
  price?: number;
  salePrice?: number;
  inStock: boolean;
  stockCount: number;
  isLinkedProduct: boolean;
  targetProduct?: Product;
}

function normalizeBaseTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(
      /\b(adjustable|free size|collection|ring|rings|bracelet|bracelets|necklace|necklaces|bangle|bangles|watch|watches|dial)\b/gi,
      ""
    )
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Finds all products in the catalog that represent different color variants of the same piece.
 */
export function getLinkedColorProducts(
  currentProduct: Product,
  allProducts: Product[]
): UnifiedColorOption[] {
  if (!currentProduct || !Array.isArray(allProducts) || allProducts.length === 0) {
    return [];
  }

  const { baseTitle: currentBase, color: currentColor } = extractBaseTitleAndColor(currentProduct.title);
  const currentNorm = normalizeBaseTitle(currentBase || currentProduct.title);

  if (currentNorm.length < 3) {
    return [];
  }

  const currentCategory = (currentProduct.category || "").toLowerCase().trim();

  const matchingProducts: { product: Product; color: string }[] = [];
  const seenIds = new Set<string>();

  for (const p of allProducts) {
    if (seenIds.has(p.id)) continue;
    const pCategory = (p.category || "").toLowerCase().trim();
    if (pCategory !== currentCategory) continue;

    const { baseTitle: pBase, color: pColor } = extractBaseTitleAndColor(p.title);
    const pNorm = normalizeBaseTitle(pBase || p.title);

    const isBaseMatch =
      pBase.toLowerCase() === currentBase.toLowerCase() ||
      (currentNorm.length >= 4 && pNorm === currentNorm);

    if (isBaseMatch) {
      seenIds.add(p.id);
      const effectiveColor = pColor || (p.id === currentProduct.id ? currentColor : null) || "Classic";
      matchingProducts.push({
        product: p,
        color: effectiveColor,
      });
    }
  }

  if (matchingProducts.length <= 1) {
    return [];
  }

  return matchingProducts.map(({ product, color }) => {
    const isCurrent = product.id === currentProduct.id || product.slug === currentProduct.slug;
    const swatch = getColorSwatch(color);
    const displayName = swatch.label || color;
    return {
      id: product.id,
      name: displayName,
      swatch,
      image: product.images?.[0] || "",
      isCurrent,
      productSlug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      inStock: product.inStock !== false && (product.stockCount === undefined || product.stockCount > 0),
      stockCount: product.stockCount ?? 1,
      isLinkedProduct: true,
      targetProduct: product,
    };
  });
}

/**
 * Returns unified color options for a product, combining:
 * 1. Catalog-linked products (e.g. Simple Tulip Bracelet - Red vs White)
 * 2. Intra-product variant attributes ("Color" or "Finish")
 */
export function getAllColorOptionsForProduct(
  currentProduct: Product,
  allProducts: Product[],
  selectedColorOption?: string
): {
  colorOptions: UnifiedColorOption[];
  hasMultipleColors: boolean;
  currentColorName: string;
  isLinkedCatalogGroup: boolean;
} {
  // 1. Check if this product has catalog-linked products (same piece in different colors)
  const linkedOptions = getLinkedColorProducts(currentProduct, allProducts);
  if (linkedOptions.length > 1) {
    const currentOpt = linkedOptions.find((o) => o.isCurrent);
    return {
      colorOptions: linkedOptions,
      hasMultipleColors: true,
      currentColorName: currentOpt?.name || "Selected Color",
      isLinkedCatalogGroup: true,
    };
  }

  // 2. Check internal variantAttributes for "Color" or "Finish"
  const colorAttr = currentProduct.variantAttributes?.find((a) =>
    /colou?r|finish|metal/i.test(a.name)
  );

  if (colorAttr && colorAttr.options && colorAttr.options.length > 0) {
    const activeColor = selectedColorOption || colorAttr.options[0];
    const options: UnifiedColorOption[] = colorAttr.options.map((optName, index) => {
      const isCurrent = optName === activeColor;
      const explicitImg = colorAttr.colorImages?.[optName];
      const fallbackImg = currentProduct.images?.[index] || currentProduct.images?.[0] || "";
      const swatch = getColorSwatch(optName);

      return {
        id: `variant-color-${optName}`,
        name: swatch.label || optName,
        swatch,
        image: explicitImg || fallbackImg,
        isCurrent,
        price: currentProduct.price,
        salePrice: currentProduct.salePrice,
        inStock: currentProduct.inStock !== false,
        stockCount: currentProduct.stockCount ?? 1,
        isLinkedProduct: false,
      };
    });

    return {
      colorOptions: options,
      hasMultipleColors: options.length > 1,
      currentColorName: activeColor,
      isLinkedCatalogGroup: false,
    };
  }

  // 3. Fallback: single color piece
  const { color } = extractBaseTitleAndColor(currentProduct.title);
  const singleColorName = color || "Classic";
  const singleSwatch = getColorSwatch(singleColorName);

  return {
    colorOptions: [
      {
        id: currentProduct.id,
        name: singleSwatch.label || singleColorName,
        swatch: singleSwatch,
        image: currentProduct.images?.[0] || "",
        isCurrent: true,
        productSlug: currentProduct.slug,
        price: currentProduct.price,
        salePrice: currentProduct.salePrice,
        inStock: currentProduct.inStock !== false,
        stockCount: currentProduct.stockCount ?? 1,
        isLinkedProduct: false,
      },
    ],
    hasMultipleColors: false,
    currentColorName: singleSwatch.label || singleColorName,
    isLinkedCatalogGroup: false,
  };
}
