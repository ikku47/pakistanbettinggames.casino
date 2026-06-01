"use client";

import { useTranslations } from "next-intl";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { SeoKeywordPills } from "@/components/seo/SeoKeywordPills";
import { PlayCta } from "@/components/ui/PlayCta";
import { categories } from "@/lib/categories";
import { CURRENCY_CODES, currencySlug } from "@/lib/currency";
import { FEATURED_PLATFORM_LINKS } from "@/lib/featured-platforms";
import { guides } from "@/lib/guides";

const footerLinkClass =
  "text-text-secondary transition hover:text-brand";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const tMeta = useTranslations("Meta");
  const tNav = useTranslations("Nav");
  const tCat = useTranslations("Categories");
  const tCommon = useTranslations("Common");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-14 border-t border-border bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <SiteLogo size={44} />
              <span className="text-lg font-extrabold tracking-tight text-brand">
                {tMeta("siteName")}
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              {t("blurb")}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-text-muted">
              {tMeta("description")}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <PlayCta size="sm">{tNav("enterCasino")}</PlayCta>
              <PlayCta size="sm" mode="download" variant="outline">
                {tNav("downloadApp")}
              </PlayCta>
            </div>
            <p className="mt-4 text-xs font-medium text-text-muted">
              {t("ageNotice")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            <div>
              <p className="text-sm font-semibold text-text">
                {t("categoriesCol")}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className={footerLinkClass}
                    >
                      {tCat(`${cat.messageKey}.name`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-text">{t("guidesCol")}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {guides.map((guide) => (
                  <li key={guide.slug}>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className={footerLinkClass}
                    >
                      {t(`guideLinks.${guide.messageKey}`)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/guides" className={`${footerLinkClass} font-semibold`}>
                    {t("viewAllGuides")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-text">
                {t("providersCol")}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {FEATURED_PLATFORM_LINKS.map((plat) => (
                  <li key={plat.slug}>
                    <Link
                      href={`/platform/${plat.slug}`}
                      className={footerLinkClass}
                    >
                      {plat.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/platform"
                    className={`${footerLinkClass} font-semibold`}
                  >
                    {t("viewAllProviders")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-text">{t("siteCol")}</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/games" className={footerLinkClass}>
                    {tNav("allGames")}
                  </Link>
                </li>
                <li>
                  <Link href="/currency" className={footerLinkClass}>
                    {t("currencies")}
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className={footerLinkClass}>
                    {tCommon("faq")}
                  </Link>
                </li>
                <li>
                  <Link href="/about" className={footerLinkClass}>
                    {tCommon("about")}
                  </Link>
                </li>
                <li>
                  <Link href="/about#licenses" className={footerLinkClass}>
                    {t("licenses")}
                  </Link>
                </li>
                <li>
                  <a href="/llms.txt" className={footerLinkClass}>
                    {t("llms")}
                  </a>
                </li>
                <li>
                  <a href="/ai.txt" className={footerLinkClass}>
                    {t("aiTxt")}
                  </a>
                </li>
              </ul>

              <p className="mt-5 text-sm font-semibold text-text">
                {t("walletsCol")}
              </p>
              <ul className="mt-2 flex flex-wrap gap-2 text-xs">
                {CURRENCY_CODES.map((code) => (
                  <li key={code}>
                    <Link
                      href={`/${currencySlug(code)}`}
                      className="rounded-md bg-brand-light px-2 py-1 font-semibold text-brand transition hover:bg-brand/15"
                    >
                      {code}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-sm font-semibold text-text">
                {t("paymentsCol")}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {t("paymentsNote")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t("keywordsCol")}
          </p>
          <SeoKeywordPills
            items={tMeta("keywordTags")}
            className="mt-3"
            variant="footer"
          />
        </div>

        <p className="mt-8 border-t border-border pt-6 text-center text-xs text-text-muted">
          {t("copyright", { year, siteName: tMeta("siteName") })} · {t("disclaimer")}
        </p>
      </div>
    </footer>
  );
}
