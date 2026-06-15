# Tofu Driver Implementation Status

This file maps the Tofu Driver design contract to actual implementation evidence. `DESIGN.md`
contains both implemented behavior and future direction; this file tracks what is real in the repo
today.

Status values: `Implemented`, `Partial`, `Documented only`, `Planned`, `Blocked`,
`Rejected / Non-goal`.

## Current Runtime Core

| Area | Requirement / Feature | Status | Evidence / Files | Tests | Remaining Work | Priority | Safety / Privacy Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Runtime | Static browser-only app | Implemented | `frontend/nospill/index.html`, `frontend/nospill/app.js`, `frontend/nospill/app.css`, `README.md` | `make check` | Rename legacy source path later | P2 | No backend required for MVP |
| Runtime | Cloud Run deployment | Implemented | `Dockerfile`, `nginx.conf`, `Makefile`, `DEPLOYMENT.md` | `make check` before deploy | External DNS/certificate verification is outside repo | P1 | Static container only |
| Runtime | Two app surfaces: Tofu Shop and Don't Spill the Cup | Implemented | `data-app-surface`, `data-surface-target`, `setAppSurface`, `surfaceFromHash` in `frontend/nospill/index.html` and `frontend/nospill/app.js` | `testTwoSurfaceRoutingSeparatesShopAndCupTest` | Mobile navigation polish | P1 | Cup Test is default visitor surface; Shop remains home idle game |
| Runtime | Hash routing for `#/shop` and `#/cup-test` | Implemented | `surfaceHash`, `initializeAppSurface`, `hashchange` listener in `frontend/nospill/app.js`; `README.md` | `testTwoSurfaceRoutingSeparatesShopAndCupTest` | Consider clean URL routing later if hosting supports it | P2 | Root/no hash defaults to `#/cup-test`; user-facing copy uses product names |
| Runtime | Shared brand shelf | Implemented | `nospill-brand-hero`, `renderBrandShelf`, fallback CSS | `testTofuDriverArtworkIsIsolatedAndAccessible`, `testTwoSurfaceRoutingSeparatesShopAndCupTest` | Mobile copy polish | P1 | Logo fallback appears only if image fails |
| Driving | Basic Mode `DeviceMotionEvent` | Implemented | `getDeviceMotionConstructor`, `setMode`, `startRun` in `frontend/nospill/app.js` | `testLocationPermissionFlowRemainsOptIn` | Real-device browser testing | P1 | Basic Mode does not request location |
| Driving | Qualified Run Mode opt-in location | Implemented | `startLocationWatch`, `qualificationForRoute`, `if (appState.mode === "qualified") startLocationWatch()` | `testLocationPermissionFlowRemainsOptIn`, `testQualifiedRouteAnalysisAndQualification` | Real-device HTTPS testing | P1 | Location starts only after explicit start |
| Driving | Mount orientation mapping | Implemented | `MOUNT_PRESETS`, `computeMappedMotion`, mount controls | `testMountAxisMapping`, `testMappedMotionUsesSelectedMountConfig` | Mobile UX tuning | P2 | Local sensor mapping only |
| Audio | Audio coach Muted/Normal/Loud | Implemented | `AUDIO_LEVELS`, `normalizeAudioLevel`, `computeAudioTargetGain` | `testAudioVolumeGainModel`, `testAudioVolumePersistsInLocalStorageState` | Real-phone volume tuning | P2 | User-controlled, no network |
| Visual | Tofu cargo slosh visualization | Implemented | `TOFU_CARGO_MASCOT_SRC`, `updateTofuCargoVisualState`, `drawFallbackTofuCargoMascot` | `testTofuCargoVisualizationReplacesGenericGDot`, `testTofuCargoVisualizationUsesMotionNotSpeed` | Asset polish | P2 | Uses motion smoothness, not speed |
| Active drive | Minimal active-drive UI | Implemented | `run-view` in `index.html`, active-drive render gates in `app.js` | `testProgressiveRevealTeasersUnlockAfterFirstDelivery`, active-drive assertions | Real mobile testing | P0 | No shop, crew, sound, simulator controls during drive |

## Privacy / Safety Contract

