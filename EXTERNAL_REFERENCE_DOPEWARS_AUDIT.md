# External Reference Audit: dopewars

## 1. Executive Summary

This audit studies `/mnt/c/Users/kenne/dopewars` as a read-only external mechanics reference for
Tofu Driver. The reference is GPL, so no source code, comments, constants, item lists, data tables,
assets, phrases, or implementation structure should be copied into Tofu Driver. This document is
original analysis only.

The reference theme is incompatible with Tofu Driver and must be discarded. Its useful lessons are
abstract systems:

- changing opportunity values
- buy/hold/sell decisions
- limited carrying capacity
- timed run pressure
- event-driven surprises
- cash versus inventory tradeoffs
- location choice as an opportunity filter
- a clear end goal that keeps each turn meaningful

What should be ignored:

- illicit theme and terminology
- violence, enforcement, weapons, and multiplayer aggression
- predatory pressure
- public-risk fantasy
- networked social conflict
- any exact data, table, or implementation pattern from the GPL project

Why it is useful anyway:

The core loop makes ordinary resource decisions feel tense because the player rarely has enough
capacity, money, time, or certainty to do everything. Tofu Driver can translate that into cozy shop
and garage decisions: save Tips or buy parts, hold stock or fulfill orders, expand shelf capacity or
wait for better demand, enter a fictional event now or prepare the project car more carefully.

## 2. Core Loop Analysis

In theme-neutral terms, the reference loop is:

1. The player starts with limited cash, limited capacity, and a large goal.
2. A board of opportunities appears, with values that vary by place and turn.
3. The player buys inventory when the opportunity looks favorable.
4. Inventory occupies scarce capacity.
5. The player spends a turn moving to another opportunity set.
6. Events can change prices, create windfalls, create setbacks, or alter priorities.
7. The player sells inventory when value is favorable.
8. The player uses profits to expand capability, reduce pressure, or chase larger opportunities.
9. A limited run length makes every turn a tradeoff.

The abstract decisions are:

- cash now versus held inventory
- capacity for current goods versus space for a future opportunity
- small certain gain versus larger uncertain gain
- paying down pressure versus compounding profit
- moving to a new board versus using the current board
- holding a safety buffer versus taking a bigger position

Tofu Driver translation:

- inventory becomes Tofu Stock, prepared orders, garage parts, and shelf/cooler space
- market values become demand boards, customer rushes, supplier offers, and event prize pools
- locations become fictional shop districts, supplier boards, and garage markets
- travel becomes a parked game-day action, never real driving
- pressure becomes Dream Jar goals, shop bills, project budgets, event readiness, or freshness
- end condition becomes completing/showcasing/selling a project car or reaching the next license arc

## 3. Why The Choices Feel Meaningful

The reference choices work because resources are mutually exclusive.

Limited capacity:
The player cannot carry everything. A cheap opportunity still has a cost because it blocks future
inventory. Tofu Driver can use shelf space, cooler space, prep capacity, and garage space the same
way.

Uncertain future values:
The player never knows whether the next board will be better. Tofu Driver can use daily demand,
supplier offers, customer rushes, and rare part listings to create light uncertainty without
punishment.

Cash versus inventory:
Cash is flexible; inventory can become more valuable. Tofu Driver can make Tips flexible while
Tofu Stock, prepared orders, and garage parts create optional upside.

Timing pressure:
A finite run makes hesitation meaningful. Tofu Driver should use cozy optional windows such as
today's board, festival weekend, event registration, or a project budget target, not stressful or
predatory timers.

Surprise events:
Events interrupt the expected plan. Tofu Driver can turn this into customer stories, supplier
shortages, bonus orders, rare part listings, and sponsor offers.

Changing priorities:
Early play values survival and small profit. Later play values capacity, compounding, and milestone
completion. Tofu Shop can start with order prep, then add demand boards; Dream Garage can start with
basic reliability, then add events and project value.

The player keeps checking because every state has a question:

- Can I fulfill now?
- Is this demand worth saving stock for?
- Should I buy production or wait for a bigger order?
- Should I buy a car part or reinvest in the shop?
- Is this event worth entering now, or should I improve reliability first?

## 4. Tofu Shop Applications

