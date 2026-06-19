# Tofu Driver Character Art Asset Inventory

This file is the production checklist for parked-only character art. Character art is
cosmetic flavor only. It must not affect Cup Test scoring, qualification, route validation, shop
production, safety-sensitive behavior, or progression speed.

Do not show character reward art during an active drive. Character art belongs on parked screens:
Tofu Shop, Delivery Crew, post-run results, local fanfares, Passport/Ledger details, and optional
share-card art.

## Placement Audit

| Asset ID | Surface / Screen | Route / UI Area | Purpose | Required or Optional | Character-Specific or Shared | Recommended Image Type | Recommended Aspect Ratio | Recommended Pixel Size | Safe Area / Cropping Notes | Style Notes | Placeholder Behavior | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `shop_assistant_main_portrait` | Tofu Shop overview | `#/shop`, Overview first-loop panel | Friendly parked shop assistant presence | Optional for MVP, high value | Character-specific fallback to selected crew | Bust / upper-body portrait | 4:5 | 960x1200 | Keep face and torso centered; safe crop to square on mobile | Anime-inspired, tasteful, shop-uniform friendly | Show “Character art coming soon” placeholder if missing | Mika asset integrated | Good first asset because it appears often while parked |
| `shop_hint_expression_neutral` | Tofu Shop recommendation / hint panel | `#/shop`, Next Best Action / bottleneck card later | Explain bottlenecks without adding text walls | Optional | Character-specific expression | Expression portrait | 1:1 | 768x768 | Face should remain readable at 76px | Neutral/helpful expression | Show “Crew portrait not yet assigned” placeholder | Slot documented, art pending | Hook exists in manifest for later placement |
| `result_screen_cameo` | Cup Test post-run result | `#/cup-test` completed summary | Parked-only cameo after a run ends | Optional for MVP, high value | Character-specific fallback to selected crew | Portrait cameo | 4:5 | 960x1200 | Keep subject on left/center; avoid covering metrics | Calm celebratory or impressed expression | Show “Result cameo art pending” placeholder if missing | Mika asset integrated | Safe because it appears after the run |
| `coach_recap_expression_neutral` | Coach Recap | Post-run Coach Recap card | Support smooth-control feedback tone | Optional | Character-specific expression | Expression portrait | 4:5 | 1024x1280 | Face readable at small size; keep eyes in upper third for phone crop | Calm coach, not aggressive or racing-coded | Show “Coach portrait not yet assigned” placeholder if missing | Mika asset integrated | Must avoid performance-driving imagery |
| `coach_recap_expression_pleased` | Coach Recap | Post-run Coach Recap card, positive result variant later | Support quietly impressed smooth-control feedback | Optional | Character-specific expression | Expression portrait | 4:5 | 1024x1280 | Match neutral framing so variants can swap without layout shift | Pleased, calm, professional | Show “Coach portrait not yet assigned” placeholder if missing | Mika asset integrated | No active-drive use |
| `reward_unlock_card_art` | Reward/unlock popup | Future generic unlock card | Reward splash for cosmetics/stamps | Optional | Shared first, character-specific later | Card illustration | 16:9 | 1280x720 | Leave center safe for text if used as background | Cozy shop celebration | Show “Reward art pending” placeholder if missing | Mika asset integrated | Also supplies the current stamp fanfare cameo |
| `crew_profile_card` | Delivery Crew screen | `#/crew`, character collection cards | Identify each crew character | MVP candidate | Character-specific | Vertical profile portrait | 4:5 | 800x1000 | Face/shoulders centered; safe crop to square if a future card needs it | Character identity portrait | Show “Crew portrait not yet assigned” placeholder if missing | Mika asset integrated | Best slot for character-specific set |
| `stamp_fanfare_cameo` | Future optional Passport Stamp cameo | Future stamp dialog variants | Optional cameo if a later fanfare needs portrait treatment | Optional | Shared first, character-specific later | Reward splash cameo | 4:3 | 1200x900 | Keep character away from reward metrics | Cheerful but restrained | Show compact fallback only if a future slot is missing | Mika uses reward splash | Current Stamp Celebration uses `reward_unlock_card_art` as one wide banner instead of this cameo card |
| `share_card_cameo_optional` | Share-card preview | Result share card, if enabled later | Optional branded/share flavor | Optional, later | Shared first | Small portrait cameo | 1:1 | 768x768 | Must not obscure result text | Simple high-contrast cameo | Show “Share cameo art pending” placeholder if surfaced | Slot documented, art pending | Do not include location/speed/route cues |
| `passport_stamp_detail_cameo` | Passport detail card | `#/shop`, Passport panel later | Add flavor to stamp details | Optional, later | Shared or stamp-specific | Small avatar/icon | 1:1 | 512x512 | Works beside stamp title | Stamp-office / shop counter tone | Use text-only stamp card until art exists | Documented only | Do not dump full catalog early |
| `ledger_history_avatar` | Ledger/history card | `#/shop`, Ledger panel later | Identify who reported a local event | Optional, later | Shared or selected crew | Small avatar/icon | 1:1 | 512x512 | Readable at 40-56px | Quiet report avatar | Use no image or placeholder avatar | Documented only | Ledger remains supporting history |
| `offline_progress_banner` | Offline progress summary | Future welcome-back summary | Cozy return flavor | Optional, later | Shared | Decorative banner image | 16:9 | 1280x720 | Leave text-safe area | Morning shop / counter opening | Use text-only summary | Documented only | Do not reveal advanced systems from idle time alone |

