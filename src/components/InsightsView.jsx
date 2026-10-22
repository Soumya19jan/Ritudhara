import React, { useState } from 'react';
import { PHASES, PHASE_CONFIG } from '../services/cycleEngine';
import { Sparkles, Activity, Utensils, Dumbbell, Droplets, BookOpen, Heart } from 'lucide-react';

export default function InsightsView({ currentPhase }) {
  const [selectedPhase, setSelectedPhase] = useState(currentPhase || PHASES.MENSTRUAL);

  const phaseData = PHASE_CONFIG[selectedPhase];

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-white tracking-tight">Cycle Science & Body</h2>
        <p className="text-xs text-pink-200/70">
          Understand your hormones, boost your energy, and sync your life.
        </p>
      </div>

      {/* Phase Selector Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
        {Object.keys(PHASES).map((pKey) => {
          const cfg = PHASE_CONFIG[pKey];
          const isSelected = selectedPhase === pKey;
          const isCurrent = currentPhase === pKey;

          return (
            <button
              key={pKey}
              onClick={() => setSelectedPhase(pKey)}
              className={`py-2 px-1 rounded-xl text-center transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-pink-500/40 to-purple-500/40 border border-pink-400 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="text-base">{cfg.icon}</div>
              <div className="text-[10px] font-bold tracking-tight truncate mt-0.5">
                {cfg.name.split(' ')[0]}
              </div>
              {isCurrent && (
                <div className="w-1 h-1 rounded-full bg-pink-400 mx-auto mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Phase Focus Card */}
      <div
        className="p-6 rounded-3xl border shadow-2xl space-y-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(145deg, #1f1027, #13091c)`,
          borderColor: `${phaseData.color}40`,
          boxShadow: `0 10px 30px -10px ${phaseData.glowColor}`
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{phaseData.icon}</span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300">
                Phase Breakdown
              </span>
              <h3 className="text-xl font-black text-white">
                {phaseData.name}
              </h3>
            </div>
          </div>

          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full text-white/90 border"
            style={{ backgroundColor: `${phaseData.color}25`, borderColor: `${phaseData.color}50` }}
          >
            {phaseData.subtitle}
          </span>
        </div>

        <p className="text-xs text-pink-100/90 leading-relaxed">
          {phaseData.description}
        </p>

        {/* Hormones */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
          <Activity className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <span className="font-bold text-white block">Hormonal Balance</span>
            <span className="text-pink-200/80 leading-normal">{phaseData.hormones}</span>
          </div>
        </div>

        {/* Nutrition */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
          <Utensils className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <span className="font-bold text-white block">Foods to Nourish Your Body</span>
            <span className="text-pink-200/80 leading-normal">{phaseData.idealFood}</span>
          </div>
        </div>

        {/* Exercise */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
          <Dumbbell className="w-5 h-5 text-purple-300 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <span className="font-bold text-white block">Optimal Movement & Workouts</span>
            <span className="text-pink-200/80 leading-normal">{phaseData.exercise}</span>
          </div>
        </div>
      </div>

      {/* Cycle Syncing Pro Tips */}
      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          Did You Know?
        </h4>

        <div className="space-y-2 text-xs text-pink-200/80 leading-relaxed">
          <p>
            🧠 <strong>Your brain shifts by 25% during your cycle:</strong> During the follicular & ovulation phases, estrogen enhances verbal fluency and social connectivity.
          </p>
          <p>
            🍫 <strong>Chocolate cravings in luteal are real:</strong> Your metabolic rate increases by 100–300 calories per day before your period, and your body naturally seeks magnesium to calm uterine muscles.
          </p>
        </div>
      </div>
    </div>
  );
}
