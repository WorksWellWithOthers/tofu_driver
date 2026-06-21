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

Tofu Shop is the first parked-only idle/incremental business inside Tofu Garage, the user-facing
home progression mode in Tofu Driver.

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

Upgrade-card visibility rule:

```text
Unlock status controls visibility.
Live resource state controls enabled/disabled/progress copy.
```

Unlocked upgrade cards should remain visible and in fixed section order while Cash, Reputation,
stock, order queue, affordability, ETA, or temporary usefulness changes. Maxed cards should stay
visible as Maxed or in a stable completed position. Future/deferred systems should stay hidden
consistently.
Multi-resource costs should label each requirement clearly, such as `Cost: $125K Cash + 1.5M
Reputation`, and progress should label the measured resource, such as `Cash: $81.8K / $125K`.

Design statement:

```text
Tofu Shop is a one-loop incremental game that earns the right to unfold.
```

Core MVP loop:

```text
Tofu Press -> Prep Counter -> Starter Counter Service -> Cash -> Buy Stations/Upgrades -> First Stamp
```

Keep this loop fun before expanding Routes, Crew, Garage, Shop Spirit, Rivals, License Exams, or
large Passport catalogs.

Current V1 route policy:

- gameplay Routes are hidden/deferred in active Tofu Garage UI
- `#/shop`, `#/garage`, and `#/cup-test` app hash routes remain unchanged
- route-related stations, upgrades, Spirit actions, training, and old route-garage actions are not
  purchasable while Routes are deferred
- future Routes must be safe fictional parked content, not GPS, maps, street names, speed rewards,
  route leaderboards, or public-road competition

Safety rule:

Shop progression must not use speed, live speed display, real routes, maps, street names,
coordinates, high-G bragging, public road competition, raw GPS upload, or raw motion upload.

## Design Summary

The intended Tofu Shop arc is a calm production game that unfolds only after each loop has a clear
reason to exist.

| Arc | Target Experience | Main Systems | Success Criteria |
| --- | --- | --- | --- |
| First 10 minutes | Learn stock, orders, Cash, first upgrade, and first stamp | Tofu Press, Prep Counter, Simple Tofu Box, Tidy Packaging when order prep is the bottleneck, Passport teaser | The player understands `Tofu Stock -> Orders -> Cash` without seeing a full system dump |
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

4. Starter Counter Service converts Delivery Orders into Cash from tips, Reputation, and Shop XP.

   Purpose: teach the money conversion without clicker labor. The first satisfying payout should
   happen automatically on a fresh shop.

5. Cash buys stations and upgrades.

   Purpose: make a clear spend currency. The legacy internal field is `shop.tips`, but the
   player-facing balance is Cash. Tips are flavor for order income; Cash is the spendable money.
   Tofu Stock is the production input.

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
Tofu Stock becomes Delivery Orders. Counter Service turns Delivery Orders into Cash.
```

Early conversion roles:

- Tofu Stock is ingredient/runway.
- Prep Counter is throughput.
- Delivery Orders are money opportunities for Counter Service.
- Tips are early order-income flavor; Cash is the implemented single liquid purchase currency.
- Reputation is unlock pressure.
- Shop XP is shop-loop progress feedback and must not increase Delivery Driver level.
- Driver XP belongs to Don't Spill the Cup and completed Cup Test milestones.
- Stamps are discovery/status.

### Progression Ownership

Delivery Driver progression belongs to Don't Spill the Cup: Driver XP, Driver Level, Driver License
title, Today's Delivery rewards, smoothness streaks, No-Spill Club gear, and driver-side Passport
stamps. Tofu Shop progression belongs to the parked idle game: Tofu Stock, Delivery Orders, Cash,
Reputation, Shop Level, Shop Spirit, stations, station milestones, Counter Service, shop upgrades,
Shop XP, and shop stamps.

Route-context stamps such as Winding Perfect Pour, Stop-and-Go Smooth Pour, and Technical Perfect
Pour are status achievements for Certified Results with enough route context plus strong cargo
results. They do not alter the base Cup Test scoring formula, Driver XP, shop rewards, Net Worth,
Garage Build Value, Brand Value, or economy balance, and they must not reward speed.

Shop orders, Counter Service, Catering Crate, and other shop automation grant shop resources and
Shop XP only. They must not grant Driver XP or inflate Driver Level. Driver Level can provide only a
small capped shop status bonus, currently a Reputation-from-orders bonus, and it must never improve
Cup Test scoring or qualification.

The full Delivery Board belongs on the Don't Spill the Cup surface. Tofu Shop may show a compact
Driver Bonus card if Driver Level is contributing a capped shop bonus.

## 3. Resource Contract

Each resource needs a clear purpose, source, sink, reveal timing, scarcity pattern, bottleneck, and
License Exam reset rule.

| Resource | Purpose | Main Sources | Main Sinks | Appears | Scarcity Target | Bottleneck Created | License Exam Reset |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tofu Stock | Ingredient, runway, and order-size input | Tofu Press, Manual Backup Pack Tofu, Supplier Contracts, offline production, shop boosts | Prep Counter, larger shop orders, future fictional routes | Immediately | Low only when Prep Counter or larger orders outrun press output | Not enough stock to prepare or fulfill the best order | Resets |
| Delivery Orders | Prepared/waiting shop work that can become money | Prep Counter, boosts, later automation | Counter Service, Manual Backup fulfillment, later routes/rivals | Immediately | First visible throughput bottleneck, capped as a queue | No ready orders to hand off, or queue full until handoffs catch up | Resets |
| Cash | Player-facing money earned from order tips; stored in legacy `shop.tips` internally | Fulfilled orders, Regular Customers, routes, certified boosts | Stations, upgrades, future car parts, businesses, route cards | Immediately after first order | Scarce early, abundant later | Cannot buy next improvement | Resets as liquid shop cash unless prestige design says otherwise |
| Reputation | Unlock currency, social proof, and midgame supply leverage | Orders, routes, certified smooth results, stamps | Gates, Supplier Contracts, rare status spends | After first order | Scarce and meaningful | Next system or managed supply remains locked | Resets, lifetime persists |
| Shop XP | Local shop progress feedback | Shop orders, shop automation | None by default | After first order | Steady visible shop progress | Shop milestones not met | Lifetime should persist unless prestige design says otherwise |
| Driver XP | Delivery Driver progress feedback | Completed Cup Test runs and driver milestones | None by default | Cup Test result | Steady visible driver progress | Driver Level requirements not met | Persists |
| Prep Capacity | Staffing/capacity gate | Timed recovery, perks | Station, crew, and route expansion purchases | When multi-buy/staffing matters | Mild friction, not a first-loop blocker | Cannot add more capacity yet | Resets, perks persist |
| Shop Reach | Fictional expansion gate | Fictional route cards and route milestones | District, route, crew unlocks | With routes | Mid-game scarce | New district/route locked | Resets unless perked |
| Shop Spirit | Parked-only boost energy | Tea Kettle, Shrine Corner, Festival Lanterns | Shop Spirit boosts | After stable production | Optional and capped | Cannot trigger active shop boost | Resets |
| Route Knowledge | Fictional mastery/progression | Fictional routes, Training Lot | Route unlocks, mastery gates, License requirements | With routes | Mid-game mastery pressure | Route/license requirement not met | Resets, lifetime records persist |
| Passport Stamps | Achievement/status collection | Orders, upgrades, routes, certified deliveries, secrets | Unlock/status gates | First stamp-worthy action | Rare enough to feel discovered | Collection or License gate | Persists |
| License Stars | Prestige currency | License Exams | License Perks | First License Exam | Rare and powerful | Permanent perk choice | Persists |

### Complete Resource Economy

| Resource | Player-Facing Meaning | Source | Sink | When It Appears | Why It Matters | Upgrade Hooks | Future Systems |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tofu Stock | tofu on hand for orders | Tofu Press, Manual Backup Pack Tofu, Supplier Contracts, offline progress, shop boosts | Prep Counter, larger order types, future route cards | immediately | creates order-size capacity and prevents Prep Counter starvation | Steady Pressing, Double Mold, Tofu Press milestones, Soy Supplier Contract, Morning Soy Delivery, Bulk Soy Delivery, License Perks | Catering Crate, Neighborhood Bundle, route cards, Regional Tofu Order |
| Delivery Orders | prepared/waiting shop work ready to hand off | Prep Counter, boosts, later automation | order fulfillment, Counter Service, Regular Customers, route cards | immediately | turns production into spendable Cash | Tidy Packaging, Double Labels, Delivery Shelf, Prep Counter milestones | Regular Customers, Apprentice Driver, route queues |
| Cash | spendable money earned from tips | order types, Regular Customers, routes, certified boosts | stations, upgrades, future car parts, crew, route cards | after first order | drives almost every early purchase and contributes to Net Worth V1 | Better Boxes, Regular Smile, License Perks | bigger stations, automation, route systems, Dream Build investments |
| Reputation | proof the shop is known | orders, Shop Sign, route cards, stamps, certified boosts | unlock gates and Supplier Contracts | after first order | opens systems without draining Cash and solves managed-shop supply traps | Shop Sign, Word of Mouth, Supplier Contracts, route mastery bonuses | routes, Crew preview, License requirements |
| Shop XP | local shop progress meter | shop orders and shop automation | shop-level feedback only | after first order | gives visible growth and shop-loop pacing | Better Boxes and shop reports | shop progress labels |
| Driver XP | delivery driver progress meter | Cup Test summaries and driver milestones | driver level gates only | Cup Test result | gives visible growth for smooth-driving status | certified result bonuses | Driver License labels |
| Prep Capacity | available staff attention/capacity | timed recovery, License Perks | station/crew/route expansion | after basic purchases matter | prevents unlimited instant expansion without creating click spam | Extra Hands, Dispatcher Desk, staffing upgrades | crew hiring, route assignments, network stations |
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
- If Tofu Stock runway is low early, recommend Buy Tofu Press; Pack Tofu stays Manual Backup.
- If Counter Service is stock-blocked at managed-shop scale, recommend Supplier Contracts or other
  scalable supply upgrades before manual Pack Tofu.

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
advancing or jumping. When ready orders exist, the bar remains secondary to Counter Service status
and upgrade decisions.

Manual Fulfill Shop Order remains a backup action and requires at least 1 ready order.

### Number Formatting

Player-facing Tofu Shop values should use compact incremental formatting as values grow:

```text
K, M, B, T, Qa, Qi, Sx, Sp, Oc, No, Dc
```

Formatting is display-only. Internal resource values, costs, rewards, and progress state remain
exact. Discrete missing requirements such as Prep Capacity, ready orders, station counts, stamps, and
License Stars round up in disabled reasons. Small live balances may show short decimals when that is
needed to make ticking visible, but long raw decimals should never be exposed.

### Cash And Net Worth Model

Cash and Net Worth V1 are implemented for the shop era. Runtime state still uses the legacy
`shop.tips` field for save compatibility, but player-facing copy treats that balance as Cash.

Definitions:

- Cash is the player's liquid money.
- Tips are early-game flavor for order income. Mechanically, tips become Cash.
- Tofu orders, Counter Service, Catering Crate, and later shop/business payouts earn Cash.
- Shop upgrades, Supplier/Manager decisions, future car parts, and future businesses spend Cash.
- Net Worth is the long-term score toward the `$1T Net Worth` goal.
- Net Worth V1 is `Cash + Tofu Business Value + Garage Build Value + Brand Value`.

Preferred future reward copy:

```text
+$10 Cash from tips
Counter Service: Simple Tofu Box complete · +$10
```

Avoid:

- separate `Tips` and `$` balances
- `1T shares` as the main goal
- real investing or stock-market framing unless it is clearly fictional

Current V1 accounting:

```text
Net Worth V1 =
  Cash
  + Tofu Business Value
  + Garage Build Value
  + Brand Value
```

`Tofu Business Value` is a simple deterministic shop estimate based on owned stations, purchased
upgrades, supplier/manager systems, shop level/reputation, and earning power after the shop has
earned money. It exists to make Cash spending feel like investment, not like lost progress.
`Garage Build Value` is the player-facing V1 label for careful covered-build work. It is
story/status/showcase value, not speed or real-world performance. Internally, legacy helpers may
still use `projectCarValueV1`. In V1, Wheels can raise it to `$150K`, Exhaust Fitted raises the
combined project to `$275K`, Sealed Joints raises it to `$475K`, Tuned Note raises it to `$825K`,
Heat Wrapped raises it to `$1.475M`, and Showcase Finish raises it to `$2.725M`.

Future full accounting:

```text
Net Worth =
  Cash
  + Business Value
  + Car Asset Value
  + Garage Value
  + future company value
  - liabilities
