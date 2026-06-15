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
- `simulated`
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
- `collection`

The `shop` object stores summarized local management progress only:

- `tofuStock`
- `reputation`
- `shopLevel`
- `lifetimeTofuPacked`
- `lifetimeReputation`
- `upgrades`
- `lastShopTickAt`
- `offlineEarnings`

The `collection` object stores cosmetic local unlock state only:

- `selectedCharacterId`
- `unlockedCharacterIds`
- `selectedSoundPackId`
- `unlockedSoundPackIds`
- `seenUnlockIds`

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

Practice Mode results use a separate reward hierarchy. Basic Mode and `Practice Route` sessions can
earn small XP, small skill XP, modest tofu stock after a valid duration, the first-delivery
onboarding stamp, and cosmetic onboarding unlocks. They must not grant `Perfect Pour`, `No-Spill
Club` ranks, qualified route stamps, Daily Delivery completion from zero/near-zero runs, or merch
progress for No-Spill Club Gear, Perfect Pour Drop, or Delivery Crew. A 100% practice result may say
`Perfect Practice`; `Perfect Pour` is reserved for qualified deliveries.

Driver License labels are derived from level: Rookie Carrier, Cup Courier, Smooth Driver,
No-Spill Candidate, Certified Tofu Driver, Perfect Pour Courier, and Delivery Legend. Delivery
Passport summarizes local stamps without duplicating them and must show an empty state for first-time
users.

`Delivery Complete` or `Practice Complete` is the single primary post-run game summary. It must show
Cargo Condition, route type, rank, qualification, daily delivery result, coach recap, XP gained,
Skill XP gained, stamp result, shop rewards, unlocks, merch progress, share actions, and the next
delivery goal even when a section is empty. Do not render a separate legacy milestone or gear result
block alongside the consolidated result layout.

Post-run navigation must close the loop back to the game dashboard. `Return to Tofu Shop` or
`Return to Dashboard` is the primary result-screen action and must rerender updated resources,
unlocks, Delivery Passport, Tofu Shop, Delivery Crew, merch progress, and Next Best Action. `Take
Another Cup Test` is secondary, not the only path out of a result. Users should be able to review the
updated shop state after every delivery before choosing another run.

## Home Progression + Certified Delivery Boosts

Home shop progression is the base game. A user should be able to play Tofu Driver comfortably while
parked at home without granting sensor or location permissions. The Tofu Shop produces resources,
prepares orders, and lets the player fulfill fictional shop orders locally. The physical Cup Test is
an optional certified smooth-delivery boost and status path, not the gate for ordinary progression.

First-run action hierarchy:

- Primary: `Start the Tofu Shop`, which routes to parked shop play.
- Secondary: `Take the Cup Test`, framed as an optional certified boost when the user is parked and
  ready.
- Only one primary CTA should be visually dominant.

Home shop progression can grant ordinary local resources:

- `Tofu Stock`
- `Delivery Orders`
- `Tips`
- `Reputation`
- small local XP
- shop unlock progress

Certified Cup Test results can grant special status and boosts:

- bonus reputation, tofu stock, and tips based on Cargo Condition and qualification status
- temporary Tofu Press production boost
- Certified Delivery stamps and merch progress
- special Delivery Complete report language

Certified boosts must not scale with speed, exact route, street names, maps, high-G bragging, or
route leaderboards. Practice Mode can grant modest local progress but must not grant certified merch
progress. Simulated deliveries remain QA-only and are not trusted certified deliveries.

Unlock presentation should split into two tracks:

- `Shop Unlocks` come from growing the Tofu Shop.
- `Certified Delivery Unlocks` come from qualified smooth-driving results.

Avoid wording such as `real vs fake` or anything implying simulator/home play is fraudulent. Use
`home shop`, `shop order`, `certified delivery`, and `qualified smooth-driving result`.

## Tofu Shop V1 / Generator V2

Tofu Shop V1 is the implemented cozy parked-only management layer. Generator V2 adds the first
visible local incremental loop. The full shop can appear before the first real-world drive because
home shop progression is the base game. Shop actions and generator controls are not shown during an
active Cup Test. The UI copy must include the parked-only rule: `Shop Mode is for when you are
parked. Do not interact while driving.`

