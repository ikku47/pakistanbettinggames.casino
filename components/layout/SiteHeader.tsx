"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { categories } from "@/lib/categories";
import { isNavLinkActive } from "@/lib/nav-active";
import { PlayCta } from "@/components/ui/PlayCta";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { GameSearch } from "@/components/search/GameSearch";
import { ThemeToggle } from "./ThemeToggle";
import { CurrencySelector } from "@/components/currency/CurrencySelector";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations();
  const tCat = useTranslations("Categories");
  const pathname = usePathname();

  const navLinkClass = (href: string) =>
    cn(
      "shrink-0 rounded-lg px-3 py-2.5 text-sm transition",
      isNavLinkActive(pathname, href)
        ? "bg-brand-light font-semibold text-brand"
        : "font-medium text-text-secondary hover:bg-surface-hover hover:text-brand",
    );

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/90 shadow-sm backdrop-blur-md dark:bg-surface/95">
      <div className="bg-gradient-to-r from-brand to-brand-dark">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <Link href="/" className="group flex items-center gap-3">
            <SiteLogo size={36}  priority />
            <div className="leading-tight text-white">
              <span className="block text-lg font-bold tracking-tight">
                {t("Meta.shortName")}
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-white/75">
                {t("Meta.tagline")}
              </span>
            </div>
          </Link>

          <div className="hidden flex-1 justify-center px-4 md:flex">
            <GameSearch className="max-w-md" variant="header" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <CurrencySelector className="hidden sm:inline-flex" />
            <ThemeToggle />
            <LanguageSwitcher className="hidden sm:flex" />
            <PlayCta
              size="sm"
              variant="outline"
              className="!rounded-lg !border-white !bg-white !font-bold !text-brand shadow-sm hover:!bg-white/95"
            >
              {t("Nav.enterCasino")}
            </PlayCta>
          </div>
        </div>
        <div className="border-t border-white/10 px-4 pb-3 md:hidden">
          <GameSearch variant="header" />
        </div>
      </div>

      <nav aria-label="Main navigation">
        <div className="mx-auto flex max-w-6xl items-center gap-0.5 overflow-x-auto px-3 py-2 sm:px-5 scrollbar-hide md:gap-1">
          <CurrencySelector variant="nav" className="me-0.5 shrink-0 md:hidden" />
          <ThemeToggle variant="nav" className="me-0.5 shrink-0 md:hidden" />
          <Link
            href="/"
            className={navLinkClass("/")}
            aria-current={isNavLinkActive(pathname, "/") ? "page" : undefined}
          >
            {t("Common.home")}
          </Link>
          {categories.map((cat) => {
            const href = `/category/${cat.slug}`;
            return (
              <Link
                key={cat.slug}
                href={href}
                className={navLinkClass(href)}
                aria-current={
                  isNavLinkActive(pathname, href) ? "page" : undefined
                }
              >
                {tCat(`${cat.messageKey}.name`)}
              </Link>
            );
          })}
          <Link
            href="/games"
            className={navLinkClass("/games")}
            aria-current={
              isNavLinkActive(pathname, "/games") ? "page" : undefined
            }
          >
            {t("Nav.allGames")}
          </Link>
          <Link
            href="/guides"
            className={navLinkClass("/guides")}
            aria-current={
              isNavLinkActive(pathname, "/guides") ? "page" : undefined
            }
          >
            {t("Nav.guides")}
          </Link>
          <Link
            href="/faq"
            className={navLinkClass("/faq")}
            aria-current={isNavLinkActive(pathname, "/faq") ? "page" : undefined}
          >
            {t("Common.faq")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
