# Tofu Driver

Tofu Driver is a browser-only cozy delivery-management game with an optional smooth-driving
certification path. The base game is the parked-only `Tofu Shop`: tofu stock ticks upward,
delivery orders get prepared, and users can fulfill shop orders at home. `The Cup Test` uses phone
motion sensors as a certified smooth-delivery boost where the driver tries to keep a virtual cup
from spilling.

The app is intentionally lightweight:

- static HTML/CSS/JavaScript
- no backend requirement for the current MVP
- no account system
- no payment flow
- no upload of raw motion or GPS samples
- local results stored only in browser `localStorage`
- secret shirts and future physical merch fulfilled through Super Cute Collectibles
- animated tofu cargo visualization driven by local motion data, not speed
- story-first landing flow with Today's Delivery, one home-shop Next Best Action CTA, and optional Cup Test certification
- parked-only Tofu Shop resources, generator ticking, Fulfill Shop Order, starter upgrades, and Delivery Wall progress
- home progression through Tofu Stock, Delivery Orders, Tips, Reputation, and Shop Level without sensors
- consolidated Delivery/Practice Complete result screen that returns to the updated dashboard/shop
- Practice Mode grants modest local progress; qualified delivery criteria gate Perfect Pour and merch progress
- cosmetic Delivery Crew character unlocks and local Sound Pack unlocks
- hidden local Delivery Simulator for QA, enabled with `?simulator=1`
- design target favors progressive reveal, earned status, and ethical cosmetics over pay-to-progress
- optional Discord community CTA, hidden unless `DISCORD_CONFIG` is enabled

## App Surfaces

- `Tofu Shop` is the default home game. It uses local resources, generators, parked-only shop
  actions, upgrades, Delivery Wall progress, and collection systems without sensors or location.
- `Don't Spill the Cup` is the always-available challenge. It uses Basic Mode or opt-in Qualified
  Run to produce practice results or certified smooth-delivery boosts for the shop.

The static app uses hash routing for local navigation: `#/shop` and `#/cup-test`.

## Project Layout

- `frontend/nospill/index.html`: app shell
- `frontend/nospill/app.css`: app styling
- `frontend/nospill/app.js`: motion, scoring, sharing, and local storage logic
- `frontend/nospill/assets/`: app raster artwork
- `Dockerfile`: Nginx container used for Cloud Run source deploys
- `nginx.conf`: static-file routing and security headers for Cloud Run
- `test_frontend_nospill.js`: Node-based frontend behavior checks
- `DESIGN.md`: product, privacy, progressive reveal, ethical status, and future idle direction
- `PLAN.md`: next implementation steps

## Local Checks

```bash
make check
```

Open `frontend/nospill/index.html` in a browser for static inspection. Device motion behavior needs
a real mobile browser over HTTPS for full testing.

For local game-loop QA without a real drive, append `?simulator=1` to the app URL. Simulated
deliveries are labeled as test mode, use no sensors or location, and should not be treated as real
merch verification.

## Deploy

```bash
make prod
```
