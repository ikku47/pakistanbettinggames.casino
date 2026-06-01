# Deploy on Cloudflare Workers (OpenNext)

## Why the build failed

Cloudflare runs **`opennextjs-cloudflare build`**, not plain `next build` + `wrangler deploy` on `.next`.

Next.js 16 **`proxy.ts` uses the Node.js runtime**, which OpenNext does not support yet. This repo uses **`middleware.ts`** (Edge) for locale/currency redirects instead. You may see a Next.js deprecation warning locally; that is expected until OpenNext supports `proxy.ts`.

## Cloudflare dashboard settings

| Setting | Value |
|--------|--------|
| **Build command** | `bun run deploy` or `opennextjs-cloudflare build` |
| **Deploy command** | *(leave empty if build runs deploy)* or `opennextjs-cloudflare deploy` |
| **Do not use** | `npx wrangler deploy` alone (wrong output directory) |

Set **environment variables** in the dashboard (same as `.env.local`):

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_PLATFORM_URL`
- `GAME_API_BASE_URL`
- `GAME_API_TOKEN`
- `GAME_API_PLATFORM`
- `NEXT_PUBLIC_CDN_URL`

For local Workers preview, copy `.dev.vars.example` to `.dev.vars`.

## Commands

```bash
bun install
bun run build          # Next.js only (CI compile check)
bun run preview        # OpenNext build + local Workers runtime
bun run deploy         # OpenNext build + deploy to Cloudflare
```

## SEO note

Non-PKR currency URLs are `noindex` with canonical to `/pkr/` — see `docs/SEO.md`.
