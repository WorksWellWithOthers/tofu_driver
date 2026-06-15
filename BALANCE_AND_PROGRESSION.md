# Tofu Driver Balance And Progression

This file is the source-of-truth contract for Tofu Shop idle-game balance, progression, unlock
pacing, and economy design. `DESIGN.md` describes the broader product; this file defines what should
make the shop loop fun and testable.

## 1. North Star

Tofu Shop is a cozy idle/incremental game where the player builds a small tofu delivery shop from a
counter operation into a fictional delivery network.

The fun should come from:

- watching production chains grow
- making meaningful upgrades
- unlocking new systems gradually
- discovering stamps and fictional routes
- using Don't Spill the Cup as an optional certified boost path
- feeling smooth and cozy, not rushed

Physical driving must never be required for ordinary Tofu Shop progression. Don't Spill the Cup is a
special smooth-driving challenge and certification/status path, not the base-game gate.

## 2. Core Loop Contract

The first playable loop is:

1. Tofu Press produces Tofu Stock.
2. Prep Counter consumes Tofu Stock and creates Delivery Orders.
3. Player fulfills Delivery Orders.
4. Fulfilled orders grant Tips, Reputation, and XP.
5. Tips buy more production.
6. Reputation unlocks new shop systems.
7. XP increases level and visible progress.
8. Better production creates more orders.
9. More orders unlock fictional routes, crew, upgrades, stamps, and eventually License Exams.

This loop must be fun before advanced systems expand. A card or button is not enough: the player
must see resources change, make a purchase, receive feedback, and understand the next bottleneck.
The current runtime uses a local live tick so visible shop resources update without refresh while
the app is open.

## 3. First 60 Seconds

Target first minute:

- user sees Tofu Shop resources
- user understands Tofu Stock and Delivery Orders
- user can press one obvious button
- user earns Tips quickly
- user buys or progresses toward the first Tofu Press / Prep Counter upgrade
- no advanced tabs dominate the screen
- no settings, debug, or QA content is prominent
- one clear Next Best Action is shown

The first minute should prove the loop. If a player cannot earn Tips or understand how to get
Delivery Orders within 60 seconds, the pacing is too slow or unclear.

## 4. First 10 Minutes

By 10 minutes, a normal player should have:

- fulfilled multiple shop orders
- bought several Tofu Presses
- unlocked or bought Prep Counter
- seen Delivery Orders increase
- earned the first Passport Stamp
- seen one meaningful upgrade
- understood that Don't Spill the Cup is optional
- reached at least Shop Level 2 or 3

The player should not see the full late-game system list yet. Locked systems should appear as short
teasers only when the next goal makes them relevant.

## 5. First Hour

By 60 minutes, a normal player should have:

- multiple generators
- at least one fictional route
- several upgrades
- 3 to 5 stamps
- a preview of crew automation
- a preview of License Exams
- a reason to return later

The first hour should introduce breadth gradually, not dump the complete idle-game framework onto
the first screen.

## 6. Resource Contract

Each resource should have a clear source, sink, scarcity pattern, reveal timing, and License Exam
reset rule.

- `Tips`: main purchase currency. Source: fulfilled orders, Regular Customers, fictional routes,
  certified boosts. Sink: stations, upgrades, garage, crew, routes. Should be scarce early and
  abundant later. Appears immediately. Resets on License Exam.
- `Tofu Stock`: production resource. Source: Tofu Press, Pack Tofu, boosts, offline progress. Sink:
  Prep Counter, shop orders, fictional routes. Should be moderately scarce early. Appears
  immediately. Resets on License Exam.
- `Delivery Orders`: throughput resource. Source: Prep Counter and boosts. Sink: Fulfill Shop
  Order, fictional routes, friendly Rival Shop Challenges. Should be the first visible bottleneck.
  Appears immediately. Resets on License Exam.
- `Reputation`: unlock currency. Source: fulfilled orders, fictional routes, certified smooth
  deliveries, stamps. Sink: primarily gates, not spending, unless a later feature explicitly needs a
  reputation cost. Should be scarce and meaningful. Appears after first order. Usually resets on
  License Exam, with lifetime reputation preserved.
- `XP`: player progress. Source: shop orders, routes, training, Cup Test results. Sink: none.
  Should rise steadily. Appears early. Local level may reset only if a License Exam design
  explicitly says so; lifetime XP should persist.
- `Prep Slots`: staffing/capacity gate. Source: time regeneration and License Perks. Sink:
  station/crew/route purchases. Should prevent uncontrolled bulk buying, not block basic play.
  Appears when multi-buy or staffing matters. Resets on License Exam.
