import React from 'react';
import { useData } from './context/DataContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const { data } = useData();

  if (!data.isLoggedIn) {
    return <Login />;
  }

  return <Dashboard />;
}

export default App;
