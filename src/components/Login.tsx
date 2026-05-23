import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import './Login.css';

type AuthView = 'signin' | 'signup' | 'magic';

type LoginProps = {
  message?: string;
  onDismiss?: () => void;
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
    if (authMode !== 'local') {
      return;
    }

    if (localName.trim()) {
      login(localName.trim());
    }
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

  const authPillCopy =
    authMode === 'supabase-email'
      ? ['Secure email access', 'Magic link option', 'Google sign-in']
      : ['Fast local access', 'Private by default', 'No account setup'];

  const authHighlights =
    authMode === 'supabase-email'
      ? [
          { label: 'Cloud sync', value: 'Auto-save study progress' },
          { label: 'Flexible login', value: 'Password, email link, or Google' },
          { label: 'Built for focus', value: 'Clean dashboard and session tracking' },
        ]
      : [
          { label: 'Quick start', value: 'Enter your name and continue' },
          { label: 'Private mode', value: 'Nothing leaves your browser' },
          { label: 'Study-ready', value: 'Jump straight into your dashboard' },
        ];

  return (
    <div className="login-container">
      <div className="card login-card">
        <section className="login-hero" aria-label="StudyNX sign in preview">
          <div className="login-brand-row">
            <div className="login-logo">
              Study<span>NX</span>
            </div>
            <span className="login-mode-chip">Study dashboard</span>
          </div>

          <h2>Sign in to keep your study flow in sync.</h2>
          <p className="login-hero-copy">
            Save sessions, track streaks, and pick up exactly where you left off across devices.
          </p>

          <div className="login-pill-row" aria-label="Key benefits">
            {authPillCopy.map((item) => (
              <span key={item} className="login-pill">
                {item}
              </span>
            ))}
          </div>

          <div className="login-highlights" aria-label="Auth benefits">
            {authHighlights.map((item) => (
              <article key={item.label} className="login-highlight-card">
                <span className="login-highlight-label">{item.label}</span>
                <p>{item.value}</p>
              </article>
            ))}
          </div>

          <div className="login-hero-note">
            Focused layout, gentle motion, and clear sign-in options designed to reduce friction.
          </div>
        </section>

        <section className="login-panel" aria-label="Authentication form">
          {onDismiss && (
            <button type="button" className="login-dismiss-btn" onClick={onDismiss} aria-label="Close sign in prompt">
              ×
            </button>
          )}

          <div className="login-panel-header">
            <p className="login-kicker">Welcome back</p>
            <h3>{authMode === 'supabase-email' ? 'Choose a secure sign in method' : 'Enter your workspace name'}</h3>
            <p className="login-panel-subtitle">
              {authMode === 'supabase-email'
                ? 'Use the option that fits your workflow and keep your progress protected.'
                : 'Local mode is ideal for quick demos and lightweight private use.'}
            </p>
          </div>

          {message && <p className="login-banner">{message}</p>}

          {authMode === 'supabase-email' ? (
            <>
              {isGoogleDirectEnabled && (
                <>
                  <button
                    type="button"
                    className="google-auth-btn"
                    disabled={submitting}
                    onClick={handleGoogleSignIn}
                  >
                    <span className="google-auth-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" role="img" focusable="false">
                        <path
                          d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5c-.2 1.1-.9 2.1-1.9 2.8v2.3h3.1c1.8-1.7 2.9-4.1 2.9-6.9z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 22c2.7 0 5-0.9 6.7-2.5l-3.1-2.3c-.9.6-2 .9-3.6.9-2.8 0-5.2-1.9-6-4.5H2.8v2.8C4.5 19.7 8 22 12 22z"
                          fill="#34A853"
                        />
                        <path
                          d="M6 13.6c-.2-.6-.4-1.3-.4-2s.1-1.4.4-2V8.8H2.8C2.3 9.8 2 10.9 2 12s.3 2.2.8 3.2l3.2-2.5V13.6z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.4c1.5 0 2.9.5 4 1.5l3-3.1C17.5 2.2 14.9 1 12 1 8 1 4.5 3.3 2.8 6.8L6 9.2c.8-2.5 3.2-3.8 6-3.8z"
                          fill="#EA4335"
                        />
                      </svg>
                    </span>
                    Continue with Google
                  </button>

                  <div className="auth-divider">
                    <span>or continue with email</span>
                  </div>
                </>
              )}

              <div className="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${authView === 'signin' ? 'active' : ''}`}
                  onClick={() => switchView('signin')}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab ${authView === 'signup' ? 'active' : ''}`}
                  onClick={() => switchView('signup')}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  className={`auth-tab ${authView === 'magic' ? 'active' : ''}`}
                  onClick={() => switchView('magic')}
                >
                  Magic Link
                </button>
              </div>

              {authView === 'signin' && (
                <form onSubmit={handleSignIn}>
                  <p className="login-helper">Sign in with your email and password</p>
                  <input
                    type="email"
                    className="login-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    className="login-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className="login-btn" disabled={submitting}>
                    {submitting ? 'Signing In...' : 'Sign In'}
                  </button>
                  <button
                    type="button"
                    className="auth-link-btn"
                    disabled={submitting}
                    onClick={handleResetPassword}
                  >
                    Forgot password?
                  </button>
                </form>
              )}

              {authView === 'signup' && (
                <form onSubmit={handleSignUp}>
                  <p className="login-helper">Create a new account</p>
                  <input
                    type="email"
                    className="login-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    className="login-input"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    className="login-input"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button type="submit" className="login-btn" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Account'}
                  </button>
                </form>
              )}

              {authView === 'magic' && (
                <form onSubmit={handleMagicLink}>
                  <p className="login-helper">Sign in via one-time magic link</p>
                  <input
                    type="email"
                    className="login-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="login-btn" disabled={submitting}>
                    {submitting ? 'Sending...' : 'Send Magic Link'}
                  </button>
                </form>
              )}

              {feedback && <p className={`login-feedback ${feedbackTone}`}>{feedback}</p>}
            </>
          ) : (
            <form onSubmit={handleLogin}>
              <p className="login-helper">Local mode (no Supabase)</p>
              <input
                type="text"
                className="login-input"
                placeholder="Enter your name to continue..."
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
              />
              <button type="submit" className="login-btn">
                Enter Dashboard
              </button>
            </form>
          )}

          <p className="login-security-note">
            Your session is protected with clear sign-in options and minimal steps to get you back to studying.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
