# Tofu Garage V1 Completion Audit

This audit checks whether the current Tofu Garage / Tofu Shop implementation is complete enough to
move toward the Dream Build car phase. It is a readiness audit only. It does not authorize full
Dream Garage, car parts, Net Worth, Cash/Tips migration, routes, crew gameplay, backend, accounts,
analytics, service workers, uploads, multiplayer, or network calls.

## 1. Executive Answer

Verdict: **Ready to move to Dream Build teaser**.

Tofu Garage V1 is near completion as a first parked idle-management layer. It has a functional
idle-first starter loop, meaningful bottlenecks, automation, support upgrades, midgame supply
relief, bulk handoffs, returning-player helpers, capped high-scale behavior, and a polished
parked-only visual identity. The next implementation should not be full car building. It should be
a restrained Covered Car / Dream Build teaser that confirms the player has outgrown the first shop
loop and creates aspiration for the next phase.

Estimated Tofu Garage V1 readiness: **85% complete**.

Top blockers before a Dream Build teaser:

1. Confirm first 3-minute fresh-save timing on real browser/mobile sessions.
2. Confirm high-progress saves remain responsive after recent performance fixes.
3. Tune or de-emphasize Shop Spirit if playtests still make it feel like a weak manual side loop.
4. Confirm Manager Desk / Wholesale Pickup gives a clear goal after maxed Counter Service.
5. Keep Cash/Tips as documented future direction; do not migrate naming in the same slice as the
   teaser.

Safest next implementation: **Covered Car / Dream Build Teaser V1**. It should be a small
parked-only story/fanfare or scene/state moment, not a garage tab with parts, valuation, events, or
Net Worth.

## 2. Implemented Mechanics Inventory

| Mechanic / System | Status | Evidence / Notes |
| --- | --- | --- |
| Idle-first starter loop | Implemented | Fresh shop starts with Tofu Stock, starter stations, ready order, and running Counter Service. |
| Tofu Press | Implemented | Produces Tofu Stock through generator tick and station purchases. |
| Prep Counter | Implemented | Consumes Tofu Stock and prepares Delivery Orders with fractional progress display. |
| Delivery Orders | Implemented | Scalar ready-order queue with capped backlog and prep progress. |
| Tips / Cash | Partial | `Tips` is implemented as the current local spend balance. Cash is documented future naming/model. |
| Reputation | Implemented | Earned from orders, boosted by Shop Sign/Driver Bonus, spent by Supplier and Manager layers. |
| Shop Level / Shop XP | Implemented | Shop XP and derived Shop Level gate later shop features. |
| Shop Spirit | Partial | Generators/actions exist and terminology is clearer; usefulness still needs tuning. |
| Counter Service | Implemented | Starter automation converts stock/orders into shop rewards while parked/open. |
| Counter Service upgrades | Implemented | Interval and batch upgrades exist through Order Bell, Wider Counter, Pickup Routine, Second Register, Pickup Window, Counter Crew, and Shift Manager. |
| Station Milestone Boosts | Implemented | 5/10 ownership boosts for Tofu Press, Prep Counter, Delivery Shelf, and Shop Sign. |
| Supplier Contracts | Implemented | Reputation-funded stock/sec relief path for high-midgame stock bottlenecks. |
| Catering Crate | Implemented | Larger managed-shop order type consuming larger stock/order bundles. |
| Manager Desk | Implemented | Unlocks after managed-shop progress; includes high-midgame throughput goals. |
| Wholesale Pickup | Implemented | Capped scalar queue-clearing path when the order queue is full and supplied. |
| Buy Cheapest / Buy All | Implemented | Bulk buys visible, unlocked, meaningful, non-maxed stations/upgrades only. |
| Affordability progress / ETA | Implemented | Visible cards can show limiting resource and ETA only when income is reliable. |
| Returning-player summary actions | Implemented | Offline summary can show up to three useful next actions. |
| Next Milestone Bar | Implemented | Shows one relevant implemented shop goal at a time. |
| Next Best Action | Implemented | Points to current bottleneck and avoids manual clicking as primary flow. |
| Passport / stamps | Partial | Core shop stamps and fanfare exist; full Passport catalog remains intentionally deferred. |
| Delivery Driver separation | Implemented | Shop automation grants shop resources/Shop XP, not Driver XP. |
| Tofu Garage navigation | Implemented | `#/shop` and `#/garage` route to Tofu Garage; Delivery Crew is clickable placeholder. |
| Performance guardrails | Implemented | Render throttling, scalar queues, aggregate offline math, capped feedback/ledger, hidden-surface guardrails. |
| Living Scene | Implemented / Decorative | One cohesive parked scene panel with real art, milestone pacing, and pointer-inert decorative behavior. |
| Routes | Deferred / scaffolding | Route-related concepts remain hidden/deferred until meaningful. |
| Delivery Crew gameplay | Deferred | Current crew surface is cosmetic/placeholder only. |
| Dream Garage / car parts | Documented only | Covered-car story beat exists; no car mechanics are implemented. |
| Net Worth | Documented only | No counter, valuation, or accounting system is implemented. |

