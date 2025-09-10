import { Department, Paper, Note, User } from '@/types';

export const departments: Department[] = [
  {
    id: 'commerce',
    name: 'School of Commerce, Accounting & Finance',
    description: 'Business, Commerce, Accounting, Finance, and related subjects',
    paperCount: 45,
    noteCount: 78
  },
  {
    id: 'humanities',
    name: 'School of Humanities & Social Sciences',
    description: 'Literature, History, Psychology, Sociology, and Social Sciences',
    paperCount: 38,
    noteCount: 62
  },
  {
    id: 'business',
    name: 'School of Business & Management',
    description: 'MBA, Management, Marketing, HR, and Business Studies',
    paperCount: 52,
    noteCount: 89
  },
  {
    id: 'biological',
    name: 'School of Biological & Forensic Science',
    description: 'Biology, Biotechnology, Forensic Science, and Life Sciences',
    paperCount: 41,
    noteCount: 67
  },
  {
    id: 'computational',
    name: 'School of Computational & Physical Sciences',
    description: 'Computer Science, Physics, Mathematics, and Engineering',
    paperCount: 67,
    noteCount: 94
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    department: 'computational',
    section: 'UG',
    uploadsCount: 15,
    downloadsCount: 45,
    starredDepartments: ['computational', 'business'],
    starredPapers: ['1', '3'],
    starredNotes: ['2', '4'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    department: 'business',
    section: 'PG',
    uploadsCount: 22,
    downloadsCount: 38,
    starredDepartments: ['business', 'commerce'],
    starredPapers: ['2', '4'],
    starredNotes: ['1', '3'],
    createdAt: '2024-02-10'
  }
];

export const mockPapers: Paper[] = [
  {
    id: '1',
    title: 'Data Structures and Algorithms Final Exam',
    courseCode: 'CS301',
    department: 'computational',
    section: 'UG',
    year: '2023',
    uploadedBy: '1',
    uploaderName: 'John Doe',
    uploadDate: '2024-03-15',
    downloads: 125,
    additionalDetails: 'Semester 6 final examination paper'
  },
  {
    id: '2',
    title: 'Strategic Management Mid-term',
    courseCode: 'MBA502',
    department: 'business',
    section: 'PG',
    year: '2023',
    uploadedBy: '2',
    uploaderName: 'Jane Smith',
    uploadDate: '2024-03-10',
    downloads: 89,
    additionalDetails: 'Mid-semester examination'
  },
  {
    id: '3',
    title: 'Financial Accounting Question Paper',
    courseCode: 'ACC201',
    department: 'commerce',
    section: 'UG',
    year: '2023',
    uploadedBy: '1',
    uploaderName: 'John Doe',
    uploadDate: '2024-03-08',
    downloads: 156,
    additionalDetails: 'Annual examination paper'
  }
];

export const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Complete Notes on Machine Learning',
    courseCode: 'CS401',
    department: 'computational',
    section: 'UG',
    uploadedBy: '2',
    uploaderName: 'Jane Smith',
    uploadDate: '2024-03-12',
    downloads: 234,
    additionalDetails: 'Comprehensive notes covering all topics'
  },
  {
    id: '2',
    title: 'Marketing Management Study Notes',
    courseCode: 'MBA301',
    department: 'business',
    section: 'PG',
    uploadedBy: '1',
    uploaderName: 'John Doe',
    uploadDate: '2024-03-14',
    downloads: 178,
    additionalDetails: 'Chapter-wise summary notes'
  },
  {
    id: '3',
    title: 'Organic Chemistry Lab Manual',
    courseCode: 'BIO202',
    department: 'biological',
    section: 'UG',
    uploadedBy: '2',
    uploaderName: 'Jane Smith',
    uploadDate: '2024-03-11',
    downloads: 145,
    additionalDetails: 'Complete lab procedures and observations'
  }
];