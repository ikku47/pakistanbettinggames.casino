"use client";

import { ChevronDown, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const labels: Record<AppLocale, string> = {
  "en-PK": "EN",
  "hi-IN": "हि",
  "ur-PK": "اردو",
  "zh-CN": "中文",
};

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={cn("relative shrink-0", className)} title={t("label")}>
      <Languages
        size={16}
        strokeWidth={2}
        className="pointer-events-none absolute start-2.5 top-1/2 z-10 -translate-y-1/2 text-white/85"
        aria-hidden
      />
      <select
        value={locale}
        onChange={(e) =>
          router.replace(pathname, { locale: e.target.value as AppLocale })
        }
        aria-label={t("label")}
        className="h-9 min-w-[4.75rem] cursor-pointer appearance-none rounded-lg bg-white/15 py-0 ps-8 pe-6 text-xs font-bold text-white transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40"
      >
        {locales.map((l) => (
          <option key={l} value={l} className="bg-surface font-medium text-text">
            {labels[l]}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        strokeWidth={2.5}
        className="pointer-events-none absolute end-1.5 top-1/2 -translate-y-1/2 text-white/75"
        aria-hidden
      />
    </div>
  );
}
