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
  tableType: "normal" | "coupe" | "";
  tableNumber: string;
  paymentMethod: "online" | "at_venue";
}


export default function Reservations() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    month: '',
    day: '',
    startTime: '',
    duration: '1',
    tableType: '',
    tableNumber: '',
    paymentMethod: 'at_venue'
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
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'tableType') {
        updated.tableNumber = '';
      }
      return updated;
    });
    setMessage({ type: '', text: '' });
  };

  const getAvailableTables = () => {
    if (!formData.tableType) return [];
    
    const coupeTables = [1, 2, 5, 8, 11];
    const normalTables = [3, 4, 6, 7, 9, 10];
    
    return formData.tableType === 'coupe' ? coupeTables : normalTables;
  };

  const getPrice = () => {
    if (formData.duration == '1') {
      return formData.tableType === 'coupe' ? 15 : formData.tableType === 'normal' ? 10 : 0;
    } else if (formData.duration == '2') {
      return formData.tableType === 'coupe' ? 30 : formData.tableType === 'normal' ? 20 : 0;
    }else if (formData.duration == '3') {
      return formData.tableType === 'coupe' ? 45 : formData.tableType === 'normal' ? 30 : 0;
    }else if (formData.duration == '4') {
      return formData.tableType === 'coupe' ? 60 : formData.tableType === 'normal' ? 40 : 0;
    }
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

      if (!formData.name || !formData.month || !formData.day || !formData.startTime || !formData.tableType || !formData.tableNumber) {
        setMessage({ type: 'error', text: 'Please fill in all fields' });
        return;
      }

      const currentYear = new Date().getFullYear();
      const dateString = `${currentYear}-${formData.month}-${formData.day.padStart(2, '0')}`;
      const price = getPrice();

      const payload = {
        userId: user._id,
        user: formData.name,
        tableNumber: parseInt(formData.tableNumber),
        tableType: formData.tableType,
        price: price,
        paymentMethod: formData.paymentMethod,
        date: dateString,
        startTime: formData.startTime,
        duration: parseInt(formData.duration)
      };

      console.log('Sending payload:', payload);
      
      let response;
      try {
        console.log('About to call API...');
        response = await reservationAPI.createReservation(payload);
        console.log('API call completed!');
        console.log('Full API Response:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', response ? Object.keys(response) : 'null');
      } catch (apiError: any) {
        console.error('API call failed with error:', apiError);
        console.error('Error message:', apiError.message);
        console.error('Error response:', apiError.response);
        throw apiError;
      }
      
      if (!response) {
        console.error('Response is null or undefined!');
        throw new Error('No response from server');
      }
      
      console.log('About to set success message');
      
      // If payment method is online, redirect to payment page
      if (formData.paymentMethod === 'online' && response.reservation) {
        const price = getPrice();
        console.log('Redirecting with:', {
          reservationId: response.reservation._id,
          price: price,
          duration: formData.duration
        });
        window.location.href = `/payment/${response.reservation._id}/${price}/${formData.duration}`;
        return;
      }
      
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
        tableType: '',
        tableNumber: '',
        paymentMethod: 'at_venue'
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
      <Card ref={cardRef} className="w-full max-w-2xl shadow-2xl border-slate-800 bg-slate-900/50 backdrop-blur">
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
            {/* Name Field - Full Width */}
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

            {/* Table Type & Table Number - 2 Columns */}
            <div className="form-field grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tableType" className="text-slate-300 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Table Type
                </Label>
                <Select value={formData.tableType} onValueChange={(value) => handleInputChange('tableType', value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100 w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="normal" className="text-slate-100">Normal (10 GEL)</SelectItem>
                    <SelectItem value="coupe" className="text-slate-100">Coupe (15 GEL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tableNumber" className="text-slate-300 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Table Number
                </Label>
                <Select 
                  value={formData.tableNumber} 
                  onValueChange={(value) => handleInputChange('tableNumber', value)}
                  disabled={!formData.tableType}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100 w-full">
                    <SelectValue placeholder={!formData.tableType ? "Select type first" : "Select table"} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {getAvailableTables().map(num => (
                      <SelectItem key={num} value={num.toString()} className="text-slate-100">
                        Table {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Fields - 2 Columns */}
            <div className="form-field grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month" className="text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Month
                </Label>
                <Select value={formData.month} onValueChange={(value) => handleInputChange('month', value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100 w-full">
                    <SelectValue placeholder="Select month" />
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

            {/* Time & Duration - 2 Columns */}
            <div className="form-field grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
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

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-slate-300">Duration</Label>
                <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100 w-full">
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
            </div>

            {/* Price Display */}
            {formData.tableType && (
              <div className="form-field">
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-center">
                  <div className="text-xs text-slate-400 mb-1">Total Price</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {getPrice()} GEL
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    for {formData.duration} hour(s)
                    {formData.paymentMethod === 'online' && (
                      <span className="text-green-400 ml-1">• 10% off!</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="form-field space-y-3">
              <Label className="text-slate-300 text-sm">Payment Method</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div 
                  onClick={() => handleInputChange('paymentMethod', 'online')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.paymentMethod === 'online' 
                      ? 'border-green-500 bg-green-900/20' 
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.paymentMethod === 'online' ? 'border-green-500' : 'border-slate-500'
                      }`}>
                        {formData.paymentMethod === 'online' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        )}
                      </div>
                      <div className="text-slate-100 font-semibold">Pay Now Online</div>
                    </div>
                    <div className="bg-green-900/40 text-green-400 px-2.5 py-1 rounded-full text-xs font-bold">
                      -10%
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 ml-7">Get instant 10% discount</div>
                </div>

                <div 
                  onClick={() => handleInputChange('paymentMethod', 'at_venue')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.paymentMethod === 'at_venue' 
                      ? 'border-blue-500 bg-blue-900/20' 
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.paymentMethod === 'at_venue' ? 'border-blue-500' : 'border-slate-500'
                    }`}>
                      {formData.paymentMethod === 'at_venue' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <div className="text-slate-100 font-semibold">Pay at Venue</div>
                  </div>
                  <div className="text-xs text-slate-400 ml-7">Pay when you arrive</div>
                </div>
              </div>
            </div>

            {/* Alert Message */}
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

            {/* Submit Button */}
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 py-6 text-lg"
            >
              {loading ? 'Creating Reservation...' : 'Book Reservation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}