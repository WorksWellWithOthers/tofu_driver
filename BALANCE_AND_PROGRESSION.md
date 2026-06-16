# Tofu Shop Balance And Progression

This file is the implementation reference for the Tofu Shop idle/incremental game. It defines the
intended economy, pacing, reveal order, button behavior, bottleneck rules, generator ladder,
upgrade ladder, prestige expectations, and test contract.

This file does not define the whole Tofu Driver product canon. Use `DESIGN.md` for product
surfaces, safety/privacy rules, and long-term design philosophy. Use `IMPLEMENTATION_STATUS.md` for
evidence of what is actually implemented.

Do not treat a mechanic as implemented because it appears in this file. A mechanic is implemented
only when it changes state, gives player feedback, is tested, and fits this progression contract.

## 1. Product Role

Tofu Shop is the parked-only idle/incremental game inside Tofu Driver.

Its role:

- base home progression layer
- cozy production and shop-management game
- playable without sensors, location, or a car ride
- local-first, static-browser friendly game state
- optional companion to Don't Spill the Cup, not a gate behind it

Don't Spill the Cup is the iconic smooth-driving challenge and optional certified boost/status
path. It can make the shop feel special, but ordinary shop progression must not require physical
driving.

Idle-first rule:

- manual actions teach the loop
- automation replaces repeated labor
- player decisions, not clicking speed, drive progression
- every repeated manual action needs an automation exit
- good actions are buying upgrades, solving bottlenecks, starting or pausing Counter Service,
  spending Shop Spirit, choosing future business direction, building/keeping/selling cars later,
  and choosing prestige/reset timing later
- bad repeated labor is clicking hundreds of times to make tofu, manually fulfilling every order
  forever, clicking faster to progress faster, or clicking during active driving

Tofu Shop is:

- a one-loop incremental game that earns the right to unfold
- a production cascade
- an unfolding mystery incremental
- a cozy management game
- a light prestige incremental later

Tofu Shop is not:

- a racing game
- a speed-optimization game
- a route-competition game
- a pure clicker
- a click-spam game
- a full RPG
- a system-dump idle game

Design statement:

```text
Tofu Shop is a one-loop incremental game that earns the right to unfold.
```

Core MVP loop:

```text
Tofu Stock -> Prep Counter -> Delivery Orders -> Fulfill Shop Order -> Tips -> Buy Stations/Upgrades -> First Stamp
```

Keep this loop fun before expanding Routes, Crew, Garage, Shop Spirit, Rivals, License Exams, or
large Passport catalogs.

Safety rule:

Shop progression must not use speed, live speed display, real routes, maps, street names,
coordinates, high-G bragging, public road competition, raw GPS upload, or raw motion upload.

## Design Summary

The intended Tofu Shop arc is a calm production game that unfolds only after each loop has a clear
reason to exist.

| Arc | Target Experience | Main Systems | Success Criteria |
| --- | --- | --- | --- |
| First 10 minutes | Learn stock, orders, Tips, first upgrade, and first stamp | Tofu Press, Prep Counter, Simple Tofu Box, Tidy Packaging when order prep is the bottleneck, Passport teaser | The player understands `Tofu Stock -> Orders -> Tips` without seeing a full system dump |
| First hour | Turn the counter into a small shop | Family Tofu Tray, Festival Bento teaser, Delivery Shelf, Shop Sign, fuller Passport | Tofu Stock matters through larger orders, Delivery Shelf improves throughput, and Shop Sign makes Reputation matter |
| First day | Start building a fictional delivery network | Shop Street, Regular Customers, simple automation preview, Ledger flavor | The player sees a reason to return beyond raw production numbers |
| First prestige | Convert a plateau into a License Exam decision | Local Delivery License, License Stars, first License Perks | Resetting feels earned and makes the rebuild faster without requiring real driving |
| Post-prestige | Rebuild faster and open deeper systems | License Perks, stronger automation, deeper route/shop systems | Permanent perks make the first loop feel smoother while preserving the safety contract |

The first implementation priority is still the smallest fun loop. Larger systems should earn their
screen space by solving a bottleneck the player has already felt.

`EXTERNAL_REFERENCE_DOPEWARS_AUDIT.md` is a future mechanics study only. Its safe translations
include demand boards, supplier offers, opportunity cards, and garage markets, but those systems
should not be implemented until the First Loop Contract and first 10 minutes are playtested.

`EXTERNAL_REFERENCE_ANTIMATTER_DIMENSIONS_AUDIT.md` is a future progression-architecture study
only. Its safe translations include a single Next Milestone bar, station milestone boosts,
automation after mastery, challenge-like shop trials, and later prestige visibility. These ideas
should support the existing Tofu Shop cascade without copying reference theme, formulas, UI, names,
or implementation details.

`EXTERNAL_REFERENCE_INCREMENTAL_GAME_DESIGN_TRANSCRIPTS_AUDIT.md` is a transcript synthesis study.
Its useful lessons for this file are: keep the first five to ten minutes tight, show a visible next
goal, make upgrades solve the current bottleneck, delegate repeated actions after mastery, add
novelty when repetition starts, and avoid turning future systems into early UI clutter.

## 2. Core Loop

The first playable loop has eight steps.

1. Tofu Press creates Tofu Stock.

   Purpose: show the first live incremental number. Tofu Stock is an ingredient and runway resource,
   not the purchase currency.

2. Prep Counter consumes Tofu Stock.

   Purpose: make Tofu Stock meaningful. Stock matters because it feeds the order-production
   machine.

3. Prep Counter prepares Delivery Orders.

   Purpose: create the first throughput bottleneck. Delivery Orders are money opportunities, but
   only whole ready orders can be fulfilled.

4. Fulfill Shop Order converts Delivery Orders into Tips, Reputation, and XP.

   Purpose: teach the money conversion. This is the first satisfying action and should be available
   immediately on a fresh shop.

5. Tips buy stations and upgrades.

   Purpose: make a clear spend currency. Tips are the main early purchase currency; Tofu Stock is
   the production input.

6. Reputation unlocks new systems.

   Purpose: make progress feel social and narrative. Reputation should gate new shop features
   without becoming an early spend currency.

7. Stamps create collection/status goals.

   Purpose: add mystery and emotional rewards. Stamps should appear as discoveries, not as a full
   checklist on first load.

8. License Exams eventually reset shop progress for permanent perks.

   Purpose: create prestige after a plateau. The first License Exam should not appear until the
   player understands the shop loop and has reached a real slowdown.

The player-facing explanation should stay simple:

```text
Tofu Stock becomes Delivery Orders. Delivery Orders become Tips.
```

Early conversion roles:

- Tofu Stock is ingredient/runway.
- Prep Counter is throughput.
- Delivery Orders are money opportunities.
- Tips are purchase currency.
- Reputation is unlock pressure.
- Stamps are discovery/status.

## 3. Resource Contract

Each resource needs a clear purpose, source, sink, reveal timing, scarcity pattern, bottleneck, and
License Exam reset rule.

| Resource | Purpose | Main Sources | Main Sinks | Appears | Scarcity Target | Bottleneck Created | License Exam Reset |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tofu Stock | Ingredient, runway, and order-size input | Tofu Press, Pack Tofu, offline production, shop boosts | Prep Counter, larger shop orders, future fictional routes | Immediately | Low only when Prep Counter or larger orders outrun press output | Not enough stock to prepare or fulfill the best order | Resets |
| Delivery Orders | Ready work that can become money | Prep Counter, boosts, later automation | Fulfill Shop Order, later routes/rivals | Immediately | First visible throughput bottleneck | No ready orders to fulfill | Resets |
| Tips | Main purchase currency | Fulfilled orders, Regular Customers, routes, certified boosts | Stations, upgrades, garage, crew, route cards | Immediately after first order | Scarce early, abundant later | Cannot buy next improvement | Resets |
| Reputation | Unlock currency and social proof | Orders, routes, certified smooth results, stamps | Mostly gates, rarely spent | After first order | Scarce and meaningful | Next system remains locked | Resets, lifetime persists |
| XP | Local player/shop progress feedback | Orders, routes, training, Cup Test results | None by default | After first order | Steady visible progress | Level requirements not met | Lifetime should persist unless prestige design says otherwise |
| Prep Slots | Staffing/capacity gate | Timed recovery, perks | Station, crew, and route expansion purchases | When multi-buy/staffing matters | Mild friction, not a first-loop blocker | Cannot add more capacity yet | Resets, perks persist |
| Shop Reach | Fictional expansion gate | Fictional route cards and route milestones | District, route, crew unlocks | With routes | Mid-game scarce | New district/route locked | Resets unless perked |
| Shop Spirit | Parked-only boost energy | Tea Kettle, Shrine Corner, Festival Lanterns | Shop Spirit boosts | After stable production | Optional and capped | Cannot trigger active shop boost | Resets |
| Route Knowledge | Fictional mastery/progression | Fictional routes, Training Lot | Route unlocks, mastery gates, License requirements | With routes | Mid-game mastery pressure | Route/license requirement not met | Resets, lifetime records persist |
| Passport Stamps | Achievement/status collection | Orders, upgrades, routes, certified deliveries, secrets | Unlock/status gates | First stamp-worthy action | Rare enough to feel discovered | Collection or License gate | Persists |
| License Stars | Prestige currency | License Exams | License Perks | First License Exam | Rare and powerful | Permanent perk choice | Persists |

### Complete Resource Economy

| Resource | Player-Facing Meaning | Source | Sink | When It Appears | Why It Matters | Upgrade Hooks | Future Systems |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tofu Stock | tofu on hand for orders | Tofu Press, Pack Tofu, offline progress, shop boosts | Prep Counter, larger order types, future route cards | immediately | creates order-size capacity and prevents Prep Counter starvation | Steady Pressing, Double Mold, Tofu Press milestones, License Perks | Catering Crate, Neighborhood Bundle, route cards, Regional Tofu Order |
| Delivery Orders | prepared work ready to hand off | Prep Counter, boosts, later automation | order fulfillment, Regular Customers, route cards | immediately | turns production into spendable Tips | Tidy Packaging, Double Labels, Delivery Shelf, Prep Counter milestones | Regular Customers, Apprentice Driver, route queues |
| Tips | spendable shop money | order types, Regular Customers, routes, certified boosts | stations, upgrades, crew, garage, route cards | after first order | drives almost every early purchase | Better Boxes, Regular Smile, License Perks | bigger stations, automation, route systems |
| Reputation | proof the shop is known | orders, Shop Sign, route cards, stamps, certified boosts | unlock gates more than spending | after first order | opens systems without draining the main currency | Shop Sign, Word of Mouth, route mastery bonuses | routes, Crew preview, License requirements |
| XP | local progress meter | orders, routes, training, Cup Test summaries | level gates only | after first order | gives visible growth and shop-level pacing | Better Boxes, route reports, certified result bonuses | level labels, License requirements |
| Prep Slots | available staff attention/capacity | timed recovery, License Perks | station/crew/route expansion | after basic purchases matter | prevents unlimited instant expansion without creating click spam | Extra Hands, Dispatcher Desk, staffing upgrades | crew hiring, route assignments, network stations |
| Shop Reach | fictional shop footprint | route cards, route mastery, Reputation milestones | district/route unlocks | with routes | expands the fictional world without using real maps | Shop Sign, Route Notebook, route mastery | new route cards, regional network |
| Shop Spirit | parked boost energy | Tea Kettle, Shrine Corner, Festival Lanterns | shop-only boosts | after stable production | adds short active sessions without driving pressure | Warmer Kettle, Festival Lanterns, Spirit milestones | Festival Boosts, event orders |
| Route Knowledge | fictional mastery notes | route cards, Training Lot, route reports | route unlock/mastery gates | with routes | makes route play more than one-off rewards | Route Notebook, Training Lot upgrades | License requirements, route automation |
| Passport Stamps | discoveries and status | first order, upgrades, routes, certified results, secrets | collection gates and License requirements | first stamp-worthy moment | adds mystery and emotional reward | stamp rewards, collection perks | fuller Passport categories, cosmetic unlocks |
| License Stars | permanent prestige currency | License Exams | License Perks | first prestige | makes reset worth doing | exam scoring, overprepared bonuses | permanent rebuild perks, deeper license tiers |

### Tofu Stock Runway

Tofu Stock should be displayed as useful runway, not as a mysterious pile of currency.

Core helper target:

```text
stockOrdersRemaining = floor(Tofu Stock / tofuPerOrder)
```

Player-facing copy:

- 10+ orders supported: `Enough tofu for now.`
- 3 to 9 orders supported: neutral reminder.
- fewer than 3 orders supported: `Tofu Stock is getting low.`
- 0 orders supported: `Need more Tofu Stock.`

Recommendation rule:

- If Tofu Stock runway is healthy and orders are slow, do not recommend Tofu Press.
- If Tofu Stock runway is low, recommend Pack Tofu or Buy Tofu Press.

### Delivery Order Display

Delivery Orders may be fractional internally as generator carry. The UI should not show fractional
orders as usable orders.

Display target:

```text
Ready Orders: 0
Preparing next order
[progress bar at 30%]
About 28 seconds remaining
```

The progress bar is the primary visual. Percentage and ETA are supporting text. If Tofu Stock is
insufficient, the Prep Counter should show a paused state and keep the current progress instead of
advancing or jumping. When ready orders exist, the bar remains secondary to fulfillment actions.

Fulfill Shop Order requires at least 1 ready order.

### Number Formatting

Player-facing Tofu Shop values should use compact incremental formatting as values grow:

```text
K, M, B, T, Qa, Qi, Sx, Sp, Oc, No, Dc
```

Formatting is display-only. Internal resource values, costs, rewards, and progress state remain
exact. Discrete missing requirements such as Prep Slots, ready orders, station counts, stamps, and
License Stars round up in disabled reasons. Small live balances may show short decimals when that is
needed to make ticking visible, but long raw decimals should never be exposed.

### Next Milestone Bar

Next Milestone Bar V1 is implemented as a compact Overview card. It shows one relevant shop goal at
a time, not the full roadmap, and pairs with Next Best Action: the milestone says what the player is
working toward, while Next Best Action says what to do now.

Implemented target order:

1. First Shop Order.
2. First Upgrade Purchased.
3. First 10 Orders.
4. First Family Tofu Tray.
5. First 100 Tips.
6. Delivery Shelf unlock.
7. Shop Sign unlock.
8. Counter Service start, after First 10 Orders if it has not been acknowledged yet.

