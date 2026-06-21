# Tofu Driver Toy And Simulation Audit

This audit checks the current game against the `Toy, Simulation, and Player Expression Principles`
in `DESIGN.md`. It is evidence-based: runtime features count only when they exist in the current
frontend or tests.

## Principle Audit

| Principle | Current Evidence | Status | Gaps / Risks | Recommended Next Slice | Priority |
| --- | --- | --- | --- | --- | --- |
| Design by constraint | `DESIGN.md` safety/privacy contract; Cup Test rewards smoothness, not speed; location is requested only after `Start Cup Test` to attempt certification; denied or insufficient location remains playable as a Local Result; shop/story/build actions are parked-only; tests reject speed/GPS/map/street/share leakage. | Strong | Constraints must keep applying as more expressive systems are added. | Keep every new toy local, parked, and no-speed by default. | P0 |
| Toy-first design | Cup Trail, Tofu Garage living scene, Passport stamps, Dream Build progress, Garage Event Board V1, Car Management assignments, Second Bay / Second Project Car shell, Second Car Direction Track, Second Car Assignment Board, Garage Expansion Board, local Builder Notes, Delivery Crew cosmetic surface, polished story-card previews, share cards, Result Story captions, Cargo Commentary, fanfares. | Partial | The garage now has a complete first-build toy, a selected five-level second-car identity branch, one proof assignment, and facility choices, but captioning, generated commentary, story-card previews, and Builder Notes are still small story tools, not full open-ended creation. | Playtest local expression tools and the second-car/garage-expansion payoff before adding larger editors or full fleet systems. | P1 |
| Open-ended play | Tofu Garage can grow through shop scaling, Dream Build, Garage Event Board V1, Car Management V1, Second Bay, Second Car Direction Track, Second Car Assignment Board, Garage Expansion Board, Net Worth, Brand Value, Garage Reputation, stamps, and cosmetics. | Partial | Runtime now reaches a managed first car and selected second-car project branch with one proof assignment and facility choices, but it still guides the player through predetermined upgrade paths, assignment choices, and one locked direction track. | Add third-car, assignment-chain, and build-choice systems only after the facility projects are playtested. | P2 |
| Creative leverage/customization | Delivery Crew selection, sound/character collections, Cup Trail result flavor, Dream Build identity, local Builder Notes, share-card output, local result captions, the standalone Tofu Garage tuning catalog, and the Second Project Car direction track plus proof assignment. | Partial | Build choices remain mostly linear; the catalog is source material and category preview, not a full customization system yet; second-car assignment chains, shop/garage decoration, and multi-panel comic tools are not implemented. | Playtest Builder Note usefulness, first-car management, Second Bay, and the second-car identity loop before scoping deeper customization. | P1 |
| Simple start, layered complexity | First surface is Cup Test; Tofu Garage progressive reveal hides later tabs/systems; starter shop has one obvious loop; Next Best Action guides bottlenecks. | Strong | Future simulation systems could overload the first session if revealed too early. | Keep needs/probability systems locked behind explicit context. | P0 |
| Emotional outcomes: pride, guilt, delight, relief, curiosity | Stamps/fanfares, Dream Build progress, Builder Notes, Net Worth milestones, covered-car reveal, living scene, coach recap, cargo condition, Cargo Commentary, and the local hidden sticker/shirt reveals create pride/relief/curiosity and some gentle embarrassment. | Partial | Builder Notes improve ownership, but broader authored result/build variety remains limited. Hidden merch is local-only and not backend verified. | Playtest note prompts and failure/commentary tone. | P2 |
| Enjoyable failure | Cup Test gives outcome labels, coach recap, and deterministic Cargo Commentary; shop bottleneck copy names missing resources; failures are recoverable. | Partial | Failure flavor is now present, but there is not yet a broader library of authored result moments. | Playtest and expand only if it stays safe. | P2 |
| Failure due to knowledge, not skill | Shop bottlenecks teach missing resources; Next Milestone/Next Best Action explain what to fix; Cup Test rewards smoothness instead of speed; Cargo Commentary gives cargo-centered hints without technical driving coaching. | Partial | Cup Test still has real motion-control difficulty; copy must keep avoiding twitch/reflex mastery. | Tune commentary after real-device playtests. | P2 |
| Screenshot/story/comic potential | Share card exists; Cup Trail and result summaries are safe and local; Result Story Caption V1 adds a short local caption to copied/downloaded result cards; Cargo Commentary adds generated story flavor; the compact Result Card and downloaded card polish make the result feel more comic-like; Qualified Route Context V1 can add an explicit opt-in route-outline card for completed Certified Results; Builder Note adds local Dream Build ownership; living scene and Dream Build cards create screenshot moments. | Partial | No multi-panel editor, stickers, photo tools, uploads, public profiles, or build showcase card exists. Route outline sharing is image-only opt-in and not the default. | Playtest whether result captions plus Builder Notes and optional route-outline cards are enough before adding larger tools. | P1 |
| Needs/maintenance/complexity budget | Current production resources and bottlenecks are visible; maintenance-like systems are mostly deferred. | Future | Hunger/fatigue/comfort-style sliders could become chores or clutter. | Shop Comfort Meter Prototype only after a separate design audit. | Future |
| Multiple paths to goal state | Cash, Tofu Business Value, Garage Build Value, Brand Value, Net Worth milestones, stamps, cosmetics, and Dream Build all exist. | Partial | Runtime progression still strongly funnels through shop scaling before later paths matter. | Add expression/status slices before adding more mandatory resources. | P2 |
| Discovery/easter eggs/exploits | Progressive reveal, first stamp fanfare, discovery fanfare, covered-car story beat, and living scene variants provide surprise. | Partial | No real hidden interaction/easter-egg system; exploits should remain harmless and local. | Add small local discovery beats tied to screenshots/stamps later. | P3 |
| Black-box simulation | Living scene, covered-car reveal, Sponsor Inquiry, and Brand Value create some story correlation without exposing every detail. | Partial | Bottleneck, affordability, Net Worth, and safety-sensitive outcomes must stay legible. | Keep black-box feel to parked story systems only. | P2 |
| Monte Carlo/probability systems | No current parked probability event system. Current core scoring and qualification are deterministic/explainable. | Future | Randomness could feel arbitrary if tied to progression or Cup Test qualification. | Parked Probability Events Audit before any runtime random events. | Future |

