import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Edit3, Save, X, Mail, Building2, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { departments } from '@/lib/mockData';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    department: user?.department || '',
    section: user?.section || ''
  });

  if (!user) return null;

  const userDepartment = departments.find(dept => dept.id === user.department);

  const handleSave = () => {
    updateUser({
      ...user,
      name: editForm.name,
      department: editForm.department,
      section: editForm.section
    });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      department: user.department,
      section: user.section
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-200">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Personal Information</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Update your profile details
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="dark:text-gray-300">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{user.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Email Field (Read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-gray-300">Email Address (Cannot be Changed)</Label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{user.email}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto"></span>
                    </div>
                  </div>

                  {/* Department Field */}
                  <div className="space-y-2">
                    <Label htmlFor="department" className="dark:text-gray-300">Department</Label>
                    {isEditing ? (
                      <Select
                        value={editForm.department}
                        onValueChange={(value) => setEditForm({ ...editForm, department: value })}
                      >
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id} className="dark:text-white dark:focus:bg-gray-600">
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Building2 className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{userDepartment?.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Section Field */}
                  <div className="space-y-2">
                    <Label htmlFor="section" className="dark:text-gray-300">Section</Label>
                    {isEditing ? (
                      <Select
                        value={editForm.section}
                        onValueChange={(value) => setEditForm({ ...editForm, section: value })}
                      >
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                          <SelectItem value="UG" className="dark:text-white dark:focus:bg-gray-600">Undergraduate (UG)</SelectItem>
                          <SelectItem value="PG" className="dark:text-white dark:focus:bg-gray-600">Postgraduate (PG)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {user.section === 'UG' ? 'Undergraduate' : 'Postgraduate'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Stats */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Activity Summary</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Your contribution statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-700 dark:text-green-300 font-medium">Uploads</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{user.uploads}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-blue-700 dark:text-blue-300 font-medium">Downloads</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{user.downloads}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-purple-700 dark:text-purple-300 font-medium">Points</span>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{user.points}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <span className="text-yellow-700 dark:text-yellow-300 font-medium">Starred Items</span>
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {user.starredDepartments.length + user.starredPapers.length + user.starredNotes.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 dark:text-green-300 font-medium">Active Member</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  Member since {new Date(user.joinDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}