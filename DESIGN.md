# Tofu Driver Design

Tofu Driver is a browser-only smooth-driving experiment. The core challenge is `The Cup Test`: keep
a virtual cup steady while driving normally. The product rewards smoothness, not speed.

## Brand Hierarchy

- `Tofu Driver` is the main app and brand.
- `Delivery Log` is the local-first game layer.
- `Tofu Shop` is the parked-only local management layer.
- `The Cup Test` is the core smooth-driving challenge.
- `No-Spill Club` is a rank, community tier, and merch tier, not the primary app name.
- `Perfect Pour` is the top achievement.

## Runtime Model

- The app is static HTML/CSS/JavaScript.
- Basic Mode uses `DeviceMotionEvent` only.
- Basic Mode does not request location.
- Qualified Run Mode is opt-in.
- Qualified Run Mode requests location only after the user selects it and starts the session.
- Mount orientation maps device-frame acceleration into vehicle lateral and braking/acceleration axes before scoring.
- The Custom / Diagnose mount preview uses local `DeviceMotionEvent` data only and does not start audio or geolocation.
- Audio coach volume is selected locally from Muted, Normal, or Loud and uses smoothed gain changes.
- The active Cup Test canvas uses a tofu cargo slosh visualization instead of a technical G-dot.
- Tofu Shop interactions are parked-only and hidden from the active drive screen.
- The active drive screen remains minimal: large Water Left / Cargo Condition, tofu slosh visual,
  audio coach, and no XP, stamp, shop, upgrade, or reward actions.

## Privacy Contract

- No raw motion stream is uploaded.
- No raw GPS samples are uploaded.
- No speed history is uploaded.
- No map, route trace, GPS coordinate list, or street-level detail is uploaded.
- No account is required for the current MVP.
- No backend is required for the current MVP.
- `localStorage` stores summarized local state only.
- Speed is used only for movement validation in Qualified Run Mode; it must not improve score, XP, stamps, merch progress, or share output.

## Local Storage

The app uses two versioned `localStorage` keys:

- `nospill.club.v1`
- `tofuDriverGameStateV1`

The Cup Test key is centralized as `STORAGE_KEY` in `frontend/nospill/app.js`.

The value is a JSON object with these top-level fields:

- `bestWaterScore`
- `completedSessionCount`
- `unlockedMilestones`
- `qualifiedSmoothDates`
- `savedSessions`
- `mountConfig`
- `audioLevel`

Saved session summaries contain summarized values only:

- `date`
- `mode`
- `waterLeft`
- `waterSpilled`
- `rank`
- `durationSeconds`
- `distanceMiles`
- `routeDifficultyLabel`
- `turnDensityScore`
- `curvatureScore`
- `qualificationStatus`
- `unlockedBadges`

`tofuDriverGameStateV1` stores summarized Delivery Log state:

- `totalXP`
- `level`
- `skillXP`
- `stamps`
- `dailyDeliveries`
- `streak`
- `merchProgress`
- `recentRewards`
- `recentSessions`
- `xpByDate`
- `routeMastery`
- `shop`

The `shop` object stores summarized local management progress only:

- `tofuStock`
- `reputation`
- `shopLevel`
- `lifetimeTofuPacked`
- `lifetimeReputation`
- `upgrades`
- `storyChapters`
- `staff`
- `customers`
- `contracts`
- `lastShopTickAt`
- `offlineEarnings`

Route mastery uses coarse fingerprints only: route type, distance bucket, duration bucket,
turn-density bucket, and curvature bucket. It must not include coordinates, street names, maps,
route traces, or raw GPS points.

Delivery Log progress persists on the same browser, device, and domain through `localStorage`.
There is no cross-device sync, account backup, or automatic migration between domains. Progress
from an older host such as `cavrino.com/nospill` will not automatically appear on `tofudriver.com`
because browser storage is scoped by origin.

Users can reset only the Tofu Driver game-state key, export a JSON backup of summarized game state,
and import a valid backup. Export/import must not include raw GPS samples, raw motion samples,
coordinates, route traces, speed logs, street names, or maps.

## Live Tofu Cargo Visualization

The live drive canvas shows a Tofu Driver cargo mascot moving inside a tray/delivery box. It
replaced the technical G-dot and does not use a standalone green corner indicator. The centered
tray boundary and rim communicate safe/near-spill state instead.

The default live mascot is the local app asset at
`frontend/nospill/assets/tofu-driver-app-image.png`. Source files from a user Downloads folder are
copy inputs only and must not be referenced by runtime code. If the image cannot load, the canvas
falls back to the built-in vector tofu mascot drawing.

The visualization uses the same local, filtered lateral and longitudinal G values used by scoring:

