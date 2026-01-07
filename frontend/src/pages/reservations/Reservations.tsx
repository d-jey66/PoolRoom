/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, User, Hash, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import gsap from 'gsap';
import { reservationAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface FormData {
  name: string;
  month: string;
  day: string;
  startTime: string;
  duration: string;
  tableNumber: string;
}

export default function Reservations() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    month: '',
    day: '',
    startTime: '',
    duration: '1',
    tableNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ 
    type: '', 
    text: '' 
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { 
          opacity: 0, 
          y: 50,
          scale: 0.9
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out'
        }
      );
    }
  }, []);

  useEffect(() => {
    if (formRef.current) {
      const fields = formRef.current.querySelectorAll('.form-field');
      gsap.fromTo(
        fields,
        { opacity: 0, x: -20 },
        { 
          opacity: 1, 
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.3
        }
      );
    }
  }, []);

  useEffect(() => {
    if (message.text && alertRef.current) {
      gsap.fromTo(
        alertRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [message]);

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!user) {
        setMessage({ type: 'error', text: 'You must be logged in to make a reservation' });
        return;
      }

      if (!formData.name || !formData.month || !formData.day || !formData.startTime || !formData.tableNumber) {
        setMessage({ type: 'error', text: 'Please fill in all fields' });
        return;
      }

      const currentYear = new Date().getFullYear();
      const dateString = `${currentYear}-${formData.month}-${formData.day.padStart(2, '0')}`;

      const payload = {
        userId: user._id,
        user: formData.name,
        tableNumber: parseInt(formData.tableNumber),
        date: dateString,
        startTime: formData.startTime,
        duration: parseInt(formData.duration)
      };

      console.log('Sending payload:', payload);
      
      // Set a timeout for the request
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - server took too long to respond')), 30000);
      });
      
      const response = await Promise.race([
        reservationAPI.createReservation(payload),
        timeoutPromise
      ]) as any;
      
      console.log('Full API Response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));
      
      if (!response) {
        console.error('Response is null or undefined!');
        throw new Error('No response from server');
      }
      
      console.log('About to set success message');
      
      setMessage({ 
        type: 'success', 
        text: `Reservation created! ${formData.name} - Table ${formData.tableNumber} from ${formData.startTime} for ${formData.duration}h` 
      });
      
      console.log('Success message set');
      
      // Reset form
      setFormData({
        name: '',
        month: '',
        day: '',
        startTime: '',
        duration: '1',
        tableNumber: ''
      });
      
      console.log('Form reset complete');

    } catch (error: any) {
      console.error('Reservation error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to create reservation. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <Card ref={cardRef} className="w-full max-w-md shadow-2xl border-slate-800 bg-slate-900/50 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Book a Table
          </CardTitle>
          <CardDescription className="text-center text-slate-400">
            Reserve your spot with us
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div ref={formRef} className="space-y-5">
            <div className="form-field space-y-2">
              <Label htmlFor="name" className="text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4" />
                Name for Reservation
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Doe"
                className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            <div className="form-field space-y-2">
              <Label htmlFor="tableNumber" className="text-slate-300 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Table Number
              </Label>
              <Input
                id="tableNumber"
                type="number"
                value={formData.tableNumber}
                onChange={(e) => handleInputChange('tableNumber', e.target.value)}
                placeholder="e.g., 5"
                min="1"
                max="10"
                className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            <div className="form-field grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month" className="text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Month
                </Label>
                <Select value={formData.month} onValueChange={(value) => handleInputChange('month', value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value} className="text-slate-100">
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="day" className="text-slate-300">Day</Label>
                <Input
                  id="day"
                  type="number"
                  value={formData.day}
                  onChange={(e) => handleInputChange('day', e.target.value)}
                  placeholder="DD"
                  min="1"
                  max="31"
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="form-field space-y-2">
              <Label htmlFor="startTime" className="text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="bg-slate-800 border-slate-700 text-slate-100 focus:border-blue-500"
              />
            </div>

            <div className="form-field space-y-2">
              <Label htmlFor="duration" className="text-slate-300">Duration</Label>
              <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="1" className="text-slate-100">1 Hour</SelectItem>
                  <SelectItem value="2" className="text-slate-100">2 Hours</SelectItem>
                  <SelectItem value="3" className="text-slate-100">3 Hours</SelectItem>
                  <SelectItem value="4" className="text-slate-100">4 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {message.text && (
              <div ref={alertRef}>
                <Alert variant={message.type === 'error' ? 'destructive' : 'default'} 
                       className={message.type === 'success' ? 'bg-green-900/20 border-green-700 text-green-400' : ''}>
                  {message.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              </div>
            )}

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? 'Creating Reservation...' : 'Book Reservation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}