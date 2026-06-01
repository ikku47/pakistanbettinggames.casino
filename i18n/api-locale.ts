import type { AppLocale } from "./routing";

/** Maps site URL locale → API `content-language` header value. */
export const apiContentLanguage: Record<AppLocale, string> = {
  "en-PK": "en_US",
  "hi-IN": "hi_IN",
  "ur-PK": "ur_PK",
  "zh-CN": "zh_CN",
};

/** BCP 47 tag for HTML `lang` and Open Graph. */
export const htmlLang: Record<AppLocale, string> = {
  "en-PK": "en-PK",
  "hi-IN": "hi-IN",
  "ur-PK": "ur-PK",
  "zh-CN": "zh-CN",
};

export function toApiContentLanguage(locale: AppLocale): string {
  return apiContentLanguage[locale];
}

export function apiLanguageToLocale(apiLang: string): AppLocale | null {
  const entry = Object.entries(apiContentLanguage).find(([, v]) => v === apiLang);
  return entry ? (entry[0] as AppLocale) : null;
}
