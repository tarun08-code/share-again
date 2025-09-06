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
        totalScore: (u.uploadsCount * 10) + (u.downloadsCount * 2), // Upload worth more than download
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
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500 text-white">🏆 Champion</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400 text-white">🥈 Runner-up</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600 text-white">🥉 Third Place</Badge>;
    if (rank <= 10) return <Badge variant="secondary">Top 10</Badge>;
    return null;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Leaderboard
          </h1>
          <p className="text-xl text-gray-600">
            Top contributors who make our community thrive
          </p>
        </div>

        {/* Current User Stats */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Your Ranking</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-lg">Rank #{currentUserRank || 'Unranked'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span className="text-lg">{(user.uploadsCount * 10) + (user.downloadsCount * 2)} points</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-4 text-blue-100">
                  <div className="text-center">
                    <Upload className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-2xl font-bold">{user.uploadsCount}</div>
                    <div className="text-xs">Uploads</div>
                  </div>
                  <div className="text-center">
                    <Download className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-2xl font-bold">{user.downloadsCount}</div>
                    <div className="text-xs">Downloads</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scoring System */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>How Points Are Calculated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Upload className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Upload Content</p>
                  <p className="text-green-600">+10 points per upload</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Download className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Content Downloaded</p>
                  <p className="text-blue-600">+2 points per download</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <span>Top Contributors</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((contributor, index) => {
                const rank = index + 1;
                const isCurrentUser = contributor.id === user.id;
                
                return (
                  <div
                    key={contributor.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                      isCurrentUser 
                        ? 'bg-blue-50 border-blue-200 shadow-md' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12">
                        {getRankIcon(rank)}
                      </div>
                      
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-600 text-white font-semibold">
                          {contributor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className={`font-semibold ${isCurrentUser ? 'text-blue-800' : 'text-gray-900'}`}>
                            {contributor.name}
                            {isCurrentUser && <span className="text-blue-600 ml-2">(You)</span>}
                          </h4>
                          {getRankBadge(rank)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {contributor.department.split(' ').slice(-2).join(' ')} • {contributor.section}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="flex items-center space-x-1 text-green-600">
                          <Upload className="h-4 w-4" />
                          <span className="font-semibold">{contributor.uploadsCount}</span>
                        </div>
                        <p className="text-xs text-gray-500">Uploads</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center space-x-1 text-blue-600">
                          <Download className="h-4 w-4" />
                          <span className="font-semibold">{contributor.downloadsCount}</span>
                        </div>
                        <p className="text-xs text-gray-500">Downloads</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center space-x-1 text-purple-600">
                          <Star className="h-4 w-4" />
                          <span className="font-bold">{contributor.totalScore}</span>
                        </div>
                        <p className="text-xs text-gray-500">Points</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {leaderboardData.length === 0 && (
              <div className="text-center py-8">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No contributors yet</h3>
                <p className="text-gray-600">Be the first to upload content and claim the top spot!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Motivation Card */}
        <Card className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <Award className="h-12 w-12 mx-auto mb-4 text-purple-200" />
            <h3 className="text-2xl font-bold mb-2">Climb the Ranks!</h3>
            <p className="text-purple-100 mb-6">
              Upload more content and help others to earn points and move up the leaderboard. 
              Every contribution makes our community stronger!
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
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