# Tofu Shop First Loop Audit

This audit reviews the current Tofu Shop design, balance, progression, and implementation alignment
after the First Loop Contract, Prep Counter progress bar, order types, and compact number formatting
work.

No fixes are implemented in this pass. The goal is to identify why the shop still does not feel like
it has meaningful upgrades or intentional progression.

## 1. Executive Summary

The first loop now has the right mechanical parts:

```text
Tofu Stock -> Prep Counter -> Delivery Orders -> Order Types -> Tips -> Stations/Upgrades -> First Stamp
```

The main remaining problem is not missing state. It is progression timing and recommendation
alignment. The player can understand the loop, but the first waiting state often has no satisfying
decision because the visible upgrade path does not solve the actual bottleneck.

In the observed state, the player has high Tofu Stock, no ready orders, low Tips, and a Prep Counter
nearly done. The real bottleneck is order throughput. The most relevant fix is a Prep Counter
purchase or Tidy Packaging upgrade, but the player does not yet have enough Tips for Prep Counter,
and Tidy Packaging is hidden until later. The visible Upgrades panel can therefore feel empty or
irrelevant even though it is technically correct.

## 2. Files Inspected

- `DESIGN.md`
- `BALANCE_AND_PROGRESSION.md`
- `PLAN.md`
- `IMPLEMENTATION_STATUS.md`
- `README.md`
- `frontend/nospill/app.js`
- `frontend/nospill/index.html`
- `frontend/nospill/app.css`
- `test_frontend_nospill.js`

## 3. What Currently Works

| Area | Evidence | Notes |
| --- | --- | --- |
| Fresh shop start | `defaultShopState()` starts with 10 Tofu Stock, 1 Delivery Order, 1 Tofu Press, and 1 Prep Counter | Matches the documented First Loop Contract |
| Order typing | `SHOP_ORDER_TYPES` implements Simple Tofu Box, Family Tofu Tray, and Festival Bento | Tofu Stock is now an order-size input, not a direct Tip multiplier |
| Prep progress | `orderPrepProgress()` and `renderOrderPrepProgress()` show ready orders, progress, ETA, running/paused states, and accessible progressbar attributes | Fixes the raw fractional order display problem |
| Live ticking | `applyShopGeneratorTick()` and `getShopGeneratorRates()` apply elapsed-time production | Resources update without refresh |
| Stock runway | `tofuStockRunway()` distinguishes healthy stock from low stock | Helps explain why Tofu Press is not always urgent |
| First stamp | `fulfillShopOrders()` unlocks `first_shop_order` on the first shop order | The stamp exists and is included in result feedback |
| Compact display | `formatCompactNumber()`, `formatShopCost()`, and related helpers format large visible values | Internal values remain exact |
| Safety/privacy | No audit finding requires touching Cup Test scoring, speed validation, GPS/motion storage, accounts, backend, analytics, or active-drive controls | Future fixes should remain shop-only |

## 4. What Feels Bad And Why

