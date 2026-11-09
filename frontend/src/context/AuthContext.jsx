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
      professional_license: 'VET-894120',
      tenant_name: 'Hospital Veterinario Altus',
      tenant_id: 'ten-altus-01'
    };
  });

  const [currentBranch, setCurrentBranch] = useState(() => {
    const saved = localStorage.getItem('altus_petcloud_branch');
    return saved ? JSON.parse(saved) : {
      id: 'br-01',
      name: 'Sucursal Matriz (Insurgentes)',
      code: 'SUC-01',
      phone: '(55) 8421-9900'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('altus_petcloud_token') || 'mock-dev-token');

  const switchBranch = (branch) => {
    setCurrentBranch(branch);
    localStorage.setItem('altus_petcloud_branch', JSON.stringify(branch));
  };

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
    <AuthContext.Provider value={{ user, token, currentBranch, switchBranch, login, logout, hasRole, isAuthenticated: !!user }}>
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
