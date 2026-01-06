// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  customAuthHook?: () => ReturnType<typeof useAuth>;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  customAuthHook 
}) => {
  const auth = customAuthHook ? customAuthHook() : useAuth();

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Additional initialization logic if needed
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};