Shop resources are local-only:

- `Tofu Stock` comes from completed deliveries, the parked-only Pack Tofu action, and capped idle
  production from the Tofu Press generator.
- `Delivery Orders` are produced by the Prep Counter from Tofu Stock. Delivery Orders are a shop
  resource only in this version and are not required to take The Cup Test.
- `Tips` come from fulfilled home shop orders and optional certified delivery boosts.
- `Reputation` comes from qualified smooth deliveries, daily delivery completion, stamps, and
  No-Spill / Perfect Pour outcomes, plus small home shop order handoffs. Packing tofu and idle
  production do not grant meaningful reputation.
- `Shop Level` is derived from reputation with `100 + level * 50` reputation required per level.
  Initial upgrades spend tofu stock and use reputation-derived Shop Level as the gate, so reputation
  does not go backward.

Pack Tofu grants a small amount of tofu stock and is disabled while a Cup Test is active. Fulfill
Shop Order consumes one Delivery Order and grants tips, small reputation, and small XP without using
sensors or implying a real drive occurred. It uses a lightweight `Shop Order Complete` result screen
with share-card actions disabled. Neither action affects driving score.

The live parked generator loop is local-only:

- `Tofu Press` starts as the first home generator and produces Tofu Stock over elapsed time.
- `Prep Counter` unlocks after enough shop progress, consumes Tofu Stock, and produces Delivery
  Orders.
- Generator math uses timestamps, not frame count, and open-page elapsed time is clamped to avoid
  large tab-sleep jumps.
- Offline progress is calculated locally from `lastGeneratorTickAt` / `lastShopTickAt`, capped at
  8 hours, and summarized as tofu stock plus delivery orders.
- Idle generation does not grant reputation and does not affect real-world driving score.

There is no backend timer, service worker, or worker process.

The implemented shop upgrade catalog is static and uses safe shop language only:

- Tofu Press
- Prep Counter
- Better Boxes
- Shop Sign

Upgrades can improve idle stock, delivery stock, or reputation presentation. They must not imply
faster driving, better vehicle handling, stronger brakes, or any racing advantage.

Completed Cup Tests call `applyDeliveryToShop()` after scoring. Tofu stock, tips, reputation, and
certified boosts are based on Cargo Condition, qualification status, daily delivery completion,
stamps, and existing daily reward reduction. Higher speed must not increase shop rewards. Practice
sessions can grant limited local progress but no certified boost; very short/unqualified sessions
are capped.

The Delivery Wall separates `Shop Unlocks` from `Certified Delivery Unlocks`. Locked merch links are
hidden. Super Cute Collectibles remains the physical fulfillment partner and does not verify scores
in the current MVP.

Story chapters, customers, contracts, apprentices, route maps, and prestige remain future scope in
the idle incremental expansion section below. They are not part of Tofu Shop V1 runtime behavior.

## Collection Layer

The Collection Layer is a small cosmetic unlock system for parked and result screens. It adds
Character Unlocks, Sound Effect Unlocks, a Delivery Crew panel, and a Sound Pack selector without
changing real-world driving scoring.

Characters are local-only shop/story flavor. V1 character unlocks are:

- `Angry Tofu Driver`: unlocks after First Delivery.
- `Sleepy Dispatcher`: unlocks at Shop Level 2.
- `Tea Master`: unlocks after a Hot Tea delivery with 90%+ Cargo Condition.
- `Perfect Pour Courier`: unlocks after Perfect Pour.

Characters can appear in Tofu Shop, Delivery Crew, Delivery Complete, and safe share flavor such as
`Delivery Crew: Angry Tofu Driver.` They do not improve real-world driving score, shop rewards, XP,
stamps, merch progress, rank, or route classification.

Sound Packs are local-only cosmetic UI/audio polish. V1 sound packs are:

- `Default`: unlocked for all users.
- `Tofu Shop Bell`: unlocks at Shop Level 2.
- `Retro Arcade`: unlocks after the first stamp or three deliveries.
- `Perfect Pour Chime`: unlocks after Perfect Pour.

Sound effects are synthesized locally with Web Audio; no external audio files are required. The
Sound Pack selector and preview button are parked/menu interactions. Preview requires a user action.
Muted mode disables cosmetic sound effects, Normal uses modest volume, and Loud remains clamped.
Reward and unlock sounds may play only after a run has ended. They must not play during active
drive, and the active-drive audio coach remains separate, calm, and user-controlled.

Character and Sound Pack unlocks are evaluated from summarized game state: stamps, Shop Level,
daily cargo identity, Cargo Condition, and completed delivery summaries. They must not use speed,
raw GPS samples, raw motion samples, coordinates, route traces, maps, street names, or speed logs.

## Progressive Reveal And Narrative Unfolding

Tofu Driver should use progressive reveal as a guiding design rule for the current app and future
idle-management expansion. The direction is inspired by mystery-first incremental games: make the
game visible, but reveal systems only when they matter.

### Core Principle

Tofu Driver should unfold like a mystery. At the start, the player should see only the smallest
meaningful state:

- the cup
- the first delivery
- one clear action
- one clear outcome

Example first-run mood:

```text
The cup is full.

[Start Delivery]
```

The player should not see every system immediately. Avoid showing all of these on first load:

- XP
- Passport
- Tofu Shop
- Delivery Wall
- merch progress
- Reputation
- Characters
- Sound Packs
- upgrades
- automation
- prestige

These systems should appear after they are earned or introduced through a story beat.

### Why This Matters

Dashboard-first design can feel overwhelming. Progressive reveal creates:

- curiosity
- mystery
- stronger onboarding
- clearer next goals
- better emotional attachment
- less UI clutter
- better one-more-delivery motivation

### Reveal Order

1. The Cup

   The first screen shows the full cup and Start Delivery. Do not show shop, XP, Passport, or merch
   yet.

2. First Delivery

   After the first run, show Delivery Complete, Cargo Condition, and a small delivery report.

3. Tips

   Tips are the first visible resource. They are earned from delivery outcome.

4. Pack Tofu

   After a few deliveries, reveal that the shop needs tofu and unlock the parked-only Pack Tofu
   action.

5. Tofu Stock

   Tofu Stock is the second resource and shows that the shop is becoming real.

6. Tofu Press

   Tofu Press is the first generator. Tofu Stock begins increasing slowly, creating the first true
   incremental-game moment.

7. Reputation

   Reputation unlocks after a clean delivery. Story beat: word spreads.

8. Passport

   Passport unlocks after the first stamp-worthy delivery. Story beat: an old passport opens on the
   counter.

9. Shop Upgrades

   Shop Upgrades unlock after the player has tips or tofu stock. Show one obvious bottleneck at a
   time.

10. Delivery Crew / Characters

    Characters unlock when shop level or story reaches the right point. Story beat: a sleepy
    dispatcher arrives.

11. Route Map

    A fictional game route map unlocks after reputation. It must remain separate from real-world
    route incentives.

12. Auto Driver

    Automation unlocks after route mastery. It removes chores, not decisions.

13. License Exam

    Prestige unlocks after enough progress. Story beat: a letter arrives from the Delivery Office.

### Narrative Beat Rule

Every major mechanic should unlock with a short story beat. Examples:

- "The cup is full."
- "The tofu survived. Mostly."
- "The shop is running low."
- "The press rattles awake."
- "Word spreads."
- "The passport opens."
- "A sleepy dispatcher asks where the clipboard is."
- "Someone mentions Old Hill Road."
- "An apprentice says they can handle the safe route."
- "A letter arrives from the Delivery Office."

Story beats should be short, charming, and non-intrusive.

### Resource Reveal Rule

Resources should be revealed one at a time. Recommended order:

1. Tips
2. Tofu Stock
3. Reputation
4. Passport Stamps
5. License Stars

Do not show future currencies before they matter. Do not add many currencies at once.

### UI Rule

