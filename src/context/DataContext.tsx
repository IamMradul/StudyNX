import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { signInWithGoogleDirect } from '../lib/googleAuth';
import { applyStudySessionLog, toDateKey, type StudySessionLog } from '../lib/studyLogic';

// --- Types ---
export interface Subject {
  id: string;
  name: string;
  progress: number;
  totalHours: number;
  targetHours: number;
  status: 'on track' | 'progressing' | 'needs focus';
  color: string;
  studyDates: string[]; // e.g., '2026-04-12'
  dailyHours: Record<string, number>; // date "YYYY-MM-DD" -> hours for this subject
}

export interface Reminder {
  id: string;
  text: string;
  datetime: string; // ISO string
  isDismissed: boolean;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  tag: string;
  color: string;
}

export interface ExamItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  color: string;
}

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

export interface SessionLog {
  id: string;
  subjectId?: string;
  subjectName?: string;
  startTime: string; // ISO string
  durationMinutes: number;
  quality: number; // 1-5 stars
}

export interface AppData {
  isLoggedIn: boolean;
  user: { name: string; avatar: string; email?: string } | null;
  subjects: Subject[];
  activityData: Record<string, number>; // date "YYYY-MM-DD" -> hours
  activityDataMode: 'hours';
  todos: Todo[];
  reminders: Reminder[];
  resources: ResourceItem[];
  exams: ExamItem[];
  weeklyTargetHours: number;
  dailyTargetHours: number;
  pomodoroSettings: PomodoroSettings;
  sessionLogs: SessionLog[];
  dailyTodoEnabled: boolean;
  lastTodoResetDate: string;
}

type ProgressPayload = Pick<AppData, 'subjects' | 'activityData' | 'activityDataMode' | 'todos' | 'reminders' | 'resources' | 'exams' | 'weeklyTargetHours' | 'dailyTargetHours' | 'pomodoroSettings' | 'sessionLogs' | 'dailyTodoEnabled' | 'lastTodoResetDate'>;

const isRecord = (value: unknown): value is Record<string, unknown> => (
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)
);

const defaultData: AppData = {
  isLoggedIn: false,
  user: null,
  subjects: [],
  activityData: {},
  activityDataMode: 'hours',
  todos: [],
  reminders: [],
  resources: [],
  exams: [],
  weeklyTargetHours: 40,
  dailyTargetHours: 4,
  pomodoroSettings: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
  },
  sessionLogs: [],
  dailyTodoEnabled: false,
  lastTodoResetDate: '',
};

