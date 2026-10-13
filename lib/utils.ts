import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { storeConfig } from "@/config/store.config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currencyCode: string = "USD"): string {
  const currency = storeConfig.commerce.supportedCurrencies.find(
    (c) => c.code === currencyCode
  ) || storeConfig.commerce.supportedCurrencies[0];

  const converted = amount * (currency.rate || 1);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: 2,
  }).format(converted);
}

export function calculateDiscountPercent(original: number, sale: number): number {
  if (!original || original <= sale) return 0;
  return Math.round(((original - sale) / original) * 100);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
