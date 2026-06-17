# Mika Character Asset Notes

Mika, Night Shift Manager, is the first real Delivery Crew character pack. The current runtime
images live in `frontend/nospill/images/` so they match the app's flat static image layout.

Integrated runtime files:

- `frontend/nospill/images/shop_assistant_main_portrait.webp` - 1024x1280, 4:5
- `frontend/nospill/images/result_screen_cameo.webp` - 1024x1280 or 800x1000, 4:5
- `frontend/nospill/images/coach_neutral.webp` - 1024x1280, 4:5
- `frontend/nospill/images/coach_pleased.webp` - 1024x1280, 4:5
- `frontend/nospill/images/crew_profile_card.webp` - 800x1000, 4:5
- `frontend/nospill/images/reward_unlock_splash.webp` - 1280x720, 16:9

Active runtime paths use `/static/nospill/images/<filename>.webp`. No current Mika MVP slot is
pending. Future optional slots may still use placeholders until separate art exists.

Do not place raw prompt notes, source PSDs, or unsafe driving imagery here. Final assets should be
static-browser friendly, cosmetic only, tasteful, non-explicit, and parked-screen appropriate.
