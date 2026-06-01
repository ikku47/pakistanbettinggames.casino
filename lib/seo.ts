import type { Metadata } from "next";
import { htmlLang } from "@/i18n/api-locale";
import { locales, type AppLocale } from "@/i18n/routing";
import {
  isPrimarySeoCurrency,
  PRIMARY_SEO_CURRENCY,
  pathWithCurrency,
  type CurrencyCode,
} from "./currency";
import { siteConfig } from "./config";
import type { GameRecord } from "./types";
import { formatGameTitle } from "./utils";

export const OG_COVER_PATH = "/og-cover.jpg";
export const OG_COVER_WIDTH = 1731;
export const OG_COVER_HEIGHT = 909;
/** CSS aspect-ratio value matching `public/og-cover.jpg`. */
export const OG_COVER_ASPECT_RATIO = OG_COVER_WIDTH / OG_COVER_HEIGHT;

/** Absolute URL for the default social share image (`public/og-cover.jpg`). */
export function defaultOgImageUrl(): string {
  const base = siteConfig.domain.replace(/\/$/, "");
  return `${base}${OG_COVER_PATH}`;
}

/** Use page image when valid; otherwise fall back to `og-cover.jpg`. */
export function resolveOgImageUrl(image?: string | null): string {
  if (!image || image.includes("placeholder-game")) {
    return defaultOgImageUrl();
  }
  return image;
}

/** Site path including locale + currency: `/en-PK/pkr/games`. */
export function localizedPath(
  locale: AppLocale,
  path = "",
  currency?: CurrencyCode,
): string {
  const internal =
    currency != null ? pathWithCurrency(currency, path || "/") : path;
  const normalized = internal.startsWith("/") ? internal : internal ? `/${internal}` : "";
  return `/${locale}${normalized}`;
}

export function absoluteUrl(
  locale: AppLocale,
  path = "",
  currency?: CurrencyCode,
): string {
  const base = siteConfig.domain.replace(/\/$/, "");
  return `${base}${localizedPath(locale, path, currency)}`;
}

/** Language alternates always use {@link PRIMARY_SEO_CURRENCY} to avoid duplicate currency URLs. */
export function hreflangAlternates(path = ""): Record<string, string> {
  const base = siteConfig.domain.replace(/\/$/, "");
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[htmlLang[locale]] = `${base}${localizedPath(
      locale,
      path,
      PRIMARY_SEO_CURRENCY,
    )}`;
  }

  languages["x-default"] = `${base}${localizedPath(
    "en-PK",
    path,
    PRIMARY_SEO_CURRENCY,
  )}`;
  return languages;
}