- lateral G moves the tofu side-to-side
- longitudinal G moves it forward/back
- total G controls danger-boundary intensity
- jerk controls restrained wobble

The visualization is local-only and does not change scoring. It has a reduced-motion path with less
wobble and no splash particles. Cargo Condition / Water Left remains the primary visible score, and
audio coach remains the primary eyes-off feedback while driving.

## Delivery Board V2

Delivery Log turns each completed Cup Test into a fragile-cargo delivery summary. The landing page
must make the game layer visible before the user opens setup controls. The primary first-run game
card is `Today's Delivery`, shown near the top of the landing page with cargo, flavor text, goal,
reward, daily progress, Driver License, level, XP, streak, No-Spill Club Gear progress, Delivery
Passport preview, and a parked Tofu Shop preview.

The secondary Delivery Board shows the same local delivery context with today's cargo profile, goal,
reward, driver license, numeric level, total XP, streak, No-Spill Club Gear progress, Delivery
Passport progress, recent reward, and recent stamps.

Daily deliveries are selected deterministically from the local calendar date and a static cargo
profile catalog. Cargo profiles include id, name, description, focus, goal text, reward text,
scoring emphasis, and suggested stamp. They require no server and are evaluated after the session
ends. Cargo Condition is derived from the existing water-left score, so it remains based on
smoothness, G-force, and jerk, not speed.

Route type labels are private/generic summaries:

- `Practice Route` for Basic Mode or non-qualified sessions
- `Calm Cruise`
- `City Delivery`
- `Mixed Route`
- `Technical Route`
- `Long Haul`

Technical rewards require Mixed or Technical route context. Short, easy, straight sessions can earn
practice credit but do not unlock major merch progress. Long qualified commutes can earn Long Haul,
Smooth Commute, consistency, and route mastery rewards without encouraging faster driving or
seeking twisty roads.

Driver License labels are derived from level: Rookie Carrier, Cup Courier, Smooth Driver,
No-Spill Candidate, Certified Tofu Driver, Perfect Pour Courier, and Delivery Legend. Delivery
Passport summarizes local stamps without duplicating them and must show an empty state for first-time
users.

`Delivery Complete` is the primary post-run game summary. It must show Cargo Condition, XP gained,
Skill XP gained, stamp result, daily delivery result, shop rewards, No-Spill Club Gear progress, and
the next delivery goal even when a section is empty.

## Tofu Shop

Tofu Shop is a cozy parked-only management layer. A compact Tofu Shop preview appears in the
top `Today's Delivery` card, and the full shop appears near the Delivery Board. Shop actions are not
shown during an active Cup Test. The UI copy must include the parked-only rule: `Shop Mode is for
when you are parked. Do not interact while driving.`

Shop resources are local-only:

- `Tofu Stock` comes from completed deliveries, the parked-only Pack Tofu action, and capped idle
  production from upgrades.
- `Reputation` comes from qualified smooth deliveries, daily delivery completion, stamps, and
  No-Spill / Perfect Pour outcomes. Packing tofu and idle production do not grant meaningful
  reputation.
- `Shop Level` is derived from reputation with `100 + level * 50` reputation required per level.
  Initial upgrades spend tofu stock and use reputation-derived Shop Level as the gate, so reputation
  does not go backward.

Pack Tofu grants a small amount of tofu stock and is disabled while a Cup Test is active. It does
not affect driving score and does not grant reputation.

Idle production is calculated locally from `lastShopTickAt` when the user returns. Offline tofu
stock is capped at 8 hours and does not grant reputation. There is no backend timer or worker.

The upgrade catalog is static and uses safe shop language only:

- Tofu Press
- Better Boxes
- Shop Sign
- Delivery Shelf
- Festival Cooler
- Cup Display

Upgrades can improve idle stock, delivery stock, reputation presentation, Delivery Wall display, or
story/cosmetic flavor. They must not imply faster driving, better vehicle handling, stronger brakes,
or any racing advantage.

Completed deliveries call `applyDeliveryToShop()` after scoring. Tofu stock and reputation are
based on Cargo Condition, qualification status, daily delivery completion, stamps, and existing
daily reward reduction. Higher speed must not increase shop rewards. Practice sessions can grant
limited tofu stock but no reputation by default; very short/unqualified sessions are capped.

Story chapters are local and short: First Delivery, The Soup Bowl Incident, Festival Order, The
Wedding Cake Contract, No-Spill Invitation, and Perfect Pour Trial. The initial contract model uses
one summarized Smooth Week contract. Neither story nor contracts require timed driving, faster
driving, exact distance sharing, or seeking special roads.

The Delivery Wall shows No-Spill Club Gear, Perfect Pour Drop, Delivery Crew progress, and recent
stamps. Locked merch links are hidden. Super Cute Collectibles remains the physical fulfillment
partner and does not verify scores in the current MVP.