- `Shop Reach`: fictional expansion gate. Source: fictional routes and route milestones. Sink:
  unlock gates for districts/routes/crew. Should be scarce mid-game. Appears when routes unlock.
  Resets on License Exam unless a License Perk preserves some.
- `Shop Spirit`: parked-only boost resource. Source: Tea Kettle, Shrine Corner, Festival Lanterns.
  Sink: shop boosts. Should be optional and capped. Appears after stable production. Resets on
  License Exam.
- `Route Knowledge`: fictional route mastery. Source: fictional routes and training. Sink: unlock
  gates and route success modifiers. Should be mid-game. Appears with routes. Usually resets on
  License Exam, with lifetime records/stamps preserved.
- `Passport Stamps`: achievement collection. Source: milestones, routes, certified deliveries,
  secrets. Sink: unlock gates and status. Should be rare enough to feel special. Appears after the
  first stamp-worthy action. Persists through License Exams.
- `License Stars`: prestige currency. Source: License Exams. Sink: permanent License Perks. Should
  be rare and powerful. Appears only when prestige is introduced. Persists through License Exams.

## 7. Source And Sink Table

| Resource | Main Sources | Main Sinks | Early Game Role | Mid Game Role | Reset Behavior |
| --- | --- | --- | --- | --- | --- |
| Tips | Fulfilled orders, Regular Customers, fictional routes, certified boosts | Stations, upgrades, garage, crew | Main purchase currency | Scaling investment currency | Resets on License Exam |
| Tofu Stock | Tofu Press, Pack Tofu, boosts, offline progress | Prep Counter, routes, order systems | First production resource | Input to larger production chain | Resets on License Exam |
| Delivery Orders | Prep Counter, boosts | Fulfill Shop Order, routes, rivals | First throughput bottleneck | Fuels automated/shop systems | Resets on License Exam |
| Reputation | Orders, routes, certified boosts, stamps | Unlock gates | First unlock signal | Opens routes, crew, spirit, prestige | Resets, lifetime persists |
| XP | Orders, routes, training, Cup Test | None | Visible progress feedback | Level/License pacing | Lifetime should persist unless redesign says otherwise |
| Prep Slots | Timed recovery, perks | Station/crew/route staffing | Mostly hidden | Controls bulk expansion | Resets, perks persist |
| Shop Reach | Fictional routes, route milestones | Route/district unlocks | Hidden | Main expansion gate | Resets unless perked |
| Shop Spirit | Spirit generators, boosts, milestones | Parked-only boosts | Hidden | Optional active-shop layer | Resets |
| Route Knowledge | Fictional routes, training | Route unlocks, mastery gates | Hidden | Mastery and prestige requirement | Resets, stamps persist |
| Passport Stamps | Orders, routes, milestones, certified deliveries | Unlock/status gates | First collectible reward | Completion/status layer | Persists |
| License Stars | License Exams | License Perks | Hidden | Prestige currency | Persists |

## 8. Generator Contract

Display production per second, not per minute.

Runtime expectation:

- apply elapsed-time production with `deltaSeconds`
- preserve fractional production carry between ticks
- render visible resources at least once per second while parked
- save periodically and immediately after user actions
- do not start duplicate tick intervals on route changes

Cost:

```text
nextCost = baseCost * growthRate ^ owned
```

Production:

```text
productionPerSecond = baseProduction * owned * multipliers
```

| Generator | Unlock Requirement | Produces | Consumes | Base Cost | Cost Growth | Base Production / sec | Intended Role | First-Session Visibility |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tofu Press | Available at start | Tofu Stock | None | 0 Tips for first owned, then station cost | 1.15 | 0.05 Tofu Stock/sec | First visible generator | Visible immediately |
| Prep Counter | Target: first session; current code gates by stock/level/station purchase | Delivery Orders | 2 Tofu Stock/order | 25 Tips | 1.16 | 0.0167 orders/sec | Converts stock into playable orders | Should be visible as next goal |
| Delivery Shelf | Shop Level 2 | Prep Counter boost | Tips, Prep Slots | 90 Tips | 1.17 | Boost only | Makes order production smoother | Teaser after Prep Counter |
| Shop Sign | Reputation 10 | Reputation/passive presentation | Tips, Prep Slots | 140 Tips | 1.18 | Small reputation effect | Unlocks customer layer | Hidden until reputation matters |
| Regular Customers | Shop Sign 1 | Tips over time | Delivery Orders | 240 Tips | 1.20 | Small Tips/sec | First passive Tips loop | Mid first hour |
| Delivery Routes | Shop Reach 2 | Tips, Reputation, Route Knowledge, Shop Reach | Tofu Stock, Orders | 420 Tips | 1.22 | Instant/queued route rewards | Fictional expansion layer | Preview by first hour |
| Dispatcher Desk | Reputation 40 | Automation support | Tips, Prep Slots | 900 Tips | 1.26 | Automation modifier | Reduces chores | Preview only |
| Regional Tofu Network | Shop Level 5 | Broad production boosts | Tips, Prep Slots | 2400 Tips | 1.32 | Global multiplier | Late-game scaling | Hidden first session |

