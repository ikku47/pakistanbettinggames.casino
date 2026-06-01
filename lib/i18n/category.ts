import type { CategoryDef } from "../types";

export function getCategoryMessages(
  t: (key: string) => string,
  def: CategoryDef,
) {
  const key = def.messageKey;
  return {
    name: t(`${key}.name`),
    description: t(`${key}.description`),
    seoTitle: t(`${key}.seoTitle`),
  };
}
