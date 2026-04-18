import React from 'react';
import './Heatmap.css';

const Heatmap: React.FC = () => {
  const trendPoints = [58, 60, 61, 63, 66, 68, 70];
  const focusBars = [6.2, 6.5, 7.3, 7.6, 8, 8.1, 8.4];

  return (
    <section className="card heatmap-container">
      <div className="heatmap-title-row">
        <h3>Weekly Rhythm</h3>
        <span>06 Apr - 12 Apr</span>
      </div>

      <div className="rhythm-metrics">
        <div className="rhythm-chip">
          <span>Study time</span>
          <strong>52.5h</strong>
        </div>
        <div className="rhythm-chip">
          <span>Break time</span>
          <strong>6h</strong>
        </div>
        <div className="rhythm-chip">
          <span>Active days</span>
          <strong>7/7</strong>
        </div>
        <div className="rhythm-chip">
          <span>Best day</span>
          <strong>Sun</strong>
        </div>
      </div>

      <div className="rhythm-panels">
        <article className="rhythm-panel">
          <div className="panel-label">Study hours trend</div>
          <div className="trend-line" aria-hidden="true">
            {trendPoints.map((point, idx) => (
              <div key={idx} className="trend-node" style={{ left: `${idx * 15}%`, bottom: `${point}%` }}></div>
            ))}
          </div>
        </article>

        <article className="rhythm-panel">
          <div className="panel-label">Daily focus bars</div>
          <div className="focus-bars">
            {focusBars.map((bar, idx) => (
              <div key={idx} className="focus-column">
                <span>{bar}h</span>
                <div className="focus-column-fill" style={{ height: `${bar * 11}%` }}></div>
              </div>
            ))}
          </div>
          <div className="focus-days">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <span key={`${day}-${idx}`}>{day}</span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export default Heatmap;
