import type { MetadataRoute } from "next";
import { fetchAllGamesForSitemap } from "@/lib/api";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/lib/config";
import { CURRENCY_CODES, currencySlug } from "@/lib/currency";
import { getGuideSlugs } from "@/lib/guides";
import { locales, type AppLocale } from "@/i18n/routing";
import { gameSlug } from "@/lib/utils";

const staticPaths = [
  "",
  "/games",
  "/faq",
  "/about",
  "/guides",
  "/currency",
] as const;

export async function generateSitemaps() {
  return locales.map((locale) => ({ id: locale }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const locale = (await props.id) as AppLocale;
  const base = siteConfig.domain.replace(/\/$/, "");
  const now = new Date();
  const prefix = `/${locale}`;

  const entries: MetadataRoute.Sitemap = [];

  for (const code of CURRENCY_CODES) {
    const cur = currencySlug(code);
    const curPrefix = `${prefix}/${cur}`;

    for (const path of staticPaths) {
      entries.push({
        url: `${base}${curPrefix}${path}`,
        lastModified: now,
        changeFrequency:
          path === "" || path === "/games" ? "daily" : "monthly",
        priority: path === "" ? 1 : path === "/games" ? 0.9 : 0.5,
      });
    }

    for (const slug of getGuideSlugs()) {
      entries.push({
        url: `${base}${curPrefix}/guides/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }

    for (const cat of categories) {
      entries.push({
        url: `${base}${curPrefix}/category/${cat.slug}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.85,
      });
    }
  }

  try {
    const games = await fetchAllGamesForSitemap(locale, 80);
    for (const code of CURRENCY_CODES) {
      const cur = currencySlug(code);
      for (const g of games) {
        entries.push({
          url: `${base}${prefix}/${cur}/games/${gameSlug(g)}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch {
    /* API unavailable at build */
  }

  return entries;
}
