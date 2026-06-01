/** Featured provider slugs for home strip and footer (matches live catalog). */
export const FEATURED_PLATFORM_LINKS = [
  { slug: "pg2", name: "PG Soft" },
  { slug: "jili", name: "JILI" },
  { slug: "cq9", name: "CQ9" },
  { slug: "lucky-sport", name: "Lucky Sport" },
  { slug: "jdb", name: "JDB" },
  { slug: "fc", name: "FA CHAI" },
  { slug: "joker", name: "Joker" },
  { slug: "dg", name: "DG" },
] as const;

export const FEATURED_PLATFORM_SLUGS = FEATURED_PLATFORM_LINKS.map(
  (p) => p.slug,
);
