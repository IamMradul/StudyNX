import { useData } from './context/DataContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const { data, isAuthLoading } = useData();

  if (isAuthLoading) {
    return <div className="auth-loading">Restoring session...</div>;
  }

  if (!data.isLoggedIn) {
    return <Login />;
  }

  return <Dashboard />;
}

export default App;
