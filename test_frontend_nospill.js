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
globalThis.classifyRouteType = classifyRouteType;
globalThis.calculateCargoCondition = calculateCargoCondition;
globalThis.evaluateDailyDelivery = evaluateDailyDelivery;
globalThis.calculateDeliveryRewards = calculateDeliveryRewards;
globalThis.awardSkillXP = awardSkillXP;
globalThis.updateMerchProgress = updateMerchProgress;
globalThis.updateCommuteMastery = updateCommuteMastery;
globalThis.buildDeliverySharePayload = buildDeliverySharePayload;
globalThis.sanitizeShareOutput = sanitizeShareOutput;
globalThis.loadGameState = loadGameState;
globalThis.saveGameState = saveGameState;
globalThis.defaultGameState = defaultGameState;
globalThis.levelProgress = levelProgress;
globalThis.routeFingerprintForSession = routeFingerprintForSession;
globalThis.buildShareCardData = buildShareCardData;
globalThis.buildShareText = buildShareText;
globalThis.loadClubState = loadClubState;
globalThis.saveClubState = saveClubState;
globalThis.renderMerchPanel = renderMerchPanel;
globalThis.APP_BRAND = APP_BRAND;
globalThis.CHALLENGE_NAME = CHALLENGE_NAME;
globalThis.CLUB_NAME = CLUB_NAME;
globalThis.TOP_BADGE = TOP_BADGE;
globalThis.MERCH_LABELS = MERCH_LABELS;
globalThis.MERCH_LINKS = MERCH_LINKS;
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

function testTofuDriverArtworkIsIsolatedAndAccessible() {
  const html = fs.readFileSync(NOSPILL_HTML, 'utf8');
  const logoPath = path.join(NOSPILL_ASSETS_DIR, 'tofu-driver-logo.png');
  const shirtPath = path.join(NOSPILL_ASSETS_DIR, 'tofu-driver-shirt-1.png');

  assert(fs.existsSync(logoPath), 'Tofu Driver logo asset should exist');
  assert(fs.existsSync(shirtPath), 'No-Spill Club shirt preview asset should exist');
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
  assert(!/routeSamples|raw|coords|latitude|longitude|lat|lon|trace|street|map/i.test(stored));
  assert(second.commuteMasteryMessage.includes('familiar delivery'));
  const fingerprints = Object.keys(second.gameState.routeMastery);
  assert(fingerprints.length >= 1);
  assert(!fingerprints[0].includes('37.'));
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
  assert(source.includes('tofuX'));
  assert(source.includes('lateralG'));
  assert(source.includes('longitudinalG'));
  assert(source.includes('Cargo Condition'));
  assert(source.includes('context.ellipse(0, tofuHeight * 0.64'));
  assert(source.includes('tofuWidth * 0.32'));
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
  testTofuDriverArtworkIsIsolatedAndAccessible();
  testSuperCuteCollectiblesLandingAndMerchCopy();
  testNoSpillClientDoesNotUploadRawRunData();
  testNoSpillLiveSummaryAndShareAvoidSensitiveDetails();
  testShareConfigAndCardData();
  testLockedMerchLinksAreNotShownBeforeUnlock();
  testDailyDeliverySelectionAndEvaluation();
  testRouteTypeClassification();
  testDeliveryRewardsDoNotUseSpeedAndRespectMajorUnlockContext();
  testLongHaulDailyXpCapAndMerchProgress();
  testNoSpillClubGearRequiresRepeatedQualifiedDeliveries();
  testGameStateStorageIsSummaryOnlyAndCommuteMasteryUsesFingerprints();
  testShareOutputIncludesDeliveryLayerAndExcludesSensitiveDetails();
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
