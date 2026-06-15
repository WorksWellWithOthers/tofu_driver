# Tofu Driver

Tofu Driver is a browser-only smooth-driving experiment. It uses phone motion sensors to run
`The Cup Test`: a simple challenge where the driver tries to keep a virtual cup from spilling.
The current app layers a local-first `Delivery Log` over that challenge, where each run is framed
as a fragile tofu cargo delivery.

The app is intentionally lightweight:

- static HTML/CSS/JavaScript
- no backend requirement for the current MVP
- no account system
- no payment flow
- no upload of raw motion or GPS samples
- local results stored only in browser `localStorage`
- secret shirts and future physical merch fulfilled through Super Cute Collectibles
- animated tofu cargo visualization driven by local motion data, not speed

## Project Layout

- `frontend/nospill/index.html`: app shell
- `frontend/nospill/app.css`: app styling
- `frontend/nospill/app.js`: motion, scoring, sharing, and local storage logic
- `frontend/nospill/assets/`: app raster artwork
- `Dockerfile`: Nginx container used for Cloud Run source deploys
- `nginx.conf`: static-file routing and security headers for Cloud Run
- `test_frontend_nospill.js`: Node-based frontend behavior checks
- `DESIGN.md`: product and privacy contract
- `PLAN.md`: next implementation steps

## Local Checks

```bash
node --check frontend/nospill/app.js
node --check test_frontend_nospill.js
node test_frontend_nospill.js
```

Open `frontend/nospill/index.html` in a browser for static inspection. Device motion behavior needs
a real mobile browser over HTTPS for full testing.
