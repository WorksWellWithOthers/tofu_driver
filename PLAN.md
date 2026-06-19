# Tofu Driver Plan

## Current State

- Tofu Driver is a static browser app currently source-located at `frontend/nospill/`.
- Root/no hash defaults to `#/cup-test`.
- `#/cup-test` shows Don't Spill the Cup, the smooth-driving challenge.
- `#/shop` shows Tofu Garage, the parked-only idle/incremental mode whose first business is the
  Tofu Shop. `#/garage` aliases to the same surface while `#/shop` remains supported.
- `#/crew` shows the Delivery Crew parked placeholder/collection surface.
- Gameplay Routes inside Tofu Garage are hidden/deferred for now. The app hash routes above remain
  unchanged, but the Tofu Garage tab row does not show `Routes`, and route-related stations,
  upgrades, Spirit actions, training, and old route-garage actions are not purchasable.
- Tofu Garage upgrade shelves use stable unlock-based visibility and fixed catalog ordering.
  Affordability, queue state, stock state, ETA, and maxed state update card copy in place instead
  of removing/reinserting cards during live ticks.
- Delivery Driver progression is now separated from Tofu Shop progression: Cup Test runs grant
  Driver XP/Driver Level, while shop orders and Counter Service grant Cash, Reputation, Shop XP,
  Shop Level progress, stamps, and shop resources.
- Driver Level can provide only a small capped Reputation bonus to shop orders. Tofu Shop does not
  level the driver, and Driver Level never changes Cup Test scoring or qualification.
- Cash economy V1 is implemented. Player-facing shop money is Cash; order payouts may still use
  tips as flavor (`+$10 from tips`). The legacy save field remains `shop.tips` for compatibility.
- Net Worth V1 is implemented as a compact later-game progress model:
  `Cash + Tofu Business Value + Garage Build Value + Brand Value` toward `$1T Net Worth`. Full asset
  valuation, garage value, company value, and liabilities remain future.
- Basic Mode uses device motion only and does not request location.
- Cup Test motion permission now requests `DeviceMotionEvent` access before optional audio setup, so
  iOS Safari keeps the `Start & Calibrate` user gesture and avoids false permission-denied states.
- Qualified Run Mode is opt-in and may request location only after explicit start.
- Tofu Shop has a live local tick loop: Tofu Press produces Tofu Stock, Prep Counter can produce
  Delivery Orders, visible rates are `/sec`, and shop actions save/render immediately.
- Tofu Shop is idle-first, not clicker-first: manual actions teach the loop, automation exits
  repeated labor, and player decisions rather than clicking speed drive progression.
- Fresh shop state starts with Tofu Stock, one ready Delivery Order, and a running Prep Counter so
  the first order can be fulfilled immediately.
- Fractional Delivery Order progress is shown as ready orders plus a Prep Counter progress bar,
  supporting percent/ETA copy, and pause state, not as a raw decimal order count.
- Tofu Stock now has player-facing runway copy: it is an input for Prep Counter, not the purchase
  currency, and the UI can show when stock is enough for now.
- Player-facing Tofu Shop values, costs, and rewards use compact incremental formatting as they
  grow; internal values remain exact.
- The P0/P1 `FIRST_LOOP_AUDIT.md` findings have been implemented: Tidy Packaging is the first
  relevant Prep Counter upgrade when order prep is the bottleneck, Steady Pressing is stock-specific,
  empty upgrade panels are hidden, and early upgrade cards show before/after impact.
- Tofu Shop Overview is now the first-loop play surface: it includes ready orders, Prep Counter
  progress, the best available order card, and the relevant next station/upgrade so the first loop
  is playable without opening Orders.
- Tofu Shop Overview now includes Next Milestone Bar V1. It shows one current implemented shop goal
  at a time, pairs with Next Best Action, and can show a compact Net Worth V1 line after later shop
  milestones without implementing full valuation.
- First Stamp Celebration uses a dedicated parked-only fanfare layout with one wide Mika reward
  splash, compact reward cards, `Continue Tofu Shop`, and no character-slot/debug copy.
- Post-run Result Cameo and Coach Recap use larger Mika real-art portraits without gray fallback
  tiles, `art pending`, or implementation-note copy.