Rules:

- one visible milestone at a time
- no full future roadmap
- no advanced tab unlock from raw idle accumulation alone
- milestone changes should follow meaningful actions, stamps, or bottlenecks
- visible locked goals are allowed only when they clarify the next phase; they should not become
  clickable advanced tabs during the first loop
- the optional long-horizon `$1T fictional Net Worth` line may appear only after an early shop
  milestone such as First Family Tofu Tray or First 100 Tips
- no Net Worth counter, asset valuation, business valuation, or social system is implemented by
  this bar
- current status: Implemented V1

### Counter Service V1

Counter Service is the first earned automation layer. It unlocks after First 10 Orders and starts
paused, because manual fulfillment should teach the stock-to-orders-to-Tips loop before automation
removes the repeated handoff chore.

V1 behavior:

- parked/shop only; it never runs during an active Cup Test
- active-page only; it does not auto-fulfill during offline progress
- default priority is `Best Available`: Festival Bento, then Family Tofu Tray, then Simple Tofu Box
  when each order type is unlocked and affordable
- rate is 1 automated handoff every 10 seconds before upgrades
- Overview shows a Counter Service income/status line: `+X Tips/min when supplied`, or a clear
  waiting state for missing Tofu Stock or ready orders
- it consumes the same ready Delivery Orders and Tofu Stock as manual fulfillment
- it grants the same Tips, Reputation, and XP as manual fulfillment
- feedback is inline and ledger entries are batched/rate-limited so automation does not spam
  result screens or fanfares
- V1 finite upgrades improve handoff interval: Order Bell `10s -> 8s`, Wider Counter `8s -> 6s`,
  and Pickup Routine `6s -> 4s`
- future upgrades may add bulk handoff, stock reserves, and priority tuning, but those are not in V1

Regular Customers remain future. Counter Service is the current narrow automation slice.

Transcript-derived tuning notes:

- Counter Service should not erase Tofu Stock pressure; if automation stalls, the correct next
  decision is stock supply, press upgrades, or order-size choice.
- Counter Service upgrades are intentionally finite in V1 so they create a clear bump without
  becoming a new infinite click/purchase treadmill.
- After Counter Service is tuned, the next automation candidate should add a new decision or sink,
  not merely remove all remaining interaction.

### Transcript-Derived Progression Rules

- First-session tuning matters more than broad feature count. Prioritize the first order, first
  upgrade, First 10 Orders, and first automation handoff over later systems.
- The game should alternate between `I can handle this now` and `I need a new support layer`.
  Larger orders, Delivery Shelf, Shop Sign, and Counter Service should each create that push-pull.
- Station Milestone Boosts V1 is implemented for the first support counts: 5/10 Tofu Presses,
  5/10 Prep Counters, 5/10 Delivery Shelves, and 5/10 Shop Signs. These boosts keep old stations
  relevant without adding a new currency or tab.
- New resource sinks should create choices. Dream Garage, project cars, and Net Worth remain useful
  future sinks only after Tips and shop automation are fun locally.
- Prestige should remain a visible later goal, not an early tab. License Exam belongs after a real
  shop plateau.
- Avoid expanding social/status, premium cosmetics, and endgame valuation before the local shop loop
  has repeatable motivation.

Near-term candidate:

Station Milestone Boosts V1 should be the smallest possible version if implemented next. Prefer
inline milestones for existing stations over a new tab: 5 Tofu Presses, 10 Tofu Presses, 5 Prep
Counters, and 10 Prep Counters. Each should show one clear before/after production bump, use inline
feedback rather than a major fanfare, and remain shop-only with no Cup Test scoring effect.

### Order Size Ladder

Raw Tofu Stock must not directly multiply Tips. Instead, stock matters because larger order types
require more tofu and pay better rewards.

| Order Type | Unlock | Tofu Required | Delivery Orders Required | Tips | Reputation | XP | Purpose | Expected First Use | Status |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| Simple Tofu Box | available immediately | 6 | 1 | 10 | 1 | 8 | tutorial order; teaches that orders become Tips and stock is a real input | 0:00 | Implemented |
| Family Tofu Tray | after 5 fulfilled orders or Shop Level 2 | 24 | 1 | 45 | 3 | 24 | first moment extra Tofu Stock matters | 5 to 10 minutes | Implemented |
| Festival Bento | after 25 fulfilled orders or 50 Reputation | 75 | 2 | 130 | 8 | 70 | first big payout and first multi-order sink | 20 to 40 minutes | Implemented |
| Catering Crate | after Delivery Shelf/Shop Sign are meaningful | 50 | 5 | 400 | 20 | 180 | mid-game stock sink | First day | Future/hidden |
| Neighborhood Bundle | after first fictional route progress | 90 | 8 | 850 | 35 | 320 | connects shop orders to the route/network phase | First day or later | Future |
| Regional Tofu Order | after first License Exam or Regional Tofu Network preview | 250 | 20 | 3000 | 120 | 1100 | late-game stock sink and prestige runway test | Post-License | Future |

Order UI contract:

- show available order types as cards in Overview
- show tofu cost, ready-order cost, Tips/Reputation/XP preview, unlock condition, and disabled
  reason
- hide Catering Crate until a later mid-game pass
- label Fulfill Max with the order type, such as `Fulfill Max Family Tofu Tray x4`
- if no order type is specified, Fulfill Max should use the best currently fulfillable order type

Order design rules:

- larger orders are not automatic multipliers; they are separate decisions with stock and ready-order
  requirements
- the player should see why a larger order is unavailable: not enough Tofu Stock, not enough ready
  Delivery Orders, or not unlocked yet
- larger order cards should appear only when they are close enough to matter
- the first larger order should make a stocked pantry feel useful, not punish the player for having
  stock
- if a larger order is unlocked but stock is low, the Next Best Action can point to Tofu Press or
  Pack Tofu because the player now understands why stock matters

## Tofu Production Cascade

The full shop progression borrows the structure of strong cascading incremental games, but every
system is translated into shop, delivery, license, and courier language.

External progression reference note: the Antimatter Dimensions audit reinforces this cascade rule.
Later systems should make Tofu Press, Prep Counter, Delivery Shelf, Shop Sign, orders, and stamps
more valuable rather than replacing them.

| Tier | Station/System | Produces/Boosts | Consumes | Main Purpose | Unlock Timing | Player Decision |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Tofu Press | Tofu Stock | none | creates the ingredient/runway resource | immediately | buy more press capacity when stock runway is low |
| 2 | Prep Counter | Delivery Orders | Tofu Stock | turns stock into money opportunities | immediately | buy more counters when stock is healthy but orders are slow |
| 3 | Delivery Shelf | Prep Counter throughput/order handling | Tips, Prep Slots | makes the order pipeline scale without click spam | 10 to 20 minutes | buy support when counters become cramped |
| 4 | Shop Sign | Reputation gains and Regular Customer unlock pressure | Tips, Prep Slots | shifts focus from pure Tips to shop visibility | 20 to 40 minutes | invest when the next system is reputation-gated |
| 5 | Counter Service | order handoff automation | ready Delivery Orders and Tofu Stock reserves | removes repeated fulfillment clicks after manual mastery | after First 10 Orders | start/pause automation while preserving manual control |
| 6 | Regular Customers | passive Tips from simple orders | Delivery Orders if available | reduces manual money conversion chores beyond handoff automation | 30 to 60+ minutes | choose passive income versus more raw production |
| 7 | Shop Street / Fictional Route Cards | Tips, Reputation, Shop Reach, Route Knowledge, stamps | Tofu Stock, Delivery Orders | adds story goals and mastery without real roads | 40 to 90 minutes | spend resources on route cards or keep scaling shop |
| 8 | Apprentice Driver | automated fictional route/shop task output | Delivery Orders, route slots | removes chores after the player understands them | 1 to 2 hours | assign limited crew to the best fictional task |
| 9 | Dispatcher Desk | automation efficiency and crew assignment clarity | Tips, Prep Slots | makes automation legible and scalable | 2 to 4 hours | invest in coordination instead of raw stations |
| 10 | Regional Tofu Network | broad lower-tier multipliers and prestige requirements | high Tips, Shop Reach, License progress | late-game scale and prestige pressure | after first License Exam | build a network or prepare for the next exam |

Each tier should make earlier tiers more valuable:

- Prep Counter makes Tofu Press matter.
- Larger orders make both Tofu Press and Prep Counter matter.
- Delivery Shelf makes Prep Counter scaling feel smooth.
- Shop Sign makes Reputation and later systems visible.
- Counter Service makes manual order fulfillment a mastered chore rather than a forever-click.
- Regular Customers later make order production useful even while idle.
- Fictional routes turn shop resources into story, reach, and mastery.
- Apprentice Driver and Dispatcher Desk automate repeated fictional tasks after they are understood.
- Regional Tofu Network turns a matured shop into a prestige-scale economy.

## 4. First 10 Minutes

The first 10 minutes should prove the one-loop game. Fresh players should not see every advanced
system.

| Time Window | Player Goal | Visible Resources | Visible Active Buttons | Visible Disabled Buttons | Hidden Systems | Intended Bottleneck | Next Best Action Text | Expected Reward | Expected Unlock / Story Beat |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0:00 to 0:30 | Understand that one shop order is ready | Tofu Stock, Delivery Orders, Tips, Reputation, XP | Fulfill Shop Order; Take the Cup Test as secondary | Buy Tofu Press if shown but unaffordable | Routes, Crew, Garage, Shop Spirit, Rivals, License, deep Passport, character/sound economy | Delivery Orders as the first money opportunity | `Fulfill Shop Order` | +Tips, +Reputation, +XP | `The first order leaves the counter.` |
| 0:30 to 1:00 | See the result and stay in the shop | Tips, Reputation, XP, Tofu Stock, ready/preparing orders | Inline order feedback; Fulfill Shop Order if another order is ready | Tidy Packaging if the Prep Counter bottleneck is visible but not affordable | Advanced panels remain hidden | Need Tips or waiting for next order | `Fulfill Shop Order` or `Wait for Prep Counter` | Inline shop-order feedback | First Shop Order stamp should appear or be teased |
| 1:00 to 2:00 | Learn that Prep Counter rebuilds orders | Tofu Stock, Ready Orders, Next Order progress, Tips | Fulfill Shop Order when ready; Buy Tidy Packaging if affordable; Buy Tofu Press if stock is low; Take the Cup Test secondary | Tidy Packaging if close but unaffordable | Routes, Crew, Garage, Spirit, Rivals, License | Either Tips or order preparation | `Fulfill Shop Order`, `Buy Tidy Packaging`, or `Wait for Prep Counter` | Another order payout or progress toward first purchase | `The counter is learning the rhythm.` |
| 2:00 to 3:00 | Make or approach the first meaningful purchase | Tips, Tofu Stock runway, order prep progress | Buy Tidy Packaging if affordable; Buy Prep Counter if affordable; Buy Tofu Press or Steady Pressing only if stock is low; Fulfill Shop Order | Buy Prep Counter if not affordable | Full Passport, Routes, Crew, Garage, Spirit, License | First purchase cost | `Buy Tidy Packaging` or `Fulfill Shop Order` | First order-throughput bump or clear progress toward it | Upgrade card becomes visible only when relevant |
| 3:00 to 5:00 | Understand stock versus throughput | Tofu Stock runway, Ready Orders, Tips, Reputation | Buy Prep Counter if stock is healthy and orders are slow; Buy Tidy Packaging; Buy Tofu Press if stock is low; Fulfill Shop Order | Steady Pressing if stock is healthy and not relevant | Routes only as subtle teaser if needed; Crew/Garage/Spirit/Rivals/License hidden | Stock runway or order throughput | `Buy Prep Counter`, `Buy Tidy Packaging`, or `Buy Tofu Press` based on bottleneck | Visible `/sec` improvement | Passport teaser after first stamp |
| 5:00 to 10:00 | Own the basic loop and see first collection hook | Tofu Stock, Delivery Orders, Tips, Reputation, XP, first stamp | Fulfill Max Orders if multiple ready; Buy Tofu Press; Buy Prep Counter; Buy Tidy Packaging; Buy Steady Pressing when stock is low; View Passport | Better Boxes if close but not unlocked | Routes as teaser only; Crew/Garage/Spirit/Rivals/License hidden | Clear bottleneck-solving upgrade | `Buy the clearest bottleneck-solving upgrade` | First meaningful production bump and stamp feeling | First Passport card; hint that Routes exist later |

By 10 minutes, a normal player should have:

- fulfilled multiple shop orders
- seen Delivery Orders rebuild without refresh
- understood that Tofu Stock feeds Prep Counter
- understood that Delivery Orders become Tips
- bought or clearly progressed toward the first upgrade
- earned or seen the First Shop Order stamp
- seen Don't Spill the Cup as optional, not mandatory
- avoided a wall of advanced systems

## 5. First Hour

The first hour should introduce breadth gradually, only when each new mechanic solves a real
bottleneck.

| Time Window | New Mechanic Introduced | Why It Appears Now | Button Count Target | New Bottleneck | Expected Purchase Targets | Still Hidden |
| --- | --- | --- | ---: | --- | --- | --- |
| 10 to 20 minutes | Delivery Shelf preview or purchase | Order throughput starts to feel cramped | 6 to 8 active shop buttons | Delivery Order flow/capacity | Tofu Press, Prep Counter, Tidy Packaging, Delivery Shelf | Crew automation, Shop Spirit, Rivals, License reset |
| 20 to 40 minutes | Shop Sign and fuller Passport | Reputation begins to matter | 7 to 10 active buttons | Reputation unlock pressure | Shop Sign, Better Boxes, Double Labels | Full route network, full Crew, Spirit boost economy, License action |
| 40 to 60 minutes | First fictional route preview or Shop Street | Player needs a new kind of goal after core upgrades | 8 to 12 active buttons | Route unlock cost and first Route Knowledge | Shop Sign, Delivery Shelf, Shop Street, View Ledger | Deep Garage, Rivals, full automation, License Exam confirmation |

First-hour target:

- multiple Tofu Presses and Prep Counters
- at least one named upgrade on each early station
- 3 to 5 stamps possible
- one fictional route preview or unlock
- light Ledger/Passport usage
- a reason to come back later

The first hour should not expose a complete future roadmap.

