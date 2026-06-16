# Foppy AI — Frontend

> Voice-first personal finance AI — Next.js client that captures Spanish speech and renders agent responses for transactions, goals, and budgets.

## Problem

Logging expenses by hand is tedious enough that most people stop doing it. Foppy AI offers a Spanish-language voice interface so a user can capture a transaction, savings goal, or budget in a single spoken sentence — and see the structured result back in the UI.

## Approach

The client records audio in the browser via `MediaRecorder`, encodes it (WAV / MP3), and posts it to the Foppy AI backend. The backend transcribes with Whisper, routes intent with GPT-4o-mini, and returns structured data which the client renders for user confirmation. Auth is handled with NextAuth (Credentials provider against the backend), and server state is managed with TanStack Query plus a thin Zustand layer.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14.2 (App Router, React 18 Server Components) |
| Language | TypeScript 5 |
| Styles | Tailwind CSS 3.4 + shadcn/ui + Radix primitives |
| Auth | NextAuth 5 (beta) — Credentials provider |
| Data | TanStack Query 5, Axios, Socket.IO client, Zustand |
| Forms | React Hook Form + Zod |
| Audio | `extendable-media-recorder` + WAV encoder, `lamejs` |
| Tests | Jest, Testing Library, MSW |

## Highlights

- **Voice capture pipeline** — `useAudioRecorder` hook wraps `MediaRecorder` and ships blobs to the agent service (`src/features/audio/services/audio.service.ts`).
- **NextAuth flow** — Credentials provider with JWT session callbacks; routes guarded by `middleware.ts`.
- **Feature-sliced layout** — `src/features/{audio,auth,transactions,budgets,goals,debts,categories,payment-methods,reports,recommendations,subscriptions,notifications}/` each own their hooks, services, and presentation.
- **Component library** — shadcn/ui generated into `src/components/ui/`, with chart components on top of Recharts and react-hook-form wrappers under `src/components/rhf/`.
- **Realtime notifications** — Socket.IO client for live updates from the backend.

## Local setup

Requires Node 22.14 (see `.nvmrc`). The project ships both `bun.lock` and `package-lock.json` — pick one.

```bash
# install
bun install            # or: npm install

# environment
cp .env.example .env   # set NEXTAUTH_SECRET, backend API URL, OAuth credentials

# dev server (port 3001)
bun run dev            # or: npm run dev

# tests
bun run test           # or: npm test
```

## Status & limitations

- Hackathon-origin (Apr 2025); UX and agent UI continue to iterate.
- Pairs with the backend at [devjaes/foppy-ai-back](https://github.com/devjaes/foppy-ai-back). The frontend is **not** functional standalone — voice capture, auth, and most reads require the backend running.
- Spanish-language UX; copy and prompts are not yet localized to English.
- No public deploy URL is published from this repo.

## Team

- **My role:** Frontend co-lead (~50% of frontend commits) — audio capture hook, agent voice flow, NextAuth integration, feature-sliced refactor.
- **Co-author:** Pablo Martinez ([@SrPabvliss](https://github.com/SrPabvliss)).

## Recognition

3rd place — Hatary Shunko Fintech Innovation Contest (Apr 2025), as the *Fopymes* prototype that this project grew from.
