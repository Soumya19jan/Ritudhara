import React, { useState } from 'react';
import { Bell, ShoppingBag, Droplets, Moon, CheckCircle, X, Sparkles } from 'lucide-react';
import { requestNotificationPermission, sendMorningPadNotification } from '../services/notificationService';

export default function NotificationPermissionModal({
  isOpen,
  onClose,
  cycleStatus
}) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'requesting' | 'granted' | 'denied'

  if (!isOpen) return null;

  const handleEnable = async () => {
    setStatus('requesting');
    const result = await requestNotificationPermission();

    if (result === 'granted') {
      setStatus('granted');
      // Send welcoming morning pad notification as immediate confirmation
      if (cycleStatus) {
        setTimeout(() => {
          sendMorningPadNotification(cycleStatus);
        }, 600);
      }
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setStatus('denied');
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#271330] via-[#1a0c24] to-[#120719] rounded-[32px] p-5 sm:p-6 border border-pink-500/30 shadow-2xl text-white space-y-4 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30 border border-pink-400/30 flex-shrink-0">
            <Bell className="w-6 h-6 text-white animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300 block">
              Phone Reminders
            </span>
            <h3 className="text-lg font-black tracking-tight text-white leading-tight">
              Enable Daily Care Alerts
            </h3>
          </div>
        </div>

        <p className="text-xs text-pink-100/80 leading-relaxed">
          Allow Ritudhara to send 3 caring, discreet notifications directly to your phone's lock screen:
        </p>

        {/* 3 Scheduled Notifications Breakdown */}
        <div className="space-y-2 pt-1">
          {/* 1. Morning */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-pink-500/25 border border-pink-400/30 flex items-center justify-center text-xs flex-shrink-0 text-pink-300">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Morning Pad & Bag Check</span>
                <span className="text-[10px] font-semibold text-pink-300">8:00 AM</span>
              </div>
              <p className="text-[11px] text-pink-200/70 leading-snug">
                "Carry 2 pads today!" or "Light safe bag day!" so you're never caught off guard.
              </p>
            </div>
          </div>

          {/* 2. Afternoon */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-cyan-500/25 border border-cyan-400/30 flex items-center justify-center text-xs flex-shrink-0 text-cyan-300">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Hydration & Cramp Comfort</span>
                <span className="text-[10px] font-semibold text-cyan-300">1:30 PM</span>
              </div>
              <p className="text-[11px] text-pink-200/70 leading-snug">
                Gentle reminders to drink warm water to soften muscle cramps.
              </p>
            </div>
          </div>

          {/* 3. Evening */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-purple-500/25 border border-purple-400/30 flex items-center justify-center text-xs flex-shrink-0 text-purple-300">
              <Moon className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">"Are you feeling okay?"</span>
                <span className="text-[10px] font-semibold text-purple-300">8:30 PM</span>
              </div>
              <p className="text-[11px] text-pink-200/70 leading-snug">
                A warm check-in to log your mood, flow, and symptoms in 10 seconds.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {status === 'granted' ? (
            <div className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 animate-fade-in">
              <CheckCircle className="w-5 h-5" />
              <span>Notifications Enabled! 🎉</span>
            </div>
          ) : (
            <button
              onClick={handleEnable}
              disabled={status === 'requesting'}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>{status === 'requesting' ? 'Requesting Permission...' : 'Allow Phone Notifications'}</span>
            </button>
          )}
        </div>

        {/* Dismiss */}
        <div className="text-center pt-0.5">
          <button
            onClick={onClose}
            className="text-xs text-white/50 hover:text-white transition font-medium"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
