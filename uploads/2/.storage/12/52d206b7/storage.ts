import { User, Paper, Note } from '@/types';
import { mockUsers, mockPapers, mockNotes } from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'papershare_current_user',
  USERS: 'papershare_users',
  PAPERS: 'papershare_papers',
  NOTES: 'papershare_notes'
};

// Initialize mock data if not exists
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PAPERS)) {
    localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(mockPapers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTES)) {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(mockNotes));
  }
};

// User management
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getUsers = (): User[] => {
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
  return usersStr ? JSON.parse(usersStr) : [];
};

export const addUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const updateUser = (userId: string, updates: Partial<User>) => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // Update current user if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(users[userIndex]);
    }
  }
};

// Papers management
export const getPapers = (): Paper[] => {
  const papersStr = localStorage.getItem(STORAGE_KEYS.PAPERS);
  return papersStr ? JSON.parse(papersStr) : [];
};

export const addPaper = (paper: Paper) => {
  const papers = getPapers();
  papers.push(paper);
  localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(papers));
};

// Notes management
export const getNotes = (): Note[] => {
  const notesStr = localStorage.getItem(STORAGE_KEYS.NOTES);
  return notesStr ? JSON.parse(notesStr) : [];
};

export const addNote = (note: Note) => {
  const notes = getNotes();
  notes.push(note);
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
};

// Star/Unstar functionality
export const toggleStarDepartment = (userId: string, departmentId: string) => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    const isStarred = user.starredDepartments.includes(departmentId);
    if (isStarred) {
      user.starredDepartments = user.starredDepartments.filter(id => id !== departmentId);
    } else {
      user.starredDepartments.push(departmentId);
    }
    updateUser(userId, { starredDepartments: user.starredDepartments });
  }
};

export const toggleStarPaper = (userId: string, paperId: string) => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    const isStarred = user.starredPapers.includes(paperId);
    if (isStarred) {
      user.starredPapers = user.starredPapers.filter(id => id !== paperId);
    } else {
      user.starredPapers.push(paperId);
    }
    updateUser(userId, { starredPapers: user.starredPapers });
  }
};

export const toggleStarNote = (userId: string, noteId: string) => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    const isStarred = user.starredNotes.includes(noteId);
    if (isStarred) {
      user.starredNotes = user.starredNotes.filter(id => id !== noteId);
    } else {
      user.starredNotes.push(noteId);
    }
    updateUser(userId, { starredNotes: user.starredNotes });
  }
};