| Area | Requirement / Feature | Status | Evidence / Files | Tests | Remaining Work | Priority | Safety / Privacy Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Privacy | No raw motion upload | Implemented | No network upload path in `app.js`; local summary storage only | `testNoSpillClientDoesNotUploadRawRunData`, `assertNoSensitiveStorageData` | Continue regression coverage | P0 | Raw motion stream is not uploaded |
| Privacy | No raw GPS upload | Implemented | `saveSummaryLocally`, export/import sanitization | `testNoSpillClientDoesNotUploadRawRunData`, storage/export tests | Continue regression coverage | P0 | Route samples cleared after summary |
| Privacy | No speed history upload | Implemented | Share/storage sanitizers; no backend | share/storage tests | Continue regression coverage | P0 | Speed is validation-only |
| Privacy | No map/route/street upload | Implemented | No map APIs; no street fields in state | `testShareOutputIncludesDeliveryLayerAndExcludesSensitiveDetails`, export/import tests | Continue regression coverage | P0 | Share output excludes route trace/street |
| Accounts | No account required | Implemented | Static frontend; README non-goal | `make check` | None for MVP | P0 | Local-only identity |
| Backend | No backend required | Implemented | Static app, Docker/Nginx only | `make check` | Backend may be future merch unlock-token work | P0 | No backend writes |
| Storage | `localStorage` summarized state only | Implemented | `normalizeGameState`, `saveGameState`, `exportGameProgress` | `testGameStateStorageIsSummaryOnlyAndCommuteMasteryUsesFingerprints`, export/import tests | Keep audits current | P0 | No raw GPS/motion/route samples |
| Speed | Speed validation-only | Implemented | `qualificationForRoute`, XP/reward helpers avoid speed reward inputs | `testDeliveryRewardsDoNotUseSpeedAndRespectMajorUnlockContext`, shop/collection/share speed tests | Continue regression coverage | P0 | Higher speed does not improve rewards |
| Active drive | No active-drive shop/crew/sound controls | Implemented | `renderTofuShop`, `renderCollectionPanel`, `renderSimulatorPanel` active-drive gates | `testProgressiveRevealTeasersUnlockAfterFirstDelivery` | Real mobile testing | P0 | Parked-only management |
| Active drive | No in-drive clicking/upgrading/claiming | Implemented | active-drive disabled paths and hidden controls | active-drive tests | Continue UX review | P0 | Rewards reveal after run |

## Local Storage / Persistence

| Area | Requirement / Feature | Status | Evidence / Files | Tests | Remaining Work | Priority | Safety / Privacy Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Storage | `nospill.club.v1` | Implemented | `STORAGE_KEY` in `app.js` | storage/audio tests | Future migration if renamed | P2 | Legacy Cup Test summary key |
| Storage | `tofuDriverGameStateV1` | Implemented | `GAME_STORAGE_KEY` in `app.js` | `testGameProgressPersistsAcrossReloadSimulation` | Future schema migration docs | P1 | Versioned local game state |
| Storage | Saved session summaries | Implemented | `saveSummaryLocally`, `savedSessions` | storage tests | Add UI history later if desired | P3 | Summaries only |
| Storage | Shop state | Implemented | `normalizeShopState`, `shop` in game state | `testTofuShopStatePackIdleAndUpgradeRules` | Balance tuning | P2 | No raw driving data |
| Storage | Collection state | Implemented | `normalizeCollectionState`, `collection` in game state | `testCharacterAndSoundUnlocksAreLocalCosmeticAndPersisted` | More cosmetics later | P3 | Cosmetic only |
| Storage | Route mastery coarse fingerprints | Implemented | `routeFingerprintForSession`, `updateCommuteMastery` | `testGameStateStorageIsSummaryOnlyAndCommuteMasteryUsesFingerprints` | Better private copy/tuning | P3 | Buckets only, no coordinates |
| Tools | Export/import | Implemented | `exportGameProgress`, `importGameProgress` | `testResetExportAndImportProgressAreScopedAndValidated` | UX polish | P2 | Rejects raw/sensitive fields |
| Tools | Reset progress | Implemented | `resetGameState`, settings/progress tools | `testResetExportAndImportProgressAreScopedAndValidated` | UX polish | P2 | Clears Tofu Driver game state only |
| Sync | No cross-device sync | Implemented | No accounts/backend; docs in `DESIGN.md` | `make check` | Future accounts are separate scope | P0 | Progress stays on device/browser |
| Sync | No cross-domain migration | Documented only | `DESIGN.md` Local Storage section | None | Optional migration tool if needed | P3 | Browser origin storage limitation |

## Delivery / Cup Test

