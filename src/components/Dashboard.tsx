import React from 'react';
import { useData } from '../context/DataContext';
import TopStats from './TopStats';
import Heatmap from './Heatmap';

const Dashboard: React.FC = () => {
  const { data, logout } = useData();

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="logo">
          study<span>arc</span>
        </div>
        
        <div className="nav-pill-group">
          <button className="nav-pill active">dashboard</button>
          <button className="nav-pill">notes</button>
          <button className="nav-pill">settings</button>
        </div>

        <div 
          className="profile-avatar" 
          onClick={logout} 
          title="Click to logout" 
          style={{ cursor: 'pointer' }}
        >
          {data.user?.avatar || 'AK'}
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <main className="dashboard-grid">
        <TopStats />
        <Heatmap />
      </main>
    </div>
  );
};

export default Dashboard;
