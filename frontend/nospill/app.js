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
const TOFU_CARGO_MASCOT_SRC = "/static/nospill/images/tofu-driver-app-image.png";

const CARGO_TYPES = {
  firm_tofu: {
    label: "Firm Tofu",
    thresholdG: 0.4,
    copy: "Forgiving delivery for everyday drives.",
  },
  soft_tofu: {
    label: "Soft Tofu",
    thresholdG: 0.3,
    copy: "The classic cup test.",
  },
  silken_tofu: {
    label: "Silken Tofu",
    thresholdG: 0.2,
    copy: "Delicate delivery for smooth-control purists.",
  },
};

const LEGACY_CARGO_TYPE_IDS = {
  beginner: "firm_tofu",
  standard: "soft_tofu",
  comfort: "silken_tofu",
};

const DIFFICULTIES = CARGO_TYPES;

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
const SHARE_CARD_TRAIL_MODES = {
  abstract: "abstract",
  routeOutline: "route_outline",
};
const ROUTE_OUTLINE_SHARE_WARNING =
  "This route shape may reveal where you drove. Share only if comfortable.";
const RESULT_STORY_CAPTION_MAX_LENGTH = 90;
const BUILDER_NOTE_MAX_LENGTH = 100;
const BUILDER_NOTE_PRESETS = [
  "Built after too many tofu shifts.",
  "The shop funded the dream.",
  "Not faster. Smoother.",
  "One careful part at a time.",
  "Mika says it has potential.",
];
const HIDDEN_SHIRT_ID = "not_fast_smooth_tee";
const HIDDEN_SHIRT_NAME = "Tofu Driver \u201cNot Fast. Smooth.\u201d Tee";
const HIDDEN_SHIRT_URL =
  "https://supercutecollectibles.com/products/tofu-driver-not-fast-smooth-tee?utm_source=copyToPasteBoard&utm_medium=product-links&utm_content=web";
const HIDDEN_STICKER_ID = "not_fast_smooth_sticker";
const HIDDEN_STICKER_NAME = "Tofu Driver \u201cNot Fast. Smooth.\u201d Sticker";
const HIDDEN_STICKER_URL =
  "https://supercutecollectibles.com/products/tofu-driver-not-fast-smooth-sticker?utm_source=copyToPasteBoard&utm_medium=product-links&utm_content=web";
const HIDDEN_PENGUIN_STICKER_ID = "penguin_sticker";
const HIDDEN_PENGUIN_STICKER_NAME = "Tofu Driver Penguin Sticker";
const HIDDEN_PENGUIN_STICKER_URL =
  "https://supercutecollectibles.com/products/tofu-driver-penguin-sticker?utm_source=copyToPasteBoard&utm_medium=product-links&utm_content=web";
const HIDDEN_PENGUIN_SHIRT_ID = "penguin_delivery_white_tee";
const HIDDEN_PENGUIN_SHIRT_NAME = "Tofu Driver Penguin Delivery White Tee";
const HIDDEN_PENGUIN_SHIRT_URL =
  "https://supercutecollectibles.com/products/tofu-driver-penguin-delivery-white-tee?utm_source=copyToPasteBoard&utm_medium=product-links&utm_content=web";

const PENGUIN_CHARACTER_IDS = new Set([
  "penguin_driver",
  "penguin_delivery_buddy",
  "penguin_tofu_driver_sticker",
]);

const HIDDEN_MERCH_UNLOCKS = {
  [HIDDEN_STICKER_ID]: {
    id: HIDDEN_STICKER_ID,
    name: HIDDEN_STICKER_NAME,
    url: HIDDEN_STICKER_URL,
    linkLabel: "View Sticker",
    lockedTitle: "Hidden Sticker",
    lockedCopy: "Earn a Certified Result to reveal this link.",
    unlockedCopy: "Secret sticker unlocked.",
    revealTitle: "Hidden Sticker Unlocked",
    revealCopy: `You unlocked the ${HIDDEN_STICKER_NAME}.`,
    revealSubcopy: "Secret sticker reward revealed by a Certified Result.",
    allowedSources: new Set(["certified_result", "shirt_migration"]),
  },
  [HIDDEN_PENGUIN_STICKER_ID]: {
    id: HIDDEN_PENGUIN_STICKER_ID,
    name: HIDDEN_PENGUIN_STICKER_NAME,
    url: HIDDEN_PENGUIN_STICKER_URL,
    linkLabel: "View Sticker",
    lockedTitle: "Hidden Penguin Sticker",
    lockedCopy: "Complete a Certified Result with a Penguin selected to reveal this link.",
    unlockedCopy: "Secret Penguin sticker unlocked.",
    revealTitle: "Hidden Penguin Sticker Unlocked",
    revealCopy: `You unlocked the ${HIDDEN_PENGUIN_STICKER_NAME}.`,
    revealSubcopy: "A secret sticker for Penguin deliveries.",
    allowedSources: new Set(["certified_penguin_result", "shirt_migration"]),
  },
  [HIDDEN_SHIRT_ID]: {
    id: HIDDEN_SHIRT_ID,
    name: HIDDEN_SHIRT_NAME,
    url: HIDDEN_SHIRT_URL,
    linkLabel: "View Shirt",
    lockedTitle: "Hidden Shirt",
    lockedCopy: "Earn a Certified Perfect Pour to reveal this link.",
    unlockedCopy: "Exclusive hidden shirt unlocked.",
    revealTitle: "Hidden Shirt Unlocked",
    revealCopy: `You unlocked the exclusive ${HIDDEN_SHIRT_NAME}.`,
    revealSubcopy: "This link is hidden until you earn it in Tofu Driver.",
    allowedSources: new Set(["certified_perfect_pour", "route_context_achievement"]),
  },
  [HIDDEN_PENGUIN_SHIRT_ID]: {
    id: HIDDEN_PENGUIN_SHIRT_ID,
    name: HIDDEN_PENGUIN_SHIRT_NAME,
    url: HIDDEN_PENGUIN_SHIRT_URL,
    linkLabel: "View Shirt",
    lockedTitle: "Hidden Penguin Shirt",
    lockedCopy: "Complete a Certified Result with a Penguin selected to reveal this link.",
    unlockedCopy: "Exclusive Penguin shirt unlocked.",
    revealTitle: "Hidden Penguin Shirt Unlocked",
    revealCopy: `You unlocked the exclusive ${HIDDEN_PENGUIN_SHIRT_NAME}.`,
    revealSubcopy: "This hidden shirt appears after a certified Penguin delivery.",
    allowedSources: new Set(["certified_penguin_result", "earned_penguin_collection_unlock"]),
  },
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
  winding_perfect_pour: "Winding Perfect Pour",
  stop_and_go_smooth_pour: "Stop-and-Go Smooth Pour",
  route_context_perfect_pour: "Technical Perfect Pour",
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

const SHOP_MAX_RESOURCE = 10000000000000;
const SHOP_DELIVERY_ORDER_QUEUE_CAP = 1000000;
const SHOP_OFFLINE_BASE_CAP_HOURS = 24;
const SHOP_OFFLINE_MANAGED_CAP_HOURS = 72;
const SHOP_OFFLINE_CAP_HOURS = SHOP_OFFLINE_BASE_CAP_HOURS;
const SHOP_MAX_OFFLINE_CAP_HOURS = SHOP_OFFLINE_MANAGED_CAP_HOURS;
const SHOP_GENERATOR_TICK_MS = 1000;
const SHOP_GENERATOR_SAVE_MS = 5000;
const SHOP_RENDER_THROTTLE_MS = 500;
const SHOP_OPEN_TICK_MAX_SECONDS = 300;
const SHOP_BULK_BUY_LOOP_CAP = 100;
const NET_WORTH_GOAL = 1000000000000;
const NET_WORTH_MILESTONES = [
  { id: "net_worth_1m", amount: 1000000, label: "$1M Net Worth", reachedLabel: "First $1M", reward: "Local Showcase Interest" },
  { id: "net_worth_10m", amount: 10000000, label: "$10M Net Worth", reachedLabel: "First $10M", reward: "Future shop-era opportunity" },
  { id: "net_worth_100m", amount: 100000000, label: "$100M Net Worth", reachedLabel: "First $100M", reward: "Garage Event Board after Tires & Rubber Level 5" },
  { id: "net_worth_1b", amount: 1000000000, label: "$1B Net Worth", reachedLabel: "First $1B", reward: "Future company-scale opportunity" },
  { id: "net_worth_1t", amount: NET_WORTH_GOAL, label: "$1T Net Worth", reachedLabel: "$1T Net Worth", reward: "Long-term goal" },
];
const DREAM_INVESTMENT_TARGET_COST = 50000;
const DREAM_INVESTMENT_TARGET_LABEL = "Wheels";
const DREAM_INVESTMENT_FUND_LABEL = "Wheels Fund";
const DREAM_BUILD_WHEELS_VALUE = 25000;
const DREAM_BUILD_WHEELS_POLISH_COST = 75000;
const DREAM_BUILD_WHEELS_POLISH_VALUE = 40000;
const DREAM_BUILD_WHEELS_FITMENT_COST = 150000;
const DREAM_BUILD_WHEELS_FITMENT_VALUE = 85000;
const DREAM_BUILD_NEXT_TARGET_COST = 250000;
const DREAM_BUILD_EXHAUST_VALUE = 125000;
const DREAM_BUILD_EXHAUST_SEAL_COST = 375000;
const DREAM_BUILD_EXHAUST_SEAL_VALUE = 200000;
const DREAM_BUILD_EXHAUST_TUNED_NOTE_COST = 600000;
const DREAM_BUILD_EXHAUST_TUNED_NOTE_VALUE = 350000;
const DREAM_BUILD_EXHAUST_HEAT_WRAP_COST = 1100000;
const DREAM_BUILD_EXHAUST_HEAT_WRAP_VALUE = 650000;
const DREAM_BUILD_EXHAUST_SHOWCASE_FINISH_COST = 2000000;
const DREAM_BUILD_EXHAUST_SHOWCASE_FINISH_VALUE = 1250000;
const DREAM_BUILD_SUSPENSION_REFRESH_COST = 4000000;
const DREAM_BUILD_SUSPENSION_REFRESH_VALUE = 2000000;
const DREAM_BUILD_SUSPENSION_RIDE_HEIGHT_COST = 7500000;
const DREAM_BUILD_SUSPENSION_RIDE_HEIGHT_VALUE = 4000000;
const DREAM_BUILD_SUSPENSION_ALIGNMENT_COST = 12000000;
const DREAM_BUILD_SUSPENSION_ALIGNMENT_VALUE = 7000000;
const DREAM_BUILD_SUSPENSION_CORNER_BALANCE_COST = 20000000;
const DREAM_BUILD_SUSPENSION_CORNER_BALANCE_VALUE = 12000000;
const DREAM_BUILD_SUSPENSION_SHOWCASE_STANCE_COST = 35000000;
const DREAM_BUILD_SUSPENSION_SHOWCASE_STANCE_VALUE = 22000000;
const DREAM_BUILD_TIRES_SPORTS_COST = 60000000;
const DREAM_BUILD_TIRES_SPORTS_VALUE = 35000000;
const DREAM_BUILD_TIRES_SUMMER_COST = 90000000;
const DREAM_BUILD_TIRES_SUMMER_VALUE = 55000000;
const DREAM_BUILD_TIRES_R_COMPOUND_COST = 135000000;
const DREAM_BUILD_TIRES_R_COMPOUND_VALUE = 85000000;
const DREAM_BUILD_TIRES_SLICKS_COST = 200000000;
const DREAM_BUILD_TIRES_SLICKS_VALUE = 130000000;
const DREAM_BUILD_TIRES_EVENT_SET_COST = 300000000;
const DREAM_BUILD_TIRES_EVENT_SET_VALUE = 200000000;
const DREAM_BUILD_BRAKES_PADS_COST = 450000000;
const DREAM_BUILD_BRAKES_PADS_VALUE = 300000000;
const DREAM_BUILD_BRAKES_SPORTS_KIT_COST = 675000000;
const DREAM_BUILD_BRAKES_SPORTS_KIT_VALUE = 450000000;
const DREAM_BUILD_BRAKES_RACING_KIT_COST = 1000000000;
const DREAM_BUILD_BRAKES_RACING_KIT_VALUE = 700000000;
const DREAM_BUILD_BRAKES_CARBON_BIG_KIT_COST = 1500000000;
const DREAM_BUILD_BRAKES_CARBON_BIG_KIT_VALUE = 1050000000;
const DREAM_BUILD_BRAKES_CONTROL_PACKAGE_COST = 2250000000;
const DREAM_BUILD_BRAKES_CONTROL_PACKAGE_VALUE = 1550000000;
const DREAM_BUILD_INDUCTION_INTERCOOLER_COST = 3500000000;
const DREAM_BUILD_INDUCTION_INTERCOOLER_VALUE = 2500000000;
const DREAM_BUILD_INDUCTION_BOOST_CONTROL_COST = 5250000000;
const DREAM_BUILD_INDUCTION_BOOST_CONTROL_VALUE = 3750000000;
const DREAM_BUILD_INDUCTION_HYBRID_TURBO_COST = 8000000000;
const DREAM_BUILD_INDUCTION_HYBRID_TURBO_VALUE = 6000000000;
const DREAM_BUILD_INDUCTION_BIG_TURBO_COST = 12000000000;
const DREAM_BUILD_INDUCTION_BIG_TURBO_VALUE = 9000000000;
const DREAM_BUILD_INDUCTION_ANTI_LAG_COST = 18000000000;
const DREAM_BUILD_INDUCTION_ANTI_LAG_VALUE = 14000000000;
const DREAM_BUILD_DRIVETRAIN_CLUTCH_COST = 27000000000;
const DREAM_BUILD_DRIVETRAIN_CLUTCH_VALUE = 20000000000;
const DREAM_BUILD_DRIVETRAIN_LSD_COST = 40000000000;
const DREAM_BUILD_DRIVETRAIN_LSD_VALUE = 32000000000;
const DREAM_BUILD_DRIVETRAIN_DRIVESHAFT_COST = 60000000000;
const DREAM_BUILD_DRIVETRAIN_DRIVESHAFT_VALUE = 50000000000;
const DREAM_BUILD_DRIVETRAIN_GEARBOX_COST = 90000000000;
const DREAM_BUILD_DRIVETRAIN_GEARBOX_VALUE = 78000000000;
const DREAM_BUILD_DRIVETRAIN_SEQUENTIAL_COST = 135000000000;
const DREAM_BUILD_DRIVETRAIN_SEQUENTIAL_VALUE = 120000000000;
const DREAM_BUILD_AERO_SPLITTER_COST = 200000000000;
const DREAM_BUILD_AERO_SPLITTER_VALUE = 160000000000;
const DREAM_BUILD_AERO_REAR_AERO_COST = 300000000000;
const DREAM_BUILD_AERO_REAR_AERO_VALUE = 240000000000;
const DREAM_BUILD_AERO_WIDE_BODY_COST = 450000000000;
const DREAM_BUILD_AERO_WIDE_BODY_VALUE = 360000000000;
const DREAM_BUILD_AERO_WEIGHT_REDUCTION_COST = 675000000000;
const DREAM_BUILD_AERO_WEIGHT_REDUCTION_VALUE = 540000000000;
const DREAM_BUILD_AERO_CARBON_CAGE_COST = 1000000000000;
const DREAM_BUILD_AERO_CARBON_CAGE_VALUE = 800000000000;
const DREAM_BUILD_FINAL_DETAIL_COST = 1500000000000;
const DREAM_BUILD_FINAL_DETAIL_VALUE = 1200000000000;
const DREAM_BUILD_SHAKEDOWN_COST = 2500000000000;
const DREAM_BUILD_SHAKEDOWN_VALUE = 2000000000000;
const DREAM_BUILD_TOTAL_WORK_STAGES = 40;
const SHOWCASE_PREP_COST = 500000;
const SHOWCASE_PREP_VALUE = 300000;
const SPONSOR_INQUIRY_CASH_REWARD = 250000;
const SPONSOR_INQUIRY_BRAND_VALUE = 500000;
const GARAGE_BUILD_VALUE_LABEL = "Garage Build Value";
const GARAGE_EVENT_BOARD_NET_WORTH_REQUIREMENT = 100000000;
const GARAGE_EVENTS = [
  {
    id: "local_showcase",
    title: "Local Showcase",
    badge: "Local Showcase Debut",
    cost: 25000000,
    cashReward: 60000000,
    brandValueReward: 40000000,
    garageReputationReward: 25,
    copy: "Bring the build out for its first local showcase. The car finally has an audience.",
    buttonLabel: "Enter Local Showcase",
  },
  {
    id: "sponsor_display",
    title: "Sponsor Display",
    badge: "Sponsor Display",
    cost: 75000000,
    cashReward: 150000000,
    brandValueReward: 250000000,
    garageReputationReward: 50,
    copy: "Put the build in front of people who care about the details.",
    buttonLabel: "Enter Sponsor Display",
  },
  {
    id: "closed_course_exhibition",
    title: "Closed-Course Exhibition",
    badge: "Closed-Course Exhibition",
    cost: 200000000,
    cashReward: 500000000,
    brandValueReward: 750000000,
    garageReputationReward: 100,
    copy: "A fictional closed-course event for a build that has become more than a shop project.",
    buttonLabel: "Enter Exhibition",
  },
  {
    id: "collector_preview",
    title: "Collector Preview",
    badge: "Collector Preview",
    cost: 150000000,
    cashReward: 250000000,
    brandValueReward: 1000000000,
    garageReputationReward: 150,
    copy: "A small collector circle gets a private look at the build.",
    buttonLabel: "Enter Collector Preview",
  },
];
const CAR_MANAGEMENT_HISTORY_LIMIT = 20;
const CAR_MANAGEMENT_CURRENT_CAR_ID = "first_complete_build";
const SECOND_CAR_PROJECT_ID = "second_project_car";
const SECOND_BAY_OPEN_COST = 500000000000;
const SECOND_BAY_OPEN_REPUTATION_COST = 250;
const SECOND_PROJECT_CAR_COST = 1000000000000;
const SECOND_PROJECT_CAR_REPUTATION_COST = 500;
const SECOND_PROJECT_CAR_GARAGE_VALUE = 750000000000;
const CAR_ASSIGNMENTS = [
  {
    id: "showcase_rotation",
    title: "Showcase Rotation",
    buttonLabel: "Start Showcase Rotation",
    durationMs: 15 * 60 * 1000,
    entryCostRate: 0.0025,
    cashRewardRate: 0.0075,
    brandValueRewardRate: 0.005,
    garageReputationReward: 25,
    copy: "Put the completed build into a local showcase rotation.",
  },
  {
    id: "sponsor_demo_day",
    title: "Sponsor Demo Day",
    buttonLabel: "Start Sponsor Demo",
    durationMs: 30 * 60 * 1000,
    entryCostRate: 0.005,
    cashRewardRate: 0.015,
    brandValueRewardRate: 0.01,
    garageReputationReward: 75,
    copy: "Bring the completed build to a sponsor-facing demo day.",
  },
  {
    id: "closed_course_exhibition_booking",
    title: "Closed-Course Exhibition Booking",
    buttonLabel: "Start Exhibition Booking",
    durationMs: 60 * 60 * 1000,
    entryCostRate: 0.01,
    cashRewardRate: 0.03,
    brandValueRewardRate: 0.02,
    garageReputationReward: 150,
    copy: "Book the completed build for a fictional closed-course exhibition.",
  },
];
const GARAGE_TUNING_CATALOG_CATEGORIES = [
  "Tires & Rubber",
  "Suspension & Chassis Geometry",
  "Brakes & Control",
  "Airflow, Intake & Exhaust",
  "Fueling Infrastructure",
  "Induction & Cooling",
  "ECUs & Electronics",
  "Engine Internals & Reliability",
  "Drivetrain & Transmission",
  "Aero, Styling & Weight Reduction",
  "Utility, Restorations & Swaps",
];
const COUNTER_SERVICE_HANDOFF_SECONDS = 10;
const STARTER_TOFU_STOCK = 24;
const TOFU_PRESS_BASE_PER_SECOND = 3 / 60;
const PREP_COUNTER_CONSUME_PER_ORDER = 2;
const PREP_COUNTER_BASE_ORDERS_PER_SECOND = 1 / 40;
const SHOP_ORDER_TIPS_REWARD = 10;
const SHOP_ORDER_REPUTATION_REWARD = 1;
const SHOP_ORDER_XP_REWARD = 8;
const COUNTER_CONTRACTS = [
  {
    id: "wholesale_counter_contract",
    name: "Wholesale Counter Contract",
    buttonLabel: "Sign Wholesale Contract",
    costTips: 250000,
    costReputation: 5000000,
    batchFloor: 100,
    unlockOrderTypeId: "wholesale_case",
    copy: "Turn the busy counter into a wholesale handoff lane.",
    lockedCopy: "Unlocks after Shift Manager is active and Counter Service reaches batch 25.",
  },
  {
    id: "catering_account",
    name: "Catering Account",
    buttonLabel: "Open Catering Account",
    costTips: 2500000,
    costReputation: 12000000,
    batchFloor: 250,
    unlockOrderTypeId: "event_catering_load",
    copy: "Move from walk-up handoffs into recurring catering work.",
    lockedCopy: "Sign the Wholesale Counter Contract first.",
  },
  {
    id: "event_vendor_contract",
    name: "Event Vendor Contract",
    buttonLabel: "Sign Event Vendor Contract",
    costTips: 25000000,
    costReputation: 35000000,
    batchFloor: 1000,
    unlockOrderTypeId: "venue_supply_contract",
    copy: "Let the shop supply larger parked events and vendor tables.",
    lockedCopy: "Open the Catering Account first.",
  },
];
const SHOP_ORDER_TYPES = [
  {
    id: "simple_tofu_box",
    name: "Simple Tofu Box",
    unlock: "available immediately",
    tofuRequired: 6,
    deliveryOrdersRequired: 1,
    tips: SHOP_ORDER_TIPS_REWARD,
    reputation: SHOP_ORDER_REPUTATION_REWARD,
    xp: SHOP_ORDER_XP_REWARD,
    purpose: "tutorial order",
  },
  {
    id: "family_tofu_tray",
    name: "Family Tofu Tray",
    unlock: "after 5 fulfilled orders or Shop Level 2",
    tofuRequired: 24,
    deliveryOrdersRequired: 1,
    tips: 45,
    reputation: 3,
    xp: 24,
    purpose: "makes Tofu Stock matter",
  },
  {
    id: "festival_bento",
    name: "Festival Bento",
    unlock: "after 25 fulfilled orders or 50 Reputation",
    tofuRequired: 75,
    deliveryOrdersRequired: 2,
    tips: 130,
    reputation: 8,
    xp: 70,
    purpose: "first big payout",
  },
  {
    id: "catering_crate",
    name: "Catering Crate",
    unlock: "after 100 fulfilled orders, 250 Reputation, and Shop Level 25",
    tofuRequired: 240,
    deliveryOrdersRequired: 5,
    tips: 520,
    reputation: 25,
    xp: 260,
    purpose: "mid-game stock sink",
  },
  {
    id: "wholesale_case",
    name: "Wholesale Case",
    unlock: "after Wholesale Counter Contract",
    tofuRequired: 1000,
    deliveryOrdersRequired: 25,
    tips: 6500,
    reputation: 150,
    xp: 1500,
    purpose: "high-scale wholesale handoff",
  },
  {
    id: "event_catering_load",
    name: "Event Catering Load",
    unlock: "after Catering Account",
    tofuRequired: 10000,
    deliveryOrdersRequired: 250,
    tips: 100000,
    reputation: 2000,
    xp: 20000,
    purpose: "high-scale catering handoff",
  },
  {
    id: "venue_supply_contract",
    name: "Venue Supply Contract",
    unlock: "after Event Vendor Contract",
    tofuRequired: 100000,
    deliveryOrdersRequired: 2500,
    tips: 1500000,
    reputation: 20000,
    xp: 250000,
    purpose: "high-scale venue supply handoff",
  },
];
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
    description: "Steady counter friends who bring Cash from tips when orders are ready.",
    baseCostTips: 240,
    growthRate: 1.2,
    prepSlotCost: 1,
    unlock: "Shop Sign 1",
    production: "Cash over time",
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

const STATION_MILESTONE_BOOSTS = {
  tofu_press: [
    { threshold: 5, multiplier: 1.5, reward: "Tofu Press output x1.5" },
    { threshold: 10, multiplier: 2, reward: "Tofu Press output x2" },
  ],
  prep_counter: [
    { threshold: 5, multiplier: 1.5, reward: "Prep Counter output x1.5" },
    { threshold: 10, multiplier: 2, reward: "Prep Counter output x2" },
  ],
  delivery_shelf: [
    { threshold: 5, multiplier: 1.25, reward: "Delivery Shelf support x1.25" },
    { threshold: 10, multiplier: 1.5, reward: "Delivery Shelf support x1.5" },
  ],
  shop_sign: [
    { threshold: 5, multiplier: 1.25, reward: "Reputation gain x1.25" },
    { threshold: 10, multiplier: 1.5, reward: "Reputation gain x1.5" },
  ],
};

const STATION_UPGRADES = [
  { id: "tofu_press_faster", stationId: "tofu_press", name: "Steady Pressing", costTips: 20, effect: "Tofu Press output x1.5", maxLevel: 10 },
  { id: "tofu_press_double", stationId: "tofu_press", name: "Double Mold", costTips: 40, effect: "Tofu Press output x2", maxLevel: 8 },
  { id: "prep_counter_faster", stationId: "prep_counter", name: "Tidy Packaging", costTips: 20, effect: "Prep Counter output x1.5", maxLevel: 10 },
  { id: "prep_counter_double", stationId: "prep_counter", name: "Double Labels", costTips: 120, effect: "Prep Counter output x2", maxLevel: 8 },
  { id: "delivery_shelf_faster", stationId: "delivery_shelf", name: "Neat Handoff", costTips: 220, effect: "Delivery Shelf boost +20%", maxLevel: 8 },
  { id: "delivery_shelf_double", stationId: "delivery_shelf", name: "Double Stack", costTips: 320, effect: "Delivery Shelf capacity +30%", maxLevel: 8 },
  { id: "shop_sign_faster", stationId: "shop_sign", name: "Brighter Sign", costTips: 360, effect: "Reputation from orders +20%", maxLevel: 8 },
  { id: "shop_sign_double", stationId: "shop_sign", name: "Word of Mouth", costTips: 520, effect: "Customer tip gain +20%", maxLevel: 8 },
  { id: "counter_service_bell", stationId: "counter_service", name: "Order Bell", costTips: 180, effect: "Counter Service interval 10 sec -> 8 sec", maxLevel: 1 },
  { id: "counter_service_wide", stationId: "counter_service", name: "Wider Counter", costTips: 320, effect: "Counter Service interval 8 sec -> 6 sec", maxLevel: 1 },
  { id: "counter_service_routine", stationId: "counter_service", name: "Pickup Routine", costTips: 520, effect: "Counter Service interval 6 sec -> 4 sec", maxLevel: 1 },
  { id: "counter_service_register", stationId: "counter_service", name: "Second Register", costTips: 1200, effect: "Counter Service batch size 1 -> 2", maxLevel: 1 },
  { id: "counter_service_window", stationId: "counter_service", name: "Pickup Window", costTips: 4200, effect: "Counter Service batch size 2 -> 5", maxLevel: 1 },
  { id: "counter_service_crew", stationId: "counter_service", name: "Counter Crew", costTips: 18000, effect: "Counter Service batch size 5 -> 10", maxLevel: 1 },
  { id: "soy_supplier_contract", stationId: "supplier_contract", name: "Soy Supplier Contract", costReputation: 25000, effect: "Tofu supply +250/sec", maxLevel: 1, supplierStockPerSecond: 250 },
  { id: "morning_soy_delivery", stationId: "supplier_contract", name: "Morning Soy Delivery", costReputation: 75000, effect: "Tofu supply +750/sec", maxLevel: 1, supplierStockPerSecond: 750 },
  { id: "bulk_soy_delivery", stationId: "supplier_contract", name: "Bulk Soy Delivery", costReputation: 200000, effect: "Tofu supply +2000/sec", maxLevel: 1, supplierStockPerSecond: 2000 },
  { id: "manager_shift_manager", stationId: "manager_desk", name: "Hire Shift Manager", costTips: 75000, costReputation: 1000000, effect: "Counter Service batch size 10 -> 25", maxLevel: 1 },
  { id: "manager_wholesale_pickup", stationId: "manager_desk", name: "Wholesale Pickup", costTips: 125000, costReputation: 1500000, effect: "Clears capped waiting-order batches when supplied", maxLevel: 1 },
  { id: "regular_customer_faster", stationId: "regular_customer", name: "Loyalty Card", costTips: 650, effect: "Regular Customer tips +25%", maxLevel: 8 },
  { id: "regular_customer_double", stationId: "regular_customer", name: "Bring a Friend", costTips: 880, effect: "Regular Customer output +50%", maxLevel: 8 },
  { id: "route_familiarity", stationId: "delivery_route", name: "Route Familiarity", costTips: 1000, effect: "Fictional route rewards +20%", maxLevel: 8 },
  { id: "careful_notes", stationId: "delivery_route", name: "Careful Notes", costTips: 1300, effect: "Route knowledge +25%", maxLevel: 8 },
  { id: "better_clipboard", stationId: "dispatcher_desk", name: "Better Clipboard", costTips: 1600, effect: "Crew automation +20%", maxLevel: 6 },
  { id: "team_routine", stationId: "dispatcher_desk", name: "Team Routine", costTips: 2200, effect: "Automated route tips +20%", maxLevel: 6 },
  { id: "network_calendar", stationId: "regional_network", name: "Network Calendar", costTips: 3200, effect: "All shop production +10%", maxLevel: 5 },
];

const STATION_UPGRADE_DISPLAY_ORDER = [
  "counter_service_bell",
  "counter_service_wide",
  "counter_service_routine",
  "counter_service_register",
  "counter_service_window",
  "counter_service_crew",
  "manager_shift_manager",
  "manager_wholesale_pickup",
  "prep_counter_faster",
  "tofu_press_faster",
  "tofu_press_double",
  "prep_counter_double",
  "delivery_shelf_faster",
  "delivery_shelf_double",
  "shop_sign_faster",
  "shop_sign_double",
  "regular_customer_faster",
  "regular_customer_double",
  "soy_supplier_contract",
  "morning_soy_delivery",
  "bulk_soy_delivery",
];

const STATION_UPGRADE_DISPLAY_INDEX = STATION_UPGRADE_DISPLAY_ORDER.reduce((lookup, upgradeId, index) => {
  lookup[upgradeId] = index;
  return lookup;
}, {});

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
const SPIRIT_GENERATOR_MAX_LEVEL = 25;
const SPIRIT_GENERATOR_BULK_PURCHASE_CAP = 500;

const SHOP_SPIRIT_BOOSTS = [
  { id: "rush_prep", name: "Rush Stock", costSpirit: 10, type: "instant_tofu", seconds: 30, description: "Adds 30 seconds of Tofu Stock production. Useful when Counter Service is waiting for Tofu Stock." },
  { id: "warm_counter", name: "Warm Counter", costSpirit: 15, type: "instant_orders", seconds: 30, description: "Adds 30 seconds of order prep. Useful when Counter Service is waiting for ready orders." },
  { id: "busy_lunch", name: "Busy Lunch Hour", costSpirit: 20, type: "tips_multiplier", multiplier: 1.5, durationSeconds: 900, description: "Temporary shop Cash boost." },
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
  { id: "prep_slot_regen", name: "Extra Prep Capacity recovery", costStars: 2, effect: "Prep Capacity recovers more often." },
  { id: "shop_multiplier", name: "Small shop production multiplier", costStars: 2, effect: "All shop production +10%." },
];

const TOFU_GARAGE_ROUTES_ENABLED = false;
const DEFERRED_ROUTE_STATION_IDS = new Set(["delivery_route", "dispatcher_desk", "regional_network"]);
const DEFERRED_ROUTE_UPGRADE_STATION_IDS = new Set(["delivery_route", "dispatcher_desk", "regional_network"]);
const DEFERRED_ROUTE_CREW_ROLE_IDS = new Set(["apprentice_driver", "dispatcher", "route_scout", "night_driver"]);

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
  {
    id: "mika",
    name: "Mika",
    role: "Night Shift Manager",
    unlock: "Future Mika character pack",
    flavor: "Sharp, calm, and quietly impressed by smooth deliveries.",
  },
  {
    id: "penguin_driver",
    name: "Penguin Driver",
    role: "Mascot Driver",
    unlock: "Penguin mascot collectible",
    flavor: "A compact mascot avatar for parked Delivery Crew cards.",
  },
  {
    id: "penguin_delivery_buddy",
    name: "Penguin Delivery Buddy",
    role: "Delivery Buddy",
    unlock: "Penguin buddy collectible",
    flavor: "A cheerful tofu-delivery buddy for parked collection flavor.",
  },
  {
    id: "penguin_tofu_driver_sticker",
    name: "Tofu Driver Penguin Sticker",
    role: "Sticker",
    unlock: "Penguin sticker collectible",
    flavor: "A badge-like Tofu Driver collectible for parked sticker shelves.",
  },
];

const CHARACTER_ART_SLOTS = {
  shop_assistant_main_portrait: {
    label: "Shop Assistant",
    purpose: "Tofu Shop overview helper",
    placeholder: "Character art coming soon",
    imageType: "bust portrait",
    aspectRatio: "4:5",
  },
  shop_hint_expression_neutral: {
    label: "Shop Hint",
    purpose: "Tofu Shop recommendation panel",
    placeholder: "Crew portrait not yet assigned",
    imageType: "expression portrait",
    aspectRatio: "1:1",
  },
  result_screen_cameo: {
    label: "Result Cameo",
    purpose: "Post-run result screen",
    placeholder: "Result cameo art pending",
    imageType: "portrait cameo",
    aspectRatio: "4:5",
  },
  coach_recap_expression_neutral: {
    label: "Coach Recap",
    purpose: "Post-run smooth-control recap",
    placeholder: "Coach portrait not yet assigned",
    imageType: "expression portrait",
    aspectRatio: "4:5",
  },
  coach_recap_expression_pleased: {
    label: "Coach Recap",
    purpose: "Post-run positive smooth-control recap",
    placeholder: "Coach portrait not yet assigned",
    imageType: "expression portrait",
    aspectRatio: "4:5",
  },
  reward_unlock_card_art: {
    label: "Reward Art",
    purpose: "Unlock and reward popup",
    placeholder: "Reward art pending",
    imageType: "card illustration",
    aspectRatio: "16:9",
  },
  crew_profile_card: {
    label: "Crew Profile",
    purpose: "Delivery Crew collection card",
    placeholder: "Crew portrait not yet assigned",
    imageType: "crew profile portrait",
    aspectRatio: "4:5",
  },
  stamp_fanfare_cameo: {
    label: "Stamp Cameo",
    purpose: "Passport stamp fanfare",
    placeholder: "Stamp cameo art pending",
    imageType: "reward splash cameo",
    aspectRatio: "4:3",
  },
  share_card_cameo_optional: {
    label: "Share Card Cameo",
    purpose: "Optional share-card flavor",
    placeholder: "Share cameo art pending",
    imageType: "small portrait cameo",
    aspectRatio: "1:1",
  },
};

const CHARACTER_ART_MANIFEST = {
  angry_tofu_driver: {},
  sleepy_dispatcher: {},
  tea_master: {},
  perfect_pour_courier: {},
  mika: {
    shop_assistant_main_portrait: {
      src: "/static/nospill/images/shop_assistant_main_portrait.webp",
      alt: "Mika, the Night Shift Manager, holding a clipboard in the Tofu Shop.",
    },
    result_screen_cameo: {
      src: "/static/nospill/images/result_screen_cameo.webp",
      alt: "Mika calmly reviewing a completed smooth delivery.",
    },
    coach_recap_expression_neutral: {
      src: "/static/nospill/images/coach_neutral.webp",
      alt: "Mika with a calm coaching expression.",
    },
    coach_recap_expression_pleased: {
      src: "/static/nospill/images/coach_pleased.webp",
      alt: "Mika looking quietly pleased with the smooth delivery.",
    },
    crew_profile_card: {
      src: "/static/nospill/images/crew_profile_card.webp",
      alt: "Mika crew profile portrait.",
    },
    reward_unlock_card_art: {
      src: "/static/nospill/images/reward_unlock_splash.webp",
      alt: "Mika in a restrained reward splash for parked unlock moments.",
    },
    stamp_fanfare_cameo: {
      src: "/static/nospill/images/reward_unlock_splash.webp",
      alt: "Mika in a restrained reward splash for parked unlock moments.",
    },
  },
  penguin_driver: {
    crew_profile_card: {
      src: "/static/nospill/images/penguin_driver_icon.webp",
      alt: "Penguin Driver mascot icon for parked Delivery Crew cards.",
    },
  },
  penguin_delivery_buddy: {
    crew_profile_card: {
      src: "/static/nospill/images/penguin_delivery_buddy.webp",
      alt: "Cheerful penguin delivery buddy holding tofu.",
    },
  },
  penguin_tofu_driver_sticker: {
    crew_profile_card: {
      src: "/static/nospill/images/penguin_tofu_driver_sticker.webp",
      alt: "Monochrome Tofu Driver penguin sticker badge.",
    },
  },
};

const TOFU_SHOP_SCENE_ASSETS = {
  scene_tiny_shop_empty: {
    src: "/static/nospill/images/scene_tiny_shop_empty.webp",
    label: "Tiny Shop",
    placeholder: "Tiny shop scene pending",
    kind: "full_scene",
  },
  scene_tiny_shop_working: {
    src: "/static/nospill/images/scene_tiny_shop_working.webp",
    label: "Working Shop",
    placeholder: "Working shop scene pending",
    kind: "full_scene",
  },
  scene_tiny_shop_upgraded: {
    src: "/static/nospill/images/scene_tiny_shop_upgraded.webp",
    label: "Growing Shop",
    placeholder: "Growing shop scene pending",
    kind: "full_scene",
  },
  scene_busy_shop_established: {
    src: "/static/nospill/images/scene_tiny_shop_upgraded.webp",
    label: "Busy Shop",
    placeholder: "Established shop scene pending",
    kind: "full_scene",
  },
  scene_busy_shop_with_covered_car: {
    src: "/static/nospill/images/scene_busy_shop_with_covered_car.webp",
    label: "Old Car Out Back",
    placeholder: "Covered car scene pending",
    kind: "full_scene",
  },
};

const STORY_SPLASH_ASSETS = {
  old_car_out_back_story_splash: {
    src: "/static/nospill/images/old_car_out_back_story_splash.webp",
    label: "Old Car Out Back",
    alt: "An old car waiting under a cover behind the Tofu Shop.",
  },
};

const TOFU_SHOP_SCENE_THRESHOLDS = {
  workingOrders: 3,
  upgradedOrders: 10,
  upgradedLifetimeTips: 100,
  establishedOrders: 25,
  establishedDeliveryShelves: 5,
  establishedShopSigns: 5,
  coveredCarOrders: 25,
};

const COVERED_CAR_TEASER_ID = "dream_build_teaser_v1";

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
    name: "Shaky Local Result",
    cargoProfileId: "egg_carton",
    cargoCondition: 62,
    qualificationStatus: "practice",
    routeType: "Local Route",
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
    routeType: "Local Route",
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
  first_100_tips: "First $100 Cash",
  first_upgrade_purchased: "First Upgrade Purchased",
  first_family_tofu_tray: "First Family Tofu Tray",
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
  winding_perfect_pour: "Winding Perfect Pour",
  stop_and_go_smooth_pour: "Stop-and-Go Smooth Pour",
  route_context_perfect_pour: "Technical Perfect Pour",
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
  mode: "qualified",
  difficulty: "soft_tofu",
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
  shareTrailMode: SHARE_CARD_TRAIL_MODES.abstract,
  shareTrailModeUserSelected: false,
  resultStoryCaption: "",
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
  shopInlineResult: "",
  detailOpenState: {},
  shopStoryTeaser: null,
  summaryMode: null,
  shopResultCanFulfillAnother: false,
  currentStampFanfare: null,
  currentDiscoveryFanfare: null,
  pendingDiscoveryFanfare: null,
  highlightedShopTab: "",
  simulatorViewedTracked: false,
  offlineProgressAnalyticsKey: "",
  lastShopRenderAt: 0,
  lastShopRenderSignature: "",
};

let elements = {};
let tofuCargoMascotImage = null;

const ANALYTICS_OPT_OUT_KEY = "tofuDriverAnalyticsOptOut";
const ANALYTICS_EVENT_PREFIX = "tofu_driver_";
const ANALYTICS_ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "td_source",
  "td_campaign",
];
const ANALYTICS_DENIED_PROPERTY_KEYS = new Set([
  "gps",
  "lat",
  "lng",
  "latitude",
  "longitude",
  "coordinates",
  "coords",
  "route",
  "routetrace",
  "street",
  "address",
  "location",
  "map",
  "speed",
  "averagespeed",
  "topspeed",
  "speedhistory",
  "rawmotion",
  "motion",
  "acceleration",
  "gforce",
  "devicemotion",
  "sensor",
  "sensordiagnostics",
  "localstorage",
  "savefile",
  "exactdistance",
  "distancemiles",
  "licenseplate",
]);

const analyticsState = {
  initialized: false,
  enabled: false,
  scriptLoading: false,
  lastRouteView: "",
  firstPageViewTracked: false,
  attribution: null,
  returnVisitTracked: false,
  shopStartedTracked: false,
  firstLoopTracked: false,
};

function booleanConfigValue(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  const normalized = String(value || "").trim().toLowerCase();
  return ["1", "true", "yes", "on"].includes(normalized);
}

function analyticsConfig() {
  const source = typeof window !== "undefined" && window.TOFU_DRIVER_CONFIG
    ? window.TOFU_DRIVER_CONFIG
    : {};
  return {
    enabled: booleanConfigValue(source.posthogEnabled || source.TOFU_DRIVER_POSTHOG_ENABLED),
    key: String(source.posthogKey || source.TOFU_DRIVER_POSTHOG_KEY || "").trim(),
    host: String(source.posthogHost || source.TOFU_DRIVER_POSTHOG_HOST || "https://us.i.posthog.com").trim(),
    debug: booleanConfigValue(source.posthogDebug || source.TOFU_DRIVER_POSTHOG_DEBUG),
  };
}

function analyticsLocalStorage() {
  try {
    return typeof window !== "undefined" && window.localStorage ? window.localStorage : null;
  } catch (_) {
    return null;
  }
}

function analyticsOptedOut() {
  const storage = analyticsLocalStorage();
  return Boolean(storage && storage.getItem(ANALYTICS_OPT_OUT_KEY) === "true");
}

function setAnalyticsOptOut(optedOut) {
  const storage = analyticsLocalStorage();
  if (storage) {
    if (optedOut) storage.setItem(ANALYTICS_OPT_OUT_KEY, "true");
    else storage.removeItem(ANALYTICS_OPT_OUT_KEY);
  }
  if (typeof window !== "undefined" && window.posthog) {
    if (optedOut && typeof window.posthog.opt_out_capturing === "function") {
      window.posthog.opt_out_capturing();
    } else if (!optedOut && typeof window.posthog.opt_in_capturing === "function") {
      window.posthog.opt_in_capturing();
    }
  }
}

function respectsDoNotTrack() {
  const nav = typeof navigator !== "undefined" ? navigator : null;
  const win = typeof window !== "undefined" ? window : null;
  const value = nav && (nav.doNotTrack || nav.msDoNotTrack)
    ? nav.doNotTrack || nav.msDoNotTrack
    : win && win.doNotTrack;
  return ["1", "yes"].includes(String(value || "").toLowerCase());
}

function safeAnalyticsString(value, maxLength = 80) {
  return String(value || "")
    .trim()
    .replace(/[^A-Za-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, maxLength);
}

function normalizedAnalyticsKey(key) {
  return String(key || "").replace(/[^A-Za-z0-9]/g, "").toLowerCase();
}

function sanitizeAnalyticsProperties(properties = {}) {
  if (!properties || typeof properties !== "object" || Array.isArray(properties)) return {};
  return Object.entries(properties).reduce((safe, [key, value]) => {
    const normalizedKey = normalizedAnalyticsKey(key);
    if (!normalizedKey || ANALYTICS_DENIED_PROPERTY_KEYS.has(normalizedKey)) return safe;
    if (value === null || value === undefined) return safe;
    if (typeof value === "boolean") {
      safe[key] = value;
    } else if (typeof value === "number") {
      if (Number.isFinite(value)) safe[key] = value;
    } else if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed && trimmed.length <= 120) safe[key] = trimmed;
    }
    return safe;
  }, {});
}

function safeCampaignProperties(searchValue = null) {
  const search = searchValue !== null
    ? String(searchValue || "")
    : typeof window !== "undefined" && window.location
      ? String(window.location.search || "")
      : "";
  if (!search) return {};
  let params;
  try {
    params = new URLSearchParams(search.charAt(0) === "?" ? search : `?${search}`);
  } catch (_) {
    return {};
  }
  return ANALYTICS_ATTRIBUTION_KEYS.reduce((safe, key) => {
    const value = safeAnalyticsString(params.get(key) || "", 64);
    if (value) safe[key] = value;
    return safe;
  }, {});
}

function analyticsCanRun(config = analyticsConfig()) {
  return Boolean(config.enabled && config.key && !analyticsOptedOut() && !respectsDoNotTrack());
}

function postHogInitOptions(config) {
  return {
    api_host: config.host,
    capture_pageview: false,
    autocapture: false,
    disable_session_recording: true,
    disable_surveys: true,
    loaded(posthog) {
      if (config.debug && typeof console !== "undefined" && console.debug) {
        console.debug("[analytics] posthog_loaded");
      }
      if (config.debug && posthog && typeof posthog.debug === "function") posthog.debug();
    },
  };
}

function postHogScriptHost(host) {
  const normalized = String(host || "https://us.i.posthog.com").replace(/\/+$/, "");
  if (/\.i\.posthog\.com$/i.test(normalized)) {
    return normalized.replace(/\.i\.posthog\.com$/i, "-assets.i.posthog.com");
  }
  return normalized;
}

function initPostHogClient(config) {
  if (typeof window === "undefined" || !window.posthog || typeof window.posthog.init !== "function") {
    return false;
  }
  try {
    window.posthog.init(config.key, postHogInitOptions(config));
    analyticsState.initialized = true;
    analyticsState.enabled = true;
    return true;
  } catch (_) {
    analyticsState.initialized = false;
    analyticsState.enabled = false;
    return false;
  }
}

function initAnalytics() {
  const config = analyticsConfig();
  if (!analyticsCanRun(config)) {
    analyticsState.enabled = false;
    analyticsState.initialized = false;
    return false;
  }
  analyticsState.attribution = safeCampaignProperties();
  if (initPostHogClient(config)) return true;
  if (
    typeof window === "undefined"
    || typeof window.posthog !== "undefined"
    || typeof document === "undefined"
    || analyticsState.scriptLoading
  ) {
    return false;
  }
  window.posthog = {
    _i: [],
    init(apiKey, options, name) {
      this._i.push([apiKey, options, name]);
    },
  };
  initPostHogClient(config);
  if (
    typeof document === "undefined"
    || analyticsState.scriptLoading
  ) {
    return false;
  }
  analyticsState.scriptLoading = true;
  try {
    const script = document.createElement("script");
    script.async = true;
    script.src = `${postHogScriptHost(config.host)}/static/array.js`;
    script.onload = () => {
      analyticsState.scriptLoading = false;
      initPostHogClient(config);
    };
    script.onerror = () => {
      analyticsState.scriptLoading = false;
      analyticsState.enabled = false;
      analyticsState.initialized = false;
    };
    (document.head || document.documentElement).appendChild(script);
    return true;
  } catch (_) {
    analyticsState.scriptLoading = false;
    analyticsState.enabled = false;
    analyticsState.initialized = false;
    return false;
  }
}

function trackEvent(eventName, properties = {}) {
  const config = analyticsConfig();
  if (!analyticsCanRun(config)) return false;
  if (!analyticsState.initialized && !initAnalytics()) return false;
  if (typeof window === "undefined" || !window.posthog || typeof window.posthog.capture !== "function") {
    return false;
  }
  const safeName = String(eventName || "").startsWith(ANALYTICS_EVENT_PREFIX)
    ? String(eventName)
    : `${ANALYTICS_EVENT_PREFIX}${safeAnalyticsString(eventName || "event", 80)}`;
  const baseProperties = sanitizeAnalyticsProperties(properties);
  const attribution = analyticsState.firstPageViewTracked ? {} : analyticsState.attribution || safeCampaignProperties();
  try {
    window.posthog.capture(safeName, sanitizeAnalyticsProperties({
      ...attribution,
      ...baseProperties,
    }));
    return true;
  } catch (_) {
    return false;
  }
}

function analyticsViewName(surface) {
  if (surface === "shop") return "shop";
  if (surface === "crew") return "crew";
  if (surface === "settings") return "settings";
  return "cup_test";
}

function trackRouteView(surface) {
  const view = analyticsViewName(surface);
  if (analyticsState.lastRouteView === view) return false;
  analyticsState.lastRouteView = view;
  const firstVisit = !analyticsState.firstPageViewTracked;
  trackEvent("tofu_driver_page_view", { view, first_visit: firstVisit });
  analyticsState.firstPageViewTracked = true;
  if (view === "cup_test") trackEvent("tofu_driver_cup_test_viewed", { view });
  if (view === "shop") trackEvent("tofu_driver_shop_viewed", { view });
  if (!analyticsState.returnVisitTracked) {
    const storage = analyticsLocalStorage();
    const today = new Date().toISOString().slice(0, 10);
    const lastVisit = storage ? storage.getItem("tofuDriverAnalyticsLastVisitDate") : "";
    if (storage) storage.setItem("tofuDriverAnalyticsLastVisitDate", today);
    if (lastVisit && lastVisit !== today) {
      trackEvent("tofu_driver_return_visit", { view });
    }
    analyticsState.returnVisitTracked = true;
  }
  return true;
}

function cargoConditionBucket(value) {
  const percent = Number(value || 0);
  if (percent < 50) return "0_49";
  if (percent < 80) return "50_79";
  if (percent < 95) return "80_94";
  return "95_100";
}

function shopResourceBucket(value) {
  const amount = Math.max(0, Number(value || 0));
  if (amount < 1) return "0";
  if (amount < 10) return "1_9";
  if (amount < 100) return "10_99";
  if (amount < 1000) return "100_999";
  if (amount < 10000) return "1k_9k";
  return "10k_plus";
}

function quantityBucket(value) {
  const amount = Math.max(0, Number(value || 0));
  if (amount <= 1) return "1";
  if (amount < 10) return "2_9";
  if (amount < 100) return "10_99";
  return "100_plus";
}

function modeAnalyticsLabel(mode) {
  if (mode === "qualified") return "qualified";
  if (mode === "simulated") return "simulated";
  return "basic";
}

function trackCupTestStartedAnalytics(options = {}) {
  return trackEvent("tofu_driver_cup_test_started", {
    mode: modeAnalyticsLabel(options.mode || appState.mode),
    simulator: Boolean(options.simulator),
  });
}

function trackCupTestCompletedAnalytics(summary) {
  if (!summary) return false;
  const qualified = isQualifiedSession(summary);
  return trackEvent("tofu_driver_cup_test_completed", {
    mode: modeAnalyticsLabel(summary.mode),
    simulator: Boolean(summary.simulated),
    qualification_status: summary.qualificationStatus || (qualified ? "qualified" : "practice_only"),
    cargo_condition_bucket: cargoConditionBucket(summary.cargoCondition ?? summary.waterLeft),
    rank: displayRankForSession(summary),
    practice_only: !qualified,
    certified_boost_earned: Boolean(summary.deliveryRewards && summary.deliveryRewards.shop && summary.deliveryRewards.shop.certifiedBoost && summary.deliveryRewards.shop.certifiedBoost.applied),
  });
}

function shopAnalyticsProperties(gameState = currentGameState()) {
  const state = normalizeGameState(gameState);
  return {
    shop_level: safeNonNegativeInteger(state.shop.shopLevel, 1, 1000),
    tips_bucket: shopResourceBucket(state.shop.tips),
    tofu_stock_bucket: shopResourceBucket(state.shop.tofuStock),
    delivery_order_bucket: shopResourceBucket(readyDeliveryOrders(state.shop)),
    first_shop_order_completed: Boolean(state.stamps.first_shop_order),
    first_loop_completed: Boolean(state.stamps.first_shop_order && state.stamps.first_upgrade_purchased),
  };
}

function trackShopOrderFulfilledAnalytics(result) {
  if (!result || !result.ok) return false;
  const state = normalizeGameState(result.gameState);
  if (!analyticsState.shopStartedTracked) {
    trackEvent("tofu_driver_shop_started", shopAnalyticsProperties(state));
    analyticsState.shopStartedTracked = true;
  }
  const tracked = trackEvent("tofu_driver_shop_order_fulfilled", {
    ...shopAnalyticsProperties(state),
    order_type: result.orderType && result.orderType.id ? result.orderType.id : "shop_order",
    quantity_bucket: quantityBucket(result.quantity),
    first_order: Boolean(result.firstShopOrderStampUnlocked),
  });
  if (!analyticsState.firstLoopTracked && state.stamps.first_shop_order && state.stamps.first_upgrade_purchased) {
    trackEvent("tofu_driver_first_loop_completed", shopAnalyticsProperties(state));
    analyticsState.firstLoopTracked = true;
  }
  return tracked;
}

function trackShopPurchaseAnalytics(eventName, result, idKey) {
  if (!result || !result.ok) return false;
  const state = normalizeGameState(result.gameState);
  const props = {
    ...shopAnalyticsProperties(state),
    quantity_bucket: quantityBucket(result.quantity || 1),
  };
  if (idKey === "upgrade_id" && result.upgrade) props.upgrade_id = result.upgrade.id;
  if (idKey === "generator_id" && result.station) props.generator_id = result.station.id;
  const tracked = trackEvent(eventName, props);
  if (!analyticsState.firstLoopTracked && state.stamps.first_shop_order && state.stamps.first_upgrade_purchased) {
    trackEvent("tofu_driver_first_loop_completed", shopAnalyticsProperties(state));
    analyticsState.firstLoopTracked = true;
  }
  return tracked;
}

function trackShareAnalytics(eventName, summary, extra = {}) {
  if (!summary) return false;
  const resultType = summary.simulated
    ? "simulated"
    : isQualifiedSession(summary)
      ? "qualified"
      : "practice";
  return trackEvent(eventName, {
    result_type: resultType,
    simulator: Boolean(summary.simulated),
    ...extra,
  });
}

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
    thresholdG = CARGO_TYPES.soft_tofu.thresholdG,
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

function normalizeCargoTypeId(value) {
  const raw = typeof value === "string" ? value : "";
  const mapped = LEGACY_CARGO_TYPE_IDS[raw] || raw;
  return CARGO_TYPES[mapped] ? mapped : "soft_tofu";
}

function cargoTypeProfile(value) {
  const id = normalizeCargoTypeId(value);
  return { id, ...CARGO_TYPES[id] };
}

function formatTripDuration(seconds) {
  const total = Math.max(0, Math.round(Number(seconds || 0)));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function tripTimeBucket(seconds) {
  const duration = Math.max(0, Number(seconds || 0));
  if (duration >= 45 * 60) return "Long Pour";
  if (duration >= 10 * 60) return "Daily Pour";
  return "Short Pour";
}

function motionSign(value, threshold = 0.035) {
  const numeric = Number(value || 0);
  if (numeric > threshold) return 1;
  if (numeric < -threshold) return -1;
  return 0;
}

function boundedCupTrailPoint(value) {
  return roundTo(clamp(Number(value || 0), -1, 1), 2);
}

function appendCupTrailPoint(points, value, maxPoints = 36) {
  const source = Array.isArray(points) ? points : [];
  const next = [...source, boundedCupTrailPoint(value)];
  if (next.length <= maxPoints) return next;
  const merged = [];
  for (let index = 0; index < next.length; index += 2) {
    if (index + 1 < next.length) {
      merged.push(boundedCupTrailPoint((next[index] + next[index + 1]) / 2));
    } else {
      merged.push(next[index]);
    }
  }
  return merged.slice(-maxPoints);
}

function summarizeDriveShape(input = {}) {
  const samples = Math.max(0, safeNonNegativeInteger(
    input.samples ?? input.sampleCount ?? input.motionSamples,
    0,
    1000000,
  ));
  const durationSeconds = Math.max(0, Number(input.durationSeconds || 0));
  const cargoCondition = safeNonNegativeNumber(input.cargoCondition, 0, 100);
  const roughCount = safeNonNegativeInteger(input.roughCount, 0, 1000000)
    + safeNonNegativeInteger(input.harshInputCount, 0, 1000000);
  const lateralSignChanges = safeNonNegativeInteger(input.lateralSignChanges, 0, 1000000);
  const longitudinalSignChanges = safeNonNegativeInteger(input.longitudinalSignChanges, 0, 1000000);
  const lateralAverage = samples > 0
    ? safeNonNegativeNumber(input.lateralAbsSum, 0, 1000000) / samples
    : safeNonNegativeNumber(input.lateralAverage, 0, 10);
  const longitudinalAverage = samples > 0
    ? safeNonNegativeNumber(input.longitudinalAbsSum, 0, 1000000) / samples
    : safeNonNegativeNumber(input.longitudinalAverage, 0, 10);
  const roughRate = samples > 0 ? roughCount / samples : roughCount;

  if (longitudinalSignChanges >= 8 && (longitudinalAverage > 0.08 || roughCount >= 4)) return "Stop-and-Go Pour";
  if (lateralSignChanges >= 6 && lateralAverage >= 0.08 && roughRate < 0.12) return "Winding Pour";
  if (durationSeconds >= 45 * 60 && cargoCondition >= 80 && roughRate < 0.08) return "Long Pour";
  if (durationSeconds >= 10 * 60 && cargoCondition >= 85 && roughRate < 0.06) return "Daily Pour";
  if (lateralAverage >= 0.035 || lateralSignChanges >= 2 || longitudinalAverage >= 0.035) return "Rolling Pour";
  return "Calm Pour";
}

function cupTrailPath(points, width = 320, height = 96) {
  const safePoints = Array.isArray(points) && points.length
    ? points.map(boundedCupTrailPoint).slice(0, 48)
    : [0, 0.08, -0.06, 0.04, 0];
  if (safePoints.length < 2) safePoints.push(0);
  return safePoints.map((point, index) => {
    const x = safePoints.length === 1 ? width / 2 : (index / (safePoints.length - 1)) * width;
    const y = height / 2 + point * (height * 0.36);
    return `${index === 0 ? "M" : "L"} ${roundTo(x, 1)} ${roundTo(y, 1)}`;
  }).join(" ");
}

function renderCupTrail(summary = {}) {
  const points = Array.isArray(summary.cupTrail) ? summary.cupTrail : [];
  const label = "Decorative Cup Trail showing the run's smooth left and right motion pattern.";
  const path = cupTrailPath(points);
  return `
    <section class="nospill-cup-trail" aria-label="Cup Trail">
      <div class="nospill-cup-trail-head">
        <span>Cup Trail</span>
        <strong>${escapeHtml(summary.driveShape || "Rolling Pour")}</strong>
      </div>
      <svg viewBox="0 0 320 96" role="img" aria-label="${escapeHtml(label)}" focusable="false">
        <path class="nospill-cup-trail-guide" d="M 0 48 L 320 48"></path>
        <path class="nospill-cup-trail-line" d="${escapeHtml(path)}"></path>
      </svg>
      <small>${escapeHtml(label)} Decorative only; it is not a real-world path.</small>
    </section>
  `;
}

function routeOutlinePath(points, width = 320, height = 140) {
  const safePoints = (Array.isArray(points) ? points : [])
    .filter((point) => Number.isFinite(Number(point.x)) && Number.isFinite(Number(point.y)))
    .slice(0, 80);
  if (safePoints.length < 2) return "";
  return safePoints.map((point, index) => {
    const x = clamp(Number(point.x), 0, 1) * width;
    const y = clamp(Number(point.y), 0, 1) * height;
    return `${index === 0 ? "M" : "L"} ${roundTo(x, 1)} ${roundTo(y, 1)}`;
  }).join(" ");
}

function renderRouteArtifact(summary = {}, mode = activeShareTrailMode(summary)) {
  const outline = Array.isArray(summary.normalizedRouteOutline)
    ? summary.normalizedRouteOutline.slice(0, 80)
    : [];
  if (mode === SHARE_CARD_TRAIL_MODES.routeOutline && outline.length >= 2) {
    const width = 320;
    const height = 140;
    const path = routeOutlinePath(outline, width, height);
    const markerStep = Math.max(1, Math.floor(outline.length / 14));
    const markers = outline
      .map((point, index) => ({ point, index }))
      .filter(({ index }) => index % markerStep === 0 || index === outline.length - 1)
      .map(({ point }) => {
        const smoothness = ["steady", "mixed", "messy"].includes(point.smoothness) ? point.smoothness : "mixed";
        return `<circle class="nospill-route-outline-marker is-${smoothness}" cx="${escapeHtml(String(roundTo(clamp(Number(point.x), 0, 1) * width, 1)))}" cy="${escapeHtml(String(roundTo(clamp(Number(point.y), 0, 1) * height, 1)))}" r="4.8"></circle>`;
      }).join("");
    return `
      <section class="nospill-route-artifact" aria-label="Route Smoothness Outline">
        <div class="nospill-route-artifact-head">
          <span>Route Smoothness Outline</span>
          <strong>Local route shape</strong>
        </div>
        <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Normalized route outline with smoothness and roughness markers. This is not a map." focusable="false">
          <path class="nospill-route-outline-shadow" d="${escapeHtml(path)}"></path>
          <path class="nospill-route-outline-line" d="${escapeHtml(path)}"></path>
          ${markers}
        </svg>
        <small>${escapeHtml(ROUTE_OUTLINE_SHARE_WARNING)}</small>
      </section>
    `;
  }
  return renderCupTrail(summary);
}

function applyDailyDeliveryCredit(summary = {}) {
  const duration = Number(summary.durationSeconds || 0);
  const cargoCondition = safeNonNegativeNumber(summary.cargoCondition ?? summary.waterLeft, 0, 100);
  const driveShape = summary.driveShape || summarizeDriveShape(summary);
  const eligible = cargoCondition >= 80 && duration >= 10 * 60;
  const bucket = duration >= 45 * 60 ? "Long Pour" : duration >= 10 * 60 ? "Daily Pour" : "Short Pour";
  const cappedMinutes = Math.min(45, Math.max(0, Math.floor(duration / 60)));
  if (!eligible) {
    return {
      eligible: false,
      capped: true,
      bucket,
      cappedMinutes,
      label: "",
      message: "",
    };
  }
  return {
    eligible: true,
    capped: true,
    bucket,
    cappedMinutes,
    label: duration >= 10 * 60 ? "Daily Delivery Credit" : "Steady Pour Minutes",
    message: driveShape === "Long Pour"
      ? "Smooth commute logged."
      : "Smooth commute logged.",
  };
}

function dailyDeliveryCredit(summary = {}) {
  const credit = applyDailyDeliveryCredit(summary);
  if (credit.eligible && credit.label) return `${credit.label}: ${credit.message}`;
  const duration = Number(summary.durationSeconds || 0);
  const cargoCondition = safeNonNegativeNumber(summary.cargoCondition ?? summary.waterLeft, 0, 100);
  if (duration >= 10 * 60 && cargoCondition >= 80) {
    return "Daily Delivery Credit: Smooth commute logged.";
  }
  if (duration >= 3 * 60 && cargoCondition >= 90) {
    return "Steady Pour Minutes recorded.";
  }
  return "";
}

function createCoachAccumulator() {
  return {
    sampleCount: 0,
    elapsedMs: 0,
    longitudinalPeak: 0,
    longitudinalAverageAbs: 0,
    longitudinalJerkPeak: 0,
    longitudinalJerkAverage: 0,
    decelSpikeCount: 0,
    harshOnsetCount: 0,
    harshReleaseCount: 0,
    smoothDecelWindowCount: 0,
    roughTransitionCount: 0,
    comfortJoltCount: 0,
    lateralJerkPeak: 0,
    lateralJerkAverage: 0,
    lateralSpikeCount: 0,
    smoothLateralWindowCount: 0,
    roughLateralWindowCount: 0,
    leftRightTransitionCount: 0,
    smoothWindowCount: 0,
    roughWindowCount: 0,
    lastLongitudinalG: 0,
    lastLateralSign: 0,
  };
}

function updateCoachAccumulator(accumulator, safeMotionSample = {}) {
  const source = accumulator && typeof accumulator === "object"
    ? accumulator
    : createCoachAccumulator();
  const longitudinalG = clamp(Number(safeMotionSample.longitudinalG || 0), -2, 2);
  const lateralG = clamp(Number(safeMotionSample.lateralG || 0), -2, 2);
  const totalG = clamp(Math.abs(Number(safeMotionSample.totalG || 0)), 0, 4);
  const jerk = clamp(Math.abs(Number(safeMotionSample.jerk || 0)), 0, 12);
  const elapsedMs = Math.max(0, Number(safeMotionSample.elapsedMs || safeMotionSample.deltaMs || 0));
  const previousLongitudinal = Number(source.lastLongitudinalG || 0);
  const deltaLongitudinal = longitudinalG - previousLongitudinal;
  const lateralJerk = Math.abs(Number(
    safeMotionSample.lateralJerk ?? safeMotionSample.lateralDelta ?? 0,
  ));
  const lateralSign = motionSign(lateralG);
  const nextCount = safeNonNegativeInteger(source.sampleCount, 0, 1000000) + 1;
  const previousCount = Math.max(0, nextCount - 1);

  source.sampleCount = nextCount;
  source.elapsedMs = safeNonNegativeNumber(source.elapsedMs, 0, 86400000) + elapsedMs;
  source.longitudinalPeak = Math.max(
    safeNonNegativeNumber(source.longitudinalPeak, 0, 4),
    Math.abs(longitudinalG),
  );
  source.longitudinalAverageAbs = (
    (safeNonNegativeNumber(source.longitudinalAverageAbs, 0, 4) * previousCount)
    + Math.abs(longitudinalG)
  ) / nextCount;
  source.longitudinalJerkPeak = Math.max(
    safeNonNegativeNumber(source.longitudinalJerkPeak, 0, 12),
    jerk,
  );
  source.longitudinalJerkAverage = (
    (safeNonNegativeNumber(source.longitudinalJerkAverage, 0, 12) * previousCount)
    + jerk
  ) / nextCount;
  if (longitudinalG < -0.35) source.decelSpikeCount += 1;
  if (longitudinalG < -0.16 && deltaLongitudinal < -0.14) source.harshOnsetCount += 1;
  if (previousLongitudinal < -0.16 && longitudinalG > -0.04 && deltaLongitudinal > 0.14) {
    source.harshReleaseCount += 1;
  }
  if (longitudinalG < -0.06 && longitudinalG > -0.28 && Math.abs(deltaLongitudinal) < 0.08 && jerk < 0.8) {
    source.smoothDecelWindowCount += 1;
  }
  if (Math.abs(deltaLongitudinal) > 0.18 || jerk > 1.1) source.roughTransitionCount += 1;
  if (totalG > 0.38 || jerk > 1.35) source.comfortJoltCount += 1;
  source.lateralJerkPeak = Math.max(
    safeNonNegativeNumber(source.lateralJerkPeak, 0, 12),
    lateralJerk,
  );
  source.lateralJerkAverage = (
    (safeNonNegativeNumber(source.lateralJerkAverage, 0, 12) * previousCount)
    + lateralJerk
  ) / nextCount;
  if (Math.abs(lateralG) > 0.32 || lateralJerk > 0.3) source.lateralSpikeCount += 1;
  if (Math.abs(lateralG) < 0.22 && lateralJerk < 0.14 && jerk < 0.9) {
    source.smoothLateralWindowCount += 1;
  }
  if (Math.abs(lateralG) > 0.3 || lateralJerk > 0.28 || jerk > 1.2) {
    source.roughLateralWindowCount += 1;
  }
  if (
    lateralSign
    && source.lastLateralSign
    && lateralSign !== source.lastLateralSign
  ) {
    source.leftRightTransitionCount += 1;
  }
  if (lateralSign) source.lastLateralSign = lateralSign;
  if (totalG < 0.25 && jerk < 0.9 && lateralJerk < 0.18) source.smoothWindowCount += 1;
  if (totalG > 0.38 || jerk > 1.2 || lateralJerk > 0.3) source.roughWindowCount += 1;
  source.lastLongitudinalG = longitudinalG;
  return source;
}

function coachRate(count, sampleCount) {
  return sampleCount > 0 ? safeNonNegativeNumber(count, 0, 1000000) / sampleCount : 0;
}

function classifyBrakeFeather(summary = {}) {
  const samples = safeNonNegativeInteger(summary.sampleCount, 0, 1000000);
  const onsetRate = coachRate(summary.harshOnsetCount, samples);
  const releaseRate = coachRate(summary.harshReleaseCount, samples);
  const combined = onsetRate + releaseRate;
  if (combined <= 0.01 && safeNonNegativeNumber(summary.longitudinalJerkAverage, 0, 12) < 0.28) return "Feathered";
  if (combined <= 0.035) return "Smooth";
  if (combined <= 0.085) return "Uneven";
  return "Abrupt";
}

function classifyDecelControl(summary = {}) {
  const samples = safeNonNegativeInteger(summary.sampleCount, 0, 1000000);
  const spikeRate = coachRate(summary.decelSpikeCount, samples);
  const average = safeNonNegativeNumber(summary.longitudinalAverageAbs, 0, 4);
  const peak = safeNonNegativeNumber(summary.longitudinalPeak, 0, 4);
  if (spikeRate <= 0.01 && average < 0.055 && peak < 0.28) return "Gentle";
  if (spikeRate <= 0.04 && peak < 0.42) return "Controlled";
  if (spikeRate <= 0.1 && peak < 0.62) return "Choppy";
  return "Harsh";
}

function classifyTransitionSmoothness(summary = {}) {
  const samples = safeNonNegativeInteger(summary.sampleCount, 0, 1000000);
  const roughRate = coachRate(summary.roughTransitionCount, samples);
  if (roughRate <= 0.015) return "Clean";
  if (roughRate <= 0.045) return "Mostly Clean";
  if (roughRate <= 0.1) return "Bumpy";
  return "Jerky";
}

function classifyPassengerComfort(summary = {}) {
  const samples = safeNonNegativeInteger(summary.sampleCount, 0, 1000000);
  const joltRate = coachRate(summary.comfortJoltCount, samples);
  const jerkAverage = safeNonNegativeNumber(summary.longitudinalJerkAverage, 0, 12);
  if (joltRate <= 0.015 && jerkAverage < 0.32) return "High";
  if (joltRate <= 0.045) return "Good";
  if (joltRate <= 0.1) return "Mixed";
  return "Rough";
}

function classifySmoothHands(summary = {}) {
  const samples = safeNonNegativeInteger(summary.sampleCount, 0, 1000000);
  const lateralSpikeRate = coachRate(summary.lateralSpikeCount, samples);
  const roughRate = coachRate(summary.roughLateralWindowCount, samples);
  const lateralJerkAverage = safeNonNegativeNumber(summary.lateralJerkAverage, 0, 12);
  if (lateralSpikeRate <= 0.01 && roughRate <= 0.025 && lateralJerkAverage < 0.08) return "Clean";
  if (lateralSpikeRate <= 0.035 && roughRate <= 0.06) return "Smooth";
  if (lateralSpikeRate <= 0.09 && roughRate <= 0.13) return "Uneven";
  return "Abrupt";
}

function classifyCargoBalance(summary = {}) {
  const cargoCondition = safeNonNegativeNumber(summary.cargoCondition ?? summary.waterLeft, 0, 100);
  const samples = safeNonNegativeInteger(summary.sampleCount, 0, 1000000);
  const roughRate = coachRate(
    safeNonNegativeInteger(summary.roughWindowCount, 0, 1000000)
      + safeNonNegativeInteger(summary.comfortJoltCount, 0, 1000000),
    samples,
  );
  if (cargoCondition >= 95 && roughRate <= 0.035) return "Settled";
  if (cargoCondition >= 80 && roughRate <= 0.08) return "Light Lean";
  if (cargoCondition >= 55 && roughRate <= 0.16) return "Noticeable Lean";
  return "Sloshed";
}

function classifyCargoStability(summary = {}) {
  return classifyCargoBalance(summary);
}

function classifyConsistency(summary = {}) {
  const samples = safeNonNegativeInteger(summary.sampleCount, 0, 1000000);
  const smoothRate = coachRate(summary.smoothWindowCount, samples);
  const roughRate = coachRate(summary.roughWindowCount, samples);
  const cargoCondition = safeNonNegativeNumber(summary.cargoCondition ?? summary.waterLeft, 0, 100);
  if (cargoCondition >= 92 && smoothRate >= 0.78 && roughRate <= 0.035) return "High";
  if (cargoCondition >= 80 && smoothRate >= 0.6 && roughRate <= 0.08) return "Good";
  if (cargoCondition >= 55 && roughRate <= 0.16) return "Mixed";
  return "Rough";
}

function coachRecapMessage(recap = {}) {
  if (recap.insufficient) return "Not enough motion data for a useful coaching recap.";
  if (recap.smoothHands === "Clean" && recap.cargoBalance === "Settled") {
    return "The tofu stayed settled through most steering changes.";
  }
  if (recap.passengerComfort === "High" && recap.decelControl === "Gentle") {
    return "The tofu leaned forward less than usual.";
  }
  if (recap.smoothHands === "Uneven" || recap.smoothHands === "Abrupt") {
    return "A few sharp side-to-side inputs moved the cargo.";
  }
  if (recap.transitionSmoothness === "Clean" || recap.transitionSmoothness === "Mostly Clean") {
    return "The delivery felt calm from the cup's point of view.";
  }
  if (recap.brakeFeather === "Abrupt" || recap.decelControl === "Harsh") {
    return "Brake pressure changes felt abrupt to the cargo.";
  }
  if (recap.passengerComfort === "Mixed" || recap.passengerComfort === "Rough") {
    return "A few forward jolts showed up near stop transitions.";
  }
  return "The tofu stayed settled during most deceleration.";
}

function summarizeCoachRecap(accumulator = {}, runSummary = {}) {
  const sampleCount = safeNonNegativeInteger(
    accumulator.sampleCount ?? accumulator.samples ?? runSummary.sampleCount,
    0,
    1000000,
  );
  const elapsedMs = safeNonNegativeNumber(
    accumulator.elapsedMs ?? (Number(runSummary.durationSeconds || 0) * 1000),
    0,
    86400000,
  );
  const base = {
    sampleCount,
    elapsedMs: Math.round(elapsedMs),
    longitudinalPeak: roundTo(safeNonNegativeNumber(accumulator.longitudinalPeak, 0, 4), 3),
    longitudinalAverageAbs: roundTo(safeNonNegativeNumber(accumulator.longitudinalAverageAbs, 0, 4), 3),
    longitudinalJerkPeak: roundTo(safeNonNegativeNumber(accumulator.longitudinalJerkPeak, 0, 12), 3),
    longitudinalJerkAverage: roundTo(safeNonNegativeNumber(accumulator.longitudinalJerkAverage, 0, 12), 3),
    decelSpikeCount: safeNonNegativeInteger(accumulator.decelSpikeCount, 0, 1000000),
    harshOnsetCount: safeNonNegativeInteger(accumulator.harshOnsetCount, 0, 1000000),
    harshReleaseCount: safeNonNegativeInteger(accumulator.harshReleaseCount, 0, 1000000),
    smoothDecelWindowCount: safeNonNegativeInteger(accumulator.smoothDecelWindowCount, 0, 1000000),
    roughTransitionCount: safeNonNegativeInteger(accumulator.roughTransitionCount, 0, 1000000),
    comfortJoltCount: safeNonNegativeInteger(accumulator.comfortJoltCount, 0, 1000000),
    lateralJerkPeak: roundTo(safeNonNegativeNumber(accumulator.lateralJerkPeak, 0, 12), 3),
    lateralJerkAverage: roundTo(safeNonNegativeNumber(accumulator.lateralJerkAverage, 0, 12), 3),
    lateralSpikeCount: safeNonNegativeInteger(accumulator.lateralSpikeCount, 0, 1000000),
    smoothLateralWindowCount: safeNonNegativeInteger(accumulator.smoothLateralWindowCount, 0, 1000000),
    roughLateralWindowCount: safeNonNegativeInteger(accumulator.roughLateralWindowCount, 0, 1000000),
    leftRightTransitionCount: safeNonNegativeInteger(accumulator.leftRightTransitionCount, 0, 1000000),
    smoothWindowCount: safeNonNegativeInteger(accumulator.smoothWindowCount, 0, 1000000),
    roughWindowCount: safeNonNegativeInteger(accumulator.roughWindowCount, 0, 1000000),
  };
  if (sampleCount < 20 || elapsedMs < 8000) {
    return {
      insufficient: true,
      ...base,
      message: "Not enough motion data for a useful coaching recap.",
    };
  }
  const recap = {
    insufficient: false,
    ...base,
    smoothHands: classifySmoothHands(base),
    brakeFeather: classifyBrakeFeather(base),
    decelControl: classifyDecelControl(base),
    transitionSmoothness: classifyTransitionSmoothness(base),
    passengerComfort: classifyPassengerComfort(base),
    cargoBalance: classifyCargoBalance({ ...base, ...runSummary }),
    cargoStability: classifyCargoStability({ ...base, ...runSummary }),
    consistency: classifyConsistency({ ...base, ...runSummary }),
  };
  recap.message = coachRecapMessage(recap);
  return recap;
}

function renderCoachRecap(result = {}) {
  const recap = result.coachRecap || summarizeCoachRecap(result.coachSignals || {}, result);
  if (recap.insufficient) {
    return `
      <section class="nospill-coach-recap" aria-label="Coach Recap">
        <h4>Coach Recap</h4>
        <p>${escapeHtml(recap.message || "Not enough motion data for a useful coaching recap.")}</p>
      </section>
    `;
  }
  return `
    <section class="nospill-coach-recap" aria-label="Coach Recap">
      <h4>Coach Recap</h4>
      <dl>
        <div><dt>Smooth Hands</dt><dd>${escapeHtml(recap.smoothHands)}</dd></div>
        <div><dt>Brake Feather</dt><dd>${escapeHtml(recap.brakeFeather)}</dd></div>
        <div><dt>Decel Control</dt><dd>${escapeHtml(recap.decelControl)}</dd></div>
        <div><dt>Transition Smoothness</dt><dd>${escapeHtml(recap.transitionSmoothness)}</dd></div>
        <div><dt>Cargo Balance</dt><dd>${escapeHtml(recap.cargoBalance)}</dd></div>
        <div><dt>Passenger Comfort</dt><dd>${escapeHtml(recap.passengerComfort)}</dd></div>
        <div><dt>Consistency</dt><dd>${escapeHtml(recap.consistency)}</dd></div>
      </dl>
      <p>${escapeHtml(recap.message)}</p>
    </section>
  `;
}

function coachRecapKeyLabels(result = {}) {
  const recap = result.coachRecap || summarizeCoachRecap(result.coachSignals || {}, result);
  if (recap.insufficient) {
    return {
      sentence: recap.message || "Mika did not get enough motion data for a full recap.",
      labels: ["Coach data: limited"],
    };
  }
  const cargo = recap.cargoBalance || recap.cargoStability || "Recorded";
  return {
    sentence: recap.message || "Mika noted a calm finish.",
    labels: [
      `Best: ${recap.brakeFeather || "Smooth Hands"}`,
      `Focus: ${recap.transitionSmoothness || "Transition Smoothness"}`,
      `Cargo: ${cargo}`,
    ],
  };
}

function coachRecapShortText(result = {}) {
  const recap = coachRecapKeyLabels(result);
  return [recap.sentence, recap.labels.slice(0, 3).join(" · ")]
    .filter(Boolean)
    .join(" ");
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
    lateralAbsSum: 0,
    longitudinalAbsSum: 0,
    lateralSignChanges: 0,
    longitudinalSignChanges: 0,
    lastLateralSign: 0,
    lastLongitudinalSign: 0,
    cupTrail: [],
    coach: createCoachAccumulator(),
    previousCoachLateralG: 0,
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

function defaultMerchUnlocks() {
  return Object.fromEntries(Object.keys(HIDDEN_MERCH_UNLOCKS).map((itemId) => [
    itemId,
    {
      unlocked: false,
      unlockedAt: "",
      source: "",
      revealSeen: false,
    },
  ]));
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
    merchUnlocks: defaultMerchUnlocks(),
    recentRewards: [],
    recentSessions: [],
    seenStampFanfareIds: [],
    seenSystemRevealIds: [],
    seenStoryBeatIds: [],
    seenStationMilestoneIds: [],
    newlyRevealedTabIds: [],
    xpByDate: {},
    routeMastery: {},
    shop: defaultShopState(),
    collection: defaultCollectionState(),
    carManagement: defaultCarManagementState(),
  };
}

function defaultCarManagementState() {
  return {
    unlocked: false,
    currentCar: null,
    activeAssignment: null,
    assignmentCompletions: {},
    assignmentHistory: [],
    lastAssignmentResult: null,
    brandValue: 0,
    garageReputation: 0,
    secondCarProject: defaultSecondCarProjectState(),
  };
}

function defaultSecondCarProjectState() {
  return {
    bayUnlocked: false,
    bayUnlockedAt: null,
    bayOpened: false,
    bayOpenedAt: null,
    acquired: false,
    acquiredAt: null,
    id: SECOND_CAR_PROJECT_ID,
    name: "Second Project Car",
    stage: "locked",
    builderNote: "",
    garageBuildValue: 0,
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

function normalizeMerchUnlocks(merchUnlocks) {
  const source = merchUnlocks && typeof merchUnlocks === "object" ? merchUnlocks : {};
  const normalized = Object.fromEntries(Object.values(HIDDEN_MERCH_UNLOCKS).map((definition) => {
    const item = source[definition.id] && typeof source[definition.id] === "object"
      ? source[definition.id]
      : {};
    const unlocked = Boolean(item.unlocked);
    const unlockedAt = typeof item.unlockedAt === "string" ? item.unlockedAt.slice(0, 40) : "";
    const sourceId = typeof item.source === "string" && definition.allowedSources.has(item.source)
      ? item.source
      : "";
    return [definition.id, {
      unlocked,
      unlockedAt: unlocked ? unlockedAt : "",
      source: unlocked ? sourceId : "",
      revealSeen: Boolean(item.revealSeen),
    }];
  }));
  if (normalized[HIDDEN_SHIRT_ID].unlocked && !normalized[HIDDEN_STICKER_ID].unlocked) {
    normalized[HIDDEN_STICKER_ID] = {
      unlocked: true,
      unlockedAt: normalized[HIDDEN_SHIRT_ID].unlockedAt,
      source: "shirt_migration",
      revealSeen: true,
    };
  }
  if (normalized[HIDDEN_PENGUIN_SHIRT_ID].unlocked && !normalized[HIDDEN_PENGUIN_STICKER_ID].unlocked) {
    normalized[HIDDEN_PENGUIN_STICKER_ID] = {
      unlocked: true,
      unlockedAt: normalized[HIDDEN_PENGUIN_SHIRT_ID].unlockedAt,
      source: "shirt_migration",
      revealSeen: true,
    };
  }
  return normalized;
}

function safeNonNegativeNumber(value, fallback = 0, maxValue = SHOP_MAX_RESOURCE) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return fallback;
  return Math.min(numeric, maxValue);
}

function safeNonNegativeInteger(value, fallback = 0, maxValue = SHOP_MAX_RESOURCE) {
  return Math.round(safeNonNegativeNumber(value, fallback, maxValue));
}

function deliveryOrderQueueCapacity() {
  return SHOP_DELIVERY_ORDER_QUEUE_CAP;
}

function clampDeliveryOrderQueue(value) {
  return safeNonNegativeInteger(value, 0, deliveryOrderQueueCapacity());
}

function deliveryOrderQueueSpace(shop) {
  return Math.max(
    0,
    deliveryOrderQueueCapacity() - clampDeliveryOrderQueue(shop && shop.deliveryOrders),
  );
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

function stampFanfareTitle(stampId) {
  if (stampId === "first_shop_order") return "First Stamp Earned";
  return "Stamp Earned";
}

function stampFanfareCopy(stampId) {
  if (stampId === "first_shop_order") {
    return "The passport opens. Your first shop order is recorded.";
  }
  return "A new passport stamp has been recorded.";
}

function buildStampFanfare(stampId, rewards = {}) {
  const label = STAMP_LABELS[stampId] || "Passport Stamp";
  return {
    stampId,
    title: stampFanfareTitle(stampId),
    stampLabel: label,
    copy: stampFanfareCopy(stampId),
    rewards: {
      tips: safeNonNegativeInteger(rewards.tipsGained, 0, SHOP_MAX_RESOURCE),
      reputation: safeNonNegativeInteger(rewards.reputationGained, 0, SHOP_MAX_RESOURCE),
      shopXp: safeNonNegativeInteger(rewards.shopXpGained ?? rewards.xpGained, 0, SHOP_MAX_RESOURCE),
    },
  };
}

function markStampFanfareSeen(gameState, stampId) {
  const next = normalizeGameState(gameState);
  if (typeof stampId !== "string" || !stampId) return next;
  if (!next.seenStampFanfareIds.includes(stampId)) {
    next.seenStampFanfareIds = [...next.seenStampFanfareIds, stampId].slice(0, 200);
  }
  return next;
}

function awardShopStamp(gameState, stampId) {
  let next = normalizeGameState(gameState);
  if (!stampId || next.stamps[stampId]) return { gameState: next, unlocked: false };
  next.stamps[stampId] = { date: new Date().toISOString(), label: STAMP_LABELS[stampId] || stampId };
  next = addLedgerEntry(next, "stamp", `${STAMP_LABELS[stampId] || "Passport"} stamp earned.`);
  return { gameState: next, unlocked: true };
}

function queueStampFanfare(gameState, stampId, rewards = {}) {
  const state = normalizeGameState(gameState);
  if (state.seenStampFanfareIds.includes(stampId)) {
    return { gameState: state, stampFanfare: null };
  }
  const next = markStampFanfareSeen(state, stampId);
  return {
    gameState: next,
    stampFanfare: buildStampFanfare(stampId, rewards),
  };
}

function systemRevealDefinition(systemId) {
  const definitions = {
    upgrades: {
      systemId: "upgrades",
      title: "New Shop System Revealed",
      systemLabel: "Upgrades",
      copy: "The shop has another layer. A new Upgrades tab has appeared.",
      secondaryCopy: "More shop systems are hidden for now. Keep fulfilling orders and hitting milestones to discover them.",
      primaryAction: "View Upgrades",
      tabId: "upgrades",
    },
  };
  return definitions[systemId] || null;
}

function buildDiscoveryFanfare(systemId) {
  const definition = systemRevealDefinition(systemId);
  return definition ? { ...definition } : null;
}

function markSystemRevealSeen(gameState, systemId) {
  const next = normalizeGameState(gameState);
  if (typeof systemId !== "string" || !systemId) return next;
  if (!next.seenSystemRevealIds.includes(systemId)) {
    next.seenSystemRevealIds = [...next.seenSystemRevealIds, systemId].slice(0, 200);
  }
  const fanfare = buildDiscoveryFanfare(systemId);
  if (fanfare && fanfare.tabId && !next.newlyRevealedTabIds.includes(fanfare.tabId)) {
    next.newlyRevealedTabIds = [...next.newlyRevealedTabIds, fanfare.tabId].slice(0, 20);
  }
  return next;
}

function clearNewlyRevealedTab(gameState, tabId) {
  const next = normalizeGameState(gameState);
  if (typeof tabId !== "string" || !tabId) return next;
  if (next.newlyRevealedTabIds.includes(tabId)) {
    next.newlyRevealedTabIds = next.newlyRevealedTabIds.filter((id) => id !== tabId);
  }
  return next;
}

function storyBeatDefinition(storyBeatId) {
  const definitions = {
    covered_car_teaser: {
      id: "covered_car_teaser",
      title: "Behind the shop",
      status: "Story Teaser",
      copy: "Behind the shop, an old car waits under a cover. The Tofu Shop is not the destination. It is how the dream starts.",
    },
    [COVERED_CAR_TEASER_ID]: {
      id: COVERED_CAR_TEASER_ID,
      title: "Behind the Shop",
      status: "Dream Build: Not ready yet",
      copy: "An old car waits under a cover. The Tofu Shop is not the destination. It is how the dream starts.",
    },
  };
  return definitions[storyBeatId] || null;
}

function queueStoryBeatTeaser(gameState, storyBeatId) {
  const state = normalizeGameState(gameState);
  const storyBeat = storyBeatDefinition(storyBeatId);
  if (!storyBeat || state.seenStoryBeatIds.includes(storyBeatId)) {
    return { gameState: state, storyTeaser: null };
  }
  state.seenStoryBeatIds = [...state.seenStoryBeatIds, storyBeatId].slice(0, 100);
  return { gameState: state, storyTeaser: storyBeat };
}

function queueDiscoveryFanfare(gameState, systemId) {
  const state = normalizeGameState(gameState);
  const fanfare = buildDiscoveryFanfare(systemId);
  if (!fanfare || state.seenSystemRevealIds.includes(systemId)) {
    return { gameState: state, discoveryFanfare: null };
  }
  const next = markSystemRevealSeen(state, systemId);
  return {
    gameState: next,
    discoveryFanfare: fanfare,
  };
}

function shouldRevealUpgradesSystem(previousState, nextState) {
  const before = normalizeGameState(previousState);
  const after = normalizeGameState(nextState);
  if (after.seenSystemRevealIds.includes("upgrades")) return false;
  return visibleRelevantStationUpgrades(before).length === 0
    && visibleRelevantStationUpgrades(after).length > 0
    && fulfilledShopOrderCount(after) > fulfilledShopOrderCount(before);
}

function defaultShopState() {
  return {
    tofuStock: STARTER_TOFU_STOCK,
    deliveryOrders: 1,
    tips: 0,
    reputation: 0,
    prepSlots: PREP_SLOT_BASE_MAX,
    shopReach: 0,
    shopSpirit: 0,
    shopXP: 0,
    licenseStars: 0,
    cupStabilityXP: 0,
    routeKnowledge: 0,
    shopLevel: 1,
    lifetimeDeliveryOrders: 0,
    lifetimeTips: 0,
    lifetimeTofuPacked: 0,
    starterStockBufferApplied: true,
    wholesalePickupsCompleted: 0,
    coveredCarTeaserUnlocked: false,
    coveredCarTeaserSeen: false,
    coveredCarTeaserFeedbackShown: false,
    dreamBuild: {
      wheelsPurchased: false,
      wheelsLevel: 0,
      exhaustPurchased: false,
      exhaustLevel: 0,
      suspensionLevel: 0,
      tiresLevel: 0,
      brakesLevel: 0,
      inductionLevel: 0,
      drivetrainLevel: 0,
      aeroLevel: 0,
      finalBuildLevel: 0,
      builderNote: "",
      firstInvestmentPurchasedAt: "",
      showcaseDisplayPrepared: false,
      showcaseDisplayPreparedAt: "",
      netWorthMilestonesReached: [],
      sponsor: {
        inquiryAccepted: false,
        inquiryAcceptedAt: "",
        brandValue: 0,
      },
    },
    garageEvents: {
      garageReputation: 0,
      brandValue: 0,
      completedEventIds: [],
      seenEventRevealIds: [],
      lastEventResult: null,
    },
    lifetimeReputation: 0,
    lifetimeShopXP: 0,
    lifetimeRoutesCompleted: 0,
    lifetimeLicenseExams: 0,
    upgrades: {},
    stationUpgrades: normalizeCatalogCounts({}, STATION_UPGRADES, 100),
    stations: normalizeCatalogCounts({ tofu_press: 1, prep_counter: 1 }, SHOP_STATIONS, 100000),
    routes: normalizeRouteState({}),
    garage: normalizeCatalogCounts({}, GARAGE_UPGRADES, 100),
    crew: normalizeCatalogCounts({}, CREW_ROLES, 1000),
    spiritGenerators: normalizeCatalogCounts({}, SPIRIT_GENERATORS, SPIRIT_GENERATOR_MAX_LEVEL),
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
    counterService: {
      running: true,
      priority: "best_available",
      lastHandoffAt: "",
      lastResult: "",
      lifetimeHandoffs: 0,
    },
    counterContracts: normalizeCounterContracts({}),
    offlineEarnings: {
      tofuStock: 0,
      deliveryOrders: 0,
      tips: 0,
      shopSpirit: 0,
      cappedHours: 0,
      queueFull: false,
    },
  };
}

function defaultShopGenerators() {
  return {
    tofuPress: { unlocked: true, level: 1 },
    prepCounter: { unlocked: true, level: 1 },
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

function normalizeCounterService(counterService) {
  const source = counterService && typeof counterService === "object" ? counterService : {};
  const priority = source.priority === "simple_only" ? "simple_only" : "best_available";
  return {
    running: source.running === undefined ? true : Boolean(source.running),
    priority,
    lastHandoffAt: typeof source.lastHandoffAt === "string" ? source.lastHandoffAt : "",
    lastResult: typeof source.lastResult === "string" ? source.lastResult.slice(0, 180) : "",
    lifetimeHandoffs: safeNonNegativeInteger(source.lifetimeHandoffs, 0, 1000000),
  };
}

function normalizeDreamBuild(dreamBuild) {
  const source = dreamBuild && typeof dreamBuild === "object" ? dreamBuild : {};
  const rawWheelsLevel = safeNonNegativeInteger(source.wheelsLevel, 0, 5);
  const wheelsPurchased = Boolean(source.wheelsPurchased) || rawWheelsLevel > 0;
  const wheelsLevel = wheelsPurchased ? clamp(rawWheelsLevel || 1, 1, 5) : 0;
  const rawExhaustLevel = safeNonNegativeInteger(source.exhaustLevel, 0, 5);
  const exhaustPurchased = Boolean(source.exhaustPurchased) || rawExhaustLevel > 0;
  const normalizedExhaustLevel = wheelsLevel >= 3 && exhaustPurchased ? clamp(rawExhaustLevel || 1, 1, 5) : 0;
  const rawSuspensionLevel = safeNonNegativeInteger(source.suspensionLevel, 0, 5);
  const suspensionLevel = normalizedExhaustLevel >= 5 ? clamp(rawSuspensionLevel, 0, 5) : 0;
  const rawTiresLevel = safeNonNegativeInteger(source.tiresLevel, 0, 5);
  const tiresLevel = suspensionLevel >= 5 ? clamp(rawTiresLevel, 0, 5) : 0;
  const rawBrakesLevel = safeNonNegativeInteger(source.brakesLevel, 0, 5);
  const brakesLevel = tiresLevel >= 5 ? clamp(rawBrakesLevel, 0, 5) : 0;
  const rawInductionLevel = safeNonNegativeInteger(source.inductionLevel, 0, 5);
  const inductionLevel = brakesLevel >= 5 ? clamp(rawInductionLevel, 0, 5) : 0;
  const rawDrivetrainLevel = safeNonNegativeInteger(source.drivetrainLevel, 0, 5);
  const drivetrainLevel = inductionLevel >= 5 ? clamp(rawDrivetrainLevel, 0, 5) : 0;
  const rawAeroLevel = safeNonNegativeInteger(source.aeroLevel, 0, 5);
  const aeroLevel = drivetrainLevel >= 5 ? clamp(rawAeroLevel, 0, 5) : 0;
  const rawFinalBuildLevel = safeNonNegativeInteger(source.finalBuildLevel, 0, 2);
  const finalBuildLevel = aeroLevel >= 5 ? clamp(rawFinalBuildLevel, 0, 2) : 0;
  const knownMilestoneIds = new Set(NET_WORTH_MILESTONES.map((milestone) => milestone.id));
  const netWorthMilestonesReached = Array.isArray(source.netWorthMilestonesReached)
    ? source.netWorthMilestonesReached
        .filter((id) => typeof id === "string" && knownMilestoneIds.has(id))
        .slice(0, NET_WORTH_MILESTONES.length)
    : [];
  const sponsor = source.sponsor && typeof source.sponsor === "object" ? source.sponsor : {};
  const inquiryAccepted = Boolean(sponsor.inquiryAccepted);
  return {
    wheelsPurchased,
    wheelsLevel,
    exhaustPurchased: wheelsLevel >= 3 && exhaustPurchased,
    exhaustLevel: normalizedExhaustLevel,
    suspensionLevel,
    tiresLevel,
    brakesLevel,
    inductionLevel,
    drivetrainLevel,
    aeroLevel,
    finalBuildLevel,
    builderNote: sanitizeBuilderNote(source.builderNote),
    firstInvestmentPurchasedAt: typeof source.firstInvestmentPurchasedAt === "string"
      ? source.firstInvestmentPurchasedAt.slice(0, 40)
      : "",
    showcaseDisplayPrepared: Boolean(source.showcaseDisplayPrepared),
    showcaseDisplayPreparedAt: typeof source.showcaseDisplayPreparedAt === "string"
      ? source.showcaseDisplayPreparedAt.slice(0, 40)
      : "",
    netWorthMilestonesReached,
    sponsor: {
      inquiryAccepted,
      inquiryAcceptedAt: typeof sponsor.inquiryAcceptedAt === "string"
        ? sponsor.inquiryAcceptedAt.slice(0, 40)
        : "",
      brandValue: inquiryAccepted
        ? Math.max(
            SPONSOR_INQUIRY_BRAND_VALUE,
            safeNonNegativeInteger(sponsor.brandValue, SPONSOR_INQUIRY_BRAND_VALUE, SHOP_MAX_RESOURCE),
          )
        : 0,
    },
  };
}

function normalizeGarageEvents(garageEvents) {
  const source = garageEvents && typeof garageEvents === "object" ? garageEvents : {};
  const knownEventIds = new Set(GARAGE_EVENTS.map((event) => event.id));
  const completedEventIds = Array.isArray(source.completedEventIds)
    ? source.completedEventIds
        .filter((id) => typeof id === "string" && knownEventIds.has(id))
        .filter((id, index, ids) => ids.indexOf(id) === index)
        .slice(0, GARAGE_EVENTS.length)
    : [];
  const seenEventRevealIds = Array.isArray(source.seenEventRevealIds)
    ? source.seenEventRevealIds
        .filter((id) => typeof id === "string" && knownEventIds.has(id))
        .filter((id, index, ids) => ids.indexOf(id) === index)
        .slice(0, GARAGE_EVENTS.length)
    : [];
  const result = source.lastEventResult && typeof source.lastEventResult === "object"
    ? source.lastEventResult
    : null;
  const eventId = result && typeof result.eventId === "string" && knownEventIds.has(result.eventId)
    ? result.eventId
    : "";
  const event = eventId ? GARAGE_EVENTS.find((item) => item.id === eventId) : null;
  return {
    garageReputation: safeNonNegativeInteger(source.garageReputation, 0, SHOP_MAX_RESOURCE),
    brandValue: safeNonNegativeInteger(source.brandValue, 0, SHOP_MAX_RESOURCE),
    completedEventIds,
    seenEventRevealIds,
    lastEventResult: event ? {
      eventId,
      title: typeof result.title === "string" ? result.title.slice(0, 80) : event.title,
      badge: typeof result.badge === "string" ? result.badge.slice(0, 80) : event.badge,
      completedAt: typeof result.completedAt === "string" ? result.completedAt.slice(0, 40) : "",
      cashReward: safeNonNegativeInteger(result.cashReward, event.cashReward, SHOP_MAX_RESOURCE),
      brandValueReward: safeNonNegativeInteger(result.brandValueReward, event.brandValueReward, SHOP_MAX_RESOURCE),
      garageReputationReward: safeNonNegativeInteger(result.garageReputationReward, event.garageReputationReward, SHOP_MAX_RESOURCE),
    } : null,
  };
}

function carAssignmentById(assignmentId) {
  return CAR_ASSIGNMENTS.find((assignment) => assignment.id === assignmentId) || null;
}

function createCurrentCarSnapshot(gameState, currentCar = {}) {
  const state = gameState && typeof gameState === "object" ? gameState : { shop: defaultShopState() };
  const build = state.shop && state.shop.dreamBuild ? state.shop.dreamBuild : defaultShopState().dreamBuild;
  return {
    id: CAR_MANAGEMENT_CURRENT_CAR_ID,
    name: "First Complete Build",
    completedAt: typeof currentCar.completedAt === "string" ? currentCar.completedAt.slice(0, 40) : "",
    buildValueAtCompletion: safeNonNegativeInteger(
      currentCar.buildValueAtCompletion,
      projectCarValueFromDreamBuild(build),
      SHOP_MAX_RESOURCE,
    ),
    coreProgressAtCompletion: typeof currentCar.coreProgressAtCompletion === "string"
      ? currentCar.coreProgressAtCompletion.slice(0, 20)
      : "40 / 40",
    builderNote: sanitizeBuilderNote(currentCar.builderNote || build.builderNote),
    status: "managed",
  };
}

function normalizeCarAssignmentCompletions(value) {
  const source = value && typeof value === "object" ? value : {};
  return Object.fromEntries(CAR_ASSIGNMENTS.map((assignment) => [
    assignment.id,
    safeNonNegativeInteger(source[assignment.id], 0, 100000),
  ]));
}

function normalizeCarAssignmentResult(value) {
  const source = value && typeof value === "object" ? value : null;
  const assignment = source && carAssignmentById(source.assignmentId);
  if (!assignment) return null;
  return {
    assignmentId: assignment.id,
    title: typeof source.title === "string" ? source.title.slice(0, 80) : assignment.title,
    completedAt: typeof source.completedAt === "string" ? source.completedAt.slice(0, 40) : "",
    cashReward: safeNonNegativeInteger(source.cashReward, 0, SHOP_MAX_RESOURCE),
    brandValueReward: safeNonNegativeInteger(source.brandValueReward, 0, SHOP_MAX_RESOURCE),
    garageReputationReward: safeNonNegativeInteger(source.garageReputationReward, 0, SHOP_MAX_RESOURCE),
  };
}

function normalizeCarAssignmentHistory(value) {
  return (Array.isArray(value) ? value : [])
    .map(normalizeCarAssignmentResult)
    .filter(Boolean)
    .slice(0, CAR_MANAGEMENT_HISTORY_LIMIT);
}

function normalizeCarActiveAssignment(value, currentCar) {
  const source = value && typeof value === "object" ? value : null;
  const assignment = source && carAssignmentById(source.id);
  if (!assignment || !currentCar) return null;
  return {
    id: assignment.id,
    startedAt: typeof source.startedAt === "string" ? source.startedAt.slice(0, 40) : "",
    durationMs: assignment.durationMs,
    entryCost: safeNonNegativeInteger(source.entryCost, 0, SHOP_MAX_RESOURCE),
    rewardPreview: source.rewardPreview && typeof source.rewardPreview === "object"
      ? {
          cashReward: safeNonNegativeInteger(source.rewardPreview.cashReward, 0, SHOP_MAX_RESOURCE),
          brandValueReward: safeNonNegativeInteger(source.rewardPreview.brandValueReward, 0, SHOP_MAX_RESOURCE),
          garageReputationReward: safeNonNegativeInteger(source.rewardPreview.garageReputationReward, 0, SHOP_MAX_RESOURCE),
        }
      : {},
    carId: CAR_MANAGEMENT_CURRENT_CAR_ID,
  };
}

function normalizeSecondCarProject(value, gameState) {
  const defaults = defaultSecondCarProjectState();
  const source = value && typeof value === "object" ? value : {};
  const carManagement = gameState && gameState.carManagement && typeof gameState.carManagement === "object"
    ? gameState.carManagement
    : {};
  const completions = carManagement.assignmentCompletions && typeof carManagement.assignmentCompletions === "object"
    ? carManagement.assignmentCompletions
    : {};
  const loopComplete = CAR_ASSIGNMENTS.every((assignment) => safeNonNegativeInteger(completions[assignment.id], 0, 100000) >= 1);
  const bayOpened = Boolean(source.bayOpened);
  const acquired = Boolean(source.acquired);
  const bayUnlocked = Boolean(source.bayUnlocked) || loopComplete || bayOpened || acquired;
  const stage = acquired ? "rolling_shell" : bayOpened ? "bay_open" : "locked";
  return {
    ...defaults,
    bayUnlocked,
    bayUnlockedAt: typeof source.bayUnlockedAt === "string" ? source.bayUnlockedAt.slice(0, 40) : null,
    bayOpened,
    bayOpenedAt: typeof source.bayOpenedAt === "string" ? source.bayOpenedAt.slice(0, 40) : null,
    acquired,
    acquiredAt: typeof source.acquiredAt === "string" ? source.acquiredAt.slice(0, 40) : null,
    id: SECOND_CAR_PROJECT_ID,
    name: typeof source.name === "string" && source.name.trim()
      ? source.name.slice(0, 80)
      : defaults.name,
    stage,
    builderNote: sanitizeBuilderNote(source.builderNote || ""),
    garageBuildValue: acquired
      ? safeNonNegativeInteger(source.garageBuildValue, SECOND_PROJECT_CAR_GARAGE_VALUE, SHOP_MAX_RESOURCE)
      : 0,
  };
}

function normalizeCarManagement(carManagement, gameState) {
  const defaults = defaultCarManagementState();
  const source = carManagement && typeof carManagement === "object" ? carManagement : {};
  const unlockedByBuild = Boolean(
    gameState
    && gameState.shop
    && gameState.shop.dreamBuild
    && safeNonNegativeInteger(gameState.shop.dreamBuild.finalBuildLevel, 0, 2) >= 2,
  );
  const sourceCar = source.currentCar && typeof source.currentCar === "object" ? source.currentCar : null;
  const currentCar = unlockedByBuild
    ? createCurrentCarSnapshot(gameState, sourceCar || {})
    : null;
  const normalized = {
    ...defaults,
    unlocked: unlockedByBuild || Boolean(source.unlocked),
    currentCar,
    activeAssignment: normalizeCarActiveAssignment(source.activeAssignment, currentCar),
    assignmentCompletions: normalizeCarAssignmentCompletions(source.assignmentCompletions),
    assignmentHistory: normalizeCarAssignmentHistory(source.assignmentHistory),
    lastAssignmentResult: normalizeCarAssignmentResult(source.lastAssignmentResult),
    brandValue: safeNonNegativeInteger(source.brandValue, 0, SHOP_MAX_RESOURCE),
    garageReputation: safeNonNegativeInteger(source.garageReputation, 0, SHOP_MAX_RESOURCE),
  };
  normalized.secondCarProject = normalizeSecondCarProject(source.secondCarProject, {
    ...gameState,
    carManagement: normalized,
  });
  return normalized;
}

function normalizeCounterContracts(counterContracts) {
  const source = counterContracts && typeof counterContracts === "object" ? counterContracts : {};
  const purchasedIds = Array.isArray(source.purchasedIds)
    ? source.purchasedIds
        .filter((id) => typeof id === "string" && COUNTER_CONTRACTS.some((contract) => contract.id === id))
        .filter((id, index, ids) => ids.indexOf(id) === index)
        .slice(0, COUNTER_CONTRACTS.length)
    : [];
  return { purchasedIds };
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
  const shopXP = safeNonNegativeInteger(source.shopXP, defaults.shopXP);
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
  const sourceTofuStock = safeNonNegativeInteger(source.tofuStock, defaults.tofuStock);
  const sourceLifetimeDeliveryOrders = safeNonNegativeInteger(
    source.lifetimeDeliveryOrders,
    defaults.lifetimeDeliveryOrders,
  );
  const sourceLifetimeTips = Math.max(
    tips,
    safeNonNegativeInteger(source.lifetimeTips, defaults.lifetimeTips),
  );
  const sourceLifetimeTofuPacked = safeNonNegativeInteger(
    source.lifetimeTofuPacked,
    defaults.lifetimeTofuPacked,
  );
  const starterStockBufferApplied = Boolean(source.starterStockBufferApplied);
  const shouldTopUpStarterStock = !starterStockBufferApplied
    && sourceTofuStock < STARTER_TOFU_STOCK
    && sourceLifetimeTips <= 30
    && sourceLifetimeDeliveryOrders <= 3
    && sourceLifetimeTofuPacked === 0
    && stations.tofu_press === 1
    && stations.prep_counter === 1;
  const tofuStock = shouldTopUpStarterStock ? STARTER_TOFU_STOCK : sourceTofuStock;
  return {
    ...defaults,
    tofuStock,
    deliveryOrders: clampDeliveryOrderQueue(source.deliveryOrders ?? defaults.deliveryOrders),
    tips,
    reputation,
    prepSlots: safeNonNegativeNumber(source.prepSlots, defaults.prepSlots, getPrepSlotMax({ ...defaults, ...source })),
    shopReach: safeNonNegativeInteger(source.shopReach, defaults.shopReach),
    shopSpirit: safeNonNegativeNumber(source.shopSpirit, defaults.shopSpirit, getShopSpiritMax({ ...defaults, ...source })),
    shopXP,
    licenseStars: safeNonNegativeInteger(source.licenseStars, defaults.licenseStars, 100000),
    cupStabilityXP: safeNonNegativeInteger(source.cupStabilityXP, defaults.cupStabilityXP),
    routeKnowledge: safeNonNegativeInteger(source.routeKnowledge, defaults.routeKnowledge),
    shopLevel: getShopLevel(reputation),
    lifetimeDeliveryOrders: sourceLifetimeDeliveryOrders,
    lifetimeTips: sourceLifetimeTips,
    lifetimeTofuPacked: sourceLifetimeTofuPacked,
    starterStockBufferApplied: starterStockBufferApplied || shouldTopUpStarterStock || tofuStock >= STARTER_TOFU_STOCK,
    wholesalePickupsCompleted: safeNonNegativeInteger(source.wholesalePickupsCompleted, defaults.wholesalePickupsCompleted),
    coveredCarTeaserUnlocked: Boolean(source.coveredCarTeaserUnlocked),
    coveredCarTeaserSeen: Boolean(source.coveredCarTeaserSeen),
    coveredCarTeaserFeedbackShown: Boolean(source.coveredCarTeaserFeedbackShown),
    dreamBuild: normalizeDreamBuild(source.dreamBuild),
    garageEvents: normalizeGarageEvents(source.garageEvents),
    lifetimeReputation: Math.max(
      reputation,
      safeNonNegativeInteger(source.lifetimeReputation, defaults.lifetimeReputation),
    ),
    lifetimeShopXP: Math.max(
      shopXP,
      safeNonNegativeInteger(source.lifetimeShopXP, defaults.lifetimeShopXP),
    ),
    lifetimeRoutesCompleted: safeNonNegativeInteger(source.lifetimeRoutesCompleted, defaults.lifetimeRoutesCompleted),
    lifetimeLicenseExams: safeNonNegativeInteger(source.lifetimeLicenseExams, defaults.lifetimeLicenseExams),
    upgrades: normalizeUpgradeLevels(source.upgrades),
    stationUpgrades: normalizeCatalogCounts(source.stationUpgrades, STATION_UPGRADES, 100),
    stations,
    routes: normalizeRouteState(source.routes),
    garage: normalizeCatalogCounts(source.garage, GARAGE_UPGRADES, 100),
    crew: normalizeCatalogCounts(source.crew, CREW_ROLES, 1000),
    spiritGenerators: normalizeCatalogCounts(source.spiritGenerators, SPIRIT_GENERATORS, SPIRIT_GENERATOR_MAX_LEVEL),
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
    counterService: normalizeCounterService(source.counterService),
    counterContracts: normalizeCounterContracts(source.counterContracts),
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
      tofuConsumed: safeNonNegativeInteger(
        source.offlineEarnings && source.offlineEarnings.tofuConsumed,
        0,
      ),
      counterServicePaused: Boolean(
        source.offlineEarnings && source.offlineEarnings.counterServicePaused,
      ),
      cappedHours: safeNonNegativeNumber(
        source.offlineEarnings && source.offlineEarnings.cappedHours,
        0,
        SHOP_MAX_OFFLINE_CAP_HOURS,
      ),
      elapsedHours: safeNonNegativeNumber(
        source.offlineEarnings && source.offlineEarnings.elapsedHours,
        0,
        1000000,
      ),
      excessHours: safeNonNegativeNumber(
        source.offlineEarnings && source.offlineEarnings.excessHours,
        0,
        1000000,
      ),
      capHours: safeNonNegativeNumber(
        source.offlineEarnings && source.offlineEarnings.capHours,
        SHOP_OFFLINE_BASE_CAP_HOURS,
        SHOP_MAX_OFFLINE_CAP_HOURS,
      ),
      capped: Boolean(source.offlineEarnings && source.offlineEarnings.capped),
      managedCap: Boolean(source.offlineEarnings && source.offlineEarnings.managedCap),
      queueFull: Boolean(source.offlineEarnings && source.offlineEarnings.queueFull),
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
    merchUnlocks: normalizeMerchUnlocks(source.merchUnlocks),
    recentRewards: Array.isArray(source.recentRewards) ? source.recentRewards.slice(0, 12) : [],
    recentSessions: Array.isArray(source.recentSessions) ? source.recentSessions.slice(0, 20) : [],
    seenStampFanfareIds: normalizeIdList(source.seenStampFanfareIds),
    seenSystemRevealIds: normalizeIdList(source.seenSystemRevealIds),
    seenStoryBeatIds: normalizeIdList(source.seenStoryBeatIds),
    seenStationMilestoneIds: normalizeIdList(source.seenStationMilestoneIds),
    newlyRevealedTabIds: normalizeIdList(source.newlyRevealedTabIds),
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
  normalized.carManagement = normalizeCarManagement(source.carManagement, normalized);
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
  const normalized = syncNetWorthMilestones(gameState).gameState;
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
    if (!isValidImportedShopNumber(shop.offlineEarnings.tofuConsumed)) return false;
    if (!isValidImportedShopNumber(shop.offlineEarnings.cappedHours, SHOP_MAX_OFFLINE_CAP_HOURS)) {
      return false;
    }
    if (!isValidImportedShopNumber(shop.offlineEarnings.elapsedHours, 1000000)) {
      return false;
    }
    if (!isValidImportedShopNumber(shop.offlineEarnings.excessHours, 1000000)) {
      return false;
    }
    if (!isValidImportedShopNumber(shop.offlineEarnings.capHours, SHOP_MAX_OFFLINE_CAP_HOURS)) {
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

function validateImportedMerchUnlocks(merchUnlocks) {
  if (merchUnlocks === undefined) return true;
  if (!merchUnlocks || typeof merchUnlocks !== "object" || Array.isArray(merchUnlocks)) return false;
  const knownIds = new Set(Object.keys(HIDDEN_MERCH_UNLOCKS));
  if (Object.keys(merchUnlocks).some((id) => !knownIds.has(id))) return false;
  for (const [id, definition] of Object.entries(HIDDEN_MERCH_UNLOCKS)) {
    const item = merchUnlocks[id];
    if (item === undefined) continue;
    if (!item || typeof item !== "object" || Array.isArray(item)) return false;
    if (item.unlocked !== undefined && typeof item.unlocked !== "boolean") return false;
    if (item.revealSeen !== undefined && typeof item.revealSeen !== "boolean") return false;
    if (item.unlockedAt !== undefined && typeof item.unlockedAt !== "string") return false;
    if (item.source !== undefined && item.source !== "" && !definition.allowedSources.has(item.source)) return false;
  }
  return true;
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
  if (!validateImportedMerchUnlocks(parsed.state.merchUnlocks)) {
    return { ok: false, reason: "Progress backup included invalid merch unlock values." };
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

  const summarizedSampleCount = safeNonNegativeInteger(
    summary.sampleCount ?? summary.motionSamples,
    0,
    1000000,
  );
  if (summary.mode === "basic" && validPractice && summarizedSampleCount > 0) unlock("first_pour");
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
    routeContext: summary.routeContext && summary.routeContext.status === "usable"
      ? {
          status: "usable",
          routeContextLabel: summary.routeContext.routeContextLabel,
          routeContextScore: summary.routeContext.routeContextScore,
          turnDensity: summary.routeContext.turnDensity,
          curvature: summary.routeContext.curvature,
          stopStartTexture: summary.routeContext.stopStartTexture,
          signalQuality: summary.routeContext.signalQuality,
        }
      : null,
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
    && session.mode === "qualified"
    && !session.simulated,
  );
}

function resultStatusForSession(session = {}) {
  if (session.simulated || session.mode === "simulated") return "simulated";
  if (isQualifiedSession(session)) return "certified";
  return "local";
}

function resultStatusLabel(session = {}) {
  const status = resultStatusForSession(session);
  if (status === "certified") return "Certified Result";
  return "Local Result";
}

function resultStatusCopy(session = {}) {
  const status = resultStatusForSession(session);
  if (status === "certified") {
    return "Eligible for route-context achievements when route context is strong enough.";
  }
  if (status === "simulated") return "Local test fixture.";
  return "Smoothness counted locally.";
}

function routeQualificationStatusForSummary(qualification = {}, geoStatus = "inactive", simulated = false) {
  if (simulated) return "simulated";
  if (qualification.status === "qualified") return "qualified";
  if (geoStatus === "denied") return "location_denied";
  if (geoStatus === "unavailable") return "local_only";
  return "insufficient_data";
}

function routeQualificationReason(session = {}) {
  const status = session.routeQualificationStatus || "";
  if (status === "qualified") return "";
  if (status === "location_denied") return "location was denied.";
  if (status === "local_only") return "location was unavailable.";
  if (status === "simulated") return "simulated results are local QA only.";
  return "not enough route data.";
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
  if (cargo >= 99.95) return "Perfect Local";
  if (cargo >= 95) return "Full Cup Local";
  if (cargo >= 75) return "Smooth Local";
  if (cargo >= 50) return "Local Result";
  return "Local Spill";
}

function classifyRouteType(summary) {
  if (!isQualifiedSession(summary)) return "Local Route";
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

function driverShopReputationBonus(gameState) {
  const state = normalizeGameState(gameState);
  const level = levelProgress(state.totalXP).level;
  const percent = Math.min(10, Math.floor(level / 25));
  return {
    level,
    percent,
    multiplier: 1 + percent / 100,
  };
}

function shopLevelRequirement(level) {
  return 100 + Math.max(1, Number(level || 1)) * 50;
}

function shopLevelSpentForAdvances(advances) {
  const count = safeNonNegativeInteger(advances, 0, 999);
  return (25 * count * count) + (125 * count);
}

function getShopLevel(reputation) {
  const total = Math.max(0, Math.round(Number(reputation || 0)));
  let advances = Math.floor((Math.sqrt(15625 + (100 * total)) - 125) / 50);
  advances = clamp(advances, 0, 999);
  while (advances < 999 && shopLevelSpentForAdvances(advances + 1) <= total) advances += 1;
  while (advances > 0 && shopLevelSpentForAdvances(advances) > total) advances -= 1;
  return advances + 1;
}

function shopLevelProgress(reputation) {
  const total = Math.max(0, Math.round(Number(reputation || 0)));
  const level = getShopLevel(total);
  const spent = shopLevelSpentForAdvances(level - 1);
  return {
    level,
    currentReputation: Math.max(0, total - spent),
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

function formatStationMultiplier(multiplier) {
  const value = Number(multiplier || 1);
  if (!Number.isFinite(value) || value <= 0) return "x1";
  return `x${String(roundTo(value, 2)).replace(/\.0+$/, "")}`;
}

function stationMilestonePlan(stationId) {
  return STATION_MILESTONE_BOOSTS[stationId] || [];
}

function stationMilestoneId(stationId, threshold) {
  return `${stationId}_${threshold}`;
}

function stationMilestoneMultiplier(stationId, owned) {
  const count = safeNonNegativeInteger(owned, 0, 100000);
  return stationMilestonePlan(stationId).reduce((multiplier, milestone) => (
    count >= milestone.threshold ? milestone.multiplier : multiplier
  ), 1);
}

function currentStationMilestone(stationId, owned) {
  const count = safeNonNegativeInteger(owned, 0, 100000);
  return stationMilestonePlan(stationId)
    .filter((milestone) => count >= milestone.threshold)
    .slice(-1)[0] || null;
}

function nextStationMilestone(stationId, owned) {
  const count = safeNonNegativeInteger(owned, 0, 100000);
  return stationMilestonePlan(stationId).find((milestone) => count < milestone.threshold) || null;
}

function stationMilestoneText(stationId, owned) {
  const station = shopStationById(stationId);
  const count = safeNonNegativeInteger(owned, 0, 100000);
  const current = currentStationMilestone(stationId, count);
  const next = nextStationMilestone(stationId, count);
  if (!station || stationMilestonePlan(stationId).length < 1) return "";
  if (next) {
    const progress = `${formatShopCount(count)} / ${formatShopCount(next.threshold)} ${station.name} owned`;
    return current
      ? `Station milestone reached: ${formatShopCount(current.threshold)} ${station.name} owned · ${current.reward}. Next: ${progress} · Reward: ${next.reward}.`
      : `Next station milestone: ${progress}. Reward: ${next.reward}.`;
  }
  return current
    ? `Station milestones complete for now. Current boost: ${formatStationMultiplier(current.multiplier)}.`
    : "";
}

function crossedStationMilestone(stationId, beforeOwned, afterOwned, seenIds = []) {
  const before = safeNonNegativeInteger(beforeOwned, 0, 100000);
  const after = safeNonNegativeInteger(afterOwned, 0, 100000);
  const seen = new Set(Array.isArray(seenIds) ? seenIds : []);
  return stationMilestonePlan(stationId)
    .filter((milestone) => before < milestone.threshold && after >= milestone.threshold)
    .filter((milestone) => !seen.has(stationMilestoneId(stationId, milestone.threshold)))
    .slice(-1)[0] || null;
}

function stationMilestoneFeedback(stationId, milestone) {
  const station = shopStationById(stationId);
  if (!station || !milestone) return "";
  return `Station milestone reached: ${formatShopCount(milestone.threshold)} ${station.name} owned · ${milestone.reward}`;
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
  const firstLoopStation = stationId === "tofu_press" || stationId === "prep_counter";
  const fasterStep = firstLoopStation ? 0.5 : 0.25;
  const doubleStep = firstLoopStation ? 1 : 0.5;
  return (1 + faster * fasterStep + specific * 0.2)
    * (1 + doubleLevel * doubleStep)
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
  const shelfBoost = (1 + shelfOwned * 0.08 + stationUpgradeLevel(state.shop, "delivery_shelf_faster") * 0.2)
    * stationMilestoneMultiplier("delivery_shelf", shelfOwned);
  const supplierPerSecond = supplierStockPerSecond(state);
  const tofuPressPerSecond = (generators.tofuPress.unlocked
    ? tofuPressOwned
      * TOFU_PRESS_BASE_PER_SECOND
      * boostMultiplier
      * festivalMultiplier
      * stationOutputMultiplier(state.shop, "tofu_press")
      * stationMilestoneMultiplier("tofu_press", tofuPressOwned)
    : 0) + supplierPerSecond;
  const prepOrdersPerSecond = generators.prepCounter.unlocked && prepOwned > 0
    ? prepOwned
      * PREP_COUNTER_BASE_ORDERS_PER_SECOND
      * shelfBoost
      * stationOutputMultiplier(state.shop, "prep_counter")
      * stationMilestoneMultiplier("prep_counter", prepOwned)
    : 0;
  const prepTofuPerSecond = prepOrdersPerSecond * PREP_COUNTER_CONSUME_PER_ORDER;
  const customerTipsPerSecond = customerOwned
    * 0.02
    * stationOutputMultiplier(state.shop, "regular_customer")
    * stationMilestoneMultiplier("regular_customer", customerOwned);
  const shopSpiritPerSecond = SPIRIT_GENERATORS.reduce((total, generator) => (
    total
    + safeNonNegativeInteger(state.shop.spiritGenerators[generator.id], 0, SPIRIT_GENERATOR_MAX_LEVEL)
      * generator.spiritPerSecond
  ), 0);
  const prepSlotPerSecond = PREP_SLOT_REGEN_PER_SECOND
    * (1 + safeNonNegativeInteger(state.shop.licensePerks.prep_slot_regen, 0, 20) * 0.3);
  const shopSignMilestoneMultiplier = stationMilestoneMultiplier("shop_sign", signOwned);
  const passiveReputationPerSecond = signOwned
    * 0.002
    * (1 + stationUpgradeLevel(state.shop, "shop_sign_faster") * 0.2)
    * shopSignMilestoneMultiplier;
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
    supplierStockPerSecond: supplierPerSecond,
    prepStatus,
    boostMultiplier,
  };
}

function getShopProductionRate(gameState) {
  return getShopGeneratorRates(gameState).tofuPressPerSecond * 3600;
}

const COMPACT_NUMBER_SUFFIXES = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];

function trimCompactNumber(value, decimals) {
  return Number(value.toFixed(decimals)).toString();
}

function formatCompactNumber(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return "0";
  const sign = number < 0 ? "-" : "";
  const absolute = Math.abs(number);
  if (absolute < 1000) return `${sign}${Math.floor(absolute)}`;
  let suffixIndex = Math.min(
    COMPACT_NUMBER_SUFFIXES.length - 1,
    Math.floor(Math.log10(absolute) / 3),
  );
  let scaled = absolute / Math.pow(1000, suffixIndex);
  if (scaled >= 999.95 && suffixIndex < COMPACT_NUMBER_SUFFIXES.length - 1) {
    suffixIndex += 1;
    scaled /= 1000;
  }
  const decimals = scaled < 10 ? 2 : scaled < 100 ? 1 : 0;
  return `${sign}${trimCompactNumber(scaled, decimals)}${COMPACT_NUMBER_SUFFIXES[suffixIndex]}`;
}

function formatShopCount(value) {
  return formatCompactNumber(Math.floor(safeNonNegativeNumber(value, 0, SHOP_MAX_RESOURCE)));
}

function formatShopCost(value) {
  return formatCompactNumber(Math.ceil(safeNonNegativeNumber(value, 0, SHOP_MAX_RESOURCE)));
}

function formatShopRate(rate) {
  const value = Number(rate || 0);
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (value >= 1000) return formatCompactNumber(value);
  if (value >= 1) return String(roundTo(value, 1));
  return String(roundTo(value, 3));
}

function formatShopBalance(value, carry = 0) {
  const total = safeNonNegativeNumber(value, 0) + safeNonNegativeNumber(carry, 0, 1000);
  if (total < 100 && !Number.isInteger(total)) return String(roundTo(total, 2));
  return formatCompactNumber(total);
}

function formatCash(value) {
  return `$${formatShopCost(value)}`;
}

function formatCashCount(value) {
  return `$${formatShopCount(value)}`;
}

function formatCashBalance(value, carry = 0) {
  return `$${formatShopBalance(value, carry)}`;
}

function formatCashRate(value) {
  return `$${formatShopRate(value)}`;
}

function setTextIfChanged(node, text) {
  if (!node) return false;
  const nextText = String(text ?? "");
  if (node.textContent === nextText) return false;
  node.textContent = nextText;
  return true;
}

function readyDeliveryOrders(shop) {
  return Math.floor(clampDeliveryOrderQueue(shop && shop.deliveryOrders));
}

function shopOrderTypeById(orderTypeId) {
  return SHOP_ORDER_TYPES.find((orderType) => orderType.id === orderTypeId) || SHOP_ORDER_TYPES[0];
}

function getShopOrderTypes() {
  return SHOP_ORDER_TYPES.map((orderType) => ({ ...orderType }));
}

function counterContractById(contractId) {
  return COUNTER_CONTRACTS.find((contract) => contract.id === contractId) || null;
}

function counterContractPurchased(gameState, contractId) {
  const state = normalizeGameState(gameState);
  return Boolean(state.shop.counterContracts && state.shop.counterContracts.purchasedIds.includes(contractId));
}

function counterContractForOrderType(orderTypeId) {
  return COUNTER_CONTRACTS.find((contract) => contract.unlockOrderTypeId === orderTypeId) || null;
}

function counterContractPrerequisitesMet(contract, gameState) {
  const state = normalizeGameState(gameState);
  if (!contract) return false;
  if (contract.id === "wholesale_counter_contract") {
    return safeNonNegativeInteger(state.shop.stationUpgrades.manager_shift_manager, 0, 1) > 0
      && counterServiceBatchSizeWithoutContracts(state) >= 25;
  }
  if (contract.id === "catering_account") {
    return counterContractPurchased(state, "wholesale_counter_contract");
  }
  if (contract.id === "event_vendor_contract") {
    return counterContractPurchased(state, "catering_account");
  }
  return false;
}

function counterContractLockedReason(contract, gameState) {
  const state = normalizeGameState(gameState);
  if (!contract) return "Contract unavailable.";
  if (counterContractPrerequisitesMet(contract, state)) return "";
  return contract.lockedCopy;
}

function nextCounterContract(gameState) {
  const state = normalizeGameState(gameState);
  return COUNTER_CONTRACTS.find((contract) => !counterContractPurchased(state, contract.id)) || null;
}

function counterContractStatus(contract, gameState) {
  const state = normalizeGameState(gameState);
  const purchased = Boolean(contract && counterContractPurchased(state, contract.id));
  const unlocked = Boolean(contract && !purchased && counterContractPrerequisitesMet(contract, state));
  const missingCash = contract ? Math.max(0, contract.costTips - state.shop.tips) : 0;
  const missingReputation = contract ? Math.max(0, contract.costReputation - state.shop.reputation) : 0;
  const disabledReasons = [];
  if (!contract) disabledReasons.push("Contract unavailable.");
  if (contract && !purchased && !unlocked) disabledReasons.push(counterContractLockedReason(contract, state));
  if (missingCash > 0) disabledReasons.push(`Need ${formatCash(missingCash)} more Cash`);
  if (missingReputation > 0) disabledReasons.push(`Need ${formatShopCost(missingReputation)} more Reputation`);
  return {
    purchased,
    unlocked,
    canBuy: unlocked && missingCash <= 0 && missingReputation <= 0 && !appState.running && !appState.calibrating,
    disabledReason: purchased ? "Signed" : disabledReasons.join(" and "),
    missingCash,
    missingReputation,
    progress: contract ? affordabilityProgress([
      {
        label: "Cash",
        current: state.shop.tips,
        required: contract.costTips,
        perSecond: counterServiceIncomeStatus(state).tipsPerMinute / 60,
      },
      {
        label: "Reputation",
        current: state.shop.reputation,
        required: contract.costReputation,
        perSecond: getShopGeneratorRates(state).passiveReputationPerSecond,
      },
    ]) : null,
  };
}

function buyCounterContract(contractId, gameState, options = {}) {
  let next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Counter Contracts unlock after you finish and park.", gameState: next };
  }
  const contract = counterContractById(contractId);
  if (!contract) return { ok: false, reason: "Counter Contract unavailable.", gameState: next };
  const status = counterContractStatus(contract, next);
  if (status.purchased) return { ok: false, reason: "Counter Contract already signed.", gameState: next, contract };
  if (!status.unlocked) return { ok: false, reason: counterContractLockedReason(contract, next), gameState: next, contract };
  if (next.shop.tips < contract.costTips) return { ok: false, reason: `Need ${formatCash(status.missingCash)} more Cash.`, gameState: next, contract };
  if (next.shop.reputation < contract.costReputation) return { ok: false, reason: `Need ${formatShopCost(status.missingReputation)} more Reputation.`, gameState: next, contract };
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - contract.costTips);
  next.shop.reputation = safeNonNegativeInteger(next.shop.reputation - contract.costReputation);
  next.shop.shopLevel = getShopLevel(next.shop.reputation);
  next.shop.counterContracts.purchasedIds = [...next.shop.counterContracts.purchasedIds, contract.id].slice(0, COUNTER_CONTRACTS.length);
  next.shop.counterService.lastResult = `${contract.name} signed. Counter Service batch floor is now ${formatShopCount(contract.batchFloor)}.`;
  next = addLedgerEntry(next, "upgrade", `${contract.name} signed.`);
  return {
    ok: true,
    reason: "",
    gameState: next,
    contract,
    feedback: `${contract.name} signed: ${shopOrderTypeById(contract.unlockOrderTypeId).name} unlocked · Counter Service batch floor ${formatShopCount(contract.batchFloor)}.`,
  };
}

function shopOrderTypeUnlocked(orderType, gameState) {
  const state = normalizeGameState(gameState);
  const fulfilled = fulfilledShopOrderCount(state);
  if (!orderType || orderType.future) return false;
  if (orderType.id === "simple_tofu_box") return true;
  if (orderType.id === "family_tofu_tray") return fulfilled >= 5 || state.shop.shopLevel >= 2;
  if (orderType.id === "festival_bento") return fulfilled >= 25 || state.shop.reputation >= 50;
  if (orderType.id === "catering_crate") {
    return fulfilled >= 100
      && state.shop.reputation >= 250
      && state.shop.shopLevel >= 25;
  }
  const contract = counterContractForOrderType(orderType.id);
  if (contract) return counterContractPurchased(state, contract.id);
  return false;
}

function shopOrderTypeRevealed(orderType, gameState) {
  const state = normalizeGameState(gameState);
  const fulfilled = fulfilledShopOrderCount(state);
  if (!orderType || orderType.future) return false;
  if (shopOrderTypeUnlocked(orderType, state)) return true;
  if (orderType.id === "family_tofu_tray") return fulfilled >= 3 || state.shop.shopLevel >= 2;
  if (orderType.id === "festival_bento") return fulfilled >= 20 || state.shop.reputation >= 40;
  if (orderType.id === "catering_crate") return fulfilled >= 75 || state.shop.reputation >= 200 || state.shop.shopLevel >= 20;
  return orderType.id === "simple_tofu_box";
}

function shopOrderUnlockReason(orderType) {
  if (!orderType) return "Order unavailable.";
  if (orderType.id === "family_tofu_tray") return "Unlocks after 5 fulfilled orders or Shop Level 2.";
  if (orderType.id === "festival_bento") return "Unlocks after 25 fulfilled orders or 50 Reputation.";
  if (orderType.id === "catering_crate") return "Unlocks after 100 fulfilled orders, 250 Reputation, and Shop Level 25.";
  const contract = counterContractForOrderType(orderType.id);
  if (contract) return `Unlocks after ${contract.name}.`;
  return "Available immediately.";
}

function maxFulfillableShopOrderQuantity(gameState, orderType) {
  const state = normalizeGameState(gameState);
  const readyOrders = readyDeliveryOrders(state.shop);
  const orderCost = Math.max(1, safeNonNegativeInteger(orderType && orderType.deliveryOrdersRequired, 1, 100000));
  const tofuCost = Math.max(0, safeNonNegativeInteger(orderType && orderType.tofuRequired, 0, 10000000));
  const maxByOrders = Math.floor(readyOrders / orderCost);
  const maxByTofu = tofuCost > 0
    ? Math.floor(safeNonNegativeNumber(state.shop.tofuStock, 0, SHOP_MAX_RESOURCE) / tofuCost)
    : maxByOrders;
  return Math.max(0, Math.min(maxByOrders, maxByTofu));
}

function shopOrderDisabledReason(orderType, gameState, unlocked = shopOrderTypeUnlocked(orderType, gameState)) {
  const state = normalizeGameState(gameState);
  if (!orderType) return "Order unavailable.";
  if (!unlocked) return shopOrderUnlockReason(orderType);
  const readyOrders = readyDeliveryOrders(state.shop);
  if (readyOrders < orderType.deliveryOrdersRequired) {
    const prep = orderPrepProgress(state);
    if (orderType.deliveryOrdersRequired === 1) {
      return `Need 1 prepared order. ${prep.message}`;
    }
    const missingOrders = Math.ceil(orderType.deliveryOrdersRequired - readyOrders);
    return `Need ${formatShopCount(missingOrders)} more ready order${missingOrders === 1 ? "" : "s"}. ${prep.message}`;
  }
  if (state.shop.tofuStock < orderType.tofuRequired) {
    const tofuNeeded = Math.max(1, Math.ceil(orderType.tofuRequired - state.shop.tofuStock));
    return `Need ${formatShopCost(tofuNeeded)} more tofu stock. Let Tofu Press work or buy more supply.`;
  }
  return "";
}

function clampPercent(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function bestFulfillableShopOrderType(gameState) {
  const state = normalizeGameState(gameState);
  return SHOP_ORDER_TYPES
    .filter((orderType) => shopOrderTypeUnlocked(orderType, state))
    .filter((orderType) => maxFulfillableShopOrderQuantity(state, orderType) > 0)
    .sort((a, b) => b.tips - a.tips)[0] || null;
}

function bestUnlockedShopOrderType(gameState) {
  const state = normalizeGameState(gameState);
  return SHOP_ORDER_TYPES
    .filter((orderType) => shopOrderTypeUnlocked(orderType, state))
    .sort((a, b) => b.tofuRequired - a.tofuRequired)[0] || SHOP_ORDER_TYPES[0];
}

function offlineProgressCapHours(gameState) {
  const shop = gameState && gameState.shop ? gameState.shop : {};
  const shiftManagerPurchased = safeNonNegativeInteger(
    shop.stationUpgrades && shop.stationUpgrades.manager_shift_manager,
    0,
    1,
  ) > 0;
  return shiftManagerPurchased || managerDeskUnlocked(gameState)
    ? SHOP_OFFLINE_MANAGED_CAP_HOURS
    : SHOP_OFFLINE_BASE_CAP_HOURS;
}

function orderPrepProgress(gameState) {
  const state = normalizeGameState(gameState);
  const rates = getShopGeneratorRates(state);
  const carry = safeNonNegativeNumber(state.shop.generatorCarry && state.shop.generatorCarry.deliveryOrders, 0, 0.999);
  const progress = Math.max(0, Math.min(0.999, carry));
  const ready = readyDeliveryOrders(state.shop);
  const running = rates.prepOrdersPerSecond > 0 && rates.prepStatus === "Running";
  const waitingForTofu = rates.prepStatus === "Waiting for tofu stock";
  const prepOwned = safeNonNegativeInteger(state.shop.stations.prep_counter, 0, 100000);
  const etaSeconds = running && progress < 1
    ? Math.ceil((1 - progress) / rates.prepOrdersPerSecond)
    : null;
  let message = `Next order is ${Math.floor(progress * 100)}% prepared.`;
  if (ready >= deliveryOrderQueueCapacity()) {
    message = state.shop.counterService && state.shop.counterService.running
      ? "Order queue full. Counter Service is clearing prepared orders."
      : "Order queue full. Start Counter Service to clear prepared orders.";
  } else if (ready > 0) {
    message = `Next order is ${Math.floor(progress * 100)}% prepared. Ready orders can be fulfilled now.`;
  } else if (running && etaSeconds !== null) {
    message = `Next order is ${Math.floor(progress * 100)}% prepared. About ${etaSeconds} seconds remaining.`;
  } else if (waitingForTofu) {
    message = "Prep Counter needs more Tofu Stock.";
  } else if (prepOwned < 1 || !state.shop.generators.prepCounter.unlocked) {
    message = "Buy or start Prep Counter to prepare orders.";
  }
  return {
    ready,
    progress,
    progressPercent: Math.floor(progress * 100),
    etaSeconds,
    running,
    waitingForTofu,
    message,
  };
}

function tofuStockRunway(gameState) {
  const state = normalizeGameState(gameState);
  const rates = getShopGeneratorRates(state);
  const tofuStock = safeNonNegativeNumber(state.shop.tofuStock, 0, SHOP_MAX_RESOURCE);
  const orderType = bestUnlockedShopOrderType(state);
  const tofuPerOrder = Math.max(1, safeNonNegativeInteger(orderType.tofuRequired, PREP_COUNTER_CONSUME_PER_ORDER, 100000));
  const ordersRemaining = Math.floor(tofuStock / tofuPerOrder);
  const secondsRemaining = rates.prepTofuPerSecond > 0
    ? Math.floor(tofuStock / rates.prepTofuPerSecond)
    : null;
  let label = "Neutral";
  const orderLabel = orderType.id === "simple_tofu_box" ? "order" : orderType.name;
  const remainingLabel = formatShopCount(ordersRemaining);
  let message = `Tofu Stock can support ${remainingLabel} more ${orderLabel}${ordersRemaining === 1 || orderType.id !== "simple_tofu_box" ? "" : "s"}.`;
  if (ordersRemaining >= 10) {
    label = "Enough";
    message = orderType.id === "simple_tofu_box"
      ? `Enough tofu for ${remainingLabel} more orders. Tofu Stock feeds Prep Counter, but it is not the bottleneck right now.`
      : `Enough tofu for ${remainingLabel} ${orderType.name}${ordersRemaining === 1 ? "" : "s"}. Bigger orders use more tofu and pay more Cash.`;
  } else if (ordersRemaining >= 3) {
    label = "Watch";
    message = orderType.id === "simple_tofu_box"
      ? `Tofu Stock can support ${remainingLabel} more orders. Keep an eye on it as Prep Counter scales.`
      : `Tofu Stock can support ${remainingLabel} ${orderType.name}${ordersRemaining === 1 ? "" : "s"}.`;
  } else if (ordersRemaining > 0) {
    label = "Low";
    message = orderType.id === "simple_tofu_box"
      ? `Tofu Stock is getting low: enough for ${remainingLabel} more order${ordersRemaining === 1 ? "" : "s"}.`
      : `Tofu Stock is getting low: enough for ${remainingLabel} ${orderType.name}${ordersRemaining === 1 ? "" : "s"}.`;
  } else {
    label = "Empty";
    message = "Need more Tofu Stock. Let Tofu Press work or buy more supply.";
  }
  return {
    tofuStock,
    ordersRemaining,
    secondsRemaining,
    label,
    message,
    orderType,
    tofuPerOrder,
    isLow: ordersRemaining < 3,
    isHealthy: ordersRemaining >= 10,
  };
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
      excessHours: 0,
      capHours: 0,
      capped: false,
      elapsedSeconds: 0,
      carry: {
        tofuStock: safeNonNegativeNumber(existingCarry.tofuStock, 0, 1000),
        deliveryOrders: safeNonNegativeNumber(existingCarry.deliveryOrders, 0, 1000),
        tips: safeNonNegativeNumber(existingCarry.tips, 0, 1000),
        reputation: safeNonNegativeNumber(existingCarry.reputation, 0, 1000),
      },
      prepStatus: rates.prepStatus,
      queueFull: readyDeliveryOrders(shop) >= deliveryOrderQueueCapacity(),
    };
  }
  const maxSeconds = Number.isFinite(Number(options.maxSeconds))
    ? Math.max(0, Number(options.maxSeconds))
    : SHOP_OPEN_TICK_MAX_SECONDS;
  const actualElapsedSeconds = Math.max(0, (nowMs - lastMs) / 1000);
  const elapsedSeconds = Math.min(maxSeconds, actualElapsedSeconds);
  const carry = shop.generatorCarry || {};
  const useCarry = options.useCarry !== false;
  const tofuTotal = rates.tofuPressPerSecond * elapsedSeconds + (useCarry ? Number(carry.tofuStock || 0) : 0);
  const tipsTotal = rates.customerTipsPerSecond * elapsedSeconds + (useCarry ? Number(carry.tips || 0) : 0);
  const reputationTotal = rates.passiveReputationPerSecond * elapsedSeconds + (useCarry ? Number(carry.reputation || 0) : 0);
  const tofuProduced = Math.floor(tofuTotal);
  const availableTofu = safeNonNegativeInteger(shop.tofuStock + tofuProduced);
  const prepCanProgress = availableTofu >= PREP_COUNTER_CONSUME_PER_ORDER;
  const orderTotal = (prepCanProgress ? rates.prepOrdersPerSecond * elapsedSeconds : 0)
    + (useCarry ? Number(carry.deliveryOrders || 0) : 0);
  const possibleOrders = Math.floor(orderTotal);
  const queueSpace = deliveryOrderQueueSpace(shop);
  const possibleByTofu = Math.floor(availableTofu / PREP_COUNTER_CONSUME_PER_ORDER);
  const deliveryOrders = Math.min(possibleOrders, possibleByTofu, queueSpace);
  const tofuConsumed = deliveryOrders * PREP_COUNTER_CONSUME_PER_ORDER;
  const tofuStock = tofuProduced - tofuConsumed;
  const tips = Math.floor(tipsTotal);
  const reputation = Math.floor(reputationTotal);
  const prepSlots = rates.prepSlotPerSecond * elapsedSeconds;
  const shopSpirit = rates.shopSpiritPerSecond * elapsedSeconds;
  const queueFull = queueSpace <= 0;
  const prepStatus = !shop.generators.prepCounter.unlocked
    ? "Locked"
    : queueFull
      ? "Order queue full"
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
      deliveryOrders: queueFull || deliveryOrders < Math.min(possibleOrders, possibleByTofu)
        ? 0
        : Math.max(0, orderTotal - possibleOrders),
      tips: Math.max(0, tipsTotal - tips),
      reputation: Math.max(0, reputationTotal - reputation),
    },
    cappedHours: roundTo(elapsedSeconds / 3600, 2),
    elapsedHours: roundTo(actualElapsedSeconds / 3600, 2),
    excessHours: roundTo(Math.max(0, actualElapsedSeconds - elapsedSeconds) / 3600, 2),
    capHours: roundTo(maxSeconds / 3600, 2),
    capped: actualElapsedSeconds > elapsedSeconds + 0.001,
    elapsedSeconds: roundTo(elapsedSeconds, 2),
    prepStatus,
    queueFull,
    queueCapacity: deliveryOrderQueueCapacity(),
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
    next.shop.deliveryOrders = clampDeliveryOrderQueue(
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
  const capHours = offlineProgressCapHours(gameState);
  return calculateShopGeneratorEarnings(gameState, now, {
    maxSeconds: capHours * 3600,
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

function routeGameplayEnabled() {
  return TOFU_GARAGE_ROUTES_ENABLED;
}

function isDeferredRouteStationId(stationId) {
  return !routeGameplayEnabled() && DEFERRED_ROUTE_STATION_IDS.has(stationId);
}

function isDeferredRouteUpgrade(upgrade) {
  return Boolean(
    upgrade
      && !routeGameplayEnabled()
      && DEFERRED_ROUTE_UPGRADE_STATION_IDS.has(upgrade.stationId),
  );
}

function routeGameplayDeferredReason() {
  return "Routes are deferred until they have a clear shop purpose.";
}

function stationIsUnlocked(station, gameState) {
  const state = normalizeGameState(gameState);
  const shop = state.shop;
  if (!station) return false;
  if (isDeferredRouteStationId(station.id)) return false;
  if (station.id === "tofu_press") return true;
  if (station.id === "prep_counter") return shop.shopLevel >= 2 || shop.tofuStock >= 10 || shop.stations.prep_counter > 0;
  if (station.id === "delivery_shelf") {
    return fulfilledShopOrderCount(state) >= 10
      || Boolean(state.stamps.first_family_tofu_tray)
      || (hasShopStationUpgrade(state) && shop.shopLevel >= 2)
      || shop.stations.delivery_shelf > 0;
  }
  if (station.id === "shop_sign") {
    return shop.reputation >= 10
      || shop.lifetimeTips >= 100
      || shop.stations.delivery_shelf > 0
      || shop.stations.shop_sign > 0;
  }
  if (station.id === "regular_customer") return shop.stations.shop_sign > 0 && fulfilledShopOrderCount(state) >= 25;
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
  if (tipsNeeded > 0) return `Need ${formatCash(tipsNeeded)} more. Let Counter Service earn Cash from tips.`;
  const prepNeeded = Math.max(0, Math.ceil(safeNonNegativeInteger(station.prepSlotCost, 0, 100) - state.shop.prepSlots));
  if (prepNeeded > 0) return `Need ${formatShopCount(prepNeeded)} more Prep Capacity`;
  return "";
}

function visibleShopStations(gameState) {
  const state = normalizeGameState(gameState);
  return SHOP_STATIONS.filter((station) => {
    if (isDeferredRouteStationId(station.id)) return false;
    if (station.id === "tofu_press" || station.id === "prep_counter") return true;
    if (station.id === "delivery_shelf") return stationIsUnlocked(station, state);
    if (station.id === "shop_sign") return stationIsUnlocked(station, state);
    if (station.id === "regular_customer") return false;
    if (station.id === "delivery_route") return hasRouteStoryBeat(state) && state.shop.stations.delivery_route > 0;
    if (station.id === "dispatcher_desk" || station.id === "regional_network") return false;
    return stationIsUnlocked(station, state) && state.shop.stations[station.id] > 0;
  });
}

function stationAffordabilityStatus(station, gameState) {
  const state = normalizeGameState(gameState);
  if (!station) return { canBuy: false, cost: 0, progress: null, disabledReason: "Shop station unavailable." };
  const owned = safeNonNegativeInteger(state.shop.stations[station.id], 0, 100000);
  const cost = stationCost(station, owned);
  const unlocked = stationIsUnlocked(station, state);
  const disabledReason = stationPurchaseDisabledReason(station, state, cost, unlocked);
  return {
    canBuy: unlocked && !disabledReason && !appState.running && !appState.calibrating,
    cost,
    unlocked,
    disabledReason,
    progress: affordabilityProgress([
      {
        label: "Cash",
        current: state.shop.tips,
        required: cost,
        perSecond: counterServiceIncomeStatus(state).tipsPerMinute / 60,
      },
      {
        label: "Prep Capacity",
        current: state.shop.prepSlots,
        required: safeNonNegativeInteger(station.prepSlotCost, 0, 100),
        perSecond: getShopGeneratorRates(state).prepSlotPerSecond,
      },
    ]),
  };
}

function stationUpgradeCostTips(upgrade, level = 0) {
  if (!upgrade || !upgrade.costTips) return 0;
  return Math.ceil(upgrade.costTips * Math.pow(1.32, safeNonNegativeInteger(level, 0, upgrade.maxLevel)));
}

function stationUpgradeCostReputation(upgrade, level = 0) {
  if (!upgrade || !upgrade.costReputation) return 0;
  return Math.ceil(upgrade.costReputation * Math.pow(1.32, safeNonNegativeInteger(level, 0, upgrade.maxLevel)));
}

function isSupplierUpgrade(upgrade) {
  return Boolean(upgrade && upgrade.stationId === "supplier_contract");
}

function isManagerDeskUpgrade(upgrade) {
  return Boolean(upgrade && upgrade.stationId === "manager_desk");
}

function managerDeskUnlocked(gameState) {
  const state = normalizeGameState(gameState);
  const reputationGate = state.shop.reputation >= 1000000
    || safeNonNegativeInteger(state.shop.lifetimeReputation, 0, SHOP_MAX_RESOURCE) >= 1000000;
  const levelGate = state.shop.shopLevel >= 100
    || safeNonNegativeInteger(state.shop.lifetimeReputation, 0, SHOP_MAX_RESOURCE) >= 1000000;
  return safeNonNegativeInteger(state.shop.stationUpgrades.counter_service_crew, 0, 1) > 0
    && shopOrderTypeUnlocked(shopOrderTypeById("catering_crate"), state)
    && levelGate
    && reputationGate;
}

function coveredCarTeaserUnlockCriteria(state) {
  const upgrades = state && state.shop && state.shop.stationUpgrades
    ? state.shop.stationUpgrades
    : {};
  const fulfilled = fulfilledShopOrderCount(state);
  const hasCounterCrew = safeNonNegativeInteger(upgrades.counter_service_crew, 0, 1) > 0;
  const hasShiftManager = safeNonNegativeInteger(upgrades.manager_shift_manager, 0, 1) > 0;
  const hasWholesalePickup = safeNonNegativeInteger(upgrades.manager_wholesale_pickup, 0, 1) > 0
    || safeNonNegativeInteger(state.shop && state.shop.wholesalePickupsCompleted, 0, 1000000) > 0;
  const hasManagedScale = safeNonNegativeInteger(state.shop && state.shop.shopLevel, 0, 100000) >= 100
    || safeNonNegativeInteger(state.shop && state.shop.lifetimeReputation, 0, SHOP_MAX_RESOURCE) >= 1000000;
  const hasCoreShopDiscovered = fulfilled >= 100
    && safeNonNegativeInteger(state.shop && state.shop.lifetimeTips, 0, SHOP_MAX_RESOURCE) >= 100
    && (
      Boolean(state.stamps && state.stamps.first_family_tofu_tray)
      || fulfilled >= 100
    );
  return hasCounterCrew
    && hasShiftManager
    && hasWholesalePickup
    && hasManagedScale
    && hasCoreShopDiscovered;
}

function coveredCarTeaserUnlocked(gameState) {
  const state = normalizeGameState(gameState);
  return Boolean(state.shop.coveredCarTeaserUnlocked)
    || coveredCarTeaserUnlockCriteria(state);
}

function coveredCarTeaserSeen(gameState) {
  const state = normalizeGameState(gameState);
  return Boolean(state.shop.coveredCarTeaserSeen)
    || state.seenStoryBeatIds.includes(COVERED_CAR_TEASER_ID);
}

function cashBalance(gameState) {
  const state = normalizeGameState(gameState);
  return safeNonNegativeInteger(state.shop.tips, 0, SHOP_MAX_RESOURCE);
}

function stationPortfolioValue(gameState) {
  const state = normalizeGameState(gameState);
  return SHOP_STATIONS.reduce((total, station) => {
    const owned = safeNonNegativeInteger(state.shop.stations[station.id], 0, 100000);
    if (owned <= 0) return total;
    const visibleOwned = Math.min(owned, 50);
    const currentCostProxy = station.baseCostTips * Math.pow(station.growthRate, visibleOwned);
    return total + currentCostProxy * Math.max(1, owned) * 0.35;
  }, 0);
}

function upgradePortfolioValue(gameState) {
  const state = normalizeGameState(gameState);
  return STATION_UPGRADES.reduce((total, upgrade) => {
    const level = safeNonNegativeInteger(state.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel);
    if (level <= 0 || !upgrade.costTips) return total;
    const levelCostProxy = upgrade.costTips * Math.pow(1.32, Math.max(0, level - 1));
    return total + levelCostProxy * level;
  }, 0);
}

function tofuBusinessValue(gameState) {
  const state = normalizeGameState(gameState);
  const rates = getShopGeneratorRates(state);
  const counterIncome = counterServiceIncomeStatus(state);
  const stationValue = stationPortfolioValue(state);
  const upgradeValue = upgradePortfolioValue(state);
  const supplierValue = supplierStockPerSecond(state) * 300;
  const reputationValue = Math.sqrt(safeNonNegativeNumber(state.shop.lifetimeReputation, 0, SHOP_MAX_RESOURCE)) * 25;
  const levelValue = safeNonNegativeInteger(state.shop.shopLevel, 0, 100000) * 150;
  const hasShopEarnings = safeNonNegativeInteger(state.shop.lifetimeTips, 0, SHOP_MAX_RESOURCE) > 0
    || fulfilledShopOrderCount(state) > 0;
  const throughputValue = hasShopEarnings
    ? (
        rates.tofuPressPerSecond * 120
        + rates.prepOrdersPerSecond * 900
        + safeNonNegativeNumber(counterIncome.tipsPerMinute, 0, SHOP_MAX_RESOURCE) * 20
      )
    : 0;
  return safeNonNegativeInteger(
    Math.round(stationValue + upgradeValue + supplierValue + reputationValue + levelValue + throughputValue),
    0,
    SHOP_MAX_RESOURCE,
  );
}

function netWorthV1(gameState) {
  const state = normalizeGameState(gameState);
  return safeNonNegativeInteger(
    cashBalance(state) + tofuBusinessValue(state) + projectCarValueV1(state) + brandValueV1(state),
    0,
    SHOP_MAX_RESOURCE,
  );
}

function netWorthV1FormulaLabel(gameState) {
  const state = normalizeGameState(gameState);
  const components = ["Cash", "Tofu Business Value"];
  if (projectCarValueV1(state) > 0) components.push(GARAGE_BUILD_VALUE_LABEL);
  if (brandValueV1(state) > 0) components.push("Brand Value");
  return components.join(" + ");
}

function netWorthGrowthGuidance(gameState) {
  const state = normalizeGameState(gameState);
  const extras = [];
  if (projectCarValueV1(state) > 0) extras.push("garage build value");
  if (brandValueV1(state) > 0) extras.push("Brand Value");
  return `Keep growing Cash and business value${extras.length ? `, plus ${extras.join(" and ")}` : ""}.`;
}

function netWorthProgress(gameState) {
  const current = netWorthV1(gameState);
  return {
    current,
    goal: NET_WORTH_GOAL,
    percent: clampPercent(Math.round((current / NET_WORTH_GOAL) * 1000) / 10),
  };
}

function reachedNetWorthMilestones(gameState) {
  const current = netWorthV1(gameState);
  return NET_WORTH_MILESTONES.filter((milestone) => current >= milestone.amount);
}

function storedNetWorthMilestoneIds(gameState) {
  const state = normalizeGameState(gameState);
  return new Set(state.shop.dreamBuild.netWorthMilestonesReached || []);
}

function netWorthMilestoneReached(gameState, milestoneId) {
  const stored = storedNetWorthMilestoneIds(gameState);
  if (stored.has(milestoneId)) return true;
  const milestone = NET_WORTH_MILESTONES.find((item) => item.id === milestoneId);
  return Boolean(milestone && netWorthV1(gameState) >= milestone.amount);
}

function nextNetWorthMilestone(gameState) {
  const current = netWorthV1(gameState);
  return NET_WORTH_MILESTONES.find((milestone) => current < milestone.amount) || NET_WORTH_MILESTONES[NET_WORTH_MILESTONES.length - 1];
}

function latestNetWorthMilestone(gameState) {
  return reachedNetWorthMilestones(gameState).slice(-1)[0] || null;
}

function syncNetWorthMilestones(gameState) {
  let state = normalizeGameState(gameState);
  if (!shouldShowNetWorthV1(state)) {
    return { gameState: state, newMilestones: [] };
  }
  const reached = reachedNetWorthMilestones(state);
  const existing = new Set(state.shop.dreamBuild.netWorthMilestonesReached || []);
  const newMilestones = reached.filter((milestone) => !existing.has(milestone.id));
  if (!newMilestones.length) {
    return { gameState: state, newMilestones: [] };
  }
  state.shop.dreamBuild.netWorthMilestonesReached = reached.map((milestone) => milestone.id);
  const firstNew = newMilestones[0];
  const message = `Net Worth milestone reached: ${firstNew.reachedLabel}.`;
  state.shop.counterService.lastResult = message;
  state = addLedgerEntry(state, "story", message);
  return { gameState: state, newMilestones };
}

function shouldShowNetWorthV1(gameState) {
  const state = normalizeGameState(gameState);
  return coveredCarTeaserUnlocked(state)
    || managerDeskUnlocked(state)
    || safeNonNegativeInteger(state.shop.shopLevel, 0, 100000) >= 100;
}

function dreamBuildWheelsPurchased(gameState) {
  return Boolean(normalizeGameState(gameState).shop.dreamBuild.wheelsPurchased);
}

function dreamBuildWheelsLevel(gameState) {
  return safeNonNegativeInteger(normalizeGameState(gameState).shop.dreamBuild.wheelsLevel, 0, 5);
}

function dreamBuildExhaustPurchased(gameState) {
  return Boolean(normalizeGameState(gameState).shop.dreamBuild.exhaustPurchased);
}

function dreamBuildExhaustLevel(gameState) {
  return safeNonNegativeInteger(normalizeGameState(gameState).shop.dreamBuild.exhaustLevel, 0, 5);
}

function dreamBuildSuspensionLevel(gameState) {
  return safeNonNegativeInteger(normalizeGameState(gameState).shop.dreamBuild.suspensionLevel, 0, 5);
}

function dreamBuildTiresLevel(gameState) {
  return safeNonNegativeInteger(normalizeGameState(gameState).shop.dreamBuild.tiresLevel, 0, 5);
}

function dreamBuildBrakesLevel(gameState) {
  return safeNonNegativeInteger(normalizeGameState(gameState).shop.dreamBuild.brakesLevel, 0, 5);
}

function dreamBuildInductionLevel(gameState) {
  return safeNonNegativeInteger(normalizeGameState(gameState).shop.dreamBuild.inductionLevel, 0, 5);
}

function dreamBuildDrivetrainLevel(gameState) {
  return safeNonNegativeInteger(normalizeGameState(gameState).shop.dreamBuild.drivetrainLevel, 0, 5);
}

function dreamBuildAeroLevel(gameState) {
  return safeNonNegativeInteger(normalizeGameState(gameState).shop.dreamBuild.aeroLevel, 0, 5);
}

function dreamBuildFinalBuildLevel(gameState) {
  return safeNonNegativeInteger(normalizeGameState(gameState).shop.dreamBuild.finalBuildLevel, 0, 2);
}

function dreamBuildInvestmentStarted(gameState) {
  const state = normalizeGameState(gameState);
  const build = state.shop.dreamBuild;
  return Boolean(build.wheelsPurchased)
    || safeNonNegativeInteger(build.wheelsLevel, 0, 5) > 0
    || Boolean(build.exhaustPurchased)
    || safeNonNegativeInteger(build.exhaustLevel, 0, 5) > 0
    || safeNonNegativeInteger(build.suspensionLevel, 0, 5) > 0
    || safeNonNegativeInteger(build.tiresLevel, 0, 5) > 0
    || safeNonNegativeInteger(build.brakesLevel, 0, 5) > 0
    || safeNonNegativeInteger(build.inductionLevel, 0, 5) > 0
    || safeNonNegativeInteger(build.drivetrainLevel, 0, 5) > 0
    || safeNonNegativeInteger(build.aeroLevel, 0, 5) > 0
    || safeNonNegativeInteger(build.finalBuildLevel, 0, 2) > 0
    || Boolean(build.showcaseDisplayPrepared);
}

function dreamBuildProgressiveValue(level, values) {
  const count = clamp(safeNonNegativeInteger(level, 0, values.length), 0, values.length);
  return values.slice(0, count).reduce((total, value) => total + value, 0);
}

function projectCarValueFromDreamBuild(dreamBuild) {
  const build = dreamBuild && typeof dreamBuild === "object" ? dreamBuild : {};
  const wheelsLevel = safeNonNegativeInteger(build.wheelsLevel, 0, 5);
  const exhaustLevel = safeNonNegativeInteger(build.exhaustLevel, 0, 5);
  const suspensionLevel = safeNonNegativeInteger(build.suspensionLevel, 0, 5);
  const tiresLevel = safeNonNegativeInteger(build.tiresLevel, 0, 5);
  const brakesLevel = safeNonNegativeInteger(build.brakesLevel, 0, 5);
  const inductionLevel = safeNonNegativeInteger(build.inductionLevel, 0, 5);
  const drivetrainLevel = safeNonNegativeInteger(build.drivetrainLevel, 0, 5);
  const aeroLevel = safeNonNegativeInteger(build.aeroLevel, 0, 5);
  const finalBuildLevel = safeNonNegativeInteger(build.finalBuildLevel, 0, 2);
  let value = 0;
  if (wheelsLevel >= 3) {
    value += DREAM_BUILD_WHEELS_VALUE + DREAM_BUILD_WHEELS_POLISH_VALUE + DREAM_BUILD_WHEELS_FITMENT_VALUE;
  } else if (wheelsLevel >= 2) {
    value += DREAM_BUILD_WHEELS_VALUE + DREAM_BUILD_WHEELS_POLISH_VALUE;
  } else if (wheelsLevel >= 1) {
    value += DREAM_BUILD_WHEELS_VALUE;
  }
  if (exhaustLevel >= 5) {
    value += DREAM_BUILD_EXHAUST_VALUE
      + DREAM_BUILD_EXHAUST_SEAL_VALUE
      + DREAM_BUILD_EXHAUST_TUNED_NOTE_VALUE
      + DREAM_BUILD_EXHAUST_HEAT_WRAP_VALUE
      + DREAM_BUILD_EXHAUST_SHOWCASE_FINISH_VALUE;
  } else if (exhaustLevel >= 4) {
    value += DREAM_BUILD_EXHAUST_VALUE
      + DREAM_BUILD_EXHAUST_SEAL_VALUE
      + DREAM_BUILD_EXHAUST_TUNED_NOTE_VALUE
      + DREAM_BUILD_EXHAUST_HEAT_WRAP_VALUE;
  } else if (exhaustLevel >= 3) {
    value += DREAM_BUILD_EXHAUST_VALUE + DREAM_BUILD_EXHAUST_SEAL_VALUE + DREAM_BUILD_EXHAUST_TUNED_NOTE_VALUE;
  } else if (exhaustLevel >= 2) {
    value += DREAM_BUILD_EXHAUST_VALUE + DREAM_BUILD_EXHAUST_SEAL_VALUE;
  } else if (exhaustLevel >= 1) {
    value += DREAM_BUILD_EXHAUST_VALUE;
  }
  if (build.showcaseDisplayPrepared) {
    value += SHOWCASE_PREP_VALUE;
  }
  if (suspensionLevel >= 5) {
    value += DREAM_BUILD_SUSPENSION_REFRESH_VALUE
      + DREAM_BUILD_SUSPENSION_RIDE_HEIGHT_VALUE
      + DREAM_BUILD_SUSPENSION_ALIGNMENT_VALUE
      + DREAM_BUILD_SUSPENSION_CORNER_BALANCE_VALUE
      + DREAM_BUILD_SUSPENSION_SHOWCASE_STANCE_VALUE;
  } else if (suspensionLevel >= 4) {
    value += DREAM_BUILD_SUSPENSION_REFRESH_VALUE
      + DREAM_BUILD_SUSPENSION_RIDE_HEIGHT_VALUE
      + DREAM_BUILD_SUSPENSION_ALIGNMENT_VALUE
      + DREAM_BUILD_SUSPENSION_CORNER_BALANCE_VALUE;
  } else if (suspensionLevel >= 3) {
    value += DREAM_BUILD_SUSPENSION_REFRESH_VALUE
      + DREAM_BUILD_SUSPENSION_RIDE_HEIGHT_VALUE
      + DREAM_BUILD_SUSPENSION_ALIGNMENT_VALUE;
  } else if (suspensionLevel >= 2) {
    value += DREAM_BUILD_SUSPENSION_REFRESH_VALUE + DREAM_BUILD_SUSPENSION_RIDE_HEIGHT_VALUE;
  } else if (suspensionLevel >= 1) {
    value += DREAM_BUILD_SUSPENSION_REFRESH_VALUE;
  }
  value += dreamBuildProgressiveValue(tiresLevel, [
    DREAM_BUILD_TIRES_SPORTS_VALUE,
    DREAM_BUILD_TIRES_SUMMER_VALUE,
    DREAM_BUILD_TIRES_R_COMPOUND_VALUE,
    DREAM_BUILD_TIRES_SLICKS_VALUE,
    DREAM_BUILD_TIRES_EVENT_SET_VALUE,
  ]);
  value += dreamBuildProgressiveValue(brakesLevel, [
    DREAM_BUILD_BRAKES_PADS_VALUE,
    DREAM_BUILD_BRAKES_SPORTS_KIT_VALUE,
    DREAM_BUILD_BRAKES_RACING_KIT_VALUE,
    DREAM_BUILD_BRAKES_CARBON_BIG_KIT_VALUE,
    DREAM_BUILD_BRAKES_CONTROL_PACKAGE_VALUE,
  ]);
  value += dreamBuildProgressiveValue(inductionLevel, [
    DREAM_BUILD_INDUCTION_INTERCOOLER_VALUE,
    DREAM_BUILD_INDUCTION_BOOST_CONTROL_VALUE,
    DREAM_BUILD_INDUCTION_HYBRID_TURBO_VALUE,
    DREAM_BUILD_INDUCTION_BIG_TURBO_VALUE,
    DREAM_BUILD_INDUCTION_ANTI_LAG_VALUE,
  ]);
  value += dreamBuildProgressiveValue(drivetrainLevel, [
    DREAM_BUILD_DRIVETRAIN_CLUTCH_VALUE,
    DREAM_BUILD_DRIVETRAIN_LSD_VALUE,
    DREAM_BUILD_DRIVETRAIN_DRIVESHAFT_VALUE,
    DREAM_BUILD_DRIVETRAIN_GEARBOX_VALUE,
    DREAM_BUILD_DRIVETRAIN_SEQUENTIAL_VALUE,
  ]);
  value += dreamBuildProgressiveValue(aeroLevel, [
    DREAM_BUILD_AERO_SPLITTER_VALUE,
    DREAM_BUILD_AERO_REAR_AERO_VALUE,
    DREAM_BUILD_AERO_WIDE_BODY_VALUE,
    DREAM_BUILD_AERO_WEIGHT_REDUCTION_VALUE,
    DREAM_BUILD_AERO_CARBON_CAGE_VALUE,
  ]);
  value += dreamBuildProgressiveValue(finalBuildLevel, [
    DREAM_BUILD_FINAL_DETAIL_VALUE,
    DREAM_BUILD_SHAKEDOWN_VALUE,
  ]);
  return value;
}

function projectCarValueV1(gameState) {
  const state = normalizeGameState(gameState);
  return Math.min(
    SHOP_MAX_RESOURCE,
    projectCarValueFromDreamBuild(state.shop.dreamBuild) + secondCarProjectGarageValue(state),
  );
}

function secondCarProjectGarageValue(gameState) {
  const state = gameState && gameState.carManagement ? gameState : normalizeGameState(gameState);
  const project = state.carManagement && state.carManagement.secondCarProject;
  return safeNonNegativeInteger(
    project && project.acquired ? project.garageBuildValue : 0,
    0,
    SHOP_MAX_RESOURCE,
  );
}

function showcaseInterestUnlocked(gameState) {
  const state = normalizeGameState(gameState);
  return dreamBuildProgressSummary(state).completed >= 5
    && netWorthMilestoneReached(state, "net_worth_1m");
}

function showcasePrepStatus(gameState) {
  const state = normalizeGameState(gameState);
  return {
    unlocked: showcaseInterestUnlocked(state),
    prepared: Boolean(state.shop.dreamBuild.showcaseDisplayPrepared),
    cost: SHOWCASE_PREP_COST,
    valueAdded: SHOWCASE_PREP_VALUE,
    affordable: cashBalance(state) >= SHOWCASE_PREP_COST,
    missingCash: Math.max(0, SHOWCASE_PREP_COST - cashBalance(state)),
  };
}

function sponsorInquiryUnlocked(gameState) {
  const state = normalizeGameState(gameState);
  return Boolean(state.shop.dreamBuild.showcaseDisplayPrepared)
    && dreamBuildProgressSummary(state).completed >= 5
    && netWorthMilestoneReached(state, "net_worth_1m");
}

function sponsorInquiryAccepted(gameState) {
  const state = normalizeGameState(gameState);
  return Boolean(state.shop.dreamBuild.sponsor && state.shop.dreamBuild.sponsor.inquiryAccepted);
}

function brandValueV1(gameState) {
  const state = normalizeGameState(gameState);
  const sponsorBrand = safeNonNegativeInteger(
    state.shop.dreamBuild.sponsor && state.shop.dreamBuild.sponsor.brandValue,
    0,
    SHOP_MAX_RESOURCE,
  );
  const eventBrand = safeNonNegativeInteger(
    state.shop.garageEvents && state.shop.garageEvents.brandValue,
    0,
    SHOP_MAX_RESOURCE,
  );
  const carManagementBrand = safeNonNegativeInteger(
    state.carManagement && state.carManagement.brandValue,
    0,
    SHOP_MAX_RESOURCE,
  );
  return Math.min(SHOP_MAX_RESOURCE, sponsorBrand + eventBrand + carManagementBrand);
}

function garageEventBrandValueV1(gameState) {
  const state = normalizeGameState(gameState);
  return safeNonNegativeInteger(
    state.shop.garageEvents && state.shop.garageEvents.brandValue,
    0,
    SHOP_MAX_RESOURCE,
  );
}

function garageReputationV1(gameState) {
  const state = normalizeGameState(gameState);
  const eventReputation = safeNonNegativeInteger(
    state.shop.garageEvents && state.shop.garageEvents.garageReputation,
    0,
    SHOP_MAX_RESOURCE,
  );
  const carManagementReputation = safeNonNegativeInteger(
    state.carManagement && state.carManagement.garageReputation,
    0,
    SHOP_MAX_RESOURCE,
  );
  return Math.min(SHOP_MAX_RESOURCE, eventReputation + carManagementReputation);
}

function completedGarageEventIds(gameState) {
  const state = normalizeGameState(gameState);
  return new Set(state.shop.garageEvents.completedEventIds || []);
}

function garageEventById(eventId) {
  return GARAGE_EVENTS.find((event) => event.id === eventId) || null;
}

function garageEventBoardStatus(gameState) {
  const state = normalizeGameState(gameState);
  const tiresReady = dreamBuildTiresLevel(state) >= 5;
  const netWorthReady = netWorthV1(state) >= GARAGE_EVENT_BOARD_NET_WORTH_REQUIREMENT;
  return {
    visible: tiresReady || netWorthReady,
    unlocked: tiresReady && netWorthReady,
    tiresReady,
    netWorthReady,
    netWorth: netWorthV1(state),
    netWorthRequirement: GARAGE_EVENT_BOARD_NET_WORTH_REQUIREMENT,
  };
}

function allGarageEventsComplete(gameState) {
  const completed = completedGarageEventIds(gameState);
  return GARAGE_EVENTS.every((event) => completed.has(event.id));
}

function garageEventRequirementStatus(eventOrId, gameState) {
  const event = typeof eventOrId === "string" ? garageEventById(eventOrId) : eventOrId;
  const state = normalizeGameState(gameState);
  const board = garageEventBoardStatus(state);
  const completed = completedGarageEventIds(state);
  if (!event) {
    return { unlocked: false, completed: false, reason: "Unknown garage event." };
  }
  if (completed.has(event.id)) {
    return { unlocked: true, completed: true, reason: `${event.badge} earned.` };
  }
  if (!board.unlocked) {
    if (board.netWorthReady && !board.tiresReady) {
      return {
        unlocked: false,
        completed: false,
        reason: "Reach Tires & Rubber Level 5 to prepare the build for events.",
      };
    }
    if (board.tiresReady && !board.netWorthReady) {
      return {
        unlocked: false,
        completed: false,
        reason: "Reach $100M Net Worth to unlock the first garage event board.",
      };
    }
    return {
      unlocked: false,
      completed: false,
      reason: "Reach $100M Net Worth and complete Tires & Rubber to unlock the first event board.",
    };
  }
  if (event.id === "local_showcase") {
    return { unlocked: true, completed: false, reason: "" };
  }
  if (event.id === "sponsor_display") {
    if (!completed.has("local_showcase")) {
      return { unlocked: false, completed: false, reason: "Complete Local Showcase first." };
    }
    if (dreamBuildBrakesLevel(state) < 2) {
      return { unlocked: false, completed: false, reason: "Reach Brakes & Control Level 2." };
    }
    return { unlocked: true, completed: false, reason: "" };
  }
  if (event.id === "closed_course_exhibition") {
    if (!completed.has("sponsor_display")) {
      return { unlocked: false, completed: false, reason: "Complete Sponsor Display first." };
    }
    if (dreamBuildBrakesLevel(state) < 5) {
      return { unlocked: false, completed: false, reason: "Complete Brakes & Control Level 5." };
    }
    return { unlocked: true, completed: false, reason: "" };
  }
  if (event.id === "collector_preview") {
    if (!completed.has("closed_course_exhibition")) {
      return { unlocked: false, completed: false, reason: "Complete Closed-Course Exhibition first." };
    }
    if (garageReputationV1(state) < 100) {
      return { unlocked: false, completed: false, reason: "Reach 100 Garage Reputation." };
    }
    return { unlocked: true, completed: false, reason: "" };
  }
  return { unlocked: false, completed: false, reason: "Future garage event." };
}

function nextGarageEvent(gameState) {
  const state = normalizeGameState(gameState);
  return GARAGE_EVENTS.find((event) => {
    const status = garageEventRequirementStatus(event, state);
    return !status.completed;
  }) || null;
}

function nextAvailableGarageEvent(gameState) {
  const state = normalizeGameState(gameState);
  return GARAGE_EVENTS.find((event) => {
    const status = garageEventRequirementStatus(event, state);
    return status.unlocked && !status.completed;
  }) || null;
}

function garageEventAffordability(eventOrId, gameState) {
  const event = typeof eventOrId === "string" ? garageEventById(eventOrId) : eventOrId;
  const state = normalizeGameState(gameState);
  if (!event) return { canEnter: false, missingCash: 0 };
  const missingCash = Math.max(0, event.cost - cashBalance(state));
  return {
    canEnter: missingCash <= 0,
    missingCash,
  };
}

function garageEventResultText(event) {
  return `${event.title} complete: +${formatCashCount(event.cashReward)} Cash, +${formatCashCount(event.brandValueReward)} Brand Value, +${formatShopCount(event.garageReputationReward)} Garage Reputation.`;
}

function completeGarageEvent(eventId, gameState, options = {}) {
  let next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Garage Events unlock after you finish and park.", gameState: next };
  }
  const event = garageEventById(eventId);
  if (!event) return { ok: false, reason: "That Garage Event is not available.", gameState: next };
  const requirement = garageEventRequirementStatus(event, next);
  if (requirement.completed) {
    return { ok: false, reason: `${event.title} is already complete.`, gameState: next };
  }
  if (!requirement.unlocked) {
    return { ok: false, reason: requirement.reason, gameState: next };
  }
  if (cashBalance(next) < event.cost) {
    return { ok: false, reason: `Need ${formatCash(event.cost - cashBalance(next))} more Cash.`, gameState: next };
  }
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - event.cost + event.cashReward, 0, SHOP_MAX_RESOURCE);
  next.shop.garageEvents.brandValue = safeNonNegativeInteger(
    next.shop.garageEvents.brandValue + event.brandValueReward,
    0,
    SHOP_MAX_RESOURCE,
  );
  next.shop.garageEvents.garageReputation = safeNonNegativeInteger(
    next.shop.garageEvents.garageReputation + event.garageReputationReward,
    0,
    SHOP_MAX_RESOURCE,
  );
  next.shop.garageEvents.completedEventIds = [
    ...completedGarageEventIds(next),
    event.id,
  ].slice(0, GARAGE_EVENTS.length);
  const nowMs = options.now instanceof Date ? options.now.getTime() : Date.parse(options.now || "");
  const completedAt = Number.isFinite(nowMs) ? new Date(nowMs).toISOString() : new Date().toISOString();
  next.shop.garageEvents.lastEventResult = {
    eventId: event.id,
    title: event.title,
    badge: event.badge,
    completedAt,
    cashReward: event.cashReward,
    brandValueReward: event.brandValueReward,
    garageReputationReward: event.garageReputationReward,
  };
  const feedback = garageEventResultText(event);
  next.shop.counterService.lastResult = feedback;
  next = addLedgerEntry(next, "story", feedback);
  next = syncNetWorthMilestones(next).gameState;
  return {
    ok: true,
    reason: "",
    feedback,
    event,
    gameState: next,
  };
}

function carManagementUnlocked(gameState) {
  const state = normalizeGameState(gameState);
  return Boolean(
    state.carManagement
    && state.carManagement.currentCar
    && dreamBuildFinalBuildLevel(state) >= 2,
  );
}

function carManagementBrandValueV1(gameState) {
  const state = normalizeGameState(gameState);
  return safeNonNegativeInteger(
    state.carManagement && state.carManagement.brandValue,
    0,
    SHOP_MAX_RESOURCE,
  );
}

function carAssignmentCompletions(gameState, assignmentId) {
  const state = normalizeGameState(gameState);
  return safeNonNegativeInteger(
    state.carManagement && state.carManagement.assignmentCompletions
      ? state.carManagement.assignmentCompletions[assignmentId]
      : 0,
    0,
    100000,
  );
}

function carValueBase(gameState) {
  const state = normalizeGameState(gameState);
  const currentCar = state.carManagement && state.carManagement.currentCar;
  return safeNonNegativeInteger(
    currentCar && currentCar.buildValueAtCompletion,
    projectCarValueV1(state),
    SHOP_MAX_RESOURCE,
  );
}

function carAssignmentEconomics(assignmentOrId, gameState) {
  const assignment = typeof assignmentOrId === "string"
    ? carAssignmentById(assignmentOrId)
    : assignmentOrId;
  const base = carValueBase(gameState);
  if (!assignment) {
    return {
      carValueBase: base,
      entryCost: 0,
      cashReward: 0,
      brandValueReward: 0,
      garageReputationReward: 0,
    };
  }
  return {
    carValueBase: base,
    entryCost: safeNonNegativeInteger(Math.round(base * assignment.entryCostRate), 0, SHOP_MAX_RESOURCE),
    cashReward: safeNonNegativeInteger(Math.round(base * assignment.cashRewardRate), 0, SHOP_MAX_RESOURCE),
    brandValueReward: safeNonNegativeInteger(Math.round(base * assignment.brandValueRewardRate), 0, SHOP_MAX_RESOURCE),
    garageReputationReward: assignment.garageReputationReward,
  };
}

function carAssignmentRequirementStatus(assignmentOrId, gameState) {
  const assignment = typeof assignmentOrId === "string"
    ? carAssignmentById(assignmentOrId)
    : assignmentOrId;
  const state = normalizeGameState(gameState);
  if (!assignment) return { unlocked: false, reason: "Unknown Car Management assignment." };
  if (!carManagementUnlocked(state)) {
    return { unlocked: false, reason: "Complete the first build to unlock Car Management." };
  }
  if (assignment.id === "showcase_rotation") return { unlocked: true, reason: "" };
  if (assignment.id === "sponsor_demo_day") {
    if (carAssignmentCompletions(state, "showcase_rotation") < 1) {
      return { unlocked: false, reason: "Complete Showcase Rotation once." };
    }
    if (garageReputationV1(state) < 25) {
      return { unlocked: false, reason: "Reach 25 Garage Reputation." };
    }
    return { unlocked: true, reason: "" };
  }
  if (assignment.id === "closed_course_exhibition_booking") {
    if (carAssignmentCompletions(state, "sponsor_demo_day") < 1) {
      return { unlocked: false, reason: "Complete Sponsor Demo Day once." };
    }
    if (garageReputationV1(state) < 100) {
      return { unlocked: false, reason: "Reach 100 Garage Reputation." };
    }
    return { unlocked: true, reason: "" };
  }
  return { unlocked: false, reason: "Future Car Management assignment." };
}

function allCarAssignmentsCompletedOnce(gameState) {
  return CAR_ASSIGNMENTS.every((assignment) => carAssignmentCompletions(gameState, assignment.id) >= 1);
}

function secondCarProjectState(gameState) {
  const state = normalizeGameState(gameState);
  return state.carManagement && state.carManagement.secondCarProject
    ? state.carManagement.secondCarProject
    : defaultSecondCarProjectState();
}

function secondBayStatus(gameState) {
  const state = normalizeGameState(gameState);
  const project = secondCarProjectState(state);
  const loopComplete = allCarAssignmentsCompletedOnce(state);
  const reputation = garageReputationV1(state);
  const cash = cashBalance(state);
  const reputationReady = reputation >= SECOND_BAY_OPEN_REPUTATION_COST;
  const acquireReputationReady = reputation >= SECOND_PROJECT_CAR_REPUTATION_COST;
  return {
    project,
    loopComplete,
    reputation,
    cash,
    bayUnlocked: loopComplete && reputationReady,
    bayOpened: Boolean(project.bayOpened),
    acquired: Boolean(project.acquired),
    canOpen: loopComplete
      && reputationReady
      && !project.bayOpened
      && !project.acquired
      && cash >= SECOND_BAY_OPEN_COST,
    canAcquire: Boolean(project.bayOpened)
      && !project.acquired
      && cash >= SECOND_PROJECT_CAR_COST
      && acquireReputationReady,
    missingOpenCash: Math.max(0, SECOND_BAY_OPEN_COST - cash),
    missingOpenReputation: Math.max(0, SECOND_BAY_OPEN_REPUTATION_COST - reputation),
    missingAcquireCash: Math.max(0, SECOND_PROJECT_CAR_COST - cash),
    missingAcquireReputation: Math.max(0, SECOND_PROJECT_CAR_REPUTATION_COST - reputation),
  };
}

function spendGarageReputation(gameState, amount) {
  const next = normalizeGameState(gameState);
  let remaining = safeNonNegativeInteger(amount, 0, SHOP_MAX_RESOURCE);
  const carRep = safeNonNegativeInteger(next.carManagement && next.carManagement.garageReputation, 0, SHOP_MAX_RESOURCE);
  const carSpend = Math.min(carRep, remaining);
  next.carManagement.garageReputation = carRep - carSpend;
  remaining -= carSpend;
  if (remaining > 0 && next.shop && next.shop.garageEvents) {
    const eventRep = safeNonNegativeInteger(next.shop.garageEvents.garageReputation, 0, SHOP_MAX_RESOURCE);
    const eventSpend = Math.min(eventRep, remaining);
    next.shop.garageEvents.garageReputation = eventRep - eventSpend;
    remaining -= eventSpend;
  }
  return {
    ok: remaining <= 0,
    gameState: next,
  };
}

function nextCarAssignment(gameState) {
  const state = normalizeGameState(gameState);
  return CAR_ASSIGNMENTS.find((assignment) => carAssignmentCompletions(state, assignment.id) < 1)
    || CAR_ASSIGNMENTS[0]
    || null;
}

function nextAvailableCarAssignment(gameState) {
  const state = normalizeGameState(gameState);
  return CAR_ASSIGNMENTS.find((assignment) => {
    const status = carAssignmentRequirementStatus(assignment, state);
    return status.unlocked && carAssignmentCompletions(state, assignment.id) < 1;
  }) || CAR_ASSIGNMENTS.find((assignment) => carAssignmentRequirementStatus(assignment, state).unlocked) || null;
}

function carAssignmentRemainingMs(activeAssignment, options = {}) {
  if (!activeAssignment) return 0;
  const nowMs = options.now instanceof Date
    ? options.now.getTime()
    : Number.isFinite(Date.parse(options.now || "")) ? Date.parse(options.now) : Date.now();
  const startedMs = Date.parse(activeAssignment.startedAt || "");
  if (!Number.isFinite(startedMs)) return 0;
  return Math.max(0, startedMs + safeNonNegativeInteger(activeAssignment.durationMs, 0, 24 * 60 * 60 * 1000) - nowMs);
}

function activeCarAssignmentStatus(gameState, options = {}) {
  const state = normalizeGameState(gameState);
  const active = state.carManagement && state.carManagement.activeAssignment;
  if (!active) return { active: null, assignment: null, ready: false, remainingMs: 0 };
  const assignment = carAssignmentById(active.id);
  const remainingMs = carAssignmentRemainingMs(active, options);
  return {
    active,
    assignment,
    ready: remainingMs <= 0,
    remainingMs,
  };
}

function formatAssignmentDuration(ms) {
  const minutes = Math.max(1, Math.ceil(safeNonNegativeInteger(ms, 0, 24 * 60 * 60 * 1000) / 60000));
  if (minutes < 60) return `${formatShopCount(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${formatShopCount(hours)}h ${formatShopCount(rest)}m` : `${formatShopCount(hours)}h`;
}

function carAssignmentResultText(assignment, economics) {
  return `${assignment.title} complete: +${formatCashCount(economics.cashReward)} Cash, +${formatCashCount(economics.brandValueReward)} Brand Value, +${formatShopCount(economics.garageReputationReward)} Garage Reputation.`;
}

function carAssignmentRewardPreviewLine(economics) {
  return `Rewards: +${formatCashCount(economics.cashReward)} Cash, +${formatCashCount(economics.brandValueReward)} Brand Value, +${formatShopCount(economics.garageReputationReward)} Garage Reputation`;
}

function carAssignmentNetCashLine(economics) {
  const netCash = safeNonNegativeInteger(economics.cashReward - economics.entryCost, 0, SHOP_MAX_RESOURCE);
  return `Net Cash: +${formatCashCount(netCash)} after entry cost`;
}

function carAssignmentProgressPercent(activeAssignment, remainingMs) {
  const duration = safeNonNegativeInteger(activeAssignment && activeAssignment.durationMs, 0, 24 * 60 * 60 * 1000);
  if (!duration) return 0;
  const elapsed = Math.max(0, duration - safeNonNegativeInteger(remainingMs, 0, duration));
  return Math.max(0, Math.min(100, Math.round((elapsed / duration) * 100)));
}

function carAssignmentUnlockRequirementLabel(assignmentOrId) {
  const assignment = typeof assignmentOrId === "string"
    ? carAssignmentById(assignmentOrId)
    : assignmentOrId;
  if (!assignment) return "Unknown Car Management assignment.";
  if (assignment.id === "showcase_rotation") return "First Complete Build required.";
  if (assignment.id === "sponsor_demo_day") {
    return "Complete Showcase Rotation once and reach 25 Garage Reputation.";
  }
  if (assignment.id === "closed_course_exhibition_booking") {
    return "Complete Sponsor Demo Day once and reach 100 Garage Reputation.";
  }
  return "Future Car Management assignment.";
}

function startCarAssignment(assignmentId, gameState, options = {}) {
  let next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Car Management unlocks after you finish and park.", gameState: next };
  }
  if (!carManagementUnlocked(next)) {
    return { ok: false, reason: "Complete the first build to unlock Car Management.", gameState: next };
  }
  if (next.carManagement.activeAssignment) {
    return { ok: false, reason: "One Car Management assignment is already active.", gameState: next };
  }
  const assignment = carAssignmentById(assignmentId);
  if (!assignment) return { ok: false, reason: "That Car Management assignment is not available.", gameState: next };
  const requirement = carAssignmentRequirementStatus(assignment, next);
  if (!requirement.unlocked) return { ok: false, reason: requirement.reason, gameState: next };
  const economics = carAssignmentEconomics(assignment, next);
  if (cashBalance(next) < economics.entryCost) {
    return { ok: false, reason: `Need ${formatCash(economics.entryCost - cashBalance(next))} more Cash.`, gameState: next };
  }
  const nowMs = options.now instanceof Date ? options.now.getTime() : Date.parse(options.now || "");
  const startedAt = Number.isFinite(nowMs) ? new Date(nowMs).toISOString() : new Date().toISOString();
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - economics.entryCost, 0, SHOP_MAX_RESOURCE);
  next.carManagement.activeAssignment = {
    id: assignment.id,
    startedAt,
    durationMs: assignment.durationMs,
    entryCost: economics.entryCost,
    rewardPreview: {
      cashReward: economics.cashReward,
      brandValueReward: economics.brandValueReward,
      garageReputationReward: economics.garageReputationReward,
    },
    carId: CAR_MANAGEMENT_CURRENT_CAR_ID,
  };
  next.carManagement.lastAssignmentResult = null;
  const feedback = `${assignment.title} started. Return in ${formatAssignmentDuration(assignment.durationMs)} to collect.`;
  next.shop.counterService.lastResult = feedback;
  next = addLedgerEntry(next, "story", feedback);
  return { ok: true, reason: "", feedback, assignment, economics, gameState: next };
}

function collectCarAssignment(gameState, options = {}) {
  let next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Car Management unlocks after you finish and park.", gameState: next };
  }
  const status = activeCarAssignmentStatus(next, options);
  if (!status.active || !status.assignment) {
    return { ok: false, reason: "No Car Management assignment is ready.", gameState: next };
  }
  if (!status.ready) {
    return {
      ok: false,
      reason: `${status.assignment.title} is still in progress: ${formatAssignmentDuration(status.remainingMs)} remaining.`,
      gameState: next,
    };
  }
  const preview = status.active.rewardPreview || {};
  const economics = {
    cashReward: safeNonNegativeInteger(preview.cashReward, carAssignmentEconomics(status.assignment, next).cashReward, SHOP_MAX_RESOURCE),
    brandValueReward: safeNonNegativeInteger(preview.brandValueReward, carAssignmentEconomics(status.assignment, next).brandValueReward, SHOP_MAX_RESOURCE),
    garageReputationReward: safeNonNegativeInteger(preview.garageReputationReward, status.assignment.garageReputationReward, SHOP_MAX_RESOURCE),
  };
  const nowMs = options.now instanceof Date ? options.now.getTime() : Date.parse(options.now || "");
  const completedAt = Number.isFinite(nowMs) ? new Date(nowMs).toISOString() : new Date().toISOString();
  next.shop.tips = safeNonNegativeInteger(next.shop.tips + economics.cashReward, 0, SHOP_MAX_RESOURCE);
  next.carManagement.brandValue = safeNonNegativeInteger(next.carManagement.brandValue + economics.brandValueReward, 0, SHOP_MAX_RESOURCE);
  next.carManagement.garageReputation = safeNonNegativeInteger(next.carManagement.garageReputation + economics.garageReputationReward, 0, SHOP_MAX_RESOURCE);
  next.carManagement.assignmentCompletions[status.assignment.id] = carAssignmentCompletions(next, status.assignment.id) + 1;
  const result = {
    assignmentId: status.assignment.id,
    title: status.assignment.title,
    completedAt,
    cashReward: economics.cashReward,
    brandValueReward: economics.brandValueReward,
    garageReputationReward: economics.garageReputationReward,
  };
  next.carManagement.lastAssignmentResult = result;
  next.carManagement.assignmentHistory = [result, ...next.carManagement.assignmentHistory].slice(0, CAR_MANAGEMENT_HISTORY_LIMIT);
  next.carManagement.activeAssignment = null;
  const feedback = carAssignmentResultText(status.assignment, economics);
  next.shop.counterService.lastResult = feedback;
  next = addLedgerEntry(next, "story", feedback);
  next = syncNetWorthMilestones(next).gameState;
  return { ok: true, reason: "", feedback, assignment: status.assignment, economics, gameState: next };
}

function openSecondBay(gameState, options = {}) {
  let next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Second Bay opens while parked after the drive.", gameState: next };
  }
  if (!carManagementUnlocked(next)) {
    return { ok: false, reason: "Complete the first build to unlock Car Management.", gameState: next };
  }
  const status = secondBayStatus(next);
  if (status.project.bayOpened || status.project.acquired) {
    return { ok: false, reason: "Second Bay is already open.", gameState: next };
  }
  if (!status.loopComplete) {
    return { ok: false, reason: "Complete the first Car Management loop to expand the garage.", gameState: next };
  }
  if (status.reputation < SECOND_BAY_OPEN_REPUTATION_COST) {
    return { ok: false, reason: `Reach ${formatShopCount(SECOND_BAY_OPEN_REPUTATION_COST)} Garage Reputation to expand the garage.`, gameState: next };
  }
  if (cashBalance(next) < SECOND_BAY_OPEN_COST) {
    return { ok: false, reason: `Need ${formatCash(SECOND_BAY_OPEN_COST - cashBalance(next))} more Cash.`, gameState: next };
  }
  const spend = spendGarageReputation(next, SECOND_BAY_OPEN_REPUTATION_COST);
  if (!spend.ok) {
    return { ok: false, reason: `Need ${formatShopCount(SECOND_BAY_OPEN_REPUTATION_COST)} Garage Reputation.`, gameState: next };
  }
  next = spend.gameState;
  const nowMs = options.now instanceof Date ? options.now.getTime() : Date.parse(options.now || "");
  const now = Number.isFinite(nowMs) ? new Date(nowMs).toISOString() : new Date().toISOString();
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - SECOND_BAY_OPEN_COST, 0, SHOP_MAX_RESOURCE);
  next.carManagement.secondCarProject = {
    ...defaultSecondCarProjectState(),
    ...(next.carManagement.secondCarProject || {}),
    bayUnlocked: true,
    bayUnlockedAt: (next.carManagement.secondCarProject && next.carManagement.secondCarProject.bayUnlockedAt) || now,
    bayOpened: true,
    bayOpenedAt: now,
    acquired: false,
    acquiredAt: null,
    id: SECOND_CAR_PROJECT_ID,
    name: "Second Project Car",
    stage: "bay_open",
    garageBuildValue: 0,
  };
  const feedback = "Second Bay opened. The garage has room for another project.";
  next.shop.counterService.lastResult = feedback;
  next = addLedgerEntry(next, "story", feedback);
  return { ok: true, reason: "", feedback, gameState: next };
}

function acquireSecondProjectCar(gameState, options = {}) {
  let next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Second Project Car can be acquired while parked after the drive.", gameState: next };
  }
  if (!carManagementUnlocked(next)) {
    return { ok: false, reason: "Complete the first build to unlock Car Management.", gameState: next };
  }
  const status = secondBayStatus(next);
  if (status.project.acquired) {
    return { ok: false, reason: "Second Project Car is already waiting in the second bay.", gameState: next };
  }
  if (!status.project.bayOpened) {
    return { ok: false, reason: "Open Second Bay before acquiring another project car.", gameState: next };
  }
  if (status.reputation < SECOND_PROJECT_CAR_REPUTATION_COST) {
    return { ok: false, reason: `Reach ${formatShopCount(SECOND_PROJECT_CAR_REPUTATION_COST)} Garage Reputation to acquire the second project car.`, gameState: next };
  }
  if (cashBalance(next) < SECOND_PROJECT_CAR_COST) {
    return { ok: false, reason: `Need ${formatCash(SECOND_PROJECT_CAR_COST - cashBalance(next))} more Cash.`, gameState: next };
  }
  const spend = spendGarageReputation(next, SECOND_PROJECT_CAR_REPUTATION_COST);
  if (!spend.ok) {
    return { ok: false, reason: `Need ${formatShopCount(SECOND_PROJECT_CAR_REPUTATION_COST)} Garage Reputation.`, gameState: next };
  }
  next = spend.gameState;
  const nowMs = options.now instanceof Date ? options.now.getTime() : Date.parse(options.now || "");
  const now = Number.isFinite(nowMs) ? new Date(nowMs).toISOString() : new Date().toISOString();
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - SECOND_PROJECT_CAR_COST, 0, SHOP_MAX_RESOURCE);
  next.carManagement.secondCarProject = {
    ...defaultSecondCarProjectState(),
    ...(next.carManagement.secondCarProject || {}),
    bayUnlocked: true,
    bayOpened: true,
    acquired: true,
    acquiredAt: now,
    id: SECOND_CAR_PROJECT_ID,
    name: "Second Project Car",
    stage: "rolling_shell",
    garageBuildValue: SECOND_PROJECT_CAR_GARAGE_VALUE,
  };
  const feedback = "Second Project Car acquired. A new build is waiting in the second bay.";
  next.shop.counterService.lastResult = feedback;
  next = addLedgerEntry(next, "story", feedback);
  next = syncNetWorthMilestones(next).gameState;
  return { ok: true, reason: "", feedback, gameState: next };
}

function sponsorInquiryStatus(gameState) {
  const state = normalizeGameState(gameState);
  return {
    unlocked: sponsorInquiryUnlocked(state),
    accepted: sponsorInquiryAccepted(state),
    cashReward: SPONSOR_INQUIRY_CASH_REWARD,
    brandValue: brandValueV1(state),
    brandValueReward: SPONSOR_INQUIRY_BRAND_VALUE,
  };
}

function dreamInvestmentTargetVisible(gameState) {
  const state = normalizeGameState(gameState);
  return dreamBuildInvestmentStarted(state) || coveredCarTeaserSeen(state) || coveredCarTeaserUnlocked(state);
}

function dreamInvestmentTargetProgress(gameState) {
  const state = normalizeGameState(gameState);
  const progress = nextMilestoneProgress(cashBalance(state), DREAM_INVESTMENT_TARGET_COST);
  return {
    label: DREAM_INVESTMENT_TARGET_LABEL,
    fundLabel: DREAM_INVESTMENT_FUND_LABEL,
    cost: DREAM_INVESTMENT_TARGET_COST,
    current: progress.current,
    required: progress.required,
    percent: progress.percent,
    ready: cashBalance(state) >= DREAM_INVESTMENT_TARGET_COST,
    purchased: dreamBuildWheelsPurchased(state),
    wheelsLevel: dreamBuildWheelsLevel(state),
    exhaustPurchased: dreamBuildExhaustPurchased(state),
    exhaustLevel: dreamBuildExhaustLevel(state),
  };
}

function dreamBuildNextTargetProgress(gameState) {
  return nextMilestoneProgress(cashBalance(gameState), DREAM_BUILD_NEXT_TARGET_COST);
}

function dreamBuildWheelsWorkForLevel(level) {
  if (level === 1) {
    return {
      action: "polish-wheels",
      nextLevel: 2,
      title: "Polish Wheels",
      completeTitle: "Polished Wheels",
      buttonLabel: "Polish Wheels",
      cost: DREAM_BUILD_WHEELS_POLISH_COST,
      valueAdded: DREAM_BUILD_WHEELS_POLISH_VALUE,
      copy: "Clean up the first part until the build starts to shine.",
      completeCopy: "The wheels catch the shop lights now.",
      feedback: "Dream Build work complete: Polished Wheels.",
    };
  }
  if (level === 2) {
    return {
      action: "balance-fitment",
      nextLevel: 3,
      title: "Balanced Fitment",
      completeTitle: "Balanced Fitment",
      buttonLabel: "Balance Fitment",
      cost: DREAM_BUILD_WHEELS_FITMENT_COST,
      valueAdded: DREAM_BUILD_WHEELS_FITMENT_VALUE,
      copy: "Dial in the stance so the project looks intentional.",
      completeCopy: "The car is starting to look planned, not abandoned.",
      feedback: "Dream Build work complete: Balanced Fitment.",
    };
  }
  return null;
}

function nextDreamBuildWheelsWork(gameState) {
  const state = normalizeGameState(gameState);
  if (!state.shop.dreamBuild.wheelsPurchased) return null;
  return dreamBuildWheelsWorkForLevel(dreamBuildWheelsLevel(state));
}

function dreamBuildExhaustWorkForLevel(level) {
  if (level === 0) {
    return {
      action: "buy-exhaust",
      nextLevel: 1,
      title: "Exhaust Fitted",
      completeTitle: "Exhaust Fitted",
      buttonLabel: "Buy Exhaust",
      cost: DREAM_BUILD_NEXT_TARGET_COST,
      valueAdded: DREAM_BUILD_EXHAUST_VALUE,
      copy: "Fit the first exhaust system and make the project feel real.",
      completeCopy: "The project finally has a voice, even if it still needs work.",
      feedback: "Dream Build: Exhaust fitted.",
    };
  }
  if (level === 1) {
    return {
      action: "seal-joints",
      nextLevel: 2,
      title: "Sealed Joints",
      completeTitle: "Sealed Joints",
      buttonLabel: "Seal Joints",
      cost: DREAM_BUILD_EXHAUST_SEAL_COST,
      valueAdded: DREAM_BUILD_EXHAUST_SEAL_VALUE,
      copy: "Clean up the install so the exhaust feels intentional.",
      completeCopy: "The exhaust is fitted cleanly now.",
      feedback: "Dream Build: Exhaust joints sealed.",
    };
  }
  if (level === 2) {
    return {
      action: "tuned-note",
      nextLevel: 3,
      title: "Tuned Note",
      completeTitle: "Tuned Note",
      buttonLabel: "Tune Note",
      cost: DREAM_BUILD_EXHAUST_TUNED_NOTE_COST,
      valueAdded: DREAM_BUILD_EXHAUST_TUNED_NOTE_VALUE,
      copy: "Refine the sound so the project feels intentional, not loud.",
      completeCopy: "The exhaust has a clean, confident note.",
      feedback: "Dream Build work complete: Tuned Note.",
    };
  }
  if (level === 3) {
    return {
      action: "heat-wrap",
      nextLevel: 4,
      title: "Heat Wrapped",
      completeTitle: "Heat Wrapped",
      buttonLabel: "Heat Wrap Exhaust",
      cost: DREAM_BUILD_EXHAUST_HEAT_WRAP_COST,
      valueAdded: DREAM_BUILD_EXHAUST_HEAT_WRAP_VALUE,
      copy: "Protect the install and make the exhaust bay look deliberate.",
      completeCopy: "The exhaust setup looks cared for, not rushed.",
      feedback: "Dream Build work complete: Heat Wrapped.",
    };
  }
  if (level === 4) {
    return {
      action: "showcase-finish",
      nextLevel: 5,
      title: "Showcase Finish",
      completeTitle: "Showcase Finish",
      buttonLabel: "Finish Exhaust",
      cost: DREAM_BUILD_EXHAUST_SHOWCASE_FINISH_COST,
      valueAdded: DREAM_BUILD_EXHAUST_SHOWCASE_FINISH_VALUE,
      copy: "Clean up the final details so the exhaust bay feels ready to be shown.",
      completeCopy: "The exhaust track is complete. It looks intentional from end to end.",
      feedback: "Exhaust complete: Showcase Finish added. Garage Build Value +$1.25M.",
    };
  }
  return null;
}

function nextDreamBuildExhaustWork(gameState) {
  const state = normalizeGameState(gameState);
  if (dreamBuildWheelsLevel(state) < 3) return null;
  if (!state.shop.dreamBuild.exhaustPurchased) return dreamBuildExhaustWorkForLevel(0);
  return dreamBuildExhaustWorkForLevel(dreamBuildExhaustLevel(state));
}

function dreamBuildSuspensionWorkForLevel(level) {
  if (level === 0) {
    return {
      action: "suspension-refreshed",
      nextLevel: 1,
      title: "Suspension Refreshed",
      completeTitle: "Suspension Refreshed",
      buttonLabel: "Refresh Suspension",
      cost: DREAM_BUILD_SUSPENSION_REFRESH_COST,
      valueAdded: DREAM_BUILD_SUSPENSION_REFRESH_VALUE,
      copy: "Refresh the worn suspension so the build has a solid foundation.",
      completeCopy: "The build sits on a better foundation.",
      feedback: "Dream Build work complete: Suspension Refreshed.",
    };
  }
  if (level === 1) {
    return {
      action: "ride-height-set",
      nextLevel: 2,
      title: "Ride Height Set",
      completeTitle: "Ride Height Set",
      buttonLabel: "Set Ride Height",
      cost: DREAM_BUILD_SUSPENSION_RIDE_HEIGHT_COST,
      valueAdded: DREAM_BUILD_SUSPENSION_RIDE_HEIGHT_VALUE,
      copy: "Height-adjustable sports suspension gives the build its first deliberate stance.",
      detailCopy: "Includes height-adjustable sports suspension and basic ride-height setup.",
      completeCopy: "The build has its first deliberate stance.",
      feedback: "Dream Build work complete: Ride Height Set.",
    };
  }
  if (level === 2) {
    return {
      action: "alignment-dialed",
      nextLevel: 3,
      title: "Alignment Dialed",
      completeTitle: "Alignment Dialed",
      buttonLabel: "Dial Alignment",
      cost: DREAM_BUILD_SUSPENSION_ALIGNMENT_COST,
      valueAdded: DREAM_BUILD_SUSPENSION_ALIGNMENT_VALUE,
      copy: "Dial in the alignment so the car feels intentional instead of assembled.",
      detailCopy: "Uses adjustable control arms, camber/toe arms, and upgraded sway-bar setup.",
      completeCopy: "The suspension setup is starting to feel intentional.",
      feedback: "Dream Build work complete: Alignment Dialed.",
    };
  }
  if (level === 3) {
    return {
      action: "corner-balance",
      nextLevel: 4,
      title: "Corner Balance",
      completeTitle: "Corner Balance",
      buttonLabel: "Corner Balance",
      cost: DREAM_BUILD_SUSPENSION_CORNER_BALANCE_COST,
      valueAdded: DREAM_BUILD_SUSPENSION_CORNER_BALANCE_VALUE,
      copy: "Balance the chassis so the build starts feeling like a complete machine.",
      detailCopy: "Uses fully customizable coilovers, damping setup, chassis geometry, and corner-balance work.",
      completeCopy: "The chassis feels like one complete build now.",
      feedback: "Dream Build work complete: Corner Balance.",
    };
  }
  if (level === 4) {
    return {
      action: "showcase-stance",
      nextLevel: 5,
      title: "Showcase Stance",
      completeTitle: "Showcase Stance",
      buttonLabel: "Finish Suspension",
      cost: DREAM_BUILD_SUSPENSION_SHOWCASE_STANCE_COST,
      valueAdded: DREAM_BUILD_SUSPENSION_SHOWCASE_STANCE_VALUE,
      copy: "Finish the stance, bracing, and presentation so the suspension track feels complete.",
      detailCopy: "Final geometry, bracing, fitment, sway-bar detail, and chassis presentation.",
      completeCopy: "The suspension track is complete.",
      feedback: "Suspension complete: Showcase Stance added. Garage Build Value +$22M.",
    };
  }
  return null;
}

function nextDreamBuildSuspensionWork(gameState) {
  const state = normalizeGameState(gameState);
  if (dreamBuildExhaustLevel(state) < 5) return null;
  return dreamBuildSuspensionWorkForLevel(dreamBuildSuspensionLevel(state));
}

function dreamBuildTiresWorkForLevel(level) {
  if (level === 0) {
    return {
      action: "sports-tire-set",
      nextLevel: 1,
      title: "Sports Tire Set",
      completeTitle: "Sports Tire Set",
      buttonLabel: "Fit Sports Tires",
      cost: DREAM_BUILD_TIRES_SPORTS_COST,
      valueAdded: DREAM_BUILD_TIRES_SPORTS_VALUE,
      copy: "Move from basic rubber to a proper sports tire set.",
      detailCopy: "Sports tire compounds introduce the first real grip identity for the build: Hard, Medium, or Soft.",
      completeCopy: "The build has its first tire identity.",
      feedback: "Dream Build work complete: Sports Tire Set.",
    };
  }
  if (level === 1) {
    return {
      action: "extreme-summer-tires",
      nextLevel: 2,
      title: "Extreme Performance Summer Tires",
      completeTitle: "Extreme Performance Summer Tires",
      buttonLabel: "Fit Summer Tires",
      cost: DREAM_BUILD_TIRES_SUMMER_COST,
      valueAdded: DREAM_BUILD_TIRES_SUMMER_VALUE,
      copy: "Give the build a sharper warm-weather tire setup.",
      detailCopy: "Extreme performance summer tires increase grip identity and event fit without changing Cup Test scoring.",
      completeCopy: "The tire shelf has a sharper warm-weather setup.",
      feedback: "Dream Build work complete: Extreme Performance Summer Tires.",
    };
  }
  if (level === 2) {
    return {
      action: "track-day-r-compounds",
      nextLevel: 3,
      title: "Track-Day R-Compound Tires",
      completeTitle: "Track-Day R-Compound Tires",
      buttonLabel: "Fit R-Compounds",
      cost: DREAM_BUILD_TIRES_R_COMPOUND_COST,
      valueAdded: DREAM_BUILD_TIRES_R_COMPOUND_VALUE,
      copy: "Add a serious track-day compound for a more focused build identity.",
      detailCopy: "Track-Day R-compound tires are a fictional garage/event fit upgrade in Tofu Garage.",
      completeCopy: "The tire shelf now has a focused track-day identity.",
      feedback: "Dream Build work complete: Track-Day R-Compound Tires.",
    };
  }
  if (level === 3) {
    return {
      action: "racing-slicks",
      nextLevel: 4,
      title: "Racing Slicks & Semi-Slicks",
      completeTitle: "Racing Slicks & Semi-Slicks",
      buttonLabel: "Fit Slicks",
      cost: DREAM_BUILD_TIRES_SLICKS_COST,
      valueAdded: DREAM_BUILD_TIRES_SLICKS_VALUE,
      copy: "Prepare the car for dedicated event tire setups.",
      detailCopy: "Racing slicks and semi-slicks belong to fictional garage events and build classification.",
      completeCopy: "The tire shelf is ready for dedicated event language.",
      feedback: "Dream Build work complete: Racing Slicks & Semi-Slicks.",
    };
  }
  if (level === 4) {
    return {
      action: "event-tire-set",
      nextLevel: 5,
      title: "Event Tire Set",
      completeTitle: "Event Tire Set",
      buttonLabel: "Complete Tire Set",
      cost: DREAM_BUILD_TIRES_EVENT_SET_COST,
      valueAdded: DREAM_BUILD_TIRES_EVENT_SET_VALUE,
      copy: "Complete the tire shelf with event-ready rubber for changing conditions.",
      detailCopy: "Includes Intermediate, Full Wet, and Dirt tire options as future event-fit language.",
      completeCopy: "The tire shelf is ready for future event choices.",
      feedback: "Tires & Rubber complete: Event Tire Set added. Garage Build Value +$200M.",
    };
  }
  return null;
}

function nextDreamBuildTiresWork(gameState) {
  const state = normalizeGameState(gameState);
  if (dreamBuildSuspensionLevel(state) < 5) return null;
  return dreamBuildTiresWorkForLevel(dreamBuildTiresLevel(state));
}

function dreamBuildBrakesWorkForLevel(level) {
  if (level === 0) {
    return {
      action: "sports-brake-pads",
      nextLevel: 1,
      title: "Sports Brake Pads",
      completeTitle: "Sports Brake Pads",
      buttonLabel: "Fit Sports Pads",
      cost: DREAM_BUILD_BRAKES_PADS_COST,
      valueAdded: DREAM_BUILD_BRAKES_PADS_VALUE,
      copy: "Start the brake track with a more serious pad setup.",
      detailCopy: "Sports, clubsport, and racing pad language maps to fictional control and event-readiness stats.",
      completeCopy: "The brake track has its first serious setup.",
      feedback: "Dream Build work complete: Sports Brake Pads.",
    };
  }
  if (level === 1) {
    return {
      action: "sports-brake-kit",
      nextLevel: 2,
      title: "Sports Brake Kit",
      completeTitle: "Sports Brake Kit",
      buttonLabel: "Install Brake Kit",
      cost: DREAM_BUILD_BRAKES_SPORTS_KIT_COST,
      valueAdded: DREAM_BUILD_BRAKES_SPORTS_KIT_VALUE,
      copy: "Upgrade the hardware so the build looks and feels more complete.",
      detailCopy: "Sports brake kit with slotted or drilled disc language for garage identity and build value.",
      completeCopy: "The brake hardware now looks like part of the build.",
      feedback: "Dream Build work complete: Sports Brake Kit.",
    };
  }
  if (level === 2) {
    return {
      action: "racing-brake-kit",
      nextLevel: 3,
      title: "Racing Brake Kit",
      completeTitle: "Racing Brake Kit",
      buttonLabel: "Install Racing Brakes",
      cost: DREAM_BUILD_BRAKES_RACING_KIT_COST,
      valueAdded: DREAM_BUILD_BRAKES_RACING_KIT_VALUE,
      copy: "Add a racing brake package for future event fit.",
      detailCopy: "Racing brake kit, braided lines, and high-boiling-point brake fluid become fictional garage build details.",
      completeCopy: "The brake package has future event-fit detail.",
      feedback: "Dream Build work complete: Racing Brake Kit.",
    };
  }
  if (level === 3) {
    return {
      action: "carbon-ceramic-big-brake-kit",
      nextLevel: 4,
      title: "Carbon Ceramic Big Brake Kit",
      completeTitle: "Carbon Ceramic Big Brake Kit",
      buttonLabel: "Install Big Brakes",
      cost: DREAM_BUILD_BRAKES_CARBON_BIG_KIT_COST,
      valueAdded: DREAM_BUILD_BRAKES_CARBON_BIG_KIT_VALUE,
      copy: "Move into high-end brake hardware that changes the car's presence.",
      detailCopy: "Carbon ceramic big brake kit with multi-piston caliper language for collector appeal and event fit.",
      completeCopy: "The brake hardware changes the car's presence.",
      feedback: "Dream Build work complete: Carbon Ceramic Big Brake Kit.",
    };
  }
  if (level === 4) {
    return {
      action: "brake-balance-control-package",
      nextLevel: 5,
      title: "Brake Balance & Control Package",
      completeTitle: "Brake Balance & Control Package",
      buttonLabel: "Complete Brake Setup",
      cost: DREAM_BUILD_BRAKES_CONTROL_PACKAGE_COST,
      valueAdded: DREAM_BUILD_BRAKES_CONTROL_PACKAGE_VALUE,
      copy: "Finish the control package with the final brake-system details.",
      detailCopy: "Brake balance controller, high-end lines/fluid, and control hardware complete the fictional Brakes & Control track.",
      completeCopy: "The control package is complete.",
      feedback: "Brakes & Control complete: Brake Balance & Control Package added. Garage Build Value +$1.55B.",
    };
  }
  return null;
}

function nextDreamBuildBrakesWork(gameState) {
  const state = normalizeGameState(gameState);
  if (dreamBuildTiresLevel(state) < 5) return null;
  return dreamBuildBrakesWorkForLevel(dreamBuildBrakesLevel(state));
}

function localShowcaseComplete(gameState) {
  return completedGarageEventIds(gameState).has("local_showcase");
}

function inductionUnlockStatus(gameState) {
  const state = normalizeGameState(gameState);
  const brakesReady = dreamBuildBrakesLevel(state) >= 5;
  const showcaseReady = localShowcaseComplete(state);
  return {
    unlocked: brakesReady && showcaseReady,
    brakesReady,
    showcaseReady,
    reason: !brakesReady
      ? "Complete Brakes & Control to unlock the next build phase."
      : !showcaseReady
        ? "Enter the Local Showcase to unlock the next build phase."
        : "",
  };
}

function dreamBuildInductionWorkForLevel(level) {
  if (level === 0) {
    return {
      action: "sports-intercooler",
      nextLevel: 1,
      title: "Sports Intercooler",
      completeTitle: "Sports Intercooler",
      buttonLabel: "Install Intercooler",
      cost: DREAM_BUILD_INDUCTION_INTERCOOLER_COST,
      valueAdded: DREAM_BUILD_INDUCTION_INTERCOOLER_VALUE,
      copy: "Give the build a proper cooling foundation before chasing bigger power.",
      detailCopy: "Sports / racing intercooler language maps to fictional cooling, reliability, and event-fit stats.",
      completeCopy: "The build has its first serious cooling foundation.",
      feedback: "Dream Build work complete: Sports Intercooler.",
    };
  }
  if (level === 1) {
    return {
      action: "electronic-boost-control",
      nextLevel: 2,
      title: "Electronic Boost Control",
      completeTitle: "Electronic Boost Control",
      buttonLabel: "Add Boost Control",
      cost: DREAM_BUILD_INDUCTION_BOOST_CONTROL_COST,
      valueAdded: DREAM_BUILD_INDUCTION_BOOST_CONTROL_VALUE,
      copy: "Add controlled boost hardware so the setup feels deliberate.",
      detailCopy: "Electronic boost control solenoid, bypass/diverter valve, turbo inlet, and hard charge pipe language become fictional response and reliability details.",
      completeCopy: "The boost hardware now feels deliberate.",
      feedback: "Dream Build work complete: Electronic Boost Control.",
    };
  }
  if (level === 2) {
    return {
      action: "hybrid-turbo-upgrade",
      nextLevel: 3,
      title: "Hybrid Turbo Upgrade",
      completeTitle: "Hybrid Turbo Upgrade",
      buttonLabel: "Install Hybrid Turbo",
      cost: DREAM_BUILD_INDUCTION_HYBRID_TURBO_COST,
      valueAdded: DREAM_BUILD_INDUCTION_HYBRID_TURBO_VALUE,
      copy: "Upgrade the factory-style turbo setup without turning the build into a full race project yet.",
      detailCopy: "Hybrid turbo upgrade uses a factory-style housing with larger internal wheels as authentic garage flavor.",
      completeCopy: "The induction package now has a factory-style turbo upgrade.",
      feedback: "Dream Build work complete: Hybrid Turbo Upgrade.",
    };
  }
  if (level === 3) {
    return {
      action: "big-turbo-kit",
      nextLevel: 4,
      title: "Big Turbo Kit",
      completeTitle: "Big Turbo Kit",
      buttonLabel: "Install Big Turbo",
      cost: DREAM_BUILD_INDUCTION_BIG_TURBO_COST,
      valueAdded: DREAM_BUILD_INDUCTION_BIG_TURBO_VALUE,
      copy: "Move the build into a serious standalone turbo setup.",
      detailCopy: "Big turbo kit language includes aftermarket manifold, standalone turbo, external wastegate, and supporting cooling setup.",
      completeCopy: "The build has a serious standalone turbo setup.",
      feedback: "Dream Build work complete: Big Turbo Kit.",
    };
  }
  if (level === 4) {
    return {
      action: "anti-lag-cooling-package",
      nextLevel: 5,
      title: "Anti-Lag & Cooling Package",
      completeTitle: "Anti-Lag & Cooling Package",
      buttonLabel: "Complete Induction Package",
      cost: DREAM_BUILD_INDUCTION_ANTI_LAG_COST,
      valueAdded: DREAM_BUILD_INDUCTION_ANTI_LAG_VALUE,
      copy: "Complete the induction package with the event-focused details that make the build feel extreme.",
      detailCopy: "Anti-lag, water-meth, boost control, and cooling package language belongs to fictional Tofu Garage event builds.",
      completeCopy: "The boost and cooling package is complete.",
      feedback: "Induction & Cooling complete: Anti-Lag & Cooling Package added. Garage Build Value +$14B.",
    };
  }
  return null;
}

function nextDreamBuildInductionWork(gameState) {
  const state = normalizeGameState(gameState);
  if (!inductionUnlockStatus(state).unlocked) return null;
  return dreamBuildInductionWorkForLevel(dreamBuildInductionLevel(state));
}

function drivetrainUnlockStatus(gameState) {
  const state = normalizeGameState(gameState);
  const inductionReady = dreamBuildInductionLevel(state) >= 5;
  return {
    unlocked: inductionReady,
    inductionReady,
    reason: inductionReady ? "" : "Complete Induction & Cooling to unlock the next power-delivery phase.",
  };
}

function dreamBuildDrivetrainWorkForLevel(level) {
  if (level === 0) {
    return {
      action: "sports-clutch-flywheel",
      nextLevel: 1,
      title: "Sports Clutch & Flywheel",
      completeTitle: "Sports Clutch & Flywheel",
      buttonLabel: "Install Clutch & Flywheel",
      cost: DREAM_BUILD_DRIVETRAIN_CLUTCH_COST,
      valueAdded: DREAM_BUILD_DRIVETRAIN_CLUTCH_VALUE,
      copy: "Start the drivetrain track with a sharper clutch and flywheel package.",
      detailCopy: "Sports flywheel and clutch-kit language maps to fictional response, durability, and event-fit stats.",
      completeCopy: "The power-delivery track has its first sharper package.",
      feedback: "Dream Build work complete: Sports Clutch & Flywheel.",
    };
  }
  if (level === 1) {
    return {
      action: "limited-slip-differential",
      nextLevel: 2,
      title: "Limited-Slip Differential",
      completeTitle: "Limited-Slip Differential",
      buttonLabel: "Install LSD",
      cost: DREAM_BUILD_DRIVETRAIN_LSD_COST,
      valueAdded: DREAM_BUILD_DRIVETRAIN_LSD_VALUE,
      copy: "Add a proper differential setup so the build feels more complete.",
      detailCopy: "1-way, 1.5-way, 2-way, and fully customizable LSD language becomes fictional control and event-fit detail.",
      completeCopy: "The build has a proper differential setup.",
      feedback: "Dream Build work complete: Limited-Slip Differential.",
    };
  }
  if (level === 2) {
    return {
      action: "carbon-driveshaft-axles",
      nextLevel: 3,
      title: "Carbon Driveshaft & Axles",
      completeTitle: "Carbon Driveshaft & Axles",
      buttonLabel: "Upgrade Driveshaft",
      cost: DREAM_BUILD_DRIVETRAIN_DRIVESHAFT_COST,
      valueAdded: DREAM_BUILD_DRIVETRAIN_DRIVESHAFT_VALUE,
      copy: "Strengthen the power path with lighter, tougher drivetrain hardware.",
      detailCopy: "Carbon driveshaft and upgraded heavy-duty axles / half-shafts add fictional durability, response, and collector appeal.",
      completeCopy: "The power path has lighter, tougher drivetrain hardware.",
      feedback: "Dream Build work complete: Carbon Driveshaft & Axles.",
    };
  }
  if (level === 3) {
    return {
      action: "custom-gearbox",
      nextLevel: 4,
      title: "Custom Gearbox",
      completeTitle: "Custom Gearbox",
      buttonLabel: "Build Custom Gearbox",
      cost: DREAM_BUILD_DRIVETRAIN_GEARBOX_COST,
      valueAdded: DREAM_BUILD_DRIVETRAIN_GEARBOX_VALUE,
      copy: "Build the gearbox around the car's new power and event identity.",
      detailCopy: "Custom manual transmission, short-throw shifter, shifter bushings, and gear-ratio setup language become fictional event-fit detail.",
      completeCopy: "The gearbox now matches the car's event identity.",
      feedback: "Dream Build work complete: Custom Gearbox.",
    };
  }
  if (level === 4) {
    return {
      action: "sequential-transmission-package",
      nextLevel: 5,
      title: "Sequential Transmission Package",
      completeTitle: "Sequential Transmission Package",
      buttonLabel: "Complete Transmission",
      cost: DREAM_BUILD_DRIVETRAIN_SEQUENTIAL_COST,
      valueAdded: DREAM_BUILD_DRIVETRAIN_SEQUENTIAL_VALUE,
      copy: "Complete the drivetrain with a high-end transmission package.",
      detailCopy: "Fully customizable sequential transmission and high-end semiautomatic transmission language belongs to fictional Tofu Garage event builds.",
      completeCopy: "The power-delivery package is complete.",
      feedback: "Drivetrain & Transmission complete: Sequential Transmission Package added. Garage Build Value +$120B.",
    };
  }
  return null;
}

function nextDreamBuildDrivetrainWork(gameState) {
  const state = normalizeGameState(gameState);
  if (!drivetrainUnlockStatus(state).unlocked) return null;
  return dreamBuildDrivetrainWorkForLevel(dreamBuildDrivetrainLevel(state));
}

function aeroUnlockStatus(gameState) {
  const state = normalizeGameState(gameState);
  const drivetrainReady = dreamBuildDrivetrainLevel(state) >= 5;
  return {
    unlocked: drivetrainReady,
    drivetrainReady,
    reason: drivetrainReady ? "" : "Complete Drivetrain & Transmission to unlock the final core build track.",
  };
}

function dreamBuildAeroWorkForLevel(level) {
  if (level === 0) {
    return {
      action: "front-splitter-side-skirts",
      nextLevel: 1,
      title: "Front Splitter & Side Skirts",
      completeTitle: "Front Splitter & Side Skirts",
      buttonLabel: "Fit Splitter & Skirts",
      cost: DREAM_BUILD_AERO_SPLITTER_COST,
      valueAdded: DREAM_BUILD_AERO_SPLITTER_VALUE,
      copy: "Start shaping the body with a cleaner front and side profile.",
      detailCopy: "Front splitter / lip spoiler, support rods, and side skirts become fictional Style, Event Fit, and Showcase Readiness details.",
      completeCopy: "The body has a cleaner front and side profile.",
      feedback: "Dream Build work complete: Front Splitter & Side Skirts.",
    };
  }
  if (level === 1) {
    return {
      action: "rear-diffuser-wing",
      nextLevel: 2,
      title: "Rear Diffuser & Wing",
      completeTitle: "Rear Diffuser & Wing",
      buttonLabel: "Fit Rear Aero",
      cost: DREAM_BUILD_AERO_REAR_AERO_COST,
      valueAdded: DREAM_BUILD_AERO_REAR_AERO_VALUE,
      copy: "Give the rear of the build a proper event-ready silhouette.",
      detailCopy: "Rear diffuser, custom rear wing set, chassis-mounted wing, and swan-neck wing mount language maps to fictional aero identity and event classification.",
      completeCopy: "The rear of the build has a proper event-ready silhouette.",
      feedback: "Dream Build work complete: Rear Diffuser & Wing.",
    };
  }
  if (level === 2) {
    return {
      action: "wide-body-vented-panels",
      nextLevel: 3,
      title: "Wide Body & Vented Panels",
      completeTitle: "Wide Body & Vented Panels",
      buttonLabel: "Fit Wide Body",
      cost: DREAM_BUILD_AERO_WIDE_BODY_COST,
      valueAdded: DREAM_BUILD_AERO_WIDE_BODY_VALUE,
      copy: "Commit to the body shape and make the build instantly recognizable.",
      detailCopy: "Wide body modification, vented hood, and louvered fender language becomes fictional Style, Cooling Presence, and Collector Appeal.",
      completeCopy: "The build's body identity is instantly recognizable.",
      feedback: "Dream Build work complete: Wide Body & Vented Panels.",
    };
  }
  if (level === 3) {
    return {
      action: "weight-reduction-package",
      nextLevel: 4,
      title: "Weight Reduction Package",
      completeTitle: "Weight Reduction Package",
      buttonLabel: "Reduce Weight",
      cost: DREAM_BUILD_AERO_WEIGHT_REDUCTION_COST,
      valueAdded: DREAM_BUILD_AERO_WEIGHT_REDUCTION_VALUE,
      copy: "Strip, strengthen, and refine the chassis so the build feels serious.",
      detailCopy: "Weight Reduction stages, Lexan / polycarbonate windows, and increased body rigidity become fictional Weight Class, Response, and Event Fit details.",
      completeCopy: "The chassis has a more serious fictional weight and rigidity package.",
      feedback: "Dream Build work complete: Weight Reduction Package.",
    };
  }
  if (level === 4) {
    return {
      action: "carbon-body-roll-cage",
      nextLevel: 5,
      title: "Carbon Body & Roll Cage",
      completeTitle: "Carbon Body & Roll Cage",
      buttonLabel: "Complete Aero Package",
      cost: DREAM_BUILD_AERO_CARBON_CAGE_COST,
      valueAdded: DREAM_BUILD_AERO_CARBON_CAGE_VALUE,
      copy: "Finish the body with carbon panels and a proper cage so the core build feels complete.",
      detailCopy: "Carbon fiber hood, trunk, roof, doors, roll cage Type A / B / C, and final chassis presentation complete the fictional aero and body package.",
      completeCopy: "The body, aero, and weight package is complete.",
      feedback: "Aero, Styling & Weight Reduction complete: Carbon Body & Roll Cage added. Garage Build Value +$800B.",
    };
  }
  return null;
}

function nextDreamBuildAeroWork(gameState) {
  const state = normalizeGameState(gameState);
  if (!aeroUnlockStatus(state).unlocked) return null;
  return dreamBuildAeroWorkForLevel(dreamBuildAeroLevel(state));
}

function finalBuildUnlockStatus(gameState) {
  const state = normalizeGameState(gameState);
  const aeroReady = dreamBuildAeroLevel(state) >= 5;
  return {
    unlocked: aeroReady,
    aeroReady,
    reason: aeroReady ? "" : "Complete Aero, Styling & Weight Reduction to finish the first core build.",
  };
}

function dreamBuildFinalWorkForLevel(level) {
  if (level === 0) {
    return {
      action: "final-detail",
      nextLevel: 1,
      title: "Final Detail",
      completeTitle: "Final Detail Complete",
      buttonLabel: "Final Detail",
      cost: DREAM_BUILD_FINAL_DETAIL_COST,
      valueAdded: DREAM_BUILD_FINAL_DETAIL_VALUE,
      copy: "Finish the final details, clean up the presentation, and make the first build feel complete.",
      detailCopy: "Final inspection, body alignment, detailing, fastener check, fluids, presentation setup, and garage photo prep.",
      completeCopy: "The build is cleaned up and ready for shakedown.",
      feedback: "Final Detail complete: Garage Build Value +$1.2T.",
    };
  }
  if (level === 1) {
    return {
      action: "shakedown-complete",
      nextLevel: 2,
      title: "Shakedown Complete",
      completeTitle: "First Complete Build",
      buttonLabel: "Complete First Build",
      cost: DREAM_BUILD_SHAKEDOWN_COST,
      valueAdded: DREAM_BUILD_SHAKEDOWN_VALUE,
      copy: "Complete the first full build with a fictional parked shakedown and final garage sign-off.",
      detailCopy: "Fictional shakedown sign-off, event readiness notes, final setup review, and first complete build documentation.",
      completeCopy: "The first Tofu Garage build is complete.",
      feedback: "First Complete Build: Shakedown Complete added. Garage Build Value +$2T.",
    };
  }
  return null;
}

function nextDreamBuildFinalWork(gameState) {
  const state = normalizeGameState(gameState);
  if (!finalBuildUnlockStatus(state).unlocked) return null;
  return dreamBuildFinalWorkForLevel(dreamBuildFinalBuildLevel(state));
}

function dreamBuildWheelsStatusLabel(level) {
  if (level >= 5) return "Collector Finish";
  if (level >= 4) return "Showpiece Fitment";
  if (level >= 3) return "Balanced Fitment";
  if (level >= 2) return "Polished Wheels";
  if (level >= 1) return "Wheels Installed";
  return "Not started";
}

function dreamBuildExhaustStatusLabel(level) {
  if (level >= 5) return "Showcase Finish";
  if (level >= 4) return "Heat Wrapped";
  if (level >= 3) return "Tuned Note";
  if (level >= 2) return "Sealed Joints";
  if (level >= 1) return "Exhaust Fitted";
  return "Not started";
}

function dreamBuildSuspensionStatusLabel(level) {
  if (level >= 5) return "Showcase Stance";
  if (level >= 4) return "Corner Balance";
  if (level >= 3) return "Alignment Dialed";
  if (level >= 2) return "Ride Height Set";
  if (level >= 1) return "Suspension Refreshed";
  return "Not started";
}

function dreamBuildTiresStatusLabel(level) {
  if (level >= 5) return "Event Tire Set";
  if (level >= 4) return "Racing Slicks & Semi-Slicks";
  if (level >= 3) return "Track-Day R-Compound Tires";
  if (level >= 2) return "Extreme Performance Summer Tires";
  if (level >= 1) return "Sports Tire Set";
  return "Stock Tires";
}

function dreamBuildBrakesStatusLabel(level) {
  if (level >= 5) return "Brake Balance & Control Package";
  if (level >= 4) return "Carbon Ceramic Big Brake Kit";
  if (level >= 3) return "Racing Brake Kit";
  if (level >= 2) return "Sports Brake Kit";
  if (level >= 1) return "Sports Brake Pads";
  return "Stock Brakes";
}

function dreamBuildInductionStatusLabel(level) {
  if (level >= 5) return "Anti-Lag & Cooling Package";
  if (level >= 4) return "Big Turbo Kit";
  if (level >= 3) return "Hybrid Turbo Upgrade";
  if (level >= 2) return "Electronic Boost Control";
  if (level >= 1) return "Sports Intercooler";
  return "Stock Induction";
}

function dreamBuildDrivetrainStatusLabel(level) {
  if (level >= 5) return "Sequential Transmission Package";
  if (level >= 4) return "Custom Gearbox";
  if (level >= 3) return "Carbon Driveshaft & Axles";
  if (level >= 2) return "Limited-Slip Differential";
  if (level >= 1) return "Sports Clutch & Flywheel";
  return "Stock Drivetrain";
}

function dreamBuildAeroStatusLabel(level) {
  if (level >= 5) return "Carbon Body & Roll Cage";
  if (level >= 4) return "Weight Reduction Package";
  if (level >= 3) return "Wide Body & Vented Panels";
  if (level >= 2) return "Rear Diffuser & Wing";
  if (level >= 1) return "Front Splitter & Side Skirts";
  return "Stock Body";
}

function dreamBuildFinalStatusLabel(level) {
  if (level >= 2) return "First Complete Build";
  if (level >= 1) return "Final Detail Complete";
  return "Not started";
}

function dreamBuildProgressVisible(gameState) {
  const state = normalizeGameState(gameState);
  return dreamBuildWheelsPurchased(state) || (coveredCarTeaserSeen(state) && dreamInvestmentTargetVisible(state));
}

function dreamBuildProgressSummary(gameState) {
  const state = normalizeGameState(gameState);
  const wheelsLevel = dreamBuildWheelsLevel(state);
  const exhaustLevel = dreamBuildExhaustLevel(state);
  const suspensionLevel = dreamBuildSuspensionLevel(state);
  const tiresLevel = dreamBuildTiresLevel(state);
  const brakesLevel = dreamBuildBrakesLevel(state);
  const inductionLevel = dreamBuildInductionLevel(state);
  const drivetrainLevel = dreamBuildDrivetrainLevel(state);
  const aeroLevel = dreamBuildAeroLevel(state);
  const finalBuildLevel = dreamBuildFinalBuildLevel(state);
  const completed = clamp(
    wheelsLevel + exhaustLevel + suspensionLevel + tiresLevel + brakesLevel + inductionLevel + drivetrainLevel + aeroLevel + finalBuildLevel,
    0,
    DREAM_BUILD_TOTAL_WORK_STAGES,
  );
  return {
    completed,
    total: DREAM_BUILD_TOTAL_WORK_STAGES,
    percent: clampPercent(Math.round((completed / DREAM_BUILD_TOTAL_WORK_STAGES) * 100)),
    wheelsLevel,
    wheelsStatus: dreamBuildWheelsStatusLabel(wheelsLevel),
    exhaustLevel,
    exhaustStatus: dreamBuildExhaustStatusLabel(exhaustLevel),
    suspensionLevel,
    suspensionStatus: dreamBuildSuspensionStatusLabel(suspensionLevel),
    tiresLevel,
    tiresStatus: dreamBuildTiresStatusLabel(tiresLevel),
    brakesLevel,
    brakesStatus: dreamBuildBrakesStatusLabel(brakesLevel),
    inductionLevel,
    inductionStatus: dreamBuildInductionStatusLabel(inductionLevel),
    drivetrainLevel,
    drivetrainStatus: dreamBuildDrivetrainStatusLabel(drivetrainLevel),
    aeroLevel,
    aeroStatus: dreamBuildAeroStatusLabel(aeroLevel),
    finalBuildLevel,
    finalBuildStatus: dreamBuildFinalStatusLabel(finalBuildLevel),
  };
}

function builderNoteVisible(gameState) {
  if (appState.running || appState.calibrating) return false;
  return dreamBuildInvestmentStarted(gameState);
}

function builderNoteValue(gameState) {
  return sanitizeBuilderNote(normalizeGameState(gameState).shop.dreamBuild.builderNote);
}

function saveBuilderNote(value, gameState = currentGameState(), options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Builder Note unlocks after you finish and park.", gameState: next };
  }
  if (!builderNoteVisible(next)) {
    return { ok: false, reason: "Builder Note unlocks after the Dream Build starts.", gameState: next };
  }
  next.shop.dreamBuild.builderNote = sanitizeBuilderNote(value);
  return {
    ok: true,
    reason: "",
    note: next.shop.dreamBuild.builderNote,
    gameState: next,
  };
}

function nextDreamBuildStep(gameState) {
  const state = normalizeGameState(gameState);
  const target = dreamInvestmentTargetProgress(state);
  if (!target.purchased) {
    return {
      title: target.ready ? "Buy Wheels" : "Wheels Fund",
      copy: target.ready
        ? "Start the dream build with the first real part."
        : "Save Cash from the shop to start the build.",
      future: false,
    };
  }
  const wheelsWork = nextDreamBuildWheelsWork(state);
  if (wheelsWork) {
    return { title: wheelsWork.title, copy: wheelsWork.copy, future: false };
  }
  const exhaustWork = nextDreamBuildExhaustWork(state);
  if (exhaustWork) {
    return { title: exhaustWork.buttonLabel, copy: exhaustWork.copy, future: false };
  }
  const suspensionWork = nextDreamBuildSuspensionWork(state);
  if (suspensionWork) {
    return { title: suspensionWork.title, copy: suspensionWork.copy, future: false };
  }
  const tiresWork = nextDreamBuildTiresWork(state);
  if (tiresWork) {
    return { title: tiresWork.title, copy: tiresWork.copy, future: false };
  }
  const brakesWork = nextDreamBuildBrakesWork(state);
  if (brakesWork) {
    return { title: brakesWork.title, copy: brakesWork.copy, future: false };
  }
  const inductionWork = nextDreamBuildInductionWork(state);
  if (inductionWork) {
    return { title: inductionWork.title, copy: inductionWork.copy, future: false };
  }
  const drivetrainWork = nextDreamBuildDrivetrainWork(state);
  if (drivetrainWork) {
    return { title: drivetrainWork.title, copy: drivetrainWork.copy, future: false };
  }
  const aeroWork = nextDreamBuildAeroWork(state);
  if (aeroWork) {
    return { title: aeroWork.title, copy: aeroWork.copy, future: false };
  }
  const finalWork = nextDreamBuildFinalWork(state);
  if (finalWork) {
    return { title: finalWork.title, copy: finalWork.copy, future: false };
  }
  if (dreamBuildFinalBuildLevel(state) >= 2) {
    return {
      title: "First Complete Build",
      copy: "The first Tofu Garage build is complete. Car Management is unlocked.",
      future: true,
    };
  }
  if (dreamBuildAeroLevel(state) >= 5) {
    return {
      title: "Final Detail & Shakedown",
      copy: "Aero, Styling & Weight Reduction is complete. Final Detail is next.",
      future: false,
    };
  }
  if (dreamBuildDrivetrainLevel(state) >= 5) {
    return {
      title: "Aero, Styling & Weight Reduction",
      copy: "Drivetrain & Transmission is complete. Aero, Styling & Weight Reduction is next.",
      future: false,
    };
  }
  if (dreamBuildInductionLevel(state) >= 5) {
    return {
      title: "Drivetrain & Transmission",
      copy: "Induction & Cooling is complete. Drivetrain & Transmission is next.",
      future: true,
    };
  }
  const inductionStatus = inductionUnlockStatus(state);
  if (dreamBuildBrakesLevel(state) >= 5 && !inductionStatus.unlocked) {
    return {
      title: "Induction & Cooling",
      copy: inductionStatus.reason,
      future: true,
    };
  }
  if (dreamBuildTiresLevel(state) >= 5) {
    return {
      title: "Brakes & Control",
      copy: "The Tires & Rubber track is complete. Brakes & Control is next.",
      future: false,
    };
  }
  if (dreamBuildSuspensionLevel(state) >= 5) {
    return {
      title: "Tires & Rubber",
      copy: "The Suspension track is complete. Tires & Rubber is next.",
      future: false,
    };
  }
  return {
    title: "Suspension",
    copy: "Complete the current build track to unlock the first Suspension work.",
    future: true,
  };
}

function buyDreamBuildWheels(gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Dream Build actions unlock after you finish and park.", gameState: next };
  }
  if (!dreamInvestmentTargetVisible(next) || !coveredCarTeaserSeen(next)) {
    return { ok: false, reason: "Look behind the shop before starting the Dream Build.", gameState: next };
  }
  if (next.shop.dreamBuild.wheelsPurchased) {
    return { ok: false, reason: "Wheels are already installed.", gameState: next };
  }
  if (cashBalance(next) < DREAM_INVESTMENT_TARGET_COST) {
    return { ok: false, reason: `Need ${formatCash(DREAM_INVESTMENT_TARGET_COST)} Cash for Wheels.`, gameState: next };
  }
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - DREAM_INVESTMENT_TARGET_COST, 0, SHOP_MAX_RESOURCE);
  next.shop.dreamBuild.wheelsPurchased = true;
  next.shop.dreamBuild.wheelsLevel = Math.max(1, safeNonNegativeInteger(next.shop.dreamBuild.wheelsLevel, 0, 5));
  const nowMs = options.now instanceof Date ? options.now.getTime() : Date.parse(options.now || "");
  next.shop.dreamBuild.firstInvestmentPurchasedAt = Number.isFinite(nowMs)
    ? new Date(nowMs).toISOString()
    : new Date().toISOString();
  next.shop.counterService.lastResult = "Dream Build started: Wheels installed.";
  return {
    ok: true,
    reason: "",
    feedback: "Dream Build started: Wheels installed.",
    gameState: addLedgerEntry(next, "story", "Dream Build started: Wheels installed."),
  };
}

function buyDreamBuildWheelsWork(action, gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Dream Build actions unlock after you finish and park.", gameState: next };
  }
  if (!next.shop.dreamBuild.wheelsPurchased) {
    return { ok: false, reason: "Buy Wheels before improving them.", gameState: next };
  }
  const work = nextDreamBuildWheelsWork(next);
  if (!work || work.action !== action) {
    return { ok: false, reason: "That Wheels work is not available yet.", gameState: next };
  }
  if (cashBalance(next) < work.cost) {
    return { ok: false, reason: `Need ${formatCash(work.cost - cashBalance(next))} more Cash.`, gameState: next };
  }
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - work.cost, 0, SHOP_MAX_RESOURCE);
  next.shop.dreamBuild.wheelsLevel = work.nextLevel;
  next.shop.counterService.lastResult = work.feedback;
  return {
    ok: true,
    reason: "",
    feedback: work.feedback,
    work,
    gameState: addLedgerEntry(next, "story", work.feedback),
  };
}

function buyDreamBuildExhaust(action, gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Dream Build actions unlock after you finish and park.", gameState: next };
  }
  if (dreamBuildWheelsLevel(next) < 3) {
    return { ok: false, reason: "Finish the current Wheels work before starting Exhaust.", gameState: next };
  }
  const work = nextDreamBuildExhaustWork(next);
  if (!work || work.action !== action) {
    return { ok: false, reason: "That Exhaust work is not available yet.", gameState: next };
  }
  if (cashBalance(next) < work.cost) {
    return { ok: false, reason: `Need ${formatCash(work.cost - cashBalance(next))} more Cash.`, gameState: next };
  }
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - work.cost, 0, SHOP_MAX_RESOURCE);
  if (action === "buy-exhaust") {
    next.shop.dreamBuild.exhaustPurchased = true;
  }
  next.shop.dreamBuild.exhaustLevel = work.nextLevel;
  next.shop.counterService.lastResult = work.feedback;
  return {
    ok: true,
    reason: "",
    feedback: work.feedback,
    work,
    gameState: addLedgerEntry(next, "story", work.feedback),
  };
}

function buyDreamBuildSuspension(action, gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Dream Build actions unlock after you finish and park.", gameState: next };
  }
  if (dreamBuildExhaustLevel(next) < 5) {
    return { ok: false, reason: "Finish the Exhaust track before starting Suspension.", gameState: next };
  }
  const work = nextDreamBuildSuspensionWork(next);
  if (!work || work.action !== action) {
    return { ok: false, reason: "That Suspension work is not available yet.", gameState: next };
  }
  if (cashBalance(next) < work.cost) {
    return { ok: false, reason: `Need ${formatCash(work.cost - cashBalance(next))} more Cash.`, gameState: next };
  }
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - work.cost, 0, SHOP_MAX_RESOURCE);
  next.shop.dreamBuild.suspensionLevel = work.nextLevel;
  next.shop.counterService.lastResult = work.feedback;
  return {
    ok: true,
    reason: "",
    feedback: work.feedback,
    work,
    gameState: addLedgerEntry(next, "story", work.feedback),
  };
}

function buyDreamBuildTires(action, gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Dream Build actions unlock after you finish and park.", gameState: next };
  }
  if (dreamBuildSuspensionLevel(next) < 5) {
    return { ok: false, reason: "Finish the Suspension track before starting Tires & Rubber.", gameState: next };
  }
  const work = nextDreamBuildTiresWork(next);
  if (!work || work.action !== action) {
    return { ok: false, reason: "That Tires & Rubber work is not available yet.", gameState: next };
  }
  if (cashBalance(next) < work.cost) {
    return { ok: false, reason: `Need ${formatCash(work.cost - cashBalance(next))} more Cash.`, gameState: next };
  }
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - work.cost, 0, SHOP_MAX_RESOURCE);
  next.shop.dreamBuild.tiresLevel = work.nextLevel;
  next.shop.counterService.lastResult = work.feedback;
  return {
    ok: true,
    reason: "",
    feedback: work.feedback,
    work,
    gameState: addLedgerEntry(next, "story", work.feedback),
  };
}

function buyDreamBuildBrakes(action, gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Dream Build actions unlock after you finish and park.", gameState: next };
  }
  if (dreamBuildTiresLevel(next) < 5) {
    return { ok: false, reason: "Finish the Tires & Rubber track before starting Brakes & Control.", gameState: next };
  }
  const work = nextDreamBuildBrakesWork(next);
  if (!work || work.action !== action) {
    return { ok: false, reason: "That Brakes & Control work is not available yet.", gameState: next };
  }
  if (cashBalance(next) < work.cost) {
    return { ok: false, reason: `Need ${formatCash(work.cost - cashBalance(next))} more Cash.`, gameState: next };
  }
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - work.cost, 0, SHOP_MAX_RESOURCE);
  next.shop.dreamBuild.brakesLevel = work.nextLevel;
  next.shop.counterService.lastResult = work.feedback;
  return {
    ok: true,
    reason: "",
    feedback: work.feedback,
    work,
    gameState: addLedgerEntry(next, "story", work.feedback),
  };
}

function buyDreamBuildInduction(action, gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Dream Build actions unlock after you finish and park.", gameState: next };
  }
  const unlock = inductionUnlockStatus(next);
  if (!unlock.unlocked) {
    return { ok: false, reason: unlock.reason, gameState: next };
  }
  const work = nextDreamBuildInductionWork(next);
  if (!work || work.action !== action) {
    return { ok: false, reason: "That Induction & Cooling work is not available yet.", gameState: next };
  }
  if (cashBalance(next) < work.cost) {
    return { ok: false, reason: `Need ${formatCash(work.cost - cashBalance(next))} more Cash.`, gameState: next };
  }
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - work.cost, 0, SHOP_MAX_RESOURCE);
  next.shop.dreamBuild.inductionLevel = work.nextLevel;
  next.shop.counterService.lastResult = work.feedback;
  return {
    ok: true,
    reason: "",
    feedback: work.feedback,
    work,
    gameState: addLedgerEntry(next, "story", work.feedback),
  };
}

function buyDreamBuildDrivetrain(action, gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Dream Build actions unlock after you finish and park.", gameState: next };
  }
  const unlock = drivetrainUnlockStatus(next);
  if (!unlock.unlocked) {
    return { ok: false, reason: unlock.reason, gameState: next };
  }
  const work = nextDreamBuildDrivetrainWork(next);
  if (!work || work.action !== action) {
    return { ok: false, reason: "That Drivetrain & Transmission work is not available yet.", gameState: next };
  }
  if (cashBalance(next) < work.cost) {
    return { ok: false, reason: `Need ${formatCash(work.cost - cashBalance(next))} more Cash.`, gameState: next };
  }
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - work.cost, 0, SHOP_MAX_RESOURCE);
  next.shop.dreamBuild.drivetrainLevel = work.nextLevel;
  next.shop.counterService.lastResult = work.feedback;
  return {
    ok: true,
    reason: "",
    feedback: work.feedback,
    work,
    gameState: addLedgerEntry(next, "story", work.feedback),
  };
}

function buyDreamBuildAero(action, gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Dream Build actions unlock after you finish and park.", gameState: next };
  }
  const unlock = aeroUnlockStatus(next);
  if (!unlock.unlocked) {
    return { ok: false, reason: unlock.reason, gameState: next };
  }
  const work = nextDreamBuildAeroWork(next);
  if (!work || work.action !== action) {
    return { ok: false, reason: "That Aero, Styling & Weight Reduction work is not available yet.", gameState: next };
  }
  if (cashBalance(next) < work.cost) {
    return { ok: false, reason: `Need ${formatCash(work.cost - cashBalance(next))} more Cash.`, gameState: next };
  }
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - work.cost, 0, SHOP_MAX_RESOURCE);
  next.shop.dreamBuild.aeroLevel = work.nextLevel;
  next.shop.counterService.lastResult = work.feedback;
  return {
    ok: true,
    reason: "",
    feedback: work.feedback,
    work,
    gameState: addLedgerEntry(next, "story", work.feedback),
  };
}

function buyDreamBuildFinal(action, gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Dream Build actions unlock after you finish and park.", gameState: next };
  }
  const unlock = finalBuildUnlockStatus(next);
  if (!unlock.unlocked) {
    return { ok: false, reason: unlock.reason, gameState: next };
  }
  const work = nextDreamBuildFinalWork(next);
  if (!work || work.action !== action) {
    return { ok: false, reason: "That Final Detail & Shakedown work is not available yet.", gameState: next };
  }
  if (cashBalance(next) < work.cost) {
    return { ok: false, reason: `Need ${formatCash(work.cost - cashBalance(next))} more Cash.`, gameState: next };
  }
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - work.cost, 0, SHOP_MAX_RESOURCE);
  next.shop.dreamBuild.finalBuildLevel = work.nextLevel;
  if (work.nextLevel >= 2) {
    const nowMs = options.now instanceof Date ? options.now.getTime() : Date.parse(options.now || "");
    const completedAt = Number.isFinite(nowMs) ? new Date(nowMs).toISOString() : new Date().toISOString();
    next.carManagement = normalizeCarManagement({
      ...(next.carManagement || {}),
      unlocked: true,
      currentCar: {
        ...((next.carManagement && next.carManagement.currentCar) || {}),
        completedAt,
      },
    }, next);
  }
  next.shop.counterService.lastResult = work.feedback;
  return {
    ok: true,
    reason: "",
    feedback: work.feedback,
    work,
    gameState: addLedgerEntry(next, "story", work.feedback),
  };
}

function buyShowcasePrep(gameState, options = {}) {
  let next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Showcase Prep unlocks after you finish and park.", gameState: next };
  }
  if (!showcaseInterestUnlocked(next)) {
    return { ok: false, reason: "Showcase Interest needs Dream Build progress and the first Net Worth milestone.", gameState: next };
  }
  if (next.shop.dreamBuild.showcaseDisplayPrepared) {
    return { ok: false, reason: "Showcase Display is already prepared.", gameState: next };
  }
  if (cashBalance(next) < SHOWCASE_PREP_COST) {
    return { ok: false, reason: `Need ${formatCash(SHOWCASE_PREP_COST - cashBalance(next))} more Cash for Showcase Prep.`, gameState: next };
  }
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - SHOWCASE_PREP_COST, 0, SHOP_MAX_RESOURCE);
  next.shop.dreamBuild.showcaseDisplayPrepared = true;
  const nowMs = options.now instanceof Date ? options.now.getTime() : Date.parse(options.now || "");
  next.shop.dreamBuild.showcaseDisplayPreparedAt = Number.isFinite(nowMs)
    ? new Date(nowMs).toISOString()
    : new Date().toISOString();
  const message = "Showcase Display Prepared.";
  next.shop.counterService.lastResult = message;
  next = addLedgerEntry(next, "story", `${message} ${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(SHOWCASE_PREP_VALUE)}.`);
  next = syncNetWorthMilestones(next).gameState;
  return {
    ok: true,
    reason: "",
    feedback: message,
    valueAdded: SHOWCASE_PREP_VALUE,
    gameState: next,
  };
}

function acceptSponsorInquiry(gameState, options = {}) {
  let next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Sponsor Inquiry unlocks after you finish and park.", gameState: next };
  }
  if (!sponsorInquiryUnlocked(next)) {
    return { ok: false, reason: "Sponsor Inquiry needs Showcase Prep, Dream Build progress, and the first Net Worth milestone.", gameState: next };
  }
  if (sponsorInquiryAccepted(next)) {
    return { ok: false, reason: "Sponsor Inquiry is already accepted.", gameState: next };
  }
  next.shop.tips = safeNonNegativeInteger(next.shop.tips + SPONSOR_INQUIRY_CASH_REWARD, 0, SHOP_MAX_RESOURCE);
  next.shop.lifetimeTips = safeNonNegativeInteger(next.shop.lifetimeTips + SPONSOR_INQUIRY_CASH_REWARD, 0, SHOP_MAX_RESOURCE);
  const nowMs = options.now instanceof Date ? options.now.getTime() : Date.parse(options.now || "");
  next.shop.dreamBuild.sponsor = {
    inquiryAccepted: true,
    inquiryAcceptedAt: Number.isFinite(nowMs)
      ? new Date(nowMs).toISOString()
      : new Date().toISOString(),
    brandValue: SPONSOR_INQUIRY_BRAND_VALUE,
  };
  const message = "Sponsor Inquiry accepted.";
  next.shop.counterService.lastResult = message;
  next = addLedgerEntry(
    next,
    "story",
    `${message} +${formatCashCount(SPONSOR_INQUIRY_CASH_REWARD)} Cash, +${formatCashCount(SPONSOR_INQUIRY_BRAND_VALUE)} Brand Value.`,
  );
  next = syncNetWorthMilestones(next).gameState;
  return {
    ok: true,
    reason: "",
    feedback: message,
    cashReward: SPONSOR_INQUIRY_CASH_REWARD,
    brandValue: SPONSOR_INQUIRY_BRAND_VALUE,
    gameState: next,
  };
}

function urgentShopPriorityBeforeDreamInvestment(gameState) {
  const state = normalizeGameState(gameState);
  const prep = orderPrepProgress(state);
  const runway = tofuStockRunway(state);
  const counterIncome = counterServiceIncomeStatus(state);
  if (counterIncome.status === "waiting_stock") return true;
  if (readyDeliveryOrders(state.shop) >= deliveryOrderQueueCapacity()) return true;
  if (isCounterServiceUnlocked(state) && !state.shop.counterService.running && prep.ready >= 3) return true;
  if (affordableShopUpgrade(state)) return true;
  if (affordableShopStation(state)) return true;
  if (prep.ready < 1 && runway.isLow) return true;
  return false;
}

function urgentShopBottleneckBeforeShowcase(gameState) {
  const state = normalizeGameState(gameState);
  const prep = orderPrepProgress(state);
  const counterIncome = counterServiceIncomeStatus(state);
  if (counterIncome.status === "waiting_stock") return true;
  if (readyDeliveryOrders(state.shop) >= deliveryOrderQueueCapacity()) return true;
  return isCounterServiceUnlocked(state) && !state.shop.counterService.running && prep.ready >= 3;
}

function acknowledgeCoveredCarTeaser(gameState) {
  const state = normalizeGameState(gameState);
  if (!coveredCarTeaserUnlocked(state)) {
    return { ok: false, reason: "The covered car is not ready to reveal yet.", gameState: state };
  }
  const wasSeen = coveredCarTeaserSeen(state);
  state.shop.coveredCarTeaserUnlocked = true;
  state.shop.coveredCarTeaserSeen = true;
  if (!state.seenStoryBeatIds.includes(COVERED_CAR_TEASER_ID)) {
    state.seenStoryBeatIds = [...state.seenStoryBeatIds, COVERED_CAR_TEASER_ID].slice(0, 100);
  }
  if (!wasSeen && !state.shop.coveredCarTeaserFeedbackShown) {
    state.shop.coveredCarTeaserFeedbackShown = true;
    state.shop.counterService.lastResult = "Story beat unlocked: something waits behind the shop.";
    return {
      ok: true,
      reason: "",
      feedback: "Story beat unlocked: something waits behind the shop.",
      gameState: addLedgerEntry(state, "story", "Story beat unlocked: something waits behind the shop."),
    };
  }
  return {
    ok: true,
    reason: "",
    feedback: "Behind the shop, the covered car waits.",
    gameState: state,
  };
}

function supplierStockPerSecond(gameState) {
  const state = normalizeGameState(gameState);
  return STATION_UPGRADES.reduce((total, upgrade) => (
    isSupplierUpgrade(upgrade)
      ? total + safeNonNegativeInteger(state.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel) * safeNonNegativeNumber(upgrade.supplierStockPerSecond, 0, 100000)
      : total
  ), 0);
}

function isOrderPrepBottleneck(gameState) {
  const state = normalizeGameState(gameState);
  const prep = orderPrepProgress(state);
  const runway = tofuStockRunway(state);
  return hasFirstShopOrder(state)
    && prep.ready < 1
    && prep.running
    && !runway.isLow
    && state.shop.tofuStock >= PREP_COUNTER_CONSUME_PER_ORDER;
}

function isStockBottleneck(gameState) {
  const state = normalizeGameState(gameState);
  return tofuStockRunway(state).isLow;
}

function shopUpgradeById(upgradeId) {
  return STATION_UPGRADES.find((upgrade) => upgrade.id === upgradeId) || null;
}

function stationUpgradeRevealReason(upgrade, gameState) {
  const state = normalizeGameState(gameState);
  const orders = fulfilledShopOrderCount(state);
  if (isDeferredRouteUpgrade(upgrade)) return routeGameplayDeferredReason();
  if (upgrade.id === "counter_service_bell") return "Unlocks after First 10 Orders or First $100 Cash";
  if (upgrade.id === "counter_service_wide") return "Unlocks after Order Bell and 20 fulfilled orders";
  if (upgrade.id === "counter_service_routine") return "Unlocks after Wider Counter and First Family Tofu Tray";
  if (upgrade.id === "counter_service_register") return "Unlocks after Pickup Routine and 25 fulfilled orders";
  if (upgrade.id === "counter_service_window") return "Unlocks after Second Register and 100 fulfilled orders";
  if (upgrade.id === "counter_service_crew") return "Unlocks after Pickup Window and 1K fulfilled orders or 5K Reputation";
  if (upgrade.id === "soy_supplier_contract") return "Unlocks after Catering Crate scale, Shop Level 25, or 10K Reputation";
  if (upgrade.id === "morning_soy_delivery") return "Unlocks after Soy Supplier Contract and Shop Level 50";
  if (upgrade.id === "bulk_soy_delivery") return "Unlocks after Morning Soy Delivery and Shop Level 100";
  if (upgrade.id === "manager_shift_manager") return "Unlocks after Counter Crew, Catering Crate, Shop Level 100, and 1M Reputation";
  if (upgrade.id === "manager_wholesale_pickup") return "Unlocks after Hire Shift Manager";
  if (upgrade.id === "tofu_press_faster") return "Unlocks when Tofu Stock is the bottleneck";
  if (upgrade.id === "tofu_press_double") return "Unlocks after owning 3 Tofu Presses";
  if (upgrade.id === "prep_counter_faster") return "Unlocks when Prep Counter is the bottleneck";
  if (upgrade.id === "prep_counter_double") return "Unlocks after owning 2 Prep Counters";
  if (upgrade.stationId === "delivery_shelf") return "Unlocks after the Delivery Shelf matters";
  if (upgrade.stationId === "shop_sign") return "Unlocks when reputation matters";
  if (upgrade.stationId === "regular_customer") return "Unlocks after Regular Customers arrive";
  if (upgrade.stationId === "delivery_route") return "Unlocks after fictional routes arrive";
  if (upgrade.stationId === "dispatcher_desk") return "Unlocks after crew automation arrives";
  if (orders < 1) return "Unlocks after first shop order";
  return "Coming after the core shop loop is balanced";
}

function stationUpgradeIsRevealedForState(upgrade, state) {
  const orders = fulfilledShopOrderCount(state);
  if (isDeferredRouteUpgrade(upgrade)) return false;
  if (safeNonNegativeInteger(state.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel) > 0) return true;
  if (upgrade.id === "counter_service_bell") {
    return Boolean(state.stamps.first_10_orders || state.stamps.first_100_tips)
      || fulfilledShopOrderCount(state) >= 10
      || safeNonNegativeInteger(state.shop.lifetimeTips, 0, SHOP_MAX_RESOURCE) >= 100;
  }
  if (upgrade.id === "counter_service_wide") {
    return safeNonNegativeInteger(state.shop.stationUpgrades.counter_service_bell, 0, 1) > 0
      && orders >= 20;
  }
  if (upgrade.id === "counter_service_routine") {
    return safeNonNegativeInteger(state.shop.stationUpgrades.counter_service_wide, 0, 1) > 0
      && Boolean(state.stamps.first_family_tofu_tray);
  }
  if (upgrade.id === "counter_service_register") {
    return safeNonNegativeInteger(state.shop.stationUpgrades.counter_service_routine, 0, 1) > 0
      && orders >= 25;
  }
  if (upgrade.id === "counter_service_window") {
    return safeNonNegativeInteger(state.shop.stationUpgrades.counter_service_register, 0, 1) > 0
      && orders >= 100;
  }
  if (upgrade.id === "counter_service_crew") {
    return safeNonNegativeInteger(state.shop.stationUpgrades.counter_service_window, 0, 1) > 0
      && (orders >= 1000 || state.shop.reputation >= 5000);
  }
  if (upgrade.id === "soy_supplier_contract") {
    const catering = shopOrderTypeById("catering_crate");
    return shopOrderTypeUnlocked(catering, state)
      || state.shop.shopLevel >= 25
      || state.shop.reputation >= 10000;
  }
  if (upgrade.id === "morning_soy_delivery") {
    return safeNonNegativeInteger(state.shop.stationUpgrades.soy_supplier_contract, 0, 1) > 0
      && state.shop.shopLevel >= 50;
  }
  if (upgrade.id === "bulk_soy_delivery") {
    return safeNonNegativeInteger(state.shop.stationUpgrades.morning_soy_delivery, 0, 1) > 0
      && state.shop.shopLevel >= 100;
  }
  if (upgrade.id === "manager_shift_manager") {
    return managerDeskUnlocked(state);
  }
  if (upgrade.id === "manager_wholesale_pickup") {
    return managerDeskUnlocked(state)
      || safeNonNegativeInteger(state.shop.stationUpgrades.manager_shift_manager, 0, 1) > 0;
  }
  if (upgrade.id === "tofu_press_faster") return (hasFirstShopOrder(state) && isStockBottleneck(state)) || state.shop.stations.tofu_press >= 2;
  if (upgrade.id === "tofu_press_double") return state.shop.stations.tofu_press >= 3 || orders >= 3;
  if (upgrade.id === "prep_counter_faster") return isOrderPrepBottleneck(state) || orders >= 1 || state.shop.stations.prep_counter >= 2;
  if (upgrade.id === "prep_counter_double") return state.shop.stations.prep_counter >= 2 || orders >= 10;
  if (upgrade.stationId === "delivery_shelf") return state.shop.stations.delivery_shelf > 0;
  if (upgrade.stationId === "shop_sign") return state.shop.stations.shop_sign > 0 || state.shop.reputation >= 10;
  if (upgrade.stationId === "regular_customer") return state.shop.stations.regular_customer > 0;
  if (upgrade.stationId === "delivery_route") return hasRouteStoryBeat(state) && state.shop.stations.delivery_route > 0;
  if (upgrade.stationId === "dispatcher_desk") return false;
  if (upgrade.stationId === "regional_network") return false;
  return false;
}

function stationUpgradeIsRevealed(upgrade, gameState) {
  const state = normalizeGameState(gameState);
  return stationUpgradeIsRevealedForState(upgrade, state);
}

function visibleStationUpgrades(gameState) {
  const state = normalizeGameState(gameState);
  return STATION_UPGRADES.filter((upgrade) => stationUpgradeIsRevealedForState(upgrade, state));
}

function upgradeRelevanceContextForState(state) {
  const prep = orderPrepProgress(state);
  const runway = tofuStockRunway(state);
  const ready = readyDeliveryOrders(state.shop);
  const counterStatus = counterServiceIncomeStatus(state);
  return {
    ready,
    readyPileup: ready >= 3 && runway.isHealthy,
    stockBlockedCounter: counterStatus.status === "waiting_stock",
    orderPrepBottleneck: hasFirstShopOrder(state)
      && prep.ready < 1
      && prep.running
      && !runway.isLow
      && state.shop.tofuStock >= PREP_COUNTER_CONSUME_PER_ORDER,
    stockBottleneck: runway.isLow,
  };
}

function upgradeRelevanceScoreForState(upgrade, state, context = upgradeRelevanceContextForState(state)) {
  if (context.stockBlockedCounter && isSupplierUpgrade(upgrade)) return -1;
  if (context.ready >= deliveryOrderQueueCapacity() && isManagerDeskUpgrade(upgrade)) return -2;
  if (context.readyPileup && upgrade.stationId === "counter_service") return 0;
  if (context.orderPrepBottleneck) {
    if (upgrade.id === "prep_counter_faster") return 0;
    if (upgrade.id === "prep_counter_double") return 1;
  }
  if (context.stockBottleneck) {
    if (upgrade.id === "tofu_press_faster") return 0;
    if (upgrade.id === "tofu_press_double") return 1;
  }
  if (upgrade.id === "prep_counter_faster") return 2;
  if (upgrade.id === "tofu_press_faster") return 3;
  if (isSupplierUpgrade(upgrade)) return 4;
  if (isManagerDeskUpgrade(upgrade)) return 5;
  return 10;
}

function upgradeRelevanceScore(upgrade, gameState) {
  const state = normalizeGameState(gameState);
  return upgradeRelevanceScoreForState(upgrade, state);
}

function visibleRelevantStationUpgrades(gameState) {
  const state = normalizeGameState(gameState);
  return STATION_UPGRADES
    .filter((upgrade) => stationUpgradeIsRevealedForState(upgrade, state))
    .sort((a, b) => (
      (STATION_UPGRADE_DISPLAY_INDEX[a.id] ?? 1000) - (STATION_UPGRADE_DISPLAY_INDEX[b.id] ?? 1000)
      || STATION_UPGRADES.indexOf(a) - STATION_UPGRADES.indexOf(b)
    ));
}

function formatAffordabilityRequirement(requirement) {
  const isCash = requirement.label === "Cash";
  const current = isCash
    ? formatCashBalance(requirement.current)
    : formatShopBalance(requirement.current);
  const required = isCash
    ? formatCash(requirement.required)
    : formatShopCost(requirement.required);
  return `${requirement.label}: ${current} / ${required}`;
}

function affordabilityProgress(requirements) {
  const activeRequirements = requirements
    .map((requirement) => ({
      label: requirement.label,
      current: safeNonNegativeNumber(requirement.current, 0, SHOP_MAX_RESOURCE),
      required: safeNonNegativeNumber(requirement.required, 0, SHOP_MAX_RESOURCE),
      perSecond: safeNonNegativeNumber(requirement.perSecond, 0, SHOP_MAX_RESOURCE),
    }))
    .filter((requirement) => requirement.required > 0);
  if (!activeRequirements.length) {
    return {
      percent: 100,
      label: "Ready",
      text: "Ready",
      etaText: "",
      limiting: null,
    };
  }
  const limiting = activeRequirements
    .filter((requirement) => requirement.current < requirement.required)
    .sort((a, b) => (
      (a.current / Math.max(1, a.required)) - (b.current / Math.max(1, b.required))
    ))[0] || null;
  const percent = limiting
    ? clampPercent((limiting.current / Math.max(1, limiting.required)) * 100)
    : 100;
  if (!limiting) {
    return {
      percent,
      label: "Ready",
      text: activeRequirements
        .map((requirement) => `${formatAffordabilityRequirement(requirement)} · ready`)
        .join(". "),
      etaText: "",
      limiting: null,
    };
  }
  const missing = Math.max(0, limiting.required - limiting.current);
  const etaText = limiting.perSecond > 0
    ? `about ${formatDuration(Math.ceil(missing / limiting.perSecond))}`
    : "";
  const otherText = activeRequirements
    .filter((requirement) => requirement.label !== limiting.label)
    .map((requirement) => (
      requirement.current >= requirement.required
        ? `${formatAffordabilityRequirement(requirement)} · ready`
        : formatAffordabilityRequirement(requirement)
    ))
    .join(". ");
  return {
    percent,
    label: `Waiting on ${limiting.label}`,
    text: `${formatAffordabilityRequirement(limiting)}${otherText ? `. ${otherText}.` : ""}`,
    etaText,
    limiting,
  };
}

function renderAffordabilityProgress(progress) {
  if (!progress || progress.percent >= 100) return "";
  const percent = clampPercent(progress.percent);
  return `
    <div class="nospill-afford-progress">
      <div class="nospill-afford-progress-head">
        <span>${escapeHtml(progress.label)}</span>
        <strong>${formatShopCount(percent)}%</strong>
      </div>
      <div
        class="nospill-afford-progress-bar"
        role="progressbar"
        aria-label="${escapeHtml(progress.label)} affordability progress"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${percent}"
      >
        <span style="width: ${percent}%"></span>
      </div>
      <small>${escapeHtml(progress.text)}${progress.etaText ? ` · ${escapeHtml(progress.etaText)}` : ""}</small>
    </div>
  `;
}

function upgradeAffordabilityStatus(upgrade, gameState) {
  const state = normalizeGameState(gameState);
  const level = safeNonNegativeInteger(state.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel);
  const costTips = stationUpgradeCostTips(upgrade, level);
  const costReputation = stationUpgradeCostReputation(upgrade, level);
  const station = shopStationById(upgrade.stationId);
  const counterServiceUpgrade = upgrade.stationId === "counter_service";
  const supplierUpgrade = isSupplierUpgrade(upgrade);
  const managerUpgrade = isManagerDeskUpgrade(upgrade);
  const unlocked = Boolean(
    (counterServiceUpgrade
      ? isCounterServiceUnlocked(state)
      : supplierUpgrade || managerUpgrade || (station && stationIsUnlocked(station, state)))
    && stationUpgradeIsRevealed(upgrade, state),
  );
  const disabledReason = stationUpgradeDisabledReason(upgrade, state, unlocked, costTips, level);
  const rates = getShopGeneratorRates(state);
  return {
    level,
    costTips,
    costReputation,
    unlocked,
    disabledReason,
    canBuy: unlocked && level < upgrade.maxLevel && !disabledReason && !appState.running && !appState.calibrating,
    progress: affordabilityProgress([
      {
        label: "Cash",
        current: state.shop.tips,
        required: supplierUpgrade ? 0 : costTips,
        perSecond: counterServiceIncomeStatus(state).tipsPerMinute / 60,
      },
      {
        label: "Reputation",
        current: state.shop.reputation,
        required: costReputation,
        perSecond: rates.passiveReputationPerSecond,
      },
    ]),
  };
}

function stationUpgradeDisabledReason(upgrade, gameState, unlocked, cost, level) {
  const state = normalizeGameState(gameState);
  if (!stationUpgradeIsRevealed(upgrade, state)) return stationUpgradeRevealReason(upgrade, state);
  if (!unlocked) return stationUpgradeRevealReason(upgrade, state);
  if (level >= upgrade.maxLevel) return "Maxed";
  if (appState.running || appState.calibrating) return "Shop actions unlock after you finish and park.";
  if (
    upgrade.id === "manager_wholesale_pickup"
    && safeNonNegativeInteger(state.shop.stationUpgrades.manager_shift_manager, 0, 1) < 1
  ) {
    return "Hire Shift Manager first.";
  }
  if (isSupplierUpgrade(upgrade)) {
    const reputationNeeded = Math.max(0, stationUpgradeCostReputation(upgrade, level) - state.shop.reputation);
    return reputationNeeded > 0 ? `Need ${formatShopCost(reputationNeeded)} more Reputation.` : "";
  }
  if (isManagerDeskUpgrade(upgrade)) {
    const tipsNeeded = Math.max(0, stationUpgradeCostTips(upgrade, level) - state.shop.tips);
    const reputationNeeded = Math.max(0, stationUpgradeCostReputation(upgrade, level) - state.shop.reputation);
    const missing = [];
    if (tipsNeeded > 0) missing.push(`${formatCash(tipsNeeded)} more Cash`);
    if (reputationNeeded > 0) missing.push(`${formatShopCost(reputationNeeded)} more Reputation`);
    return missing.length ? `Need ${missing.join(" and ")}.` : "";
  }
  const tipsNeeded = Math.max(0, safeNonNegativeInteger(cost, 0, 1000000000) - state.shop.tips);
  return tipsNeeded > 0 ? `Need ${formatCash(tipsNeeded)} more. Let Counter Service earn Cash from tips.` : "";
}

function stationUpgradePreviewText(upgrade, gameState) {
  const state = normalizeGameState(gameState);
  const level = safeNonNegativeInteger(state.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel);
  if (upgrade.stationId === "counter_service") {
    const beforeBatch = counterServiceBatchSize(state);
    const beforeSeconds = counterServiceIntervalSeconds(state);
    const preview = normalizeGameState(state);
    preview.shop.stationUpgrades[upgrade.id] = Math.min(upgrade.maxLevel, level + 1);
    const afterBatch = counterServiceBatchSize(preview);
    const afterSeconds = counterServiceIntervalSeconds(preview);
    if (beforeBatch !== afterBatch) {
      const beforePerMinute = roundTo((beforeBatch * 60) / beforeSeconds, 1);
      const afterPerMinute = roundTo((afterBatch * 60) / afterSeconds, 1);
      return `Counter Service: batch ${formatShopCount(beforeBatch)} -> ${formatShopCount(afterBatch)} (${beforePerMinute}/min -> ${afterPerMinute}/min when supplied).`;
    }
    const beforePerMinute = roundTo(60 / beforeSeconds, 1);
    const afterPerMinute = roundTo(60 / afterSeconds, 1);
    return `Counter Service: 1 handoff / ${formatShopCount(beforeSeconds)} sec -> 1 handoff / ${formatShopCount(afterSeconds)} sec (${beforePerMinute}/min -> ${afterPerMinute}/min).`;
  }
  if (isSupplierUpgrade(upgrade)) {
    const before = getShopGeneratorRates(state);
    const preview = normalizeGameState(state);
    preview.shop.stationUpgrades[upgrade.id] = Math.min(upgrade.maxLevel, level + 1);
    const after = getShopGeneratorRates(preview);
    return `Tofu supply: +${formatShopRate(before.tofuPressPerSecond)}/sec -> +${formatShopRate(after.tofuPressPerSecond)}/sec.`;
  }
  if (isManagerDeskUpgrade(upgrade)) {
    if (upgrade.id === "manager_shift_manager") {
      const beforeBatch = counterServiceBatchSize(state);
      const preview = normalizeGameState(state);
      preview.shop.stationUpgrades[upgrade.id] = 1;
      const afterBatch = counterServiceBatchSize(preview);
      return `Managed counter: batch ${formatShopCount(beforeBatch)} -> ${formatShopCount(afterBatch)} when supplied.`;
    }
    return `Wholesale Pickup clears up to ${formatShopCount(50)} waiting orders per handoff when the queue is full and tofu is supplied.`;
  }
  const before = getShopGeneratorRates(state);
  const preview = normalizeGameState(state);
  preview.shop.stationUpgrades[upgrade.id] = Math.min(upgrade.maxLevel, level + 1);
  const after = getShopGeneratorRates(preview);
  if (upgrade.stationId === "tofu_press") {
    return `Tofu Press: +${formatShopRate(before.tofuPressPerSecond)}/sec -> +${formatShopRate(after.tofuPressPerSecond)}/sec.`;
  }
  if (upgrade.stationId === "prep_counter") {
    const beforeSeconds = before.prepOrdersPerSecond > 0
      ? Math.ceil(1 / before.prepOrdersPerSecond)
      : 0;
    const afterSeconds = after.prepOrdersPerSecond > 0
      ? Math.ceil(1 / after.prepOrdersPerSecond)
      : 0;
    return `Prep Counter: 1 order / ${formatShopCount(beforeSeconds)} sec -> 1 order / ${formatShopCount(afterSeconds)} sec.`;
  }
  return `${upgrade.effect}.`;
}

function stationUpgradeWhyItMatters(upgrade) {
  if (upgrade.id === "soy_supplier_contract") return "Uses Reputation to keep Counter Service supplied for larger orders.";
  if (upgrade.id === "morning_soy_delivery") return "Adds a stronger tofu supply line for managed-shop scale.";
  if (upgrade.id === "bulk_soy_delivery") return "Helps Counter Crew keep Catering Crates supplied.";
  if (upgrade.id === "manager_shift_manager") return "Opens Manager Desk scale without adding a new tab.";
  if (upgrade.id === "manager_wholesale_pickup") return "Turns a full waiting-order queue into capped managed throughput.";
  if (upgrade.id === "counter_service_bell") return "Helps Counter Service keep up with prepared orders.";
  if (upgrade.id === "counter_service_wide") return "Keeps larger order queues from piling up.";
  if (upgrade.id === "counter_service_routine") return "Makes automatic pickups feel smooth after Family Trays.";
  if (upgrade.id === "counter_service_register") return "Processes two prepared orders per handoff when supplied.";
  if (upgrade.id === "counter_service_window") return "Turns a growing Ready Orders pile into useful Cash faster.";
  if (upgrade.id === "counter_service_crew") return "Starts the managed counter phase with larger automatic batches.";
  if (upgrade.id === "prep_counter_faster") return "Makes the next order arrive faster.";
  if (upgrade.id === "prep_counter_double") return "Turns extra counters into a bigger throughput jump.";
  if (upgrade.id === "tofu_press_faster") return "Helps when Tofu Stock is running low.";
  if (upgrade.id === "tofu_press_double") return "Builds a larger tofu runway for bigger orders.";
  return "Improves parked shop production.";
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
  if (isDeferredRouteStationId(station.id)) {
    return { ok: false, reason: routeGameplayDeferredReason(), gameState: next };
  }
  if (!stationIsUnlocked(station, next)) {
    return { ok: false, reason: station.unlock, gameState: next };
  }
  const quantity = buyQuantityFromRequest(next, station, requestedQuantity);
  if (quantity < 1) return { ok: false, reason: "Not enough Cash or Prep Capacity.", gameState: next };
  const owned = safeNonNegativeInteger(next.shop.stations[station.id], 0, 100000);
  const costTips = Array.from({ length: quantity }).reduce(
    (sum, _, index) => sum + stationCost(station, owned + index),
    0,
  );
  const prepCost = safeNonNegativeInteger(station.prepSlotCost, 0, 100) * quantity;
  if (next.shop.tips < costTips) return { ok: false, reason: "Not enough Cash.", gameState: next };
  if (next.shop.prepSlots < prepCost) return { ok: false, reason: "Prep Capacity is recovering.", gameState: next };
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - costTips);
  next.shop.prepSlots = safeNonNegativeNumber(next.shop.prepSlots - prepCost);
  next.shop.stations[station.id] = owned + quantity;
  const milestone = crossedStationMilestone(
    station.id,
    owned,
    next.shop.stations[station.id],
    next.seenStationMilestoneIds,
  );
  let milestoneFeedback = "";
  if (milestone) {
    const milestoneId = stationMilestoneId(station.id, milestone.threshold);
    next.seenStationMilestoneIds = [...next.seenStationMilestoneIds, milestoneId].slice(0, 200);
    milestoneFeedback = stationMilestoneFeedback(station.id, milestone);
  }
  syncShopGenerators(next);
  next = addLedgerEntry(
    next,
    "purchase",
    `Bought ${quantity} ${station.name}${quantity > 1 ? "s" : ""}.${milestoneFeedback ? ` ${milestoneFeedback}.` : ""}`,
  );
  return { ok: true, reason: "", gameState: next, station, quantity, costTips, milestone, milestoneFeedback };
}

function fulfillShopOrders(gameState, requestedQuantity = 1, options = {}) {
  let next = normalizeGameState(gameState);
  const previous = normalizeGameState(next);
  const optionNowMs = options.now instanceof Date ? options.now.getTime() : Date.parse(options.now || "");
  const fulfilledAt = Number.isFinite(optionNowMs)
    ? new Date(optionNowMs).toISOString()
    : new Date().toISOString();
  if (options.activeDrive) {
    return { ok: false, reason: "Shop actions unlock after you finish and park.", gameState: next };
  }
  const readyOrders = readyDeliveryOrders(next.shop);
  const requestedOrderType = options.orderTypeId ? shopOrderTypeById(options.orderTypeId) : null;
  const orderType = requestedQuantity === "max" && !requestedOrderType
    ? bestFulfillableShopOrderType(next) || shopOrderTypeById("simple_tofu_box")
    : requestedOrderType || shopOrderTypeById("simple_tofu_box");
  const unlocked = shopOrderTypeUnlocked(orderType, next);
  if (!unlocked) {
    return { ok: false, reason: shopOrderUnlockReason(orderType), gameState: next, orderType };
  }
  const maxQuantity = maxFulfillableShopOrderQuantity(next, orderType);
  const quantity = requestedQuantity === "max"
    ? maxQuantity
    : Math.max(1, safeNonNegativeInteger(requestedQuantity, 1, 100000));
  const deliveryOrdersUsed = quantity * orderType.deliveryOrdersRequired;
  const tofuUsed = quantity * orderType.tofuRequired;
  if (quantity < 1 || maxQuantity < quantity || readyOrders < deliveryOrdersUsed || next.shop.tofuStock < tofuUsed) {
    return { ok: false, reason: shopOrderDisabledReason(orderType, next, unlocked), gameState: next, orderType };
  }
  const signOwned = safeNonNegativeInteger(next.shop.stations.shop_sign, 0, 100000);
  const signSupport = signOwned * 0.1 + stationUpgradeLevel(next.shop, "shop_sign_faster") * 0.2;
  const signBonus = 1 + signSupport * stationMilestoneMultiplier("shop_sign", signOwned);
  const driverBonus = driverShopReputationBonus(next);
  const garageBonus = safeNonNegativeInteger(next.shop.garage.delivery_mat, 0, 100) >= 3 ? 1 : 0;
  const tipsGained = Math.round(orderType.tips * quantity);
  const reputationGained = Math.round((orderType.reputation * quantity + garageBonus) * signBonus * driverBonus.multiplier);
  const shopXpGained = orderType.xp * quantity;
  const previousShopLevel = next.shop.shopLevel;
  next.shop.deliveryOrders = Math.max(0, safeNonNegativeNumber(next.shop.deliveryOrders, 0) - deliveryOrdersUsed);
  next.shop.tofuStock = Math.max(0, safeNonNegativeNumber(next.shop.tofuStock, 0) - tofuUsed);
  next.shop.tips = safeNonNegativeInteger(next.shop.tips + tipsGained);
  next.shop.lifetimeTips = safeNonNegativeInteger(next.shop.lifetimeTips + tipsGained);
  next.shop.reputation = safeNonNegativeInteger(next.shop.reputation + reputationGained);
  next.shop.lifetimeReputation = safeNonNegativeInteger(next.shop.lifetimeReputation + reputationGained);
  next.shop.shopXP = safeNonNegativeInteger(next.shop.shopXP + shopXpGained);
  next.shop.lifetimeShopXP = safeNonNegativeInteger(next.shop.lifetimeShopXP + shopXpGained);
  next.shop.lifetimeDeliveryOrders = safeNonNegativeInteger(next.shop.lifetimeDeliveryOrders + deliveryOrdersUsed);
  next.shop.shopLevel = getShopLevel(next.shop.reputation);
  const firstShopOrderStampUnlocked = !next.stamps.first_shop_order;
  if (firstShopOrderStampUnlocked) {
    next = awardShopStamp(next, "first_shop_order").gameState;
  }
  const firstFamilyTrayStampUnlocked = orderType.id === "family_tofu_tray" && !next.stamps.first_family_tofu_tray;
  if (firstFamilyTrayStampUnlocked) {
    next = awardShopStamp(next, "first_family_tofu_tray").gameState;
  }
  if (next.shop.lifetimeDeliveryOrders >= 10 && !next.stamps.first_10_orders) {
    next = awardShopStamp(next, "first_10_orders").gameState;
  }
  if (next.shop.lifetimeTips >= 100 && !next.stamps.first_100_tips) {
    next = awardShopStamp(next, "first_100_tips").gameState;
  }
  let stampFanfare = null;
  if (firstShopOrderStampUnlocked && !options.suppressFanfare) {
    const queued = queueStampFanfare(next, "first_shop_order", {
      tipsGained,
      reputationGained,
      shopXpGained,
    });
    next = queued.gameState;
    stampFanfare = queued.stampFanfare;
  }
  let discoveryFanfare = null;
  if (shouldRevealUpgradesSystem(previous, next) && !options.suppressFanfare) {
    const queued = queueDiscoveryFanfare(next, "upgrades");
    next = queued.gameState;
    discoveryFanfare = queued.discoveryFanfare;
  }
  syncShopGenerators(next);
  next.shop.lastShopTickAt = fulfilledAt;
  if (!options.skipLedger) {
    next = addLedgerEntry(
      next,
      "order",
      `Fulfilled ${quantity} ${orderType.name}${quantity > 1 ? "s" : ""}.${firstShopOrderStampUnlocked ? " First Shop Order stamp earned." : ""}`,
    );
  }
  if (!options.skipRecentReward) {
    next.recentRewards = [{
      date: next.shop.lastShopTickAt,
      type: "shop_order",
      label: quantity > 1 ? `${orderType.name}s Complete` : `${orderType.name} Complete`,
      tipsGained,
      reputationGained,
      shopXpGained,
      xpGained: shopXpGained,
    }, ...next.recentRewards].slice(0, 12);
  }
  return {
    ok: true,
    reason: "",
    gameState: next,
    quantity,
    orderType,
    deliveryOrdersUsed,
    tofuUsed,
    tipsGained,
    reputationGained,
    shopXpGained,
    xpGained: shopXpGained,
    firstShopOrderStampUnlocked,
    firstFamilyTrayStampUnlocked,
    stampFanfare,
    discoveryFanfare,
    shopLevelBefore: previousShopLevel,
    shopLevelAfter: next.shop.shopLevel,
    shopLevelChanged: next.shop.shopLevel > previousShopLevel,
    report: `${orderType.name}${quantity > 1 ? "s" : ""} complete. Packed and handed off from the counter.${firstShopOrderStampUnlocked ? " First Shop Order stamp discovered." : ""}`,
  };
}

function isCounterServiceUnlocked(gameState) {
  return Boolean(normalizeGameState(gameState).shop);
}

function counterServicePriorityLabel(priority) {
  return priority === "simple_only" ? "Simple Only" : "Best Available";
}

function counterServiceIntervalSeconds(gameState) {
  const state = normalizeGameState(gameState);
  if (safeNonNegativeInteger(state.shop.stationUpgrades.counter_service_routine, 0, 1) > 0) return 4;
  if (safeNonNegativeInteger(state.shop.stationUpgrades.counter_service_wide, 0, 1) > 0) return 6;
  if (safeNonNegativeInteger(state.shop.stationUpgrades.counter_service_bell, 0, 1) > 0) return 8;
  return COUNTER_SERVICE_HANDOFF_SECONDS;
}

function counterServiceBatchSizeWithoutContracts(gameState) {
  const state = normalizeGameState(gameState);
  if (safeNonNegativeInteger(state.shop.stationUpgrades.manager_shift_manager, 0, 1) > 0) return 25;
  if (safeNonNegativeInteger(state.shop.stationUpgrades.counter_service_crew, 0, 1) > 0) return 10;
  if (safeNonNegativeInteger(state.shop.stationUpgrades.counter_service_window, 0, 1) > 0) return 5;
  if (safeNonNegativeInteger(state.shop.stationUpgrades.counter_service_register, 0, 1) > 0) return 2;
  return 1;
}

function counterServiceBatchSize(gameState) {
  const state = normalizeGameState(gameState);
  const baseBatch = counterServiceBatchSizeWithoutContracts(state);
  const contractFloor = COUNTER_CONTRACTS
    .filter((contract) => counterContractPurchased(state, contract.id))
    .reduce((max, contract) => Math.max(max, contract.batchFloor), 0);
  return Math.max(baseBatch, contractFloor);
}

function counterServicePriorityOrderIds(gameState) {
  const state = normalizeGameState(gameState);
  const highScale = ["venue_supply_contract", "event_catering_load", "wholesale_case"];
  return [
    ...highScale.filter((orderTypeId) => shopOrderTypeUnlocked(shopOrderTypeById(orderTypeId), state)),
    "catering_crate",
    "festival_bento",
    "family_tofu_tray",
    "simple_tofu_box",
  ];
}

function wholesalePickupUnlocked(gameState) {
  const state = normalizeGameState(gameState);
  return safeNonNegativeInteger(state.shop.stationUpgrades.manager_wholesale_pickup, 0, 1) > 0;
}

function wholesalePickupQuantity(gameState, attempts = 1) {
  const state = normalizeGameState(gameState);
  if (!wholesalePickupUnlocked(state)) return 0;
  if (readyDeliveryOrders(state.shop) < deliveryOrderQueueCapacity() - 1000) return 0;
  const simpleOrder = shopOrderTypeById("simple_tofu_box");
  const maxByOrders = readyDeliveryOrders(state.shop);
  const maxByTofu = Math.floor(safeNonNegativeNumber(state.shop.tofuStock, 0, SHOP_MAX_RESOURCE) / simpleOrder.tofuRequired);
  const maxByCycle = Math.max(0, safeNonNegativeInteger(attempts, 0, 1000)) * 50;
  return Math.max(0, Math.min(maxByCycle, maxByOrders, maxByTofu));
}

function counterServiceOrderType(gameState) {
  const state = normalizeGameState(gameState);
  const priority = state.shop.counterService.priority || "best_available";
  const candidates = priority === "simple_only"
    ? ["simple_tofu_box"]
    : counterServicePriorityOrderIds(state);
  return candidates
    .map((orderTypeId) => shopOrderTypeById(orderTypeId))
    .find((orderType) => (
      orderType
      && shopOrderTypeUnlocked(orderType, state)
      && maxFulfillableShopOrderQuantity(state, orderType) > 0
    )) || null;
}

function counterServiceBatchPreview(gameState) {
  let simulated = normalizeGameState(gameState);
  let remainingBatch = counterServiceBatchSize(simulated);
  const orderCounts = {};
  let quantity = 0;
  let tips = 0;
  let reputation = 0;
  let shopXP = 0;
  let lastOrderType = null;
  while (remainingBatch > 0) {
    const orderType = counterServiceOrderType(simulated);
    if (!orderType) break;
    const availableQuantity = Math.min(
      remainingBatch,
      maxFulfillableShopOrderQuantity(simulated, orderType),
    );
    if (availableQuantity < 1) break;
    simulated.shop.tofuStock = safeNonNegativeNumber(
      simulated.shop.tofuStock - orderType.tofuRequired * availableQuantity,
    );
    simulated.shop.deliveryOrders = safeNonNegativeNumber(
      simulated.shop.deliveryOrders - orderType.deliveryOrdersRequired * availableQuantity,
    );
    quantity += availableQuantity;
    tips += orderType.tips * availableQuantity;
    reputation += orderType.reputation * availableQuantity;
    shopXP += orderType.xp * availableQuantity;
    orderCounts[orderType.id] = (orderCounts[orderType.id] || 0) + availableQuantity;
    lastOrderType = orderType;
    remainingBatch -= availableQuantity;
  }
  return {
    quantity,
    tips,
    reputation,
    shopXP,
    orderCounts,
    lastOrderType,
    batchSize: counterServiceBatchSize(gameState),
  };
}

function counterServiceCandidateOrderTypes(gameState) {
  const state = normalizeGameState(gameState);
  const priority = state.shop.counterService.priority || "best_available";
  const candidateIds = priority === "simple_only"
    ? ["simple_tofu_box"]
    : counterServicePriorityOrderIds(state);
  return candidateIds
    .map((orderTypeId) => shopOrderTypeById(orderTypeId))
    .filter((orderType) => orderType && shopOrderTypeUnlocked(orderType, state));
}

function cheapestCounterServiceOrderNeedingStock(gameState) {
  const state = normalizeGameState(gameState);
  const ready = readyDeliveryOrders(state.shop);
  const candidates = counterServiceCandidateOrderTypes(state)
    .filter((orderType) => ready >= orderType.deliveryOrdersRequired);
  const usableCandidates = candidates.length > 0 ? candidates : counterServiceCandidateOrderTypes(state);
  return usableCandidates.reduce((cheapest, orderType) => (
    !cheapest || orderType.tofuRequired < cheapest.tofuRequired ? orderType : cheapest
  ), null);
}

function counterServiceStockEtaDetail(gameState, orderType) {
  const state = normalizeGameState(gameState);
  if (!orderType) return { detail: "", stockEtaSeconds: null };
  const currentTofu = safeNonNegativeNumber(state.shop.tofuStock, 0, SHOP_MAX_RESOURCE);
  const missingTofu = Math.max(0, orderType.tofuRequired - currentTofu);
  if (missingTofu <= 0) return { detail: "", stockEtaSeconds: null };
  const rates = getShopGeneratorRates(state);
  const stockPerSecond = safeNonNegativeNumber(rates.tofuPressPerSecond, 0, SHOP_MAX_RESOURCE);
  if (stockPerSecond <= 0) {
    return {
      detail: "Tofu Stock is not catching up. Buy Tofu Press when Cash is available.",
      stockEtaSeconds: null,
    };
  }
  const stockEtaSeconds = Math.max(1, Math.ceil(missingTofu / stockPerSecond));
  return {
    detail: `Needs ${formatShopCost(orderType.tofuRequired)} Tofu Stock. Current: ${formatShopBalance(currentTofu)}. Ready in about ${formatShopCount(stockEtaSeconds)} sec.`,
    stockEtaSeconds,
  };
}

function counterServiceProgress(gameState, now = new Date()) {
  const state = normalizeGameState(gameState);
  const service = state.shop.counterService;
  const nowMs = now instanceof Date ? now.getTime() : Date.parse(now);
  const lastMs = Date.parse(service.lastHandoffAt || "");
  if (!isCounterServiceUnlocked(state)) {
    return {
      unlocked: false,
      running: false,
      percent: 0,
      etaSeconds: null,
      message: "Counter Service is available from the starter shop.",
    };
  }
  if (!service.running || appState.running || appState.calibrating) {
    return {
      unlocked: true,
      running: false,
      percent: 0,
      etaSeconds: null,
      message: "Paused. Start Counter Service when you want automatic pickups.",
    };
  }
  if (!Number.isFinite(nowMs) || !Number.isFinite(lastMs) || nowMs <= lastMs) {
    const interval = counterServiceIntervalSeconds(state);
    return {
      unlocked: true,
      running: true,
      percent: 0,
      etaSeconds: interval,
      message: `Next handoff in ${formatShopCount(interval)} seconds.`,
    };
  }
  const elapsed = Math.max(0, (nowMs - lastMs) / 1000);
  const interval = counterServiceIntervalSeconds(state);
  const progressSeconds = elapsed % interval;
  const etaSeconds = Math.max(1, Math.ceil(interval - progressSeconds));
  return {
    unlocked: true,
    running: true,
    percent: clampPercent((progressSeconds / interval) * 100),
    etaSeconds,
    message: `Next handoff in ${formatShopCount(etaSeconds)} seconds.`,
  };
}

function startCounterService(gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Counter Service runs only while parked.", gameState: next };
  }
  if (!isCounterServiceUnlocked(next)) {
    return { ok: false, reason: "Counter Service is not available yet.", gameState: next };
  }
  const nowMs = options.now instanceof Date ? options.now.getTime() : Date.parse(options.now || "");
  const nowIso = Number.isFinite(nowMs) ? new Date(nowMs).toISOString() : new Date().toISOString();
  next.shop.counterService.running = true;
  next.shop.counterService.priority = next.shop.counterService.priority || "best_available";
  if (!Number.isFinite(Date.parse(next.shop.counterService.lastHandoffAt || ""))) {
    next.shop.counterService.lastHandoffAt = nowIso;
  }
  next.shop.counterService.lastResult = "Counter Service started.";
  next.shop.lastShopTickAt = nowIso;
  return { ok: true, reason: "", gameState: next };
}

function pauseCounterService(gameState, options = {}) {
  const next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Counter Service controls unlock after you finish and park.", gameState: next };
  }
  if (!isCounterServiceUnlocked(next)) {
    return { ok: false, reason: "Counter Service is not available yet.", gameState: next };
  }
  next.shop.counterService.running = false;
  next.shop.counterService.lastResult = "Counter Service paused.";
  return { ok: true, reason: "", gameState: next };
}

function applyCounterServiceTick(gameState, now = new Date(), options = {}) {
  let next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { gameState: next, changed: false, completed: 0, message: "" };
  }
  if (!isCounterServiceUnlocked(next) || !next.shop.counterService.running) {
    return { gameState: next, changed: false, completed: 0, message: "" };
  }
  const nowMs = now instanceof Date ? now.getTime() : Date.parse(now);
  const nowIso = Number.isFinite(nowMs) ? new Date(nowMs).toISOString() : new Date().toISOString();
  const lastMs = Date.parse(next.shop.counterService.lastHandoffAt || "");
  if (!Number.isFinite(lastMs) || !Number.isFinite(nowMs)) {
    next.shop.counterService.lastHandoffAt = nowIso;
    return { gameState: next, changed: true, completed: 0, message: "" };
  }
  const maxSeconds = Number.isFinite(Number(options.maxSeconds))
    ? Math.max(0, Number(options.maxSeconds))
    : SHOP_OPEN_TICK_MAX_SECONDS;
  const elapsedSeconds = Math.min(maxSeconds, Math.max(0, (nowMs - lastMs) / 1000));
  const interval = counterServiceIntervalSeconds(next);
  const attempts = Math.floor(elapsedSeconds / interval);
  if (attempts < 1) {
    return { gameState: next, changed: false, completed: 0, message: "" };
  }

  const totals = {
    completed: 0,
    wholesaleCompleted: 0,
    tips: 0,
    reputation: 0,
    shopXP: 0,
    orderCounts: {},
    lastOrderType: null,
  };

  const batchSize = counterServiceBatchSize(next);
  for (let index = 0; index < attempts; index += 1) {
    let remainingBatch = batchSize;
    let completedThisHandoff = 0;
    while (remainingBatch > 0) {
      const orderType = counterServiceOrderType(next);
      if (!orderType) break;
      const availableQuantity = Math.min(
        remainingBatch,
        maxFulfillableShopOrderQuantity(next, orderType),
      );
      if (availableQuantity < 1) break;
      const result = fulfillShopOrders(next, availableQuantity, {
        activeDrive: false,
        orderTypeId: orderType.id,
        suppressFanfare: true,
        skipLedger: true,
        skipRecentReward: true,
        now,
      });
      if (!result.ok || result.quantity < 1) break;
      next = result.gameState;
      totals.completed += result.quantity;
      totals.tips += result.tipsGained;
      totals.reputation += result.reputationGained;
      totals.shopXP += result.shopXpGained || result.xpGained || 0;
      totals.orderCounts[orderType.name] = (totals.orderCounts[orderType.name] || 0) + result.quantity;
      totals.lastOrderType = orderType;
      completedThisHandoff += result.quantity;
      remainingBatch -= result.quantity;
    }
    if (completedThisHandoff < 1) break;
  }

  const wholesaleQuantity = wholesalePickupQuantity(next, attempts);
  if (wholesaleQuantity > 0) {
    const simpleOrder = shopOrderTypeById("simple_tofu_box");
    const tofuUsed = wholesaleQuantity * simpleOrder.tofuRequired;
    const tipsGained = wholesaleQuantity * 6;
    const shopXpGained = wholesaleQuantity * 3;
    next.shop.tofuStock = safeNonNegativeInteger(next.shop.tofuStock - tofuUsed);
    next.shop.deliveryOrders = clampDeliveryOrderQueue(next.shop.deliveryOrders - wholesaleQuantity);
    next.shop.tips = safeNonNegativeInteger(next.shop.tips + tipsGained);
    next.shop.lifetimeTips = safeNonNegativeInteger(next.shop.lifetimeTips + tipsGained);
    next.shop.shopXP = safeNonNegativeInteger(next.shop.shopXP + shopXpGained);
    next.shop.lifetimeShopXP = safeNonNegativeInteger(next.shop.lifetimeShopXP + shopXpGained);
    next.shop.lifetimeDeliveryOrders = safeNonNegativeInteger(
      next.shop.lifetimeDeliveryOrders + wholesaleQuantity,
    );
    next.shop.wholesalePickupsCompleted = safeNonNegativeInteger(
      next.shop.wholesalePickupsCompleted + 1,
      0,
      1000000,
    );
    totals.completed += wholesaleQuantity;
    totals.wholesaleCompleted = wholesaleQuantity;
    totals.tips += tipsGained;
    totals.shopXP += shopXpGained;
    totals.orderCounts["Wholesale Pickup"] = wholesaleQuantity;
  }

  next.shop.counterService.lastHandoffAt = nowIso;
  if (totals.completed > 0) {
    next.shop.counterService.lifetimeHandoffs = safeNonNegativeInteger(
      next.shop.counterService.lifetimeHandoffs + totals.completed,
      0,
      1000000,
    );
    const message = totals.wholesaleCompleted > 0
      ? `Wholesale Pickup cleared ${formatShopCount(totals.wholesaleCompleted)} waiting orders.`
      : totals.completed === 1 && totals.lastOrderType
      ? `Counter Service: ${totals.lastOrderType.name} complete · +${formatCashCount(totals.tips)} from tips`
        : `Counter Service completed ${formatShopCount(totals.completed)} orders.`;
    next.shop.counterService.lastResult = message;
    next = addLedgerEntry(next, "automation", `${message} +${formatCashCount(totals.tips)} Cash, +${formatShopCount(totals.reputation)} Reputation, +${formatShopCount(totals.shopXP)} Shop XP.`);
    next.recentRewards = [{
      date: nowIso,
      type: "shop_order",
      label: "Counter Service",
      tipsGained: totals.tips,
      reputationGained: totals.reputation,
      shopXpGained: totals.shopXP,
      xpGained: totals.shopXP,
    }, ...next.recentRewards].slice(0, 12);
  } else {
    const status = counterServiceIncomeStatus(next);
    next.shop.counterService.lastResult = status.detail
      ? `${status.text}. ${status.detail}`
      : status.text;
  }
  next.shop.lastShopTickAt = nowIso;
  return {
    gameState: next,
    changed: true,
    completed: totals.completed,
    message: next.shop.counterService.lastResult,
    totals,
  };
}

function counterServiceIncomeStatus(gameState) {
  const state = normalizeGameState(gameState);
  if (!isCounterServiceUnlocked(state)) {
    return {
      active: false,
      text: "+0/sec",
      status: "locked",
      tipsPerMinute: 0,
    };
  }
  if (!state.shop.counterService.running) {
    return {
      active: false,
      text: "Counter Service paused",
      status: "paused",
      tipsPerMinute: 0,
    };
  }
  const ready = readyDeliveryOrders(state.shop);
  const preview = counterServiceBatchPreview(state);
  if (preview.quantity < 1) {
    const neededOrderType = cheapestCounterServiceOrderNeedingStock(state);
    const missingOrders = ready < 1;
    const missingStock = Boolean(
      neededOrderType
      && safeNonNegativeNumber(state.shop.tofuStock, 0, SHOP_MAX_RESOURCE) < neededOrderType.tofuRequired
    );
    const stockDetail = missingStock
      ? counterServiceStockEtaDetail(state, neededOrderType)
      : { detail: "", stockEtaSeconds: null };
    if (missingOrders && missingStock) {
      return {
        active: false,
        text: "Counter Service waiting for Tofu Stock and ready orders",
        status: "waiting_both",
        tipsPerMinute: 0,
        detail: stockDetail.detail,
        stockEtaSeconds: stockDetail.stockEtaSeconds,
        neededTofu: neededOrderType ? neededOrderType.tofuRequired : 0,
      };
    }
    if (missingOrders) {
      return {
        active: false,
        text: "Counter Service waiting for ready orders",
        status: "waiting_orders",
        tipsPerMinute: 0,
      };
    }
    return {
      active: false,
      text: "Counter Service waiting for Tofu Stock",
      status: "waiting_stock",
      tipsPerMinute: 0,
      detail: stockDetail.detail,
      stockEtaSeconds: stockDetail.stockEtaSeconds,
      neededTofu: neededOrderType ? neededOrderType.tofuRequired : 0,
    };
  }
  const interval = counterServiceIntervalSeconds(state);
  const tipsPerMinute = (preview.tips * 60) / interval;
  return {
    active: true,
    text: `Counter Service: +${formatCashRate(tipsPerMinute)}/min when supplied · batch ${formatShopCount(preview.quantity)}`,
    status: "running",
    tipsPerMinute,
    orderType: preview.lastOrderType,
    batchQuantity: preview.quantity,
    batchSize: preview.batchSize,
    orderCounts: preview.orderCounts,
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
  const capHours = offlineProgressCapHours(next);
  const result = applyShopGeneratorTick(next, now, {
    maxSeconds: capHours * 3600,
  });
  next = result.gameState;
  const earnings = result.earnings;
  next.shop.offlineEarnings = {
    tofuStock: Math.max(0, earnings.tofuStock),
    deliveryOrders: earnings.deliveryOrders,
    tips: 0,
    tofuConsumed: earnings.tofuConsumed,
    counterServicePaused: Boolean(isCounterServiceUnlocked(next) && next.shop.counterService.running),
    cappedHours: earnings.cappedHours,
    elapsedHours: earnings.elapsedHours,
    excessHours: earnings.excessHours,
    capHours: earnings.capHours || capHours,
    capped: Boolean(earnings.capped),
    managedCap: capHours >= SHOP_OFFLINE_MANAGED_CAP_HOURS,
    queueFull: Boolean(earnings.queueFull),
  };
  next.shop.lastShopTickAt = nowIso;
  next.shop.lastGeneratorTickAt = next.shop.lastGeneratorTickAt || nowIso;
  next = syncNetWorthMilestones(next).gameState;
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

function shopRenderSignature(gameState) {
  const state = normalizeGameState(gameState);
  const shop = state.shop;
  const rates = getShopGeneratorRates(state);
  const counter = counterServiceIncomeStatus(state);
  return [
    appState.surface,
    appState.shopTab,
    formatShopBalance(shop.tofuStock, shop.generatorCarry && shop.generatorCarry.tofuStock),
    formatShopCount(readyDeliveryOrders(shop)),
    formatShopBalance(shop.tips, shop.generatorCarry && shop.generatorCarry.tips),
    formatShopBalance(shop.reputation, shop.generatorCarry && shop.generatorCarry.reputation),
    formatShopRate(rates.tofuPressPerSecond),
    formatShopRate(rates.prepOrdersPerSecond),
    counter.status,
    counter.text,
    counter.detail || "",
    appState.shopInlineResult || "",
  ].join("|");
}

function renderLiveShopUpdate(gameState, now = new Date(), options = {}) {
  const state = normalizeGameState(gameState);
  appState.liveGameState = state;
  if (appState.surface !== "shop") return false;
  const nowMs = now instanceof Date ? now.getTime() : Date.parse(now) || Date.now();
  const signature = shopRenderSignature(state);
  const due = !appState.lastShopRenderAt
    || nowMs - appState.lastShopRenderAt >= SHOP_RENDER_THROTTLE_MS;
  if (!options.force && !due) {
    return false;
  }
  if (!options.force && signature === appState.lastShopRenderSignature) {
    return false;
  }
  renderTofuShop(state);
  appState.lastShopRenderAt = nowMs;
  appState.lastShopRenderSignature = signature;
  return true;
}

function tickOpenShopGenerators(now = new Date()) {
  if (appState.running || appState.calibrating) return null;
  const state = currentGameState();
  if (!isShopDiscovered(state)) return null;
  const result = applyShopGeneratorTick(state, now, {
    maxSeconds: SHOP_OPEN_TICK_MAX_SECONDS,
  });
  const serviceResult = applyCounterServiceTick(result.gameState, now, {
    maxSeconds: SHOP_OPEN_TICK_MAX_SECONDS,
  });
  const changed = result.changed || serviceResult.changed;
  const nextState = serviceResult.gameState;
  if (changed) {
    appState.liveGameState = nextState;
    if (serviceResult.completed > 0 && serviceResult.message) {
      appState.shopInlineResult = serviceResult.message;
    }
    renderLiveShopUpdate(nextState, now);
    const nowMs = now instanceof Date ? now.getTime() : Date.parse(now) || Date.now();
    if (!appState.lastShopGeneratorSaveAt || nowMs - appState.lastShopGeneratorSaveAt >= SHOP_GENERATOR_SAVE_MS) {
      saveGameState(nextState);
      appState.lastShopGeneratorSaveAt = nowMs;
    }
  }
  return {
    ...result,
    gameState: nextState,
    changed,
    counterService: serviceResult,
  };
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
  return fulfillShopOrders(gameState, 1, { ...options, orderTypeId: options.orderTypeId || "simple_tofu_box" });
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
  if (isDeferredRouteUpgrade(upgrade)) {
    return { ok: false, reason: routeGameplayDeferredReason(), gameState: next };
  }
  const station = shopStationById(upgrade.stationId);
  const counterServiceUpgrade = upgrade.stationId === "counter_service";
  const supplierUpgrade = isSupplierUpgrade(upgrade);
  const managerUpgrade = isManagerDeskUpgrade(upgrade);
  if (!counterServiceUpgrade && !supplierUpgrade && !managerUpgrade && (!station || !stationIsUnlocked(station, next))) {
    return { ok: false, reason: "Station is locked.", gameState: next };
  }
  if (!stationUpgradeIsRevealed(upgrade, next)) {
    return { ok: false, reason: stationUpgradeRevealReason(upgrade, next), gameState: next };
  }
  const current = safeNonNegativeInteger(next.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel);
  if (current >= upgrade.maxLevel) return { ok: false, reason: "Upgrade is already maxed.", gameState: next };
  const costTips = stationUpgradeCostTips(upgrade, current);
  const costReputation = stationUpgradeCostReputation(upgrade, current);
  if (supplierUpgrade) {
    if (next.shop.reputation < costReputation) return { ok: false, reason: "Not enough reputation.", gameState: next };
    next.shop.reputation = safeNonNegativeInteger(next.shop.reputation - costReputation);
    next.shop.shopLevel = getShopLevel(next.shop.reputation);
  } else if (managerUpgrade) {
    if (next.shop.tips < costTips) return { ok: false, reason: "Not enough Cash.", gameState: next };
    if (next.shop.reputation < costReputation) return { ok: false, reason: "Not enough reputation.", gameState: next };
    next.shop.tips = safeNonNegativeInteger(next.shop.tips - costTips);
    next.shop.reputation = safeNonNegativeInteger(next.shop.reputation - costReputation);
    next.shop.shopLevel = getShopLevel(next.shop.reputation);
  } else {
    if (next.shop.tips < costTips) return { ok: false, reason: "Not enough Cash.", gameState: next };
    next.shop.tips = safeNonNegativeInteger(next.shop.tips - costTips);
  }
  next.shop.stationUpgrades[upgrade.id] = current + 1;
  if (!next.stamps.first_upgrade_purchased) {
    next = awardShopStamp(next, "first_upgrade_purchased").gameState;
  }
  next = addLedgerEntry(next, "upgrade", `${upgrade.name} upgraded.`);
  return { ok: true, gameState: next, upgrade, level: current + 1, costTips, costReputation, storyTeaser: null };
}

function validBulkUpgradeCandidates(gameState, affordableOnly = false) {
  const state = normalizeGameState(gameState);
  return visibleRelevantStationUpgrades(state)
    .map((upgrade) => ({
      upgrade,
      status: upgradeAffordabilityStatus(upgrade, state),
    }))
    .filter(({ upgrade, status }) => (
      status.unlocked
      && status.level < upgrade.maxLevel
      && (!affordableOnly || status.canBuy)
      && upgrade.stationId !== "delivery_route"
      && upgrade.stationId !== "regular_customer"
      && upgrade.stationId !== "dispatcher_desk"
      && upgrade.stationId !== "regional_network"
    ));
}

function validBulkStationCandidates(gameState, affordableOnly = false) {
  const state = normalizeGameState(gameState);
  return visibleShopStations(state)
    .map((station) => ({
      station,
      status: stationAffordabilityStatus(station, state),
    }))
    .filter(({ station, status }) => (
      status.unlocked
      && (!affordableOnly || status.canBuy)
      && station.id !== "regular_customer"
      && station.id !== "delivery_route"
      && station.id !== "dispatcher_desk"
      && station.id !== "regional_network"
    ));
}

function buyBulkShopItems(gameState, kind, mode) {
  if (appState.running || appState.calibrating) {
    return {
      ok: false,
      reason: "Shop actions unlock after you finish and park.",
      gameState: normalizeGameState(gameState),
      purchased: 0,
      loopCapped: false,
    };
  }
  let next = normalizeGameState(gameState);
  const originalLedger = next.shop.ledger.slice();
  const purchasedNames = [];
  let loopCapped = false;
  const buyOne = () => {
    if (kind === "upgrades") {
      const candidates = validBulkUpgradeCandidates(next, true)
        .sort((a, b) => (
          (a.status.costTips + a.status.costReputation) - (b.status.costTips + b.status.costReputation)
          || STATION_UPGRADES.indexOf(a.upgrade) - STATION_UPGRADES.indexOf(b.upgrade)
        ));
      const candidate = candidates[0];
      if (!candidate) return false;
      const result = buyStationUpgrade(candidate.upgrade.id, next);
      if (!result.ok) return false;
      next = result.gameState;
      if (result.storyTeaser) appState.shopStoryTeaser = result.storyTeaser;
      purchasedNames.push(result.upgrade.name);
      return true;
    }
    const candidates = validBulkStationCandidates(next, true)
      .sort((a, b) => (
        a.status.cost - b.status.cost
        || SHOP_STATIONS.indexOf(a.station) - SHOP_STATIONS.indexOf(b.station)
      ));
    const candidate = candidates[0];
    if (!candidate) return false;
    const result = buyShopStation(candidate.station.id, next, 1);
    if (!result.ok) return false;
    next = result.gameState;
    purchasedNames.push(result.station.name);
    return true;
  };

  if (mode === "cheapest") {
    buyOne();
  } else {
    for (let index = 0; index < SHOP_BULK_BUY_LOOP_CAP; index += 1) {
      if (!buyOne()) break;
      if (index === SHOP_BULK_BUY_LOOP_CAP - 1) loopCapped = true;
    }
  }

  if (!purchasedNames.length) {
    return {
      ok: false,
      reason: kind === "upgrades" ? "No affordable upgrades right now." : "No affordable stations right now.",
      gameState: next,
      purchased: 0,
      loopCapped,
    };
  }
  const itemLabel = kind === "upgrades" ? "upgrade" : "station";
  const message = mode === "cheapest"
    ? `Bought cheapest ${itemLabel}: ${purchasedNames[0]}.`
    : `Bought ${formatShopCount(purchasedNames.length)} ${itemLabel}${purchasedNames.length === 1 ? "" : "s"}.${loopCapped ? " More affordable items remain." : ""}`;
  if (mode !== "cheapest") {
    const preservedNewEntries = next.shop.ledger.filter((entry) => (
      entry.type !== "purchase"
      && entry.type !== "upgrade"
      && !originalLedger.some((existing) => existing.date === entry.date && existing.text === entry.text)
    ));
    next.shop.ledger = [...preservedNewEntries, ...originalLedger].slice(0, LEDGER_MAX_ENTRIES);
    next = addLedgerEntry(next, kind === "upgrades" ? "upgrade" : "purchase", message);
  }
  return {
    ok: true,
    reason: "",
    gameState: next,
    purchased: purchasedNames.length,
    names: purchasedNames,
    message,
    loopCapped,
  };
}

function routeIsUnlocked(route, gameState) {
  const state = normalizeGameState(gameState);
  if (!routeGameplayEnabled()) return false;
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
  if (!routeGameplayEnabled()) {
    return { ok: false, reason: routeGameplayDeferredReason(), gameState: next };
  }
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
  if (!routeGameplayEnabled()) {
    return { ok: false, reason: "Training drills are deferred with Routes for now.", gameState: next };
  }
  if (next.shop.tips < drill.costTips) return { ok: false, reason: "Not enough Cash.", gameState: next };
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
  if (!routeGameplayEnabled()) {
    return { ok: false, reason: "Old route-garage upgrades are deferred for now.", gameState: next };
  }
  const current = safeNonNegativeInteger(next.shop.garage[upgrade.id], 0, upgrade.maxLevel);
  if (current >= upgrade.maxLevel) return { ok: false, reason: "Garage upgrade is maxed.", gameState: next };
  const costTips = Math.ceil(upgrade.costTips * Math.pow(1.25, current));
  if (next.shop.tips < costTips) return { ok: false, reason: "Not enough Cash.", gameState: next };
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - costTips);
  next.shop.garage[upgrade.id] = current + 1;
  next = addLedgerEntry(next, "garage", `${upgrade.name} upgraded for fictional shop routes.`);
  return { ok: true, gameState: next, upgrade, level: current + 1 };
}

function hireCrewRole(roleId, gameState) {
  let next = normalizeGameState(gameState);
  const role = CREW_ROLES.find((item) => item.id === roleId);
  if (!role) return { ok: false, reason: "Crew role unavailable.", gameState: next };
  if (!routeGameplayEnabled() && DEFERRED_ROUTE_CREW_ROLE_IDS.has(role.id)) {
    return { ok: false, reason: "Route crew roles are deferred for now.", gameState: next };
  }
  const current = safeNonNegativeInteger(next.shop.crew[role.id], 0, 1000);
  const costTips = Math.ceil(role.costTips * Math.pow(1.35, current));
  if (next.shop.tips < costTips) return { ok: false, reason: "Not enough Cash.", gameState: next };
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
  const current = safeNonNegativeInteger(next.shop.spiritGenerators[generator.id], 0, SPIRIT_GENERATOR_MAX_LEVEL);
  if (current >= SPIRIT_GENERATOR_MAX_LEVEL) return { ok: false, reason: `${generator.name} is maxed.`, gameState: next };
  const costTips = Math.ceil(generator.costTips * Math.pow(1.22, current));
  if (next.shop.tips < costTips) return { ok: false, reason: "Not enough Cash.", gameState: next };
  next.shop.tips = safeNonNegativeInteger(next.shop.tips - costTips);
  next.shop.spiritGenerators[generator.id] = current + 1;
  next = addLedgerEntry(next, "spirit", `${generator.name} added to the shop.`);
  return { ok: true, gameState: next, generator, level: current + 1 };
}

function spiritGeneratorNextCost(generator, gameState) {
  const state = normalizeGameState(gameState);
  const current = safeNonNegativeInteger(state.shop.spiritGenerators[generator.id], 0, SPIRIT_GENERATOR_MAX_LEVEL);
  return Math.ceil(generator.costTips * Math.pow(1.22, current));
}

function affordableSpiritGeneratorPurchases(gameState) {
  const state = normalizeGameState(gameState);
  return SPIRIT_GENERATORS.filter((generator) => (
    safeNonNegativeInteger(state.shop.spiritGenerators[generator.id], 0, SPIRIT_GENERATOR_MAX_LEVEL) < SPIRIT_GENERATOR_MAX_LEVEL
    && state.shop.tips >= spiritGeneratorNextCost(generator, state)
  ));
}

function buyAllAffordableSpiritGenerators(gameState, options = {}) {
  let next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Shop Spirit purchases unlock after you finish and park.", gameState: next };
  }
  const beforeRates = getShopGeneratorRates(next);
  let spent = 0;
  let bought = 0;
  const breakdown = {};
  let hitCap = false;
  for (let index = 0; index < SPIRIT_GENERATOR_BULK_PURCHASE_CAP; index += 1) {
    const generator = SPIRIT_GENERATORS.find((item) => (
      safeNonNegativeInteger(next.shop.spiritGenerators[item.id], 0, SPIRIT_GENERATOR_MAX_LEVEL) < SPIRIT_GENERATOR_MAX_LEVEL
      && next.shop.tips >= spiritGeneratorNextCost(item, next)
    ));
    if (!generator) break;
    const current = safeNonNegativeInteger(next.shop.spiritGenerators[generator.id], 0, SPIRIT_GENERATOR_MAX_LEVEL);
    if (current >= SPIRIT_GENERATOR_MAX_LEVEL) break;
    const cost = spiritGeneratorNextCost(generator, next);
    next.shop.tips = safeNonNegativeInteger(next.shop.tips - cost);
    next.shop.spiritGenerators[generator.id] = current + 1;
    spent += cost;
    bought += 1;
    breakdown[generator.name] = safeNonNegativeInteger(breakdown[generator.name] + 1, 1, SPIRIT_GENERATOR_MAX_LEVEL);
    if (index === SPIRIT_GENERATOR_BULK_PURCHASE_CAP - 1) hitCap = true;
  }
  if (bought < 1) {
    const allMaxed = SPIRIT_GENERATORS.every((generator) => (
      safeNonNegativeInteger(next.shop.spiritGenerators[generator.id], 0, SPIRIT_GENERATOR_MAX_LEVEL) >= SPIRIT_GENERATOR_MAX_LEVEL
    ));
    return {
      ok: false,
      reason: allMaxed
        ? "All Spirit generators are maxed."
        : SPIRIT_GENERATORS.length
          ? "No affordable Spirit generators right now."
        : "No Spirit generators unlocked yet.",
      gameState: next,
    };
  }
  const afterRates = getShopGeneratorRates(next);
  const spiritRateGain = Math.max(0, afterRates.shopSpiritPerSecond - beforeRates.shopSpiritPerSecond);
  const breakdownText = Object.entries(breakdown)
    .map(([name, count]) => `${formatShopCount(count)} ${name}`)
    .join(", ");
  const feedback = `Bought ${formatShopCount(bought)} Spirit generator level${bought === 1 ? "" : "s"} · spent ${formatCash(spent)} · Shop Spirit/sec +${formatShopRate(spiritRateGain)}/sec${hitCap ? ". More are still affordable." : ""}`;
  next = addLedgerEntry(next, "spirit", `Bulk Spirit generators: ${breakdownText}.`);
  return { ok: true, gameState: next, bought, spent, spiritRateGain, breakdown, hitCap, feedback };
}

function useShopSpiritBoost(boostId, gameState, options = {}) {
  let next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Shop Spirit waits until the run is parked.", gameState: next };
  }
  const boost = SHOP_SPIRIT_BOOSTS.find((item) => item.id === boostId);
  if (!boost) return { ok: false, reason: "Shop Spirit boost unavailable.", gameState: next };
  if (boost.type === "route_multiplier" && !routeGameplayEnabled()) {
    return { ok: false, reason: routeGameplayDeferredReason(), gameState: next };
  }
  if (boost.type === "route_multiplier" && !hasRouteStoryBeat(next)) {
    return { ok: false, reason: "Route-focused Spirit actions unlock after route story beats.", gameState: next };
  }
  if (boost.durationSeconds && activeTimedEffectFor(next, boost.id)) {
    return { ok: false, reason: `${boost.name} is already active.`, gameState: next };
  }
  if (next.shop.shopSpirit < boost.costSpirit) return { ok: false, reason: "Not enough Shop Spirit.", gameState: next };
  const previewAmount = shopSpiritInstantAmount(boost, next);
  let appliedAmount = previewAmount;
  if (boost.type === "instant_orders") {
    appliedAmount = Math.min(previewAmount, deliveryOrderQueueSpace(next.shop));
    if (appliedAmount < 1) {
      return {
        ok: false,
        reason: "Order queue is full. Warm Counter is not useful right now.",
        gameState: next,
      };
    }
  }
  if (boost.type === "instant_tofu") {
    const currentStock = safeNonNegativeNumber(next.shop.tofuStock, 0, SHOP_MAX_RESOURCE);
    appliedAmount = Math.max(0, Math.min(previewAmount, SHOP_MAX_RESOURCE - currentStock));
    if (appliedAmount < 1) {
      return {
        ok: false,
        reason: "Tofu Stock is already at capacity. Rush Stock is not useful right now.",
        gameState: next,
      };
    }
  }
  next.shop.shopSpirit = safeNonNegativeNumber(next.shop.shopSpirit - boost.costSpirit);
  if (boost.type === "instant_tofu") next.shop.tofuStock = safeNonNegativeInteger(next.shop.tofuStock + appliedAmount);
  if (boost.type === "instant_orders") next.shop.deliveryOrders = clampDeliveryOrderQueue(next.shop.deliveryOrders + appliedAmount);
  if (boost.multiplier) {
    const expiresAt = new Date(Date.now() + boost.durationSeconds * 1000).toISOString();
    next.shop.activeFestivalBoosts = normalizeShopBoosts([
      { id: boost.id, label: boost.name, multiplier: boost.multiplier, expiresAt, source: "shop_spirit" },
      ...next.shop.activeFestivalBoosts,
    ]);
  }
  next = addLedgerEntry(next, "boost", `${boost.name} used while parked.`);
  let feedback = `${boost.name} used.`;
  if (boost.type === "instant_tofu") {
    feedback = `${boost.name} activated: +${formatShopCount(appliedAmount)} Tofu Stock · -${formatShopCost(boost.costSpirit)} Spirit.`;
  } else if (boost.type === "instant_orders") {
    feedback = `${boost.name} activated: +${formatShopCount(appliedAmount)} ready order${appliedAmount === 1 ? "" : "s"} · -${formatShopCost(boost.costSpirit)} Spirit.`;
  } else if (boost.durationSeconds) {
    feedback = `${boost.name} active for ${formatShopCount(Math.ceil(boost.durationSeconds / 60))} min · -${formatShopCost(boost.costSpirit)} Spirit`;
  }
  return { ok: true, gameState: next, boost, amount: appliedAmount, feedback };
}

function useFestivalBoost(boostId, gameState, options = {}) {
  let next = normalizeGameState(gameState);
  if (options.activeDrive || appState.running || appState.calibrating) {
    return { ok: false, reason: "Festival Boosts wait until the run is parked.", gameState: next };
  }
  const boost = FESTIVAL_BOOSTS.find((item) => item.id === boostId);
  if (!boost) return { ok: false, reason: "Festival Boost unavailable.", gameState: next };
  if (boost.type === "route_multiplier" && !routeGameplayEnabled()) {
    return { ok: false, reason: routeGameplayDeferredReason(), gameState: next };
  }
  if (boost.type === "route_multiplier" && !hasRouteStoryBeat(next)) {
    return { ok: false, reason: "Route-focused tokens unlock after route story beats.", gameState: next };
  }
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
    difficulty: "soft_tofu",
    difficultyLabel: CARGO_TYPES.soft_tofu.label,
    cargoType: "soft_tofu",
    cargoLabel: CARGO_TYPES.soft_tofu.label,
    thresholdG: CARGO_TYPES.soft_tofu.thresholdG,
    waterLeft,
    waterSpilled: roundTo(100 - waterLeft, 1),
    cargoCondition: waterLeft,
    rank: rankForWater(waterLeft),
    qualificationStatus: scenario.qualificationStatus,
    qualificationLabel: scenario.qualificationStatus === "qualified" ? "Certified Result" : "Local Result",
    qualificationMessage: "Simulated delivery result for local testing.",
    qualificationReasons: [],
    routeQualificationStatus: "simulated",
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
    lateralSignChanges: Math.round(Number(scenario.turnDensityScore || 0) * 10),
    longitudinalSignChanges: harshInputCount,
    lateralAbsSum: roundTo(Number(scenario.curvatureScore || 0) * 20, 3),
    longitudinalAbsSum: roundTo(Number(scenario.abruptTransitions || 0) * 0.2, 3),
    sampleCount: 60,
    cupTrail: [-0.1, 0.08, -0.16, 0.12, -0.08, 0.06].map((point) => (
      boundedCupTrailPoint(point * (1 + Number(scenario.curvatureScore || 0)))
    )),
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
  summary.driveShape = summarizeDriveShape({
    ...summary,
    roughCount: summary.harshInputCount,
  });
  summary.dailyDeliveryCredit = dailyDeliveryCredit(summary);
  summary.coachRecap = summarizeCoachRecap({
    sampleCount: 60,
    elapsedMs: summary.durationSeconds * 1000,
    longitudinalPeak: 0.18 + harshInputCount * 0.04,
    longitudinalAverageAbs: 0.04 + harshInputCount * 0.01,
    longitudinalJerkPeak: 0.42 + harshInputCount * 0.15,
    longitudinalJerkAverage: 0.18 + harshInputCount * 0.04,
    decelSpikeCount: scenario.harshBraking,
    harshOnsetCount: scenario.harshBraking,
    harshReleaseCount: Math.max(0, scenario.abruptTransitions),
    smoothDecelWindowCount: Math.max(8, 22 - harshInputCount),
    roughTransitionCount: scenario.abruptTransitions,
    comfortJoltCount: harshInputCount,
    lateralJerkPeak: 0.12 + scenario.harshLateral * 0.18,
    lateralJerkAverage: 0.04 + scenario.harshLateral * 0.04,
    lateralSpikeCount: scenario.harshLateral,
    smoothLateralWindowCount: Math.max(10, 24 - scenario.harshLateral),
    roughLateralWindowCount: scenario.harshLateral + scenario.lateralJerk,
    leftRightTransitionCount: Math.round(Number(scenario.turnDensityScore || 0) * 10),
    smoothWindowCount: Math.max(12, 38 - harshInputCount),
    roughWindowCount: harshInputCount,
  }, summary);
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

function defaultCharacterForArt(gameState) {
  const selected = selectedCharacter(gameState);
  if (selected) return selected;
  const mika = CHARACTER_CATALOG.find((character) => character.id === "mika");
  return mika ? { ...mika } : {
    id: "shop_assistant_placeholder",
    name: "Delivery Crew",
    role: "Crew",
    flavor: "A shop assistant portrait will appear here after character art is assigned.",
  };
}

function getCharacterAsset(characterId, slotId) {
  const slot = CHARACTER_ART_SLOTS[slotId] || null;
  const character = CHARACTER_CATALOG.find((candidate) => candidate.id === characterId) || null;
  const manifest = CHARACTER_ART_MANIFEST[characterId] || {};
  const asset = manifest[slotId] || null;
  return {
    slotId,
    characterId,
    slot,
    character,
    src: asset && typeof asset.src === "string" ? asset.src : "",
    alt: asset && typeof asset.alt === "string" ? asset.alt : "",
    status: asset && asset.src ? "assigned" : "placeholder",
    placeholder: slot ? slot.placeholder : "Character art coming soon",
  };
}

function renderCharacterCameo(slotId, gameState = loadGameState(), options = {}) {
  if (appState.running || appState.calibrating || options.activeDrive) return "";
  const slot = CHARACTER_ART_SLOTS[slotId];
  if (!slot) {
    return `
      <div class="nospill-character-cameo is-placeholder" data-character-slot="${escapeHtml(slotId || "unknown")}">
        <div class="nospill-character-art-placeholder" aria-hidden="true">?</div>
        <div>
          <span>Character Slot</span>
          <strong>Character art coming soon</strong>
          <small>Asset slot not yet defined.</small>
        </div>
      </div>
    `;
  }
  let character = options.character || defaultCharacterForArt(gameState);
  let asset = getCharacterAsset(character.id, slotId);
  if (options.preferAssigned && !asset.src) {
    const mika = CHARACTER_CATALOG.find((candidate) => candidate.id === "mika");
    const mikaAsset = mika ? getCharacterAsset(mika.id, slotId) : null;
    if (mika && mikaAsset && mikaAsset.src) {
      character = { ...mika };
      asset = mikaAsset;
    }
  }
  const label = options.label || slot.label;
  const copy = options.copy || character.flavor || slot.purpose;
  const fallbackLabel = asset.src
    ? `${label}: ${character.name} portrait`
    : `${label}: ${asset.placeholder}`;
  const className = [
    "nospill-character-cameo",
    asset.src ? "" : "is-placeholder",
    options.variant ? `is-${options.variant}` : "",
  ].filter(Boolean).join(" ");
  const art = asset.src
    ? `<img
        src="${escapeHtml(asset.src)}"
        alt="${escapeHtml(asset.alt || `${character.name} ${label}`)}"
        loading="lazy"
        onerror="this.hidden = true;"
      />`
    : `<div class="nospill-character-art-placeholder" role="img" aria-label="${escapeHtml(fallbackLabel)}">${escapeHtml(character.name.slice(0, 1))}</div>`;
  return `
    <div class="${className}" data-character-slot="${escapeHtml(slotId)}" data-character-id="${escapeHtml(character.id)}">
      ${art}
      <div>
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(character.name)}</strong>
        <small>${escapeHtml(asset.src ? copy : asset.placeholder)}</small>
      </div>
    </div>
  `;
}

function coachRecapCharacterSlot(summary) {
  const cargoCondition = Number(summary && (summary.cargoCondition ?? summary.waterLeft));
  const hasUsefulData = summary && summary.coachRecap && summary.coachRecap.insufficientData !== true;
  if (hasUsefulData && Number.isFinite(cargoCondition) && cargoCondition >= 0.95) {
    return "coach_recap_expression_pleased";
  }
  return "coach_recap_expression_neutral";
}

function getSceneAsset(layerId) {
  const asset = TOFU_SHOP_SCENE_ASSETS[layerId] || null;
  return {
    layerId,
    src: asset && typeof asset.src === "string" ? asset.src : "",
    label: asset && typeof asset.label === "string" ? asset.label : layerId || "Scene Layer",
    placeholder: asset && typeof asset.placeholder === "string" ? asset.placeholder : "Scene art pending",
    kind: asset && typeof asset.kind === "string" ? asset.kind : "layer",
  };
}

function hasMikaForShopScene(gameState) {
  const state = gameState && gameState.shop ? gameState : normalizeGameState(gameState);
  return state.collection.selectedCharacterId === "mika"
    || state.collection.unlockedCharacterIds.includes("mika");
}

function sceneFulfilledOrderCount(state) {
  return safeNonNegativeInteger(state && state.shop ? state.shop.lifetimeDeliveryOrders : 0, 0, 1000000);
}

function sceneCounterServiceUnlocked(state) {
  return Boolean(state && state.stamps && state.stamps.first_10_orders)
    || sceneFulfilledOrderCount(state) >= 10;
}

function hasCompletedFirstShopLoopForScene(state) {
  return sceneFulfilledOrderCount(state) >= TOFU_SHOP_SCENE_THRESHOLDS.workingOrders;
}

function hasMeaningfulShopUpgradeForScene(state) {
  const upgrades = state.shop.stationUpgrades || {};
  return Boolean(state.stamps.first_upgrade_purchased)
    || safeNonNegativeInteger(upgrades.prep_counter_faster, 0, 100) > 0
    || safeNonNegativeInteger(upgrades.prep_counter_double, 0, 100) > 0
    || safeNonNegativeInteger(upgrades.tofu_press_faster, 0, 100) > 0
    || safeNonNegativeInteger(upgrades.tofu_press_double, 0, 100) > 0;
}

function hasSustainedOrderProgressForScene(state) {
  return sceneFulfilledOrderCount(state) >= TOFU_SHOP_SCENE_THRESHOLDS.upgradedOrders
    || Boolean(state.stamps.first_10_orders)
    || Boolean(state.stamps.first_family_tofu_tray)
    || Boolean(state.stamps.first_100_tips)
    || safeNonNegativeNumber(state.shop.lifetimeTips, 0, SHOP_MAX_RESOURCE) >= TOFU_SHOP_SCENE_THRESHOLDS.upgradedLifetimeTips;
}

function hasEstablishedShopForScene(state) {
  const deliveryShelfCount = safeNonNegativeInteger(state.shop.stations.delivery_shelf, 0, 100000);
  const shopSignCount = safeNonNegativeInteger(state.shop.stations.shop_sign, 0, 100000);
  return sceneFulfilledOrderCount(state) >= TOFU_SHOP_SCENE_THRESHOLDS.establishedOrders
    || safeNonNegativeInteger(state.shop.stationUpgrades.counter_service_register, 0, 1) > 0
    || safeNonNegativeInteger(state.shop.shopLevel, 0, 100000) >= 10
    || (
      deliveryShelfCount >= TOFU_SHOP_SCENE_THRESHOLDS.establishedDeliveryShelves
      && shopSignCount >= TOFU_SHOP_SCENE_THRESHOLDS.establishedShopSigns
    );
}

function hasEarnedCoveredCarTeaserForScene(state) {
  return coveredCarTeaserUnlocked(state);
}

function getTofuShopSceneState(gameState = loadGameState()) {
  const state = normalizeGameState(gameState);
  const prep = orderPrepProgress(state);
  const deliveryShelfCount = safeNonNegativeInteger(state.shop.stations.delivery_shelf, 0, 100000);
  const shopSignCount = safeNonNegativeInteger(state.shop.stations.shop_sign, 0, 100000);
  const prepUpgradeLevel = safeNonNegativeInteger(state.shop.stationUpgrades.prep_counter_faster, 0, 100)
    + safeNonNegativeInteger(state.shop.stationUpgrades.prep_counter_double, 0, 100);
  const recentShopOrder = recentShopReward(state);
  const hasWorkingShop = hasCompletedFirstShopLoopForScene(state);
  const hasUpgradedShop = hasMeaningfulShopUpgradeForScene(state)
    || hasSustainedOrderProgressForScene(state);
  const hasEstablishedShop = hasEstablishedShopForScene(state);
  const coveredCarVisible = hasEarnedCoveredCarTeaserForScene(state);
  const sceneId = coveredCarVisible
    ? "scene_busy_shop_with_covered_car"
    : hasEstablishedShop
      ? "scene_busy_shop_established"
      : hasUpgradedShop
        ? "scene_tiny_shop_upgraded"
        : hasWorkingShop
          ? "scene_tiny_shop_working"
          : "scene_tiny_shop_empty";
  return {
    activeDrive: appState.running || appState.calibrating,
    reducedMotion: prefersReducedMotion(),
    sceneId,
    readyOrders: prep.ready,
    prepRunning: prep.running,
    stockShortage: Boolean(prep.waitingForTofu),
    prepBottleneck: isOrderPrepBottleneck(state),
    recentlyFulfilled: Boolean(recentShopOrder || appState.shopInlineResult),
    counterServiceUnlocked: isCounterServiceUnlocked(state),
    counterServiceRunning: Boolean(state.shop.counterService.running),
    mikaVisible: hasMikaForShopScene(state),
    coveredCarVisible,
    milestones: {
      hasTofuPress: safeNonNegativeInteger(state.shop.stations.tofu_press, 0, 100000) > 0,
      hasPrepCounter: safeNonNegativeInteger(state.shop.stations.prep_counter, 0, 100000) > 0
        || state.shop.lifetimeDeliveryOrders > 0,
      hasPrepUpgrade: prepUpgradeLevel > 0 || Boolean(state.stamps.first_upgrade_purchased),
      hasDeliveryShelf: deliveryShelfCount > 0,
      hasExpandedDeliveryShelf: deliveryShelfCount >= 5,
      hasShopSign: shopSignCount > 0,
      hasUpgradedShopSign: shopSignCount >= 5 || state.shop.reputation >= 100,
    },
  };
}

function getTofuShopSceneLayers(sceneState) {
  if (!sceneState || sceneState.activeDrive) return [];
  return [{
    id: sceneState.sceneId || "scene_tiny_shop_empty",
    visible: true,
    activity: sceneState.counterServiceRunning
      ? "running"
      : sceneState.recentlyFulfilled
        ? "fulfilled"
        : sceneState.readyOrders > 0
          ? "ready"
          : "static",
    animated: Boolean(sceneState.readyOrders > 0 || sceneState.recentlyFulfilled || sceneState.counterServiceRunning),
    fullScene: true,
  }];
}

function renderSceneLayer(layer, options = {}) {
  if (!layer || !layer.id) return "";
  const asset = getSceneAsset(layer.id);
  const animated = Boolean(layer.animated && !options.reducedMotion);
  const art = asset.src
    ? `<img
        src="${escapeHtml(asset.src)}"
        alt=""
        aria-hidden="true"
        loading="eager"
        decoding="async"
      />`
    : `<div class="nospill-shop-scene-placeholder" role="img" aria-label="${escapeHtml(`${asset.label}: ${asset.placeholder}`)}">${escapeHtml(asset.placeholder)}</div>`;
  return `
    <div
      class="nospill-shop-scene-image ${animated ? "is-animated" : "is-static"}"
      data-scene-id="${escapeHtml(layer.id)}"
      data-scene-activity="${escapeHtml(layer.activity || "static")}"
      data-scene-kind="${escapeHtml(asset.kind)}"
    >
      ${art}
    </div>
  `;
}

function renderTofuShopLivingScene(gameState = loadGameState()) {
  const state = normalizeGameState(gameState);
  const sceneState = getTofuShopSceneState(state);
  if (sceneState.activeDrive) return "";
  const sceneLayer = getTofuShopSceneLayers(sceneState)[0];
  const sceneAsset = getSceneAsset(sceneLayer ? sceneLayer.id : sceneState.sceneId);
  const sceneHtml = renderSceneLayer(sceneLayer, {
    gameState: state,
    reducedMotion: sceneState.reducedMotion,
  });
  const flavor = sceneState.coveredCarVisible
    ? "Behind the shop, an old car waits under a cover."
    : "";
  return `
    <section class="nospill-shop-scene ${sceneState.reducedMotion ? "is-reduced-motion" : "is-motion-ok"}" aria-label="Tofu Shop living scene">
      <div class="nospill-shop-scene-head">
        <span>Tofu Shop</span>
        <strong>${escapeHtml(sceneAsset.label)}</strong>
      </div>
      <div class="nospill-shop-scene-stage" aria-label="Parked visual shop scene. Decorative only; use the controls below to play.">
        ${sceneHtml}
      </div>
      ${flavor ? `<p class="nospill-shop-scene-flavor">${escapeHtml(flavor)}</p>` : ""}
    </section>
  `;
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

function hiddenShirtUnlockSource(session, stamps = []) {
  if (!isQualifiedSession(session) || session.simulated || session.mode === "simulated") return "";
  const cargo = calculateCargoCondition(session);
  const stampSet = new Set(Array.isArray(stamps) ? stamps : []);
  const routeContextUnlocked = [
    "winding_perfect_pour",
    "stop_and_go_smooth_pour",
    "route_context_perfect_pour",
  ].some((id) => stampSet.has(id));
  if (cargo >= 99.95) return "certified_perfect_pour";
  if (routeContextUnlocked) return "route_context_achievement";
  return "";
}

function hiddenStickerUnlockSource(session) {
  if (!isQualifiedSession(session) || session.simulated || session.mode === "simulated") return "";
  return "certified_result";
}

function selectedPenguinCharacterId(gameState) {
  const state = normalizeGameState(gameState);
  const selectedId = state.collection.selectedCharacterId;
  if (!PENGUIN_CHARACTER_IDS.has(selectedId)) return "";
  if (!state.collection.unlockedCharacterIds.includes(selectedId)) return "";
  return selectedId;
}

function hiddenPenguinShirtUnlockSource(session, gameState) {
  if (!isQualifiedSession(session) || session.simulated || session.mode === "simulated") return "";
  return selectedPenguinCharacterId(gameState) ? "certified_penguin_result" : "";
}

function merchUnlockSource(itemId, gameState, session, stamps = []) {
  if (itemId === HIDDEN_STICKER_ID) return hiddenStickerUnlockSource(session);
  if (itemId === HIDDEN_PENGUIN_STICKER_ID) return hiddenPenguinShirtUnlockSource(session, gameState);
  if (itemId === HIDDEN_SHIRT_ID) return hiddenShirtUnlockSource(session, stamps);
  if (itemId === HIDDEN_PENGUIN_SHIRT_ID) return hiddenPenguinShirtUnlockSource(session, gameState);
  return "";
}

function applyMerchUnlock(gameState, itemId, session, stamps = []) {
  const next = normalizeGameState(gameState);
  const definition = HIDDEN_MERCH_UNLOCKS[itemId];
  if (!definition) return { gameState: next, unlockedThisRun: false, source: "", itemId: "" };
  const current = next.merchUnlocks[itemId];
  if (current && current.unlocked) {
    return { gameState: next, unlockedThisRun: false, source: current.source || "", itemId };
  }
  const source = merchUnlockSource(itemId, next, session, stamps);
  if (!source) return { gameState: next, unlockedThisRun: false, source: "", itemId };
  next.merchUnlocks[itemId] = {
    unlocked: true,
    unlockedAt: typeof session.date === "string" ? session.date : new Date().toISOString(),
    source,
    revealSeen: false,
  };
  return { gameState: next, unlockedThisRun: true, source, itemId };
}

function applyHiddenShirtUnlock(gameState, session, stamps = []) {
  return applyMerchUnlock(gameState, HIDDEN_SHIRT_ID, session, stamps);
}

function applyHiddenMerchUnlocks(gameState, session, stamps = []) {
  let next = normalizeGameState(gameState);
  const unlocks = Object.keys(HIDDEN_MERCH_UNLOCKS).map((itemId) => {
    const result = applyMerchUnlock(next, itemId, session, stamps);
    next = result.gameState;
    return result;
  });
  return { gameState: next, unlocks };
}

function acknowledgeMerchUnlockReveal(itemId, gameState = currentGameState()) {
  const next = normalizeGameState(gameState);
  const definition = HIDDEN_MERCH_UNLOCKS[itemId];
  const item = definition ? next.merchUnlocks[itemId] : null;
  if (!definition || !item || !item.unlocked) return { ok: false, reason: "Hidden shirt is still locked.", gameState: next };
  next.merchUnlocks[itemId] = { ...item, revealSeen: true };
  return { ok: true, gameState: next };
}

function acknowledgeHiddenShirtReveal(gameState = currentGameState()) {
  return acknowledgeMerchUnlockReveal(HIDDEN_SHIRT_ID, gameState);
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
    damageSource = "Local result";
    nextFocus = "Start another Cup Test when parked and ready.";
    message = "Local Result complete. Certified results can add route context when data allows.";
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
  routeContextAchievementIds(enrichedSession).forEach(addStamp);

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
  const hiddenMerchUnlockResult = applyHiddenMerchUnlocks(nextState, enrichedSession, stamps);
  nextState = hiddenMerchUnlockResult.gameState;
  const hiddenShirtUnlock = hiddenMerchUnlockResult.unlocks.find((unlock) => unlock.itemId === HIDDEN_SHIRT_ID)
    || { unlockedThisRun: false, source: "", itemId: HIDDEN_SHIRT_ID };
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
    hiddenShirtUnlock: {
      unlockedThisRun: hiddenShirtUnlock.unlockedThisRun,
      source: hiddenShirtUnlock.source,
      itemId: HIDDEN_SHIRT_ID,
      label: HIDDEN_SHIRT_NAME,
    },
    hiddenMerchUnlocks: hiddenMerchUnlockResult.unlocks
      .filter((unlock) => unlock.itemId)
      .map((unlock) => ({
        unlockedThisRun: unlock.unlockedThisRun,
        source: unlock.source,
        itemId: unlock.itemId,
        label: HIDDEN_MERCH_UNLOCKS[unlock.itemId].name,
      })),
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
    status: resultStatusLabel(session),
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

function sanitizeResultStoryCaption(value, maxLength = RESULT_STORY_CAPTION_MAX_LENGTH) {
  const cleaned = String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return Array.from(cleaned).slice(0, maxLength).join("");
}

function sanitizeBuilderNote(value, maxLength = BUILDER_NOTE_MAX_LENGTH) {
  const cleaned = String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return Array.from(cleaned).slice(0, maxLength).join("");
}

function stableFlavorIndex(seed, count) {
  if (!count) return 0;
  const text = String(seed || "");
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
  }
  return Math.abs(hash) % count;
}

function failureFlavorSeverity(summary = {}) {
  if (summary.simulated) return "simulated";
  if (!isQualifiedSession(summary)) return "practice";
  const cargoCondition = Number(summary.cargoCondition ?? summary.waterLeft ?? 0);
  if (cargoCondition >= 92) return "great";
  if (cargoCondition >= 75) return "steady";
  if (cargoCondition >= 35) return "messy";
  return "spilled";
}

function failureFlavorForSession(summary = {}) {
  const severity = failureFlavorSeverity(summary);
  const cargoLabel = summary.cargoLabel || cargoTypeProfile(summary.cargoType || summary.difficulty).label;
  const options = {
    great: [
      {
        line: "The tofu arrived with dignity.",
        hint: "Gentle changes kept the cargo calm.",
      },
      {
        line: "The cargo made it. The vibes are approved.",
        hint: "Smooth hands kept the cup happier.",
      },
    ],
    steady: [
      {
        line: "Mostly steady. Slightly dramatic.",
        hint: "The cargo prefers smoother transitions.",
      },
      {
        line: "The cargo made it. The vibes are under review.",
        hint: "Gentle changes kept the cup happier.",
      },
    ],
    messy: [
      {
        line: "The tofu filed a complaint.",
        hint: "The cargo prefers smoother transitions.",
      },
      {
        line: "A heroic delivery. A dramatic slosh. A learning opportunity.",
        hint: "Less sudden motion usually helps the tofu settle.",
      },
    ],
    spilled: [
      {
        line: "The cup has entered witness protection.",
        hint: "Try a calmer start next time.",
      },
      {
        line: "The tofu is requesting smoother paperwork next time.",
        hint: "The cargo prefers smoother transitions.",
      },
    ],
    practice: [
      {
        line: "Local cargo is here to learn, not judge.",
        hint: "Less sudden motion usually helps the tofu settle.",
      },
      {
        line: "Mika says the cargo survived, but emotionally? Unclear.",
        hint: "The cargo prefers smoother transitions.",
      },
    ],
    simulated: [
      {
        line: "Simulator tofu remains extremely brave.",
        hint: "Test-mode cargo keeps the story local.",
      },
      {
        line: "The test cargo is pretending this is normal.",
        hint: "Simulated results stay clearly labeled.",
      },
    ],
  };
  const choices = options[severity] || options.steady;
  const seed = [
    severity,
    cargoLabel,
    summary.cargoCondition ?? summary.waterLeft,
    summary.rank || displayRankForSession(summary),
    summary.driveShape || summarizeDriveShape(summary),
    summary.mode || "",
    summary.harshInputCount || 0,
  ].join("|");
  const choice = choices[stableFlavorIndex(seed, choices.length)] || choices[0];
  return {
    title: "Cargo Commentary",
    line: choice.line,
    hint: choice.hint,
    severity,
  };
}

function getDeviceMotionConstructor() {
  if (typeof window === "undefined") return null;
  return window.DeviceMotionEvent || null;
}

function hasDeviceMotionSupport() {
  return Boolean(getDeviceMotionConstructor());
}

const MOTION_SUPPORT_MESSAGES = {
  supported: "Tap Start Cup Test to enable motion.",
  permissionNeeded: "Motion permission needed. Tap Start Cup Test to allow motion access.",
  permissionDenied: "Motion permission was denied. Enable Motion & Orientation access in browser settings, then reload.",
  permissionError: "Motion permission could not be requested. Check browser Motion settings, then try Start Cup Test again.",
  insecure: "Motion sensors require HTTPS. Open Tofu Driver over HTTPS to use Don't Spill the Cup.",
  unsupported: "This browser does not appear to support motion sensors. Try Safari or Chrome on a mobile device.",
  noData: "Motion permission was granted, but no sensor data has arrived yet. Keep the phone still, check browser Motion settings, or reload.",
};

function motionSecureContextStatus() {
  if (typeof window === "undefined") return { secure: true };
  if (window.isSecureContext !== false) return { secure: true };
  const location = window.location || {};
  const hostname = String(location.hostname || "").toLowerCase();
  const protocol = String(location.protocol || "");
  const localHost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  return { secure: protocol === "https:" || localHost };
}

function motionSupportStatus() {
  const secure = motionSecureContextStatus();
  if (!secure.secure) {
    return { state: "insecure", canAttemptStart: false, message: MOTION_SUPPORT_MESSAGES.insecure };
  }
  const DeviceMotion = getDeviceMotionConstructor();
  if (!DeviceMotion) {
    return { state: "unsupported", canAttemptStart: false, message: MOTION_SUPPORT_MESSAGES.unsupported };
  }
  if (typeof DeviceMotion.requestPermission === "function") {
    return { state: "permission-needed", canAttemptStart: true, message: MOTION_SUPPORT_MESSAGES.permissionNeeded };
  }
  return { state: "supported", canAttemptStart: true, message: MOTION_SUPPORT_MESSAGES.supported };
}

async function requestMotionPermission() {
  const DeviceMotion = getDeviceMotionConstructor();
  if (!DeviceMotion) {
    return { ok: false, state: "unsupported", reason: MOTION_SUPPORT_MESSAGES.unsupported };
  }
  if (typeof DeviceMotion.requestPermission === "function") {
    try {
      const response = await DeviceMotion.requestPermission();
      if (response !== "granted") {
        trackEvent("tofu_driver_motion_permission_denied", { mode: modeAnalyticsLabel(appState.mode) });
        return { ok: false, state: "permission-denied", reason: MOTION_SUPPORT_MESSAGES.permissionDenied };
      }
    } catch (_) {
      trackEvent("tofu_driver_motion_permission_denied", { mode: modeAnalyticsLabel(appState.mode) });
      return { ok: false, state: "permission-error", reason: MOTION_SUPPORT_MESSAGES.permissionError };
    }
  }
  return { ok: true, state: "granted", reason: "" };
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

function recordMotionStats({ lateralG, longitudinalG, totalG, jerk, nowMs, deltaSeconds = 0 }) {
  appState.motion.samples += 1;
  appState.motion.peakG = Math.max(appState.motion.peakG, totalG);
  appState.motion.peakJerk = Math.max(appState.motion.peakJerk, jerk);
  appState.motion.lateralAbsSum += Math.abs(lateralG);
  appState.motion.longitudinalAbsSum += Math.abs(longitudinalG);

  const lateralSign = motionSign(lateralG);
  if (
    lateralSign
    && appState.motion.lastLateralSign
    && lateralSign !== appState.motion.lastLateralSign
  ) {
    appState.motion.lateralSignChanges += 1;
  }
  if (lateralSign) appState.motion.lastLateralSign = lateralSign;

  const longitudinalSign = motionSign(longitudinalG);
  if (
    longitudinalSign
    && appState.motion.lastLongitudinalSign
    && longitudinalSign !== appState.motion.lastLongitudinalSign
  ) {
    appState.motion.longitudinalSignChanges += 1;
  }
  if (longitudinalSign) appState.motion.lastLongitudinalSign = longitudinalSign;
  if (appState.motion.samples % 6 === 0) {
    appState.motion.cupTrail = appendCupTrailPoint(
      appState.motion.cupTrail,
      lateralG / Math.max(cargoTypeProfile(appState.difficulty).thresholdG, 0.05),
    );
  }
  appState.motion.coach = updateCoachAccumulator(appState.motion.coach, {
    lateralG,
    longitudinalG,
    totalG,
    jerk,
    lateralJerk: Math.abs(lateralG - Number(appState.motion.previousCoachLateralG || 0)),
    elapsedMs: Math.max(0, Number(deltaSeconds || 0) * 1000),
  });
  appState.motion.previousCoachLateralG = lateralG;

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
  recordMotionStats({ lateralG, longitudinalG, totalG, jerk, nowMs, deltaSeconds });
  recordOrientationStability(event);

  const thresholdG = cargoTypeProfile(appState.difficulty).thresholdG;
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
  trackCupTestStartedAnalytics({ mode: appState.mode, simulator: false });
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
  showView("landing");
  if (elements.setupFlow) elements.setupFlow.classList.remove("is-hidden");
  setLandingStatus(MOTION_SUPPORT_MESSAGES.noData);
}

function startLocationWatch() {
  appState.geoStatus = "pending";
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    appState.geoStatus = "unavailable";
    setRunStatus("Location is unavailable. This run can continue as a Local Result.");
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
    setRunStatus("Location could not start. This run can continue as a Local Result.");
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
    trackEvent("tofu_driver_geolocation_permission_denied", { mode: "qualified" });
    setRunStatus("Location permission was denied. This run can continue as a Local Result.");
    return;
  }
  appState.geoStatus = "unavailable";
  setRunStatus("Location signal is unavailable. This run can continue as a Local Result.");
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
  const thresholdG = cargoTypeProfile(appState.difficulty).thresholdG;
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

function contextBucket(value, lowThreshold, highThreshold) {
  const numeric = Number(value || 0);
  if (numeric >= highThreshold) return "High";
  if (numeric >= lowThreshold) return "Medium";
  return "Low";
}

function signalQualityForRoute(route) {
  if (!route || Number(route.validSegmentCount || 0) < 6) return "Insufficient";
  if (
    Number(route.gpsAccuracyPercent || 0) >= 85
    && Number(route.validSegmentCount || 0) >= 18
    && Number(route.impossibleJumpPercent || 0) <= 5
  ) {
    return "Strong";
  }
  if (
    Number(route.gpsAccuracyPercent || 0) >= 70
    && Number(route.validSegmentCount || 0) >= 6
    && Number(route.impossibleJumpPercent || 0) <= QUALIFICATION_RULES.maxImpossibleGpsJumpPercent
  ) {
    return "Usable";
  }
  return "Insufficient";
}

function routeContextLabelFor(score, turnDensity, stopStartTexture) {
  if (score >= 75) return "Technical";
  if (turnDensity === "High") return "Winding";
  if (stopStartTexture === "High") return "Stop-and-Go";
  if (score >= 35) return "Rolling";
  return "Calm";
}

function buildQualifiedRouteContext(summary = {}, routeSamples = []) {
  if (
    resultStatusForSession(summary) !== "certified"
    || summary.simulated
    || summary.mode === "simulated"
  ) {
    return {
      qualifiedRouteContext: false,
      status: "unavailable",
      message: "Route-context achievements require a Certified Result with enough route data.",
    };
  }
  const route = analyzeRoute(routeSamples);
  const signalQuality = signalQualityForRoute(route);
  if (signalQuality === "Insufficient") {
    return {
      qualifiedRouteContext: false,
      status: "insufficient",
      signalQuality,
      message: "Route Context: Not enough qualified route data.",
    };
  }

  const turnDensity = contextBucket(route.turnDensityScore, 0.28, 0.58);
  const curvature = contextBucket(route.curvatureScore, 0.25, 0.55);
  const movingRatio = Number(route.percentSamplesAboveMinSpeed || 0);
  const stopStartScore = clamp((100 - movingRatio) / 60, 0, 1);
  const stopStartTexture = contextBucket(stopStartScore, 0.35, 0.65);
  const routeContextScore = Math.round(clamp(
    route.turnDensityScore * 38 + route.curvatureScore * 38 + stopStartScore * 24,
    0,
    100,
  ));
  const routeContextLabel = routeContextLabelFor(routeContextScore, turnDensity, stopStartTexture);

  return {
    qualifiedRouteContext: true,
    status: "usable",
    routeContextScore,
    routeContextLabel,
    turnDensity,
    curvature,
    stopStartTexture,
    signalQuality,
  };
}

function projectRouteSample(sample, origin, originLatRadians) {
  const milesPerDegreeLat = 69;
  const milesPerDegreeLon = 69 * Math.cos(originLatRadians);
  return {
    x: (Number(sample.lon) - origin.lon) * milesPerDegreeLon,
    y: (Number(sample.lat) - origin.lat) * milesPerDegreeLat,
  };
}

function normalizedRouteOutlineForShare(routeSamples = [], summary = {}) {
  if (summary.simulated || summary.mode === "simulated") return [];
  const coordinateSamples = (Array.isArray(routeSamples) ? routeSamples : []).filter(
    (sample) =>
      Number.isFinite(sample.lat)
      && Number.isFinite(sample.lon)
      && Number(sample.accuracy || 9999) <= 50,
  );
  if (coordinateSamples.length < 8) return [];

  const maxPoints = 80;
  const step = Math.max(1, Math.ceil(coordinateSamples.length / maxPoints));
  const sampled = coordinateSamples.filter((_, index) => index % step === 0).slice(0, maxPoints);
  const origin = { lat: sampled[0].lat, lon: sampled[0].lon };
  const originLatRadians = toRadians(origin.lat);
  const projected = sampled.map((sample) => projectRouteSample(sample, origin, originLatRadians));
  const xs = projected.map((point) => point.x);
  const ys = projected.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = Math.max(maxX - minX, 0.0001);
  const spanY = Math.max(maxY - minY, 0.0001);
  const span = Math.max(spanX, spanY);
  const roughEvents = safeNonNegativeInteger(summary.roughCount, 0, 1000000)
    + safeNonNegativeInteger(summary.harshInputCount, 0, 1000000)
    + safeNonNegativeInteger(summary.transitionRoughnessCount, 0, 1000000);
  const cargo = safeNonNegativeNumber(summary.cargoCondition ?? summary.waterLeft, 0, 100);
  const roughnessPressure = clamp((100 - cargo) / 55 + roughEvents / Math.max(12, sampled.length), 0, 1);
  return projected.map((point, index) => ({
    x: roundTo(clamp(0.5 + ((point.x - minX) - spanX / 2) / span * 0.82, 0, 1), 3),
    y: roundTo(clamp(0.5 - ((point.y - minY) - spanY / 2) / span * 0.82, 0, 1), 3),
    smoothness: routeOutlineSmoothnessAt(index, sampled.length, roughnessPressure),
  }));
}

function routeOutlineSmoothnessAt(index, total, roughnessPressure) {
  const pressure = clamp(Number(roughnessPressure || 0), 0, 1);
  if (pressure < 0.18) return "steady";
  const phase = total > 1 ? index / (total - 1) : 0;
  const wave = Math.abs(Math.sin((phase * Math.PI * 3.5) + pressure * Math.PI));
  if (pressure > 0.62 && wave > 0.52) return "messy";
  if (pressure > 0.34 && wave > 0.62) return "messy";
  if (pressure > 0.22 && wave > 0.38) return "mixed";
  return "steady";
}

function routeOutlineShareAvailable(summary = {}) {
  return Boolean(
    summary
    && !summary.simulated
    && summary.mode !== "simulated"
    && Array.isArray(summary.normalizedRouteOutline)
    && summary.normalizedRouteOutline.length >= 2,
  );
}

function activeShareTrailMode(summary = appState.lastSummary) {
  if (routeOutlineShareAvailable(summary) && !appState.shareTrailModeUserSelected) {
    return SHARE_CARD_TRAIL_MODES.routeOutline;
  }
  if (
    appState.shareTrailMode === SHARE_CARD_TRAIL_MODES.routeOutline
    && routeOutlineShareAvailable(summary)
  ) {
    return SHARE_CARD_TRAIL_MODES.routeOutline;
  }
  return SHARE_CARD_TRAIL_MODES.abstract;
}

function routeContextAchievementIds(summary = {}) {
  const context = summary.routeContext || {};
  if (
    resultStatusForSession(summary) !== "certified"
    || summary.simulated
    || summary.mode === "simulated"
    || context.status !== "usable"
    || !["Usable", "Strong"].includes(context.signalQuality)
  ) {
    return [];
  }
  const cargo = calculateCargoCondition(summary);
  const achievements = [];
  if (
    cargo >= 95
    && (
      context.turnDensity === "High"
      || ["Winding", "Technical"].includes(context.routeContextLabel)
    )
  ) {
    achievements.push("winding_perfect_pour");
  }
  if (cargo >= 90 && context.stopStartTexture === "High") {
    achievements.push("stop_and_go_smooth_pour");
  }
  if (
    cargo >= 95
    && Number(context.routeContextScore || 0) >= 75
    && context.signalQuality === "Strong"
  ) {
    achievements.push("route_context_perfect_pour");
  }
  return achievements;
}

function qualificationForRoute({ durationSeconds, route, motion, geoStatus }) {
  const reasons = [];
  if (geoStatus === "denied") reasons.push("Certification location permission was denied.");
  if (geoStatus === "unavailable") reasons.push("Certification location was unavailable.");
  if (durationSeconds < QUALIFICATION_RULES.minDurationSeconds) {
    reasons.push("Run duration was below the certification minimum.");
  }
  if (!route || route.totalDistanceMiles < QUALIFICATION_RULES.minDistanceMiles) {
    reasons.push("Verified distance was below the certification minimum.");
  }
  if (!route || route.movingDurationSeconds < QUALIFICATION_RULES.minMovingDurationSeconds) {
    reasons.push("Movement validation was too short.");
  }
  if (!route || route.medianMovingSpeedMph < QUALIFICATION_RULES.minMedianMovingSpeedMph) {
    reasons.push("Movement validation was below the certification threshold.");
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
      label: "Local Result",
      message: "Local Result saved. Route-context achievements need location and enough route data.",
      reasons,
    };
  }
  return {
    status: "qualified",
    label: "Certified Result",
    message: "Certified Result complete. Route context can unlock certified route-context milestones.",
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
        label: "Local Result",
        message: roundedDurationSeconds < PRACTICE_VALID_MIN_SECONDS
          ? "Local Result saved. Complete a longer delivery to earn stamps and shop progress."
          : "Local Result complete. Motion sensors stayed local.",
        reasons: [],
      };
  const waterLeft = roundTo(appState.waterLeft, 1);
  const waterSpilled = roundTo(100 - waterLeft, 1);
  const routeData = route || {};
  const cargo = cargoTypeProfile(appState.difficulty);
  const summary = {
    date: endedAt.toISOString(),
    mode: appState.mode,
    difficulty: cargo.id,
    difficultyLabel: cargo.label,
    cargoType: cargo.id,
    cargoLabel: cargo.label,
    thresholdG: cargo.thresholdG,
    waterLeft,
    waterSpilled,
    rank: rankForWater(waterLeft),
    durationSeconds: roundedDurationSeconds,
    qualificationStatus: qualification.status,
    qualificationLabel: qualification.label,
    qualificationMessage: qualification.message,
    qualificationReasons: qualification.reasons,
    routeQualificationStatus: routeQualificationStatusForSummary(qualification, appState.geoStatus, false),
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
    lateralSignChanges: appState.motion.lateralSignChanges,
    longitudinalSignChanges: appState.motion.longitudinalSignChanges,
    lateralAbsSum: roundTo(appState.motion.lateralAbsSum, 3),
    longitudinalAbsSum: roundTo(appState.motion.longitudinalAbsSum, 3),
    cupTrail: Array.isArray(appState.motion.cupTrail)
      ? appState.motion.cupTrail.map(boundedCupTrailPoint).slice(0, 36)
      : [],
    sampleCount: appState.motion.samples,
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
  summary.routeContext = buildQualifiedRouteContext(summary, appState.routeSamples);
  summary.normalizedRouteOutline = normalizedRouteOutlineForShare(appState.routeSamples, summary);
  summary.routeType = classifyRouteType(summary);
  summary.cargoCondition = calculateCargoCondition(summary);
  summary.driveShape = summarizeDriveShape({
    ...summary,
    roughCount: summary.harshInputCount,
  });
  summary.dailyDeliveryCredit = dailyDeliveryCredit(summary);
  summary.coachRecap = summarizeCoachRecap(appState.motion.coach, summary);
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
  if (value === "shop" || value === "garage") return "shop";
  if (value === "crew") return "crew";
  return "cup-test";
}

function surfaceHash(surface) {
  if (surface === "crew") return "#/crew";
  return surface === "cup-test" ? "#/cup-test" : "#/shop";
}

function renderSurfaceNavigation(gameState = null) {
  const activeDrive = appState.running || appState.calibrating;
  if (elements.surfaceNavButtons) {
    elements.surfaceNavButtons.forEach((button) => {
      const active = button.dataset.surfaceTarget === appState.surface;
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
        ? "Tofu Garage"
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
      ? "A parked idle-management game. Start with tofu orders, then grow toward the garage."
      : crewSurface
        ? "Crew collection is coming later. Build the Tofu Garage and complete Cup Test deliveries to discover future crew stories."
        : "Keep the cup steady. Drive smoothly. Build the Tofu Garage while parked.";
  }
  if (elements.brandShelfSafety) {
    elements.brandShelfSafety.textContent = shopSurface
      ? "Run the Tofu Shop while parked. Take Don't Spill the Cup when you're ready for a certified smooth-delivery boost."
      : crewSurface
        ? "Crew and sound choices never change real-world driving score."
        : "Start while parked. Certification is automatic when permissions and signal quality allow.";
  }
  if (elements.brandPrimaryCta) {
    elements.brandPrimaryCta.textContent = crewSurface
      ? "Tofu Garage"
      : shopSurface
        ? "Continue Tofu Garage"
        : "Take the Cup Test";
    elements.brandPrimaryCta.dataset.brandAction = crewSurface ? "shop" : shopSurface ? "shop" : "cup-test";
  }
  if (elements.brandSecondaryCta) {
    elements.brandSecondaryCta.textContent = crewSurface
      ? "Take Don't Spill the Cup"
      : shopSurface
        ? "Take Don't Spill the Cup"
        : "Tofu Garage";
    elements.brandSecondaryCta.dataset.brandAction = crewSurface || shopSurface ? "cup-test" : "shop";
  }
}

function scrollAndFocusParkedNode(node, options = {}) {
  if (!node || (node.classList && node.classList.contains && node.classList.contains("is-hidden"))) return;
  const behavior = prefersReducedMotion() ? "auto" : "smooth";
  if (typeof node.scrollIntoView === "function") {
    node.scrollIntoView({ behavior, block: options.block || "start" });
  }
  if (options.focus && typeof node.focus === "function") {
    node.focus({ preventScroll: true });
  }
}

function surfaceScrollTarget(surface, options = {}) {
  if (surface === "shop") {
    if (options.target === "actions" && elements.tofuGarageActions) return elements.tofuGarageActions;
    return elements.tofuShopSection || elements.landingView;
  }
  if (surface === "crew") return elements.collectionSection || elements.landingView;
  if (surface === "cup-test") return elements.setupFlow || elements.landingView;
  return elements.landingView;
}

function setAppSurface(surface = "cup-test", options = {}) {
  const nextSurface = surface === "cup-test" || surface === "crew" ? surface : "shop";
  const previousSurface = appState.surface;
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
  if (options.scroll) {
    scrollAndFocusParkedNode(surfaceScrollTarget(nextSurface, options), {
      block: options.scrollBlock || "start",
      focus: Boolean(options.focus),
    });
  }
  if (options.trackNav && previousSurface !== nextSurface) {
    trackEvent("tofu_driver_nav_clicked", { target_view: analyticsViewName(nextSurface) });
  }
  trackRouteView(nextSurface);
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
  const support = motionSupportStatus();
  if (!support.canAttemptStart) {
    if (elements.mountStatus) {
      elements.mountStatus.textContent = support.message;
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
  const thresholdG = cargoTypeProfile(appState.difficulty).thresholdG;
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

function recentRewardDisplayLabel(reward) {
  if (!reward || typeof reward !== "object") return "Reward";
  if (typeof reward.routeType === "string" && reward.routeType.trim()) return reward.routeType.trim();
  if (typeof reward.label === "string" && reward.label.trim()) return reward.label.trim();
  if (reward.type === "shop_order") return "Shop Order";
  if (reward.type === "delivery") return "Cup Test";
  return "Reward";
}

function renderDeliveryLog(gameState = loadGameState()) {
  const state = normalizeGameState(gameState);
  const mission = getDailyDelivery(new Date());
  const progress = levelProgress(state.totalXP);
  const passport = deliveryPassportSummary(state);
  const recentReward = (state.recentRewards || []).find((reward) => reward && reward.type === "delivery") || null;
  if (elements.driverLevel) elements.driverLevel.textContent = `Level ${progress.level}`;
  if (elements.driverLicense) {
    elements.driverLicense.textContent = `Level ${progress.level} · ${getDriverLicense(progress.level)}`;
  }
  if (elements.dailyCargo) elements.dailyCargo.textContent = mission.cargo;
  if (elements.dailyGoal) {
    elements.dailyGoal.textContent = `${mission.description} ${mission.focus}: ${mission.goal}`;
  }
  if (elements.dailyReward) elements.dailyReward.textContent = mission.reward;
  if (elements.driverTotalXP) elements.driverTotalXP.textContent = `${formatShopCount(state.totalXP)} Driver XP`;
  if (elements.driverNextXP) {
    elements.driverNextXP.textContent = `${formatShopCount(progress.currentXP)}/${formatShopCount(progress.nextXP)} Driver XP`;
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
      ? `Recent Driver Reward: +${formatShopCount(recentReward.xpGained)} Driver XP · ${recentRewardDisplayLabel(recentReward)}`
      : "No driver rewards yet";
  }
}

function stampLockLabel(gameState, stampId) {
  const state = normalizeGameState(gameState);
  const label = STAMP_LABELS[stampId] || stampId;
  return `${label} ${state.stamps[stampId] ? "unlocked" : "locked"}`;
}

function nextShopStep(gameState) {
  const state = normalizeGameState(gameState);
  const nextUpgrade = visibleRelevantStationUpgrades(state).find(
    (upgrade) => safeNonNegativeInteger(state.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel)
      < upgrade.maxLevel,
  );
  if (!nextUpgrade) return "Complete a delivery to build the shop.";
  const currentLevel = safeNonNegativeInteger(
    state.shop.stationUpgrades[nextUpgrade.id],
    0,
    nextUpgrade.maxLevel,
  );
  if (isSupplierUpgrade(nextUpgrade)) {
    const cost = stationUpgradeCostReputation(nextUpgrade, currentLevel);
    return `${nextUpgrade.name}: ${formatShopCost(cost)} Reputation`;
  }
  const cost = stationUpgradeCostTips(nextUpgrade, currentLevel);
  return `${nextUpgrade.name}: ${formatCash(cost)}`;
}

function nextSupplierUpgrade(gameState, requireAffordable = false) {
  const state = normalizeGameState(gameState);
  return visibleRelevantStationUpgrades(state).find((upgrade) => {
    if (!isSupplierUpgrade(upgrade)) return false;
    const currentLevel = safeNonNegativeInteger(state.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel);
    if (currentLevel >= upgrade.maxLevel) return false;
    if (!requireAffordable) return true;
    return state.shop.reputation >= stationUpgradeCostReputation(upgrade, currentLevel);
  }) || null;
}

function nextManagerDeskUpgrade(gameState, requireAffordable = false) {
  const state = normalizeGameState(gameState);
  return visibleRelevantStationUpgrades(state).find((upgrade) => {
    if (!isManagerDeskUpgrade(upgrade)) return false;
    const currentLevel = safeNonNegativeInteger(state.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel);
    if (currentLevel >= upgrade.maxLevel) return false;
    if (!requireAffordable) return true;
    return state.shop.tips >= stationUpgradeCostTips(upgrade, currentLevel)
      && state.shop.reputation >= stationUpgradeCostReputation(upgrade, currentLevel);
  }) || null;
}

function affordableShopUpgrade(gameState) {
  const state = normalizeGameState(gameState);
  return visibleRelevantStationUpgrades(state).find((upgrade) => {
    const currentLevel = safeNonNegativeInteger(state.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel);
    if (currentLevel >= upgrade.maxLevel) return false;
    if (isSupplierUpgrade(upgrade)) {
      return state.shop.reputation >= stationUpgradeCostReputation(upgrade, currentLevel);
    }
    if (isManagerDeskUpgrade(upgrade)) {
      return state.shop.tips >= stationUpgradeCostTips(upgrade, currentLevel)
        && state.shop.reputation >= stationUpgradeCostReputation(upgrade, currentLevel);
    }
    const station = shopStationById(upgrade.stationId);
    if (upgrade.stationId === "counter_service") {
      if (!isCounterServiceUnlocked(state)) return false;
    } else if (!station || !stationIsUnlocked(station, state)) {
      return false;
    }
    const cost = stationUpgradeCostTips(upgrade, currentLevel);
    return state.shop.tips >= cost;
  }) || null;
}

function affordableShopStation(gameState, stationId = "") {
  const state = normalizeGameState(gameState);
  return SHOP_STATIONS.find((station) => {
    if (stationId && station.id !== stationId) return false;
    if (!stationIsUnlocked(station, state)) return false;
    const cost = stationCost(station, safeNonNegativeInteger(state.shop.stations[station.id], 0, 100000));
    return state.shop.tips >= cost && state.shop.prepSlots >= station.prepSlotCost;
  }) || null;
}

function nextCarManagementAction(gameState) {
  const state = normalizeGameState(gameState);
  if (!carManagementUnlocked(state)) return null;
  const active = activeCarAssignmentStatus(state);
  if (active.assignment) {
    return {
      type: active.ready ? "collect_car_assignment" : "car_assignment_active",
      title: active.ready ? "Next: Collect Assignment Result" : "Next: Assignment in Progress",
      copy: active.ready
        ? "The completed build returned with rewards."
        : `${active.assignment.title} is in progress. Collect rewards when the car returns.`,
      buttonLabel: active.ready ? "Collect Assignment" : "Assignment Running",
      disabled: !active.ready,
      carAssignmentId: active.assignment.id,
    };
  }
  if (allCarAssignmentsCompletedOnce(state)) {
    const secondBay = secondBayStatus(state);
    if (secondBay.acquired) {
      return {
        type: "car_management_target",
        title: "Next: Second Project Car Acquired",
        copy: "Second car build tracks come in a future garage pass.",
        buttonLabel: "View Car Management",
        disabled: false,
      };
    }
    if (secondBay.bayOpened) {
      return {
        type: secondBay.canAcquire ? "acquire_second_project_car" : "car_management_target",
        title: secondBay.canAcquire ? "Next: Acquire Second Project Car" : "Next: Grow Cash for Second Project Car",
        copy: "Start the next project in the second bay.",
        buttonLabel: secondBay.canAcquire ? "Acquire Second Project Car" : "View Car Management",
        disabled: false,
      };
    }
    if (secondBay.reputation < SECOND_BAY_OPEN_REPUTATION_COST) {
      return {
        type: "car_management_target",
        title: "Next: Grow Garage Reputation",
        copy: "Second Bay unlocks at 250 Garage Reputation.",
        buttonLabel: "View Car Management",
        disabled: false,
      };
    }
    if (secondBay.canOpen) {
      return {
        type: "open_second_bay",
        title: "Next: Open Second Bay",
        copy: "Expand the garage for the next project car.",
        buttonLabel: "Open Second Bay",
        disabled: false,
      };
    }
    return {
      type: "car_management_target",
      title: "Next: Grow Cash for Second Bay",
      copy: "Garage Reputation is ready. Save Cash to open the second bay.",
      buttonLabel: "View Car Management",
      disabled: false,
    };
  }
  const assignment = nextAvailableCarAssignment(state);
  if (!assignment) {
    return {
      type: "car_management_target",
      title: "Next: Car Management",
      copy: "Send the completed build to its first parked assignment.",
      buttonLabel: "View Car Management",
      disabled: false,
    };
  }
  const economics = carAssignmentEconomics(assignment, state);
  const affordable = cashBalance(state) >= economics.entryCost;
  return {
    type: affordable ? "start_car_assignment" : "car_management_target",
    title: affordable ? `Next: ${assignment.title}` : `Next: Grow Cash for ${assignment.title}`,
    copy: assignment.id === "showcase_rotation"
      ? "The first completed build is ready to manage."
      : "The next parked Car Management assignment is ready.",
    buttonLabel: affordable ? assignment.buttonLabel : "View Car Management",
    disabled: false,
    carAssignmentId: assignment.id,
  };
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
  const prep = orderPrepProgress(state);
  const runway = tofuStockRunway(state);
  const bestOrder = bestFulfillableShopOrderType(state);
  const prepCounterStation = affordableShopStation(state, "prep_counter");
  const tofuPressStation = affordableShopStation(state, "tofu_press");
  const deliveryShelfStation = affordableShopStation(state, "delivery_shelf");
  const shopSignStation = affordableShopStation(state, "shop_sign");
  const tidyPackaging = shopUpgradeById("prep_counter_faster");
  const tidyLevel = safeNonNegativeInteger(state.shop.stationUpgrades.prep_counter_faster, 0, tidyPackaging ? tidyPackaging.maxLevel : 0);
  const tidyCost = tidyPackaging ? stationUpgradeCostTips(tidyPackaging, tidyLevel) : 0;
  const tidyAffordable = Boolean(
    tidyPackaging
    && stationUpgradeIsRevealed(tidyPackaging, state)
    && tidyLevel < tidyPackaging.maxLevel
    && state.shop.tips >= tidyCost
  );
  const counterIncome = counterServiceIncomeStatus(state);
  const readyPileup = prep.ready >= 3;
  const counterUpgrade = visibleRelevantStationUpgrades(state).find((candidate) => (
    candidate.stationId === "counter_service"
    && safeNonNegativeInteger(state.shop.stationUpgrades[candidate.id], 0, candidate.maxLevel) < candidate.maxLevel
    && state.shop.tips >= stationUpgradeCostTips(candidate, state.shop.stationUpgrades[candidate.id])
  ));
  const supplierUpgrade = nextSupplierUpgrade(state, true);
  const supplierCandidate = nextSupplierUpgrade(state, false);
  const managerUpgrade = nextManagerDeskUpgrade(state, true);
  const managerCandidate = nextManagerDeskUpgrade(state, false);
  const contractCandidate = nextCounterContract(state);
  const contractStatus = contractCandidate ? counterContractStatus(contractCandidate, state) : null;
  const stockMilestone = nextVisibleStationMilestone(state, { stationIds: ["tofu_press"] });
  const prepMilestone = nextVisibleStationMilestone(state, { stationIds: ["prep_counter", "delivery_shelf"] });
  const reputationMilestone = nextVisibleStationMilestone(state, { stationIds: ["shop_sign"] });
  const rushStockBoost = SHOP_SPIRIT_BOOSTS.find((boost) => boost.id === "rush_prep");
  const warmCounterBoost = SHOP_SPIRIT_BOOSTS.find((boost) => boost.id === "warm_counter");
  const spiritWalletFull = state.shop.shopSpirit >= Math.max(1, getShopSpiritMax(state.shop) * 0.9);
  const fulfilled = fulfilledShopOrderCount(state);
  const idleStarterActive = shopUnlocked
    && fulfilled < 1
    && state.shop.counterService.running;
  if (activeDrive) {
    return {
      type: "active_drive",
      title: "Cup Test in Progress",
      copy: "Keep your eyes on the road. Shop actions unlock after you finish and park.",
      buttonLabel: "Driving",
      disabled: true,
    };
  }
  const earlyCarManagementAction = nextCarManagementAction(state);
  if (
    shopUnlocked
    && earlyCarManagementAction
    && counterIncome.status !== "waiting_stock"
    && readyDeliveryOrders(state.shop) < deliveryOrderQueueCapacity()
    && !(isCounterServiceUnlocked(state) && !state.shop.counterService.running && readyPileup)
  ) {
    return earlyCarManagementAction;
  }
  if (shopUnlocked && counterIncome.status === "waiting_stock") {
    if (
      Number.isFinite(counterIncome.stockEtaSeconds)
      && counterIncome.stockEtaSeconds <= 90
      && state.shop.reputation < 10000
      && state.shop.shopLevel < 25
    ) {
      return {
        type: "wait_counter_stock",
        title: "Next: Wait for Tofu Stock",
        copy: `${counterIncome.detail} Buy Tofu Press or Steady Pressing when Cash is available.`,
        buttonLabel: "Stock Recovering",
        disabled: true,
      };
    }
    if (supplierUpgrade) {
      return {
        type: "buy_upgrade",
        title: `Next: Buy ${supplierUpgrade.name}`,
        copy: "Counter Service is waiting for Tofu Stock. Use Reputation to secure more tofu supply for managed-shop orders.",
        buttonLabel: "View Upgrades",
        disabled: false,
        upgradeId: supplierUpgrade.id,
      };
    }
    if (
      rushStockBoost
      && spiritWalletFull
      && !spiritBoostDisabledReason(rushStockBoost, state)
    ) {
      return {
        type: "use_spirit_boost",
        title: "Next: Use Rush Stock",
        copy: "Your Spirit wallet is full and Counter Service is waiting for Tofu Stock. Spend Spirit for an immediate stock refill.",
        buttonLabel: "Use Rush Stock",
        disabled: false,
        spiritBoostId: "rush_prep",
      };
    }
    if (supplierCandidate) {
      const currentLevel = safeNonNegativeInteger(state.shop.stationUpgrades[supplierCandidate.id], 0, supplierCandidate.maxLevel);
      const needed = Math.max(0, stationUpgradeCostReputation(supplierCandidate, currentLevel) - state.shop.reputation);
      return {
        type: "buy_upgrade",
        title: `Next: Save for ${supplierCandidate.name}`,
        copy: `Counter Service is waiting for Tofu Stock. Supplier Contracts are the managed-shop supply answer; need ${formatShopCost(needed)} more Reputation.`,
        buttonLabel: "View Upgrades",
        disabled: false,
        upgradeId: supplierCandidate.id,
      };
    }
    if (upgrade && upgrade.stationId === "tofu_press") {
      return {
        type: "buy_upgrade",
        title: `Next: Buy ${upgrade.name}`,
        copy: "Counter Service is ready, but Tofu Stock is the bottleneck. Improve the press so automatic pickups can continue; Pack Tofu is only a backup.",
        buttonLabel: "View Upgrades",
        disabled: false,
        upgradeId: upgrade.id,
      };
    }
    if (tofuPressStation) {
      return {
        type: "buy_station",
        title: "Next: Buy Tofu Press",
        copy: stockMilestone && stockMilestone.close
            ? `Counter Service is waiting for Tofu Stock. You are close to ${formatShopCount(stockMilestone.milestone.threshold)} Tofu Presses for ${stockMilestone.milestone.reward}.`
            : "Tofu Stock is low and Counter Service is waiting. A Tofu Press helps keep larger orders supplied.",
        buttonLabel: "View Production",
        stationId: "tofu_press",
        disabled: false,
      };
    }
    if (state.shop.shopLevel >= 25 || state.shop.reputation >= 10000 || readyDeliveryOrders(state.shop) >= 1000) {
      return {
        type: "wait_prep_counter",
        title: "Next: Improve Tofu Supply",
        copy: "Counter Service is waiting for Tofu Stock. At this scale, use Supplier Contracts, press upgrades, or Rush Stock instead of manual packing.",
        buttonLabel: "View Upgrades",
        disabled: true,
      };
    }
    return {
      type: "buy_station",
      title: "Next: Improve Tofu Supply",
      copy: "Tofu Stock is low and Counter Service is waiting. Let the press and supply upgrades solve this; manual Pack Tofu is only an emergency backup.",
      buttonLabel: "View Production",
      stationId: "tofu_press",
      disabled: false,
    };
  }
  if (
    shopUnlocked
    && counterIncome.status === "waiting_orders"
    && warmCounterBoost
    && spiritWalletFull
    && deliveryOrderQueueSpace(state.shop) > 0
    && !spiritBoostDisabledReason(warmCounterBoost, state)
  ) {
    return {
      type: "use_spirit_boost",
      title: "Next: Use Warm Counter",
      copy: "Your Spirit wallet is full and Counter Service is waiting for ready orders. Warm Counter adds a short burst of order prep.",
      buttonLabel: "Use Warm Counter",
      disabled: false,
      spiritBoostId: "warm_counter",
    };
  }
  if (idleStarterActive) {
    if (runway.isLow && tofuPressStation) {
      return {
        type: "buy_station",
        title: "Next: Buy Tofu Press",
        copy: "Tofu Stock is low. Add press output so the starter shop can keep preparing orders automatically.",
        buttonLabel: "View Production",
        stationId: "tofu_press",
        disabled: false,
      };
    }
    if (tofuPressStation) {
      return {
        type: "buy_station",
        title: "Next: Buy Tofu Press",
        copy: "The starter counter is already handling orders. Add press output when Cash arrives so the shop stays supplied.",
        buttonLabel: "View Production",
        stationId: "tofu_press",
        disabled: false,
      };
    }
    return {
      type: "watch_starter_shop",
      title: "Next: Watch the first order complete",
      copy: "The starter shop runs by itself: Tofu Press makes stock, Prep Counter prepares orders, and Counter Service handles the first pickup.",
      buttonLabel: "View Counter Service",
      disabled: false,
    };
  }
  if (shopUnlocked && readyDeliveryOrders(state.shop) >= deliveryOrderQueueCapacity()) {
    const counterRunning = isCounterServiceUnlocked(state) && state.shop.counterService.running;
    const counterPaused = isCounterServiceUnlocked(state) && !state.shop.counterService.running;
    const contractAvailable = Boolean(contractCandidate && contractStatus && contractStatus.unlocked);
    const counterCopy = counterPaused
      ? "The order queue is full. Start Counter Service to turn ready orders into Cash."
      : counterRunning && counterUpgrade
        ? "The order queue is full. A visible Counter Service upgrade can improve throughput."
      : contractAvailable
        ? "The order queue is full. Counter Service is already clearing it. Bigger contracts can convert ready orders into Cash faster."
      : counterRunning
          ? "The order queue is full. Counter Service is already clearing it."
          : "The order queue is full. Use the visible shop controls to turn ready orders into Cash.";
    return {
      type: "queue_full",
      title: "Next: Clear the Order Queue",
      copy: counterCopy,
      buttonLabel: counterPaused ? "Start Counter Service" : "Queue Full",
      disabled: false,
    };
  }
  if (shopUnlocked && isCounterServiceUnlocked(state) && !state.shop.counterService.running && readyPileup) {
    return {
      type: "start_counter_service",
      title: "Next: Start Counter Service",
      copy: "Ready Orders are piling up. Counter Service can handle prepared order pickups while the shop is open.",
      buttonLabel: "Start Counter Service",
      disabled: false,
    };
  }
  if (shopUnlocked && state.shop.counterService.running && readyPileup && runway.isHealthy && counterUpgrade) {
    return {
      type: "buy_upgrade",
      title: `Next: Buy ${counterUpgrade.name}`,
      copy: "Ready Orders are piling up. Upgrade Counter Service so automatic pickups keep pace.",
      buttonLabel: "View Upgrades",
      disabled: false,
      upgradeId: counterUpgrade.id,
    };
  }
  if (shopUnlocked && isCounterServiceUnlocked(state) && !state.shop.counterService.running) {
    return {
      type: "start_counter_service",
      title: "Next: Start Counter Service",
      copy: "The shop is idle-first. Restart Counter Service so prepared order pickups happen automatically.",
      buttonLabel: "Start Counter Service",
      disabled: false,
    };
  }
  if (
    shopUnlocked
    && coveredCarTeaserUnlocked(state)
    && !coveredCarTeaserSeen(state)
    && !lowTofuStock
    && !upgrade
    && !tofuPressStation
    && !prepCounterStation
    && !deliveryShelfStation
    && !shopSignStation
  ) {
    return {
      type: "covered_car_teaser",
      title: "Next: Look Behind the Shop",
      copy: "The shop is steady enough to reveal what it has been funding. The first build comes later.",
      buttonLabel: "Look Behind the Shop",
      disabled: false,
    };
  }
  const showcaseAction = showcasePrepStatus(state);
  if (
    shopUnlocked
    && showcaseAction.unlocked
    && !showcaseAction.prepared
    && !nextDreamBuildWheelsWork(state)
    && !nextDreamBuildExhaustWork(state)
    && !nextDreamBuildSuspensionWork(state)
    && !nextDreamBuildTiresWork(state)
    && !nextDreamBuildBrakesWork(state)
    && !nextDreamBuildInductionWork(state)
    && !nextDreamBuildDrivetrainWork(state)
    && !nextDreamBuildAeroWork(state)
    && !nextDreamBuildFinalWork(state)
    && counterIncome.status !== "waiting_stock"
    && readyDeliveryOrders(state.shop) < deliveryOrderQueueCapacity()
    && !(isCounterServiceUnlocked(state) && !state.shop.counterService.running && readyPileup)
  ) {
    const ready = showcaseAction.affordable;
    return {
      type: ready ? "prepare_showcase" : "showcase_prep_target",
      title: ready ? "Next: Prepare Showcase Display" : "Next: Save Cash for Showcase Prep",
      copy: ready
        ? "Turn the covered build into a polished showcase moment. Not faster. Smoother."
        : "The project is getting attention. Prepare it for its first display.",
      buttonLabel: ready ? "Prepare Showcase Display" : "View Showcase Prep",
      disabled: false,
    };
  }
  const sponsorAction = sponsorInquiryStatus(state);
  if (
    shopUnlocked
    && sponsorAction.unlocked
    && !sponsorAction.accepted
    && !nextDreamBuildWheelsWork(state)
    && !nextDreamBuildExhaustWork(state)
    && !nextDreamBuildSuspensionWork(state)
    && !nextDreamBuildTiresWork(state)
    && !nextDreamBuildBrakesWork(state)
    && !nextDreamBuildInductionWork(state)
    && !nextDreamBuildDrivetrainWork(state)
    && !nextDreamBuildAeroWork(state)
    && !nextDreamBuildFinalWork(state)
    && counterIncome.status !== "waiting_stock"
    && readyDeliveryOrders(state.shop) < deliveryOrderQueueCapacity()
    && !(isCounterServiceUnlocked(state) && !state.shop.counterService.running && readyPileup)
  ) {
    return {
      type: "accept_sponsor_inquiry",
      title: "Next: Accept Sponsor Inquiry",
      copy: "The first display build is starting to attract business.",
      buttonLabel: "Accept Sponsor Inquiry",
      disabled: false,
    };
  }
  const carManagementAction = nextCarManagementAction(state);
  if (
    shopUnlocked
    && carManagementAction
    && counterIncome.status !== "waiting_stock"
    && readyDeliveryOrders(state.shop) < deliveryOrderQueueCapacity()
    && !(isCounterServiceUnlocked(state) && !state.shop.counterService.running && readyPileup)
  ) {
    return carManagementAction;
  }
  if (
    shopUnlocked
    && prep.ready > 0
    && bestOrder
    && state.shop.counterService.running
    && readyDeliveryOrders(state.shop) < deliveryOrderQueueCapacity()
  ) {
    return {
      type: "wait_counter_service",
      title: "Next: Let Counter Service work",
      copy: "Prepared orders are ready. Counter Service will hand them off automatically; buy upgrades when Cash arrives.",
      buttonLabel: "Counter Service Running",
      disabled: true,
    };
  }
  if (shopUnlocked && prep.ready < 1 && tidyAffordable && runway.isHealthy) {
    return {
      type: "buy_upgrade",
      title: "Next: Buy Tidy Packaging",
      copy: "Prep Counter is the bottleneck. Tidy Packaging makes the next order arrive faster.",
      buttonLabel: "View Upgrades",
      disabled: false,
      upgradeId: "prep_counter_faster",
    };
  }
  if (shopUnlocked && prep.ready < 1 && prepCounterStation && runway.isHealthy) {
    return {
      type: "buy_station",
      title: "Next: Buy Prep Counter",
      copy: prepMilestone && prepMilestone.stationId === "prep_counter" && prepMilestone.close
        ? `Tofu Stock is healthy. You are close to ${formatShopCount(prepMilestone.milestone.threshold)} Prep Counters for ${prepMilestone.milestone.reward}.`
        : "Tofu Stock is healthy. More Prep Counters prepare Delivery Orders faster.",
      buttonLabel: "View Production",
      stationId: "prep_counter",
      disabled: false,
    };
  }
  if (shopUnlocked && prep.ready < 1 && deliveryShelfStation && runway.isHealthy) {
    return {
      type: "buy_station",
      title: "Next: Buy Delivery Shelf",
      copy: prepMilestone && prepMilestone.stationId === "delivery_shelf" && prepMilestone.close
        ? `The counter is growing. You are close to ${formatShopCount(prepMilestone.milestone.threshold)} Delivery Shelves for ${prepMilestone.milestone.reward}.`
        : "The counter is growing. Delivery Shelf boosts Prep Counter throughput.",
      buttonLabel: "View Production",
      stationId: "delivery_shelf",
      disabled: false,
    };
  }
  if (shopUnlocked && runway.isLow && tofuPressStation) {
    return {
      type: "buy_station",
      title: "Next: Buy Tofu Press",
      copy: stockMilestone && stockMilestone.close
        ? `Tofu Stock is low. You are close to ${formatShopCount(stockMilestone.milestone.threshold)} Tofu Presses for ${stockMilestone.milestone.reward}.`
        : "Tofu Stock is low. A Tofu Press helps keep Prep Counter supplied.",
      buttonLabel: "View Production",
      stationId: "tofu_press",
      disabled: false,
    };
  }
  if (upgrade && !(runway.isHealthy && prep.ready < 1 && prep.running)) {
    return {
      type: "buy_upgrade",
      title: "Next: Buy an Upgrade",
      copy: "Upgrade the shop to improve parked production.",
      buttonLabel: "View Upgrades",
      disabled: false,
      upgradeId: upgrade.id,
    };
  }
  if (shopUnlocked && shopSignStation) {
    return {
      type: "buy_station",
      title: "Next: Buy Shop Sign",
      copy: reputationMilestone && reputationMilestone.close
        ? `The shop is becoming known. You are close to ${formatShopCount(reputationMilestone.milestone.threshold)} Shop Signs for ${reputationMilestone.milestone.reward}.`
        : "The shop is becoming known. Shop Sign boosts Reputation from orders.",
      buttonLabel: "View Production",
      stationId: "shop_sign",
      disabled: false,
    };
  }
  if (shopUnlocked && dreamInvestmentTargetVisible(state) && !urgentShopPriorityBeforeDreamInvestment(state)) {
    const target = dreamInvestmentTargetProgress(state);
    if (target.purchased) {
      const work = nextDreamBuildWheelsWork(state);
      if (work) {
        return {
          type: "buy_dream_wheels_work",
          title: work.action === "polish-wheels" ? "Next: Polish Wheels" : "Next: Balance Fitment",
          copy: work.action === "polish-wheels"
            ? "Invest Cash into the first Dream Build detail."
            : "The covered build is starting to feel intentional.",
          buttonLabel: work.buttonLabel,
          disabled: false,
        };
      }
      const exhaustWork = nextDreamBuildExhaustWork(state);
      if (exhaustWork) {
        if (exhaustWork.action === "buy-exhaust") {
          const ready = cashBalance(state) >= exhaustWork.cost;
          return {
            type: ready ? "buy_dream_exhaust" : "dream_investment_target",
            title: ready ? "Next: Buy Exhaust" : "Next: Grow Cash for Exhaust",
            copy: ready
              ? "Add a cleaner garage detail. This is story/status work, not speed."
              : "The shop is funding the next Dream Build part.",
            buttonLabel: ready ? "Buy Exhaust" : "View Exhaust Fund",
            disabled: false,
          };
        }
        const ready = cashBalance(state) >= exhaustWork.cost;
        const growCopy = exhaustWork.action === "showcase-finish"
          ? "Finish the exhaust track when the shop can fund it."
          : exhaustWork.action === "heat-wrap"
            ? "Protect the exhaust setup when the shop can fund it."
            : `Refine the exhaust note when the shop can fund ${exhaustWork.title}.`;
        const readyCopy = exhaustWork.action === "showcase-finish"
          ? "Complete the final exhaust details."
          : exhaustWork.action === "heat-wrap"
            ? "Make the exhaust setup look cared for, not rushed."
            : exhaustWork.copy;
        return {
          type: ready ? "buy_dream_exhaust_work" : "dream_investment_target",
          title: ready
            ? `Next: ${exhaustWork.buttonLabel}`
            : `Next: Grow Cash for ${exhaustWork.title}`,
          copy: ready ? readyCopy : growCopy,
          buttonLabel: exhaustWork.buttonLabel,
          disabled: false,
        };
      }
      const suspensionWork = nextDreamBuildSuspensionWork(state);
      if (suspensionWork) {
        const ready = cashBalance(state) >= suspensionWork.cost;
        return {
          type: ready ? "buy_dream_suspension_work" : "dream_investment_target",
          title: ready ? `Next: ${suspensionWork.buttonLabel}` : `Next: Grow Cash for ${suspensionWork.title}`,
          copy: ready ? suspensionWork.copy : `${suspensionWork.title} is the next Suspension work when the shop can fund it.`,
          buttonLabel: suspensionWork.buttonLabel,
          disabled: false,
        };
      }
      const tiresWork = nextDreamBuildTiresWork(state);
      if (tiresWork) {
        const ready = cashBalance(state) >= tiresWork.cost;
        return {
          type: ready ? "buy_dream_tires_work" : "dream_investment_target",
          title: ready ? `Next: ${tiresWork.buttonLabel}` : `Next: Grow Cash for ${tiresWork.title}`,
          copy: ready ? tiresWork.copy : `${tiresWork.title} is the next Tires & Rubber work when the shop can fund it.`,
          buttonLabel: tiresWork.buttonLabel,
          disabled: false,
        };
      }
      const inductionWork = nextDreamBuildInductionWork(state);
      if (inductionWork) {
        const ready = cashBalance(state) >= inductionWork.cost;
        return {
          type: ready ? "buy_dream_induction_work" : "dream_investment_target",
          title: ready ? `Next: ${inductionWork.buttonLabel}` : `Next: Grow Cash for ${inductionWork.title}`,
          copy: ready ? inductionWork.copy : `${inductionWork.title} is the next Induction & Cooling work when the shop can fund it.`,
          buttonLabel: inductionWork.buttonLabel,
          disabled: false,
        };
      }
      const drivetrainWork = nextDreamBuildDrivetrainWork(state);
      if (drivetrainWork) {
        const ready = cashBalance(state) >= drivetrainWork.cost;
        return {
          type: ready ? "buy_dream_drivetrain_work" : "dream_investment_target",
          title: ready ? `Next: ${drivetrainWork.buttonLabel}` : `Next: Grow Cash for ${drivetrainWork.title}`,
          copy: ready ? drivetrainWork.copy : `${drivetrainWork.title} is the next Drivetrain & Transmission work when the shop can fund it.`,
          buttonLabel: drivetrainWork.buttonLabel,
          disabled: false,
        };
      }
      const aeroWork = nextDreamBuildAeroWork(state);
      if (aeroWork) {
        const ready = cashBalance(state) >= aeroWork.cost;
        return {
          type: ready ? "buy_dream_aero_work" : "dream_investment_target",
          title: ready ? `Next: ${aeroWork.buttonLabel}` : `Next: Grow Cash for ${aeroWork.title}`,
          copy: ready ? aeroWork.copy : `${aeroWork.title} is the next Aero, Styling & Weight Reduction work when the shop can fund it.`,
          buttonLabel: aeroWork.buttonLabel,
          disabled: false,
        };
      }
      const finalWork = nextDreamBuildFinalWork(state);
      if (finalWork) {
        const ready = cashBalance(state) >= finalWork.cost;
        return {
          type: ready ? "buy_dream_final_work" : "dream_investment_target",
          title: ready ? `Next: ${finalWork.buttonLabel}` : `Next: Grow Cash for ${finalWork.title}`,
          copy: ready ? finalWork.copy : `${finalWork.title} is the next final core build step when the shop can fund it.`,
          buttonLabel: finalWork.buttonLabel,
          disabled: false,
        };
      }
      const availableGarageEvent = nextAvailableGarageEvent(state);
      if (availableGarageEvent) {
        const affordable = garageEventAffordability(availableGarageEvent, state);
        return {
          type: affordable.canEnter ? "enter_garage_event" : "garage_event_target",
          title: affordable.canEnter
            ? `Next: Enter ${availableGarageEvent.title}`
            : `Next: Grow Cash for ${availableGarageEvent.title}`,
          copy: "The current build is ready for a parked fictional garage event.",
          buttonLabel: affordable.canEnter ? availableGarageEvent.buttonLabel : "View Garage Event Board",
          disabled: false,
          garageEventId: availableGarageEvent.id,
        };
      }
      const brakesWork = nextDreamBuildBrakesWork(state);
      if (brakesWork) {
        const ready = cashBalance(state) >= brakesWork.cost;
        return {
          type: ready ? "buy_dream_brakes_work" : "dream_investment_target",
          title: ready ? `Next: ${brakesWork.buttonLabel}` : `Next: Grow Cash for ${brakesWork.title}`,
          copy: ready ? brakesWork.copy : `${brakesWork.title} is the next Brakes & Control work when the shop can fund it.`,
          buttonLabel: brakesWork.buttonLabel,
          disabled: false,
        };
      }
      const inductionStatus = inductionUnlockStatus(state);
      if (dreamBuildBrakesLevel(state) >= 5 && !inductionStatus.unlocked) {
        return {
          type: "garage_event_target",
          title: "Next: Enter Local Showcase",
          copy: "Induction & Cooling unlocks after the build has its first event result.",
          buttonLabel: "View Garage Event Board",
          disabled: false,
        };
      }
      const eventBoard = garageEventBoardStatus(state);
      if (eventBoard.visible && !eventBoard.unlocked) {
        return {
          type: "garage_event_target",
          title: "Next: Unlock Garage Event Board",
          copy: eventBoard.netWorthReady
            ? "Reach Tires & Rubber Level 5 to prepare the build for events."
            : "Reach $100M Net Worth to unlock the first garage event board.",
          buttonLabel: "View Dream Build",
          disabled: false,
        };
      }
      if (allGarageEventsComplete(state)) {
        return {
          type: "garage_event_target",
          title: "Next: Future Event Board",
          copy: "The first Garage Event Board is complete. Repeatable event boards and multiple cars come later.",
          buttonLabel: "View Event Board",
          disabled: false,
        };
      }
      const showcase = showcasePrepStatus(state);
      if (showcase.unlocked && !showcase.prepared && !urgentShopBottleneckBeforeShowcase(state)) {
        const ready = showcase.affordable;
        return {
          type: ready ? "prepare_showcase" : "showcase_prep_target",
          title: ready ? "Next: Prepare Showcase Display" : "Next: Save Cash for Showcase Prep",
          copy: ready
            ? "Turn the covered build into a polished showcase moment. Not faster. Smoother."
            : "The project is getting attention. Prepare it for its first display.",
          buttonLabel: ready ? "Prepare Showcase Display" : "View Showcase Prep",
          disabled: false,
        };
      }
      const sponsor = sponsorInquiryStatus(state);
      if (sponsor.unlocked && !sponsor.accepted && !urgentShopBottleneckBeforeShowcase(state)) {
        return {
          type: "accept_sponsor_inquiry",
          title: "Next: Accept Sponsor Inquiry",
          copy: "The first display build is starting to attract business.",
          buttonLabel: "Accept Sponsor Inquiry",
          disabled: false,
        };
      }
      const netWorthMilestone = nextNetWorthMilestone(state);
      if (netWorthMilestone && netWorthV1(state) < netWorthMilestone.amount) {
        return {
          type: "net_worth_milestone",
          title: `Next: Grow Net Worth to ${netWorthMilestone.label.replace(" Net Worth", "")}`,
          copy: netWorthGrowthGuidance(state),
          buttonLabel: "View Net Worth",
          disabled: false,
        };
      }
      return {
        type: "dream_investment_target",
        title: "Next: Grow toward the next build step",
        copy: "First Complete Build is finished. Car Management is unlocked.",
        buttonLabel: "View Dream Target",
        disabled: false,
      };
    }
    return {
      type: target.ready ? "buy_dream_wheels" : "dream_investment_target",
      title: target.ready ? "Next: Buy Wheels" : "Next: Grow Cash for Wheels",
      copy: target.ready
        ? "Start the dream build with the first real part."
        : "The shop is funding the first Dream Build investment.",
      buttonLabel: target.ready ? "Buy Wheels" : "View Wheels Fund",
      disabled: false,
    };
  }
  if (shopUnlocked && prep.ready < 1 && prep.running && Number(state.shop.tofuStock || 0) >= PREP_COUNTER_CONSUME_PER_ORDER) {
    const prepEta = prep.etaSeconds !== null ? ` About ${prep.etaSeconds} seconds remaining.` : "";
    const tidyNeeded = tidyPackaging && stationUpgradeIsRevealed(tidyPackaging, state) && tidyLevel < tidyPackaging.maxLevel
      ? Math.max(0, tidyCost - state.shop.tips)
      : 0;
    return {
      type: "wait_prep_counter",
      title: "Next: Wait for Prep Counter",
      copy: tidyNeeded > 0
        ? `Your Prep Counter is turning Tofu Stock into the next prepared order.${prepEta} Need ${formatCash(tidyNeeded)} more for Tidy Packaging.`
        : `Your Prep Counter is turning Tofu Stock into the next prepared order.${prepEta}`,
      buttonLabel: "Preparing Order",
      disabled: true,
    };
  }
  if (!shopActionStarted) {
    return {
      type: "start_shop",
      title: "Next: Start the Tofu Shop",
      copy: "Start the parked shop loop inside Tofu Garage, then take the Cup Test when you're ready for a certified boost.",
      buttonLabel: "Start the Shop",
      disabled: false,
    };
  }
  if (shopUnlocked && lowTofuStock) {
    return {
      type: "buy_station",
      title: "Next: Improve Tofu Supply",
      copy: "Tofu Stock is low. Buy Tofu Press or supplier support when available; manual packing is only a backup.",
      buttonLabel: "View Production",
      stationId: "tofu_press",
      disabled: false,
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
    title: "Next: Continue Tofu Garage",
    copy: "Let the starter shop work, buy bottleneck upgrades, or take the Cup Test for optional certified progress.",
    buttonLabel: "View Tofu Garage",
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
      elements.gameCtaButton.dataset.nextOrderType = action.orderTypeId || "";
      elements.gameCtaButton.dataset.nextStation = action.stationId || "";
      elements.gameCtaButton.dataset.nextSpiritBoost = action.spiritBoostId || "";
      elements.gameCtaButton.dataset.nextGarageEvent = action.garageEventId || "";
      elements.gameCtaButton.dataset.nextCarAssignment = action.carAssignmentId || "";
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
  if (elements.gameTotalXP) elements.gameTotalXP.textContent = `${formatShopCount(state.totalXP)} Driver XP`;
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
      : "The passport opens after your first stamp-worthy shop moment.";
  }
  if (elements.gamePassportPreview) {
    const previewIds = reveal.passport
      ? ["first_delivery", "daily_delivery_complete", "perfect_pour", "nospill_club"]
      : ["first_delivery", "daily_delivery_complete", "first_shop_order"];
    elements.gamePassportPreview.innerHTML = previewIds
      .map((id) => `<span>${escapeHtml(stampLockLabel(state, id))}</span>`)
      .join("");
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

function stationPurposeCopy(stationId, gameState) {
  const state = normalizeGameState(gameState);
  const prep = orderPrepProgress(state);
  const runway = tofuStockRunway(state);
  if (isDeferredRouteStationId(stationId)) {
    return "Future/deferred: Routes are not active Tofu Garage gameplay yet.";
  }
  if (stationId === "tofu_press") {
    if (runway.isHealthy) {
      return "Not urgent: you have enough tofu for now. Tofu Press helps when Prep Counter starts using stock faster.";
    }
    if (runway.isLow) {
      return "Tofu Stock is low. Let Tofu Press work or buy more supply.";
    }
    return "Presses tofu for future orders.";
  }
  if (stationId === "prep_counter") {
    if (runway.isHealthy && prep.ready < 1) {
      return "Prep Counter is the bottleneck. More counters prepare orders faster.";
    }
    return "Turns Tofu Stock into Delivery Orders.";
  }
  if (stationId === "delivery_shelf") {
    return "Supports the counter. Each shelf boosts Prep Counter order prep by 8%.";
  }
  if (stationId === "shop_sign") {
    return "Makes the shop known. Each sign boosts Reputation from fulfilled orders by 10%.";
  }
  if (stationId === "regular_customer") {
    return "Deferred automation: regulars arrive after the manual loop is tuned.";
  }
  const station = shopStationById(stationId);
  return station ? station.description : "";
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
  const afford = station ? stationAffordabilityStatus(station, state) : null;
  const cost = afford ? afford.cost : 0;
  const disabledReason = afford ? afford.disabledReason : "";
  const canBuy = Boolean(station && unlocked && !activeDrive && afford && afford.canBuy);
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
    : stationPurposeCopy(stationId, state);
  const milestoneCopy = unlocked && station ? stationMilestoneText(stationId, owned) : "";
  return `
    <div class="nospill-generator-item ${unlocked ? "" : "is-locked"}">
      <header>
        <strong>${escapeHtml(label)}</strong>
        <small>${escapeHtml(status)}</small>
      </header>
      <small>Owned: ${formatShopCount(owned)}</small>
      <small>${escapeHtml(rate)}</small>
      <small>${escapeHtml(helper)}</small>
      ${milestoneCopy ? `<small>${escapeHtml(milestoneCopy)}</small>` : ""}
      ${station ? `<small>Next: ${formatCash(cost)}${station.prepSlotCost ? ` · ${formatShopCount(station.prepSlotCost)} Prep Capacity` : ""}</small>` : ""}
      ${afford && unlocked ? renderAffordabilityProgress(afford.progress) : ""}
      <div class="nospill-idle-actions">
        ${actionButton(`Buy ${label} · ${formatCash(cost)}`, "data-shop-station", stationId, !canBuy, "nospill-secondary", disabledReason)}
        ${actionButton(`Buy Max ${label}`, "data-shop-station-max", stationId, !canBuy, "nospill-secondary", disabledReason)}
      </div>
    </div>
  `;
}

function activeTimedEffectFor(state, boostId) {
  const nowMs = Date.now();
  return (state.shop.activeFestivalBoosts || []).find((boost) => (
    boost.id === boostId
    && Number.isFinite(Date.parse(boost.expiresAt))
    && Date.parse(boost.expiresAt) > nowMs
  )) || null;
}

function spiritGeneratorDisabledReason(generator, state, cost) {
  const current = safeNonNegativeInteger(state.shop.spiritGenerators[generator.id], 0, SPIRIT_GENERATOR_MAX_LEVEL);
  if (current >= SPIRIT_GENERATOR_MAX_LEVEL) return "Maxed";
  const missing = Math.max(0, cost - state.shop.tips);
  return missing > 0
    ? `Need ${formatCash(missing)} · You have ${formatCashBalance(state.shop.tips)}`
    : "";
}

function spiritBoostDisabledReason(boost, state) {
  const active = activeTimedEffectFor(state, boost.id);
  if (active && boost.durationSeconds) return `${boost.name} is already active.`;
  if (boost.type === "instant_orders" && deliveryOrderQueueSpace(state.shop) < 1) {
    return "Order queue is full. Use Counter Service or Wholesale Pickup first.";
  }
  if (boost.type === "instant_tofu" && safeNonNegativeNumber(state.shop.tofuStock, 0, SHOP_MAX_RESOURCE) >= SHOP_MAX_RESOURCE) {
    return "Tofu Stock is already at capacity.";
  }
  const missing = Math.max(0, boost.costSpirit - state.shop.shopSpirit);
  return missing > 0
    ? `Need ${formatShopCost(missing)} Spirit · You have ${formatShopBalance(state.shop.shopSpirit)}`
    : "";
}

function shopSpiritInstantAmount(boost, gameState) {
  const state = normalizeGameState(gameState);
  const rates = getShopGeneratorRates(state);
  const seconds = safeNonNegativeInteger(boost && boost.seconds, 30, 3600);
  if (boost && boost.type === "instant_tofu") {
    const bestOrder = bestUnlockedShopOrderType(state);
    return Math.max(
      safeNonNegativeInteger(boost.amount, 0, 1000000),
      Math.ceil(rates.tofuPressPerSecond * seconds),
      safeNonNegativeInteger(bestOrder.tofuRequired, 6, 1000000),
    );
  }
  if (boost && boost.type === "instant_orders") {
    return Math.max(
      safeNonNegativeInteger(boost.amount, 0, 1000000),
      Math.ceil(rates.prepOrdersPerSecond * seconds),
      1,
    );
  }
  return safeNonNegativeInteger(boost && boost.amount, 0, 1000000);
}

function visibleFestivalBoostTokens(state) {
  return FESTIVAL_BOOSTS.filter((boost) => (
    routeGameplayEnabled()
    && (boost.type !== "route_multiplier" || hasRouteStoryBeat(state))
    && safeNonNegativeInteger(state.shop.festivalBoosts[boost.id], 0, 100000) > 0
  ));
}

function festivalBoostDisabledReason(boost, state) {
  const ready = safeNonNegativeInteger(state.shop.festivalBoosts[boost.id], 0, 100000);
  return ready < 1 ? `Need 1 ${boost.name} · You have 0` : "";
}

function spiritBoostActionLabel(boost) {
  if (boost.type === "instant_tofu" || boost.type === "instant_orders") {
    return `Activate · ${formatShopCost(boost.costSpirit)} Spirit`;
  }
  if (boost.durationSeconds) {
    if (boost.id === "busy_lunch") return "Start Lunch Hour";
    if (boost.id === "double_batch") return "Start Double Batch";
    return "Start Effect";
  }
  return "Spend Spirit";
}

function spiritBoostCopy(boost, state) {
  const active = activeTimedEffectFor(state, boost.id);
  if (active) {
    const seconds = Math.max(0, Math.ceil((Date.parse(active.expiresAt) - Date.now()) / 1000));
    return `${boost.description} Active · ${formatShopCount(Math.ceil(seconds / 60))}m remaining. Refreshes are blocked while active.`;
  }
  if (boost.durationSeconds) {
    return `${boost.description} Duration: ${formatShopCount(Math.ceil(boost.durationSeconds / 60))} min. Does not stack; start it when the shop is parked.`;
  }
  if (boost.type === "instant_tofu") {
    return `Activation burst: ${boost.description} Current effect: +${formatShopCount(shopSpiritInstantAmount(boost, state))} Tofu Stock.`;
  }
  if (boost.type === "instant_orders") {
    const amount = Math.min(shopSpiritInstantAmount(boost, state), deliveryOrderQueueSpace(state.shop));
    if (amount < 1) return "Order queue is full. Use Counter Service or Wholesale Pickup first.";
    return `Activation burst: ${boost.description} Current effect: +${formatShopCount(amount)} ready order${amount === 1 ? "" : "s"}.`;
  }
  return `${boost.description} Instant parked-only action.`;
}

function renderStationUpgradeCard(upgrade, gameState) {
  const state = normalizeGameState(gameState);
  const afford = upgradeAffordabilityStatus(upgrade, state);
  const level = afford.level;
  const cost = afford.costTips;
  const reputationCost = afford.costReputation;
  const station = shopStationById(upgrade.stationId);
  const counterServiceUpgrade = upgrade.stationId === "counter_service";
  const supplierUpgrade = isSupplierUpgrade(upgrade);
  const managerUpgrade = isManagerDeskUpgrade(upgrade);
  const unlocked = afford.unlocked;
  const disabledReason = afford.disabledReason;
  const canBuy = afford.canBuy;
  if (unlocked && level >= upgrade.maxLevel) {
    const maxedCopy = supplierUpgrade
      ? `Current effect is active. Tofu supply is +${formatShopRate(getShopGeneratorRates(state).tofuPressPerSecond)}/sec including Supplier Contracts.`
      : upgrade.stationId === "counter_service"
      ? `Current effect is active. Counter Service is ${formatShopCount(counterServiceBatchSize(state))} order${counterServiceBatchSize(state) === 1 ? "" : "s"} per handoff at 1 handoff / ${formatShopCount(counterServiceIntervalSeconds(state))} sec.`
      : upgrade.id === "manager_wholesale_pickup"
      ? "Current Manager Desk effect is active. Wholesale Pickup clears capped waiting-order batches when the queue is full and tofu is supplied."
      : managerUpgrade
      ? `Current Manager Desk effect is active. Counter Service is ${formatShopCount(counterServiceBatchSize(state))} order${counterServiceBatchSize(state) === 1 ? "" : "s"} per handoff.`
      : `${upgrade.effect}. Current effect is active.`;
    return renderIdleCard({
      title: `${upgrade.name} Lv ${level}`,
      status: "Maxed",
      copy: maxedCopy,
      actions: [],
    });
  }
  const status = supplierUpgrade
    ? `Cost: ${formatShopCost(reputationCost)} Reputation`
    : managerUpgrade
    ? `Cost: ${formatCash(cost)} Cash + ${formatShopCost(reputationCost)} Reputation`
    : `Cost: ${formatCash(cost)} Cash`;
  const actionLabel = supplierUpgrade
    ? `Buy ${upgrade.name} · ${formatShopCost(reputationCost)} Reputation`
    : managerUpgrade
    ? `Buy ${upgrade.name} · ${formatCash(cost)} Cash + ${formatShopCost(reputationCost)} Reputation`
    : `Buy ${upgrade.name} · ${formatCash(cost)} Cash`;
  return renderIdleCard({
    title: `${upgrade.name} Lv ${level}`,
    status,
    copy: unlocked
      ? `${upgrade.effect}. ${stationUpgradePreviewText(upgrade, state)} ${stationUpgradeWhyItMatters(upgrade)}`
      : stationUpgradeRevealReason(upgrade, state),
    locked: !unlocked,
    extra: unlocked ? renderAffordabilityProgress(afford.progress) : "",
    actions: [actionButton(actionLabel, "data-station-upgrade", upgrade.id, !canBuy, "nospill-secondary", disabledReason)],
  });
}

function renderCounterContractCard(contract, gameState) {
  const state = normalizeGameState(gameState);
  const status = counterContractStatus(contract, state);
  const orderType = shopOrderTypeById(contract.unlockOrderTypeId);
  const activeDrive = appState.running || appState.calibrating;
  if (status.purchased) {
    return renderIdleCard({
      title: contract.name,
      status: "Signed",
      copy: `${orderType.name} unlocked. Counter Service batch floor: ${formatShopCount(contract.batchFloor)}. Reputation is used to sign larger shop contracts.`,
      actions: [],
    });
  }
  const unlocked = status.unlocked;
  return renderIdleCard({
    title: contract.name,
    status: unlocked
      ? `Cost: ${formatCash(contract.costTips)} Cash + ${formatShopCost(contract.costReputation)} Reputation`
      : "Locked",
    copy: unlocked
      ? `${contract.copy} Unlocks ${orderType.name} and raises Counter Service batch floor to ${formatShopCount(contract.batchFloor)}.`
      : counterContractLockedReason(contract, state),
    locked: !unlocked,
    extra: unlocked ? renderAffordabilityProgress(status.progress) : "",
    actions: activeDrive ? [] : [
      actionButton(
        contract.buttonLabel,
        "data-counter-contract",
        contract.id,
        !status.canBuy,
        "nospill-secondary",
        status.disabledReason || "Not enough Cash or Reputation.",
      ),
    ],
  });
}

function renderCounterContractsPanel(state) {
  const visible = COUNTER_CONTRACTS.filter((contract, index) => (
    counterContractPurchased(state, contract.id)
    || counterContractPrerequisitesMet(contract, state)
    || index === 0
    || counterContractPurchased(state, COUNTER_CONTRACTS[index - 1].id)
  ));
  return `
    <section class="nospill-spirit-section" aria-label="Counter contracts">
      <h5>Counter Contracts</h5>
      <p class="nospill-panel-helper">Reputation signs larger parked shop contracts. Bigger contracts unlock larger order types and Counter Service batch floors; they do not affect Cup Test scoring.</p>
      <div class="nospill-idle-grid">
        ${visible.map((contract) => renderCounterContractCard(contract, state)).join("")}
        ${counterContractPurchased(state, "event_vendor_contract") ? renderIdleCard({
          title: "Future Contract Expansion",
          status: "Future",
          copy: "Future contract expansion will support Car Management and larger garage-era events.",
          locked: true,
        }) : ""}
      </div>
    </section>
  `;
}

function renderDeliveryWall(gameState = loadGameState()) {
  if (!elements.deliveryWallGrid) return;
  normalizeGameState(gameState);
  elements.deliveryWallGrid.innerHTML = "";
}

function hasShopStationUpgrade(gameState) {
  const state = normalizeGameState(gameState);
  return Object.values(state.shop.stationUpgrades || {}).some((level) => safeNonNegativeInteger(level, 0, 1000) > 0);
}

function hasAdvancedShopStation(gameState) {
  const state = normalizeGameState(gameState);
  return ["delivery_shelf", "shop_sign", "regular_customer"]
    .some((stationId) => safeNonNegativeInteger(state.shop.stations[stationId], 0, 100000) > 0);
}

function hasRouteStoryBeat(gameState) {
  if (!routeGameplayEnabled()) return false;
  const state = normalizeGameState(gameState);
  const routeProgress = Object.values(state.shop.routes || {}).some((route) => safeNonNegativeInteger(route && route.mastery, 0, 100) > 0);
  return routeProgress
    || (
      fulfilledShopOrderCount(state) >= 25
      && hasShopStationUpgrade(state)
      && (hasAdvancedShopStation(state) || safeNonNegativeInteger(state.shop.shopReach, 0, 100000) > 0)
    );
}

function hasMeaningfulLedgerHistory(gameState) {
  const state = normalizeGameState(gameState);
  const offline = state.shop.offlineEarnings || {};
  const offlineChanged = safeNonNegativeNumber(offline.tofuStock, 0, SHOP_MAX_RESOURCE) > 0.01
    || safeNonNegativeNumber(offline.deliveryOrders, 0, SHOP_MAX_RESOURCE) > 0.01
    || safeNonNegativeNumber(offline.tips, 0, SHOP_MAX_RESOURCE) > 0.01;
  return offlineChanged
    || fulfilledShopOrderCount(state) >= 10
    || hasShopStationUpgrade(state)
    || safeNonNegativeInteger(state.shop.ledger.length, 0, 1000) >= 5;
}

function isPassportTabUnlocked(gameState) {
  const state = normalizeGameState(gameState);
  return deliveryPassportSummary(state).total >= 2 || fulfilledShopOrderCount(state) >= 10;
}

function dreamBuildTabUnlocked(gameState) {
  if (appState.running || appState.calibrating) return false;
  return dreamBuildInvestmentStarted(gameState);
}

function carManagementTabUnlocked(gameState) {
  if (appState.running || appState.calibrating) return false;
  return carManagementUnlocked(gameState);
}

const SHOP_TABS = [
  { id: "overview", label: "Overview", unlock: () => true },
  { id: "production", label: "Production", unlock: () => true },
  { id: "routes", label: "Routes", unlock: (state) => routeGameplayEnabled() && hasRouteStoryBeat(state) },
  { id: "training", label: "Training", unlock: (state) => routeGameplayEnabled() && hasRouteStoryBeat(state) && state.shop.cupStabilityXP > 0 },
  { id: "garage", label: "Garage", unlock: (state) => routeGameplayEnabled() && hasRouteStoryBeat(state) && Object.values(state.shop.garage).some(Boolean) },
  { id: "crew", label: "Crew", unlock: (state) => routeGameplayEnabled() && hasRouteStoryBeat(state) && Object.values(state.shop.crew).some(Boolean) },
  { id: "spirit", label: "Shop Spirit", unlock: (state) => hasAdvancedShopStation(state) && fulfilledShopOrderCount(state) >= 50 },
  { id: "upgrades", label: "Upgrades", unlock: (state) => visibleRelevantStationUpgrades(state).length > 0 },
  { id: "dream_build", label: "Dream Build", unlock: (state) => dreamBuildTabUnlocked(state) },
  { id: "car_management", label: "Car Management", unlock: (state) => carManagementTabUnlocked(state) },
  { id: "rivals", label: "Rivals", unlock: (state) => routeGameplayEnabled() && hasRouteStoryBeat(state) && Object.values(state.shop.rivals).some(Boolean) },
  { id: "passport", label: "Passport", unlock: (state) => isPassportTabUnlocked(state) },
  { id: "license", label: "License", unlock: (state) => state.shop.licenseStars > 0 || (routeGameplayEnabled() && hasRouteStoryBeat(state) && licenseExamStatus(state).ready) },
  { id: "ledger", label: "Ledger", unlock: (state) => hasMeaningfulLedgerHistory(state) },
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
    training: "Training Lot unlocks after the first few Cash payouts.",
    garage: "Garage upgrades unlock after the shop has enough Cash.",
    crew: "Delivery Crew automation unlocks after the shop reaches new districts.",
    spirit: "Shop Spirit unlocks when reputation starts to spread.",
    dream_build: "Dream Build unlocks after the covered build starts.",
    rivals: "Rival Shop Challenges unlock after the shop has a little reputation.",
    passport: "The passport opens after your first stamp-worthy shop moment.",
    license: "License Exams appear after early shop progress.",
    ledger: "The Delivery Ledger fills as the shop does things.",
    car_management: "Car Management unlocks after the First Complete Build.",
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
    const newlyRevealed = state.newlyRevealedTabIds.includes(tab.id);
    const classes = [
      tab.id === activeTab ? "is-active" : "",
      newlyRevealed ? "is-newly-revealed" : "",
    ].filter(Boolean).join(" ");
    return `
      <button
        type="button"
        data-shop-tab="${escapeHtml(tab.id)}"
        class="${escapeHtml(classes)}"
        ${unlocked ? "" : "disabled"}
      >
        <span>${escapeHtml(tab.label)}</span>${newlyRevealed ? `<span class="nospill-tab-badge">New</span>` : ""}
      </button>
    `;
  }).join("");
  elements.shopTabPanel.innerHTML = renderShopTabPanel(activeTab, state);
}

function renderShopTabPanel(tabId, state) {
  if (tabId === "production") return renderProductionPanel(state);
  if (tabId === "routes") return renderRoutesPanel(state);
  if (tabId === "training") return renderTrainingPanel(state);
  if (tabId === "garage") return renderGaragePanel(state);
  if (tabId === "crew") return renderCrewPanel(state);
  if (tabId === "spirit") return renderSpiritPanel(state);
  if (tabId === "upgrades") return renderExpandedUpgradePanel(state);
  if (tabId === "dream_build") return renderDreamBuildPanel(state);
  if (tabId === "car_management") return renderCarManagementPanel(state);
  if (tabId === "rivals") return renderRivalsPanel(state);
  if (tabId === "passport") return renderPassportPanel(state);
  if (tabId === "license") return renderLicensePanel(state);
  if (tabId === "ledger") return renderLedgerPanel(state);
  if (tabId === "settings") return renderShopSettingsPanel(state);
  return renderOverviewPanel(state);
}

function renderIdleCard({ title, status, copy, actions = [], locked = false, extra = "" }) {
  return `
    <div class="nospill-idle-card ${locked ? "is-locked" : ""}">
      <header>
        <strong>${escapeHtml(title)}</strong>
        <small>${escapeHtml(status || "")}</small>
      </header>
      <small>${escapeHtml(copy || "")}</small>
      ${extra}
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

function fulfillOrderButton(label, orderTypeId, quantity, disabled = false, extraClass = "nospill-secondary", disabledReason = "") {
  const reason = disabled
    ? `<small class="nospill-action-reason">${escapeHtml(disabledReason || "Not enough resources or locked.")}</small>`
    : "";
  return `
    <span class="nospill-action-wrap">
      <button
        class="${extraClass}"
        type="button"
        data-fulfill-orders="${escapeHtml(String(quantity))}"
        data-order-type="${escapeHtml(orderTypeId)}"
        ${disabled ? "disabled" : ""}
      >
        ${escapeHtml(label)}
      </button>
      ${reason}
    </span>
  `;
}

function renderShopOrderCard(orderType, gameState, options = {}) {
  const state = normalizeGameState(gameState);
  const prep = orderPrepProgress(state);
  const unlocked = shopOrderTypeUnlocked(orderType, state);
  const maxQuantity = maxFulfillableShopOrderQuantity(state, orderType);
  const disabledReason = shopOrderDisabledReason(orderType, state, unlocked);
  const canFulfill = unlocked && maxQuantity > 0 && !disabledReason;
  const costCopy = `Uses ${formatShopCost(orderType.tofuRequired)} tofu stock and ${formatShopCount(orderType.deliveryOrdersRequired)} ready order${orderType.deliveryOrdersRequired === 1 ? "" : "s"}.`;
  const rewardCopy = `Reward: +${formatCashCount(orderType.tips)} from tips, +${formatShopCount(orderType.reputation)} Reputation, +${formatShopCount(orderType.xp)} Shop XP.`;
  const maxRewardCopy = maxQuantity > 1
    ? `Fulfill Max ${orderType.name} x${formatShopCount(maxQuantity)} · Reward: +${formatCashCount(orderType.tips * maxQuantity)} from tips, +${formatShopCount(orderType.reputation * maxQuantity)} Reputation, +${formatShopCount(orderType.xp * maxQuantity)} Shop XP · Uses: ${formatShopCost(orderType.tofuRequired * maxQuantity)} tofu stock, ${formatShopCount(orderType.deliveryOrdersRequired * maxQuantity)} ready orders`
    : "";
  const availability = canFulfill
    ? `<small class="nospill-available-badge">Available</small>`
    : "";
  const actions = options.hideActions
    ? []
    : [
        fulfillOrderButton(`Fulfill ${orderType.name}`, orderType.id, "1", !canFulfill, "nospill-secondary", disabledReason),
        maxQuantity > 1
          ? fulfillOrderButton(`Fulfill Max ${orderType.name} x${formatShopCount(maxQuantity)}`, orderType.id, "max", false, "nospill-secondary")
          : "",
        maxRewardCopy ? `<small class="nospill-action-reason">${escapeHtml(maxRewardCopy)}</small>` : "",
      ];
  return renderIdleCard({
    title: orderType.name,
    status: unlocked ? `Ready Orders: ${formatShopCount(prep.ready)}` : "Locked",
    copy: unlocked
      ? `${costCopy} ${rewardCopy} ${options.compact ? "" : `${orderType.purpose}.`}`.trim()
      : shopOrderUnlockReason(orderType),
    locked: !unlocked,
    extra: availability,
    actions,
  });
}

function renderPreparingOrderCard(state) {
  const prep = orderPrepProgress(state);
  const runway = tofuStockRunway(state);
  const rates = getShopGeneratorRates(state);
  return renderIdleCard({
    title: "Preparing Next Order",
    status: `${prep.progressPercent}% prepared`,
    copy: `${runway.message} Tofu Stock available: ${formatShopBalance(state.shop.tofuStock, state.shop.generatorCarry && state.shop.generatorCarry.tofuStock)}. Prep Counter tofu per prepared order: ${formatShopCost(PREP_COUNTER_CONSUME_PER_ORDER)}. Prep Counter: +${formatShopRate(rates.prepOrdersPerSecond)} orders/sec.`,
    extra: renderOrderPrepProgress(state),
  });
}

function renderOverviewImprovementCard(state) {
  const action = nextBestAction(state);
  if (action.type === "buy_upgrade" && action.upgradeId) {
    const upgrade = shopUpgradeById(action.upgradeId);
    if (upgrade) return renderStationUpgradeCard(upgrade, state);
  }
  if (action.type === "buy_station" && action.stationId) {
    return renderShopGeneratorCard(action.stationId, state);
  }
  const relevantUpgrade = visibleRelevantStationUpgrades(state)[0];
  if (relevantUpgrade) return renderStationUpgradeCard(relevantUpgrade, state);
  if (isOrderPrepBottleneck(state)) return renderShopGeneratorCard("prep_counter", state);
  if (isStockBottleneck(state)) return renderShopGeneratorCard("tofu_press", state);
  return "";
}

function renderPassportTeaserCard(state) {
  const passport = deliveryPassportSummary(state);
  if (passport.total < 1 || isPassportTabUnlocked(state)) return "";
  return renderIdleCard({
    title: "Passport Stamp Found",
    status: "Teaser",
    copy: "First Shop Order stamp discovered. More stamps stay tucked away until the shop grows.",
  });
}

function renderStoryTeaserCard() {
  if (appState.running || appState.calibrating) return "";
  if (!appState.shopStoryTeaser) return "";
  return renderIdleCard({
    title: appState.shopStoryTeaser.title || "Behind the shop",
    status: appState.shopStoryTeaser.status || "Story Teaser",
    copy: appState.shopStoryTeaser.copy || "Behind the shop, an old car waits under a cover.",
  });
}

function getStorySplashAsset(assetId) {
  const asset = STORY_SPLASH_ASSETS[assetId] || null;
  return {
    assetId,
    src: asset && typeof asset.src === "string" ? asset.src : "",
    label: asset && typeof asset.label === "string" ? asset.label : "Story Splash",
    alt: asset && typeof asset.alt === "string" ? asset.alt : "Tofu Driver story splash.",
  };
}

function renderStorySplashImage(assetId) {
  const asset = getStorySplashAsset(assetId);
  if (!asset.src) return "";
  return `
    <figure class="nospill-story-splash-art">
      <img
        src="${escapeHtml(asset.src)}"
        alt="${escapeHtml(asset.alt)}"
        loading="eager"
        decoding="async"
        onerror="this.hidden = true;"
      />
    </figure>
  `;
}

function renderCoveredCarTeaserCard(gameState) {
  if (appState.running || appState.calibrating) return "";
  const state = normalizeGameState(gameState);
  if (!coveredCarTeaserUnlocked(state)) return "";
  if (dreamBuildProgressVisible(state)) return "";
  const seen = coveredCarTeaserSeen(state);
  if (!seen) {
    return renderIdleCard({
      title: "Old Car Out Back",
      status: "Story Teaser",
      copy: "Behind the shop, an old car waits under a cover.",
      extra: renderStorySplashImage("old_car_out_back_story_splash"),
      actions: [actionButton("Continue Tofu Shop", "data-covered-car-teaser", "seen", false)],
    });
  }
  return renderIdleCard({
    title: "Behind the Shop",
    status: "Covered car",
    copy: "An old car waits under a cover. The Tofu Shop is how the dream starts.",
    actions: [],
  });
}

function renderDreamBuildTrackWorkCard(state, options) {
  const work = options.work;
  const canAfford = cashBalance(state) >= work.cost;
  const missing = Math.max(0, work.cost - cashBalance(state));
  const status = options.statusOverride || `Level ${formatShopCount(options.level)} / ${formatShopCount(options.totalLevels || 5)} · ${options.statusLabel}`;
  return renderIdleCard({
    title: options.title,
    status,
    copy: work.copy,
    extra: `
      <div class="nospill-afford-progress">
        <div class="nospill-afford-progress-head">
          <span>${GARAGE_BUILD_VALUE_LABEL}</span>
          <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
        </div>
        <small>Next Work: ${escapeHtml(work.title)}</small>
        <small>Cost: ${escapeHtml(formatCash(work.cost))} Cash · Build Value added: +${escapeHtml(formatCashCount(work.valueAdded))}</small>
        <small>${escapeHtml(work.copy)}</small>
        ${work.detailCopy ? compactDetails(`dream_build_${work.action}_details`, options.detailsLabel, `<p>${escapeHtml(work.detailCopy)}</p>`) : ""}
        ${!canAfford ? `<small>Need ${escapeHtml(formatCash(missing))} more Cash.</small>` : ""}
      </div>
    `,
    actions: canAfford ? [
      actionButton(
        work.buttonLabel,
        "data-dream-build-action",
        work.action,
        false,
        "nospill-primary",
      ),
    ] : [],
  });
}

function renderDreamInvestmentTargetCard(gameState) {
  if (appState.running || appState.calibrating) return "";
  const state = normalizeGameState(gameState);
  if (!dreamInvestmentTargetVisible(state)) return "";
  const target = dreamInvestmentTargetProgress(state);
  const purchased = target.purchased;
  const percent = clampPercent(target.percent);
  const progressText = `${formatCashCount(target.current)} / ${formatCashCount(target.required)}`;
  if (purchased) {
    const wheelsLevel = dreamBuildWheelsLevel(state);
    const work = nextDreamBuildWheelsWork(state);
    if (work) {
      const canAffordWork = cashBalance(state) >= work.cost;
      const missing = Math.max(0, work.cost - cashBalance(state));
      const levelTitle = wheelsLevel >= 2 ? "Polished Wheels" : "Wheels Installed";
      const levelCopy = wheelsLevel >= 2
        ? "The wheels catch the shop lights now."
        : "The covered car finally looks like a project.";
      return renderIdleCard({
        title: wheelsLevel >= 2 ? "Polished Wheels" : "Dream Build",
        status: `${levelTitle} · Level ${formatShopCount(wheelsLevel)} / 5`,
        copy: levelCopy,
        extra: `
          <div class="nospill-afford-progress">
            <div class="nospill-afford-progress-head">
              <span>${GARAGE_BUILD_VALUE_LABEL}</span>
              <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
            </div>
            <small>Next Work: ${escapeHtml(work.title)}</small>
            <small>Cost: ${escapeHtml(formatCash(work.cost))} Cash · Value added: +${escapeHtml(formatCashCount(work.valueAdded))}</small>
            <small>${escapeHtml(work.copy)}</small>
          </div>
        `,
        actions: [
          actionButton(
            work.buttonLabel,
            "data-dream-build-action",
            work.action,
            !canAffordWork,
            "nospill-primary",
            `Need ${formatCash(missing)} more Cash.`,
          ),
        ],
      });
    }
    const exhaustLevel = dreamBuildExhaustLevel(state);
    const exhaustWork = nextDreamBuildExhaustWork(state);
    if (exhaustWork) {
      const canAffordExhaustWork = cashBalance(state) >= exhaustWork.cost;
      const missing = Math.max(0, exhaustWork.cost - cashBalance(state));
      const isPurchase = exhaustWork.action === "buy-exhaust";
      const currentExhaustLabel = dreamBuildExhaustStatusLabel(exhaustLevel);
      const cardTitle = isPurchase ? "Dream Build" : "Exhaust";
      const status = isPurchase
        ? "Balanced Fitment · Wheels Level 3 / 5"
        : `Level ${formatShopCount(exhaustLevel)} / 5 · ${currentExhaustLabel}`;
      const copy = isPurchase
        ? "The project needs its first calm note."
        : exhaustWork.copy;
      return renderIdleCard({
        title: cardTitle,
        status,
        copy,
        extra: `
          <div class="nospill-afford-progress">
            <div class="nospill-afford-progress-head">
              <span>${GARAGE_BUILD_VALUE_LABEL}</span>
              <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
            </div>
            <small>${isPurchase ? "Next Dream Part" : "Next Work"}: ${escapeHtml(exhaustWork.title)}</small>
            <small>Cost: ${escapeHtml(formatCash(exhaustWork.cost))} Cash · ${exhaustWork.action === "heat-wrap" || exhaustWork.action === "showcase-finish" ? "Build Value added" : "Value added"}: +${escapeHtml(formatCashCount(exhaustWork.valueAdded))}</small>
            <small>${escapeHtml(exhaustWork.copy)}</small>
            ${!canAffordExhaustWork ? `<small>Need ${escapeHtml(formatCash(missing))} more Cash.</small>` : ""}
          </div>
        `,
        actions: canAffordExhaustWork ? [
          actionButton(
            exhaustWork.buttonLabel,
            "data-dream-build-action",
            exhaustWork.action,
            !canAffordExhaustWork,
            "nospill-primary",
            `Need ${formatCash(missing)} more Cash.`,
          ),
        ] : [],
      });
    }
    const suspensionWork = nextDreamBuildSuspensionWork(state);
    if (suspensionWork) {
      return renderDreamBuildTrackWorkCard(state, {
        title: "Suspension",
        level: dreamBuildSuspensionLevel(state),
        statusLabel: dreamBuildSuspensionStatusLabel(dreamBuildSuspensionLevel(state)),
        work: suspensionWork,
        detailsLabel: "Suspension details",
      });
    }
    const tiresWork = nextDreamBuildTiresWork(state);
    if (tiresWork) {
      return renderDreamBuildTrackWorkCard(state, {
        title: "Tires & Rubber",
        level: dreamBuildTiresLevel(state),
        statusLabel: dreamBuildTiresStatusLabel(dreamBuildTiresLevel(state)),
        work: tiresWork,
        detailsLabel: "Tire details",
      });
    }
    const brakesWork = nextDreamBuildBrakesWork(state);
    if (brakesWork) {
      return renderDreamBuildTrackWorkCard(state, {
        title: "Brakes & Control",
        level: dreamBuildBrakesLevel(state),
        statusLabel: dreamBuildBrakesStatusLabel(dreamBuildBrakesLevel(state)),
        work: brakesWork,
        detailsLabel: "Brake details",
      });
    }
    const inductionWork = nextDreamBuildInductionWork(state);
    if (inductionWork) {
      return renderDreamBuildTrackWorkCard(state, {
        title: "Induction & Cooling",
        level: dreamBuildInductionLevel(state),
        statusLabel: dreamBuildInductionStatusLabel(dreamBuildInductionLevel(state)),
        work: inductionWork,
        detailsLabel: "Induction details",
      });
    }
    const drivetrainWork = nextDreamBuildDrivetrainWork(state);
    if (drivetrainWork) {
      return renderDreamBuildTrackWorkCard(state, {
        title: "Drivetrain & Transmission",
        level: dreamBuildDrivetrainLevel(state),
        statusLabel: dreamBuildDrivetrainStatusLabel(dreamBuildDrivetrainLevel(state)),
        work: drivetrainWork,
        detailsLabel: "Drivetrain details",
      });
    }
    const aeroWork = nextDreamBuildAeroWork(state);
    if (aeroWork) {
      return renderDreamBuildTrackWorkCard(state, {
        title: "Aero, Styling & Weight Reduction",
        level: dreamBuildAeroLevel(state),
        statusLabel: dreamBuildAeroStatusLabel(dreamBuildAeroLevel(state)),
        work: aeroWork,
        detailsLabel: "Aero details",
      });
    }
    const finalWork = nextDreamBuildFinalWork(state);
    if (finalWork) {
      return renderDreamBuildTrackWorkCard(state, {
        title: "Final Detail & Shakedown",
        level: dreamBuildFinalBuildLevel(state),
        statusLabel: dreamBuildFinalStatusLabel(dreamBuildFinalBuildLevel(state)),
        statusOverride: finalWork.nextLevel === 1 ? "Step 39 / 40" : "Step 40 / 40",
        work: finalWork,
        detailsLabel: "Final build details",
      });
    }
    const aeroStatus = aeroUnlockStatus(state);
    if (dreamBuildDrivetrainLevel(state) >= 5) {
      if (!aeroStatus.unlocked) {
        return renderIdleCard({
          title: "Aero, Styling & Weight Reduction",
          status: "Future Track",
          copy: aeroStatus.reason,
          extra: `
            <div class="nospill-afford-progress">
              <div class="nospill-afford-progress-head">
                <span>${GARAGE_BUILD_VALUE_LABEL}</span>
                <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
              </div>
              <small>Requirement: Drivetrain &amp; Transmission Level 5 complete.</small>
              <small>No aero purchase button appears until the final core build track is unlocked.</small>
            </div>
          `,
          actions: [],
        });
      }
      if (dreamBuildFinalBuildLevel(state) >= 2) {
        return renderIdleCard({
          title: "First Complete Build",
          status: "Core Build Complete · 40 / 40",
          copy: "The first Tofu Garage build is complete.",
          extra: `
            <div class="nospill-afford-progress">
              <div class="nospill-afford-progress-head">
                <span>${GARAGE_BUILD_VALUE_LABEL}</span>
                <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
              </div>
              <small>First Complete Build</small>
              <small>Next Era: Car Management</small>
              <small>Future garage pass.</small>
            </div>
          `,
          actions: [],
        });
      }
    }
    const drivetrainStatus = drivetrainUnlockStatus(state);
    if (dreamBuildInductionLevel(state) >= 5) {
      if (!drivetrainStatus.unlocked) {
        return renderIdleCard({
          title: "Drivetrain & Transmission",
          status: "Future Track",
          copy: drivetrainStatus.reason,
          extra: `
            <div class="nospill-afford-progress">
              <div class="nospill-afford-progress-head">
                <span>${GARAGE_BUILD_VALUE_LABEL}</span>
                <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
              </div>
              <small>Requirement: Induction &amp; Cooling Level 5 complete.</small>
              <small>No drivetrain purchase button appears until the power-delivery phase is unlocked.</small>
            </div>
          `,
          actions: [],
        });
      }
      if (dreamBuildDrivetrainLevel(state) >= 5) {
        return renderIdleCard({
          title: "Drivetrain & Transmission",
          status: "Level 5 / 5 · Sequential Transmission Package",
          copy: "Drivetrain & Transmission Complete. The power-delivery package is complete.",
          extra: `
            <div class="nospill-afford-progress">
              <div class="nospill-afford-progress-head">
                <span>${GARAGE_BUILD_VALUE_LABEL}</span>
                <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
              </div>
              <small>Next Build Track: Aero, Styling &amp; Weight Reduction</small>
              <small>Future garage pass.</small>
            </div>
          `,
          actions: [],
        });
      }
    }
    const inductionStatus = inductionUnlockStatus(state);
    if (dreamBuildBrakesLevel(state) >= 5) {
      if (!inductionStatus.unlocked) {
        return renderIdleCard({
          title: "Induction & Cooling",
          status: "Future Track",
          copy: inductionStatus.reason,
          extra: `
            <div class="nospill-afford-progress">
              <div class="nospill-afford-progress-head">
                <span>${GARAGE_BUILD_VALUE_LABEL}</span>
                <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
              </div>
              <small>Requirement: Brakes &amp; Control Level 5 and Local Showcase complete.</small>
              <small>No induction purchase button appears until the next build phase is unlocked.</small>
            </div>
          `,
          actions: [],
        });
      }
      if (dreamBuildInductionLevel(state) >= 5) {
        return renderIdleCard({
          title: "Induction & Cooling",
          status: "Level 5 / 5 · Anti-Lag & Cooling Package",
          copy: "Induction & Cooling Complete. The boost and cooling package is complete.",
          extra: `
            <div class="nospill-afford-progress">
              <div class="nospill-afford-progress-head">
                <span>${GARAGE_BUILD_VALUE_LABEL}</span>
                <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
              </div>
              <small>Next Build Track: Drivetrain &amp; Transmission</small>
              <small>Future garage pass.</small>
            </div>
          `,
          actions: [],
        });
      }
      return renderIdleCard({
        title: "Brakes & Control",
        status: "Level 5 / 5 · Brake Balance & Control Package",
        copy: "Brakes & Control Complete. The control package is complete.",
        extra: `
          <div class="nospill-afford-progress">
            <div class="nospill-afford-progress-head">
              <span>${GARAGE_BUILD_VALUE_LABEL}</span>
              <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
            </div>
            <small>Next Build Track: Induction &amp; Cooling</small>
            <small>Future garage pass.</small>
          </div>
        `,
        actions: [],
      });
    }
    if (exhaustLevel >= 5) {
      return renderIdleCard({
        title: "Exhaust",
        status: "Level 5 / 5 · Showcase Finish",
        copy: "Complete. The exhaust track is complete. It looks intentional from end to end.",
        extra: `
          <div class="nospill-afford-progress">
            <div class="nospill-afford-progress-head">
              <span>${GARAGE_BUILD_VALUE_LABEL}</span>
              <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
            </div>
            <small>Next Build Track: Suspension</small>
            <small>Future garage pass.</small>
          </div>
        `,
        actions: [],
      });
    }
    if (exhaustLevel >= 4) {
      return renderIdleCard({
        title: "Heat Wrapped",
        status: "Exhaust Level 4 / 5",
        copy: "The exhaust setup looks cared for, not rushed.",
        extra: `
          <div class="nospill-afford-progress">
            <div class="nospill-afford-progress-head">
              <span>${GARAGE_BUILD_VALUE_LABEL}</span>
              <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
            </div>
            <small>Next Exhaust Work: Showcase Finish</small>
            <small>Full Dream Garage comes later.</small>
          </div>
        `,
        actions: [],
      });
    }
    if (exhaustLevel >= 3) {
      return renderIdleCard({
        title: "Tuned Note",
        status: "Exhaust Level 3 / 5",
        copy: "The exhaust has a clean, confident note.",
        extra: `
          <div class="nospill-afford-progress">
            <div class="nospill-afford-progress-head">
              <span>${GARAGE_BUILD_VALUE_LABEL}</span>
              <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
            </div>
            <small>Next Exhaust Work: Heat Wrapped</small>
            <small>Full Dream Garage comes later.</small>
          </div>
        `,
        actions: [],
      });
    }
    return renderIdleCard({
      title: "Balanced Fitment",
      status: "Level 3 / 5",
      copy: "The car is starting to look planned, not abandoned. Wheels work is complete for now.",
      extra: `
        <div class="nospill-afford-progress">
          <div class="nospill-afford-progress-head">
            <span>${GARAGE_BUILD_VALUE_LABEL}</span>
            <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
          </div>
          <small>Future Wheels Work: Showpiece Fitment</small>
          <small>Next Dream Target: Exhaust · Full Dream Garage comes later.</small>
        </div>
      `,
      actions: [],
    });
  }
  return renderIdleCard({
    title: "First Dream Investment",
    status: target.ready ? "Wheels Ready" : target.fundLabel,
    copy: target.ready
      ? `Cash goes down now. ${GARAGE_BUILD_VALUE_LABEL} begins. Not faster. Smoother.`
      : "The covered car needs its first real part. Save Cash from the shop to start the build.",
    extra: `
      <div class="nospill-afford-progress">
        <div class="nospill-afford-progress-head">
          <span>${escapeHtml(target.fundLabel)}</span>
          <strong>${escapeHtml(progressText)}</strong>
        </div>
        <div
          class="nospill-afford-progress-bar"
          role="progressbar"
          aria-label="${escapeHtml(`${target.fundLabel} progress`)}"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${percent}"
        >
          <span style="width: ${percent}%"></span>
        </div>
        <small>${formatShopCount(percent)}% · ${target.ready ? "Start the dream build with the first real part." : "Save Cash from the shop to start the build."}</small>
        <small>Cash can be saved, spent, or invested into assets later. Net Worth V1 includes ${netWorthV1FormulaLabel(state)}.</small>
      </div>
    `,
    actions: target.ready && coveredCarTeaserSeen(state)
      ? [actionButton("Buy Wheels", "data-dream-build-action", "buy-wheels", false, "nospill-primary")]
      : [],
  });
}

function renderProjectCarValueCard(gameState) {
  if (appState.running || appState.calibrating) return "";
  const value = projectCarValueV1(gameState);
  if (value < 1) return "";
  return renderIdleCard({
    title: GARAGE_BUILD_VALUE_LABEL,
    status: formatCashCount(value),
    copy: "The covered build is gaining story and showcase value. This is not a speed upgrade.",
  });
}

function renderDreamBuildProgressCard(gameState) {
  if (appState.running || appState.calibrating) return "";
  const state = normalizeGameState(gameState);
  if (!dreamBuildProgressVisible(state)) return "";
  const progress = dreamBuildProgressSummary(state);
  const nextStep = nextDreamBuildStep(state);
  const projectValue = projectCarValueV1(state);
  const finalComplete = dreamBuildFinalBuildLevel(state) >= 2;
  return renderIdleCard({
    title: "Core Build Progress",
    status: finalComplete
      ? `Core Build Complete · ${formatShopCount(progress.completed)} / ${formatShopCount(progress.total)} work stages`
      : `${formatShopCount(progress.completed)} / ${formatShopCount(progress.total)} work stages`,
    copy: finalComplete
      ? "The first Tofu Garage build is complete. Car Management is unlocked."
      : "Fictional Tofu Garage build value. Does not affect Cup Test scoring.",
    extra: `
      <div class="nospill-afford-progress">
        <div
          class="nospill-afford-progress-bar"
          role="progressbar"
          aria-label="Dream Build Progress"
          aria-valuemin="0"
          aria-valuemax="${progress.total}"
          aria-valuenow="${progress.completed}"
        >
          <span style="width: ${progress.percent}%"></span>
        </div>
        <small>${GARAGE_BUILD_VALUE_LABEL}: ${escapeHtml(formatCashCount(projectValue))}</small>
        ${compactDetails("dream_build_details", "Dream Build details", `
          <p>Next Dream Step: ${escapeHtml(nextStep.title)}${nextStep.future ? " · future/target-only" : ""}</p>
          <p>${escapeHtml(nextStep.copy)}</p>
          <p>Wheels · Level ${escapeHtml(formatShopCount(progress.wheelsLevel))} / 5 · ${escapeHtml(progress.wheelsStatus)}</p>
          <p>Exhaust · Level ${escapeHtml(formatShopCount(progress.exhaustLevel))} / 5 · ${escapeHtml(progress.exhaustStatus)}</p>
          <p>Suspension · Level ${escapeHtml(formatShopCount(progress.suspensionLevel))} / 5 · ${escapeHtml(progress.suspensionStatus)}</p>
          <p>Tires &amp; Rubber · Level ${escapeHtml(formatShopCount(progress.tiresLevel))} / 5 · ${escapeHtml(progress.tiresStatus)}</p>
          <p>Brakes &amp; Control · Level ${escapeHtml(formatShopCount(progress.brakesLevel))} / 5 · ${escapeHtml(progress.brakesStatus)}</p>
          <p>Induction &amp; Cooling · Level ${escapeHtml(formatShopCount(progress.inductionLevel))} / 5 · ${escapeHtml(progress.inductionStatus)}</p>
          <p>Drivetrain &amp; Transmission · Level ${escapeHtml(formatShopCount(progress.drivetrainLevel))} / 5 · ${escapeHtml(progress.drivetrainStatus)}</p>
          <p>Aero, Styling &amp; Weight Reduction · Level ${escapeHtml(formatShopCount(progress.aeroLevel))} / 5 · ${escapeHtml(progress.aeroStatus)}</p>
          <p>Final Detail &amp; Shakedown · Step ${escapeHtml(formatShopCount(progress.finalBuildLevel))} / 2 · ${escapeHtml(progress.finalBuildStatus)}</p>
          <p>Net Worth V1 includes ${escapeHtml(netWorthV1FormulaLabel(state))}.</p>
        `)}
      </div>
    `,
  });
}

function renderDreamBuildOverviewSummaryCard(gameState) {
  if (appState.running || appState.calibrating) return "";
  const state = normalizeGameState(gameState);
  if (!dreamBuildInvestmentStarted(state)) return "";
  const progress = dreamBuildProgressSummary(state);
  const suspensionLabel = progress.suspensionLevel > 0 ? progress.suspensionStatus : "Next";
  const tiresLabel = progress.tiresLevel > 0 ? progress.tiresStatus : dreamBuildSuspensionLevel(state) >= 5 ? "Next" : "Future";
  const brakesLabel = progress.brakesLevel > 0 ? progress.brakesStatus : dreamBuildTiresLevel(state) >= 5 ? "Next" : "Future";
  const inductionStatus = inductionUnlockStatus(state);
  const inductionLabel = progress.inductionLevel > 0
    ? progress.inductionStatus
    : inductionStatus.unlocked
      ? "Next"
      : dreamBuildBrakesLevel(state) >= 5
        ? "Locked"
        : "Future";
  const drivetrainLabel = progress.drivetrainLevel > 0
    ? progress.drivetrainStatus
    : dreamBuildInductionLevel(state) >= 5
      ? "Next"
      : "Future";
  const aeroLabel = progress.aeroLevel > 0
    ? progress.aeroStatus
    : dreamBuildDrivetrainLevel(state) >= 5
      ? "Next"
      : "Future";
  const finalWork = nextDreamBuildFinalWork(state);
  const finalLabel = progress.finalBuildLevel >= 2
    ? "First Complete Build"
    : finalWork
      ? `Next: ${finalWork.title}`
      : dreamBuildAeroLevel(state) >= 5
        ? "Next"
        : "Future";
  const eventSummary = garageEventBoardOverviewSummary(state);
  return renderIdleCard({
    title: "Dream Build",
    status: progress.finalBuildLevel >= 2
      ? "First Complete Build"
      : `${formatShopCount(progress.completed)} / ${formatShopCount(progress.total)} work stages`,
    copy: progress.finalBuildLevel >= 2
      ? "First build complete. Car Management is unlocked."
      : "The covered build now has its own tab. Overview stays focused on the next shop move.",
    extra: `
      <div class="nospill-afford-progress">
        <small>Wheels: ${escapeHtml(progress.wheelsStatus)}</small>
        <small>Exhaust: ${escapeHtml(progress.exhaustStatus)}</small>
        <small>Suspension: ${escapeHtml(suspensionLabel)}</small>
        <small>Tires: ${escapeHtml(tiresLabel)}</small>
        <small>Brakes: ${escapeHtml(brakesLabel)}</small>
        <small>Induction: ${escapeHtml(inductionLabel)}</small>
        <small>Drivetrain: ${escapeHtml(drivetrainLabel)}</small>
        <small>Aero: ${escapeHtml(aeroLabel)}</small>
        <small>Final: ${escapeHtml(finalLabel)}</small>
        <small>${GARAGE_BUILD_VALUE_LABEL}: ${escapeHtml(formatCashCount(projectCarValueV1(state)))}</small>
        ${eventSummary ? `<small>Garage Event Board: ${escapeHtml(eventSummary)}</small>` : ""}
      </div>
    `,
    actions: dreamBuildTabUnlocked(state)
      ? [actionButton("Open Dream Build", "data-shop-tab", "dream_build", false, "nospill-secondary")]
      : [],
  });
}

function renderDreamBuildTracksCard(gameState) {
  if (appState.running || appState.calibrating) return "";
  const state = normalizeGameState(gameState);
  if (!dreamBuildInvestmentStarted(state)) return "";
  const progress = dreamBuildProgressSummary(state);
  const suspensionWork = nextDreamBuildSuspensionWork(state);
  const tiresWork = nextDreamBuildTiresWork(state);
  const brakesWork = nextDreamBuildBrakesWork(state);
  const inductionWork = nextDreamBuildInductionWork(state);
  const drivetrainWork = nextDreamBuildDrivetrainWork(state);
  const aeroWork = nextDreamBuildAeroWork(state);
  const finalWork = nextDreamBuildFinalWork(state);
  const inductionStatus = inductionUnlockStatus(state);
  const drivetrainStatus = drivetrainUnlockStatus(state);
  const aeroStatus = aeroUnlockStatus(state);
  const finalStatus = finalBuildUnlockStatus(state);
  const trackRows = [
    ["Wheels", progress.wheelsStatus],
    ["Exhaust", progress.exhaustStatus],
    ["Suspension", dreamBuildExhaustLevel(state) >= 5 || progress.suspensionLevel > 0 ? progress.suspensionStatus : "Future"],
    ["Tires", dreamBuildSuspensionLevel(state) >= 5 || progress.tiresLevel > 0 ? progress.tiresStatus : "Future"],
    ["Brakes", dreamBuildTiresLevel(state) >= 5 || progress.brakesLevel > 0 ? progress.brakesStatus : "Future"],
    ["Induction", inductionStatus.unlocked || progress.inductionLevel > 0 ? progress.inductionStatus : "Future"],
    ["Drivetrain", drivetrainStatus.unlocked || progress.drivetrainLevel > 0 ? progress.drivetrainStatus : "Future"],
    ["Aero", aeroStatus.unlocked || progress.aeroLevel > 0 ? progress.aeroStatus : "Future"],
    ["Final", finalStatus.unlocked || progress.finalBuildLevel > 0 ? progress.finalBuildStatus : "Future"],
  ];
  const futureTracks = trackRows
    .filter(([, status]) => status === "Future")
    .map(([name]) => name);
  const activeStep = nextDreamBuildStep(state);
  const detailLines = [
    dreamBuildExhaustLevel(state) < 5
      ? "Suspension & Chassis Geometry · Future Track · Complete the current implemented build track first."
      : suspensionWork
        ? `Suspension & Chassis Geometry · Next Work: ${suspensionWork.title} · ${formatCash(suspensionWork.cost)} Cash · +${formatCashCount(suspensionWork.valueAdded)} ${GARAGE_BUILD_VALUE_LABEL}`
        : "Suspension & Chassis Geometry · Complete · Next Build Track: Tires & Rubber.",
    dreamBuildSuspensionLevel(state) < 5
      ? "Tires & Rubber · Future Track · Complete Suspension & Chassis Geometry first."
      : tiresWork
        ? `Tires & Rubber · Next Work: ${tiresWork.title} · ${formatCash(tiresWork.cost)} Cash · +${formatCashCount(tiresWork.valueAdded)} ${GARAGE_BUILD_VALUE_LABEL}`
        : "Tires & Rubber · Complete · Next Build Track: Brakes & Control.",
    dreamBuildTiresLevel(state) < 5
      ? "Brakes & Control · Future Track · Complete Tires & Rubber first."
      : brakesWork
        ? `Brakes & Control · Next Work: ${brakesWork.title} · ${formatCash(brakesWork.cost)} Cash · +${formatCashCount(brakesWork.valueAdded)} ${GARAGE_BUILD_VALUE_LABEL}`
        : "Brakes & Control · Complete · Next Build Track: Induction & Cooling.",
    !inductionStatus.unlocked
      ? `Induction & Cooling · Future Track · ${inductionStatus.reason || "Complete Brakes & Control and Local Showcase first."}`
      : inductionWork
        ? `Induction & Cooling · Next Work: ${inductionWork.title} · ${formatCash(inductionWork.cost)} Cash · +${formatCashCount(inductionWork.valueAdded)} ${GARAGE_BUILD_VALUE_LABEL}`
        : "Induction & Cooling · Complete · Next Build Track: Drivetrain & Transmission, future garage pass.",
    !drivetrainStatus.unlocked
      ? `Drivetrain & Transmission · Future Track · ${drivetrainStatus.reason || "Complete Induction & Cooling first."}`
      : drivetrainWork
        ? `Drivetrain & Transmission · Next Work: ${drivetrainWork.title} · ${formatCash(drivetrainWork.cost)} Cash · +${formatCashCount(drivetrainWork.valueAdded)} ${GARAGE_BUILD_VALUE_LABEL}`
        : "Drivetrain & Transmission · Complete · Next Build Track: Aero, Styling & Weight Reduction.",
    !aeroStatus.unlocked
      ? `Aero, Styling & Weight Reduction · Future Track · ${aeroStatus.reason || "Complete Drivetrain & Transmission first."}`
      : aeroWork
        ? `Aero, Styling & Weight Reduction · Next Work: ${aeroWork.title} · ${formatCash(aeroWork.cost)} Cash · +${formatCashCount(aeroWork.valueAdded)} ${GARAGE_BUILD_VALUE_LABEL}`
        : "Aero, Styling & Weight Reduction · Complete · Next Core Build Step: Final Detail & Shakedown.",
    !finalStatus.unlocked
      ? `Final Detail & Shakedown · Future Step · ${finalStatus.reason || "Complete Aero, Styling & Weight Reduction first."}`
      : finalWork
        ? `Final Detail & Shakedown · Next Work: ${finalWork.title} · ${formatCash(finalWork.cost)} Cash · +${formatCashCount(finalWork.valueAdded)} ${GARAGE_BUILD_VALUE_LABEL}`
        : "First Complete Build · Core Build Complete · 40 / 40 · Next Era: Car Management.",
  ];
  return renderIdleCard({
    title: "Work Tracks",
    status: "Compact",
    copy: "Current build tracks at a glance.",
    extra: `
      <div class="nospill-afford-progress">
        ${trackRows.map(([name, status]) => `<small>${escapeHtml(name)}: ${escapeHtml(status)}</small>`).join("")}
        ${futureTracks.length ? compactDetails("dream_build_future_tracks", "Future Tracks", `
          <p>${escapeHtml(futureTracks.join(" · "))}</p>
          <p>Next tracked step: ${escapeHtml(activeStep.title)}${activeStep.future ? " · future/target-only" : ""}.</p>
        `) : ""}
        ${compactDetails("dream_build_track_details", "Track details", detailLines.map((line) => `<p>${escapeHtml(line)}</p>`).join(""))}
      </div>
    `,
  });
}

function renderFutureGarageManagementCard() {
  if (appState.running || appState.calibrating) return "";
  return renderIdleCard({
    title: "Future Garage Operations",
    status: "Future",
    copy: "Future updates will add multiple cars, collector offers, repeatable boards, and larger garage operations.",
  });
}

function garageTuningCatalogFocusLabel(gameState) {
  const state = normalizeGameState(gameState);
  if (dreamBuildFinalBuildLevel(state) >= 2) return "Car Management";
  if (dreamBuildAeroLevel(state) >= 5 || dreamBuildFinalBuildLevel(state) > 0) return "Final Detail & Shakedown";
  if (dreamBuildDrivetrainLevel(state) >= 5 || dreamBuildAeroLevel(state) > 0) return "Aero, Styling & Weight Reduction";
  if (dreamBuildInductionLevel(state) >= 5 || dreamBuildDrivetrainLevel(state) > 0) return "Drivetrain & Transmission";
  if (dreamBuildBrakesLevel(state) >= 5 || dreamBuildInductionLevel(state) > 0) return "Induction & Cooling";
  if (dreamBuildTiresLevel(state) >= 5 || dreamBuildBrakesLevel(state) > 0) return "Brakes & Control";
  if (dreamBuildSuspensionLevel(state) >= 5 || dreamBuildTiresLevel(state) > 0) return "Tires & Rubber";
  return "Suspension & Chassis Geometry";
}

function renderGarageTuningCatalogPreviewCard(gameState) {
  if (appState.running || appState.calibrating) return "";
  const focus = garageTuningCatalogFocusLabel(gameState);
  return renderIdleCard({
    title: "Garage Tuning Catalog",
    status: "Future catalog",
    copy: `Authentic tuning parts unlock across future garage eras. Current focus: ${focus}.`,
    extra: `
      ${compactDetails("dream_build_catalog_categories", "Catalog categories", `
        <div class="nospill-afford-progress">
          ${GARAGE_TUNING_CATALOG_CATEGORIES.map((category) => `<small>${escapeHtml(category)}</small>`).join("")}
        </div>
      `)}
    `,
  });
}

function garageEventBoardOverviewSummary(gameState) {
  const state = normalizeGameState(gameState);
  const board = garageEventBoardStatus(state);
  if (!board.visible) return "";
  if (!board.unlocked) {
    return board.netWorthReady
      ? "Tires & Rubber Level 5 needed."
      : "$100M Net Worth needed.";
  }
  if (allGarageEventsComplete(state)) return "First board complete.";
  const available = nextAvailableGarageEvent(state);
  if (available) {
    const afford = garageEventAffordability(available, state);
    return afford.canEnter ? `${available.title} available.` : `Grow Cash for ${available.title}.`;
  }
  const nextEvent = nextGarageEvent(state);
  return nextEvent ? `${nextEvent.title} preparing.` : "Future events preparing.";
}

function renderGarageEventCard(event, gameState) {
  const state = normalizeGameState(gameState);
  const requirement = garageEventRequirementStatus(event, state);
  const afford = garageEventAffordability(event, state);
  if (requirement.completed) {
    return `
      <article class="nospill-idle-card">
        <header>
          <strong>${escapeHtml(event.title)}</strong>
          <small>Complete</small>
        </header>
        <small>Badge: ${escapeHtml(event.badge)}</small>
      </article>
    `;
  }
  const rewardLine = `Reward: +${formatCashCount(event.cashReward)} Cash · +${formatCashCount(event.brandValueReward)} Brand Value · +${formatShopCount(event.garageReputationReward)} Garage Reputation`;
  const buttonDisabled = !requirement.unlocked || !afford.canEnter;
  const disabledReason = !requirement.unlocked
    ? requirement.reason
    : `Need ${formatCash(afford.missingCash)} more Cash.`;
  return `
    <article class="nospill-idle-card ${requirement.unlocked ? "" : "is-locked"}">
      <header>
        <strong>${escapeHtml(event.title)}</strong>
        <small>${requirement.unlocked ? `${formatCash(event.cost)} entry` : "Locked"}</small>
      </header>
      <small>${escapeHtml(event.copy)}</small>
      <div class="nospill-afford-progress">
        <small>${escapeHtml(rewardLine)}</small>
        ${requirement.unlocked ? `<small>Entry Cost: ${escapeHtml(formatCash(event.cost))} Cash</small>` : `<small>${escapeHtml(requirement.reason)}</small>`}
        ${requirement.unlocked && !afford.canEnter ? `<small>Need ${escapeHtml(formatCash(afford.missingCash))} more Cash.</small>` : ""}
      </div>
      <div class="nospill-idle-actions">
        ${actionButton(event.buttonLabel, "data-garage-event", event.id, buttonDisabled, "nospill-primary", disabledReason)}
      </div>
    </article>
  `;
}

function renderGarageEventBoardCard(gameState) {
  if (appState.running || appState.calibrating) return "";
  const state = normalizeGameState(gameState);
  const board = garageEventBoardStatus(state);
  if (!board.visible) return "";
  if (!board.unlocked) {
    const copy = board.netWorthReady
      ? "Reach Tires & Rubber Level 5 to prepare the build for events."
      : "Reach $100M Net Worth to unlock the first garage event board.";
    return renderIdleCard({
      title: "Garage Event Board",
      status: "Preparing",
      copy,
    });
  }
  const completed = completedGarageEventIds(state);
  const last = state.shop.garageEvents.lastEventResult;
  const lastLine = last
    ? `<small>Recent: ${escapeHtml(last.title)} complete.</small>`
    : "";
  const completeCopy = allGarageEventsComplete(state)
    ? `<p class="nospill-panel-helper"><strong>Garage Event Board Complete</strong> · The first event board is complete. Future event-board expansion will add repeatable boards, multiple cars, offers, and deeper garage operations.</p>`
    : "";
  return `
    <section class="nospill-idle-card" data-garage-event-board>
      <header>
        <strong>Garage Event Board</strong>
        <small>${completed.size} / ${GARAGE_EVENTS.length} complete</small>
      </header>
      <small>Send the current build to parked fictional events. Events use build progress, ${GARAGE_BUILD_VALUE_LABEL}, Brand Value, and Garage Reputation.</small>
      <div class="nospill-afford-progress">
        <small>Garage Reputation: ${escapeHtml(formatShopCount(garageReputationV1(state)))}</small>
        <small>Event Brand Value: ${escapeHtml(formatCashCount(garageEventBrandValueV1(state)))}</small>
        <small>Tofu Garage events are fictional game events. They do not affect Don't Spill the Cup scoring.</small>
        ${lastLine}
      </div>
      ${completeCopy}
      <div class="nospill-idle-grid">
        ${GARAGE_EVENTS.map((event) => renderGarageEventCard(event, state)).join("")}
      </div>
    </section>
  `;
}

function renderManagedCarCard(gameState) {
  const state = normalizeGameState(gameState);
  const currentCar = state.carManagement && state.carManagement.currentCar;
  if (!currentCar) return "";
  const note = sanitizeBuilderNote(currentCar.builderNote);
  const activeStatus = activeCarAssignmentStatus(state);
  const statusLabel = activeStatus.assignment
    ? activeStatus.ready ? "Ready to collect" : "On assignment"
    : "Available";
  const assignmentLine = activeStatus.assignment
    ? `<small>Current Assignment: ${escapeHtml(activeStatus.assignment.title)}</small>`
    : "";
  const returnsLine = activeStatus.assignment && !activeStatus.ready
    ? `<small>Returns in: ${escapeHtml(formatAssignmentDuration(activeStatus.remainingMs))}</small>`
    : "";
  return renderIdleCard({
    title: "Managed Car",
    status: `Core Build Complete · ${escapeHtml(currentCar.coreProgressAtCompletion || "40 / 40")}`,
    copy: currentCar.name || "First Complete Build",
    extra: `
      <div class="nospill-afford-progress">
        <small>${GARAGE_BUILD_VALUE_LABEL} at completion: ${escapeHtml(formatCashCount(currentCar.buildValueAtCompletion))}</small>
        <small>Builder Note: ${escapeHtml(note ? `"${note}"` : "None saved")}</small>
        <small>Status: ${escapeHtml(statusLabel)}</small>
        ${assignmentLine}
        ${returnsLine}
        <small>Car Management is fictional Tofu Garage gameplay and does not affect Don't Spill the Cup.</small>
      </div>
    `,
  });
}

function renderCarAssignmentCard(assignment, gameState) {
  const state = normalizeGameState(gameState);
  const requirement = carAssignmentRequirementStatus(assignment, state);
  const economics = carAssignmentEconomics(assignment, state);
  const activeStatus = activeCarAssignmentStatus(state);
  const active = activeStatus.assignment && activeStatus.assignment.id === assignment.id;
  const anotherActive = Boolean(activeStatus.assignment && activeStatus.assignment.id !== assignment.id);
  const completions = carAssignmentCompletions(state, assignment.id);
  const rewardPreview = carAssignmentRewardPreviewLine(economics);
  const netCashPreview = carAssignmentNetCashLine(economics);
  const canStart = requirement.unlocked
    && !activeStatus.assignment
    && cashBalance(state) >= economics.entryCost
    && !appState.running
    && !appState.calibrating;
  const disabledReason = !requirement.unlocked
    ? requirement.reason
    : anotherActive
      ? "Another assignment is active."
      : cashBalance(state) < economics.entryCost
        ? `Need ${formatCash(economics.entryCost - cashBalance(state))} more Cash.`
        : "";
  if (active) {
    const progress = activeStatus.ready ? 100 : carAssignmentProgressPercent(activeStatus.active, activeStatus.remainingMs);
    const preview = activeStatus.active && activeStatus.active.rewardPreview
      ? {
        cashReward: safeNonNegativeInteger(activeStatus.active.rewardPreview.cashReward, economics.cashReward, SHOP_MAX_RESOURCE),
        brandValueReward: safeNonNegativeInteger(activeStatus.active.rewardPreview.brandValueReward, economics.brandValueReward, SHOP_MAX_RESOURCE),
        garageReputationReward: safeNonNegativeInteger(activeStatus.active.rewardPreview.garageReputationReward, economics.garageReputationReward, SHOP_MAX_RESOURCE),
      }
      : economics;
    return renderIdleCard({
      title: assignment.title,
      status: activeStatus.ready
        ? "Ready to collect"
        : "Active",
      copy: activeStatus.ready
        ? `${assignment.title} complete. Rewards are waiting.`
        : `One assignment at a time. The car is currently at ${assignment.title}.`,
      extra: `
        <div class="nospill-afford-progress">
          <small>State: ${activeStatus.ready ? "Ready to collect" : "Active"}</small>
          ${activeStatus.ready ? "" : `<small>Returns in ${escapeHtml(formatAssignmentDuration(activeStatus.remainingMs))} · ${escapeHtml(formatShopCount(progress))}% complete</small>`}
          <div class="nospill-afford-progress-bar" aria-label="Assignment progress"><span style="width:${escapeHtml(String(progress))}%"></span></div>
          <small>Rewards waiting: +${escapeHtml(formatCashCount(preview.cashReward))} Cash · +${escapeHtml(formatCashCount(preview.brandValueReward))} Brand Value · +${escapeHtml(formatShopCount(preview.garageReputationReward))} Garage Reputation</small>
        </div>
      `,
      actions: [
        actionButton("Collect Rewards", "data-car-assignment-collect", assignment.id, !activeStatus.ready, "nospill-primary", `Ready in ${formatAssignmentDuration(activeStatus.remainingMs)}.`),
      ],
    });
  }
  const stateLabel = requirement.unlocked
    ? completions > 0 ? "Completed before · Available again" : "Available"
    : "Locked";
  const statusLabel = requirement.unlocked
    ? stateLabel
    : "Locked";
  const affordabilityLine = requirement.unlocked
    ? cashBalance(state) >= economics.entryCost ? "Ready" : `Need ${formatCash(economics.entryCost - cashBalance(state))} more Cash.`
    : carAssignmentUnlockRequirementLabel(assignment);
  const actions = requirement.unlocked && !anotherActive
    ? [actionButton(assignment.buttonLabel, "data-car-assignment-start", assignment.id, !canStart, "nospill-primary", disabledReason)]
    : [];
  return renderIdleCard({
    title: assignment.title,
    status: statusLabel,
    copy: requirement.unlocked ? assignment.copy : carAssignmentUnlockRequirementLabel(assignment),
    locked: !requirement.unlocked,
    extra: `
      <div class="nospill-afford-progress">
        <small>State: ${escapeHtml(stateLabel)}</small>
        <small>Cost: ${escapeHtml(formatCash(economics.entryCost))} Cash</small>
        <small>Duration: ${escapeHtml(formatAssignmentDuration(assignment.durationMs))}</small>
        <small>${escapeHtml(rewardPreview)}</small>
        <small>${escapeHtml(netCashPreview)}</small>
        <small>${escapeHtml(affordabilityLine)}</small>
        ${completions > 0 ? `<small>Completed ${escapeHtml(formatShopCount(completions))} ${completions === 1 ? "time" : "times"}</small>` : ""}
        ${anotherActive ? "<small>Another assignment is active. Start buttons pause until the car returns.</small>" : ""}
      </div>
    `,
    actions,
  });
}

function renderCarManagementLoopChecklist(gameState) {
  const state = normalizeGameState(gameState);
  const complete = allCarAssignmentsCompletedOnce(state);
  const rows = CAR_ASSIGNMENTS.map((assignment) => {
    const done = carAssignmentCompletions(state, assignment.id) >= 1;
    return `
      <label class="nospill-checkline">
        <input type="checkbox" disabled ${done ? "checked" : ""}>
        <span>${escapeHtml(assignment.title)}</span>
      </label>
    `;
  }).join("");
  return `
    <section class="nospill-idle-card" data-car-management-loop>
      <header>
        <strong>${complete ? "First Car Management Loop Complete" : "First Car Management Loop"}</strong>
        <small>${formatShopCount(CAR_ASSIGNMENTS.filter((assignment) => carAssignmentCompletions(state, assignment.id) >= 1).length)} / ${formatShopCount(CAR_ASSIGNMENTS.length)}</small>
      </header>
      <div class="nospill-checklist">${rows}</div>
      <small>${complete
        ? "The first completed build is now a managed garage asset. Next: Second Car, future garage pass."
        : "Complete each assignment once to prove the first managed-car loop."}</small>
    </section>
  `;
}

function renderCarManagementHistory(gameState) {
  const state = normalizeGameState(gameState);
  const history = (state.carManagement && Array.isArray(state.carManagement.assignmentHistory))
    ? state.carManagement.assignmentHistory.slice(0, 3)
    : [];
  if (!history.length) return "";
  const rows = history.map((result) => `
    <small>${escapeHtml(result.title || "Assignment")} · +${escapeHtml(formatCashCount(result.cashReward))} Cash · +${escapeHtml(formatShopCount(result.garageReputationReward))} Rep</small>
  `).join("");
  return `
    <section class="nospill-idle-card" data-car-management-history>
      <header>
        <strong>Recent Assignment Results</strong>
        <small>Last ${formatShopCount(history.length)}</small>
      </header>
      <div class="nospill-afford-progress">${rows}</div>
    </section>
  `;
}

function renderSecondBayChecklist(gameState) {
  const state = normalizeGameState(gameState);
  const rows = CAR_ASSIGNMENTS.map((assignment) => {
    const done = carAssignmentCompletions(state, assignment.id) >= 1;
    return `
      <label class="nospill-checkline">
        <input type="checkbox" disabled ${done ? "checked" : ""}>
        <span>${escapeHtml(assignment.title)}</span>
      </label>
    `;
  }).join("");
  const reputation = garageReputationV1(state);
  return `
    <div class="nospill-checklist">${rows}</div>
    <div class="nospill-afford-progress">
      <small>Garage Reputation: ${escapeHtml(formatShopCount(reputation))} / ${escapeHtml(formatShopCount(SECOND_BAY_OPEN_REPUTATION_COST))}</small>
    </div>
  `;
}

function renderSecondBayCard(gameState) {
  const state = normalizeGameState(gameState);
  const status = secondBayStatus(state);
  const project = status.project;
  if (project.acquired) {
    return renderIdleCard({
      title: "Second Project Car",
      status: "Stage: Rolling Shell",
      copy: "The first completed build stays managed. The second car starts as a new project shell.",
      extra: `
        <div class="nospill-afford-progress">
          <small>${GARAGE_BUILD_VALUE_LABEL}: +${escapeHtml(formatCashCount(SECOND_PROJECT_CAR_GARAGE_VALUE))}</small>
          <small>Second Car Build Tracks: Future garage pass.</small>
          <small>No second-car assignments or fleet controls are added in this pass.</small>
        </div>
      `,
    });
  }
  if (project.bayOpened) {
    const disabledReason = status.missingAcquireCash > 0
      ? `Need ${formatCash(status.missingAcquireCash)} more Cash.`
      : status.missingAcquireReputation > 0
        ? `Need ${formatShopCount(status.missingAcquireReputation)} more Garage Reputation.`
        : "";
    return renderIdleCard({
      title: "Second Bay Open",
      status: "Project shell available",
      copy: "Acquire the second project car shell.",
      extra: `
        <div class="nospill-afford-progress">
          <small>Cost: ${escapeHtml(formatCash(SECOND_PROJECT_CAR_COST))} Cash + ${escapeHtml(formatShopCount(SECOND_PROJECT_CAR_REPUTATION_COST))} Garage Reputation</small>
          <small>${GARAGE_BUILD_VALUE_LABEL}: +${escapeHtml(formatCashCount(SECOND_PROJECT_CAR_GARAGE_VALUE))}</small>
          <small>The first completed build stays managed. The second car starts as a new project shell.</small>
          <small>${disabledReason || "Ready"}</small>
        </div>
      `,
      actions: [
        actionButton("Acquire Second Project Car", "data-second-car-action", "acquire", !status.canAcquire, "nospill-primary", disabledReason),
      ],
    });
  }
  const loopMessage = status.loopComplete
    ? "First Car Management loop complete."
    : "Complete the first Car Management loop to expand the garage.";
  const reputationMessage = status.reputation >= SECOND_BAY_OPEN_REPUTATION_COST
    ? "Garage Reputation ready."
    : `Reach ${formatShopCount(SECOND_BAY_OPEN_REPUTATION_COST)} Garage Reputation to expand the garage.`;
  if (!status.loopComplete || status.reputation < SECOND_BAY_OPEN_REPUTATION_COST) {
    return renderIdleCard({
      title: "Second Bay",
      status: "Locked",
      copy: !status.loopComplete
        ? "Complete the first Car Management loop to expand the garage."
        : "Reach 250 Garage Reputation to expand the garage.",
      locked: true,
      extra: `
        ${renderSecondBayChecklist(state)}
        <div class="nospill-afford-progress">
          <small>${escapeHtml(loopMessage)}</small>
          <small>${escapeHtml(reputationMessage)}</small>
        </div>
      `,
    });
  }
  const disabledReason = status.missingOpenCash > 0
    ? `Need ${formatCash(status.missingOpenCash)} more Cash.`
    : "";
  return renderIdleCard({
    title: "Second Bay Ready",
    status: "Ready to open",
    copy: "Open a second project bay and prepare for the next car.",
    extra: `
      ${renderSecondBayChecklist(state)}
      <div class="nospill-afford-progress">
        <small>Cost: ${escapeHtml(formatCash(SECOND_BAY_OPEN_COST))} Cash + ${escapeHtml(formatShopCount(SECOND_BAY_OPEN_REPUTATION_COST))} Garage Reputation</small>
        <small>${disabledReason || "Ready"}</small>
      </div>
    `,
    actions: [
      actionButton("Open Second Bay", "data-second-car-action", "open_bay", !status.canOpen, "nospill-primary", disabledReason),
    ],
  });
}

function renderCarManagementPanel(gameState) {
  if (appState.running || appState.calibrating) return "";
  const state = normalizeGameState(gameState);
  if (!carManagementTabUnlocked(state)) {
    return `
      <h4>Car Management</h4>
      <p class="nospill-panel-helper">Car Management unlocks after First Complete Build.</p>
    `;
  }
  const last = state.carManagement.lastAssignmentResult;
  const lastLine = last
    ? `<p class="nospill-panel-helper">Recent: ${escapeHtml(last.title)} complete.</p>`
    : "";
  return `
    <h4>Car Management</h4>
    <p class="nospill-panel-helper">Send the completed build to parked fictional assignments. Assignments earn Cash, Brand Value, and Garage Reputation.</p>
    <div class="nospill-idle-grid">
      ${renderManagedCarCard(state)}
      <section class="nospill-idle-card" data-car-management-board>
        <header>
          <strong>Assignment Board</strong>
          <small>${formatShopCount(garageReputationV1(state))} Garage Reputation</small>
        </header>
        <small>Car Management is fictional Tofu Garage gameplay and does not affect Don't Spill the Cup.</small>
        <div class="nospill-afford-progress">
          <small>Managed Brand Value: ${escapeHtml(formatCashCount(carManagementBrandValueV1(state)))}</small>
          <small>One active assignment at a time. Rewards are granted only when collected.</small>
          <small>Garage Event Board is the one-time event progression board. Car Management is ongoing use of the completed car as a managed asset.</small>
        </div>
        ${lastLine}
      </section>
      ${renderCarManagementLoopChecklist(state)}
      ${renderSecondBayCard(state)}
      ${renderCarManagementHistory(state)}
      ${CAR_ASSIGNMENTS.map((assignment) => renderCarAssignmentCard(assignment, state)).join("")}
    </div>
  `;
}

function carManagementOverviewSummary(gameState) {
  const state = normalizeGameState(gameState);
  if (!carManagementUnlocked(state)) return "";
  const active = activeCarAssignmentStatus(state);
  if (active.assignment) {
    return active.ready
      ? `${active.assignment.title} ready to collect.`
      : `${active.assignment.title} in progress · ${formatAssignmentDuration(active.remainingMs)} remaining.`;
  }
  const secondBay = secondBayStatus(state);
  if (secondBay.acquired) return "Second Project Car acquired. Future build tracks coming.";
  if (secondBay.bayOpened) return "Second Bay open. Second Project Car available.";
  if (secondBay.loopComplete && secondBay.reputation >= SECOND_BAY_OPEN_REPUTATION_COST) return "Second Bay ready.";
  if (allCarAssignmentsCompletedOnce(state)) return "First car management loop complete. Grow Garage Reputation for Second Bay.";
  const nextAssignment = nextAvailableCarAssignment(state);
  return nextAssignment ? `${nextAssignment.title} available.` : "Assignments preparing.";
}

function renderCarManagementOverviewCard(gameState) {
  if (appState.running || appState.calibrating) return "";
  const state = normalizeGameState(gameState);
  const summary = carManagementOverviewSummary(state);
  if (!summary) return "";
  return renderIdleCard({
    title: "Car Management",
    status: "Completed car",
    copy: summary,
    actions: carManagementTabUnlocked(state)
      ? [actionButton("Open Car Management", "data-shop-tab", "car_management", false, "nospill-secondary")]
      : [],
  });
}

function renderDreamBuildPanel(gameState) {
  if (appState.running || appState.calibrating) return "";
  const state = normalizeGameState(gameState);
  if (!dreamBuildTabUnlocked(state)) {
    return `
      <h4>Dream Build</h4>
      <p class="nospill-panel-helper">Dream Build unlocks after the covered build starts.</p>
    `;
  }
  const progress = dreamBuildProgressSummary(state);
  return `
    <h4>Dream Build</h4>
    <p class="nospill-panel-helper"><strong>Current Build</strong> · ${formatShopCount(progress.completed)} / ${formatShopCount(progress.total)} work stages · ${GARAGE_BUILD_VALUE_LABEL}: ${escapeHtml(formatCashCount(projectCarValueV1(state)))}. Fictional Tofu Garage build value. Does not affect Cup Test scoring.</p>
    <div class="nospill-idle-grid">
      ${renderDreamBuildProgressCard(state)}
      ${renderDreamInvestmentTargetCard(state)}
      ${renderDreamBuildTracksCard(state)}
      ${renderBuilderNoteCard(state)}
      ${compactDetails("dream_build_garage_events", "Garage Events", renderGarageEventBoardCard(state) || "<p>Garage Event Board appears after the build reaches its event-ready threshold.</p>")}
      ${compactDetails("dream_build_future_management", "Future Garage", `
        <div class="nospill-idle-grid">
          ${renderGarageTuningCatalogPreviewCard(state)}
          ${renderFutureGarageManagementCard()}
        </div>
      `)}
    </div>
  `;
}

function renderBuilderNoteCard(gameState) {
  if (appState.running || appState.calibrating) return "";
  const state = normalizeGameState(gameState);
  if (!builderNoteVisible(state)) return "";
  const note = builderNoteValue(state);
  const count = Array.from(note).length;
  const editing = !note || Boolean(appState.builderNoteEditing);
  if (!editing) {
    return renderIdleCard({
      title: "Builder Note",
      status: "Saved locally",
      copy: "",
      extra: `
        <div class="nospill-builder-note-card is-collapsed">
          <div class="nospill-builder-note-display" aria-label="Saved Builder Note">
            <span>Builder Note</span>
            <strong>${escapeHtml(`"${note}"`)}</strong>
          </div>
          <div class="nospill-builder-note-actions">
            <button type="button" class="nospill-secondary" data-builder-note-action="edit">Edit</button>
          </div>
        </div>
      `,
      actions: [],
    });
  }
  const presetButtons = BUILDER_NOTE_PRESETS.map((preset) => `
    <button
      type="button"
      class="nospill-secondary nospill-builder-note-chip"
      data-builder-note-preset="${escapeHtml(preset)}"
    >${escapeHtml(preset)}</button>
  `).join("");
  return renderIdleCard({
    title: "Builder Note",
    status: note ? "Saved locally" : "Optional story note",
    copy: "Write one short note about this build. Local-only, parked-only, and cosmetic.",
    extra: `
      <div class="nospill-builder-note-card">
        <label class="nospill-builder-note-label" for="builder-note-input">
          <span>Builder Note</span>
          <small data-builder-note-count>${escapeHtml(`${count} / ${BUILDER_NOTE_MAX_LENGTH}`)}</small>
        </label>
        <input
          id="builder-note-input"
          class="nospill-builder-note-input"
          data-builder-note-input
          type="text"
          maxlength="${BUILDER_NOTE_MAX_LENGTH}"
          autocomplete="off"
          value="${escapeHtml(note)}"
          placeholder="Built after too many tofu shifts."
          aria-describedby="builder-note-help"
        />
        <p id="builder-note-help" class="nospill-builder-note-help">Max ${BUILDER_NOTE_MAX_LENGTH} characters. This note stays in your local Tofu Garage save.</p>
        <div class="nospill-builder-note-chips" aria-label="Builder Note presets">
          ${presetButtons}
        </div>
        <div class="nospill-builder-note-display" aria-label="Saved Builder Note">
          <span>Builder Note</span>
          <strong>${note ? escapeHtml(`"${note}"`) : "No builder note yet."}</strong>
        </div>
        <div class="nospill-builder-note-actions">
          <button type="button" class="nospill-primary" data-builder-note-action="save">Save Note</button>
          <button type="button" class="nospill-secondary" data-builder-note-action="clear">Clear</button>
        </div>
      </div>
    `,
    actions: [],
  });
}

function dreamInvestmentReturningNote(gameState) {
  const state = normalizeGameState(gameState);
  if (!dreamInvestmentTargetVisible(state)) return "";
  const target = dreamInvestmentTargetProgress(state);
  if (target.purchased) {
    const work = nextDreamBuildWheelsWork(state);
    if (work && cashBalance(state) >= work.cost) return `Dream Build work is ready: ${work.title}`;
    const exhaustWork = nextDreamBuildExhaustWork(state);
    if (exhaustWork && cashBalance(state) >= exhaustWork.cost) return `Dream Build work is ready: ${exhaustWork.title}`;
    const suspensionWork = nextDreamBuildSuspensionWork(state);
    if (suspensionWork && cashBalance(state) >= suspensionWork.cost) return `Dream Build work is ready: ${suspensionWork.title}`;
    const tiresWork = nextDreamBuildTiresWork(state);
    if (tiresWork && cashBalance(state) >= tiresWork.cost) return `Dream Build work is ready: ${tiresWork.title}`;
    const brakesWork = nextDreamBuildBrakesWork(state);
    if (brakesWork && cashBalance(state) >= brakesWork.cost) return `Dream Build work is ready: ${brakesWork.title}`;
    const inductionWork = nextDreamBuildInductionWork(state);
    if (inductionWork && cashBalance(state) >= inductionWork.cost) return `Dream Build work is ready: ${inductionWork.title}`;
    const drivetrainWork = nextDreamBuildDrivetrainWork(state);
    if (drivetrainWork && cashBalance(state) >= drivetrainWork.cost) return `Dream Build work is ready: ${drivetrainWork.title}`;
    const aeroWork = nextDreamBuildAeroWork(state);
    if (aeroWork && cashBalance(state) >= aeroWork.cost) return `Dream Build work is ready: ${aeroWork.title}`;
    const finalWork = nextDreamBuildFinalWork(state);
    if (finalWork && cashBalance(state) >= finalWork.cost) return `Dream Build work is ready: ${finalWork.title}`;
    const sponsor = sponsorInquiryStatus(state);
    if (sponsor.unlocked && !sponsor.accepted) return "Sponsor Inquiry available";
    const showcase = showcasePrepStatus(state);
    if (showcase.unlocked && !showcase.prepared && showcase.affordable) return "Showcase Prep is affordable";
    if (dreamBuildProgressVisible(state)) {
      const progress = dreamBuildProgressSummary(state);
      const nextStep = nextDreamBuildStep(state);
      if (nextStep.future) return `Next Dream Step: ${nextStep.title}, future.`;
      return `Dream Build: ${formatShopCount(progress.completed)} / ${formatShopCount(progress.total)} work stages complete.`;
    }
    return "Wheels are installed";
  }
  if (target.ready) return "The Wheels Fund is ready";
  return `You are ${formatShopCount(target.percent)}% of the way to the Wheels Fund`;
}

function netWorthReturningNote(gameState) {
  const state = normalizeGameState(gameState);
  if (!shouldShowNetWorthV1(state)) return "";
  const latest = latestNetWorthMilestone(state);
  const stored = storedNetWorthMilestoneIds(state);
  if (latest && stored.has(latest.id)) {
    return `You reached ${latest.label.replace(" Net Worth", " Net Worth")} while away`;
  }
  const next = nextNetWorthMilestone(state);
  if (next && next.id === "net_worth_1m") {
    const progress = nextMilestoneProgress(netWorthV1(state), next.amount);
    return `${formatShopCount(progress.percent)}% of the way to ${next.label}`;
  }
  return "";
}

function renderNetWorthCard(gameState) {
  if (appState.running || appState.calibrating) return "";
  const state = normalizeGameState(gameState);
  if (!shouldShowNetWorthV1(state)) return "";
  const progress = netWorthProgress(state);
  const businessValue = tofuBusinessValue(state);
  const projectValue = projectCarValueV1(state);
  const brandValue = brandValueV1(state);
  const cash = cashBalance(state);
  const percent = Math.max(0.01, Math.min(100, progress.percent));
  const brandValueRow = brandValue > 0
    ? `
        <div class="nospill-afford-progress-head">
          <span>Brand Value</span>
          <strong>${escapeHtml(formatCashCount(brandValue))}</strong>
        </div>
      `
    : "";
  const buildValueRow = projectValue > 0
    ? `
        <div class="nospill-afford-progress-head">
          <span>${GARAGE_BUILD_VALUE_LABEL}</span>
          <strong>${escapeHtml(formatCashCount(projectValue))}</strong>
        </div>
      `
    : "";
  return renderIdleCard({
    title: "Net Worth",
    status: `${formatCashCount(progress.current)} toward $1T`,
    copy: "Cash, shop growth, garage work, and brand value move the long road.",
    extra: `
      <div class="nospill-afford-progress">
        <div class="nospill-afford-progress-head">
          <span>Cash</span>
          <strong>${escapeHtml(formatCashCount(cash))}</strong>
        </div>
        <div class="nospill-afford-progress-head">
          <span>Tofu Business Value</span>
          <strong>${escapeHtml(formatCashCount(businessValue))}</strong>
        </div>
        ${buildValueRow}
        ${brandValueRow}
        <div class="nospill-afford-progress-head">
          <span>Current era: Tofu Garage</span>
          <strong>${escapeHtml(`${roundTo(percent, percent < 1 ? 3 : 1)}%`)}</strong>
        </div>
        <div
          class="nospill-afford-progress-bar"
          role="progressbar"
          aria-label="Progress toward $1T Net Worth"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${escapeHtml(String(roundTo(percent, 3)))}"
        >
          <span style="width: ${percent}%"></span>
        </div>
        ${compactDetails("net_worth_formula", "What counts toward Net Worth?", `
          <p>Formula: ${escapeHtml(netWorthV1FormulaLabel(state))}.</p>
          <p>Cash can be spent now or invested into careful garage/story value later.</p>
        `)}
      </div>
    `,
  });
}

function renderNetWorthMilestoneCard(gameState) {
  if (appState.running || appState.calibrating) return "";
  const state = normalizeGameState(gameState);
  if (!shouldShowNetWorthV1(state)) return "";
  const current = netWorthV1(state);
  const latest = latestNetWorthMilestone(state);
  const next = nextNetWorthMilestone(state);
  if (latest && latest.amount <= current && latest.id === "net_worth_1t") {
    return renderIdleCard({
      title: "Net Worth Milestone Reached",
      status: latest.reachedLabel,
      copy: "The long-road target is complete. Future endgame status remains a later design pass.",
    });
  }
  if (latest && latest.amount <= current && latest.id === "net_worth_1m") {
    const nextAfterReached = NET_WORTH_MILESTONES.find((milestone) => milestone.amount > current) || next;
    return renderIdleCard({
      title: "Net Worth Milestone Reached",
      status: latest.reachedLabel,
      copy: "The project is starting to get attention.",
      extra: `<small>Next: ${escapeHtml(nextAfterReached.label)}</small>`,
    });
  }
  const target = current >= next.amount
    ? NET_WORTH_MILESTONES.find((milestone) => milestone.amount > current) || next
    : next;
  const progress = nextMilestoneProgress(current, target.amount);
  return renderIdleCard({
    title: "Next Net Worth Milestone",
    status: target.label,
    copy: `Reward: ${target.reward}`,
    extra: `
      <div class="nospill-afford-progress">
        <div class="nospill-afford-progress-head">
          <span>${escapeHtml(formatCashCount(progress.current))} / ${escapeHtml(formatCashCount(progress.required))}</span>
          <strong>${escapeHtml(`${formatShopCount(progress.percent)}%`)}</strong>
        </div>
        <div
          class="nospill-afford-progress-bar"
          role="progressbar"
          aria-label="${escapeHtml(`Progress toward ${target.label}`)}"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${escapeHtml(String(progress.percent))}"
        >
          <span style="width: ${progress.percent}%"></span>
        </div>
      </div>
    `,
  });
}

function renderShowcaseInterestCard(gameState) {
  if (appState.running || appState.calibrating) return "";
  const state = normalizeGameState(gameState);
  const showcase = showcasePrepStatus(state);
  if (!showcase.unlocked) return "";
  if (showcase.prepared) {
    const sponsor = sponsorInquiryStatus(state);
    const sponsorLine = sponsor.accepted
      ? "Sponsor Inquiry accepted."
      : sponsor.unlocked
        ? "Sponsor Inquiry is available."
        : "Sponsor Inquiry unlocks with enough Net Worth and Dream Build progress.";
    return renderIdleCard({
      title: "Showcase Display Prepared",
      status: "First presentation setup",
      copy: "The car has its first real presentation setup.",
      extra: `
        <div class="nospill-afford-progress">
          <div class="nospill-afford-progress-head">
            <span>${GARAGE_BUILD_VALUE_LABEL}</span>
            <strong>${escapeHtml(formatCashCount(projectCarValueV1(state)))}</strong>
          </div>
          <small>Showcase Display contribution: +${escapeHtml(formatCashCount(SHOWCASE_PREP_VALUE))}</small>
          <small>${escapeHtml(sponsorLine)}</small>
        </div>
      `,
    });
  }
  return renderIdleCard({
    title: "Showcase Interest",
    status: "Local Showcase Interest",
    copy: "The project is starting to get noticed. A small local showcase wants to see the car when it is ready.",
    extra: `
      <div class="nospill-afford-progress">
        <div class="nospill-afford-progress-head">
          <span>Prepare Showcase Display</span>
          <strong>${escapeHtml(formatCash(SHOWCASE_PREP_COST))}</strong>
        </div>
        <small>Effect: ${GARAGE_BUILD_VALUE_LABEL} +${escapeHtml(formatCashCount(SHOWCASE_PREP_VALUE))}</small>
        <small>Unlocks: Sponsor Inquiry after the first Net Worth milestone.</small>
        ${showcase.affordable ? "" : `<small>Need ${escapeHtml(formatCash(showcase.missingCash))} more Cash.</small>`}
      </div>
    `,
    actions: [
      actionButton(
        "Prepare Showcase Display",
        "data-dream-build-action",
        "prepare-showcase",
        !showcase.affordable,
        "nospill-primary",
        `Need ${formatCash(showcase.missingCash)} more Cash.`,
      ),
    ],
  });
}

function renderSponsorInquiryCard(gameState) {
  if (appState.running || appState.calibrating) return "";
  const state = normalizeGameState(gameState);
  const sponsor = sponsorInquiryStatus(state);
  if (!sponsor.unlocked) return "";
  if (sponsor.accepted) {
    return renderIdleCard({
      title: "Sponsor Interest",
      status: "Local sponsor onboarded",
      copy: "The car has its first business attention. Sponsor packages come later.",
      extra: `
        <div class="nospill-afford-progress">
          <div class="nospill-afford-progress-head">
            <span>Brand Value</span>
            <strong>${escapeHtml(formatCashCount(sponsor.brandValue))}</strong>
          </div>
          <small>One-time Sponsor Inquiry accepted. No recurring sponsor income yet.</small>
        </div>
      `,
    });
  }
  return renderIdleCard({
    title: "Sponsor Inquiry",
    status: "Local parts sponsor",
    copy: "A local parts sponsor noticed the careful garage build. They want their name near the first display.",
    extra: `
      <div class="nospill-afford-progress">
        <div class="nospill-afford-progress-head">
          <span>Reward</span>
          <strong>+${escapeHtml(formatCashCount(sponsor.cashReward))} Cash</strong>
        </div>
        <small>Brand Value +${escapeHtml(formatCashCount(sponsor.brandValueReward))}</small>
        <small>One-time V1 opportunity. Sponsor packages remain future.</small>
      </div>
    `,
    actions: [
      actionButton(
        "Accept Sponsor Inquiry",
        "data-dream-build-action",
        "accept-sponsor-inquiry",
        false,
        "nospill-primary",
      ),
    ],
  });
}

function recentShopReward(gameState) {
  const state = normalizeGameState(gameState);
  return (state.recentRewards || []).find((reward) => reward && reward.type === "shop_order") || null;
}

function renderRecentShopRewardCard(state) {
  const reward = recentShopReward(state);
  if (!reward) return "";
  const shopXp = safeNonNegativeInteger(reward.shopXpGained ?? reward.xpGained, 0, SHOP_MAX_RESOURCE);
  const detail = reward.tipsGained
    ? `+${formatCashCount(reward.tipsGained)} · ${recentRewardDisplayLabel(reward)}`
    : recentRewardDisplayLabel(reward);
  const xpLine = shopXp > 0 ? ` Shop XP +${formatShopCount(shopXp)}.` : "";
  return renderIdleCard({
    title: "Recent Shop Reward",
    status: "Shop Progress",
    copy: `${detail}.${xpLine}`.trim(),
  });
}

function renderDriverBonusCard(state) {
  if (appState.running || appState.calibrating) return "";
  const bonus = driverShopReputationBonus(state);
  if (bonus.percent < 1) return "";
  return renderIdleCard({
    title: "Driver Bonus",
    status: `Delivery Driver Level ${formatShopCount(bonus.level)}`,
    copy: `Shop confidence bonus: +${formatShopCount(bonus.percent)}% Reputation from orders. Earn Driver XP from Don't Spill the Cup.`,
    actions: [actionButton("View Delivery Board", "data-surface-target", "cup-test", false)],
  });
}

function renderCounterServiceCard(state) {
  if (appState.running || appState.calibrating) return "";
  if (!isCounterServiceUnlocked(state)) return "";
  const service = state.shop.counterService;
  const progress = counterServiceProgress(state, new Date());
  const income = counterServiceIncomeStatus(state);
  const status = service.running ? "Running" : "Paused";
  const interval = counterServiceIntervalSeconds(state);
  const batchSize = counterServiceBatchSize(state);
  const conciseStatus = service.running
    ? `Running · ${progress.message.replace(/^Counter Service\s*/i, "")}`
    : "Paused";
  const blocker = service.running && !income.active ? `Blocked: ${income.text.replace(/^Counter Service\s*/i, "")}` : "";
  return renderIdleCard({
    title: "Counter Service",
    status: conciseStatus,
    copy: service.running
      ? "Customers hand off prepared orders for Cash."
      : "Start automatic handoffs when the shop is parked.",
    extra: `
      <div class="nospill-counter-service">
        <div class="nospill-counter-service-row">
          <span>Batch</span>
          <strong>${formatShopCount(batchSize)} order${batchSize === 1 ? "" : "s"}</strong>
        </div>
        <div class="nospill-counter-service-row">
          <span>Rate</span>
          <strong>1 handoff / ${formatShopCount(interval)} sec</strong>
        </div>
        <div class="nospill-counter-service-row">
          <span>Income</span>
          <strong>${escapeHtml(income.text)}</strong>
        </div>
        <div
          class="nospill-counter-service-bar"
          role="progressbar"
          aria-label="Counter Service next handoff"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${progress.percent}"
        >
          <span style="width: ${progress.percent}%"></span>
        </div>
        ${blocker ? `<small>${escapeHtml(blocker)}</small>` : ""}
        ${compactDetails("counter_service_details", "Counter details", `
          <p>Priority: ${escapeHtml(counterServicePriorityLabel(service.priority))}</p>
          ${income.detail ? `<p>${escapeHtml(income.detail)}</p>` : ""}
        `)}
        ${service.lastResult ? `<small>${escapeHtml(service.lastResult)}</small>` : ""}
      </div>
    `,
    actions: service.running
      ? [actionButton("Pause Counter Service", "data-counter-service-action", "pause", false, "nospill-secondary")]
      : [actionButton("Start Counter Service", "data-counter-service-action", "start", false, "nospill-primary")],
  }).replace('class="nospill-idle-card', 'data-counter-service-card="true" class="nospill-idle-card');
}

function nextMilestoneProgress(current, required) {
  const safeRequired = Math.max(1, safeNonNegativeNumber(required, 1, SHOP_MAX_RESOURCE));
  const safeCurrent = safeNonNegativeNumber(current, 0, SHOP_MAX_RESOURCE);
  return {
    current: Math.min(safeCurrent, safeRequired),
    required: safeRequired,
    percent: clampPercent(Math.round((safeCurrent / safeRequired) * 1000) / 10),
  };
}

function stationUnlockProgressFor(stationId, gameState) {
  const state = normalizeGameState(gameState);
  if (stationId === "delivery_shelf") {
    const orderProgress = nextMilestoneProgress(fulfilledShopOrderCount(state), 10);
    if (state.stamps.first_family_tofu_tray) {
      return { current: 1, required: 1, percent: 100, text: "Family Tofu Tray fulfilled" };
    }
    return {
      ...orderProgress,
      text: `${formatShopCount(orderProgress.current)} / ${formatShopCount(orderProgress.required)} orders fulfilled`,
    };
  }
  if (stationId === "shop_sign") {
    const repProgress = nextMilestoneProgress(state.shop.reputation, 10);
    const tipProgress = nextMilestoneProgress(state.shop.lifetimeTips, 100);
    const stationProgress = state.shop.stations.delivery_shelf > 0
      ? { current: 1, required: 1, percent: 100, text: "Delivery Shelf owned" }
      : repProgress.percent >= tipProgress.percent
        ? {
            ...repProgress,
            text: `${formatShopCount(repProgress.current)} / ${formatShopCount(repProgress.required)} Reputation`,
          }
        : {
            ...tipProgress,
            text: `${formatCash(tipProgress.current)} / ${formatCash(tipProgress.required)} lifetime Cash`,
          };
    return stationProgress;
  }
  return { current: 0, required: 1, percent: 0, text: "Keep growing the shop" };
}

function nextVisibleStationMilestone(gameState, options = {}) {
  const state = normalizeGameState(gameState);
  const preferredStationIds = options.stationIds || ["tofu_press", "prep_counter", "delivery_shelf", "shop_sign"];
  const candidates = preferredStationIds
    .map((stationId) => {
      const station = shopStationById(stationId);
      const owned = safeNonNegativeInteger(state.shop.stations[stationId], 0, 100000);
      const milestone = nextStationMilestone(stationId, owned);
      if (!station || !milestone || !stationIsUnlocked(station, state)) return null;
      const progress = nextMilestoneProgress(owned, milestone.threshold);
      const cost = stationCost(station, owned);
      return {
        station,
        stationId,
        owned,
        milestone,
        cost,
        progress,
        close: milestone.threshold - owned <= 2,
        affordable: state.shop.tips >= cost && state.shop.prepSlots >= station.prepSlotCost,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.affordable !== b.affordable) return a.affordable ? -1 : 1;
      if (a.close !== b.close) return a.close ? -1 : 1;
      return (b.progress.percent - a.progress.percent) || (a.cost - b.cost);
    });
  return candidates[0] || null;
}

function nextMilestoneForShop(gameState) {
  const state = normalizeGameState(gameState);
  const fulfilled = fulfilledShopOrderCount(state);
  if (state.shop.lifetimeTips < 1) {
    const simpleOrder = shopOrderTypeById("simple_tofu_box");
    const targetTips = simpleOrder ? simpleOrder.tips : 10;
    const progress = nextMilestoneProgress(state.shop.lifetimeTips, targetTips);
    return {
      id: "first_tips_earned",
      name: "First Cash Earned",
      progressText: `${formatCash(progress.current)} / ${formatCash(progress.required)} lifetime Cash`,
      percent: progress.percent,
      reward: "First shop payout",
      guidance: "The starter shop runs by itself. Watch Counter Service complete the first Simple Tofu Box.",
    };
  }

  if (!state.stamps.first_shop_order && fulfilled < 1) {
    const progress = nextMilestoneProgress(fulfilled, 1);
    return {
      id: "first_shop_order",
      name: "First Shop Order",
      progressText: `${formatShopCount(progress.current)} / ${formatShopCount(progress.required)} order fulfilled`,
      percent: progress.percent,
      reward: "First Passport stamp",
      guidance: "Counter Service can earn this stamp automatically from the starter shop.",
    };
  }

  if (!state.stamps.first_upgrade_purchased && !hasShopStationUpgrade(state)) {
    const progress = nextMilestoneProgress(hasShopStationUpgrade(state) ? 1 : 0, 1);
    return {
      id: "first_upgrade_purchased",
      name: "First Upgrade Purchased",
      progressText: `${formatShopCount(progress.current)} / ${formatShopCount(progress.required)} upgrade purchased`,
      percent: progress.percent,
      reward: "Upgrade stamp and a new shop layer",
      guidance: "Buy the bottleneck-solving upgrade or station when it becomes affordable.",
    };
  }

  if (!state.stamps.first_10_orders && fulfilled < 10) {
    const progress = nextMilestoneProgress(fulfilled, 10);
    return {
      id: "first_10_orders",
      name: "First 10 Orders",
      progressText: `${formatShopCount(progress.current)} / ${formatShopCount(progress.required)} orders fulfilled`,
      percent: progress.percent,
      reward: "New shop support",
      guidance: "Keep converting prepared orders into Cash from tips.",
    };
  }

  if (!state.stamps.first_family_tofu_tray) {
    const family = SHOP_ORDER_TYPES.find((orderType) => orderType.id === "family_tofu_tray");
    const unlocked = shopOrderTypeUnlocked(family, state);
    const ready = readyDeliveryOrders(state.shop);
    const tofuProgress = nextMilestoneProgress(state.shop.tofuStock, family.tofuRequired);
    const orderProgress = nextMilestoneProgress(ready, family.deliveryOrdersRequired);
    const unlockProgress = nextMilestoneProgress(fulfilled, 5);
    const percent = unlocked
      ? Math.min(tofuProgress.percent, orderProgress.percent)
      : unlockProgress.percent;
    return {
      id: "first_family_tofu_tray",
      name: "First Family Tofu Tray",
      progressText: unlocked
        ? `Need ${formatShopCost(family.tofuRequired)} Tofu Stock and ${formatShopCount(family.deliveryOrdersRequired)} ready order`
        : `${formatShopCount(unlockProgress.current)} / ${formatShopCount(unlockProgress.required)} orders before Family Tofu Tray`,
      percent,
      reward: "Larger shop orders",
      guidance: unlocked
        ? "Build enough stock and one ready order for a larger payout."
        : "Fulfill a few more orders to reveal the first larger order.",
    };
  }

  if (!state.stamps.first_100_tips && state.shop.lifetimeTips < 100) {
    const progress = nextMilestoneProgress(state.shop.lifetimeTips, 100);
    return {
      id: "first_100_tips",
      name: "First $100 Cash",
      progressText: `${formatCash(progress.current)} / ${formatCash(progress.required)} lifetime Cash`,
      percent: progress.percent,
      reward: "Long-road story beat",
      guidance: "Fulfill orders and buy upgrades that improve the counter.",
    };
  }

  const deliveryShelf = shopStationById("delivery_shelf");
  if (deliveryShelf && state.shop.stations.delivery_shelf < 1) {
    const unlocked = stationIsUnlocked(deliveryShelf, state);
    const progress = stationUnlockProgressFor("delivery_shelf", state);
    return {
      id: "delivery_shelf_unlock",
      name: "Delivery Shelf Unlock",
      progressText: unlocked ? "Delivery Shelf is ready in Production" : progress.text,
      percent: unlocked ? 100 : progress.percent,
      reward: "Prep Counter support",
      guidance: unlocked
        ? "Buy Delivery Shelf when order throughput needs support."
        : "Keep fulfilling orders to earn the first support station.",
    };
  }

  const shopSign = shopStationById("shop_sign");
  if (shopSign && state.shop.stations.shop_sign < 1) {
    const unlocked = stationIsUnlocked(shopSign, state);
    const progress = stationUnlockProgressFor("shop_sign", state);
    return {
      id: "shop_sign_unlock",
      name: "Shop Sign Unlock",
      progressText: unlocked ? "Shop Sign is ready in Production" : progress.text,
      percent: unlocked ? 100 : progress.percent,
      reward: "Reputation support",
      guidance: unlocked
        ? "Buy Shop Sign when reputation starts to matter."
        : "Earn Reputation or lifetime Cash to make the shop known.",
    };
  }

  if (coveredCarTeaserUnlocked(state) && !coveredCarTeaserSeen(state)) {
    return {
      id: "covered_car_teaser",
      name: "Look Behind the Shop",
      progressText: "Managed shop ready",
      percent: 100,
      reward: "A dream build teaser",
      guidance: "The Tofu Shop is steady enough to reveal the covered car without starting full car building yet.",
    };
  }

  const managerUpgradeMilestone = nextManagerDeskUpgrade(state, false);
  if (readyDeliveryOrders(state.shop) >= deliveryOrderQueueCapacity() && managerUpgradeMilestone) {
    const level = safeNonNegativeInteger(
      state.shop.stationUpgrades[managerUpgradeMilestone.id],
      0,
      managerUpgradeMilestone.maxLevel,
    );
    const costTips = stationUpgradeCostTips(managerUpgradeMilestone, level);
    const costReputation = stationUpgradeCostReputation(managerUpgradeMilestone, level);
    const cashProgress = nextMilestoneProgress(state.shop.tips, costTips);
    const reputationProgress = nextMilestoneProgress(state.shop.reputation, costReputation);
    const percent = Math.min(cashProgress.percent, reputationProgress.percent);
    return {
      id: managerUpgradeMilestone.id,
      name: managerUpgradeMilestone.name,
      progressText: `${formatCash(cashProgress.current)} / ${formatCash(cashProgress.required)} Cash · ${formatShopCount(reputationProgress.current)} / ${formatShopCount(reputationProgress.required)} Reputation`,
      percent,
      reward: managerUpgradeMilestone.effect,
      guidance: "The order queue is full. Manager Desk upgrades are the managed-shop answer.",
    };
  }

  if (dreamInvestmentTargetVisible(state) && !urgentShopPriorityBeforeDreamInvestment(state)) {
    const target = dreamInvestmentTargetProgress(state);
    if (target.purchased) {
      const work = nextDreamBuildWheelsWork(state);
      if (work) {
        const progress = nextMilestoneProgress(cashBalance(state), work.cost);
        return {
          id: work.action,
          name: work.title,
          progressText: `${formatCash(progress.current)} / ${formatCash(progress.required)} Cash`,
          percent: progress.percent,
          reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(work.valueAdded)}`,
          guidance: work.copy,
        };
      }
      const exhaustWork = nextDreamBuildExhaustWork(state);
      if (exhaustWork) {
        const progress = nextMilestoneProgress(cashBalance(state), exhaustWork.cost);
        return {
          id: exhaustWork.action === "buy-exhaust" ? "dream_investment_buy_exhaust" : exhaustWork.action,
          name: exhaustWork.action === "buy-exhaust"
            ? (progress.current >= progress.required ? "Buy Exhaust" : "Save for Exhaust")
            : exhaustWork.title,
          progressText: exhaustWork.action === "buy-exhaust" && progress.current >= progress.required
            ? "Exhaust Fund is ready"
            : `${formatCash(progress.current)} / ${formatCash(progress.required)} Cash`,
          percent: progress.percent,
          reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(exhaustWork.valueAdded)}`,
          guidance: exhaustWork.copy,
        };
      }
      const suspensionWork = nextDreamBuildSuspensionWork(state);
      if (suspensionWork) {
        const progress = nextMilestoneProgress(cashBalance(state), suspensionWork.cost);
        return {
          id: suspensionWork.action,
          name: suspensionWork.title,
          progressText: `${formatCash(progress.current)} / ${formatCash(progress.required)} Cash`,
          percent: progress.percent,
          reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(suspensionWork.valueAdded)}`,
          guidance: suspensionWork.copy,
        };
      }
      const tiresWork = nextDreamBuildTiresWork(state);
      if (tiresWork) {
        const progress = nextMilestoneProgress(cashBalance(state), tiresWork.cost);
        return {
          id: tiresWork.action,
          name: tiresWork.title,
          progressText: `${formatCash(progress.current)} / ${formatCash(progress.required)} Cash`,
          percent: progress.percent,
          reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(tiresWork.valueAdded)}`,
          guidance: tiresWork.copy,
        };
      }
      const brakesWork = nextDreamBuildBrakesWork(state);
      if (brakesWork) {
        const progress = nextMilestoneProgress(cashBalance(state), brakesWork.cost);
        return {
          id: brakesWork.action,
          name: brakesWork.title,
          progressText: `${formatCash(progress.current)} / ${formatCash(progress.required)} Cash`,
          percent: progress.percent,
          reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(brakesWork.valueAdded)}`,
          guidance: brakesWork.copy,
        };
      }
      const inductionWork = nextDreamBuildInductionWork(state);
      if (inductionWork) {
        const progress = nextMilestoneProgress(cashBalance(state), inductionWork.cost);
        return {
          id: inductionWork.action,
          name: inductionWork.title,
          progressText: `${formatCash(progress.current)} / ${formatCash(progress.required)} Cash`,
          percent: progress.percent,
          reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(inductionWork.valueAdded)}`,
          guidance: inductionWork.copy,
        };
      }
      const drivetrainWork = nextDreamBuildDrivetrainWork(state);
      if (drivetrainWork) {
        const progress = nextMilestoneProgress(cashBalance(state), drivetrainWork.cost);
        return {
          id: drivetrainWork.action,
          name: drivetrainWork.title,
          progressText: `${formatCash(progress.current)} / ${formatCash(progress.required)} Cash`,
          percent: progress.percent,
          reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(drivetrainWork.valueAdded)}`,
          guidance: drivetrainWork.copy,
        };
      }
      const aeroWork = nextDreamBuildAeroWork(state);
      if (aeroWork) {
        const progress = nextMilestoneProgress(cashBalance(state), aeroWork.cost);
        return {
          id: aeroWork.action,
          name: aeroWork.title,
          progressText: `${formatCash(progress.current)} / ${formatCash(progress.required)} Cash`,
          percent: progress.percent,
          reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(aeroWork.valueAdded)}`,
          guidance: aeroWork.copy,
        };
      }
      const showcase = showcasePrepStatus(state);
      if (showcase.unlocked && !showcase.prepared) {
        const progress = nextMilestoneProgress(cashBalance(state), showcase.cost);
        return {
          id: "prepare_showcase_display",
          name: "Prepare Showcase Display",
          progressText: `${formatCash(progress.current)} / ${formatCash(progress.required)} Cash`,
          percent: progress.percent,
          reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(showcase.valueAdded)}`,
          guidance: "The project is getting attention. Prepare it for its first display.",
        };
      }
      const sponsor = sponsorInquiryStatus(state);
      if (sponsor.unlocked && !sponsor.accepted && !urgentShopBottleneckBeforeShowcase(state)) {
        return {
          id: "accept_sponsor_inquiry",
          name: "Sponsor Inquiry",
          progressText: "Ready",
          percent: 100,
          reward: `+${formatCashCount(sponsor.cashReward)} Cash and +${formatCashCount(sponsor.brandValueReward)} Brand Value`,
          guidance: "The first display build is starting to attract business.",
        };
      }
      const netWorthMilestone = nextNetWorthMilestone(state);
      if (netWorthMilestone && netWorthV1(state) < netWorthMilestone.amount) {
        const progress = nextMilestoneProgress(netWorthV1(state), netWorthMilestone.amount);
        return {
          id: netWorthMilestone.id,
          name: netWorthMilestone.label,
          progressText: `${formatCashCount(progress.current)} / ${formatCashCount(progress.required)}`,
          percent: progress.percent,
          reward: netWorthMilestone.reward,
          guidance: netWorthGrowthGuidance(state),
        };
      }
      const nextTarget = dreamBuildNextTargetProgress(state);
      const buildProgress = dreamBuildProgressSummary(state);
      const nextStep = nextDreamBuildStep(state);
      return {
        id: "dream_build_progress",
        name: "Dream Build Progress",
        progressText: `${formatShopCount(buildProgress.completed)} / ${formatShopCount(buildProgress.total)} work stages`,
        percent: buildProgress.percent || nextTarget.percent,
        reward: "First smooth garage-build path",
        guidance: `Next Dream Step: ${nextStep.title}. ${nextStep.future ? "Future garage work; keep growing Cash." : nextStep.copy}`,
      };
    }
    return {
      id: target.ready ? "dream_investment_buy_wheels" : "dream_investment_wheels",
      name: target.ready ? "Buy Wheels" : "Save for Wheels",
      progressText: target.ready
        ? "Wheels Fund is ready"
        : `${formatCash(target.current)} / ${formatCash(target.required)} Cash`,
      percent: target.percent,
      reward: target.ready ? "First Dream Build investment" : "First Dream Build investment target",
      guidance: target.ready
        ? `Spend Cash on Wheels to start ${GARAGE_BUILD_VALUE_LABEL}.`
        : "Save Cash from the shop for the first visible garage-build target.",
    };
  }

  const closeStationMilestone = nextVisibleStationMilestone(state);
  if (closeStationMilestone && (closeStationMilestone.close || closeStationMilestone.affordable)) {
    return {
      id: `station_${closeStationMilestone.stationId}_${closeStationMilestone.milestone.threshold}`,
      name: `${formatShopCount(closeStationMilestone.milestone.threshold)} ${closeStationMilestone.station.name}`,
      progressText: `${formatShopCount(closeStationMilestone.progress.current)} / ${formatShopCount(closeStationMilestone.progress.required)} owned`,
      percent: closeStationMilestone.progress.percent,
      reward: closeStationMilestone.milestone.reward,
      guidance: `Buy ${closeStationMilestone.station.name} when it matches the current bottleneck.`,
    };
  }

  const counterUpgrade = visibleRelevantStationUpgrades(state).find((upgrade) => (
    upgrade.stationId === "counter_service"
    && safeNonNegativeInteger(state.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel) < upgrade.maxLevel
  ));
  const showcasePriority = showcasePrepStatus(state);
  if (showcasePriority.unlocked && !showcasePriority.prepared && !urgentShopBottleneckBeforeShowcase(state)) {
    const progress = nextMilestoneProgress(cashBalance(state), showcasePriority.cost);
    return {
      id: "prepare_showcase_display",
      name: "Prepare Showcase Display",
      progressText: `${formatCash(progress.current)} / ${formatCash(progress.required)} Cash`,
      percent: progress.percent,
      reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(showcasePriority.valueAdded)}`,
      guidance: "The project is getting attention. Prepare it for its first display.",
    };
  }
  const sponsorPriority = sponsorInquiryStatus(state);
  if (sponsorPriority.unlocked && !sponsorPriority.accepted && !urgentShopBottleneckBeforeShowcase(state)) {
    return {
      id: "accept_sponsor_inquiry",
      name: "Sponsor Inquiry",
      progressText: "Ready",
      percent: 100,
      reward: `+${formatCashCount(sponsorPriority.cashReward)} Cash and +${formatCashCount(sponsorPriority.brandValueReward)} Brand Value`,
      guidance: "The first display build is starting to attract business.",
    };
  }
  if (shouldShowNetWorthV1(state) && !(showcasePriority.unlocked && !showcasePriority.prepared)) {
    const netWorthMilestone = nextNetWorthMilestone(state);
    if (netWorthMilestone && netWorthV1(state) < netWorthMilestone.amount) {
      const progress = nextMilestoneProgress(netWorthV1(state), netWorthMilestone.amount);
      return {
        id: netWorthMilestone.id,
        name: netWorthMilestone.label,
        progressText: `${formatCashCount(progress.current)} / ${formatCashCount(progress.required)}`,
        percent: progress.percent,
        reward: netWorthMilestone.reward,
        guidance: netWorthGrowthGuidance(state),
      };
    }
  }
  if (counterUpgrade) {
    const level = safeNonNegativeInteger(state.shop.stationUpgrades[counterUpgrade.id], 0, counterUpgrade.maxLevel);
    const cost = stationUpgradeCostTips(counterUpgrade, level);
    const progress = nextMilestoneProgress(state.shop.tips, cost);
    return {
      id: counterUpgrade.id,
      name: counterUpgrade.name,
      progressText: `${formatCash(progress.current)} / ${formatCash(progress.required)}`,
      percent: progress.percent,
      reward: counterUpgrade.effect,
      guidance: stationUpgradeIsRevealed(counterUpgrade, state)
        ? stationUpgradeWhyItMatters(counterUpgrade)
        : stationUpgradeRevealReason(counterUpgrade, state),
    };
  }

  const cateringCrate = shopOrderTypeById("catering_crate");
  if (cateringCrate && !shopOrderTypeUnlocked(cateringCrate, state)) {
    const ordersProgress = nextMilestoneProgress(fulfilled, 100);
    const reputationProgress = nextMilestoneProgress(state.shop.reputation, 250);
    const levelProgress = nextMilestoneProgress(state.shop.shopLevel, 25);
    const progress = [ordersProgress, reputationProgress, levelProgress]
      .sort((a, b) => a.percent - b.percent)[0];
    return {
      id: "catering_crate_unlock",
      name: "Catering Crate",
      progressText: progress === ordersProgress
        ? `${formatShopCount(progress.current)} / ${formatShopCount(progress.required)} orders fulfilled`
        : progress === reputationProgress
          ? `${formatShopCount(progress.current)} / ${formatShopCount(progress.required)} Reputation`
          : `Shop Level ${formatShopCount(progress.current)} / ${formatShopCount(progress.required)}`,
      percent: progress.percent,
      reward: "A larger managed-shop order",
      guidance: "Grow the managed counter so bulk pickups have a bigger order target.",
    };
  }

  const managerUpgrade = nextManagerDeskUpgrade(state, false);
  if (managerUpgrade) {
    const level = safeNonNegativeInteger(state.shop.stationUpgrades[managerUpgrade.id], 0, managerUpgrade.maxLevel);
    const tipsProgress = nextMilestoneProgress(state.shop.tips, stationUpgradeCostTips(managerUpgrade, level));
    const reputationProgress = nextMilestoneProgress(state.shop.reputation, stationUpgradeCostReputation(managerUpgrade, level));
    const progress = tipsProgress.percent < reputationProgress.percent ? tipsProgress : reputationProgress;
    return {
      id: managerUpgrade.id,
      name: managerUpgrade.name,
      progressText: progress === tipsProgress
        ? `${formatCash(progress.current)} / ${formatCash(progress.required)}`
        : `${formatShopCost(progress.current)} / ${formatShopCost(progress.required)} Reputation`,
      percent: progress.percent,
      reward: managerUpgrade.effect,
      guidance: stationUpgradeWhyItMatters(managerUpgrade),
    };
  }
  const stationMilestone = closeStationMilestone || nextVisibleStationMilestone(state);
  if (stationMilestone) {
    return {
      id: `station_${stationMilestone.stationId}_${stationMilestone.milestone.threshold}`,
      name: `${formatShopCount(stationMilestone.milestone.threshold)} ${stationMilestone.station.name}`,
      progressText: `${formatShopCount(stationMilestone.progress.current)} / ${formatShopCount(stationMilestone.progress.required)} owned`,
      percent: stationMilestone.progress.percent,
      reward: stationMilestone.milestone.reward,
      guidance: `Buy ${stationMilestone.station.name} when it matches the current bottleneck.`,
    };
  }

  return {
    id: "managed_shop",
    name: "Managed Shop Phase",
    progressText: "Keep balancing stock, prep, and automatic handoffs",
    percent: 100,
    reward: "A smoother managed counter",
    guidance: "Tune station counts, bulk handoffs, and larger orders before future shop layers arrive.",
  };
}

function renderNextMilestoneCard(state) {
  if (appState.running || appState.calibrating) return "";
  const milestone = nextMilestoneForShop(state);
  const percent = clampPercent(milestone.percent);
  return `
    <section class="nospill-next-milestone" aria-label="Next shop milestone">
      <div class="nospill-next-milestone-head">
        <span>Next Milestone</span>
        <strong>${escapeHtml(milestone.name)}</strong>
      </div>
      <div class="nospill-next-milestone-progress">
        <span>${escapeHtml(milestone.progressText)}</span>
        <strong>${formatShopCount(percent)}%</strong>
      </div>
      <div
        class="nospill-next-milestone-bar"
        role="progressbar"
        aria-label="${escapeHtml(`Progress toward ${milestone.name}`)}"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${percent}"
      >
        <span style="width: ${percent}%"></span>
      </div>
      <p><strong>Reward:</strong> ${escapeHtml(milestone.reward)}</p>
      <p>${escapeHtml(milestone.guidance)}</p>
      ${shouldShowNetWorthV1(state) ? `<p class="nospill-long-road">Net Worth: ${formatCashCount(netWorthV1(state))} / $1T · Current era: Tofu Garage</p>` : ""}
    </section>
  `;
}

function stripNextPrefix(value) {
  return String(value || "").replace(/^Next:\s*/i, "").trim();
}

function goalStackTargetForAction(action) {
  if (!action || action.disabled) return "";
  if (action.type === "buy_upgrade") return "upgrades";
  if (action.type === "buy_station") return "production";
  if (action.type === "use_spirit_boost") return "spirit";
  if (
    action.type === "watch_starter_shop"
    || action.type === "queue_full"
    || action.type === "wait_counter_service"
    || action.type === "start_counter_service"
  ) {
    return "counter-service";
  }
  if (
    action.type === "buy_dream_wheels"
    || action.type === "buy_dream_wheels_work"
    || action.type === "buy_dream_exhaust"
    || action.type === "buy_dream_exhaust_work"
    || action.type === "buy_dream_suspension_work"
    || action.type === "buy_dream_tires_work"
    || action.type === "buy_dream_brakes_work"
    || action.type === "buy_dream_induction_work"
    || action.type === "buy_dream_drivetrain_work"
    || action.type === "buy_dream_aero_work"
    || action.type === "buy_dream_final_work"
    || action.type === "dream_investment_target"
    || action.type === "prepare_showcase"
    || action.type === "showcase_prep_target"
    || action.type === "accept_sponsor_inquiry"
    || action.type === "enter_garage_event"
    || action.type === "garage_event_target"
  ) {
    return "dream-build";
  }
  if (
    action.type === "start_car_assignment"
    || action.type === "collect_car_assignment"
    || action.type === "car_assignment_active"
    || action.type === "car_management_target"
  ) {
    return "car-management";
  }
  if (action.type === "net_worth_milestone") return "net-worth";
  if (action.type === "covered_car_teaser") return "overview";
  return "";
}

function goalStackCta(label, target) {
  if (!label || !target) return "";
  return "";
}

function dreamBuildImplementedCapReached(gameState) {
  const state = normalizeGameState(gameState);
  return dreamBuildWheelsLevel(state) >= 3
    && dreamBuildExhaustLevel(state) >= 5
    && dreamBuildSuspensionLevel(state) >= 5
    && dreamBuildTiresLevel(state) >= 5
    && dreamBuildBrakesLevel(state) >= 5
    && dreamBuildInductionLevel(state) >= 5
    && dreamBuildDrivetrainLevel(state) >= 5
    && dreamBuildAeroLevel(state) >= 5
    && dreamBuildFinalBuildLevel(state) >= 2;
}

function carManagementPinnedGoal(gameState) {
  const state = normalizeGameState(gameState);
  if (!carManagementUnlocked(state)) return null;
  const active = activeCarAssignmentStatus(state);
  if (active.assignment) {
    return {
      id: active.ready ? "collect_car_assignment" : "car_assignment_active",
      title: active.ready ? "Collect Assignment Result" : "Assignment in progress",
      body: active.ready
        ? "The completed build returned with rewards."
        : "Collect rewards when the car returns.",
      progressCurrent: active.ready ? 1 : Math.max(0, active.active.durationMs - active.remainingMs),
      progressTarget: active.ready ? 1 : active.active.durationMs,
      progressLabel: active.ready
        ? "Ready to collect"
        : `${formatAssignmentDuration(active.remainingMs)} remaining`,
      reward: active.ready ? "Cash, Brand Value, and Garage Reputation" : "Assignment rewards pending",
      ctaLabel: "",
      ctaTarget: "",
      isFutureOnly: false,
    };
  }
  if (allCarAssignmentsCompletedOnce(state)) {
    const secondBay = secondBayStatus(state);
    if (secondBay.acquired) {
      return {
        id: "second_project_car_acquired",
        title: "Second Project Car acquired",
        body: "Second car build tracks come in a future garage pass.",
        progressCurrent: 1,
        progressTarget: 1,
        progressLabel: "Rolling Shell ready",
        reward: "Future second car build tracks",
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: true,
      };
    }
    if (secondBay.bayOpened) {
      return {
        id: "acquire_second_project_car",
        title: "Acquire Second Project Car",
        body: "Start the next project.",
        progressCurrent: cashBalance(state),
        progressTarget: SECOND_PROJECT_CAR_COST,
        progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(SECOND_PROJECT_CAR_COST)} Cash · ${formatShopCount(secondBay.reputation)} / ${formatShopCount(SECOND_PROJECT_CAR_REPUTATION_COST)} Garage Reputation`,
        reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(SECOND_PROJECT_CAR_GARAGE_VALUE)}`,
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: false,
      };
    }
    if (secondBay.reputation < SECOND_BAY_OPEN_REPUTATION_COST) {
      return {
        id: "grow_garage_reputation",
        title: "Grow Garage Reputation",
        body: "Second Bay unlocks at 250 Garage Reputation.",
        progressCurrent: secondBay.reputation,
        progressTarget: SECOND_BAY_OPEN_REPUTATION_COST,
        progressLabel: `${formatShopCount(secondBay.reputation)} / ${formatShopCount(SECOND_BAY_OPEN_REPUTATION_COST)} Garage Reputation`,
        reward: "Second Bay access",
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: false,
      };
    }
    if (!secondBay.bayOpened) {
      return {
        id: "open_second_bay",
        title: "Open Second Bay",
        body: "Expand the garage for the next project car.",
        progressCurrent: cashBalance(state),
        progressTarget: SECOND_BAY_OPEN_COST,
        progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(SECOND_BAY_OPEN_COST)} Cash · ${formatShopCount(secondBay.reputation)} / ${formatShopCount(SECOND_BAY_OPEN_REPUTATION_COST)} Garage Reputation`,
        reward: "Second project bay",
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: false,
      };
    }
    return {
      id: "first_car_managed",
      title: "First car managed",
      body: "Second car comes in a future garage pass.",
      progressCurrent: CAR_ASSIGNMENTS.length,
      progressTarget: CAR_ASSIGNMENTS.length,
      progressLabel: `${formatShopCount(CAR_ASSIGNMENTS.length)} / ${formatShopCount(CAR_ASSIGNMENTS.length)} assignments introduced`,
      reward: "Future second car",
      ctaLabel: "",
      ctaTarget: "",
      isFutureOnly: true,
    };
  }
  const assignment = nextAvailableCarAssignment(state) || nextCarAssignment(state);
  if (!assignment) {
    return {
      id: "car_management",
      title: "Car Management",
      body: "Send the completed build to its first parked assignment.",
      progressCurrent: 0,
      progressTarget: 1,
      progressLabel: "First Complete Build ready",
      reward: "Cash, Brand Value, and Garage Reputation",
      ctaLabel: "",
      ctaTarget: "",
      isFutureOnly: false,
    };
  }
  const economics = carAssignmentEconomics(assignment, state);
  const status = carAssignmentRequirementStatus(assignment, state);
  const affordable = cashBalance(state) >= economics.entryCost;
  return {
    id: assignment.id,
    title: status.unlocked
      ? affordable ? assignment.title : `Grow Cash for ${assignment.title}`
      : "Car Management",
    body: status.unlocked
      ? assignment.id === "showcase_rotation"
        ? "The first completed build is ready to manage."
        : "The next parked assignment is ready."
      : status.reason,
    progressCurrent: cashBalance(state),
    progressTarget: economics.entryCost,
    progressLabel: status.unlocked
      ? `${formatCashCount(cashBalance(state))} / ${formatCashCount(economics.entryCost)} Cash`
      : status.reason,
    reward: `+${formatCashCount(economics.cashReward)} Cash, +${formatCashCount(economics.brandValueReward)} Brand Value, +${formatShopCount(economics.garageReputationReward)} Garage Reputation`,
    ctaLabel: "",
    ctaTarget: "",
    isFutureOnly: false,
  };
}

function pinnedNearGoalForShop(gameState) {
  const state = normalizeGameState(gameState);
  if (appState.running || appState.calibrating) return null;
  const readyOrders = readyDeliveryOrders(state.shop);
  const contract = nextCounterContract(state);
  const contractState = contract ? counterContractStatus(contract, state) : null;
  if (
    contract
    && contractState
    && contractState.unlocked
    && readyOrders >= deliveryOrderQueueCapacity()
    && state.shop.reputation >= contract.costReputation
  ) {
    const cashReady = state.shop.tips >= contract.costTips;
    return {
      id: contract.id,
      title: cashReady ? contract.name : `Grow Cash for ${contract.name}`,
      body: cashReady
        ? "Spend Reputation to unlock bigger Cash handoffs."
        : "Reputation is ready. Cash is the short wait.",
      progressCurrent: state.shop.tips,
      progressTarget: contract.costTips,
      progressLabel: `${formatCashCount(state.shop.tips)} / ${formatCashCount(contract.costTips)} Cash · ${formatShopCount(state.shop.reputation)} / ${formatShopCount(contract.costReputation)} Reputation`,
      reward: `${shopOrderTypeById(contract.unlockOrderTypeId).name} · Counter Service batch floor ${formatShopCount(contract.batchFloor)}`,
      ctaLabel: "",
      ctaTarget: "",
      isFutureOnly: false,
    };
  }
  const carGoal = carManagementPinnedGoal(state);
  if (carGoal) return carGoal;
  if (dreamInvestmentTargetVisible(state)) {
    const target = dreamInvestmentTargetProgress(state);
    if (!target.purchased) {
      return {
        id: "dream_investment_wheels",
        title: target.ready ? "Dream Build: Buy Wheels" : "Dream Build: Wheels Fund",
        body: target.ready
          ? "The first build investment is ready. Cash goes down now; Garage Build Value starts."
          : "Save Cash from the shop to start the covered build with its first real part.",
        progressCurrent: target.current,
        progressTarget: target.required,
        progressLabel: target.ready
          ? "Wheels Fund ready"
          : `${formatCashCount(target.current)} / ${formatCashCount(target.required)} Cash`,
        reward: "Starts Garage Build Value",
        ctaLabel: "View Dream Build",
        ctaTarget: "dream-build",
        isFutureOnly: false,
      };
    }
    const wheelsWork = nextDreamBuildWheelsWork(state);
    if (wheelsWork) {
      return {
        id: wheelsWork.action,
        title: `Dream Build: ${wheelsWork.title}`,
        body: wheelsWork.copy,
        progressCurrent: cashBalance(state),
        progressTarget: wheelsWork.cost,
        progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(wheelsWork.cost)} Cash`,
        reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(wheelsWork.valueAdded)}`,
        ctaLabel: "View Dream Build",
        ctaTarget: "dream-build",
        isFutureOnly: false,
      };
    }
    const exhaustWork = nextDreamBuildExhaustWork(state);
    if (exhaustWork) {
      return {
        id: exhaustWork.action,
        title: `Dream Build: ${exhaustWork.title}`,
        body: exhaustWork.copy,
        progressCurrent: cashBalance(state),
        progressTarget: exhaustWork.cost,
        progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(exhaustWork.cost)} Cash`,
        reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(exhaustWork.valueAdded)}`,
        ctaLabel: "View Dream Build",
        ctaTarget: "dream-build",
        isFutureOnly: false,
      };
    }
    const suspensionWork = nextDreamBuildSuspensionWork(state);
    if (suspensionWork) {
      return {
        id: suspensionWork.action,
        title: suspensionWork.title,
        body: suspensionWork.nextLevel === 2
          ? "Next suspension work is ready."
          : suspensionWork.nextLevel === 3
            ? "Dial in the suspension setup."
            : suspensionWork.nextLevel === 4
              ? "Balance the chassis."
              : suspensionWork.nextLevel === 5
                ? "Finish the suspension track."
                : "Next build track is ready.",
        progressCurrent: cashBalance(state),
        progressTarget: suspensionWork.cost,
        progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(suspensionWork.cost)} Cash`,
        reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(suspensionWork.valueAdded)}`,
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: false,
      };
    }
    const tiresWork = nextDreamBuildTiresWork(state);
    if (tiresWork) {
      return {
        id: tiresWork.action,
        title: tiresWork.title,
        body: tiresWork.nextLevel === 1
          ? "Next build track is ready."
          : "Continue the Tires & Rubber track.",
        progressCurrent: cashBalance(state),
        progressTarget: tiresWork.cost,
        progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(tiresWork.cost)} Cash`,
        reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(tiresWork.valueAdded)}`,
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: false,
      };
    }
    const eventBoard = garageEventBoardStatus(state);
    if (eventBoard.visible && !eventBoard.unlocked) {
      const body = eventBoard.netWorthReady
        ? "Reach Tires & Rubber Level 5 to prepare the build for events."
        : "Reach $100M Net Worth and complete Tires & Rubber to unlock the first event board.";
      return {
        id: "garage_event_board_unlock",
        title: "Garage Event Board",
        body,
        progressCurrent: eventBoard.netWorth,
        progressTarget: eventBoard.netWorthRequirement,
        progressLabel: `${formatCashCount(eventBoard.netWorth)} / $100M Net Worth`,
        reward: "Unlocks parked fictional garage events",
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: false,
      };
    }
    const inductionWork = nextDreamBuildInductionWork(state);
    if (inductionWork) {
      return {
        id: inductionWork.action,
        title: inductionWork.title,
        body: inductionWork.nextLevel === 1
          ? "Start the Induction & Cooling track."
          : inductionWork.nextLevel === 2
            ? "Add controlled boost hardware."
            : inductionWork.nextLevel === 3
              ? "Continue the induction package."
              : inductionWork.nextLevel === 4
                ? "Move into serious boost hardware."
                : "Finish the induction package.",
        progressCurrent: cashBalance(state),
        progressTarget: inductionWork.cost,
        progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(inductionWork.cost)} Cash`,
        reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(inductionWork.valueAdded)}`,
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: false,
      };
    }
      const drivetrainWork = nextDreamBuildDrivetrainWork(state);
      if (drivetrainWork) {
        return {
        id: drivetrainWork.action,
        title: drivetrainWork.title,
        body: drivetrainWork.nextLevel === 1
          ? "Start the Drivetrain & Transmission track."
          : drivetrainWork.nextLevel === 2
            ? "Continue the power-delivery package."
            : drivetrainWork.nextLevel === 3
              ? "Strengthen the drivetrain."
              : drivetrainWork.nextLevel === 4
                ? "Build the gearbox around the car."
                : "Finish the drivetrain package.",
        progressCurrent: cashBalance(state),
        progressTarget: drivetrainWork.cost,
        progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(drivetrainWork.cost)} Cash`,
        reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(drivetrainWork.valueAdded)}`,
        ctaLabel: "",
        ctaTarget: "",
          isFutureOnly: false,
        };
      }
      const aeroWork = nextDreamBuildAeroWork(state);
      if (aeroWork) {
        return {
          id: aeroWork.action,
          title: aeroWork.title,
          body: aeroWork.nextLevel === 1
            ? "Start shaping the body and aero package."
            : aeroWork.nextLevel === 2
              ? "Continue the aero package."
              : aeroWork.nextLevel === 3
                ? "Commit to the build's body identity."
                : aeroWork.nextLevel === 4
                  ? "Refine the chassis and weight class."
                  : "Finish the aero and body package.",
          progressCurrent: cashBalance(state),
          progressTarget: aeroWork.cost,
          progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(aeroWork.cost)} Cash`,
          reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(aeroWork.valueAdded)}`,
          ctaLabel: "",
          ctaTarget: "",
          isFutureOnly: false,
        };
      }
      const finalWork = nextDreamBuildFinalWork(state);
      if (finalWork) {
        return {
          id: finalWork.action,
          title: finalWork.title,
          body: finalWork.nextLevel === 1
            ? "Clean up the final presentation before shakedown."
            : "Finish the first complete build.",
          progressCurrent: cashBalance(state),
          progressTarget: finalWork.cost,
          progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(finalWork.cost)} Cash`,
          reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(finalWork.valueAdded)}`,
          ctaLabel: "",
          ctaTarget: "",
          isFutureOnly: false,
        };
      }
      if (dreamBuildFinalBuildLevel(state) >= 2) {
        const progress = dreamBuildProgressSummary(state);
        return {
          id: "first_complete_build",
          title: "First Complete Build",
          body: "Car Management is unlocked.",
          progressCurrent: progress.completed,
          progressTarget: progress.total,
          progressLabel: `${formatShopCount(progress.completed)} / ${formatShopCount(progress.total)} Core Build Progress`,
          reward: "First Complete Build local status",
          ctaLabel: "",
          ctaTarget: "",
          isFutureOnly: false,
        };
      }
    const inductionStatus = inductionUnlockStatus(state);
    if (dreamBuildBrakesLevel(state) >= 5 && !inductionStatus.unlocked) {
      const progress = dreamBuildProgressSummary(state);
      return {
        id: inductionStatus.brakesReady ? "local_showcase_for_induction" : "brakes_for_induction",
        title: inductionStatus.brakesReady ? "Enter Local Showcase" : "Complete Brakes & Control",
        body: inductionStatus.brakesReady
          ? "Induction & Cooling unlocks after the build has its first event result."
          : "Induction & Cooling unlocks after the brake track is complete.",
        progressCurrent: progress.completed,
        progressTarget: progress.total,
        progressLabel: `Brakes: ${progress.brakesStatus} · ${formatShopCount(progress.completed)} / ${formatShopCount(progress.total)}`,
        reward: "Unlocks Induction & Cooling",
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: false,
      };
    }
    if (dreamBuildInductionLevel(state) >= 5 && dreamBuildDrivetrainLevel(state) < 5) {
      const progress = dreamBuildProgressSummary(state);
      return {
        id: "dream_build_drivetrain_available",
        title: "Sports Clutch & Flywheel",
        body: "Start the Drivetrain & Transmission track.",
        progressCurrent: progress.completed,
        progressTarget: progress.total,
        progressLabel: `Induction: ${progress.inductionStatus} · ${formatShopCount(progress.completed)} / ${formatShopCount(progress.total)}`,
        reward: "Unlocks the power-delivery package",
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: false,
      };
    }
    if (dreamBuildDrivetrainLevel(state) >= 5 && dreamBuildAeroLevel(state) < 5) {
      const progress = dreamBuildProgressSummary(state);
      return {
        id: "dream_build_aero_available",
        title: "Front Splitter & Side Skirts",
        body: "Start shaping the body and aero package.",
        progressCurrent: progress.completed,
        progressTarget: progress.total,
        progressLabel: `Drivetrain: ${progress.drivetrainStatus} · ${formatShopCount(progress.completed)} / ${formatShopCount(progress.total)}`,
        reward: "Unlocks the final visible core build track",
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: false,
      };
    }
    if (dreamBuildImplementedCapReached(state)) {
      const progress = dreamBuildProgressSummary(state);
      return {
        id: "dream_build_current_cap",
        title: "First Complete Build",
        body: "Car Management is unlocked.",
        progressCurrent: progress.completed,
        progressTarget: progress.total,
        progressLabel: `${progress.finalBuildStatus} · ${formatShopCount(progress.completed)} / ${formatShopCount(progress.total)}`,
        reward: "Unlocked Car Management",
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: false,
      };
    }
    const availableEvent = nextAvailableGarageEvent(state);
    if (availableEvent) {
      const afford = garageEventAffordability(availableEvent, state);
      return {
        id: availableEvent.id,
        title: afford.canEnter ? `Enter ${availableEvent.title}` : `Grow Cash for ${availableEvent.title}`,
        body: availableEvent.id === "local_showcase"
          ? "The current build is ready for its first parked event."
          : "The next parked Garage Event is ready.",
        progressCurrent: cashBalance(state),
        progressTarget: availableEvent.cost,
        progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(availableEvent.cost)} Cash`,
        reward: `+${formatCashCount(availableEvent.cashReward)} Cash, +${formatCashCount(availableEvent.brandValueReward)} Brand Value, +${formatShopCount(availableEvent.garageReputationReward)} Garage Reputation`,
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: false,
      };
    }
    const brakesWork = nextDreamBuildBrakesWork(state);
    if (brakesWork) {
      return {
        id: brakesWork.action,
        title: brakesWork.title,
        body: brakesWork.nextLevel === 1
          ? "Next build track is ready."
          : "Continue the Brakes & Control track.",
        progressCurrent: cashBalance(state),
        progressTarget: brakesWork.cost,
        progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(brakesWork.cost)} Cash`,
        reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(brakesWork.valueAdded)}`,
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: false,
      };
    }
    if (allGarageEventsComplete(state)) {
      const progress = dreamBuildProgressSummary(state);
      return {
        id: "garage_event_board_complete",
        title: "Garage Event Board complete",
        body: "Future event-board expansion will add repeatable boards and multiple cars.",
        progressCurrent: progress.completed,
        progressTarget: progress.total,
        progressLabel: `${formatShopCount(progress.completed)} / ${formatShopCount(progress.total)} Core Build Progress`,
        reward: "Future repeatable events and deeper garage operations",
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: true,
      };
    }
    if (dreamBuildBrakesLevel(state) >= 5) {
      const progress = dreamBuildProgressSummary(state);
      return {
        id: "dream_build_brakes_complete",
        title: "Brakes & Control complete",
        body: "Next Build Track: Induction & Cooling, future garage pass.",
        progressCurrent: progress.completed,
        progressTarget: progress.total,
        progressLabel: `Brakes: ${progress.brakesStatus} · ${formatShopCount(progress.completed)} / ${formatShopCount(progress.total)}`,
        reward: "Induction & Cooling is future/target-only",
        ctaLabel: "",
        ctaTarget: "",
        isFutureOnly: true,
      };
    }
    const showcase = showcasePrepStatus(state);
    if (showcase.unlocked && !showcase.prepared) {
      return {
        id: "prepare_showcase_display",
        title: "Showcase Prep",
        body: "The project is getting attention. Prepare it for its first display when Cash is ready.",
        progressCurrent: cashBalance(state),
        progressTarget: showcase.cost,
        progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(showcase.cost)} Cash`,
        reward: `${GARAGE_BUILD_VALUE_LABEL} +${formatCashCount(showcase.valueAdded)}`,
        ctaLabel: "View Dream Build",
        ctaTarget: "dream-build",
        isFutureOnly: false,
      };
    }
    const sponsor = sponsorInquiryStatus(state);
    if (sponsor.unlocked && !sponsor.accepted) {
      return {
        id: "accept_sponsor_inquiry",
        title: "Sponsor Inquiry",
        body: "The first display build is starting to attract business.",
        progressCurrent: 1,
        progressTarget: 1,
        progressLabel: "Ready",
        reward: `+${formatCashCount(sponsor.cashReward)} Cash and +${formatCashCount(sponsor.brandValueReward)} Brand Value`,
        ctaLabel: "View Dream Build",
        ctaTarget: "dream-build",
        isFutureOnly: false,
      };
    }
  }

  const counterUpgrade = visibleRelevantStationUpgrades(state).find((upgrade) => (
    upgrade.stationId === "counter_service"
    && safeNonNegativeInteger(state.shop.stationUpgrades[upgrade.id], 0, upgrade.maxLevel) < upgrade.maxLevel
  ));
  if (counterUpgrade) {
    const level = safeNonNegativeInteger(state.shop.stationUpgrades[counterUpgrade.id], 0, counterUpgrade.maxLevel);
    const cost = stationUpgradeCostTips(counterUpgrade, level);
    return {
      id: counterUpgrade.id,
      title: `Counter Service: ${counterUpgrade.name}`,
      body: stationUpgradeWhyItMatters(counterUpgrade),
      progressCurrent: cashBalance(state),
      progressTarget: cost,
      progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(cost)} Cash`,
      reward: counterUpgrade.effect,
      ctaLabel: "View Upgrades",
      ctaTarget: "upgrades",
      isFutureOnly: false,
    };
  }

  const managerUpgrade = nextManagerDeskUpgrade(state, false);
  if (managerUpgrade) {
    const level = safeNonNegativeInteger(state.shop.stationUpgrades[managerUpgrade.id], 0, managerUpgrade.maxLevel);
    const cost = stationUpgradeCostTips(managerUpgrade, level);
    return {
      id: managerUpgrade.id,
      title: `Manager Desk: ${managerUpgrade.name}`,
      body: stationUpgradeWhyItMatters(managerUpgrade),
      progressCurrent: cashBalance(state),
      progressTarget: cost,
      progressLabel: `${formatCashCount(cashBalance(state))} / ${formatCashCount(cost)} Cash`,
      reward: managerUpgrade.effect,
      ctaLabel: "View Upgrades",
      ctaTarget: "upgrades",
      isFutureOnly: false,
    };
  }

  const supplierUpgrade = nextSupplierUpgrade(state, false);
  if (supplierUpgrade) {
    const level = safeNonNegativeInteger(state.shop.stationUpgrades[supplierUpgrade.id], 0, supplierUpgrade.maxLevel);
    const cost = stationUpgradeCostReputation(supplierUpgrade, level);
    return {
      id: supplierUpgrade.id,
      title: `Supplier: ${supplierUpgrade.name}`,
      body: stationUpgradeWhyItMatters(supplierUpgrade),
      progressCurrent: state.shop.reputation,
      progressTarget: cost,
      progressLabel: `${formatShopCount(state.shop.reputation)} / ${formatShopCount(cost)} Reputation`,
      reward: supplierUpgrade.effect,
      ctaLabel: "View Upgrades",
      ctaTarget: "upgrades",
      isFutureOnly: false,
    };
  }

  if (shouldShowNetWorthV1(state)) {
    const milestone = nextNetWorthMilestone(state);
    if (milestone) {
      const current = netWorthV1(state);
      const bridgeTarget = current < milestone.amount
        ? Math.min(milestone.amount, Math.max(current + 1, Math.ceil(current / 25000000) * 25000000 || 25000000))
        : milestone.amount;
      return {
        id: `net_worth_bridge_${milestone.id}`,
        title: `Reach ${formatCashCount(bridgeTarget)} Net Worth`,
        body: `Bridge target toward ${milestone.label}. Keep growing Cash, business value, Garage Build Value, and Brand Value.`,
        progressCurrent: current,
        progressTarget: bridgeTarget,
        progressLabel: `${formatCashCount(current)} / ${formatCashCount(bridgeTarget)}`,
        reward: `Closer to ${milestone.label}`,
        ctaLabel: "View Net Worth",
        ctaTarget: "net-worth",
        isFutureOnly: false,
      };
    }
  }

  const fallback = nextMilestoneForShop(state);
  return {
    id: fallback.id,
    title: fallback.name,
    body: fallback.guidance,
    progressLabel: fallback.progressText,
    percent: fallback.percent,
    reward: fallback.reward,
    ctaLabel: "",
    ctaTarget: "",
    isFutureOnly: false,
  };
}

function eraGoalForShop(gameState) {
  const state = normalizeGameState(gameState);
  if (shouldShowNetWorthV1(state)) {
    const milestone = nextNetWorthMilestone(state);
    if (milestone) {
      const progress = nextMilestoneProgress(netWorthV1(state), milestone.amount);
      return {
        id: milestone.id,
        title: milestone.label,
        body: "Long-term horizon goal. Keep growing Cash, Tofu Business Value, Garage Build Value, and Brand Value.",
        progressCurrent: progress.current,
        progressTarget: progress.required,
        progressLabel: `${formatCashCount(progress.current)} / ${formatCashCount(progress.required)}`,
        percent: progress.percent,
        reward: milestone.reward,
        ctaLabel: "View Net Worth",
        ctaTarget: "net-worth",
      };
    }
  }
  const milestone = nextMilestoneForShop(state);
  return {
    id: milestone.id,
    title: milestone.name,
    body: milestone.guidance,
    progressLabel: milestone.progressText,
    percent: milestone.percent,
    reward: milestone.reward,
    ctaLabel: "",
    ctaTarget: "",
  };
}

function goalPercent(goal) {
  if (!goal) return 0;
  if (Number.isFinite(goal.percent)) return clampPercent(goal.percent);
  if (Number.isFinite(goal.progressCurrent) && Number.isFinite(goal.progressTarget) && goal.progressTarget > 0) {
    return nextMilestoneProgress(goal.progressCurrent, goal.progressTarget).percent;
  }
  return 0;
}

function renderGoalStackItem(label, goal, options = {}) {
  if (!goal) return "";
  const percent = goalPercent(goal);
  const progressLabel = goal.progressLabel || (
    Number.isFinite(goal.progressCurrent) && Number.isFinite(goal.progressTarget)
      ? `${formatShopCount(goal.progressCurrent)} / ${formatShopCount(goal.progressTarget)}`
      : ""
  );
  const modifier = options.compact ? " is-compact" : "";
  return `
    <article class="nospill-goal-stack-item${modifier}" data-goal-id="${escapeHtml(goal.id || label)}">
      <div class="nospill-goal-stack-label">${escapeHtml(label)}</div>
      <div class="nospill-goal-stack-title">
        <strong>${escapeHtml(goal.title || "Goal")}</strong>
        ${goal.isFutureOnly ? '<span class="nospill-goal-stack-badge">Future</span>' : ""}
      </div>
      <p>${escapeHtml(goal.body || "")}</p>
      ${progressLabel ? `
        <div class="nospill-goal-stack-progress">
          <span>${escapeHtml(progressLabel)}</span>
          <strong>${formatShopCount(percent)}%</strong>
        </div>
        <div
          class="nospill-next-milestone-bar"
          role="progressbar"
          aria-label="${escapeHtml(`${label} progress`)}"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${percent}"
        >
          <span style="width: ${percent}%"></span>
        </div>
      ` : ""}
      ${goal.reward ? `<small class="nospill-goal-stack-reward">Reward: ${escapeHtml(goal.reward)}</small>` : ""}
      ${goalStackCta(goal.ctaLabel, goal.ctaTarget)}
    </article>
  `;
}

function renderGoalStackCard(state) {
  if (appState.running || appState.calibrating) return "";
  const action = nextBestAction(state);
  const actionTarget = goalStackTargetForAction(action);
  const immediate = {
    id: action.type || "next_action",
    title: stripNextPrefix(action.title) || "Continue Tofu Garage",
    body: action.copy,
    progressLabel: "",
    reward: "",
    ctaLabel: actionTarget ? (action.buttonLabel || "View") : "",
    ctaTarget: actionTarget,
  };
  const pinned = pinnedNearGoalForShop(state);
  const era = eraGoalForShop(state);
  return `
    <section class="nospill-goal-stack" aria-label="Tofu Garage goal stack">
      <div class="nospill-next-milestone-head">
        <span>Goal Stack</span>
        <strong>Glance Mode</strong>
      </div>
      <div class="nospill-goal-stack-grid">
        ${renderGoalStackItem("Now", immediate, { compact: true })}
        ${renderGoalStackItem("Pinned Goal", pinned)}
        ${renderGoalStackItem("Era Goal", era)}
      </div>
    </section>
  `;
}

function renderOverviewOperationalCard(state) {
  const prep = orderPrepProgress(state);
  const rates = getShopGeneratorRates(state);
  const income = counterServiceIncomeStatus(state);
  const queueFull = deliveryOrderQueueSpace(state.shop) < 1;
  const counterRunning = Boolean(state.shop.counterService && state.shop.counterService.running);
  const waitingForStock = counterRunning && state.shop.deliveryOrders > 0 && state.shop.tofuStock < 1;
  const waitingForOrders = counterRunning && state.shop.deliveryOrders < 1;
  const status = queueFull
    ? `Queue full · Counter Service ${counterRunning ? "running" : "paused"}`
    : waitingForStock
      ? "Waiting for Tofu Stock"
      : waitingForOrders
        ? "Waiting for ready orders"
        : "Shop moving";
  const copy = queueFull
    ? counterRunning
      ? "Queue full. Counter Service is already clearing prepared orders. Counter Contracts can turn the backlog into Cash faster."
      : "Queue full. Start Counter Service to turn ready orders into Cash."
    : waitingForStock
      ? "Counter Service is waiting for tofu stock."
      : waitingForOrders
        ? "Counter Service is waiting for ready orders."
        : "Tofu Stock, ready orders, and Counter Service are summarized here.";
  const prepCapacityLine = `${formatShopCount(state.shop.prepSlots)} slots open · ${formatShopCount(getPrepSlotMax(state.shop))} max`;
  const prepCapacityMeaning = state.shop.prepSlots > 0
    ? "Prepared-order storage is not currently the bottleneck."
    : "Prep Capacity is recovering before more station purchases.";
  const bestOrder = bestFulfillableShopOrderType(state) || bestUnlockedShopOrderType(state);
  return renderIdleCard({
    title: "Tofu Shop",
    status,
    copy,
    extra: `
      <div class="nospill-afford-progress">
        <small>Ready Orders: ${escapeHtml(formatShopCount(state.shop.deliveryOrders))}</small>
        <small>Income: ${escapeHtml(income.text)}</small>
        <small>Tofu Stock/sec: +${escapeHtml(formatShopRate(rates.tofuPressPerSecond))}/sec</small>
        <small>Prep Capacity: ${escapeHtml(prepCapacityLine)}</small>
        <small>${escapeHtml(prepCapacityMeaning)}</small>
        ${compactDetails("overview_order_details", "How orders work", `
          <p>Prepared orders fill the Delivery Orders queue. When that queue is full, Counter Service and Counter Contracts are the Cash conversion path.</p>
          <p>Prep Capacity is the recovering expansion pool used to add more production stations. It is not prepared-order storage and not a manual recharge button.</p>
          <p>Current prep state: ${escapeHtml(prep.message)}</p>
          ${bestOrder ? `<p>Best current order: ${escapeHtml(bestOrder.name)} uses ${escapeHtml(formatShopCost(bestOrder.tofuRequired))} tofu stock and ${escapeHtml(formatShopCount(bestOrder.deliveryOrdersRequired))} ready order${bestOrder.deliveryOrdersRequired === 1 ? "" : "s"}.</p>` : ""}
        `)}
      </div>
    `,
  });
}

function renderOverviewHowItWorks(state, bestOrder, runway, bottleneck) {
  const bestOrderLine = bestOrder
    ? `Best current order: ${bestOrder.name} uses ${formatShopCost(bestOrder.tofuRequired)} tofu stock and ${formatShopCount(bestOrder.deliveryOrdersRequired)} ready order${bestOrder.deliveryOrdersRequired === 1 ? "" : "s"}.`
    : "Keep building Tofu Stock and ready orders to reveal better payouts.";
  return compactDetails("overview_how_this_works", "How this works", `
      <p>Current bottleneck: ${escapeHtml(bottleneck.label)}. ${escapeHtml(bottleneck.action)}</p>
      <p>Tofu Stock feeds Prep Counter and larger orders. Counter Service turns prepared orders into Cash from tips.</p>
      <p>Cash buys upgrades. ${escapeHtml(runway.message)}</p>
      <p>${escapeHtml(bestOrderLine)}</p>
    `, { className: "nospill-overview-details" });
}

function renderOverviewPanel(state) {
  const bottleneck = currentBottleneck(state);
  const runway = tofuStockRunway(state);
  const bestOrder = bestFulfillableShopOrderType(state) || bestUnlockedShopOrderType(state);
  const recentReward = renderRecentShopRewardCard(state);
  const hiddenOverviewCards = `
    ${renderPreparingOrderCard(state)}
    ${bestOrder ? renderShopOrderCard(bestOrder, state, { compact: true, hideActions: true }) : ""}
    ${renderOverviewImprovementCard(state)}
    ${renderCounterServiceCard(state)}
    ${renderShowcaseInterestCard(state)}
    ${renderSponsorInquiryCard(state)}
    ${renderNetWorthCard(state)}
    ${renderNetWorthMilestoneCard(state)}
    ${renderDriverBonusCard(state)}
    ${renderPassportTeaserCard(state)}
    ${renderStoryTeaserCard()}
    ${renderIdleCard({
      title: "Optional Certified Boost",
      status: "Don't Spill the Cup",
      copy: "Available when you want a smooth-driving bonus. It is not required for shop progress.",
      actions: [actionButton("Take Don't Spill the Cup", "data-surface-target", "cup-test", false)],
    })}
  `;
  return `
    <h4>Overview</h4>
    ${renderGoalStackCard(state)}
    ${renderTofuShopLivingScene(state)}
    ${recentReward ? `<div class="nospill-overview-recent">${recentReward}</div>` : ""}
    <div class="nospill-idle-grid">
      ${renderOverviewOperationalCard(state)}
      ${renderCoveredCarTeaserCard(state)}
      ${dreamBuildInvestmentStarted(state) ? renderDreamBuildOverviewSummaryCard(state) : renderDreamInvestmentTargetCard(state)}
      ${renderCarManagementOverviewCard(state)}
    </div>
    ${renderOverviewHowItWorks(state, bestOrder, runway, bottleneck)}
    ${compactDetails("overview_more_status", "More status", `<div class="nospill-idle-grid">${hiddenOverviewCards}</div>`)}
  `;
}

function renderProductionPanel(state) {
  const visibleStations = visibleShopStations(state);
  const cheapestStation = validBulkStationCandidates(state, true)
    .sort((a, b) => (
      a.status.cost - b.status.cost
      || SHOP_STATIONS.indexOf(a.station) - SHOP_STATIONS.indexOf(b.station)
    ))[0];
  return `
    <h4>Production</h4>
    <p class="nospill-panel-helper">Stations use Cash and Prep Capacity. Prep Capacity is the recovering expansion pool for adding more stations.</p>
    ${renderBulkBuyCard(
      "Bulk Buy Stations",
      cheapestStation
        ? `Cheapest affordable station: ${cheapestStation.station.name} · ${formatCash(cheapestStation.status.cost)}.`
        : "No affordable visible stations right now.",
      "stations",
      Boolean(cheapestStation),
    )}
    <div class="nospill-idle-grid">
      ${visibleStations.map((station) => {
        const owned = safeNonNegativeInteger(state.shop.stations[station.id], 0, 100000);
        const afford = stationAffordabilityStatus(station, state);
        const unlocked = afford.unlocked;
        const cost = afford.cost;
        const canBuy = afford.canBuy;
        const reason = afford.disabledReason;
        return renderIdleCard({
          title: station.name,
          status: unlocked ? `${formatCash(cost)} · ${formatShopCount(station.prepSlotCost)} Prep Capacity` : "Locked",
          copy: unlocked
            ? `Owned: ${formatShopCount(owned)}. ${stationPurposeCopy(station.id, state)} ${stationMilestoneText(station.id, owned)}`
            : station.unlock,
          locked: !unlocked,
          extra: unlocked ? renderAffordabilityProgress(afford.progress) : "",
          actions: [
            actionButton(`Buy ${station.name} · ${formatCash(cost)}`, "data-shop-station", station.id, !canBuy, "nospill-secondary", reason),
            actionButton(`Buy Max ${station.name}`, "data-shop-station-max", station.id, !canBuy, "nospill-secondary", reason),
          ],
        });
      }).join("")}
    </div>
  `;
}

function renderBulkBuyCard(title, copy, kind, hasAffordable) {
  return renderIdleCard({
    title,
    status: hasAffordable ? "Affordable" : "Waiting",
    copy,
    actions: [
      actionButton(
        kind === "upgrades" ? "Buy Cheapest Upgrade" : "Buy Cheapest Station",
        "data-bulk-buy",
        `${kind}:cheapest`,
        !hasAffordable,
        "nospill-secondary",
        kind === "upgrades" ? "No affordable upgrades right now." : "No affordable stations right now.",
      ),
      actionButton(
        kind === "upgrades" ? "Buy All Affordable Upgrades" : "Buy All Affordable Stations",
        "data-bulk-buy",
        `${kind}:all`,
        !hasAffordable,
        "nospill-secondary",
        kind === "upgrades" ? "No affordable upgrades right now." : "No affordable stations right now.",
      ),
    ],
  });
}

function returningPlayerSuggestedActions(gameState) {
  const state = normalizeGameState(gameState);
  const suggestions = [];
  const addSuggestion = (label) => {
    const clean = String(label || "").replace(/^Next:\s*/, "").trim();
    if (!clean || /pack tofu/i.test(clean)) return;
    if (!suggestions.includes(clean)) suggestions.push(clean);
  };
  const action = nextBestAction(state);
  addSuggestion(action.title);
  addSuggestion(netWorthReturningNote(state));
  addSuggestion(dreamInvestmentReturningNote(state));
  if (validBulkUpgradeCandidates(state, true).length > 0) addSuggestion("Buy Cheapest Upgrade");
  if (validBulkStationCandidates(state, true).length > 0) addSuggestion("Buy Cheapest Station");
  if (isCounterServiceUnlocked(state) && !state.shop.counterService.running && readyDeliveryOrders(state.shop) > 0) {
    addSuggestion("Start Counter Service");
  }
  if (readyDeliveryOrders(state.shop) >= deliveryOrderQueueCapacity()) addSuggestion("Clear Order Queue");
  return suggestions.slice(0, 3);
}

function renderOrderPrepProgress(state) {
  const prep = orderPrepProgress(state);
  const progressPercent = Math.max(0, Math.min(100, prep.progressPercent));
  let label = "Preparing next order";
  let copy = prep.etaSeconds !== null
    ? `About ${prep.etaSeconds} seconds remaining.`
    : prep.message;
  let stateClass = "is-running";
  if (prep.ready > 0) {
    label = "Next order preparing";
    copy = "Ready orders can be fulfilled now.";
  } else if (prep.waitingForTofu) {
    label = "Prep paused";
    copy = "Need more Tofu Stock.";
    stateClass = "is-paused";
  } else if (!prep.running) {
    label = "Prep idle";
    stateClass = "is-paused";
  }
  return `
    <div class="nospill-order-prep ${stateClass}">
      <div class="nospill-order-prep-head">
        <span>Ready Orders</span>
        <strong>${prep.ready}</strong>
      </div>
      <div class="nospill-order-prep-copy">
        <strong>${escapeHtml(label)}</strong>
        <small>${escapeHtml(copy)}</small>
      </div>
      <div
        class="nospill-order-prep-bar"
        role="progressbar"
        aria-label="Preparing next delivery order"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="${progressPercent}"
      >
        <span style="width: ${progressPercent}%"></span>
      </div>
      <small>${progressPercent}% prepared</small>
    </div>
  `;
}

function renderOrdersPanel(state) {
  const orderCards = SHOP_ORDER_TYPES
    .filter((orderType) => shopOrderTypeRevealed(orderType, state))
    .map((orderType) => renderShopOrderCard(orderType, state));
  return `
    <h4>Orders</h4>
    <p class="nospill-panel-helper">Tofu Stock becomes Delivery Orders. Counter Service normally turns Delivery Orders into Cash from tips.</p>
    <p class="nospill-panel-helper">Uses: Prep Counter + larger orders. Tofu Stock is inventory, not money.</p>
    <p class="nospill-panel-helper">Prep Counter uses ${formatShopCost(PREP_COUNTER_CONSUME_PER_ORDER)} tofu stock to prepare 1 delivery order.</p>
    <p class="nospill-panel-helper">Tofu Stock prepares orders. Bigger orders use more tofu and pay more Cash.</p>
    <p class="nospill-panel-helper">Manual fulfillment is a parked backup, not the main progression loop. Cash buys stations and upgrades.</p>
    <div class="nospill-idle-grid">
      ${orderCards.join("")}
      ${renderPreparingOrderCard(state)}
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
            ? `${route.difficulty}. Costs ${formatShopCost(route.tofuCost)} tofu and ${formatShopCount(route.orderCost)} orders.`
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
        status: `${formatCash(drill.costTips)}`,
        copy: `Grants ${formatShopCount(drill.cupStabilityXP)} Cup Stability XP to ${SKILL_LABELS[drill.skill]}.`,
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
          status: level >= upgrade.maxLevel ? "Maxed" : `${formatCash(cost)}`,
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
          title: `${role.name} x${formatShopCount(owned)}`,
          status: `${formatCash(cost)}`,
          copy: `${role.effect} Unlock: ${role.unlock}.`,
          actions: [actionButton("Hire", "data-crew-role", role.id, state.shop.tips < cost)],
        });
      }).join("")}
    </div>
  `;
}

function renderSpiritPanel(state) {
  const spiritRates = getShopGeneratorRates(state);
  const activeDrive = appState.running || appState.calibrating;
  const affordableGenerators = affordableSpiritGeneratorPurchases(state);
  const nextGeneratorCosts = SPIRIT_GENERATORS
    .filter((generator) => safeNonNegativeInteger(state.shop.spiritGenerators[generator.id], 0, SPIRIT_GENERATOR_MAX_LEVEL) < SPIRIT_GENERATOR_MAX_LEVEL)
    .map((generator) => spiritGeneratorNextCost(generator, state));
  const nextGeneratorCost = nextGeneratorCosts.length ? Math.min(...nextGeneratorCosts) : 0;
  const bulkDisabledReason = affordableGenerators.length
    ? ""
    : nextGeneratorCosts.length
      ? `Need more Cash. Next Spirit generator costs ${formatCash(nextGeneratorCost)}.`
      : "All Spirit generators are maxed.";
  const visibleSpiritBoosts = SHOP_SPIRIT_BOOSTS.filter((boost) => (
    boost.type !== "route_multiplier" || hasRouteStoryBeat(state)
  ));
  const instantBoosts = visibleSpiritBoosts.filter((boost) => !boost.durationSeconds);
  const timedBoosts = visibleSpiritBoosts.filter((boost) => Boolean(boost.durationSeconds));
  const visibleFestivalBoosts = visibleFestivalBoostTokens(state);
  const renderSpiritBoostCard = (boost) => {
    const active = activeTimedEffectFor(state, boost.id);
    const disabledReason = spiritBoostDisabledReason(boost, state);
    const disabled = Boolean(disabledReason);
    const status = boost.durationSeconds
      ? active
        ? "Active"
        : `${formatShopCost(boost.costSpirit)} Spirit · Timed effect`
      : `${formatShopCost(boost.costSpirit)} Spirit · Instant action`;
    return renderIdleCard({
      title: boost.name,
      status,
      copy: spiritBoostCopy(boost, state),
      actions: [actionButton(spiritBoostActionLabel(boost), "data-spirit-boost", boost.id, disabled, "nospill-secondary", disabledReason)],
    });
  };
  return `
    <h4>Shop Spirit</h4>
    <p class="nospill-panel-helper">Shop Spirit is a parked-only boost resource. It never affects real driving score.</p>
    <div class="nospill-spirit-wallet" aria-label="Shop Spirit wallet">
      <div><span>Cash</span><strong>${formatCashBalance(state.shop.tips)}</strong></div>
      <div><span>Shop Spirit</span><strong>${formatShopBalance(state.shop.shopSpirit)} / ${formatShopBalance(getShopSpiritMax(state.shop))}</strong></div>
      <div><span>Spirit/sec</span><strong>+${formatShopRate(spiritRates.shopSpiritPerSecond)}/sec</strong></div>
      <div><span>Buy Multiplier</span><strong>${state.shop.purchaseMultiplier === "max" ? "Max" : `x${state.shop.purchaseMultiplier}`}</strong></div>
    </div>
    <section class="nospill-spirit-section" aria-label="Spirit generators">
      <h5>Spirit Generators</h5>
      ${activeDrive ? "" : `
        <div class="nospill-bulk-card" aria-label="Spirit generator bulk purchase">
          <strong>Permanent Spirit Generators</strong>
          <span>Buys Tea Kettle, Shrine Corner, Festival Lantern, Night Shift Kettle, and Lucky Cat only.</span>
          ${actionButton(
            "Buy All Affordable",
            "data-spirit-generator-bulk",
            "all",
            affordableGenerators.length < 1,
            "nospill-secondary",
            bulkDisabledReason || "No affordable Spirit generators right now.",
          )}
        </div>
      `}
      <div class="nospill-idle-grid">
        ${SPIRIT_GENERATORS.map((generator) => {
          const owned = safeNonNegativeInteger(state.shop.spiritGenerators[generator.id], 0, SPIRIT_GENERATOR_MAX_LEVEL);
          const cost = spiritGeneratorNextCost(generator, state);
          const maxed = owned >= SPIRIT_GENERATOR_MAX_LEVEL;
          const disabledReason = spiritGeneratorDisabledReason(generator, state, cost);
          return renderIdleCard({
            title: `${generator.name} Lv ${formatShopCount(owned)} / ${formatShopCount(SPIRIT_GENERATOR_MAX_LEVEL)}`,
            status: maxed ? "Maxed" : `${formatCash(cost)}`,
            copy: `Generates ${formatShopRate(generator.spiritPerSecond * owned)} Shop Spirit/sec. Unlock: ${generator.unlock}.`,
            actions: [actionButton(maxed ? "Maxed" : "Buy", "data-spirit-generator", generator.id, maxed || state.shop.tips < cost, "nospill-secondary", disabledReason)],
          });
        }).join("")}
      </div>
    </section>
    <section class="nospill-spirit-section" aria-label="Instant Spirit actions">
      <h5>Instant Actions</h5>
      <div class="nospill-idle-grid">
        ${instantBoosts.map(renderSpiritBoostCard).join("")}
      </div>
    </section>
    <section class="nospill-spirit-section" aria-label="Timed Spirit effects">
      <h5>Timed Effects</h5>
      <div class="nospill-idle-grid">
        ${timedBoosts.map(renderSpiritBoostCard).join("")}
      </div>
    </section>
    ${visibleFestivalBoosts.length ? `
      <section class="nospill-spirit-section" aria-label="Spirit tokens">
        <h5>Tokens</h5>
        <div class="nospill-idle-grid">
          ${visibleFestivalBoosts.map((boost) => {
            const ready = safeNonNegativeInteger(state.shop.festivalBoosts[boost.id], 0, 100000);
            const disabledReason = festivalBoostDisabledReason(boost, state);
            return renderIdleCard({
              title: boost.name,
              status: `${formatShopCount(ready)} ready`,
              copy: "Earned parked-only token. Future token earning rules stay hidden until implemented.",
              actions: [actionButton("Use Token", "data-festival-boost", boost.id, ready < 1, "nospill-secondary", disabledReason)],
            });
          }).join("")}
        </div>
      </section>
    ` : ""}
  `;
}

function renderExpandedUpgradePanel(state) {
  const upgrades = visibleRelevantStationUpgrades(state);
  const cheapestUpgrade = validBulkUpgradeCandidates(state, true)
    .sort((a, b) => (
      (a.status.costTips + a.status.costReputation) - (b.status.costTips + b.status.costReputation)
      || STATION_UPGRADES.indexOf(a.upgrade) - STATION_UPGRADES.indexOf(b.upgrade)
    ))[0];
  const firstUpgradeTeaser = renderIdleCard({
    title: "Station Upgrades",
    status: "Locked",
    copy: "The next upgrade appears when it solves the current shop bottleneck.",
    locked: true,
  });
  return `
    <h4>Station Upgrades</h4>
    <p class="nospill-panel-helper">Station upgrades are separate modifiers. Stations are bought in Production; upgrades improve what owned stations do.</p>
    ${renderCounterContractsPanel(state)}
    ${renderBulkBuyCard(
      "Bulk Upgrade Purchases",
      cheapestUpgrade
        ? `Cheapest affordable upgrade: ${cheapestUpgrade.upgrade.name}.`
        : "No affordable visible upgrades right now.",
      "upgrades",
      Boolean(cheapestUpgrade),
    )}
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
          status: unlocked ? `${formatShopCount(rival.orderCost)} orders · ${formatShopCost(rival.spiritCost)} spirit` : "Locked",
          copy: unlocked
            ? `Friendly showcase reward: ${formatCashCount(rival.tipsReward)} from tips and ${formatShopCount(rival.reputationReward)} reputation.`
            : rival.unlock,
          locked: !unlocked,
          actions: [actionButton("Start Rival Shop Challenge", "data-rival-challenge", rival.id, !unlocked || !affordable)],
        });
      }).join("")}
    </div>
  `;
}

function stampProgressionCategory(stampId) {
  const shopStamps = new Set([
    "first_shop_order",
    "first_upgrade_purchased",
    "first_family_tofu_tray",
    "first_10_orders",
    "first_100_tips",
    "first_festival_boost",
  ]);
  const driverStamps = new Set([
    "first_delivery",
    "daily_delivery_complete",
    "perfect_pour",
    "nospill_club",
    "technical_pour",
  ]);
  if (shopStamps.has(stampId)) return "Shop Stamp";
  if (driverStamps.has(stampId)) return "Driver Stamp";
  return "Story Stamp";
}

function renderPassportPanel(state) {
  const unlockedStamps = Object.entries(STAMP_LABELS)
    .filter(([id]) => state.stamps[id])
    .sort(([a], [b]) => {
      const categoryRank = { "Shop Stamp": 0, "Driver Stamp": 1, "Story Stamp": 2 };
      return (categoryRank[stampProgressionCategory(a)] - categoryRank[stampProgressionCategory(b)])
        || String(a).localeCompare(String(b));
    });
  const nextStampIds = ["first_upgrade_purchased", "first_family_tofu_tray", "first_10_orders", "first_100_tips"]
    .filter((id) => !state.stamps[id])
    .slice(0, 2);
  const cards = [
    ...unlockedStamps.map(([id, label]) => renderIdleCard({
      title: label,
      status: `${stampProgressionCategory(id)} · Unlocked`,
      copy: "Stamped in your local passport.",
      locked: false,
    })),
    ...nextStampIds.map((id) => renderIdleCard({
      title: STAMP_LABELS[id] || "Next Stamp",
      status: "Teaser",
      copy: "Keep growing the shop to discover this stamp.",
      locked: true,
    })),
  ];
  return `
    <h4>Delivery Passport</h4>
    <p class="nospill-panel-helper">Shop stamps are shown first here. Driver stamps belong to Don't Spill the Cup, and the full catalog stays hidden until earned.</p>
    <div class="nospill-idle-grid">
      ${cards.length ? cards.join("") : renderIdleCard({
        title: "Passport",
        status: "Quiet",
        copy: "Fulfill your first shop order to discover the first stamp.",
        locked: true,
      })}
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
        status: `${formatShopCount(perk.costStars)} License Star${perk.costStars > 1 ? "s" : ""}`,
        copy: `${perk.effect} Owned ${formatShopCount(state.shop.licensePerks[perk.id] || 0)}.`,
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
  const prep = orderPrepProgress(state);
  const runway = tofuStockRunway(state);
  const bestOrder = bestFulfillableShopOrderType(state);
  const upgrade = affordableShopUpgrade(state);
  const prepCounterStation = affordableShopStation(state, "prep_counter");
  if (prep.ready > 0 && !bestOrder) return { id: "tofu", label: "Low Tofu Stock", action: "Buy Tofu Press or Supplier support; manual packing is backup only." };
  if (prep.ready > 0 && state.shop.tips < 1) return { id: "cash", label: "Need Cash", action: "Counter Service will turn prepared orders into Cash from tips." };
  if (prep.ready > 0) return { id: "orders_ready", label: "Orders ready", action: bestOrder && bestOrder.id !== "simple_tofu_box" ? `Counter Service can use ${bestOrder.name} for a bigger payout.` : "Counter Service converts ready orders into Cash." };
  if (prep.ready < 1 && runway.isLow) return { id: "tofu", label: "Low Tofu Stock", action: "Buy Tofu Press or Supplier support; manual packing is backup only." };
  if (prep.ready < 1 && prep.running && runway.isHealthy && upgrade && upgrade.stationId === "prep_counter") {
    return { id: "prep_upgrade", label: "Prep Counter upgrade available", action: `Buy ${upgrade.name} to prepare orders faster.` };
  }
  if (prep.ready < 1 && prep.running && runway.isHealthy && prepCounterStation) {
    return { id: "prep_station", label: "Prep Counter station available", action: "Buy Prep Counter to prepare orders faster." };
  }
  if (prep.ready < 1 && prep.running && state.shop.tofuStock >= PREP_COUNTER_CONSUME_PER_ORDER) {
    return { id: "preparing_order", label: "Preparing Delivery Order", action: runway.isHealthy ? "Wait for Prep Counter or improve Prep Counter." : "Wait for Prep Counter." };
  }
  if (prep.ready < 1) return { id: "orders", label: "No Delivery Orders", action: prep.message };
  if (state.shop.prepSlots < 1) return { id: "prep_capacity", label: "Prep Capacity recovering", action: "Wait for prep capacity" };
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
  const prep = orderPrepProgress(state);
  if (elements.shopLevelBadge) {
    setTextIfChanged(elements.shopLevelBadge, reveal.shop ? `Shop Level ${shop.shopLevel}` : "Locked");
  }
  if (elements.shopTofuStock) {
    setTextIfChanged(elements.shopTofuStock, reveal.shop
      ? formatShopBalance(shop.tofuStock, shop.generatorCarry && shop.generatorCarry.tofuStock)
      : "Locked");
  }
  if (elements.shopDeliveryOrders) {
    setTextIfChanged(elements.shopDeliveryOrders, reveal.shop
      ? `${formatShopCount(prep.ready)} ready`
      : "Locked");
  }
  if (elements.shopTips) {
    setTextIfChanged(elements.shopTips, reveal.shop
      ? formatCashBalance(shop.tips, shop.generatorCarry && shop.generatorCarry.tips)
      : "Locked");
  }
  if (elements.shopReputation) {
    setTextIfChanged(elements.shopReputation, reveal.shop
      ? formatShopBalance(shop.reputation, shop.generatorCarry && shop.generatorCarry.reputation)
      : "Locked");
  }
  if (elements.shopLevelProgress) {
    setTextIfChanged(elements.shopLevelProgress,
      reveal.shop
        ? `Level ${progress.level} · ${formatShopCount(progress.currentReputation)}/${formatShopCount(progress.nextReputation)}`
        : "Start the shop");
  }
  if (elements.shopIdleRate) {
    setTextIfChanged(elements.shopIdleRate, reveal.shop
      ? `+${formatShopRate(generatorRates.tofuPressPerSecond)}/sec`
      : "Locked");
  }
  if (elements.shopOrderRate) {
    setTextIfChanged(elements.shopOrderRate, reveal.shop && shop.generators.prepCounter.unlocked
      ? `+${formatShopRate(generatorRates.prepOrdersPerSecond)}/sec`
      : "Locked");
  }
  if (elements.shopTipsRate) {
    const counterIncome = counterServiceIncomeStatus(state);
    setTextIfChanged(elements.shopTipsRate, reveal.shop
      ? counterIncome.status === "locked"
        ? `+${formatCashRate(generatorRates.customerTipsPerSecond)}/sec passive`
        : counterIncome.text
      : "Locked");
  }
  if (elements.shopReputationRate) {
    setTextIfChanged(elements.shopReputationRate, reveal.shop
      ? `+${formatShopRate(generatorRates.passiveReputationPerSecond)}/sec`
      : "Locked");
  }
  if (elements.shopSpiritRate) {
    setTextIfChanged(elements.shopSpiritRate, reveal.shop
      ? `+${formatShopRate(generatorRates.shopSpiritPerSecond)}/sec`
      : "Locked");
  }
  if (elements.shopPrepStatus) {
    setTextIfChanged(elements.shopPrepStatus, reveal.shop ? prep.message : "Locked");
  }
  if (elements.shopPrepSlots) {
    setTextIfChanged(elements.shopPrepSlots, reveal.shop
      ? `${formatShopCount(shop.prepSlots)} slots open · ${formatShopCount(getPrepSlotMax(shop))} max`
      : "Locked");
  }
  if (elements.shopReach) {
    setTextIfChanged(elements.shopReach, reveal.shop ? formatShopCount(shop.shopReach) : "Locked");
  }
  if (elements.shopSpirit) {
    setTextIfChanged(elements.shopSpirit, reveal.shop
      ? `${formatShopCount(shop.shopSpirit)}/${formatShopCount(getShopSpiritMax(shop))}`
      : "Locked");
  }
  if (elements.shopLicenseStars) {
    setTextIfChanged(elements.shopLicenseStars, reveal.shop ? formatShopCount(shop.licenseStars) : "Locked");
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
        ? "Pack Tofu"
        : "Start the Shop";
  }
  if (elements.fulfillShopOrderButton) {
    const activeDrive = appState.running || appState.calibrating;
    const bestOrder = bestFulfillableShopOrderType(state);
    const canFulfill = reveal.shop && prep.ready > 0 && Boolean(bestOrder) && !activeDrive;
    elements.fulfillShopOrderButton.disabled = !canFulfill;
    elements.fulfillShopOrderButton.textContent = activeDrive
      ? "Park First"
      : bestOrder && bestOrder.id === "simple_tofu_box"
        ? "Fulfill One Simple Box"
        : bestOrder
          ? `Fulfill One ${bestOrder.name}`
          : "Fulfill One Manually";
  }
  if (elements.packTofuHelper) {
    elements.packTofuHelper.textContent = appState.running || appState.calibrating
      ? "Shop actions unlock after you finish and park."
      : reveal.shop
        ? "Manual packing is a backup. Tofu Press and Supplier Contracts are the real supply path."
        : "The press is warming up. Start the shop while parked.";
  }
  if (elements.fulfillShopOrderHelper) {
    elements.fulfillShopOrderHelper.textContent = appState.running || appState.calibrating
      ? "Shop actions unlock after you finish and park."
      : prep.ready > 0
        ? "Manual fulfillment is available, but Counter Service is the normal handoff path."
        : `Need 1 prepared order. ${prep.message}`;
  }
  renderShopTabs(state);
  if (elements.shopInlineResult) {
    setTextIfChanged(elements.shopInlineResult, appState.shopInlineResult || "");
  }
  if (elements.shopOfflineEarnings) {
    const offlineTofu = Number(shop.offlineEarnings && shop.offlineEarnings.tofuStock || 0);
    const offlineOrders = Number(shop.offlineEarnings && shop.offlineEarnings.deliveryOrders || 0);
    const offlineTips = Number(shop.offlineEarnings && shop.offlineEarnings.tips || 0);
    const offlineTofuConsumed = Number(shop.offlineEarnings && shop.offlineEarnings.tofuConsumed || 0);
    const offlineCounterPaused = Boolean(shop.offlineEarnings && shop.offlineEarnings.counterServicePaused);
    const offlineHours = Number(shop.offlineEarnings && shop.offlineEarnings.cappedHours || 0);
    const offlineCapHours = Number(shop.offlineEarnings && shop.offlineEarnings.capHours || SHOP_OFFLINE_BASE_CAP_HOURS);
    const offlineExcessHours = Number(shop.offlineEarnings && shop.offlineEarnings.excessHours || 0);
    const offlineCapped = Boolean(shop.offlineEarnings && shop.offlineEarnings.capped);
    const offlineManagedCap = Boolean(shop.offlineEarnings && shop.offlineEarnings.managedCap);
    const hasOfflineEarnings = reveal.shop
      && (
        offlineTofu > 0.005
        || offlineOrders > 0.005
        || offlineTips > 0.005
        || offlineHours > 0.01
        || offlineCapped
      );
    const offlineKey = hasOfflineEarnings
      ? `${formatShopCount(offlineTofu)}:${formatShopCount(offlineOrders)}:${formatShopCount(offlineTips)}:${formatShopCount(offlineTofuConsumed)}:${offlineCounterPaused ? "paused" : "open"}:${formatShopCount(offlineHours)}:${formatShopCount(offlineExcessHours)}`
      : "";
    if (hasOfflineEarnings && appState.offlineProgressAnalyticsKey !== offlineKey) {
      trackEvent("tofu_driver_offline_progress_seen", {
        capped: offlineCapped,
        duration_bucket: offlineHours >= 72
          ? "72h_plus"
          : offlineHours >= 24
            ? "24h_72h"
            : offlineHours >= 1
              ? "1h_24h"
              : "under_1h",
      });
      appState.offlineProgressAnalyticsKey = offlineKey;
    }
    const offlineParts = [];
    if (offlineTofu > 0.005) offlineParts.push(`+${formatShopCount(offlineTofu)} tofu stock`);
    if (offlineOrders > 0.005) offlineParts.push(`+${formatShopCount(offlineOrders)} waiting orders`);
    if (offlineTips > 0.005) offlineParts.push(`+${formatCashCount(offlineTips)} Cash from tips`);
    if (!offlineParts.length && offlineHours > 0.01) {
      offlineParts.push(`${offlineManagedCap ? "Shift Manager saved" : "shop saved"} ${formatShopCount(offlineHours)} hours of idle progress`);
    }
    const offlineNotes = [];
    if (offlineCapped || offlineExcessHours > 0.01) {
      offlineNotes.push(`longer absences are capped at ${formatShopCount(offlineCapHours)} hours to preserve pacing`);
    }
    if (offlineTofuConsumed > 0.005 && offlineOrders > 0.005) {
      offlineNotes.push("tofu supply was consumed preparing orders");
    }
    if (offlineCounterPaused && offlineOrders > 0.005) {
      offlineNotes.push("Counter Service does not fulfill offline yet");
    }
    if (shop.offlineEarnings && shop.offlineEarnings.queueFull) {
      offlineNotes.push("order queue reached capacity");
    }
    const offlineSuggestions = hasOfflineEarnings
      ? returningPlayerSuggestedActions(state)
      : [];
    const compactOffline = [];
    if (offlineParts.length) compactOffline.push(...offlineParts);
    if (shop.offlineEarnings && shop.offlineEarnings.queueFull && !compactOffline.includes("queue reached capacity")) {
      compactOffline.push("queue reached capacity");
    }
    if (offlineCapped || offlineExcessHours > 0.01) {
      compactOffline.push(`capped at ${formatShopCount(offlineCapHours)}h`);
    }
    if (!compactOffline.length && offlineHours > 0.01) {
      compactOffline.push(`${offlineManagedCap ? "Shift Manager saved" : "shop saved"} ${formatShopCount(offlineHours)}h`);
    }
    const compactNotes = [];
    if (offlineTofuConsumed > 0.005 && offlineOrders > 0.005) compactNotes.push("tofu spent on prep");
    if (offlineCounterPaused && offlineOrders > 0.005) compactNotes.push("Counter Service stays offline");
    const compactSuggestions = offlineSuggestions.slice(0, 2);
    const showLedgerCta = hasOfflineEarnings && (compactSuggestions.length > 0 || hasMeaningfulLedgerHistory(state));
    const offlineText = hasOfflineEarnings
      ? `While away: ${compactOffline.concat(compactNotes).join(" · ")}${compactSuggestions.length ? ` · Next: ${compactSuggestions.join(" · ")}` : ""}${showLedgerCta ? " · View Ledger" : ""}`
      : "";
    const offlineHtml = hasOfflineEarnings
      ? `While away: ${escapeHtml(compactOffline.concat(compactNotes).join(" · "))}${compactSuggestions.length ? ` · Next: ${escapeHtml(compactSuggestions.join(" · "))}` : ""}${showLedgerCta ? ` <button type="button" class="nospill-link-button" data-shop-tab="ledger">View Ledger</button>` : ""}`
      : "";
    setTextIfChanged(elements.shopOfflineEarnings, offlineText);
    if (elements.shopOfflineEarnings.querySelector && elements.shopOfflineEarnings.innerHTML !== offlineHtml) {
      elements.shopOfflineEarnings.innerHTML = offlineHtml;
    }
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
      ${type === "character" ? renderCharacterCameo("crew_profile_card", null, { character: item, activeDrive }) : ""}
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
  return false;
}

function renderSimulatorPanel() {
  if (elements.simulatorPanel && elements.simulatorPanel.classList && elements.simulatorPanel.classList.add) {
    elements.simulatorPanel.classList.add("is-hidden");
  }
}

function renderGamePanels(gameState = loadGameState()) {
  const state = normalizeGameState(gameState);
  appState.liveGameState = state;
  const reveal = progressiveRevealState(state);
  const shopSurface = appState.surface === "shop";
  const crewSurface = appState.surface === "crew";
  const cupSurface = appState.surface === "cup-test";
  renderSurfaceNavigation(state);
  renderBrandShelf();
  if (shopSurface) {
    renderGameDashboard(state);
    renderTofuShop(state);
  }
  if (cupSurface) {
    renderDeliveryLog(state);
    renderMerchProgress(state);
    renderMerchPanel(loadClubState(), state);
    renderSimulatorPanel();
  }
  if (crewSurface) {
    renderCollectionPanel(state);
  }
  if (elements.deliveryBoardSection) {
    elements.deliveryBoardSection.classList.toggle("is-hidden", !cupSurface || !reveal.firstDelivery);
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
      section.classList.toggle("is-hidden", sectionSurface !== appState.surface);
    });
  }
}

function merchProgressMetric(label, value) {
  return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function renderMerchProgress(gameState = loadGameState()) {
  if (!elements.merchProgressGrid) return;
  const state = normalizeGameState(gameState);
  const progress = state.merchProgress;
  const hiddenSticker = state.merchUnlocks[HIDDEN_STICKER_ID];
  const hiddenPenguinSticker = state.merchUnlocks[HIDDEN_PENGUIN_STICKER_ID];
  const hiddenShirt = state.merchUnlocks[HIDDEN_SHIRT_ID];
  const hiddenPenguinShirt = state.merchUnlocks[HIDDEN_PENGUIN_SHIRT_ID];
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
    merchProgressMetric(
      "Hidden Sticker",
      hiddenSticker.unlocked ? "Unlocked" : "Secret",
    ),
    merchProgressMetric(
      "Penguin Sticker",
      hiddenPenguinSticker.unlocked ? "Unlocked" : "Secret",
    ),
    merchProgressMetric(
      "Hidden Shirt",
      hiddenShirt.unlocked ? "Unlocked" : "Secret",
    ),
    merchProgressMetric(
      "Penguin Shirt",
      hiddenPenguinShirt.unlocked ? "Unlocked" : "Secret",
    ),
  ].join("");
}

function pendingHiddenMerchReveal(summary) {
  const rewards = summary && summary.deliveryRewards ? summary.deliveryRewards : {};
  const state = normalizeGameState(rewards.gameState || loadGameState());
  const unlocks = Array.isArray(rewards.hiddenMerchUnlocks)
    ? rewards.hiddenMerchUnlocks
    : rewards.hiddenShirtUnlock
      ? [rewards.hiddenShirtUnlock]
      : [];
  return unlocks.find((unlock) => {
    const itemId = unlock && unlock.itemId ? unlock.itemId : HIDDEN_SHIRT_ID;
    const item = state.merchUnlocks[itemId];
    return Boolean(unlock && unlock.unlockedThisRun && item && item.unlocked && !item.revealSeen);
  }) || null;
}

function renderHiddenShirtReveal(summary) {
  if (!elements.hiddenShirtReveal) return;
  const rewards = summary && summary.deliveryRewards ? summary.deliveryRewards : {};
  const state = normalizeGameState(rewards.gameState || loadGameState());
  const pending = pendingHiddenMerchReveal(summary);
  const itemId = pending && pending.itemId ? pending.itemId : HIDDEN_SHIRT_ID;
  const definition = HIDDEN_MERCH_UNLOCKS[itemId] || HIDDEN_MERCH_UNLOCKS[HIDDEN_SHIRT_ID];
  const show = Boolean(
    !appState.running
    && !appState.calibrating
    && pending
  );
  elements.hiddenShirtReveal.classList.toggle("is-hidden", !show);
  if (show) {
    if (elements.hiddenShirtTitle) elements.hiddenShirtTitle.textContent = definition.revealTitle;
    if (elements.hiddenShirtCopy) elements.hiddenShirtCopy.textContent = definition.revealCopy;
    if (elements.hiddenShirtSubcopy) elements.hiddenShirtSubcopy.textContent = definition.revealSubcopy;
  }
  if (elements.hiddenShirtLink) {
    if (show) {
      elements.hiddenShirtLink.href = definition.url;
      elements.hiddenShirtLink.dataset.merchUnlockId = definition.id;
      elements.hiddenShirtLink.setAttribute("target", "_blank");
      elements.hiddenShirtLink.setAttribute("rel", "noopener noreferrer");
    } else {
      elements.hiddenShirtLink.removeAttribute("href");
      if (elements.hiddenShirtLink.dataset) elements.hiddenShirtLink.dataset.merchUnlockId = "";
    }
  }
}

function renderDeliverySummary(summary) {
  if (!elements.deliverySummaryGrid) return;
  const rewards = summary.deliveryRewards || {};
  const level = rewards.gameState ? rewards.gameState.level : loadGameState().level;
  const coach = rewards.coach || buildCoachRecap(summary, rewards);
  const passport = rewards.passport || deliveryPassportSummary(rewards.gameState || loadGameState());
  const merch = rewards.merchProgress || normalizeGameState(loadGameState()).merchProgress;
  const merchUnlocks = normalizeGameState(rewards.gameState || loadGameState()).merchUnlocks;
  const hiddenSticker = merchUnlocks[HIDDEN_STICKER_ID];
  const hiddenPenguinSticker = merchUnlocks[HIDDEN_PENGUIN_STICKER_ID];
  const hiddenShirt = merchUnlocks[HIDDEN_SHIRT_ID];
  const hiddenPenguinShirt = merchUnlocks[HIDDEN_PENGUIN_SHIRT_ID];
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
    : qualified ? "No new stamp" : "No certified stamp";
  const nextGoal = dailyComplete
    ? "Daily delivery complete. Come back tomorrow for new cargo."
    : qualified
      ? `${dailyDelivery.cargo}: ${dailyDelivery.goal}`
      : "Start another Cup Test when parked and ready.";
  const certifiedBoost = shop.certifiedBoost || { applied: false };
  const certifiedBoostLine = certifiedBoost.applied
    ? `+${formatShopCount(certifiedBoost.reputationGained)} reputation · +${formatShopCount(certifiedBoost.tofuStockGained)} tofu · +${formatCashCount(certifiedBoost.tipsGained)} Cash from tips · Tofu Press +${certifiedBoost.pressBoostPercent}%`
    : qualified
      ? "No certified boost earned"
      : "Local result - no certified boost";
  const shopRewardLine = (shop.tofuStockGained || shop.tipsGained || shop.reputationGained)
    ? `+${formatShopCount(shop.tofuStockGained || 0)} tofu · +${formatCashCount(shop.tipsGained || 0)} Cash from tips · +${formatShopCount(shop.reputationGained || 0)} reputation`
    : "No shop rewards from this local result";
  if (elements.summaryCharacterCameo) elements.summaryCharacterCameo.innerHTML = "";
  elements.deliverySummaryGrid.innerHTML = [
    summaryMetric("Cargo", summary.cargoLabel || cargoTypeProfile(summary.cargoType || summary.difficulty).label),
    summaryMetric("Cargo Condition", formatPercent(summary.cargoCondition ?? summary.waterLeft), "nospill-is-good"),
    summaryMetric("Trip Time", formatTripDuration(summary.durationSeconds)),
    summaryMetric("Drive Shape", summary.driveShape || summarizeDriveShape(summary)),
    summaryMetric("Rank", displayRankForSession(summary)),
    summaryMetric("Result Status", resultStatusLabel(summary)),
    summaryMetric("Driver License", `Level ${level} · ${getDriverLicense(level)}`),
    summaryMetric(
      "Daily Delivery Result",
      dailyComplete
        ? `${dailyDelivery.cargo} delivered`
        : qualified
          ? `${dailyDelivery.cargo} in progress`
          : "Local result - not completed",
    ),
    summaryMetric("Main Damage Source", coach.damageSource),
    summaryMetric("Best Skill", coach.bestSkill),
    summaryMetric("Next Focus", coach.nextFocus),
    summaryMetric("Selected Crew", crew ? crew.name : "No crew selected yet"),
    summaryMetric("New Unlock", newUnlockLine),
    summaryMetric("Driver XP Gained", rewards.xpGained ? `+${formatShopCount(rewards.xpGained)}` : "+0"),
    summaryMetric("Skill XP Gained", skillLine),
    summaryMetric("Stamp Earned", stampLine),
    summaryMetric("Shop Rewards", shopRewardLine),
    summary.dailyDeliveryCredit ? summaryMetric("Daily Delivery Credit", summary.dailyDeliveryCredit.replace(/^Daily Delivery Credit: /, "")) : "",
    summaryMetric("Certified Boost", certifiedBoostLine),
    summaryMetric("Shop Level", `Level ${shopState.shopLevel}`),
    summaryMetric("Delivery Passport", `${passport.total}/${passport.totalAvailable} stamps`),
    summaryMetric(
      "No-Spill Club Gear",
      `${merch.nospillClubGear.count}/${merch.nospillClubGear.target}`,
    ),
    summaryMetric("Perfect Pour Drop", merch.perfectPourDrop.unlocked ? "Unlocked" : "Locked"),
    summaryMetric("Delivery Crew Merch", `${merch.deliveryCrew.count}/${merch.deliveryCrew.target}`),
    summaryMetric("Hidden Sticker", hiddenSticker.unlocked ? "Unlocked" : "Locked"),
    summaryMetric("Hidden Penguin Sticker", hiddenPenguinSticker.unlocked ? "Unlocked" : "Locked"),
    summaryMetric("Hidden Shirt", hiddenShirt.unlocked ? "Unlocked" : "Locked"),
    summaryMetric("Hidden Penguin Shirt", hiddenPenguinShirt.unlocked ? "Unlocked" : "Locked"),
    summaryMetric("Next Delivery Goal", nextGoal),
  ].filter(Boolean).join("");
  if (elements.cupTrailCard) {
    elements.cupTrailCard.innerHTML = renderCupTrail(summary);
  }
  if (elements.coachRecapCard) {
    elements.coachRecapCard.innerHTML = [
      renderCharacterCameo(coachRecapCharacterSlot(summary), collectionState, {
        label: "Coach Recap",
        copy: "Mika noted a calm finish.",
        preferAssigned: true,
        variant: "coach-cameo",
      }),
      renderCoachRecap(summary),
    ].join("");
  }
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
  if (elements.shareTrailModeSection) elements.shareTrailModeSection.classList.toggle("is-hidden", true);
  if (elements.storyCardPreviewSection) elements.storyCardPreviewSection.classList.toggle("is-hidden", hideShare || mode !== "cup-test");
  if (elements.resultStorySection) elements.resultStorySection.classList.toggle("is-hidden", hideShare || mode !== "cup-test");
  if (elements.cargoCommentarySection) elements.cargoCommentarySection.classList.toggle("is-hidden", true);
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

function stampFanfareRewardMetric(label, value) {
  return `<div class="nospill-stamp-reward-metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function stampFanfareArtAsset(gameState) {
  const character = defaultCharacterForArt(gameState);
  const selectedAsset = getCharacterAsset(character.id, "reward_unlock_card_art");
  if (selectedAsset.src) return selectedAsset;
  return getCharacterAsset("mika", "reward_unlock_card_art");
}

function renderStampFanfareArt(gameState = loadGameState()) {
  const asset = stampFanfareArtAsset(gameState);
  if (!asset.src) {
    return `
      <div class="nospill-stamp-fanfare-art is-placeholder" role="img" aria-label="Stamp celebration image unavailable">
        <span>Stamp recorded</span>
      </div>
    `;
  }
  return `
    <figure class="nospill-stamp-fanfare-art">
      <img
        src="${escapeHtml(asset.src)}"
        alt="${escapeHtml(asset.alt || "Mika celebrating a parked shop stamp unlock.")}"
        loading="eager"
        decoding="async"
        onerror="this.hidden = true; this.nextElementSibling.hidden = false;"
      />
      <div class="nospill-stamp-fanfare-art-fallback" role="img" aria-label="Stamp celebration image unavailable" hidden>
        <span>Stamp recorded</span>
      </div>
    </figure>
  `;
}

function hideStampFanfare() {
  appState.currentStampFanfare = null;
  if (elements.stampFanfare) {
    elements.stampFanfare.classList.add("is-hidden");
    elements.stampFanfare.classList.remove("is-animated");
    elements.stampFanfare.classList.remove("is-static");
  }
  if (appState.pendingDiscoveryFanfare) {
    const pending = appState.pendingDiscoveryFanfare;
    appState.pendingDiscoveryFanfare = null;
    showDiscoveryFanfare(pending.fanfare, pending.gameState);
  }
}

function showStampFanfare(fanfare, gameState = loadGameState()) {
  if (!fanfare || appState.running || appState.calibrating || !elements.stampFanfare) {
    return { shown: false, sound: { played: false, reason: appState.running || appState.calibrating ? "active-drive" : "unavailable" } };
  }
  const reducedMotion = prefersReducedMotion();
  appState.currentStampFanfare = fanfare;
  elements.stampFanfare.classList.remove("is-hidden");
  elements.stampFanfare.classList.toggle("is-animated", !reducedMotion);
  elements.stampFanfare.classList.toggle("is-static", reducedMotion);
  if (elements.stampFanfareTitle) elements.stampFanfareTitle.textContent = fanfare.title || "Stamp Earned";
  if (elements.stampFanfareName) elements.stampFanfareName.textContent = fanfare.stampLabel || "Passport Stamp";
  if (elements.stampFanfareCopy) elements.stampFanfareCopy.textContent = fanfare.copy || "A new passport stamp has been recorded.";
  if (elements.stampFanfareRewards) {
    const rewards = fanfare.rewards || {};
    elements.stampFanfareRewards.innerHTML = [
      renderStampFanfareArt(gameState),
      stampFanfareRewardMetric("Cash", `+${formatCashCount(rewards.tips || 0)}`),
      stampFanfareRewardMetric("Reputation", `+${formatShopCount(rewards.reputation || 0)}`),
      stampFanfareRewardMetric("Shop XP", `+${formatShopCount(rewards.shopXp || rewards.xp || 0)}`),
    ].join("");
  }
  if (elements.stampFanfareCard && typeof elements.stampFanfareCard.focus === "function") {
    elements.stampFanfareCard.focus();
  }
  const sound = playCosmeticSound("stamp_fanfare", gameState, { activeDrive: false });
  return { shown: true, sound, reducedMotion };
}

function hideDiscoveryFanfare() {
  appState.currentDiscoveryFanfare = null;
  if (elements.discoveryFanfare) {
    elements.discoveryFanfare.classList.add("is-hidden");
    elements.discoveryFanfare.classList.remove("is-animated");
    elements.discoveryFanfare.classList.remove("is-static");
  }
}

function showDiscoveryFanfare(fanfare, gameState = loadGameState()) {
  if (!fanfare || appState.running || appState.calibrating || !elements.discoveryFanfare) {
    return { shown: false, sound: { played: false, reason: appState.running || appState.calibrating ? "active-drive" : "unavailable" } };
  }
  const reducedMotion = prefersReducedMotion();
  appState.currentDiscoveryFanfare = fanfare;
  elements.discoveryFanfare.classList.remove("is-hidden");
  elements.discoveryFanfare.classList.toggle("is-animated", !reducedMotion);
  elements.discoveryFanfare.classList.toggle("is-static", reducedMotion);
  if (elements.discoveryFanfareTitle) elements.discoveryFanfareTitle.textContent = fanfare.title || "New Shop System Revealed";
  if (elements.discoveryFanfareSystem) elements.discoveryFanfareSystem.textContent = fanfare.systemLabel || "New System";
  if (elements.discoveryFanfareCopy) elements.discoveryFanfareCopy.textContent = fanfare.copy || "The shop has another layer.";
  if (elements.discoveryFanfareSecondary) elements.discoveryFanfareSecondary.textContent = fanfare.secondaryCopy || "More shop systems are hidden for now.";
  if (elements.discoveryFanfareView) elements.discoveryFanfareView.textContent = fanfare.primaryAction || "View System";
  if (elements.discoveryFanfareCard && typeof elements.discoveryFanfareCard.focus === "function") {
    elements.discoveryFanfareCard.focus();
  }
  const sound = playCosmeticSound("discovery_fanfare", gameState, { activeDrive: false });
  return { shown: true, sound, reducedMotion };
}

function continueFromStampFanfare() {
  hideStampFanfare();
  if (elements.landingView || elements.summaryView) {
    returnToDashboard("shop");
  } else {
    renderGamePanels(currentGameState());
  }
}

function viewPassportFromStampFanfare() {
  hideStampFanfare();
  const state = currentGameState();
  setAppSurface("shop", { updateHash: true, scroll: true, target: "actions", focus: true });
  appState.shopTab = isPassportTabUnlocked(state) ? "passport" : "overview";
  renderGamePanels(state);
  setSummaryStatusMessage("Passport stamp recorded.");
}

function continueFromDiscoveryFanfare() {
  hideDiscoveryFanfare();
  setAppSurface("shop", { updateHash: true, scroll: true, target: "actions", focus: true });
  appState.shopTab = "overview";
  renderGamePanels(currentGameState());
}

function viewSystemFromDiscoveryFanfare() {
  const fanfare = appState.currentDiscoveryFanfare;
  hideDiscoveryFanfare();
  let state = currentGameState();
  setAppSurface("shop", { updateHash: true, scroll: true, target: "actions", focus: true });
  appState.shopTab = fanfare && fanfare.tabId ? fanfare.tabId : "overview";
  appState.highlightedShopTab = "";
  state = clearNewlyRevealedTab(state, appState.shopTab);
  state.shop.currentShopTab = appState.shopTab;
  saveGameState(state);
  renderGamePanels(state);
  setSummaryStatusMessage(`${fanfare && fanfare.systemLabel ? fanfare.systemLabel : "New system"} revealed.`);
}

function renderShopOrderResult(result) {
  appState.lastSummary = null;
  const state = normalizeGameState(result.gameState);
  const shop = state.shop;
  const canFulfillAnother = Boolean(bestFulfillableShopOrderType(state));
  setSummaryMode("shop-order", { canFulfillAnother });
  if (elements.summaryStatusLabel) {
    elements.summaryStatusLabel.textContent = "Tofu Shop";
  }
  if (elements.summaryTitle) {
    elements.summaryTitle.textContent = "Shop Order Complete";
  }
  if (elements.summaryWater) {
    elements.summaryWater.textContent = `+${formatCashCount(result.tipsGained)}`;
  }
  if (elements.returnDashboardButton) {
    elements.returnDashboardButton.textContent = canFulfillAnother
      ? "Fulfill Another Shop Order"
      : "Return to Tofu Garage";
  }
  if (elements.newRunButton) {
    elements.newRunButton.textContent = canFulfillAnother
      ? "Return to Tofu Garage"
      : "Take Don't Spill the Cup";
    elements.newRunButton.classList.toggle("is-hidden", false);
  }
  if (elements.backSimulatorButton) {
    elements.backSimulatorButton.classList.toggle("is-hidden", true);
  }
  if (elements.routeContext) elements.routeContext.classList.toggle("is-hidden", true);
  if (elements.deliverySummaryGrid) {
    elements.deliverySummaryGrid.innerHTML = [
      summaryMetric("Order", result.orderType ? `${result.orderType.name}. Packed and handed off from the counter.` : "Packed and handed off from the counter.", "nospill-is-good"),
      summaryMetric("Tofu Used", `-${formatShopCount(result.tofuUsed || 0)}`),
      summaryMetric("Ready Orders Used", `-${formatShopCount(result.deliveryOrdersUsed || result.quantity || 0)}`),
      summaryMetric("Cash Gained", `+${formatCashCount(result.tipsGained)}`),
      summaryMetric("Reputation Gained", `+${formatShopCount(result.reputationGained)}`),
      summaryMetric("Shop XP Gained", `+${formatShopCount(result.shopXpGained || result.xpGained)}`),
      result.firstShopOrderStampUnlocked
        ? summaryMetric("Stamp Discovered", STAMP_LABELS.first_shop_order, "nospill-is-good")
        : "",
      summaryMetric("Tofu Stock", formatShopBalance(shop.tofuStock)),
      summaryMetric("Delivery Orders", formatShopCount(shop.deliveryOrders)),
      summaryMetric("Shop Level", `Level ${shop.shopLevel}`),
      summaryMetric("Next Best Action", nextBestAction(state).title.replace(/^Next: /, "")),
    ].join("");
  }
  if (elements.cupTrailCard) elements.cupTrailCard.innerHTML = "";
  if (elements.coachRecapCard) elements.coachRecapCard.innerHTML = "";
  if (elements.cargoCommentaryCard) elements.cargoCommentaryCard.innerHTML = "";
  if (elements.storyCardPreviewSection) elements.storyCardPreviewSection.classList.add("is-hidden");
  if (elements.summaryCharacterCameo) elements.summaryCharacterCameo.innerHTML = "";
  if (elements.commuteMasteryCopy) {
    elements.commuteMasteryCopy.textContent = result.report || "Shop order complete.";
  }
  setShareActionsEnabled(false);
  renderGamePanels(state);
  showView("summary");
  const stamp = showStampFanfare(result.stampFanfare, state);
  if (result.discoveryFanfare) {
    if (stamp.shown) {
      appState.pendingDiscoveryFanfare = {
        fanfare: result.discoveryFanfare,
        gameState: state,
      };
    } else {
      showDiscoveryFanfare(result.discoveryFanfare, state);
    }
  }
}

function shopOrderInlineResultMessage(result) {
  const orderName = result && result.orderType && result.orderType.name
    ? result.orderType.name
    : "Shop Order";
  const quantity = safeNonNegativeInteger(result && result.quantity, 1, SHOP_MAX_RESOURCE);
  const quantityText = quantity > 1 ? ` x${formatShopCount(quantity)}` : "";
  return `${orderName}${quantityText} complete: +${formatCashCount(result.tipsGained || 0)} from tips, +${formatShopCount(result.reputationGained || 0)} Reputation, +${formatShopCount(result.shopXpGained || result.xpGained || 0)} Shop XP`;
}

function showShopOrderInlineResult(result) {
  const state = normalizeGameState(result.gameState);
  appState.summaryMode = null;
  appState.shopResultCanFulfillAnother = false;
  appState.lastSummary = null;
  appState.shopTab = "overview";
  appState.shopInlineResult = shopOrderInlineResultMessage(result);
  renderGamePanels(state);
  setSummaryStatusMessage(appState.shopInlineResult);
  const stamp = showStampFanfare(result.stampFanfare, state);
  if (result.discoveryFanfare) {
    if (stamp.shown) {
      appState.pendingDiscoveryFanfare = {
        fanfare: result.discoveryFanfare,
        gameState: state,
      };
    } else {
      showDiscoveryFanfare(result.discoveryFanfare, state);
    }
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

function detailsOpenAttribute(key, defaultOpen = false) {
  const state = appState.detailOpenState || {};
  const hasStoredValue = Object.prototype.hasOwnProperty.call(state, key);
  return (hasStoredValue ? Boolean(state[key]) : Boolean(defaultOpen)) ? " open" : "";
}

function compactDetails(key, summary, bodyHtml, options = {}) {
  const className = options.className ? ` ${escapeHtml(options.className)}` : "";
  return `
    <details class="nospill-compact-details${className}" data-details-key="${escapeHtml(key)}"${detailsOpenAttribute(key, Boolean(options.defaultOpen))}>
      <summary>${escapeHtml(summary)}</summary>
      ${bodyHtml}
    </details>
  `;
}

function renderCargoCommentary(summary = appState.lastSummary) {
  const isCupResult = Boolean(summary) && appState.summaryMode === "cup-test" && !appState.running && !appState.calibrating;
  if (elements.cargoCommentarySection) {
    elements.cargoCommentarySection.classList.toggle("is-hidden", true);
  }
  if (!elements.cargoCommentaryCard) return;
  elements.cargoCommentaryCard.innerHTML = "";
  if (!isCupResult) return;
}

function storyCardPreviewData(summary = {}) {
  const data = buildShareCardData(summary);
  const routeContext = data.routeContext || null;
  const coachSummary = coachRecapShortText(summary);
  return {
    status: data.challengeName,
    cargo: `Cargo: ${data.cargoLabel}`,
    condition: data.waterDelivered,
    rank: `Rank: ${data.rank}`,
    commentary: data.cargoCommentary && data.cargoCommentary.line ? data.cargoCommentary.line : "",
    coachSummary,
    storyCaption: data.storyCaption,
    trailMode: data.shareTrailMode,
    routeArtifactHtml: renderRouteArtifact(summary, data.shareTrailMode),
    routeContextLabel: routeContext && routeContext.status === "usable" ? routeContext.routeContextLabel : "",
    routeContextSummary: routeContext && routeContext.status === "usable"
      ? `Route Context: ${routeContext.routeContextLabel} · Turns ${routeContext.turnDensity} · Curves ${routeContext.curvature} · Stop-Start ${routeContext.stopStartTexture}`
      : "",
    footer: data.tagline,
  };
}

function renderStoryCardPreview(summary = appState.lastSummary) {
  const isCupResult = Boolean(summary) && appState.summaryMode === "cup-test" && !appState.running && !appState.calibrating;
  if (elements.storyCardPreviewSection) {
    elements.storyCardPreviewSection.classList.toggle("is-hidden", !isCupResult);
  }
  if (!isCupResult) return;
  const data = storyCardPreviewData(summary);
  if (elements.storyCardPreviewStatus) elements.storyCardPreviewStatus.textContent = data.status;
  if (elements.storyCardPreviewCondition) elements.storyCardPreviewCondition.textContent = data.condition;
  if (elements.storyCardPreviewCargo) elements.storyCardPreviewCargo.textContent = data.cargo;
  if (elements.storyCardPreviewRank) elements.storyCardPreviewRank.textContent = data.rank;
  if (elements.storyCardPreviewCommentary) elements.storyCardPreviewCommentary.textContent = data.commentary;
  if (elements.storyCardPreviewCoach) elements.storyCardPreviewCoach.textContent = data.coachSummary;
  if (elements.storyCardPreviewRouteMode) {
    elements.storyCardPreviewRouteMode.textContent =
      data.trailMode === SHARE_CARD_TRAIL_MODES.routeOutline
        ? "Route Smoothness Outline"
        : "Abstract Cup Trail";
  }
  if (elements.storyCardPreviewRouteVisual) {
    elements.storyCardPreviewRouteVisual.innerHTML = data.routeArtifactHtml;
  }
  if (elements.storyCardPreviewRouteContext) {
    elements.storyCardPreviewRouteContext.textContent = data.routeContextSummary;
    elements.storyCardPreviewRouteContext.classList.toggle("is-hidden", !data.routeContextSummary);
  }
  if (elements.storyCardPreviewFooter) elements.storyCardPreviewFooter.textContent = data.footer;
  if (elements.storyCardPreviewCaptionBox) {
    elements.storyCardPreviewCaptionBox.classList.toggle("is-hidden", !data.storyCaption);
  }
  if (elements.storyCardPreviewCaption) {
    elements.storyCardPreviewCaption.textContent = data.storyCaption;
  }
}

function currentResultStoryCaption() {
  return sanitizeResultStoryCaption(
    appState.lastSummary && typeof appState.lastSummary.storyCaption === "string"
      ? appState.lastSummary.storyCaption
      : appState.resultStoryCaption,
  );
}

function updateResultStoryCaptionUi(summary = appState.lastSummary) {
  const isCupResult = Boolean(summary) && appState.summaryMode === "cup-test" && !appState.running && !appState.calibrating;
  const caption = currentResultStoryCaption();
  if (elements.resultStorySection) {
    elements.resultStorySection.classList.toggle("is-hidden", !isCupResult);
  }
  if (elements.resultStoryCaptionInput && elements.resultStoryCaptionInput.value !== caption) {
    elements.resultStoryCaptionInput.value = caption;
  }
  if (elements.resultStoryCount) {
    elements.resultStoryCount.textContent = `${Array.from(caption).length} / ${RESULT_STORY_CAPTION_MAX_LENGTH}`;
  }
  if (elements.resultStoryPreview) {
    elements.resultStoryPreview.textContent = caption
      ? `Caption preview: "${caption}"`
      : "Caption preview: none yet.";
  }
  if (elements.resultStoryCaptionInput) {
    elements.resultStoryCaptionInput.disabled = !isCupResult;
  }
  if (elements.resultStoryPresetButtons) {
    elements.resultStoryPresetButtons.forEach((button) => {
      button.disabled = !isCupResult;
    });
  }
}

function applyResultStoryCaption(value) {
  const caption = sanitizeResultStoryCaption(value);
  appState.resultStoryCaption = caption;
  if (appState.lastSummary) appState.lastSummary.storyCaption = caption;
  updateResultStoryCaptionUi(appState.lastSummary);
  renderStoryCardPreview(appState.lastSummary);
  if (appState.lastSummary && appState.summaryMode === "cup-test" && !appState.running && !appState.calibrating) {
    renderShareCanvas(appState.lastSummary);
  }
}

function updateShareTrailModeUi(summary = appState.lastSummary) {
  const isCupResult = Boolean(summary) && appState.summaryMode === "cup-test" && !appState.running && !appState.calibrating;
  const available = isCupResult && routeOutlineShareAvailable(summary);
  const selectedMode = activeShareTrailMode(summary);
  if (elements.shareTrailModeSection) {
    elements.shareTrailModeSection.classList.toggle("is-hidden", !available);
  }
  if (elements.shareTrailModeInputs) {
    elements.shareTrailModeInputs.forEach((input) => {
      input.checked = input.value === selectedMode;
      input.disabled = !available;
    });
  }
  if (elements.shareTrailWarning) {
    const showWarning = available && selectedMode === SHARE_CARD_TRAIL_MODES.routeOutline;
    elements.shareTrailWarning.textContent = showWarning ? ROUTE_OUTLINE_SHARE_WARNING : "";
    elements.shareTrailWarning.classList.toggle("is-hidden", !showWarning);
  }
}

function handleShareTrailModeChange(event) {
  const value = event && event.target ? event.target.value : SHARE_CARD_TRAIL_MODES.abstract;
  appState.shareTrailModeUserSelected = true;
  appState.shareTrailMode =
    value === SHARE_CARD_TRAIL_MODES.routeOutline
      ? SHARE_CARD_TRAIL_MODES.routeOutline
      : SHARE_CARD_TRAIL_MODES.abstract;
  updateShareTrailModeUi(appState.lastSummary);
  renderStoryCardPreview(appState.lastSummary);
  renderShareCanvas(appState.lastSummary);
}

function handleResultStoryCaptionInput(event) {
  applyResultStoryCaption(event && event.target ? event.target.value : "");
}

function handleResultStoryPresetClick(event) {
  const button = event.target && event.target.closest
    ? event.target.closest("[data-story-caption-preset]")
    : null;
  if (!button || button.disabled) return;
  applyResultStoryCaption(button.dataset.storyCaptionPreset || "");
  if (elements.resultStoryCaptionInput && typeof elements.resultStoryCaptionInput.focus === "function") {
    elements.resultStoryCaptionInput.focus();
  }
}

function renderSummary(summary) {
  appState.resultStoryCaption = sanitizeResultStoryCaption(summary.storyCaption || "");
  summary.storyCaption = appState.resultStoryCaption;
  appState.lastSummary = summary;
  appState.shareTrailMode = routeOutlineShareAvailable(summary)
    ? SHARE_CARD_TRAIL_MODES.routeOutline
    : SHARE_CARD_TRAIL_MODES.abstract;
  appState.shareTrailModeUserSelected = false;
  trackCupTestCompletedAnalytics(summary);
  setSummaryMode("cup-test");
  setShareActionsEnabled(true);
  const qualified = isQualifiedSession(summary);
  const statusLabel = resultStatusLabel(summary);
  const summaryGameState = summary.deliveryRewards
    ? summary.deliveryRewards.gameState
    : loadGameState();
  const reveal = progressiveRevealState(summaryGameState);
  if (elements.summaryStatusLabel) {
    elements.summaryStatusLabel.textContent = statusLabel;
  }
  if (elements.summaryTitle) {
    elements.summaryTitle.textContent = `${statusLabel} Complete`;
  }
  if (elements.summaryWater) {
    elements.summaryWater.textContent = formatPercent(summary.cargoCondition ?? summary.waterLeft);
  }
  if (elements.returnDashboardButton) {
    elements.returnDashboardButton.textContent = reveal.shop
      ? "Visit Tofu Garage"
      : "Return to Dashboard";
  }
  if (elements.newRunButton) {
    elements.newRunButton.textContent = "Take Another Cup Test";
    elements.newRunButton.classList.toggle("is-hidden", false);
  }
  if (elements.backSimulatorButton) {
    elements.backSimulatorButton.classList.toggle("is-hidden", true);
  }
  if (elements.summaryGrid) {
    elements.summaryGrid.innerHTML = [
      summaryMetric("Cargo", summary.cargoLabel || cargoTypeProfile(summary.cargoType || summary.difficulty).label),
      summaryMetric("Cargo Condition", formatPercent(summary.cargoCondition ?? summary.waterLeft), "nospill-is-good"),
      summaryMetric("Rank", displayRankForSession(summary)),
      summaryMetric("Result Status", statusLabel),
    ].filter(Boolean).join("");
  }

  const routeContext = summary.routeContext || {};
  const routeAchievements = routeContextAchievementIds(summary);
  const showRoute = summary.mode === "qualified" || resultStatusForSession(summary) === "local";
  if (elements.routeContext) elements.routeContext.classList.toggle("is-hidden", !showRoute);
  if (showRoute && elements.routeGrid) {
    if (routeContext.status === "usable") {
      elements.routeGrid.innerHTML = [
        summaryMetric("Route Context", routeContext.routeContextLabel),
        summaryMetric("Verified Distance", `${summary.distanceMiles.toFixed(2)} mi`),
        summaryMetric("Turn Density", routeContext.turnDensity),
        summaryMetric("Curvature", routeContext.curvature),
        summaryMetric("Stop-Start Texture", routeContext.stopStartTexture),
        summaryMetric("Signal Quality", routeContext.signalQuality),
        routeAchievements.length
          ? summaryMetric("Route Achievement", stampLabels(routeAchievements).join(", "), "nospill-is-good")
          : summaryMetric("Route Achievement", "Smoothness plus qualified route context required."),
      ].join("");
    } else {
      elements.routeGrid.innerHTML = [
        summaryMetric("Route Context", routeContext.message || "Certified route context is only available when location permission and route data are sufficient."),
        routeContext.signalQuality ? summaryMetric("Signal Quality", routeContext.signalQuality) : "",
      ].join("");
    }
  }

  const milestoneText = summary.unlockedBadges.length
    ? `Unlocked: ${summary.unlockedBadges.map((id) => MILESTONE_LABELS[id] || id).join(", ")}`
    : "No milestone unlocked this run.";
  if (elements.milestoneOutput) elements.milestoneOutput.textContent = milestoneText;
  if (elements.summaryStatus) {
    elements.summaryStatus.textContent = resultStatusForSession(summary) === "certified"
      ? resultStatusCopy(summary)
      : "Local Result saved. Smoothness counted locally.";
  }
  renderMerchPanel(loadClubState(), summary.deliveryRewards ? summary.deliveryRewards.gameState : loadGameState());
  renderGamePanels(summary.deliveryRewards ? summary.deliveryRewards.gameState : loadGameState());
  renderDeliverySummary(summary);
  if (elements.runDetailsSection) elements.runDetailsSection.open = false;
  renderHiddenShirtReveal(summary);
  renderCargoCommentary(summary);
  updateResultStoryCaptionUi(summary);
  updateShareTrailModeUi(summary);
  renderStoryCardPreview(summary);
  renderShareCanvas(summary);
  showView("summary");
}

function renderMerchPanel(clubState, gameState = loadGameState()) {
  if (!elements.merchGrid) return;
  const state = normalizeGameState(gameState);
  const milestoneCards = MERCH_MILESTONES.map((id) => {
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
  });
  const hiddenMerchCards = Object.values(HIDDEN_MERCH_UNLOCKS).map((definition) => {
    const item = state.merchUnlocks[definition.id];
    return item && item.unlocked
      ? `
        <div class="nospill-merch-item">
          <span>${escapeHtml(definition.name)}</span>
          <strong>${escapeHtml(definition.unlockedCopy)}</strong>
          <a class="nospill-merch-link" href="${escapeHtml(definition.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(definition.linkLabel)}</a>
        </div>
      `
      : `
        <div class="nospill-merch-item is-locked">
          <span>${escapeHtml(definition.lockedTitle)}</span>
          <strong>${escapeHtml(definition.lockedCopy)}</strong>
        </div>
      `;
  });
  elements.merchGrid.innerHTML = [...milestoneCards, ...hiddenMerchCards].join("");
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
  return resultStatusLabel(summary);
}

function shareDistanceLabel(summary) {
  const distance = Number(summary.distanceMiles || 0);
  if (!Number.isFinite(distance) || distance <= 0) return "";
  return `${roundTo(distance, 1).toFixed(1)} mi`;
}

function wrappedCanvasLines(context, text, maxWidth, maxLines = 3) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
      return;
    }
    lines.push(current);
    current = word;
  });
  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;
  const clipped = lines.slice(0, maxLines);
  let last = clipped[clipped.length - 1] || "";
  while (last.length > 1 && context.measureText(`${last}...`).width > maxWidth) {
    last = last.slice(0, -1).trim();
  }
  clipped[clipped.length - 1] = `${last}...`;
  return clipped;
}

function buildShareCardData(summary, config = SHARE_CONFIG) {
  const delivery = buildDeliverySharePayload(
    summary,
    summary.deliveryRewards || null,
    summary.deliveryRewards ? summary.deliveryRewards.gameState : null,
  );
  const cargoCommentary = failureFlavorForSession(summary);
  const hasExplicitTrailMode = config && Object.prototype.hasOwnProperty.call(config, "shareTrailMode");
  const requestedTrailMode = hasExplicitTrailMode
    ? (
        config.shareTrailMode === SHARE_CARD_TRAIL_MODES.routeOutline
          ? SHARE_CARD_TRAIL_MODES.routeOutline
          : SHARE_CARD_TRAIL_MODES.abstract
      )
    : activeShareTrailMode(summary);
  const shareTrailMode = requestedTrailMode === SHARE_CARD_TRAIL_MODES.routeOutline
    && routeOutlineShareAvailable(summary)
    ? SHARE_CARD_TRAIL_MODES.routeOutline
    : SHARE_CARD_TRAIL_MODES.abstract;
  const routeContext = summary && summary.routeContext && summary.routeContext.status === "usable"
    ? { ...summary.routeContext }
    : null;
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
    driveShape: summary.driveShape || summarizeDriveShape(summary),
    cargoLabel: summary.cargoLabel || cargoTypeProfile(summary.cargoType || summary.difficulty).label,
    tripTime: formatTripDuration(summary.durationSeconds),
    distanceLabel: "",
    cupTrailLabel: shareTrailMode === SHARE_CARD_TRAIL_MODES.routeOutline
      ? "Route Smoothness Outline"
      : "Abstract Cup Trail",
    cupTrail: Array.isArray(summary.cupTrail)
      ? summary.cupTrail.map(boundedCupTrailPoint).slice(0, 48)
      : [],
    milestone: delivery.stamp || bestUnlockedMilestone(summary),
    dailyStatus: delivery.dailyStatus,
    cargoCommentary,
    storyCaption: sanitizeResultStoryCaption(summary.storyCaption),
    shareTrailMode,
    routeContext,
    routeOutline: shareTrailMode === SHARE_CARD_TRAIL_MODES.routeOutline
      && Array.isArray(summary.normalizedRouteOutline)
      ? summary.normalizedRouteOutline.slice(0, 80).map((point) => ({
          x: roundTo(clamp(Number(point.x || 0), 0, 1), 3),
          y: roundTo(clamp(Number(point.y || 0), 0, 1), 3),
          smoothness: ["steady", "mixed", "messy"].includes(point.smoothness) ? point.smoothness : "mixed",
        }))
      : [],
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
    `${APP_BRAND}: ${data.challengeName}. Cargo: ${data.cargoLabel}. Cargo Condition: ${data.waterDelivered}. Trip Time: ${data.tripTime}. Drive Shape: ${data.driveShape}. Cup Trail: ${data.cupTrailLabel}. Rank: ${data.rank}.${milestoneText} ${data.tagline}`,
  ];
  if (data.driverLicense) lines.push(`Driver License: ${data.driverLicense}.`);
  if (data.shopLevel) lines.push(data.shopLevel);
  if (data.deliveryCrew) lines.push(`Delivery Crew: ${data.deliveryCrew}.`);
  if (data.dailyStatus) lines.push(data.dailyStatus);
  if (data.cargoCommentary && data.cargoCommentary.line) {
    lines.push(`Cargo Commentary: ${data.cargoCommentary.line}`);
  }
  if (data.routeContext) {
    lines.push(`Route Context: ${data.routeContext.routeContextLabel}`);
    lines.push(`Turn Density: ${data.routeContext.turnDensity}`);
    lines.push(`Curvature: ${data.routeContext.curvature}`);
    lines.push(`Stop-Start Texture: ${data.routeContext.stopStartTexture}`);
    if (data.shareTrailMode === SHARE_CARD_TRAIL_MODES.routeOutline) {
      lines.push("Route Smoothness Outline included.");
    }
  }
  if (data.storyCaption) lines.push(`Caption: "${data.storyCaption}"`);
  if (data.distanceLabel) lines.push(`Distance: ${data.distanceLabel}.`);
  const shareConfig = normalizedShareConfig(config);
  if (shareConfig.includeAppLink) lines.push(shareConfig.appUrl);
  return sanitizeShareOutput(lines.join("\n"));
}

function drawRouteOutlineOnCanvas(context, outline, bounds) {
  if (!Array.isArray(outline) || outline.length < 2) return false;
  const x = bounds.x;
  const y = bounds.y;
  const width = bounds.width;
  const height = bounds.height;
  context.save();
  context.fillStyle = "rgba(110, 198, 255, 0.08)";
  context.fillRect(x, y, width, height);
  context.strokeStyle = "rgba(244, 247, 239, 0.16)";
  context.lineWidth = 3;
  context.strokeRect(x, y, width, height);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = 12;
  context.strokeStyle = "rgba(110, 198, 255, 0.82)";
  context.beginPath();
  outline.forEach((point, index) => {
    const px = x + clamp(Number(point.x || 0), 0, 1) * width;
    const py = y + clamp(Number(point.y || 0), 0, 1) * height;
    if (index === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  });
  context.stroke();

  outline.forEach((point, index) => {
    if (index % Math.max(1, Math.floor(outline.length / 12)) !== 0 && index !== outline.length - 1) return;
    const px = x + clamp(Number(point.x || 0), 0, 1) * width;
    const py = y + clamp(Number(point.y || 0), 0, 1) * height;
    const color =
      point.smoothness === "steady"
        ? "#55d98a"
        : point.smoothness === "messy"
          ? "#f0b95a"
          : "#9ee9bf";
    context.fillStyle = color;
    context.beginPath();
    context.arc(px, py, 9, 0, Math.PI * 2);
    context.fill();
  });
  context.restore();
  return true;
}

function drawAbstractCupTrailOnCanvas(context, width, height, label = "Abstract Cup Trail") {
  context.fillStyle = "#9ee9bf";
  context.font = "800 23px Inter, Arial, sans-serif";
  context.fillText(label, width - 452, height - 555);
  context.fillStyle = "#bbc7c0";
  context.font = "700 18px Inter, Arial, sans-serif";
  context.fillText("Motion signature, not a route map.", width - 452, height - 528);
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
  context.fillText(data.rank, 118, 440);

  context.fillStyle = "#bbc7c0";
  context.font = "700 28px Inter, Arial, sans-serif";
  context.fillText(`Cargo: ${data.cargoLabel}`, 118, 520);
  context.fillText(`Trip Time: ${data.tripTime}`, 118, 580);
  context.fillText(`Status: ${data.qualificationStatus}`, 118, 640);
  let detailY = 700;
  if (data.driveShape) {
    context.fillText(`Drive Shape: ${data.driveShape}`, 118, detailY);
    detailY += 54;
  }
  if (data.distanceLabel) {
    context.fillText(`Distance: ${data.distanceLabel}`, 118, detailY);
    detailY += 54;
  }

  const milestone = data.milestone || "No new stamp";
  context.fillStyle = "#f0b95a";
  context.fillText(`Stamp: ${milestone}`, 118, Math.max(754, detailY + 18));

  if (data.cargoCommentary && data.cargoCommentary.line) {
    const commentX = 118;
    const commentY = 805;
    const commentWidth = 610;
    const commentHeight = data.storyCaption ? 126 : 150;
    context.fillStyle = "rgba(158, 233, 191, 0.08)";
    context.fillRect(commentX, commentY, commentWidth, commentHeight);
    context.strokeStyle = "rgba(158, 233, 191, 0.48)";
    context.lineWidth = 3;
    context.strokeRect(commentX, commentY, commentWidth, commentHeight);
    context.fillStyle = "#9ee9bf";
    context.font = "800 22px Inter, Arial, sans-serif";
    context.fillText("Cargo Commentary", commentX + 28, commentY + 38);
    context.fillStyle = "#f4f7ef";
    context.font = "800 26px Inter, Arial, sans-serif";
    wrappedCanvasLines(context, data.cargoCommentary.line, commentWidth - 56, data.storyCaption ? 2 : 3).forEach((line, index) => {
      context.fillText(line, commentX + 28, commentY + 78 + index * 30);
    });
  }

  if (data.storyCaption) {
    const boxX = 118;
    const boxY = data.cargoCommentary && data.cargoCommentary.line ? 955 : 825;
    const boxWidth = 610;
    const boxHeight = 160;
    context.fillStyle = "rgba(240, 185, 90, 0.1)";
    context.fillRect(boxX, boxY, boxWidth, boxHeight);
    context.strokeStyle = "rgba(240, 185, 90, 0.62)";
    context.lineWidth = 3;
    context.strokeRect(boxX, boxY, boxWidth, boxHeight);
    context.fillStyle = "#f0b95a";
    context.font = "800 22px Inter, Arial, sans-serif";
    context.fillText("Story Caption", boxX + 28, boxY + 38);
    context.fillStyle = "#f4f7ef";
    context.font = "800 27px Inter, Arial, sans-serif";
    wrappedCanvasLines(context, data.storyCaption, boxWidth - 56, 3).forEach((line, index) => {
      context.fillText(line, boxX + 28, boxY + 78 + index * 31);
    });
  }

  if (data.shareTrailMode === SHARE_CARD_TRAIL_MODES.routeOutline && data.routeOutline.length >= 2) {
    drawRouteOutlineOnCanvas(context, data.routeOutline, {
      x: width - 425,
      y: height - 500,
      width: 290,
      height: 290,
    });
    context.fillStyle = "#9ee9bf";
    context.font = "800 23px Inter, Arial, sans-serif";
    context.fillText("Route Smoothness Outline", width - 452, height - 555);
    context.fillStyle = "#bbc7c0";
    context.font = "700 18px Inter, Arial, sans-serif";
    context.fillText("Shared by user. May reveal route shape.", width - 452, height - 528);
  } else {
    drawAbstractCupTrailOnCanvas(context, width, height, data.cupTrailLabel);
  }

  if (data.routeContext) {
    context.fillStyle = "#bbc7c0";
    context.font = "700 21px Inter, Arial, sans-serif";
    context.fillText(`Route Context: ${data.routeContext.routeContextLabel}`, width - 458, height - 160);
    context.fillText(`Turns ${data.routeContext.turnDensity} · Curves ${data.routeContext.curvature}`, width - 458, height - 130);
    context.fillText(`Stop-Start ${data.routeContext.stopStartTexture}`, width - 458, height - 100);
  }

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
  trackShareAnalytics("tofu_driver_share_clicked", appState.lastSummary, { share_type: "web_share" });
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      if (await shareCardFile(text)) {
        setSummaryStatusMessage("Share card ready.");
        trackShareAnalytics("tofu_driver_share_succeeded", appState.lastSummary, { share_type: "download_card" });
        return;
      }
      await navigator.share({ title: APP_BRAND, text });
      setSummaryStatusMessage("Share summary ready.");
      trackShareAnalytics("tofu_driver_share_succeeded", appState.lastSummary, { share_type: "web_share" });
      return;
    } catch (_) {
      trackShareAnalytics("tofu_driver_share_failed", appState.lastSummary, { share_type: "web_share" });
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
  trackShareAnalytics("tofu_driver_share_clicked", appState.lastSummary, { share_type: "copy_summary" });
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
    trackShareAnalytics("tofu_driver_share_succeeded", appState.lastSummary, { share_type: "copy_summary" });
    return true;
  } catch (_) {
    setSummaryStatusMessage(`Copy unavailable. Summary: ${text}`);
    trackShareAnalytics("tofu_driver_share_failed", appState.lastSummary, { share_type: "copy_summary" });
    return false;
  }
}

async function downloadShareCard() {
  trackShareAnalytics("tofu_driver_share_clicked", appState.lastSummary, { share_type: "download_card" });
  const blob = await canvasToBlob(elements.shareCanvas);
  if (!blob) {
    setSummaryStatusMessage("Card image could not be generated. Try Copy Summary instead.");
    trackShareAnalytics("tofu_driver_share_failed", appState.lastSummary, { share_type: "download_card" });
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
  trackShareAnalytics("tofu_driver_share_succeeded", appState.lastSummary, { share_type: "download_card" });
}

async function exportProgress() {
  trackEvent("tofu_driver_export_clicked", {});
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
  trackEvent("tofu_driver_import_clicked", {});
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
  trackEvent("tofu_driver_reset_clicked", {});
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
  trackEvent("tofu_driver_reset_confirmed", {});
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
  setSummaryStatusMessage(`Packed tofu: +${formatShopCount(result.tofuStockGained)} tofu stock.`);
  playCosmeticSound("shop_pack_tofu", result.gameState, {
    activeDrive: false,
  });
}

function handleFulfillShopOrder(requestedQuantity = 1, orderTypeId = "simple_tofu_box") {
  const result = fulfillShopOrders(currentGameState(), requestedQuantity, {
    activeDrive: appState.running || appState.calibrating,
    orderTypeId,
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  showShopOrderInlineResult(result);
  trackShopOrderFulfilledAnalytics(result);
  playCosmeticSound("shop_pack_tofu", result.gameState, {
    activeDrive: false,
  });
}

function handleFulfillBestShopOrder() {
  const bestOrder = bestFulfillableShopOrderType(currentGameState());
  handleFulfillShopOrder("1", bestOrder ? bestOrder.id : "simple_tofu_box");
}

function handleCounterServiceAction(action) {
  const result = action === "pause"
    ? pauseCounterService(currentGameState(), {
        activeDrive: appState.running || appState.calibrating,
        now: new Date(),
      })
    : startCounterService(currentGameState(), {
        activeDrive: appState.running || appState.calibrating,
        now: new Date(),
      });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = action === "pause"
    ? "Counter Service paused."
    : "Counter Service started.";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(appState.shopInlineResult);
}

function handleBuyDreamBuildWheels() {
  const result = buyDreamBuildWheels(currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = dreamBuildTabUnlocked(result.gameState) ? "dream_build" : "overview";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleDreamBuildWheelsWork(action) {
  const result = buyDreamBuildWheelsWork(action, currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = dreamBuildTabUnlocked(result.gameState) ? "dream_build" : "overview";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleDreamBuildExhaust(action) {
  const result = buyDreamBuildExhaust(action, currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = dreamBuildTabUnlocked(result.gameState) ? "dream_build" : "overview";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleDreamBuildSuspension(action) {
  const result = buyDreamBuildSuspension(action, currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = dreamBuildTabUnlocked(result.gameState) ? "dream_build" : "overview";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleDreamBuildTires(action) {
  const result = buyDreamBuildTires(action, currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = dreamBuildTabUnlocked(result.gameState) ? "dream_build" : "overview";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleDreamBuildBrakes(action) {
  const result = buyDreamBuildBrakes(action, currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = dreamBuildTabUnlocked(result.gameState) ? "dream_build" : "overview";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleDreamBuildInduction(action) {
  const result = buyDreamBuildInduction(action, currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = dreamBuildTabUnlocked(result.gameState) ? "dream_build" : "overview";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleDreamBuildDrivetrain(action) {
  const result = buyDreamBuildDrivetrain(action, currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = dreamBuildTabUnlocked(result.gameState) ? "dream_build" : "overview";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleDreamBuildAero(action) {
  const result = buyDreamBuildAero(action, currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = dreamBuildTabUnlocked(result.gameState) ? "dream_build" : "overview";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleDreamBuildFinal(action) {
  const result = buyDreamBuildFinal(action, currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = dreamBuildTabUnlocked(result.gameState) ? "dream_build" : "overview";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleGarageEvent(eventId) {
  const result = completeGarageEvent(eventId, currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = "dream_build";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleStartCarAssignment(assignmentId) {
  const result = startCarAssignment(assignmentId, currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = "car_management";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleCollectCarAssignment() {
  const result = collectCarAssignment(currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = "car_management";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleSecondCarProjectAction(action) {
  const fn = action === "acquire" ? acquireSecondProjectCar : openSecondBay;
  const result = fn(currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = "car_management";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleShowcasePrep() {
  const result = buyShowcasePrep(currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = "overview";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(result.feedback);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleSponsorInquiry() {
  const result = acceptSponsorInquiry(currentGameState(), {
    activeDrive: appState.running || appState.calibrating,
    now: new Date(),
  });
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    renderTofuShop(result.gameState);
    return;
  }
  saveGameState(result.gameState);
  appState.shopInlineResult = result.feedback;
  appState.shopTab = "overview";
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(`${result.feedback} +${formatCashCount(result.cashReward)} Cash, +${formatCashCount(result.brandValue)} Brand Value.`);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
}

function handleHiddenShirtLater() {
  if (appState.running || appState.calibrating) return;
  const itemId = elements.hiddenShirtLink && elements.hiddenShirtLink.dataset
    ? elements.hiddenShirtLink.dataset.merchUnlockId || HIDDEN_SHIRT_ID
    : HIDDEN_SHIRT_ID;
  const result = acknowledgeMerchUnlockReveal(itemId, currentGameState());
  if (!result.ok) {
    setSummaryStatusMessage(result.reason);
    return;
  }
  saveGameState(result.gameState);
  if (appState.lastSummary && appState.lastSummary.deliveryRewards) {
    appState.lastSummary.deliveryRewards.gameState = result.gameState;
  }
  renderMerchPanel(loadClubState(), result.gameState);
  renderMerchProgress(result.gameState);
  renderHiddenShirtReveal(appState.lastSummary);
  setSummaryStatusMessage("Hidden reward saved to your parked rewards.");
}

function handleHiddenShirtLinkClick() {
  if (appState.running || appState.calibrating) return;
  const itemId = elements.hiddenShirtLink && elements.hiddenShirtLink.dataset
    ? elements.hiddenShirtLink.dataset.merchUnlockId || HIDDEN_SHIRT_ID
    : HIDDEN_SHIRT_ID;
  const result = acknowledgeMerchUnlockReveal(itemId, currentGameState());
  if (result.ok) {
    saveGameState(result.gameState);
    if (appState.lastSummary && appState.lastSummary.deliveryRewards) {
      appState.lastSummary.deliveryRewards.gameState = result.gameState;
    }
  }
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
  if (result.storyTeaser) appState.shopStoryTeaser = result.storyTeaser;
  if (successMessage) appState.shopInlineResult = successMessage;
  renderGamePanels(result.gameState);
  setSummaryStatusMessage(successMessage);
  playCosmeticSound("upgrade_purchased", result.gameState, { activeDrive: false });
  if (result.station) {
    trackShopPurchaseAnalytics("tofu_driver_generator_purchased", result, "generator_id");
  } else if (result.upgrade) {
    trackShopPurchaseAnalytics("tofu_driver_shop_upgrade_purchased", result, "upgrade_id");
  }
  return true;
}

function handleTofuShopPanelClick(event) {
  if (appState.running || appState.calibrating) {
    setSummaryStatusMessage("Shop actions unlock after you finish and park.");
    return;
  }
  const target = event.target && event.target.closest ? event.target.closest("button") : null;
  if (!target) return;
  if (target.dataset.goalStackTarget) {
    handleGoalStackTarget(target.dataset.goalStackTarget);
    return;
  }
  if (target.dataset.shopTab) {
    appState.shopTab = target.dataset.shopTab;
    let state = currentGameState();
    state = clearNewlyRevealedTab(state, appState.shopTab);
    state.shop.currentShopTab = appState.shopTab;
    saveGameState(state);
    renderTofuShop(state);
    return;
  }
  if (target.dataset.surfaceTarget) {
    setAppSurface(target.dataset.surfaceTarget, { updateHash: true, scroll: true, trackNav: true });
    renderGamePanels(currentGameState());
    return;
  }
  if (target.dataset.builderNotePreset !== undefined) {
    const card = target.closest(".nospill-builder-note-card");
    const input = card && card.querySelector ? card.querySelector("[data-builder-note-input]") : null;
    const count = card && card.querySelector ? card.querySelector("[data-builder-note-count]") : null;
    if (input) {
      const preset = sanitizeBuilderNote(target.dataset.builderNotePreset);
      input.value = preset;
      if (count) count.textContent = `${Array.from(preset).length} / ${BUILDER_NOTE_MAX_LENGTH}`;
    }
    return;
  }
  if (target.dataset.builderNoteAction) {
    if (target.dataset.builderNoteAction === "edit") {
      appState.builderNoteEditing = true;
      renderGamePanels(currentGameState());
      return;
    }
    const card = target.closest(".nospill-builder-note-card");
    const input = card && card.querySelector ? card.querySelector("[data-builder-note-input]") : null;
    const value = target.dataset.builderNoteAction === "clear" ? "" : (input ? input.value : "");
    const result = saveBuilderNote(value, currentGameState());
    if (!result.ok) {
      setSummaryStatusMessage(result.reason);
      return;
    }
    appState.builderNoteEditing = false;
    saveGameState(result.gameState);
    renderGamePanels(result.gameState);
    setSummaryStatusMessage(result.note ? "Builder Note saved locally." : "Builder Note cleared.");
    return;
  }
  if (target.dataset.carAssignmentStart) {
    handleStartCarAssignment(target.dataset.carAssignmentStart);
    return;
  }
  if (target.dataset.carAssignmentCollect) {
    handleCollectCarAssignment();
    return;
  }
  if (target.dataset.garageEvent) {
    handleGarageEvent(target.dataset.garageEvent);
    return;
  }
  if (target.dataset.dreamBuildAction) {
    if (target.dataset.dreamBuildAction === "buy-wheels") {
      handleBuyDreamBuildWheels();
    } else if (target.dataset.dreamBuildAction === "buy-exhaust" || target.dataset.dreamBuildAction === "seal-joints" || target.dataset.dreamBuildAction === "tuned-note" || target.dataset.dreamBuildAction === "heat-wrap" || target.dataset.dreamBuildAction === "showcase-finish") {
      handleDreamBuildExhaust(target.dataset.dreamBuildAction);
    } else if (
      target.dataset.dreamBuildAction === "suspension-refreshed"
      || target.dataset.dreamBuildAction === "ride-height-set"
      || target.dataset.dreamBuildAction === "alignment-dialed"
      || target.dataset.dreamBuildAction === "corner-balance"
      || target.dataset.dreamBuildAction === "showcase-stance"
    ) {
      handleDreamBuildSuspension(target.dataset.dreamBuildAction);
    } else if (
      target.dataset.dreamBuildAction === "sports-tire-set"
      || target.dataset.dreamBuildAction === "extreme-summer-tires"
      || target.dataset.dreamBuildAction === "track-day-r-compounds"
      || target.dataset.dreamBuildAction === "racing-slicks"
      || target.dataset.dreamBuildAction === "event-tire-set"
    ) {
      handleDreamBuildTires(target.dataset.dreamBuildAction);
    } else if (
      target.dataset.dreamBuildAction === "sports-brake-pads"
      || target.dataset.dreamBuildAction === "sports-brake-kit"
      || target.dataset.dreamBuildAction === "racing-brake-kit"
      || target.dataset.dreamBuildAction === "carbon-ceramic-big-brake-kit"
      || target.dataset.dreamBuildAction === "brake-balance-control-package"
    ) {
      handleDreamBuildBrakes(target.dataset.dreamBuildAction);
    } else if (
      target.dataset.dreamBuildAction === "sports-intercooler"
      || target.dataset.dreamBuildAction === "electronic-boost-control"
      || target.dataset.dreamBuildAction === "hybrid-turbo-upgrade"
      || target.dataset.dreamBuildAction === "big-turbo-kit"
      || target.dataset.dreamBuildAction === "anti-lag-cooling-package"
    ) {
      handleDreamBuildInduction(target.dataset.dreamBuildAction);
    } else if (
      target.dataset.dreamBuildAction === "sports-clutch-flywheel"
      || target.dataset.dreamBuildAction === "limited-slip-differential"
      || target.dataset.dreamBuildAction === "carbon-driveshaft-axles"
      || target.dataset.dreamBuildAction === "custom-gearbox"
      || target.dataset.dreamBuildAction === "sequential-transmission-package"
    ) {
      handleDreamBuildDrivetrain(target.dataset.dreamBuildAction);
    } else if (
      target.dataset.dreamBuildAction === "front-splitter-side-skirts"
      || target.dataset.dreamBuildAction === "rear-diffuser-wing"
      || target.dataset.dreamBuildAction === "wide-body-vented-panels"
      || target.dataset.dreamBuildAction === "weight-reduction-package"
      || target.dataset.dreamBuildAction === "carbon-body-roll-cage"
    ) {
      handleDreamBuildAero(target.dataset.dreamBuildAction);
    } else if (
      target.dataset.dreamBuildAction === "final-detail"
      || target.dataset.dreamBuildAction === "shakedown-complete"
    ) {
      handleDreamBuildFinal(target.dataset.dreamBuildAction);
    } else if (target.dataset.dreamBuildAction === "prepare-showcase") {
      handleShowcasePrep();
    } else if (target.dataset.dreamBuildAction === "accept-sponsor-inquiry") {
      handleSponsorInquiry();
    } else {
      handleDreamBuildWheelsWork(target.dataset.dreamBuildAction);
    }
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
    saveShopActionResult(
      result,
      result.ok
        ? `Bought ${formatShopCount(result.quantity)} ${result.station.name}.${result.milestoneFeedback ? ` ${result.milestoneFeedback}.` : ""}`
        : "",
    );
    return;
  }
  if (target.dataset.shopStationMax) {
    const result = buyShopStation(target.dataset.shopStationMax, currentGameState(), "max");
    saveShopActionResult(
      result,
      result.ok
        ? `Bought ${formatShopCount(result.quantity)} ${result.station.name}.${result.milestoneFeedback ? ` ${result.milestoneFeedback}.` : ""}`
        : "",
    );
    return;
  }
  if (target.dataset.bulkBuy) {
    const [kind, mode] = target.dataset.bulkBuy.split(":");
    const result = buyBulkShopItems(currentGameState(), kind, mode);
    saveShopActionResult(result, result.ok ? result.message : "");
    return;
  }
  if (target.dataset.counterContract) {
    const result = buyCounterContract(target.dataset.counterContract, currentGameState(), {
      activeDrive: appState.running || appState.calibrating,
    });
    saveShopActionResult(result, result.ok ? result.feedback : "");
    return;
  }
  if (target.dataset.spiritGeneratorBulk) {
    const result = buyAllAffordableSpiritGenerators(currentGameState(), {
      activeDrive: appState.running || appState.calibrating,
    });
    saveShopActionResult(result, result.ok ? result.feedback : "");
    return;
  }
  if (target.dataset.coveredCarTeaser) {
    const result = acknowledgeCoveredCarTeaser(currentGameState());
    if (!result.ok) {
      setSummaryStatusMessage(result.reason);
      renderTofuShop(result.gameState);
      return;
    }
    saveGameState(result.gameState);
    renderGamePanels(result.gameState);
    setSummaryStatusMessage(result.feedback || "Behind the shop, the covered car waits.");
    return;
  }
  if (target.dataset.fulfillOrders) {
    const result = fulfillShopOrders(currentGameState(), target.dataset.fulfillOrders, {
      activeDrive: false,
      orderTypeId: target.dataset.orderType || "simple_tofu_box",
    });
    if (!result.ok) {
      setSummaryStatusMessage(result.reason);
      renderTofuShop(result.gameState);
      return;
    }
    saveGameState(result.gameState);
    showShopOrderInlineResult(result);
    trackShopOrderFulfilledAnalytics(result);
    playCosmeticSound("shop_pack_tofu", result.gameState, { activeDrive: false });
    return;
  }
  if (target.dataset.counterServiceAction) {
    handleCounterServiceAction(target.dataset.counterServiceAction);
    return;
  }
  if (target.dataset.secondCarAction) {
    handleSecondCarProjectAction(target.dataset.secondCarAction);
    return;
  }
  const actionMap = [
    ["stationUpgrade", "data-station-upgrade", buyStationUpgrade, (result) => `${result.upgrade.name} upgraded.`],
    ["shopRoute", "data-shop-route", completeFictionalRoute, (result) => `${result.route.name} complete.`],
    ["trainingDrill", "data-training-drill", runTrainingDrill, (result) => `${result.drill.name} complete.`],
    ["garageUpgrade", "data-garage-upgrade", buyGarageUpgrade, (result) => `${result.upgrade.name} upgraded.`],
    ["crewRole", "data-crew-role", hireCrewRole, (result) => `${result.role.name} joined.`],
    ["spiritGenerator", "data-spirit-generator", buySpiritGenerator, (result) => `${result.generator.name} added.`],
    ["spiritBoost", "data-spirit-boost", useShopSpiritBoost, (result) => result.feedback || `${result.boost.name} used.`],
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
    saveShopActionResult(result, result.ok ? `License Exam passed. +${formatShopCount(result.starsEarned)} License Stars.` : "");
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

function handleShopDetailsToggle(event) {
  const target = event.target;
  if (!target || !target.matches || !target.matches("details[data-details-key]")) return;
  const key = target.dataset.detailsKey;
  if (!key) return;
  appState.detailOpenState = appState.detailOpenState || {};
  appState.detailOpenState[key] = Boolean(target.open);
}

function handleGoalStackTarget(target) {
  if (appState.running || appState.calibrating) {
    setSummaryStatusMessage("Shop actions unlock after you finish and park.");
    return;
  }
  if (target === "counter-service") {
    focusCounterServiceCard();
    setSummaryStatusMessage("Review Counter Service and its handoff upgrades while parked.");
    return;
  }
  const tabTargets = {
    production: "production",
    upgrades: "upgrades",
    spirit: "spirit",
    overview: "overview",
    "dream-build": "overview",
    "net-worth": "overview",
    "car-management": "car_management",
  };
  const tabId = tabTargets[target] || "overview";
  setAppSurface("shop", { updateHash: true, scroll: true, target: "actions", focus: true });
  appState.shopTab = tabId;
  const state = currentGameState();
  state.shop.currentShopTab = tabId;
  saveGameState(state);
  renderGamePanels(state);
  if (target === "dream-build") {
    setSummaryStatusMessage("Review Dream Build progress. Future build tracks stay target-only until implemented.");
  } else if (target === "car-management") {
    setSummaryStatusMessage("Review the managed completed car and assignment board while parked.");
  } else if (target === "net-worth") {
    setSummaryStatusMessage("Review Net Worth progress toward the era goal.");
  } else if (target === "spirit") {
    setSummaryStatusMessage("Review parked-only Shop Spirit actions.");
  } else {
    setSummaryStatusMessage("Review the recommended Tofu Garage panel.");
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
  trackEvent("tofu_driver_simulator_scenario_run", {
    scenario_id: safeAnalyticsString(scenarioId, 64),
    simulator: true,
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
  const support = motionSupportStatus();
  elements.startButton.disabled = !ready || !support.canAttemptStart;
  setLandingStatus(
    !ready
      ? "Complete the safety checklist to begin."
      : support.message,
  );
}

function showMotionStartFailure(result) {
  const message = result && result.reason
    ? result.reason
    : MOTION_SUPPORT_MESSAGES.permissionError;
  if (result && result.state === "unsupported") {
    showUnsupported(message);
    return;
  }
  showView("landing");
  if (elements.setupFlow) elements.setupFlow.classList.remove("is-hidden");
  setLandingStatus(message);
}

function updateModeCopy() {
  if (!elements.modeCopy) return;
  elements.modeCopy.textContent =
    "Start Cup Test. For certified route-context achievements, Tofu Driver may ask for location after you start. Location is used locally to summarize route shape and qualify route-context stamps.";
}

function setMode(mode) {
  appState.mode = "qualified";
  document.querySelectorAll("[data-mode]").forEach((button) => {
    const active = button.dataset.mode === appState.mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-checked", String(active));
  });
  updateModeCopy();
}

function setDifficulty(difficulty) {
  appState.difficulty = normalizeCargoTypeId(difficulty);
  document.querySelectorAll("[data-difficulty]").forEach((button) => {
    const active = normalizeCargoTypeId(button.dataset.difficulty) === appState.difficulty;
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
  trackEvent("tofu_driver_cup_test_setup_started", {
    mode: modeAnalyticsLabel(appState.mode),
    simulator: false,
  });
  stopAxisPreview();
  const support = motionSupportStatus();
  if (!support.canAttemptStart) {
    trackEvent("tofu_driver_sensor_unavailable", { mode: modeAnalyticsLabel(appState.mode) });
    showUnsupported(support.message);
    return;
  }
  appState.audioEnabled = elements.audioToggle.checked;
  elements.audioToggleRunning.checked = appState.audioEnabled;

  const permission = await requestMotionPermission();
  if (!permission.ok) {
    stopAudioCoach();
    showMotionStartFailure(permission);
    return;
  }
  if (appState.audioEnabled) await ensureAudioCoach();

  resetSessionState();
  appState.audioEnabled = elements.audioToggle.checked;
  appState.calibrating = true;
  appState.running = false;
  appState.calibrationStartedMs = performance.now();
  elements.runModeLabel.textContent = "Cup Test";
  showView("run");
  setRunStatus("Calibrating neutral phone position. Keep the phone mounted and still.");
  window.addEventListener("devicemotion", handleMotionEvent, { passive: true });
  window.setTimeout(handleCalibrationTimeout, CALIBRATION_TIMEOUT_MS);
  startLocationWatch();
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
  const node = target === "shop" && elements.tofuShopSection
      ? elements.tofuGarageActions || elements.tofuShopSection
      : elements.landingView;
  scrollAndFocusParkedNode(node, { focus: target === "shop" });
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
    const bestOrder = bestFulfillableShopOrderType(currentGameState());
    handleFulfillShopOrder("1", bestOrder ? bestOrder.id : "simple_tofu_box");
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
  appState.shopTab = "upgrades";
  renderGamePanels(currentGameState());
  elements.tofuShopSection.scrollIntoView({ behavior: "smooth", block: "start" });
  if (!upgradeId || !elements.shopTabPanel || !elements.shopTabPanel.querySelector) return;
  const safeUpgradeId =
    typeof CSS !== "undefined" && CSS.escape
      ? CSS.escape(upgradeId)
      : String(upgradeId).replace(/"/g, "");
  const button = elements.shopTabPanel.querySelector(`[data-station-upgrade="${safeUpgradeId}"], [data-shop-upgrade="${safeUpgradeId}"]`);
  if (button && typeof button.focus === "function") button.focus();
}

function focusCounterServiceCard() {
  if (!elements.tofuShopSection) return;
  setAppSurface("shop", { updateHash: true, scroll: true, target: "actions", focus: true });
  appState.shopTab = "overview";
  renderGamePanels(currentGameState());
  if (elements.tofuShopSection && typeof elements.tofuShopSection.scrollIntoView === "function") {
    elements.tofuShopSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (!elements.shopTabPanel || !elements.shopTabPanel.querySelector) return;
  const card = elements.shopTabPanel.querySelector("[data-counter-service-card]");
  if (card && typeof card.scrollIntoView === "function") card.scrollIntoView({ behavior: "smooth", block: "center" });
  const button = card && card.querySelector
    ? card.querySelector("button:not([disabled])")
    : null;
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
    const orderTypeId = elements.gameCtaButton && elements.gameCtaButton.dataset
      ? elements.gameCtaButton.dataset.nextOrderType || "simple_tofu_box"
      : "simple_tofu_box";
    handleFulfillShopOrder(orderQuantity, orderTypeId);
    return;
  }
  if (actionType === "buy_upgrade") {
    const upgradeId = elements.gameCtaButton.dataset.nextUpgrade || "";
    focusShopUpgrade(upgradeId);
    setSummaryStatusMessage("Choose an available shop upgrade while parked.");
    return;
  }
  if (actionType === "buy_station") {
    setAppSurface("shop", { updateHash: true, scroll: true, target: "actions", focus: true });
    appState.shopTab = "production";
    renderGamePanels(currentGameState());
    setSummaryStatusMessage("Choose the recommended shop station while parked.");
    return;
  }
  if (actionType === "start_counter_service") {
    handleCounterServiceAction("start");
    return;
  }
  if (actionType === "use_spirit_boost") {
    const boostId = elements.gameCtaButton && elements.gameCtaButton.dataset
      ? elements.gameCtaButton.dataset.nextSpiritBoost || ""
      : "";
    const result = useShopSpiritBoost(boostId, currentGameState());
    saveShopActionResult(result, result.ok ? result.feedback : "");
    return;
  }
  if (actionType === "buy_dream_wheels") {
    handleBuyDreamBuildWheels();
    return;
  }
  if (actionType === "buy_dream_wheels_work") {
    const work = nextDreamBuildWheelsWork(currentGameState());
    if (work) {
      handleDreamBuildWheelsWork(work.action);
    } else {
      setSummaryStatusMessage("Wheels work is complete for now.");
    }
    return;
  }
  if (actionType === "buy_dream_exhaust" || actionType === "buy_dream_exhaust_work") {
    const work = nextDreamBuildExhaustWork(currentGameState());
    if (work) {
      handleDreamBuildExhaust(work.action);
    } else {
      setSummaryStatusMessage("Suspension is the next build track.");
    }
    return;
  }
  if (actionType === "buy_dream_suspension_work") {
    const work = nextDreamBuildSuspensionWork(currentGameState());
    if (work) {
      handleDreamBuildSuspension(work.action);
    } else {
      setSummaryStatusMessage("Tires & Rubber is the next build track.");
    }
    return;
  }
  if (actionType === "buy_dream_tires_work") {
    const work = nextDreamBuildTiresWork(currentGameState());
    if (work) {
      handleDreamBuildTires(work.action);
    } else {
      setSummaryStatusMessage("Brakes & Control is the next build track.");
    }
    return;
  }
  if (actionType === "buy_dream_brakes_work") {
    const work = nextDreamBuildBrakesWork(currentGameState());
    if (work) {
      handleDreamBuildBrakes(work.action);
    } else {
      setSummaryStatusMessage("Induction & Cooling is the next build track.");
    }
    return;
  }
  if (actionType === "buy_dream_induction_work") {
    const work = nextDreamBuildInductionWork(currentGameState());
    if (work) {
      handleDreamBuildInduction(work.action);
    } else {
      setSummaryStatusMessage("Drivetrain & Transmission is the next build track.");
    }
    return;
  }
  if (actionType === "buy_dream_drivetrain_work") {
    const work = nextDreamBuildDrivetrainWork(currentGameState());
    if (work) {
      handleDreamBuildDrivetrain(work.action);
    } else {
      setSummaryStatusMessage("Aero, Styling & Weight Reduction is the next build track.");
    }
    return;
  }
  if (actionType === "buy_dream_aero_work") {
    const work = nextDreamBuildAeroWork(currentGameState());
    if (work) {
      handleDreamBuildAero(work.action);
    } else {
      setSummaryStatusMessage("Final Detail & Shakedown is the next core build step.");
    }
    return;
  }
  if (actionType === "buy_dream_final_work") {
    const work = nextDreamBuildFinalWork(currentGameState());
    if (work) {
      handleDreamBuildFinal(work.action);
    } else {
      setSummaryStatusMessage("First Complete Build is finished. Car Management is unlocked.");
    }
    return;
  }
  if (actionType === "enter_garage_event") {
    const eventId = elements.gameCtaButton && elements.gameCtaButton.dataset
      ? elements.gameCtaButton.dataset.nextGarageEvent || ""
      : "";
    handleGarageEvent(eventId);
    return;
  }
  if (actionType === "garage_event_target") {
    setAppSurface("shop", { updateHash: true, scroll: true, target: "actions", focus: true });
    appState.shopTab = "dream_build";
    renderGamePanels(currentGameState());
    setSummaryStatusMessage("Review the Garage Event Board while parked.");
    return;
  }
  if (actionType === "start_car_assignment") {
    const assignmentId = elements.gameCtaButton && elements.gameCtaButton.dataset
      ? elements.gameCtaButton.dataset.nextCarAssignment || ""
      : "";
    handleStartCarAssignment(assignmentId);
    return;
  }
  if (actionType === "collect_car_assignment") {
    handleCollectCarAssignment();
    return;
  }
  if (actionType === "open_second_bay") {
    handleSecondCarProjectAction("open_bay");
    return;
  }
  if (actionType === "acquire_second_project_car") {
    handleSecondCarProjectAction("acquire");
    return;
  }
  if (actionType === "car_assignment_active" || actionType === "car_management_target") {
    setAppSurface("shop", { updateHash: true, scroll: true, target: "actions", focus: true });
    appState.shopTab = "car_management";
    renderGamePanels(currentGameState());
    setSummaryStatusMessage("Review the Car Management assignment board while parked.");
    return;
  }
  if (actionType === "prepare_showcase") {
    handleShowcasePrep();
    return;
  }
  if (actionType === "accept_sponsor_inquiry") {
    handleSponsorInquiry();
    return;
  }
  if (actionType === "watch_starter_shop" || actionType === "queue_full" || actionType === "wait_counter_service") {
    focusCounterServiceCard();
    setSummaryStatusMessage(actionType === "watch_starter_shop"
      ? "Watch the starter shop run, then buy the first useful upgrade."
      : "Review Counter Service and its handoff upgrades while parked.");
    return;
  }
  if (actionType === "continue_shop") {
    setAppSurface("shop", { updateHash: true, scroll: true, target: "actions", focus: true });
    setSummaryStatusMessage("Review the Tofu Shop while parked.");
    return;
  }
  if (actionType === "covered_car_teaser") {
    setAppSurface("shop", { updateHash: true, scroll: true, target: "actions", focus: true });
    appState.shopTab = "overview";
    const result = acknowledgeCoveredCarTeaser(currentGameState());
    saveGameState(result.gameState);
    renderGamePanels(result.gameState);
    setSummaryStatusMessage(result.feedback || "Behind the shop, the covered car waits.");
    return;
  }
  if (actionType === "dream_investment_target") {
    setAppSurface("shop", { updateHash: true, scroll: true, target: "actions", focus: true });
    appState.shopTab = "overview";
    renderGamePanels(currentGameState());
    setSummaryStatusMessage("Review the Dream Build target. Full Dream Garage comes later.");
    return;
  }
  if (actionType === "showcase_prep_target" || actionType === "net_worth_milestone") {
    setAppSurface("shop", { updateHash: true, scroll: true, target: "actions", focus: true });
    appState.shopTab = "overview";
    renderGamePanels(currentGameState());
    setSummaryStatusMessage(actionType === "showcase_prep_target"
      ? "Review Showcase Prep. Sponsor Inquiry follows the first display setup."
      : "Review Net Worth progress toward the next milestone.");
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
  if (elements.stampFanfareContinue) {
    elements.stampFanfareContinue.addEventListener("click", continueFromStampFanfare);
  }
  if (elements.stampFanfarePassport) {
    elements.stampFanfarePassport.addEventListener("click", viewPassportFromStampFanfare);
  }
  if (elements.discoveryFanfareView) {
    elements.discoveryFanfareView.addEventListener("click", viewSystemFromDiscoveryFanfare);
  }
  if (elements.discoveryFanfareContinue) {
    elements.discoveryFanfareContinue.addEventListener("click", continueFromDiscoveryFanfare);
  }
  if (elements.brandPrimaryCta) {
    elements.brandPrimaryCta.addEventListener("click", () => {
      if (appState.running || appState.calibrating) return;
      if (elements.brandPrimaryCta.dataset.brandAction === "cup-test") {
        revealSetupFlow();
        return;
      }
      setAppSurface("shop", { updateHash: true, scroll: true, target: "actions", focus: true });
      renderGamePanels(loadGameState());
    });
  }
  if (elements.brandSecondaryCta) {
    elements.brandSecondaryCta.addEventListener("click", () => {
      if (appState.running || appState.calibrating) return;
      const target = elements.brandSecondaryCta.dataset.brandAction === "cup-test"
        ? "cup-test"
        : "shop";
      setAppSurface(target, { updateHash: true, scroll: true, trackNav: true, target: target === "shop" ? "actions" : "", focus: target === "shop" });
      renderGamePanels(loadGameState());
    });
  }
  if (elements.surfaceNavButtons) {
    elements.surfaceNavButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (appState.running || appState.calibrating) return;
        const surface = button.dataset.surfaceTarget === "cup-test"
          ? "cup-test"
          : button.dataset.surfaceTarget === "crew"
            ? "crew"
            : "shop";
        setAppSurface(surface, { updateHash: true, scroll: true, trackNav: true });
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
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && appState.currentStampFanfare) hideStampFanfare();
      if (event.key === "Escape" && appState.currentDiscoveryFanfare) hideDiscoveryFanfare();
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
  if (elements.resultStoryCaptionInput) {
    elements.resultStoryCaptionInput.addEventListener("input", handleResultStoryCaptionInput);
  }
  if (elements.resultStorySection) {
    elements.resultStorySection.addEventListener("click", handleResultStoryPresetClick);
  }
  if (elements.shareTrailModeSection) {
    elements.shareTrailModeSection.addEventListener("change", handleShareTrailModeChange);
  }
  elements.returnDashboardButton.addEventListener("click", handlePrimaryResultAction);
  if (elements.hiddenShirtLater) elements.hiddenShirtLater.addEventListener("click", handleHiddenShirtLater);
  if (elements.hiddenShirtLink) elements.hiddenShirtLink.addEventListener("click", handleHiddenShirtLinkClick);
  if (elements.exportProgressButton) elements.exportProgressButton.addEventListener("click", exportProgress);
  if (elements.importProgressButton) elements.importProgressButton.addEventListener("click", importProgress);
  if (elements.resetProgressButton) elements.resetProgressButton.addEventListener("click", resetProgress);
  if (elements.gamePackTofuButton) {
    elements.gamePackTofuButton.addEventListener("click", handlePackTofu);
  }
  elements.packTofuButton.addEventListener("click", handlePackTofu);
  elements.fulfillShopOrderButton.addEventListener("click", handleFulfillBestShopOrder);
  if (elements.shopTabPanel) {
    elements.shopTabPanel.addEventListener("click", handleTofuShopPanelClick);
    elements.shopTabPanel.addEventListener("click", handleShopUpgradeClick);
    elements.shopTabPanel.addEventListener("toggle", handleShopDetailsToggle, true);
  }
  if (elements.shopTabList) elements.shopTabList.addEventListener("click", handleTofuShopPanelClick);
  if (elements.shopOfflineEarnings) elements.shopOfflineEarnings.addEventListener("click", handleTofuShopPanelClick);
  if (elements.shopBuyMultiplier) {
    elements.shopBuyMultiplier.addEventListener("change", handleShopMultiplierChange);
  }
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
    brandShelfEyebrow: document.getElementById("brand-shelf-eyebrow"),
    landingTitle: document.getElementById("landing-title"),
    brandShelfCopy: document.getElementById("brand-shelf-copy"),
    brandShelfSafety: document.getElementById("brand-shelf-safety"),
    brandPrimaryCta: document.getElementById("brand-primary-cta"),
    brandSecondaryCta: document.getElementById("brand-secondary-cta"),
    surfaceSections: Array.from(document.querySelectorAll("[data-app-surface]")),
    surfaceNavButtons: Array.from(document.querySelectorAll("[data-surface-target]")),
    tofuShopSection: document.getElementById("tofu-shop"),
    tofuGarageActions: document.getElementById("tofu-garage-actions"),
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
    shopInlineResult: document.getElementById("shop-inline-result"),
    packTofuButton: document.getElementById("pack-tofu-button"),
    packTofuHelper: document.getElementById("pack-tofu-helper"),
    fulfillShopOrderButton: document.getElementById("fulfill-shop-order-button"),
    fulfillShopOrderHelper: document.getElementById("fulfill-shop-order-helper"),
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
    summaryCharacterCameo: document.getElementById("summary-character-cameo"),
    hiddenShirtReveal: document.getElementById("hidden-shirt-reveal"),
    hiddenShirtTitle: document.getElementById("hidden-shirt-title"),
    hiddenShirtCopy: document.getElementById("hidden-shirt-copy"),
    hiddenShirtSubcopy: document.getElementById("hidden-shirt-subcopy"),
    hiddenShirtLink: document.getElementById("hidden-shirt-link"),
    hiddenShirtLater: document.getElementById("hidden-shirt-later"),
    summaryGrid: document.getElementById("summary-grid"),
    routeContext: document.getElementById("route-context"),
    routeGrid: document.getElementById("route-grid"),
    milestoneOutput: document.getElementById("milestone-output"),
    merchProgressGrid: document.getElementById("merch-progress-grid"),
    merchGrid: document.getElementById("merch-grid"),
    deliverySummaryGrid: document.getElementById("delivery-summary-grid"),
    coachRecapCard: document.getElementById("coach-recap-card"),
    cupTrailCard: document.getElementById("cup-trail-card"),
    commuteMasteryCopy: document.getElementById("commute-mastery-copy"),
    resultStorySection: document.getElementById("result-story-section"),
    resultStoryCaptionInput: document.getElementById("result-story-caption"),
    resultStoryCount: document.getElementById("result-story-count"),
    resultStoryPreview: document.getElementById("result-story-preview"),
    resultStoryPresetButtons: Array.from(document.querySelectorAll("[data-story-caption-preset]")),
    storyCardPreviewSection: document.getElementById("story-card-preview-section"),
    storyCardPreviewStatus: document.getElementById("story-card-preview-status"),
    storyCardPreviewCondition: document.getElementById("story-card-preview-condition"),
    storyCardPreviewCargo: document.getElementById("story-card-preview-cargo"),
    storyCardPreviewRank: document.getElementById("story-card-preview-rank"),
    storyCardPreviewRouteMode: document.getElementById("story-card-preview-route-mode"),
    storyCardPreviewRouteContext: document.getElementById("story-card-preview-route-context"),
    storyCardPreviewRouteVisual: document.getElementById("story-card-preview-route-visual"),
    storyCardPreviewCommentary: document.getElementById("story-card-preview-commentary"),
    storyCardPreviewCoach: document.getElementById("story-card-preview-coach"),
    storyCardPreviewCaptionBox: document.getElementById("story-card-preview-caption-box"),
    storyCardPreviewCaption: document.getElementById("story-card-preview-caption"),
    storyCardPreviewFooter: document.getElementById("story-card-preview-footer"),
    cargoCommentarySection: document.getElementById("cargo-commentary-section"),
    cargoCommentaryCard: document.getElementById("cargo-commentary-card"),
    shareCardSection: document.getElementById("share-card-section"),
    shareTrailModeSection: document.getElementById("share-trail-mode-section"),
    shareTrailModeInputs: Array.from(document.querySelectorAll('input[name="share-trail-mode"]')),
    shareTrailWarning: document.getElementById("route-share-warning"),
    shareCanvas: document.getElementById("share-canvas"),
    shareButton: document.getElementById("share-button"),
    downloadButton: document.getElementById("download-button"),
    copyButton: document.getElementById("copy-button"),
    saveButton: document.getElementById("save-button"),
    returnDashboardButton: document.getElementById("return-dashboard-button"),
    newRunButton: document.getElementById("new-run-button"),
    runDetailsSection: document.getElementById("run-details-section"),
    summaryStatus: document.getElementById("summary-status"),
    stampFanfare: document.getElementById("stamp-fanfare"),
    stampFanfareCard: document.getElementById("stamp-fanfare-card"),
    stampFanfareTitle: document.getElementById("stamp-fanfare-title"),
    stampFanfareName: document.getElementById("stamp-fanfare-name"),
    stampFanfareCopy: document.getElementById("stamp-fanfare-copy"),
    stampFanfareRewards: document.getElementById("stamp-fanfare-rewards"),
    stampFanfareContinue: document.getElementById("stamp-fanfare-continue"),
    stampFanfarePassport: document.getElementById("stamp-fanfare-passport"),
    discoveryFanfare: document.getElementById("discovery-fanfare"),
    discoveryFanfareCard: document.getElementById("discovery-fanfare-card"),
    discoveryFanfareTitle: document.getElementById("discovery-fanfare-title"),
    discoveryFanfareSystem: document.getElementById("discovery-fanfare-system"),
    discoveryFanfareCopy: document.getElementById("discovery-fanfare-copy"),
    discoveryFanfareSecondary: document.getElementById("discovery-fanfare-secondary"),
    discoveryFanfareView: document.getElementById("discovery-fanfare-view"),
    discoveryFanfareContinue: document.getElementById("discovery-fanfare-continue"),
  };
}

function initNoSpillApp() {
  cacheElements();
  initAnalytics();
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
  updateStartReadiness();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initNoSpillApp);
}
