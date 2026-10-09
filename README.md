# MarketApp Monorepo

A digital marketplace and navigation platform for physical markets — starting in Lagos, Nigeria.

## Architecture

```
apps/
  mobile/          # Expo React Native app (iOS + Android)
  web/             # Public website (Next.js)
  seller-portal/   # Seller web dashboard (Next.js)
  market-admin/    # Market association portal (Next.js)
  platform-admin/  # MarketApp admin portal (Next.js)
  api/             # NestJS REST + WebSocket API
packages/
  types/           # Shared TypeScript types
  ui/              # Shared React web components
  ui-native/       # Shared React Native components
  api-client/      # Typed API client
  config/          # Shared ESLint, TS, Prettier configs
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Run all apps in dev mode
pnpm dev

# Run specific apps
pnpm dev:mobile        # Expo mobile app
pnpm dev:web           # Public website (localhost:3000)
pnpm dev:seller        # Seller portal (localhost:3001)
pnpm dev:market-admin  # Market admin (localhost:3002)
pnpm dev:platform-admin # Platform admin (localhost:3003)
pnpm dev:api           # NestJS API (localhost:4000)
```

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Mobile**: Expo SDK 52, React Native, TypeScript
- **Web**: Next.js 15 (App Router), TypeScript, CSS Modules
- **Backend**: NestJS, TypeORM, PostgreSQL + PostGIS
- **Search**: OpenSearch
- **Cache**: Redis
- **Real-time**: WebSockets (Socket.io)
- **Payments**: Paystack / Flutterwave
- **Notifications**: Firebase Cloud Messaging, Email, SMS

## Phase 1 MVP Scope

1. Market digitization — one Lagos market, 200–300 stalls, routing graph, 360° imagery
2. Seller commerce — shop claims, KYC, catalogs, chat, negotiation
3. Transactions — checkout, payment, pickup, delivery, ratings