interface DataContextType {
  data: AppData;
  authMode: 'supabase-email' | 'local';
  isGoogleDirectEnabled: boolean;
  isAuthLoading: boolean;
  authPromptMessage: string | null;
  requestAuthPrompt: (message?: string) => void;
  dismissAuthPrompt: () => void;
  signInWithGoogle: () => Promise<{ ok: boolean; message: string }>;
  signInWithPassword: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  signUpWithPassword: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  requestPasswordReset: (email: string) => Promise<{ ok: boolean; message: string }>;
  requestEmailSignIn: (email: string) => Promise<{ ok: boolean; message: string }>;
  login: (name: string) => void;
  logout: () => Promise<void>;
  updatePassword: (password: string) => Promise<{ ok: boolean; message: string }>;
  updateData: (newData: Partial<AppData>) => void;
  logStudySession: (session: StudySessionLog) => Promise<AuthResult>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'tracklio_data';
type AuthResult = { ok: boolean; message: string };

const GOOGLE_SESSION_KEY = 'tracklio_google_session';

type GoogleSession = {
  email: string;
  name: string;
  avatar: string;
  accessToken?: string;
  expiresAt?: number;
  scope?: string;
};

const toProgressPayload = (state: AppData): ProgressPayload => ({
  subjects: state.subjects,
  activityData: state.activityData,
  activityDataMode: state.activityDataMode,
  todos: state.todos,
  reminders: state.reminders,
  resources: state.resources,
  exams: state.exams,
  weeklyTargetHours: state.weeklyTargetHours,
  dailyTargetHours: state.dailyTargetHours,
  pomodoroSettings: state.pomodoroSettings,
  sessionLogs: state.sessionLogs,
  dailyTodoEnabled: state.dailyTodoEnabled,
  lastTodoResetDate: state.lastTodoResetDate,
});

const sanitizeProgressPayload = (rawPayload: unknown): Partial<ProgressPayload> => {
  if (!rawPayload || typeof rawPayload !== 'object') return {};
  const payload = rawPayload as Partial<ProgressPayload> & { reminders?: unknown[] };
  
  // Migrate legacy reminders to todos if they don't look like the new timed Reminders
  let migratedTodos: Todo[] | undefined = undefined;
  let newReminders: Reminder[] | undefined = undefined;
  
  if (Array.isArray(payload.todos)) {
    migratedTodos = payload.todos;
  }
  
  if (Array.isArray(payload.reminders)) {
    // If it has datetime, it's our new Reminder type
    if (payload.reminders.length > 0 && ('datetime' in (payload.reminders[0] || {}))) {
      newReminders = payload.reminders as Reminder[];
    } else if (!migratedTodos) {
      // Legacy reminder migration
      migratedTodos = payload.reminders.map((r: any) => ({
        id: r.id || crypto.randomUUID(),
        text: r.title || r.description || 'Legacy Reminder',
        completed: false
      }));
    }
  }

  return {
    subjects: Array.isArray(payload.subjects) ? payload.subjects : undefined,
    activityData: payload.activityData && typeof payload.activityData === 'object'
      ? (payload.activityData as Record<string, number>)
      : undefined,
    activityDataMode: payload.activityDataMode === 'hours' ? 'hours' : undefined,
    todos: migratedTodos,
    reminders: newReminders,
    resources: Array.isArray(payload.resources) ? payload.resources : undefined,
    exams: Array.isArray(payload.exams) ? payload.exams : undefined,
    weeklyTargetHours: typeof payload.weeklyTargetHours === 'number' ? payload.weeklyTargetHours : undefined,
    dailyTargetHours:  typeof payload.dailyTargetHours  === 'number' ? payload.dailyTargetHours  : undefined,
    pomodoroSettings:  isRecord(payload.pomodoroSettings) ? {
      workDuration:       typeof payload.pomodoroSettings.workDuration       === 'number' ? payload.pomodoroSettings.workDuration       : 25,
      shortBreakDuration: typeof payload.pomodoroSettings.shortBreakDuration === 'number' ? payload.pomodoroSettings.shortBreakDuration : 5,
      longBreakDuration:  typeof payload.pomodoroSettings.longBreakDuration  === 'number' ? payload.pomodoroSettings.longBreakDuration  : 15,
    } : undefined,
    sessionLogs: Array.isArray(payload.sessionLogs) ? payload.sessionLogs : undefined,
    dailyTodoEnabled: typeof payload.dailyTodoEnabled === 'boolean' ? payload.dailyTodoEnabled : undefined,
    lastTodoResetDate: typeof payload.lastTodoResetDate === 'string' ? payload.lastTodoResetDate : undefined,
  };
};

const normalizeActivityData = (activityData: unknown, mode: unknown): Record<string, number> => {
  if (!isRecord(activityData)) return {};
  const isHoursMode = mode === 'hours';
  const normalizedEntries = Object.entries(activityData)
    .filter((entry): entry is [string, number] => typeof entry[1] === 'number' && Number.isFinite(entry[1]))
    .map(([dateKey, value]) => {
      if (isHoursMode) return [dateKey, value] as const;
      const legacyValue = value >= 0 && value <= 4 && Number.isInteger(value) ? value * 1.5 : value;
      return [dateKey, legacyValue] as const;
    });
  return Object.fromEntries(normalizedEntries) as Record<string, number>;
};

const normalizeSubjects = (subjects: unknown): Subject[] => {
  if (!Array.isArray(subjects)) return [];

  const toStatus = (progress: number): Subject['status'] => {
    if (progress >= 100) return 'on track';
    if (progress >= 50) return 'progressing';
    return 'needs focus';
  };

  return subjects.filter(isRecord).map((subject, index) => {
    const id = typeof subject.id === 'string' && subject.id.trim() ? subject.id : crypto.randomUUID();
    const name = typeof subject.name === 'string' && subject.name.trim() ? subject.name : `Subject ${index + 1}`;
    const color = typeof subject.color === 'string' && subject.color.trim() ? subject.color : '#5f8dff';
    const targetHours = typeof subject.targetHours === 'number' && Number.isFinite(subject.targetHours) && subject.targetHours > 0
      ? Number(subject.targetHours.toFixed(1))
      : 40;

    const dailyHours = isRecord(subject.dailyHours)
      ? Object.fromEntries(
        Object.entries(subject.dailyHours)
          .filter((entry): entry is [string, number] => typeof entry[1] === 'number' && Number.isFinite(entry[1]) && entry[1] > 0)
          .map(([dateKey, hours]) => [dateKey, Number(hours.toFixed(1))])
      ) as Record<string, number>
      : {};

    const legacyDates = Array.isArray(subject.studyDates)
      ? subject.studyDates.filter((value): value is string => typeof value === 'string')
      : [];

    for (const dateKey of legacyDates) {
      if (!dailyHours[dateKey]) dailyHours[dateKey] = 1.5;
    }

    const totalHoursRaw = Object.values(dailyHours).reduce((sum, hours) => sum + hours, 0);
    const totalHours = Number(totalHoursRaw.toFixed(1));
    const progress = Math.min(100, Math.round((totalHours / targetHours) * 100));
    const status = toStatus(progress);
    const studyDates = Object.entries(dailyHours)
      .filter(([, hours]) => hours > 0)
      .map(([dateKey]) => dateKey)
      .sort();

    return { id, name, progress, totalHours, targetHours, status, color, studyDates, dailyHours };
  });
};

const normalizeAppData = (rawData: unknown): AppData => {
  const candidate = isRecord(rawData) ? rawData : {};
  const user = isRecord(candidate.user)
    ? {
      name: typeof candidate.user.name === 'string' ? candidate.user.name : '',
      avatar: typeof candidate.user.avatar === 'string' ? candidate.user.avatar : '',
      email: typeof candidate.user.email === 'string' ? candidate.user.email : undefined,
    }
    : null;

  return {
    ...defaultData,
    isLoggedIn: typeof candidate.isLoggedIn === 'boolean' ? candidate.isLoggedIn : defaultData.isLoggedIn,
    user,
    subjects: normalizeSubjects(candidate.subjects),
    activityData: normalizeActivityData(candidate.activityData, candidate.activityDataMode),
    activityDataMode: 'hours',
    todos: Array.isArray(candidate.todos) ? candidate.todos as Todo[] : defaultData.todos,
    reminders: Array.isArray(candidate.reminders) ? candidate.reminders as Reminder[] : defaultData.reminders,
    resources: Array.isArray(candidate.resources) ? candidate.resources as ResourceItem[] : defaultData.resources,
    exams: Array.isArray(candidate.exams) ? candidate.exams as ExamItem[] : defaultData.exams,
    weeklyTargetHours: typeof candidate.weeklyTargetHours === 'number' ? candidate.weeklyTargetHours : defaultData.weeklyTargetHours,
    dailyTargetHours:  typeof candidate.dailyTargetHours  === 'number' && candidate.dailyTargetHours > 0
      ? candidate.dailyTargetHours
      : defaultData.dailyTargetHours,
    pomodoroSettings: isRecord(candidate.pomodoroSettings) ? {
      workDuration:       typeof candidate.pomodoroSettings.workDuration       === 'number' ? candidate.pomodoroSettings.workDuration       : defaultData.pomodoroSettings.workDuration,
      shortBreakDuration: typeof candidate.pomodoroSettings.shortBreakDuration === 'number' ? candidate.pomodoroSettings.shortBreakDuration : defaultData.pomodoroSettings.shortBreakDuration,
      longBreakDuration:  typeof candidate.pomodoroSettings.longBreakDuration  === 'number' ? candidate.pomodoroSettings.longBreakDuration  : defaultData.pomodoroSettings.longBreakDuration,
    } : defaultData.pomodoroSettings,
    sessionLogs: Array.isArray(candidate.sessionLogs) ? candidate.sessionLogs as SessionLog[] : defaultData.sessionLogs,
    dailyTodoEnabled: typeof candidate.dailyTodoEnabled === 'boolean' ? candidate.dailyTodoEnabled : defaultData.dailyTodoEnabled,
    lastTodoResetDate: typeof candidate.lastTodoResetDate === 'string' ? candidate.lastTodoResetDate : defaultData.lastTodoResetDate,
  };
};

/** Reads the stored Google session from localStorage. Returns null if missing or invalid. */
const readGoogleSession = (): GoogleSession | null => {
  const rawSession = localStorage.getItem(GOOGLE_SESSION_KEY);
  if (!rawSession) return null;
  try {
    const parsed = JSON.parse(rawSession) as Partial<GoogleSession>;
    if (typeof parsed.email !== 'string' || typeof parsed.name !== 'string' || typeof parsed.avatar !== 'string') {
      return null;
    }
    return {
      email: parsed.email,
      name: parsed.name,
      avatar: parsed.avatar,
      accessToken: typeof parsed.accessToken === 'string' ? parsed.accessToken : undefined,
      expiresAt:   typeof parsed.expiresAt   === 'number' ? parsed.expiresAt   : undefined,
      scope:       typeof parsed.scope       === 'string' ? parsed.scope       : undefined,
    };
  } catch {
    return null;
  }
};

/** Persists the Google session to localStorage. */
const saveGoogleSession = (session: GoogleSession) =>
  localStorage.setItem(GOOGLE_SESSION_KEY, JSON.stringify(session));

const clearGoogleSession = () => localStorage.removeItem(GOOGLE_SESSION_KEY);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const isGoogleDirectEnabled = Boolean(googleClientId);
  const authMode: 'supabase-email' | 'local' = isSupabaseConfigured ? 'supabase-email' : 'local';
  const isHydratingFromSupabaseRef = useRef(false);
  const hydratedUserRef = useRef<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(authMode === 'supabase-email');
  const [authPromptMessage, setAuthPromptMessage] = useState<string | null>(null);

  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return normalizeAppData(JSON.parse(saved)); } catch { return defaultData; }
    }
    return defaultData;
  });

  const requestAuthPrompt = (message = 'Sign in to save changes.') => setAuthPromptMessage(message);
  const dismissAuthPrompt = () => setAuthPromptMessage(null);

  useEffect(() => {
    const supabaseClient = supabase;
    if (authMode !== 'supabase-email') { setIsAuthLoading(false); return; }
    if (!isSupabaseConfigured || !supabaseClient) { setIsAuthLoading(false); return; }

    const applySession = (session: Session | null) => {
      if (session?.user?.email) {
        const email = session.user.email;
        const nameFromMeta = session.user.user_metadata?.name || session.user.user_metadata?.full_name;
        const displayName = nameFromMeta || email.split('@')[0];
        setData(prev => ({ ...prev, isLoggedIn: true, user: { name: displayName, avatar: displayName.slice(0, 2).toUpperCase(), email } }));
      } else {
        const savedGoogleSession = readGoogleSession();
        if (savedGoogleSession) {
          setData(prev => ({ ...prev, isLoggedIn: true, user: { name: savedGoogleSession.name, avatar: savedGoogleSession.avatar, email: savedGoogleSession.email } }));
          return;
        }
        setData(prev => ({ ...prev, isLoggedIn: false, user: null }));
      }
    };

    let isMounted = true;
    const bootstrapAuth = async () => {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      if (!isMounted) return;
      applySession(sessionData.session);
      setIsAuthLoading(false);
    };
    bootstrapAuth();

    const { data: authSubscription } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      applySession(session);
      setIsAuthLoading(false);
    });

    return () => { isMounted = false; authSubscription.subscription.unsubscribe(); };
  }, [authMode]);

  useEffect(() => {
    const supabaseClient = supabase;
    if (!isSupabaseConfigured || !supabaseClient) return;
    if (!data.isLoggedIn || !data.user?.name) { hydratedUserRef.current = null; return; }
    
    const userIdentifier = data.user.email || data.user.name;
    if (hydratedUserRef.current === userIdentifier) return;

    hydratedUserRef.current = userIdentifier;
    isHydratingFromSupabaseRef.current = true;
    let isCancelled = false;

    const hydrateFromSupabase = async () => {
      let row = null;
      if (data.user?.email) {
        const { data: emailRow } = await supabaseClient.from('user_progress').select('payload').eq('user_email', data.user.email).maybeSingle();
        row = emailRow;
      }
      if (!row && data.user) {
        const { data: nameRow } = await supabaseClient.from('user_progress').select('payload').eq('user_email', data.user.name).maybeSingle();
        row = nameRow;
      }
      
      if (isCancelled) return;
      if (row?.payload) {
        const remotePayload = sanitizeProgressPayload(row.payload);
        setData(prev => ({
          ...prev,
          subjects: normalizeSubjects(remotePayload.subjects ?? prev.subjects),
          activityData: normalizeActivityData(remotePayload.activityData ?? prev.activityData, remotePayload.activityDataMode ?? prev.activityDataMode),
          activityDataMode: 'hours',
          todos: remotePayload.todos ?? prev.todos,
          reminders: remotePayload.reminders ?? prev.reminders,
          resources: remotePayload.resources ?? prev.resources,
          exams: remotePayload.exams ?? prev.exams,
          weeklyTargetHours: remotePayload.weeklyTargetHours ?? prev.weeklyTargetHours,
          dailyTargetHours:  remotePayload.dailyTargetHours  ?? prev.dailyTargetHours,
          pomodoroSettings:  remotePayload.pomodoroSettings  ?? prev.pomodoroSettings,
        }));
      }
      isHydratingFromSupabaseRef.current = false;
    };

    hydrateFromSupabase();
    return () => { isCancelled = true; };
  }, [data.isLoggedIn, data.user?.name, data.user?.email]);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);

  useEffect(() => {
    const supabaseClient = supabase;
    if (!isSupabaseConfigured || !supabaseClient) return;
    if (!data.isLoggedIn || !data.user?.name) return;
    if (isHydratingFromSupabaseRef.current) return;

    const payload = toProgressPayload(data);
    const saveToSupabase = async () => {
      const identifier = data.user!.email || data.user!.name;
      const { error } = await supabaseClient.from('user_progress').upsert(
        { user_email: identifier, display_name: data.user!.name, payload, updated_at: new Date().toISOString() },
        { onConflict: 'user_email' }
      );
      if (error) console.error('Supabase save error:', error.message);
    };
    saveToSupabase();
  }, [data]);

  useEffect(() => {
    if (!data.dailyTodoEnabled) return;
    
    const checkReset = () => {
      const now = new Date();
      // Shift back by 3 hours: "today" logically ends at 3 AM next day.
      const logicalDate = new Date(now);
      logicalDate.setHours(logicalDate.getHours() - 3);
      const logicalDateKey = toDateKey(logicalDate);

      setData(prev => {
        if (!prev.dailyTodoEnabled) return prev;
        
        if (prev.lastTodoResetDate && prev.lastTodoResetDate !== logicalDateKey) {
          const hasCompletedTodos = prev.todos.some(t => t.completed);
          if (hasCompletedTodos) {
            return normalizeAppData({
              ...prev,
              todos: prev.todos.map(t => ({ ...t, completed: false })),
              lastTodoResetDate: logicalDateKey
            });
          } else {
            return normalizeAppData({ ...prev, lastTodoResetDate: logicalDateKey });
          }
        } else if (!prev.lastTodoResetDate) {
          return normalizeAppData({ ...prev, lastTodoResetDate: logicalDateKey });
        }
        return prev;
      });
    };

    checkReset();
    const interval = setInterval(checkReset, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [data.dailyTodoEnabled]);

  const requestEmailSignIn = async (email: string) => {
    const supabaseClient = supabase;
    if (authMode !== 'supabase-email' || !isSupabaseConfigured || !supabaseClient) {
      return { ok: false, message: 'Email auth via Supabase is not enabled in current mode.' };
    }
    const { error } = await supabaseClient.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: 'Magic link sent. Check your email to sign in.' };
  };

  /**
   * Google sign-in via GSI popup (profile + email scopes only, no Calendar).
   * Stores name, avatar, and access token in localStorage for session persistence.
   */
  const signInWithGoogle = async (): Promise<AuthResult> => {
    if (!isGoogleDirectEnabled) {
      return { ok: false, message: 'Direct Google auth is not enabled.' };
    }

    try {
      const profile = await signInWithGoogleDirect(googleClientId || '');
      const displayName = profile.name || profile.email;
      const initials = displayName.slice(0, 2).toUpperCase();

      saveGoogleSession({
        email: profile.email,
        name: displayName,
        avatar: initials,
        accessToken: profile.accessToken,
        expiresAt: profile.expiresAt,
        scope: profile.scope,
      });

      setData(prev => ({
        ...prev,
        isLoggedIn: true,
        user: { name: displayName, avatar: initials, email: profile.email },
      }));
      dismissAuthPrompt();

      return { ok: true, message: `Signed in as ${profile.email}` };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Google sign-in failed.',
      };
    }
  };

  const signInWithPassword = async (email: string, password: string): Promise<AuthResult> => {
    const supabaseClient = supabase;
    if (authMode !== 'supabase-email' || !isSupabaseConfigured || !supabaseClient) {
      return { ok: false, message: 'Email auth via Supabase is not enabled in current mode.' };
    }
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: 'Signed in successfully.' };
  };

  const signUpWithPassword = async (email: string, password: string): Promise<AuthResult> => {
    const supabaseClient = supabase;
    if (authMode !== 'supabase-email' || !isSupabaseConfigured || !supabaseClient) {
      return { ok: false, message: 'Email auth via Supabase is not enabled in current mode.' };
    }
    const { data: signUpData, error } = await supabaseClient.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
    if (error) return { ok: false, message: error.message };
    const hasSession = Boolean(signUpData.session);
    return { ok: true, message: hasSession ? 'Account created and signed in.' : 'Account created. Check your email to confirm.' };
  };

  const requestPasswordReset = async (email: string): Promise<AuthResult> => {
    const supabaseClient = supabase;
    if (authMode !== 'supabase-email' || !isSupabaseConfigured || !supabaseClient) {
      return { ok: false, message: 'Email auth via Supabase is not enabled in current mode.' };
    }
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: 'Password reset email sent. Check your inbox.' };
  };

  const updatePassword = async (password: string): Promise<AuthResult> => {
    const supabaseClient = supabase;
    if (authMode !== 'supabase-email' || !isSupabaseConfigured || !supabaseClient) {
      return { ok: false, message: 'Not available in local mode or without Supabase configured.' };
    }
    
    // Check if the user is signed in with Google
    if (readGoogleSession()) {
      return { ok: false, message: 'Password cannot be changed for Google accounts.' };
    }

    // Verify Supabase session
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
      return { ok: false, message: 'Auth session missing! Please sign out and sign in again.' };
    }

    const { error } = await supabaseClient.auth.updateUser({ password });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: 'Password updated successfully.' };
  };

  const login = (name: string) => {
    if (authMode !== 'local') return;
    setData(prev => ({ ...prev, isLoggedIn: true, user: { name, avatar: name.slice(0, 2).toUpperCase() } }));
    dismissAuthPrompt();
  };

  const logout = async () => {
    const supabaseClient = supabase;
    if (authMode === 'supabase-email' && isSupabaseConfigured && supabaseClient) {
      const { error } = await supabaseClient.auth.signOut();
      if (error) console.error('Supabase sign out error:', error.message);
    }
    clearGoogleSession();
    dismissAuthPrompt();
    setData(prev => ({ ...prev, isLoggedIn: false, user: null }));
  };

  const updateData = (newData: Partial<AppData>) => {
    if (!data.isLoggedIn) { requestAuthPrompt('Sign in to save your dashboard changes.'); return; }
    setData(prev => normalizeAppData({ ...prev, ...newData }));
  };

  /**
   * Logs a study session to activityData (and subject dailyHours if applicable).
   * @param session - StudySessionLog with source, dateKey, hours
   */
  const logStudySession = async (session: StudySessionLog): Promise<AuthResult> => {
    if (!data.isLoggedIn) {
      requestAuthPrompt('Sign in to save study changes.');
      return { ok: false, message: 'Sign in to save study changes.' };
    }

    setData(prev => {
      const nextData = normalizeAppData(applyStudySessionLog(prev, session));
      
      // If we are adding hours (not clearing), also record a detailed session log for analytics
      if (session.hours > 0) {
        const newLog: SessionLog = {
          id: crypto.randomUUID(),
          subjectId: session.subjectId,
          subjectName: session.subjectName,
          startTime: new Date().toISOString(),
          durationMinutes: Math.round(session.hours * 60),
          quality: 4, // Default to 'Good' for manual logs
        };
        nextData.sessionLogs = [newLog, ...nextData.sessionLogs].slice(0, 1000); // Keep last 1000 logs
      }

      return nextData;
    });

    return {
      ok: true,
      message: session.hours <= 0 ? 'Study session cleared.' : 'Study session logged.',
    };
  };

  return (
    <DataContext.Provider
      value={{
        data,
        authMode,
        isGoogleDirectEnabled,
        isAuthLoading,
        authPromptMessage,
        requestAuthPrompt,
        dismissAuthPrompt,
        signInWithGoogle,
        signInWithPassword,
        signUpWithPassword,
        requestPasswordReset,
        requestEmailSignIn,
        login,
        logout,
        updatePassword,
        updateData,
        logStudySession,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

// Re-export toDateKey so components can import it from here if needed
export { toDateKey };
