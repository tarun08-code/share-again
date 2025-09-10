export interface User {
  id: string;
  email: string;
  name: string;
  department: string;
  section: string;
  uploadsCount: number;
  downloadsCount: number;
  points: number; // Added missing points field
  starredDepartments: string[];
  starredPapers: string[];
  starredNotes: string[];
  createdAt: string;
  password?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  paperCount: number;
  noteCount: number;
}

export interface Paper {
  id: string;
  title: string;
  courseCode: string;
  department: string;
  section: string;
  year: string;
  uploadedBy: string;
  uploaderName: string;
  uploadDate: string;
  downloads: number;
  additionalDetails?: string;
  fileUrl?: string;
}

export interface Note {
  id: string;
  title: string;
  courseCode: string;
  department: string;
  section: string;
  uploadedBy: string;
  uploaderName: string;
  uploadDate: string;
  downloads: number;
  additionalDetails?: string;
  fileUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'uploadsCount' | 'downloadsCount' | 'points' | 'starredDepartments' | 'starredPapers' | 'starredNotes' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  loginWithGoogle?: () => Promise<boolean>;
  loading?: boolean;
}