import { ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { guides } from "@/lib/guides";

const FEATURED_SLUGS = [
  "fifa-world-cup-2026-betting",
  "top-games-pakistan",
  "best-slots-pakistan",
] as const;

export async function GuidesSection() {
  const t = await getTranslations("Guides");
  const featured = guides.filter((g) =>
    FEATURED_SLUGS.includes(g.slug as (typeof FEATURED_SLUGS)[number]),
  );

  return (
    <section className="mt-10" aria-labelledby="guides-heading">
      <div className="mb-4 flex items-end justify-between gap-4 px-1">
        <div>
          <h2 id="guides-heading" className="section-title mb-0">
            {t("indexTitle")}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">{t("homeTeaser")}</p>
        </div>
        <Link
          href="/guides"
          className="shrink-0 text-sm font-medium text-brand hover:underline"
        >
          {t("viewAll")}
        </Link>
      </div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {featured.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/guides/${guide.slug}`}
              className="card-surface group flex h-full flex-col p-4 hover:-translate-y-0.5"
            >
              <h3 className="text-sm font-semibold text-text group-hover:text-brand">
                {t(`items.${guide.messageKey}.title`)}
              </h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-text-secondary">
                {t(`items.${guide.messageKey}.teaser`)}
              </p>
              <span className="mt-3 inline-flex items-center gap-0.5 text-xs font-medium text-brand">
                {t("readGuide")}
                <ChevronRight size={14} aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