| Area | Requirement / Feature | Status | Evidence / Files | Tests | Remaining Work | Priority | Safety / Privacy Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Delivery | Today's Delivery | Implemented | `getDailyDelivery`, top dashboard UI | `testFirstTimeGameDashboardIsVisibleBeforeSetup` | Copy tuning | P1 | Local deterministic daily mission |
| Challenge | Don't Spill the Cup challenge surface | Implemented | `how-it-works`, setup flow, safety checklist, mode controls tagged `data-app-surface="cup-test"` | `testTwoSurfaceRoutingSeparatesShopAndCupTest`, start/location tests | Mobile copy polish | P1 | Always available; does not require shop resources |
| Delivery | Daily cargo profile catalog | Implemented | `CARGO_PROFILES`, `DAILY_DELIVERIES` | `testDailyDeliverySelectionAndEvaluation` | Add more cargo later | P2 | No speed goals |
| Scoring | Cargo condition from water-left score | Implemented | `calculateCargoCondition`, water loss helpers | `testWaterRanksAndLossAreMotionOnly` | Tune thresholds after mobile testing | P1 | Smoothness-based |
| Delivery | Route type labels | Implemented | `classifyRouteType` | `testRouteTypeClassification` | Tune route thresholds | P2 | Generic labels, no map/street |
| Rewards | Practice Mode reward gating | Implemented | `isValidPracticeSession`, `displayRankForSession`, reward gates | `testPracticeModeRewardGatingAndRankCopy` | Play-test duration thresholds | P0 | Practice cannot grant major qualified rewards |
| Rewards | Qualified delivery reward gating | Implemented | `isQualifiedSession`, `updateMerchProgress`, stamp rules | reward/merch tests | Real-world QA | P0 | Major rewards require qualified criteria |
| Progression | Driver License labels | Implemented | `getDriverLicense`, dashboard/result rendering | `testDriverLicensePassportAndCoachRecap` | More flavor later | P2 | Cosmetic/status only |
| Collection | Delivery Passport empty state | Implemented | dashboard/passport UI | first-run/progressive reveal tests | Passport UI polish | P2 | Local-only stamps |
| Results | Single result screen | Implemented | consolidated `summary-view`, `renderDeliverySummary` | `testResultScreenShowsGameSummarySections` | Visual polish | P1 | Avoids duplicate reward blocks |
| Results | Post-run navigation back to Tofu Shop/dashboard | Implemented | `returnToDashboard`, result footer buttons | `testPostRunNavigationReturnsToUpdatedDashboard` | Mobile UX polish | P1 | Does not reset progress or start a run |
| Sharing | Share card actions | Implemented | `shareResult`, `copyShareText`, `downloadShareCard` | share tests | Browser compatibility testing | P2 | Sanitized by default |

## Tofu Shop V1 / Generator V2

