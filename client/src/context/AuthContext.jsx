import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { adminLogin, getCurrentAdmin } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('dana_admin_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('dana_admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    getCurrentAdmin()
      .then(({ data }) => setAdmin(data.admin))
      .catch(() => {
        localStorage.removeItem('dana_admin_token');
        localStorage.removeItem('dana_admin_user');
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await adminLogin({ email, password });
    localStorage.setItem('dana_admin_token', data.token);
    localStorage.setItem('dana_admin_user', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data.admin;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dana_admin_token');
    localStorage.removeItem('dana_admin_user');
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
