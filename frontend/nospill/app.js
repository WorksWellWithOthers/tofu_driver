"use strict";

const GRAVITY_METERS_PER_SECOND = 9.80665;
const MIN_CALIBRATION_SAMPLES = 18;
const CALIBRATION_TARGET_SAMPLES = 35;
const CALIBRATION_MIN_MS = 1100;
const CALIBRATION_TIMEOUT_MS = 3600;
const LOW_PASS_ALPHA = 0.18;
const MIN_MOVEMENT_MPH = 10;
const STORAGE_KEY = "nospill.club.v1";
const GAME_STORAGE_KEY = "tofuDriverGameStateV1";
const DEFAULT_AUDIO_LEVEL = "normal";
const APP_BRAND = "Tofu Driver";
const GAME_LAYER_NAME = "Delivery Log";
const CHALLENGE_NAME = "The Cup Test";
const CLUB_NAME = "No-Spill Club";
const TOP_BADGE = "Perfect Pour";
const TAGLINE_CUP = "Don't spill the cup.";
const TAGLINE_SMOOTHER = "Not faster. Smoother.";
const TOFU_CARGO_MASCOT_SRC = "/static/nospill/assets/tofu-driver-app-image.png";

const DIFFICULTIES = {
  comfort: { label: "Comfort Cup", thresholdG: 0.2 },
  standard: { label: "Standard Cup", thresholdG: 0.3 },
  beginner: { label: "Beginner Cup", thresholdG: 0.4 },
};

const DEVICE_AXES = ["x", "y", "z"];

const MOUNT_PRESETS = {
  flat: {
    mode: "flat",
    lateralAxis: "x",
    lateralInvert: false,
    longitudinalAxis: "y",
    longitudinalInvert: false,
  },
  upright: {
    mode: "upright",
    lateralAxis: "x",
    lateralInvert: false,
    longitudinalAxis: "z",
    longitudinalInvert: false,
  },
  custom: {
    mode: "custom",
    lateralAxis: "x",
    lateralInvert: false,
    longitudinalAxis: "y",
    longitudinalInvert: false,
  },
};

const DEFAULT_MOUNT_CONFIG = MOUNT_PRESETS.flat;

const AUDIO_LEVELS = {
  muted: { label: "Muted", baseGain: 0, maxGain: 0 },
  normal: { label: "Normal", baseGain: 0.11, maxGain: 0.3 },
  loud: { label: "Loud", baseGain: 0.18, maxGain: 0.45 },
};

const SHARE_CONFIG = {
  includeAppLink: false,
  appUrl: null,
  includeDistanceInShare: false,
};

const DISCORD_CONFIG = {
  enabled: false,
  inviteUrl: null,
};

const QUALIFICATION_RULES = {
  minDurationSeconds: 180,
  minDistanceMiles: 1,
  minMovingDurationSeconds: 120,
  minMedianMovingSpeedMph: MIN_MOVEMENT_MPH,
  minPercentSamplesAboveMinSpeed: 60,
  minGpsAccuracyPercent: 70,
  maxImpossibleGpsJumpPercent: 15,
  maxImpossibleMotionSpikePercent: 5,
  maxOrientationUnstablePercent: 25,
};

// TODO: Real merch gating needs backend-issued unlock tokens, Shopify customer tags,
// or another server-side access control layer. Unlisted Shopify links are unlisted,
// not secure.
const MERCH_LINKS = {
  smooth_driver: null,
  nospill_club: null,
  perfect_pour: null,
  technical_pour: null,
  certified_smooth: null,
};

const MILESTONE_LABELS = {
  first_pour: "First Pour",
  half_cup_hero: "Half Cup Hero",
  smooth_driver: "Smooth Driver",
  nospill_club: CLUB_NAME,
  perfect_pour: TOP_BADGE,
  qualified_pour: "Qualified Pour",
  long_pour: "Long Pour",
  smooth_commuter: "Smooth Commuter",
  curve_control: "Curve Control",
  technical_pour: "Technical Pour",
  very_technical_pour: "Very Technical Pour",
  certified_smooth: "Certified Smooth",
  passenger_approved: "Passenger Approved",
};

const MERCH_MILESTONES = [
  "smooth_driver",
  "nospill_club",
  "perfect_pour",
  "technical_pour",
  "certified_smooth",
];

const MERCH_LABELS = {
  smooth_driver: "Tofu Driver Delivery Crew",
  nospill_club: `${CLUB_NAME} Tee`,
  perfect_pour: `${TOP_BADGE} Decal`,
  technical_pour: "Technical Pour Tee",
  certified_smooth: "Certified Smooth Gear",
};

const CARGO_PROFILES = [
  {
    id: "silken_tofu",
    name: "Silken Tofu",
    cargo: "Silken Tofu",
    description: "Soft tofu that rewards calm, balanced inputs.",
    focus: "Overall smoothness",
    goal: "Finish a delivery with 85%+ cargo condition.",
    reward: "Daily Delivery stamp and smoothness XP",
    scoringEmphasis: "Total cargo condition",
    suggestedStamp: "daily_delivery_complete",
    routeMatch: "Calm Cruise",
  },
  {
    id: "hot_tea",
    name: "Hot Tea",
    cargo: "Hot Tea",
    description: "A full cup that notices side-to-side motion.",
    focus: "Corner calm",
    goal: "Preserve cargo while keeping lateral input smooth.",
    reward: "Corner Calm XP",
    scoringEmphasis: "Low lateral jerk and smooth side-to-side motion",
    suggestedStamp: "curve_control",
    routeMatch: "Mixed Route",
  },
  {
    id: "soup_bowl",
    name: "Soup Bowl",
    cargo: "Soup Bowl",
    description: "A warm bowl that rewards gentle starts and stops.",
    focus: "Brake and throttle restraint",
    goal: "Avoid harsh braking and acceleration spikes.",
    reward: "Brake Feather and Throttle Control XP",
    scoringEmphasis: "Harsh braking and acceleration control",
    suggestedStamp: "passenger_approved",
    routeMatch: "City Delivery",
  },
  {
    id: "egg_carton",
    name: "Egg Carton",
    cargo: "Egg Carton",
    description: "Fragile cargo that rewards no-panic inputs.",
    focus: "No panic inputs",
    goal: "Keep total harsh inputs low.",
    reward: "Passenger Comfort XP",
    scoringEmphasis: "Very low spike count",
    suggestedStamp: "no_panic_inputs",
    routeMatch: "Calm Cruise",
  },
  {
    id: "glass_bottle",
    name: "Glass Bottle",
    cargo: "Glass Bottle",
    description: "Tall cargo that rewards consistency over the full session.",
    focus: "Consistency",
    goal: "Avoid repeated jerk and spike events.",
    reward: "Consistency XP",
    scoringEmphasis: "Stable cargo condition over session",
    suggestedStamp: "daily_delivery_complete",
    routeMatch: "Technical Route",
  },
  {
    id: "wedding_cake",
    name: "Wedding Cake",
    cargo: "Wedding Cake",
    description: "A longer delivery that rewards patience and restraint.",
    focus: "Longer smooth delivery",
    goal: "Finish a longer qualified delivery with stable cargo.",
    reward: "Long Haul progress",
    scoringEmphasis: "Duration plus consistency, not speed",
    suggestedStamp: "long_haul_pour",
    routeMatch: "Long Haul",
  },
];

const DAILY_DELIVERIES = CARGO_PROFILES;

const DRIVER_LICENSES = [
  { minLevel: 1, label: "Rookie Carrier" },
  { minLevel: 3, label: "Cup Courier" },
  { minLevel: 6, label: "Smooth Driver" },
  { minLevel: 10, label: "No-Spill Candidate" },
  { minLevel: 15, label: "Certified Tofu Driver" },
  { minLevel: 21, label: "Perfect Pour Courier" },
  { minLevel: 30, label: "Delivery Legend" },
];

const SHOP_MAX_RESOURCE = 1000000000;
const SHOP_OFFLINE_CAP_HOURS = 8;

const SHOP_UPGRADES = [
  {
    id: "tofu_press",
    name: "Tofu Press",
    description: "A tidy prep station that makes idle tofu stock more reliable.",
    costTofuStock: 45,
    costReputation: 0,
    requiredShopLevel: 1,
    effect: "Increases idle tofu stock per hour.",
    maxLevel: 5,
  },
  {
    id: "better_boxes",
    name: "Better Boxes",
    description: "Cleaner delivery packaging turns completed deliveries into a little more tofu stock.",
    costTofuStock: 75,
    costReputation: 0,
    requiredShopLevel: 1,
    effect: "Adds a modest tofu stock bonus after completed deliveries.",
    maxLevel: 4,
  },
  {
    id: "shop_sign",
    name: "Shop Sign",
    description: "A warmer storefront helps smooth qualified deliveries build reputation.",
    costTofuStock: 120,
    costReputation: 0,
    requiredShopLevel: 2,
    effect: "Adds a modest reputation bonus for qualified smooth deliveries.",
    maxLevel: 4,
  },
];

const CHARACTER_CATALOG = [
  {
    id: "angry_tofu_driver",
    name: "Angry Tofu Driver",
    role: "Driver",
    unlock: "First Delivery",
    flavor: "Tiny, furious, and extremely committed to cup stability.",
  },
  {
    id: "sleepy_dispatcher",
    name: "Sleepy Dispatcher",
    role: "Shop Staff",
    unlock: "Shop Level 2",
    flavor: "Somehow remembers every order while half-asleep.",
  },
  {
    id: "tea_master",
    name: "Tea Master",
    role: "Customer",
    unlock: "Complete a Hot Tea delivery with 90%+ Cargo Condition",
    flavor: "Judges every corner by the ripple in the cup.",
  },
  {
    id: "perfect_pour_courier",
    name: "Perfect Pour Courier",
    role: "Legend",
    unlock: "Perfect Pour",
    flavor: "Arrives with the cup exactly as it left.",
  },
];

const SOUND_PACK_CATALOG = [
  {
    id: "default",
    name: "Default",
    unlock: "Always available",
    behavior: "Current calm UI tones.",
    description: "Simple, quiet tones for parked and result screens.",
  },
  {
    id: "tofu_shop_bell",
    name: "Tofu Shop Bell",
    unlock: "Shop Level 2",
    behavior: "Gentle bell on parked shop actions and delivery complete.",
    description: "A soft shop bell for parked actions and result reveals.",
  },
  {
    id: "retro_arcade",
    name: "Retro Arcade",
    unlock: "First Stamp or 3 deliveries",
    behavior: "Subtle retro UI blips for parked/result screens.",
    description: "Small arcade-style blips for menus and result screens.",
  },
  {
    id: "perfect_pour_chime",
    name: "Perfect Pour Chime",
    unlock: "Perfect Pour",
    behavior: "Special post-run chime only after the run ends.",
    description: "A short celebratory chime for Perfect Pour moments.",
  },
];

const SKILL_LABELS = {
  brakeFeather: "Brake Feather",
  throttleControl: "Throttle Control",
  smoothHands: "Smooth Hands",
  cornerCalm: "Corner Calm",
  passengerComfort: "Passenger Comfort",
  consistency: "Consistency",
};

const STAMP_LABELS = {
  first_delivery: "First Delivery",
  daily_delivery_complete: "Daily Delivery Complete",
  cup_stayed_full: "Cup Stayed Full",
  smooth_commute: "Smooth Commute",
  calm_cruise: "Calm Cruise",
  city_smooth: "City Smooth",
  long_haul_pour: "Long Haul Pour",
  curve_control: "Curve Control",
  technical_pour: "Technical Pour",
  no_panic_inputs: "No Panic Inputs",
  passenger_approved: "Passenger Approved",
  nospill_club: CLUB_NAME,
  perfect_pour: TOP_BADGE,
};

const TOFU_VISUAL = {
  spring: 0.13,
  damping: 0.74,
  reducedMotionSpring: 0.42,
  maxRotationRadians: Math.PI / 10,
  particleLifeFrames: 34,
};

const appState = {
  mode: "basic",
  difficulty: "standard",
  mountConfig: { ...DEFAULT_MOUNT_CONFIG },
  audioLevel: DEFAULT_AUDIO_LEVEL,
  audioEnabled: true,
  calibrating: false,
  running: false,
  calibrationStartedMs: 0,
  calibrationSamples: [],
  calibrationNeutral: null,
  calibrationGravity: null,
  currentG: { lateralG: 0, longitudinalG: 0, totalG: 0, jerk: 0 },
  filteredAcceleration: null,
  gravityFiltered: null,
  lastMotionMs: null,
  startPerformanceMs: 0,
  startIso: "",
  waterLeft: 100,
  motion: null,
  harshCooldowns: {},
  routeSamples: [],
  geoWatchId: null,
  geoStatus: "inactive",
  audio: null,
  lastSummary: null,
  tofuVisual: defaultTofuVisualState(),
  renderPending: false,
  axisPreviewActive: false,
  axisPreviewBaseline: null,
  axisPreviewFiltered: null,
};

let elements = {};
let tofuCargoMascotImage = null;

function clamp(value, minValue, maxValue) {
  return Math.min(maxValue, Math.max(minValue, value));
}

function roundTo(value, decimals) {
  const scale = 10 ** decimals;
  return Math.round(Number(value || 0) * scale) / scale;
}

function defaultTofuVisualState() {
  return {
    tofuX: 0,
    tofuY: 0,
    tofuVx: 0,
    tofuVy: 0,
    tofuRotation: 0,
    tofuRotationVelocity: 0,
    tofuSquish: 0,
    recentSpillParticles: [],
    lastSpillFrame: 0,
  };
}

function prefersReducedMotion() {
  return Boolean(
    typeof window !== "undefined"
    && window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
}

function getTofuCargoMascotImage() {
  if (tofuCargoMascotImage) return tofuCargoMascotImage;
  if (typeof Image === "undefined") return null;
  tofuCargoMascotImage = new Image();
  tofuCargoMascotImage.decoding = "async";
  tofuCargoMascotImage.onload = () => {
    if (elements.cupCanvas) {
      drawCupCanvas(elements.cupCanvas, appState.currentG, appState.waterLeft);
    }
  };
  tofuCargoMascotImage.src = TOFU_CARGO_MASCOT_SRC;
  return tofuCargoMascotImage;
}

function isImageReady(image) {
  return Boolean(image && image.complete && image.naturalWidth > 0);
}

function normalizeAudioLevel(level) {
  if (level === "quiet") return DEFAULT_AUDIO_LEVEL;
  return AUDIO_LEVELS[level] ? level : DEFAULT_AUDIO_LEVEL;
}

function audioInputIntensity(totalG, thresholdG) {
  return clamp(Number(totalG || 0) / Math.max(Number(thresholdG || 0), 0.05), 0, 2);
}

function computeAudioTargetGain({
  totalG,
  thresholdG,
  audioLevel = DEFAULT_AUDIO_LEVEL,
  audioEnabled = true,
}) {
  if (!audioEnabled) return 0;
  const level = AUDIO_LEVELS[normalizeAudioLevel(audioLevel)];
  if (level.maxGain <= 0) return 0;
  const intensity = audioInputIntensity(totalG, thresholdG);
  const response = clamp(Math.pow(intensity / 2, 1.1), 0, 1);
  return clamp(
    level.baseGain + response * (level.maxGain - level.baseGain),
    0,
    level.maxGain,
  );
}

function computeAudioTargetFrequency({ totalG, thresholdG }) {
  const intensity = audioInputIntensity(totalG, thresholdG);
  return clamp(170 + Math.pow(intensity, 1.15) * 195, 170, 620);
}

function cosmeticSoundVolume(audioLevel = DEFAULT_AUDIO_LEVEL, audioEnabled = true) {
  if (!audioEnabled) return 0;
  const level = AUDIO_LEVELS[normalizeAudioLevel(audioLevel)];
  if (!level || level.maxGain <= 0) return 0;
  return clamp(level.maxGain * 0.18, 0, 0.09);
}

function soundPattern(soundPackId, eventName) {
  const pack = SOUND_PACK_CATALOG.some((candidate) => candidate.id === soundPackId)
    ? soundPackId
    : "default";
  if (eventName === "perfect_pour") return [660, 880, 990];
  if (pack === "tofu_shop_bell") return [520, 780];
  if (pack === "retro_arcade") return [440, 660, 880];
  if (pack === "perfect_pour_chime") return [640, 820, 1040];
  if (eventName === "unlock") return [480, 720];
  return [360];
}

function playSynthToneSequence(frequencies, volume) {
  if (typeof window === "undefined") return false;
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return false;
  try {
    const context = new AudioContextConstructor();
    const now = context.currentTime;
    frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = now + index * 0.09;
      const stop = start + 0.08;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, stop);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(stop + 0.02);
    });
    window.setTimeout(() => {
      try {
        context.close();
      } catch (_) {
        // Ignore cleanup races.
      }
    }, Math.max(160, frequencies.length * 110));
    return true;
  } catch (_) {
    return false;
  }
}

function playCosmeticSound(eventName, gameState = loadGameState(), options = {}) {
  if (options.activeDrive) return { played: false, reason: "active-drive" };
  if (options.requireUserGesture && !options.userGesture) {
    return { played: false, reason: "needs-user-gesture" };
  }
  const audioLevel = normalizeAudioLevel(options.audioLevel || appState.audioLevel);
  const audioEnabled = options.audioEnabled !== undefined
    ? Boolean(options.audioEnabled)
    : Boolean(appState.audioEnabled);
  const volume = cosmeticSoundVolume(audioLevel, audioEnabled);
  if (volume <= 0) return { played: false, reason: "muted" };
  const pack = selectedSoundPack(gameState);
  const played = playSynthToneSequence(soundPattern(pack.id, eventName), volume);
  return {
    played,
    reason: played ? "" : "audio-unavailable",
    soundPackId: pack.id,
  };
}

function previewSoundPack(gameState = loadGameState(), options = {}) {
  return playCosmeticSound("preview", gameState, {
    ...options,
    requireUserGesture: true,
  });
}

function vectorFromMotion(motionVector) {
  if (!motionVector) return null;
  const x = Number(motionVector.x);
  const y = Number(motionVector.y);
  const z = Number(motionVector.z);
  if (![x, y, z].every(Number.isFinite)) return null;
  return { x, y, z };
}

function isDeviceAxis(axis) {
  return DEVICE_AXES.includes(axis);
}

function mountPreset(mode) {
  return MOUNT_PRESETS[mode] || MOUNT_PRESETS.flat;
}

function normalizeMountConfig(config) {
  const source = config && typeof config === "object" ? config : {};
  const mode = ["flat", "upright", "custom"].includes(source.mode)
    ? source.mode
    : "flat";
  const preset = mountPreset(mode);
  if (mode === "flat") return { ...preset };
  if (mode === "upright") {
    return {
      ...preset,
      longitudinalInvert: Boolean(source.longitudinalInvert),
    };
  }
  return {
    mode: "custom",
    lateralAxis: isDeviceAxis(source.lateralAxis) ? source.lateralAxis : "x",
    lateralInvert: Boolean(source.lateralInvert),
    longitudinalAxis: isDeviceAxis(source.longitudinalAxis)
      ? source.longitudinalAxis
      : "y",
    longitudinalInvert: Boolean(source.longitudinalInvert),
  };
}

function deviceAxisValue(vector, axis) {
  if (!vector || !isDeviceAxis(axis)) return 0;
  return Number(vector[axis] || 0);
}

function mapAccelerationToVehicle(vector, mountConfig = DEFAULT_MOUNT_CONFIG) {
  const config = normalizeMountConfig(mountConfig);
  const lateralSign = config.lateralInvert ? -1 : 1;
  const longitudinalSign = config.longitudinalInvert ? -1 : 1;
  return {
    lateral: deviceAxisValue(vector, config.lateralAxis) * lateralSign,
    longitudinal:
      deviceAxisValue(vector, config.longitudinalAxis) * longitudinalSign,
  };
}

function computeMappedMotion(
  currentAcceleration,
  previousAcceleration,
  mountConfig,
  deltaSeconds,
) {
  const mapped = mapAccelerationToVehicle(currentAcceleration, mountConfig);
  const lateralG = mapped.lateral / GRAVITY_METERS_PER_SECOND;
  const longitudinalG = mapped.longitudinal / GRAVITY_METERS_PER_SECOND;
  const totalG = Math.sqrt(lateralG ** 2 + longitudinalG ** 2);

  let jerk = 0;
  if (previousAcceleration) {
    const previousMapped = mapAccelerationToVehicle(
      previousAcceleration,
      mountConfig,
    );
    const previousLateral = previousMapped.lateral / GRAVITY_METERS_PER_SECOND;
    const previousLongitudinal =
      previousMapped.longitudinal / GRAVITY_METERS_PER_SECOND;
    const jerkLateral = (lateralG - previousLateral) / deltaSeconds;
    const jerkLongitudinal = (longitudinalG - previousLongitudinal) / deltaSeconds;
    jerk = Math.sqrt(jerkLateral ** 2 + jerkLongitudinal ** 2);
  }

  return { lateralG, longitudinalG, totalG, jerk };
}