| Issue | Evidence | Why It Hurts | Recommended Fix | Priority |
| --- | --- | --- | --- | --- |
| The first real bottleneck is Prep Counter throughput, but the first named upgrade is Tofu Press output | `Steady Pressing` unlocks after first order and costs 20 Tips; it boosts Tofu Press output. The observed state has 113 Tofu Stock and no ready orders | The player sees an upgrade path that does not solve the current wait | Make the first meaningful upgrade or recommendation state-based: show/point to Tidy Packaging or Prep Counter when stock is healthy and orders are slow | P0 |
| Waiting for Prep Counter can become the dominant experience before a satisfying choice appears | Base Prep Counter rate is `1 / 40` orders/sec. In the observed state, the player is waiting at 74% with low Tips | The loop is understandable but passive. The player has no compelling button to press except a backup Pack Tofu action that does not help | Shorten the first few order waits, lower the first Prep Counter purchase threshold, reveal a relevant order-throughput upgrade earlier, or increase early simple-order rewards | P0 |
| Upgrades panel can appear before it contains a meaningful action | `SHOP_TABS` unlocks `upgrades` when `hasFirstShopOrder(state)` is true. `renderExpandedUpgradePanel()` can show only a locked/disabled Steady Pressing teaser | Opening a panel that only says “not yet” feels like a debug dashboard rather than a discovery | Keep Upgrades hidden until at least one upgrade is relevant to the current bottleneck or clearly close to affordable | P1 |
| Next Best Action suppresses affordable upgrades while order prep is running with healthy stock | `nextBestAction()` returns `wait_prep_counter` before the generic affordable-upgrade branch when `prep.ready < 1`, Prep Counter is running, and stock is available | If an upgrade is available, the player may still be told to wait, reducing agency | Evaluate bottleneck-solving affordable upgrades before returning the passive wait action | P1 |
| Progress can feel offline-driven rather than decision-driven | Offline production can apply up to 8 hours and fill stock/orders before the player has made many decisions | Returning can reveal resources and tabs because time passed, not because the player learned or chose a path | Add early-session offline restraint and a welcome-back action summary that recommends one conversion or purchase | P1 |
| The dashboard still contains broad scaffolding that can become visible from broad thresholds | Routes, Training, Garage, Crew, Spirit, Rivals, License, Ledger, and Settings all exist as tabs with unlock functions | Even when hidden initially, these systems are driven mostly by resource/level thresholds instead of story decisions | Gate advanced systems behind explicit learned milestones: first upgrade, first larger order, first route decision, first repeated chore | P1 |

## 5. Design Contract Mismatches

| Issue | Evidence | Why It Hurts | Recommended Fix | Priority |
| --- | --- | --- | --- | --- |
| The contract says the first meaningful purchase should be close or available by 2 minutes, but the first visible choice may not solve the bottleneck | `BALANCE_AND_PROGRESSION.md` targets Steady Pressing / first station choice around 2 minutes. Runtime stock often remains healthy while orders are slow | A purchase that increases stock does not feel meaningful when stock is already abundant | Decide the first purchase role: if the first bottleneck is order prep, make Prep Counter or Tidy Packaging the first satisfying upgrade | P0 |
| The contract says the first 10 minutes should show one clear loop, but tab scaffolding can imply a larger unfinished game | `SHOP_TABS` includes many systems, and several are partial/placeholder in `IMPLEMENTATION_STATUS.md` | Players can encounter systems before they understand why they exist | Keep the first 10 minutes to Overview, Orders, Production basics, relevant Upgrades, and Passport teaser only | P1 |
| The contract says upgrades should solve visible bottlenecks, but early upgrade visibility is mostly static | `stationUpgradeIsRevealed()` reveals Steady Pressing after first order, Tidy Packaging after 5 orders or 2 Prep Counters | The upgrade ladder is not yet reactive enough to the player’s actual stuck state | Reveal upgrades based on bottleneck detection plus milestones, not only counts | P1 |
| The contract says offline progress should not skip the game, but the current cap is broad | `SHOP_OFFLINE_CAP_HOURS` is 8. The progression docs also discuss tighter early pacing targets | New users can return to a state that bypasses first-loop learning | Consider a smaller early cap until the first upgrade or first larger order is completed | P2 |

## 6. Implementation Mismatches

| Issue | Evidence | Why It Hurts | Recommended Fix | Priority |
| --- | --- | --- | --- | --- |
| First upgrade and first bottleneck are not aligned | `Steady Pressing` affects `tofu_press`; observed bottleneck is order prep | The player asks “why buy this?” | Add a first-loop order-throughput upgrade path or make first station purchase the primary upgrade | P0 |
| `currentBottleneck()` checks affordable stations after the prep-wait branches | In `currentBottleneck()`, `preparing_order` can return before “Station affordable” | Overview can say wait even when there may be a useful purchase | Move bottleneck-solving purchases before passive wait, or make the wait copy mention the next purchase threshold | P1 |
| `nextBestAction()` returns `wait_prep_counter` before affordable generic upgrades in the healthy-stock prep state | The affordable-upgrade branch intentionally excludes `runway.isHealthy && prep.ready < 1 && prep.running` | This preserves waiting, but weakens agency | Prefer “Buy Tidy Packaging” or “Buy Prep Counter” when reachable; otherwise show “Wait for Prep Counter” with explicit progress toward the next fix | P1 |
| Legacy `SHOP_UPGRADES` still exists beside station upgrades | `SHOP_UPGRADES` contains older tofu-stock-cost upgrades and `renderShopUpgrade()` still exists, though current UI mostly uses `STATION_UPGRADES` | Even if hidden, this increases implementation ambiguity and risk of duplicate concepts returning | Keep legacy upgrades hidden or migrate/remove them in a scoped cleanup once tests cover the newer station-upgrade path | P2 |
| Some partial systems are marked implemented because they have state/actions, but not because they fit pacing | Training, Garage, License, and some broader systems are tested and listed as implemented/placeholder in `IMPLEMENTATION_STATUS.md` | Future prompts may treat scaffolding as ready product | Continue labeling them as scaffolding until they are paced, revealed, and playtested | P2 |

