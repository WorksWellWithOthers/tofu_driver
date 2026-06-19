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
- `Tofu Garage`: the parked-only idle/incremental mode and base progression layer.
- `Delivery Crew`: the parked cosmetic/audio/collection surface.

Supporting concepts:

- `Delivery Log` / `Ledger`: local result history and summarized event record. It is not a separate
  competing game layer.
- `No-Spill Club`: rank, community/status tier, and merch tier.
- `Perfect Pour`: top achievement for qualified smooth-driving results.

Canonical hierarchy:

1. Tofu Driver is the brand and app.
2. Don't Spill the Cup is the default visitor-facing challenge.
3. Tofu Garage is the home progression mode.
4. Delivery Crew is a collection/customization surface.
5. Delivery Log / Ledger records what happened.

Tofu Shop is the first business inside Tofu Garage. User-facing navigation should say `Tofu Garage`
so the mode reads as a game world, not a merchandise store.

## Product Surfaces

The current static app uses hash routes:

- root/no hash defaults to `#/cup-test`
- `#/cup-test` shows `Don't Spill the Cup`
- `#/shop` shows `Tofu Garage`; `#/garage` is an alias for the same surface
- `#/crew` shows `Delivery Crew`

This is app hash routing only. Gameplay `Routes` inside Tofu Garage are currently hidden/deferred:
there is no active Routes tab, and route-related stations, upgrades, Spirit actions, training, and
old route-garage actions are not purchasable. Future gameplay Routes must remain fictional,
parked-safe planning/status content and must not use GPS, maps, street names, speed rewards, or
public-road competition.

Default visitor behavior:

- The first page is `Don't Spill the Cup`.
- Cup page primary CTA: `Take the Cup Test`.
- Cup page secondary CTA: visit or start Tofu Garage.
- Cup result screens can include a small parked CTA back to Tofu Garage so Cup-first visitors discover
  the home progression loop without interrupting active driving.
- Tofu Garage page primary CTA: the current shop decision, such as watching starter Counter Service
  or buying the next bottleneck-solving upgrade, and Continue actions land near the shop action area
  rather than the page top.
- Delivery Crew is reachable as a parked placeholder/collection surface and must not be a dead nav
  item.

This resolves the older tension between "the shop is the base game" and "the cup challenge is the
default page": the Cup Test is the iconic first surface, while Tofu Garage is the base parked
progression layer.

## Progression Ownership

Delivery Driver progression belongs to Don't Spill the Cup. Driver XP, Driver Level, Driver License
title, smoothness streaks, Today's Delivery cargo, No-Spill Club gear, Cup Test stamps, and Cup Test
recent rewards should primarily come from completed Cup Test runs and smoothness/cargo milestones.

Tofu Shop progression is separate shop progression. Tofu Stock, Delivery Orders, Cash, Reputation,
Shop Level, Shop Spirit, stations, station milestones, Counter Service, shop upgrades, Shop XP, and
shop stamps come from parked shop production and shop order fulfillment. The legacy save field is
still `shop.tips`, but player-facing copy treats it as Cash earned from order tips.

Driver Level may influence Tofu Shop only as a small capped status bonus. Current V1 framing is a
Reputation bonus from shop orders, capped so Cup Test status helps the shop feel known without
becoming mandatory for ordinary shop progress. Tofu Shop orders and automation must not grant
Driver XP or inflate Driver Level, and Driver Level must never improve Cup Test scoring,
qualification, or safety-sensitive behavior.

The full Delivery Board belongs on the Don't Spill the Cup surface and result flow. Tofu Shop may
show a compact Driver Bonus card when Driver Level has a shop effect, with copy that Driver XP is
earned from Don't Spill the Cup.

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
- Motion permission must be requested from the explicit `Start & Calibrate` tap before optional
  audio setup or other awaited work, so mobile Safari keeps the user-gesture chain.
- Permission-needed, permission-denied, insecure-context, unsupported-browser, and no-motion-data
  states must stay distinct. Do not show permission-denied copy until the browser actually returns a
  denied response.
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

Parked idle surfaces must stay responsive at high shop scale. Live shop ticks should update only the
active surface, avoid rebuilding hidden Cup/Crew panels, keep large panels out of `aria-live`
regions, and use compact bounded feedback instead of repeated full-panel announcements.

