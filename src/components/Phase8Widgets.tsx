import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { toDateKey } from '../lib/studyLogic';
import { scrollOnHover } from '../lib/utils';
import './Widgets.css';
import './Phase8Widgets.css';

export const Resources: React.FC = () => {
  const { data, updateData } = useData();
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');

  const addResource = () => {
    if (!title.trim()) return;
    const palette = ['#5f8dff', '#35d6b5', '#ffba5f', '#ff6c78'];
    updateData({
      resources: [...data.resources, {
        id: crypto.randomUUID(),
        title: title.trim(),
        tag: tag.trim() || 'General',
        color: palette[data.resources.length % palette.length],
      }],
    });
    setTitle('');
    setTag('');
  };

  const editResource = (resourceId: string) => {
    const resource = data.resources.find(item => item.id === resourceId);
    if (!resource) return;
    const nextTitle = window.prompt('Edit resource title', resource.title)?.trim();
    if (!nextTitle) return;
    const nextTag = window.prompt('Edit resource tag', resource.tag)?.trim();
    updateData({
      resources: data.resources.map(item =>
        item.id === resourceId ? { ...item, title: nextTitle, tag: nextTag || item.tag } : item
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
    <div className="card widget-card resources-card flex flex-col h-[400px]">
      <div className="card-title shrink-0">Quick resources</div>

      {data.resources.length === 0 && (
        <div className="empty-state">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect x="4" y="6" width="22" height="28" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 12h10M10 17h10M10 22h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="30" cy="30" r="8" fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M30 26v8M26 30h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
              {res.tag && <span className="text-xs text-slate-500 block break-all whitespace-normal mt-0.5">{res.tag}</span>}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button type="button" className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors" aria-label={`Move up`} onClick={() => moveResource(res.id, -1)}>↑</button>
              <button type="button" className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors" aria-label={`Move down`} onClick={() => moveResource(res.id, 1)}>↓</button>
              <button type="button" className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-xs font-bold" onClick={() => editResource(res.id)}>EDIT</button>
              <button type="button" className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors text-xs font-bold" onClick={() => deleteResource(res.id)}>DEL</button>
            </div>
          </div>
        ))}
        <div className="add-reminder-row shrink-0 mt-4">
          <input type="text" placeholder="resource title" className="add-reminder-input" value={title} onChange={e => setTitle(e.target.value)} />
          <input type="text" placeholder="tag" className="add-reminder-input" value={tag} onChange={e => setTag(e.target.value)} />
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
    <div className="card widget-card reminders-card flex flex-col h-[400px]">
      <div className="card-title shrink-0">To-Do List</div>

      {data.todos.length === 0 && (
        <div className="empty-state shrink-0">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>No tasks yet. Add one below!</p>
        </div>
      )}

      <div className="reminders-list flex-1 overflow-y-auto scrollbar-hide hover-scrollbar min-h-0 space-y-3" onWheel={scrollOnHover}>
        {data.todos.map(todo => (
          <div key={todo.id} className="shrink-0 flex items-center gap-3 bg-white/[0.02] border border-white/10 p-3 rounded-xl transition-colors hover:bg-white/[0.04]">
            <input 
              type="checkbox" 
              checked={todo.completed} 
              onChange={() => toggleTodo(todo.id)}
              className="w-4 h-4 rounded border-white/20 bg-black/20 text-electric-violet focus:ring-electric-violet cursor-pointer shrink-0"
            />
            <span className={todo.completed ? 'line-through text-slate-500 flex-1 text-sm break-words whitespace-normal' : 'text-slate-200 flex-1 text-sm break-words whitespace-normal'}>
              {todo.text}
            </span>
            <button type="button" className="text-slate-500 hover:text-red-400 transition-colors shrink-0 px-2" aria-label="Delete" onClick={() => deleteTodo(todo.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="add-reminder-row shrink-0 mt-4">
        <input 
          type="text" 
          placeholder="Add a new task..." 
          className="add-reminder-input" 
          value={newTodo} 
          onChange={e => setNewTodo(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && addTodo()}
        />
        <button type="button" className="widget-btn add-btn" aria-label="Add task" onClick={addTodo}>+</button>
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
  const baseMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const [selectedDate, setSelectedDate] = useState<string>(() => toDateKey(today));

  const monthLabel = baseMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const daysInMonth    = new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1, 0).getDate();
  const firstWeekday   = new Date(baseMonth.getFullYear(), baseMonth.getMonth(), 1).getDay();
  const prevMonthLastDay = new Date(baseMonth.getFullYear(), baseMonth.getMonth(), 0).getDate();

  const prevMonthDays    = Array.from({ length: firstWeekday }, (_, idx) => prevMonthLastDay - firstWeekday + idx + 1);
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells       = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDays    = Array.from({ length: (7 - (totalCells % 7 || 7)) % 7 }, (_, i) => i + 1);

  const selectedStudyHours  = data.activityData[selectedDate] ?? 0;
  const selectedBreakHours  = selectedStudyHours * 0.2;
  const focusRatio          = selectedStudyHours > 0
    ? Math.round((selectedStudyHours / (selectedStudyHours + selectedBreakHours)) * 100)
    : 0;

  const hoursToClass = (hours: number) => {
    if (hours >= 6) return 'cal-intense';
    if (hours > 0)  return 'cal-active';
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
          const hours   = data.activityData[dateKey] ?? 0;
          let extraClass = `cal-date ${hoursToClass(hours)}`;
          if (selectedDate === dateKey) extraClass += ' cal-selected';
          return (
            <div key={`day-${d}`} className={extraClass} onClick={() => setSelectedDate(dateKey)}>
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
