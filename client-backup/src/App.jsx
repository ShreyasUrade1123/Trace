import React from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import useAuthStore from './store/authStore';
import LandingPage from './pages/LandingPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

import Loader from './components/Loader';

function App() {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();

  // Check auth status on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading state while checking auth
  if (isLoading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        {/* Redirect unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
