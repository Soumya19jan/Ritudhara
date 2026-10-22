import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Droplet, Smile, Heart, Check, Save, Sparkles, Plus, Minus } from 'lucide-react';
import { formatDateISO } from '../services/cycleEngine';

const FLOW_LEVELS = [
  { id: 'none', label: 'None', icon: '✨', color: 'bg-white/10 text-white/60' },
  { id: 'spotting', label: 'Spotting', icon: '🪶', color: 'bg-pink-400/20 text-pink-300 border-pink-400/30' },
  { id: 'light', label: 'Light', icon: '🌸', color: 'bg-rose-400/25 text-rose-300 border-rose-400/30' },
  { id: 'medium', label: 'Medium', icon: '🩸', color: 'bg-rose-500/35 text-rose-200 border-rose-500/40' },
  { id: 'heavy', label: 'Heavy', icon: '🌊', color: 'bg-red-600/45 text-red-200 border-red-500/50' },
];

const MOODS = [
  { id: 'Happy', icon: '😊', label: 'Happy' },
  { id: 'Calm', icon: '🌿', label: 'Calm' },
  { id: 'Sensual', icon: '✨', label: 'Glow' },
  { id: 'Emotional', icon: '🥺', label: 'Sensitive' },
  { id: 'Irritable', icon: '⚡', label: 'Irritable' },
  { id: 'Exhausted', icon: '😴', label: 'Tired' },
];

const SYMPTOMS_LIST = [
  'Cramps', 'Lower Back Ache', 'Tender Breasts', 'Bloating',
  'Headache', 'Breakouts', 'Sweet Cravings', 'Salty Cravings',
  'Insomnia', 'High Energy', 'Digestive Sensitivities'
];

export default function LogModal({ isOpen, onClose, dateStr, existingLog, onSaveLog }) {
  const targetDateStr = dateStr || formatDateISO(new Date());

  const [flow, setFlow] = useState(existingLog?.flow || 'none');
  const [mood, setMood] = useState(existingLog?.mood || '');
  const [symptoms, setSymptoms] = useState(existingLog?.symptoms || []);
  const [waterLiters, setWaterLiters] = useState(existingLog?.waterLiters || 2.0);
  const [tookMeds, setTookMeds] = useState(existingLog?.tookMeds || false);
  const [notes, setNotes] = useState(existingLog?.notes || '');

  useEffect(() => {
    if (existingLog) {
      setFlow(existingLog.flow || 'none');
      setMood(existingLog.mood || '');
      setSymptoms(existingLog.symptoms || []);
      setWaterLiters(existingLog.waterLiters ?? 2.0);
      setTookMeds(existingLog.tookMeds || false);
      setNotes(existingLog.notes || '');
    } else {
      setFlow('none');
      setMood('');
      setSymptoms([]);
      setWaterLiters(2.0);
      setTookMeds(false);
      setNotes('');
    }
  }, [existingLog, dateStr]);

  if (!isOpen) return null;

  const toggleSymptom = (sym) => {
    if (symptoms.includes(sym)) {
      setSymptoms(symptoms.filter((s) => s !== sym));
    } else {
      setSymptoms([...symptoms, sym]);
    }
  };

  const handleSave = () => {
    const logData = {
      flow,
      mood,
      symptoms,
      waterLiters,
      tookMeds,
      notes
    };

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // safe fallback
    }

    onSaveLog(targetDateStr, logData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md max-h-[90vh] bg-gradient-to-b from-[#24132b] via-[#1a0f24] to-[#120819] rounded-[32px] p-6 border border-pink-500/25 shadow-2xl text-white overflow-y-auto space-y-5">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300">
              Daily Body Log
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {new Date(targetDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Bleeding / Flow */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-rose-400" />
            Bleeding & Flow
          </label>

          <div className="grid grid-cols-5 gap-1.5">
            {FLOW_LEVELS.map((item) => {
              const active = flow === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFlow(item.id)}
                  className={`py-2 px-1 rounded-2xl flex flex-col items-center gap-1 border transition text-center ${
                    active
                      ? `${item.color} ring-2 ring-pink-400`
                      : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[11px] font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Mood */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5 text-amber-300" />
            Mood & Energy
          </label>

          <div className="grid grid-cols-3 gap-2">
            {MOODS.map((item) => {
              const active = mood === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMood(active ? '' : item.id)}
                  className={`py-2 px-2.5 rounded-2xl flex items-center gap-2 border transition ${
                    active
                      ? 'bg-pink-500/30 border-pink-400 text-white shadow-md shadow-pink-500/20'
                      : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Physical Symptoms */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            Physical Symptoms
          </label>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {SYMPTOMS_LIST.map((sym) => {
              const active = symptoms.includes(sym);
              return (
                <button
                  key={sym}
                  type="button"
                  onClick={() => toggleSymptom(sym)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                    active
                      ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 border-pink-400 text-white'
                      : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span>{sym}</span>
                  {active && <Check className="w-3 h-3 text-pink-300" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Water Intake Counter */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white block">Water Intake</span>
            <span className="text-[11px] text-pink-200/60 block">Keep body hydrated</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setWaterLiters(Math.max(0.5, Number((waterLiters - 0.5).toFixed(1))))}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-pink-300 w-12 text-center">
              {waterLiters} L
            </span>
            <button
              onClick={() => setWaterLiters(Math.min(5.0, Number((waterLiters + 0.5).toFixed(1))))}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5. Medication Checkbox */}
        <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition">
          <input
            type="checkbox"
            checked={tookMeds}
            onChange={(e) => setTookMeds(e.target.checked)}
            className="w-4 h-4 accent-pink-500 rounded"
          />
          <div className="text-xs">
            <span className="font-semibold text-white block">Took pain relief or vitamins today</span>
            <span className="text-[11px] text-pink-200/60 block">Ibuprofen, magnesium, birth control pill, etc.</span>
          </div>
        </label>

        {/* 6. Personal Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-pink-300">
            Personal Reflection / Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Mild cramps after coffee, felt very energized at the gym..."
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-pink-400 resize-none transition"
          />
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-500/25 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Today's Log</span>
          </button>
        </div>
      </div>
    </div>
  );
}
