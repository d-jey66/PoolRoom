/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, User, Hash, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import gsap from 'gsap';
import { reservationAPI } from '../../lib/api';
import type { Reservation } from '../../types/reservation';

export default function AdminPanel() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (cardsRef.current && reservations.length > 0) {
      const cards = cardsRef.current.querySelectorAll('.reservation-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [reservations]);

  useEffect(() => {
    filterReservations();
  }, [searchTerm, statusFilter, reservations]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reservationAPI.getReservations();
      
      console.log('Fetched reservations:', data); 
      
      const allReservations = data;
      
      console.log('All reservations:', allReservations); 
      
      allReservations.sort((a: Reservation, b: Reservation) => {
        if (!a.start || !b.start) return 0;
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
      
      setReservations(allReservations);
      setFilteredReservations(allReservations);
    } catch (err: any) {
      console.error('Error fetching reservations:', err); 
      setError(err.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = [...reservations];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(res => res.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(res => {
        const fullname = typeof res.userId === 'object' ? res.userId?.fullname || '' : '';
        const email = typeof res.userId === 'object' ? res.userId?.email || '' : '';
        
        return (res.user || '').toLowerCase().includes(term) ||
          fullname.toLowerCase().includes(term) ||
          email.toLowerCase().includes(term) ||
          (res.tableNumber || '').toString().includes(term);
      });
    }

    setFilteredReservations(filtered);
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string | Date | undefined) => {
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

  const getStatusColor = (status: string | undefined) => {
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
  
  const getPaymentStatusColor = (status: string | undefined) => {
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
  
  const formatPaymentMethod = (method: string | undefined) => {
    if (method === 'online') return 'Online';
    if (method === 'at_venue') return 'At venue';
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-xl">Loading reservations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div ref={containerRef} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Admin Panel
          </h1>
          <p className="text-slate-400">Manage upcoming reservations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-400">{reservations.length}</div>
              <div className="text-sm text-slate-400">Total Upcoming</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-400">
                {reservations.filter(r => r.status === 'active').length}
              </div>
              <div className="text-sm text-slate-400">Active Now</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-400">
                {reservations.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-slate-400">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-400">
                {new Set(reservations.map(r => r.tableNumber)).size}
              </div>
              <div className="text-sm text-slate-400">Tables Booked</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-slate-900/50 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Search by name, email, or table number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-100"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    statusFilter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    statusFilter === 'active'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Active
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Reservations List */}
        <div ref={cardsRef} className="space-y-4">
          {filteredReservations.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6 text-center text-slate-400">
                No upcoming reservations found
              </CardContent>
            </Card>
          ) : (
            filteredReservations.map((reservation) => (
              <Card
                key={reservation._id}
                className="reservation-card bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all"
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
    </div>
  );
}