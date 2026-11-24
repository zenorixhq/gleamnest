/**
 * Centralized Category Matching Utility for Noomi's Couture
 *
 * Guarantees 100% identical piece counts and category filtering across:
 * - Storefront catalog (/products)
 * - Admin inventory dashboard (/admin)
 * - Dynamic category product counts (/api/categories)
 * - Product detail related pieces (/products/[slug])
 *
 * Strictly prevents earring/ring cross-contamination and bangle/baby-bangle collisions.
 */

export function normalizeCategorySlug(s: string): string {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-");
}

export function isCategorySlugMatch(catSlug: string, targetSlug: string): boolean {
  if (!catSlug || !targetSlug) return false;
  const a = normalizeCategorySlug(catSlug);
  const b = normalizeCategorySlug(targetSlug);
  if (a === b) return true;

  // 1. Earrings vs Rings - STRICT segregation (preventing "ring" substring match inside "earrings")
  const aIsEarring =
    a === "earrings" ||
    a === "earring" ||
    a.includes("earring") ||
    a.includes("jhumka");
  const bIsEarring =
    b === "earrings" ||
    b === "earring" ||
    b.includes("earring") ||
    b.includes("jhumka");
  if (aIsEarring || bIsEarring) {
    return aIsEarring && bIsEarring;
  }

  const aIsRing = a === "rings" || a === "ring";
  const bIsRing = b === "rings" || b === "ring";
  if (aIsRing || bIsRing) {
    return aIsRing && bIsRing;
  }

  // 2. Baby Bangles (2.2) vs standard Bangles / Kada
  // "baby-bangles-2-2" is a specific subcategory and must NOT match general bangles
  const aIsBabyBangles = a === "baby-bangles-2-2" || a.includes("baby");
  const bIsBabyBangles = b === "baby-bangles-2-2" || b.includes("baby");
  if (aIsBabyBangles || bIsBabyBangles) {
    return aIsBabyBangles && bIsBabyBangles;
  }

  const aIsBangle =
    a === "bangles" ||
    a === "bangle" ||
    a === "bangles-kada" ||
    a === "kada" ||
    a === "kadas";
  const bIsBangle =
    b === "bangles" ||
    b === "bangle" ||
    b === "bangles-kada" ||
    b === "kada" ||
    b === "kadas";
  if (aIsBangle || bIsBangle) {
    return aIsBangle && bIsBangle;
  }

  // 3. Charm Necklaces vs Pendants vs Necklaces/Chains
  const aIsCharm =
    a === "charm-necklace" ||
    a === "charm-necklaces" ||
    a === "charms" ||
    a === "charm";
  const bIsCharm =
    b === "charm-necklace" ||
    b === "charm-necklaces" ||
    b === "charms" ||
    b === "charm";
  if (aIsCharm || bIsCharm) {
    return aIsCharm && bIsCharm;
  }

  const aIsPendant = a === "pendants" || a === "pendant";
  const bIsPendant = b === "pendants" || b === "pendant";
  if (aIsPendant || bIsPendant) {
    return aIsPendant && bIsPendant;
  }

  const aIsNecklace =
    a === "necklaces" ||
    a === "necklace" ||
    a === "necklaces-and-chains" ||
    a === "necklaces-chains" ||
    a === "chains" ||
    a === "chain";
  const bIsNecklace =
    b === "necklaces" ||
    b === "necklace" ||
    b === "necklaces-and-chains" ||
    b === "necklaces-chains" ||
    b === "chains" ||
    b === "chain";
  if (aIsNecklace || bIsNecklace) {
    return aIsNecklace && bIsNecklace;
  }

  // 4. Bracelets
  if (
    (a === "bracelets" || a === "bracelet") &&
    (b === "bracelets" || b === "bracelet")
  ) {
    return true;
  }

  // 5. Watches
  if (
    (a === "watches" || a === "watch") &&
    (b === "watches" || b === "watch")
  ) {
    return true;
  }

  // 6. Anklets
  if (
    (a === "anklets" || a === "anklet") &&
    (b === "anklets" || b === "anklet")
  ) {
    return true;
  }

  // 7. Hand Chains / Hip Chains
  if (
    (a === "hand-chains" || a === "hand-chain" || a.includes("hip")) &&
    (b === "hand-chains" || b === "hand-chain" || b.includes("hip"))
  ) {
    return true;
  }

  // 8. Mangalsutra
  if (
    (a === "mangalsutra" || a.includes("mangal")) &&
    (b === "mangalsutra" || b.includes("mangal"))
  ) {
    return true;
  }

  return false;
}

export function matchesCategory(
  product: { category: string; isNewArrival?: boolean },
  targetSlug: string
): boolean {
  if (!targetSlug || targetSlug === "all") return true;
  if (targetSlug === "new-arrivals") {
    return Boolean(product.isNewArrival || product.category === "new-arrivals");
  }

  const pCat = normalizeCategorySlug(product.category);
  const tSlug = normalizeCategorySlug(targetSlug);

  return isCategorySlugMatch(pCat, tSlug);
}