```

The $1T goal does not increase. The player's progress toward `$1T Net Worth` increases.

Core investment tradeoff:

```text
Cash helps reach $1T directly.
Spending Cash delays liquid progress.
But spending Cash on assets can unlock higher earning paths.
```

Examples:

- Shop upgrades reduce Cash but increase Business Value and income.
- First Dream Build Investment Purchase V1 lets the player buy Wheels for `$50K Cash` after the
  covered-car teaser. It subtracts Cash and starts `$25K Garage Build Value`; it does not create a
  full car-part inventory, Dream Garage tab, resale, depreciation, or liabilities.
- Exhaust Purchase + Work Level V1 proves the second part track with Exhaust Fitted, Sealed
  Joints, Tuned Note, Heat Wrapped, and Showcase Finish. Future car parts reduce Cash but may
  increase Car Asset Value and unlock future opportunities.
- Dream Build Tab V1 appears after the build starts and holds detailed car work, Garage Build
  Value, Dream Build Progress, and Builder Note content outside the glance-first Overview.
- Tofu Garage now has a canonical standalone tuning catalog in
  `TOFU_GARAGE_TUNING_CATALOG.md`. It is source material for future Dream Build tracks and uses
  authentic tuner vocabulary as fictional game language, not real installation advice.
- Suspension Track Completion V1 proves the third part track after Exhaust Level 5. Suspension
  levels 1-5 cost Cash, add Garage Build Value, and are fictional garage/story value, not speed or
  real-world vehicle advice.
- Tires & Rubber Track V1 and Brakes & Control Track V1 extend the standalone garage build after
  Suspension Level 5. Tires levels 1-5 add `+$505M Garage Build Value`; Brakes levels 1-5 add
  `+$4.05B Garage Build Value`. They are fictional garage/event-fit upgrades and do not affect
  Don't Spill the Cup scoring, certification, route proof, or Driver XP.
- Induction & Cooling Track V1 unlocks after Brakes & Control Level 5 plus Local Showcase
  completion. Levels 1-5 add `+$35.25B Garage Build Value`, advance Core Build Progress to
  `28 / 40`, and use authentic intercooler, boost control, turbo, anti-lag, and cooling-package
  language as fictional Tofu Garage progression only.
- Drivetrain & Transmission Track V1 unlocks after Induction & Cooling Level 5. Levels 1-5 add
  `+$300B Garage Build Value`, advance Core Build Progress to `33 / 40`, and use authentic clutch,
  limited-slip differential, driveshaft, gearbox, and sequential-transmission language as fictional
  Tofu Garage progression only.
- Aero, Styling & Weight Reduction Track V1 unlocks after Drivetrain & Transmission Level 5.
  Levels 1-5 add `+$2.1T Garage Build Value`, advance Core Build Progress to `38 / 40`, and use
  authentic splitter, diffuser, wing, wide body, weight-reduction, carbon-panel, and roll-cage
  language as fictional Tofu Garage progression only.
- Garage Event Board V1 is the first parked event bridge after Tires & Rubber Level 5 and `$100M`
  Net Worth. It lives in the Dream Build tab, resolves events instantly in V1, and grants defined
  local Cash, Brand Value, Garage Reputation, and local badge rewards. It does not create repeatable
  event-board timers, multiple cars, auctions, collector-sale offers, or networked/social play.
- Car Management V1 unlocks after First Complete Build. It snapshots the first completed car and
  adds one active parked assignment at a time: Showcase Rotation, Sponsor Demo Day, and
  Closed-Course Exhibition Booking. Assignment entry costs and Cash/Brand Value rewards are based
  on the car value at completion; Garage Reputation rewards unlock later assignments. Rewards are
  local and collected explicitly. Car Management Assignment Explainability V1 makes each assignment
  show a state label, cost, duration, concrete reward preview, net-Cash line, ready-to-collect
  state, first-loop checklist, and compact recent history.
- Second Car Project / Second Bay V1 unlocks after the first Car Management loop is complete and
  Garage Reputation reaches `250`. It treats Garage Reputation as spendable for this expansion:
  opening Second Bay costs `$500B Cash + 250 Garage Reputation`, and acquiring the Second Project
  Car costs `$1T Cash + 500 Garage Reputation`. Acquisition adds `+$750B Garage Build Value` through
  the existing Garage Build Value component; Net Worth remains Cash + Tofu Business Value + Garage
  Build Value + Brand Value. The first completed car remains the only managed assignment car.
- Core Build Progress V2 summarizes current build completion as work stages. The planned core
  build size is 40 stages. Current implemented stages are Wheels levels 1-3, Exhaust levels 1-5,
  Suspension levels 1-5, Tires levels 1-5, Brakes levels 1-5, Induction levels 1-5, Drivetrain
  levels 1-5, Aero levels 1-5, Final Detail, and Shakedown Complete.
- A finished project car may unlock sponsors, showcases, a tuning shop, or a car company.
- Keeping a car may increase status and portfolio value.
- Selling a car may convert Car Asset Value back into Cash.
- Some investments may be bad and reduce Net Worth temporarily.

Shares can be reserved for a much later fictional company/founder layer. They are not the main
endgame target.

### High-Scale Performance Guardrails

Current Tofu Garage resources remain scalar JavaScript numbers. At current high-midgame values and
the documented `$1T` future target, native `Number` is sufficient; the immediate performance risks
are repeated formatting, unnecessary DOM rewrites, hidden-surface rendering, offline catch-up shape,
and unbounded backlog/history growth.

Implemented guardrails:

- live shop ticks use a coalesced visible-render path instead of rebuilding every app surface
- unchanged top-counter text is not rewritten
- offline progress uses aggregate elapsed-time math and respects the offline cap
- Delivery Orders have a queue cap so waiting orders cannot grow forever into meaningless UI noise
- a full order queue pauses further order prep and points Next Best Action toward Counter Service
  or bulk handoff work
- ledger/history and inline feedback stay capped and compact

Future absurd endgame values may require a `GameAmount` adapter with mantissa/exponent operations or
a deliberate decimal-library migration. That is deferred until the economy actually needs values
beyond normal JavaScript number readability/precision.

### Prep Capacity

Prep Capacity is the recovering expansion pool for station purchases. It is not the same thing as
ready Delivery Orders and should not be shown as a confusing `0/234` style order counter.

Player-facing rules:

- use `Prep Capacity`, not `Prep Slots`, in current UI
- show the available amount and max capacity only where useful for station buying
- disabled station buttons should say what capacity is missing
- Overview should prioritize ready orders and Prep Counter progress; Production owns the station
  capacity explanation

### Overview Glance Mode

Overview Glance Mode V1 is implemented as the compact Overview guidance layer. It replaces the
single overloaded milestone presentation and visible explanation wall with three lanes:

- Now: the live bottleneck or next click, using the existing Next Best Action logic.
- Pinned Goal: a stable medium-term target such as the next implemented Dream Build work,
  Showcase/Sponsor opportunity, manager/supplier target, or an explicit current build-track cap.
- Era Goal: the long-term Net Worth or shop horizon, such as `$100M Net Worth`.

The Pinned Goal should update when a meaningful milestone completes, not because Cash crosses
an affordability threshold, the order queue briefly fills, or ETA text changes. After Exhaust Level
5, it may point through the implemented Suspension track. After Suspension Level 5, it points
through Tires & Rubber. After Tires Level 5, it can point to the Garage Event Board when an event
is available, otherwise through Brakes & Control. After Brakes Level 5 and Local Showcase are
complete, it points through Induction & Cooling. After Induction Level 5, it points through
Drivetrain & Transmission. After Drivetrain Level 5, it points through Aero, Styling & Weight
Reduction. After Aero Level 5, it points through Final Detail and Shakedown Complete. After the
first complete build, it points through Car Management assignment states: available, active,
ready to collect, and first-car-managed.

Action Choice Board V1 adds a compact choice layer under Goal Stack. It may show Cash Conversion,
the current Dream Build work, and Recent Activity, but it should stay capped at three stable cards.
It is not a replacement for the tab surfaces. Dream Build active work cards should show concrete
Cash progress, missing Cash, and ETA only when current shop income makes that ETA meaningful.
Dream Build should not inherit shop/offline footer logs; those belong in Overview/Ledger.

Build Choice Preview is a readability bridge only. It names the focused current path, next track,
and later tracks. A future balance pass should consider parallel build-track choice between grip,
control, power, and style paths after the current focused path has been playtested.

Overview details should be progressive-disclosure by default. Long stock/order explanations, Net
Worth formulas, Garage Build formulas, optional boost explanations, and saved Builder Note editing
controls belong behind Details/Edit controls or in the relevant tab. Counter Service should show a
single relevant Start or Pause action. Return summaries should be compact and show at most two
suggested next actions before sending deeper history to Ledger.

The older Next Milestone helper remains useful as the era/horizon source and for early milestones.
It still shows one relevant shop goal at a time, not the full roadmap.

Implemented target order:

1. First Cash Earned.
2. First Shop Order.
3. First Upgrade Purchased.
4. First 10 Orders.
5. First Family Tofu Tray.
6. First $100 Cash.
7. Delivery Shelf unlock.
8. Shop Sign unlock.
9. Counter Service upgrade goals after early momentum.
10. Managed Shop goals such as Second Register, Pickup Window, Counter Crew, and Catering Crate when
   early milestones are complete.

Rules:

- one visible milestone at a time
- no full future roadmap
- no advanced tab unlock from raw idle accumulation alone
- milestone changes should follow meaningful actions, stamps, or bottlenecks
- visible locked goals are allowed only when they clarify the next phase; they should not become
  clickable advanced tabs during the first loop
- the optional Net Worth V1 line may appear only after later shop milestones such as Manager Desk,
  Shop Level 100, or the Covered Car teaser
- after the Covered Car teaser is seen or a high-progress save qualifies for it, the bar may point
  to `Save for Wheels` when no urgent shop bottleneck or useful shop purchase is more important.
  If Cash is already at `$50K`, it may show `Buy Wheels`. After Wheels are purchased, it may show
  Wheels work levels. After Wheels level 3, it may show `Save for Exhaust`, `Buy Exhaust`,
  `Seal Joints`, `Tuned Note`, `Heat Wrapped`, or `Showcase Finish` when no urgent shop goal is
  more useful. After Exhaust level 5, it may point through Suspension, Tires & Rubber, Brakes &
  Control, Induction & Cooling, Drivetrain & Transmission, Aero, Styling & Weight Reduction, Final
  Detail, and Shakedown Complete. After the first complete build, it may point through Car
  Management assignment availability, active assignments, ready-to-collect rewards, and first-car
  managed status.
- no full asset valuation, car valuation, company valuation, or social system is implemented by
  this bar
- current status: Implemented V1

### Counter Service V1

Counter Service is the starter automation layer. It is available immediately and runs by default on
fresh saves, because Tofu Garage should begin as idle management rather than a clicker.

V1 behavior:

- parked/shop only; it never runs during an active Cup Test
- active-page only; it does not auto-fulfill during offline progress
- default priority is `Best Available`: Festival Bento, then Family Tofu Tray, then Simple Tofu Box
  when each order type is unlocked and affordable
- rate is 1 automated handoff every 10 seconds before upgrades
- Overview shows a Counter Service income/status line: `+$X/min when supplied`, or a clear
  waiting state for missing Tofu Stock or ready orders
- it consumes the same ready Delivery Orders and Tofu Stock as manual fulfillment
- it grants the same Cash, Reputation, and Shop XP as manual fulfillment
- feedback is inline and ledger entries are batched/rate-limited so automation does not spam
  result screens or fanfares
- V1 finite upgrades improve handoff interval: Order Bell `10s -> 8s`, Wider Counter `8s -> 6s`,
  and Pickup Routine `6s -> 4s`
- Managed Shop V1 adds finite bulk upgrades: Second Register makes each handoff process 2 orders,
  Pickup Window raises the batch to 5, and Counter Crew raises the batch to 10 when supplied
- future upgrades may add stock reserves and priority tuning, but those are not in V1

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
  future sinks only after Cash income and shop automation are fun locally.
- Prestige should remain a visible later goal, not an early tab. License Exam belongs after a real
  shop plateau.
- Avoid expanding social/status, premium cosmetics, and endgame valuation before the local shop loop
  has repeatable motivation.

### Tofu Garage V1 Completion Gate

`TOFU_GARAGE_V1_COMPLETION_AUDIT.md` is the current readiness gate before the car phase. Its verdict
is that Tofu Garage V1 is close enough to move toward a parked Covered Car / Dream Build teaser,
but not full car building.

Covered Car / Dream Build Teaser V1 is now implemented. It should still be playtested against:

- fresh 3-minute flow works without manual Pack Tofu or manual fulfillment
- first upgrade is reachable through idle play
- returning-player suggestions remain useful
- high-progress saves remain responsive
- Manager Desk and Wholesale Pickup provide a clear late-V1 goal
- Shop Spirit is either useful as emergency utility or de-emphasized
- hidden route, crew, garage, full valuation, and social systems do not appear as active mechanics

The implemented teaser transition happens after the shop feels managed: Counter Crew exists, Manager
Desk has been reached, Wholesale Pickup progress exists, and sustained shop growth has happened. The
teaser is story and aspiration only; car parts, full asset valuation, and garage events remain
separate future slices.

Current station-milestone scope:

Station Milestone Boosts V1 is implemented as the smallest ownership-threshold layer: 5/10 Tofu
Presses, 5/10 Prep Counters, 5/10 Delivery Shelves, and 5/10 Shop Signs. Each uses inline feedback,
shows one clear production/support bump, and remains shop-only with no Cup Test scoring effect.
Higher thresholds such as 25+ owned stations remain future tuning candidates.

### Managed Shop Phase V1

Managed Shop Phase V1 is the first post-automation shop layer. It is still Tofu Shop, not Dream
Garage, franchise mode, Net Worth, or route expansion.

Implemented scope:

- Counter Service bulk handoff upgrades after Pickup Routine: Second Register, Pickup Window, and
  Counter Crew
- Counter Service Cash/min estimates include interval and batch size only when supplied
- Catering Crate as a midgame order sink after 100 fulfilled orders, 250 Reputation, and Shop
  Level 25
- Manager Desk V1 after Counter Crew, Catering Crate, Shop Level 100, and 1M Reputation
- Hire Shift Manager increases Counter Service batch size from 10 to 25 when supplied
- Wholesale Pickup consumes capped waiting-order batches when the queue is effectively full and
  Tofu Stock is supplied; it is active-page-only and uses scalar resource math
- Next Milestone and Next Best Action can point toward bulk handoff upgrades or the larger order
  when Ready Orders pile up, then Manager Desk goals when the current managed-shop layer is maxed

Design rules:

- bulk handoffs solve repeated fulfillment pressure without adding a new tab
- Wholesale Pickup exists to turn a full capped order queue into a managed-business decision, not a
  larger backlog or a per-order object list
- Tofu Stock remains a meaningful bottleneck; early stock pressure should point to Tofu Press first,
  with Pack Tofu as Manual Backup, and managed-shop stock blocks should point to Supplier Contracts
  or other scalable supply upgrades before manual packing
- maxed upgrades show `Maxed`, current effect, and no buy button/cost/no-op before-after preview
- route-related upgrades remain hidden or locked until route systems are meaningful
- bulk buying is a quality-of-life layer, not progression expansion. `Buy Cheapest` and `Buy All`
  should buy only visible, unlocked, meaningful, non-maxed station or upgrade items. Bulk buying
  must ignore hidden/future systems, route scaffolding, and decorative placeholders.
- affordability progress should show the limiting resource and a compact ETA only when the relevant
  income rate is positive. If income is blocked, show the blocker instead of a fake timer.
- offline return summaries may show up to three suggested next actions, prioritizing management
  decisions such as a useful bulk buy, Counter Service, Supplier Contracts, or queue clearing over
  Manual Backup.

### Order Size Ladder

Raw Tofu Stock must not directly multiply Cash. Instead, stock matters because larger order types
require more tofu and pay better rewards.

| Order Type | Unlock | Tofu Required | Delivery Orders Required | Cash | Reputation | Shop XP | Purpose | Expected First Use | Status |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| Simple Tofu Box | available immediately | 6 | 1 | 10 | 1 | 8 | tutorial order; teaches that orders become Cash and stock is a real input | 0:00 | Implemented |
| Family Tofu Tray | after 5 fulfilled orders or Shop Level 2 | 24 | 1 | 45 | 3 | 24 | first moment extra Tofu Stock matters | 5 to 10 minutes | Implemented |
| Festival Bento | after 25 fulfilled orders or 50 Reputation | 75 | 2 | 130 | 8 | 70 | first big payout and first multi-order sink | 20 to 40 minutes | Implemented |
| Catering Crate | after 100 fulfilled orders, 250 Reputation, and Shop Level 25 | 240 | 5 | 520 | 25 | 260 | mid-game stock and Ready Order sink | Midgame managed shop | Implemented |
| Neighborhood Bundle | after first fictional route progress | 90 | 8 | 850 | 35 | 320 | connects shop orders to the route/network phase | First day or later | Future |
| Regional Tofu Order | after first License Exam or Regional Tofu Network preview | 250 | 20 | 3000 | 120 | 1100 | late-game stock sink and prestige runway test | Post-License | Future |

Order UI contract:

- show available order types as cards in Overview
- show tofu cost, ready-order cost, Cash/Reputation/Shop XP preview, unlock condition, and disabled
  reason
- reveal Catering Crate only when the managed shop needs a larger stock/order sink
- if Manual Backup is opened, label manual fulfill actions with the order type and keep them
  secondary to Counter Service
- if no order type is specified for a backup/manual fulfill call, use the best currently fulfillable
  order type

Order design rules:

- larger orders are not automatic multipliers; they are separate decisions with stock and ready-order
  requirements
- the player should see why a larger order is unavailable: not enough Tofu Stock, not enough ready
  Delivery Orders, or not unlocked yet
- larger order cards should appear only when they are close enough to matter
- the first larger order should make a stocked pantry feel useful, not punish the player for having
  stock
- if a larger order is unlocked but stock is low early, the Next Best Action can point to Tofu Press
  because the player now understands why stock matters; Pack Tofu remains Manual Backup
- if larger orders and Counter Service are already scaled, the Next Best Action should prefer
  Supplier Contracts or other supply upgrades over manual stock clicking

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
| 3 | Delivery Shelf | Prep Counter throughput/order handling | Cash, Prep Capacity | makes the order pipeline scale without click spam | 10 to 20 minutes | buy support when counters become cramped |
| 4 | Shop Sign | Reputation gains and Regular Customer unlock pressure | Cash, Prep Capacity | shifts focus from pure Cash to shop visibility | 20 to 40 minutes | invest when the next system is reputation-gated |
| 5 | Counter Service | order handoff automation | ready Delivery Orders and Tofu Stock reserves | makes the shop idle-first from the first session, then scales through earned upgrades | immediately, with upgrades after early milestones | start/pause automation while preserving backup manual control |
| 6 | Regular Customers | passive Cash from simple orders | Delivery Orders if available | reduces manual money conversion chores beyond handoff automation | 30 to 60+ minutes | choose passive income versus more raw production |
| 7 | Shop Street / Fictional Route Cards | Cash, Reputation, Shop Reach, Route Knowledge, stamps | Tofu Stock, Delivery Orders | future/deferred: adds story goals and mastery without real roads | After route design is reintroduced | spend resources on route cards or keep scaling shop |
| 8 | Apprentice Driver | automated fictional route/shop task output | Delivery Orders, route slots | removes chores after the player understands them | 1 to 2 hours | assign limited crew to the best fictional task |
| 9 | Dispatcher Desk | automation efficiency and crew assignment clarity | Cash, Prep Capacity | makes automation legible and scalable | 2 to 4 hours | invest in coordination instead of raw stations |
| 10 | Regional Tofu Network | broad lower-tier multipliers and prestige requirements | high Cash, Shop Reach, License progress | late-game scale and prestige pressure | after first License Exam | build a network or prepare for the next exam |

Each tier should make earlier tiers more valuable:

- Prep Counter makes Tofu Press matter.
- Larger orders make both Tofu Press and Prep Counter matter.
- Delivery Shelf makes Prep Counter scaling feel smooth.
- Shop Sign makes Reputation and later systems visible.
- Counter Service makes order fulfillment automatic from the start, while manual fulfillment remains
  an emergency backup rather than a forever-click.
- Regular Customers later make order production useful even while idle.
- Fictional routes turn shop resources into story, reach, and mastery.
- Apprentice Driver and Dispatcher Desk automate repeated fictional tasks after they are understood.
- Regional Tofu Network turns a matured shop into a prestige-scale economy.

## 4. First 10 Minutes

The first 10 minutes should prove the one-loop game. Fresh players should not see every advanced
system.

Starter diagnosis after the idle-first pass: 10 starting Tofu Stock was too low for a 6-stock
Simple Tofu Box, because the first automatic handoff could leave the counter stock-blocked before
Cash reached the first useful $20-$29 purchase. The implemented opener now starts with a 24-stock
buffer, 1 ready Delivery Order, 1 Tofu Press, 1 Prep Counter, and running Counter Service. Target
timing is first automatic pickup in 10-30 seconds, first useful upgrade affordability in 30-90
seconds, and at least three automatic Simple Tofu Box completions without Pack Tofu or manual
fulfillment. Tofu Stock should become a real bottleneck after the opening, not a blocker before the
first upgrade.

| Time Window | Player Goal | Visible Resources | Visible Active Buttons | Visible Disabled Buttons | Hidden Systems | Intended Bottleneck | Next Best Action Text | Expected Reward | Expected Unlock / Story Beat |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0:00 to 0:30 | Understand that the shop runs itself | Tofu Stock, Delivery Orders, Cash, Reputation, Shop XP | Watch Counter Service; Take the Cup Test as secondary | Buy Tofu Press if shown but unaffordable | Routes, Crew, Garage, Shop Spirit, Rivals, License, deep Passport, character/sound economy | Waiting for first automatic handoff | `Watch the first order complete` | +Cash, +Reputation, +Shop XP | `The first order leaves the counter.` |
| 0:30 to 1:00 | See automatic payout and stay in the shop | Cash, Reputation, Shop XP, Tofu Stock, ready/preparing orders | Buy first useful station/upgrade if affordable | Tidy Packaging if the Prep Counter bottleneck is visible but not affordable | Advanced panels remain hidden | Need Cash or waiting for next order | `Buy Tofu Press`, `Buy Tidy Packaging`, or `Wait for Prep Counter` | Inline shop-order feedback | First Shop Order stamp should appear or be teased |
| 1:00 to 2:00 | Learn that Prep Counter rebuilds orders | Tofu Stock, Ready Orders, Next Order progress, Cash | Buy Tidy Packaging if affordable; Buy Tofu Press if stock is low; Take the Cup Test secondary | Prep Counter station if close but unaffordable | Routes, Crew, Garage, Spirit, Rivals, License | Either Cash or order preparation | `Buy Tidy Packaging`, `Buy Tofu Press`, or `Wait for Counter Service` | Another automatic payout or progress toward first purchase | `The counter is learning the rhythm.` |
| 2:00 to 3:00 | Make or approach the first meaningful purchase | Cash, Tofu Stock runway, order prep progress | Buy Tidy Packaging if affordable; Buy Prep Counter if affordable; Buy Tofu Press or Steady Pressing only if stock is low | Buy Prep Counter if not affordable | Full Passport, Routes, Crew, Garage, Spirit, License | First purchase cost | `Buy bottleneck-solving improvement` | First order-throughput bump or clear progress toward it | Upgrade card becomes visible only when relevant |
| 3:00 to 5:00 | Understand stock versus throughput | Tofu Stock runway, Ready Orders, Cash, Reputation | Buy Prep Counter if stock is healthy and orders are slow; Buy Tidy Packaging; Buy Tofu Press if stock is low | Steady Pressing if stock is healthy and not relevant | Routes only as subtle teaser if needed; Crew/Garage/Spirit/Rivals/License hidden | Stock runway or order throughput | `Buy Prep Counter`, `Buy Tidy Packaging`, or `Buy Tofu Press` based on bottleneck | Visible `/sec` improvement | Passport teaser after first stamp |
| 5:00 to 10:00 | Own the basic loop and see first collection hook | Tofu Stock, Delivery Orders, Cash, Reputation, Shop XP, first stamp | Buy Counter Service upgrade; Buy Tofu Press; Buy Prep Counter; Buy Tidy Packaging; Buy Steady Pressing when stock is low; View Passport | Better Boxes if close but not unlocked | Routes as teaser only; Crew/Garage/Spirit/Rivals/License hidden | Clear bottleneck-solving upgrade | `Buy the clearest bottleneck-solving upgrade` | First meaningful production bump and stamp feeling | First Passport card; hint that Routes exist later |

By 10 minutes, a normal player should have:

- completed multiple automatic shop order handoffs
- seen Delivery Orders rebuild without refresh
- understood that Tofu Stock feeds Prep Counter
- understood that Counter Service turns Delivery Orders into Cash
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
| 0:00 | Fresh shop has 24 Tofu Stock, 1 ready order, 1 Tofu Press, 1 Prep Counter, and running Counter Service | Simple Tofu Box | Watch Counter Service | none yet | the shop runs by itself |
| 0:30 | First automatic order result shows Cash/Reputation/Shop XP and first story beat | Shop Order Complete | Return to Tofu Garage | need more Cash or next order | the shop woke up |
| 1:00 | Prep Counter progress is visible | ready/preparing order split | Wait for Prep Counter or buy the first bottleneck fix | order prep | the shop works while parked |
| 2:00 | First purchase is close or available | Tidy Packaging / first station choice | Buy bottleneck-solving improvement | Cash | clear progress toward first upgrade |
| 3:00 | Player understands stock runway | Tofu Stock runway copy | Buy Tofu Press if stock is low; otherwise order throughput | stock or throughput | resources have different jobs |
| 5:00 | Multiple orders have been automatically handed off | Family Tofu Tray close or unlocked | Improve Counter Service or Prep Counter | larger order requirements | extra stock has a purpose |
| 10:00 | First loop is proven | Passport teaser and first meaningful upgrade path | Buy Tidy Packaging / View Passport | Cash or order prep | first collection/status hook |
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
| 1. First Loop | 0 to 10 minutes | A small counter starts moving by itself | Tofu Press, Prep Counter, starter Counter Service, first upgrade, first stamp | Overview, Orders, Production basics, maybe Passport teaser | Tofu Stock, Delivery Orders, Cash | Watch Counter Service, Buy Tidy Packaging, Buy Prep Counter, Buy Tofu Press when stock is low, Take Cup Test secondary | Tidy Packaging, Steady Pressing only when stock is low, early station counts | First Shop Order stamp | 1 to 5 minutes | Player understands stock -> orders -> automatic Cash |
| 2. First Shop | 10 to 60 minutes | The counter becomes a shop | Delivery Shelf, Shop Sign, Passport, Ledger light | Overview, Orders, Production, Upgrades, Passport, Ledger | Cash, Reputation, Delivery Orders | Upgrade Counter Service, Buy Delivery Shelf, Buy Shop Sign, View Passport | Tidy Packaging, Double Labels, Better Boxes, Shop Sign | First route teaser, fuller Passport | 5 to 15 minutes | Reputation and shop systems need expansion |
| 3. First Automation | 1 to 6 hours | The shop starts helping itself | Regular Customers, Shop Street, Apprentice preview | Routes, simple Crew preview, Production, Passport | Cash, Reputation, Shop Reach, Route Knowledge | Start Shop Street, Hire Apprentice Driver, Assign Crew preview | Regular Smile, Delivery Shelf upgrades | First route stamp, first apprentice teaser | 10 to 20 minutes | Manual orders feel repetitive and automation is earned |
| 4. First License | 4 to 6 hours | A plateau becomes a choice | License Exam preview, requirements, first perks | License, Passport, Routes, Ledger | Reputation, Stamps, Route Knowledge, fulfilled orders | View License Exam, Take License Exam, Confirm/Cancel | Final pre-exam convenience upgrades | Local Delivery License | 10 to 30 minutes | Requirements met and player chooses prestige |
| 5. Post-License Rebuild | After first License Exam | The early shop rebuilds faster | License Perks, faster starting stations, deeper early flow | Overview, Orders, Production, License, Passport | License Stars, Cash, Tofu Stock, Orders | Buy License Perk, rebuild stations, Fulfill Max | Morning Prep, Labeled Bins, Familiar Counter | Permanent perk identity | 5 to 15 minutes | Player reaches old plateau faster |
| 6. Route Network | Later / deferred | The fictional delivery world opens | More route cards, route mastery, Route Knowledge | Routes, Training, Garage, Passport | Shop Reach, Route Knowledge, Cash | Start Route Card, View Route Details, Buy Route Notebook | Route Familiarity, Careful Notes | District/route stamps | 10 to 30 minutes | Route mastery motivates automation |
| 7. Festival / Spirit Layer | Later | The shop has special rushes | Shop Spirit, Festival Boosts, token inventory | Shop Spirit, Events, Ledger | Shop Spirit, Festival tokens | Buy Tea Kettle, Use Shop Spirit Boost, Use Festival Token | Warmer Kettle, Festival Lanterns | Festival stamps/cosmetics | Short burst sessions | Boost timing becomes meaningful |
| 8. Regional Tofu Network | Late game | A local shop becomes a network | Regional Tofu Network, Dispatcher Desk, broader automation | Network, Crew, License, Routes | Cash, Reputation, Shop Reach, License Stars | Buy Dispatcher Desk, Buy Regional Network, Assign Crew | Network multipliers, crew routines | Late-game route/status rewards | Longer idle sessions | Next prestige or final arc |
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
| fulfill_shop_order | Manual Fulfill Shop Order | Manual Backup / Orders | First Loop | Manual Backup opened | Ready Orders >= 1; parked | Need 1 prepared order. Prep Counter is preparing the next order. | 1 Delivery Order | Grants Cash, Reputation, Shop XP; ledger/result feedback | backup only | Emergency conversion if automation is paused | Manual Backup | Implemented as backup |
| starter_counter_service | Starter Counter Service | Overview | First Loop | Immediately | Ready Orders >= 1 and Tofu Stock for best available order; parked | Waiting for Tofu Stock or ready orders. | order cost by type | +Cash, +Reputation, +Shop XP through batched handoffs | 0:00 | Converts orders into purchase currency automatically | Watch Counter Service | Implemented |
| fulfill_simple_tofu_box | Simple Tofu Box | Orders | First Loop | Immediately | 6 Tofu Stock and 1 ready order | Need 1 prepared order or more Tofu Stock. | 6 Tofu Stock, 1 Delivery Order | +$10, +1 Reputation, +8 Shop XP | 0:00 to 0:30 | Starter money conversion and first stock-pressure lesson | Watch Counter Service | Implemented |
| fulfill_family_tofu_tray | Fulfill Family Tofu Tray | Orders | First Shop | 5 fulfilled orders or Shop Level 2 | 24 Tofu Stock and 1 ready order | Need Family unlock, ready order, or more Tofu Stock. | 24 Tofu Stock, 1 Delivery Order | +$45, +3 Reputation, +24 Shop XP | 5 to 10 minutes | Makes extra Tofu Stock valuable | Fulfill Family Tofu Tray | Implemented |
| fulfill_festival_bento | Fulfill Festival Bento | Orders | First Shop / later | 25 fulfilled orders or 50 Reputation | 75 Tofu Stock and 2 ready orders | Need Festival unlock, 2 ready orders, or more Tofu Stock. | 75 Tofu Stock, 2 Delivery Orders | +$130, +8 Reputation, +70 Shop XP | 20 to 40 minutes | First big payout | Fulfill Festival Bento | Implemented |
| fulfill_catering_crate | Fulfill Catering Crate | Orders | Managed Shop | 100 fulfilled orders, 250 Reputation, Shop Level 25 | Enough Tofu Stock and ready orders | Need 240 Tofu Stock and 5 ready orders. | 240 Tofu Stock, 5 Delivery Orders | +$520, +25 Reputation, +260 Shop XP | Midgame | Mid-game stock and Ready Order sink | Fulfill Catering Crate | Implemented |
| fulfill_10_orders | Fulfill 10 Orders | Overview | First Shop | Ready Orders can exceed 10 | Ready Orders >= 10; parked | Need 10 ready Delivery Orders. | 10 Delivery Orders | Grants 10x order rewards inline | 10 to 20 minutes | Reduces repeated order clicks | Fulfill 10 Orders | Implemented, reveal timing pending |
| fulfill_max_simple_orders | Fulfill Max Simple Orders | Orders | First Loop / First Shop | Multiple Simple Tofu Boxes can be fulfilled and larger orders are not the best option | Enough Tofu Stock and ready orders for at least 2 Simple Tofu Boxes | Need more Tofu Stock or ready Delivery Orders. | max affordable Simple Tofu Boxes | Converts simple orders into Cash/Reputation/Shop XP | 5 to 10 minutes | Avoids repeated tutorial-order clicks | Fulfill Max Simple Orders | Implemented |
| fulfill_max_best_order | Fulfill Max Best Order | Orders | First Shop | Larger order type is unlocked and affordable | Enough Tofu Stock and ready orders for at least 1 best order type | Need more Tofu Stock or ready Delivery Orders. | max affordable best order type | Converts stock/order stockpile into strongest available payout | 5 to 20 minutes | Makes extra stock useful | Fulfill Max `<Order Type>` | Implemented |
| fulfill_max_orders | Fulfill Max `<Order Type>` | Orders | First Shop | More than one selected/best order can be fulfilled | Enough Tofu Stock and ready orders for at least 2 of that type | Need more Tofu Stock or ready Delivery Orders. | max affordable typed orders | Converts all affordable typed orders into rewards | 5 to 10 minutes | Avoids click spam | Fulfill Max `<Order Type>` | Implemented |
| buy_tofu_press | Buy Tofu Press | Production | First Loop | Production basics visible | Enough Cash; Prep Capacity available | Need more Cash. Let Counter Service earn Cash. | Cash, station growth | Adds Tofu Stock/sec | 1 to 3 minutes if stock is low | Low Tofu Stock runway | Buy Tofu Press | Implemented |
| buy_max_tofu_press | Buy Max Tofu Press | Production | First Shop | Buy Tofu Press visible; multiplier relevant | Can afford at least 1 press | Need more Cash. | max affordable Cash/Prep Capacity | Buys multiple presses | 10 to 20 minutes | Avoids repetitive station buying | Buy Max Tofu Press | Implemented |
| buy_prep_counter | Buy Prep Counter | Production | First Loop | Production basics visible | Enough Cash; Prep Capacity available | Need more Cash or Prep Capacity. Let Counter Service earn Cash. | Cash plus Prep Capacity | Adds Delivery Orders/sec and Tofu Stock consumption | 3 to 6 minutes when orders are slow | Order throughput | Buy Prep Counter | Implemented |
| buy_max_prep_counter | Buy Max Prep Counter | Production | First Shop | Buy Prep Counter visible; multiplier relevant | Can afford at least 1 counter | Need more Cash or Prep Capacity. | max affordable Cash/Prep Capacity | Buys multiple counters | 15 to 30 minutes | Avoids repetitive station buying | Buy Max Prep Counter | Implemented |
| buy_steady_pressing | Buy Steady Pressing | Upgrades | First Loop | Stock runway is low or extra Tofu Presses make stock growth relevant | Enough Cash | Need $20. Let Counter Service earn Cash. | $20 target | Tofu Press output x1.5 | 1 to 5 minutes when stock is low | Slow stock rebuild | Buy Steady Pressing | Implemented |
| buy_double_mold | Buy Double Mold | Upgrades | First Shop | Own 3 Tofu Presses | Enough Cash | Need $40. | $40 target | Tofu Press output x2 | 5 to 10 minutes | First production plateau | Buy Double Mold | Implemented, target tuning pending |
| buy_tidy_packaging | Buy Tidy Packaging | Upgrades | First Loop | First order complete and Prep Counter/order throughput is the bottleneck | Enough Cash | Need $20. Fulfill prepared orders first. | $20 target | Prep Counter output x1.5 | 1 to 3 minutes | Slow order prep | Buy Tidy Packaging | Implemented |
| buy_double_labels | Buy Double Labels | Upgrades | First Shop | Own 2 Prep Counters | Enough Cash | Need $120. | $120 target | Prep Counter output x2 | 10 to 20 minutes | Order throughput plateau | Buy Double Labels | Implemented, target tuning pending |
| view_passport | View Passport | Passport | First Loop / First Shop | First stamp earned or teaser unlocked | Passport is discovered | Earn a stamp-worthy shop moment first. | none | Opens stamp/status collection | 5 to 10 minutes | Collection curiosity | View Passport | Partial |
| visit_tofu_garage | Visit Tofu Garage | Cup Test result | Cup-first discovery | Cup Test result screen shown and player is parked | Always | none | none | Returns to the Tofu Garage action area | After a Cup Test result | Helps Cup-first players find the parked shop loop | Visit Tofu Garage | Implemented |
| take_cup_test | Take Don't Spill the Cup | Shop/Cup Test | Always secondary from shop | Always visible as optional boost path | Parked; setup/safety complete for start | Complete the safety checklist before starting. | none | Starts optional smooth-driving challenge | Any time | Certified boost/status path | Take the Cup Test | Implemented |
| buy_delivery_shelf | Buy Delivery Shelf | Production | First Shop | 10 fulfilled orders, First Family Tofu Tray, or upgrade/level milestone | Enough Cash/Prep Capacity | Unlocks after the core order loop is established. | $90 runtime V1; $800 target later | Boosts Prep Counter throughput | 10 to 20 minutes | Scaling order flow | Buy Delivery Shelf | V1 implemented |
| buy_shop_sign | Buy Shop Sign | Production | First Shop | 10 Reputation, 100 lifetime Cash, or Delivery Shelf owned | Enough Cash | Need Reputation, Cash, or Delivery Shelf. | $140 runtime V1; $300 target later | Boosts Reputation gain from orders | 20 to 40 minutes | Reputation unlock pressure | Buy Shop Sign | V1 implemented |
| buy_better_boxes | Buy Better Boxes | Upgrades | First Shop | 15 fulfilled orders or Cash income plateau | Enough Cash | Unlocks after 15 fulfilled orders. | $200 target | +25% Cash per order | 15 to 30 minutes | Cash income plateau | Buy Better Boxes | Partial |
| buy_regular_smile | Buy Regular Smile | Upgrades | First Automation | Regular Customers visible | Enough Cash | Unlocks after stable shop production. | $500 target | small passive Cash/sec | 30 to 60 minutes | Manual order conversion chores | Buy Regular Smile | Future |
| start_shop_street | Start Shop Street | Routes | First Automation | First fictional route discovered | Enough Tofu Stock and Delivery Orders | Build Reputation or Shop Reach to unlock fictional route cards. | Tofu Stock and Delivery Orders | Grants Cash, Reputation, Route Knowledge, Shop Reach, route stamp chance | 40 to 90 minutes | New mid-game goal | Start Shop Street | Placeholder |
| hire_apprentice_driver | Hire Apprentice Driver | Crew | First Automation | First route progress exists | Enough Cash/Prep Capacity | Unlocks after route progress. | Cash plus Prep Capacity | Begins fictional automation path | 1 to 2 hours | Manual route/order chores | Hire Apprentice Driver | Placeholder |
| assign_crew | Assign Crew | Crew | First Automation | Crew member hired | Route/crew slot available | Hire crew first. | Delivery Orders or route slot | Assigns fictional automation | 1 to 2 hours | Repeated route handling | Assign Crew | Placeholder |
| buy_tea_kettle | Buy Tea Kettle | Shop Spirit | Festival / Spirit | Stable production; Spirit layer unlocked | Enough Cash/Prep Capacity | Need Cash. | Cash plus Prep Capacity | Generates Shop Spirit/sec | Later | Boost energy generation | Buy Tea Kettle | Placeholder |
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
| Tofu Press | Makes Tofu Stock | First Loop, immediately | $15 target after starter press | 1.15 | Tofu Stock | none | 0.10 stock/sec target; current runtime may differ | owned count * multipliers | Low Tofu Stock runway | When stock supports 10+ future orders | Steady Pressing, Double Mold |
| Prep Counter | Turns Tofu Stock into Delivery Orders | First Loop, immediately | $50 target; current runtime may differ | 1.16 | Delivery Orders | 2 Tofu Stock/order | 0.025 orders/sec | owned count * multipliers, limited by stock | Slow order prep | When ready orders accumulate faster than player spends them | Tidy Packaging, Double Labels |
| Delivery Shelf | Supports order throughput/capacity | First Shop, 10 to 20 minutes | $800 target | 1.17 | Prep Counter support or order capacity | Cash/Prep Capacity | boost only | multiplicative support | Order flow scaling | When order throughput is no longer the limiter | Neat Handoff, Double Stack |
| Shop Sign | Reputation unlock engine | First Shop, 20 to 40 minutes | $300 target | 1.18 | Reputation modifier or small passive reputation | Cash/Prep Capacity | small reputation effect | multiplier or flat boost | Low Reputation | When next systems are no longer reputation-gated | Brighter Sign, Word of Mouth |
| Regular Customers | First passive Cash | First Automation, 30 to 60+ minutes | $500 target | 1.20 | Cash/sec | Delivery Orders slowly, if available | small Cash/sec | owned count * loyalty multipliers | Too much manual order fulfillment | When passive Cash meets baseline costs | Loyalty Card, Bring a Friend, Regular Smile |
| Shop Street Route | First fictional route card | First Automation, 40 to 90 minutes | route cost, not station cost | 1.0 or route mastery curve | Cash, Reputation, Route Knowledge, Shop Reach, stamps | Tofu Stock and Delivery Orders | instant or timed route reward | mastery improves reward/stability | Need new goals after shop loop | When mastered and auto-eligible | Route Familiarity, Careful Notes |
| Apprentice Driver | First automation | First Automation, 1 to 2 hours | Cash plus Prep Capacity | 1.25 | automated fictional route/order rewards | Delivery Orders, route slots | slow automation | crew count * assignment rules | Repeated manual chores | When Dispatcher handles routing | Better Clipboard, Team Routine |
| Dispatcher Desk | Automation management | Later, 2 to 4 hours | $900 target | 1.26 | route assignment efficiency | Cash/Prep Capacity | automation modifier | global automation multiplier | Too many manual assignments | When network automation dominates | Dispatcher Routine |
| Regional Tofu Network | Late-game scale | After first License Exam | $2400 target or later | 1.32 | broad production multiplier | Cash/Prep Capacity | global boost | broad multiplier | Late-game scaling | Never urgent early; hidden first session | Network Notes, Regional Counter |

### Generator / Station Detail Cards

These are design cards, not proof of runtime completeness. A station is a thing the player owns more
of. An upgrade is a named modifier that changes a station. UI should not use one label for both.

#### Tofu Press

- Stable id: `tofu_press`
- Label: `Tofu Press`
- Unlock condition: visible immediately; fresh shop starts with 1
- Starting cost: $15 target for the first extra press
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
- Starting cost: $50 target for the first extra counter
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
- Starting cost: $800 target
- Cost growth: 1.17 target
- Produces: no primary resource by itself; boosts order handling and Prep Counter support
- Consumes: Cash and possibly Prep Capacity to buy
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
- Starting cost: $300 target
- Cost growth: 1.18 target
- Produces: Reputation modifier or small passive Reputation
- Consumes: Cash and possibly Prep Capacity to buy
- Base production rate: each owned Shop Sign boosts Reputation from fulfilled orders by 10%;
  sign upgrades can add more Reputation multiplier later.
- Milestone thresholds: owned 5, 10, 25
- Associated upgrades: Brighter Sign, Word of Mouth
- Urgent when: next system is Reputation-gated
- Less urgent when: Reputation is ahead of unlock needs
- Expected first purchase: 20 to 40 minutes
- V1 runtime behavior: unlocks when Reputation reaches 10, lifetime Cash reaches 100, or Delivery
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
- Priority: Best Available, ordered from the largest unlocked supplied contract order down through
  Catering Crate, Festival Bento, Family Tofu Tray, and Simple Tofu Box
- Milestone thresholds: Order Bell after unlock, Wider Counter after Order Bell and 20 fulfilled
  orders, Pickup Routine after Wider Counter and First Family Tofu Tray, Second Register after
  Pickup Routine and 25 fulfilled orders, Pickup Window after Second Register and 100 fulfilled
  orders, and Counter Crew after Pickup Window plus 1K fulfilled orders or strong Reputation
- Associated upgrades: Order Bell, Wider Counter, Pickup Routine, Second Register, Pickup Window,
  Counter Crew, Manager Desk, and High-Scale Counter Contracts; future stock reserve and priority
  tuning remain documented only
- Urgent when: prepared orders are ready or the starter shop needs a visible automatic handoff
- Less urgent when: the player is solving a stock/prep bottleneck before the next handoff can run
- Expected first use: immediately on a fresh save
- V1 runtime behavior: starts running on fresh saves, can be started/paused from Overview, runs only while parked and
  the page is open, shows income or blocked-state copy, and never auto-fulfills offline
- Status: V1 implemented / needs playtest tuning

#### High-Scale Counter Contracts

- Stable ids: `wholesale_counter_contract`, `catering_account`, `event_vendor_contract`
- Labels: `Wholesale Counter Contract`, `Catering Account`, `Event Vendor Contract`
- Unlock condition: Manager Desk / Shift Manager scale and Counter Service batch 25 for the first
  contract, then each prior contract
- Costs: `$250K + 5M Reputation`, `$2.5M + 12M Reputation`, `$25M + 35M Reputation`
- Produces: larger Counter Service batch floors and larger order types
- Batch floors: 100, 250, 1000
- Order types: Wholesale Case, Event Catering Load, Venue Supply Contract
- Urgent when: Tofu Stock and ready orders are ahead, Reputation is high, Cash is low, and Counter
  Service batch 25 is the Cash conversion bottleneck
- Less urgent when: the shop is stock-blocked, order-prep-blocked, or Reputation is below the
  contract cost
- V1 runtime behavior: parked-only contract purchases, aggregate high-scale handoffs, no offline
  auto-fulfillment, and no Cup Test scoring/certification/Driver XP/merch/formula effects
- Status: V1 implemented / needs late-game pacing playtest

#### Regular Customers

- Stable id: `regular_customer`
- Label: `Regular Customers`
- Unlock condition: stable order production and Shop Sign progress after the manual loop becomes
  repetitive
- Starting cost: $500 target
- Cost growth: 1.20 target
- Produces: passive Cash
- Consumes: Delivery Orders slowly when available
- Base production rate: small Cash/sec target, limited by orders
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
- Produces: Cash, Reputation, Route Knowledge, Shop Reach, stamp chance
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
- Starting cost: Cash plus Prep Capacity target
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
- Starting cost: $900 target
- Cost growth: 1.26 target
- Produces: automation efficiency
- Consumes: Cash and Prep Capacity
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
- Starting cost: $2400 target or a later prestige-scale cost
- Cost growth: 1.32 target
- Produces: broad lower-tier multipliers and late-game requirements
- Consumes: Cash, Shop Reach, possibly License-gated resources
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
| 1 | Tidy Packaging | First order complete and order prep bottleneck visible | $20 | Prep Counter output x1.5 | 1 to 3 minutes | More orders without waiting | Slow Delivery Order growth | TBD | multiplicative station modifier | Implemented |
| 2 | Steady Pressing | Stock runway is low or extra Tofu Presses make stock growth relevant | $20 | Tofu Press output x1.5 | 1 to 5 minutes when stock is low | First visible stock/sec bump | Slow Tofu Stock growth | TBD | multiplicative station modifier | Implemented |
| 3 | Double Mold | Own 3 Tofu Presses | $40 | Tofu Press output x2 | 3 to 8 minutes | Big stock runway break | First stock plateau | TBD | multiplicative station modifier | Implemented, target tuning pending |
| 4 | Double Labels | Own 2 Prep Counters | $120 | Prep Counter output x2 | 10 to 20 minutes | Throughput jump | Order prep plateau | TBD | multiplicative station modifier | Implemented, target tuning pending |
| 5 | Better Boxes | 15 orders fulfilled | $200 | +25% Cash per order | 15 to 30 minutes | Orders pay better | Cash income plateau | TBD | multiplicative order reward | Partial, keep hidden until relevant |
| 6 | Shop Sign | 10 Reputation | $300 | +50% Reputation per order or unlock support | 20 to 40 minutes | Opens route path | Reputation gate | TBD | reputation multiplier | Partial |
| 7 | Regular Smile | Shop Level 2 and stable orders | $500 | small passive Cash/sec | 30 to 60 minutes | First passive income | Too much manual money conversion | TBD | passive Cash multiplier | Future |
| 8 | Delivery Shelf | 25 orders fulfilled | $800 | Prep Counter support/capacity | 30 to 60 minutes | Smoother order scaling | Order throughput/capacity | TBD | support multiplier | Partial |
| 9 | Route Notebook | First fictional route discovered | $1000 | improves fictional route reports/mastery | First automation phase | Routes feel more learnable | Route Knowledge | TBD | route-only modifier | Future |
| 10 | Better Clipboard | First crew hired | $1500 | improves crew assignment efficiency | First automation phase | Automation becomes legible | Manual assignment friction | TBD | crew-only modifier | Future |
| 11 | Warmer Kettle | Shop Spirit unlocked | $2000 | Shop Spirit/sec increase | Spirit phase | More parked boosts | Shop Spirit scarcity | TBD | spirit generator modifier | Future |

Use shop-safe language. Avoid names implying real driving advantage, speed, racing, high-G,
drifting, aggressive driving, or public-road competition.

## Soft Caps And Plateau Rules

Progression should slow at intentional moments, but the next improvement should remain visible.
Avoid punitive walls. The player should feel `I can see what fixes this`.

| Plateau | What Slows Down | Breakthrough | Target Wait | Next Visible Goal |
| --- | --- | --- | --- | --- |
| After first few simple orders | Cash arrives one order at a time | Steady Pressing or first station purchase | under 2 minutes | first rate bump |
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
| Fresh shop, first order not complete | First automatic handoff | Watch Counter Service | Take Cup Test as optional boost | Manual Fulfill Shop Order as primary |
| Ready Orders >= 1 and Cash is low | Need Cash | Let Counter Service work | Take Cup Test as optional boost | Buy Tofu Press as primary if stock is healthy |
| Ready Orders >= 2 | Convert work to Cash | Run Counter Service; mention a Counter Service upgrade only when one is visible and implemented | View Orders / Manual Backup | Manual single-order spam or dead upgrade prompts |
| High stock + high ready orders + high Reputation + low Cash at batch 25 | Cash conversion bottleneck | Sign or grow Cash for the next Counter Contract | Let Counter Service keep running | Prep Capacity as the bottleneck |
| No ready orders, order prep in progress | Preparing Delivery Order | Wait for Prep Counter | Pack Tofu only if stock is low | Certified boost as bottleneck |
| High Tofu Stock, slow order prep | Prep Counter throughput | Buy Prep Counter or Buy Tidy Packaging if affordable; otherwise wait for Prep Counter | Tofu Press available with `not urgent` copy | Buy Tofu Press as dominant action |
| Low Tofu Stock runway, early shop | Low Tofu Stock | Buy Tofu Press | Manual Pack Tofu only as emergency backup | Buy Prep Counter if it will starve immediately |
| Counter Service stock-blocked, managed shop | Tofu supply scale | Buy Supplier Contract with Reputation | Rush Stock, Tofu Press, or stock upgrade | Manual Pack Tofu as primary action |
| Upgrade affordable and current bottleneck matches it | Upgrade available | Buy the bottleneck-solving upgrade | Fulfill orders if ready | Generic upgrade if it solves the wrong bottleneck |
| Next unlock close | Unlock pressure | Show the requirement and direct action | Continue orders/routes | Reveal full future system list |
| Offline return with many orders | Convert offline progress | Start/upgrade Counter Service | Review Ledger / Manual Backup | Cup Test as primary |
| Cup Test available but shop loop has work | Optional certified boost | Continue shop loop | Take Don't Spill the Cup as secondary | `Certified boost available` as current bottleneck |
| License Exam close | Prestige requirements | View License Exam requirements | Continue missing requirement | Take License Exam if requirements are not met |

Disabled copy should be specific:

- `Need $20 more. Let Counter Service earn Cash from tips.`
- `Need 1 prepared order. Prep Counter is preparing the next order.`
- `Need more Tofu Stock. Let Tofu Press work or buy more supply.`
- `Need 1 Prep Capacity. Prep Capacity recovers over time.`

## 11. Progressive Reveal Rules

First-time users should not see every system. Each system should move through three states:

1. hidden
2. newly discovered/teaser
3. active panel/card

| Reveal Moment | Visible | Teaser-Locked | Hidden |
| --- | --- | --- | --- |
| Immediately | Tofu Stock, Delivery Orders, Cash, Reputation/XP, starter Counter Service, Tofu Press, Prep Counter, Take Cup Test secondary | Buy Tofu Press if unaffordable; simple upgrade hint only if useful | Routes, Crew, Garage, Spirit, Rivals, License, deep Passport, character/sound economy |
| After first order | Shop Order Complete result, Cash source, First Shop Order Stamp Fanfare, Upgrades Discovery Fanfare when a meaningful upgrade appears, relevant Tidy Packaging card if Prep Counter is the bottleneck | Passport preview | Routes, Crew, Garage, Spirit, Rivals, License |
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
  reduced motion and muted audio, and never appears during active driving. It uses a single wide
  reward splash plus compact Cash/Reputation/Shop XP cards; player-facing fanfare UI should not show
  character-slot labels, asset-status copy, `art pending`, or internal slot names.
- The Old Car Out Back splash is a one-time parked story beat after the covered-car milestone. It
  should use its dedicated story image, repeat-suppress after acknowledgement, and avoid implying
  that full Dream Garage, car parts, routes, speed, or active-drive mechanics are implemented.
- The first meaningful hidden shop system should trigger a Discovery Fanfare / New System Revealed
  moment. Upgrades are the preferred first reveal when Tidy Packaging, Steady Pressing, or another
  bottleneck-solving upgrade becomes visible. Future systems should use the same pattern only after
  milestone-based discovery, not raw idle currency accumulation.
- Newly revealed tabs should show an explicit `New` badge or equivalent text. Do not rely on an
  unexplained outline or glow. The badge should clear once the player views the tab, including when
  the Discovery Fanfare action opens it.
- Living Scene image swaps are larger story rewards, not one-station feedback. A single Tofu Press,
  Prep Counter, Delivery Shelf, or Shop Sign purchase should remain visible in cards/buttons rather
  than immediately changing the full-scene image.
- A covered-car teaser may appear only after the shop is established and a larger teaser milestone is
  earned. It starts as a restrained hint that an old car waits behind the shop. The first active
  follow-up is Buy Wheels for `$50K Cash`, which starts `$25K Project Car Value`; it still must not
  create a Dream Garage tab, part catalog, event loop, Builder Stars, or full valuation.

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
| Dream Garage | first shop loop and first-shop phase | after managed-shop scale as Covered Car / Dream Build Teaser V1 | future only; no full tab, parts, valuation, or events yet |
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
| Familiar Counter | 1 Star | First 10 orders give +25% Cash | Shop only |
| Extra Hands | 2 Stars | Prep Capacity recovers more often | Shop only |
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
- `Start Cup Test` is the single front door
- certification is attempted automatically after Start when permissions/data allow
- denied or insufficient location remains playable as a Local Result
- Cup Test should not become the normal shop bottleneck recommendation

Local Result:

- modest local XP/skill XP
- small local shop reward only if valid
- no certified merch progress
- no Perfect Pour
- no route-context achievements
- no hidden certified merch
- no trusted certified proof

Certified smooth result:

- optional certified boost
- bonus Cash from tips
- bonus Reputation
- bonus XP
- possible certified stamps
- possible certified merch progress
- result/report flavor

Boost magnitude should depend on Cargo Condition, qualification status, daily caps, and safe
summarized criteria. It must not improve with speed, exact distance, route risk, street names, maps,
or high-G events.

Simulator/test-fixture summaries:

- local QA only
- not exposed as production UI
- share/result labels surface as Local Result, not Simulated Result
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
Work shop orders -> earn Cash from tips -> reinvest in shop or buy parts -> build the project car ->
enter fictional closed-course events -> earn prizes/status -> complete or sell the build -> start
the next dream car stronger
```

