"use client";

import { Loader2, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocaleConfig } from "@/components/providers/LocaleConfigProvider";
import { GameImage } from "@/components/games/GameImage";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { assetUrl } from "@/lib/config";
import { pathWithCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

type SearchHit = {
  id: number;
  slug: string;
  title: string;
  iconUrl: string;
};

interface GameSearchProps {
  className?: string;
  /** header = green bar; nav = light strip on mobile */
  variant?: "header" | "nav";
}

export function GameSearch({ className, variant = "header" }: GameSearchProps) {
  const t = useTranslations("Search");
  const { config, locale, currency } = useLocaleConfig();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounced = useDebouncedValue(query, 350);
  const rootRef = useRef<HTMLDivElement>(null);

  const isHeader = variant === "header";

  const runSearch = useCallback(
    async (term: string) => {
      if (term.length < 2) {
        setHits([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/games/search?q=${encodeURIComponent(term)}&locale=${encodeURIComponent(locale)}`,
        );
        if (!res.ok) {
          setHits([]);
          return;
        }
        const data = (await res.json()) as { games: SearchHit[] };
        setHits(data.games ?? []);
      } catch {
        setHits([]);
      } finally {
        setLoading(false);
      }
    },
    [locale],
  );

  useEffect(() => {
    if (debounced.length >= 2) {
      void runSearch(debounced);
      setOpen(true);
    } else {
      setHits([]);
      setOpen(false);
    }
  }, [debounced, runSearch]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const goToResults = () => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    setOpen(false);
    router.push(
      pathWithCurrency(currency, `/games?q=${encodeURIComponent(trimmed)}`),
    );
  };

  const inputClass = isHeader
    ? "w-full rounded-full border-0 bg-white/95 py-2 ps-10 pe-10 text-sm text-text shadow-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-white/50 dark:bg-surface-elevated dark:focus:ring-brand/40"
    : "w-full rounded-lg border border-border bg-surface py-2 ps-10 pe-10 text-sm text-text placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

  const iconClass = isHeader ? "text-text-muted" : "text-text-muted";

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <Search
        size={16}
        className={cn(
          "pointer-events-none absolute start-3 top-1/2 -translate-y-1/2",
          iconClass,
        )}
        aria-hidden
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => hits.length > 0 && setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            goToResults();
          }
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder={t("placeholder")}
        className={inputClass}
        aria-label={t("placeholder")}
        aria-expanded={open}
        aria-controls="game-search-results"
        autoComplete="off"
      />
      {loading && (
        <Loader2
          size={16}
          className="absolute end-3 top-1/2 -translate-y-1/2 animate-spin text-text-muted"
          aria-hidden
        />
      )}

      {open && (hits.length > 0 || (debounced.length >= 2 && !loading)) && (
        <div
          id="game-search-results"
          role="listbox"
          className={cn(
            "absolute start-0 end-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-border bg-surface py-1 shadow-lg",
            isHeader ? "top-full" : "top-full",
          )}
        >
          {hits.length === 0 && !loading && debounced.length >= 2 && (
            <p className="px-4 py-3 text-sm text-text-secondary">{t("noResults")}</p>
          )}
          {hits.map((hit) => (
            <Link
              key={hit.id}
              href={`/games/${hit.slug}`}
              role="option"
              className="flex items-center gap-3 px-3 py-2 hover:bg-brand-light"
              onClick={() => setOpen(false)}
            >
              <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-border">
                <GameImage
                  src={assetUrl(hit.iconUrl, config)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="truncate text-sm font-medium text-text">
                {hit.title}
              </span>
            </Link>
          ))}
          {hits.length > 0 && (
            <button
              type="button"
              className="w-full border-t border-border px-4 py-2.5 text-start text-sm font-medium text-brand hover:bg-brand-light"
              onClick={goToResults}
            >
              {t("viewAll", { query: debounced })}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
