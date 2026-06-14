# Tofu Driver Plan

## Current State

- The MVP app has been moved into its own standalone folder.
- The current app is still source-located at `frontend/nospill/` for now.
- The app is static and browser-only.
- Basic Mode uses device motion only.
- Qualified Run Mode is opt-in and may use summarized route metrics.
- Share and local save behavior are implemented client-side.

## Recommended Next Steps

1. Rename `frontend/nospill/` to a product-native path such as `frontend/tofu-driver/`.
2. Update `test_frontend_nospill.js` to use the new path or rename it to `test_frontend_tofu_driver.js`.
3. Add a simple local static server command to `README.md`.
4. Decide the first deployment target.
5. Replace MVP raster assets with production-ready artwork when available.
6. Re-test on real iPhone Safari and Android Chrome over HTTPS.

## Open Questions

- Should the public URL be `tofudriver.com`, a static host subpath, or both?
- Should saved local sessions migrate if the storage key changes?
- Should merch unlocks remain local-only for the MVP?
- Should Qualified Run verification remain share-private by default?
- Should the app add a backend later for accounts, badges, or server-issued merch unlocks?

## Non-Goals For The Current Slice

- No accounts.
- No leaderboards.
- No raw route uploads.
- No real-time location sharing.
- No payment flow.
- No safety certification claims.
