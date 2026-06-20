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
  of removing/reinserting cards during live ticks. Multi-resource upgrade cards label Cost, Cash
  progress, and Reputation progress explicitly.
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
- The Cup Test front door is one primary `Start Cup Test` action. The app attempts certification
  automatically after the user starts, requests motion first, and may request location to qualify
  route-context achievements.
- Denying or lacking location no longer blocks play; the completed run is labeled `Local Result`.
  Runs with real motion and usable route data can be labeled `Certified Result`. Production UI no
  longer exposes Simulation Mode; deterministic simulator helpers remain test-only and surface as
  Local Result in share/result labels.
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
- Tofu Shop Overview is now a glance-first play surface: it defaults to Goal Stack, one compact
  operational shop card, one compact build-status card, and Recent/While Away feedback. Detailed
  prep/order math, order cards, Counter Service detail, formulas, and reward/status surfaces live
  behind Details or in their specific tabs.
- Tofu Shop Overview now uses Overview Glance Mode V1. It separates Now, a stable Pinned Goal, and
  the long-term Era Goal so a large Net Worth target does not hide the next meaningful shop or Dream
  Build target. Long explanations/formulas move behind stable keyed Details that stay open across
  live ticks, saved Builder Notes collapse until edited, Counter Service shows only the relevant
  Start/Pause action, and offline summaries stay compact with a real Ledger CTA. Goal Stack buttons
  are suppressed unless they perform a concrete useful action, queue-full copy stays stable, and
  recommendations mention upgrades only when a visible implemented upgrade is actually available.
  Detailed car work lives in the earned Dream Build tab, and future-only build steps stay labeled
  without dead buttons.
- First Stamp Celebration uses a dedicated parked-only fanfare layout with one wide Mika reward
  splash, compact reward cards, `Continue Tofu Shop`, and no character-slot/debug copy.
- Post-run result screens are story-card-first. The primary card shows status, cargo/rank,
  commentary, concise Mika coach summary, Route Smoothness Outline when usable local route data
  exists, Abstract Cup Trail as the privacy/fallback view, and the share/take-another/garage
  actions; XP, rewards, merch, passport, route context, signal quality, and full Coach Recap are
  collapsed under Run Details by default.
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
- High-Scale Counter Contracts V1 is implemented as the late parked shop Cash-conversion path.
  Wholesale Counter Contract, Catering Account, and Event Vendor Contract spend Cash plus
  Reputation to unlock Wholesale Case, Event Catering Load, and Venue Supply Contract order types
  and raise Counter Service batch floors to 100, 250, and 1000.
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
  language, fixed sections, and local wallet context: permanent generators show level/max and cap at
  Level 25, instant actions use Activate wording with immediate gain/cost feedback, timed effects
  show duration/active state, and token cards stay hidden until usable token generation exists. `Buy
  All Affordable` now bulk-buys permanent Spirit Generators only, respects max levels, and leaves
  instant/timed/token actions untouched.
- Dashboard actions that say `View Counter Service` now open the Tofu Garage overview at the
  Counter Service card so players can find the running service and its upgrade path.
- Cup-first visitors now get clearer parked paths into Tofu Garage from the landing copy and Cup
  Test result action without making the shop a driving-time prompt. Continue actions land near the
  Tofu Garage action area rather than the page top.
- Don't Spill the Cup result cards now include safe summarized result flavor: Cargo Type, Trip Time,
  Drive Shape, a decorative Cup Trail, Daily Delivery Credit copy, and a Coach Recap focused on
  smooth hands, brake feather, decel control, transition smoothness, cargo balance, passenger
  comfort, and consistency.
- Qualified Route Context V1 is implemented for completed Certified Results with usable local route
  data, and route-outline rendering is available for any non-simulated result with usable local route
  data. Route Smoothness Outline is the primary result/share artifact when route data exists;
  Abstract Cup Trail remains the privacy/fallback view. Route-outline sharing/downloading shows
  warning copy, copied text uses labels/buckets only, and there are no map tiles, street names,
  coordinates, speed overlays, automatic sharing, uploads, backend, accounts, public profiles, or
  leaderboards.
