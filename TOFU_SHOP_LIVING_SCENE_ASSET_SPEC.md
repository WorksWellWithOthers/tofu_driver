# Tofu Shop Living Scene Asset Spec

## Scene Philosophy

The Tofu Shop Living Scene is a parked-only visual reward panel for the Tofu Shop Overview. V1
visible presentation uses full-scene variants: the Overview shows one cohesive shop image at a time,
and normal gameplay controls stay outside the artwork.

Scene art is cosmetic only. It must not affect Cup Test score, cargo thresholds, route
qualification, rewards, speed, distance, or safety-sensitive logic. It must not appear during active
Cup Test, motion permission, calibration, or active driving states.

## Full-Scene Variant Inventory

| Asset ID | File Path | Surface | Unlock Condition | Required | Recommended Aspect Ratio | Recommended Pixel Size | Scene Notes | Safe-Area Notes | Animation Notes | Reduced-Motion Behavior | Placeholder Behavior | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `scene_tiny_shop_empty` | `frontend/nospill/assets/scenes/tofu-shop/scene_tiny_shop_empty.webp` | Tofu Shop Overview scene | Initial parked shop state before meaningful shop action | Yes | 16:9 | 1600x900 or 1920x1080 | Tiny starter shop, quiet counter, simple tofu presence | Keep important objects centered for mobile crop | Static | Static | `Tiny shop scene pending` | Needed from art generation | Minimal shop presence; no Dream Garage implication |
| `scene_tiny_shop_working` | `frontend/nospill/assets/scenes/tofu-shop/scene_tiny_shop_working.webp` | Tofu Shop Overview scene | First production loop has started | Yes | 16:9 | 1600x900 or 1920x1080 | Same tiny shop, visibly active prep/stock/order work | Avoid tiny readable text | Static or very subtle future overlay | Static | `Working shop scene pending` | Needed from art generation | Should show the shop beginning to operate |
| `scene_tiny_shop_upgraded` | `frontend/nospill/assets/scenes/tofu-shop/scene_tiny_shop_upgraded.webp` | Tofu Shop Overview scene | First upgrade or early station growth | Yes | 16:9 | 1600x900 or 1920x1080 | Better counter setup, packaging, or slightly improved station props | Leave room for action cards below, not inside art | Static | Static | `Growing shop scene pending` | Needed from art generation | Represents early momentum without showing every station separately |
| `scene_busy_shop_established` | `frontend/nospill/assets/scenes/tofu-shop/scene_busy_shop_established.webp` | Tofu Shop Overview scene | Support infrastructure such as Delivery Shelf, Shop Sign, Counter Service, or 25+ orders | Yes | 16:9 | 1600x900 or 1920x1080 | Busier cohesive shop with visible support infrastructure and order flow | Keep foreground uncluttered on narrow screens | Optional subtle future overlay only | Static | `Established shop scene pending` | Needed from art generation | Main midgame shop image |
| `scene_busy_shop_with_covered_car` | `frontend/nospill/assets/scenes/tofu-shop/scene_busy_shop_with_covered_car.webp` | Tofu Shop Overview scene | Covered-car teaser condition, such as First Upgrade Purchased or First 100 Tips | Yes | 16:9 | 1600x900 or 1920x1080 | Established shop plus restrained covered-car hint in background | Covered car should be visible but not dominate | Static | Static | `Covered car scene pending` | Needed from art generation | Story teaser only; no Dream Garage mechanics |

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
4. `scene_busy_shop_established`, 16:9, 1600x900 or 1920x1080.
5. `scene_busy_shop_with_covered_car`, 16:9, 1600x900 or 1920x1080.

Do not commission separate visible layer art until the full-scene approach has been playtested.

## Replacement Checklist

1. Drop final optimized `.webp` files at the exact documented paths.
2. Test mobile and desktop crop behavior.
3. Confirm each scene reads as one cohesive image, not a UI grid.
4. Confirm no active-drive, GPS, map, street, route trace, speed, or distance imagery appears.
5. Run the normal frontend checks before committing art.

## What Is Not Implemented

- Final scene art.
- Dream Garage, factory, manufacturer, or spaceship systems.
- Clickable scene mechanics.
- Visible per-layer art tiles.
- Active-drive scene rendering.
- Networked asset loading or backend sync.
