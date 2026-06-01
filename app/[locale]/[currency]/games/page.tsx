import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { GameGrid } from "@/components/games/GameGrid";
import { Pagination } from "@/components/games/Pagination";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchGameList, searchGamesByName } from "@/lib/api";
import { resolvePageParams } from "@/lib/page-params";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { formatGameTitle, gameSlug } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string; currency: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale, currency } = await resolvePageParams(params);
  const { q } = await searchParams;
  const t = await getTranslations({ locale, namespace: "Games" });
  const tMeta = await getTranslations({ locale, namespace: "Meta" });
  const trimmed = q?.trim();

  if (trimmed && trimmed.length >= 2) {
    return buildMetadata({
      locale,
      currency,
      title: t("searchMetaTitle", { query: trimmed }),
      description: t("searchMetaDesc", { query: trimmed }),
      path: `/games?q=${encodeURIComponent(trimmed)}`,
      siteName: tMeta("siteName"),
      titleSuffix: tMeta("titleSuffix"),
      noIndex: false,
    });
  }

  return buildMetadata({
    locale,
    currency,
    title: t("allTitle"),
    description: t("allDesc"),
    path: "/games",
    siteName: tMeta("siteName"),
    titleSuffix: tMeta("titleSuffix"),
  });
}

export default async function GamesPage({ params, searchParams }: Props) {
  const { locale, currency } = await resolvePageParams(params);
  setRequestLocale(locale);

  const query = await searchParams;
  const pageNo = Math.max(1, Number(query.page) || 1);
  const searchQuery = query.q?.trim() ?? "";
  const isSearch = searchQuery.length >= 2;

  const [data, t, tCommon] = await Promise.all([
    isSearch
      ? null
      : fetchGameList(locale, {
          gameClassCode: "DZ",
          pageNo,
          pageSize: 48,
        }),
    getTranslations({ locale, namespace: "Games" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);

  const games = isSearch
    ? await searchGamesByName(locale, searchQuery, 48)
    : (data?.records ?? []);

  const pageTitle = isSearch
    ? t("searchTitle", { query: searchQuery })
    : t("catalogTitle");
  const pageDesc = isSearch
    ? t("searchDesc", { query: searchQuery, count: games.length })
    : t("catalogDesc");

  const listItems = games.slice(0, 20).map((g) => ({
    name: formatGameTitle(g.gameName),
    url: absoluteUrl(locale, `/games/${gameSlug(g)}`, currency),
  }));

  const gamesPath = isSearch
    ? `/games?q=${encodeURIComponent(searchQuery)}`
    : "/games";

  return (
    <PageContainer>
      <JsonLd
        data={[
          breadcrumbJsonLd(
            locale,
            [
              { name: tCommon("home"), path: "/" },
              { name: t("breadcrumbCatalog"), path: gamesPath },
            ],
            currency,
          ),
          webPageJsonLd(locale, pageTitle, pageDesc, gamesPath, currency),
          ...(listItems.length > 0
            ? [itemListJsonLd(pageTitle, listItems)]
            : []),
        ]}
      />

      <Breadcrumb
        items={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbCatalog"), href: isSearch ? "/games" : undefined },
          ...(isSearch ? [{ label: searchQuery }] : []),
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-text sm:text-3xl">
          {pageTitle}
          {!isSearch && data && (
            <span className="ms-2 text-lg font-normal text-text-muted">
              ({data.total})
            </span>
          )}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">{pageDesc}</p>
      </header>

      <GameGrid
        games={games}
        emptyMessage={
          isSearch ? t("searchEmpty", { query: searchQuery }) : undefined
        }
      />

      {!isSearch && data && (
        <Pagination
          basePath="/games"
          current={data.current}
          pages={data.pages}
        />
      )}
    </PageContainer>
  );
}