### Role In The Economy

- Tofu Shop remains the base money engine.
- Cash is earned from shop-order tips and later fictional events.
- Cash can be reinvested into shop production or spent on project car parts.
- This creates the key choice: buy more shop production now, or buy car assets that may raise
  long-term Net Worth potential later.
- Dream Garage should not appear before the player understands the shop loop.

Suggested reveal:

- Covered Car / Dream Build Teaser V1 after managed-shop scale: Counter Crew, Manager Desk,
  Wholesale Pickup progress, and sustained shop growth.
- First Dream Build Investment Purchase V1 after the covered-car teaser: a `$50K Cash` Wheels Fund
  progress card that becomes a Buy Wheels action when affordable. Buying Wheels subtracts `$50K`
  Cash and starts `$25K Project Car Value` without adding a Dream Garage tab, full part inventory,
  resale, depreciation, liabilities, events, or full valuation.
- After Wheels level 3, Exhaust Purchase + Work Level V1 starts the second part track. Buy Exhaust
  costs `$250K Cash` and adds `$125K Project Car Value`; Seal Joints costs `$375K Cash` and adds
  another `$200K Project Car Value`; Tuned Note costs `$600K Cash` and adds another `$350K`; Heat
  Wrapped costs `$1.1M Cash` and adds another `$650K`.
