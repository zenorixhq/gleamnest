import { Metadata } from "next";
import { getAllProductsServer, getProductBySlugServer } from "@/lib/productServer";
import { ProductDetailClient } from "@/components/storefront/ProductDetailClient";
import { storeConfig } from "@/config/store.config";

/**
 * Optimized Edge Caching with ISR (revalidate: 3600).
 * - Caches rendered product pages on Vercel's global Edge Network for 1 hour.
 * - Drastically cuts Fast Origin Transfer to near zero while preserving instant page loads.
 */
export const revalidate = 3600;

/**
 * Dynamic OpenGraph & SEO Metadata for each pre-rendered product page.
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlugServer(params.slug);

  if (!product) {
    return {
      title: `Piece Not Found | ${storeConfig.meta.name}`,
      description: storeConfig.meta.description,
    };
  }

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "/images/noomis-couture-square.png";

  const description =
    product.shortDescription ||
    product.description?.slice(0, 160) ||
    storeConfig.meta.description;

  const url = `${storeConfig.meta.url}/products/${product.slug}`;

  return {
    title: `${product.title} | ${storeConfig.meta.name}`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: storeConfig.meta.name,
      title: `${product.title} | ${storeConfig.meta.name}`,
      description,
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | ${storeConfig.meta.name}`,
      description,
      images: [primaryImage],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlugServer(params.slug);

  return (
    <ProductDetailClient
      key={params.slug}
      initialProduct={product}
      allProducts={[]}
      rawSlug={params.slug}
    />
  );
}
