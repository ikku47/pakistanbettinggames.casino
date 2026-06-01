import { notFound } from "next/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { parseCurrencySlug, type CurrencyCode } from "./currency";

export function parseLocaleParam(locale: string): AppLocale {
  if (!routing.locales.includes(locale as AppLocale)) notFound();
  return locale as AppLocale;
}

export function parseCurrencyParam(code: string): CurrencyCode {
  const parsed = parseCurrencySlug(code);
  if (!parsed) notFound();
  return parsed;
}

export async function resolvePageParams(
  params: Promise<{ locale: string; currency: string }>,
): Promise<{ locale: AppLocale; currency: CurrencyCode }> {
  const { locale, currency } = await params;
  return {
    locale: parseLocaleParam(locale),
    currency: parseCurrencyParam(currency),
  };
}

export async function resolvePageParamsWith<
  T extends Record<string, string>,
>(
  params: Promise<{ locale: string; currency: string } & T>,
): Promise<{ locale: AppLocale; currency: CurrencyCode } & T> {
  const resolved = await params;
  return {
    ...resolved,
    locale: parseLocaleParam(resolved.locale),
    currency: parseCurrencyParam(resolved.currency),
  };
}