| Area | Requirement / Feature | Status | Evidence / Files | Tests | Remaining Work | Priority | Safety / Privacy Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Shop | Tofu Stock | Implemented | `shop.tofuStock`, shop UI | `testTofuShopStatePackIdleAndUpgradeRules` | Balance tuning | P2 | Local summarized resource |
| Shop | Tofu Shop home surface | Implemented | dashboard/shop sections tagged `data-app-surface="shop"`; `#/shop` route | `testTwoSurfaceRoutingSeparatesShopAndCupTest` | Mobile hierarchy polish | P1 | Playable at home without sensors/location |
| Shop | Delivery Orders | Implemented | `shop.deliveryOrders`, shop UI, `applyShopGeneratorTick` | `testTofuShopStatePackIdleAndUpgradeRules` | Balance tuning | P2 | Shop resource only; does not block The Cup Test |
| Shop | Tips | Implemented | `shop.tips`, Fulfill Shop Order rewards | shop/order tests | Balance tuning | P2 | Home shop currency, local-only |
| Shop | Reputation | Implemented | `shop.reputation`, `applyDeliveryToShop` | shop reward tests | Balance tuning | P2 | Comes from shop orders and smooth qualified outcomes |
| Shop | Prep Slots | Implemented | `shop.prepSlots`, `getPrepSlotMax`, station purchase gates | `testExpandedIdleShopLayerMechanics` | Balance regen/costs | P2 | Parked-only capacity, no driving effect |
| Shop | Shop Reach | Implemented | `shop.shopReach`, fictional route rewards | `testExpandedIdleShopLayerMechanics` | Route unlock tuning | P2 | Fictional districts only, no GPS/routes |
| Shop | Shop Spirit | Implemented | `shop.shopSpirit`, spirit generators and boosts | `testExpandedIdleShopLayerMechanics` | Boost balance | P2 | Parked-only boosts; no Cup Test scoring effect |
| Shop | Cup Stability XP | Implemented | `shop.cupStabilityXP`, Training drills | `testExpandedIdleShopLayerMechanics` | UI polish | P3 | Fictional/home training, no sensors |
| Shop | Route Knowledge | Implemented | `shop.routeKnowledge`, route card rewards | `testExpandedIdleShopLayerMechanics` | Balance tuning | P3 | Fictional route knowledge only |
| Prestige | License Stars | Implemented | `shop.licenseStars`, License Exam and perks | `testExpandedIdleShopLayerMechanics` | Prestige balance | P2 | Permanent local prestige, no real driving score effect |
| Shop | Shop Level | Implemented | `getShopLevel`, shop UI | shop level tests | Balance tuning | P2 | Does not affect real driving score |
| Shop | Pack Tofu | Implemented | `packTofu`, `handlePackTofu` | `testTofuShopStatePackIdleAndUpgradeRules` | UX tuning | P2 | Parked-only, disabled during drive |
| Shop | Fulfill Shop Order | Implemented | `fulfillShopOrder`, `handleFulfillShopOrder`, shop UI | `testTofuShopStatePackIdleAndUpgradeRules` | Result polish | P1 | Parked-only home action, no sensors/geolocation |
| Results | Shop Order Complete screen | Implemented | `renderShopOrderResult` | shop/order tests | Visual polish | P2 | Share actions disabled; not a driving result |
| Shop | Live generator ticking | Implemented | `tickOpenShopGenerators`, `applyShopGeneratorTick`, per-second shop rate labels | `testTofuShopStatePackIdleAndUpgradeRules` | Mobile pacing QA | P1 | Runs only while parked/open; no backend timer |
| Shop | Tabbed idle panels | Implemented | `SHOP_TABS`, `renderShopTabs`, `shop-tab-panel` | `testExpandedIdleShopLayerMechanics` | Mobile information density tuning | P1 | Hidden from active drive with landing view |
| Shop | Buy multiplier controls | Implemented | `shop-buy-multiplier`, `buyShopStation`, `Buy Max` station buttons | `testExpandedIdleShopLayerMechanics` | Add per-card ETA later | P2 | Reduces repetitive clicking |
| Shop | Cascading station catalog | Partial | `SHOP_STATIONS`, `buyShopStation`, `getShopGeneratorRates` | `testExpandedIdleShopLayerMechanics` | More balancing and station-specific visuals | P1 | Tofu shop language only |
| Shop | Capped idle production | Implemented | `calculateOfflineShopEarnings`, cap constants | idle production tests | Balance tuning | P2 | Includes tofu stock and delivery orders; no reputation |
| Generator | Tofu Press | Implemented | `SHOP_UPGRADES`, `getShopGeneratorRates`, generator UI | generator/shop tests | Balance tuning | P2 | Produces Tofu Stock only |
| Generator | Prep Counter | Implemented | `SHOP_UPGRADES`, `getShopGeneratorRates`, generator UI | generator/shop tests | Balance tuning | P2 | Converts Tofu Stock to Delivery Orders |
| Upgrade | Better Boxes | Implemented | `SHOP_UPGRADES`, delivery-to-shop reward modifier | upgrade/shop reward tests | Balance tuning | P3 | Packaging language, no vehicle advantage |
| Upgrade | Shop Sign | Implemented | `SHOP_UPGRADES`, reputation modifier | upgrade/shop reward tests | Balance tuning | P3 | Presentation/reputation only |
| Shop | Delivery Wall shelf | Rejected / Non-goal | Visible shelf removed from `index.html`; `renderDeliveryWall` is compatibility no-op | `testUnlockShelvesStayOutOfMainShopUi` | Surface rewards through Passport/results instead | P3 | Avoids exposing a full unlock checklist |
| Shop | Shop rewards after delivery | Implemented | `applyDeliveryToShop`, result grid | shop reward tests | Balance tuning | P1 | Speed does not affect rewards |
| Certified | Certified Cup Test boosts | Implemented | `applyDeliveryToShop`, `certifiedBoost`, active shop boost | speed/shop reward tests | Balance tuning | P1 | Qualified non-simulated sessions only; speed does not scale boost |
| Unlocks | Shop vs Certified unlock tracks | Partial | Internal merch/progress state and result summaries | share/result/merch tests | Keep visible roadmap shelves hidden; reveal rewards through stamps/results | P2 | Avoids real/fake wording and keeps certified progress separate |
| Shop | Parked-only shop actions | Implemented | active-drive gates in shop handlers/rendering | active-drive tests | Real mobile testing | P0 | No in-drive shop actions |
| Routes | Fictional Delivery Routes | Partial | `SHOP_ROUTE_CATALOG`, `completeFictionalRoute`, Routes panel | `testExpandedIdleShopLayerMechanics` | Add timed route queues and richer reports | P2 | Fictional cards, not real-road instructions |
| Training | Training Lot drills | Implemented | `TRAINING_DRILLS`, `runTrainingDrill`, Training panel | `testExpandedIdleShopLayerMechanics` | Add more drills | P3 | Parked/home only |
| Garage | Fictional garage upgrades | Implemented | `GARAGE_UPGRADES`, `buyGarageUpgrade`, Garage panel | `testExpandedIdleShopLayerMechanics` | Balance/cosmetic art | P3 | Does not affect real Cup Test scoring |
| Crew | Delivery Crew automation counts | Partial | `CREW_ROLES`, `hireCrewRole`, Crew panel | `testExpandedIdleShopLayerMechanics` | Add actual route assignment queues | P2 | Fictional/home automation only |
| Spirit | Shop Spirit and Festival Boosts | Partial | `SPIRIT_GENERATORS`, `SHOP_SPIRIT_BOOSTS`, `FESTIVAL_BOOSTS`, `useShopSpiritBoost`, `useFestivalBoost` | `testExpandedIdleShopLayerMechanics` | More token earning rules | P2 | Parked-only; no real driving score effect |
| Prestige | License Exam and perks | Partial | `licenseExamStatus`, `takeLicenseExam`, `LICENSE_PERKS` | `testExpandedIdleShopLayerMechanics` | Confirm UX and balance reset depth | P2 | First prestige does not require real driving |
| Rivals | Rival Shop Challenges | Partial | `RIVAL_CHALLENGES`, `startRivalChallenge`, Rivals panel | `testExpandedIdleShopLayerMechanics` | Add queued/claim flow | P3 | Friendly shop challenge copy only |
| Passport | Expanded shop/passport stamps | Partial | `STAMP_LABELS`, Passport panel | `testExpandedIdleShopLayerMechanics` | Category filters and details | P3 | Local-only achievements |
| Ledger | Delivery Ledger | Implemented | `shop.ledger`, `addLedgerEntry`, Ledger panel | `testExpandedIdleShopLayerMechanics` | Clear/filter UI later | P2 | Capped summaries only |
| Dev QA | Unlock All Local QA | Implemented | `isDevToolsEnabled`, `unlockAllLocalQa`, Settings / QA panel | `testExpandedIdleShopLayerMechanics` | Add explicit UI reset confirmation | P3 | Marks local state untrusted; no certified proof |

