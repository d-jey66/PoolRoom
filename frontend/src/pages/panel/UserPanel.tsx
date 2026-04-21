/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { User, Lock, Calendar, Clock, Hash, CheckCircle2, AlertCircle, Edit, Save, X, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext';
import { reservationAPI, userAPI } from '../../lib/api';
import type { Reservation } from '../../types/reservation';
import CancelReservationModal from '@/components/modals/CancelReservationModal';

export default function UserPanel() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<'profile' | 'password' | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ 
    type: '', 
    text: '' 
  });

  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

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

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationAPI.getMyReservations();

      // Sort by start time
      data.sort((a: Reservation, b: Reservation) => {
        if (!a.start || !b.start) return 0;
        return new Date(b.start).getTime() - new Date(a.start).getTime();
      });
 
      setReservations(data);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to load reservations' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!profileData.fullname || !profileData.email) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    try {
      await userAPI.updateProfile({
        fullname: profileData.fullname,
        email: profileData.email
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditMode(null);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setEditMode(null);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to change password' });
    }
  };

  const handleCancelReservation = async (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setCancelModalOpen(true);
  };
  
  const confirmCancelReservation = async () => {
    if (!selectedReservation?._id) return;
    
    setDeletingId(selectedReservation._id);
    try {
      await reservationAPI.deleteReservation(selectedReservation._id);
      setMessage({ type: 'success', text: 'Reservation cancelled successfully!' });
      setCancelModalOpen(false);
      await fetchReservations();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to cancel reservation' });
    } finally {
      setDeletingId(null);
      setSelectedReservation(null);
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const day = date.getUTCDate();
    const weekday = date.toLocaleString('en-US', { weekday: 'short', timeZone: 'UTC' });
    return `${weekday}, ${month} ${day}, ${year}`;
  };
//  7-
  const formatTime = (dateString: string | Date | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div ref={containerRef} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            My Panel
          </h1>
          <p className="text-slate-400">Manage your profile and reservations</p>
        </div>

        {/* Message */}
        {message.text && (
          <Alert
            variant={message.type === 'error' ? 'destructive' : 'default'}
            className={`mb-6 ${message.type === 'success' ? 'bg-green-900/20 border-green-700 text-green-400' : ''}`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Profile Card */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Update your account details
                  </CardDescription>
                </div>
                {editMode !== 'profile' && (
                  <Button
                    onClick={() => setEditMode('profile')}
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 hover:bg-slate-800"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Full Name</Label>
                {editMode === 'profile' ? (
                  <Input
                    value={profileData.fullname}
                    onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                ) : (
                  <div className="text-slate-100 bg-slate-800 px-3 py-2 rounded-lg">
                    {user?.fullname}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Email</Label>
                {editMode === 'profile' ? (
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-slate-100"
                  />
                ) : (
                  <div className="text-slate-100 bg-slate-800 px-3 py-2 rounded-lg">
                    {user?.email}
                  </div>
                )}
              </div>

              {editMode === 'profile' && (
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleProfileUpdate}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setEditMode(null)}
                    variant="ghost"
                    className="text-slate-400 hover:text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Password Card */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Update your password securely
                  </CardDescription>
                </div>
                {editMode !== 'password' && (
                  <Button
                    onClick={() => setEditMode('password')}
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 hover:bg-slate-800"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editMode === 'password' ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Current Password</Label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">New Password</Label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Confirm New Password</Label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="bg-slate-800 border-slate-700 text-slate-100"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={handlePasswordChange}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button
                      onClick={() => {
                        setEditMode(null);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      variant="ghost"
                      className="text-slate-400 hover:text-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-slate-400 bg-slate-800 px-3 py-8 rounded-lg text-center">
                  Click edit to change your password
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reservations Section */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              My Reservations
            </CardTitle>
            <CardDescription className="text-slate-400">
              View your booking history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading reservations...</div>
            ) : reservations.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No reservations yet. Book your first table!
              </div>
            ) : (
              <div ref={cardsRef} className="space-y-4">
                {reservations.map((reservation) => (
                  <div
                    key={reservation._id}
                    className="reservation-card bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-slate-100 font-semibold text-lg">
                          {reservation.user}
                        </h3>
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
                      <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg">
                        <Hash className="w-4 h-4 text-purple-400" />
                        <span className="text-xl font-bold text-purple-400">
                          {reservation.tableNumber}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-lg">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="text-xs text-slate-500">Date</div>
                          <div className="text-slate-200 text-sm font-medium">
                            {formatDate(reservation.start)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-lg">
                        <Clock className="w-4 h-4 text-green-400" />
                        <div>
                          <div className="text-xs text-slate-500">Start</div>
                          <div className="text-slate-200 text-sm font-medium">
                            {formatTime(reservation.start)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-lg">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <div>
                          <div className="text-xs text-slate-500">End</div>
                          <div className="text-slate-200 text-sm font-medium">
                            {formatTime(reservation.end)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <Button
                        onClick={() => handleCancelReservation(reservation)}
                        disabled={deletingId === reservation._id || reservation.status === 'cancelled' || reservation.status === 'completed'}
                        variant="ghost"
                        size="sm"
                        className="w-full text-red-400 hover:text-red-300 hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel Reservation
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {selectedReservation && (
        <CancelReservationModal
          open={cancelModalOpen}
          onOpenChange={setCancelModalOpen}
          onConfirm={confirmCancelReservation}
          reservationDetails={{
            user: selectedReservation.user,
            tableNumber: selectedReservation.tableNumber,
            date: formatDate(selectedReservation.start),
            time: formatTime(selectedReservation.start)
          }}
          loading={deletingId === selectedReservation._id}
        />
      )}
    </div>
  );
}