- full Dream Garage only after the teaser proves players understand the shop-to-dream bridge.
- first part purchase after stable Cash income exists and project-budget rules are resolved.

Example decision points:

- Buy Prep Counter now, or save for Basic Tires?
- Improve larger-order throughput, or save for Paint Touch-Up?
- Reinvest event prize money into the shop, or buy Stage 2 cooling?

### Dream Jar / Project Budget Decision

Resolved direction:

- Cash is the actual spend currency for garage parts.
- `Dream Jar`, `Project Budget`, or a similar label can be a goal/progress meter showing Cash saved
  toward the next car part.
- Current V1 implementation uses `Wheels Fund` as the first such target at `$50K Cash`; it becomes
  the first Dream Build purchase when affordable. Wheels do not use a separate currency and do not
  open full Dream Garage.
- A project budget should not become a separate currency.
- Direct Cash spending is the default first garage implementation.
- Later, the game may add `Builder Reputation` or `Builder Stars`, but not as early spend
  currencies.

Open question:

- Does the first garage slice need a visible budget meter for anticipation, or is direct Cash
  spending clear enough?

### Dream Build Part Progression

Dream Build should not become duplicate part buying. The future structure is:

```text
Buy the part once.
Then improve that same part through work levels.
```

Player-facing verbs should be about care and craft: Install, Polish, Fit, Balance, Tune, Refine,
Restore, Wrap, Detail, Finish, Showcase. Avoid `Buy Wheels x10`, `Buy Exhaust x5`, `Produce more
turbos`, or any public-road performance framing.

