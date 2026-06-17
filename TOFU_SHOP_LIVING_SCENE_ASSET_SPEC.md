# Tofu Shop Living Scene Asset Spec

## Scene Philosophy

The Tofu Shop Living Scene is a parked-only visual reward panel for the Tofu Shop Overview. V1
visible presentation uses full-scene variants: the Overview shows one cohesive shop image at a time,
and normal gameplay controls stay outside the artwork.

Scene art is cosmetic only. It must not affect Cup Test score, cargo thresholds, route
qualification, rewards, speed, distance, or safety-sensitive logic. It must not appear during active
Cup Test, motion permission, calibration, or active driving states.

Scene art is never a control surface. Decorative scene containers, images, placeholders, and future
overlays must not intercept pointer/touch events, attach event listeners, add timers, add large
`aria-live` regions, or trigger repeated full renders.

Full-scene swaps are milestone rewards, not live mirrors for every small shop purchase. Station
cards, upgrade cards, and action buttons carry granular progression. The scene should advance more
slowly than the mechanics so each image feels like a story beat.

## Full-Scene Variant Inventory

| Asset ID | File Path | Surface | Unlock Condition | Required | Recommended Aspect Ratio | Recommended Pixel Size | Scene Notes | Safe-Area Notes | Animation Notes | Reduced-Motion Behavior | Placeholder Behavior | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `scene_tiny_shop_empty` | `frontend/nospill/images/scene_tiny_shop_empty.webp` | Tofu Shop Overview scene | Default state until roughly 3 fulfilled shop orders; one station purchase alone should not advance it | Yes | 16:9 | 1600x900 or 1920x1080 | Tiny starter shop, quiet counter, simple tofu presence | Keep important objects centered for mobile crop | Static | Static | No placeholder in normal gameplay; real image is integrated | Integrated | Minimal shop presence; no Dream Garage implication |
| `scene_tiny_shop_working` | `frontend/nospill/images/scene_tiny_shop_working.webp` | Tofu Shop Overview scene | About 3 fulfilled shop orders or equivalent first-loop proof | Yes | 16:9 | 1600x900 or 1920x1080 | Same tiny shop, visibly active prep/stock/order work | Avoid tiny readable text | Static or very subtle future overlay | Static | No placeholder in normal gameplay; real image is integrated | Integrated | Shows the shop beginning to operate |
| `scene_tiny_shop_upgraded` | `frontend/nospill/images/scene_tiny_shop_upgraded.webp` | Tofu Shop Overview scene | First named upgrade, First 10 Orders, First Family Tofu Tray, or First 100 Tips | Yes | 16:9 | 1600x900 or 1920x1080 | Better counter setup, packaging, or slightly improved station props | Leave room for action cards below, not inside art | Static | Static | No placeholder in normal gameplay; real image is integrated | Integrated | Also used as the temporary visual alias for `scene_busy_shop_established` |
| `scene_busy_shop_established` | `frontend/nospill/images/scene_tiny_shop_upgraded.webp` | Tofu Shop Overview scene | Sustained progress such as 25+ orders, a support-station milestone, Shop Level 10+, or Second Register | Yes | 16:9 | 1600x900 or 1920x1080 | Temporarily reuses the upgraded-shop image so normal gameplay never shows missing art | Keep foreground uncluttered on narrow screens | Optional subtle future overlay only | Static | Uses upgraded-shop fallback art | Aliased | Dedicated `scene_busy_shop_established.webp` is optional future work |
| `scene_busy_shop_with_covered_car` | `frontend/nospill/images/scene_busy_shop_with_covered_car.webp` | Tofu Shop Overview scene | Established shop plus a later teaser milestone such as First Upgrade Purchased, First 100 Tips, 25+ orders, or Second Register | Yes | 16:9 | 1600x900 or 1920x1080 | Established shop plus restrained covered-car hint in background | Covered car should be visible but not dominate | Static | Static | No placeholder in normal gameplay; real image is integrated | Integrated | Story teaser only; no Dream Garage mechanics |

`scene_busy_shop_established` is currently aliased to `scene_tiny_shop_upgraded.webp`.
Players should not see a missing-art placeholder for the established-shop state during normal
gameplay. A dedicated `scene_busy_shop_established.webp` can be added later if the midgame needs a
more distinct visual state.

Normal gameplay should not show scene IDs, asset-state labels, or `art pending` copy for integrated
scene states. Placeholder text is reserved for genuinely missing future/optional scene IDs.

## Optional Future Overlays

V1 should not show separate layer placeholder tiles in the Overview. Future implementation may add
subtle overlays inside the single scene panel only if they preserve the cohesive-scene model.

Optional overlay candidates:

- tofu box ambient motion
- small sign glow
- restrained Mika cameo blended into a full-scene variant
- small order handoff shimmer

Rules for overlays:

- use the single scene panel, not separate visible cards
- keep reduced-motion static fallback
- never create click targets or new mechanics
- never render during active driving
- never imply GPS, maps, routes, streets, speed, distance, or public-road competition

## MVP Art Pack

Make three to five full-scene images first. Recommended order:

1. `scene_tiny_shop_empty`, 16:9, 1600x900 or 1920x1080.
2. `scene_tiny_shop_working`, 16:9, 1600x900 or 1920x1080.
3. `scene_tiny_shop_upgraded`, 16:9, 1600x900 or 1920x1080.
4. `scene_busy_shop_with_covered_car`, 16:9, 1600x900 or 1920x1080.
5. Optional later: a dedicated `scene_busy_shop_established`, 16:9, 1600x900 or 1920x1080.

Do not commission separate visible layer art until the full-scene approach has been playtested.

## Replacement Checklist

1. Drop final optimized `.webp` files at the exact documented paths.
2. Test mobile and desktop crop behavior.
3. Confirm each scene reads as one cohesive image, not a UI grid.
4. Confirm no active-drive, GPS, map, street, route trace, speed, or distance imagery appears.
5. Run the normal frontend checks before committing art.

## What Is Not Implemented

- Dedicated `scene_busy_shop_established.webp` art.
- Dream Garage, factory, manufacturer, or spaceship systems.
- Clickable scene mechanics.
- Visible per-layer art tiles.
- Active-drive scene rendering.
- Networked asset loading or backend sync.
