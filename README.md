# Pakistan Betting Games

SEO catalog for online casino and betting games in Pakistan — slots, sports betting, live casino, and mobile browser play. Built with **Next.js 16**, **next-intl**, and deployed to **Cloudflare Workers** via [OpenNext](https://opennext.js.org/cloudflare).

**Production:** [pakistanbettinggames.casino](https://pakistanbettinggames.casino)

## Stack

- Next.js 16 (App Router) + React 19
- next-intl — `en-PK`, `ur-PK`, `hi-IN`, `zh-CN`
- Wallet URLs — `/{locale}/{currency}/…` (e.g. `/en-PK/pkr/games`)
- Live game data from the platform API
- OpenNext Cloudflare adapter + Wrangler

## Requirements

- [Bun](https://bun.sh) (or Node 22+)
- Game API credentials (see environment variables below)

## Local development

```bash
bun install
cp .dev.vars.example .dev.vars   # optional, for Workers preview
```

Create `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://pakistanbettinggames.casino
NEXT_PUBLIC_PLATFORM_URL=https://your-casino-domain.com
GAME_API_BASE_URL=https://your-api-host.com
GAME_API_TOKEN=your-token
GAME_API_PLATFORM=3
NEXT_PUBLIC_CDN_URL=https://your-cdn-host.com
```

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to a locale + currency path (default `en-PK` + `pkr`).

## Scripts

| Command | Purpose |
|---------|---------|
| `bun run dev` | Next.js dev server |
| `bun run build` | Next.js production build only (compile check) |
| `bun run start` | Run `.next` output locally (Node) |
| `bun run preview` | OpenNext build + preview in Workers runtime |
| `bun run deploy` | OpenNext build + deploy to Cloudflare |
| `bun run lint` | ESLint |

## Deploy on Cloudflare Workers

Do **not** use `bun run build` + `npx wrangler deploy`. That skips OpenNext and deploys the wrong output.

### Dashboard build settings

| Field | Value |
|-------|--------|
| **Build command** | `bunx opennextjs-cloudflare build` |
| **Deploy command** | `bunx opennextjs-cloudflare deploy` |
| **Non-production branch deploy command** | `bunx opennextjs-cloudflare upload` |
| **Path** | `/` |

Or use a single build step: **`bun run deploy`** and leave deploy command empty (if your project type allows it).

Add the same environment variables as `.env.local` in the Cloudflare project settings.

More detail: [docs/CLOUDFLARE.md](docs/CLOUDFLARE.md). **Workers Free:** create the R2 cache bucket once (`bunx wrangler r2 bucket create pakistanbettinggames-inc-cache`) so pages stay cached and avoid Error 1102.

### Middleware note

Routing uses **`middleware.ts`** (Edge), not Next.js 16 `proxy.ts`. OpenNext does not support Node `proxy.ts` yet. A local deprecation warning is expected.

## Project structure

```
app/[locale]/[currency]/   # Localized, currency-scoped pages
components/                # UI (games, guides, layout, SEO)
lib/                       # API, SEO, currency, config
messages/                  # i18n JSON per locale
middleware.ts              # Locale + currency redirects (Edge)
wrangler.jsonc             # Cloudflare Worker config
open-next.config.ts        # OpenNext adapter config
```

## SEO

- Per-page metadata, hreflang, JSON-LD, locale sitemaps
- Indexed URLs use **PKR** paths (`/en-PK/pkr/…`); other currencies are `noindex` with canonical to PKR

Operator checklist: [docs/SEO.md](docs/SEO.md)

## Agent / contributor notes

See [AGENTS.md](AGENTS.md) for Next.js 16 conventions in this repo.
