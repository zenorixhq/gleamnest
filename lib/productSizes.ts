export interface ProductSizeInfo {
  type: "ring" | "bangle";
  label: string;
  defaultSize: string;
  options: string[];
  sizeStock?: Record<string, number>;
  isAdjustableOnly: boolean;
}

export const RING_SPECIFIC_SIZES = [
  "Size 5 (5.0 cm)",
  "Size 6 (5.5 cm)",
  "Size 7 (6.0 cm)",
  "Size 8 (6.5 cm)",
  "Size 9 (7.0 cm)",
  "Size 10 (7.5 cm)",
  "Size 11 (8.0 cm)",
  "Size 12 (8.5 cm)",
  "Size 13 (9.0 cm)",
  "Size 14 (9.5 cm)",
];

export const RING_SIZE_GUIDE_DATA = [
  { size: "Size 5", cm: "5.0 cm", mm: "50 mm", fit: "Petite / Pinky Finger" },
  { size: "Size 6", cm: "5.5 cm", mm: "55 mm", fit: "Petite Ring Finger" },
  { size: "Size 7", cm: "6.0 cm", mm: "60 mm", fit: "Standard Ring Finger (Most Popular)", popular: true },
  { size: "Size 8", cm: "6.5 cm", mm: "65 mm", fit: "Medium / Middle Finger" },
  { size: "Size 9", cm: "7.0 cm", mm: "70 mm", fit: "Middle / Index Finger" },
  { size: "Size 10", cm: "7.5 cm", mm: "75 mm", fit: "Index / Thumb Ring" },
  { size: "Size 11", cm: "8.0 cm", mm: "80 mm", fit: "Thumb / Statement Ring" },
  { size: "Size 12", cm: "8.5 cm", mm: "85 mm", fit: "Statement / Large Fit" },
  { size: "Size 13", cm: "9.0 cm", mm: "90 mm", fit: "Extra Large Fit" },
  { size: "Size 14", cm: "9.5 cm", mm: "95 mm", fit: "Extra Large / Thumb Fit" },
];

export const RING_ADJUSTABLE_OPTION = "Adjustable / Free Size";

// Backwards compatibility export
export const RING_SIZES = RING_SPECIFIC_SIZES;

export const BANGLE_SPECIFIC_SIZES = [
  "Size 2-2 (2.125\" - Small)",
  "Size 2-6 (2.375\" - Standard)",
  "Size 2-8 (2.50\" - Large)",
];

export const BANGLE_SIZE_GUIDE_DATA = [
  { size: "Size 2-2", inches: "2.125 in (2 1/8\")", cm: "5.40 cm", fit: "Petite / Small wrist fit" },
  { size: "Size 2-6", inches: "2.375 in (2 3/8\")", cm: "6.03 cm", fit: "Standard Medium wrist fit (Most Popular)", popular: true },
  { size: "Size 2-8", inches: "2.500 in (2 1/2\")", cm: "6.35 cm", fit: "Large wrist fit" },
];

export const BANGLE_ADJUSTABLE_OPTION = "Adjustable / Openable Cuff";

// Backwards compatibility export
export const BANGLE_SIZES = BANGLE_SPECIFIC_SIZES;