## 9. Initial Balance Targets

Target starting state:

- Tips: 0
- Tofu Stock: 10
- Delivery Orders: 1
- Reputation: 0
- XP: 0
- Tofu Presses: 1
- Prep Counters: 0 or 1

Chosen first action: Option A, fulfill first order immediately.

Reason: the first click should complete the loop once: an order becomes Tips/Reputation/XP, the
result screen explains the reward, and the next bottleneck points to production. This is more
legible than asking a brand-new player to wait for production before seeing why production matters.

Current implementation note: the code currently starts with one Tofu Press and no initial Delivery
Order, so this target is not fully implemented.

## 10. Unlock Sequence

Stage 0: Overview, Orders, Production basics.

Stage 1: Passport preview after first order.

Stage 2: Upgrades after first few purchases.

Stage 3: Routes after Reputation threshold.

Stage 4: Crew preview after route progress.

Stage 5: Shop Spirit after stable production.

Stage 6: Garage after fictional route unlock.

Stage 7: License after level/reputation/stamp progress.

Stage 8: Rivals later.

Do not reveal everything immediately. Each new system needs a reason, a bottleneck it solves, and a
short line of flavor.

## 11. Upgrade Contract

Upgrade types:

- station rate upgrades
- station output upgrades
- milestone upgrades
- quality-of-life upgrades
- permanent License Perks

Each upgrade must define:

- unlock requirement
- cost
- effect
- max level, if any
- additive or multiplicative stacking

Use shop-safe language:

- Steady Pressing
- Tidy Packaging
- Neat Handoff
- Double Mold
- Double Labels
- Word of Mouth

Avoid unsafe language like `faster driving`, `speed bonus`, `high-G`, or any vehicle-performance
copy that could be read as real-world driving advice.

Stacking rule target:

- station upgrade levels add to the station-specific multiplier
- milestone boosts multiply station output at owned 10, 25, 50, and 100
- License Perks multiply broad shop convenience, not real-world scoring

## 12. Bottleneck Contract

Expected bottlenecks and Next Best Action:

- no Delivery Orders: improve Prep Counter or wait for orders
- low Tofu Stock: buy/improve Tofu Press
- not enough Tips: fulfill shop orders
- low Reputation: fulfill orders or fictional routes
- route locked: build Reputation or Shop Reach
- Prep Slots empty: wait for recovery or buy a perk later
- License Exam close: show progress requirements

Only one dominant Next Best Action should appear. Secondary actions may exist, but the player should
not have to choose among several equal-weight CTAs.

## 13. Offline Progress Contract

Offline progress should be capped, summarized, and understandable.

Target early cap: 1 hour.

Current implementation: 8 hours.

Generates offline:

- Tofu Stock from Tofu Press
- Delivery Orders from Prep Counter if enough Tofu Stock is available
- limited passive shop resources if explicitly implemented and balanced

Does not generate offline by default:

- Reputation
- certified progress
- Passport Stamps
- License Stars
- trusted merch unlocks

Ledger summary should say what changed, for example: `While you were away: +42 tofu stock, +12
delivery orders.`

Current implementation applies capped elapsed progress once on load, stores the new tick timestamp,
then continues live ticking from that state. Offline progress must not be double-applied after the
page starts.

Boosts may tick down offline only if the player can understand the result. Otherwise, freeze boost
timers while offline until a later balance pass.

## 14. Don't Spill The Cup Integration

Don't Spill the Cup integration rules:

- optional
- never required for ordinary progression
- never speed-based
- never route-based in a competitive way
- does not use real GPS route data for ordinary shop progression
- Practice Mode gives modest local rewards only
- Qualified smooth result can give certified boost, Reputation, Tips, XP, or stamps
- Simulator/dev results are untrusted

Certified boosts should be based on Cargo Condition and qualification status only. They must not
scale positively with speed, exact distance, route risk, street names, maps, or high-G events.

## 15. License Exam / Prestige Contract

First License Exam: Local Delivery License.

Target requirements:

- Shop Level 5
- 25 fulfilled shop orders or fictional route completions
- 5 Passport Stamps
- at least one mastered or meaningfully progressed fictional route
- no real driving requirement

Rewards:

- 1 to 3 License Stars
- permanent License Perks
- easier early shop rebuild through shop-safe perks

