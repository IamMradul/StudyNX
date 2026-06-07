import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import { toDateKey } from '../lib/studyLogic';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { cn } from '../lib/utils';
import { fadeUp } from '../lib/animations';

const AnimatedNumber = ({ value, isFloat = false, suffix = '' }: { value: number, isFloat?: boolean, suffix?: string }) => {
  const count = useMotionValue(0);
  const display = useTransform(count, (latest) => 
    (isFloat ? latest.toFixed(1) : Math.round(latest)) + suffix
  );

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{display}</motion.span>;
};

const StatCard = ({ title, value, subtitle, isFloat, suffix, sparklineData, color, dataKey, delay }: any) => {
  return (
    <motion.div 
      variants={fadeUp}
      custom={delay}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        "relative p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden group transition-all duration-300 shadow-card",
        color === 'violet' ? 'hover:border-electric-violet/50 hover:shadow-glow-violet' :
        color === 'cyan' ? 'hover:border-neon-cyan/50 hover:shadow-glow-cyan' :
        'hover:border-emerald-400/50 hover:shadow-glow-emerald'
      )}
    >
      {/* Top glow line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 opacity-50",
        color === 'violet' ? 'bg-gradient-to-r from-transparent via-electric-violet to-transparent' :
        color === 'cyan' ? 'bg-gradient-to-r from-transparent via-neon-cyan to-transparent' :
        'bg-gradient-to-r from-transparent via-emerald-400 to-transparent'
      )} />

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
          <div className="text-4xl font-display font-bold text-white tracking-tight mt-2">
            <AnimatedNumber value={value} isFloat={isFloat} suffix={suffix} />
          </div>
          <p className="text-slate-500 text-xs mt-2">{subtitle}</p>
        </div>
      </div>

      <div className="h-12 w-full mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData}>
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color === 'violet' ? '#7C3AED' : color === 'cyan' ? '#06B6D4' : '#10B981'} 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const TopStats: React.FC = () => {
  const { data } = useData();
  const now = new Date();
  
  // Weekly data for sparklines
  const weekEntries = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - idx));
    return {
      name: d.toLocaleDateString(undefined, { weekday: 'short' }),
      hours: data.activityData[toDateKey(d)] ?? 0,
    };
  });

  const todayHours = weekEntries[6].hours;
  const activeDays = weekEntries.filter(e => e.hours > 0).length;
  const streak = (() => {
    let count = 0;
    const cursor = new Date(now);
    while ((data.activityData[toDateKey(cursor)] ?? 0) > 0) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  })();

  const focusScoreData = weekEntries.map(e => ({ score: Math.min(100, (e.hours / Math.max(1, data.weeklyTargetHours / 7)) * 100) }));
  const avgFocusScore = Math.round(focusScoreData.reduce((s, e) => s + e.score, 0) / 7);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        title="Today's Hours" 
        value={todayHours} 
        isFloat={true} 
        suffix="h"
        subtitle="Logged today"
        sparklineData={weekEntries}
        dataKey="hours"
        color="violet"
        delay={0}
      />
      <StatCard 
        title="Current Streak" 
        value={streak} 
        isFloat={false}
        suffix="d"
        subtitle={`${activeDays}/7 active days`}
        sparklineData={weekEntries.map(e => ({ active: e.hours > 0 ? 1 : 0 }))}
        dataKey="active"
        color="cyan"
        delay={1}
      />
      <StatCard 
        title="Focus Score" 
        value={avgFocusScore} 
        isFloat={false}
        suffix="%"
        subtitle="Weekly average"
        sparklineData={focusScoreData}
        dataKey="score"
        color="emerald"
        delay={2}
      />
    </div>
  );
};

export default TopStats;
