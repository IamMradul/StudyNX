import React from 'react';
import { useData } from '../context/DataContext';
import { toDateKey } from '../lib/studyLogic';
import TopStats from './TopStats';
import Heatmap from './Heatmap';
import SubjectsList from './SubjectsList';
import StudyComparison from './StudyComparison';
import { Pomodoro, ExamCountdown, WeeklyGoal } from './Phase7Widgets';
import { Resources, Reminders, CalendarWidget } from './Phase8Widgets';
import InsightsPanel from './InsightsPanel';
import ThemeToggle from './ThemeToggle';
import StreakBadge from './StreakBadge';
import DailyGoal from './DailyGoal';
import ExportReport from './ExportReport';
import AnalyticsDashboard from './AnalyticsDashboard';

type DashboardTab = 'overview' | 'sessions' | 'insights';

const dashboardTabs: Array<{ id: DashboardTab; label: string; description: string }> = [
  { id: 'overview', label: 'Overview', description: 'Your main dashboard view' },
  { id: 'sessions', label: 'Sessions', description: 'Focus blocks and study logs' },
  { id: 'insights', label: 'Insights', description: 'Trends and export tools' },
];

const Dashboard: React.FC = () => {
  const { data, logout, requestAuthPrompt } = useData();
  const [activeTab, setActiveTab] = React.useState<DashboardTab>('overview');

  React.useEffect(() => {
    const titleSuffix = activeTab === 'overview'
      ? 'Dashboard'
      : activeTab === 'sessions'
        ? 'Sessions'
        : 'Insights';

    document.title = `StudyNX | ${titleSuffix}`;
  }, [activeTab]);

  const now = new Date();
  const todayKey = toDateKey(now);
  const todayHours = data.activityData[todayKey] ?? 0;
  const weeklyHours = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    return data.activityData[toDateKey(date)] ?? 0;
  }).reduce((sum, hours) => sum + hours, 0);
  const weeklyProgress = Math.min(100, Math.round((weeklyHours / Math.max(1, data.weeklyTargetHours)) * 100));
  const currentStreak = (() => {
    let streak = 0;
    const cursor = new Date(now);

    while ((data.activityData[toDateKey(cursor)] ?? 0) > 0) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  })();
  const sessionCount = data.sessionLogs.length;
  const heroTitle = data.isLoggedIn ? `Welcome back${data.user?.name ? `, ${data.user.name}` : ''}` : 'Your study workspace';
  const heroDescription = data.isLoggedIn
    ? 'Keep your study momentum organized with a cleaner overview, faster navigation, and clear next actions.'
    : 'Review your progress, manage focus sessions, and sign in when you are ready to save everything.';

  return (
    <div className="app-container">
      <nav className="top-nav" aria-label="Main navigation">
        {/* Brand */}
        <a className="logo" href="/" aria-label="StudyNX home">
          <img src="/StudyNX.png" alt="StudyNX logo" className="logo-mark" />
          <span>StudyNX</span>
        </a>

        {/* Tab pills */}
        <div className="nav-pill-group" role="tablist" aria-label="Dashboard views">
          {dashboardTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`nav-pill ${activeTab === tab.id ? 'active' : ''}`}
              title={tab.description}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right-side controls */}
        <div className="nav-right">
          <StreakBadge />
          <ThemeToggle />
          {data.isLoggedIn ? (
            <button
              type="button"
              className="profile-avatar profile-button"
              onClick={logout}
              aria-label="Log out of StudyNX"
              title="Click to logout"
            >
              {data.user?.avatar || 'SN'}
            </button>
          ) : (
            <button
              type="button"
              className="profile-avatar profile-button profile-signin-button"
              onClick={() => requestAuthPrompt('Sign in to save your changes.')}
              aria-label="Sign in to StudyNX"
              title="Click to sign in"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      <header className="dashboard-hero card" aria-label="Study dashboard summary">
        <div className="dashboard-hero-copy">
          <p className="dashboard-eyebrow">Study tracker</p>
          <h1>{heroTitle}</h1>
          <p className="dashboard-hero-text">{heroDescription}</p>

          <div className="dashboard-hero-actions" aria-label="Quick actions">
            {dashboardTabs.map((tab) => (
              <button
                key={`hero-${tab.id}`}
                type="button"
                className={`hero-action ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}

            {!data.isLoggedIn && (
              <button
                type="button"
                className="hero-action hero-action-secondary"
                onClick={() => requestAuthPrompt('Sign in to save your dashboard changes.')}
              >
                Sign in to sync
              </button>
            )}
          </div>
        </div>

        <div className="dashboard-hero-metrics">
          <article className="hero-metric-card">
            <span>Today</span>
            <strong>{todayHours.toFixed(1)}h</strong>
            <small>Logged so far</small>
          </article>

          <article className="hero-metric-card">
            <span>Weekly progress</span>
            <strong>{weeklyProgress}%</strong>
            <small>{weeklyHours.toFixed(1)}h of {data.weeklyTargetHours}h target</small>
          </article>

          <article className="hero-metric-card">
            <span>Current streak</span>
            <strong>{currentStreak} days</strong>
            <small>{sessionCount} session{sessionCount === 1 ? '' : 's'} saved</small>
          </article>
        </div>
      </header>

      {/* ── Overview tab ─────────────────────────────────── */}
      {activeTab === 'overview' && (
        <main className="dashboard-layout" role="main" aria-label="Overview dashboard">
          <section className="dashboard-main">
            <Heatmap />
            <TopStats />
            <div className="dashboard-main-grid">
              <SubjectsList />
              <StudyComparison />
              <Resources />
              <Reminders />
            </div>
          </section>

          <aside className="dashboard-sidebar" aria-label="Widgets">
            <WeeklyGoal />
            <DailyGoal />
            <Pomodoro />
            <CalendarWidget />
            <ExamCountdown />
          </aside>
        </main>
      )}

      {/* ── Sessions tab ─────────────────────────────────── */}
      {activeTab === 'sessions' && (
        <main className="dashboard-layout" role="main" aria-label="Study sessions dashboard">
          <section className="dashboard-main">
            <Heatmap />
            <CalendarWidget />
          </section>

          <aside className="dashboard-sidebar" aria-label="Widgets">
            <WeeklyGoal />
            <DailyGoal />
            <Pomodoro />
            <ExamCountdown />
          </aside>
        </main>
      )}

      {/* ── Insights tab ─────────────────────────────────── */}
      {activeTab === 'insights' && (
        <main className="dashboard-layout dashboard-layout-single" role="main" aria-label="Insights dashboard">
          <section className="dashboard-main">
            <InsightsPanel />
            <AnalyticsDashboard />
            <div className="insights-bottom-row">
              <ExportReport />
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default Dashboard;