Unlocked Tofu Garage cards should not blink in and out during live resource updates. Unlock status
controls visibility; live Cash, Reputation, stock, queue, cooldown, and ETA changes should update
enabled/disabled state and progress copy in place. Moving click targets are a UX and performance
bug, especially on mobile.
Multi-resource upgrade cards must label Cost, Cash progress, and Reputation progress explicitly.

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

## Toy, Simulation, and Player Expression Principles

### Design By Constraint

Tofu Driver's strongest constraints are part of the design, not only risk controls:

- reward smoothness, not speed
- keep the MVP local-first and static-browser friendly
- make shop, story, build, and expression actions parked-only
- avoid active-drive upgrades, reward claiming, editing, or social interactions
- avoid speed leaderboards, route leaderboards, and public-road competition
- avoid GPS, map, street, route-trace, raw motion, or speed-log sharing
- require no backend for the MVP
- start with one simple action before layered systems appear

These constraints give Tofu Driver its identity. They keep it from becoming a generic idle game,
a driving telemetry product, or an unsafe public-road competition app.

### Toy First, Game Second

Tofu Driver should give the player expressive toys, not only linear tasks. The player can then turn
those toys into personal goals, rituals, screenshots, jokes, and stories.

Current and future toy-like objects include Cup Trail as a safe motion signature, the Tofu Garage
living scene, Dream Build project-car progress, Delivery Crew characters and cosmetics, Passport
stamps, share cards, Result Story captions, safe screenshot moments, future shop skins, future
garage skins, future project car cards, and future comic-style result cards.

The toy must stay safe, local, and expressive. It must not depend on speed, GPS, public ranking,
street identity, or risky driving.

### Creative Leverage And Customization

Players should be able to express identity through car build choices, shop presentation, crew and
cosmetic selection, stamps, cards, share-card framing, local result captions, future comic panels,
and future garage/shop decoration.

Customization should be cosmetic, status, and story expression first. It must never improve Cup Test
scoring, qualification, speed, route validation, or safety-sensitive behavior.

### Start Simple, Then Layer Complexity

The first session should stay simple: one clear action, one simple shop loop, one visible bottleneck,
and one next decision. New systems should unlock only after the player has enough context to care.

Any future needs, maintenance, black-box simulation, project-car systems, or probability systems
must unlock slowly. They should clarify the current goal state rather than clutter the first session.

### Failure Should Be Enjoyable

Failure should feel recoverable and specific. Spilled-cup results can be funny, gentle, and
cargo-aware. Shop bottlenecks should read as "now you know what to fix," not punishment. Failure
copy can use humor and character flavor, but it must avoid shame, hostile scoring language,
legal/safety claims, or pressure to drive harder.

Most failure should come from missing information, misunderstood systems, resource tradeoffs, or
choosing a risky plan inside the game. It should not come from twitch skill, reflex precision,
hidden timing windows, or unsafe real-world driving.

### Multiple Paths To Goal State

Long-term progress should support several safe paths: reinvest in Tofu Shop, scale Counter Service
and Manager Desk, improve supply, build Dream Build value, grow Brand Value, collect cosmetics and
stamps, or later choose fictional business/event paths.

The player's goal state can include Cash, Net Worth, identity, collection, shop comfort, garage
pride, and story status. The game should not collapse into one fastest route.

### Needs, Maintenance, And Complexity Budget

Needs-like systems may be useful later, but only with strict scope. Possible future sliders include
shop comfort, staff energy, customer patience, tofu freshness, garage focus, crew morale, and
sponsor attention. Literal hunger or fatigue should be avoided unless it fits the Tofu Driver
fiction and stays cozy.

Maintenance rule:

```text
Every maintained item adds complexity.
If many items require maintenance, the player needs automation, grouping, or a clear reason to care.
```

Needs systems should create choices and stories, not chores.

### Discovery, Easter Eggs, And Black-Box Simulation

Some systems should be fully legible, while others may remain partly mysterious. Players should see
enough to make decisions, but not every correlation needs to be exposed. Surprising interactions,
rare outcomes, and hidden touches can create stories.

Black-box simulation must not hide safety-critical scoring. Cup Test scoring, qualification, route
validation, privacy behavior, and safety-sensitive outcomes must remain deterministic and
explainable.