- Counter Service V1 is the starter automation layer. It is available from the first session, runs
  by default on fresh saves, auto-fulfills Best Available prepared orders every 10 seconds only
  while parked and the page is open, shows supplied/blocked shop-income status, can be upgraded
  through Order Bell, Wider Counter, Pickup Routine, and managed-shop bulk upgrades, and does not
  run during offline progress.
- Managed Shop Phase V1 is implemented as a narrow continuation of Tofu Shop: Counter Service can
  grow from 1 to 2/5/10 order batches through Second Register, Pickup Window, and Counter Crew, and
  Catering Crate gives the midgame a larger stock/Ready Order sink without adding Dream Garage,
  franchise mode, Net Worth, routes, or a new tab.
- Supplier Contract V1 is implemented as the high-midgame Tofu Stock relief path. Soy Supplier
  Contract, Morning Soy Delivery, and Bulk Soy Delivery spend Reputation to add Tofu Stock/sec, so a
  stock-blocked managed shop has an idle-management answer instead of manual Pack Tofu.
- Counter Service batch size is a maximum: if a full batch cannot run the highest-value order, it
  can partially fulfill that tier and fall back to smaller affordable orders without making
  resources negative.
- Tofu Garage high-scale performance guardrails are implemented for current shop scale: live shop
  ticks coalesce visible rendering, top counters avoid unchanged DOM writes, Delivery Orders are a
  capped scalar queue, offline progress uses aggregate delta-time math, and ledger/inline feedback
  remain bounded. `TOFU_GARAGE_PERFORMANCE_AUDIT.md` documents why BigNumber/mantissa-exponent is
  deferred until a later absurd endgame actually needs it.
- The 2026-06 responsiveness regression has been addressed: the large shop tab panel is no longer
  an `aria-live` region, full panel renders update only the active hash surface, and hidden
  Cup/Crew/simulator surfaces are not rebuilt during shop ticks.
- Manager Desk V1 is implemented as the next narrow Tofu Shop layer after Counter Crew and supplier
  scale. Hire Shift Manager raises Counter Service batch size to 25, and Wholesale Pickup converts
  near-full waiting-order queues into capped scalar handoffs when supplied.
- Shop Spirit is still not a first-loop system, but its implemented panel now uses clearer action
  language, fixed sections, and local wallet context: generators use Buy, instant actions spend
  Spirit with immediate gain/cost feedback, timed effects show duration/active state, and token cards
  stay hidden until usable token generation exists.
- Cup-first visitors now get clearer parked paths into Tofu Garage from the landing copy and Cup
  Test result action without making the shop a driving-time prompt. Continue actions land near the
  Tofu Garage action area rather than the page top.
- Don't Spill the Cup result cards now include safe summarized result flavor: Cargo Type, Trip Time,
  Drive Shape, a decorative Cup Trail, Daily Delivery Credit copy, and a Coach Recap focused on
  smooth hands, brake feather, decel control, transition smoothness, cargo balance, passenger
  comfort, and consistency.
- Character-art slots and parked-only placeholders are implemented for future Delivery Crew/shop
  assistant artwork. `CHARACTER_ART_ASSET_INVENTORY.md` defines the current image surfaces, slot
  expectations, and smallest recommended first asset pack.
- Mika, Night Shift Manager, has a six-file MVP art pack integrated from root-level
  `frontend/nospill/images/*.webp` files. Current Mika slots use real parked-only art, and Mika is
  the default parked/result art source when no selected character has assigned art; future optional
  slots still fall back to placeholders until they need dedicated images.
- Tofu Shop Living Scene V1 groundwork is implemented on the parked Overview. It now renders one
  cohesive full-scene image at a time, selected from milestone-based scene variants, while gameplay
  controls remain separate UI. Four real WebP scene assets are integrated; the established-shop
  state temporarily aliases to the upgraded-shop image until dedicated art exists. The normal scene
  card is polished rather than debug-style: real-art states do not show `art pending` copy, raw
  scene IDs, or implementation labels. Scene swaps are intentionally slower than station purchases:
  small purchases stay in cards/buttons, while full-scene images wait for larger story milestones.
  The covered-car scene uses only a restrained purpose hint.
