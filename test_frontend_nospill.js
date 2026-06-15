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
globalThis.calculateOfflineShopEarnings = calculateOfflineShopEarnings;
globalThis.packTofu = packTofu;
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
  assert(html.includes('<title>Tofu Driver</title>'));
  assert(html.includes('<h1>Tofu Driver</h1>'));
  assert(html.includes('The Cup Test'));
  assert(html.includes('Delivery Log'));
  assert(html.includes('Every drive is a delivery.'));
  assert(html.includes('Tofu Shop'));
  assert(html.includes('Shop Mode is for when you are parked. Do not interact while driving.'));
  assert(html.includes('Pack Tofu'));
  assert(html.includes('Delivery Wall'));
  assert(html.includes('Tofu Stock'));
  assert(html.includes('Reputation'));
  assert(html.includes('Idle Production'));
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
  assert(!runViewHtml.includes('game-pack-tofu-button'));
  assert(!runViewHtml.includes('data-shop-upgrade'));
  assert(!runViewHtml.includes('data-character-id'));
  assert(!runViewHtml.includes('data-sound-pack-id'));
  assert(!runViewHtml.includes('Preview Sound'));
  assert(html.includes("Don't spill the cup."));
  assert(html.includes('Not faster. Smoother.'));
  assert(html.includes('A smooth-driving challenge where your goal is simple'));
  assert(html.includes('No speed leaderboards. No maps. No racing. Just control.'));
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
  assert(html.includes('Every drive is a delivery. Preserve the cargo'));
  assert(html.includes('id="game-daily-cargo"'));
  assert(html.includes('id="game-daily-goal"'));
  assert(html.includes('id="game-daily-reward"'));
  assert(html.includes('id="game-driver-license"'));
  assert(html.includes('Level 1 &middot; Rookie Carrier'));
  assert(html.includes('id="game-total-xp"'));
  assert(html.includes('0 XP'));
  assert(html.includes('id="game-gear-progress"'));
  assert(html.includes('0/3'));
  assert(html.includes('The shop is quiet. Complete your first delivery to wake it up.'));
  assert(html.includes('The passport opens after your first stamp-worthy delivery.'));
  assert(html.includes('No one is on shift yet. Your first delivery may attract help.'));
  assert(html.includes('New sounds unlock as your delivery reputation grows.'));
  assert(html.includes('First Delivery locked'));
  assert(html.includes('Daily Delivery Complete locked'));
  assert(html.includes('No-Spill Club locked'));
  assert(html.includes('Perfect Pour locked'));
  assert(html.includes('id="game-shop-stock"'));
  assert(html.includes('id="game-shop-reputation"'));
  assert(html.includes('id="game-shop-level"'));
  assert(html.includes('nospill-game-primary-cta'));
  assert(html.indexOf('id="game-daily-goal"') < html.indexOf('id="game-cta-button"'));
  assert(html.indexOf('id="game-daily-reward"') < html.indexOf('id="game-cta-button"'));
  assert(html.indexOf('id="game-cta-button"') < html.indexOf('id="game-driver-license"'));
  assert(html.indexOf('id="game-cta-button"') < html.indexOf('id="game-passport-empty"'));
  assert(html.indexOf('id="game-cta-button"') < html.indexOf('id="game-shop-stock"'));

  const context = loadNoSpillContext();
  vm.runInContext(`
function makeNode() {
  return { textContent: "", innerHTML: "", disabled: null };
}
elements = {
  gameDailyTitle: makeNode(),
  gameDailyFlavor: makeNode(),
  gameDailyCargo: makeNode(),
  gameDailyGoal: makeNode(),
  gameDailyReward: makeNode(),
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
renderGameDashboard(defaultGameState());
globalThis.dashboardDriverLicense = elements.gameDriverLicense.textContent;
globalThis.dashboardTotalXp = elements.gameTotalXP.textContent;
globalThis.dashboardGear = elements.gameGearProgress.textContent;
globalThis.dashboardPassport = elements.gamePassportEmpty.textContent;
globalThis.dashboardPassportPreview = elements.gamePassportPreview.innerHTML;
globalThis.dashboardStock = elements.gameShopStock.textContent;
globalThis.dashboardReputation = elements.gameShopReputation.textContent;
globalThis.dashboardShopLevel = elements.gameShopLevel.textContent;
globalThis.dashboardShopTeaser = elements.gameShopTeaser.textContent;
globalThis.dashboardShopHelper = elements.gameShopHelper.textContent;
globalThis.dashboardPackDisabled = elements.gamePackTofuButton.disabled;
globalThis.dashboardPackText = elements.gamePackTofuButton.textContent;
appState.running = true;
renderGameDashboard(defaultGameState());
globalThis.activeDashboardPackDisabled = elements.gamePackTofuButton.disabled;
`, context);

  assert.strictEqual(context.dashboardDriverLicense, 'Level 1 · Rookie Carrier');
  assert.strictEqual(context.dashboardTotalXp, '0 XP');
  assert.strictEqual(context.dashboardGear, '0/3');
  assert.strictEqual(context.dashboardPassport, 'The passport opens after your first stamp-worthy delivery.');
  assert(context.dashboardPassportPreview.includes('First Delivery locked'));
  assert.strictEqual(context.dashboardStock, 'Locked');
  assert.strictEqual(context.dashboardReputation, 'Locked');
  assert.strictEqual(context.dashboardShopLevel, 'Quiet');
  assert.strictEqual(context.dashboardShopTeaser, 'The shop is quiet. Complete your first delivery to wake it up.');
  assert.strictEqual(context.dashboardShopHelper, 'The shop is quiet. Complete your first delivery to wake it up.');
  assert.strictEqual(context.dashboardPackDisabled, true);
  assert.strictEqual(context.dashboardPackText, 'Complete First Delivery');
  assert.strictEqual(context.activeDashboardPackDisabled, true);
}

