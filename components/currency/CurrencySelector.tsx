"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocaleConfig } from "@/components/providers/LocaleConfigProvider";
import {
  availableCurrencies,
  replaceCurrencyInPath,
  type CurrencyCode,
} from "@/lib/currency";
import { cn } from "@/lib/utils";

interface CurrencySelectorProps {
  className?: string;
  variant?: "header" | "nav";
}

export function CurrencySelector({
  className,
  variant = "header",
}: CurrencySelectorProps) {
  const t = useTranslations("Currency");
  const { config, locale, currency, setCurrency } = useLocaleConfig();
  const router = useRouter();
  const pathname = usePathname();
  const options = availableCurrencies(config);

  const selectClass =
    variant === "header"
      ? "rounded-md border-0 bg-white/95 py-1.5 ps-2 pe-7 text-xs font-semibold text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 dark:bg-surface-elevated dark:focus:ring-brand/40"
      : "rounded-md border border-border bg-surface py-1.5 ps-2 pe-7 text-xs font-medium text-text focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

  return (
    <label className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="sr-only">{t("selectLabel")}</span>
      <select
        value={currency}
        onChange={(e) => {
          const next = e.target.value as CurrencyCode;
          setCurrency(next);
          router.replace(replaceCurrencyInPath(pathname, next));
        }}
        className={selectClass}
        aria-label={t("selectLabel")}
      >
        {options.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </label>
  );
}
