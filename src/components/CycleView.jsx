import React from 'react';
import { Calendar, ShoppingBag, Plus, Sparkles, Heart, ChevronRight, Droplet, Clock, Flame } from 'lucide-react';
import CycleScene3D from './CycleScene3D';
import { formatDateISO } from '../services/cycleEngine';

export default function CycleView({
  cycleStatus,
  profile,
  todayLog,
  onOpenLogModal,
  onSwitchTab
}) {
  const {
    cycleDay,
    cycleLength,
    periodDuration,
    phase,
    phaseConfig,
    daysUntilPeriod,
    nextPeriodStart,
    ovulationCycleDay,
    ovulationDate,
    fertileStartDay,
    fertileEndDay,
    conceptionChance,
    padRecommendation,
    isPeriodDay
  } = cycleStatus;

  const todayStr = formatDateISO(new Date());

  const formattedNextPeriod = nextPeriodStart.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  const formattedOvulation = ovulationDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="space-y-5 pb-24 animate-fade-in text-white">
      {/* 1. Header Greeting & Phase Status */}
      <div className="flex items-center justify-between pt-1">
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-pink-300 tracking-wide uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Hello, {profile.name || 'Goddess'}
          </span>
          <h1 className="text-2xl font-black tracking-tight text-white">
            {isPeriodDay ? 'Period Active' : `${phaseConfig.name}`}
          </h1>
        </div>

        {/* Phase Pill */}
        <div
          className="px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md flex items-center gap-1.5 shadow-lg"
          style={{
            backgroundColor: `${phaseConfig.color}20`,
            borderColor: `${phaseConfig.color}45`,
            color: phaseConfig.color
          }}
        >
          <span>{phaseConfig.icon}</span>
          <span>Day {cycleDay}</span>
        </div>
      </div>

      {/* 2. 3D Cycle Centerpiece */}
      <div className="relative rounded-[32px] bg-gradient-to-b from-[#211029]/80 via-[#150a1e]/80 to-[#0e0614]/90 border border-pink-500/20 shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Ambient atmospheric glows */}
        <div
          className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-1000"
          style={{ backgroundColor: `${phaseConfig.color}25` }}
        />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* 3D Scene */}
        <CycleScene3D
          cycleDay={cycleDay}
          cycleLength={cycleLength}
          periodDuration={periodDuration}
          phase={phase}
          phaseConfig={phaseConfig}
          ovulationCycleDay={ovulationCycleDay}
          fertileStartDay={fertileStartDay}
          fertileEndDay={fertileEndDay}
        />

        {/* Bottom Metrics Bar below 3D */}
        <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-black/25 backdrop-blur-md py-3 text-center">
          <div>
            <span className="text-[10px] font-semibold text-white/50 block uppercase tracking-wider">
              {isPeriodDay ? 'Bleed Day' : 'Period In'}
            </span>
            <span className="text-base font-extrabold text-pink-300">
              {isPeriodDay ? `Day ${cycleDay}/${periodDuration}` : `${daysUntilPeriod} Days`}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-white/50 block uppercase tracking-wider">
              Conception
            </span>
            <span className="text-base font-extrabold text-amber-300">
              {conceptionChance}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-semibold text-white/50 block uppercase tracking-wider">
              Next Period
            </span>
            <span className="text-base font-extrabold text-white">
              {formattedNextPeriod}
            </span>
          </div>
        </div>
      </div>

      {/* 3. SMART PAD / BAG CARRYING RECOMMENDATION (Interactive Callout) */}
      <div
        onClick={() => onSwitchTab('bag')}
        className="p-5 rounded-3xl border transition-all duration-200 cursor-pointer active:scale-[0.98] relative overflow-hidden group shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${padRecommendation.badgeColor}20, #130a1c)`,
          borderColor: `${padRecommendation.badgeColor}40`
        }}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1 pr-2">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${padRecommendation.badgeColor}30`,
                  color: padRecommendation.badgeColor
                }}
              >
                🎒 {padRecommendation.badge}
              </span>
              <span className="text-xs text-white/50 font-medium">Bag Advice</span>
            </div>

            <h3 className="text-base font-extrabold text-white">
              {padRecommendation.title}
            </h3>

            <p className="text-xs text-pink-100/80 leading-relaxed line-clamp-2">
              {padRecommendation.recommendation}
            </p>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/10 group-hover:bg-white/20 transition text-pink-200 flex-shrink-0">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. TODAY'S DAILY CHECK-IN CARD */}
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300">
              Daily Wellness Log
            </span>
            <h3 className="text-base font-bold text-white">
              How are you feeling today?
            </h3>
          </div>

          <button
            onClick={() => onOpenLogModal(todayStr)}
            className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-pink-500/20 hover:opacity-90 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            {todayLog ? 'Update Log' : 'Check In'}
          </button>
        </div>

        {todayLog ? (
          <div className="p-3 rounded-2xl bg-black/20 border border-white/5 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {todayLog.flow && todayLog.flow !== 'none' && (
                <span className="text-xs px-2.5 py-1 rounded-xl bg-rose-500/25 text-rose-200 border border-rose-400/30 font-medium">
                  🩸 Flow: {todayLog.flow}
                </span>
              )}
              {todayLog.mood && (
                <span className="text-xs px-2.5 py-1 rounded-xl bg-purple-500/25 text-purple-200 border border-purple-400/30 font-medium">
                  Mood: {todayLog.mood}
                </span>
              )}
              {todayLog.waterLiters && (
                <span className="text-xs px-2.5 py-1 rounded-xl bg-cyan-500/25 text-cyan-200 border border-cyan-400/30 font-medium">
                  💧 {todayLog.waterLiters}L Water
                </span>
              )}
            </div>

            {todayLog.symptoms?.length > 0 && (
              <div className="text-[11px] text-white/70">
                Symptoms: <span className="text-white/90">{todayLog.symptoms.join(', ')}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-white/50 leading-relaxed">
            Record your flow, mood, and symptoms in 10 seconds to enhance cycle prediction precision.
          </p>
        )}
      </div>

      {/* 5. Phase Energy & Body Tip */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1d1228] to-[#120919] border border-white/5 space-y-2">
        <div className="flex items-center gap-2 text-pink-300">
          <Heart className="w-4 h-4 text-pink-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-pink-200">
            {phaseConfig.name} Secret
          </h4>
        </div>
        <p className="text-xs text-pink-100/80 leading-relaxed">
          {phaseConfig.idealFood}
        </p>
      </div>
    </div>
  );
}
