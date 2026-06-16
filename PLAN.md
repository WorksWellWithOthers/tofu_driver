# Tofu Driver Plan

## Current State

- Tofu Driver is a static browser app currently source-located at `frontend/nospill/`.
- Root/no hash defaults to `#/cup-test`.
- `#/cup-test` shows Don't Spill the Cup, the smooth-driving challenge.
- `#/shop` shows Tofu Shop, the parked-only idle/incremental game.
- `#/crew` shows Delivery Crew when collection systems are relevant.
- Basic Mode uses device motion only and does not request location.
- Qualified Run Mode is opt-in and may request location only after explicit start.
- Tofu Shop has a live local tick loop: Tofu Press produces Tofu Stock, Prep Counter can produce
  Delivery Orders, visible rates are `/sec`, and shop actions save/render immediately.
- Fresh shop state starts with Tofu Stock, one ready Delivery Order, and a running Prep Counter so
  the first order can be fulfilled immediately.
- Fractional Delivery Order progress is shown as ready orders plus a Prep Counter progress bar,
  supporting percent/ETA copy, and pause state, not as a raw decimal order count.
- Tofu Stock now has player-facing runway copy: it is an input for Prep Counter, not the purchase
  currency, and the UI can show when stock is enough for now.
- Player-facing Tofu Shop values, costs, and rewards use compact incremental formatting as they
  grow; internal values remain exact.
- The P0/P1 `FIRST_LOOP_AUDIT.md` findings have been implemented: Tidy Packaging is the first
  relevant Prep Counter upgrade when order prep is the bottleneck, Steady Pressing is stock-specific,
  empty upgrade panels are hidden, and early upgrade cards show before/after impact.
- Tofu Shop Overview is now the first-loop play surface: it includes ready orders, Prep Counter
  progress, the best available order card, and the relevant next station/upgrade so the first loop
  is playable without opening Orders.
- Tofu Shop Overview now includes Next Milestone Bar V1. It shows one current implemented shop goal
  at a time, pairs with Next Best Action, and can show a small `$1T fictional Net Worth` long-road
  line after an early milestone without implementing a Net Worth counter or valuation system.
- Counter Service V1 is the first earned automation layer. It unlocks after First 10 Orders, starts
  paused, auto-fulfills Best Available prepared orders every 10 seconds only while parked and the
  page is open, and does not run during offline progress.
- The Orders tab has been removed because it duplicated Overview. Normal shop order fulfillment now
  stays inline with compact reward feedback so repeated order handoffs do not block the loop.
- Tofu Shop tab panels are scoped: Production owns station buying, Upgrades owns upgrade buying,
  and Passport/Ledger/Settings no longer inherit Generators or Upgrades sections.
- The first Passport stamp now triggers a local Stamp Fanfare on the inline shop-order path, with
  repeat suppression, accessible dialog semantics, reduced-motion handling, and muted-audio respect.
- The first hidden shop system reveal now uses a local Discovery Fanfare: Upgrades are revealed
  when a meaningful upgrade appears, the Upgrades tab gets an explicit `New` badge, and the badge
  clears after the player views Upgrades.
- Tofu Shop tabs are progressively revealed by meaningful milestones and story beats rather than
  raw idle accumulation. Routes, Training, Garage, Crew, Shop Spirit, Rivals, License, full
  Passport, and full Ledger stay hidden during the first loop unless earned.
- Overview has a small order-size ladder: Simple Tofu Box, Family Tofu Tray, and Festival
  Bento consume meaningful typed Tofu Stock/Delivery Order costs and pay typed
  Tips/Reputation/XP rewards.
- `CORE_GAME_SPINE_AUDIT.md` now records what is truly implemented versus scaffolding. Core Game
  Spine V1 adds tested First Upgrade Purchased, First Family Tofu Tray, First 10 Orders, and First
  100 Tips stamp milestones; Delivery Shelf is the first tested throughput support station; Shop
  Sign is the first tested Reputation support station.
- Fulfill Shop Order is the current core home-loop action: it converts Delivery Orders into Tips,
  Reputation, and XP.
- Tips are the early purchase currency for stations and upgrades; disabled purchase copy now points
  players back to fulfilling shop orders.
