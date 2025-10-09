import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  error?: string;
}

export interface FileUploadData {
  title: string;
  courseCode: string;
  department: string;
  section: string;
  year: string;
  type: 'paper' | 'notes';
  description?: string;
  file: File;
  uploaderId: string;
}

// Mock data interfaces
interface Paper {
  id: string;
  title: string;
  description: string;
  department_id: string;
  subject: string;
  type: string;
  file_url: string;
  thumbnail_url?: string;
  upload_date: string;
  uploader_id: string;
  downloads: number;
  tags: string[];
  uploader?: { name: string };
}

interface Note {
  id: string;
  title: string;
  content: string;
  department_id: string;
  subject: string;
  upload_date: string;
  uploader_id: string;
  downloads: number;
  tags: string[];
  file_url?: string;
  uploader?: { name: string };
}

// Local storage helpers
const getPapersFromStorage = (): Paper[] => {
  try {
    const papers = localStorage.getItem('papers');
    return papers ? JSON.parse(papers) : [];
  } catch {
    return [];
  }
};

const savePapersToStorage = (papers: Paper[]) => {
  localStorage.setItem('papers', JSON.stringify(papers));
};

const getNotesFromStorage = (): Note[] => {
  try {
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
  } catch {
    return [];
  }
};

const saveNotesToStorage = (notes: Note[]) => {
  localStorage.setItem('notes', JSON.stringify(notes));
};