export function buildMetadata(opts: {
  locale: AppLocale;
  currency: CurrencyCode;
  title: string;
  description: string;
  /** Path after currency segment, e.g. `/games` or `/`. */
  path?: string;
  keywords?: string;
  noIndex?: boolean;
  siteName?: string;
  titleSuffix?: string;
  /** Absolute URL for Open Graph / Twitter (e.g. game icon from CDN). */
  image?: string;
  imageAlt?: string;
}): Metadata {
  const path = opts.path ?? "/";
  const url = absoluteUrl(opts.locale, path, opts.currency);
  const canonical = isPrimarySeoCurrency(opts.currency)
    ? url
    : absoluteUrl(opts.locale, path, PRIMARY_SEO_CURRENCY);
  const indexable =
    opts.noIndex === undefined
      ? isPrimarySeoCurrency(opts.currency)
      : !opts.noIndex;
  const suffix = opts.titleSuffix ?? "Online Casino & Betting";
  const siteName = opts.siteName ?? "Pakistan Betting Games";
  const fullTitle =
    opts.title === siteName
      ? `${opts.title} | ${suffix}`
      : `${opts.title} | ${siteName}`;

  const imageUrl = resolveOgImageUrl(opts.image);
  const isDefaultCover = imageUrl.endsWith(OG_COVER_PATH);
  const ogImages = [
    {
      url: imageUrl,
      width: isDefaultCover ? OG_COVER_WIDTH : 512,
      height: isDefaultCover ? OG_COVER_HEIGHT : 512,
      alt: opts.imageAlt ?? opts.title,
    },
  ];

  return {
    title: fullTitle,
    description: opts.description,
    keywords: opts.keywords,
    alternates: {
      canonical,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      type: "website",
      locale: htmlLang[opts.locale].replace("-", "_"),
      url,
      siteName,
      title: fullTitle,
      description: opts.description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: opts.description,
      images: ogImages.map((img) => img.url),
    },
    robots: !indexable
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function siteLogoUrl(): string {
  const base = siteConfig.domain.replace(/\/$/, "");
  return `${base}/logo.png`;
}

export function organizationJsonLd(
  locale: AppLocale,
  siteName: string,
  description: string,
  currency: CurrencyCode,
) {
  const url = absoluteUrl(locale, "/", currency);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#organization`,
    name: siteName,
    url,
    description,
    logo: siteLogoUrl(),
  };
}

export function websiteJsonLd(
  locale: AppLocale,
  siteName: string,
  description: string,
  currency: CurrencyCode,
) {
  const url = absoluteUrl(locale, "/", currency);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}#website`,
    name: siteName,
    url,
    description,
    inLanguage: htmlLang[locale],
    publisher: { "@id": `${url}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl(locale, "/games", currency)}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(opts: {
  locale: AppLocale;
  currency: CurrencyCode;
  path: string;
  headline: string;
  description: string;
  dateModified?: string;
}) {
  const url = absoluteUrl(opts.locale, opts.path, opts.currency);
  const home = absoluteUrl(opts.locale, "/", opts.currency);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: opts.headline,
    description: opts.description,
    url,
    inLanguage: htmlLang[opts.locale],
    isPartOf: { "@id": `${home}#website` },
    publisher: { "@id": `${home}#organization` },
    dateModified: opts.dateModified ?? new Date().toISOString().split("T")[0],
  };
}

export function webPageJsonLd(
  locale: AppLocale,
  name: string,
  description: string,
  path: string,
  currency: CurrencyCode,
) {
  const url = absoluteUrl(locale, path, currency);
  const home = absoluteUrl(locale, "/", currency);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name,
    description,
    url,
    inLanguage: htmlLang[locale],
    isPartOf: { "@id": `${home}#website` },
  };
}

export function breadcrumbJsonLd(
  locale: AppLocale,
  items: { name: string; path: string }[],
  currency: CurrencyCode,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path, currency),
    })),
  };
}

export function gameJsonLd(opts: {
  game: GameRecord;
  locale: AppLocale;
  currency: CurrencyCode;
  path: string;
  currencyCode: string;
  description: string;
  imageUrl?: string;
  categoryName?: string;
  platformName?: string;
  ratingValue?: string;
}) {
  const { game, locale, path, currencyCode, description, imageUrl } = opts;
  const title = formatGameTitle(game.gameName);
  const url = absoluteUrl(opts.locale, path, opts.currency);

  return {
    "@context": "https://schema.org",
    "@type": ["VideoGame", "SoftwareApplication"],
    "@id": `${url}#game`,
    name: title,
    description,
    url,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    applicationCategory: "GameApplication",
    operatingSystem: ["Web", "Android", "iOS"],
    inLanguage: htmlLang[locale],
    ...(opts.categoryName ? { genre: opts.categoryName } : {}),
    ...(opts.platformName
      ? { author: { "@type": "Organization", name: opts.platformName } }
      : {}),
    ...(opts.ratingValue
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: opts.ratingValue,
            bestRating: "5",
            worstRating: "1",
            ratingCount: String(80 + (game.id % 400)),
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: currencyCode,
      availability: "https://schema.org/InStock",
      url,
    },
    isAccessibleForFree: true,
    playMode: "MultiPlayer",
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function itemListJsonLd(
  name: string,
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export const FAQ_ITEM_IDS = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
  "q11",
  "q12",
] as const;

export function getFaqItems(t: (key: string) => string) {
  return FAQ_ITEM_IDS.map((id) => ({
    question: t(`items.${id}`),
    answer: t(`items.a${id.slice(1)}`),
  }));
}