### Progression Timing Targets

These are design targets for simulation and playtesting. They are not runtime constants until an
implementation pass deliberately aligns code to them.

| Time | Expected State | New Mechanic | Primary Button | Bottleneck | Reward Feeling |
| --- | --- | --- | --- | --- | --- |
| 0:00 | Fresh shop has stock, 1 ready order, 1 Tofu Press, 1 Prep Counter | Simple Tofu Box | Fulfill Shop Order | none yet | immediate first action |
| 0:30 | First order result shows Tips/Reputation/XP and first story beat | Shop Order Complete | Return to Tofu Shop | need more Tips or next order | the shop woke up |
| 1:00 | Prep Counter progress is visible | ready/preparing order split | Wait for Prep Counter or Fulfill Shop Order | order prep | the shop works while parked |
| 2:00 | First purchase is close or available | Tidy Packaging / first station choice | Buy bottleneck-solving improvement | Tips | clear progress toward first upgrade |
| 3:00 | Player understands stock runway | Tofu Stock runway copy | Buy Tofu Press if stock is low; otherwise order throughput | stock or throughput | resources have different jobs |
| 5:00 | Multiple orders have been fulfilled | Family Tofu Tray close or unlocked | Fulfill larger order or improve Prep Counter | larger order requirements | extra stock has a purpose |
| 10:00 | First loop is proven | Passport teaser and first meaningful upgrade path | Buy Tidy Packaging / View Passport | Tips or order prep | first collection/status hook |
| 20:00 | Shop starts feeling larger | Delivery Shelf or Shop Sign preview | Buy Delivery Shelf / Buy Shop Sign | throughput or Reputation | the counter becomes a shop |
| 40:00 | First route/story teaser makes sense | Shop Street preview | Start Shop Street if unlocked | Reputation/Shop Reach | new fictional goal |
| 60:00 | Passive/automation preview appears | Regular Customers or Apprentice teaser | Buy support system if unlocked | manual chores | the shop can help itself |
| 2 hours | First automation path begins | Apprentice Driver / simple crew preview | Hire Apprentice Driver | repeated fictional tasks | chores can be delegated |
| 4 hours | License requirements become visible | Local Delivery License preview | View License Exam | plateau requirements | a reset choice is approaching |
| 6 hours | First License Exam should be reachable by engaged play | License Exam confirmation | Take License Exam if ready | final requirements | reset for permanent momentum |
| First License Exam | First prestige converts progress into License Stars | License Stars and Perks | Confirm License Exam / Buy License Perk | choosing a permanent perk | earned restart |
| Post-License rebuild | Early shop restarts faster | License Perk benefits | rebuild first loop | new higher plateau | familiar loop, less waiting |

First-day target:

- the player has seen the first order-size ladder
- the player has at least one reason to value Tofu Stock beyond stockpiling
- the player has a few stamps or clear stamp previews
- route/automation/prestige are visible only as earned goals, not as first-screen clutter
- the player can leave and return to meaningful capped offline progress

## 6. Full Progression Phase Map

| Phase | Time Target | Main Fantasy | Core Systems | Visible Tabs | Primary Resources | Primary Buttons | Upgrades | Unlocks | Expected Session Length | Exit Condition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. First Loop | 0 to 10 minutes | A small counter starts moving | Tofu Press, Prep Counter, Orders, first upgrade, first stamp | Overview, Orders, Production basics, maybe Passport teaser | Tofu Stock, Delivery Orders, Tips | Fulfill Shop Order, Buy Tidy Packaging, Buy Prep Counter, Buy Tofu Press when stock is low, Take Cup Test secondary | Tidy Packaging, Steady Pressing only when stock is low, early station counts | First Shop Order stamp | 1 to 5 minutes | Player understands stock -> orders -> Tips |
| 2. First Shop | 10 to 60 minutes | The counter becomes a shop | Delivery Shelf, Shop Sign, Passport, Ledger light | Overview, Orders, Production, Upgrades, Passport, Ledger | Tips, Reputation, Delivery Orders | Fulfill Max Orders, Buy Delivery Shelf, Buy Shop Sign, View Passport | Tidy Packaging, Double Labels, Better Boxes, Shop Sign | First route teaser, fuller Passport | 5 to 15 minutes | Reputation and shop systems need expansion |
| 3. First Automation | 1 to 6 hours | The shop starts helping itself | Regular Customers, Shop Street, Apprentice preview | Routes, simple Crew preview, Production, Passport | Tips, Reputation, Shop Reach, Route Knowledge | Start Shop Street, Hire Apprentice Driver, Assign Crew preview | Regular Smile, Delivery Shelf upgrades | First route stamp, first apprentice teaser | 10 to 20 minutes | Manual orders feel repetitive and automation is earned |
| 4. First License | 4 to 6 hours | A plateau becomes a choice | License Exam preview, requirements, first perks | License, Passport, Routes, Ledger | Reputation, Stamps, Route Knowledge, fulfilled orders | View License Exam, Take License Exam, Confirm/Cancel | Final pre-exam convenience upgrades | Local Delivery License | 10 to 30 minutes | Requirements met and player chooses prestige |
| 5. Post-License Rebuild | After first License Exam | The early shop rebuilds faster | License Perks, faster starting stations, deeper early flow | Overview, Orders, Production, License, Passport | License Stars, Tips, Tofu Stock, Orders | Buy License Perk, rebuild stations, Fulfill Max | Morning Prep, Labeled Bins, Bigger Thermos | Permanent perk identity | 5 to 15 minutes | Player reaches old plateau faster |
| 6. Route Network | Later | The fictional delivery world opens | More route cards, route mastery, Route Knowledge | Routes, Training, Garage, Passport | Shop Reach, Route Knowledge, Tips | Start Route Card, View Route Details, Buy Route Notebook | Route Familiarity, Careful Notes | District/route stamps | 10 to 30 minutes | Route mastery motivates automation |
| 7. Festival / Spirit Layer | Later | The shop has special rushes | Shop Spirit, Festival Boosts, token inventory | Shop Spirit, Events, Ledger | Shop Spirit, Festival tokens | Buy Tea Kettle, Use Shop Spirit Boost, Use Festival Token | Warmer Kettle, Festival Lanterns | Festival stamps/cosmetics | Short burst sessions | Boost timing becomes meaningful |
| 8. Regional Tofu Network | Late game | A local shop becomes a network | Regional Tofu Network, Dispatcher Desk, broader automation | Network, Crew, License, Routes | Tips, Reputation, Shop Reach, License Stars | Buy Dispatcher Desk, Buy Regional Network, Assign Crew | Network multipliers, crew routines | Late-game route/status rewards | Longer idle sessions | Next prestige or final arc |
| 9. Legendary Final Delivery | Future direction | Perfect control, not speed | Endgame story, final stamps, high-order mastery | Story/Finale surfaces | Stamps, License Stars, mastery summaries | Start Final Delivery Trial | Cosmetic/story-only final upgrades | Perfect control ending | Special event session | Story conclusion |

## 7. Button Progression Contract

Every visible button must be:

1. wired and functional
2. disabled with a clear reason
3. hidden until its system is ready

Fresh players should not see 20 active buttons. Buttons unfold by phase.

| id | label | surface | phase | visible when | enabled when | disabled reason | cost | effect | expected first use time | bottleneck solved | next best action text | status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| pack_tofu | Pack Tofu | Shop | First Loop | Shop visible | Parked; shop unlocked | Park first. | none | Adds small Tofu Stock | 0 to 2 minutes, backup only | Low Tofu Stock | Pack Tofu | Implemented |
| fulfill_shop_order | Fulfill Shop Order | Shop/Orders | First Loop | Delivery Orders visible | Ready Orders >= 1; parked | Need 1 prepared order. Prep Counter is preparing the next order. | 1 Delivery Order | Grants Tips, Reputation, XP; ledger/result feedback | 0:00 to 0:30 | Converts orders into purchase currency | Fulfill Shop Order | Implemented |
| fulfill_simple_tofu_box | Fulfill Simple Tofu Box | Orders | First Loop | Immediately | 6 Tofu Stock and 1 ready order | Need 1 prepared order or more Tofu Stock. | 6 Tofu Stock, 1 Delivery Order | +10 Tips, +1 Reputation, +8 XP | 0:00 to 0:30 | Tutorial money conversion and first stock-pressure lesson | Fulfill Shop Order | Implemented |
| fulfill_family_tofu_tray | Fulfill Family Tofu Tray | Orders | First Shop | 5 fulfilled orders or Shop Level 2 | 24 Tofu Stock and 1 ready order | Need Family unlock, ready order, or more Tofu Stock. | 24 Tofu Stock, 1 Delivery Order | +45 Tips, +3 Reputation, +24 XP | 5 to 10 minutes | Makes extra Tofu Stock valuable | Fulfill Family Tofu Tray | Implemented |
| fulfill_festival_bento | Fulfill Festival Bento | Orders | First Shop / later | 25 fulfilled orders or 50 Reputation | 75 Tofu Stock and 2 ready orders | Need Festival unlock, 2 ready orders, or more Tofu Stock. | 75 Tofu Stock, 2 Delivery Orders | +130 Tips, +8 Reputation, +70 XP | 20 to 40 minutes | First big payout | Fulfill Festival Bento | Implemented |
| fulfill_catering_crate | Fulfill Catering Crate | Orders | Later | Future mid-game | TBD | Hidden until later. | 50 Tofu Stock, 5 Delivery Orders target | +400 Tips, +20 Reputation, +180 XP target | Later | Mid-game stock sink | Fulfill Catering Crate | Future |
| fulfill_10_orders | Fulfill 10 Orders | Overview | First Shop | Ready Orders can exceed 10 | Ready Orders >= 10; parked | Need 10 ready Delivery Orders. | 10 Delivery Orders | Grants 10x order rewards inline | 10 to 20 minutes | Reduces repeated order clicks | Fulfill 10 Orders | Implemented, reveal timing pending |
| fulfill_max_simple_orders | Fulfill Max Simple Orders | Orders | First Loop / First Shop | Multiple Simple Tofu Boxes can be fulfilled and larger orders are not the best option | Enough Tofu Stock and ready orders for at least 2 Simple Tofu Boxes | Need more Tofu Stock or ready Delivery Orders. | max affordable Simple Tofu Boxes | Converts simple orders into Tips/Reputation/XP | 5 to 10 minutes | Avoids repeated tutorial-order clicks | Fulfill Max Simple Orders | Implemented |
| fulfill_max_best_order | Fulfill Max Best Order | Orders | First Shop | Larger order type is unlocked and affordable | Enough Tofu Stock and ready orders for at least 1 best order type | Need more Tofu Stock or ready Delivery Orders. | max affordable best order type | Converts stock/order stockpile into strongest available payout | 5 to 20 minutes | Makes extra stock useful | Fulfill Max `<Order Type>` | Implemented |
| fulfill_max_orders | Fulfill Max `<Order Type>` | Orders | First Shop | More than one selected/best order can be fulfilled | Enough Tofu Stock and ready orders for at least 2 of that type | Need more Tofu Stock or ready Delivery Orders. | max affordable typed orders | Converts all affordable typed orders into rewards | 5 to 10 minutes | Avoids click spam | Fulfill Max `<Order Type>` | Implemented |
| buy_tofu_press | Buy Tofu Press | Production | First Loop | Production basics visible | Enough Tips; Prep Slots available | Need more Tips. Fulfill shop orders to earn Tips. | Tips, station growth | Adds Tofu Stock/sec | 1 to 3 minutes if stock is low | Low Tofu Stock runway | Buy Tofu Press | Implemented |
| buy_max_tofu_press | Buy Max Tofu Press | Production | First Shop | Buy Tofu Press visible; multiplier relevant | Can afford at least 1 press | Need more Tips. | max affordable Tips/Prep Slots | Buys multiple presses | 10 to 20 minutes | Avoids repetitive station buying | Buy Max Tofu Press | Implemented |
| buy_prep_counter | Buy Prep Counter | Production | First Loop | Production basics visible | Enough Tips; Prep Slots available | Need more Tips or Prep Slots. Fulfill shop orders to earn Tips. | Tips plus Prep Slot | Adds Delivery Orders/sec and Tofu Stock consumption | 3 to 6 minutes when orders are slow | Order throughput | Buy Prep Counter | Implemented |
| buy_max_prep_counter | Buy Max Prep Counter | Production | First Shop | Buy Prep Counter visible; multiplier relevant | Can afford at least 1 counter | Need more Tips or Prep Slots. | max affordable Tips/Prep Slots | Buys multiple counters | 15 to 30 minutes | Avoids repetitive station buying | Buy Max Prep Counter | Implemented |
| buy_steady_pressing | Buy Steady Pressing | Upgrades | First Loop | Stock runway is low or extra Tofu Presses make stock growth relevant | Enough Tips | Need 20 Tips. Fulfill shop orders to earn Tips. | 20 Tips target | Tofu Press output x1.5 | 1 to 5 minutes when stock is low | Slow stock rebuild | Buy Steady Pressing | Implemented |
| buy_double_mold | Buy Double Mold | Upgrades | First Shop | Own 3 Tofu Presses | Enough Tips | Need 40 Tips. | 40 Tips target | Tofu Press output x2 | 5 to 10 minutes | First production plateau | Buy Double Mold | Implemented, target tuning pending |
| buy_tidy_packaging | Buy Tidy Packaging | Upgrades | First Loop | First order complete and Prep Counter/order throughput is the bottleneck | Enough Tips | Need 20 Tips. Fulfill prepared orders first. | 20 Tips target | Prep Counter output x1.5 | 1 to 3 minutes | Slow order prep | Buy Tidy Packaging | Implemented |
| buy_double_labels | Buy Double Labels | Upgrades | First Shop | Own 2 Prep Counters | Enough Tips | Need 120 Tips. | 120 Tips target | Prep Counter output x2 | 10 to 20 minutes | Order throughput plateau | Buy Double Labels | Implemented, target tuning pending |
| view_passport | View Passport | Passport | First Loop / First Shop | First stamp earned or teaser unlocked | Passport is discovered | Earn a stamp-worthy shop moment first. | none | Opens stamp/status collection | 5 to 10 minutes | Collection curiosity | View Passport | Partial |
| visit_tofu_shop | Visit Tofu Shop | Cup Test result | Cup-first discovery | Cup Test result screen shown and player is parked | Always | none | none | Returns to shop/dashboard | After a Cup Test result | Helps Cup-first players find the parked shop loop | Visit Tofu Shop | Implemented |
| take_cup_test | Take Don't Spill the Cup | Shop/Cup Test | Always secondary from shop | Always visible as optional boost path | Parked; setup/safety complete for start | Complete the safety checklist before starting. | none | Starts optional smooth-driving challenge | Any time | Certified boost/status path | Take the Cup Test | Implemented |
| buy_delivery_shelf | Buy Delivery Shelf | Production | First Shop | 10 fulfilled orders, First Family Tofu Tray, or upgrade/level milestone | Enough Tips/Prep Slots | Unlocks after the core order loop is established. | 90 Tips runtime V1; 800 Tips target later | Boosts Prep Counter throughput | 10 to 20 minutes | Scaling order flow | Buy Delivery Shelf | V1 implemented |
| buy_shop_sign | Buy Shop Sign | Production | First Shop | 10 Reputation, 100 lifetime Tips, or Delivery Shelf owned | Enough Tips | Need Reputation, Tips, or Delivery Shelf. | 140 Tips runtime V1; 300 Tips target later | Boosts Reputation gain from orders | 20 to 40 minutes | Reputation unlock pressure | Buy Shop Sign | V1 implemented |
| buy_better_boxes | Buy Better Boxes | Upgrades | First Shop | 15 fulfilled orders or Tip income plateau | Enough Tips | Unlocks after 15 fulfilled orders. | 200 Tips target | +25% Tips per order | 15 to 30 minutes | Tip income plateau | Buy Better Boxes | Partial |
| buy_regular_smile | Buy Regular Smile | Upgrades | First Automation | Regular Customers visible | Enough Tips | Unlocks after stable shop production. | 500 Tips target | small passive Tips/sec | 30 to 60 minutes | Manual order conversion chores | Buy Regular Smile | Future |
| start_shop_street | Start Shop Street | Routes | First Automation | First fictional route discovered | Enough Tofu Stock and Delivery Orders | Build Reputation or Shop Reach to unlock fictional route cards. | Tofu Stock and Delivery Orders | Grants Tips, Reputation, Route Knowledge, Shop Reach, route stamp chance | 40 to 90 minutes | New mid-game goal | Start Shop Street | Placeholder |
| hire_apprentice_driver | Hire Apprentice Driver | Crew | First Automation | First route progress exists | Enough Tips/Prep Slots | Unlocks after route progress. | Tips plus Prep Slot | Begins fictional automation path | 1 to 2 hours | Manual route/order chores | Hire Apprentice Driver | Placeholder |
| assign_crew | Assign Crew | Crew | First Automation | Crew member hired | Route/crew slot available | Hire crew first. | Delivery Orders or route slot | Assigns fictional automation | 1 to 2 hours | Repeated route handling | Assign Crew | Placeholder |
| buy_tea_kettle | Buy Tea Kettle | Shop Spirit | Festival / Spirit | Stable production; Spirit layer unlocked | Enough Tips/Prep Slots | Need Tips. | Tips plus Prep Slot | Generates Shop Spirit/sec | Later | Boost energy generation | Buy Tea Kettle | Placeholder |
| spend_shop_spirit | Spend Spirit | Shop Spirit | Festival / Spirit | Shop Spirit available and action matters | Enough Shop Spirit; parked | Need Spirit and current wallet amount. | Shop Spirit | Instant parked-only action such as tofu stock or ready orders | Later | Short active shop recovery | Spend X Spirit | Placeholder |
| start_spirit_effect | Start Effect | Shop Spirit | Festival / Spirit | Timed effect matters | Enough Shop Spirit; parked; effect not already active | Need Spirit, or effect already active. | Shop Spirit | Starts a timed shop-only effect with visible duration/remaining state | Later | Short active shop burst | Start Lunch Hour / Start Double Batch | Placeholder |
| use_spirit_token | Use Token | Shop Spirit | Festival / Spirit | Festival token exists and route/story context is relevant | Token ready; parked | Need token ready. | token | Consumes a parked-only token | Later | Event/token payoff | Use Token | Placeholder |
| view_ledger | View Ledger | Ledger | First Shop | meaningful events exist | Always | Complete a shop action first. | none | Opens capped local event history | 10 to 20 minutes | Explains what changed | View Ledger | Implemented |
| view_license_exam | View License Exam | License | First License | License requirements preview unlocked | Always | Keep growing the shop. | none | Shows requirements and reset preview | 2 to 4 hours preview | Long-term goal clarity | View License Exam | Placeholder |
| take_license_exam | Take License Exam | License | First License | Requirements met | Confirmation accepted | Requirements not met. | selected shop progress reset | Grants 1 to 3 License Stars | 4 to 6 hours | Plateau/reset decision | Take License Exam | Placeholder |
| buy_license_perk | Buy License Perk | License | Post-License | License Stars owned | Enough License Stars | Need License Stars. | License Stars | Buys permanent shop-only perk | After first exam | Faster rebuild/convenience | Buy License Perk | Placeholder |