## XP And Stamps

Driver XP is local-only and uses cargo condition, qualified-run bonus, daily delivery completion,
improvement over recent local average, route-type match, and low harsh input count. The first two
qualified deliveries per local day can grant full XP; additional qualified sessions grant reduced
XP to avoid encouraging extra driving.

Skill XP categories are:

- Brake Feather
- Throttle Control
- Smooth Hands
- Corner Calm
- Passenger Comfort
- Consistency

Collectible stamps are local-only. Initial stamps include First Delivery, Daily Delivery Complete,
Cup Stayed Full, Smooth Commute, Calm Cruise, City Smooth, Long Haul Pour, Curve Control, Technical
Pour, No Panic Inputs, Passenger Approved, No-Spill Club, and Perfect Pour.

## Sharing Contract

Share-link behavior is configured in `SHARE_CONFIG` inside `frontend/nospill/app.js`:

```js
{
  includeAppLink: false,
  appUrl: null,
  includeDistanceInShare: false
}
```

By default, share output includes only result text/card content and does not include an app URL.

By default, exact distance is excluded from Web Share text, copied summary text, generated PNG cards,
and other share payloads. If `includeDistanceInShare` is enabled later, distance may be included
only as a plain summary metric. It must not be framed competitively and must not be combined with
speed, maps, GPS coordinates, street names, route traces, or leaderboard-style language.

Share output may include Tofu Driver, Delivery Complete, Cargo Condition, rank, Driver License,
Shop Level, generic route type, stamp earned, daily delivery status, and `Not faster. Smoother.`
It must not include speed, average speed, top speed, GPS, location, coordinates, maps, route traces,
street names, exact distance by default, fastest time, high-G bragging, `cavrino.com/nospill`, or
Super Cute Collectibles links by default. Share output should not include shop click counts or idle
production stats by default.

## Discord Community

Discord is an optional community channel configured in `DISCORD_CONFIG` inside
`frontend/nospill/app.js`:

```js
{
  enabled: false,
  inviteUrl: null
}
```

The Discord CTA is hidden unless `enabled` is true and `inviteUrl` is set. It must not appear during
an active drive. When enabled, Discord is for delivery-card sharing, feature ideas, bug reports,
feedback, secret merch drops, and community updates.

Discord is not for reporting, identifying, shaming, or accusing drivers. A future moderation policy
is required before accepting user-generated driving incident reports. Discord invite links must not
be added to default share text or generated share images.

## Scoring Principles

- Smoothness is rewarded.
- Speed is not rewarded.
- Higher speed must not improve score, XP, rank, stamps, shop resources, milestones, merch, or share output.
- Safety copy must tell users not to look at the screen while driving.

## Merch Configuration

- The landing page may link to Super Cute Collectibles as the physical merch fulfillment partner.
- Future merch links live in `MERCH_LINKS` inside `frontend/nospill/app.js`.
- Visible merch labels live in `MERCH_LABELS` inside `frontend/nospill/app.js`.
- Delivery Log merch progress tracks No-Spill Club Gear `3/3`, Perfect Pour Drop locked/unlocked,
  and Delivery Crew `7/7`.
- Locked merch links are not rendered in the visible UI before unlock.
- `null` links show `Unlocked, merch coming soon.`
- External merch links must use `target="_blank"` and `rel="noopener noreferrer"`.
- Super Cute Collectibles does not verify scores in the current MVP.
- Real gated merch later requires backend-issued unlock tokens, customer tags, or another server-side access-control mechanism.
  Future backend unlock tokens should verify only summarized unlock state, not raw GPS or motion streams.

## Current Source Files

- `frontend/nospill/index.html`
- `frontend/nospill/app.css`
- `frontend/nospill/app.js`
- `frontend/nospill/assets/tofu-driver-logo.png`
- `frontend/nospill/assets/no-spill-95-delivered-badge.png`
- `test_frontend_nospill.js`

## Test Commands

```bash
node --check frontend/nospill/app.js
node --check test_frontend_nospill.js
node test_frontend_nospill.js
```

## Manual Verification

- Test on iPhone Safari over HTTPS.
- Test on Android Chrome over HTTPS.
- Test Basic Mode with location denied.
- Test Qualified Run Mode with location allowed.
- Test Flat, Upright, and Custom mount orientations.
- Test Audio coach Muted, Normal, Loud, and mute controls.
- Test Share Result, Copy Summary, and Download Card.
- Confirm default share output does not include exact distance.
- Inspect `localStorage` after a session.
- Confirm no raw GPS route arrays are saved.
- Confirm no speed/location/map/route trace/street details appear in share UI.
