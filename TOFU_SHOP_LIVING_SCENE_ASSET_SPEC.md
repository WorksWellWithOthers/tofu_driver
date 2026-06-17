# Tofu Shop Living Scene Asset Spec

## Scene Philosophy

The Tofu Shop Living Scene is a parked-only visual reward layer for the Tofu Shop Overview. It should
make the shop feel alive as the idle-management loop progresses, while leaving the real play controls
clear: bottleneck, next action, ready orders, Prep Counter progress, order cards, stations, upgrades,
and Counter Service.

Scene art is cosmetic only. It must not affect Cup Test score, cargo thresholds, route qualification,
rewards, speed, distance, or safety-sensitive logic. It must not appear during active Cup Test,
motion permission, calibration, or active driving states.

## Layer Inventory

| Asset ID | File Path | Surface | Unlock Condition | Required | Recommended Aspect Ratio | Recommended Pixel Size | Layer Position Notes | Safe-Area Notes | Animation Notes | Reduced-Motion Behavior | Placeholder Behavior | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `shop_base_tiny` | `frontend/nospill/assets/scenes/tofu-shop/shop_base_tiny.webp` | Tofu Shop Overview scene base | Always visible in parked shop | Yes | 16:9 | 1600x900 or 1920x1080 | Full scene background/base plate | Keep text-free; leave center clear for overlays | Static | Static | `Tiny shop scene pending` | Needed from art generation | Tiny starter shop, simple shelves, calm parked tone |
| `tofu_boxes_idle` | `frontend/nospill/assets/scenes/tofu-shop/layers/tofu_boxes_idle.webp` | Scene layer | Always visible | Yes | 16:9 transparent layer | 1600x900 or 1920x1080 | Shelf/counter foreground | Avoid covering controls when cropped on mobile | Optional subtle idle sprite later | Static | `Tofu box art pending` | Needed from art generation | Shows basic stock and shop activity |
| `tofu_order_motion` | `frontend/nospill/assets/scenes/tofu-shop/layers/tofu_order_motion.webp` | Scene activity layer | Ready orders, recent fulfillment, or prep bottleneck | Optional | 16:9 transparent layer | 1600x900 or 1920x1080 | Counter handoff area | Keep motion small and non-distracting | Gentle pulse/fade only | Static layer | `Order motion art pending` | Needed from art generation | Decorative order movement, not a click target |
| `tofu_press_visible` | `frontend/nospill/assets/scenes/tofu-shop/layers/tofu_press_visible.webp` | Scene layer | Tofu Press owned | Optional | 16:9 transparent layer | 1600x900 or 1920x1080 | Back/side station zone | Do not obscure base shop identity | Static | Static | `Tofu Press art pending` | Needed from art generation | Visualizes stock production |
| `prep_counter_visible` | `frontend/nospill/assets/scenes/tofu-shop/layers/prep_counter_visible.webp` | Scene layer | Prep Counter owned or first order prep has happened | Yes | 16:9 transparent layer | 1600x900 or 1920x1080 | Main counter area | Leave room for future character cameo | Static | Static | `Prep Counter art pending` | Needed from art generation | Core first-loop station |
| `prep_counter_upgraded` | `frontend/nospill/assets/scenes/tofu-shop/layers/prep_counter_upgraded.webp` | Scene upgrade layer | Tidy Packaging / first meaningful prep upgrade | Optional | 16:9 transparent layer | 1600x900 or 1920x1080 | Counter details or packaging props | Should read as an upgrade, not a new system | Static | Static | `Upgraded Prep Counter art pending` | Needed from art generation | Persistent visual reward for prep upgrade |
| `delivery_shelf_visible` | `frontend/nospill/assets/scenes/tofu-shop/layers/delivery_shelf_visible.webp` | Scene layer | Delivery Shelf exists | Yes | 16:9 transparent layer | 1600x900 or 1920x1080 | Shelf/storage area | Keep large shapes away from cropped edges | Static | Static | `Delivery Shelf art pending` | Needed from art generation | First support-station visual |
| `delivery_shelf_expanded` | `frontend/nospill/assets/scenes/tofu-shop/layers/delivery_shelf_expanded.webp` | Scene upgrade layer | 5 or more Delivery Shelves | Optional | 16:9 transparent layer | 1600x900 or 1920x1080 | Adds shelf depth/extra bins | Should layer over or complement shelf base | Static | Static | `Expanded Delivery Shelf art pending` | Needed from art generation | Station milestone visual |
| `shop_sign_basic` | `frontend/nospill/assets/scenes/tofu-shop/layers/shop_sign_basic.webp` | Scene layer | Shop Sign exists | Yes | 16:9 transparent layer | 1600x900 or 1920x1080 | Window/front sign area | Avoid readable tiny text | Static | Static | `Shop Sign art pending` | Needed from art generation | Shows reputation growth |
| `shop_sign_upgraded` | `frontend/nospill/assets/scenes/tofu-shop/layers/shop_sign_upgraded.webp` | Scene upgrade layer | 5 or more Shop Signs or reputation milestone | Optional | 16:9 transparent layer | 1600x900 or 1920x1080 | Improved sign/light accents | No flashing signage | Static | Static | `Upgraded Shop Sign art pending` | Needed from art generation | Reputation milestone visual |
| `counter_service_hint` | `frontend/nospill/assets/scenes/tofu-shop/layers/counter_service_hint.webp` | Scene activity layer | First 10 Orders / Counter Service unlocked | Optional | 16:9 transparent layer | 1600x900 or 1920x1080 | Pickup window/register area | Keep as background activity | Gentle pulse only | Static | `Counter Service art pending` | Needed from art generation | Shows automation without adding a new tab |
| `covered_car_teaser` | `frontend/nospill/assets/scenes/tofu-shop/layers/covered_car_teaser.webp` | Scene teaser layer | First Upgrade Purchased, First 100 Tips, or story beat | Optional | 16:9 transparent layer | 1600x900 or 1920x1080 | Rear/side background, partially hidden | Keep restrained and mysterious | Static | Static | `Covered car teaser art pending` | Needed from art generation | Teaser only; no Dream Garage mechanics |
| `tofu_box_loop` | `frontend/nospill/assets/scenes/tofu-shop/sprites/tofu_box_loop.webp` | Small activity sprite | Future small tofu/order motion | Optional | Square or 4:3 transparent sprite | 512x512 or 768x576 | Counter/shelf micro-animation | Must remain decorative | Optional loop | Static first frame or hidden | `Tofu box sprite pending` | Needed from art generation | Reduced-motion fallback required |
| `order_fulfilled_loop` | `frontend/nospill/assets/scenes/tofu-shop/sprites/order_fulfilled_loop.webp` | Small activity sprite | Future order fulfilled motion | Optional | Square or 4:3 transparent sprite | 512x512 or 768x576 | Pickup marker near counter | Must not invite clicking | Optional loop | Static first frame or hidden | `Order fulfilled sprite pending` | Needed from art generation | Decorative confirmation only |