## 8. Generator Progression

Display production per second. Runtime may tick on any reliable local interval, but player-facing
rates use `/sec`.

Cost formula:

```text
nextCost = baseCost * growthRate ^ owned
```

Production formula:

```text
productionPerSecond = baseProduction * owned * multipliers
```

| Generator / Station | Role | Visible Phase | Base Cost | Cost Growth | Produces | Consumes | Base Rate | Scaling Rule | Bottleneck Solved | When It Stops Being Urgent | Related Upgrades |
| --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- |
| Tofu Press | Makes Tofu Stock | First Loop, immediately | 15 Tips target after starter press | 1.15 | Tofu Stock | none | 0.10 stock/sec target; current runtime may differ | owned count * multipliers | Low Tofu Stock runway | When stock supports 10+ future orders | Steady Pressing, Double Mold |
| Prep Counter | Turns Tofu Stock into Delivery Orders | First Loop, immediately | 50 Tips target; current runtime may differ | 1.16 | Delivery Orders | 2 Tofu Stock/order | 0.025 orders/sec | owned count * multipliers, limited by stock | Slow order prep | When ready orders accumulate faster than player spends them | Tidy Packaging, Double Labels |
| Delivery Shelf | Supports order throughput/capacity | First Shop, 10 to 20 minutes | 800 Tips target | 1.17 | Prep Counter support or order capacity | Tips/Prep Slots | boost only | multiplicative support | Order flow scaling | When order throughput is no longer the limiter | Neat Handoff, Double Stack |
| Shop Sign | Reputation unlock engine | First Shop, 20 to 40 minutes | 300 Tips target | 1.18 | Reputation modifier or small passive reputation | Tips/Prep Slots | small reputation effect | multiplier or flat boost | Low Reputation | When next systems are no longer reputation-gated | Brighter Sign, Word of Mouth |
| Regular Customers | First passive Tips | First Automation, 30 to 60+ minutes | 500 Tips target | 1.20 | Tips/sec | Delivery Orders slowly, if available | small Tips/sec | owned count * loyalty multipliers | Too much manual order fulfillment | When passive Tips meet baseline costs | Loyalty Card, Bring a Friend, Regular Smile |
| Shop Street Route | First fictional route card | First Automation, 40 to 90 minutes | route cost, not station cost | 1.0 or route mastery curve | Tips, Reputation, Route Knowledge, Shop Reach, stamps | Tofu Stock and Delivery Orders | instant or timed route reward | mastery improves reward/stability | Need new goals after shop loop | When mastered and auto-eligible | Route Familiarity, Careful Notes |
| Apprentice Driver | First automation | First Automation, 1 to 2 hours | Tips plus Prep Slots | 1.25 | automated fictional route/order rewards | Delivery Orders, route slots | slow automation | crew count * assignment rules | Repeated manual chores | When Dispatcher handles routing | Better Clipboard, Team Routine |
| Dispatcher Desk | Automation management | Later, 2 to 4 hours | 900 Tips target | 1.26 | route assignment efficiency | Tips/Prep Slots | automation modifier | global automation multiplier | Too many manual assignments | When network automation dominates | Dispatcher Routine |
| Regional Tofu Network | Late-game scale | After first License Exam | 2400 Tips target or later | 1.32 | broad production multiplier | Tips/Prep Slots | global boost | broad multiplier | Late-game scaling | Never urgent early; hidden first session | Network Notes, Regional Counter |

### Generator / Station Detail Cards

These are design cards, not proof of runtime completeness. A station is a thing the player owns more
of. An upgrade is a named modifier that changes a station. UI should not use one label for both.

#### Tofu Press

- Stable id: `tofu_press`
- Label: `Tofu Press`
- Unlock condition: visible immediately; fresh shop starts with 1
- Starting cost: 15 Tips target for the first extra press
- Cost growth: 1.15 target
- Produces: Tofu Stock
- Consumes: none
- Base production rate: 0.10 Tofu Stock/sec target
- Milestone thresholds: owned 5, 10, 25, 50, 100
- Associated upgrades: Steady Pressing, Double Mold
- Urgent when: stock runway supports fewer than 3 simple orders or a larger order is unlocked but
  understocked
- Less urgent when: stock runway supports 10+ likely orders
- Expected first purchase: 1 to 3 minutes only if stock is actually the bottleneck
- Status: MVP / implemented, target balance still needs tuning

#### Prep Counter

- Stable id: `prep_counter`
- Label: `Prep Counter`
- Unlock condition: visible immediately; fresh shop starts with 1
- Starting cost: 50 Tips target for the first extra counter
- Cost growth: 1.16 target
- Produces: Delivery Orders
- Consumes: 2 Tofu Stock per simple prepared order target
- Base production rate: 0.025 Delivery Orders/sec target
- Milestone thresholds: owned 5, 10, 25, 50, 100
- Associated upgrades: Tidy Packaging, Double Labels
- Urgent when: stock runway is healthy and ready orders are scarce
- Less urgent when: ready orders pile up faster than the player can spend them
- Expected first purchase: 4 to 6 minutes
- Status: MVP / implemented, target balance still needs tuning

#### Delivery Shelf

- Stable id: `delivery_shelf`
- Label: `Delivery Shelf`
- Unlock condition: 10 to 20 minutes or when Prep Counter throughput/capacity is the visible
  bottleneck
- Starting cost: 800 Tips target
- Cost growth: 1.17 target
- Produces: no primary resource by itself; boosts order handling and Prep Counter support
- Consumes: Tips and possibly Prep Slots to buy
- Base production rate: support multiplier only
- Milestone thresholds: owned 5, 10, 25
- Associated upgrades: Neat Handoff, Double Stack
- Urgent when: multiple counters feel cramped or Fulfill Max becomes common
- Less urgent when: orders are already waiting unspent
- Expected first purchase: 30 to 60 minutes unless tuning moves it earlier
- V1 runtime behavior: unlocks after 10 fulfilled orders, First Family Tofu Tray, or an
  upgrade/level milestone; each shelf boosts Prep Counter order prep.
- Status: V1 implemented / needs balance tuning

#### Shop Sign

- Stable id: `shop_sign`
- Label: `Shop Sign`
- Unlock condition: Reputation starts gating a visible next system
- Starting cost: 300 Tips target
- Cost growth: 1.18 target
- Produces: Reputation modifier or small passive Reputation
- Consumes: Tips and possibly Prep Slots to buy
- Base production rate: each owned Shop Sign boosts Reputation from fulfilled orders by 10%;
  sign upgrades can add more Reputation multiplier later.
- Milestone thresholds: owned 5, 10, 25
- Associated upgrades: Brighter Sign, Word of Mouth
- Urgent when: next system is Reputation-gated
- Less urgent when: Reputation is ahead of unlock needs
- Expected first purchase: 20 to 40 minutes
- V1 runtime behavior: unlocks when Reputation reaches 10, lifetime Tips reaches 100, or Delivery
  Shelf is owned; it is a Reputation support station and does not reveal Routes by itself.
- Status: V1 implemented / needs balance tuning

#### Counter Service

- Stable id: `counter_service`
- Label: `Counter Service`
- Unlock condition: First 10 Orders / 10 manually fulfilled shop orders
- Starting cost: none in V1
- Cost growth: none in V1
- Produces: automatic fulfilled-order rewards while the page is open
- Consumes: ready Delivery Orders and the Tofu Stock required by the selected order type
- Base production rate: 1 handoff / 10 seconds
- Priority: Best Available, ordered Festival Bento -> Family Tofu Tray -> Simple Tofu Box
- Milestone thresholds: Order Bell after unlock, Wider Counter after Order Bell and 20 fulfilled
  orders, Pickup Routine after Wider Counter and First Family Tofu Tray
- Associated upgrades: Order Bell, Wider Counter, Pickup Routine; future bulk handoff, stock
  reserve, and priority tuning remain documented only
- Urgent when: prepared-order fulfillment becomes repetitive after the player has learned the loop
- Less urgent when: the player still needs manual order choices to understand stock/order costs
- Expected first use: after First 10 Orders
- V1 runtime behavior: starts paused, can be started/paused from Overview, runs only while parked and
  the page is open, shows income or blocked-state copy, and never auto-fulfills offline
- Status: V1 implemented / needs playtest tuning

#### Regular Customers

- Stable id: `regular_customer`
- Label: `Regular Customers`
- Unlock condition: stable order production and Shop Sign progress after the manual loop becomes
  repetitive
- Starting cost: 500 Tips target
- Cost growth: 1.20 target
- Produces: passive Tips
- Consumes: Delivery Orders slowly when available
- Base production rate: small Tips/sec target, limited by orders
- Milestone thresholds: owned 5, 10, 25, 50
- Associated upgrades: Loyalty Card, Bring a Friend, Regular Smile
- Urgent when: manual order fulfillment becomes chore-like
- Less urgent when: the player needs active choices more than passive income
- Expected first purchase: 30 to 60+ minutes
- Status: Deferred / future automation slice

#### Shop Street Route

- Stable id: `shop_street_route`
- Label: `Shop Street`
- Unlock condition: first fictional route reveal after Reputation/Shop Reach setup
- Starting cost: small Tofu Stock and Delivery Orders route-card cost
- Cost growth: mastery/cooldown curve rather than station growth
- Produces: Tips, Reputation, Route Knowledge, Shop Reach, stamp chance
- Consumes: Tofu Stock and Delivery Orders
- Base production rate: instant or short timed result; not a real road action
- Milestone thresholds: route completions/mastery levels
- Associated upgrades: Route Notebook, Careful Notes
- Urgent when: the shop loop needs a new story goal
- Less urgent when: the player still needs first-loop clarity
- Expected first use: 40 to 90 minutes
- Status: Later / placeholder

