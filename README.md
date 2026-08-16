# VODS MEME

VODS MEME teaches the English the internet actually uses. It is a desktop-first, no-login learning prototype built around context, tone, and practical use instead of literal translation.

The canonical product, content, UX, and technical decisions are frozen in [`VODS_MEME_SPEC_v1.0.md`](./VODS_MEME_SPEC_v1.0.md).

## Included MVP

- Dark portal at `/`, with a light Learn and Search application.
- Curated lessons for COOK / COOKED, LOCK IN, CRASH OUT, ATE, AIN'T NO WAY, and 67 / SIX SEVEN.
- Three challenge modes: meme context, contrast, and use case.
- Contextual Answer + Why + Context feedback.
- Persisted local Aura, Braincells, rank, sequential unlocks, and idempotent rewards.
- Deterministic, curated-dataset text search with a Search-to-Learn bridge.
- P1.5 AI text fallback and P2 screenshot interpretation through a server-only OpenAI Responses API route.

The core product works without an API key or database. To enable AI fallback and screenshot interpretation, add `OPENAI_API_KEY` to `.env.local`; `OPENAI_MODEL` defaults to `gpt-5-mini`.

## Run Locally

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Then open `http://localhost:3000`. No `.env` file is required for the curated flow.

## Verify

```bash
corepack pnpm lint
corepack pnpm build
```

## Attribution

This project selectively reuses the Next.js learning-flow baseline from [sanidhyy/duolingo-clone](https://github.com/sanidhyy/duolingo-clone), licensed under MIT. Its upstream `LICENSE` is retained. VODS MEME replaces the upstream product identity, lesson data, progress model, active routes, and visual system.
