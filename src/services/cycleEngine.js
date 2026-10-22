/**
 * LunaGlow 3D - Cycle Prediction & Health Engine
 */

export const PHASES = {
  MENSTRUAL: 'MENSTRUAL',
  FOLLICULAR: 'FOLLICULAR',
  OVULATION: 'OVULATION',
  LUTEAL: 'LUTEAL',
};

export const PHASE_CONFIG = {
  [PHASES.MENSTRUAL]: {
    name: 'Menstrual Phase',
    subtitle: 'Rest, Replenish & Release',
    color: '#ff4d6d',
    secondaryColor: '#c9184a',
    glowColor: 'rgba(255, 77, 109, 0.45)',
    orbColor: 0xff3366,
    icon: '🩸',
    description: 'Uterine lining is shedding. Energy may be lower. Prioritize gentle rest, warmth, and iron-rich hydration.',
    hormones: 'Estrogen & Progesterone are at their lowest baseline',
    idealFood: 'Iron-rich dark greens, berry smoothies, warm soups & dark chocolate',
    exercise: 'Gentle stretching, restorative Yin yoga & cozy walks'
  },
  [PHASES.FOLLICULAR]: {
    name: 'Follicular Phase',
    subtitle: 'Rising Energy & Fresh Ideas',
    color: '#ff758f',
    secondaryColor: '#ffb3c1',
    glowColor: 'rgba(255, 117, 143, 0.4)',
    orbColor: 0xff758f,
    icon: '🌱',
    description: 'Follicles mature and estrogen is steadily rising. Mental clarity, mood, and creative energy are surging.',
    hormones: 'Estrogen climbs, stimulating serotonin and collagen production',
    idealFood: 'Sprouted seeds, crisp salads, avocado, fermented foods & lean proteins',
    exercise: 'Cardio, dance, strength workouts & trying new activities'
  },
  [PHASES.OVULATION]: {
    name: 'Ovulation Phase',
    subtitle: 'Peak Glow & High Fertility',
    color: '#ffb703',
    secondaryColor: '#fb8500',
    glowColor: 'rgba(255, 183, 3, 0.45)',
    orbColor: 0xffaa00,
    icon: '✨',
    description: 'An egg is released from the ovary! You are at your most radiant, magnetic, and communicative state.',
    hormones: 'Luteinizing Hormone (LH) surge & peak estrogen',
    idealFood: 'Antioxidant berries, flax seeds, asparagus, citrus & leafy cruciferous vegetables',
    exercise: 'High-intensity interval training (HIIT), heavy lifting & social sports'
  },
  [PHASES.LUTEAL]: {
    name: 'Luteal Phase',
    subtitle: 'Winding Down & Deep Focus',
    color: '#9d4edd',
    secondaryColor: '#7209b7',
    glowColor: 'rgba(157, 78, 221, 0.4)',
    orbColor: 0x9d4edd,
    icon: '🌙',
    description: 'Progesterone rises to comfort the body. As it dips later in this phase, PMS symptoms might appear. Be gentle with yourself.',
    hormones: 'Progesterone peaks, raising body temperature and calming the nervous system',
    idealFood: 'Complex carbs (sweet potatoes, oats), magnesium seeds, bananas & warm ginger tea',
    exercise: 'Pilates, moderate strength training, gentle swimming & mindful breathing'
  }
};

/**
 * Parses date string (YYYY-MM-DD) into local midnight Date
 */
export function parseLocalDate(dateStr) {
  if (!dateStr) return new Date();
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }
  return new Date(dateStr);
}

/**
 * Format Date to YYYY-MM-DD
 */
export function formatDateISO(date) {
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();

  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
}

/**
 * Calculate difference in whole days
 */
export function diffInDays(d1, d2) {
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
}

/**
 * Core calculation function given user profile and target date (defaults to today)
 */