export function getProductSizeInfo(product?: {
  category?: string;
  subcategory?: string;
  title?: string;
  description?: string;
  tags?: string[];
  variantAttributes?: { name: string; options: string[]; sizeStock?: Record<string, number> }[];
}): ProductSizeInfo | null {
  if (!product) return null;

  const explicitSizeAttr = product.variantAttributes?.find((attr) =>
    /size/i.test(attr.name)
  );

  const cat = (product.category || "").toLowerCase();
  const sub = (product.subcategory || "").toLowerCase();
  const title = (product.title || "").toLowerCase();
  const desc = (product.description || "").toLowerCase();
  const tagsStr = (product.tags || []).join(" ").toLowerCase();

  const isRing =
    cat === "rings" ||
    cat === "ring" ||
    sub.includes("ring") ||
    /\b(ring|rings|band|bands|solitaire)\b/i.test(title);

  const isBangle =
    cat === "bangles-kada" ||
    cat === "bangle" ||
    cat === "bangles" ||
    cat === "kada" ||
    cat === "kadas" ||
    sub.includes("bangle") ||
    sub.includes("kada") ||
    /\b(bangle|bangles|kada|kadas|cuff|cuffs)\b/i.test(title);

  if (isRing) {
    if (explicitSizeAttr && explicitSizeAttr.options?.length > 0) {
      const isAdjustable =
        explicitSizeAttr.options.length === 1 &&
        /adjustable|free size/i.test(explicitSizeAttr.options[0]);

      if (isAdjustable) {
        return {
          type: "ring",
          label: explicitSizeAttr.name || "Ring Size",
          defaultSize: explicitSizeAttr.options[0] || RING_ADJUSTABLE_OPTION,
          options: [explicitSizeAttr.options[0] || RING_ADJUSTABLE_OPTION],
          sizeStock: explicitSizeAttr.sizeStock,
          isAdjustableOnly: true,
        };
      } else {
        // Admin chose Specific Sizes -> Omit any adjustable option
        const cleanedSizes = explicitSizeAttr.options.filter(
          (o) => !/adjustable|free size/i.test(o)
        );
        const sizesToUse = cleanedSizes.length > 0 ? cleanedSizes : RING_SPECIFIC_SIZES;
        const sizeStock = explicitSizeAttr.sizeStock;

        // Choose first in-stock size as default, or standard size
        let defaultSize = sizesToUse.includes("Size 7 (6.0 cm)")
          ? "Size 7 (6.0 cm)"
          : sizesToUse.includes("Size 6 (5.5 cm)")
          ? "Size 6 (5.5 cm)"
          : sizesToUse[0];

        if (sizeStock) {
          const firstInStock = sizesToUse.find((s) => (sizeStock[s] ?? 0) > 0);
          if (firstInStock) {
            defaultSize = firstInStock;
          }
        }

        return {
          type: "ring",
          label: explicitSizeAttr.name || "Ring Size",
          defaultSize,
          options: sizesToUse,
          sizeStock,
          isAdjustableOnly: false,
        };
      }
    }

    // Heuristic if no explicit attribute: check if title, desc, or tags say adjustable
    const isAdjustableByText =
      /\b(adjustable|free size)\b/i.test(title) ||
      /\b(adjustable|free size)\b/i.test(desc) ||
      /\b(adjustable|free size)\b/i.test(tagsStr);

    if (isAdjustableByText) {
      return {
        type: "ring",
        label: "Ring Size",
        defaultSize: RING_ADJUSTABLE_OPTION,
        options: [RING_ADJUSTABLE_OPTION],
        isAdjustableOnly: true,
      };
    }

    return {
      type: "ring",
      label: "Ring Size",
      defaultSize: "Size 7 (6.0 cm)",
      options: RING_SPECIFIC_SIZES,
      isAdjustableOnly: false,
    };
  }

  if (isBangle) {
    if (explicitSizeAttr && explicitSizeAttr.options?.length > 0) {
      const isAdjustable =
        explicitSizeAttr.options.length === 1 &&
        /adjustable|openable|cuff|free size/i.test(explicitSizeAttr.options[0]);

      if (isAdjustable) {
        return {
          type: "bangle",
          label: explicitSizeAttr.name || "Bangle Size",
          defaultSize: explicitSizeAttr.options[0] || BANGLE_ADJUSTABLE_OPTION,
          options: [explicitSizeAttr.options[0] || BANGLE_ADJUSTABLE_OPTION],
          sizeStock: explicitSizeAttr.sizeStock,
          isAdjustableOnly: true,
        };
      } else {
        // Admin chose Specific Sizes -> Omit any adjustable option
        const cleanedSizes = explicitSizeAttr.options.filter(
          (o) => !/adjustable|openable|cuff|free size/i.test(o)
        );
        const sizesToUse = cleanedSizes.length > 0 ? cleanedSizes : BANGLE_SPECIFIC_SIZES;
        const sizeStock = explicitSizeAttr.sizeStock;

        // Choose first in-stock size as default, or standard size
        let defaultSize = sizesToUse.includes("Size 2-6 (2.375\" - Standard)")
          ? "Size 2-6 (2.375\" - Standard)"
          : sizesToUse[0];

        if (sizeStock) {
          const firstInStock = sizesToUse.find((s) => (sizeStock[s] ?? 0) > 0);
          if (firstInStock) {
            defaultSize = firstInStock;
          }
        }

        return {
          type: "bangle",
          label: explicitSizeAttr.name || "Bangle Size",
          defaultSize,
          options: sizesToUse,
          sizeStock,
          isAdjustableOnly: false,
        };
      }
    }

    // Heuristic if no explicit attribute
    const isAdjustableByText =
      /\b(adjustable|openable|cuff|free size)\b/i.test(title) ||
      /\b(adjustable|openable|cuff|free size)\b/i.test(desc) ||
      /\b(adjustable|openable|cuff|free size)\b/i.test(tagsStr);

    if (isAdjustableByText) {
      return {
        type: "bangle",
        label: "Bangle Size",
        defaultSize: BANGLE_ADJUSTABLE_OPTION,
        options: [BANGLE_ADJUSTABLE_OPTION],
        isAdjustableOnly: true,
      };
    }

    return {
      type: "bangle",
      label: "Bangle Size",
      defaultSize: "Size 2-6 (2.375\" - Standard)",
      options: BANGLE_SPECIFIC_SIZES,
      isAdjustableOnly: false,
    };
  }

  if (explicitSizeAttr) {
    const isAdjustable =
      explicitSizeAttr.options.length === 1 &&
      /adjustable|free size/i.test(explicitSizeAttr.options[0]);
    return {
      type: "ring",
      label: explicitSizeAttr.name,
      defaultSize: explicitSizeAttr.options[0] || "",
      options: explicitSizeAttr.options,
      sizeStock: explicitSizeAttr.sizeStock,
      isAdjustableOnly: isAdjustable,
    };
  }

  return null;
}