#### Apprentice Driver

- Stable id: `apprentice_driver`
- Label: `Apprentice Driver`
- Unlock condition: first route progress and repeated fictional tasks
- Starting cost: Tips plus Prep Slots target
- Cost growth: 1.25 target
- Produces: automated fictional route/shop rewards
- Consumes: Delivery Orders and route slots
- Base production rate: deliberately slow until Dispatcher Desk exists
- Milestone thresholds: hired 1, 3, 5, 10
- Associated upgrades: Better Clipboard, Team Routine
- Urgent when: repeated route/order chores are understood
- Less urgent when: the player has not manually learned the route loop
- Expected first use: 1 to 2 hours
- Status: Later / placeholder

#### Dispatcher Desk

- Stable id: `dispatcher_desk`
- Label: `Dispatcher Desk`
- Unlock condition: at least one crew member and repeated assignments
- Starting cost: 900 Tips target
- Cost growth: 1.26 target
- Produces: automation efficiency
- Consumes: Tips and Prep Slots
- Base production rate: assignment multiplier only
- Milestone thresholds: owned 1, 3, 5, 10
- Associated upgrades: Better Clipboard, Team Routine
- Urgent when: crew assignment itself becomes friction
- Less urgent when: only one crew task exists
- Expected first use: 2 to 4 hours
- Status: Future / placeholder

#### Regional Tofu Network

- Stable id: `regional_tofu_network`
- Label: `Regional Tofu Network`
- Unlock condition: after first License Exam or late route-network plateau
- Starting cost: 2400 Tips target or a later prestige-scale cost
- Cost growth: 1.32 target
- Produces: broad lower-tier multipliers and late-game requirements
- Consumes: Tips, Shop Reach, possibly License-gated resources
- Base production rate: broad multiplier, not a raw resource drip
- Milestone thresholds: owned 1, 3, 5, 10
- Associated upgrades: Network Notes, Regional Counter
- Urgent when: post-License rebuild needs a higher-order goal
- Less urgent when: the first loop and first route are still being learned
- Expected first use: after first License Exam
- Status: Future

## 9. Upgrade Ladder

Upgrade cards improve stations or shop behavior. They are not extra station counts. Label upgrade
levels with the upgrade name, not the generator name.

Stacking target:

- station count increases base production
- named upgrades multiply or add to station-specific output
- milestone boosts multiply station output at owned thresholds
- License Perks modify shop rebuild/convenience
- no upgrade affects real-world Cup Test scoring or qualification

| Order | Upgrade | Unlock Condition | Cost | Effect | Expected Time To Buy | Why Player Wants It | Bottleneck Solved | Max Level | Stacking Rule | Status |
| ---: | --- | --- | ---: | --- | --- | --- | --- | ---: | --- | --- |
| 1 | Tidy Packaging | First order complete and order prep bottleneck visible | 20 Tips | Prep Counter output x1.5 | 1 to 3 minutes | More orders without waiting | Slow Delivery Order growth | TBD | multiplicative station modifier | Implemented |
| 2 | Steady Pressing | Stock runway is low or extra Tofu Presses make stock growth relevant | 20 Tips | Tofu Press output x1.5 | 1 to 5 minutes when stock is low | First visible stock/sec bump | Slow Tofu Stock growth | TBD | multiplicative station modifier | Implemented |
| 3 | Double Mold | Own 3 Tofu Presses | 40 Tips | Tofu Press output x2 | 3 to 8 minutes | Big stock runway break | First stock plateau | TBD | multiplicative station modifier | Implemented, target tuning pending |
| 4 | Double Labels | Own 2 Prep Counters | 120 Tips | Prep Counter output x2 | 10 to 20 minutes | Throughput jump | Order prep plateau | TBD | multiplicative station modifier | Implemented, target tuning pending |
| 5 | Better Boxes | 15 orders fulfilled | 200 Tips | +25% Tips per order | 15 to 30 minutes | Orders pay better | Tip income plateau | TBD | multiplicative order reward | Partial, keep hidden until relevant |
| 6 | Shop Sign | 10 Reputation | 300 Tips | +50% Reputation per order or unlock support | 20 to 40 minutes | Opens route path | Reputation gate | TBD | reputation multiplier | Partial |
| 7 | Regular Smile | Shop Level 2 and stable orders | 500 Tips | small passive Tips/sec | 30 to 60 minutes | First passive income | Too much manual money conversion | TBD | passive Tips multiplier | Future |
| 8 | Delivery Shelf | 25 orders fulfilled | 800 Tips | Prep Counter support/capacity | 30 to 60 minutes | Smoother order scaling | Order throughput/capacity | TBD | support multiplier | Partial |
| 9 | Route Notebook | First fictional route discovered | 1000 Tips | improves fictional route reports/mastery | First automation phase | Routes feel more learnable | Route Knowledge | TBD | route-only modifier | Future |
| 10 | Better Clipboard | First crew hired | 1500 Tips | improves crew assignment efficiency | First automation phase | Automation becomes legible | Manual assignment friction | TBD | crew-only modifier | Future |
| 11 | Warmer Kettle | Shop Spirit unlocked | 2000 Tips | Shop Spirit/sec increase | Spirit phase | More parked boosts | Shop Spirit scarcity | TBD | spirit generator modifier | Future |

Use shop-safe language. Avoid names implying real driving advantage, speed, racing, high-G,
drifting, aggressive driving, or public-road competition.

## Soft Caps And Plateau Rules

Progression should slow at intentional moments, but the next improvement should remain visible.
Avoid punitive walls. The player should feel `I can see what fixes this`.

| Plateau | What Slows Down | Breakthrough | Target Wait | Next Visible Goal |
| --- | --- | --- | --- | --- |
| After first few simple orders | Tips arrive one order at a time | Steady Pressing or first station purchase | under 2 minutes | first rate bump |
| Before larger order types | Stock feels like a buffer, not a decision | Family Tofu Tray unlock | 5 to 10 minutes | use extra stock for better payout |
| Before first big payout | Simple/family orders feel routine | Festival Bento unlock | 20 to 40 minutes | save stock/orders for a large order |
| Before first route | Pure shop production starts to repeat | Shop Sign / Shop Street reveal | 40 to 90 minutes | convert shop progress into fictional route story |
| Before automation | Manual route/order handling becomes chore-like | Regular Customers / Apprentice Driver | 1 to 2 hours | delegate repeated fictional tasks |
| Before License Exam | Upgrades slow and next costs stretch | Local Delivery License requirements | 4 to 6 hours total | reset for permanent License Stars |

Soft-cap principles:

- never use real driving as the required breakthrough for normal shop progression
- use named upgrades and new order types to break early plateaus
- use fictional routes and automation to break mid-game plateaus
- use License Exams only after the player has clearly plateaued
- make the bottleneck explicit before showing the solution

## Milestone Boosts

Milestones make repeated station purchases feel meaningful without requiring constant new systems.
Station Milestone Boosts V1 is implemented in Production/station cards and as a fallback Next
Milestone target after the core story/support milestones. Boosts are total multipliers, not
cumulative threshold stacking.

| Milestone | Example Flavor | Effect Target | Visibility |
| --- | --- | --- | --- |
| 5 Tofu Presses | The press rhythm settles in. | Tofu Press output x1.5 total | Production card, inline feedback once |
| 10 Tofu Presses | The molds line up neatly. | Tofu Press output x2 total | Production card, inline feedback once |
| 5 Prep Counters | Labels and boxes are staged. | Prep Counter output x1.5 total | Production card, inline feedback once |
| 10 Prep Counters | The counter line moves smoothly. | Prep Counter output x2 total | Production card, inline feedback once |
| 5 Delivery Shelves | The shelf routine settles. | Delivery Shelf support x1.25 total | only after Delivery Shelf is visible/owned |
| 10 Delivery Shelves | The handoff line is smooth. | Delivery Shelf support x1.5 total | only after Delivery Shelf is visible/owned |
| 5 Shop Signs | Regulars start noticing. | Reputation gain x1.25 total | only after Shop Sign is visible/owned |
| 10 Shop Signs | The storefront is known. | Reputation gain x1.5 total | only after Shop Sign is visible/owned |
| 25+ station counts | TBD future threshold | documented only | later |
| 25 fulfilled orders | The lunch crowd notices. | Festival Bento teaser or Better Boxes unlock | first-shop phase |
| 50 fulfilled orders | Regulars know the counter. | Regular Customers / License requirement progress | first automation phase |
| 5 Passport Stamps | The shop has a story. | Local Delivery License requirement | License preview |

Milestone rules:

- milestones are shop-only and must not affect Cup Test score or qualification
- milestone copy should be cozy and concrete
- early milestones should be few and legible
- milestone boosts reward ownership thresholds and idle-first planning, not clicking speed
- V1 milestone boosts are total multipliers; 10 Tofu Presses means x2 total, not x1.5 * x2
- future higher thresholds remain documented only until pacing supports them

## 10. Bottleneck Rules

The recommendation engine should produce one dominant Next Best Action. Don't Spill the Cup can be
visible as an optional certified boost, but it should not override the normal shop loop.

| State | Current Bottleneck | Next Best Action | Secondary Action | What Not To Recommend |
| --- | --- | --- | --- | --- |
| Ready Orders >= 1 and Tips are low | Need Tips | Fulfill Shop Order or Fulfill Max Orders | Take Cup Test as optional boost | Buy Tofu Press as primary |
| Ready Orders >= 2 | Convert work to Tips | Fulfill Max Orders | View Orders | Manual single-order spam |
| No ready orders, order prep in progress | Preparing Delivery Order | Wait for Prep Counter | Pack Tofu only if stock is low | Certified boost as bottleneck |
| High Tofu Stock, slow order prep | Prep Counter throughput | Buy Prep Counter or Buy Tidy Packaging if affordable; otherwise wait for Prep Counter | Tofu Press available with `not urgent` copy | Buy Tofu Press as dominant action |
| Low Tofu Stock runway | Low Tofu Stock | Pack Tofu or Buy Tofu Press | Wait for Prep Counter if already running | Buy Prep Counter if it will starve immediately |
| Upgrade affordable and current bottleneck matches it | Upgrade available | Buy the bottleneck-solving upgrade | Fulfill orders if ready | Generic upgrade if it solves the wrong bottleneck |
| Next unlock close | Unlock pressure | Show the requirement and direct action | Continue orders/routes | Reveal full future system list |
| Offline return with many orders | Convert offline progress | Fulfill Max Orders | Review Ledger | Cup Test as primary |
| Cup Test available but shop loop has work | Optional certified boost | Continue shop loop | Take Don't Spill the Cup as secondary | `Certified boost available` as current bottleneck |
| License Exam close | Prestige requirements | View License Exam requirements | Continue missing requirement | Take License Exam if requirements are not met |

Disabled copy should be specific:

- `Need 20 more Tips. Fulfill shop orders to earn Tips.`
- `Need 1 prepared order. Prep Counter is preparing the next order.`
- `Need more Tofu Stock. Pack tofu or buy Tofu Press.`
- `Need 1 Prep Slot. Prep Slots recover over time.`

## 11. Progressive Reveal Rules

First-time users should not see every system. Each system should move through three states:

1. hidden
2. newly discovered/teaser
3. active panel/card

| Reveal Moment | Visible | Teaser-Locked | Hidden |
| --- | --- | --- | --- |
| Immediately | Tofu Stock, Delivery Orders, Tips, Reputation/XP, Fulfill Shop Order, Tofu Press, Prep Counter, Take Cup Test secondary | Buy Tofu Press if unaffordable; simple upgrade hint only if useful | Routes, Crew, Garage, Spirit, Rivals, License, deep Passport, character/sound economy |
| After first order | Shop Order Complete result, Tips source, First Shop Order Stamp Fanfare, Upgrades Discovery Fanfare when a meaningful upgrade appears, relevant Tidy Packaging card if Prep Counter is the bottleneck | Passport preview | Routes, Crew, Garage, Spirit, Rivals, License |
| After first upgrade | clearer Production/Upgrade cards with before/after rate previews | Steady Pressing only when stock is the bottleneck | Full route network, Crew, Spirit, Rivals, License |
| After first stamp | Passport card/panel with first stamp details | Next stamp hint | Large stamp catalog |
| After 10 minutes | Delivery Shelf/Shop Sign path | Route teaser | Crew, Garage, Spirit, Rivals, License action |
| After 1 hour | first fictional route or route preview, light Ledger | Crew preview, License preview | Deep Garage, Spirit economy, Rival Challenges |
| After first route | Route mastery, Route Knowledge, Shop Reach | Apprentice Driver preview, Garage flavor | Full automation and Rivals |
| After first License Exam | License Perks and faster rebuild | deeper routes, Spirit, network | Legendary final arc |

Early UI rule:

- Overview is the first-loop play surface. It should show Current Bottleneck, Next Best Action,
  Ready Orders, Prep Counter progress, one best available order card, one relevant next
  station/upgrade card, and optional Cup Test as a secondary card.
- The separate Orders tab is removed from player-facing tabs because Overview owns the order UX.
  Normal shop-order fulfillment should update resources inline with a compact result chip/toast.
- Production is the station-buying/detail panel and should not simply duplicate Overview.
- Production owns station controls. Upgrades owns upgrade controls. Passport, Ledger, Settings, and
  any future order-detail surface must not append Generators/Stations or Upgrades sections from
  another panel.
- Do not show full locked sublists.
- Do not show a visible roadmap of every future unlock.
- Do not make settings/debug/QA prominent.
- Do not show Delivery Crew, character selection, or sound selection inside the main early shop
  overview.
- Do not reveal broad systems from raw idle accumulation alone. A tab should appear because of a
  related milestone, bottleneck, purchased upgrade/station, discovered stamp, or story beat.
- Offline progress may create resources and a welcome-back summary, but it should not reveal Routes,
  Garage, Shop Spirit, Rivals, License, or full Passport/Ledger panels by itself.
- The first Passport stamp should trigger a Stamp Fanfare / Stamp Celebration. The fanfare shows
  the stamp name and order rewards, suppresses repeats through local seen-fanfare state, respects
  reduced motion and muted audio, and never appears during active driving.
