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
    <motion.div variants={fadeUp} className="bg-surface-container-low/50 backdrop-blur-xl border border-outline-variant/20 rounded-3xl p-6 lg:p-8 min-h-[600px] h-[calc(100vh-16rem)] flex flex-col shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 z-10 shrink-0">
        <div>
          <h2 className="text-3xl font-display font-bold text-on-surface tracking-wide">Reminders</h2>
          <p className="text-on-surface-variant text-sm mt-1">Schedule notes to pop up exactly when you need them.</p>
        </div>
      </div>

      <form onSubmit={handleAddReminder} className="flex flex-col sm:flex-row gap-4 mb-8 z-10 shrink-0">
        <input
          type="text"
          className="flex-[2] bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
          placeholder="What do you want to be reminded about?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <input
          type="date"
          className="flex-1 bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all [color-scheme:dark]"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          className="flex-1 bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all [color-scheme:dark]"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button 
          type="submit" 
          className="bg-gradient-to-r from-neon-cyan to-primary text-on-primary px-6 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.97] hover:shadow-glow-cyan shadow-lg"
        >
          Add
        </button>
      </form>

      <div className="flex-1 overflow-y-auto scrollbar-hide hover-scrollbar min-h-0 z-10 pb-4 space-y-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Upcoming</h3>
          {activeReminders.length === 0 ? (
            <p className="text-sm text-on-surface-variant/60 italic">No upcoming reminders.</p>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {activeReminders.map(reminder => (
                  <motion.div 
                    key={reminder.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-2xl hover:border-primary/30 hover:bg-black/40 transition-colors group"
                  >
                    <div>
                      <p className="text-on-surface font-medium">{reminder.text}</p>
                      <p className="text-xs text-on-surface-variant font-label-caps mt-1 tracking-wider text-neon-cyan/80">
                        {formatDateTime(reminder.datetime)}
                      </p>
                    </div>
                    <button 
                      type="button" 
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant hover:bg-red-500/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      onClick={() => deleteReminder(reminder.id)}
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {dismissedReminders.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Past</h3>
            <div className="space-y-3 opacity-60">
              {dismissedReminders.map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group">
                  <div>
                    <p className="text-on-surface line-through">{reminder.text}</p>
                    <p className="text-xs text-on-surface-variant font-label-caps mt-1">
                      {formatDateTime(reminder.datetime)}
                    </p>
                  </div>
                  <button 
                    type="button" 
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant hover:bg-red-500/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
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