function updateTofuCargoVisualState(
  visualState,
  currentG,
  {
    thresholdG = DIFFICULTIES.standard.thresholdG,
    maxOffset = 1,
    reducedMotion = false,
    frame = 0,
  } = {},
) {
  const state = visualState || defaultTofuVisualState();
  const safeThreshold = Math.max(Number(thresholdG || 0), 0.05);
  const lateral = clamp(Number(currentG && currentG.lateralG) || 0, -safeThreshold * 1.35, safeThreshold * 1.35);
  const longitudinal = clamp(Number(currentG && currentG.longitudinalG) || 0, -safeThreshold * 1.35, safeThreshold * 1.35);
  const totalG = Math.max(0, Number(currentG && currentG.totalG) || 0);
  const jerk = Math.max(0, Number(currentG && currentG.jerk) || 0);
  const targetX = clamp((lateral / safeThreshold) * maxOffset, -maxOffset, maxOffset);
  const targetY = clamp((-longitudinal / safeThreshold) * maxOffset, -maxOffset, maxOffset);

  if (reducedMotion) {
    state.tofuX += (targetX - state.tofuX) * TOFU_VISUAL.reducedMotionSpring;
    state.tofuY += (targetY - state.tofuY) * TOFU_VISUAL.reducedMotionSpring;
    state.tofuVx = 0;
    state.tofuVy = 0;
    state.tofuRotation *= 0.8;
    state.tofuRotationVelocity = 0;
    state.tofuSquish = 0;
    state.recentSpillParticles = [];
    return state;
  }

  state.tofuVx += (targetX - state.tofuX) * TOFU_VISUAL.spring;
  state.tofuVy += (targetY - state.tofuY) * TOFU_VISUAL.spring;
  state.tofuVx *= TOFU_VISUAL.damping;
  state.tofuVy *= TOFU_VISUAL.damping;
  state.tofuX = clamp(state.tofuX + state.tofuVx, -maxOffset * 1.08, maxOffset * 1.08);
  state.tofuY = clamp(state.tofuY + state.tofuVy, -maxOffset * 1.08, maxOffset * 1.08);

  const rotationTarget = clamp(
    state.tofuVx * 0.55 - state.tofuY * 0.13 + lateral * 0.75,
    -TOFU_VISUAL.maxRotationRadians,
    TOFU_VISUAL.maxRotationRadians,
  );
  state.tofuRotationVelocity += (rotationTarget - state.tofuRotation) * 0.18;
  state.tofuRotationVelocity *= 0.76;
  state.tofuRotation = clamp(
    state.tofuRotation + state.tofuRotationVelocity,
    -TOFU_VISUAL.maxRotationRadians,
    TOFU_VISUAL.maxRotationRadians,
  );
  state.tofuSquish = clamp(
    totalG / safeThreshold - 0.65 + Math.min(0.45, jerk / 6),
    0,
    1,
  );

  const spilling = totalG > safeThreshold;
  if (spilling && frame - state.lastSpillFrame > 8) {
    const edgeX = clamp(state.tofuX / maxOffset, -1, 1);
    const edgeY = clamp(state.tofuY / maxOffset, -1, 1);
    state.recentSpillParticles.push({
      x: edgeX,
      y: edgeY,
      vx: edgeX * 0.012,
      vy: edgeY * 0.012 - 0.006,
      age: 0,
      life: TOFU_VISUAL.particleLifeFrames,
    });
    state.lastSpillFrame = frame;
  }
  state.recentSpillParticles = state.recentSpillParticles
    .map((particle) => ({
      ...particle,
      x: particle.x + particle.vx,
      y: particle.y + particle.vy,
      age: particle.age + 1,
    }))
    .filter((particle) => particle.age < particle.life)
    .slice(-8);
  return state;
}

function subtractVector(left, right) {
  if (!left || !right) return null;
  return {
    x: left.x - right.x,
    y: left.y - right.y,
    z: left.z - right.z,
  };
}

function averageVector(samples) {
  if (!Array.isArray(samples) || samples.length === 0) return null;
  const sum = samples.reduce(
    (acc, sample) => ({
      x: acc.x + sample.x,
      y: acc.y + sample.y,
      z: acc.z + sample.z,
    }),
    { x: 0, y: 0, z: 0 },
  );
  return {
    x: sum.x / samples.length,
    y: sum.y / samples.length,
    z: sum.z / samples.length,
  };
}

function vectorMagnitude(vector) {
  if (!vector) return 0;
  return Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
}

function lowPassVector(previous, next, alpha) {
  if (!previous) return next;
  return {
    x: previous.x + alpha * (next.x - previous.x),
    y: previous.y + alpha * (next.y - previous.y),
    z: previous.z + alpha * (next.z - previous.z),
  };
}

function vectorAngleDegrees(left, right) {
  const leftMagnitude = vectorMagnitude(left);
  const rightMagnitude = vectorMagnitude(right);
  if (leftMagnitude <= 0 || rightMagnitude <= 0) return 0;
  const dot = left.x * right.x + left.y * right.y + left.z * right.z;
  const ratio = clamp(dot / (leftMagnitude * rightMagnitude), -1, 1);
  return Math.acos(ratio) * (180 / Math.PI);
}

function formatPercent(value) {
  return `${roundTo(value, 1).toFixed(1)}%`;
}

function formatDuration(seconds) {
  const totalSeconds = Math.max(0, Math.round(Number(seconds || 0)));
  const minutes = Math.floor(totalSeconds / 60);
  const remaining = totalSeconds % 60;
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function rankForWater(waterLeft) {
  const value = Number(waterLeft || 0);
  if (value >= 99.95) return TOP_BADGE;
  if (value >= 95) return CLUB_NAME;
  if (value >= 75) return "Smooth Driver";
  if (value >= 50) return "Half Cup Hero";
  return "Floor Mat Casualty";
}

function routeDifficultyLabel(score) {
  const value = Number(score || 0);
  if (value >= 0.75) return "Very Technical Route";
  if (value >= 0.5) return "Technical Route";
  if (value >= 0.25) return "Mixed Route";
  return "Easy Route";
}

function computeWaterLoss({ totalG, thresholdG, jerk, deltaSeconds }) {
  if (totalG <= thresholdG || deltaSeconds <= 0) return 0;
  const severityRatio = (totalG - thresholdG) / Math.max(thresholdG, 0.05);
  const sustainedLoss = Math.pow(severityRatio, 1.4) * 0.18 * deltaSeconds;
  const jerkLoss = Math.max(0, jerk - 1.1) * 0.018;
  return clamp(sustainedLoss + Math.min(0.14, jerkLoss), 0, 2.5);
}

function resetSessionState() {
  appState.calibrationSamples = [];
  appState.calibrationNeutral = null;
  appState.calibrationGravity = null;
  appState.currentG = { lateralG: 0, longitudinalG: 0, totalG: 0, jerk: 0 };
  appState.filteredAcceleration = null;
  appState.gravityFiltered = null;
  appState.lastMotionMs = null;
  appState.startPerformanceMs = 0;
  appState.startIso = "";
  appState.waterLeft = 100;
  appState.harshCooldowns = {};
  appState.routeSamples = [];
  appState.geoStatus = "inactive";
  appState.lastSummary = null;
  appState.tofuVisual = defaultTofuVisualState();
  appState.motion = {
    samples: 0,
    harshBraking: 0,
    harshAcceleration: 0,
    harshLateral: 0,
    abruptTransitions: 0,
    lateralJerk: 0,
    impossibleSpikes: 0,
    orientationSamples: 0,
    orientationUnstableSamples: 0,
    peakG: 0,
    peakJerk: 0,
  };
}

function safeLocalStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch (_) {
    return null;
  }
}

function defaultClubState() {
  return {
    bestWaterScore: 0,
    completedSessionCount: 0,
    unlockedMilestones: {},
    qualifiedSmoothDates: [],
    savedSessions: [],
    mountConfig: { ...DEFAULT_MOUNT_CONFIG },
    audioLevel: DEFAULT_AUDIO_LEVEL,
  };
}

function defaultGameState() {
  return {
    version: 1,
    totalXP: 0,
    level: 1,
    skillXP: Object.fromEntries(
      Object.keys(SKILL_LABELS).map((skill) => [skill, 0]),
    ),
    stamps: {},
    dailyDeliveries: {},
    streak: { current: 0, lastCompletedDate: null },
    merchProgress: {
      nospillClubGear: { count: 0, target: 3, dates: [], meaningfulCount: 0, unlocked: false },
      perfectPourDrop: { unlocked: false, date: null },
      deliveryCrew: { count: 0, target: 7, dates: [], unlocked: false },
    },
    recentRewards: [],
    recentSessions: [],
    xpByDate: {},
    routeMastery: {},
    shop: defaultShopState(),
    collection: defaultCollectionState(),
  };
}

function loadClubState() {
  const storage = safeLocalStorage();
  if (!storage) return defaultClubState();
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || "{}");
    const stored = parsed && typeof parsed === "object" ? parsed : {};
    return {
      ...defaultClubState(),
      ...stored,
      unlockedMilestones:
        typeof stored.unlockedMilestones === "object"
          ? stored.unlockedMilestones
          : {},
      qualifiedSmoothDates: Array.isArray(stored.qualifiedSmoothDates)
        ? stored.qualifiedSmoothDates
        : [],
      savedSessions: Array.isArray(stored.savedSessions) ? stored.savedSessions : [],
      mountConfig: normalizeMountConfig(stored.mountConfig),
      audioLevel: normalizeAudioLevel(stored.audioLevel),
    };
  } catch (_) {
    return defaultClubState();
  }
}

function normalizeSkillXP(skillXP) {
  const source = skillXP && typeof skillXP === "object" ? skillXP : {};
  return Object.fromEntries(
    Object.keys(SKILL_LABELS).map((skill) => [
      skill,
      Math.max(0, Math.round(Number(source[skill] || 0))),
    ]),
  );
}

function safeNonNegativeNumber(value, fallback = 0, maxValue = SHOP_MAX_RESOURCE) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return fallback;
  return Math.min(numeric, maxValue);
}

function safeNonNegativeInteger(value, fallback = 0, maxValue = SHOP_MAX_RESOURCE) {
  return Math.round(safeNonNegativeNumber(value, fallback, maxValue));
}

function defaultShopState() {
  return {
    tofuStock: 0,
    reputation: 0,
    shopLevel: 1,
    lifetimeTofuPacked: 0,
    lifetimeReputation: 0,
    upgrades: {},
    lastShopTickAt: "",
    offlineEarnings: {
      tofuStock: 0,
      cappedHours: 0,
    },
  };
}

function normalizeUpgradeLevels(upgrades) {
  const source = upgrades && typeof upgrades === "object" ? upgrades : {};
  return Object.fromEntries(
    SHOP_UPGRADES.map((upgrade) => {
      const raw = source[upgrade.id];
      const value = raw && typeof raw === "object" ? raw.level : raw;
      return [
        upgrade.id,
        clamp(
          safeNonNegativeInteger(value, 0, upgrade.maxLevel),
          0,
          upgrade.maxLevel,
        ),
      ];
    }),
  );
}

function normalizeShopState(shop) {
  const defaults = defaultShopState();
  const source = shop && typeof shop === "object" ? shop : {};
  const reputation = safeNonNegativeInteger(source.reputation, defaults.reputation);
  return {
    ...defaults,
    tofuStock: safeNonNegativeInteger(source.tofuStock, defaults.tofuStock),
    reputation,
    shopLevel: getShopLevel(reputation),
    lifetimeTofuPacked: safeNonNegativeInteger(
      source.lifetimeTofuPacked,
      defaults.lifetimeTofuPacked,
    ),
    lifetimeReputation: Math.max(
      reputation,
      safeNonNegativeInteger(source.lifetimeReputation, defaults.lifetimeReputation),
    ),
    upgrades: normalizeUpgradeLevels(source.upgrades),
    lastShopTickAt: typeof source.lastShopTickAt === "string" ? source.lastShopTickAt : "",
    offlineEarnings: {
      tofuStock: safeNonNegativeInteger(
        source.offlineEarnings && source.offlineEarnings.tofuStock,
        0,
      ),
      cappedHours: safeNonNegativeNumber(
        source.offlineEarnings && source.offlineEarnings.cappedHours,
        0,
        SHOP_OFFLINE_CAP_HOURS,
      ),
    },
  };
}

function knownCharacterIds() {
  return new Set(CHARACTER_CATALOG.map((character) => character.id));
}

function knownSoundPackIds() {
  return new Set(SOUND_PACK_CATALOG.map((soundPack) => soundPack.id));
}

