import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageContainer } from "@/components/layout/PageContainer";
import { PlayCta } from "@/components/ui/PlayCta";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  getFaqItems,
  webPageJsonLd,
} from "@/lib/seo";
import { resolvePageParams } from "@/lib/page-params";

type Props = { params: Promise<{ locale: string; currency: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, currency } = await resolvePageParams(params);
  const t = await getTranslations({ locale, namespace: "Faq" });
  const tMeta = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    currency,
    title: t("metaTitle"),
    description: t("metaDesc"),
    path: "/faq",
    siteName: tMeta("siteName"),
    titleSuffix: tMeta("titleSuffix"),
  });
}

export default async function FaqPage({ params }: Props) {
  const { locale, currency } = await resolvePageParams(params);
  setRequestLocale(locale);

  const [t, tCommon, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "Faq" }),
    getTranslations({ locale, namespace: "Common" }),
    getTranslations({ locale, namespace: "Nav" }),
  ]);

  const faqItems = getFaqItems((key) => t(key));
  const pageTitle = t("title");
  const pageDesc = t("metaDesc");

  return (
    <PageContainer>
      <JsonLd
        data={[
          breadcrumbJsonLd(
            locale,
            [
              { name: tCommon("home"), path: "/" },
              { name: tCommon("faq"), path: "/faq" },
            ],
            currency,
          ),
          webPageJsonLd(locale, pageTitle, pageDesc, "/faq", currency),
          faqJsonLd(faqItems),
        ]}
      />
      <Breadcrumb
        items={[
          { label: tCommon("home"), href: "/" },
          { label: tCommon("faq") },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("subtitle")}</p>
      </header>

      <dl className="space-y-3">
        {faqItems.map((item) => (
          <div
            key={item.question}
            className="rounded-xl border border-border bg-surface p-5 shadow-sm"
          >
            <dt className="font-semibold text-text">{item.question}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-text-secondary">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 text-center">
        <PlayCta size="lg">{tNav("enterCasino")}</PlayCta>
      </div>
    </PageContainer>
  );
}
