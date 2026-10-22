import React from 'react';
import { Smartphone, Monitor, Download, Bell } from 'lucide-react';

export default function Header({ isDesktopFrame, onToggleDesktopFrame, onOpenInstallModal, onOpenNotificationModal }) {
  return (
    <header className="flex items-center justify-between py-3 px-1 border-b border-white/5 select-none">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-base shadow-md shadow-pink-500/30">
          🌸
        </div>
        <div>
          <span className="text-base font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-purple-200">
            Ritudhara 3D
          </span>
          <span className="text-[10px] text-pink-300/60 block font-medium leading-none">
            Smart Cycle & Wellness
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Phone Notification Bell */}
        <button
          onClick={onOpenNotificationModal}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-pink-300 transition active:scale-95"
          title="Configure 3x Daily Phone Reminders"
        >
          <Bell className="w-3.5 h-3.5" />
        </button>

        {/* Install / Download as App Button */}
        <button
          onClick={onOpenInstallModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500/25 to-purple-500/25 hover:from-pink-500/35 hover:to-purple-500/35 border border-pink-400/30 text-xs font-bold text-pink-200 shadow-sm transition active:scale-95"
          title="Install Ritudhara as a shortcut App on your phone"
        >
          <Download className="w-3.5 h-3.5 text-pink-300" />
          <span>Install App</span>
        </button>

        {/* Desktop Device Simulator Toggle (visible on screens > 640px) */}
        <button
          onClick={onToggleDesktopFrame}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-medium text-white/70 transition"
          title="Toggle Phone Frame / Full Responsive View"
        >
          {isDesktopFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-pink-300" />
              <span>Full Screen</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-pink-300" />
              <span>Phone Frame</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
