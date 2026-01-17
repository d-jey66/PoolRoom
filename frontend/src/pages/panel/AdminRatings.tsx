import { useEffect, useState } from 'react';
import { Star, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RatingData {
  _id: string;
  userId: string;
  userName: string;
  rating: number;
  createdAt: string;
}

interface RatingStats {
  average: number;
  count: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export default function AdminRatings() {
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchRatings = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch average rating
      const avgRes = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings/average`);
      const avgData: { average: number; count: number } = await avgRes.json();

      // Fetch all ratings (you'll need to add this endpoint)
      const allRes = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings/all`, {
        credentials: 'include'
      });
      const allData: { ratings: RatingData[] } = await allRes.json();

      setRatings(allData.ratings);

      // Calculate distribution
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      allData.ratings.forEach(r => {
        distribution[r.rating as keyof typeof distribution]++;
      });

      setStats({
        average: avgData.average,
        count: avgData.count,
        distribution
      });
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchRatings();
    };
    loadData();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPercentage = (count: number, total: number): number => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400 text-xl">Loading ratings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Ratings Overview</h1>
          <p className="text-slate-400">View customer ratings and feedback</p>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Ratings Overview</h1>
        <p className="text-slate-400">View customer ratings and feedback</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Average Rating</p>
                <p className="text-4xl font-bold text-yellow-400">
                  {stats?.average.toFixed(1) || '0.0'}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= (stats?.average || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                <Star className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Ratings</p>
                <p className="text-4xl font-bold text-blue-400">{stats?.count || 0}</p>
              </div>
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Satisfaction Rate</p>
                <p className="text-4xl font-bold text-green-400">
                  {stats && stats.count > 0
                    ? Math.round(
                        ((stats.distribution[5] + stats.distribution[4]) / stats.count) * 100
                      )
                    : 0}
                  %
                </p>
                <p className="text-xs text-slate-500 mt-1">4-5 star ratings</p>
              </div>
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-100">Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats?.distribution[star as keyof typeof stats.distribution] || 0;
            const percentage = getPercentage(count, stats?.count || 0);
            
            return (
              <div key={star} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-slate-300 font-medium">{star}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-slate-800 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-100">
                    {count} ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Ratings */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-100">Recent Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          {ratings.length === 0 ? (
            <div className="text-center text-slate-400 py-8">No ratings yet</div>
          ) : (
            <div className="space-y-3">
              {ratings.map((rating) => (
                <div
                  key={rating._id}
                  className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-slate-100 font-medium">{rating.userName}</p>
                    <p className="text-slate-500 text-sm">{formatDate(rating.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= rating.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}