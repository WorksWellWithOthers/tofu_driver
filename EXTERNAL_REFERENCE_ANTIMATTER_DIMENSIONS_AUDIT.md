# External Reference Audit: Antimatter Dimensions

## 1. Executive Summary

This audit studies `ANTIMATTER_DESIGN.md` and `ANTIMATTER_WIKI.md` as local reference material for
Tofu Driver progression architecture. It is original analysis only. Do not copy the reference text,
theme, mechanics names, formulas, UI, assets, data tables, or implementation structure into Tofu
Driver.

The useful lesson is not the setting or exact math. The useful lesson is the progression spine:
early manual production teaches a small loop, repeated purchases create milestone bumps, visible
locked reset goals become motivation, challenges prove mastery, automation removes chores, and
prestige makes the old loop faster instead of obsolete.

What is worth borrowing:

- recursive production where each layer feeds or boosts an earlier layer
- count milestones that make repeat purchases feel intentional
- one visible major threshold that pulls the player forward
- reset/prestige buttons that are visible as goals before they are usable
- optional timing decisions that briefly slow progress for stronger future output
- achievements as goals, fanfare moments, and later small multipliers or unlock keys
- challenges that reuse previous mechanics under constraints
- automation unlocked after the player has manually proven understanding
- later production layers that revive old resources instead of replacing them
- passive generation based on prior best performance or completed milestones

What must not be copied:

- sci-fi theme, wording, exact names, exact formulas, exact costs, exact phase labels, UI layout, or
  implementation structure
- raw large-number spectacle without a Tofu Shop purpose
- any speed, racing, public-road, high-G, GPS, raw motion, route leaderboard, or active-drive reward
  mechanic
- all-at-once system reveal that would undermine Tofu Shop's mystery

How this differs from the dopewars reference:

- `EXTERNAL_REFERENCE_DOPEWARS_AUDIT.md` is about opportunity choice: capacity, fluctuating demand,
  cash versus inventory, and short-run tradeoffs.
- This audit is about long progression architecture: recursive production, milestones, automation,
  achievements, challenges, reset layers, and old-system relevance.

The right Tofu Driver use is narrow: use these lessons to strengthen Tofu Shop and later Dream
Garage pacing after the current first loop is playtested. Do not implement these ideas as a broad
system dump.

## 2. Reference Coverage

| Reference File | What Was Inspected | What It Contributed | Use In This Audit |
| --- | --- | --- | --- |
| `ANTIMATTER_DESIGN.md` | Design analysis of early production, milestone purchases, reset layers, achievements, challenges, automation, later resource layers, and old-system relevance | Clear explanation of why recursive production, meaningful prestiges, automation after mastery, and challenge rewards work | Primary source for architectural principles and Tofu Shop translation |
| `ANTIMATTER_WIKI.md` | Long-form progression guide with phase timing, major threshold sequence, automation era, challenge era, later prestige layers, build choices, and late-game reset loops | Shows how goals appear over hours/days, how unlocks are staged, and how later layers reshape earlier loops | Source for timing/phase structure and "visible future goal" lessons |
| `BALANCE_AND_PROGRESSION.md` | Current Tofu Shop economy and progression contract | Defines current Tofu Press, Prep Counter, order types, stations, stamps, and future License/Dream Garage framing | Anchor for safe translations |
| `CORE_GAME_SPINE_AUDIT.md` | Evidence audit for current first-loop implementation | Identifies current implemented spine and deferred systems | Prevents overstating implementation status |

## 3. Detailed Progression Architecture Map

