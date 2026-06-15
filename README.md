# Tofu Driver

Tofu Driver is a browser-only smooth-driving experiment. It uses phone motion sensors to run
`The Cup Test`: a simple challenge where the driver tries to keep a virtual cup from spilling.
The current app layers a local-first `Delivery Log` and parked-only `Tofu Shop` over that challenge,
where each run is framed as a fragile tofu cargo delivery and smooth deliveries build shop progress.

The app is intentionally lightweight:

- static HTML/CSS/JavaScript
- no backend requirement for the current MVP
- no account system
- no payment flow
- no upload of raw motion or GPS samples
- local results stored only in browser `localStorage`
- secret shirts and future physical merch fulfilled through Super Cute Collectibles
- animated tofu cargo visualization driven by local motion data, not speed
- story-first landing flow with Today's Delivery, one Next Best Action CTA, and compact teaser cards
- parked-only Tofu Shop resources, three starter upgrades, and Delivery Wall progress
- cosmetic Delivery Crew character unlocks and local Sound Pack unlocks
- hidden local Delivery Simulator for QA, enabled with `?simulator=1`
- design target favors progressive reveal, earned status, and ethical cosmetics over pay-to-progress
- optional Discord community CTA, hidden unless `DISCORD_CONFIG` is enabled

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
