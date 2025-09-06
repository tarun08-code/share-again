import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '@/types';
import { getCurrentUser, setCurrentUser, getUsers, addUser, updateUser as updateUserStorage, initializeStorage } from '@/lib/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    initializeStorage();
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser) {
      setCurrentUser(foundUser);
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'uploadsCount' | 'downloadsCount' | 'starredDepartments' | 'starredPapers' | 'starredNotes' | 'createdAt'>): Promise<boolean> => {
    const users = getUsers();
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      return false; // User already exists
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      uploadsCount: 0,
      downloadsCount: 0,
      starredDepartments: [],
      starredPapers: [],
      starredNotes: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    addUser(newUser);
    setCurrentUser(newUser);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      updateUserStorage(user.id, updates);
      setUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};