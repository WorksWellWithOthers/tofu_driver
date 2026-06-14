# Tofu Driver Design

Tofu Driver is a browser-only smooth-driving experiment. The core challenge is `The Cup Test`: keep
a virtual cup steady while driving normally. The product rewards smoothness, not speed.

## Brand Hierarchy

- `Tofu Driver` is the main app and brand.
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

## Privacy Contract

- No raw motion stream is uploaded.
- No raw GPS samples are uploaded.
- No speed history is uploaded.
- No map, route trace, GPS coordinate list, or street-level detail is uploaded.
- No account is required for the current MVP.
- No backend is required for the current MVP.
- `localStorage` stores summarized local state only.

## Local Storage

The app uses one `localStorage` key:

- `nospill.club.v1`

The key is centralized as `STORAGE_KEY` in `frontend/nospill/app.js`.

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

## Scoring Principles

- Smoothness is rewarded.
- Speed is not rewarded.
- Higher speed must not improve score, rank, milestones, merch, or share output.
- Safety copy must tell users not to look at the screen while driving.

## Merch Configuration

- The landing page may link to Super Cute Collectibles as the physical merch fulfillment partner.
- Future merch links live in `MERCH_LINKS` inside `frontend/nospill/app.js`.
- Visible merch labels live in `MERCH_LABELS` inside `frontend/nospill/app.js`.
- Locked merch links are not rendered in the visible UI before unlock.
- `null` links show `Unlocked, merch coming soon.`
- External merch links must use `target="_blank"` and `rel="noopener noreferrer"`.
- Super Cute Collectibles does not verify scores in the current MVP.
- Real gated merch later requires backend-issued unlock tokens, customer tags, or another server-side access-control mechanism.

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
