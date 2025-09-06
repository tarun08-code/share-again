import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { 
  BookOpen, 
  Home, 
  Search, 
  Upload, 
  User, 
  Trophy, 
  Building2,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  if (!user) {
    return (
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">PaperShare</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" className="dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">PaperShare</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1">
            <Link to="/dashboard">
              <Button 
                variant={isActive('/dashboard') ? 'default' : 'ghost'} 
                size="sm"
                className={`flex items-center space-x-2 ${
                  isActive('/dashboard') 
                    ? 'bg-blue-600 text-white dark:bg-blue-500' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
            
            <Link to="/departments">
              <Button 
                variant={isActive('/departments') ? 'default' : 'ghost'} 
                size="sm"
                className={`flex items-center space-x-2 ${
                  isActive('/departments') 
                    ? 'bg-blue-600 text-white dark:bg-blue-500' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span>Departments</span>
              </Button>
            </Link>
            
            <Link to="/search">
              <Button 
                variant={isActive('/search') ? 'default' : 'ghost'} 
                size="sm"
                className={`flex items-center space-x-2 ${
                  isActive('/search') 
                    ? 'bg-blue-600 text-white dark:bg-blue-500' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </Link>
            
            <Link to="/upload">
              <Button 
                variant={isActive('/upload') ? 'default' : 'ghost'} 
                size="sm"
                className={`flex items-center space-x-2 ${
                  isActive('/upload') 
                    ? 'bg-blue-600 text-white dark:bg-blue-500' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
              >
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </Button>
            </Link>
            
            <Link to="/leaderboard">
              <Button 
                variant={isActive('/leaderboard') ? 'default' : 'ghost'} 
                size="sm"
                className={`flex items-center space-x-2 ${
                  isActive('/leaderboard') 
                    ? 'bg-blue-600 text-white dark:bg-blue-500' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
              >
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </Button>
            </Link>
            
            <Link to="/profile">
              <Button 
                variant={isActive('/profile') ? 'default' : 'ghost'} 
                size="sm"
                className={`flex items-center space-x-2 ${
                  isActive('/profile') 
                    ? 'bg-blue-600 text-white dark:bg-blue-500' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white dark:hover:bg-gray-800'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Button>
            </Link>
            
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 dark:hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}