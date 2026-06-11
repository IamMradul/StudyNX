import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import type { Subject } from '../context/DataContext';
import { toDateKey } from '../lib/studyLogic';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import confetti from 'canvas-confetti';
import { cn, scrollOnHover } from '../lib/utils';
import { fadeUp, staggerContainer, scaleIn } from '../lib/animations';

const TiltCard = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: -(y / rect.height) * 16, y: (x / rect.width) * 16 });
  };

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: tilt.x || tilt.y ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

const CircularProgress = ({ progress, color, size = 56, strokeWidth = 5 }: { progress: number, color: string, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-white/10"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold font-display" style={{ color }}>
        {clampedProgress}%
      </div>
    </div>
  );
};

const ProgressBar = ({ progress, color }: { progress: number, color: string }) => {
  return (
    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden mt-4 border border-white/5 relative">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, progress)}%` }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="h-full rounded-full relative overflow-hidden"
        style={{ 
          background: `linear-gradient(90deg, ${color} 0%, ${color}aa 100%)`,
          boxShadow: `0 0 10px ${color}80` 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </motion.div>
    </div>
  );
};

const SubjectsList: React.FC = () => {
  const { data, updateData, logStudySession } = useData();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectTargetHours, setNewSubjectTargetHours] = useState('40');
  const [todayHoursInput, setTodayHoursInput] = useState('');
  const confettiFired = useRef<Set<string>>(new Set());

  const todayKey = useMemo(() => toDateKey(new Date()), []);

  const selectedSubject = selectedSubjectId
    ? data.subjects.find(subject => subject.id === selectedSubjectId) ?? null
    : null;

  useEffect(() => {
    if (!selectedSubject) {
      setTodayHoursInput('');
      return;
    }
    const current = selectedSubject.dailyHours[todayKey] ?? 0;
    setTodayHoursInput(current > 0 ? String(current) : '');
  }, [selectedSubject, todayKey]);

  useEffect(() => {
    data.subjects.forEach(subject => {
      if (subject.progress >= 100 && !confettiFired.current.has(subject.id)) {
        confettiFired.current.add(subject.id);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: [subject.color, '#ffffff', '#06B6D4', '#7C3AED'],
          zIndex: 9999
        });
      }
    });
  }, [data.subjects]);

  const deriveSubject = (subject: Subject): Subject => {
    const targetHours = Number.isFinite(subject.targetHours) && subject.targetHours > 0 ? Number(subject.targetHours.toFixed(1)) : 40;
    const sanitizedDailyHours = Object.fromEntries(
      Object.entries(subject.dailyHours)
        .filter((entry): entry is [string, number] => typeof entry[1] === 'number' && Number.isFinite(entry[1]) && entry[1] > 0)
        .map(([dateKey, hours]) => [dateKey, Number(hours.toFixed(1))])
    ) as Record<string, number>;

    const totalHoursRaw = Object.values(sanitizedDailyHours).reduce((sum, hours) => sum + hours, 0);
    const totalHours = Number(totalHoursRaw.toFixed(1));
    const progress = Math.min(100, Math.round((totalHours / targetHours) * 100));
    const status: Subject['status'] = progress >= 100 ? 'on track' : progress >= 50 ? 'progressing' : 'needs focus';
    
    return { ...subject, targetHours, dailyHours: sanitizedDailyHours, totalHours, progress, status, studyDates: Object.keys(sanitizedDailyHours).sort() };
  };

  const setTodayHoursForSubject = async (subjectId: string) => {
    const parsed = Number(todayHoursInput);
    if (!Number.isFinite(parsed) || parsed < 0) return;
    const boundedHours = Number(Math.min(parsed, 24).toFixed(1));
    const subject = data.subjects.find(item => item.id === subjectId);
    if (!subject) return;

    await logStudySession({
      source: 'subject',
      dateKey: todayKey,
      hours: boundedHours,
      subjectId,
      subjectName: subject.name,
    });
  };

  const addSubject = () => {
    const name = newSubjectName.trim();
    const parsedTarget = Number(newSubjectTargetHours);
    const targetHours = Number.isFinite(parsedTarget) && parsedTarget > 0 ? Number(parsedTarget.toFixed(1)) : 40;
    if (!name) return;

    const palette = ['#06B6D4', '#7C3AED', '#10B981', '#F43F5E', '#F59E0B'];
    const nextSubject = deriveSubject({
      id: crypto.randomUUID(),
      name,
      progress: 0,
      totalHours: 0,
      targetHours,
      status: 'needs focus',
      color: palette[data.subjects.length % palette.length],
      studyDates: [],
      dailyHours: {},
    });

    updateData({ subjects: [...data.subjects, nextSubject] });
    setNewSubjectName('');
    setNewSubjectTargetHours('40');
  };

  const editSubject = (subjectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const subject = data.subjects.find(item => item.id === subjectId);
    if (!subject) return;

    const nextName = window.prompt('Edit subject name', subject.name)?.trim();
    if (!nextName) return;
    const nextTargetRaw = window.prompt('Edit target hours', String(subject.targetHours))?.trim();
    if (!nextTargetRaw) return;
    const nextTarget = Number(nextTargetRaw);
    if (!Number.isFinite(nextTarget) || nextTarget <= 0) return;

    updateData({
      subjects: data.subjects.map(item => (
        item.id === subjectId ? deriveSubject({ ...item, name: nextName, targetHours: Number(nextTarget.toFixed(1)) }) : item
      )),
    });
  };

  const deleteSubject = (subjectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateData({ subjects: data.subjects.filter(item => item.id !== subjectId) });
  };

  const heatmapWeeks = useMemo(() => {
    if (!selectedSubject) return [] as Array<Array<{ dateKey: string; hours: number }>>;
    const days = Array.from({ length: 112 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (111 - i));
      const dateKey = toDateKey(date);
      return { dateKey, hours: selectedSubject.dailyHours[dateKey] ?? 0 };
    });
    return Array.from({ length: 16 }, (_, weekIndex) => days.slice(weekIndex * 7, weekIndex * 7 + 7));
  }, [selectedSubject]);

  return (
    <>
      <motion.div variants={fadeUp} className="bg-white/[0.02] border border-white/10 backdrop-blur-xl rounded-3xl p-6 lg:p-8 min-h-[600px] h-[calc(100vh-16rem)] flex flex-col">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div>
            <h2 className="text-2xl font-display font-bold text-white tracking-wide">Track Subjects</h2>
            <p className="text-slate-400 text-sm mt-1">Keep targets, progress, and history in one place.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            className="flex-1 min-w-[50px] w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
            placeholder="Add subject..."
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
          />
          <input
            type="number"
            min="1"
            step="0.5"
            className="w-full sm:w-32 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
            placeholder="Target"
            value={newSubjectTargetHours}
            onChange={(e) => setNewSubjectTargetHours(e.target.value)}
          />
          <button 
            type="button" 
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all active:scale-[0.97]"
            onClick={addSubject}
          >
            Add
          </button>
        </div>

        {data.subjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
            <svg className="w-12 h-12 text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            <strong className="text-white">No subjects yet</strong>
            <p className="text-sm text-slate-400 mt-1 max-w-[200px]">Add a subject above to start tracking progress.</p>
          </div>
        )}

        <motion.div variants={staggerContainer} initial="initial" animate="animate" onWheel={scrollOnHover} className="flex flex-col gap-4 flex-1 overflow-y-auto scrollbar-hide hover-scrollbar min-h-0">
          {data.subjects.map(subject => (
            <TiltCard 
              key={subject.id} 
              onClick={() => setSelectedSubjectId(subject.id)}
              className="group cursor-pointer relative bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl p-5 transition-colors overflow-hidden shrink-0"
            >
              <div 
                className="absolute top-0 left-0 bottom-0 w-1 opacity-50"
                style={{ backgroundColor: subject.color }}
              />
              <div className="flex items-center gap-5 pl-2 py-1">
                <CircularProgress progress={subject.progress} color={subject.color} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 pr-4">
                      <h3 className="text-lg font-display font-semibold text-white group-hover:text-neon-cyan transition-colors truncate">{subject.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{subject.totalHours}h / {subject.targetHours}h</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        subject.status === 'on track' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 
                        subject.status === 'progressing' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 
                        'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                      )}>
                        {subject.status}
                      </span>
                      
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
                        <button 
                          type="button" 
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                          onClick={(e) => editSubject(subject.id, e)}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                        </button>
                        <button 
                          type="button" 
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                          onClick={(e) => deleteSubject(subject.id, e)}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {selectedSubject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-void/80 backdrop-blur-md"
            onClick={() => setSelectedSubjectId(null)}
          >
            <motion.div 
              variants={scaleIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-xl bg-[#0f0f13] border border-white/10 rounded-3xl p-8 shadow-card"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                <div>
                  <p className="text-neon-cyan text-[10px] font-bold uppercase tracking-widest mb-1">Subject details</p>
                  <h3 className="text-2xl font-display font-bold text-white">{selectedSubject.name}</h3>
                </div>
                <button type="button" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-95" onClick={() => setSelectedSubjectId(null)}>×</button>
              </div>

              <div className="space-y-8">
                <div className="flex gap-3">
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                    placeholder="Hours studied today"
                    value={todayHoursInput}
                    onChange={(e) => setTodayHoursInput(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="bg-electric-violet hover:bg-electric-violet/80 text-white font-semibold px-6 py-3 rounded-xl transition-all active:scale-95 shadow-glow-violet"
                    onClick={() => setTodayHoursForSubject(selectedSubject.id)}
                  >
                    Save
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center">
                    <div className="text-xl font-display font-bold text-white">{selectedSubject.totalHours.toFixed(1)}<span className="text-sm text-slate-500 ml-1">h</span></div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Done</div>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center">
                    <div className="text-xl font-display font-bold text-white">{selectedSubject.targetHours.toFixed(1)}<span className="text-sm text-slate-500 ml-1">h</span></div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Target</div>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center">
                    <div className="text-xl font-display font-bold" style={{ color: selectedSubject.color }}>{selectedSubject.progress}<span className="text-sm opacity-50 ml-1">%</span></div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Complete</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">Activity (16 Weeks)</h4>
                  <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
                    {heatmapWeeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map(day => (
                          <div
                            key={day.dateKey}
                            className={cn(
                              "w-[12px] h-[12px] rounded-[3px] transition-colors border",
                              day.hours === 0 ? "bg-white/[0.02] border-white/[0.02]" :
                              day.hours < 1 ? "bg-electric-violet/30 border-electric-violet/10" :
                              day.hours < 2.5 ? "bg-electric-violet/60 border-electric-violet/20" :
                              day.hours < 4 ? "bg-electric-violet/80 border-electric-violet/30" :
                              "bg-electric-violet border-electric-violet shadow-[0_0_8px_rgba(124,58,237,0.4)]"
                            )}
                            title={`${day.dateKey}: ${day.hours.toFixed(1)}h`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SubjectsList;
