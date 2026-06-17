# Core Game Spine Audit

Status note: this audit is historical. The Core Game Spine V1 work called for here has since been
implemented and tracked in `IMPLEMENTATION_STATUS.md`. The audit remains useful as rationale for
why the current plan still prioritizes first-loop tuning, milestone pacing, and
automation-after-mastery before broader systems.

## Executive Summary

Tofu Shop now has a working first loop: Tofu Press creates Tofu Stock, Prep Counter prepares
Delivery Orders, typed shop orders convert stock/orders into Tips/Reputation/Shop XP, and early
fulfillment stays inline. That is enough to understand the loop, but not yet enough to call the
shop a complete 5 to 10 minute game spine.

The missing spine pieces are not broad systems. The gaps are small, concrete progression beats:
core milestone stamps beyond the first order, a visible second-stage upgrade path, and the first
support stations becoming meaningful at the right time. Routes, Crew, Shop Spirit, Rivals, License
prestige, full Dream Garage, and dopewars-inspired demand systems should remain deferred.

## Status Rule

A mechanic counts as implemented only if it changes state, gives player feedback, is visible at the
right time, creates a meaningful decision, has tests, and fits the progression contract.

## What Currently Works

| Mechanic | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Simple Tofu Box | Implemented | State changes, inline result, tests | First order consumes stock/order and grants Tips/Reputation/Shop XP. |
| Prep Counter progress | Implemented | Progress bar, tick tests | Shows ready orders and next-order progress. |
| Tofu Stock runway | Implemented | Runway helper/copy/tests | Explains stock as ingredient/runway/order-size capacity. |
| Family Tofu Tray | Implemented | Unlock/reward tests | Makes stock matter after loop understanding. |
| Festival Bento | Implemented | Unlock/reward tests | First larger payout, still early-mid. |
| Inline shop fulfillment | Implemented | Inline status/test coverage | Repeated orders no longer open the full result page. |
| First Shop Order stamp/fanfare | Implemented | Stamp Fanfare state/tests | First stamp is visible and repeat-suppressed. |
| Tidy Packaging | Implemented | Upgrade state/rate/tests | Solves Prep Counter bottleneck with before/after preview. |
| Steady Pressing | Implemented | Upgrade state/tests | Useful for low-stock bottlenecks. |

## Partial Or Scaffolding

| Mechanic | Status | Evidence | Why It Is Not Complete |
| --- | --- | --- | --- |
| First 10 Orders stamp | Partial | Stamp can unlock | Needs clearer spine test/feedback confirmation. |
| First 100 Tips stamp | Partial | Stamp can unlock | Needs clearer spine test/feedback confirmation. |
| First Family Tofu Tray stamp | Not implemented | No stamp id before this pass | Missing important order-size milestone. |
| First Upgrade Purchased stamp | Not implemented | No station-upgrade stamp before this pass | Missing first-upgrade milestone. |
| Double Mold / Double Labels | Partial | Upgrade definitions exist | Needs stage tests and clear second-stage reveal. |
| Delivery Shelf | Partial | Station boosts Prep Counter | Needs milestone-based reveal and tests that it is useful. |
| Shop Sign | Partial | Station exists | Needs direct order-reputation effect and tests. |
| Regular Customers | Deferred | Station scaffold exists | Automation needs its own balance pass; do not implement in V1. |
| Passport | Partial | Compact panel/teaser exists | Needs more core-spine stamps without dumping full catalog. |
| Dream Garage teaser | Deferred | Design documented only | Should wait until the core 5 to 10 minute loop is tuned. |

## Decorative Or Deferred

| System | Status | Reason To Defer |
| --- | --- | --- |
| Routes | Deferred/scaffolding | Needs Shop Sign/Delivery Shelf context first. |
| Training | Deferred/scaffolding | Not part of parked first-loop tuning. |
| Garage / Dream Garage | Documented only for current spine | Full car build would distract from order loop tuning. |
| Shop Spirit | Placeholder | Boost economy needs clear source/sink later. |
| Rivals | Placeholder | Requires a stable shop economy first. |
| License prestige | Deferred | Prestige should happen after a plateau, not during V1. |
| Regular Customers automation | Deferred | Should arrive after manual fulfillment becomes a chore. |

## Missing From A 5 To 10 Minute Core Game

| Issue | Evidence | Why It Hurts | Recommended Fix | Priority |
| --- | --- | --- | --- | --- |
| Core milestone ladder is thin | Only first order has strong fanfare | The player lacks short-term goals after the first order | Add First Upgrade, First Family Tray, First 10 Orders, First 100 Tips stamps/ledger feedback | P0 |
| Delivery Shelf is not clearly earned | Station exists but reveal is broad | The first expansion can feel like another card | Reveal after 10 orders, Family Tray, or upgrade + level milestone; test Prep Counter boost | P1 |
| Shop Sign does not strongly affect order rewards | Existing effect is mostly passive/scaffolded | Reputation station lacks a visible purpose | Add a small per-owned order Reputation multiplier and keep Routes hidden | P1 |
| Second-stage upgrade path needs proof | Double Mold/Labels exist | Player needs a visible next bump after first upgrade | Test reveal and before/after previews for Double Mold or Double Labels | P1 |
| Regular Customers are premature | Station scaffold exists | Automation would need new pacing and consumption rules | Defer to next implementation slice | P2 |
| Dream Garage teaser may distract | Design exists | Teaser is emotional, not necessary for tuning the shop spine | Defer until first 10 minutes are tuned | P2 |

## Core Game Spine V1 To Build Now

V1 should include:

1. First Tips Earned is the first visible shop milestone.
2. First Shop Order remains the first stamp/fanfare and can be earned by starter Counter Service.
3. First Upgrade Purchased stamp and ledger feedback.
4. First Family Tofu Tray stamp and ledger feedback.
5. First 10 Orders and First 100 Tips stamps verified by tests.
6. Delivery Shelf reveal tied to meaningful shop milestones and a tested Prep Counter boost.
7. Shop Sign reveal tied to Reputation/100 Tips/Delivery Shelf and a tested order Reputation boost.
8. Double Mold or Double Labels visible after the related station/order bottleneck.
9. Next Best Action continues to prioritize Counter Service, bottlenecks, and useful purchases over Cup Test.

## Stay Deferred

Regular Customers, Dream Garage teaser, Routes, Crew, Shop Spirit, Rivals, License prestige,
monetization, accounts, backend sync, analytics, service workers, uploads, and network calls remain
out of scope for this implementation slice.

## Recommended Tests

- Core audit file exists.
- First loop is playable from Overview.
- First Shop Order, First Upgrade Purchased, First 10 Orders, First 100 Tips, and First Family Tofu
  Tray stamps unlock under deterministic conditions.
- Tidy Packaging improves Prep Counter rate.
- Steady Pressing is not recommended while stock runway is healthy.
- Double Mold or Double Labels appears at the correct second-stage condition.
- Delivery Shelf is hidden early, visible after its milestone, and improves Prep Counter throughput.
- Shop Sign is hidden early, visible after its milestone, and improves order Reputation gain.
- Regular Customers remain hidden/deferred in the first-loop spine.
- Passport stays compact and does not dump the full catalog early.
- Advanced systems are not revealed by raw offline accumulation alone.
- No visible `undefined`, long decimal strings, negative resources, or network/upload APIs.
