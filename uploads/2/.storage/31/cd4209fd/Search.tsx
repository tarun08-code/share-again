import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search as SearchIcon, Download, Star, Filter, BookOpen, FileText, Calendar, User } from 'lucide-react';
import { getPapers, getNotes, toggleStarPaper, toggleStarNote } from '@/lib/storage';
import { departments } from '@/lib/mockData';
import { Paper, Note } from '@/types';

export default function Search() {
  const { user, updateUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const papers = getPapers();
  const notes = getNotes();

  // Filter and search function
  const filterItems = <T extends Paper | Note>(items: T[], query: string): T[] => {
    return items.filter(item => {
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.courseCode.toLowerCase().includes(query.toLowerCase()) ||
        ('additionalDetails' in item && item.additionalDetails?.toLowerCase().includes(query.toLowerCase()));
      
      const matchesDepartment = selectedDepartment === 'all' || item.department === selectedDepartment;
      const matchesSection = selectedSection === 'all' || item.section === selectedSection;
      
      return matchesSearch && matchesDepartment && matchesSection;
    });
  };

  // Sort function
  const sortItems = <T extends Paper | Note>(items: T[]): T[] => {
    return [...items].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
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

  const handleStarPaper = (paperId: string) => {
    if (user) {
      toggleStarPaper(user.id, paperId);
      const isCurrentlyStarred = user.starredPapers.includes(paperId);
      const newStarredPapers = isCurrentlyStarred
        ? user.starredPapers.filter(id => id !== paperId)
        : [...user.starredPapers, paperId];
      updateUser({ starredPapers: newStarredPapers });
    }
  };

  const handleStarNote = (noteId: string) => {
    if (user) {
      toggleStarNote(user.id, noteId);
      const isCurrentlyStarred = user.starredNotes.includes(noteId);
      const newStarredNotes = isCurrentlyStarred
        ? user.starredNotes.filter(id => id !== noteId)
        : [...user.starredNotes, noteId];
      updateUser({ starredNotes: newStarredNotes });
    }
  };

  const handleDownload = (itemId: string, type: 'paper' | 'note') => {
    // Increment download count logic would go here
    console.log(`Downloading ${type} with ID: ${itemId}`);
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
              Papers ({filteredPapers.length})
            </TabsTrigger>
            <TabsTrigger value="notes" className="dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Notes ({filteredNotes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="papers" className="space-y-4">
            {filteredPapers.length === 0 ? (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg dark:border-gray-700">
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No papers found</h3>
                  <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or filters.</p>
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
                          onClick={() => handleStarPaper(paper.id)}
                          className={`flex-shrink-0 ml-2 ${
                            user.starredPapers.includes(paper.id)
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-500'
                          }`}
                        >
                          <Star className="h-4 w-4" fill={user.starredPapers.includes(paper.id) ? 'currentColor' : 'none'} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-200">
                          {paper.courseCode}
                        </Badge>
                        <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                          {paper.section}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-2" />
                          <span>{truncateText(paper.uploaderName, 20)}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span>{new Date(paper.uploadDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Download className="h-3 w-3 mr-2" />
                          <span>{paper.downloads || 0} downloads</span>
                        </div>
                      </div>

                      {paper.additionalDetails && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {truncateText(paper.additionalDetails, 80)}
                        </p>
                      )}

                      <div className="pt-2">
                        <Button
                          onClick={() => handleDownload(paper.id, 'paper')}
                          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm"
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
            {filteredNotes.length === 0 ? (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg dark:border-gray-700">
                <CardContent className="p-8 text-center">
                  <FileText className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No notes found</h3>
                  <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or filters.</p>
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
                          onClick={() => handleStarNote(note.id)}
                          className={`flex-shrink-0 ml-2 ${
                            user.starredNotes.includes(note.id)
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-500'
                          }`}
                        >
                          <Star className="h-4 w-4" fill={user.starredNotes.includes(note.id) ? 'currentColor' : 'none'} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-200">
                          {note.courseCode}
                        </Badge>
                        <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                          {note.section}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-2" />
                          <span>{truncateText(note.uploaderName, 20)}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span>{new Date(note.uploadDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Download className="h-3 w-3 mr-2" />
                          <span>{note.downloads || 0} downloads</span>
                        </div>
                      </div>

                      {note.additionalDetails && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {truncateText(note.additionalDetails, 80)}
                        </p>
                      )}

                      <div className="pt-2">
                        <Button
                          onClick={() => handleDownload(note.id, 'note')}
                          className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white text-sm"
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

      <Footer />
    </div>
  );
}