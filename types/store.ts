export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "CAD" | "AUD";

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size / Color"
  sku: string;
  price: number;
  salePrice?: number;
  inStock: boolean;
  stockCount: number;
  options: { [key: string]: string }; // e.g. { size: "M", color: "Slate Blue" }
  image?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  category: string;
  subcategory?: string;
  tags: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  variants?: ProductVariant[];
  variantAttributes?: {
    name: string; // e.g., "Size", "Color"
    options: string[]; // e.g., ["S", "M", "L"]
  }[];
  specifications?: { [key: string]: string };
  reviews?: Review[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariant?: {
    id: string;
    name: string;
    options: { [key: string]: string };
  };
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  amount: number; // percentage (e.g. 10 for 10%) or fixed amount
  minimumSpend?: number;
  description: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  estimatedDays: string;
  price: number;
  freeAbove?: number;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  taxTotal: number;
  grandTotal: number;
  couponCode?: string;
  paymentMethod: "card" | "cod" | "paypal" | "razorpay";
  trackingNumber?: string;
}