## Minimum Viable Asset Pack

The first real pack is Mika, Night Shift Manager. Her six-image MVP pack supports the shop, result,
coach, crew, and reward slots without changing gameplay.

1. `crew_profile_card` for Mika.
2. `shop_assistant_main_portrait` for Mika.
3. `result_screen_cameo` for Mika.
4. `coach_recap_expression_neutral` for Mika.
5. `coach_recap_expression_pleased` for Mika.
6. `reward_unlock_card_art` for Mika.

This is a 6-image MVP. It covers the most visible parked screens without requiring share-card
variants, Passport detail art, Ledger avatars, offline banners, or a full expression set.

## Mika MVP Pack

Mika is the first real character asset target.

- Character ID: `mika`
- Name: Mika
- Role: Night Shift Manager
- Direction: anime-inspired, stylish, tasteful, non-explicit, professional shop office manager
- Outfit: white blouse, dark-rim glasses, tied-up hair, clipboard or ledger
- Personality: sharp, calm, competent, quietly impressed by smooth deliveries

Runtime files:

```text
frontend/nospill/images/
```

| Asset Slot | Expected Filename | Runtime Path | Target Size | Aspect Ratio | Safe Area / Cropping Notes | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `shop_assistant_main_portrait` | `shop_assistant_main_portrait.webp` | `/static/nospill/images/shop_assistant_main_portrait.webp` | 1024x1280 | 4:5 | Bust/upper body; face and clipboard readable; safe crop to square on narrow cards | Integrated |
| `result_screen_cameo` | `result_screen_cameo.webp` | `/static/nospill/images/result_screen_cameo.webp` | 1024x1280 or 800x1000 | 4:5 | Keep subject center-left with clear margin for result metrics | Integrated |
| `coach_recap_expression_neutral` | `coach_neutral.webp` | `/static/nospill/images/coach_neutral.webp` | 1024x1280 | 4:5 | Neutral coaching expression; eyes in upper third; no racing/performance cues | Integrated |
| `coach_recap_expression_pleased` | `coach_pleased.webp` | `/static/nospill/images/coach_pleased.webp` | 1024x1280 | 4:5 | Same pose/framing as neutral, quietly impressed expression | Integrated |
| `crew_profile_card` | `crew_profile_card.webp` | `/static/nospill/images/crew_profile_card.webp` | 800x1000 | 4:5 | Clean portrait read at card size; safe crop to square if needed | Integrated |
| `reward_unlock_card_art` | `reward_unlock_splash.webp` | `/static/nospill/images/reward_unlock_splash.webp` | 1280x720 | 16:9 | Leave text-safe space on one side; celebratory but restrained | Integrated |

