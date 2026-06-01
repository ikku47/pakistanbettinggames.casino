import { BookOpen } from "lucide-react";

interface GuidePageHeaderProps {
  label: string;
  title: string;
  intro: string;
  updatedNote: string;
  rankingLabel?: string;
}

export function GuidePageHeader({
  label,
  title,
  intro,
  updatedNote,
  rankingLabel,
}: GuidePageHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-[#1aaa50] to-brand-dark text-white shadow-lg">
      <div
        className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div className="relative p-6 sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          <BookOpen size={14} aria-hidden />
          {label}
        </p>
        <h1 className="mt-4 max-w-3xl text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
          {intro}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {rankingLabel && (
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              {rankingLabel}
            </span>
          )}
          <span className="text-xs font-medium text-white/60">{updatedNote}</span>
        </div>
      </div>
    </header>
  );
}
