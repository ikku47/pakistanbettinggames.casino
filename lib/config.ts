import { PAGE_REVALIDATE_SECONDS } from "./cache";
import type { SystemConfig } from "./types";

export const siteConfig = {
  domain: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pakistanbettinggames.casino",
  utmSource: "pakistanbettinggames",
  inviteCode:
    process.env.NEXT_PUBLIC_INVITE_CODE ?? "ls79qWwK",
} as const;

export const apiConfig = {
  baseUrl: process.env.GAME_API_BASE_URL ?? "https://h5.wdclus002.com",
  bearerToken: process.env.GAME_API_TOKEN ?? "",
  platform: process.env.GAME_API_PLATFORM ?? "3",
  apiVersion: "v1",
  revalidateSeconds: Number(
    process.env.GAME_API_REVALIDATE ?? PAGE_REVALIDATE_SECONDS,
  ),
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

/** Casino entry URL — `inviteCode` + `utm_source` only. */
export function playUrl(config: SystemConfig): string {
  const raw =
    config.app_call_h5_domain ||
    process.env.NEXT_PUBLIC_PLATFORM_URL ||
    "https://h5.wdclus0001.com";
  const url = new URL(raw.endsWith("/") ? raw : `${raw}/`);
  url.searchParams.set("inviteCode", siteConfig.inviteCode);
  url.searchParams.set("utm_source", siteConfig.utmSource);
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