## Collection Layer

| Area | Requirement / Feature | Status | Evidence / Files | Tests | Remaining Work | Priority | Safety / Privacy Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Characters | Angry Tofu Driver | Implemented | `CHARACTER_CATALOG`, collection unlocks | collection tests | More art/flavor | P3 | First valid delivery unlock |
| Characters | Sleepy Dispatcher | Implemented | `CHARACTER_CATALOG`, Shop Level 2 unlock | collection tests | More art/flavor | P3 | Shop-level cosmetic |
| Characters | Tea Master | Implemented | `CHARACTER_CATALOG`, Hot Tea qualified unlock | collection tests | More art/flavor | P3 | Requires safe summarized criteria |
| Characters | Perfect Pour Courier | Implemented | `CHARACTER_CATALOG`, Perfect Pour unlock | collection tests | More art/flavor | P3 | Qualified Perfect Pour only |
| Sounds | Default sound pack | Implemented | `SOUND_PACK_CATALOG`, default collection state | collection tests | None | P3 | Always available |
| Sounds | Tofu Shop Bell | Implemented | `SOUND_PACK_CATALOG`, Shop Level 2 unlock | collection tests | Sound tuning | P3 | Parked/result screens |
| Sounds | Retro Arcade | Implemented | `SOUND_PACK_CATALOG`, stamp/delivery unlock | collection tests | Sound tuning | P3 | Parked/result screens |
| Sounds | Perfect Pour Chime | Implemented | `SOUND_PACK_CATALOG`, Perfect Pour unlock | collection tests | Sound tuning | P3 | Post-run only |
| UI | Character selector | Implemented | `renderCollectionPanel`, `selectCharacter` | collection/active-drive tests | Visual polish | P3 | Not interactive during drive |
| UI | Sound selector | Implemented | `renderCollectionPanel`, `selectSoundPack` | collection/active-drive tests | Visual polish | P3 | Not interactive during drive |
| Audio | Muted disables cosmetic sounds | Implemented | `playCosmeticSound`, audio level checks | collection/audio tests | Device tuning | P2 | Cosmetic sounds user-controlled |
| Audio | No reward sounds during active drive | Implemented | `playCosmeticSound` active-drive guard | collection tests | Continue regression coverage | P0 | Audio coach remains separate |

