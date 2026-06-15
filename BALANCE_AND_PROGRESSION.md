# Tofu Driver Balance And Progression

This file is the source-of-truth contract for Tofu Shop idle-game balance, progression, unlock
pacing, and economy design. It does not define the whole Tofu Driver product canon; use `DESIGN.md`
for surfaces, safety/privacy, and future direction.

The site default route is Don't Spill the Cup (`#/cup-test`). Tofu Shop is still the base parked
progression layer, and this file governs that shop loop.

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

Physical driving must never be required for ordinary Tofu Shop progression. Don't Spill the Cup is
the default visitor-facing challenge and a special certification/status path, not the base-game
gate.

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

Canonical design statement:

> Tofu Shop is a one-loop incremental game that earns the right to unfold.

The first real MVP loop is:

```text
Tofu Stock -> Delivery Orders -> Fulfill Shop Order -> Tips -> Upgrade -> First Stamp
```

Routes, Crew, Garage, Shop Spirit, Rivals, License Exams, and broad Passport catalogs should remain
hidden, teased, or marked future/partial until this core loop feels good.

Early resource-funnel rule:

- Tofu Stock is production/input.
- Delivery Orders are prepared work.
- Fulfill Shop Order converts Delivery Orders into Tips, Reputation, and XP.
- Tips buy stations and upgrades.
- Pack Tofu is a backup/manual stock action, not the main money action.
- Don't Spill the Cup is optional and must not override normal shop bottleneck recommendations
  when orders are ready or Tips are needed.

## Progression Design Principles

### 1. Strict Balance-Sheet Thinking

Every button or mechanic should have:

- purpose
- cost
- unlock condition
- enabled condition
- effect
- expected time-to-buy
- bottleneck solved
- next-best-action text
- implementation status

If a mechanic cannot be written this way, it is not ready for implementation.

### 2. Bumpy Progression

The progression curve should feel like:

```text
fast gains -> slowdown -> big upgrade -> fast gains -> slowdown -> new system -> fast gains
```

Avoid a flat list of generators. The player should feel each purchase break a bottleneck.

### 3. Unfolding Mystery

First-time users should not see every system. New mechanics should appear right when the current
loop risks becoming boring.

### 4. No Click Spam

The game should not rely on repetitive tapping. Active play should be meaningful choices, shop
actions, upgrades, and delivery decisions.

### 5. Automation Removes Chores, Not Decisions

Automation should appear after the player understands the manual loop. It should reduce repeated
manual order handling, not hide the shop economy.

### 6. Prestige Is Earned By Plateau

License Exams should appear when the first loop has clearly slowed down, not merely because idle
games usually have prestige.

## Tofu Shop Subgenre

Tofu Shop is a hybrid of:

- production cascade
- unfolding mystery incremental
- cozy management game
- light prestige incremental later

Tofu Shop is not:

- a pure clicker
- a full RPG
- a system-dump idle game
- a racing game
- a speed-optimization game

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

The first 10 minutes should prove the one-loop incremental game. The player should not see the full
late-game system list yet. Locked systems should appear as short teasers only when the next goal
makes them relevant.

| Time Window | Player Experience | Visible Active Buttons | Scarce Resource | Reward Feeling | Unlock / Reveal | Next Best Action |
| --- | --- | --- | --- | --- | --- | --- |
| 0:00 to 1:00 | Player sees one shop order ready and can act immediately. | Fulfill Shop Order; Take the Cup Test as secondary | Delivery Orders | Tips, Reputation, XP | Shop Order Complete result; First Shop Order stamp | Fulfill Shop Order |
| 1:00 to 3:00 | Player watches Tofu Stock and Delivery Orders rebuild live. | Fulfill Shop Order when orders exist; Buy Tofu Press if affordable; Buy Steady Pressing if affordable or close; Take the Cup Test as secondary | Tips | First purchase or clear progress toward first upgrade | Steady Pressing upgrade | Buy Steady Pressing or Fulfill Shop Order, depending on resources |
| 3:00 to 5:00 | Player understands that Tofu Press feeds Prep Counter, which creates orders. | Fulfill Shop Order; Buy Tofu Press; Buy Prep Counter; Buy Steady Pressing; Buy Tidy Packaging if unlocked | Tofu Stock or Tips | Visible per-second rate improvement | Passport teaser after first stamp; Upgrades tab/card if relevant | Buy Prep Counter or improve Tofu Press |
| 5:00 to 10:00 | Player owns multiple basic generators and has a small upgrade path. | Fulfill Shop Order; Fulfill Max Orders if more than one order exists; Buy Tofu Press; Buy Prep Counter; Buy Steady Pressing; Buy Tidy Packaging; View Passport; Take the Cup Test as secondary | Tips or Delivery Orders | First meaningful production bump; first stamp collection feeling | First Passport card; hint that Routes exist later, not full route system | Buy the clearest bottleneck-solving upgrade |