function testProgressiveRevealTeasersUnlockAfterFirstDelivery() {
  const context = loadNoSpillContext({
    window: { location: { search: '?simulator=1' }, localStorage: makeLocalStorage() },
  });
  vm.runInContext(`
function makeNode() {
  return { textContent: "", innerHTML: "", disabled: null };
}
elements = {
  gameDailyTitle: makeNode(),
  gameDailyFlavor: makeNode(),
  gameDailyCargo: makeNode(),
  gameDailyGoal: makeNode(),
  gameDailyReward: makeNode(),
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
  shopLevelBadge: makeNode(),
  shopTofuStock: makeNode(),
  shopReputation: makeNode(),
  shopLevelProgress: makeNode(),
  shopIdleRate: makeNode(),
  packTofuButton: makeNode(),
  packTofuHelper: makeNode(),
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
};
appState.running = false;
appState.calibrating = false;
const firstRunState = defaultGameState();
renderGameDashboard(firstRunState);
renderTofuShop(firstRunState);
renderCollectionPanel(firstRunState);
globalThis.firstReveal = progressiveRevealState(firstRunState);
globalThis.firstPackDisabled = elements.packTofuButton.disabled;
globalThis.firstPackText = elements.packTofuButton.textContent;
globalThis.firstPackHelper = elements.packTofuHelper.textContent;
globalThis.firstUpgradeHtml = elements.shopUpgradeList.innerHTML;
globalThis.firstCharacterHtml = elements.characterList.innerHTML;
globalThis.firstSoundHtml = elements.soundPackList.innerHTML;
globalThis.firstPreviewDisabled = elements.previewSoundButton.disabled;
const simulated = applySimulatedDelivery(
  "smooth_commute",
  firstRunState,
  { now: new Date("2026-06-14T12:00:00.000Z") },
);
renderGameDashboard(simulated.gameState);
renderTofuShop(simulated.gameState);
renderCollectionPanel(simulated.gameState);
globalThis.afterReveal = progressiveRevealState(simulated.gameState);
globalThis.afterDashboardStock = elements.gameShopStock.textContent;
globalThis.afterDashboardPassport = elements.gamePassportEmpty.textContent;
globalThis.afterPackDisabled = elements.packTofuButton.disabled;
globalThis.afterPackText = elements.packTofuButton.textContent;
globalThis.afterUpgradeHtml = elements.shopUpgradeList.innerHTML;
globalThis.afterCharacterHtml = elements.characterList.innerHTML;
globalThis.afterSoundHtml = elements.soundPackList.innerHTML;
globalThis.afterPreviewDisabled = elements.previewSoundButton.disabled;
appState.running = true;
renderTofuShop(simulated.gameState);
renderCollectionPanel(simulated.gameState);
globalThis.activePackDisabled = elements.packTofuButton.disabled;
globalThis.activePreviewDisabled = elements.previewSoundButton.disabled;
`, context);

  assert.strictEqual(context.firstReveal.shop, false);
  assert.strictEqual(context.firstReveal.passport, false);
  assert.strictEqual(context.firstReveal.crew, false);
  assert.strictEqual(context.firstReveal.sounds, false);
  assert.strictEqual(context.firstPackDisabled, true);
  assert.strictEqual(context.firstPackText, 'Complete First Delivery');
  assert(context.firstPackHelper.includes('The shop is quiet'));
  assert(context.firstUpgradeHtml.includes('The press is still cold'));
  assert(context.firstCharacterHtml.includes('No one is on shift yet. Your first delivery may attract help.'));
  assert(!context.firstCharacterHtml.includes('data-character-id'));
  assert(context.firstSoundHtml.includes('New sounds unlock as your delivery reputation grows.'));
  assert(!context.firstSoundHtml.includes('data-sound-pack-id'));
  assert.strictEqual(context.firstPreviewDisabled, true);

  assert.strictEqual(context.afterReveal.shop, true);
  assert.strictEqual(context.afterReveal.passport, true);
  assert.strictEqual(context.afterReveal.crew, true);
  assert.strictEqual(context.afterReveal.sounds, true);
  assert.notStrictEqual(context.afterDashboardStock, 'Locked');
  assert(context.afterDashboardPassport.includes('/13 stamps collected.'));
  assert.strictEqual(context.afterPackDisabled, false);
  assert.strictEqual(context.afterPackText, 'Pack Tofu');
  assert(context.afterUpgradeHtml.includes('data-shop-upgrade="tofu_press"'));
  assert(context.afterCharacterHtml.includes('Angry Tofu Driver'));
  assert(context.afterCharacterHtml.includes('data-character-id="angry_tofu_driver"'));
  assert(context.afterSoundHtml.includes('Retro Arcade'));
  assert(context.afterSoundHtml.includes('data-sound-pack-id="retro_arcade"'));
  assert.strictEqual(context.afterPreviewDisabled, false);
  assert.strictEqual(context.activePackDisabled, true);
  assert.strictEqual(context.activePreviewDisabled, true);
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
  assert(html.includes('alt="Tofu Driver mascot logo"'));
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
  assert.strictEqual(state.shop.reputation, 0);
  assert.strictEqual(state.shop.shopLevel, 1);

  const activePack = context.packTofu(state, { activeDrive: true });
  assert.strictEqual(activePack.ok, false);
  assert.strictEqual(activePack.gameState.shop.tofuStock, 0);

  const lockedPack = context.packTofu(state, { activeDrive: false });
  assert.strictEqual(lockedPack.ok, false);
  assert(lockedPack.reason.includes('The shop is quiet'));

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

  const productionState = context.defaultGameState();
  productionState.shop.upgrades.tofu_press = 2;
  productionState.shop.lastShopTickAt = '2026-06-14T00:00:00.000Z';
  const offline = context.calculateOfflineShopEarnings(
    productionState,
    new Date('2026-06-14T10:00:00.000Z'),
  );
  assert.strictEqual(offline.cappedHours, 8);
  assert.strictEqual(offline.tofuStock, 96);

  const insufficient = context.buyShopUpgrade('tofu_press', context.defaultGameState());
  assert.strictEqual(insufficient.ok, false);

  const funded = context.defaultGameState();
  funded.shop.tofuStock = 500;
  funded.shop.reputation = 300;
  funded.shop.shopLevel = context.getShopLevel(funded.shop.reputation);
  const upgraded = context.buyShopUpgrade('tofu_press', funded);
  assert.strictEqual(upgraded.ok, true);
  assert.strictEqual(upgraded.gameState.shop.upgrades.tofu_press, 1);
  assert(context.getShopProductionRate(upgraded.gameState) > 0);

  assert.strictEqual(context.getShopLevel(0), 1);
  assert.strictEqual(context.getShopLevel(150), 2);
  const catalog = context.getShopUpgradeCatalog();
  assert.strictEqual(
    JSON.stringify(catalog.map((upgrade) => upgrade.id)),
    JSON.stringify(['tofu_press', 'better_boxes', 'shop_sign']),
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
  assert.strictEqual(slow.shop.reputationGained, fast.shop.reputationGained);
  assert(slow.shop.tofuStockGained > 0);
  assert(slow.shop.reputationGained > 0);
  assert(!('storyChapters' in slow.gameState.shop));
  assert(!('contracts' in slow.gameState.shop));

  const practice = context.calculateDeliveryRewards(sampleDeliverySession({
    mode: 'basic',
    qualificationStatus: 'practice',
    waterLeft: 100,
    durationSeconds: 30,
    distanceMiles: 0,
  }), context.defaultGameState());
  assert(practice.shop.tofuStockGained <= 8);
  assert.strictEqual(practice.shop.reputationGained, 0);

  const exportedShop = context.sanitizeShopStateForExport(slow.gameState);
  assert(exportedShop.tofuStock > 0);
  assertNoSensitiveStorageData(exportedShop);
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

function testDeliveryWallKeepsLockedMerchLinksHidden() {
  const context = loadNoSpillContext();
  context.MERCH_LINKS.nospill_club = 'https://supercutecollectibles.com/products/nospill-club';
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

  assert(context.lockedWallHtml.includes('No-Spill Club Gear'));
  assert(!context.lockedWallHtml.includes('https://supercutecollectibles.com/products/nospill-club'));
  assert(!context.lockedWallHtml.includes('Buy unlocked shirt'));
  assert(context.unlockedWallHtml.includes('https://supercutecollectibles.com/products/nospill-club'));
  assert(context.unlockedWallHtml.includes('target="_blank" rel="noopener noreferrer"'));
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
  assert(html.includes('Delivery Complete'));
  [
    '"Cargo Condition"',
    '"XP Gained"',
    '"Skill XP Gained"',
    '"Stamp Earned"',
    '"Daily Delivery Result"',
    '"Delivery Crew"',
    '"New Unlock"',
    '"Shop Rewards"',
    '"No-Spill Club Gear"',
    '"Next Delivery Goal"',
    '"No new stamp"',
  ].forEach((needle) => assert(source.includes(needle), `${needle} missing`));
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
  testProgressiveRevealTeasersUnlockAfterFirstDelivery();
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
  testLongHaulDailyXpCapAndMerchProgress();
  testNoSpillClubGearRequiresRepeatedQualifiedDeliveries();
  testPerfectPourAndDeliveryCrewProgressRules();
  testDriverLicensePassportAndCoachRecap();
  testGameStateStorageIsSummaryOnlyAndCommuteMasteryUsesFingerprints();
  testGameProgressPersistsAcrossReloadSimulation();
  testResetExportAndImportProgressAreScopedAndValidated();
  testTofuShopStatePackIdleAndUpgradeRules();
  testDeliveryToShopRewardsDoNotUseSpeedAndStaySummaryOnly();
  testCharacterAndSoundUnlocksAreLocalCosmeticAndPersisted();
  testDeliverySimulatorIsHiddenLocalAndSummarized();
  testDeliverySimulatorAppliesLocalProgressAndSafeShareLabels();
  testDeliveryWallKeepsLockedMerchLinksHidden();
  testShareOutputIncludesDeliveryLayerAndExcludesSensitiveDetails();
  testResultScreenShowsGameSummarySections();
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