These are safe future mechanics for Tofu Shop. They should not be implemented until the First Loop
Contract and first 10 minutes are tuned.

Daily Tofu Demand Board:
A small board lists demand modifiers for safe order categories. It makes the player ask whether to
fulfill simple orders now or save stock/prep for a better order type. It should be local, fictional,
and parked-only.

Customer Demand Spikes:
A temporary customer rush can make one order type more valuable for the current shop day. It gives
Tofu Stock a purpose beyond buffer because larger orders become timed opportunities.

Supplier Price Variation:
Suppliers can offer tofu inputs or packaging at changing prices. This adds a cash versus inventory
decision: spend Tips now on stock inputs, or save for a station upgrade.

Limited Shelf/Counter Capacity:
Prepared orders should eventually have a cap. Delivery Shelf, coolers, and counters become
meaningful because they let the player hold more prepared work for demand windows.

Special Order Events:
Occasional requests can require a specific mix of Tofu Stock and ready orders. This creates a
targeted decision without adding unsafe driving.

Freshness Pressure:
Freshness can be gentle, such as a bonus for fulfilling prepared orders while fresh. It should not
punish casual players harshly. Avoid decay that makes offline play feel bad.

Bulk Order Choices:
The order-type ladder already points here. Larger orders should consume more stock/orders and pay
better rewards, making stock runway strategically valuable.

Supplier Contracts:
Later, a contract can stabilize one input cost or guarantee supply in exchange for upfront Tips or
Reputation. This creates a long-term planning choice.

Shop Bills Or Dream-Car Savings Goals:
Soft goals can give the player a reason to earn without predatory pressure. Use cozy bills, rent, or
project savings targets only if they motivate rather than punish.

Customer Rush Cards:
Cards can create a temporary story and a clear choice: fulfill now, prep more, or ignore it.

Festival Demand Cards:
Festival windows can raise value for larger orders and unlock stamps. They should be optional and
local-first.

How this improves the current loop:

- Tofu Press matters when demand windows require more stock.
- Prep Counter matters when timed order opportunities need throughput.
- Delivery Shelf matters because capacity becomes a lever.
- Tips matter because the player chooses between production upgrades, supplier buys, and future
  garage goals.
- Larger order types become strategic rather than just richer buttons.

## 5. Dream Garage Applications

Dream Garage can use the same abstract tradeoffs with a safer fantasy:

Rare Part Listings:
Occasional parts appear for a limited game window. The player decides whether to buy now, save Tips,
or reinvest in the shop first.

Part Market Fluctuations:
Parts can have changing availability or cost bands. This should be transparent and not gambling-like.
The player should know what a part does before buying.

Buy/Sell Parts:
Spare parts can occupy garage space and be sold for Tips or project credit. This creates inventory
management without crime or risk fantasy.

Garage Inventory Capacity:
Garage shelves, tool cabinets, and parts bins make capacity upgrades meaningful. Capacity should
unlock larger build opportunities, not become tedious clutter.

Project Budget Pressure:
A Dream Jar or project budget can act as a goal meter. It gives a reason to keep working ordinary
shop shifts while preserving Tips as the actual currency.

Sponsor Offers:
A sponsor offer can reward style, reliability, or event readiness. It should be fictional and
optional, never tied to real driving or speed.

Event Entry Fees:
Closed-course fictional events can require Tips and readiness. The player chooses between entering
now or improving the build.

Car Value Changes:
Project Car Value can rise with parts, reliability, style, and event reports. It becomes the garage
equivalent of long-term net worth.

Dream Jar / Garage Fund:
The Dream Jar can visualize saved Tips for the next part. It should start as a goal meter, not a
confusing new currency.

Sell Completed Build / Start Next Project:
Completing or selling a project car can become garage prestige. The player starts the next project
with permanent builder identity or convenience perks.

Builder Stars / Garage Legacy:
Use a separate garage prestige track only if Dream Garage becomes deep enough to need it. Keep it
separate from License Stars unless playtesting shows a unified prestige is simpler.

This creates the intended fantasy:

Work shop shifts, make careful money decisions, build a car slowly, enter fictional closed-course
events, earn status, then complete or sell the build to fund the next dream.