- Hidden Shirt Unlock V1 is implemented as a local parked post-run merch reveal. The Tofu Driver
  `Not Fast. Smooth.` Tee link appears only after a Certified Perfect Pour or route-context Perfect
  Pour achievement, is repeat-suppressed after acknowledgement, and does not use backend
  verification, Shopify APIs, auto-opening, active-drive prompts, score changes, or economy effects.
- Hidden Sticker Rewards V1 is implemented as the first hidden merch tier. The Tofu Driver
  `Not Fast. Smooth.` Sticker unlocks from a first Certified Result, and the Tofu Driver Penguin
  Sticker unlocks from a Certified Result with an unlocked Penguin mascot selected. Sticker reveals
  are ordered before shirt reveals, URLs stay hidden while locked, and old shirt-unlocked saves
  migrate to include the matching sticker.
- Hidden Penguin Shirt Unlock V1 is implemented as a separate local parked merch reveal. The Tofu
  Driver Penguin Delivery White Tee appears only after a Certified Result completed with a Penguin
  mascot unlocked and selected, has per-item repeat suppression, and does not change scoring, rewards, shop
  economy, Net Worth, or existing `Not Fast. Smooth.` Tee behavior.
- Character-art slots and parked-only placeholders are implemented for future Delivery Crew/shop
  assistant artwork. `CHARACTER_ART_ASSET_INVENTORY.md` defines the current image surfaces, slot
  expectations, and smallest recommended first asset pack.
- Mika, Night Shift Manager, has a six-file MVP art pack integrated from root-level
  `frontend/nospill/images/*.webp` files. Current Mika slots use real parked-only art, and Mika is
  the default parked/result art source when no selected character has assigned art; future optional
  slots still fall back to placeholders until they need dedicated images.
- Three penguin mascot assets are integrated as parked-only Delivery Crew / collection cards:
  `penguin_driver_icon.webp`, `penguin_delivery_buddy.webp`, and
  `penguin_tofu_driver_sticker.webp`. They are cosmetic only and do not replace Mika's shop,
  coach, result, or reward surfaces.
- Tofu Shop Living Scene V1 groundwork is implemented on the parked Overview. It now renders one
  cohesive full-scene image at a time, selected from milestone-based scene variants, while gameplay
  controls remain separate UI. Four real WebP scene assets are integrated; the established-shop
  state temporarily aliases to the upgraded-shop image until dedicated art exists. The normal scene
  card is polished rather than debug-style: real-art states do not show `art pending` copy, raw
  scene IDs, or implementation labels. Scene swaps are intentionally slower than station purchases:
  small purchases stay in cards/buttons, while full-scene images wait for larger story milestones.
  The covered-car scene uses only a restrained purpose hint. `old_car_out_back_story_splash.webp`
  is wired separately as a one-time parked story splash for that milestone, not as the normal scene
  background or a Dream Garage system.
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
- `TOFU_DRIVER_TOY_SIMULATION_AUDIT.md` translates toy-first, simulation, expression, failure,
  needs/maintenance, discovery, black-box, and probability design principles into Tofu Driver
  boundaries. It finds constraint design and progressive reveal strong, expression/story tools
  partial, and needs/probability systems future-only.
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
  Tuned Note costs `$600K Cash` and adds another `$350K`; Heat Wrapped costs `$1.1M Cash` and adds
  another `$650K`; Showcase Finish costs `$2M Cash`, adds another `$1.25M`, and completes the
  current Exhaust track.
- Dream Build Tab V1 is implemented as an earned Tofu Garage tab after the build starts. Its default
  view is compact: current build summary, active work card, Work Tracks glance list, collapsed
  Builder Note, and collapsed event/future/catalog sections. Detailed Wheels, Exhaust, Suspension,
  Tires, Brakes, Induction, Drivetrain, Aero, Garage Build Value, Garage Event Board, and tuning
  catalog content stay behind Details so the Overview can stay compact. The full canonical parts
  list lives in `TOFU_GARAGE_TUNING_CATALOG.md`.
