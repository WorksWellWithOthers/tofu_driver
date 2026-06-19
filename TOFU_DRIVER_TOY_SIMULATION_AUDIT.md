# Tofu Driver Toy And Simulation Audit

This audit checks the current game against the `Toy, Simulation, and Player Expression Principles`
in `DESIGN.md`. It is evidence-based: runtime features count only when they exist in the current
frontend or tests.

## Principle Audit

| Principle | Current Evidence | Status | Gaps / Risks | Recommended Next Slice | Priority |
| --- | --- | --- | --- | --- | --- |
| Design by constraint | `DESIGN.md` safety/privacy contract; Cup Test rewards smoothness, not speed; Basic Mode avoids location; shop/story/build actions are parked-only; tests reject speed/GPS/map/street/share leakage. | Strong | Constraints must keep applying as more expressive systems are added. | Keep every new toy local, parked, and no-speed by default. | P0 |
| Toy-first design | Cup Trail, Tofu Garage living scene, Passport stamps, Dream Build progress, Delivery Crew cosmetic surface, share cards, Result Story captions, Cargo Commentary, fanfares. | Partial | Most toys are still display/status objects; captioning and generated commentary are small story tools, not full open-ended creation. | Garage Pride / Build Reflection V1. | P1 |
| Open-ended play | Tofu Garage can grow through shop scaling, Dream Build, Net Worth, Brand Value, stamps, and cosmetics. | Partial | Current runtime still mostly guides the player through predetermined upgrade paths. | Add local story/expression tools before deeper economy branches. | P2 |
| Creative leverage/customization | Delivery Crew selection, sound/character collections, Cup Trail result flavor, Dream Build identity, share-card output, local result captions. | Partial | Build choices are linear; shop/garage decoration and multi-panel comic tools are not implemented. | Garage Pride / Build Reflection V1. | P1 |
| Simple start, layered complexity | First surface is Cup Test; Tofu Garage progressive reveal hides later tabs/systems; starter shop has one obvious loop; Next Best Action guides bottlenecks. | Strong | Future simulation systems could overload the first session if revealed too early. | Keep needs/probability systems locked behind explicit context. | P0 |
| Emotional outcomes: pride, guilt, delight, relief, curiosity | Stamps/fanfares, Dream Build progress, Net Worth milestones, covered-car reveal, living scene, coach recap, cargo condition, and Cargo Commentary create pride/relief/curiosity and some gentle embarrassment. | Partial | Delight is improved for rough outcomes, but broader emotional ownership is still narrow. | Garage Pride / Build Reflection V1. | P2 |
| Enjoyable failure | Cup Test gives outcome labels, coach recap, and deterministic Cargo Commentary; shop bottleneck copy names missing resources; failures are recoverable. | Partial | Failure flavor is now present, but there is not yet a broader library of authored result moments. | Playtest and expand only if it stays safe. | P2 |
| Failure due to knowledge, not skill | Shop bottlenecks teach missing resources; Next Milestone/Next Best Action explain what to fix; Cup Test rewards smoothness instead of speed; Cargo Commentary gives cargo-centered hints without technical driving coaching. | Partial | Cup Test still has real motion-control difficulty; copy must keep avoiding twitch/reflex mastery. | Tune commentary after real-device playtests. | P2 |
| Screenshot/story/comic potential | Share card exists; Cup Trail and result summaries are safe and local; Result Story Caption V1 adds a short local caption to copied/downloaded result cards; Cargo Commentary adds generated story flavor; living scene and Dream Build cards create screenshot moments. | Partial | No multi-panel editor, stickers, photo tools, uploads, public profiles, or Dream Build captioning exists. | Garage Pride / Build Reflection V1. | P1 |
| Needs/maintenance/complexity budget | Current production resources and bottlenecks are visible; maintenance-like systems are mostly deferred. | Future | Hunger/fatigue/comfort-style sliders could become chores or clutter. | Shop Comfort Meter Prototype only after a separate design audit. | Future |
| Multiple paths to goal state | Cash, Tofu Business Value, Garage Build Value, Brand Value, Net Worth milestones, stamps, cosmetics, and Dream Build all exist. | Partial | Runtime progression still strongly funnels through shop scaling before later paths matter. | Add expression/status slices before adding more mandatory resources. | P2 |
| Discovery/easter eggs/exploits | Progressive reveal, first stamp fanfare, discovery fanfare, covered-car story beat, and living scene variants provide surprise. | Partial | No real hidden interaction/easter-egg system; exploits should remain harmless and local. | Add small local discovery beats tied to screenshots/stamps later. | P3 |
| Black-box simulation | Living scene, covered-car reveal, Sponsor Inquiry, and Brand Value create some story correlation without exposing every detail. | Partial | Bottleneck, affordability, Net Worth, and safety-sensitive outcomes must stay legible. | Keep black-box feel to parked story systems only. | P2 |
| Monte Carlo/probability systems | No current parked probability event system. Current core scoring and qualification are deterministic/explainable. | Future | Randomness could feel arbitrary if tied to progression or Cup Test qualification. | Parked Probability Events Audit before any runtime random events. | Future |

