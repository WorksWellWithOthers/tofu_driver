# Tofu Driver

Tofu Driver is a static browser app with two connected experiences:

- `Don't Spill the Cup`: the default smooth-driving challenge.
- `Tofu Garage`: a parked-only idle/incremental game mode whose first business is the Tofu Shop.

The Cup Test can provide optional certified smooth-delivery boosts for the shop, but ordinary Tofu
Tofu Garage progression is playable at home without sensors or location.

Cup-first visitors can reach Tofu Garage from the landing page and from parked Cup Test results.
Cup Test result cards include safe local summaries such as Cargo Type, Trip Time, Drive Shape,
decorative Cup Trail, Daily Delivery Credit, and Coach Recap labels. These are derived from
summarized motion only and must not expose speed, distance, GPS, maps, street names, route traces,
or racing/performance-driving technique.

Tofu Shop, the first Tofu Garage business, starts with a focused first loop and reveals depth over
time. The first Passport stamp uses a local Stamp Fanfare, and the first meaningful hidden shop
system uses a local Discovery Fanfare so progression moments are visible without exposing the full
future roadmap. Midgame supply pressure is handled through parked management decisions such as
Counter Service batch upgrades and Reputation-funded Supplier Contracts, not faster clicking.

## Privacy And Safety Stance

- No backend is required for the current MVP.
- No account system.
- No payment flow.
- Optional PostHog product analytics is disabled unless configured.
- PostHog autocapture and session recording are disabled by default.
- No upload of raw motion or GPS samples.
- No upload of route traces, maps, street names, coordinates, or speed logs.
- Basic Mode does not request location.
- Qualified Run Mode requests location only after opt-in/start.
- Scoring and rewards prioritize smoothness, not speed.
- Shop, crew, sound, upgrade, and reward actions are parked-only.

## Optional Analytics

PostHog analytics is configured through runtime settings and no-ops when disabled or missing a key.
The browser project key is public configuration, but real keys should not be committed.

Runtime config:

- `TOFU_DRIVER_POSTHOG_ENABLED`
- `TOFU_DRIVER_POSTHOG_KEY`
- `TOFU_DRIVER_POSTHOG_HOST`
- `TOFU_DRIVER_POSTHOG_DEBUG`

Local opt-out:

```js
localStorage.setItem("tofuDriverAnalyticsOptOut", "true")
```

Tracked events are product-scoped with the `tofu_driver_` prefix and use safe categories or buckets:
route views, Cup Test start/completion, shop order fulfillment, station/upgrade purchases, share
attempts, offline progress seen, simulator/dev events, and progress-tool clicks. Analytics must
never send raw GPS, raw motion, speed, acceleration vectors, route traces, maps, street names,
coordinates, exact distance, localStorage dumps, save files, share-card contents, or user-entered
personal information.

Sticker/QR links may include sanitized attribution params:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `td_source`
- `td_campaign`

## App Routes

The static app uses hash routing:

- root/no hash defaults to `#/cup-test`
- `#/cup-test`: Don't Spill the Cup
- `#/shop`: Tofu Garage
- `#/garage`: Tofu Garage alias; `#/shop` remains supported
- `#/crew`: Delivery Crew parked placeholder/collection controls

## Project Layout

- `frontend/nospill/index.html`: app shell
- `frontend/nospill/app.css`: app styling
- `frontend/nospill/app.js`: motion, scoring, shop, sharing, and local storage logic
- `frontend/nospill/runtime-config.js`: disabled default runtime config for optional analytics
- `frontend/nospill/images/`: runtime raster images
- `test_frontend_nospill.js`: Node-based frontend behavior checks
- `CHARACTER_ART_ASSET_INVENTORY.md`: parked-only character art slot inventory, placeholder rules,
  and integrated Mika MVP asset-pack paths
- `TOFU_SHOP_LIVING_SCENE_ASSET_SPEC.md`: parked-only full-scene Tofu Shop artwork variants,
  placeholder behavior, and MVP scene-art recommendation
- `TOFU_GARAGE_PERFORMANCE_AUDIT.md`: high-scale idle-game performance audit covering scalar
  resources, compact formatting, coalesced rendering, aggregate offline progress, queue/history
  caps, and the deferred BigNumber/mantissa-exponent strategy
- `TOFU_GARAGE_UNFOLD_AUDIT.md`: meaningful-unfold audit for current Tofu Garage resources,
  bulk-buy quality-of-life rules, affordability progress, and deferred/future system boundaries
- `DESIGN.md`: current product canon, safety/privacy contract, future direction
- `BALANCE_AND_PROGRESSION.md`: implementation reference for Tofu Shop economy, pacing, buttons,
  resources, generators, upgrades, reveal order, bottlenecks, prestige, future Dream Garage /
  Project Car progression, future Net Worth endgame direction, and balance tests. Tofu Shop is
  idle-first: manual actions teach the loop, repeated labor earns automation exits, and decisions
  rather than clicking speed drive progression.
- `FIRST_LOOP_AUDIT.md`: current first-loop playtest audit and recommended next implementation
  slice for meaningful early upgrades and reveal timing
- `CORE_GAME_SPINE_AUDIT.md`: evidence audit for what is real versus scaffolding in the current
  Tofu Shop spine, plus the V1 implementation slice boundaries
- `EXTERNAL_REFERENCE_DOPEWARS_AUDIT.md`: read-only external mechanics study translated into
  future-safe Tofu Driver shop/garage concepts; not implemented behavior
- `EXTERNAL_REFERENCE_ANTIMATTER_DIMENSIONS_AUDIT.md`: read-only progression-architecture study
  translated into future-safe Tofu Shop milestone, automation, stamp, challenge, and prestige
  concepts; not implemented behavior
- `EXTERNAL_REFERENCE_INCREMENTAL_GAME_DESIGN_TRANSCRIPTS_AUDIT.md`: transcript synthesis of
  incremental-game design lessons translated into future-safe Tofu Shop pacing, automation, novelty,
  UI restraint, and resource-sink guidance; not implemented behavior
  Raw transcript files are local source inputs and are not committed by default.
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

Mobile motion troubleshooting:

- iOS Safari may require a user gesture before motion permission can be requested. Tap
  `Start & Calibrate`; do not expect permission prompts on page load. The app requests motion
  permission before starting optional audio so the tap gesture is preserved for Safari.
- Don’t Spill the Cup requires HTTPS for motion sensors, except local development contexts such as
  `localhost`.
- Permission denied, insecure HTTP, true unsupported browsers, and “permission granted but no
  sensor data yet” are separate states with separate copy.

## Local QA Modes

Append `?simulator=1` to enable the hidden local Delivery Simulator. Simulated deliveries are
labeled as test mode, use no sensors or location, and are not trusted merch verification.

Append `?dev=1` or set `tofuDriverDevToolsEnabled=true` in localStorage to expose local developer
tools. Developer QA state is local-only and not trusted certified proof.

## Deploy

```bash
make prod
```
