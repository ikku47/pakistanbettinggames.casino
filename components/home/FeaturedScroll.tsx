"use client";

import { useTranslations } from "next-intl";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { GameCard } from "@/components/games/GameCard";
import type { GameRecord } from "@/lib/types";

interface FeaturedScrollProps {
  games: GameRecord[];
}

export function FeaturedScroll({ games }: FeaturedScrollProps) {
  const t = useTranslations("Home");

  if (games.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="section-title mb-0">{t("featuredTitle")}</h2>
        <Link
          href="/category/popular"
          className="text-sm font-medium text-brand hover:underline"
        >
          {t("featuredMore")}
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {games.slice(0, 12).map((game, i) => (
          <GameCard key={game.id} game={game} variant="compact" priority={i < 4} />
        ))}
      </div>
    </section>
  );
}