function normalizeIdList(value, allowedIds) {
  const ids = Array.isArray(value) ? value : [];
  const seen = new Set();
  return ids.filter((id) => {
    if (typeof id !== "string" || seen.has(id)) return false;
    if (allowedIds && !allowedIds.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function defaultCollectionState() {
  return {
    selectedCharacterId: "angry_tofu_driver",
    unlockedCharacterIds: [],
    selectedSoundPackId: "default",
    unlockedSoundPackIds: ["default"],
    seenUnlockIds: [],
  };
}

function normalizeCollectionState(collection) {
  const defaults = defaultCollectionState();
  const source = collection && typeof collection === "object" ? collection : {};
  const characterIds = knownCharacterIds();
  const soundPackIds = knownSoundPackIds();
  const unlockedCharacterIds = normalizeIdList(source.unlockedCharacterIds, characterIds);
  const unlockedSoundPackIds = normalizeIdList(source.unlockedSoundPackIds, soundPackIds);
  if (!unlockedSoundPackIds.includes("default")) unlockedSoundPackIds.unshift("default");
  const selectedCharacterId = characterIds.has(source.selectedCharacterId)
    ? source.selectedCharacterId
    : defaults.selectedCharacterId;
  const selectedSoundPackId =
    soundPackIds.has(source.selectedSoundPackId)
    && unlockedSoundPackIds.includes(source.selectedSoundPackId)
      ? source.selectedSoundPackId
      : defaults.selectedSoundPackId;
  return {
    selectedCharacterId,
    unlockedCharacterIds,
    selectedSoundPackId,
    unlockedSoundPackIds,
    seenUnlockIds: normalizeIdList(source.seenUnlockIds),
  };
}

function normalizeGameState(stored) {
  const defaults = defaultGameState();
  const source = stored && typeof stored === "object" ? stored : {};
  const merch = source.merchProgress && typeof source.merchProgress === "object"
    ? source.merchProgress
    : {};
  const normalized = {
    ...defaults,
    ...source,
    totalXP: Math.max(0, Math.round(Number(source.totalXP || 0))),
    skillXP: normalizeSkillXP(source.skillXP),
    stamps:
      source.stamps && typeof source.stamps === "object"
        ? JSON.parse(JSON.stringify(source.stamps))
        : {},
    dailyDeliveries:
      source.dailyDeliveries && typeof source.dailyDeliveries === "object"
        ? JSON.parse(JSON.stringify(source.dailyDeliveries))
        : {},
    streak:
      source.streak && typeof source.streak === "object"
        ? { ...defaults.streak, ...source.streak }
        : defaults.streak,
    merchProgress: {
      nospillClubGear: {
        ...defaults.merchProgress.nospillClubGear,
        ...(merch.nospillClubGear || {}),
      },
      perfectPourDrop: {
        ...defaults.merchProgress.perfectPourDrop,
        ...(merch.perfectPourDrop || {}),
      },
      deliveryCrew: {
        ...defaults.merchProgress.deliveryCrew,
        ...(merch.deliveryCrew || {}),
      },
    },
    recentRewards: Array.isArray(source.recentRewards) ? source.recentRewards.slice(0, 12) : [],
    recentSessions: Array.isArray(source.recentSessions) ? source.recentSessions.slice(0, 20) : [],
    xpByDate:
      source.xpByDate && typeof source.xpByDate === "object"
        ? { ...source.xpByDate }
        : {},
    routeMastery:
      source.routeMastery && typeof source.routeMastery === "object"
        ? JSON.parse(JSON.stringify(source.routeMastery))
        : {},
    shop: normalizeShopState(source.shop),
    collection: normalizeCollectionState(source.collection),
  };
  normalized.level = levelForXP(normalized.totalXP);
  normalized.merchProgress.nospillClubGear.dates = [
    ...(normalized.merchProgress.nospillClubGear.dates || []),
  ];
  normalized.merchProgress.deliveryCrew.dates = [
    ...(normalized.merchProgress.deliveryCrew.dates || []),
  ];
  return normalized;
}

function loadGameState() {
  const storage = safeLocalStorage();
  if (!storage) return defaultGameState();
  try {
    return normalizeGameState(JSON.parse(storage.getItem(GAME_STORAGE_KEY) || "{}"));
  } catch (_) {
    return defaultGameState();
  }
}

function saveGameState(gameState) {
  const storage = safeLocalStorage();
  if (!storage) return false;
  try {
    storage.setItem(GAME_STORAGE_KEY, JSON.stringify(normalizeGameState(gameState)));
    return true;
  } catch (_) {
    return false;
  }
}

function resetGameState() {
  const storage = safeLocalStorage();
  if (!storage) return false;
  try {
    storage.removeItem(GAME_STORAGE_KEY);
    return true;
  } catch (_) {
    return false;
  }
}

function isValidImportedShopNumber(value, maxValue = SHOP_MAX_RESOURCE) {
  if (value === undefined) return true;
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 && numeric <= maxValue;
}

function validateImportedShopState(shop) {
  if (shop === undefined) return true;
  if (!shop || typeof shop !== "object" || Array.isArray(shop)) return false;
  if (!isValidImportedShopNumber(shop.tofuStock)) return false;
  if (!isValidImportedShopNumber(shop.reputation)) return false;
  if (!isValidImportedShopNumber(shop.shopLevel, 1000)) return false;
  if (!isValidImportedShopNumber(shop.lifetimeTofuPacked)) return false;
  if (!isValidImportedShopNumber(shop.lifetimeReputation)) return false;
  if (shop.offlineEarnings !== undefined) {
    if (!shop.offlineEarnings || typeof shop.offlineEarnings !== "object") return false;
    if (!isValidImportedShopNumber(shop.offlineEarnings.tofuStock)) return false;
    if (!isValidImportedShopNumber(shop.offlineEarnings.cappedHours, SHOP_OFFLINE_CAP_HOURS)) {
      return false;
    }
  }
  if (shop.upgrades !== undefined) {
    if (!shop.upgrades || typeof shop.upgrades !== "object" || Array.isArray(shop.upgrades)) {
      return false;
    }
    for (const value of Object.values(shop.upgrades)) {
      const level = value && typeof value === "object" ? value.level : value;
      if (!isValidImportedShopNumber(level, 100)) return false;
    }
  }
  return true;
}

function validateImportedCollectionState(collection) {
  if (collection === undefined) return true;
  if (!collection || typeof collection !== "object" || Array.isArray(collection)) return false;
  const characterIds = knownCharacterIds();
  const soundPackIds = knownSoundPackIds();
  if (
    collection.selectedCharacterId !== undefined
    && !characterIds.has(collection.selectedCharacterId)
  ) {
    return false;
  }
  if (
    collection.selectedSoundPackId !== undefined
    && !soundPackIds.has(collection.selectedSoundPackId)
  ) {
    return false;
  }
  const idLists = [
    [collection.unlockedCharacterIds, characterIds],
    [collection.unlockedSoundPackIds, soundPackIds],
    [collection.seenUnlockIds, null],
  ];
  return idLists.every(([ids, allowedIds]) => (
    ids === undefined
    || (
      Array.isArray(ids)
      && ids.every((id) => (
        typeof id === "string"
        && id.length <= 80
        && (!allowedIds || allowedIds.has(id))
      ))
    )
  ));
}

function exportGameProgress(gameState = loadGameState()) {
  const normalized = normalizeGameState(gameState);
  const state = {
    ...normalized,
    shop: sanitizeShopStateForExport(normalized),
  };
  return JSON.stringify({
    app: APP_BRAND,
    key: GAME_STORAGE_KEY,
    exportedAt: new Date().toISOString(),
    driverLicense: getDriverLicense(normalized.level),
    state,
  }, null, 2);
}

function importGameProgress(jsonText) {
  let parsed;
  try {
    parsed = JSON.parse(String(jsonText || ""));
  } catch (_) {
    return { ok: false, reason: "Progress backup was not valid JSON." };
  }
  if (!parsed || parsed.key !== GAME_STORAGE_KEY || typeof parsed.state !== "object") {
    return { ok: false, reason: "Progress backup was not a Tofu Driver game backup." };
  }
  const text = JSON.stringify(parsed.state);
  if (/\b(?:routeSamples|gpsSamples|motionSamples|raw|coords|coordinates|latitude|longitude|lat|lon|trace|street|map|speedLogs?)\b/i.test(text)) {
    return { ok: false, reason: "Progress backup included unsupported raw route or sensor fields." };
  }
  if (!validateImportedShopState(parsed.state.shop)) {
    return { ok: false, reason: "Progress backup included invalid Tofu Shop values." };
  }
  if (!validateImportedCollectionState(parsed.state.collection)) {
    return { ok: false, reason: "Progress backup included invalid collection values." };
  }
  const normalized = normalizeGameState(parsed.state);
  return saveGameState(normalized)
    ? { ok: true, gameState: normalized, reason: "" }
    : { ok: false, reason: "Progress backup could not be saved." };
}

function saveClubState(clubState) {
  const storage = safeLocalStorage();
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(clubState));
    return true;
  } catch (_) {
    return false;
  }
}

function persistMountConfig() {
  const clubState = loadClubState();
  clubState.mountConfig = normalizeMountConfig(appState.mountConfig);
  saveClubState(clubState);
}

function persistAudioLevel() {
  const clubState = loadClubState();
  clubState.audioLevel = normalizeAudioLevel(appState.audioLevel);
  saveClubState(clubState);
}

function unlockMilestones(summary) {
  const clubState = loadClubState();
  const unlockedThisRun = [];
  const today = String(summary.date || new Date().toISOString()).slice(0, 10);

  function unlock(id) {
    if (clubState.unlockedMilestones[id]) return;
    clubState.unlockedMilestones[id] = new Date().toISOString();
    unlockedThisRun.push(id);
  }

  clubState.completedSessionCount += 1;
  clubState.bestWaterScore = Math.max(
    Number(clubState.bestWaterScore || 0),
    Number(summary.waterLeft || 0),
  );

  if (summary.mode === "basic" && summary.motionSamples > 0) unlock("first_pour");
  if (summary.waterLeft >= 50) unlock("half_cup_hero");
  if (summary.waterLeft >= 75) unlock("smooth_driver");
  if (
    summary.qualificationStatus === "qualified"
    && summary.deliveryRewards
    && summary.deliveryRewards.merchProgress.nospillClubGear.unlocked
  ) {
    unlock("nospill_club");
  }
  if (summary.qualificationStatus === "qualified" && summary.waterLeft >= 99.95) {
    unlock("perfect_pour");
  }

  if (summary.qualificationStatus === "qualified") {
    unlock("qualified_pour");
    if (summary.waterLeft >= 80 && summary.distanceMiles >= 10) unlock("long_pour");
    if (summary.waterLeft >= 90 && summary.durationSeconds >= 900) {
      unlock("smooth_commuter");
    }
    if (summary.waterLeft >= 90 && summary.significantTurnsPerMile >= 7) {
      unlock("curve_control");
    }
    if (summary.waterLeft >= 90 && summary.routeType === "Technical Route") {
      unlock("technical_pour");
    }
    if (summary.waterLeft >= 90 && summary.routeDifficultyScore >= 0.75) {
      unlock("very_technical_pour");
    }
    if (
      summary.harshBraking <= 1
      && summary.harshAcceleration <= 1
      && summary.lateralJerk <= 2
    ) {
      unlock("passenger_approved");
    }
    if (summary.waterLeft >= 95 && !clubState.qualifiedSmoothDates.includes(today)) {
      clubState.qualifiedSmoothDates.push(today);
    }
    if (clubState.qualifiedSmoothDates.length >= 3) unlock("certified_smooth");
  }

  saveClubState(clubState);
  return {
    clubState,
    unlockedThisRun,
    unlockedLabels: unlockedThisRun.map((id) => MILESTONE_LABELS[id] || id),
  };
}

function saveSummaryLocally(summary) {
  const clubState = loadClubState();
  const savedSummary = {
    date: summary.date,
    mode: summary.mode,
    waterLeft: summary.waterLeft,
    waterSpilled: summary.waterSpilled,
    rank: summary.rank,
    durationSeconds: summary.durationSeconds,
    distanceMiles: summary.distanceMiles || null,
    routeDifficultyLabel: summary.routeDifficultyLabel || null,
    turnDensityScore: summary.turnDensityScore || null,
    curvatureScore: summary.curvatureScore || null,
    qualificationStatus: summary.qualificationStatus,
    unlockedBadges: summary.unlockedBadges || [],
  };
  clubState.savedSessions = [savedSummary, ...clubState.savedSessions].slice(0, 20);
  saveClubState(clubState);
  return savedSummary;
}

function localDateKey(date = new Date()) {
  if (typeof date === "string") return date.slice(0, 10);
  const value = date instanceof Date ? date : new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hashString(value) {
  return String(value).split("").reduce(
    (hash, char) => ((hash * 31) + char.charCodeAt(0)) >>> 0,
    7,
  );
}

function getDailyDelivery(date = new Date()) {
  const dateKey = localDateKey(date);
  const index = hashString(dateKey) % DAILY_DELIVERIES.length;
  return { ...DAILY_DELIVERIES[index], dateKey };
}

function getDriverLicense(level) {
  const numericLevel = Math.max(1, Math.floor(Number(level || 1)));
  return DRIVER_LICENSES.reduce(
    (current, license) => (
      numericLevel >= license.minLevel ? license.label : current
    ),
    DRIVER_LICENSES[0].label,
  );
}

function calculateCargoCondition(session) {
  return clamp(roundTo(session && session.waterLeft, 1), 0, 100);
}

function isQualifiedSession(session) {
  return Boolean(
    session
    && session.mode === "qualified"
    && session.qualificationStatus === "qualified",
  );
}

function classifyRouteType(summary) {
  if (!isQualifiedSession(summary)) return "Practice Route";
  const duration = Number(summary.durationSeconds || 0);
  const distance = Number(summary.distanceMiles || 0);
  const turnDensity = Number(summary.turnDensityScore || 0);
  const curvature = Number(summary.curvatureScore || 0);
  const difficulty = Number(summary.routeDifficultyScore || 0);
  const harshLongitudinal =
    Number(summary.harshBraking || 0) + Number(summary.harshAcceleration || 0);

  if ((duration >= 1200 || distance >= 10) && difficulty < 0.62) {
    return "Long Haul";
  }
  if (turnDensity >= 0.62 || curvature >= 0.62 || difficulty >= 0.68) {
    return "Technical Route";
  }
  if (turnDensity >= 0.32 || curvature >= 0.32 || difficulty >= 0.42) {
    return "Mixed Route";
  }
  if (harshLongitudinal >= 3 || Number(summary.abruptTransitions || 0) >= 3) {
    return "City Delivery";
  }
  return "Calm Cruise";
}

function evaluateCargoMission(mission, session) {
  const cargo = calculateCargoCondition(session);
  const routeType = session.routeType || classifyRouteType(session);
  const harshInputCount = Number(session.harshInputCount || 0);
  if (!mission) return false;
  if (mission.id === "silken_tofu") return cargo >= 85;
  if (mission.id === "hot_tea") {
    return cargo >= 80 && Number(session.harshLateral || 0) <= 1;
  }
  if (mission.id === "soup_bowl") {
    return cargo >= 80
      && Number(session.harshBraking || 0) <= 1
      && Number(session.harshAcceleration || 0) <= 1;
  }
  if (mission.id === "egg_carton") return cargo >= 80 && harshInputCount <= 2;
  if (mission.id === "glass_bottle") {
    return cargo >= 82
      && Number(session.lateralJerk || 0) <= 2
      && Number(session.abruptTransitions || 0) <= 2;
  }
  if (mission.id === "wedding_cake") {
    return isQualifiedSession(session)
      && cargo >= 85
      && (Number(session.durationSeconds || 0) >= 900 || routeType === "Long Haul");
  }
  return false;
}

function evaluateDailyDelivery(mission, session) {
  return evaluateCargoMission(mission, session);
}

function levelXPRequirement(level) {
  return 100 + Math.max(1, Number(level || 1)) * 25;
}

function levelForXP(totalXP) {
  let level = 1;
  let remaining = Math.max(0, Math.round(Number(totalXP || 0)));
  while (remaining >= levelXPRequirement(level)) {
    remaining -= levelXPRequirement(level);
    level += 1;
  }
  return level;
}

function levelProgress(totalXP) {
  let level = 1;
  let remaining = Math.max(0, Math.round(Number(totalXP || 0)));
  while (remaining >= levelXPRequirement(level)) {
    remaining -= levelXPRequirement(level);
    level += 1;
  }
  return {
    level,
    currentXP: remaining,
    nextXP: levelXPRequirement(level),
  };
}

function shopLevelRequirement(level) {
  return 100 + Math.max(1, Number(level || 1)) * 50;
}

function getShopLevel(reputation) {
  let level = 1;
  let remaining = Math.max(0, Math.round(Number(reputation || 0)));
  while (remaining >= shopLevelRequirement(level) && level < 1000) {
    remaining -= shopLevelRequirement(level);
    level += 1;
  }
  return level;
}

function shopLevelProgress(reputation) {
  let level = 1;
  let remaining = Math.max(0, Math.round(Number(reputation || 0)));
  while (remaining >= shopLevelRequirement(level) && level < 1000) {
    remaining -= shopLevelRequirement(level);
    level += 1;
  }
  return {
    level,
    currentReputation: remaining,
    nextReputation: shopLevelRequirement(level),
  };
}

function getShopUpgradeCatalog() {
  return SHOP_UPGRADES.map((upgrade) => ({ ...upgrade }));
}

function shopUpgradeCost(upgrade, currentLevel = 0) {
  const level = Math.max(0, Math.round(Number(currentLevel || 0)));
  return {
    costTofuStock: Math.round(upgrade.costTofuStock * (1 + level * 0.65)),
    costReputation: Math.round((upgrade.costReputation || 0) * (1 + level * 0.5)),
  };
}

function shopUpgradeLevel(gameState, upgradeId) {
  const shop = normalizeShopState(gameState && gameState.shop);
  return safeNonNegativeInteger(shop.upgrades[upgradeId], 0, 100);
}

function getShopProductionRate(gameState) {
  const state = gameState && gameState.shop ? gameState : { shop: gameState };
  const shop = normalizeShopState(state.shop);
  return shop.upgrades.tofu_press * 6;
}

function calculateOfflineShopEarnings(gameState, now = new Date()) {
  const state = gameState && gameState.shop ? gameState : { shop: gameState };
  const shop = normalizeShopState(state.shop);
  const rate = getShopProductionRate({ shop });
  const lastMs = Date.parse(shop.lastShopTickAt);
  const nowMs = now instanceof Date ? now.getTime() : Date.parse(now);
  if (!Number.isFinite(lastMs) || !Number.isFinite(nowMs) || nowMs <= lastMs || rate <= 0) {
    return { tofuStock: 0, cappedHours: 0, elapsedHours: 0 };
  }
  const elapsedHours = (nowMs - lastMs) / 3600000;
  const cappedHours = Math.min(SHOP_OFFLINE_CAP_HOURS, elapsedHours);
  return {
    tofuStock: Math.floor(rate * cappedHours),
    cappedHours: roundTo(cappedHours, 2),
    elapsedHours: roundTo(elapsedHours, 2),
  };
}

function applyOfflineShopEarnings(gameState, now = new Date()) {
  const next = normalizeGameState(gameState);
  const nowIso = now instanceof Date ? now.toISOString() : new Date(now).toISOString();
  const earnings = calculateOfflineShopEarnings(next, now);
  const hadTick = Boolean(next.shop.lastShopTickAt);
  if (earnings.tofuStock > 0) {
    next.shop.tofuStock = safeNonNegativeInteger(next.shop.tofuStock + earnings.tofuStock);
  }
  next.shop.offlineEarnings = {
    tofuStock: earnings.tofuStock,
    cappedHours: earnings.cappedHours,
  };
  next.shop.lastShopTickAt = nowIso;
  return {
    gameState: next,
    earnings,
    changed: !hadTick || earnings.tofuStock > 0,
  };
}

function loadGameStateWithOfflineShopEarnings(now = new Date()) {
  const state = loadGameState();
  const result = applyOfflineShopEarnings(state, now);
  if (result.changed) saveGameState(result.gameState);
  return result.gameState;
}

function packTofu(gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive) {
    return {
      ok: false,
      reason: "Shop actions unlock after you finish and park.",
      gameState: next,
      tofuStockGained: 0,
    };
  }
  const amount = 1 + Math.min(3, Math.floor(next.shop.upgrades.tofu_press / 2));
  next.shop.tofuStock = safeNonNegativeInteger(next.shop.tofuStock + amount);
  next.shop.lifetimeTofuPacked = safeNonNegativeInteger(
    next.shop.lifetimeTofuPacked + amount,
  );
  next.shop.lastShopTickAt = new Date().toISOString();
  return {
    ok: true,
    reason: "",
    gameState: next,
    tofuStockGained: amount,
  };
}

function buyShopUpgrade(upgradeId, gameState) {
  const next = normalizeGameState(gameState);
  const upgrade = SHOP_UPGRADES.find((candidate) => candidate.id === upgradeId);
  if (!upgrade) {
    return { ok: false, reason: "Upgrade unavailable.", gameState: next };
  }
  const currentLevel = safeNonNegativeInteger(next.shop.upgrades[upgrade.id], 0, upgrade.maxLevel);
  if (currentLevel >= upgrade.maxLevel) {
    return { ok: false, reason: "Upgrade is already complete.", gameState: next };
  }
  if (next.shop.shopLevel < upgrade.requiredShopLevel) {
    return { ok: false, reason: `Requires Shop Level ${upgrade.requiredShopLevel}.`, gameState: next };
  }
  const cost = shopUpgradeCost(upgrade, currentLevel);
  if (next.shop.tofuStock < cost.costTofuStock) {
    return { ok: false, reason: "Not enough tofu stock.", gameState: next };
  }
  if (next.shop.reputation < cost.costReputation) {
    return { ok: false, reason: "Not enough reputation.", gameState: next };
  }
  next.shop.tofuStock -= cost.costTofuStock;
  next.shop.reputation -= cost.costReputation;
  next.shop.shopLevel = getShopLevel(next.shop.reputation);
  next.shop.upgrades[upgrade.id] = currentLevel + 1;
  next.shop.lastShopTickAt = new Date().toISOString();
  return {
    ok: true,
    reason: "",
    gameState: next,
    upgrade: { ...upgrade, level: currentLevel + 1 },
  };
}

function applyDeliveryToShop(sessionSummary, rewardSummary, gameState) {
  let next = normalizeGameState(gameState);
  const session = sessionSummary || {};
  const rewards = rewardSummary || {};
  const cargo = calculateCargoCondition(session);
  const qualified = isQualifiedSession(session);
  const dailyComplete = Boolean(rewards.dailyComplete || session.dailyDeliveryComplete);
  const perfectPour = qualified && cargo >= 100;
  const xpMultiplier = Number(rewards.xpMultiplier || 1);
  const extraSessionMultiplier = qualified && xpMultiplier < 1 ? 0.5 : 1;
  const betterBoxes = safeNonNegativeInteger(next.shop.upgrades.better_boxes, 0, 4);
  const shopSign = safeNonNegativeInteger(next.shop.upgrades.shop_sign, 0, 4);

  let tofuStockGained = qualified
    ? Math.floor(cargo)
    : Math.min(18, Math.floor(cargo / 6));
  if (qualified) tofuStockGained += 20;
  if (dailyComplete) tofuStockGained += 15;
  if (perfectPour) tofuStockGained += 50;
  tofuStockGained += Math.floor(tofuStockGained * 0.08 * betterBoxes);
  tofuStockGained = Math.max(0, Math.round(tofuStockGained * extraSessionMultiplier));
  if (!qualified && Number(session.durationSeconds || 0) < 60) {
    tofuStockGained = Math.min(tofuStockGained, 8);
  }

  let reputationGained = 0;
  if (qualified) {
    if (cargo >= 85) reputationGained += 12;
    if (cargo >= 95) reputationGained += 18;
    if (dailyComplete) reputationGained += 5;
    if (perfectPour) reputationGained += 30;
    if (Array.isArray(rewards.stamps)) reputationGained += Math.min(10, rewards.stamps.length * 2);
    reputationGained += Math.floor(reputationGained * 0.1 * shopSign);
    reputationGained = Math.max(0, Math.round(reputationGained * extraSessionMultiplier));
  }

  const previousShopLevel = next.shop.shopLevel;
  next.shop.tofuStock = safeNonNegativeInteger(next.shop.tofuStock + tofuStockGained);
  next.shop.reputation = safeNonNegativeInteger(next.shop.reputation + reputationGained);
  next.shop.lifetimeReputation = safeNonNegativeInteger(
    next.shop.lifetimeReputation + reputationGained,
  );
  next.shop.shopLevel = getShopLevel(next.shop.reputation);
  next.shop.lastShopTickAt = next.shop.lastShopTickAt || new Date().toISOString();

  return {
    gameState: next,
    tofuStockGained,
    reputationGained,
    shopLevelBefore: previousShopLevel,
    shopLevelAfter: next.shop.shopLevel,
    shopLevelChanged: next.shop.shopLevel > previousShopLevel,
  };
}

function sanitizeShopStateForExport(gameState) {
  return normalizeShopState(gameState && gameState.shop);
}

function getCharacterCatalog() {
  return CHARACTER_CATALOG.map((character) => ({ ...character }));
}

function getSoundPackCatalog() {
  return SOUND_PACK_CATALOG.map((soundPack) => ({ ...soundPack }));
}

function collectionUnlockLabel(type, id) {
  const catalog = type === "sound"
    ? SOUND_PACK_CATALOG
    : CHARACTER_CATALOG;
  const item = catalog.find((candidate) => candidate.id === id);
  return item ? item.name : id;
}

function selectedCharacter(gameState) {
  const state = normalizeGameState(gameState);
  const selected = CHARACTER_CATALOG.find(
    (character) => character.id === state.collection.selectedCharacterId,
  );
  if (selected && state.collection.unlockedCharacterIds.includes(selected.id)) {
    return { ...selected };
  }
  const firstUnlocked = CHARACTER_CATALOG.find(
    (character) => state.collection.unlockedCharacterIds.includes(character.id),
  );
  return firstUnlocked ? { ...firstUnlocked } : null;
}

function selectedSoundPack(gameState) {
  const state = normalizeGameState(gameState);
  const selected = SOUND_PACK_CATALOG.find(
    (soundPack) => soundPack.id === state.collection.selectedSoundPackId,
  );
  return selected ? { ...selected } : { ...SOUND_PACK_CATALOG[0] };
}

function unlockCollectionId(collection, type, id, newUnlocks) {
  const listName = type === "sound" ? "unlockedSoundPackIds" : "unlockedCharacterIds";
  const unlockKey = `${type}:${id}`;
  if (!collection[listName].includes(id)) {
    collection[listName].push(id);
    collection.seenUnlockIds.push(unlockKey);
    newUnlocks.push({
      type,
      id,
      label: collectionUnlockLabel(type, id),
    });
  }
}

function evaluateCollectionUnlocks(sessionSummary, rewardSummary = {}, gameState = defaultGameState()) {
  const next = normalizeGameState(gameState);
  const session = sessionSummary || {};
  const rewards = rewardSummary || {};
  const cargo = calculateCargoCondition(session);
  const dailyDelivery = rewards.dailyDelivery || getDailyDelivery(session.date || new Date());
  const completedDeliveries = next.recentSessions.length;
  const stamps = next.stamps || {};
  const newCharacterUnlocks = [];
  const newSoundUnlocks = [];

  if (stamps.first_delivery || completedDeliveries >= 1) {
    unlockCollectionId(next.collection, "character", "angry_tofu_driver", newCharacterUnlocks);
  }
  if (next.shop.shopLevel >= 2) {
    unlockCollectionId(next.collection, "character", "sleepy_dispatcher", newCharacterUnlocks);
  }
  if (dailyDelivery.id === "hot_tea" && cargo >= 90) {
    unlockCollectionId(next.collection, "character", "tea_master", newCharacterUnlocks);
  }
  if (stamps.perfect_pour || (isQualifiedSession(session) && cargo >= 100)) {
    unlockCollectionId(next.collection, "character", "perfect_pour_courier", newCharacterUnlocks);
  }

  unlockCollectionId(next.collection, "sound", "default", newSoundUnlocks);
  if (next.shop.shopLevel >= 2) {
    unlockCollectionId(next.collection, "sound", "tofu_shop_bell", newSoundUnlocks);
  }
  if (Object.keys(stamps).length >= 1 || completedDeliveries >= 3) {
    unlockCollectionId(next.collection, "sound", "retro_arcade", newSoundUnlocks);
  }
  if (stamps.perfect_pour || (isQualifiedSession(session) && cargo >= 100)) {
    unlockCollectionId(next.collection, "sound", "perfect_pour_chime", newSoundUnlocks);
  }

  next.collection = normalizeCollectionState(next.collection);
  return {
    gameState: next,
    newCharacterUnlocks,
    newSoundUnlocks: newSoundUnlocks.filter((unlock) => unlock.id !== "default"),
  };
}

function selectCharacter(characterId, gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive) {
    return { ok: false, reason: "Delivery Crew changes unlock after you finish and park.", gameState: next };
  }
  if (!next.collection.unlockedCharacterIds.includes(characterId)) {
    return { ok: false, reason: "Character is still locked.", gameState: next };
  }
  next.collection.selectedCharacterId = characterId;
  return { ok: true, reason: "", gameState: next };
}

function selectSoundPack(soundPackId, gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive) {
    return { ok: false, reason: "Sound Pack changes unlock after you finish and park.", gameState: next };
  }
  if (!next.collection.unlockedSoundPackIds.includes(soundPackId)) {
    return { ok: false, reason: "Sound Pack is still locked.", gameState: next };
  }
  next.collection.selectedSoundPackId = soundPackId;
  return { ok: true, reason: "", gameState: next };
}

function dateDaysApart(leftDateKey, rightDateKey) {
  if (!leftDateKey || !rightDateKey) return null;
  const left = new Date(`${leftDateKey}T00:00:00`);
  const right = new Date(`${rightDateKey}T00:00:00`);
  return Math.round((left - right) / 86400000);
}

function countFullCreditQualifiedToday(gameState, dateKey) {
  return (gameState.recentSessions || []).filter(
    (session) => session.dateKey === dateKey
      && session.qualificationStatus === "qualified"
      && session.xpMultiplier === 1,
  ).length;
}

function recentAverageCargo(gameState) {
  const sessions = (gameState.recentSessions || []).slice(0, 5);
  if (!sessions.length) return null;
  const total = sessions.reduce((sum, session) => sum + Number(session.cargoCondition || 0), 0);
  return total / sessions.length;
}

function calculateDriverXP(session, gameState, missionComplete) {
  const cargo = calculateCargoCondition(session);
  const dateKey = localDateKey(session.date);
  const qualified = isQualifiedSession(session);
  const fullCreditQualified = countFullCreditQualifiedToday(gameState, dateKey);
  const multiplier = qualified && fullCreditQualified >= 2 ? 0.35 : 1;
  const average = recentAverageCargo(gameState);
  let xp = qualified ? 34 : 12;
  xp += Math.floor(cargo * (qualified ? 0.45 : 0.14));
  if (cargo >= 95) xp += 12;
  if (Number(session.harshInputCount || 0) <= 1) xp += 8;
  if (missionComplete) xp += 20;
  if (average !== null && cargo > average) xp += Math.min(12, Math.round(cargo - average));
  if (session.routeType === getDailyDelivery(session.date).routeMatch) xp += 8;
  if (!qualified) xp = Math.min(xp, 28);
  return {
    baseXP: xp,
    xpGained: Math.max(1, Math.round(xp * multiplier)),
    xpMultiplier: multiplier,
  };
}

