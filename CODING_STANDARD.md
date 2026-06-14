# Tofu Driver Coding Standard

## General

- Prefer clear, small functions.
- Keep state explicit and localized.
- Avoid dependencies unless they remove meaningful complexity.
- Prefer browser-native APIs for the MVP.
- Keep code readable over clever.

## Privacy And Safety

- Do not add network calls without an explicit product decision.
- Do not upload raw `DeviceMotionEvent` data.
- Do not upload raw GPS samples.
- Do not store route traces, street names, maps, or raw speed history.
- Do not reward speed in scoring, copy, badges, or share output.
- Keep all safety-sensitive copy conservative.

## JavaScript

- Use named constants for thresholds and storage keys.
- Keep scoring logic deterministic.
- Keep DOM writes isolated in render/update helpers where practical.
- Sanitize text before inserting into HTML.
- Prefer `textContent` for user-visible dynamic text.
- Treat permissions and sensor availability as normal degraded states.

## CSS

- Mobile-first.
- Use stable dimensions for run surfaces and controls.
- Keep interactive controls reachable with one hand.
- Avoid text overlap on narrow screens.
- Avoid decorative effects that reduce readability outdoors.

## Testing

Run before committing meaningful changes:

```bash
node --check frontend/nospill/app.js
node --check test_frontend_nospill.js
node test_frontend_nospill.js
```

Manual browser testing is required for motion/location behavior.
