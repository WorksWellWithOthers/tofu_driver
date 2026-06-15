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
- The UI is split into two surfaces with hash routing: root/no hash defaults to `#/cup-test`,
  `#/cup-test` shows Don't Spill the Cup, and `#/shop` shows Tofu Shop.
- The first brand shelf is shared across top-level surfaces. It keeps one Tofu Driver logo image and
  changes the right-side copy/CTAs for Don't Spill the Cup vs Tofu Shop.
- The landing page now starts with a game-first Today's Delivery dashboard, clear goal/reward,
  and a home-shop Next Best Action before dense setup controls.
- Home progression is now the base game: users can start the Tofu Shop, Pack Tofu, wait for
  generators, and Fulfill Shop Orders without sensors or location access.
- Tofu Shop V1 adds parked-only tofu stock, delivery orders, tips, reputation, shop levels,
  Pack Tofu, Fulfill Shop Order, capped idle production, and starter upgrades.
- Fulfill Shop Order uses a compact `Shop Order Complete` result screen with driving share-card
  actions hidden and shop-focused return/fulfill actions.
- Tofu Shop Generator V2 adds visible local ticking: Tofu Press produces Tofu Stock, and Prep
  Counter converts Tofu Stock into Delivery Orders while parked or through capped offline progress.
  Generator rates are shown per second in the shop UI.
- Tofu Shop Idle Layer V3 adds a tabbed home game surface with Overview, Production, Orders,
  Routes, Training, Garage, Crew, Shop Spirit, Upgrades, Rival Shop Challenges, Passport, License,
  Ledger, and Settings panels.
- Settings now consolidates Progress Tools. Developer Tools stay hidden unless `?dev=1` or the
  local dev-tools flag is enabled.
- New local shop resources include Prep Slots, Shop Reach, Shop Spirit, Cup Stability XP, Route
  Knowledge, and License Stars. They persist in `tofuDriverGameStateV1` as summarized local state.
- Production now supports data-driven shop stations, global buy multipliers (`x1`, `x10`, `x100`,
  `Max`), milestone output boosts, station-specific upgrades, fictional route cards, parked
  training drills, fictional garage upgrades, Delivery Crew hires, Shop Spirit boosts, License
  Exams, License Perks, friendly Rival Shop Challenges, expanded Passport stamps, and a capped
  Delivery Ledger.
- Qualified Cup Test runs are framed as optional certified delivery boosts/status: they can grant
  bonus shop rewards and temporary Tofu Press boosts without making real driving required for
  ordinary shop progression.
- Don't Spill the Cup remains always available from navigation, the shop boost CTA, and post-run
  secondary actions without requiring shop resources.
- The Collection Layer adds cosmetic Delivery Crew character unlocks and local Sound Pack unlocks
  on a dedicated `#/crew` surface for parked/result screens only.
- Delivery Simulator is hidden by default and can be enabled locally with `?simulator=1` or
  `tofuDriverSimulatorEnabled=true` to test completed delivery rewards without sensors or location.
- Result screens now use one consolidated Delivery/Practice Complete layout, and Practice Mode
  is gated to modest local rewards while qualified-only ranks, stamps, daily completion, and merch
  progress stay behind Qualified Run criteria.
- Post-run navigation returns users to the updated dashboard/Tofu Shop, with another Cup Test as a
  secondary action instead of the only exit from results.
- First-run progressive reveal now keeps Today's Delivery and the Tofu Shop CTA prominent while the
  expanded Delivery Board, Passport, and dedicated Delivery Crew/Sound Pack surface wait until they
  matter.
- The top dashboard includes a Next Best Action card so first-run users see one primary home-shop
  action; Take the Cup Test remains available as a secondary certified action.
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
   details should expand or appear in navigation.
7. Play-test the first-run game dashboard on mobile and tune the amount of visible status if needed.
8. Play-test Tofu Shop pacing at home and tune tofu stock, delivery order, tips, Prep Slot,
   Shop Spirit, fictional route, crew, License Exam, and certified-boost rewards.
9. Use Delivery Simulator scenarios for local QA of Delivery Complete, unlocks, shop rewards, and
   share sanitization before mobile road tests.
10. Deepen the minimal V3 systems: route durations, crew assignment queues, richer ledger reports,
   Festival Boost inventory rewards, and better License Exam balancing.
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
- Which V3 idle systems should stay instant-result versus become timed/queued interactions?
- What is the right balance curve for License Exam resets and permanent License Perks?

## Non-Goals For The Current Slice

- No accounts.
- No leaderboards.
- No raw route uploads.
- No real-time location sharing.
- No payment flow.
- No pay-to-progress, paid speed/score boosts, loot boxes, or intrusive active-drive ads.
- No safety certification claims.
