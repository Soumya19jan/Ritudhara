import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import CycleView from './components/CycleView';
import BagRecommendationView from './components/BagRecommendationView';
import CalendarView from './components/CalendarView';
import InsightsView from './components/InsightsView';
import SettingsView from './components/SettingsView';
import OnboardingModal from './components/OnboardingModal';
import LogModal from './components/LogModal';
import InstallAppModal from './components/InstallAppModal';
import NotificationPermissionModal from './components/NotificationPermissionModal';

import {
  getStoredProfile,
  saveStoredProfile,
  getStoredLogs,
  saveDailyLog,
  isCalibrationCompleted,
  getInstallDismissed,
  setInstallDismissed,
  DEFAULT_PROFILE
} from './services/storage';

import { calculateCycleStatus, formatDateISO } from './services/cycleEngine';
import { getNotificationPermission } from './services/notificationService';

export default function App() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [dailyLogs, setDailyLogs] = useState({});
  const [activeTab, setActiveTab] = useState('cycle'); // 'cycle' | 'bag' | 'calendar' | 'insights' | 'settings'
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Phone Notification Prompt State
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Log modal state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedLogDate, setSelectedLogDate] = useState(formatDateISO(new Date()));

  // Desktop phone simulator mode
  const [isDesktopFrame, setIsDesktopFrame] = useState(true);

  // Load from persistent cache / LocalStorage on mount
  useEffect(() => {
    const loadedProfile = getStoredProfile();
    const loadedLogs = getStoredLogs();

    setProfile(loadedProfile);
    setDailyLogs(loadedLogs);

    // Only open onboarding if the user has NEVER calibrated before
    const calibrated = isCalibrationCompleted();
    if (!calibrated) {
      setIsOnboardingOpen(true);
    } else {
      setIsOnboardingOpen(false);
    }
  }, []);

  // Listen for PWA Install Prompt & mobile visit detection
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Automatically show download prompt on phone if not previously dismissed
      if (!getInstallDismissed()) {
        setTimeout(() => {
          setIsInstallModalOpen(true);
        }, 2200);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // On iOS Safari or mobile browsers without beforeinstallprompt
    const isMobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if (isMobile && !isStandalone && !getInstallDismissed()) {
      const timer = setTimeout(() => {
        setIsInstallModalOpen(true);
      }, 2800);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleOnboardingComplete = (newProfile) => {
    const saved = saveStoredProfile(newProfile);
    setProfile(saved);
    setIsOnboardingOpen(false);

    // Prompt user to enable 3x daily phone notifications
    if (getNotificationPermission() === 'default') {
      setTimeout(() => {
        setIsNotificationModalOpen(true);
      }, 1200);
    }
  };

  const handleCloseInstallModal = () => {
    setIsInstallModalOpen(false);
    setInstallDismissed(true);
  };

  const handleSaveLog = (dateStr, logData) => {
    const updated = saveDailyLog(dateStr, logData);
    setDailyLogs(updated);
  };

  const handleOpenLogModal = (dateStr) => {
    setSelectedLogDate(dateStr || formatDateISO(new Date()));
    setIsLogModalOpen(true);
  };

  const handleRecalibrate = () => {
    setIsOnboardingOpen(true);
  };

  const handleRefreshData = () => {
    setProfile(getStoredProfile());
    setDailyLogs(getStoredLogs());
  };

  // Compute live cycle status
  const cycleStatus = calculateCycleStatus(profile, new Date());
  const todayStr = formatDateISO(new Date());
  const todayLog = dailyLogs[todayStr];

  // Needs pad alert? (Imminent period or heavy flow)
  const isPadAlert =
    cycleStatus.isPeriodDay ||
    cycleStatus.daysUntilPeriod <= 2 ||
    cycleStatus.cycleDay >= cycleStatus.cycleLength - 1;

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'cycle':
        return (
          <CycleView
            cycleStatus={cycleStatus}
            profile={profile}
            todayLog={todayLog}
            onOpenLogModal={handleOpenLogModal}
            onSwitchTab={setActiveTab}
          />
        );
      case 'bag':
        return (
          <BagRecommendationView
            cycleStatus={cycleStatus}
            profile={profile}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            profile={profile}
            dailyLogs={dailyLogs}
            onOpenLogModal={handleOpenLogModal}
          />
        );
      case 'insights':
        return (
          <InsightsView
            currentPhase={cycleStatus.phase}
          />
        );
      case 'settings':
        return (
          <SettingsView
            profile={profile}
            cycleStatus={cycleStatus}
            onRecalibrate={handleRecalibrate}
            onDataUpdated={handleRefreshData}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#09040d] flex items-center justify-center p-0 md:p-6 transition-colors duration-300">
      
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-pink-600/15 via-purple-600/15 to-transparent rounded-full blur-[140px]" />
      </div>

      {/* Main Container: Desktop frame or native full screen */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col ${
          isDesktopFrame
            ? 'max-w-[430px] md:h-[890px] md:rounded-[50px] md:border-[10px] md:border-[#271638] md:shadow-[0_25px_70px_rgba(255,105,180,0.2)] md:ring-1 md:ring-white/10 overflow-hidden'
            : 'max-w-xl min-h-screen'
        } bg-[#0e0716]`}
      >
        {/* Dynamic Island / Speaker notch mockup on desktop frame */}
        {isDesktopFrame && (
          <div className="hidden md:flex justify-center pt-3 pb-1 z-50">
            <div className="w-28 h-4 bg-black rounded-full flex items-center justify-end px-2.5">
              <span className="w-2 h-2 rounded-full bg-[#1c1228] border border-white/20" />
            </div>
          </div>
        )}

        {/* Top Header */}
        <div className="px-4 pt-2">
          <Header
            isDesktopFrame={isDesktopFrame}
            onToggleDesktopFrame={() => setIsDesktopFrame(!isDesktopFrame)}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
          />
        </div>

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-4 pt-3 pb-6 select-none">
          {renderCurrentView()}
        </main>

        {/* Floating Bottom Navigation */}
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          padAlert={isPadAlert}
        />
      </div>

      {/* Calibration Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        initialProfile={profile}
        onComplete={handleOnboardingComplete}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Daily Check-in / Log Modal */}
      <LogModal
        isOpen={isLogModalOpen}
        dateStr={selectedLogDate}
        existingLog={dailyLogs[selectedLogDate]}
        onClose={() => setIsLogModalOpen(false)}
        onSaveLog={handleSaveLog}
      />

      {/* Download / Install App Popup */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        deferredPrompt={deferredPrompt}
        onClose={handleCloseInstallModal}
        onInstallSuccess={() => setInstallDismissed(true)}
      />

      {/* Phone Notification Permission & Schedule Modal */}
      <NotificationPermissionModal
        isOpen={isNotificationModalOpen}
        cycleStatus={cycleStatus}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </div>
  );
}
