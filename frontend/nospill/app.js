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
const PRACTICE_VALID_MIN_SECONDS = 60;
const PRACTICE_DAILY_MIN_SECONDS = 300;

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
const SHOP_GENERATOR_TICK_MS = 1000;
const SHOP_GENERATOR_SAVE_MS = 5000;
const SHOP_OPEN_TICK_MAX_SECONDS = 300;
const TOFU_PRESS_BASE_PER_SECOND = 3 / 60;
const PREP_COUNTER_CONSUME_PER_ORDER = 2;
const PREP_COUNTER_BASE_ORDERS_PER_SECOND = 1 / 60;
const SHOP_ORDER_TIPS_REWARD = 10;
const SHOP_ORDER_REPUTATION_REWARD = 1;
const SHOP_ORDER_XP_REWARD = 4;
const CERTIFIED_BOOST_HOURS = 2;
const CERTIFIED_BOOST_PRESS_MULTIPLIER = 1.2;
const PREP_SLOT_BASE_MAX = 10;
const PREP_SLOT_REGEN_PER_SECOND = 1 / 120;
const SHOP_SPIRIT_BASE_MAX = 50;
const LEDGER_MAX_ENTRIES = 80;
const SHOP_MULTIPLIERS = [1, 10, 100, "max"];
const DEV_TOOLS_LOCAL_STORAGE_KEY = "tofuDriverDevToolsEnabled";

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
    id: "prep_counter",
    name: "Prep Counter",
    description: "A tidy counter that turns tofu stock into prepared delivery orders.",
    costTofuStock: 90,
    costReputation: 0,
    requiredShopLevel: 2,
    effect: "Converts tofu stock into delivery orders while the shop is open or offline.",
    maxLevel: 4,
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

const SHOP_STATIONS = [
  {
    id: "tofu_press",
    name: "Tofu Press",
    description: "Presses tofu stock for the shop.",
    baseCostTips: 15,
    growthRate: 1.15,
    prepSlotCost: 0,
    unlock: "Available at start",
    production: "Tofu Stock",
  },
  {
    id: "prep_counter",
    name: "Prep Counter",
    description: "Turns tofu stock into prepared delivery orders.",
    baseCostTips: 25,
    growthRate: 1.16,
    prepSlotCost: 1,
    unlock: "Tofu Stock 10 or Shop Level 2",
    production: "Delivery Orders",
  },
  {
    id: "delivery_shelf",
    name: "Delivery Shelf",
    description: "Keeps order handoffs tidy and boosts the Prep Counter.",
    baseCostTips: 90,
    growthRate: 1.17,
    prepSlotCost: 1,
    unlock: "Shop Level 2",
    production: "Prep Counter boost",
  },
  {
    id: "shop_sign",
    name: "Shop Sign",
    description: "Makes the counter more welcoming and improves reputation.",
    baseCostTips: 140,
    growthRate: 1.18,
    prepSlotCost: 1,
    unlock: "Reputation 10",
    production: "Reputation and customers",
  },
  {
    id: "regular_customer",
    name: "Regular Customer",
    description: "Steady counter friends who bring tips when orders are ready.",
    baseCostTips: 240,
    growthRate: 1.2,
    prepSlotCost: 1,
    unlock: "Shop Sign 1",
    production: "Tips over time",
  },
  {
    id: "delivery_route",
    name: "Delivery Route",
    description: "Fictional route cards that grow shop reach and route knowledge.",
    baseCostTips: 420,
    growthRate: 1.22,
    prepSlotCost: 2,
    unlock: "Shop Reach 2",
    production: "Route rewards",
  },
  {
    id: "dispatcher_desk",
    name: "Dispatcher Desk",
    description: "Organizes fictional safe route repeats for the crew.",
    baseCostTips: 900,
    growthRate: 1.26,
    prepSlotCost: 2,
    unlock: "Reputation 40",
    production: "Automation",
  },
  {
    id: "regional_network",
    name: "Regional Tofu Network",
    description: "A late shop coordination board that boosts lower stations.",
    baseCostTips: 2400,
    growthRate: 1.32,
    prepSlotCost: 3,
    unlock: "Shop Level 5",
    production: "Global shop boost",
  },
];

const STATION_UPGRADES = [
  { id: "tofu_press_faster", stationId: "tofu_press", name: "Steady Pressing", costTips: 60, effect: "Tofu Press rate +25%", maxLevel: 10 },
  { id: "tofu_press_double", stationId: "tofu_press", name: "Double Mold", costTips: 100, effect: "Tofu Press output +50%", maxLevel: 8 },
  { id: "prep_counter_faster", stationId: "prep_counter", name: "Tidy Packaging", costTips: 120, effect: "Prep Counter rate +25%", maxLevel: 10 },
  { id: "prep_counter_double", stationId: "prep_counter", name: "Double Labels", costTips: 180, effect: "Prep Counter output +50%", maxLevel: 8 },
  { id: "delivery_shelf_faster", stationId: "delivery_shelf", name: "Neat Handoff", costTips: 220, effect: "Delivery Shelf boost +20%", maxLevel: 8 },
  { id: "delivery_shelf_double", stationId: "delivery_shelf", name: "Double Stack", costTips: 320, effect: "Delivery Shelf capacity +30%", maxLevel: 8 },
  { id: "shop_sign_faster", stationId: "shop_sign", name: "Brighter Sign", costTips: 360, effect: "Reputation from orders +20%", maxLevel: 8 },
  { id: "shop_sign_double", stationId: "shop_sign", name: "Word of Mouth", costTips: 520, effect: "Customer tip gain +20%", maxLevel: 8 },
  { id: "regular_customer_faster", stationId: "regular_customer", name: "Loyalty Card", costTips: 650, effect: "Regular Customer tips +25%", maxLevel: 8 },
  { id: "regular_customer_double", stationId: "regular_customer", name: "Bring a Friend", costTips: 880, effect: "Regular Customer output +50%", maxLevel: 8 },
  { id: "route_familiarity", stationId: "delivery_route", name: "Route Familiarity", costTips: 1000, effect: "Fictional route rewards +20%", maxLevel: 8 },
  { id: "careful_notes", stationId: "delivery_route", name: "Careful Notes", costTips: 1300, effect: "Route knowledge +25%", maxLevel: 8 },
  { id: "better_clipboard", stationId: "dispatcher_desk", name: "Better Clipboard", costTips: 1600, effect: "Crew automation +20%", maxLevel: 6 },
  { id: "team_routine", stationId: "dispatcher_desk", name: "Team Routine", costTips: 2200, effect: "Automated route tips +20%", maxLevel: 6 },
  { id: "network_calendar", stationId: "regional_network", name: "Network Calendar", costTips: 3200, effect: "All shop production +10%", maxLevel: 5 },
];

const SHOP_ROUTE_CATALOG = [
  { id: "shop_street", name: "Shop Street", unlock: "Available at start", tofuCost: 4, orderCost: 1, tipReward: 24, reputationReward: 2, routeKnowledgeReward: 2, shopReachReward: 1, difficulty: "Beginner fictional route", stampId: "shop_street_complete" },
  { id: "old_hill_road", name: "Old Hill Road", unlock: "Shop Reach 2", tofuCost: 8, orderCost: 2, tipReward: 54, reputationReward: 4, routeKnowledgeReward: 5, shopReachReward: 2, difficulty: "Story route card", stampId: "old_hill_story" },
  { id: "lantern_bridge", name: "Lantern Bridge", unlock: "Reputation 25", tofuCost: 12, orderCost: 3, tipReward: 84, reputationReward: 6, routeKnowledgeReward: 8, shopReachReward: 2, difficulty: "Night-themed fictional route", stampId: "lantern_bridge_delivery" },
  { id: "rainy_switchback", name: "Rainy Switchback", unlock: "Route Knowledge 25", tofuCost: 18, orderCost: 4, tipReward: 130, reputationReward: 8, routeKnowledgeReward: 12, shopReachReward: 3, difficulty: "Weather story route", stampId: "rainy_switchback_notes" },
  { id: "fox_shrine_road", name: "Fox Shrine Road", unlock: "Shop Reach 10", tofuCost: 10, orderCost: 3, tipReward: 70, reputationReward: 7, routeKnowledgeReward: 15, shopReachReward: 4, difficulty: "Mystery route card", stampId: "fox_shrine_visitor" },
];

const TRAINING_DRILLS = [
  { id: "cone_drill", name: "Run Cone Drill", skill: "smoothHands", costTips: 12, cupStabilityXP: 3, report: "The cones stayed exactly where they belonged." },
  { id: "brake_timing", name: "Run Brake Timing Drill", skill: "brakeFeather", costTips: 18, cupStabilityXP: 4, report: "Brake timing notes added to the counter ledger." },
  { id: "smooth_hands", name: "Run Smooth Hands Drill", skill: "cornerCalm", costTips: 22, cupStabilityXP: 5, report: "Smooth hands practice made the fictional route cards calmer." },
];

const GARAGE_UPGRADES = [
  { id: "cup_holder_charm", name: "Cup Holder Charm", costTips: 80, effect: "Fictional route stability +5%", maxLevel: 5 },
  { id: "cargo_straps", name: "Gentle Cargo Straps", costTips: 120, effect: "Route reports gain +5% tips", maxLevel: 5 },
  { id: "route_notebook", name: "Route Notebook", costTips: 160, effect: "Route Knowledge rewards +10%", maxLevel: 5 },
  { id: "delivery_mat", name: "Careful Delivery Mat", costTips: 220, effect: "Shop order reputation +1 at higher levels", maxLevel: 5 },
];

const CREW_ROLES = [
  { id: "apprentice_driver", name: "Apprentice Driver", costTips: 300, unlock: "Shop Reach 3", effect: "Repeats safe fictional routes slowly." },
  { id: "prep_cook", name: "Prep Cook", costTips: 360, unlock: "Prep Counter 2", effect: "Boosts Prep Counter output." },
  { id: "dispatcher", name: "Dispatcher", costTips: 520, unlock: "Dispatcher Desk 1", effect: "Improves crew route assignment." },
  { id: "mechanic", name: "Mechanic", costTips: 700, unlock: "Garage upgrade owned", effect: "Boosts fictional garage effects." },
  { id: "route_scout", name: "Route Scout", costTips: 850, unlock: "Shop Reach 8", effect: "Improves Shop Reach from route cards." },
  { id: "stamp_guide", name: "Stamp Guide", costTips: 1000, unlock: "Passport 5 stamps", effect: "Improves fictional stamp discovery." },
  { id: "night_driver", name: "Night Driver", costTips: 1300, unlock: "Lantern Bridge complete", effect: "Supports night and festival route cards." },
];

const SPIRIT_GENERATORS = [
  { id: "tea_kettle", name: "Tea Kettle", costTips: 75, spiritPerSecond: 0.03, unlock: "Available at start" },
  { id: "shrine_corner", name: "Shrine Corner", costTips: 220, spiritPerSecond: 0.07, unlock: "Reputation 15" },
  { id: "festival_lantern", name: "Festival Lantern", costTips: 520, spiritPerSecond: 0.12, unlock: "Shop Reach 6" },
  { id: "night_shift_kettle", name: "Night Shift Kettle", costTips: 900, spiritPerSecond: 0.18, unlock: "Shop Level 4" },
  { id: "lucky_cat", name: "Lucky Cat", costTips: 1400, spiritPerSecond: 0.25, unlock: "Shop Level 5" },
];

const SHOP_SPIRIT_BOOSTS = [
  { id: "rush_prep", name: "Rush Prep", costSpirit: 10, type: "instant_tofu", amount: 20, description: "Instant tofu stock for parked shop play." },
  { id: "warm_counter", name: "Warm Counter", costSpirit: 15, type: "instant_orders", amount: 4, description: "Instant Delivery Orders if tofu stock is ready." },
  { id: "busy_lunch", name: "Busy Lunch Hour", costSpirit: 20, type: "tips_multiplier", multiplier: 1.5, durationSeconds: 900, description: "Temporary shop tips boost." },
  { id: "double_batch", name: "Double Batch", costSpirit: 24, type: "press_multiplier", multiplier: 1.6, durationSeconds: 900, description: "Temporary Tofu Press boost." },
  { id: "calm_focus", name: "Calm Shop Focus", costSpirit: 18, type: "route_multiplier", multiplier: 1.4, durationSeconds: 900, description: "Temporary fictional route reward boost." },
];

const FESTIVAL_BOOSTS = [
  { id: "lunch_rush", name: "Lunch Rush Token", type: "tips_multiplier" },
  { id: "steam_hour", name: "Steam Hour Token", type: "press_multiplier" },
  { id: "packing_party", name: "Packing Party Token", type: "prep_multiplier" },
  { id: "story_lantern", name: "Story Lantern Token", type: "reputation_multiplier" },
  { id: "calm_focus_token", name: "Calm Focus Token", type: "route_multiplier" },
];

const LICENSE_PERKS = [
  { id: "starter_press", name: "Start with extra Tofu Press level", costStars: 1, effect: "Future exams restart with +1 Tofu Press." },
  { id: "starter_counter", name: "Start with one Prep Counter", costStars: 1, effect: "Future exams keep Prep Counter unlocked." },
  { id: "offline_cap", name: "Higher offline cap", costStars: 1, effect: "Offline cap +1 hour." },
  { id: "prep_slot_regen", name: "Extra Prep Slot recovery", costStars: 2, effect: "Prep Slots recover more often." },
  { id: "shop_multiplier", name: "Small shop production multiplier", costStars: 2, effect: "All shop production +10%." },
];

