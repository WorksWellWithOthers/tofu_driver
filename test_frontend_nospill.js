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
globalThis.calculateOfflineShopEarnings = calculateOfflineShopEarnings;
globalThis.packTofu = packTofu;
globalThis.fulfillShopOrder = fulfillShopOrder;
globalThis.fulfillShopOrders = fulfillShopOrders;
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
globalThis.renderTofuShop = renderTofuShop;
globalThis.renderCollectionPanel = renderCollectionPanel;
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
  assert(html.includes('Next: Start the Tofu Shop'));
  assert(html.includes('Pack your first order at home'));
  assert(html.includes('id="game-certified-cta-button"'));
  assert(html.includes('id="game-driver-license"'));
  assert(html.includes('Level 1 &middot; Rookie Carrier'));
  assert(html.includes('id="game-total-xp"'));
  assert(html.includes('0 XP'));
  assert(html.includes('id="game-gear-progress"'));
  assert(html.includes('0/3'));
  assert(html.includes('The press is warming up. Play at home'));
  assert(html.includes('The passport opens after your first stamp-worthy delivery.'));
  assert(html.includes('No one is on shift yet. Your first delivery may attract help.'));
  assert(html.includes('New sounds unlock as your delivery reputation grows.'));
  assert(html.includes('id="game-teaser-grid"'));
  assert(html.includes('nospill-section nospill-delivery-log is-hidden'));
  assert(html.includes('id="tofu-shop"'));
  assert(html.includes('nospill-section nospill-collection is-hidden'));
  assert(html.includes('Settings / Progress Tools'));
  const firstRunMain = html.slice(dashboardIndex, html.indexOf('id="how-it-works"'));
  assert(!firstRunMain.includes('Export Progress'));
  assert(!firstRunMain.includes('Import Progress'));
  assert(!firstRunMain.includes('Reset Progress'));
  assert(html.includes('nospill-game-primary-cta'));
  assert(html.includes('Fulfill Shop Order'));
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
  assert.strictEqual(context.dashboardActionTitle, 'Next: Start the Tofu Shop');
  assert(context.dashboardActionCopy.includes('Pack your first order at home'));
  assert.strictEqual(context.dashboardActionLabel, 'Start the Shop');
  assert.strictEqual(context.dashboardActionType, 'start_shop');
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
  shopGeneratorList: makeNode(),
  shopUpgradeList: makeNode(),
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
globalThis.firstGeneratorHtml = elements.shopGeneratorList.innerHTML;
globalThis.firstUpgradeHtml = elements.shopUpgradeList.innerHTML;
globalThis.firstCharacterHtml = elements.characterList.innerHTML;
globalThis.firstSoundHtml = elements.soundPackList.innerHTML;
globalThis.firstPreviewDisabled = elements.previewSoundButton.disabled;
const simulated = applySimulatedDelivery(
  "smooth_commute",
  firstRunState,
  { now: new Date("2026-06-14T12:00:00.000Z") },
);
renderGamePanels(simulated.gameState);
globalThis.afterReveal = progressiveRevealState(simulated.gameState);
globalThis.afterDeliveryBoardHidden = elements.deliveryBoardSection.classListValue;
globalThis.afterShopSectionHidden = elements.tofuShopSection.classListValue;
globalThis.afterCollectionSectionHidden = elements.collectionSection.classListValue;
globalThis.afterDashboardStock = elements.gameShopStock.textContent;
globalThis.afterDashboardPassport = elements.gamePassportEmpty.textContent;
globalThis.afterPackDisabled = elements.packTofuButton.disabled;
globalThis.afterPackText = elements.packTofuButton.textContent;
globalThis.afterGeneratorHtml = elements.shopGeneratorList.innerHTML;
globalThis.afterUpgradeHtml = elements.shopUpgradeList.innerHTML;
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
renderTofuShop(simulated.gameState);
renderCollectionPanel(simulated.gameState);
globalThis.activePackDisabled = elements.packTofuButton.disabled;
globalThis.activeGeneratorHtml = elements.shopGeneratorList.innerHTML;
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
  assert(context.firstPackHelper.includes('Pack tofu while parked'));
  assert.strictEqual(context.firstFulfillDisabled, true);
  assert(context.firstFulfillHelper.includes('Prep Counter needs delivery orders first'));
  assert(context.firstGeneratorHtml.includes('Tofu Press'));
  assert(context.firstGeneratorHtml.includes('+0.05 tofu / sec'));
  assert(context.firstGeneratorHtml.includes('data-shop-upgrade="tofu_press"'));
  assert(context.firstUpgradeHtml.includes('data-shop-upgrade="tofu_press"'));
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
  assert.strictEqual(context.afterPackText, 'Pack Tofu');
  assert(context.afterGeneratorHtml.includes('Tofu Press'));
  assert(context.afterGeneratorHtml.includes('+0.05 tofu / sec'));
  assert(context.afterGeneratorHtml.includes('Prep Counter'));
  assert(context.afterUpgradeHtml.includes('data-shop-upgrade="tofu_press"'));
  assert.strictEqual(context.crewSurfaceCollectionHidden, false);
  assert(context.crewSurfaceCharacterHtml.includes('Angry Tofu Driver'));
  assert(context.crewSurfaceCharacterHtml.includes('data-character-id="angry_tofu_driver"'));
  assert(context.crewSurfaceSoundHtml.includes('Retro Arcade'));
  assert(context.crewSurfaceSoundHtml.includes('data-sound-pack-id="retro_arcade"'));
  assert.strictEqual(context.crewSurfacePreviewDisabled, false);
  assert.strictEqual(context.activePackDisabled, true);
  assert(context.activeGeneratorHtml.includes('data-shop-upgrade="tofu_press"'));
  assert(context.activeGeneratorHtml.includes('disabled'));
  assert.strictEqual(context.activePreviewDisabled, true);
}