| Reference Structure | What It Does In Antimatter Dimensions | Why It Works | Tofu Shop Translation | Implementation Timing |
| --- | --- | --- | --- | --- |
| recursive production chain | Higher production tiers create lower production tiers, which create the main resource | Old tiers stay relevant because higher tiers increase their supply instead of replacing them | Tofu Press -> Tofu Stock, Prep Counter -> Delivery Orders, Delivery Shelf -> Prep Counter support, Regular Customers -> uses orders for passive Tips | Core rule now; deepen later |
| buy-10 / count milestones | Buying enough of one tier creates a noticeable production bump | Repeated buys are not just linear; the next count target becomes a mini-goal | station milestones at 5/10/25 owned for Tofu Press, Prep Counter, Delivery Shelf, Shop Sign | Soon, after first-loop tuning |
| global rhythm/rate upgrades | A separate upgrade improves the cadence of the whole early loop | Small repeated upgrades smooth the waiting problem and remain useful across tiers | Shop Rhythm / Counter Pace upgrades that improve prep cadence or order handling, not driving speed | Later First Shop |
| visible reset button before usable | A major reset action is visible as a locked goal before the player can trigger it | The player understands the next mountain even while doing the current loop | locked License Exam preview with requirements, hidden from first loop but visible near plateau | Later, after first-shop plateau |
| mini-prestige reset | A smaller reset unlocks a new production layer and speeds the rebuild | Reset has a clear reason: new tier plus lower-tier multipliers | Shop Expansion milestone that spends progress to unlock Delivery Shelf/Shop Sign support and strengthens early stations | Future design, not first loop |
| larger reset milestone | A deeper reset improves a global cadence or multiplier | The player accepts a bigger reset because the entire loop improves afterward | License Exam grants License Stars and shop-only rebuild perks | Later, 4-6 hours target |
| optional timing decision | Player chooses when to reset a subset of production for a stronger later state | Adds agency beyond "buy when affordable" and creates mastery | Counter Reset / Batch Prep decision that pauses a station briefly for stronger output, only if it is legible and cozy | Later, optional; likely not V1 |
| achievements | Side goals grant small global bonuses or special utility | They add direction, reward alternate play, and make future rebuilds faster | Passport Stamps with fanfare, small shop-only perks later, and unlock keys for safe systems | Current as stamps; multipliers later |
| challenges | Constrained runs test earlier mechanics and unlock automation/QoL | They make the player demonstrate understanding before chores are automated | Shop Trials, Festival Orders, Counter Rush, Supplier Shortage Trial | Later, after first shop |
| autobuyers | Automation is earned by completing challenges and then upgraded | Automation feels deserved and removes chores without skipping learning | Counter Service, Regular Customers, Dispatcher, automation rate/bulk/priority upgrades | Later; not before First 10 Orders |
| first prestige | Reaching a major threshold resets the early game for prestige currency and upgrades | Old game becomes a faster repeatable loop with new choices | First License Exam with License Stars and shop-only perks | Later, not first hour |
| expansion beyond first prestige | The cap opens and rewards scale with how far beyond the old goal the player pushes | Player can choose short cycles or longer pushes for better payout | post-License order/run length choices: short rebuild for Stars versus longer shop push for extra rewards | Future |
| later production layers | New production families feed broad multipliers and revive prior resources | Old resources matter again because later layers depend on them | Shop Districts, Regional Tofu Network, Dream Garage value loops | Future |
| passive generation from prior best | Later upgrades produce prestige/resource flow based on previous peak performance | Best runs keep mattering after the player steps away | safe passive Tips/Reputation based on best shop report or stamp count, never driving telemetry | Future only |
| branching upgrade tree | Player chooses build paths for active, passive, or idle play | Different play styles become valid without replacing the core loop | shop policy choices: active counter play, passive customers, or balanced support | Later, after automation |
| repeated challenge completions | Challenges can be revisited for stronger rewards and unlock pathing | Old challenge content stays relevant | repeatable Shop Trials with capped tiers and QoL rewards | Future |

## 4. Deeper Tofu Shop Production Cascade

The current cascade is:

```text
Tofu Press -> Tofu Stock
Prep Counter -> Delivery Orders
Order Types -> Tips / Reputation / XP
```

The future cascade should preserve lower-layer relevance.

