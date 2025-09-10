import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  User,
  Upload,
  Download,
  Star,
  FileText,
  BookOpen,
  Building2,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { getStarredPapers, getStarredNotes } from '@/lib/fileUpload';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user } = useAuth();
  const [starredPapers, setStarredPapers] = useState<any[]>([]);
  const [starredNotes, setStarredNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const departments = [
    { id: 'commerce', name: 'School of Commerce, Accounting & Finance' },
    { id: 'humanities', name: 'School of Humanities & Social Sciences' },
    { id: 'business', name: 'School of Business & Management' },
    { id: 'biological', name: 'School of Biological & Forensic Science' },
    { id: 'computational', name: 'School of Computational & Physical Sciences' },
    { id: 'computer-science', name: 'Computer Science & Engineering' },
    { id: 'mechanical', name: 'Mechanical Engineering' },
    { id: 'electrical', name: 'Electrical Engineering' },
    { id: 'civil', name: 'Civil Engineering' }
  ];

  useEffect(() => {
    const loadStarredContent = async () => {
      if (!user) return;

      setLoading(true);
      try {
        console.log('Loading starred content for user:', user.id);
        console.log('User starred papers from context:', user.starredPapers);
        console.log('User starred notes from context:', user.starredNotes);

        const [papersResult, notesResult] = await Promise.all([
          getStarredPapers(user.id),
          getStarredNotes(user.id)
        ]);

        console.log('Starred papers result:', papersResult);
        console.log('Starred notes result:', notesResult);

        if (papersResult.error) {
          console.error('Error loading starred papers:', papersResult.error);
        } else {
          setStarredPapers(papersResult.data);
          console.log('Set starred papers:', papersResult.data);
        }

        if (notesResult.error) {
          console.error('Error loading starred notes:', notesResult.error);
        } else {
          setStarredNotes(notesResult.data);
          console.log('Set starred notes:', notesResult.data);
        }
      } catch (error) {
        console.error('Error loading starred content:', error);
        toast.error('Failed to load starred content');
      } finally {
        setLoading(false);
      }
    };

    loadStarredContent();
  }, [user]);

  if (!user) return null;

  const starredDepartments = departments.filter(dept =>
    user.starredDepartments.includes(dept.id)
  );

  const userDepartment = departments.find(dept => dept.id === user.department);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-200">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 dark:bg-white/10 p-3 rounded-full">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
                <p className="text-blue-100 dark:text-blue-200 mt-2">
                  {userDepartment?.name} • {user.section}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uploads</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{user.uploadsCount}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Downloads</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{user.downloadsCount}</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Points</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{user.points}</p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Starred</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {starredDepartments.length + starredPapers.length + starredNotes.length}
                  </p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                  <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Starred Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Starred Departments */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Starred Departments</span>
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Your favorite departments ({starredDepartments.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {starredDepartments.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No starred departments yet
                </p>
              ) : (
                <div className="space-y-3">
                  {starredDepartments.slice(0, 3).map((dept) => (
                    <div key={dept.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{dept.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Department
                        </p>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                  ))}
                  {starredDepartments.length > 3 && (
                    <Link to="/departments">
                      <Button variant="ghost" size="sm" className="w-full dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                        View All ({starredDepartments.length})
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Starred Papers */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span>Starred Papers</span>
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Your saved question papers ({starredPapers.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : starredPapers.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No starred papers yet
                </p>
              ) : (
                <div className="space-y-3">
                  {starredPapers.slice(0, 3).map((paper) => (
                    <div key={paper.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{paper.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {paper.subject} • {paper.tags ? paper.tags.join(', ') : 'No tags'}
                        </p>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                  ))}
                  {starredPapers.length > 3 && (
                    <Link to="/search">
                      <Button variant="ghost" size="sm" className="w-full dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                        View All ({starredPapers.length})
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Starred Notes */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span>Starred Notes</span>
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Your saved study notes ({starredNotes.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : starredNotes.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No starred notes yet
                </p>
              ) : (
                <div className="space-y-3">
                  {starredNotes.slice(0, 3).map((note) => (
                    <div key={note.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{note.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {note.subject} • {note.tags ? note.tags.join(', ') : 'No tags'}
                        </p>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                  ))}
                  {starredNotes.length > 3 && (
                    <Link to="/search">
                      <Button variant="ghost" size="sm" className="w-full dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700">
                        View All ({starredNotes.length})
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
//dinesh