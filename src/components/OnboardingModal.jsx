import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Heart, Sparkles, ChevronRight, Check, ShieldCheck, ArrowLeft } from 'lucide-react';
import { formatDateISO } from '../services/cycleEngine';

const SYMPTOM_OPTIONS = [
  { id: 'cramps', label: 'Cramps & Aches', icon: '⚡' },
  { id: 'tender', label: 'Tender Breasts', icon: '🌸' },
  { id: 'bloat', label: 'Bloating & Puffiness', icon: '🎈' },
  { id: 'mood', label: 'Emotional / Sensitive', icon: '🥺' },
  { id: 'acne', label: 'Skin Breakouts', icon: '✨' },
  { id: 'cravings', label: 'Sweet / Salty Cravings', icon: '🍫' },
  { id: 'fatigue', label: 'Low Energy / Fatigue', icon: '😴' },
  { id: 'headache', label: 'Headaches / Migraine', icon: '🤕' },
];

export default function OnboardingModal({ isOpen, onComplete, initialProfile }) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const todayStr = formatDateISO(new Date());

  const [formData, setFormData] = useState({
    name: initialProfile?.name || 'Beautiful',
    lastPeriodDate: initialProfile?.lastPeriodDate || todayStr,
    cycleLength: initialProfile?.cycleLength || 28,
    periodDuration: initialProfile?.periodDuration || 5,
    typicalSymptoms: initialProfile?.typicalSymptoms || ['cramps', 'mood', 'tender']
  });

  const [isCalibrating, setIsCalibrating] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      finishCalibration();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const setRelativeDate = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setFormData({ ...formData, lastPeriodDate: formatDateISO(d) });
  };

  const toggleSymptom = (id) => {
    const exists = formData.typicalSymptoms.includes(id);
    if (exists) {
      setFormData({
        ...formData,
        typicalSymptoms: formData.typicalSymptoms.filter(s => s !== id)
      });
    } else {
      setFormData({
        ...formData,
        typicalSymptoms: [...formData.typicalSymptoms, id]
      });
    }
  };

  const finishCalibration = () => {
    setIsCalibrating(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }

    setTimeout(() => {
      onComplete({
        ...formData,
        calibrated: true,
        updatedAt: new Date().toISOString()
      });
      setIsCalibrating(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#24132b] via-[#1a0f24] to-[#120819] rounded-[32px] p-6 border border-pink-500/25 shadow-2xl text-white overflow-hidden">
        
        {/* Glowing atmospheric backdrop */}
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Header with step indicator */}
        <div className="flex items-center justify-between mb-6">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-white/10 text-white/70 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <span className="text-xl">🌸</span>
          )}

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-6 bg-gradient-to-r from-pink-400 to-purple-400'
                    : i < step
                    ? 'w-2 bg-pink-400/50'
                    : 'w-2 bg-white/15'
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-semibold text-pink-300/80">
            {step} of {totalSteps}
          </span>
        </div>

        {/* STEP 1: Name */}
        {step === 1 && (
          <div className="space-y-5 animate-slide-up">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-pink-500/30 to-purple-500/30 border border-pink-400/30 flex items-center justify-center text-3xl shadow-lg shadow-pink-500/10">
                ✨
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Welcome to LunaGlow</h2>
              <p className="text-sm text-pink-200/70 leading-relaxed">
                Your 3D, privacy-first companion. Let's calibrate your cycle in under 60 seconds.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-pink-300 uppercase tracking-wider block">
                What should we call you?
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Maya, Elena, Blossom..."
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/15 focus:border-pink-400 focus:outline-none text-white placeholder-white/30 text-base transition"
              />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-pink-950/40 border border-pink-500/20 text-xs text-pink-200/80">
              <ShieldCheck className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <span>100% Private: All your cycle data stays stored locally on your device.</span>
            </div>
          </div>
        )}

        {/* STEP 2: Last Period Date */}
        {step === 2 && (
          <div className="space-y-5 animate-slide-up">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight">When did your last period start?</h2>
              <p className="text-xs text-pink-200/70">
                The first day you noticed active bleeding or spotting.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <input
                type="date"
                value={formData.lastPeriodDate}
                max={todayStr}
                onChange={(e) => setFormData({ ...formData, lastPeriodDate: e.target.value })}
                className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border border-pink-400/40 text-white font-medium text-center text-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />

              <div className="text-xs text-center text-white/50">Quick choices:</div>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setRelativeDate(0)}
                  className={`py-2 px-1 rounded-xl text-xs font-medium border transition ${
                    formData.lastPeriodDate === todayStr
                      ? 'bg-pink-500/40 border-pink-400 text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  🩸 Today
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(3)}
                  className="py-2 px-1 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition"
                >
                  3d ago
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(7)}
                  className="py-2 px-1 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition"
                >
                  1w ago
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(14)}
                  className="py-2 px-1 rounded-xl text-xs font-medium bg-purple-500/20 border border-purple-400/30 text-purple-200 hover:bg-purple-500/30 transition"
                  title="Estimated ~2 weeks ago"
                >
                  ~2w ago
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Cycle Length */}
        {step === 3 && (
          <div className="space-y-4 animate-slide-up">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight">How long is your cycle?</h2>
              <p className="text-xs text-pink-200/70">
                Days from the first day of one period to the first day of the next.
              </p>
            </div>

            <div className="py-4 text-center space-y-3">
              <div className="inline-flex items-baseline gap-1 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400">
                {formData.cycleLength}
                <span className="text-xl font-medium text-pink-200/60">days</span>
              </div>

              <input
                type="range"
                min="21"
                max="45"
                value={formData.cycleLength}
                onChange={(e) => setFormData({ ...formData, cycleLength: parseInt(e.target.value, 10) })}
                className="w-full accent-pink-500 h-2 bg-white/10 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-white/40 px-1">
                <span>21 days</span>
                <span className="text-pink-300 font-semibold">28 days (Average)</span>
                <span>45 days</span>
              </div>
            </div>

            {/* Quick choices including "I don't know / Not sure" */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, cycleLength: 28 })}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                    formData.cycleLength === 28
                      ? 'bg-pink-500/30 border-pink-400 text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  🌸 28 Days (Avg)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, cycleLength: 30 })}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                    formData.cycleLength === 30
                      ? 'bg-pink-500/30 border-pink-400 text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  🌙 30 Days
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, cycleLength: 28 })}
                  className="py-2 px-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500/25 to-pink-500/25 border border-purple-400/40 text-purple-200 hover:opacity-90 transition"
                >
                  ❓ Don't know
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-pink-200/80 leading-relaxed">
                <strong className="text-white block font-semibold mb-0.5">Don't know your exact days? No problem!</strong>
                Most cycles fall between 26–32 days (28 days is the standard average). Luna will automatically recalibrate and learn your personal rhythm over time as you log your periods!
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Period Duration */}
        {step === 4 && (
          <div className="space-y-5 animate-slide-up">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight">How many days do you bleed?</h2>
              <p className="text-xs text-pink-200/70">
                Typical duration of your active period flow.
              </p>
            </div>

            <div className="py-6 text-center space-y-3">
              <div className="inline-flex items-baseline gap-1 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-purple-400">
                {formData.periodDuration}
                <span className="text-xl font-medium text-pink-200/60">days</span>
              </div>

              <input
                type="range"
                min="2"
                max="10"
                value={formData.periodDuration}
                onChange={(e) => setFormData({ ...formData, periodDuration: parseInt(e.target.value, 10) })}
                className="w-full accent-rose-500 h-2 bg-white/10 rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-white/40 px-1">
                <span>2 days</span>
                <span className="text-rose-300 font-semibold">5 days (Common)</span>
                <span>10 days</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[3, 5, 7].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFormData({ ...formData, periodDuration: val })}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border transition ${
                    formData.periodDuration === val
                      ? 'bg-rose-500/30 border-rose-400 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {val} Days
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, periodDuration: 5 })}
                className="py-2 px-1 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500/25 to-rose-500/25 border border-purple-400/40 text-purple-200 hover:opacity-90 transition"
              >
                ❓ Not sure
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Symptoms & Signals */}
        {step === 5 && (
          <div className="space-y-4 animate-slide-up">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Your Typical Cycle Signals</h2>
              <p className="text-xs text-pink-200/70">
                What does your body usually tell you? (Pick all that apply)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
              {SYMPTOM_OPTIONS.map((item) => {
                const selected = formData.typicalSymptoms.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSymptom(item.id)}
                    className={`p-3 rounded-2xl text-left border text-xs flex items-center gap-2.5 transition-all ${
                      selected
                        ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 border-pink-400 text-white shadow-md shadow-pink-500/10'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium leading-tight flex-1">{item.label}</span>
                    {selected && <Check className="w-3.5 h-3.5 text-pink-300" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 pt-2">
          {isCalibrating ? (
            <div className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 animate-pulse">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Synthesizing 3D Cycle Engine...</span>
            </div>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
            >
              <span>{step === totalSteps ? 'Activate 3D Cycle' : 'Continue'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