Monte Carlo or probability-driven simulation is allowed only for parked fictional systems such as
future customer demand, shop events, sponsor interest, garage presentation opportunities, or
showcase-style story beats. Probability must not decide real-driving qualification in a way that
feels arbitrary.

### Prototype Questions

Every prototype should answer a specific question before it becomes a larger system:

- Does Shop Spirit feel like a strategic recovery tool or clutter?
- Does Dream Build make players proud to spend Cash?
- Does Net Worth make the long-term goal clearer?
- Does Cup Trail make the result feel personal enough to share?
- Does failure copy make players laugh and try again?
- Does a maintenance mechanic create story or just chores?

## Tofu Shop Design Direction

Tofu Shop is the parked-only idle/incremental management game. It should be playable at home without
sensors or location.

Design stance:

> Tofu Shop is a one-loop incremental game that earns the right to unfold.

Current core loop target:

```text
Tofu Press -> Prep Counter -> Starter Counter Service -> Cash -> Upgrade -> First Stamp
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
- Tofu Garage is idle-first from the start. The shop performs repeated labor automatically:
  Tofu Press makes stock, Prep Counter prepares orders, and starter Counter Service handles slow
  Simple Tofu Box pickups. Manual actions are not the core loop; the player clicks decisions,
  upgrades, bottleneck fixes, and strategic spends.
- The starter shop should not dead-start. Fresh saves begin with enough Tofu Stock buffer for the
  first few automatic Simple Tofu Box pickups, so Cash can reach the first useful upgrade through
  idle play. If Counter Service is blocked, the UI should name only the missing input and show a
  Tofu Stock ETA when stock is recovering.
- Good player actions include buying upgrades, solving bottlenecks, starting or pausing Counter
  Service, spending Shop Spirit, and later choosing business direction, car-build direction, or a
  prestige reset. Bad repeated labor includes clicking hundreds of times to make tofu, manually
  fulfilling every order forever, clicking faster to progress faster, or clicking during active
  driving.
- Midgame bottlenecks should be solved through management decisions, not click volume. Pack Tofu is
  a tutorial/backup action; once Counter Service and larger orders scale, Reputation-funded
  Supplier Contracts are the intended Tofu Stock supply answer.
- Delivery Orders mean prepared/waiting shop work, not Driver XP or real-world deliveries. Counter
  Service may consume these orders while the page is open, but offline progress does not auto-fulfill
  them yet. Offline progress is AFK-equivalent within a generous direct cap: 24 hours by default
  and 72 hours once Manager Desk/Shift Manager coverage exists. Long absences are summarized rather
  than simulated second-by-second, and existing Cash balances are not capped.
- Tofu Garage high-scale performance should be solved first with compact formatting, bounded
  queues/history, aggregate offline math, and throttled visible rendering. Current `$1T`-scale
  planning does not require a BigNumber rewrite; mantissa/exponent amounts remain a future endgame
  adapter only if values intentionally exceed normal JavaScript number comfort.
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
  Cash/Reputation/Shop XP rewards. This order-size ladder is the intended bridge between stockpiles
  and higher payouts. Raw Tofu Stock should not directly multiply Cash.
- The current implemented order ladder is Simple Tofu Box, Family Tofu Tray, Festival Bento, and
  Catering Crate. The early stock costs are 6, 24, and 75 Tofu Stock respectively, with Catering
  Crate acting as a later managed-shop stock/Ready Order sink.
- Core Game Spine V1 now starts with automatic First Cash Earned and the First Shop Order stamp,
  followed by First Upgrade Purchased, First 10 Orders, First Family Tofu Tray, and First 100 Tips.
  Delivery Shelf is the first throughput support station, and Shop Sign is the first Reputation
  support station.
- Station Milestone Boosts V1 rewards owned station counts without adding a new tab or currency:
  5/10 Tofu Presses and Prep Counters accelerate stock/order production, 5/10 Delivery Shelves
  improve Prep Counter support, and 5/10 Shop Signs improve Reputation support. These are
  total multipliers, not stacked threshold multipliers.
- Counter Service V1 is the starter automation layer. It is available on fresh saves, runs by
  default while parked, and can complete the first Simple Tofu Box without manual fulfillment.
  Later Counter Service upgrades remain earned after early shop momentum.
- Managed Shop Phase V1 extends Counter Service after Pickup Routine with finite bulk handoff
  upgrades: Second Register, Pickup Window, and Counter Crew. This is still local Tofu Shop
  automation, not franchise mode or Dream Garage.
- Counter Service should display its useful rate or blocked state honestly. If it is supplied and
  running, shop income can include a `Cash/min when supplied` line; if it lacks stock or ready
  orders, the UI should say what is missing rather than showing a misleading zero.
- Shop Spirit actions should use stable sections and action-specific language: generators use `Buy`,
  instant actions use `Spend Spirit`, and timed effects use `Start Effect` or a specific effect
  name. Instant Spirit spends should be strategic emergency recovery, such as adding a meaningful
  amount of Tofu Stock or order prep, with immediate inline feedback. Token shelves stay hidden until
  an implemented system can actually generate usable tokens. Route-related Spirit actions stay hidden
  until fictional route systems matter.
- Regular Customers, gameplay Routes, full Dream Garage, Rivals, and License prestige
  remain deferred until Counter Service and the V1 spine have been playtested and tuned. While
  gameplay Routes are deferred, the live Tofu Garage UI should not show a Routes tab or sell
  route-related upgrades/actions.
- New active decisions should replace automated chores. When Counter Service removes repeated order
  handoffs, the next decisions should be stock supply, service rate, larger orders, or later support
  stations, not more mandatory clicking.
- Returning players should recover context quickly. Production and Upgrades can expose compact
  bulk-buy actions, affordability progress, and time-to-afford hints, but only for visible
  meaningful shop items. Bulk actions must not spend into hidden, future, route, crew, or decorative
  systems.
- `TOFU_GARAGE_V1_COMPLETION_AUDIT.md` is the readiness gate for leaving the first shop phase. Its
  current verdict is that Tofu Garage V1 is close enough for a parked Covered Car / Dream Build
  teaser after final first-session and high-progress responsiveness checks, but not full car
  building.
- Covered Car / Dream Build Teaser V1 is implemented as a parked story/status card after the shop
  reaches managed scale: Counter Crew, Manager Desk, Wholesale Pickup progress, and sustained shop
  growth. It says the shop funds the dream, but it does not add Dream Garage mechanics, car parts,
  full asset valuation, or any driving effect.
- Net Worth Milestones V1 gives the later shop/Dream Build bridge concrete stepping stones:
  `$1M`, `$10M`, `$100M`, `$1B`, and `$1T Net Worth`. The first `$1M` can unlock Local Showcase
  Interest after early Dream Build progress, and Showcase Prep is a parked Cash investment that
  raises Garage Build Value. Sponsor Inquiry V1 is a one-time parked opportunity after Showcase Prep:
  it grants Cash and Brand Value, but it is not a recurring sponsor system, completed-car event,
  race, route, or full Dream Garage.
- Current player-facing garage copy should say `Garage Build Value`, not `Project Car Value`, and
  should reinforce `Not faster. Smoother.` Garage value is story/status/showcase value, not vehicle
  performance.
- Manual Fulfill Shop Order remains a parked Manual Backup action. It requires at least one ready
  Delivery Order, consumes Delivery Orders, and grants Cash, Reputation, and Shop XP, but it is not
  the primary progression loop.
- Tips are early flavor for order income. The current coherent economy treats those earnings as
  Cash, the single liquid spend currency for shop upgrades and later car/business investments.
- The early UI must teach that automatic Counter Service handoffs create spendable money.
- Pack Tofu is a backup/manual Tofu Stock action, not the main money action.
- Recommendations should follow the current bottleneck: promote Tofu Press when stock is low, but
  promote Prep Counter, order prep, or Tidy Packaging when stock is plentiful and orders are slow.
- Early upgrades must solve a bottleneck the player has already felt. Do not make the Upgrades
  panel prominent when it only contains locked, irrelevant, or non-actionable cards.
- Tidy Packaging is the preferred first named upgrade when Prep Counter throughput is the felt
  bottleneck. Steady Pressing is a stock-runway upgrade and should not be recommended while stock is
  already healthy.
- Early upgrade cards should show before/after impact, such as a better order-prep cadence or
  higher stock/sec, before asking the player to spend Cash.
- Overview is the main first-loop play surface. It should include the current bottleneck, the next
  best action, ready orders, Prep Counter progress, the best available order card, and one relevant
  station or upgrade. A new player should not need to open Orders to understand or play the first
  loop.
- The Tofu Shop Living Scene is a decorative parked Overview panel, not a control surface. It should
  present one cohesive full-scene image or placeholder at a time, selected by meaningful shop
  milestones, while buttons and gameplay decisions remain separate UI. Do not show separate
  per-layer art placeholder tiles in the Overview. Integrated real-art scene states should render as
  polished images without asset/debug copy, raw scene IDs, or `art pending` labels. Scene swaps
  should advance slower than station/card progression: one Tofu Press, Prep Counter, Delivery
  Shelf, Shop Sign, or brief resource threshold should not change the full-scene image by itself.
  Decorative scene elements must be pointer-inert, must not attach timers/listeners or large live
  regions, and should compute from already-normalized milestone state so shop buttons remain
  one-click responsive. The covered-car state may use only restrained flavor such as `Behind the
  shop, an old car waits under a cover`; it remains a purpose hint, not Dream Garage implementation.
  The Old Car Out Back story splash is a one-time parked acknowledgement for that milestone, separate
  from the normal Living Scene background.
- Mika, Night Shift Manager, is the first implemented Delivery Crew character art pack. Her current
  six-image MVP set lives under `/static/nospill/images/` and can appear only on parked/result
  surfaces such as Delivery Crew, post-run results, Coach Recap, and local fanfare moments.
  Post-run Result Cameo and Coach Recap should use the dedicated larger Mika images as polished
  4:5 character portraits, not thumbnail/debug cards. Real assigned art must not render gray
  initial tiles, `art pending`, `not assigned`, internal slot names, or implementation-note copy.
  Character art is cosmetic and must never affect Cup Test scoring, cargo thresholds,
  qualification, rewards, route validation, speed, distance, or active-drive behavior.
- The first Passport stamp should be a Stamp Fanfare moment. The celebration is local-only,
  repeat-suppressed per stamp, accessible, and parked/result-screen only. It must never interrupt an
  active Cup Test, and it should respect reduced-motion and audio settings. It should feel like a
  polished reward screen: one wide reward splash, clear stamp title/copy, compact reward cards,
  `Continue Tofu Shop`, and no character-slot labels, asset-status copy, or debug text.
- The first hidden shop system should use a Discovery Fanfare. Upgrades are the first system reveal
  when a meaningful bottleneck-solving upgrade appears. System reveals are local-only,
  repeat-suppressed per system id, and should create curiosity without listing the future roadmap.
- After managed-shop progress, the shop may show one restrained covered-car story/status teaser:
  `Behind the shop, an old car waits under a cover.` This is a purpose hint only, not Dream Garage
  implementation. Next Milestone may point to it once; after it is seen, normal shop progression
  resumes.
- After the covered-car teaser is unlocked/seen, the shop may show `First Dream Investment`, a
  compact Wheels Fund target. The first Dream Build purchase is Wheels: it costs `$50K Cash`,
  subtracts Cash, persists locally, and starts `$25K Garage Build Value`. It does not open a Dream
  Garage tab or create a full car-parts inventory.
- Detailed tabs are earned. The Orders tab is removed from the first-loop shop because Overview
  owns order cards, Prep Counter progress, reward previews, and fulfillment actions. Production
  should focus on station ownership, and Upgrades should appear only when at least one relevant
  upgrade is visible or close.
- Tab panels are scoped. Passport, Ledger, and Settings should not append the Production or
  Upgrades controls; station buying belongs in Production and upgrade buying belongs in Upgrades.
- Normal parked shop-order fulfillment is inline and non-interrupting. Full result screens are for
  Cup Test runs and major fanfare moments such as the first Passport stamp.
- Don't Spill the Cup is an optional certified boost and should not override normal shop
  bottleneck recommendations when Delivery Orders are ready, an order is being prepared, or Cash
  are needed.
- Reputation opens new shop systems.
- XP/levels provide visible progress.
- Offline progress is capped for pacing/performance and summarized once on return. Rested Shop Time
  is deferred until it can be added without making normal shop speed feel bad.
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

The current MVP loop remains the priority. Gameplay Routes, Crew, Garage, Shop Spirit, Rivals, and
License are later-phase systems until the core loop feels good. Routes are currently hidden/deferred
from active Tofu Garage UI even if old save fields contain route progress. Later-phase systems
should unlock from meaningful milestones such as first upgrades, larger orders, station purchases,
route story beats, or repeated chores, not from raw idle currency accumulation alone. Use
`BALANCE_AND_PROGRESSION.md` for pacing, formulas, sources/sinks, upgrade ladders, button
inventories, unresolved balance questions, and
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
Work shop orders -> earn Cash from tips -> reinvest in shop or buy parts -> build the project car ->
enter fictional closed-course events -> earn prizes/status -> complete or sell the build -> start
the next dream car stronger
```

