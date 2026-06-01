import type { GameRecord } from "./types";

/** Stable display rating when API has none (LiteAPKS-style meta line). */
export function displayRatingValue(game: GameRecord): number {
  return Math.min(5, 3.5 + (game.id % 15) / 10);
}

export function displayRating(game: GameRecord): string {
  return displayRatingValue(game).toFixed(1);
}

export function modTags(game: GameRecord): string[] {
  const tags: string[] = [];
  if (game.gameType === 1) tags.push("Real Money");
  if (game.isAegis === 1) tags.push("Hot");
  if (game.vipLevelLimit > 0) tags.push(`VIP ${game.vipLevelLimit}+`);
  return tags.length ? tags : ["Play Online"];
}
