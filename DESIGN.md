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
- Cup result screens can include a small parked CTA back to Tofu Shop so Cup-first visitors discover
  the home progression loop without interrupting active driving.
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
  license plates.
- Keep the current MVP local-first and static-browser friendly.
- Optional product analytics may be enabled only through explicit PostHog runtime config. Analytics
  must use safe events, coarse buckets, and route/view categories only; it must never weaken the
  safety/privacy contract.
- Do not add accounts, backend sync, payments, ads, service workers, uploads, or network calls
  beyond explicitly configured PostHog analytics.
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

## Analytics Contract

Tofu Driver may use optional PostHog analytics to understand whether visitors reach the Cup Test,
start runs, visit Tofu Shop, complete the first shop loop, return later, use sticker/QR links, or
share results.

Analytics rules:

- disabled by default unless `TOFU_DRIVER_POSTHOG_ENABLED` and `TOFU_DRIVER_POSTHOG_KEY` are set
- no-op if disabled, missing a key, blocked, or locally opted out
- local opt-out flag: `tofuDriverAnalyticsOptOut=true`
- event names use the `tofu_driver_` prefix
- autocapture and session recording are disabled
- page/route views are tracked manually
- campaign attribution is limited to sanitized `utm_*`, `td_source`, and `td_campaign` values
- active-drive telemetry is never tracked

Allowed analytics properties are coarse and product-safe: view name, mode category, simulator flag,
qualification status, cargo condition bucket, visible rank label, shop level, coarse resource
buckets, order type id, station/upgrade ids, first-loop booleans, share type, result type, and
sanitized campaign values.

Never send raw GPS samples, raw motion samples, acceleration vectors, G-force streams, speed, speed
history, top speed, average speed, exact distance, coordinates, maps, route traces, street names,
location names, license plates, raw localStorage dumps, exported save files, share-card image
contents, sensor diagnostics, or mount calibration raw values.

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

Newly discovered tabs should use explicit labels such as `New`, not unexplained outlines. Soft glow
can support the moment, but focus styling must remain distinct and the new-tab label should clear
after the player views the system.

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

Current design target is not a broad system dump. Tofu Shop should first feel like a clear,
state-based production loop; the larger dashboard is earned as the player reaches new bottlenecks.

Current design principles:

- first-time users should not see every system
- returning users should see the dashboard they earned
- progression should be bumpy and story-driven, not a flat generator list
- Tofu Shop borrows the structure of cascading incremental games, but translates it into shop
  stations, prepared orders, fictional route cards, License Exams, and cozy delivery-management
  language.
- External progression references may inform this cascade, but only after translation into Tofu
  Driver language. The Antimatter Dimensions audit is useful for next-milestone bars, station
  milestone boosts, visible locked prestige goals, automation-after-mastery, safe shop trials, and
  prestige pacing; it is not a source for theme, formulas, UI, names, or implementation details.
- The incremental design transcript audit reinforces four durable rules: make the first five
  minutes obvious, balance active play with idle progress, delegate repeated chores only after
  mastery, and add novelty through earned shop layers rather than early UI clutter.
- Raw external transcripts and reference notes are source material, not product canon. Keep durable
  design takeaways in audit files and translate every idea into Tofu Driver language before it
  reaches player-facing copy.
- each new mechanic should solve a visible bottleneck or create a clear story beat
- Tofu Press produces Tofu Stock over elapsed time.
- Prep Counter consumes Tofu Stock and produces Delivery Orders.
- Delivery Orders may be fractional internally, but UI should show ready orders plus a Prep Counter
  progress bar, supporting percentage, and ETA rather than a raw decimal.
- Prep Counter progress should pause when Tofu Stock is insufficient, and should not jump backward
  unless a ready order is completed.
- Tofu Stock is an ingredient/runway resource, not the purchase currency. The UI should explain how
  many orders current stock can support.
- Larger shop order types can consume more Tofu Stock and ready Delivery Orders for better local
  Tips/Reputation/XP rewards. This order-size ladder is the intended bridge between stockpiles and
  higher payouts. Raw Tofu Stock should not directly multiply Tips.
- The current implemented order ladder is Simple Tofu Box, Family Tofu Tray, and Festival Bento.
  The current first-loop stock costs are 6, 24, and 75 Tofu Stock respectively, so stock pressure
  appears early and larger order types become the main stock sink.
  Catering Crate and larger network orders are future/hidden until the core loop and first-shop
  pacing are proven.
- Core Game Spine V1 adds the first short milestone ladder after the first stamp: First Upgrade
  Purchased, First Family Tofu Tray, First 10 Orders, and First 100 Tips. Delivery Shelf is the
  first throughput support station, and Shop Sign is the first Reputation support station.
- Counter Service V1 is the first earned automation layer: after First 10 Orders, regular customers
  can pick up prepared orders automatically while the page is open and the player is parked.