| Layer | Makes This Lower Layer More Valuable | Bottleneck Solved | New Decision Created | Suggested Unlock |
| --- | --- | --- | --- | --- |
| Delivery Shelf | Prep Counter and ready orders | counters prepare work faster than the player can manage or hold | buy more raw counters or buy support for the counters already owned | after First 10 Orders or First Family Tofu Tray |
| Shop Sign | Reputation from order fulfillment | the shop needs recognition for later systems | spend Tips on direct production or on Reputation growth | after 10 Reputation / First 100 Tips / Delivery Shelf |
| Regular Customers | Delivery Orders and order capacity | manual fulfillment becomes repetitive | keep orders for active big payouts or let regulars convert some passively | after 25 fulfilled orders or Shop Sign |
| Counter Service | ready orders and fulfillment buttons | order handoff is now a chore | choose automation priority: simple orders, best order, or stock-safe mode | after First 10 Orders plus one Shop Trial |
| Supplier Contracts | Tofu Press and stock runway | stock input becomes volatile or larger orders strain supply | buy production capacity or stabilize input supply | after Family Tofu Tray is familiar |
| Shop Districts | order types, Reputation, Shop Reach | local shop loop needs new demand context | invest in higher demand areas or keep upgrading base shop | after Delivery Shelf and Shop Sign are meaningful |
| Dream Garage | Tips, stamps, and shop milestones | Tips need a long-term emotional sink | reinvest in shop production or save for project-car progress | teaser exists; full system after shop loop is stable |
| Project Car Value | Dream Garage parts and event readiness | garage needs prestige pressure | keep/showcase build or complete/sell for long-term perks | late Dream Garage |
| Regional Tofu Network | all earlier shop stations | late-game scaling needs a broad multiplier | expand network or prepare for License/Dream prestige | post-License |

Design constraint:

Every new layer must answer one of these questions:

- What earlier station/resource does this make more important?
- What bottleneck does it solve?
- What decision does it add?
- Why is this visible now?

If a layer cannot answer those questions, it should stay hidden.

## 5. Milestone Boost Plan

The reference uses repeated purchase-count thresholds to make a familiar station exciting again. The
Tofu Shop version should be smaller, clearer, and revealed only when relevant.

| Milestone | Visible Before Unlock? | Feedback | Effect | Why It Keeps Old Systems Relevant |
| --- | --- | --- | --- | --- |
| 5 Tofu Presses | teaser after 3 presses | inline milestone | Tofu Press output x1.5 | rewards investing in stock when larger orders strain Tofu Stock |
| 10 Tofu Presses | after 5-press milestone | inline milestone | Tofu Press output x2 | keeps press purchases meaningful after Prep Counter dominates |
| 25 Tofu Presses | hidden until mid-game | compact milestone result | unlock or boost Supplier Contract options | ties stock production to later demand systems |
| 5 Prep Counters | teaser after 3 counters | inline milestone | order prep x1.5 | makes order throughput scale without adding a new system |
| 10 Prep Counters | after 5-counter milestone | inline milestone | order prep x2 | keeps Prep Counter central after Delivery Shelf appears |
| 10 Simple Tofu Boxes fulfilled | visible as Next Milestone | Stamp Fanfare or inline stamp | First 10 Orders stamp; may hint Tidy Packaging/Delivery Shelf | rewards mastering the tutorial order |
| 5 Family Tofu Trays fulfilled | teaser once Family exists | inline milestone | Delivery Shelf teaser or larger-order stamp | proves extra stock has become meaningful |
| 25 fulfilled orders | visible after 10 orders | stamp or Discovery Fanfare | Delivery Shelf active or support-station milestone | turns manual repetition into shop expansion |
| First 100 Tips | visible after first upgrade | story beat | covered-car teaser or shop expansion beat | gives Tips emotional purpose beyond purchases |
| 5 Delivery Shelves | hidden until Delivery Shelf owned | inline milestone | Prep Counter support improves | keeps shelf purchases from feeling decorative |
| 5 Shop Signs | hidden until Shop Sign owned | inline milestone | Reputation gain improves | keeps Reputation station relevant before routes/license |

Milestone rules:

- first-loop screen shows at most one next milestone
- Production can show the next station-specific milestone once that station is relevant
- Passport records milestone stamps, but the full stamp catalog remains hidden early
- fanfare is reserved for first-time emotional milestones; normal count boosts use inline feedback
- milestone boosts must be shop-only and must not affect real-world Cup Test scoring or qualification

## 6. Next Milestone Bar Design

