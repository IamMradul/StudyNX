import React from 'react';
import './TopStats.css';

const TopStats: React.FC = () => {
  return (
    <div className="top-stats-container">
      <div className="card stat-card">
        <div className="stat-value">
          <span className="flame-icon">🔥</span> 12
        </div>
        <div className="stat-label">day streak</div>
      </div>
      
      <div className="card stat-card">
        <div className="stat-value">38.5</div>
        <div className="stat-label">hrs this month</div>
      </div>
      
      <div className="card stat-card">
        <div className="stat-value">5</div>
        <div className="stat-label">subjects active</div>
      </div>
      
      <div className="card stat-card">
        <div className="stat-value">3</div>
        <div className="stat-label">sessions today</div>
      </div>
    </div>
  );
};

export default TopStats;
