import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';
import { 
  BookOpen, 
  Users, 
  Upload, 
  Search, 
  Star, 
  Trophy,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      title: "Smart Search",
      description: "Find papers and notes by department, course, and year with advanced filtering."
    },
    {
      icon: <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />,
      title: "Easy Upload",
      description: "Share your notes and question papers with the community effortlessly."
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />,
      title: "Favorites",
      description: "Star your favorite departments and content for quick access."
    },
    {
      icon: <Trophy className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
      title: "Leaderboard",
      description: "Recognition for top contributors who help the community grow."
    }
  ];

  const departments = [
    "School of Commerce, Accounting & Finance",
    "School of Humanities & Social Sciences", 
    "School of Business & Management",
    "School of Biological & Forensic Science",
    "School of Computational & Physical Sciences"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                PaperShare
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" className="hover:bg-blue-50 dark:hover:bg-gray-800 dark:text-gray-300">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Share Knowledge,
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Build Futures</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The ultimate platform for students to share question papers, notes, and academic resources. 
              Join thousands of learners building a collaborative education community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Sharing Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl border-2 hover:bg-blue-50 dark:hover:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
                  Already a Member?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to make academic resource sharing seamless and effective.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Academic Coverage
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Resources from all major schools and departments, organized for easy discovery.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/50 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        {dept}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100 dark:text-blue-200">Question Papers</div>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100 dark:text-blue-200">Study Notes</div>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <div className="text-4xl font-bold mb-2">2000+</div>
              <div className="text-blue-100 dark:text-blue-200">Active Students</div>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-450">
              <div className="text-4xl font-bold mb-2">5</div>
              <div className="text-blue-100 dark:text-blue-200">Schools Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-3xl p-12 text-white shadow-2xl">
            <Users className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-4xl font-bold mb-4">Join the Community</h2>
            <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto">
              Be part of a growing network of students helping each other succeed. 
              Share your knowledge and access thousands of resources.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-xl bg-white text-blue-600 hover:bg-blue-50 dark:bg-gray-100 dark:text-blue-700 dark:hover:bg-gray-200">
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">PaperShare</span>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-right">
              <p>&copy; 2024 PaperShare. All rights reserved.</p>
              <p className="mt-1">Sharing knowledge, building futures.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}