First-time users should see a story-first interface.

Suggested first-run hierarchy:

1. Tofu Driver logo/brand
2. "The cup is full."
3. Start Delivery / Take The Cup Test
4. minimal safety copy
5. nothing else unless already unlocked

Suggested returning-user hierarchy after unlocks:

1. Today's Delivery
2. current story/report
3. primary resource row
4. next best action
5. unlocked systems
6. settings

### Next Best Action Rule

The app must always make the next step obvious. Progressive reveal should reduce decision
confusion, not just hide or show systems.

Action hierarchy:

1. Active drive in progress: show only active-drive controls. Do not show shop actions.
2. First-time user with no home shop action: `Next: Start the Tofu Shop`.
3. Prepared Delivery Orders available: `Next: Fulfill Shop Order`.
4. Tofu Stock is low: `Next: Pack Tofu`.
5. Affordable shop upgrade exists: `Next: Buy an Upgrade`.
6. Optional certified boost available: `Next: Certified Cup Test`.
7. Otherwise: `Next: Continue the Shop`.

`Start the Tofu Shop` owns first-run priority. `Take the Cup Test` remains available as a secondary
certified action. Pack Tofu and Fulfill Shop Order are parked-only home actions and must not appear
inside the active-drive screen.

Only one primary CTA should be visually dominant in the top action area. Secondary shop actions can
remain visible after unlock, but they must not compete with the top next-best-action card.

### System Visibility Rule

Each system should have three states:

- hidden
- newly discovered
- active dashboard card

Examples:

Tofu Shop:

- hidden before tofu stock matters
- newly discovered after "The shop is running low"
- dashboard card after Pack Tofu / Tofu Press unlock

Passport:

- hidden before first stamp
- newly discovered with story beat
- dashboard card after first stamp

Characters:

- hidden before first character
- newly discovered with arrival story
- dashboard card after Delivery Crew unlock

### Safety / Legal Addendum

Progressive reveal must preserve the existing safety model:

- no in-drive clicking
- no real-world speed rewards
- no speed display as a performance metric
- no route leaderboards
- no public road competition
- no "beat the clock"
- no "drive faster"
- no "find a harder/twistier road"
- no high-G bragging
- no public reporting/shaming of drivers
- no raw GPS/motion upload by default

Real-world driving mode rewards smoothness, produces summarized delivery outcomes, and remains
audio-first and low-interaction.

Management game mode happens while parked. It can show upgrades, resources, shop actions,
characters, and collection systems.

Fictional route systems may exist inside the idle game layer, but they must not tell users to seek
real roads or risky routes.

### Copy Guidance

Prefer:

- Smooth Delivery
- Clean Delivery
- Calm Cruise
- Passenger Approved
- Perfect Pour
- Stable Cargo
- Careful Route
- Shop Delivery
- Route Mastery

Avoid or heavily qualify:

- Fast
- Aggressive
- No Brake
- Beat the Clock
- Attack
- Send It
- High-G
- Race
- Drift
- Touge
- Find a twisty road

If words like "route" or "mountain" are used, clarify when they are fictional idle-game content and
not instructions for real-world driving.

### Design Checklist

- Does the first screen explain the goal without showing every system?
- Does the first delivery unlock at least one new thing?
- Does every new system arrive with a story beat?
- Is only one new resource introduced at a time?
- Does each system have hidden / discovered / active states?
- Does the player always know the next best action?
- Does the app avoid in-drive interaction?
- Does the app avoid speed incentives?
- Does the story make the shop feel alive?
- Does the reveal create curiosity without hiding necessary safety information?

### Relationship To Existing Dashboard

The current visible Delivery Board, Tofu Shop, Passport, Collection Layer, and merch progress work is
still useful, but should eventually respect unlock states.

Current implementation uses this as a first pass:

- Today's Delivery and the primary Tofu Shop CTA are visible immediately.
- The first-run page defaults to a story-like surface: brand, cup premise, Today's Delivery, one
  goal, one reward, one primary CTA, compact status, and minimal safety copy.
