# thepregames

Apps
- apps/web — Next.js (App Router)
- apps/mobile — Expo React Native

Packages
- packages/shared — shared types/utils
- packages/game-engines — game logic
- packages/ui — shared React UI
- packages/api-clients — fetch helpers

Other
- services/etl — nightly jobs
- infra — rules, functions

## Requirements
- Node 20, PNPM 9

## Setup
pnpm install

## Dev
pnpm dev
# or:
pnpm --filter @thepregames/web dev
pnpm --filter @thepregames/mobile dev

## Build
pnpm --filter @thepregames/web build
pnpm --filter @thepregames/mobile build
