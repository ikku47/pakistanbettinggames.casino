import { ChevronRight, Trophy } from "lucide-react";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { GameImage } from "@/components/games/GameImage";
import { RatingLabel } from "@/components/ui/StarRating";
import { getCategoryByCode } from "@/lib/categories";
import { assetUrl, playUrl } from "@/lib/config";
import { displayRating, modTags } from "@/lib/game-display";
import type { AppLocale } from "@/i18n/routing";
import type { SystemConfig } from "@/lib/types";
import type { GameRecord } from "@/lib/types";
import { cn, formatGameTitle, gameSlug } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

interface GuideRankingListProps {
  games: GameRecord[];
  config: SystemConfig;
  locale: AppLocale;
  rankLabel: string;
  playLabel: string;
  detailsLabel: string;
  emptyLabel?: string;
  className?: string;
}

function rankStyles(rank: number): {
  badge: string;
  card: string;
} {
  if (rank === 1) {
    return {
      badge:
        "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/25",
      card: "ring-2 ring-amber-400/35 bg-gradient-to-r from-amber-500/5 to-surface",
    };
  }
  if (rank === 2) {
    return {
      badge: "bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-sm",
      card: "border-slate-300/40",
    };
  }
  if (rank === 3) {
    return {
      badge:
        "bg-gradient-to-br from-amber-700 to-orange-800 text-white shadow-sm",
      card: "border-orange-400/30",
    };
  }
  return {
    badge: "bg-brand text-white shadow-sm shadow-brand/15",
    card: "",
  };
}

export async function GuideRankingList({
  games,
  config,
  locale,
  rankLabel,
  playLabel,
  detailsLabel,
  emptyLabel,
  className,
}: GuideRankingListProps) {
  const tCat = await getTranslations({ locale, namespace: "Categories" });

  const categoryName = (code: string) => {
    const cat = getCategoryByCode(code);
    return cat ? tCat(`${cat.messageKey}.name`) : "";
  };

  if (games.length === 0) {
    if (!emptyLabel) return null;
    return (
      <p className="card-surface mt-6 p-8 text-center text-sm text-text-secondary">
        {emptyLabel}
      </p>
    );
  }

  const playHref = playUrl(config);

  return (
    <ol className={cn("space-y-3", className)}>
      {games.map((game, index) => {
        const title = formatGameTitle(game.gameName);
        const slug = gameSlug(game);
        const imageSrc = assetUrl(game.iconUrl, config);
        const rank = index + 1;
        const styles = rankStyles(rank);
        const cat = categoryName(game.gameClassCode);
        const tags = modTags(game);
        const gameHref = `/games/${slug}`;

        return (
          <li
            key={game.id}
            className={cn(
              "card-surface link-card overflow-hidden",
              styles.card,
            )}
          >
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:gap-5 sm:p-5">
              <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-xl text-sm font-extrabold tabular-nums sm:h-12 sm:w-12 sm:text-base",
                    styles.badge,
                  )}
                  aria-label={`${rankLabel} ${rank}`}
                >
                  {rank === 1 ? (
                    <Trophy size={22} strokeWidth={2.5} aria-hidden />
                  ) : (
                    rank
                  )}
                </span>

                <Link
                  href={gameHref}
                  className="link-card-media relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl ring-1 ring-border-light sm:h-20 sm:w-20"
                >
                  <GameImage
                    src={imageSrc}
                    alt={title}
                    className="link-card-image h-full w-full object-cover"
                  />
                  {game.platIcon && (
                    <span className="absolute bottom-1 end-1 flex h-6 w-6 items-center justify-center rounded-md bg-surface-elevated p-0.5 shadow ring-1 ring-border">
                      <GameImage
                        src={assetUrl(game.platIcon, config)}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </span>
                  )}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <Link
                    href={gameHref}
                    className="group/title inline-flex items-start gap-1 text-base font-bold leading-snug tracking-tight text-text transition hover:text-brand sm:text-lg"
                  >
                    <span className="line-clamp-2">{title}</span>
                    <ChevronRight
                      size={18}
                      strokeWidth={2.5}
                      className="link-card-chevron-visible mt-0.5 shrink-0 text-text-muted"
                      aria-hidden
                    />
                  </Link>

                  <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
                    <RatingLabel value={displayRating(game)} size={12} />
                    {cat && (
                      <>
                        <span className="text-text-muted" aria-hidden>
                          ·
                        </span>
                        <span className="font-medium text-text-secondary">
                          {cat}
                        </span>
                      </>
                    )}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-brand-light px-2 py-0.5 text-[10px] font-semibold text-brand-dark"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 border-t border-border-light pt-4 sm:w-44 sm:shrink-0 sm:flex-col sm:justify-center sm:border-t-0 sm:border-s-0 sm:pt-0 sm:ps-4 sm:border-s sm:border-border-light">
                <a
                  href={playHref}
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-dark active:scale-[0.98] sm:order-2"
                >
                  {playLabel}
                </a>
                <Link
                  href={gameHref}
                  className="flex flex-1 items-center justify-center rounded-xl border border-border bg-surface px-4 py-3 text-center text-sm font-semibold text-text transition hover:border-brand hover:text-brand sm:order-1"
                >
                  {detailsLabel}
                </Link>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
