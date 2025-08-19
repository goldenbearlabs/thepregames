# thepregames — Full Software Plan (V1)

**Domain**: `thepregames.ca`  
**Platforms**: Web (Next.js/Vercel) + Mobile (React Native/Expo)  
**Monetization**: Subscription (Monthly $5, Annual $50), minimal ads (free tier), paid removes ads + unlocks features  
**Regions**: Canada/US primary, global access with age-gate  
**Auth**: Firebase Auth (Email/Password, Google, Anonymous for guests)  
**Storage/Realtime**: Firestore + Firebase Storage + FCM  
**Payments**: Stripe (web) + Apple/Google IAP (apps) unified via RevenueCat 
**Data**: Hybrid: Firestore (realtime/UGC/lobbies) + Postgres (Ball Knowledge dataset, leaderboards, daily challenge)  
**Privacy/Safety**: Age attestation, disclaimers (“drink responsibly”), moderation & report flow, account deletion  
**V1 Scope**: Recipes, Games/Rules, Lobbies, Blackjack, Quiplash, Most Likely To, Charades, Powerhour (YouTube free, Spotify paid host), Ball Knowledge (daily challenge + pools), Tournaments (Beer Olympics + Brackets), Notifications, Admin moderation

---

## 1) High-Level Architecture

### 1.1 System Diagram
- **Clients**: Web (Next.js) and Mobile (Expo) share TypeScript models/utils in `packages/shared`.
- **Firebase**: Auth, Firestore (realtime game state, UGC, lobbies), Storage (images), Cloud Functions (server logic), FCM (push).
- **Postgres** (Supabase or Neon): Ball Knowledge normalized sports data + views, leaderboards, daily challenge.
- **Edge/API**: Next.js Route Handlers (web) / Serverless functions for Postgres reads/writes; Cloud Functions for server-authoritative game steps (e.g., Blackjack dealing).  
- **Payments**: Stripe (web Checkout + webhooks) + IAPs (via RevenueCat or native).  
- **Ads**: AdSense on non-fullscreen pages.
- **Analytics/Monitoring**: PostHog (events/funnels), Sentry (errors).

### 1.2 Repos & Monorepo Layout
```
thepregames/
  apps/
    web/                 # Next.js (App Router) + Route Handlers
    mobile/              # Expo React Native
  packages/
    shared/              # zod schemas, types, validation, helpers
    game-engines/        # blackjack engine, round state machines, shared logic
    ui/                  # shared UI primitives (if using RNW/tamagui) or just types
    api-clients/         # lightweight SDKs for Firestore & server endpoints
  services/
    etl/                 # nightly sports ingestors (node/ts), cron driven
  infra/
    firestore.rules      # Firestore security rules
    functions/           # Cloud Functions (TS)
    sql/                 # Postgres DDL & views
```

---

## 2) Feature Matrix & Entitlements

| Feature | Free | Paid |
|---|---|---|
| Ride the Bus, Around the World, Roulette, Charades, Most Likely To | ✅ | ✅ |
| Blackjack & Quiplash (Join) | ✅ | ✅ |
| Blackjack & Quiplash (Create lobbies) | ❌ | ✅ |
| Powerhour (YouTube 10 min) | ✅ | ✅ |
| Powerhour/Centurion (Spotify host playback 60/100 min) | ❌ | ✅ |
| Ball Knowledge (Daily challenge) | ✅ | ✅ |
| Ball Knowledge (Change pools/tournament) | ❌ | ✅ |
| Tournaments (View public) | ✅ | ✅ |
| Tournaments (Create/Manage) | ❌ | ✅ |
| Ads | Minimal | Removed |
| Theme customization | ❌ | ✅ |

Entitlements are mirrored in Firestore `entitlements/{uid}` (source, plan, expiresAt).

---

## 3) Data Model

### 3.1 Firestore (Collections & Documents)

