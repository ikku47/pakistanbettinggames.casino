import type { GameClass, GameRecord, PlatformRecord } from "./types";

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

export interface PlatformIndex {
  byId: Map<number, PlatformRecord>;
  byIcon: Map<string, PlatformRecord>;
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
}

export function resolveGamePlatform(
  game: GameRecord,
  index: PlatformIndex,
): ResolvedPlatform {
  const fromId = index.byId.get(game.platformId);
  const iconPath = game.platIcon || fromId?.icon || "";

  if (fromId) {
    return {
      name: fromId.platformName,
      iconPath,
      platformId: game.platformId,
    };
  }

  const fromIcon = game.platIcon ? index.byIcon.get(game.platIcon) : undefined;
  if (fromIcon) {
    return {
      name: fromIcon.platformName,
      iconPath: game.platIcon,
      platformId: fromIcon.platformId,
    };
  }

  return {
    name: iconPath ? partnerLabelFromPath(iconPath) : `Platform ${game.platformId}`,
    iconPath,
    platformId: game.platformId,
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