## 3. Missing Or Weak Tofu Garage Mechanics

| Area | Readiness Classification | Notes |
| --- | --- | --- |
| Buy Cheapest / Buy All actions | Done | Implemented and tested; tune after more returning-player playtests. |
| Affordability progress bars / ETA | Done | Implemented; keep watching for fake ETA when income is blocked. |
| Returning-player summary actions | Done | Implemented; tune suggestion priority with real saves. |
| Meaningful unfold audit | Done | `TOFU_GARAGE_UNFOLD_AUDIT.md` exists and should be rerun before major new layers. |
| Hiding meaningless tabs/counters | Nice before Dream Build teaser | Mostly solved through progressive reveal, but Shop Reach/License-related scaffolding should stay out of prominent early UI. |
| Cash/Tips naming clarity | Can defer | Current code uses Tips; docs define future Cash. Rename before car parts, not before the teaser. |
| First 3-minute onboarding | Must fix before full Dream Build; nice before teaser | Core loop is implemented, but needs final real-device timing confirmation. |
| High-midgame goals | Mostly done | Supplier Contracts, Manager Desk, Wholesale Pickup, bulk buy, and affordability helpers provide goals. Tune if playtests show a dead end. |
| Manager Desk usefulness | Nice before Dream Build teaser | Implemented; needs playtest confirmation at Shop Level 100-500 saves. |
| Wholesale Pickup usefulness | Nice before Dream Build teaser | Implemented; tune threshold/reward if queue-full states still feel stuck. |
| Shop Spirit usefulness | Nice before Dream Build teaser | Keep as emergency utility; avoid making it required before the car teaser. |
| Performance on high-progress saves | Must fix before any next feature if regressions appear | Current guardrails are implemented. Real high-progress mobile/desktop profiling remains the main risk. |
| Mobile responsiveness | Must fix before any next feature if regressions appear | Prior regressions were fixed; verify again before adding visual/story layers. |
| Fresh-save progression timing | Must fix before full Dream Build; nice before teaser | First order/first upgrade should feel reliable without manual Pack Tofu. |

## 4. Tofu Garage V1 Completion Criteria

Tofu Garage V1 should be considered complete when:

- fresh save runs automatically without manual clicking
- first order completes automatically
- first upgrade is reachable quickly
- player always has one clear next goal
- player can return after idle time and know what to do
- manual buttons are backup only
- no dead nav items remain
- no meaningless prominent counters dominate the first loop
- rendering remains responsive on high-progress saves
- no duplicate panels, duplicate timers, or repeated offline messages appear
- `Tofu Garage` and `Tofu Shop` naming stays clear: mode versus first business
- route/crew/garage systems do not pretend to be implemented
- high-midgame has at least one goal after current upgrades
- Tofu Garage has a clear transition moment into the next phase

Current assessment:

- Mechanics: mostly complete for V1.
- UX/pacing: close, but needs final playtest tuning.
- Performance: acceptable by tests/audits, but should be rechecked on real high-progress saves.
- Transition: ready for a teaser, not for full car building.

## 5. Readiness For Car Phase

The next phase should **not** be full Dream Garage.

The next phase should start as a **Covered Car / Dream Build teaser**:

```text
Behind the shop, an old car waits under a cover.
```

Why teaser first:

- Tofu Garage V1 already has enough mechanics to make the shop feel like it can fund a dream.
- A teaser creates aspiration without adding a new economy.
- Full car building would require Cash naming, part costs, project budget clarity, asset value
  semantics, and new tests.
- A teaser can be parked-only, decorative/story-driven, and safe.

Do not implement the first car mechanic yet unless the teaser proves players understand why the car
matters.

Recommended teaser unlock condition:

```text
Manager Desk unlocked
AND first Wholesale Pickup complete
AND Shop Level 100+
AND all core shop systems discovered
```

Acceptable lighter condition if playtesting shows the above is too late:

```text
Counter Crew reached
AND Catering Crate unlocked
AND First 100 Tips/Cash milestone reached
AND first meaningful shop plateau observed
```

Clean transition point:

The player has automated the counter, solved at least one stock bottleneck with Supplier Contracts,
seen the order queue become a management problem, and used or unlocked Manager Desk. At that point
the shop is no longer just a counter; it is a business capable of funding the covered car.

## 6. Cash/Tips Transition

Current code status:

- Tips is still the implemented currency (`shop.tips`).
- Cash is documented future economy direction.
- Net Worth is documented future direction.
- No Cash balance, Net Worth counter, Business Value, Car Asset Value, or valuation formula is
  implemented.

Recommendation:

- Do not rename Tips to Cash before the Covered Car teaser.
- Do rename/reframe Tips as Cash before real car parts.
- Keep `tips` as flavor copy for order income, such as `+$10 Cash from tips`.
- Avoid introducing both Tips and `$` as separate spendable balances.

Cash/Tips is not a blocker for a teaser. It is a blocker for car parts, project budgets, and any
Net Worth-facing accounting.

## 7. Recommended Next Implementation Sequence

1. Fix any P0 responsiveness, interaction, duplicate-render, or stale-cache bugs immediately.
2. Playtest the fresh first 3 minutes on desktop and mobile: first automatic order, first upgrade,
   first bottleneck, and Manual Backup staying secondary.
3. Playtest high-progress saves: Supplier Contracts, Manager Desk, Wholesale Pickup, queue cap,
   bulk buy, and returning-player suggestions.
4. Tune Shop Spirit only if it is visible and still feels useless or clicky.
5. Keep route, crew gameplay, license prestige, and full garage systems hidden/deferred.
6. Implement Covered Car / Dream Build Teaser V1 as a parked-only story transition.
7. Design the Cash/Tips migration before any car-part costs are added.
8. Implement the first car investment only after the teaser and Cash bridge are clear.
9. Add Net Worth visibility only after Cash, Business Value, and Car Asset Value have a coherent
   accounting model.

## 8. Deferred Systems

Keep these deferred:

- full Dream Garage
- car parts
- project-car inventory
- Cash/Net Worth implementation
- Business Value and Car Asset Value
- routes and route expansion
- Delivery Crew gameplay
- franchise mode
- car manufacturing company
- rockets/aerospace
- social scout/ambassador systems
- monetization/payments
- backend/accounts/sync
- analytics changes
- service workers
- uploads or network calls

## 9. Tests To Add Later

High-value future regression tests:

- full fresh 3-minute simulated flow from new save to first upgrade
- returning-player flow after long offline progress with suggested next actions
- high-progress save with maxed early upgrades and Manager Desk goals
- no-dead-end after maxed Supplier/Counter/Manager upgrades
- no manual-clicker regression where Pack Tofu or Fulfill One becomes primary again
- no duplicate render/timer/listener regression after route changes and tab switches
- no repeated offline summary or Counter Service feedback on rerender
- no hidden/future route/crew/garage system appears as an active purchase target
- Covered Car teaser unlocks only after the chosen transition condition
- Covered Car teaser does not create Dream Garage mechanics, car parts, valuation, or Net Worth
- Cash/Tips migration preserves saves and does not create separate spendable balances

## Final Readiness Call

Tofu Garage V1 is not missing a large core mechanic. It is missing final confidence from playtesting
and a clean bridge into the next phase. The right next move is a small, story-driven Covered Car /
Dream Build teaser after final responsiveness and first-session checks, followed by a separate
Cash/Tips migration design before any real car-part economy.
