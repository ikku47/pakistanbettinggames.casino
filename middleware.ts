import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import {
  CURRENCY_COOKIE,
  currencySlug,
  getInitialCurrency,
  parseCurrencySlug,
} from "@/lib/currency";
import { routing, type AppLocale } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALES = routing.locales;
const LOCALE_SET = new Set<string>(LOCALES);

const LEGACY_SEGMENTS = new Set([
  "games",
  "category",
  "platform",
  "faq",
  "about",
  "guides",
  "currency",
]);

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function preferredCurrencySlug(request: NextRequest): string {
  const cookie = request.cookies.get(CURRENCY_COOKIE)?.value;
  const code = getInitialCurrency(cookie, {
    currency_code: "PKR",
    currency: [],
  } as never);
  return currencySlug(code);
}

function withCurrencyCookie(
  response: NextResponse,
  code: string,
): NextResponse {
  response.cookies.set(CURRENCY_COOKIE, code.toUpperCase(), {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length >= 1 && LOCALE_SET.has(parts[0])) {
    const locale = parts[0] as AppLocale;
    const slug = preferredCurrencySlug(request);

    // /en-PK only → /en-PK/pkr
    if (parts.length === 1) {
      return withCurrencyCookie(
        NextResponse.redirect(new URL(`/${locale}/${slug}`, request.url)),
        slug,
      );
    }

    const second = parts[1];

    // /en-PK/games/... → /en-PK/pkr/games/...
    if (LEGACY_SEGMENTS.has(second)) {
      const rest = parts.slice(1).join("/");
      return withCurrencyCookie(
        NextResponse.redirect(
          new URL(`/${locale}/${slug}/${rest}`, request.url),
        ),
        slug,
      );
    }

    // /en-PK/currency/usd → /en-PK/usd
    if (second === "currency") {
      const code = parts[2];
      if (code && parseCurrencySlug(code)) {
        return withCurrencyCookie(
          NextResponse.redirect(new URL(`/${locale}/${code}`, request.url)),
          code,
        );
      }
      return withCurrencyCookie(
        NextResponse.redirect(
          new URL(`/${locale}/${slug}/currency`, request.url),
        ),
        slug,
      );
    }

    // /en-PK/pkr/... — valid currency segment
    const urlCurrency = parseCurrencySlug(second);
    if (urlCurrency) {
      return withCurrencyCookie(intlMiddleware(request), urlCurrency);
    }

    // Unknown second segment — treat as legacy path missing currency
    return withCurrencyCookie(
      NextResponse.redirect(
        new URL(`/${locale}/${slug}/${parts.slice(1).join("/")}`, request.url),
      ),
      slug,
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
