import { Lightbulb, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionKey = "pick" | "tip" | "body";

interface GuideContentSectionsProps {
  sections: SectionKey[];
  getTitle: (key: SectionKey) => string;
  getBody: (key: SectionKey) => string;
}

const ICONS = {
  body: Sparkles,
  pick: Lightbulb,
  tip: Sparkles,
} as const;

export function GuideContentSections({
  sections,
  getTitle,
  getBody,
}: GuideContentSectionsProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        sections.length > 1 ? "sm:grid-cols-2" : "max-w-2xl",
      )}
    >
      {sections.map((key) => {
        const Icon = ICONS[key] ?? Sparkles;
        return (
          <section key={key} className="card-surface p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                <Icon size={18} strokeWidth={2.25} aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-bold tracking-tight text-text">
                  {getTitle(key)}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {getBody(key)}
                </p>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
