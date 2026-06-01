import {
  ChevronRight,
  CircleDot,
  Gamepad2,
  ShieldCheck,
  Smartphone,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { GameImage } from "@/components/games/GameImage";
import { GameCard } from "@/components/games/GameCard";
import { PlatformBadge } from "@/components/platforms/PlatformBadge";
import { PartnerLogos } from "@/components/platforms/PartnerLogos";
import { PlayCta } from "@/components/ui/PlayCta";
import { StarRating } from "@/components/ui/StarRating";
import { assetUrl } from "@/lib/config";
import { displayRating, displayRatingValue, modTags } from "@/lib/game-display";
import type { ResolvedPlatform } from "@/lib/platforms";
import type { GameRecord, SystemConfig } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GameDetailViewProps {
  game: GameRecord;
  config: SystemConfig;
  title: string;
  categoryName: string;
  categorySlug?: string;
  imageSrc: string;
  tags: string[];
  related: GameRecord[];
  platform: ResolvedPlatform;
  partnerIcons: string[];
  labels: {
    playNow: string;
    downloadApp: string;
    intro: string;
    code: string;
    category: string;
    platform: string;
    type: string;
    realMoney: string;
    casino: string;
    howToPlay: string;
    steps: string[];
    highlightsTitle: string;
    highlight1: string;
    highlight2: string;
    highlight3: string;
    relatedTitle: string;
    onlineNow: string;
    editorsPick: string;
    viewCategory: string;
    gameInfo: string;
    partnersTitle: string;
    partnersSubtitle: string;
  };
}

const HIGHLIGHT_ICONS: LucideIcon[] = [Zap, ShieldCheck, Smartphone];

function DetailSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card-surface p-5 sm:p-6", className)}>
      <h2 className="text-lg font-bold tracking-tight text-text">{title}</h2>
      {children}
    </section>
  );
}