Design rules:

- Tofu Shop is how the player earns money.
- Dream Garage is the long-term aspirational layer.
- The player slowly builds a project car from an old covered car into a dream build.
- Car parts should cost Cash, not a separate part currency.
- The first implemented car-related purchase is Wheels: save `$50K Cash` after the covered-car
  teaser, then spend it to start the project car with `$25K Project Car Value`.
- Exhaust Purchase + Work Level V1 is implemented after Wheels reaches level 3. Exhaust costs
  `$250K Cash`, adds `$125K Project Car Value`, Seal Joints costs `$375K Cash` and adds another
  `$200K`, Tuned Note costs `$600K Cash` and adds another `$350K`, and Heat Wrapped costs `$1.1M`
  Cash and adds another `$650K`. Showcase Finish costs `$2M Cash`, adds another `$1.25M`, and
  completes the current Exhaust track.
- Parts are purchased once, then improved through work levels. The player should not buy duplicate
  wheels, exhausts, turbos, or other repeated copies of the same part. Future actions should use
  verbs such as Install, Polish, Fit, Balance, Tune, Refine, Restore, Wrap, Detail, Finish, and
  Showcase.
- Wheels Work Levels V1 implements the first three Wheels levels: Wheels Installed, Polished
  Wheels, and Balanced Fitment. Level 4 Showpiece Fitment and Level 5 Collector Finish remain
  future.
