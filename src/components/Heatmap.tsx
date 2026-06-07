import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { toDateKey } from '../lib/studyLogic';
import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '../lib/utils';
import { fadeUp } from '../lib/animations';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getBucketClass = (hours: number) => {
  if (hours <= 0) return 'bg-white/[0.04] border border-white/[0.02] hover:border-white/10';
  if (hours <= 1.5) return 'bg-[#312E81] border border-[#312E81]/50';
  if (hours <= 3) return 'bg-[#4F46E5] border border-[#4F46E5]/50';
  if (hours <= 5) return 'bg-[#7C3AED] border border-[#7C3AED]/50';
  return 'bg-[#A855F7] shadow-[0_0_8px_rgba(168,85,247,0.5)] border border-[#A855F7]/80';
};

type MonthCell = {
  dateKey: string | null;
  hours: number;
  inMonth: boolean;
};

const buildMonthCells = (year: number, monthIndex: number, activityData: Record<string, number>) => {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const cells: MonthCell[] = Array.from({ length: 42 }, () => ({
    dateKey: null,
    hours: 0,
    inMonth: false,
  }));

  for (let day = 1; day <= daysInMonth; day += 1) {
    const flatIndex = firstWeekday + day - 1;
    const dateKey = toDateKey(new Date(year, monthIndex, day));
    cells[flatIndex] = {
      dateKey,
      hours: activityData[dateKey] ?? 0,
      inMonth: true,
    };
  }

  const columns = Array.from({ length: 6 }, (_, weekIndex) => {
    return Array.from({ length: 7 }, (_, weekday) => cells[weekIndex * 7 + weekday]);
  });

  const monthHours = cells.reduce((sum, cell) => sum + (cell.inMonth ? cell.hours : 0), 0);
  return { columns, monthHours };
};

const containerVariants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.005 }
  }
};

const cellVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } }
};

const Heatmap: React.FC = () => {
  const { data, logStudySession } = useData();
  const now = new Date();
  const year = now.getFullYear();
  const todayKey = toDateKey(now);
  const todayHours = data.activityData[todayKey] ?? 0;
  const [todayHoursInput, setTodayHoursInput] = useState(String(todayHours));
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);

  useEffect(() => {
    setTodayHoursInput(String(todayHours));
  }, [todayHours]);

  const saveTodayHours = async () => {
    const parsedHours = Number.parseFloat(todayHoursInput);
    if (!Number.isFinite(parsedHours) || parsedHours < 0) {
      return;
    }

    await logStudySession({
      source: 'heatmap',
      dateKey: todayKey,
      hours: Number(parsedHours.toFixed(1)),
    });
  };

  const months = monthNames.map((monthLabel, monthIndex) => {
    const { columns, monthHours } = buildMonthCells(year, monthIndex, data.activityData);

    return {
      monthLabel,
      columns,
      monthHours,
      isCurrentMonth: monthIndex === now.getMonth(),
    };
  });

  const totalYearHours = months.reduce((sum, month) => sum + month.monthHours, 0);
  const selectedDateHours = data.activityData[selectedDateKey] ?? 0;
  const selectedDateLabel = new Date(`${selectedDateKey}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <motion.section variants={fadeUp} className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-card flex flex-col gap-6 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-display font-semibold text-white">Yearly Heatmap</h3>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300">
              {year}
            </span>
          </div>
          <p className="text-slate-400 text-sm">{totalYearHours.toFixed(1)}h total studied</p>
        </div>

        <div className="flex items-center gap-4 bg-black/20 p-2 pl-4 rounded-2xl border border-white/5">
          <div className="flex flex-col">
            <span className="text-[0.65rem] text-slate-500 font-bold uppercase tracking-widest">Today</span>
            <span className="text-sm font-semibold text-electric-violet">{todayHours.toFixed(1)}h</span>
          </div>
          <div className="w-px h-8 bg-white/10 mx-2"></div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="0.5"
              className="w-16 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-sm text-center text-white focus:outline-none focus:border-electric-violet focus:ring-1 focus:ring-electric-violet transition-all"
              value={todayHoursInput}
              onChange={(e) => setTodayHoursInput(e.target.value)}
              placeholder="0.0"
            />
            <button 
              type="button" 
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-xl text-sm font-medium transition-all active:scale-[0.97]" 
              onClick={saveTodayHours}
            >
              Log
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-48 shrink-0 space-y-4">
          <div className="bg-electric-violet/10 border border-electric-violet/20 rounded-2xl p-4">
            <span className="text-[0.65rem] text-electric-violet font-bold uppercase tracking-widest block mb-1">Selected</span>
            <strong className="text-lg font-display text-white block mb-1">{selectedDateLabel}</strong>
            <span className="text-sm text-electric-violet font-medium">{selectedDateHours.toFixed(1)}h studied</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-4 px-2">
            <span>Less</span>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[3px] bg-white/[0.04] border border-white/[0.02]"></span>
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#312E81]"></span>
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#4F46E5]"></span>
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#7C3AED]"></span>
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[#A855F7] shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
            </div>
            <span>More</span>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto pb-4 scrollbar-hide">
          <Tooltip.Provider delayDuration={100}>
            <motion.div 
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="flex gap-3 min-w-max"
            >
              {months.map((month) => (
                <div key={month.monthLabel} className={cn("flex flex-col gap-2 p-3 rounded-2xl transition-colors", month.isCurrentMonth ? "bg-white/[0.03] border border-white/[0.05]" : "")}>
                  <div className="flex gap-1">
                    {month.columns.map((weekColumn, weekIndex) => (
                      <div className="flex flex-col gap-1" key={`${month.monthLabel}-w${weekIndex}`}>
                        {weekColumn.map((cell, dayIndex) => {
                          if (!cell.inMonth || !cell.dateKey) {
                            return <div key={`empty-${weekIndex}-${dayIndex}`} className="w-[10px] h-[10px]" />;
                          }

                          const dateKey = cell.dateKey;
                          const dateLabel = new Date(`${dateKey}T00:00:00`).toLocaleDateString(undefined, {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          });

                          return (
                            <Tooltip.Root key={`${month.monthLabel}-${dateKey}`}>
                              <Tooltip.Trigger asChild>
                                <motion.button
                                  variants={cellVariants}
                                  type="button"
                                  className={cn(
                                    "w-[10px] h-[10px] rounded-sm transition-all duration-200 outline-none",
                                    getBucketClass(cell.hours),
                                    selectedDateKey === dateKey ? "ring-2 ring-white ring-offset-2 ring-offset-[#050508] scale-125 z-10" : ""
                                  )}
                                  whileHover={{ scale: 1.4, zIndex: 20 }}
                                  onClick={() => setSelectedDateKey(dateKey)}
                                />
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content sideOffset={8} className="z-[200] px-3 py-2 rounded-xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl pointer-events-none">
                                  <p className="text-xs font-semibold text-white mb-0.5">{dateLabel}</p>
                                  <p className="text-[10px] font-medium text-electric-violet">{cell.hours.toFixed(1)}h studied</p>
                                  <Tooltip.Arrow className="fill-white/10" />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{month.monthLabel}</span>
                    <span className="text-[9px] font-medium text-slate-600">{month.monthHours.toFixed(0)}h</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </Tooltip.Provider>
        </div>
      </div>
    </motion.section>
  );
};

export default Heatmap;