- Counter Service should display its useful rate or blocked state honestly. If it is supplied and
  running, shop income can include a `Tips/min when supplied` line; if it lacks stock or ready
  orders, the UI should say what is missing rather than showing a misleading zero.
- Shop Spirit actions should use action-specific language: generators use `Buy`, instant actions use
  `Spend Spirit`, timed effects use `Start Effect` or a specific effect name, and tokens use
  `Use Token`. Route-related Spirit actions stay hidden until fictional route systems matter.
- Regular Customers, Routes, full Dream Garage, Shop Spirit, Rivals, and License prestige remain
  deferred until Counter Service and the V1 spine have been playtested and tuned.
- New active decisions should replace automated chores. When Counter Service removes repeated order
  handoffs, the next decisions should be stock supply, service rate, larger orders, or later support
  stations, not more mandatory clicking.
- Fulfill Shop Order requires at least one ready Delivery Order.
- Fulfill Shop Order consumes Delivery Orders and grants Tips, Reputation, and XP.
- Tips buy more production, stations, and upgrades.
- The early UI must teach that Tips come from fulfilled shop orders.
- Pack Tofu is a backup/manual Tofu Stock action, not the main money action.
- Recommendations should follow the current bottleneck: promote Tofu Press when stock is low, but
  promote Prep Counter, order prep, or Tidy Packaging when stock is plentiful and orders are slow.
- Early upgrades must solve a bottleneck the player has already felt. Do not make the Upgrades
  panel prominent when it only contains locked, irrelevant, or non-actionable cards.
- Tidy Packaging is the preferred first named upgrade when Prep Counter throughput is the felt
  bottleneck. Steady Pressing is a stock-runway upgrade and should not be recommended while stock is
  already healthy.
- Early upgrade cards should show before/after impact, such as a better order-prep cadence or
  higher stock/sec, before asking the player to spend Tips.
- Overview is the main first-loop play surface. It should include the current bottleneck, the next
  best action, ready orders, Prep Counter progress, the best available order card, and one relevant
  station or upgrade. A new player should not need to open Orders to understand or play the first
  loop.
- The first Passport stamp should be a Stamp Fanfare moment. The celebration is local-only,
  repeat-suppressed per stamp, accessible, and parked/result-screen only. It must never interrupt an
  active Cup Test, and it should respect reduced-motion and audio settings.
- The first hidden shop system should use a Discovery Fanfare. Upgrades are the first system reveal
  when a meaningful bottleneck-solving upgrade appears. System reveals are local-only,
  repeat-suppressed per system id, and should create curiosity without listing the future roadmap.
- After an early meaningful milestone, the shop may show one restrained covered-car story teaser:
  `Behind the shop, an old car waits under a cover.` This is a purpose hint only, not Dream Garage
  implementation.
- Detailed tabs are earned. The Orders tab is removed from the first-loop shop because Overview
  owns order cards, Prep Counter progress, reward previews, and fulfillment actions. Production
  should focus on station ownership, and Upgrades should appear only when at least one relevant
  upgrade is visible or close.
- Tab panels are scoped. Passport, Ledger, and Settings should not append the Production or
  Upgrades controls; station buying belongs in Production and upgrade buying belongs in Upgrades.
- Normal parked shop-order fulfillment is inline and non-interrupting. Full result screens are for
  Cup Test runs and major fanfare moments such as the first Passport stamp.
- Don't Spill the Cup is an optional certified boost and should not override normal shop
  bottleneck recommendations when Delivery Orders are ready, an order is being prepared, or Tips
  are needed.
- Reputation opens new shop systems.
- XP/levels provide visible progress.
- Offline progress is capped and summarized.
- Production is displayed per second.
- Large player-facing shop values use compact incremental formatting; internal resource values
  remain exact.
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
are later-phase systems until the core loop feels good. These systems should unlock from meaningful
milestones such as first upgrades, larger orders, station purchases, route story beats, or repeated
chores, not from raw idle currency accumulation alone. Use `BALANCE_AND_PROGRESSION.md` for pacing,
formulas, sources/sinks, upgrade ladders, button inventories, unresolved balance questions, and
implementation audit.

## Dream Garage / Project Car Fantasy

Dream Garage is a future long-term emotional progression layer:

```text
Tofu Shop funds the dream car.
The shop is the grind.
The garage is the dream.
The Cup Test proves that smooth control matters more than speed.
```

North star:

```text
Tofu Driver is about working ordinary shifts to build something you love, then proving that smooth
control matters more than speed.
```

The Tofu Shop upgrade loop stays intact. Dream Garage should run in parallel later:

```text
Work shop orders -> earn Tips -> reinvest in shop or save for parts -> build the project car ->
enter fictional closed-course events -> earn prizes/status -> complete or sell the build -> start
the next dream car stronger
```

Design rules:

- Tofu Shop is how the player earns money.
- Dream Garage is the long-term aspirational layer.
- The player slowly builds a project car from an old covered car into a dream build.
- The car-build layer is fictional game progression.
- Fictional closed-course events are asynchronous parked game events, not instructions to drive in
  real life.
- Car parts may affect future Build Score, Reliability, Event Readiness, Style, prize bonuses, or
  builder status.
- Car parts must not improve real-world Cup Test scoring, qualification, route validation, speed,
  or safety-sensitive behavior.
- Selling or completing a car can become a future prestige loop only after the garage loop is fun.

Safe language:

- project car build
- garage showcase
- sponsor showcase
- fictional closed-course event
- track day as fictional game content
- smooth control
- reliability
- style
- event readiness

Avoid copy that implies public-road competition, speed optimization, aggressive road behavior, or
real-world vehicle modification advice.

## Ultimate Net Worth Endgame

Ultimate net worth is future direction only. It is not current MVP behavior.

Long-arc framing:

```text
Tofu Shop is the first job.
Dream Garage is the first dream.
The car company is the first empire.
The rocket company is the absurd endgame.
The goal is $1 trillion net worth.
```

`Net Worth` is a fictional game abstraction, not financial advice. The exact label can later become
Company Value, Enterprise Value, Total Value, or another clearer game term.

The player may begin small, possibly even with negative net worth if future design adds startup
costs, shop bills, project-car expenses, loans, or obligations. Over time, the player builds assets:

- Tofu Shop
- Tofu Shop franchise
- Delivery Network
- Dream Garage
- project cars
- collector cars
- car manufacturing company
- sponsorship/showcase brand
- rocket or aerospace company
- future space delivery company or space league

The arc should evolve from labor to ownership:

1. Shop Worker Era: manually fulfill tofu orders.
2. Shop Owner Era: buy stations and upgrades.
3. Manager Era: Counter Service and Regular Customers automate order fulfillment.
4. Franchise Era: Tofu Shop becomes scalable business infrastructure.
5. Dream Garage Era: Tips fund project cars and parts.
6. Builder Era: completed cars gain value, win fictional closed-course prizes, or sell.
7. Manufacturer Era: the player builds a car company.
8. Aerospace Era: the player invests in rockets or space delivery.
9. Space League Era: absurd late-game expansion, possibly future patch content.

Social status and multiplayer-like systems are also future-only. If ever designed, they must be
opt-in, privacy-safe, asynchronous, and fictional. Prefer Scout, Ambassador, Rival Company, Sponsor
Pitch, Trade Offer, Showcase Visit, Corporate Challenge, Friendly Rivalry, Market Competition, Brand
Duel, or Exhibition Match. Avoid real violence, crime, sabotage, harassment, shaming, doxxing,
real-world targeting, and user-facing terms such as `attack force`.

Future showcase/status objects may include player cards, shop skins, garage skins, project car
cards, collector car cards, company headquarters, rocket hangars, sponsor badges, Passport stamps,
No-Spill Club proof, Perfect Pour proof, and premium cosmetic skins. Cosmetics may express identity
and status, but must not improve Cup Test scoring, qualification, speed, safety-sensitive behavior,
or real-world driving outcomes.

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
3. Dream Garage: the covered project car behind the shop becomes the long-term dream.
4. Fictional Route Network: atmospheric route cards that are explicitly game content.
5. Closed-Course Showcase: fictional events prove build quality and smooth control without real-road
   competition.
6. Delivery Network Expansion: apprentices, dispatchers, prep staff, route scouts.
7. License And Build Prestige: License Exams, permanent License Stars, and future project-car
   completion/sale prestige.
8. Legendary Final Delivery: endgame fantasy as perfect control, not speed.

Future shop/incremental ideas:

- external mechanics reference study: `EXTERNAL_REFERENCE_DOPEWARS_AUDIT.md` translates useful
  capacity, demand, opportunity, and goal-pressure lessons into safe Tofu Driver concepts without
  copying GPL code/content or incompatible theme
- external progression-architecture study: `EXTERNAL_REFERENCE_ANTIMATTER_DIMENSIONS_AUDIT.md`
  translates recursive production, next-milestone, automation, achievement, challenge, and prestige
  lessons into safe future Tofu Shop concepts
- Tofu Demand Board
- Supplier Market
- Customer Rush Events
- Daily Opportunity Cards
- Next Milestone bar V1 is implemented for the current shop spine; future work should tune targets
  rather than expose the full roadmap
- station milestone boosts
- Counter Service / Regular Customers automation after mastery
- visible locked License Exam goal after a real shop plateau
- safe Shop Trials / Festival Orders after the first shop loop is stable
- covered project car reveal
- Dream Garage
- Garage Parts Market
- staged project car builds
- Dream Jar / Project Budget
- Project Car Value
- fictional closed-course events
- project car completion or sale as prestige
- next project car starts stronger
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