- Exhaust V1 implements Exhaust Fitted, Sealed Joints, Tuned Note, Heat Wrapped, and Showcase
  Finish. Suspension remains future/target-only.
- Dream Build Progress V1 summarizes the project as `6 parts x 5 levels = 30 work stages`.
  Current runtime progress is Wheels level plus Exhaust level; the implemented maximum is `8 / 30`
  after Balanced Fitment and Showcase Finish. Suspension, Brakes, Turbo Kit, Stage Tune,
  completed-build events, and full Dream Garage remain future.
- Buying car parts should feel like an investment decision: spending Cash slows liquid progress
  toward the $1T target, but can increase Project Car Value/Car Asset Value later, unlock higher
  earning paths, or create later sell/keep decisions.
- The car-build layer is fictional game progression.
- Fictional closed-course events are asynchronous parked game events, not instructions to drive in
  real life.
- Car parts may affect future Build Score, Reliability, Event Readiness, Style, prize bonuses, or
  builder status.
- Car parts must not improve real-world Cup Test scoring, qualification, route validation, speed,
  or safety-sensitive behavior.
- Selling or completing a car can become a future prestige loop only after the garage loop is fun.

### Dream Build Part Progression

Dream Build parts should use a one-part, many-work-levels model:

```text
Tofu Garage earns Cash
-> Cash funds project car parts
-> each part has improvement levels
-> completed car unlocks event choices
-> event choices create Cash, status, business, or prestige outcomes
```

