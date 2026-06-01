import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { GameGrid } from "@/components/games/GameGrid";
import { Pagination } from "@/components/games/Pagination";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageContainer } from "@/components/layout/PageContainer";
import { PlayCta } from "@/components/ui/PlayCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchGameList } from "@/lib/api";
import {
  getCachedGameClasses,
  getCachedPopularGames,
} from "@/lib/catalog-data";
import { categoryIconSrc, getCategoryBySlug } from "@/lib/categories";
import { getSystemConfig } from "@/lib/system-config";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
} from "@/lib/seo";
import { formatGameTitle, gameSlug } from "@/lib/utils";
import { resolvePageParamsWith } from "@/lib/page-params";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string; currency: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const revalidate = 2592000;

export function generateStaticParams() {
  return ["popular", "slots", "sports", "fishing", "cards", "live-casino"].map(
    (slug) => ({ slug }),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, currency, slug } = await resolvePageParamsWith(params);
  const def = getCategoryBySlug(slug);
  if (!def) return { title: "Not Found" };

  const tCat = await getTranslations({ locale, namespace: "Categories" });
  const tMeta = await getTranslations({ locale, namespace: "Meta" });

  const [classes, config] = await Promise.all([
    getCachedGameClasses(locale),
    getSystemConfig(locale),
  ]);
  const iconSrc = categoryIconSrc(classes, def.code, config);

  return buildMetadata({
    locale,
    currency,
    title: tCat(`${def.messageKey}.seoTitle`),
    description: tCat(`${def.messageKey}.description`),
    path: `/category/${slug}`,
    siteName: tMeta("siteName"),
    titleSuffix: tMeta("titleSuffix"),
    ...(iconSrc ? { image: iconSrc, imageAlt: tCat(`${def.messageKey}.name`) } : {}),
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale, currency, slug } = await resolvePageParamsWith(params);
  setRequestLocale(locale);

  const def = getCategoryBySlug(slug);
  if (!def) notFound();

  const query = await searchParams;
  const pageNo = Math.max(1, Number(query.page) || 1);
  const isPopular = def.code === "RM_TEMP";

  const [tCat, tGames, tCommon, classes, config] = await Promise.all([
    getTranslations({ locale, namespace: "Categories" }),
    getTranslations({ locale, namespace: "Games" }),
    getTranslations({ locale, namespace: "Common" }),
    getCachedGameClasses(locale),
    getSystemConfig(locale),
  ]);

  const name = tCat(`${def.messageKey}.name`);
  const description = tCat(`${def.messageKey}.description`);
  const iconSrc = categoryIconSrc(classes, def.code, config);

  let games;
  let pagination = { current: 1, pages: 1 };

  if (isPopular) {
    games = await getCachedPopularGames(locale, 48);
  } else {
    const data = await fetchGameList(locale, {
      gameClassCode: def.code,
      pageNo,
      pageSize: 48,
    });
    games = data.records;
    pagination = { current: data.current, pages: data.pages };

    if (games.length === 0 && pageNo === 1) {
      const match = classes.find((c) => c.code === def.code);
      games = match?.games ?? [];
    }
  }

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
              { name, path: `/category/${slug}` },
            ],
            currency,
          ),
          itemListJsonLd(tCat(`${def.messageKey}.seoTitle`), listItems),
        ]}
      />

      <Breadcrumb
        items={[
          { label: tCommon("home"), href: "/" },
          { label: name },
        ]}
      />

      <header className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-surface p-6 shadow-sm sm:flex-row sm:items-start sm:gap-6">
        {iconSrc && (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-light p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={iconSrc}
              alt={name}
              width={80}
              height={80}
              className="h-full w-full object-contain"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="mt-2 text-2xl font-bold text-text sm:text-3xl">{name}</h1>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {description}
          </p>
          <div className="mt-4">
            <PlayCta>
              {tGames("playCategory", { category: name })}
            </PlayCta>
          </div>
        </div>
      </header>

      <GameGrid
        games={games}
        emptyMessage={tGames("categoryEmpty", { category: name })}
      />

      {!isPopular && (
        <Pagination
          basePath={`/category/${slug}`}
          current={pagination.current}
          pages={pagination.pages}
        />
      )}
    </PageContainer>
  );
}
