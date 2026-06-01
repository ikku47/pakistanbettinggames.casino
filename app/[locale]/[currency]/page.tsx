import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { GameGrid } from "@/components/games/GameGrid";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { FeaturedScroll } from "@/components/home/FeaturedScroll";
import { HeroSection } from "@/components/home/HeroSection";
import { SectionHeading } from "@/components/home/SectionHeading";
import { GuidesSection } from "@/components/home/GuidesSection";
import { SeoContentBlock } from "@/components/home/SeoContentBlock";
import { PlayCta } from "@/components/ui/PlayCta";
import { PageContainer } from "@/components/layout/PageContainer";
import { JsonLd } from "@/components/seo/JsonLd";
import { PartnerLogos } from "@/components/platforms/PartnerLogos";
import { fetchAllPlatIcons, fetchPopularGames } from "@/lib/api";
import { getSystemConfig } from "@/lib/system-config";
import { buildHomeMetadata } from "@/lib/home-metadata";
import { absoluteUrl, itemListJsonLd } from "@/lib/seo";
import { formatGameTitle, gameSlug } from "@/lib/utils";
import { resolvePageParams } from "@/lib/page-params";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; currency: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, currency } = await resolvePageParams(params);
  return buildHomeMetadata(locale, currency);
}

export default async function HomePage({ params }: Props) {
  const { locale, currency } = await resolvePageParams(params);
  setRequestLocale(locale);

  const [popularGames, partnerIcons, tHome, tNav, tPartners, config] =
    await Promise.all([
      fetchPopularGames(locale, 30),
      fetchAllPlatIcons(locale),
      getTranslations({ locale, namespace: "Home" }),
      getTranslations({ locale, namespace: "Nav" }),
      getTranslations({ locale, namespace: "Partners" }),
      getSystemConfig(locale),
    ]);

  const listItems = popularGames.slice(0, 12).map((g) => ({
    name: formatGameTitle(g.gameName),
    url: absoluteUrl(locale, `/games/${gameSlug(g)}`, currency),
  }));

  return (
    <PageContainer>
      <JsonLd data={itemListJsonLd(tHome("hotListTitle"), listItems)} />

      <HeroSection />
      <FeaturedScroll games={popularGames} />

      <section id="hot-list" className="mt-10">
        <SectionHeading
          id="hot-list"
          title={tHome("hotListTitle")}
          subtitle={tHome("hotListSubtitle")}
          href="/games"
          linkLabel={tHome("hotListLink")}
        />
        <GameGrid games={popularGames} />
      </section>

      <CategoryStrip />

      <GuidesSection />

      <PartnerLogos
        className="mt-10"
        icons={partnerIcons}
        config={config}
        title={tPartners("title")}
        subtitle={tPartners("subtitle")}
      />

      <SeoContentBlock />

      <section className="card-surface mt-10 p-8 text-center sm:p-10">
        <h2 className="text-xl font-bold text-text">{tHome("ctaTitle")}</h2>
        <p className="mt-2 text-sm text-text-secondary">
          {tHome("ctaBody", { currency })}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <PlayCta size="lg">{tHome("ctaButton")}</PlayCta>
          <PlayCta size="lg" mode="download" variant="outline">
            {tNav("downloadApp")}
          </PlayCta>
        </div>
      </section>
    </PageContainer>
  );
}
