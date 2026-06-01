import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Manrope } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LocaleConfigProvider } from "@/components/providers/LocaleConfigProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { htmlLang } from "@/i18n/api-locale";
import { routing } from "@/i18n/routing";
import { PartnerLogos } from "@/components/platforms/PartnerLogos";
import { getCatalogBootstrap } from "@/lib/catalog-data";
import {
  CURRENCY_CODES,
  currencySlug,
} from "@/lib/currency";
import { parseLocaleParam, parseCurrencyParam } from "@/lib/page-params";
import { getSystemConfig } from "@/lib/system-config";
import { siteConfig } from "@/lib/config";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import type { Metadata, Viewport } from "next";
import "../../globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

/** 30 days — must be a literal for Next segment config */
export const revalidate = 2592000;

export const viewport: Viewport = {
  themeColor: "#1ebe57",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CURRENCY_CODES.map((code) => ({
      locale,
      currency: currencySlug(code),
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "Meta" });

  return {
    metadataBase: new URL(siteConfig.domain),
    applicationName: tMeta("siteName"),
    keywords: tMeta("keywords"),
    authors: [{ name: tMeta("siteName"), url: siteConfig.domain }],
    creator: tMeta("siteName"),
    publisher: tMeta("siteName"),
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export default async function CurrencyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; currency: string }>;
}) {
  const { locale, currency: currencyParam } = await params;
  const appLocale = parseLocaleParam(locale);
  const currency = parseCurrencyParam(currencyParam);

  setRequestLocale(appLocale);

  const [messages, catalog, tMeta, tPartners] = await Promise.all([
    getMessages(),
    getCatalogBootstrap(appLocale),
    getTranslations("Meta"),
    getTranslations("Partners"),
  ]);

  const {
    config,
    partnerIcons,
    platformCatalog,
    platformIndex,
  } = catalog;

  const dir = appLocale === "ur-PK" ? "rtl" : "ltr";

  return (
    <html lang={htmlLang[appLocale]} dir={dir} suppressHydrationWarning>
      <body
        className={`${manrope.variable} flex min-h-full flex-col bg-bg font-sans text-text antialiased`}
      >
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <LocaleConfigProvider
              config={config}
              locale={appLocale}
              initialCurrency={currency}
            >
              <JsonLd
                data={[
                  organizationJsonLd(
                    appLocale,
                    tMeta("siteName"),
                    tMeta("description"),
                    currency,
                  ),
                  websiteJsonLd(
                    appLocale,
                    tMeta("siteName"),
                    tMeta("description"),
                    currency,
                  ),
                ]}
              />
              <SiteHeader />
              <main className="flex-1 py-8 sm:py-10">{children}</main>
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <PartnerLogos
                  icons={partnerIcons}
                  config={config}
                  title={tPartners("title")}
                  subtitle={tPartners("footerSubtitle")}
                  variant="compact"
                  platformIndex={platformIndex}
                  platformCatalog={platformCatalog}
                />
              </div>
              <SiteFooter />
            </LocaleConfigProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