The reference material repeatedly uses visible next thresholds to make long growth legible. Tofu
Shop should translate this into one restrained Overview component.

Purpose:

- answer "what am I working toward?"
- pull the player through the next 2-5 minutes
- avoid exposing the full roadmap
- make stamps and support stations feel earned

Placement:

- Overview, below Current Bottleneck / Next Best Action and above detailed station cards
- compact enough for mobile
- hidden during active Cup Test

Selection priority:

1. First Shop Order if no order has been fulfilled.
2. First Upgrade Purchased if no upgrade has been bought and one is relevant.
3. First 10 Orders if the player is repeating simple fulfillment.
4. First Family Tofu Tray once Family is close or unlocked.
5. First 100 Tips once the player understands Tips.
6. Delivery Shelf unlock once order throughput is the bottleneck.
7. Shop Sign unlock once Reputation matters.
8. Regular Customers unlock once manual fulfillment becomes repetitive.
9. Covered Car teaser if the story beat has not fired and the player hits its milestone.
10. First License Exam later, only when the first-shop plateau is visible.

Display contract:

| Field | Purpose |
| --- | --- |
| label | one concrete goal |
| progress | current count / target |
| reward hint | stamp, station reveal, story beat, or support unlock |
| reason | one short line explaining why it matters |
| status | active, complete, or hidden |

Avoid:

- showing multiple future systems
- listing Routes, Crew, Spirit, Dream Garage, or License in the first loop
- using raw idle accumulation alone to reveal advanced goals
- presenting the milestone bar as a mission timer or pressure system

When complete:

- show a short inline celebration or fanfare if it is a major first
- advance to the next relevant goal
- add a ledger entry if it changes progression
- do not interrupt repeated order fulfillment unless the milestone is a first stamp/system reveal

## 7. Automation After Mastery

The reference does not hand automation to the player immediately. It makes the player use the
manual loop, then awards automation as proof of mastery and quality-of-life.

Tofu Shop automation arc:

| Automation | Unlock Proof | Automates | Upgrade Knobs | Why It Waits |
| --- | --- | --- | --- | --- |
| Counter Service | First 10 Orders plus one support upgrade | handoff of prepared shop orders | interval, bulk count, order priority, stock reserve | player must understand that orders become Tips first |
| Regular Customers | 25 fulfilled orders or Shop Sign owned | slow passive conversion of ready orders into Tips | customer count, order preference, Tip bonus | player should feel manual fulfillment become repetitive |
| Shelf Routine | Delivery Shelf owned and multiple counters | order handling/capacity support | capacity, prep support, overflow behavior | shelf should solve a known order-flow problem |
| Dispatcher | first route/shop assignment loop exists | fictional route/shop assignment | priority, queue size, assignment rules | routes/crew must be meaningful first |
| Counter Service Bulk | Counter Service has been used for a while | batch fulfillment | max batch size and delay | bulk automation should follow single-action automation |

Automation principles:

- automation removes chores, not decisions
- automation should consume the same resources manual play uses
- automation must have visible settings that are safe and simple
- automation must never run active-drive actions or prompt in-drive clicks
- automation rewards should be local, parked, and summarized

## 8. Prestige / Reset Translation

The reference uses reset layers to turn a completed loop into a faster repeatable loop. Tofu Driver
should use this only after a clear plateau.

| Prestige Layer | Visible Locked Goal | Unlock Timing | What Resets | What Persists | What Gets Faster | Early-Tab Guardrail |
| --- | --- | --- | --- | --- | --- | --- |
| License Exam | locked License Exam preview with requirements | 4-6 hours or 2-3 casual sessions | most current shop resources, station counts, ordinary upgrades | Passport Stamps, lifetime summaries, License Stars, selected permanent perks | fresh stock/order start, Prep Counter cadence, first station purchases, offline cap | hidden during first loop; teaser only near plateau |
| Completed Build / Sell Build | project-car completion panel | after Dream Garage Stage 3 and major fictional event | current project car, some garage inventory | Builder Stars/Garage Legacy, build history, cosmetics | next car starts with better tools, cheaper early parts, stronger sponsors | no full Dream Garage until shop loop is stable |
| Builder Stars | garage prestige currency | after completed/sold build | car-specific progress | Builder Stars, showcase history | garage rebuild and part access | separate from License Stars unless later simplified |
| License Stars | shop prestige currency | first License Exam onward | current shop run | License Stars and shop-only perks | first-loop and first-shop rebuild | no effect on Cup Test scoring or qualification |