## 6. Mechanics To Avoid

Avoid these outright:

- drugs
- crime
- cops
- weapons
- street racing
- speed rewards
- public road competition
- risky driving
- high-G bragging
- route leaderboards
- gambling-like loot boxes
- predatory debt pressure
- shame/report systems
- raw GPS upload
- raw motion upload
- maps, street names, route traces, exact distance, or coordinates in shop progression
- any mechanic that makes real-world driving riskier
- any garage part that improves real-world Cup Test scoring or qualification

## 7. Candidate Tofu Driver Systems

| Reference Mechanic | Why It Works | Tofu Driver Translation | Where It Fits | Risk / Guardrail | Priority |
| --- | --- | --- | --- | --- | --- |
| Fluctuating demand | Creates a reason to check the board and choose timing | Tofu Demand Board with local customer demand | Tofu Shop after first loop | Keep values fictional/local; no real-world location | Soon |
| Inventory capacity | Forces tradeoffs instead of hoarding everything | Shelf/cooler/counter capacity | Tofu Shop first-hour systems | Avoid punishing casual offline play | Soon |
| Rare event price spike | Creates memorable opportunities | Festival demand or customer rush card | Tofu Shop after order types | Optional, not required for progress | Later |
| Limited-time opportunity | Makes the current state matter | Daily Opportunity Cards | Shop day / garage market | Cozy windows, not stress timers | Later |
| Cash versus inventory decision | Makes money flexible and inventory risky/useful | Tips versus Tofu Stock, prepared orders, garage parts | Tofu Shop and Dream Garage | Explain consequences before purchase | Soon |
| Goal pressure | Gives a run a purpose | Dream Jar / project budget / shop bill | Dream Garage teaser and later shop goals | No predatory debt; no shame | Later |
| Location choice | Filters opportunities | Fictional district/customer/supplier board | Future Tofu Shop board | Parked selection only; no real maps | Later |
| Capacity upgrade | Makes expansion concrete | Delivery Shelf, cooler, garage shelves | First Shop / Dream Garage | Capacity unlocks opportunity, not clutter | Soon |
| Random event | Adds stories and surprise | Customer rush, supplier shortage, rare part listing | Shop and garage reports | Avoid traps and unsafe prompts | Later |
| End condition | Gives the run an arc | Completed build, sold build, next project car | Dream Garage prestige | Future only, after garage loop is fun | Later |
| Combat/conflict | Adds danger in the reference | Do not translate | Nowhere | Incompatible with Tofu Driver | Avoid |
| Predatory debt | Creates pressure in the reference | Do not translate directly | Nowhere | Use optional goals instead | Avoid |

## 8. Recommended Design Changes

| Candidate | Rank | Why It Helps | Player Decision | When It Should Appear | Safety / Privacy Guardrail |
| --- | --- | --- | --- | --- | --- |
| Tofu Demand Board | Soon | Makes larger orders and stock runway strategic | Fulfill now or prep for better demand | After First Loop Contract is tuned | Local fictional demand only |
| Supplier Market | Later | Gives Tips another use and makes stock acquisition a choice | Buy ingredients now or save for upgrades | After order types feel good | No real suppliers or location |
| Customer Rush Events | Later | Adds story and timing variety | Chase a temporary order or ignore it | After Family Tofu Tray is understood | Optional, parked-only |
| Garage Parts Market | Later | Gives Dream Garage a lively economy | Buy part now, wait, or reinvest in shop | After Dream Garage Stage 0 | No real mechanical advice |
| Dream Jar / Project Budget | Later | Creates emotional long-term goal | Save for part or improve shop | Dream Garage teaser | Not debt, not payments |
| Daily Opportunity Cards | Later | Adds surprise without big systems | Choose one small opportunity | After first 10 minutes are tuned | No in-drive prompts |
| Shop Bills / Rent | Avoid for now | Could motivate earnings but risks feeling punitive | Pay goal versus reinvest | Only if playtests need soft goals | Cozy, optional, non-predatory |
| Project Car Value / Sell Build | Later | Creates garage prestige arc | Keep/showcase or complete/sell | After Stage 3 garage loop | Fictional status only |
| Supplier Contracts | Later | Adds planning and stability | Pay upfront for predictable input | After Supplier Market | Local-only, no real vendors |
| Garage Inventory Capacity | Later | Makes parts management meaningful | Expand space or choose parts carefully | Dream Garage Stage 0-1 | Avoid clutter and punishment |
| Rare Part Listings | Later | Creates memorable garage moments | Buy now or miss a cosmetic/build chance | Dream Garage Stage 1+ | Transparent odds; no loot boxes |
| Sponsor Offers | Later | Rewards style/reliability choices | Take offer or keep current plan | After closed-course events | Fictional, no real endorsement claims |
| Fictional Closed-Course Event Prize Pools | Later | Gives builds a reason to exist | Enter now or improve readiness | Dream Garage Stage 1-2 | No real driving, speed, GPS, maps, or high-G data |