By 10 minutes, a normal player should have:

- fulfilled multiple shop orders
- bought several Tofu Presses or clearly progressed toward them
- bought or already own Prep Counter
- seen Delivery Orders increase
- earned the First Shop Order stamp
- seen one meaningful upgrade
- understood that Don't Spill the Cup is optional
- reached at least Shop Level 2 or be close enough to understand why not

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
| Tofu Press | Available at start | Tofu Stock | None | 15 Tips after first owned station | 1.15 | 0.05 Tofu Stock/sec | First visible generator | Visible immediately |
| Prep Counter | Target: first session; current code gates by stock/level/station purchase | Delivery Orders | 2 Tofu Stock/order | 25 Tips | 1.16 | 0.0167 orders/sec | Converts stock into playable orders | Should be visible as next goal |
| Delivery Shelf | Shop Level 2 | Prep Counter boost | Tips, Prep Slots | 90 Tips | 1.17 | Boost only | Makes order production smoother | Teaser after Prep Counter |
| Shop Sign | Reputation 10 | Reputation/passive presentation | Tips, Prep Slots | 140 Tips | 1.18 | Small reputation effect | Unlocks customer layer | Hidden until reputation matters |
| Regular Customers | Shop Sign 1 | Tips over time | Delivery Orders | 240 Tips | 1.20 | Small Tips/sec | First passive Tips loop | Mid first hour |
| Delivery Routes | Shop Reach 2 | Tips, Reputation, Route Knowledge, Shop Reach | Tofu Stock, Orders | 420 Tips | 1.22 | Instant/queued route rewards | Fictional expansion layer | Preview by first hour |
| Dispatcher Desk | Reputation 40 | Automation support | Tips, Prep Slots | 900 Tips | 1.26 | Automation modifier | Reduces chores | Preview only |
| Regional Tofu Network | Shop Level 5 | Broad production boosts | Tips, Prep Slots | 2400 Tips | 1.32 | Global multiplier | Late-game scaling | Hidden first session |

## 9. Canonical Starting State

This is the target starting state for the next implementation pass. It is a design contract, not a
claim that current runtime constants already match.

| Item | Value | Reason |
| --- | ---: | --- |
| Tips | 0 | Player earns this through first action |
| Tofu Stock | 10 | Makes stock visible and meaningful immediately |
| Delivery Orders | 1 | Lets the first action happen immediately |
| Reputation | 0 | Earned from first order |
| XP | 0 | Earned from first order |
| Tofu Presses | 1 | Live production starts immediately |
| Prep Counters | 1 | Orders can rebuild without a dead wait |

Design decision: start with 1 Prep Counter.

Reason: starting with 0 Prep Counters creates a dead state after the first order unless the first
order immediately buys a Prep Counter. Starting with 1 makes the live production loop
understandable.

Current implementation gap: the runtime currently starts with one Tofu Press and no initial Delivery
Order. `IMPLEMENTATION_STATUS.md` should keep this first-loop balance gap visible until the runtime
matches the contract.

## First Loop Economy Targets

These draft targets are the first simulation baseline. They are not yet confirmed runtime values.

| Item | Target Value | Notes |
| --- | ---: | --- |
| Tofu Press production | 0.10 stock/sec | 6 stock/min, visible but not overwhelming |
| Prep Counter production | 0.025 orders/sec | 1 order every 40 seconds |
| Tofu per Delivery Order | 2 stock/order | Makes Tofu Stock matter |
| Fulfill Shop Order reward | 10 Tips, 1 Reputation, 8 XP | Simple first reward |
| First extra Tofu Press cost | 15 Tips | Buyable after about 2 orders |
| Steady Pressing cost | 20 Tips | Buyable around 1 to 2 minutes |
| Steady Pressing effect | Tofu Press output x1.5 | First obvious rate bump |
| First extra Prep Counter cost | 50 Tips | Buyable around 4 to 6 minutes |
| Early offline cap | 1 hour | Easier to balance than 8 hours |

Current implementation gaps to track:

