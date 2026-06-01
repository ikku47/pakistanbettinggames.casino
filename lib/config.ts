import type { AppLocale } from "@/i18n/routing";
import type { SystemConfig } from "./types";

export const siteConfig = {
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pakistanbettinggames.casino",
  utmSource: "pakistanbettinggames",
  utmMedium: "seo",
} as const;

export const apiConfig = {
  baseUrl: process.env.GAME_API_BASE_URL ?? "https://h5.wdclus002.com",
  bearerToken: process.env.GAME_API_TOKEN ?? "",
  platform: process.env.GAME_API_PLATFORM ?? "3",
  apiVersion: "v1",
  revalidateSeconds: Number(process.env.GAME_API_REVALIDATE ?? 3600),
} as const;

export function assetUrl(
  path: string | null | undefined,
  config: SystemConfig,
): string {
  if (!path) return "/placeholder-game.svg";
  if (path.startsWith("http")) return path;
  const base = (config.aws_access_domain || apiConfig.baseUrl).replace(
    /\/$/,
    "",
  );
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function playUrl(
  config: SystemConfig,
  opts?: {
    gameCode?: string;
    category?: string;
    locale?: AppLocale;
    currency?: string;
  },
): string {
  const raw =
    config.app_call_h5_domain ||
    process.env.NEXT_PUBLIC_PLATFORM_URL ||
    "https://h5.wdclus0001.com";
  const url = new URL(raw.endsWith("/") ? raw : `${raw}/`);
  url.searchParams.set("utm_source", siteConfig.utmSource);
  url.searchParams.set("utm_medium", siteConfig.utmMedium);
  if (opts?.gameCode) url.searchParams.set("game", opts.gameCode);
  if (opts?.category) url.searchParams.set("category", opts.category);
  if (opts?.locale) url.searchParams.set("lang", opts.locale);
  if (opts?.currency) url.searchParams.set("currency", opts.currency);
  return url.toString();
}

export function downloadUrl(config: SystemConfig): string {
  return config.app_download_url || playUrl(config);
}

export function defaultCurrency(config: SystemConfig) {
  const def = config.currency.find((c) => c.isDefault === "0");
  const fallback = config.currency[0];
  return {
    code: config.currency_code || def?.currencyName || fallback?.currencyName || "PKR",
    symbol: config.currency_symbol || "₨",
  };
}
