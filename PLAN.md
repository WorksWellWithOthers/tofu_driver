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
- Fulfill Shop Order is the current core home-loop action.
- Broad shop systems exist as scaffolding or partial implementations: routes, training, garage,
  crew, Shop Spirit, License, rivals, Passport, and Ledger.
- Delivery Log / Ledger is supporting local history, not the primary game surface.
- Delivery Simulator is hidden by default and is local QA only.
- Discord, payments, accounts, backend sync, analytics, ads, service workers, and public profiles
  are not part of the current MVP.

Canonical references:

- `DESIGN.md`: product canon, surfaces, safety/privacy contract, future direction.
- `BALANCE_AND_PROGRESSION.md`: Tofu Shop economy, pacing, progression, and balance contract.
- `IMPLEMENTATION_STATUS.md`: evidence matrix for implemented, partial, decorative, documented-only,
  not implemented, and non-goal systems.
- `README.md`: practical setup, routes, and validation commands.

## Recommended Next Steps

1. Do not add new systems until the first Tofu Shop loop is fun.
2. Play-test the core loop at home:
   Tofu Stock -> Delivery Orders -> Fulfill Shop Order -> Tips -> Upgrade -> First Stamp.
3. Tune first-session pacing only after reviewing new balance/design material.
4. Add pacing tests for first order under 30 seconds and first upgrade within 2 minutes once target
   numbers are chosen.
5. Keep advanced tabs/systems down-ranked or hidden until the core loop has clear next actions.
6. Re-test the Cup Test on real iPhone Safari and Android Chrome over HTTPS.
7. Confirm custom-domain DNS and certificate status for `tofudriver.com`.
8. Rename `frontend/nospill/` to a product-native path only as a separate migration.

## Open Questions

- Should the first Tofu Shop session start with one Delivery Order available?
- What are the target first 60 seconds, 10 minutes, and 1 hour balance numbers?
- Which advanced shop systems should stay hidden until the first loop is complete?
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
- No analytics or tracking.
- No network calls/uploads.
- No service workers.
- No payment flow.
- No pay-to-progress, paid score boosts, paid speed boosts, loot boxes, or intrusive ads.
- No leaderboards or public road competition.
- No raw GPS, raw motion, route trace, map, street, or speed-log uploads.
- No safety certification, insurance, legal compliance, or real-world driving protection claims.
