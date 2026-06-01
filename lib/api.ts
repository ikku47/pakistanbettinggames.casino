import type { AppLocale } from "@/i18n/routing";
import { toApiContentLanguage } from "@/i18n/api-locale";
import { apiConfig } from "./config";
import {
  buildPlatformCatalog,
  buildPlatformIndex,
  type PlatformCatalogItem,
  type PlatformIndex,
} from "./platforms";
import type {
  ApiResponse,
  GameClass,
  GameListPage,
  GameRecord,
} from "./types";

const ENDPOINTS = {
  getGameClass: "/api/channel/queryGame/v2/getGameClass",
  gameList: "/api/channel/queryGame/v2/gameList",
  allPlatIcon: "/api/channel/queryGame/v2/allPlatIcon",
  gameByGameName: "/api/channel/queryGame/gameByGameName",
} as const;

function apiUrl(path: string): string {
  const base = apiConfig.baseUrl.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

async function apiFetch<T>(
  locale: AppLocale,
  path: string,
  init?: RequestInit & { cacheMode?: "default" | "no-store" },
): Promise<T | null> {
  const { cacheMode = "default", ...fetchInit } = init ?? {};
  const headers: HeadersInit = {
    accept: "*/*",
    "api-version": apiConfig.apiVersion,
    "content-type": "application/json",
    "content-language": toApiContentLanguage(locale),
    platform: apiConfig.platform,
    ...(apiConfig.bearerToken
      ? { authorization: `Bearer ${apiConfig.bearerToken}` }
      : {}),
    ...fetchInit.headers,
  };

  try {
    const res = await fetch(apiUrl(path), {
      ...fetchInit,
      headers,
      ...(cacheMode === "no-store"
        ? { cache: "no-store" as const }
        : { next: { revalidate: apiConfig.revalidateSeconds } }),
    });

    if (!res.ok) return null;

    const json = (await res.json()) as ApiResponse<T>;
    if (json.code !== 200 || !json.data) return null;
    return json.data;
  } catch {
    return null;
  }
}

export async function fetchGameClasses(locale: AppLocale): Promise<GameClass[]> {
  const data = await apiFetch<GameClass[]>(locale, ENDPOINTS.getGameClass, {
    method: "GET",
  });
  return data ?? [];
}

export async function fetchGameList(
  locale: AppLocale,
  params: {
    gameClassCode: string;
    pageNo?: number;
    pageSize?: number;
    platformId?: number;
  },
): Promise<GameListPage> {
  const body: Record<string, unknown> = {
    gameClassCode: params.gameClassCode,
    pageNo: params.pageNo ?? 1,
    pageSize: params.pageSize ?? 48,
  };
  if (params.platformId != null) {
    body.platformId = params.platformId;
  }

  const data = await apiFetch<GameListPage>(locale, ENDPOINTS.gameList, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return (
    data ?? {
      records: [],
      total: 0,
      size: params.pageSize ?? 48,
      current: params.pageNo ?? 1,
      pages: 0,
    }
  );
}

export async function fetchAllPlatIcons(locale: AppLocale): Promise<string[]> {
  const data = await apiFetch<string[]>(locale, ENDPOINTS.allPlatIcon, {
    method: "GET",
  });
  return data ?? [];
}

export async function fetchPlatformIndex(
  locale: AppLocale,
): Promise<PlatformIndex> {
  const classes = await fetchGameClasses(locale);
  return buildPlatformIndex(classes);
}

export async function fetchPlatformCatalog(
  locale: AppLocale,
): Promise<PlatformCatalogItem[]> {
  const classes = await fetchGameClasses(locale);
  return buildPlatformCatalog(classes);
}

export async function fetchPopularGames(
  locale: AppLocale,
  limit = 24,
): Promise<GameRecord[]> {
  const classes = await fetchGameClasses(locale);
  const popular = classes.find((c) => c.code === "RM_TEMP");
  return (popular?.games ?? []).slice(0, limit);
}

async function fetchAllGamesInClass(
  locale: AppLocale,
  gameClassCode: string,
  pageSize = 100,
): Promise<GameRecord[]> {
  const merged: GameRecord[] = [];
  const maxPages = 40;

  for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
    const page = await fetchGameList(locale, {
      gameClassCode,
      pageNo,
      pageSize,
    });
    if (!page.records.length) break;
    merged.push(...page.records);
    if (page.records.length < pageSize) break;
  }

  return merged;
}

/** All unique games for sitemap generation (paginated per category). */
export async function fetchAllGamesForSitemap(
  locale: AppLocale,
): Promise<GameRecord[]> {
  const classes = await fetchGameClasses(locale);
  const codes = classes
    .map((c) => c.code)
    .filter((code) => code !== "RM_TEMP");

  const popular = classes.find((c) => c.code === "RM_TEMP")?.games ?? [];
  const seen = new Set<number>();
  const merged: GameRecord[] = [];

  const add = (games: GameRecord[]) => {
    for (const g of games) {
      if (seen.has(g.id)) continue;
      seen.add(g.id);
      merged.push(g);
    }
  };

  add(popular);

  await Promise.all(
    codes.map(async (code) => {
      add(await fetchAllGamesInClass(locale, code));
    }),
  );

  return merged;
}

export async function searchGamesByName(
  locale: AppLocale,
  gameName: string,
  limit = 24,
): Promise<GameRecord[]> {
  const trimmed = gameName.trim();
  if (trimmed.length < 2) return [];

  const query = new URLSearchParams({ gameName: trimmed });
  const data = await apiFetch<GameRecord[]>(
    locale,
    `${ENDPOINTS.gameByGameName}?${query.toString()}`,
    { method: "GET", cacheMode: "no-store" },
  );

  return (data ?? []).slice(0, limit);
}

export async function findGameById(
  locale: AppLocale,
  id: number,
): Promise<GameRecord | null> {
  const classes = await fetchGameClasses(locale);
  for (const cls of classes) {
    const inPopular = cls.games?.find((g) => g.id === id);
    if (inPopular) return inPopular;
  }

  for (const cls of classes) {
    if (cls.code === "RM_TEMP") continue;
    const page = await fetchGameList(locale, {
      gameClassCode: cls.code,
      pageNo: 1,
      pageSize: 100,
    });
    const found = page.records.find((g) => g.id === id);
    if (found) return found;
  }

  return null;
}
