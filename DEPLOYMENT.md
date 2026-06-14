# Tofu Driver Deployment

Tofu Driver is currently a static frontend app. The safest MVP deployment is a static host that can
serve HTTPS, because mobile browsers generally require HTTPS for motion/location permissions.

## Deployment Requirements

- HTTPS
- Static file hosting
- Correct MIME types for `.html`, `.css`, `.js`, and images
- No backend required for the current MVP
- No analytics or third-party scripts unless explicitly added later

## Pre-Deploy Checks

```bash
node --check frontend/nospill/app.js
node --check test_frontend_nospill.js
node test_frontend_nospill.js
```

Manual checks:

- Open the app on iPhone Safari over HTTPS.
- Open the app on Android Chrome over HTTPS.
- Confirm Basic Mode works without location access.
- Confirm Qualified Run Mode asks for location only after the user chooses it.
- Confirm share output does not include raw GPS, speed, maps, street names, or route traces.
- Confirm saved local summaries stay in browser `localStorage`.

## Rollback

For static hosting, rollback should be a previous static artifact or previous hosting revision.
Keep a copy of the last known-good build before replacing hosted files.
