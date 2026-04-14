import React, { useState } from 'react';
import './StudyComparison.css';

type Timeframe = 'weekly' | 'monthly' | 'yearly';

const StudyComparison: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('weekly');

  // Dummy data based on reference image
  const dataMap = {
    weekly: [
      { label: 'Mon', value: 2.5, max: 6 },
      { label: 'Tue', value: 4, max: 6 },
      { label: 'Wed', value: 1.5, max: 6 },
      { label: 'Thu', value: 6, max: 6 },
      { label: 'Fri', value: 5.5, max: 6 },
      { label: 'Sat', value: 3, max: 6 },
      { label: 'Sun', value: 4.5, max: 6 },
    ],
    monthly: [
      { label: 'Week 1', value: 14, max: 40 },
      { label: 'Week 2', value: 22, max: 40 },
      { label: 'Week 3', value: 35, max: 40 },
      { label: 'Week 4', value: 28, max: 40 },
    ],
    yearly: [
      { label: 'Q1', value: 120, max: 200 },
      { label: 'Q2', value: 180, max: 200 },
      { label: 'Q3', value: 150, max: 200 },
      { label: 'Q4', value: 195, max: 200 },
    ]
  };

  const currentData = dataMap[timeframe];

  return (
    <div className="card comparison-container">
      <div className="card-title">STUDY HOURS — COMPARISON</div>
      
      <div className="toggle-group">
        <button 
          className={`toggle-btn ${timeframe === 'weekly' ? 'active' : ''}`}
          onClick={() => setTimeframe('weekly')}
        >
          weekly
        </button>
        <button 
          className={`toggle-btn ${timeframe === 'monthly' ? 'active' : ''}`}
          onClick={() => setTimeframe('monthly')}
        >
          monthly
        </button>
        <button 
          className={`toggle-btn ${timeframe === 'yearly' ? 'active' : ''}`}
          onClick={() => setTimeframe('yearly')}
        >
          yearly
        </button>
      </div>

      <div className="bars-container">
        {currentData.map((item, index) => {
          const widthPercent = (item.value / item.max) * 100;
          return (
            <div key={index} className="bar-row">
              <div className="bar-label">{item.label}</div>
              <div className="bar-track">
                <div 
                  className="bar-fill" 
                  style={{ width: `${widthPercent}%` }}
                ></div>
              </div>
              <div className="bar-value">{item.value}h</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudyComparison;