Initial future tracks:

| Part Track | Level 0 | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 |
| --- | --- | --- | --- | --- | --- | --- |
| Wheels | Missing / stock | Wheels Installed | Polished Wheels | Balanced Fitment | Showpiece Fitment | Collector Finish |
| Exhaust | Stock | Exhaust Fitted | Sealed Joints | Tuned Note | Heat Wrapped | Showcase Finish |
| Suspension | Stock | Suspension Refreshed | Ride Height Set | Alignment Dialed | Corner Balance | Showcase Stance |
| Brakes | Stock | Brake Refresh | Better Pads | Fluid and Lines | Balanced Stopping | Confidence Setup |
| Turbo Kit | Not started | Kit Mounted | Piping Routed | Heat Managed | Closed-Course Tuned | Showcase Ready |
| Stage Tune | Not started | Baseline Tune | Smooth Response | Reliability Map | Closed-Course Map | Showcase Calibration |

Implemented Wheels Work Levels V1:

| Wheels Level | State / Work | Cash Cost | Project Car Value Total | Runtime Status |
| --- | --- | --- | --- | --- |
| 0 | Not Purchased | none | `$0` | Implemented as pre-Wheels target state |
| 1 | Wheels Installed | `$50K` | `$25K` | Implemented |
| 2 | Polish Wheels | `$75K` | `$65K` | Implemented |
| 3 | Balanced Fitment | `$150K` | `$150K` | Implemented |
| 4 | Showpiece Fitment | future | future | Documented only |
| 5 | Collector Finish | future | future | Documented only |