## 7. Upgrade Timing Problems

| Upgrade / Station | Current Visibility | Current Affordability | Bottleneck Solved | Felt Impact | Audit Result |
| --- | --- | --- | --- | --- | --- |
| Buy Tofu Press | Visible immediately in Production/generator cards | First extra press costs roughly 18 Tips after the starter press | Low Tofu Stock runway | Not meaningful when stock is already high | Implemented, but should be down-ranked unless stock is low |
| Buy Prep Counter | Visible immediately because starter Prep Counter is owned/unlocked | Next counter costs roughly 29 Tips plus 1 Prep Slot | Slow order prep | Strong and relevant in the observed state, but just out of reach at 12 Tips | Implemented, probably the better first purchase when stock is healthy |
| Steady Pressing | Revealed after first shop order | 20 Tips target; reachable after about two simple orders if no spending | Slow Tofu Stock growth | Weak in healthy-stock states | Implemented but mistimed or mis-prioritized as first named upgrade |
| Double Mold | Revealed after 3 Tofu Presses or 3 fulfilled orders | 40 Tips target | Tofu Stock plateau | Not relevant to early high-stock wait state | Implemented, should remain later |
| Tidy Packaging | Revealed after 5 fulfilled orders or 2 Prep Counters | 60 Tips target | Slow order prep | This is the upgrade the player wants, but it appears late | Implemented but hidden too long for the observed bottleneck |
| Double Labels | Revealed after 2 Prep Counters or 10 orders | 120 Tips target | Order throughput plateau | Later throughput jump | Implemented, timing likely acceptable later |
| Better Boxes | Legacy/partial; intended after 15 orders | 200 Tips target in docs; legacy code uses older upgrade model | Tip income plateau | Not part of first-loop decision | Partial; keep hidden |
| Shop Sign | Station visible near Reputation 10 or Shop Level 2; legacy upgrade also exists | Station base cost 140 Tips, doc target 300 Tips | Reputation unlock pressure | Too early if shown before reputation matters | Partial; keep later |

## 8. Reveal Timing Problems

| Issue | Evidence | Why It Hurts | Recommended Fix | Priority |
| --- | --- | --- | --- | --- |
| Upgrades are revealed by first order, not by meaningful upgrade readiness | `SHOP_TABS` unlocks `upgrades` after `hasFirstShopOrder(state)` | The player can open a panel before it has a satisfying action | Reveal Upgrades when Steady Pressing is affordable/close or when Tidy Packaging is relevant | P1 |
| Ledger reveals after any entry | `SHOP_TABS` unlocks `ledger` when `state.shop.ledger.length > 0` | A utility/history panel can appear before it serves first-loop decision-making | Keep Ledger subtle until several events, offline return, or first stamp/reward recap | P2 |
| Training reveals after 10 fulfilled orders or any Cup Stability XP | Training is outside the first-loop contract | It can compete with shop upgrades if it appears too soon | Keep hidden until route/story systems need fictional skill | P2 |
| Routes/Rivals use broad Reputation thresholds | Routes and Rivals can unlock around Reputation 10 | Reputation can accumulate through order types without the player making a route decision | Gate route/rival teasers behind Shop Sign or a deliberate route-introduction beat | P2 |
| Settings is always visible | Settings is utility, not progression | This is acceptable if visually small, but should not dominate first-time shop | Keep Settings available but low-priority | P3 |

