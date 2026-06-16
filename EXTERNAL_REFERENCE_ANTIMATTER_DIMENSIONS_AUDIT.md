# External Reference Audit: Antimatter Dimensions

## 1. Executive Summary

This audit studies the uploaded Antimatter Dimensions reference material as progression-architecture
inspiration for Tofu Driver. It is original analysis only. Do not copy the reference text, theme,
mechanics names, formulas, UI, assets, data tables, or implementation structure into Tofu Driver.

What is worth borrowing:

- a production cascade where new layers make older layers more valuable
- one clear next major threshold instead of a full roadmap dump
- station-count milestones that make repeated purchases feel meaningful
- automation that appears only after manual play teaches the loop
- prestige/reset layers that turn an old loop into a faster rebuild
- achievements as small goals, discovery moments, and eventual light multipliers
- challenge-like variants that test mastery after the core loop is stable

What should not be copied:

- sci-fi theme, terminology, exact formulas, item names, or UI structure
- extreme number-chasing without Tofu Shop context
- any mechanic that rewards speed, risky driving, public-road competition, high-G events, GPS,
  motion telemetry, or active-drive interaction
- any all-at-once system reveal that would weaken Tofu Shop's mystery

Why it is useful for Tofu Shop:

Tofu Shop already wants to be a cascading incremental game. The reference clarifies how to make that
cascade legible: every new layer should either feed an older layer, boost a bottleneck, automate a
chore, or create a visible reset goal. It differs from the dopewars reference because dopewars is
about fluctuating opportunities, capacity, and short-run tradeoffs, while Antimatter Dimensions is
about recursive production, milestones, automation, and prestige architecture.

## 2. Production Cascade Lessons

The strongest transferable lesson is that later systems should not replace the first systems. They
should make earlier shop stations matter more.

Tofu Driver translation:

- Tofu Press produces Tofu Stock.
- Prep Counter consumes Tofu Stock and produces Delivery Orders.
- Delivery Shelf improves Prep Counter throughput and handling.
- Shop Sign improves Reputation and makes the shop feel known.
- Regular Customers consume ready orders and produce passive Tips.
- Counter Service later auto-fulfills prepared shop orders.
- Dispatcher later assigns fictional shop/route tasks.
- Regional Tofu Network later boosts the whole shop.

Key principle:

```text
New layers should make old layers more valuable, not obsolete.
```

Applied examples:

- Larger order types make Tofu Press useful again because they consume more Tofu Stock.
- Delivery Shelf makes Prep Counter scaling more valuable instead of replacing counters.
- Shop Sign makes Reputation from every fulfilled order more important.
- Regular Customers make the order pipeline useful even when the player is away.
- Counter Service should only appear once manual fulfillment is understood and repetitive.

## 3. Milestone Bar Design

Tofu Shop should eventually have one compact `Next Milestone` bar. It should not be a full future
roadmap.

Possible first milestones:

- First Upgrade Purchased
- First 10 Orders
- First 100 Tips
- First Family Tofu Tray
- Delivery Shelf unlock
- Shop Sign unlock
- covered-car teaser
- First License Exam much later

Placement:

- Overview, near Current Bottleneck / Next Best Action
- one line of target copy
- compact progress bar
- optional reward hint

Example Tofu Driver copy:

```text
Next Milestone: First 10 Orders
6 / 10 orders fulfilled
Reward: Passport stamp
```

Design rules:

- show only one next milestone at a time
- choose the milestone that best supports the current phase
- avoid listing hidden future systems
- do not reveal advanced tabs merely because a bar exists
- clear or advance the bar when the milestone is reached

How it supports the first 10 minutes:

- gives the player a reason to fulfill one more order
- makes stamps and support stations feel earned
- points toward the next goal without opening Routes, Garage, License, or other future systems

## 4. Station Milestone Boosts

Station milestones can make repeated station purchases feel better than a flat generator list.

Suggested Tofu Shop milestones:

| Station | Milestone | Boost | Reveal Rule | Fanfare |
| --- | ---: | --- | --- | --- |
| Tofu Press | 5 owned | Tofu Press output x1.5 | hint after player owns 3 | small inline celebration |
| Tofu Press | 10 owned | Tofu Press output x2 | visible after 5 milestone | inline milestone result |
| Prep Counter | 5 owned | Prep Counter output x1.5 | hint after player owns 3 | small inline celebration |
| Prep Counter | 10 owned | Prep Counter output x2 | visible after 5 milestone | inline milestone result |
| Delivery Shelf | 5 owned | Prep Counter support improves | hidden until Delivery Shelf is active | inline milestone result |
| Shop Sign | 5 owned | Reputation gain improves | hidden until Shop Sign is active | inline milestone result |

Design rules:

- first screen should not show every milestone
- show the next milestone only when the station is already relevant
- use short copy and before/after previews
- use fanfare only for first-time or phase-changing milestones
- milestones should reinforce bottlenecks, not become a separate checklist dump

## 5. Automation Lessons

Rule:

```text
Manual play teaches. Automation removes chores.
```

Tofu Driver automation translations:

- Counter Service: auto-fulfills prepared shop orders after the player has manually fulfilled enough
  orders.
- Regular Customers: passively consume ready orders for Tips once the player understands the order
  pipeline.
- Dispatcher: later assigns fictional route/crew tasks after manual assignment becomes busywork.
- Delivery Shelf: supports larger order throughput before full automation arrives.

Suggested automation unlocks:

- after First 10 Orders
- after First Family Tofu Tray
- after the player has felt manual fulfillment as a chore
- after Delivery Shelf or Shop Sign proves the shop is expanding

Do not implement automation before the first 10 minutes are tuned. Automation should not hide the
core loop before the player understands why it matters.

## 6. Prestige / Reset Lessons

Prestige should convert a plateau into a faster rebuild, not erase progress for its own sake.

Tofu Driver translations:

- License Exam: shop/company prestige.
- Completed Project Car / Sell Build: future Dream Garage prestige.
- License Stars: permanent shop/license prestige currency.
- Builder Stars or Garage Legacy: future garage prestige if Dream Garage becomes deep enough.

License Exam design guidance:

- should not appear in the first hour
- should be visible first as a distant goal
- should require shop milestones, stamps, and fictional route progress later
- should never require real-world driving
- should reset shop progress but preserve Passport Stamps, lifetime records, and License Stars
- should make the next rebuild faster through shop-only perks

What should become faster afterward:

- early order preparation
- first station purchases
- offline cap or first-loop comfort
- early stamp recovery

Why it matters:

The first loop becomes a familiar mini-game that the player can rebuild more quickly, giving the
player a sense of mastery without making old systems irrelevant.

## 7. Achievement / Stamp Lessons

Passport Stamps should act like small goals, discovery moments, and later light unlock keys.

Good uses:

- First Shop Order teaches that stamps exist.
- First Upgrade Purchased validates the upgrade loop.
- First 10 Orders confirms the manual loop.
- First Family Tofu Tray teaches that larger order types matter.
- First 100 Tips gives an early earnings goal.

Design rules:

- do not dump the full stamp catalog early
- use Stamp Fanfare for major firsts
- use compact Passport teasers before full Passport depth
- stamps may later grant small safe shop-only boosts or unlock keys
- stamps must never reward speed, public-road competition, high-G events, raw GPS, or raw motion

Later, stamps can teach alternate safe play styles:

- careful stock planning
- efficient order preparation
- fictional shop trials
- Dream Garage restoration milestones
- optional smooth Cup Test accomplishments

## 8. Challenge Lessons

Challenge-like content should arrive after the first loop is strong. It should test understanding of
shop systems, not real driving risk.

Safe future equivalents:

- Shop Trial
- Festival Order
- Reliability Trial
- Sponsor Showcase
- Fictional Closed-Course Event
- Delivery Shelf Trial

Rules:

