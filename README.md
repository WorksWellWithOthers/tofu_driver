# Tofu Driver

Tofu Driver is a static browser app with two connected experiences:

- `Don't Spill the Cup`: the default smooth-driving challenge.
- `Tofu Garage`: a parked-only idle/incremental game mode whose first business is the Tofu Shop.

The Cup Test can provide optional certified smooth-delivery boosts for the shop, but ordinary Tofu
Garage progression is playable at home without sensors or location.

The product split is intentional. `Don't Spill the Cup` keeps the strict real-world safety/privacy
contract. `Tofu Garage` is the fictional standalone idle/tuning/garage-management game and may use
authentic tuning vocabulary for game systems. The canonical future parts source is
`TOFU_GARAGE_TUNING_CATALOG.md`; garage parts must never alter Cup Test scoring, certification,
route-context proof, Driver XP, or real-driving rewards.

Cup-first visitors can reach Tofu Garage from the landing page and from parked Cup Test results.
Cup Test result cards include safe local summaries such as Cargo Type, Trip Time, Drive Shape,
Route Smoothness Outline when usable local route data exists, Abstract Cup Trail as the
privacy/fallback view, Daily Delivery Credit, concise Coach Recap labels, local Cargo Commentary,
Result Card, and optional player Story Captions. These are derived from summarized motion and
normalized route shape only and must not expose speed, distance, GPS coordinates, maps, street
names, raw route traces, or racing/performance-driving technique. Tapping `Start Cup Test` attempts
certification automatically: usable local route data can produce a Certified Result, while denied or
insufficient location produces a Local Result. Local results with route data may still show a local
route outline, but route display does not imply certification. Sharing/downloading a route-outline
card requires the post-run privacy warning, and copied text never includes route points,
coordinates, street names, speed, or map data.

Tofu Shop, the first Tofu Garage business, starts with a focused first loop and reveals depth over
time. The first Passport stamp uses a local Stamp Fanfare, and the first meaningful hidden shop
system uses a local Discovery Fanfare so progression moments are visible without exposing the full
future roadmap. Midgame supply pressure is handled through parked management decisions such as
Counter Service batch upgrades and Reputation-funded Supplier Contracts, not faster clicking.
Late-game Cash conversion uses Reputation-funded Counter Contracts to unlock Wholesale Case, Event
Catering Load, and Venue Supply Contract handoffs with larger Counter Service batch floors. Shop
Spirit includes capped permanent Spirit Generators, Activate-style instant boosts, and a parked
`Buy All Affordable` control for permanent Spirit Generators only; it does not trigger instant
boosts, timed effects, tokens, driving rewards, or networked systems.

Hidden merch is local-only in the MVP. Stickers are the first hidden reward tier: the Tofu Driver
`Not Fast. Smooth.` Sticker unlocks from a first Certified Result, and the Tofu Driver Penguin
Sticker unlocks from a Certified Result with an unlocked Penguin mascot selected. Shirts are the
larger tier: the Tofu Driver `Not Fast. Smooth.` Tee unlocks from a Certified Perfect Pour or
route-context Perfect Pour achievement, and the Tofu Driver Penguin Delivery White Tee unlocks from
a Certified Result with an unlocked Penguin mascot selected. The app does not run payments, call Shopify APIs,
verify unlocks with a backend, append GPS/route/speed data to merch URLs, or open external merch
links automatically.

## Privacy And Safety Stance

- No backend is required for the current MVP.
- No account system.
- No payment flow.
- Optional PostHog product analytics is disabled unless configured.
- PostHog autocapture and session recording are disabled by default.
- No upload of raw motion or GPS samples.
- No upload of route traces, maps, street names, coordinates, or speed logs.
- No automatic route outline sharing; optional Certified Result route-outline cards are post-run and
  user-selected only.
- Location may be requested only after `Start Cup Test` to attempt certification.
- Denying location does not block play; the run becomes a Local Result.
- Scoring and rewards prioritize smoothness, not speed.
- Shop, crew, sound, upgrade, and reward actions are parked-only.

## Optional Analytics

PostHog analytics is configured through runtime settings and no-ops when disabled or missing a key.
The browser project key is public configuration, but real keys should not be committed.

Runtime config:

- `TOFU_DRIVER_POSTHOG_ENABLED`
- `TOFU_DRIVER_POSTHOG_KEY`
- `TOFU_DRIVER_POSTHOG_HOST`
- `TOFU_DRIVER_POSTHOG_DEBUG`

Local opt-out:

```js
localStorage.setItem("tofuDriverAnalyticsOptOut", "true")
```

Tracked events are product-scoped with the `tofu_driver_` prefix and use safe categories or buckets:
route views, Cup Test start/completion, shop order fulfillment, station/upgrade purchases, share
attempts, offline progress seen, simulator/dev events, and progress-tool clicks. Analytics must
never send raw GPS, raw motion, speed, acceleration vectors, route traces, maps, street names,
coordinates, exact distance, localStorage dumps, save files, share-card contents, or user-entered
personal information.

Sticker/QR links may include sanitized attribution params:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `td_source`
- `td_campaign`

## App Routes

The static app uses hash routing:

- root/no hash defaults to `#/cup-test`
- `#/cup-test`: Don't Spill the Cup
- `#/shop`: Tofu Garage
- `#/garage`: Tofu Garage alias; `#/shop` remains supported
- `#/crew`: Delivery Crew parked placeholder/collection controls

## Project Layout

- `frontend/nospill/index.html`: app shell
- `frontend/nospill/app.css`: app styling
- `frontend/nospill/app.js`: motion, scoring, shop, sharing, and local storage logic
- `frontend/nospill/runtime-config.js`: disabled default runtime config for optional analytics
- `frontend/nospill/images/`: runtime raster images
- `test_frontend_nospill.js`: Node-based frontend behavior checks
- `CHARACTER_ART_ASSET_INVENTORY.md`: parked-only character art slot inventory, placeholder rules,
  and integrated Mika MVP asset-pack paths
- `TOFU_SHOP_LIVING_SCENE_ASSET_SPEC.md`: parked-only full-scene Tofu Shop artwork variants,
  placeholder behavior, and MVP scene-art recommendation
- `TOFU_GARAGE_PERFORMANCE_AUDIT.md`: high-scale idle-game performance audit covering scalar
  resources, compact formatting, coalesced rendering, aggregate offline progress, queue/history
  caps, and the deferred BigNumber/mantissa-exponent strategy
- `TOFU_GARAGE_UNFOLD_AUDIT.md`: meaningful-unfold audit for current Tofu Garage resources,
  bulk-buy quality-of-life rules, affordability progress, and deferred/future system boundaries
- `TOFU_GARAGE_V1_COMPLETION_AUDIT.md`: readiness audit for whether Tofu Garage V1 can move toward
  the parked Covered Car / Dream Build teaser
- `TOFU_DRIVER_TOY_SIMULATION_AUDIT.md`: toy-first, player-expression, failure, needs/maintenance,
  discovery, black-box, and probability design audit. Result Story Caption V1, Failure Flavor V1,
  Result Card Visual Polish V1, and Garage Pride / Builder Note V1 are now implemented as
  local-only story/expression tools; broader comic/simulation systems remain future.
- `DESIGN.md`: current product canon, safety/privacy contract, future direction
- `BALANCE_AND_PROGRESSION.md`: implementation reference for Tofu Shop economy, pacing, buttons,
  resources, generators, upgrades, reveal order, bottlenecks, prestige, future Dream Garage /
  Project Car progression, future Net Worth endgame direction, and balance tests. Tofu Shop is
  idle-first: manual actions teach the loop, repeated labor earns automation exits, and decisions
  rather than clicking speed drive progression.
