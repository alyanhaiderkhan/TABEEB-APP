
import React, { createContext, useState, ReactNode, FC } from 'react';
import { AuthContextType, UserRole } from '../types';

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const login = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