- Tofu Shop is playable immediately; Delivery Passport, Delivery Crew, and Sound Packs appear as
  compact teaser cards first.
- The expanded Delivery Board, Tofu Shop, Delivery Wall, Delivery Crew, Sound Pack lists, and
  progress tools do not compete with the first delivery flow.
- Pack Tofu is available for parked home play; upgrades and Fulfill Shop Order appear when the
  relevant resources exist.
- Stamp details unlock after the first stamp-worthy delivery.
- Crew and sound selection controls unlock only after character or sound-pack unlocks exist.
- Export, import, and reset controls live in `Settings / Progress Tools`, not the first-run main
  dashboard.
- Active-drive screens still hide shop, crew, sound, and reward interactions.

The design target is not to remove the dashboard. The target is:

- first-time users get mystery and focus
- returning users get the dashboard they have earned
- unlocked systems stay visible and useful

### Implementation Note

This is a design direction, not an implementation requirement for this pass. Do not add new storage
keys, auth, database, backend APIs, analytics, networking, service workers, or new gameplay behavior
just to satisfy this section.

## Monetization And Social Status

Tofu Driver should use ethical cosmetic and status-based monetization, not predatory idle-game
monetization. Pure cosmetics have limited value in isolated single-player idle games because no one
sees them. Cosmetics become more meaningful when they express identity, appear in shareable proof,
contribute to profile status, or become visible in a community context.

Tofu Driver should monetize through:

- earned merch
- cosmetic shop themes
- character cosmetics
- sound packs
- delivery-card frames
- profile badges
- convention/event drops
- community status
- optional supporter purchases

Tofu Driver should not sell real-world driving advantage, score advantage, speed, qualification, or
fraudulent merch unlocks.

Do not design monetization around:

- pay-to-progress
- time skips
- frustration walls
- paid speed boosts
- paid XP boosts
- paid route advantages
- premium currencies designed to obscure spending
- FOMO pressure
- paid progression required for normal enjoyment
- whale-targeted mechanics
- gambling or loot-box style random purchases

### Ethical Monetization Rule

The player may pay to express identity, support the project, decorate their shop/profile, or claim
earned physical merch.

The player should not pay to bypass the core meaning of smooth driving achievements.

Acceptable monetization examples:

- No-Spill Club shirt after earning the unlock
- Perfect Pour decal after earning the unlock
- alternate character skins
- shop theme packs
- sound effect packs
- share-card frames
- supporter badge
- convention-exclusive cosmetic stamp
- physical merch fulfilled by Super Cute Collectibles

Avoid:

- pay $4.99 to unlock No-Spill Club without earning it
- pay for better Cargo Condition
- pay for XP multipliers that affect driving achievements
- pay for route qualification
- pay for speed bonuses
- pay for fake stamps
- paid time warps that trivialize progression
- loot boxes for characters/sounds
- energy systems that block normal use

### Social Status Layer

Cosmetics need a stage. Tofu Driver should build social status through:

- shareable Delivery Complete cards
- Delivery Passport stamps
- earned merch unlocks
- profile cards
- Discord community sharing
- convention/event stamps
- future garage/crew pages
- future public but privacy-safe showcases

Social status should be about:

- consistency
- smoothness
- cargo condition
- stamps
- shop level
- characters collected
- sound packs unlocked
- No-Spill Club progress
- Perfect Pour achievement

Social status must not be about:

- speed
- exact route
- map
- GPS trace
- street names
- high-G bragging
- public road competition
- shaming other drivers

### Minimalist / A Dark Room-Inspired Status

Social status should preserve the mystery and minimalism of the app:

- no noisy global chat on the first screen
- no leaderboard-first design
- optional asynchronous community layer
- share cards as the first social surface
- future public profile cards as the second social surface
- future `Delivery Chronicle` as an asynchronous status ledger

Possible future feature: `Delivery Chronicle`.

`Delivery Chronicle` would be a privacy-safe asynchronous feed of rare achievements:

- Perfect Pour achieved
- No-Spill Club joined
- 7-day Delivery Crew streak completed
- secret stamp discovered
- convention stamp earned

