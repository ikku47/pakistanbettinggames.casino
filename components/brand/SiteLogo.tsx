import Image from "next/image";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  size?: number;
  className?: string;
  /** Wrap in white tile (header on green bar). */
  variant?: "plain" | "tile";
  priority?: boolean;
};

export function SiteLogo({
  size = 40,
  className,
  variant = "plain",
  priority = false,
}: SiteLogoProps) {
  const img = (
    <Image
      src="/logo.png"
      alt="Pakistan Betting Games"
      width={size}
      height={size}
      className={cn("object-contain", className)}
      priority={priority}
    />
  );

  if (variant === "tile") {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-md ring-1 ring-white/20 transition group-hover:scale-105",
        )}
        style={{ width: size + 8, height: size + 8 }}
      >
        {img}
      </span>
    );
  }

  return img;
}