- Next Best Action follows the current bottleneck: ready orders point to fulfillment, low stock
  points to Pack Tofu/Tofu Press, and healthy stock with slow orders points to Tidy Packaging,
  Prep Counter, or order prep rather than Tofu Press.
- Pack Tofu is a backup/manual Tofu Stock action, and Don't Spill the Cup is an optional certified
  boost rather than the normal shop bottleneck during order prep or Tip shortages.
- Broad shop systems exist as scaffolding or partial implementations: routes, training, garage,
  crew, Shop Spirit, License, rivals, Passport, and Ledger.
- Regular Customers remain deferred until Counter Service V1 has been playtested. Dream Garage
  remains documented future direction only.
- The covered-car teaser is implemented only as a one-time story beat after the first upgrade
  milestone; it does not add a Dream Garage tab, garage inventory, parts, events, or car stats.
- Dream Garage / Project Car progression is documented as a future long-term emotional arc:
  Tofu Shop funds the dream car, the garage is the dream, and Don't Spill the Cup remains the
  smooth-control philosophy/proof.
- Ultimate Net Worth is documented as future endgame direction: Tofu Shop becomes the first
  business engine, Dream Garage becomes an asset/status layer, later business/franchise/car-company
  layers may lead toward a fictional `$1 trillion net worth` target, and aerospace/space layers are
  absurd late-game direction only.
- `EXTERNAL_REFERENCE_DOPEWARS_AUDIT.md` documents a read-only external mechanics study and safely
  translates capacity, demand, opportunity, and project-goal ideas into future Tofu Driver concepts.
- `EXTERNAL_REFERENCE_ANTIMATTER_DIMENSIONS_AUDIT.md` documents a read-only progression-architecture
  study and safely translates recursive production, next-milestone, station-milestone, automation,
  achievement, challenge, and prestige lessons into future Tofu Shop concepts. It now includes a
  concrete future target order for the Next Milestone bar, station boosts, Counter Service, Regular
  Customers, locked License preview, and later Shop Trials.
- Delivery Log / Ledger is supporting local history, not the primary game surface.
- Delivery Simulator is hidden by default and is local QA only.
- Privacy-safe PostHog product analytics is implemented as optional runtime config and no-ops when
  disabled or missing a key. Autocapture/session recording are disabled, route views are manual, and
  event properties are sanitized/coarse.
- Discord, payments, accounts, backend sync, ads, service workers, and public profiles are not part
  of the current MVP.

Canonical references:

- `DESIGN.md`: product canon, surfaces, safety/privacy contract, future direction.
- `BALANCE_AND_PROGRESSION.md`: Tofu Shop economy, pacing, progression, and balance contract.
- `IMPLEMENTATION_STATUS.md`: evidence matrix for implemented, partial, decorative, documented-only,
  not implemented, and non-goal systems.
- `README.md`: practical setup, routes, and validation commands.

## Recommended Next Steps

1. Review the full progression spec in `BALANCE_AND_PROGRESSION.md` before coding more gameplay.
2. Playtest and tune the implemented First Loop Contract:
   fresh state, Simple Tofu Box, First Shop Order stamp reveal, first upgrade timing, stock-runway
   recommendations, order-size card density, and early button visibility.
3. Playtest and tune the implemented Order Types slice:
   Simple Tofu Box, Family Tofu Tray, Festival Bento, typed costs/rewards, Fulfill Max labeling,
   disabled reasons, and larger-order reveal timing.
4. Playtest and tune the first 10 minutes:
   confirm the first order, first upgrade, first bottleneck, first Family Tofu Tray, Delivery Shelf,
   and Shop Sign are clear.
5. Continue visual QA on first-loop reveal: verify Overview stays focused, Production remains the
   station support panel, and advanced systems stay hidden until earned.
6. Playtest Counter Service V1: confirm First 10 Orders is the right unlock, 1 handoff / 10 seconds
   feels helpful without deleting choices, and active-page-only automation does not skip pacing.
7. Tune the implemented Next Milestone Bar against playtest behavior, then consider station
   milestone visibility. Do not jump to Regular Customers, License prestige, or Shop Trials until
   Counter Service proves the manual loop needs more automation.