- Delivery Crew is a clickable parked surface with future/deferred copy and CTAs back toward Tofu
  Garage and Don't Spill the Cup; it is no longer a dead visible nav item.
- The Orders tab has been removed because it duplicated Overview. Normal shop order fulfillment now
  stays inline with compact reward feedback so repeated order handoffs do not block the loop.
- Tofu Shop tab panels are scoped: Production owns station buying, Upgrades owns upgrade buying,
  and Passport/Ledger/Settings no longer inherit Generators or Upgrades sections.
- The first Passport stamp now triggers a local Stamp Fanfare on the inline shop-order path, with
  repeat suppression, accessible dialog semantics, reduced-motion handling, and muted-audio respect.
- The first hidden shop system reveal now uses a local Discovery Fanfare: Upgrades are revealed
  when a meaningful upgrade appears, the Upgrades tab gets an explicit `New` badge, and the badge
  clears after the player views Upgrades.
- Tofu Shop tabs are progressively revealed by meaningful milestones and story beats rather than
  raw idle accumulation. Gameplay Routes, Training, old route-garage panels, Crew automation,
  Rivals, License, full Passport, and full Ledger stay hidden during the first loop unless earned.
  Routes currently remain deferred even for high-progress saves until the route system has a clear
  implemented shop purpose.
- Overview has a small order-size ladder: Simple Tofu Box, Family Tofu Tray, and Festival
  Bento consume meaningful typed Tofu Stock/Delivery Order costs and pay typed
  Cash/Reputation/Shop XP rewards.
- `CORE_GAME_SPINE_AUDIT.md` now records what is truly implemented versus scaffolding. Core Game
  Spine V1 adds tested First Upgrade Purchased, First Family Tofu Tray, First 10 Orders, and First
  $100 Cash stamp milestones; Delivery Shelf is the first tested throughput support station; Shop
  Sign is the first tested Reputation support station.
- Tofu Garage now starts idle-first: a 24-stock starter buffer, Tofu Press, Prep Counter, and
  starter Counter Service move the first Simple Tofu Boxes without repeated player labor.
- Cash is the current player-facing purchase balance for stations and upgrades; `shop.tips` remains
  the legacy internal save field and tips remain order-income flavor.
- Next Best Action follows the current bottleneck: fresh saves point to watching the starter shop,
  ready orders point to Counter Service, early low stock points to Tofu Press, high-midgame stock
  blocks point to Supplier Contracts or stock upgrades, and healthy stock with slow orders points
  to Tidy Packaging, Prep Counter, or order prep rather than Tofu Press.
- Counter Service blocked copy now identifies only the missing resource and shows a Tofu Stock ETA
  when the press is actively refilling the next pickup.
- Offline Progress V1 is generous but bounded: the base shop saves 24 hours of AFK-equivalent
  progress, Manager Desk / Shift Manager coverage saves 72 hours, long absences are summarized, and
  Rested Shop Time remains deferred.
- Tofu Garage now has idle-game quality-of-life helpers: Buy Cheapest/Buy All for visible stations
  and upgrades, affordability progress/ETA on non-maxed cards, and returning-player suggested
  actions after offline summaries.
- `TOFU_GARAGE_UNFOLD_AUDIT.md` documents which current resources/systems are meaningful,
  decorative, confusing, or deferred before adding larger systems.
- `TOFU_GARAGE_V1_COMPLETION_AUDIT.md` rates Tofu Garage V1 at about 85% ready and recommends the
  next phase be a parked Covered Car / Dream Build teaser, not full car building.
- Pack Tofu and manual fulfillment are collapsed Manual Backup actions. Don't Spill the Cup is an
  optional certified boost rather than the normal shop bottleneck during order prep, Cash shortages,
  or managed-shop supply shortages.
- Broad shop systems exist as scaffolding or partial implementations: routes, training, old
  route-garage panels, crew automation, Shop Spirit, License, rivals, Passport, and Ledger.
  Gameplay Routes are currently hidden/deferred and direct route-related actions are rejected.
