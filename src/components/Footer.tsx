import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
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
  );
}