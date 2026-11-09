import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('altus_petcloud_user');
    return saved ? JSON.parse(saved) : {
      id: '00000000-0000-0000-0000-000000000001',
      full_name: 'Dra. Miriam Castro',
      email: 'miriam.castro@altuspetcloud.com',
      role: 'ADMIN',
      professional_license: 'VET-894120'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('altus_petcloud_token') || 'mock-dev-token');

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('altus_petcloud_user', JSON.stringify(userData));
    localStorage.setItem('altus_petcloud_token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('altus_petcloud_user');
    localStorage.removeItem('altus_petcloud_token');
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
