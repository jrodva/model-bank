# model-bank

## Overview
Model bank app is  focused on transactions, we want to render a list of transactions with different
characteristics, it is very important the performance because our list will have so many elements.
At UI Level we show a header with the bank name, in this case Model Bank, with a simple logo with 2 letters MB,
on the bottom of this a long list with at least 1000 elements.

## Implementation
Our app will be built on React native using Expo, Typescript and a mock server keeping the contract:

```
GET /items query: cursor: string (optional) limit: integer (default 20)
response 200: items: - id: string type: "inbound" | "outbound" status:
"pending" | "confirmed" amount: { value: number, currency: string } label: {
name: string, imageUrl: string | null } category: string date: string (ISO
8601) flagged: boolean nextCursor: string | null
```

We support this app using `@vacacode/tokens` and `@vacacode/ui` to generate the main elements of our ui.
The key components for our development are:
  - ItemsList
    - Organism from `@vacacode/ui` that uses ItemCard.
    - It's based on `@shopify/flash-list`.
  - ItemsCard
    - Molecule from `@vacacode/ui`.
    - It's optimized using `React.memo`.

## Used Technology versions in `@vacacode/tokens` and `@vacacode/ui`
- "typescript": "^5.4.0".
- "node": ">=20".
- "react": "^18.3.0".
- "react-dom": "^18.3.0".
- "@shopify/flash-list": "^1.6.3".
- "@tanstack/react-query": "^5.28.0".

## Resources
- https://jrodva.github.io/vaca-code-design-system
- https://www.npmjs.com/package/@vacacode/tokens
- https://www.npmjs.com/package/@vacacode/ui
- https://github.com/jrodva/vaca-code-design-system/blob/main/README.md
- https://github.com/jrodva/vaca-code-design-system/tree/main
- https://github.com/jrodva/vaca-code-design-system/tree/main/packages/tokens#readme
- https://github.com/jrodva/vaca-code-design-system/tree/main/packages/ui#readme
