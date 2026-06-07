import React from 'react';
import { useData } from '../context/DataContext';
import { toDateKey } from '../lib/studyLogic';
import TopStats from './TopStats';
import Heatmap from './Heatmap';
import SubjectsList from './SubjectsList';
import StudyComparison from './StudyComparison';
import { ExamCountdown, WeeklyGoal } from './Phase7Widgets';
import { Resources, ToDoList, CalendarWidget } from './Phase8Widgets';
import ThemeToggle from './ThemeToggle';
import InsightsPanel from './InsightsPanel';
import DailyGoal from './DailyGoal';
import ExportReport from './ExportReport';
import AnalyticsDashboard from './AnalyticsDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp } from '../lib/animations';
import { cn } from '../lib/utils';

type DashboardTab = 'overview' | 'insights';

const dashboardTabs: Array<{ id: DashboardTab; label: string; description: string; icon: React.ReactNode }> = [
  { 
    id: 'overview', 
    label: 'Overview', 
    description: 'Your main dashboard view',
    icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
  },
  { 
    id: 'insights', 
    label: 'Insights', 
    description: 'Trends and export tools',
    icon: <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
  },
];

const ProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { data, logout, updatePassword } = useData();
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [feedback, setFeedback] = React.useState('');
  const [feedbackTone, setFeedbackTone] = React.useState<'success'|'error'>('success');
  const [isUpdating, setIsUpdating] = React.useState(false);

  if (!isOpen) return null;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setFeedbackTone('error');
      setFeedback('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedbackTone('error');
      setFeedback('Passwords do not match.');
      return;
    }
    
    setIsUpdating(true);
    setFeedback('');
    const res = await updatePassword(newPassword);
    setFeedbackTone(res.ok ? 'success' : 'error');
    setFeedback(res.message);
    if (res.ok) {
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsUpdating(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
        <button type="button" className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors" onClick={onClose}>
          ✕
        </button>
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-electric-violet/20 border border-electric-violet/40 flex items-center justify-center text-2xl font-bold text-electric-violet mb-3">
            {data.user?.avatar || 'SN'}
          </div>
          <h2 className="text-xl font-heading font-bold text-slate-100">{data.user?.name || 'User'}</h2>
          <p className="text-sm text-slate-400">Manage your account</p>
        </div>

        <div className="border-t border-slate-700 pt-6 mb-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Change Password</h3>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <input 
              type="password" 
              placeholder="New password" 
              className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-violet transition-all"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Confirm new password" 
              className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-violet transition-all"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={isUpdating}
              className="w-full py-2 bg-electric-violet hover:bg-electric-violet/90 text-white font-medium rounded-xl transition-all disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Update Password'}
            </button>
          </form>
          {feedback && (
            <p className={`mt-3 text-sm text-center ${feedbackTone === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {feedback}
            </p>
          )}
        </div>

        <div className="border-t border-slate-700 pt-4">
          <button 
            type="button" 
            onClick={() => { onClose(); logout(); }}
            className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium rounded-xl transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { data, requestAuthPrompt } = useData();
  const [activeTab, setActiveTab] = React.useState<DashboardTab>('overview');
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  React.useEffect(() => {
    const titleSuffix = activeTab === 'overview'
      ? 'Dashboard'
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
  const heroTitle = data.isLoggedIn ? `Welcome back${data.user?.name ? `, ${data.user.name}` : ''}` : 'Your study workspace';
  const heroDescription = data.isLoggedIn
    ? 'Keep your study momentum organized with a cleaner overview, faster navigation, and clear next actions.'
    : 'Review your progress, manage focus sessions, and sign in when you are ready to save everything.';

  return (
    <div className="flex min-h-screen bg-transparent text-slate-200 font-sans selection:bg-electric-violet/30 selection:text-white">
      {/* Sidebar */}
      <aside className="group hidden lg:flex w-20 hover:w-64 transition-all duration-300 flex-col bg-white/[0.02] backdrop-blur-2xl border-r border-white/[0.06] sticky top-0 h-screen overflow-y-auto overflow-x-hidden z-40 pb-20">
        <div className="p-6">
          <a href="/" className="flex items-center gap-2 overflow-hidden">
            <span className="font-display font-bold text-2xl flex items-center justify-center w-8 shrink-0 text-electric-violet">
              S
            </span>
            <span className="font-display font-bold text-xl tracking-widest uppercase opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300 animate-[pulse-glow_4s_infinite]">
              tudy<span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-violet to-neon-cyan">NX</span>
            </span>
          </a>
        </div>
        
        <nav className="flex-1 px-4 space-y-3 mt-4">
          {dashboardTabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all relative overflow-hidden group/btn",
                activeTab === tab.id ? "bg-white/[0.06] text-white shadow-glow-violet" : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              {activeTab === tab.id && (
                <motion.div layoutId="sidebar-active" className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full bg-gradient-to-b from-electric-violet to-neon-cyan" />
              )}
              <span className={cn("transition-colors shrink-0", activeTab === tab.id ? "text-neon-cyan" : "group-hover/btn:text-slate-200")}>
                {tab.icon}
              </span>
              <span className="font-medium text-sm tracking-wide opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300">
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 mt-auto border-t border-white/5">
          <div className="flex items-center gap-4 overflow-hidden mb-4">
            <button 
              onClick={data.isLoggedIn ? () => setIsProfileOpen(true) : () => requestAuthPrompt('Sign in to save your changes.')} 
              className="relative w-10 h-10 shrink-0 rounded-full bg-electric-violet/10 border border-electric-violet/30 flex items-center justify-center text-electric-violet font-semibold transition-all hover:scale-105 hover:shadow-glow-violet group/btn"
            >
              {data.isLoggedIn ? (data.user?.avatar || 'SN') : 'SN'}
              {data.isLoggedIn && (
                <>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#050508] rounded-full z-10" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping z-0" />
                </>
              )}
            </button>
            <div className="flex flex-col opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300">
               <span className="text-sm font-medium text-white">{data.isLoggedIn ? data.user?.name || 'User' : 'Guest'}</span>
               <span className="text-xs text-slate-400">{data.isLoggedIn ? 'Online' : 'Sign in to sync'}</span>
            </div>
          </div>
          <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
        {/* Mobile Nav Header (Visible only on small screens) */}
        <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <span className="font-display font-bold text-xl tracking-widest uppercase">
            Study<span className="text-neon-cyan">NX</span>
          </span>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button onClick={() => requestAuthPrompt()} className="text-sm font-medium text-electric-violet">
              {data.isLoggedIn ? 'Account' : 'Sign In'}
            </button>
          </div>
        </div>

        <motion.header 
          variants={fadeUp} 
          initial="initial" 
          animate="animate" 
          className="relative bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 lg:p-8 mb-8 overflow-hidden shadow-card group hover:border-white/[0.12] transition-colors"
        >
          {/* Decorative glow inside hero */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/3 group-hover:bg-neon-cyan/20 transition-colors duration-700 pointer-events-none" />
          
          <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-center">
            <div className="space-y-3">
              <p className="text-neon-cyan text-[10px] font-bold tracking-[0.2em] uppercase">Study Tracker</p>
              <h1 className="text-3xl lg:text-4xl font-display font-bold leading-tight text-white">
                {heroTitle}
              </h1>
              <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                {heroDescription}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-3 min-w-[200px]">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:-translate-y-1 hover:border-electric-violet/50 hover:shadow-glow-violet transition-all duration-300">
                <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1">Today</p>
                <div className="text-2xl font-display font-bold text-white">{todayHours.toFixed(1)}<span className="text-sm text-slate-500 ml-1">h</span></div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:-translate-y-1 hover:border-neon-cyan/50 hover:shadow-glow-cyan transition-all duration-300">
                <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1">Weekly</p>
                <div className="text-2xl font-display font-bold text-white">{weeklyProgress}<span className="text-sm text-slate-500 ml-1">%</span></div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-glow-emerald transition-all duration-300">
                <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1">Streak</p>
                <div className="text-2xl font-display font-bold text-white">{currentStreak}<span className="text-sm text-slate-500 ml-1">d</span></div>
              </div>
            </div>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={fadeUp}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-[1.66fr_0.74fr] gap-8">
                <div className="space-y-8 min-w-0">
                  <Heatmap />
                  <TopStats />
                  <div className="grid sm:grid-cols-2 gap-8">
                    <SubjectsList />
                    <StudyComparison />
                    <Resources />
                    <ToDoList />
                  </div>
                </div>
                <aside className="space-y-8 min-w-0">
                  <WeeklyGoal />
                  <DailyGoal />
                  <CalendarWidget />
                  <ExamCountdown />
                </aside>
              </div>
            )}



            {activeTab === 'insights' && (
              <div className="space-y-8">
                <InsightsPanel />
                <AnalyticsDashboard />
                <div className="flex items-center gap-4 py-4">
                  <ExportReport />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

export default Dashboard;