## Progressive Reveal / First-Run UX

| Area | Requirement / Feature | Status | Evidence / Files | Tests | Remaining Work | Priority | Safety / Privacy Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| First run | Simplified hero | Implemented | top hero in `index.html` | first-run tests | Mobile polish | P1 | Clear safety-first copy |
| First run | Today's Delivery dominant card | Implemented | dashboard card in `index.html`, `renderGameDashboard` | first-run tests | Copy polish | P1 | One primary delivery action |
| First run | Next Best Action | Implemented | `nextBestAction`, CTA UI | `testNextBestActionHierarchyStaysSinglePrimary` | More scenarios | P1 | Avoids competing actions |
| First run | Compact first-run stats | Implemented | dashboard status fields | first-run tests | Tune density | P2 | Non-driving dashboard only |
| First run | Locked teaser cards | Implemented | teaser copy and progressive reveal state | progressive reveal tests | Copy polish | P2 | Systems introduced parked-only |
| Dashboard | Expanded dashboard after first delivery | Implemented | `progressiveRevealState`, `renderGamePanels` | progressive reveal tests | Polish unlocked cards | P2 | Shows updated local state |
| Settings | Progress tools moved to Settings | Implemented | Settings / Progress Tools UI | first-run tests | UX polish | P2 | Reset/export/import are parked tools |
| Merch | Secret merch lower priority | Implemented | merch sections below first flow | first-run tests | Merch copy/product URLs later | P3 | Does not imply verification by partner |
| CTA | One dominant CTA | Implemented | Next Best Action card, primary button styling | next-best-action tests | Mobile polish | P1 | No in-drive CTA clutter |

## Delivery Simulator

| Area | Requirement / Feature | Status | Evidence / Files | Tests | Remaining Work | Priority | Safety / Privacy Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Simulator | Hidden by default | Implemented | `isSimulatorEnabled`, `renderSimulatorPanel` | `testDeliverySimulatorIsHiddenLocalAndSummarized` | None | P2 | Not exposed to normal users |
| Simulator | Enabled with `?simulator=1` | Implemented | query check in `isSimulatorEnabled` | simulator tests | None | P2 | Local QA only |
| Simulator | `localStorage` flag | Implemented | `SIMULATOR_LOCAL_STORAGE_KEY` | simulator tests | Optional settings toggle later | P3 | Local QA only |
| Simulator | No sensors/geolocation | Implemented | `applySimulatedDelivery`, no permission calls | simulator tests | Continue regression coverage | P0 | Desktop QA safe |
| Simulator | Scenarios | Implemented | `SIMULATOR_SCENARIOS` | simulator tests | Add edge cases | P2 | Summaries only |
| Simulator | `simulated: true` | Implemented | `buildSimulatedSessionSummary` | simulator tests | None | P1 | Results labeled |
| Simulator | `mode: simulated` | Implemented | `buildSimulatedSessionSummary` | simulator tests | None | P1 | Distinguished from real runs |
| Simulator | Local QA rewards | Implemented | `applySimulatedDelivery`, local state update | simulator tests | Balance/sandbox controls | P2 | Local-only progress |
| Simulator | Excluded from trusted merch verification | Partial | `simulatorExcludeMerch`, docs | simulator merch tests | Future backend must reject simulated sessions | P0 | Local state is not trusted verification |
| Simulator | Simulated share labeling | Implemented | `buildDeliverySharePayload`, `buildShareCardData` | simulator/share tests | Continue regression coverage | P1 | Share says simulated/practice |
| Simulator | Back to Simulator navigation | Implemented | `back-simulator-button`, `returnToDashboard("simulator")` | `testPostRunNavigationReturnsToUpdatedDashboard` | Mobile scroll polish | P2 | Simulator remains hidden unless enabled |

