/**
 * Ritudhara 3D - Storage & Persistent Cache Service
 * Guarantees zero DB needed, 100% private client storage, and persistent cached data.
 */

const STORAGE_KEYS = {
  PROFILE: 'ritudhara_profile_v1',
  LOGS: 'ritudhara_daily_logs_v1',
  SETTINGS: 'ritudhara_settings_v1',
  CALIBRATION_FLAG: 'ritudhara_calibration_completed',
  INSTALL_DISMISSED: 'ritudhara_install_dismissed_v1'
};

export const DEFAULT_PROFILE = {
  name: 'Ritu',
  lastPeriodDate: '2026-10-15', // Fallback default to ensure predictions work immediately
  cycleLength: 28,
  periodDuration: 5,
  typicalSymptoms: ['cramps', 'mood', 'tender'],
  calibrated: false,
  createdAt: new Date().toISOString()
};

/**
 * Returns true if the user has already calibrated and saved their information.
 */
export function isCalibrationCompleted() {
  try {
    const flag = localStorage.getItem(STORAGE_KEYS.CALIBRATION_FLAG) || localStorage.getItem('lunaglow_calibration_completed');
    if (flag === 'true') return true;
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE) || localStorage.getItem('lunaglow_profile_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.calibrated) return true;
    }
  } catch (e) {
    console.error('Error checking calibration status:', e);
  }
  return false;
}

export function getStoredProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE) || localStorage.getItem('lunaglow_profile_v1');
    const isCalibrated = isCalibrationCompleted();

    if (!raw) {
      return { ...DEFAULT_PROFILE, calibrated: isCalibrated };
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      calibrated: isCalibrated || !!parsed.calibrated
    };
  } catch (e) {
    console.error('Error reading profile from localStorage:', e);
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile) {
  try {
    const updated = {
      ...profile,
      calibrated: true,
      lastSavedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.CALIBRATION_FLAG, 'true');
    return updated;
  } catch (e) {
    console.error('Error saving profile to localStorage:', e);
    return profile;
  }
}

export function getStoredLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS) || localStorage.getItem('lunaglow_daily_logs_v1');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error reading logs from localStorage:', e);
    return {};
  }
}

export function saveDailyLog(dateStr, logData) {
  try {
    const logs = getStoredLogs();
    logs[dateStr] = {
      ...(logs[dateStr] || {}),
      ...logData,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    return logs;
  } catch (e) {
    console.error('Error saving daily log:', e);
    return {};
  }
}

export function getInstallDismissed() {
  try {
    return (localStorage.getItem(STORAGE_KEYS.INSTALL_DISMISSED) || localStorage.getItem('lunaglow_install_dismissed_v1')) === 'true';
  } catch (e) {
    return false;
  }
}

export function setInstallDismissed(dismissed = true) {
  try {
    localStorage.setItem(STORAGE_KEYS.INSTALL_DISMISSED, dismissed ? 'true' : 'false');
  } catch (e) {
    console.error('Error setting install dismissed:', e);
  }
}

export function exportBackupJSON() {
  const data = {
    app: 'Ritudhara 3D Period Tracker',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    profile: getStoredProfile(),
    logs: getStoredLogs()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ritudhara_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importBackupJSON(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    if (data.profile) {
      saveStoredProfile(data.profile);
    }
    if (data.logs) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(data.logs));
    }
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.LOGS);
  localStorage.removeItem(STORAGE_KEYS.CALIBRATION_FLAG);
  localStorage.removeItem(STORAGE_KEYS.INSTALL_DISMISSED);
}