**`users/{uid}`**
```jsonc
{
  "username": "string",
  "avatarURL": "string|null",
  "email": "string",
  "dobAttested": true,
  "country": "CA|US|...|null",
  "linkedSpotify": {
    "connected": true,
    "lastCheckedAt": "timestamp"
  },
  "settings": {
    "notifications": {
      "dailyChallenge": true,
      "friendActivity": true,
      "lobbyInvites": true,
      "commentsLikes": true
    },
    "theme": "default|dark|custom-id"
  },
  "stats": {
    "powerhoursCompleted": 3,
    "centurionsCompleted": 1,
    "powerhoursPartial": 2
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**`entitlements/{uid}`**
```jsonc
{
  "plan": "free|monthly|annual",
  "adFree": true,
  "source": "stripe|apple|google|promo",
  "expiresAt": "timestamp|null"
}
```

**`lobbies/{code}`** (6-char code)
```jsonc
{
  "type": "blackjack|quiplash|mlt|charades|powerhour",
  "hostUid": "uid",
  "status": "waiting|locked|in_progress|finished",
  "createdAt": "timestamp",
  "lastActivityAt": "timestamp",
  "dealerIndex": 0,
  "config": {
    "maxPlayers": 10,
    "deckSeed": "string|null",      // blackjack fairness
    "packs": ["packId", "system:pg13"]
  }
}
```
**`lobbies/{code}/players/{id}`** (`id` can be `uid` or guest token)
```jsonc
{ "name": "Tom", "isHost": false, "seat": 2, "connected": true, "lastSeenAt": "timestamp", "score": 0, "drinksOwed": 0, "joinedAt": 0, "leftAt": 0, "role": "host|player|spectator" }
```
**`lobbies/{code}/state`** (one doc per lobby; game-specific)
```jsonc
{
  "turn": 3,
  "phase": "betting|dealing|results|voting|answering|round_end",
  "payload": { /* blackjack hands, quiplash prompts, etc. */ },
  "updatedAt": "timestamp"
}
```
**`lobbies/{code}/events/{eventId}`**
```jsonc
{
  "ts": "timestamp",
  "actor": "uid",
  "action": "placeBet|deal|vote|kick|lock|submitAnswer",
  "data": {}
}
```

**`packs/{packId}`**
```jsonc
{
  "ownerUid": "uid|system",
  "game": "quiplash|mlt|charades",
  "title": "Party Pack",
  "visibility": "private|public",
  "tags": ["pg13","drinking"],
  "cards": ["Prompt 1", "Prompt 2", "..."],
  "updatedAt": "timestamp"
}
```

**`recipes/{id}`**
```jsonc
{
  "title": "Moscow Mule",
  "imageURL": "string",
  "text": "recipe body...",
  "tags": ["vodka","ginger-beer"],
  "servings": 2,
  "ratingFacets": { "price": 3, "time": 2, "hammered": 4, "slammability": 5 },
  "authorUid": "uid",
  "likes": 12,
  "commentCount": 4,
  "createdAt": "timestamp"
}
```
**`recipes/{id}/ratings/{uid}`**
```jsonc
{ "price": 3, "time": 2, "hammered": 4, "slammability": 5, "liked": true }
```
**`recipes/{id}/comments/{id}`**
```jsonc
{ "authorUid": "uid", "text": "Nice!", "createdAt": "timestamp", "flagged": false }
```

**`gamePosts/{id}`** (UGC game/rules posts)
```jsonc
{
  "title": "Edmonton Beer Dye Rules",
  "imageURL": "string",
  "text": "rules...",
  "tags": ["beer-dye"],
  "facets": { "setupTime": 2, "gearNeeded": 3, "hammered": 5 },
  "authorUid": "uid",
  "likes": 8,
  "commentCount": 1,
  "createdAt": "timestamp"
}
```

**`tournaments/{id}`**
```jsonc
{
  "type": "beer_olympics|bracket",
  "title": "Dorm Cup",
  "coverImage": "string|null",
  "hostUid": "uid",
  "isPublic": true,
  "config": {
    "teams": [ { "name":"Alpha", "players":["Bob","Sue"] } ],
    "events": [ {"name":"Flip Cup","weight":2}, {"name":"Pong","weight":1} ],
    "playoffs": { "format":"single_elim", "seeding":"by_standings" }
  },
  "standings": {},
  "bracket": {},
  "updatedAt": "timestamp"
}
```

**`notifications/{uid}/{id}`**
```jsonc
{ "type": "dailyChallenge|invite|comment|like|friend", "payload": { "ref":"..." }, "read": false, "createdAt": "timestamp" }
```

**`moderationQueue/{id}`**
```jsonc
{ "refPath": "recipes/abc/comments/xyz", "reason": "flagged", "status": "open|actioned", "createdAt": "timestamp" }
```

### 3.2 Postgres (Ball Knowledge)

`sql/schema.sql` (excerpt)
```sql
create table leagues (
  id serial primary key,
  key text unique not null,            -- nhl|nba|mlb|nfl
  name text not null
);
create table teams (
  id serial primary key,
  league_id int not null references leagues(id),
  key text not null,                   -- "EDM", "TOR"
  name text not null,
  division text,
  conference text
);
create table players (
  id bigserial primary key,
  league_id int not null references leagues(id),
  team_id int references teams(id),
  name text not null,
  number int,
  height_in int,
  weight_lb int,
  position text,
  shoots text,                         -- L/R or handedness, sport-specific
  active boolean default true
);
create table player_flags (
  player_id bigint primary key references players(id),
  fantasy_relevant boolean default false,
  starter boolean default false,
  updated_at timestamptz default now()
);
create table mystery_daily (
  date date primary key,
  player_id bigint not null references players(id)
);
create table bk_results (
  id bigserial primary key,
  user_id text not null,
  date date not null,
  guesses int not null,
  success boolean not null,
  time_ms int not null,
  created_at timestamptz default now()
);
-- Indexes
create index idx_players_league_team on players (league_id, team_id);
create index idx_flags_updated on player_flags (updated_at desc);
create index idx_bk_results_user_date on bk_results (user_id, date);
```

Views (examples):
```sql
create view v_players_pool as
select p.*, pf.fantasy_relevant, pf.starter,
       t.key as team_key, t.division, t.conference, l.key as league_key
