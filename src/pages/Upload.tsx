import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Upload as UploadIcon, FileText, BookOpen, Building2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/fileUpload';

export default function Upload() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    department: '',
    section: '',
    year: '',
    type: 'paper',
    description: '',
    file: null as File | null
  });
  const [isUploading, setIsUploading] = useState(false);

  if (!user) return null;

  const departments = [
    { id: 'commerce', name: 'School of Commerce, Accounting & Finance' },
    { id: 'humanities', name: 'School of Humanities & Social Sciences' },
    { id: 'business', name: 'School of Business & Management' },
    { id: 'biological', name: 'School of Biological & Forensic Science' },
    { id: 'computational', name: 'School of Computational & Physical Sciences' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!formData.title.trim() || !formData.courseCode.trim() || !formData.department || !formData.section || !formData.year) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsUploading(true);

    try {
      console.log('Starting upload with data:', {
        title: formData.title,
        courseCode: formData.courseCode,
        department: formData.department,
        section: formData.section,
        year: formData.year,
        type: formData.type,
        description: formData.description,
        fileName: formData.file.name,
        fileSize: formData.file.size,
        uploaderId: user.id
      });

      const uploadData = {
        title: formData.title,
        courseCode: formData.courseCode,
        department: formData.department,
        section: formData.section,
        year: formData.year,
        type: formData.type as 'paper' | 'notes',
        description: formData.description,
        file: formData.file,
        uploaderId: user.id
      };

      const result = await uploadFile(uploadData);

      if (result.success) {
        console.log('Upload successful:', result);

        // Update user stats
        updateUser({
          uploadsCount: user.uploadsCount + 1,
          points: user.points + 10
        });

        toast.success(`${formData.type === 'paper' ? 'Question paper' : 'Study notes'} uploaded successfully!`);

        // Reset form
        setFormData({
          title: '',
          courseCode: '',
          department: '',
          section: '',
          year: '',
          type: 'paper',
          description: '',
          file: null
        });

        // Reset file input
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        console.error('Upload failed:', result.error);
        toast.error(result.error || 'Failed to upload file. Please try again.');
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An unexpected error occurred during upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      // Check file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, JPG, PNG, DOC, DOCX, and TXT files are allowed');
        return;
      }

      setFormData({ ...formData, file });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-200">
      <Navbar />

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Content</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Share your question papers and study notes with the community
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <UploadIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span>Upload New Content</span>
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Fill in the details and upload your file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Content Type */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium dark:text-gray-300">Content Type</Label>
                    <RadioGroup
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paper" id="paper" />
                        <Label htmlFor="paper" className="flex items-center space-x-2 cursor-pointer dark:text-gray-300">
                          <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span>Question Paper</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="notes" id="notes" />
                        <Label htmlFor="notes" className="flex items-center space-x-2 cursor-pointer dark:text-gray-300">
                          <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <span>Study Notes</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="dark:text-gray-300">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter a descriptive title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Course Code */}
                    <div className="space-y-2">
                      <Label htmlFor="courseCode" className="dark:text-gray-300">Course Code *</Label>
                      <Input
                        id="courseCode"
                        placeholder="e.g., CS101, MATH201"
                        value={formData.courseCode}
                        onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        required
                      />
                    </div>

                    {/* Year */}
                    <div className="space-y-2">
                      <Label htmlFor="year" className="dark:text-gray-300">Year *</Label>
                      <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()} className="dark:text-white dark:focus:bg-gray-600">
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Department */}
                    <div className="space-y-2">
                      <Label htmlFor="department" className="dark:text-gray-300">Department *</Label>
                      <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
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
                    </div>

                    {/* Section */}
                    <div className="space-y-2">
                      <Label htmlFor="section" className="dark:text-gray-300">Section *</Label>
                      <Select value={formData.section} onValueChange={(value) => setFormData({ ...formData, section: value })}>
                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                          <SelectItem value="UG" className="dark:text-white dark:focus:bg-gray-600">Undergraduate (UG)</SelectItem>
                          <SelectItem value="PG" className="dark:text-white dark:focus:bg-gray-600">Postgraduate (PG)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="dark:text-gray-300">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Add any additional details about this content..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="file" className="dark:text-gray-300">File Upload *</Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                      <UploadIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <div className="space-y-2">
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <Label
                          htmlFor="file"
                          className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                          Choose File
                        </Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formData.file ? formData.file.name : 'PDF, JPG, PNG up to 10MB'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : `Upload ${formData.type === 'paper' ? 'Question Paper' : 'Study Notes'}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Upload Guidelines */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Upload Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Ensure files are clear and readable
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Use descriptive titles and course codes
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Maximum file size: 10MB
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Supported formats: PDF, JPG, PNG
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Earn Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-green-700 dark:text-green-300">Upload Content</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">+10 points</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-blue-700 dark:text-blue-300">Download Content</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">+2 points</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}