## 9. Offline Progress Problems

| Issue | Evidence | Why It Hurts | Recommended Fix | Priority |
| --- | --- | --- | --- | --- |
| Offline cap is generous for first-loop learning | `SHOP_OFFLINE_CAP_HOURS` is 8 | A new user can gain enough stock/orders to skip early friction and reveal systems without learning why | Add an early-game offline cap or throttle until first upgrade / first Family Tofu Tray | P1 |
| Offline progress can create resources but not decisions | Offline earnings summarize tofu/orders/tips, but no dedicated welcome-back choice is modeled | Player returns to numbers, not a clear action | On offline return, recommend exactly one action such as Fulfill Max best order or buy the bottleneck-solving station | P1 |
| Offline reveal triggers may be too broad | Existing reveal gates use Reputation, Shop Level, Shop Reach, ledger length, and fulfilled orders | Time away can indirectly open tabs | Separate “resource earned” from “system introduced” with explicit discovery flags | P2 |

## 10. Empty Or Misleading Panel Issues

| Panel | Current Risk | Recommended Treatment | Priority |
| --- | --- | --- | --- |
| Upgrades | Can be visible with only a locked/irrelevant Steady Pressing path | Hide until an upgrade is relevant or show one clear “next upgrade” card with time-to-afford | P1 |
| Passport | Good as teaser after first stamp, but should avoid full catalog dump | Keep first stamp details only, then one next mystery hint | P2 |
| Ledger | Can appear after one order and feel like debug/history | Reveal as “Recent counter notes” only after several entries or offline return | P2 |
| Routes | Placeholder route cards should not appear in first 10 minutes | Keep hidden/teaser until Shop Sign or explicit route preview | P2 |
| Training | Parked-only but not first-loop relevant | Hide until fictional routes need skill | P2 |
| Shop Spirit | Placeholder/late layer | Keep hidden until stable production and a real Spirit sink/source | P2 |
| Rivals | Placeholder/late layer | Keep hidden until route/festival systems exist | P3 |
| License | Prestige layer | Keep hidden until plateau requirements are plausible | P2 |
| Settings | Utility surface | Keep available but visually secondary | P3 |

## 11. Specific UI Bugs Found

| Issue | Evidence | Why It Hurts | Recommended Fix | Priority |
| --- | --- | --- | --- | --- |
| `Recent Reward +4 XP · undefined` likely comes from shop rewards lacking `routeType` | `fulfillShopOrders()` writes recent reward entries with `type: "shop_order"` and `label`, but no `routeType`. `renderDeliveryLog()` renders `${recentReward.routeType}` unconditionally | Visible `undefined` makes the UI feel unfinished | Render `recentReward.label` for shop rewards, or fall back to a safe label such as `Shop Order` when `routeType` is absent | P0 |
| Missing before/after effect preview on upgrades | `renderStationUpgradeCard()` shows current effect text but not next-rate comparison | Players cannot predict why buying matters | Show current rate -> next rate, or “Prep Counter: 0.025/sec -> 0.038/sec” for relevant upgrades | P1 |
| Disabled reasons explain costs but not always strategic value | Purchase buttons say “Need X Tips” but do not always say whether the purchase solves stock or order throughput | Players know what is missing but not why they should care | Add state-based helper copy: “Not urgent: stock is healthy” or “Best next fix: more order prep” near actions | P1 |
| Legacy upgrade naming risk remains in code | `renderShopUpgrade()` still has generic `Buy Upgrade` and old tofu-cost model | If surfaced again, it will recreate prior mismatch | Keep it unreachable or remove/migrate in a future cleanup | P2 |

## 12. Next Best Action Audit

