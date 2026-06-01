"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
  /** Styled for the green header bar */
  variant?: "header" | "nav";
};

export function ThemeToggle({ className, variant = "header" }: ThemeToggleProps) {
  const t = useTranslations("Theme");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const base =
    variant === "header"
      ? "rounded-lg p-2 text-white hover:bg-white/15"
      : "rounded-lg border border-border bg-surface p-2 text-text-secondary hover:border-brand hover:text-brand";

  if (!mounted) {
    return (
      <span
        className={cn("inline-block h-9 w-9 shrink-0", className)}
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(base, "transition", className)}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      title={isDark ? t("light") : t("dark")}
    >
      {isDark ? (
        <Sun size={18} strokeWidth={2} aria-hidden />
      ) : (
        <Moon size={18} strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}