Implemented Exhaust Purchase + Work Level V1:

| Exhaust Level | State / Work | Cash Cost | Project Car Value Total | Runtime Status |
| --- | --- | --- | --- | --- |
| 0 | Not Started | none | `$150K` with Wheels level 3 | Implemented as post-Wheels target state |
| 1 | Exhaust Fitted | `$250K` | `$275K` with Wheels level 3 | Implemented |
| 2 | Sealed Joints | `$375K` | `$475K` with Wheels level 3 | Implemented |
| 3 | Tuned Note | `$600K` | `$825K` with Wheels level 3 | Implemented |
| 4 | Heat Wrapped | `$1.1M` | `$1.475M` with Wheels level 3 | Implemented |
| 5 | Showcase Finish | `$2M` | `$2.725M` with Wheels level 3 | Implemented |

Implemented Suspension Track Completion V1:

| Suspension Level | State / Work | Cash Cost | Project Car Value Total | Runtime Status |
| --- | --- | --- | --- | --- |
| 0 | Not Started | none | `$2.725M` with Wheels level 3 and Exhaust level 5 | Implemented as post-Exhaust target state |
| 1 | Suspension Refreshed | `$4M` | `$4.725M` with Wheels level 3 and Exhaust level 5 | Implemented |
| 2 | Ride Height Set | `$7.5M` | `$8.725M` with Wheels level 3 and Exhaust level 5 | Implemented |
| 3 | Alignment Dialed | `$12M` | `$15.725M` with Wheels level 3 and Exhaust level 5 | Implemented |
| 4 | Corner Balance | `$20M` | `$27.725M` with Wheels level 3 and Exhaust level 5 | Implemented |
| 5 | Showcase Stance | `$35M` | `$49.725M` with Wheels level 3 and Exhaust level 5 | Implemented |

Planned Suspension vocabulary:

| Suspension Level | Planned Work | Catalog Framing |
| --- | --- | --- |
| 1 | Suspension Refreshed | Sports suspension, refreshed bushings, and a basic alignment foundation |
| 2 | Ride Height Set | Height-adjustable sports suspension |
| 3 | Alignment Dialed | Camber/toe arms and sway-bar setup |
| 4 | Corner Balance | Fully customizable coilover setup and chassis geometry |
| 5 | Showcase Stance | Final geometry, bracing, fitment, and presentation |

The full future parts vocabulary is maintained in `TOFU_GARAGE_TUNING_CATALOG.md`. Future Tofu
Garage parts may affect fictional stats such as Garage Build Value, Build Score, Style,
Reliability, Comfort, Control, Grip, Power, Response, Cooling, Durability, Event Fit, Showcase
Readiness, Collector Appeal, Race Class, Garage Reputation, Brand Value, prize potential, and
future car-management outcomes. They must not affect Don't Spill the Cup scoring, certification,
route-context achievements, Perfect Pour proof, Driver XP, real-driving rewards, or share proof.

Core Build Progress V2:

| Progress Input | Implemented Runtime Contribution |
| --- | --- |
| Wheels Level | `0-3` current runtime stages |
| Exhaust Level | `0-5` current runtime stages |
| Suspension Level | `0-5` current runtime stages |
| Tires & Rubber Level | `0-5` current runtime stages |
| Brakes & Control Level | `0-5` current runtime stages |
| Induction & Cooling Level | `0-5` current runtime stages after Brakes Level 5 plus Local Showcase |
| Drivetrain & Transmission Level | `0-5` current runtime stages after Induction Level 5 |
| Aero, Styling & Weight Reduction Level | `0-5` current runtime stages after Drivetrain Level 5 |
| Final Build Level | `0-2` current runtime stages after Aero Level 5 |

The progress denominator is `40` planned core work stages. After Balanced Fitment, Showcase Finish,
Showcase Stance, Event Tire Set, Brake Balance & Control Package, Anti-Lag & Cooling Package, and
Sequential Transmission Package, Carbon Body & Roll Cage, Final Detail, and Shakedown Complete,
the current implemented maximum is `40 / 40`.

Each level is an investment, not a direct cash printer.

Implemented Induction & Cooling V1 values:

| Induction Level | Work | Cash Cost | Garage Build Value |
| --- | --- | --- | --- |
| 1 | Sports Intercooler | `$3.5B` | `+$2.5B` |
| 2 | Electronic Boost Control | `$5.25B` | `+$3.75B` |
| 3 | Hybrid Turbo Upgrade | `$8B` | `+$6B` |
| 4 | Big Turbo Kit | `$12B` | `+$9B` |
| 5 | Anti-Lag & Cooling Package | `$18B` | `+$14B` |

Implemented Drivetrain & Transmission V1 values:

| Drivetrain Level | Work | Cash Cost | Garage Build Value |
| --- | --- | --- | --- |
| 1 | Sports Clutch & Flywheel | `$27B` | `+$20B` |
| 2 | Limited-Slip Differential | `$40B` | `+$32B` |
| 3 | Carbon Driveshaft & Axles | `$60B` | `+$50B` |
| 4 | Custom Gearbox | `$90B` | `+$78B` |
| 5 | Sequential Transmission Package | `$135B` | `+$120B` |

Implemented Aero, Styling & Weight Reduction V1 values:

| Aero Level | Work | Cash Cost | Garage Build Value |
| --- | --- | --- | --- |
| 1 | Front Splitter & Side Skirts | `$200B` | `+$160B` |
| 2 | Rear Diffuser & Wing | `$300B` | `+$240B` |
| 3 | Wide Body & Vented Panels | `$450B` | `+$360B` |
| 4 | Weight Reduction Package | `$675B` | `+$540B` |
| 5 | Carbon Body & Roll Cage | `$1T` | `+$800B` |

Implemented First Complete Build V1 values:

| Final Step | Work | Cash Cost | Garage Build Value |
| --- | --- | --- | --- |
| 39 / 40 | Final Detail | `$1.5T` | `+$1.2T` |
| 40 / 40 | Shakedown Complete / First Complete Build | `$2.5T` | `+$2T` |

The First Complete Build status is local Tofu Garage progression only. It unlocks Car Management
V1 but does not add multiple cars, auctions, collector offers, sell choices, backend sync, or Cup
Test effects.

Implemented Car Management V1 assignment values:

| Assignment | Duration | Entry Cost | Rewards |
| --- | --- | --- | --- |
| Showcase Rotation | `15m` | `0.25%` of car value at completion | `0.75%` Cash, `0.5%` Brand Value, `+25` Garage Reputation |
| Sponsor Demo Day | `30m` | `0.5%` of car value at completion | `1.5%` Cash, `1%` Brand Value, `+75` Garage Reputation |
| Closed-Course Exhibition Booking | `60m` | `1%` of car value at completion | `3%` Cash, `2%` Brand Value, `+150` Garage Reputation |

Only one Car Management assignment can be active at a time. Assignment rewards are not granted
until the player collects them, and assignment history is capped. The tab shows the last three
assignment results by default and treats Garage Event Board as the separate one-time event board.

Implemented Second Car Project / Second Bay V1 values:

| Step | Unlock | Cash Cost | Garage Reputation Cost | Reward |
| --- | --- | --- | --- | --- |
| Open Second Bay | First Car Management loop complete and `250` Garage Reputation | `$500B` | `250` | opens second project bay |
| Acquire Second Project Car | Second Bay opened and `500` Garage Reputation | `$1T` | `500` | `+$750B Garage Build Value`, Rolling Shell |

Second Car Identity / Build Direction V1 unlocks after the rolling shell is acquired. The one-time
locked choices are Showcase Build, Track Build, Drift Build, Rally Build, and Restoration Build.
The choice itself grants no Cash, Brand Value, Garage Reputation, Garage Build Value, or Net Worth
change.

Implemented Second Car Direction Track V1 values:

| Level | Cash Cost | Garage Reputation Cost | Garage Build Value |
| --- | --- | --- | --- |
| 1 | `$2T` | `250` | `+$1.25T` |
| 2 | `$4T` | `400` | `+$2.5T` |
| 3 | `$7T` | `700` | `+$4.5T` |
| 4 | `$11T` | `1,000` | `+$7.5T` |
| 5 | `$17T` | `1,500` | `+$12T` |

The shared schedule applies to the selected direction only. Showcase Build uses Presentation
Package, Fitment & Finish Plan, Lighting & Display Details, Show Floor Prep, and Showcase Build
Ready. Track Build uses Event Prep Package, Brake Cooling Package, Aero Balance Setup, Tire
Compound Program, and Track Build Ready. Drift Build uses Angle Setup Package, Differential Setup,
Cooling & Tire Wear Prep, Style & Smoke Package, and Drift Build Ready. Rally Build uses Gravel
Prep Package, Protection & Travel Setup, Weather Tire Program, Reliability Kit, and Rally Build
Ready. Restoration Build uses Restoration Foundation, Chassis Documentation, Period Detail Package,
Engine & Body Refresh, and Restoration Build Ready.

The track spends Garage Reputation using the same spendable convention as Second Bay, adds Garage
Build Value through the existing component, and does not grant Cash, Brand Value, Garage Reputation,
assignments, Cup Test rewards, or formula changes.

Implemented Second Car Assignment Board V1 values:

| Build Direction | Assignment | Duration | Cash Cost | Cash Reward | Brand Value Reward | Garage Reputation Reward |
| --- | --- | --- | --- | --- | --- | --- |
| Showcase Build | Invitational Display | `60 min` | `$1T` | `+$2T` | `+$5T` | `+250` |
| Track Build | Closed-Course Test Session | `60 min` | `$1T` | `+$6T` | `+$1T` | `+800` |
| Drift Build | Exhibition Night | `60 min` | `$1T` | `+$4T` | `+$3T` | `+500` |
| Rally Build | Weather Trial | `60 min` | `$1T` | `+$3T` | `+$1.5T` | `+900` |
| Restoration Build | Collector Review | `60 min` | `$1T` | `+$2T` | `+$6T` | `+300` |

Only the selected direction assignment renders. It is one-time in V1, grants rewards only when
collected, adds no Garage Build Value, and shares the global one-active-car-assignment rule with
the first completed build. Full fleet management and second-car assignment chains remain future.

Possible level effects:

- Cash decreases.
- Project Car Value increases.
- Dream Build progress increases.
- Garage Reputation increases.
- Showcase Readiness increases.
- future events unlock.
- future business paths unlock.

Core tradeoff:

```text
Cash spent on the car delays liquid progress toward $1T,
but increases asset value and unlocks higher-value opportunities later.
```

Do not give every part level a direct Cash payout. Cash rewards should mainly come from later
events, sales, collector offers, or business paths.

### Project Car Stages

| Stage | Name | Fantasy | Unlock | Main Costs | Main Rewards | Exit Condition |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | The Covered Car / Beater | There is an old car under a cover behind the shop. | First $100 Cash, Shop Level 2, or first larger order type | small Cash spend, basic restoration parts | emotional reveal, Reliability, first build report | car starts and basic reliability is restored |
| 1 | Daily Driver Build | The car becomes reliable, personal, and fun. | Stage 0 complete | Cash, common parts, style parts | Build Score, Style, first closed-course event access | core reliability/style parts installed |
| 2 | Track-Day / Closed-Course Build | The car is ready for fictional organized events. | Stage 1 basics and first event report | higher Cash costs, cooling/brake/suspension parts | Event Readiness, better prizes, rare part chance | major midgame event cleared |
| 3 | Dream Build | The dream car becomes serious and expensive. | Stage 2 event progress and high Build Score | large Cash costs, rare parts, showcase parts | Project Car Value, Builder Reputation, completion/sale option | major invitational cleared or value target reached |

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
| Parking Lot Shakedown | Stage 0 complete | car starts, basic tires | small Cash prize, Garage XP, first garage report | first event |
| Tofu Cup Beginner | Stage 1 basics | tires, brakes, reliability | Cash prize, Reputation, stamp | first meaningful prize |
| Sponsor Showcase | style/decal progress | paint, decal, Style score | sponsor bonus, style stamp | cosmetics matter |
| Festival Track Day | Stage 2 | cooling, brakes, suspension | Cash prize, rare part chance | midgame event |
| Night Garage Trial | Stage 2 | reliability and Event Readiness | special report, story stamp | atmosphere |
| Dream Build Invitational | Stage 3 | high Build Score | huge prize, Builder Reputation, prestige option | endgame build event |

Use event language such as Showcase, Trial, Track Day, Invitational, and Closed-Course Event. Avoid
public-road competition or speed-optimization wording.

### Project Car Completion / Sale Prestige

Once the car reaches enough Project Car Value or clears a major event, the player can choose to keep
and showcase it or complete/sell the build.

### Completed Build Events

Completed-car decisions are future prestige-like choices. They should arrive only after Dream Build
part levels and completion thresholds are proven.

| Event Choice | Effect | Rewards | Tradeoff |
| --- | --- | --- | --- |
| Keep the Car | The car remains in the collection. | Higher Project Car Value, long-term status, garage identity, future showcase eligibility. | No immediate Cash payout. |
| Enter Showcase | The car is shown publicly in-fiction. | Garage Reputation, sponsor interest, status, possible cosmetic unlocks. | No real driving and no speed incentives. |
| Closed-Course Exhibition | Fictional non-real-world event. | Trophy, story beat, sponsor interest. | No Cup Test scoring, real driving, speed, G-force, or public-road behavior effect. |
| Auction the Car | Sell the car for Cash. | Large Cash payout that can fund the next build or next business. | Lose the car from active collection and lose some status/collection value. |
| Collector Offer | Rare offer to buy the car. | Possibly better Cash than auction, story/status beat, future collector network. | Lose the car unless the player declines. |

Prestige-like role:

```text
Sell the build
-> get Cash
-> fund the next business
-> unlock better project cars
-> previous shop loop becomes more automated
```

or:

```text
Keep the build
-> grow status
-> unlock showcase/sponsor paths
-> slower Cash now, higher brand value later
```

Completed build events bridge Tofu Garage to later business scaling. They should not become the
next immediate implementation slice after Wheels; first prove part work levels and completion
progress.

Preferred prestige currency:

```text
Builder Stars
```

Reason: `Builder Stars` is short, positive, and clearly tied to car-build mastery. It stays separate
from `License Stars`, which are shop/license prestige.

Possible permanent perks:

