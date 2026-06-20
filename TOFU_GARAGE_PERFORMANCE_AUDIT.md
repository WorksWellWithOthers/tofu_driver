# Tofu Garage Performance Audit

This audit records the current high-scale idle-game performance approach for Tofu Garage. It uses
the provided high-number incremental-game guidance as design input, but the immediate fixes focus on
rendering, formatting, aggregate simulation, and bounded UI state rather than a full BigNumber
migration.

## Reference Guidance

- Very large future values can be represented as `mantissa + exponent` when the game intentionally
  grows beyond normal JavaScript number comfort.
- JavaScript `Number` is sufficient for current Tofu Garage scale and for the documented `$1T`
  future target, but precision and readability become design issues as values grow.
- The number value itself usually is not the lag source. Formatting huge values and rewriting
  DOM/canvas text too often is more likely to hurt performance.
- UI should update at a visible cadence, not every simulation operation.
- Offline progress should use aggregate delta-time math, not simulate every second.
- Tiny additions can be ignored when they do not change the displayed value.

## Current Resource Representation

Tofu Garage resources are scalar JavaScript numbers in local game state:

- `shop.tofuStock`
- `shop.deliveryOrders`
- `shop.tips` as the legacy internal Cash field
- `shop.reputation`
- `shop.shopXP`
- station counts, upgrade levels, and lifetime counters

`Delivery Orders` is a single scalar count plus fractional generator carry. It is not an array of
per-order objects. This is important: a million ready orders should remain one number, not a million
items.

Current runtime caps still keep values well within normal `Number` range. The current lag risk is
therefore UI churn, large formatted strings, offline catch-up shape, and unbounded history/backlog
growth, not mathematical overflow.

## Simulation Cadence

- Open-shop generator simulation runs on a local interval.
- Each simulation tick uses elapsed delta time with a maximum catch-up window.
- Counter Service processes elapsed handoff attempts in bounded batches.
- Resources are clamped to safe non-negative scalar values.

The simulation does not need per-order objects or per-second loops for current shop resources.

## Render Cadence

Live shop ticks now use a coalesced shop render path:

- `SHOP_RENDER_THROTTLE_MS` controls the visible live-render cadence.
- `renderLiveShopUpdate()` updates the live state and refreshes only the parked Tofu Garage shop
  surface when that surface is active.
- A compact render signature prevents redundant shop rerenders when the visible shop values have
  not changed.
- Top resource text uses `setTextIfChanged()` so unchanged text nodes are not rewritten.
- Button-click and route-change paths can still render immediately for responsiveness.

This keeps the simulation independent from DOM churn.

## Formatting Hot Paths

Player-facing shop values use compact formatting:

```text
1M
+$7.8K/min
+250/sec
```

The UI should not expose long raw decimals or full large integer strings when a compact suffix is
clearer. Formatting remains display-only; internal values are still numeric state.

## Offline Catch-Up

Offline shop progress uses aggregate elapsed-time math through the same generator earnings path.
It does not simulate every second and does not create per-order objects.

Current V1 behavior:

- `shop.lastGeneratorTickAt` / `shop.lastShopTickAt` store the local timestamp used for catch-up
- actual elapsed time is split into direct capped time and excess time with aggregate math
- direct offline progress is capped at 24 hours for the base shop
- Manager Desk / Shift Manager coverage raises the direct cap to 72 hours
- Tofu Stock, Delivery Orders, Shop Spirit, and passive shop rates accrue as they would while AFK,
  subject to current V1 limits
- generated waiting orders respect the order queue cap
- Counter Service remains active-page-only and does not auto-fulfill offline
- offline summaries are compact, appear once per returned progress window, mention excess time when
  capped, and mention when Counter Service did not fulfill offline
- extreme absences such as months or years are capped and summarized; they do not produce NaN,
  Infinity, per-second loops, per-order loops, or whole-game skips
- Rested Shop Time is deferred until it can be added without making normal shop speed feel punitive

## Backlog And History Bounds

Tofu Garage now has explicit high-scale guardrails:

- `Delivery Orders` has a queue cap so waiting orders do not grow forever into meaningless UI noise.
- When the order queue is full, Prep Counter progress pauses and Next Best Action points toward
  clearing the queue through Counter Service instead of producing more orders.
- Ledger entries are capped.
- Inline shop feedback is a single compact message, not an unbounded feed.
- Counter Service messages are batched for multi-order handoffs.
- Upgrade shelves use unlock-based visibility and fixed ordering. Live affordability, queue,
  stock, ETA, or maxed-state changes update card copy in place instead of removing/reinserting
  cards and moving click targets.