export function calculateCycleStatus(profile, targetDate = new Date()) {
  const cycleLength = parseInt(profile.cycleLength || 28, 10);
  const periodDuration = parseInt(profile.periodDuration || 5, 10);
  const lastPeriod = parseLocalDate(profile.lastPeriodDate);
  const today = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  const daysSinceLast = diffInDays(today, lastPeriod);

  // If daysSinceLast is negative, target date is before last period
  let cycleDay = 1;
  let currentCycleStart = new Date(lastPeriod);

  if (daysSinceLast >= 0) {
    const cyclesPassed = Math.floor(daysSinceLast / cycleLength);
    cycleDay = (daysSinceLast % cycleLength) + 1;
    currentCycleStart = new Date(lastPeriod);
    currentCycleStart.setDate(currentCycleStart.getDate() + (cyclesPassed * cycleLength));
  } else {
    // Past date before first recorded period
    cycleDay = ((daysSinceLast % cycleLength) + cycleLength) % cycleLength + 1;
  }

  // Next predicted period start
  const nextPeriodStart = new Date(currentCycleStart);
  nextPeriodStart.setDate(nextPeriodStart.getDate() + cycleLength);

  const daysUntilPeriod = diffInDays(nextPeriodStart, today);

  // Ovulation is roughly 14 days before next period
  const ovulationCycleDay = Math.max(8, cycleLength - 14);
  const ovulationDate = new Date(currentCycleStart);
  ovulationDate.setDate(ovulationDate.getDate() + (ovulationCycleDay - 1));

  // Fertile window: 5 days before ovulation up to 1 day after ovulation
  const fertileStartDay = Math.max(1, ovulationCycleDay - 5);
  const fertileEndDay = Math.min(cycleLength, ovulationCycleDay + 1);

  const fertileStartDate = new Date(currentCycleStart);
  fertileStartDate.setDate(fertileStartDate.getDate() + (fertileStartDay - 1));

  const fertileEndDate = new Date(currentCycleStart);
  fertileEndDate.setDate(fertileEndDate.getDate() + (fertileEndDay - 1));

  // Determine current phase
  let phase = PHASES.FOLLICULAR;
  let phaseProgress = 0; // 0 to 1

  if (cycleDay <= periodDuration) {
    phase = PHASES.MENSTRUAL;
    phaseProgress = cycleDay / periodDuration;
  } else if (cycleDay < fertileStartDay) {
    phase = PHASES.FOLLICULAR;
    phaseProgress = (cycleDay - periodDuration) / Math.max(1, fertileStartDay - periodDuration);
  } else if (cycleDay <= fertileEndDay) {
    phase = PHASES.OVULATION;
    phaseProgress = (cycleDay - fertileStartDay + 1) / (fertileEndDay - fertileStartDay + 1);
  } else {
    phase = PHASES.LUTEAL;
    phaseProgress = (cycleDay - fertileEndDay) / Math.max(1, cycleLength - fertileEndDay);
  }

  // Conception probability
  let conceptionChance = 'Low';
  if (cycleDay === ovulationCycleDay) {
    conceptionChance = 'Peak';
  } else if (cycleDay >= fertileStartDay && cycleDay <= fertileEndDay) {
    conceptionChance = 'High';
  } else if (cycleDay === fertileStartDay - 1 || cycleDay === fertileEndDay + 1) {
    conceptionChance = 'Moderate';
  }

  // Pad & Essentials recommendation
  const padRecommendation = generatePadRecommendation({
    cycleDay,
    cycleLength,
    periodDuration,
    daysUntilPeriod,
    phase,
    isTodayPeriod: cycleDay <= periodDuration
  });

  return {
    cycleDay,
    cycleLength,
    periodDuration,
    phase,
    phaseConfig: PHASE_CONFIG[phase],
    phaseProgress,
    daysUntilPeriod,
    currentCycleStart,
    nextPeriodStart,
    ovulationCycleDay,
    ovulationDate,
    fertileStartDay,
    fertileEndDay,
    fertileStartDate,
    fertileEndDate,
    conceptionChance,
    padRecommendation,
    isPeriodDay: cycleDay <= periodDuration
  };
}

/**
 * Generate smart bag & pad carrying advice based on day and flow likelihood
 */