- cheaper first parts
- extra starting Cash in the project budget
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
| 10 to 30 minutes | establish shop rhythm; covered car stays hidden unless the shop has clearly earned the teaser |
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
| pull_off_cover | Pull Off the Cover | Stage 0 starts | enough Cash or project-budget progress | small Cash target | reveals project car | Save a little more Cash from shop orders. | 30 to 60 minutes | Future |
| deposit_project_budget | Add Cash To Project Budget | project-budget meter chosen | Cash > 0 | selected Cash | earmarks progress toward next part | Earn Cash from shop orders first. | 30 to 60 minutes | Future / optional |
| buy_part | Buy Part | part is visible | enough Cash | part cost | adds part to inventory/build sheet | Need more Cash. Work shop orders or events. | 1 to 2 hours | Future |
| install_part | Install Part | owned part not installed | garage is available | none or install time | updates build stats | Buy the part first. | 1 to 2 hours | Future |
| buy_next_part | Buy Next Recommended Part | recommendations exist | enough Cash | part cost | buys the bottleneck-solving part | Need more Cash for the recommended part. | 1 to 2 hours | Future |
| view_build_sheet | View Build Sheet | garage active | always | none | shows parts, stats, stage, next recommendation | Unlock Dream Garage first. | 1 to 2 hours | Future |
| enter_shakedown | Enter Parking Lot Shakedown | Stage 0 complete | basic readiness met | event entry cost target | creates first event report/prize | Finish basic restoration first. | 1 to 2 hours | Future |
| enter_tofu_cup_beginner | Enter Tofu Cup Beginner | Stage 1 basics | tires, brakes, reliability target | event entry cost target | Cash prize, Reputation, stamp | Build basic reliability first. | 2 to 6 hours | Future |
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
| After managed-shop scale plus Wholesale Pickup progress | covered car teaser |
| Later follow-up phase after Cash bridge is clear | Dream Garage active |
| After Stage 0 complete | first closed-course event teaser |
| After Stage 1 basics | events active |
| After Stage 3 | sell/complete build prestige visible |

### Dream Garage Balance Tests

Future implementation should add tests for:

- garage hidden during the first shop loop
- covered car teaser appears at the intended milestone
- Dream Garage unlocks after the defined condition
- buying a part consumes Cash
- parts update Build Score, Reliability, Style, and Event Readiness
- closed-course event does not require real driving
- event rewards do not use speed, GPS, map, street, route trace, exact distance, or high-G data
- selling/completing a car grants prestige and starts a new build
- shop progression remains playable without garage
- Cup Test remains optional for ordinary shop and garage progression

## Ultimate Net Worth Endgame

Ultimate Net Worth is partially implemented as a small shop-era V1 progress model. It should not
affect the current First Loop Contract, Cup Test scoring, or any driving behavior.

Long-arc framing:

```text
Tofu Shop is the first job.
Dream Garage is the first dream.
The car company is the first empire.
The rocket company is the absurd endgame.
The goal is $1 trillion net worth.
```

Cash is the current player-facing liquid currency. Runtime save compatibility still uses
`shop.tips`, but those tips are Cash rather than a second dollar balance. `Net Worth` is the
long-term score toward the `$1T Net Worth` target. This is fictional game economy language, not
real financial advice.

Current V1 formula:

```text
Net Worth V1 =
  Cash
  + Tofu Business Value
  + Garage Build Value
  + Brand Value
```

Net Worth Milestone Ladder V1:

| Milestone | V1 Reward / Meaning | Status |
| --- | --- | --- |
| `$1M Net Worth` | Local Showcase Interest after early Dream Build progress | Implemented |
| `$10M Net Worth` | Future shop-era opportunity marker | Implemented as milestone target only |
| `$100M Net Worth` | Garage Event Board after Tires & Rubber Level 5 | Implemented |
| `$1B Net Worth` | Future company-scale opportunity marker | Implemented as milestone target only |
| `$1T Net Worth` | Long-term goal | Implemented as target only |

Showcase Interest V1 unlocks only after early Dream Build progress and the first `$1M Net Worth`.
`Prepare Showcase Display` is a parked `$500K Cash` investment that adds `$300K Garage Build Value`.
Sponsor Inquiry V1 then unlocks as a one-time parked opportunity: accepting it grants `$250K Cash`
and `$500K Brand Value`. It is a proof of car-investment value, not a completed-car event, recurring
sponsor system, route system, auction, racing mode, or full Dream Garage.

Garage Event Board V1 unlocks at `$100M Net Worth` plus Tires & Rubber Level 5. V1 events are
one-time, parked, fictional, and instant:

| Event | Requirements | Entry Cost | Rewards |
| --- | --- | --- | --- |
| Local Showcase | Event Board unlocked | `$25M Cash` | `+$60M Cash`, `+$40M Brand Value`, `+25 Garage Reputation`, Local Showcase Debut badge |
| Sponsor Display | Local Showcase complete, Brakes & Control Level 2 | `$75M Cash` | `+$150M Cash`, `+$250M Brand Value`, `+50 Garage Reputation`, Sponsor Display badge |
| Closed-Course Exhibition | Sponsor Display complete, Brakes & Control Level 5 | `$200M Cash` | `+$500M Cash`, `+$750M Brand Value`, `+100 Garage Reputation`, Closed-Course Exhibition badge |
| Collector Preview | Closed-Course Exhibition complete, Garage Reputation `>= 100` | `$150M Cash` | `+$250M Cash`, `+$1B Brand Value`, `+150 Garage Reputation`, Collector Preview badge |

Garage Reputation is local fictional Tofu Garage status. Event Brand Value contributes through the
existing Brand Value component in Net Worth V1; the Net Worth formula itself does not change.

Future full formula:

