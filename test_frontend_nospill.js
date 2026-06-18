const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const NOSPILL_DIR = path.join(ROOT, 'frontend', 'nospill');
const NOSPILL_IMAGES_DIR = path.join(NOSPILL_DIR, 'images');
const NOSPILL_JS = path.join(NOSPILL_DIR, 'app.js');
const NOSPILL_CSS = path.join(NOSPILL_DIR, 'app.css');
const NOSPILL_HTML = path.join(NOSPILL_DIR, 'index.html');
const TEST_GREP = process.env.TEST_GREP || "";
const TEST_PROGRESS = process.env.TEST_PROGRESS !== "0";
const TEST_SLOW_MS = Number(process.env.TEST_SLOW_MS || 1000);
const TEST_TRACE_CONTEXT = process.env.TEST_TRACE_CONTEXT === "1";
let cachedNoSpillSource = null;
let cachedNoSpillAppScript = null;

function readNoSpillSource() {
  if (cachedNoSpillSource === null) {
    cachedNoSpillSource = fs.readFileSync(NOSPILL_JS, 'utf8');
  }
  return cachedNoSpillSource;
}

function noSpillAppScript() {
  if (cachedNoSpillAppScript === null) {
    cachedNoSpillAppScript = new vm.Script(readNoSpillSource(), { filename: 'app.js' });
  }
  return cachedNoSpillAppScript;
}

function walkFiles(dir) {
  const skippedDirs = new Set([
    '.git',
    '.venv',
    '__pycache__',
    'node_modules',
    'tcgcsv',
  ]);
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skippedDirs.has(entry.name)) return [];
      return walkFiles(entryPath);
    }
    return [entryPath];
  });
}

function loadNoSpillContext(options = {}) {
  const started = Date.now();
  const context = {
    console,
    window: options.window || {},
  };
  if (options.navigator) context.navigator = options.navigator;
  if (options.document) context.document = options.document;
  if (options.URLSearchParams) context.URLSearchParams = options.URLSearchParams;
  vm.createContext(context);
  const createdAt = Date.now();
  noSpillAppScript().runInContext(context);
  const appLoadedAt = Date.now();
  vm.runInContext(
    `globalThis.rankForWater = rankForWater;
globalThis.computeWaterLoss = computeWaterLoss;
globalThis.computeAudioTargetGain = computeAudioTargetGain;
globalThis.normalizeAudioLevel = normalizeAudioLevel;
globalThis.mapAccelerationToVehicle = mapAccelerationToVehicle;
globalThis.computeMappedMotion = computeMappedMotion;
globalThis.updateTofuCargoVisualState = updateTofuCargoVisualState;
globalThis.defaultTofuVisualState = defaultTofuVisualState;
globalThis.normalizeCargoTypeId = normalizeCargoTypeId;
globalThis.cargoTypeProfile = cargoTypeProfile;
globalThis.formatTripDuration = formatTripDuration;
globalThis.summarizeDriveShape = summarizeDriveShape;
globalThis.appendCupTrailPoint = appendCupTrailPoint;
globalThis.cupTrailPath = cupTrailPath;
globalThis.renderCupTrail = renderCupTrail;
globalThis.dailyDeliveryCredit = dailyDeliveryCredit;
globalThis.createCoachAccumulator = createCoachAccumulator;
globalThis.updateCoachAccumulator = updateCoachAccumulator;
globalThis.summarizeCoachRecap = summarizeCoachRecap;
globalThis.classifyBrakeFeather = classifyBrakeFeather;
globalThis.classifyDecelControl = classifyDecelControl;
globalThis.classifyTransitionSmoothness = classifyTransitionSmoothness;
globalThis.classifyPassengerComfort = classifyPassengerComfort;
globalThis.classifySmoothHands = classifySmoothHands;
globalThis.classifyCargoBalance = classifyCargoBalance;
globalThis.classifyConsistency = classifyConsistency;
globalThis.renderCoachRecap = renderCoachRecap;
globalThis.applyDailyDeliveryCredit = applyDailyDeliveryCredit;
globalThis.analyzeRoute = analyzeRoute;
globalThis.qualificationForRoute = qualificationForRoute;
globalThis.getDailyDelivery = getDailyDelivery;
globalThis.getDriverLicense = getDriverLicense;
globalThis.classifyRouteType = classifyRouteType;
globalThis.calculateCargoCondition = calculateCargoCondition;
globalThis.isValidPracticeSession = isValidPracticeSession;
globalThis.displayRankForSession = displayRankForSession;
globalThis.evaluateCargoMission = evaluateCargoMission;
globalThis.evaluateDailyDelivery = evaluateDailyDelivery;
globalThis.calculateDeliveryRewards = calculateDeliveryRewards;
globalThis.awardSkillXP = awardSkillXP;
globalThis.buildCoachRecap = buildCoachRecap;
globalThis.deliveryPassportSummary = deliveryPassportSummary;
globalThis.updateMerchProgress = updateMerchProgress;
globalThis.updateCommuteMastery = updateCommuteMastery;
globalThis.normalizeGameState = normalizeGameState;
globalThis.getShopLevel = getShopLevel;
globalThis.getShopUpgradeCatalog = getShopUpgradeCatalog;
globalThis.getShopProductionRate = getShopProductionRate;
globalThis.getShopGeneratorRates = getShopGeneratorRates;
globalThis.stationMilestoneMultiplier = stationMilestoneMultiplier;
globalThis.stationMilestoneText = stationMilestoneText;
globalThis.nextVisibleStationMilestone = nextVisibleStationMilestone;
globalThis.calculateShopGeneratorEarnings = calculateShopGeneratorEarnings;
globalThis.applyShopGeneratorTick = applyShopGeneratorTick;
globalThis.tickOpenShopGenerators = tickOpenShopGenerators;
globalThis.startShopGeneratorTimer = startShopGeneratorTimer;
globalThis.renderLiveShopUpdate = renderLiveShopUpdate;
globalThis.shopRenderSignature = shopRenderSignature;
globalThis.setTextIfChanged = setTextIfChanged;
globalThis.deliveryOrderQueueCapacity = deliveryOrderQueueCapacity;
globalThis.orderPrepProgress = orderPrepProgress;
globalThis.tofuStockRunway = tofuStockRunway;
globalThis.clampPercent = clampPercent;
globalThis.nextMilestoneForShop = nextMilestoneForShop;
globalThis.renderNextMilestoneCard = renderNextMilestoneCard;
globalThis.getShopOrderTypes = getShopOrderTypes;
globalThis.shopOrderTypeUnlocked = shopOrderTypeUnlocked;
globalThis.maxFulfillableShopOrderQuantity = maxFulfillableShopOrderQuantity;
globalThis.bestFulfillableShopOrderType = bestFulfillableShopOrderType;
globalThis.calculateOfflineShopEarnings = calculateOfflineShopEarnings;
globalThis.applyOfflineShopEarnings = applyOfflineShopEarnings;
globalThis.offlineProgressCapHours = offlineProgressCapHours;
globalThis.formatCompactNumber = formatCompactNumber;
globalThis.formatCash = formatCash;
globalThis.formatCashCount = formatCashCount;
globalThis.formatCashBalance = formatCashBalance;
globalThis.formatShopBalance = formatShopBalance;
globalThis.cashBalance = cashBalance;
globalThis.tofuBusinessValue = tofuBusinessValue;
globalThis.netWorthV1 = netWorthV1;
globalThis.netWorthProgress = netWorthProgress;
globalThis.shouldShowNetWorthV1 = shouldShowNetWorthV1;
globalThis.renderNetWorthCard = renderNetWorthCard;
globalThis.brandValueV1 = brandValueV1;
globalThis.nextNetWorthMilestone = nextNetWorthMilestone;
globalThis.netWorthMilestoneReached = netWorthMilestoneReached;
globalThis.syncNetWorthMilestones = syncNetWorthMilestones;
globalThis.renderNetWorthMilestoneCard = renderNetWorthMilestoneCard;
globalThis.projectCarValueV1 = projectCarValueV1;
globalThis.renderProjectCarValueCard = renderProjectCarValueCard;
globalThis.showcaseInterestUnlocked = showcaseInterestUnlocked;
globalThis.showcasePrepStatus = showcasePrepStatus;
globalThis.renderShowcaseInterestCard = renderShowcaseInterestCard;
globalThis.buyShowcasePrep = buyShowcasePrep;
globalThis.sponsorInquiryUnlocked = sponsorInquiryUnlocked;
globalThis.sponsorInquiryAccepted = sponsorInquiryAccepted;
globalThis.sponsorInquiryStatus = sponsorInquiryStatus;
globalThis.renderSponsorInquiryCard = renderSponsorInquiryCard;
globalThis.acceptSponsorInquiry = acceptSponsorInquiry;
globalThis.dreamBuildWheelsLevel = dreamBuildWheelsLevel;
globalThis.dreamBuildExhaustLevel = dreamBuildExhaustLevel;
globalThis.dreamBuildProgressVisible = dreamBuildProgressVisible;
globalThis.dreamBuildProgressSummary = dreamBuildProgressSummary;
globalThis.renderDreamBuildProgressCard = renderDreamBuildProgressCard;
globalThis.nextDreamBuildStep = nextDreamBuildStep;
globalThis.nextDreamBuildWheelsWork = nextDreamBuildWheelsWork;
globalThis.nextDreamBuildExhaustWork = nextDreamBuildExhaustWork;
globalThis.dreamInvestmentTargetVisible = dreamInvestmentTargetVisible;
globalThis.dreamInvestmentTargetProgress = dreamInvestmentTargetProgress;
globalThis.renderDreamInvestmentTargetCard = renderDreamInvestmentTargetCard;
globalThis.dreamInvestmentReturningNote = dreamInvestmentReturningNote;
globalThis.buyDreamBuildWheels = buyDreamBuildWheels;
globalThis.buyDreamBuildWheelsWork = buyDreamBuildWheelsWork;
globalThis.buyDreamBuildExhaust = buyDreamBuildExhaust;
globalThis.addLedgerEntry = addLedgerEntry;
globalThis.packTofu = packTofu;
globalThis.fulfillShopOrder = fulfillShopOrder;
globalThis.fulfillShopOrders = fulfillShopOrders;
globalThis.isCounterServiceUnlocked = isCounterServiceUnlocked;
globalThis.counterServiceOrderType = counterServiceOrderType;
globalThis.counterServiceBatchPreview = counterServiceBatchPreview;
globalThis.counterServiceIntervalSeconds = counterServiceIntervalSeconds;
globalThis.counterServiceBatchSize = counterServiceBatchSize;
globalThis.counterServiceIncomeStatus = counterServiceIncomeStatus;
globalThis.counterServiceProgress = counterServiceProgress;
globalThis.startCounterService = startCounterService;
globalThis.pauseCounterService = pauseCounterService;
globalThis.applyCounterServiceTick = applyCounterServiceTick;
globalThis.buildStampFanfare = buildStampFanfare;
globalThis.showStampFanfare = showStampFanfare;
globalThis.hideStampFanfare = hideStampFanfare;
globalThis.continueFromStampFanfare = continueFromStampFanfare;
globalThis.buildDiscoveryFanfare = buildDiscoveryFanfare;
globalThis.showDiscoveryFanfare = showDiscoveryFanfare;
globalThis.hideDiscoveryFanfare = hideDiscoveryFanfare;
globalThis.continueFromDiscoveryFanfare = continueFromDiscoveryFanfare;
globalThis.viewSystemFromDiscoveryFanfare = viewSystemFromDiscoveryFanfare;
globalThis.clearNewlyRevealedTab = clearNewlyRevealedTab;
globalThis.queueStoryBeatTeaser = queueStoryBeatTeaser;
globalThis.buyShopStation = buyShopStation;
globalThis.buyStationUpgrade = buyStationUpgrade;
globalThis.buyBulkShopItems = buyBulkShopItems;
globalThis.validBulkUpgradeCandidates = validBulkUpgradeCandidates;
globalThis.validBulkStationCandidates = validBulkStationCandidates;
globalThis.affordabilityProgress = affordabilityProgress;
globalThis.upgradeAffordabilityStatus = upgradeAffordabilityStatus;
globalThis.stationAffordabilityStatus = stationAffordabilityStatus;
globalThis.returningPlayerSuggestedActions = returningPlayerSuggestedActions;
globalThis.shopUpgradeById = shopUpgradeById;
globalThis.stationUpgradeCostReputation = stationUpgradeCostReputation;
globalThis.supplierStockPerSecond = supplierStockPerSecond;
globalThis.nextSupplierUpgrade = nextSupplierUpgrade;
globalThis.isManagerDeskUpgrade = isManagerDeskUpgrade;
globalThis.managerDeskUnlocked = managerDeskUnlocked;
globalThis.nextManagerDeskUpgrade = nextManagerDeskUpgrade;
globalThis.wholesalePickupUnlocked = wholesalePickupUnlocked;
globalThis.wholesalePickupQuantity = wholesalePickupQuantity;
globalThis.coveredCarTeaserUnlocked = coveredCarTeaserUnlocked;
globalThis.coveredCarTeaserSeen = coveredCarTeaserSeen;
globalThis.acknowledgeCoveredCarTeaser = acknowledgeCoveredCarTeaser;
globalThis.renderCoveredCarTeaserCard = renderCoveredCarTeaserCard;
globalThis.completeFictionalRoute = completeFictionalRoute;
globalThis.runTrainingDrill = runTrainingDrill;
globalThis.buyGarageUpgrade = buyGarageUpgrade;
globalThis.hireCrewRole = hireCrewRole;
globalThis.buySpiritGenerator = buySpiritGenerator;
globalThis.useShopSpiritBoost = useShopSpiritBoost;
globalThis.shopSpiritInstantAmount = shopSpiritInstantAmount;
globalThis.useFestivalBoost = useFestivalBoost;
globalThis.licenseExamStatus = licenseExamStatus;
globalThis.takeLicenseExam = takeLicenseExam;
globalThis.buyLicensePerk = buyLicensePerk;
globalThis.startRivalChallenge = startRivalChallenge;
globalThis.unlockAllLocalQa = unlockAllLocalQa;
globalThis.isDevToolsEnabled = isDevToolsEnabled;
globalThis.currentBottleneck = currentBottleneck;
globalThis.buyShopUpgrade = buyShopUpgrade;
globalThis.applyDeliveryToShop = applyDeliveryToShop;
globalThis.sanitizeShopStateForExport = sanitizeShopStateForExport;
globalThis.getCharacterCatalog = getCharacterCatalog;
globalThis.CHARACTER_ART_SLOTS = CHARACTER_ART_SLOTS;
globalThis.CHARACTER_ART_MANIFEST = CHARACTER_ART_MANIFEST;
globalThis.getCharacterAsset = getCharacterAsset;
globalThis.renderCharacterCameo = renderCharacterCameo;
globalThis.coachRecapCharacterSlot = coachRecapCharacterSlot;
globalThis.TOFU_SHOP_SCENE_ASSETS = TOFU_SHOP_SCENE_ASSETS;
globalThis.getSceneAsset = getSceneAsset;
globalThis.getTofuShopSceneState = getTofuShopSceneState;
globalThis.getTofuShopSceneLayers = getTofuShopSceneLayers;
globalThis.renderSceneLayer = renderSceneLayer;
globalThis.renderTofuShopLivingScene = renderTofuShopLivingScene;
globalThis.getSoundPackCatalog = getSoundPackCatalog;
globalThis.evaluateCollectionUnlocks = evaluateCollectionUnlocks;
globalThis.selectCharacter = selectCharacter;
globalThis.selectSoundPack = selectSoundPack;
globalThis.selectedCharacter = selectedCharacter;
globalThis.selectedSoundPack = selectedSoundPack;
globalThis.playCosmeticSound = playCosmeticSound;
globalThis.previewSoundPack = previewSoundPack;
globalThis.getSimulatorScenarios = getSimulatorScenarios;
globalThis.buildSimulatedSessionSummary = buildSimulatedSessionSummary;
globalThis.applySimulatedDelivery = applySimulatedDelivery;
globalThis.isSimulatorEnabled = isSimulatorEnabled;
globalThis.renderSimulatorPanel = renderSimulatorPanel;
globalThis.buildDeliverySharePayload = buildDeliverySharePayload;
globalThis.sanitizeShareOutput = sanitizeShareOutput;
globalThis.loadGameState = loadGameState;
globalThis.currentGameState = currentGameState;
globalThis.saveGameState = saveGameState;
globalThis.resetGameState = resetGameState;
globalThis.exportGameProgress = exportGameProgress;
globalThis.importGameProgress = importGameProgress;
globalThis.defaultGameState = defaultGameState;
globalThis.levelProgress = levelProgress;
globalThis.driverShopReputationBonus = driverShopReputationBonus;
globalThis.routeFingerprintForSession = routeFingerprintForSession;
globalThis.buildShareCardData = buildShareCardData;
globalThis.buildShareText = buildShareText;
globalThis.loadClubState = loadClubState;
globalThis.saveClubState = saveClubState;
globalThis.renderMerchPanel = renderMerchPanel;
globalThis.renderDeliveryWall = renderDeliveryWall;
globalThis.renderGameDashboard = renderGameDashboard;
globalThis.renderDeliveryLog = renderDeliveryLog;
globalThis.renderTofuShop = renderTofuShop;
globalThis.handleTofuShopPanelClick = handleTofuShopPanelClick;
globalThis.renderCollectionPanel = renderCollectionPanel;
globalThis.renderShopOrderResult = renderShopOrderResult;
globalThis.renderSummary = renderSummary;
globalThis.renderShopSettingsPanel = renderShopSettingsPanel;
globalThis.progressiveRevealState = progressiveRevealState;
globalThis.nextBestAction = nextBestAction;
globalThis.surfaceFromHash = surfaceFromHash;
globalThis.setAppSurface = setAppSurface;
globalThis.initializeAppSurface = initializeAppSurface;
globalThis.renderSurfaceNavigation = renderSurfaceNavigation;
globalThis.motionSupportStatus = motionSupportStatus;
globalThis.requestMotionPermission = requestMotionPermission;
globalThis.MOTION_SUPPORT_MESSAGES = MOTION_SUPPORT_MESSAGES;
globalThis.startRun = startRun;
globalThis.updateStartReadiness = updateStartReadiness;
globalThis.handleCalibrationTimeout = handleCalibrationTimeout;
globalThis.returnToDashboard = returnToDashboard;
globalThis.takeAnotherCupTest = takeAnotherCupTest;
globalThis.normalizedDiscordConfig = normalizedDiscordConfig;
globalThis.renderDiscordCtas = renderDiscordCtas;
globalThis.APP_BRAND = APP_BRAND;
globalThis.CHALLENGE_NAME = CHALLENGE_NAME;
globalThis.CLUB_NAME = CLUB_NAME;
globalThis.TOP_BADGE = TOP_BADGE;
globalThis.analyticsConfig = analyticsConfig;
globalThis.initAnalytics = initAnalytics;
globalThis.trackEvent = trackEvent;
globalThis.trackRouteView = trackRouteView;
globalThis.setAnalyticsOptOut = setAnalyticsOptOut;
globalThis.sanitizeAnalyticsProperties = sanitizeAnalyticsProperties;
globalThis.safeCampaignProperties = safeCampaignProperties;
globalThis.cargoConditionBucket = cargoConditionBucket;
globalThis.trackCupTestStartedAnalytics = trackCupTestStartedAnalytics;
globalThis.trackCupTestCompletedAnalytics = trackCupTestCompletedAnalytics;
globalThis.trackShopOrderFulfilledAnalytics = trackShopOrderFulfilledAnalytics;
globalThis.trackShareAnalytics = trackShareAnalytics;
globalThis.shopResourceBucket = shopResourceBucket;
globalThis.DISCORD_CONFIG = DISCORD_CONFIG;
globalThis.MERCH_LABELS = MERCH_LABELS;
globalThis.MERCH_LINKS = MERCH_LINKS;
globalThis.CARGO_PROFILES = CARGO_PROFILES;
globalThis.SHARE_CONFIG = SHARE_CONFIG;
globalThis.STORAGE_KEY = STORAGE_KEY;
globalThis.GAME_STORAGE_KEY = GAME_STORAGE_KEY;`,
    context,
    { filename: 'app.js' },
  );
  if (TEST_TRACE_CONTEXT) {
    console.error(`[context] create=${createdAt - started}ms app=${appLoadedAt - createdAt}ms exports=${Date.now() - appLoadedAt}ms`);
  }
  return context;
}

function makeLocalStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
  };
}

function makeAnalyticsContext(config = {}, initialStorage = {}) {
  const captures = [];
  const initCalls = [];
  const storage = makeLocalStorage(initialStorage);
  const window = {
    TOFU_DRIVER_CONFIG: {
      posthogEnabled: false,
      posthogKey: '',
      posthogHost: 'https://us.i.posthog.com',
      posthogDebug: false,
      ...config,
    },
    localStorage: storage,
    location: {
      search: '?td_source=sticker&td_campaign=anime_con_2026&utm_content=front-window!!!',
    },
    posthog: {
      init(key, options) {
        initCalls.push({ key, options });
      },
      capture(event, properties) {
        captures.push({ event, properties });
      },
      opt_out_capturing() {
        window.optedOut = true;
      },
      opt_in_capturing() {
        window.optedIn = true;
      },
    },
  };
  const context = loadNoSpillContext({
    window,
    navigator: { doNotTrack: '0' },
    URLSearchParams,
  });
  context.analyticsCaptures = captures;
  context.analyticsInitCalls = initCalls;
  context.analyticsWindow = window;
  return context;
}

function assertNoSensitiveStorageData(value) {
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  assert(
    !/(routeSamples|gpsSamples|motionSamples|rawGps|rawMotion|coordinates|latitude|longitude|routeTrace|speedLog|streetName|streetNames|mapData)/i.test(serialized),
    'stored data should not include raw GPS, motion, map, route trace, street, or speed-log fields',
  );
  let parsed = value;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch (_) {
      return;
    }
  }
  const blockedKeys = new Set([
    'routesamples',
    'gpssamples',
    'motionsamples',
    'rawgps',
    'rawgpssamples',
    'rawmotion',
    'rawmotionsamples',
    'coords',
    'coordinates',
    'latitude',
    'longitude',
    'lat',
    'lon',
    'trace',
    'routetrace',
    'routetraces',
    'street',
    'streetname',
    'streetnames',
    'map',
    'maps',
    'mapdata',
    'speedlog',
    'speedlogs',
    'speedhistory',
  ]);
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    Object.entries(node).forEach(([key, child]) => {
      assert(!blockedKeys.has(key.toLowerCase()), `sensitive storage key found: ${key}`);
      visit(child);
    });
  };
  visit(parsed);
}

function sampleShareSummary(overrides = {}) {
  return {
    waterLeft: 97.4,
    waterSpilled: 2.6,
    mode: 'qualified',
    rank: 'No-Spill Club',
    qualificationStatus: 'qualified',
    qualificationLabel: 'Qualified',
    routeDifficultyLabel: 'Technical Route',
    routeType: 'Technical Route',
    cargoType: 'soft_tofu',
    cargoLabel: 'Soft Tofu',
    driveShape: 'Winding Pour',
    cupTrail: [-0.2, 0.1, -0.1, 0.2],
    cargoCondition: 97.4,
    durationSeconds: 1694,
    distanceMiles: 4.2,
    unlockedBadges: ['technical_pour'],
    deliveryStamps: ['technical_pour'],
    dailyDeliveryComplete: true,
    ...overrides,
  };
}

function sampleDeliverySession(overrides = {}) {
  return {
    date: '2026-06-14T12:00:00.000Z',
    mode: 'qualified',
    waterLeft: 94,
    waterSpilled: 6,
    rank: 'Smooth Driver',
    durationSeconds: 720,
    qualificationStatus: 'qualified',
    qualificationLabel: 'Qualified',
    harshInputCount: 1,
    harshBraking: 0,
    harshAcceleration: 0,
    harshLateral: 0,
    lateralJerk: 0,
    abruptTransitions: 0,
    distanceMiles: 4,
    turnDensityScore: 0.35,
    curvatureScore: 0.35,
    routeDifficultyScore: 0.45,
    significantTurnsPerMile: 4,
    unlockedBadges: [],
    ...overrides,
  };
}

function testNoSpillIsNotLinkedFromExistingFrontendSurfaces() {
  const publicFiles = walkFiles(path.join(ROOT, 'frontend'))
    .filter((filePath) => !filePath.startsWith(NOSPILL_DIR))
    .filter((filePath) => /\.(html|js|css)$/.test(filePath));
  for (const filePath of publicFiles) {
    const relative = path.relative(ROOT, filePath);
    const source = fs.readFileSync(filePath, 'utf8');
    assert(!source.includes('/nospill'), `${relative} should not link to /nospill`);
  }
}

function testNoSitemapOrRobotsRevealNoSpill() {
  const candidates = walkFiles(ROOT).filter((filePath) => {
    const name = path.basename(filePath).toLowerCase();
    return name.includes('sitemap') || name === 'robots.txt' || name.includes('robots');
  });
  for (const filePath of candidates) {
    const source = fs.readFileSync(filePath, 'utf8');
    assert(!source.includes('/nospill'), `${path.relative(ROOT, filePath)} reveals /nospill`);
  }
}

function testNoSpillHtmlUsesNoindexWithoutSocialIndexingMetadata() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(html.includes('<meta name="robots" content="noindex,nofollow,noarchive" />'));
  assert(!html.includes('property="og:'));
  assert(!html.includes('name="twitter:'));
  assert(!html.includes('/static/session.js'));
  assert(!html.includes('/static/index.js'));
}

function testTofuDriverBrandHierarchy() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  const appSource = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(html.includes('<title>Tofu Driver</title>'));
  assert(html.includes('<h1>Tofu Driver</h1>'));
  assert(html.includes('data-surface-target="shop"'));
  assert(html.includes('data-surface-target="crew"'));
  assert(html.includes('data-surface-target="cup-test"'));
  assert(html.includes('Certified Challenge'));
  assert(html.includes('Practice smooth driving, then fund the dream in the Tofu Garage.'));
  assert(html.includes('id="brand-primary-cta"'));
  assert(html.includes('id="brand-secondary-cta"'));
  assert(html.includes("Don't Spill the Cup"));
  assert(html.includes('Mount your phone, start while parked, and drive smoothly. Your result can boost the Tofu Garage.'));
  assert(html.includes('The Cup Test'));
  assert(html.includes('Delivery Log'));
  assert(html.includes('Every drive is a delivery.'));
  assert(html.includes('Tofu Shop'));
  assert(html.includes('Run the Tofu Shop as a parked idle-management game.'));
  assert(html.includes('Shop Mode is for when you are parked. Do not interact while driving.'));
  assert(html.includes('Pack Tofu'));
  assert(!html.includes('Delivery Wall'));
  assert(!html.includes('Shop Unlocks'));
  assert(!html.includes('Certified Delivery Unlocks'));
  assert(html.includes('Tofu Stock'));
  assert(html.includes('Delivery Orders'));
  assert(html.includes('Reputation'));
  assert(html.includes('Tofu Stock/sec'));
  assert(html.includes('Delivery Orders/sec'));
  assert(html.includes('Shop income'));
  assert(html.includes('Reputation/sec'));
  assert(html.includes('Shop Spirit/sec'));
  assert(!/\/ ?min\b/i.test(html));
  assert(html.includes('Prep Counter'));
  assert(html.includes('Delivery Crew'));
  assert(html.includes('Character Unlocks'));
  assert(html.includes('Sound Effect Unlocks'));
  assert(html.includes('Preview Sound'));
  assert(!html.includes('Story Chapter'));
  assert(!html.includes('Smooth Week'));
  assert(!html.includes('Tea Master'));
  const runViewHtml = html.slice(
    html.indexOf('id="run-view"'),
    html.indexOf('id="unsupported-view"'),
  );
  assert(!runViewHtml.includes('Pack Tofu'));
  assert(!runViewHtml.includes('Fulfill Shop Order'));
  assert(!runViewHtml.includes('game-pack-tofu-button'));
  assert(!runViewHtml.includes('data-shop-upgrade'));
  assert(!runViewHtml.includes('data-character-id'));
  assert(!runViewHtml.includes('data-sound-pack-id'));
  assert(!runViewHtml.includes('Preview Sound'));
  assert(appSource.includes('A parked idle-management game. Start with tofu orders, then grow toward the garage.'));
  assert(html.includes('Not faster. Smoother.'));
  assert(html.includes('Start and stop while parked.'));
  assert(html.includes('How it works'));
  assert(html.includes('Secret Merch'));
  assert(html.includes('No speed rankings.'));
  assert(html.includes('No route sharing.'));
  assert(!html.includes('<title>No-Spill Club</title>'));
  assert(!html.includes('<h1>No-Spill Club</h1>'));

  const context = loadNoSpillContext();
  assert.strictEqual(context.APP_BRAND, 'Tofu Driver');
  assert.strictEqual(context.CHALLENGE_NAME, 'The Cup Test');
  assert.strictEqual(context.CLUB_NAME, 'No-Spill Club');
  assert.strictEqual(context.TOP_BADGE, 'Perfect Pour');
  assert.strictEqual(context.rankForWater(97.4), 'No-Spill Club');
  assert.strictEqual(context.rankForWater(100), 'Perfect Pour');
  assert.strictEqual(context.MERCH_LABELS.nospill_club, 'No-Spill Club Tee');
  assert.strictEqual(context.MERCH_LABELS.perfect_pour, 'Perfect Pour Decal');
  assert.strictEqual(context.MERCH_LABELS.smooth_driver, 'Tofu Driver Delivery Crew');
}

function testCargoTypeDriveShapeAndCupTrailResultSlice() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(html.includes('Cargo Type'));
  assert(html.includes('Firm Tofu'));
  assert(html.includes('Soft Tofu'));
  assert(html.includes('Silken Tofu'));
  assert(html.includes('Forgiving delivery for everyday drives.'));
  assert(html.includes('The classic cup test.'));
  assert(html.includes('Delicate delivery for smooth-control purists.'));
  assert(!html.includes('Cup difficulty'));
  assert(!html.includes('id="difficulty-title"'));

  const context = loadNoSpillContext();
  assert.strictEqual(context.normalizeCargoTypeId('beginner'), 'firm_tofu');
  assert.strictEqual(context.normalizeCargoTypeId('standard'), 'soft_tofu');
  assert.strictEqual(context.normalizeCargoTypeId('comfort'), 'silken_tofu');
  assert(context.cargoTypeProfile('firm_tofu').thresholdG > context.cargoTypeProfile('soft_tofu').thresholdG);
  assert(context.cargoTypeProfile('soft_tofu').thresholdG > context.cargoTypeProfile('silken_tofu').thresholdG);

  const sameInput = { totalG: 0.32, jerk: 0, deltaSeconds: 1 };
  const firmLoss = context.computeWaterLoss({
    ...sameInput,
    thresholdG: context.cargoTypeProfile('firm_tofu').thresholdG,
  });
  const softLoss = context.computeWaterLoss({
    ...sameInput,
    thresholdG: context.cargoTypeProfile('soft_tofu').thresholdG,
  });
  const silkenLoss = context.computeWaterLoss({
    ...sameInput,
    thresholdG: context.cargoTypeProfile('silken_tofu').thresholdG,
  });
  assert.strictEqual(firmLoss, 0);
  assert(softLoss > firmLoss);
  assert(silkenLoss > softLoss);

  assert.strictEqual(context.formatTripDuration(28 * 60 + 14), '28:14');
  assert.strictEqual(context.formatTripDuration((2 * 3600) + (4 * 60) + 7), '2:04:07');
  assert.strictEqual(context.summarizeDriveShape({
    samples: 100,
    durationSeconds: 540,
    lateralAbsSum: 1,
    cargoCondition: 95,
  }), 'Calm Pour');
  assert.strictEqual(context.summarizeDriveShape({
    samples: 100,
    durationSeconds: 500,
    lateralAbsSum: 8,
    lateralSignChanges: 3,
    cargoCondition: 95,
  }), 'Rolling Pour');
  assert.strictEqual(context.summarizeDriveShape({
    samples: 100,
    durationSeconds: 900,
    lateralAbsSum: 12,
    lateralSignChanges: 8,
    cargoCondition: 95,
  }), 'Winding Pour');
  assert.strictEqual(context.summarizeDriveShape({
    samples: 100,
    durationSeconds: 900,
    longitudinalAbsSum: 12,
    longitudinalSignChanges: 10,
    roughCount: 4,
    cargoCondition: 90,
  }), 'Stop-and-Go Pour');
  assert.strictEqual(context.summarizeDriveShape({
    samples: 100,
    durationSeconds: 3000,
    lateralAbsSum: 2,
    cargoCondition: 92,
  }), 'Long Pour');

  let trail = [];
  for (let index = 0; index < 80; index += 1) {
    trail = context.appendCupTrailPoint(trail, index % 2 ? 3 : -3, 36);
  }
  assert(trail.length <= 36);
  assert(trail.every((point) => point >= -1 && point <= 1));
  const pathData = context.cupTrailPath(trail);
  assert(pathData.startsWith('M '));
  assert(!/NaN|Infinity/.test(pathData));
  const trailHtml = context.renderCupTrail({ driveShape: 'Winding Pour', cupTrail: trail });
  assert(trailHtml.includes('Cup Trail'));
  assert(trailHtml.includes('Decorative Cup Trail'));
  assert(trailHtml.includes('Decorative only; it is not a real-world path.'));
  assert(trailHtml.includes('<svg'));

  context.cargoResultSample = sampleShareSummary({
    driveShape: 'Rolling Pour',
    dailyDeliveryCredit: 'Daily Delivery Credit: Smooth commute logged.',
    deliveryRewards: {},
  });
  vm.runInContext(`
function makeNode() {
  const node = {
    textContent: "",
    innerHTML: "",
    disabled: null,
    dataset: {},
    classListValue: null,
    value: "",
  };
  node.classList = {
    toggle(_className, hidden) {
      node.classListValue = Boolean(hidden);
    },
    add() {},
    remove() {},
  };
  node.querySelector = () => null;
  return node;
}
elements = {
  summaryView: makeNode(),
  summaryStatusLabel: makeNode(),
  summaryTitle: makeNode(),
  summaryWater: makeNode(),
  summaryCharacterCameo: makeNode(),
  routeContext: makeNode(),
  routeGrid: makeNode(),
  summaryGrid: makeNode(),
  deliverySummaryGrid: makeNode(),
  cupTrailCard: makeNode(),
  commuteMasteryCopy: makeNode(),
  shareCardSection: makeNode(),
  shareButton: makeNode(),
  copyButton: makeNode(),
  downloadButton: makeNode(),
  saveButton: makeNode(),
  shareCanvas: null,
  summaryDiscordCta: makeNode(),
  returnDashboardButton: makeNode(),
  newRunButton: makeNode(),
  backSimulatorButton: makeNode(),
};
appState.running = false;
appState.calibrating = false;
renderSummary({
  ...cargoResultSample,
});
globalThis.cargoResultSummaryHtml =
  elements.summaryGrid.innerHTML
  + elements.deliverySummaryGrid.innerHTML
  + elements.cupTrailCard.innerHTML;
`, context);
  assert(context.cargoResultSummaryHtml.includes('Cargo'));
  assert(context.cargoResultSummaryHtml.includes('Soft Tofu'));
  assert(context.cargoResultSummaryHtml.includes('Trip Time'));
  assert(context.cargoResultSummaryHtml.includes('28:14'));
  assert(context.cargoResultSummaryHtml.includes('Drive Shape'));
  assert(context.cargoResultSummaryHtml.includes('Rolling Pour'));
  assert(context.cargoResultSummaryHtml.includes('Cup Trail'));
  assert(context.cargoResultSummaryHtml.includes('Smooth commute logged.'));

  const shareText = context.buildShareText(sampleShareSummary({
    driveShape: 'Rolling Pour',
    averageSpeed: 40,
    topSpeed: 55,
    coordinates: '47,-122',
    gps: true,
  }), { includeDistanceInShare: true });
  assert(shareText.includes('Cargo: Soft Tofu'));
  assert(shareText.includes('Trip Time: 28:14'));
  assert(shareText.includes('Drive Shape: Rolling Pour'));
  assert(!/speed|top speed|average speed|gps|coordinates|map|street|route trace|exact distance/i.test(shareText));
  assert(!/\b(?:mi|miles?|km|kilometers?)\b/i.test(shareText));
}

function testCoachRecapV1UsesSafeOutcomeBasedSummary() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  const appSource = fs.readFileSync(NOSPILL_JS, 'utf8');
  const runViewHtml = html.slice(
    html.indexOf('id="run-view"'),
    html.indexOf('id="unsupported-view"'),
  );
  assert(html.includes('id="coach-recap-card"'));
  assert(!runViewHtml.includes('Coach Recap'));
  assert(!/left-foot braking|right-foot braking|engine braking|trail braking|racing line|late braking|brake later/i.test(appSource));

  const context = loadNoSpillContext();
  let smooth = context.createCoachAccumulator();
  for (let index = 0; index < 90; index += 1) {
    smooth = context.updateCoachAccumulator(smooth, {
      longitudinalG: index % 12 < 6 ? -0.09 : -0.05,
      totalG: 0.12,
      jerk: 0.14,
      elapsedMs: 250,
    });
  }
  let abrupt = context.createCoachAccumulator();
  for (let index = 0; index < 90; index += 1) {
    abrupt = context.updateCoachAccumulator(abrupt, {
      longitudinalG: index % 2 ? -0.58 : 0.1,
      totalG: 0.55,
      jerk: 1.8,
      elapsedMs: 250,
    });
  }
  const smoothRecap = context.summarizeCoachRecap(smooth, { cargoCondition: 97 });
  const abruptRecap = context.summarizeCoachRecap(abrupt, { cargoCondition: 67 });
  assert.strictEqual(smoothRecap.insufficient, false);
  assert.strictEqual(abruptRecap.insufficient, false);

  const brakeOrder = ['Feathered', 'Smooth', 'Uneven', 'Abrupt'];
  const decelOrder = ['Gentle', 'Controlled', 'Choppy', 'Harsh'];
  const transitionOrder = ['Clean', 'Mostly Clean', 'Bumpy', 'Jerky'];
  const comfortOrder = ['High', 'Good', 'Mixed', 'Rough'];
  assert(brakeOrder.indexOf(smoothRecap.brakeFeather) < brakeOrder.indexOf(abruptRecap.brakeFeather));
  assert(decelOrder.indexOf(smoothRecap.decelControl) < decelOrder.indexOf(abruptRecap.decelControl));
  assert(transitionOrder.indexOf(smoothRecap.transitionSmoothness) < transitionOrder.indexOf(abruptRecap.transitionSmoothness));
  assert(comfortOrder.indexOf(smoothRecap.passengerComfort) < comfortOrder.indexOf(abruptRecap.passengerComfort));

  const insufficient = context.summarizeCoachRecap({
    sampleCount: 3,
    elapsedMs: 1200,
  }, { cargoCondition: 100 });
  assert.strictEqual(insufficient.insufficient, true);
  assert.strictEqual(insufficient.message, 'Not enough motion data for a useful coaching recap.');

  const recapHtml = context.renderCoachRecap({ coachRecap: smoothRecap });
  assert(recapHtml.includes('Coach Recap'));
  assert(recapHtml.includes('Brake Feather'));
  assert(recapHtml.includes('Decel Control'));
  assert(recapHtml.includes('Transition Smoothness'));
  assert(recapHtml.includes('Passenger Comfort'));
  assert(!/left-foot braking|right-foot braking|engine braking|trail braking|racing|attack|fast entry|late braking/i.test(recapHtml));

  const insufficientHtml = context.renderCoachRecap({ coachRecap: insufficient });
  assert(insufficientHtml.includes('Not enough motion data for a useful coaching recap.'));

  context.coachResultSample = sampleShareSummary({
    coachRecap: smoothRecap,
    deliveryRewards: {},
  });
  vm.runInContext(`
function makeNode() {
  const node = {
    textContent: "",
    innerHTML: "",
    disabled: null,
    dataset: {},
    classListValue: null,
    value: "",
  };
  node.classList = {
    toggle(_className, hidden) {
      node.classListValue = Boolean(hidden);
    },
    add() {},
    remove() {},
  };
  node.querySelector = () => null;
  return node;
}
elements = {
  summaryView: makeNode(),
  summaryStatusLabel: makeNode(),
  summaryTitle: makeNode(),
  summaryWater: makeNode(),
  summaryCharacterCameo: makeNode(),
  routeContext: makeNode(),
  routeGrid: makeNode(),
  summaryGrid: makeNode(),
  deliverySummaryGrid: makeNode(),
  coachRecapCard: makeNode(),
  cupTrailCard: makeNode(),
  commuteMasteryCopy: makeNode(),
  shareCardSection: makeNode(),
  shareButton: makeNode(),
  copyButton: makeNode(),
  downloadButton: makeNode(),
  saveButton: makeNode(),
  shareCanvas: null,
  summaryDiscordCta: makeNode(),
  returnDashboardButton: makeNode(),
  newRunButton: makeNode(),
  backSimulatorButton: makeNode(),
};
appState.running = false;
appState.calibrating = false;
renderSummary({ ...coachResultSample });
globalThis.coachResultHtml =
  elements.summaryGrid.innerHTML
  + elements.deliverySummaryGrid.innerHTML
  + elements.summaryCharacterCameo.innerHTML
  + elements.coachRecapCard.innerHTML;
`, context);
  assert(context.coachResultHtml.includes('Coach Recap'));
  assert(context.coachResultHtml.includes('/static/nospill/images/result_screen_cameo.webp'));
  assert(context.coachResultHtml.includes('/static/nospill/images/coach_pleased.webp'));
  assert(context.coachResultHtml.includes('is-result-cameo'));
  assert(context.coachResultHtml.includes('is-coach-cameo'));
  assert(!context.coachResultHtml.includes('Character art can appear here after the run ends.'));
  assert(!context.coachResultHtml.includes('Coach portrait not yet assigned'));
  assert(!context.coachResultHtml.includes('art pending'));
  assert(!context.coachResultHtml.includes('not assigned'));
  assert(!context.coachResultHtml.includes('hidden>M</div>'));
  assert(context.coachResultHtml.includes('Brake Feather'));
  assert(context.coachResultHtml.includes('Passenger Comfort'));
  assert(!/left-foot|right-foot|engine braking|trail braking|speed|top speed|average speed|exact distance|gps|coordinates|map|street name|route trace/i.test(context.coachResultHtml));

  assertNoSensitiveStorageData(smoothRecap);
  assert(!JSON.stringify(smoothRecap).includes('raw'));
  assert(!JSON.stringify(smoothRecap).includes('DeviceMotion'));
  const shareText = context.buildShareText({
    ...sampleShareSummary(),
    coachRecap: abruptRecap,
    speed: 70,
    exactDistance: 12,
    gps: 'raw',
    coordinates: '47,-122',
  });
  assert(!/speed|top speed|average speed|exact distance|gps|coordinates|map|street name|route trace/i.test(shareText));
}

function testSmoothControlRecapDriveShapeTrailAndDailyCreditFollowup() {
  const context = loadNoSpillContext();
  let smoothLateral = context.createCoachAccumulator();
  let abruptLateral = context.createCoachAccumulator();
  for (let index = 0; index < 100; index += 1) {
    smoothLateral = context.updateCoachAccumulator(smoothLateral, {
      lateralG: index % 20 < 10 ? 0.06 : -0.06,
      longitudinalG: -0.04,
      totalG: 0.1,
      jerk: 0.16,
      lateralJerk: 0.04,
      elapsedMs: 220,
    });
    abruptLateral = context.updateCoachAccumulator(abruptLateral, {
      lateralG: index % 2 ? 0.54 : -0.52,
      longitudinalG: index % 3 ? -0.14 : 0.12,
      totalG: 0.62,
      jerk: 1.65,
      lateralJerk: 0.72,
      elapsedMs: 220,
    });
  }
  const smoothRecap = context.summarizeCoachRecap(smoothLateral, { cargoCondition: 98 });
  const abruptRecap = context.summarizeCoachRecap(abruptLateral, { cargoCondition: 58 });
  const smoothHandsOrder = ['Clean', 'Smooth', 'Uneven', 'Abrupt'];
  const balanceOrder = ['Settled', 'Light Lean', 'Noticeable Lean', 'Sloshed'];
  const consistencyOrder = ['High', 'Good', 'Mixed', 'Rough'];
  assert(smoothHandsOrder.indexOf(smoothRecap.smoothHands) < smoothHandsOrder.indexOf(abruptRecap.smoothHands));
  assert(balanceOrder.indexOf(smoothRecap.cargoBalance) < balanceOrder.indexOf(abruptRecap.cargoBalance));
  assert(consistencyOrder.indexOf(smoothRecap.consistency) < consistencyOrder.indexOf(abruptRecap.consistency));

  const recapHtml = context.renderCoachRecap({ coachRecap: smoothRecap });
  assert(recapHtml.includes('Smooth Hands'));
  assert(recapHtml.includes('Brake Feather'));
  assert(recapHtml.includes('Decel Control'));
  assert(recapHtml.includes('Transition Smoothness'));
  assert(recapHtml.includes('Cargo Balance'));
  assert(recapHtml.includes('Passenger Comfort'));
  assert(recapHtml.includes('Consistency'));
  assert(!/racing line|trail braking|left-foot braking|right-foot braking|engine braking|brake later|drive faster|find a twisty road|toge|touge/i.test(recapHtml));

  const shapeFixtures = [
    ['Calm Pour', { samples: 100, durationSeconds: 240, lateralAbsSum: 1, cargoCondition: 96 }],
    ['Rolling Pour', { samples: 100, durationSeconds: 420, lateralAbsSum: 7, lateralSignChanges: 3, cargoCondition: 94 }],
    ['Winding Pour', { samples: 100, durationSeconds: 700, lateralAbsSum: 12, lateralSignChanges: 8, cargoCondition: 94 }],
    ['Stop-and-Go Pour', { samples: 100, durationSeconds: 700, longitudinalAbsSum: 12, longitudinalSignChanges: 10, roughCount: 5, cargoCondition: 88 }],
    ['Daily Pour', { samples: 100, durationSeconds: 1500, lateralAbsSum: 2, roughCount: 1, cargoCondition: 92 }],
    ['Long Pour', { samples: 100, durationSeconds: 3300, lateralAbsSum: 2, roughCount: 1, cargoCondition: 92 }],
  ];
  shapeFixtures.forEach(([expected, fixture]) => {
    assert.strictEqual(context.summarizeDriveShape({
      ...fixture,
      gps: 'ignored',
      speed: 80,
      distanceMiles: 400,
      route: 'ignored',
      street: 'ignored',
      map: 'ignored',
      coordinates: 'ignored',
      location: 'ignored',
    }), expected);
  });

  let trail = [];
  for (let index = 0; index < 96; index += 1) {
    trail = context.appendCupTrailPoint(trail, Math.sin(index) * 4, 36);
  }
  assert(trail.length <= 36);
  assert(trail.every((point) => point >= -1 && point <= 1));
  const trailPayload = { cupTrail: trail, driveShape: 'Winding Pour' };
  assertNoSensitiveStorageData(trailPayload);
  assert(!/gps|route|map|street|distance|speed|raw/i.test(JSON.stringify(trailPayload)));

  const dailyCredit = context.applyDailyDeliveryCredit({
    durationSeconds: 30 * 60,
    cargoCondition: 94,
    driveShape: 'Daily Pour',
  });
  const longCredit = context.applyDailyDeliveryCredit({
    durationSeconds: 3 * 60 * 60,
    cargoCondition: 99,
    driveShape: 'Long Pour',
    speed: 200,
    gps: 'ignored',
    distanceMiles: 1000,
    route: 'ignored',
    location: 'ignored',
  });
  assert.strictEqual(dailyCredit.eligible, true);
  assert.strictEqual(dailyCredit.message, 'Smooth commute logged.');
  assert.strictEqual(dailyCredit.capped, true);
  assert.strictEqual(longCredit.cappedMinutes, 45);
  assert.strictEqual(longCredit.eligible, true);
  assert.strictEqual(longCredit.message, 'Smooth commute logged.');
  assertNoSensitiveStorageData(dailyCredit);
  assert(!/speed|gps|distance|route|location/i.test(JSON.stringify(dailyCredit)));

  const activeRunHtml = fs.readFileSync(NOSPILL_HTML, 'utf8').slice(
    fs.readFileSync(NOSPILL_HTML, 'utf8').indexOf('id="run-view"'),
    fs.readFileSync(NOSPILL_HTML, 'utf8').indexOf('id="unsupported-view"'),
  );
  assert(!activeRunHtml.includes('Coach Recap'));
  assert(!activeRunHtml.includes('Cup Trail'));
  assert(!activeRunHtml.includes('Daily Delivery Credit'));

  const shareText = context.buildShareText({
    ...sampleShareSummary(),
    coachRecap: smoothRecap,
    driveShape: 'Daily Pour',
    speed: 70,
    topSpeed: 90,
    averageSpeed: 45,
    exactDistance: 18,
    gps: true,
    coordinates: '47,-122',
    map: true,
    streetName: 'Example Street',
    routeTrace: [1, 2, 3],
  });
  assert(!/speed|top speed|average speed|exact distance|gps|coordinates|map|street name|route trace|racing line|trail braking|left-foot braking|right-foot braking|engine braking|brake later|drive faster|find a twisty road|toge|touge/i.test(shareText));

  const safeHistoryFields = {
    coachRecap: smoothRecap,
    cupTrail: trail,
    dailyDeliveryCredit: dailyCredit,
    driveShape: 'Daily Pour',
  };
  assertNoSensitiveStorageData(safeHistoryFields);
  assert(!/raw|DeviceMotion|accelerometer|gps|routeTrace|speed|distance|location|street/i.test(JSON.stringify(safeHistoryFields)));
}

function testFirstTimeGameDashboardIsVisibleBeforeSetup() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  const dashboardIndex = html.indexOf('nospill-game-dashboard');
  const setupIndex = html.indexOf('id="setup-flow"');
  const runIndex = html.indexOf('id="run-view"');
  assert(dashboardIndex > 0, 'Today delivery dashboard should exist');
  assert(dashboardIndex < setupIndex, 'Today delivery dashboard should appear before setup controls');
  assert(dashboardIndex < runIndex, 'Today delivery dashboard should appear before active run view');
  assert(html.includes('Today&rsquo;s Delivery'));
  assert(html.includes('Soft tofu that rewards calm, balanced inputs.'));
  assert(html.includes('id="game-daily-cargo"'));
  assert(html.includes('id="game-daily-goal"'));
  assert(html.includes('id="game-daily-reward"'));
  assert(html.includes('id="game-next-action-title"'));
  assert(html.includes('Next: Watch the first order complete'));
  assert(html.includes('The starter shop runs by itself'));
  assert(html.includes('id="game-certified-cta-button"'));
  assert(html.includes('id="game-driver-license"'));
  assert(html.includes('Level 1 &middot; Rookie Carrier'));
  assert(html.includes('id="game-total-xp"'));
  assert(html.includes('0 XP'));
  assert(html.includes('id="game-gear-progress"'));
  assert(html.includes('0/3'));
  assert(html.includes('Run the Tofu Shop while parked, then use Cup Test runs for certified boosts.'));
  assert(html.includes('The passport opens after your first stamp-worthy shop moment.'));
  assert(html.includes('No one is on shift yet. Your first delivery may attract help.'));
  assert(html.includes('New sounds unlock as your delivery reputation grows.'));
  assert(html.includes('id="game-teaser-grid"'));
  assert(html.includes('nospill-section nospill-delivery-log is-hidden'));
  assert(html.includes('id="tofu-shop"'));
  assert(html.includes('nospill-section nospill-collection is-hidden'));
  assert(!html.includes('Settings / Progress Tools'));
  assert(!html.includes('Developer QA hidden'));
  assert(!html.includes('Enable with ?dev=1'));
  assert(!html.includes('Settings / QA'));
  const firstRunMain = html.slice(dashboardIndex, html.indexOf('id="how-it-works"'));
  assert(!firstRunMain.includes('Export Progress'));
  assert(!firstRunMain.includes('Import Progress'));
  assert(!firstRunMain.includes('Reset Progress'));
  assert(html.includes('nospill-game-primary-cta'));
  assert(html.includes('View Counter Service'));
  assert(html.includes('Cash'));
  assert(html.indexOf('id="game-daily-goal"') < html.indexOf('id="game-cta-button"'));
  assert(html.indexOf('id="game-daily-reward"') < html.indexOf('id="game-cta-button"'));
  assert(html.indexOf('id="game-cta-button"') < html.indexOf('id="game-driver-license"'));
  assert(html.indexOf('id="game-cta-button"') < html.indexOf('id="game-teaser-grid"'));

  const context = loadNoSpillContext();
  vm.runInContext(`
function makeNode() {
  const node = {
    textContent: "",
    innerHTML: "",
    disabled: null,
    dataset: {},
    classListValue: null,
  };
  node.classList = {
    toggle(_className, hidden) {
      node.classListValue = Boolean(hidden);
    },
  };
  return node;
}
elements = {
  gameDailyTitle: makeNode(),
  gameDailyFlavor: makeNode(),
  gameDailyCargo: makeNode(),
  gameDailyGoal: makeNode(),
  gameDailyReward: makeNode(),
  gameNextActionTitle: makeNode(),
  gameNextActionCopy: makeNode(),
  gameCtaButton: makeNode(),
  gameCertifiedCtaButton: makeNode(),
  gameDailyProgress: makeNode(),
  gameDriverLicense: makeNode(),
  gameTotalXP: makeNode(),
  gameGearProgress: makeNode(),
  gameTeaserGrid: makeNode(),
  gameShopStock: makeNode(),
  gameShopReputation: makeNode(),
  gameShopLevel: makeNode(),
  gameShopTeaser: makeNode(),
  gameShopHelper: makeNode(),
  gamePassportEmpty: makeNode(),
  gamePassportPreview: makeNode(),
  gamePackTofuButton: makeNode(),
};
renderGameDashboard(defaultGameState());
globalThis.dashboardActionTitle = elements.gameNextActionTitle.textContent;
globalThis.dashboardActionCopy = elements.gameNextActionCopy.textContent;
globalThis.dashboardActionLabel = elements.gameCtaButton.textContent;
globalThis.dashboardActionType = elements.gameCtaButton.dataset.nextAction;
globalThis.dashboardDriverLicense = elements.gameDriverLicense.textContent;
globalThis.dashboardTotalXp = elements.gameTotalXP.textContent;
globalThis.dashboardGear = elements.gameGearProgress.textContent;
globalThis.dashboardTeasersHidden = elements.gameTeaserGrid.classListValue;
appState.running = true;
renderGameDashboard(defaultGameState());
globalThis.activeDashboardActionDisabled = elements.gameCtaButton.disabled;
`, context);

  assert.strictEqual(context.dashboardDriverLicense, 'Level 1 · Rookie Carrier');
  assert.strictEqual(context.dashboardActionTitle, 'Next: Watch the first order complete');
  assert(context.dashboardActionCopy.includes('The starter shop runs by itself'));
  assert.strictEqual(context.dashboardActionLabel, 'View Counter Service');
  assert.strictEqual(context.dashboardActionType, 'watch_starter_shop');
  assert.strictEqual(context.dashboardTotalXp, '0 Driver XP');
  assert.strictEqual(context.dashboardGear, '0/3');
  assert.strictEqual(context.dashboardTeasersHidden, false);
  assert.strictEqual(context.activeDashboardActionDisabled, true);
}

async function testCupTestMobileMotionSupportDetection() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(source.includes('Motion sensors require HTTPS'));
  assert(html.includes('This browser does not appear to support motion sensors.'));
  assert(html.includes('Tofu Garage'));
  assert(!html.includes('Go to Tofu Garage'));

  const supportedContext = loadNoSpillContext({
    window: {
      isSecureContext: true,
      location: { protocol: 'https:', hostname: 'tofudriver.com' },
      DeviceMotionEvent: function DeviceMotionEvent() {},
    },
  });
  assert.strictEqual(supportedContext.motionSupportStatus().state, 'supported');
  assert.strictEqual(supportedContext.motionSupportStatus().canAttemptStart, true);

  function PermissionMotion() {}
  PermissionMotion.requestPermission = async () => 'granted';
  const permissionContext = loadNoSpillContext({
    window: {
      isSecureContext: true,
      location: { protocol: 'https:', hostname: 'tofudriver.com' },
      DeviceMotionEvent: PermissionMotion,
    },
  });
  assert.strictEqual(permissionContext.motionSupportStatus().state, 'permission-needed');
  assert.strictEqual(permissionContext.motionSupportStatus().canAttemptStart, true);
  assert.strictEqual((await permissionContext.requestMotionPermission()).ok, true);

  function DeniedMotion() {}
  DeniedMotion.requestPermission = async () => 'denied';
  const deniedContext = loadNoSpillContext({
    window: {
      isSecureContext: true,
      location: { protocol: 'https:', hostname: 'tofudriver.com' },
      DeviceMotionEvent: DeniedMotion,
    },
  });
  const denied = await deniedContext.requestMotionPermission();
  assert.strictEqual(denied.ok, false);
  assert.strictEqual(denied.state, 'permission-denied');
  assert(denied.reason.includes('Motion permission was denied.'));

  function ThrowingMotion() {}
  ThrowingMotion.requestPermission = async () => {
    throw new Error('gesture required');
  };
  const throwingContext = loadNoSpillContext({
    window: {
      isSecureContext: true,
      location: { protocol: 'https:', hostname: 'tofudriver.com' },
      DeviceMotionEvent: ThrowingMotion,
    },
  });
  const thrown = await throwingContext.requestMotionPermission();
  assert.strictEqual(thrown.ok, false);
  assert.strictEqual(thrown.state, 'permission-error');
  assert(thrown.reason.includes('could not be requested'));

  const insecureContext = loadNoSpillContext({
    window: {
      isSecureContext: false,
      location: { protocol: 'http:', hostname: 'example.com' },
      DeviceMotionEvent: function DeviceMotionEvent() {},
    },
  });
  assert.strictEqual(insecureContext.motionSupportStatus().state, 'insecure');
  assert(insecureContext.motionSupportStatus().message.includes('HTTPS'));

  const unsupportedContext = loadNoSpillContext({
    window: {
      isSecureContext: true,
      location: { protocol: 'https:', hostname: 'tofudriver.com' },
    },
  });
  assert.strictEqual(unsupportedContext.motionSupportStatus().state, 'unsupported');
  assert(unsupportedContext.motionSupportStatus().message.includes('does not appear to support motion sensors'));

  function StartMotion() {}
  StartMotion.requestPermission = async () => 'granted';
  const startContext = loadNoSpillContext({
    document: {
      addEventListener() {},
      querySelectorAll(selector) {
        if (selector === '[data-safety-check]') return [{ checked: true }, { checked: true }, { checked: true }];
        return [];
      },
    },
    window: {
      isSecureContext: true,
      location: { protocol: 'https:', hostname: 'tofudriver.com' },
      DeviceMotionEvent: StartMotion,
      addEventListener(type) {
        this.addedEventType = type;
      },
      removeEventListener(type) {
        this.removedEventType = type;
      },
      setTimeout() {
        this.timeoutScheduled = true;
      },
      matchMedia() {
        return { matches: false };
      },
    },
  });
  startContext.performance = { now: () => 1234 };
  startContext.requestAnimationFrame = (callback) => {
    if (typeof callback === 'function') callback();
    return 1;
  };
  await vm.runInContext(`(async () => {
function makeMotionNode(name) {
  const node = {
    name,
    textContent: "",
    innerHTML: "",
    checked: false,
    disabled: false,
    classListValue: null,
    dataset: {},
  };
  node.classList = {
    toggle(className, hidden) {
      if (className === "is-hidden") node.classListValue = Boolean(hidden);
    },
    add() {},
    remove() {},
    contains() { return false; },
  };
  node.scrollIntoView = function scrollIntoView() {};
  return node;
}
elements = {
  landingView: makeMotionNode("landing"),
  runView: makeMotionNode("run"),
  unsupportedView: makeMotionNode("unsupported"),
  summaryView: makeMotionNode("summary"),
  setupFlow: makeMotionNode("setup"),
  landingStatus: makeMotionNode("status"),
  unsupportedCopy: makeMotionNode("unsupportedCopy"),
  startButton: makeMotionNode("start"),
  audioToggle: { checked: false },
  audioToggleRunning: { checked: false },
  runModeLabel: makeMotionNode("runMode"),
  runStatus: makeMotionNode("runStatus"),
  surfaceNavButtons: [],
};
globalThis.performance = { now: () => 1000 };
appState.mode = "basic";
appState.surface = "cup-test";
await startRun();
globalThis.startRunAddedEvent = window.addedEventType;
globalThis.startRunCalibrating = appState.calibrating;
globalThis.startRunUnsupportedHidden = elements.unsupportedView.classListValue;
handleCalibrationTimeout();
globalThis.noDataStatus = elements.landingStatus.textContent;
globalThis.noDataUnsupportedHidden = elements.unsupportedView.classListValue;
})()`, startContext);
  assert.strictEqual(startContext.startRunAddedEvent, 'devicemotion');
  assert.strictEqual(startContext.startRunCalibrating, true);
  assert.strictEqual(startContext.startRunUnsupportedHidden, true);
  assert(startContext.noDataStatus.includes('no sensor data has arrived yet'));
  assert.strictEqual(startContext.noDataUnsupportedHidden, true);

  assert.strictEqual(startContext.surfaceFromHash('#/cup-test'), 'cup-test');
  assert.strictEqual(startContext.surfaceFromHash('#/garage'), 'shop');
  assert.strictEqual(startContext.surfaceFromHash(''), 'cup-test');

  function AudioSensitiveMotion() {}
  AudioSensitiveMotion.requestPermission = async () => (
    startAudioContext.window.audioTouchedBeforeMotion ? 'denied' : 'granted'
  );
  const startAudioContext = loadNoSpillContext({
    document: {
      addEventListener() {},
      querySelectorAll(selector) {
        if (selector === '[data-safety-check]') return [{ checked: true }, { checked: true }, { checked: true }];
        return [];
      },
    },
    window: {
      isSecureContext: true,
      location: { protocol: 'https:', hostname: 'tofudriver.com' },
      DeviceMotionEvent: AudioSensitiveMotion,
      audioTouchedBeforeMotion: false,
      AudioContext: function AudioContext() {
        startAudioContext.window.audioTouchedBeforeMotion = true;
        this.state = 'running';
        this.currentTime = 0;
        this.destination = {};
        this.createOscillator = () => ({
          type: 'sine',
          frequency: { setValueAtTime() {} },
          connect() {},
          start() {},
        });
        this.createGain = () => ({
          gain: {
            setValueAtTime() {},
            linearRampToValueAtTime() {},
          },
          connect() {},
        });
        this.resume = async () => {};
      },
      addEventListener(type) {
        this.addedEventType = type;
      },
      removeEventListener(type) {
        this.removedEventType = type;
      },
      setTimeout() {},
      matchMedia() {
        return { matches: false };
      },
    },
  });
  startAudioContext.requestAnimationFrame = (callback) => {
    if (typeof callback === 'function') callback();
    return 1;
  };
  await vm.runInContext(`(async () => {
function makeMotionNode(name) {
  const node = { textContent: '', disabled: false, checked: false, dataset: {}, classListValue: null };
  node.classList = { add() {}, remove() {}, toggle(_className, hidden) { node.classListValue = Boolean(hidden); }, contains() { return false; } };
  node.scrollIntoView = function scrollIntoView() {};
  return node;
}
elements = {
  landingView: makeMotionNode("landing"),
  runView: makeMotionNode("run"),
  unsupportedView: makeMotionNode("unsupported"),
  summaryView: makeMotionNode("summary"),
  setupFlow: makeMotionNode("setup"),
  landingStatus: makeMotionNode("status"),
  unsupportedCopy: makeMotionNode("unsupportedCopy"),
  startButton: makeMotionNode("start"),
  audioToggle: { checked: true },
  audioToggleRunning: { checked: false },
  runModeLabel: makeMotionNode("runMode"),
  runStatus: makeMotionNode("runStatus"),
  surfaceNavButtons: [],
};
globalThis.performance = { now: () => 1000 };
appState.mode = "basic";
appState.surface = "cup-test";
await startRun();
globalThis.audioStartAddedEvent = window.addedEventType;
globalThis.audioStartCalibrating = appState.calibrating;
globalThis.audioTouchedAfterMotion = window.audioTouchedBeforeMotion;
globalThis.audioStartLandingStatus = elements.landingStatus.textContent;
})()`, startAudioContext);
  assert.strictEqual(startAudioContext.audioStartAddedEvent, 'devicemotion');
  assert.strictEqual(startAudioContext.audioStartCalibrating, true);
  assert.strictEqual(startAudioContext.audioTouchedAfterMotion, true);
  assert(!startAudioContext.audioStartLandingStatus.includes('Motion permission was denied'));
}

function testTwoSurfaceRoutingSeparatesShopAndCupTest() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(html.includes('data-app-surface="shop"'));
  assert(html.includes('data-app-surface="cup-test"'));
  assert(html.includes('data-app-surface="crew"'));
  assert(html.includes('data-surface-target="shop"'));
  assert(html.includes('data-surface-target="crew"'));
  assert(html.includes('data-surface-target="cup-test"'));
  assert(html.includes('Tofu Garage'));
  assert(!html.includes('data-surface-target="shop">\n          Tofu Shop'));
  assert(!html.includes('class="is-hidden" type="button" data-surface-target="crew"'));
  assert(html.includes('Delivery Crew collection is coming later.'));
  assert(html.includes('id="tofu-garage-actions"'));
  assert(html.includes('tabindex="-1" aria-label="Tofu Garage action area"'));
  assert(html.includes('class="nospill-brand-hero" aria-labelledby="landing-title"'));
  assert(!html.includes('class="nospill-brand-hero" aria-labelledby="landing-title" data-app-surface='));
  assert(html.includes("Take Don't Spill the Cup for a certified boost")
    || html.includes('Take the Cup Test'));
  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(source.includes('if (value === "shop" || value === "garage") return "shop";'));
  assert(source.includes('button.dataset.surfaceTarget === "crew"'));

  const context = loadNoSpillContext({
    window: { location: { hash: '', search: '' }, localStorage: makeLocalStorage() },
  });
  vm.runInContext(`
function makeTextNode() {
  return { textContent: "", dataset: {} };
}

function makeFocusNode() {
  const node = { scrolled: false, focused: false, classes: new Set() };
  node.classList = {
    contains(name) {
      return node.classes.has(name);
    },
  };
  node.scrollIntoView = function scrollIntoView() {
    node.scrolled = true;
  };
  node.focus = function focus() {
    node.focused = true;
  };
  return node;
}
function makeSection(surface) {
  const node = { hidden: false, dataset: { appSurface: surface }, classes: new Set() };
  node.classList = {
    toggle(name, value) {
      if (value) node.classes.add(name);
      else node.classes.delete(name);
      node.hidden = node.classes.has("is-hidden");
    },
    add(name) {
      node.classes.add(name);
      node.hidden = node.classes.has("is-hidden");
    },
    contains(name) {
      return node.classes.has(name);
    },
  };
  return node;
}
function makeNav(target) {
  const node = {
    dataset: { surfaceTarget: target },
    disabled: null,
    attrs: {},
    classes: new Set(),
  };
  node.classList = {
    toggle(name, value) {
      if (value) node.classes.add(name);
      else node.classes.delete(name);
    },
  };
  node.setAttribute = function setAttribute(name, value) {
    node.attrs[name] = value;
  };
  node.removeAttribute = function removeAttribute(name) {
    delete node.attrs[name];
  };
  return node;
}
const shopSection = makeSection("shop");
const cupSection = makeSection("cup-test");
const crewSection = makeSection("crew");
const shopNav = makeNav("shop");
const cupNav = makeNav("cup-test");
const crewNav = makeNav("crew");
const actionAnchor = makeFocusNode();
elements = {
  surfaceSections: [shopSection, cupSection, crewSection],
  surfaceNavButtons: [shopNav, cupNav, crewNav],
  setupFlow: cupSection,
  landingView: { scrollIntoView() {} },
  tofuGarageActions: actionAnchor,
  tofuShopSection: shopSection,
  brandShelfEyebrow: makeTextNode(),
  landingTitle: makeTextNode(),
  brandShelfCopy: makeTextNode(),
  brandShelfSafety: makeTextNode(),
  brandPrimaryCta: makeTextNode(),
  brandSecondaryCta: makeTextNode(),
};
globalThis.hashDefault = surfaceFromHash("");
initializeAppSurface();
globalThis.defaultSurface = appState.surface;
globalThis.defaultHash = window.location.hash;
globalThis.defaultShopHidden = shopSection.hidden;
globalThis.defaultCupHidden = cupSection.hidden;
globalThis.defaultCrewHidden = crewSection.hidden;
globalThis.defaultCupNavCurrent = cupNav.attrs["aria-current"];
globalThis.defaultBrandTitle = elements.landingTitle.textContent;
globalThis.defaultBrandPrimary = elements.brandPrimaryCta.textContent;
globalThis.defaultBrandSecondary = elements.brandSecondaryCta.textContent;
setAppSurface("shop", { updateHash: false });
globalThis.shopHiddenOnShop = shopSection.hidden;
globalThis.cupHiddenOnShop = cupSection.hidden;
globalThis.crewHiddenOnShop = crewSection.hidden;
globalThis.shopNavCurrent = shopNav.attrs["aria-current"];
globalThis.shopBrandEyebrow = elements.brandShelfEyebrow.textContent;
globalThis.shopBrandTitle = elements.landingTitle.textContent;
globalThis.shopBrandCopy = elements.brandShelfCopy.textContent;
globalThis.shopBrandPrimary = elements.brandPrimaryCta.textContent;
globalThis.shopBrandSecondary = elements.brandSecondaryCta.textContent;
setAppSurface("cup-test", { updateHash: false });
globalThis.shopHiddenOnCup = shopSection.hidden;
globalThis.cupHiddenOnCup = cupSection.hidden;
globalThis.crewHiddenOnCup = crewSection.hidden;
globalThis.cupNavCurrent = cupNav.attrs["aria-current"];
globalThis.cupBrandEyebrow = elements.brandShelfEyebrow.textContent;
globalThis.cupBrandTitle = elements.landingTitle.textContent;
globalThis.cupBrandCopy = elements.brandShelfCopy.textContent;
globalThis.cupBrandPrimary = elements.brandPrimaryCta.textContent;
globalThis.cupBrandSecondary = elements.brandSecondaryCta.textContent;
setAppSurface("crew", { updateHash: false });
globalThis.shopHiddenOnCrew = shopSection.hidden;
globalThis.cupHiddenOnCrew = cupSection.hidden;
globalThis.crewHiddenOnCrew = crewSection.hidden;
globalThis.crewNavCurrent = crewNav.attrs["aria-current"];
globalThis.crewBrandEyebrow = elements.brandShelfEyebrow.textContent;
globalThis.crewBrandTitle = elements.landingTitle.textContent;
globalThis.crewBrandCopy = elements.brandShelfCopy.textContent;
globalThis.crewBrandPrimary = elements.brandPrimaryCta.textContent;
globalThis.crewBrandSecondary = elements.brandSecondaryCta.textContent;
setAppSurface("shop", { updateHash: false, scroll: true, target: "actions", focus: true });
globalThis.actionAnchorScrolled = actionAnchor.scrolled;
globalThis.actionAnchorFocused = actionAnchor.focused;
appState.running = true;
renderSurfaceNavigation();
globalThis.navDisabledDuringDrive = shopNav.disabled && cupNav.disabled && crewNav.disabled;
globalThis.hashShop = surfaceFromHash("#/shop");
globalThis.hashGarage = surfaceFromHash("#/garage");
globalThis.hashCup = surfaceFromHash("#/cup-test");
globalThis.hashCrew = surfaceFromHash("#/crew");
`, context);

  assert.strictEqual(context.hashDefault, 'cup-test');
  assert.strictEqual(context.hashShop, 'shop');
  assert.strictEqual(context.hashGarage, 'shop');
  assert.strictEqual(context.hashCup, 'cup-test');
  assert.strictEqual(context.hashCrew, 'crew');
  assert.strictEqual(context.defaultSurface, 'cup-test');
  assert.strictEqual(context.defaultHash, '#/cup-test');
  assert.strictEqual(context.defaultShopHidden, true);
  assert.strictEqual(context.defaultCupHidden, false);
  assert.strictEqual(context.defaultCrewHidden, true);
  assert.strictEqual(context.defaultCupNavCurrent, 'page');
  assert.strictEqual(context.defaultBrandTitle, "Don't Spill the Cup");
  assert.strictEqual(context.defaultBrandPrimary, 'Take the Cup Test');
  assert.strictEqual(context.defaultBrandSecondary, 'Tofu Garage');
  assert.strictEqual(context.shopHiddenOnShop, false);
  assert.strictEqual(context.cupHiddenOnShop, true);
  assert.strictEqual(context.crewHiddenOnShop, true);
  assert.strictEqual(context.shopNavCurrent, 'page');
  assert.strictEqual(context.shopBrandEyebrow, 'Tofu Garage');
  assert.strictEqual(context.shopBrandTitle, 'Run the Tofu Shop');
  assert.strictEqual(context.shopBrandCopy, 'A parked idle-management game. Start with tofu orders, then grow toward the garage.');
  assert.strictEqual(context.shopBrandPrimary, 'Continue Tofu Garage');
  assert.strictEqual(context.shopBrandSecondary, "Take Don't Spill the Cup");
  assert.strictEqual(context.shopHiddenOnCup, true);
  assert.strictEqual(context.cupHiddenOnCup, false);
  assert.strictEqual(context.crewHiddenOnCup, true);
  assert.strictEqual(context.cupNavCurrent, 'page');
  assert.strictEqual(context.cupBrandEyebrow, 'Certified Challenge');
  assert.strictEqual(context.cupBrandTitle, "Don't Spill the Cup");
  assert.strictEqual(context.cupBrandCopy, 'Keep the cup steady. Drive smoothly. Build the Tofu Garage while parked.');
  assert.strictEqual(context.cupBrandPrimary, 'Take the Cup Test');
  assert.strictEqual(context.cupBrandSecondary, 'Tofu Garage');
  assert.strictEqual(context.shopHiddenOnCrew, true);
  assert.strictEqual(context.cupHiddenOnCrew, true);
  assert.strictEqual(context.crewHiddenOnCrew, false);
  assert.strictEqual(context.crewNavCurrent, 'page');
  assert.strictEqual(context.crewBrandEyebrow, 'Delivery Crew');
  assert.strictEqual(context.crewBrandTitle, 'Delivery Crew');
  assert.strictEqual(context.crewBrandCopy, 'Crew collection is coming later. Build the Tofu Garage and complete Cup Test deliveries to discover future crew stories.');
  assert.strictEqual(context.crewBrandPrimary, 'Tofu Garage');
  assert.strictEqual(context.crewBrandSecondary, "Take Don't Spill the Cup");
  assert.strictEqual(context.actionAnchorScrolled, true);
  assert.strictEqual(context.actionAnchorFocused, true);
  assert.strictEqual(context.navDisabledDuringDrive, true);
}

function testProgressiveRevealTeasersUnlockAfterFirstDelivery() {
  const context = loadNoSpillContext({
    window: { location: { search: '?simulator=1' }, localStorage: makeLocalStorage() },
  });
  vm.runInContext(`
function makeNode() {
  const node = {
    textContent: "",
    innerHTML: "",
    disabled: null,
    dataset: {},
    classListValue: null,
  };
  node.classList = {
    toggle(_className, hidden) {
      node.classListValue = Boolean(hidden);
    },
  };
  return node;
}
elements = {
  gameDailyTitle: makeNode(),
  gameDailyFlavor: makeNode(),
  gameDailyCargo: makeNode(),
  gameDailyGoal: makeNode(),
  gameDailyReward: makeNode(),
  gameNextActionTitle: makeNode(),
  gameNextActionCopy: makeNode(),
  gameCtaButton: makeNode(),
  gameDailyProgress: makeNode(),
  gameDriverLicense: makeNode(),
  gameTotalXP: makeNode(),
  gameStreak: makeNode(),
  gameGearProgress: makeNode(),
  gameTeaserGrid: makeNode(),
  gameShopStock: makeNode(),
  gameShopReputation: makeNode(),
  gameShopLevel: makeNode(),
  gameShopTeaser: makeNode(),
  gameShopHelper: makeNode(),
  gamePassportEmpty: makeNode(),
  gamePassportPreview: makeNode(),
  gamePackTofuButton: makeNode(),
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  packTofuButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderButton: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  deliveryWallGrid: makeNode(),
  shopOfflineEarnings: makeNode(),
  selectedCharacterBadge: makeNode(),
  selectedCharacterName: makeNode(),
  selectedCharacterFlavor: makeNode(),
  selectedSoundPackName: makeNode(),
  selectedSoundPackFlavor: makeNode(),
  characterList: makeNode(),
  soundPackList: makeNode(),
  previewSoundButton: makeNode(),
  deliveryBoardSection: makeNode(),
  tofuShopSection: makeNode(),
  collectionSection: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.shopTab = "production";
const firstRunState = defaultGameState();
renderGamePanels(firstRunState);
globalThis.firstReveal = progressiveRevealState(firstRunState);
globalThis.firstDeliveryBoardHidden = elements.deliveryBoardSection.classListValue;
globalThis.firstShopSectionHidden = elements.tofuShopSection.classListValue;
globalThis.firstCollectionSectionHidden = elements.collectionSection.classListValue;
globalThis.firstPackDisabled = elements.packTofuButton.disabled;
globalThis.firstPackText = elements.packTofuButton.textContent;
globalThis.firstPackHelper = elements.packTofuHelper.textContent;
globalThis.firstFulfillDisabled = elements.fulfillShopOrderButton.disabled;
globalThis.firstFulfillHelper = elements.fulfillShopOrderHelper.textContent;
globalThis.firstProductionHtml = elements.shopTabPanel.innerHTML;
appState.shopTab = "upgrades";
renderTofuShop(firstRunState);
globalThis.firstUpgradeFallbackHtml = elements.shopTabPanel.innerHTML;
appState.surface = "crew";
renderGamePanels(firstRunState);
globalThis.firstCharacterHtml = elements.characterList.innerHTML;
globalThis.firstSoundHtml = elements.soundPackList.innerHTML;
globalThis.firstPreviewDisabled = elements.previewSoundButton.disabled;
appState.surface = "shop";
const simulated = applySimulatedDelivery(
  "smooth_commute",
  firstRunState,
  { now: new Date("2026-06-14T12:00:00.000Z") },
);
appState.shopTab = "production";
renderGamePanels(simulated.gameState);
globalThis.afterReveal = progressiveRevealState(simulated.gameState);
globalThis.afterDeliveryBoardHidden = elements.deliveryBoardSection.classListValue;
globalThis.afterShopSectionHidden = elements.tofuShopSection.classListValue;
globalThis.afterCollectionSectionHidden = elements.collectionSection.classListValue;
globalThis.afterDashboardStock = elements.gameShopStock.textContent;
globalThis.afterDashboardPassport = elements.gamePassportEmpty.textContent;
globalThis.afterPackDisabled = elements.packTofuButton.disabled;
globalThis.afterPackText = elements.packTofuButton.textContent;
globalThis.afterProductionHtml = elements.shopTabPanel.innerHTML;
appState.shopTab = "upgrades";
renderTofuShop(simulated.gameState);
globalThis.afterUpgradePanelHtml = elements.shopTabPanel.innerHTML;
globalThis.afterCharacterHtml = elements.characterList.innerHTML;
globalThis.afterSoundHtml = elements.soundPackList.innerHTML;
globalThis.afterPreviewDisabled = elements.previewSoundButton.disabled;
appState.surface = "crew";
renderGamePanels(simulated.gameState);
globalThis.crewSurfaceCollectionHidden = elements.collectionSection.classListValue;
globalThis.crewSurfaceCharacterHtml = elements.characterList.innerHTML;
globalThis.crewSurfaceSoundHtml = elements.soundPackList.innerHTML;
globalThis.crewSurfacePreviewDisabled = elements.previewSoundButton.disabled;
appState.running = true;
appState.shopTab = "production";
renderTofuShop(simulated.gameState);
renderCollectionPanel(simulated.gameState);
globalThis.activePackDisabled = elements.packTofuButton.disabled;
globalThis.activeProductionHtml = elements.shopTabPanel.innerHTML;
globalThis.activePreviewDisabled = elements.previewSoundButton.disabled;
`, context);

  assert.strictEqual(context.firstReveal.shop, true);
  assert.strictEqual(context.firstReveal.passport, false);
  assert.strictEqual(context.firstReveal.crew, false);
  assert.strictEqual(context.firstReveal.sounds, false);
  assert.strictEqual(context.firstDeliveryBoardHidden, true);
  assert.strictEqual(context.firstShopSectionHidden, false);
  assert.strictEqual(context.firstCollectionSectionHidden, true);
  assert.strictEqual(context.firstPackDisabled, false);
  assert.strictEqual(context.firstPackText, 'Pack Tofu');
  assert(context.firstPackHelper.includes('Manual packing is a backup'));
  assert.strictEqual(context.firstFulfillDisabled, false);
  assert(context.firstFulfillHelper.includes('Counter Service is the normal handoff path'));
  assert(context.firstProductionHtml.includes('Tofu Press'));
  assert(context.firstProductionHtml.includes('Buy Tofu Press'));
  assert(context.firstProductionHtml.includes('data-shop-station="tofu_press"'));
  assert(!context.firstProductionHtml.includes('data-shop-upgrade="tofu_press"'));
  assert(!context.firstProductionHtml.includes('>Upgrade<'));
  assert(context.firstUpgradeFallbackHtml.includes('Overview'));
  assert(!context.firstUpgradeFallbackHtml.includes('Station Upgrades'));
  assert(!context.firstUpgradeFallbackHtml.includes('data-shop-upgrade="tofu_press"'));
  assert(!context.firstUpgradeFallbackHtml.includes('Better Boxes'));
  assert(!context.firstUpgradeFallbackHtml.includes('Shop Sign'));
  assert(context.firstCharacterHtml.includes('No one is on shift yet. Your first delivery may attract help.'));
  assert(!context.firstCharacterHtml.includes('data-character-id'));
  assert(context.firstSoundHtml.includes('New sounds unlock as your delivery reputation grows.'));
  assert(!context.firstSoundHtml.includes('data-sound-pack-id'));
  assert.strictEqual(context.firstPreviewDisabled, true);

  assert.strictEqual(context.afterReveal.shop, true);
  assert.strictEqual(context.afterReveal.passport, true);
  assert.strictEqual(context.afterReveal.crew, true);
  assert.strictEqual(context.afterReveal.sounds, true);
  assert.strictEqual(context.afterDeliveryBoardHidden, true);
  assert.strictEqual(context.afterShopSectionHidden, false);
  assert.strictEqual(context.afterCollectionSectionHidden, true);
  assert.notStrictEqual(context.afterDashboardStock, 'Locked');
  assert(context.afterDashboardPassport.includes('stamps collected.'));
  assert.strictEqual(context.afterPackDisabled, false);
  assert.strictEqual(context.afterPackText, 'Pack Tofu');
  assert(context.afterProductionHtml.includes('Tofu Press'));
  assert(context.afterProductionHtml.includes('Prep Counter'));
  assert(!context.afterProductionHtml.includes('data-shop-upgrade="tofu_press"'));
  assert(!context.afterUpgradePanelHtml.includes('data-shop-upgrade="tofu_press"'));
  assert.strictEqual(context.crewSurfaceCollectionHidden, false);
  assert(context.crewSurfaceCharacterHtml.includes('Angry Tofu Driver'));
  assert(context.crewSurfaceCharacterHtml.includes('data-character-id="angry_tofu_driver"'));
  assert(context.crewSurfaceSoundHtml.includes('Retro Arcade'));
  assert(context.crewSurfaceSoundHtml.includes('data-sound-pack-id="retro_arcade"'));
  assert.strictEqual(context.crewSurfacePreviewDisabled, false);
  assert.strictEqual(context.activePackDisabled, true);
  assert(context.activeProductionHtml.includes('data-shop-station="tofu_press"'));
  assert(context.activeProductionHtml.includes('disabled'));
  assert.strictEqual(context.activePreviewDisabled, true);
}

function testTofuShopGeneratorUpgradeUiIsHonestAndProgressive() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });

  vm.runInContext(`
function makeNode() {
  const node = {
    textContent: "",
    innerHTML: "",
    disabled: null,
    dataset: {},
    classListValue: null,
    value: "",
  };
  node.classList = {
    toggle(_className, hidden) {
      node.classListValue = Boolean(hidden);
    },
  };
  node.querySelector = () => null;
  return node;
}
elements = {
  surfaceNavButtons: [],
  surfaceSections: [],
  deliveryBoardSection: makeNode(),
  tofuShopSection: makeNode(),
  collectionSection: makeNode(),
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopReach: makeNode(),
  shopSpirit: makeNode(),
  shopLicenseStars: makeNode(),
  shopBuyMultiplier: makeNode(),
  packTofuButton: makeNode(),
  fulfillShopOrderButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopOfflineEarnings: makeNode(),
  deliveryWallGrid: makeNode(),
  gameNextActionTitle: makeNode(),
  gameNextActionCopy: makeNode(),
  gameCtaButton: makeNode(),
  gameCertifiedCtaButton: makeNode(),
  gameDailyProgress: makeNode(),
  gameDriverLicense: makeNode(),
  gameTotalXP: makeNode(),
  gameStreak: makeNode(),
  gameGearProgress: makeNode(),
  gameShopStock: makeNode(),
  gameShopReputation: makeNode(),
  gameShopLevel: makeNode(),
  gamePassportEmpty: makeNode(),
  gamePassportPreview: makeNode(),
  gameShopTeaser: makeNode(),
  gameShopHelper: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.shopTab = "overview";
const fresh = defaultGameState();
renderTofuShop(fresh);
globalThis.freshOverviewHtml = elements.shopTabPanel.innerHTML;
globalThis.freshTabsHtml = elements.shopTabList.innerHTML;
globalThis.freshOfflineText = elements.shopOfflineEarnings.textContent;
appState.shopTab = "production";
renderTofuShop(fresh);
globalThis.freshProductionHtml = elements.shopTabPanel.innerHTML;
appState.shopTab = "upgrades";
renderTofuShop(fresh);
globalThis.freshLockedUpgradeFallbackHtml = elements.shopTabPanel.innerHTML;
const firstOrderSource = defaultGameState();
firstOrderSource.shop.deliveryOrders = 1;
const firstOrder = fulfillShopOrders(firstOrderSource, 1, { activeDrive: false }).gameState;
appState.shopTab = "overview";
renderTofuShop(firstOrder);
globalThis.afterOrderTabsHtml = elements.shopTabList.innerHTML;
appState.shopTab = "upgrades";
renderTofuShop(firstOrder);
globalThis.afterOrderUpgradePanelHtml = elements.shopTabPanel.innerHTML;
appState.shopTab = "passport";
renderTofuShop(firstOrder);
globalThis.afterFirstStampPassportHtml = elements.shopTabPanel.innerHTML;
appState.shopTab = "overview";
const leveled = defaultGameState();
leveled.shop.tips = 1000;
leveled.shop.tofuStock = 20;
leveled.shop.deliveryOrders = 2;
leveled.shop.lifetimeDeliveryOrders = 5;
leveled.stamps.first_shop_order = { date: "2026-06-15T00:00:00.000Z", label: "First Shop Order" };
leveled.shop.stations.tofu_press = 2;
leveled.shop.stations.prep_counter = 2;
leveled.shop.stationUpgrades.tofu_press_faster = 1;
leveled.shop.stationUpgrades.prep_counter_faster = 1;
appState.shopTab = "production";
renderTofuShop(leveled);
globalThis.leveledProductionHtml = elements.shopTabPanel.innerHTML;
appState.shopTab = "upgrades";
renderTofuShop(leveled);
globalThis.leveledUpgradePanelHtml = elements.shopTabPanel.innerHTML;
const passportFull = JSON.parse(JSON.stringify(leveled));
passportFull.shop.lifetimeDeliveryOrders = 10;
passportFull.stamps.first_10_orders = { date: "2026-06-15T00:05:00.000Z", label: "First 10 Orders" };
appState.shopTab = "passport";
renderTofuShop(passportFull);
globalThis.passportFullPanelHtml = elements.shopTabPanel.innerHTML;
const offline = defaultGameState();
offline.shop.offlineEarnings.tofuStock = 4.8;
offline.shop.offlineEarnings.deliveryOrders = 1.2;
renderTofuShop(offline);
globalThis.positiveOfflineText = elements.shopOfflineEarnings.textContent;
const fractionalPrep = defaultGameState();
fractionalPrep.shop.tips = 100;
fractionalPrep.shop.prepSlots = 0.35;
appState.shopTab = "production";
renderTofuShop(fractionalPrep);
globalThis.fractionalPrepHtml = elements.shopTabPanel.innerHTML;
appState.shopTab = "settings";
renderTofuShop(leveled);
globalThis.settingsPanelHtml = elements.shopTabPanel.innerHTML;
appState.shopTab = "ledger";
renderTofuShop(leveled);
globalThis.ledgerPanelHtml = elements.shopTabPanel.innerHTML;
const rawAccumulated = defaultGameState();
rawAccumulated.shop.tips = 10000;
rawAccumulated.shop.reputation = 1000;
rawAccumulated.shop.tofuStock = 5000;
rawAccumulated.shop.shopLevel = 10;
rawAccumulated.level = 10;
appState.shopTab = "overview";
renderTofuShop(rawAccumulated);
globalThis.rawAccumulatedTabsHtml = elements.shopTabList.innerHTML;
appState.shopTab = "routes";
renderTofuShop(rawAccumulated);
globalThis.rawAccumulatedActiveTab = appState.shopTab;
globalThis.rawAccumulatedRouteFallbackHtml = elements.shopTabPanel.innerHTML;
`, context);

  assert(context.freshOverviewHtml.includes('Overview'));
  assert(context.freshOverviewHtml.includes('Preparing Next Order'));
  assert(context.freshOverviewHtml.includes('Simple Tofu Box'));
  assert(context.freshProductionHtml.includes('Production'));
  assert(context.freshProductionHtml.includes('Buy Tofu Press'));
  assert(context.freshProductionHtml.includes('Buy Max Tofu Press'));
  assert(context.freshProductionHtml.includes('Cash'));
  assert(!context.freshProductionHtml.includes('>Upgrade<'));
  assert(!context.freshProductionHtml.includes('data-shop-upgrade'));
  assert(context.freshProductionHtml.includes('Need '));
  assert(!context.freshTabsHtml.includes('>Upgrades<'));
  assert(!context.freshTabsHtml.includes('>Orders<'));
  assert(context.freshLockedUpgradeFallbackHtml.includes('Overview'));
  assert(!context.freshLockedUpgradeFallbackHtml.includes('Station Upgrades'));
  assert.strictEqual(context.freshOfflineText, '');
  ['Routes', 'Crew', 'Garage', 'Shop Spirit', 'Rivals', 'License'].forEach((label) => {
    assert(!context.freshTabsHtml.includes(`>${label}<`), label);
  });
  assert(context.afterOrderTabsHtml.includes('Upgrades'));
  assert(!context.afterOrderTabsHtml.includes('>Orders<'));
  assert(context.afterOrderUpgradePanelHtml.includes('Station Upgrades'));
  assert(
    context.afterOrderUpgradePanelHtml.includes('Tidy Packaging Lv 0')
      || context.afterOrderUpgradePanelHtml.includes('Steady Pressing Lv 0'),
  );
  assert(context.afterOrderUpgradePanelHtml.includes('data-station-upgrade='));
  assert(context.afterOrderUpgradePanelHtml.includes('output x1.5'));
  assert(context.afterOrderUpgradePanelHtml.includes('Need '));
  assert(!context.afterOrderUpgradePanelHtml.includes('Buy Upgrade'));
  assert(!context.afterOrderUpgradePanelHtml.includes('Better Boxes'));
  assert(!context.afterOrderUpgradePanelHtml.includes('Shop Sign'));
  assert(!context.afterOrderTabsHtml.includes('Passport'));
  assert(context.afterFirstStampPassportHtml.includes('First Shop Order'));
  assert(context.afterFirstStampPassportHtml.includes('Teaser'));
  assert(context.afterFirstStampPassportHtml.includes('Passport Stamp Found'));
  assert(context.afterFirstStampPassportHtml.includes('More stamps stay tucked away until the shop grows.'));
  assert(!context.afterFirstStampPassportHtml.includes('Perfect Pour'));
  assert(!context.afterFirstStampPassportHtml.includes('No-Spill Club'));
  assert(context.passportFullPanelHtml.includes('Delivery Passport'));
  assert(context.passportFullPanelHtml.includes('First Shop Order'));
  assert(!context.passportFullPanelHtml.includes('Production'));
  assert(!context.passportFullPanelHtml.includes('Station Upgrades'));
  assert(!context.passportFullPanelHtml.includes('Buy Tofu Press'));
  assert(context.leveledProductionHtml.includes('Tofu Press'));
  assert(context.leveledProductionHtml.includes('Owned: 2'));
  assert(context.leveledProductionHtml.includes('Prep Counter'));
  assert(!context.leveledProductionHtml.includes('Station Upgrades'));
  assert(context.leveledUpgradePanelHtml.includes('Tidy Packaging Lv 1'));
  assert(!context.leveledUpgradePanelHtml.includes('Tofu Press</strong>'));
  assert(!context.leveledUpgradePanelHtml.includes('Buy Tofu Press'));
  assert(!context.leveledUpgradePanelHtml.includes('Prep Counter Lv 1'));
  assert(!context.settingsPanelHtml.includes('Tofu Press'));
  assert(!context.settingsPanelHtml.includes('Station Upgrades'));
  assert(!context.ledgerPanelHtml.includes('Tofu Press'));
  assert(!context.ledgerPanelHtml.includes('Station Upgrades'));
  assert(context.positiveOfflineText.includes('While you were away: +'));
  assert(context.positiveOfflineText.includes('tofu stock'));
  assert(context.positiveOfflineText.includes('waiting orders'));
  assert(context.fractionalPrepHtml.includes('Need 1 more Prep Capacity'));
  assert(!context.fractionalPrepHtml.includes('0.65'));
  ['Routes', 'Training', 'Crew', 'Garage', 'Shop Spirit', 'Rivals', 'License', 'Passport'].forEach((label) => {
    assert(!context.rawAccumulatedTabsHtml.includes(`>${label}<`), label);
  });
  assert.strictEqual(context.rawAccumulatedActiveTab, 'overview');
  assert(context.rawAccumulatedRouteFallbackHtml.includes('Overview'));
  assert(!context.rawAccumulatedRouteFallbackHtml.includes('Start Route Card'));
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(!html.includes('id="shop-generator-list"'));
  assert(!html.includes('id="shop-upgrade-list"'));
  assert(!html.includes('id="shop-upgrades-panel"'));
}

function testEarlyShopResourceFunnelMakesTipsObvious() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });

  vm.runInContext(`
function makeNode() {
  const node = {
    textContent: "",
    innerHTML: "",
    disabled: null,
    dataset: {},
    classListValue: null,
    value: "",
  };
  node.classList = {
    toggle(_className, hidden) {
      node.classListValue = Boolean(hidden);
    },
  };
  node.querySelector = () => null;
  return node;
}
elements = {
  surfaceNavButtons: [],
  surfaceSections: [],
  deliveryBoardSection: makeNode(),
  tofuShopSection: makeNode(),
  collectionSection: makeNode(),
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopReach: makeNode(),
  shopSpirit: makeNode(),
  shopLicenseStars: makeNode(),
  shopBuyMultiplier: makeNode(),
  packTofuButton: makeNode(),
  fulfillShopOrderButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopOfflineEarnings: makeNode(),
  deliveryWallGrid: makeNode(),
  gameDailyTitle: makeNode(),
  gameDailyFlavor: makeNode(),
  gameDailyCargo: makeNode(),
  gameDailyGoal: makeNode(),
  gameDailyReward: makeNode(),
  gameNextActionTitle: makeNode(),
  gameNextActionCopy: makeNode(),
  gameCtaButton: makeNode(),
  gameCertifiedCtaButton: makeNode(),
  gameDailyProgress: makeNode(),
  gameDriverLicense: makeNode(),
  gameTotalXP: makeNode(),
  gameStreak: makeNode(),
  gameGearProgress: makeNode(),
  gameShopStock: makeNode(),
  gameShopReputation: makeNode(),
  gameShopLevel: makeNode(),
  gamePassportEmpty: makeNode(),
  gamePassportPreview: makeNode(),
  gameShopTeaser: makeNode(),
  gameShopHelper: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
const funnel = defaultGameState();
funnel.shop.tofuStock = 503;
funnel.shop.deliveryOrders = 117;
funnel.shop.tips = 0;
funnel.shop.lifetimeDeliveryOrders = 1;
funnel.shop.prepSlots = 10;
funnel.stamps.first_shop_order = { date: "2026-06-15T00:00:00.000Z", label: "First Shop Order" };
globalThis.funnelAction = nextBestAction(funnel, { date: new Date("2026-06-15T12:00:00.000Z") });
globalThis.funnelBottleneck = currentBottleneck(funnel);
renderGameDashboard(funnel);
globalThis.funnelTopTitle = elements.gameNextActionTitle.textContent;
globalThis.funnelTopCopy = elements.gameNextActionCopy.textContent;
globalThis.funnelTopButton = elements.gameCtaButton.textContent;
globalThis.funnelTopAction = elements.gameCtaButton.dataset.nextAction;
globalThis.funnelTopQuantity = elements.gameCtaButton.dataset.nextOrderQuantity;
renderTofuShop(funnel);
globalThis.funnelPackText = elements.packTofuButton.textContent;
globalThis.funnelPackHelper = elements.packTofuHelper.textContent;
globalThis.funnelFulfillHelper = elements.fulfillShopOrderHelper.textContent;
appState.shopTab = "overview";
renderTofuShop(funnel);
globalThis.funnelOverviewHtml = elements.shopTabPanel.innerHTML;
appState.shopTab = "orders";
renderTofuShop(funnel);
globalThis.funnelOrdersFallbackHtml = elements.shopTabPanel.innerHTML;
globalThis.funnelOrdersFallbackTab = appState.shopTab;
appState.shopTab = "production";
renderTofuShop(funnel);
globalThis.funnelProductionHtml = elements.shopTabPanel.innerHTML;
const fulfilled = fulfillShopOrders(funnel, "max", { activeDrive: false });
globalThis.funnelFulfilledOk = fulfilled.ok;
globalThis.funnelFulfilledQuantity = fulfilled.quantity;
globalThis.funnelTipsAfterMax = fulfilled.gameState.shop.tips;
globalThis.funnelRepAfterMax = fulfilled.gameState.shop.reputation;
globalThis.funnelShopXpAfterMax = fulfilled.gameState.shop.shopXP;
globalThis.funnelDriverXpAfterMax = fulfilled.gameState.totalXP;
globalThis.funnelOrdersAfterMax = fulfilled.gameState.shop.deliveryOrders;
globalThis.funnelStockAfterMax = fulfilled.gameState.shop.tofuStock;
`, context);

  assert.strictEqual(context.funnelAction.type, 'wait_counter_service');
  assert.strictEqual(context.funnelAction.title, 'Next: Let Counter Service work');
  assert.strictEqual(context.funnelAction.buttonLabel, 'Counter Service Running');
  assert.strictEqual(context.funnelBottleneck.label, 'Need Cash');
  assert(!context.funnelBottleneck.label.includes('Certified boost available'));
  assert(context.funnelBottleneck.action.includes('Counter Service'));
  assert.strictEqual(context.funnelTopTitle, 'Next: Let Counter Service work');
  assert(context.funnelTopCopy.includes('Counter Service will hand them off automatically'));
  assert.strictEqual(context.funnelTopButton, 'Counter Service Running');
  assert.strictEqual(context.funnelTopAction, 'wait_counter_service');
  assert.strictEqual(context.funnelPackText, 'Pack Tofu');
  assert(context.funnelPackHelper.includes('Manual packing is a backup'));
  assert(context.funnelFulfillHelper.includes('Counter Service is the normal handoff path'));
  assert(context.funnelOverviewHtml.includes('Current Bottleneck: Need Cash'));
  assert(context.funnelOverviewHtml.includes('Tofu Stock feeds Prep Counter and larger orders. Counter Service turns prepared orders into Cash from tips.'));
  assert(context.funnelOverviewHtml.includes('Cash buys upgrades.'));
  assert(context.funnelOverviewHtml.includes('Preparing Next Order'));
  assert(context.funnelOverviewHtml.includes('role="progressbar"'));
  assert(context.funnelOverviewHtml.includes('Simple Tofu Box'));
  assert(context.funnelOverviewHtml.includes('Reward: +$10 from tips, +1 Reputation, +8 Shop XP.'));
  assert(!context.funnelOverviewHtml.includes('Fulfill Max Simple Tofu Box x83'));
  assert(context.funnelOverviewHtml.includes('Optional Certified Boost'));
  assert(!context.funnelOverviewHtml.includes('Current Bottleneck: Certified boost available'));
  assert.strictEqual(context.funnelOrdersFallbackTab, 'overview');
  assert(context.funnelOrdersFallbackHtml.includes('Overview'));
  assert(context.funnelOrdersFallbackHtml.includes('Tofu Stock feeds Prep Counter and larger orders. Counter Service turns prepared orders into Cash from tips.'));
  assert(context.funnelOrdersFallbackHtml.includes('Reward: +$10 from tips, +1 Reputation, +8 Shop XP.'));
  assert(context.funnelOrdersFallbackHtml.includes('Counter Service'));
  assert(!context.funnelOrdersFallbackHtml.includes('Fulfill Max Simple Tofu Box x83'));
  assert(context.funnelProductionHtml.includes('Let Counter Service earn Cash from tips.'));
  assert.strictEqual(context.funnelFulfilledOk, true);
  assert.strictEqual(context.funnelFulfilledQuantity, 83);
  assert.strictEqual(context.funnelTipsAfterMax, 830);
  assert.strictEqual(context.funnelRepAfterMax, 83);
  assert.strictEqual(context.funnelShopXpAfterMax, 664);
  assert.strictEqual(context.funnelDriverXpAfterMax, 0);
  assert.strictEqual(context.funnelOrdersAfterMax, 34);
  assert.strictEqual(context.funnelStockAfterMax, 5);
}

function testFractionalDeliveryOrdersShowPrepProgressNotRawDecimal() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });

  vm.runInContext(`
function makeNode() {
  const node = {
    textContent: "",
    innerHTML: "",
    disabled: null,
    dataset: {},
    classListValue: null,
    value: "",
  };
  node.classList = {
    toggle(_className, hidden) {
      node.classListValue = Boolean(hidden);
    },
  };
  node.querySelector = () => null;
  return node;
}
elements = {
  surfaceNavButtons: [],
  surfaceSections: [],
  deliveryBoardSection: makeNode(),
  tofuShopSection: makeNode(),
  collectionSection: makeNode(),
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopReach: makeNode(),
  shopSpirit: makeNode(),
  shopLicenseStars: makeNode(),
  shopBuyMultiplier: makeNode(),
  packTofuButton: makeNode(),
  fulfillShopOrderButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  shopUpgradeList: makeNode(),
  shopGeneratorList: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopOfflineEarnings: makeNode(),
  deliveryWallGrid: makeNode(),
  gameDailyTitle: makeNode(),
  gameDailyFlavor: makeNode(),
  gameDailyCargo: makeNode(),
  gameDailyGoal: makeNode(),
  gameDailyReward: makeNode(),
  gameNextActionTitle: makeNode(),
  gameNextActionCopy: makeNode(),
  gameCtaButton: makeNode(),
  gameCertifiedCtaButton: makeNode(),
  gameDailyProgress: makeNode(),
  gameDriverLicense: makeNode(),
  gameTotalXP: makeNode(),
  gameStreak: makeNode(),
  gameGearProgress: makeNode(),
  gameShopStock: makeNode(),
  gameShopReputation: makeNode(),
  gameShopLevel: makeNode(),
  gamePassportEmpty: makeNode(),
  gamePassportPreview: makeNode(),
  gameShopTeaser: makeNode(),
  gameShopHelper: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
const waiting = defaultGameState();
waiting.shop.tofuStock = 109;
waiting.shop.deliveryOrders = 0;
waiting.shop.generatorCarry.deliveryOrders = 0.3;
waiting.shop.tips = 10;
waiting.shop.reputation = 1;
waiting.shop.lifetimeDeliveryOrders = 1;
waiting.stamps.first_shop_order = { date: "2026-06-15T12:00:00.000Z", label: "First Shop Order" };
waiting.shop.stations.prep_counter = 1;
waiting.shop.generators.prepCounter = { unlocked: true, level: 1 };
waiting.shop.lastGeneratorTickAt = "2026-06-15T12:00:00.000Z";
globalThis.waitingPrep = orderPrepProgress(waiting);
globalThis.waitingAction = nextBestAction(waiting, { date: new Date("2026-06-15T12:00:00.000Z") });
globalThis.waitingBottleneck = currentBottleneck(waiting);
renderGameDashboard(waiting);
globalThis.waitingTopTitle = elements.gameNextActionTitle.textContent;
globalThis.waitingTopButton = elements.gameCtaButton.textContent;
globalThis.waitingTopDisabled = elements.gameCtaButton.disabled;
globalThis.waitingTopCopy = elements.gameNextActionCopy.textContent;
globalThis.waitingCertifiedHidden = elements.gameCertifiedCtaButton.classListValue;
renderTofuShop(waiting);
globalThis.waitingOrdersText = elements.shopDeliveryOrders.textContent;
globalThis.waitingPrepStatus = elements.shopPrepStatus.textContent;
globalThis.waitingPackText = elements.packTofuButton.textContent;
globalThis.waitingFulfillDisabled = elements.fulfillShopOrderButton.disabled;
globalThis.waitingFulfillHelper = elements.fulfillShopOrderHelper.textContent;
appState.shopTab = "orders";
renderTofuShop(waiting);
globalThis.waitingOrdersHtml = elements.shopTabPanel.innerHTML;
const blocked = fulfillShopOrders(waiting, 1, { activeDrive: false });
globalThis.waitingBlockedOk = blocked.ok;
globalThis.waitingBlockedReason = blocked.reason;
const ticked = applyShopGeneratorTick(waiting, new Date("2026-06-15T12:00:30.000Z"));
globalThis.waitingTickedOrders = ticked.gameState.shop.deliveryOrders;
globalThis.waitingTickedCarry = ticked.gameState.shop.generatorCarry.deliveryOrders;
globalThis.waitingTickedPrep = orderPrepProgress(ticked.gameState);
globalThis.waitingTickedNonNegative = ticked.gameState.shop.tofuStock >= 0 && ticked.gameState.shop.deliveryOrders >= 0;
const tickedTen = applyShopGeneratorTick(waiting, new Date("2026-06-15T12:00:10.000Z"));
globalThis.waitingTickedTenPrep = orderPrepProgress(tickedTen.gameState);
appState.shopTab = "orders";
renderTofuShop(tickedTen.gameState);
globalThis.waitingTickedTenOrdersHtml = elements.shopTabPanel.innerHTML;
const paused = defaultGameState();
paused.shop.tofuStock = 0;
paused.shop.deliveryOrders = 0;
paused.shop.generatorCarry.deliveryOrders = 0.45;
paused.shop.stations.tofu_press = 0;
paused.shop.stations.prep_counter = 1;
paused.shop.generators.prepCounter = { unlocked: true, level: 1 };
paused.shop.lastGeneratorTickAt = "2026-06-15T12:00:00.000Z";
const pausedTicked = applyShopGeneratorTick(paused, new Date("2026-06-15T12:00:30.000Z"));
globalThis.pausedTickedPrep = orderPrepProgress(pausedTicked.gameState);
appState.shopTab = "orders";
renderTofuShop(pausedTicked.gameState);
globalThis.pausedOrdersHtml = elements.shopTabPanel.innerHTML;
const highReady = defaultGameState();
highReady.shop.tofuStock = 20;
highReady.shop.deliveryOrders = 3;
highReady.shop.generatorCarry.deliveryOrders = 0.52;
globalThis.highReadyAction = nextBestAction(highReady, { date: new Date("2026-06-15T12:00:00.000Z") });
appState.shopTab = "orders";
renderTofuShop(highReady);
globalThis.highReadyOrdersHtml = elements.shopTabPanel.innerHTML;
`, context);

  assert.strictEqual(context.waitingPrep.ready, 0);
  assert.strictEqual(context.waitingPrep.progressPercent, 30);
  assert.strictEqual(context.waitingAction.type, 'wait_prep_counter');
  assert.strictEqual(context.waitingAction.title, 'Next: Wait for Prep Counter');
  assert.strictEqual(context.waitingAction.disabled, true);
  assert.strictEqual(context.waitingBottleneck.label, 'Preparing Delivery Order');
  assert(!context.waitingBottleneck.label.includes('Certified boost available'));
  assert.strictEqual(context.waitingTopTitle, 'Next: Wait for Prep Counter');
  assert.strictEqual(context.waitingTopButton, 'Preparing Order');
  assert.strictEqual(context.waitingTopDisabled, true);
  assert(context.waitingTopCopy.includes('Need $10 more for Tidy Packaging.'));
  assert.strictEqual(context.waitingCertifiedHidden, false);
  assert.strictEqual(context.waitingOrdersText, '0 ready');
  assert(!context.waitingOrdersText.includes('0.3'));
  assert(context.waitingPrepStatus.includes('Next order is 30% prepared.'));
  assert(context.waitingPrepStatus.includes('seconds remaining'));
  assert.strictEqual(context.waitingPackText, 'Pack Tofu');
  assert.strictEqual(context.waitingFulfillDisabled, true);
  assert(context.waitingFulfillHelper.includes('Need 1 prepared order.'));
  assert(context.waitingFulfillHelper.includes('Next order is 30% prepared.'));
  assert(context.waitingOrdersHtml.includes('Ready Orders: 0'));
  assert(context.waitingOrdersHtml.includes('Preparing Next Order'));
  assert(context.waitingOrdersHtml.includes('role="progressbar"'));
  assert(context.waitingOrdersHtml.includes('aria-label="Preparing next delivery order"'));
  assert(context.waitingOrdersHtml.includes('aria-valuemin="0"'));
  assert(context.waitingOrdersHtml.includes('aria-valuemax="100"'));
  assert(context.waitingOrdersHtml.includes('aria-valuenow="30"'));
  assert(context.waitingOrdersHtml.includes('style="width: 30%"'));
  assert(context.waitingOrdersHtml.includes('Preparing next order'));
  assert(context.waitingOrdersHtml.includes('30% prepared'));
  assert(context.waitingOrdersHtml.includes('Prep Counter tofu per prepared order: 2.'));
  assert(!/\d+\.\d{4,}/.test(context.waitingOrdersHtml));
  assert.strictEqual(context.waitingBlockedOk, false);
  assert(context.waitingBlockedReason.includes('Need 1 prepared order.'));
  assert(context.waitingTickedTenPrep.progressPercent > context.waitingPrep.progressPercent);
  assert(context.waitingTickedTenOrdersHtml.includes(`aria-valuenow="${context.waitingTickedTenPrep.progressPercent}"`));
  assert.strictEqual(context.waitingTickedOrders, 1);
  assert(context.waitingTickedPrep.progressPercent < context.waitingPrep.progressPercent);
  assert.strictEqual(context.waitingTickedCarry < 0.1, true);
  assert.strictEqual(context.waitingTickedNonNegative, true);
  assert.strictEqual(context.pausedTickedPrep.progressPercent, 45);
  assert(context.pausedOrdersHtml.includes('Prep paused'));
  assert(context.pausedOrdersHtml.includes('Need more Tofu Stock.'));
  assert(context.pausedOrdersHtml.includes('aria-valuenow="45"'));
  assert(context.pausedOrdersHtml.includes('is-paused'));
  assert.strictEqual(context.highReadyAction.title, 'Next: Watch the first order complete');
  assert(context.highReadyOrdersHtml.includes('Next order preparing'));
  assert(context.highReadyOrdersHtml.includes('Ready orders can be fulfilled now.'));
  assert(context.highReadyOrdersHtml.includes('aria-valuenow="52"'));
}

function testTofuStockRunwayGuidesEarlyPurchases() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });

  vm.runInContext(`
function makeNode() {
  const node = {
    textContent: "",
    innerHTML: "",
    disabled: null,
    dataset: {},
    classListValue: null,
    value: "",
  };
  node.classList = {
    toggle(_className, hidden) {
      node.classListValue = Boolean(hidden);
    },
  };
  node.querySelector = () => null;
  return node;
}
elements = {
  surfaceNavButtons: [],
  surfaceSections: [],
  deliveryBoardSection: makeNode(),
  tofuShopSection: makeNode(),
  collectionSection: makeNode(),
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopReach: makeNode(),
  shopSpirit: makeNode(),
  shopLicenseStars: makeNode(),
  shopBuyMultiplier: makeNode(),
  packTofuButton: makeNode(),
  fulfillShopOrderButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  shopUpgradeList: makeNode(),
  shopGeneratorList: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopOfflineEarnings: makeNode(),
  deliveryWallGrid: makeNode(),
  gameDailyTitle: makeNode(),
  gameDailyFlavor: makeNode(),
  gameDailyCargo: makeNode(),
  gameDailyGoal: makeNode(),
  gameDailyReward: makeNode(),
  gameNextActionTitle: makeNode(),
  gameNextActionCopy: makeNode(),
  gameCtaButton: makeNode(),
  gameCertifiedCtaButton: makeNode(),
  gameDailyProgress: makeNode(),
  gameDriverLicense: makeNode(),
  gameTotalXP: makeNode(),
  gameStreak: makeNode(),
  gameGearProgress: makeNode(),
  gameShopStock: makeNode(),
  gameShopReputation: makeNode(),
  gameShopLevel: makeNode(),
  gamePassportEmpty: makeNode(),
  gamePassportPreview: makeNode(),
  gameShopTeaser: makeNode(),
  gameShopHelper: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";

const highStock = defaultGameState();
highStock.shop.tofuStock = 108;
highStock.shop.deliveryOrders = 0.3;
highStock.shop.generatorCarry.deliveryOrders = 0.3;
highStock.shop.tips = 100;
highStock.shop.prepSlots = 10;
highStock.shop.lifetimeDeliveryOrders = 1;
highStock.stamps.first_shop_order = { date: "2026-06-15T00:00:00.000Z", label: "First Shop Order" };
globalThis.highRunway = tofuStockRunway(highStock);
globalThis.highAction = nextBestAction(highStock, { date: new Date("2026-06-15T12:00:00.000Z") });
globalThis.highBottleneck = currentBottleneck(highStock);
renderGameDashboard(highStock);
globalThis.highTopTitle = elements.gameNextActionTitle.textContent;
globalThis.highTopCopy = elements.gameNextActionCopy.textContent;
globalThis.highTopStation = elements.gameCtaButton.dataset.nextStation;
appState.shopTab = "orders";
renderTofuShop(highStock);
globalThis.highOrdersHtml = elements.shopTabPanel.innerHTML;
appState.shopTab = "production";
renderTofuShop(highStock);
globalThis.highProductionHtml = elements.shopTabPanel.innerHTML;
appState.shopTab = "upgrades";
renderTofuShop(highStock);
globalThis.highUpgradePanelHtml = elements.shopTabPanel.innerHTML;

const lowStock = defaultGameState();
lowStock.shop.tofuStock = 1;
lowStock.shop.deliveryOrders = 0;
lowStock.shop.generatorCarry.deliveryOrders = 0;
lowStock.shop.tips = 100;
lowStock.shop.prepSlots = 10;
lowStock.shop.lifetimeDeliveryOrders = 0;
lowStock.shop.lifetimeTofuPacked = 1;
lowStock.shop.lastGeneratorTickAt = "2026-06-15T12:00:00.000Z";
globalThis.lowRunway = tofuStockRunway(lowStock);
globalThis.lowAction = nextBestAction(lowStock, { date: new Date("2026-06-15T12:00:00.000Z") });
globalThis.lowBottleneck = currentBottleneck(lowStock);
const ticked = applyShopGeneratorTick(lowStock, new Date("2026-06-15T12:00:30.000Z"));
globalThis.lowTickNonNegative = ticked.gameState.shop.tofuStock >= 0 && ticked.gameState.shop.deliveryOrders >= 0;
`, context);

  assert.strictEqual(context.highRunway.ordersRemaining, 18);
  assert(context.highRunway.message.includes('Enough tofu for 18 more orders'));
  assert.strictEqual(context.highAction.type, 'buy_upgrade');
  assert.strictEqual(context.highAction.upgradeId, 'prep_counter_faster');
  assert.strictEqual(context.highAction.title, 'Next: Buy Tidy Packaging');
  assert(context.highAction.copy.includes('Tidy Packaging makes the next order arrive faster'));
  assert.strictEqual(context.highTopStation, '');
  assert.strictEqual(context.highBottleneck.label, 'Prep Counter upgrade available');
  assert(context.highBottleneck.action.includes('Buy Tidy Packaging'));
  assert(!context.highTopTitle.includes('Tofu Press'));
  assert(!context.highTopCopy.includes('Certified boost'));
  assert(context.highProductionHtml.includes('Not urgent: you have enough tofu for now.'));
  assert(context.highProductionHtml.includes('Prep Counter is the bottleneck.'));
  assert(context.highUpgradePanelHtml.includes('Tidy Packaging Lv 0'));
  assert(context.highUpgradePanelHtml.includes('Prep Counter output x1.5'));
  assert(context.highUpgradePanelHtml.includes('Prep Counter: 1 order / 40 sec -&gt; 1 order / 27 sec.'));
  assert(context.highOrdersHtml.includes('Tofu Stock feeds Prep Counter and larger orders. Counter Service turns prepared orders into Cash from tips.'));
  assert(context.highOrdersHtml.includes('Enough tofu for 18 more orders.'));
  assert(context.highOrdersHtml.includes('Uses 6 tofu stock and 1 ready order.'));
  assert(context.highOrdersHtml.includes('Prep Counter tofu per prepared order: 2.'));

  assert.strictEqual(context.lowRunway.isLow, true);
  assert.strictEqual(context.lowBottleneck.label, 'Low Tofu Stock');
  assert.strictEqual(context.lowAction.type, 'buy_station');
  assert.strictEqual(context.lowAction.stationId, 'tofu_press');
  assert(context.lowAction.copy.includes('Tofu Stock is low'));
  assert.strictEqual(context.lowTickNonNegative, true);
}

function testCompactTofuShopNumberFormatting() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });

  assert.strictEqual(context.formatCompactNumber(999), '999');
  assert.strictEqual(context.formatCompactNumber(1049), '1.05K');
  assert.strictEqual(context.formatCompactNumber(12840), '12.8K');
  assert.strictEqual(context.formatCompactNumber(999999), '1M');
  assert.strictEqual(context.formatCompactNumber(2400000), '2.4M');
  assert.strictEqual(context.formatCompactNumber(1000000000), '1B');

  vm.runInContext(`
function makeNode() {
  const node = {
    textContent: "",
    innerHTML: "",
    disabled: null,
    dataset: {},
    classListValue: null,
    value: "",
  };
  node.classList = {
    toggle(_className, hidden) {
      node.classListValue = Boolean(hidden);
    },
  };
  node.querySelector = () => null;
  return node;
}
elements = {
  surfaceNavButtons: [],
  surfaceSections: [],
  deliveryBoardSection: makeNode(),
  tofuShopSection: makeNode(),
  collectionSection: makeNode(),
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopReach: makeNode(),
  shopSpirit: makeNode(),
  shopLicenseStars: makeNode(),
  shopBuyMultiplier: makeNode(),
  packTofuButton: makeNode(),
  fulfillShopOrderButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  shopUpgradeList: makeNode(),
  shopGeneratorList: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopOfflineEarnings: makeNode(),
  deliveryWallGrid: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
const high = defaultGameState();
high.totalXP = 2400000;
high.shop.tofuStock = 2400000;
high.shop.deliveryOrders = 12840;
high.shop.tips = 1000000000;
high.shop.reputation = 1000000000;
high.shop.shopLevel = getShopLevel(high.shop.reputation);
high.shop.prepSlots = 1049;
high.shop.shopReach = 12840;
high.shop.shopSpirit = 2400000;
high.shop.licenseStars = 1000000000;
high.shop.lifetimeDeliveryOrders = 5;
high.stamps.first_shop_order = { date: "2026-06-15T00:00:00.000Z", label: "First Shop Order" };
renderTofuShop(high);
globalThis.compactTofuStockText = elements.shopTofuStock.textContent;
globalThis.compactOrdersText = elements.shopDeliveryOrders.textContent;
globalThis.compactTipsText = elements.shopTips.textContent;
globalThis.compactReputationText = elements.shopReputation.textContent;
globalThis.compactLevelProgressText = elements.shopLevelProgress.textContent;
globalThis.compactPrepSlotsText = elements.shopPrepSlots.textContent;
globalThis.compactReachText = elements.shopReach.textContent;
globalThis.compactSpiritText = elements.shopSpirit.textContent;
globalThis.compactStarsText = elements.shopLicenseStars.textContent;
globalThis.compactStateTips = high.shop.tips;
globalThis.compactStateStock = high.shop.tofuStock;
appState.shopTab = "orders";
renderTofuShop(high);
globalThis.compactOrdersHtml = elements.shopTabPanel.innerHTML;
const costly = defaultGameState();
costly.shop.tips = 1000000000;
costly.shop.prepSlots = 0.35;
costly.shop.stations.tofu_press = 50;
costly.shop.stations.prep_counter = 1;
costly.shop.stationUpgrades.network_calendar = 1;
costly.shop.stations.regional_network = 1;
costly.shop.reputation = 2000;
costly.shop.shopLevel = getShopLevel(costly.shop.reputation);
costly.stamps.first_shop_order = { date: "2026-06-15T00:00:00.000Z", label: "First Shop Order" };
appState.shopTab = "production";
renderTofuShop(costly);
globalThis.compactProductionHtml = elements.shopTabPanel.innerHTML;
costly.shop.tips = 0;
costly.shop.deliveryOrders = 0;
costly.shop.generatorCarry.deliveryOrders = 0.4;
costly.shop.lastGeneratorTickAt = "2026-06-15T12:00:00.000Z";
appState.shopTab = "upgrades";
renderTofuShop(costly);
globalThis.compactUpgradeHtml = elements.shopTabPanel.innerHTML;
`, context);

  assert.strictEqual(context.compactTofuStockText, '2.4M');
  assert.strictEqual(context.compactOrdersText, '12.8K ready');
  assert.strictEqual(context.compactTipsText, '$1B');
  assert.strictEqual(context.compactReputationText, '1B');
  assert(/[KMB]/.test(context.compactLevelProgressText));
  assert(context.compactPrepSlotsText.includes('available'));
  assert(!context.compactPrepSlotsText.includes('/'));
  assert.strictEqual(context.compactReachText, '12.8K');
  assert(context.compactSpiritText.includes('K/'));
  assert.strictEqual(context.compactStarsText, '100K');
  assert.strictEqual(context.compactStateTips, 1000000000);
  assert.strictEqual(context.compactStateStock, 2400000);
  assert(context.compactOrdersHtml.includes('Ready Orders') || context.compactOrdersHtml.includes('Delivery Orders'));
  assert(context.compactProductionHtml.includes('$'));
  assert(context.compactProductionHtml.includes('Need 1 more Prep Capacity'));
  assert(context.compactUpgradeHtml.includes('Station Upgrades') || context.compactUpgradeHtml.includes('Maxed'));
  assert(!context.compactUpgradeHtml.includes(' -&gt; 1 order / 1 sec'));
  const visible = [
    context.compactOrdersHtml,
    context.compactProductionHtml,
    context.compactUpgradeHtml,
  ].join('\n');
  assert(!visible.includes('undefined'));
  assert(!/\d+\.\d{4,}/.test(visible));
}

function testShopRecentRewardUsesSafeFallbackLabel() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });

  vm.runInContext(`
function makeNode() {
  return { textContent: "", innerHTML: "" };
}
elements = {
  driverLevel: makeNode(),
  driverLicense: makeNode(),
  dailyCargo: makeNode(),
  dailyGoal: makeNode(),
  dailyReward: makeNode(),
  driverTotalXP: makeNode(),
  driverNextXP: makeNode(),
  driverStreak: makeNode(),
  nospillGearProgress: makeNode(),
  passportProgress: makeNode(),
  recentReward: makeNode(),
  recentStamps: makeNode(),
};
const state = defaultGameState();
state.recentRewards = [{
  date: "2026-06-15T12:00:00.000Z",
  type: "shop_order",
  label: "Simple Tofu Box Complete",
  xpGained: 8,
}];
renderDeliveryLog(state);
globalThis.shopRecentRewardText = elements.recentReward.textContent;
state.recentRewards = [{
  date: "2026-06-15T12:00:00.000Z",
  type: "shop_order",
  xpGained: 4,
}];
renderDeliveryLog(state);
globalThis.shopFallbackRewardText = elements.recentReward.textContent;
state.recentRewards = [{
  date: "2026-06-15T12:00:00.000Z",
  type: "delivery",
  label: "Glass Bottle delivery",
  xpGained: 320,
}];
renderDeliveryLog(state);
globalThis.driverRecentRewardText = elements.recentReward.textContent;
`, context);

  assert.strictEqual(context.shopRecentRewardText, 'No driver rewards yet');
  assert.strictEqual(context.shopFallbackRewardText, 'No driver rewards yet');
  assert.strictEqual(context.driverRecentRewardText, 'Recent Driver Reward: +320 Driver XP · Glass Bottle delivery');
  assert(!context.shopRecentRewardText.includes('undefined'));
  assert(!context.shopFallbackRewardText.includes('undefined'));
}

function testDriverAndShopProgressionAreSeparated() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  const deliveryBoardStart = html.indexOf('id="delivery-board-section"');
  const deliveryBoardOpen = html.lastIndexOf('<section', deliveryBoardStart);
  const deliveryBoardTag = html.slice(deliveryBoardOpen, html.indexOf('>', deliveryBoardStart) + 1);
  assert(deliveryBoardTag.includes('data-app-surface="cup-test"'));
  assert(!deliveryBoardTag.includes('data-app-surface="shop"'));

  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });

  vm.runInContext(`
function makeNode() {
  return {
    textContent: "",
    innerHTML: "",
    dataset: {},
    disabled: false,
    classList: {
      toggle() {},
    },
  };
}
elements = {
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopProductionRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopSpirit: makeNode(),
  shopSpiritRate: makeNode(),
  packTofuButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderButton: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  shopBottleneck: makeNode(),
  shopNextActionTitle: makeNode(),
  shopNextActionCopy: makeNode(),
  shopCtaButton: makeNode(),
  shopInlineResult: makeNode(),
  shopWelcomeBack: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
};
const manual = defaultGameState();
manual.shop.tofuStock = 10;
manual.shop.deliveryOrders = 1;
const manualResult = fulfillShopOrders(manual, 1, { activeDrive: false });
globalThis.manualOk = manualResult.ok;
globalThis.manualDriverXp = manualResult.gameState.totalXP;
globalThis.manualShopXp = manualResult.gameState.shop.shopXP;
globalThis.manualTips = manualResult.gameState.shop.tips;
globalThis.manualRep = manualResult.gameState.shop.reputation;

const counter = defaultGameState();
counter.stamps.first_10_orders = true;
counter.shop.lifetimeDeliveryOrders = 10;
counter.shop.counterService.running = true;
counter.shop.counterService.lastHandoffAt = "2026-06-15T12:00:00.000Z";
counter.shop.tofuStock = 75;
counter.shop.deliveryOrders = 2;
counter.shop.shopLevel = 2;
const counterResult = applyCounterServiceTick(counter, new Date("2026-06-15T12:00:10.000Z"));
globalThis.counterCompleted = counterResult.completed;
globalThis.counterDriverXp = counterResult.gameState.totalXP;
globalThis.counterShopXp = counterResult.gameState.shop.shopXP;
globalThis.counterRewardLabel = counterResult.gameState.recentRewards[0].label;

const bonusState = defaultGameState();
while (levelProgress(bonusState.totalXP).level < 250) {
  bonusState.totalXP += 5000;
}
bonusState.shop.tofuStock = 75;
bonusState.shop.deliveryOrders = 2;
bonusState.shop.lifetimeDeliveryOrders = 50;
bonusState.shop.reputation = 300;
bonusState.shop.shopLevel = getShopLevel(bonusState.shop.reputation);
const bonus = driverShopReputationBonus(bonusState);
const bonusOrder = fulfillShopOrders(bonusState, 1, {
  activeDrive: false,
  orderTypeId: "festival_bento",
});
globalThis.driverBonusPercent = bonus.percent;
globalThis.driverBonusRep = bonusOrder.reputationGained;
globalThis.driverBonusTotalXpAfterShop = bonusOrder.gameState.totalXP;

appState.surface = "shop";
appState.shopTab = "overview";
renderTofuShop(bonusState);
globalThis.shopOverviewHtml = elements.shopTabPanel.innerHTML;
globalThis.shopTabsHtml = elements.shopTabList.innerHTML;
`, context);

  assert.strictEqual(context.manualOk, true);
  assert.strictEqual(context.manualDriverXp, 0);
  assert.strictEqual(context.manualShopXp, 8);
  assert.strictEqual(context.manualTips, 10);
  assert.strictEqual(context.manualRep, 1);
  assert.strictEqual(context.counterCompleted, 1);
  assert.strictEqual(context.counterDriverXp, 0);
  assert.strictEqual(context.counterShopXp > 0, true);
  assert.strictEqual(context.counterRewardLabel, 'Counter Service');
  assert.strictEqual(context.driverBonusPercent, 10);
  assert.strictEqual(context.driverBonusRep, 9);
  assert.strictEqual(context.driverBonusTotalXpAfterShop > 0, true);
  assert(context.shopOverviewHtml.includes('Driver Bonus'));
  assert(context.shopOverviewHtml.includes('Earn Driver XP from Don'));
  assert(context.shopOverviewHtml.includes('+10% Reputation from orders'));
  assert(context.shopOverviewHtml.includes('View Delivery Board'));
  assert(!context.shopOverviewHtml.includes('Every drive is a delivery.'));
  assert(!context.shopTabsHtml.includes('Delivery Board'));
}

function testFirstStampFanfareCelebratesAndPersists() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(html.includes('id="stamp-fanfare"'));
  assert(html.includes('role="dialog"'));
  assert(html.includes('aria-modal="true"'));
  assert(html.includes('First Stamp Earned'));
  assert(html.includes('First Shop Order'));
  assert(html.includes('Continue Tofu Shop'));
  assert(html.includes('View Passport'));
  const localStorage = makeLocalStorage();
  const context = loadNoSpillContext({
    window: {
      localStorage,
      matchMedia: () => ({ matches: false }),
    },
  });

  vm.runInContext(`
function makeNode() {
  const classes = new Set(['is-hidden']);
  const node = {
    textContent: "",
    innerHTML: "",
    focused: false,
    classList: {
      add(className) { classes.add(className); },
      remove(className) { classes.delete(className); },
      toggle(className, force) {
        const active = force === undefined ? !classes.has(className) : Boolean(force);
        if (active) classes.add(className);
        else classes.delete(className);
      },
      contains(className) { return classes.has(className); },
      toString() { return Array.from(classes).join(' '); },
    },
    focus() { node.focused = true; },
  };
  node.className = () => Array.from(classes).join(' ');
  return node;
}
elements = {
  stampFanfare: makeNode(),
  stampFanfareCard: makeNode(),
  stampFanfareTitle: makeNode(),
  stampFanfareName: makeNode(),
  stampFanfareCopy: makeNode(),
  stampFanfareRewards: makeNode(),
  landingView: null,
  summaryView: null,
};
appState.running = false;
appState.calibrating = false;
appState.audioLevel = 'muted';
appState.audioEnabled = true;
const source = defaultGameState();
const result = fulfillShopOrders(source, 1, {
  activeDrive: false,
  orderTypeId: "simple_tofu_box",
});
globalThis.fanfareOk = result.ok;
globalThis.fanfareSeenIds = result.gameState.seenStampFanfareIds.slice();
globalThis.fanfarePayload = result.stampFanfare;
globalThis.fanfareLedgerText = result.gameState.shop.ledger[0].text;
saveGameState(result.gameState);
globalThis.reloadedSeenIds = loadGameState().seenStampFanfareIds.slice();
const secondSource = normalizeGameState(result.gameState);
secondSource.shop.tofuStock = 10;
secondSource.shop.deliveryOrders = 1;
const second = fulfillShopOrders(secondSource, 1, {
  activeDrive: false,
  orderTypeId: "simple_tofu_box",
});
globalThis.secondFanfare = second.stampFanfare;
const shown = showStampFanfare(result.stampFanfare, result.gameState);
globalThis.fanfareShown = shown.shown;
globalThis.fanfareSoundReason = shown.sound.reason;
globalThis.fanfareTitle = elements.stampFanfareTitle.textContent;
globalThis.fanfareStampName = elements.stampFanfareName.textContent;
globalThis.fanfareCopy = elements.stampFanfareCopy.textContent;
globalThis.fanfareRewardsHtml = elements.stampFanfareRewards.innerHTML;
globalThis.fanfareIsAnimated = elements.stampFanfare.classList.contains('is-animated');
globalThis.fanfareIsHiddenBeforeContinue = elements.stampFanfare.classList.contains('is-hidden');
globalThis.fanfareFocused = elements.stampFanfareCard.focused;
hideStampFanfare();
globalThis.fanfareHiddenAfterContinue = elements.stampFanfare.classList.contains('is-hidden');
appState.running = true;
const activeDriveShow = showStampFanfare(result.stampFanfare, result.gameState);
globalThis.activeDriveFanfareShown = activeDriveShow.shown;
globalThis.activeDriveFanfareReason = activeDriveShow.sound.reason;
`, context);

  assert.strictEqual(context.fanfareOk, true);
  assert.strictEqual(context.fanfareSeenIds.join(','), 'first_shop_order');
  assert.strictEqual(context.reloadedSeenIds.join(','), 'first_shop_order');
  assert.strictEqual(context.secondFanfare, null);
  assert.strictEqual(context.fanfarePayload.title, 'First Stamp Earned');
  assert.strictEqual(context.fanfarePayload.stampLabel, 'First Shop Order');
  assert.strictEqual(context.fanfarePayload.copy, 'The passport opens. Your first shop order is recorded.');
  assert.strictEqual(context.fanfarePayload.rewards.tips, 10);
  assert.strictEqual(context.fanfarePayload.rewards.reputation, 1);
  assert.strictEqual(context.fanfarePayload.rewards.shopXp, 8);
  assert(context.fanfareLedgerText.includes('First Shop Order stamp earned'));
  assert.strictEqual(context.fanfareShown, true);
  assert.strictEqual(context.fanfareSoundReason, 'muted');
  assert.strictEqual(context.fanfareTitle, 'First Stamp Earned');
  assert.strictEqual(context.fanfareStampName, 'First Shop Order');
  assert.strictEqual(context.fanfareCopy, 'The passport opens. Your first shop order is recorded.');
  assert(context.fanfareRewardsHtml.includes('/static/nospill/images/reward_unlock_splash.webp'));
  assert(context.fanfareRewardsHtml.includes('nospill-stamp-fanfare-art'));
  assert(!context.fanfareRewardsHtml.includes('nospill-character-cameo'));
  assert(!context.fanfareRewardsHtml.includes('hidden>M</div>'));
  assert(!context.fanfareRewardsHtml.includes('Reward splash art belongs'));
  assert(!context.fanfareRewardsHtml.includes('art pending'));
  assert(!context.fanfareRewardsHtml.includes('not yet assigned'));
  assert(!context.fanfareRewardsHtml.includes('Stamp Cameo'));
  assert(!context.fanfareRewardsHtml.includes('stamp_fanfare_cameo'));
  assert(context.fanfareRewardsHtml.includes('Cash'));
  assert(context.fanfareRewardsHtml.includes('+$10'));
  assert(context.fanfareRewardsHtml.includes('Reputation'));
  assert(context.fanfareRewardsHtml.includes('+1'));
  assert(context.fanfareRewardsHtml.includes('Shop XP'));
  assert(context.fanfareRewardsHtml.includes('+8'));
  assert.strictEqual(context.fanfareIsAnimated, true);
  assert.strictEqual(context.fanfareIsHiddenBeforeContinue, false);
  assert.strictEqual(context.fanfareFocused, true);
  assert.strictEqual(context.fanfareHiddenAfterContinue, true);
  assert.strictEqual(context.activeDriveFanfareShown, false);
  assert.strictEqual(context.activeDriveFanfareReason, 'active-drive');
}

function testStampFanfareReducedMotionUsesStaticState() {
  const context = loadNoSpillContext({
    window: {
      localStorage: makeLocalStorage(),
      matchMedia: () => ({ matches: true }),
    },
  });

  vm.runInContext(`
function makeNode() {
  const classes = new Set(['is-hidden']);
  return {
    textContent: "",
    innerHTML: "",
    classList: {
      add(className) { classes.add(className); },
      remove(className) { classes.delete(className); },
      toggle(className, force) {
        const active = force === undefined ? !classes.has(className) : Boolean(force);
        if (active) classes.add(className);
        else classes.delete(className);
      },
      contains(className) { return classes.has(className); },
    },
    focus() {},
  };
}
elements = {
  stampFanfare: makeNode(),
  stampFanfareCard: makeNode(),
  stampFanfareTitle: makeNode(),
  stampFanfareName: makeNode(),
  stampFanfareCopy: makeNode(),
  stampFanfareRewards: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.audioLevel = 'muted';
const shown = showStampFanfare(buildStampFanfare('first_shop_order', {
  tipsGained: 10,
  reputationGained: 1,
  xpGained: 8,
}), defaultGameState());
globalThis.reducedShown = shown.shown;
globalThis.reducedMotion = shown.reducedMotion;
globalThis.staticClass = elements.stampFanfare.classList.contains('is-static');
globalThis.animatedClass = elements.stampFanfare.classList.contains('is-animated');
`, context);

  assert.strictEqual(context.reducedShown, true);
  assert.strictEqual(context.reducedMotion, true);
  assert.strictEqual(context.staticClass, true);
  assert.strictEqual(context.animatedClass, false);
}

function testDiscoveryFanfareRevealsUpgradesOnce() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(html.includes('id="discovery-fanfare"'));
  assert(html.includes('role="dialog"'));
  assert(html.includes('New Shop System Revealed'));
  assert(html.includes('Upgrades'));
  assert(html.includes('More shop systems are hidden for now'));

  const localStorage = makeLocalStorage();
  const context = loadNoSpillContext({
    window: {
      localStorage,
      matchMedia: () => ({ matches: false }),
    },
  });

  vm.runInContext(`
function makeNode() {
  const classes = new Set(['is-hidden']);
  const node = {
    textContent: "",
    innerHTML: "",
    focused: false,
    classList: {
      add(className) { classes.add(className); },
      remove(className) { classes.delete(className); },
      toggle(className, force) {
        const active = force === undefined ? !classes.has(className) : Boolean(force);
        if (active) classes.add(className);
        else classes.delete(className);
      },
      contains(className) { return classes.has(className); },
    },
    focus() { node.focused = true; },
    scrollIntoView() {},
  };
  return node;
}
elements = {
  discoveryFanfare: makeNode(),
  discoveryFanfareCard: makeNode(),
  discoveryFanfareTitle: makeNode(),
  discoveryFanfareSystem: makeNode(),
  discoveryFanfareCopy: makeNode(),
  discoveryFanfareSecondary: makeNode(),
  discoveryFanfareView: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  tofuShopSection: makeNode(),
  landingView: makeNode(),
  runView: makeNode(),
  unsupportedView: makeNode(),
  summaryView: makeNode(),
  surfaceNavButtons: [],
  surfaceSections: [],
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.audioLevel = 'muted';
appState.audioEnabled = true;
const source = defaultGameState();
source.shop.tofuStock = 100;
source.shop.deliveryOrders = 1;
const result = fulfillShopOrders(source, 1, {
  activeDrive: false,
  orderTypeId: "simple_tofu_box",
});
globalThis.discoveryOk = result.ok;
globalThis.discoveryPayload = result.discoveryFanfare;
globalThis.discoverySeenIds = result.gameState.seenSystemRevealIds.slice();
saveGameState(result.gameState);
globalThis.discoveryReloadedSeenIds = loadGameState().seenSystemRevealIds.slice();
const secondSource = normalizeGameState(result.gameState);
secondSource.shop.tofuStock = 100;
secondSource.shop.deliveryOrders = 1;
const second = fulfillShopOrders(secondSource, 1, {
  activeDrive: false,
  orderTypeId: "simple_tofu_box",
});
globalThis.secondDiscovery = second.discoveryFanfare;
const shown = showDiscoveryFanfare(result.discoveryFanfare, result.gameState);
globalThis.discoveryShown = shown.shown;
globalThis.discoverySoundReason = shown.sound.reason;
globalThis.discoveryTitle = elements.discoveryFanfareTitle.textContent;
globalThis.discoverySystem = elements.discoveryFanfareSystem.textContent;
globalThis.discoveryCopy = elements.discoveryFanfareCopy.textContent;
globalThis.discoverySecondary = elements.discoveryFanfareSecondary.textContent;
globalThis.discoveryButton = elements.discoveryFanfareView.textContent;
globalThis.discoveryAnimated = elements.discoveryFanfare.classList.contains('is-animated');
globalThis.discoveryHiddenBeforeContinue = elements.discoveryFanfare.classList.contains('is-hidden');
globalThis.discoveryFocused = elements.discoveryFanfareCard.focused;
renderTofuShop(result.gameState);
globalThis.discoveryTabHtmlBeforeView = elements.shopTabList.innerHTML;
continueFromDiscoveryFanfare();
globalThis.discoveryHiddenAfterContinue = elements.discoveryFanfare.classList.contains('is-hidden');
showDiscoveryFanfare(result.discoveryFanfare, result.gameState);
viewSystemFromDiscoveryFanfare();
globalThis.discoveryViewTab = appState.shopTab;
globalThis.discoveryHighlightedTab = appState.highlightedShopTab;
globalThis.discoveryTabHtml = elements.shopTabList.innerHTML;
globalThis.discoveryStateAfterView = loadGameState().newlyRevealedTabIds.slice();
const raw = defaultGameState();
raw.shop.tips = 10000;
raw.shop.reputation = 1000;
raw.shop.tofuStock = 5000;
renderTofuShop(raw);
globalThis.rawSystemRevealIds = raw.seenSystemRevealIds.slice();
globalThis.rawDiscoveryHidden = elements.discoveryFanfare.classList.contains('is-hidden');
appState.running = true;
const activeShow = showDiscoveryFanfare(result.discoveryFanfare, result.gameState);
globalThis.activeDiscoveryShown = activeShow.shown;
globalThis.activeDiscoveryReason = activeShow.sound.reason;
`, context);

  assert.strictEqual(context.discoveryOk, true);
  assert.strictEqual(context.discoveryPayload.title, 'New Shop System Revealed');
  assert.strictEqual(context.discoveryPayload.systemLabel, 'Upgrades');
  assert(context.discoveryPayload.copy.includes('A new Upgrades tab has appeared'));
  assert(context.discoveryPayload.secondaryCopy.includes('More shop systems are hidden for now'));
  assert.strictEqual(context.discoverySeenIds.join(','), 'upgrades');
  assert.strictEqual(context.discoveryReloadedSeenIds.join(','), 'upgrades');
  assert.strictEqual(context.secondDiscovery, null);
  assert.strictEqual(context.discoveryShown, true);
  assert.strictEqual(context.discoverySoundReason, 'muted');
  assert.strictEqual(context.discoveryTitle, 'New Shop System Revealed');
  assert.strictEqual(context.discoverySystem, 'Upgrades');
  assert(context.discoveryCopy.includes('A new Upgrades tab has appeared'));
  assert(context.discoverySecondary.includes('Keep fulfilling orders and hitting milestones'));
  assert.strictEqual(context.discoveryButton, 'View Upgrades');
  assert.strictEqual(context.discoveryAnimated, true);
  assert.strictEqual(context.discoveryHiddenBeforeContinue, false);
  assert.strictEqual(context.discoveryFocused, true);
  assert.strictEqual(context.discoveryHiddenAfterContinue, true);
  assert.strictEqual(context.discoveryViewTab, 'upgrades');
  assert.strictEqual(context.discoveryHighlightedTab, '');
  assert(context.discoveryTabHtmlBeforeView.includes('data-shop-tab="upgrades"'));
  assert(context.discoveryTabHtmlBeforeView.includes('nospill-tab-badge'));
  assert(context.discoveryTabHtmlBeforeView.includes('New'));
  assert(context.discoveryTabHtmlBeforeView.includes('is-newly-revealed'));
  assert(context.discoveryTabHtml.includes('data-shop-tab="upgrades"'));
  assert(!context.discoveryTabHtml.includes('nospill-tab-badge'));
  assert(!context.discoveryTabHtml.includes('is-newly-revealed'));
  assert.strictEqual(context.discoveryStateAfterView.length, 0);
  assert.strictEqual(context.rawSystemRevealIds.length, 0);
  assert.strictEqual(context.rawDiscoveryHidden, true);
  assert.strictEqual(context.activeDiscoveryShown, false);
  assert.strictEqual(context.activeDiscoveryReason, 'active-drive');
}

function testDiscoveryFanfareReducedMotionUsesStaticState() {
  const context = loadNoSpillContext({
    window: {
      localStorage: makeLocalStorage(),
      matchMedia: () => ({ matches: true }),
    },
  });

  vm.runInContext(`
function makeNode() {
  const classes = new Set(['is-hidden']);
  return {
    textContent: "",
    innerHTML: "",
    classList: {
      add(className) { classes.add(className); },
      remove(className) { classes.delete(className); },
      toggle(className, force) {
        const active = force === undefined ? !classes.has(className) : Boolean(force);
        if (active) classes.add(className);
        else classes.delete(className);
      },
      contains(className) { return classes.has(className); },
    },
    focus() {},
  };
}
elements = {
  discoveryFanfare: makeNode(),
  discoveryFanfareCard: makeNode(),
  discoveryFanfareTitle: makeNode(),
  discoveryFanfareSystem: makeNode(),
  discoveryFanfareCopy: makeNode(),
  discoveryFanfareSecondary: makeNode(),
  discoveryFanfareView: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.audioLevel = 'muted';
const shown = showDiscoveryFanfare(buildDiscoveryFanfare('upgrades'), defaultGameState());
globalThis.reducedDiscoveryShown = shown.shown;
globalThis.reducedDiscoveryMotion = shown.reducedMotion;
globalThis.discoveryStaticClass = elements.discoveryFanfare.classList.contains('is-static');
globalThis.discoveryAnimatedClass = elements.discoveryFanfare.classList.contains('is-animated');
`, context);

  assert.strictEqual(context.reducedDiscoveryShown, true);
  assert.strictEqual(context.reducedDiscoveryMotion, true);
  assert.strictEqual(context.discoveryStaticClass, true);
  assert.strictEqual(context.discoveryAnimatedClass, false);
}

function testCoveredCarTeaserIsOneTimeStoryBeatOnly() {
  const context = loadNoSpillContext({
    window: {
      localStorage: makeLocalStorage(),
    },
  });

  vm.runInContext(`
function makeNode() {
  const classes = new Set();
  const node = {
    textContent: "",
    innerHTML: "",
    classList: {
      add(className) { classes.add(className); },
      remove(className) { classes.delete(className); },
      toggle(className, force) {
        const active = force === undefined ? !classes.has(className) : Boolean(force);
        if (active) classes.add(className);
        else classes.delete(className);
      },
      contains(className) { return classes.has(className); },
    },
    scrollIntoView() {},
  };
  return node;
}
elements = {
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopOfflineEarnings: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";

function managedShopState() {
  const state = defaultGameState();
  state.shop.tips = 0;
  state.shop.reputation = 0;
  state.shop.lifetimeReputation = 2000000;
  state.shop.shopLevel = 100;
  state.shop.lifetimeTips = 2000000;
  state.shop.lifetimeDeliveryOrders = 1200;
  state.shop.deliveryOrders = 500;
  state.shop.tofuStock = 10000000;
  state.shop.stations.delivery_shelf = 5;
  state.shop.stations.shop_sign = 5;
  state.stamps.first_shop_order = { label: "First Shop Order" };
  state.stamps.first_10_orders = { label: "First 10 Orders" };
  state.stamps.first_family_tofu_tray = { label: "First Family Tofu Tray" };
  state.stamps.first_100_tips = { label: "First 100 Tips" };
  state.shop.stationUpgrades.counter_service_crew = 1;
  state.shop.stationUpgrades.manager_shift_manager = 1;
  state.shop.stationUpgrades.manager_wholesale_pickup = 1;
  STATION_UPGRADES.forEach((upgrade) => {
    if (
      upgrade.stationId === "counter_service"
      || upgrade.stationId === "supplier_contract"
      || upgrade.stationId === "manager_desk"
      || upgrade.stationId === "tofu_press"
      || upgrade.stationId === "prep_counter"
      || upgrade.stationId === "delivery_shelf"
      || upgrade.stationId === "shop_sign"
    ) {
      state.shop.stationUpgrades[upgrade.id] = upgrade.maxLevel;
    }
  });
  state.shop.wholesalePickupsCompleted = 1;
  return state;
}

const fresh = defaultGameState();
globalThis.freshCoveredUnlocked = coveredCarTeaserUnlocked(fresh);
globalThis.freshCoveredCard = renderCoveredCarTeaserCard(fresh);
const early = defaultGameState();
early.shop.stationUpgrades.prep_counter_faster = 1;
early.stamps.first_upgrade_purchased = { label: "First Upgrade Purchased" };
globalThis.earlyCoveredUnlocked = coveredCarTeaserUnlocked(early);
globalThis.earlyScene = getTofuShopSceneState(early).sceneId;

const highProgress = managedShopState();
const urgentQueue = managedShopState();
urgentQueue.shop.deliveryOrders = 1000000;
const urgentAffordableQueue = managedShopState();
urgentAffordableQueue.shop.deliveryOrders = 1000000;
urgentAffordableQueue.shop.tips = 75000;
const affordableWheels = managedShopState();
affordableWheels.shop.tips = 75000;
const partialWheels = managedShopState();
partialWheels.shop.tips = 32000;
globalThis.highCoveredUnlocked = coveredCarTeaserUnlocked(highProgress);
globalThis.highCoveredSeen = coveredCarTeaserSeen(highProgress);
globalThis.freshDreamVisible = dreamInvestmentTargetVisible(fresh);
globalThis.highDreamVisible = dreamInvestmentTargetVisible(highProgress);
globalThis.highDreamProgress = dreamInvestmentTargetProgress(highProgress);
globalThis.highMilestone = nextMilestoneForShop(highProgress);
globalThis.highAction = nextBestAction(highProgress);
globalThis.urgentQueueAction = nextBestAction(urgentQueue);
globalThis.urgentQueueMilestone = nextMilestoneForShop(urgentQueue);
globalThis.urgentAffordableQueueAction = nextBestAction(acknowledgeCoveredCarTeaser(urgentAffordableQueue).gameState);
globalThis.highCardHtml = renderCoveredCarTeaserCard(highProgress);
globalThis.highDreamCardHtml = renderDreamInvestmentTargetCard(highProgress);
globalThis.affordableDreamCardHtml = renderDreamInvestmentTargetCard(affordableWheels);
globalThis.affordableDreamProgress = dreamInvestmentTargetProgress(affordableWheels);
globalThis.partialDreamCardHtml = renderDreamInvestmentTargetCard(partialWheels);
globalThis.partialDreamProgress = dreamInvestmentTargetProgress(partialWheels);
globalThis.freshProjectCarValue = projectCarValueV1(fresh);
globalThis.freshProjectCarCard = renderProjectCarValueCard(fresh);
globalThis.freshDreamBuildProgressVisible = dreamBuildProgressVisible(fresh);
globalThis.freshDreamBuildProgressCard = renderDreamBuildProgressCard(fresh);
appState.shopTab = "overview";
renderTofuShop(highProgress);
globalThis.storyOverviewHtml = elements.shopTabPanel.innerHTML;
globalThis.storyTabsHtml = elements.shopTabList.innerHTML;
globalThis.highSceneId = getTofuShopSceneState(highProgress).sceneId;
globalThis.highSceneHtml = renderTofuShopLivingScene(highProgress);

const acknowledged = acknowledgeCoveredCarTeaser(highProgress);
globalThis.acknowledgedOk = acknowledged.ok;
globalThis.acknowledgedFeedback = acknowledged.feedback;
globalThis.acknowledgedSeen = coveredCarTeaserSeen(acknowledged.gameState);
globalThis.acknowledgedIds = acknowledged.gameState.seenStoryBeatIds.slice();
globalThis.acknowledgedMilestone = nextMilestoneForShop(acknowledged.gameState);
globalThis.acknowledgedBusyAction = nextBestAction(acknowledged.gameState);
globalThis.acknowledgedDreamVisible = dreamInvestmentTargetVisible(acknowledged.gameState);
globalThis.acknowledgedDreamCardHtml = renderDreamInvestmentTargetCard(acknowledged.gameState);
globalThis.acknowledgedDreamProgressVisible = dreamBuildProgressVisible(acknowledged.gameState);
globalThis.acknowledgedDreamProgressSummary = dreamBuildProgressSummary(acknowledged.gameState);
globalThis.acknowledgedDreamProgressCard = renderDreamBuildProgressCard(acknowledged.gameState);
globalThis.acknowledgedDreamNote = dreamInvestmentReturningNote(acknowledged.gameState);
globalThis.acknowledgedNetWorth = netWorthV1(acknowledged.gameState);
globalThis.acknowledgedFormulaNetWorth = cashBalance(acknowledged.gameState) + tofuBusinessValue(acknowledged.gameState);
const stableDreamState = JSON.parse(JSON.stringify(acknowledged.gameState));
stableDreamState.shop.deliveryOrders = 0;
stableDreamState.shop.generatorCarry.deliveryOrders = 0;
globalThis.stableDreamAction = nextBestAction(stableDreamState);
globalThis.stableDreamMilestone = nextMilestoneForShop(stableDreamState);
const stableAffordableDreamState = JSON.parse(JSON.stringify(stableDreamState));
stableAffordableDreamState.shop.tips = 75000;
stableAffordableDreamState.shop.prepSlots = 0;
stableAffordableDreamState.shop.stations.tofu_press = 100;
stableAffordableDreamState.shop.stations.prep_counter = 100;
stableAffordableDreamState.shop.stations.delivery_shelf = 100;
stableAffordableDreamState.shop.stations.shop_sign = 100;
globalThis.stableAffordableDreamAction = nextBestAction(stableAffordableDreamState);
globalThis.stableAffordableDreamMilestone = nextMilestoneForShop(stableAffordableDreamState);
globalThis.stableAffordableDreamCardHtml = renderDreamInvestmentTargetCard(stableAffordableDreamState);
const wheelsPurchase = buyDreamBuildWheels(stableAffordableDreamState, { now: new Date("2026-06-18T12:00:00Z") });
globalThis.wheelsPurchaseOk = wheelsPurchase.ok;
globalThis.wheelsPurchaseFeedback = wheelsPurchase.feedback;
globalThis.wheelsCashAfter = wheelsPurchase.gameState.shop.tips;
globalThis.wheelsPurchasedFlag = wheelsPurchase.gameState.shop.dreamBuild.wheelsPurchased;
globalThis.wheelsLevelAfterPurchase = wheelsPurchase.gameState.shop.dreamBuild.wheelsLevel;
globalThis.wheelsPurchasedAt = wheelsPurchase.gameState.shop.dreamBuild.firstInvestmentPurchasedAt;
globalThis.wheelsTotalXP = wheelsPurchase.gameState.totalXP;
globalThis.wheelsProjectCarValue = projectCarValueV1(wheelsPurchase.gameState);
globalThis.wheelsNetWorth = netWorthV1(wheelsPurchase.gameState);
globalThis.wheelsFormulaNetWorth = cashBalance(wheelsPurchase.gameState) + tofuBusinessValue(wheelsPurchase.gameState) + projectCarValueV1(wheelsPurchase.gameState);
globalThis.wheelsCardHtml = renderDreamInvestmentTargetCard(wheelsPurchase.gameState);
globalThis.wheelsProgressSummary = dreamBuildProgressSummary(wheelsPurchase.gameState);
globalThis.wheelsProgressCardHtml = renderDreamBuildProgressCard(wheelsPurchase.gameState);
globalThis.wheelsProjectCardHtml = renderProjectCarValueCard(wheelsPurchase.gameState);
globalThis.wheelsNetWorthCardHtml = renderNetWorthCard(wheelsPurchase.gameState);
globalThis.wheelsMilestone = nextMilestoneForShop(wheelsPurchase.gameState);
globalThis.wheelsAction = nextBestAction(wheelsPurchase.gameState);
globalThis.secondWheelsPurchase = buyDreamBuildWheels(wheelsPurchase.gameState);
const oldWheelsSave = JSON.parse(JSON.stringify(wheelsPurchase.gameState));
delete oldWheelsSave.shop.dreamBuild.wheelsLevel;
globalThis.oldWheelsLevel = dreamBuildWheelsLevel(oldWheelsSave);
const polishReady = JSON.parse(JSON.stringify(wheelsPurchase.gameState));
polishReady.shop.tips = 100000;
globalThis.polishReadyCardHtml = renderDreamInvestmentTargetCard(polishReady);
globalThis.polishReadyMilestone = nextMilestoneForShop(polishReady);
globalThis.polishReadyAction = nextBestAction(polishReady);
globalThis.polishReadyNote = dreamInvestmentReturningNote(polishReady);
const urgentPolishReady = JSON.parse(JSON.stringify(polishReady));
urgentPolishReady.shop.deliveryOrders = 1000000;
globalThis.urgentPolishAction = nextBestAction(urgentPolishReady);
const polishResult = buyDreamBuildWheelsWork("polish-wheels", polishReady, { now: new Date("2026-06-18T13:00:00Z") });
globalThis.polishOk = polishResult.ok;
globalThis.polishCashAfter = polishResult.gameState.shop.tips;
globalThis.polishLevel = polishResult.gameState.shop.dreamBuild.wheelsLevel;
globalThis.polishProjectValue = projectCarValueV1(polishResult.gameState);
globalThis.polishNetWorth = netWorthV1(polishResult.gameState);
globalThis.polishFormulaNetWorth = cashBalance(polishResult.gameState) + tofuBusinessValue(polishResult.gameState) + projectCarValueV1(polishResult.gameState);
globalThis.polishCardHtml = renderDreamInvestmentTargetCard(polishResult.gameState);
const fitmentReady = JSON.parse(JSON.stringify(polishResult.gameState));
fitmentReady.shop.tips = 200000;
globalThis.fitmentReadyCardHtml = renderDreamInvestmentTargetCard(fitmentReady);
globalThis.fitmentReadyMilestone = nextMilestoneForShop(fitmentReady);
globalThis.fitmentReadyAction = nextBestAction(fitmentReady);
globalThis.fitmentReadyNote = dreamInvestmentReturningNote(fitmentReady);
const fitmentResult = buyDreamBuildWheelsWork("balance-fitment", fitmentReady, { now: new Date("2026-06-18T14:00:00Z") });
globalThis.fitmentOk = fitmentResult.ok;
globalThis.fitmentCashAfter = fitmentResult.gameState.shop.tips;
globalThis.fitmentLevel = fitmentResult.gameState.shop.dreamBuild.wheelsLevel;
globalThis.fitmentProjectValue = projectCarValueV1(fitmentResult.gameState);
globalThis.fitmentNetWorth = netWorthV1(fitmentResult.gameState);
globalThis.fitmentFormulaNetWorth = cashBalance(fitmentResult.gameState) + tofuBusinessValue(fitmentResult.gameState) + projectCarValueV1(fitmentResult.gameState);
globalThis.fitmentCardHtml = renderDreamInvestmentTargetCard(fitmentResult.gameState);
globalThis.fitmentProgressSummary = dreamBuildProgressSummary(fitmentResult.gameState);
globalThis.fitmentProgressCardHtml = renderDreamBuildProgressCard(fitmentResult.gameState);
globalThis.fitmentMilestone = nextMilestoneForShop(fitmentResult.gameState);
globalThis.fitmentAction = nextBestAction(fitmentResult.gameState);
globalThis.secondFitment = buyDreamBuildWheelsWork("balance-fitment", fitmentResult.gameState);
const exhaustLowCash = JSON.parse(JSON.stringify(fitmentResult.gameState));
globalThis.exhaustLowCardHtml = renderDreamInvestmentTargetCard(exhaustLowCash);
globalThis.exhaustLowMilestone = nextMilestoneForShop(exhaustLowCash);
globalThis.exhaustLowAction = nextBestAction(exhaustLowCash);
const exhaustAffordable = JSON.parse(JSON.stringify(fitmentResult.gameState));
exhaustAffordable.shop.tips = 300000;
globalThis.exhaustAffordableCardHtml = renderDreamInvestmentTargetCard(exhaustAffordable);
globalThis.exhaustAffordableMilestone = nextMilestoneForShop(exhaustAffordable);
globalThis.exhaustAffordableAction = nextBestAction(exhaustAffordable);
globalThis.exhaustAffordableNote = dreamInvestmentReturningNote(exhaustAffordable);
const urgentExhaustAffordable = JSON.parse(JSON.stringify(exhaustAffordable));
urgentExhaustAffordable.shop.deliveryOrders = 1000000;
globalThis.urgentExhaustAction = nextBestAction(urgentExhaustAffordable);
const exhaustPurchase = buyDreamBuildExhaust("buy-exhaust", exhaustAffordable, { now: new Date("2026-06-18T15:00:00Z") });
globalThis.exhaustPurchaseOk = exhaustPurchase.ok;
globalThis.exhaustPurchaseFeedback = exhaustPurchase.feedback;
globalThis.exhaustCashAfter = exhaustPurchase.gameState.shop.tips;
globalThis.exhaustPurchasedFlag = exhaustPurchase.gameState.shop.dreamBuild.exhaustPurchased;
globalThis.exhaustLevelAfterPurchase = exhaustPurchase.gameState.shop.dreamBuild.exhaustLevel;
globalThis.exhaustTotalXP = exhaustPurchase.gameState.totalXP;
globalThis.exhaustProjectValue = projectCarValueV1(exhaustPurchase.gameState);
globalThis.exhaustNetWorth = netWorthV1(exhaustPurchase.gameState);
globalThis.exhaustFormulaNetWorth = cashBalance(exhaustPurchase.gameState) + tofuBusinessValue(exhaustPurchase.gameState) + projectCarValueV1(exhaustPurchase.gameState);
globalThis.exhaustCardHtml = renderDreamInvestmentTargetCard(exhaustPurchase.gameState);
globalThis.exhaustProgressSummary = dreamBuildProgressSummary(exhaustPurchase.gameState);
globalThis.exhaustProgressCardHtml = renderDreamBuildProgressCard(exhaustPurchase.gameState);
globalThis.exhaustMilestone = nextMilestoneForShop(exhaustPurchase.gameState);
globalThis.exhaustAction = nextBestAction(exhaustPurchase.gameState);
globalThis.secondExhaustPurchase = buyDreamBuildExhaust("buy-exhaust", exhaustPurchase.gameState);
const oldExhaustSave = JSON.parse(JSON.stringify(exhaustPurchase.gameState));
delete oldExhaustSave.shop.dreamBuild.exhaustLevel;
globalThis.oldExhaustLevel = dreamBuildExhaustLevel(oldExhaustSave);
const sealReady = JSON.parse(JSON.stringify(exhaustPurchase.gameState));
sealReady.shop.tips = 500000;
globalThis.sealReadyCardHtml = renderDreamInvestmentTargetCard(sealReady);
globalThis.sealReadyMilestone = nextMilestoneForShop(sealReady);
globalThis.sealReadyAction = nextBestAction(sealReady);
globalThis.sealReadyNote = dreamInvestmentReturningNote(sealReady);
const sealResult = buyDreamBuildExhaust("seal-joints", sealReady, { now: new Date("2026-06-18T16:00:00Z") });
globalThis.sealOk = sealResult.ok;
globalThis.sealFeedback = sealResult.feedback;
globalThis.sealCashAfter = sealResult.gameState.shop.tips;
globalThis.sealExhaustLevel = sealResult.gameState.shop.dreamBuild.exhaustLevel;
globalThis.sealTotalXP = sealResult.gameState.totalXP;
globalThis.sealProjectValue = projectCarValueV1(sealResult.gameState);
globalThis.sealNetWorth = netWorthV1(sealResult.gameState);
globalThis.sealFormulaNetWorth = cashBalance(sealResult.gameState) + tofuBusinessValue(sealResult.gameState) + projectCarValueV1(sealResult.gameState);
globalThis.sealCardHtml = renderDreamInvestmentTargetCard(sealResult.gameState);
globalThis.sealProgressSummary = dreamBuildProgressSummary(sealResult.gameState);
globalThis.sealProgressCardHtml = renderDreamBuildProgressCard(sealResult.gameState);
globalThis.sealDreamNote = dreamInvestmentReturningNote(sealResult.gameState);
globalThis.sealMilestone = nextMilestoneForShop(sealResult.gameState);
globalThis.sealAction = nextBestAction(sealResult.gameState);
globalThis.secondSeal = buyDreamBuildExhaust("seal-joints", sealResult.gameState);
globalThis.activeExhaustPurchase = buyDreamBuildExhaust("buy-exhaust", exhaustAffordable, { activeDrive: true });
saveGameState(wheelsPurchase.gameState);
const reloadedWheelsState = loadGameState();
globalThis.reloadedWheelsPurchased = reloadedWheelsState.shop.dreamBuild.wheelsPurchased;
globalThis.reloadedWheelsProjectValue = projectCarValueV1(reloadedWheelsState);
globalThis.reloadedWheelsCardHtml = renderDreamInvestmentTargetCard(reloadedWheelsState);
const secondAcknowledge = acknowledgeCoveredCarTeaser(acknowledged.gameState);
globalThis.secondAcknowledgeFeedback = secondAcknowledge.feedback;
globalThis.storyLedgerCount = secondAcknowledge.gameState.shop.ledger.filter((entry) => entry.type === "story").length;

saveGameState(acknowledged.gameState);
renderTofuShop(loadGameState());
globalThis.reloadedOverviewHtml = elements.shopTabPanel.innerHTML;
const offlineDream = JSON.parse(JSON.stringify(acknowledged.gameState));
offlineDream.shop.offlineEarnings = {
  tofuStock: 2500,
  deliveryOrders: 25,
  tips: 4000,
  tofuConsumed: 50,
  cappedHours: 2,
  counterServicePaused: true,
};
renderTofuShop(offlineDream);
globalThis.offlineDreamSummary = elements.shopOfflineEarnings.textContent;
globalThis.offlineDreamMentions = (elements.shopOfflineEarnings.textContent.match(/Wheels Fund/g) || []).length;
appState.running = true;
appState.shopTab = "overview";
renderTofuShop(highProgress);
globalThis.activeStoryOverviewHtml = elements.shopTabPanel.innerHTML;
globalThis.activeDreamCardHtml = renderDreamInvestmentTargetCard(highProgress);
globalThis.activeDreamBuildProgressCard = renderDreamBuildProgressCard(sealResult.gameState);
`, context);

  assert.strictEqual(context.freshCoveredUnlocked, false);
  assert.strictEqual(context.freshCoveredCard, '');
  assert.strictEqual(context.freshDreamVisible, false);
  assert.strictEqual(context.freshDreamBuildProgressVisible, false);
  assert.strictEqual(context.freshDreamBuildProgressCard, '');
  assert.strictEqual(context.earlyCoveredUnlocked, false);
  assert.strictEqual(context.earlyScene, 'scene_tiny_shop_upgraded');
  assert.strictEqual(context.highCoveredUnlocked, true);
  assert.strictEqual(context.highCoveredSeen, false);
  assert.strictEqual(context.highDreamVisible, true);
  assert.strictEqual(context.highDreamProgress.required, 50000);
  assert.strictEqual(context.highDreamProgress.ready, false);
  assert.strictEqual(context.freshProjectCarValue, 0);
  assert.strictEqual(context.freshProjectCarCard, '');
  assert(context.highDreamCardHtml.includes('First Dream Investment'));
  assert(context.highDreamCardHtml.includes('Wheels Fund'));
  assert(context.highDreamCardHtml.includes('$0 / $50K'));
  assert(context.highDreamCardHtml.includes('Cash from the shop'));
  assert(!context.highDreamCardHtml.includes('Tips'));
  assert(context.highDreamCardHtml.includes('Save Cash from the shop'));
  assert(!context.highDreamCardHtml.includes('Buy Wheels'));
  assert.strictEqual(context.partialDreamProgress.current, 32000);
  assert.strictEqual(context.partialDreamProgress.required, 50000);
  assert.strictEqual(context.partialDreamProgress.percent, 64);
  assert(context.partialDreamCardHtml.includes('$32K / $50K'));
  assert(context.partialDreamCardHtml.includes('64%'));
  assert.strictEqual(context.affordableDreamProgress.ready, true);
  assert(context.affordableDreamCardHtml.includes('Wheels Ready'));
  assert(context.affordableDreamCardHtml.includes('$50K / $50K'));
  assert(!context.affordableDreamCardHtml.includes('Buy Wheels'));
  assert.strictEqual(context.highMilestone.id, 'covered_car_teaser');
  assert.strictEqual(context.highMilestone.name, 'Look Behind the Shop');
  assert.strictEqual(context.highAction.type, 'covered_car_teaser');
  assert.strictEqual(context.highAction.buttonLabel, 'Look Behind the Shop');
  assert.notStrictEqual(context.urgentQueueAction.type, 'covered_car_teaser');
  assert.notStrictEqual(context.urgentQueueAction.type, 'dream_investment_target');
  assert.notStrictEqual(context.urgentQueueMilestone.id, 'dream_investment_wheels');
  assert(context.urgentQueueAction.title.includes('Clear the Order Queue') || context.urgentQueueAction.copy.includes('queue is full'));
  assert.notStrictEqual(context.urgentAffordableQueueAction.type, 'buy_dream_wheels');
  assert(context.highCardHtml.includes('Behind the Shop'));
  assert(context.highCardHtml.includes('Dream Build: Not ready yet'));
  assert(context.highCardHtml.includes('The Tofu Shop is not the destination'));
  assert(context.storyOverviewHtml.includes('Behind the shop'));
  assert(context.storyOverviewHtml.includes('old car waits under a cover'));
  assert(!context.storyTabsHtml.includes('Dream Garage'));
  assert(!context.storyOverviewHtml.includes('Buy Car Part'));
  assert(context.storyOverviewHtml.includes('Net Worth'));
  assert(context.storyOverviewHtml.includes('Cash + Tofu Business Value'));
  assert(!context.storyOverviewHtml.includes('Car Asset Value'));
  assert.strictEqual(context.highSceneId, 'scene_busy_shop_with_covered_car');
  assert(context.highSceneHtml.includes('/static/nospill/images/scene_busy_shop_with_covered_car.webp'));
  assert.strictEqual(context.acknowledgedOk, true);
  assert(context.acknowledgedFeedback.includes('Story beat unlocked'));
  assert.strictEqual(context.acknowledgedSeen, true);
  assert(context.acknowledgedIds.includes('dream_build_teaser_v1'));
  assert.strictEqual(context.acknowledgedDreamVisible, true);
  assert(context.acknowledgedDreamCardHtml.includes('Wheels Fund'));
  assert.strictEqual(context.acknowledgedDreamProgressVisible, true);
  assert.strictEqual(context.acknowledgedDreamProgressSummary.completed, 0);
  assert.strictEqual(context.acknowledgedDreamProgressSummary.total, 30);
  assert.strictEqual(context.acknowledgedDreamProgressSummary.percent, 0);
  assert(context.acknowledgedDreamProgressCard.includes('Dream Build Progress'));
  assert(context.acknowledgedDreamProgressCard.includes('0 / 30 work stages'));
  assert(context.acknowledgedDreamProgressCard.includes('Next Dream Step: Wheels Fund'));
  assert(context.acknowledgedDreamNote.includes('Wheels Fund'));
  assert.strictEqual(context.acknowledgedMilestone.id, 'dream_investment_wheels');
  assert.strictEqual(context.acknowledgedMilestone.name, 'Save for Wheels');
  assert.strictEqual(context.acknowledgedBusyAction.type, 'wait_counter_service');
  assert.strictEqual(context.acknowledgedBusyAction.buttonLabel, 'Counter Service Running');
  assert.strictEqual(context.stableDreamMilestone.id, 'dream_investment_wheels');
  assert.strictEqual(context.stableDreamAction.type, 'dream_investment_target');
  assert.strictEqual(context.stableDreamAction.buttonLabel, 'View Wheels Fund');
  assert.strictEqual(context.stableAffordableDreamMilestone.id, 'dream_investment_buy_wheels');
  assert.strictEqual(context.stableAffordableDreamMilestone.name, 'Buy Wheels');
  assert.strictEqual(context.stableAffordableDreamAction.type, 'buy_dream_wheels');
  assert.strictEqual(context.stableAffordableDreamAction.buttonLabel, 'Buy Wheels');
  assert(context.stableAffordableDreamCardHtml.includes('Buy Wheels'));
  assert.strictEqual(context.wheelsPurchaseOk, true);
  assert.strictEqual(context.wheelsPurchaseFeedback, 'Dream Build started: Wheels installed.');
  assert.strictEqual(context.wheelsCashAfter, 25000);
  assert.strictEqual(context.wheelsPurchasedFlag, true);
  assert.strictEqual(context.wheelsLevelAfterPurchase, 1);
  assert(context.wheelsPurchasedAt.includes('2026-06-18'));
  assert.strictEqual(context.wheelsTotalXP, 0);
  assert.strictEqual(context.wheelsProjectCarValue, 25000);
  assert.strictEqual(context.wheelsNetWorth, context.wheelsFormulaNetWorth);
  assert.strictEqual(context.oldWheelsLevel, 1);
  assert(context.wheelsCardHtml.includes('Wheels Installed'));
  assert(context.wheelsCardHtml.includes('Level 1 / 5'));
  assert(context.wheelsCardHtml.includes('Next Work: Polish Wheels'));
  assert(context.wheelsCardHtml.includes('Cost: $75K Cash'));
  assert(context.wheelsCardHtml.includes('Value added: +$40K'));
  assert(!context.wheelsCardHtml.includes('Buy Exhaust'));
  assert.strictEqual(context.wheelsProgressSummary.completed, 1);
  assert.strictEqual(context.wheelsProgressSummary.total, 30);
  assert.strictEqual(context.wheelsProgressSummary.percent, 3);
  assert(context.wheelsProgressCardHtml.includes('Dream Build Progress'));
  assert(context.wheelsProgressCardHtml.includes('1 / 30 work stages'));
  assert(context.wheelsProgressCardHtml.includes('aria-valuenow="1"'));
  assert(context.wheelsProgressCardHtml.includes('aria-valuemax="30"'));
  assert(context.wheelsProgressCardHtml.includes('Wheels · Level 1 / 5 · Wheels Installed'));
  assert(context.wheelsProgressCardHtml.includes('Exhaust · Level 0 / 5 · Not started'));
  assert(context.wheelsProgressCardHtml.includes('Next Dream Step: Polish Wheels'));
  assert(context.wheelsProgressCardHtml.includes('More build tracks unlock later'));
  assert(!context.wheelsProgressCardHtml.includes('Buy Suspension'));
  assert(!context.wheelsProgressCardHtml.includes('Buy Brakes'));
  assert(!context.wheelsProgressCardHtml.includes('Buy Turbo'));
  assert(context.wheelsProjectCardHtml.includes('Project Car Value'));
  assert(context.wheelsProjectCardHtml.includes('$25K'));
  assert(context.wheelsNetWorthCardHtml.includes('Project Car Value'));
  assert(context.wheelsNetWorthCardHtml.includes('$25K'));
  assert.strictEqual(context.wheelsMilestone.id, 'polish-wheels');
  assert.strictEqual(context.wheelsAction.type, 'buy_dream_wheels_work');
  assert.strictEqual(context.secondWheelsPurchase.ok, false);
  assert(context.polishReadyCardHtml.includes('Polish Wheels'));
  assert.strictEqual(context.polishReadyMilestone.id, 'polish-wheels');
  assert.strictEqual(context.polishReadyAction.type, 'buy_dream_wheels_work');
  assert.strictEqual(context.polishReadyAction.buttonLabel, 'Polish Wheels');
  assert.strictEqual(context.polishReadyNote, 'Dream Build work is ready: Polish Wheels');
  assert.notStrictEqual(context.urgentPolishAction.type, 'buy_dream_wheels_work');
  assert.strictEqual(context.polishOk, true);
  assert.strictEqual(context.polishCashAfter, 25000);
  assert.strictEqual(context.polishLevel, 2);
  assert.strictEqual(context.polishProjectValue, 65000);
  assert.strictEqual(context.polishNetWorth, context.polishFormulaNetWorth);
  assert(context.polishCardHtml.includes('Polished Wheels'));
  assert(context.polishCardHtml.includes('Level 2 / 5'));
  assert(context.polishCardHtml.includes('Next Work: Balanced Fitment'));
  assert(context.polishCardHtml.includes('Cost: $150K Cash'));
  assert(context.polishCardHtml.includes('Value added: +$85K'));
  assert(context.fitmentReadyCardHtml.includes('Balance Fitment'));
  assert.strictEqual(context.fitmentReadyMilestone.id, 'balance-fitment');
  assert.strictEqual(context.fitmentReadyAction.type, 'buy_dream_wheels_work');
  assert.strictEqual(context.fitmentReadyAction.buttonLabel, 'Balance Fitment');
  assert.strictEqual(context.fitmentReadyNote, 'Dream Build work is ready: Balanced Fitment');
  assert.strictEqual(context.fitmentOk, true);
  assert.strictEqual(context.fitmentCashAfter, 50000);
  assert.strictEqual(context.fitmentLevel, 3);
  assert.strictEqual(context.fitmentProjectValue, 150000);
  assert.strictEqual(context.fitmentNetWorth, context.fitmentFormulaNetWorth);
  assert.strictEqual(context.fitmentProgressSummary.completed, 3);
  assert.strictEqual(context.fitmentProgressSummary.total, 30);
  assert.strictEqual(context.fitmentProgressSummary.percent, 10);
  assert(context.fitmentProgressCardHtml.includes('3 / 30 work stages'));
  assert(context.fitmentProgressCardHtml.includes('Wheels · Level 3 / 5 · Balanced Fitment'));
  assert(context.fitmentProgressCardHtml.includes('Next Dream Step: Buy Exhaust'));
  assert(context.fitmentCardHtml.includes('Balanced Fitment'));
  assert(context.fitmentCardHtml.includes('Level 3 / 5'));
  assert(context.fitmentCardHtml.includes('Next Dream Part: Exhaust'));
  assert(context.fitmentCardHtml.includes('Cost: $250K Cash'));
  assert(context.fitmentCardHtml.includes('Value added: +$125K'));
  assert(context.fitmentCardHtml.includes('Need $200K more Cash.'));
  assert(!context.fitmentCardHtml.includes('Buy Exhaust'));
  assert.strictEqual(context.fitmentMilestone.id, 'dream_investment_buy_exhaust');
  assert.strictEqual(context.fitmentMilestone.name, 'Save for Exhaust');
  assert.strictEqual(context.fitmentAction.type, 'dream_investment_target');
  assert.strictEqual(context.fitmentAction.title, 'Next: Grow Cash for Exhaust');
  assert.strictEqual(context.secondFitment.ok, false);
  assert(context.polishCardHtml.includes('Balanced Fitment'));
  assert(!context.polishCardHtml.includes('Next Dream Part: Exhaust'));
  assert(context.exhaustLowCardHtml.includes('Next Dream Part: Exhaust'));
  assert(context.exhaustLowCardHtml.includes('Need $200K more Cash.'));
  assert(!context.exhaustLowCardHtml.includes('Buy Exhaust'));
  assert.strictEqual(context.exhaustLowMilestone.name, 'Save for Exhaust');
  assert.strictEqual(context.exhaustLowAction.title, 'Next: Grow Cash for Exhaust');
  assert(context.exhaustAffordableCardHtml.includes('Buy Exhaust'));
  assert.strictEqual(context.exhaustAffordableMilestone.name, 'Buy Exhaust');
  assert.strictEqual(context.exhaustAffordableAction.type, 'buy_dream_exhaust');
  assert.strictEqual(context.exhaustAffordableAction.buttonLabel, 'Buy Exhaust');
  assert.strictEqual(context.exhaustAffordableNote, 'Dream Build work is ready: Exhaust Fitted');
  assert.notStrictEqual(context.urgentExhaustAction.type, 'buy_dream_exhaust');
  assert.strictEqual(context.exhaustPurchaseOk, true);
  assert.strictEqual(context.exhaustPurchaseFeedback, 'Dream Build: Exhaust fitted.');
  assert.strictEqual(context.exhaustCashAfter, 50000);
  assert.strictEqual(context.exhaustPurchasedFlag, true);
  assert.strictEqual(context.exhaustLevelAfterPurchase, 1);
  assert.strictEqual(context.exhaustTotalXP, 0);
  assert.strictEqual(context.exhaustProjectValue, 275000);
  assert.strictEqual(context.exhaustNetWorth, context.exhaustFormulaNetWorth);
  assert.strictEqual(context.exhaustProgressSummary.completed, 4);
  assert.strictEqual(context.exhaustProgressSummary.total, 30);
  assert(context.exhaustProgressCardHtml.includes('4 / 30 work stages'));
  assert(context.exhaustProgressCardHtml.includes('Exhaust · Level 1 / 5 · Exhaust Fitted'));
  assert(context.exhaustProgressCardHtml.includes('Next Dream Step: Seal Joints'));
  assert.strictEqual(context.oldExhaustLevel, 1);
  assert(context.exhaustCardHtml.includes('Exhaust Fitted'));
  assert(context.exhaustCardHtml.includes('Exhaust Level 1 / 5'));
  assert(context.exhaustCardHtml.includes('Next Work: Sealed Joints'));
  assert(context.exhaustCardHtml.includes('Cost: $375K Cash'));
  assert(context.exhaustCardHtml.includes('Value added: +$200K'));
  assert.strictEqual(context.exhaustMilestone.id, 'seal-joints');
  assert.strictEqual(context.exhaustAction.type, 'buy_dream_exhaust_work');
  assert.strictEqual(context.exhaustAction.buttonLabel, 'Seal Joints');
  assert.strictEqual(context.secondExhaustPurchase.ok, false);
  assert(context.sealReadyCardHtml.includes('Seal Joints'));
  assert.strictEqual(context.sealReadyMilestone.id, 'seal-joints');
  assert.strictEqual(context.sealReadyAction.type, 'buy_dream_exhaust_work');
  assert.strictEqual(context.sealReadyAction.buttonLabel, 'Seal Joints');
  assert.strictEqual(context.sealReadyNote, 'Dream Build work is ready: Sealed Joints');
  assert.strictEqual(context.sealOk, true);
  assert.strictEqual(context.sealFeedback, 'Dream Build: Exhaust joints sealed.');
  assert.strictEqual(context.sealCashAfter, 125000);
  assert.strictEqual(context.sealExhaustLevel, 2);
  assert.strictEqual(context.sealTotalXP, 0);
  assert.strictEqual(context.sealProjectValue, 475000);
  assert.strictEqual(context.sealNetWorth, context.sealFormulaNetWorth);
  assert.strictEqual(context.sealProgressSummary.completed, 5);
  assert.strictEqual(context.sealProgressSummary.total, 30);
  assert.strictEqual(context.sealProgressSummary.percent, 17);
  assert(context.sealProgressCardHtml.includes('Dream Build Progress'));
  assert(context.sealProgressCardHtml.includes('5 / 30 work stages'));
  assert(context.sealProgressCardHtml.includes('Wheels · Level 3 / 5 · Balanced Fitment'));
  assert(context.sealProgressCardHtml.includes('Exhaust · Level 2 / 5 · Sealed Joints'));
  assert(context.sealProgressCardHtml.includes('Next Dream Step: Tuned Note · future'));
  assert(context.sealProgressCardHtml.includes('future Dream Garage pass'));
  assert(context.sealProgressCardHtml.includes('Project Car Value: $475K'));
  assert(context.sealProgressCardHtml.includes('Net Worth includes Cash + Tofu Business Value + Project Car Value'));
  assert(!context.sealProgressCardHtml.includes('Tune Note'));
  assert(!context.sealProgressCardHtml.includes('Buy Tuned Note'));
  assert(!context.sealProgressCardHtml.includes('Buy Suspension'));
  assert(!context.sealProgressCardHtml.includes('partsInventory'));
  assert.strictEqual(context.sealDreamNote, 'Next Dream Step: Tuned Note, future.');
  assert(context.sealCardHtml.includes('Sealed Joints'));
  assert(context.sealCardHtml.includes('Exhaust Level 2 / 5'));
  assert(context.sealCardHtml.includes('Exhaust work is complete for now'));
  assert(context.sealCardHtml.includes('Next Exhaust Work: Tuned Note'));
  assert(context.sealCardHtml.includes('Full Dream Garage comes later'));
  assert(!context.sealCardHtml.includes('Tune Note'));
  assert(!context.sealCardHtml.includes('Buy Tuned Note'));
  assert.strictEqual(context.sealMilestone.id, 'prepare_showcase_display');
  assert.strictEqual(context.sealMilestone.name, 'Prepare Showcase Display');
  assert.strictEqual(context.sealMilestone.reward, 'Project Car Value +$300K');
  assert.strictEqual(context.sealAction.type, 'showcase_prep_target');
  assert.strictEqual(context.sealAction.title, 'Next: Save Cash for Showcase Prep');
  assert(context.sealAction.copy.includes('Prepare it for its first display'));
  assert.strictEqual(context.secondSeal.ok, false);
  assert.strictEqual(context.activeExhaustPurchase.ok, false);
  assert.strictEqual(context.reloadedWheelsPurchased, true);
  assert.strictEqual(context.reloadedWheelsProjectValue, 25000);
  assert(context.reloadedWheelsCardHtml.includes('Wheels Installed'));
  assert.strictEqual(context.acknowledgedNetWorth, context.acknowledgedFormulaNetWorth);
  assert(context.secondAcknowledgeFeedback.includes('covered car waits'));
  assert.strictEqual(context.storyLedgerCount, 1);
  assert(context.reloadedOverviewHtml.includes('old car waits under a cover'));
  assert(context.reloadedOverviewHtml.includes('First Dream Investment'));
  assert(context.offlineDreamSummary.includes('Wheels Fund'));
  assert.strictEqual(context.offlineDreamMentions, 1);
  assert(!context.reloadedOverviewHtml.includes('Look Behind the Shop</button>'));
  assert(!context.activeStoryOverviewHtml.includes('old car waits under a cover'));
  assert(!context.activeStoryOverviewHtml.includes('First Dream Investment'));
  assert.strictEqual(context.activeDreamCardHtml, '');
  assert.strictEqual(context.activeDreamBuildProgressCard, '');
  assert(!context.storyOverviewHtml.includes('Dream Garage'));
  assert(!context.storyOverviewHtml.includes('Buy Wheels'));
  assert(!context.storyOverviewHtml.includes('wheelsOwned'));
  assert(!context.storyOverviewHtml.includes('partsInventory'));
  assert(!context.storyOverviewHtml.includes('Driver XP'));

  const css = fs.readFileSync(path.join(NOSPILL_DIR, 'app.css'), 'utf8');
  assert(css.includes('.nospill-shop-tab-list button:focus-visible'));
  assert(css.includes('.nospill-shop-tab-list button.is-newly-revealed'));
  assert(css.includes('.nospill-tab-badge'));
  assert(!css.includes('.nospill-shop-tabs button.is-revealed'));
}

function testShopOrderTypeProgressionAndRewards() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });

  const fresh = context.defaultGameState();
  assert.strictEqual(fresh.shop.tofuStock, 24);
  assert.strictEqual(fresh.shop.deliveryOrders, 1);
  assert.strictEqual(fresh.shop.stations.tofu_press, 1);
  assert.strictEqual(fresh.shop.stations.prep_counter, 1);
  assert.strictEqual(fresh.shop.tips, 0);
  assert.strictEqual(fresh.shop.reputation, 0);
  assert.strictEqual(fresh.shop.shopXP, 0);
  assert.strictEqual(fresh.totalXP, 0);
  const simple = context.fulfillShopOrder(fresh, { activeDrive: false });
  assert.strictEqual(simple.ok, true);
  assert.strictEqual(simple.orderType.id, 'simple_tofu_box');
  assert.strictEqual(simple.tipsGained, 10);
  assert.strictEqual(simple.reputationGained, 1);
  assert.strictEqual(simple.xpGained, 8);
  assert.strictEqual(simple.shopXpGained, 8);
  assert.strictEqual(simple.gameState.shop.shopXP, 8);
  assert.strictEqual(simple.gameState.totalXP, 0);
  assert.strictEqual(simple.deliveryOrdersUsed, 1);
  assert.strictEqual(simple.tofuUsed, 6);
  assert.strictEqual(simple.gameState.shop.deliveryOrders, 0);
  assert.strictEqual(simple.gameState.shop.tofuStock, 18);
  assert.strictEqual(simple.firstShopOrderStampUnlocked, true);
  assert.strictEqual(Boolean(simple.gameState.stamps.first_shop_order), true);
  assert(simple.report.includes('First Shop Order stamp discovered'));
  assert(simple.gameState.shop.ledger[0].text.includes('First Shop Order stamp earned'));

  const firstLoopTickSource = JSON.parse(JSON.stringify(simple.gameState));
  firstLoopTickSource.shop.lastGeneratorTickAt = '2026-06-15T12:00:00.000Z';
  const secondOrderReady = context.applyShopGeneratorTick(
    firstLoopTickSource,
    new Date('2026-06-15T12:00:40.000Z'),
  ).gameState;
  assert(secondOrderReady.shop.deliveryOrders >= 1);
  const secondSimple = context.fulfillShopOrder(secondOrderReady, { activeDrive: false });
  assert.strictEqual(secondSimple.ok, true);
  assert.strictEqual(secondSimple.gameState.shop.tips, 20);
  assert.strictEqual(secondSimple.gameState.shop.lifetimeTofuPacked, 0);
  const baseRate = context.getShopGeneratorRates(secondSimple.gameState).prepOrdersPerSecond;
  const firstUpgrade = context.buyStationUpgrade('prep_counter_faster', secondSimple.gameState);
  assert.strictEqual(firstUpgrade.ok, true);
  assert.strictEqual(firstUpgrade.costTips, 20);
  assert(context.getShopGeneratorRates(firstUpgrade.gameState).prepOrdersPerSecond > baseRate);

  const richStock = context.defaultGameState();
  richStock.shop.tofuStock = 1000;
  const richSimple = context.fulfillShopOrder(richStock, { activeDrive: false });
  assert.strictEqual(richSimple.tipsGained, 10, 'raw stock should not multiply simple order tips');

  const familySource = context.defaultGameState();
  familySource.shop.tofuStock = 100;
  familySource.shop.deliveryOrders = 5;
  const fiveSimple = context.fulfillShopOrders(familySource, 'max', {
    activeDrive: false,
    orderTypeId: 'simple_tofu_box',
  }).gameState;
  const familyType = context.getShopOrderTypes().find((orderType) => orderType.id === 'family_tofu_tray');
  assert.strictEqual(context.shopOrderTypeUnlocked(familyType, fiveSimple), true);
  fiveSimple.shop.tofuStock = 48;
  fiveSimple.shop.deliveryOrders = 2;
  const family = context.fulfillShopOrders(fiveSimple, 1, {
    activeDrive: false,
    orderTypeId: 'family_tofu_tray',
  });
  assert.strictEqual(family.ok, true);
  assert.strictEqual(family.orderType.id, 'family_tofu_tray');
  assert.strictEqual(family.tipsGained, 45);
  assert.strictEqual(family.reputationGained, 3);
  assert.strictEqual(family.xpGained, 24);
  assert.strictEqual(family.deliveryOrdersUsed, 1);
  assert.strictEqual(family.tofuUsed, 24);
  assert.strictEqual(family.gameState.shop.tofuStock, 24);
  assert.strictEqual(family.gameState.shop.deliveryOrders, 1);

  const missingStock = JSON.parse(JSON.stringify(fiveSimple));
  missingStock.shop.tofuStock = 20;
  missingStock.shop.deliveryOrders = 1;
  const blockedFamily = context.fulfillShopOrders(missingStock, 1, {
    activeDrive: false,
    orderTypeId: 'family_tofu_tray',
  });
  assert.strictEqual(blockedFamily.ok, false);
  assert(blockedFamily.reason.includes('Need 4 more tofu stock'));

  const missingReadyOrders = JSON.parse(JSON.stringify(fiveSimple));
  missingReadyOrders.shop.tofuStock = 24;
  missingReadyOrders.shop.deliveryOrders = 0;
  const blockedFamilyOrders = context.fulfillShopOrders(missingReadyOrders, 1, {
    activeDrive: false,
    orderTypeId: 'family_tofu_tray',
  });
  assert.strictEqual(blockedFamilyOrders.ok, false);
  assert(blockedFamilyOrders.reason.includes('Need 1 prepared order'));

  const festivalSource = context.defaultGameState();
  festivalSource.shop.reputation = 50;
  festivalSource.shop.tofuStock = 75;
  festivalSource.shop.deliveryOrders = 2;
  const festivalType = context.getShopOrderTypes().find((orderType) => orderType.id === 'festival_bento');
  assert.strictEqual(context.shopOrderTypeUnlocked(festivalType, festivalSource), true);
  const festival = context.fulfillShopOrders(festivalSource, 1, {
    activeDrive: false,
    orderTypeId: 'festival_bento',
  });
  assert.strictEqual(festival.ok, true);
  assert.strictEqual(festival.orderType.id, 'festival_bento');
  assert.strictEqual(festival.tipsGained, 130);
  assert.strictEqual(festival.reputationGained, 8);
  assert.strictEqual(festival.xpGained, 70);
  assert.strictEqual(festival.deliveryOrdersUsed, 2);
  assert.strictEqual(festival.tofuUsed, 75);
  assert.strictEqual(festival.gameState.shop.tofuStock, 0);
  assert.strictEqual(festival.gameState.shop.deliveryOrders, 0);

  const cateringType = context.getShopOrderTypes().find((orderType) => orderType.id === 'catering_crate');
  const cateringLocked = context.defaultGameState();
  cateringLocked.shop.lifetimeDeliveryOrders = 99;
  cateringLocked.shop.reputation = 250;
  cateringLocked.shop.shopLevel = 25;
  assert.strictEqual(context.shopOrderTypeUnlocked(cateringType, cateringLocked), false);
  const cateringSource = context.defaultGameState();
  cateringSource.shop.lifetimeDeliveryOrders = 100;
  cateringSource.shop.reputation = 20000;
  cateringSource.shop.shopLevel = context.getShopLevel(cateringSource.shop.reputation);
  cateringSource.shop.tofuStock = 240;
  cateringSource.shop.deliveryOrders = 5;
  assert.strictEqual(context.shopOrderTypeUnlocked(cateringType, cateringSource), true);
  const catering = context.fulfillShopOrders(cateringSource, 1, {
    activeDrive: false,
    orderTypeId: 'catering_crate',
  });
  assert.strictEqual(catering.ok, true);
  assert.strictEqual(catering.orderType.id, 'catering_crate');
  assert.strictEqual(catering.tipsGained, 520);
  assert.strictEqual(catering.reputationGained, 25);
  assert.strictEqual(catering.xpGained, 260);
  assert.strictEqual(catering.deliveryOrdersUsed, 5);
  assert.strictEqual(catering.tofuUsed, 240);

  const maxFamilySource = JSON.parse(JSON.stringify(fiveSimple));
  maxFamilySource.shop.tofuStock = 96;
  maxFamilySource.shop.deliveryOrders = 4;
  const best = context.bestFulfillableShopOrderType(maxFamilySource);
  assert.strictEqual(best.id, 'family_tofu_tray');
  assert.strictEqual(context.maxFulfillableShopOrderQuantity(maxFamilySource, best), 4);
  const maxFamily = context.fulfillShopOrders(maxFamilySource, 'max', { activeDrive: false });
  assert.strictEqual(maxFamily.orderType.id, 'family_tofu_tray');
  assert.strictEqual(maxFamily.quantity, 4);
  assert.strictEqual(maxFamily.tipsGained, 180);
  assert.strictEqual(maxFamily.reputationGained, 12);
  assert.strictEqual(maxFamily.xpGained, 96);
  assert.strictEqual(maxFamily.tofuUsed, 96);
  assert.strictEqual(maxFamily.deliveryOrdersUsed, 4);

  const nextFamily = context.nextBestAction(maxFamilySource, {
    date: new Date('2026-06-15T12:00:00.000Z'),
  });
  assert.strictEqual(nextFamily.type, 'wait_counter_service');
  assert.strictEqual(nextFamily.title, 'Next: Let Counter Service work');
  assert(nextFamily.copy.includes('Counter Service'));

  vm.runInContext(`
function makeNode() {
  const node = {
    textContent: "",
    innerHTML: "",
    disabled: null,
    dataset: {},
    classListValue: null,
    value: "",
  };
  node.classList = {
    toggle(_className, hidden) {
      node.classListValue = Boolean(hidden);
    },
  };
  node.querySelector = () => null;
  return node;
}
elements = {
  surfaceNavButtons: [],
  surfaceSections: [],
  deliveryBoardSection: makeNode(),
  tofuShopSection: makeNode(),
  collectionSection: makeNode(),
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopReach: makeNode(),
  shopSpirit: makeNode(),
  shopLicenseStars: makeNode(),
  shopBuyMultiplier: makeNode(),
  packTofuButton: makeNode(),
  fulfillShopOrderButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  shopUpgradeList: makeNode(),
  shopGeneratorList: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopOfflineEarnings: makeNode(),
  deliveryWallGrid: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
const freshRendered = defaultGameState();
appState.shopTab = "orders";
renderTofuShop(freshRendered);
globalThis.freshOrderTypePanelHtml = elements.shopTabPanel.innerHTML;
globalThis.freshOrderTypeTab = appState.shopTab;
const rendered = defaultGameState();
rendered.shop.tofuStock = 96;
rendered.shop.deliveryOrders = 4;
rendered.shop.lifetimeDeliveryOrders = 5;
appState.shopTab = "orders";
renderTofuShop(rendered);
globalThis.orderTypePanelHtml = elements.shopTabPanel.innerHTML;
globalThis.orderTypeTab = appState.shopTab;
globalThis.orderTypeTabsHtml = elements.shopTabList.innerHTML;
`, context);
  assert.strictEqual(context.freshOrderTypeTab, 'overview');
  assert.strictEqual(context.orderTypeTab, 'overview');
  assert(!context.orderTypeTabsHtml.includes('>Orders<'));
  assert(context.freshOrderTypePanelHtml.includes('Simple Tofu Box'));
  assert(!context.freshOrderTypePanelHtml.includes('Fulfill Simple Tofu Box'));
  assert(!context.freshOrderTypePanelHtml.includes('Family Tofu Tray'));
  assert(!context.freshOrderTypePanelHtml.includes('Festival Bento'));
  assert(!context.freshOrderTypePanelHtml.includes('Catering Crate'));
  assert(context.orderTypePanelHtml.includes('Tofu Stock feeds Prep Counter and larger orders. Counter Service turns prepared orders into Cash from tips.'));
  assert(context.orderTypePanelHtml.includes('Family Tofu Tray'));
  assert(context.orderTypePanelHtml.includes('Uses 24 tofu stock and 1 ready order.'));
  assert(context.orderTypePanelHtml.includes('Reward: +$45 from tips, +3 Reputation, +24 Shop XP.'));
  assert(!context.orderTypePanelHtml.includes('Fulfill Max Family Tofu Tray x4'));
  assert(!context.orderTypePanelHtml.includes('Catering Crate'));
  assert(!context.orderTypePanelHtml.includes('Production'));
  assert(!context.orderTypePanelHtml.includes('Station Upgrades'));
  assert(!context.orderTypePanelHtml.includes('Buy Tofu Press'));
}

function testCoreGameSpineV1MilestonesAndSupportStations() {
  assert(fs.existsSync(path.join(ROOT, 'CORE_GAME_SPINE_AUDIT.md')));
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });

  const fresh = context.defaultGameState();
  assert.strictEqual(fresh.shop.tofuStock, 24);
  assert.strictEqual(fresh.shop.deliveryOrders, 1);
  const first = context.fulfillShopOrders(fresh, 1, {
    activeDrive: false,
    orderTypeId: 'simple_tofu_box',
  });
  assert.strictEqual(first.ok, true);
  assert.strictEqual(Boolean(first.gameState.stamps.first_shop_order), true);

  const upgradeSource = JSON.parse(JSON.stringify(first.gameState));
  upgradeSource.shop.tips = 20;
  const basePrepRate = context.getShopGeneratorRates(upgradeSource).prepOrdersPerSecond;
  const tidy = context.buyStationUpgrade('prep_counter_faster', upgradeSource);
  assert.strictEqual(tidy.ok, true);
  assert.strictEqual(Boolean(tidy.gameState.stamps.first_upgrade_purchased), true);
  assert(tidy.gameState.shop.ledger.some((entry) => entry.text.includes('First Upgrade Purchased stamp earned')));
  assert(context.getShopGeneratorRates(tidy.gameState).prepOrdersPerSecond > basePrepRate);

  const lowStock = JSON.parse(JSON.stringify(tidy.gameState));
  lowStock.shop.tofuStock = 1;
  lowStock.shop.deliveryOrders = 0;
  lowStock.shop.tips = 100;
  const lowStockAction = context.nextBestAction(lowStock, { date: new Date('2026-06-15T12:00:00.000Z') });
  assert(['buy_station', 'buy_upgrade', 'pack_tofu'].includes(lowStockAction.type));
  assert.notStrictEqual(lowStockAction.upgradeId, 'prep_counter_faster');

  const healthyStock = JSON.parse(JSON.stringify(tidy.gameState));
  healthyStock.shop.tofuStock = 120;
  healthyStock.shop.deliveryOrders = 0;
  healthyStock.shop.generatorCarry.deliveryOrders = 0.3;
  healthyStock.shop.tips = 100;
  const healthyAction = context.nextBestAction(healthyStock, { date: new Date('2026-06-15T12:00:00.000Z') });
  assert.notStrictEqual(healthyAction.upgradeId, 'tofu_press_faster');

  const secondStage = JSON.parse(JSON.stringify(tidy.gameState));
  secondStage.shop.tips = 500;
  secondStage.shop.stations.tofu_press = 3;
  secondStage.shop.stations.prep_counter = 2;
  vm.runInContext(`
function makeNode() {
  const node = { textContent: "", innerHTML: "", disabled: null, dataset: {}, classListValue: null, value: "" };
  node.classList = { toggle(_className, hidden) { node.classListValue = Boolean(hidden); } };
  node.querySelector = () => null;
  return node;
}
elements = {
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopInlineResult: makeNode(),
  shopOfflineEarnings: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.shopTab = "upgrades";
renderTofuShop(${JSON.stringify(secondStage)});
globalThis.spineUpgradeHtml = elements.shopTabPanel.innerHTML;
`, context);
  assert(context.spineUpgradeHtml.includes('Double Mold') || context.spineUpgradeHtml.includes('Double Labels'));
  assert(context.spineUpgradeHtml.includes('-&gt;'));

  const tenOrders = context.defaultGameState();
  tenOrders.shop.tofuStock = 500;
  tenOrders.shop.deliveryOrders = 10;
  const tenSimple = context.fulfillShopOrders(tenOrders, 'max', {
    activeDrive: false,
    orderTypeId: 'simple_tofu_box',
  });
  assert.strictEqual(tenSimple.ok, true);
  assert.strictEqual(Boolean(tenSimple.gameState.stamps.first_10_orders), true);
  assert.strictEqual(Boolean(tenSimple.gameState.stamps.first_100_tips), true);

  const familySource = JSON.parse(JSON.stringify(tenSimple.gameState));
  familySource.shop.tofuStock = 100;
  familySource.shop.deliveryOrders = 1;
  const family = context.fulfillShopOrders(familySource, 1, {
    activeDrive: false,
    orderTypeId: 'family_tofu_tray',
  });
  assert.strictEqual(family.ok, true);
  assert.strictEqual(Boolean(family.gameState.stamps.first_family_tofu_tray), true);
  assert(family.gameState.shop.ledger.some((entry) => entry.text.includes('First Family Tofu Tray stamp earned')));

  const earlyShelf = context.buyShopStation('delivery_shelf', first.gameState, 1);
  assert.strictEqual(earlyShelf.ok, false);
  const shelfSource = JSON.parse(JSON.stringify(tenSimple.gameState));
  shelfSource.shop.tips = 200;
  shelfSource.shop.prepSlots = 10;
  const shelfBaseRate = context.getShopGeneratorRates(shelfSource).prepOrdersPerSecond;
  const shelf = context.buyShopStation('delivery_shelf', shelfSource, 1);
  assert.strictEqual(shelf.ok, true);
  assert.strictEqual(shelf.gameState.shop.stations.delivery_shelf, 1);
  assert(context.getShopGeneratorRates(shelf.gameState).prepOrdersPerSecond > shelfBaseRate);

  const signEarly = context.buyShopStation('shop_sign', first.gameState, 1);
  assert.strictEqual(signEarly.ok, false);
  const signSource = JSON.parse(JSON.stringify(shelf.gameState));
  signSource.shop.tips = 300;
  signSource.shop.reputation = 10;
  signSource.shop.prepSlots = 10;
  const sign = context.buyShopStation('shop_sign', signSource, 1);
  assert.strictEqual(sign.ok, true);
  const noSignOrder = JSON.parse(JSON.stringify(signSource));
  noSignOrder.shop.deliveryOrders = 2;
  noSignOrder.shop.tofuStock = 200;
  noSignOrder.shop.reputation = 50;
  const withSignOrder = JSON.parse(JSON.stringify(sign.gameState));
  withSignOrder.shop.deliveryOrders = 2;
  withSignOrder.shop.tofuStock = 200;
  withSignOrder.shop.reputation = 50;
  const festivalNoSign = context.fulfillShopOrders(noSignOrder, 1, {
    activeDrive: false,
    orderTypeId: 'festival_bento',
  });
  const festivalWithSign = context.fulfillShopOrders(withSignOrder, 1, {
    activeDrive: false,
    orderTypeId: 'festival_bento',
  });
  assert.strictEqual(festivalNoSign.ok, true);
  assert.strictEqual(festivalWithSign.ok, true);
  assert(festivalWithSign.reputationGained > festivalNoSign.reputationGained);

  vm.runInContext(`
appState.shopTab = "production";
renderTofuShop(${JSON.stringify(sign.gameState)});
globalThis.spineProductionHtml = elements.shopTabPanel.innerHTML;
appState.shopTab = "passport";
renderTofuShop(${JSON.stringify(family.gameState)});
globalThis.spinePassportHtml = elements.shopTabPanel.innerHTML;
`, context);
  assert(context.spineProductionHtml.includes('Delivery Shelf'));
  assert(context.spineProductionHtml.includes('Shop Sign'));
  assert(!context.spineProductionHtml.includes('Regular Customer'));
  assert(context.spinePassportHtml.includes('First Upgrade Purchased'));
  assert(context.spinePassportHtml.includes('First Family Tofu Tray'));
  assert(!context.spinePassportHtml.includes('Perfect Pour'));
  assert(!context.spinePassportHtml.includes('License Exam'));
}

function testTofuShopNextMilestoneBarGuidesImplementedSpine() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });

  assert.strictEqual(context.clampPercent(-10), 0);
  assert.strictEqual(context.clampPercent(42.4), 42);
  assert.strictEqual(context.clampPercent(150), 100);

  const fresh = context.defaultGameState();
  assert.strictEqual(context.nextMilestoneForShop(fresh).id, 'first_tips_earned');
  assert.strictEqual(context.renderNextMilestoneCard(fresh).includes('First Cash Earned'), true);
  assert.strictEqual(context.renderNextMilestoneCard(fresh).includes('Reward:'), true);
  assert.strictEqual(context.renderNextMilestoneCard(fresh).includes('Net Worth:'), false);

  const afterFirst = context.fulfillShopOrders(fresh, 1, {
    activeDrive: false,
    orderTypeId: 'simple_tofu_box',
  }).gameState;
  assert.strictEqual(context.nextMilestoneForShop(afterFirst).id, 'first_upgrade_purchased');

  const afterUpgrade = JSON.parse(JSON.stringify(afterFirst));
  afterUpgrade.stamps.first_upgrade_purchased = { label: 'First Upgrade Purchased', date: '2026-06-15T12:00:00.000Z' };
  afterUpgrade.shop.stationUpgrades.prep_counter_faster = 1;
  afterUpgrade.shop.lifetimeDeliveryOrders = 7;
  assert.strictEqual(context.nextMilestoneForShop(afterUpgrade).id, 'first_10_orders');

  const afterTen = JSON.parse(JSON.stringify(afterUpgrade));
  afterTen.shop.lifetimeDeliveryOrders = 10;
  afterTen.stamps.first_10_orders = { label: 'First 10 Orders', date: '2026-06-15T12:00:00.000Z' };
  afterTen.shop.tofuStock = 12;
  afterTen.shop.deliveryOrders = 1;
  const familyMilestone = context.nextMilestoneForShop(afterTen);
  assert.strictEqual(familyMilestone.id, 'first_family_tofu_tray');
  assert(familyMilestone.progressText.includes('Need 24 Tofu Stock and 1 ready order'));
  assert(familyMilestone.percent >= 0 && familyMilestone.percent <= 100);

  const afterFamily = JSON.parse(JSON.stringify(afterTen));
  afterFamily.stamps.first_family_tofu_tray = { label: 'First Family Tofu Tray', date: '2026-06-15T12:00:00.000Z' };
  afterFamily.shop.lifetimeTips = 60;
  assert.strictEqual(context.nextMilestoneForShop(afterFamily).id, 'first_100_tips');
  assert.strictEqual(context.renderNextMilestoneCard(afterFamily).includes('Net Worth:'), false);

  const afterHundred = JSON.parse(JSON.stringify(afterFamily));
  afterHundred.shop.lifetimeTips = 100;
  afterHundred.stamps.first_100_tips = { label: 'First $100 Cash', date: '2026-06-15T12:00:00.000Z' };
  assert.strictEqual(context.nextMilestoneForShop(afterHundred).id, 'delivery_shelf_unlock');

  const afterShelf = JSON.parse(JSON.stringify(afterHundred));
  afterShelf.shop.stations.delivery_shelf = 1;
  assert.strictEqual(context.nextMilestoneForShop(afterShelf).id, 'shop_sign_unlock');

  vm.runInContext(`
function makeNode() {
  const node = { textContent: "", innerHTML: "", disabled: null, dataset: {}, classListValue: null, value: "" };
  node.classList = { toggle(_className, hidden) { node.classListValue = Boolean(hidden); } };
  node.querySelector = () => null;
  return node;
}
elements = {
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopInlineResult: makeNode(),
  shopOfflineEarnings: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.shopTab = "overview";
renderTofuShop(${JSON.stringify(fresh)});
globalThis.nextMilestoneFreshHtml = elements.shopTabPanel.innerHTML;
globalThis.nextMilestoneFreshTabHtml = elements.shopTabList.innerHTML;
renderTofuShop(${JSON.stringify(afterFamily)});
globalThis.nextMilestoneLongRoadHtml = elements.shopTabPanel.innerHTML;
const missingFamilyTofu = ${JSON.stringify(afterTen)};
missingFamilyTofu.shop.tofuStock = 0;
missingFamilyTofu.shop.deliveryOrders = 1;
renderTofuShop(missingFamilyTofu);
globalThis.nextMilestoneMissingOrderHtml = elements.shopTabPanel.innerHTML;
appState.running = true;
renderTofuShop(${JSON.stringify(fresh)});
globalThis.activeDriveMilestoneHtml = elements.shopTabPanel.innerHTML;
appState.running = false;
`, context);

  assert(context.nextMilestoneFreshHtml.includes('Next Milestone'));
  assert(context.nextMilestoneFreshHtml.includes('First Cash Earned'));
  assert(context.nextMilestoneFreshHtml.includes('Simple Tofu Box'));
  assert(context.nextMilestoneFreshHtml.includes('Ready Orders'));
  assert(context.nextMilestoneFreshHtml.includes('Preparing next delivery order'));
  assert(context.nextMilestoneFreshHtml.includes('Reward: +$10 from tips, +1 Reputation, +8 Shop XP.'));
  assert(context.nextMilestoneFreshHtml.includes('nospill-available-badge'));
  assert(context.nextMilestoneFreshHtml.includes('Available'));
  assert(!context.nextMilestoneFreshHtml.includes('Fulfill Simple Tofu Box'));
  assert(context.nextMilestoneFreshHtml.includes('Current Bottleneck'));
  assert(!context.nextMilestoneFreshHtml.includes('Net Worth:'));
  assert(!context.nextMilestoneLongRoadHtml.includes('Net Worth:'));
  assert(!context.nextMilestoneLongRoadHtml.includes('Company Value'));
  assert(context.nextMilestoneMissingOrderHtml.includes('Need 24 Tofu Stock and 1 ready order'));
  assert(!context.nextMilestoneMissingOrderHtml.includes('0.649941'));
  assert(!context.activeDriveMilestoneHtml.includes('Next Milestone'));

  const activeAction = context.nextBestAction(afterUpgrade, { date: new Date('2026-06-15T12:00:00.000Z') });
  assert.notStrictEqual(activeAction.title, context.nextMilestoneForShop(afterUpgrade).name);

  const css = fs.readFileSync(NOSPILL_CSS, 'utf8');
  assert(css.includes('.nospill-available-badge'));
  assert(css.includes('button:focus-visible'));
  assert(css.includes('.nospill-next-milestone-bar'));

  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(!source.includes('fetch('));
  assert(!source.includes('XMLHttpRequest'));
  assert(!source.includes('sendBeacon'));
  assert(source.includes('netWorthV1'));
  assert(!source.includes('carAssetValue'));
  assert(!source.includes('enterpriseValue'));
}

function testTofuShopStationMilestoneBoostsV1() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });
  const base = context.defaultGameState();
  base.shop.tips = 100000;
  base.shop.prepSlots = 100;
  base.shop.reputation = 100;
  base.shop.shopLevel = context.getShopLevel(base.shop.reputation);
  base.stamps.first_shop_order = { label: 'First Shop Order', date: '2026-06-15T12:00:00.000Z' };
  base.stamps.first_upgrade_purchased = { label: 'First Upgrade Purchased', date: '2026-06-15T12:00:00.000Z' };
  base.stamps.first_10_orders = { label: 'First 10 Orders', date: '2026-06-15T12:00:00.000Z' };
  base.stamps.first_family_tofu_tray = { label: 'First Family Tofu Tray', date: '2026-06-15T12:00:00.000Z' };
  base.stamps.first_100_tips = { label: 'First 100 Tips', date: '2026-06-15T12:00:00.000Z' };

  assert.strictEqual(context.stationMilestoneMultiplier('tofu_press', 4), 1);
  assert.strictEqual(context.stationMilestoneMultiplier('tofu_press', 5), 1.5);
  assert.strictEqual(context.stationMilestoneMultiplier('tofu_press', 10), 2);
  assert.strictEqual(context.stationMilestoneMultiplier('prep_counter', 5), 1.5);
  assert.strictEqual(context.stationMilestoneMultiplier('prep_counter', 10), 2);
  assert.strictEqual(context.stationMilestoneMultiplier('delivery_shelf', 5), 1.25);
  assert.strictEqual(context.stationMilestoneMultiplier('delivery_shelf', 10), 1.5);
  assert.strictEqual(context.stationMilestoneMultiplier('shop_sign', 5), 1.25);
  assert.strictEqual(context.stationMilestoneMultiplier('shop_sign', 10), 1.5);
  assert.strictEqual(context.stationMilestoneMultiplier('tofu_press', 10), 2, '10 owned should be x2 total, not x3 compounded');

  const onePressRate = context.getShopGeneratorRates(base).tofuPressPerSecond;
  const fivePress = JSON.parse(JSON.stringify(base));
  fivePress.shop.stations.tofu_press = 5;
  const tenPress = JSON.parse(JSON.stringify(base));
  tenPress.shop.stations.tofu_press = 10;
  assertAlmostEqual(context.getShopGeneratorRates(fivePress).tofuPressPerSecond, onePressRate * 5 * 1.5);
  assertAlmostEqual(context.getShopGeneratorRates(tenPress).tofuPressPerSecond, onePressRate * 10 * 2);

  const oneCounterRate = context.getShopGeneratorRates(base).prepOrdersPerSecond;
  const fiveCounters = JSON.parse(JSON.stringify(base));
  fiveCounters.shop.stations.prep_counter = 5;
  const tenCounters = JSON.parse(JSON.stringify(base));
  tenCounters.shop.stations.prep_counter = 10;
  assertAlmostEqual(context.getShopGeneratorRates(fiveCounters).prepOrdersPerSecond, oneCounterRate * 5 * 1.5);
  assertAlmostEqual(context.getShopGeneratorRates(tenCounters).prepOrdersPerSecond, oneCounterRate * 10 * 2);

  const fiveShelves = JSON.parse(JSON.stringify(base));
  fiveShelves.shop.stations.delivery_shelf = 5;
  const tenShelves = JSON.parse(JSON.stringify(base));
  tenShelves.shop.stations.delivery_shelf = 10;
  assertAlmostEqual(context.getShopGeneratorRates(fiveShelves).prepOrdersPerSecond, oneCounterRate * (1 + 5 * 0.08) * 1.25);
  assertAlmostEqual(context.getShopGeneratorRates(tenShelves).prepOrdersPerSecond, oneCounterRate * (1 + 10 * 0.08) * 1.5);

  const fourSigns = JSON.parse(JSON.stringify(base));
  fourSigns.shop.stations.shop_sign = 4;
  fourSigns.shop.tofuStock = 1000;
  fourSigns.shop.deliveryOrders = 2;
  const fiveSigns = JSON.parse(JSON.stringify(fourSigns));
  fiveSigns.shop.stations.shop_sign = 5;
  const tenSigns = JSON.parse(JSON.stringify(fourSigns));
  tenSigns.shop.stations.shop_sign = 10;
  const repFour = context.fulfillShopOrders(fourSigns, 1, { activeDrive: false, orderTypeId: 'festival_bento' });
  const repFive = context.fulfillShopOrders(fiveSigns, 1, { activeDrive: false, orderTypeId: 'festival_bento' });
  const repTen = context.fulfillShopOrders(tenSigns, 1, { activeDrive: false, orderTypeId: 'festival_bento' });
  assert(repFive.reputationGained > repFour.reputationGained);
  assert(repTen.reputationGained > repFive.reputationGained);

  const milestoneBuySource = JSON.parse(JSON.stringify(base));
  milestoneBuySource.shop.stations.tofu_press = 4;
  const milestoneBuy = context.buyShopStation('tofu_press', milestoneBuySource, 1);
  assert.strictEqual(milestoneBuy.ok, true);
  assert(milestoneBuy.milestoneFeedback.includes('Station milestone reached: 5 Tofu Press owned'));
  assert(milestoneBuy.milestoneFeedback.includes('Tofu Press output x1.5'));
  assert(milestoneBuy.gameState.seenStationMilestoneIds.includes('tofu_press_5'));

  const seenSource = JSON.parse(JSON.stringify(base));
  seenSource.seenStationMilestoneIds = ['tofu_press_5'];
  seenSource.shop.stations.tofu_press = 4;
  const seenBuy = context.buyShopStation('tofu_press', seenSource, 1);
  assert.strictEqual(seenBuy.ok, true);
  assert.strictEqual(seenBuy.milestoneFeedback, '');

  const oldSave = context.defaultGameState();
  oldSave.shop.stations.tofu_press = 10;
  oldSave.shop.stations.prep_counter = 10;
  assert.strictEqual(context.stationMilestoneMultiplier('tofu_press', oldSave.shop.stations.tofu_press), 2);
  assert.strictEqual(context.stationMilestoneMultiplier('prep_counter', oldSave.shop.stations.prep_counter), 2);

  assert(context.stationMilestoneText('tofu_press', 4).includes('Next station milestone: 4 / 5 Tofu Press owned'));
  assert(context.stationMilestoneText('tofu_press', 5).includes('Station milestone reached: 5 Tofu Press owned'));
  assert(context.stationMilestoneText('tofu_press', 10).includes('Station milestones complete for now'));

  const nearPress = JSON.parse(JSON.stringify(base));
  nearPress.shop.stations.tofu_press = 4;
  nearPress.shop.tofuStock = 1;
  nearPress.shop.deliveryOrders = 0;
  nearPress.shop.prepSlots = 100;
  nearPress.shop.counterService.running = true;
  nearPress.shop.lifetimeDeliveryOrders = 1;
  nearPress.shop.lifetimeTips = 10;
  nearPress.stamps.first_shop_order = { label: 'First Shop Order', date: '2026-06-15T12:00:00.000Z' };
  const nearPressAction = context.nextBestAction(nearPress, { date: new Date('2026-06-15T12:00:00.000Z') });
  assert.strictEqual(nearPressAction.type, 'buy_station');
  assert.strictEqual(nearPressAction.stationId, 'tofu_press');
  assert(nearPressAction.copy.includes('close to 5 Tofu Presses'));

  const milestoneFallback = JSON.parse(JSON.stringify(base));
  milestoneFallback.shop.stations.tofu_press = 4;
  milestoneFallback.shop.stations.delivery_shelf = 1;
  milestoneFallback.shop.stations.shop_sign = 1;
  milestoneFallback.shop.counterService.running = true;
  milestoneFallback.shop.counterService.lifetimeHandoffs = 1;
  const milestone = context.nextMilestoneForShop(milestoneFallback);
  assert.strictEqual(milestone.id, 'station_tofu_press_5');
  assert.strictEqual(milestone.reward, 'Tofu Press output x1.5');

  vm.runInContext(`
function makeNode() {
  const node = { textContent: "", innerHTML: "", disabled: null, dataset: {}, classListValue: null, value: "" };
  node.classList = { toggle() {} };
  node.querySelector = () => null;
  return node;
}
elements = {
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopInlineResult: makeNode(),
  shopOfflineEarnings: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.shopTab = "production";
renderTofuShop(${JSON.stringify(milestoneFallback)});
globalThis.stationMilestoneProductionHtml = elements.shopTabPanel.innerHTML;
renderTofuShop(${JSON.stringify(context.defaultGameState())});
globalThis.freshStationMilestoneProductionHtml = elements.shopTabPanel.innerHTML;
appState.running = true;
globalThis.activeDriveMilestoneHtml = renderNextMilestoneCard(${JSON.stringify(milestoneFallback)});
`, context);
  assert(context.stationMilestoneProductionHtml.includes('Next station milestone'));
  assert(context.stationMilestoneProductionHtml.includes('Tofu Press output x1.5'));
  assert(!context.freshStationMilestoneProductionHtml.includes('Delivery Shelf support x1.25'));
  assert(!context.stationMilestoneProductionHtml.includes('undefined'));
  assert(!context.stationMilestoneProductionHtml.includes('NaN'));
  assert(!context.stationMilestoneProductionHtml.includes('Infinity'));
  assert.strictEqual(context.activeDriveMilestoneHtml, '');

  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(!source.includes('fetch('));
  assert(!source.includes('XMLHttpRequest'));
  assert(!source.includes('sendBeacon'));
}

function testCounterServiceV1AutomatesEarnedShopHandoffs() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });
  const fresh = context.defaultGameState();
  assert.strictEqual(context.isCounterServiceUnlocked(fresh), true);
  assert.strictEqual(fresh.shop.counterService.running, true);
  assert.strictEqual(fresh.shop.tofuStock, 24);

  vm.runInContext(`
function makeNode() {
  const node = { textContent: "", innerHTML: "", disabled: null, dataset: {}, classListValue: null, value: "" };
  node.classList = { toggle(_className, hidden) { node.classListValue = Boolean(hidden); } };
  node.querySelector = () => null;
  return node;
}
elements = {
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopInlineResult: makeNode(),
  shopOfflineEarnings: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.shopTab = "overview";
renderTofuShop(${JSON.stringify(fresh)});
globalThis.counterFreshHtml = elements.shopTabPanel.innerHTML;
`, context);
  assert(context.counterFreshHtml.includes('Counter Service'));
  assert(context.counterFreshHtml.includes('Regular customers can pick up prepared orders automatically.'));

  const freshAuto = JSON.parse(JSON.stringify(fresh));
  freshAuto.shop.counterService.lastHandoffAt = '2026-06-15T12:00:00.000Z';
  const freshAutoTick = context.applyCounterServiceTick(freshAuto, new Date('2026-06-15T12:00:10.000Z'));
  assert.strictEqual(freshAutoTick.completed, 1);
  assert.strictEqual(freshAutoTick.gameState.shop.tips, 10);
  assert.strictEqual(freshAutoTick.gameState.shop.reputation, 1);
  assert.strictEqual(freshAutoTick.gameState.shop.lifetimeDeliveryOrders, 1);
  assert(freshAutoTick.gameState.stamps.first_shop_order);

  let starterLoop = JSON.parse(JSON.stringify(fresh));
  starterLoop.shop.lastGeneratorTickAt = '2026-06-15T12:00:00.000Z';
  starterLoop.shop.lastShopTickAt = '2026-06-15T12:00:00.000Z';
  starterLoop.shop.counterService.lastHandoffAt = '2026-06-15T12:00:00.000Z';
  let starterCompleted = 0;
  for (let second = 10; second <= 90; second += 10) {
    const now = new Date(Date.parse('2026-06-15T12:00:00.000Z') + second * 1000);
    const generated = context.applyShopGeneratorTick(starterLoop, now, { maxSeconds: 10 });
    const serviced = context.applyCounterServiceTick(generated.gameState, now, { maxSeconds: 10 });
    starterLoop = serviced.gameState;
    starterCompleted += serviced.completed;
  }
  assert(starterCompleted >= 3);
  assert(starterLoop.shop.tips >= 20);
  assert.strictEqual(starterLoop.shop.lifetimeTofuPacked, 0);
  assert(starterLoop.shop.lifetimeDeliveryOrders >= 3);

  const earlyMigrated = context.defaultGameState();
  earlyMigrated.shop.tofuStock = 5;
  earlyMigrated.shop.tips = 10;
  earlyMigrated.shop.lifetimeTips = 10;
  earlyMigrated.shop.lifetimeDeliveryOrders = 1;
  delete earlyMigrated.shop.starterStockBufferApplied;
  const normalizedEarlyMigrated = context.normalizeGameState(earlyMigrated);
  assert.strictEqual(normalizedEarlyMigrated.shop.tofuStock, 24);
  assert.strictEqual(normalizedEarlyMigrated.shop.starterStockBufferApplied, true);

  const unlocked = context.defaultGameState();
  unlocked.shop.lifetimeDeliveryOrders = 10;
  unlocked.shop.lifetimeTips = 100;
  unlocked.shop.deliveryOrders = 0;
  unlocked.shop.tofuStock = 100;
  unlocked.stamps.first_shop_order = { label: 'First Shop Order', date: '2026-06-15T12:00:00.000Z' };
  unlocked.stamps.first_10_orders = { label: 'First 10 Orders', date: '2026-06-15T12:00:00.000Z' };
  unlocked.stamps.first_upgrade_purchased = { label: 'First Upgrade Purchased', date: '2026-06-15T12:00:00.000Z' };
  unlocked.shop.stationUpgrades.prep_counter_faster = 1;
  assert.strictEqual(context.isCounterServiceUnlocked(unlocked), true);
  unlocked.shop.counterService.running = false;
  assert.strictEqual(unlocked.shop.counterService.running, false);

  vm.runInContext(`
renderTofuShop(${JSON.stringify(unlocked)});
globalThis.counterUnlockedHtml = elements.shopTabPanel.innerHTML;
globalThis.counterUnlockedAction = nextBestAction(${JSON.stringify(unlocked)}, { date: new Date('2026-06-15T12:00:00.000Z') });
globalThis.counterUnlockedMilestone = nextMilestoneForShop(${JSON.stringify(unlocked)});
`, context);
  assert(context.counterUnlockedHtml.includes('Counter Service'));
  assert(context.counterUnlockedHtml.includes('Regular customers can pick up prepared orders automatically.'));
  assert(context.counterUnlockedHtml.includes('1 handoff / 10 sec'));
  assert(context.counterUnlockedHtml.includes('Best Available'));
  assert(context.counterUnlockedHtml.includes('Start Counter Service'));
  assert(context.counterUnlockedHtml.includes('Pause Counter Service'));
  assert.strictEqual(context.counterUnlockedAction.type, 'start_counter_service');
  assert.strictEqual(context.counterUnlockedMilestone.id, 'first_family_tofu_tray');

  const started = context.startCounterService(unlocked, {
    now: new Date('2026-06-15T12:00:00.000Z'),
  });
  assert.strictEqual(started.ok, true);
  assert.strictEqual(started.gameState.shop.counterService.running, true);
  assert.strictEqual(started.gameState.shop.counterService.lastResult, 'Counter Service started.');

  const paused = context.pauseCounterService(started.gameState, {
    now: new Date('2026-06-15T12:00:02.000Z'),
  });
  assert.strictEqual(paused.ok, true);
  assert.strictEqual(paused.gameState.shop.counterService.running, false);

  const bestSource = JSON.parse(JSON.stringify(started.gameState));
  bestSource.shop.deliveryOrders = 3;
  bestSource.shop.tofuStock = 200;
  bestSource.shop.reputation = 50;
  bestSource.shop.lifetimeReputation = 50;
  bestSource.shop.shopLevel = 2;
  const bestType = context.counterServiceOrderType(bestSource);
  assert.strictEqual(bestType.id, 'festival_bento');
  const bestTick = context.applyCounterServiceTick(bestSource, new Date('2026-06-15T12:00:10.000Z'));
  assert.strictEqual(bestTick.completed, 1);
  assert.strictEqual(bestTick.gameState.shop.deliveryOrders, 1);
  assert.strictEqual(bestTick.gameState.shop.tofuStock, 125);
  assert.strictEqual(bestTick.gameState.shop.tips, 130);
  assert.strictEqual(bestTick.gameState.shop.shopXP, 70);
  assert.strictEqual(bestTick.gameState.totalXP, 0);
  assert(bestTick.message.includes('Festival Bento'));
  assert.strictEqual(bestTick.gameState.shop.counterService.lifetimeHandoffs, 1);
  assert(bestTick.gameState.shop.ledger[0].text.includes('Counter Service'));
  assert(!bestTick.gameState.shop.ledger[0].text.includes('undefined'));

  const familySource = JSON.parse(JSON.stringify(started.gameState));
  familySource.shop.deliveryOrders = 1;
  familySource.shop.tofuStock = 30;
  const familyType = context.counterServiceOrderType(familySource);
  assert.strictEqual(familyType.id, 'family_tofu_tray');
  const familyTick = context.applyCounterServiceTick(familySource, new Date('2026-06-15T12:00:10.000Z'));
  assert.strictEqual(familyTick.completed, 1);
  assert.strictEqual(familyTick.gameState.shop.tips, 45);
  assert.strictEqual(familyTick.gameState.shop.tofuStock, 6);

  const simpleSource = JSON.parse(JSON.stringify(started.gameState));
  simpleSource.shop.deliveryOrders = 1;
  simpleSource.shop.tofuStock = 6;
  const simpleType = context.counterServiceOrderType(simpleSource);
  assert.strictEqual(simpleType.id, 'simple_tofu_box');
  const simpleTick = context.applyCounterServiceTick(simpleSource, new Date('2026-06-15T12:00:10.000Z'));
  assert.strictEqual(simpleTick.completed, 1);
  assert.strictEqual(simpleTick.gameState.shop.tips, 10);
  assert.strictEqual(simpleTick.gameState.shop.reputation, 1);
  assert.strictEqual(simpleTick.gameState.shop.shopXP, 8);
  assert.strictEqual(simpleTick.gameState.totalXP, 0);
  assert(simpleTick.gameState.shop.deliveryOrders >= 0);
  assert(simpleTick.gameState.shop.tofuStock >= 0);

  const batchSource = JSON.parse(JSON.stringify(started.gameState));
  batchSource.shop.deliveryOrders = 3;
  batchSource.shop.tofuStock = 100;
  const batchTick = context.applyCounterServiceTick(batchSource, new Date('2026-06-15T12:00:30.000Z'));
  assert.strictEqual(batchTick.completed, 3);
  assert(batchTick.message.includes('Counter Service completed 3 orders.'));
  assert.strictEqual(batchTick.gameState.shop.ledger.filter((entry) => entry.text.includes('Counter Service')).length, 1);

  const offlineSource = JSON.parse(JSON.stringify(started.gameState));
  offlineSource.shop.deliveryOrders = 3;
  offlineSource.shop.tofuStock = 100;
  const offlineTick = context.applyShopGeneratorTick(offlineSource, new Date('2026-06-15T13:00:00.000Z'), {
    maxSeconds: 3600,
  });
  assert.strictEqual(offlineTick.gameState.shop.tips, offlineSource.shop.tips);
  assert.strictEqual(offlineTick.gameState.shop.counterService.lifetimeHandoffs, 0);

  const activeSource = JSON.parse(JSON.stringify(started.gameState));
  activeSource.shop.deliveryOrders = 1;
  activeSource.shop.tofuStock = 100;
  vm.runInContext(`
appState.running = true;
globalThis.counterActiveStart = startCounterService(${JSON.stringify(unlocked)}, { activeDrive: true, now: new Date('2026-06-15T12:00:00.000Z') });
globalThis.counterActiveTick = applyCounterServiceTick(${JSON.stringify(activeSource)}, new Date('2026-06-15T12:00:10.000Z'), { activeDrive: true });
renderTofuShop(${JSON.stringify(activeSource)});
globalThis.counterActiveHtml = elements.shopTabPanel.innerHTML;
appState.running = false;
`, context);
  assert.strictEqual(context.counterActiveStart.ok, false);
  assert.strictEqual(context.counterActiveTick.completed, 0);
  assert(!context.counterActiveHtml.includes('data-counter-service-action'));

  vm.runInContext(`
appState.shopInlineResult = "";
appState.summaryMode = null;
appState.liveGameState = ${JSON.stringify(batchSource)};
saveGameState(appState.liveGameState);
tickOpenShopGenerators(new Date('2026-06-15T12:00:30.000Z'));
globalThis.counterInlineMessage = appState.shopInlineResult;
globalThis.counterSummaryMode = appState.summaryMode;
globalThis.counterSavedState = currentGameState();
`, context);
  assert(context.counterInlineMessage.includes('Counter Service completed'));
  assert.strictEqual(context.counterSummaryMode, null);
  assert(context.counterSavedState.shop.counterService.lifetimeHandoffs >= 1);

  const manualAfterUnlock = context.fulfillShopOrders(unlocked, 1, {
    activeDrive: false,
    orderTypeId: 'simple_tofu_box',
  });
  assert.strictEqual(manualAfterUnlock.ok, false);
  const manualReady = JSON.parse(JSON.stringify(unlocked));
  manualReady.shop.deliveryOrders = 1;
  manualReady.shop.tofuStock = 100;
  const manual = context.fulfillShopOrders(manualReady, 1, {
    activeDrive: false,
    orderTypeId: 'simple_tofu_box',
  });
  assert.strictEqual(manual.ok, true);
  assert.strictEqual(manual.tipsGained, 10);

  const progress = context.counterServiceProgress(started.gameState, new Date('2026-06-15T12:00:05.000Z'));
  assert(progress.percent > 0 && progress.percent < 100);
  assert(!String(progress.percent).includes('.'));

  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(!source.includes('fetch('));
  assert(!source.includes('XMLHttpRequest'));
  assert(!source.includes('sendBeacon'));
}

function testCounterServicePolishStatsUpgradesAndSpiritPanel() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });
  const state = context.defaultGameState();
  state.shop.lifetimeDeliveryOrders = 10;
  state.shop.deliveryOrders = 5;
  state.shop.tofuStock = 500;
  state.shop.tips = 1000;
  state.shop.reputation = 50;
  state.shop.shopLevel = context.getShopLevel(state.shop.reputation);
  state.shop.prepSlots = 20;
  state.shop.counterService.running = true;
  state.shop.counterService.lastHandoffAt = '2026-06-15T12:00:00.000Z';
  state.stamps.first_shop_order = { label: 'First Shop Order', date: '2026-06-15T12:00:00.000Z' };
  state.stamps.first_10_orders = { label: 'First 10 Orders', date: '2026-06-15T12:00:00.000Z' };
  state.stamps.first_upgrade_purchased = { label: 'First Upgrade Purchased', date: '2026-06-15T12:00:00.000Z' };
  assert.strictEqual(context.counterServiceIntervalSeconds(state), 10);
  assert(context.counterServiceIncomeStatus(state).text.includes('Counter Service: +'));
  assert(context.counterServiceIncomeStatus(state).text.includes('/min when supplied'));

  const stockBlocked = JSON.parse(JSON.stringify(state));
  stockBlocked.shop.tofuStock = 0;
  assert.strictEqual(context.counterServiceIncomeStatus(stockBlocked).text, 'Counter Service waiting for Tofu Stock');
  assert(context.counterServiceIncomeStatus(stockBlocked).detail.includes('Needs 6 Tofu Stock'));
  assert(context.counterServiceIncomeStatus(stockBlocked).detail.includes('Ready in about'));
  const orderBlocked = JSON.parse(JSON.stringify(state));
  orderBlocked.shop.deliveryOrders = 0;
  assert.strictEqual(context.counterServiceIncomeStatus(orderBlocked).text, 'Counter Service waiting for ready orders');
  const bothBlocked = JSON.parse(JSON.stringify(state));
  bothBlocked.shop.deliveryOrders = 0;
  bothBlocked.shop.tofuStock = 0;
  assert.strictEqual(context.counterServiceIncomeStatus(bothBlocked).text, 'Counter Service waiting for Tofu Stock and ready orders');

  vm.runInContext(`
function makeNode() {
  const node = { textContent: "", innerHTML: "", disabled: null, dataset: {}, classListValue: null, value: "" };
  node.classList = { toggle(_className, hidden) { node.classListValue = Boolean(hidden); } };
  node.querySelector = () => null;
  return node;
}
elements = {
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopReach: makeNode(),
  shopSpirit: makeNode(),
  shopLicenseStars: makeNode(),
  shopBuyMultiplier: makeNode(),
  packTofuButton: makeNode(),
  fulfillShopOrderButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopInlineResult: makeNode(),
  shopOfflineEarnings: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.shopTab = "overview";
renderTofuShop(${JSON.stringify(state)});
globalThis.counterIncomeText = elements.shopTipsRate.textContent;
renderTofuShop(${JSON.stringify(stockBlocked)});
globalThis.counterStockBlockedText = elements.shopTipsRate.textContent;
renderTofuShop(${JSON.stringify(orderBlocked)});
globalThis.counterOrderBlockedText = elements.shopTipsRate.textContent;
appState.shopTab = "upgrades";
renderTofuShop(${JSON.stringify(state)});
globalThis.counterUpgradeHtml = elements.shopTabPanel.innerHTML;
`, context);
  assert(context.counterIncomeText.includes('Counter Service: +'));
  assert(context.counterIncomeText.includes('/min when supplied'));
  assert.strictEqual(context.counterStockBlockedText, 'Counter Service waiting for Tofu Stock');
  assert.strictEqual(context.counterOrderBlockedText, 'Counter Service waiting for ready orders');
  assert(context.counterUpgradeHtml.includes('Order Bell'));
  assert(context.counterUpgradeHtml.includes('1 handoff / 10 sec -&gt; 1 handoff / 8 sec'));
  assert(!context.counterUpgradeHtml.includes('Wider Counter'));
  assert(!context.counterUpgradeHtml.includes('Pickup Routine'));

  const bell = context.buyStationUpgrade('counter_service_bell', state);
  assert.strictEqual(bell.ok, true);
  assert.strictEqual(context.counterServiceIntervalSeconds(bell.gameState), 8);
  const wideLocked = JSON.parse(JSON.stringify(bell.gameState));
  wideLocked.shop.lifetimeDeliveryOrders = 19;
  vm.runInContext(`
appState.shopTab = "upgrades";
renderTofuShop(${JSON.stringify(wideLocked)});
globalThis.wideLockedHtml = elements.shopTabPanel.innerHTML;
`, context);
  assert(!context.wideLockedHtml.includes('Wider Counter'));
  const wideReady = JSON.parse(JSON.stringify(bell.gameState));
  wideReady.shop.lifetimeDeliveryOrders = 20;
  const wide = context.buyStationUpgrade('counter_service_wide', wideReady);
  assert.strictEqual(wide.ok, true);
  assert.strictEqual(context.counterServiceIntervalSeconds(wide.gameState), 6);
  const routineLocked = context.buyStationUpgrade('counter_service_routine', wide.gameState);
  assert.strictEqual(routineLocked.ok, false);
  const routineReady = JSON.parse(JSON.stringify(wide.gameState));
  routineReady.stamps.first_family_tofu_tray = { label: 'First Family Tofu Tray', date: '2026-06-15T12:00:00.000Z' };
  routineReady.shop.tips = 600;
  const routine = context.buyStationUpgrade('counter_service_routine', routineReady);
  assert.strictEqual(routine.ok, true);
  assert.strictEqual(context.counterServiceIntervalSeconds(routine.gameState), 4);
  assert.strictEqual(context.counterServiceBatchSize(routine.gameState), 1);

  const registerReady = JSON.parse(JSON.stringify(routine.gameState));
  registerReady.shop.tips = 2000;
  registerReady.shop.lifetimeDeliveryOrders = 25;
  const register = context.buyStationUpgrade('counter_service_register', registerReady);
  assert.strictEqual(register.ok, true);
  assert.strictEqual(context.counterServiceBatchSize(register.gameState), 2);
  const windowLocked = context.buyStationUpgrade('counter_service_window', register.gameState);
  assert.strictEqual(windowLocked.ok, false);
  const windowReady = JSON.parse(JSON.stringify(register.gameState));
  windowReady.shop.tips = 5000;
  windowReady.shop.lifetimeDeliveryOrders = 100;
  const windowUpgrade = context.buyStationUpgrade('counter_service_window', windowReady);
  assert.strictEqual(windowUpgrade.ok, true);
  assert.strictEqual(context.counterServiceBatchSize(windowUpgrade.gameState), 5);
  const crewLocked = context.buyStationUpgrade('counter_service_crew', windowUpgrade.gameState);
  assert.strictEqual(crewLocked.ok, false);
  const crewReady = JSON.parse(JSON.stringify(windowUpgrade.gameState));
  crewReady.shop.tips = 20000;
  crewReady.shop.lifetimeDeliveryOrders = 1000;
  const crew = context.buyStationUpgrade('counter_service_crew', crewReady);
  assert.strictEqual(crew.ok, true);
  assert.strictEqual(context.counterServiceBatchSize(crew.gameState), 10);

  const batchSource = JSON.parse(JSON.stringify(register.gameState));
  batchSource.shop.counterService.running = true;
  batchSource.shop.counterService.lastHandoffAt = '2026-06-15T12:00:00.000Z';
  batchSource.shop.deliveryOrders = 20;
  batchSource.shop.tofuStock = 2000;
  const batchTipsBefore = batchSource.shop.tips;
  const batchTick = context.applyCounterServiceTick(batchSource, new Date('2026-06-15T12:00:04.000Z'));
  assert.strictEqual(batchTick.completed, 2);
  assert.strictEqual(batchTick.gameState.shop.deliveryOrders < batchSource.shop.deliveryOrders, true);
  assert.strictEqual(batchTick.gameState.shop.tofuStock < batchSource.shop.tofuStock, true);
  assert.strictEqual(batchTick.gameState.shop.tips > batchTipsBefore, true);
  assert(context.counterServiceIncomeStatus(batchSource).text.includes('batch 2'));

  vm.runInContext(`
appState.shopTab = "upgrades";
renderTofuShop(${JSON.stringify(crew.gameState)});
globalThis.maxedCounterHtml = elements.shopTabPanel.innerHTML;
`, context);
  assert(context.maxedCounterHtml.includes('Counter Crew Lv 1'));
  assert(context.maxedCounterHtml.includes('Maxed'));
  assert(!context.maxedCounterHtml.includes('Buy Counter Crew'));
  assert(!context.maxedCounterHtml.includes('Counter Service: batch 10 -&gt; 10'));

  const pileup = JSON.parse(JSON.stringify(state));
  pileup.shop.stationUpgrades.counter_service_bell = 0;
  pileup.shop.counterService.running = true;
  pileup.shop.deliveryOrders = 6;
  pileup.shop.tofuStock = 1000;
  pileup.shop.tips = 1000;
  const pileupAction = context.nextBestAction(pileup);
  assert.strictEqual(pileupAction.type, 'buy_upgrade');
  assert.strictEqual(pileupAction.upgradeId, 'counter_service_bell');
  const paused = JSON.parse(JSON.stringify(state));
  paused.shop.counterService.running = false;
  paused.shop.deliveryOrders = 6;
  const pausedAction = context.nextBestAction(paused);
  assert.strictEqual(pausedAction.type, 'start_counter_service');
  const stockAction = context.nextBestAction(stockBlocked);
  assert(['pack_tofu', 'buy_station', 'buy_upgrade'].includes(stockAction.type));

  const spirit = context.defaultGameState();
  spirit.shop.tips = 41900;
  spirit.shop.shopSpirit = 12;
  spirit.shop.reputation = 900;
  spirit.shop.shopLevel = context.getShopLevel(spirit.shop.reputation);
  spirit.shop.lifetimeDeliveryOrders = 60;
  spirit.shop.stations.delivery_shelf = 1;
  spirit.shop.stations.shop_sign = 1;
  spirit.shop.spiritGenerators.tea_kettle = 1;
  spirit.shop.festivalBoosts.press_token = 1;
  spirit.shop.activeFestivalBoosts = [{
    id: 'busy_lunch',
    label: 'Busy Lunch Hour',
    multiplier: 1.5,
    expiresAt: '2099-01-01T00:00:00.000Z',
    source: 'shop_spirit',
  }];
  vm.runInContext(`
appState.shopTab = "spirit";
renderTofuShop(${JSON.stringify(spirit)});
globalThis.spiritPanelHtml = elements.shopTabPanel.innerHTML;
`, context);
  assert(context.spiritPanelHtml.includes('Shop Spirit wallet'));
  assert(context.spiritPanelHtml.includes('Cash'));
  assert(context.spiritPanelHtml.includes('41.9K'));
  assert(context.spiritPanelHtml.includes('Shop Spirit'));
  assert(context.spiritPanelHtml.includes('12 /'));
  assert(context.spiritPanelHtml.includes('Spirit/sec'));
  assert(context.spiritPanelHtml.includes('Buy Multiplier'));
  assert(!context.spiritPanelHtml.includes('Use Boost'));
  assert(!context.spiritPanelHtml.includes('Use Festival Boost'));
  assert(context.spiritPanelHtml.includes('Spend 10 Spirit'));
  assert(context.spiritPanelHtml.includes('Rush Stock'));
  assert(context.spiritPanelHtml.includes('Adds 30 seconds of Tofu Stock production'));
  assert(context.spiritPanelHtml.includes('Start Double Batch'));
  assert(context.spiritPanelHtml.includes('Use Token'));
  assert(context.spiritPanelHtml.includes('Duration:'));
  assert(context.spiritPanelHtml.includes('Active for about'));
  assert(context.spiritPanelHtml.includes('Need 3 Spirit'));
  assert(!context.spiritPanelHtml.includes('Calm Shop Focus'));

  const spiritAmountState = JSON.parse(JSON.stringify(spirit));
  spiritAmountState.shop.stations.tofu_press = 20;
  spiritAmountState.shop.stationUpgrades.tofu_press_faster = 5;
  const rushBoost = context.shopSpiritInstantAmount({ id: 'rush_prep', type: 'instant_tofu', seconds: 30 }, spiritAmountState);
  assert(rushBoost >= 30);
  assert(context.spiritPanelHtml.includes('You have 12'));
  assert(!context.spiritPanelHtml.includes('Calm Shop Focus'));

  const activeSpirit = context.useShopSpiritBoost('busy_lunch', spirit);
  assert.strictEqual(activeSpirit.ok, false);
  assert(activeSpirit.reason.includes('already active'));
  const hiddenRouteToken = context.useFestivalBoost('calm_focus_token', spirit);
  assert.strictEqual(hiddenRouteToken.ok, false);
  assert(hiddenRouteToken.reason.includes('Routes are deferred'));
}

function testTofuGarageHighMidgameSupplyBottleneckBalance() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });
  function highMidgameState() {
    const state = context.defaultGameState();
    state.shop.tofuStock = 4;
    state.shop.deliveryOrders = 1000000;
    state.shop.tips = 15;
    state.shop.reputation = 300000;
    state.shop.shopLevel = 100;
    state.shop.lifetimeDeliveryOrders = 1000;
    state.shop.lifetimeTips = 150000;
    state.shop.lifetimeReputation = 300000;
    state.shop.prepSlots = 300;
    state.shop.counterService.running = true;
    state.shop.counterService.lastHandoffAt = '2026-06-15T12:00:00.000Z';
    state.shop.stations.tofu_press = 10;
    state.shop.stations.prep_counter = 10;
    state.shop.stations.delivery_shelf = 10;
    state.shop.stations.shop_sign = 10;
    state.shop.stationUpgrades.tofu_press_faster = 10;
    state.shop.stationUpgrades.tofu_press_double = 8;
    state.shop.stationUpgrades.counter_service_bell = 1;
    state.shop.stationUpgrades.counter_service_wide = 1;
    state.shop.stationUpgrades.counter_service_routine = 1;
    state.shop.stationUpgrades.counter_service_register = 1;
    state.shop.stationUpgrades.counter_service_window = 1;
    state.shop.stationUpgrades.counter_service_crew = 1;
    state.stamps.first_shop_order = { label: 'First Shop Order', date: '2026-06-15T12:00:00.000Z' };
    state.stamps.first_10_orders = { label: 'First 10 Orders', date: '2026-06-15T12:00:00.000Z' };
    state.stamps.first_upgrade_purchased = { label: 'First Upgrade Purchased', date: '2026-06-15T12:00:00.000Z' };
    state.stamps.first_family_tofu_tray = { label: 'First Family Tofu Tray', date: '2026-06-15T12:00:00.000Z' };
    state.stamps.first_100_tips = { label: 'First 100 Tips', date: '2026-06-15T12:00:00.000Z' };
    return state;
  }

  const blocked = highMidgameState();
  const action = context.nextBestAction(blocked);
  assert.notStrictEqual(action.type, 'pack_tofu');
  assert.strictEqual(action.type, 'buy_upgrade');
  assert.strictEqual(action.upgradeId, 'soy_supplier_contract');
  assert(action.title.includes('Soy Supplier Contract'));
  assert(action.copy.includes('Reputation'));

  const supplier = context.nextSupplierUpgrade(blocked, true);
  assert.strictEqual(supplier.id, 'soy_supplier_contract');
  const beforeRate = context.getShopGeneratorRates(blocked).tofuPressPerSecond;
  const bought = context.buyStationUpgrade('soy_supplier_contract', blocked);
  assert.strictEqual(bought.ok, true);
  assert.strictEqual(bought.costReputation, 25000);
  assert.strictEqual(bought.gameState.shop.reputation, 275000);
  assert(context.supplierStockPerSecond(bought.gameState) >= 250);
  assert(context.getShopGeneratorRates(bought.gameState).tofuPressPerSecond >= beforeRate + 250);

  const poorRep = highMidgameState();
  poorRep.shop.reputation = 10000;
  poorRep.shop.shopLevel = context.getShopLevel(poorRep.shop.reputation);
  const failed = context.buyStationUpgrade('soy_supplier_contract', poorRep);
  assert.strictEqual(failed.ok, false);
  assert.strictEqual(failed.reason, 'Not enough reputation.');

  const partial = highMidgameState();
  partial.shop.tofuStock = 800;
  partial.shop.deliveryOrders = 1000000;
  partial.shop.tips = 0;
  const preview = context.counterServiceBatchPreview(partial);
  assert.strictEqual(preview.quantity, 4);
  assert.strictEqual(preview.orderCounts.catering_crate, 3);
  assert.strictEqual(preview.orderCounts.festival_bento, 1);
  assert(context.counterServiceIncomeStatus(partial).text.includes('batch 4'));
  const tick = context.applyCounterServiceTick(partial, new Date('2026-06-15T12:00:04.000Z'));
  assert.strictEqual(tick.completed, 4);
  assert.strictEqual(tick.gameState.shop.tips, 1690);
  assert.strictEqual(tick.gameState.shop.tofuStock, 5);
  assert(tick.gameState.shop.deliveryOrders >= 0);

  const fallback = highMidgameState();
  fallback.shop.tofuStock = 75;
  fallback.shop.deliveryOrders = 1000;
  fallback.shop.tips = 0;
  const fallbackTick = context.applyCounterServiceTick(fallback, new Date('2026-06-15T12:00:04.000Z'));
  assert.strictEqual(fallbackTick.completed, 1);
  assert.strictEqual(fallbackTick.gameState.shop.tips, 130);
  assert.strictEqual(fallbackTick.gameState.shop.tofuStock, 0);

  const stillBlocked = highMidgameState();
  stillBlocked.shop.tofuStock = 5;
  stillBlocked.shop.deliveryOrders = 1000;
  assert.strictEqual(context.counterServiceIncomeStatus(stillBlocked).text, 'Counter Service waiting for Tofu Stock');

  vm.runInContext(`
function makeNode() {
  const node = { textContent: "", innerHTML: "", disabled: null, dataset: {}, classListValue: null, value: "" };
  node.classList = { toggle(_className, hidden) { node.classListValue = Boolean(hidden); } };
  node.querySelector = () => null;
  return node;
}
elements = {
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopReach: makeNode(),
  shopSpirit: makeNode(),
  shopLicenseStars: makeNode(),
  shopBuyMultiplier: makeNode(),
  packTofuButton: makeNode(),
  fulfillShopOrderButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopInlineResult: makeNode(),
  shopOfflineEarnings: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.shopTab = "upgrades";
renderTofuShop(${JSON.stringify(blocked)});
globalThis.supplierUpgradeHtml = elements.shopTabPanel.innerHTML;
appState.shopTab = "overview";
const offlineState = ${JSON.stringify(blocked)};
offlineState.shop.offlineEarnings = {
  tofuStock: 0,
  deliveryOrders: 554000,
  tips: 0,
  tofuConsumed: 1108000,
  counterServicePaused: true,
  cappedHours: 8,
};
renderTofuShop(offlineState);
globalThis.offlineSummaryText = elements.shopOfflineEarnings.textContent;
`, context);
  assert(context.supplierUpgradeHtml.includes('Soy Supplier Contract'));
  assert(context.supplierUpgradeHtml.includes('25K Reputation'));
  assert(context.supplierUpgradeHtml.includes('Tofu supply'));
  assert(context.supplierUpgradeHtml.includes('Uses Reputation to keep Counter Service supplied'));
  assert(!context.supplierUpgradeHtml.includes('Route Familiarity'));
  assert(!context.supplierUpgradeHtml.includes('Careful Notes'));
  assert(!context.supplierUpgradeHtml.includes('Buy Counter Crew'));
  assert(context.offlineSummaryText.includes('+554K waiting orders'));
  assert(!context.offlineSummaryText.includes('+0 tofu stock'));
  assert(context.offlineSummaryText.includes('tofu supply was consumed preparing orders'));
  assert(context.offlineSummaryText.includes('Counter Service does not fulfill offline yet'));

  assert.strictEqual(context.surfaceFromHash('#/shop'), 'shop');
  assert.strictEqual(context.surfaceFromHash('#/garage'), 'shop');
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(html.includes('Tofu Garage'));
  assert(html.includes('Prep Capacity'));
  assert(!html.includes('Prep Slots'));
  assert(html.includes('/static/nospill/app.js?v=20260618e'));
  assert(html.includes('/static/nospill/app.css?v=20260618e'));
}

function testTofuGarageRoutesSurfaceIsDeferred() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });
  vm.runInContext(`
function routeMakeNode() {
  const node = { textContent: "", innerHTML: "", disabled: null, dataset: {}, classListValue: null, value: "" };
  node.classList = { toggle(_className, hidden) { node.classListValue = Boolean(hidden); } };
  node.querySelector = () => null;
  return node;
}
const routeElements = {
  shopTabList: routeMakeNode(),
  shopTabPanel: routeMakeNode(),
  gameShopStats: routeMakeNode(),
  gameShopHelper: routeMakeNode(),
  gameShopUnlocks: routeMakeNode(),
  gameShopMilestones: routeMakeNode(),
  gamePackTofuButton: routeMakeNode(),
};
elements = { ...elements, ...routeElements };
const routeProgress = defaultGameState();
routeProgress.shop.tips = 500000;
routeProgress.shop.tofuStock = 5000;
routeProgress.shop.deliveryOrders = 5000;
routeProgress.shop.prepSlots = 500;
routeProgress.shop.reputation = 500000;
routeProgress.shop.lifetimeDeliveryOrders = 5000;
routeProgress.shop.lifetimeTips = 500000;
routeProgress.shop.shopLevel = 100;
routeProgress.shop.shopReach = 20;
routeProgress.shop.routeKnowledge = 80;
routeProgress.shop.stations.delivery_route = 3;
routeProgress.shop.stations.dispatcher_desk = 1;
routeProgress.shop.stations.regional_network = 1;
routeProgress.shop.routes.shop_street.mastery = 60;
routeProgress.shop.festivalBoosts.calm_focus_token = 1;
routeProgress.shop.shopSpirit = 100;
routeProgress.stamps.shop_street_complete = { date: "2026-06-18T00:00:00.000Z", label: "Shop Street" };
appState.shopTab = "overview";
renderTofuShop(routeProgress);
globalThis.deferredTabsHtml = routeElements.shopTabList.innerHTML;
appState.shopTab = "routes";
renderTofuShop(routeProgress);
globalThis.deferredRouteFallbackTab = appState.shopTab;
globalThis.deferredRouteFallbackHtml = routeElements.shopTabPanel.innerHTML;
appState.shopTab = "production";
renderTofuShop(routeProgress);
globalThis.deferredProductionHtml = routeElements.shopTabPanel.innerHTML;
appState.shopTab = "upgrades";
renderTofuShop(routeProgress);
globalThis.deferredUpgradeHtml = routeElements.shopTabPanel.innerHTML;
appState.shopTab = "spirit";
renderTofuShop(routeProgress);
globalThis.deferredSpiritHtml = routeElements.shopTabPanel.innerHTML;
globalThis.deferredRouteStation = buyShopStation("delivery_route", routeProgress, 1);
globalThis.deferredRouteUpgrade = buyStationUpgrade("route_familiarity", routeProgress);
globalThis.deferredRouteAction = completeFictionalRoute("shop_street", routeProgress);
globalThis.deferredTraining = runTrainingDrill("cone_drill", routeProgress);
globalThis.deferredGarage = buyGarageUpgrade("cup_holder_charm", routeProgress);
globalThis.deferredCrew = hireCrewRole("apprentice_driver", routeProgress);
globalThis.deferredSpirit = useShopSpiritBoost("calm_focus", routeProgress);
globalThis.deferredFestival = useFestivalBoost("calm_focus_token", routeProgress);
globalThis.deferredNextAction = nextBestAction(routeProgress);
globalThis.deferredNextMilestone = nextMilestoneForShop(routeProgress);
globalThis.deferredReturning = returningPlayerSuggestedActions(routeProgress);
globalThis.deferredHashShop = surfaceFromHash("#/shop");
globalThis.deferredHashGarage = surfaceFromHash("#/garage");
globalThis.deferredHashCup = surfaceFromHash("#/cup-test");
`, context);

  assert(!context.deferredTabsHtml.includes('>Routes<'));
  assert(!context.deferredTabsHtml.includes('>Training<'));
  assert(!context.deferredTabsHtml.includes('data-shop-tab="routes"'));
  assert.strictEqual(context.deferredRouteFallbackTab, 'overview');
  assert(context.deferredRouteFallbackHtml.includes('Overview'));
  assert(!context.deferredRouteFallbackHtml.includes('Start Route Card'));
  assert(!context.deferredProductionHtml.includes('Delivery Route'));
  assert(!context.deferredProductionHtml.includes('Dispatcher Desk'));
  assert(!context.deferredProductionHtml.includes('Regional Tofu Network'));
  assert(!context.deferredUpgradeHtml.includes('Route Familiarity'));
  assert(!context.deferredUpgradeHtml.includes('Careful Notes'));
  assert(!context.deferredSpiritHtml.includes('Calm Shop Focus'));
  assert(!context.deferredSpiritHtml.includes('Calm Focus Token'));
  assert.strictEqual(context.deferredRouteStation.ok, false);
  assert.strictEqual(context.deferredRouteUpgrade.ok, false);
  assert.strictEqual(context.deferredRouteAction.ok, false);
  assert.strictEqual(context.deferredTraining.ok, false);
  assert.strictEqual(context.deferredGarage.ok, false);
  assert.strictEqual(context.deferredCrew.ok, false);
  assert.strictEqual(context.deferredSpirit.ok, false);
  assert.strictEqual(context.deferredFestival.ok, false);
  [
    context.deferredRouteStation.reason,
    context.deferredRouteUpgrade.reason,
    context.deferredRouteAction.reason,
    context.deferredSpirit.reason,
    context.deferredFestival.reason,
  ].forEach((reason) => assert(reason.includes('Routes are deferred'), reason));
  const recommendationText = [
    context.deferredNextAction.title,
    context.deferredNextAction.copy,
    context.deferredNextMilestone.name,
    context.deferredNextMilestone.guidance,
    ...context.deferredReturning,
  ].join(' ');
  assert(!/route|Route|Route Familiarity|Careful Notes|Shop Street/.test(recommendationText));
  assert.strictEqual(context.deferredHashShop, 'shop');
  assert.strictEqual(context.deferredHashGarage, 'shop');
  assert.strictEqual(context.deferredHashCup, 'cup-test');
}

function testTofuGarageGenerousOfflineProgressV1() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });
  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(source.includes('SHOP_OFFLINE_BASE_CAP_HOURS = 24'));
  assert(source.includes('SHOP_OFFLINE_MANAGED_CAP_HOURS = 72'));
  assert(source.includes('calculateShopGeneratorEarnings(gameState, now'));
  assert(!/for\s*\([^)]*elapsedSeconds/i.test(source));

  const fresh = context.defaultGameState();
  const freshOffline = context.applyOfflineShopEarnings(
    fresh,
    new Date('2026-06-15T12:00:00.000Z'),
  );
  assert.strictEqual(freshOffline.earnings.cappedHours, 0);
  assert.strictEqual(freshOffline.gameState.shop.offlineEarnings.tofuStock, 0);
  assert.strictEqual(freshOffline.gameState.shop.offlineEarnings.deliveryOrders, 0);

  function offlineSource() {
    const state = context.defaultGameState();
    state.shop.tofuStock = 100;
    state.shop.deliveryOrders = 0;
    state.shop.reputation = 160;
    state.shop.stations.tofu_press = 5;
    state.shop.stations.prep_counter = 3;
    state.shop.lastGeneratorTickAt = '2026-06-15T00:00:00.000Z';
    state.shop.lastShopTickAt = '2026-06-15T00:00:00.000Z';
    return state;
  }

  const oneHour = context.calculateOfflineShopEarnings(
    offlineSource(),
    new Date('2026-06-15T01:00:00.000Z'),
  );
  assert.strictEqual(oneHour.cappedHours, 1);
  assert.strictEqual(oneHour.excessHours, 0);
  assert.strictEqual(oneHour.capped, false);
  assert(oneHour.tofuStock >= 0);

  const twentyThreeHours = context.calculateOfflineShopEarnings(
    offlineSource(),
    new Date('2026-06-15T23:00:00.000Z'),
  );
  assert.strictEqual(twentyThreeHours.cappedHours, 23);
  assert.strictEqual(twentyThreeHours.excessHours, 0);
  assert.strictEqual(twentyThreeHours.capped, false);

  const thirtyHours = context.calculateOfflineShopEarnings(
    offlineSource(),
    new Date('2026-06-16T06:00:00.000Z'),
  );
  assert.strictEqual(thirtyHours.cappedHours, 24);
  assert.strictEqual(thirtyHours.excessHours, 6);
  assert.strictEqual(thirtyHours.capHours, 24);
  assert.strictEqual(thirtyHours.capped, true);

  const managed = offlineSource();
  managed.shop.shopLevel = 150;
  managed.shop.reputation = 2000000;
  managed.shop.stationUpgrades.counter_service_crew = 1;
  managed.shop.stationUpgrades.manager_shift_manager = 1;
  assert.strictEqual(context.offlineProgressCapHours(managed), 72);
  const managedOffline = context.calculateOfflineShopEarnings(
    managed,
    new Date('2026-06-18T08:00:00.000Z'),
  );
  assert.strictEqual(managedOffline.cappedHours, 72);
  assert.strictEqual(managedOffline.excessHours, 8);
  assert.strictEqual(managedOffline.capHours, 72);
  assert.strictEqual(managedOffline.capped, true);

  const tenYears = context.applyOfflineShopEarnings(
    offlineSource(),
    new Date('2036-06-15T00:00:00.000Z'),
  );
  assert.strictEqual(tenYears.earnings.cappedHours, 24);
  assert(tenYears.earnings.excessHours > 80000);
  assert.strictEqual(tenYears.gameState.shop.offlineEarnings.capped, true);
  assert.strictEqual(tenYears.gameState.shop.offlineEarnings.capHours, 24);
  assert(Number.isFinite(tenYears.gameState.shop.tofuStock));
  assert(Number.isFinite(tenYears.gameState.shop.deliveryOrders));
  assert(tenYears.gameState.shop.deliveryOrders <= context.deliveryOrderQueueCapacity());

  const futureClock = offlineSource();
  futureClock.shop.lastGeneratorTickAt = '2026-06-16T00:00:00.000Z';
  const negativeDelta = context.calculateOfflineShopEarnings(
    futureClock,
    new Date('2026-06-15T00:00:00.000Z'),
  );
  assert.strictEqual(negativeDelta.cappedHours, 0);
  assert.strictEqual(negativeDelta.tofuStock, 0);
  assert.strictEqual(negativeDelta.deliveryOrders, 0);

  vm.runInContext(`
function offlineMakeNode() {
  const node = { textContent: "", innerHTML: "", disabled: null, dataset: {}, classListValue: null, value: "" };
  node.classList = { toggle(_className, hidden) { node.classListValue = Boolean(hidden); } };
  node.querySelector = () => null;
  return node;
}
const offlineElements = {
  shopTabList: offlineMakeNode(),
  shopTabPanel: offlineMakeNode(),
  shopInlineResult: offlineMakeNode(),
  shopOfflineEarnings: offlineMakeNode(),
  gameShopStats: offlineMakeNode(),
  gameShopHelper: offlineMakeNode(),
  gameShopUnlocks: offlineMakeNode(),
  gameShopMilestones: offlineMakeNode(),
  gamePackTofuButton: offlineMakeNode(),
};
elements = { ...elements, ...offlineElements };
const offlineLong = ${JSON.stringify(tenYears.gameState)};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.shopTab = "overview";
renderTofuShop(offlineLong);
globalThis.generousOfflineSummaryFirst = offlineElements.shopOfflineEarnings.textContent;
renderTofuShop(offlineLong);
globalThis.generousOfflineSummarySecond = offlineElements.shopOfflineEarnings.textContent;
`, context);
  assert(context.generousOfflineSummaryFirst.includes('While you were away:'));
  assert(context.generousOfflineSummaryFirst.includes('longer absences are capped at 24 hours'));
  assert(context.generousOfflineSummaryFirst.includes('Suggested next:'));
  assert.strictEqual(context.generousOfflineSummaryFirst, context.generousOfflineSummarySecond);
  assert(!context.generousOfflineSummaryFirst.includes('Pack Tofu'));
  assert(!context.generousOfflineSummaryFirst.includes('undefined'));
  assert(!context.generousOfflineSummaryFirst.includes('NaN'));
  assert(!context.generousOfflineSummaryFirst.includes('Infinity'));
  const suggestions = context.generousOfflineSummaryFirst.split('Suggested next: ')[1].split('.')[0].split('; ');
  assert(suggestions.length <= 3);
}

function testTofuGarageNetWorthMilestonesAndShowcaseInterestV1() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });
  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(source.includes('$1T Net Worth'));
  assert(source.includes('SHOWCASE_PREP_COST'));
  assert(!source.includes('fetch('));
  assert(!source.includes('XMLHttpRequest'));
  assert(!source.includes('sendBeacon'));

  vm.runInContext(`
const traceNetWorthMilestones = ${TEST_TRACE_CONTEXT ? "true" : "false"};
let traceNetWorthMilestonesAt = Date.now();
let traceNormalizeCalls = 0;
if (traceNetWorthMilestones) {
  const traceOriginalNormalizeGameState = normalizeGameState;
  normalizeGameState = function tracedNormalizeGameState(value) {
    traceNormalizeCalls += 1;
    return traceOriginalNormalizeGameState(value);
  };
}
function traceNetWorthMilestonesStep(label) {
  if (!traceNetWorthMilestones) return;
  const now = Date.now();
  console.error('[networth-step] ' + label + ' ' + (now - traceNetWorthMilestonesAt) + 'ms normalize=' + traceNormalizeCalls);
  traceNormalizeCalls = 0;
  traceNetWorthMilestonesAt = now;
}
function buildDreamFiveState(cash) {
  const state = defaultGameState();
  state.shop.tips = cash;
  state.shop.lifetimeTips = Math.max(state.shop.lifetimeTips, cash, 100000);
  state.shop.lifetimeDeliveryOrders = 150;
  state.shop.reputation = 2000000;
  state.shop.shopLevel = 150;
  state.shop.tofuStock = 500000;
  state.shop.deliveryOrders = 0;
  state.shop.prepSlots = 0;
  state.shop.stations.tofu_press = 5;
  state.shop.stations.prep_counter = 5;
  state.shop.stations.delivery_shelf = 1;
  state.shop.stations.shop_sign = 1;
  state.shop.stationUpgrades.counter_service_crew = 1;
  state.shop.stationUpgrades.manager_shift_manager = 1;
  state.shop.stationUpgrades.manager_wholesale_pickup = 1;
  state.shop.wholesalePickupsCompleted = 1;
  state.stamps.first_shop_order = { label: 'First Shop Order' };
  state.stamps.first_upgrade_purchased = { label: 'First Upgrade Purchased' };
  state.stamps.first_10_orders = { label: 'First 10 Orders' };
  state.stamps.first_family_tofu_tray = { label: 'First Family Tofu Tray' };
  state.stamps.first_100_tips = { label: 'First $100 Cash' };
  state.shop.coveredCarTeaserUnlocked = true;
  state.shop.coveredCarTeaserSeen = true;
  state.shop.dreamBuild.wheelsPurchased = true;
  state.shop.dreamBuild.wheelsLevel = 3;
  state.shop.dreamBuild.exhaustPurchased = true;
  state.shop.dreamBuild.exhaustLevel = 2;
  return state;
}

const fresh = defaultGameState();
globalThis.freshNetWorthMilestoneCard = renderNetWorthMilestoneCard(fresh);
globalThis.freshShowcaseCard = renderShowcaseInterestCard(fresh);
globalThis.freshSponsorCard = renderSponsorInquiryCard(fresh);
traceNetWorthMilestonesStep('fresh');

const underMillion = buildDreamFiveState(0);
globalThis.underMillionNetWorth = netWorthV1(underMillion);
globalThis.underMillionMilestone = nextNetWorthMilestone(underMillion);
globalThis.underMillionMilestoneCard = renderNetWorthMilestoneCard(underMillion);
globalThis.underMillionShowcaseUnlocked = showcaseInterestUnlocked(underMillion);
globalThis.underMillionShowcaseCard = renderShowcaseInterestCard(underMillion);
globalThis.underMillionSponsorCard = renderSponsorInquiryCard(underMillion);
globalThis.underMillionNextMilestone = nextMilestoneForShop(underMillion);
globalThis.underMillionNetWorthCard = renderNetWorthCard(underMillion);
traceNetWorthMilestonesStep('under-million');

const millionRaw = buildDreamFiveState(600000);
globalThis.millionNetWorthBeforeSync = netWorthV1(millionRaw);
const synced = syncNetWorthMilestones(millionRaw);
globalThis.millionNewMilestones = synced.newMilestones.map((milestone) => milestone.id);
globalThis.millionReachedIds = synced.gameState.shop.dreamBuild.netWorthMilestonesReached.slice();
globalThis.millionLastResult = synced.gameState.shop.counterService.lastResult;
globalThis.millionLedgerCount = synced.gameState.shop.ledger.filter((entry) => entry.text.includes('Net Worth milestone reached')).length;
const syncedAgain = syncNetWorthMilestones(synced.gameState);
globalThis.millionNewAgain = syncedAgain.newMilestones.length;
globalThis.millionLedgerCountAgain = syncedAgain.gameState.shop.ledger.filter((entry) => entry.text.includes('Net Worth milestone reached')).length;
synced.gameState.shop.stations.tofu_press = 20;
synced.gameState.shop.stations.prep_counter = 20;
synced.gameState.shop.stations.delivery_shelf = 20;
synced.gameState.shop.stations.shop_sign = 20;
globalThis.millionNextNetWorth = nextNetWorthMilestone(synced.gameState);
globalThis.millionMilestoneCard = renderNetWorthMilestoneCard(synced.gameState);
globalThis.millionShowcaseUnlocked = showcaseInterestUnlocked(synced.gameState);
globalThis.millionShowcaseStatus = showcasePrepStatus(synced.gameState);
globalThis.millionShowcaseCard = renderShowcaseInterestCard(synced.gameState);
globalThis.millionSponsorCard = renderSponsorInquiryCard(synced.gameState);
traceNetWorthMilestonesStep('million-showcase-card');
globalThis.millionNextMilestone = nextMilestoneForShop(synced.gameState);
traceNetWorthMilestonesStep('million-next-milestone');
globalThis.millionAction = nextBestAction(synced.gameState);
traceNetWorthMilestonesStep('million-next-action');
globalThis.millionReturningActions = returningPlayerSuggestedActions(synced.gameState);
traceNetWorthMilestonesStep('million-synced');

const urgent = JSON.parse(JSON.stringify(synced.gameState));
urgent.shop.deliveryOrders = deliveryOrderQueueCapacity();
globalThis.urgentShowcaseAction = nextBestAction(urgent);
traceNetWorthMilestonesStep('urgent-action');
globalThis.urgentShowcaseMilestone = nextMilestoneForShop(urgent);
traceNetWorthMilestonesStep('urgent');

const prepResult = buyShowcasePrep(synced.gameState, { now: new Date('2026-06-18T17:00:00Z') });
traceNetWorthMilestonesStep('prep-buy');
globalThis.showcasePrepOk = prepResult.ok;
globalThis.showcasePrepFeedback = prepResult.feedback;
globalThis.showcasePrepCashAfter = prepResult.gameState.shop.tips;
globalThis.showcasePrepPrepared = prepResult.gameState.shop.dreamBuild.showcaseDisplayPrepared;
globalThis.showcasePrepAt = prepResult.gameState.shop.dreamBuild.showcaseDisplayPreparedAt;
globalThis.showcasePrepValue = projectCarValueV1(prepResult.gameState);
globalThis.showcasePrepNetWorth = netWorthV1(prepResult.gameState);
globalThis.showcasePrepFormula = cashBalance(prepResult.gameState) + tofuBusinessValue(prepResult.gameState) + projectCarValueV1(prepResult.gameState) + brandValueV1(prepResult.gameState);
globalThis.showcasePrepCard = renderShowcaseInterestCard(prepResult.gameState);
globalThis.showcasePrepSponsorUnlocked = sponsorInquiryUnlocked(prepResult.gameState);
globalThis.showcasePrepSponsorStatus = sponsorInquiryStatus(prepResult.gameState);
globalThis.showcasePrepSponsorCard = renderSponsorInquiryCard(prepResult.gameState);
globalThis.showcasePrepNextMilestone = nextMilestoneForShop(prepResult.gameState);
traceNetWorthMilestonesStep('prep-next-milestone');
globalThis.showcasePrepAction = nextBestAction(prepResult.gameState);
traceNetWorthMilestonesStep('prep-next-action');
const sponsorResult = acceptSponsorInquiry(prepResult.gameState, { now: new Date('2026-06-18T18:00:00Z') });
globalThis.sponsorOk = sponsorResult.ok;
globalThis.sponsorFeedback = sponsorResult.feedback;
globalThis.sponsorCashAfter = sponsorResult.gameState.shop.tips;
globalThis.sponsorBrandValue = brandValueV1(sponsorResult.gameState);
globalThis.sponsorAccepted = sponsorInquiryAccepted(sponsorResult.gameState);
globalThis.sponsorAcceptedAt = sponsorResult.gameState.shop.dreamBuild.sponsor.inquiryAcceptedAt;
globalThis.sponsorNetWorth = netWorthV1(sponsorResult.gameState);
globalThis.sponsorFormula = cashBalance(sponsorResult.gameState) + tofuBusinessValue(sponsorResult.gameState) + projectCarValueV1(sponsorResult.gameState) + brandValueV1(sponsorResult.gameState);
globalThis.sponsorCard = renderSponsorInquiryCard(sponsorResult.gameState);
globalThis.sponsorNetWorthCard = renderNetWorthCard(sponsorResult.gameState);
globalThis.sponsorNextMilestone = nextMilestoneForShop(sponsorResult.gameState);
globalThis.sponsorAction = nextBestAction(sponsorResult.gameState);
globalThis.secondSponsor = acceptSponsorInquiry(sponsorResult.gameState);
globalThis.activeSponsor = acceptSponsorInquiry(prepResult.gameState, { activeDrive: true });
const urgentSponsor = JSON.parse(JSON.stringify(prepResult.gameState));
urgentSponsor.shop.deliveryOrders = deliveryOrderQueueCapacity();
globalThis.urgentSponsorAction = nextBestAction(urgentSponsor);
globalThis.urgentSponsorMilestone = nextMilestoneForShop(urgentSponsor);
globalThis.secondShowcasePrep = buyShowcasePrep(prepResult.gameState);
globalThis.activeShowcasePrep = buyShowcasePrep(synced.gameState, { activeDrive: true });
traceNetWorthMilestonesStep('prep-purchase');

saveGameState(sponsorResult.gameState);
const reloaded = loadGameState();
globalThis.reloadedShowcasePrepared = reloaded.shop.dreamBuild.showcaseDisplayPrepared;
globalThis.reloadedShowcaseValue = projectCarValueV1(reloaded);
globalThis.reloadedShowcaseCard = renderShowcaseInterestCard(reloaded);
globalThis.reloadedSponsorAccepted = sponsorInquiryAccepted(reloaded);
globalThis.reloadedBrandValue = brandValueV1(reloaded);
globalThis.reloadedSponsorCard = renderSponsorInquiryCard(reloaded);
globalThis.reloadedSecondSponsor = acceptSponsorInquiry(reloaded);

appState.running = true;
appState.calibrating = false;
globalThis.activeMilestoneCard = renderNetWorthMilestoneCard(prepResult.gameState);
globalThis.activeShowcaseCard = renderShowcaseInterestCard(prepResult.gameState);
globalThis.activeSponsorCard = renderSponsorInquiryCard(prepResult.gameState);
appState.running = false;
appState.calibrating = true;
globalThis.calibratingShowcaseCard = renderShowcaseInterestCard(prepResult.gameState);
globalThis.calibratingSponsorCard = renderSponsorInquiryCard(prepResult.gameState);
traceNetWorthMilestonesStep('render-active');
`, context);

  assert.strictEqual(context.freshNetWorthMilestoneCard, '');
  assert.strictEqual(context.freshShowcaseCard, '');
  assert.strictEqual(context.freshSponsorCard, '');
  assert(context.underMillionNetWorth < 1000000);
  assert.strictEqual(context.underMillionMilestone.id, 'net_worth_1m');
  assert(context.underMillionMilestoneCard.includes('Next Net Worth Milestone'));
  assert(context.underMillionMilestoneCard.includes('$1M Net Worth'));
  assert.strictEqual(context.underMillionShowcaseUnlocked, false);
  assert.strictEqual(context.underMillionShowcaseCard, '');
  assert.strictEqual(context.underMillionSponsorCard, '');
  assert.strictEqual(context.underMillionNextMilestone.id, 'net_worth_1m');
  assert(context.underMillionNetWorthCard.includes('Cash'));
  assert(context.underMillionNetWorthCard.includes('Tofu Business Value'));
  assert(context.underMillionNetWorthCard.includes('Project Car Value'));
  assert(context.underMillionNetWorthCard.includes('Formula: Cash + Tofu Business Value + Project Car Value'));

  assert(context.millionNetWorthBeforeSync >= 1000000);
  assert.strictEqual(context.millionNewMilestones.length, 1);
  assert.strictEqual(context.millionNewMilestones[0], 'net_worth_1m');
  assert(context.millionReachedIds.includes('net_worth_1m'));
  assert(context.millionLastResult.includes('Net Worth milestone reached: First $1M'));
  assert.strictEqual(context.millionLedgerCount, 1);
  assert.strictEqual(context.millionNewAgain, 0);
  assert.strictEqual(context.millionLedgerCountAgain, 1);
  assert.strictEqual(context.millionNextNetWorth.id, 'net_worth_10m');
  assert(context.millionMilestoneCard.includes('Net Worth Milestone Reached'));
  assert(context.millionMilestoneCard.includes('First $1M'));
  assert(context.millionMilestoneCard.includes('Next: $10M Net Worth'));
  assert.strictEqual(context.millionShowcaseUnlocked, true);
  assert.strictEqual(context.millionShowcaseStatus.prepared, false);
  assert.strictEqual(context.millionShowcaseStatus.cost, 500000);
  assert.strictEqual(context.millionShowcaseStatus.valueAdded, 300000);
  assert(context.millionShowcaseCard.includes('Showcase Interest'));
  assert(context.millionShowcaseCard.includes('Prepare Showcase Display'));
  assert(context.millionShowcaseCard.includes('Project Car Value +$300K'));
  assert(context.millionShowcaseCard.includes('Unlocks: Sponsor Inquiry after the first Net Worth milestone'));
  assert(!context.millionShowcaseCard.includes('Buy Sponsor'));
  assert.strictEqual(context.millionSponsorCard, '');
  assert.strictEqual(context.millionNextMilestone.id, 'prepare_showcase_display');
  assert.strictEqual(context.millionAction.type, 'prepare_showcase');
  assert.strictEqual(context.millionAction.buttonLabel, 'Prepare Showcase Display');
  assert(context.millionReturningActions.length <= 3);
  assert(context.millionReturningActions.some((item) => item.includes('$1M Net Worth') || item.includes('Showcase Prep')));

  assert.notStrictEqual(context.urgentShowcaseAction.type, 'prepare_showcase');
  assert(context.urgentShowcaseAction.title.includes('Clear the Order Queue') || context.urgentShowcaseAction.copy.includes('queue is full'));
  assert.notStrictEqual(context.urgentShowcaseMilestone.id, 'prepare_showcase_display');

  assert.strictEqual(context.showcasePrepOk, true);
  assert.strictEqual(context.showcasePrepFeedback, 'Showcase Display Prepared.');
  assert.strictEqual(context.showcasePrepCashAfter, 100000);
  assert.strictEqual(context.showcasePrepPrepared, true);
  assert(context.showcasePrepAt.includes('2026-06-18'));
  assert.strictEqual(context.showcasePrepValue, 775000);
  assert.strictEqual(context.showcasePrepNetWorth, context.showcasePrepFormula);
  assert(context.showcasePrepCard.includes('Showcase Display Prepared'));
  assert(context.showcasePrepCard.includes('Sponsor Inquiry is available'));
  assert(!context.showcasePrepCard.includes('Buy Sponsor'));
  assert.strictEqual(context.showcasePrepSponsorUnlocked, true);
  assert.strictEqual(context.showcasePrepSponsorStatus.accepted, false);
  assert.strictEqual(context.showcasePrepSponsorStatus.cashReward, 250000);
  assert.strictEqual(context.showcasePrepSponsorStatus.brandValueReward, 500000);
  assert(context.showcasePrepSponsorCard.includes('Sponsor Inquiry'));
  assert(context.showcasePrepSponsorCard.includes('Accept Sponsor Inquiry'));
  assert(context.showcasePrepSponsorCard.includes('+$250K Cash'));
  assert(context.showcasePrepSponsorCard.includes('Brand Value +$500K'));
  assert(context.showcasePrepSponsorCard.includes('Sponsor packages remain future'));
  assert.strictEqual(context.showcasePrepNextMilestone.id, 'accept_sponsor_inquiry');
  assert.strictEqual(context.showcasePrepAction.type, 'accept_sponsor_inquiry');
  assert.strictEqual(context.showcasePrepAction.buttonLabel, 'Accept Sponsor Inquiry');
  assert.strictEqual(context.sponsorOk, true);
  assert.strictEqual(context.sponsorFeedback, 'Sponsor Inquiry accepted.');
  assert.strictEqual(context.sponsorCashAfter, 350000);
  assert.strictEqual(context.sponsorBrandValue, 500000);
  assert.strictEqual(context.sponsorAccepted, true);
  assert(context.sponsorAcceptedAt.includes('2026-06-18'));
  assert.strictEqual(context.sponsorNetWorth, context.sponsorFormula);
  assert(context.sponsorCard.includes('Sponsor Interest'));
  assert(context.sponsorCard.includes('Local sponsor onboarded'));
  assert(context.sponsorCard.includes('Brand Value'));
  assert(context.sponsorCard.includes('$500K'));
  assert(context.sponsorCard.includes('Sponsor packages come later'));
  assert(!context.sponsorCard.includes('Accept Sponsor Inquiry'));
  assert(context.sponsorNetWorthCard.includes('Brand Value'));
  assert(context.sponsorNetWorthCard.includes('Formula: Cash + Tofu Business Value + Project Car Value + Brand Value'));
  assert.strictEqual(context.sponsorNextMilestone.id, 'net_worth_10m');
  assert.notStrictEqual(context.sponsorAction.type, 'accept_sponsor_inquiry');
  assert.strictEqual(context.secondSponsor.ok, false);
  assert.strictEqual(context.activeSponsor.ok, false);
  assert.notStrictEqual(context.urgentSponsorAction.type, 'accept_sponsor_inquiry');
  assert.notStrictEqual(context.urgentSponsorMilestone.id, 'accept_sponsor_inquiry');
  assert.strictEqual(context.secondShowcasePrep.ok, false);
  assert.strictEqual(context.activeShowcasePrep.ok, false);
  assert.strictEqual(context.reloadedShowcasePrepared, true);
  assert.strictEqual(context.reloadedShowcaseValue, 775000);
  assert(context.reloadedShowcaseCard.includes('Showcase Display Prepared'));
  assert.strictEqual(context.reloadedSponsorAccepted, true);
  assert.strictEqual(context.reloadedBrandValue, 500000);
  assert(context.reloadedSponsorCard.includes('Sponsor Interest'));
  assert.strictEqual(context.reloadedSecondSponsor.ok, false);
  assert.strictEqual(context.activeMilestoneCard, '');
  assert.strictEqual(context.activeShowcaseCard, '');
  assert.strictEqual(context.activeSponsorCard, '');
  assert.strictEqual(context.calibratingShowcaseCard, '');
  assert.strictEqual(context.calibratingSponsorCard, '');
}

function testTofuGarageHighScalePerformanceGuardrails() {
  const intervalCalls = [];
  const context = loadNoSpillContext({
    window: {
      localStorage: makeLocalStorage(),
      setInterval(callback, ms) {
        intervalCalls.push({ callback, ms });
        return intervalCalls.length;
      },
    },
  });
  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(source.includes('SHOP_RENDER_THROTTLE_MS'));
  assert(source.includes('renderLiveShopUpdate(nextState, now)'));
  assert(!source.includes('deliveryOrders.map'));
  assert(!source.includes('deliveryOrders.forEach'));
  assert(!source.includes('new Array(deliveryOrders'));

  const state = context.defaultGameState();
  state.shop.tofuStock = 1000000;
  state.shop.deliveryOrders = context.deliveryOrderQueueCapacity();
  state.shop.reputation = 500000;
  state.shop.shopLevel = 100;
  state.shop.stations.tofu_press = 100;
  state.shop.stations.prep_counter = 100;
  state.shop.stations.delivery_shelf = 10;
  state.shop.stationUpgrades.tofu_press_faster = 10;
  state.shop.stationUpgrades.tofu_press_double = 8;
  state.shop.stationUpgrades.soy_supplier_contract = 1;
  state.shop.stationUpgrades.morning_soy_delivery = 1;
  state.shop.stationUpgrades.bulk_soy_delivery = 1;
  state.shop.lastGeneratorTickAt = '2026-06-15T12:00:00.000Z';

  const normalized = context.defaultGameState();
  assert.strictEqual(typeof normalized.shop.deliveryOrders, 'number');
  assert.strictEqual(Array.isArray(normalized.shop.deliveryOrders), false);
  assert.strictEqual(context.formatCompactNumber(1000000), '1M');
  assert(!context.formatCompactNumber(123456789).includes('.000'));

  const ticked = context.applyShopGeneratorTick(state, new Date('2026-06-15T13:00:00.000Z'), {
    maxSeconds: 3600,
  });
  assert(ticked.gameState.shop.deliveryOrders <= context.deliveryOrderQueueCapacity());
  assert.strictEqual(ticked.earnings.queueFull, true);
  assert.strictEqual(ticked.earnings.queueCapacity, context.deliveryOrderQueueCapacity());

  const cappedSource = context.defaultGameState();
  cappedSource.shop.tofuStock = 1000000;
  cappedSource.shop.deliveryOrders = context.deliveryOrderQueueCapacity() - 2;
  cappedSource.shop.reputation = 500000;
  cappedSource.shop.shopLevel = 100;
  cappedSource.shop.stations.prep_counter = 100;
  cappedSource.shop.stationUpgrades.bulk_soy_delivery = 1;
  cappedSource.shop.lastGeneratorTickAt = '2026-06-15T00:00:00.000Z';
  const offline = context.calculateOfflineShopEarnings(cappedSource, new Date('2026-06-16T00:00:00.000Z'));
  assert(offline.deliveryOrders <= 2);
  assert.strictEqual(offline.cappedHours, 24);
  assert.strictEqual(offline.queueFull, false);

  let ledgerState = context.defaultGameState();
  for (let index = 0; index < 150; index += 1) {
    ledgerState = context.addLedgerEntry(ledgerState, 'perf', `Entry ${index}`);
  }
  assert(ledgerState.shop.ledger.length <= 80);

  vm.runInContext(`
function makeNode() {
  const node = { textContent: "", innerHTML: "", disabled: null, dataset: {}, value: "", updates: 0 };
  node.classList = { toggle() {} };
  node.querySelector = () => null;
  return node;
}
const node = makeNode();
globalThis.firstSetChanged = setTextIfChanged(node, "1M");
globalThis.secondSetChanged = setTextIfChanged(node, "1M");
elements = {
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopReach: makeNode(),
  shopSpirit: makeNode(),
  shopLicenseStars: makeNode(),
  shopBuyMultiplier: makeNode(),
  packTofuButton: makeNode(),
  fulfillShopOrderButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopInlineResult: makeNode(),
  shopOfflineEarnings: makeNode(),
};
const renderState = ${JSON.stringify(state)};
appState.surface = "cup-test";
globalThis.hiddenRender = renderLiveShopUpdate(renderState, new Date("2026-06-15T12:00:01.000Z"));
appState.surface = "shop";
appState.shopTab = "overview";
globalThis.visibleRender = renderLiveShopUpdate(renderState, new Date("2026-06-15T12:00:01.000Z"));
globalThis.visibleRenderRepeat = renderLiveShopUpdate(renderState, new Date("2026-06-15T12:00:01.100Z"));
globalThis.renderedOrderText = elements.shopDeliveryOrders.textContent;
`, context);
  assert.strictEqual(context.firstSetChanged, true);
  assert.strictEqual(context.secondSetChanged, false);
  assert.strictEqual(context.hiddenRender, false);
  assert.strictEqual(context.visibleRender, true);
  assert.strictEqual(context.visibleRenderRepeat, false);
  assert(!context.renderedOrderText.includes('undefined'));
  assert(!/NaN|Infinity/.test(context.renderedOrderText));

  const fullQueue = context.defaultGameState();
  fullQueue.shop.deliveryOrders = context.deliveryOrderQueueCapacity();
  fullQueue.shop.tofuStock = 10000;
  fullQueue.shop.lifetimeDeliveryOrders = 20;
  fullQueue.stamps.first_10_orders = { label: 'First 10 Orders', date: '2026-06-15T12:00:00.000Z' };
  const action = context.nextBestAction(fullQueue);
  assert.strictEqual(action.type, 'queue_full');
  assert(action.copy.includes('order queue is full'));

  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(!html.includes('id="shop-tab-panel" aria-live="polite"'));

  vm.runInContext(`
let shopRenderCalls = 0;
let cupRenderCalls = 0;
let crewRenderCalls = 0;
function sectionNode(surface) {
  const node = makeNode();
  node.dataset = { appSurface: surface };
  node.hiddenState = null;
  node.classList = {
    toggle(_className, hidden) { node.hiddenState = Boolean(hidden); },
    add() { node.hiddenState = true; },
  };
  return node;
}
renderGameDashboard = () => { shopRenderCalls += 1; };
renderTofuShop = () => { shopRenderCalls += 1; };
renderDeliveryLog = () => { cupRenderCalls += 1; };
renderMerchProgress = () => { cupRenderCalls += 1; };
renderSimulatorPanel = () => { cupRenderCalls += 1; };
renderCollectionPanel = () => { crewRenderCalls += 1; };
renderSurfaceNavigation = () => {};
renderBrandShelf = () => {};
elements = {
  surfaceSections: [sectionNode("shop"), sectionNode("cup-test"), sectionNode("crew")],
  deliveryBoardSection: makeNode(),
  tofuShopSection: makeNode(),
  collectionSection: makeNode(),
};
appState.surface = "shop";
renderGamePanels(${JSON.stringify(state)});
globalThis.shopSurfaceRenderCounts = { shopRenderCalls, cupRenderCalls, crewRenderCalls };
globalThis.shopSurfaceHiddenStates = elements.surfaceSections.map((section) => section.hiddenState);
`, context);
  assert.strictEqual(context.shopSurfaceRenderCounts.shopRenderCalls, 2);
  assert.strictEqual(context.shopSurfaceRenderCounts.cupRenderCalls, 0);
  assert.strictEqual(context.shopSurfaceRenderCounts.crewRenderCalls, 0);
  assert.strictEqual(JSON.stringify(context.shopSurfaceHiddenStates), JSON.stringify([false, true, true]));
}

function testTofuGarageManagerDeskV1() {
  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });
  const state = context.defaultGameState();
  state.shop.tips = 500000;
  state.shop.reputation = 5000000;
  state.shop.lifetimeReputation = 5000000;
  state.shop.shopLevel = 500;
  state.shop.tofuStock = 1000000;
  state.shop.deliveryOrders = context.deliveryOrderQueueCapacity();
  state.shop.lifetimeDeliveryOrders = 2000;
  state.shop.stations.tofu_press = 100;
  state.shop.stations.prep_counter = 100;
  state.shop.stations.delivery_shelf = 10;
  state.shop.stations.shop_sign = 10;
  state.shop.stationUpgrades.counter_service_bell = 1;
  state.shop.stationUpgrades.counter_service_wide = 1;
  state.shop.stationUpgrades.counter_service_routine = 1;
  state.shop.stationUpgrades.counter_service_register = 1;
  state.shop.stationUpgrades.counter_service_window = 1;
  state.shop.stationUpgrades.counter_service_crew = 1;
  state.shop.stationUpgrades.soy_supplier_contract = 1;
  state.shop.stationUpgrades.morning_soy_delivery = 1;
  state.shop.stationUpgrades.bulk_soy_delivery = 1;
  state.shop.counterService.running = true;
  state.shop.counterService.lastHandoffAt = '2026-06-15T12:00:00.000Z';
  state.stamps.first_shop_order = { label: 'First Shop Order', date: '2026-06-15T12:00:00.000Z' };
  state.stamps.first_10_orders = { label: 'First 10 Orders', date: '2026-06-15T12:00:00.000Z' };
  state.stamps.first_family_tofu_tray = { label: 'First Family Tofu Tray', date: '2026-06-15T12:00:00.000Z' };
  state.stamps.first_100_tips = { label: 'First 100 Tips', date: '2026-06-15T12:00:00.000Z' };

  assert.strictEqual(context.managerDeskUnlocked(state), true);
  assert.strictEqual(context.nextManagerDeskUpgrade(state, false).id, 'manager_shift_manager');
  const managerAction = context.nextBestAction(state, { date: new Date('2026-06-15T12:00:00.000Z') });
  assert.strictEqual(managerAction.type, 'buy_upgrade');
  assert.strictEqual(managerAction.upgradeId, 'manager_shift_manager');
  assert(managerAction.copy.includes('Manager Desk'));

  const milestone = context.nextMilestoneForShop(state);
  assert.strictEqual(milestone.id, 'manager_shift_manager');
  assert(milestone.reward.includes('Counter Service batch size'));

  const hired = context.buyStationUpgrade('manager_shift_manager', state);
  assert.strictEqual(hired.ok, true);
  assert.strictEqual(context.counterServiceBatchSize(hired.gameState), 25);
  assert(hired.costTips > 0);
  assert(hired.costReputation > 0);

  const wholesale = context.buyStationUpgrade('manager_wholesale_pickup', hired.gameState);
  assert.strictEqual(wholesale.ok, true);
  assert.strictEqual(context.wholesalePickupUnlocked(wholesale.gameState), true);
  assert.strictEqual(Array.isArray(wholesale.gameState.shop.deliveryOrders), false);
  assert(context.wholesalePickupQuantity(wholesale.gameState, 1) > 0);

  const beforeOrders = wholesale.gameState.shop.deliveryOrders;
  const tick = context.applyCounterServiceTick(
    wholesale.gameState,
    new Date('2026-06-15T12:00:04.000Z'),
  );
  assert(tick.completed > 25);
  assert(tick.totals.wholesaleCompleted > 0);
  assert(tick.message.includes('Wholesale Pickup'));
  assert(tick.gameState.shop.deliveryOrders < beforeOrders);
  assert(tick.gameState.shop.tofuStock >= 0);
  assert.strictEqual(Array.isArray(tick.gameState.shop.deliveryOrders), false);
  assert.strictEqual(tick.gameState.shop.ledger.filter((entry) => entry.type === 'automation' && entry.text.includes('Wholesale Pickup')).length, 1);

  vm.runInContext(`
function makeNode() {
  const node = { textContent: "", innerHTML: "", disabled: null, dataset: {}, classListValue: null, value: "" };
  node.classList = { toggle() {} };
  node.querySelector = () => null;
  return node;
}
elements = {
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopInlineResult: makeNode(),
  shopOfflineEarnings: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.shopTab = "upgrades";
renderTofuShop(${JSON.stringify(state)});
globalThis.managerUpgradeHtml = elements.shopTabPanel.innerHTML;
`, context);
  assert(context.managerUpgradeHtml.includes('Hire Shift Manager'));
  assert(context.managerUpgradeHtml.includes('$75K + 1M Reputation'));
  assert(context.managerUpgradeHtml.includes('Opens Manager Desk scale'));
}

function testTofuGarageBulkBuyingAffordabilityAndUnfoldAudit() {
  assert(fs.existsSync(path.join(ROOT, 'TOFU_GARAGE_UNFOLD_AUDIT.md')));
  const audit = fs.readFileSync(path.join(ROOT, 'TOFU_GARAGE_UNFOLD_AUDIT.md'), 'utf8');
  ['Tofu Stock', 'Delivery Orders', 'Counter Service', 'Supplier Contracts', 'Manager Desk', 'Wholesale Pickup'].forEach((term) => {
    assert(audit.includes(term));
  });

  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });
  const state = context.defaultGameState();
  state.shop.tips = 200;
  state.shop.tofuStock = 100;
  state.shop.deliveryOrders = 3;
  state.shop.lifetimeDeliveryOrders = 3;
  state.stamps.first_shop_order = { label: 'First Shop Order', date: '2026-06-15T12:00:00.000Z' };

  const cheapestUpgrade = context.buyBulkShopItems(state, 'upgrades', 'cheapest');
  assert.strictEqual(cheapestUpgrade.ok, true);
  assert.strictEqual(cheapestUpgrade.names[0], 'Tidy Packaging');
  assert.strictEqual(cheapestUpgrade.gameState.shop.stationUpgrades.prep_counter_faster, 1);
  assert.strictEqual(cheapestUpgrade.gameState.shop.stationUpgrades.route_familiarity, 0);
  assert(cheapestUpgrade.message.includes('Bought cheapest upgrade: Tidy Packaging.'));

  const allUpgrades = context.buyBulkShopItems(state, 'upgrades', 'all');
  assert.strictEqual(allUpgrades.ok, true);
  assert(allUpgrades.purchased > 1);
  assert(allUpgrades.purchased <= 100);
  assert.strictEqual(allUpgrades.loopCapped, false);
  assert.strictEqual(allUpgrades.gameState.shop.stationUpgrades.route_familiarity, 0);
  assert(allUpgrades.gameState.shop.ledger.filter((entry) => entry.type === 'upgrade').length <= 2);
  assert(allUpgrades.message.includes('Bought'));

  const maxed = JSON.parse(JSON.stringify(state));
  Object.keys(maxed.shop.stationUpgrades).forEach((id) => {
    maxed.shop.stationUpgrades[id] = 100;
  });
  const noUpgrade = context.buyBulkShopItems(maxed, 'upgrades', 'cheapest');
  assert.strictEqual(noUpgrade.ok, false);
  assert(noUpgrade.reason.includes('No affordable upgrades'));

  const stationState = context.defaultGameState();
  stationState.shop.tips = 80;
  stationState.shop.prepSlots = 10;
  const cheapestStation = context.buyBulkShopItems(stationState, 'stations', 'cheapest');
  assert.strictEqual(cheapestStation.ok, true);
  assert.strictEqual(cheapestStation.names[0], 'Tofu Press');
  const allStations = context.buyBulkShopItems(stationState, 'stations', 'all');
  assert.strictEqual(allStations.ok, true);
  assert(allStations.purchased > 1);
  assert(allStations.purchased <= 100);
  assert.strictEqual(allStations.gameState.shop.stations.regular_customer, 0);

  const progressState = context.defaultGameState();
  progressState.shop.tips = 10;
  progressState.shop.deliveryOrders = 1;
  progressState.shop.tofuStock = 30;
  progressState.shop.lifetimeDeliveryOrders = 1;
  progressState.shop.lifetimeTips = 10;
  progressState.stamps.first_shop_order = { label: 'First Shop Order', date: '2026-06-15T12:00:00.000Z' };
  const tidyStatus = context.upgradeAffordabilityStatus(
    context.shopUpgradeById('prep_counter_faster'),
    progressState,
  );
  assert(!tidyStatus || tidyStatus.level === 0);

  const progress = context.affordabilityProgress([
    { label: 'Cash', current: 10, required: 20, perSecond: 1 },
    { label: 'Reputation', current: 100, required: 50, perSecond: 0 },
  ]);
  assert.strictEqual(progress.label, 'Waiting on Cash');
  assert(progress.etaText.includes('0:10'));
  const blockedProgress = context.affordabilityProgress([
    { label: 'Cash', current: 10, required: 20, perSecond: 0 },
  ]);
  assert.strictEqual(blockedProgress.etaText, '');
  assert(!JSON.stringify(progress).includes('Infinity'));
  assert(!JSON.stringify(progress).includes('NaN'));

  vm.runInContext(`
function makeNode() {
  const node = { textContent: "", innerHTML: "", disabled: null, dataset: {}, classListValue: null, value: "" };
  node.classList = { toggle() {} };
  node.querySelector = () => null;
  return node;
}
elements = {
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopInlineResult: makeNode(),
  shopOfflineEarnings: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.shopTab = "upgrades";
renderTofuShop(${JSON.stringify(progressState)});
globalThis.bulkUpgradeHtml = elements.shopTabPanel.innerHTML;
appState.shopTab = "production";
renderTofuShop(${JSON.stringify(stationState)});
globalThis.bulkStationHtml = elements.shopTabPanel.innerHTML;
const offlineState = ${JSON.stringify(state)};
offlineState.shop.offlineEarnings = {
  tofuStock: 100,
  deliveryOrders: 10,
  tips: 0,
  tofuConsumed: 20,
  counterServicePaused: true,
  cappedHours: 2,
};
renderTofuShop(offlineState);
globalThis.bulkOfflineText = elements.shopOfflineEarnings.textContent;
`, context);
  assert(context.bulkUpgradeHtml.includes('Buy Cheapest Upgrade'));
  assert(context.bulkUpgradeHtml.includes('Buy All Affordable Upgrades'));
  assert(context.bulkUpgradeHtml.includes('Waiting on Cash'));
  assert(context.bulkUpgradeHtml.includes('0:10'));
  assert(context.bulkStationHtml.includes('Buy Cheapest Station'));
  assert(context.bulkStationHtml.includes('Buy All Affordable Stations'));
  assert(context.bulkOfflineText.includes('Suggested next:'));
  assert(!context.bulkOfflineText.includes('Pack Tofu'));
  assert(!context.bulkUpgradeHtml.includes('Route Familiarity'));
  assert(!context.bulkUpgradeHtml.includes('undefined'));
  assert(!context.bulkUpgradeHtml.includes('Infinity'));
  assert(!context.bulkUpgradeHtml.includes('NaN'));

  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(source.includes('SHOP_BULK_BUY_LOOP_CAP'));
  assert(!source.includes('fetch('));
  assert(!source.includes('XMLHttpRequest'));
  assert(!source.includes('sendBeacon'));
}

function testTofuGarageCashAndNetWorthV1() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(html.includes('<span>Cash</span>'));
  assert(!html.includes('<span>Tips</span>'));
  assert(!html.includes('1 trillion shares'));

  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });

  const fresh = context.defaultGameState();
  assert.strictEqual(context.cashBalance(fresh), 0);
  assert.strictEqual(context.shouldShowNetWorthV1(fresh), false);
  assert.strictEqual(context.renderNetWorthCard(fresh), '');

  const oldSave = context.normalizeGameState({
    shop: {
      tips: 1234,
      lifetimeTips: 1234,
    },
  });
  assert.strictEqual(context.cashBalance(oldSave), 1234);
  assert.strictEqual(context.formatCashBalance(oldSave.shop.tips), '$1.23K');

  const netWorthBeforeEarn = context.netWorthV1(fresh);
  const earned = context.fulfillShopOrders(fresh, 1, {
    activeDrive: false,
    orderTypeId: 'simple_tofu_box',
    suppressFanfare: true,
  }).gameState;
  assert.strictEqual(earned.shop.tips, 10);
  assert.strictEqual(context.cashBalance(earned), 10);
  assert(context.netWorthV1(earned) > netWorthBeforeEarn);

  const upgradeReady = JSON.parse(JSON.stringify(earned));
  upgradeReady.shop.tips = 100;
  upgradeReady.shop.lifetimeTips = 100;
  upgradeReady.shop.deliveryOrders = 1;
  upgradeReady.shop.tofuStock = 30;
  const businessBefore = context.tofuBusinessValue(upgradeReady);
  const bought = context.buyStationUpgrade('prep_counter_faster', upgradeReady);
  assert.strictEqual(bought.ok, true);
  assert(bought.gameState.shop.tips < upgradeReady.shop.tips);
  assert(context.tofuBusinessValue(bought.gameState) > businessBefore);

  const revealed = JSON.parse(JSON.stringify(bought.gameState));
  revealed.shop.coveredCarTeaserUnlocked = true;
  assert.strictEqual(context.shouldShowNetWorthV1(revealed), true);
  const netWorthHtml = context.renderNetWorthCard(revealed);
  assert(netWorthHtml.includes('Net Worth'));
  assert(netWorthHtml.includes('toward $1T'));
  assert(netWorthHtml.includes('Cash + Tofu Business Value'));
  assert(netWorthHtml.includes('Cash can be spent now or invested into assets'));
  assert(!netWorthHtml.includes('shares'));

  vm.runInContext(`
function makeNode() {
  const node = { textContent: "", innerHTML: "", disabled: null, dataset: {}, classListValue: null, value: "" };
  node.classList = { toggle() {} };
  node.querySelector = () => null;
  return node;
}
elements = {
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopReach: makeNode(),
  shopSpirit: makeNode(),
  shopLicenseStars: makeNode(),
  shopBuyMultiplier: makeNode(),
  packTofuButton: makeNode(),
  fulfillShopOrderButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopInlineResult: makeNode(),
  shopOfflineEarnings: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.shopTab = "overview";
renderTofuShop(${JSON.stringify(fresh)});
globalThis.cashFreshCounter = elements.shopTips.textContent;
globalThis.cashFreshOverview = elements.shopTabPanel.innerHTML;
renderTofuShop(${JSON.stringify(revealed)});
globalThis.cashRevealedCounter = elements.shopTips.textContent;
globalThis.cashRevealedOverview = elements.shopTabPanel.innerHTML;
`, context);
  assert.strictEqual(context.cashFreshCounter, '$0');
  assert(!context.cashFreshOverview.includes('Net Worth'));
  assert(context.cashRevealedCounter.startsWith('$'));
  assert(context.cashRevealedOverview.includes('Net Worth'));
  assert(context.cashRevealedOverview.includes('Cash + Tofu Business Value'));
  assert(!context.cashRevealedOverview.includes('Tips buy upgrades'));
  assert(!context.cashRevealedOverview.includes('Tips/min'));
}

function testNextBestActionHierarchyStaysSinglePrimary() {
  const context = loadNoSpillContext({
    window: { location: { search: '?simulator=1' }, localStorage: makeLocalStorage() },
  });
  const first = context.defaultGameState();
  const firstAction = context.nextBestAction(first, { date: new Date('2026-06-14T12:00:00.000Z') });
  assert.strictEqual(firstAction.type, 'watch_starter_shop');
  assert.strictEqual(firstAction.title, 'Next: Watch the first order complete');
  assert.strictEqual(firstAction.buttonLabel, 'View Counter Service');

  const startedShop = context.packTofu(first, { activeDrive: false }).gameState;
  const packAction = context.nextBestAction(startedShop, {
    date: new Date('2026-06-14T12:00:00.000Z'),
  });
  assert.strictEqual(packAction.type, 'watch_starter_shop');

  const incompleteDaily = context.applySimulatedDelivery(
    'shaky_practice',
    first,
    { now: new Date('2026-06-14T12:00:00.000Z') },
  ).gameState;
  const incompleteAction = context.nextBestAction(incompleteDaily, {
    date: new Date('2026-06-14T12:00:00.000Z'),
  });
  assert(['watch_starter_shop', 'wait_counter_service', 'buy_upgrade', 'buy_station', 'cup_test'].includes(incompleteAction.type));

  const completeDaily = context.applySimulatedDelivery(
    'smooth_commute',
    first,
    { now: new Date('2026-06-14T12:00:00.000Z') },
  ).gameState;
  const fulfillReady = JSON.parse(JSON.stringify(completeDaily));
  fulfillReady.shop.deliveryOrders = 2;
  const fulfillAction = context.nextBestAction(fulfillReady, {
    date: new Date('2026-06-14T12:00:00.000Z'),
  });
  assert.strictEqual(fulfillAction.type, 'watch_starter_shop');
  assert.strictEqual(fulfillAction.title, 'Next: Watch the first order complete');
  assert.strictEqual(fulfillAction.buttonLabel, 'View Counter Service');

  const funded = JSON.parse(JSON.stringify(completeDaily));
  funded.shop.tips = 100;
  funded.shop.tofuStock = 6;
  funded.shop.deliveryOrders = 0;
  funded.shop.prepSlots = 0;
  funded.shop.lifetimeTofuPacked = 1;
  funded.shop.lifetimeDeliveryOrders = 1;
  funded.stamps.first_shop_order = { date: '2026-06-14T12:00:00.000Z', label: 'First Shop Order' };
  const upgradeAction = context.nextBestAction(funded, {
    date: new Date('2026-06-14T12:00:00.000Z'),
  });
  assert.strictEqual(upgradeAction.type, 'buy_station');
  assert.strictEqual(upgradeAction.stationId, 'tofu_press');
  assert.strictEqual(upgradeAction.title, 'Next: Buy Tofu Press');

  const activeAction = context.nextBestAction(funded, {
    activeDrive: true,
    date: new Date('2026-06-14T12:00:00.000Z'),
  });
  assert.strictEqual(activeAction.type, 'active_drive');
  assert.strictEqual(activeAction.disabled, true);

  vm.runInContext(`
function makeNode() {
  return { textContent: "", innerHTML: "", disabled: null, dataset: {} };
}
elements = {
  gameDailyTitle: makeNode(),
  gameDailyFlavor: makeNode(),
  gameDailyCargo: makeNode(),
  gameDailyGoal: makeNode(),
  gameDailyReward: makeNode(),
  gameNextActionTitle: makeNode(),
  gameNextActionCopy: makeNode(),
  gameCtaButton: makeNode(),
  gameCertifiedCtaButton: makeNode(),
  gameDailyProgress: makeNode(),
  gameDriverLicense: makeNode(),
  gameTotalXP: makeNode(),
  gameStreak: makeNode(),
  gameGearProgress: makeNode(),
  gameShopStock: makeNode(),
  gameShopReputation: makeNode(),
  gameShopLevel: makeNode(),
  gameShopTeaser: makeNode(),
  gameShopHelper: makeNode(),
  gamePassportEmpty: makeNode(),
  gamePassportPreview: makeNode(),
  gamePackTofuButton: makeNode(),
};
appState.running = false;
appState.calibrating = false;
renderGameDashboard(defaultGameState());
globalThis.topActionTitle = elements.gameNextActionTitle.textContent;
globalThis.topActionButton = elements.gameCtaButton.textContent;
globalThis.topActionType = elements.gameCtaButton.dataset.nextAction;
`, context);
  assert.strictEqual(context.topActionTitle, 'Next: Watch the first order complete');
  assert.strictEqual(context.topActionButton, 'View Counter Service');
  assert.strictEqual(context.topActionType, 'watch_starter_shop');

  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  const actionStart = html.indexOf('class="nospill-next-action-card"');
  const actionArea = html.slice(
    actionStart,
    html.indexOf('<div class="nospill-game-grid nospill-game-status-grid"', actionStart),
  );
  assert.strictEqual((actionArea.match(/nospill-primary/g) || []).length, 1);
  assert(!actionArea.includes('game-pack-tofu-button'));
  assert(actionArea.includes('game-certified-cta-button'));
}

function testTofuDriverArtworkIsIsolatedAndAccessible() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  const logoPath = path.join(NOSPILL_IMAGES_DIR, 'tofu-driver-logo.png');
  const shirtPath = path.join(NOSPILL_IMAGES_DIR, 'tofu-driver-shirt-1.png');
  const appImagePath = path.join(NOSPILL_IMAGES_DIR, 'tofu-driver-app-image.png');

  assert(fs.existsSync(logoPath), 'Tofu Driver logo asset should exist');
  assert(fs.existsSync(shirtPath), 'No-Spill Club shirt preview asset should exist');
  assert(fs.existsSync(appImagePath), 'Tofu Driver cargo mascot app image should exist');
  assert(html.includes('/static/nospill/images/tofu-driver-logo.png'));
  assert(html.includes('/static/nospill/images/tofu-driver-shirt-1.png'));
  assert(!html.includes('Tofu Driver mascot logo'));
  assert(html.includes('class="nospill-hero-fallback" hidden>Tofu Driver</span>'));
  const css = fs.readFileSync(path.join(NOSPILL_DIR, 'app.css'), 'utf8');
  assert(css.includes('.nospill-hero-fallback[hidden]'));
  assert(css.includes('display: none;'));
  assert(html.includes('alt="No-Spill Club 95% Delivered Tofu Driver shirt"'));
}

function testSuperCuteCollectiblesLandingAndMerchCopy() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(html.includes('Super Cute Collectibles'));
  assert(html.includes('Secret shirts and drops are fulfilled through Super Cute Collectibles.'));
  assert(html.includes('Physical merch is fulfilled by Super Cute Collectibles.'));
  assert(html.includes('Visit Super Cute Collectibles'));
  assert(html.includes('href="https://supercutecollectibles.com/"'));
  assert(html.includes('target="_blank"'));
  assert(html.includes('rel="noopener noreferrer"'));
  assert(!html.includes('Official driving verifier'));
  assert(!html.includes('Certified by Super Cute Collectibles'));
}

function testDiscordCtaConfigAndRendering() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(html.includes('id="landing-discord-cta"'));
  assert(html.includes('id="summary-discord-cta"'));
  assert(!html.includes('Join Discord'));
  assert(!html.includes('https://discord.gg/zckcWD9bmq'));

  const runViewHtml = html.slice(
    html.indexOf('id="run-view"'),
    html.indexOf('id="unsupported-view"'),
  );
  assert(!runViewHtml.includes('Discord'));

  const context = loadNoSpillContext();
  assert.strictEqual(context.DISCORD_CONFIG.enabled, false);
  assert.strictEqual(context.DISCORD_CONFIG.inviteUrl, null);
  const defaultConfig = context.normalizedDiscordConfig(context.DISCORD_CONFIG);
  assert.strictEqual(defaultConfig.enabled, false);
  assert.strictEqual(defaultConfig.inviteUrl, null);

  vm.runInContext(`
function makeNode() {
  const node = {
    innerHTML: "",
    hidden: null,
    classList: {
      toggle(_className, hidden) {
        node.hidden = Boolean(hidden);
      },
    },
  };
  return node;
}
elements = {
  landingDiscordCta: makeNode(),
  summaryDiscordCta: makeNode(),
};
renderDiscordCtas("landing");
globalThis.defaultLandingDiscordHtml = elements.landingDiscordCta.innerHTML;
globalThis.defaultLandingDiscordHidden = elements.landingDiscordCta.hidden;
DISCORD_CONFIG.enabled = true;
DISCORD_CONFIG.inviteUrl = "https://discord.gg/zckcWD9bmq";
appState.running = false;
appState.calibrating = false;
renderDiscordCtas("landing");
globalThis.enabledLandingDiscordHtml = elements.landingDiscordCta.innerHTML;
globalThis.enabledLandingDiscordHidden = elements.landingDiscordCta.hidden;
appState.running = true;
renderDiscordCtas("run");
globalThis.activeLandingDiscordHtml = elements.landingDiscordCta.innerHTML;
globalThis.activeSummaryDiscordHtml = elements.summaryDiscordCta.innerHTML;
globalThis.activeLandingDiscordHidden = elements.landingDiscordCta.hidden;
appState.running = false;
renderDiscordCtas("summary");
globalThis.enabledSummaryDiscordHtml = elements.summaryDiscordCta.innerHTML;
`, context);

  assert.strictEqual(context.defaultLandingDiscordHtml, '');
  assert.strictEqual(context.defaultLandingDiscordHidden, true);
  assert(context.enabledLandingDiscordHtml.includes('Join the Delivery Crew'));
  assert(context.enabledLandingDiscordHtml.includes('Share delivery cards, suggest features, and follow secret merch drops.'));
  assert(context.enabledLandingDiscordHtml.includes('Join Discord'));
  assert(context.enabledLandingDiscordHtml.includes('href="https://discord.gg/zckcWD9bmq"'));
  assert(context.enabledLandingDiscordHtml.includes('target="_blank"'));
  assert(context.enabledLandingDiscordHtml.includes('rel="noopener noreferrer"'));
  assert.strictEqual(context.enabledLandingDiscordHidden, false);
  assert.strictEqual(context.activeLandingDiscordHtml, '');
  assert.strictEqual(context.activeSummaryDiscordHtml, '');
  assert.strictEqual(context.activeLandingDiscordHidden, true);
  assert(context.enabledSummaryDiscordHtml.includes('Want to share your run or suggest the next cargo?'));
  assert(context.enabledSummaryDiscordHtml.includes('Join the Delivery Crew'));
  assert(!/Report bad drivers|Call out drivers|Submit license plates|Upload incidents|Shame reckless drivers|Street racing community|Canyon leaderboard/i.test(context.enabledLandingDiscordHtml));
}

function testNoSpillClientDoesNotUploadRawRunData() {
  for (const filePath of [NOSPILL_HTML, NOSPILL_JS]) {
    const source = fs.readFileSync(filePath, 'utf8');
    assert(!/\bfetch\s*\(/.test(source));
    assert(!source.includes('XMLHttpRequest'));
    assert(!source.includes('sendBeacon'));
    assert(!source.includes('serviceWorker'));
    assert(!source.includes('/summary/'));
    assert(!source.includes('/catalog/'));
    assert(!source.includes('/card/'));
    assert(!source.includes('cavrino.com/nospill'));
  }
}

function testPostHogAnalyticsNoOpsWithoutConfigAndHonorsOptOut() {
  const disabled = makeAnalyticsContext({ posthogEnabled: false, posthogKey: 'ph_public' });
  assert.strictEqual(disabled.initAnalytics(), false);
  assert.strictEqual(disabled.analyticsInitCalls.length, 0);
  assert.strictEqual(disabled.trackEvent('tofu_driver_page_view', { view: 'shop' }), false);
  assert.strictEqual(disabled.analyticsCaptures.length, 0);

  const missingKey = makeAnalyticsContext({ posthogEnabled: true, posthogKey: '' });
  assert.strictEqual(missingKey.initAnalytics(), false);
  assert.strictEqual(missingKey.analyticsInitCalls.length, 0);
  assert.strictEqual(missingKey.analyticsCaptures.length, 0);

  const optedOut = makeAnalyticsContext(
    { posthogEnabled: true, posthogKey: 'ph_public_tofu' },
    { tofuDriverAnalyticsOptOut: 'true' },
  );
  assert.strictEqual(optedOut.initAnalytics(), false);
  assert.strictEqual(optedOut.trackEvent('tofu_driver_page_view', { view: 'shop' }), false);
  assert.strictEqual(optedOut.analyticsCaptures.length, 0);
  optedOut.setAnalyticsOptOut(false);
  assert.strictEqual(optedOut.analyticsWindow.localStorage.getItem('tofuDriverAnalyticsOptOut'), null);
  assert.strictEqual(optedOut.analyticsWindow.optedIn, true);
  optedOut.setAnalyticsOptOut(true);
  assert.strictEqual(optedOut.analyticsWindow.localStorage.getItem('tofuDriverAnalyticsOptOut'), 'true');
  assert.strictEqual(optedOut.analyticsWindow.optedOut, true);
}

function testPostHogAnalyticsInitializesWithPrivacyOptions() {
  const context = makeAnalyticsContext({
    posthogEnabled: true,
    posthogKey: 'ph_public_tofu',
    posthogHost: 'https://eu.i.posthog.com',
  });
  assert.strictEqual(context.initAnalytics(), true);
  assert.strictEqual(context.analyticsInitCalls.length, 1);
  assert.strictEqual(context.analyticsInitCalls[0].key, 'ph_public_tofu');
  assert.strictEqual(context.analyticsInitCalls[0].options.api_host, 'https://eu.i.posthog.com');
  assert.strictEqual(context.analyticsInitCalls[0].options.capture_pageview, false);
  assert.strictEqual(context.analyticsInitCalls[0].options.autocapture, false);
  assert.strictEqual(context.analyticsInitCalls[0].options.disable_session_recording, true);
  assert.strictEqual(context.analyticsInitCalls[0].options.disable_surveys, true);
}

function testAnalyticsSanitizerDropsDangerousKeysAndCampaignsAreSafe() {
  const context = makeAnalyticsContext({ posthogEnabled: true, posthogKey: 'ph_public_tofu' });
  const sanitized = context.sanitizeAnalyticsProperties({
    view: 'shop',
    gps: 'raw',
    lat: 47.6,
    latitude: 47.6,
    lng: -122.3,
    longitude: -122.3,
    coordinates: 'x',
    routeTrace: 'trace',
    street: 'Main',
    address: 'home',
    speed: 72,
    averageSpeed: 55,
    topSpeed: 100,
    rawMotion: 'motion',
    motion: 'motion',
    acceleration: 'vector',
    gForce: 1.2,
    deviceMotion: 'event',
    sensor: 'diag',
    localStorage: '{}',
    saveFile: '{}',
    exactDistance: 12.4,
    distanceMiles: 12.4,
    ok_number: 12,
    ok_bool: true,
  });
  assert.deepStrictEqual(Object.keys(sanitized).sort(), ['ok_bool', 'ok_number', 'view']);
  const campaign = context.safeCampaignProperties('?td_source=sticker!!!&td_campaign=anime_con_2026&utm_content=front-window');
  assert.deepStrictEqual(JSON.parse(JSON.stringify(campaign)), {
    utm_content: 'front-window',
    td_source: 'sticker',
    td_campaign: 'anime_con_2026',
  });
}

function testAnalyticsRouteCupShopAndShareEventsUseSafeProperties() {
  const context = makeAnalyticsContext({ posthogEnabled: true, posthogKey: 'ph_public_tofu' });
  assert.strictEqual(context.initAnalytics(), true);
  context.trackRouteView('cup-test');
  context.trackRouteView('shop');
  assert(context.analyticsCaptures.some((capture) => capture.event === 'tofu_driver_page_view' && capture.properties.view === 'cup_test'));
  assert(context.analyticsCaptures.some((capture) => capture.event === 'tofu_driver_cup_test_viewed'));
  assert(context.analyticsCaptures.some((capture) => capture.event === 'tofu_driver_page_view' && capture.properties.view === 'shop'));
  assert(context.analyticsCaptures.some((capture) => capture.event === 'tofu_driver_shop_viewed'));
  const firstPage = context.analyticsCaptures.find((capture) => capture.event === 'tofu_driver_page_view');
  assert.strictEqual(firstPage.properties.td_source, 'sticker');
  assert.strictEqual(firstPage.properties.td_campaign, 'anime_con_2026');

  context.trackCupTestStartedAnalytics({ mode: 'basic', simulator: false });
  const cupStart = context.analyticsCaptures.find((capture) => capture.event === 'tofu_driver_cup_test_started');
  assert.deepStrictEqual(JSON.parse(JSON.stringify(cupStart.properties)), { mode: 'basic', simulator: false });

  const summary = sampleDeliverySession({
    mode: 'qualified',
    waterLeft: 92,
    qualificationStatus: 'qualified',
    qualificationLabel: 'Qualified',
    simulated: false,
  });
  summary.cargoCondition = 92;
  summary.deliveryRewards = {
    shop: { certifiedBoost: { applied: true } },
  };
  context.trackCupTestCompletedAnalytics(summary);
  const cupCompleted = context.analyticsCaptures.find((capture) => capture.event === 'tofu_driver_cup_test_completed');
  assert.strictEqual(cupCompleted.properties.mode, 'qualified');
  assert.strictEqual(cupCompleted.properties.cargo_condition_bucket, '80_94');
  assert.strictEqual(cupCompleted.properties.certified_boost_earned, true);
  assert(!('distanceMiles' in cupCompleted.properties));
  assert(!('speed' in cupCompleted.properties));
  assert(!('motion' in cupCompleted.properties));

  const state = context.defaultGameState();
  const result = context.fulfillShopOrders(state, 1, { orderTypeId: 'simple_tofu_box' });
  assert.strictEqual(result.ok, true);
  context.trackShopOrderFulfilledAnalytics(result);
  const shopEvent = context.analyticsCaptures.find((capture) => capture.event === 'tofu_driver_shop_order_fulfilled');
  assert.strictEqual(shopEvent.properties.order_type, 'simple_tofu_box');
  assert.strictEqual(shopEvent.properties.shop_level, 1);
  assert.strictEqual(shopEvent.properties.first_order, true);
  assert('tips_bucket' in shopEvent.properties);
  assert(!('tips' in shopEvent.properties));
  assert(!('tofuStock' in shopEvent.properties));

  context.trackShareAnalytics('tofu_driver_share_clicked', summary, { share_type: 'web_share' });
  const shareEvent = context.analyticsCaptures.find((capture) => capture.event === 'tofu_driver_share_clicked');
  assert.strictEqual(shareEvent.properties.share_type, 'web_share');
  assert.strictEqual(shareEvent.properties.result_type, 'qualified');
  assert(!('text' in shareEvent.properties));
}

function testNoSpillLiveSummaryAndShareAvoidSensitiveDetails() {
  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(!source.includes('Location denied. This run'));
  assert(!source.includes('Location is unavailable. This run'));
  assert(!source.includes('Location could not start.'));
  assert(!source.includes('Location signal is unavailable.'));
  assert(!source.includes('Location permission was denied.'));
  assert(!source.includes('Location was unavailable.'));
  assert(!source.includes('GPS Quality'));
  assert(!source.includes('No raw GPS or sensor stream was saved.'));
  assert(source.includes('summaryMetric("Signal Quality"'));

  const context = loadNoSpillContext();
  const shareText = context.buildShareText(sampleShareSummary());
  assert(!/speed|mph|gps|map|street|trace|location|lat|lon/i.test(shareText));
  assert(!/\b(?:mi|miles?|km|kilometers?)\b/i.test(shareText));
  assert(!shareText.includes('4.2'));
  assert(!shareText.includes('cavrino.com/nospill'));
  assert(!shareText.includes('Super Cute Collectibles'));
  assert(!shareText.includes('supercutecollectibles.com'));
  assert(!shareText.includes('discord.gg'));
}

function testShareConfigAndCardData() {
  const context = loadNoSpillContext();
  assert.strictEqual(context.SHARE_CONFIG.includeAppLink, false);
  assert.strictEqual(context.SHARE_CONFIG.appUrl, null);
  assert.strictEqual(context.SHARE_CONFIG.includeDistanceInShare, false);

  const summary = sampleShareSummary();
  const defaultText = context.buildShareText(summary);
  assert(defaultText.includes('Tofu Driver: Delivery Complete.'));
  assert(defaultText.includes('Cargo: Soft Tofu'));
  assert(defaultText.includes('Cargo Condition: 97.4%'));
  assert(defaultText.includes('Trip Time: 28:14'));
  assert(defaultText.includes('Drive Shape: Winding Pour'));
  assert(defaultText.includes('Stamp: Technical Pour'));
  assert(defaultText.includes('Rank: No-Spill Club'));
  assert(defaultText.includes('Not faster. Smoother.'));
  assert(!defaultText.includes('No-Spill Club: I delivered'));
  assert(!/route trace/i.test(defaultText));
  assert(!defaultText.includes('4.2'));
  assert(!defaultText.includes('4.2 mi'));
  assert(!/\b(?:mi|miles?|km|kilometers?)\b/i.test(defaultText));
  assert(!defaultText.includes('cavrino.com/nospill'));
  assert(!defaultText.includes('Super Cute Collectibles'));
  assert(!defaultText.includes('supercutecollectibles.com'));
  assert(!defaultText.includes('discord.gg'));

  const clubText = context.buildShareText(sampleShareSummary({
    unlockedBadges: ['nospill_club'],
    deliveryStamps: ['nospill_club'],
  }));
  assert(clubText.includes('Tofu Driver: Delivery Complete.'));
  assert(clubText.includes('Stamp: No-Spill Club'));
  assert(clubText.includes('Rank: No-Spill Club'));

  const configuredText = context.buildShareText(summary, {
    includeAppLink: true,
    appUrl: 'https://example.test/nospill',
  });
  assert(configuredText.endsWith('https://example.test/nospill'));

  const disabledText = context.buildShareText(summary, {
    includeAppLink: false,
    appUrl: 'https://example.test/nospill',
  });
  assert(!disabledText.includes('https://example.test/nospill'));

  const missingLinkText = context.buildShareText(summary, {
    includeAppLink: true,
    appUrl: null,
  });
  assert(!missingLinkText.includes('null'));

  const cardData = context.buildShareCardData(summary);
  assert(!JSON.stringify(cardData).includes('discord.gg'));
  assert.strictEqual(cardData.title, 'Tofu Driver');
  assert.strictEqual(cardData.challengeName, 'Delivery Complete');
  assert.strictEqual(cardData.waterDelivered, '97.4%');
  assert.strictEqual(cardData.waterSpilled, '2.6%');
  assert.strictEqual(cardData.rank, 'No-Spill Club');
  assert.strictEqual(cardData.qualificationStatus, 'Qualified');
  assert.strictEqual(cardData.cargoLabel, 'Soft Tofu');
  assert.strictEqual(cardData.tripTime, '28:14');
  assert.strictEqual(cardData.driveShape, 'Winding Pour');
  assert.strictEqual(cardData.distanceLabel, '');
  assert.strictEqual(cardData.milestone, 'Technical Pour');
  assert.strictEqual(cardData.dailyStatus, 'Daily Delivery Complete');

  const rewardState = context.defaultGameState();
  rewardState.totalXP = 900;
  rewardState.level = 6;
  const licensedText = context.buildShareText({
    ...summary,
    deliveryRewards: { gameState: { ...rewardState, level: 6 } },
  });
  assert(licensedText.includes('Driver License: Level 6'));
  assert(licensedText.includes('Shop Level 1'));
  assert(!licensedText.includes('click'));
  assert(!licensedText.includes('idle'));

  const distanceText = context.buildShareText(summary, {
    includeDistanceInShare: true,
  });
  assert(!distanceText.includes('Distance:'));
  assert(!distanceText.includes('4.2'));
  assert(!/speed|mph|gps|map|street|trace|location|lat|lon/i.test(distanceText));

  const distanceCardData = context.buildShareCardData(summary, {
    includeDistanceInShare: true,
  });
  assert.strictEqual(distanceCardData.distanceLabel, '');
}

function testLockedMerchLinksAreNotShownBeforeUnlock() {
  const context = loadNoSpillContext();
  context.MERCH_LINKS.nospill_club = 'https://supercutecollectibles.com/products/nospill-club';
  vm.runInContext(`
elements = { merchGrid: { innerHTML: "" } };
renderMerchPanel({ unlockedMilestones: {} });
globalThis.lockedMerchHtml = elements.merchGrid.innerHTML;
renderMerchPanel({ unlockedMilestones: { nospill_club: "2026-06-14T00:00:00.000Z" } });
globalThis.unlockedMerchHtml = elements.merchGrid.innerHTML;
`, context);

  assert(context.lockedMerchHtml.includes('<strong>Locked</strong>'));
  assert(!context.lockedMerchHtml.includes('https://supercutecollectibles.com/products/nospill-club'));
  assert(!context.lockedMerchHtml.includes('Buy unlocked shirt'));
  assert(context.unlockedMerchHtml.includes('https://supercutecollectibles.com/products/nospill-club'));
  assert(context.unlockedMerchHtml.includes('target="_blank" rel="noopener noreferrer"'));
  assert(context.unlockedMerchHtml.includes('Buy unlocked shirt'));
}

function testDailyDeliverySelectionAndEvaluation() {
  const context = loadNoSpillContext();
  const profileNames = context.CARGO_PROFILES.map((profile) => profile.name);
  [
    'Silken Tofu',
    'Hot Tea',
    'Soup Bowl',
    'Egg Carton',
    'Glass Bottle',
    'Wedding Cake',
  ].forEach((name) => assert(profileNames.includes(name), `${name} cargo profile missing`));
  context.CARGO_PROFILES.forEach((profile) => {
    assert(profile.description);
    assert(profile.scoringEmphasis);
    assert(profile.suggestedStamp);
    assert(!/speed|fast|twisty|canyon|touge/i.test(`${profile.goal} ${profile.reward}`));
  });
  const first = context.getDailyDelivery('2026-06-14');
  const second = context.getDailyDelivery('2026-06-14T23:59:00');
  assert.deepStrictEqual(first, second);
  assert(first.cargo);
  assert(first.goal);

  const silken = { id: 'silken_tofu' };
  assert.strictEqual(context.evaluateDailyDelivery(silken, sampleDeliverySession({
    waterLeft: 86,
    routeType: 'Practice Route',
  })), true);
  assert.strictEqual(context.evaluateDailyDelivery(silken, sampleDeliverySession({
    waterLeft: 84.9,
    routeType: 'Practice Route',
  })), false);
  assert.strictEqual(context.evaluateCargoMission({ id: 'soup_bowl' }, sampleDeliverySession({
    waterLeft: 90,
    harshBraking: 0,
    harshAcceleration: 0,
  })), true);
  assert.strictEqual(context.evaluateCargoMission({ id: 'soup_bowl' }, sampleDeliverySession({
    waterLeft: 90,
    harshBraking: 2,
    harshAcceleration: 0,
  })), false);
}

function testRouteTypeClassification() {
  const context = loadNoSpillContext();
  assert.strictEqual(context.classifyRouteType(sampleDeliverySession({
    mode: 'basic',
    qualificationStatus: 'practice',
  })), 'Practice Route');
  assert.strictEqual(context.classifyRouteType(sampleDeliverySession({
    turnDensityScore: 0.05,
    curvatureScore: 0.05,
    routeDifficultyScore: 0.1,
    harshBraking: 0,
    harshAcceleration: 0,
    abruptTransitions: 0,
  })), 'Calm Cruise');
  assert.strictEqual(context.classifyRouteType(sampleDeliverySession({
    turnDensityScore: 0.05,
    curvatureScore: 0.05,
    routeDifficultyScore: 0.1,
    harshBraking: 2,
    harshAcceleration: 2,
  })), 'City Delivery');
  assert.strictEqual(context.classifyRouteType(sampleDeliverySession({
    turnDensityScore: 0.4,
    curvatureScore: 0.2,
    routeDifficultyScore: 0.45,
  })), 'Mixed Route');
  assert.strictEqual(context.classifyRouteType(sampleDeliverySession({
    turnDensityScore: 0.7,
    curvatureScore: 0.2,
    routeDifficultyScore: 0.7,
  })), 'Technical Route');
  assert.strictEqual(context.classifyRouteType(sampleDeliverySession({
    durationSeconds: 1800,
    distanceMiles: 16,
    turnDensityScore: 0.1,
    curvatureScore: 0.1,
    routeDifficultyScore: 0.25,
  })), 'Long Haul');
}

function testDeliveryRewardsDoNotUseSpeedAndRespectMajorUnlockContext() {
  const context = loadNoSpillContext();
  const state = context.defaultGameState();
  const slow = context.calculateDeliveryRewards(sampleDeliverySession({
    averageMovingSpeedMph: 15,
    medianMovingSpeedMph: 14,
    waterLeft: 96,
    turnDensityScore: 0.05,
    curvatureScore: 0.05,
    routeDifficultyScore: 0.1,
  }), state);
  const fast = context.calculateDeliveryRewards(sampleDeliverySession({
    averageMovingSpeedMph: 75,
    medianMovingSpeedMph: 74,
    waterLeft: 96,
    turnDensityScore: 0.05,
    curvatureScore: 0.05,
    routeDifficultyScore: 0.1,
  }), state);
  assert.strictEqual(slow.xpGained, fast.xpGained);
  assert.deepStrictEqual(slow.stamps, fast.stamps);
  assert.deepStrictEqual(slow.merchProgress, fast.merchProgress);

  const practice = context.calculateDeliveryRewards(sampleDeliverySession({
    mode: 'basic',
    qualificationStatus: 'practice',
    waterLeft: 100,
    durationSeconds: 120,
    distanceMiles: 0,
    turnDensityScore: 0,
    curvatureScore: 0,
    routeDifficultyScore: 0,
  }), state);
  assert.strictEqual(practice.routeType, 'Practice Route');
  assert.strictEqual(practice.merchProgress.nospillClubGear.count, 0);
  assert.strictEqual(practice.merchProgress.perfectPourDrop.unlocked, false);
  assert(!practice.stamps.includes('technical_pour'));

  const technical = context.calculateDeliveryRewards(sampleDeliverySession({
    waterLeft: 92,
    turnDensityScore: 0.72,
    curvatureScore: 0.68,
    routeDifficultyScore: 0.74,
  }), state);
  assert.strictEqual(technical.routeType, 'Technical Route');
  assert(technical.stamps.includes('technical_pour'));
}

function testPracticeModeRewardGatingAndRankCopy() {
  const context = loadNoSpillContext();
  const state = context.defaultGameState();
  const shortPractice = sampleDeliverySession({
    mode: 'basic',
    qualificationStatus: 'practice',
    qualificationLabel: 'Short Practice',
    waterLeft: 100,
    durationSeconds: 0,
    distanceMiles: 0,
    motionSamples: 0,
    harshInputCount: 0,
    harshBraking: 0,
    harshAcceleration: 0,
    harshLateral: 0,
    lateralJerk: 0,
    abruptTransitions: 0,
    turnDensityScore: 0,
    curvatureScore: 0,
    routeDifficultyScore: 0,
  });
  const shortRewards = context.calculateDeliveryRewards(shortPractice, state);
  assert.strictEqual(context.classifyRouteType(shortPractice), 'Practice Route');
  assert.strictEqual(context.displayRankForSession(shortPractice), 'Perfect Practice');
  assert.strictEqual(shortRewards.dailyComplete, false);
  assert.strictEqual(shortRewards.stamps.length, 0);
  assert.strictEqual(shortRewards.shop.tofuStockGained, 0);
  assert.strictEqual(shortRewards.shop.reputationGained, 0);
  assert.strictEqual(shortRewards.merchProgress.nospillClubGear.count, 0);
  assert.strictEqual(shortRewards.merchProgress.perfectPourDrop.unlocked, false);
  assert.strictEqual(shortRewards.merchProgress.deliveryCrew.count, 0);
  assert.strictEqual(shortRewards.collectionUnlocks.newCharacterUnlocks.length, 0);
  assert.strictEqual(shortRewards.collectionUnlocks.newSoundUnlocks.length, 0);

  const validPractice = sampleDeliverySession({
    mode: 'basic',
    qualificationStatus: 'practice',
    qualificationLabel: 'Practice Only',
    waterLeft: 100,
    durationSeconds: 120,
    distanceMiles: 0,
    motionSamples: 300,
    harshInputCount: 0,
    harshBraking: 0,
    harshAcceleration: 0,
    harshLateral: 0,
    lateralJerk: 0,
    abruptTransitions: 0,
    turnDensityScore: 0,
    curvatureScore: 0,
    routeDifficultyScore: 0,
  });
  const validRewards = context.calculateDeliveryRewards(validPractice, state);
  assert.strictEqual(validRewards.stamps.length, 1);
  assert.strictEqual(validRewards.stamps[0], 'first_delivery');
  assert.strictEqual(validRewards.dailyComplete, false);
  assert(validRewards.shop.tofuStockGained > 0);
  assert.strictEqual(validRewards.shop.reputationGained, 0);
  assert(!validRewards.stamps.includes('cup_stayed_full'));
  assert(!validRewards.stamps.includes('no_panic_inputs'));
  assert(!validRewards.stamps.includes('passenger_approved'));
  assert(!validRewards.stamps.includes('perfect_pour'));
  assert.strictEqual(validRewards.collectionUnlocks.newCharacterUnlocks.length, 1);
  assert.strictEqual(validRewards.collectionUnlocks.newCharacterUnlocks[0].id, 'angry_tofu_driver');

  const qualifiedPerfect = context.calculateDeliveryRewards(sampleDeliverySession({
    waterLeft: 100,
    durationSeconds: 900,
    distanceMiles: 5,
  }), state);
  assert.strictEqual(context.displayRankForSession(sampleDeliverySession({ waterLeft: 100 })), 'Perfect Pour');
  assert(qualifiedPerfect.stamps.includes('perfect_pour'));
  assert.strictEqual(qualifiedPerfect.merchProgress.perfectPourDrop.unlocked, true);
}

function testPracticeShareOutputIsLabeledAndNotPerfectPour() {
  const context = loadNoSpillContext();
  const practiceSummary = sampleShareSummary({
    mode: 'basic',
    qualificationStatus: 'practice',
    qualificationLabel: 'Practice Only',
    routeType: 'Practice Route',
    rank: 'Perfect Pour',
    cargoCondition: 100,
    waterLeft: 100,
    waterSpilled: 0,
    deliveryStamps: [],
    unlockedBadges: [],
    dailyDeliveryComplete: false,
  });
  const text = context.buildShareText(practiceSummary);
  const card = context.buildShareCardData(practiceSummary);
  assert(text.includes('Practice Delivery'));
  assert(text.includes('Rank: Perfect Practice'));
  assert(!text.includes('Perfect Pour'));
  assert.strictEqual(card.challengeName, 'Practice Delivery');
  assert.strictEqual(card.rank, 'Perfect Practice');
  assert.strictEqual(card.qualificationStatus, 'Practice');
}

function testLongHaulDailyXpCapAndMerchProgress() {
  const context = loadNoSpillContext();
  let state = context.defaultGameState();
  const commute = sampleDeliverySession({
    date: '2026-06-14T12:00:00.000Z',
    waterLeft: 96,
    durationSeconds: 1800,
    distanceMiles: 16,
    turnDensityScore: 0.1,
    curvatureScore: 0.1,
    routeDifficultyScore: 0.25,
  });
  const first = context.calculateDeliveryRewards(commute, state);
  state = first.gameState;
  const second = context.calculateDeliveryRewards({
    ...commute,
    date: '2026-06-14T15:00:00.000Z',
  }, state);
  state = second.gameState;
  const third = context.calculateDeliveryRewards({
    ...commute,
    date: '2026-06-14T18:00:00.000Z',
  }, state);
  assert.strictEqual(first.routeType, 'Long Haul');
  assert(first.stamps.includes('long_haul_pour'));
  assert(first.stamps.includes('smooth_commute'));
  assert.strictEqual(first.xpMultiplier, 1);
  assert.strictEqual(second.xpMultiplier, 1);
  assert.strictEqual(third.xpMultiplier, 0.35);
  assert(third.xpGained < second.xpGained);
}

function testNoSpillClubGearRequiresRepeatedQualifiedDeliveries() {
  const context = loadNoSpillContext();
  let state = context.defaultGameState();
  ['2026-06-14', '2026-06-15', '2026-06-16'].forEach((dateKey, index) => {
    const result = context.calculateDeliveryRewards(sampleDeliverySession({
      date: `${dateKey}T12:00:00.000Z`,
      waterLeft: 96 + index,
      durationSeconds: 900,
      distanceMiles: 6,
      turnDensityScore: 0.35,
      curvatureScore: 0.35,
      routeDifficultyScore: 0.45,
    }), state);
    state = result.gameState;
  });
  assert.strictEqual(state.merchProgress.nospillClubGear.count, 3);
  assert.strictEqual(state.merchProgress.nospillClubGear.unlocked, true);
}

function testPerfectPourAndDeliveryCrewProgressRules() {
  const context = loadNoSpillContext();
  let state = context.defaultGameState();
  const perfect = context.calculateDeliveryRewards(sampleDeliverySession({
    waterLeft: 100,
    durationSeconds: 900,
    distanceMiles: 6,
  }), state);
  assert.strictEqual(perfect.merchProgress.perfectPourDrop.unlocked, true);

  state = context.defaultGameState();
  for (let index = 0; index < 7; index += 1) {
    const date = `2026-06-${String(10 + index).padStart(2, '0')}T12:00:00.000Z`;
    const daily = context.getDailyDelivery(date);
    const result = context.calculateDeliveryRewards(sampleDeliverySession({
      date,
      waterLeft: 96,
      harshInputCount: 0,
      harshBraking: 0,
      harshAcceleration: 0,
      harshLateral: 0,
      lateralJerk: 0,
      abruptTransitions: 0,
      durationSeconds: daily.id === 'wedding_cake' ? 1200 : 900,
      distanceMiles: 6,
    }), state);
    assert.strictEqual(result.dailyComplete, true);
    state = result.gameState;
  }
  assert.strictEqual(state.merchProgress.deliveryCrew.count, 7);
  assert.strictEqual(state.merchProgress.deliveryCrew.unlocked, true);
}

function testDriverLicensePassportAndCoachRecap() {
  const context = loadNoSpillContext();
  assert.strictEqual(context.getDriverLicense(1), 'Rookie Carrier');
  assert.strictEqual(context.getDriverLicense(3), 'Cup Courier');
  assert.strictEqual(context.getDriverLicense(6), 'Smooth Driver');
  assert.strictEqual(context.getDriverLicense(10), 'No-Spill Candidate');
  assert.strictEqual(context.getDriverLicense(15), 'Certified Tofu Driver');
  assert.strictEqual(context.getDriverLicense(21), 'Perfect Pour Courier');
  assert.strictEqual(context.getDriverLicense(30), 'Delivery Legend');

  const rewards = context.calculateDeliveryRewards(sampleDeliverySession({
    waterLeft: 96,
    harshBraking: 3,
    harshAcceleration: 0,
    lateralJerk: 0,
    harshInputCount: 3,
    durationSeconds: 900,
    distanceMiles: 6,
  }), context.defaultGameState());
  const passport = context.deliveryPassportSummary(rewards.gameState);
  assert(passport.total > 0);
  assert(passport.recent.some((stamp) => stamp.label === 'First Delivery'));
  assert.strictEqual(
    new Set(passport.recent.map((stamp) => stamp.id)).size,
    passport.recent.length,
  );
  assert.strictEqual(rewards.coach.damageSource, 'Brake release');
  assert(rewards.coach.bestSkill);
  assert(rewards.coach.nextFocus.includes('brake'));
}

function testGameStateStorageIsSummaryOnlyAndCommuteMasteryUsesFingerprints() {
  const localStorage = makeLocalStorage();
  const context = loadNoSpillContext({ window: { localStorage } });
  const state = context.defaultGameState();
  const first = context.calculateDeliveryRewards(sampleDeliverySession({
    waterLeft: 91,
    durationSeconds: 900,
    distanceMiles: 6,
  }), state);
  const second = context.calculateDeliveryRewards(sampleDeliverySession({
    waterLeft: 96,
    durationSeconds: 900,
    distanceMiles: 6,
  }), first.gameState);
  context.saveGameState(second.gameState);
  const stored = localStorage.getItem(context.GAME_STORAGE_KEY);
  assert(stored.includes('routeMastery'));
  assertNoSensitiveStorageData(stored);
  assert(second.commuteMasteryMessage.includes('familiar delivery'));
  const fingerprints = Object.keys(second.gameState.routeMastery);
  assert(fingerprints.length >= 1);
  assert(!fingerprints[0].includes('37.'));
}

function testGameProgressPersistsAcrossReloadSimulation() {
  const localStorage = makeLocalStorage();
  const context = loadNoSpillContext({ window: { localStorage } });
  const result = context.calculateDeliveryRewards(sampleDeliverySession({
    waterLeft: 98,
    durationSeconds: 900,
    distanceMiles: 6,
  }), context.defaultGameState());
  context.saveGameState(result.gameState);

  const reloaded = loadNoSpillContext({ window: { localStorage } });
  const loaded = reloaded.loadGameState();
  assert(loaded.totalXP > 0);
  assert(loaded.level >= 1);
  assert(loaded.skillXP.passengerComfort > 0);
  assert(loaded.stamps.first_delivery);
  assert(loaded.recentSessions.length > 0);
  assert(loaded.routeMastery && Object.keys(loaded.routeMastery).length > 0);
  assert.strictEqual(loaded.merchProgress.nospillClubGear.count, 1);
  assert(loaded.shop.tofuStock > 0);
  assert(loaded.shop.reputation > 0);
  assert(!('storyChapters' in loaded.shop));
  assert(!('contracts' in loaded.shop));
}

function testResetExportAndImportProgressAreScopedAndValidated() {
  const localStorage = makeLocalStorage({ unrelated: 'keep-me' });
  const context = loadNoSpillContext({ window: { localStorage } });
  const result = context.calculateDeliveryRewards(sampleDeliverySession({
    waterLeft: 96,
    durationSeconds: 900,
    distanceMiles: 6,
  }), context.defaultGameState());
  context.saveGameState(result.gameState);

  const backup = context.exportGameProgress(result.gameState);
  assert(backup.includes(context.GAME_STORAGE_KEY));
  assertNoSensitiveStorageData(backup);

  assert.strictEqual(context.resetGameState(), true);
  assert.strictEqual(localStorage.getItem(context.GAME_STORAGE_KEY), null);
  assert.strictEqual(localStorage.getItem('unrelated'), 'keep-me');

  const imported = context.importGameProgress(backup);
  assert.strictEqual(imported.ok, true);
  assert(context.loadGameState().totalXP > 0);

  const invalidJson = context.importGameProgress('{nope');
  assert.strictEqual(invalidJson.ok, false);
  const wrongKey = context.importGameProgress(JSON.stringify({
    key: 'other',
    state: context.defaultGameState(),
  }));
  assert.strictEqual(wrongKey.ok, false);
  const rawRoute = context.importGameProgress(JSON.stringify({
    key: context.GAME_STORAGE_KEY,
    state: { ...context.defaultGameState(), routeSamples: [{ lat: 1, lon: 2 }] },
  }));
  assert.strictEqual(rawRoute.ok, false);

  const negativeShop = context.importGameProgress(JSON.stringify({
    key: context.GAME_STORAGE_KEY,
    state: { ...context.defaultGameState(), shop: { tofuStock: -1 } },
  }));
  assert.strictEqual(negativeShop.ok, false);
  const absurdShop = context.importGameProgress(JSON.stringify({
    key: context.GAME_STORAGE_KEY,
    state: { ...context.defaultGameState(), shop: { reputation: 1e30 } },
  }));
  assert.strictEqual(absurdShop.ok, false);
  const invalidCollection = context.importGameProgress(JSON.stringify({
    key: context.GAME_STORAGE_KEY,
    state: {
      ...context.defaultGameState(),
      collection: { unlockedCharacterIds: ['unknown_driver'] },
    },
  }));
  assert.strictEqual(invalidCollection.ok, false);
}

function testTofuShopStatePackIdleAndUpgradeRules() {
  const context = loadNoSpillContext();
  const state = context.defaultGameState();
  assert.strictEqual(state.shop.tofuStock, 24);
  assert.strictEqual(state.shop.deliveryOrders, 1);
  assert.strictEqual(state.shop.tips, 0);
  assert.strictEqual(state.shop.reputation, 0);
  assert.strictEqual(state.shop.shopLevel, 1);
  assert.strictEqual(state.shop.generators.tofuPress.unlocked, true);
  assert.strictEqual(state.shop.generators.prepCounter.unlocked, true);
  assertAlmostEqual(context.getShopGeneratorRates(state).tofuPressPerSecond, 0.05);

  const activePack = context.packTofu(state, { activeDrive: true });
  assert.strictEqual(activePack.ok, false);
  assert.strictEqual(activePack.gameState.shop.tofuStock, 24);

  const firstHomePack = context.packTofu(state, { activeDrive: false });
  assert.strictEqual(firstHomePack.ok, true);
  assert.strictEqual(firstHomePack.gameState.shop.tofuStock, 25);
  assert.strictEqual(firstHomePack.gameState.shop.reputation, 0);

  const noOrderState = context.defaultGameState();
  noOrderState.shop.deliveryOrders = 0;
  noOrderState.shop.generatorCarry.deliveryOrders = 0.3;
  const emptyOrder = context.fulfillShopOrder(noOrderState, { activeDrive: false });
  assert.strictEqual(emptyOrder.ok, false);
  assert(emptyOrder.reason.includes('Need 1 prepared order'));

  const delivery = context.applySimulatedDelivery(
    'smooth_commute',
    state,
    { now: new Date('2026-06-14T12:00:00.000Z') },
  );
  const parkedPack = context.packTofu(delivery.gameState, { activeDrive: false });
  assert.strictEqual(parkedPack.ok, true);
  assert.strictEqual(parkedPack.tofuStockGained, 1);
  assert.strictEqual(
    parkedPack.gameState.shop.tofuStock,
    delivery.gameState.shop.tofuStock + 1,
  );
  assert.strictEqual(
    parkedPack.gameState.shop.reputation,
    delivery.gameState.shop.reputation,
  );
  assert.strictEqual(delivery.gameState.shop.generators.tofuPress.unlocked, true);
  assert.strictEqual(delivery.gameState.shop.generators.tofuPress.level, 1);
  assertAlmostEqual(context.getShopGeneratorRates(delivery.gameState).tofuPressPerSecond, 0.05);

  const tickState = JSON.parse(JSON.stringify(delivery.gameState));
  tickState.shop.tofuStock = 0;
  tickState.shop.deliveryOrders = 0;
  tickState.shop.generators.prepCounter = { unlocked: false, level: 0 };
  tickState.shop.stations.prep_counter = 0;
  tickState.shop.lastGeneratorTickAt = '2026-06-14T12:00:00.000Z';
  const ticked = context.applyShopGeneratorTick(
    tickState,
    new Date('2026-06-14T12:01:00.000Z'),
  );
  assert.strictEqual(ticked.changed, true);
  assert.strictEqual(ticked.gameState.shop.tofuStock, 3);
  assert.strictEqual(ticked.gameState.shop.deliveryOrders, 0);

  const prepState = context.defaultGameState();
  prepState.shop.tofuStock = 10;
  prepState.shop.reputation = 160;
  prepState.shop.shopLevel = context.getShopLevel(prepState.shop.reputation);
  prepState.shop.lastGeneratorTickAt = '2026-06-14T12:00:00.000Z';
  const prepTick = context.applyShopGeneratorTick(
    prepState,
    new Date('2026-06-14T12:01:00.000Z'),
  );
  assert.strictEqual(prepTick.gameState.shop.generators.prepCounter.unlocked, true);
  assert.strictEqual(prepTick.gameState.shop.deliveryOrders, 2);
  assert.strictEqual(prepTick.gameState.shop.tofuStock, 11);
  assert(prepTick.earnings.tofuConsumed > 0);

  const consumeState = context.defaultGameState();
  consumeState.shop.tofuStock = 10;
  consumeState.shop.reputation = 300;
  consumeState.shop.shopLevel = context.getShopLevel(consumeState.shop.reputation);
  consumeState.shop.upgrades.prep_counter = 3;
  consumeState.shop.lastGeneratorTickAt = '2026-06-14T12:00:00.000Z';
  const consumeTick = context.applyShopGeneratorTick(
    consumeState,
    new Date('2026-06-14T12:01:00.000Z'),
  );
  assert.strictEqual(consumeTick.gameState.shop.deliveryOrders, 7);
  assert.strictEqual(consumeTick.gameState.shop.tofuStock, 1);
  assert(consumeTick.earnings.tofuStock < 0);

  const fulfilled = context.fulfillShopOrder(prepTick.gameState, { activeDrive: false });
  assert.strictEqual(fulfilled.ok, true);
  assert.strictEqual(fulfilled.tipsGained, 10);
  assert.strictEqual(fulfilled.reputationGained, 1);
  assert.strictEqual(fulfilled.xpGained, 8);
  assert.strictEqual(fulfilled.gameState.shop.deliveryOrders, 1);
  assert.strictEqual(fulfilled.gameState.shop.tips, 10);
  assert.strictEqual(fulfilled.gameState.shop.reputation, prepTick.gameState.shop.reputation + 1);

  const activeOrder = context.fulfillShopOrder(prepTick.gameState, { activeDrive: true });
  assert.strictEqual(activeOrder.ok, false);
  assert.strictEqual(activeOrder.gameState.shop.deliveryOrders, prepTick.gameState.shop.deliveryOrders);

  const waitingState = context.defaultGameState();
  waitingState.shop.tofuStock = 0;
  waitingState.shop.deliveryOrders = 0;
  waitingState.shop.reputation = 160;
  waitingState.shop.lastGeneratorTickAt = '2026-06-14T12:00:00.000Z';
  const waitingRates = context.getShopGeneratorRates(waitingState);
  assert.strictEqual(waitingRates.prepStatus, 'Waiting for tofu stock');
  const waitingTick = context.applyShopGeneratorTick(
    waitingState,
    new Date('2026-06-14T12:00:10.000Z'),
  );
  assert(waitingTick.gameState.shop.tofuStock >= 0);
  assert(waitingTick.gameState.shop.deliveryOrders >= 0);

  const productionState = context.defaultGameState();
  productionState.shop.tofuStock = 100;
  productionState.shop.reputation = 160;
  productionState.shop.lastGeneratorTickAt = '2026-06-14T00:00:00.000Z';
  const offline = context.calculateOfflineShopEarnings(
    productionState,
    new Date('2026-06-14T10:00:00.000Z'),
  );
  assert.strictEqual(offline.cappedHours, 10);
  assert(offline.tofuStock >= 0);
  assert(offline.deliveryOrders > 0);
  const offlineApplied = context.applyShopGeneratorTick(
    productionState,
    new Date('2026-06-14T10:00:00.000Z'),
    { maxSeconds: 10 * 3600 },
  );
  assert(offlineApplied.gameState.shop.tofuStock >= 0);
  assert.strictEqual(offlineApplied.gameState.shop.deliveryOrders, productionState.shop.deliveryOrders + offline.deliveryOrders);

  const insufficient = context.buyShopUpgrade('tofu_press', context.defaultGameState());
  assert.strictEqual(insufficient.ok, false);

  const funded = context.defaultGameState();
  funded.shop.tofuStock = 500;
  funded.shop.reputation = 300;
  funded.shop.shopLevel = context.getShopLevel(funded.shop.reputation);
  const upgraded = context.buyShopUpgrade('tofu_press', funded);
  assert.strictEqual(upgraded.ok, true);
  assert.strictEqual(upgraded.gameState.shop.upgrades.tofu_press, 1);
  assert.strictEqual(upgraded.gameState.shop.generators.prepCounter.unlocked, true);
  assert(context.getShopProductionRate(upgraded.gameState) > 0);

  assert.strictEqual(context.getShopLevel(0), 1);
  assert.strictEqual(context.getShopLevel(150), 2);
  const catalog = context.getShopUpgradeCatalog();
  assert.strictEqual(
    JSON.stringify(catalog.map((upgrade) => upgrade.id)),
    JSON.stringify(['tofu_press', 'prep_counter', 'better_boxes', 'shop_sign']),
  );
  catalog.forEach((upgrade) => {
    const text = `${upgrade.name} ${upgrade.description} ${upgrade.effect}`;
    assert(!/speed|racing|race|faster|high-g|handling|brakes/i.test(text));
  });
}

function testLiveIdleTickAndShopButtonReliability() {
  const intervalCalls = [];
  const context = loadNoSpillContext({
    window: {
      location: { search: '', hash: '#/shop' },
      localStorage: makeLocalStorage(),
      setInterval(callback, ms) {
        intervalCalls.push({ callback, ms });
        return intervalCalls.length;
      },
    },
  });

  vm.runInContext(`
function makeNode() {
  const node = {
    textContent: "",
    innerHTML: "",
    value: "",
    disabled: false,
    dataset: {},
    classListValue: false,
    classList: {
      toggle(_className, value) {
        node.classListValue = Boolean(value);
      },
    },
    setAttribute(name, value) {
      node[name] = value;
    },
    removeAttribute(name) {
      delete node[name];
    },
  };
  return node;
}
elements = {
  surfaceNavButtons: [],
  surfaceSections: [],
  deliveryBoardSection: makeNode(),
  tofuShopSection: makeNode(),
  collectionSection: makeNode(),
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopReach: makeNode(),
  shopSpirit: makeNode(),
  shopLicenseStars: makeNode(),
  shopBuyMultiplier: makeNode(),
  packTofuButton: makeNode(),
  fulfillShopOrderButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  shopUpgradeList: makeNode(),
  shopGeneratorList: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopOfflineEarnings: makeNode(),
  deliveryWallGrid: makeNode(),
  gameNextActionTitle: makeNode(),
  gameNextActionCopy: makeNode(),
  gameCtaButton: makeNode(),
  gameCertifiedCtaButton: makeNode(),
  gameDailyProgress: makeNode(),
  gameDriverLicense: makeNode(),
  gameTotalXP: makeNode(),
  gameStreak: makeNode(),
  gameGearProgress: makeNode(),
  gameShopStock: makeNode(),
  gameShopReputation: makeNode(),
  gameShopLevel: makeNode(),
  gamePassportEmpty: makeNode(),
  gamePassportPreview: makeNode(),
  gameShopTeaser: makeNode(),
  gameShopHelper: makeNode(),
  selectedCharacterBadge: makeNode(),
  selectedCharacterName: makeNode(),
  selectedCharacterFlavor: makeNode(),
  selectedSoundPackName: makeNode(),
  selectedSoundPackFlavor: makeNode(),
  characterList: makeNode(),
  soundPackList: makeNode(),
  previewSoundButton: makeNode(),
  simulatorPanel: makeNode(),
  simulatorScenarioSelect: { ...makeNode(), options: [] },
  applySimulatorButton: makeNode(),
  simulatorStatus: makeNode(),
  summaryView: makeNode(),
  summaryStatusLabel: makeNode(),
  summaryTitle: makeNode(),
  summaryWater: makeNode(),
  returnDashboardButton: makeNode(),
  newRunButton: makeNode(),
  backSimulatorButton: makeNode(),
  routeContext: makeNode(),
  deliverySummaryGrid: makeNode(),
  commuteMasteryCopy: makeNode(),
  shareCardSection: makeNode(),
  shareButton: makeNode(),
  copyButton: makeNode(),
  downloadButton: makeNode(),
  saveButton: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.shopTab = "overview";
const state = defaultGameState();
state.shop.tofuStock = 10;
state.shop.deliveryOrders = 1;
state.shop.tips = 1000;
state.shop.reputation = 160;
state.shop.shopLevel = getShopLevel(state.shop.reputation);
state.shop.prepSlots = 100;
state.shop.counterService.running = false;
state.shop.lastGeneratorTickAt = "2026-06-14T12:00:00.000Z";
state.shop.lastShopTickAt = "2026-06-14T12:00:00.000Z";
saveGameState(state);
renderGamePanels(state);
globalThis.liveBeforeStock = elements.shopTofuStock.textContent;
globalThis.liveBeforeRate = elements.shopIdleRate.textContent;
tickOpenShopGenerators(new Date("2026-06-14T12:00:10.000Z"));
globalThis.liveAfterTenStock = elements.shopTofuStock.textContent;
globalThis.liveAfterTenState = currentGameState();
tickOpenShopGenerators(new Date("2026-06-14T12:01:10.000Z"));
globalThis.liveAfterOrders = currentGameState().shop.deliveryOrders;
globalThis.liveAfterOrderText = elements.shopDeliveryOrders.textContent;
globalThis.liveNonNegative = currentGameState().shop.tofuStock >= 0 && currentGameState().shop.deliveryOrders >= 0;
const staleSaved = JSON.parse(window.localStorage.getItem(GAME_STORAGE_KEY));
globalThis.savedBeforeClickOrders = staleSaved.shop.deliveryOrders;
const fulfillButton = {
  id: "",
  dataset: { fulfillOrders: "1" },
  closest() { return this; },
};
handleTofuShopPanelClick({ target: fulfillButton });
globalThis.afterFulfillTips = currentGameState().shop.tips;
globalThis.afterFulfillReputation = currentGameState().shop.reputation;
globalThis.afterFulfillShopXp = currentGameState().shop.shopXP;
globalThis.afterFulfillDriverXp = currentGameState().totalXP;
globalThis.afterFulfillOrders = currentGameState().shop.deliveryOrders;
const beforeBuyOwned = currentGameState().shop.stations.tofu_press;
const beforeBuyRate = getShopGeneratorRates(currentGameState()).tofuPressPerSecond;
const buyButton = {
  id: "",
  dataset: { shopStation: "tofu_press" },
  closest() { return this; },
};
handleTofuShopPanelClick({ target: buyButton });
globalThis.beforeBuyOwned = beforeBuyOwned;
globalThis.beforeBuyRate = beforeBuyRate;
globalThis.afterBuyOwned = currentGameState().shop.stations.tofu_press;
globalThis.afterBuyRate = getShopGeneratorRates(currentGameState()).tofuPressPerSecond;
const lockedState = defaultGameState();
lockedState.shop.currentShopTab = "production";
appState.shopTab = "production";
renderTofuShop(lockedState);
globalThis.productionDisabledHtml = elements.shopTabPanel.innerHTML;
startShopGeneratorTimer();
startShopGeneratorTimer();
globalThis.shopTimerId = appState.shopGeneratorTimer;
`, context);

  assert.strictEqual(context.liveBeforeRate.includes('/sec'), true);
  assert.notStrictEqual(context.liveBeforeStock, context.liveAfterTenStock);
  assert(Number(context.liveAfterTenStock) > Number(context.liveBeforeStock));
  assert.strictEqual(context.liveAfterTenState.shop.generatorCarry.tofuStock > 0, true);
  assert(context.liveAfterOrders > context.savedBeforeClickOrders);
  assert(context.liveAfterOrderText !== 'Locked');
  assert.strictEqual(context.liveNonNegative, true);
  assert.strictEqual(context.afterFulfillTips > 1000, true);
  assert.strictEqual(context.afterFulfillReputation > 160, true);
  assert.strictEqual(context.afterFulfillShopXp > 0, true);
  assert.strictEqual(context.afterFulfillDriverXp, 0);
  assert.strictEqual(context.afterFulfillOrders, context.liveAfterOrders - 1);
  assert.strictEqual(context.afterBuyOwned, context.beforeBuyOwned + 1);
  assert.strictEqual(context.afterBuyRate > context.beforeBuyRate, true);
  assert(context.productionDisabledHtml.includes('disabled'));
  assert(context.productionDisabledHtml.includes('nospill-action-reason'));
  assert(context.productionDisabledHtml.includes('Need '));
  assert.strictEqual(intervalCalls.length, 1);
  assert.strictEqual(intervalCalls[0].ms, 1000);

  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  const renderedAttrs = Array.from(source.matchAll(/actionButton\([^\n]+?["'](data-[a-z-]+)["']/g))
    .map((match) => match[1]);
  const delegatedAttrs = [
    'data-surface-target',
    'data-shop-station',
    'data-shop-station-max',
    'data-fulfill-orders',
    'data-station-upgrade',
    'data-shop-route',
    'data-training-drill',
    'data-garage-upgrade',
    'data-crew-role',
    'data-spirit-generator',
    'data-spirit-boost',
    'data-festival-boost',
    'data-covered-car-teaser',
    'data-dream-build-action',
    'data-rival-challenge',
    'data-license-exam',
    'data-license-perk',
    'data-dev-unlock',
    'data-dev-reset',
  ];
  renderedAttrs.forEach((attr) => {
    assert(delegatedAttrs.includes(attr), `visible action lacks click delegation: ${attr}`);
  });
  assert(source.includes('elements.shopTabPanel.addEventListener("click", handleTofuShopPanelClick)'));
  assert(source.includes('elements.shopTabPanel.addEventListener("click", handleShopUpgradeClick)'));
  assert(!/\bfetch\s*\(/.test(source));
  assert(!source.includes('XMLHttpRequest'));
  assert(!source.includes('sendBeacon'));
}

function testDeliveryToShopRewardsDoNotUseSpeedAndStaySummaryOnly() {
  const context = loadNoSpillContext();
  const baseState = context.defaultGameState();
  const slow = context.calculateDeliveryRewards(sampleDeliverySession({
    averageMovingSpeedMph: 18,
    medianMovingSpeedMph: 17,
    waterLeft: 96,
    durationSeconds: 900,
    distanceMiles: 6,
  }), baseState);
  const fast = context.calculateDeliveryRewards(sampleDeliverySession({
    averageMovingSpeedMph: 80,
    medianMovingSpeedMph: 76,
    waterLeft: 96,
    durationSeconds: 900,
    distanceMiles: 6,
  }), baseState);
  assert.strictEqual(slow.shop.tofuStockGained, fast.shop.tofuStockGained);
  assert.strictEqual(slow.shop.tipsGained, fast.shop.tipsGained);
  assert.strictEqual(slow.shop.reputationGained, fast.shop.reputationGained);
  assert.strictEqual(
    JSON.stringify(slow.shop.certifiedBoost),
    JSON.stringify(fast.shop.certifiedBoost),
  );
  assert(slow.shop.tofuStockGained > 0);
  assert(slow.shop.tipsGained > 0);
  assert(slow.shop.reputationGained > 0);
  assert.strictEqual(slow.shop.certifiedBoost.applied, true);
  assert(!('storyChapters' in slow.gameState.shop));
  assert(!('contracts' in slow.gameState.shop));

  const generatorSlow = context.defaultGameState();
  generatorSlow.shop.tofuStock = 100;
  generatorSlow.shop.reputation = 160;
  generatorSlow.recentSessions = [{ averageMovingSpeedMph: 12 }];
  generatorSlow.shop.lastGeneratorTickAt = '2026-06-14T12:00:00.000Z';
  const generatorFast = JSON.parse(JSON.stringify(generatorSlow));
  generatorFast.recentSessions = [{ averageMovingSpeedMph: 90, topSpeedMph: 110 }];
  assert.strictEqual(
    JSON.stringify(context.getShopGeneratorRates(generatorSlow)),
    JSON.stringify(context.getShopGeneratorRates(generatorFast)),
  );
  const slowGeneratorTick = context.applyShopGeneratorTick(
    generatorSlow,
    new Date('2026-06-14T12:01:00.000Z'),
  );
  const fastGeneratorTick = context.applyShopGeneratorTick(
    generatorFast,
    new Date('2026-06-14T12:01:00.000Z'),
  );
  assert.strictEqual(slowGeneratorTick.gameState.shop.tofuStock, fastGeneratorTick.gameState.shop.tofuStock);
  assert.strictEqual(
    slowGeneratorTick.gameState.shop.deliveryOrders,
    fastGeneratorTick.gameState.shop.deliveryOrders,
  );

  const practice = context.calculateDeliveryRewards(sampleDeliverySession({
    mode: 'basic',
    qualificationStatus: 'practice',
    waterLeft: 100,
    durationSeconds: 30,
    distanceMiles: 0,
  }), context.defaultGameState());
  assert(practice.shop.tofuStockGained <= 8);
  assert.strictEqual(practice.shop.reputationGained, 0);
  assert.strictEqual(practice.shop.certifiedBoost.applied, false);

  const simulated = context.applySimulatedDelivery(
    'smooth_commute',
    context.defaultGameState(),
    { now: new Date('2026-06-14T12:00:00.000Z'), excludeMerch: false },
  );
  assert.strictEqual(simulated.rewards.shop.certifiedBoost.applied, false);

  const exportedShop = context.sanitizeShopStateForExport(slow.gameState);
  assert(exportedShop.tofuStock > 0);
  assertNoSensitiveStorageData(exportedShop);
}

function testExpandedIdleShopLayerMechanics() {
  const context = loadNoSpillContext({
    window: { location: { search: '?dev=1' }, localStorage: makeLocalStorage() },
  });
  const state = context.defaultGameState();
  assert.strictEqual(state.shop.prepSlots >= 10, true);
  assert.strictEqual(state.shop.shopReach, 0);
  assert.strictEqual(state.shop.shopSpirit, 0);
  assert.strictEqual(state.shop.licenseStars, 0);
  assert.strictEqual(state.shop.stations.tofu_press, 1);

  const funded = context.defaultGameState();
  funded.shop.tips = 10000;
  funded.shop.tofuStock = 500;
  funded.shop.deliveryOrders = 50;
  funded.shop.reputation = 800;
  funded.shop.shopLevel = context.getShopLevel(funded.shop.reputation);
  funded.shop.prepSlots = 100;
  funded.shop.shopReach = 20;
  funded.shop.shopSpirit = 100;
  funded.shop.routeKnowledge = 40;

  const buyOne = context.buyShopStation('prep_counter', funded, 1);
  assert.strictEqual(buyOne.ok, true);
  assert.strictEqual(buyOne.gameState.shop.stations.prep_counter > funded.shop.stations.prep_counter, true);
  assert.strictEqual(buyOne.gameState.shop.tips < funded.shop.tips, true);

  const buyTen = context.buyShopStation('tofu_press', buyOne.gameState, 10);
  assert.strictEqual(buyTen.ok, true);
  assert.strictEqual(buyTen.quantity, 10);
  assert.strictEqual(buyTen.gameState.shop.stations.tofu_press >= 11, true);
  assert.strictEqual(context.getShopGeneratorRates(buyTen.gameState).tofuPressPerSecond > context.getShopGeneratorRates(funded).tofuPressPerSecond, true);

  const stationUpgrade = context.buyStationUpgrade('tofu_press_faster', buyTen.gameState);
  assert.strictEqual(stationUpgrade.ok, true);
  assert.strictEqual(stationUpgrade.gameState.shop.stationUpgrades.tofu_press_faster, 1);

  const bulkOrders = context.fulfillShopOrders(stationUpgrade.gameState, 10, { activeDrive: false });
  assert.strictEqual(bulkOrders.ok, true);
  assert.strictEqual(bulkOrders.quantity, 10);
  assert.strictEqual(bulkOrders.gameState.shop.tips > stationUpgrade.gameState.shop.tips, true);
  assert.strictEqual(Boolean(bulkOrders.gameState.stamps.first_shop_order), true);

  const route = context.completeFictionalRoute('shop_street', bulkOrders.gameState);
  assert.strictEqual(route.ok, false);
  assert(route.reason.includes('Routes are deferred'));
  assert.strictEqual(route.gameState.shop.shopReach, bulkOrders.gameState.shop.shopReach);
  assert.strictEqual(Boolean(route.gameState.stamps.shop_street_complete), false);

  const training = context.runTrainingDrill('cone_drill', bulkOrders.gameState);
  assert.strictEqual(training.ok, false);
  assert(training.reason.includes('deferred'));
  assert.strictEqual(training.gameState.shop.cupStabilityXP, bulkOrders.gameState.shop.cupStabilityXP);

  const garage = context.buyGarageUpgrade('cup_holder_charm', bulkOrders.gameState);
  assert.strictEqual(garage.ok, false);
  assert(garage.reason.includes('deferred'));
  assert.strictEqual(garage.gameState.shop.garage.cup_holder_charm, 0);

  const crew = context.hireCrewRole('apprentice_driver', bulkOrders.gameState);
  assert.strictEqual(crew.ok, false);
  assert(crew.reason.includes('deferred'));
  assert.strictEqual(crew.gameState.shop.crew.apprentice_driver, 0);
  assert.strictEqual(Boolean(crew.gameState.stamps.first_apprentice), false);

  const spiritGenerator = context.buySpiritGenerator('tea_kettle', bulkOrders.gameState);
  assert.strictEqual(spiritGenerator.ok, true);
  spiritGenerator.gameState.shop.shopSpirit = 25;
  const boost = context.useShopSpiritBoost('rush_prep', spiritGenerator.gameState);
  assert.strictEqual(boost.ok, true);
  assert.strictEqual(boost.gameState.shop.tofuStock > spiritGenerator.gameState.shop.tofuStock, true);
  boost.gameState.shop.festivalBoosts.lunch_rush = 1;
  const festival = context.useFestivalBoost('lunch_rush', boost.gameState);
  assert.strictEqual(festival.ok, true);
  assert.strictEqual(Boolean(festival.gameState.stamps.first_festival_boost), true);

  const rivalState = JSON.parse(JSON.stringify(festival.gameState));
  rivalState.shop.deliveryOrders = 10;
  rivalState.shop.shopSpirit = 20;
  rivalState.shop.reputation = 100;
  const rival = context.startRivalChallenge('quiet_counter', rivalState);
  assert.strictEqual(rival.ok, true);
  assert.strictEqual(Boolean(rival.gameState.stamps.quiet_counter_showcase), true);

  const examState = JSON.parse(JSON.stringify(rival.gameState));
  examState.totalXP = 2500;
  examState.level = 10;
  examState.shop.lifetimeDeliveryOrders = 25;
  examState.shop.shopLevel = 5;
  examState.shop.reputation = 1000;
  examState.shop.routes.shop_street.mastery = 50;
  ['first_shop_order', 'first_tofu_press', 'first_prep_counter', 'shop_street_complete', 'first_100_tips'].forEach((stampId) => {
    examState.stamps[stampId] = { date: '2026-06-14T00:00:00.000Z', label: stampId };
  });
  const examStatus = context.licenseExamStatus(examState);
  assert.strictEqual(examStatus.ready, true);
  const exam = context.takeLicenseExam(examState, { confirmed: true });
  assert.strictEqual(exam.ok, true);
  assert.strictEqual(exam.gameState.shop.licenseStars > 0, true);
  const perk = context.buyLicensePerk('starter_press', exam.gameState);
  assert.strictEqual(perk.ok, true);

  const qa = context.unlockAllLocalQa(context.defaultGameState());
  assert.strictEqual(qa.ok, true);
  assert.strictEqual(qa.gameState.shop.untrustedLocalQa, true);
  assert.strictEqual(context.isDevToolsEnabled(), true);
  assert(qa.gameState.shop.ledger.length <= 80);
  assertNoSensitiveStorageData(qa.gameState);

  const source = fs.readFileSync(NOSPILL_HTML, 'utf8') + fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(!/\b(?:larva|hive|queen|swarm lord|mutagen|invasion|meat)\b/i.test(source));
}

function testSettingsTabConsolidatesProgressToolsAndHidesQaByDefault() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(!html.includes('Settings / Progress Tools'));
  assert(!html.includes('Developer QA hidden'));
  assert(!html.includes('Enable with ?dev=1'));
  assert(!html.includes('Settings / QA'));

  const normalContext = loadNoSpillContext({
    window: { location: { search: '' }, localStorage: makeLocalStorage() },
  });
  vm.runInContext(`
const state = defaultGameState();
globalThis.normalSettingsHtml = renderShopSettingsPanel(state);
`, normalContext);
  assert(normalContext.normalSettingsHtml.includes('<h4>Settings</h4>'));
  assert(normalContext.normalSettingsHtml.includes('Progress is saved on this device.'));
  assert(normalContext.normalSettingsHtml.includes('Progress Tools'));
  assert(normalContext.normalSettingsHtml.includes('id="export-progress-button"'));
  assert(normalContext.normalSettingsHtml.includes('Export Progress'));
  assert(normalContext.normalSettingsHtml.includes('id="import-progress-button"'));
  assert(normalContext.normalSettingsHtml.includes('Import Progress'));
  assert(normalContext.normalSettingsHtml.includes('id="reset-progress-button"'));
  assert(normalContext.normalSettingsHtml.includes('Reset Progress'));
  assert(!normalContext.normalSettingsHtml.includes('Settings / QA'));
  assert(!normalContext.normalSettingsHtml.includes('Developer QA hidden'));
  assert(!normalContext.normalSettingsHtml.includes('Enable with ?dev=1'));
  assert(!normalContext.normalSettingsHtml.includes('Developer Tools'));
  assert(!normalContext.normalSettingsHtml.includes('Generators'));
  assert(!normalContext.normalSettingsHtml.includes('Production'));

  const queryDevContext = loadNoSpillContext({
    window: { location: { search: '?dev=1' }, localStorage: makeLocalStorage() },
  });
  vm.runInContext(`
globalThis.queryDevSettingsHtml = renderShopSettingsPanel(defaultGameState());
`, queryDevContext);
  assert(queryDevContext.queryDevSettingsHtml.includes('Developer Tools'));
  assert(queryDevContext.queryDevSettingsHtml.includes('Developer QA only. Local test state is not trusted for certified unlocks.'));
  assert(queryDevContext.queryDevSettingsHtml.includes('Unlock All Local QA'));
  assert(queryDevContext.queryDevSettingsHtml.includes('Reset QA State'));

  const flagDevContext = loadNoSpillContext({
    window: {
      location: { search: '' },
      localStorage: makeLocalStorage({ tofuDriverDevToolsEnabled: 'true' }),
    },
  });
  vm.runInContext(`
globalThis.flagDevSettingsHtml = renderShopSettingsPanel(defaultGameState());
`, flagDevContext);
  assert(flagDevContext.flagDevSettingsHtml.includes('Developer Tools'));
  assert(flagDevContext.flagDevSettingsHtml.includes('Unlock All Local QA'));
}

function findDailyDeliveryDate(context, missionId) {
  for (let index = 1; index <= 60; index += 1) {
    const day = String(index).padStart(2, '0');
    const dateKey = `2026-06-${day}`;
    if (context.getDailyDelivery(dateKey).id === missionId) return dateKey;
  }
  throw new Error(`No deterministic ${missionId} delivery date found`);
}

function testCharacterArtAssetSlotsAndPlaceholders() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  const css = fs.readFileSync(NOSPILL_CSS, 'utf8');
  const inventory = fs.readFileSync(path.join(ROOT, 'CHARACTER_ART_ASSET_INVENTORY.md'), 'utf8');
  assert(inventory.includes('| Asset ID | Surface / Screen | Route / UI Area | Purpose |'));
  [
    'shop_assistant_main_portrait',
    'result_screen_cameo',
    'coach_recap_expression_neutral',
    'coach_recap_expression_pleased',
    'reward_unlock_card_art',
    'crew_profile_card',
    'stamp_fanfare_cameo',
    'share_card_cameo_optional',
  ].forEach((slotId) => assert(inventory.includes(slotId), `${slotId} should be inventoried`));
  assert(inventory.includes('Minimum Viable Asset Pack'));
  assert(inventory.includes('Mika MVP Pack'));
  assert(inventory.includes('6-image MVP'));
  [
    '/static/nospill/images/shop_assistant_main_portrait.webp',
    '/static/nospill/images/result_screen_cameo.webp',
    '/static/nospill/images/coach_neutral.webp',
    '/static/nospill/images/coach_pleased.webp',
    '/static/nospill/images/crew_profile_card.webp',
    '/static/nospill/images/reward_unlock_splash.webp',
  ].forEach((expectedFile) => assert(inventory.includes(expectedFile), `${expectedFile} should be inventoried`));
  assert(fs.existsSync(path.join(ROOT, 'frontend', 'nospill', 'images', 'characters', 'mika', 'README.md')));
  [
    'shop_assistant_main_portrait.webp',
    'result_screen_cameo.webp',
    'coach_neutral.webp',
    'coach_pleased.webp',
    'crew_profile_card.webp',
    'reward_unlock_splash.webp',
  ].forEach((filename) => {
    assert.strictEqual(
      fs.existsSync(path.join(ROOT, 'frontend', 'nospill', 'images', filename)),
      true,
      `${filename} should exist as a real integrated Mika asset`,
    );
  });
  const runViewHtml = html.slice(
    html.indexOf('id="run-view"'),
    html.indexOf('id="unsupported-view"'),
  );
  assert(!runViewHtml.includes('data-character-slot'));
  assert(!runViewHtml.includes('Character art coming soon'));

  const context = loadNoSpillContext();
  assert(context.CHARACTER_ART_SLOTS.shop_assistant_main_portrait);
  assert(context.CHARACTER_ART_SLOTS.coach_recap_expression_pleased);
  assert.strictEqual(
    context.getCharacterAsset('angry_tofu_driver', 'crew_profile_card').status,
    'placeholder',
  );
  const mikaCatalog = context.getCharacterCatalog().find((character) => character.id === 'mika');
  assert(mikaCatalog);
  assert.strictEqual(mikaCatalog.name, 'Mika');
  assert.strictEqual(mikaCatalog.role, 'Night Shift Manager');
  const mikaExpectedPaths = {
    shop_assistant_main_portrait: '/static/nospill/images/shop_assistant_main_portrait.webp',
    result_screen_cameo: '/static/nospill/images/result_screen_cameo.webp',
    coach_recap_expression_neutral: '/static/nospill/images/coach_neutral.webp',
    coach_recap_expression_pleased: '/static/nospill/images/coach_pleased.webp',
    crew_profile_card: '/static/nospill/images/crew_profile_card.webp',
    reward_unlock_card_art: '/static/nospill/images/reward_unlock_splash.webp',
    stamp_fanfare_cameo: '/static/nospill/images/reward_unlock_splash.webp',
  };
  Object.entries(mikaExpectedPaths).forEach(([slotId, expectedPath]) => {
    const asset = context.getCharacterAsset('mika', slotId);
    assert.strictEqual(asset.src, expectedPath);
    assert.strictEqual(asset.status, 'assigned');
  });
  const missingSlot = context.renderCharacterCameo('undefined_future_slot', context.defaultGameState());
  assert(missingSlot.includes('Character art coming soon'));
  assert(missingSlot.includes('Asset slot not yet defined.'));

  const freshMikaArt = context.renderCharacterCameo('shop_assistant_main_portrait', context.defaultGameState());
  assert(freshMikaArt.includes('data-character-slot="shop_assistant_main_portrait"'));
  assert(freshMikaArt.includes('data-character-id="mika"'));
  assert(freshMikaArt.includes('/static/nospill/images/shop_assistant_main_portrait.webp'));
  assert(!freshMikaArt.includes('is-placeholder'));

  const unlocked = context.defaultGameState();
  unlocked.collection.unlockedCharacterIds.push('angry_tofu_driver', 'sleepy_dispatcher');
  unlocked.collection.selectedCharacterId = 'sleepy_dispatcher';
  const selectedHtml = context.renderCharacterCameo('result_screen_cameo', unlocked);
  assert(selectedHtml.includes('Sleepy Dispatcher'));
  assert(selectedHtml.includes('result_screen_cameo'));
  assert(selectedHtml.includes('Result cameo art pending'));
  const selectedPreferAssignedHtml = context.renderCharacterCameo('result_screen_cameo', unlocked, {
    preferAssigned: true,
    variant: 'result-cameo',
    copy: 'Clean delivery.',
  });
  assert(selectedPreferAssignedHtml.includes('data-character-id="mika"'));
  assert(selectedPreferAssignedHtml.includes('/static/nospill/images/result_screen_cameo.webp'));
  assert(selectedPreferAssignedHtml.includes('is-result-cameo'));
  assert(selectedPreferAssignedHtml.includes('Clean delivery.'));
  assert(!selectedPreferAssignedHtml.includes('Result cameo art pending'));
  assert(!selectedPreferAssignedHtml.includes('hidden>M</div>'));

  const mikaState = context.defaultGameState();
  mikaState.collection.unlockedCharacterIds.push('mika');
  mikaState.collection.selectedCharacterId = 'mika';
  const mikaCameo = context.renderCharacterCameo('shop_assistant_main_portrait', mikaState);
  assert(mikaCameo.includes('data-character-id="mika"'));
  assert(mikaCameo.includes('/static/nospill/images/shop_assistant_main_portrait.webp'));
  assert(mikaCameo.includes('onerror="this.hidden = true;"'));
  assert(!mikaCameo.includes('hidden>M</div>'));
  const mikaNeutral = context.renderCharacterCameo('coach_recap_expression_neutral', mikaState);
  assert(mikaNeutral.includes('/static/nospill/images/coach_neutral.webp'));
  assert(!mikaNeutral.includes('Coach portrait not yet assigned'));
  const mikaPleased = context.renderCharacterCameo('coach_recap_expression_pleased', mikaState);
  assert(mikaPleased.includes('/static/nospill/images/coach_pleased.webp'));
  assert(!mikaPleased.includes('Coach portrait not yet assigned'));
  const mikaCoachLarge = context.renderCharacterCameo('coach_recap_expression_pleased', mikaState, {
    preferAssigned: true,
    variant: 'coach-cameo',
    copy: 'Mika noted a calm finish.',
  });
  assert(mikaCoachLarge.includes('/static/nospill/images/coach_pleased.webp'));
  assert(mikaCoachLarge.includes('is-coach-cameo'));
  assert(mikaCoachLarge.includes('Mika noted a calm finish.'));
  assert(!mikaCoachLarge.includes('Coach portrait not yet assigned'));
  assert(!mikaCoachLarge.includes('hidden>M</div>'));
  assert(css.includes('.nospill-character-cameo.is-result-cameo'));
  assert(css.includes('.nospill-character-cameo.is-coach-cameo'));
  assert(css.includes('clamp(120px, 28vw, 220px)'));
  assert.strictEqual(
    context.coachRecapCharacterSlot({
      cargoCondition: 0.98,
      coachRecap: { insufficientData: false },
    }),
    'coach_recap_expression_pleased',
  );
  assert.strictEqual(
    context.coachRecapCharacterSlot({
      cargoCondition: 0.8,
      coachRecap: { insufficientData: false },
    }),
    'coach_recap_expression_neutral',
  );
  const mikaRewardSplash = context.renderCharacterCameo('reward_unlock_card_art', mikaState);
  assert(mikaRewardSplash.includes('/static/nospill/images/reward_unlock_splash.webp'));
  const mikaStampSplash = context.renderCharacterCameo('stamp_fanfare_cameo', mikaState);
  assert(mikaStampSplash.includes('/static/nospill/images/reward_unlock_splash.webp'));

  context.artSlotState = mikaState;
  vm.runInContext(`
function makeNode() {
  const node = {
    textContent: "",
    innerHTML: "",
    disabled: null,
    dataset: {},
    value: "",
    classListValue: null,
  };
  node.classList = {
    toggle(_className, hidden) {
      node.classListValue = Boolean(hidden);
    },
    add() {},
    remove() {},
  };
  node.querySelector = () => null;
  return node;
}
elements = {
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopReach: makeNode(),
  shopSpirit: makeNode(),
  shopLicenseStars: makeNode(),
  shopBuyMultiplier: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopInlineResult: makeNode(),
  packTofuButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderButton: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  deliveryWallGrid: makeNode(),
  shopOfflineEarnings: makeNode(),
  selectedCharacterBadge: makeNode(),
  selectedCharacterName: makeNode(),
  selectedCharacterFlavor: makeNode(),
  selectedSoundPackName: makeNode(),
  selectedSoundPackFlavor: makeNode(),
  characterList: makeNode(),
  soundPackList: makeNode(),
  previewSoundButton: makeNode(),
};
appState.running = false;
appState.calibrating = false;
appState.shopTab = "overview";
renderTofuShop(artSlotState);
globalThis.parkedOverviewArtHtml = elements.shopTabPanel.innerHTML;
renderCollectionPanel(artSlotState);
globalThis.parkedCrewArtHtml = elements.characterList.innerHTML;
appState.running = true;
globalThis.activeCameoHtml = renderCharacterCameo("result_screen_cameo", artSlotState);
renderCollectionPanel(artSlotState);
globalThis.activeCrewArtHtml = elements.characterList.innerHTML;
`, context);
  assert(context.parkedOverviewArtHtml.includes('nospill-shop-scene'));
  assert(context.parkedOverviewArtHtml.includes('data-scene-id='));
  assert(!context.parkedOverviewArtHtml.includes('data-character-slot="shop_assistant_main_portrait"'));
  assert(context.parkedCrewArtHtml.includes('data-character-slot="crew_profile_card"'));
  assert(context.parkedCrewArtHtml.includes('/static/nospill/images/crew_profile_card.webp'));
  assert(context.parkedCrewArtHtml.includes('onerror="this.hidden = true;"'));
  assert(!context.parkedCrewArtHtml.includes('hidden>M</div>'));
  assert.strictEqual(context.activeCameoHtml, '');
  assert(!context.activeCrewArtHtml.includes('data-character-slot="crew_profile_card"'));

  const baseState = context.defaultGameState();
  const selectedMikaState = context.defaultGameState();
  selectedMikaState.collection.unlockedCharacterIds.push('mika');
  selectedMikaState.collection.selectedCharacterId = 'mika';
  const selectedResult = context.selectCharacter('mika', selectedMikaState);
  assert.strictEqual(selectedResult.ok, true);
  assert.deepStrictEqual(context.cargoTypeProfile('soft_tofu'), context.cargoTypeProfile('soft_tofu'));
  const route = [
    { latitude: 37.0, longitude: -122.0, timestamp: 0, speed: 8 },
    { latitude: 37.0005, longitude: -122.0005, timestamp: 300000, speed: 8 },
    { latitude: 37.001, longitude: -122.001, timestamp: 600000, speed: 8 },
  ];
  const qualificationInput = {
    durationSeconds: 600,
    route,
    geoStatus: 'active',
    motion: {
      samples: 400,
      impossibleSpikes: 0,
      orientationSamples: 240,
      orientationUnstableSamples: 0,
    },
  };
  assert.deepStrictEqual(
    context.qualificationForRoute(qualificationInput),
    context.qualificationForRoute(qualificationInput),
  );
  const rewardSession = {
    qualified: true,
    waterLeft: 95,
    cargoCondition: 95,
    durationSeconds: 600,
    routeType: 'Calm Cruise',
    simulated: false,
  };
  const baseRewards = context.calculateDeliveryRewards(rewardSession, baseState);
  const mikaRewards = context.calculateDeliveryRewards(rewardSession, selectedResult.gameState);
  assert.strictEqual(mikaRewards.xpGained, baseRewards.xpGained);
  assert.strictEqual(mikaRewards.shop.certifiedBoost.tips, baseRewards.shop.certifiedBoost.tips);
  assert.strictEqual(mikaRewards.shop.certifiedBoost.reputation, baseRewards.shop.certifiedBoost.reputation);
}

function testTofuShopLivingSceneV1Groundwork() {
  const specPath = path.join(ROOT, 'TOFU_SHOP_LIVING_SCENE_ASSET_SPEC.md');
  const spec = fs.readFileSync(specPath, 'utf8');
  assert(spec.includes('MVP Art Pack'));
  assert(spec.includes('full-scene variants'));
  [
    'frontend/nospill/images/scene_tiny_shop_empty.webp',
    'frontend/nospill/images/scene_tiny_shop_working.webp',
    'frontend/nospill/images/scene_tiny_shop_upgraded.webp',
    'frontend/nospill/images/scene_busy_shop_with_covered_car.webp',
  ].forEach((expectedPath) => assert(spec.includes(expectedPath), `${expectedPath} should be specified`));
  assert(spec.includes('scene_busy_shop_established` is currently aliased to `scene_tiny_shop_upgraded.webp`'));
  assert(spec.includes('Reduced-Motion Behavior'));
  assert(spec.includes('Integrated'));
  assert(spec.includes('optional future work'));
  assert(fs.existsSync(path.join(ROOT, 'frontend', 'nospill', 'images', 'scenes', 'tofu-shop', 'README.md')));

  [
    'scene_tiny_shop_empty.webp',
    'scene_tiny_shop_working.webp',
    'scene_tiny_shop_upgraded.webp',
    'scene_busy_shop_with_covered_car.webp',
  ].forEach((filename) => {
    assert.strictEqual(
      fs.existsSync(path.join(ROOT, 'frontend', 'nospill', 'images', filename)),
      true,
      `${filename} should exist as a real integrated scene asset`,
    );
  });
  assert.strictEqual(
    fs.existsSync(path.join(ROOT, 'frontend', 'nospill', 'images', 'scene_busy_shop_established.webp')),
    false,
    'scene_busy_shop_established.webp should remain optional future work while the state aliases to upgraded art',
  );

  const context = loadNoSpillContext();
  assert.strictEqual(
    context.TOFU_SHOP_SCENE_ASSETS.scene_tiny_shop_empty.src,
    '/static/nospill/images/scene_tiny_shop_empty.webp',
  );
  assert.strictEqual(
    context.TOFU_SHOP_SCENE_ASSETS.scene_tiny_shop_working.src,
    '/static/nospill/images/scene_tiny_shop_working.webp',
  );
  assert.strictEqual(
    context.TOFU_SHOP_SCENE_ASSETS.scene_tiny_shop_upgraded.src,
    '/static/nospill/images/scene_tiny_shop_upgraded.webp',
  );
  assert.strictEqual(
    context.TOFU_SHOP_SCENE_ASSETS.scene_busy_shop_established.src,
    '/static/nospill/images/scene_tiny_shop_upgraded.webp',
  );
  assert.strictEqual(
    context.TOFU_SHOP_SCENE_ASSETS.scene_busy_shop_with_covered_car.src,
    '/static/nospill/images/scene_busy_shop_with_covered_car.webp',
  );
  assert.strictEqual(
    context.getSceneAsset('missing_future_layer').placeholder,
    'Scene art pending',
  );

  const freshState = context.defaultGameState();
  const freshSceneState = context.getTofuShopSceneState(freshState);
  assert.strictEqual(freshSceneState.sceneId, 'scene_tiny_shop_empty');
  const freshLayers = context.getTofuShopSceneLayers(freshSceneState);
  assert.strictEqual(freshLayers.length, 1);
  assert.strictEqual(freshLayers[0].id, 'scene_tiny_shop_empty');

  const onePress = context.defaultGameState();
  onePress.shop.stations.tofu_press = 1;
  assert.strictEqual(context.getTofuShopSceneState(onePress).sceneId, 'scene_tiny_shop_empty');

  const onePrepCounter = context.defaultGameState();
  onePrepCounter.shop.stations.prep_counter = 1;
  assert.strictEqual(context.getTofuShopSceneState(onePrepCounter).sceneId, 'scene_tiny_shop_empty');

  const oneOrder = context.defaultGameState();
  oneOrder.shop.lifetimeDeliveryOrders = 1;
  assert.strictEqual(context.getTofuShopSceneState(oneOrder).sceneId, 'scene_tiny_shop_empty');

  const oneShelf = context.defaultGameState();
  oneShelf.shop.stations.delivery_shelf = 1;
  oneShelf.shop.stations.shop_sign = 1;
  assert.strictEqual(context.getTofuShopSceneState(oneShelf).sceneId, 'scene_tiny_shop_empty');

  const working = context.defaultGameState();
  working.shop.lifetimeDeliveryOrders = 3;
  assert.strictEqual(context.getTofuShopSceneState(working).sceneId, 'scene_tiny_shop_working');

  const nineOrders = context.defaultGameState();
  nineOrders.shop.lifetimeDeliveryOrders = 9;
  assert.strictEqual(context.getTofuShopSceneState(nineOrders).sceneId, 'scene_tiny_shop_working');

  const upgraded = context.defaultGameState();
  upgraded.shop.stationUpgrades.prep_counter_faster = 1;
  assert.strictEqual(context.getTofuShopSceneState(upgraded).sceneId, 'scene_tiny_shop_upgraded');

  const upgradedByOrders = context.defaultGameState();
  upgradedByOrders.shop.lifetimeDeliveryOrders = 10;
  assert.strictEqual(context.getTofuShopSceneState(upgradedByOrders).sceneId, 'scene_tiny_shop_upgraded');

  const earlyCoveredCar = context.defaultGameState();
  earlyCoveredCar.stamps.first_upgrade_purchased = true;
  assert.strictEqual(context.getTofuShopSceneState(earlyCoveredCar).sceneId, 'scene_tiny_shop_upgraded');

  const advanced = context.defaultGameState();
  advanced.shop.stationUpgrades.prep_counter_faster = 1;
  advanced.shop.stations.delivery_shelf = 5;
  advanced.shop.stations.shop_sign = 5;
  advanced.shop.lifetimeDeliveryOrders = 10;
  advanced.shop.ordersFulfilled = 10;
  advanced.stamps.first_10_orders = true;
  advanced.collection.unlockedCharacterIds.push('mika');
  advanced.collection.selectedCharacterId = 'mika';
  assert.strictEqual(context.getTofuShopSceneState(advanced).sceneId, 'scene_busy_shop_established');

  const fluctuatingResources = JSON.parse(JSON.stringify(advanced));
  fluctuatingResources.shop.tofuStock = 0;
  fluctuatingResources.shop.deliveryOrders = 1000000;
  assert.strictEqual(context.getTofuShopSceneState(fluctuatingResources).sceneId, 'scene_busy_shop_established');

  const coveredCar = JSON.parse(JSON.stringify(advanced));
  coveredCar.stamps.first_upgrade_purchased = true;
  coveredCar.shop.reputation = 2000000;
  coveredCar.shop.lifetimeReputation = 2000000;
  coveredCar.shop.shopLevel = context.getShopLevel(coveredCar.shop.reputation);
  coveredCar.shop.lifetimeTips = 2000000;
  coveredCar.shop.lifetimeDeliveryOrders = 1200;
  coveredCar.stamps.first_family_tofu_tray = { label: 'First Family Tofu Tray' };
  coveredCar.stamps.first_100_tips = { label: 'First 100 Tips' };
  coveredCar.shop.stationUpgrades.counter_service_crew = 1;
  coveredCar.shop.stationUpgrades.manager_shift_manager = 1;
  coveredCar.shop.stationUpgrades.manager_wholesale_pickup = 1;
  coveredCar.shop.wholesalePickupsCompleted = 1;
  assert.strictEqual(context.getTofuShopSceneState(coveredCar).sceneId, 'scene_busy_shop_with_covered_car');

  const sceneHtml = context.renderTofuShopLivingScene(coveredCar);
  assert(sceneHtml.includes('aria-label="Tofu Shop living scene"'));
  assert(sceneHtml.includes('data-scene-id="scene_busy_shop_with_covered_car"'));
  assert(sceneHtml.includes('/static/nospill/images/scene_busy_shop_with_covered_car.webp'));
  assert(sceneHtml.includes('loading="eager"'));
  assert(!sceneHtml.includes('data-scene-layer='));
  assert(!sceneHtml.includes('Tofu Press art pending'));
  assert(!sceneHtml.includes('Delivery Shelf art pending'));
  assert(!sceneHtml.includes('Covered Car Teaser'));
  assert(!sceneHtml.includes('Covered car scene pending'));
  assert(!sceneHtml.includes('Decorative parked scene. Shop controls stay below.'));
  assert(!sceneHtml.includes('Counter Service is handling pickups'));
  assert(!sceneHtml.includes('onerror='));
  assert(!sceneHtml.includes('nospill-shop-scene-placeholder'));
  assert(!sceneHtml.includes('/static/nospill/images/shop_assistant_main_portrait.webp'));
  assert(sceneHtml.includes('Old Car Out Back'));
  assert(sceneHtml.includes('Behind the shop, an old car waits under a cover.'));

  const fallbackLayer = context.renderSceneLayer({ id: 'scene_busy_shop_established', visible: true }, {
    gameState: advanced,
    reducedMotion: false,
  });
  assert(fallbackLayer.includes('/static/nospill/images/scene_tiny_shop_upgraded.webp'));
  assert(!fallbackLayer.includes('onerror='));
  assert(!fallbackLayer.includes('nospill-shop-scene-placeholder'));
  assert(!fallbackLayer.includes('/static/nospill/images/scene_busy_shop_established.webp'));
  const establishedHtml = context.renderTofuShopLivingScene(advanced);
  assert(establishedHtml.includes('data-scene-id="scene_busy_shop_established"'));
  assert(establishedHtml.includes('/static/nospill/images/scene_tiny_shop_upgraded.webp'));
  assert(!establishedHtml.includes('/static/nospill/images/scene_busy_shop_established.webp'));
  assert(!establishedHtml.includes('Established shop scene pending'));
  assert(!establishedHtml.includes('art pending'));

  const stableHtmlAgain = context.renderTofuShopLivingScene(advanced);
  assert.strictEqual(stableHtmlAgain, establishedHtml);

  const missingLayer = context.renderSceneLayer({ id: 'missing_future_layer', visible: true }, {
    gameState: advanced,
    reducedMotion: false,
  });
  assert(missingLayer.includes('nospill-shop-scene-placeholder'));
  assert(missingLayer.includes('Scene art pending'));

  const reducedContext = loadNoSpillContext({
    window: {
      matchMedia(query) {
        return { matches: query.includes('prefers-reduced-motion') };
      },
    },
  });
  const reducedState = reducedContext.defaultGameState();
  reducedState.shop.deliveryOrders = 4;
  reducedState.shop.ordersFulfilled = 10;
  reducedState.stamps.first_10_orders = true;
  const reducedHtml = reducedContext.renderTofuShopLivingScene(reducedState);
  assert(reducedHtml.includes('is-reduced-motion'));
  assert(!reducedHtml.includes('is-animated'));
  const css = fs.readFileSync(NOSPILL_CSS, 'utf8');
  assert(css.includes('@media (prefers-reduced-motion: reduce)'));
  assert(!css.includes('animation: shop-scene-pulse'));
  assert(css.includes('.nospill-shop-scene'));
  assert(css.includes('pointer-events: none;'));

  context.activeSceneState = advanced;
  vm.runInContext(`
appState.running = true;
globalThis.activeSceneHtml = renderTofuShopLivingScene(activeSceneState);
`, context);
  assert.strictEqual(context.activeSceneHtml, '');
  const activeLayers = context.getTofuShopSceneLayers({ activeDrive: true });
  assert.strictEqual(activeLayers.length, 0);

  const beforeRender = JSON.stringify(advanced);
  vm.runInContext('appState.running = false;', context);
  context.renderTofuShopLivingScene(advanced);
  assert.strictEqual(JSON.stringify(advanced), beforeRender);

  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  const sceneSource = source.slice(
    source.indexOf('function getSceneAsset'),
    source.indexOf('function selectedSoundPack'),
  ).toLowerCase();
  const sceneThresholdSource = source.slice(
    source.indexOf('function sceneFulfilledOrderCount'),
    source.indexOf('function getTofuShopSceneState'),
  );
  assert(!sceneThresholdSource.includes('normalizeGameState('));
  assert(!sceneSource.includes('aria-live'));
  assert(!sceneSource.includes('setinterval'));
  assert(!sceneSource.includes('addeventlistener'));
  assert(!sceneSource.includes('requestanimationframe'));
  [
    'navigator.geolocation',
    'routetrace',
    'street',
    'speed',
    'distance',
    'fetch(',
    'xmlhttprequest',
    'sendbeacon',
    'serviceworker',
  ].forEach((forbidden) => assert(!sceneSource.includes(forbidden), `scene code should not include ${forbidden}`));

  context.artSceneState = advanced;
  vm.runInContext(`
appState.running = false;
appState.calibrating = false;
function makeNode() {
  const node = {
    textContent: "",
    innerHTML: "",
    disabled: null,
    dataset: {},
    value: "",
    classListValue: null,
  };
  node.classList = {
    toggle(_className, hidden) {
      node.classListValue = Boolean(hidden);
    },
    add() {},
    remove() {},
  };
  node.querySelector = () => null;
  return node;
}
elements = {
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopReach: makeNode(),
  shopSpirit: makeNode(),
  shopLicenseStars: makeNode(),
  shopBuyMultiplier: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopInlineResult: makeNode(),
  packTofuButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderButton: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  deliveryWallGrid: makeNode(),
  shopOfflineEarnings: makeNode(),
};
appState.shopTab = "overview";
renderTofuShop(artSceneState);
globalThis.livingSceneOverviewHtml = elements.shopTabPanel.innerHTML;
appState.running = true;
renderTofuShop(artSceneState);
globalThis.livingSceneActiveHtml = elements.shopTabPanel.innerHTML;
`, context);
  assert(context.livingSceneOverviewHtml.includes('nospill-shop-scene'));
  assert(context.livingSceneOverviewHtml.includes('data-scene-id="scene_busy_shop_established"'));
  assert(!context.livingSceneOverviewHtml.includes('data-scene-layer='));
  assert(!context.livingSceneOverviewHtml.includes('Delivery Shelf art pending'));
  assert(!context.livingSceneActiveHtml.includes('nospill-shop-scene'));
}

function testCharacterAndSoundUnlocksAreLocalCosmeticAndPersisted() {
  const localStorage = makeLocalStorage();
  const context = loadNoSpillContext({ window: { localStorage } });
  const firstState = context.defaultGameState();
  assert.strictEqual(firstState.collection.selectedSoundPackId, 'default');
  assert(firstState.collection.unlockedSoundPackIds.includes('default'));
  assert.strictEqual(firstState.collection.unlockedCharacterIds.length, 0);

  const firstDelivery = context.calculateDeliveryRewards(sampleDeliverySession({
    date: '2026-06-14T12:00:00.000Z',
    waterLeft: 92,
  }), firstState);
  assert(firstDelivery.gameState.collection.unlockedCharacterIds.includes('angry_tofu_driver'));
  assert(firstDelivery.gameState.collection.unlockedSoundPackIds.includes('retro_arcade'));

  const sleepyState = context.defaultGameState();
  sleepyState.shop.reputation = 150;
  sleepyState.shop.shopLevel = context.getShopLevel(150);
  const sleepyUnlock = context.evaluateCollectionUnlocks(
    sampleDeliverySession({ waterLeft: 88 }),
    {},
    sleepyState,
  );
  assert(sleepyUnlock.gameState.collection.unlockedCharacterIds.includes('sleepy_dispatcher'));
  assert(sleepyUnlock.gameState.collection.unlockedSoundPackIds.includes('tofu_shop_bell'));

  const hotTeaDate = findDailyDeliveryDate(context, 'hot_tea');
  const hotTeaUnlock = context.calculateDeliveryRewards(sampleDeliverySession({
    date: `${hotTeaDate}T12:00:00.000Z`,
    waterLeft: 91,
    lateralJerk: 0,
    harshLateral: 0,
  }), context.defaultGameState());
  assert(hotTeaUnlock.gameState.collection.unlockedCharacterIds.includes('tea_master'));

  const perfectUnlock = context.calculateDeliveryRewards(sampleDeliverySession({
    waterLeft: 100,
    durationSeconds: 900,
    distanceMiles: 6,
  }), context.defaultGameState());
  assert(perfectUnlock.gameState.collection.unlockedCharacterIds.includes('perfect_pour_courier'));
  assert(perfectUnlock.gameState.collection.unlockedSoundPackIds.includes('perfect_pour_chime'));

  const selectedCharacter = context.selectCharacter('angry_tofu_driver', firstDelivery.gameState);
  assert.strictEqual(selectedCharacter.ok, true);
  context.saveGameState(selectedCharacter.gameState);
  const reloadedCharacter = loadNoSpillContext({ window: { localStorage } });
  assert.strictEqual(reloadedCharacter.loadGameState().collection.selectedCharacterId, 'angry_tofu_driver');

  const soundState = selectedCharacter.gameState;
  soundState.collection.unlockedSoundPackIds.push('retro_arcade');
  const selectedSound = context.selectSoundPack('retro_arcade', soundState);
  assert.strictEqual(selectedSound.ok, true);
  context.saveGameState(selectedSound.gameState);
  const reloadedSound = loadNoSpillContext({ window: { localStorage } });
  assert.strictEqual(reloadedSound.loadGameState().collection.selectedSoundPackId, 'retro_arcade');

  const activeCharacter = context.selectCharacter('angry_tofu_driver', firstDelivery.gameState, {
    activeDrive: true,
  });
  assert.strictEqual(activeCharacter.ok, false);
  const activeSound = context.selectSoundPack('default', firstDelivery.gameState, {
    activeDrive: true,
  });
  assert.strictEqual(activeSound.ok, false);

  assert.strictEqual(
    context.previewSoundPack(firstDelivery.gameState, { userGesture: false }).reason,
    'needs-user-gesture',
  );
  assert.strictEqual(
    context.playCosmeticSound('unlock', firstDelivery.gameState, {
      audioLevel: 'muted',
      audioEnabled: true,
    }).reason,
    'muted',
  );
  assert.strictEqual(
    context.playCosmeticSound('unlock', firstDelivery.gameState, {
      activeDrive: true,
      audioLevel: 'normal',
      audioEnabled: true,
    }).reason,
    'active-drive',
  );

  const slow = context.calculateDeliveryRewards(sampleDeliverySession({
    averageMovingSpeedMph: 18,
    medianMovingSpeedMph: 17,
    waterLeft: 96,
  }), context.defaultGameState());
  const fast = context.calculateDeliveryRewards(sampleDeliverySession({
    averageMovingSpeedMph: 78,
    medianMovingSpeedMph: 74,
    waterLeft: 96,
  }), context.defaultGameState());
  assert.strictEqual(
    JSON.stringify(slow.gameState.collection.unlockedCharacterIds),
    JSON.stringify(fast.gameState.collection.unlockedCharacterIds),
  );
  assert.strictEqual(
    JSON.stringify(slow.gameState.collection.unlockedSoundPackIds),
    JSON.stringify(fast.gameState.collection.unlockedSoundPackIds),
  );

  assertNoSensitiveStorageData(fast.gameState.collection);
}

function testDeliverySimulatorIsHiddenLocalAndSummarized() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(html.includes('id="simulator-panel"'));
  assert(html.includes('nospill-simulator is-hidden'));

  const defaultContext = loadNoSpillContext({
    window: { location: { search: '' }, localStorage: makeLocalStorage() },
  });
  assert.strictEqual(defaultContext.isSimulatorEnabled(), false);

  const queryContext = loadNoSpillContext({
    window: { location: { search: '?simulator=1' }, localStorage: makeLocalStorage() },
  });
  assert.strictEqual(queryContext.isSimulatorEnabled(), true);

  const flagContext = loadNoSpillContext({
    window: {
      location: { search: '' },
      localStorage: makeLocalStorage({ tofuDriverSimulatorEnabled: 'true' }),
    },
  });
  assert.strictEqual(flagContext.isSimulatorEnabled(), true);

  vm.runInContext(`
globalThis.simulatorHiddenStates = [];
elements = {
  simulatorPanel: {
    classList: {
      toggle(name, value) {
        if (name === "is-hidden") globalThis.simulatorHiddenStates.push(value);
      },
    },
  },
  simulatorScenarioSelect: { options: [], innerHTML: "" },
  applySimulatorButton: { disabled: null, textContent: "" },
  simulatorStatus: { textContent: "" },
};
appState.running = false;
appState.calibrating = false;
appState.surface = "cup-test";
renderSimulatorPanel();
globalThis.simulatorSelectHtml = elements.simulatorScenarioSelect.innerHTML;
appState.running = true;
renderSimulatorPanel();
`, queryContext);
  assert.strictEqual(JSON.stringify(queryContext.simulatorHiddenStates), JSON.stringify([false, true]));
  assert(queryContext.simulatorSelectHtml.includes('Smooth Commute'));
  assert(queryContext.simulatorSelectHtml.includes('Perfect Pour'));

  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(!String(queryContext.applySimulatedDelivery).includes('startLocationWatch'));
  assert(!String(queryContext.applySimulatedDelivery).includes('requestMotionPermission'));
  assert(!String(queryContext.buildSimulatedSessionSummary).includes('DeviceMotionEvent'));
  assert(!source.includes('fetch('));
  assert(!source.includes('XMLHttpRequest'));
  assert(!source.includes('sendBeacon'));

  const summary = queryContext.buildSimulatedSessionSummary(
    'smooth_commute',
    new Date('2026-06-14T12:00:00.000Z'),
  );
  assert.strictEqual(summary.simulated, true);
  assert.strictEqual(summary.mode, 'simulated');
  assert.strictEqual(summary.qualificationStatus, 'qualified');
  assert.strictEqual(summary.simulatorExcludeMerch, true);
  assertNoSensitiveStorageData(summary);
}

function testDeliverySimulatorAppliesLocalProgressAndSafeShareLabels() {
  const context = loadNoSpillContext({
    window: { location: { search: '?simulator=1' }, localStorage: makeLocalStorage() },
  });

  const smooth = context.applySimulatedDelivery(
    'smooth_commute',
    context.defaultGameState(),
    { now: new Date('2026-06-14T12:00:00.000Z') },
  );
  assert.strictEqual(smooth.summary.simulated, true);
  assert(smooth.rewards.xpGained > 0);
  assert(smooth.rewards.shop.tofuStockGained > 0);
  assert(smooth.rewards.stamps.includes('first_delivery'));
  assert(smooth.gameState.collection.unlockedCharacterIds.includes('angry_tofu_driver'));
  assert.strictEqual(smooth.gameState.recentSessions[0].simulated, true);

  const perfect = context.applySimulatedDelivery(
    'perfect_pour',
    context.defaultGameState(),
    { now: new Date('2026-06-15T12:00:00.000Z') },
  );
  assert(perfect.rewards.stamps.includes('perfect_pour'));
  assert(perfect.gameState.collection.unlockedCharacterIds.includes('perfect_pour_courier'));
  assert(perfect.gameState.collection.unlockedSoundPackIds.includes('perfect_pour_chime'));
  assert.strictEqual(perfect.gameState.merchProgress.perfectPourDrop.unlocked, false);

  const perfectWithMerch = context.applySimulatedDelivery(
    'perfect_pour',
    context.defaultGameState(),
    { now: new Date('2026-06-15T12:00:00.000Z'), excludeMerch: false },
  );
  assert.strictEqual(perfectWithMerch.gameState.merchProgress.perfectPourDrop.unlocked, true);

  const hotTea = context.applySimulatedDelivery(
    'hot_tea_90',
    context.defaultGameState(),
    { now: new Date('2026-06-16T12:00:00.000Z') },
  );
  assert(hotTea.gameState.collection.unlockedCharacterIds.includes('tea_master'));

  const shaky = context.applySimulatedDelivery(
    'shaky_practice',
    context.defaultGameState(),
    { now: new Date('2026-06-17T12:00:00.000Z') },
  );
  assert.strictEqual(shaky.summary.qualificationStatus, 'practice');
  assert(!shaky.rewards.stamps.includes('perfect_pour'));
  assert.strictEqual(shaky.gameState.merchProgress.nospillClubGear.count, 0);
  assert.strictEqual(shaky.gameState.merchProgress.perfectPourDrop.unlocked, false);

  const shareText = context.buildShareText(smooth.summary);
  assert(shareText.includes('Simulated Delivery'));
  const payload = context.buildDeliverySharePayload(smooth.summary, smooth.rewards, smooth.gameState);
  assert.strictEqual(payload.status, 'Simulated Delivery');
  assert(!/\b(?:speed|mph|gps|map|street|trace|location|lat|lon|fastest|high-g)\b/i.test(shareText));
  assert(!/\b(?:mi|miles?|km|kilometers?)\b/i.test(shareText));
  assert(!shareText.includes('cavrino.com/nospill'));
  assert(!shareText.includes('Super Cute Collectibles'));
  assert(!shareText.includes('discord.gg'));
}

function testUnlockShelvesStayOutOfMainShopUi() {
  const context = loadNoSpillContext();
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(!html.includes('delivery-wall-title'));
  assert(!html.includes('Delivery Wall'));
  assert(!html.includes('Shop Unlocks'));
  assert(!html.includes('Certified Delivery Unlocks'));
  vm.runInContext(`
elements = { deliveryWallGrid: { innerHTML: "" } };
const lockedState = defaultGameState();
renderDeliveryWall(lockedState);
globalThis.lockedWallHtml = elements.deliveryWallGrid.innerHTML;
const unlockedState = defaultGameState();
unlockedState.merchProgress.nospillClubGear.count = 3;
unlockedState.merchProgress.nospillClubGear.unlocked = true;
renderDeliveryWall(unlockedState);
globalThis.unlockedWallHtml = elements.deliveryWallGrid.innerHTML;
`, context);

  assert.strictEqual(context.lockedWallHtml, '');
  assert.strictEqual(context.unlockedWallHtml, '');
}

function testShareOutputIncludesDeliveryLayerAndExcludesSensitiveDetails() {
  const context = loadNoSpillContext();
  const summary = sampleShareSummary({
    routeType: 'City Delivery',
    deliveryStamps: ['passenger_approved'],
    averageMovingSpeedMph: 40,
    medianMovingSpeedMph: 35,
  });
  const text = context.buildShareText(summary);
  assert(text.includes('Tofu Driver'));
  assert(text.includes('Delivery Complete'));
  assert(text.includes('Cargo Condition: 97.4%'));
  assert(text.includes('Rank: No-Spill Club'));
  assert(text.includes('Drive Shape: Winding Pour'));
  assert(text.includes('Stamp: Passenger Approved'));
  assert(!/speed|mph|gps|map|street|trace|location|lat|lon|fastest|high-g/i.test(text));
  assert(!/\b(?:mi|miles?|km|kilometers?)\b/i.test(text));
  assert(!text.includes('cavrino.com/nospill'));
  assert(!text.includes('Super Cute Collectibles'));
  assert(!text.includes('supercutecollectibles.com'));
  assert(!text.includes('discord.gg'));

  const withCrewRewards = context.calculateDeliveryRewards(sampleDeliverySession({
    waterLeft: 94,
  }), context.defaultGameState());
  const crewText = context.buildShareText({
    ...summary,
    deliveryRewards: withCrewRewards,
    deliveryStamps: withCrewRewards.stamps,
    routeType: withCrewRewards.routeType,
  });
  assert(crewText.includes('Delivery Crew: Angry Tofu Driver.'));
  assert(!crewText.includes('Retro Arcade'));
  assert(!crewText.includes('Tofu Shop Bell'));
}

function testShopOrderFulfillmentStaysInlineAndKeepsFanfare() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(html.includes('id="shop-inline-result"'));
  assert(html.includes('id="share-card-section"'));
  assert(html.includes('onload="this.nextElementSibling.hidden = true;"'));
  assert(html.includes('class="nospill-hero-fallback" hidden>Tofu Driver</span>'));

  const context = loadNoSpillContext({
    window: { localStorage: makeLocalStorage() },
  });
  vm.runInContext(`
function makeNode() {
  const node = {
    textContent: "",
    innerHTML: "",
    disabled: null,
    dataset: {},
    classes: new Set(),
    focused: false,
  };
  node.classList = {
    toggle(name, value) {
      if (value) node.classes.add(name);
      else node.classes.delete(name);
    },
    add(name) { node.classes.add(name); },
    remove(name) { node.classes.delete(name); },
    contains(name) { return node.classes.has(name); },
  };
  node.focus = function focusNode() { node.focused = true; };
  return node;
}
const state = defaultGameState();
state.shop.deliveryOrders = 2;
state.shop.tofuStock = 30;
state.shop.tips = 5;
state.shop.reputation = 2;
saveGameState(state);
elements = {
  surfaceNavButtons: [],
  surfaceSections: [],
  deliveryBoardSection: makeNode(),
  tofuShopSection: makeNode(),
  collectionSection: makeNode(),
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopDeliveryOrders: makeNode(),
  shopTips: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  shopOrderRate: makeNode(),
  shopTipsRate: makeNode(),
  shopReputationRate: makeNode(),
  shopSpiritRate: makeNode(),
  shopPrepStatus: makeNode(),
  shopPrepSlots: makeNode(),
  shopReach: makeNode(),
  shopSpirit: makeNode(),
  shopLicenseStars: makeNode(),
  shopBuyMultiplier: makeNode(),
  packTofuButton: makeNode(),
  fulfillShopOrderButton: makeNode(),
  packTofuHelper: makeNode(),
  fulfillShopOrderHelper: makeNode(),
  shopTabList: makeNode(),
  shopTabPanel: makeNode(),
  shopInlineResult: makeNode(),
  shopOfflineEarnings: makeNode(),
  deliveryWallGrid: makeNode(),
  summaryView: makeNode(),
  summaryStatusLabel: makeNode(),
  summaryTitle: makeNode(),
  summaryWater: makeNode(),
  returnDashboardButton: makeNode(),
  newRunButton: makeNode(),
  backSimulatorButton: makeNode(),
  routeContext: makeNode(),
  deliverySummaryGrid: makeNode(),
  commuteMasteryCopy: makeNode(),
  shareCardSection: makeNode(),
  shareButton: makeNode(),
  copyButton: makeNode(),
  downloadButton: makeNode(),
  saveButton: makeNode(),
  stampFanfare: makeNode(),
  stampFanfareCard: makeNode(),
  stampFanfareTitle: makeNode(),
  stampFanfareName: makeNode(),
  stampFanfareCopy: makeNode(),
  stampFanfareRewards: makeNode(),
  discoveryFanfare: makeNode(),
};
showView = function showViewForShopResult(viewName) {
  globalThis.shopResultShownView = viewName;
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
appState.shopTab = "overview";
renderTofuShop(state);
globalThis.inlineTabsBefore = elements.shopTabList.innerHTML;
const firstButton = { dataset: { fulfillOrders: "1", orderType: "simple_tofu_box" } };
handleTofuShopPanelClick({ target: { closest: () => firstButton } });
const afterFirst = loadGameState();
globalThis.inlineTipsAfterFirst = afterFirst.shop.tips;
globalThis.inlineRepAfterFirst = afterFirst.shop.reputation;
globalThis.inlineShopXpAfterFirst = afterFirst.shop.shopXP;
globalThis.inlineDriverXpAfterFirst = afterFirst.totalXP;
globalThis.inlineStockAfterFirst = afterFirst.shop.tofuStock;
globalThis.inlineOrdersAfterFirst = afterFirst.shop.deliveryOrders;
globalThis.inlineMessageAfterFirst = elements.shopInlineResult.textContent;
globalThis.inlinePanelAfterFirst = elements.shopTabPanel.innerHTML;
globalThis.inlineTabAfterFirst = appState.shopTab;
globalThis.inlineSummaryView = globalThis.shopResultShownView || "";
globalThis.inlineSummaryMode = appState.summaryMode || "";
globalThis.inlineStampShown = !elements.stampFanfare.classes.has("is-hidden");
globalThis.inlineStampTitle = elements.stampFanfareTitle.textContent;
globalThis.inlineStampName = elements.stampFanfareName.textContent;
hideStampFanfare();
const second = loadGameState();
second.shop.deliveryOrders = 4;
second.shop.tofuStock = 100;
second.shop.lifetimeDeliveryOrders = 5;
saveGameState(second);
const maxButton = { dataset: { fulfillOrders: "max", orderType: "family_tofu_tray" } };
handleTofuShopPanelClick({ target: { closest: () => maxButton } });
const afterMax = loadGameState();
globalThis.inlineTipsAfterMax = afterMax.shop.tips;
globalThis.inlineMessageAfterMax = elements.shopInlineResult.textContent;
globalThis.inlineTabAfterMax = appState.shopTab;
globalThis.inlineSummaryAfterMax = globalThis.shopResultShownView || "";
globalThis.inlineStampHiddenAfterMax = elements.stampFanfare.classes.has("is-hidden");
`, context);

  assert(!context.inlineTabsBefore.includes('>Orders<'));
  assert.strictEqual(context.inlineTipsAfterFirst, 15);
  assert.strictEqual(context.inlineRepAfterFirst, 3);
  assert.strictEqual(context.inlineShopXpAfterFirst, 8);
  assert.strictEqual(context.inlineDriverXpAfterFirst, 0);
  assert.strictEqual(context.inlineStockAfterFirst, 24);
  assert.strictEqual(context.inlineOrdersAfterFirst, 1);
  assert.strictEqual(context.inlineTabAfterFirst, 'overview');
  assert.strictEqual(context.inlineSummaryView, '');
  assert.strictEqual(context.inlineSummaryMode, '');
  assert(context.inlinePanelAfterFirst.includes('Overview'));
  assert(context.inlinePanelAfterFirst.includes('Simple Tofu Box'));
  assert(context.inlineMessageAfterFirst.includes('Simple Tofu Box complete: +$10 from tips, +1 Reputation, +8 Shop XP'));
  assert.strictEqual(context.inlineStampShown, true);
  assert.strictEqual(context.inlineStampTitle, 'First Stamp Earned');
  assert.strictEqual(context.inlineStampName, 'First Shop Order');
  assert.strictEqual(context.inlineTipsAfterMax, 195);
  assert.strictEqual(context.inlineTabAfterMax, 'overview');
  assert.strictEqual(context.inlineSummaryAfterMax, '');
  assert(context.inlineMessageAfterMax.includes('Family Tofu Tray x4 complete: +$180 from tips, +12 Reputation, +96 Shop XP'));
  assert.strictEqual(context.inlineStampHiddenAfterMax, true);
}

function testResultScreenShowsGameSummarySections() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(html.includes('id="delivery-summary-grid"'));
  assert(html.includes('id="summary-title"'));
  assert(html.includes('Result Details'));
  assert(html.includes('id="return-dashboard-button"'));
  assert(html.includes('Return to Tofu Garage'));
  assert(html.includes('id="new-run-button"'));
  assert(html.includes('Take Another Cup Test'));
  assert(html.includes('id="back-simulator-button"'));
  assert(html.indexOf('id="return-dashboard-button"') < html.indexOf('id="new-run-button"'));
  assert(html.indexOf('id="new-run-button"') < html.indexOf('id="share-button"'));
  assert(source.includes('returnDashboardButton.addEventListener("click"'));
  assert(source.includes('backSimulatorButton.addEventListener("click"'));
  assert(source.includes('function returnToDashboard'));
  assert(source.includes('"Visit Tofu Garage"'));
  const summaryStart = html.indexOf('id="summary-view"');
  const summaryEnd = html.indexOf('id="landing-view"', summaryStart + 1);
  const summaryHtml = html.slice(summaryStart, summaryEnd > summaryStart ? summaryEnd : undefined);
  assert(!summaryHtml.includes('id="summary-grid"'));
  assert(!summaryHtml.includes('id="milestone-output"'));
  assert(!summaryHtml.includes('id="merch-grid"'));
  assert.strictEqual((summaryHtml.match(/Delivery Complete/g) || []).length, 0);
  [
    '"Cargo Condition"',
    '"Driver XP Gained"',
    '"Skill XP Gained"',
    '"Stamp Earned"',
    '"Daily Delivery Result"',
    '"Delivery Crew"',
    '"Selected Crew"',
    '"New Unlock"',
    '"Shop Rewards"',
    '"No-Spill Club Gear"',
    '"Next Delivery Goal"',
    '"No new stamp"',
  ].forEach((needle) => assert(source.includes(needle), `${needle} missing`));
}

function testPostRunNavigationReturnsToUpdatedDashboard() {
  const context = loadNoSpillContext({
    window: { location: { search: '?simulator=1' }, localStorage: makeLocalStorage() },
  });
  vm.runInContext(`
function makeNode(id) {
  const node = {
    id,
    textContent: "",
    innerHTML: "",
    disabled: null,
    hidden: false,
    dataset: {},
    scrolled: false,
    focused: false,
    revealed: false,
  };
  node.classList = {
    contains() { return false; },
    remove() { node.revealed = true; },
    toggle(_className, hidden) { node.hidden = Boolean(hidden); },
  };
  node.scrollIntoView = function scrollIntoView() {
    node.scrolled = true;
  };
  node.focus = function focus() {
    node.focused = true;
  };
  return node;
}
const savedState = defaultGameState();
savedState.totalXP = 240;
savedState.shop.tofuStock = 42;
savedState.shop.reputation = 18;
savedState.recentSessions = [{ dateKey: "2026-06-14", cargoCondition: 92 }];
savedState.stamps.first_delivery = { label: "First Delivery", date: "2026-06-14T12:00:00.000Z" };
elements = {
  landingView: makeNode("landing"),
  runView: makeNode("run"),
  unsupportedView: makeNode("unsupported"),
  summaryView: makeNode("summary"),
  setupFlow: makeNode("setup"),
  tofuShopSection: makeNode("shop"),
  tofuGarageActions: makeNode("actions"),
  simulatorPanel: makeNode("simulator"),
  cupCanvas: null,
};
loadGameState = function loadGameStateForTest() { return savedState; };
loadGameStateWithOfflineShopEarnings = function loadGameStateWithOfflineShopEarningsForTest() {
  return savedState;
};
renderMountControls = function renderMountControlsForTest() {};
renderAudioLevelControls = function renderAudioLevelControlsForTest() {};
renderGamePanels = function renderGamePanelsForTest(state) {
  globalThis.returnRenderedXP = state.totalXP;
  globalThis.returnRenderedStock = state.shop.tofuStock;
  globalThis.returnRenderedReputation = state.shop.reputation;
};
drawCupCanvas = function drawCupCanvasForTest() {};
showView = function showViewForTest(viewName) {
  globalThis.returnShownView = viewName;
};
setLandingStatus = function setLandingStatusForTest(message) {
  globalThis.returnLandingStatus = message;
};
appState.lastSummary = { cargoCondition: 92 };
returnToDashboard("shop");
globalThis.returnPreservedSummary = Boolean(appState.lastSummary);
globalThis.returnScrolledShop = elements.tofuShopSection.scrolled;
globalThis.returnScrolledActions = elements.tofuGarageActions.scrolled;
globalThis.returnFocusedActions = elements.tofuGarageActions.focused;
globalThis.returnFirstLandingStatus = globalThis.returnLandingStatus;
returnToDashboard("simulator");
globalThis.returnScrolledSimulator = elements.simulatorPanel.scrolled;
takeAnotherCupTest();
globalThis.takeAnotherClearedSummary = appState.lastSummary === null;
globalThis.takeAnotherRevealedSetup = elements.setupFlow.revealed && elements.setupFlow.scrolled;
`, context);

  assert.strictEqual(context.returnShownView, 'landing');
  assert.strictEqual(context.returnRenderedXP, 240);
  assert.strictEqual(context.returnRenderedStock, 42);
  assert.strictEqual(context.returnRenderedReputation, 18);
  assert.strictEqual(context.returnPreservedSummary, true);
  assert.strictEqual(context.returnScrolledShop, false);
  assert.strictEqual(context.returnScrolledActions, true);
  assert.strictEqual(context.returnFocusedActions, true);
  assert.strictEqual(context.returnScrolledSimulator, true);
  assert.strictEqual(context.returnFirstLandingStatus, 'Review your rewards. The shop has been updated.');
  assert.strictEqual(context.returnLandingStatus, 'Review setup, then start while parked.');
  assert.strictEqual(context.takeAnotherClearedSummary, true);
  assert.strictEqual(context.takeAnotherRevealedSetup, true);
}

function testLocationPermissionFlowRemainsOptIn() {
  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(source.includes('if (appState.mode === "qualified") startLocationWatch();'));
  assert(!source.includes('if (appState.mode === "basic") startLocationWatch();'));
  assert(source.includes('Basic Mode does not use location.'));
  assert(source.includes('Qualified Run is opt-in.'));
}

function testPrivateQualifiedSummaryMayShowDistance() {
  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(source.includes('summaryMetric("Verified Distance"'));
  assert(source.includes('summary.distanceMiles.toFixed(2)'));
}

function assertAlmostEqual(actual, expected, message) {
  assert(Math.abs(actual - expected) < 0.000001, message);
}

function testMountAxisMapping() {
  const context = loadNoSpillContext();
  const sample = { x: 1, y: 2, z: 3 };

  const flat = context.mapAccelerationToVehicle(sample, { mode: 'flat' });
  assert.strictEqual(flat.lateral, 1);
  assert.strictEqual(flat.longitudinal, 2);

  const upright = context.mapAccelerationToVehicle(sample, { mode: 'upright' });
  assert.strictEqual(upright.lateral, 1);
  assert.strictEqual(upright.longitudinal, 3);

  const custom = context.mapAccelerationToVehicle(sample, {
    mode: 'custom',
    lateralAxis: 'z',
    lateralInvert: true,
    longitudinalAxis: 'x',
    longitudinalInvert: true,
  });
  assert.strictEqual(custom.lateral, -3);
  assert.strictEqual(custom.longitudinal, -1);
}

function testMappedMotionUsesSelectedMountConfig() {
  const context = loadNoSpillContext();
  const oneG = 9.80665;
  const flat = context.computeMappedMotion(
    { x: 0, y: oneG, z: 0 },
    null,
    { mode: 'flat' },
    1 / 60,
  );
  assertAlmostEqual(flat.lateralG, 0, 'flat lateral should use device x');
  assertAlmostEqual(flat.longitudinalG, 1, 'flat longitudinal should use device y');

  const upright = context.computeMappedMotion(
    { x: 0, y: 0, z: oneG },
    null,
    { mode: 'upright' },
    1 / 60,
  );
  assertAlmostEqual(upright.lateralG, 0, 'upright lateral should use device x');
  assertAlmostEqual(upright.longitudinalG, 1, 'upright longitudinal should use device z');

  const custom = context.computeMappedMotion(
    { x: oneG, y: 0, z: oneG / 2 },
    null,
    {
      mode: 'custom',
      lateralAxis: 'z',
      lateralInvert: true,
      longitudinalAxis: 'x',
      longitudinalInvert: false,
    },
    1 / 60,
  );
  assertAlmostEqual(custom.lateralG, -0.5, 'custom lateral should support axis inversion');
  assertAlmostEqual(custom.longitudinalG, 1, 'custom longitudinal should use selected axis');
}

function testRunMotionPathUsesSharedAxisMapping() {
  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(source.includes('const mappedMotion = computeMappedMotion('));
  assert(source.includes('appState.mountConfig'));
  assert(!source.includes('const lateralG = appState.filteredAcceleration.x'));
  assert(!source.includes('const longitudinalG = appState.filteredAcceleration.y'));
}

function testTofuCargoVisualizationReplacesGenericGDot() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(html.includes('Animated tofu cargo smoothness visualization'));
  assert(html.includes('Tofu cargo moves with your driving smoothness.'));
  assert(source.includes('function updateTofuCargoVisualState'));
  assert(source.includes('/static/nospill/images/tofu-driver-app-image.png'));
  assert(source.includes('getTofuCargoMascotImage'));
  assert(source.includes('drawImage('));
  assert(source.includes('drawFallbackTofuCargoMascot'));
  assert(source.includes('tofuX'));
  assert(source.includes('lateralG'));
  assert(source.includes('longitudinalG'));
  assert(source.includes('Cargo Condition'));
  assert(source.includes('context.ellipse(0, tofuHeight * 0.64'));
  assert(source.includes('tofuWidth * 0.32'));
  assert(!source.includes('/mnt/c/Users/kenne/Downloads'));
  assert(!html.includes('Virtual cup G-ball visualization'));
  assert(!source.includes('Spill ring'));
  assert(!source.includes('dotX'));
  assert(!source.includes('dotY'));
  assert(!source.includes('waterArc'));
  assert(!source.includes('trayX + 58'));
}

function testTofuCargoVisualizationUsesMotionNotSpeed() {
  const context = loadNoSpillContext();
  const visualA = context.updateTofuCargoVisualState(
    context.defaultTofuVisualState(),
    { lateralG: 0.18, longitudinalG: -0.1, totalG: 0.21, jerk: 0.4 },
    { thresholdG: 0.3, maxOffset: 100, frame: 1 },
  );
  const visualB = context.updateTofuCargoVisualState(
    context.defaultTofuVisualState(),
    {
      lateralG: 0.18,
      longitudinalG: -0.1,
      totalG: 0.21,
      jerk: 0.4,
      averageMovingSpeedMph: 90,
    },
    { thresholdG: 0.3, maxOffset: 100, frame: 1 },
  );
  assert.strictEqual(visualA.tofuX, visualB.tofuX);
  assert.strictEqual(visualA.tofuY, visualB.tofuY);
  assert.strictEqual(visualA.tofuRotation, visualB.tofuRotation);

  const visualC = context.updateTofuCargoVisualState(
    context.defaultTofuVisualState(),
    { lateralG: -0.18, longitudinalG: 0.1, totalG: 0.21, jerk: 0.4 },
    { thresholdG: 0.3, maxOffset: 100, frame: 1 },
  );
  assert.notStrictEqual(visualA.tofuX, visualC.tofuX);
  assert.notStrictEqual(visualA.tofuY, visualC.tofuY);

  const reduced = context.updateTofuCargoVisualState(
    context.defaultTofuVisualState(),
    { lateralG: 0.6, longitudinalG: 0.6, totalG: 0.8, jerk: 3 },
    { thresholdG: 0.3, maxOffset: 100, reducedMotion: true, frame: 20 },
  );
  assert.strictEqual(reduced.recentSpillParticles.length, 0);
}

function testAudioVolumeGainModel() {
  const context = loadNoSpillContext();
  const muted = context.computeAudioTargetGain({
    totalG: 0,
    thresholdG: 0.3,
    audioLevel: 'muted',
    audioEnabled: true,
  });
  const normal = context.computeAudioTargetGain({
    totalG: 0,
    thresholdG: 0.3,
    audioLevel: 'normal',
    audioEnabled: true,
  });
  const loud = context.computeAudioTargetGain({
    totalG: 0,
    thresholdG: 0.3,
    audioLevel: 'loud',
    audioEnabled: true,
  });
  assert.strictEqual(muted, 0);
  assert(normal < loud);
  assert(normal > 0.055, 'normal low-G gain should exceed the previous max output');
  assert(loud > normal);

  const loudHarsh = context.computeAudioTargetGain({
    totalG: 3,
    thresholdG: 0.3,
    audioLevel: 'loud',
    audioEnabled: true,
  });
  assert.strictEqual(loudHarsh, 0.45);

  const normalHarsh = context.computeAudioTargetGain({
    totalG: 3,
    thresholdG: 0.3,
    audioLevel: 'normal',
    audioEnabled: true,
  });
  assert.strictEqual(normalHarsh, 0.3);

  const toggledOff = context.computeAudioTargetGain({
    totalG: 3,
    thresholdG: 0.3,
    audioLevel: 'loud',
    audioEnabled: false,
  });
  assert.strictEqual(toggledOff, 0);
}

function testAudioVolumePersistsInLocalStorageState() {
  const localStorage = makeLocalStorage();
  const context = loadNoSpillContext({ window: { localStorage } });
  const state = context.loadClubState();
  state.audioLevel = 'loud';
  context.saveClubState(state);

  const stored = JSON.parse(localStorage.getItem(context.STORAGE_KEY));
  assert.strictEqual(stored.audioLevel, 'loud');
  assert.deepStrictEqual(stored.savedSessions, []);
  assert.strictEqual(context.loadClubState().audioLevel, 'loud');

  const invalidState = context.loadClubState();
  invalidState.audioLevel = 'invalid';
  context.saveClubState(invalidState);
  assert.strictEqual(context.loadClubState().audioLevel, 'normal');

  const legacyState = context.loadClubState();
  legacyState.audioLevel = 'quiet';
  context.saveClubState(legacyState);
  assert.strictEqual(context.loadClubState().audioLevel, 'normal');
}

function testWaterRanksAndLossAreMotionOnly() {
  const context = loadNoSpillContext();
  assert.strictEqual(context.rankForWater(100), 'Perfect Pour');
  assert.strictEqual(context.rankForWater(97.4), 'No-Spill Club');
  assert.strictEqual(context.rankForWater(82), 'Smooth Driver');
  assert.strictEqual(context.rankForWater(62), 'Half Cup Hero');
  assert.strictEqual(context.rankForWater(49.9), 'Floor Mat Casualty');
  assert.strictEqual(
    context.computeWaterLoss({
      totalG: 0.24,
      thresholdG: 0.3,
      jerk: 0,
      deltaSeconds: 1,
    }),
    0,
  );
  assert(
    context.computeWaterLoss({
      totalG: 0.52,
      thresholdG: 0.3,
      jerk: 1.5,
      deltaSeconds: 1,
    }) > 0,
  );
}

function testQualifiedRouteAnalysisAndQualification() {
  const context = loadNoSpillContext();
  const base = 1_800_000_000_000;
  const route = context.analyzeRoute([
    { lat: 37.7749, lon: -122.4194, accuracy: 12, timestamp: base },
    { lat: 37.7749, lon: -122.4094, accuracy: 12, timestamp: base + 90_000 },
    { lat: 37.7849, lon: -122.4094, accuracy: 12, timestamp: base + 180_000 },
    { lat: 37.7849, lon: -122.4194, accuracy: 12, timestamp: base + 270_000 },
    { lat: 37.7949, lon: -122.4194, accuracy: 12, timestamp: base + 360_000 },
  ]);
  assert(route.totalDistanceMiles >= 1);
  assert(route.significantTurnCount >= 2);
  assert(route.routeDifficultyScore > 0);

  const qualification = context.qualificationForRoute({
    durationSeconds: 360,
    route,
    geoStatus: 'active',
    motion: {
      samples: 360,
      impossibleSpikes: 0,
      orientationSamples: 240,
      orientationUnstableSamples: 0,
    },
  });
  assert.strictEqual(qualification.status, 'qualified');
}

const TESTS = [
  ["testNoSpillIsNotLinkedFromExistingFrontendSurfaces", testNoSpillIsNotLinkedFromExistingFrontendSurfaces],
  ["testNoSitemapOrRobotsRevealNoSpill", testNoSitemapOrRobotsRevealNoSpill],
  ["testNoSpillHtmlUsesNoindexWithoutSocialIndexingMetadata", testNoSpillHtmlUsesNoindexWithoutSocialIndexingMetadata],
  ["testTofuDriverBrandHierarchy", testTofuDriverBrandHierarchy],
  ["testCargoTypeDriveShapeAndCupTrailResultSlice", testCargoTypeDriveShapeAndCupTrailResultSlice],
  ["testCoachRecapV1UsesSafeOutcomeBasedSummary", testCoachRecapV1UsesSafeOutcomeBasedSummary],
  ["testSmoothControlRecapDriveShapeTrailAndDailyCreditFollowup", testSmoothControlRecapDriveShapeTrailAndDailyCreditFollowup],
  ["testFirstTimeGameDashboardIsVisibleBeforeSetup", testFirstTimeGameDashboardIsVisibleBeforeSetup],
  ["testTwoSurfaceRoutingSeparatesShopAndCupTest", testTwoSurfaceRoutingSeparatesShopAndCupTest],
  ["testCupTestMobileMotionSupportDetection", testCupTestMobileMotionSupportDetection],
  ["testProgressiveRevealTeasersUnlockAfterFirstDelivery", testProgressiveRevealTeasersUnlockAfterFirstDelivery],
  ["testTofuShopGeneratorUpgradeUiIsHonestAndProgressive", testTofuShopGeneratorUpgradeUiIsHonestAndProgressive],
  ["testEarlyShopResourceFunnelMakesTipsObvious", testEarlyShopResourceFunnelMakesTipsObvious],
  ["testFractionalDeliveryOrdersShowPrepProgressNotRawDecimal", testFractionalDeliveryOrdersShowPrepProgressNotRawDecimal],
  ["testTofuStockRunwayGuidesEarlyPurchases", testTofuStockRunwayGuidesEarlyPurchases],
  ["testCompactTofuShopNumberFormatting", testCompactTofuShopNumberFormatting],
  ["testShopRecentRewardUsesSafeFallbackLabel", testShopRecentRewardUsesSafeFallbackLabel],
  ["testDriverAndShopProgressionAreSeparated", testDriverAndShopProgressionAreSeparated],
  ["testFirstStampFanfareCelebratesAndPersists", testFirstStampFanfareCelebratesAndPersists],
  ["testStampFanfareReducedMotionUsesStaticState", testStampFanfareReducedMotionUsesStaticState],
  ["testDiscoveryFanfareRevealsUpgradesOnce", testDiscoveryFanfareRevealsUpgradesOnce],
  ["testDiscoveryFanfareReducedMotionUsesStaticState", testDiscoveryFanfareReducedMotionUsesStaticState],
  ["testCoveredCarTeaserIsOneTimeStoryBeatOnly", testCoveredCarTeaserIsOneTimeStoryBeatOnly],
  ["testShopOrderTypeProgressionAndRewards", testShopOrderTypeProgressionAndRewards],
  ["testCoreGameSpineV1MilestonesAndSupportStations", testCoreGameSpineV1MilestonesAndSupportStations],
  ["testTofuShopNextMilestoneBarGuidesImplementedSpine", testTofuShopNextMilestoneBarGuidesImplementedSpine],
  ["testTofuShopStationMilestoneBoostsV1", testTofuShopStationMilestoneBoostsV1],
  ["testCounterServiceV1AutomatesEarnedShopHandoffs", testCounterServiceV1AutomatesEarnedShopHandoffs],
  ["testCounterServicePolishStatsUpgradesAndSpiritPanel", testCounterServicePolishStatsUpgradesAndSpiritPanel],
  ["testTofuGarageHighMidgameSupplyBottleneckBalance", testTofuGarageHighMidgameSupplyBottleneckBalance],
  ["testTofuGarageRoutesSurfaceIsDeferred", testTofuGarageRoutesSurfaceIsDeferred],
  ["testTofuGarageGenerousOfflineProgressV1", testTofuGarageGenerousOfflineProgressV1],
  ["testTofuGarageNetWorthMilestonesAndShowcaseInterestV1", testTofuGarageNetWorthMilestonesAndShowcaseInterestV1],
  ["testTofuGarageHighScalePerformanceGuardrails", testTofuGarageHighScalePerformanceGuardrails],
  ["testTofuGarageManagerDeskV1", testTofuGarageManagerDeskV1],
  ["testTofuGarageBulkBuyingAffordabilityAndUnfoldAudit", testTofuGarageBulkBuyingAffordabilityAndUnfoldAudit],
  ["testTofuGarageCashAndNetWorthV1", testTofuGarageCashAndNetWorthV1],
  ["testNextBestActionHierarchyStaysSinglePrimary", testNextBestActionHierarchyStaysSinglePrimary],
  ["testTofuDriverArtworkIsIsolatedAndAccessible", testTofuDriverArtworkIsIsolatedAndAccessible],
  ["testSuperCuteCollectiblesLandingAndMerchCopy", testSuperCuteCollectiblesLandingAndMerchCopy],
  ["testDiscordCtaConfigAndRendering", testDiscordCtaConfigAndRendering],
  ["testPostHogAnalyticsNoOpsWithoutConfigAndHonorsOptOut", testPostHogAnalyticsNoOpsWithoutConfigAndHonorsOptOut],
  ["testPostHogAnalyticsInitializesWithPrivacyOptions", testPostHogAnalyticsInitializesWithPrivacyOptions],
  ["testAnalyticsSanitizerDropsDangerousKeysAndCampaignsAreSafe", testAnalyticsSanitizerDropsDangerousKeysAndCampaignsAreSafe],
  ["testAnalyticsRouteCupShopAndShareEventsUseSafeProperties", testAnalyticsRouteCupShopAndShareEventsUseSafeProperties],
  ["testNoSpillClientDoesNotUploadRawRunData", testNoSpillClientDoesNotUploadRawRunData],
  ["testNoSpillLiveSummaryAndShareAvoidSensitiveDetails", testNoSpillLiveSummaryAndShareAvoidSensitiveDetails],
  ["testShareConfigAndCardData", testShareConfigAndCardData],
  ["testLockedMerchLinksAreNotShownBeforeUnlock", testLockedMerchLinksAreNotShownBeforeUnlock],
  ["testDailyDeliverySelectionAndEvaluation", testDailyDeliverySelectionAndEvaluation],
  ["testRouteTypeClassification", testRouteTypeClassification],
  ["testDeliveryRewardsDoNotUseSpeedAndRespectMajorUnlockContext", testDeliveryRewardsDoNotUseSpeedAndRespectMajorUnlockContext],
  ["testPracticeModeRewardGatingAndRankCopy", testPracticeModeRewardGatingAndRankCopy],
  ["testPracticeShareOutputIsLabeledAndNotPerfectPour", testPracticeShareOutputIsLabeledAndNotPerfectPour],
  ["testLongHaulDailyXpCapAndMerchProgress", testLongHaulDailyXpCapAndMerchProgress],
  ["testNoSpillClubGearRequiresRepeatedQualifiedDeliveries", testNoSpillClubGearRequiresRepeatedQualifiedDeliveries],
  ["testPerfectPourAndDeliveryCrewProgressRules", testPerfectPourAndDeliveryCrewProgressRules],
  ["testDriverLicensePassportAndCoachRecap", testDriverLicensePassportAndCoachRecap],
  ["testGameStateStorageIsSummaryOnlyAndCommuteMasteryUsesFingerprints", testGameStateStorageIsSummaryOnlyAndCommuteMasteryUsesFingerprints],
  ["testGameProgressPersistsAcrossReloadSimulation", testGameProgressPersistsAcrossReloadSimulation],
  ["testResetExportAndImportProgressAreScopedAndValidated", testResetExportAndImportProgressAreScopedAndValidated],
  ["testTofuShopStatePackIdleAndUpgradeRules", testTofuShopStatePackIdleAndUpgradeRules],
  ["testLiveIdleTickAndShopButtonReliability", testLiveIdleTickAndShopButtonReliability],
  ["testExpandedIdleShopLayerMechanics", testExpandedIdleShopLayerMechanics],
  ["testSettingsTabConsolidatesProgressToolsAndHidesQaByDefault", testSettingsTabConsolidatesProgressToolsAndHidesQaByDefault],
  ["testDeliveryToShopRewardsDoNotUseSpeedAndStaySummaryOnly", testDeliveryToShopRewardsDoNotUseSpeedAndStaySummaryOnly],
  ["testCharacterArtAssetSlotsAndPlaceholders", testCharacterArtAssetSlotsAndPlaceholders],
  ["testTofuShopLivingSceneV1Groundwork", testTofuShopLivingSceneV1Groundwork],
  ["testCharacterAndSoundUnlocksAreLocalCosmeticAndPersisted", testCharacterAndSoundUnlocksAreLocalCosmeticAndPersisted],
  ["testDeliverySimulatorIsHiddenLocalAndSummarized", testDeliverySimulatorIsHiddenLocalAndSummarized],
  ["testDeliverySimulatorAppliesLocalProgressAndSafeShareLabels", testDeliverySimulatorAppliesLocalProgressAndSafeShareLabels],
  ["testUnlockShelvesStayOutOfMainShopUi", testUnlockShelvesStayOutOfMainShopUi],
  ["testShareOutputIncludesDeliveryLayerAndExcludesSensitiveDetails", testShareOutputIncludesDeliveryLayerAndExcludesSensitiveDetails],
  ["testShopOrderFulfillmentStaysInlineAndKeepsFanfare", testShopOrderFulfillmentStaysInlineAndKeepsFanfare],
  ["testResultScreenShowsGameSummarySections", testResultScreenShowsGameSummarySections],
  ["testPostRunNavigationReturnsToUpdatedDashboard", testPostRunNavigationReturnsToUpdatedDashboard],
  ["testLocationPermissionFlowRemainsOptIn", testLocationPermissionFlowRemainsOptIn],
  ["testPrivateQualifiedSummaryMayShowDistance", testPrivateQualifiedSummaryMayShowDistance],
  ["testMountAxisMapping", testMountAxisMapping],
  ["testMappedMotionUsesSelectedMountConfig", testMappedMotionUsesSelectedMountConfig],
  ["testRunMotionPathUsesSharedAxisMapping", testRunMotionPathUsesSharedAxisMapping],
  ["testTofuCargoVisualizationReplacesGenericGDot", testTofuCargoVisualizationReplacesGenericGDot],
  ["testTofuCargoVisualizationUsesMotionNotSpeed", testTofuCargoVisualizationUsesMotionNotSpeed],
  ["testAudioVolumeGainModel", testAudioVolumeGainModel],
  ["testAudioVolumePersistsInLocalStorageState", testAudioVolumePersistsInLocalStorageState],
  ["testWaterRanksAndLossAreMotionOnly", testWaterRanksAndLossAreMotionOnly],
  ["testQualifiedRouteAnalysisAndQualification", testQualifiedRouteAnalysisAndQualification],
];

async function runOneTest(name, fn, index, total) {
  const started = Date.now();
  if (TEST_PROGRESS) console.error(`[test ${index}/${total}] START ${name}`);
  try {
    await fn();
  } catch (error) {
    const elapsed = Date.now() - started;
    console.error(`[test ${index}/${total}] FAIL ${name} ${elapsed}ms`);
    throw error;
  }
  const elapsed = Date.now() - started;
  if (TEST_PROGRESS || elapsed >= TEST_SLOW_MS) {
    const label = elapsed >= TEST_SLOW_MS ? "SLOW" : "PASS";
    console.error(`[test ${index}/${total}] ${label} ${name} ${elapsed}ms`);
  }
}

async function run() {
  const selectedTests = TEST_GREP
    ? TESTS.filter(([name]) => name.toLowerCase().includes(TEST_GREP.toLowerCase()))
    : TESTS;
  if (!selectedTests.length) {
    throw new Error(`No tests matched TEST_GREP=${TEST_GREP}`);
  }
  if (TEST_PROGRESS) {
    console.error(`[test] running ${selectedTests.length}/${TESTS.length} tests${TEST_GREP ? ` matching ${TEST_GREP}` : ""}`);
  }
  const started = Date.now();
  for (const [index, [name, fn]] of selectedTests.entries()) {
    await runOneTest(name, fn, index + 1, selectedTests.length);
  }
  if (TEST_PROGRESS) {
    console.error(`[test] completed ${selectedTests.length} tests in ${Date.now() - started}ms`);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