The Chronicle must not include:

- speed
- route
- map
- street
- coordinates
- exact distance by default
- license plates
- reports about other drivers

### Swarm / Incremental-Inspired Status

If the idle layer grows, status can come from the player's shop ecosystem:

- Tofu Shop level
- shop theme
- staff/character roster
- passport stamp count
- Delivery Wall
- license rank
- cosmetic shop decorations
- share-card frame
- supporter badge

This gives cosmetics value without selling power.

### Cookie Clicker-Inspired Support Model

A fair support model can resemble:

- free browser app
- optional supporter purchase
- paid cosmetic/supporter edition later
- merch
- subtle, non-intrusive sponsorships only if ever needed

Avoid intrusive ads in the active driving experience.

If ads are ever considered:

- never during active drive
- never as a requirement for safety-critical feedback
- never as popups over driving UI
- only optional, parked, and non-disruptive

### IdleOn / Social Hub-Inspired Future

Large cosmetic revenue would require social visibility. Possible future features:

- optional Tofu Driver profile
- public Delivery Passport
- garage/crew pages
- Discord-linked community events
- convention drop pages
- shareable shop showcase
- cosmetic character/team display

This is future scope and should not be implemented until:

- the core Cup Test is fun
- Delivery Complete cards are being shared
- users care about stamps/progress
- users ask to save profiles or show off status

### Privacy And Safety Guardrails

Monetization and social status must preserve these rules:

- no raw GPS upload by default
- no raw motion upload by default
- no speed-based status
- no public road leaderboards
- no public route competition
- no driver shaming/reporting system in MVP
- no license plate collection
- no in-drive social interaction
- no in-drive shop interaction
- Discord/community links are for parked use only

### Relationship To Character And Sound Unlocks

Character unlocks and sound effect unlocks are a good fit for ethical cosmetic/status
monetization. They may:

- personalize the shop
- personalize share cards
- create collectible goals
- support merch drops
- create Discord/community identity

They must not:

- improve real-world driving score
- improve route qualification
- reward speed
- require risky driving
- play distracting reward sounds during active drive

### Implementation Note

This section is a monetization and social-status design direction. Do not implement payments,
accounts, backend APIs, ads, Discord integrations, social feeds, public profiles, new storage keys,
or new gameplay behavior just to satisfy this section.

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

### Long-Arc Narrative Inspiration

Future Tofu Driver can borrow the multi-phase structure of minimalist incremental games: a quiet
beginning, one resource at a time, story beats that reveal systems, automation that removes chores,
and a strange endgame that still honors the cup. This is future design direction, not current
runtime behavior.

The long arc can unfold in six safe phases:

1. The Dark Garage

   Start with one quiet scene. The engine is cold. The cup is full. The first action is Start
   Delivery / Take The Cup Test. Reveal only one mechanic at a time. The first reward is a small
   delivery report and Tips.

   Avoid making engine revving, speed fantasy, drifting, or racing language part of real-world
   driving mode.

2. The Tofu Shop

   The shop becomes the first management layer: Tofu Stock, Reputation, Shop Level, Pack Tofu,
   Tofu Press, Better Boxes, and Shop Sign. Shop mode is parked-only. Smooth deliveries build
   reputation. Idle production is capped and summarized. Shop growth should feel cozy and alive.

3. Fictional Route Network

   A fictional route map may exist in the idle layer later. Routes are game content, not
   instructions for real-world roads. Atmospheric route names can include:

   - Shop Street
   - Old Hill Road
   - Lantern Bridge
   - Rainy Switchback
   - Fox Shrine Road

   Route mastery should be fictional or idle progression. Real-world app mode must not tell users
   to seek twisty roads, risky roads, faster roads, or specific road types.

4. Delivery Network Expansion

   The player can eventually train apprentices, dispatchers, prep staff, and route scouts.
   Automation removes chores, not decisions. Automation should repeat fictional safe routes or shop
   tasks. It must not encourage extra real-world driving.

