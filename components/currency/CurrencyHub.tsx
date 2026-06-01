"use client";

import { useTranslations } from "next-intl";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { PageContainer } from "@/components/layout/PageContainer";
import { PlayCta } from "@/components/ui/PlayCta";
import { useLocaleConfig } from "@/components/providers/LocaleConfigProvider";
import {
  availableCurrencies,
  currencySlug,
  currencySymbol,
  type CurrencyCode,
} from "@/lib/currency";

export function CurrencyIndexView() {
  const t = useTranslations("Currency");
  const { config } = useLocaleConfig();
  const codes = availableCurrencies(config);

  return (
    <PageContainer>
      <header className="mb-8 max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">
          {t("indexEyebrow")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          {t("indexTitle")}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-text-secondary">
          {t("indexSubtitle")}
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {codes.map((code) => (
          <li key={code}>
            <Link
              href={`/${currencySlug(code)}`}
              className="flex h-full flex-col rounded-xl border border-border bg-surface p-5 shadow-sm transition hover:border-brand hover:shadow-md"
            >
              <span className="text-2xl font-black text-brand">
                {currencySymbol(code)}
              </span>
              <span className="mt-2 text-lg font-bold text-text">{code}</span>
              <span className="mt-1 text-sm text-text-secondary">
                {t(`codes.${code}.blurb`)}
              </span>
              <span className="mt-4 text-sm font-semibold text-brand">
                {t("viewHub")} →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}

export function CurrencyDetailView({ code }: { code: CurrencyCode }) {
  const t = useTranslations("Currency");
  const { config } = useLocaleConfig();
  const symbol = currencySymbol(code);

  return (
    <PageContainer>
      <nav className="mb-4 text-sm text-text-secondary">
        <Link href="/currency" className="hover:text-brand">
          {t("indexTitle")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-text">{code}</span>
      </nav>

      <header className="mb-8 max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">
          {t("hubEyebrow", { currency: code })}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          {t("hubTitle", { currency: code, symbol })}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-text-secondary">
          {t("hubLead", { currency: code, symbol })}
        </p>
      </header>

      <div className="prose prose-sm max-w-none text-text-secondary">
        <p>{t("hubP1", { currency: code })}</p>
        <p>{t("hubP2", { currency: code })}</p>
        <ul className="mt-4 list-disc space-y-2 ps-5">
          <li>{t("hubLi1", { currency: code })}</li>
          <li>{t("hubLi2")}</li>
          <li>{t("hubLi3")}</li>
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <PlayCta size="lg">{t("hubCta", { currency: code })}</PlayCta>
        <PlayCta href="/games" variant="outline" size="lg">
          {t("hubBrowse")}
        </PlayCta>
      </div>

      <p className="mt-8 text-sm text-text-muted">{t("localeNote")}</p>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-bold text-text">{t("otherWallets")}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {availableCurrencies(config)
            .filter((c) => c !== code)
            .map((c) => (
              <li key={c}>
                <Link
                  href={`/${currencySlug(c)}`}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-secondary hover:border-brand hover:text-brand"
                >
                  {c}
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </PageContainer>
  );
}
