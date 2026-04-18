import React from 'react';
import './TopStats.css';

const TopStats: React.FC = () => {
  return (
    <section className="top-stats-container card">
      <div className="top-stats-heading">
        <h2>Today's progress</h2>
        <span>Sun, 12 Apr</span>
      </div>

      <div className="progress-layout">
        <div className="progress-primary">
          <div className="progress-ring">
            <div className="ring-center">
              <strong>8h40m</strong>
              <small>of 9h goal</small>
            </div>
          </div>
          <p className="progress-primary-label">Study time</p>
          <div className="progress-metrics">
            <div>
              <span>Focus</span>
              <strong>8h 40m</strong>
            </div>
            <div>
              <span>Break</span>
              <strong>1h 5m</strong>
            </div>
            <div>
              <span>Progress</span>
              <strong>100%</strong>
            </div>
          </div>
        </div>

        <div className="progress-secondary">
          <article className="mini-stat-card">
            <span>Focus score</span>
            <strong>94%</strong>
            <small>+18% avg</small>
          </article>
          <article className="mini-stat-card">
            <span>Sessions done</span>
            <strong>16 of 17</strong>
            <small>1 left</small>
          </article>
          <article className="mini-stat-card wide">
            <span>This week</span>
            <div className="week-bars">
              {[5, 6, 6, 7, 7, 7, 8].map((bar, idx) => (
                <div key={idx} className="week-bar" style={{ height: `${bar * 8}%` }}></div>
              ))}
            </div>
            <div className="week-days">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <span key={`${day}-${idx}`}>{day}</span>
              ))}
            </div>
          </article>
          <article className="mini-stat-card">
            <span>Streak</span>
            <strong>11 days</strong>
            <small>Active</small>
          </article>
        </div>
      </div>
    </section>
  );
};

export default TopStats;
