import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Hash } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { reservationAPI } from '../../lib/api';
import type { Reservation } from '../../types/reservation';

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reservationAPI.getReservations();
      
      const allReservations = data;
      
      allReservations.sort((a: Reservation, b: Reservation) => {
        if (!a.start || !b.start) return 0;
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
      
      setReservations(allReservations);
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error('Error fetching reservations:', err);
      setError(error.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchReservations();
    };
    loadData();
  }, []);

  const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string | Date | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserInfo = (userId: Reservation['userId'], field: 'fullname' | 'email'): string => {
    if (!userId) return 'N/A';
    if (typeof userId === 'string') return 'N/A';
    return userId[field] || 'N/A';
  };

  const getStatusColor = (status: string | undefined): string => {
    switch (status) {
      case 'active':
        return 'bg-green-900/20 text-green-400 border-green-700';
      case 'pending':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-700';
      case 'completed':
        return 'bg-blue-900/20 text-blue-400 border-blue-700';
      case 'cancelled':
        return 'bg-red-900/20 text-red-400 border-red-700';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };
  
  const getPaymentStatusColor = (status: string | undefined): string => {
    switch (status) {
      case 'paid':
        return 'bg-green-900/20 text-green-400 border-green-700';
      case 'pending':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-700';
      case 'unpaid':
        return 'bg-red-900/20 text-red-400 border-red-700';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };
  
  const formatPaymentMethod = (method: string | undefined): string => {
    if (method === 'online') return 'Online';
    if (method === 'at_venue') return 'At venue';
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400 text-xl">Loading reservations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">All Reservations</h1>
        <p className="text-slate-400">View and manage all reservations</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Reservations List */}
      <div className="space-y-4">
        {reservations.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6 text-center text-slate-400">
              No reservations found
            </CardContent>
          </Card>
        ) : (
          reservations.map((reservation) => (
            <Card
              key={reservation._id}
              className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl text-slate-100">
                        {reservation.user}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status || 'pending'}
                        </Badge>
                      
                        <Badge className="bg-slate-700/40 text-slate-200 border border-slate-600">
                          {formatPaymentMethod(reservation.paymentMethod)}
                        </Badge>
                      
                        {reservation.paymentMethod === 'online' && (
                          <Badge className={getPaymentStatusColor(reservation.paymentStatus)}>
                            {reservation.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-slate-400">
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-4 h-4" />
                        <span>{getUserInfo(reservation.userId, 'fullname')}</span>
                        <span className="text-slate-600">•</span>
                        <span>{getUserInfo(reservation.userId, 'email')}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
                    <Hash className="w-4 h-4 text-purple-400" />
                    <span className="text-xl font-bold text-purple-400">
                      {reservation.tableNumber}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-xs text-slate-500">Date</div>
                      <div className="text-slate-200 font-medium">
                        {formatDate(reservation.start)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg">
                    <Clock className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-xs text-slate-500">Start Time</div>
                      <div className="text-slate-200 font-medium">
                        {formatTime(reservation.start)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <div>
                      <div className="text-xs text-slate-500">End Time</div>
                      <div className="text-slate-200 font-medium">
                        {formatTime(reservation.end)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}