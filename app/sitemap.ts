import type { MetadataRoute } from "next";
import { fetchAllGamesForSitemap, fetchPlatformCatalog } from "@/lib/api";
import { categories } from "@/lib/categories";
import { siteConfig } from "@/lib/config";
import { currencySlug, PRIMARY_SEO_CURRENCY } from "@/lib/currency";
import { getGuideSlugs } from "@/lib/guides";
import { locales, type AppLocale } from "@/i18n/routing";
import { gameSlug } from "@/lib/utils";

const staticPaths = [
  "",
  "/games",
  "/platform",
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
  const cur = currencySlug(PRIMARY_SEO_CURRENCY);
  const curPrefix = `${prefix}/${cur}`;

  const entries: MetadataRoute.Sitemap = [];

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

  try {
    const platforms = await fetchPlatformCatalog(locale);
    for (const plat of platforms) {
      entries.push({
        url: `${base}${curPrefix}/platform/${plat.slug}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  } catch {
    /* API unavailable */
  }

  try {
    const games = await fetchAllGamesForSitemap(locale);
    for (const g of games) {
      entries.push({
        url: `${base}${curPrefix}/games/${gameSlug(g)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    /* API unavailable at build */
  }

  return entries;
}
