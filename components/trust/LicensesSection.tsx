import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { licenses } from "@/lib/licenses";
import { cn } from "@/lib/utils";

interface LicensesSectionProps {
  className?: string;
}

export async function LicensesSection({ className }: LicensesSectionProps) {
  const t = await getTranslations("Licenses");

  return (
    <section
      id="licenses"
      className={cn(
        "scroll-mt-24 rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8",
        className,
      )}
      aria-labelledby="licenses-heading"
    >
      <h2
        id="licenses-heading"
        className="text-xl font-bold text-text"
      >
        {t("sectionTitle")}
      </h2>
      <p className="mt-3 max-w-6xl text-sm leading-relaxed text-text-secondary">
        {t("sectionIntro")}
      </p>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {licenses.map((license) => (
          <li
            key={license.id}
            className="flex gap-4 rounded-xl border border-border bg-bg p-5"
          >
            <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-surface-elevated px-2">
              <Image
                src={license.icon}
                alt={t(`items.${license.id}.title`)}
                width={96}
                height={40}
                className="h-9 w-auto max-w-[96px] object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold leading-snug text-text">
                {t(`items.${license.id}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {t(`items.${license.id}.description`)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 rounded-lg border border-border-light bg-bg px-4 py-3 text-xs leading-relaxed text-text-muted">
        {t("footnote")}
      </p>
    </section>
  );
}