- The first meaningful hidden shop system should trigger a Discovery Fanfare / New System Revealed
  moment. Upgrades are the preferred first reveal when Tidy Packaging, Steady Pressing, or another
  bottleneck-solving upgrade becomes visible. Future systems should use the same pattern only after
  milestone-based discovery, not raw idle currency accumulation.
- Newly revealed tabs should show an explicit `New` badge or equivalent text. Do not rely on an
  unexplained outline or glow. The badge should clear once the player views the tab, including when
  the Discovery Fanfare action opens it.
- A covered-car teaser may appear once after an early meaningful milestone such as First Upgrade
  Purchased. It should say only that an old car waits behind the shop and should not create a Dream
  Garage tab, part catalog, event loop, Builder Stars, Dream Jar, or Project Car Value.

### Reveal Rules By System

| System | Hidden | Teaser | Active |
| --- | --- | --- | --- |
| Orders | never hidden in shop | none | immediately, with Simple Tofu Box |
| Production | never hidden in shop | advanced station hints only when close | immediately for Tofu Press and Prep Counter |
| Upgrades | before first meaningful upgrade appears | Discovery Fanfare when a bottleneck-solving upgrade becomes visible | after first upgrade path is understood |
| Passport | before first stamp-worthy action | after first order/result as compact teaser | after multiple stamps or when collection matters |
| Ledger | before meaningful history exists | after several events or meaningful offline return | after history helps explain what changed |
| Routes | first 10 minutes | after Reputation/Shop Sign begins to matter | after a route story beat or route-ready station milestone |
| Crew | first hour | after first route progress or repeated chores | after the first automation slice |
| Garage | first hour | after route cards need fictional stability/flavor | after route loop exists |
| Dream Garage | first shop loop | after First Upgrade Purchased, First 100 Tips, or Shop Level 2 as covered-car story teaser | future only, after first-loop and first-shop pacing are tuned |
| Shop Spirit | first hour and first route phase | after stable production or event/festival hook | after boost economy has a real sink/source |
| Rivals | early and mid first-loop play | after route network/festival systems exist | later, as friendly parked challenges |
| License | first hour | when requirements become plausible | at plateau near 4 to 6 hours |
| Delivery Crew/Collection | first shop overview | once character/sound unlock exists | dedicated `#/crew` surface, not main shop clutter |
| Settings | not hidden | small nav/tab only | Settings tab with Progress Tools; dev tools hidden unless dev mode |

## 12. Prestige / License Exams

Prestige is themed as License Exams.

First License Exam:

```text
Local Delivery License
```

Timing target:

- not in the first hour
- target 4 to 6 hours total shop time
- or 2 to 3 casual sessions

Requirements:

- Shop Level 5
- 50 fulfilled shop orders
- 5 Passport Stamps
- 1 fictional route discovered
- 1 route partially mastered
- no real-world driving requirement

Rewards:

- 1 License Star minimum
- 2 License Stars if overprepared
- 3 License Stars for a strong first run
- permanent shop-only perks
- faster early rebuild

What resets:

- Tips
- Tofu Stock
- Delivery Orders
- most station counts
- most shop generators
- Shop Reach
- Route Knowledge
- Shop Spirit
- route progress for the current run, unless a perk says otherwise

What persists:

- License Stars
- purchased License Perks
- Passport Stamps
- lifetime stats
- collection unlocks
- safe summarized certified delivery history
- cosmetic/status unlocks

Player feeling:

- `I understand the shop now. Resetting will make the next run smoother.`
- It should feel like a choice at a plateau, not a required punishment.

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

### First License Perk Shop

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

## 13. Don't Spill The Cup Integration

Don't Spill the Cup is optional for Tofu Shop progression.

Rules:

- never required for ordinary shop progression
- never speed-based
- no route leaderboards
- no public road competition
- no `beat the clock`
- no high-G bragging
- no real GPS route data for shop progression
- no maps, route traces, street names, coordinates, or exact distance by default
- Basic Mode does not request location
- Qualified Run requests location only after opt-in/start
- Cup Test should not become the normal shop bottleneck recommendation

Practice Mode:

- modest local XP/skill XP
- small local shop reward only if valid
- no certified merch progress
- no Perfect Pour
- no trusted certified proof

Qualified smooth result:

- optional certified boost
- bonus Tips
- bonus Reputation
- bonus XP
- possible certified stamps
- possible certified merch progress
- result/report flavor

Boost magnitude should depend on Cargo Condition, qualification status, daily caps, and safe
summarized criteria. It must not improve with speed, exact distance, route risk, street names, maps,
or high-G events.

Simulator/dev results:

- local QA only
- labeled simulated/dev
- not trusted certified proof
- must be rejected or ignored by any future backend merch verification

## 14. Dream Garage / Project Car Progression

Dream Garage is a future long-term progression layer. It should not replace the Tofu Shop loop.

Core fantasy:

```text
Tofu Shop funds the dream car.
The shop is the grind.
The garage is the dream.
The Cup Test proves that smooth control matters more than speed.
```

Future loop:

```text
Work shop orders -> earn Tips -> reinvest in shop or save for parts -> build the project car ->
enter fictional closed-course events -> earn prizes/status -> complete or sell the build -> start
the next dream car stronger
```

### Role In The Economy

- Tofu Shop remains the base money engine.
- Tips are earned from shop orders and later fictional events.
- Tips can be reinvested into shop production or saved/spent toward project car parts.
- This creates the key choice: buy more shop production now, or save for the dream car.
- Dream Garage should not appear before the player understands the shop loop.

Suggested reveal:

- teaser after First 100 Tips or Shop Level 2
- full Dream Garage after 10 fulfilled orders or first larger order type
- first part purchase after stable Tip income exists

Example decision points:

- Buy Prep Counter now, or save for Basic Tires?
- Improve larger-order throughput, or save for Paint Touch-Up?
- Reinvest event prize money into the shop, or buy Stage 2 cooling?

### Dream Jar / Garage Fund Decision

Recommended first design:

- Do not add a confusing new currency at first.
- Tips remain the actual spend currency.
- `Dream Jar` is a goal/progress meter showing Tips saved toward the next car part.
- Later, the game may add `Builder Reputation` or `Builder Stars`, but not as early spend
  currencies.

Open question:

- Should the garage spend Tips directly, or should Tips be allocated into a Dream Jar / Garage Fund?

### Project Car Stages

| Stage | Name | Fantasy | Unlock | Main Costs | Main Rewards | Exit Condition |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | The Covered Car / Beater | There is an old car under a cover behind the shop. | First 100 Tips, Shop Level 2, or first larger order type | small Tips, basic restoration parts | emotional reveal, Reliability, first build report | car starts and basic reliability is restored |
| 1 | Daily Driver Build | The car becomes reliable, personal, and fun. | Stage 0 complete | Tips, common parts, style parts | Build Score, Style, first closed-course event access | core reliability/style parts installed |
| 2 | Track-Day / Closed-Course Build | The car is ready for fictional organized events. | Stage 1 basics and first event report | higher Tips, cooling/brake/suspension parts | Event Readiness, better prizes, rare part chance | major midgame event cleared |
| 3 | Dream Build | The dream car becomes serious and expensive. | Stage 2 event progress and high Build Score | large Tips, rare parts, showcase parts | Project Car Value, Builder Reputation, completion/sale option | major invitational cleared or value target reached |

Stage 0 possible upgrades:

- Pull Off the Cover
- Wash the Car
- Replace Battery
- Change Fluids
- Basic Tires
- Basic Brake Pads
- Alignment
- Fix Rust Spot
- Clean Interior
- New Cup Holder
- Cargo Mat
- Tool Set
- Garage Lights

Stage 1 possible upgrades:

- Intake
- Cat-Back Exhaust
- ECU Tune
- Better Tires
- Brake Refresh
- Suspension Refresh
- Lightweight Wheels
- Short Shifter
- Better Seats
- Basic Weight Reduction
- Tofu Delivery Decal
- Fresh Paint Touch-Up

Stage 2 possible upgrades:

- Performance Radiator
- Oil Cooler
- Intercooler
- Header / Downpipe
- Clutch
- Limited-Slip Differential
- Coilovers
- Big Brake Kit
- Chassis Bracing
- Aero Lip
- Spoiler
- Better Gearing
- Weight Reduction Stage 2
- Harness Bar as fictional/event-only flavor

Stage 3 possible upgrades:

- Turbo Kit
- Supercharger Kit
- Built Engine
- Fuel Injectors
- Fuel Pump
- Standalone ECU
- Event Transmission
- Widebody Kit
- Full Aero
- Weight Reduction Stage 3
- Engine Swap
- Event Interior
- Dream Paint
- Signature Livery
- Sponsor Decals

These are fictional game upgrade categories, not real-world mechanical advice. They must not imply
real-world vehicle changes improve Cup Test scoring, qualification, or safety.

### Upgrade Categories

| Category | Examples | Game Purpose | Affects | Safety Note |
| --- | --- | --- | --- | --- |
| Reliability / Maintenance | battery, fluids, rust spot, tool set | make the car start and finish fictional events | Reliability, Event Readiness | fictional maintenance progression only |
| Tires / Wheels | basic tires, better tires, lightweight wheels | early readiness and style | Reliability, Build Score, Style | no real-world tire advice |
| Brakes | basic pads, brake refresh, big brake kit | closed-course event readiness | Reliability, Event Readiness | does not affect Cup Test score |
| Suspension | suspension refresh, coilovers, alignment | build identity and event readiness | Build Score, Event Readiness, Style | fictional closed-course context |
| Drivetrain | clutch, limited-slip differential, gearing | mid-stage build depth | Build Score, Event Readiness | no real-road instruction |
| Cooling | radiator, oil cooler, intercooler | reliability for longer fictional events | Reliability, Event Readiness | game stat only |
| Intake / Exhaust | intake, cat-back exhaust, header/downpipe | stage identity and Build Score | Build Score, Style | no emissions/legal advice |
| Engine | built engine, engine swap | late build fantasy | Build Score, Project Car Value | fictional category |
| Forced Induction | turbo kit, supercharger kit | expensive dream-build spike | Build Score, Project Car Value | not real tuning advice |
| Fuel System | injectors, fuel pump | supports late build stages | Reliability, Build Score | fictional category |
| ECU / Tuning | ECU tune, standalone ECU | unlocks advanced build synergy | Build Score, Event Readiness | does not affect Cup Test |
| Transmission | short shifter, event transmission | build feel and readiness | Build Score, Event Readiness | fictional/event-only language |
| Weight Reduction | stage 1, 2, 3 | build specialization | Build Score, Event Readiness | no unsafe public-road framing |
| Chassis / Aero | chassis bracing, aero lip, spoiler, full aero | event/showcase identity | Event Readiness, Style | closed-course/showcase only |
| Interior | seats, clean interior, cup holder, event interior | comfort, style, build story | Style, Reliability, Event Readiness | cosmetic/game stats only |
| Style / Cosmetic | paint touch-up, dream paint, livery, decals | expression and sponsor/showcase progress | Style, Sponsor Reputation | no performance claims |
| Garage Tools | tool set, garage lights | convenience and part installation fantasy | Reliability, install pacing | parked-only progression |
| Sponsor / Showcase | sponsor decals, showcase prep | prize and status path | Prize Bonus, Sponsor Reputation | no public-road competition |

### Suggested Garage Stats

Recommended first stats:

- Build Score
- Reliability
- Style
- Event Readiness
- Builder Reputation
- Project Car Value

Stage focus:

- Stage 0 focuses on Reliability.
- Stage 1 adds Style and Build Score.
- Stage 2 adds Event Readiness.
- Stage 3 adds Project Car Value and prestige potential.

Avoid too many early garage resources. The first garage UI should be a project, not a spreadsheet.

### Fictional Closed-Course Events

Closed-course events are parked/asynchronous game actions:

- the player sends the project car to a fictional event
- no real driving is required
- no speed, GPS, maps, street names, route traces, coordinates, exact distance, or high-G data is
  used
- results are based on Build Score, Reliability, Event Readiness, Style, and possibly shop
  Reputation
- events produce reports, prizes, rare parts, stamps, and Builder Reputation

| Event | Unlock | Requires | Rewards | Purpose |
| --- | --- | --- | --- | --- |
| Parking Lot Shakedown | Stage 0 complete | car starts, basic tires | small Tips, Garage XP, first garage report | first event |
| Tofu Cup Beginner | Stage 1 basics | tires, brakes, reliability | prize Tips, Reputation, stamp | first meaningful prize |
| Sponsor Showcase | style/decal progress | paint, decal, Style score | sponsor bonus, style stamp | cosmetics matter |
| Festival Track Day | Stage 2 | cooling, brakes, suspension | prize Tips, rare part chance | midgame event |
| Night Garage Trial | Stage 2 | reliability and Event Readiness | special report, story stamp | atmosphere |
| Dream Build Invitational | Stage 3 | high Build Score | huge prize, Builder Reputation, prestige option | endgame build event |

Use event language such as Showcase, Trial, Track Day, Invitational, and Closed-Course Event. Avoid
public-road competition or speed-optimization wording.

### Project Car Completion / Sale Prestige

Once the car reaches enough Project Car Value or clears a major event, the player can choose to keep
and showcase it or complete/sell the build.

Preferred prestige currency:

```text
Builder Stars
```

Reason: `Builder Stars` is short, positive, and clearly tied to car-build mastery. It stays separate
from `License Stars`, which are shop/license prestige.

Possible permanent perks:

- cheaper first parts
- extra starting Tips in Dream Jar
- faster part delivery
- better event prize money
- extra garage slot
- sponsor contact
- improved first Stage 0 reliability
- permanent cosmetic title
- future builds start with Garage Lights or Tool Set

Relationship to License Stars:

- License Stars are shop/license prestige.
- Builder Stars are car-build prestige, if implemented.
- Keep them separate unless playtesting proves a unified prestige model is simpler.

### Dream Garage Timing Targets

These are design targets, not runtime constants.

| Time | Garage Beat |
| --- | --- |
| 0 to 10 minutes | garage hidden; focus on shop loop |
| 10 to 30 minutes | subtle teaser: covered car behind shop |
| 30 to 60 minutes | Dream Garage unlock or first look |
| 1 to 2 hours | Stage 0 restoration parts |
| 2 to 6 hours | Stage 1 daily build and first event |
| 6 to 12 hours | Stage 2 closed-course build |
| 12 to 24+ hours | Stage 3 dream build |
| after major event | sell/complete build prestige option |

