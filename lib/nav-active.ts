import { stripCurrencyPrefix } from "@/lib/currency";

/** Match main nav href against pathname (may include `/pkr` prefix). */
export function isNavLinkActive(pathname: string, href: string): boolean {
  const current = stripCurrencyPrefix(pathname).replace(/\/$/, "") || "/";
  const target = href === "/" ? "/" : href.replace(/\/$/, "");

  if (target === "/") {
    return current === "/";
  }

  return current === target || current.startsWith(`${target}/`);
}
