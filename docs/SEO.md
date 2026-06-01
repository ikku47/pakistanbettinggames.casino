# SEO checklist (operator tasks)

The codebase indexes **PKR URLs only** per locale (`/en-PK/pkr/…`). Other currency paths stay usable but send `noindex, follow` and canonical to the PKR equivalent.

## You should do manually

1. **Google Search Console** — verify `pakistanbettinggames.casino`, submit sitemaps:
   - `/sitemap/en-PK.xml`
   - `/sitemap/ur-PK.xml`
   - `/sitemap/hi-IN.xml`
   - `/sitemap/zh-CN.xml`
2. **Canonical host** — 301 `www` → apex (or the reverse), HTTPS only, one version in GSC.
3. **Bing Webmaster Tools** — same sitemaps.
4. **Content** — expand guides, unique game intros, native **ur-PK** copy.
5. **Links** — brand mentions and legitimate partners; avoid paid link spam.

## Already in the app

- Per-page metadata, Open Graph, Twitter cards
- `hreflang` across locales (PKR paths)
- JSON-LD: Organization, WebSite, WebPage, BreadcrumbList, FAQPage, Article, ItemList, VideoGame
- Locale sitemaps with paginated game discovery from API
- `robots.txt`, `llms.txt`, `ai.txt`
