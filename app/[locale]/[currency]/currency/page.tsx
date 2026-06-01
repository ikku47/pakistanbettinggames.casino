import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { CurrencyIndexView } from "@/components/currency/CurrencyHub";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  availableCurrencies,
  currencySlug,
} from "@/lib/currency";
import { resolvePageParams } from "@/lib/page-params";
import { getSystemConfig } from "@/lib/system-config";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; currency: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, currency } = await resolvePageParams(params);
  const t = await getTranslations({ locale, namespace: "Currency" });
  const tMeta = await getTranslations({ locale, namespace: "Meta" });

  return buildMetadata({
    locale,
    currency,
    title: t("indexTitle"),
    description: t("indexMetaDescription"),
    path: "/currency",
    keywords: t("indexKeywords"),
    siteName: tMeta("siteName"),
    titleSuffix: tMeta("titleSuffix"),
  });
}

export default async function CurrencyIndexPage({ params }: Props) {
  const { locale, currency } = await resolvePageParams(params);
  setRequestLocale(locale);

  const [t, tMeta, config] = await Promise.all([
    getTranslations({ locale, namespace: "Currency" }),
    getTranslations({ locale, namespace: "Meta" }),
    getSystemConfig(locale),
  ]);

  const codes = availableCurrencies(config);
  const listItems = codes.map((code) => ({
    name: `${code} — ${t(`codes.${code}.blurb`)}`,
    url: absoluteUrl(locale, `/${currencySlug(code)}`, code),
  }));

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd(
            locale,
            t("indexTitle"),
            t("indexMetaDescription"),
            "/currency",
            currency,
          ),
          breadcrumbJsonLd(
            locale,
            [
              { name: tMeta("siteName"), path: "/" },
              { name: t("indexTitle"), path: "/currency" },
            ],
            currency,
          ),
          itemListJsonLd(t("indexListName"), listItems),
        ]}
      />
      <CurrencyIndexView />
    </>
  );
}
