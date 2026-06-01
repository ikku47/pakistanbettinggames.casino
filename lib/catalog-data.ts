import { unstable_cache } from "next/cache";
import { cache } from "react";
import type { AppLocale } from "@/i18n/routing";
import {
  fetchAllGamesForSitemap,
  fetchAllPlatIcons,
  fetchGameClasses,
  fetchGameList,
  fetchPopularGames,
} from "@/lib/api";
import { PAGE_REVALIDATE_SECONDS } from "@/lib/cache";
import {
  buildPlatformCatalog,
  buildPlatformIndex,
  type PlatformCatalogItem,
  type PlatformIndex,
} from "@/lib/platforms";
import { getSystemConfig } from "@/lib/system-config";
import type { GameRecord, SystemConfig } from "@/lib/types";

const cacheOpts = { revalidate: PAGE_REVALIDATE_SECONDS };

function cachedByLocale<T>(
  fn: (locale: AppLocale) => Promise<T>,
  key: string,
): (locale: AppLocale) => Promise<T> {
  return (locale: AppLocale) =>
    unstable_cache(() => fn(locale), [key, locale], cacheOpts)();
}

export const getCachedGameClasses = cachedByLocale(
  fetchGameClasses,
  "game-classes",
);

export const getCachedPlatIcons = cachedByLocale(
  fetchAllPlatIcons,
  "plat-icons",
);

export const getCachedPopularGames = (
  locale: AppLocale,
  limit: number,
): Promise<GameRecord[]> =>
  unstable_cache(
    () => fetchPopularGames(locale, limit),
    ["popular-games", locale, String(limit)],
    cacheOpts,
  )();

const loadGameIndex = cachedByLocale(async (locale: AppLocale) => {
  const classes = await fetchGameClasses(locale);
  const byId: Record<number, GameRecord> = {};

  const add = (games: GameRecord[]) => {
    for (const g of games) {
      if (byId[g.id] == null) byId[g.id] = g;
    }
  };

  for (const cls of classes) {
    add(cls.games ?? []);
  }

  const codes = classes
    .map((c) => c.code)
    .filter((code) => code !== "RM_TEMP");

  for (const code of codes) {
    const page = await fetchGameList(locale, {
      gameClassCode: code,
      pageNo: 1,
      pageSize: 100,
    });
    add(page.records);
  }

  return byId;
}, "game-index");

export async function getGameById(
  locale: AppLocale,
  id: number,
): Promise<GameRecord | null> {
  const index = await loadGameIndex(locale);
  return index[id] ?? null;
}

export const getCachedSitemapGames = cachedByLocale(
  fetchAllGamesForSitemap,
  "sitemap-games",
);

export type CatalogBootstrap = {
  classes: Awaited<ReturnType<typeof fetchGameClasses>>;
  partnerIcons: string[];
  config: SystemConfig;
  platformCatalog: PlatformCatalogItem[];
  platformIndex: PlatformIndex;
};

/** Per-request dedupe for layout + pages (classes, icons, config, platforms). */
export const getCatalogBootstrap = cache(
  async (locale: AppLocale): Promise<CatalogBootstrap> => {
    const [classes, partnerIcons, config] = await Promise.all([
      getCachedGameClasses(locale),
      getCachedPlatIcons(locale),
      getSystemConfig(locale),
    ]);

    return {
      classes,
      partnerIcons,
      config,
      platformCatalog: buildPlatformCatalog(classes),
      platformIndex: buildPlatformIndex(classes),
    };
  },
);
