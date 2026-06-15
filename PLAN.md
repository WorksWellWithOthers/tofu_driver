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
- The landing page now starts with a game-first Today's Delivery dashboard before dense setup controls.
- Tofu Shop adds parked-only tofu stock, reputation, shop levels, Pack Tofu, idle production,
  upgrades, story chapters, a simple Smooth Week contract, and Delivery Wall progress.
- The active Cup Test canvas uses `frontend/nospill/assets/tofu-driver-app-image.png` as the tofu mascot in the slosh visualization.
- The merch preview uses `frontend/nospill/assets/tofu-driver-shirt-1.png`.
- The landing page identifies Super Cute Collectibles as the physical merch fulfillment partner.
- Unlock-gated merch product links still live in `MERCH_LINKS`.
- Discord community CTAs are implemented but hidden until `DISCORD_CONFIG` is enabled with an invite URL.

## Recommended Next Steps

1. Rename `frontend/nospill/` to a product-native path such as `frontend/tofu-driver/`.
2. Update `test_frontend_nospill.js` to use the new path or rename it to `test_frontend_tofu_driver.js`.
3. Add a simple local static server command to `README.md`.
4. Confirm custom-domain DNS records and certificate provisioning for `tofudriver.com`.
5. Re-test on real iPhone Safari and Android Chrome over HTTPS.
6. Play-test the first-run game dashboard on mobile and tune the amount of visible status if needed.
7. Play-test Tofu Shop pacing after several real commutes and tune tofu stock / reputation costs.
8. Replace remaining MVP raster assets with production-ready artwork when available.

## Open Questions

- Should saved local sessions migrate if the storage key changes?
- Should merch unlocks remain local-only for the MVP?
- Which Super Cute Collectibles product URLs should be added to `MERCH_LINKS` after unlock-gated products exist?
- Should Qualified Run verification remain share-private by default?
- Should the app add a backend later for accounts, badges, or server-issued merch unlocks?
- Should Tofu Shop story chapters remain fully local-only, or eventually use backend unlock tokens?
- What moderation policy is required before accepting user-generated driving incident reports in Discord?

## Non-Goals For The Current Slice

- No accounts.
- No leaderboards.
- No raw route uploads.
- No real-time location sharing.
- No payment flow.
- No safety certification claims.
