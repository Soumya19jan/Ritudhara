import React, { useState } from 'react';
import { ShoppingBag, CheckCircle2, Circle, AlertTriangle, ShieldCheck, Heart, Sparkles, Droplets, ThermometerSun } from 'lucide-react';

export default function BagRecommendationView({ cycleStatus, profile }) {
  const { padRecommendation, cycleDay, phase, daysUntilPeriod, isPeriodDay } = cycleStatus;

  // Local checklist state
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItem = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const totalItems = padRecommendation.items.length;
  const packedCount = Object.values(checkedItems).filter(Boolean).length;
  const allPacked = totalItems > 0 && packedCount === totalItems;

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Top Banner with 3D aesthetic */}
      <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#2d1236] via-[#1c0f2b] to-[#12081d] border border-pink-500/30 shadow-2xl">
        {/* Floating background glowing orbs */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm"
              style={{
                backgroundColor: `${padRecommendation.badgeColor}25`,
                color: padRecommendation.badgeColor,
                border: `1px solid ${padRecommendation.badgeColor}50`
              }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {padRecommendation.badge}
            </span>

            <span className="text-xs font-semibold text-white/50">
              Cycle Day {cycleDay}
            </span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-extrabold tracking-tight text-white leading-tight">
              {padRecommendation.title}
            </h2>
            <p className="text-sm text-pink-200/80 leading-relaxed">
              {padRecommendation.summary}
            </p>
          </div>

          {/* Golden Highlight Card */}
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-start gap-3">
            <span className="text-2xl mt-0.5">🎒</span>
            <div className="space-y-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-300">
                Recommended Pack
              </span>
              <p className="text-sm font-semibold text-white">
                {padRecommendation.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Bag Packing Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">Today's Bag Checklist</h3>
            <span className="text-xs font-medium text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-400/30">
              {packedCount}/{totalItems} Packed
            </span>
          </div>

          {allPacked && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" /> All set!
            </span>
          )}
        </div>

        <div className="space-y-2">
          {padRecommendation.items.map((item, idx) => {
            const isChecked = !!checkedItems[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleItem(idx)}
                className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer active:scale-[0.99] ${
                  isChecked
                    ? 'bg-emerald-950/20 border-emerald-500/40 opacity-75'
                    : 'bg-white/5 border-white/10 hover:border-pink-500/40 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${isChecked ? 'line-through text-white/50' : 'text-white'}`}>
                        {item.name}
                      </span>
                      {item.essential && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-pink-500/30 text-pink-300 border border-pink-400/20">
                          Must Have
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-white/50 font-medium">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>

                <div className="pl-2">
                  {isChecked ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950" />
                  ) : (
                    <Circle className="w-6 h-6 text-white/30 hover:text-pink-400 transition" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Handbag Pouch Essentials Guide */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1e1329] to-[#120a1c] border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-pink-300">
          <ShieldCheck className="w-5 h-5 text-pink-400" />
          <h4 className="text-sm font-bold tracking-tight text-white">The "Never Caught Off Guard" Secret</h4>
        </div>

        <p className="text-xs text-pink-200/70 leading-relaxed">
          Keep a small, opaque cosmetic pouch inside your everyday backpack or handbag permanently with these 4 items:
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-lg">🩸</span>
            <div className="text-xs font-bold text-white">2 Heavy Pads</div>
            <div className="text-[11px] text-white/40">Individually sealed</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-lg">🩲</span>
            <div className="text-xs font-bold text-white">1 Dark Underwear</div>
            <div className="text-[11px] text-white/40">Folded in ziplock</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-lg">✨</span>
            <div className="text-xs font-bold text-white">Intimate Wipes</div>
            <div className="text-[11px] text-white/40">pH balanced & gentle</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-lg">🔥</span>
            <div className="text-xs font-bold text-white">Stick-on Heat Patch</div>
            <div className="text-[11px] text-white/40">Instant cramp relief</div>
          </div>
        </div>
      </div>

      {/* Comfort & Hydration Reminder */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-transparent border border-pink-400/20 flex items-center gap-3">
        <Droplets className="w-7 h-7 text-pink-400 flex-shrink-0" />
        <div className="text-xs text-pink-200/90 leading-tight">
          <strong className="text-white block font-semibold mb-0.5">Hydration softens cramps:</strong>
          Drinking 2.5L of warm water today prevents bloating and eases smooth muscle contractions.
        </div>
      </div>
    </div>
  );
}
