import React from 'react';
import { Compass, ShoppingBag, Calendar, BookOpen, Settings } from 'lucide-react';

const TABS = [
  { id: 'cycle', label: 'Cycle 3D', icon: Compass },
  { id: 'bag', label: 'Bag & Care', icon: ShoppingBag },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'insights', label: 'Insights', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Navigation({ activeTab, onTabChange, padAlert }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none pb-2 pt-1 px-3">
      <nav className="w-full max-w-md bg-[#160d1f]/90 backdrop-blur-2xl border border-white/10 rounded-full px-2 py-1.5 shadow-2xl flex items-center justify-around pointer-events-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {/* Active Glow Pill */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full border border-pink-400/30 shadow-md shadow-pink-500/20" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-pink-300' : ''}`} />

                {/* Pad Alert Badge on Bag tab */}
                {tab.id === 'bag' && padAlert && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse border-2 border-[#160d1f]" />
                )}
              </div>

              <span className={`text-[10px] font-semibold tracking-tight mt-0.5 relative z-10 ${isActive ? 'text-pink-200' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
