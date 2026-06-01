import type { GameClass, GameRecord, PlatformRecord, SystemConfig } from "./types";
import { assetUrl } from "./config";

/** Stable key for deduping partner logos from API paths. */
export function partnerKeyFromPath(path: string): string {
  const file = path.split("/").pop()?.replace(/\.[^.]+$/i, "") ?? path;
  return file
    .replace(/^logo_/i, "")
    .replace(/^\d+_gg_/i, "")
    .replace(/^gg_/i, "")
    .replace(/^hb_logo_\d+_/i, "")
    .replace(/_ehn$/i, "")
    .toLowerCase();
}

/** Human-readable label from an icon path (e.g. logo_PG.png → PG). */
export function partnerLabelFromPath(path: string): string {
  const key = partnerKeyFromPath(path);
  if (!key) return "Partner";
  if (key === "wd") return "WD";
  if (key.includes("luckysport")) return "Lucky Sport";
  return key
    .split(/[_-]+/)
    .filter(Boolean)
    .map((w) => (w.length <= 4 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

export interface PlatformCatalogItem {
  platformId: number;
  platformName: string;
  platformCode: string;
  gameClassCode: string;
  slug: string;
  icon: string;
  picture: string;
}

export interface PlatformIndex {
  byId: Map<number, PlatformRecord>;
  byIcon: Map<string, PlatformRecord>;
}

/** URL slug for `/platform/[slug]` (unique per platformId). */
export function platformSlugFromRecord(plat: PlatformRecord): string {
  const raw = plat.platformCode || plat.platformName || String(plat.platformId);
  const base = raw
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `platform-${plat.platformId}`;
}

export function buildPlatformCatalog(classes: GameClass[]): PlatformCatalogItem[] {
  const byId = new Map<number, PlatformCatalogItem>();
  const usedSlugs = new Set<string>();

  for (const cls of classes) {
    for (const plat of cls.plats ?? []) {
      if (byId.has(plat.platformId)) continue;

      let slug = platformSlugFromRecord(plat);
      if (usedSlugs.has(slug)) slug = `${slug}-${plat.platformId}`;
      usedSlugs.add(slug);

      byId.set(plat.platformId, {
        platformId: plat.platformId,
        platformName: plat.platformName,
        platformCode: plat.platformCode,
        gameClassCode: plat.gameClassCode || cls.code,
        slug,
        icon: plat.icon,
        picture: plat.picture,
      });
    }
  }

  return [...byId.values()].sort((a, b) =>
    a.platformName.localeCompare(b.platformName),
  );
}

export function getPlatformBySlug(
  slug: string,
  catalog: PlatformCatalogItem[],
): PlatformCatalogItem | undefined {
  return catalog.find((p) => p.slug === slug);
}

export function platformIconUrl(
  plat: Pick<PlatformCatalogItem, "icon" | "picture">,
  config: SystemConfig,
): string | null {
  const path = plat.icon || plat.picture;
  return path ? assetUrl(path, config) : null;
}

export function platformHrefForIconPath(
  iconPath: string,
  index: PlatformIndex,
  catalog: PlatformCatalogItem[],
): string | null {
  const rec = index.byIcon.get(iconPath);
  if (!rec) return null;
  const item = catalog.find((p) => p.platformId === rec.platformId);
  return item ? `/platform/${item.slug}` : null;
}

export function buildPlatformIndex(classes: GameClass[]): PlatformIndex {
  const byId = new Map<number, PlatformRecord>();
  const byIcon = new Map<string, PlatformRecord>();

  for (const cls of classes) {
    for (const plat of cls.plats ?? []) {
      byId.set(plat.platformId, plat);
      if (plat.icon) byIcon.set(plat.icon, plat);
      if (plat.picture) byIcon.set(plat.picture, plat);
    }
  }

  return { byId, byIcon };
}

export interface ResolvedPlatform {
  name: string;
  iconPath: string;
  platformId: number;
  slug?: string;
}

export function resolveGamePlatform(
  game: GameRecord,
  index: PlatformIndex,
  catalog?: PlatformCatalogItem[],
): ResolvedPlatform {
  const catalogItem = catalog?.find((p) => p.platformId === game.platformId);
  const slug = catalogItem?.slug;

  const fromId = index.byId.get(game.platformId);
  const iconPath = game.platIcon || fromId?.icon || "";

  if (fromId) {
    return {
      name: fromId.platformName,
      iconPath,
      platformId: game.platformId,
      slug,
    };
  }

  const fromIcon = game.platIcon ? index.byIcon.get(game.platIcon) : undefined;
  if (fromIcon) {
    return {
      name: fromIcon.platformName,
      iconPath: game.platIcon,
      platformId: fromIcon.platformId,
      slug:
        catalog?.find((p) => p.platformId === fromIcon.platformId)?.slug ?? slug,
    };
  }

  return {
    name: iconPath ? partnerLabelFromPath(iconPath) : `Platform ${game.platformId}`,
    iconPath,
    platformId: game.platformId,
    slug,
  };
}

/** Dedupe partner icon paths while preserving API order. */
export function dedupePartnerIcons(paths: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const path of paths) {
    const key = partnerKeyFromPath(path);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(path);
  }
  return out;
}
