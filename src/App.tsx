import { useEffect, useState } from 'react';
import { useData } from './context/DataContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import Background3D from './components/Background3D';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';
import { fadeUp } from './lib/animations';
import { Toaster } from 'react-hot-toast';
import './App.css';

type LegalRoute = 'terms' | 'privacy' | null;

const getLegalRouteFromHash = (): LegalRoute => {
  const hash = window.location.hash.toLowerCase();

  if (hash === '#/terms' || hash === '#terms') {
    return 'terms';
  }

  if (hash === '#/privacy' || hash === '#privacy') {
    return 'privacy';
  }

  return null;
};

function App() {
  const { authPromptMessage, dismissAuthPrompt } = useData();
  const [legalRoute, setLegalRoute] = useState<LegalRoute>(() => getLegalRouteFromHash());

  useEffect(() => {
    const pageTitle = legalRoute === 'terms'
      ? 'StudyNX | Terms of Service'
      : legalRoute === 'privacy'
        ? 'StudyNX | Privacy Policy'
        : 'StudyNX | Study Dashboard';

    document.title = pageTitle;
  }, [legalRoute]);

  useEffect(() => {
    const handleHashChange = () => {
      setLegalRoute(getLegalRouteFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  let content = null;

  if (legalRoute === 'terms') {
    content = <TermsOfService />;
  } else if (legalRoute === 'privacy') {
    content = <PrivacyPolicy />;
  } else {
    content = <Dashboard />;
  }

  return (
    <div className="app-shell relative text-slate-100 font-sans">
      <Background3D />
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
        }
      }} />
      <AnimatePresence mode="wait">
        <motion.div 
          key={legalRoute || 'dashboard'}
          variants={fadeUp}
          initial="initial"
          animate="animate"
          exit="exit"
          className="app-view relative z-10"
        >
          {content}
        </motion.div>
      </AnimatePresence>

      <footer className="site-footer fixed bottom-0 left-0 right-0 z-50 flex justify-between items-center px-5 py-3 border-t border-white/10 bg-[#050508]/80 backdrop-blur-xl" aria-label="Legal links">
        <p className="text-slate-400 text-xs tracking-wider">© {new Date().getFullYear()} StudyNX</p>
        <nav className="flex items-center gap-3 text-slate-400 text-xs" aria-label="Terms and privacy">
          <a href="#/terms" className="hover:text-white transition-colors">Terms of Service</a>
          <span aria-hidden="true">•</span>
          <a href="#/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
        </nav>
      </footer>

      {authPromptMessage && legalRoute === null && (
        <Login message={authPromptMessage} onDismiss={dismissAuthPrompt} />
      )}
    </div>
  );
}

export default App;
