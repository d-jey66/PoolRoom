import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react'
import { User, Hash, Calendar, Clock, ChevronDown, Check, CreditCard, Landmark } from 'lucide-react-native'
import { useAuth } from '../context/authContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

const MONTHS = [
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
  { value: '12', label: 'December' },
];
 
const NORMAL_TABLES = Array.from({ length: 10 }, (_, i) => i + 1);
const COUPE_TABLES  = Array.from({ length: 5  }, (_, i) => i + 1);
const DURATIONS     = ['1', '2', '3', '4'];



function Dropdown({ value, placeholder, options, onSelect, disabled }) {
  const [open, setOpen] = useState(false);
 
  const selected   = options.find(o => o.value === value);
  const labelShown = selected ? selected.label : placeholder;
 
  return (
    <>
      <TouchableOpacity
        onPress={() => !disabled && setOpen(true)}
        activeOpacity={disabled ? 1 : 0.7}
        className={`flex-row items-center justify-between bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 ${disabled ? 'opacity-40' : ''}`}
      >
        <Text className={`flex-1 text-base ${value ? 'text-slate-100' : 'text-slate-500'}`}>
          {labelShown}
        </Text>
        <ChevronDown size={16} color="#64748b" />
      </TouchableOpacity>
 
      <Modal transparent visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          className="flex-1 bg-black/60 justify-end"
          onPress={() => setOpen(false)}
          activeOpacity={1}
        >
          <View className="bg-slate-800 rounded-t-2xl pb-8 max-h-96">
            <View className="w-10 h-1 bg-slate-600 rounded-full self-center my-3" />
            <FlatList
              data={options}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    className={`flex-row items-center justify-between px-5 py-4 ${isSelected ? 'bg-slate-900' : ''}`}
                    onPress={() => { onSelect(item.value); setOpen(false); }}
                  >
                    <Text className={`text-base ${isSelected ? 'text-blue-400 font-bold' : 'text-slate-300'}`}>
                      {item.label}
                    </Text>
                    {isSelected && <Check size={16} color="#60a5fa" />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}



function FieldLabel({ icon: Icon, children }) {
  return (
    <View className="flex-row items-center gap-1.5 mb-2">
      {Icon && <Icon size={14} color="#94a3b8" />}
      <Text className="text-slate-400 text-xs font-semibold tracking-wide uppercase">
        {children}
      </Text>
    </View>
  );
}

function Reservation() {
  const {user} = useAuth()
  
  const [formData, setFormData] = useState({
      name:          '',
      tableType:     '',
      tableNumber:   '',
      month:         '',
      day:           '',
      startTime:     '',
      duration:      '1',
      paymentMethod: 'at_venue',
    });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPicker, setShowPicker] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
   
    const update = (key, val) =>
      setFormData(prev => {
        const next = { ...prev, [key]: val };
        if (key === 'tableType') next.tableNumber = '';
        return next;
      });
   
    const tableTypeOptions   = [
      { value: 'normal', label: 'Normal (10 GEL)' },
      { value: 'coupe',  label: 'Coupe (15 GEL)'  },
    ];
    const tableNumberOptions = (formData.tableType === 'normal' ? NORMAL_TABLES : COUPE_TABLES)
      .map(n => ({ value: n.toString(), label: `Table ${n}` }));
    const durationOptions    = DURATIONS.map(d => ({
      value: d, label: `${d} Hour${d !== '1' ? 's' : ''}`,
    }));
   
    const basePrice  = formData.tableType === 'coupe' ? 15 : formData.tableType === 'normal' ? 10 : 0;
    const totalPrice = basePrice * parseInt(formData.duration || '1', 10);
   
  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    const token = await AsyncStorage.getItem("token")
    
      const { name, tableType, tableNumber, month, day, startTime } = formData;
      try {
        if (!user) {
          setMessage({ type: 'error', text: 'You must be logged in to make a reservation' });
          setLoading(false)
          return;
        }
  
        if (!name || !month || !day || !startTime || !tableType || !tableNumber) {
          setMessage({ type: 'error', text: 'Please fill in all fields' });
          setLoading(false)
          return;
        }
  
        const currentYear = new Date().getFullYear();
        const dateString = `${currentYear}-${month}-${day.padStart(2, '0')}`;
  
        const payload = {
          userId: user._id,
          user: formData.name,
          tableNumber: parseInt(tableNumber),
          tableType: tableType,
          price: totalPrice,
          paymentMethod: formData.paymentMethod,
          date: dateString,
          startTime: startTime,
          duration: parseInt(formData.duration)
        };
  
        console.log('Sending payload:', payload);
        
        let response;
        try {
          console.log('About to call API...');
          response = await API.post(`/reservations/post`, payload, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          console.log('API call completed!');
          console.log('Full API Response:', response);
          console.log('Response type:', typeof response);
          console.log('Response keys:', response ? Object.keys(response) : 'null');
        } catch (error) {
          console.error('API call failed with error:', error);
          console.error('Error message:', error.message);
          console.error('Error response:', error.response);
          throw error;
        }
        
        if (response.status !== 200 && response.status !== 201) {
          throw new Error('Failed to create reservation');
        }
        
        console.log('About to set success message'); 
        
        setMessage({ 
          type: 'success', 
          text: `Reservation created! ${formData.name} - Table ${formData.tableNumber} from ${formData.startTime} for ${formData.duration}h` 
        });
        
        console.log('Success message set');
        
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
  
      } catch (error) {
        console.error('Reservation error:', error);
        setMessage({ 
          type: 'error', 
          text: error.message || 'Failed to create reservation. Please try again.' 
        });
      } finally {
        setLoading(false);
      }
    };
  
    const formatTime = (date) => {
      let hours = date.getHours()
      let minutes = date.getMinutes()
      
      return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
    }
  
    return (
      <View className="flex-1 bg-slate-950 pt-24">
        <ScrollView contentContainerClassName="px-4 pt-14 pb-1" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          
          <View className="items-center mb-8">
            <Text className="text-4xl font-extrabold text-purple-400 tracking-tight">Book a Table</Text>
            <Text className="text-slate-400 text-sm mt-1">Reserve your spot with us</Text>
          </View>
      
          <View className="bg-slate-900 border border-slate-800 rounded-2xl p-5 gap-5">
      
            <View>
              <FieldLabel icon={User}>Name for Reservation</FieldLabel>
              <TextInput className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-base text-slate-100" value={formData.name} onChangeText={v => update('name', v)} placeholder="John Doe" placeholderTextColor="#64748b"/>
            </View>
      
            <View className="flex-row gap-3">
              <View className="flex-1">
                <FieldLabel icon={Hash}>Table Type</FieldLabel>
                <Dropdown value={formData.tableType} placeholder="Select type" options={tableTypeOptions} onSelect={v => update('tableType', v)}/>
              </View>
              <View className="flex-1">
                <FieldLabel icon={Hash}>Table No.</FieldLabel>
                <Dropdown value={formData.tableNumber} placeholder={!formData.tableType ? 'Type first' : 'Select'} options={tableNumberOptions} onSelect={v => update('tableNumber', v)} disabled={!formData.tableType}/>
              </View>
            </View>
      
            <View className="flex-row gap-3">
              <View className="flex-1">
                <FieldLabel icon={Calendar}>Month</FieldLabel>
                <Dropdown value={formData.month} placeholder="Select month" options={MONTHS} onSelect={v => update('month', v)}/>
              </View>
              <View className="flex-1">
                <FieldLabel>Day</FieldLabel>
                <TextInput className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-base text-slate-100" value={formData.day} onChangeText={v => update('day', v.replace(/[^0-9]/g, ''))} placeholder="DD" placeholderTextColor="#64748b" keyboardType="number-pad" maxLength={2}/>
              </View>
            </View>
      
            <View className="flex-row gap-3">
              <View className="flex-1">
                <FieldLabel icon={Clock}>Start Time</FieldLabel>
                <TouchableOpacity onPress={() => {setShowPicker(true)}} className='bg-slate-800 border border-slate-700 rounded-xl px-4 py-3'><Text className='text-slate-100'>{formatTime(startTime)}</Text></TouchableOpacity>
                {showPicker && (
                  < DateTimePicker value={startTime} mode='time' is24Hour={true} display="default" onChange={(event, selectedTime) => {
                  setShowPicker(false)
                  
                  if (selectedTime) {
                    setStartTime(selectedTime)
                    update("startTime", formatTime(selectedTime))
                  }
                }}/>
                )}
              </View>
              <View className="flex-1">
                <FieldLabel icon={Clock}>Duration</FieldLabel>
                <Dropdown value={formData.duration} placeholder="Duration" options={durationOptions} onSelect={v => update('duration', v)}/>
              </View>
            </View>
      
            {formData.tableType ? (
              <View className="bg-slate-800 border border-slate-700 rounded-xl p-4 items-center">
                <Text className="text-slate-400 text-xs uppercase tracking-widest mb-1">Total Price</Text>
                <Text className="text-blue-300 text-4xl font-extrabold">{totalPrice} GEL</Text>
                <Text className="text-slate-500 text-xs mt-1">for {formData.duration} hour{formData.duration !== '1' ? 's' : ''}</Text>
              </View>
            ) : null}
      
            {message.text ? (
              <View className={`p-3 rounded-xl ${message.type === 'error' ? 'bg-red-900 border border-red-700' : 'bg-green-900 border border-green-700'}`}>
                <Text className="text-white text-sm">{message.text}</Text>
              </View>
            ) : null}
            <TouchableOpacity onPress={handleSubmit} disabled={loading} activeOpacity={0.85} className='w-full overflow-hidden mt-2'>  
              <LinearGradient className='w-full py-3 rounded-lg overflow-hidden flex items-center justify-center' colors={["#3b82f6", "#a855f7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading ? <ActivityIndicator color="#fff"/> : <Text className="text-white font-bold">Confirm Booking</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
  );
}

export default Reservation;