- no real-world racing
- no speed reward
- no public-road challenge
- no GPS/motion requirement for shop trials
- no active-drive shop actions
- no route leaderboards
- keep these later, after the First Loop Contract is tuned

Purpose:

- give the player a reason to revisit earlier systems
- provide variety without broad system sprawl
- unlock automation or support upgrades after the player proves understanding

## 9. Tofu Driver Design Recommendations

| Antimatter Dimensions Lesson | Tofu Driver Translation | Where It Fits | Priority | Notes |
| --- | --- | --- | --- | --- |
| Next major threshold is always visible | Next Milestone bar | Overview / First Loop | Soon | Best next small implementation after first-loop tuning |
| Repeated purchases get milestone boosts | station milestone boosts | Production | Soon | Show only the next relevant milestone |
| Locked reset goal creates direction | License Exam preview | First License | Later | Visible only after shop plateau is approaching |
| Automation follows mastery | Counter Service / Regular Customers / Dispatcher | First Automation | Later | Do not automate before manual loop is understood |
| Recursive production cascade | station ladder feeds earlier resources | Entire Tofu Shop | Now | Already core to design; keep reinforcing it |
| Achievements create small goals | Passport Stamps | First Loop onward | Now | Already implemented for early spine; keep compact |
| Challenges test understanding | Shop Trials / Festival Orders | After First Shop | Later | Safe, parked, optional |
| Old systems remain relevant | larger orders and support stations reuse stock/orders | All phases | Now | Avoid dead early stations |
| All future layers visible at once | full roadmap dump | First Loop | Avoid | Contradicts progressive reveal |

## 10. Recommended Next Implementation Candidates

Recommended order after current first-loop work:

1. Next Milestone bar.
   - Helps the player see one goal without opening the full roadmap.
   - Should start with First 10 Orders, First 100 Tips, or First Family Tofu Tray.

2. Station milestone boost visibility.
   - Makes buying more Tofu Presses and Prep Counters feel better.
   - Should show only the next relevant milestone.

3. Delivery Shelf / Shop Sign tuning.
   - Existing V1 support stations need playtest-driven cost/reveal tuning.
   - Should reinforce Prep Counter and Reputation rather than open advanced systems.

4. Regular Customers V1 or Counter Service.
   - First automation should arrive only after manual order fulfillment becomes repetitive.
   - It should consume ready orders and create modest Tips, not replace all decisions.

5. Covered Car teaser refinement.
   - Already implemented as a restrained story beat.
   - Keep it as a teaser until Dream Garage Stage 0 is scoped.

6. License Exam preview later.
   - Add only after the player can reach a real first-shop plateau.
   - Must remain shop-only and not require real-world driving.

Do not implement everything at once. The immediate product need remains first-loop tuning and
clarity.

## 11. Relationship To Current Progression Contract

Current concepts reinforced:

- Tofu Shop should unfold from one loop first.
- Tofu Press, Prep Counter, Delivery Shelf, and Shop Sign should form a real cascade.
- Passport Stamps are the correct language for small achievements.
- First-loop dashboards should show only the next useful goal.
- Automation should remain deferred until manual fulfillment becomes repetitive.
- License Exam and Dream Garage prestige should stay later.

Current concepts to reconsider:

- The first support-station milestones should become more visible once the first 10 minutes are
  tuned.
- A single Next Milestone bar may be clearer than several scattered teaser cards.
- Station count milestones may make repeat purchases feel more intentional.

Future-only concepts:

- Counter Service automation.
- Shop Trials and Festival Orders.
- License Exam preview.
- Dream Garage completion/sale prestige.
- Any broad challenge or prestige layer.

Do not add before the First Loop Contract feels good:

- a full automation panel
- a full challenge panel
- License Exam action
- broad route, crew, garage, or Spirit surfaces
- any system that distracts from stock, orders, Tips, and early upgrades

## 12. Safety And Privacy Guardrails

Antimatter-inspired progression architecture must not weaken the Tofu Driver contract.

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
