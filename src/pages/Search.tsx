import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search as SearchIcon, Download, Star, Filter, BookOpen, FileText, Calendar, User, ExternalLink, X } from 'lucide-react';
import { getPapers, getNotes, downloadFile, viewFile, toggleStarPaper, toggleStarNote } from '@/lib/fileUpload';
import { toast } from 'sonner';

export default function Search() {
  const { user, updateUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [papers, setPapers] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    item: any;
    type: 'paper' | 'note';
  }>({
    isOpen: false,
    item: null,
    type: 'paper'
  });

  const departments = [
    { id: 'commerce', name: 'School of Commerce, Accounting & Finance' },
    { id: 'humanities', name: 'School of Humanities & Social Sciences' },
    { id: 'business', name: 'School of Business & Management' },
    { id: 'biological', name: 'School of Biological & Forensic Science' },
    { id: 'computational', name: 'School of Computational & Physical Sciences' },

  ];

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [papersResult, notesResult] = await Promise.all([
          getPapers({ limit: 100 }),
          getNotes({ limit: 100 })
        ]);

        if (papersResult.error) {
          console.error('Error loading papers:', papersResult.error);
          toast.error('Failed to load papers');
        } else {
          setPapers(papersResult.data);
        }

        if (notesResult.error) {
          console.error('Error loading notes:', notesResult.error);
          toast.error('Failed to load notes');
        } else {
          setNotes(notesResult.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and search function
  const filterItems = (items: any[], query: string): any[] => {
    return items.filter(item => {
      const matchesSearch = !query ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subject.toLowerCase().includes(query.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(query.toLowerCase())) ||
        (item.content && item.content.toLowerCase().includes(query.toLowerCase()));

      const matchesDepartment = selectedDepartment === 'all' || item.department_id === selectedDepartment;
      const matchesSection = selectedSection === 'all' || (item.tags && item.tags.includes(selectedSection));

      return matchesSearch && matchesDepartment && matchesSection;
    });
  };

  // Sort function
  const sortItems = (items: any[]): any[] => {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'popular':
          return (b.downloads || 0) - (a.downloads || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const filteredPapers = useMemo(() => {
    return sortItems(filterItems(papers, searchQuery));
  }, [papers, searchQuery, selectedDepartment, selectedSection, sortBy]);

  const filteredNotes = useMemo(() => {
    return sortItems(filterItems(notes, searchQuery));
  }, [notes, searchQuery, selectedDepartment, selectedSection, sortBy]);

  const handleStarToggle = async (itemId: string, type: 'paper' | 'note') => {
    if (!user) {
      toast.error('Please login to star items');
      return;
    }

    try {
      let success = false;
      let isCurrentlyStarred = false;

      if (type === 'paper') {
        isCurrentlyStarred = user.starredPapers.includes(itemId);
        success = await toggleStarPaper(user.id, itemId);
      } else {
        isCurrentlyStarred = user.starredNotes.includes(itemId);
        success = await toggleStarNote(user.id, itemId);
      }

      if (success) {
        // Update local user state
        let newStarredPapers = [...user.starredPapers];
        let newStarredNotes = [...user.starredNotes];

        if (type === 'paper') {
          if (isCurrentlyStarred) {
            newStarredPapers = newStarredPapers.filter(id => id !== itemId);
            toast.success('Removed from starred papers');
          } else {
            newStarredPapers.push(itemId);
            toast.success('Added to starred papers');
          }
        } else {
          if (isCurrentlyStarred) {
            newStarredNotes = newStarredNotes.filter(id => id !== itemId);
            toast.success('Removed from starred notes');
          } else {
            newStarredNotes.push(itemId);
            toast.success('Added to starred notes');
          }
        }

        // Update user context
        updateUser({
          starredPapers: newStarredPapers,
          starredNotes: newStarredNotes
        });
      } else {
        toast.error('Failed to update star status. Please try again.');
      }
    } catch (error) {
      console.error('Error toggling star:', error);
      toast.error('An error occurred while updating star status');
    }
  };

  const handleItemView = async (item: any, type: 'paper' | 'note') => {
    try {
      // Open modal for preview
      setPreviewModal({
        isOpen: true,
        item,
        type
      });

      // Optionally track the view
      if (user?.id) {
        console.log('File viewed by user:', user.id);
      }
    } catch (error) {
      console.error('View error:', error);
      toast.error('Failed to open preview');
    }
  };

  const handleItemDownload = async (item: any, type: 'paper' | 'note') => {
    if (!user) {
      toast.error('Please login to download files');
      return;
    }

    try {
      // Open file in new tab for download
      if (item.file_url) {
        window.open(item.file_url, '_blank');

        // Track the download
        const success = await downloadFile(item, type, user.id);

        if (success) {
          // Update local state to reflect new download count
          if (type === 'paper') {
            setPapers(prev => prev.map(p =>
              p.id === item.id ? { ...p, downloads: (p.downloads || 0) + 1 } : p
            ));
          } else {
            setNotes(prev => prev.map(n =>
              n.id === item.id ? { ...n, downloads: (n.downloads || 0) + 1 } : n
            ));
          }

          toast.success(`${type === 'paper' ? 'Paper' : 'Notes'} opened for download!`);
        } else {
          toast.error('Failed to track download');
        }
      } else {
        toast.error('File URL not available');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const getDepartmentName = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : 'Unknown Department';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
            Search Resources
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            Find papers, notes, and study materials from your community
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 sm:mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg dark:border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <Input
                  placeholder="Search by title, course code, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="h-9 sm:h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="all" className="dark:text-white dark:focus:bg-gray-600">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id} className="dark:text-white dark:focus:bg-gray-600">
                          {truncateText(dept.name, 30)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Section</label>
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger className="h-9 sm:h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="All Sections" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="all" className="dark:text-white dark:focus:bg-gray-600">All Sections</SelectItem>
                      <SelectItem value="UG" className="dark:text-white dark:focus:bg-gray-600">Undergraduate</SelectItem>
                      <SelectItem value="PG" className="dark:text-white dark:focus:bg-gray-600">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-9 sm:h-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem value="recent" className="dark:text-white dark:focus:bg-gray-600">Most Recent</SelectItem>
                      <SelectItem value="popular" className="dark:text-white dark:focus:bg-gray-600">Most Popular</SelectItem>
                      <SelectItem value="title" className="dark:text-white dark:focus:bg-gray-600">Title A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Actions</label>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedDepartment('all');
                      setSelectedSection('all');
                      setSortBy('recent');
                    }}
                    className="w-full h-9 sm:h-10 text-sm dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Tabs defaultValue="papers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
            <TabsTrigger value="papers" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Papers ({loading ? '...' : filteredPapers.length})
            </TabsTrigger>
            <TabsTrigger value="notes" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Notes ({loading ? '...' : filteredNotes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="papers" className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPapers.length === 0 ? (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg dark:border-gray-700">
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No papers found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {papers.length === 0 ? 'No papers have been uploaded yet. Be the first to share!' : 'Try adjusting your search criteria or filters.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredPapers.map((paper) => (
                  <Card key={paper.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 dark:border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {truncateText(paper.title, 50)}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStarToggle(paper.id, 'paper')}
                          className={`flex-shrink-0 ml-2 ${user && user.starredPapers.includes(paper.id)
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-500'
                            }`}
                        >
                          <Star
                            className="h-4 w-4"
                            fill={user && user.starredPapers.includes(paper.id) ? 'currentColor' : 'none'}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-200">
                          {paper.subject}
                        </Badge>
                        <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                          {getDepartmentName(paper.department_id)}
                        </Badge>
                        {paper.tags && paper.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-2" />
                          <span>{paper.uploader?.name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span>{new Date(paper.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Download className="h-3 w-3 mr-2" />
                          <span>{paper.downloads || 0} downloads</span>
                        </div>
                      </div>

                      {paper.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {truncateText(paper.description, 80)}
                        </p>
                      )}

                      <div className="pt-2 space-y-2">
                        <Button
                          onClick={() => handleItemView(paper, 'paper')}
                          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm"
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Paper
                        </Button>
                        <Button
                          onClick={() => handleItemDownload(paper, 'paper')}
                          variant="outline"
                          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950 text-sm"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Paper
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredNotes.length === 0 ? (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg dark:border-gray-700">
                <CardContent className="p-8 text-center">
                  <FileText className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No notes found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {notes.length === 0 ? 'No notes have been uploaded yet. Be the first to share!' : 'Try adjusting your search criteria or filters.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredNotes.map((note) => (
                  <Card key={note.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 dark:border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {truncateText(note.title, 50)}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStarToggle(note.id, 'note')}
                          className={`flex-shrink-0 ml-2 ${user && user.starredNotes.includes(note.id)
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-500'
                            }`}
                        >
                          <Star
                            className="h-4 w-4"
                            fill={user && user.starredNotes.includes(note.id) ? 'currentColor' : 'none'}
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-200">
                          {note.subject}
                        </Badge>
                        <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                          {getDepartmentName(note.department_id)}
                        </Badge>
                        {note.tags && note.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-2" />
                          <span>{note.uploader?.name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span>{new Date(note.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Download className="h-3 w-3 mr-2" />
                          <span>{note.downloads || 0} downloads</span>
                        </div>
                      </div>

                      {note.content && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {truncateText(note.content, 120)}
                        </p>
                      )}

                      <div className="pt-2 space-y-2">
                        <Button
                          onClick={() => handleItemView(note, 'note')}
                          className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white text-sm"
                          size="sm"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Notes
                        </Button>
                        <Button
                          onClick={() => handleItemDownload(note, 'note')}
                          variant="outline"
                          className="w-full border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950 text-sm"
                          size="sm"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Notes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewModal.isOpen} onOpenChange={(open) => setPreviewModal(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center justify-between">
              <span>{previewModal.item?.title || 'Preview'}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewModal(prev => ({ ...prev, isOpen: false }))}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 p-6">
            {previewModal.item?.file_url ? (
              <iframe
                src={previewModal.item.file_url}
                className="w-full h-full border-0 rounded-lg"
                title="File Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Preview not available</p>
                  <Button
                    onClick={() => {
                      if (previewModal.item?.file_url) {
                        window.open(previewModal.item.file_url, '_blank');
                      }
                    }}
                    className="mt-4"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}