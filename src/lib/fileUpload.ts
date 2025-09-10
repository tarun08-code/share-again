import { supabase } from './supabase';
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

/**
 * Upload a file to Supabase Storage and create a database record
 */
export async function uploadFile(data: FileUploadData): Promise<UploadResult> {
  try {
    const { file, uploaderId, type } = data;

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uploaderId}/${uuidv4()}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('papers')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return {
        success: false,
        error: `Failed to upload file: ${uploadError.message}`
      };
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('papers')
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      return {
        success: false,
        error: 'Failed to get file URL'
      };
    }

    // Create database record
    const dbData = {
      title: data.title,
      description: data.description || '',
      department_id: data.department,
      subject: data.courseCode,
      type: data.type,
      file_url: urlData.publicUrl,
      uploader_id: uploaderId,
      tags: [data.section, data.year, data.courseCode]
    };

    if (type === 'paper') {
      const { error: dbError } = await supabase
        .from('papers')
        .insert(dbData);

      if (dbError) {
        console.error('Database error:', dbError);
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('papers').remove([fileName]);
        return {
          success: false,
          error: `Failed to save to database: ${dbError.message}`
        };
      }
    } else {
      // For notes, use the notes table
      const { title, description, department_id, subject, uploader_id, tags, file_url } = dbData;
      const { error: dbError } = await supabase
        .from('notes')
        .insert({
          title,
          content: description,
          department_id,
          subject,
          file_url,
          uploader_id,
          tags
        });

      if (dbError) {
        console.error('Database error:', dbError);
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('papers').remove([fileName]);
        return {
          success: false,
          error: `Failed to save to database: ${dbError.message}`
        };
      }
    }

    // Update user stats
    await incrementUserStats(uploaderId, 'uploads', 1);

    return {
      success: true,
      fileUrl: urlData.publicUrl
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
    const { error } = await supabase.rpc('increment_user_stats', {
      user_id: userId,
      stat_type: statType,
      increment_by: incrementBy
    });

    if (error) {
      console.error('Error updating user stats:', error);
      return false;
    }

    return true;
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

    // Track the download in database first
    const trackingSuccess = await handleDownloadTracking(contentType, item.id, userId);

    if (trackingSuccess) {
      console.log('Download tracked successfully');
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
    const { error } = await supabase.rpc('increment_download_count', {
      content_type: contentType,
      content_id: contentId,
      user_id: userId
    });

    if (error) {
      console.error('Error handling download tracking:', error);
      return false;
    }

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

    // Optionally track as a view (without download count increase)
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
 * Get papers from database with filters
 */
export async function getPapers(filters?: {
  department?: string;
  subject?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase
      .from('papers')
      .select(`
        *,
        uploader:users(name)
      `)
      .order('created_at', { ascending: false });

    if (filters?.department) {
      query = query.eq('department_id', filters.department);
    }

    if (filters?.subject) {
      query = query.eq('subject', filters.subject);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching papers:', error);
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Unexpected error fetching papers:', error);
    return { data: [], error: 'An unexpected error occurred' };
  }
}

/**
 * Get notes from database with filters
 */
export async function getNotes(filters?: {
  department?: string;
  subject?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabase
      .from('notes')
      .select(`
        *,
        uploader:users(name)
      `)
      .order('created_at', { ascending: false });

    if (filters?.department) {
      query = query.eq('department_id', filters.department);
    }

    if (filters?.subject) {
      query = query.eq('subject', filters.subject);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notes:', error);
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
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

    const results: { papers: any[], notes: any[] } = { papers: [], notes: [] };

    if (searchType === 'papers' || searchType === 'both') {
      let papersQuery = supabase
        .from('papers')
        .select(`
          *,
          uploader:users(name)
        `)
        .or(`title.ilike.%${query}%, description.ilike.%${query}%, subject.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (searchFilters.department) {
        papersQuery = papersQuery.eq('department_id', searchFilters.department);
      }

      const { data: papersData, error: papersError } = await papersQuery;

      if (papersError) {
        console.error('Error searching papers:', papersError);
      } else {
        results.papers = papersData || [];
      }
    }

    if (searchType === 'notes' || searchType === 'both') {
      let notesQuery = supabase
        .from('notes')
        .select(`
          *,
          uploader:users(name)
        `)
        .or(`title.ilike.%${query}%, content.ilike.%${query}%, subject.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (searchFilters.department) {
        notesQuery = notesQuery.eq('department_id', searchFilters.department);
      }

      const { data: notesData, error: notesError } = await notesQuery;

      if (notesError) {
        console.error('Error searching notes:', notesError);
      } else {
        results.notes = notesData || [];
      }
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

    // Get current user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('starred_papers')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return false;
    }

    const currentStarredPapers = userData.starred_papers || [];
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

    // Update user's starred papers
    const { error: updateError } = await supabase
      .from('users')
      .update({ starred_papers: newStarredPapers })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating starred papers:', updateError);
      return false;
    }

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
    // Get current user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('starred_notes')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return false;
    }

    const currentStarredNotes = userData.starred_notes || [];
    const isCurrentlyStarred = currentStarredNotes.includes(noteId);

    let newStarredNotes;
    if (isCurrentlyStarred) {
      // Remove from starred notes
      newStarredNotes = currentStarredNotes.filter((id: string) => id !== noteId);
    } else {
      // Add to starred notes
      newStarredNotes = [...currentStarredNotes, noteId];
    }

    // Update user's starred notes
    const { error: updateError } = await supabase
      .from('users')
      .update({ starred_notes: newStarredNotes })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating starred notes:', updateError);
      return false;
    }

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
    // First get user's starred papers list
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('starred_papers')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data for starred papers:', userError);
      return { data: [], error: null };
    }

    if (!userData || !userData.starred_papers || userData.starred_papers.length === 0) {
      return { data: [], error: null };
    }

    // Filter out any invalid UUIDs and ensure we have valid UUIDs
    const validStarredPapers = userData.starred_papers.filter((id: string) => {
      // Check if it's a valid UUID format (36 characters with 4 hyphens)
      return id && typeof id === 'string' && id.length === 36 && id.includes('-');
    });

    if (validStarredPapers.length === 0) {
      return { data: [], error: null };
    }

    console.log('Fetching starred papers for user:', userId, 'with IDs:', validStarredPapers);

    // Then fetch the actual paper data
    const { data: papers, error: papersError } = await supabase
      .from('papers')
      .select(`
        *,
        uploader:users(name)
      `)
      .in('id', validStarredPapers)
      .order('created_at', { ascending: false });

    if (papersError) {
      console.error('Error fetching starred papers:', papersError);
      return { data: [], error: null }; // Return empty array instead of error to prevent UI issues
    }

    return { data: papers || [], error: null };
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
    // First get user's starred notes list
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('starred_notes')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data for starred notes:', userError);
      return { data: [], error: null };
    }

    if (!userData || !userData.starred_notes || userData.starred_notes.length === 0) {
      return { data: [], error: null };
    }

    // Filter out any invalid UUIDs
    const validStarredNotes = userData.starred_notes.filter((id: string) => {
      return id && typeof id === 'string' && id.length === 36 && id.includes('-');
    });

    if (validStarredNotes.length === 0) {
      return { data: [], error: null };
    }

    console.log('Fetching starred notes for user:', userId, 'with IDs:', validStarredNotes);

    // Then fetch the actual note data
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select(`
        *,
        uploader:users(name)
      `)
      .in('id', validStarredNotes)
      .order('created_at', { ascending: false });

    if (notesError) {
      console.error('Error fetching starred notes:', notesError);
      return { data: [], error: null }; // Return empty array instead of error
    }

    return { data: notes || [], error: null };
  } catch (error) {
    console.error('Unexpected error fetching starred notes:', error);
    return { data: [], error: null };
  }
}