- starting Tofu Stock target may differ from runtime
- starting Delivery Orders target may differ from runtime
- starting Prep Counter target may differ from runtime
- early offline cap target is 1 hour, while current implementation is 8 hours
- first extra Tofu Press currently follows station growth from the 15 Tips base cost, so its displayed
  next cost may be higher than the draft target after the free starting station
- first-loop reward/upgrade timing still needs simulation and tests

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

## Button Progression Contract

Fresh players should not see 20 active buttons. Buttons unfold by phase.

Station/generator controls and upgrade controls are separate:

- station controls buy more owned stations, such as `Buy Tofu Press` or `Buy Prep Counter`
- upgrade controls improve a station through named modifiers, such as `Buy Steady Pressing`
  or `Buy Tidy Packaging`
- early station and upgrade purchases should use Tips unless a later balance sheet explicitly
  says otherwise
- disabled Tip-cost buttons should name the source: fulfill shop orders to earn Tips
- visible buttons must be wired and functional, disabled with a clear reason, or hidden until
  their system is ready
- hidden advanced systems should not leak a full future checklist into the first shop view

### Phase 0: First Order, 0 To 1 Minute

Active buttons:

1. Fulfill Shop Order
2. Return to Tofu Shop, after result
3. Take the Cup Test, secondary

Disabled/teaser buttons:

4. Buy Tofu Press, if not affordable

Hidden:

- Routes
- Crew
- Garage
- Shop Spirit
- Rivals
- License
- deep Passport
- sound/character economy

### Phase 1: First Upgrade, 1 To 5 Minutes

Active buttons:

1. Fulfill Shop Order
2. Buy Tofu Press
3. Buy Steady Pressing
4. Buy Prep Counter, once visible
5. Take the Cup Test, secondary

Still hidden:

- Routes
- Crew
- Garage
- Rivals
- License

### Phase 2: First Shop Expansion, 5 To 15 Minutes

Active buttons:

1. Fulfill Shop Order
2. Fulfill Max Orders
3. Buy Tofu Press
4. Buy Prep Counter
5. Buy Steady Pressing
6. Buy Tidy Packaging
7. View Passport
8. Take the Cup Test, secondary

Teaser only:

- Routes

### Phase 3: First Hour

Add:

1. Buy Delivery Shelf
2. Buy Shop Sign
3. Start Shop Street fictional route
4. View Ledger
5. Crew Preview, disabled or teaser
6. License Preview, disabled or teaser

## Strict Button Schema

Every future button should be documented with this schema before implementation.

| Column | Purpose |
| --- | --- |
| id | Stable implementation id |
| label | User-facing text |
| phase | Progression phase |
| surface | Shop, Cup Test, Crew, Settings, Result |
| visibleWhen | Unlock / reveal condition |
| enabledWhen | Usable condition |
| disabledReason | Copy when disabled |
| cost | Resource cost |
| effect | State change |
| expectedTimeVisible | When player should first see it |
| expectedTimeToUse | Expected time-to-buy or time-to-click |
| bottleneckSolved | What problem it solves |
| nextBestActionText | CTA text if dominant |
| status | Implemented, Partial, Placeholder, Future |

Initial first-loop button inventory:

