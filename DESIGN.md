# Tofu Driver Design

This file is the product canon and design philosophy for Tofu Driver. It intentionally avoids being
an implementation changelog or balance sheet.

For implementation evidence, use `IMPLEMENTATION_STATUS.md`.
For economy and progression pacing, use `BALANCE_AND_PROGRESSION.md`.
For tactical next steps, use `PLAN.md`.

## Current Canon

Tofu Driver is the overall app and brand.

The product has three main player-facing surfaces:

- `Don't Spill the Cup` / `The Cup Test`: the smooth-driving challenge and iconic first visitor
  experience.
- `Tofu Shop`: the parked-only idle/incremental management game and base progression layer.
- `Delivery Crew`: the parked cosmetic/audio/collection surface.

Supporting concepts:

- `Delivery Log` / `Ledger`: local result history and summarized event record. It is not a separate
  competing game layer.
- `No-Spill Club`: rank, community/status tier, and merch tier.
- `Perfect Pour`: top achievement for qualified smooth-driving results.

Canonical hierarchy:

1. Tofu Driver is the brand and app.
2. Don't Spill the Cup is the default visitor-facing challenge.
3. Tofu Shop is the home progression game.
4. Delivery Crew is a collection/customization surface.
5. Delivery Log / Ledger records what happened.

## Product Surfaces

The current static app uses hash routes:

- root/no hash defaults to `#/cup-test`
- `#/cup-test` shows `Don't Spill the Cup`
- `#/shop` shows `Tofu Shop`
- `#/crew` shows `Delivery Crew` when relevant

Default visitor behavior:

- The first page is `Don't Spill the Cup`.
- Cup page primary CTA: `Take the Cup Test`.
- Cup page secondary CTA: visit or start the Tofu Shop.
- Tofu Shop page primary CTA: the current shop loop, such as `Fulfill Shop Order` or the next shop
  action.
- Delivery Crew is reachable when character/sound systems are relevant.

This resolves the older tension between "the shop is the base game" and "the cup challenge is the
default page": the Cup Test is the iconic first surface, while Tofu Shop is the base parked
progression layer.

## Safety And Privacy Contract

These rules are authoritative for all current and future features:

- Reward smoothness, not speed.
- Higher speed must never improve score, XP, rank, stamps, shop resources, shop boosts, merch
  progress, unlocks, or share output.
- Do not show live speed as a performance metric.
- Do not add speed leaderboards, route leaderboards, public road competition, fastest-route copy,
  `beat the clock`, `drive faster`, `find a twisty road`, or high-G bragging.
- Do not encourage looking at the screen while driving.
- Do not show shop, crew, sound, upgrade, reward-claiming, or social actions during an active drive.
- Basic Mode must not request location.
- Qualified Run Mode may request location only after explicit opt-in/start.
- Do not upload raw motion, raw GPS, route traces, coordinates, maps, street names, speed logs, or
  license plates by default.
- Keep the current MVP local-first and static-browser friendly.
- Do not add accounts, backend sync, analytics, payments, ads, service workers, uploads, or network
  calls unless a future request explicitly changes scope.
- Do not make safety certification, insurance, legal compliance, or real-world driving protection
  claims.

Qualified Run Mode may use summarized route validation only to decide whether a run qualifies. It
must remain validation-only and must not become a performance/reward signal.

## Local Storage And Runtime

Current local storage keys:

- `nospill.club.v1`: legacy/current Cup Test summary preferences and related local state.
- `tofuDriverGameStateV1`: local Tofu Shop, progression, collection, stamp, and summarized session
  state.
- `tofuDriverSimulatorEnabled`: local QA simulator gate.
- `tofuDriverDevToolsEnabled`: local developer-tools gate.

Stored game state must remain summarized. It may include resources, stamps, unlocks, shop levels,
coarse route/mastery summaries, and saved result summaries. It must not include raw GPS samples, raw
motion samples, speed logs, route traces, maps, coordinates, or street names.

The app should remain usable as static HTML/CSS/JavaScript. Current implementation uses vanilla
browser APIs.

## Progressive Reveal

Progressive reveal is canon:

> First-time users get mystery and one clear action.
> Returning users get the dashboard they earned.

The first experience should not dump every system. It should establish:

- the brand
- the cup premise
- one clear action
- one clear outcome
- minimal safety copy

Current first visitor page is Don't Spill the Cup. It can point to Tofu Shop as an optional parked
game, but it should not make a new user parse every shop, crew, passport, merch, settings, and
future system at once.

