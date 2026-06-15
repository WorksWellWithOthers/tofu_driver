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
The first-run hierarchy is brand, `Don't spill the cup.`, Today's Delivery, one clear goal, one
clear reward, primary `Take the Cup Test` CTA, then compact status and shop previews.

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

## Idle Incremental / Tofu Shop Expansion

This section documents a future product direction. It is not a statement that every system below is
implemented in the current live app.

### Core Pitch

Tofu Driver can evolve into a cozy idle incremental delivery-management RPG built on top of The Cup
Test and parked-only Tofu Shop.

The fantasy:

- start as one nervous tofu driver
- complete smooth deliveries
- build a tofu shop
- train apprentice drivers
- automate safe routes
- collect passport stamps
- unlock secret merch
- earn higher License ranks

The game is about condition, smoothness, mastery, and shop growth. It is not about real-world speed.

### Design Pillars

1. No repetitive clicking

   Avoid button-mashing. Active play should be smart setup choices, delivery planning, upgrades,
   and post-run decisions. Do not reward tapping while driving, and do not require repeated clicking
   to progress.

2. Active first, idle soon after

   The first minutes should feel tactile and rewarding. The player should complete a delivery, see a
   result, earn resources, and buy an upgrade quickly. Automation should unlock early to remove
   chores while preserving meaningful parked decisions.

3. Unfolding mechanics

   Start simple and reveal depth over time: Today's Delivery, Cup Test, tips/XP, first upgrade,
   Tofu Shop, fictional Route Map, Passport Stamps, Auto Driver, Weather, License Exam, Prestige,
   Rival Shops, Festival Routes, and Secret Customers.

4. Cozy failure

   Spills should be funny and partially rewarding. A bad delivery can earn fewer tips, lower cargo
   condition, and a funny report, but it should not erase progress.

5. Visual progress matters

   Numbers are not enough. Show shop growth, car decals, passport stamps, fictional route-map
   expansion, garage crew, delivery reports, and cup/cargo stability improvements.

6. One clear bottleneck at a time

   The player should know whether tofu, orders, route mastery, shop capacity, reputation, driver
   fatigue, or license rank is slowing progress. Avoid many currencies competing at once.

### Loop Structure

Short loop:

- start delivery
- choose route/setup
- run Cup Test
- receive result
- earn resources
- buy upgrade
- try again

Medium loop:

- shop produces tofu
- tofu becomes delivery orders
- player chooses routes
- deliveries generate tips, reputation, and XP
- automation begins

Long loop:

- player leaves
- shop and safe automated drivers continue
- offline report summarizes earnings
- player returns to spend resources and unlock goals

Meta loop:

- License Exam prestige
- partial reset
- permanent License Stars
- faster early game and new systems

Any real-world driving contribution must remain smoothness-based and must not incentivize
additional, faster, or riskier driving.

### Resources

Possible management-game resources:

- Tips
- Tofu Blocks
- Reputation
- XP
- Cup Stability
- Route Knowledge
- Passport Stamps
- License Stars

These resources belong to the management layer. They must not make real-world driving scores easier
through fictional upgrades unless the effect is explicitly framed as game, cosmetic, or story
progression.

### Generator / Pump System

Possible generators:

- Tofu Press
- Prep Counter
- Delivery Route
- Training Lot
- Garage
- Driver Crew

Avoid upgrade names and effects that imply real-world racing performance or unsafe behavior.

Acceptable language:

- Better Boxes
- Tofu Press
- Prep Counter
- Shop Sign
- Delivery Shelf
- Festival Cooler
- Cup Display
- Training Lot

Use caution or fictional-only framing for acceleration, delivery speed, braking upgrades, handling
upgrades, route speed, and no-brake challenges.

### Cup Test Design

The Cup Test remains the signature mechanic. A future idle-game MVP can make it strategy-first:

- choose a safe delivery strategy
- choose focus: tips, XP, route knowledge, or stamp chance
- receive a Perfect, Clean, Shaky, or Spilled result

Do not use real-world `Fast`, `Aggressive`, `No Brake`, `Beat the clock`, or `Speed` choices in a
way that could encourage unsafe driving. If fictional route choices exist, they should be clearly
separated from real-world driving mode.

### Route System

Routes can exist as fictional game content:

- Shop Street
- Old Hill Road
- Lantern Bridge
- Rainy Switchback
- Fox Shrine Road

Each fictional route may have duration, tofu required, spill difficulty, tips, reputation, stamp
pool, weather modifier, automation requirement, and unlock condition.

Route names and difficulty should remain fictional game content. Real-world app mode must not tell
users to seek specific road types, twisty roads, risky conditions, faster routes, or exact places.

### Tofu Shop

The Tofu Shop is the idle heart of the game. It can grow from:

- one tofu press
- one prep counter
- one route

Into:

- multiple presses
- prep staff
- dispatch board
- garage
- customer board
- festival booth
- regional tofu network

Shop mode is parked-only. Do not show clickable shop actions during active drive.

### Automation

Automation ladder:

1. Manual delivery
2. Auto-prep tofu
3. Auto-repeat safe route
4. Apprentice driver
5. Dispatcher
6. Auto-upgrade suggestions
7. Auto-route assignment
8. Prestige preview

Automation removes chores, not decisions.

### Prestige / License Exams

License Exams are the prestige layer:

- Local Delivery License
- Mountain License
- Night Route License
- Festival License
- Legend License
- Ghost Road License

License Stars are permanent prestige currency. Prestige should make replay faster, unlock new
mechanics, and reduce repetitive chores.

### Passport / Achievements

Passport Stamps are the collection layer. Categories can include:

- Delivery Stamps
- Route Stamps
- Style Stamps
- Time Stamps
- Secret Stamps

Avoid real-world unsafe achievements such as `No Brake Delivery`, `Fast Tofu`, or similar unless
they are clearly fictional idle-game route labels and not connected to real-world driving.

Preferred achievement language:

- Smooth Delivery
- Slow and Steady
- Zero Spill Streak
- Passenger Approved
- Calm Cruise
- Perfect Pour

### Delivery Reports And Ledger

The game should produce charming delivery reports and offline summaries. Reports and ledger entries
should explain:

- what happened while away
- what slowed progress
- what unlocked
- what to upgrade next
- funny spill reports
- customer rumors
- route discoveries

### UI Layout

Desired home hierarchy for the expanded game:

1. Today's Delivery
2. Player Status
3. Cup Stability / XP / License
4. Passport Stamps
5. Tofu Shop
6. Fictional Route Map
7. Garage
8. Crew
9. Ledger
10. Settings

Current TofuDriver.com should keep the first screen game-first and make Today's Delivery visible
before setup controls.

### Economy Rules

Possible economy rules:

- predictable exponential costs
- production rates shown clearly
- milestone boosts
- offline caps
- delivery reports instead of raw number dumps

The first version should keep currencies minimal. Avoid adding too many currencies at once.

### First 10 Minutes / First Hour

The first 10 minutes should teach the core loop:

- first delivery in minute 0-1
- first upgrade by minute 1-3
- Tofu Shop by minute 5
- first stamp by minute 10

Within the first hour, preview automation and the first License Exam goal. The player should
understand deliveries, upgrades, shop production, stamps, and prestige without seeing every future
system at once.

### MVP Scope

Future expanded MVP scope:

- Today's Delivery screen
- 5 fictional routes
- Cup Test result system
- Tips
- Tofu Blocks
- Reputation
- XP
- 15 upgrades
- Tofu Shop production
- one apprentice auto-driver
- offline progress
- Passport with 20 stamps
- License Exam prestige
- delivery reports
- save/load
- basic settings

Do not include yet:

- PvP
- global economy
- gacha
- full AI simulation
- procedural world
- multiplayer map
- ads
- premium currency
- seasonal events

### Canonical Prototype

The correct first prototype:

1. one screen
2. one route
3. one cup result
4. tips earned
5. one tofu generator
6. three upgrades
7. one delivery report
8. one stamp

Question to validate: Is it satisfying to run a delivery, see the cup result, earn tips, upgrade,
and feel better on the next run?

### Build Order

Proposed feature order:

1. Game state model
2. Tips and tofu resources
3. Tofu Shop generator
4. Manual delivery button
5. Cup Test result calculation
6. Delivery report
7. Upgrade shop
8. Fictional route map
9. Passport stamps
10. Route mastery
11. Apprentice auto-driver
12. Offline progress
13. License Exam prestige
14. License Star upgrades
15. Visual polish
16. Balance pass

### Final Design Rule

Every feature must answer at least one of:

- Does this make deliveries more fun?
- Does this make the tofu shop feel alive?
- Does this create a new goal?
- Does this automate a chore?
- Does this reveal a mystery?
- Does this make the player proud of progress?

If not, cut it from MVP.

### Explicit Safety Addendum

The idle incremental game layer may use fictional delivery, route, and shop systems, but real-world
driving mode must remain safety-first.

Hard rules:

- no in-drive clicking
- no real-world speed rewards
- no speed display as a performance metric
- no route leaderboards
- no public road competition
- no `beat the clock`
- no `drive faster`
- no `find a harder/twistier road`
- no high-G bragging
- no public reporting/shaming of drivers
- no raw GPS/motion upload by default

Interaction rule: driving produces summarized delivery outcomes. Management gameplay happens while
parked.

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
