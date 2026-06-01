import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { GameGrid } from "@/components/games/GameGrid";
import { Pagination } from "@/components/games/Pagination";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageContainer } from "@/components/layout/PageContainer";
import { GameImage } from "@/components/games/GameImage";
import { PlayCta } from "@/components/ui/PlayCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchGameList, fetchPlatformCatalog } from "@/lib/api";
import { getCategoryByCode } from "@/lib/categories";
import { getSystemConfig } from "@/lib/system-config";
import {
  getPlatformBySlug,
  platformIconUrl,
} from "@/lib/platforms";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
} from "@/lib/seo";
import { formatGameTitle, gameSlug } from "@/lib/utils";
import { resolvePageParamsWith } from "@/lib/page-params";
import type { AppLocale } from "@/i18n/routing";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; currency: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  const catalog = await fetchPlatformCatalog("en-PK" as AppLocale);
  return catalog.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, currency, slug } = await resolvePageParamsWith(params);
  const catalog = await fetchPlatformCatalog(locale);
  const plat = getPlatformBySlug(slug, catalog);
  if (!plat) return { title: "Not Found" };

  const [t, tCat, tMeta, config] = await Promise.all([
    getTranslations({ locale, namespace: "Platforms" }),
    getTranslations({ locale, namespace: "Categories" }),
    getTranslations({ locale, namespace: "Meta" }),
    getSystemConfig(locale),
  ]);

  const catDef = getCategoryByCode(plat.gameClassCode);
  const category = catDef
    ? tCat(`${catDef.messageKey}.name`)
    : plat.gameClassCode;
  const iconSrc = platformIconUrl(plat, config);

  return buildMetadata({
    locale,
    currency,
    title: t("seoTitle", { platform: plat.platformName }),
    description: t("pageDescription", {
      platform: plat.platformName,
      category,
    }),
    path: `/platform/${slug}`,
    siteName: tMeta("siteName"),
    titleSuffix: tMeta("titleSuffix"),
    ...(iconSrc ? { image: iconSrc, imageAlt: plat.platformName } : {}),
  });
}

export default async function PlatformPage({ params, searchParams }: Props) {
  const { locale, currency, slug } = await resolvePageParamsWith(params);
  setRequestLocale(locale);

  const catalog = await fetchPlatformCatalog(locale);
  const plat = getPlatformBySlug(slug, catalog);
  if (!plat) notFound();

  const query = await searchParams;
  const pageNo = Math.max(1, Number(query.page) || 1);

  const [t, tCommon, tCat, config] = await Promise.all([
    getTranslations({ locale, namespace: "Platforms" }),
    getTranslations({ locale, namespace: "Common" }),
    getTranslations({ locale, namespace: "Categories" }),
    getSystemConfig(locale),
  ]);

  const catDef = getCategoryByCode(plat.gameClassCode);
  const categoryName = catDef
    ? tCat(`${catDef.messageKey}.name`)
    : plat.gameClassCode;
  const iconSrc = platformIconUrl(plat, config);

  const data = await fetchGameList(locale, {
    gameClassCode: plat.gameClassCode,
    platformId: plat.platformId,
    pageNo,
    pageSize: 48,
  });

  const games = data.records;
  const pagination = { current: data.current, pages: data.pages };

  const listItems = games.slice(0, 15).map((g) => ({
    name: formatGameTitle(g.gameName),
    url: absoluteUrl(locale, `/games/${gameSlug(g)}`, currency),
  }));

  return (
    <PageContainer>
      <JsonLd
        data={[
          breadcrumbJsonLd(
            locale,
            [
              { name: tCommon("home"), path: "/" },
              { name: t("indexTitle"), path: "/platform" },
              { name: plat.platformName, path: `/platform/${slug}` },
            ],
            currency,
          ),
          itemListJsonLd(
            t("seoTitle", { platform: plat.platformName }),
            listItems,
          ),
        ]}
      />

      <Breadcrumb
        items={[
          { label: tCommon("home"), href: "/" },
          { label: t("indexTitle"), href: "/platform" },
          { label: plat.platformName },
        ]}
      />

      <header className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm sm:flex-row sm:items-start sm:gap-6">
        {iconSrc && (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-black p-3">
            <GameImage
              src={iconSrc}
              alt={plat.platformName}
              className="h-full w-full object-contain"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded bg-brand-light px-2 py-0.5 text-xs font-semibold text-brand">
            {categoryName}
          </span>
          <h1 className="mt-2 text-2xl font-bold text-text sm:text-3xl">
            {t("pageTitle", { platform: plat.platformName })}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {t("pageDescription", {
              platform: plat.platformName,
              category: categoryName,
            })}
          </p>
          {data.total > 0 && (
            <p className="mt-2 text-xs font-medium text-text-muted">
              {t("gameCount", { count: data.total })}
            </p>
          )}
          <div className="mt-4">
            <PlayCta>
              {t("playProvider", { platform: plat.platformName })}
            </PlayCta>
          </div>
        </div>
      </header>

      <GameGrid
        games={games}
        emptyMessage={t("empty", { platform: plat.platformName })}
      />

      <Pagination
        basePath={`/platform/${slug}`}
        current={pagination.current}
        pages={pagination.pages}
      />
    </PageContainer>
  );
}