## Verdict

Tofu Driver already follows the strongest constraint-design principles. The safety/privacy contract,
local-first implementation, parked-only management loop, progressive reveal, and no-speed reward
stance are strong and tested.

The toy/simulation direction is promising but only partially implemented. Cup Trail, living scene,
Dream Build, stamps, fanfares, share cards, Result Story captions, Cargo Commentary, and cosmetics
give the player toy-like objects, but creative leverage is still narrow. The current game now lets
the player author one safe caption on a result card and adds deterministic generated cargo flavor,
but broader story and customization tools remain future.

## Top Gaps

- Creative leverage is limited; most choices are predetermined upgrade or work-level purchases.
- Share cards now support one safe local caption, but full comic/story tooling is not implemented.
- Failure copy now has a first gentle Cargo Commentary layer, but broader result variety remains
  limited.
- Needs/maintenance systems are future-only and risky because every maintained item adds complexity.
- Monte Carlo/probability systems are future-only and need a separate parked-system design.
- Multiple paths exist conceptually, but current runtime still mostly funnels through Tofu Shop
  scaling into Dream Build.
- Discovery exists through reveals and fanfares, but hidden surprises are not yet a real system.
- Black-box story flavor is useful, but safety, scoring, qualification, bottlenecks, and
  affordability must remain explainable.

## Recommended Next Slices

1. Garage Pride / Build Reflection V1
   - Add a local builder note or "why this build matters" caption to Dream Build.
   - Create ownership without new economy or full Dream Garage.

2. Shop Comfort Meter Prototype
   - Future-only design candidate.
   - Must prove it creates choices and stories, not chores.

3. Parked Probability Events Audit
   - Design future probabilistic customer/sponsor/shop/garage events before implementation.
   - Keep probability out of Cup Test qualification and safety-sensitive outcomes.

Result Story Card / Mini Comic Caption V1 and Failure Flavor V1 are implemented as narrow post-run
story tools. The next best implementation slice is **Garage Pride / Build Reflection V1**, because
it gives the parked Dream Build similar local expression without adding economy complexity.

## Safety And Privacy Boundaries

This audit does not add runtime behavior. Future toy/simulation features must preserve:

- no speed rewards
- no public-road competition
- no route leaderboards
- no GPS, map, street, exact-distance, route-trace, raw motion, or speed-log sharing
- no raw motion/GPS upload
- no active-drive shop, story, caption, commentary, comic, social, or reward-claiming interactions
- no failure copy that shames the driver or pressures them to drive harder
- no real-world vehicle modification advice
- no backend, accounts, uploads, payments, multiplayer, service workers, social profiles, or new
  network calls from this pass
