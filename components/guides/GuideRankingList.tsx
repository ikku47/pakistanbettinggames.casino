import { Trophy } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { pathWithCurrency, type CurrencyCode } from "@/lib/currency";
import { playUrl } from "@/lib/config";
import type { AppLocale } from "@/i18n/routing";
import { GameImage } from "@/components/games/GameImage";
import { assetUrl } from "@/lib/config";
import { RatingLabel } from "@/components/ui/StarRating";
import { displayRating } from "@/lib/game-display";
import type { SystemConfig } from "@/lib/types";
import type { GameRecord } from "@/lib/types";
import { cn, formatGameTitle, gameSlug } from "@/lib/utils";

interface GuideRankingListProps {
  games: GameRecord[];
  config: SystemConfig;
  locale: AppLocale;
  currency: CurrencyCode;
  rankLabel: string;
  playLabel: string;
  detailsLabel: string;
  emptyLabel?: string;
  className?: string;
}

function rankBadgeClass(rank: number): string {
  if (rank === 1) {
    return "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/30";
  }
  if (rank === 2) {
    return "bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-sm";
  }
  if (rank === 3) {
    return "bg-gradient-to-br from-amber-600 to-orange-700 text-white shadow-sm";
  }
  return "bg-brand text-white shadow-sm shadow-brand/20";
}

export function GuideRankingList({
  games,
  config,
  locale,
  currency,
  rankLabel,
  playLabel,
  detailsLabel,
  emptyLabel,
  className,
}: GuideRankingListProps) {
  if (games.length === 0) {
    if (!emptyLabel) return null;
    return (
      <p className="card-surface mt-6 p-8 text-center text-sm text-text-secondary">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ol className={cn("space-y-3", className)}>
      {games.map((game, index) => {
        const title = formatGameTitle(game.gameName);
        const slug = gameSlug(game);
        const imageSrc = assetUrl(game.iconUrl, config);
        const rank = index + 1;
        const gameHref = pathWithCurrency(currency, `/games/${slug}`);
        const playHref = playUrl(config, {
          gameCode: game.gameCode,
          category: game.gameClassCode,
          locale,
          currency,
        });
        const isTopThree = rank <= 3;

        return (
          <li
            key={game.id}
            className={cn(
              "card-surface group flex flex-col gap-4 p-4 transition hover:-translate-y-0.5 sm:flex-row sm:items-center",
              isTopThree && rank === 1 && "ring-2 ring-amber-400/40",
            )}
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-extrabold tabular-nums",
                  rankBadgeClass(rank),
                )}
                aria-label={`${rankLabel} ${rank}`}
              >
                {rank === 1 ? (
                  <Trophy size={20} strokeWidth={2.5} aria-hidden />
                ) : (
                  rank
                )}
              </span>

              <Link
                href={gameHref}
                className="h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-border-light transition group-hover:ring-brand/30"
              >
                <GameImage
                  src={imageSrc}
                  alt={title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  href={gameHref}
                  className="text-base font-bold leading-snug tracking-tight text-text transition group-hover:text-brand"
                >
                  {title}
                </Link>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
                  <span className="font-medium">
                    {rankLabel} #{rank}
                  </span>
                  <RatingLabel value={displayRating(game)} size={11} />
                </p>
              </div>
            </div>

            <div className="flex shrink-0 gap-2 sm:flex-col sm:gap-2 lg:flex-row">
              <Link
                href={gameHref}
                className="flex flex-1 items-center justify-center rounded-xl border border-border bg-surface-hover px-4 py-2.5 text-center text-xs font-semibold text-text transition hover:border-brand hover:text-brand sm:flex-none"
              >
                {detailsLabel}
              </Link>
              <a
                href={playHref}
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-center text-xs font-bold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-dark active:scale-[0.98] sm:flex-none"
              >
                {playLabel}
              </a>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
