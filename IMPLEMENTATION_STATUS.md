# Tofu Driver Implementation Status

This file maps the Tofu Driver design contract to actual implementation evidence. `DESIGN.md`
contains both implemented behavior and future direction; this file tracks what is real in the repo
today.

Status values: `Implemented`, `Partial`, `Placeholder`, `Decorative only`, `Documented only`,
`Not implemented`, `Non-goal`.

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

## Tofu Shop Current Implementation

| Area | Requirement / Feature | Status | Evidence / Files | Tests | Remaining Work | Priority | Safety / Privacy Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Shop | Tofu Stock | Implemented | `shop.tofuStock`, shop UI | `testTofuShopStatePackIdleAndUpgradeRules` | Balance tuning | P2 | Local summarized resource |
| Shop | Tofu Shop home surface | Implemented | dashboard/shop sections tagged `data-app-surface="shop"`; `#/shop` route | `testTwoSurfaceRoutingSeparatesShopAndCupTest` | Mobile hierarchy polish | P1 | Playable at home without sensors/location |
| Shop | Delivery Orders | Implemented | `shop.deliveryOrders`, `generatorCarry.deliveryOrders`, ready-order UI, Prep Counter progress bar, `applyShopGeneratorTick` | `testTofuShopStatePackIdleAndUpgradeRules`, `testFractionalDeliveryOrdersShowPrepProgressNotRawDecimal` | Balance tuning | P2 | Shop resource only; fractional progress is shown as prep progress, not a usable order; prep progress pauses when Tofu Stock is insufficient |
| Shop | Tips | Implemented | `shop.tips`, Fulfill Shop Order rewards | shop/order tests | Balance tuning | P2 | Home shop currency, local-only |
| Shop | Reputation | Implemented | `shop.reputation`, `applyDeliveryToShop` | shop reward tests | Balance tuning | P2 | Comes from shop orders and smooth qualified outcomes |
| Shop | Prep Slots | Implemented | `shop.prepSlots`, `getPrepSlotMax`, station purchase gates | `testExpandedIdleShopLayerMechanics` | Balance regen/costs | P2 | Parked-only capacity, no driving effect |
| Shop | Shop Reach | Implemented | `shop.shopReach`, fictional route rewards | `testExpandedIdleShopLayerMechanics` | Route unlock tuning | P2 | Fictional districts only, no GPS/routes |
| Shop | Shop Spirit | Implemented | `shop.shopSpirit`, spirit generators and boosts | `testExpandedIdleShopLayerMechanics` | Boost balance | P2 | Parked-only boosts; no Cup Test scoring effect |
| Shop | Cup Stability XP | Implemented | `shop.cupStabilityXP`, Training drills | `testExpandedIdleShopLayerMechanics` | UI polish | P3 | Fictional/home training, no sensors |
| Shop | Route Knowledge | Implemented | `shop.routeKnowledge`, route card rewards | `testExpandedIdleShopLayerMechanics` | Balance tuning | P3 | Fictional route knowledge only |
| Prestige | License Stars | Implemented | `shop.licenseStars`, License Exam and perks | `testExpandedIdleShopLayerMechanics` | Prestige balance | P2 | Permanent local prestige, no real driving score effect |
| Shop | Shop Level | Implemented | `getShopLevel`, shop UI | shop level tests | Balance tuning | P2 | Does not affect real driving score |
| Shop | Pack Tofu | Implemented | `packTofu`, `handlePackTofu`, backup-action copy in shop UI | `testTofuShopStatePackIdleAndUpgradeRules`, `testEarlyShopResourceFunnelMakesTipsObvious` | UX tuning | P2 | Parked-only, disabled during drive; backup Tofu Stock action rather than main money action |
| Shop | Fulfill Shop Order | Implemented | `fulfillShopOrder`, `fulfillShopOrders`, `handleFulfillShopOrder`, Overview order cards | `testTofuShopStatePackIdleAndUpgradeRules`, `testEarlyShopResourceFunnelMakesTipsObvious` | Inline feedback polish | P1 | Parked-only home action, no sensors/geolocation; converts Delivery Orders into Tips/Reputation/XP |
| Shop | Order-size ladder | Implemented | `SHOP_ORDER_TYPES`, `shopOrderTypeUnlocked`, typed `fulfillShopOrders`, typed Overview order cards | `testShopOrderTypeProgressionAndRewards` | Tune unlock timing and mobile card density; keep Catering Crate and larger network orders hidden/future | P1 | Simple Tofu Box, Family Tofu Tray, and Festival Bento consume 6/24/75 Tofu Stock respectively; raw stock does not directly multiply Tips |
| Shop | Full progression design contract | Documented only | `BALANCE_AND_PROGRESSION.md` design summary, resource economy, order-type ladder, cascading production ladder, station detail cards, button inventory, upgrade ladder, timing targets, plateau rules, milestone boosts, reveal rules, License Exam design, implementation slices, balance sheet schema | `git diff --check` for doc pass | Playtest and tune the First Loop Contract before expanding advanced systems | P0 | Documents that Cup Test is optional and shop progression must not use speed/GPS/map/street/high-G data |
| Shop | First-loop balance contract | Implemented | Fresh state starts with 10 Tofu Stock, 1 ready Delivery Order, 1 Tofu Press, 1 Prep Counter; Simple Tofu Box tutorial order; First Shop Order stamp reveal; Tidy Packaging is the first relevant Prep Counter upgrade when order prep is the bottleneck; Steady Pressing is stock-bottleneck-specific | `testShopOrderTypeProgressionAndRewards`, `testNextBestActionHierarchyStaysSinglePrimary`, `testTofuShopGeneratorUpgradeUiIsHonestAndProgressive`, `testFractionalDeliveryOrdersShowPrepProgressNotRawDecimal` | Playtest exact timing and mobile density | P0 | Ordinary shop progression must not require real driving |
| Shop | First-loop audit fixes | Implemented | `FIRST_LOOP_AUDIT.md`, `visibleRelevantStationUpgrades`, `stationUpgradePreviewText`, `nextBestAction`, reward fallback formatting | `testTofuShopGeneratorUpgradeUiIsHonestAndProgressive`, `testFractionalDeliveryOrdersShowPrepProgressNotRawDecimal`, `testShopRecentRewardUsesSafeFallbackLabel` | Playtest the first 10 minutes against real sessions | P0 | Keeps shop tuning parked/local and does not touch Cup Test scoring or speed behavior |
| Shop | Core Game Spine V1 | Implemented | `CORE_GAME_SPINE_AUDIT.md`, milestone stamp awards, Delivery Shelf support, Shop Sign reputation support | `testCoreGameSpineV1MilestonesAndSupportStations` | Playtest 5-10 minute pacing and tune costs/reveals | P0 | Parked-only shop spine; Regular Customers, Dream Garage, Routes, Spirit, Rivals, and License prestige remain deferred |
| Shop | First-loop Overview focus | Implemented | `renderOverviewPanel`, shared order/prep rendering helpers, milestone-based `SHOP_TABS` unlock helpers | `testEarlyShopResourceFunnelMakesTipsObvious`, `testTofuShopGeneratorUpgradeUiIsHonestAndProgressive`, `testFractionalDeliveryOrdersShowPrepProgressNotRawDecimal` | Continue mobile layout QA and first-session playtesting | P0 | Overview carries order cards and prep progress while Cup Test stays optional |
| Passport | First Stamp Fanfare | Implemented | `seenStampFanfareIds`, `buildStampFanfare`, `showStampFanfare`, stamp fanfare dialog in `index.html`, fanfare CSS | `testFirstStampFanfareCelebratesAndPersists`, `testStampFanfareReducedMotionUsesStaticState` | Visual/audio polish after mobile QA | P0 | Local-only parked/result-screen celebration; repeats suppressed per stamp; active driving suppresses fanfare; muted audio and reduced motion are respected |
| Shop | Discovery Fanfare for Upgrades | Implemented | `seenSystemRevealIds`, `buildDiscoveryFanfare`, `showDiscoveryFanfare`, Upgrades reveal transition in `fulfillShopOrders`, discovery fanfare dialog/CSS | `testDiscoveryFanfareRevealsUpgradesOnce`, `testDiscoveryFanfareReducedMotionUsesStaticState` | Use the pattern for future systems only after first-loop tuning | P0 | Local-only parked/result-screen system reveal; repeats suppressed per system id; active driving suppresses reveal; no future roadmap dump |
| Results | Inline shop-order fulfillment | Implemented | `showShopOrderInlineResult`, `shop-inline-result`, Overview order cards | `testShopOrderFulfillmentStaysInlineAndKeepsFanfare`, shop/order tests | Visual polish | P1 | Normal parked shop orders update resources inline; first stamp and discovery fanfares remain special; Cup Test still uses the full result screen |
| Shop | Live generator ticking | Implemented | `tickOpenShopGenerators`, `applyShopGeneratorTick`, fractional `generatorCarry`, per-second shop rate labels, order-prep ETA/progress bar | `testTofuShopStatePackIdleAndUpgradeRules`, `testLiveIdleTickAndShopButtonReliability`, `testFractionalDeliveryOrdersShowPrepProgressNotRawDecimal` | Mobile pacing QA | P1 | Ticks locally every 1s while parked/open, saves periodically, no backend timer |
| Shop | Resource-funnel clarity | Implemented | `nextBestAction`, `currentBottleneck`, `tofuStockRunway`, Overview reward/prep/runway copy, Tip-source disabled reasons, early stock-purpose copy | `testEarlyShopResourceFunnelMakesTipsObvious`, `testFractionalDeliveryOrdersShowPrepProgressNotRawDecimal`, `testTofuStockRunwayGuidesEarlyPurchases` | Continue first-session visual QA | P0 | Prioritizes order fulfillment, stock runway, and Prep Counter/Tidy Packaging bottlenecks over optional Cup Test; Tofu Stock is an input/runway/order-size resource, not the purchase currency, and bulk fulfillment is stock-limited |
| Shop | Compact number formatting | Implemented | `formatCompactNumber`, `formatShopBalance`, `formatShopCost`, shop resource/cost/reward rendering | `testCompactTofuShopNumberFormatting` | Tune exact suffix precision if playtesting calls for it | P1 | Display-only; internal values remain exact and local |
| Shop | Immediate button feedback and disabled reasons | Implemented | `currentGameState`, `handleTofuShopPanelClick`, `actionButton` disabled reasons, station/upgrade disabled-reason helpers | `testLiveIdleTickAndShopButtonReliability`, `testTofuShopGeneratorUpgradeUiIsHonestAndProgressive`, `testEarlyShopResourceFunnelMakesTipsObvious`, shop action tests | Continue per-panel UX QA | P1 | Wired actions save/render immediately; locked/decorative controls are disabled with reasons |
| Shop | Tabbed idle panels | Partial | `SHOP_TABS`, `renderShopTabs`, `shop-tab-panel`, scoped panel renderers, milestone reveal helpers | `testTofuShopGeneratorUpgradeUiIsHonestAndProgressive`, `testExpandedIdleShopLayerMechanics`, `testShopOrderFulfillmentStaysInlineAndKeepsFanfare` | Continue phase-based reveal tuning after first-loop playtesting | P1 | Orders tab is removed; advanced panels are hidden until meaningful milestones; raw idle accumulation alone does not expose Routes/Garage/Spirit/Rivals/License; Production owns station controls, Upgrades owns upgrade controls, and Passport/Ledger/Settings do not inherit production sections |
| Shop | Buy multiplier controls | Implemented | `shop-buy-multiplier`, `buyShopStation`, `Buy Max <station>` station buttons | `testExpandedIdleShopLayerMechanics`, `testTofuShopGeneratorUpgradeUiIsHonestAndProgressive` | Add per-card ETA later | P2 | Reduces repetitive clicking |
| Shop | Cascading station catalog | Partial | `SHOP_STATIONS`, `buyShopStation`, `getShopGeneratorRates` | `testExpandedIdleShopLayerMechanics` | More balancing and station-specific visuals | P1 | Tofu shop language only |
| Shop | Capped idle production | Implemented | `calculateOfflineShopEarnings`, cap constants | idle production tests, `testLiveIdleTickAndShopButtonReliability` | Balance tuning | P2 | Applies elapsed time once on load, then live ticking continues; no reputation |
| Generator | Tofu Press station | Implemented | `SHOP_STATIONS`, `buyShopStation`, `renderShopGeneratorCard`, `getShopGeneratorRates`, stock-runway helper copy | `testLiveIdleTickAndShopButtonReliability`, `testTofuShopGeneratorUpgradeUiIsHonestAndProgressive`, `testTofuStockRunwayGuidesEarlyPurchases` | Balance tuning | P1 | Produces Tofu Stock only; down-ranked when stock runway is healthy; station ownership is separate from upgrade levels |
| Generator | Prep Counter station | Implemented | `SHOP_STATIONS`, `buyShopStation`, `renderShopGeneratorCard`, `getShopGeneratorRates`, Prep Counter bottleneck copy | `testLiveIdleTickAndShopButtonReliability`, `testTofuShopGeneratorUpgradeUiIsHonestAndProgressive`, `testTofuStockRunwayGuidesEarlyPurchases` | Balance tuning | P1 | Converts Tofu Stock to Delivery Orders; highlighted when stock is healthy and order prep is the bottleneck; station ownership is separate from upgrade levels |
| Generator | Delivery Shelf station | Implemented | `SHOP_STATIONS.delivery_shelf`, milestone unlocks, `getShopGeneratorRates` shelf boost | `testCoreGameSpineV1MilestonesAndSupportStations` | Tune first purchase timing | P1 | First support station; boosts Prep Counter only, no driving effect |
| Generator | Shop Sign station | Implemented | `SHOP_STATIONS.shop_sign`, milestone unlocks, shop-order Reputation multiplier | `testCoreGameSpineV1MilestonesAndSupportStations` | Tune Reputation pacing | P1 | First Reputation support station; does not reveal real routes or affect Cup Test scoring |
| Upgrade | Steady Pressing / Double Mold | Implemented | `STATION_UPGRADES`, `buyStationUpgrade`, `renderStationUpgradeCard`, `stationUpgradePreviewText` | `testExpandedIdleShopLayerMechanics`, `testTofuShopGeneratorUpgradeUiIsHonestAndProgressive` | Balance timing against stock-runway states | P1 | Tofu Press modifiers only, recommended when stock runway is low/relevant; no driving effect |
| Upgrade | Tidy Packaging / Double Labels | Implemented | `STATION_UPGRADES`, `buyStationUpgrade`, `renderStationUpgradeCard`, `stationUpgradePreviewText` | `testExpandedIdleShopLayerMechanics`, `testTofuShopGeneratorUpgradeUiIsHonestAndProgressive` | Tune exact first-upgrade timing after playtest | P1 | Prep Counter modifiers only; Tidy Packaging costs 20 Tips, appears for the order-prep bottleneck, and shows before/after order-prep rate; no driving effect |
| Upgrade | Better Boxes | Partial | Legacy `SHOP_UPGRADES`, delivery-to-shop reward modifier | shop reward tests | Keep hidden until intended reveal or migrate to Tips-based early ladder | P3 | Packaging language, no vehicle advantage |
| Upgrade | Legacy Shop Sign upgrade | Partial | Legacy `SHOP_UPGRADES.shop_sign` only | shop reward tests | Keep hidden or migrate/remove after station ladder settles | P3 | Presentation/reputation only |
| Shop | Delivery Wall shelf | Non-goal | Visible shelf removed from `index.html`; `renderDeliveryWall` is compatibility no-op | `testUnlockShelvesStayOutOfMainShopUi` | Surface rewards through Passport/results instead | P3 | Avoids exposing a full unlock checklist |
| Shop | Shop rewards after delivery | Implemented | `applyDeliveryToShop`, result grid | shop reward tests | Balance tuning | P1 | Speed does not affect rewards |
| Certified | Certified Cup Test boosts | Implemented | `applyDeliveryToShop`, `certifiedBoost`, active shop boost | speed/shop reward tests | Balance tuning | P1 | Qualified non-simulated sessions only; speed does not scale boost |
| Unlocks | Shop vs Certified unlock tracks | Partial | Internal merch/progress state and result summaries | share/result/merch tests | Keep visible roadmap shelves hidden; reveal rewards through stamps/results | P2 | Avoids real/fake wording and keeps certified progress separate |
| Shop | Parked-only shop actions | Implemented | active-drive gates in shop handlers/rendering | active-drive tests | Real mobile testing | P0 | No in-drive shop actions |
| Routes | Fictional Delivery Routes | Placeholder | `SHOP_ROUTE_CATALOG`, `completeFictionalRoute`, Routes panel | `testExpandedIdleShopLayerMechanics` | Keep hidden/teased until first loop is fun; add timed route queues and richer reports later | P2 | Fictional cards, not real-road instructions |
| Training | Training Lot drills | Implemented | `TRAINING_DRILLS`, `runTrainingDrill`, Training panel | `testExpandedIdleShopLayerMechanics` | Add more drills | P3 | Parked/home only |
| Garage | Fictional garage upgrades | Implemented | `GARAGE_UPGRADES`, `buyGarageUpgrade`, Garage panel | `testExpandedIdleShopLayerMechanics` | Balance/cosmetic art | P3 | Does not affect real Cup Test scoring |
| Crew | Delivery Crew automation counts | Placeholder | `CREW_ROLES`, `hireCrewRole`, Crew panel | `testExpandedIdleShopLayerMechanics` | Add actual route assignment queues after manual loop is understood | P2 | Fictional/home automation only |
| Spirit | Shop Spirit and Festival Boosts | Placeholder | `SPIRIT_GENERATORS`, `SHOP_SPIRIT_BOOSTS`, `FESTIVAL_BOOSTS`, `useShopSpiritBoost`, `useFestivalBoost` | `testExpandedIdleShopLayerMechanics` | Keep hidden/teased until stable production; add token earning rules later | P2 | Parked-only; no real driving score effect |
| Prestige | License Exam and perks | Placeholder | `licenseExamStatus`, `takeLicenseExam`, `LICENSE_PERKS` | `testExpandedIdleShopLayerMechanics` | Target first exam at 4-6 hours or 2-3 sessions; tune requirements/reset | P2 | First prestige must not require real driving |
| Rivals | Rival Shop Challenges | Placeholder | `RIVAL_CHALLENGES`, `startRivalChallenge`, Rivals panel | `testExpandedIdleShopLayerMechanics` | Keep hidden/teased until after core loop and route loop work | P3 | Friendly shop challenge copy only |
| Passport | Expanded shop/passport stamps | Partial | `STAMP_LABELS`, first-order stamp result feedback, core-spine stamps, compact Overview teaser, progressive Passport panel | `testExpandedIdleShopLayerMechanics`, `testTofuShopGeneratorUpgradeUiIsHonestAndProgressive`, `testShopOrderTypeProgressionAndRewards`, `testCoreGameSpineV1MilestonesAndSupportStations` | Category filters and details after first-loop tuning | P3 | Local-only achievements; core spine includes First Upgrade Purchased, First Family Tofu Tray, First 10 Orders, and First 100 Tips without dumping the full catalog |
| Ledger | Delivery Ledger | Implemented | `shop.ledger`, `addLedgerEntry`, milestone-gated Ledger panel | `testExpandedIdleShopLayerMechanics`, `testTofuShopGeneratorUpgradeUiIsHonestAndProgressive` | Clear/filter UI later | P2 | Capped summaries only; not prominent during the first loop |
| Dev QA | Unlock All Local QA | Implemented | `isDevToolsEnabled`, `unlockAllLocalQa`, Settings `Developer Tools` section | `testSettingsTabConsolidatesProgressToolsAndHidesQaByDefault`, `testExpandedIdleShopLayerMechanics` | Add explicit UI reset confirmation | P3 | Hidden unless dev mode is enabled; marks local state untrusted |

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
| Settings | Progress tools moved to Settings | Implemented | `renderShopSettingsPanel`, Settings `Progress Tools` section | `testSettingsTabConsolidatesProgressToolsAndHidesQaByDefault` | UX polish | P2 | Reset/export/import are parked tools; no normal-user QA copy |
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
| Routes | Fictional route map | Documented only | Route cards implemented; map remains in `DESIGN.md` | None | Design fictional map UI | Future | Must remain separate from real-world routing |
| Narrative | Rich delivery reports | Partial | Capped ledger entries implemented | `testExpandedIdleShopLayerMechanics` | Add more authored report variety | P2 | No raw route/street details |
| Economy | 15+ upgrades | Implemented | `SHOP_UPGRADES`, `STATION_UPGRADES`, `GARAGE_UPGRADES`, `LICENSE_PERKS` | `testExpandedIdleShopLayerMechanics` | Balance and display polish | P2 | Avoid vehicle/speed advantage wording |
| Automation | Apprentice auto-driver queue | Partial | Crew counts implemented; assignment queue planned | `testExpandedIdleShopLayerMechanics` | Add timed auto route assignments | Future | Must not encourage extra real driving |
| Mastery | Route mastery expanded system | Partial | coarse fingerprints implemented; expansion in `DESIGN.md` | route mastery tests | Add richer fictional/local mastery | Future | Coarse buckets only |
| Idle | Offline progress expansion | Partial | capped shop idle implemented; expansion in `DESIGN.md` | idle tests | More generators/reporting | Future | No service worker/backend |
| Prestige | Deeper License Exam prestige | Partial | First License Exam and License Perks implemented | `testExpandedIdleShopLayerMechanics` | Tune reset strategy and later exams | Future | Must not improve real driving score |
| External study | dopewars mechanics audit | Documented only | `EXTERNAL_REFERENCE_DOPEWARS_AUDIT.md` | `git diff --check` | Use only as future design reference; do not copy GPL source, data, assets, comments, or theme | Future | Translates abstract mechanics into safe/local Tofu Driver concepts |
| Economy | Tofu Demand Board | Documented only | `EXTERNAL_REFERENCE_DOPEWARS_AUDIT.md` | None | Consider only after First Loop Contract and first 10 minutes are tuned | Future | Fictional/local demand only; no real locations |
| Economy | Supplier Market | Documented only | `EXTERNAL_REFERENCE_DOPEWARS_AUDIT.md` | None | Design after order types and first-shop balance are stable | Future | No real suppliers, network calls, or backend |
| Economy | Customer Rush Events / Daily Opportunity Cards | Documented only | `EXTERNAL_REFERENCE_DOPEWARS_AUDIT.md` | None | Keep optional and forgiving if implemented later | Future | Parked-only; no in-drive prompts or speed pressure |
| Dream Garage | Dream Garage concept | Documented only | `DESIGN.md`, `BALANCE_AND_PROGRESSION.md` | None | Implement only after First Loop Contract and first-shop pacing are stable | Future | Future project-car fantasy is parked/game-only |
| Dream Garage | Garage Parts Market | Documented only | `EXTERNAL_REFERENCE_DOPEWARS_AUDIT.md` | None | Design only after Dream Garage Stage 0 is scoped | Future | No real mechanical advice; no real driving score effects |
| Dream Garage | Project car stages | Documented only | `BALANCE_AND_PROGRESSION.md` Stage 0-3 design | None | Add state/UI/tests in a future slice | Future | Fictional parts must not affect real Cup Test scoring or qualification |
| Dream Garage | Garage part categories | Documented only | `BALANCE_AND_PROGRESSION.md` upgrade category table | None | Convert to data catalog later | Future | Not real-world mechanical advice |
| Dream Garage | Fictional closed-course events | Documented only | `BALANCE_AND_PROGRESSION.md` event table | None | Add async parked event loop later | Future | No real driving, speed, GPS, maps, streets, route traces, or high-G data |
| Dream Garage | Project car completion/sale prestige | Documented only | `BALANCE_AND_PROGRESSION.md` Builder Stars design | None | Validate after garage loop is fun | Future | Separate from License Stars; no driving advantage |
| Dream Garage | Dream Jar / Garage Fund | Documented only | `BALANCE_AND_PROGRESSION.md` open design decision | None | Decide Tips-direct versus saved-fund UX | Future | Tips remain local shop currency; no payments |
| Narrative | Story chapters | Documented only | `DESIGN.md` future direction | None | Implement only after core loop polish | Future | Parked-only story |
| Narrative | Customers | Partial | `regular_customer` station implemented | `testExpandedIdleShopLayerMechanics` | Add named customers and reports | Future | No unsafe driving prompts |
| Narrative | Contracts | Documented only | `DESIGN.md` future direction | None | Design safe contracts | Future | No timed/speed contracts |
| Crew | Staff/crew expansion | Partial | cosmetic Delivery Crew implemented; expansion in `DESIGN.md` | collection tests | Add staff roles later | Future | Cosmetic/local only |
| Social | Public profiles | Documented only | `DESIGN.md` monetization/status section | None | Requires privacy/account design | Future | No raw route/speed/location |
| Social | Delivery Chronicle | Documented only | `DESIGN.md` monetization/status section | None | Requires moderation/privacy model | Future | Asynchronous, privacy-safe only |
| Social | Garage/crew pages | Documented only | `DESIGN.md` future social status | None | Design profile/showcase | Future | Cosmetic/status only |
| Merch | Backend unlock tokens | Documented only | `DESIGN.md`, `DEPLOYMENT.md` merch note | None | Build only after real merch demand | P3 | Must reject simulator/local-only fraud |
| Accounts | Optional Sign in with Google | Documented only | open question/future account direction | None | Privacy and auth design | Future | Optional only |
| Sync | Database sync | Documented only | future backend/account direction | None | Backend design | Future | No raw GPS/motion sync |
| Merch | Shopify gated merch | Documented only | `DEPLOYMENT.md`, `MERCH_LINKS` notes | None | Product URLs + backend tokens | P3 | Earned unlocks only |
| Monetization | Supporter/cosmetic purchases | Documented only | `DESIGN.md` monetization section | None | Payment/product strategy | Future | No pay-to-progress |

