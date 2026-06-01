import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageContainer } from "@/components/layout/PageContainer";
import { LicensesSection } from "@/components/trust/LicensesSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";
import { resolvePageParams } from "@/lib/page-params";

type Props = { params: Promise<{ locale: string; currency: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, currency } = await resolvePageParams(params);
  const t = await getTranslations({ locale, namespace: "About" });
  const tMeta = await getTranslations({ locale, namespace: "Meta" });
  return buildMetadata({
    locale,
    currency,
    title: t("metaTitle"),
    description: t("metaDesc"),
    path: "/about",
    siteName: tMeta("siteName"),
    titleSuffix: tMeta("titleSuffix"),
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale, currency } = await resolvePageParams(params);
  setRequestLocale(locale);

  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "About" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);

  return (
    <PageContainer>
      <JsonLd
        data={webPageJsonLd(
          locale,
          t("title"),
          t("metaDesc"),
          "/about",
          currency,
        )}
      />
      <Breadcrumb
        items={[
          { label: tCommon("home"), href: "/" },
          { label: tCommon("about") },
        ]}
      />

      <article className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
        <div className="prose-content mt-6 space-y-4 text-sm leading-relaxed text-text-secondary">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p className="rounded-lg border-s-4 border-brand bg-brand-light/50 ps-4 font-medium text-text">
            {t("p3")}
          </p>
        </div>
      </article>

      <LicensesSection className="mt-8" />
    </PageContainer>
  );
}
