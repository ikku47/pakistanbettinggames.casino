import { ChevronRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import type { AppLocale } from "@/i18n/routing";
import { fetchGameClasses } from "@/lib/api";
import { categoriesWithIcons } from "@/lib/categories";
import { getSystemConfig } from "@/lib/system-config";

export async function CategoryStrip() {
  const locale = (await getLocale()) as AppLocale;
  const [classes, config, tHome, tCat] = await Promise.all([
    fetchGameClasses(locale),
    getSystemConfig(locale),
    getTranslations("Home"),
    getTranslations("Categories"),
  ]);

  const items = categoriesWithIcons(classes, config);

  return (
    <section className="mt-10" aria-labelledby="collections-heading">
      <h2 id="collections-heading" className="section-title px-1">
        {tHome("sectionsTitle")}
      </h2>
      <p className="mb-4 px-1 text-sm text-text-secondary">
        {tHome("sectionsSubtitle")}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((cat) => (
          <Link
            key={cat.code}
            href={`/category/${cat.slug}`}
            className="card-surface link-card group flex items-center gap-4 p-4"
          >
            <span className="link-card-media flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-black p-2">
              {cat.iconSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cat.iconSrc}
                  alt={tCat(`${cat.messageKey}.name`)}
                  width={56}
                  height={56}
                  className="link-card-image h-full w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="text-sm font-bold text-brand">
                  {cat.messageKey.slice(0, 2).toUpperCase()}
                </span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-text group-hover:text-brand">
                {tCat(`${cat.messageKey}.name`)}
              </span>
              <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-text-secondary">
                {tCat(`${cat.messageKey}.description`)}
              </p>
            </div>
            <ChevronRight
              size={18}
              className="link-card-chevron shrink-0 text-brand"
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
