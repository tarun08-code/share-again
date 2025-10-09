import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '@/types';
import {
  getCurrentUser,
  setCurrentUser,
  getUsers,
  addUser,
  updateUser as updateUserStorage,
  initializeStorage
} from '@/lib/storage';

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
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    // Use localStorage for user management
    initializeStorage();
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const loginWithGoogle = async (): Promise<boolean> => {
    // Mock Google login for demo
    const mockUser: User = {
      id: 'google-' + Date.now().toString(),
      email: 'demo@gmail.com',
      name: 'Demo User',
      department: 'computer-science',
      section: 'A',
      uploadsCount: 0,
      downloadsCount: 0,
      points: 0,
      starredDepartments: [],
      starredPapers: [],
      starredNotes: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    addUser(mockUser);
    setCurrentUser(mockUser);
    setUser(mockUser);
    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Use localStorage for authentication
    const users = getUsers();
    const foundUser = users.find(u => u.email === email);

    if (foundUser) {
      setCurrentUser(foundUser);
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'uploadsCount' | 'downloadsCount' | 'points' | 'starredDepartments' | 'starredPapers' | 'starredNotes' | 'createdAt'>): Promise<boolean> => {
    // Use localStorage for registration
    const users = getUsers();
    const existingUser = users.find(u => u.email === userData.email);

    if (existingUser) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      uploadsCount: 0,
      downloadsCount: 0,
      points: 0,
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

  const logout = async () => {
    setCurrentUser(null);
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    updateUserStorage(user.id, updates);
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
    loginWithGoogle,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};