- Tofu Garage is allowed to use authentic tuning vocabulary as fictional standalone garage-game
  language. Garage parts may affect future Build Value, Build Score, Style, Reliability, Event Fit,
  Race Class, Collector Appeal, Garage Reputation, Brand Value, prize potential, and
  car-management outcomes, but never Don't Spill the Cup scoring, certification, route-context
  achievements, Driver XP, or real-world proof.
- Suspension Track Completion V1 is implemented after Exhaust Level 5. Suspension Refreshed, Ride
  Height Set, Alignment Dialed, Corner Balance, and Showcase Stance cost Cash, add a combined
  `+$47M Garage Build Value`.
- Tires & Rubber Track V1 and Brakes & Control Track V1 are implemented after Suspension Level 5.
  Tires adds `+$505M Garage Build Value`; Brakes adds `+$4.05B Garage Build Value`.
- Induction & Cooling Track V1 is implemented after Brakes Level 5 plus Local Showcase completion.
  It adds Sports Intercooler through Anti-Lag & Cooling Package and `+$35.25B Garage Build Value`.
- Garage Event Board V1 is implemented inside the Dream Build tab as the first parked event bridge.
  It unlocks at `$100M Net Worth` plus Tires & Rubber Level 5 and resolves four one-time fictional
  events instantly: Local Showcase, Sponsor Display, Closed-Course Exhibition, and Collector
  Preview. Events cost Cash and grant defined local Cash, Brand Value, Garage Reputation, and badge
  rewards. It stays separate from Car Management. Multiple cars, auctions, collector-sale offers,
  public profiles, uploads, and network calls remain future.
- Car Management V1 is implemented after First Complete Build. It creates one local managed-car
  snapshot and adds one-active-assignment parked timers for Showcase Rotation, Sponsor Demo Day,
  and Closed-Course Exhibition Booking. Rewards are collected explicitly as Cash, Brand Value, and
  Garage Reputation. Multiple cars, auctions, collector/sell offers, backend/uploads, and network
  calls remain future.
- Core Build Progress V2 counts current work stages as Wheels Level plus Exhaust, Suspension,
  Tires, Brakes, Induction, Drivetrain, Aero, Final Detail, and Shakedown completion against a
  planned `40` stage core build, shows current part labels, points to the next dream step, and keeps
  future tracks locked/deferred.
  The current implemented maximum is `40 / 40` with First Complete Build. Goal Stack then points
  to Car Management assignment states so the completed car has a managed-asset loop.
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
- `TOFU_DRIVER_TOY_SIMULATION_AUDIT.md` now treats Result Story Caption V1, Failure Flavor V1, and
  Result Card Visual Polish V1 as implemented post-run story tools. Garage Pride / Builder Note V1
  is now implemented as the matching parked Dream Build expression slice.
- Result Story Caption V1 is implemented on parked post-run Cup Test result screens. It lets the
  player add one sanitized local caption to copied share text and downloaded share cards; it is not
  a full comic editor and does not add uploads, accounts, backend, public profiles, scoring changes,
  reward changes, or economy effects.
- Failure Flavor V1 is implemented as deterministic local Cargo Commentary on parked post-run Cup
  Test results and share cards. It keeps player Story Captions separate, uses gentle cargo-centered
  copy, and does not change scoring, qualification, Driver XP, shop rewards, Net Worth, Garage Build
  Value, Brand Value, or economy balance.
- Result Card Visual Polish V1 is implemented as parked post-run UI polish: Result Card combines
  result status, cargo facts, Cargo Commentary, concise coach summary, optional Story Caption, Route
  Smoothness Outline when usable local route data exists, Abstract Cup Trail fallback, and
  `Not faster. Smoother.` before collapsed Run Details, and the downloaded card uses the same mini
  story hierarchy.
- Garage Pride / Builder Note V1 is implemented on parked Tofu Garage Overview after the Dream
  Build starts. It lets the player save one sanitized local note about the current build; it is not
  shown on Cup Test share cards and does not change scoring, rewards, Net Worth, Garage Build Value,
  Brand Value, or economy balance.