### Dream Garage Button Inventory

| Button ID | Label | Visible When | Enabled When | Cost | Effect | Disabled Reason | Expected First Use | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| view_dream_garage | View Dream Garage | teaser or garage unlock exists | always when visible | none | opens garage surface/panel | Unlocks after the shop has stable income. | 30 to 60 minutes | Documented only |
| pull_off_cover | Pull Off the Cover | Stage 0 starts | enough Tips or Dream Jar progress | small Tips target | reveals project car | Save a few more Tips from shop orders. | 30 to 60 minutes | Future |
| deposit_dream_jar | Deposit Tips to Dream Jar | Dream Jar design chosen | Tips > 0 | selected Tips | earmarks progress toward next part | Earn Tips from shop orders first. | 30 to 60 minutes | Future / open question |
| buy_part | Buy Part | part is visible | enough Tips or Dream Jar funds | part cost | adds part to inventory/build sheet | Need more Tips. Work shop orders or events. | 1 to 2 hours | Future |
| install_part | Install Part | owned part not installed | garage is available | none or install time | updates build stats | Buy the part first. | 1 to 2 hours | Future |
| buy_next_part | Buy Next Recommended Part | recommendations exist | enough Tips/funds | part cost | buys the bottleneck-solving part | Need more Tips for the recommended part. | 1 to 2 hours | Future |
| view_build_sheet | View Build Sheet | garage active | always | none | shows parts, stats, stage, next recommendation | Unlock Dream Garage first. | 1 to 2 hours | Future |
| enter_shakedown | Enter Parking Lot Shakedown | Stage 0 complete | basic readiness met | event entry cost target | creates first event report/prize | Finish basic restoration first. | 1 to 2 hours | Future |
| enter_tofu_cup_beginner | Enter Tofu Cup Beginner | Stage 1 basics | tires, brakes, reliability target | event entry cost target | prize Tips, Reputation, stamp | Build basic reliability first. | 2 to 6 hours | Future |
| enter_sponsor_showcase | Enter Sponsor Showcase | style path visible | style/decal score target | event entry cost target | sponsor bonus/style stamp | Add style parts first. | 2 to 6 hours | Future |
| claim_event_report | Claim Event Report | event result ready | always | none | applies prizes/report/stamps | Event still in progress. | after first event | Future |
| showcase_car | Showcase Car | garage active and car has style | always | none | cosmetic/status summary | Build or style the car first. | after Stage 1 | Future |
| sell_completed_build | Sell Completed Build | completion value or major event cleared | confirmation accepted | completed project | grants Builder Stars/legacy reward | Finish the build or clear a major event first. | 12 to 24+ hours | Future |
| start_next_project | Start Next Project Car | previous build completed/sold | always | Builder Stars or reset choice | starts next build stronger | Complete the current build first. | after first garage prestige | Future |

### Balance Relationship With Tofu Shop

- Shop upgrades increase earning speed.
- Larger order types make garage funding easier.
- Garage costs create long-term Tip sinks.
- Event prizes can later feed money back into the shop.
- The player chooses between reinvesting into shop production or saving for car parts.
- The shop must remain useful throughout the car build.

Dream Garage should never become a reason to skip the shop. It should make shop work feel
emotionally connected to a larger dream.

### Dream Garage Progressive Reveal

| Moment | Visibility |
| --- | --- |
| Before first shop loop | garage hidden |
| After first 100 Tips or Shop Level 2 | covered car teaser |
| After 10 fulfilled orders or first Family Tofu Tray | Dream Garage active |
| After Stage 0 complete | first closed-course event teaser |
| After Stage 1 basics | events active |
| After Stage 3 | sell/complete build prestige visible |

### Dream Garage Balance Tests

Future implementation should add tests for:

- garage hidden during the first shop loop
- covered car teaser appears at the intended milestone
- Dream Garage unlocks after the defined condition
- buying a part consumes Tips or Dream Jar funds
- parts update Build Score, Reliability, Style, and Event Readiness
- closed-course event does not require real driving
- event rewards do not use speed, GPS, map, street, route trace, exact distance, or high-G data
- selling/completing a car grants prestige and starts a new build
- shop progression remains playable without garage
- Cup Test remains optional for ordinary shop and garage progression

## Ultimate Net Worth Endgame

Ultimate Net Worth is future design direction only. It is not implemented and should not affect the
current First Loop Contract.

Long-arc framing:

```text
Tofu Shop is the first job.
Dream Garage is the first dream.
The car company is the first empire.
The rocket company is the absurd endgame.
The goal is $1 trillion net worth.
```

`Dollars` are a placeholder ultimate game abstraction. Future UI may call the value `Net Worth`,
`Enterprise Value`, `Total Value`, or `Company Value`. This is fictional game economy language, not
real financial advice.

Conceptual formula:

```text
Net Worth =
  cash / Tips equivalent
  + business valuations
  + garage assets
  + collector car values
  + manufacturing company value
  + future aerospace value
  - liabilities / loans / obligations
```

The player may start with very low or negative net worth if future startup costs, shop bills, loans,
or project-car expenses are added. Some assets appreciate, some depreciate, some ventures become
cashflow engines, and some ventures are liabilities until upgraded or turned around.

### Asset Valuation Layers

| Asset Layer | Unlock Era | Value Source | Possible Liabilities | Role In Progression |
| --- | --- | --- | --- | --- |
| Tofu Shop | Shop Worker / Shop Owner | stations, order throughput, reputation, stamps | startup costs, shop bills, idle inefficiency | first active labor engine |
| Tofu Shop Franchise | Franchise Era | multiple shops, managers, brand value | manager costs, uneven locations, upkeep | turns shop labor into scalable business |
| Delivery Network | Manager / Franchise Era | order volume, fictional districts, dispatch efficiency | staff costs, route-card upkeep | connects shop resources to broader business value |
| Dream Garage | Dream Garage Era | tools, workspace, build history, showcase value | parts storage, unfinished projects | converts Tips into emotional assets |
| Project Car | Dream Garage / Builder Era | parts, Reliability, Style, Event Readiness, story status | expensive mistakes, unfinished builds, depreciation | first asset that can be kept, showcased, or sold |
| Collector Car | Builder Era | rarity, completed build quality, event reports, cosmetic identity | upkeep, storage, volatile value | long-term status asset and possible prestige object |
| Car Manufacturing Company | Manufacturer Era | production lines, brand reputation, prototype success | factory costs, failed models, recalls as fictional flavor | turns individual builds into scalable production |
| Sponsorship / Showcase Brand | Builder / Manufacturer Era | style, Passport proof, event reports, sponsor badges | reputation risk, event costs | social/status multiplier and prize support |
| Rocket Company | Aerospace Era | launch contracts, aerospace research, space delivery capacity | expensive failures, research burn, launch costs | absurd late-game paradigm shift |
| Space Delivery / Space Race League | Space League Era | league rights, space cargo contracts, showcase events | huge operating costs, fictional rivalry pressure | patchable post-$1T expansion |

Design notes:

- Tofu Shop starts as active labor.
- Franchise and manager automation eventually make shop income passive.
- Dream Garage turns Tips into appreciating or depreciating assets.
- Project cars can be kept, showcased, entered in fictional closed-course events, or sold.
- Car manufacturing turns individual builds into scalable production.
- Rocket/aerospace is the late-game paradigm shift.
- The $1T target is the first major endgame goal; future patches may add more layers beyond it.

### Dream Garage Continuation Into Net Worth

Project cars should create identity, not just numbers.

Future rules:

- some project cars become valuable collector builds
- some builds become expensive mistakes and lose value
- selling a completed build can fund the next venture and act like prestige
- keeping a build can improve social status, showcase value, and collector portfolio value
- fictional closed-course event reports can raise Project Car Value
- car parts, garage assets, and prestige perks must not improve real-world Cup Test scoring,
  qualification, speed, route validation, or safety-sensitive behavior

### Business Scaling Arc

| Era | Player Fantasy | Main Systems | Exit Toward Next Era |
| --- | --- | --- | --- |
| Shop Worker Era | Work the counter by hand | Simple orders, Tofu Press, Prep Counter | first upgrades and stamps |
| Shop Owner Era | Improve the shop | stations, upgrades, Delivery Shelf, Shop Sign | stable first-shop income |
| Manager Era | Hire systems that remove chores | Counter Service, Regular Customers, managers | shop runs while player plans |
| Franchise Era | Scale Tofu Shop beyond one counter | franchises, delivery network, brand value | strong passive business valuation |
| Dream Garage Era | Fund the first dream car | project car, parts, garage tools | completed first build |
| Builder Era | Turn builds into value and status | collector cars, closed-course events, showcase brand | major build sale or portfolio value |
| Manufacturer Era | Build the first car company | prototypes, production, sponsorship, brand | company valuation milestone |
| Aerospace Era | Enter the absurd endgame | rocket company, aerospace research, space delivery | approach $1T net worth |
| Space League Era | Patchable late-game spectacle | space delivery / space league / showcase rights | post-$1T expansion |

### Future Social Status / Scout Concept

This is future-only and requires backend/accounts if ever implemented. It is not current MVP
behavior.

Future opt-in social concepts:

- send a Scout or Ambassador to discover other fictional establishments
- offer trades or sponsor pitches
- propose partnerships
- request sponsorship/tribute only in friendly fictional business language
- compete through asynchronous corporate rivalry
- show off cards, skins, bases, garages, cars, businesses, stamps, and badges

Safe framing:

- Scout
- Ambassador
- Rival Company
- Sponsor Pitch
- Trade Offer
- Showcase Visit
- Corporate Challenge
- Friendly Rivalry
- Market Competition
- Brand Duel
- Exhibition Match

Avoid:

- `attack force`
- real violence
- crime
- real sabotage
- harassment
- shaming
- doxxing
- real-world targeting

Social guardrails:

- opt-in only
- privacy-safe by design
- asynchronous and non-destructive unless both players consent
- no real location, GPS, route, speed, street, coordinate, map, or driving data
- no active-drive shop/social actions
- no public road competition or route leaderboards
- no raw GPS or raw motion upload

### Social Status Assets

Future showcase objects:

- player cards
- shop skins
- garage skins
- project car cards
- collector car cards
- company headquarters
- rocket hangar
- sponsor badges
- Passport stamps
- No-Spill Club proof
- Perfect Pour proof
- premium cosmetic skins

Cosmetics can express identity and social status. They must not improve Cup Test scoring,
qualification, speed, safety-sensitive behavior, shop progression fairness, or real-world driving
outcomes. Premium skins are future monetization only, not current MVP.

### Patchable Endgame

The $1T goal is the first major endgame target. The game can continue through patches:

- new business layers
- new car build eras
- new collector markets
- new fictional events
- new space/aerospace layers
- new social showcases
- new prestige tiers

## 15. Balance Sheet Schema

Use this schema for future spreadsheet and simulation work.

| Column | Purpose |
| --- | --- |
| id | Stable mechanic ID |
| label | User-facing name |
| phase | Reveal phase |
| visibleAt | Unlock/reveal condition |
| enabledWhen | Button usable condition |
| primaryResource | Main resource involved |
| costFormula | Exact cost formula |
| baseCost | Starting cost |
| growthRate | Cost growth |
| effectFormula | Exact production/reward effect |
| expectedUnlockTime | Target time when visible |
| expectedTimeToBuy | Target time from visible to usable |
| bottleneckSolved | What problem it fixes |
| nextBestActionText | CTA text when dominant |
| replacesOrAutomates | Earlier action it replaces or automates |
| safetyNotes | Cup Test/privacy/safety constraints |
| status | Planned, Implemented, Partial, Placeholder, Future |

Starter first-loop balance sheet:

