"use client";

import { useTranslations } from "next-intl";
import type { GameRecord } from "@/lib/types";
import { GameCard } from "./GameCard";

interface GameGridProps {
  games: GameRecord[];
  emptyMessage?: string;
}

export function GameGrid({ games, emptyMessage }: GameGridProps) {
  const t = useTranslations("Games");
  const empty = emptyMessage ?? t("empty");

  if (games.length === 0) {
    return (
      <p className="card-surface p-12 text-center text-sm text-text-secondary">
        {empty}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
      {games.map((game, i) => (
        <li key={game.id}>
          <GameCard game={game} priority={i < 12} />
        </li>
      ))}
    </ul>
  );
}