function awardSkillXP(session) {
  const cargo = calculateCargoCondition(session);
  const harshBraking = Number(session.harshBraking || 0);
  const harshAcceleration = Number(session.harshAcceleration || 0);
  const harshLateral = Number(session.harshLateral || 0);
  const lateralJerk = Number(session.lateralJerk || 0);
  const abruptTransitions = Number(session.abruptTransitions || 0);
  const duration = Number(session.durationSeconds || 0);
  const routeType = session.routeType || classifyRouteType(session);
  return {
    brakeFeather: Math.max(1, Math.round(cargo / 12) - harshBraking * 2),
    throttleControl: Math.max(1, Math.round(cargo / 12) - harshAcceleration * 2),
    smoothHands: Math.max(1, Math.round(cargo / 14) - harshLateral - lateralJerk),
    cornerCalm: ["Mixed Route", "Technical Route"].includes(routeType)
      ? Math.max(2, Math.round(cargo / 10) - harshLateral * 2)
      : Math.max(1, Math.round(cargo / 18)),
    passengerComfort: Math.max(
      1,
      Math.round(cargo / 10)
        - harshBraking
        - harshAcceleration
        - harshLateral,
    ),
    consistency: Math.max(
      1,
      Math.round(cargo / 14)
        + (duration >= 600 ? 3 : 0)
        - abruptTransitions
        - lateralJerk,
    ),
  };
}

function isMeaningfulQualifiedDelivery(session) {
  if (!isQualifiedSession(session)) return false;
  if (["Mixed Route", "Technical Route", "Long Haul"].includes(session.routeType)) {
    return true;
  }
  return Number(session.durationSeconds || 0) >= 600 || Number(session.distanceMiles || 0) >= 5;
}

function addUniqueDate(list, dateKey) {
  return Array.from(new Set([...(Array.isArray(list) ? list : []), dateKey])).sort();
}

function updateMerchProgress(session, gameState, missionComplete) {
  const next = normalizeGameState(gameState);
  const cargo = calculateCargoCondition(session);
  const dateKey = localDateKey(session.date);
  const progress = next.merchProgress;

  if (isQualifiedSession(session) && cargo >= 95 && isMeaningfulQualifiedDelivery(session)) {
    progress.nospillClubGear.dates = addUniqueDate(progress.nospillClubGear.dates, dateKey);
    progress.nospillClubGear.count = Math.min(
      progress.nospillClubGear.target,
      progress.nospillClubGear.dates.length,
    );
    progress.nospillClubGear.meaningfulCount = progress.nospillClubGear.count;
    progress.nospillClubGear.unlocked =
      progress.nospillClubGear.count >= progress.nospillClubGear.target;
  }
  if (isQualifiedSession(session) && cargo >= 100) {
    progress.perfectPourDrop.unlocked = true;
    progress.perfectPourDrop.date = progress.perfectPourDrop.date || dateKey;
  }
  if (missionComplete && cargo >= 85) {
    progress.deliveryCrew.dates = addUniqueDate(progress.deliveryCrew.dates, dateKey);
    progress.deliveryCrew.count = Math.min(
      progress.deliveryCrew.target,
      progress.deliveryCrew.dates.length,
    );
    progress.deliveryCrew.unlocked = progress.deliveryCrew.count >= progress.deliveryCrew.target;
  }
  return progress;
}

function routeBucket(value, thresholds) {
  const numeric = Number(value || 0);
  let bucket = 0;
  thresholds.forEach((threshold) => {
    if (numeric >= threshold) bucket += 1;
  });
  return bucket;
}

function routeFingerprintForSession(session) {
  const routeType = session.routeType || classifyRouteType(session);
  const distanceBucket = routeBucket(session.distanceMiles, [2, 5, 10, 20]);
  const durationBucket = routeBucket(session.durationSeconds, [300, 600, 1200, 2400]);
  const turnBucket = routeBucket(session.turnDensityScore, [0.25, 0.5, 0.75]);
  const curveBucket = routeBucket(session.curvatureScore, [0.25, 0.5, 0.75]);
  return {
    id: [
      routeType.toLowerCase().replaceAll(" ", "-"),
      `d${distanceBucket}`,
      `t${durationBucket}`,
      `turn${turnBucket}`,
      `curve${curveBucket}`,
    ].join(":"),
    routeType,
    distanceBucket,
    durationBucket,
    turnBucket,
    curveBucket,
  };
}

function updateCommuteMastery(session, gameState) {
  const next = normalizeGameState(gameState);
  if (!isQualifiedSession(session)) return { routeMastery: next.routeMastery, message: "" };
  const fingerprint = routeFingerprintForSession(session);
  const previous = next.routeMastery[fingerprint.id] || {
    fingerprintId: fingerprint.id,
    routeType: fingerprint.routeType,
    count: 0,
    bestCargoCondition: 0,
    recentAverageCargoCondition: 0,
    lastCompletedDate: null,
    masteryLevel: 0,
  };
  const previousAverage = previous.recentAverageCargoCondition || 0;
  const cargo = calculateCargoCondition(session);
  const count = previous.count + 1;
  const recentAverageCargoCondition = roundTo(
    ((previous.recentAverageCargoCondition || cargo) * previous.count + cargo) / count,
    1,
  );
  const updated = {
    ...previous,
    routeType: fingerprint.routeType,
    count,
    bestCargoCondition: Math.max(Number(previous.bestCargoCondition || 0), cargo),
    recentAverageCargoCondition,
    lastCompletedDate: localDateKey(session.date),
    masteryLevel: Math.floor(count / 3),
  };
  next.routeMastery[fingerprint.id] = updated;
  let message = "";
  if (previous.count > 0 && cargo > previous.bestCargoCondition) {
    message = "Looks like a familiar delivery. New best for this familiar route. Commute Mastery +1.";
  } else if (previous.count > 0 && cargo > previousAverage) {
    message = "Looks like a familiar delivery. Today was smoother than your recent average.";
  } else if (previous.count > 0) {
    message = "Looks like a familiar delivery.";
  }
  return { routeMastery: next.routeMastery, message };
}

function stampLabels(ids) {
  return (ids || []).map((id) => STAMP_LABELS[id] || id);
}

function deliveryPassportSummary(gameState) {
  const state = normalizeGameState(gameState);
  const unlockedIds = Object.keys(state.stamps || {});
  const recent = unlockedIds
    .map((id) => ({ id, label: STAMP_LABELS[id] || id, date: state.stamps[id].date || "" }))
    .sort((left, right) => String(right.date).localeCompare(String(left.date)))
    .slice(0, 6);
  const majorIds = [
    "daily_delivery_complete",
    "cup_stayed_full",
    "smooth_commute",
    "technical_pour",
    "nospill_club",
    "perfect_pour",
  ];
  return {
    total: unlockedIds.length,
    totalAvailable: Object.keys(STAMP_LABELS).length,
    recent,
    major: majorIds.map((id) => ({
      id,
      label: STAMP_LABELS[id],
      unlocked: Boolean(state.stamps[id]),
    })),
  };
}

function buildCoachRecap(sessionSummary, rewardSummary = {}) {
  const session = sessionSummary || {};
  const skillXP = rewardSummary.skillXP || awardSkillXP(session);
  const sortedSkills = Object.entries(skillXP).sort((left, right) => right[1] - left[1]);
  const bestSkillId = sortedSkills.length ? sortedSkills[0][0] : "passengerComfort";
  const harshBraking = Number(session.harshBraking || 0);
  const harshAcceleration = Number(session.harshAcceleration || 0);
  const lateralJerk = Number(session.lateralJerk || 0);
  const abruptTransitions = Number(session.abruptTransitions || 0);
  const harshInputCount = Number(session.harshInputCount || 0);
  const cargo = calculateCargoCondition(session);
  let damageSource = "Inconsistent inputs";
  let nextFocus = "Keep the same calm inputs next time.";
  let message = "Cargo loss mostly came from small input changes.";

  if (!isQualifiedSession(session)) {
    damageSource = "Short/unqualified practice session";
    nextFocus = "Try a normal qualified delivery when parked and ready.";
    message = "Practice complete. Qualified deliveries can add route context later.";
  } else if (harshBraking >= Math.max(harshAcceleration, lateralJerk, abruptTransitions, 1)) {
    damageSource = "Brake release";
    nextFocus = "Next focus: smoother brake release.";
    message = "Cargo loss mostly came from abrupt braking.";
  } else if (harshAcceleration >= Math.max(harshBraking, lateralJerk, abruptTransitions, 1)) {
    damageSource = "Harsh acceleration";
    nextFocus = "Next focus: gentler throttle pickup.";
    message = "Cargo loss mostly came from abrupt acceleration.";
  } else if (lateralJerk >= Math.max(harshBraking, harshAcceleration, abruptTransitions, 1)) {
    damageSource = "Lateral jerk";
    nextFocus = "Next focus: smoother side-to-side inputs.";
    message = "Cargo loss mostly came from lateral jerk.";
  } else if (abruptTransitions >= 2 || harshInputCount >= 4) {
    damageSource = "Repeated spikes";
    nextFocus = "Next focus: fewer sudden input changes.";
    message = "Cargo loss mostly came from repeated spikes.";
  } else if (cargo >= 90) {
    damageSource = "Cargo mostly preserved";
    nextFocus = "Smooth commute. Try keeping the same calm inputs tomorrow.";
    message = "Cargo stayed stable through most of the delivery.";
  }

  return {
    damageSource,
    bestSkill: SKILL_LABELS[bestSkillId] || "Passenger Comfort",
    bestSkillId,
    nextFocus,
    message,
  };
}

function calculateDeliveryRewards(session, gameState = defaultGameState()) {
  const state = normalizeGameState(gameState);
  const dateKey = localDateKey(session.date);
  const dailyDelivery = getDailyDelivery(dateKey);
  const routeType = classifyRouteType(session);
  const cargoCondition = calculateCargoCondition(session);
  const enrichedSession = {
    ...session,
    routeType,
    cargoCondition,
    dailyDeliveryId: dailyDelivery.id,
    dailyCargo: dailyDelivery.cargo,
  };
  const dailyComplete = evaluateDailyDelivery(dailyDelivery, enrichedSession);
  const driverXP = calculateDriverXP(enrichedSession, state, dailyComplete);
  const skillXP = awardSkillXP(enrichedSession);
  const stamps = [];
  const addStamp = (id) => {
    if (!state.stamps[id] && !stamps.includes(id)) stamps.push(id);
  };

  addStamp("first_delivery");
  if (dailyComplete) addStamp("daily_delivery_complete");
  if (cargoCondition >= 95) addStamp("cup_stayed_full");
  if (isQualifiedSession(enrichedSession) && cargoCondition >= 90 && Number(session.durationSeconds || 0) >= 600) {
    addStamp("smooth_commute");
  }
  if (routeType === "Calm Cruise" && cargoCondition >= 90) addStamp("calm_cruise");
  if (
    routeType === "City Delivery"
    && cargoCondition >= 85
    && Number(session.harshBraking || 0) <= 1
    && Number(session.harshAcceleration || 0) <= 1
  ) {
    addStamp("city_smooth");
  }
  if (routeType === "Long Haul" && cargoCondition >= 85) addStamp("long_haul_pour");
  if (["Mixed Route", "Technical Route"].includes(routeType) && cargoCondition >= 90) {
    addStamp("curve_control");
  }
  if (routeType === "Technical Route" && cargoCondition >= 90) addStamp("technical_pour");
  if (Number(session.harshInputCount || 0) <= 1) addStamp("no_panic_inputs");
  if (
    cargoCondition >= 90
    && Number(session.harshBraking || 0) <= 1
    && Number(session.harshAcceleration || 0) <= 1
    && Number(session.lateralJerk || 0) <= 2
  ) {
    addStamp("passenger_approved");
  }
  if (isQualifiedSession(enrichedSession) && cargoCondition >= 100) addStamp("perfect_pour");

  let nextState = normalizeGameState(state);
  nextState.totalXP += driverXP.xpGained;
  nextState.level = levelForXP(nextState.totalXP);
  Object.entries(skillXP).forEach(([skill, value]) => {
    nextState.skillXP[skill] = Math.max(0, Math.round(nextState.skillXP[skill] + value));
  });
  stamps.forEach((id) => {
    nextState.stamps[id] = { label: STAMP_LABELS[id], date: session.date };
  });
  nextState.dailyDeliveries[dateKey] = {
    missionId: dailyDelivery.id,
    cargo: dailyDelivery.cargo,
    completed: Boolean(dailyComplete),
    cargoCondition,
  };
  if (dailyComplete) {
    const apart = dateDaysApart(dateKey, nextState.streak.lastCompletedDate);
    nextState.streak.current = apart === 1
      ? Number(nextState.streak.current || 0) + 1
      : apart === 0
        ? Number(nextState.streak.current || 1)
        : 1;
    nextState.streak.lastCompletedDate = dateKey;
  }
  nextState.merchProgress = updateMerchProgress(enrichedSession, nextState, dailyComplete);
  if (nextState.merchProgress.nospillClubGear.unlocked) {
    nextState.stamps.nospill_club = nextState.stamps.nospill_club || {
      label: STAMP_LABELS.nospill_club,
      date: session.date,
    };
  }
  const mastery = updateCommuteMastery(enrichedSession, nextState);
  nextState.routeMastery = mastery.routeMastery;
  const coach = buildCoachRecap(enrichedSession, { skillXP });
  const passport = deliveryPassportSummary(nextState);
  const shop = applyDeliveryToShop(
    enrichedSession,
    {
      dailyComplete,
      xpMultiplier: driverXP.xpMultiplier,
      stamps,
    },
    nextState,
  );
  nextState = shop.gameState;
  const rewardEntry = {
    date: session.date,
    cargoCondition,
    routeType,
    xpGained: driverXP.xpGained,
    stamps: stampLabels(stamps),
    tofuStockGained: shop.tofuStockGained,
    reputationGained: shop.reputationGained,
  };
  nextState.recentRewards = [rewardEntry, ...nextState.recentRewards].slice(0, 12);
  nextState.recentSessions = [{
    date: session.date,
    dateKey,
    mode: session.mode,
    qualificationStatus: session.qualificationStatus,
    cargoCondition,
    routeType,
    rank: session.rank,
    xpGained: driverXP.xpGained,
    xpMultiplier: driverXP.xpMultiplier,
  }, ...nextState.recentSessions].slice(0, 20);
  nextState.xpByDate[dateKey] = Math.round(
    Number(nextState.xpByDate[dateKey] || 0) + driverXP.xpGained,
  );
  const collectionUnlocks = evaluateCollectionUnlocks(
    enrichedSession,
    { dailyDelivery, dailyComplete, stamps },
    nextState,
  );
  nextState = collectionUnlocks.gameState;

  return {
    dailyDelivery,
    dailyComplete,
    cargoCondition,
    routeType,
    xpGained: driverXP.xpGained,
    xpMultiplier: driverXP.xpMultiplier,
    skillXP,
    stamps,
    stampLabels: stampLabels(stamps),
    merchProgress: nextState.merchProgress,
    commuteMasteryMessage: mastery.message,
    gameState: nextState,
    coach,
    passport,
    shop,
    collectionUnlocks,
  };
}

function buildDeliverySharePayload(session, rewardSummary = null, gameState = null) {
  const routeType = session.routeType || classifyRouteType(session);
  const cargoCondition = calculateCargoCondition(session);
  const state = gameState || (rewardSummary && rewardSummary.gameState) || null;
  const normalized = state ? normalizeGameState(state) : null;
  const level = normalized ? normalized.level : null;
  const crew = normalized ? selectedCharacter(normalized) : null;
  const stamp = Array.isArray(session.deliveryStamps) && session.deliveryStamps.length
    ? stampLabels([session.deliveryStamps[0]])[0]
    : bestUnlockedMilestone(session);
  return {
    title: APP_BRAND,
    status: "Delivery Complete",
    cargoCondition: formatPercent(cargoCondition),
    rank: session.rank,
    driverLicense: level ? `Level ${level} · ${getDriverLicense(level)}` : "",
    shopLevel: normalized ? `Shop Level ${normalized.shop.shopLevel}` : "",
    deliveryCrew: crew ? crew.name : "",
    routeType,
    stamp: stamp || "",
    dailyStatus:
      session.dailyDeliveryComplete === true
        ? "Daily Delivery Complete"
        : session.dailyDeliveryComplete === false
          ? "Daily Delivery In Progress"
          : "",
    tagline: TAGLINE_SMOOTHER,
    gameState: state,
  };
}

function sanitizeShareOutput(text) {
  return String(text || "")
    .replace(/\b(?:speed|mph|gps|map|street|trace|location|lat|lon|fastest|high-g)\b/gi, "")
    .replace(/cavrino\.com\/nospill/gi, "")
    .replace(/supercutecollectibles\.com/gi, "")
    .replace(/discord\.gg\/[a-z0-9-]+/gi, "")
    .replace(/Super Cute Collectibles/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getDeviceMotionConstructor() {
  if (typeof window === "undefined") return null;
  return window.DeviceMotionEvent || null;
}

function hasDeviceMotionSupport() {
  return Boolean(getDeviceMotionConstructor());
}

async function requestMotionPermission() {
  const DeviceMotion = getDeviceMotionConstructor();
  if (!DeviceMotion) {
    return { ok: false, reason: "DeviceMotion is not available in this browser." };
  }
  if (typeof DeviceMotion.requestPermission === "function") {
    try {
      const response = await DeviceMotion.requestPermission();
      if (response !== "granted") {
        return { ok: false, reason: "Motion permission was not granted." };
      }
    } catch (_) {
      return { ok: false, reason: "Motion permission could not be requested." };
    }
  }
  return { ok: true, reason: "" };
}

function motionVectorFromEvent(event) {
  const linear = vectorFromMotion(event.acceleration);
  const gravity = vectorFromMotion(event.accelerationIncludingGravity);
  if (linear && vectorMagnitude(linear) >= 0.005) return linear;
  if (gravity && appState.calibrationNeutral) {
    const adjusted = subtractVector(gravity, appState.calibrationNeutral);
    if (!linear || vectorMagnitude(adjusted) >= 0.005) return adjusted;
  }
  return linear || null;
}

function countHarshInput(kind, nowMs, cooldownMs = 1200) {
  const last = appState.harshCooldowns[kind] || 0;
  if (nowMs - last < cooldownMs) return;
  appState.harshCooldowns[kind] = nowMs;
  if (kind === "brake") appState.motion.harshBraking += 1;
  if (kind === "accel") appState.motion.harshAcceleration += 1;
  if (kind === "lateral") appState.motion.harshLateral += 1;
  if (kind === "transition") appState.motion.abruptTransitions += 1;
  if (kind === "lateralJerk") appState.motion.lateralJerk += 1;
}

function recordMotionStats({ lateralG, longitudinalG, totalG, jerk, nowMs }) {
  appState.motion.samples += 1;
  appState.motion.peakG = Math.max(appState.motion.peakG, totalG);
  appState.motion.peakJerk = Math.max(appState.motion.peakJerk, jerk);

  if (longitudinalG < -0.35) countHarshInput("brake", nowMs);
  if (longitudinalG > 0.35) countHarshInput("accel", nowMs);
  if (Math.abs(lateralG) > 0.35) countHarshInput("lateral", nowMs);
  if (jerk > 1.1) countHarshInput("transition", nowMs, 900);
  if (Math.abs(lateralG) > 0.25 && jerk > 0.85) {
    countHarshInput("lateralJerk", nowMs, 900);
  }
  if (totalG > 1.35 || jerk > 8) appState.motion.impossibleSpikes += 1;
}

function recordOrientationStability(event) {
  const gravity = vectorFromMotion(event.accelerationIncludingGravity);
  if (!gravity || !appState.calibrationGravity) return;
  appState.gravityFiltered = lowPassVector(appState.gravityFiltered, gravity, 0.035);
  const angle = vectorAngleDegrees(appState.gravityFiltered, appState.calibrationGravity);
  appState.motion.orientationSamples += 1;
  if (angle > 35) appState.motion.orientationUnstableSamples += 1;
}

function handleMotionEvent(event) {
  if (!appState.calibrating && !appState.running) return;
  const nowMs = performance.now();

  if (appState.calibrating) {
    const calibrationVector =
      vectorFromMotion(event.accelerationIncludingGravity)
      || vectorFromMotion(event.acceleration);
    if (!calibrationVector) return;
    appState.calibrationSamples.push(calibrationVector);
    const elapsedMs = nowMs - appState.calibrationStartedMs;
    if (
      (elapsedMs >= CALIBRATION_MIN_MS
        && appState.calibrationSamples.length >= MIN_CALIBRATION_SAMPLES)
      || appState.calibrationSamples.length >= CALIBRATION_TARGET_SAMPLES
    ) {
      finishCalibration();
    }
    return;
  }

  const rawAcceleration = motionVectorFromEvent(event);
  if (!rawAcceleration) return;

  const previous = appState.filteredAcceleration;
  appState.filteredAcceleration = lowPassVector(
    appState.filteredAcceleration,
    rawAcceleration,
    LOW_PASS_ALPHA,
  );

  const deltaSeconds = appState.lastMotionMs
    ? clamp((nowMs - appState.lastMotionMs) / 1000, 0.008, 0.25)
    : 1 / 60;
  appState.lastMotionMs = nowMs;

  const mappedMotion = computeMappedMotion(
    appState.filteredAcceleration,
    previous,
    appState.mountConfig,
    deltaSeconds,
  );
  const { lateralG, longitudinalG, totalG, jerk } = mappedMotion;

  appState.currentG = { lateralG, longitudinalG, totalG, jerk };
  recordMotionStats({ lateralG, longitudinalG, totalG, jerk, nowMs });
  recordOrientationStability(event);

  const thresholdG = DIFFICULTIES[appState.difficulty].thresholdG;
  const loss = computeWaterLoss({ totalG, thresholdG, jerk, deltaSeconds });
  appState.waterLeft = clamp(appState.waterLeft - loss, 0, 100);
  updateAudioCoach();
  scheduleRender();
}

function finishCalibration() {
  if (!appState.calibrating) return;
  appState.calibrationNeutral = averageVector(appState.calibrationSamples);
  appState.calibrationGravity = appState.calibrationNeutral;
  appState.calibrating = false;
  appState.running = true;
  appState.startPerformanceMs = performance.now();
  appState.startIso = new Date().toISOString();
  appState.lastMotionMs = null;
  setRunStatus("Run started. Keep inputs smooth. Listen for the tone.");
  updateAudioCoach();
  scheduleRender();
}

function handleCalibrationTimeout() {
  if (!appState.calibrating) return;
  if (appState.calibrationSamples.length >= MIN_CALIBRATION_SAMPLES) {
    finishCalibration();
    return;
  }
  stopRunSensors();
  showUnsupported(
    "Motion sensor data did not arrive. Try a mobile browser on HTTPS and allow motion access.",
  );
}

function startLocationWatch() {
  appState.geoStatus = "pending";
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    appState.geoStatus = "unavailable";
    setRunStatus("Qualified verification is unavailable. This run can continue as Practice Only.");
    return;
  }
  try {
    appState.geoWatchId = navigator.geolocation.watchPosition(
      handleLocationSample,
      handleLocationError,
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      },
    );
  } catch (_) {
    appState.geoStatus = "unavailable";
    setRunStatus("Qualified verification could not start. This run can continue as Practice Only.");
  }
}