| id | label | phase | visibleAt | enabledWhen | primaryResource | costFormula | baseCost | growthRate | effectFormula | expectedUnlockTime | expectedTimeToBuy | bottleneckSolved | nextBestActionText | replacesOrAutomates | safetyNotes | status |
| --- | --- | --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- | --- |
| fulfill_shop_order | Fulfill Shop Order | First Loop | Start | Ready Orders >= 1 | Delivery Orders | flat | 1 order | 1.0 | +10 Tips, +1 Reputation, +8 XP | 0:00 | immediate | Converts orders to spendable progress | Fulfill Simple Tofu Box | none | Parked-only, no sensors | Implemented |
| family_tofu_tray | Family Tofu Tray | First Shop | 5 fulfilled orders or Shop Level 2 | 24 stock and 1 ready order | Tofu Stock, Delivery Orders | flat | 24 stock + 1 order | 1.0 | +45 Tips, +3 Reputation, +24 XP | 5 to 10 minutes | when unlocked and stocked | Extra stock has value | Fulfill Family Tofu Tray | simple order only | Shop only | Implemented |
| festival_bento | Festival Bento | First Shop / later | 25 fulfilled orders or 50 Reputation | 75 stock and 2 ready orders | Tofu Stock, Delivery Orders | flat | 75 stock + 2 orders | 1.0 | +130 Tips, +8 Reputation, +70 XP | 20 to 40 minutes | when unlocked and stocked | First big payout | Fulfill Festival Bento | smaller orders | Shop only | Implemented |
| tofu_press | Tofu Press | First Loop | Start | always owned; buys require Tips | Tips | baseCost * growthRate ^ owned | 15 | 1.15 | +0.10 stock/sec target each | 0:00 | about 2 orders for first extra | Low Tofu Stock | Buy Tofu Press | Pack Tofu pressure | Shop only | Implemented, target value gap |
| prep_counter | Prep Counter | First Loop | Start | always owned; buys require Tips/Prep Slots | Tips, Prep Slots | baseCost * growthRate ^ owned | 50 | 1.16 | +0.025 orders/sec target each; consumes 2 stock/order | 0:00 | 4 to 6 minutes for first extra | Slow/no Delivery Orders | Buy Prep Counter | manual waiting | Shop only | Implemented, target cost gap |
| steady_pressing | Steady Pressing | First Loop | Stock runway low or extra Tofu Presses make stock growth relevant | Tips >= 20 | Tips | upgrade growth | 20 | TBD | Tofu Press output x1.5 at level 1 | 1 to 5 minutes when stock is low | about 2 simple orders in a stock-bottleneck state | Slow stock rebuild | Buy Steady Pressing | none | Shop language only | Implemented |
| double_mold | Double Mold | First Shop | Own 3 Tofu Presses | Tips >= 40 | Tips | flat or upgrade growth | 40 | TBD | Tofu Press output x2 | 3 to 8 minutes | TBD | First stock plateau | Buy Double Mold | none | Shop language only | Implemented, tuning pending |
| tidy_packaging | Tidy Packaging | First Loop | First order complete and Prep Counter/order throughput bottleneck | Tips >= 20 | Tips | upgrade growth | 20 | TBD | Prep Counter output x1.5 | 1 to 3 minutes | about 2 simple orders | Slow order prep | Buy Tidy Packaging | none | Shop language only | Implemented |
| first_shop_order_stamp | First Shop Order Stamp | First Loop | First order fulfilled | automatic | none | none | 0 | 1.0 | Unlock first stamp, Stamp Fanfare, and Passport teaser | 0:00 to 1:00 | immediate | Collection reveal | View Passport | none | Local-only stamp; fanfare repeats are suppressed | Implemented |
| delivery_shelf | Delivery Shelf | First Shop | 10 to 20 minutes or 25 orders fulfilled | Tips/Prep Slots available | Tips | station growth | 800 | 1.17 | Prep Counter support/capacity | 10 to 20 minutes | TBD | Scaling order flow | Buy Delivery Shelf | none | Shop only | Partial |
| shop_sign | Shop Sign | First Shop | 10 Reputation or reputation gate | Tips available | Tips | station growth | 300 | 1.18 | +50% Reputation/order target or route unlock support | 20 to 40 minutes | TBD | Reputation unlock pressure | Buy Shop Sign | none | Shop only | Partial |
| counter_service | Counter Service | First Automation | First 10 Orders | manually started and page open | ready orders + Tofu Stock | interval upgrades | 0 | 1.0 | 1 automatic best-available handoff / 10 seconds, upgradeable to 8/6/4 seconds | after 10 orders | immediate after unlock | Repeated manual handoff chore | Start Counter Service | repeated Fulfill clicks | Parked-only, active-page-only, no offline auto-fulfillment | Implemented V1 |
| local_delivery_license | Local Delivery License | First License | plateau requirements met | confirmation accepted | progress reset | requirements | 0 | 1.0 | Reset selected shop progress; grant 1 to 3 Stars | 4 to 6 hours | at plateau | Long-term plateau | Take License Exam | first run loop | No real driving requirement | Placeholder |

## Implementation Slices

These slices define future implementation order. Each slice should ship with visible state changes,
feedback, tests, and updated status evidence. Do not include later systems just because their data
already exists.

| Slice | Goal | Files Likely Touched | Tests Required | What Not To Include |
| --- | --- | --- | --- | --- |
| 1. First Loop Contract | Align fresh state, first order, first upgrade timing, first stamp, and early reveal | `frontend/nospill/app.js`, `test_frontend_nospill.js`, docs | fresh order available, Simple Tofu Box rewards, first stamp, no advanced clutter, no resource-negative state | Routes, Crew, Garage, Spirit, Rivals, License |
| 2. Order Types | Make Tofu Stock matter through larger orders | `app.js`, tests, `BALANCE_AND_PROGRESSION.md`, `IMPLEMENTATION_STATUS.md` | Family/Festival unlocks, typed costs/rewards, Fulfill Max labeling, raw stock does not multiply Tips | route contracts, Catering Crate if pacing is not ready |
| 3. Early Upgrade Timing | Make first purchases solve current bottlenecks | `app.js`, tests | first extra station timing, Steady Pressing timing, Tidy Packaging timing, disabled reasons | broad upgrade catalog expansion |
| 4. Passport First Stamp | Make first collection moment rewarding without showing full catalog | `app.js`, tests, docs | First Shop Order stamp reveal, View Passport teaser, stamp persists | deep Passport filters/categories |
| 5. Delivery Shelf / Shop Sign | Add first-shop support systems after the core loop is stable | `app.js`, tests, docs | reveal timing, Tips costs, throughput/reputation effects, no first-screen clutter | full route network |
| 6. First Route Card | Introduce Shop Street as fictional parked content | `app.js`, tests, docs | route cost/reward, fictional copy, no real road language, route stamp | maps, real routes, route leaderboards |
| 7. Counter Service V1 | Let the counter remove repeated prepared-order handoffs after manual mastery | `app.js`, tests, docs | First 10 Orders unlock, Start/Pause, active-page-only handoff tick, Best Available priority, finite interval upgrades, no offline auto-fulfillment | Regular Customers, crew, route automation, bulk automation upgrades |
| 8. First Automation Expansion | Let Apprentice Driver or Regular Customers remove later repeated fictional chores | `app.js`, tests, docs | hire/assign or passive-customer state, consumes orders, local rewards, no real driving requirement | full crew management |
| 9. First License Exam | Add first prestige decision after a plateau | `app.js`, tests, docs | requirements, confirmation, reset/persist contract, Stars/perks | multiple exams, monetization |
| 10. Post-License Rebuild | Make permanent perks accelerate the early loop | `app.js`, tests, docs | perk purchase, fresh run benefits, no Cup Test scoring effect | late regional network unless needed |

## 16. Status Audit

Status values:

- `Implemented`
- `Partial`
- `Placeholder`
- `Decorative only`
- `Documented only`
- `Future`
- `Non-goal`

Implementation rule:

A system is implemented only if it changes state, gives feedback, is tested, and fits this
progression contract.

| System | Status | Evidence | What Works | Remaining Work |
| --- | --- | --- | --- | --- |
| Tofu Press live production | Implemented | `frontend/nospill/app.js`, live tick tests | produces Tofu Stock over elapsed time | first-loop rate tuning |
| Prep Counter conversion | Implemented | `applyShopGeneratorTick`, order prep tests | consumes Tofu Stock and prepares Delivery Orders | first-loop pacing simulation |
| Tofu Stock runway | Implemented | `tofuStockRunway`, runway tests | explains whether stock is enough and avoids bad Tofu Press recommendations | mobile copy polish |
| Fulfill Shop Order | Implemented | order fulfillment helpers/tests | converts orders into Tips/Reputation/XP and gives feedback | align XP target if needed |
| Order-size ladder | Implemented | order catalog, typed fulfillment, Overview order cards, Next Best Action tests | Simple Tofu Box, Family Tofu Tray, and Festival Bento consume typed tofu/order costs and pay typed rewards | tune unlock timing and presentation |
| Tips purchase currency | Implemented | station/upgrade costs and disabled copy | buys stations/upgrades | tune first purchase timing |
| Ready order/progress display | Implemented | ready order UI/tests | hides raw fractional order count | refine ETA copy |
| First Shop Order stamp | Implemented | order result, ledger, Passport teaser tests | first fulfilled Simple Tofu Box unlocks and reports the stamp without showing the full catalog | visual polish |
| Tofu Press / Prep Counter station cards | Implemented | station rendering/tests | station count and upgrade levels are separate | visual polish |
| Station Milestone Boosts V1 | Implemented | `STATION_MILESTONE_BOOSTS`, station card milestone copy, count-derived rate multipliers, one-time inline feedback, tests | 5/10 Tofu Press and Prep Counter output boosts, 5/10 Delivery Shelf support boosts, and 5/10 Shop Sign Reputation support boosts are total multipliers | tune thresholds and decide whether 25+ station milestones are needed |
| Steady Pressing / Double Mold | Implemented | station upgrade catalog/tests | named Tofu Press modifiers; Steady Pressing aligns to 20 Tips and x1.5 output target and is recommended only when stock runway is low/relevant | playtest timing |
| Tidy Packaging / Double Labels | Implemented | station upgrade catalog/tests | named Prep Counter modifiers; Tidy Packaging is the first visible bottleneck-solving upgrade when order prep is slow, costs 20 Tips, and shows a before/after prep-rate preview | tune exact feel after playtesting |
| Delivery Shelf | Implemented | station unlock, purchase, Prep Counter boost | first support station improves order throughput | tune cost/reveal timing |
| Shop Sign | Implemented | station unlock, purchase, order Reputation boost | first Reputation support station improves fulfilled-order reputation | tune cost/reveal timing |
| Counter Service | Implemented | state, Overview card, active-page tick, upgrade cards, tests | starts paused after First 10 Orders, auto-fulfills Best Available orders every 10 seconds while parked/open, reports income/blocked status, and can improve to 8/6/4 second handoffs through Order Bell, Wider Counter, and Pickup Routine | tune rates and future bulk/priority upgrades after playtesting |
| Routes | Placeholder | route catalog/panel/tests | fictional route cards can complete | keep hidden until first loop and route unlock are ready |
| Crew automation | Placeholder | crew roles/hire helpers | counts and surface exist | real assignment/automation loop later |
| Garage | Partial | garage upgrades/helpers | fictional upgrades exist | clarify pacing and effects |
| Dream Garage concept | Documented only | Dream Garage / Project Car Progression section | future emotional arc is specified | implement only after first loop and order pacing are stable |
| Project car stages | Documented only | Stage 0 through Stage 3 tables/lists | covered car, daily build, closed-course build, dream build are defined | no runtime state/UI yet |
| Fictional closed-course events | Documented only | event table and safety rules | future event names/rewards are specified | no event queues/results yet |
| Project car completion/sale prestige | Documented only | Builder Stars design | future prestige direction is specified | no Builder Stars state yet |
| Shop Spirit | Placeholder | Spirit resources/boost helpers and panel copy | wallet shows Tips, Shop Spirit, Spirit/sec, and multiplier; actions are classified as Buy, Spend Spirit, Start Effect, or Use Token; route-related Spirit items stay hidden until route story beats matter | keep hidden until stable production and add token earning rules later |
| Rivals | Placeholder | challenge helpers | friendly challenge scaffold exists | keep hidden until later |
| License Exam | Placeholder | exam/perk helpers | reset/perk concept exists | tune requirements and reset strategy |
| Passport | Partial | stamp labels/panel | stamps can unlock | staged reveal and details |
| Ledger | Implemented | capped ledger helpers/tests | records local summaries | filter/clear polish |
| Don't Spill the Cup boosts | Implemented | Cup Test reward helpers/tests | optional certified shop rewards | tune boost magnitude; keep optional |
| Developer QA | Implemented | hidden dev tools | local QA unlocks are gated | must remain hidden from normal users |

## 17. Balance Tests

Future implementation should enforce these tests before the first loop is considered real.

Starting state:

- fresh shop starts with 10 Tofu Stock
- fresh shop starts with 1 Delivery Order
- fresh shop starts with 1 Tofu Press
- fresh shop starts with 1 Prep Counter
- fresh shop starts with 0 Tips
- first order can be fulfilled immediately

First action:

- first order grants Tips, Reputation, and XP
- Simple Tofu Box consumes 6 Tofu Stock and 1 Delivery Order
- Family Tofu Tray unlocks after its condition, consumes 24 Tofu Stock, and pays more Tips
- Festival Bento unlocks after its condition, consumes 75 Tofu Stock and 2 Delivery Orders, and pays the first big reward
- raw Tofu Stock does not directly multiply Tips
- Fulfill Max is labeled with the selected/best order type
- First Shop Order stamp unlocks or is revealed after the first order
- normal shop-order fulfillment stays inline
- Cup Test result offers a parked `Visit Tofu Shop` CTA
- no share-card clutter appears for ordinary shop order results

Order prep:

- fractional orders render as ready orders plus prep progress
- `0.3` internal Delivery Orders renders as `0 ready` and `30% prepared`
- disabled Fulfill Shop Order explains why it is disabled
- live ticking updates order progress without refresh
- resources never go negative

Purchases:

- first extra station is reachable in expected time
- first upgrade is reachable in expected time
- buying Steady Pressing increases visible Tofu Stock/sec
- buying Tidy Packaging increases visible Delivery Orders/sec
- Buy Max behaves correctly
- disabled buttons explain missing resource and where to get it
- no visible active button lacks behavior

Bottlenecks:

- high stock recommends Prep Counter/order throughput
- low stock recommends Pack Tofu or Tofu Press
- ready orders recommend Fulfill Shop Order or Fulfill Max Orders
- Cup Test remains optional and does not override normal shop bottlenecks

Reveal:

- advanced systems do not dominate the first 10 minutes
- Routes, Crew, Garage, Spirit, Rivals, License, deep Passport, and sound/character economy are
  hidden or teaser-locked until relevant
- settings/debug/QA content is not prominent

Safety/privacy:

- no real-world driving is required for ordinary shop progression
- no speed, GPS, route, map, street name, coordinate, exact distance, or high-G data affects shop
  progression
- Basic Mode does not request geolocation
- Qualified Run requests geolocation only after explicit opt-in/start
- shop actions remain hidden/disabled during active drive

Offline:

- offline production respects the configured cap
- offline progress applies once on return
- zero-value offline summaries are hidden
- ledger summarizes meaningful offline gains

Prestige:

- License Exam does not require real driving
- License Perks do not affect real-world Cup Test scoring or qualification
- reset/persist behavior matches the License Exam contract

## 18. Open Design Questions

These should remain unresolved until playtesting or simulation provides evidence.

- Is Tidy Packaging consistently the right first named upgrade when Prep Counter throughput is the first bottleneck?
- Is 1 order every 40 seconds too slow, too fast, or right for the first 10 minutes?
- Should Pack Tofu stay forever as a backup action or fade after Tofu Press scales?
- Should Steady Pressing stay stock-bottleneck-only, or should it also appear after a fixed Tofu Press milestone?
- Should Tidy Packaging appear by bottleneck detection alone, or also by fulfilled-order count for players who miss the bottleneck?
- When should Passport become a full tab instead of a teaser?
- How many stamps should be discoverable in the first hour?
- When should Routes become visible: 20 minutes, 40 minutes, or after a specific Reputation gate?
- When should Crew become visible?
- Should Shop Spirit exist before or after the first License Exam?
- Is the first License Exam better at 4 hours, 6 hours, or later?
- Should first License Exam reset XP, or only shop resources/stations?
- How generous should certified Cup Test boosts be without making driving feel required?
- Should offline cap start at 1 hour for balance, even if runtime currently supports a larger cap?
- Should Delivery Shelf be a station, an upgrade, or a capacity rule?
