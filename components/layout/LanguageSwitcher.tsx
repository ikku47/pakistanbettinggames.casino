"use client";

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

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-lg bg-white/15 p-0.5",
        className,
      )}
    >
      <span className="sr-only">{t("label")}</span>
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => router.replace(pathname, { locale: l })}
          className={cn(
            "rounded-md px-2 py-1 text-xs font-medium transition",
            l === locale
              ? "bg-white text-brand shadow-sm"
              : "text-white/90 hover:bg-white/20",
          )}
          aria-current={l === locale ? "true" : undefined}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