5. License Prestige

   Prestige should be themed as License Exams. A License Exam partially resets fictional
   shop/network progress and grants permanent License Stars. License Stars can improve future
   idle-game pacing, shop convenience, story unlocks, or cosmetic progress. They must not improve
   real-world driving score or qualification.

   Possible license ranks:

   - Local Delivery License
   - Mountain Shop License
   - Night Delivery License
   - Festival License
   - Legend License
   - Ghost Road License

   Words like mountain, night, and route are fictional game content unless explicitly tied to safe,
   legal, summarized real-world driving outcomes.

6. Legendary Final Delivery

   Endgame can become surreal and dramatic while preserving the core metaphor: the water in the cup
   does not spill. The final fantasy is not fastest driver. The final fantasy is perfect control.
   The ending should reinforce: Not faster. Smoother.

   Possible ending copy:

   ```text
   The mountain behind is quiet.
   The shop lights are still on.
   The road ahead is calm.
   The cup is full.
   ```

If future fictional mechanics include rivals, races, speed, drifting, or battles, they must be
renamed or framed as non-real-world fictional challenges.

Prefer:

- Delivery Trial
- License Exam
- Route Mastery
- Smoothness Trial
- Rival Shop Challenge
- Festival Order
- Perfect Pour Trial

Avoid:

- street race
- drift battle
- beat the clock
- fastest route
- high-speed run
- attack the pass
- no-brake challenge

Fictional speed fantasy may exist only as stylized story flavor inside the idle layer. It must never
become a real-world instruction, metric, reward, unlock requirement, merch condition, shareable
status, or reason to drive faster.

The long arc should preserve the progressive reveal style:

- start with one sentence
- reveal one resource at a time
- unlock systems through story beats
- keep mystery
- make each new mechanic feel discovered, not dumped onto the first screen

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

## Delivery Simulator / Test Drive Mode

Delivery Simulator is an implemented local QA mode for testing the Delivery Complete loop at home.
It is hidden by default and appears only when one of these local gates is present:

- the page URL includes `?simulator=1`
- `localStorage` contains `tofuDriverSimulatorEnabled=true`

The simulator panel is labeled `Delivery Simulator` and includes the warning:
`Test mode. Simulated deliveries are for local testing and may not represent real driving.`

Simulator scenarios generate completed delivery summaries without using sensors, geolocation,
network calls, backend storage, service workers, uploads, or accounts. They must never request
`DeviceMotionEvent` permission, start geolocation, or store raw GPS samples, raw motion streams,
coordinates, route traces, maps, street names, or speed logs.

V1 scenarios include:

- Smooth Commute
- City Delivery
- Technical Pour
- Perfect Pour
- Hot Tea 90
- Shaky Practice
- Spilled Soup
- Long Haul Smooth

Generated summaries use the same result/reward path as real completed sessions where practical, but
they must include:

- `simulated: true`
- `mode: "simulated"`
- scenario id/name
- cargo condition / water-left score
- qualification status
- route type
- duration bucket-style summary values
- stamp and reward summaries

The simulator may apply local XP, shop rewards, stamps, character unlocks, sound-pack unlocks, and
other summarized progress so development can test the game loop. Simulated sessions are local-only
and not secure. The default simulator control excludes local merch progress; if a developer opts in
to count simulated sessions for local QA, that state remains untrusted and must not be used as proof
for future backend-verified merch claims.

Future server-side merch verification must reject or ignore simulated sessions. Backend unlock
tokens, if added later, should rely on trusted summarized verification state and must not accept
client-generated `simulated` sessions as real deliveries.

Share output for simulated sessions must clearly say `Simulated Delivery` or `Practice Delivery`.
All normal sharing restrictions still apply: no speed, GPS, location, maps, route traces, street
names, exact distance by default, high-G bragging, Super Cute Collectibles links, Discord links, or
legacy app URLs by default.

The simulator is not an active-drive feature. It must be hidden during an active Cup Test, must not
start audio/geolocation/motion sensors, and must remain usable on desktop for local testing.

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
production stats by default. Simulated sessions must be labeled as `Simulated Delivery` or
`Practice Delivery` in default share output so they cannot be mistaken for real drives.

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