Each major system should have three visibility states:

- hidden
- newly discovered
- active dashboard card or panel

Progressive reveal should reduce decision confusion, not merely hide content. The user should
always have one obvious next step.

## Tofu Shop Design Direction

Tofu Shop is the parked-only idle/incremental management game. It should be playable at home without
sensors or location.

Design stance:

> Tofu Shop is a one-loop incremental game that earns the right to unfold.

Current core loop target:

```text
Tofu Stock -> Delivery Orders -> Fulfill Shop Order -> Tips -> Upgrade -> First Stamp
```

The loop should become fun before deeper systems are expanded.

Current design principles:

- first-time users should not see every system
- returning users should see the dashboard they earned
- progression should be bumpy and story-driven, not a flat generator list
- Tofu Press produces Tofu Stock over elapsed time.
- Prep Counter consumes Tofu Stock and produces Delivery Orders.
- Fulfill Shop Order consumes Delivery Orders and grants Tips, Reputation, and XP.
- Tips buy more production, stations, and upgrades.
- The early UI must teach that Tips come from fulfilled shop orders.
- Pack Tofu is a backup/manual Tofu Stock action, not the main money action.
- Don't Spill the Cup is an optional certified boost and should not override normal shop
  bottleneck recommendations when Delivery Orders are ready or Tips are needed.
- Reputation opens new shop systems.
- XP/levels provide visible progress.
- Offline progress is capped and summarized.
- Production is displayed per second.
- Buttons must be honest: wired and responsive, disabled with a reason, or hidden.

Advanced shop systems already exist as broad scaffolding or partial systems. They should not
dominate the first session until the core loop is paced and understandable:

- fictional Routes
- Training
- Garage
- Crew automation
- Shop Spirit boosts
- Festival Boosts
- License Exams
- Rival Shop Challenges
- expanded Passport
- Delivery Ledger

The current MVP loop remains the priority. Routes, Crew, Garage, Shop Spirit, Rivals, and License
are later-phase systems until the core loop feels good. Use `BALANCE_AND_PROGRESSION.md` for
pacing, formulas, sources/sinks, upgrade ladders, button inventories, unresolved balance questions,
and implementation audit.

## Don't Spill The Cup Integration

Don't Spill the Cup is always available. It must not require:

- Tofu Stock
- Delivery Orders
- Tips
- upgrades
- routes
- accounts
- shop progress

Cup Test results can affect Tofu Shop as optional certified boosts:

- bonus Reputation
- bonus Tofu Stock
- bonus Tips
- temporary shop production boost
- certified stamps
- certified merch progress
- special delivery report

Boosts must depend on Cargo Condition, qualification status, daily/repeat caps, and safe summarized
criteria. They must not depend positively on speed, exact distance, route risk, street names, maps,
high-G events, or any signal that encourages risky driving.

Practice Mode may grant modest local progress but must not grant qualified-only ranks, Perfect Pour,
No-Spill Club merch progress, or trusted certified progress.

Simulator/dev results are local QA only and are not trusted certified proof.

## Delivery Crew And Collection

Delivery Crew is a parked collection/customization surface.

Character unlocks and sound packs are cosmetic, narrative, and UI/audio flavor. They may personalize
the shop, crew surface, result screens, or safe share-card flavor. They must not:

- improve real-world driving score
- improve route qualification
- reward speed
- require risky driving
- play distracting reward sounds during active drive

Muted mode must mute cosmetic sounds. Active-drive audio coach remains separate and user-controlled.

## Delivery Log And Ledger

Delivery Log / Ledger records summarized events:

- Cup Test result summaries
- Shop order completions
- purchases
- offline progress
- stamps
- unlocks
- fictional route/card outcomes

It is supporting history, not the primary game surface. The primary game surfaces are Don't Spill
the Cup, Tofu Shop, and Delivery Crew.

Ledger entries should answer:

- what happened
- what changed
- what unlocked
- what bottleneck remains
- what the next best action might be

Ledger storage should be capped to avoid unbounded localStorage growth.

## Sharing, Merch, And Community

Default share output may include:

- Tofu Driver
- Delivery Complete / Practice Complete / Simulated Delivery labels
- Cargo Condition
- Rank
- Driver License
- Shop Level
- selected crew flavor when safe
- stamp earned
- `Not faster. Smoother.`

Default share output must not include:

- speed
- average speed
- top speed
- GPS
- location
- coordinates
- map
- route trace
- street name
- exact distance by default
- fastest time
- high-G bragging
- `cavrino.com/nospill`
- Super Cute Collectibles links by default
- Discord invite links by default

Super Cute Collectibles is the current physical merch fulfillment partner. It does not verify scores
in the current MVP. Future backend unlock tokens, if built, must verify only summarized unlock state
and must reject simulator/dev/local-only proof.

Discord/community links are optional parked-use CTAs. They must be hidden by default unless
configured, never shown during active drive, and never framed as a place to report, identify, shame,
or accuse drivers.

## Ethical Monetization And Social Status

Monetization is future direction only. Payments, accounts, ads, public profiles, backend merch
verification, and Discord integrations are not implemented as default app behavior.

Ethical monetization rule:

> Players may pay to express identity, support the project, decorate their shop/profile, or claim
> earned physical merch. Players must not pay to bypass the meaning of smooth-driving achievements.

Acceptable future monetization:

- earned No-Spill Club or Perfect Pour merch after unlock
- alternate character skins
- cosmetic shop themes
- sound packs
- share-card frames
- supporter badges
- convention/event cosmetic stamps
- physical merch fulfilled by Super Cute Collectibles

Avoid:

- pay-to-progress
- time skips
- paid score, speed, XP, qualification, or route advantages
- fake stamps
- loot boxes
- premium currencies designed to obscure spending
- FOMO pressure
- energy systems that block normal use
- intrusive ads, especially during active driving

Social status should come from privacy-safe proof and identity:

- Delivery Complete cards
- Passport stamps
- earned merch unlocks
- shop level
- character collection
- No-Spill Club progress
- Perfect Pour achievement

Social status must not be about speed, exact routes, maps, GPS traces, street names, public road
competition, or shaming other drivers.

## Future Direction

Future ideas are valuable but are not current implementation requirements unless also listed as
implemented in `IMPLEMENTATION_STATUS.md`.

Long-arc inspiration:

1. The Dark Garage: one quiet scene, the cup is full, one action.
2. The Tofu Shop: the first management layer.
3. Fictional Route Network: atmospheric route cards that are explicitly game content.
4. Delivery Network Expansion: apprentices, dispatchers, prep staff, route scouts.
5. License Prestige: License Exams and permanent License Stars.
6. Legendary Final Delivery: endgame fantasy as perfect control, not speed.

Future shop/incremental ideas:

- richer fictional route map
- timed route queues
- apprentice auto-driver assignments
- deeper crew automation
- named customers
- delivery reports and rumors
- more shop generators
- fuller Passport categories
- multiple License Exams
- License Perks
- convention/event stamps
- optional privacy-safe profile/showcase surfaces
- Delivery Chronicle

Safety translation rule:

Fictional speed fantasy may exist only as stylized story flavor inside the idle layer and must never
become a real-world instruction, metric, reward, or shareable status. Prefer terms like Delivery
Trial, License Exam, Route Mastery, Smoothness Trial, Rival Shop Challenge, Festival Order, and
Perfect Pour Trial. Avoid street race, drift battle, beat the clock, fastest route, high-speed run,
attack the pass, no-brake challenge, and similar copy.

Future backend scope, if ever requested, must remain privacy-first:

- no raw GPS upload by default
- no raw motion upload by default
- no speed-based status
- no public road leaderboards
- no driver shaming/reporting system
- no license plate collection
- no in-drive social interaction

## Deprecated / Older Direction

These older framings should not guide new work:

- Treating Delivery Log as the primary game layer. It is a history/ledger support layer.
- Treating Tofu Shop as the default visitor-facing page. The default route is Don't Spill the Cup.
- Showing large visible shelves for Delivery Wall, Shop Unlocks, or Certified Delivery Unlocks.
  Unlocks should be discovered through results, Passport, and subtle status.
- Presenting every future idle system on first load.
- Calling implemented scaffolding complete just because a card, tab, or button exists.
- Any route, mountain, rival, speed, or challenge copy that could be read as an instruction for
  real-world road behavior.

## Current Source And Validation

Current source files still use the legacy path:

- `frontend/nospill/index.html`
- `frontend/nospill/app.css`
- `frontend/nospill/app.js`
- `test_frontend_nospill.js`

Validation commands:

```bash
node --check frontend/nospill/app.js
node --check test_frontend_nospill.js
node test_frontend_nospill.js
make check
git diff --check
```
