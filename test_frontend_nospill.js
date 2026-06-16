const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const NOSPILL_DIR = path.join(ROOT, 'frontend', 'nospill');
const NOSPILL_ASSETS_DIR = path.join(NOSPILL_DIR, 'assets');
const NOSPILL_JS = path.join(NOSPILL_DIR, 'app.js');
const NOSPILL_HTML = path.join(NOSPILL_DIR, 'index.html');

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
  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  const context = {
    console,
    window: options.window || {},
  };
  if (options.navigator) context.navigator = options.navigator;
  if (options.document) context.document = options.document;
  if (options.URLSearchParams) context.URLSearchParams = options.URLSearchParams;
  vm.createContext(context);
  vm.runInContext(
    `${source}
globalThis.rankForWater = rankForWater;
globalThis.computeWaterLoss = computeWaterLoss;
globalThis.computeAudioTargetGain = computeAudioTargetGain;
globalThis.normalizeAudioLevel = normalizeAudioLevel;
globalThis.mapAccelerationToVehicle = mapAccelerationToVehicle;
globalThis.computeMappedMotion = computeMappedMotion;
globalThis.updateTofuCargoVisualState = updateTofuCargoVisualState;
globalThis.defaultTofuVisualState = defaultTofuVisualState;
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
globalThis.getShopLevel = getShopLevel;
globalThis.getShopUpgradeCatalog = getShopUpgradeCatalog;
globalThis.getShopProductionRate = getShopProductionRate;
globalThis.getShopGeneratorRates = getShopGeneratorRates;
globalThis.calculateShopGeneratorEarnings = calculateShopGeneratorEarnings;
globalThis.applyShopGeneratorTick = applyShopGeneratorTick;
globalThis.tickOpenShopGenerators = tickOpenShopGenerators;
globalThis.startShopGeneratorTimer = startShopGeneratorTimer;
globalThis.orderPrepProgress = orderPrepProgress;
globalThis.tofuStockRunway = tofuStockRunway;
globalThis.getShopOrderTypes = getShopOrderTypes;
globalThis.shopOrderTypeUnlocked = shopOrderTypeUnlocked;
globalThis.maxFulfillableShopOrderQuantity = maxFulfillableShopOrderQuantity;
globalThis.bestFulfillableShopOrderType = bestFulfillableShopOrderType;
globalThis.calculateOfflineShopEarnings = calculateOfflineShopEarnings;
globalThis.formatCompactNumber = formatCompactNumber;
globalThis.formatShopBalance = formatShopBalance;
globalThis.packTofu = packTofu;
globalThis.fulfillShopOrder = fulfillShopOrder;
globalThis.fulfillShopOrders = fulfillShopOrders;
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
globalThis.completeFictionalRoute = completeFictionalRoute;
globalThis.runTrainingDrill = runTrainingDrill;
globalThis.buyGarageUpgrade = buyGarageUpgrade;
globalThis.hireCrewRole = hireCrewRole;
globalThis.buySpiritGenerator = buySpiritGenerator;
globalThis.useShopSpiritBoost = useShopSpiritBoost;
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
    cargoCondition: 97.4,
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
  assert(html.includes('Keep the cup steady. Drive smoothly. Boost the Tofu Shop.'));
  assert(html.includes('id="brand-primary-cta"'));
  assert(html.includes('id="brand-secondary-cta"'));
  assert(html.includes("Don't Spill the Cup"));
  assert(html.includes('Mount your phone, start while parked, and drive smoothly. Your result can boost the Tofu Shop.'));
  assert(html.includes('The Cup Test'));
  assert(html.includes('Delivery Log'));
  assert(html.includes('Every drive is a delivery.'));
  assert(html.includes('Tofu Shop'));
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
  assert(html.includes('Tips/sec'));
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
  assert(appSource.includes('A cozy delivery-management game you can play at home.'));
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
  assert(html.includes('Next: Fulfill Simple Tofu Box'));
  assert(html.includes('Hand them off to earn Tips'));
  assert(html.includes('id="game-certified-cta-button"'));
  assert(html.includes('id="game-driver-license"'));
  assert(html.includes('Level 1 &middot; Rookie Carrier'));
  assert(html.includes('id="game-total-xp"'));
  assert(html.includes('0 XP'));
  assert(html.includes('id="game-gear-progress"'));
  assert(html.includes('0/3'));
  assert(html.includes('The press is warming up. Play at home'));
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
  assert(html.includes('Fulfill Simple Tofu Box'));
  assert(html.includes('Tips'));
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
  assert.strictEqual(context.dashboardActionTitle, 'Next: Fulfill Simple Tofu Box');
  assert(context.dashboardActionCopy.includes('earn Tips for stations and upgrades'));
  assert.strictEqual(context.dashboardActionLabel, 'Fulfill Simple Tofu Box');
  assert.strictEqual(context.dashboardActionType, 'fulfill_shop_order');
  assert.strictEqual(context.dashboardTotalXp, '0 XP');
  assert.strictEqual(context.dashboardGear, '0/3');
  assert.strictEqual(context.dashboardTeasersHidden, false);
  assert.strictEqual(context.activeDashboardActionDisabled, true);
}

function testTwoSurfaceRoutingSeparatesShopAndCupTest() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(html.includes('data-app-surface="shop"'));
  assert(html.includes('data-app-surface="cup-test"'));
  assert(html.includes('data-app-surface="crew"'));
  assert(html.includes('data-surface-target="shop"'));
  assert(html.includes('data-surface-target="crew"'));
  assert(html.includes('data-surface-target="cup-test"'));
  assert(html.includes('class="nospill-brand-hero" aria-labelledby="landing-title"'));
  assert(!html.includes('class="nospill-brand-hero" aria-labelledby="landing-title" data-app-surface='));
  assert(html.includes("Take Don't Spill the Cup for a certified boost")
    || html.includes('Take the Cup Test'));

  const context = loadNoSpillContext({
    window: { location: { hash: '', search: '' }, localStorage: makeLocalStorage() },
  });
  vm.runInContext(`
function makeTextNode() {
  return { textContent: "", dataset: {} };
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
elements = {
  surfaceSections: [shopSection, cupSection, crewSection],
  surfaceNavButtons: [shopNav, cupNav, crewNav],
  setupFlow: cupSection,
  landingView: { scrollIntoView() {} },
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
appState.running = true;
renderSurfaceNavigation();
globalThis.navDisabledDuringDrive = shopNav.disabled && cupNav.disabled && crewNav.disabled;
globalThis.hashShop = surfaceFromHash("#/shop");
globalThis.hashCup = surfaceFromHash("#/cup-test");
globalThis.hashCrew = surfaceFromHash("#/crew");
`, context);

  assert.strictEqual(context.hashDefault, 'cup-test');
  assert.strictEqual(context.hashShop, 'shop');
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
  assert.strictEqual(context.defaultBrandSecondary, 'Go to Tofu Shop');
  assert.strictEqual(context.shopHiddenOnShop, false);
  assert.strictEqual(context.cupHiddenOnShop, true);
  assert.strictEqual(context.crewHiddenOnShop, true);
  assert.strictEqual(context.shopNavCurrent, 'page');
  assert.strictEqual(context.shopBrandEyebrow, 'Tofu Shop');
  assert.strictEqual(context.shopBrandTitle, 'Run the Tofu Shop');
  assert.strictEqual(context.shopBrandCopy, 'A cozy delivery-management game you can play at home.');
  assert.strictEqual(context.shopBrandPrimary, 'Continue the Shop');
  assert.strictEqual(context.shopBrandSecondary, "Take Don't Spill the Cup");
  assert.strictEqual(context.shopHiddenOnCup, true);
  assert.strictEqual(context.cupHiddenOnCup, false);
  assert.strictEqual(context.crewHiddenOnCup, true);
  assert.strictEqual(context.cupNavCurrent, 'page');
  assert.strictEqual(context.cupBrandEyebrow, 'Certified Challenge');
  assert.strictEqual(context.cupBrandTitle, "Don't Spill the Cup");
  assert.strictEqual(context.cupBrandCopy, 'Keep the cup steady. Drive smoothly. Boost the Tofu Shop.');
  assert.strictEqual(context.cupBrandPrimary, 'Take the Cup Test');
  assert.strictEqual(context.cupBrandSecondary, 'Go to Tofu Shop');
  assert.strictEqual(context.shopHiddenOnCrew, true);
  assert.strictEqual(context.cupHiddenOnCrew, true);
  assert.strictEqual(context.crewHiddenOnCrew, false);
  assert.strictEqual(context.crewNavCurrent, 'page');
  assert.strictEqual(context.crewBrandEyebrow, 'Delivery Crew');
  assert.strictEqual(context.crewBrandTitle, 'Delivery Crew');
  assert.strictEqual(context.crewBrandCopy, 'Choose your local crew, characters, and gentle sound packs while parked.');
  assert.strictEqual(context.crewBrandPrimary, 'Go to Tofu Shop');
  assert.strictEqual(context.crewBrandSecondary, "Take Don't Spill the Cup");
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
globalThis.firstCharacterHtml = elements.characterList.innerHTML;
globalThis.firstSoundHtml = elements.soundPackList.innerHTML;
globalThis.firstPreviewDisabled = elements.previewSoundButton.disabled;
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
  assert.strictEqual(context.firstPackText, 'Pack Tofu (backup)');
  assert(context.firstPackHelper.includes('Tofu Stock feeds Prep Counter and larger orders'));
  assert.strictEqual(context.firstFulfillDisabled, false);
  assert(context.firstFulfillHelper.includes('Turn prepared orders into Tips'));
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
  assert.strictEqual(context.afterDeliveryBoardHidden, false);
  assert.strictEqual(context.afterShopSectionHidden, false);
  assert.strictEqual(context.afterCollectionSectionHidden, true);
  assert.notStrictEqual(context.afterDashboardStock, 'Locked');
  assert(context.afterDashboardPassport.includes('stamps collected.'));
  assert.strictEqual(context.afterPackDisabled, false);
  assert.strictEqual(context.afterPackText, 'Pack Tofu (backup)');
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
  assert(context.freshProductionHtml.includes('Tips'));
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
  assert(context.positiveOfflineText.includes('delivery orders'));
  assert(context.fractionalPrepHtml.includes('Need 1 more Prep Slot'));
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
globalThis.funnelXpAfterMax = fulfilled.gameState.totalXP;
globalThis.funnelOrdersAfterMax = fulfilled.gameState.shop.deliveryOrders;
globalThis.funnelStockAfterMax = fulfilled.gameState.shop.tofuStock;
`, context);

  assert.strictEqual(context.funnelAction.type, 'fulfill_shop_order');
  assert.strictEqual(context.funnelAction.title, 'Next: Fulfill Max Simple Orders');
  assert.strictEqual(context.funnelAction.buttonLabel, 'Fulfill Max Simple Orders');
  assert.strictEqual(context.funnelAction.orderQuantity, 'max');
  assert.strictEqual(context.funnelBottleneck.label, 'Need Tips');
  assert(!context.funnelBottleneck.label.includes('Certified boost available'));
  assert(context.funnelBottleneck.action.includes('Fulfill shop orders'));
  assert.strictEqual(context.funnelTopTitle, 'Next: Fulfill Max Simple Orders');
  assert(context.funnelTopCopy.includes('earn Tips for stations and upgrades'));
  assert.strictEqual(context.funnelTopButton, 'Fulfill Max Simple Orders');
  assert.strictEqual(context.funnelTopAction, 'fulfill_shop_order');
  assert.strictEqual(context.funnelTopQuantity, 'max');
  assert.strictEqual(context.funnelPackText, 'Pack Tofu (backup)');
  assert(context.funnelPackHelper.includes('Tofu Stock feeds Prep Counter and larger orders'));
  assert(context.funnelPackHelper.includes('Tips buy upgrades'));
  assert(context.funnelFulfillHelper.includes('Turn prepared orders into Tips'));
  assert(context.funnelOverviewHtml.includes('Current Bottleneck: Need Tips'));
  assert(context.funnelOverviewHtml.includes('Tofu Stock feeds Prep Counter and larger orders. Fulfilled orders earn Tips.'));
  assert(context.funnelOverviewHtml.includes('Tips buy upgrades.'));
  assert(context.funnelOverviewHtml.includes('Preparing Next Order'));
  assert(context.funnelOverviewHtml.includes('role="progressbar"'));
  assert(context.funnelOverviewHtml.includes('Simple Tofu Box'));
  assert(context.funnelOverviewHtml.includes('Reward: +10 Tips, +1 Reputation, +8 XP.'));
  assert(context.funnelOverviewHtml.includes('Fulfill Max Simple Tofu Box x83'));
  assert(context.funnelOverviewHtml.includes('Optional Certified Boost'));
  assert(!context.funnelOverviewHtml.includes('Current Bottleneck: Certified boost available'));
  assert.strictEqual(context.funnelOrdersFallbackTab, 'overview');
  assert(context.funnelOrdersFallbackHtml.includes('Overview'));
  assert(context.funnelOrdersFallbackHtml.includes('Tofu Stock feeds Prep Counter and larger orders. Fulfilled orders earn Tips.'));
  assert(context.funnelOrdersFallbackHtml.includes('Reward: +10 Tips, +1 Reputation, +8 XP.'));
  assert(context.funnelOrdersFallbackHtml.includes('Fulfill Simple Tofu Box'));
  assert(context.funnelOrdersFallbackHtml.includes('Fulfill Max Simple Tofu Box x83'));
  assert(context.funnelProductionHtml.includes('Fulfill shop orders to earn Tips.'));
  assert.strictEqual(context.funnelFulfilledOk, true);
  assert.strictEqual(context.funnelFulfilledQuantity, 83);
  assert.strictEqual(context.funnelTipsAfterMax, 830);
  assert.strictEqual(context.funnelRepAfterMax, 83);
  assert.strictEqual(context.funnelXpAfterMax, 664);
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
  assert(context.waitingTopCopy.includes('Need 10 more Tips for Tidy Packaging.'));
  assert.strictEqual(context.waitingCertifiedHidden, false);
  assert.strictEqual(context.waitingOrdersText, '0 ready');
  assert(!context.waitingOrdersText.includes('0.3'));
  assert(context.waitingPrepStatus.includes('Next order is 30% prepared.'));
  assert(context.waitingPrepStatus.includes('seconds remaining'));
  assert.strictEqual(context.waitingPackText, 'Pack Tofu (backup)');
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
  assert(context.waitingOrdersHtml.includes('Need 1 prepared order.'));
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
  assert.strictEqual(context.highReadyAction.title, 'Next: Fulfill Max Simple Orders');
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
  assert(context.highOrdersHtml.includes('Tofu Stock feeds Prep Counter and larger orders. Fulfilled orders earn Tips.'));
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
  assert.strictEqual(context.compactTipsText, '1B');
  assert.strictEqual(context.compactReputationText, '1B');
  assert(/[KMB]/.test(context.compactLevelProgressText));
  assert(context.compactPrepSlotsText.includes('1.05K/'));
  assert.strictEqual(context.compactReachText, '12.8K');
  assert(context.compactSpiritText.includes('K/'));
  assert.strictEqual(context.compactStarsText, '100K');
  assert.strictEqual(context.compactStateTips, 1000000000);
  assert.strictEqual(context.compactStateStock, 2400000);
  assert(context.compactOrdersHtml.includes('Fulfill Max Festival Bento x6.42K'));
  assert(context.compactOrdersHtml.includes('Reward: +835K Tips'));
  assert(context.compactOrdersHtml.includes('Uses: 482K tofu stock, 12.8K ready orders'));
  assert(context.compactProductionHtml.includes('K Tips'));
  assert(context.compactProductionHtml.includes('Need 1 more Prep Slot'));
  assert(context.compactUpgradeHtml.includes('K Tips'));
  assert(context.compactUpgradeHtml.includes('K more Tips'));
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
`, context);

  assert.strictEqual(context.shopRecentRewardText, '+8 XP · Simple Tofu Box Complete');
  assert.strictEqual(context.shopFallbackRewardText, '+4 XP · Shop Order');
  assert(!context.shopRecentRewardText.includes('undefined'));
  assert(!context.shopFallbackRewardText.includes('undefined'));
}

function testFirstStampFanfareCelebratesAndPersists() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  assert(html.includes('id="stamp-fanfare"'));
  assert(html.includes('role="dialog"'));
  assert(html.includes('aria-modal="true"'));
  assert(html.includes('First Stamp Earned'));
  assert(html.includes('First Shop Order'));
  assert(html.includes('Continue the Shop'));
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
  assert.strictEqual(context.fanfarePayload.rewards.xp, 8);
  assert(context.fanfareLedgerText.includes('First Shop Order stamp earned'));
  assert.strictEqual(context.fanfareShown, true);
  assert.strictEqual(context.fanfareSoundReason, 'muted');
  assert.strictEqual(context.fanfareTitle, 'First Stamp Earned');
  assert.strictEqual(context.fanfareStampName, 'First Shop Order');
  assert.strictEqual(context.fanfareCopy, 'The passport opens. Your first shop order is recorded.');
  assert(context.fanfareRewardsHtml.includes('Tips'));
  assert(context.fanfareRewardsHtml.includes('+10'));
  assert(context.fanfareRewardsHtml.includes('Reputation'));
  assert(context.fanfareRewardsHtml.includes('+1'));
  assert(context.fanfareRewardsHtml.includes('XP'));
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
};
appState.running = false;
appState.calibrating = false;
appState.surface = "shop";
let state = defaultGameState();
state = fulfillShopOrders(state, 1, {
  activeDrive: false,
  orderTypeId: "simple_tofu_box",
}).gameState;
state.shop.tips = 25;
const upgrade = buyStationUpgrade("prep_counter_faster", state);
globalThis.storyUpgradeOk = upgrade.ok;
globalThis.storyTeaserTitle = upgrade.storyTeaser && upgrade.storyTeaser.title;
globalThis.storyTeaserCopy = upgrade.storyTeaser && upgrade.storyTeaser.copy;
globalThis.storySeenIds = upgrade.gameState.seenStoryBeatIds.slice();
appState.shopStoryTeaser = upgrade.storyTeaser;
appState.shopTab = "overview";
renderTofuShop(upgrade.gameState);
globalThis.storyOverviewHtml = elements.shopTabPanel.innerHTML;
globalThis.storyTabsHtml = elements.shopTabList.innerHTML;
saveGameState(upgrade.gameState);
let reloaded = loadGameState();
reloaded.shop.tips = 25;
const secondUpgrade = buyStationUpgrade("tofu_press_faster", reloaded);
globalThis.secondStoryTeaser = secondUpgrade.storyTeaser;
appState.shopStoryTeaser = null;
renderTofuShop(loadGameState());
globalThis.reloadedOverviewHtml = elements.shopTabPanel.innerHTML;
appState.running = true;
appState.shopStoryTeaser = upgrade.storyTeaser;
appState.shopTab = "overview";
renderTofuShop(upgrade.gameState);
globalThis.activeStoryOverviewHtml = elements.shopTabPanel.innerHTML;
`, context);

  assert.strictEqual(context.storyUpgradeOk, true);
  assert.strictEqual(context.storyTeaserTitle, 'Behind the shop');
  assert(context.storyTeaserCopy.includes('old car waits under a cover'));
  assert(context.storyTeaserCopy.includes("One day, you'll build it"));
  assert.strictEqual(context.storySeenIds.join(','), 'covered_car_teaser');
  assert(context.storyOverviewHtml.includes('Behind the shop'));
  assert(context.storyOverviewHtml.includes('old car waits under a cover'));
  assert(!context.storyTabsHtml.includes('Dream Garage'));
  assert.strictEqual(context.secondStoryTeaser, null);
  assert(!context.reloadedOverviewHtml.includes('old car waits under a cover'));
  assert(!context.activeStoryOverviewHtml.includes('old car waits under a cover'));

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
  assert.strictEqual(fresh.shop.tofuStock, 10);
  assert.strictEqual(fresh.shop.deliveryOrders, 1);
  assert.strictEqual(fresh.shop.stations.tofu_press, 1);
  assert.strictEqual(fresh.shop.stations.prep_counter, 1);
  assert.strictEqual(fresh.shop.tips, 0);
  assert.strictEqual(fresh.shop.reputation, 0);
  assert.strictEqual(fresh.totalXP, 0);
  const simple = context.fulfillShopOrder(fresh, { activeDrive: false });
  assert.strictEqual(simple.ok, true);
  assert.strictEqual(simple.orderType.id, 'simple_tofu_box');
  assert.strictEqual(simple.tipsGained, 10);
  assert.strictEqual(simple.reputationGained, 1);
  assert.strictEqual(simple.xpGained, 8);
  assert.strictEqual(simple.deliveryOrdersUsed, 1);
  assert.strictEqual(simple.tofuUsed, 6);
  assert.strictEqual(simple.gameState.shop.deliveryOrders, 0);
  assert.strictEqual(simple.gameState.shop.tofuStock, 4);
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
  const stockPressure = context.fulfillShopOrder(secondOrderReady, { activeDrive: false });
  assert.strictEqual(stockPressure.ok, false);
  assert(stockPressure.reason.includes('Need 2 more tofu stock'));
  secondOrderReady.shop.tofuStock = 6;
  const secondSimple = context.fulfillShopOrder(secondOrderReady, { activeDrive: false });
  assert.strictEqual(secondSimple.ok, true);
  assert.strictEqual(secondSimple.gameState.shop.tips, 20);
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
  assert.strictEqual(nextFamily.type, 'fulfill_shop_order');
  assert.strictEqual(nextFamily.orderTypeId, 'family_tofu_tray');
  assert.strictEqual(nextFamily.title, 'Next: Fulfill Family Tofu Tray');
  assert(nextFamily.copy.includes('larger order'));

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
  assert(context.freshOrderTypePanelHtml.includes('Fulfill Simple Tofu Box'));
  assert(!context.freshOrderTypePanelHtml.includes('Family Tofu Tray'));
  assert(!context.freshOrderTypePanelHtml.includes('Festival Bento'));
  assert(!context.freshOrderTypePanelHtml.includes('Catering Crate'));
  assert(context.orderTypePanelHtml.includes('Tofu Stock feeds Prep Counter and larger orders. Fulfilled orders earn Tips.'));
  assert(context.orderTypePanelHtml.includes('Family Tofu Tray'));
  assert(context.orderTypePanelHtml.includes('Uses 24 tofu stock and 1 ready order.'));
  assert(context.orderTypePanelHtml.includes('Reward: +45 Tips, +3 Reputation, +24 XP.'));
  assert(context.orderTypePanelHtml.includes('Fulfill Max Family Tofu Tray x4'));
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
  assert.strictEqual(fresh.shop.tofuStock, 10);
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

function testNextBestActionHierarchyStaysSinglePrimary() {
  const context = loadNoSpillContext({
    window: { location: { search: '?simulator=1' }, localStorage: makeLocalStorage() },
  });
  const first = context.defaultGameState();
  const firstAction = context.nextBestAction(first, { date: new Date('2026-06-14T12:00:00.000Z') });
  assert.strictEqual(firstAction.type, 'fulfill_shop_order');
  assert.strictEqual(firstAction.title, 'Next: Fulfill Simple Tofu Box');
  assert.strictEqual(firstAction.buttonLabel, 'Fulfill Simple Tofu Box');

  const startedShop = context.packTofu(first, { activeDrive: false }).gameState;
  const packAction = context.nextBestAction(startedShop, {
    date: new Date('2026-06-14T12:00:00.000Z'),
  });
  assert.strictEqual(packAction.type, 'fulfill_shop_order');

  const incompleteDaily = context.applySimulatedDelivery(
    'shaky_practice',
    first,
    { now: new Date('2026-06-14T12:00:00.000Z') },
  ).gameState;
  const incompleteAction = context.nextBestAction(incompleteDaily, {
    date: new Date('2026-06-14T12:00:00.000Z'),
  });
  assert(['pack_tofu', 'fulfill_shop_order', 'buy_upgrade', 'cup_test'].includes(incompleteAction.type));

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
  assert.strictEqual(fulfillAction.type, 'fulfill_shop_order');
  assert.strictEqual(fulfillAction.title, 'Next: Fulfill Max Simple Orders');
  assert.strictEqual(fulfillAction.buttonLabel, 'Fulfill Max Simple Orders');
  assert.strictEqual(fulfillAction.orderQuantity, 'max');

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
  assert.strictEqual(context.topActionTitle, 'Next: Fulfill Simple Tofu Box');
  assert.strictEqual(context.topActionButton, 'Fulfill Simple Tofu Box');
  assert.strictEqual(context.topActionType, 'fulfill_shop_order');

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
  const logoPath = path.join(NOSPILL_ASSETS_DIR, 'tofu-driver-logo.png');
  const shirtPath = path.join(NOSPILL_ASSETS_DIR, 'tofu-driver-shirt-1.png');
  const appImagePath = path.join(NOSPILL_ASSETS_DIR, 'tofu-driver-app-image.png');

  assert(fs.existsSync(logoPath), 'Tofu Driver logo asset should exist');
  assert(fs.existsSync(shirtPath), 'No-Spill Club shirt preview asset should exist');
  assert(fs.existsSync(appImagePath), 'Tofu Driver cargo mascot app image should exist');
  assert(html.includes('/static/nospill/assets/tofu-driver-logo.png'));
  assert(html.includes('/static/nospill/assets/tofu-driver-shirt-1.png'));
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
  assert(defaultText.includes('Cargo Condition: 97.4%'));
  assert(defaultText.includes('Route Type: Technical Route'));
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
  assert.strictEqual(cardData.routeLabel, 'Technical Route');
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
  assert(distanceText.includes('Distance: 4.2 mi.'));
  assert(!/speed|mph|gps|map|street|trace|location|lat|lon/i.test(distanceText));

  const distanceCardData = context.buildShareCardData(summary, {
    includeDistanceInShare: true,
  });
  assert.strictEqual(distanceCardData.distanceLabel, '4.2 mi');
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
  assert.strictEqual(state.shop.tofuStock, 10);
  assert.strictEqual(state.shop.deliveryOrders, 1);
  assert.strictEqual(state.shop.tips, 0);
  assert.strictEqual(state.shop.reputation, 0);
  assert.strictEqual(state.shop.shopLevel, 1);
  assert.strictEqual(state.shop.generators.tofuPress.unlocked, true);
  assert.strictEqual(state.shop.generators.prepCounter.unlocked, true);
  assertAlmostEqual(context.getShopGeneratorRates(state).tofuPressPerSecond, 0.05);

  const activePack = context.packTofu(state, { activeDrive: true });
  assert.strictEqual(activePack.ok, false);
  assert.strictEqual(activePack.gameState.shop.tofuStock, 10);

  const firstHomePack = context.packTofu(state, { activeDrive: false });
  assert.strictEqual(firstHomePack.ok, true);
  assert.strictEqual(firstHomePack.gameState.shop.tofuStock, 11);
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
  assert.strictEqual(offline.cappedHours, 8);
  assert(offline.tofuStock >= 0);
  assert(offline.deliveryOrders > 0);
  const offlineApplied = context.applyShopGeneratorTick(
    productionState,
    new Date('2026-06-14T10:00:00.000Z'),
    { maxSeconds: 8 * 3600 },
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
globalThis.afterFulfillXp = currentGameState().totalXP;
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
  assert.strictEqual(context.afterFulfillXp > 0, true);
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
  assert.strictEqual(route.ok, true);
  assert.strictEqual(route.gameState.shop.shopReach > bulkOrders.gameState.shop.shopReach, true);
  assert.strictEqual(Boolean(route.gameState.stamps.shop_street_complete), true);

  const training = context.runTrainingDrill('cone_drill', route.gameState);
  assert.strictEqual(training.ok, true);
  assert.strictEqual(training.gameState.shop.cupStabilityXP > route.gameState.shop.cupStabilityXP, true);

  const garage = context.buyGarageUpgrade('cup_holder_charm', training.gameState);
  assert.strictEqual(garage.ok, true);
  assert.strictEqual(garage.gameState.shop.garage.cup_holder_charm, 1);

  const crew = context.hireCrewRole('apprentice_driver', garage.gameState);
  assert.strictEqual(crew.ok, true);
  assert.strictEqual(crew.gameState.shop.crew.apprentice_driver, 1);
  assert.strictEqual(Boolean(crew.gameState.stamps.first_apprentice), true);

  const spiritGenerator = context.buySpiritGenerator('tea_kettle', crew.gameState);
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
  assert(text.includes('Route Type: City Delivery'));
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
globalThis.inlineXpAfterFirst = afterFirst.totalXP;
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
  assert.strictEqual(context.inlineXpAfterFirst, 8);
  assert.strictEqual(context.inlineStockAfterFirst, 24);
  assert.strictEqual(context.inlineOrdersAfterFirst, 1);
  assert.strictEqual(context.inlineTabAfterFirst, 'overview');
  assert.strictEqual(context.inlineSummaryView, '');
  assert.strictEqual(context.inlineSummaryMode, '');
  assert(context.inlinePanelAfterFirst.includes('Overview'));
  assert(context.inlinePanelAfterFirst.includes('Simple Tofu Box'));
  assert(context.inlineMessageAfterFirst.includes('Simple Tofu Box complete: +10 Tips, +1 Reputation, +8 XP'));
  assert.strictEqual(context.inlineStampShown, true);
  assert.strictEqual(context.inlineStampTitle, 'First Stamp Earned');
  assert.strictEqual(context.inlineStampName, 'First Shop Order');
  assert.strictEqual(context.inlineTipsAfterMax, 195);
  assert.strictEqual(context.inlineTabAfterMax, 'overview');
  assert.strictEqual(context.inlineSummaryAfterMax, '');
  assert(context.inlineMessageAfterMax.includes('Family Tofu Tray x4 complete: +180 Tips, +12 Reputation, +96 XP'));
  assert.strictEqual(context.inlineStampHiddenAfterMax, true);
}

function testResultScreenShowsGameSummarySections() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  const source = fs.readFileSync(NOSPILL_JS, 'utf8');
  assert(html.includes('id="delivery-summary-grid"'));
  assert(html.includes('id="summary-title"'));
  assert(html.includes('Result Details'));
  assert(html.includes('id="return-dashboard-button"'));
  assert(html.includes('Return to Tofu Shop'));
  assert(html.includes('id="new-run-button"'));
  assert(html.includes('Take Another Cup Test'));
  assert(html.includes('id="back-simulator-button"'));
  assert(html.indexOf('id="return-dashboard-button"') < html.indexOf('id="new-run-button"'));
  assert(html.indexOf('id="new-run-button"') < html.indexOf('id="share-button"'));
  assert(source.includes('returnDashboardButton.addEventListener("click"'));
  assert(source.includes('backSimulatorButton.addEventListener("click"'));
  assert(source.includes('function returnToDashboard'));
  const summaryStart = html.indexOf('id="summary-view"');
  const summaryEnd = html.indexOf('id="landing-view"', summaryStart + 1);
  const summaryHtml = html.slice(summaryStart, summaryEnd > summaryStart ? summaryEnd : undefined);
  assert(!summaryHtml.includes('id="summary-grid"'));
  assert(!summaryHtml.includes('id="milestone-output"'));
  assert(!summaryHtml.includes('id="merch-grid"'));
  assert.strictEqual((summaryHtml.match(/Delivery Complete/g) || []).length, 0);
  [
    '"Cargo Condition"',
    '"XP Gained"',
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
  assert.strictEqual(context.returnScrolledShop, true);
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
  assert(source.includes('/static/nospill/assets/tofu-driver-app-image.png'));
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

function run() {
  testNoSpillIsNotLinkedFromExistingFrontendSurfaces();
  testNoSitemapOrRobotsRevealNoSpill();
  testNoSpillHtmlUsesNoindexWithoutSocialIndexingMetadata();
  testTofuDriverBrandHierarchy();
  testFirstTimeGameDashboardIsVisibleBeforeSetup();
  testTwoSurfaceRoutingSeparatesShopAndCupTest();
  testProgressiveRevealTeasersUnlockAfterFirstDelivery();
  testTofuShopGeneratorUpgradeUiIsHonestAndProgressive();
  testEarlyShopResourceFunnelMakesTipsObvious();
  testFractionalDeliveryOrdersShowPrepProgressNotRawDecimal();
  testTofuStockRunwayGuidesEarlyPurchases();
  testCompactTofuShopNumberFormatting();
  testShopRecentRewardUsesSafeFallbackLabel();
  testFirstStampFanfareCelebratesAndPersists();
  testStampFanfareReducedMotionUsesStaticState();
  testDiscoveryFanfareRevealsUpgradesOnce();
  testDiscoveryFanfareReducedMotionUsesStaticState();
  testCoveredCarTeaserIsOneTimeStoryBeatOnly();
  testShopOrderTypeProgressionAndRewards();
  testCoreGameSpineV1MilestonesAndSupportStations();
  testNextBestActionHierarchyStaysSinglePrimary();
  testTofuDriverArtworkIsIsolatedAndAccessible();
  testSuperCuteCollectiblesLandingAndMerchCopy();
  testDiscordCtaConfigAndRendering();
  testPostHogAnalyticsNoOpsWithoutConfigAndHonorsOptOut();
  testPostHogAnalyticsInitializesWithPrivacyOptions();
  testAnalyticsSanitizerDropsDangerousKeysAndCampaignsAreSafe();
  testAnalyticsRouteCupShopAndShareEventsUseSafeProperties();
  testNoSpillClientDoesNotUploadRawRunData();
  testNoSpillLiveSummaryAndShareAvoidSensitiveDetails();
  testShareConfigAndCardData();
  testLockedMerchLinksAreNotShownBeforeUnlock();
  testDailyDeliverySelectionAndEvaluation();
  testRouteTypeClassification();
  testDeliveryRewardsDoNotUseSpeedAndRespectMajorUnlockContext();
  testPracticeModeRewardGatingAndRankCopy();
  testPracticeShareOutputIsLabeledAndNotPerfectPour();
  testLongHaulDailyXpCapAndMerchProgress();
  testNoSpillClubGearRequiresRepeatedQualifiedDeliveries();
  testPerfectPourAndDeliveryCrewProgressRules();
  testDriverLicensePassportAndCoachRecap();
  testGameStateStorageIsSummaryOnlyAndCommuteMasteryUsesFingerprints();
  testGameProgressPersistsAcrossReloadSimulation();
  testResetExportAndImportProgressAreScopedAndValidated();
  testTofuShopStatePackIdleAndUpgradeRules();
  testLiveIdleTickAndShopButtonReliability();
  testExpandedIdleShopLayerMechanics();
  testSettingsTabConsolidatesProgressToolsAndHidesQaByDefault();
  testDeliveryToShopRewardsDoNotUseSpeedAndStaySummaryOnly();
  testCharacterAndSoundUnlocksAreLocalCosmeticAndPersisted();
  testDeliverySimulatorIsHiddenLocalAndSummarized();
  testDeliverySimulatorAppliesLocalProgressAndSafeShareLabels();
  testUnlockShelvesStayOutOfMainShopUi();
  testShareOutputIncludesDeliveryLayerAndExcludesSensitiveDetails();
  testShopOrderFulfillmentStaysInlineAndKeepsFanfare();
  testResultScreenShowsGameSummarySections();
  testPostRunNavigationReturnsToUpdatedDashboard();
  testLocationPermissionFlowRemainsOptIn();
  testPrivateQualifiedSummaryMayShowDistance();
  testMountAxisMapping();
  testMappedMotionUsesSelectedMountConfig();
  testRunMotionPathUsesSharedAxisMapping();
  testTofuCargoVisualizationReplacesGenericGDot();
  testTofuCargoVisualizationUsesMotionNotSpeed();
  testAudioVolumeGainModel();
  testAudioVolumePersistsInLocalStorageState();
  testWaterRanksAndLossAreMotionOnly();
  testQualifiedRouteAnalysisAndQualification();
}

run();
