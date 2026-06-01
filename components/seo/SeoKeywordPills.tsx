interface SeoKeywordPillsProps {
  /** Pipe-separated tags, e.g. "#SlotsPakistan|#CricketBetting" */
  items: string;
  className?: string;
  /** light = hero; footer = dense footer band; default = on white cards */
  variant?: "default" | "light" | "footer";
}

export function SeoKeywordPills({
  items,
  className = "",
  variant = "default",
}: SeoKeywordPillsProps) {
  const tags = items
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);

  if (tags.length === 0) return null;

  const pillClass =
    variant === "light"
      ? "rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white/90 ring-1 ring-white/20"
      : variant === "footer"
        ? "rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] font-medium text-text-secondary ring-1 ring-border"
        : "rounded-full bg-brand-light px-2.5 py-1 text-[11px] font-medium text-brand-dark ring-1 ring-brand/15";

  return (
    <ul
      className={`flex flex-wrap gap-2 ${className}`}
      aria-label="Popular search topics"
    >
      {tags.map((tag) => (
        <li key={tag} className={pillClass}>
          {tag.startsWith("#") ? tag : `#${tag}`}
        </li>
      ))}
    </ul>
  );
}
