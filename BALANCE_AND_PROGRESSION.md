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
| Tofu Stock | Ingredient and runway for order prep | Tofu Press, Pack Tofu, offline production, shop boosts | Prep Counter, later larger orders, fictional routes | Immediately | Low only when Prep Counter outruns press output | Not enough stock to prepare orders | Resets |
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
Next Order: 30% prepared
```

Fulfill Shop Order requires at least 1 ready order.

## 4. First 10 Minutes

The first 10 minutes should prove the one-loop game. Fresh players should not see every advanced
system.

| Time Window | Player Goal | Visible Resources | Visible Active Buttons | Visible Disabled Buttons | Hidden Systems | Intended Bottleneck | Next Best Action Text | Expected Reward | Expected Unlock / Story Beat |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0:00 to 0:30 | Understand that one shop order is ready | Tofu Stock, Delivery Orders, Tips, Reputation, XP | Fulfill Shop Order; Take the Cup Test as secondary | Buy Tofu Press if shown but unaffordable | Routes, Crew, Garage, Shop Spirit, Rivals, License, deep Passport, character/sound economy | Delivery Orders as the first money opportunity | `Fulfill Shop Order` | +Tips, +Reputation, +XP | `The first order leaves the counter.` |
| 0:30 to 1:00 | See the result and return to the shop | Tips, Reputation, XP, Tofu Stock, ready/preparing orders | Return to Tofu Shop; Fulfill Shop Order if another order is ready | Buy Tofu Press or Steady Pressing if not affordable | Advanced panels remain hidden | Need Tips or waiting for next order | `Return to Tofu Shop` or `Wait for Prep Counter` | Shop Order Complete feedback | First Shop Order stamp should appear or be teased |
| 1:00 to 2:00 | Learn that Prep Counter rebuilds orders | Tofu Stock, Ready Orders, Next Order progress, Tips | Fulfill Shop Order when ready; Buy Tofu Press if stock is low; Take the Cup Test secondary | Steady Pressing if close but unaffordable | Routes, Crew, Garage, Spirit, Rivals, License | Either Tips or order preparation | `Fulfill Shop Order` or `Wait for Prep Counter` | Another order payout or progress toward first purchase | `The counter is learning the rhythm.` |
| 2:00 to 3:00 | Make or approach the first meaningful purchase | Tips, Tofu Stock runway, order prep progress | Buy Steady Pressing if affordable; Buy Tofu Press if stock is low; Fulfill Shop Order | Buy Prep Counter if not affordable | Full Passport, Routes, Crew, Garage, Spirit, License | First purchase cost | `Buy Steady Pressing` or `Fulfill Shop Order` | First rate bump or clear progress toward it | Upgrade card becomes visible |
| 3:00 to 5:00 | Understand stock versus throughput | Tofu Stock runway, Ready Orders, Tips, Reputation | Buy Prep Counter if stock is healthy and orders are slow; Buy Tofu Press if stock is low; Fulfill Shop Order | Tidy Packaging if not yet unlocked/affordable | Routes only as subtle teaser if needed; Crew/Garage/Spirit/Rivals/License hidden | Stock runway or order throughput | `Buy Prep Counter` or `Buy Tofu Press` based on bottleneck | Visible `/sec` improvement | Passport teaser after first stamp |
| 5:00 to 10:00 | Own the basic loop and see first collection hook | Tofu Stock, Delivery Orders, Tips, Reputation, XP, first stamp | Fulfill Max Orders if multiple ready; Buy Tofu Press; Buy Prep Counter; Buy Steady Pressing; Buy Tidy Packaging; View Passport | Better Boxes if close but not unlocked | Routes as teaser only; Crew/Garage/Spirit/Rivals/License hidden | Clear bottleneck-solving upgrade | `Buy the clearest bottleneck-solving upgrade` | First meaningful production bump and stamp feeling | First Passport card; hint that Routes exist later |

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

## 6. Full Progression Phase Map

| Phase | Time Target | Main Fantasy | Core Systems | Visible Tabs | Primary Resources | Primary Buttons | Upgrades | Unlocks | Expected Session Length | Exit Condition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. First Loop | 0 to 10 minutes | A small counter starts moving | Tofu Press, Prep Counter, Orders, first upgrade, first stamp | Overview, Orders, Production basics, maybe Passport teaser | Tofu Stock, Delivery Orders, Tips | Fulfill Shop Order, Buy Tofu Press, Buy Prep Counter, Buy Steady Pressing, Take Cup Test secondary | Steady Pressing, early station counts | First Shop Order stamp | 1 to 5 minutes | Player understands stock -> orders -> Tips |
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
| fulfill_10_orders | Fulfill 10 Orders | Orders | First Shop | Ready Orders can exceed 10 | Ready Orders >= 10; parked | Need 10 ready Delivery Orders. | 10 Delivery Orders | Grants 10x order rewards | 10 to 20 minutes | Reduces repeated order clicks | Fulfill 10 Orders | Implemented, reveal timing pending |
| fulfill_max_orders | Fulfill Max Orders | Orders | First Shop | Ready Orders > 1 | Ready Orders >= 2; parked | Need more than 1 ready Delivery Order. | all ready Delivery Orders | Converts all ready orders into rewards | 5 to 10 minutes | Avoids click spam | Fulfill Max Orders | Implemented |
| buy_tofu_press | Buy Tofu Press | Production | First Loop | Production basics visible | Enough Tips; Prep Slots available | Need more Tips. Fulfill shop orders to earn Tips. | Tips, station growth | Adds Tofu Stock/sec | 1 to 3 minutes if stock is low | Low Tofu Stock runway | Buy Tofu Press | Implemented |
| buy_max_tofu_press | Buy Max Tofu Press | Production | First Shop | Buy Tofu Press visible; multiplier relevant | Can afford at least 1 press | Need more Tips. | max affordable Tips/Prep Slots | Buys multiple presses | 10 to 20 minutes | Avoids repetitive station buying | Buy Max Tofu Press | Implemented |
| buy_prep_counter | Buy Prep Counter | Production | First Loop | Production basics visible | Enough Tips; Prep Slots available | Need more Tips or Prep Slots. Fulfill shop orders to earn Tips. | Tips plus Prep Slot | Adds Delivery Orders/sec and Tofu Stock consumption | 3 to 6 minutes when orders are slow | Order throughput | Buy Prep Counter | Implemented |
| buy_max_prep_counter | Buy Max Prep Counter | Production | First Shop | Buy Prep Counter visible; multiplier relevant | Can afford at least 1 counter | Need more Tips or Prep Slots. | max affordable Tips/Prep Slots | Buys multiple counters | 15 to 30 minutes | Avoids repetitive station buying | Buy Max Prep Counter | Implemented |
| buy_steady_pressing | Buy Steady Pressing | Upgrades | First Loop | First order complete or stock growth bottleneck | Enough Tips | Need 20 Tips. Fulfill shop orders to earn Tips. | 20 Tips target | Tofu Press output x1.5 | 1 to 3 minutes | Slow stock rebuild | Buy Steady Pressing | Implemented, target tuning pending |
| buy_double_mold | Buy Double Mold | Upgrades | First Shop | Own 3 Tofu Presses | Enough Tips | Need 40 Tips. | 40 Tips target | Tofu Press output x2 | 5 to 10 minutes | First production plateau | Buy Double Mold | Implemented, target tuning pending |
| buy_tidy_packaging | Buy Tidy Packaging | Upgrades | First Shop | 5 orders fulfilled or order throughput bottleneck | Enough Tips | Need 60 Tips. Fulfill prepared orders first. | 60 Tips target | Prep Counter output x1.5 | 5 to 10 minutes | Slow order prep | Buy Tidy Packaging | Implemented, target tuning pending |
| buy_double_labels | Buy Double Labels | Upgrades | First Shop | Own 2 Prep Counters | Enough Tips | Need 120 Tips. | 120 Tips target | Prep Counter output x2 | 10 to 20 minutes | Order throughput plateau | Buy Double Labels | Implemented, target tuning pending |
| view_passport | View Passport | Passport | First Loop / First Shop | First stamp earned or teaser unlocked | Passport is discovered | Earn a stamp-worthy shop moment first. | none | Opens stamp/status collection | 5 to 10 minutes | Collection curiosity | View Passport | Partial |
| return_to_tofu_shop | Return to Tofu Shop | Result | Any result | Result screen shown | Always | none | none | Returns to shop/dashboard | After first result | Closes reward loop | Return to Tofu Shop | Implemented |
| take_cup_test | Take Don't Spill the Cup | Shop/Cup Test | Always secondary from shop | Always visible as optional boost path | Parked; setup/safety complete for start | Complete the safety checklist before starting. | none | Starts optional smooth-driving challenge | Any time | Certified boost/status path | Take the Cup Test | Implemented |
| buy_delivery_shelf | Buy Delivery Shelf | Production | First Shop | 10 to 20 minutes or order throughput pressure | Enough Tips/Prep Slots | Unlocks after the core order loop is established. | 800 Tips target | Supports order throughput/capacity | 10 to 20 minutes | Scaling order flow | Buy Delivery Shelf | Partial |
| buy_shop_sign | Buy Shop Sign | Production/Upgrades | First Shop | Reputation starts gating systems | Enough Tips | Need Reputation or Tips. | 300 Tips target | Improves Reputation gain/unlocks route path | 20 to 40 minutes | Reputation unlock pressure | Buy Shop Sign | Partial |
| start_shop_street | Start Shop Street | Routes | First Automation | First fictional route discovered | Enough Tofu Stock and Delivery Orders | Build Reputation or Shop Reach to unlock fictional route cards. | Tofu Stock and Delivery Orders | Grants Tips, Reputation, Route Knowledge, Shop Reach, route stamp chance | 40 to 90 minutes | New mid-game goal | Start Shop Street | Placeholder |
| hire_apprentice_driver | Hire Apprentice Driver | Crew | First Automation | First route progress exists | Enough Tips/Prep Slots | Unlocks after route progress. | Tips plus Prep Slot | Begins fictional automation path | 1 to 2 hours | Manual route/order chores | Hire Apprentice Driver | Placeholder |
| assign_crew | Assign Crew | Crew | First Automation | Crew member hired | Route/crew slot available | Hire crew first. | Delivery Orders or route slot | Assigns fictional automation | 1 to 2 hours | Repeated route handling | Assign Crew | Placeholder |
| buy_tea_kettle | Buy Tea Kettle | Shop Spirit | Festival / Spirit | Stable production; Spirit layer unlocked | Enough Tips/Prep Slots | Unlocks after stable shop production. | Tips plus Prep Slot | Generates Shop Spirit/sec | Later | Boost energy generation | Buy Tea Kettle | Placeholder |
| use_shop_spirit_boost | Use Shop Spirit Boost | Shop Spirit | Festival / Spirit | Shop Spirit available | Enough Shop Spirit; parked | Need Shop Spirit. | Shop Spirit | Temporary shop-only production boost | Later | Short active shop burst | Use Shop Spirit Boost | Placeholder |
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
| 1 | Steady Pressing | First order complete | 20 Tips | Tofu Press output x1.5 | 1 to 3 minutes | First visible stock/sec bump | Slow Tofu Stock growth | TBD | multiplicative station modifier | Implemented, target tuning pending |
| 2 | Double Mold | Own 3 Tofu Presses | 40 Tips | Tofu Press output x2 | 3 to 8 minutes | Big stock runway break | First stock plateau | TBD | multiplicative station modifier | Implemented, target tuning pending |
| 3 | Tidy Packaging | 5 orders fulfilled or order prep bottleneck visible | 60 Tips | Prep Counter output x1.5 | 5 to 10 minutes | More orders without waiting | Slow Delivery Order growth | TBD | multiplicative station modifier | Implemented, target tuning pending |
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
| After first order | Shop Order Complete result, Tips source, Steady Pressing teaser, First Shop Order stamp teaser | Passport preview | Routes, Crew, Garage, Spirit, Rivals, License |
| After first upgrade | clearer Production/Upgrade cards | Tidy Packaging or Prep Counter improvement | Full route network, Crew, Spirit, Rivals, License |
| After first stamp | Passport card/panel with first stamp details | Next stamp hint | Large stamp catalog |
| After 10 minutes | Delivery Shelf/Shop Sign path | Route teaser | Crew, Garage, Spirit, Rivals, License action |
| After 1 hour | first fictional route or route preview, light Ledger | Crew preview, License preview | Deep Garage, Spirit economy, Rival Challenges |
| After first route | Route mastery, Route Knowledge, Shop Reach | Apprentice Driver preview, Garage flavor | Full automation and Rivals |
| After first License Exam | License Perks and faster rebuild | deeper routes, Spirit, network | Legendary final arc |

Early UI rule:

- Do not show full locked sublists.
- Do not show a visible roadmap of every future unlock.
- Do not make settings/debug/QA prominent.
- Do not show Delivery Crew, character selection, or sound selection inside the main early shop
  overview.

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

## 14. Balance Sheet Schema

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
| fulfill_shop_order | Fulfill Shop Order | First Loop | Start | Ready Orders >= 1 | Delivery Orders | flat | 1 order | 1.0 | +10 Tips, +1 Reputation, +8 XP target | 0:00 | immediate | Converts orders to spendable progress | Fulfill Shop Order | none | Parked-only, no sensors | Implemented, target reward gap |
| tofu_press | Tofu Press | First Loop | Start | always owned; buys require Tips | Tips | baseCost * growthRate ^ owned | 15 | 1.15 | +0.10 stock/sec target each | 0:00 | about 2 orders for first extra | Low Tofu Stock | Buy Tofu Press | Pack Tofu pressure | Shop only | Implemented, target value gap |
| prep_counter | Prep Counter | First Loop | Start | always owned; buys require Tips/Prep Slots | Tips, Prep Slots | baseCost * growthRate ^ owned | 50 | 1.16 | +0.025 orders/sec target each; consumes 2 stock/order | 0:00 | 4 to 6 minutes for first extra | Slow/no Delivery Orders | Buy Prep Counter | manual waiting | Shop only | Implemented, target cost gap |
| steady_pressing | Steady Pressing | First Loop | First order complete | Tips >= 20 | Tips | flat or upgrade growth | 20 | TBD | Tofu Press output x1.5 | 1 to 3 minutes | 1 to 2 minutes | Slow stock rebuild | Buy Steady Pressing | none | Shop language only | Implemented, tuning pending |
| double_mold | Double Mold | First Shop | Own 3 Tofu Presses | Tips >= 40 | Tips | flat or upgrade growth | 40 | TBD | Tofu Press output x2 | 3 to 8 minutes | TBD | First stock plateau | Buy Double Mold | none | Shop language only | Implemented, tuning pending |
| tidy_packaging | Tidy Packaging | First Shop | 5 orders fulfilled or throughput bottleneck | Tips >= 60 | Tips | flat or upgrade growth | 60 | TBD | Prep Counter output x1.5 | 5 to 10 minutes | 5 to 10 minutes | Slow order prep | Buy Tidy Packaging | none | Shop language only | Implemented, tuning pending |
| first_shop_order_stamp | First Shop Order Stamp | First Loop | First order fulfilled | automatic | none | none | 0 | 1.0 | Unlock first stamp | 0:00 to 1:00 | immediate | Collection reveal | View Passport | none | Local-only stamp | Partial/implemented depending on runtime reveal |
| delivery_shelf | Delivery Shelf | First Shop | 10 to 20 minutes or 25 orders fulfilled | Tips/Prep Slots available | Tips | station growth | 800 | 1.17 | Prep Counter support/capacity | 10 to 20 minutes | TBD | Scaling order flow | Buy Delivery Shelf | none | Shop only | Partial |
| shop_sign | Shop Sign | First Shop | 10 Reputation or reputation gate | Tips available | Tips | station growth | 300 | 1.18 | +50% Reputation/order target or route unlock support | 20 to 40 minutes | TBD | Reputation unlock pressure | Buy Shop Sign | none | Shop only | Partial |
| local_delivery_license | Local Delivery License | First License | plateau requirements met | confirmation accepted | progress reset | requirements | 0 | 1.0 | Reset selected shop progress; grant 1 to 3 Stars | 4 to 6 hours | at plateau | Long-term plateau | Take License Exam | first run loop | No real driving requirement | Placeholder |

## 15. Status Audit

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
| Tips purchase currency | Implemented | station/upgrade costs and disabled copy | buys stations/upgrades | tune first purchase timing |
| Ready order/progress display | Implemented | ready order UI/tests | hides raw fractional order count | refine ETA copy |
| First Shop Order stamp | Partial | stamp state exists | collection reward exists | confirm reveal timing and first-session copy |
| Tofu Press / Prep Counter station cards | Implemented | station rendering/tests | station count and upgrade levels are separate | visual polish |
| Steady Pressing / Double Mold | Implemented | station upgrade catalog/tests | named Tofu Press modifiers | tune costs/effects |
| Tidy Packaging / Double Labels | Implemented | station upgrade catalog/tests | named Prep Counter modifiers | tune costs/effects |
| Delivery Shelf | Partial | station scaffold | can exist as station/support | hide/reveal until first-shop phase |
| Shop Sign | Partial | station/legacy upgrade scaffold | reputation/shop-sign concept exists | align with route/reputation unlock timing |
| Routes | Placeholder | route catalog/panel/tests | fictional route cards can complete | keep hidden until first loop and route unlock are ready |
| Crew automation | Placeholder | crew roles/hire helpers | counts and surface exist | real assignment/automation loop later |
| Garage | Partial | garage upgrades/helpers | fictional upgrades exist | clarify pacing and effects |
| Shop Spirit | Placeholder | Spirit resources/boost helpers | boosts can affect shop layer | hide until stable production |
| Rivals | Placeholder | challenge helpers | friendly challenge scaffold exists | keep hidden until later |
| License Exam | Placeholder | exam/perk helpers | reset/perk concept exists | tune requirements and reset strategy |
| Passport | Partial | stamp labels/panel | stamps can unlock | staged reveal and details |
| Ledger | Implemented | capped ledger helpers/tests | records local summaries | filter/clear polish |
| Don't Spill the Cup boosts | Implemented | Cup Test reward helpers/tests | optional certified shop rewards | tune boost magnitude; keep optional |
| Developer QA | Implemented | hidden dev tools | local QA unlocks are gated | must remain hidden from normal users |

## 16. Balance Tests

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
- First Shop Order stamp unlocks or is revealed after the first order
- shop order result returns to Tofu Shop
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

## 17. Open Design Questions

These should remain unresolved until playtesting or simulation provides evidence.

- Should the first purchase usually be Tofu Press, Prep Counter, or Steady Pressing?
- Is 1 order every 40 seconds too slow, too fast, or right for the first 10 minutes?
- Should Pack Tofu stay forever as a backup action or fade after Tofu Press scales?
- Should Steady Pressing unlock immediately after first order or only when stock is low?
- Should Tidy Packaging appear by fulfilled-order count, bottleneck detection, or both?
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
