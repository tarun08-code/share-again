import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '@/types';
import { supabase } from '@/lib/supabase';
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

  // Check if Supabase is configured
  const isSupabaseConfigured = () => {
    return import.meta.env.VITE_SUPABASE_URL && 
           import.meta.env.VITE_SUPABASE_ANON_KEY &&
           import.meta.env.VITE_SUPABASE_URL !== 'your-supabase-url';
  };

  useEffect(() => {
    if (isSupabaseConfigured()) {
      // Supabase auth listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            // Get or create user profile
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              const mappedUser: User = {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                department: profile.department,
                section: profile.section,
                uploadsCount: profile.uploads_count || 0,
                downloadsCount: profile.downloads_count || 0,
                starredDepartments: profile.starred_departments || [],
                starredPapers: profile.starred_papers || [],
                starredNotes: profile.starred_notes || [],
                createdAt: profile.created_at
              };
              setUser(mappedUser);
            }
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    } else {
      // Fallback to localStorage
      initializeStorage();
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async (): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock Google login');
      // Mock Google login for demo
      const mockUser: User = {
        id: 'google-' + Date.now().toString(),
        email: 'demo@gmail.com',
        name: 'Demo User',
        department: 'computer-science',
        section: 'A',
        uploadsCount: 0,
        downloadsCount: 0,
        starredDepartments: [],
        starredPapers: [],
        starredNotes: [],
        createdAt: new Date().toISOString().split('T')[0]
      };
      addUser(mockUser);
      setCurrentUser(mockUser);
      setUser(mockUser);
      return true;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      return !error;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
      const users = getUsers();
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser) {
        setCurrentUser(foundUser);
        setUser(foundUser);
        return true;
      }
      return false;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return !error;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'uploadsCount' | 'downloadsCount' | 'starredDepartments' | 'starredPapers' | 'starredNotes' | 'createdAt'>): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      // Fallback to localStorage
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
        starredDepartments: [],
        starredPapers: [],
        starredNotes: [],
        createdAt: new Date().toISOString().split('T')[0]
      };

      addUser(newUser);
      setCurrentUser(newUser);
      setUser(newUser);
      return true;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password || 'temp-password',
        options: {
          data: {
            name: userData.name,
            department: userData.department,
            section: userData.section
          }
        }
      });

      if (error) return false;

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: userData.email,
            name: userData.name,
            department: userData.department,
            section: userData.section,
            uploads_count: 0,
            downloads_count: 0,
            starred_departments: [],
            starred_papers: [],
            starred_notes: []
          });

        return !profileError;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    } else {
      setCurrentUser(null);
      setUser(null);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          department: updates.department,
          section: updates.section,
          uploads_count: updates.uploadsCount,
          downloads_count: updates.downloadsCount,
          starred_departments: updates.starredDepartments,
          starred_papers: updates.starredPapers,
          starred_notes: updates.starredNotes
        })
        .eq('id', user.id);

      if (!error) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
      }
    } else {
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
    updateUser,
    loginWithGoogle,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};