| State | Current Handling | Audit |
| --- | --- | --- |
| No ready orders, Prep Counter preparing | Returns `wait_prep_counter` unless Prep Counter is affordable and stock runway is healthy | Correct fallback, but too passive if an affordable relevant upgrade exists |
| High stock, no orders | Recommends Buy Prep Counter only when affordable; otherwise wait | Strategically correct, but player needs visible progress toward the Prep Counter or Tidy Packaging |
| Low stock, no orders | Recommends Pack Tofu or Buy Tofu Press | Correct |
| 1 ready simple order | Recommends Fulfill Simple Tofu Box | Correct |
| Family Tofu Tray unlocked and affordable | Recommends Family Tofu Tray | Correct |
| First upgrade affordable | Can recommend generic upgrade, but not in healthy-stock/prep-wait state | Needs bottleneck-aware ordering |
| Upgrades panel visible but no upgrade affordable | Can show locked/disabled upgrade cards | Should be hidden or summarized as “next upgrade soon” |
| Offline return with resources | Can recommend fulfillment if orders are ready | Needs a stronger welcome-back decision summary |
| Cup Test available but shop loop has work | Generally secondary now | Correct; preserve |

## 13. Safety And Privacy Regression Audit

No recommended first-loop fix needs to touch:

- Cup Test scoring
- speed rewards
- live speed display
- GPS or motion storage
- share output
- active-drive shop controls
- backend/network/account behavior

Future fixes should remain local, parked-only, and limited to Tofu Shop pacing, recommendations,
copy, and reveal gates.

## 14. Recommended First Implementation Slice

Implement one small “First Meaningful Upgrade” slice before adding any new systems.

| Step | Goal | Notes |
| --- | --- | --- |
| 1 | Fix `Recent Reward` fallback | Replace undefined route text for shop rewards with reward label/type |
| 2 | Make the first bottleneck-solving choice explicit | In healthy-stock/no-order states, surface “Buy Prep Counter” when affordable; otherwise show exact progress toward it |
| 3 | Reveal Tidy Packaging earlier when order prep is the bottleneck | Either reveal it after the first “waiting for Prep Counter” moment or after 2-3 fulfilled orders, not only 5 orders / 2 counters |
| 4 | Reconsider first purchase pacing | Decide whether the intended first purchase is Prep Counter, Tidy Packaging, or Steady Pressing; tune only the minimum values needed |
| 5 | Hide or defer Upgrades tab when it has no useful content | Avoid opening an empty/irrelevant panel |
| 6 | Add before/after rate previews for station upgrades | Make upgrades feel measurable immediately |

Recommended first implementation priority:

```text
Fix reward undefined -> make Prep Counter/Tidy Packaging the first relevant bottleneck solution -> hide empty upgrade panel -> add before/after upgrade previews.
```

Do not implement Routes, Crew, Garage, Dream Garage, Shop Spirit, Rivals, or License in this slice.

## 15. Recommended Tests

| Test | Purpose | Priority |
| --- | --- | --- |
| Shop-order recent reward uses label and never renders `undefined` | Covers the observed `Recent Reward +4 XP · undefined` bug | P0 |
| Healthy stock + no ready orders + affordable Prep Counter recommends Buy Prep Counter | Confirms order-throughput bottleneck handling | P0 |
| Healthy stock + no ready orders + unaffordable Prep Counter shows progress toward Prep Counter or Tidy Packaging, not only passive wait | Keeps waiting state actionable | P1 |
| Steady Pressing is not the dominant recommendation when stock runway is healthy and order prep is the bottleneck | Prevents irrelevant first upgrade recommendation | P1 |
| Tidy Packaging reveals when order-prep bottleneck has been experienced | Ensures first upgrade path solves the felt problem | P1 |
| Upgrades tab is hidden or teaser-only when no meaningful upgrade is available | Prevents empty-panel feeling | P1 |
| First station/upgrade purchase is reachable within documented target simulated time | Enforces first-loop pacing | P1 |
| Upgrade cards show current effect and next effect/rate preview | Makes upgrades feel measurable | P2 |
| Offline return during early shop shows one dominant action and does not reveal advanced tabs only from idle accumulation | Prevents offline skip | P2 |
| Advanced systems remain hidden/down-ranked during first 10 minutes | Preserves progressive reveal | P2 |
| Cup Test remains optional and never becomes shop bottleneck when shop work exists | Preserves product model | P0 |
| Safety/privacy regression: no fetch/XMLHttpRequest/sendBeacon/upload path | Preserves local-first contract | P0 |

