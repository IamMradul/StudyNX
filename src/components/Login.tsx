import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, PresentationControls, Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import { fadeUp, staggerContainer } from '../lib/animations';
import { cn } from '../lib/utils';
import './Login.css';

type AuthView = 'signin' | 'signup' | 'magic';

type LoginProps = {
  message?: string;
  onDismiss?: () => void;
};

const FloatingObject = () => {
  return (
    <PresentationControls
      global
      rotation={[0.13, 0.1, 0]}
      polar={[-0.4, 0.2]}
      azimuth={[-1, 0.75]}
    >
      <Float rotationIntensity={2} floatIntensity={3} speed={2}>
        <Icosahedron args={[1, 15]} scale={1.5}>
          <MeshDistortMaterial
            color="#7C3AED"
            emissive="#06B6D4"
            emissiveIntensity={0.2}
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            wireframe={true}
          />
        </Icosahedron>
      </Float>
    </PresentationControls>
  );
};

const Login: React.FC<LoginProps> = ({ message, onDismiss }) => {
  const [authView, setAuthView] = useState<AuthView>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localName, setLocalName] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);
  const {
    login,
    authMode,
    isGoogleDirectEnabled,
    signInWithGoogle,
    requestEmailSignIn,
    signInWithPassword,
    signUpWithPassword,
    requestPasswordReset,
  } = useData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode !== 'local') return;
    if (localName.trim()) login(localName.trim());
  };

  const setResult = (ok: boolean, message: string) => {
    setFeedbackTone(ok ? 'success' : 'error');
    setFeedback(message);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await signInWithPassword(email.trim(), password);
    setResult(result.ok, result.message);
    setSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setResult(false, 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setResult(false, 'Passwords do not match.');
      return;
    }
    setSubmitting(true);
    const result = await signUpWithPassword(email.trim(), password);
    setResult(result.ok, result.message);
    setSubmitting(false);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setResult(false, 'Enter your email first.');
      return;
    }
    setSubmitting(true);
    const result = await requestEmailSignIn(normalizedEmail);
    setResult(result.ok, result.message);
    setSubmitting(false);
  };

  const handleResetPassword = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setResult(false, 'Enter your email to reset password.');
      return;
    }
    setSubmitting(true);
    const result = await requestPasswordReset(normalizedEmail);
    setResult(result.ok, result.message);
    setSubmitting(false);
  };

  const switchView = (nextView: AuthView) => {
    setAuthView(nextView);
    setFeedback(null);
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    const result = await signInWithGoogle();
    setResult(result.ok, result.message);
    setSubmitting(false);
  };

  const authPillCopy = authMode === 'supabase-email'
    ? ['Secure email access', 'Magic link option', 'Google sign-in']
    : ['Fast local access', 'Private by default', 'No account setup'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        variants={fadeUp} 
        initial="initial" 
        animate="animate" 
        exit="exit"
        className="relative w-full max-w-6xl mx-auto flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-glow-violet bg-white/[0.03] border border-white/10"
      >
        {/* Left Side: 3D Hero & Copy */}
        <div className="relative flex-1 p-10 lg:p-16 flex flex-col justify-center min-h-[500px] overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <FloatingObject />
            </Canvas>
          </div>
          
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="relative z-10 space-y-6">
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
              <div className="font-display font-bold text-2xl tracking-widest uppercase">
                Study<span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-violet to-neon-cyan">NX</span>
              </div>
              <span className="px-3 py-1 rounded-full text-[0.65rem] uppercase tracking-wider bg-white/5 border border-white/10 text-neon-cyan">
                Study dashboard
              </span>
            </motion.div>

            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-display font-bold leading-tight">
              Study Smarter. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-violet to-neon-cyan animate-gradient-shift bg-[length:200%_auto]">
                Track Deeper.
              </span>
            </motion.h2>
            
            <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-md">
              Save sessions, track streaks, and pick up exactly where you left off across devices.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-4">
              {authPillCopy.map((item, i) => (
                <motion.span 
                  key={item}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 shadow-glow-cyan"
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="relative w-full lg:w-[480px] p-8 lg:p-12 bg-black/40 backdrop-blur-2xl border-l border-white/10 flex flex-col justify-center">
          {onDismiss && (
            <button 
              type="button" 
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all scale-100 hover:scale-110 active:scale-95" 
              onClick={onDismiss}
            >
              ×
            </button>
          )}

          <div className="mb-8">
            <h3 className="text-2xl font-display font-semibold mb-2">
              {authMode === 'supabase-email' ? 'Welcome back' : 'Enter workspace'}
            </h3>
            <p className="text-sm text-slate-400">
              {authMode === 'supabase-email'
                ? 'Sign in to access your synchronized progress.'
                : 'Local mode is ideal for quick private use.'}
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 rounded-xl bg-electric-violet/20 border border-electric-violet/30 text-electric-violet text-sm">
              {message}
            </div>
          )}

          {authMode === 'supabase-email' ? (
            <div className="space-y-6">
              {isGoogleDirectEnabled && (
                <>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-[0.97] hover:scale-[1.02] hover:shadow-glow-cyan"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5c-.2 1.1-.9 2.1-1.9 2.8v2.3h3.1c1.8-1.7 2.9-4.1 2.9-6.9z" fill="#4285F4" />
                      <path d="M12 22c2.7 0 5-0.9 6.7-2.5l-3.1-2.3c-.9.6-2 .9-3.6.9-2.8 0-5.2-1.9-6-4.5H2.8v2.8C4.5 19.7 8 22 12 22z" fill="#34A853" />
                      <path d="M6 13.6c-.2-.6-.4-1.3-.4-2s.1-1.4.4-2V8.8H2.8C2.3 9.8 2 10.9 2 12s.3 2.2.8 3.2l3.2-2.5V13.6z" fill="#FBBC05" />
                      <path d="M12 5.4c1.5 0 2.9.5 4 1.5l3-3.1C17.5 2.2 14.9 1 12 1 8 1 4.5 3.3 2.8 6.8L6 9.2c.8-2.5 3.2-3.8 6-3.8z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-xs uppercase tracking-wider text-slate-500">or email</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                  </div>
                </>
              )}

              <div className="flex p-1 rounded-xl bg-white/5 border border-white/5 mb-6">
                {(['signin', 'signup', 'magic'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => switchView(tab)}
                    className={cn(
                      "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                      authView === tab ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-white"
                    )}
                  >
                    {tab === 'signin' ? 'Sign In' : tab === 'signup' ? 'Sign Up' : 'Magic'}
                  </button>
                ))}
              </div>

              <form 
                onSubmit={authView === 'signin' ? handleSignIn : authView === 'signup' ? handleSignUp : handleMagicLink}
                className="space-y-4"
              >
                <div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                  />
                </div>
                
                {authView !== 'magic' && (
                  <div>
                    <input
                      type="password"
                      placeholder={authView === 'signup' ? "Create password" : "Password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                    />
                  </div>
                )}

                {authView === 'signup' && (
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                    />
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-electric-violet to-neon-cyan text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.97] hover:scale-[1.02] hover:shadow-glow-violet"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-[shimmer_1s_forwards]" />
                  {submitting ? 'Processing...' : authView === 'signin' ? 'Sign In' : authView === 'signup' ? 'Create Account' : 'Send Link'}
                </button>

                {authView === 'signin' && (
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleResetPassword}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </form>

              {feedback && (
                <div className={cn(
                  "p-4 rounded-xl text-sm border",
                  feedbackTone === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                )}>
                  {feedback}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                />
              </div>
              <button 
                type="submit"
                className="w-full relative overflow-hidden group bg-gradient-to-r from-electric-violet to-neon-cyan text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.97] hover:scale-[1.02] hover:shadow-glow-violet"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:animate-[shimmer_1s_forwards]" />
                Enter Dashboard
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