## Character Cameo Reuse

Mika uses the existing Delivery Crew character manifest instead of a duplicate scene path:

- `frontend/nospill/assets/characters/mika/shop_assistant_main_portrait.webp`

The living scene renders this only when Mika is selected or unlocked. Missing Mika art falls back to
the existing parked-only character placeholder.

## MVP Art Pack

Build the smallest useful first scene pack before commissioning the full layer list:

1. `shop_base_tiny`, 16:9, 1600x900 or 1920x1080.
2. `tofu_boxes_idle`, transparent WebP/PNG layer.
3. `prep_counter_visible`, transparent WebP/PNG layer.
4. `delivery_shelf_visible`, transparent WebP/PNG layer.
5. `shop_sign_basic`, transparent WebP/PNG layer.
6. `covered_car_teaser`, transparent WebP/PNG layer.
7. Optional `tofu_box_loop` sprite with a static reduced-motion fallback.

## Replacement Checklist

1. Drop final optimized `.webp` files at the exact documented paths.
2. Keep transparent layers aligned to the same 16:9 base canvas.
3. Test mobile and desktop crop behavior.
4. Confirm no active-drive, GPS, map, street, route trace, speed, or distance imagery appears.
5. Run the normal frontend checks before committing art.

## What Is Not Implemented

- Final scene art.
- Dream Garage, factory, manufacturer, or spaceship systems.
- Clickable scene mechanics.
- Active-drive scene rendering.
- Networked asset loading or backend sync.