function handleLocationSample(position) {
  if (!appState.running) return;
  const coords = position && position.coords ? position.coords : null;
  if (!coords) return;
  const lat = Number(coords.latitude);
  const lon = Number(coords.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
  appState.geoStatus = "active";
  appState.routeSamples.push({
    lat,
    lon,
    accuracy: Number(coords.accuracy || 0),
    speed: Number.isFinite(coords.speed) ? Number(coords.speed) : null,
    heading: Number.isFinite(coords.heading) ? Number(coords.heading) : null,
    timestamp: Number(position.timestamp || Date.now()),
  });
  if (appState.routeSamples.length > 7200) appState.routeSamples.shift();
}

function handleLocationError(error) {
  if (error && error.code === 1) {
    appState.geoStatus = "denied";
    setRunStatus("Qualified verification permission was denied. This run can continue as Practice Only.");
    return;
  }
  appState.geoStatus = "unavailable";
  setRunStatus("Qualified verification signal is unavailable. This run can continue as Practice Only.");
}

function clearLocationWatch() {
  if (
    appState.geoWatchId !== null
    && typeof navigator !== "undefined"
    && navigator.geolocation
  ) {
    navigator.geolocation.clearWatch(appState.geoWatchId);
  }
  appState.geoWatchId = null;
}

async function ensureAudioCoach() {
  if (!appState.audioEnabled) return;
  if (typeof window === "undefined") return;
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return;
  if (appState.audio && appState.audio.context) {
    if (appState.audio.context.state === "suspended") {
      await appState.audio.context.resume();
    }
    return;
  }
  try {
    const context = new AudioContextConstructor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(180, context.currentTime);
    gain.gain.setValueAtTime(0, context.currentTime);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    appState.audio = { context, oscillator, gain };
  } catch (_) {
    appState.audio = null;
  }
}

function updateAudioCoach() {
  const audio = appState.audio;
  if (!audio || !appState.running) return;
  const thresholdG = DIFFICULTIES[appState.difficulty].thresholdG;
  const frequency = computeAudioTargetFrequency({
    totalG: appState.currentG.totalG,
    thresholdG,
  });
  const gainValue = computeAudioTargetGain({
    totalG: appState.currentG.totalG,
    thresholdG,
    audioLevel: appState.audioLevel,
    audioEnabled: appState.audioEnabled,
  });
  const now = audio.context.currentTime;
  audio.oscillator.frequency.cancelScheduledValues(now);
  audio.oscillator.frequency.setTargetAtTime(frequency, now, 0.06);
  audio.gain.gain.cancelScheduledValues(now);
  audio.gain.gain.setTargetAtTime(gainValue, now, 0.08);
}

function stopAudioCoach() {
  const audio = appState.audio;
  if (!audio) return;
  try {
    audio.gain.gain.setTargetAtTime(0, audio.context.currentTime, 0.03);
    window.setTimeout(() => {
      try {
        audio.oscillator.stop();
        audio.context.close();
      } catch (_) {
        // Ignore cleanup races.
      }
    }, 120);
  } catch (_) {
    // Ignore cleanup races.
  }
  appState.audio = null;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

function distanceMiles(left, right) {
  const earthRadiusMiles = 3958.7613;
  const lat1 = toRadians(left.lat);
  const lat2 = toRadians(right.lat);
  const deltaLat = toRadians(right.lat - left.lat);
  const deltaLon = toRadians(right.lon - left.lon);
  const a =
    Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function headingDegrees(left, right) {
  const lat1 = toRadians(left.lat);
  const lat2 = toRadians(right.lat);
  const deltaLon = toRadians(right.lon - left.lon);
  const y = Math.sin(deltaLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2)
    - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

function headingDeltaDegrees(leftHeading, rightHeading) {
  const delta = Math.abs(rightHeading - leftHeading) % 360;
  return delta > 180 ? 360 - delta : delta;
}

function median(values) {
  const sorted = values
    .map(Number)
    .filter(Number.isFinite)
    .sort((left, right) => left - right);
  if (!sorted.length) return 0;
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2) return sorted[middle];
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

function analyzeRoute(samples) {
  const allSamples = Array.isArray(samples) ? samples : [];
  const coordinateSamples = allSamples.filter(
    (sample) =>
      Number.isFinite(sample.lat)
      && Number.isFinite(sample.lon)
      && Number.isFinite(sample.timestamp),
  );
  const acceptableSamples = coordinateSamples.filter(
    (sample) => Number(sample.accuracy || 9999) <= 50,
  );
  const accuracyPercent = coordinateSamples.length
    ? (acceptableSamples.length / coordinateSamples.length) * 100
    : 0;

  let totalDistanceMiles = 0;
  let movingDistanceMiles = 0;
  let movingDurationSeconds = 0;
  let validSegmentCount = 0;
  let aboveMinSpeedCount = 0;
  let impossibleJumpCount = 0;
  let previousHeading = null;
  let totalAbsHeadingChangeDegrees = 0;
  let significantTurnCount = 0;
  const movingSpeedsMph = [];

  for (let index = 1; index < coordinateSamples.length; index += 1) {
    const previous = coordinateSamples[index - 1];
    const current = coordinateSamples[index];
    const seconds = (current.timestamp - previous.timestamp) / 1000;
    if (seconds <= 0 || seconds > 90) continue;
    const segmentDistanceMiles = distanceMiles(previous, current);
    if (!Number.isFinite(segmentDistanceMiles) || segmentDistanceMiles < 0.001) {
      continue;
    }
    const speedMph = (segmentDistanceMiles / seconds) * 3600;
    if (speedMph > 130 || (segmentDistanceMiles > 0.65 && seconds < 12)) {
      impossibleJumpCount += 1;
      continue;
    }

    validSegmentCount += 1;
    totalDistanceMiles += segmentDistanceMiles;

    if (speedMph >= MIN_MOVEMENT_MPH) {
      aboveMinSpeedCount += 1;
      movingDurationSeconds += seconds;
      movingDistanceMiles += segmentDistanceMiles;
      movingSpeedsMph.push(speedMph);
    }

    const heading = headingDegrees(previous, current);
    if (previousHeading !== null && segmentDistanceMiles >= 0.01) {
      const delta = headingDeltaDegrees(previousHeading, heading);
      if (delta >= 6) totalAbsHeadingChangeDegrees += delta;
      if (delta >= 20 && segmentDistanceMiles >= 0.015) {
        significantTurnCount += 1;
      }
    }
    previousHeading = heading;
  }

  const averageMovingSpeedMph = movingDurationSeconds > 0
    ? (movingDistanceMiles / movingDurationSeconds) * 3600
    : 0;
  const medianMovingSpeedMph = median(movingSpeedsMph);
  const percentSamplesAboveMinSpeed = validSegmentCount
    ? (aboveMinSpeedCount / validSegmentCount) * 100
    : 0;
  const significantTurnsPerMile =
    significantTurnCount / Math.max(totalDistanceMiles, 0.1);
  const headingChangePerMile =
    totalAbsHeadingChangeDegrees / Math.max(totalDistanceMiles, 0.1);
  const distanceScore = clamp(totalDistanceMiles / 5, 0, 1);
  const turnDensityScore = clamp(significantTurnsPerMile / 12, 0, 1);
  const curvatureScore = clamp(headingChangePerMile / 900, 0, 1);
  const routeDifficultyScore =
    0.3 * distanceScore + 0.4 * turnDensityScore + 0.3 * curvatureScore;

  return {
    totalDistanceMiles,
    movingDurationSeconds,
    averageMovingSpeedMph,
    medianMovingSpeedMph,
    percentSamplesAboveMinSpeed,
    gpsAccuracyPercent: accuracyPercent,
    gpsAccuracyLabel:
      accuracyPercent >= 70 ? "Acceptable" : accuracyPercent >= 50 ? "Mixed" : "Weak",
    validSegmentCount,
    impossibleJumpCount,
    impossibleJumpPercent: validSegmentCount
      ? (impossibleJumpCount / validSegmentCount) * 100
      : impossibleJumpCount > 0
        ? 100
        : 0,
    significantTurnCount,
    significantTurnsPerMile,
    totalAbsHeadingChangeDegrees,
    headingChangePerMile,
    distanceScore,
    turnDensityScore,
    curvatureScore,
    routeDifficultyScore,
    routeDifficultyLabel: routeDifficultyLabel(routeDifficultyScore),
  };
}

function qualificationForRoute({ durationSeconds, route, motion, geoStatus }) {
  const reasons = [];
  if (geoStatus === "denied") reasons.push("Qualified verification permission was denied.");
  if (geoStatus === "unavailable") reasons.push("Qualified verification was unavailable.");
  if (durationSeconds < QUALIFICATION_RULES.minDurationSeconds) {
    reasons.push("Run duration was below the qualified-run minimum.");
  }
  if (!route || route.totalDistanceMiles < QUALIFICATION_RULES.minDistanceMiles) {
    reasons.push("Verified distance was below the qualified-run minimum.");
  }
  if (!route || route.movingDurationSeconds < QUALIFICATION_RULES.minMovingDurationSeconds) {
    reasons.push("Movement validation was too short.");
  }
  if (!route || route.medianMovingSpeedMph < QUALIFICATION_RULES.minMedianMovingSpeedMph) {
    reasons.push("Movement validation was below the qualified-run threshold.");
  }
  if (
    !route
    || route.percentSamplesAboveMinSpeed
      < QUALIFICATION_RULES.minPercentSamplesAboveMinSpeed
  ) {
    reasons.push("Movement validation was too intermittent.");
  }
  if (!route || route.gpsAccuracyPercent < QUALIFICATION_RULES.minGpsAccuracyPercent) {
    reasons.push("Verification signal quality was not acceptable for most samples.");
  }
  if (
    route
    && route.impossibleJumpPercent > QUALIFICATION_RULES.maxImpossibleGpsJumpPercent
  ) {
    reasons.push("Impossible verification jumps dominated the route signal.");
  }
  if (!motion || motion.samples < 20) {
    reasons.push("Motion sensor samples were insufficient.");
  }
  const impossibleMotionPercent = motion && motion.samples
    ? (motion.impossibleSpikes / motion.samples) * 100
    : 100;
  if (impossibleMotionPercent > QUALIFICATION_RULES.maxImpossibleMotionSpikePercent) {
    reasons.push("Impossible acceleration spikes dominated the motion signal.");
  }
  const orientationPercent = motion && motion.orientationSamples
    ? (motion.orientationUnstableSamples / motion.orientationSamples) * 100
    : 100;
  if (
    !motion
    || motion.orientationSamples < 10
    || orientationPercent > QUALIFICATION_RULES.maxOrientationUnstablePercent
  ) {
    reasons.push("Phone orientation was not stable enough after calibration.");
  }

  if (reasons.length) {
    return {
      status: "practice",
      label: "Practice Only",
      message: "Session saved as practice, but not qualified for route-based achievements.",
      reasons,
    };
  }
  return {
    status: "qualified",
    label: "Qualified",
    message: "Qualified Run complete. Route context can unlock qualified milestones.",
    reasons: [],
  };
}

function buildSummary() {
  const endedAt = new Date();
  const durationSeconds = appState.startPerformanceMs
    ? (performance.now() - appState.startPerformanceMs) / 1000
    : 0;
  const route = appState.mode === "qualified"
    ? analyzeRoute(appState.routeSamples)
    : null;
  const qualification = appState.mode === "qualified"
    ? qualificationForRoute({
        durationSeconds,
        route,
        motion: appState.motion,
        geoStatus: appState.geoStatus,
      })
    : {
        status: "practice",
        label: "Practice Only",
        message: "Practice score complete. Basic Mode used motion sensors only.",
        reasons: [],
      };
  const waterLeft = roundTo(appState.waterLeft, 1);
  const waterSpilled = roundTo(100 - waterLeft, 1);
  const routeData = route || {};
  const summary = {
    date: endedAt.toISOString(),
    mode: appState.mode,
    difficulty: appState.difficulty,
    difficultyLabel: DIFFICULTIES[appState.difficulty].label,
    thresholdG: DIFFICULTIES[appState.difficulty].thresholdG,
    waterLeft,
    waterSpilled,
    rank: rankForWater(waterLeft),
    durationSeconds: Math.round(durationSeconds),
    qualificationStatus: qualification.status,
    qualificationLabel: qualification.label,
    qualificationMessage: qualification.message,
    qualificationReasons: qualification.reasons,
    harshInputCount:
      appState.motion.harshBraking
      + appState.motion.harshAcceleration
      + appState.motion.harshLateral
      + appState.motion.abruptTransitions,
    harshBraking: appState.motion.harshBraking,
    harshAcceleration: appState.motion.harshAcceleration,
    harshLateral: appState.motion.harshLateral,
    lateralJerk: appState.motion.lateralJerk,
    abruptTransitions: appState.motion.abruptTransitions,
    motionSamples: appState.motion.samples,
    distanceMiles: roundTo(routeData.totalDistanceMiles || 0, 2),
    movingDurationSeconds: Math.round(routeData.movingDurationSeconds || 0),
    averageMovingSpeedMph: roundTo(routeData.averageMovingSpeedMph || 0, 1),
    medianMovingSpeedMph: roundTo(routeData.medianMovingSpeedMph || 0, 1),
    percentSamplesAboveMinSpeed: roundTo(routeData.percentSamplesAboveMinSpeed || 0, 1),
    gpsAccuracyLabel: routeData.gpsAccuracyLabel || "Unavailable",
    gpsAccuracyPercent: roundTo(routeData.gpsAccuracyPercent || 0, 1),
    significantTurnCount: routeData.significantTurnCount || 0,
    significantTurnsPerMile: roundTo(routeData.significantTurnsPerMile || 0, 1),
    headingChangePerMile: roundTo(routeData.headingChangePerMile || 0, 0),
    turnDensityScore: roundTo(routeData.turnDensityScore || 0, 2),
    curvatureScore: roundTo(routeData.curvatureScore || 0, 2),
    routeDifficultyScore: roundTo(routeData.routeDifficultyScore || 0, 2),
    routeDifficultyLabel: route ? routeData.routeDifficultyLabel : null,
    unlockedBadges: [],
  };
  summary.routeType = classifyRouteType(summary);
  summary.cargoCondition = calculateCargoCondition(summary);
  return summary;
}

function setRunStatus(message) {
  if (elements.runStatus) elements.runStatus.textContent = message;
}

function showView(viewName) {
  const views = {
    landing: elements.landingView,
    run: elements.runView,
    unsupported: elements.unsupportedView,
    summary: elements.summaryView,
  };
  Object.entries(views).forEach(([name, node]) => {
    if (!node) return;
    node.classList.toggle("is-hidden", name !== viewName);
  });
  renderDiscordCtas(viewName);
}

function setLandingStatus(message) {
  if (elements.landingStatus) elements.landingStatus.textContent = message;
}

function showUnsupported(message) {
  stopAxisPreview();
  if (elements.unsupportedCopy) elements.unsupportedCopy.textContent = message;
  showView("unsupported");
}

function mountConfigDescription(config) {
  const normalized = normalizeMountConfig(config);
  const lateral = normalized.lateralInvert ? `-${normalized.lateralAxis}` : normalized.lateralAxis;
  const longitudinal = normalized.longitudinalInvert
    ? `-${normalized.longitudinalAxis}`
    : normalized.longitudinalAxis;
  if (normalized.mode === "flat") {
    return "Flat mount maps side-to-side from device X and braking/acceleration from device Y.";
  }
  if (normalized.mode === "upright") {
    return `Upright mount maps side-to-side from device X and braking/acceleration from device ${longitudinal.toUpperCase()}.`;
  }
  return `Custom mount maps side-to-side from device ${lateral.toUpperCase()} and braking/acceleration from device ${longitudinal.toUpperCase()}.`;
}

function renderMountControls() {
  const config = normalizeMountConfig(appState.mountConfig);
  appState.mountConfig = config;
  document.querySelectorAll("[data-mount-mode]").forEach((button) => {
    const active = button.dataset.mountMode === config.mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-checked", String(active));
  });
  if (elements.mountStatus) {
    elements.mountStatus.textContent = mountConfigDescription(config);
  }
  if (elements.uprightAxisPanel) {
    elements.uprightAxisPanel.classList.toggle("is-hidden", config.mode !== "upright");
  }
  if (elements.customAxisPanel) {
    elements.customAxisPanel.classList.toggle("is-hidden", config.mode !== "custom");
  }
  if (elements.uprightLongitudinalInvert) {
    elements.uprightLongitudinalInvert.checked =
      config.mode === "upright" && config.longitudinalInvert;
  }
  if (config.mode === "custom") {
    if (elements.customLateralAxis) elements.customLateralAxis.value = config.lateralAxis;
    if (elements.customLongitudinalAxis) {
      elements.customLongitudinalAxis.value = config.longitudinalAxis;
    }
    if (elements.customLateralInvert) {
      elements.customLateralInvert.checked = Boolean(config.lateralInvert);
    }
    if (elements.customLongitudinalInvert) {
      elements.customLongitudinalInvert.checked = Boolean(config.longitudinalInvert);
    }
  }
  if (config.mode !== "custom") stopAxisPreview();
}

function renderAudioLevelControls() {
  const audioLevel = normalizeAudioLevel(appState.audioLevel);
  appState.audioLevel = audioLevel;
  document
    .querySelectorAll("[data-audio-level], [data-audio-level-running]")
    .forEach((button) => {
      const level = button.dataset.audioLevel || button.dataset.audioLevelRunning;
      const active = level === audioLevel;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-checked", String(active));
    });
}

function setAudioLevel(level) {
  appState.audioLevel = normalizeAudioLevel(level);
  renderAudioLevelControls();
  renderCollectionPanel(loadGameState());
  persistAudioLevel();
  updateAudioCoach();
}

function customMountConfigFromControls() {
  return normalizeMountConfig({
    mode: "custom",
    lateralAxis: elements.customLateralAxis ? elements.customLateralAxis.value : "x",
    lateralInvert: Boolean(
      elements.customLateralInvert && elements.customLateralInvert.checked,
    ),
    longitudinalAxis: elements.customLongitudinalAxis
      ? elements.customLongitudinalAxis.value
      : "y",
    longitudinalInvert: Boolean(
      elements.customLongitudinalInvert && elements.customLongitudinalInvert.checked,
    ),
  });
}

function setMountMode(mode) {
  if (mode === "custom") {
    appState.mountConfig = customMountConfigFromControls();
  } else if (mode === "upright") {
    appState.mountConfig = normalizeMountConfig({
      mode: "upright",
      longitudinalInvert: Boolean(
        elements.uprightLongitudinalInvert
          && elements.uprightLongitudinalInvert.checked,
      ),
    });
  } else {
    appState.mountConfig = { ...MOUNT_PRESETS.flat };
  }
  renderMountControls();
  persistMountConfig();
}

function updateUprightMountConfig() {
  appState.mountConfig = normalizeMountConfig({
    mode: "upright",
    longitudinalInvert: Boolean(
      elements.uprightLongitudinalInvert
        && elements.uprightLongitudinalInvert.checked,
    ),
  });
  renderMountControls();
  persistMountConfig();
}

function updateCustomMountConfig() {
  appState.mountConfig = customMountConfigFromControls();
  renderMountControls();
  persistMountConfig();
}

function renderAxisPreview(vector) {
  const values = vector || { x: 0, y: 0, z: 0 };
  DEVICE_AXES.forEach((axis) => {
    const valueG = deviceAxisValue(values, axis) / GRAVITY_METERS_PER_SECOND;
    const clamped = clamp(valueG / 1.2, -1, 1) * 50;
    const bar = elements.axisBars ? elements.axisBars[axis] : null;
    const output = elements.axisValues ? elements.axisValues[axis] : null;
    if (bar) {
      if (clamped >= 0) {
        bar.style.left = "50%";
        bar.style.width = `${clamped}%`;
      } else {
        bar.style.left = `${50 + clamped}%`;
        bar.style.width = `${Math.abs(clamped)}%`;
      }
      bar.style.background = Math.abs(valueG) > 0.35 ? "#f0b95a" : "#55d98a";
    }
    if (output) output.textContent = `${valueG.toFixed(2)}G`;
  });
}

function previewVectorFromEvent(event) {
  const linear = vectorFromMotion(event.acceleration);
  if (linear && vectorMagnitude(linear) >= 0.005) return linear;
  return vectorFromMotion(event.accelerationIncludingGravity);
}

function handleAxisPreviewMotionEvent(event) {
  if (!appState.axisPreviewActive || appState.running || appState.calibrating) {
    return;
  }
  const raw = previewVectorFromEvent(event);
  if (!raw) return;
  if (!appState.axisPreviewBaseline) {
    appState.axisPreviewBaseline = raw;
    renderAxisPreview({ x: 0, y: 0, z: 0 });
    return;
  }
  const relative = subtractVector(raw, appState.axisPreviewBaseline);
  appState.axisPreviewFiltered = lowPassVector(
    appState.axisPreviewFiltered,
    relative,
    0.24,
  );
  renderAxisPreview(appState.axisPreviewFiltered);
}

async function startAxisPreview() {
  if (appState.axisPreviewActive) {
    appState.axisPreviewBaseline = null;
    appState.axisPreviewFiltered = null;
    renderAxisPreview({ x: 0, y: 0, z: 0 });
    if (elements.mountStatus) {
      elements.mountStatus.textContent =
        "Axis preview reset. Gently accelerate/brake and watch which device axis changes.";
    }
    return;
  }
  if (!hasDeviceMotionSupport()) {
    if (elements.mountStatus) {
      elements.mountStatus.textContent =
        "DeviceMotion is not available in this browser.";
    }
    return;
  }
  const permission = await requestMotionPermission();
  if (!permission.ok) {
    if (elements.mountStatus) elements.mountStatus.textContent = permission.reason;
    return;
  }
  appState.axisPreviewActive = true;
  appState.axisPreviewBaseline = null;
  appState.axisPreviewFiltered = null;
  if (elements.axisPreviewButton) {
    elements.axisPreviewButton.textContent = "Reset Axis Preview";
  }
  if (elements.mountStatus) {
    elements.mountStatus.textContent =
      "Axis preview is local only. Gently accelerate/brake and watch which device axis changes.";
  }
  window.addEventListener("devicemotion", handleAxisPreviewMotionEvent, {
    passive: true,
  });
}

function stopAxisPreview() {
  if (
    appState.axisPreviewActive
    && typeof window !== "undefined"
    && window.removeEventListener
  ) {
    window.removeEventListener("devicemotion", handleAxisPreviewMotionEvent);
  }
  appState.axisPreviewActive = false;
  appState.axisPreviewBaseline = null;
  appState.axisPreviewFiltered = null;
  if (elements.axisPreviewButton) {
    elements.axisPreviewButton.textContent = "Enable Axis Preview";
  }
  renderAxisPreview({ x: 0, y: 0, z: 0 });
}

function scheduleRender() {
  if (appState.renderPending) return;
  appState.renderPending = true;
  requestAnimationFrame(() => {
    appState.renderPending = false;
    renderRunState();
  });
}

function renderRunState() {
  if (elements.waterPercent) {
    elements.waterPercent.textContent = formatPercent(appState.waterLeft);
  }
  if (elements.durationValue) {
    const elapsed = appState.startPerformanceMs
      ? (performance.now() - appState.startPerformanceMs) / 1000
      : 0;
    elements.durationValue.textContent = formatDuration(elapsed);
  }
  if (elements.harshValue && appState.motion) {
    elements.harshValue.textContent = String(
      appState.motion.harshBraking
        + appState.motion.harshAcceleration
        + appState.motion.harshLateral
        + appState.motion.abruptTransitions,
    );
  }
  if (elements.gValue) {
    elements.gValue.textContent = `${appState.currentG.totalG.toFixed(2)}G`;
  }
  drawCupCanvas(elements.cupCanvas, appState.currentG, appState.waterLeft);
  if (appState.running) requestAnimationFrame(renderRunState);
}

function drawFallbackTofuCargoMascot(context, tofuWidth, tofuHeight) {
  context.save();
  context.translate(-tofuWidth * 0.68, tofuHeight * 0.2);
  context.rotate(-0.22);
  context.fillStyle = "#f7f3df";
  context.strokeStyle = "#101516";
  context.lineWidth = 6;
  context.beginPath();
  context.roundRect(-tofuWidth * 0.2, -tofuHeight * 0.16, tofuWidth * 0.42, tofuHeight * 0.32, 18);
  context.fill();
  context.stroke();
  context.restore();

  context.save();
  context.translate(tofuWidth * 0.68, tofuHeight * 0.2);
  context.rotate(0.22);
  context.fillStyle = "#f7f3df";
  context.strokeStyle = "#101516";
  context.lineWidth = 6;
  context.beginPath();
  context.roundRect(-tofuWidth * 0.2, -tofuHeight * 0.16, tofuWidth * 0.42, tofuHeight * 0.32, 18);
  context.fill();
  context.stroke();
  context.restore();

  context.fillStyle = "#ded7bd";
  context.strokeStyle = "#101516";
  context.lineWidth = 7;
  context.beginPath();
  context.roundRect(
    -tofuWidth * 0.52,
    -tofuHeight * 0.42,
    tofuWidth * 0.38,
    tofuHeight * 0.88,
    16,
  );
  context.fill();
  context.stroke();

  context.fillStyle = "#fffdf0";
  context.strokeStyle = "#101516";
  context.lineWidth = 7;
  context.beginPath();
  context.moveTo(-tofuWidth * 0.32, -tofuHeight * 0.58);
  context.lineTo(tofuWidth * 0.4, -tofuHeight * 0.52);
  context.quadraticCurveTo(tofuWidth * 0.58, -tofuHeight * 0.48, tofuWidth * 0.55, -tofuHeight * 0.3);
  context.lineTo(tofuWidth * 0.48, -tofuHeight * 0.42);
  context.lineTo(-tofuWidth * 0.5, -tofuHeight * 0.38);
  context.quadraticCurveTo(-tofuWidth * 0.58, -tofuHeight * 0.52, -tofuWidth * 0.32, -tofuHeight * 0.58);
  context.fill();
  context.stroke();

  context.fillStyle = "#f7f3df";
  context.strokeStyle = "#101516";
  context.lineWidth = 7;
  context.beginPath();
  context.roundRect(
    -tofuWidth / 2,
    -tofuHeight / 2,
    tofuWidth,
    tofuHeight,
    18,
  );
  context.fill();
  context.stroke();

  context.fillStyle = "rgba(225, 216, 190, 0.82)";
  [
    [-0.34, -0.25],
    [0.24, -0.28],
    [-0.16, 0.28],
    [0.34, 0.22],
    [-0.44, 0.08],
  ].forEach(([x, y]) => {
    context.beginPath();
    context.arc(x * tofuWidth, y * tofuHeight, 5, 0, Math.PI * 2);
    context.fill();
  });

  context.strokeStyle = "#101516";
  context.lineWidth = 5;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(-tofuWidth * 0.28, -tofuHeight * 0.22);
  context.lineTo(-tofuWidth * 0.1, -tofuHeight * 0.16);
  context.moveTo(tofuWidth * 0.1, -tofuHeight * 0.16);
  context.lineTo(tofuWidth * 0.3, -tofuHeight * 0.24);
  context.stroke();

  context.fillStyle = "#101516";
  context.beginPath();
  context.arc(-tofuWidth * 0.17, -tofuHeight * 0.02, 8, 0, Math.PI * 2);
  context.arc(tofuWidth * 0.17, -tofuHeight * 0.02, 8, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#f7f3df";
  context.beginPath();
  context.arc(-tofuWidth * 0.14, -tofuHeight * 0.05, 2.3, 0, Math.PI * 2);
  context.arc(tofuWidth * 0.2, -tofuHeight * 0.05, 2.3, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#101516";
  context.lineWidth = 4;
  context.beginPath();
  context.arc(0, tofuHeight * 0.08, tofuWidth * 0.11, 0.12 * Math.PI, 0.88 * Math.PI);
  context.stroke();

  context.save();
  context.translate(0, tofuHeight * 0.42);
  context.strokeStyle = "#101516";
  context.lineWidth = 9;
  context.beginPath();
  context.arc(0, 0, tofuWidth * 0.32, Math.PI * 1.08, Math.PI * 1.92);
  context.stroke();
  context.beginPath();
  context.moveTo(-tofuWidth * 0.22, -tofuHeight * 0.02);
  context.lineTo(0, tofuHeight * 0.08);
  context.lineTo(tofuWidth * 0.22, -tofuHeight * 0.02);
  context.stroke();
  context.fillStyle = "#101516";
  context.beginPath();
  context.arc(0, tofuHeight * 0.08, tofuWidth * 0.08, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawCupCanvas(canvas, currentG, waterLeft) {
  if (!canvas || !canvas.getContext) return;
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const traySize = Math.min(width, height) * 0.68;
  const trayX = centerX - traySize / 2;
  const trayY = centerY - traySize / 2;
  const trayRadius = 44;
  const dangerInset = traySize * 0.12;
  const maxOffset = traySize * 0.32;
  const thresholdG = DIFFICULTIES[appState.difficulty].thresholdG;
  const reducedMotion = prefersReducedMotion();
  const visualFrame = Math.floor(
    (typeof performance !== "undefined" ? performance.now() : Date.now()) / 16,
  );
  const visual = updateTofuCargoVisualState(
    appState.tofuVisual,
    currentG,
    {
      thresholdG,
      maxOffset,
      reducedMotion,
      frame: visualFrame,
    },
  );
  const dangerRatio = clamp(
    Number(currentG && currentG.totalG ? currentG.totalG : 0) / thresholdG,
    0,
    1.6,
  );
  const tofuSize = traySize * 0.24;
  const tofuX = centerX + visual.tofuX;
  const tofuY = centerY + visual.tofuY;
  const squish = reducedMotion ? 0 : visual.tofuSquish;
  const tofuWidth = tofuSize * (1 + squish * 0.08);
  const tofuHeight = tofuSize * (1 - squish * 0.06);

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#070a0a";
  context.fillRect(0, 0, width, height);

  context.save();
  context.fillStyle = "#101516";
  context.strokeStyle = "rgba(244, 247, 239, 0.18)";
  context.lineWidth = 7;
  context.beginPath();
  context.roundRect(trayX, trayY, traySize, traySize, trayRadius);
  context.fill();
  context.stroke();

  context.fillStyle = "rgba(110, 198, 255, 0.07)";
  context.beginPath();
  context.roundRect(
    trayX + dangerInset,
    trayY + dangerInset,
    traySize - dangerInset * 2,
    traySize - dangerInset * 2,
    28,
  );
  context.fill();

  context.beginPath();
  context.roundRect(
    trayX + dangerInset,
    trayY + dangerInset,
    traySize - dangerInset * 2,
    traySize - dangerInset * 2,
    28,
  );
  context.strokeStyle = dangerRatio > 1
    ? `rgba(240, 185, 90, ${clamp(0.45 + (dangerRatio - 1) * 0.5, 0.45, 0.9)})`
    : "rgba(110, 198, 255, 0.56)";
  context.lineWidth = dangerRatio > 1 ? 9 : 5;
  context.stroke();

  if (visual.recentSpillParticles.length) {
    visual.recentSpillParticles.forEach((particle) => {
      const alpha = 1 - particle.age / particle.life;
      context.beginPath();
      context.arc(
        centerX + particle.x * maxOffset,
        centerY + particle.y * maxOffset,
        5 + alpha * 5,
        0,
        Math.PI * 2,
      );
      context.fillStyle = `rgba(240, 185, 90, ${0.16 + alpha * 0.34})`;
      context.fill();
    });
  }

  if (!reducedMotion && Math.abs(visual.tofuVx) + Math.abs(visual.tofuVy) > 1.6) {
    context.strokeStyle = "rgba(244, 247, 239, 0.18)";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(tofuX - visual.tofuVx * 2.4, tofuY - tofuHeight * 0.55);
    context.lineTo(tofuX - visual.tofuVx * 4.8, tofuY - tofuHeight * 0.72);
    context.moveTo(tofuX - visual.tofuVx * 2.2, tofuY + tofuHeight * 0.52);
    context.lineTo(tofuX - visual.tofuVx * 4.3, tofuY + tofuHeight * 0.68);
    context.stroke();
  }

  context.save();
  context.translate(tofuX, tofuY);
  context.rotate(visual.tofuRotation);
  context.fillStyle = "rgba(0, 0, 0, 0.32)";
  context.beginPath();
  context.ellipse(0, tofuHeight * 0.64, tofuWidth * 0.58, tofuHeight * 0.16, 0, 0, Math.PI * 2);
  context.fill();

  const mascotImage = getTofuCargoMascotImage();
  if (isImageReady(mascotImage)) {
    const imageRatio = mascotImage.naturalWidth / mascotImage.naturalHeight;
    const mascotHeight = tofuHeight * 1.95;
    const mascotWidth = mascotHeight * imageRatio;
    context.drawImage(
      mascotImage,
      -mascotWidth / 2,
      -mascotHeight / 2,
      mascotWidth,
      mascotHeight,
    );
  } else {
    drawFallbackTofuCargoMascot(context, tofuWidth, tofuHeight);
  }
  context.restore();

  context.beginPath();
  context.roundRect(trayX + 14, trayY + traySize - 68, traySize - 28, 40, 20);
  context.fillStyle = "rgba(5, 6, 6, 0.72)";
  context.fill();
  context.strokeStyle = "rgba(244, 247, 239, 0.11)";
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = dangerRatio > 1 ? "#f0b95a" : "#9ee9bf";
  context.font = "800 21px Inter, Arial, sans-serif";
  context.textAlign = "center";
  context.fillText(
    dangerRatio > 1 ? "Cargo near spill edge" : "Tofu cargo steady",
    centerX,
    trayY + traySize - 41,
  );
  context.fillStyle = "#bbc7c0";
  context.font = "700 24px Inter, Arial, sans-serif";
  context.fillText(`Cargo Condition ${formatPercent(waterLeft)}`, centerX, height - 42);
  context.restore();
}

function summaryMetric(label, value, className = "") {
  return `<div><span>${escapeHtml(label)}</span><strong class="${className}">${escapeHtml(value)}</strong></div>`;
}

function normalizedDiscordConfig(config = DISCORD_CONFIG) {
  const source = config && typeof config === "object" ? config : {};
  const inviteUrl = typeof source.inviteUrl === "string" ? source.inviteUrl.trim() : "";
  return {
    enabled: Boolean(source.enabled && inviteUrl),
    inviteUrl: inviteUrl || null,
  };
}

function discordCtaHtml(variant, config = DISCORD_CONFIG) {
  const discord = normalizedDiscordConfig(config);
  if (!discord.enabled) return "";
  const summary = variant === "summary";
  return `
    <section class="nospill-section nospill-discord-panel" aria-label="Discord community">
      <p class="nospill-kicker">Community</p>
      <h3>Join the Delivery Crew</h3>
      <p>
        ${summary
          ? "Want to share your run or suggest the next cargo?"
          : "Share delivery cards, suggest features, and follow secret merch drops."}
      </p>
      <a
        class="nospill-secondary nospill-link-button"
        href="${escapeHtml(discord.inviteUrl)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${summary ? "Join the Delivery Crew" : "Join Discord"}
      </a>
    </section>
  `;
}

function renderDiscordCtas(viewName = "landing") {
  const activeDrive = appState.running || appState.calibrating || viewName === "run";
  const config = normalizedDiscordConfig(DISCORD_CONFIG);
  const shouldRender = config.enabled && !activeDrive;
  const landingHtml = shouldRender && viewName === "landing"
    ? discordCtaHtml("landing", DISCORD_CONFIG)
    : "";
  const summaryHtml = shouldRender && viewName === "summary"
    ? discordCtaHtml("summary", DISCORD_CONFIG)
    : "";
  if (elements.landingDiscordCta) {
    elements.landingDiscordCta.innerHTML = landingHtml;
    elements.landingDiscordCta.classList.toggle("is-hidden", !landingHtml);
  }
  if (elements.summaryDiscordCta) {
    elements.summaryDiscordCta.innerHTML = summaryHtml;
    elements.summaryDiscordCta.classList.toggle("is-hidden", !summaryHtml);
  }
}

function renderDeliveryLog(gameState = loadGameState()) {
  const state = normalizeGameState(gameState);
  const mission = getDailyDelivery(new Date());
  const progress = levelProgress(state.totalXP);
  const passport = deliveryPassportSummary(state);
  const recentReward = state.recentRewards && state.recentRewards.length
    ? state.recentRewards[0]
    : null;
  if (elements.driverLevel) elements.driverLevel.textContent = `Level ${progress.level}`;
  if (elements.driverLicense) {
    elements.driverLicense.textContent = `Level ${progress.level} · ${getDriverLicense(progress.level)}`;
  }
  if (elements.dailyCargo) elements.dailyCargo.textContent = mission.cargo;
  if (elements.dailyGoal) {
    elements.dailyGoal.textContent = `${mission.description} ${mission.focus}: ${mission.goal}`;
  }
  if (elements.dailyReward) elements.dailyReward.textContent = mission.reward;
  if (elements.driverTotalXP) elements.driverTotalXP.textContent = String(state.totalXP);
  if (elements.driverNextXP) {
    elements.driverNextXP.textContent = `${progress.currentXP}/${progress.nextXP} XP`;
  }
  if (elements.driverStreak) {
    const current = Number(state.streak.current || 0);
    elements.driverStreak.textContent = `${current} ${current === 1 ? "day" : "days"}`;
  }
  if (elements.nospillGearProgress) {
    const gear = state.merchProgress.nospillClubGear;
    elements.nospillGearProgress.textContent = `${gear.count}/${gear.target}`;
  }
  if (elements.recentStamps) {
    const stamps = passport.recent.map((stamp) => stamp.label);
    elements.recentStamps.innerHTML = stamps.length
      ? stamps.map((label) => `<span>${escapeHtml(label)}</span>`).join("")
      : "<span>No stamps yet</span>";
  }
  if (elements.passportProgress) {
    elements.passportProgress.textContent =
      `${passport.total}/${passport.totalAvailable} stamps`;
  }
  if (elements.recentReward) {
    elements.recentReward.textContent = recentReward
      ? `+${recentReward.xpGained} XP · ${recentReward.routeType}`
      : "No rewards yet";
  }
}

function stampLockLabel(gameState, stampId) {
  const state = normalizeGameState(gameState);
  const label = STAMP_LABELS[stampId] || stampId;
  return `${label} ${state.stamps[stampId] ? "unlocked" : "locked"}`;
}

function nextShopStep(gameState) {
  const state = normalizeGameState(gameState);
  const nextUpgrade = getShopUpgradeCatalog().find(
    (upgrade) => safeNonNegativeInteger(state.shop.upgrades[upgrade.id], 0, upgrade.maxLevel)
      < upgrade.maxLevel
      && state.shop.shopLevel >= upgrade.requiredShopLevel,
  );
  if (!nextUpgrade) return "Complete a delivery to build the shop.";
  const currentLevel = safeNonNegativeInteger(
    state.shop.upgrades[nextUpgrade.id],
    0,
    nextUpgrade.maxLevel,
  );
  const cost = shopUpgradeCost(nextUpgrade, currentLevel);
  return `${nextUpgrade.name}: ${cost.costTofuStock} tofu`;
}

function renderGameDashboard(gameState = loadGameState()) {
  const state = normalizeGameState(gameState);
  const mission = getDailyDelivery(new Date());
  const progress = levelProgress(state.totalXP);
  const passport = deliveryPassportSummary(state);
  const daily = state.dailyDeliveries[mission.dateKey];
  const gear = state.merchProgress.nospillClubGear;
  if (elements.gameDailyTitle) elements.gameDailyTitle.textContent = mission.cargo;
  if (elements.gameDailyFlavor) {
    elements.gameDailyFlavor.textContent =
      `${mission.description} Every drive is a delivery. Preserve the cargo, level up your smoothness, and unlock secret gear.`;
  }
  if (elements.gameDailyCargo) elements.gameDailyCargo.textContent = mission.cargo;
  if (elements.gameDailyGoal) elements.gameDailyGoal.textContent = mission.goal;
  if (elements.gameDailyReward) elements.gameDailyReward.textContent = mission.reward;
  if (elements.gameDailyProgress) {
    elements.gameDailyProgress.textContent = daily && daily.completed
      ? `Delivered today · ${formatPercent(daily.cargoCondition)}`
      : "Not delivered yet";
  }
  if (elements.gameDriverLicense) {
    elements.gameDriverLicense.textContent = `Level ${progress.level} · ${getDriverLicense(progress.level)}`;
  }
  if (elements.gameTotalXP) elements.gameTotalXP.textContent = `${state.totalXP} XP`;
  if (elements.gameStreak) {
    const current = Number(state.streak.current || 0);
    elements.gameStreak.textContent = `${current} ${current === 1 ? "day" : "days"}`;
  }
  if (elements.gameGearProgress) {
    elements.gameGearProgress.textContent = `${gear.count}/${gear.target}`;
  }
  if (elements.gameShopStock) elements.gameShopStock.textContent = String(state.shop.tofuStock);
  if (elements.gameShopReputation) {
    elements.gameShopReputation.textContent = String(state.shop.reputation);
  }
  if (elements.gameShopLevel) elements.gameShopLevel.textContent = `Level ${state.shop.shopLevel}`;
  if (elements.gameShopTeaser) elements.gameShopTeaser.textContent = nextShopStep(state);
  if (elements.gamePassportEmpty) {
    elements.gamePassportEmpty.textContent = passport.total
      ? `${passport.total}/${passport.totalAvailable} stamps collected.`
      : "No stamps yet. Complete your first delivery.";
  }
  if (elements.gamePassportPreview) {
    elements.gamePassportPreview.innerHTML = [
      "first_delivery",
      "daily_delivery_complete",
      "nospill_club",
      "perfect_pour",
    ].map((id) => `<span>${escapeHtml(stampLockLabel(state, id))}</span>`).join("");
  }
  if (elements.gamePackTofuButton) {
    const activeDrive = appState.running || appState.calibrating;
    elements.gamePackTofuButton.disabled = activeDrive;
    elements.gamePackTofuButton.textContent = activeDrive ? "Park First" : "Pack Tofu";
  }
}

function renderShopUpgrade(upgrade, gameState) {
  const state = normalizeGameState(gameState);
  const currentLevel = safeNonNegativeInteger(state.shop.upgrades[upgrade.id], 0, upgrade.maxLevel);
  const complete = currentLevel >= upgrade.maxLevel;
  const cost = shopUpgradeCost(upgrade, currentLevel);
  const available =
    !complete
    && state.shop.shopLevel >= upgrade.requiredShopLevel
    && state.shop.tofuStock >= cost.costTofuStock
    && state.shop.reputation >= cost.costReputation
    && !appState.running
    && !appState.calibrating;
  const costText = cost.costReputation
    ? `${cost.costTofuStock} tofu · ${cost.costReputation} reputation`
    : `${cost.costTofuStock} tofu`;
  const status = complete
    ? "Complete"
    : state.shop.shopLevel < upgrade.requiredShopLevel
      ? `Requires Shop Level ${upgrade.requiredShopLevel}`
      : costText;
  return `
    <div class="nospill-upgrade-item">
      <header>
        <strong>${escapeHtml(upgrade.name)} ${currentLevel ? `Lv ${currentLevel}` : ""}</strong>
        <small>${escapeHtml(status)}</small>
      </header>
      <small>${escapeHtml(upgrade.description)}</small>
      <small>${escapeHtml(upgrade.effect)}</small>
      <button
        class="nospill-secondary"
        type="button"
        data-shop-upgrade="${escapeHtml(upgrade.id)}"
        ${available ? "" : "disabled"}
      >
        ${complete ? "Installed" : "Buy Upgrade"}
      </button>
    </div>
  `;
}

function renderDeliveryWall(gameState = loadGameState()) {
  if (!elements.deliveryWallGrid) return;
  const state = normalizeGameState(gameState);
  const progress = state.merchProgress;
  const passport = deliveryPassportSummary(state);
  const wallItems = [
    {
      id: "nospill_club",
      label: "No-Spill Club Gear",
      status: `${progress.nospillClubGear.count}/${progress.nospillClubGear.target}`,
      unlocked: progress.nospillClubGear.unlocked,
    },
    {
      id: "perfect_pour",
      label: "Perfect Pour Drop",
      status: progress.perfectPourDrop.unlocked ? "Unlocked" : "Locked",
      unlocked: progress.perfectPourDrop.unlocked,
    },
    {
      id: "smooth_driver",
      label: "Delivery Crew",
      status: `${progress.deliveryCrew.count}/${progress.deliveryCrew.target}`,
      unlocked: progress.deliveryCrew.unlocked,
    },
    {
      id: "passport",
      label: "Recent Stamps",
      status: passport.recent.length
        ? passport.recent.map((stamp) => stamp.label).slice(0, 3).join(", ")
        : "No stamps yet",
      unlocked: passport.recent.length > 0,
    },
  ];
  elements.deliveryWallGrid.innerHTML = wallItems.map((item) => {
    const link = item.unlocked ? MERCH_LINKS[item.id] : null;
    const action = link
      ? `<a class="nospill-merch-link" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">Buy unlocked shirt</a>`
      : item.unlocked && item.id !== "passport"
        ? "<strong>Unlocked, merch coming soon.</strong>"
        : "";
    return `
      <div class="nospill-delivery-wall-item ${item.unlocked ? "" : "is-locked"}">
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.status)}</strong>
        ${action}
      </div>
    `;
  }).join("");
}

function renderTofuShop(gameState = loadGameState()) {
  const state = normalizeGameState(gameState);
  const shop = state.shop;
  const progress = shopLevelProgress(shop.reputation);
  const rate = getShopProductionRate(state);
  if (elements.shopLevelBadge) {
    elements.shopLevelBadge.textContent = `Shop Level ${shop.shopLevel}`;
  }
  if (elements.shopTofuStock) elements.shopTofuStock.textContent = String(shop.tofuStock);
  if (elements.shopReputation) elements.shopReputation.textContent = String(shop.reputation);
  if (elements.shopLevelProgress) {
    elements.shopLevelProgress.textContent =
      `Level ${progress.level} · ${progress.currentReputation}/${progress.nextReputation}`;
  }
  if (elements.shopIdleRate) elements.shopIdleRate.textContent = `${rate}/hr`;
  if (elements.packTofuButton) {
    const activeDrive = appState.running || appState.calibrating;
    elements.packTofuButton.disabled = activeDrive;
    elements.packTofuButton.textContent = activeDrive ? "Park First" : "Pack Tofu";
  }
  if (elements.packTofuHelper) {
    elements.packTofuHelper.textContent = appState.running || appState.calibrating
      ? "Shop actions unlock after you finish and park."
      : "Parked-only. Packing adds tofu stock, not reputation.";
  }
  if (elements.shopUpgradeList) {
    elements.shopUpgradeList.innerHTML = getShopUpgradeCatalog()
      .map((upgrade) => renderShopUpgrade(upgrade, state))
      .join("");
  }
  if (elements.shopOfflineEarnings) {
    elements.shopOfflineEarnings.textContent =
      `While you were away: +${shop.offlineEarnings.tofuStock} tofu stock.`;
  }
  renderDeliveryWall(state);
}

function renderCollectionItem(item, { unlocked, selected, type, activeDrive }) {
  const lockedCopy = type === "sound" ? "Sound Pack locked" : "Character locked";
  const buttonLabel = selected
    ? "Selected"
    : unlocked
      ? "Select"
      : "Locked";
  const dataAttribute = type === "sound"
    ? `data-sound-pack-id="${escapeHtml(item.id)}"`
    : `data-character-id="${escapeHtml(item.id)}"`;
  return `
    <div class="nospill-collection-item ${unlocked ? "" : "is-locked"}">
      <header>
        <strong>${escapeHtml(item.name)}</strong>
        <small>${escapeHtml(type === "sound" ? "Sound Pack" : item.role)}</small>
      </header>
      <span>${escapeHtml(item.flavor || item.description || item.behavior)}</span>
      <small>${escapeHtml(unlocked ? "Unlocked" : `Unlock: ${item.unlock}`)}</small>
      <button
        class="nospill-secondary"
        type="button"
        ${dataAttribute}
        ${unlocked && !selected && !activeDrive ? "" : "disabled"}
      >
        ${escapeHtml(activeDrive && unlocked && !selected ? "Park First" : buttonLabel || lockedCopy)}
      </button>
    </div>
  `;
}

function renderCollectionPanel(gameState = loadGameState()) {
  const state = normalizeGameState(gameState);
  const activeDrive = appState.running || appState.calibrating;
  const selectedCrew = selectedCharacter(state);
  const soundPack = selectedSoundPack(state);
  if (elements.selectedCharacterBadge) {
    elements.selectedCharacterBadge.textContent = selectedCrew
      ? selectedCrew.name
      : "No crew yet";
  }
  if (elements.selectedCharacterName) {
    elements.selectedCharacterName.textContent = selectedCrew
      ? selectedCrew.name
      : "No character selected";
  }
  if (elements.selectedCharacterFlavor) {
    elements.selectedCharacterFlavor.textContent = selectedCrew
      ? selectedCrew.flavor
      : "Complete your first delivery to meet the crew.";
  }
  if (elements.selectedSoundPackName) {
    elements.selectedSoundPackName.textContent = soundPack.name;
  }
  if (elements.selectedSoundPackFlavor) {
    elements.selectedSoundPackFlavor.textContent =
      `${soundPack.description} Muted mode disables cosmetic sound effects.`;
  }
  if (elements.characterList) {
    elements.characterList.innerHTML = CHARACTER_CATALOG.map((character) => renderCollectionItem(
      character,
      {
        unlocked: state.collection.unlockedCharacterIds.includes(character.id),
        selected: selectedCrew && selectedCrew.id === character.id,
        type: "character",
        activeDrive,
      },
    )).join("");
  }
  if (elements.soundPackList) {
    elements.soundPackList.innerHTML = SOUND_PACK_CATALOG.map((pack) => renderCollectionItem(
      pack,
      {
        unlocked: state.collection.unlockedSoundPackIds.includes(pack.id),
        selected: soundPack.id === pack.id,
        type: "sound",
        activeDrive,
      },
    )).join("");
  }
  if (elements.previewSoundButton) {
    const muted = normalizeAudioLevel(appState.audioLevel) === "muted" || !appState.audioEnabled;
    elements.previewSoundButton.disabled = activeDrive || muted;
    elements.previewSoundButton.textContent = activeDrive
      ? "Park First"
      : muted
        ? "Muted"
        : "Preview Sound";
  }
}

function renderGamePanels(gameState = loadGameState()) {
  const state = normalizeGameState(gameState);
  renderGameDashboard(state);
  renderDeliveryLog(state);
  renderMerchProgress(state);
  renderTofuShop(state);
  renderCollectionPanel(state);
}

function merchProgressMetric(label, value) {
  return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function renderMerchProgress(gameState = loadGameState()) {
  if (!elements.merchProgressGrid) return;
  const progress = normalizeGameState(gameState).merchProgress;
  elements.merchProgressGrid.innerHTML = [
    merchProgressMetric(
      "No-Spill Club Gear",
      `${progress.nospillClubGear.count}/${progress.nospillClubGear.target}`,
    ),
    merchProgressMetric(
      "Perfect Pour Drop",
      progress.perfectPourDrop.unlocked ? "Unlocked" : "Locked",
    ),
    merchProgressMetric(
      "Delivery Crew",
      `${progress.deliveryCrew.count}/${progress.deliveryCrew.target}`,
    ),
  ].join("");
}

function renderDeliverySummary(summary) {
  if (!elements.deliverySummaryGrid) return;
  const rewards = summary.deliveryRewards || {};
  const level = rewards.gameState ? rewards.gameState.level : loadGameState().level;
  const coach = rewards.coach || buildCoachRecap(summary, rewards);
  const passport = rewards.passport || deliveryPassportSummary(rewards.gameState || loadGameState());
  const merch = rewards.merchProgress || normalizeGameState(loadGameState()).merchProgress;
  const dailyDelivery = rewards.dailyDelivery || getDailyDelivery(summary.date || new Date());
  const dailyComplete = Boolean(rewards.dailyComplete);
  const shop = rewards.shop || { tofuStockGained: 0, reputationGained: 0 };
  const shopState = shop.gameState
    ? normalizeGameState(shop.gameState).shop
    : normalizeGameState(rewards.gameState || loadGameState()).shop;
  const collectionState = normalizeGameState(rewards.gameState || loadGameState());
  const crew = selectedCharacter(collectionState);
  const collectionUnlocks = rewards.collectionUnlocks || {
    newCharacterUnlocks: [],
    newSoundUnlocks: [],
  };
  const newUnlockLine = [
    ...collectionUnlocks.newCharacterUnlocks.map((unlock) => `${unlock.label} joined your Delivery Crew`),
    ...collectionUnlocks.newSoundUnlocks.map((unlock) => `${unlock.label} unlocked`),
  ].join(", ") || "No new crew or sound unlock";
  const skillLine = rewards.skillXP
    ? Object.entries(rewards.skillXP)
        .sort((left, right) => right[1] - left[1])
        .slice(0, 2)
        .map(([skill, value]) => `${SKILL_LABELS[skill]} +${value}`)
        .join(", ")
    : "No skill XP";
  const stampLine = rewards.stampLabels && rewards.stampLabels.length
    ? rewards.stampLabels.join(", ")
    : "No new stamp";
  const nextGoal = dailyComplete
    ? "Daily delivery complete. Come back tomorrow for new cargo."
    : `${dailyDelivery.cargo}: ${dailyDelivery.goal}`;
  elements.deliverySummaryGrid.innerHTML = [
    summaryMetric("Cargo Condition", formatPercent(summary.cargoCondition ?? summary.waterLeft), "nospill-is-good"),
    summaryMetric("Route Type", summary.routeType || classifyRouteType(summary)),
    summaryMetric("Rank", summary.rank),
    summaryMetric("Driver License", `Level ${level} · ${getDriverLicense(level)}`),
    summaryMetric(
      "Daily Delivery Result",
      dailyComplete ? `${dailyDelivery.cargo} delivered` : `${dailyDelivery.cargo} in progress`,
    ),
    summaryMetric("Main Damage Source", coach.damageSource),
    summaryMetric("Best Skill", coach.bestSkill),
    summaryMetric("Next Focus", coach.nextFocus),
    summaryMetric("Delivery Crew", crew ? crew.name : "No crew selected yet"),
    summaryMetric("New Unlock", newUnlockLine),
    summaryMetric("XP Gained", rewards.xpGained ? `+${rewards.xpGained}` : "+0"),
    summaryMetric("Skill XP Gained", skillLine),
    summaryMetric("Stamp Earned", stampLine),
    summaryMetric(
      "Shop Rewards",
      `+${shop.tofuStockGained || 0} tofu · +${shop.reputationGained || 0} reputation`,
    ),
    summaryMetric("Shop Level", `Level ${shopState.shopLevel}`),
    summaryMetric("Delivery Passport", `${passport.total}/${passport.totalAvailable} stamps`),
    summaryMetric(
      "No-Spill Club Gear",
      `${merch.nospillClubGear.count}/${merch.nospillClubGear.target}`,
    ),
    summaryMetric("Perfect Pour Drop", merch.perfectPourDrop.unlocked ? "Unlocked" : "Locked"),
    summaryMetric("Delivery Crew", `${merch.deliveryCrew.count}/${merch.deliveryCrew.target}`),
    summaryMetric("Next Delivery Goal", nextGoal),
  ].join("");
  if (elements.commuteMasteryCopy) {
    elements.commuteMasteryCopy.textContent = rewards.commuteMasteryMessage || coach.message || "";
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderSummary(summary) {
  appState.lastSummary = summary;
  if (elements.summaryStatusLabel) {
    elements.summaryStatusLabel.textContent = summary.qualificationLabel;
  }
  if (elements.summaryTitle) {
    elements.summaryTitle.textContent = "Delivery Complete";
  }
  if (elements.summaryWater) {
    elements.summaryWater.textContent = formatPercent(summary.cargoCondition ?? summary.waterLeft);
  }
  if (elements.summaryGrid) {
    elements.summaryGrid.innerHTML = [
      summaryMetric("Cargo Condition", formatPercent(summary.cargoCondition ?? summary.waterLeft), "nospill-is-good"),
      summaryMetric("Water Spilled", formatPercent(summary.waterSpilled)),
      summaryMetric("Route Type", summary.routeType || classifyRouteType(summary)),
      summaryMetric("Rank", summary.rank),
      summaryMetric("Harsh Inputs", String(summary.harshInputCount)),
      summaryMetric("Qualification", summary.qualificationLabel),
    ].join("");
  }

  const showRoute = summary.mode === "qualified";
  if (elements.routeContext) elements.routeContext.classList.toggle("is-hidden", !showRoute);
  if (showRoute && elements.routeGrid) {
    elements.routeGrid.innerHTML = [
      summaryMetric("Route Label", summary.routeDifficultyLabel || "Unavailable"),
      summaryMetric("Verified Distance", `${summary.distanceMiles.toFixed(2)} mi`),
      summaryMetric("Significant Turns", String(summary.significantTurnCount)),
      summaryMetric("Turns Per Mile", String(summary.significantTurnsPerMile)),
      summaryMetric("Heading Change Per Mile", `${summary.headingChangePerMile} deg`),
      summaryMetric("Signal Quality", summary.gpsAccuracyLabel),
    ].join("");
  }

  const milestoneText = summary.unlockedBadges.length
    ? `Unlocked: ${summary.unlockedBadges.map((id) => MILESTONE_LABELS[id] || id).join(", ")}`
    : "No milestone unlocked this run.";
  if (elements.milestoneOutput) elements.milestoneOutput.textContent = milestoneText;
  if (elements.summaryStatus) {
    const reasons = summary.qualificationReasons && summary.qualificationReasons.length
      ? ` ${summary.qualificationReasons[0]}`
      : "";
    elements.summaryStatus.textContent = `${summary.qualificationMessage}${reasons}`;
  }
  renderMerchPanel(loadClubState());
  renderGamePanels(summary.deliveryRewards ? summary.deliveryRewards.gameState : loadGameState());
  renderDeliverySummary(summary);
  renderShareCanvas(summary);
  showView("summary");
}

function renderMerchPanel(clubState) {
  if (!elements.merchGrid) return;
  elements.merchGrid.innerHTML = MERCH_MILESTONES.map((id) => {
    const label = MERCH_LABELS[id] || MILESTONE_LABELS[id] || id;
    const unlocked = Boolean(clubState.unlockedMilestones[id]);
    const link = unlocked ? MERCH_LINKS[id] : null;
    const action = !unlocked
      ? "<strong>Locked</strong>"
      : link
        ? `<a class="nospill-merch-link" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">Buy unlocked shirt</a>`
        : "<strong>Unlocked, merch coming soon.</strong>";
    return `
      <div class="nospill-merch-item ${unlocked ? "" : "is-locked"}">
        <span>${escapeHtml(label)}</span>
        ${action}
      </div>
    `;
  }).join("");
}

function bestUnlockedMilestone(summary) {
  const unlocked = Array.isArray(summary.unlockedBadges)
    ? summary.unlockedBadges
    : [];
  const priority = [
    "certified_smooth",
    "very_technical_pour",
    "technical_pour",
    "perfect_pour",
    "nospill_club",
    "smooth_driver",
    "passenger_approved",
    "curve_control",
    "smooth_commuter",
    "long_pour",
    "qualified_pour",
    "half_cup_hero",
    "first_pour",
  ];
  const bestId = priority.find((id) => unlocked.includes(id)) || unlocked[0];
  return bestId ? MILESTONE_LABELS[bestId] || bestId : null;
}

function qualificationShareLabel(summary) {
  return summary.qualificationStatus === "qualified"
    || summary.qualificationLabel === "Qualified"
    ? "Qualified"
    : "Practice";
}

function shareDistanceLabel(summary) {
  const distance = Number(summary.distanceMiles || 0);
  if (!Number.isFinite(distance) || distance <= 0) return "";
  return `${roundTo(distance, 1).toFixed(1)} mi`;
}

function buildShareCardData(summary, config = SHARE_CONFIG) {
  const shareConfig = normalizedShareConfig(config);
  const delivery = buildDeliverySharePayload(
    summary,
    summary.deliveryRewards || null,
    summary.deliveryRewards ? summary.deliveryRewards.gameState : null,
  );
  return {
    title: APP_BRAND,
    challengeName: "Delivery Complete",
    waterDelivered: delivery.cargoCondition,
    waterSpilled: formatPercent(summary.waterSpilled),
    rank: summary.rank,
    driverLicense: delivery.driverLicense,
    shopLevel: delivery.shopLevel,
    deliveryCrew: delivery.deliveryCrew,
    qualificationStatus: qualificationShareLabel(summary),
    routeLabel: delivery.routeType,
    distanceLabel: shareConfig.includeDistanceInShare ? shareDistanceLabel(summary) : "",
    milestone: delivery.stamp || bestUnlockedMilestone(summary),
    dailyStatus: delivery.dailyStatus,
    tagline: TAGLINE_SMOOTHER,
    shirtLine: TAGLINE_CUP,
  };
}

function normalizedShareConfig(config) {
  const source = config && typeof config === "object" ? config : {};
  const appUrl = typeof source.appUrl === "string" ? source.appUrl.trim() : "";
  return {
    includeAppLink: Boolean(source.includeAppLink && appUrl),
    appUrl: appUrl || null,
    includeDistanceInShare: Boolean(source.includeDistanceInShare),
  };
}

function buildShareText(summary, config = SHARE_CONFIG) {
  const data = buildShareCardData(summary, config);
  const milestoneText = data.milestone
    ? ` Stamp: ${data.milestone}.`
    : "";
  const lines = [
    `${APP_BRAND}: Delivery Complete. Cargo Condition: ${data.waterDelivered}. Rank: ${data.rank}. Route Type: ${data.routeLabel}.${milestoneText} ${data.tagline}`,
  ];
  if (data.driverLicense) lines.push(`Driver License: ${data.driverLicense}.`);
  if (data.shopLevel) lines.push(data.shopLevel);
  if (data.deliveryCrew) lines.push(`Delivery Crew: ${data.deliveryCrew}.`);
  if (data.dailyStatus) lines.push(data.dailyStatus);
  if (data.distanceLabel) lines.push(`Distance: ${data.distanceLabel}.`);
  const shareConfig = normalizedShareConfig(config);
  if (shareConfig.includeAppLink) lines.push(shareConfig.appUrl);
  return sanitizeShareOutput(lines.join("\n"));
}

function renderShareCanvas(summary) {
  const canvas = elements.shareCanvas;
  if (!canvas || !canvas.getContext) return;
  const data = buildShareCardData(summary);
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#090b0b";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#101516";
  context.fillRect(70, 70, width - 140, height - 140);
  context.strokeStyle = "rgba(244, 247, 239, 0.14)";
  context.lineWidth = 4;
  context.strokeRect(70, 70, width - 140, height - 140);

  context.fillStyle = "#9ee9bf";
  context.font = "800 34px Inter, Arial, sans-serif";
  context.fillText(data.title, 118, 150);

  context.fillStyle = "#bbc7c0";
  context.font = "700 28px Inter, Arial, sans-serif";
  context.fillText(data.challengeName, 118, 194);

  context.fillStyle = "#f4f7ef";
  context.font = "900 82px Inter, Arial, sans-serif";
  context.fillText(data.waterDelivered, 118, 285);

  context.fillStyle = "#bbc7c0";
  context.font = "700 32px Inter, Arial, sans-serif";
  context.fillText("Cargo Condition", 118, 336);

  context.fillStyle = "#f4f7ef";
  context.font = "900 54px Inter, Arial, sans-serif";
  context.fillText(data.rank, 118, 470);

  context.fillStyle = "#bbc7c0";
  context.font = "700 30px Inter, Arial, sans-serif";
  context.fillText(`Rank: ${data.rank}`, 118, 560);
  context.fillText(`License: ${data.driverLicense || "Local Driver"}`, 118, 622);
  context.fillText(data.shopLevel || "Shop Level 1", 118, 684);
  context.fillText(`Status: ${data.qualificationStatus}`, 118, 746);
  let detailY = 808;
  if (data.routeLabel) {
    context.fillText(`Route: ${data.routeLabel}`, 118, detailY);
    detailY += 62;
  }
  if (data.distanceLabel) {
    context.fillText(`Distance: ${data.distanceLabel}`, 118, detailY);
    detailY += 62;
  }

  const milestone = data.milestone || "No new stamp";
  context.fillStyle = "#f0b95a";
  context.fillText(`Stamp: ${milestone}`, 118, Math.max(790, detailY + 44));

  context.strokeStyle = "rgba(110, 198, 255, 0.75)";
  context.lineWidth = 10;
  context.beginPath();
  context.arc(width - 245, height - 280, 120, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = "rgba(110, 198, 255, 0.12)";
  context.beginPath();
  context.arc(width - 245, height - 280, 105, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#55d98a";
  context.beginPath();
  context.arc(width - 245, height - 280, 28, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#9ee9bf";
  context.font = "800 34px Inter, Arial, sans-serif";
  context.fillText(data.tagline, 118, height - 172);
  context.fillStyle = "#bbc7c0";
  context.font = "700 28px Inter, Arial, sans-serif";
  context.fillText(data.shirtLine, 118, height - 124);
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    if (!canvas || !canvas.toBlob) {
      resolve(null);
      return;
    }
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

function setSummaryStatusMessage(message) {
  if (elements.summaryStatus) elements.summaryStatus.textContent = message;
  if (elements.landingStatus && !appState.running && !appState.calibrating) {
    elements.landingStatus.textContent = message;
  }
}

async function shareCardFile(text) {
  const blob = await canvasToBlob(elements.shareCanvas);
  if (
    !blob
    || typeof File === "undefined"
    || typeof navigator === "undefined"
    || !navigator.canShare
  ) {
    return false;
  }
  const file = new File([blob], "tofu-driver-result.png", {
    type: "image/png",
  });
  if (!navigator.canShare({ files: [file] })) return false;
  await navigator.share({
    title: APP_BRAND,
    text,
    files: [file],
  });
  return true;
}

async function shareResult() {
  if (!appState.lastSummary) return;
  const text = buildShareText(appState.lastSummary);
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      if (await shareCardFile(text)) {
        setSummaryStatusMessage("Share card ready.");
        return;
      }
      await navigator.share({ title: APP_BRAND, text });
      setSummaryStatusMessage("Share summary ready.");
      return;
    } catch (_) {
      // Fall through to copy.
    }
  }
  const copied = await copyShareText();
  if (copied) {
    setSummaryStatusMessage("Sharing is not available here. Summary copied.");
  }
}

async function copyShareText() {
  if (!appState.lastSummary) return false;
  const text = buildShareText(appState.lastSummary);
  try {
    if (
      typeof navigator === "undefined"
      || !navigator.clipboard
      || !navigator.clipboard.writeText
    ) {
      throw new Error("clipboard unavailable");
    }
    await navigator.clipboard.writeText(text);
    setSummaryStatusMessage("Summary copied.");
    return true;
  } catch (_) {
    setSummaryStatusMessage(`Copy unavailable. Summary: ${text}`);
    return false;
  }
}

async function downloadShareCard() {
  const blob = await canvasToBlob(elements.shareCanvas);
  if (!blob) {
    setSummaryStatusMessage("Card image could not be generated. Try Copy Summary instead.");
    return;
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "tofu-driver-result.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setSummaryStatusMessage("Card downloaded.");
}

async function exportProgress() {
  const text = exportGameProgress(loadGameState());
  try {
    if (
      typeof navigator === "undefined"
      || !navigator.clipboard
      || !navigator.clipboard.writeText
    ) {
      throw new Error("clipboard unavailable");
    }
    await navigator.clipboard.writeText(text);
    setSummaryStatusMessage("Progress backup copied.");
  } catch (_) {
    setSummaryStatusMessage(`Copy unavailable. Progress backup: ${text}`);
  }
}

function importProgress() {
  if (appState.running || appState.calibrating) {
    setSummaryStatusMessage("Progress cannot be imported during an active drive.");
    return;
  }
  if (typeof window === "undefined" || typeof window.prompt !== "function") {
    setSummaryStatusMessage("Import is unavailable in this browser.");
    return;
  }
  const text = window.prompt("Paste Tofu Driver progress backup JSON:");
  if (!text) return;
  const result = importGameProgress(text);
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    return;
  }
  renderGamePanels(result.gameState);
  setSummaryStatusMessage("Progress restored on this device.");
}

function resetProgress() {
  if (appState.running || appState.calibrating) {
    setSummaryStatusMessage("Progress cannot be reset during an active drive.");
    return;
  }
  if (
    typeof window !== "undefined"
    && typeof window.confirm === "function"
    && !window.confirm("Reset Tofu Driver progress on this device?")
  ) {
    return;
  }
  if (!resetGameState()) {
    setSummaryStatusMessage("Progress could not be reset.");
    return;
  }
  const gameState = loadGameState();
  renderGamePanels(gameState);
  setSummaryStatusMessage("Tofu Driver progress reset on this device.");
}

function handlePackTofu() {
  const result = packTofu(loadGameState(), {
    activeDrive: appState.running || appState.calibrating,
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(`Packed tofu: +${result.tofuStockGained} tofu stock.`);
  playCosmeticSound("shop_pack_tofu", result.gameState, {
    activeDrive: false,
  });
}

function handleShopUpgradeClick(event) {
  const button = event.target && event.target.closest
    ? event.target.closest("[data-shop-upgrade]")
    : null;
  if (!button) return;
  if (appState.running || appState.calibrating) {
    setSummaryStatusMessage("Shop actions unlock after you finish and park.");
    return;
  }
  const result = buyShopUpgrade(button.dataset.shopUpgrade, loadGameState());
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(`${result.upgrade.name} upgraded.`);
  playCosmeticSound("upgrade_purchased", result.gameState, {
    activeDrive: false,
  });
}

function handleCharacterSelect(event) {
  const button = event.target && event.target.closest
    ? event.target.closest("[data-character-id]")
    : null;
  if (!button) return;
  const result = selectCharacter(button.dataset.characterId, loadGameState(), {
    activeDrive: appState.running || appState.calibrating,
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderCollectionPanel(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(`${collectionUnlockLabel("character", button.dataset.characterId)} selected.`);
}

function handleSoundPackSelect(event) {
  const button = event.target && event.target.closest
    ? event.target.closest("[data-sound-pack-id]")
    : null;
  if (!button) return;
  const result = selectSoundPack(button.dataset.soundPackId, loadGameState(), {
    activeDrive: appState.running || appState.calibrating,
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderCollectionPanel(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(`${collectionUnlockLabel("sound", button.dataset.soundPackId)} selected.`);
}

function handlePreviewSound() {
  const result = previewSoundPack(loadGameState(), {
    activeDrive: appState.running || appState.calibrating,
    userGesture: true,
  });
  setSummaryStatusMessage(
    result.played
      ? "Sound preview played."
      : result.reason === "muted"
        ? "Sound effects are muted."
        : "Sound preview is unavailable here.",
  );
}

function selectedSafetyChecksComplete() {
  return [...document.querySelectorAll("[data-safety-check]")].every(
    (input) => input.checked,
  );
}

function updateStartReadiness() {
  const ready = selectedSafetyChecksComplete();
  elements.startButton.disabled = !ready;
  setLandingStatus(
    ready
      ? "Ready. Start while parked and keep the phone mounted."
      : "Complete the safety checklist to begin.",
  );
}

function updateModeCopy() {
  if (appState.mode === "qualified") {
    elements.modeCopy.textContent =
      "Qualified Run is opt-in. It requests location only to verify distance, movement, and route complexity. Higher speed does not improve your score.";
    return;
  }
  elements.modeCopy.textContent =
    "Basic Mode does not use location. Sensor data remains local and can unlock only basic local milestones.";
}

function setMode(mode) {
  appState.mode = mode === "qualified" ? "qualified" : "basic";
  document.querySelectorAll("[data-mode]").forEach((button) => {
    const active = button.dataset.mode === appState.mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-checked", String(active));
  });
  updateModeCopy();
}

function setDifficulty(difficulty) {
  appState.difficulty = DIFFICULTIES[difficulty] ? difficulty : "standard";
  document.querySelectorAll("[data-difficulty]").forEach((button) => {
    const active = button.dataset.difficulty === appState.difficulty;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-checked", String(active));
  });
  drawCupCanvas(elements.cupCanvas, appState.currentG, appState.waterLeft);
}

async function startRun() {
  if (!selectedSafetyChecksComplete()) {
    updateStartReadiness();
    return;
  }
  stopAxisPreview();
  if (!hasDeviceMotionSupport()) {
    showUnsupported("DeviceMotion is not available in this browser.");
    return;
  }
  appState.audioEnabled = elements.audioToggle.checked;
  elements.audioToggleRunning.checked = appState.audioEnabled;
  if (appState.audioEnabled) await ensureAudioCoach();

  const permission = await requestMotionPermission();
  if (!permission.ok) {
    stopAudioCoach();
    showUnsupported(permission.reason);
    return;
  }

  resetSessionState();
  appState.audioEnabled = elements.audioToggle.checked;
  appState.calibrating = true;
  appState.running = false;
  appState.calibrationStartedMs = performance.now();
  elements.runModeLabel.textContent =
    appState.mode === "qualified" ? "Qualified Run" : "Basic Mode";
  showView("run");
  setRunStatus("Calibrating neutral phone position. Keep the phone mounted and still.");
  window.addEventListener("devicemotion", handleMotionEvent, { passive: true });
  window.setTimeout(handleCalibrationTimeout, CALIBRATION_TIMEOUT_MS);
  if (appState.mode === "qualified") startLocationWatch();
  scheduleRender();
}

function stopRunSensors() {
  window.removeEventListener("devicemotion", handleMotionEvent);
  clearLocationWatch();
  appState.calibrating = false;
  appState.running = false;
  stopAudioCoach();
}

function endRun() {
  if (!appState.running && !appState.calibrating) return;
  if (appState.calibrating) {
    stopRunSensors();
    showView("landing");
    setLandingStatus("Calibration stopped. Start again while parked.");
    return;
  }
  const summary = buildSummary();
  stopRunSensors();
  appState.routeSamples = [];
  const gameState = loadGameState();
  const rewards = calculateDeliveryRewards(summary, gameState);
  summary.cargoCondition = rewards.cargoCondition;
  summary.routeType = rewards.routeType;
  summary.dailyDeliveryComplete = rewards.dailyComplete;
  summary.deliveryStamps = rewards.stamps;
  summary.deliveryRewards = rewards;
  saveGameState(rewards.gameState);
  const milestoneResult = unlockMilestones(summary);
  summary.unlockedBadges = milestoneResult.unlockedThisRun;
  renderSummary(summary);
  const collectionUnlockCount =
    rewards.collectionUnlocks.newCharacterUnlocks.length
    + rewards.collectionUnlocks.newSoundUnlocks.length;
  playCosmeticSound(
    collectionUnlockCount > 0
      ? "unlock"
      : summary.rank === TOP_BADGE
        ? "perfect_pour"
        : "delivery_complete",
    rewards.gameState,
    { activeDrive: appState.running || appState.calibrating },
  );
}

function syncAudioToggles(source) {
  appState.audioEnabled = source.checked;
  elements.audioToggle.checked = appState.audioEnabled;
  elements.audioToggleRunning.checked = appState.audioEnabled;
  if (appState.audioEnabled && appState.running) {
    ensureAudioCoach().then(updateAudioCoach);
    renderCollectionPanel(loadGameState());
    return;
  }
  updateAudioCoach();
  renderCollectionPanel(loadGameState());
}

function saveCurrentSummary() {
  if (!appState.lastSummary) return;
  saveSummaryLocally(appState.lastSummary);
  if (elements.summaryStatus) {
    elements.summaryStatus.textContent = "Summary saved locally. No raw route or sensor stream was saved.";
  }
}

function newRun() {
  appState.lastSummary = null;
  resetSessionState();
  renderMountControls();
  renderAudioLevelControls();
  renderMerchPanel(loadClubState());
  renderGamePanels(loadGameStateWithOfflineShopEarnings());
  drawCupCanvas(elements.cupCanvas, appState.currentG, appState.waterLeft);
  showView("landing");
}

function revealSetupFlow() {
  if (!elements.setupFlow) return;
  elements.setupFlow.classList.remove("is-hidden");
  elements.setupFlow.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindEvents() {
  if (elements.introCtaButton) {
    elements.introCtaButton.addEventListener("click", revealSetupFlow);
  }
  elements.gameCtaButton.addEventListener("click", revealSetupFlow);
  document.querySelectorAll("[data-safety-check]").forEach((input) => {
    input.addEventListener("change", updateStartReadiness);
  });
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });
  document.querySelectorAll("[data-difficulty]").forEach((button) => {
    button.addEventListener("click", () => setDifficulty(button.dataset.difficulty));
  });
  document.querySelectorAll("[data-mount-mode]").forEach((button) => {
    button.addEventListener("click", () => setMountMode(button.dataset.mountMode));
  });
  document.querySelectorAll("[data-audio-level]").forEach((button) => {
    button.addEventListener("click", () => setAudioLevel(button.dataset.audioLevel));
  });
  document.querySelectorAll("[data-audio-level-running]").forEach((button) => {
    button.addEventListener(
      "click",
      () => setAudioLevel(button.dataset.audioLevelRunning),
    );
  });
  elements.uprightLongitudinalInvert.addEventListener(
    "change",
    updateUprightMountConfig,
  );
  [
    elements.customLateralAxis,
    elements.customLongitudinalAxis,
    elements.customLateralInvert,
    elements.customLongitudinalInvert,
  ].forEach((control) => {
    control.addEventListener("change", updateCustomMountConfig);
  });
  elements.axisPreviewButton.addEventListener("click", startAxisPreview);
  elements.startButton.addEventListener("click", startRun);
  elements.endButton.addEventListener("click", endRun);
  elements.unsupportedBackButton.addEventListener("click", () => showView("landing"));
  elements.audioToggle.addEventListener("change", () => syncAudioToggles(elements.audioToggle));
  elements.audioToggleRunning.addEventListener(
    "change",
    () => syncAudioToggles(elements.audioToggleRunning),
  );
  elements.shareButton.addEventListener("click", shareResult);
  elements.downloadButton.addEventListener("click", downloadShareCard);
  elements.copyButton.addEventListener("click", copyShareText);
  elements.saveButton.addEventListener("click", saveCurrentSummary);
  elements.exportProgressButton.addEventListener("click", exportProgress);
  elements.importProgressButton.addEventListener("click", importProgress);
  elements.resetProgressButton.addEventListener("click", resetProgress);
  elements.gamePackTofuButton.addEventListener("click", handlePackTofu);
  elements.packTofuButton.addEventListener("click", handlePackTofu);
  elements.shopUpgradeList.addEventListener("click", handleShopUpgradeClick);
  elements.characterList.addEventListener("click", handleCharacterSelect);
  elements.soundPackList.addEventListener("click", handleSoundPackSelect);
  elements.previewSoundButton.addEventListener("click", handlePreviewSound);
  elements.newRunButton.addEventListener("click", newRun);
}

function cacheElements() {
  elements = {
    landingView: document.getElementById("landing-view"),
    runView: document.getElementById("run-view"),
    unsupportedView: document.getElementById("unsupported-view"),
    summaryView: document.getElementById("summary-view"),
    setupFlow: document.getElementById("setup-flow"),
    introCtaButton: document.getElementById("intro-cta-button"),
    gameCtaButton: document.getElementById("game-cta-button"),
    gameDailyTitle: document.getElementById("today-delivery-title"),
    gameDailyFlavor: document.getElementById("game-daily-flavor"),
    gameDailyCargo: document.getElementById("game-daily-cargo"),
    gameDailyGoal: document.getElementById("game-daily-goal"),
    gameDailyReward: document.getElementById("game-daily-reward"),
    gameDailyProgress: document.getElementById("game-daily-progress"),
    gameDriverLicense: document.getElementById("game-driver-license"),
    gameTotalXP: document.getElementById("game-total-xp"),
    gameStreak: document.getElementById("game-streak"),
    gameGearProgress: document.getElementById("game-gear-progress"),
    gameShopStock: document.getElementById("game-shop-stock"),
    gameShopReputation: document.getElementById("game-shop-reputation"),
    gameShopLevel: document.getElementById("game-shop-level"),
    gameShopTeaser: document.getElementById("game-shop-teaser"),
    gamePassportEmpty: document.getElementById("game-passport-empty"),
    gamePassportPreview: document.getElementById("game-passport-preview"),
    gamePackTofuButton: document.getElementById("game-pack-tofu-button"),
    modeCopy: document.getElementById("mode-copy"),
    mountStatus: document.getElementById("mount-status"),
    uprightAxisPanel: document.getElementById("upright-axis-panel"),
    uprightLongitudinalInvert: document.getElementById(
      "upright-longitudinal-invert",
    ),
    customAxisPanel: document.getElementById("custom-axis-panel"),
    customLateralAxis: document.getElementById("custom-lateral-axis"),
    customLateralInvert: document.getElementById("custom-lateral-invert"),
    customLongitudinalAxis: document.getElementById("custom-longitudinal-axis"),
    customLongitudinalInvert: document.getElementById(
      "custom-longitudinal-invert",
    ),
    axisPreviewButton: document.getElementById("axis-preview-button"),
    axisBars: {
      x: document.getElementById("axis-bar-x"),
      y: document.getElementById("axis-bar-y"),
      z: document.getElementById("axis-bar-z"),
    },
    axisValues: {
      x: document.getElementById("axis-value-x"),
      y: document.getElementById("axis-value-y"),
      z: document.getElementById("axis-value-z"),
    },
    startButton: document.getElementById("start-button"),
    endButton: document.getElementById("end-button"),
    unsupportedBackButton: document.getElementById("unsupported-back-button"),
    unsupportedCopy: document.getElementById("unsupported-copy"),
    audioToggle: document.getElementById("audio-toggle"),
    audioToggleRunning: document.getElementById("audio-toggle-running"),
    runModeLabel: document.getElementById("run-mode-label"),
    waterPercent: document.getElementById("water-percent"),
    durationValue: document.getElementById("duration-value"),
    harshValue: document.getElementById("harsh-value"),
    gValue: document.getElementById("g-value"),
    runStatus: document.getElementById("run-status"),
    landingStatus: document.getElementById("landing-status"),
    driverLevel: document.getElementById("driver-level"),
    driverLicense: document.getElementById("driver-license"),
    dailyCargo: document.getElementById("daily-cargo"),
    dailyGoal: document.getElementById("daily-goal"),
    dailyReward: document.getElementById("daily-reward"),
    driverTotalXP: document.getElementById("driver-total-xp"),
    driverNextXP: document.getElementById("driver-next-xp"),
    driverStreak: document.getElementById("driver-streak"),
    nospillGearProgress: document.getElementById("nospill-gear-progress"),
    passportProgress: document.getElementById("passport-progress"),
    recentReward: document.getElementById("recent-reward"),
    recentStamps: document.getElementById("recent-stamps"),
    exportProgressButton: document.getElementById("export-progress-button"),
    importProgressButton: document.getElementById("import-progress-button"),
    resetProgressButton: document.getElementById("reset-progress-button"),
    landingDiscordCta: document.getElementById("landing-discord-cta"),
    summaryDiscordCta: document.getElementById("summary-discord-cta"),
    shopLevelBadge: document.getElementById("shop-level-badge"),
    shopTofuStock: document.getElementById("shop-tofu-stock"),
    shopReputation: document.getElementById("shop-reputation"),
    shopLevelProgress: document.getElementById("shop-level-progress"),
    shopIdleRate: document.getElementById("shop-idle-rate"),
    packTofuButton: document.getElementById("pack-tofu-button"),
    packTofuHelper: document.getElementById("pack-tofu-helper"),
    shopUpgradeList: document.getElementById("shop-upgrade-list"),
    deliveryWallGrid: document.getElementById("delivery-wall-grid"),
    shopOfflineEarnings: document.getElementById("shop-offline-earnings"),
    selectedCharacterBadge: document.getElementById("selected-character-badge"),
    selectedCharacterName: document.getElementById("selected-character-name"),
    selectedCharacterFlavor: document.getElementById("selected-character-flavor"),
    selectedSoundPackName: document.getElementById("selected-sound-pack-name"),
    selectedSoundPackFlavor: document.getElementById("selected-sound-pack-flavor"),
    characterList: document.getElementById("character-list"),
    soundPackList: document.getElementById("sound-pack-list"),
    previewSoundButton: document.getElementById("preview-sound-button"),
    cupCanvas: document.getElementById("cup-canvas"),
    summaryStatusLabel: document.getElementById("summary-status-label"),
    summaryTitle: document.getElementById("summary-title"),
    summaryWater: document.getElementById("summary-water"),
    summaryGrid: document.getElementById("summary-grid"),
    routeContext: document.getElementById("route-context"),
    routeGrid: document.getElementById("route-grid"),
    milestoneOutput: document.getElementById("milestone-output"),
    merchProgressGrid: document.getElementById("merch-progress-grid"),
    merchGrid: document.getElementById("merch-grid"),
    deliverySummaryGrid: document.getElementById("delivery-summary-grid"),
    commuteMasteryCopy: document.getElementById("commute-mastery-copy"),
    shareCanvas: document.getElementById("share-canvas"),
    shareButton: document.getElementById("share-button"),
    downloadButton: document.getElementById("download-button"),
    copyButton: document.getElementById("copy-button"),
    saveButton: document.getElementById("save-button"),
    newRunButton: document.getElementById("new-run-button"),
    summaryStatus: document.getElementById("summary-status"),
  };
}

function initNoSpillApp() {
  cacheElements();
  const clubState = loadClubState();
  appState.mountConfig = normalizeMountConfig(clubState.mountConfig);
  appState.audioLevel = normalizeAudioLevel(clubState.audioLevel);
  bindEvents();
  renderMountControls();
  renderAudioLevelControls();
  updateStartReadiness();
  updateModeCopy();
  renderMerchPanel(clubState);
  renderGamePanels(loadGameStateWithOfflineShopEarnings());
  renderDiscordCtas("landing");
  drawCupCanvas(elements.cupCanvas, appState.currentG, appState.waterLeft);
  if (!hasDeviceMotionSupport()) {
    setLandingStatus(
      "This browser has not exposed motion sensors yet. Start will check again on a phone.",
    );
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initNoSpillApp);
}