Resets:

- Tips
- Tofu Stock
- Delivery Orders
- most station counts
- most shop generators
- Shop Reach
- Route Knowledge
- Shop Spirit

Persists:

- License Stars
- purchased License Perks
- Passport Stamps
- lifetime stats
- collection unlocks
- trusted certified delivery history summaries

License Perks must not improve real-world Cup Test scoring or qualification.

## 16. Systems Not Yet Ready

Keep these minimal or hidden until the core loop is fun:

- Rivals
- full Crew automation
- deep Garage upgrades
- Shop Spirit boost economy
- Regional Tofu Network
- multiple License Exams
- large Passport catalog
- sound/character unlock economy

These systems may exist in data or minimal UI, but they should not dominate first-session play.

## 17. Implementation Audit

Status values: `Implemented`, `Partial`, `Placeholder`, `Decorative only`, `Not implemented`.

| System | Status | Evidence | Gap |
| --- | --- | --- | --- |
| Tofu Press live production | Implemented | `TOFU_PRESS_BASE_PER_SECOND`, `tickOpenShopGenerators`, live tick/render tests | Needs balance tuning |
| Prep Counter conversion | Implemented | `PREP_COUNTER_BASE_ORDERS_PER_SECOND`, `applyShopGeneratorTick`, live tick/render tests | Needs clearer first-session gate |
| Fulfill Shop Order | Implemented | `fulfillShopOrder`, compact result tests | Needs first-order availability target |
| Tips | Implemented | `shop.tips`, order rewards | Need pacing tests for first upgrade timing |
| Tofu Stock | Implemented | `shop.tofuStock`, press production | Starting stock target not implemented |
| Delivery Orders | Implemented | `shop.deliveryOrders`, Prep Counter | Starting order target not implemented |
| Reputation | Implemented | order/route/certified rewards | Unlock pacing needs tuning |
| XP / level | Partial | total XP and level exist | Shop Level vs driver level semantics need tightening |
| Prep Slots | Partial | regen and purchase gates exist | Not yet explained well to players |
| Shop Reach | Partial | fictional route rewards exist | Route unlock pacing needs tuning |
| Shop Spirit | Partial | generators and boosts exist | Economy likely premature |
| Route Knowledge | Partial | route rewards exist | Mastery loop is shallow |
| Passport Stamps | Partial | many stamps exist | Needs staged reveal and category polish |
| License Stars / Exams | Partial | first exam/perks exist | Reset balance needs simulation |
| Fictional Routes | Partial | instant route cards exist | Need timed/queued route loop later |
| Crew automation | Placeholder | crew counts and hires exist | No meaningful assignment loop yet |
| Garage upgrades | Partial | fictional upgrades exist | Needs clearer purpose and pacing |
| Rivals | Placeholder | instant challenges exist | Should remain hidden until core loop works |
| Regional Tofu Network | Placeholder | high-tier station exists | Late-game balance not defined |
| Character / sound economy | Decorative only | cosmetic unlocks exist | Should not drive economy yet |
| Developer QA | Implemented | hidden Settings Developer Tools | Must stay hidden from normal users |
| Don't Spill the Cup boost path | Implemented | certified boost helpers/tests | Needs tuning, not gating |
| Button reliability | Implemented | shared click delegation, disabled reasons, button wiring tests | Continue visual QA on each panel |

Do not mark a system implemented just because a card or button exists. A system is implemented only
when it changes state, has feedback, has tests, and fits the balance loop.

## 18. Balance Tests

Tests that should enforce this contract:

- first order can be completed in under 30 seconds
- first upgrade can be purchased within 2 minutes
- first unlock appears within 5 minutes
- player cannot go resource-negative
- Buy Max behaves correctly
- offline progress respects cap
- production is displayed per second
- advanced tabs are hidden until relevant
- Cup Test is optional
- License Exam does not require real driving
- first-session UI does not show settings/debug/QA content prominently
- Settings contains Progress Tools and hides Developer Tools unless dev mode is enabled
- shop order result does not show a blank Share Card
- simulator/dev results do not count as trusted certified progress

## Recommended Next Implementation Milestone

Make the first ten minutes fun before deepening any advanced system.

Recommended next milestone:

1. Start with 10 Tofu Stock and 1 Delivery Order.
2. Make Fulfill Shop Order the first Tofu Shop action.
3. Ensure the first order grants enough Tips to visibly progress toward Prep Counter or Tofu Press.
4. Add tests for first order under 30 seconds and first upgrade within 2 minutes.
5. Hide or down-rank advanced tabs until the player has completed the first loop.

Do not add more systems until this loop is clear, paced, and tested.
