import type { GameRecord } from "./types";
import type { AppLocale } from "@/i18n/routing";
import { fetchGameList, fetchPopularGames } from "./api";

export type GuideDataSource =
  | { type: "popular"; limit: number }
  | { type: "category"; code: string; limit: number }
  | { type: "none" };

export interface GuideDef {
  slug: string;
  messageKey: string;
  data: GuideDataSource;
}

/** Editorial guides — each page targets one clear search intent with live game data where useful. */
export const guides: GuideDef[] = [
  {
    slug: "top-games-pakistan",
    messageKey: "topGames",
    data: { type: "popular", limit: 12 },
  },
  {
    slug: "best-slots-pakistan",
    messageKey: "bestSlots",
    data: { type: "category", code: "DZ", limit: 12 },
  },
  {
    slug: "live-casino-picks",
    messageKey: "liveCasino",
    data: { type: "category", code: "SX", limit: 10 },
  },
  {
    slug: "cricket-sports-betting",
    messageKey: "sports",
    data: { type: "category", code: "TY", limit: 10 },
  },
  {
    slug: "fifa-world-cup-2026-betting",
    messageKey: "fifa2026",
    data: { type: "category", code: "TY", limit: 12 },
  },
  {
    slug: "play-without-apk",
    messageKey: "h5Guide",
    data: { type: "none" },
  },
  {
    slug: "jazzcash-easypaisa-deposits",
    messageKey: "deposits",
    data: { type: "none" },
  },
];

const guideBySlug = Object.fromEntries(guides.map((g) => [g.slug, g]));

export function getGuideBySlug(slug: string): GuideDef | undefined {
  return guideBySlug[slug];
}

export function getGuideSlugs(): string[] {
  return guides.map((g) => g.slug);
}

export async function fetchGamesForGuide(
  locale: AppLocale,
  source: GuideDataSource,
): Promise<GameRecord[]> {
  if (source.type === "none") {
    return fetchPopularGames(locale, 6);
  }
  if (source.type === "popular") {
    return fetchPopularGames(locale, source.limit);
  }
  const page = await fetchGameList(locale, {
    gameClassCode: source.code,
    pageNo: 1,
    pageSize: source.limit,
  });
  if (page.records.length > 0) return page.records;
  return fetchPopularGames(locale, Math.min(source.limit, 6));
}
