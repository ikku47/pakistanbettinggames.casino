import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { guides } from "@/lib/guides";
import { resolvePageParams } from "@/lib/page-params";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  itemListJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { ChevronRight, ListOrdered } from "lucide-react";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; currency: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, currency } = await resolvePageParams(params);
  const t = await getTranslations({ locale, namespace: "Guides" });
  const tMeta = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    currency,
    title: t("indexMetaTitle"),
    description: t("indexMetaDesc"),
    path: "/guides",
    siteName: tMeta("siteName"),
    titleSuffix: tMeta("titleSuffix"),
  });
}

export default async function GuidesIndexPage({ params }: Props) {
  const { locale, currency } = await resolvePageParams(params);
  setRequestLocale(locale);

  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "Guides" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);

  const listItems = guides.map((g) => ({
    name: t(`items.${g.messageKey}.title`),
    url: absoluteUrl(locale, `/guides/${g.slug}`, currency),
  }));

  return (
    <PageContainer>
      <JsonLd
        data={[
          breadcrumbJsonLd(
            locale,
            [
              { name: tCommon("home"), path: "/" },
              { name: t("indexTitle"), path: "/guides" },
            ],
            currency,
          ),
          webPageJsonLd(
            locale,
            t("indexTitle"),
            t("indexMetaDesc"),
            "/guides",
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

      <header className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-[#1aaa50] to-brand-dark text-white shadow-lg">
        <div
          className="pointer-events-none absolute -end-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div className="relative p-6 sm:p-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            <ListOrdered size={14} aria-hidden />
            {t("guideLabel")}
          </p>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            {t("indexTitle")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
            {t("indexIntro")}
          </p>
          <p className="mt-4 text-xs font-medium text-white/60">
            {t("updatedNote")}
          </p>
        </div>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {guides.map((guide, index) => (
          <li key={guide.slug}>
            <Link
              href={`/guides/${guide.slug}`}
              className="card-surface link-card group flex h-full flex-col p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-sm font-bold text-brand">
                  {index + 1}
                </span>
                <ChevronRight
                  size={18}
                  className="link-card-chevron-visible shrink-0 text-text-muted group-hover:text-brand"
                  aria-hidden
                />
              </div>
              <h2 className="mt-4 text-base font-bold leading-snug tracking-tight text-text group-hover:text-brand">
                {t(`items.${guide.messageKey}.title`)}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">
                {t(`items.${guide.messageKey}.teaser`)}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                {t("readGuide")}
                <ChevronRight size={16} aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