Core rule:

```text
Buy the part once.
Then work on that part through levels.
```

Future part tracks:

| Part | Level 0 | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 |
| --- | --- | --- | --- | --- | --- | --- |
| Wheels | Missing / stock | Wheels Installed | Polished Wheels | Balanced Fitment | Showpiece Fitment | Collector Finish |
| Exhaust | Stock | Exhaust Fitted | Sealed Joints | Tuned Note | Heat Wrapped | Showcase Finish |
| Suspension | Stock | Suspension Refreshed | Ride Height Set | Alignment Dialed | Corner Balance | Showcase Stance |
| Brakes | Stock | Brake Refresh | Better Pads | Fluid and Lines | Balanced Stopping | Confidence Setup |
| Turbo Kit | Not started | Kit Mounted | Piping Routed | Heat Managed | Closed-Course Tuned | Showcase Ready |
| Stage Tune | Not started | Baseline Tune | Smooth Response | Reliability Map | Closed-Course Map | Showcase Calibration |

Part-level investments may reduce Cash, increase Project Car Value, increase Dream Build progress,
increase Garage Reputation, improve Showcase Readiness, unlock future events, or unlock future
business paths. They should not produce direct Cash at every level.

Implemented Wheels V1 values:

| Wheels Level | Work | Cash Cost | Project Car Value |
| --- | --- | --- | --- |
| 1 | Wheels Installed | `$50K` | `$25K` |
| 2 | Polish Wheels | `$75K` | `$65K` total |
| 3 | Balanced Fitment | `$150K` | `$150K` total |

