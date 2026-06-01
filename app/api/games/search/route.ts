import { NextResponse } from "next/server";
import { routing, type AppLocale } from "@/i18n/routing";
import { searchGamesByName } from "@/lib/api";
import { formatGameTitle, gameSlug } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const localeParam = searchParams.get("locale") ?? routing.defaultLocale;

  if (!routing.locales.includes(localeParam as AppLocale)) {
    return NextResponse.json({ games: [] }, { status: 400 });
  }

  const locale = localeParam as AppLocale;

  if (q.length < 2) {
    return NextResponse.json({ games: [] });
  }

  const records = await searchGamesByName(locale, q, 20);

  const games = records.map((g) => ({
    id: g.id,
    gameName: g.gameName,
    title: formatGameTitle(g.gameName),
    slug: gameSlug(g),
    iconUrl: g.iconUrl,
    gameClassCode: g.gameClassCode,
  }));

  return NextResponse.json(
    { games },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
      },
    },
  );
}
