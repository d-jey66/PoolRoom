import { useEffect, useState } from 'react';
import { DollarSign, Users, Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReservationData {
  _id: string;
  user: string;
  tableNumber: number;
  date: string;
  startTime: string;
  price: number;
  paymentStatus: 'paid' | 'pending';
}

interface StatsData {
  revenue: {
    week: number;
    month: number;
    year: number;
    total: number;
  };
  counts: {
    totalReservations: number;
    pendingReservations: number;
    paidReservations: number;
    totalUsers: number;
    adminUsers: number;
  };
  recentReservations: ReservationData[];
}

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
        credentials: 'include'
      });
      const data: StatsData = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchStats();
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400 text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-400 text-xl">Failed to load dashboard</div>
      </div>
    );
  }

  const statCards: StatCard[] = [
    {
      title: 'Total Revenue',
      value: `${stats.revenue.total} GEL`,
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Total Users',
      value: stats.counts.totalUsers,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Total Reservations',
      value: stats.counts.totalReservations,
      icon: Calendar,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Paid Reservations',
      value: stats.counts.paidReservations,
      icon: CheckCircle,
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-100">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Breakdown */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <TrendingUp className="w-5 h-5" />
            Revenue Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Past Week</p>
              <p className="text-2xl font-bold text-green-400">{stats.revenue.week} GEL</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Past Month</p>
              <p className="text-2xl font-bold text-blue-400">{stats.revenue.month} GEL</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Past Year</p>
              <p className="text-2xl font-bold text-purple-400">{stats.revenue.year} GEL</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reservation Status */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Reservation Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">Paid</span>
              </div>
              <span className="text-xl font-bold text-slate-100">{stats.counts.paidReservations}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-slate-300">Pending</span>
              </div>
              <span className="text-xl font-bold text-slate-100">{stats.counts.pendingReservations}</span>
            </div>
          </CardContent>
        </Card>

        {/* User Stats */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">User Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300">Total Users</span>
              </div>
              <span className="text-xl font-bold text-slate-100">{stats.counts.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-slate-300">Admins</span>
              </div>
              <span className="text-xl font-bold text-slate-100">{stats.counts.adminUsers}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reservations */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-100">Recent Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentReservations.map((reservation) => (
              <div
                key={reservation._id}
                className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors"
              >
                <div className="flex-1">
                  <p className="text-slate-100 font-medium">{reservation.user}</p>
                  <p className="text-slate-400 text-sm">
                    Table {reservation.tableNumber} • {reservation.date} • {reservation.startTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-100 font-semibold">{reservation.price} GEL</p>
                  <p className={`text-xs ${
                    reservation.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {reservation.paymentStatus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}