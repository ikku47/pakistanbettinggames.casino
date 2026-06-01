import { defineRouting } from "next-intl/routing";

/** URL locales (BCP 47). */
export const locales = ["en-PK", "hi-IN", "ur-PK", "zh-CN"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en-PK";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
});