- Multi-resource upgrade copy labels Cost, Cash progress, and Reputation progress explicitly so
  changing affordability text does not read like a second price.
- Shop Spirit `Buy All Affordable` is bounded and generator-only. It buys permanent Spirit
  Generators in fixed display order, respects the Level 25 generator cap, emits one compact
  feedback/ledger entry, and never triggers instant Spirit actions, timed effects, tokens, routes,
  Dream Build, merch, or normal upgrades.

These bounds preserve the idle-management decision instead of rewarding unbounded backlog size.

## Hidden Surface Rendering

The app keeps hash surfaces separate. Live shop ticks refresh the shop surface only when Tofu Garage
is active. Hidden surfaces should not be rebuilt every shop tick.

Full app rerenders still happen for route changes, button actions, and result transitions where the
player expects immediate feedback.

## Responsiveness Regression: 2026-06

Observed high-midgame saves could become barely clickable around Shop Level 500+, a capped 1M
Delivery Order queue, maxed Counter Service, and repeated offline/automation messages.

Suspected causes:

- duplicate shop tick/render timers
- hidden surface rerenders during shop ticking
- large `aria-live` regions being replaced repeatedly
- repeated offline and Counter Service messages feeling like duplicated content
- active tab content being appended instead of replaced

Actual root cause found:

- The shop tab panel was a large `aria-live` region, and live shop refreshes replaced that whole
  panel. At high scale this could repeatedly queue large accessibility updates while the player was
  trying to click.
- `renderGamePanels()` refreshed shop, Cup Test, crew, simulator, delivery log, and merch surfaces
  together even when most of those surfaces were hidden. This made high-midgame shop updates do
  unnecessary hidden work.
- The Delivery Board visibility path still treated shop rendering as a place to update driver-board
  content, which added to the hidden-surface churn.

Fix applied:

- The large `shop-tab-panel` is no longer an `aria-live` region. The compact inline result remains
  the live status surface for order, automation, and purchase feedback.
- Full panel renders now update only the active hash surface: Tofu Garage, Cup Test, or Delivery
  Crew.
- Hidden sections are toggled consistently instead of being partially left to earlier render paths.
- Delivery Board rendering stays on the Cup Test surface.
- Regression tests now verify that hidden Cup/Crew surfaces are not rebuilt during a shop-surface
  render, the large shop tab panel is not live, ledger/history remain capped, and shop queues remain
  scalar numbers.

Remaining risks:

- Real mobile browsers should still be profiled with an actual high-midgame save because CSS layout,
  images, and accessibility settings can vary by device.
- Counter Service and Wholesale Pickup still update live shop state while the page is open; if later
  layers add more live counters, they should use the same active-surface and compact-feedback rules.

High-midgame reproduction fixture:

- Shop Level 500+
- Delivery Orders at the 1M queue cap
- Counter Service running with Counter Crew purchased
- Supplier Contracts purchased
- high Reputation, low-to-mid Cash
- Upgrades tab or Overview visible while the live shop tick runs

## Living Scene Interaction Regression: 2026-06

Observed after the slower Living Scene pacing pass:

- Tofu Garage buttons could require double-clicking or feel unresponsive, especially on mobile.
- The regression appeared after the scene selector became more milestone-driven.

Actual root cause found:

- The new scene milestone helper chain repeatedly called full `normalizeGameState()` through helper
  functions during Overview renders. `normalizeGameState()` copies several nested state objects and
  syncs shop generator state, so doing this several extra times during live shop refreshes increased
  main-thread work exactly where clicks need to stay responsive.
- Decorative Living Scene elements were not explicitly pointer-inert, so image/stage boxes had
  normal pointer behavior even though the scene is not a control surface.

Fix applied:

- Living Scene threshold helpers now consume the already-normalized state from
  `getTofuShopSceneState()` and read scalar milestone fields directly.
- Decorative scene containers, images, and placeholders use `pointer-events: none` and
  `user-select: none`.
- Static JS/CSS cache keys were bumped so mobile browsers fetch the interaction fix.

Guardrails:

- Decorative scene code must not attach timers, event listeners, animation frames, or large
  `aria-live` regions.
- Scene visuals must never cover or intercept controls.
- If scene work again hurts responsiveness, disable the decorative scene before adding content.

## Test Harness And Recommendation Hotspot: 2026-06

Observed during Net Worth Milestone / Showcase work:

- `node test_frontend_nospill.js` looked stuck because it printed no per-test progress while a broad
  Tofu Garage fixture was running.
