# Tofu Driver

Tofu Driver is a static browser app with two connected experiences:

- `Don't Spill the Cup`: the default smooth-driving challenge.
- `Tofu Shop`: a parked-only idle/incremental shop game.

The Cup Test can provide optional certified smooth-delivery boosts for the shop, but ordinary Tofu
Shop progression is playable at home without sensors or location.

Tofu Shop starts with a focused first loop and reveals depth over time. The first Passport stamp
uses a local Stamp Fanfare, and the first meaningful hidden shop system uses a local Discovery
Fanfare so progression moments are visible without exposing the full future roadmap.

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
- `BALANCE_AND_PROGRESSION.md`: implementation reference for Tofu Shop economy, pacing, buttons,
  resources, generators, upgrades, reveal order, bottlenecks, prestige, future Dream Garage /
  Project Car progression, and balance tests
- `FIRST_LOOP_AUDIT.md`: current first-loop playtest audit and recommended next implementation
  slice for meaningful early upgrades and reveal timing
- `CORE_GAME_SPINE_AUDIT.md`: evidence audit for what is real versus scaffolding in the current
  Tofu Shop spine, plus the V1 implementation slice boundaries
- `EXTERNAL_REFERENCE_DOPEWARS_AUDIT.md`: read-only external mechanics study translated into
  future-safe Tofu Driver shop/garage concepts; not implemented behavior
- `IMPLEMENTATION_STATUS.md`: what is actually implemented, partial, placeholder, decorative,
  documented only, or non-goal, with file/test evidence
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