- Delivery Log / Ledger is supporting local history, not the primary game surface.
- Production Simulation Mode has been removed. Query/localStorage simulator activation is disabled;
  deterministic simulator helpers remain available only to tests and cannot grant certified
  route-context achievements or hidden merch.
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
6. Playtest Counter Service, Supplier Contracts, Manager Desk V1, High-Scale Counter Contracts V1,
   and Managed Shop V1: confirm First
   10 Orders is the right unlock, the 10/8/6/4 second interval ladder and 2/5/10/25 batch ladder
   feel helpful without deleting choices, Supplier Contracts relieve high-midgame stock traps
   without becoming infinite, Counter Contracts make high-Reputation/high-backlog saves identify
   Cash conversion instead of Prep Capacity as the bottleneck, Wholesale Pickup clears capped queues
   without becoming passive offline income, and active-page-only automation does not skip pacing.
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
11. Playtest First Dream Build Investment Purchase V1, Exhaust Purchase + Work Level V1, Dream
   Build Tab V1, Suspension/Tires/Brakes tracks, and Core Build Progress V2: confirm the `$50K`
   Wheels Fund is hidden on fresh saves, Exhaust stays hidden until Wheels level 3,
   Buy Exhaust/Tuned Note/Heat Wrapped/Showcase Finish appear only when affordable and stable, the
   Dream Build tab appears only after build start, Suspension work appears in stable order after
   Exhaust Level 5, Tires, Brakes, Induction, Drivetrain, Aero, Final Detail, and Shakedown
   continue in stable order, Garage Build Value and `40 / 40` progress totals stay clear, Car
   Management unlocks after First Complete Build, and urgent shop bottlenecks still win.
12. Playtest Garage Event Board V1: verify `$100M Net Worth` plus Tires Level 5 unlock, event
   reward pacing, Garage Reputation clarity, Brand Value/Net Worth changes, badge status, repeat
   prevention, and separation from Car Management assignments.
13. Playtest Net Worth Milestone Ladder V1, Showcase Prep V1, and Sponsor Inquiry V1: verify first
   `$1M` timing, Showcase Prep affordability, Sponsor reward pacing, one-time feedback, Brand Value
   visibility, and that urgent shop bottlenecks still override distant Net Worth goals.
14. Run the Tofu Garage V1 completion gate from `TOFU_GARAGE_V1_COMPLETION_AUDIT.md`: fresh
   3-minute flow, high-progress responsiveness, Manager Desk/Wholesale usefulness, and Shop Spirit
   usefulness.
15. Tune Overview Glance Mode V1, the retained Next Milestone helper, and Station Milestone Boosts
   V1 against playtest behavior before adding higher station thresholds. Confirm Pinned Goal stays
   stable, Details remain discoverable on mobile, and Goal Stack copy stays honest without dead CTAs.
16. Add novelty only when playtesting shows repetition: candidate order is Managed Shop tuning,
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
19. Review legacy banner/logo/shirt duplicates after production usage is fully confirmed. Active
   runtime references currently include `tofu_driver_logo.webp`, `tofu-driver-shirt-1.png`, and
   `tofu-driver-app-image.png`; the remaining banner/logo/shirt files are preserved as
   legacy/deployment assets for now.
20. Keep testing the polished single-image Living Scene on phone and desktop: verify one-click shop
   controls, tab switches, nav buttons, image flicker, oversized empty panels, debug/pending copy,
   or controls being pushed too far down.
21. Consider one subtle overlay or tofu/order animation inside the same scene panel with a static
   reduced-motion fallback.
22. Playtest living-scene pacing from a fresh save; tune thresholds only after observing first-session
   timing. Later, design the first actual garage reveal scene without activating full Dream Garage
   mechanics.
23. Playtest Mika and penguin collection placement on phone and desktop result/recap/crew layouts, then decide whether future
   optional slots such as share-card, Passport-detail, Ledger, or offline-progress art need
   dedicated images.
24. Re-test the Cup Test on real iPhone Safari and Android Chrome over HTTPS, with audio enabled and
   muted, including first load, `#/cup-test` reload, permission-needed, permission-denied, and
   no-motion-data cases.
24. Verify PostHog production config on the deployed Cloud Run revision only after a separate Tofu
   Driver PostHog browser key exists.
