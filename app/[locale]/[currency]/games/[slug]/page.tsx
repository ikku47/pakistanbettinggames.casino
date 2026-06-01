import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageContainer } from "@/components/layout/PageContainer";
import { GameDetailView } from "@/components/games/GameDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  findGameById,
  fetchAllPlatIcons,
  fetchGameList,
  fetchPlatformIndex,
  fetchPopularGames,
} from "@/lib/api";
import { resolveGamePlatform } from "@/lib/platforms";
import { getCategoryByCode } from "@/lib/categories";
import { assetUrl } from "@/lib/config";
import { displayRating, modTags } from "@/lib/game-display";
import { getSystemConfig } from "@/lib/system-config";
import { applyCurrencyToConfig } from "@/lib/currency";
import { resolvePageParamsWith } from "@/lib/page-params";
import { breadcrumbJsonLd, buildMetadata, gameJsonLd } from "@/lib/seo";
import { formatGameTitle, parseGameSlug } from "@/lib/utils";
import type { AppLocale } from "@/i18n/routing";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; currency: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, currency, slug } = await resolvePageParamsWith(params);
  const id = parseGameSlug(slug);
  if (!id) return { title: "Not Found" };

  const [game, config] = await Promise.all([
    findGameById(locale, id),
    getSystemConfig(locale),
  ]);
  if (!game) return { title: "Not Found" };

  const t = await getTranslations({ locale, namespace: "GameDetail" });
  const tCat = await getTranslations({ locale, namespace: "Categories" });
  const tMeta = await getTranslations({ locale, namespace: "Meta" });
  const catDef = getCategoryByCode(game.gameClassCode);
  const category = catDef
    ? tCat(`${catDef.messageKey}.name`)
    : game.gameClassCode;
  const title = formatGameTitle(game.gameName);

  return buildMetadata({
    locale,
    currency,
    title: t("metaTitle", { title }),
    description: t("metaDesc", { title, category, currency }),
    path: `/games/${slug}`,
    siteName: tMeta("siteName"),
    titleSuffix: tMeta("titleSuffix"),
    image: game.iconUrl ? assetUrl(game.iconUrl, config) : undefined,
    imageAlt: title,
  });
}

async function fetchRelatedGames(
  locale: AppLocale,
  game: NonNullable<Awaited<ReturnType<typeof findGameById>>>,
) {
  if (game.gameClassCode === "RM_TEMP") {
    const popular = await fetchPopularGames(locale, 12);
    return popular.filter((g) => g.id !== game.id).slice(0, 8);
  }

  const page = await fetchGameList(locale, {
    gameClassCode: game.gameClassCode,
    pageSize: 12,
    pageNo: 1,
  });
  const fromList = page.records.filter((g) => g.id !== game.id);
  if (fromList.length >= 4) return fromList.slice(0, 8);

  const popular = await fetchPopularGames(locale, 12);
  return popular.filter((g) => g.id !== game.id).slice(0, 8);
}

export default async function GameDetailPage({ params }: Props) {
  const { locale, currency, slug } = await resolvePageParamsWith(params);
  setRequestLocale(locale);

  const id = parseGameSlug(slug);
  if (!id) notFound();

  const [
    game,
    config,
    platformIndex,
    partnerIcons,
    t,
    tCat,
    tCommon,
    tGames,
    tNav,
    tPartners,
  ] = await Promise.all([
    findGameById(locale, id),
    getSystemConfig(locale),
    fetchPlatformIndex(locale),
    fetchAllPlatIcons(locale),
    getTranslations({ locale, namespace: "GameDetail" }),
    getTranslations({ locale, namespace: "Categories" }),
    getTranslations({ locale, namespace: "Common" }),
    getTranslations({ locale, namespace: "Games" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Partners" }),
  ]);

  if (!game) notFound();

  const related = await fetchRelatedGames(locale, game);
  const wallet = applyCurrencyToConfig(config, currency);

  const title = formatGameTitle(game.gameName);
  const catDef = getCategoryByCode(game.gameClassCode);
  const categoryName = catDef
    ? tCat(`${catDef.messageKey}.name`)
    : game.gameClassCode;
  const categorySlug = catDef?.slug;
  const imageSrc = assetUrl(game.iconUrl, config);
  const gamePath = `/games/${slug}`;
  const tags = modTags(game);
  const platform = resolveGamePlatform(game, platformIndex);

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tGames("breadcrumbCatalog"), href: "/games" },
    ...(categorySlug
      ? [{ label: categoryName, href: `/category/${categorySlug}` }]
      : []),
    { label: title },
  ];

  return (
    <PageContainer>
      <JsonLd
        data={[
          breadcrumbJsonLd(
            locale,
            breadcrumbs.map((b, i) => ({
              name: b.label,
              path: b.href ?? (i === 1 ? "/games" : gamePath),
            })),
            currency,
          ),
          gameJsonLd({
            game,
            locale,
            currency,
            path: gamePath,
            currencyCode: wallet.currency_code,
            description: t("intro", {
              title,
              currency: wallet.currency_code,
            }),
            imageUrl: imageSrc,
            categoryName,
            platformName: platform.name,
            ratingValue: displayRating(game),
          }),
        ]}
      />

      <Breadcrumb items={breadcrumbs} />

      <GameDetailView
        game={game}
        config={wallet}
        title={title}
        categoryName={categoryName}
        categorySlug={categorySlug}
        imageSrc={imageSrc}
        tags={tags}
        related={related}
        platform={platform}
        partnerIcons={partnerIcons}
        labels={{
          playNow: t("playNow", { title }),
          downloadApp: tNav("downloadApp"),
          intro: t("intro", { title, currency: wallet.currency_code }),
          code: t("code"),
          category: t("category"),
          platform: t("platform"),
          type: t("type"),
          realMoney: t("realMoney"),
          casino: t("casino"),
          howToPlay: t("howToPlay"),
          steps: [
            t("step1"),
            t("step2"),
            t("step3"),
            t("step4", { title, category: categoryName }),
          ],
          highlightsTitle: t("highlightsTitle"),
          highlight1: t("highlight1"),
          highlight2: t("highlight2", { currency: wallet.currency_code }),
          highlight3: t("highlight3"),
          gameInfo: t("gameInfo"),
          relatedTitle: t("relatedTitle"),
          onlineNow: t("onlineNow"),
          editorsPick: t("editorsPick"),
          viewCategory: t("viewCategory", { category: categoryName }),
          partnersTitle: tPartners("title"),
          partnersSubtitle: tPartners("subtitle"),
        }}
      />
    </PageContainer>
  );
}
