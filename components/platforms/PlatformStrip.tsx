import { ChevronRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { GameImage } from "@/components/games/GameImage";
import type { AppLocale } from "@/i18n/routing";
import { fetchPlatformCatalog } from "@/lib/api";
import { getSystemConfig } from "@/lib/system-config";
import { FEATURED_PLATFORM_SLUGS } from "@/lib/featured-platforms";
import { platformIconUrl } from "@/lib/platforms";

export async function PlatformStrip() {
  const locale = (await getLocale()) as AppLocale;
  const [catalog, config, t] = await Promise.all([
    fetchPlatformCatalog(locale),
    getSystemConfig(locale),
    getTranslations("Platforms"),
  ]);

  const bySlug = new Map(catalog.map((p) => [p.slug, p]));
  const featured = FEATURED_PLATFORM_SLUGS.map((s) => bySlug.get(s)).filter(
    (p): p is NonNullable<typeof p> => p != null,
  );
  const items =
    featured.length >= 6
      ? featured
      : catalog.slice(0, 12);

  if (items.length === 0) return null;

  return (
    <section className="mt-10" aria-labelledby="providers-heading">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2 px-1">
        <div>
          <h2 id="providers-heading" className="section-title mb-0">
            {t("homeTitle")}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {t("homeSubtitle")}
          </p>
        </div>
        <Link
          href="/platform"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
        >
          {t("viewAll")}
          <ChevronRight size={16} aria-hidden />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((plat) => {
          const iconSrc = platformIconUrl(plat, config);
          return (
            <Link
              key={plat.platformId}
              href={`/platform/${plat.slug}`}
              className="card-surface link-card group flex flex-col items-center gap-2 p-4 text-center"
            >
              <span className="link-card-media flex h-12 w-full items-center justify-center rounded-lg bg-black p-2">
                {iconSrc ? (
                  <GameImage
                    src={iconSrc}
                    alt={plat.platformName}
                    className="link-card-image max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-xs font-bold text-brand">
                    {plat.platformCode}
                  </span>
                )}
              </span>
              <span className="line-clamp-2 text-xs font-semibold leading-tight text-text group-hover:text-brand">
                {plat.platformName}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