- Regular Customers remain deferred until Counter Service V1 has been playtested. Dream Garage
  remains documented future direction only.
- Covered Car / Dream Build Teaser V1 is implemented as a parked-only managed-shop story/status
  card. It unlocks after the shop has reached Manager Desk scale with Wholesale Pickup progress,
  not during the first loop, and it does not add a Dream Garage tab, garage inventory, parts,
  events, full asset valuation, or car stats.
- First Dream Build Investment Purchase V1 is implemented as a compact Wheels Fund card after the
  covered-car teaser or high-progress qualifying saves. Wheels cost `$50K Cash`, subtract Cash,
  persist locally, and start `$25K Garage Build Value`.
- Exhaust Purchase + Work Level V1 is implemented after Wheels level 3. Exhaust costs `$250K Cash`
  and adds `$125K Garage Build Value`; Seal Joints costs `$375K Cash` and adds another `$200K`;
  Tuned Note costs `$600K Cash` and adds another `$350K`. Heat Wrapped remains target-only/future,
  with no Dream Garage tab, full parts inventory, completed
  build events, or full valuation.
- Dream Build Progress V1 is implemented as a compact Overview card. It counts current work stages
  as Wheels Level plus Exhaust Level against a planned `30` stage build, shows current Wheels and
  Exhaust labels, points to the next dream step, and keeps future tracks locked/deferred.
- Dream Garage / Project Car progression is documented as a future long-term emotional arc:
  Tofu Shop funds the dream car, the garage is the dream, and Don't Spill the Cup remains the
  smooth-control philosophy/proof.
- Ultimate Net Worth has a V1 progress model: Cash plus Tofu Business Value plus Garage Build Value
  can appear after later shop milestones. Dream Garage full asset value, business/franchise/
  car-company layers, and aerospace/space layers are still future direction only.
- Net Worth Milestone Ladder V1 is implemented with compact `$1M`, `$10M`, `$100M`, `$1B`, and
  `$1T Net Worth` targets once Net Worth is visible. The first `$1M` can unlock Local Showcase
  Interest after early Dream Build progress.
- Showcase Interest / Showcase Prep V1 is implemented as the first proof that car investment can
  unlock higher-value opportunities. `Prepare Showcase Display` costs `$500K Cash`, adds `$300K`
  Garage Build Value, persists locally, and unlocks Sponsor Inquiry.
- Sponsor Inquiry V1 is implemented as a one-time parked opportunity after Showcase Prep, early Dream
  Build progress, and first `$1M Net Worth`: accepting it grants `$250K Cash` and `$500K Brand Value`.
  Recurring sponsor packages, completed-car events, auctions, racing/routes, and full Dream Garage
  remain future.
- Frontend tests now fail fast with per-test progress output, optional `TEST_GREP` filtering,
  `TEST_TRACE_CONTEXT=1` diagnostics, and cached VM compilation. The Net Worth/Showcase test path
  was optimized from minute-scale recommendation churn to a targeted run of roughly two seconds.
- `EXTERNAL_REFERENCE_DOPEWARS_AUDIT.md` documents a read-only external mechanics study and safely
  translates capacity, demand, opportunity, and project-goal ideas into future Tofu Driver concepts.
- `EXTERNAL_REFERENCE_ANTIMATTER_DIMENSIONS_AUDIT.md` documents a read-only progression-architecture
  study and safely translates recursive production, next-milestone, station-milestone, automation,
  achievement, challenge, and prestige lessons into future Tofu Shop concepts. It now includes a
  concrete future target order for the Next Milestone bar, station boosts, Counter Service, Regular
  Customers, locked License preview, and later Shop Trials.
- `EXTERNAL_REFERENCE_INCREMENTAL_GAME_DESIGN_TRANSCRIPTS_AUDIT.md` documents two incremental-game
  design transcripts. Its main planning implications are to playtest the first five to ten minutes,
  keep active play and idle progress balanced, automate mastered chores, add small novelty beats
  when repetition begins, and avoid early UI/currency/system overload.
