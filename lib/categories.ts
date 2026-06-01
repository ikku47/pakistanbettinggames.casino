import { assetUrl } from "./config";
import type { CategoryDef, GameClass, SystemConfig } from "./types";

/** Structural category data (copy lives in `messages/*.json`). */
export const categories: CategoryDef[] = [
  { code: "RM_TEMP", slug: "popular", messageKey: "popular" },
  { code: "DZ", slug: "slots", messageKey: "slots" },
  { code: "TY", slug: "sports", messageKey: "sports" },
  { code: "BY", slug: "fishing", messageKey: "fishing" },
  { code: "QP", slug: "cards", messageKey: "cards" },
  { code: "SX", slug: "live-casino", messageKey: "liveCasino" },
];

export const categoryByCode = Object.fromEntries(
  categories.map((c) => [c.code, c]),
) as Record<string, CategoryDef>;

export const categoryBySlug = Object.fromEntries(
  categories.map((c) => [c.slug, c]),
) as Record<string, CategoryDef>;

export function getCategoryBySlug(slug: string): CategoryDef | undefined {
  return categoryBySlug[slug];
}

export function getCategoryByCode(code: string): CategoryDef | undefined {
  return categoryByCode[code];
}

export interface CategoryWithIcon extends CategoryDef {
  iconSrc: string | null;
}

/** Merge static category defs with API `classIcon` paths (unchecked = default tile). */
export function categoriesWithIcons(
  classes: GameClass[],
  config: SystemConfig,
): CategoryWithIcon[] {
  const iconByCode = new Map(
    classes.map((c) => [c.code, c.classIcon?.unchecked ?? c.classIcon?.checked]),
  );

  return categories.map((def) => {
    const path = iconByCode.get(def.code);
    return {
      ...def,
      iconSrc: path ? assetUrl(path, config) : null,
    };
  });
}

export function categoryIconSrc(
  classes: GameClass[],
  code: string,
  config: SystemConfig,
): string | null {
  const match = classes.find((c) => c.code === code);
  const path = match?.classIcon?.unchecked ?? match?.classIcon?.checked;
  return path ? assetUrl(path, config) : null;
}