Immediate recommendation:
Do not build these systems next. Finish playtesting the First Loop Contract and first 10 minutes
first. The best near-term design candidate after that is a very small Tofu Demand Board because it
directly reinforces Tofu Stock, order types, and Prep Counter throughput.

## 9. Tofu Driver-Safe Design Principles Extracted

- Inventory should create decisions, not clutter.
- Demand variation should create opportunity, not punishment.
- The player should choose between reinvesting in the shop and saving for the dream car.
- Surprise events should feel like stories, not traps.
- Capacity upgrades should unlock larger opportunities.
- Time pressure should be cozy, optional, and local to the game day.
- The best opportunity should not always be obvious; the next action should be clear when the
  player is stuck.
- Cash should stay flexible; inventory should create commitment.
- A goal meter can create motivation without predatory pressure.
- Real driving must never become racing, route optimization, or risk-taking.

## 10. Relationship To Current Progression Contract

Docs inspected for alignment:

- `BALANCE_AND_PROGRESSION.md`
- `DESIGN.md`
- `PLAN.md`
- `IMPLEMENTATION_STATUS.md`
- `README.md`

Current concepts reinforced:

- Tofu Stock as ingredient/runway/order-size capacity.
- Delivery Orders as prepared work.
- Tips as the flexible purchase currency.
- Larger order types as the first stock sink.
- Delivery Shelf as a future capacity/throughput lever.
- Dream Garage as a future emotional sink for Tips.
- Dream Jar / Garage Fund as a goal meter rather than an early currency.
- Project Car Value and completed-build prestige as future garage arcs.
- Progressive reveal: the dashboard is earned, not dumped on first load.

Concepts to reconsider:

- Shop bills/rent should remain optional and soft, or they risk feeling punitive.
- Daily opportunity windows should be forgiving enough for idle/offline play.
- Supplier variation should not undercut the clarity of the first order loop.
- Capacity should not become tedious micromanagement.

Future-only concepts:

- Tofu Demand Board.
- Supplier Market.
- Customer Rush Events.
- Garage Parts Market.
- Dream Jar allocation mechanics.
- Project Car Value and build sale/completion prestige.
- Fictional district/customer boards.
- Event prize pools.

Do not add until the First Loop Contract feels good:

- market-like demand variation
- supplier boards
- garage markets
- daily opportunity cards
- closed-course event prize pools
- any new prestige loop

## 11. Supporting Doc Updates

This audit should be referenced lightly from the product docs as an external mechanics study only.
It should not become a runtime requirement until a future implementation prompt explicitly scopes a
Tofu Demand Board, Supplier Market, Dream Garage market, or related system.

## 12. Status Accuracy

All dopewars-inspired Tofu Driver concepts in this audit are `Documented only` or `Future`.

They are not implemented unless a future change adds all of the following:

- local state changes
- visible UI
- player feedback
- tests
- safety/privacy review

No GPL code, data, assets, comments, item lists, or implementation structure should be imported.

## 13. PLAN.md Discipline

The next implementation priority remains:

1. Finish and playtest the First Loop Contract.
2. Tune the first 10 minutes.
3. Fix meaningful upgrade timing and visibility if playtesting shows remaining problems.
4. Only then consider future systems such as Tofu Demand Board, Supplier Market, Dream Garage
   teaser, or Garage Parts Market.

Do not make this audit the next coding task by default.
