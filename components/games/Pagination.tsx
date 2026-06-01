"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";
import { cn } from "@/lib/utils";

interface PaginationProps {
  basePath: string;
  current: number;
  pages: number;
}

export function Pagination({ basePath, current, pages }: PaginationProps) {
  const t = useTranslations("Common");

  if (pages <= 1) return null;

  const buildHref = (page: number) => {
    if (page > 1) return `${basePath}?page=${page}`;
    return basePath;
  };

  const windowStart = Math.max(1, current - 2);
  const windowEnd = Math.min(pages, current + 2);
  const pageNums: number[] = [];
  for (let p = windowStart; p <= windowEnd; p++) pageNums.push(p);

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
      aria-label="Pagination"
    >
      {current > 1 && (
        <Link
          href={buildHref(current - 1)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary hover:border-brand hover:text-brand"
        >
          <ChevronLeft size={16} aria-hidden />
          {t("prev")}
        </Link>
      )}
      {pageNums.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          aria-current={p === current ? "page" : undefined}
          className={cn(
            "min-w-[2.5rem] rounded-lg py-2 text-center text-sm font-medium",
            p === current
              ? "bg-brand text-white"
              : "border border-border bg-surface text-text-secondary hover:border-brand",
          )}
        >
          {p}
        </Link>
      ))}
      {current < pages && (
        <Link
          href={buildHref(current + 1)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary hover:border-brand hover:text-brand"
        >
          {t("next")}
          <ChevronRight size={16} aria-hidden />
        </Link>
      )}
    </nav>
  );
}
