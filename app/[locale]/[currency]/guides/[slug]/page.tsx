import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageContainer } from "@/components/layout/PageContainer";
import { GuideContentSections } from "@/components/guides/GuideContentSections";
import { GuidePageHeader } from "@/components/guides/GuidePageHeader";
import { GuideRankingList } from "@/components/guides/GuideRankingList";
import { PlayCta } from "@/components/ui/PlayCta";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  fetchGamesForGuide,
  getGuideBySlug,
  getGuideSlugs,
} from "@/lib/guides";
import { getSystemConfig } from "@/lib/system-config";
import { applyCurrencyToConfig, PRIMARY_SEO_CURRENCY } from "@/lib/currency";
import {
  absoluteUrl,
  articleJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { formatGameTitle, gameSlug } from "@/lib/utils";
import { resolvePageParamsWith } from "@/lib/page-params";
import type { Metadata } from "next";

export const revalidate = 2592000;

type Props = { params: Promise<{ locale: string; currency: string; slug: string }> };

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, currency, slug } = await resolvePageParamsWith(params);
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Not Found" };

  const t = await getTranslations({ locale, namespace: "Guides" });
  const tMeta = await getTranslations({ locale, namespace: "Meta" });
  const key = guide.messageKey;

  return buildMetadata({
    locale,
    currency,
    title: t(`items.${key}.metaTitle`),
    description: t(`items.${key}.metaDesc`),
    path: `/guides/${slug}`,
    siteName: tMeta("siteName"),
    titleSuffix: tMeta("titleSuffix"),
  });
}

export default async function GuidePage({ params }: Props) {
  const { locale, currency, slug } = await resolvePageParamsWith(params);
  setRequestLocale(locale);

  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const key = guide.messageKey;
  const path = `/guides/${slug}`;

  const [t, tCommon, tGames, config] = await Promise.all([
    getTranslations({ locale, namespace: "Guides" }),
    getTranslations({ locale, namespace: "Common" }),
    getTranslations({ locale, namespace: "Games" }),
    getSystemConfig(locale),
  ]);

  const wallet = applyCurrencyToConfig(config, currency);
  const games = await fetchGamesForGuide(locale, guide.data);

  const title = t(`items.${key}.title`);
  const metaDesc = t(`items.${key}.metaDesc`);
  const hasRanking = guide.data.type !== "none";

  const listItems = games.map((g) => ({
    name: formatGameTitle(g.gameName),
    url: absoluteUrl(
      locale,
      `/games/${gameSlug(g)}`,
      PRIMARY_SEO_CURRENCY,
    ),
  }));

  const bodySections = hasRanking
    ? (["pick", "tip"] as const)
    : (["body", "pick", "tip"] as const);

  return (
    <PageContainer>
      <JsonLd
        data={[
          breadcrumbJsonLd(
            locale,
            [
              { name: tCommon("home"), path: "/" },
              { name: t("indexTitle"), path: "/guides" },
              { name: title, path },
            ],
            currency,
          ),
          webPageJsonLd(locale, title, metaDesc, path, currency),
          articleJsonLd({
            locale,
            currency,
            path,
            headline: title,
            description: metaDesc,
          }),
          ...(hasRanking && listItems.length > 0
            ? [itemListJsonLd(title, listItems)]
            : []),
        ]}
      />

      <Breadcrumb
        items={[
          { label: tCommon("home"), href: "/" },
          { label: t("indexTitle"), href: "/guides" },
          { label: title },
        ]}
      />

      <article className="space-y-8">
        <GuidePageHeader
          label={t("guideLabel")}
          title={title}
          intro={t(`items.${key}.intro`)}
          updatedNote={t("updatedNote")}
          rankingLabel={
            hasRanking && games.length > 0
              ? t("rankingCount", { count: games.length })
              : undefined
          }
        />

        <GuideContentSections
          sections={[...bodySections]}
          getTitle={(section) => t(`items.${key}.sections.${section}Title`)}
          getBody={(section) => t(`items.${key}.sections.${section}`)}
        />

        {hasRanking && (
          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="section-title mb-0">
                  {t(`items.${key}.rankingTitle`)}
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {t(`items.${key}.rankingDesc`)}
                </p>
              </div>
            </div>
            <GuideRankingList
              games={games}
              config={wallet}
              locale={locale}
              rankLabel={t("rank")}
              playLabel={tGames("play")}
              detailsLabel={t("viewDetails")}
            />
          </section>
        )}

        {!hasRanking && games.length > 0 && (
          <section>
            <h2 className="section-title">{t("tryThese")}</h2>
            <GuideRankingList
              games={games}
              config={wallet}
              locale={locale}
              rankLabel={t("rank")}
              playLabel={tGames("play")}
              detailsLabel={t("viewDetails")}
              className="mt-4"
            />
          </section>
        )}

        <section className="card-surface overflow-hidden p-0">
          <div className="bg-gradient-to-r from-brand-light to-surface px-6 py-8 text-center dark:from-brand-light/20">
            <p className="text-sm font-semibold text-text sm:text-base">
              {t("ctaText")}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <PlayCta size="lg" className="!rounded-xl">
                {t("ctaButton")}
              </PlayCta>
            </div>
          </div>
        </section>
      </article>
    </PageContainer>
  );
}