Prestige rules:

- make the locked goal visible before it is usable, but only when it is relevant
- show exact requirements and what will reset
- preserve emotional records and stamps
- make the next run visibly faster within the first minute
- never require real-world driving for ordinary shop prestige
- never improve real-world Cup Test scoring, qualification, speed, route validation, or safety

## 9. Safe Challenge Translation

The reference uses challenges to reuse prior systems under constraints and award automation or
quality-of-life. Tofu Driver should do the same later, with parked-only shop trials and fictional
events.

| Future Challenge | Prior Mechanic Tested | Reward / QoL Unlock | Why It Should Not Appear Early | Safety Guardrail |
| --- | --- | --- | --- | --- |
| Shop Trial | stock -> orders -> Tips loop | Counter Service unlock or faster fulfillment setting | requires manual order loop mastery | parked-only, no driving data |
| Festival Order | larger order planning | demand stamp, better order reward preview, or Delivery Shelf boost | needs Family/Festival order types first | fictional demand only |
| Counter Rush | Prep Counter throughput | bulk fulfill or counter-priority setting | player must understand order prep bottleneck | no timers that pressure real driving |
| Supplier Shortage Trial | Tofu Stock runway | Supplier Contract or stock-reserve automation | stock must already feel valuable | cozy/optional, not punitive |
| Sponsor Showcase | style/reputation/shop identity | cosmetic sponsor stamp or shop-sign boost | needs Shop Sign and Reputation context | no real sponsor proof or public profile required |
| Fictional Closed-Course Event | Dream Garage build readiness | event report, rare part chance, Builder Reputation | Dream Garage must exist first | parked/asynchronous; no real driving, speed, GPS, maps, or high-G data |
| Delivery Shelf Trial | order capacity/support | Shelf Routine automation | Delivery Shelf must be useful first | shop-only capacity puzzle |

Challenge design rules:

- challenge rewards should usually unlock automation, QoL, or a safe shop-only multiplier
- challenges should reuse systems the player already understands
- first challenge should not appear before First 10 Orders and first larger order understanding
- challenge failures should be gentle and informative
- no challenge should require active driving, GPS, raw motion, speed, street names, maps, or public
  route comparison

## 10. Achievements / Passport Stamp Extraction

Achievements in the reference work because they do four jobs:

1. They point to reachable alternate goals.
2. They celebrate discoveries.
3. They sometimes make future rebuilds easier.
4. They encourage revisiting old mechanics after the player has grown stronger.

Tofu Driver translation:

| Stamp Type | Example | Function | Reward Style | Reveal Rule |
| --- | --- | --- | --- | --- |
| Firsts | First Shop Order, First Upgrade Purchased | teaches a system exists | fanfare / ledger / compact Passport | visible only after earned or close |
| Count milestones | First 10 Orders, First 100 Tips | gives short-term goals | inline celebration, small shop-only perk later | Next Milestone bar |
| Order mastery | First Family Tofu Tray, First Festival Bento | proves larger orders matter | stamp plus station/support teaser | after order type unlock |
| Station milestones | 5 Prep Counters, 5 Tofu Presses | makes repeat buys matter | inline milestone boost | Production panel only |
| Trial stamps | Shop Trial, Festival Order | proves mastery under constraint | QoL/automation unlock | later, after loop mastery |
| Prestige stamps | First License Exam, First Rebuild | records long arc | permanent identity/status | late only |

Stamp multiplier caution:

Small shop-only boosts can be powerful later, but early stamps should mainly teach and celebrate.
Never let Passport Stamps improve real-world Cup Test scoring or qualification.

## 11. Concrete Tofu Driver Recommendations

