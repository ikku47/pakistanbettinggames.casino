import { GameImage } from "@/components/games/GameImage";
import { assetUrl } from "@/lib/config";
import { dedupePartnerIcons, partnerLabelFromPath } from "@/lib/platforms";
import type { SystemConfig } from "@/lib/types";

interface PartnerLogosProps {
  icons: string[];
  config: SystemConfig;
  title: string;
  subtitle?: string;
  /** compact = footer row; section = homepage band */
  variant?: "section" | "compact";
  className?: string;
}

export function PartnerLogos({
  icons,
  config,
  title,
  subtitle,
  variant = "section",
  className = "",
}: PartnerLogosProps) {
  const partners = dedupePartnerIcons(icons);
  if (partners.length === 0) return null;

  const isCompact = variant === "compact";

  return (
    <section
      className={
        isCompact
          ? `border-t border-border bg-bg/50 ${className}`
          : `rounded-xl border border-border bg-surface shadow-sm ${className}`
      }
      aria-labelledby="partners-heading"
    >
      <div className={isCompact ? "py-6" : "p-5 sm:p-6"}>
        <div className={isCompact ? "text-center" : ""}>
          <h2
            id="partners-heading"
            className={
              isCompact
                ? "text-xs font-bold uppercase tracking-wider text-text-muted"
                : "text-lg font-bold text-text"
            }
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={
                isCompact
                  ? "mt-1 text-xs text-text-muted"
                  : "mt-1 text-sm text-text-secondary"
              }
            >
              {subtitle}
            </p>
          )}
        </div>

        <ul
          className={
            isCompact
              ? "mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
              : "mt-5 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          }
        >
          {partners.map((path) => {
            const label = partnerLabelFromPath(path);
            return (
              <li
                key={path}
                className={
                  isCompact
                    ? "flex h-10 w-20 shrink-0 items-center justify-center opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
                    : "flex h-14 w-24 shrink-0 items-center justify-center rounded-lg border border-border-light bg-surface-elevated px-2 py-2 shadow-sm"
                }
                title={label}
              >
                <GameImage
                  src={assetUrl(path, config)}
                  alt={label}
                  className="max-h-full max-w-full object-contain"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
