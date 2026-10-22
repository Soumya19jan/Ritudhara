import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Calendar as CalendarIcon, Heart, Droplet, Plus } from 'lucide-react';
import { calculateCycleStatus, formatDateISO, parseLocalDate, PHASES } from '../services/cycleEngine';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarView({ profile, dailyLogs, onOpenLogModal }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const todayStr = formatDateISO(new Date());

  // Generate days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const daysGrid = [];
  // Leading empty blanks
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push(null);
  }
  // Days of current month
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const d = new Date(year, month, day);
    const dateStr = formatDateISO(d);
    const status = calculateCycleStatus(profile, d);
    const log = dailyLogs[dateStr];
    daysGrid.push({ day, date: d, dateStr, status, log });
  }

  // Selected date status
  const selectedDateStr = formatDateISO(selectedDate);
  const selectedStatus = calculateCycleStatus(profile, selectedDate);
  const selectedLog = dailyLogs[selectedDateStr];

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Calendar Header Card */}
      <div className="bg-gradient-to-b from-[#251330] to-[#150a1e] rounded-3xl p-5 border border-pink-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {MONTH_NAMES[month]} {year}
            </h2>
            <p className="text-xs text-pink-200/60 font-medium">
              3D Cycle Calendar & Forecast
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentDate(new Date());
                setSelectedDate(new Date());
              }}
              className="px-2 py-0.5 text-[11px] font-bold text-pink-300 hover:text-white transition"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {DAYS_OF_WEEK.map((dayName) => (
            <div key={dayName} className="text-[11px] font-bold uppercase tracking-wider text-pink-300/60 py-1">
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Day Matrix */}
        <div className="grid grid-cols-7 gap-1.5">
          {daysGrid.map((item, index) => {
            if (!item) {
              return <div key={`empty-${index}`} className="h-11" />;
            }

            const { day, date, dateStr, status, log } = item;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDateStr;

            const isPeriod = status.isPeriodDay;
            const isOvulation = status.cycleDay === status.ovulationCycleDay;
            const isFertile = status.cycleDay >= status.fertileStartDay && status.cycleDay <= status.fertileEndDay;

            // Cell styling
            let cellBg = 'bg-white/5 hover:bg-white/10';
            let textColor = 'text-white/80';
            let borderStyle = 'border-transparent';

            if (isPeriod) {
              cellBg = 'bg-rose-500/30 hover:bg-rose-500/40';
              textColor = 'text-rose-200 font-bold';
              borderStyle = 'border-rose-500/40';
            } else if (isOvulation) {
              cellBg = 'bg-amber-500/25 hover:bg-amber-500/35';
              textColor = 'text-amber-200 font-bold';
              borderStyle = 'border-amber-400/50';
            } else if (isFertile) {
              cellBg = 'bg-purple-500/20 hover:bg-purple-500/30';
              textColor = 'text-purple-200 font-medium';
            }

            if (isSelected) {
              borderStyle = 'border-pink-400 ring-2 ring-pink-400/50';
            }

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(date)}
                className={`relative h-11 rounded-2xl flex flex-col items-center justify-center transition-all duration-150 border ${cellBg} ${borderStyle} active:scale-95`}
              >
                {/* Today tiny indicator */}
                {isToday && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                )}

                <span className={`text-xs ${textColor}`}>
                  {day}
                </span>

                {/* Day status glyph */}
                <div className="flex items-center gap-0.5 mt-0.5">
                  {isPeriod && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-sm" />}
                  {isOvulation && <span className="text-[9px] leading-none text-amber-300">✨</span>}
                  {log && <span className="w-1 h-1 rounded-full bg-pink-300" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] text-white/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Period (Menstrual)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Ovulation Peak ✨</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400/60" />
            <span>Fertile Window</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-400" />
            <span>Logged Entry</span>
          </div>
        </div>
      </div>

      {/* Selected Day Details Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#23122c] to-[#120919] border border-pink-500/25 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-pink-300">
              Selected Day
            </span>
            <h3 className="text-lg font-bold text-white">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>
          </div>

          <button
            onClick={() => onOpenLogModal(selectedDateStr)}
            className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-400/30 text-xs font-bold flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            {selectedLog ? 'Edit Log' : 'Log Day'}
          </button>
        </div>

        {/* Status badges */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-white/50 block">Cycle Phase</span>
            <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
              {selectedStatus.phaseConfig.icon} {selectedStatus.phaseConfig.name}
            </span>
            <span className="text-[11px] text-pink-200/70 block mt-0.5">
              Day {selectedStatus.cycleDay} of {selectedStatus.cycleLength}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
            <span className="text-[10px] uppercase font-bold text-white/50 block">Conception Chance</span>
            <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
              🌸 {selectedStatus.conceptionChance}
            </span>
            <span className="text-[11px] text-pink-200/70 block mt-0.5">
              {selectedStatus.cycleDay === selectedStatus.ovulationCycleDay ? 'Ovulation Day!' : 'Fertility guide'}
            </span>
          </div>
        </div>

        {/* Pad guidance for this day */}
        <div className="p-3.5 rounded-2xl bg-pink-950/30 border border-pink-500/20 flex items-start gap-3">
          <span className="text-xl">🎒</span>
          <div className="text-xs space-y-0.5">
            <span className="font-bold text-pink-300 block">
              {selectedStatus.padRecommendation.badge}:
            </span>
            <span className="text-pink-100/90 font-medium">
              {selectedStatus.padRecommendation.recommendation}
            </span>
          </div>
        </div>

        {/* Logged symptoms on selected day */}
        {selectedLog && (
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-pink-300">
              Your Recorded Entry:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedLog.flow && selectedLog.flow !== 'none' && (
                <span className="text-xs px-2 py-1 rounded-xl bg-rose-500/20 text-rose-200 border border-rose-400/30">
                  🩸 Flow: {selectedLog.flow}
                </span>
              )}
              {selectedLog.mood && (
                <span className="text-xs px-2 py-1 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-400/30">
                  Mood: {selectedLog.mood}
                </span>
              )}
              {selectedLog.symptoms?.map((sym) => (
                <span key={sym} className="text-xs px-2 py-1 rounded-xl bg-white/10 text-white/80 border border-white/10">
                  {sym}
                </span>
              ))}
            </div>
            {selectedLog.notes && (
              <p className="text-xs italic text-white/60 bg-black/20 p-2 rounded-xl">
                "{selectedLog.notes}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