```text
Net Worth =
  Cash
  + Business Value
  + Car Asset Value
  + Garage Value
  + future company value
  + future aerospace value
  - liabilities
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
| Dream Garage | Dream Garage Era | tools, workspace, build history, showcase value | parts storage, unfinished projects | converts Cash into emotional assets |
| Project Car | Dream Garage / Builder Era | parts, Reliability, Style, Event Readiness, story status | expensive mistakes, unfinished builds, depreciation | first asset that can be kept, showcased, or sold |
| Collector Car | Builder Era | rarity, completed build quality, event reports, cosmetic identity | upkeep, storage, volatile value | long-term status asset and possible prestige object |
| Car Manufacturing Company | Manufacturer Era | production lines, brand reputation, prototype success | factory costs, failed models, recalls as fictional flavor | turns individual builds into scalable production |
| Sponsorship / Showcase Brand | Builder / Manufacturer Era | style, Passport proof, event reports, sponsor badges | reputation risk, event costs | social/status multiplier and prize support |
| Rocket Company | Aerospace Era | launch contracts, aerospace research, space delivery capacity | expensive failures, research burn, launch costs | absurd late-game paradigm shift |
| Space Delivery / Space Race League | Space League Era | league rights, space cargo contracts, showcase events | huge operating costs, fictional rivalry pressure | patchable post-$1T expansion |

Design notes:

- Tofu Shop starts as active labor.
- Franchise and manager automation eventually make shop income passive.
- Dream Garage turns Cash into appreciating or depreciating assets.
- Project cars can be kept, showcased, entered in fictional closed-course events, or sold.
- Car manufacturing turns individual builds into scalable production.
- Rocket/aerospace is the late-game paradigm shift.
- The $1T target is the first major endgame goal; future patches may add more layers beyond it.
- The target is `$1T Net Worth`, not `$1T Cash` and not `1T shares`.

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
| Starter Shop Era | Watch the tiny counter run itself | Simple orders, Tofu Press, Prep Counter, starter Counter Service | first upgrades and stamps |
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
| starter_counter_service | Starter Counter Service | First Loop | Start | Ready Orders >= 1 and supplied | Delivery Orders, Tofu Stock | flat by order type | 1 order handoff | 1.0 | +$10, +1 Reputation, +8 Shop XP for Simple Tofu Box; fresh shop starts with 24 Tofu Stock so the first 3 automatic handoffs can reach the first upgrade without Pack Tofu | 0:00 | 10 to 30 seconds for first handoff; first upgrade affordable in 30 to 90 seconds | Converts orders to spendable progress automatically | Watch Counter Service / Wait for Tofu Stock ETA | manual fulfillment | Parked-only, no sensors | Implemented |
| family_tofu_tray | Family Tofu Tray | First Shop | 5 fulfilled orders or Shop Level 2 | 24 stock and 1 ready order | Tofu Stock, Delivery Orders | flat | 24 stock + 1 order | 1.0 | +$45, +3 Reputation, +24 Shop XP | 5 to 10 minutes | when unlocked and stocked | Extra stock has value | Fulfill Family Tofu Tray | simple order only | Shop only | Implemented |
| festival_bento | Festival Bento | First Shop / later | 25 fulfilled orders or 50 Reputation | 75 stock and 2 ready orders | Tofu Stock, Delivery Orders | flat | 75 stock + 2 orders | 1.0 | +$130, +8 Reputation, +70 Shop XP | 20 to 40 minutes | when unlocked and stocked | First big payout | Fulfill Festival Bento | smaller orders | Shop only | Implemented |
| tofu_press | Tofu Press | First Loop | Start | always owned; buys require Cash | Cash | baseCost * growthRate ^ owned | 15 | 1.15 | +0.10 stock/sec target each | 0:00 | about 2 orders for first extra | Low Tofu Stock | Buy Tofu Press | Pack Tofu pressure | Shop only | Implemented, target value gap |
| prep_counter | Prep Counter | First Loop | Start | always owned; buys require Cash/Prep Capacity | Cash, Prep Capacity | baseCost * growthRate ^ owned | 50 | 1.16 | +0.025 orders/sec target each; consumes 2 stock/order | 0:00 | 4 to 6 minutes for first extra | Slow/no Delivery Orders | Buy Prep Counter | manual waiting | Shop only | Implemented, target cost gap |
| steady_pressing | Steady Pressing | First Loop | Stock runway low or extra Tofu Presses make stock growth relevant | Cash >= 20 | Cash | upgrade growth | 20 | TBD | Tofu Press output x1.5 at level 1 | 1 to 5 minutes when stock is low | about 2 simple orders in a stock-bottleneck state | Slow stock rebuild | Buy Steady Pressing | none | Shop language only | Implemented |
| double_mold | Double Mold | First Shop | Own 3 Tofu Presses | Cash >= 40 | Cash | flat or upgrade growth | 40 | TBD | Tofu Press output x2 | 3 to 8 minutes | TBD | First stock plateau | Buy Double Mold | none | Shop language only | Implemented, tuning pending |
| tidy_packaging | Tidy Packaging | First Loop | First order complete and Prep Counter/order throughput bottleneck | Cash >= 20 | Cash | upgrade growth | 20 | TBD | Prep Counter output x1.5 | 1 to 3 minutes | about 2 simple orders | Slow order prep | Buy Tidy Packaging | none | Shop language only | Implemented |
| first_shop_order_stamp | First Shop Order Stamp | First Loop | First order fulfilled | automatic | none | none | 0 | 1.0 | Unlock first stamp, Stamp Fanfare, and Passport teaser | 0:00 to 1:00 | immediate | Collection reveal | View Passport | none | Local-only stamp; fanfare repeats are suppressed | Implemented |
| delivery_shelf | Delivery Shelf | First Shop | 10 to 20 minutes or 25 orders fulfilled | Cash/Prep Capacity available | Cash | station growth | 800 | 1.17 | Prep Counter support/capacity | 10 to 20 minutes | TBD | Scaling order flow | Buy Delivery Shelf | none | Shop only | Partial |
| shop_sign | Shop Sign | First Shop | 10 Reputation or reputation gate | Cash available | Cash | station growth | 300 | 1.18 | +50% Reputation/order target or route unlock support | 20 to 40 minutes | TBD | Reputation unlock pressure | Buy Shop Sign | none | Shop only | Partial |
| counter_service | Counter Service | First Loop / Managed Shop | Start | running while parked and page open | ready orders + Tofu Stock | interval and batch upgrades | 0 | 1.0 | 1 automatic best-available handoff / 10 seconds, upgradeable to 8/6/4 seconds and 2/5/10 order batches | immediate | immediate on fresh saves | First automatic handoff, then oversized Ready Order piles | Watch Counter Service / Buy bulk upgrade | repeated Fulfill clicks | Parked-only, active-page-only, no offline auto-fulfillment | Implemented V1 |
| soy_supplier_contract | Soy Supplier Contract | Managed Shop | Catering Crate scale, Shop Level 25, or 10K Reputation | 25K Reputation | Reputation | flat | 25000 | 1.0 | +250 Tofu Stock/sec support | high-midgame | when Reputation is high but Cash is stock-blocked | Counter Service waiting for Tofu Stock | Buy Soy Supplier Contract | manual Pack Tofu as main solution | Shop only, no new currency | Implemented V1 |
| morning_soy_delivery | Morning Soy Delivery | Managed Shop | Soy Supplier Contract and Shop Level 50 | 75K Reputation | Reputation | flat | 75000 | 1.0 | +750 Tofu Stock/sec support | high-midgame | after first supplier contract | Larger order stock pressure | Buy Morning Soy Delivery | repeated stock clicking | Shop only, no new currency | Implemented V1 |
| bulk_soy_delivery | Bulk Soy Delivery | Managed Shop | Morning Soy Delivery and Shop Level 100 | 200K Reputation | Reputation | flat | 200000 | 1.0 | +2000 Tofu Stock/sec support | high-midgame plateau | after managed-shop scale | Catering Crate/Counter Crew stock demand | Buy Bulk Soy Delivery | unsolvable stock trap | Shop only, no new currency | Implemented V1 |
| manager_shift_manager | Hire Shift Manager | Manager Desk | Counter Crew, Catering Crate, Shop Level 100, 1M Reputation | $75K + 1M Reputation | Cash + Reputation | flat | 75000 | 1.0 | Counter Service batch 10 -> 25 | high-midgame | after current Counter Service path is maxed | Queue full at managed-shop scale | Buy Hire Shift Manager | new tab/franchise jump | Parked-only, no new currency | Implemented V1 |
| manager_wholesale_pickup | Wholesale Pickup | Manager Desk | Hire Shift Manager | $125K + 1.5M Reputation | Cash + Reputation | flat | 125000 | 1.0 | Clears up to 50 waiting orders per handoff when queue is effectively full and tofu is supplied | high-midgame | after Shift Manager | Capped order queue becomes useful throughput | Buy Wholesale Pickup | per-order backlog growth | Active-page-only scalar batch, no offline fulfillment | Implemented V1 |
| wholesale_counter_contract | Wholesale Counter Contract | Late Shop Contracts | Shift Manager active and Counter Service batch 25 | $250K + 5M Reputation | Cash + Reputation | flat | 250000 | 1.0 | Counter Service batch floor 100; unlocks Wholesale Case | late managed shop | short Cash wait in high-Reputation saves | Cash conversion too slow | Sign Wholesale Contract | batch 25 plateau | Parked-only, no Cup Test effect | Implemented V1 |
| wholesale_case | Wholesale Case | Late Shop Contracts | Wholesale Counter Contract | 1,000 stock + 25 ready orders | Tofu Stock, Delivery Orders | flat | 1000 stock | 1.0 | +$6.5K Cash, +150 Reputation, +1.5K Shop XP | after Wholesale Contract | when supplied | Larger automatic handoff | Counter Service Best Available | smaller order grind | Shop only | Implemented V1 |
| catering_account | Catering Account | Late Shop Contracts | Wholesale Counter Contract | $2.5M + 12M Reputation | Cash + Reputation | flat | 2500000 | 1.0 | Counter Service batch floor 250; unlocks Event Catering Load | late managed shop | after Wholesale Contract | Bigger Cash conversion | Open Catering Account | batch 100 plateau | Parked-only, no Cup Test effect | Implemented V1 |
| event_catering_load | Event Catering Load | Late Shop Contracts | Catering Account | 10,000 stock + 250 ready orders | Tofu Stock, Delivery Orders | flat | 10000 stock | 1.0 | +$100K Cash, +2K Reputation, +20K Shop XP | after Catering Account | when supplied | Catering-scale handoff | Counter Service Best Available | Wholesale-only pacing | Shop only | Implemented V1 |
| event_vendor_contract | Event Vendor Contract | Late Shop Contracts | Catering Account | $25M + 35M Reputation | Cash + Reputation | flat | 25000000 | 1.0 | Counter Service batch floor 1000; unlocks Venue Supply Contract | late managed shop | after Catering Account | Venue-scale Cash conversion | Sign Event Vendor Contract | batch 250 plateau | Parked-only, no Cup Test effect | Implemented V1 |
| venue_supply_contract | Venue Supply Contract | Late Shop Contracts | Event Vendor Contract | 100,000 stock + 2,500 ready orders | Tofu Stock, Delivery Orders | flat | 100000 stock | 1.0 | +$1.5M Cash, +20K Reputation, +250K Shop XP | after Event Vendor Contract | when supplied | Large backlog conversion | Counter Service Best Available | Catering-only pacing | Shop only | Implemented V1 |
| local_delivery_license | Local Delivery License | First License | plateau requirements met | confirmation accepted | progress reset | requirements | 0 | 1.0 | Reset selected shop progress; grant 1 to 3 Stars | 4 to 6 hours | at plateau | Long-term plateau | Take License Exam | first run loop | No real driving requirement | Placeholder |

## Implementation Slices

These slices define future implementation order. Each slice should ship with visible state changes,
feedback, tests, and updated status evidence. Do not include later systems just because their data
already exists.

| Slice | Goal | Files Likely Touched | Tests Required | What Not To Include |
| --- | --- | --- | --- | --- |
| 1. First Loop Contract | Align fresh state, first order, first upgrade timing, first stamp, and early reveal | `frontend/nospill/app.js`, `test_frontend_nospill.js`, docs | fresh order available, Simple Tofu Box rewards, first stamp, no advanced clutter, no resource-negative state | Routes, Crew, Garage, Spirit, Rivals, License |
| 2. Order Types | Make Tofu Stock matter through larger orders | `app.js`, tests, `BALANCE_AND_PROGRESSION.md`, `IMPLEMENTATION_STATUS.md` | Family/Festival/Catering unlocks, typed costs/rewards, Fulfill Max labeling, raw stock does not multiply Cash | route contracts and larger network orders later |
| 3. Early Upgrade Timing | Make first purchases solve current bottlenecks | `app.js`, tests | first extra station timing, Steady Pressing timing, Tidy Packaging timing, disabled reasons | broad upgrade catalog expansion |
| 4. Passport First Stamp | Make first collection moment rewarding without showing full catalog | `app.js`, tests, docs | First Shop Order stamp reveal, View Passport teaser, stamp persists | deep Passport filters/categories |
| 5. Delivery Shelf / Shop Sign | Add first-shop support systems after the core loop is stable | `app.js`, tests, docs | reveal timing, Cash costs, throughput/reputation effects, no first-screen clutter | full route network |
| 6. First Route Card | Introduce Shop Street as fictional parked content | `app.js`, tests, docs | route cost/reward, fictional copy, no real road language, route stamp | maps, real routes, route leaderboards |
| 7. Counter Service / Managed Shop V1 | Let the counter handle prepared-order handoffs from the start, then scale batch handoffs after early mastery | `app.js`, tests, docs | starter availability, Start/Pause, active-page-only handoff tick, Best Available priority, finite interval upgrades, finite bulk upgrades, no offline auto-fulfillment | Regular Customers, crew, route automation, stock reserve upgrades |
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
| Starter Counter Service | Implemented | counter service helpers/tests | converts orders into Cash/Reputation/Shop XP automatically while parked | tune first-order timing |
| Manual Fulfill Shop Order | Implemented as backup | order fulfillment helpers/tests | converts orders into Cash/Reputation/Shop XP and gives feedback when manually used | keep secondary to automation |
| Order-size ladder | Implemented | order catalog, typed fulfillment, Overview order cards, Next Best Action tests | Simple Tofu Box, Family Tofu Tray, and Festival Bento consume typed tofu/order costs and pay typed rewards | tune unlock timing and presentation |
| Cash purchase currency | Implemented | station/upgrade costs and disabled copy | player-facing Cash balance buys stations/upgrades; legacy `shop.tips` stores the value internally | optional internal field migration later |
| Ready order/progress display | Implemented | ready order UI/tests | hides raw fractional order count | refine ETA copy |
| First Shop Order stamp | Implemented | order result, ledger, Passport teaser tests | first fulfilled Simple Tofu Box unlocks and reports the stamp without showing the full catalog | visual polish |
| Tofu Press / Prep Counter station cards | Implemented | station rendering/tests | station count and upgrade levels are separate | visual polish |
| Station Milestone Boosts V1 | Implemented | `STATION_MILESTONE_BOOSTS`, station card milestone copy, count-derived rate multipliers, one-time inline feedback, tests | 5/10 Tofu Press and Prep Counter output boosts, 5/10 Delivery Shelf support boosts, and 5/10 Shop Sign Reputation support boosts are total multipliers | tune thresholds and decide whether 25+ station milestones are needed |
| Steady Pressing / Double Mold | Implemented | station upgrade catalog/tests | named Tofu Press modifiers; Steady Pressing aligns to $20 and x1.5 output target and is recommended only when stock runway is low/relevant | playtest timing |
| Tidy Packaging / Double Labels | Implemented | station upgrade catalog/tests | named Prep Counter modifiers; Tidy Packaging is the first visible bottleneck-solving upgrade when order prep is slow, costs $20, and shows a before/after prep-rate preview | tune exact feel after playtesting |
| Delivery Shelf | Implemented | station unlock, purchase, Prep Counter boost | first support station improves order throughput | tune cost/reveal timing |
| Shop Sign | Implemented | station unlock, purchase, order Reputation boost | first Reputation support station improves fulfilled-order reputation | tune cost/reveal timing |
| Counter Service / Managed Shop | Implemented | state, Overview card, active-page tick, upgrade cards, tests | starts running on fresh saves, auto-fulfills Best Available orders every 10 seconds while parked/open, reports income/blocked status, improves to 8/6/4 second handoffs, adds 2/5/10 order batches through Second Register, Pickup Window, and Counter Crew, then uses Counter Contract batch floors 100/250/1000; batch size is a maximum and can fall back to smaller affordable order types | tune rates and future priority upgrades after playtesting |
| Supplier Contracts | Implemented | Reputation-cost station upgrades, rates, Next Best Action, tests | Soy Supplier Contract, Morning Soy Delivery, and Bulk Soy Delivery add Tofu Stock/sec as a high-midgame Reputation sink so Counter Service stock blocks are solved through management, not manual Pack Tofu | tune Reputation costs and stock/sec support after playtesting |
| Manager Desk V1 | Implemented | Manager Desk station upgrades, Next Milestone/Next Best Action, Counter Service scalar batch processing, tests | Hire Shift Manager raises Counter Service batch size to 25; Wholesale Pickup clears capped waiting-order batches when supplied without adding a new tab, franchise mode, or per-order objects | tune costs, queue threshold, and whether a later dedicated manager surface is needed |
| High-Scale Counter Contracts V1 | Implemented | Counter Contract state, upgrade panel, high-scale order types, Counter Service batch floors, Goal Stack copy, tests | Wholesale Counter Contract, Catering Account, and Event Vendor Contract spend Cash plus Reputation to unlock Wholesale Case, Event Catering Load, and Venue Supply Contract, raising Counter Service batch floors to 100/250/1000 for late Cash conversion | tune costs and rewards against First Complete Build pacing |
| Routes | Deferred/scaffolding | route catalog retained, active tab/actions gated off | future fictional route cards cannot be purchased/played yet | keep hidden until Routes have a clear shop/Dream Build purpose |
| Crew automation | Placeholder | crew roles/hire helpers | counts and surface exist | real assignment/automation loop later |
| Garage | Partial | garage upgrades/helpers | fictional upgrades exist | clarify pacing and effects |
| Dream Garage concept | Documented only | Dream Garage / Project Car Progression section | future emotional arc is specified | implement only after first loop and order pacing are stable |
| First Dream Build Investment Purchase V1 | Implemented | `buyDreamBuildWheels`, `projectCarValueV1`, `renderDreamInvestmentTargetCard`, Next Milestone/Next Best Action handling | lets the player buy Wheels for `$50K Cash`, starts `$25K Garage Build Value`, and previews Exhaust as target-only | tune target cost/value and timing after managed-shop playtests |
| Net Worth Milestone Ladder V1 | Implemented | milestone helpers and Overview card | shows `$1M`, `$10M`, `$100M`, `$1B`, and `$1T` stepping stones after Net Worth is visible | tune reward copy after playtest |
| Showcase Interest / Showcase Prep V1 | Implemented | `showcaseInterestUnlocked`, `buyShowcasePrep`, Showcase card | unlocks after Dream Build progress and first `$1M`; spends `$500K Cash` for `$300K Garage Build Value` | tune first display pacing after playtest |
| Sponsor Inquiry V1 | Implemented | `sponsorInquiryUnlocked`, `acceptSponsorInquiry`, Sponsor card, Brand Value breakdown | one-time post-Showcase Prep opportunity; grants `$250K Cash` and `$500K Brand Value` | keep recurring sponsor packages and completed events future |
| Project car stages | Documented only | Stage 0 through Stage 3 tables/lists | covered car, daily build, closed-course build, dream build are defined | no runtime state/UI yet |
| Fictional closed-course events | Documented only | event table and safety rules | future event names/rewards are specified | no event queues/results yet |
| Project car completion/sale prestige | Documented only | Builder Stars design | future prestige direction is specified | no Builder Stars state yet |
| Shop Spirit | Implemented | Spirit resources/boost helpers and panel copy | wallet shows Cash, Shop Spirit, Spirit/sec, and multiplier; cards use stable generator/instant/timed sections; permanent Spirit Generators show level/max and cap at 25; `Buy All Affordable` buys permanent Spirit Generators only with a bounded loop, max-level respect, and compact feedback; Rush Stock and Warm Counter use Activate language and show exact inline gain/cost feedback; token cards stay hidden until token generation is implemented; route-related Spirit items stay hidden until route story beats matter | tune emergency-spend pacing and add token earning rules later |
| Rivals | Placeholder | challenge helpers | friendly challenge scaffold exists | keep hidden until later |
| License Exam | Placeholder | exam/perk helpers | reset/perk concept exists | tune requirements and reset strategy |
| Passport | Partial | stamp labels/panel | stamps can unlock | staged reveal and details |
| Ledger | Implemented | capped ledger helpers/tests | records local summaries | filter/clear polish |
| Don't Spill the Cup boosts | Implemented | Cup Test reward helpers/tests | optional certified shop rewards | tune boost magnitude; keep optional |
| Developer QA | Implemented | hidden dev tools | local QA unlocks are gated | must remain hidden from normal users |

## 17. Balance Tests

Future implementation should enforce these tests before the first loop is considered real.

Starting state:

- fresh shop starts with 24 Tofu Stock
- fresh shop starts with 1 Delivery Order
- fresh shop starts with 1 Tofu Press
- fresh shop starts with 1 Prep Counter
- fresh shop starts with $0 Cash
- first order can be fulfilled immediately

First action:

- first order grants Cash, Reputation, and XP
- Simple Tofu Box consumes 6 Tofu Stock and 1 Delivery Order
- Family Tofu Tray unlocks after its condition, consumes 24 Tofu Stock, and pays more Cash
- Festival Bento unlocks after its condition, consumes 75 Tofu Stock and 2 Delivery Orders, and pays the first big reward
- raw Tofu Stock does not directly multiply Cash
- Fulfill Max is labeled with the selected/best order type
- First Shop Order stamp unlocks or is revealed after the first order
- normal shop-order fulfillment stays inline
- Cup Test result offers a parked `Visit Tofu Garage` CTA that lands near the shop action area
- no share-card clutter appears for ordinary shop order results

Order prep:

- fractional orders render as ready orders plus prep progress
- `0.3` internal Delivery Orders renders as `0 ready` and `30% prepared`
- Manual Backup fulfillment explains why it is disabled
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
- early low stock recommends Tofu Press, with Pack Tofu as Manual Backup only
- high-midgame stock-blocked Counter Service recommends Supplier Contracts or scalable supply
- ready orders recommend running or upgrading Counter Service
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
- location may be requested only after `Start Cup Test` to attempt certification
- denied or insufficient location remains playable as a Local Result
- shop actions remain hidden/disabled during active drive

Offline:

- offline production respects a generous direct cap: 24 hours by default, or 72 hours once Manager
  Desk / Shift Manager coverage exists
- offline progress applies once on return
- offline progress is AFK-equivalent within the cap and uses aggregate elapsed-time math, not
  per-second simulation
- existing Cash balances are never capped directly; only newly accrued offline production is capped
- zero-value offline summaries are hidden
- offline summaries should be compact, say `waiting orders`, mention when tofu was spent on prep,
  note that Counter Service remains active-page-only and does not fulfill offline in V1, and expose a
  real `View Ledger` CTA when the summary points to follow-up detail
- long absences show the saved direct progress window and explain that excess time is capped for
  pacing rather than treating the absence as lost time
- Rested Shop Time is deferred; future larger caps can come from later franchise/corporate
  management systems
- ledger summarizes meaningful offline gains

Prestige:

- License Exam does not require real driving
- License Perks do not affect real-world Cup Test scoring or qualification
- reset/persist behavior matches the License Exam contract

## 18. Open Design Questions

These should remain unresolved until playtesting or simulation provides evidence.

- Is Tidy Packaging consistently the right first named upgrade when Prep Counter throughput is the first bottleneck?
- Is 1 order every 40 seconds too slow, too fast, or right for the first 10 minutes?
- Should Manual Backup stay visible forever, or fade further after Tofu Press and Supplier Contracts scale?
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
- After playtesting, should later management systems extend the 72-hour cap or add Rested Shop Time?
- Should Delivery Shelf be a station, an upgrade, or a capacity rule?
