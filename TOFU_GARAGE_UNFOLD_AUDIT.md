# Tofu Garage Meaningful Unfold Audit

This audit checks whether current Tofu Garage resources and systems create understandable idle-game
decisions. It is inspired by incremental-game usability patterns such as bulk buying, progress to
afford, offline summaries, and resource chains, but it translates those lessons into Tofu Driver
language.

## Audit Standard

Each visible resource or system should answer:

- what it is
- how it is produced
- how it is spent
- what decision it creates
- when it unlocks
- what bottleneck it solves
- what later system it supports
- whether it is meaningful now, decorative, confusing, or deferred

If a system cannot answer those questions, it should be hidden, clearly marked future/deferred, or
kept out of the primary Tofu Garage loop.

## Current Resource And System Inventory

| Resource / System | What It Is | Produced By | Spent / Used By | Decision Created | Unlock | Bottleneck Solved | Later Support | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tofu Stock | Ingredient/runway for shop orders | Tofu Press, Supplier Contracts, Rush Stock, offline production | Prep Counter, shop orders, larger order types | improve supply or spend stock on larger payouts | start | stock shortage | Family Tray, Festival Bento, Catering Crate | meaningful |
| Delivery Orders | Prepared/waiting shop work | Prep Counter, Warm Counter, offline prep | Counter Service, Manual Backup, Wholesale Pickup | improve prep or improve handoff throughput | start | no money opportunities or queue full | Counter Service, Manager Desk | meaningful |
| Cash | Player-facing liquid currency earned from tips; stored in legacy `shop.tips` internally | Counter Service, shop orders, Wholesale Pickup | stations, upgrades, Manager Desk, future car parts/businesses | buy the next bottleneck fix or later invest in assets | first handoff | cannot afford next improvement | all shop expansion, Net Worth V1 | meaningful |
| Reputation | Unlock/status currency and shop contract sink | shop orders, Shop Sign, driver bonus | Supplier Contracts, Manager Desk, Counter Contracts, unlock gates | spend status to secure supply or larger Cash handoffs | first handoff | stock trap with low Cash, then Cash conversion bottleneck | Supplier Contracts, Manager Desk, Counter Contracts | meaningful |
| Shop Level | Derived progression label from Reputation | Reputation growth | unlock checks | reach phase gates | start | communicates progression tier | Supplier/Manager gates | meaningful, derived |
| Shop Spirit | Parked emergency/activation resource | Spirit generators capped at Level 25 | Rush Stock, Warm Counter, timed effects | activate Spirit for bottleneck moments | after shop momentum | short-term recovery | future boost economy | meaningful but tune carefully; token cards are hidden until token earning exists |
| Prep Capacity | Recovering station-expansion pool | timed regen, future License Perks | station purchases | choose when to expand stations | start but mostly felt after purchases | prevents unlimited instant station buying | staffing/license ideas later | meaningful, should stay explained as slots open, not as the prepared-order queue |
| Shop Reach | Fictional footprint | future route scaffolding | future route/district unlocks | future route expansion | routes only | not a current decision | route network | deferred/hidden |
| License Stars | Prestige currency | License Exam | License Perks | reset for permanent perk | later prestige | plateau restart | future prestige | deferred for current first-loop tuning |
| Counter Service | Automatic handoff system | starter system plus upgrades | consumes Tofu Stock and Delivery Orders | start/pause, upgrade interval/batch | start | repeated manual fulfillment | Manager Desk, Wholesale Pickup | meaningful |
| Supplier Contracts | Reputation-funded stock support | station upgrades | adds Tofu Stock/sec | spend Reputation to solve supply trap | managed-shop stock pressure | high-midgame stock bottleneck | Catering Crate, Manager Desk | meaningful |
| Catering Crate | Larger order type | order catalog unlock | consumes large stock/orders | choose bigger managed-shop payout | midgame | stock/order stockpiles | Supplier/Manager tuning | meaningful |
| Manager Desk | Managed-shop layer | high Reputation and shop level | batch/queue upgrades | turn queue pressure into throughput | after Counter Crew/Catering scale | maxed Counter Service plateau | future franchise only later | meaningful V1 |
| Wholesale Pickup | Capped managed queue clearing | Manager Desk upgrade | consumes scalar orders/stock | clear full queue without per-order objects | after Hire Shift Manager | order queue cap | Covered Car teaser, future manager economy | meaningful V1 |
| Counter Contracts | High-scale parked shop contracts | Manager Desk scale plus Reputation | Cash and Reputation | unlock wholesale/catering/vendor handoffs and larger Counter Service batch floors | after Shift Manager and batch 25 | high backlog with Cash conversion too slow | Car Management/event economy later | meaningful V1 |
| Covered Car / Dream Build Teaser | Parked story/status carrot | Manager Desk scale and Wholesale Pickup progress | seen/acknowledged state only | understand that the shop funds the dream | after managed shop proves itself | motivation after the first shop layer | future Dream Garage planning | implemented story/status only |
| First Dream Build Investment | Wheels Fund purchase, Wheels work levels, Exhaust, Suspension, Tires, Brakes, Induction, Drivetrain, Aero, Final Detail, Shakedown, Dream Build Progress, Showcase Prep V1, Sponsor Inquiry V1, Garage Event Board V1, and Car Management V1 | Cash from Tofu Shop orders and shop automation | subtracts Cash, raises Garage Build Value, can add one-time Cash and Brand Value through Sponsor Inquiry/events and collected assignment rewards | decide whether to fund careful garage/story work or keep growing the shop | after covered-car teaser, stable shop state, Wheels level 3 for Exhaust, first `$1M Net Worth` for Showcase Interest, Showcase Prep for Sponsor Inquiry, `$100M Net Worth` plus Tires Level 5 for Garage Event Board, Induction Level 5 for Drivetrain, Drivetrain Level 5 for Aero, Aero Level 5 for Final Detail & Shakedown, and First Complete Build for Car Management | proves multi-part buy-once/work-level model without speed/performance framing | Wheels levels 4-5, recurring sponsor packages, repeatable event boards, multiple cars, future Dream Garage design | meaningful V1 purchase/work/progress |
| Net Worth Milestones | Long-term value ladder toward `$1T Net Worth` | Cash, Tofu Business Value, Garage Build Value, Brand Value | milestone state is tracked; no separate spend | gives concrete stepping stones and unlocks Showcase Interest at first `$1M` | after Net Worth V1 is visible | vague `$1T` goal with no intermediate carrot | Showcase Prep, Sponsor Inquiry, later business opportunities | meaningful V1 guidance |
| Brand Value | Fictional value from careful garage-build attention | one-time Sponsor Inquiry V1 and Garage Event Board V1 | contributes to Net Worth V1 only | show smooth garage investment can create business value | after Showcase Prep/first `$1M Net Worth`, then event board at `$100M` plus Tires Level 5 | Net Worth path feels only like cash saving | recurring sponsor packages later | meaningful V1, no recurring income |
| Passport Stamps | Local status/milestone layer | shop and Cup Test milestones | collection/progress feedback | pursue short-term proof | first stamp | lack of direction | later achievement layers | meaningful |
| Driver Bonus | Small capped shop Reputation bonus | Delivery Driver level from Cup Test | order Reputation multiplier | Cup Test status helps shop lightly | driver level threshold | connection between modes | status identity | meaningful, capped |
| Delivery Crew placeholder | Cosmetic/collection surface | unlocked/selected character art | parked art/cosmetic selection | choose identity later | nav surface | avoids dead nav | future crew stories | placeholder, not gameplay |
| Routes tab/cards | Fictional parked route cards | route scaffolding retained only | route rewards deferred | future route choices | hidden/deferred | not a current shop bottleneck | route network | deferred/hidden; not purchasable |
| Shop Spirit actions | Emergency stock/order/timed boosts | Shop Spirit | instant/timed spends | spend only when bottlenecked | Shop Spirit panel | short-term bottleneck relief | later boost tuning | meaningful but must avoid click loops; fixed card order and inline feedback are required |

