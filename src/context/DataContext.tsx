import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Types ---
export interface Subject {
  id: string;
  name: string;
  progress: number;
  totalHours: number;
  status: 'on track' | 'progressing' | 'needs focus';
  color: string;
  studyDates: string[]; // e.g., '2026-04-12'
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  timeStr: string;
  type: 'warning' | 'info' | 'success'; 
}

export interface ResourceItem {
  id: string;
  title: string;
  tag: string;
  color: string;
}

export interface AppData {
  isLoggedIn: boolean;
  user: { name: string; avatar: string } | null;
  subjects: Subject[];
  activityData: Record<string, number>; // date "YYYY-MM-DD" -> level (1-4)
  reminders: Reminder[];
  resources: ResourceItem[];
}

const defaultData: AppData = {
  isLoggedIn: false,
  user: null,
  subjects: [
    { id: '1', name: 'Mathematics', progress: 78, totalHours: 12.5, status: 'on track', color: '#4ade80', studyDates: [] },
    { id: '2', name: 'Physics', progress: 52, totalHours: 8, status: 'progressing', color: '#f97316', studyDates: [] },
    { id: '3', name: 'Computer Sci', progress: 90, totalHours: 9.5, status: 'on track', color: '#a855f7', studyDates: [] },
    { id: '4', name: 'Chemistry', progress: 35, totalHours: 5.5, status: 'needs focus', color: '#ef4444', studyDates: [] },
    { id: '5', name: 'English Lit', progress: 60, totalHours: 3, status: 'progressing', color: '#a81111', studyDates: [] }
  ],
  activityData: {}, // Heatmap data
  reminders: [
    { id: 'r1', title: 'Weekly target on track', description: "You've studied only 8h - target is 15h. Catch up now!", timeStr: 'Today', type: 'warning' },
    { id: 'r2', title: 'Physics spaced repetition', description: "Last studied 5 days ago - spaced repetition suggests a review today.", timeStr: '2h ago', type: 'info' },
    { id: 'r3', title: 'Weekly goal almost done', description: "Only 1.5 hrs left to complete your 40-hour weekly target!", timeStr: 'Morning', type: 'success' }
  ],
  resources: [
    { id: 'res1', title: 'MIT OCW - Linear Algebra', tag: 'Math', color: '#4ade80' },
    { id: 'res2', title: '3Blue1Brown playlist', tag: 'Math', color: '#3b82f6' },
    { id: 'res3', title: 'Feynman Lectures - Physics', tag: 'Physics', color: '#f97316' },
    { id: 'res4', title: 'CS50 - Harvard OpenCourse', tag: 'CS', color: '#a855f7' }
  ]
};

interface DataContextType {
  data: AppData;
  login: (name: string) => void;
  logout: () => void;
  updateData: (newData: Partial<AppData>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'tracklio_data';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultData;
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const login = (name: string) => {
    setData(prev => ({
      ...prev,
      isLoggedIn: true,
      user: { name, avatar: name.slice(0, 2).toUpperCase() }
    }));
  };

  const logout = () => {
    setData(prev => ({
      ...prev,
      isLoggedIn: false,
      user: null
    }));
  };

  const updateData = (newData: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  return (
    <DataContext.Provider value={{ data, login, logout, updateData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