from players p
join leagues l on l.id = p.league_id
left join teams t on t.id = p.team_id
left join player_flags pf on pf.player_id = p.id;

create view v_players_search as
select p.id, l.key as league, coalesce(t.key,'') as team, p.name,
       unaccent(lower(p.name)) as name_norm,
       split_part(unaccent(lower(p.name)),' ',1) as first_norm,
       split_part(unaccent(lower(p.name)),' ',2) as last_norm
from players p
join leagues l on l.id = p.league_id
left join teams t on t.id = p.team_id;
```

---

## 4) API & Contracts

### 4.1 Web/Edge Endpoints (Next.js Route Handlers)

**`GET /api/bk/pool`** — list players (filtered)
- **Query**: `leagues=nhl,nba&subset=fantasy|all|starters`
- **Resp**:
```json
{ "players": [ { "id":123, "name":"...", "league":"nhl", "team":"EDM", "number":29, "height_in":185, "weight_lb":95, "position":"C", "hand":"L", "division":"Pacific", "conference":"West", "fantasy_relevant":true, "starter":true } ] }
```

**`GET /api/bk/search`** — autocomplete suggestions
- **Notes**: Only returns players in currently allowed pool; matches first or last name
- **Query**: `q=con&leagues=nhl,nba&subset=fantasy|all|starters&limit=8`
- **Resp**:
```json
{ "suggestions": [ { "id": 97, "name": "Connor McDavid", "league": "nhl", "team": "EDM" } ] }
```

**`POST /api/bk/validate-guess`**
- **Body**:
```json
{ "guess": "Connor McDavid", "mode": "daily|auto|quick", "pool": { "leagues": ["nhl"], "subset": "all" } }
```
- **Resp**:
```json
{
  "match": false,
  "grid": {
    "number": "yellow|green|red",
    "height_in": "yellow",
    "weight_lb": "red",
    "position": "green",
    "league": "green",
    "division": "red",
    "team": "red",
    "conference": "red",
    "hand": "yellow"
  },
  "hint": null
}
```

**`GET /api/bk/daily`**
- **Resp**: `{ "date":"2025-08-17","hash":"opaque-id" }`

**`POST /api/bk/submit`**
- **Body**: `{ "date":"2025-08-17", "guesses": 4, "success": true, "time_ms": 52000 }`
- **Resp**: `{ "ok": true }`

**`POST /api/lobbies`** (create; entitlement checked server-side)
- **Body**: `{ "type":"blackjack", "config": { "maxPlayers":10, "packs":["system:pg13"] } }`
- **Resp**: `{ "code":"A1B2C3" }`

**`POST /api/lobbies/:code/kick`**
- **Body**: `{ "playerId":"uid-or-guest" }` → `{ "ok": true }`

**`POST /api/blackjack/:code/action`**
- **Body**: `{ "action":"bet|hit|stand|double", "value": 5 }`
- **Resp**: `{ "ok": true }` (state changes broadcast via Firestore listener)

**`POST /api/powerhour/:code/start`**
- **Body**: `{ "mode":"powerhour|centurion", "playlist":"default|spotify:playlist:..."}`
- **Resp**: `{ "ok": true }`

**`POST /api/recipes` / `PUT /api/recipes/:id` / `POST /api/recipes/:id/ratings` / `POST /api/recipes/:id/comments`**
- Standard CRUD with Firestore writes; image uploads via signed URL or Firebase client SDK.

**`POST /api/tournaments` / `PUT /api/tournaments/:id`**
- **Body**: tournament config; server validates shape with zod and writes to Firestore.

### 4.2 Cloud Functions (Server-Authoritative)

**`dealBlackjackHand({ code })`**
- Validates lobby `type=blackjack`, `status=in_progress`, phase must be `dealing`.
- Uses stored `deckSeed` or creates one; deals to players; persists to `state.payload` and `events`.

**`resolveBlackjackBets({ code })`**
- Computes winners/losers; updates `drinksOwed`; rotates dealer; `phase=results` → `betting`.

**`submitVote({ code, roundId, choice })`**
- Validates player membership; tallies on server; resolves ties.

**`sendLobbyInvite({ code, toUid[] })`**
- Creates `notifications` and sends FCM messages.

**`onStripeWebhook`** / **`onRevenueCatWebhook`**
- Upserts `entitlements/{uid}` (plan, source, expiresAt).

**`onContentFlagged`**
- Moves item to `moderationQueue`; admin UI consumes.

### 4.3 ETL Service Contracts (Nightly)

**Input**: free APIs for NHL/NBA/MLB/NFL (team rosters, trades).  
**Process**:
- Normalize to `players`, `teams`, `leagues`.
- Compute `starter` & `fantasy_relevant` using heuristic (minutes/games started/recent usage).  
**Output**: Upsert Postgres tables; refresh materialized views if used.

**Schedule**: 03:00 PT nightly (Cloud Scheduler / Vercel Cron).

### 4.4 Lobby and Blackjack Cleanup
**Activity tracking**: every server mutation updates `lobbies/{code}.lastActivityAt`
**TTL Policy**: enable Firestore TTL on `lobbies.lastActivityAt` with 24h expiry -> auto delete stale lobbies
**Cascade Deletion**: Cloud Functino `onLobbyDelete` removes `players, state, events` subcollections to avoid orphan docs.
**Event pruning**: Scheduled CF `purgeOldEvents` deletes `events/*` older than 24h for active lobbies to control growth.

### 4.5 Prescence and Open Connectors
- Client sets `players/{id}.connected=true` and updates `lastSeenAt` heartbeat every 30s.
- CF `markDisconnected` flips `connected=false` if `lastSeenAt` > 90s.
- In UI, always unsubscribe listeners on unmount to avoid open sockets.
- Admin guard: if no connected players and `status != in_progress`, archive lobby early.

### Other TTLs
- `notifications/*`: TTL 90d
- `moderationQueue/*`: resolved items TTL 30d.
- `powerhour` session logs: keep 365d (for stats), then archive to Storage/CSV.

---

## 5) Pages, Screens, and Contracts

### 5.1 Web (Next.js) Routes
- `/` — Home/marketing, CTA to sign up/sign in.
- `/login`, `/register`, `/account` — Firebase Auth UI; account (link Spotify, theme, notifications).
- `/games` — Index of games (gating by entitlements).
- `/games/blackjack` — Create/Join lobby (POST `/api/lobbies`).
- `/games/quiplash`, `/games/most-likely`, `/games/charades` — similar lobby patterns.
- `/powerhour` — Free mode (YouTube 10-min) + paid host Spotify controls.
- `/ball-knowledge` — Modes: Daily, Auto, Quick. Calls `/api/bk/*` endpoints.
- `/recipes` — List (hot/new/top); **GET** Firestore query. `/recipes/:id` detail + comments.
- `/rules` — UGC game posts; similar to recipes.
- `/tournaments` — Create/manage; public view link `/t/:id` (read-only).
- `/admin` — Moderation queue, feature toggles.
- `/privacy`, `/terms`, `/age-regions`, `/404` — static.

### 5.2 Mobile (Expo) Screens
- Auth + Tabs: Home, Games, Powerhour, Recipes, Tournaments, Profile.
- Lobby screens mirror web; push notifications integrated via Expo Notifications → FCM/APNS.

### 5.3 Component & Hook Contracts (examples)

`useLobby(code: string)`
- **In**: `code`
- **Out**: `{ lobby, players[], state, join(), leave(), kick(id), lock(), sendAction(type, payload) }`

`useEntitlement()`
- **Out**: `{ plan, adFree, canCreateLobby, canSpotify }`

`<BlackjackTable state players onAction={(a)=>...} />`
- **Props**: server state object; emits action intents that call server endpoints.

`<PackEditor game="quiplash" packId? />`
- **In**: optional `packId` to edit; otherwise creates new on save.

---

## 6) Game Logic & State Machines

### 6.1 Blackjack (Server-Auth)
States: `waiting → locked → in_progress (betting → dealing → results) → finished`  
- **betting**: clients submit `{action:"bet", value:1..10|"shot"|"shotgun"}`
- **dealing**: CF deals cards; persists hands.
- **results**: CF compares against dealer; computes `drinksOwed`; rotates dealer.

**Deck fairness**: Use seeded RNG; store `deckSeed` in lobby config; every hand append `handIndex` to seed; record in `events` for replay.

### 6.2 Quiplash / MLT
Phases: `prompt_select → answering → voting → tally → round_end`  
- Server guards phase transitions; votes stored with voter id (non-anon).

### 6.3 Charades
Phases: `setup teams → turn(timer) → score → next`  
- Timer + word shown to acting team only (optional privacy).

### 6.4 Powerhour
- Host controls transport; every 60s (or 100 for centurion) advance track and increment timer. Free uses YouTube embed; paid uses Spotify SDK on host device. Presence pings ensure sync UI for viewers.

### 6.5 Ball Knowledge
- Validate guess against current target; return per-attribute match coloring. Track guesses/time. Daily challenge is single global target by date.

---

## 7) Security, Rules, and Rate Limits

### 7.1 Firestore Security Rules (excerpt)
```
// Only host can mutate lobby.state; players can write their own /players doc and /events actions
match /lobbies/{code} {
  allow read: if isMemberOrPublic(code);
  match /state {
    allow read: if isMember(code);
    allow write: if isHost(code); // server usually writes via CF
  }
  match /players/{pid} {
    allow read: if isMember(code);
    allow write: if request.auth.uid == pid || isHost(code);
  }
  match /events/{eid} {
    allow create: if isMember(code) && validEvent(request.resource.data);
    allow read: if isMember(code);
    allow write: if false;
  }
}
// Recipes/GamePosts: owners can edit/delete; everyone can read; comments by authenticated users; moderation flags by any auth user.
```

### 7.2 App Check & Abuse
- Enable **App Check** on web/mobile.
- Cloud Functions validate phased actions, membership, entitlement.
- Basic per-user rate limits (e.g., votes/actions per second).

---

## 8) Payments & Entitlements

### 8.1 Stripe (Web)
- Checkout/Customer Portal.
- **Webhook → CF `onStripeWebhook`** updates `entitlements/{uid}`.

### 8.2 App Stores
- Use **RevenueCat** to unify Apple/Google + web if desired.
- Otherwise: StoreKit / Play Billing client; **server** verifies receipts → updates entitlements.

### 8.3 Gating
- UI checks `entitlements/{uid}`; server re-checks on sensitive endpoints (create lobby, Spotify mode).

---

## 9) Notifications

- **Topics**: `daily-challenge`, per-user tokens, lobby invites.
- **Events**: `dailyChallengeReady`, `friendPlaying`, `lobbyInvite`, `comment`, `like`.
- **Payload (FCM)**:
```json
{ "title": "Daily Challenge", "body": "New player is live.", "data": { "route": "/ball-knowledge/daily" } }
```

---

## 10) Analytics & KPIs

### 10.1 Instrumentation
- Use PostHog for events, plus daily aggregates into Postgres for admin dashboards.
- Core events (actor, properties in {}):
  - `auth_signup`, `auth_login`
  - `lobby_create {type}`, `lobby_join {type}`, `lobby_start {type}`, `lobby_finish {type}`
  - `blackjack_bet {value}`, `blackjack_result {outcome}`, `quiplash_answer`, `vote_cast`
  - `powerhour_start {mode}`, `powerhour_complete`, `powerhour_partial {minutes}`
  - `bk_guess`, `bk_success {guesses, time_ms}`, `bk_streak {streak}`
  - `recipe_create`, `recipe_rate {facets}`, `recipe_comment`
  - `tournament_create {type}`, `tournament_update`
  - Revenue: `subscribe_start`, `subscribe_success {plan}`, `unsubscribe`

### 10.2 Admin Metrics (Dashboard `/admin/metrics`)
- **Account growth**: total users, goal: 100 acounts in first 30 days (page 1,200/year)
- **Games completed** (all games): goal 1,000 completed games in first 30 days (pace 12,000/year)
- **DAU/WAU/MAU**: unique active users (by any event)
- **Retention**: D1/D7/D30 cohort retention
- **Session length**: median & 75th percentile
- **Game popularity** per-game: total plays, unique players, avg players/lobby
- **User activity**: per-user games played, recipes posted, comments, days active
- **Conversion**: free->paid conversion rate; churn
- **Content**: UGC posts, flags, moderation queue size & SLA
- **Topline**: MRR, active subscriptions (from entitlements)

Daily aggregation job (`metrics_daily` in Postgres):
```
sql 
create table metrics_daily (
  day date primary key,
  users_new int,
  games_completed int,
  dau int,
  wau int,
  mau int
)```

Server cron computes and upserts from event stream; dashboard queries this + PostHog API for retention.

---

## 11) Ads (Free Tier Only)
- AdSense placements on: Home, Recipes list/detail, Rules list/detail, Account (non-intrusive).  
- **Never** on full-screen game play or during rounds.

---

## 12) Theming & Accessibility
- Tailwind + CSS variables; paid users can select color scheme/theme.  
- WCAG AA: focus states, readable contrasts, captions/instructions for timers.

---

## 13) Testing Strategy
- Unit: game-engines (deck, outcomes), zod schema validation, ETL transforms.
- Integration: CF hand-deal, vote tally, entitlement webhook.
- E2E: Playwright for web flows (create/join lobby, complete round), Detox for mobile basics.
- Load: Firestore write/read spikes on lobbies (k6 or custom).

---

## 14) Deployment & Environments
- Envs: `dev`, `staging`, `prod`.  
- Vercel projects per env; Firebase projects per env; separate Postgres DBs.  
- CI: Lint, typecheck, test, deploy previews; run migrations with Prisma/Drizzle on deploy.

---

## 15) Roadmap (8 Weeks)

**W1**: Monorepo, Auth, Profiles, Entitlements skeleton, Layout/Theming, basic Ads.  
**W2**: Recipes/Rules CRUD + comments/ratings + moderation queue.  
**W3**: Lobby service (codes, players, events, rules), host controls.  
**W4**: Blackjack engine (server-auth), phases, dealer rotation, drinks owed.  
**W5**: Quiplash/MLT/Charades + packs (system + user) + save/edit.  
**W6**: Powerhour: YouTube free (10-min), Spotify host playback, completion tracking.  
**W7**: Ball Knowledge: Postgres schema, ETL, daily challenge, guess API, leaderboards.  
**W8**: Tournaments (Beer Olympics + Brackets), Stripe + RevenueCat, polish, safety pages, admin.

## 17) Appendix — Type & Schema Snippets

### 17.1 Zod (packages/shared)
```ts
import { z } from "zod";

export const Entitlement = z.object({
  plan: z.enum(["free","monthly","annual"]),
  adFree: z.boolean(),
  source: z.enum(["stripe","apple","google","promo"]),
  expiresAt: z.number().nullable() // ms epoch
});

export const LobbyConfig = z.object({
  maxPlayers: z.number().min(2).max(12),
  deckSeed: z.string().nullable().optional(),
  packs: z.array(z.string()).optional()
});

export const Lobby = z.object({
  code: z.string().length(6),
  type: z.enum(["blackjack","quiplash","mlt","charades","powerhour"]),
  hostUid: z.string(),
  status: z.enum(["waiting","locked","in_progress","finished"]),
  dealerIndex: z.number().optional(),
  createdAt: z.number(),
  config: LobbyConfig
});

export const BKGuessReq = z.object({
  guess: z.string(),
  mode: z.enum(["daily","auto","quick"]),
  pool: z.object({
    leagues: z.array(z.enum(["nhl","nba","mlb","nfl"])),
    subset: z.enum(["fantasy","all","starters"])
  })
});
```

### 17.2 Blackjack Engine (packages/game-engines)
```ts
export type Card = { r: number; s: "H"|"D"|"C"|"S" };
export type Hand = Card[];
export interface DealResult {
  players: Record<string, Hand>; // id -> hand
  dealer: Hand;
}
export interface Outcome {
  results: Record<string, "win"|"lose"|"push">;
  drinksOwed: Record<string, number>;
}
export interface Shoe {
  draw(): Card;
}
```

### 17.3 Firestore Rule Helpers (pseudo)
```js
function isMember(code) { return exists(/databases/(default)/documents/lobbies/$(code)/players/$(request.auth.uid)); }
function isHost(code) { return get(/databases/(default)/documents/lobbies/$(code)).data.hostUid == request.auth.uid; }
```

---

## 18) Success Criteria & KPIs
- D7 retention ≥ 20% (party games cohort)
- Avg session ≥ 10 minutes
- ≥ 30% of lobbies reach round completion
- Free→Paid conversion ≥ 2–5% after 30 days
- Moderation SLA ≤ 24h

---

## 19) Risks & Mitigations
- **Data feed brittleness** → abstract ETL adapters; cache last-good roster.
- **Store billing complexity** → RevenueCat.
- **Realtime costs** → batch writes, coarse-grained `state` doc updates, presence pings, limit lobby sizes.
- **Moderation load** → rate-limit posts/comments, auto-filters, community flags threshold.

---

## 20) Ball Knowledge Autocomplete Details

### 20.1 Query Logic
- Normalize search: lowercase + unaccent
- Match if q is a prefix of first of last token or trigram-similar to full name.
- Filter by leagues and subset (join player_flags for starter/fantasy relevant)
- Limit 8 suggestions

### 20.2 Eample SQL (Supabase RPC)

```
sql
create or replace function search_players(q text, leagues text[], subset text, lim int default 8)
returns table(id bigint, name text, league text, team text) language sql stable as $$
  with pool as (
    select s.*
    from v_players_search s
    join leagues l on l.key = s.league
    left join player_flags pf on pf.player_id = s.id
    where (array_length(leagues,1) is null or s.league = any(leagues))
      and (
        subset = 'all' or
        (subset = 'starters' and coalesce(pf.starter,false)) or
        (subset = 'fantasy' and coalesce(pf.fantasy_relevant,false))
      )
  )
  select id, name, league, team
  from pool
  where name_norm like unaccent(lower(q)) || '%'
     or first_norm like unaccent(lower(q)) || '%'
     or last_norm like unaccent(lower(q)) || '%'
     or similarity(name_norm, unaccent(lower(q))) > 0.4
  order by
     (name_norm like unaccent(lower(q)) || '%') desc,
     similarity(name_norm, unaccent(lower(q))) desc,
     name asc
  limit lim;
$$;
```

### 20.3 API Contract

- `GET /api/bk/search?q=leon&leagues=nhl&subset=fantasy&limit=8` -> suggestions array.
- Use Supabase JS client `rpc('search_players', { q, leagues, subset, lim }) on the server`

### 21 Glossary

SLA — service level agreement: your internal promise for response times (e.g., moderation in ≤24h).

D7 retention — % of new users who come back 7 days after signup. (Similarly D1/D30.)

E2E — end-to-end tests that simulate a real user flow across the whole system.

CF — Cloud Functions (Firebase server code).

k6 — a load-testing tool; we can also use a simple Node script to simulate users.

WCAG AA — web accessibility standards (readable colors, keyboard navigation).

FCM — Firebase Cloud Messaging (push notifications).

APNS — Apple Push Notification service (iOS).

zod — a TypeScript schema/validation library to validate inputs.

UGC — user-generated content (recipes, rules posts).