## UI Changes From This Audit

- Bulk Buy Stations and Bulk Buy Upgrades belong in existing Production and Upgrades surfaces.
- Bulk buy actions must only buy visible, unlocked, meaningful, non-maxed items.
- Route, Regular Customer, Dispatcher Desk, Regional Network, and other future/scaffolded purchases
  should not be included in bulk buying until their systems are meaningful.
- Gameplay Routes are now fully deferred in the live UI: no `Routes` tab, no Route Familiarity or
  Careful Notes purchases, no route Spirit actions, and no route recommendations.
- Affordability progress should appear on visible non-maxed station and upgrade cards, using the
  limiting resource and an ETA only when the relevant income rate is positive.
- Returning-player offline summaries should include at most three useful suggestions and should not
  point to Manual Backup as the primary midgame action.

## Recommended Unfold Sequence

Current implemented layer:

```text
Starter shop -> Counter Service -> Station Milestones -> Supplier Contracts -> Manager Desk
```

Current latest unfold:

```text
Covered Car / Dream Build Teaser V1 -> First Dream Build Investment Purchase V1 ->
Wheels Work Levels V1 -> Exhaust Purchase + Work Level V1 -> Core Build Progress V2 ->
Net Worth Milestone Ladder V1 -> Showcase Interest / Showcase Prep V1 -> Sponsor Inquiry V1 ->
Overview Glance Mode V1 -> Dream Build Tab V1 -> Suspension Track Completion V1 ->
Tofu Garage Tuning Catalog V1 -> Tires & Rubber Track V1 -> Brakes & Control Track V1 ->
Induction & Cooling Track V1 -> Drivetrain & Transmission Track V1 ->
Aero, Styling & Weight Reduction Track V1 -> First Complete Build V1 -> Car Management V1.
Garage Event Board V1 now follows Tires & Rubber Level 5 plus `$100M Net Worth` as the first
one-time parked event bridge.
```