## Sharing / Community / Merch

| Area | Requirement / Feature | Status | Evidence / Files | Tests | Remaining Work | Priority | Safety / Privacy Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sharing | `SHARE_CONFIG` | Implemented | `SHARE_CONFIG`, `normalizedShareConfig` | `testShareConfigAndCardData` | Configure app URL later if desired | P2 | Defaults privacy-safe |
| Sharing | App link hidden by default | Implemented | `includeAppLink: false` | share tests | None | P1 | No default `/nospill` link |
| Sharing | Exact distance hidden by default | Implemented | `includeDistanceInShare: false` | share tests | None | P1 | Distance private by default |
| Sharing | Excludes speed/GPS/location/map/route/street | Implemented | `sanitizeShareOutput`, share builders | share tests | Continue regression coverage | P0 | No sensitive public details |
| Sharing | Simulated/practice share labeling | Implemented | `buildDeliverySharePayload` | simulator/practice share tests | None | P1 | Cannot masquerade as qualified result |
| Merch | `MERCH_LINKS` | Implemented | constants in `app.js` | merch link tests | Add real product URLs when ready | P2 | Locked links hidden |
| Merch | `MERCH_LABELS` | Implemented | constants in `app.js` | merch tests | Tune labels | P3 | Local labels only |
| Merch | Super Cute Collectibles partner copy | Implemented | landing/merch copy, docs | `testSuperCuteCollectiblesLandingAndMerchCopy` | Product URL setup | P2 | Partner does not verify scores |
| Community | Discord hidden by default | Implemented | `DISCORD_CONFIG` default false/null | Discord tests | Enable only with invite URL | P3 | No default community link |
| Community | Discord not shown during active drive | Implemented | `renderDiscordCtas`, active view checks | Discord tests | None | P0 | Parked/community use only |

## Future / Documented Only

| Area | Requirement / Feature | Status | Evidence / Files | Tests | Remaining Work | Priority | Safety / Privacy Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Routes | Fictional route map | Planned | Route cards implemented; map remains in `DESIGN.md` | None | Design fictional map UI | Future | Must remain separate from real-world routing |
| Narrative | Rich delivery reports | Partial | Capped ledger entries implemented | `testExpandedIdleShopLayerMechanics` | Add more authored report variety | P2 | No raw route/street details |
| Economy | 15+ upgrades | Implemented | `SHOP_UPGRADES`, `STATION_UPGRADES`, `GARAGE_UPGRADES`, `LICENSE_PERKS` | `testExpandedIdleShopLayerMechanics` | Balance and display polish | P2 | Avoid vehicle/speed advantage wording |
| Automation | Apprentice auto-driver queue | Partial | Crew counts implemented; assignment queue planned | `testExpandedIdleShopLayerMechanics` | Add timed auto route assignments | Future | Must not encourage extra real driving |
| Mastery | Route mastery expanded system | Partial | coarse fingerprints implemented; expansion in `DESIGN.md` | route mastery tests | Add richer fictional/local mastery | Future | Coarse buckets only |
| Idle | Offline progress expansion | Partial | capped shop idle implemented; expansion in `DESIGN.md` | idle tests | More generators/reporting | Future | No service worker/backend |
| Prestige | Deeper License Exam prestige | Partial | First License Exam and License Perks implemented | `testExpandedIdleShopLayerMechanics` | Tune reset strategy and later exams | Future | Must not improve real driving score |
| Narrative | Story chapters | Documented only | `DESIGN.md` future direction | None | Implement only after core loop polish | Future | Parked-only story |
| Narrative | Customers | Partial | `regular_customer` station implemented | `testExpandedIdleShopLayerMechanics` | Add named customers and reports | Future | No unsafe driving prompts |
| Narrative | Contracts | Documented only | `DESIGN.md` future direction | None | Design safe contracts | Future | No timed/speed contracts |
| Crew | Staff/crew expansion | Partial | cosmetic Delivery Crew implemented; expansion in `DESIGN.md` | collection tests | Add staff roles later | Future | Cosmetic/local only |
| Social | Public profiles | Planned | `DESIGN.md` monetization/status section | None | Requires privacy/account design | Future | No raw route/speed/location |
| Social | Delivery Chronicle | Documented only | `DESIGN.md` monetization/status section | None | Requires moderation/privacy model | Future | Asynchronous, privacy-safe only |
| Social | Garage/crew pages | Documented only | `DESIGN.md` future social status | None | Design profile/showcase | Future | Cosmetic/status only |
| Merch | Backend unlock tokens | Planned | `DESIGN.md`, `DEPLOYMENT.md` merch note | None | Build only after merch demand | P3 | Must reject simulator/local-only fraud |
| Accounts | Optional Sign in with Google | Planned | open question/future account direction | None | Privacy and auth design | Future | Optional only |
| Sync | Database sync | Planned | future backend/account direction | None | Backend design | Future | No raw GPS/motion sync |
| Merch | Shopify gated merch | Planned | `DEPLOYMENT.md`, `MERCH_LINKS` notes | None | Product URLs + backend tokens | P3 | Earned unlocks only |
| Monetization | Supporter/cosmetic purchases | Documented only | `DESIGN.md` monetization section | None | Payment/product strategy | Future | No pay-to-progress |