All current Mika MVP image slots are implemented. Mika is the safe default character-art source for
parked/result surfaces when no player-selected character has assigned art, so Coach Recap, Delivery
Crew, result cameos, Tofu Shop assistant, Stamp Celebration, and reward splash surfaces use real Mika
art instead of missing-art copy. Result Cameo and Coach Recap render their dedicated Mika portraits
as larger 4:5 polished cameos, not tiny thumbnails, gray initial tiles, or asset-debug cards. Stamp
Celebration renders `reward_unlock_splash.webp` as one wide 16:9 fanfare image, not as a character
cameo/debug card. Future optional slots such as share-card, Passport-detail, Ledger, and
offline-progress art remain documented only.

Current active Mika runtime files are:

- `/static/nospill/images/shop_assistant_main_portrait.webp`
- `/static/nospill/images/coach_neutral.webp`
- `/static/nospill/images/coach_pleased.webp`
- `/static/nospill/images/result_screen_cameo.webp`
- `/static/nospill/images/crew_profile_card.webp`
- `/static/nospill/images/reward_unlock_splash.webp`

## Penguin Mascot Assets

The current penguin assets are integrated as parked-only Delivery Crew / collection flavor. They do
not replace Mika on the Tofu Shop assistant, Coach Recap, result cameo, or reward splash surfaces.

| Asset Role | Filename | Runtime Path | Surface | Status |
| --- | --- | --- | --- | --- |
| Main penguin driver icon / mascot avatar | `penguin_driver_icon.webp` | `/static/nospill/images/penguin_driver_icon.webp` | Delivery Crew character card | Integrated |
| Delivery buddy / helper mascot | `penguin_delivery_buddy.webp` | `/static/nospill/images/penguin_delivery_buddy.webp` | Delivery Crew buddy card | Integrated |
| Sticker / badge collectible | `penguin_tofu_driver_sticker.webp` | `/static/nospill/images/penguin_tofu_driver_sticker.webp` | Delivery Crew sticker card | Integrated |

Penguin art is cosmetic only. It must not affect Cup score, cargo thresholds, qualification, route
validation, rewards, speed, distance, shop economy, or safety-sensitive behavior. It is not rendered
during active Cup Test, calibration, or motion permission flow.

Replacement checklist:

1. Export final images as WebP at the exact filenames above.
2. Put only final runtime images in `frontend/nospill/images/`.
3. Keep the six filenames stable so the manifest paths do not change.
4. Check portrait crops on phone-width and desktop browser layouts.
5. Verify missing-image fallback still works by temporarily renaming one file locally.
6. Confirm character art remains parked-only and does not affect Cup Test scoring,
   qualification, cargo thresholds, rewards, speed, distance, or route validation.

After the MVP works, add two expression variants per major character:

- happy / celebratory
- neutral / coaching
- concerned / rough-result

Do not create large art batches until mobile layout and result-card density are validated.

## Style Guidance

- Anime-inspired, stylish, tasteful, non-explicit.
- Visually coherent with Tofu Shop, Delivery Crew, and result-card tone.
- Character art should feel like shop assistants, crew, customers, or delivery mascots.
- Avoid imagery that suggests public-road racing, speed, high-G performance, dangerous driving,
  weapons, crime, or sexual-explicit content.
- Prefer transparent PNG/WebP for portraits and cameos that sit in cards.
- Use scene/background art only for banner or reward-card slots.
- Keep faces readable at small mobile sizes.
- Leave safe space around text-heavy card areas.
- Character cosmetics must never improve Cup Test scoring, qualification, shop production, route
  validation, speed, or safety-sensitive behavior.

## Placeholder Rules

The current app has a manifest-driven placeholder renderer:

- missing image: show a stable placeholder box
- missing slot: show a generic “Character art coming soon” placeholder
- selected character: can influence parked-only placeholder label and copy
- active drive: character art slots return no UI

Placeholder copy should be calm and production-oriented:

- “Character art coming soon”
- “Crew portrait not yet assigned”
- “Reward art pending”
- “Coach portrait not yet assigned”

Do not use placeholders as unlock pressure, monetization pressure, or driving prompts.
For assigned real art, fallback labels should identify the character portrait rather than saying the
slot is “not yet assigned”; “not yet assigned” copy is reserved for genuinely missing future slots.
Assigned real art should not render a separate gray initial placeholder beside the image.
