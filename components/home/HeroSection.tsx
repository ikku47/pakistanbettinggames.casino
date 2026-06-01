"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { PlayCta } from "@/components/ui/PlayCta";

export function HeroSection() {
  const t = useTranslations("Home");
  const tMeta = useTranslations("Meta");
  const tNav = useTranslations("Nav");

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-[#1aaa50] to-brand-dark p-6 text-white shadow-lg sm:p-9">
      <div
        className="pointer-events-none absolute -end-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 start-1/4 h-40 w-40 rounded-full bg-black/10 blur-2xl"
        aria-hidden
      />

      <div className="relative">
        <p className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
          {t("heroBadge")}
        </p>

        <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.5rem]">
          {tMeta("siteName")}
        </h1>

        <p className="mt-3 max-w-xl text-base font-semibold leading-snug text-white/90 sm:text-lg">
          {t("heroSubtitle")}
        </p>

        <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80">
          {tMeta("description")}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <PlayCta
            size="lg"
            variant="outline"
            className="!rounded-xl !border-white !bg-white !text-brand shadow-md hover:!bg-white/95"
          >
            {t("heroCta")}
          </PlayCta>
          <PlayCta
            size="lg"
            mode="download"
            variant="ghost"
            className="!rounded-xl !bg-white/15 !text-white ring-1 ring-white/30 hover:!bg-white/25"
          >
            {tNav("downloadApp")}
          </PlayCta>
          <Link
            href="#hot-list"
            className="inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            {t("heroBrowse")}
            <ChevronDown size={16} aria-hidden />
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {(
            [
              ["factDeposits", "factDepositsVal"],
              ["factGames", "factGamesVal"],
              ["factAccess", "factAccessVal"],
              ["factPayouts", "factPayoutsVal"],
            ] as const
          ).map(([label, value]) => (
            <li
              key={label}
              className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm ring-1 ring-white/15"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                {t(label)}
              </p>
              <p className="mt-0.5 text-xs font-bold text-white sm:text-sm">
                {t(value)}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs font-medium text-white/60">{t("ageNotice")}</p>
      </div>
    </section>
  );
}
