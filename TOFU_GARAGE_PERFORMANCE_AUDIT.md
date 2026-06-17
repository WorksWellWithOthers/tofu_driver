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
- `shop.tips`
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
+7.8K Tips/min
+250/sec
```

The UI should not expose long raw decimals or full large integer strings when a compact suffix is
clearer. Formatting remains display-only; internal values are still numeric state.

## Offline Catch-Up

Offline shop progress uses aggregate elapsed-time math through the same generator earnings path.
It does not simulate every second and does not create per-order objects.

Current V1 behavior:

- offline progress is capped by `SHOP_OFFLINE_CAP_HOURS`
- generated waiting orders respect the order queue cap
- Counter Service remains active-page-only and does not auto-fulfill offline
- offline summaries are compact and mention when Counter Service did not fulfill offline

## Backlog And History Bounds

Tofu Garage now has explicit high-scale guardrails:

- `Delivery Orders` has a queue cap so waiting orders do not grow forever into meaningless UI noise.
- When the order queue is full, Prep Counter progress pauses and Next Best Action points toward
  clearing the queue through Counter Service instead of producing more orders.
- Ledger entries are capped.
- Inline shop feedback is a single compact message, not an unbounded feed.
- Counter Service messages are batched for multi-order handoffs.

These bounds preserve the idle-management decision instead of rewarding unbounded backlog size.

## Hidden Surface Rendering

The app keeps hash surfaces separate. Live shop ticks refresh the shop surface only when Tofu Garage
is active. Hidden surfaces should not be rebuilt every shop tick.

Full app rerenders still happen for route changes, button actions, and result transitions where the
player expects immediate feedback.

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
