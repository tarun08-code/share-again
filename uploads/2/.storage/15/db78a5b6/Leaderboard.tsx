import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Trophy, Medal, Award, Upload, Download, Star, TrendingUp } from 'lucide-react';
import { getUsers } from '@/lib/storage';
import { departments } from '@/lib/mockData';

export default function Leaderboard() {
  const { user } = useAuth();

  // Get all users and calculate scores
  const leaderboardData = useMemo(() => {
    const users = getUsers();
    return users
      .map(u => ({
        ...u,
        totalScore: ((u.uploadsCount || 0) * 10) + ((u.downloadsCount || 0) * 2), // Fix NaN issues
        department: departments.find(d => d.id === u.department)?.name || 'Unknown Department'
      }))
      .sort((a, b) => b.totalScore - a.totalScore);
  }, []);

  const currentUserRank = leaderboardData.findIndex(u => u.id === user?.id) + 1;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400 dark:text-gray-300" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600 dark:text-amber-500" />;
      default:
        return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">🏆 Champion</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400 text-white hover:bg-gray-500 dark:bg-gray-500">🥈 Runner-up</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500">🥉 Third Place</Badge>;
    if (rank <= 10) return <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">Top 10</Badge>;
    return null;
  };

  // Truncate text to prevent overflow
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
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
            Community Leaderboard
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 px-4">
            Top contributors who make our community thrive
          </p>
        </div>

        {/* Current User Stats */}
        <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white border-0 shadow-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="w-full sm:w-auto">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">Your Ranking</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-base sm:text-lg">Rank #{currentUserRank || 'Unranked'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-base sm:text-lg">{((user.uploadsCount || 0) * 10) + ((user.downloadsCount || 0) * 2)} points</span>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-auto">
                <div className="flex items-center justify-center sm:justify-end space-x-6 sm:space-x-4 text-blue-100">
                  <div className="text-center">
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1" />
                    <div className="text-xl sm:text-2xl font-bold">{user.uploadsCount || 0}</div>
                    <div className="text-xs">Uploads</div>
                  </div>
                  <div className="text-center">
                    <Download className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1" />
                    <div className="text-xl sm:text-2xl font-bold">{user.downloadsCount || 0}</div>
                    <div className="text-xs">Downloads</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scoring System */}
        <Card className="mb-6 sm:mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white text-lg sm:text-xl">How Points Are Calculated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <Upload className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">Upload Content</p>
                  <p className="text-green-600 dark:text-green-400">+10 points per upload</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <Download className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-300">Content Downloaded</p>
                  <p className="text-blue-600 dark:text-blue-400">+2 points per download</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <span>Top Contributors</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {leaderboardData.map((contributor, index) => {
                const rank = index + 1;
                const isCurrentUser = contributor.id === user.id;
                
                return (
                  <div
                    key={contributor.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg border transition-all duration-200 space-y-3 sm:space-y-0 ${
                      isCurrentUser 
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 shadow-md' 
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                        {getRankIcon(rank)}
                      </div>
                      
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                        <AvatarFallback className="bg-blue-600 dark:bg-blue-500 text-white font-semibold text-sm">
                          {contributor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                          <h4 className={`font-semibold text-sm sm:text-base truncate ${isCurrentUser ? 'text-blue-800 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                            {truncateText(contributor.name, 20)}
                            {isCurrentUser && <span className="text-blue-600 dark:text-blue-400 ml-2">(You)</span>}
                          </h4>
                          {getRankBadge(rank)}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                          {truncateText(contributor.department.split(' ').slice(-2).join(' '), 25)} • {truncateText(contributor.section || 'N/A', 15)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center sm:justify-end space-x-4 sm:space-x-6 text-sm w-full sm:w-auto">
                      <div className="text-center">
                        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 justify-center">
                          <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="font-semibold">{contributor.uploadsCount || 0}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Uploads</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 justify-center">
                          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="font-semibold">{contributor.downloadsCount || 0}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Downloads</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 justify-center">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="font-bold">{contributor.totalScore || 0}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Points</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {leaderboardData.length === 0 && (
              <div className="text-center py-8">
                <Trophy className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No contributors yet</h3>
                <p className="text-gray-600 dark:text-gray-400">Be the first to upload content and claim the top spot!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Motivation Card */}
        <Card className="mt-6 sm:mt-8 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 text-white border-0 shadow-xl">
          <CardContent className="p-6 sm:p-8 text-center">
            <Award className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-purple-200" />
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Climb the Ranks!</h3>
            <p className="text-purple-100 mb-4 sm:mb-6 text-sm sm:text-base px-4">
              Upload more content and help others to earn points and move up the leaderboard. 
              Every contribution makes our community stronger!
            </p>
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                Next Goal: {currentUserRank > 1 ? `Reach Rank #${currentUserRank - 1}` : 'Maintain #1 Position'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}