Overview Glance Mode V1 does not add a new resource or system. It clarifies the current unfold by
separating live `Now`, stable `Pinned Goal`, and long-term `Era Goal`, while moving long formulas
and explanations behind Details controls. After the build starts, the earned Dream Build tab holds
the detailed Wheels, Exhaust, Suspension, Tires, Brakes, Induction, Drivetrain, Aero, Final Detail,
Garage Build Value, and Builder Note content. After Carbon Body & Roll Cage, it offers Final Detail
and Shakedown as the last two local core build steps; after Shakedown it points to Car Management
as the first managed-car loop.

Car Management V1 now unlocks after First Complete Build, snapshots the completed car locally, and
adds one active parked assignment at a time: Showcase Rotation, Sponsor Demo Day, and
Closed-Course Exhibition Booking. Assignment rewards grant local Cash, Brand Value, and Garage
Reputation only when collected. Multiple cars, auctions, collector offers, and repeatable board
expansion remain future.

Tofu Garage Tuning Catalog V1 is canonical source material, not a live parts dump. The full list is
documented in `TOFU_GARAGE_TUNING_CATALOG.md`; the Dream Build tab may show a collapsed category
preview only. Authentic tuner terms are allowed in Tofu Garage as fictional game vocabulary, while
Don’t Spill the Cup scoring, certification, route proof, Driver XP, and real-driving rewards remain
separate.

Later:

```text
Wheels levels 4-5 -> recurring sponsor package design -> completed-build event design ->
Multiple cars -> Keep / Show / Auction choice -> full Net Worth accounting.
```

Avoid for now:

```text
full asset valuation, company value, separate dollar balances, shares as the main target, full
car-part inventory in V1, routes expansion, crew gameplay, franchise mode, social
systems, backend sync, multiplayer, payments, service workers, uploads, or network calls.
```

Dream Build progression should buy each part once, then improve that part through work levels.
Avoid duplicate part-buying loops such as `Buy Wheels x10`. Future work should use verbs like
Polish, Fit, Balance, Tune, Refine, Wrap, Detail, Finish, and Showcase. Completed-build events
remain future and should use Keep, Showcase, Closed-Course Exhibition, Auction, or Collector Offer
choices only after part-level progression is proven.

## Risks / Anti-Patterns

- Random counters without a spend decision.
- Separate Tips and dollar balances that make one order payout feel like two currencies.
- Future tabs visible before they solve a current bottleneck.
- Bulk buy actions that spend into hidden or deferred systems.
- Progress bars with fake ETAs while income is blocked.
- Offline summaries that report production without suggesting what to do next.
- Returning-player screens that push Manual Backup instead of management decisions.
- Large lists or repeated feedback that reintroduce high-scale lag.

## Follow-Up Recommendations

1. Playtest whether Buy Cheapest is enough for returning players or whether Buy All is used often.
2. Tune which resources count as reliable ETA income after observing high-midgame saves.
3. Keep Routes, Regular Customers, License prestige, and full Dream Garage future/deferred until
   the current shop layer is clear after multiple returns.
4. Add future unfold audits before each large new layer.
