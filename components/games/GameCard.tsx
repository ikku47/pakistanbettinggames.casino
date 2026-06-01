"use client";

import { useTranslations } from "next-intl";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { useLocaleConfig } from "@/components/providers/LocaleConfigProvider";
import { assetUrl, playUrl } from "@/lib/config";
import { RatingLabel } from "@/components/ui/StarRating";
import { displayRating, modTags } from "@/lib/game-display";
import type { GameRecord } from "@/lib/types";
import { formatGameTitle, gameSlug } from "@/lib/utils";
import { GameImage } from "./GameImage";

interface GameCardProps {
  game: GameRecord;
  priority?: boolean;
  variant?: "grid" | "compact";
  categoryLabel?: string;
}

export function GameCard({
  game,
  priority = false,
  variant = "grid",
  categoryLabel,
}: GameCardProps) {
  const t = useTranslations("Games");
  const { config } = useLocaleConfig();
  const title = formatGameTitle(game.gameName);
  const slug = gameSlug(game);
  const href = `/games/${slug}`;
  const imageSrc = assetUrl(game.iconUrl, config);
  const rating = displayRating(game);
  const tags = modTags(game);
  const playHref = playUrl(config);
  const cat = categoryLabel ?? game.gameClassCode;

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className="link-card flex w-[88px] shrink-0 flex-col items-center gap-2 sm:w-[100px]"
      >
        <div className="link-card-media aspect-square w-full rounded-2xl shadow-sm ring-1 ring-border">
          <GameImage
            src={imageSrc}
            alt={title}
            priority={priority}
            className="link-card-image h-full w-full object-cover"
          />
        </div>
        <span className="line-clamp-2 w-full text-center text-xs font-medium leading-tight text-text">
          {title}
        </span>
      </Link>
    );
  }

  return (
    <article className="card-surface link-card group overflow-hidden">
      <Link href={href} className="block p-3">
        <div className="link-card-media relative aspect-square w-full rounded-xl ring-1 ring-border-light">
          <GameImage
            src={imageSrc}
            alt={title}
            priority={priority}
            className="link-card-image h-full w-full object-cover"
          />
          {game.platIcon && (
            <span className="absolute bottom-1.5 end-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-surface-elevated p-0.5 shadow ring-1 ring-border">
              <GameImage
                src={assetUrl(game.platIcon, config)}
                alt=""
                className="h-full w-full object-contain"
              />
            </span>
          )}
        </div>
        <h3 className="mt-3 line-clamp-2 text-center text-sm font-bold tracking-tight text-text group-hover:text-brand">
          {title}
        </h3>
        <p className="mt-1.5 flex items-center justify-center gap-1.5 text-center text-xs text-text-secondary">
          <RatingLabel value={rating} />
          <span className="text-text-muted" aria-hidden>
            ·
          </span>
          <span>{cat}</span>
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded bg-brand-light px-1.5 py-0.5 text-[10px] font-medium text-brand-dark"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
      <div className="px-3 pb-3">
        <a
          href={playHref}
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-xl bg-brand py-2.5 text-xs font-bold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-dark active:scale-[0.98]"
        >
          {t("play")}
        </a>
      </div>
    </article>
  );
}
