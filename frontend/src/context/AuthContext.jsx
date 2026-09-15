import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('orbit_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('orbit_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync profile when token is present
  useEffect(() => {
    async function initAuth() {
      if (token) {
        try {
          const data = await api.getProfile();
          if (data.user) {
            setUser(data.user);
            localStorage.setItem('orbit_user', JSON.stringify(data.user));
          }
        } catch (err) {
          console.warn('Failed to restore session:', err.message);
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    }
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('orbit_token', data.token);
    localStorage.setItem('orbit_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await api.register(name, email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('orbit_token', data.token);
    localStorage.setItem('orbit_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('orbit_token');
    localStorage.removeItem('orbit_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
