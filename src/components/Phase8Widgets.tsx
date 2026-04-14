import React from 'react';
import { useData } from '../context/DataContext';
import './Widgets.css';
import './Phase8Widgets.css';

export const Resources: React.FC = () => {
  const { data } = useData();

  return (
    <div className="card widget-card resources-card">
      <div className="card-title">RESOURCES &amp; LINKS</div>
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
      <div className="card-title">REMINDERS</div>
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
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="card widget-card calendar-card">
      <div className="card-title">CALENDAR &amp; IMPORTANT DATES</div>
      
      <div className="calendar-header">
        <button className="cal-nav">&lt;</button>
        <div className="cal-month">April 2026</div>
        <button className="cal-nav">&gt;</button>
      </div>

      <div className="calendar-grid">
        {days.map(d => <div key={d} className="cal-day-name">{d}</div>)}
        <div className="cal-empty"></div>
        <div className="cal-empty"></div>
        <div className="cal-empty"></div>
        {dates.map(d => {
          let extraClass = '';
          if (d === 14) extraClass = 'cal-today';
          if (d === 26) extraClass = 'cal-event-bg';
          if (d === 28 || d === 30) extraClass = 'cal-event-dot';
          
          return (
            <div key={d} className={`cal-date ${extraClass}`}>
              {d}
            </div>
          );
        })}
      </div>
      
      <div className="calendar-footer">
        <select className="cal-select">
          <option>study</option>
          <option>exams</option>
        </select>
        <button className="widget-btn add-btn">+ add</button>
      </div>
    </div>
  );
};