const getUsersFromStorage = () => {
  try {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

const saveUsersToStorage = (users: any[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

/**
 * Mock file upload - in a real app, this would upload to a cloud service
 */
export async function uploadFile(data: FileUploadData): Promise<UploadResult> {
  try {
    const { file, uploaderId, type } = data;

    // Simulate file upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock file URL (in real app, this would be the actual uploaded file URL)
    const mockFileUrl = `https://mock-storage.com/files/${uploaderId}/${uuidv4()}.${file.name.split('.').pop()}`;

    // Create database record
    const id = uuidv4();
    const uploadDate = new Date().toISOString();

    if (type === 'paper') {
      const papers = getPapersFromStorage();
      const newPaper: Paper = {
        id,
        title: data.title,
        description: data.description || '',
        department_id: data.department,
        subject: data.courseCode,
        type: data.type,
        file_url: mockFileUrl,
        upload_date: uploadDate,
        uploader_id: uploaderId,
        downloads: 0,
        tags: [data.section, data.year, data.courseCode]
      };
      papers.push(newPaper);
      savePapersToStorage(papers);
    } else {
      const notes = getNotesFromStorage();
      const newNote: Note = {
        id,
        title: data.title,
        content: data.description || '',
        department_id: data.department,
        subject: data.courseCode,
        file_url: mockFileUrl,
        upload_date: uploadDate,
        uploader_id: uploaderId,
        downloads: 0,
        tags: [data.section, data.year, data.courseCode]
      };
      notes.push(newNote);
      saveNotesToStorage(notes);
    }

    // Update user stats
    await incrementUserStats(uploaderId, 'uploads', 1);

    return {
      success: true,
      fileUrl: mockFileUrl
    };

  } catch (error) {
    console.error('Unexpected error during upload:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during upload'
    };
  }
}

/**
 * Increment user statistics (uploads, downloads, points)
 */
export async function incrementUserStats(
  userId: string,
  statType: 'uploads' | 'downloads',
  incrementBy: number = 1
): Promise<boolean> {
  try {
    const users = getUsersFromStorage();
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex !== -1) {
      if (statType === 'uploads') {
        users[userIndex].uploadsCount = (users[userIndex].uploadsCount || 0) + incrementBy;
        users[userIndex].points = (users[userIndex].points || 0) + (incrementBy * 5); // 5 points per upload
      } else if (statType === 'downloads') {
        users[userIndex].downloadsCount = (users[userIndex].downloadsCount || 0) + incrementBy;
        users[userIndex].points = (users[userIndex].points || 0) + (incrementBy * 1); // 1 point per download
      }
      saveUsersToStorage(users);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Unexpected error updating user stats:', error);
    return false;
  }
}

/**
 * Download a file and track the download
 */
export async function downloadFile(
  item: any,
  contentType: 'paper' | 'note',
  userId: string
): Promise<boolean> {
  try {
    if (!item.file_url) {
      console.error('No file URL available for download');
      return false;
    }

    console.log('Starting download for:', { contentType, itemId: item.id, userId, fileUrl: item.file_url });

    // Track the download in local storage
    const trackingSuccess = await handleDownloadTracking(contentType, item.id, userId);

    if (trackingSuccess) {
      console.log('Download tracked successfully');
      // In a real app, you would trigger the actual file download here
      window.open(item.file_url, '_blank');
    } else {
      console.warn('Download tracking failed, but continuing with download');
    }

    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    return false;
  }
}

/**
 * Increment download count for content and award points to user
 */
export async function handleDownloadTracking(
  contentType: 'paper' | 'note',
  contentId: string,
  userId: string
): Promise<boolean> {
  try {
    if (contentType === 'paper') {
      const papers = getPapersFromStorage();
      const paperIndex = papers.findIndex(p => p.id === contentId);
      if (paperIndex !== -1) {
        papers[paperIndex].downloads = (papers[paperIndex].downloads || 0) + 1;
        savePapersToStorage(papers);
      }
    } else {
      const notes = getNotesFromStorage();
      const noteIndex = notes.findIndex(n => n.id === contentId);
      if (noteIndex !== -1) {
        notes[noteIndex].downloads = (notes[noteIndex].downloads || 0) + 1;
        saveNotesToStorage(notes);
      }
    }

    // Award points to downloading user
    await incrementUserStats(userId, 'downloads', 1);
    return true;
  } catch (error) {
    console.error('Unexpected error handling download tracking:', error);
    return false;
  }
}

/**
 * View/Preview a file in new tab
 */
export async function viewFile(
  item: any,
  contentType: 'paper' | 'note',
  userId?: string
): Promise<boolean> {
  try {
    if (!item.file_url) {
      console.error('No file URL available for viewing');
      return false;
    }

    console.log('Opening file for viewing:', { contentType, itemId: item.id, fileUrl: item.file_url });

    // Open file in new tab
    window.open(item.file_url, '_blank');

    if (userId) {
      console.log('File viewed by user:', userId);
    }

    return true;
  } catch (error) {
    console.error('Error viewing file:', error);
    return false;
  }
}

/**
 * Get papers from local storage with filters
 */
export async function getPapers(filters?: {
  department?: string;
  subject?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let papers = getPapersFromStorage();
    const users = getUsersFromStorage();

    // Add uploader name to papers
    papers = papers.map(paper => ({
      ...paper,
      uploader: { name: users.find((u: any) => u.id === paper.uploader_id)?.name || 'Unknown' }
    }));

    // Apply filters
    if (filters?.department) {
      papers = papers.filter(p => p.department_id === filters.department);
    }

    if (filters?.subject) {
      papers = papers.filter(p => p.subject === filters.subject);
    }

    // Sort by upload date (newest first)
    papers.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());

    // Apply pagination
    if (filters?.offset !== undefined && filters?.limit !== undefined) {
      papers = papers.slice(filters.offset, filters.offset + filters.limit);
    } else if (filters?.limit) {
      papers = papers.slice(0, filters.limit);
    }

    return { data: papers, error: null };
  } catch (error) {
    console.error('Unexpected error fetching papers:', error);
    return { data: [], error: 'An unexpected error occurred' };
  }
}

/**
 * Get notes from local storage with filters
 */
export async function getNotes(filters?: {
  department?: string;
  subject?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let notes = getNotesFromStorage();
    const users = getUsersFromStorage();

    // Add uploader name to notes
    notes = notes.map(note => ({
      ...note,
      uploader: { name: users.find((u: any) => u.id === note.uploader_id)?.name || 'Unknown' }
    }));

    // Apply filters
    if (filters?.department) {
      notes = notes.filter(n => n.department_id === filters.department);
    }

    if (filters?.subject) {
      notes = notes.filter(n => n.subject === filters.subject);
    }

    // Sort by upload date (newest first)
    notes.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());

    // Apply pagination
    if (filters?.offset !== undefined && filters?.limit !== undefined) {
      notes = notes.slice(filters.offset, filters.offset + filters.limit);
    } else if (filters?.limit) {
      notes = notes.slice(0, filters.limit);
    }

    return { data: notes, error: null };
  } catch (error) {
    console.error('Unexpected error fetching notes:', error);
    return { data: [], error: 'An unexpected error occurred' };
  }
}

/**
 * Search papers and notes
 */
export async function searchContent(
  query: string,
  filters?: {
    type?: 'papers' | 'notes' | 'both';
    department?: string;
    limit?: number;
  }
) {
  try {
    const searchFilters = filters || {};
    const limit = searchFilters.limit || 20;
    const searchType = searchFilters.type || 'both';

    const results: { papers: Paper[], notes: Note[] } = { papers: [], notes: [] };
    const users = getUsersFromStorage();

    if (searchType === 'papers' || searchType === 'both') {
      let papers = getPapersFromStorage();
      
      // Filter by search query
      papers = papers.filter(paper => 
        paper.title.toLowerCase().includes(query.toLowerCase()) ||
        paper.description.toLowerCase().includes(query.toLowerCase()) ||
        paper.subject.toLowerCase().includes(query.toLowerCase())
      );

      // Apply department filter
      if (searchFilters.department) {
        papers = papers.filter(p => p.department_id === searchFilters.department);
      }

      // Add uploader names
      papers = papers.map(paper => ({
        ...paper,
        uploader: { name: users.find((u: any) => u.id === paper.uploader_id)?.name || 'Unknown' }
      }));

      // Sort and limit
      papers.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
      results.papers = papers.slice(0, limit);
    }

    if (searchType === 'notes' || searchType === 'both') {
      let notes = getNotesFromStorage();
      
      // Filter by search query
      notes = notes.filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.subject.toLowerCase().includes(query.toLowerCase())
      );

      // Apply department filter
      if (searchFilters.department) {
        notes = notes.filter(n => n.department_id === searchFilters.department);
      }

      // Add uploader names
      notes = notes.map(note => ({
        ...note,
        uploader: { name: users.find((u: any) => u.id === note.uploader_id)?.name || 'Unknown' }
      }));

      // Sort and limit
      notes.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
      results.notes = notes.slice(0, limit);
    }

    return { data: results, error: null };
  } catch (error) {
    console.error('Unexpected error searching content:', error);
    return { data: { papers: [], notes: [] }, error: 'An unexpected error occurred' };
  }
}

/**
 * Toggle star status for a paper
 */
export async function toggleStarPaper(userId: string, paperId: string): Promise<boolean> {
  try {
    console.log('Toggling star for paper:', { userId, paperId });

    const users = getUsersFromStorage();
    const userIndex = users.findIndex((u: any) => u.id === userId);

    if (userIndex === -1) {
      console.error('User not found');
      return false;
    }

    const currentStarredPapers = users[userIndex].starredPapers || [];
    const isCurrentlyStarred = currentStarredPapers.includes(paperId);

    console.log('Current starred papers:', currentStarredPapers);
    console.log('Is currently starred:', isCurrentlyStarred);

    let newStarredPapers;
    if (isCurrentlyStarred) {
      // Remove from starred papers
      newStarredPapers = currentStarredPapers.filter((id: string) => id !== paperId);
      console.log('Removing from starred, new array:', newStarredPapers);
    } else {
      // Add to starred papers
      newStarredPapers = [...currentStarredPapers, paperId];
      console.log('Adding to starred, new array:', newStarredPapers);
    }

    users[userIndex].starredPapers = newStarredPapers;
    saveUsersToStorage(users);

    console.log('Successfully updated starred papers');
    return true;
  } catch (error) {
    console.error('Unexpected error toggling star for paper:', error);
    return false;
  }
}/**
 * Toggle star status for a note
 */
export async function toggleStarNote(userId: string, noteId: string): Promise<boolean> {
  try {
    const users = getUsersFromStorage();
    const userIndex = users.findIndex((u: any) => u.id === userId);

    if (userIndex === -1) {
      console.error('User not found');
      return false;
    }

    const currentStarredNotes = users[userIndex].starredNotes || [];
    const isCurrentlyStarred = currentStarredNotes.includes(noteId);

    let newStarredNotes;
    if (isCurrentlyStarred) {
      // Remove from starred notes
      newStarredNotes = currentStarredNotes.filter((id: string) => id !== noteId);
    } else {
      // Add to starred notes
      newStarredNotes = [...currentStarredNotes, noteId];
    }

    users[userIndex].starredNotes = newStarredNotes;
    saveUsersToStorage(users);

    return true;
  } catch (error) {
    console.error('Unexpected error toggling star for note:', error);
    return false;
  }
}

/**
 * Get starred papers for a user
 */
export async function getStarredPapers(userId: string) {
  try {
    const users = getUsersFromStorage();
    const user = users.find((u: any) => u.id === userId);

    if (!user || !user.starredPapers || user.starredPapers.length === 0) {
      return { data: [], error: null };
    }

    const papers = getPapersFromStorage();
    const starredPapers = papers.filter(paper => user.starredPapers.includes(paper.id));

    // Add uploader names
    const starredPapersWithUploaders = starredPapers.map(paper => ({
      ...paper,
      uploader: { name: users.find((u: any) => u.id === paper.uploader_id)?.name || 'Unknown' }
    }));

    // Sort by upload date (newest first)
    starredPapersWithUploaders.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());

    return { data: starredPapersWithUploaders, error: null };
  } catch (error) {
    console.error('Unexpected error fetching starred papers:', error);
    return { data: [], error: null };
  }
}

/**
 * Get starred notes for a user
 */
export async function getStarredNotes(userId: string) {
  try {
    const users = getUsersFromStorage();
    const user = users.find((u: any) => u.id === userId);

    if (!user || !user.starredNotes || user.starredNotes.length === 0) {
      return { data: [], error: null };
    }

    const notes = getNotesFromStorage();
    const starredNotes = notes.filter(note => user.starredNotes.includes(note.id));

    // Add uploader names
    const starredNotesWithUploaders = starredNotes.map(note => ({
      ...note,
      uploader: { name: users.find((u: any) => u.id === note.uploader_id)?.name || 'Unknown' }
    }));

    // Sort by upload date (newest first)
    starredNotesWithUploaders.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());

    return { data: starredNotesWithUploaders, error: null };
  } catch (error) {
    console.error('Unexpected error fetching starred notes:', error);
    return { data: [], error: null };
  }
}