- Tofu Garage Overview uses Glance Mode V1: Now, stable Pinned Goal, Era Goal, one compact
  operational card, one compact build-status card, and Recent/While Away feedback. Long
  explanations/formulas sit behind keyed Details that stay open across live ticks, saved Builder
  Notes collapse until edited, and detailed Dream Build work moves into the earned Dream Build tab.
  Action Choice Board V1 adds compact next-choice cards for Cash Conversion, Dream Build progress,
  and contextual Ledger activity; Dream Build no longer shows shop/offline footer logs. The
  Suspension
  track is implemented through Showcase Stance; Tires & Rubber, Brakes & Control, Induction &
  Cooling, Drivetrain & Transmission, and Aero/Styling/Weight Reduction are implemented through
  their Level 5 completions; Final Detail and Shakedown Complete now finish the first core build at
  `40 / 40`; Garage Event Board V1 adds one-time parked fictional events after `$100M Net Worth`
  plus Tires Level 5; Car Management V1 unlocks after First Complete Build with one active parked
  assignment at a time for Showcase Rotation, Sponsor Demo Day, and Closed-Course Exhibition
  Booking. Assignment cards show concrete costs/rewards, active/ready states, a first-loop
  checklist, and capped recent history. Second Bay V1 opens after the first assignment loop and
  Garage Reputation threshold, then lets the player acquire a Second Project Car shell as a
  future-track target. Second Car Identity / Build Direction V1 adds locked Showcase, Track, Drift,
  Rally, and Restoration direction choices after shell acquisition without economy or Cup Test
  effects. Multiple active cars, auctions, collector offers, backend, uploads, and network calls
  remain future.
- `FIRST_LOOP_AUDIT.md`: current first-loop playtest audit and recommended next implementation
  slice for meaningful early upgrades and reveal timing
- `CORE_GAME_SPINE_AUDIT.md`: evidence audit for what is real versus scaffolding in the current
  Tofu Shop spine, plus the V1 implementation slice boundaries
- `EXTERNAL_REFERENCE_DOPEWARS_AUDIT.md`: read-only external mechanics study translated into
  future-safe Tofu Driver shop/garage concepts; not implemented behavior
- `EXTERNAL_REFERENCE_ANTIMATTER_DIMENSIONS_AUDIT.md`: read-only progression-architecture study
  translated into future-safe Tofu Shop milestone, automation, stamp, challenge, and prestige
  concepts; not implemented behavior
- `EXTERNAL_REFERENCE_INCREMENTAL_GAME_DESIGN_TRANSCRIPTS_AUDIT.md`: transcript synthesis of
  incremental-game design lessons translated into future-safe Tofu Shop pacing, automation, novelty,
  UI restraint, and resource-sink guidance; not implemented behavior
  Raw transcript files are local source inputs and are not committed by default.
- `IMPLEMENTATION_STATUS.md`: what is actually implemented, partial, placeholder, decorative,
  documented only, or non-goal, with file/test evidence
- `PLAN.md`: tactical next steps, questions, and non-goals
- `DEPLOYMENT.md`: hosting/deploy instructions
- `Dockerfile`, `nginx.conf`, `Makefile`: static container/deploy support

## Local Checks

```bash
make check
```

Equivalent explicit checks:

```bash
node --check frontend/nospill/app.js
node --check test_frontend_nospill.js
node test_frontend_nospill.js
```

Frontend test runner helpers:

```bash
TEST_GREP=NetWorthMilestones node test_frontend_nospill.js
TEST_TRACE_CONTEXT=1 TEST_GREP=NetWorthMilestones node test_frontend_nospill.js
```

The runner prints per-test progress and fails at the first failing test. `TEST_GREP` runs matching
test names, and `TEST_TRACE_CONTEXT=1` enables extra timing diagnostics for instrumented slow paths.

Open `frontend/nospill/index.html` in a browser for static inspection. Device motion behavior needs
a real mobile browser over HTTPS for full testing.

Mobile motion troubleshooting:

- iOS Safari may require a user gesture before motion permission can be requested. Tap
  `Start Cup Test`; do not expect permission prompts on page load. The app requests motion
  permission before starting optional audio so the tap gesture is preserved for Safari.
- Don’t Spill the Cup requires HTTPS for motion sensors, except local development contexts such as
  `localhost`.
- Permission denied, insecure HTTP, true unsupported browsers, and “permission granted but no
  sensor data yet” are separate states with separate copy.

## Local QA Modes

Production Simulation Mode is not exposed. `?simulator=1` and `tofuDriverSimulatorEnabled` do not
enable a player-facing simulator panel. Deterministic simulator helpers remain in tests only and are
not trusted certified proof or merch verification.

Append `?dev=1` or set `tofuDriverDevToolsEnabled=true` in localStorage to expose local developer
tools. Developer QA state is local-only and not trusted certified proof.

## Deploy

```bash
make prod
```
