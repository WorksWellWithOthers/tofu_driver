# Tofu Driver Plan

## Current State

- The MVP app has been moved into its own standalone folder.
- The current app is still source-located at `frontend/nospill/` for now.
- The app is static and browser-only.
- The app deploys to Cloud Run service `tofu-driver` in project `tofu-driver` with an Nginx static container.
- Cloud Run domain mappings exist for `tofudriver.com` and `www.tofudriver.com`; DNS/certificate propagation may still need verification after record changes.
- Basic Mode uses device motion only.
- Qualified Run Mode is opt-in and may use summarized route metrics.
- Share and local save behavior are implemented client-side.
- Delivery Log adds local XP, stamps, daily cargo missions, route labels, merch progress, and coarse route mastery fingerprints.
- The landing page now starts with a game-first Today's Delivery dashboard, clear goal/reward,
  and prominent `Take the Cup Test` CTA before dense setup controls.
- Tofu Shop V1 adds parked-only tofu stock, reputation, shop levels, Pack Tofu, capped idle
  production, three starter upgrades, and Delivery Wall progress.
- The Collection Layer adds cosmetic Delivery Crew character unlocks and local Sound Pack unlocks
  for parked/result screens only.
- Delivery Simulator is hidden by default and can be enabled locally with `?simulator=1` or
  `tofuDriverSimulatorEnabled=true` to test completed delivery rewards without sensors or location.
- Result screens now use one consolidated Delivery/Practice Complete layout, and Practice Mode
  is gated to modest local rewards while qualified-only ranks, stamps, daily completion, and merch
  progress stay behind Qualified Run criteria.
- Post-run navigation returns users to the updated dashboard/Tofu Shop, with another Cup Test as a
  secondary action instead of the only exit from results.
- First-run progressive reveal now keeps Today's Delivery and the Cup Test CTA prominent while the
  expanded Delivery Board, Tofu Shop, Passport, Delivery Crew, and Sound Packs wait until they matter.
- The top dashboard includes a Next Best Action card so first-run users see one primary action;
  Pack Tofu becomes a parked shop action after the first delivery wakes the shop.
- The active Cup Test canvas uses `frontend/nospill/assets/tofu-driver-app-image.png` as the tofu mascot in the slosh visualization.
- The merch preview uses `frontend/nospill/assets/tofu-driver-shirt-1.png`.
- The landing page identifies Super Cute Collectibles as the physical merch fulfillment partner.
- Unlock-gated merch product links still live in `MERCH_LINKS`.
- Discord community CTAs are implemented but hidden until `DISCORD_CONFIG` is enabled with an invite URL.
- `DESIGN.md` now documents the future idle incremental / Tofu Shop expansion direction; those
  systems remain future-facing unless implemented in a later pass.
- `DESIGN.md` now documents progressive reveal and ethical monetization/status rules: first-run
  should become story-first over time, and monetization should stay cosmetic/supporter/earned-merch.

## Recommended Next Steps

1. Rename `frontend/nospill/` to a product-native path such as `frontend/tofu-driver/`.
2. Update `test_frontend_nospill.js` to use the new path or rename it to `test_frontend_tofu_driver.js`.
3. Add a simple local static server command to `README.md`.
4. Confirm custom-domain DNS records and certificate provisioning for `tofudriver.com`.
5. Re-test on real iPhone Safari and Android Chrome over HTTPS.
6. Play-test the progressive reveal gates on mobile and tune when shop, passport, crew, and sound
   details should expand.
7. Play-test the first-run game dashboard on mobile and tune the amount of visible status if needed.
8. Play-test Tofu Shop pacing after several real commutes and tune tofu stock / reputation costs.
9. Use Delivery Simulator scenarios for local QA of Delivery Complete, unlocks, shop rewards, and
   share sanitization before mobile road tests.
10. Prototype the future idle expansion in the documented small-scope order: one fictional route,
   one generator, three upgrades, one delivery report, and one stamp.
11. Replace remaining MVP raster assets with production-ready artwork when available.

## Open Questions

- Should saved local sessions migrate if the storage key changes?
- Should merch unlocks remain local-only for the MVP?
- Which Super Cute Collectibles product URLs should be added to `MERCH_LINKS` after unlock-gated products exist?
- Should Qualified Run verification remain share-private by default?
- Should the app add a backend later for accounts, badges, or server-issued merch unlocks?
- Should Tofu Shop story chapters remain fully local-only, or eventually use backend unlock tokens?
- What moderation policy is required before accepting user-generated driving incident reports in Discord?
- Which optional supporter/cosmetic purchases fit the ethical monetization rules without weakening
  earned driving achievements?

## Non-Goals For The Current Slice

- No accounts.
- No leaderboards.
- No raw route uploads.
- No real-time location sharing.
- No payment flow.
- No pay-to-progress, paid speed/score boosts, loot boxes, or intrusive active-drive ads.
- No safety certification claims.
