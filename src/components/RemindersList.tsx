import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp } from '../lib/animations';

const RemindersList: React.FC = () => {
  const { data, updateData } = useData();
  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !date || !time) return;

    const datetime = new Date(`${date}T${time}`).toISOString();

    const newReminder = {
      id: crypto.randomUUID(),
      text: text.trim(),
      datetime,
      isDismissed: false,
    };

    updateData({ reminders: [...data.reminders, newReminder] });
    setText('');
    setDate('');
    setTime('');
  };

  const deleteReminder = (id: string) => {
    updateData({ reminders: data.reminders.filter(r => r.id !== id) });
  };

  const activeReminders = data.reminders.filter(r => !r.isDismissed).sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  const dismissedReminders = data.reminders.filter(r => r.isDismissed).sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <motion.div variants={fadeUp} className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 min-h-[500px] lg:min-h-[600px] h-auto lg:h-[calc(100vh-16rem)] flex flex-col lg:flex-row gap-8 lg:gap-12 shadow-card relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-electric-violet/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      
      {/* Left Column: Header & Form */}
      <div className="flex flex-col w-full lg:w-[35%] xl:w-[30%] z-10 shrink-0">
        <div className="mb-8">
          <h2 className="text-4xl font-display font-bold text-white tracking-wide">Reminders</h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">Schedule notes to pop up exactly when you need them. Never miss an important session.</p>
        </div>

        <form onSubmit={handleAddReminder} className="flex flex-col gap-5 bg-black/20 border border-white/5 rounded-3xl p-6 shadow-inner">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reminder Note</label>
            <input
              type="text"
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
              placeholder="What do you want to be reminded about?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Date</label>
              <input
                type="date"
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all [color-scheme:dark]"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Time</label>
              <input
                type="time"
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all [color-scheme:dark]"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-neon-cyan to-electric-violet hover:opacity-90 text-white py-3.5 rounded-xl font-bold tracking-wide transition-all active:scale-[0.98] shadow-glow-cyan mt-2"
          >
            Set Reminder
          </button>
        </form>
      </div>

      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      {/* Right Column: List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide hover-scrollbar min-h-0 z-10 lg:pr-2 space-y-10">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-neon-cyan mb-6 flex items-center gap-3">
            Upcoming
            <span className="h-px flex-1 bg-neon-cyan/20" />
          </h3>
          {activeReminders.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-sm text-slate-400">No upcoming reminders.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {activeReminders.map(reminder => (
                  <motion.div 
                    key={reminder.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-5 bg-[#0f0f13]/80 backdrop-blur-md border border-neon-cyan/20 rounded-2xl hover:border-neon-cyan/50 hover:bg-[#1a1a24] transition-all group shadow-[0_4px_20px_-4px_rgba(6,182,212,0.15)]"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      </div>
                      <div>
                        <p className="text-white font-medium text-lg leading-tight">{reminder.text}</p>
                        <p className="text-xs text-neon-cyan/80 font-bold uppercase tracking-wider mt-1.5">
                          {formatDateTime(reminder.datetime)}
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                      onClick={() => deleteReminder(reminder.id)}
                      title="Delete reminder"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {dismissedReminders.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-3">
              Past
              <span className="h-px flex-1 bg-white/10" />
            </h3>
            <div className="grid gap-3 opacity-60">
              {dismissedReminders.map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <p className="text-slate-300 line-through decoration-slate-500/50">{reminder.text}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                        {formatDateTime(reminder.datetime)}
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RemindersList;