Implemented Exhaust V1 values:

| Exhaust Level | Work | Cash Cost | Project Car Value |
| --- | --- | --- | --- |
| 1 | Exhaust Fitted | `$250K` | `+$125K` (`$275K` with Wheels level 3) |
| 2 | Sealed Joints | `$375K` | `+$200K` (`$475K` with Wheels level 3) |
| 3 | Tuned Note | `$600K` | `+$350K` (`$825K` with Wheels level 3) |
| 4 | Heat Wrapped | `$1.1M` | `+$650K` (`$1.475M` with Wheels level 3) |
| 5 | Showcase Finish | `$2M` | `+$1.25M` (`$2.725M` with Wheels level 3) |

Wheels levels 4-5, Suspension, full Dream Garage, completed-build events, Auction, Showcase, and
Collector Offer remain future.

Dream Build Progress V1:

```text
Dream Build Progress = Wheels Level + Exhaust Level + future part levels
Planned build size = 6 parts x 5 levels = 30 work stages
```

The progress card may show current Wheels and Exhaust labels, the next dream step, Project Car
Value, and a compact note that more build tracks unlock later. It must not add future part purchase
buttons or a Dream Garage tab.

Avoid:

- `Buy Wheels x10`
- `Buy Exhaust x5`
- `Produce more turbos`
- public-road performance copy

Core tradeoff:

```text
Cash spent on the car delays liquid progress toward $1T,
but increases asset value and unlocks higher-value opportunities later.
```

### Completed Build Events

When a project car reaches a completion threshold, future Dream Garage should offer clear choices
instead of forcing one outcome.

| Event Choice | Effect | Rewards | Tradeoff / Safety |
| --- | --- | --- | --- |
| Keep the Car | The car remains in the collection. | Higher Project Car Value, long-term status, garage identity, future showcase eligibility. | No immediate Cash payout. |
| Enter Showcase | The car is shown publicly in-fiction. | Garage Reputation, sponsor interest, status, possible cosmetic unlocks. | No real driving and no speed incentives. |
| Closed-Course Exhibition | Fictional non-real-world event. | Trophy, story beat, sponsor interest. | Must never affect Cup Test scoring, real driving, speed, G-force, or public-road behavior. |
| Auction the Car | Sell the car for Cash. | Large Cash payout to fund the next build or next business. | Lose the car from active collection and lose some collection value/status. |
| Collector Offer | Rare offer to buy the car. | Possibly better Cash than auction, story/status beat, future collector network. | Lose the car unless the player declines. |

Completed-car choices are a future prestige-like bridge:

```text
Sell the build
-> get Cash
-> fund the next business
-> unlock better project cars
-> previous shop loop becomes more automated
```

or:

```text
Keep the build
-> grow status
-> unlock showcase/sponsor paths
-> slower Cash now, higher brand value later
```

This layer should bridge Tofu Garage into later business scaling only after the shop loop and first
Dream Build work levels are proven.

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
real-world vehicle modification advice. Dream Build must never reward street racing, public-road
competition, speed, high-G bragging, Cup Test scoring advantage, Cup Test qualification advantage,
or real-world driving performance. Use closed-course, showcase, garage, smoothness, reliability,
and fictional status wording only.

## Ultimate Net Worth Endgame

Ultimate net worth is the long-term direction. V1 is implemented as a small, local Tofu Garage
progress line after later shop milestones; full valuation remains future.

Long-arc framing:

```text
Tofu Shop is the first job.
Dream Garage is the first dream.
The car company is the first empire.
The rocket company is the absurd endgame.
The goal is $1 trillion net worth.
```

`Net Worth` is a fictional game abstraction, not financial advice. The $1T goal does not increase;
the player's progress toward $1T Net Worth increases.

