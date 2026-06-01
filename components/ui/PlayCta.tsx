"use client";

import { useLocaleConfig } from "@/components/providers/LocaleConfigProvider";
import { playUrl, downloadUrl } from "@/lib/config";
import { cn } from "@/lib/utils";

interface PlayCtaProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  mode?: "play" | "download";
  gameCode?: string;
  category?: string;
  block?: boolean;
}

export function PlayCta({
  href,
  children,
  className,
  variant = "primary",
  size = "md",
  mode = "play",
  gameCode,
  category,
  block = false,
}: PlayCtaProps) {
  const { config, locale, currency } = useLocaleConfig();

  const resolvedHref =
    href ??
    (mode === "download"
      ? downloadUrl(config)
      : playUrl(config, { gameCode, category, locale, currency }));

  const sizes = {
    sm: "px-3.5 py-2 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-sm rounded-xl",
  };

  const variants = {
    primary:
      "bg-brand text-white font-bold shadow-md shadow-brand/20 hover:bg-brand-dark active:scale-[0.98]",
    outline:
      "border-2 border-brand text-brand font-semibold bg-surface hover:bg-brand-light",
    ghost: "text-brand font-semibold hover:bg-brand-light rounded-xl",
  };

  return (
    <a
      href={resolvedHref}
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center transition",
        sizes[size],
        variants[variant],
        block && "w-full",
        className,
      )}
    >
      {children}
    </a>
  );
}
