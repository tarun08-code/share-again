export interface User {
  id: string;
  email: string;
  name: string;
  department: string;
  section: 'UG' | 'PG';
  uploadsCount: number;
  downloadsCount: number;
  starredDepartments: string[];
  starredPapers: string[];
  starredNotes: string[];
  createdAt: string;
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
  section: 'UG' | 'PG';
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
  section: 'UG' | 'PG';
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
  register: (userData: Omit<User, 'id' | 'uploadsCount' | 'downloadsCount' | 'starredDepartments' | 'starredPapers' | 'starredNotes' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}