export function GameDetailView({
  game,
  config,
  title,
  categoryName,
  categorySlug,
  imageSrc,
  tags,
  related,
  platform,
  partnerIcons,
  labels,
}: GameDetailViewProps) {
  const rating = displayRatingValue(game);
  const ratingLabel = displayRating(game);

  return (
    <div className="space-y-8 pb-4">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-[#1aaa50] to-brand-dark text-white shadow-lg">
        <div
          className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -start-12 h-56 w-56 rounded-full bg-black/15 blur-2xl"
          aria-hidden
        />

        <div className="relative grid gap-8 p-6 lg:grid-cols-[auto_1fr] lg:items-center lg:p-8">
          <div className="relative mx-auto w-fit lg:mx-0">
            <div className="overflow-hidden rounded-2xl bg-white p-1.5 shadow-2xl ring-4 ring-white/25 sm:rounded-3xl">
              <GameImage
                src={imageSrc}
                alt={title}
                priority
                className="h-36 w-36 rounded-xl object-cover sm:h-44 sm:w-44"
              />
            </div>
            {game.isAegis === 1 && (
              <span className="absolute -end-2 -top-2 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
                {labels.editorsPick}
              </span>
            )}
            {platform.iconPath && (
              <div className="absolute -bottom-3 -end-3 flex max-w-[120px] items-center gap-2 rounded-full bg-white py-1.5 ps-1.5 pe-3 shadow-lg ring-2 ring-white/40">
                <GameImage
                  src={assetUrl(platform.iconPath, config)}
                  alt={platform.name}
                  className="h-7 w-7 shrink-0 object-contain"
                />
                <span className="truncate text-[11px] font-bold text-brand-dark">
                  {platform.name}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 text-center lg:text-start">
            {categorySlug ? (
              <Link
                href={`/category/${categorySlug}`}
                className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm transition hover:bg-white/25"
              >
                {categoryName}
                <ChevronRight size={14} aria-hidden />
              </Link>
            ) : (
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                {categoryName}
              </span>
            )}

            <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-sm">
                <StarRating value={rating} variant="onDark" size={14} />
                <span className="text-sm font-bold">{ratingLabel}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                <Wallet size={14} aria-hidden />
                {config.currency_code}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                <CircleDot
                  size={14}
                  className="text-emerald-300"
                  strokeWidth={2.5}
                  aria-hidden
                />
                {labels.onlineNow}
              </span>
            </div>

            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand-dark"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 hidden flex-wrap gap-3 lg:flex">
              <PlayCta
                size="lg"
                className="!rounded-xl !border-0 !bg-white !px-8 !text-brand shadow-md hover:!bg-white/95"
                gameCode={game.gameCode}
                category={game.gameClassCode}
              >
                {labels.playNow}
              </PlayCta>
              <PlayCta
                size="lg"
                mode="download"
                variant="ghost"
                className="!rounded-xl !bg-white/10 !text-white ring-1 ring-white/40 hover:!bg-white/20"
              >
                {labels.downloadApp}
              </PlayCta>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col gap-2 border-t border-white/20 bg-black/10 p-4 sm:flex-row lg:hidden">
          <PlayCta
            block
            size="lg"
            className="flex-1 !rounded-xl !border-0 !bg-white !text-brand hover:!bg-white/95"
            gameCode={game.gameCode}
            category={game.gameClassCode}
          >
            {labels.playNow}
          </PlayCta>
          <PlayCta
            block
            size="lg"
            mode="download"
            variant="ghost"
            className="flex-1 !rounded-xl !bg-white/10 !text-white ring-1 ring-white/40 hover:!bg-white/20"
          >
            {labels.downloadApp}
          </PlayCta>
        </div>
      </section>

      {/* Quick highlights */}
      <ul className="grid gap-3 sm:grid-cols-3">
        {[labels.highlight1, labels.highlight2, labels.highlight3].map(
          (text, i) => {
            const Icon = HIGHLIGHT_ICONS[i] ?? Zap;
            return (
              <li
                key={text}
                className="card-surface flex items-start gap-3 p-4 hover:-translate-y-0.5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                  <Icon size={20} strokeWidth={2.25} aria-hidden />
                </span>
                <p className="text-sm font-medium leading-snug text-text">{text}</p>
              </li>
            );
          },
        )}
      </ul>

      <div className="grid gap-6 xl:grid-cols-[1fr_300px] xl:gap-8">
        <div className="space-y-6">
          <DetailSection title={labels.highlightsTitle}>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {labels.intro}
            </p>
          </DetailSection>

          <DetailSection title={labels.howToPlay}>
            <ol className="relative mt-6 space-y-0">
              {labels.steps.map((step, i) => (
                <li key={step} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < labels.steps.length - 1 && (
                    <span
                      className="absolute start-[17px] top-9 h-[calc(100%-1.25rem)] w-0.5 bg-gradient-to-b from-brand/50 to-brand/10"
                      aria-hidden
                    />
                  )}
                  <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-md shadow-brand/25">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 text-sm leading-relaxed text-text-secondary">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </DetailSection>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="card-surface overflow-hidden p-0">
            <div className="border-b border-border bg-brand-light/50 px-5 py-4 dark:bg-brand-light/30">
              <div className="flex items-center gap-2 text-brand">
                <Gamepad2 size={18} strokeWidth={2.25} aria-hidden />
                <h2 className="text-sm font-bold uppercase tracking-wide">
                  {labels.gameInfo}
                </h2>
              </div>
            </div>
            <dl className="divide-y divide-border px-5">
              {(
                [
                  [labels.code, game.gameCode],
                  [labels.category, categoryName],
                  [
                    labels.type,
                    game.gameType === 1 ? labels.realMoney : labels.casino,
                  ],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="py-3.5">
                  <dt className="text-xs font-medium text-text-muted">{label}</dt>
                  <dd className="mt-1 break-all text-sm font-semibold text-text">
                    {value}
                  </dd>
                </div>
              ))}
              <div className="py-3.5">
                <dt className="text-xs font-medium text-text-muted">
                  {labels.platform}
                </dt>
                <dd className="mt-2">
                  <PlatformBadge platform={platform} config={config} size="sm" />
                </dd>
              </div>
            </dl>
          </div>

          {categorySlug && (
            <Link
              href={`/category/${categorySlug}`}
              className="card-surface flex items-center justify-between gap-3 p-4 font-semibold text-brand transition hover:-translate-y-0.5 hover:border-brand/40"
            >
              <span className="text-sm">{labels.viewCategory}</span>
              <ChevronRight size={18} className="shrink-0" aria-hidden />
            </Link>
          )}

          <div className="hidden xl:block">
            <PlayCta
              block
              size="lg"
              className="!rounded-xl"
              gameCode={game.gameCode}
              category={game.gameClassCode}
            >
              {labels.playNow}
            </PlayCta>
          </div>
        </aside>
      </div>

      {partnerIcons.length > 0 && (
        <PartnerLogos
          icons={partnerIcons}
          config={config}
          title={labels.partnersTitle}
          subtitle={labels.partnersSubtitle}
          variant="compact"
        />
      )}

      {related.length > 0 && (
        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="section-title mb-0">{labels.relatedTitle}</h2>
              <p className="mt-1 text-sm text-text-secondary">{categoryName}</p>
            </div>
            {categorySlug && (
              <Link
                href={`/category/${categorySlug}`}
                className="inline-flex items-center gap-1 rounded-lg bg-brand-light px-3 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand/10"
              >
                {labels.viewCategory}
                <ChevronRight size={16} aria-hidden />
              </Link>
            )}
          </div>
          <ul className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
            {related.map((g, i) => (
              <li key={g.id}>
                <GameCard
                  game={g}
                  priority={i < 4}
                  categoryLabel={categoryName}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-3 shadow-[0_-8px_30px_rgb(0_0_0/0.12)] backdrop-blur-lg xl:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-1">
          <PlayCta
            block
            size="lg"
            className="!rounded-xl"
            gameCode={game.gameCode}
            category={game.gameClassCode}
          >
            {labels.playNow}
          </PlayCta>
          <PlayCta
            block
            size="lg"
            mode="download"
            variant="outline"
            className="!rounded-xl"
          >
            {labels.downloadApp}
          </PlayCta>
        </div>
      </div>
      <div className="h-20 xl:hidden" aria-hidden />
    </div>
  );
}
