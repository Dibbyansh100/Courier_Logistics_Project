import React, { createContext, useContext, useState, useMemo } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Lazy initialization from sessionStorage
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('authUser');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn('Failed to parse authUser from sessionStorage', e);
      return null;
    }
  });

  // Derived state: no redundant useState + useEffect needed
  const isAuthenticated = Boolean(user);

  const login = (userData, password) => {
    setUser(userData);
    sessionStorage.setItem('authUser', JSON.stringify(userData));
    if (password) {
      sessionStorage.setItem('authPassword', password);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('authUser');
    sessionStorage.removeItem('authPassword');
  };

  // Memoize context value to prevent unnecessary re-renders of consuming components
  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
    }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
