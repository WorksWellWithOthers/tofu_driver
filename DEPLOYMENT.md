# Tofu Driver Deployment

Tofu Driver is currently a static frontend app. The safest MVP deployment is a static host that can
serve HTTPS, because mobile browsers generally require HTTPS for motion/location permissions.

## Deployment Requirements

- HTTPS
- Static file hosting
- Correct MIME types for `.html`, `.css`, `.js`, and images
- No backend required for the current MVP
- No analytics or third-party scripts unless explicitly added later
- Cloud Run service `tofu-driver` in project `tofu-driver` currently serves the static app from an
  Nginx container with `min-instances=0`

## Pre-Deploy Checks

```bash
node --check frontend/nospill/app.js
node --check test_frontend_nospill.js
node test_frontend_nospill.js
```

## Cloud Run Deploy

Deploy from the Tofu Driver repo root:

```bash
PROJECT_ID="tofu-driver"
REGION="us-central1"
SERVICE="tofu-driver"

gcloud run deploy "$SERVICE" \
  --source . \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --allow-unauthenticated \
  --port=80 \
  --min-instances=0 \
  --max-instances=2
```

The source deploy uses `Dockerfile` and `nginx.conf`. The app should not require Cloud SQL, Redis,
or any external application infrastructure.

After deploy:

```bash
curl -I https://tofu-driver-186602940908.us-central1.run.app
curl -I https://tofu-driver-186602940908.us-central1.run.app/static/nospill/app.js
curl -I https://tofu-driver-186602940908.us-central1.run.app/static/nospill/assets/tofu-driver-shirt-1.png
```

## Custom Domain

Cloud Run domain mappings exist for:

- `tofudriver.com`
- `www.tofudriver.com`

Check mappings:

```bash
gcloud beta run domain-mappings list \
  --project="tofu-driver" \
  --region="us-central1"
```

If the browser shows the `run.app` URL after visiting the custom domain, remove registrar-level
forwarding or redirect rules. The domain should point to Cloud Run through DNS records returned by:

```bash
gcloud beta run domain-mappings describe \
  --domain="tofudriver.com" \
  --project="tofu-driver" \
  --region="us-central1"

gcloud beta run domain-mappings describe \
  --domain="www.tofudriver.com" \
  --project="tofu-driver" \
  --region="us-central1"
```

## Merch Preview Asset

The current merch preview image is:

```text
frontend/nospill/assets/tofu-driver-shirt-1.png
```

Update the file in `frontend/nospill/assets/`, confirm `frontend/nospill/index.html` references that
served path, then redeploy the Cloud Run service.

Manual checks:

- Open the app on iPhone Safari over HTTPS.
- Open the app on Android Chrome over HTTPS.
- Confirm Basic Mode works without location access.
- Confirm Qualified Run Mode asks for location only after the user chooses it.
- Confirm share output does not include raw GPS, speed, maps, street names, or route traces.
- Confirm saved local summaries stay in browser `localStorage`.

## Rollback

Rollback should use a previous Cloud Run revision or a known-good source commit. The service is
stateless, so rollback does not require database or migration steps.