- Delivery Log / Ledger is supporting local history, not the primary game surface.
- Delivery Simulator is hidden by default and is local QA only.
- Privacy-safe PostHog product analytics is implemented as optional runtime config and no-ops when
  disabled or missing a key. Autocapture/session recording are disabled, route views are manual, and
  event properties are sanitized/coarse.
- Discord, payments, accounts, backend sync, ads, service workers, and public profiles are not part
  of the current MVP.

Canonical references:

- `DESIGN.md`: product canon, surfaces, safety/privacy contract, future direction.
- `BALANCE_AND_PROGRESSION.md`: Tofu Shop economy, pacing, progression, and balance contract.
- `IMPLEMENTATION_STATUS.md`: evidence matrix for implemented, partial, decorative, documented-only,
  not implemented, and non-goal systems.
- `README.md`: practical setup, routes, and validation commands.

## Recommended Next Steps

1. Review the full progression spec in `BALANCE_AND_PROGRESSION.md` before coding more gameplay.
2. Playtest and tune the implemented First Loop Contract:
   fresh state, Simple Tofu Box, First Shop Order stamp reveal, first upgrade timing, stock-runway
   recommendations, order-size card density, and early button visibility.
3. Playtest and tune the implemented Order Types slice:
   Simple Tofu Box, Family Tofu Tray, Festival Bento, typed costs/rewards, Fulfill Max labeling,
   disabled reasons, and larger-order reveal timing.
4. Playtest and tune the first 10 minutes:
   confirm the first order, first upgrade, first bottleneck, first Family Tofu Tray, Delivery Shelf,
   and Shop Sign are clear.
5. Continue visual QA on first-loop reveal: verify Overview stays focused, Production remains the
   station support panel, and advanced systems stay hidden until earned.
6. Playtest Counter Service, Supplier Contracts, Manager Desk V1, and Managed Shop V1: confirm First
   10 Orders is the right unlock, the 10/8/6/4 second interval ladder and 2/5/10/25 batch ladder
   feel helpful without deleting choices, Supplier Contracts relieve high-midgame stock traps
   without becoming infinite, Wholesale Pickup clears capped queues without becoming passive
   offline income, and active-page-only automation does not skip pacing.
7. Profile/playtest high-midgame Tofu Garage after the performance guardrails: verify the order
   queue cap feels like a useful Counter Service/Manager Desk bottleneck, 24-hour/72-hour offline
   caps feel fair after a sleep/workday or a few missed days, offline summaries stay compact, no
   hidden sections are rebuilt during shop ticks, and live counters remain responsive on
   mobile/desktop.
8. Playtest bulk-buy and affordability progress after a multi-day return: verify suggested actions
   are useful, no hidden/future systems are purchased, and the progress bars do not make fake ETA
   promises while income is blocked.
9. Keep gameplay Routes deferred until they have a specific safe, fictional, parked-only purpose
   that fits the shop/Dream Build loop. Do not reintroduce a Routes tab, Route Familiarity/Careful
   Notes purchases, route Spirit actions, or route recommendations until that design is implemented.
10. Playtest Covered Car / Dream Build Teaser V1 in high-progress saves: confirm the card unlocks
   after Manager Desk / Wholesale Pickup progress, Next Milestone points to it once, Next Best
   Action yields to urgent stock/queue/upgrade bottlenecks, and the seen state persists.
11. Playtest First Dream Build Investment Purchase V1, Exhaust Purchase + Work Level V1, and Dream
   Build Progress V1: confirm the `$50K` Wheels Fund is hidden on fresh saves, Exhaust stays hidden
   until Wheels level 3, Buy Exhaust/Tuned Note appear only when affordable and stable, Garage Build
   Value and `6 / 30` progress totals stay clear, Heat Wrapped remains target-only, and urgent shop
   bottlenecks still win.
12. Playtest Net Worth Milestone Ladder V1, Showcase Prep V1, and Sponsor Inquiry V1: verify first
   `$1M` timing, Showcase Prep affordability, Sponsor reward pacing, one-time feedback, Brand Value
   visibility, and that urgent shop bottlenecks still override distant Net Worth goals.
13. Run the Tofu Garage V1 completion gate from `TOFU_GARAGE_V1_COMPLETION_AUDIT.md`: fresh
   3-minute flow, high-progress responsiveness, Manager Desk/Wholesale usefulness, and Shop Spirit
   usefulness.
