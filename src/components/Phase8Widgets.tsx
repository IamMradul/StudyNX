import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { toDateKey } from '../lib/studyLogic';
import { scrollOnHover } from '../lib/utils';
import './Widgets.css';
import './Phase8Widgets.css';

export const Resources: React.FC = () => {
  const { data, updateData } = useData();
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  const addResource = () => {
    if (!title.trim()) return;
    const palette = ['#5f8dff', '#35d6b5', '#ffba5f', '#ff6c78'];
    updateData({
      resources: [...data.resources, {
        id: crypto.randomUUID(),
        title: title.trim(),
        tag: link.trim(),
        color: palette[data.resources.length % palette.length],
      }],
    });
    setTitle('');
    setLink('');
  };

  const editResource = (resourceId: string) => {
    const resource = data.resources.find(item => item.id === resourceId);
    if (!resource) return;
    const nextTitle = window.prompt('Edit resource title', resource.title)?.trim();
    if (!nextTitle) return;
    const nextLink = window.prompt('Edit resource link', resource.tag)?.trim();
    updateData({
      resources: data.resources.map(item =>
        item.id === resourceId ? { ...item, title: nextTitle, tag: nextLink !== undefined ? nextLink : item.tag } : item
      ),
    });
  };

  const deleteResource = (resourceId: string) =>
    updateData({ resources: data.resources.filter(item => item.id !== resourceId) });

  const moveResource = (resourceId: string, direction: -1 | 1) => {
    const idx = data.resources.findIndex(item => item.id === resourceId);
    const next = idx + direction;
    if (idx < 0 || next < 0 || next >= data.resources.length) return;
    const arr = [...data.resources];
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    updateData({ resources: arr });
  };

  return (
    <div className="card widget-card resources-card flex flex-col min-h-[500px] lg:min-h-[600px] h-auto lg:h-[calc(100vh-16rem)]">
      <div className="card-title shrink-0">Quick resources</div>

      {data.resources.length === 0 && (
        <div className="empty-state">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect x="4" y="6" width="22" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 12h10M10 17h10M10 22h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="30" cy="30" r="8" fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M30 26v8M26 30h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p>No resources yet. Add links, notes, or references.</p>
        </div>
      )}

      <div className="resources-list flex-1 overflow-y-auto scrollbar-hide hover-scrollbar min-h-0 space-y-3" onWheel={scrollOnHover}>
        {data.resources.map(res => (
          <div key={res.id} className="resource-item shrink-0 group relative bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-2xl p-4 transition-colors flex items-center gap-3">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: res.color }} />
            <div className="flex-1 min-w-0 pr-2">
              <span className="text-sm font-medium text-slate-200 block break-words whitespace-normal">{res.title}</span>
              {res.tag && (
                <a
                  href={res.tag.startsWith('http') ? res.tag : `https://${res.tag}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-electric-violet hover:text-neon-cyan transition-colors block break-all whitespace-normal mt-0.5 underline"
                >
                  {res.tag}
                </a>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button type="button" className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors" aria-label={`Move up`} onClick={() => moveResource(res.id, -1)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
              </button>
              <button type="button" className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors" aria-label={`Move down`} onClick={() => moveResource(res.id, 1)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <button type="button" className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors" aria-label={`Edit`} onClick={() => editResource(res.id)}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button type="button" className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] hover:bg-rose-500/20 flex items-center justify-center text-[var(--text-muted)] hover:text-rose-500 transition-colors" aria-label={`Delete`} onClick={() => deleteResource(res.id)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
        <div className="add-reminder-row shrink-0 mt-4">
          <input type="text" placeholder="resource title" className="add-reminder-input" value={title} onChange={e => setTitle(e.target.value)} />
          <input type="text" placeholder="link (url)" className="add-reminder-input" value={link} onChange={e => setLink(e.target.value)} />
        </div>
        <button type="button" className="widget-btn shrink-0 mt-3" onClick={addResource}>+ add resource</button>
      </div>
    </div>
  );
};

export const ToDoList: React.FC = () => {
  const { data, updateData } = useData();
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    const text = newTodo.trim();
    if (!text) return;
    updateData({
      todos: [{
        id: crypto.randomUUID(),
        text,
        completed: false,
      }, ...data.todos],
    });
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    updateData({
      todos: data.todos.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    });
  };

  const deleteTodo = (id: string) =>
    updateData({ todos: data.todos.filter(item => item.id !== id) });

  return (
    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-10 min-h-[500px] lg:min-h-[600px] h-auto lg:h-[calc(100vh-16rem)] flex flex-col shadow-card relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-violet/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 z-10 shrink-0 gap-4">
        <div>
          <h2 className="text-4xl font-display font-bold text-white tracking-wide">Tasks</h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">Manage your action items and stay productive.</p>
        </div>
        <div className="flex items-center gap-4 shrink-0 self-start sm:self-auto flex-wrap">
          <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer hover:text-white transition-colors bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 group">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-300 ${data.dailyTodoEnabled ? 'bg-electric-violet border-electric-violet text-white shadow-glow-violet' : 'border border-slate-500 bg-black/20 text-transparent group-hover:border-electric-violet/50'}`}>
              <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${data.dailyTodoEnabled ? 'scale-100' : 'scale-50 opacity-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium tracking-wide">Daily to do</span>
            <input
              type="checkbox"
              className="hidden"
              checked={data.dailyTodoEnabled || false}
              onChange={(e) => updateData({ dailyTodoEnabled: e.target.checked })}
            />
          </label>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-electric-violet bg-electric-violet/10 px-5 py-2.5 rounded-2xl border border-electric-violet/20 shadow-[0_0_15px_rgba(124,58,237,0.15)]">
            {data.todos.filter(t => t.completed).length} / {data.todos.length} Done
          </div>
        </div>
      </div>

      <div className="mb-8 z-10 shrink-0">
        <div className="relative group/input">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-neon-cyan group-focus-within/input:text-electric-violet transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </div>
          <input
            type="text"
            placeholder="Add a new task... (Press Enter)"
            className="w-full bg-black/20 border border-white/10 rounded-2xl pl-14 pr-24 py-5 text-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:bg-white/[0.03] focus:border-electric-violet/50 focus:ring-1 focus:ring-electric-violet/50 shadow-inner transition-all"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
          />
          <button
            type="button"
            className="absolute inset-y-2 right-2 bg-white/5 hover:bg-electric-violet/20 text-electric-violet hover:text-white rounded-xl px-5 font-bold tracking-wide transition-all active:scale-[0.95]"
            aria-label="Add task"
            onClick={addTodo}
          >
            Add
          </button>
        </div>
      </div>

      {data.todos.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center opacity-50 z-10">
          <svg className="w-16 h-16 text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <p className="text-lg">No tasks yet. Add one above!</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide hover-scrollbar min-h-0 z-10 space-y-3 lg:pr-2">
        {data.todos.map(todo => (
          <div
            key={todo.id}
            className={`group flex items-center gap-5 bg-white/[0.02] border border-white/5 p-5 rounded-2xl transition-all duration-300 hover:bg-white/[0.05] ${todo.completed ? 'opacity-60' : 'hover:border-white/10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_20px_-4px_rgba(124,58,237,0.15)]'}`}
          >
            <button
              type="button"
              onClick={() => toggleTodo(todo.id)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300 ${todo.completed ? 'bg-electric-violet border-electric-violet text-white shadow-glow-violet scale-95' : 'bg-black/20 border-white/20 text-transparent hover:border-electric-violet/50 hover:bg-electric-violet/10'}`}
            >
              <svg className={`w-4 h-4 transition-transform duration-300 ${todo.completed ? 'scale-100' : 'scale-50 opacity-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </button>
            <span className={`flex-1 text-lg transition-all duration-300 ${todo.completed ? 'line-through text-slate-500 decoration-slate-500/50' : 'text-slate-200'}`}>
              {todo.text}
            </span>
            <button
              type="button"
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
              aria-label="Delete"
              onClick={() => deleteTodo(todo.id)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * CalendarWidget — local monthly study overview.
 * Stripped of all Google Calendar sync (no OAuth, no upcoming events, no plan-tomorrow button).
 * Keeps: monthly calendar grid, selected-day stats, hour-logging buttons.
 */
export const CalendarWidget: React.FC = () => {
  const { data, logStudySession } = useData();
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  const todayKey = toDateKey(today);
  const baseMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const [selectedDate, setSelectedDate] = useState<string>(() => todayKey);

  const monthLabel = baseMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const daysInMonth = new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1, 0).getDate();
  const firstWeekday = new Date(baseMonth.getFullYear(), baseMonth.getMonth(), 1).getDay();
  const prevMonthLastDay = new Date(baseMonth.getFullYear(), baseMonth.getMonth(), 0).getDate();

  const prevMonthDays = Array.from({ length: firstWeekday }, (_, idx) => prevMonthLastDay - firstWeekday + idx + 1);
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDays = Array.from({ length: (7 - (totalCells % 7 || 7)) % 7 }, (_, i) => i + 1);

  const selectedStudyHours = data.activityData[selectedDate] ?? 0;
  const selectedBreakHours = selectedStudyHours * 0.2;
  const focusRatio = selectedStudyHours > 0
    ? Math.round((selectedStudyHours / (selectedStudyHours + selectedBreakHours)) * 100)
    : 0;

  const hoursToClass = (hours: number) => {
    if (hours >= 6) return 'cal-level-3';
    if (hours >= 3) return 'cal-level-2';
    if (hours > 0) return 'cal-level-1';
    return '';
  };

  const dateKeyFor = (day: number) =>
    toDateKey(new Date(baseMonth.getFullYear(), baseMonth.getMonth(), day));

  const setSelectedHours = async (hours: number) => {
    await logStudySession({
      source: 'heatmap',
      dateKey: selectedDate,
      hours: Number(hours.toFixed(1)),
    });
  };

  return (
    <div className="card widget-card calendar-card">
      <div className="calendar-topline">Monthly Overview</div>

      <div className="calendar-header">
        <button type="button" className="cal-nav" aria-label="Previous month" onClick={() => setMonthOffset(prev => prev - 1)}>&lt;</button>
        <div className="cal-month">{monthLabel}</div>
        <button type="button" className="cal-nav" aria-label="Next month" onClick={() => setMonthOffset(prev => prev + 1)}>&gt;</button>
      </div>

      <div className="calendar-grid">
        {days.map(d => <div key={d} className="cal-day-name">{d}</div>)}

        {prevMonthDays.map(d => <div key={`prev-${d}`} className="cal-date cal-muted">{d}</div>)}

        {currentMonthDays.map(d => {
          const dateKey = dateKeyFor(d);
          const isFuture = dateKey > todayKey;
          const hours = data.activityData[dateKey] ?? 0;
          let extraClass = `cal-date ${hoursToClass(hours)}`;
          if (selectedDate === dateKey) extraClass += ' cal-selected';
          if (isFuture) extraClass += ' opacity-30 cursor-not-allowed';
          return (
            <div key={`day-${d}`} className={extraClass} onClick={() => { if (!isFuture) setSelectedDate(dateKey); }}>
              {d}
            </div>
          );
        })}

        {nextMonthDays.map(d => <div key={`next-${d}`} className="cal-date cal-muted">{d}</div>)}
      </div>

      <div className="calendar-legend">
        <span><i className="lg-0" /> 0h</span>
        <span><i className="lg-1" /> 1-3h</span>
        <span><i className="lg-2" /> 3-6h</span>
        <span><i className="lg-3" /> 6+h</span>
      </div>

      <div className="selected-day-card">
        <div className="selected-day-header">
          <div>
            <small>Selected day</small>
            <p>{new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
          </div>
          <span>{selectedStudyHours > 0 ? 'Active' : 'Idle'}</span>
        </div>

        <div className="selected-metrics">
          <div>
            <small>Study</small>
            <strong>{selectedStudyHours.toFixed(1)}h</strong>
          </div>
          <div>
            <small>Break</small>
            <strong>{selectedBreakHours.toFixed(1)}h</strong>
          </div>
          <div>
            <small>Focus ratio</small>
            <strong>{focusRatio}%</strong>
          </div>
        </div>

        <div className="selected-hours-grid" style={{ marginTop: '10px' }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(hours => (
            <button
              key={hours}
              type="button"
              className={`widget-btn selected-hours-btn ${selectedStudyHours === hours ? 'active-hours' : ''}`}
              aria-label={`Log ${hours} hours for ${new Date(`${selectedDate}T00:00:00`).toLocaleDateString()}`}
              onClick={() => setSelectedHours(hours)}
            >
              {hours}h
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
