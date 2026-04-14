import React from 'react';
import './Heatmap.css';

const getLevelColorClass = (level: number) => {
  switch (level) {
    case 1: return 'level-1';
    case 2: return 'level-2';
    case 3: return 'level-3';
    case 4: return 'level-4';
    default: return 'level-0';
  }
};

const Header: React.FC = () => (
  <div className="card-title">ACTIVITY HEATMAP — LAST 6 MONTHS</div>
);

const Heatmap: React.FC = () => {
  
  // Generate dummy grid (Mocking 6 months of data, roughly 26 weeks, 7 days per week = 182 cells)
  // Since we have limited space, let's just make a 34x7 grid according to typical designs
  const cols = 26;
  const rows = 7;
  
  const cells = Array.from({ length: cols * rows }).map((_, i) => {
    // Generate some random looking data, but make it look like the picture with gaps
    const rand = Math.random();
    let level = 0;
    if (rand > 0.8) level = 4;
    else if (rand > 0.6) level = 3;
    else if (rand > 0.4) level = 2;
    else if (rand > 0.2) level = 1;
    
    return <div key={i} className={`heatmap-cell ${getLevelColorClass(level)}`} title={`Activity: level ${level}`} />;
  });

  return (
    <div className="card heatmap-container">
      <Header />
      <div className="heatmap-months">
        <span>Nov</span>
        <span>Dec</span>
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
      </div>
      <div className="heatmap-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}>
        {cells}
      </div>
      <div className="heatmap-legend">
        <span>less</span>
        <div className="heatmap-cell level-0"></div>
        <div className="heatmap-cell level-1"></div>
        <div className="heatmap-cell level-2"></div>
        <div className="heatmap-cell level-3"></div>
        <div className="heatmap-cell level-4"></div>
        <span>more</span>
      </div>
    </div>
  );
};

export default Heatmap;
