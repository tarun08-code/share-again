import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import { useState } from 'react';
import { 
  BookOpen, 
  Home, 
  Search, 
  Upload, 
  User, 
  Trophy, 
  Building2,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/departments', icon: Building2, label: 'Departments' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (!user) {
    return (
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">PaperShare</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" size="sm" className="dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 text-sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-sm">
                  Register
                </Button>
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
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">PaperShare</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link key={path} to={path}>
                <Button 
                  variant={isActive(path) ? 'default' : 'ghost'} 
                  size="sm"
                  className={`flex items-center space-x-2 ${
                    isActive(path) 
                      ? 'bg-blue-600 text-white dark:bg-blue-500' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden xl:inline">{label}</span>
                </Button>
              </Link>
            ))}
            
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 dark:hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden xl:inline">Logout</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            <div className="grid grid-cols-2 gap-1 px-2">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link key={path} to={path} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    variant={isActive(path) ? 'default' : 'ghost'} 
                    size="sm"
                    className={`w-full flex items-center justify-center space-x-2 py-3 ${
                      isActive(path) 
                        ? 'bg-blue-600 text-white dark:bg-blue-500' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{label}</span>
                  </Button>
                </Link>
              ))}
            </div>
            <div className="px-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 dark:hover:bg-gray-800 py-3"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-xs">Logout</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}