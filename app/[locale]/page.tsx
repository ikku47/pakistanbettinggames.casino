import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  CURRENCY_COOKIE,
  currencySlug,
  getInitialCurrency,
} from "@/lib/currency";
import { parseLocaleParam } from "@/lib/page-params";
import { getSystemConfig } from "@/lib/system-config";

type Props = { params: Promise<{ locale: string }> };

export default async function LocaleRedirectPage({ params }: Props) {
  const { locale } = await params;
  const appLocale = parseLocaleParam(locale);
  const config = await getSystemConfig(appLocale);
  const store = await cookies();
  const preferred = getInitialCurrency(
    store.get(CURRENCY_COOKIE)?.value,
    config,
  );
  redirect(`/${appLocale}/${currencySlug(preferred)}`);
}
