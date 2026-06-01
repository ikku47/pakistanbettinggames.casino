import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.domain.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: locales.map((locale) => `${base}/sitemap/${locale}.xml`),
    host: base,
  };
}
