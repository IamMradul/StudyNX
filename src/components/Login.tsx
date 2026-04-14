import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import './Login.css';

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const { login } = useData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name.trim());
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <div className="login-logo">
          study<span>arc</span>
        </div>
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            className="login-input" 
            placeholder="Enter your name to continue..." 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="login-btn">
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