14. Tune the implemented Next Milestone Bar and Station Milestone Boosts V1 against playtest
   behavior before adding higher station thresholds.
15. Add novelty only when playtesting shows repetition: candidate order is Managed Shop tuning,
   Shop Spirit tuning, covered-car teaser timing, then Regular Customers V1.
   Do not jump to License prestige, Shop Trials, social systems, Dream Garage mechanics, or Net
   Worth systems until the local shop loop keeps a player engaged.
16. Expand balance tests only where playtesting reveals gaps:
   mobile density, exact time-to-buy targets, and edge cases around order prep, missing resources,
   and Passport reveal timing.
17. Playtest the new Cup Test result-card recap on real drives: confirm Cargo Type, Drive Shape,
   Cup Trail, Daily Delivery Credit, and Coach Recap feel encouraging without implying speed,
   distance, route difficulty, racing technique, or public-road competition.
18. Generate optional dedicated `scene_busy_shop_established.webp` art if playtesting shows the
   midgame needs a clearer visual step beyond the upgraded-shop scene.
19. Keep testing the polished single-image Living Scene on phone and desktop: verify one-click shop
   controls, tab switches, nav buttons, image flicker, oversized empty panels, debug/pending copy,
   or controls being pushed too far down.
20. Consider one subtle overlay or tofu/order animation inside the same scene panel with a static
   reduced-motion fallback.
21. Playtest living-scene pacing from a fresh save; tune thresholds only after observing first-session
   timing. Later, design the first actual garage reveal scene without activating full Dream Garage
   mechanics.
22. Playtest Mika placement on phone and desktop result/recap layouts, then decide whether future
   optional slots such as share-card, Passport-detail, Ledger, or offline-progress art need
   dedicated images.
23. Re-test the Cup Test on real iPhone Safari and Android Chrome over HTTPS, with audio enabled and
   muted, including first load, `#/cup-test` reload, permission-needed, permission-denied, and
   no-motion-data cases.
24. Verify PostHog production config on the deployed Cloud Run revision only after a separate Tofu
   Driver PostHog browser key exists.
25. Confirm custom-domain DNS and certificate status for `tofudriver.com`.
26. Rename `frontend/nospill/` to a product-native path only as a separate migration.

Transcript-derived priority ladder:

1. `Now`: playtest the first 5-10 minutes and tune the current implemented shop spine.
2. `Now`: playtest Station Milestone Boosts V1, Counter Service batch upgrades, Supplier Contracts,
   Catering Crate, and stock-pressure tuning.
3. `Soon`: first 10-minute tuning, support-station pacing, Shop Spirit emergency-spend tuning, and
   possible 25+ station milestone design.
4. `Later`: Regular Customers V1, Dream Garage Stage 0, and License preview.
5. `Avoid for now`: social systems, premium cosmetics, Net Worth valuation, broad route expansion,
   and any new tab/currency that does not solve a felt bottleneck.

Do not build advanced systems next. The First Loop Contract is now implemented enough for
playtesting; Routes, Crew, Garage, Shop Spirit, Rivals, License, and monetization/social/profile
features stay deferred until the first 10 minutes are playtested and tuned.

Future Dream Garage milestone sequence:

1. Verify Wheels purchase V1, Wheels Work Levels V1, Exhaust Purchase + Work Level V1, and Dream
   Build Progress V1:
   `$50K Cash` Wheels Installed, `$75K` Polished Wheels, `$150K` Balanced Fitment, `$250K` Exhaust
   Fitted, `$375K` Sealed Joints, `$600K` Tuned Note, `6 / 30` progress, Garage Build Value totals,
   persistence, and priority rules.
2. Playtest whether the next slice should add Heat Wrapped or return to Wheels levels 4-5.
3. Refine Dream Build progress across one-purchase part tracks; do not buy duplicate parts.
4. Refine Garage Build Value from careful work levels after the first two tracks feel clear.
5. Design the first completed-build event threshold and event choice requirements.
6. Later implement Keep / Show / Auction choice only after part progression is proven.
7. Much later connect completed builds to business expansion, collector networks, and scalable
   garage/company paths.