## Verdict

Tofu Driver already follows the strongest constraint-design principles. The safety/privacy contract,
local-first implementation, parked-only management loop, progressive reveal, and no-speed reward
stance are strong and tested.

The toy/simulation direction is promising but still intentionally bounded. Cup Trail, living scene,
Dream Build, Builder Notes, stamps, fanfares, compact result cards, share cards, Result Story
captions, Cargo Commentary, Car Management assignments, Second Bay, Second Car Direction, Second
Car Assignment Board, and cosmetics give the player toy-like objects. Creative leverage is still
narrow: the current game lets the player author one safe caption on a result card, save one local
Dream Build note, complete and manage one car, and acquire, identify, build, and prove one second
rolling shell. Broader story tools, second-car assignment chains, and full fleet management remain
future.

## Top Gaps

- Creative leverage is limited; Builder Notes add ownership, but most progression choices are still
  predetermined upgrade or work-level purchases.
- Share cards now support one safe local caption and a compact Result Card, and Dream Build supports
  a local Builder Note, but full comic/story tooling is not implemented.
- Failure copy now has a first gentle Cargo Commentary layer, but broader result variety remains
  limited.
- Needs/maintenance systems are future-only and risky because every maintained item adds complexity.
- Monte Carlo/probability systems are future-only and need a separate parked-system design.
- Multiple paths exist conceptually, and the runtime now reaches first-car management plus Second
  Bay, but progression is still mostly a guided shop-to-garage ladder.
- Discovery exists through reveals and fanfares, but hidden surprises are not yet a real system.
- Black-box story flavor is useful, but safety, scoring, qualification, bottlenecks, and
  affordability must remain explainable.

## Recommended Next Slices

1. Expression playtest and prompt tuning
   - Validate whether Result Story captions and Builder Notes actually create pride, humor, and
     screenshot-worthy moments.
   - Tune preset text before adding bigger editors or customization systems.

2. Shop Comfort Meter Prototype
   - Future-only design candidate.
   - Must prove it creates choices and stories, not chores.

3. Parked Probability Events Audit
   - Design future probabilistic customer/sponsor/shop/garage events before implementation.
   - Keep probability out of Cup Test qualification and safety-sensitive outcomes.

Result Story Card / Mini Comic Caption V1, Failure Flavor V1, Result Card Visual Polish V1,
Garage Pride / Builder Note V1, Car Management V1, Second Bay V1, Second Car Direction Track V1,
Second Car Assignment Board V1, and Garage Expansion Board V1 are implemented as narrow local
expression/progression tools. The next best step is to playtest whether these small toys create
enough player-authored story before adding third-car acquisition, second-car assignment chains,
larger editors, decoration systems, full fleet management, or simulation complexity.

## Safety And Privacy Boundaries

This audit does not add runtime behavior. Future toy/simulation features must preserve:

- no speed rewards
- no public-road competition
- no route leaderboards
- no automatic route outline sharing
- no GPS, map, street, exact-distance, route-trace, raw motion, or speed-log sharing in copied text
- no raw motion/GPS upload
- no active-drive shop, story, caption, commentary, comic, social, or reward-claiming interactions
- no failure copy that shames the driver or pressures them to drive harder
- no real-world vehicle modification advice
- no Tofu Garage tuning part effect on Cup Test scoring, certification, route proof, Driver XP, or
  real-driving rewards
- no backend, accounts, uploads, payments, multiplayer, service workers, social profiles, or new
  network calls from this pass