25. Confirm custom-domain DNS and certificate status for `tofudriver.com`.
26. Playtest Result Story Caption V1: check whether the 90-character limit, preset chips, share text,
   and downloaded card caption box feel expressive without cluttering the result screen.
27. Playtest Failure Flavor V1: confirm Cargo Commentary feels funny and recoverable for rough
   outcomes without shaming the player or implying performance-driving coaching.
28. Playtest Result Card Visual Polish V1 on mobile and desktop: confirm the compact Result Card,
   Cargo Commentary, Story Caption, concise Coach Summary, Route Smoothness Outline/Abstract Cup
   Trail fallback, collapsed Run Details, and downloaded card boxes feel readable without crowding
   the result actions.
29. Real-device QA Qualified Route Context V1: verify route-context buckets, warning copy, primary
   Route Smoothness Outline rendering, Abstract Cup Trail fallback, and Winding/Stop-and-Go/Technical
   achievement gates without changing base Cup Test scoring or rewarding speed.
30. Playtest Garage Pride / Builder Note V1: confirm the 100-character limit, preset chips, saved
   note display, and local-only positioning create build ownership without feeling like required
   progression.
31. Rename `frontend/nospill/` to a product-native path only as a separate migration.

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

1. Verify Dream Build Tab V1, Wheels purchase V1, Wheels Work Levels V1, Exhaust Purchase + Work
   Level V1, Suspension Track Completion V1, Tires & Rubber Track V1, Brakes & Control Track V1,
   Drivetrain & Transmission Track V1, and Core Build Progress V2:
   `$50K Cash` Wheels Installed, `$75K` Polished Wheels, `$150K` Balanced Fitment, `$250K` Exhaust
   Fitted, `$375K` Sealed Joints, `$600K` Tuned Note, `$1.1M` Heat Wrapped, `$2M` Showcase Finish,
   `$4M` Suspension Refreshed, `$7.5M` Ride Height Set, `$12M` Alignment Dialed, `$20M` Corner
   Balance, `$35M` Showcase Stance, Tires through `$300M` Event Tire Set, Brakes through `$2.25B`
   Brake Balance & Control Package, Sports Intercooler, Electronic Boost Control, Hybrid Turbo
   Upgrade, Big Turbo Kit, Anti-Lag & Cooling Package, Drivetrain through `$135B` Sequential
   Transmission Package, Aero through `$1T` Carbon Body & Roll Cage, Final Detail, Shakedown
   Complete, `40 / 40` progress, Garage Build Value totals, persistence, and priority rules.
2. Playtest Car Management V1 assignment durations/rewards and whether one active assignment is
   enough for the first completed car.
3. Design the next parked event/showcase expansion loop.
4. Add multiple cars.
5. Add the next era unlock.
6. Much later connect completed builds to business expansion, collector networks, and scalable
   garage/company paths.

Completed-car events are not immediate scope. Keep Showcase, Closed-Course Exhibition, Auction,
Collector Offer, and business expansion documented until the Dream Build part-level loop is fun.

Future endgame/business sequence:

1. Keep the $1T Net Worth target stable; tune the V1 milestone ladder only after playtest.
2. Stabilize and tune the First Loop Contract.
3. Tune Overview Goal Stack V1, Supplier Contracts, Counter Service/Managed Shop V1, and Station
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
- High-scale Counter Contracts are the late money-conversion action when stock, ready orders, and
  Reputation are ahead of Cash.
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
- Should future merch unlocks remain local-only, or should backend-issued unlock tokens be built
  after real demand?
- Which additional Super Cute Collectibles product URLs should be added after products exist?
- Should Certified Result verification remain share-private by default?
- What backend, if any, is needed later for earned merch unlock tokens?
- What moderation policy is required before accepting any user-generated community reports?
- Do Result Story Caption V1, Failure Flavor V1, and Result Card Visual Polish V1 create enough
  toy-like expression without requiring public sharing or backend storage?

## Non-Goals For The Current Slice

- No new gameplay systems.
- No full comic editor, stickers, image uploads, camera/photo tools, public profiles, or backend
  sharing.
- No hunger, fatigue, needs, maintenance, or probability systems until separately scoped.
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