const RIVAL_CHALLENGES = [
  { id: "quiet_counter", name: "The Quiet Counter", unlock: "Reputation 10", orderCost: 2, spiritCost: 5, tipsReward: 80, reputationReward: 5, stampId: "quiet_counter_showcase" },
  { id: "lantern_bento", name: "Lantern Bridge Bento", unlock: "Lantern Bridge complete", orderCost: 3, spiritCost: 8, tipsReward: 130, reputationReward: 8, stampId: "lantern_bento_showcase" },
  { id: "fox_shrine_snacks", name: "Fox Shrine Snacks", unlock: "Fox Shrine Road complete", orderCost: 4, spiritCost: 10, tipsReward: 180, reputationReward: 12, stampId: "fox_paid_leaves" },
  { id: "midnight_noodle", name: "Midnight Noodle Stand", unlock: "Shop Level 5", orderCost: 5, spiritCost: 14, tipsReward: 240, reputationReward: 16, stampId: "midnight_showcase" },
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

const SIMULATOR_LOCAL_STORAGE_KEY = "tofuDriverSimulatorEnabled";

const SIMULATOR_SCENARIOS = [
  {
    id: "smooth_commute",
    name: "Smooth Commute",
    cargoProfileId: "silken_tofu",
    cargoCondition: 92,
    qualificationStatus: "qualified",
    routeType: "Calm Cruise",
    durationSeconds: 900,
    distanceMiles: 5.2,
    harshBraking: 0,
    harshAcceleration: 0,
    harshLateral: 0,
    lateralJerk: 0.4,
    abruptTransitions: 0,
    turnDensityScore: 0.16,
    curvatureScore: 0.12,
    routeDifficultyScore: 0.16,
  },
  {
    id: "city_delivery",
    name: "City Delivery",
    cargoProfileId: "soup_bowl",
    cargoCondition: 88,
    qualificationStatus: "qualified",
    routeType: "City Delivery",
    durationSeconds: 720,
    distanceMiles: 3.4,
    harshBraking: 2,
    harshAcceleration: 1,
    harshLateral: 0,
    lateralJerk: 1.4,
    abruptTransitions: 3,
    turnDensityScore: 0.22,
    curvatureScore: 0.2,
    routeDifficultyScore: 0.3,
  },
  {
    id: "technical_pour",
    name: "Technical Pour",
    cargoProfileId: "hot_tea",
    cargoCondition: 93,
    qualificationStatus: "qualified",
    routeType: "Technical Route",
    durationSeconds: 780,
    distanceMiles: 4.1,
    harshBraking: 0,
    harshAcceleration: 0,
    harshLateral: 1,
    lateralJerk: 1,
    abruptTransitions: 1,
    turnDensityScore: 0.72,
    curvatureScore: 0.7,
    routeDifficultyScore: 0.74,
  },
  {
    id: "perfect_pour",
    name: "Perfect Pour",
    cargoProfileId: "silken_tofu",
    cargoCondition: 100,
    qualificationStatus: "qualified",
    routeType: "Mixed Route",
    durationSeconds: 840,
    distanceMiles: 4.8,
    harshBraking: 0,
    harshAcceleration: 0,
    harshLateral: 0,
    lateralJerk: 0,
    abruptTransitions: 0,
    turnDensityScore: 0.42,
    curvatureScore: 0.38,
    routeDifficultyScore: 0.46,
  },
  {
    id: "hot_tea_90",
    name: "Hot Tea 90",
    cargoProfileId: "hot_tea",
    cargoCondition: 91,
    qualificationStatus: "qualified",
    routeType: "Calm Cruise",
    durationSeconds: 720,
    distanceMiles: 3.8,
    harshBraking: 0,
    harshAcceleration: 0,
    harshLateral: 0,
    lateralJerk: 0.4,
    abruptTransitions: 0,
    turnDensityScore: 0.18,
    curvatureScore: 0.18,
    routeDifficultyScore: 0.2,
  },
  {
    id: "shaky_practice",
    name: "Shaky Practice",
    cargoProfileId: "egg_carton",
    cargoCondition: 62,
    qualificationStatus: "practice",
    routeType: "Practice Route",
    durationSeconds: 120,
    distanceMiles: 0,
    harshBraking: 2,
    harshAcceleration: 2,
    harshLateral: 1,
    lateralJerk: 3,
    abruptTransitions: 3,
    turnDensityScore: 0,
    curvatureScore: 0,
    routeDifficultyScore: 0,
  },
  {
    id: "spilled_soup",
    name: "Spilled Soup",
    cargoProfileId: "soup_bowl",
    cargoCondition: 28,
    qualificationStatus: "practice",
    routeType: "Practice Route",
    durationSeconds: 90,
    distanceMiles: 0,
    harshBraking: 5,
    harshAcceleration: 4,
    harshLateral: 3,
    lateralJerk: 5,
    abruptTransitions: 5,
    turnDensityScore: 0,
    curvatureScore: 0,
    routeDifficultyScore: 0,
  },
  {
    id: "long_haul_smooth",
    name: "Long Haul Smooth",
    cargoProfileId: "glass_bottle",
    cargoCondition: 89,
    qualificationStatus: "qualified",
    routeType: "Long Haul",
    durationSeconds: 1800,
    distanceMiles: 12.5,
    harshBraking: 0,
    harshAcceleration: 0,
    harshLateral: 0,
    lateralJerk: 0.8,
    abruptTransitions: 1,
    turnDensityScore: 0.18,
    curvatureScore: 0.2,
    routeDifficultyScore: 0.28,
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
  first_shop_order: "First Shop Order",
  first_tofu_press: "First Tofu Press",
  first_prep_counter: "First Prep Counter",
  first_10_orders: "First 10 Orders",
  first_100_tips: "First 100 Tips",
  shop_street_complete: "Shop Street Complete",
  old_hill_story: "Old Hill Road Story",
  lantern_bridge_delivery: "Lantern Bridge Delivery",
  rainy_switchback_notes: "Rainy Switchback Notes",
  fox_shrine_visitor: "Fox Shrine Visitor",
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
  first_license_exam: "First License Exam",
  first_apprentice: "First Apprentice",
  first_festival_boost: "First Festival Boost",
  full_cup_secret: "Secret: The Cup Was Already Full",
  fox_paid_leaves: "Secret: Fox Paid in Leaves",
  quiet_counter_showcase: "The Quiet Counter Showcase",
  lantern_bento_showcase: "Lantern Bridge Bento",
  midnight_showcase: "Midnight Noodle Stand",
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
  shopGeneratorTimer: null,
  lastShopGeneratorSaveAt: 0,
  liveGameState: null,
  surface: "cup-test",
  shopTab: "overview",
  purchaseMultiplier: 1,
  summaryMode: null,
  shopResultCanFulfillAnother: false,
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

function normalizeCatalogCounts(value, catalog, maxValue = 100000) {
  const source = value && typeof value === "object" ? value : {};
  return Object.fromEntries(
    catalog.map((item) => [
      item.id,
      safeNonNegativeInteger(source[item.id], 0, maxValue),
    ]),
  );
}

function normalizeFestivalBoosts(value) {
  const source = value && typeof value === "object" ? value : {};
  return Object.fromEntries(
    FESTIVAL_BOOSTS.map((boost) => [
      boost.id,
      safeNonNegativeInteger(source[boost.id], 0, 999),
    ]),
  );
}

function normalizeRouteState(value) {
  const source = value && typeof value === "object" ? value : {};
  return Object.fromEntries(
    SHOP_ROUTE_CATALOG.map((route) => {
      const item = source[route.id] && typeof source[route.id] === "object"
        ? source[route.id]
        : {};
      return [
        route.id,
        {
          completions: safeNonNegativeInteger(item.completions, 0, 100000),
          mastery: safeNonNegativeInteger(item.mastery, 0, 100),
          auto: Boolean(item.auto),
          lastCompletedAt: typeof item.lastCompletedAt === "string" ? item.lastCompletedAt : "",
        },
      ];
    }),
  );
}

function normalizeLedger(value) {
  return (Array.isArray(value) ? value : [])
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => ({
      date: typeof entry.date === "string" ? entry.date : new Date().toISOString(),
      type: typeof entry.type === "string" ? entry.type.slice(0, 40) : "shop",
      text: typeof entry.text === "string" ? entry.text.slice(0, 220) : "Shop note.",
    }))
    .slice(0, LEDGER_MAX_ENTRIES);
}

function addLedgerEntry(gameState, type, text, date = new Date()) {
  const next = normalizeGameState(gameState);
  const iso = date instanceof Date ? date.toISOString() : new Date(date).toISOString();
  next.shop.ledger = [
    { date: iso, type: String(type || "shop").slice(0, 40), text: String(text || "Shop note.").slice(0, 220) },
    ...next.shop.ledger,
  ].slice(0, LEDGER_MAX_ENTRIES);
  return next;
}

function defaultShopState() {
  return {
    tofuStock: 0,
    deliveryOrders: 0,
    tips: 0,
    reputation: 0,
    prepSlots: PREP_SLOT_BASE_MAX,
    shopReach: 0,
    shopSpirit: 0,
    licenseStars: 0,
    cupStabilityXP: 0,
    routeKnowledge: 0,
    shopLevel: 1,
    lifetimeDeliveryOrders: 0,
    lifetimeTips: 0,
    lifetimeTofuPacked: 0,
    lifetimeReputation: 0,
    lifetimeRoutesCompleted: 0,
    lifetimeLicenseExams: 0,
    upgrades: {},
    stationUpgrades: normalizeCatalogCounts({}, STATION_UPGRADES, 100),
    stations: normalizeCatalogCounts({ tofu_press: 1 }, SHOP_STATIONS, 100000),
    routes: normalizeRouteState({}),
    garage: normalizeCatalogCounts({}, GARAGE_UPGRADES, 100),
    crew: normalizeCatalogCounts({}, CREW_ROLES, 1000),
    spiritGenerators: normalizeCatalogCounts({}, SPIRIT_GENERATORS, 1000),
    festivalBoosts: normalizeFestivalBoosts({}),
    licensePerks: normalizeCatalogCounts({}, LICENSE_PERKS, 20),
    rivals: normalizeCatalogCounts({}, RIVAL_CHALLENGES, 1000),
    generators: defaultShopGenerators(),
    activeBoosts: [],
    activeFestivalBoosts: [],
    generatorCarry: {
      tofuStock: 0,
      deliveryOrders: 0,
      tips: 0,
      reputation: 0,
    },
    purchaseMultiplier: 1,
    currentShopTab: "overview",
    untrustedLocalQa: false,
    ledger: [],
    lastShopTickAt: "",
    lastGeneratorTickAt: "",
    offlineEarnings: {
      tofuStock: 0,
      deliveryOrders: 0,
      tips: 0,
      shopSpirit: 0,
      cappedHours: 0,
    },
  };
}

function defaultShopGenerators() {
  return {
    tofuPress: { unlocked: true, level: 1 },
    prepCounter: { unlocked: false, level: 0 },
  };
}

function normalizeShopGenerators(generators) {
  const defaults = defaultShopGenerators();
  const source = generators && typeof generators === "object" ? generators : {};
  return Object.fromEntries(
    Object.entries(defaults).map(([id, fallback]) => {
      const item = source[id] && typeof source[id] === "object" ? source[id] : {};
      return [
        id,
        {
          unlocked: Boolean(item.unlocked),
          level: safeNonNegativeInteger(item.level, fallback.level, 100),
        },
      ];
    }),
  );
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

function normalizeShopBoosts(boosts) {
  const source = Array.isArray(boosts) ? boosts : [];
  return source
    .filter((boost) => boost && typeof boost === "object")
    .map((boost) => {
      const id = typeof boost.id === "string" ? boost.id.slice(0, 80) : "shop_boost";
      const label = typeof boost.label === "string" ? boost.label.slice(0, 120) : "Shop Boost";
      const expiresAt = typeof boost.expiresAt === "string" ? boost.expiresAt : "";
      const multiplier = Number(boost.multiplier);
      return {
        id,
        label,
        multiplier: Number.isFinite(multiplier)
          ? clamp(roundTo(multiplier, 2), 1, 5)
          : 1,
        expiresAt,
        source: typeof boost.source === "string" ? boost.source.slice(0, 80) : "",
      };
    })
    .filter((boost) => Number.isFinite(Date.parse(boost.expiresAt)))
    .slice(0, 8);
}

function normalizeShopState(shop) {
  const defaults = defaultShopState();
  const source = shop && typeof shop === "object" ? shop : {};
  const reputation = safeNonNegativeInteger(source.reputation, defaults.reputation);
  const tips = safeNonNegativeInteger(source.tips, defaults.tips);
  const stations = normalizeCatalogCounts(
    source.stations || {
      tofu_press: source.generators && source.generators.tofuPress
        ? source.generators.tofuPress.level
        : 1,
      prep_counter: source.generators && source.generators.prepCounter
        ? source.generators.prepCounter.level
        : 0,
    },
    SHOP_STATIONS,
    100000,
  );
  if (stations.tofu_press < 1) stations.tofu_press = 1;
  return {
    ...defaults,
    tofuStock: safeNonNegativeInteger(source.tofuStock, defaults.tofuStock),
    deliveryOrders: safeNonNegativeInteger(source.deliveryOrders, defaults.deliveryOrders),
    tips,
    reputation,
    prepSlots: safeNonNegativeNumber(source.prepSlots, defaults.prepSlots, getPrepSlotMax({ ...defaults, ...source })),
    shopReach: safeNonNegativeInteger(source.shopReach, defaults.shopReach),
    shopSpirit: safeNonNegativeNumber(source.shopSpirit, defaults.shopSpirit, getShopSpiritMax({ ...defaults, ...source })),
    licenseStars: safeNonNegativeInteger(source.licenseStars, defaults.licenseStars, 100000),
    cupStabilityXP: safeNonNegativeInteger(source.cupStabilityXP, defaults.cupStabilityXP),
    routeKnowledge: safeNonNegativeInteger(source.routeKnowledge, defaults.routeKnowledge),
    shopLevel: getShopLevel(reputation),
    lifetimeDeliveryOrders: safeNonNegativeInteger(
      source.lifetimeDeliveryOrders,
      defaults.lifetimeDeliveryOrders,
    ),
    lifetimeTips: Math.max(
      tips,
      safeNonNegativeInteger(source.lifetimeTips, defaults.lifetimeTips),
    ),
    lifetimeTofuPacked: safeNonNegativeInteger(
      source.lifetimeTofuPacked,
      defaults.lifetimeTofuPacked,
    ),
    lifetimeReputation: Math.max(
      reputation,
      safeNonNegativeInteger(source.lifetimeReputation, defaults.lifetimeReputation),
    ),
    lifetimeRoutesCompleted: safeNonNegativeInteger(source.lifetimeRoutesCompleted, defaults.lifetimeRoutesCompleted),
    lifetimeLicenseExams: safeNonNegativeInteger(source.lifetimeLicenseExams, defaults.lifetimeLicenseExams),
    upgrades: normalizeUpgradeLevels(source.upgrades),
    stationUpgrades: normalizeCatalogCounts(source.stationUpgrades, STATION_UPGRADES, 100),
    stations,
    routes: normalizeRouteState(source.routes),
    garage: normalizeCatalogCounts(source.garage, GARAGE_UPGRADES, 100),
    crew: normalizeCatalogCounts(source.crew, CREW_ROLES, 1000),
    spiritGenerators: normalizeCatalogCounts(source.spiritGenerators, SPIRIT_GENERATORS, 1000),
    festivalBoosts: normalizeFestivalBoosts(source.festivalBoosts),
    licensePerks: normalizeCatalogCounts(source.licensePerks, LICENSE_PERKS, 20),
    rivals: normalizeCatalogCounts(source.rivals, RIVAL_CHALLENGES, 1000),
    generators: normalizeShopGenerators(source.generators),
    activeBoosts: normalizeShopBoosts(source.activeBoosts),
    activeFestivalBoosts: normalizeShopBoosts(source.activeFestivalBoosts),
    generatorCarry: {
      tofuStock: safeNonNegativeNumber(source.generatorCarry && source.generatorCarry.tofuStock, 0, 1000),
      deliveryOrders: safeNonNegativeNumber(source.generatorCarry && source.generatorCarry.deliveryOrders, 0, 1000),
      tips: safeNonNegativeNumber(source.generatorCarry && source.generatorCarry.tips, 0, 1000),
      reputation: safeNonNegativeNumber(source.generatorCarry && source.generatorCarry.reputation, 0, 1000),
    },
    purchaseMultiplier: SHOP_MULTIPLIERS.includes(source.purchaseMultiplier)
      ? source.purchaseMultiplier
      : defaults.purchaseMultiplier,
    currentShopTab: typeof source.currentShopTab === "string"
      ? source.currentShopTab.slice(0, 40)
      : defaults.currentShopTab,
    untrustedLocalQa: Boolean(source.untrustedLocalQa),
    ledger: normalizeLedger(source.ledger),
    lastShopTickAt: typeof source.lastShopTickAt === "string" ? source.lastShopTickAt : "",
    lastGeneratorTickAt:
      typeof source.lastGeneratorTickAt === "string" ? source.lastGeneratorTickAt : "",
    offlineEarnings: {
      tofuStock: safeNonNegativeInteger(
        source.offlineEarnings && source.offlineEarnings.tofuStock,
        0,
      ),
      deliveryOrders: safeNonNegativeInteger(
        source.offlineEarnings && source.offlineEarnings.deliveryOrders,
        0,
      ),
      tips: safeNonNegativeInteger(
        source.offlineEarnings && source.offlineEarnings.tips,
        0,
      ),
      shopSpirit: safeNonNegativeNumber(
        source.offlineEarnings && source.offlineEarnings.shopSpirit,
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
  syncShopGenerators(normalized);
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

function currentGameState() {
  return appState.liveGameState
    ? normalizeGameState(appState.liveGameState)
    : loadGameState();
}

function saveGameState(gameState) {
  const storage = safeLocalStorage();
  const normalized = normalizeGameState(gameState);
  appState.liveGameState = normalized;
  appState.lastShopGeneratorSaveAt = Date.now();
  if (!storage) return false;
  try {
    storage.setItem(GAME_STORAGE_KEY, JSON.stringify(normalized));
    return true;
  } catch (_) {
    return false;
  }
}

function resetGameState() {
  const storage = safeLocalStorage();
  appState.liveGameState = null;
  appState.lastShopGeneratorSaveAt = 0;
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
  const numericFields = [
    "tofuStock",
    "deliveryOrders",
    "tips",
    "reputation",
    "prepSlots",
    "shopReach",
    "shopSpirit",
    "licenseStars",
    "cupStabilityXP",
    "routeKnowledge",
    "lifetimeDeliveryOrders",
    "lifetimeTips",
    "lifetimeTofuPacked",
    "lifetimeReputation",
    "lifetimeRoutesCompleted",
    "lifetimeLicenseExams",
  ];
  if (!isValidImportedShopNumber(shop.shopLevel, 1000)) return false;
  if (!numericFields.every((field) => isValidImportedShopNumber(shop[field]))) return false;
  if (shop.offlineEarnings !== undefined) {
    if (!shop.offlineEarnings || typeof shop.offlineEarnings !== "object") return false;
    if (!isValidImportedShopNumber(shop.offlineEarnings.tofuStock)) return false;
    if (!isValidImportedShopNumber(shop.offlineEarnings.deliveryOrders)) return false;
    if (!isValidImportedShopNumber(shop.offlineEarnings.tips)) return false;
    if (!isValidImportedShopNumber(shop.offlineEarnings.shopSpirit)) return false;
    if (!isValidImportedShopNumber(shop.offlineEarnings.cappedHours, SHOP_OFFLINE_CAP_HOURS)) {
      return false;
    }
  }
  const numberMaps = [
    "upgrades",
    "stationUpgrades",
    "stations",
    "garage",
    "crew",
    "spiritGenerators",
    "festivalBoosts",
    "licensePerks",
    "rivals",
  ];
  for (const mapKey of numberMaps) {
    if (shop[mapKey] !== undefined) {
      if (!shop[mapKey] || typeof shop[mapKey] !== "object" || Array.isArray(shop[mapKey])) {
        return false;
      }
      for (const value of Object.values(shop[mapKey])) {
        const level = value && typeof value === "object" ? value.level : value;
        if (!isValidImportedShopNumber(level, 100000)) return false;
      }
    }
  }
  if (shop.routes !== undefined) {
    if (!shop.routes || typeof shop.routes !== "object" || Array.isArray(shop.routes)) {
      return false;
    }
    for (const route of Object.values(shop.routes)) {
      if (!route || typeof route !== "object" || Array.isArray(route)) return false;
      if (!isValidImportedShopNumber(route.completions, 100000)) return false;
      if (!isValidImportedShopNumber(route.mastery, 100)) return false;
      if (route.auto !== undefined && typeof route.auto !== "boolean") return false;
      if (route.lastCompletedAt !== undefined && typeof route.lastCompletedAt !== "string") return false;
    }
  }
  if (shop.generators !== undefined) {
    if (!shop.generators || typeof shop.generators !== "object" || Array.isArray(shop.generators)) {
      return false;
    }
    for (const generator of Object.values(shop.generators)) {
      if (!generator || typeof generator !== "object" || Array.isArray(generator)) return false;
      if (
        generator.unlocked !== undefined
        && typeof generator.unlocked !== "boolean"
      ) {
        return false;
      }
      if (!isValidImportedShopNumber(generator.level, 100)) return false;
    }
  }
  for (const boostKey of ["activeBoosts", "activeFestivalBoosts"]) {
    if (shop[boostKey] === undefined) continue;
    if (!Array.isArray(shop[boostKey])) return false;
    for (const boost of shop[boostKey]) {
      if (!boost || typeof boost !== "object" || Array.isArray(boost)) return false;
      if (boost.id !== undefined && typeof boost.id !== "string") return false;
      if (boost.label !== undefined && typeof boost.label !== "string") return false;
      if (boost.source !== undefined && typeof boost.source !== "string") return false;
      if (boost.expiresAt !== undefined && typeof boost.expiresAt !== "string") return false;
      if (boost.multiplier !== undefined && !isValidImportedShopNumber(boost.multiplier, 5)) {
        return false;
      }
    }
  }
  if (shop.ledger !== undefined) {
    if (!Array.isArray(shop.ledger)) return false;
    for (const entry of shop.ledger) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
      if (entry.date !== undefined && typeof entry.date !== "string") return false;
      if (entry.type !== undefined && typeof entry.type !== "string") return false;
      if (entry.text !== undefined && typeof entry.text !== "string") return false;
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
  const qualified = isQualifiedSession(summary);
  const validPractice = isValidPracticeSession(summary);

  function unlock(id) {
    if (clubState.unlockedMilestones[id]) return;
    clubState.unlockedMilestones[id] = new Date().toISOString();
    unlockedThisRun.push(id);
  }

  if (qualified || validPractice) {
    clubState.completedSessionCount += 1;
  }
  clubState.bestWaterScore = Math.max(
    Number(clubState.bestWaterScore || 0),
    Number(summary.waterLeft || 0),
  );

  if (summary.mode === "basic" && validPractice && summary.motionSamples > 0) unlock("first_pour");
  if (qualified && summary.waterLeft >= 50) unlock("half_cup_hero");
  if (qualified && summary.waterLeft >= 75) unlock("smooth_driver");
  if (
    qualified
    && summary.deliveryRewards
    && summary.deliveryRewards.merchProgress.nospillClubGear.unlocked
  ) {
    unlock("nospill_club");
  }
  if (qualified && summary.waterLeft >= 99.95) {
    unlock("perfect_pour");
  }

  if (qualified) {
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

function cargoProfileById(profileId) {
  return CARGO_PROFILES.find((profile) => profile.id === profileId) || CARGO_PROFILES[0];
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
    && session.qualificationStatus === "qualified"
    && (session.mode === "qualified" || session.mode === "simulated"),
  );
}

function isPracticeSession(session) {
  return !isQualifiedSession(session);
}

function isValidPracticeSession(session) {
  if (!isPracticeSession(session)) return false;
  return Number(session && session.durationSeconds || 0) >= PRACTICE_VALID_MIN_SECONDS;
}

function isDailyEligiblePracticeSession(session) {
  if (!isValidPracticeSession(session)) return false;
  return Number(session && session.durationSeconds || 0) >= PRACTICE_DAILY_MIN_SECONDS;
}

function displayRankForSession(session) {
  if (isQualifiedSession(session)) return rankForWater(calculateCargoCondition(session));
  const cargo = calculateCargoCondition(session);
  if (cargo >= 99.95) return "Perfect Practice";
  if (cargo >= 95) return "Full Cup Practice";
  if (cargo >= 75) return "Smooth Practice";
  if (cargo >= 50) return "Practice Saved";
  return "Spill Practice";
}

function classifyRouteType(summary) {
  if (!isQualifiedSession(summary)) return "Practice Route";
  if (
    summary
    && summary.simulated
    && [
      "Calm Cruise",
      "City Delivery",
      "Mixed Route",
      "Technical Route",
      "Long Haul",
    ].includes(summary.routeType)
  ) {
    return summary.routeType;
  }
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
  const state = normalizeGameState(gameState);
  return safeNonNegativeInteger(state.shop.upgrades[upgradeId], 0, 100);
}

function activeShopBoostMultiplier(shop, now = new Date()) {
  const nowMs = now instanceof Date ? now.getTime() : Date.parse(now);
  if (!Number.isFinite(nowMs)) return 1;
  const boosts = normalizeShopBoosts(shop && shop.activeBoosts);
  return boosts.reduce((multiplier, boost) => {
    const expiresMs = Date.parse(boost.expiresAt);
    if (!Number.isFinite(expiresMs) || expiresMs <= nowMs) return multiplier;
    return Math.max(multiplier, Number(boost.multiplier || 1));
  }, 1);
}

function getPrepSlotMax(shop) {
  const source = shop && shop.shop ? shop.shop : shop || {};
  const perkBonus = safeNonNegativeInteger(source.licensePerks && source.licensePerks.prep_slot_regen, 0, 20);
  return PREP_SLOT_BASE_MAX + safeNonNegativeInteger(source.shopLevel, 1, 1000) * 2 + perkBonus * 2;
}

function getShopSpiritMax(shop) {
  const source = shop && shop.shop ? shop.shop : shop || {};
  return SHOP_SPIRIT_BASE_MAX + safeNonNegativeInteger(source.shopLevel, 1, 1000) * 5;
}

function stationMilestoneMultiplier(owned) {
  const count = safeNonNegativeInteger(owned, 0, 100000);
  let multiplier = 1;
  if (count >= 10) multiplier *= 2;
  if (count >= 25) multiplier *= 2;
  if (count >= 50) multiplier *= 3;
  if (count >= 100) multiplier *= 4;
  return multiplier;
}

function stationUpgradeLevel(shop, upgradeId) {
  return safeNonNegativeInteger(shop && shop.stationUpgrades && shop.stationUpgrades[upgradeId], 0, 100);
}

function stationOutputMultiplier(shop, stationId) {
  const faster = stationUpgradeLevel(shop, `${stationId}_faster`);
  const specific = stationId === "delivery_route"
    ? stationUpgradeLevel(shop, "route_familiarity")
    : stationId === "dispatcher_desk"
      ? stationUpgradeLevel(shop, "better_clipboard")
      : 0;
  const doubleUpgradeId = stationId === "tofu_press"
    ? "tofu_press_double"
    : stationId === "prep_counter"
      ? "prep_counter_double"
      : stationId === "delivery_shelf"
        ? "delivery_shelf_double"
        : stationId === "regular_customer"
          ? "regular_customer_double"
          : "";
  const doubleLevel = stationUpgradeLevel(shop, doubleUpgradeId);
  const network = safeNonNegativeInteger(shop && shop.stations && shop.stations.regional_network, 0, 100000);
  const perk = safeNonNegativeInteger(shop && shop.licensePerks && shop.licensePerks.shop_multiplier, 0, 20);
  return (1 + faster * 0.25 + specific * 0.2)
    * (1 + doubleLevel * 0.5)
    * (1 + network * 0.08)
    * (1 + perk * 0.1);
}

function getShopGeneratorRates(gameState, now = new Date()) {
  const state = normalizeGameState(gameState);
  syncShopGenerators(state);
  const generators = state.shop.generators;
  const boostMultiplier = activeShopBoostMultiplier(state.shop, now);
  const festivalMultiplier = normalizeShopBoosts(state.shop.activeFestivalBoosts).reduce(
    (multiplier, boost) => {
      const expiresMs = Date.parse(boost.expiresAt);
      const nowMs = now instanceof Date ? now.getTime() : Date.parse(now);
      if (!Number.isFinite(expiresMs) || !Number.isFinite(nowMs) || expiresMs <= nowMs) return multiplier;
      return Math.max(multiplier, Number(boost.multiplier || 1));
    },
    1,
  );
  const tofuPressOwned = safeNonNegativeInteger(state.shop.stations.tofu_press, 1, 100000);
  const prepOwned = safeNonNegativeInteger(state.shop.stations.prep_counter, 0, 100000);
  const shelfOwned = safeNonNegativeInteger(state.shop.stations.delivery_shelf, 0, 100000);
  const customerOwned = safeNonNegativeInteger(state.shop.stations.regular_customer, 0, 100000);
  const signOwned = safeNonNegativeInteger(state.shop.stations.shop_sign, 0, 100000);
  const shelfBoost = 1 + shelfOwned * 0.08 + stationUpgradeLevel(state.shop, "delivery_shelf_faster") * 0.2;
  const tofuPressPerSecond = generators.tofuPress.unlocked
    ? tofuPressOwned
      * TOFU_PRESS_BASE_PER_SECOND
      * boostMultiplier
      * festivalMultiplier
      * stationOutputMultiplier(state.shop, "tofu_press")
      * stationMilestoneMultiplier(tofuPressOwned)
    : 0;
  const prepOrdersPerSecond = generators.prepCounter.unlocked && prepOwned > 0
    ? prepOwned
      * PREP_COUNTER_BASE_ORDERS_PER_SECOND
      * shelfBoost
      * stationOutputMultiplier(state.shop, "prep_counter")
      * stationMilestoneMultiplier(prepOwned)
    : 0;
  const prepTofuPerSecond = prepOrdersPerSecond * PREP_COUNTER_CONSUME_PER_ORDER;
  const customerTipsPerSecond = customerOwned
    * 0.02
    * stationOutputMultiplier(state.shop, "regular_customer")
    * stationMilestoneMultiplier(customerOwned);
  const shopSpiritPerSecond = SPIRIT_GENERATORS.reduce((total, generator) => (
    total
    + safeNonNegativeInteger(state.shop.spiritGenerators[generator.id], 0, 100000)
      * generator.spiritPerSecond
  ), 0);
  const prepSlotPerSecond = PREP_SLOT_REGEN_PER_SECOND
    * (1 + safeNonNegativeInteger(state.shop.licensePerks.prep_slot_regen, 0, 20) * 0.3);
  const passiveReputationPerSecond = signOwned * 0.002 * (1 + stationUpgradeLevel(state.shop, "shop_sign_faster") * 0.2);
  const prepStatus = !generators.prepCounter.unlocked
    ? "Locked"
    : state.shop.tofuStock >= PREP_COUNTER_CONSUME_PER_ORDER
      ? "Running"
      : "Waiting for tofu stock";
  return {
    tofuPressPerSecond,
    prepOrdersPerSecond,
    prepTofuPerSecond,
    customerTipsPerSecond,
    shopSpiritPerSecond,
    prepSlotPerSecond,
    passiveReputationPerSecond,
    prepStatus,
    boostMultiplier,
  };
}

function getShopProductionRate(gameState) {
  return getShopGeneratorRates(gameState).tofuPressPerSecond * 3600;
}

function formatShopRate(rate) {
  const value = Number(rate || 0);
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (value >= 1) return String(roundTo(value, 1));
  return String(roundTo(value, 3));
}

function formatShopBalance(value, carry = 0) {
  const total = safeNonNegativeNumber(value, 0) + safeNonNegativeNumber(carry, 0, 1000);
  if (total >= 100) return String(Math.floor(total));
  if (Number.isInteger(total)) return String(total);
  return String(roundTo(total, 2));
}

function calculateShopGeneratorEarnings(gameState, now = new Date(), options = {}) {
  const state = normalizeGameState(gameState);
  const shop = state.shop;
  const rates = getShopGeneratorRates(state, now);
  const lastTick = shop.lastGeneratorTickAt || shop.lastShopTickAt;
  const lastMs = Date.parse(lastTick);
  const nowMs = now instanceof Date ? now.getTime() : Date.parse(now);
  if (!Number.isFinite(lastMs) || !Number.isFinite(nowMs) || nowMs <= lastMs) {
    const existingCarry = shop.generatorCarry || {};
    return {
      tofuStock: 0,
      deliveryOrders: 0,
      tips: 0,
      reputation: 0,
      prepSlots: 0,
      shopSpirit: 0,
      tofuProduced: 0,
      tofuConsumed: 0,
      cappedHours: 0,
      elapsedHours: 0,
      elapsedSeconds: 0,
      carry: {
        tofuStock: safeNonNegativeNumber(existingCarry.tofuStock, 0, 1000),
        deliveryOrders: safeNonNegativeNumber(existingCarry.deliveryOrders, 0, 1000),
        tips: safeNonNegativeNumber(existingCarry.tips, 0, 1000),
        reputation: safeNonNegativeNumber(existingCarry.reputation, 0, 1000),
      },
      prepStatus: rates.prepStatus,
    };
  }
  const maxSeconds = Number.isFinite(Number(options.maxSeconds))
    ? Math.max(0, Number(options.maxSeconds))
    : SHOP_OPEN_TICK_MAX_SECONDS;
  const elapsedSeconds = Math.min(maxSeconds, Math.max(0, (nowMs - lastMs) / 1000));
  const carry = shop.generatorCarry || {};
  const useCarry = options.useCarry !== false;
  const tofuTotal = rates.tofuPressPerSecond * elapsedSeconds + (useCarry ? Number(carry.tofuStock || 0) : 0);
  const orderTotal = rates.prepOrdersPerSecond * elapsedSeconds + (useCarry ? Number(carry.deliveryOrders || 0) : 0);
  const tipsTotal = rates.customerTipsPerSecond * elapsedSeconds + (useCarry ? Number(carry.tips || 0) : 0);
  const reputationTotal = rates.passiveReputationPerSecond * elapsedSeconds + (useCarry ? Number(carry.reputation || 0) : 0);
  const tofuProduced = Math.floor(tofuTotal);
  const possibleOrders = Math.floor(orderTotal);
  const availableTofu = safeNonNegativeInteger(shop.tofuStock + tofuProduced);
  const deliveryOrders = Math.min(
    possibleOrders,
    Math.floor(availableTofu / PREP_COUNTER_CONSUME_PER_ORDER),
  );
  const tofuConsumed = deliveryOrders * PREP_COUNTER_CONSUME_PER_ORDER;
  const tofuStock = tofuProduced - tofuConsumed;
  const tips = Math.floor(tipsTotal);
  const reputation = Math.floor(reputationTotal);
  const prepSlots = rates.prepSlotPerSecond * elapsedSeconds;
  const shopSpirit = rates.shopSpiritPerSecond * elapsedSeconds;
  const prepStatus = !shop.generators.prepCounter.unlocked
    ? "Locked"
    : deliveryOrders > 0
      ? "Running"
      : availableTofu >= PREP_COUNTER_CONSUME_PER_ORDER
        ? "Running"
        : "Waiting for tofu stock";
  return {
    tofuStock,
    deliveryOrders,
    tips,
    reputation,
    prepSlots,
    shopSpirit,
    tofuProduced,
    tofuConsumed,
    carry: {
      tofuStock: Math.max(0, tofuTotal - tofuProduced),
      deliveryOrders: Math.max(0, orderTotal - possibleOrders),
      tips: Math.max(0, tipsTotal - tips),
      reputation: Math.max(0, reputationTotal - reputation),
    },
    cappedHours: roundTo(elapsedSeconds / 3600, 2),
    elapsedHours: roundTo((nowMs - lastMs) / 3600000, 2),
    elapsedSeconds: roundTo(elapsedSeconds, 2),
    prepStatus,
  };
}

function applyShopGeneratorTick(gameState, now = new Date(), options = {}) {
  const next = normalizeGameState(gameState);
  const nowIso = now instanceof Date ? now.toISOString() : new Date(now).toISOString();
  if (!isShopDiscoveredState(next)) {
    return {
      gameState: next,
      earnings: calculateShopGeneratorEarnings(next, now, options),
      changed: false,
    };
  }
  syncShopGenerators(next);
  if (!next.shop.lastGeneratorTickAt && !next.shop.lastShopTickAt) {
    next.shop.lastGeneratorTickAt = nowIso;
    next.shop.lastShopTickAt = next.shop.lastShopTickAt || nowIso;
    return {
      gameState: next,
      earnings: calculateShopGeneratorEarnings(next, now, options),
      changed: true,
    };
  }
  const earnings = calculateShopGeneratorEarnings(next, now, options);
  const changed = earnings.tofuStock !== 0
    || earnings.deliveryOrders > 0
    || earnings.tips > 0
    || earnings.reputation > 0
    || earnings.prepSlots > 0
    || earnings.shopSpirit > 0
    || JSON.stringify(earnings.carry || {}) !== JSON.stringify(next.shop.generatorCarry || {});
  if (changed) {
    next.shop.tofuStock = safeNonNegativeInteger(next.shop.tofuStock + earnings.tofuStock);
    next.shop.deliveryOrders = safeNonNegativeInteger(
      next.shop.deliveryOrders + earnings.deliveryOrders,
    );
    next.shop.tips = safeNonNegativeInteger(next.shop.tips + earnings.tips);
    next.shop.lifetimeTips = safeNonNegativeInteger(next.shop.lifetimeTips + earnings.tips);
    next.shop.reputation = safeNonNegativeInteger(next.shop.reputation + earnings.reputation);
    next.shop.lifetimeReputation = safeNonNegativeInteger(
      next.shop.lifetimeReputation + earnings.reputation,
    );
    next.shop.shopLevel = getShopLevel(next.shop.reputation);
    next.shop.prepSlots = Math.min(
      getPrepSlotMax(next.shop),
      safeNonNegativeNumber(next.shop.prepSlots + earnings.prepSlots),
    );
    next.shop.shopSpirit = Math.min(
      getShopSpiritMax(next.shop),
      safeNonNegativeNumber(next.shop.shopSpirit + earnings.shopSpirit),
    );
    next.shop.lifetimeDeliveryOrders = safeNonNegativeInteger(
      next.shop.lifetimeDeliveryOrders + earnings.deliveryOrders,
    );
    next.shop.generatorCarry = {
      tofuStock: safeNonNegativeNumber(earnings.carry && earnings.carry.tofuStock, 0, 1000),
      deliveryOrders: safeNonNegativeNumber(earnings.carry && earnings.carry.deliveryOrders, 0, 1000),
      tips: safeNonNegativeNumber(earnings.carry && earnings.carry.tips, 0, 1000),
      reputation: safeNonNegativeNumber(earnings.carry && earnings.carry.reputation, 0, 1000),
    };
    next.shop.lastGeneratorTickAt = nowIso;
    next.shop.lastShopTickAt = nowIso;
  }
  return { gameState: next, earnings, changed };
}

function calculateOfflineShopEarnings(gameState, now = new Date()) {
  return calculateShopGeneratorEarnings(gameState, now, {
    maxSeconds: SHOP_OFFLINE_CAP_HOURS * 3600,
  });
}

function hasCompletedDeliveryState(state) {
  return Boolean(
    state
    && (
      state.stamps.first_delivery
    || (Array.isArray(state.recentSessions) && state.recentSessions.length > 0)
      || (Array.isArray(state.recentRewards) && state.recentRewards.length > 0)
    )
  );
}

function isShopDiscoveredState(state) {
  return Boolean(
    state
    && (
      hasCompletedDeliveryState(state)
    || Number(state.shop.tofuStock || 0) > 0
      || Number(state.shop.deliveryOrders || 0) > 0
      || Number(state.shop.tips || 0) > 0
    || Number(state.shop.reputation || 0) > 0
    || Number(state.shop.lifetimeTofuPacked || 0) > 0
      || Number(state.shop.lifetimeDeliveryOrders || 0) > 0
      || Number(state.shop.lifetimeTips || 0) > 0
      || Boolean(state.shop.generators && state.shop.generators.tofuPress && state.shop.generators.tofuPress.unlocked)
      || Object.values(state.shop.upgrades || {}).some((level) => Number(level || 0) > 0)
    )
  );
}

function syncShopGenerators(state) {
  if (!state || !state.shop) return state;
  const shop = state.shop;
  const upgrades = shop.upgrades || {};
  const current = normalizeShopGenerators(shop.generators);
  shop.stations = normalizeCatalogCounts(shop.stations, SHOP_STATIONS, 100000);
  if (shop.stations.tofu_press < 1) shop.stations.tofu_press = 1;
  const tofuPressUpgradeLevel = safeNonNegativeInteger(upgrades.tofu_press, 0, 100);
  const prepCounterUpgradeLevel = safeNonNegativeInteger(upgrades.prep_counter, 0, 100);
  shop.stations.tofu_press = Math.max(shop.stations.tofu_press, tofuPressUpgradeLevel + 1);
  const tofuPressUnlocked = true;
  const prepCounterUnlocked = Boolean(
    current.prepCounter.unlocked
    || shop.shopLevel >= 2
    || Number(shop.tofuStock || 0) >= 10
    || Number(shop.lifetimeDeliveryOrders || 0) > 0
    || Number(shop.stations.prep_counter || 0) > 0
    || tofuPressUpgradeLevel > 0
    || prepCounterUpgradeLevel > 0,
  );
  if (prepCounterUnlocked && shop.stations.prep_counter < 1) {
    shop.stations.prep_counter = 1;
  }
  if (prepCounterUnlocked) {
    shop.stations.prep_counter = Math.max(shop.stations.prep_counter, prepCounterUpgradeLevel + 1);
  }
  shop.generators = {
    tofuPress: {
      unlocked: tofuPressUnlocked,
      level: tofuPressUnlocked
        ? Math.max(1, current.tofuPress.level, shop.stations.tofu_press, tofuPressUpgradeLevel + 1)
        : 0,
    },
    prepCounter: {
      unlocked: prepCounterUnlocked,
      level: prepCounterUnlocked
        ? Math.max(1, current.prepCounter.level, shop.stations.prep_counter, prepCounterUpgradeLevel + 1)
        : 0,
    },
  };
  return state;
}

function shopStationById(stationId) {
  return SHOP_STATIONS.find((station) => station.id === stationId) || null;
}

function stationIsUnlocked(station, gameState) {
  const state = normalizeGameState(gameState);
  const shop = state.shop;
  if (!station) return false;
  if (station.id === "tofu_press") return true;
  if (station.id === "prep_counter") return shop.shopLevel >= 2 || shop.tofuStock >= 10 || shop.stations.prep_counter > 0;
  if (station.id === "delivery_shelf") return shop.shopLevel >= 2;
  if (station.id === "shop_sign") return shop.reputation >= 10 || shop.shopLevel >= 2;
  if (station.id === "regular_customer") return shop.stations.shop_sign > 0;
  if (station.id === "delivery_route") return shop.shopReach >= 2 || shop.routeKnowledge >= 6;
  if (station.id === "dispatcher_desk") return shop.reputation >= 40 || shop.stations.delivery_route > 0;
  if (station.id === "regional_network") return shop.shopLevel >= 5;
  return false;
}

function stationCost(station, owned) {
  return Math.ceil(station.baseCostTips * Math.pow(station.growthRate, safeNonNegativeInteger(owned, 0, 100000)));
}

function fulfilledShopOrderCount(gameState) {
  const state = normalizeGameState(gameState);
  return safeNonNegativeInteger(state.shop.lifetimeDeliveryOrders, 0, 1000000);
}

function hasFirstShopOrder(gameState) {
  const state = normalizeGameState(gameState);
  return Boolean(state.stamps.first_shop_order) || fulfilledShopOrderCount(state) > 0;
}

function stationPurchaseDisabledReason(station, gameState, cost, unlocked) {
  const state = normalizeGameState(gameState);
  if (!station) return "Shop station unavailable.";
  if (!unlocked) return station.unlock || "Locked.";
  if (appState.running || appState.calibrating) return "Shop actions unlock after you finish and park.";
  const tipsNeeded = Math.max(0, safeNonNegativeInteger(cost, 0, 1000000000) - state.shop.tips);
  if (tipsNeeded > 0) return `Need ${tipsNeeded} more Tips. Fulfill shop orders to earn Tips.`;
  const prepNeeded = Math.max(0, safeNonNegativeInteger(station.prepSlotCost, 0, 100) - state.shop.prepSlots);
  if (prepNeeded > 0) return `Need ${prepNeeded} more Prep Slot${prepNeeded === 1 ? "" : "s"}`;
  return "";
}

function stationUpgradeCostTips(upgrade, level = 0) {
  return Math.ceil(upgrade.costTips * Math.pow(1.32, safeNonNegativeInteger(level, 0, upgrade.maxLevel)));
}

function stationUpgradeRevealReason(upgrade, gameState) {
  const state = normalizeGameState(gameState);
  const orders = fulfilledShopOrderCount(state);
  if (upgrade.id === "tofu_press_faster") return "Unlocks after first shop order";
  if (upgrade.id === "tofu_press_double") return "Unlocks after owning 3 Tofu Presses";
  if (upgrade.id === "prep_counter_faster") return "Unlocks after 5 fulfilled orders";
  if (upgrade.id === "prep_counter_double") return "Unlocks after owning 2 Prep Counters";
  if (upgrade.stationId === "delivery_shelf") return "Unlocks after the Delivery Shelf matters";
  if (upgrade.stationId === "shop_sign") return "Unlocks when reputation matters";
  if (upgrade.stationId === "regular_customer") return "Unlocks after Regular Customers arrive";
  if (upgrade.stationId === "delivery_route") return "Unlocks after fictional routes arrive";
  if (upgrade.stationId === "dispatcher_desk") return "Unlocks after crew automation arrives";
  if (orders < 1) return "Unlocks after first shop order";
  return "Coming after the core shop loop is balanced";
}

function stationUpgradeIsRevealed(upgrade, gameState) {
  const state = normalizeGameState(gameState);
  const orders = fulfilledShopOrderCount(state);
  if (upgrade.id === "tofu_press_faster") return hasFirstShopOrder(state) || state.shop.tips >= 50;
  if (upgrade.id === "tofu_press_double") return state.shop.stations.tofu_press >= 3 || orders >= 3;
  if (upgrade.id === "prep_counter_faster") return orders >= 5 || state.shop.stations.prep_counter >= 2;
  if (upgrade.id === "prep_counter_double") return state.shop.stations.prep_counter >= 2 || orders >= 10;
  if (upgrade.stationId === "delivery_shelf") return state.shop.stations.delivery_shelf > 0;
  if (upgrade.stationId === "shop_sign") return state.shop.stations.shop_sign > 0 || state.shop.reputation >= 10;
  if (upgrade.stationId === "regular_customer") return state.shop.stations.regular_customer > 0;
  if (upgrade.stationId === "delivery_route") return state.shop.stations.delivery_route > 0 || state.shop.shopReach >= 2;
  if (upgrade.stationId === "dispatcher_desk") return state.shop.stations.dispatcher_desk > 0;
  if (upgrade.stationId === "regional_network") return state.shop.stations.regional_network > 0;
  return false;
}

function visibleStationUpgrades(gameState) {
  const state = normalizeGameState(gameState);
  return STATION_UPGRADES.filter((upgrade) => stationUpgradeIsRevealed(upgrade, state));
}

function stationUpgradeDisabledReason(upgrade, gameState, unlocked, cost, level) {
  const state = normalizeGameState(gameState);
  if (!stationUpgradeIsRevealed(upgrade, state)) return stationUpgradeRevealReason(upgrade, state);
  if (!unlocked) return stationUpgradeRevealReason(upgrade, state);
  if (level >= upgrade.maxLevel) return "Maxed";
  if (appState.running || appState.calibrating) return "Shop actions unlock after you finish and park.";
  const tipsNeeded = Math.max(0, safeNonNegativeInteger(cost, 0, 1000000000) - state.shop.tips);
  return tipsNeeded > 0 ? `Need ${tipsNeeded} more Tips. Fulfill shop orders to earn Tips.` : "";
}

function buyQuantityFromRequest(gameState, station, requested) {
  const state = normalizeGameState(gameState);
  const owned = safeNonNegativeInteger(state.shop.stations[station.id], 0, 100000);
  const prepCost = Math.max(0, safeNonNegativeInteger(station.prepSlotCost, 0, 100));
  const canBuyOne = (count) => {
    const totalTips = Array.from({ length: count }).reduce(
      (sum, _, index) => sum + stationCost(station, owned + index),
      0,
    );
    return totalTips <= state.shop.tips && prepCost * count <= state.shop.prepSlots;
  };
  if (requested === "max") {
    let count = 0;
    while (count < 1000 && canBuyOne(count + 1)) count += 1;
    return count;
  }
  return Math.max(1, safeNonNegativeInteger(requested, 1, 100));
}

function buyShopStation(stationId, gameState, requestedQuantity = 1) {
  let next = normalizeGameState(gameState);
  const station = shopStationById(stationId);
  if (!station) return { ok: false, reason: "Shop station unavailable.", gameState: next };
  if (!stationIsUnlocked(station, next)) {
    return { ok: false, reason: station.unlock, gameState: next };
  }
  const quantity = buyQuantityFromRequest(next, station, requestedQuantity);
  if (quantity < 1) return { ok: false, reason: "Not enough tips or Prep Slots.", gameState: next };
  const owned = safeNonNegativeInteger(next.shop.stations[station.id], 0, 100000);
  const costTips = Array.from({ length: quantity }).reduce(
    (sum, _, index) => sum + stationCost(station, owned + index),
    0,
  );
  const prepCost = safeNonNegativeInteger(station.prepSlotCost, 0, 100) * quantity;
  if (next.shop.tips < costTips) return { ok: false, reason: "Not enough tips.", gameState: next };
  if (next.shop.prepSlots < prepCost) return { ok: false, reason: "Prep Slots are recovering.", gameState: next };
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - costTips);
  next.shop.prepSlots = safeNonNegativeNumber(next.shop.prepSlots - prepCost);
  next.shop.stations[station.id] = owned + quantity;
  syncShopGenerators(next);
  next = addLedgerEntry(next, "purchase", `Bought ${quantity} ${station.name}${quantity > 1 ? "s" : ""}.`);
  return { ok: true, reason: "", gameState: next, station, quantity, costTips };
}

function fulfillShopOrders(gameState, requestedQuantity = 1, options = {}) {
  let next = normalizeGameState(gameState);
  if (options.activeDrive) {
    return { ok: false, reason: "Shop actions unlock after you finish and park.", gameState: next };
  }
  const quantity = requestedQuantity === "max"
    ? safeNonNegativeInteger(next.shop.deliveryOrders, 0, 100000)
    : Math.max(1, safeNonNegativeInteger(requestedQuantity, 1, 100));
  if (quantity < 1 || next.shop.deliveryOrders < quantity) {
    return { ok: false, reason: "No Delivery Orders ready. Prep Counter needs delivery orders first.", gameState: next };
  }
  const signBonus = 1 + stationUpgradeLevel(next.shop, "shop_sign_faster") * 0.2;
  const garageBonus = safeNonNegativeInteger(next.shop.garage.delivery_mat, 0, 100) >= 3 ? 1 : 0;
  const tipsGained = Math.round(SHOP_ORDER_TIPS_REWARD * quantity);
  const reputationGained = Math.round((SHOP_ORDER_REPUTATION_REWARD * quantity + garageBonus) * signBonus);
  const xpGained = SHOP_ORDER_XP_REWARD * quantity;
  const previousShopLevel = next.shop.shopLevel;
  next.shop.deliveryOrders = safeNonNegativeInteger(next.shop.deliveryOrders - quantity);
  next.shop.tips = safeNonNegativeInteger(next.shop.tips + tipsGained);
  next.shop.lifetimeTips = safeNonNegativeInteger(next.shop.lifetimeTips + tipsGained);
  next.shop.reputation = safeNonNegativeInteger(next.shop.reputation + reputationGained);
  next.shop.lifetimeReputation = safeNonNegativeInteger(next.shop.lifetimeReputation + reputationGained);
  next.shop.lifetimeDeliveryOrders = safeNonNegativeInteger(next.shop.lifetimeDeliveryOrders + quantity);
  next.totalXP = Math.max(0, Math.round(Number(next.totalXP || 0) + xpGained));
  next.level = levelForXP(next.totalXP);
  next.shop.shopLevel = getShopLevel(next.shop.reputation);
  if (!next.stamps.first_shop_order) next.stamps.first_shop_order = { date: new Date().toISOString(), label: STAMP_LABELS.first_shop_order };
  if (next.shop.lifetimeDeliveryOrders >= 10 && !next.stamps.first_10_orders) {
    next.stamps.first_10_orders = { date: new Date().toISOString(), label: STAMP_LABELS.first_10_orders };
  }
  if (next.shop.lifetimeTips >= 100 && !next.stamps.first_100_tips) {
    next.stamps.first_100_tips = { date: new Date().toISOString(), label: STAMP_LABELS.first_100_tips };
  }
  syncShopGenerators(next);
  next.shop.lastShopTickAt = new Date().toISOString();
  next = addLedgerEntry(next, "order", `Fulfilled ${quantity} shop order${quantity > 1 ? "s" : ""}.`);
  next.recentRewards = [{
    date: next.shop.lastShopTickAt,
    type: "shop_order",
    label: quantity > 1 ? "Shop Orders Complete" : "Shop Order Complete",
    tipsGained,
    reputationGained,
    xpGained,
  }, ...next.recentRewards].slice(0, 12);
  return {
    ok: true,
    reason: "",
    gameState: next,
    quantity,
    tipsGained,
    reputationGained,
    xpGained,
    shopLevelBefore: previousShopLevel,
    shopLevelAfter: next.shop.shopLevel,
    shopLevelChanged: next.shop.shopLevel > previousShopLevel,
    report: `Shop order${quantity > 1 ? "s" : ""} complete. Packed and handed off from the counter.`,
  };
}

function hasCompletedDelivery(gameState) {
  return hasCompletedDeliveryState(normalizeGameState(gameState));
}

function isShopDiscovered(gameState) {
  return isShopDiscoveredState(normalizeGameState(gameState));
}

function isPassportDiscovered(gameState) {
  return deliveryPassportSummary(gameState).total > 0;
}

function isCrewDiscovered(gameState) {
  const state = normalizeGameState(gameState);
  return state.collection.unlockedCharacterIds.length > 0;
}

function areSoundPacksDiscovered(gameState) {
  const state = normalizeGameState(gameState);
  return state.collection.unlockedSoundPackIds.some((id) => id !== "default")
    || isPassportDiscovered(state);
}

function progressiveRevealState(gameState) {
  const state = normalizeGameState(gameState);
  return {
    firstDelivery: hasCompletedDelivery(state),
    shop: isShopDiscovered(state),
    passport: isPassportDiscovered(state),
    crew: isCrewDiscovered(state),
    sounds: areSoundPacksDiscovered(state),
  };
}

function applyOfflineShopEarnings(gameState, now = new Date()) {
  let next = normalizeGameState(gameState);
  const nowIso = now instanceof Date ? now.toISOString() : new Date(now).toISOString();
  const hadTick = Boolean(next.shop.lastGeneratorTickAt || next.shop.lastShopTickAt);
  const result = applyShopGeneratorTick(next, now, {
    maxSeconds: SHOP_OFFLINE_CAP_HOURS * 3600,
  });
  next = result.gameState;
  const earnings = result.earnings;
  next.shop.offlineEarnings = {
    tofuStock: Math.max(0, earnings.tofuStock),
    deliveryOrders: earnings.deliveryOrders,
    tips: 0,
    cappedHours: earnings.cappedHours,
  };
  next.shop.lastShopTickAt = nowIso;
  next.shop.lastGeneratorTickAt = next.shop.lastGeneratorTickAt || nowIso;
  return {
    gameState: next,
    earnings,
    changed: !hadTick || result.changed,
  };
}

function loadGameStateWithOfflineShopEarnings(now = new Date()) {
  const state = loadGameState();
  const result = applyOfflineShopEarnings(state, now);
  if (result.changed) saveGameState(result.gameState);
  appState.liveGameState = result.gameState;
  appState.lastShopGeneratorSaveAt = now instanceof Date ? now.getTime() : Date.parse(now) || Date.now();
  return result.gameState;
}

function tickOpenShopGenerators(now = new Date()) {
  if (appState.running || appState.calibrating) return null;
  const state = currentGameState();
  if (!isShopDiscovered(state)) return null;
  const result = applyShopGeneratorTick(state, now, {
    maxSeconds: SHOP_OPEN_TICK_MAX_SECONDS,
  });
  if (result.changed) {
    appState.liveGameState = result.gameState;
    renderGamePanels(result.gameState);
    const nowMs = now instanceof Date ? now.getTime() : Date.parse(now) || Date.now();
    if (!appState.lastShopGeneratorSaveAt || nowMs - appState.lastShopGeneratorSaveAt >= SHOP_GENERATOR_SAVE_MS) {
      saveGameState(result.gameState);
      appState.lastShopGeneratorSaveAt = nowMs;
    }
  }
  return result;
}

function startShopGeneratorTimer() {
  if (typeof window === "undefined" || typeof window.setInterval !== "function") return;
  if (appState.shopGeneratorTimer) return;
  appState.shopGeneratorTimer = window.setInterval(
    () => tickOpenShopGenerators(new Date()),
    SHOP_GENERATOR_TICK_MS,
  );
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
  if (!isShopDiscovered(next)) {
    return {
      ok: false,
      reason: "The shop is warming up. Try again while parked.",
      gameState: next,
      tofuStockGained: 0,
    };
  }
  syncShopGenerators(next);
  const amount = 1 + Math.min(3, Math.floor(next.shop.upgrades.tofu_press / 2));
  next.shop.tofuStock = safeNonNegativeInteger(next.shop.tofuStock + amount);
  next.shop.lifetimeTofuPacked = safeNonNegativeInteger(
    next.shop.lifetimeTofuPacked + amount,
  );
  next.shop.lastShopTickAt = new Date().toISOString();
  next.shop.lastGeneratorTickAt = next.shop.lastGeneratorTickAt || next.shop.lastShopTickAt;
  return {
    ok: true,
    reason: "",
    gameState: next,
    tofuStockGained: amount,
  };
}

function fulfillShopOrder(gameState, options = {}) {
  return fulfillShopOrders(gameState, 1, options);
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
  syncShopGenerators(next);
  next.shop.lastShopTickAt = new Date().toISOString();
  next.shop.lastGeneratorTickAt = next.shop.lastShopTickAt;
  return {
    ok: true,
    reason: "",
    gameState: next,
    upgrade: { ...upgrade, level: currentLevel + 1 },
  };
}

function buyStationUpgrade(upgradeId, gameState) {
  let next = normalizeGameState(gameState);
  const upgrade = STATION_UPGRADES.find((item) => item.id === upgradeId);
  if (!upgrade) return { ok: false, reason: "Station upgrade unavailable.", gameState: next };
  const station = shopStationById(upgrade.stationId);
  if (!station || !stationIsUnlocked(station, next)) {
    return { ok: false, reason: "Station is locked.", gameState: next };
  }
  const current = safeNonNegativeInteger(next.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel);
  if (current >= upgrade.maxLevel) return { ok: false, reason: "Upgrade is already maxed.", gameState: next };
  const costTips = Math.ceil(upgrade.costTips * Math.pow(1.32, current));
  if (next.shop.tips < costTips) return { ok: false, reason: "Not enough tips.", gameState: next };
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - costTips);
  next.shop.stationUpgrades[upgrade.id] = current + 1;
  next = addLedgerEntry(next, "upgrade", `${upgrade.name} upgraded.`);
  return { ok: true, gameState: next, upgrade, level: current + 1, costTips };
}

function routeIsUnlocked(route, gameState) {
  const state = normalizeGameState(gameState);
  if (route.id === "shop_street") return true;
  if (route.id === "old_hill_road") return state.shop.shopReach >= 2;
  if (route.id === "lantern_bridge") return state.shop.reputation >= 25;
  if (route.id === "rainy_switchback") return state.shop.routeKnowledge >= 25;
  if (route.id === "fox_shrine_road") return state.shop.shopReach >= 10;
  return false;
}

function completeFictionalRoute(routeId, gameState) {
  let next = normalizeGameState(gameState);
  const route = SHOP_ROUTE_CATALOG.find((item) => item.id === routeId);
  if (!route) return { ok: false, reason: "Route card unavailable.", gameState: next };
  if (!routeIsUnlocked(route, next)) return { ok: false, reason: route.unlock, gameState: next };
  if (next.shop.tofuStock < route.tofuCost) return { ok: false, reason: "Not enough tofu stock.", gameState: next };
  if (next.shop.deliveryOrders < route.orderCost) return { ok: false, reason: "Not enough Delivery Orders.", gameState: next };
  const routeBoost = 1 + stationUpgradeLevel(next.shop, "route_familiarity") * 0.2;
  const notesBoost = 1 + stationUpgradeLevel(next.shop, "careful_notes") * 0.25;
  const scoutBoost = 1 + safeNonNegativeInteger(next.shop.crew.route_scout, 0, 1000) * 0.05;
  next.shop.tofuStock = safeNonNegativeInteger(next.shop.tofuStock - route.tofuCost);
  next.shop.deliveryOrders = safeNonNegativeInteger(next.shop.deliveryOrders - route.orderCost);
  const tipsGained = Math.round(route.tipReward * routeBoost);
  const reputationGained = Math.round(route.reputationReward * routeBoost);
  const knowledgeGained = Math.round(route.routeKnowledgeReward * notesBoost);
  const reachGained = Math.round(route.shopReachReward * scoutBoost);
  next.shop.tips = safeNonNegativeInteger(next.shop.tips + tipsGained);
  next.shop.lifetimeTips = safeNonNegativeInteger(next.shop.lifetimeTips + tipsGained);
  next.shop.reputation = safeNonNegativeInteger(next.shop.reputation + reputationGained);
  next.shop.lifetimeReputation = safeNonNegativeInteger(next.shop.lifetimeReputation + reputationGained);
  next.shop.routeKnowledge = safeNonNegativeInteger(next.shop.routeKnowledge + knowledgeGained);
  next.shop.shopReach = safeNonNegativeInteger(next.shop.shopReach + reachGained);
  next.shop.lifetimeRoutesCompleted = safeNonNegativeInteger(next.shop.lifetimeRoutesCompleted + 1);
  next.shop.shopLevel = getShopLevel(next.shop.reputation);
  const routeState = next.shop.routes[route.id];
  routeState.completions = safeNonNegativeInteger(routeState.completions + 1);
  routeState.mastery = Math.min(100, routeState.mastery + 10);
  routeState.lastCompletedAt = new Date().toISOString();
  next.stamps[route.stampId] = next.stamps[route.stampId] || {
    date: new Date().toISOString(),
    label: STAMP_LABELS[route.stampId] || route.name,
  };
  next = addLedgerEntry(next, "route", `${route.name} complete as a fictional shop route.`);
  return { ok: true, gameState: next, route, tipsGained, reputationGained, knowledgeGained, reachGained };
}

function runTrainingDrill(drillId, gameState) {
  let next = normalizeGameState(gameState);
  const drill = TRAINING_DRILLS.find((item) => item.id === drillId);
  if (!drill) return { ok: false, reason: "Training drill unavailable.", gameState: next };
  if (next.shop.tips < drill.costTips) return { ok: false, reason: "Not enough tips.", gameState: next };
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - drill.costTips);
  next.shop.cupStabilityXP = safeNonNegativeInteger(next.shop.cupStabilityXP + drill.cupStabilityXP);
  next.skillXP[drill.skill] = safeNonNegativeInteger((next.skillXP[drill.skill] || 0) + drill.cupStabilityXP);
  next = addLedgerEntry(next, "training", drill.report);
  return { ok: true, gameState: next, drill };
}

function buyGarageUpgrade(upgradeId, gameState) {
  let next = normalizeGameState(gameState);
  const upgrade = GARAGE_UPGRADES.find((item) => item.id === upgradeId);
  if (!upgrade) return { ok: false, reason: "Garage upgrade unavailable.", gameState: next };
  const current = safeNonNegativeInteger(next.shop.garage[upgrade.id], 0, upgrade.maxLevel);
  if (current >= upgrade.maxLevel) return { ok: false, reason: "Garage upgrade is maxed.", gameState: next };
  const costTips = Math.ceil(upgrade.costTips * Math.pow(1.25, current));
  if (next.shop.tips < costTips) return { ok: false, reason: "Not enough tips.", gameState: next };
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - costTips);
  next.shop.garage[upgrade.id] = current + 1;
  next = addLedgerEntry(next, "garage", `${upgrade.name} upgraded for fictional shop routes.`);
  return { ok: true, gameState: next, upgrade, level: current + 1 };
}

function hireCrewRole(roleId, gameState) {
  let next = normalizeGameState(gameState);
  const role = CREW_ROLES.find((item) => item.id === roleId);
  if (!role) return { ok: false, reason: "Crew role unavailable.", gameState: next };
  const current = safeNonNegativeInteger(next.shop.crew[role.id], 0, 1000);
  const costTips = Math.ceil(role.costTips * Math.pow(1.35, current));
  if (next.shop.tips < costTips) return { ok: false, reason: "Not enough tips.", gameState: next };
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - costTips);
  next.shop.crew[role.id] = current + 1;
  if (role.id === "apprentice_driver" && !next.stamps.first_apprentice) {
    next.stamps.first_apprentice = { date: new Date().toISOString(), label: STAMP_LABELS.first_apprentice };
  }
  next = addLedgerEntry(next, "crew", `${role.name} joined the Delivery Crew.`);
  return { ok: true, gameState: next, role, level: current + 1 };
}

function buySpiritGenerator(generatorId, gameState) {
  let next = normalizeGameState(gameState);
  const generator = SPIRIT_GENERATORS.find((item) => item.id === generatorId);
  if (!generator) return { ok: false, reason: "Shop Spirit station unavailable.", gameState: next };
  const current = safeNonNegativeInteger(next.shop.spiritGenerators[generator.id], 0, 1000);
  const costTips = Math.ceil(generator.costTips * Math.pow(1.22, current));
  if (next.shop.tips < costTips) return { ok: false, reason: "Not enough tips.", gameState: next };
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - costTips);
  next.shop.spiritGenerators[generator.id] = current + 1;
  next = addLedgerEntry(next, "spirit", `${generator.name} added to the shop.`);
  return { ok: true, gameState: next, generator, level: current + 1 };
}

function useShopSpiritBoost(boostId, gameState) {
  let next = normalizeGameState(gameState);
  const boost = SHOP_SPIRIT_BOOSTS.find((item) => item.id === boostId);
  if (!boost) return { ok: false, reason: "Shop Spirit boost unavailable.", gameState: next };
  if (next.shop.shopSpirit < boost.costSpirit) return { ok: false, reason: "Not enough Shop Spirit.", gameState: next };
  next.shop.shopSpirit = safeNonNegativeNumber(next.shop.shopSpirit - boost.costSpirit);
  if (boost.type === "instant_tofu") next.shop.tofuStock = safeNonNegativeInteger(next.shop.tofuStock + boost.amount);
  if (boost.type === "instant_orders") next.shop.deliveryOrders = safeNonNegativeInteger(next.shop.deliveryOrders + boost.amount);
  if (boost.multiplier) {
    const expiresAt = new Date(Date.now() + boost.durationSeconds * 1000).toISOString();
    next.shop.activeFestivalBoosts = normalizeShopBoosts([
      { id: boost.id, label: boost.name, multiplier: boost.multiplier, expiresAt, source: "shop_spirit" },
      ...next.shop.activeFestivalBoosts,
    ]);
  }
  next = addLedgerEntry(next, "boost", `${boost.name} used while parked.`);
  return { ok: true, gameState: next, boost };
}

function useFestivalBoost(boostId, gameState) {
  let next = normalizeGameState(gameState);
  const boost = FESTIVAL_BOOSTS.find((item) => item.id === boostId);
  if (!boost) return { ok: false, reason: "Festival Boost unavailable.", gameState: next };
  if (next.shop.festivalBoosts[boost.id] < 1) return { ok: false, reason: "No Festival Boost token ready.", gameState: next };
  next.shop.festivalBoosts[boost.id] = safeNonNegativeInteger(next.shop.festivalBoosts[boost.id] - 1);
  const multiplier = boost.type === "press_multiplier" || boost.type === "prep_multiplier" ? 1.75 : 1.5;
  const expiresAt = new Date(Date.now() + 20 * 60 * 1000).toISOString();
  next.shop.activeFestivalBoosts = normalizeShopBoosts([
    { id: boost.id, label: boost.name, multiplier, expiresAt, source: "festival_boost" },
    ...next.shop.activeFestivalBoosts,
  ]);
  if (!next.stamps.first_festival_boost) {
    next.stamps.first_festival_boost = { date: new Date().toISOString(), label: STAMP_LABELS.first_festival_boost };
  }
  next = addLedgerEntry(next, "festival", `${boost.name} used while parked.`);
  return { ok: true, gameState: next, boost };
}

function licenseExamStatus(gameState) {
  const state = normalizeGameState(gameState);
  const passport = deliveryPassportSummary(state);
  const routeMastered = Object.values(state.shop.routes).some((route) => route.mastery >= 50);
  const requirements = [
    { label: "Level 10", met: state.level >= 10 },
    { label: "25 shop orders or route completions", met: state.shop.lifetimeDeliveryOrders + state.shop.lifetimeRoutesCompleted >= 25 },
    { label: "5 passport stamps", met: passport.total >= 5 },
    { label: "Shop Level 5", met: state.shop.shopLevel >= 5 },
    { label: "One fictional route partly mastered", met: routeMastered },
  ];
  return { ready: requirements.every((item) => item.met), requirements };
}

function takeLicenseExam(gameState, options = {}) {
  let next = normalizeGameState(gameState);
  const status = licenseExamStatus(next);
  if (!options.confirmed) return { ok: false, reason: "Confirm License Exam before resetting shop progress.", gameState: next, status };
  if (!status.ready) return { ok: false, reason: "License Exam requirements are not complete.", gameState: next, status };
  const starsEarned = clamp(1 + Math.floor(next.shop.shopLevel / 10), 1, 3);
  const preserved = {
    licenseStars: next.shop.licenseStars + starsEarned,
    licensePerks: next.shop.licensePerks,
    lifetimeLicenseExams: next.shop.lifetimeLicenseExams + 1,
    lifetimeTips: next.shop.lifetimeTips,
    lifetimeDeliveryOrders: next.shop.lifetimeDeliveryOrders,
    lifetimeRoutesCompleted: next.shop.lifetimeRoutesCompleted,
    lifetimeReputation: next.shop.lifetimeReputation,
  };
  const fresh = defaultShopState();
  fresh.licenseStars = preserved.licenseStars;
  fresh.licensePerks = preserved.licensePerks;
  fresh.lifetimeLicenseExams = preserved.lifetimeLicenseExams;
  fresh.lifetimeTips = preserved.lifetimeTips;
  fresh.lifetimeDeliveryOrders = preserved.lifetimeDeliveryOrders;
  fresh.lifetimeRoutesCompleted = preserved.lifetimeRoutesCompleted;
  fresh.lifetimeReputation = preserved.lifetimeReputation;
  fresh.stations.tofu_press += safeNonNegativeInteger(fresh.licensePerks.starter_press, 0, 20);
  if (fresh.licensePerks.starter_counter > 0) fresh.stations.prep_counter = 1;
  next.shop = normalizeShopState(fresh);
  next.stamps.first_license_exam = next.stamps.first_license_exam || {
    date: new Date().toISOString(),
    label: STAMP_LABELS.first_license_exam,
  };
  next = addLedgerEntry(next, "license", `Local Delivery License passed. Earned ${starsEarned} License Star${starsEarned > 1 ? "s" : ""}.`);
  return { ok: true, gameState: next, starsEarned };
}

function buyLicensePerk(perkId, gameState) {
  let next = normalizeGameState(gameState);
  const perk = LICENSE_PERKS.find((item) => item.id === perkId);
  if (!perk) return { ok: false, reason: "License Perk unavailable.", gameState: next };
  if (next.shop.licenseStars < perk.costStars) return { ok: false, reason: "Not enough License Stars.", gameState: next };
  next.shop.licenseStars = safeNonNegativeInteger(next.shop.licenseStars - perk.costStars);
  next.shop.licensePerks[perk.id] = safeNonNegativeInteger(next.shop.licensePerks[perk.id] + 1, 0, 20);
  next = addLedgerEntry(next, "license", `${perk.name} purchased.`);
  return { ok: true, gameState: next, perk };
}

function startRivalChallenge(rivalId, gameState) {
  let next = normalizeGameState(gameState);
  const rival = RIVAL_CHALLENGES.find((item) => item.id === rivalId);
  if (!rival) return { ok: false, reason: "Rival Shop Challenge unavailable.", gameState: next };
  if (next.shop.deliveryOrders < rival.orderCost) return { ok: false, reason: "Not enough Delivery Orders.", gameState: next };
  if (next.shop.shopSpirit < rival.spiritCost) return { ok: false, reason: "Not enough Shop Spirit.", gameState: next };
  next.shop.deliveryOrders = safeNonNegativeInteger(next.shop.deliveryOrders - rival.orderCost);
  next.shop.shopSpirit = safeNonNegativeNumber(next.shop.shopSpirit - rival.spiritCost);
  next.shop.tips = safeNonNegativeInteger(next.shop.tips + rival.tipsReward);
  next.shop.reputation = safeNonNegativeInteger(next.shop.reputation + rival.reputationReward);
  next.shop.rivals[rival.id] = safeNonNegativeInteger(next.shop.rivals[rival.id] + 1);
  next.stamps[rival.stampId] = next.stamps[rival.stampId] || {
    date: new Date().toISOString(),
    label: STAMP_LABELS[rival.stampId] || rival.name,
  };
  next = addLedgerEntry(next, "rival", `${rival.name} friendly challenge complete.`);
  return { ok: true, gameState: next, rival };
}

function unlockAllLocalQa(gameState) {
  let next = normalizeGameState(gameState);
  next.shop.tips = 50000;
  next.shop.tofuStock = 5000;
  next.shop.deliveryOrders = 500;
  next.shop.reputation = 2000;
  next.shop.shopLevel = getShopLevel(next.shop.reputation);
  next.shop.prepSlots = getPrepSlotMax(next.shop);
  next.shop.shopSpirit = getShopSpiritMax(next.shop);
  next.shop.shopReach = 100;
  next.shop.routeKnowledge = 100;
  next.shop.licenseStars = 10;
  next.shop.untrustedLocalQa = true;
  SHOP_STATIONS.forEach((station) => { next.shop.stations[station.id] = Math.max(next.shop.stations[station.id] || 0, 5); });
  SHOP_ROUTE_CATALOG.forEach((route) => { next.shop.routes[route.id].mastery = 50; });
  CHARACTER_CATALOG.forEach((character) => {
    if (!next.collection.unlockedCharacterIds.includes(character.id)) next.collection.unlockedCharacterIds.push(character.id);
  });
  SOUND_PACK_CATALOG.forEach((sound) => {
    if (!next.collection.unlockedSoundPackIds.includes(sound.id)) next.collection.unlockedSoundPackIds.push(sound.id);
  });
  Object.keys(STAMP_LABELS).forEach((stampId) => {
    next.stamps[stampId] = next.stamps[stampId] || { date: new Date().toISOString(), label: STAMP_LABELS[stampId] };
  });
  next = addLedgerEntry(next, "dev", "Developer QA unlock applied. Local state is not trusted for certified merch.");
  return { ok: true, gameState: next };
}

function isDevToolsEnabled() {
  if (typeof window !== "undefined" && window.location && /\bdev=1\b/.test(window.location.search || "")) return true;
  const storage = safeLocalStorage();
  return Boolean(storage && storage.getItem(DEV_TOOLS_LOCAL_STORAGE_KEY) === "true");
}

function applyDeliveryToShop(sessionSummary, rewardSummary, gameState) {
  let next = normalizeGameState(gameState);
  const session = sessionSummary || {};
  const rewards = rewardSummary || {};
  const cargo = calculateCargoCondition(session);
  const qualified = isQualifiedSession(session);
  const trustedQualified = qualified && !session.simulated;
  const validPractice = isValidPracticeSession(session);
  const dailyComplete = Boolean(rewards.dailyComplete || session.dailyDeliveryComplete);
  const perfectPour = qualified && cargo >= 100;
  const xpMultiplier = Number(rewards.xpMultiplier || 1);
  const extraSessionMultiplier = qualified && xpMultiplier < 1 ? 0.5 : 1;
  const betterBoxes = safeNonNegativeInteger(next.shop.upgrades.better_boxes, 0, 4);
  const shopSign = safeNonNegativeInteger(next.shop.upgrades.shop_sign, 0, 4);

  let tofuStockGained = qualified
    ? Math.floor(cargo)
    : validPractice
      ? Math.min(18, Math.floor(cargo / 6))
      : 0;
  if (qualified) tofuStockGained += 20;
  if (dailyComplete) tofuStockGained += 15;
  if (perfectPour) tofuStockGained += 50;
  tofuStockGained += Math.floor(tofuStockGained * 0.08 * betterBoxes);
  tofuStockGained = Math.max(0, Math.round(tofuStockGained * extraSessionMultiplier));

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

  let tipsGained = validPractice ? 2 : 0;
  const certifiedBoost = {
    applied: false,
    tofuStockGained: 0,
    reputationGained: 0,
    tipsGained: 0,
    pressBoostPercent: 0,
    expiresAt: "",
    label: "No certified boost",
  };
  if (trustedQualified && cargo >= 85) {
    const sessionMs = Date.parse(session.date || "");
    const boostStartMs = Number.isFinite(sessionMs) ? sessionMs : Date.now();
    certifiedBoost.applied = true;
    certifiedBoost.tofuStockGained = Math.round(100 * extraSessionMultiplier);
    certifiedBoost.reputationGained = Math.round(25 * extraSessionMultiplier);
    certifiedBoost.tipsGained = Math.round(20 * extraSessionMultiplier);
    certifiedBoost.pressBoostPercent = 20;
    certifiedBoost.expiresAt = new Date(
      boostStartMs + CERTIFIED_BOOST_HOURS * 3600000,
    ).toISOString();
    certifiedBoost.label = "Certified Smooth Delivery";
    tofuStockGained += certifiedBoost.tofuStockGained;
    reputationGained += certifiedBoost.reputationGained;
    tipsGained += certifiedBoost.tipsGained;
  }

  const previousShopLevel = next.shop.shopLevel;
  next.shop.tofuStock = safeNonNegativeInteger(next.shop.tofuStock + tofuStockGained);
  next.shop.tips = safeNonNegativeInteger(next.shop.tips + tipsGained);
  next.shop.lifetimeTips = safeNonNegativeInteger(next.shop.lifetimeTips + tipsGained);
  next.shop.reputation = safeNonNegativeInteger(next.shop.reputation + reputationGained);
  next.shop.lifetimeReputation = safeNonNegativeInteger(
    next.shop.lifetimeReputation + reputationGained,
  );
  next.shop.shopLevel = getShopLevel(next.shop.reputation);
  if (certifiedBoost.applied) {
    next.shop.activeBoosts = normalizeShopBoosts([
      {
        id: "certified_smooth_delivery",
        label: "Certified Smooth Delivery",
        multiplier: CERTIFIED_BOOST_PRESS_MULTIPLIER,
        expiresAt: certifiedBoost.expiresAt,
        source: "qualified_cup_test",
      },
      ...(next.shop.activeBoosts || []),
    ]);
  }
  syncShopGenerators(next);
  next.shop.lastShopTickAt = next.shop.lastShopTickAt || new Date().toISOString();

  return {
    gameState: next,
    tofuStockGained,
    tipsGained,
    reputationGained,
    certifiedBoost,
    shopLevelBefore: previousShopLevel,
    shopLevelAfter: next.shop.shopLevel,
    shopLevelChanged: next.shop.shopLevel > previousShopLevel,
  };
}

function sanitizeShopStateForExport(gameState) {
  return normalizeShopState(gameState && gameState.shop);
}

function getSimulatorScenarios() {
  return SIMULATOR_SCENARIOS.map((scenario) => ({ ...scenario }));
}

function simulatorScenarioById(scenarioId) {
  return SIMULATOR_SCENARIOS.find((scenario) => scenario.id === scenarioId)
    || SIMULATOR_SCENARIOS[0];
}

function buildSimulatedSessionSummary(scenarioId, now = new Date(), options = {}) {
  const scenario = simulatorScenarioById(scenarioId);
  const createdAt = now instanceof Date ? now.toISOString() : new Date(now).toISOString();
  const cargo = cargoProfileById(scenario.cargoProfileId);
  const waterLeft = clamp(roundTo(scenario.cargoCondition, 1), 0, 100);
  const harshInputCount =
    Number(scenario.harshBraking || 0)
    + Number(scenario.harshAcceleration || 0)
    + Number(scenario.harshLateral || 0)
    + Number(scenario.abruptTransitions || 0);
  const summary = {
    simulated: true,
    simulatorScenarioId: scenario.id,
    simulatorScenarioName: scenario.name,
    simulatorExcludeMerch: options.excludeMerch !== false,
    createdAt,
    date: createdAt,
    mode: "simulated",
    difficulty: "standard",
    difficultyLabel: DIFFICULTIES.standard.label,
    thresholdG: DIFFICULTIES.standard.thresholdG,
    waterLeft,
    waterSpilled: roundTo(100 - waterLeft, 1),
    cargoCondition: waterLeft,
    rank: rankForWater(waterLeft),
    qualificationStatus: scenario.qualificationStatus,
    qualificationLabel: scenario.qualificationStatus === "qualified" ? "Qualified" : "Practice Only",
    qualificationMessage: "Simulated delivery result for local testing.",
    qualificationReasons: [],
    routeType: scenario.routeType,
    routeDifficultyLabel: scenario.routeType,
    durationSeconds: scenario.durationSeconds,
    distanceMiles: scenario.distanceMiles,
    harshInputCount,
    harshBraking: scenario.harshBraking,
    harshAcceleration: scenario.harshAcceleration,
    harshLateral: scenario.harshLateral,
    lateralJerk: scenario.lateralJerk,
    abruptTransitions: scenario.abruptTransitions,
    turnDensityScore: scenario.turnDensityScore,
    curvatureScore: scenario.curvatureScore,
    routeDifficultyScore: scenario.routeDifficultyScore,
    significantTurnCount: Math.round(Number(scenario.turnDensityScore || 0) * 12),
    significantTurnsPerMile: roundTo(Number(scenario.turnDensityScore || 0) * 8, 1),
    headingChangePerMile: Math.round(Number(scenario.curvatureScore || 0) * 240),
    dailyDeliveryId: cargo.id,
    dailyCargo: cargo.cargo,
    simulatedCargoProfileId: cargo.id,
    unlockedBadges: [],
    stamps: [],
  };
  summary.rank = displayRankForSession(summary);
  return summary;
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
  const validSession = isQualifiedSession(session) || isValidPracticeSession(session);
  const stamps = next.stamps || {};
  const newCharacterUnlocks = [];
  const newSoundUnlocks = [];

  if (stamps.first_delivery || (validSession && completedDeliveries >= 1)) {
    unlockCollectionId(next.collection, "character", "angry_tofu_driver", newCharacterUnlocks);
  }
  if (next.shop.shopLevel >= 2) {
    unlockCollectionId(next.collection, "character", "sleepy_dispatcher", newCharacterUnlocks);
  }
  if (isQualifiedSession(session) && dailyDelivery.id === "hot_tea" && cargo >= 90) {
    unlockCollectionId(next.collection, "character", "tea_master", newCharacterUnlocks);
  }
  if (stamps.perfect_pour || (isQualifiedSession(session) && cargo >= 100)) {
    unlockCollectionId(next.collection, "character", "perfect_pour_courier", newCharacterUnlocks);
  }

  unlockCollectionId(next.collection, "sound", "default", newSoundUnlocks);
  if (next.shop.shopLevel >= 2) {
    unlockCollectionId(next.collection, "sound", "tofu_shop_bell", newSoundUnlocks);
  }
  if (Object.keys(stamps).length >= 1 || (validSession && completedDeliveries >= 3)) {
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
  if (isQualifiedSession(session) && missionComplete && cargo >= 85) {
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
  const dailyDelivery = session && session.simulated && session.dailyDeliveryId
    ? { ...cargoProfileById(session.dailyDeliveryId), dateKey }
    : getDailyDelivery(dateKey);
  const routeType = classifyRouteType(session);
  const cargoCondition = calculateCargoCondition(session);
  const enrichedSession = {
    ...session,
    routeType,
    cargoCondition,
    dailyDeliveryId: dailyDelivery.id,
    dailyCargo: dailyDelivery.cargo,
  };
  enrichedSession.rank = displayRankForSession(enrichedSession);
  const qualified = isQualifiedSession(enrichedSession);
  const validPractice = isValidPracticeSession(enrichedSession);
  const dailyEligible = qualified || isDailyEligiblePracticeSession(enrichedSession);
  const majorPracticeStampEligible =
    validPractice && Number(enrichedSession.durationSeconds || 0) >= PRACTICE_DAILY_MIN_SECONDS;
  const dailyComplete = dailyEligible && evaluateDailyDelivery(dailyDelivery, enrichedSession);
  const driverXP = calculateDriverXP(enrichedSession, state, dailyComplete);
  const skillXP = awardSkillXP(enrichedSession);
  const stamps = [];
  const addStamp = (id) => {
    if (!state.stamps[id] && !stamps.includes(id)) stamps.push(id);
  };

  if (qualified || validPractice) addStamp("first_delivery");
  if (dailyComplete) addStamp("daily_delivery_complete");
  if ((qualified || majorPracticeStampEligible) && cargoCondition >= 95) addStamp("cup_stayed_full");
  if (qualified && cargoCondition >= 90 && Number(session.durationSeconds || 0) >= 600) {
    addStamp("smooth_commute");
  }
  if (qualified && routeType === "Calm Cruise" && cargoCondition >= 90) addStamp("calm_cruise");
  if (
    qualified
    && routeType === "City Delivery"
    && cargoCondition >= 85
    && Number(session.harshBraking || 0) <= 1
    && Number(session.harshAcceleration || 0) <= 1
  ) {
    addStamp("city_smooth");
  }
  if (qualified && routeType === "Long Haul" && cargoCondition >= 85) addStamp("long_haul_pour");
  if (qualified && ["Mixed Route", "Technical Route"].includes(routeType) && cargoCondition >= 90) {
    addStamp("curve_control");
  }
  if (qualified && routeType === "Technical Route" && cargoCondition >= 90) addStamp("technical_pour");
  if ((qualified || majorPracticeStampEligible) && Number(session.harshInputCount || 0) <= 1) {
    addStamp("no_panic_inputs");
  }
  if (
    (qualified || majorPracticeStampEligible)
    && cargoCondition >= 90
    && Number(session.harshBraking || 0) <= 1
    && Number(session.harshAcceleration || 0) <= 1
    && Number(session.lateralJerk || 0) <= 2
  ) {
    addStamp("passenger_approved");
  }
  if (qualified && cargoCondition >= 100) addStamp("perfect_pour");

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
  nextState.merchProgress = session.simulated && session.simulatorExcludeMerch
    ? nextState.merchProgress
    : updateMerchProgress(enrichedSession, nextState, dailyComplete);
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
    tipsGained: shop.tipsGained,
    reputationGained: shop.reputationGained,
    certifiedBoost: shop.certifiedBoost,
    simulated: Boolean(session.simulated),
    simulatorScenarioId: session.simulatorScenarioId || "",
  };
  nextState.recentRewards = [rewardEntry, ...nextState.recentRewards].slice(0, 12);
  nextState.recentSessions = [{
    date: session.date,
    dateKey,
    mode: session.mode,
    qualificationStatus: session.qualificationStatus,
    cargoCondition,
    routeType,
    rank: enrichedSession.rank,
    xpGained: driverXP.xpGained,
    xpMultiplier: driverXP.xpMultiplier,
    simulated: Boolean(session.simulated),
    simulatorScenarioId: session.simulatorScenarioId || "",
    simulatorExcludeMerch: Boolean(session.simulatorExcludeMerch),
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

function applySimulatedDelivery(scenarioId, gameState = defaultGameState(), options = {}) {
  const summary = buildSimulatedSessionSummary(
    scenarioId,
    options.now || new Date(),
    { excludeMerch: options.excludeMerch !== false },
  );
  const rewards = calculateDeliveryRewards(summary, gameState);
  summary.cargoCondition = rewards.cargoCondition;
  summary.routeType = rewards.routeType;
  summary.rank = displayRankForSession(summary);
  summary.dailyDeliveryComplete = rewards.dailyComplete;
  summary.deliveryStamps = rewards.stamps;
  summary.stamps = rewards.stamps;
  summary.deliveryRewards = rewards;
  return {
    summary,
    rewards,
    gameState: rewards.gameState,
  };
}

function buildDeliverySharePayload(session, rewardSummary = null, gameState = null) {
  const routeType = session.routeType || classifyRouteType(session);
  const cargoCondition = calculateCargoCondition(session);
  const qualified = isQualifiedSession(session);
  const state = gameState || (rewardSummary && rewardSummary.gameState) || null;
  const normalized = state ? normalizeGameState(state) : null;
  const level = normalized ? normalized.level : null;
  const crew = normalized ? selectedCharacter(normalized) : null;
  const stamp = Array.isArray(session.deliveryStamps) && session.deliveryStamps.length
    ? stampLabels([session.deliveryStamps[0]])[0]
    : bestUnlockedMilestone(session);
  return {
    title: APP_BRAND,
    status: session.simulated
      ? (qualified ? "Simulated Delivery" : "Simulated Practice Delivery")
      : (qualified ? "Delivery Complete" : "Practice Delivery"),
    cargoCondition: formatPercent(cargoCondition),
    rank: displayRankForSession(session),
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
  const roundedDurationSeconds = Math.round(durationSeconds);
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
        label: roundedDurationSeconds < PRACTICE_VALID_MIN_SECONDS ? "Short Practice" : "Practice Only",
        message: roundedDurationSeconds < PRACTICE_VALID_MIN_SECONDS
          ? "Practice saved. Complete a longer delivery to earn stamps and shop progress."
          : "Practice score complete. Basic Mode used motion sensors only.",
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
    durationSeconds: roundedDurationSeconds,
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
  summary.rank = displayRankForSession(summary);
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
  renderSimulatorPanel();
  renderSurfaceNavigation();
}

function surfaceFromHash(hashValue = "") {
  const value = String(hashValue || "").replace(/^#\/?/, "").toLowerCase();
  if (value === "shop") return "shop";
  if (value === "crew") return "crew";
  return "cup-test";
}

function surfaceHash(surface) {
  if (surface === "crew") return "#/crew";
  return surface === "cup-test" ? "#/cup-test" : "#/shop";
}

function renderSurfaceNavigation(gameState = null) {
  const activeDrive = appState.running || appState.calibrating;
  const state = gameState ? normalizeGameState(gameState) : currentGameState();
  const reveal = progressiveRevealState(state);
  if (elements.surfaceNavButtons) {
    elements.surfaceNavButtons.forEach((button) => {
      const active = button.dataset.surfaceTarget === appState.surface;
      const crewNav = button.dataset.surfaceTarget === "crew";
      if (crewNav && button.classList) {
        button.classList.toggle("is-hidden", !reveal.crew && !reveal.sounds && appState.surface !== "crew");
      }
      button.classList.toggle("is-active", active);
      if (active) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
      button.disabled = activeDrive;
    });
  }
}

function renderBrandShelf() {
  const shopSurface = appState.surface === "shop";
  const crewSurface = appState.surface === "crew";
  if (elements.brandShelfEyebrow) {
    elements.brandShelfEyebrow.textContent = crewSurface
      ? "Delivery Crew"
      : shopSurface
        ? "Tofu Shop"
        : "Certified Challenge";
  }
  if (elements.landingTitle) {
    elements.landingTitle.textContent = crewSurface
      ? "Delivery Crew"
      : shopSurface
        ? "Run the Tofu Shop"
        : "Don't Spill the Cup";
  }
  if (elements.brandShelfCopy) {
    elements.brandShelfCopy.textContent = shopSurface
      ? "A cozy delivery-management game you can play at home."
      : crewSurface
        ? "Choose your local crew, characters, and gentle sound packs while parked."
        : "Keep the cup steady. Drive smoothly. Boost the Tofu Shop.";
  }
  if (elements.brandShelfSafety) {
    elements.brandShelfSafety.textContent = shopSurface
      ? "Play the shop anytime. Take Don't Spill the Cup when you're ready for a certified smooth-delivery boost."
      : crewSurface
        ? "Crew and sound choices never change real-world driving score."
        : "Start while parked. Basic Mode uses motion only; Qualified Run is opt-in.";
  }
  if (elements.brandPrimaryCta) {
    elements.brandPrimaryCta.textContent = crewSurface
      ? "Go to Tofu Shop"
      : shopSurface
        ? "Continue the Shop"
        : "Take the Cup Test";
    elements.brandPrimaryCta.dataset.brandAction = crewSurface ? "shop" : shopSurface ? "shop" : "cup-test";
  }
  if (elements.brandSecondaryCta) {
    elements.brandSecondaryCta.textContent = crewSurface
      ? "Take Don't Spill the Cup"
      : shopSurface
        ? "Take Don't Spill the Cup"
        : "Go to Tofu Shop";
    elements.brandSecondaryCta.dataset.brandAction = crewSurface || shopSurface ? "cup-test" : "shop";
  }
}

function setAppSurface(surface = "cup-test", options = {}) {
  const nextSurface = surface === "cup-test" || surface === "crew" ? surface : "shop";
  appState.surface = nextSurface;
  if (elements.surfaceSections) {
    elements.surfaceSections.forEach((section) => {
      const sectionSurface = section.dataset.appSurface || "shop";
      section.classList.toggle("is-hidden", sectionSurface !== nextSurface);
    });
  }
  if (elements.setupFlow) {
    elements.setupFlow.classList.toggle("is-hidden", nextSurface !== "cup-test");
  }
  renderSurfaceNavigation();
  renderBrandShelf();
  if (
    options.updateHash !== false
    && typeof window !== "undefined"
    && window.location
    && window.location.hash !== surfaceHash(nextSurface)
  ) {
    window.location.hash = surfaceHash(nextSurface);
  }
  if (options.scroll && elements.landingView && typeof elements.landingView.scrollIntoView === "function") {
    elements.landingView.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function initializeAppSurface() {
  const hasHash = typeof window !== "undefined"
    && window.location
    && Boolean(window.location.hash);
  const initialSurface = hasHash
    ? surfaceFromHash(window.location.hash)
    : "cup-test";
  setAppSurface(initialSurface, { updateHash: hasHash ? false : true });
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
  const nextUpgrade = visibleStationUpgrades(state).find(
    (upgrade) => safeNonNegativeInteger(state.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel)
      < upgrade.maxLevel,
  );
  if (!nextUpgrade) return "Complete a delivery to build the shop.";
  const currentLevel = safeNonNegativeInteger(
    state.shop.stationUpgrades[nextUpgrade.id],
    0,
    nextUpgrade.maxLevel,
  );
  const cost = stationUpgradeCostTips(nextUpgrade, currentLevel);
  return `${nextUpgrade.name}: ${cost} Tips`;
}

function affordableShopUpgrade(gameState) {
  const state = normalizeGameState(gameState);
  return visibleStationUpgrades(state).find((upgrade) => {
    const currentLevel = safeNonNegativeInteger(state.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel);
    if (currentLevel >= upgrade.maxLevel) return false;
    const station = shopStationById(upgrade.stationId);
    if (!station || !stationIsUnlocked(station, state)) return false;
    const cost = stationUpgradeCostTips(upgrade, currentLevel);
    return state.shop.tips >= cost;
  }) || null;
}

function nextBestAction(gameState, options = {}) {
  const state = normalizeGameState(gameState);
  const activeDrive = Boolean(options.activeDrive);
  const mission = getDailyDelivery(options.date || new Date());
  const daily = state.dailyDeliveries[mission.dateKey];
  const dailyComplete = Boolean(daily && daily.completed);
  const shopUnlocked = isShopDiscovered(state);
  const shopActionStarted = Number(state.shop.lifetimeTofuPacked || 0) > 0
    || Number(state.shop.lifetimeDeliveryOrders || 0) > 0
    || Number(state.shop.lifetimeTips || 0) > 0
    || Number(state.shop.tips || 0) > 0;
  const lowTofuStock = Number(state.shop.tofuStock || 0) < 10;
  const upgrade = affordableShopUpgrade(state);
  if (activeDrive) {
    return {
      type: "active_drive",
      title: "Cup Test in Progress",
      copy: "Keep your eyes on the road. Shop actions unlock after you finish and park.",
      buttonLabel: "Driving",
      disabled: true,
    };
  }
  if (shopUnlocked && Number(state.shop.deliveryOrders || 0) > 0) {
    const orderCount = Math.floor(Number(state.shop.deliveryOrders || 0));
    const multipleOrders = orderCount > 1;
    return {
      type: "fulfill_shop_order",
      title: multipleOrders ? "Next: Fulfill Max Orders" : "Next: Fulfill Shop Order",
      copy: "You have prepared orders ready. Hand them off to earn Tips for stations and upgrades.",
      buttonLabel: multipleOrders ? "Fulfill Max Orders" : "Fulfill Shop Order",
      orderQuantity: multipleOrders ? "max" : "1",
      disabled: false,
    };
  }
  if (!shopActionStarted) {
    return {
      type: "start_shop",
      title: "Next: Start the Tofu Shop",
      copy: "Pack your first order at home, then take the Cup Test when you're ready for a certified boost.",
      buttonLabel: "Start the Shop",
      disabled: false,
    };
  }
  if (shopUnlocked && lowTofuStock) {
    return {
      type: "pack_tofu",
      title: "Next: Pack Tofu",
      copy: "Tofu Stock is low. Pack a few blocks or let the Tofu Press work.",
      buttonLabel: "Pack Tofu",
      disabled: false,
    };
  }
  if (upgrade) {
    return {
      type: "buy_upgrade",
      title: "Next: Buy an Upgrade",
      copy: "Upgrade the shop to improve parked production.",
      buttonLabel: "View Upgrades",
      disabled: false,
      upgradeId: upgrade.id,
    };
  }
  if (!dailyComplete) {
    return {
      type: "cup_test",
      title: "Next: Certified Cup Test",
      copy: "Take the Cup Test when you're parked and ready for a certified smooth-delivery boost.",
      buttonLabel: "Take the Cup Test",
      disabled: false,
    };
  }
  return {
    type: "continue_shop",
    title: "Next: Continue the Shop",
    copy: "Let the press work, fulfill prepared orders, or take the Cup Test for certified progress.",
    buttonLabel: "View Tofu Shop",
    disabled: false,
  };
}

function renderGameDashboard(gameState = loadGameState()) {
  const state = normalizeGameState(gameState);
  const reveal = progressiveRevealState(state);
  const mission = getDailyDelivery(new Date());
  const action = nextBestAction(state, {
    activeDrive: appState.running || appState.calibrating,
    date: new Date(),
  });
  const progress = levelProgress(state.totalXP);
  const passport = deliveryPassportSummary(state);
  const daily = state.dailyDeliveries[mission.dateKey];
  const gear = state.merchProgress.nospillClubGear;
  if (elements.gameDailyTitle) elements.gameDailyTitle.textContent = mission.cargo;
  if (elements.gameDailyFlavor) {
    elements.gameDailyFlavor.textContent = mission.description;
  }
  if (elements.gameDailyCargo) elements.gameDailyCargo.textContent = mission.cargo;
  if (elements.gameDailyGoal) elements.gameDailyGoal.textContent = mission.goal;
  if (elements.gameDailyReward) elements.gameDailyReward.textContent = mission.reward;
  if (elements.gameNextActionTitle) elements.gameNextActionTitle.textContent = action.title;
  if (elements.gameNextActionCopy) elements.gameNextActionCopy.textContent = action.copy;
  if (elements.gameCtaButton) {
    elements.gameCtaButton.textContent = action.buttonLabel;
    elements.gameCtaButton.disabled = Boolean(action.disabled);
    if (elements.gameCtaButton.dataset) {
      elements.gameCtaButton.dataset.nextAction = action.type;
      elements.gameCtaButton.dataset.nextUpgrade = action.upgradeId || "";
      elements.gameCtaButton.dataset.nextOrderQuantity = action.orderQuantity || "";
    }
  }
  if (elements.gameCertifiedCtaButton) {
    const showCertified = action.type !== "cup_test" && action.type !== "active_drive";
    if (elements.gameCertifiedCtaButton.classList) {
      elements.gameCertifiedCtaButton.classList.toggle("is-hidden", !showCertified);
    }
    elements.gameCertifiedCtaButton.disabled = appState.running || appState.calibrating;
    elements.gameCertifiedCtaButton.textContent = "Take the Cup Test";
  }
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
  if (elements.gameTeaserGrid) {
    elements.gameTeaserGrid.classList.toggle("is-hidden", reveal.firstDelivery);
  }
  if (elements.gameShopStock) {
    elements.gameShopStock.textContent = reveal.shop
      ? formatShopBalance(state.shop.tofuStock, state.shop.generatorCarry && state.shop.generatorCarry.tofuStock)
      : "Locked";
  }
  if (elements.gameShopReputation) {
    elements.gameShopReputation.textContent = reveal.shop
      ? formatShopBalance(state.shop.reputation, state.shop.generatorCarry && state.shop.generatorCarry.reputation)
      : "Locked";
  }
  if (elements.gameShopLevel) {
    elements.gameShopLevel.textContent = reveal.shop ? `Level ${state.shop.shopLevel}` : "Quiet";
  }
  if (elements.gameShopTeaser) {
    elements.gameShopTeaser.textContent = reveal.shop
      ? nextShopStep(state)
      : "The press is warming up. Play at home, then use Cup Test runs for certified boosts.";
  }
  if (elements.gamePassportEmpty) {
    elements.gamePassportEmpty.textContent = reveal.passport
      ? `${passport.total}/${passport.totalAvailable} stamps collected.`
      : "The passport opens after your first stamp-worthy delivery.";
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
    elements.gamePackTofuButton.disabled = activeDrive || !reveal.shop;
    elements.gamePackTofuButton.textContent = activeDrive
      ? "Park First"
      : reveal.shop
        ? "Pack Tofu"
        : "Start the Shop";
  }
  if (elements.gameShopHelper) {
    elements.gameShopHelper.textContent = appState.running || appState.calibrating
      ? "Shop actions unlock after you finish and park."
      : reveal.shop
        ? "Shop Mode is for when you are parked. Do not interact while driving."
        : "The press is warming up. Play at home, then use Cup Test runs for certified boosts.";
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

function renderShopGeneratorCard(generatorId, gameState) {
  const state = normalizeGameState(gameState);
  const rates = getShopGeneratorRates(state);
  const activeDrive = appState.running || appState.calibrating;
  const stationId = generatorId === "tofuPress" ? "tofu_press" : "prep_counter";
  const station = shopStationById(stationId);
  const generator = state.shop.generators[generatorId] || { unlocked: false, level: 0 };
  const owned = station ? safeNonNegativeInteger(state.shop.stations[station.id], 0, 100000) : 0;
  const unlocked = Boolean(station && stationIsUnlocked(station, state) && generator.unlocked);
  const cost = station ? stationCost(station, owned) : 0;
  const disabledReason = stationPurchaseDisabledReason(station, state, cost, unlocked);
  const canBuy = Boolean(station && unlocked && !activeDrive && !disabledReason);
  const label = station ? station.name : generatorId === "tofuPress" ? "Tofu Press" : "Prep Counter";
  const rate = generatorId === "tofuPress"
    ? `+${formatShopRate(rates.tofuPressPerSecond)} tofu/sec`
    : `-${formatShopRate(rates.prepTofuPerSecond)} tofu/sec · +${formatShopRate(rates.prepOrdersPerSecond)} orders/sec`;
  const status = !unlocked
    ? "Locked"
    : generatorId === "prepCounter"
      ? rates.prepStatus
      : "Running";
  const helper = !unlocked
    ? generatorId === "prepCounter"
      ? "Unlocks with Tofu Stock 10 or Shop Level 2."
      : "The press is warming up. Start the shop while parked."
    : generatorId === "tofuPress"
      ? "Presses tofu for future orders."
      : "Turns Tofu Stock into Delivery Orders.";
  return `
    <div class="nospill-generator-item ${unlocked ? "" : "is-locked"}">
      <header>
        <strong>${escapeHtml(label)}</strong>
        <small>${escapeHtml(status)}</small>
      </header>
      <small>Owned: ${owned}</small>
      <small>${escapeHtml(rate)}</small>
      <small>${escapeHtml(helper)}</small>
      ${station ? `<small>Next: ${cost} Tips${station.prepSlotCost ? ` · ${station.prepSlotCost} Prep Slot` : ""}</small>` : ""}
      <div class="nospill-idle-actions">
        ${actionButton(`Buy ${label} · ${cost} Tips`, "data-shop-station", stationId, !canBuy, "nospill-secondary", disabledReason)}
        ${actionButton(`Buy Max ${label}`, "data-shop-station-max", stationId, !canBuy, "nospill-secondary", disabledReason)}
      </div>
    </div>
  `;
}

function renderStationUpgradeCard(upgrade, gameState) {
  const state = normalizeGameState(gameState);
  const level = safeNonNegativeInteger(state.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel);
  const cost = stationUpgradeCostTips(upgrade, level);
  const station = shopStationById(upgrade.stationId);
  const unlocked = Boolean(station && stationIsUnlocked(station, state) && stationUpgradeIsRevealed(upgrade, state));
  const disabledReason = stationUpgradeDisabledReason(upgrade, state, unlocked, cost, level);
  const canBuy = unlocked && level < upgrade.maxLevel && !disabledReason;
  const status = level >= upgrade.maxLevel ? "Maxed" : `${cost} Tips`;
  return renderIdleCard({
    title: `${upgrade.name} Lv ${level}`,
    status,
    copy: unlocked ? upgrade.effect : stationUpgradeRevealReason(upgrade, state),
    locked: !unlocked,
    actions: [actionButton(`Buy ${upgrade.name} · ${cost} Tips`, "data-station-upgrade", upgrade.id, !canBuy, "nospill-secondary", disabledReason)],
  });
}

function renderDeliveryWall(gameState = loadGameState()) {
  if (!elements.deliveryWallGrid) return;
  normalizeGameState(gameState);
  elements.deliveryWallGrid.innerHTML = "";
}

const SHOP_TABS = [
  { id: "overview", label: "Overview", unlock: () => true },
  { id: "production", label: "Production", unlock: () => true },
  { id: "orders", label: "Orders", unlock: () => true },
  { id: "routes", label: "Routes", unlock: (state) => state.shop.shopReach > 0 || state.shop.reputation >= 10 },
  { id: "training", label: "Training", unlock: (state) => fulfilledShopOrderCount(state) >= 10 || state.shop.cupStabilityXP > 0 },
  { id: "garage", label: "Garage", unlock: (state) => state.shop.shopReach > 0 || Object.values(state.shop.garage).some(Boolean) },
  { id: "crew", label: "Crew", unlock: (state) => state.shop.shopReach >= 2 || Object.values(state.shop.crew).some(Boolean) },
  { id: "spirit", label: "Shop Spirit", unlock: (state) => fulfilledShopOrderCount(state) >= 25 || state.shop.shopSpirit > 0 },
  { id: "upgrades", label: "Upgrades", unlock: (state) => hasFirstShopOrder(state) || visibleStationUpgrades(state).length > 0 },
  { id: "rivals", label: "Rivals", unlock: (state) => state.shop.reputation >= 10 || Object.values(state.shop.rivals).some(Boolean) },
  { id: "passport", label: "Passport", unlock: (state) => deliveryPassportSummary(state).total > 0 },
  { id: "license", label: "License", unlock: (state) => state.level >= 5 || state.shop.licenseStars > 0 },
  { id: "ledger", label: "Ledger", unlock: (state) => state.shop.ledger.length > 0 },
  { id: "settings", label: "Settings", unlock: () => true },
];

function activeShopTabForState(state) {
  const requested = appState.shopTab || state.shop.currentShopTab || "overview";
  const tab = SHOP_TABS.find((item) => item.id === requested);
  return tab && tab.unlock(state) ? requested : "overview";
}

function shopTabLockedCopy(tab) {
  const copy = {
    routes: "Fictional route cards unlock after the shop gains reach or reputation.",
    training: "Training Lot unlocks after the first few tips.",
    garage: "Garage upgrades unlock after the shop has enough tips.",
    crew: "Delivery Crew automation unlocks after the shop reaches new districts.",
    spirit: "Shop Spirit unlocks when reputation starts to spread.",
    rivals: "Rival Shop Challenges unlock after the shop has a little reputation.",
    passport: "The passport opens after your first stamp-worthy shop moment.",
    license: "License Exams appear after early shop progress.",
    ledger: "The Delivery Ledger fills as the shop does things.",
  };
  return copy[tab.id] || "Keep growing the Tofu Shop to unlock this panel.";
}

function renderShopTabs(state) {
  if (!elements.shopTabList || !elements.shopTabPanel) return;
  const activeTab = activeShopTabForState(state);
  appState.shopTab = activeTab;
  const visibleTabs = SHOP_TABS.filter((tab) => tab.unlock(state));
  elements.shopTabList.innerHTML = visibleTabs.map((tab) => {
    const unlocked = tab.unlock(state);
    return `
      <button
        type="button"
        data-shop-tab="${escapeHtml(tab.id)}"
        class="${tab.id === activeTab ? "is-active" : ""}"
        ${unlocked ? "" : "disabled"}
      >
        ${escapeHtml(tab.label)}
      </button>
    `;
  }).join("");
  elements.shopTabPanel.innerHTML = renderShopTabPanel(activeTab, state);
}

function renderShopTabPanel(tabId, state) {
  if (tabId === "production") return renderProductionPanel(state);
  if (tabId === "orders") return renderOrdersPanel(state);
  if (tabId === "routes") return renderRoutesPanel(state);
  if (tabId === "training") return renderTrainingPanel(state);
  if (tabId === "garage") return renderGaragePanel(state);
  if (tabId === "crew") return renderCrewPanel(state);
  if (tabId === "spirit") return renderSpiritPanel(state);
  if (tabId === "upgrades") return renderExpandedUpgradePanel(state);
  if (tabId === "rivals") return renderRivalsPanel(state);
  if (tabId === "passport") return renderPassportPanel(state);
  if (tabId === "license") return renderLicensePanel(state);
  if (tabId === "ledger") return renderLedgerPanel(state);
  if (tabId === "settings") return renderShopSettingsPanel(state);
  return renderOverviewPanel(state);
}

function renderIdleCard({ title, status, copy, actions = [], locked = false }) {
  return `
    <div class="nospill-idle-card ${locked ? "is-locked" : ""}">
      <header>
        <strong>${escapeHtml(title)}</strong>
        <small>${escapeHtml(status || "")}</small>
      </header>
      <small>${escapeHtml(copy || "")}</small>
      ${actions.length ? `<div class="nospill-idle-actions">${actions.join("")}</div>` : ""}
    </div>
  `;
}

function actionButton(label, attr, value, disabled = false, extraClass = "nospill-secondary", disabledReason = "") {
  const reason = disabled
    ? `<small class="nospill-action-reason">${escapeHtml(disabledReason || "Not enough resources or locked.")}</small>`
    : "";
  return `
    <span class="nospill-action-wrap">
      <button class="${extraClass}" type="button" ${attr}="${escapeHtml(value)}" ${disabled ? "disabled" : ""}>
        ${escapeHtml(label)}
      </button>
      ${reason}
    </span>
  `;
}

function renderOverviewPanel(state) {
  const rates = getShopGeneratorRates(state);
  const bottleneck = currentBottleneck(state);
  return `
    <h4>Overview</h4>
    <p class="nospill-panel-helper">Current Bottleneck: ${escapeHtml(bottleneck.label)}. ${escapeHtml(bottleneck.action)}</p>
    <p class="nospill-panel-helper">Tips come from fulfilled shop orders.</p>
    <div class="nospill-idle-grid">
      ${renderIdleCard({
        title: "Tofu Press",
        status: `+${formatShopRate(rates.tofuPressPerSecond)} tofu/sec`,
        copy: "The first station in the shop cascade.",
      })}
      ${renderIdleCard({
        title: "Prep Counter",
        status: state.shop.generators.prepCounter.unlocked ? `+${formatShopRate(rates.prepOrdersPerSecond)} orders/sec` : "Locked",
        copy: state.shop.generators.prepCounter.unlocked ? rates.prepStatus : "Unlocks with Tofu Stock 10 or Shop Level 2.",
      })}
      ${renderIdleCard({
        title: "Optional Certified Boost",
        status: "Don't Spill the Cup",
        copy: "Available when you want a smooth-driving bonus. It is not required for shop progress.",
        actions: [actionButton("Take Don't Spill the Cup", "data-surface-target", "cup-test", false)],
      })}
    </div>
  `;
}

function renderProductionPanel(state) {
  const visibleStations = SHOP_STATIONS.filter((station) => {
    if (station.id === "tofu_press" || station.id === "prep_counter") return true;
    if (station.id === "delivery_shelf") return fulfilledShopOrderCount(state) >= 10 || stationIsUnlocked(station, state) && state.shop.tips >= 50;
    if (station.id === "shop_sign") return state.shop.reputation >= 8 || state.shop.shopLevel >= 2 || state.shop.stations.shop_sign > 0;
    return stationIsUnlocked(station, state) && state.shop.stations[station.id] > 0;
  });
  return `
    <h4>Production</h4>
    <p class="nospill-panel-helper">Stations use Tips and Prep Slots. New stations appear when the core loop needs them.</p>
    <div class="nospill-idle-grid">
      ${visibleStations.map((station) => {
        const owned = safeNonNegativeInteger(state.shop.stations[station.id], 0, 100000);
        const unlocked = stationIsUnlocked(station, state);
        const cost = stationCost(station, owned);
        const canBuy = unlocked && state.shop.tips >= cost && state.shop.prepSlots >= station.prepSlotCost;
        const reason = stationPurchaseDisabledReason(station, state, cost, unlocked);
        return renderIdleCard({
          title: station.name,
          status: unlocked ? `${cost} tips · ${station.prepSlotCost} Prep Slot` : "Locked",
          copy: unlocked
            ? `Owned: ${owned}. ${station.description} Milestone x${stationMilestoneMultiplier(owned)}.`
            : station.unlock,
          locked: !unlocked,
          actions: [
            actionButton(`Buy ${station.name} · ${cost} Tips`, "data-shop-station", station.id, !canBuy, "nospill-secondary", reason),
            actionButton(`Buy Max ${station.name}`, "data-shop-station-max", station.id, !canBuy, "nospill-secondary", reason),
          ],
        });
      }).join("")}
    </div>
  `;
}

function renderOrdersPanel(state) {
  const canFulfill = state.shop.deliveryOrders > 0;
  const orderReason = canFulfill ? "" : "No Delivery Orders ready";
  const tenReason = state.shop.deliveryOrders < 10
    ? `Need ${10 - Math.floor(state.shop.deliveryOrders)} more Delivery Orders`
    : "";
  const maxOrders = Math.floor(state.shop.deliveryOrders);
  const showTen = state.shop.deliveryOrders >= 10;
  const showMax = maxOrders > 1;
  return `
    <h4>Orders</h4>
    <p class="nospill-panel-helper">Fulfill prepared shop orders to earn Tips. Tips buy stations and upgrades.</p>
    <div class="nospill-idle-grid">
      ${renderIdleCard({
        title: "Simple Tofu Box",
        status: `${state.shop.deliveryOrders} ready`,
        copy: canFulfill
          ? `Each order gives ${SHOP_ORDER_TIPS_REWARD} Tips, ${SHOP_ORDER_REPUTATION_REWARD} Reputation, and ${SHOP_ORDER_XP_REWARD} XP.`
          : "No Delivery Orders ready. Prep Counter needs tofu stock.",
        actions: [
          actionButton("Fulfill 1 Order", "data-fulfill-orders", "1", !canFulfill, "nospill-primary", orderReason),
          showTen ? actionButton("Fulfill 10 Orders", "data-fulfill-orders", "10", false) : "",
          showMax ? actionButton("Fulfill Max Orders", "data-fulfill-orders", "max", false, "nospill-primary") : "",
          !showTen && state.shop.deliveryOrders > 0 && state.shop.deliveryOrders < 10
            ? `<small class="nospill-action-reason">${escapeHtml(tenReason)}</small>`
            : "",
        ],
      })}
    </div>
  `;
}

function renderRoutesPanel(state) {
  return `
    <h4>Routes</h4>
    <p class="nospill-panel-helper">These are fictional route cards for parked shop play, not instructions for real roads.</p>
    <div class="nospill-idle-grid">
      ${SHOP_ROUTE_CATALOG.map((route) => {
        const routeState = state.shop.routes[route.id];
        const unlocked = routeIsUnlocked(route, state);
        const affordable = state.shop.tofuStock >= route.tofuCost && state.shop.deliveryOrders >= route.orderCost;
        return renderIdleCard({
          title: route.name,
          status: unlocked ? `Mastery ${routeState.mastery}%` : "Locked",
          copy: unlocked
            ? `${route.difficulty}. Costs ${route.tofuCost} tofu and ${route.orderCost} orders.`
            : route.unlock,
          locked: !unlocked,
          actions: [actionButton("Start Route Card", "data-shop-route", route.id, !unlocked || !affordable)],
        });
      }).join("")}
    </div>
  `;
}

function renderTrainingPanel(state) {
  return `
    <h4>Training</h4>
    <p class="nospill-panel-helper">Training is parked/home gameplay and affects fictional route confidence only.</p>
    <div class="nospill-idle-grid">
      ${TRAINING_DRILLS.map((drill) => renderIdleCard({
        title: drill.name,
        status: `${drill.costTips} tips`,
        copy: `Grants ${drill.cupStabilityXP} Cup Stability XP to ${SKILL_LABELS[drill.skill]}.`,
        actions: [actionButton("Run Drill", "data-training-drill", drill.id, state.shop.tips < drill.costTips)],
      })).join("")}
    </div>
  `;
}

function renderGaragePanel(state) {
  return `
    <h4>Garage</h4>
    <p class="nospill-panel-helper">Garage upgrades are fictional/cosmetic shop effects. They do not improve real Cup Test scoring.</p>
    <div class="nospill-idle-grid">
      ${GARAGE_UPGRADES.map((upgrade) => {
        const level = safeNonNegativeInteger(state.shop.garage[upgrade.id], 0, upgrade.maxLevel);
        const cost = Math.ceil(upgrade.costTips * Math.pow(1.25, level));
        return renderIdleCard({
          title: `${upgrade.name} Lv ${level}`,
          status: level >= upgrade.maxLevel ? "Maxed" : `${cost} tips`,
          copy: `${upgrade.effect}.`,
          actions: [actionButton("Upgrade Garage", "data-garage-upgrade", upgrade.id, level >= upgrade.maxLevel || state.shop.tips < cost)],
        });
      }).join("")}
    </div>
  `;
}

function renderCrewPanel(state) {
  return `
    <h4>Crew</h4>
    <p class="nospill-panel-helper">Crew automates fictional shop work only. It never asks for extra real driving.</p>
    <div class="nospill-idle-grid">
      ${CREW_ROLES.map((role) => {
        const owned = safeNonNegativeInteger(state.shop.crew[role.id], 0, 1000);
        const cost = Math.ceil(role.costTips * Math.pow(1.35, owned));
        return renderIdleCard({
          title: `${role.name} x${owned}`,
          status: `${cost} tips`,
          copy: `${role.effect} Unlock: ${role.unlock}.`,
          actions: [actionButton("Hire", "data-crew-role", role.id, state.shop.tips < cost)],
        });
      }).join("")}
    </div>
  `;
}

function renderSpiritPanel(state) {
  return `
    <h4>Shop Spirit</h4>
    <p class="nospill-panel-helper">Shop Spirit is a parked-only boost resource. It never affects real driving score.</p>
    <div class="nospill-idle-grid">
      ${SPIRIT_GENERATORS.map((generator) => {
        const owned = safeNonNegativeInteger(state.shop.spiritGenerators[generator.id], 0, 1000);
        const cost = Math.ceil(generator.costTips * Math.pow(1.22, owned));
        return renderIdleCard({
          title: `${generator.name} x${owned}`,
          status: `${cost} tips`,
          copy: `Generates ${formatShopRate(generator.spiritPerSecond * Math.max(1, owned || 1))} Shop Spirit/sec when owned. Unlock: ${generator.unlock}.`,
          actions: [actionButton("Buy", "data-spirit-generator", generator.id, state.shop.tips < cost)],
        });
      }).join("")}
      ${SHOP_SPIRIT_BOOSTS.map((boost) => renderIdleCard({
        title: boost.name,
        status: `${boost.costSpirit} Shop Spirit`,
        copy: boost.description,
        actions: [actionButton("Use Boost", "data-spirit-boost", boost.id, state.shop.shopSpirit < boost.costSpirit)],
      })).join("")}
      ${FESTIVAL_BOOSTS.map((boost) => renderIdleCard({
        title: boost.name,
        status: `${state.shop.festivalBoosts[boost.id] || 0} ready`,
        copy: "Consumable parked-only Festival Boost token.",
        actions: [actionButton("Use Festival Boost", "data-festival-boost", boost.id, !state.shop.festivalBoosts[boost.id])],
      })).join("")}
    </div>
  `;
}

function renderExpandedUpgradePanel(state) {
  const upgrades = visibleStationUpgrades(state);
  const firstUpgradeTeaser = renderIdleCard({
    title: "Steady Pressing",
    status: "Locked",
    copy: "Unlocks after first shop order.",
    locked: true,
  });
  return `
    <h4>Station Upgrades</h4>
    <p class="nospill-panel-helper">Station upgrades are separate modifiers. Stations are bought in Production; upgrades improve what owned stations do.</p>
    <div class="nospill-idle-grid">
      ${upgrades.length ? upgrades.map((upgrade) => renderStationUpgradeCard(upgrade, state)).join("") : firstUpgradeTeaser}
    </div>
  `;
}

function renderRivalsPanel(state) {
  return `
    <h4>Rival Shop Challenges</h4>
    <p class="nospill-panel-helper">Friendly parked-only shop showcases. No public road competition, speed, or combat framing.</p>
    <div class="nospill-idle-grid">
      ${RIVAL_CHALLENGES.map((rival) => {
        const unlocked = state.shop.reputation >= 10
          || state.shop.rivals[rival.id] > 0
          || (rival.id === "quiet_counter" && state.shop.reputation >= 10);
        const affordable = state.shop.deliveryOrders >= rival.orderCost && state.shop.shopSpirit >= rival.spiritCost;
        return renderIdleCard({
          title: rival.name,
          status: unlocked ? `${rival.orderCost} orders · ${rival.spiritCost} spirit` : "Locked",
          copy: unlocked
            ? `Friendly showcase reward: ${rival.tipsReward} tips and ${rival.reputationReward} reputation.`
            : rival.unlock,
          locked: !unlocked,
          actions: [actionButton("Start Rival Shop Challenge", "data-rival-challenge", rival.id, !unlocked || !affordable)],
        });
      }).join("")}
    </div>
  `;
}

function renderPassportPanel(state) {
  const stamps = Object.entries(STAMP_LABELS);
  return `
    <h4>Delivery Passport</h4>
    <p class="nospill-panel-helper">Stamps are local collectibles for shop, route, certified, style, secret, and license progress.</p>
    <div class="nospill-idle-grid">
      ${stamps.map(([id, label]) => renderIdleCard({
        title: label,
        status: state.stamps[id] ? "Unlocked" : "Locked",
        copy: state.stamps[id] ? "Stamped in your local passport." : "Keep growing the shop or earning certified smooth results.",
        locked: !state.stamps[id],
      })).join("")}
    </div>
  `;
}

function renderLicensePanel(state) {
  const exam = licenseExamStatus(state);
  return `
    <h4>License</h4>
    <p class="nospill-panel-helper">License Exams prestige fictional shop progress. Real driving is helpful but not required.</p>
    <div class="nospill-idle-grid">
      ${renderIdleCard({
        title: "Local Delivery License",
        status: exam.ready ? "Ready" : "Requirements",
        copy: exam.requirements.map((item) => `${item.met ? "Met" : "Need"}: ${item.label}`).join(" | "),
        actions: [actionButton("Take License Exam", "data-license-exam", "local_delivery", !exam.ready, "nospill-danger")],
      })}
      ${LICENSE_PERKS.map((perk) => renderIdleCard({
        title: perk.name,
        status: `${perk.costStars} License Star${perk.costStars > 1 ? "s" : ""}`,
        copy: `${perk.effect} Owned ${state.shop.licensePerks[perk.id] || 0}.`,
        actions: [actionButton("Buy License Perk", "data-license-perk", perk.id, state.shop.licenseStars < perk.costStars)],
      })).join("")}
    </div>
  `;
}

function renderLedgerPanel(state) {
  return `
    <h4>Delivery Ledger</h4>
    <p class="nospill-panel-helper">Recent local shop events. Entries are capped to avoid unbounded storage.</p>
    <div class="nospill-idle-grid">
      ${state.shop.ledger.length ? state.shop.ledger.map((entry) => renderIdleCard({
        title: entry.type,
        status: entry.date.slice(0, 10),
        copy: entry.text,
      })).join("") : renderIdleCard({ title: "No ledger entries yet", status: "Quiet counter", copy: "Fulfill an order or buy a station to start the ledger." })}
    </div>
  `;
}

function renderShopSettingsPanel(state) {
  const devTools = isDevToolsEnabled()
    ? `
      <section class="nospill-shop-panel" aria-labelledby="developer-tools-title">
        <h5 id="developer-tools-title">Developer Tools</h5>
        <p class="nospill-panel-helper">Developer QA only. Local test state is not trusted for certified unlocks.</p>
        <div class="nospill-delivery-actions">
          ${actionButton("Unlock All Local QA", "data-dev-unlock", "all", false, "nospill-danger")}
          ${actionButton("Reset QA State", "data-dev-reset", "reset", false)}
        </div>
        <p class="nospill-panel-helper">${escapeHtml(state.shop.untrustedLocalQa ? "Current local state is marked untrusted." : "Developer tools affect only local test state.")}</p>
      </section>
    `
    : "";
  return `
    <h4>Settings</h4>
    <p class="nospill-panel-helper">Progress is saved on this device.</p>
    <section class="nospill-shop-panel" aria-labelledby="progress-tools-title">
      <h5 id="progress-tools-title">Progress Tools</h5>
      <p class="nospill-panel-helper">Export, import, or reset only Tofu Driver game state.</p>
      <div class="nospill-delivery-actions" aria-label="Tofu Driver progress tools">
        <button class="nospill-secondary" id="export-progress-button" type="button">
          Export Progress
        </button>
        <button class="nospill-secondary" id="import-progress-button" type="button">
          Import Progress
        </button>
        <button class="nospill-danger" id="reset-progress-button" type="button">
          Reset Progress
        </button>
      </div>
    </section>
    ${devTools}
  `;
}

function currentBottleneck(gameState) {
  const state = normalizeGameState(gameState);
  if (state.shop.deliveryOrders > 0 && state.shop.tips < 1) return { id: "tips", label: "Need Tips", action: "Fulfill shop orders to earn Tips." };
  if (state.shop.deliveryOrders > 0) return { id: "orders_ready", label: "Orders ready", action: "Fulfill shop orders for Tips." };
  if (state.shop.deliveryOrders < 1) return { id: "orders", label: "No Delivery Orders", action: "Wait for Prep Counter or improve order production." };
  if (state.shop.tofuStock < 5) return { id: "tofu", label: "Low Tofu Stock", action: "Buy Tofu Press or Pack Tofu" };
  if (state.shop.prepSlots < 1) return { id: "prep_slots", label: "Prep Slots recovering", action: "Wait for prep capacity" };
  if (SHOP_STATIONS.some((station) => stationIsUnlocked(station, state) && state.shop.tips >= stationCost(station, state.shop.stations[station.id]))) {
    return { id: "upgrade", label: "Station affordable", action: "Buy a shop station" };
  }
  if (licenseExamStatus(state).ready) return { id: "license", label: "License Exam ready", action: "Review License panel" };
  return { id: "steady_shop", label: "Shop running", action: "Keep growing the shop or take an optional certified boost." };
}

function renderTofuShop(gameState = loadGameState()) {
  const state = normalizeGameState(gameState);
  const reveal = progressiveRevealState(state);
  const shop = state.shop;
  const progress = shopLevelProgress(shop.reputation);
  const generatorRates = getShopGeneratorRates(state);
  if (elements.shopLevelBadge) {
    elements.shopLevelBadge.textContent = reveal.shop ? `Shop Level ${shop.shopLevel}` : "Locked";
  }
  if (elements.shopTofuStock) {
    elements.shopTofuStock.textContent = reveal.shop
      ? formatShopBalance(shop.tofuStock, shop.generatorCarry && shop.generatorCarry.tofuStock)
      : "Locked";
  }
  if (elements.shopDeliveryOrders) {
    elements.shopDeliveryOrders.textContent = reveal.shop
      ? formatShopBalance(shop.deliveryOrders, shop.generatorCarry && shop.generatorCarry.deliveryOrders)
      : "Locked";
  }
  if (elements.shopTips) {
    elements.shopTips.textContent = reveal.shop
      ? formatShopBalance(shop.tips, shop.generatorCarry && shop.generatorCarry.tips)
      : "Locked";
  }
  if (elements.shopReputation) {
    elements.shopReputation.textContent = reveal.shop
      ? formatShopBalance(shop.reputation, shop.generatorCarry && shop.generatorCarry.reputation)
      : "Locked";
  }
  if (elements.shopLevelProgress) {
    elements.shopLevelProgress.textContent =
      reveal.shop
        ? `Level ${progress.level} · ${progress.currentReputation}/${progress.nextReputation}`
        : "Start the shop";
  }
  if (elements.shopIdleRate) {
    elements.shopIdleRate.textContent = reveal.shop
      ? `+${formatShopRate(generatorRates.tofuPressPerSecond)}/sec`
      : "Locked";
  }
  if (elements.shopOrderRate) {
    elements.shopOrderRate.textContent = reveal.shop && shop.generators.prepCounter.unlocked
      ? `+${formatShopRate(generatorRates.prepOrdersPerSecond)}/sec`
      : "Locked";
  }
  if (elements.shopTipsRate) {
    elements.shopTipsRate.textContent = reveal.shop
      ? `+${formatShopRate(generatorRates.customerTipsPerSecond)}/sec`
      : "Locked";
  }
  if (elements.shopReputationRate) {
    elements.shopReputationRate.textContent = reveal.shop
      ? `+${formatShopRate(generatorRates.passiveReputationPerSecond)}/sec`
      : "Locked";
  }
  if (elements.shopSpiritRate) {
    elements.shopSpiritRate.textContent = reveal.shop
      ? `+${formatShopRate(generatorRates.shopSpiritPerSecond)}/sec`
      : "Locked";
  }
  if (elements.shopPrepStatus) {
    elements.shopPrepStatus.textContent = reveal.shop ? generatorRates.prepStatus : "Locked";
  }
  if (elements.shopPrepSlots) {
    elements.shopPrepSlots.textContent = reveal.shop
      ? `${Math.floor(shop.prepSlots)}/${getPrepSlotMax(shop)}`
      : "Locked";
  }
  if (elements.shopReach) {
    elements.shopReach.textContent = reveal.shop ? String(shop.shopReach) : "Locked";
  }
  if (elements.shopSpirit) {
    elements.shopSpirit.textContent = reveal.shop
      ? `${Math.floor(shop.shopSpirit)}/${getShopSpiritMax(shop)}`
      : "Locked";
  }
  if (elements.shopLicenseStars) {
    elements.shopLicenseStars.textContent = reveal.shop ? String(shop.licenseStars) : "Locked";
  }
  if (elements.shopBuyMultiplier) {
    elements.shopBuyMultiplier.value = String(shop.purchaseMultiplier || appState.purchaseMultiplier || 1);
  }
  if (elements.packTofuButton) {
    const activeDrive = appState.running || appState.calibrating;
    elements.packTofuButton.disabled = activeDrive || !reveal.shop;
    elements.packTofuButton.textContent = activeDrive
      ? "Park First"
      : reveal.shop
        ? shop.deliveryOrders > 0 || shop.tofuStock >= 25
          ? "Pack Tofu (backup)"
          : "Pack Tofu"
        : "Start the Shop";
  }
  if (elements.fulfillShopOrderButton) {
    const activeDrive = appState.running || appState.calibrating;
    const canFulfill = reveal.shop && shop.deliveryOrders > 0 && !activeDrive;
    elements.fulfillShopOrderButton.disabled = !canFulfill;
    elements.fulfillShopOrderButton.textContent = activeDrive
      ? "Park First"
      : "Fulfill Shop Order";
  }
  if (elements.packTofuHelper) {
    elements.packTofuHelper.textContent = appState.running || appState.calibrating
      ? "Shop actions unlock after you finish and park."
      : reveal.shop
        ? "Add a little Tofu Stock while parked. Fulfill prepared orders to earn Tips."
        : "The press is warming up. Start the shop while parked.";
  }
  if (elements.fulfillShopOrderHelper) {
    elements.fulfillShopOrderHelper.textContent = appState.running || appState.calibrating
      ? "Shop actions unlock after you finish and park."
      : shop.deliveryOrders > 0
        ? "Turn prepared orders into Tips, Reputation, and XP."
        : "Prep Counter needs delivery orders first.";
  }
  if (elements.shopUpgradeList) {
    const upgrades = visibleStationUpgrades(state);
    elements.shopUpgradeList.innerHTML = reveal.shop
      ? upgrades.length
        ? upgrades.slice(0, 2).map((upgrade) => renderStationUpgradeCard(upgrade, state)).join("")
        : `
          <div class="nospill-upgrade-item is-locked">
            <header>
              <strong>Station Upgrades</strong>
              <small>Hidden</small>
            </header>
            <small>Complete your first shop order to reveal Steady Pressing.</small>
          </div>
        `
      : `
        <div class="nospill-upgrade-item is-locked">
          <header>
            <strong>Station Upgrades</strong>
            <small>Locked</small>
          </header>
          <small>The press is warming up. Start the shop while parked.</small>
        </div>
      `;
  }
  if (elements.shopGeneratorList) {
    elements.shopGeneratorList.innerHTML = reveal.shop
      ? [
        renderShopGeneratorCard("tofuPress", state),
        renderShopGeneratorCard("prepCounter", state),
      ].join("")
      : `
        <div class="nospill-generator-item is-locked">
          <header>
            <strong>Tofu Press</strong>
            <small>Locked</small>
          </header>
          <small>The press is warming up. Start the shop while parked.</small>
        </div>
      `;
  }
  renderShopTabs(state);
  if (elements.shopOfflineEarnings) {
    const offlineTofu = Number(shop.offlineEarnings && shop.offlineEarnings.tofuStock || 0);
    const offlineOrders = Number(shop.offlineEarnings && shop.offlineEarnings.deliveryOrders || 0);
    const offlineTips = Number(shop.offlineEarnings && shop.offlineEarnings.tips || 0);
    const hasOfflineEarnings = reveal.shop && (offlineTofu > 0.005 || offlineOrders > 0.005 || offlineTips > 0.005);
    elements.shopOfflineEarnings.textContent = hasOfflineEarnings
      ? `While you were away: +${Math.floor(offlineTofu)} tofu stock, +${Math.floor(offlineOrders)} delivery orders${offlineTips > 0.005 ? `, +${Math.floor(offlineTips)} tips` : ""}.`
      : "";
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

function renderLockedCollectionTeaser(title, copy) {
  return `
    <div class="nospill-collection-item is-locked">
      <header>
        <strong>${escapeHtml(title)}</strong>
        <small>Locked</small>
      </header>
      <span>${escapeHtml(copy)}</span>
      <button class="nospill-secondary" type="button" disabled>Locked</button>
    </div>
  `;
}

function renderCollectionPanel(gameState = loadGameState()) {
  const state = normalizeGameState(gameState);
  const reveal = progressiveRevealState(state);
  const activeDrive = appState.running || appState.calibrating;
  const selectedCrew = selectedCharacter(state);
  const soundPack = selectedSoundPack(state);
  if (elements.selectedCharacterBadge) {
    elements.selectedCharacterBadge.textContent = reveal.crew && selectedCrew
      ? selectedCrew.name
      : "Crew Locked";
  }
  if (elements.selectedCharacterName) {
    elements.selectedCharacterName.textContent = reveal.crew && selectedCrew
      ? selectedCrew.name
      : "No one on shift yet";
  }
  if (elements.selectedCharacterFlavor) {
    elements.selectedCharacterFlavor.textContent = reveal.crew && selectedCrew
      ? selectedCrew.flavor
      : "No one is on shift yet. Your first delivery may attract help.";
  }
  if (elements.selectedSoundPackName) {
    elements.selectedSoundPackName.textContent = reveal.sounds ? soundPack.name : "Default";
  }
  if (elements.selectedSoundPackFlavor) {
    elements.selectedSoundPackFlavor.textContent =
      reveal.sounds
        ? `${soundPack.description} Muted mode disables cosmetic sound effects.`
        : "New sounds unlock as your delivery reputation grows.";
  }
  if (elements.characterList) {
    elements.characterList.innerHTML = reveal.crew
      ? CHARACTER_CATALOG.map((character) => renderCollectionItem(
        character,
        {
          unlocked: state.collection.unlockedCharacterIds.includes(character.id),
          selected: selectedCrew && selectedCrew.id === character.id,
          type: "character",
          activeDrive,
        },
      )).join("")
      : renderLockedCollectionTeaser(
        "Delivery Crew",
        "No one is on shift yet. Your first delivery may attract help.",
      );
  }
  if (elements.soundPackList) {
    elements.soundPackList.innerHTML = reveal.sounds
      ? SOUND_PACK_CATALOG.map((pack) => renderCollectionItem(
        pack,
        {
          unlocked: state.collection.unlockedSoundPackIds.includes(pack.id),
          selected: soundPack.id === pack.id,
          type: "sound",
          activeDrive,
        },
      )).join("")
      : renderLockedCollectionTeaser(
        "Sound Packs",
        "New sounds unlock as your delivery reputation grows.",
      );
  }
  if (elements.previewSoundButton) {
    const muted = normalizeAudioLevel(appState.audioLevel) === "muted" || !appState.audioEnabled;
    elements.previewSoundButton.disabled = activeDrive || muted || !reveal.sounds;
    elements.previewSoundButton.textContent = activeDrive
      ? "Park First"
      : !reveal.sounds
        ? "Locked"
        : muted
          ? "Muted"
          : "Preview Sound";
  }
}

function isSimulatorEnabled() {
  if (typeof window === "undefined") return false;
  const search = window.location && typeof window.location.search === "string"
    ? window.location.search
    : "";
  if (/(?:^\?|&)simulator=1(?:&|$)/.test(search)) return true;
  const storage = safeLocalStorage();
  return Boolean(
    storage
    && ["1", "true", "yes"].includes(
      String(storage.getItem(SIMULATOR_LOCAL_STORAGE_KEY) || "").toLowerCase(),
    )
  );
}

function renderSimulatorPanel() {
  if (!elements.simulatorPanel) return;
  const enabled = isSimulatorEnabled();
  const activeDrive = appState.running || appState.calibrating;
  elements.simulatorPanel.classList.toggle(
    "is-hidden",
    !enabled || activeDrive || appState.surface !== "cup-test",
  );
  if (!enabled) return;
  if (elements.simulatorScenarioSelect && !elements.simulatorScenarioSelect.options.length) {
    elements.simulatorScenarioSelect.innerHTML = getSimulatorScenarios()
      .map((scenario) => `<option value="${escapeHtml(scenario.id)}">${escapeHtml(scenario.name)}</option>`)
      .join("");
  }
  if (elements.applySimulatorButton) {
    elements.applySimulatorButton.disabled = activeDrive;
    elements.applySimulatorButton.textContent = activeDrive
      ? "Park First"
      : "Apply Simulated Delivery";
  }
  if (elements.simulatorStatus) {
    elements.simulatorStatus.textContent = activeDrive
      ? "Simulator controls unlock after you finish and park."
      : "Simulator is local-only and does not use motion sensors or location.";
  }
}

function renderGamePanels(gameState = loadGameState()) {
  const state = normalizeGameState(gameState);
  appState.liveGameState = state;
  const reveal = progressiveRevealState(state);
  const shopSurface = appState.surface === "shop";
  const crewSurface = appState.surface === "crew";
  renderSurfaceNavigation(state);
  renderGameDashboard(state);
  renderDeliveryLog(state);
  renderMerchProgress(state);
  renderTofuShop(state);
  renderCollectionPanel(state);
  renderSimulatorPanel();
  if (elements.deliveryBoardSection) {
    elements.deliveryBoardSection.classList.toggle("is-hidden", !shopSurface || !reveal.firstDelivery);
  }
  if (elements.tofuShopSection) {
    elements.tofuShopSection.classList.toggle("is-hidden", !shopSurface || !reveal.shop);
  }
  if (elements.collectionSection) {
    elements.collectionSection.classList.toggle("is-hidden", !crewSurface);
  }
  if (elements.surfaceSections) {
    elements.surfaceSections.forEach((section) => {
      const sectionSurface = section.dataset.appSurface || "shop";
      if (sectionSurface !== appState.surface) section.classList.add("is-hidden");
    });
  }
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
  const qualified = isQualifiedSession(summary);
  const shop = rewards.shop || { tofuStockGained: 0, tipsGained: 0, reputationGained: 0 };
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
    : qualified ? "No new stamp" : "No qualified stamp";
  const nextGoal = dailyComplete
    ? "Daily delivery complete. Come back tomorrow for new cargo."
    : qualified
      ? `${dailyDelivery.cargo}: ${dailyDelivery.goal}`
      : "Take a normal qualified delivery when parked and ready.";
  const certifiedBoost = shop.certifiedBoost || { applied: false };
  const certifiedBoostLine = certifiedBoost.applied
    ? `+${certifiedBoost.reputationGained} reputation · +${certifiedBoost.tofuStockGained} tofu · +${certifiedBoost.tipsGained} tips · Tofu Press +${certifiedBoost.pressBoostPercent}%`
    : qualified
      ? "No certified boost earned"
      : "Practice only - no certified boost";
  const shopRewardLine = (shop.tofuStockGained || shop.tipsGained || shop.reputationGained)
    ? `+${shop.tofuStockGained || 0} tofu · +${shop.tipsGained || 0} tips · +${shop.reputationGained || 0} reputation`
    : "No shop rewards from this practice";
  elements.deliverySummaryGrid.innerHTML = [
    summary.simulated
      ? summaryMetric("Test Mode", qualified ? "Simulated Delivery" : "Simulated Practice Delivery")
      : "",
    summaryMetric("Cargo Condition", formatPercent(summary.cargoCondition ?? summary.waterLeft), "nospill-is-good"),
    summaryMetric("Route Type", summary.routeType || classifyRouteType(summary)),
    summaryMetric("Rank", displayRankForSession(summary)),
    summaryMetric("Qualification", summary.qualificationLabel || (qualified ? "Qualified" : "Practice Only")),
    summaryMetric("Driver License", `Level ${level} · ${getDriverLicense(level)}`),
    summaryMetric(
      "Daily Delivery Result",
      dailyComplete
        ? `${dailyDelivery.cargo} delivered`
        : qualified
          ? `${dailyDelivery.cargo} in progress`
          : "Practice only - not completed",
    ),
    summaryMetric("Main Damage Source", coach.damageSource),
    summaryMetric("Best Skill", coach.bestSkill),
    summaryMetric("Next Focus", coach.nextFocus),
    summaryMetric("Selected Crew", crew ? crew.name : "No crew selected yet"),
    summaryMetric("New Unlock", newUnlockLine),
    summaryMetric("XP Gained", rewards.xpGained ? `+${rewards.xpGained}` : "+0"),
    summaryMetric("Skill XP Gained", skillLine),
    summaryMetric("Stamp Earned", stampLine),
    summaryMetric("Shop Rewards", shopRewardLine),
    summaryMetric("Certified Boost", certifiedBoostLine),
    summaryMetric("Shop Level", `Level ${shopState.shopLevel}`),
    summaryMetric("Delivery Passport", `${passport.total}/${passport.totalAvailable} stamps`),
    summaryMetric(
      "No-Spill Club Gear",
      `${merch.nospillClubGear.count}/${merch.nospillClubGear.target}`,
    ),
    summaryMetric("Perfect Pour Drop", merch.perfectPourDrop.unlocked ? "Unlocked" : "Locked"),
    summaryMetric("Delivery Crew Merch", `${merch.deliveryCrew.count}/${merch.deliveryCrew.target}`),
    summaryMetric("Next Delivery Goal", nextGoal),
  ].filter(Boolean).join("");
  if (elements.commuteMasteryCopy) {
    elements.commuteMasteryCopy.textContent = rewards.commuteMasteryMessage || coach.message || "";
  }
}

function setShareActionsEnabled(enabled) {
  [
    elements.shareButton,
    elements.copyButton,
    elements.downloadButton,
    elements.saveButton,
  ].forEach((button) => {
    if (button) button.disabled = !enabled;
  });
}

function setSummaryMode(mode, options = {}) {
  appState.summaryMode = mode;
  if (elements.summaryView) {
    elements.summaryView.classList.toggle("is-shop-result", mode === "shop-order");
  }
  const hideShare = mode === "shop-order";
  if (elements.shareCardSection) elements.shareCardSection.classList.toggle("is-hidden", hideShare);
  [
    elements.shareButton,
    elements.copyButton,
    elements.downloadButton,
    elements.saveButton,
  ].forEach((button) => {
    if (button) button.classList.toggle("is-hidden", hideShare);
  });
  appState.shopResultCanFulfillAnother = Boolean(options.canFulfillAnother);
}

function renderShopOrderResult(result) {
  appState.lastSummary = null;
  const state = normalizeGameState(result.gameState);
  const shop = state.shop;
  const canFulfillAnother = shop.deliveryOrders > 0;
  setSummaryMode("shop-order", { canFulfillAnother });
  if (elements.summaryStatusLabel) {
    elements.summaryStatusLabel.textContent = "Tofu Shop";
  }
  if (elements.summaryTitle) {
    elements.summaryTitle.textContent = "Shop Order Complete";
  }
  if (elements.summaryWater) {
    elements.summaryWater.textContent = `+${result.tipsGained} Tips`;
  }
  if (elements.returnDashboardButton) {
    elements.returnDashboardButton.textContent = canFulfillAnother
      ? "Fulfill Another Shop Order"
      : "Return to Tofu Shop";
  }
  if (elements.newRunButton) {
    elements.newRunButton.textContent = canFulfillAnother
      ? "Return to Tofu Shop"
      : "Take Don't Spill the Cup";
    elements.newRunButton.classList.toggle("is-hidden", false);
  }
  if (elements.backSimulatorButton) {
    elements.backSimulatorButton.classList.toggle("is-hidden", true);
  }
  if (elements.routeContext) elements.routeContext.classList.toggle("is-hidden", true);
  if (elements.deliverySummaryGrid) {
    elements.deliverySummaryGrid.innerHTML = [
      summaryMetric("Order", "Packed and handed off from the counter.", "nospill-is-good"),
      summaryMetric("Tips Gained", `+${result.tipsGained}`),
      summaryMetric("Reputation Gained", `+${result.reputationGained}`),
      summaryMetric("XP Gained", `+${result.xpGained}`),
      summaryMetric("Tofu Stock", String(shop.tofuStock)),
      summaryMetric("Delivery Orders", String(shop.deliveryOrders)),
      summaryMetric("Shop Level", `Level ${shop.shopLevel}`),
      summaryMetric("Next Best Action", nextBestAction(state).title.replace(/^Next: /, "")),
    ].join("");
  }
  if (elements.commuteMasteryCopy) {
    elements.commuteMasteryCopy.textContent = result.report || "Shop order complete.";
  }
  setShareActionsEnabled(false);
  renderGamePanels(state);
  showView("summary");
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
  setSummaryMode("cup-test");
  setShareActionsEnabled(true);
  const qualified = isQualifiedSession(summary);
  const summaryGameState = summary.deliveryRewards
    ? summary.deliveryRewards.gameState
    : loadGameState();
  const reveal = progressiveRevealState(summaryGameState);
  if (elements.summaryStatusLabel) {
    elements.summaryStatusLabel.textContent = summary.simulated
      ? (qualified ? "Simulated Delivery" : "Simulated Practice")
      : summary.qualificationLabel;
  }
  if (elements.summaryTitle) {
    elements.summaryTitle.textContent = summary.simulated
      ? (qualified ? "Simulated Delivery Complete" : "Simulated Practice Complete")
      : (qualified ? "Delivery Complete" : "Practice Complete");
  }
  if (elements.summaryWater) {
    elements.summaryWater.textContent = formatPercent(summary.cargoCondition ?? summary.waterLeft);
  }
  if (elements.returnDashboardButton) {
    elements.returnDashboardButton.textContent = reveal.shop
      ? "Return to Tofu Shop"
      : "Return to Dashboard";
  }
  if (elements.newRunButton) {
    elements.newRunButton.textContent = "Take Another Cup Test";
    elements.newRunButton.classList.toggle("is-hidden", false);
  }
  if (elements.backSimulatorButton) {
    elements.backSimulatorButton.classList.toggle("is-hidden", !isSimulatorEnabled());
  }
  if (elements.summaryGrid) {
    elements.summaryGrid.innerHTML = [
      summary.simulated ? summaryMetric("Test Mode", "Simulated Delivery") : "",
      summaryMetric("Cargo Condition", formatPercent(summary.cargoCondition ?? summary.waterLeft), "nospill-is-good"),
      summaryMetric("Water Spilled", formatPercent(summary.waterSpilled)),
      summaryMetric("Route Type", summary.routeType || classifyRouteType(summary)),
      summaryMetric("Rank", displayRankForSession(summary)),
      summaryMetric("Harsh Inputs", String(summary.harshInputCount)),
      summaryMetric("Qualification", summary.qualificationLabel),
    ].filter(Boolean).join("");
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
    challengeName: delivery.status,
    waterDelivered: delivery.cargoCondition,
    waterSpilled: formatPercent(summary.waterSpilled),
    rank: delivery.rank,
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
    `${APP_BRAND}: ${data.challengeName}. Cargo Condition: ${data.waterDelivered}. Rank: ${data.rank}. Route Type: ${data.routeLabel}.${milestoneText} ${data.tagline}`,
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
  const text = exportGameProgress(currentGameState());
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
  const gameState = currentGameState();
  renderGamePanels(gameState);
  setSummaryStatusMessage("Tofu Driver progress reset on this device.");
}

function handlePackTofu() {
  const result = packTofu(currentGameState(), {
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

function handleFulfillShopOrder(requestedQuantity = 1) {
  const result = fulfillShopOrders(currentGameState(), requestedQuantity, {
    activeDrive: appState.running || appState.calibrating,
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  renderShopOrderResult(result);
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
  const result = buyShopUpgrade(button.dataset.shopUpgrade, currentGameState());
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

function saveShopActionResult(result, successMessage) {
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return false;
  }
  saveGameState(result.gameState);
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(successMessage);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
  return true;
}

function handleTofuShopPanelClick(event) {
  if (appState.running || appState.calibrating) {
    setSummaryStatusMessage("Shop actions unlock after you finish and park.");
    return;
  }
  const target = event.target && event.target.closest ? event.target.closest("button") : null;
  if (!target) return;
  if (target.dataset.shopTab) {
    appState.shopTab = target.dataset.shopTab;
    const state = currentGameState();
    state.shop.currentShopTab = appState.shopTab;
    saveGameState(state);
    renderTofuShop(state);
    return;
  }
  if (target.dataset.surfaceTarget) {
    setAppSurface(target.dataset.surfaceTarget, { updateHash: true, scroll: true });
    renderGamePanels(currentGameState());
    return;
  }
  if (target.id === "export-progress-button") {
    exportProgress();
    return;
  }
  if (target.id === "import-progress-button") {
    importProgress();
    return;
  }
  if (target.id === "reset-progress-button") {
    resetProgress();
    return;
  }
  if (target.dataset.shopStation) {
    const state = currentGameState();
    const quantity = state.shop.purchaseMultiplier || appState.purchaseMultiplier || 1;
    const result = buyShopStation(target.dataset.shopStation, state, quantity);
    saveShopActionResult(result, result.ok ? `Bought ${result.quantity} ${result.station.name}.` : "");
    return;
  }
  if (target.dataset.shopStationMax) {
    const result = buyShopStation(target.dataset.shopStationMax, currentGameState(), "max");
    saveShopActionResult(result, result.ok ? `Bought ${result.quantity} ${result.station.name}.` : "");
    return;
  }
  if (target.dataset.fulfillOrders) {
    const result = fulfillShopOrders(currentGameState(), target.dataset.fulfillOrders, {
      activeDrive: false,
    });
    if (!result.ok) {
      setSummaryStatusMessage(result.reason);
      renderTofuShop(result.gameState);
      return;
    }
    saveGameState(result.gameState);
    renderShopOrderResult(result);
    playCosmeticSound("shop_pack_tofu", result.gameState, { activeDrive: false });
    return;
  }
  const actionMap = [
    ["stationUpgrade", "data-station-upgrade", buyStationUpgrade, (result) => `${result.upgrade.name} upgraded.`],
    ["shopRoute", "data-shop-route", completeFictionalRoute, (result) => `${result.route.name} complete.`],
    ["trainingDrill", "data-training-drill", runTrainingDrill, (result) => `${result.drill.name} complete.`],
    ["garageUpgrade", "data-garage-upgrade", buyGarageUpgrade, (result) => `${result.upgrade.name} upgraded.`],
    ["crewRole", "data-crew-role", hireCrewRole, (result) => `${result.role.name} joined.`],
    ["spiritGenerator", "data-spirit-generator", buySpiritGenerator, (result) => `${result.generator.name} added.`],
    ["spiritBoost", "data-spirit-boost", useShopSpiritBoost, (result) => `${result.boost.name} used.`],
    ["festivalBoost", "data-festival-boost", useFestivalBoost, (result) => `${result.boost.name} used.`],
    ["licensePerk", "data-license-perk", buyLicensePerk, (result) => `${result.perk.name} purchased.`],
    ["rivalChallenge", "data-rival-challenge", startRivalChallenge, (result) => `${result.rival.name} complete.`],
  ];
  for (const [, attr, fn, message] of actionMap) {
    const value = target.getAttribute(attr);
    if (value) {
      const result = fn(value, currentGameState());
      saveShopActionResult(result, result.ok ? message(result) : "");
      return;
    }
  }
  if (target.dataset.licenseExam) {
    const confirmed = typeof window === "undefined"
      || typeof window.confirm !== "function"
      || window.confirm("Take the Local Delivery License Exam and reset selected shop progress?");
    const result = takeLicenseExam(currentGameState(), { confirmed });
    saveShopActionResult(result, result.ok ? `License Exam passed. +${result.starsEarned} License Stars.` : "");
    return;
  }
  if (target.dataset.devUnlock) {
    const result = unlockAllLocalQa(currentGameState());
    saveShopActionResult(result, "Developer QA unlock applied.");
    return;
  }
  if (target.dataset.devReset) {
    const state = defaultGameState();
    saveGameState(state);
    renderGamePanels(state);
    setSummaryStatusMessage("Developer QA state reset.");
  }
}

function handleShopMultiplierChange() {
  const value = elements.shopBuyMultiplier && elements.shopBuyMultiplier.value === "max"
    ? "max"
    : safeNonNegativeInteger(elements.shopBuyMultiplier && elements.shopBuyMultiplier.value, 1, 100);
  appState.purchaseMultiplier = value;
  const state = currentGameState();
  state.shop.purchaseMultiplier = value;
  saveGameState(state);
  renderTofuShop(state);
}

function handleCharacterSelect(event) {
  const button = event.target && event.target.closest
    ? event.target.closest("[data-character-id]")
    : null;
  if (!button) return;
  const result = selectCharacter(button.dataset.characterId, currentGameState(), {
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
  const result = selectSoundPack(button.dataset.soundPackId, currentGameState(), {
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
  const result = previewSoundPack(currentGameState(), {
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

function handleApplySimulatedDelivery() {
  if (appState.running || appState.calibrating) {
    if (elements.simulatorStatus) {
      elements.simulatorStatus.textContent = "Simulator controls unlock after you finish and park.";
    }
    return;
  }
  const scenarioId = elements.simulatorScenarioSelect
    ? elements.simulatorScenarioSelect.value
    : SIMULATOR_SCENARIOS[0].id;
  const excludeMerch = elements.simulatorExcludeMerch
    ? elements.simulatorExcludeMerch.checked
    : true;
  const result = applySimulatedDelivery(scenarioId, currentGameState(), {
    excludeMerch,
  });
  saveGameState(result.gameState);
  renderSummary(result.summary);
  const unlockCount =
    result.rewards.collectionUnlocks.newCharacterUnlocks.length
    + result.rewards.collectionUnlocks.newSoundUnlocks.length;
  playCosmeticSound(unlockCount > 0 ? "unlock" : "delivery_complete", result.gameState, {
    activeDrive: false,
  });
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

function refreshLandingDashboard(message, surface = appState.surface || "shop") {
  renderMountControls();
  renderAudioLevelControls();
  setAppSurface(surface, { updateHash: true });
  renderGamePanels(loadGameStateWithOfflineShopEarnings());
  drawCupCanvas(elements.cupCanvas, appState.currentG, appState.waterLeft);
  showView("landing");
  if (message) setLandingStatus(message);
}

function scrollToDashboardTarget(target) {
  const node = target === "simulator" && isSimulatorEnabled()
    ? elements.simulatorPanel
    : target === "shop" && elements.tofuShopSection
      ? elements.tofuShopSection
      : elements.landingView;
  if (node && node.classList && node.classList.contains && node.classList.contains("is-hidden")) {
    return;
  }
  if (node && typeof node.scrollIntoView === "function") {
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function returnToDashboard(target = "shop") {
  appState.summaryMode = null;
  appState.shopResultCanFulfillAnother = false;
  refreshLandingDashboard("Review your rewards. The shop has been updated.", "shop");
  const state = loadGameState();
  const reveal = progressiveRevealState(state);
  scrollToDashboardTarget(target === "shop" && !reveal.shop ? "dashboard" : target);
}

function takeAnotherCupTest() {
  appState.summaryMode = null;
  appState.shopResultCanFulfillAnother = false;
  appState.lastSummary = null;
  resetSessionState();
  refreshLandingDashboard("Review setup, then start while parked.", "cup-test");
  revealSetupFlow();
}

function handlePrimaryResultAction() {
  if (appState.summaryMode === "shop-order" && appState.shopResultCanFulfillAnother) {
    handleFulfillShopOrder();
    return;
  }
  returnToDashboard("shop");
}

function newRun() {
  if (appState.summaryMode === "shop-order") {
    if (appState.shopResultCanFulfillAnother) {
      returnToDashboard("shop");
    } else {
      takeAnotherCupTest();
    }
    return;
  }
  takeAnotherCupTest();
}

function revealSetupFlow() {
  if (!elements.setupFlow) return;
  setAppSurface("cup-test", { updateHash: true });
  elements.setupFlow.classList.remove("is-hidden");
  elements.setupFlow.scrollIntoView({ behavior: "smooth", block: "start" });
}

function focusShopUpgrade(upgradeId = "") {
  if (!elements.tofuShopSection) return;
  setAppSurface("shop", { updateHash: true });
  elements.tofuShopSection.scrollIntoView({ behavior: "smooth", block: "start" });
  if (!upgradeId || !elements.shopUpgradeList || !elements.shopUpgradeList.querySelector) return;
  const safeUpgradeId =
    typeof CSS !== "undefined" && CSS.escape
      ? CSS.escape(upgradeId)
      : String(upgradeId).replace(/"/g, "");
  const button = elements.shopUpgradeList.querySelector(`[data-shop-upgrade="${safeUpgradeId}"]`);
  if (button && typeof button.focus === "function") button.focus();
}

function handleNextBestAction() {
  const actionType = elements.gameCtaButton && elements.gameCtaButton.dataset
    ? elements.gameCtaButton.dataset.nextAction
    : "cup_test";
  if (actionType === "start_shop" || actionType === "pack_tofu") {
    handlePackTofu();
    return;
  }
  if (actionType === "fulfill_shop_order") {
    const orderQuantity = elements.gameCtaButton && elements.gameCtaButton.dataset
      ? elements.gameCtaButton.dataset.nextOrderQuantity || "1"
      : "1";
    handleFulfillShopOrder(orderQuantity);
    return;
  }
  if (actionType === "buy_upgrade") {
    const upgradeId = elements.gameCtaButton.dataset.nextUpgrade || "";
    focusShopUpgrade(upgradeId);
    setSummaryStatusMessage("Choose an available shop upgrade while parked.");
    return;
  }
  if (actionType === "continue_shop") {
    focusShopUpgrade("");
    setSummaryStatusMessage("Review the Tofu Shop while parked.");
    return;
  }
  if (actionType === "active_drive") return;
  revealSetupFlow();
}

function bindEvents() {
  if (elements.introCtaButton) {
    elements.introCtaButton.addEventListener("click", revealSetupFlow);
  }
  elements.gameCtaButton.addEventListener("click", handleNextBestAction);
  if (elements.gameCertifiedCtaButton) {
    elements.gameCertifiedCtaButton.addEventListener("click", revealSetupFlow);
  }
  if (elements.brandPrimaryCta) {
    elements.brandPrimaryCta.addEventListener("click", () => {
      if (appState.running || appState.calibrating) return;
      if (elements.brandPrimaryCta.dataset.brandAction === "cup-test") {
        revealSetupFlow();
        return;
      }
      setAppSurface("shop", { updateHash: true, scroll: true });
      renderGamePanels(loadGameState());
    });
  }
  if (elements.brandSecondaryCta) {
    elements.brandSecondaryCta.addEventListener("click", () => {
      if (appState.running || appState.calibrating) return;
      const target = elements.brandSecondaryCta.dataset.brandAction === "cup-test"
        ? "cup-test"
        : "shop";
      setAppSurface(target, { updateHash: true, scroll: true });
      renderGamePanels(loadGameState());
    });
  }
  if (elements.surfaceNavButtons) {
    elements.surfaceNavButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (appState.running || appState.calibrating) return;
        const surface = button.dataset.surfaceTarget === "cup-test" ? "cup-test" : "shop";
        setAppSurface(surface, { updateHash: true, scroll: true });
        renderGamePanels(loadGameState());
      });
    });
  }
  if (typeof window !== "undefined") {
    window.addEventListener("hashchange", () => {
      if (appState.running || appState.calibrating) return;
      setAppSurface(surfaceFromHash(window.location.hash), { updateHash: false });
      renderGamePanels(loadGameState());
    });
  }
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
  elements.returnDashboardButton.addEventListener("click", handlePrimaryResultAction);
  elements.backSimulatorButton.addEventListener("click", () => returnToDashboard("simulator"));
  if (elements.exportProgressButton) elements.exportProgressButton.addEventListener("click", exportProgress);
  if (elements.importProgressButton) elements.importProgressButton.addEventListener("click", importProgress);
  if (elements.resetProgressButton) elements.resetProgressButton.addEventListener("click", resetProgress);
  if (elements.gamePackTofuButton) {
    elements.gamePackTofuButton.addEventListener("click", handlePackTofu);
  }
  elements.packTofuButton.addEventListener("click", handlePackTofu);
  elements.fulfillShopOrderButton.addEventListener("click", handleFulfillShopOrder);
  if (elements.shopTabPanel) elements.shopTabPanel.addEventListener("click", handleTofuShopPanelClick);
  if (elements.shopTabList) elements.shopTabList.addEventListener("click", handleTofuShopPanelClick);
  if (elements.shopBuyMultiplier) {
    elements.shopBuyMultiplier.addEventListener("change", handleShopMultiplierChange);
  }
  elements.shopUpgradeList.addEventListener("click", handleShopUpgradeClick);
  elements.characterList.addEventListener("click", handleCharacterSelect);
  elements.soundPackList.addEventListener("click", handleSoundPackSelect);
  elements.previewSoundButton.addEventListener("click", handlePreviewSound);
  elements.applySimulatorButton.addEventListener("click", handleApplySimulatedDelivery);
  elements.newRunButton.addEventListener("click", newRun);
}

function cacheElements() {
  elements = {
    landingView: document.getElementById("landing-view"),
    runView: document.getElementById("run-view"),
    unsupportedView: document.getElementById("unsupported-view"),
    summaryView: document.getElementById("summary-view"),
    setupFlow: document.getElementById("setup-flow"),
    brandShelfEyebrow: document.getElementById("brand-shelf-eyebrow"),
    landingTitle: document.getElementById("landing-title"),
    brandShelfCopy: document.getElementById("brand-shelf-copy"),
    brandShelfSafety: document.getElementById("brand-shelf-safety"),
    brandPrimaryCta: document.getElementById("brand-primary-cta"),
    brandSecondaryCta: document.getElementById("brand-secondary-cta"),
    surfaceSections: Array.from(document.querySelectorAll("[data-app-surface]")),
    surfaceNavButtons: Array.from(document.querySelectorAll("[data-surface-target]")),
    tofuShopSection: document.getElementById("tofu-shop"),
    deliveryBoardSection: document.getElementById("delivery-board-section"),
    collectionSection: document.getElementById("delivery-crew"),
    introCtaButton: document.getElementById("intro-cta-button"),
    gameCtaButton: document.getElementById("game-cta-button"),
    gameCertifiedCtaButton: document.getElementById("game-certified-cta-button"),
    gameNextActionTitle: document.getElementById("game-next-action-title"),
    gameNextActionCopy: document.getElementById("game-next-action-copy"),
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
    gameTeaserGrid: document.getElementById("game-teaser-grid"),
    gameShopStock: document.getElementById("game-shop-stock"),
    gameShopReputation: document.getElementById("game-shop-reputation"),
    gameShopLevel: document.getElementById("game-shop-level"),
    gameShopTeaser: document.getElementById("game-shop-teaser"),
    gameShopHelper: document.getElementById("game-shop-helper"),
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
    shopDeliveryOrders: document.getElementById("shop-delivery-orders"),
    shopTips: document.getElementById("shop-tips"),
    shopReputation: document.getElementById("shop-reputation"),
    shopLevelProgress: document.getElementById("shop-level-progress"),
    shopIdleRate: document.getElementById("shop-idle-rate"),
    shopOrderRate: document.getElementById("shop-order-rate"),
    shopTipsRate: document.getElementById("shop-tips-rate"),
    shopReputationRate: document.getElementById("shop-reputation-rate"),
    shopSpiritRate: document.getElementById("shop-spirit-rate"),
    shopPrepStatus: document.getElementById("shop-prep-status"),
    shopPrepSlots: document.getElementById("shop-prep-slots"),
    shopReach: document.getElementById("shop-reach"),
    shopSpirit: document.getElementById("shop-spirit"),
    shopLicenseStars: document.getElementById("shop-license-stars"),
    shopBuyMultiplier: document.getElementById("shop-buy-multiplier"),
    shopTabList: document.getElementById("shop-tab-list"),
    shopTabPanel: document.getElementById("shop-tab-panel"),
    packTofuButton: document.getElementById("pack-tofu-button"),
    packTofuHelper: document.getElementById("pack-tofu-helper"),
    fulfillShopOrderButton: document.getElementById("fulfill-shop-order-button"),
    fulfillShopOrderHelper: document.getElementById("fulfill-shop-order-helper"),
    shopGeneratorList: document.getElementById("shop-generator-list"),
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
    simulatorPanel: document.getElementById("simulator-panel"),
    simulatorScenarioSelect: document.getElementById("simulator-scenario-select"),
    simulatorExcludeMerch: document.getElementById("simulator-exclude-merch"),
    applySimulatorButton: document.getElementById("apply-simulator-button"),
    simulatorStatus: document.getElementById("simulator-status"),
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
    shareCardSection: document.getElementById("share-card-section"),
    shareCanvas: document.getElementById("share-canvas"),
    shareButton: document.getElementById("share-button"),
    downloadButton: document.getElementById("download-button"),
    copyButton: document.getElementById("copy-button"),
    saveButton: document.getElementById("save-button"),
    returnDashboardButton: document.getElementById("return-dashboard-button"),
    backSimulatorButton: document.getElementById("back-simulator-button"),
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
  initializeAppSurface();
  renderMerchPanel(clubState);
  renderGamePanels(loadGameStateWithOfflineShopEarnings());
  renderDiscordCtas("landing");
  drawCupCanvas(elements.cupCanvas, appState.currentG, appState.waterLeft);
  startShopGeneratorTimer();
  if (!hasDeviceMotionSupport()) {
    setLandingStatus(
      "This browser has not exposed motion sensors yet. Start will check again on a phone.",
    );
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initNoSpillApp);
}
