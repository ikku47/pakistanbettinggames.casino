import type { SystemConfig } from "./types";

/** Currencies returned by `/api/index/config` — SEO slugs are lowercase codes. */
export const CURRENCY_CODES = ["PKR", "USD", "INR", "VND", "IDR"] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];

const SYMBOLS: Record<CurrencyCode, string> = {
  PKR: "₨",
  USD: "$",
  INR: "₹",
  VND: "₫",
  IDR: "Rp",
};

export function currencySlug(code: string): string {
  return code.toLowerCase();
}

export function parseCurrencySlug(slug: string): CurrencyCode | null {
  const upper = slug.toUpperCase();
  return CURRENCY_CODES.includes(upper as CurrencyCode)
    ? (upper as CurrencyCode)
    : null;
}

export function isCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCY_CODES.includes(value.toUpperCase() as CurrencyCode);
}

export function currencySymbol(code: CurrencyCode): string {
  return SYMBOLS[code] ?? code;
}

/** Apply visitor currency choice without changing locale or API language. */
export function applyCurrencyToConfig(
  config: SystemConfig,
  code: string | null | undefined,
): SystemConfig {
  if (!code || !isCurrencyCode(code)) return config;
  const upper = code.toUpperCase() as CurrencyCode;
  const inList = config.currency.some(
    (c) => c.currencyName.toUpperCase() === upper,
  );
  if (!inList && config.currency.length > 0) {
    return config;
  }
  return {
    ...config,
    currency_code: upper,
    currency_symbol: currencySymbol(upper),
  };
}

export function availableCurrencies(config: SystemConfig): CurrencyCode[] {
  if (!config.currency.length) return [...CURRENCY_CODES];
  const fromApi = config.currency
    .map((c) => c.currencyName.toUpperCase())
    .filter((name): name is CurrencyCode => isCurrencyCode(name));
  return fromApi.length > 0 ? fromApi : [...CURRENCY_CODES];
}

export const CURRENCY_COOKIE = "preferred_currency";

/** Internal path prefix (no locale): `/pkr`, `/pkr/games`. */
export function pathWithCurrency(currency: CurrencyCode, path = "/"): string {
  const slug = currencySlug(currency);
  if (!path || path === "/") return `/${slug}`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const segments = normalized.split("/").filter(Boolean);
  if (segments[0] && parseCurrencySlug(segments[0])) {
    segments[0] = slug;
    return `/${segments.join("/")}`;
  }
  return `/${slug}${normalized}`;
}

export function currencyFromPathname(pathname: string): CurrencyCode | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment ? parseCurrencySlug(segment) : null;
}

export function replaceCurrencyInPath(
  pathname: string,
  currency: CurrencyCode,
): string {
  return pathWithCurrency(currency, pathname);
}

/** Strip leading `/pkr` for next-intl internal routes if needed. */
export function stripCurrencyPrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && parseCurrencySlug(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

/** Visitor wallet for display/SEO — independent of URL locale. */
export function getInitialCurrency(
  cookieValue: string | undefined,
  config: SystemConfig,
): CurrencyCode {
  if (cookieValue && isCurrencyCode(cookieValue)) {
    return cookieValue.toUpperCase() as CurrencyCode;
  }
  const apiDefault = config.currency_code?.toUpperCase();
  if (apiDefault && isCurrencyCode(apiDefault)) {
    return apiDefault as CurrencyCode;
  }
  return "PKR";
}