## Non-Goals / Rejected

| Area | Requirement / Feature | Status | Evidence / Files | Tests | Remaining Work | Priority | Safety / Privacy Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Accounts | Accounts for current MVP | Rejected / Non-goal | `README.md`, `PLAN.md`, `DESIGN.md` | `make check` | Revisit only as optional future | Non-goal | MVP remains local-first |
| Social | Leaderboards | Rejected / Non-goal | `PLAN.md`, `DESIGN.md` | share/no-speed tests | None | Non-goal | Avoids public road competition |
| Privacy | Raw route uploads | Rejected / Non-goal | privacy contract docs | storage/export tests | None | Non-goal | No raw route data |
| Privacy | Real-time location sharing | Rejected / Non-goal | `PLAN.md` | no network/upload tests | None | Non-goal | No live location sharing |
| Payments | Payment flow | Rejected / Non-goal | `PLAN.md`, `README.md` | `make check` | Future ethical cosmetics only | Non-goal | No payments in MVP |
| Monetization | Pay-to-progress | Rejected / Non-goal | `DESIGN.md` monetization section | None | None | Non-goal | Earned achievements keep meaning |
| Monetization | Paid speed/score boosts | Rejected / Non-goal | `DESIGN.md` monetization section | speed reward tests | None | Non-goal | No driving advantage |
| Monetization | Loot boxes | Rejected / Non-goal | `DESIGN.md` monetization section | None | None | Non-goal | Avoid predatory monetization |
| Ads | Intrusive active-drive ads | Rejected / Non-goal | `DESIGN.md` monetization section | active-drive tests | None | Non-goal | No distraction during drive |
| Claims | Safety certification claims | Rejected / Non-goal | `AGENTS.md`, `PLAN.md` | docs review | None | Non-goal | No legal/insurance/certification claims |
| Community | Driver shaming/reporting system | Rejected / Non-goal | `DESIGN.md`, Discord rules | Discord/share tests | None | Non-goal | No public accusation/report flow |
| Privacy | License plate collection | Rejected / Non-goal | `DESIGN.md` safety/social guardrails | no upload tests | None | Non-goal | No incident evidence collection |

## Next Build Candidates

Ranked by safest value:

1. QA / polish / mobile testing.
2. Result-screen visual polish.
3. Delivery report flavor text.
4. One fictional route prototype.
5. One more shop generator beyond Tofu Press and Prep Counter.
6. Better simulator scenarios.
7. Production asset cleanup.
8. Backend unlock tokens only after real merch demand.

## How To Update This File

- Update this file after every feature commit.
- If a feature is implemented, include file and test evidence.
- If a feature is future-only, mark `Documented only`.
- If a feature is intentionally out of scope, mark `Rejected / Non-goal`.
- Use `Partial` when a thin version exists but the documented design calls for more.
- Use `Planned` when the repo intentionally points to a future build but no runtime exists yet.
- Do not mark something `Implemented` just because `DESIGN.md` mentions it.
- Keep safety and privacy notes explicit when a feature touches driving, storage, sharing, merch, or community.
