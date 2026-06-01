import { getTranslations } from "next-intl/server";
import { currencySymbol, type CurrencyCode } from "./currency";
import { buildMetadata } from "./seo";
import type { AppLocale } from "@/i18n/routing";

export async function buildHomeMetadata(
  locale: AppLocale,
  currency: CurrencyCode,
) {
  const tMeta = await getTranslations({ locale, namespace: "Meta" });
  const tCur = await getTranslations({ locale, namespace: "Currency" });
  const symbol = currencySymbol(currency);

  const title =
    currency === "PKR"
      ? tMeta("siteName")
      : tCur("hubTitle", { currency, symbol });
  const description =
    currency === "PKR"
      ? tMeta("description")
      : tCur("hubMetaDescription", { currency, symbol });
  const keywords =
    currency === "PKR"
      ? tMeta("keywords")
      : tCur(`codes.${currency}.keywords`);

  return buildMetadata({
    locale,
    currency,
    title,
    description,
    path: "/",
    keywords,
    siteName: tMeta("siteName"),
    titleSuffix: tMeta("titleSuffix"),
    imageAlt: title,
  });
}