Cash is the player's spendable money. Early-game flavor may still call order income `tips`, but
those tips mechanically become Cash. Tofu orders earn Cash, shop upgrades spend Cash, future car
parts spend Cash, and Cash contributes directly to Net Worth.

Avoid creating separate `Tips` and `$` balances. Use copy such as `+$10 Cash from tips` or
`Counter Service: Simple Tofu Box complete · +$10`. Shares are not the main endgame target; they
can remain a much later fictional company/founder mechanic if needed.

Current Net Worth V1 uses a deliberately small model:

```text
Net Worth V1 =
  Cash
  + Tofu Business Value
  + Garage Build Value
  + Brand Value
```

`Tofu Business Value` is a deterministic local estimate from station ownership, purchased shop
upgrades, supplier/manager systems, shop level/reputation, and earning power after the shop has
earned money. `Garage Build Value` is the player-facing V1 label for careful garage/story/showcase
work from Wheels, Exhaust, and Showcase Prep. Internally, legacy helpers may still use
`projectCarValueV1`, but the UI should not frame this as speed or performance improvement. `Brand
Value` is zero until the one-time Sponsor Inquiry is accepted. This is not a full valuation system
and does not include resale, depreciation, garage value, future company value, or liabilities yet.

Conceptual accounting model:

```text
Net Worth =
  Cash
  + Business Value
  + Car Asset Value
  + Garage Value
  + future company value
  - liabilities
```

Central investment tradeoff:

```text
Cash helps reach $1T directly.
Spending Cash delays liquid progress.
But spending Cash on assets can unlock higher earning paths.
```

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
5. Dream Garage Era: Cash from shop income funds project cars and parts.
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
- Cash
- upgrades
- routes
- accounts
- shop progress

Cup Test results can affect Tofu Shop as optional certified boosts:

- bonus Reputation
- bonus Tofu Stock
- bonus Cash
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

Cup Test result cards may include safe summarized flavor and coaching:

- Cargo Type, Cargo Condition, Rank, and Trip Time.
- Drive Shape labels such as Calm Pour, Rolling Pour, Winding Pour, Stop-and-Go Pour, Daily Pour,
  or Long Pour, derived from summarized local motion only.
- Cup Trail, a bounded decorative left/right motion signature. It is not a real-world path, map,
  route identity, street shape, distance plot, or speed chart.
- Coach Recap labels such as Smooth Hands, Brake Feather, Decel Control, Transition Smoothness,
  Cargo Balance, Passenger Comfort, and Consistency.
- Daily Delivery Credit / Steady Pour Minutes copy for safe completed commute-style runs.

Coach Recap must classify the outcome of the run from the cup/cargo point of view, not the driver's
technique. Use calm wording about cargo stability, forward jolts, steering changes, passenger
comfort, and consistency. Do not infer or teach left-foot braking, right-foot braking, engine
braking, trail braking, racing lines, corner entry speed, late braking, or performance driving
style.

## Delivery Crew And Collection

Delivery Crew is a parked collection/customization surface.

Character unlocks and sound packs are cosmetic, narrative, and UI/audio flavor. They may personalize
the shop, crew surface, result screens, or safe share-card flavor. They must not:

- improve real-world driving score
- improve route qualification
- reward speed
- require risky driving
- play distracting reward sounds during active drive

Character art is prepared through named parked-only asset slots and placeholders. The inventory and
production checklist live in `CHARACTER_ART_ASSET_INVENTORY.md`; runtime slots should degrade to
clear placeholder copy when future art is missing. Mika's current MVP slots use real images, while
future optional slots can still fall back to placeholders. Assigned real art should appear as a
single intentional image treatment per surface, without duplicate fallback tiles beside it.
Character cameos belong on parked shop, crew, result, recap, reward, and stamp surfaces only, not
active-drive UI.
Story splash art follows the same rule: it is parked-only, repeat-suppressed, and cosmetic.

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
- Cargo Type
- Cargo Condition
- Rank
- Trip Time
- Drive Shape
- safe Coach Recap labels
- Driver License
- Shop Level
- selected crew flavor when safe
- stamp earned
- optional local Result Story caption when the player writes one
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

Result Story Caption V1 is a parked post-run expression tool. It lets the player add one short,
sanitized, local-only caption to the current result/share card. It may appear in copied share text
and downloaded share-card rendering, but it is not a full comic editor, upload flow, public profile,
backend feature, or scoring/reward modifier.

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
