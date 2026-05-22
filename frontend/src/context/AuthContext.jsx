import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        setAuth(JSON.parse(storedAuth));
      } catch (err) {
        localStorage.removeItem('auth');
      }
    }
    setLoading(false);
  }, []);

  const login = (adminData, token) => {
    const authData = { admin: adminData, token };
    setAuth(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
    localStorage.setItem('token', token);
    setError(null);
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
  };

  const setAuthError = (err) => {
    setError(err);
  };

  const getToken = () => {
    return auth?.token || localStorage.getItem('token');
  };

  const value = {
    auth,
    loading,
    error,
    login,
    logout,
    setAuthError,
    getToken,
    isAuthenticated: !!auth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
