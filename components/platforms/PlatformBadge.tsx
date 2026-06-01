import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { GameImage } from "@/components/games/GameImage";
import { assetUrl } from "@/lib/config";
import type { ResolvedPlatform } from "@/lib/platforms";
import type { SystemConfig } from "@/lib/types";

interface PlatformBadgeProps {
  platform: ResolvedPlatform;
  config: SystemConfig;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function PlatformBadge({
  platform,
  config,
  label,
  size = "md",
  className = "",
}: PlatformBadgeProps) {
  const iconSrc = platform.iconPath
    ? assetUrl(platform.iconPath, config)
    : null;
  const dim = size === "sm" ? "h-5 w-5" : "h-8 w-8";
  const text = size === "sm" ? "text-xs" : "text-sm";

  const content = (
    <>
      {iconSrc && (
        <span
          className={`${dim} shrink-0 overflow-hidden rounded-md bg-surface-elevated p-0.5 ring-1 ring-border`}
        >
          <GameImage
            src={iconSrc}
            alt={platform.name}
            className="h-full w-full object-contain"
          />
        </span>
      )}
      <div className="min-w-0">
        {label && (
          <p className="text-[10px] uppercase tracking-wide text-text-muted">
            {label}
          </p>
        )}
        <p className={`truncate font-semibold text-text ${text}`}>
          {platform.name}
        </p>
      </div>
    </>
  );

  if (platform.slug) {
    return (
      <Link
        href={`/platform/${platform.slug}`}
        className={`flex items-center gap-2 rounded-lg transition hover:text-brand ${className}`}
      >
        {content}
      </Link>
    );
  }

  return <div className={`flex items-center gap-2 ${className}`}>{content}</div>;
}