| id | label | phase | surface | visibleWhen | enabledWhen | disabledReason | cost | effect | expectedTimeVisible | expectedTimeToUse | bottleneckSolved | nextBestActionText | status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fulfill_shop_order | Fulfill Shop Order | 0 | Shop | Delivery Orders resource visible | Delivery Orders >= 1 and parked | Prep Counter needs delivery orders first. | 1 Delivery Order | +10 Tips, +1 Reputation, +8 XP | Immediately | Immediately | Converts orders into spend currency | Fulfill Shop Order | Implemented, balance target pending |
| fulfill_max_orders | Fulfill Max Orders | 2 | Shop | More than one order can exist | Delivery Orders >= 2 and parked | No Delivery Orders ready. | all available Delivery Orders | Fulfills all available orders | 5 to 10 minutes | When multiple orders exist | Reduces repetitive clicking | Fulfill Max Orders | Implemented, reveal timing pending |
| buy_tofu_press | Buy Tofu Press | 1 | Shop | Production basics visible | Tips >= cost and Prep Slots available | Need more Tips. | 15 Tips target | +0.10 stock/sec target before multipliers | 1 to 3 minutes | After about 2 orders | Low Tofu Stock | Buy Tofu Press | Implemented, cost target pending |
| buy_prep_counter | Buy Prep Counter | 1 | Shop | Player understands orders rebuild | Tips >= cost and Prep Slots available | Need more Tips. | 50 Tips target | +0.025 orders/sec target before multipliers | 3 to 5 minutes | 4 to 6 minutes | No Delivery Orders | Buy Prep Counter | Implemented, starting-state target pending |
| buy_steady_pressing | Buy Steady Pressing | 1 | Shop | First order complete | Tips >= 20 | Need 20 Tips. | 20 Tips | Tofu Press output x1.5 | 1 to 3 minutes | 1 to 2 minutes | Slow Tofu Stock growth | Buy Steady Pressing | Future naming/effect target |
| buy_tidy_packaging | Buy Tidy Packaging | 2 | Shop | 5 orders fulfilled | Tips >= 60 | Need 60 Tips. | 60 Tips | Prep Counter output x1.5 | 5 to 10 minutes | 5 to 10 minutes | Slow Delivery Order growth | Buy Tidy Packaging | Future naming/effect target |
| view_passport | View Passport | 2 | Shop | First stamp earned | Passport exists | Complete a stamp-worthy action first. | none | Opens stamp view | 5 to 10 minutes | After first stamp | Collection curiosity | View Passport | Partial |
| take_cup_test | Take the Cup Test | 0 | Shop/Cup Test | Always visible as secondary from shop | Parked and safety checklist complete for run start | Complete the safety checklist to begin. | none | Starts optional smooth-driving challenge | Immediately | Optional | Certified boost/status path | Take the Cup Test | Implemented |
| return_to_tofu_shop | Return to Tofu Shop | 0 | Result | Result screen shown | Always | none | none | Returns to shop dashboard | After first result | Immediately | Closes loop back to resources | Return to Tofu Shop | Implemented |

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

## Early Upgrade Ladder

Use safe shop language only. Do not use speed, racing, high-G, or unsafe vehicle-performance
language.

| Order | Upgrade | Unlock | Cost | Effect | Purpose |
| ---: | --- | --- | ---: | --- | --- |
| 1 | Steady Pressing | First order complete | 20 Tips | Tofu Press output x1.5 | First rate bump |
| 2 | Extra Mold | Own 3 Tofu Presses | 40 Tips | Tofu Press output x2 | First major production bump |
| 3 | Tidy Packaging | 5 orders fulfilled | 60 Tips | Prep Counter output x1.5 | More orders |
| 4 | Double Labels | Own 2 Prep Counters | 120 Tips | Prep Counter output x2 | Throughput jump |
| 5 | Better Boxes | 15 orders fulfilled | 200 Tips | +25% Tips per order | Improves reward loop |
| 6 | Shop Sign | 10 Reputation | 300 Tips | +50% Reputation per order | Opens route path |
| 7 | Regular Smile | Shop Level 2 | 500 Tips | small passive Tips/sec | First passive Tips income |
| 8 | Delivery Shelf | 25 orders fulfilled | 800 Tips | Prep Counter support/capacity | Smooth scaling |

## Generator Reveal Ladder

| Stage | Generator | Role | When Visible | Implementation Priority |
| ---: | --- | --- | --- | --- |
| 0 | Tofu Press | Makes Tofu Stock | Immediately | MVP |
| 0 | Prep Counter | Turns stock into orders | Immediately | MVP |
| 1 | Delivery Shelf | Supports order throughput | 10 to 20 minutes | Soon |
| 2 | Shop Sign | Reputation unlock engine | 20 to 40 minutes | Soon |
| 3 | Regular Customers | First passive Tips | 30 to 60 minutes | Later |
| 4 | Shop Street Route | First fictional route card | 45 to 90 minutes | Later |
| 5 | Apprentice Driver | First automation | 1 to 2 hours | Later |
| 6 | Dispatcher Desk | Automation layer | 2 to 4 hours | Future |
| 7 | Regional Tofu Network | Late-game scale | After first License Exam | Future |

The current broader systems may exist as scaffolding, but this ladder defines when they should
become meaningful.

## Progression Phase Map