- A targeted Net Worth / Showcase test path took roughly one minute before failing.
- Earlier offline and high-midgame fixtures also felt much slower than the amount of logic being
  tested should require.

Actual root cause found:

- App startup inside the test VM was not the problem; loading `app.js` was about 20ms.
- Recommendation helpers were repeatedly normalizing the full game state. In the slow Net Worth
  path, individual recommendation calls caused tens of thousands of `normalizeGameState()` calls.
- The old `getShopLevel()` and `shopLevelProgress()` walked level-by-level from Reputation, which
  amplified the cost whenever normalization was repeated.
- Upgrade relevance sorting recomputed expensive context for every candidate and comparator path.

Fix applied:

- The test runner now logs `[test x/y] START/PASS/SLOW/FAIL`, supports `TEST_GREP=<name>` for
  targeted runs, supports `TEST_TRACE_CONTEXT=1` for opt-in timing diagnostics, and caches the
  compiled `app.js` VM script.
- Shop Level math is constant-time with a bounded correction step instead of walking every level.
- Upgrade recommendation scoring computes the shop relevance context once per pass and avoids
  repeated full normalization inside the sort path.
- Net Worth / Showcase milestone priority now yields to urgent queue/stock/counter bottlenecks and
  Manager Desk queue pressure.
- Overview Glance Mode V1 keeps the Pinned Goal stable: live Cash, queue, stock, and ETA changes
  update progress/copy in place instead of replacing the medium-term target during normal ticks.
  The default Overview now limits itself to Goal Stack, one operational card, one build-status card,
  and Recent/While Away feedback. Long explanations, Net Worth formulas, Dream Build details, and
  saved Builder Note editing controls are collapsed by default so the active Overview does less
  visible text churn. Keyed Details retain open/closed state across live ticks without localStorage.
  Dream Build Tab V1 keeps detailed Wheels, Exhaust, Suspension, later tuning tracks, Final Detail,
  Garage Build Value, and Builder Note rendering in an earned parked tab instead of expanding the
  Overview dashboard. Queue-full Now copy and Prep Counter headlines use stable categories so live
  ticks do not alternate between equivalent recommendation strings.
- Car Management V1 keeps completed-car use bounded: one active parked assignment, timestamp-based
  offline progress, explicit collection before rewards, capped assignment history, no service
  worker/background timer, and no network calls. Assignment explainability renders only the
  managed car, current assignment states, first-loop checklist, and last three history rows; stored
  history remains capped.
- Second Car Project / Second Bay V1 adds only one bounded object under Car Management state and
  two scalar parked actions. It does not add fleet arrays, multiple active assignments, repeatable
  event timers, service workers, backend sync, uploads, or unbounded history.
- High-Scale Counter Contracts V1 keeps late-game handoffs scalar and bounded. Wholesale Case,
  Event Catering Load, and Venue Supply Contract are larger order bundles, not per-order object
  queues; Counter Service batch floors rise to 100/250/1000 only through parked contracts, and
  fulfillment still uses aggregate capped math.

Result:

- The Net Worth / Showcase targeted test path dropped from roughly 61 seconds to roughly 2 seconds.
- The full frontend suite still includes several broad DOM-heavy shop tests, but it now completes
  with visible progress and fails fast at the exact test name instead of appearing hung.

## BigNumber Decision

BigNumber or mantissa/exponent is not needed now.

Reasons:

- current resources are scalar `Number` values
- current caps are far below `Number.MAX_VALUE`
- the `$1T` future goal is still safely representable as a JavaScript number
- the observed lag pattern matches render/format/backlog churn, not arithmetic overflow

## Future BigNumber Strategy

If a later Tofu Garage endgame intentionally reaches absurd incremental values, introduce a number
adapter before widening the economy:

```text
GameAmount:
  mantissa: number
  exponent: number
```

Required operations:

- normalize
- compare
- add
- subtract
- multiply
- divide
- compact format
- save/load
- ignore tiny additions that cannot affect the displayed value

An established incremental-game decimal library can be considered later only if the project chooses
extreme endgame values that justify the dependency and migration cost.

Do not migrate piecemeal. A real BigNumber pass must cover costs, rewards, comparisons, formatting,
save/load migration, import validation, and deterministic tests together.

## Current Recommendation

Keep resources as scalar numbers for now. Continue improving performance by:

- reducing render frequency
- avoiding unchanged DOM writes
- keeping formatting compact
- using aggregate offline math
- bounding order backlogs and history
- adding performance guardrail tests before widening future economies
