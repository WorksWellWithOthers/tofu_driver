# Tofu Garage V1 Completion Audit

This audit checks whether the current Tofu Garage / Tofu Shop implementation is complete enough to
move toward the Dream Build car phase. It is a readiness audit only. It does not authorize full
Dream Garage, car parts, full Net Worth valuation, routes, crew gameplay, backend, accounts,
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
5. Keep Cash as the single liquid currency and avoid adding full valuation in the same slice as the
   teaser.

Safest next implementation: **Covered Car / Dream Build Teaser V1**. Implemented as a small
parked-only story/status card and scene state, not a garage tab with parts, full valuation, events,
or car assets.

## 2. Implemented Mechanics Inventory

| Mechanic / System | Status | Evidence / Notes |
| --- | --- | --- |
| Idle-first starter loop | Implemented | Fresh shop starts with Tofu Stock, starter stations, ready order, and running Counter Service. |
| Tofu Press | Implemented | Produces Tofu Stock through generator tick and station purchases. |
| Prep Counter | Implemented | Consumes Tofu Stock and prepares Delivery Orders with fractional progress display. |
| Delivery Orders | Implemented | Scalar ready-order queue with capped backlog and prep progress. |
| Cash | Implemented V1 | Player-facing spend balance is Cash; legacy `shop.tips` remains the internal save field. |
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
| Covered Car / Dream Build Teaser V1 | Implemented | Unlocks after managed-shop scale and Wholesale Pickup progress; no car mechanics are implemented. |
| First Dream Build Investment Purchase V1 | Implemented | Lets the player buy Wheels for `$50K Cash` after the covered-car bridge; subtracts Cash, persists locally, and starts `$25K Garage Build Value` without a Dream Garage tab or full parts inventory. |
| Wheels Work Levels V1 | Implemented | Existing Wheels purchases migrate to level 1; Polish Wheels costs `$75K` and raises Garage Build Value to `$65K`; Balanced Fitment costs `$150K` and raises Garage Build Value to `$150K`; levels 4-5 remain future. |
| Exhaust Purchase + Work Level V1 | Implemented | Unlocks after Wheels level 3; Buy Exhaust costs `$250K` and raises combined Garage Build Value to `$275K`; Seal Joints costs `$375K` and raises it to `$475K`; Tuned Note costs `$600K` and raises it to `$825K`; Heat Wrapped costs `$1.1M` and raises it to `$1.475M`; Showcase Finish costs `$2M` and raises it to `$2.725M`. |
| Dream Build Tab V1 + Suspension/Tires/Brakes/Induction/Drivetrain/Aero/First Complete Build Tracks | Implemented | Earned Dream Build tab appears after the build starts; Suspension, Tires & Rubber, Brakes & Control, Induction & Cooling, Drivetrain & Transmission, Aero/Styling/Weight Reduction levels 1-5, Final Detail, and Shakedown unfold in order through First Complete Build. |
| Tofu Garage Tuning Catalog V1 | Implemented docs + preview | `TOFU_GARAGE_TUNING_CATALOG.md` is the canonical future parts source; Dream Build tab shows a collapsed category-only preview and does not dump the full list into Overview. |
| Dream Build Layout Cleanup + Action Choice Board V1 | Implemented | Dream Build no longer inherits shop/offline footer logs; Overview uses stable Goal Stack categories plus up to three Action Choice cards for Cash Conversion, current Dream Build work, and relevant recent activity. Active Dream Build work cards show Cash progress bars and missing Cash. |
| Core Build Progress V2 | Implemented | Summarizes current project completion as Wheels Level + Exhaust Level + Suspension Level + Tires Level + Brakes Level + Induction Level + Drivetrain Level + Aero Level + Final Build Level against `40` planned core work stages; current maximum is `40 / 40` after Shakedown Complete. |
| Garage Event Board V1 | Implemented | Unlocks in the Dream Build tab at `$100M Net Worth` plus Tires & Rubber Level 5; Local Showcase, Sponsor Display, Closed-Course Exhibition, and Collector Preview are one-time parked fictional events with local Cash, Brand Value, Garage Reputation, and badge rewards. |
| Car Management V1 + Assignment Explainability V1 | Implemented | Unlocks after First Complete Build; creates one local managed-car snapshot and supports one active parked assignment at a time: Showcase Rotation, Sponsor Demo Day, and Closed-Course Exhibition Booking. Assignment cards show state labels, concrete cost/reward previews, active/ready states, capped recent history, and first-loop checklist closure. |
| Second Car Project / Second Bay V1 | Implemented | Unlocks after the first Car Management loop and `250` Garage Reputation; opens Second Bay for `$500B Cash + 250 Garage Reputation`, then acquires the Second Project Car rolling shell for `$1T Cash + 500 Garage Reputation` and `+$750B Garage Build Value`. Second-car build tracks remain future-only. |
| Second Car Identity / Build Direction V1 | Implemented | Unlocks after Second Project Car acquisition; locks one of Showcase Build, Track Build, Drift Build, Rally Build, or Restoration Build as future second-car identity. No immediate Cash, Brand Value, Garage Reputation, Garage Build Value, Net Worth, Cup Test, backend/upload, or network effect. |
| Second Car Direction Track V1 | Implemented | Unlocks after Second Project Car acquisition plus locked direction selection; only the selected Showcase, Track, Drift, Rally, or Restoration branch renders. Levels 1-5 share costs of `$2T/$4T/$7T/$11T/$17T Cash` plus `250/400/700/1,000/1,500 Garage Reputation` and add `+$1.25T/+$2.5T/+$4.5T/+$7.5T/+$12T Garage Build Value`. |
| Second Car Assignment Board V1 | Implemented | Unlocks after the selected second-car direction track reaches Level 5; renders one selected-direction assignment only. Invitational Display, Closed-Course Test Session, Exhibition Night, Weather Trial, or Collector Review each costs `$1T Cash`, lasts `60 min`, grants direction-specific Cash, Brand Value, and Garage Reputation on manual collection, and adds no Garage Build Value. One active car assignment is allowed globally; assignment chains, fleet management, backend/uploads, and network calls remain future. |
| Net Worth Milestone Ladder V1 | Implemented | Shows compact `$1M`, `$10M`, `$100M`, `$1B`, and `$1T Net Worth` stepping stones after Net Worth is visible. |
| Showcase Interest / Showcase Prep V1 | Implemented | Unlocks after early Dream Build progress and first `$1M Net Worth`; spends `$500K Cash` to add `$300K Garage Build Value`. |
| Sponsor Inquiry V1 | Implemented | Unlocks after Showcase Prep, Dream Build progress `5 / 30`, and first `$1M Net Worth`; one-time accept grants `$250K Cash` and `$500K Brand Value`; recurring sponsor packages remain future. |
| Dream Garage / car parts | Partial | Dream Build tracks, Garage Event Board V1, and one-car Car Management V1 exist; full Dream Garage, full car inventory, repeatable board expansion, valuation, auctions, and collector offers are not implemented. |
| Net Worth V1 | Implemented V1 | Compact line can appear after later milestones; formula is Cash + Tofu Business Value + Garage Build Value + Brand Value. Full valuation remains future. |