## Non-Goals

| Area | Requirement / Feature | Status | Evidence / Files | Tests | Remaining Work | Priority | Safety / Privacy Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Accounts | Accounts for current MVP | Non-goal | `README.md`, `PLAN.md`, `DESIGN.md` | `make check` | Revisit only as optional future | Non-goal | MVP remains local-first |
| Social | Leaderboards | Non-goal | `PLAN.md`, `DESIGN.md` | share/no-speed tests | None | Non-goal | Avoids public road competition |
| Privacy | Raw route uploads | Non-goal | privacy contract docs | storage/export tests | None | Non-goal | No raw route data |
| Privacy | Real-time location sharing | Non-goal | `PLAN.md` | no network/upload tests | None | Non-goal | No live location sharing |
| Payments | Payment flow | Non-goal | `PLAN.md`, `README.md` | `make check` | Future ethical cosmetics only | Non-goal | No payments in MVP |
| Monetization | Pay-to-progress | Non-goal | `DESIGN.md` monetization section | None | None | Non-goal | Earned achievements keep meaning |
| Monetization | Paid speed/score boosts | Non-goal | `DESIGN.md` monetization section | speed reward tests | None | Non-goal | No driving advantage |
| Monetization | Loot boxes | Non-goal | `DESIGN.md` monetization section | None | None | Non-goal | Avoid predatory monetization |
| Ads | Intrusive active-drive ads | Non-goal | `DESIGN.md` monetization section | active-drive tests | None | Non-goal | No distraction during drive |
| Claims | Safety certification claims | Non-goal | `AGENTS.md`, `PLAN.md` | docs review | None | Non-goal | No legal/insurance/certification claims |
| Community | Driver shaming/reporting system | Non-goal | `DESIGN.md`, Discord rules | Discord/share tests | None | Non-goal | No public accusation/report flow |
| Privacy | License plate collection | Non-goal | `DESIGN.md` safety/social guardrails | no upload tests | None | Non-goal | No incident evidence collection |

## How To Update This File

- Update this file after every feature commit.
- If a feature is implemented, include file and test evidence.
- If a feature is future-only, mark `Documented only`.
- If a feature is intentionally out of scope, mark `Non-goal`.
- Use `Partial` when a thin version exists but the documented design calls for more.
- Use `Documented only` when the repo intentionally points to a future build but no runtime exists
  yet.
- Do not mark something `Implemented` just because `DESIGN.md` mentions it.
- Keep safety and privacy notes explicit when a feature touches driving, storage, sharing, merch, or community.
