import React from 'react';
import { useData } from '../context/DataContext';
import './Widgets.css';
import './Phase8Widgets.css';

export const Resources: React.FC = () => {
  const { data } = useData();

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
        <button className="add-resource-btn">+ add resource</button>
      </div>
    </div>
  );
};

export const Reminders: React.FC = () => {
  const { data } = useData();

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
              <button className="widget-btn">dismiss</button>
            </div>
          </div>
        ))}
      </div>
      <div className="add-reminder-row">
        <input type="text" placeholder="add a reminder..." className="add-reminder-input" />
        <button className="widget-btn add-btn">+</button>
      </div>
    </div>
  );
};

export const CalendarWidget: React.FC = () => {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const prevMonthDays = [29, 30, 31];
  const currentMonthDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const nextMonthDays = [1, 2];

  return (
    <div className="card widget-card calendar-card">
      <div className="calendar-topline">Monthly Overview</div>

      <div className="calendar-header">
        <button className="cal-nav" aria-label="Previous month">&lt;</button>
        <div className="cal-month">April 2026</div>
        <button className="cal-nav" aria-label="Next month">&gt;</button>
      </div>

      <div className="calendar-grid">
        {days.map(d => <div key={d} className="cal-day-name">{d}</div>)}

        {prevMonthDays.map(d => (
          <div key={`prev-${d}`} className="cal-date cal-muted">{d}</div>
        ))}

        {currentMonthDays.map(d => {
          let extraClass = 'cal-date';
          if (d >= 1 && d <= 12) extraClass += ' cal-active';
          if (d === 12) extraClass += ' cal-selected';
          if (d === 4 || d === 9 || d === 11) extraClass += ' cal-intense';

          return (
            <div key={`day-${d}`} className={extraClass}>
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
            <p>Sun, 12 Apr</p>
          </div>
          <span>Active</span>
        </div>

        <div className="selected-metrics">
          <div>
            <small>Study</small>
            <strong>8h 40m</strong>
          </div>
          <div>
            <small>Break</small>
            <strong>1h 5m</strong>
          </div>
          <div>
            <small>Focus ratio</small>
            <strong>89%</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
