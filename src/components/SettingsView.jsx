import React, { useRef, useState, useEffect } from 'react';
import { Download, Upload, RefreshCw, Shield, Server, Trash2, CheckCircle, Heart, ExternalLink, Sparkles, Bell } from 'lucide-react';
import { exportBackupJSON, importBackupJSON, clearAllData } from '../services/storage';
import {
  requestNotificationPermission,
  getNotificationPermission,
  sendMorningPadNotification,
  sendAfternoonComfortNotification,
  sendEveningCheckinNotification
} from '../services/notificationService';

export default function SettingsView({ profile, cycleStatus, onRecalibrate, onDataUpdated, onOpenInstallModal }) {
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notificationPerm, setNotificationPerm] = useState('default');
  const [testSent, setTestSent] = useState('');

  useEffect(() => {
    setNotificationPerm(getNotificationPermission());
  }, []);

  const handleExport = () => {
    exportBackupJSON();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const success = importBackupJSON(content);
        if (success) {
          setImportStatus('Backup restored successfully! 🎉');
          if (onDataUpdated) onDataUpdated();
        } else {
          setImportStatus('Failed to import backup file. Invalid format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    clearAllData();
    window.location.reload();
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in text-white">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-black tracking-tight">Settings & Privacy</h2>
        <p className="text-xs text-pink-200/70">
          Manage your cycle calibration, phone shortcut, and data backups.
        </p>
      </div>

      {/* Install as Phone App Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-transparent border border-pink-500/30 shadow-xl flex items-center justify-between">
        <div className="space-y-1 pr-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-300">
            <span>📲 Phone Shortcut</span>
          </div>
          <h4 className="text-sm font-bold text-white">Install Ritudhara as Phone App</h4>
          <p className="text-xs text-pink-200/70">
            Get 1-tap home screen access & full-screen experience.
          </p>
        </div>

        <button
          onClick={onOpenInstallModal}
          className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-500/30 hover:opacity-90 transition flex-shrink-0 cursor-pointer"
        >
          <span>Install</span>
        </button>
      </div>

      {/* Phone Notifications Card */}
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-300">
              <Bell className="w-4 h-4 text-pink-400" />
              <span>Phone Lock-Screen Alerts</span>
            </div>
            <h4 className="text-sm font-bold text-white">Daily 3x Smart Notifications</h4>
          </div>

          <button
            onClick={async () => {
              await requestNotificationPermission();
              setNotificationPerm(getNotificationPermission());
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              notificationPerm === 'granted'
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                : 'bg-pink-500/20 border-pink-400/40 text-pink-200 hover:bg-pink-500/30'
            }`}
          >
            {notificationPerm === 'granted' ? 'Enabled ✓' : 'Enable Alerts'}
          </button>
        </div>

        <p className="text-xs text-pink-200/70 leading-relaxed">
          Sent directly to your phone to keep you safe and prepared:
        </p>

        {/* 3 Times */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/20 border border-white/5">
            <span className="flex items-center gap-2 text-white font-medium">
              <span>🎒 8:00 AM</span>
              <span className="text-white/60">Pad & Bag Recommendation</span>
            </span>
            <button
              onClick={() => {
                if (cycleStatus) sendMorningPadNotification(cycleStatus);
                setTestSent('Sent 8:00 AM Pad Alert to phone!');
                setTimeout(() => setTestSent(''), 3000);
              }}
              className="text-[10px] font-bold text-pink-300 bg-pink-500/20 px-2 py-1 rounded-lg hover:bg-pink-500/30 transition"
            >
              Test Alert 🔔
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/20 border border-white/5">
            <span className="flex items-center gap-2 text-white font-medium">
              <span>💧 1:30 PM</span>
              <span className="text-white/60">Hydration & Cramp Comfort</span>
            </span>
            <button
              onClick={() => {
                sendAfternoonComfortNotification();
                setTestSent('Sent 1:30 PM Hydration Alert to phone!');
                setTimeout(() => setTestSent(''), 3000);
              }}
              className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2 py-1 rounded-lg hover:bg-cyan-500/30 transition"
            >
              Test Alert 🔔
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/20 border border-white/5">
            <span className="flex items-center gap-2 text-white font-medium">
              <span>🌙 8:30 PM</span>
              <span className="text-white/60">"Are you okay?" Daily Check-in</span>
            </span>
            <button
              onClick={() => {
                sendEveningCheckinNotification(profile.name);
                setTestSent('Sent 8:30 PM Evening Check-in to phone!');
                setTimeout(() => setTestSent(''), 3000);
              }}
              className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-1 rounded-lg hover:bg-purple-500/30 transition"
            >
              Test Alert 🔔
            </button>
          </div>
        </div>

        {testSent && (
          <div className="p-2.5 rounded-xl bg-pink-500/20 border border-pink-400/30 text-xs text-pink-200 text-center font-bold animate-pulse">
            {testSent}
          </div>
        )}
      </div>

      {/* NETLIFY & DATABASE EXPLANATION CARD (Answers user prompt directly) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1b263b]/60 via-[#1e1329] to-[#12081b] border border-cyan-500/30 shadow-2xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 block">
              Netlify Hosting Architecture
            </span>
            <h3 className="text-base font-bold text-white">
              Do You Need a Database? <span className="text-emerald-400">No! 🎉</span>
            </h3>
          </div>
        </div>

        <p className="text-xs text-pink-100/80 leading-relaxed">
          Because menstrual health is sensitive personal data, Ritudhara 3D is engineered to run <strong className="text-white">100% serverless</strong> using private browser storage.
        </p>

        <div className="space-y-2 pt-1 text-xs text-white/80">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span><strong>Zero monthly DB costs:</strong> Host free forever on Netlify with just a single git push or drag-and-drop.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span><strong>100% Confidential:</strong> Your personal logs never touch any remote server or third-party tracker.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span><strong>Offline Capable:</strong> Works instantly anywhere, even in airplane mode without internet.</span>
          </div>
        </div>
      </div>

      {/* Recalibration Option */}
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-white">Cycle Calibration</h4>
            <p className="text-xs text-pink-200/60">
              Current: {profile.cycleLength} days cycle • {profile.periodDuration} days flow
            </p>
          </div>

          <button
            onClick={onRecalibrate}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-500/20 hover:opacity-90 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-calibrate
          </button>
        </div>
      </div>

      {/* Data Backup & Restore */}
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Backup & Device Sync</h4>
          <p className="text-xs text-pink-200/60 leading-relaxed">
            Download your encrypted JSON backup file so you can switch phones or save a personal copy.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleExport}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-pink-300" />
            <span>Export Backup</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <Upload className="w-4 h-4 text-purple-300" />
            <span>Restore Backup</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-pink-500/20 border border-pink-400/30 text-xs text-pink-200 text-center font-medium">
            {importStatus}
          </div>
        )}
      </div>

      {/* Danger Zone: Clear Data */}
      <div className="p-5 rounded-3xl bg-red-950/20 border border-red-500/20 space-y-3">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-red-300">Reset All Data</h4>
          <p className="text-xs text-red-200/60">
            Wipe all cycle calibration history and daily logs from this device.
          </p>
        </div>

        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
            >
              Yes, Delete Everything
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="py-2 px-3 rounded-xl bg-white/10 text-white text-xs transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="w-full py-2.5 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <Trash2 className="w-4 h-4" />
            Reset Data
          </button>
        )}
      </div>
    </div>
  );
}
