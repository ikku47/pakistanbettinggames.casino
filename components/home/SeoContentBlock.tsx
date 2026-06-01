"use client";

import { useTranslations } from "next-intl";
import { useLocaleConfig } from "@/components/providers/LocaleConfigProvider";

export function SeoContentBlock() {
  const t = useTranslations("Home");
  const { config } = useLocaleConfig();

  return (
    <section className="prose-content card-surface mt-12 p-6 sm:p-8">
      <h2 className="text-lg font-bold text-text">{t("seoTitle")}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
        <p>{t("seoP1", { currency: config.currency_code })}</p>
        <p>{t("seoP2")}</p>
        <h3 className="pt-2 font-semibold text-text">{t("seoWhy")}</h3>
        <ul className="list-disc space-y-1 ps-5">
          {(["seoLi1", "seoLi2", "seoLi3", "seoLi4"] as const).map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