8. Expand balance tests only where playtesting reveals gaps:
   mobile density, exact time-to-buy targets, and edge cases around order prep, missing resources,
   and Passport reveal timing.
9. Re-test the Cup Test on real iPhone Safari and Android Chrome over HTTPS.
10. Verify PostHog production config on the deployed Cloud Run revision only after a separate Tofu
   Driver PostHog browser key exists.
11. Confirm custom-domain DNS and certificate status for `tofudriver.com`.
12. Rename `frontend/nospill/` to a product-native path only as a separate migration.

Do not build advanced systems next. The First Loop Contract is now implemented enough for
playtesting; Routes, Crew, Garage, Shop Spirit, Rivals, License, and monetization/social/profile
features stay deferred until the first 10 minutes are playtested and tuned.

Future Dream Garage milestone sequence:

1. Review Dream Garage design.
2. Playtest and tune First Loop Contract.
3. Tune first 10 minutes.
4. Implement Dream Garage teaser only.
5. Implement Stage 0 garage restoration.
6. Implement Stage 1 daily build.
7. Implement the first fictional closed-course event.
8. Design project car completion/sale prestige after the garage loop is fun.

Future endgame/business sequence:

1. Keep the $1T Net Worth target as design direction only.
2. Stabilize and tune the First Loop Contract.
3. Tune Next Milestone Bar V1 and Counter Service V1, then add station milestones only if
   playtesting supports them.
4. Add Dream Garage teaser and Stage 0 before any valuation system.
5. Add business valuation only after Dream Garage, project-car sale, and franchise loops are fun.
6. Add social showcase/scout concepts only after a privacy/account/backend design exists.
7. Add car manufacturing, rocket company, and space league layers only as late-game/future patch
   content.

Deferred until after the First Loop Contract is playtested:

- Routes
- Crew
- Garage
- Dream Garage / Project Car progression
- Ultimate Net Worth / business valuation / franchise scaling / car manufacturing / aerospace
- Tofu Demand Board / Supplier Market / Garage Parts Market
- station milestone boosts / Shop Trials
- Shop Spirit
- Rivals
- License
- monetization/social/profile features

## Resolved Decisions

- Fresh Tofu Shop state should start with one ready Delivery Order.
- Fresh Tofu Shop state should start with one running Prep Counter.
- Fresh Tofu Shop state should start with Tofu Stock so the first order can be fulfilled
  immediately.
- Tofu Stock is an ingredient/runway resource, not the purchase currency.
- Tips are the early purchase currency.
- Fulfill Shop Order is the early money-conversion action.
- Don't Spill the Cup is optional for ordinary Tofu Shop progression.

## Open Questions

- Is 1 order every 40 seconds the right early Prep Counter pace?
- Should the first meaningful purchase usually be Prep Counter, Tofu Press, or Steady Pressing?
- Should Steady Pressing cost 20 Tips, or should the first upgrade happen after exactly two
  fulfilled orders?
- When should Passport become a visible tab instead of a teaser?
- How many active buttons should be visible before minute 10?
- Should Pack Tofu remain forever, or become less visible once Tofu Press production is stable?
- Should the first License Exam target be 4 hours, 6 hours, or later after playtesting?
- Should saved local sessions migrate if the storage key changes?
- Should merch unlocks remain local-only for the MVP?
- Which Super Cute Collectibles product URLs should be added after products exist?
- Should Qualified Run verification remain share-private by default?
- What backend, if any, is needed later for earned merch unlock tokens?
- What moderation policy is required before accepting any user-generated community reports?

## Non-Goals For The Current Slice

- No new gameplay systems.
- No economy rebalance yet.
- No React or framework migration.
- No accounts.
- No backend sync.
- No analytics beyond explicitly configured, privacy-safe PostHog product events.
- No network calls/uploads beyond explicitly configured PostHog analytics.
- No service workers.
- No payment flow.
- No pay-to-progress, paid score boosts, paid speed boosts, loot boxes, or intrusive ads.
- No leaderboards or public road competition.
- No raw GPS, raw motion, route trace, map, street, or speed-log uploads.
- No safety certification, insurance, legal compliance, or real-world driving protection claims.
