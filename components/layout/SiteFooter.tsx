"use client";

import { useTranslations } from "next-intl";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { SiteLogo } from "@/components/brand/SiteLogo";

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
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <SiteLogo size={44} />
              <span className="text-lg font-extrabold tracking-tight text-brand">
                {tMeta("siteName")}
              </span>
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {t("blurb")}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">{t("playCol")}</p>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>
                <Link href="/category/popular" className="hover:text-brand">
                  {t("hotList")}
                </Link>
              </li>
              <li>
                <Link href="/category/slots" className="hover:text-brand">
                  {tCat("slots.name")}
                </Link>
              </li>
              <li>
                <Link href="/games" className="hover:text-brand">
                  {tNav("allGames")}
                </Link>
              </li>
              <li>
                <Link href="/platform" className="hover:text-brand">
                  {t("providers")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">{t("infoCol")}</p>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>
                <Link href="/currency" className="hover:text-brand">
                  {t("currencies")}
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-brand">
                  {t("guidesLink")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand">
                  {tCommon("faq")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand">
                  {tCommon("about")}
                </Link>
              </li>
              <li>
                <Link href="/about#licenses" className="hover:text-brand">
                  {t("licenses")}
                </Link>
              </li>
              <li>
                <a href="/llms.txt" className="hover:text-brand">
                  {t("llms")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-border pt-6 text-center text-xs text-text-muted">
          {t("copyright", { year, siteName: tMeta("siteName") })} · {t("disclaimer")}
        </p>
      </div>
    </footer>
  );
}
