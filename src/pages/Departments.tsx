import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building2, Star, FileText, BookOpen, Users } from 'lucide-react';
import { departments } from '@/lib/mockData';
import { toast } from 'sonner';

export default function Departments() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  if (!user) return null;

  const handleStarDepartment = async (deptId: string) => {
    setLoading(deptId);
    
    try {
      const isStarred = user.starredDepartments.includes(deptId);
      const newStarredDepartments = isStarred
        ? user.starredDepartments.filter(id => id !== deptId)
        : [...user.starredDepartments, deptId];

      updateUser({
        ...user,
        starredDepartments: newStarredDepartments
      });

      const dept = departments.find(d => d.id === deptId);
      toast.success(
        isStarred 
          ? `Removed ${dept?.name} from favorites`
          : `Added ${dept?.name} to favorites`
      );
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-200">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Departments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Explore academic departments and star your favorites for quick access
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => {
            const isStarred = user.starredDepartments.includes(department.id);
            const isLoading = loading === department.id;

            return (
              <Card key={department.id} className="group bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                        <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900 dark:text-white leading-tight">
                          {department.name}
                        </CardTitle>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStarDepartment(department.id)}
                      disabled={isLoading}
                      className="flex-shrink-0 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    >
                      <Star 
                        className={`h-5 w-5 transition-colors ${
                          isStarred 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500'
                        }`} 
                      />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {department.description}
                  </CardDescription>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{department.papers}</div>
                      <div className="text-xs text-green-700 dark:text-green-300">Papers</div>
                    </div>
                    
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{department.notes}</div>
                      <div className="text-xs text-purple-700 dark:text-purple-300">Notes</div>
                    </div>
                    
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{department.students}</div>
                      <div className="text-xs text-blue-700 dark:text-blue-300">Students</div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-center">
                    {isStarred && (
                      <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Starred
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Platform Overview
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {departments.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Departments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {departments.reduce((sum, dept) => sum + dept.papers, 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Question Papers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {departments.reduce((sum, dept) => sum + dept.notes, 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Study Notes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {departments.reduce((sum, dept) => sum + dept.students, 0)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Active Students</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}