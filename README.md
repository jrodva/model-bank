# Model Bank

A React Native + Expo banking app that renders a high-performance, paginated list of 1 000+ transactions. Performance is the primary design constraint.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Commands](#commands)
- [Architecture](#architecture)
- [API Contract](#api-contract)
- [Testing](#testing)
- [Design System](#design-system)

---

## Overview

Model Bank displays a scrollable list of bank transactions fetched from a local mock server. The UI consists of:

- **Header** — bank name "Model Bank" with an "MB" logo badge.
- **Transaction list** — infinite-scrolling list of 1 200 mock transactions, each showing merchant name, formatted amount, category, status, and a flag indicator.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.85 + Expo 56 |
| Language | TypeScript |
| Data fetching | TanStack React Query v5 (`useInfiniteQuery`) |
| List rendering | `@shopify/flash-list` via `@vacacode/ui` |
| Design system | `@vacacode/ui` + `@vacacode/tokens` |
| Mock server | Express 5 + `tsx` (TypeScript, no build step) |
| Unit tests | Vitest + `@testing-library/react` |
| Package manager | pnpm |

---

## Project Structure

```
model-bank/
├── src/
│   ├── api/
│   │   └── transactions.ts       # fetch wrapper for GET /items
│   ├── hooks/
│   │   ├── useTransactions.ts    # infinite-query hook + data mapping
│   │   └── useTransactions.test.tsx
│   ├── pages/
│   │   ├── Home.tsx              # main screen
│   │   └── Home.styles.ts        # StyleSheet using @vacacode/tokens
│   └── types/
│       └── transaction.ts        # Transaction, TransactionsResponse types
├── mock-server/
│   ├── index.ts                  # Express server on :3000
│   └── tsconfig.json             # Node-targeted TS config (separate from Expo)
├── App.tsx                       # QueryClientProvider + Home
├── index.ts                      # Expo entry point (registerRootComponent)
├── app.json                      # Expo config
├── vitest.config.ts              # Unit test config
└── package.json
```

---

## Getting Started

**Prerequisites**

- Node.js >= 20
- pnpm >= 10
- Expo CLI (`pnpm expo`)
- iOS Simulator (Xcode) or Android Emulator

**Install dependencies**

```bash
pnpm install
```

**Start the mock server** (required before launching the app)

```bash
pnpm mock-server
```

**Run the app**

```bash
pnpm ios       # iOS simulator
pnpm android   # Android emulator
```

---

## Commands

```bash
pnpm start          # Start Expo dev server
pnpm ios            # Run on iOS simulator
pnpm android        # Run on Android emulator
pnpm mock-server    # Start mock API server on http://localhost:3000
pnpm tsc --noEmit   # Type-check
pnpm test           # Run unit tests (watch mode)
pnpm test:run       # Run unit tests once
```

---

## Architecture

### Data Fetching

`useTransactions` (`src/hooks/useTransactions.ts`) uses `useInfiniteQuery` with cursor-based pagination:

- Each page is fetched by passing the `nextCursor` from the previous response as the `cursor` query param.
- Raw `Transaction` objects are mapped to `ListItemData` (the shape `@vacacode/ui` expects) inside the hook, keeping the UI layer free of API details.
- Amount formatting uses `Intl.NumberFormat` with the `en-US` locale.

### List Rendering

`ItemsList` from `@vacacode/ui` is built on `@shopify/flash-list`. It virtualises the list so only visible items are rendered at any time, regardless of total count. `onEndReached` triggers `fetchNextPage` when the user approaches the bottom.

Key constraints:
- Never replace `ItemsList` with `FlatList` or `ScrollView`.
- Do not wrap `ItemCard` in extra components — it is already memoised.
- Do not pass anonymous functions or object literals as props to `ItemCard`.

### Mock Server

`mock-server/index.ts` is a TypeScript Express server run directly via `tsx` (no compilation step). It generates 1 200 deterministic transactions on startup and serves them through a single paginated endpoint. It uses its own `tsconfig.json` targeting CommonJS Node, separate from the Expo TypeScript config.

---

## API Contract

```
GET http://localhost:3000/items

Query params:
  cursor  string   optional — opaque pagination cursor
  limit   integer  optional — items per page (default 20, max 100)

Response 200:
  {
    items: [
      {
        id:       string               // "tx-000000"
        type:     "inbound" | "outbound"
        status:   "pending" | "confirmed"
        amount:   { value: number, currency: string }
        label:    { name: string, imageUrl: string | null }
        category: string               // food | transport | shopping | ...
        date:     string               // ISO 8601
        flagged:  boolean
      }
    ],
    nextCursor: string | null          // null on last page
  }
```

---

## Testing

Unit tests live alongside source files (`*.test.tsx`) and are run with Vitest in a jsdom environment.

```bash
pnpm test        # watch mode
pnpm test:run    # single run (CI)
```

`useTransactions` is covered by 11 tests across:

- Initial loading state
- Successful item mapping (`variant`, `status`, `label`, `subtitle`, `imageUri`, `flagged`)
- Currency formatting (`Intl.NumberFormat` en-US)
- Pagination (`hasNextPage`, cursor forwarding)
- Multi-page flattening
- Error propagation

`fetchTransactions` is mocked via `vi.mock` so tests run without a real server.

---

## Design System

| Package | Purpose |
|---------|---------|
| `@vacacode/ui` | UI components — `ItemsList`, `ItemCard` |
| `@vacacode/tokens` | Design tokens — `colors`, `spacing`, `typography` |

- Docs: https://github.com/jrodva/vaca-code-design-system/tree/main/packages/ui#readme
- Docs: https://github.com/jrodva/vaca-code-design-system/tree/main/packages/tokens#readme
