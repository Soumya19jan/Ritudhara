/**
 * Ritudhara 3D - Notification Service
 * Manages phone push notifications, permission requests, and scheduled daily reminders
 */

const NOTIFICATION_SETTINGS_KEY = 'ritudhara_notification_settings_v1';

export const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: false,
  morningPadAlert: true,      // 8:00 AM: Bag & Pad carrying recommendation
  afternoonHydration: true,   // 1:30 PM: Hydration & cramp comfort check
  eveningCheckin: true,       // 8:30 PM: "Are you feeling okay?" body check-in
  lastNotifiedDate: ''
};

export function getNotificationSettings() {
  try {
    const raw = localStorage.getItem(NOTIFICATION_SETTINGS_KEY) || localStorage.getItem('lunaglow_notification_settings_v1');
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
    return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export function saveNotificationSettings(settings) {
  try {
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving notification settings:', e);
  }
}

/**
 * Checks if browser supports Web Notifications
 */
export function isNotificationSupported() {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Get current permission state: 'granted' | 'denied' | 'default'
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const current = getNotificationSettings();
      saveNotificationSettings({ ...current, enabled: true });
    }
    return permission;
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return 'denied';
  }
}

/**
 * Trigger a phone notification via Service Worker (or fallback to Notification API)
 */
export async function triggerNotification(title, body, extraOptions = {}) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  const options = {
    body,
    icon: '/icon.svg',
    badge: '/icon.svg',
    vibrate: [200, 100, 200],
    data: { url: '/' },
    ...extraOptions
  };

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, options);
        return true;
      }
    }
    // Fallback
    new Notification(title, options);
    return true;
  } catch (e) {
    console.error('Failed to show notification:', e);
    return false;
  }
}

/**
 * Send Morning Pad & Bag Alert (8:00 AM style)
 */
export async function sendMorningPadNotification(cycleStatus) {
  const { padRecommendation, daysUntilPeriod, isPeriodDay, cycleDay } = cycleStatus;

  let title = `🎒 Morning Bag Check • Ritudhara`;
  let body = padRecommendation.recommendation;

  if (isPeriodDay) {
    title = `🩸 Day ${cycleDay} Period Alert`;
    body = `Your flow is active today: ${padRecommendation.recommendation}`;
  } else if (daysUntilPeriod <= 2) {
    title = `⚠️ Period due in ${daysUntilPeriod === 0 ? 'today!' : daysUntilPeriod + ' days'}`;
    body = `Pack 2 emergency pads in your handbag just in case!`;
  }

  return triggerNotification(title, body, { tag: 'ritudhara-morning-pad' });
}

/**
 * Send Afternoon Comfort Alert (1:30 PM style)
 */
export async function sendAfternoonComfortNotification() {
  const title = `💧 Hydration & Comfort Check`;
  const body = `Drinking a glass of warm water softens uterine contractions and relieves bloating. Have you had water today?`;
  return triggerNotification(title, body, { tag: 'ritudhara-afternoon-comfort' });
}

/**
 * Send Evening "Are you feeling okay?" Check-in (8:30 PM style)
 */
export async function sendEveningCheckinNotification(userName = 'Goddess') {
  const title = `🌙 Are you feeling okay tonight?`;
  const body = `Hi ${userName}, take 10 seconds to log today's mood, symptoms & flow before you sleep. Rest well! ✨`;
  return triggerNotification(title, body, { tag: 'ritudhara-evening-checkin' });
}
