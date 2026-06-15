# Tofu Driver

Tofu Driver is a static browser app with two connected experiences:

- `Don't Spill the Cup`: the default smooth-driving challenge.
- `Tofu Shop`: a parked-only idle/incremental shop game.

The Cup Test can provide optional certified smooth-delivery boosts for the shop, but ordinary Tofu
Shop progression is playable at home without sensors or location.

## Privacy And Safety Stance

- No backend is required for the current MVP.
- No account system.
- No payment flow.
- No analytics or tracking.
- No upload of raw motion or GPS samples.
- No upload of route traces, maps, street names, coordinates, or speed logs.
- Basic Mode does not request location.
- Qualified Run Mode requests location only after opt-in/start.
- Scoring and rewards prioritize smoothness, not speed.
- Shop, crew, sound, upgrade, and reward actions are parked-only.

## App Routes

The static app uses hash routing:

- root/no hash defaults to `#/cup-test`
- `#/cup-test`: Don't Spill the Cup
- `#/shop`: Tofu Shop
- `#/crew`: Delivery Crew collection controls when relevant

## Project Layout

- `frontend/nospill/index.html`: app shell
- `frontend/nospill/app.css`: app styling
- `frontend/nospill/app.js`: motion, scoring, shop, sharing, and local storage logic
- `frontend/nospill/assets/`: app raster artwork
- `test_frontend_nospill.js`: Node-based frontend behavior checks
- `DESIGN.md`: current product canon, safety/privacy contract, future direction
- `BALANCE_AND_PROGRESSION.md`: Tofu Shop economy, pacing, and progression contract
- `IMPLEMENTATION_STATUS.md`: implementation matrix with file/test evidence
- `PLAN.md`: tactical next steps, questions, and non-goals
- `DEPLOYMENT.md`: hosting/deploy instructions
- `Dockerfile`, `nginx.conf`, `Makefile`: static container/deploy support

## Local Checks

```bash
make check
```

Equivalent explicit checks:

```bash
node --check frontend/nospill/app.js
node --check test_frontend_nospill.js
node test_frontend_nospill.js
```

Open `frontend/nospill/index.html` in a browser for static inspection. Device motion behavior needs
a real mobile browser over HTTPS for full testing.

## Local QA Modes

Append `?simulator=1` to enable the hidden local Delivery Simulator. Simulated deliveries are
labeled as test mode, use no sensors or location, and are not trusted merch verification.

Append `?dev=1` or set `tofuDriverDevToolsEnabled=true` in localStorage to expose local developer
tools. Developer QA state is local-only and not trusted certified proof.

## Deploy

```bash
make prod
```
