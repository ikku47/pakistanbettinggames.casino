"use client";

import { CurrencyLink as Link } from "@/components/navigation/CurrencyLink";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  id?: string;
}

export function SectionHeading({
  title,
  subtitle,
  href,
  linkLabel,
  id,
}: SectionHeadingProps) {
  return (
    <div id={id} className="mb-4 flex items-end justify-between gap-4 px-1">
      <div>
        <h2 className="section-title mb-0">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
        )}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="shrink-0 rounded-lg bg-brand-light px-3 py-1.5 text-sm font-semibold text-brand transition hover:bg-brand/15"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
