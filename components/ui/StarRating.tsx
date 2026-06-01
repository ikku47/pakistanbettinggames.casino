import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  size?: number;
  className?: string;
  /** Filled star color on dark backgrounds */
  variant?: "default" | "onDark";
}

export function StarRating({
  value,
  size = 14,
  className,
  variant = "default",
}: StarRatingProps) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;

  const filledClass =
    variant === "onDark"
      ? "fill-amber-300 text-amber-300"
      : "fill-star text-star";
  const emptyClass =
    variant === "onDark" ? "fill-transparent text-white/35" : "fill-transparent text-border";

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`Rating ${value.toFixed(1)} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const isFilled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            size={size}
            strokeWidth={isFilled ? 0 : 1.5}
            className={isFilled ? filledClass : emptyClass}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

interface RatingLabelProps {
  value: string;
  size?: number;
  className?: string;
}

/** Single star + numeric rating (game cards, lists). */
export function RatingLabel({ value, size = 12, className }: RatingLabelProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-star", className)}>
      <Star size={size} className="fill-star text-star" strokeWidth={0} aria-hidden />
      <span className="font-medium text-text-secondary">{value}</span>
    </span>
  );
}