## 3. Missing Or Weak Tofu Garage Mechanics

| Area | Readiness Classification | Notes |
| --- | --- | --- |
| Buy Cheapest / Buy All actions | Done | Implemented and tested; tune after more returning-player playtests. |
| Affordability progress bars / ETA | Done | Implemented; keep watching for fake ETA when income is blocked. |
| Returning-player summary actions | Done | Implemented; tune suggestion priority with real saves. |
| Meaningful unfold audit | Done | `TOFU_GARAGE_UNFOLD_AUDIT.md` exists and should be rerun before major new layers. |
| Hiding meaningless tabs/counters | Nice before Dream Build teaser | Mostly solved through progressive reveal, but Shop Reach/License-related scaffolding should stay out of prominent early UI. |
| Cash naming clarity | Done | Player-facing shop economy uses Cash; tips remain order-income flavor and `shop.tips` remains legacy state. |
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
- Full car building would require part costs, project budget clarity, Car Asset Value semantics, and
  new tests.
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
AND First $100 Cash milestone reached
AND first meaningful shop plateau observed
```

Clean transition point:

The player has automated the counter, solved at least one stock bottleneck with Supplier Contracts,
seen the order queue become a management problem, and used or unlocked Manager Desk. At that point
the shop is no longer just a counter; it is a business capable of funding the covered car.

## 6. Cash And Net Worth Transition

Current code status:

- Cash is the implemented player-facing currency.
- `shop.tips` is still the legacy internal field for save compatibility.
- Net Worth V1 is implemented as Cash + Tofu Business Value + Garage Build Value + Brand Value.
- Net Worth Milestone Ladder V1 is implemented as a compact stepping-stone display toward `$1T`.
- Showcase Interest / Showcase Prep V1 and Sponsor Inquiry V1 are implemented as the first value
  unlocks after early Dream Build progress and first `$1M Net Worth`; they do not implement
  completed events, recurring sponsor packages, routes, racing, or full Dream Garage.
- First Dream Build Investment Purchase V1 lets the player buy Wheels for `$50K Cash`; Wheels add
  `$25K Garage Build Value`.
- Wheels Work Levels V1 implements level 2 Polished Wheels and level 3 Balanced Fitment. Project
  Car Value totals are `$65K` and `$150K` respectively.
- Exhaust Purchase + Work Level V1 implements level 1 Exhaust Fitted, level 2 Sealed Joints,
  level 3 Tuned Note, level 4 Heat Wrapped, and level 5 Showcase Finish. Combined Garage Build
  Value totals are `$275K`, `$475K`, `$825K`, `$1.475M`, and `$2.725M` respectively.
- Dream Build Tab V1 gives the build its own earned parked surface after the first real build work
  starts, keeping detailed car content out of the Overview by default.
- Suspension Track Completion V1 implements Suspension Refreshed, Ride Height Set, Alignment
  Dialed, Corner Balance, and Showcase Stance after Exhaust Level 5. Tires & Rubber Track V1 then
  adds Sports Tire Set through Event Tire Set, Brakes & Control Track V1 adds Sports Brake Pads
  through Brake Balance & Control Package, Induction & Cooling Track V1 adds Sports Intercooler
  through Anti-Lag & Cooling Package after Local Showcase, Drivetrain & Transmission adds the
  power-delivery layer, Aero/Styling/Weight Reduction adds the body package, and First Complete
  Build V1 adds Final Detail plus Shakedown Complete.
- Tofu Garage Tuning Catalog V1 documents authentic future parts vocabulary for the standalone
  garage game. Runtime only previews category names in a collapsed Dream Build card.
- Core Build Progress V2 shows the project as `40` planned core work stages. Current implemented
  stages are Wheels levels 1-3, Exhaust levels 1-5, Suspension levels 1-5, Tires levels 1-5,
  Brakes levels 1-5, Induction levels 1-5, Drivetrain levels 1-5, Aero levels 1-5, Final Detail,
  and Shakedown Complete, for a current maximum of `40 / 40`.
- Garage Event Board V1 makes the first `$100M` garage-era reward real once Tires & Rubber Level 5
  is complete. It is one-time and parked-only; Car Management V1 is now the separate completed-car
  assignment loop with explicit assignment states, reward previews, ready-to-collect feedback, and
  capped history. Second Car Project / Second Bay V1 adds the first post-loop expansion by opening
  a second project bay and acquiring a rolling shell. Second Car Assignment Board V1 adds one
  selected-direction proof assignment after the direction track reaches Level 5. Repeatable event
  boards, second-car assignment chains, full multi-car management, collector offers, and auctions
  remain future.
- Second Car Project / Second Bay V1 implements the first post-loop expansion step without full
  fleet management. Second Bay and the rolling shell are local-only Tofu Garage progression, and
  Second Car Assignment Board V1 keeps assignments limited to one global active car assignment.
- Full accounting with Car Asset Value, Garage Value, company value, or liabilities is not
  implemented.

Recommendation:

- Keep tips as flavor copy for order income, such as `+$10 from tips`.
- Do not introduce both Tips and `$` as separate spendable balances.
- Design full Car Asset Value and project budgets before broader car parts.
- Treat Wheels levels 1-3, Exhaust levels 1-5, and Suspension levels 1-5 as the only current V1 Dream
  Build purchases. Do not add Ride Height Set, full parts inventory, resale, depreciation,
  liabilities, or a separate project currency.

Cash is no longer a blocker for a teaser. Full valuation is still a blocker for car parts, project
budgets, and any Car Asset Value-facing accounting.

## 7. Recommended Next Implementation Sequence

1. Fix any P0 responsiveness, interaction, duplicate-render, or stale-cache bugs immediately.
2. Playtest the fresh first 3 minutes on desktop and mobile: first automatic order, first upgrade,
   first bottleneck, and Manual Backup staying secondary.
3. Playtest high-progress saves: Supplier Contracts, Manager Desk, Wholesale Pickup, queue cap,
   bulk buy, and returning-player suggestions.
4. Tune Shop Spirit only if it is visible and still feels useless or clicky.
5. Keep route, crew gameplay, license prestige, and full garage systems hidden/deferred.
6. Playtest Covered Car / Dream Build Teaser V1 as a parked-only story transition.
7. Playtest First Dream Build Investment Purchase V1: verify the `$50K` Wheels purchase and `$25K`
   Garage Build Value tradeoff is clear without feeling like full Dream Garage.
8. Playtest Wheels Work Levels V1, Exhaust Purchase + Work Level V1, and Core Build Progress V2
   alongside the implemented Suspension, Tires, Brakes, Induction, Drivetrain, Aero, and First
   Complete Build steps.
   Parts should be purchased once, then improved through levels.
9. Playtest Final Detail and Shakedown pacing after Aero Level 5 alongside Car Management V1's
   one-car assignment loop.
10. Design the next completed-build expansion before implementing multiple cars, repeatable event
   boards, auctions, collector-sale offers, or broader business outcomes.
11. Design full Car Asset Value and project-budget rules before any broader car-part costs are added.
12. Keep Net Worth V1 as Cash + Tofu Business Value + Garage Build Value + Brand Value until full
   valuation has a coherent accounting model.

## 8. Deferred Systems

Keep these deferred:

- full Dream Garage
- car parts
- project-car inventory
- Buy Exhaust or any broader car-part purchase effect
- duplicate part-buying loops such as `Buy Wheels x10`
- completed-build events, Auction, Collector Offer, Showcase, or Closed-Course Exhibition outcomes
- full Net Worth accounting
- Car Asset Value and Garage Value
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
- Covered Car teaser unlocks only after managed-shop scale and Wholesale Pickup progress
- Covered Car teaser does not create Dream Garage mechanics, car parts, or full valuation
- Cash save compatibility preserves `shop.tips` and does not create separate spendable balances

## Final Readiness Call

Tofu Garage V1 is not missing a large core mechanic. It is missing final confidence from playtesting
and a clean bridge into the next phase. The right next move is a small, story-driven Covered Car /
Dream Build teaser after final responsiveness and first-session checks, followed by a separate
Car Asset Value and project-budget design before any real car-part economy.