| Phase | Time Target | Main Goal | Systems Allowed | Systems Hidden / Teased |
| --- | --- | --- | --- | --- |
| First Loop | 0 to 10 minutes | Orders, Tips, first upgrade, first stamp | Orders, Production basics, one upgrade, Passport teaser | Routes, Crew, Garage, Spirit, Rivals, License |
| First Shop | 10 to 60 minutes | Delivery Shelf, Shop Sign, Passport, route preview | Orders, Production, Upgrades, Passport, Ledger light | Crew, License, Rivals, Spirit |
| First Automation | 1 to 6 hours | Regular Customers, Shop Street, Apprentice preview | Routes, simple Crew preview, Shop Sign | Deep Garage, Rivals, full Spirit |
| First License | 4 to 6 hours | First prestige decision | License Exam preview, requirements, perks | Advanced licenses |
| Post-License | After first License Exam | Faster rebuild and deeper systems | Automation, Shop Spirit, deeper routes, crew, garage | Future late game |

## 12. Bottleneck Contract

Expected bottlenecks and Next Best Action:

- Delivery Orders ready and Tips low: fulfill shop orders
- no Delivery Orders: improve Prep Counter or wait for orders
- low Tofu Stock: buy/improve Tofu Press
- not enough Tips: fulfill shop orders
- low Reputation: fulfill orders or fictional routes
- route locked: build Reputation or Shop Reach
- Prep Slots empty: wait for recovery or buy a perk later
- License Exam close: show progress requirements

Only one dominant Next Best Action should appear. Secondary actions may exist, but the player should
not have to choose among several equal-weight CTAs.

Certified Cup Test should be presented as an optional boost/status path, not as the normal shop
bottleneck. It may be visible as secondary copy, but the early shop loop should prioritize the
resource conversion path first.

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

- 4 to 6 hours total shop time or 2 to 3 casual sessions
- Shop Level 5
- 50 fulfilled shop orders
- 5 Passport Stamps
- 1 fictional route discovered
- 1 route partially mastered
- no real driving requirement

Rewards:

- 1 License Star minimum
- 2 License Stars if overprepared
- 3 License Stars for a strong first run
- permanent License Perks
- easier early shop rebuild through shop-safe perks

Draft exam score formula for future simulation, not final:

```text
examScore =
  reputationThisRun
  + fulfilledOrders * 4
  + newStamps * 50
  + routeMasteryPoints * 10

licenseStarsGained = clamp(1, 3, floor(sqrt(examScore / 500)))
```

The first implementation can use hard requirements and a simple 1 to 3 Star result before adopting
the formula.

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

## First License Perk Shop

| Perk | Cost | Effect | Safety Note |
| --- | ---: | --- | --- |
| Morning Prep | 1 Star | Start each new shop run with +1 Tofu Press | Shop only |
| Labeled Bins | 1 Star | Prep Counter output +15% | Shop only |
| Bigger Thermos | 1 Star | Offline cap +1 hour | Shop only |
| Familiar Counter | 1 Star | First 10 orders give +25% Tips | Shop only |
| Extra Hands | 2 Stars | Prep Slots recover more often | Shop only |
| Calm Opening | 2 Stars | Start with 1 Delivery Order after exam | Shop only |

No License Perk may improve real-world Cup Test scoring, qualification, speed, route rewards, or
safety-sensitive behavior.

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

These systems may exist in data, local state, helper functions, tests, or minimal UI. Treat them as
scaffolding until `IMPLEMENTATION_STATUS.md` shows complete behavior and balance tests. They should
not dominate first-session play.

## Balance Sheet Schema

This is the contract for future spreadsheet/simulation work.

| Column | Purpose |
| --- | --- |
| id | Stable mechanic ID |
| label | User-facing name |
| stage | Reveal stage |
| visibleAt | Unlock condition |
| enabledWhen | Button usable condition |
| primaryResource | Tips, Stock, Orders, etc. |
| costFormula | Exact cost formula |
| baseCost | Starting cost |
| growthRate | Cost growth |
| effectFormula | Exact production/reward effect |
| expectedUnlockTime | Target time when visible |
| expectedTimeToBuy | Target time from visible to usable |
| bottleneckSolved | What problem it fixes |
| nextBestActionText | CTA text |
| replacesOrAutomates | Earlier action it replaces or automates |
| safetyNotes | Cup Test/privacy/safety constraints |
| status | Planned, Implemented, Partial, Placeholder, Future |

Starter balance-sheet rows:

| id | label | stage | visibleAt | enabledWhen | primaryResource | costFormula | baseCost | growthRate | effectFormula | expectedUnlockTime | expectedTimeToBuy | bottleneckSolved | nextBestActionText | replacesOrAutomates | safetyNotes | status |
| --- | --- | --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| fulfill_shop_order | Fulfill Shop Order | First Loop | Start | Delivery Orders >= 1 | Delivery Orders | flat | 1 order | 1.0 | +10 Tips, +1 Reputation, +8 XP | 0:00 | immediate | Converts orders to spendable progress | Fulfill Shop Order | none | Parked-only, no sensors | Implemented, target rewards pending |
| tofu_press | Tofu Press | First Loop | Start | always owned; buys require Tips | Tips | baseCost * growthRate ^ owned | 15 | 1.15 | +0.10 stock/sec target each | 0:00 | about 2 orders for first extra | Low Tofu Stock | Buy Tofu Press | Pack Tofu pressure | Shop only | Implemented, target values pending |
| prep_counter | Prep Counter | First Loop | Start | always owned; buys require Tips | Tips | baseCost * growthRate ^ owned | 50 | 1.16 | +0.025 orders/sec target each, consumes stock | 0:00 | 4 to 6 minutes for first extra | No Delivery Orders | Buy Prep Counter | Manual waiting | Shop only | Implemented, starting target pending |
| steady_pressing | Steady Pressing | First Upgrade | First order complete | Tips >= 20 | Tips | flat or upgrade growth | 20 | TBD | Tofu Press output x1.5 | 1 to 3 minutes | 1 to 2 minutes | Slow stock rebuild | Buy Steady Pressing | none | Shop language only | Future target |
| extra_mold | Extra Mold | First Upgrade | Own 3 Tofu Presses | Tips >= 40 | Tips | flat or upgrade growth | 40 | TBD | Tofu Press output x2 | 3 to 6 minutes | TBD | First production plateau | Buy Extra Mold | none | Shop language only | Future target |
| tidy_packaging | Tidy Packaging | First Shop | 5 orders fulfilled | Tips >= 60 | Tips | flat or upgrade growth | 60 | TBD | Prep Counter output x1.5 | 5 to 10 minutes | 5 to 10 minutes | Slow order rebuild | Buy Tidy Packaging | none | Shop language only | Future target |
| double_labels | Double Labels | First Shop | Own 2 Prep Counters | Tips >= 120 | Tips | flat or upgrade growth | 120 | TBD | Prep Counter output x2 | 10 to 20 minutes | TBD | Order throughput plateau | Buy Double Labels | none | Shop language only | Future target |
| first_shop_order_stamp | First Shop Order Stamp | First Loop | First order fulfilled | automatic | none | none | 0 | 1.0 | Unlock first stamp | 0:00 to 1:00 | immediate | Collection reveal | View Passport | none | Local-only stamp | Implemented, reveal target pending |
| delivery_shelf | Delivery Shelf | First Shop | 25 orders fulfilled | Tips >= 800 | Tips | station growth | 800 | 1.17 | Prep Counter support/capacity | 10 to 20 minutes | TBD | Scaling order flow | Buy Delivery Shelf | none | Shop only | Partial |
| shop_sign | Shop Sign | First Shop | 10 Reputation | Tips >= 300 | Tips | station growth | 300 | 1.18 | +50% Reputation/order target | 20 to 40 minutes | TBD | Opens route path | Buy Shop Sign | none | Shop only | Partial |
| local_delivery_license | Local Delivery License | First License | plateau requirements met | confirmation | shop progress | requirements | 0 | 1.0 | reset selected progress, grant 1-3 Stars | 4 to 6 hours | at plateau | Long plateau | Take License Exam | first run loop | No real driving requirement | Partial |

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

- fresh shop starts with 10 Tofu Stock
- fresh shop starts with 1 Delivery Order
- fresh shop starts with 1 Tofu Press
- fresh shop starts with 1 Prep Counter
- first order can be fulfilled immediately
- first order grants 10 Tips, 1 Reputation, and 8 XP
- First Shop Order stamp unlocks on first order
- first order can be completed in under 30 seconds
- first upgrade can be purchased within 2 minutes
- first extra Tofu Press is reachable after about 2 orders
- Steady Pressing is reachable around 1 to 2 minutes
- buying Steady Pressing increases visible Tofu Stock/sec
- first extra Prep Counter is reachable around 4 to 6 minutes
- first unlock appears within 5 minutes
- player cannot go resource-negative
- Buy Max behaves correctly
- offline progress respects cap
- production is displayed per second
- advanced systems do not dominate the first 10 minutes
- advanced tabs are hidden until relevant
- no active visible button lacks behavior
- disabled buttons show reasons
- Cup Test is optional
- no real-world driving is required for ordinary shop progression
- License Exam does not require real driving
- no speed, GPS, route, map, street name, or high-G data affects shop progression
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
