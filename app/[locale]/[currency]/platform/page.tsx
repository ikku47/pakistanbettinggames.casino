import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageContainer } from "@/components/layout/PageContainer";
import { GameImage } from "@/components/games/GameImage";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchPlatformCatalog } from "@/lib/api";
import { getCategoryByCode } from "@/lib/categories";
import { getSystemConfig } from "@/lib/system-config";
import { platformIconUrl } from "@/lib/platforms";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { resolvePageParams } from "@/lib/page-params";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; currency: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, currency } = await resolvePageParams(params);
  const t = await getTranslations({ locale, namespace: "Platforms" });
  const tMeta = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    currency,
    title: t("indexMetaTitle"),
    description: t("indexMetaDesc"),
    path: "/platform",
    siteName: tMeta("siteName"),
    titleSuffix: tMeta("titleSuffix"),
  });
}

export default async function PlatformsIndexPage({ params }: Props) {
  const { locale, currency } = await resolvePageParams(params);
  setRequestLocale(locale);

  const [t, tCommon, tCat, catalog, config] = await Promise.all([
    getTranslations({ locale, namespace: "Platforms" }),
    getTranslations({ locale, namespace: "Common" }),
    getTranslations({ locale, namespace: "Categories" }),
    fetchPlatformCatalog(locale),
    getSystemConfig(locale),
  ]);

  const listItems = catalog.map((p) => ({
    name: p.platformName,
    url: absoluteUrl(locale, `/platform/${p.slug}`, currency),
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
            ],
            currency,
          ),
          webPageJsonLd(
            locale,
            t("indexTitle"),
            t("indexMetaDesc"),
            "/platform",
            currency,
          ),
          itemListJsonLd(t("indexTitle"), listItems),
        ]}
      />

      <Breadcrumb
        items={[
          { label: tCommon("home"), href: "/" },
          { label: t("indexTitle") },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-text sm:text-3xl">
          {t("indexTitle")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
          {t("indexIntro")}
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.map((plat) => {
          const iconSrc = platformIconUrl(plat, config);
          const catDef = getCategoryByCode(plat.gameClassCode);
          const categoryLabel = catDef
            ? tCat(`${catDef.messageKey}.name`)
            : plat.gameClassCode;

          return (
            <li key={plat.platformId}>
              <Link
                href={`/platform/${plat.slug}`}
                className="card-surface link-card group flex items-center gap-4 p-4"
              >
                <span className="link-card-media flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-black p-2">
                  {iconSrc ? (
                    <GameImage
                      src={iconSrc}
                      alt={plat.platformName}
                      className="link-card-image h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs font-bold text-brand">
                      {plat.platformCode.slice(0, 3)}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-text group-hover:text-brand">
                    {plat.platformName}
                  </span>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {categoryLabel}
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className="link-card-chevron shrink-0 text-brand"
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </PageContainer>
  );
}