function generatePadRecommendation({ cycleDay, cycleLength, periodDuration, daysUntilPeriod, phase, isTodayPeriod }) {
  if (isTodayPeriod) {
    if (cycleDay <= 2) {
      return {
        level: 'HEAVY_FLOW',
        badge: 'Heavy Flow Day',
        badgeColor: '#ff2d55',
        title: 'Pack Heavy Protection Today',
        summary: 'Days 1 & 2 are normally your heaviest flow days. Carry extra protection and comforting essentials.',
        recommendation: 'Carry 3–4 Super/Overnight Pads or high-absorbency tampons + backup.',
        items: [
          { name: 'Super/Overnight Pads', quantity: '3-4 pads', icon: '🩸', essential: true },
          { name: 'Dark spare panties', quantity: '1 pair', icon: '🩲', essential: true },
          { name: 'Gentle intimate wet wipes', quantity: '1 travel pack', icon: '✨', essential: true },
          { name: 'Portable heat patch or pain reliever', quantity: '1 pouch', icon: '🔥', essential: true },
          { name: 'Comfort snack (dark chocolate/almonds)', quantity: '1 bar', icon: '🍫', essential: false }
        ]
      };
    } else {
      return {
        level: 'LIGHT_FLOW',
        badge: 'Moderate / Light Flow',
        badgeColor: '#ff758f',
        title: 'Pack Regular Day Protection',
        summary: 'Your flow is naturally tapering off. You are safe with standard pads or a menstrual cup.',
        recommendation: 'Carry 2 Regular Pads or your clean Menstrual Cup + 1 Pantyliner.',
        items: [
          { name: 'Regular flow pads or cup', quantity: '2 pads', icon: '🌸', essential: true },
          { name: 'Daily pantyliner', quantity: '1 liner', icon: '🪶', essential: false },
          { name: 'Intimate wipes', quantity: '1 pack', icon: '✨', essential: true },
          { name: 'Chamomile or mint tea pouch', quantity: '1 tea bag', icon: '🍵', essential: false }
        ]
      };
    }
  }

  // Pre-period alert window
  if (daysUntilPeriod <= 2 || cycleDay >= cycleLength - 1) {
    const dueText = daysUntilPeriod === 0 ? 'Today!' : daysUntilPeriod === 1 ? 'Tomorrow!' : 'in 2 days';
    return {
      level: 'PRE_PERIOD_WARNING',
      badge: 'Period Imminent',
      badgeColor: '#f72585',
      title: `Period Expected ${dueText}`,
      summary: 'Your cycle is ending and menstruation could begin anytime. Prepare your handbag beforehand!',
      recommendation: 'Slip 2 pads into your purse and wear a pantyliner to protect against surprise spotting.',
      items: [
        { name: 'Regular/Overnight pads in bag', quantity: '2 pads', icon: '🎒', essential: true },
        { name: 'Wear a breathable pantyliner today', quantity: '1 applied', icon: '🪶', essential: true },
        { name: 'Emergency stain-removing wipe', quantity: '1 sachet', icon: '💧', essential: false },
        { name: 'Travel Ibuprofen or cramp relief', quantity: '1 dose', icon: '💊', essential: false }
      ]
    };
  }

  if (phase === PHASES.OVULATION) {
    return {
      level: 'OVULATION_CARE',
      badge: 'Ovulation Glow',
      badgeColor: '#fb8500',
      title: 'Pantyliner Recommended for Discharge',
      summary: 'High estrogen increases natural healthy cervical fluid (egg-white texture). Breathable liners maintain freshness.',
      recommendation: 'Carry 1–2 breathable pantyliners for fresh all-day comfort.',
      items: [
        { name: 'Breathable cotton pantyliners', quantity: '1-2 liners', icon: '🪶', essential: true },
        { name: 'Hydration bottle (aim for 2.5L)', quantity: '1 bottle', icon: '💧', essential: true },
        { name: 'Gentle facial mist / lip balm', quantity: '1 unit', icon: '💄', essential: false }
      ]
    };
  }

  // Default Follicular / Mid-Luteal
  return {
    level: 'SAFE_DAY',
    badge: 'Safe & Clear Day',
    badgeColor: '#10b981',
    title: 'Light Bag Day!',
    summary: 'Very low likelihood of bleeding today. Feel free to pack light and enjoy your day without worry.',
    recommendation: 'No heavy pads needed. Just keep 1 emergency liner in your makeup pouch.',
    items: [
      { name: 'Emergency backup pantyliner', quantity: '1 liner', icon: '🪶', essential: false },
      { name: 'Your favorite water bottle', quantity: '1 bottle', icon: '💧', essential: true },
      { name: 'High-energy snack / fruit', quantity: '1 snack', icon: '🍎', essential: false }
    ]
  };
}
