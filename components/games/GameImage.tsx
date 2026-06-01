"use client";

interface GameImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export function GameImage({ src, alt, priority, className }: GameImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={200}
      height={200}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src.includes("placeholder-game.svg")) return;
        img.src = "/placeholder-game.svg";
      }}
    />
  );
}