Completed-car events are not immediate scope. Keep Showcase, Closed-Course Exhibition, Auction,
Collector Offer, and business expansion documented until the Dream Build part-level loop is fun.

Future endgame/business sequence:

1. Keep the $1T Net Worth target stable; tune the V1 milestone ladder only after playtest.
2. Stabilize and tune the First Loop Contract.
3. Tune Next Milestone Bar V1, Supplier Contracts, Counter Service/Managed Shop V1, and Station
   Milestone Boosts V1 before adding more station thresholds.
4. Keep `tips` as flavor copy for order rewards while Cash remains the only player-facing liquid
   money balance.
5. Tune Net Worth V1 reveal timing and first `$1M` Showcase Interest timing; the $1T goal does not
   increase, only progress toward `$1T Net Worth` increases.
6. Keep Tofu Business Value and Garage Build Value as simple V1 estimates until full asset valuation
   is designed.
7. Add covered-car teaser pacing and Dream Garage Stage 0 before any asset valuation system.
8. Add the first car part as a Cash investment.
9. Add sell/keep project car decisions later.
10. Add business valuation only after Dream Garage, project-car sale, and franchise loops are fun.
11. Keep shares/company ownership deferred as a later fictional founder mechanic, not the main
   endgame target.
12. Add social showcase/scout concepts only after a privacy/account/backend design exists.
13. Add car manufacturing, rocket company, and space league layers only as late-game/future patch
   content.

Deferred until after the First Loop Contract is playtested:

- Routes
- Crew
- Garage
- Dream Garage / Project Car progression
- Ultimate Net Worth / business valuation / franchise scaling / car manufacturing / aerospace
- Tofu Demand Board / Supplier Market / Garage Parts Market
- Shop Trials
- Shop Spirit
- Rivals
- License
- monetization/social/profile features

## Resolved Decisions

- Fresh Tofu Shop state starts with one ready Delivery Order, one Tofu Press, one Prep Counter, and
  running starter Counter Service.
- Fresh Tofu Shop state starts with a 24 Tofu Stock buffer so the first few Simple Tofu Box pickups
  can complete automatically and reach the first useful upgrade without Pack Tofu.
- Tofu Stock is an ingredient/runway resource, not the purchase currency.
- Cash is the current player-facing liquid currency, with tips as flavor for order income.
- Starter Counter Service is the early money-conversion action.
- Counter Service blocked copy should identify the actual missing resource and show a Tofu Stock
  ETA when the press is refilling the next handoff.
- Don't Spill the Cup is optional for ordinary Tofu Shop progression.

## Open Questions

- Is 1 order every 40 seconds the right early Prep Counter pace?
- Should the first meaningful purchase usually be Prep Counter, Tofu Press, or Steady Pressing?
- Should Steady Pressing cost $20, or should the first upgrade happen after exactly two
  fulfilled orders?
- When should Passport become a visible tab instead of a teaser?
- How many active buttons should be visible before minute 10?
- Tune how often Manual Backup should be opened after Tofu Press and Supplier Contracts are stable.
- Should the first License Exam target be 4 hours, 6 hours, or later after playtesting?
- Should saved local sessions migrate if the storage key changes?
- Should merch unlocks remain local-only for the MVP?
- Which Super Cute Collectibles product URLs should be added after products exist?
- Should Qualified Run verification remain share-private by default?
- What backend, if any, is needed later for earned merch unlock tokens?
- What moderation policy is required before accepting any user-generated community reports?

## Non-Goals For The Current Slice

- No new gameplay systems.
- No economy rebalance yet.
- No React or framework migration.
- No accounts.
- No backend sync.
- No analytics beyond explicitly configured, privacy-safe PostHog product events.
- No network calls/uploads beyond explicitly configured PostHog analytics.
- No service workers.
- No payment flow.
- No pay-to-progress, paid score boosts, paid speed boosts, loot boxes, or intrusive ads.
- No leaderboards or public road competition.
- No raw GPS, raw motion, route trace, map, street, or speed-log uploads.
- No safety certification, insurance, legal compliance, or real-world driving protection claims.
