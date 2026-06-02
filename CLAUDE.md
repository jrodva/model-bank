# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

React Native + Expo banking app displaying a high-performance list of 1000+ transactions. Performance is the primary concern.

## Commands

```bash
pnpm start              # Start dev server
pnpm ios                # Run on iOS simulator
pnpm android            # Run on Android emulator
pnpm mock-server        # Start mock API server (required before running the app)
pnpm tsc --noEmit       # Type-check
```

## Architecture

### API Contract

Mock server endpoint:

```
GET /items
  query: cursor (string, optional), limit (integer, default 20)
  response 200:
    items[]:
      id: string
      type: "inbound" | "outbound"
      status: "pending" | "confirmed"
      amount: { value: number, currency: string }
      label: { name: string, imageUrl: string | null }
      category: string
      date: string (ISO 8601)
      flagged: boolean
    nextCursor: string | null
```

### Key Design System Packages

- `@vacacode/ui` — UI components (docs: https://github.com/jrodva/vaca-code-design-system/tree/main/packages/ui#readme)
- `@vacacode/tokens` — Design tokens (docs: https://github.com/jrodva/vaca-code-design-system/tree/main/packages/tokens#readme)

**Critical components from `@vacacode/ui`:**

- `ItemsList` — Organism built on `@shopify/flash-list`. Use this for the transaction list; do not replace with FlatList or ScrollView.
- `ItemCard` — Molecule wrapped in `React.memo`. Do not add unnecessary wrapper components around it.

### Data Fetching

Use `@tanstack/react-query` with cursor-based pagination (`useInfiniteQuery`) to feed the `ItemsList`. Fetch the next page when the list approaches the end.

### UI Structure

- Header: bank name "Model Bank" + logo with initials "MB"
- Body: scrollable list of transactions using `ItemsList`

### Performance Notes

The list renders 1000+ items. Keep these constraints in mind:
- Rely on `ItemsList` (flash-list) for virtualization — never load all items at once.
- Avoid anonymous functions or object literals as props to `ItemCard`.
- Pagination via cursor (`nextCursor`) avoids offset drift.