| Reference Lesson | Tofu Driver Translation | Where It Fits | Priority | Notes |
| --- | --- | --- | --- | --- |
| recursive tiers keep old resources relevant | deeper station cascade | Tofu Shop | Now | Continue making stock/orders matter through larger orders and support stations |
| count milestones create mini-goals | station milestone boosts | Production | Soon | Start with 5/10 Tofu Press and Prep Counter milestones |
| one visible threshold pulls play forward | Next Milestone bar | Overview | Soon | Best next small documentation-to-implementation candidate |
| reset buttons motivate before use | locked License Exam preview | First License | Later | Show only near plateau |
| optional timing choice adds agency | batch prep / counter reset choice | First Shop or later | Later | Use only if understandable and cozy |
| achievements guide and reward | Passport Stamps | First Loop onward | Now | Already core; avoid catalog dump |
| challenges prove mastery | Shop Trials / Festival Orders | After First Shop | Later | Use to unlock automation/QoL |
| automation follows manual proof | Counter Service / Regular Customers | First Automation | Later | Not before First 10 Orders |
| later layers revive older layers | Shop Districts / Regional Tofu Network | Later | Future | Must feed back into stock/orders/Tips |
| passive gain from prior best | best-shop-report passive bonus | Post-License | Future | Use summarized shop records only, not driving telemetry |
| branching upgrade paths support play style | active/passive/balanced shop policies | After automation | Future | Avoid early complexity |

## 12. Recommended Next Implementation Candidates

Recommended order after current first-loop tuning:

1. Next Milestone bar.
   - Shows one goal such as First 10 Orders or First Family Tofu Tray.
   - Keeps the first loop focused without opening future systems.

2. Station milestone visibility.
   - Add next-count hints for Tofu Press and Prep Counter only.
   - Pair with inline feedback, not a new tab.

3. Station milestone boosts.
   - Implement 5/10 owned boosts only after costs and early pacing are playtested.
   - Keep them shop-only.

4. Counter Service design slice.
   - Specify unlock, priority settings, stock reserve, and bulk behavior.
   - Implement later only after manual fulfillment becomes a chore.

5. Regular Customers V1.
   - Passive Tips from ready orders.
   - Should consume real order pipeline resources, not create money from nothing.

6. Visible locked License Exam goal.
   - Add as a preview near the first plateau.
   - Do not make it a first-loop tab.

7. First Shop Trial.
   - Safe parked trial that tests stock/order planning.
   - Should unlock QoL/automation, not raw speed or driving reward.

Do not implement all of these at once. The immediate priority remains tuning the first 10 minutes
and confirming that the current Core Game Spine V1 is fun.

## 13. Relationship To Current Progression Contract

Reinforced:

- Tofu Shop is a one-loop incremental game that earns the right to unfold.
- Tofu Press and Prep Counter should remain relevant throughout later phases.
- Delivery Shelf and Shop Sign are the right first support stations.
- Passport Stamps are the correct achievement language.
- Regular Customers and Counter Service should wait until manual play is understood.
- License Exam should be a late visible goal, not a first-loop tab.
- Dream Garage prestige should remain future.

Needs stronger future specification:

- exact Next Milestone bar target order
- station milestone costs/effects/reveal conditions
- Counter Service priority settings
- Regular Customers resource consumption rate
- Shop Trial rewards and unlock conditions
- locked License Exam preview wording and timing

Still future/documented only:

- Next Milestone bar
- station milestone boosts
- Counter Service
- full Regular Customers automation tuning
- Shop Trials / Festival Orders
- visible License Exam preview
- Dream Garage prestige
- passive generation based on prior best shop run

## 14. Safety And Privacy Guardrails

Antimatter-inspired progression architecture must not weaken Tofu Driver's safety/privacy contract.

Preserve:

- no speed rewards
- no high-G bragging
- no route leaderboards
- no public road competition
- no in-drive clicking
- no active-drive shop actions
- no raw GPS upload
- no raw motion upload
- no maps, street names, route traces, exact distance, or coordinates in shop progression
- Cup Test remains optional for ordinary Tofu Shop progression
- shop upgrades, garage parts, automation, stamps, and prestige perks never improve real-world Cup
  Test scoring or qualification