function testNextBestActionHierarchyStaysSinglePrimary() {
  const context = loadNoSpillContext({
    window: { location: { search: '?simulator=1' }, localStorage: makeLocalStorage() },
  });
  const first = context.defaultGameState();
  const firstAction = context.nextBestAction(first, { date: new Date('2026-06-14T12:00:00.000Z') });
  assert.strictEqual(firstAction.type, 'start_shop');
  assert.strictEqual(firstAction.title, 'Next: Start the Tofu Shop');
  assert.strictEqual(firstAction.buttonLabel, 'Start the Shop');

  const startedShop = context.packTofu(first, { activeDrive: false }).gameState;
  const packAction = context.nextBestAction(startedShop, {
    date: new Date('2026-06-14T12:00:00.000Z'),
  });
  assert.strictEqual(packAction.type, 'pack_tofu');

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
  assert.strictEqual(fulfillAction.title, 'Next: Fulfill Shop Order');

  const funded = JSON.parse(JSON.stringify(completeDaily));
  funded.shop.tofuStock = 500;
  funded.shop.deliveryOrders = 0;
  funded.shop.lifetimeTofuPacked = 1;
  const upgradeAction = context.nextBestAction(funded, {
    date: new Date('2026-06-14T12:00:00.000Z'),
  });
  assert.strictEqual(upgradeAction.type, 'buy_upgrade');
  assert.strictEqual(upgradeAction.title, 'Next: Buy an Upgrade');

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
  assert.strictEqual(context.topActionTitle, 'Next: Start the Tofu Shop');
  assert.strictEqual(context.topActionButton, 'Start the Shop');
  assert.strictEqual(context.topActionType, 'start_shop');

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
  assert.strictEqual(state.shop.tofuStock, 0);
  assert.strictEqual(state.shop.deliveryOrders, 0);
  assert.strictEqual(state.shop.tips, 0);
  assert.strictEqual(state.shop.reputation, 0);
  assert.strictEqual(state.shop.shopLevel, 1);
  assert.strictEqual(state.shop.generators.tofuPress.unlocked, true);
  assertAlmostEqual(context.getShopGeneratorRates(state).tofuPressPerSecond, 0.05);

  const activePack = context.packTofu(state, { activeDrive: true });
  assert.strictEqual(activePack.ok, false);
  assert.strictEqual(activePack.gameState.shop.tofuStock, 0);

  const firstHomePack = context.packTofu(state, { activeDrive: false });
  assert.strictEqual(firstHomePack.ok, true);
  assert.strictEqual(firstHomePack.gameState.shop.tofuStock, 1);
  assert.strictEqual(firstHomePack.gameState.shop.reputation, 0);

  const emptyOrder = context.fulfillShopOrder(firstHomePack.gameState, { activeDrive: false });
  assert.strictEqual(emptyOrder.ok, false);
  assert(emptyOrder.reason.includes('Prep Counter needs delivery orders first'));

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
  assert.strictEqual(prepTick.gameState.shop.deliveryOrders, 1);
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
  assert.strictEqual(consumeTick.gameState.shop.deliveryOrders, 4);
  assert.strictEqual(consumeTick.gameState.shop.tofuStock, 5);
  assert(consumeTick.earnings.tofuStock < 0);

  const fulfilled = context.fulfillShopOrder(prepTick.gameState, { activeDrive: false });
  assert.strictEqual(fulfilled.ok, true);
  assert.strictEqual(fulfilled.tipsGained, 10);
  assert.strictEqual(fulfilled.reputationGained, 1);
  assert.strictEqual(fulfilled.xpGained, 4);
  assert.strictEqual(fulfilled.gameState.shop.deliveryOrders, 0);
  assert.strictEqual(fulfilled.gameState.shop.tips, 10);
  assert.strictEqual(fulfilled.gameState.shop.reputation, prepTick.gameState.shop.reputation + 1);

  const activeOrder = context.fulfillShopOrder(prepTick.gameState, { activeDrive: true });
  assert.strictEqual(activeOrder.ok, false);
  assert.strictEqual(activeOrder.gameState.shop.deliveryOrders, prepTick.gameState.shop.deliveryOrders);

  const waitingState = context.defaultGameState();
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
  assert(offline.tofuStock > 0);
  assert(offline.deliveryOrders > 0);
  const offlineApplied = context.applyShopGeneratorTick(
    productionState,
    new Date('2026-06-14T10:00:00.000Z'),
    { maxSeconds: 8 * 3600 },
  );
  assert(offlineApplied.gameState.shop.tofuStock >= 0);
  assert.strictEqual(offlineApplied.gameState.shop.deliveryOrders, offline.deliveryOrders);

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
  testNextBestActionHierarchyStaysSinglePrimary();
  testTofuDriverArtworkIsIsolatedAndAccessible();
  testSuperCuteCollectiblesLandingAndMerchCopy();
  testDiscordCtaConfigAndRendering();
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
  testExpandedIdleShopLayerMechanics();
  testDeliveryToShopRewardsDoNotUseSpeedAndStaySummaryOnly();
  testCharacterAndSoundUnlocksAreLocalCosmeticAndPersisted();
  testDeliverySimulatorIsHiddenLocalAndSummarized();
  testDeliverySimulatorAppliesLocalProgressAndSafeShareLabels();
  testUnlockShelvesStayOutOfMainShopUi();
  testShareOutputIncludesDeliveryLayerAndExcludesSensitiveDetails();
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
