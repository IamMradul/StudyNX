import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import './Widgets.css';
import './Phase8Widgets.css';

export const Resources: React.FC = () => {
  const { data, updateData } = useData();
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');

  const addResource = () => {
    if (!title.trim()) return;

    const palette = ['#5f8dff', '#35d6b5', '#ffba5f', '#ff6c78'];
    const next = {
      id: crypto.randomUUID(),
      title: title.trim(),
      tag: tag.trim() || 'General',
      color: palette[data.resources.length % palette.length],
    };

    updateData({ resources: [...data.resources, next] });
    setTitle('');
    setTag('');
  };

  return (
    <div className="card widget-card resources-card">
      <div className="card-title">Quick resources</div>
      <div className="resources-list">
        {data.resources.map(res => (
          <div key={res.id} className="resource-item">
            <span className="resource-dot" style={{ backgroundColor: res.color }}></span>
            <span className="resource-title">{res.title}</span>
            <span className="resource-tag">{res.tag}</span>
          </div>
        ))}
        <div className="add-reminder-row">
          <input
            type="text"
            placeholder="resource title"
            className="add-reminder-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="tag"
            className="add-reminder-input"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>
        <button className="add-resource-btn" onClick={addResource}>+ add resource</button>
      </div>
    </div>
  );
};

export const Reminders: React.FC = () => {
  const { data, updateData } = useData();
  const [newReminder, setNewReminder] = useState('');

  const dismissReminder = (id: string) => {
    updateData({ reminders: data.reminders.filter(rem => rem.id !== id) });
  };

  const addReminder = () => {
    const description = newReminder.trim();
    if (!description) return;

    updateData({
      reminders: [
        {
          id: crypto.randomUUID(),
          title: 'Custom reminder',
          description,
          timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'info',
        },
        ...data.reminders,
      ],
    });
    setNewReminder('');
  };

  return (
    <div className="card widget-card reminders-card">
      <div className="card-title">Reminders</div>
      <div className="reminders-list">
        {data.reminders.map(rem => (
          <div key={rem.id} className={`reminder-item type-${rem.type}`}>
            <div className="reminder-header">
              <span className="reminder-title">{rem.title}</span>
              <span className="reminder-time">{rem.timeStr}</span>
            </div>
            <div className="reminder-desc">{rem.description}</div>
            <div className="reminder-actions">
              <button className="widget-btn" onClick={() => dismissReminder(rem.id)}>dismiss</button>
            </div>
          </div>
        ))}
      </div>
      <div className="add-reminder-row">
        <input
          type="text"
          placeholder="add a reminder..."
          className="add-reminder-input"
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
        />
        <button className="widget-btn add-btn" onClick={addReminder}>+</button>
      </div>
    </div>
  );
};

export const CalendarWidget: React.FC = () => {
  const { data, updateData } = useData();
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  const baseMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const [selectedDate, setSelectedDate] = useState<string>(() => today.toISOString().slice(0, 10));

  const monthLabel = baseMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const daysInMonth = new Date(baseMonth.getFullYear(), baseMonth.getMonth() + 1, 0).getDate();
  const firstWeekday = new Date(baseMonth.getFullYear(), baseMonth.getMonth(), 1).getDay();
  const prevMonthLastDay = new Date(baseMonth.getFullYear(), baseMonth.getMonth(), 0).getDate();

  const prevMonthDays = Array.from({ length: firstWeekday }, (_, idx) => prevMonthLastDay - firstWeekday + idx + 1);
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDays = Array.from({ length: (7 - (totalCells % 7 || 7)) % 7 }, (_, i) => i + 1);

  const selectedLevel = data.activityData[selectedDate] ?? 0;
  const selectedStudyHours = selectedLevel * 1.5;
  const selectedBreakHours = selectedLevel * 0.3;
  const focusRatio = selectedStudyHours > 0
    ? Math.round((selectedStudyHours / (selectedStudyHours + selectedBreakHours)) * 100)
    : 0;

  const levelToClass = (level: number) => {
    if (level >= 4) return 'cal-intense';
    if (level >= 3) return 'cal-active';
    if (level >= 2) return 'cal-active';
    if (level >= 1) return 'cal-active';
    return '';
  };

  const dateKeyFor = (day: number) => new Date(baseMonth.getFullYear(), baseMonth.getMonth(), day).toISOString().slice(0, 10);

  const setSelectedLevel = (level: number) => {
    const nextActivityData = { ...data.activityData };
    if (level <= 0) {
      delete nextActivityData[selectedDate];
    } else {
      nextActivityData[selectedDate] = level;
    }
    updateData({ activityData: nextActivityData });
  };

  return (
    <div className="card widget-card calendar-card">
      <div className="calendar-topline">Monthly Overview</div>

      <div className="calendar-header">
        <button className="cal-nav" aria-label="Previous month" onClick={() => setMonthOffset((prev) => prev - 1)}>&lt;</button>
        <div className="cal-month">{monthLabel}</div>
        <button className="cal-nav" aria-label="Next month" onClick={() => setMonthOffset((prev) => prev + 1)}>&gt;</button>
      </div>

      <div className="calendar-grid">
        {days.map(d => <div key={d} className="cal-day-name">{d}</div>)}

        {prevMonthDays.map(d => (
          <div key={`prev-${d}`} className="cal-date cal-muted">{d}</div>
        ))}

        {currentMonthDays.map(d => {
          const dateKey = dateKeyFor(d);
          const level = data.activityData[dateKey] ?? 0;
          let extraClass = `cal-date ${levelToClass(level)}`;
          if (selectedDate === dateKey) extraClass += ' cal-selected';

          return (
            <div key={`day-${d}`} className={extraClass} onClick={() => setSelectedDate(dateKey)}>
              {d}
            </div>
          );
        })}

        {nextMonthDays.map(d => (
          <div key={`next-${d}`} className="cal-date cal-muted">{d}</div>
        ))}
      </div>

      <div className="calendar-legend">
        <span><i className="lg-0"></i> 0-1h</span>
        <span><i className="lg-1"></i> 1-2h</span>
        <span><i className="lg-2"></i> 2-3h</span>
        <span><i className="lg-3"></i> 3+h</span>
      </div>

      <div className="selected-day-card">
        <div className="selected-day-header">
          <div>
            <small>Selected day</small>
            <p>{new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
          </div>
          <span>{selectedLevel > 0 ? 'Active' : 'Idle'}</span>
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

        <div className="add-reminder-row" style={{ marginTop: '10px' }}>
          {[0, 1, 2, 3, 4].map(level => (
            <button key={level} className="widget-btn" onClick={() => setSelectedLevel(level)}>{level}</button>
          ))}
        </div>
      </div>
    </div>
  );
};
