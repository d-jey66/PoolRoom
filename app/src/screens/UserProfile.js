import { Text, View, TouchableOpacity, Alert, ScrollView, TextInput } from "react-native";
import { useAuth } from '../context/authContext'
import React, { useState, useCallback, useEffect } from "react";
import axios from 'axios'
import API from '../utils/api'
import { formatDate, formatTime } from '../utils/utils'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Calendar, CircleX, Clock, Lock, Edit, User, Mail, LockKeyhole, CheckCheck } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from "@react-navigation/native";
import Toast from 'react-native-toast-message'


function UserProfile() {
  const { logout, user } = useAuth()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(false)
  const [cancelReservation, setCancelReservation] = useState(false)
  const [reservationId, setReservationId] = useState('')
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [isEditingInfo, setIsEditingInfo] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || ''
  });
  
  const fetchReservations = useCallback( async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      
      if (!token) {
        console.log("no token found")
        return
      }
      
      const res = await API.get(`/reservations/my-reservations`, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
      setReservations(res.data)
    } catch (error) {
      console.log(error.message);

    }
  })
  
  useFocusEffect(() => {
      fetchReservations();
    })
  
  const handleLogout = () => {
    try {
      logout()
    } catch (error) {
      Alert.alert("Error", error.message)
    }
  }
  
  const handleModalOpen = (reservationId) => {
    setReservationId(reservationId)
    setCancelReservation(true)
  }
  
  const handleCancelReservation = async () => {
    if (!reservationId) return;
    try {
      const token = await AsyncStorage.getItem("token")
      
      if (!token) {
        console.log("no token found")
        return
      }
      
      const res = await API.delete(`/reservations/delete/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log(res.data.message)
      setCancelReservation(false)
      setReservationId('')
      fetchReservations()
    } catch (error) {
      console.log(error.message)
    }
  }
  
  const handleUpdateInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      
      console.log('pressed');

      
      if (!token) {
        console.log('no token in storage')
        return
      }
      
      const data = { fullname: profileData.fullname.trim(), email: profileData.email.trim() }
      
      if (!data.fullname || !data.email) {
        Alert.alert("all fields are required")
        return
      }
      
      const res = await API.put(`/users/update-profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log(res.data.message)
      setIsEditingInfo(false)
      Toast.show({
        type: 'success',
        text1: 'Successfully Changed Profile Info'
      });
    } catch (error) {
      console.log(error.message)
    }
  }
  
  const handleUpdatePassword = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      
      if (!token) {
        console.log('no token stored');
        return
      }
      
      const confirm = passwordData.confirmPassword.trim()
      
      const data = { currentPassword: passwordData.currentPassword.trim(), newPassword: passwordData.newPassword.trim() }
      
      if (!data.currentPassword || !data.newPassword) {
        Alert.alert('all fields are required');
        return
      }
      
      if (data.newPassword !== confirm) {
        Alert.alert('passwords dont match')
        return
      }
      
      if (data.currentPassword === data.newPassword) {
        Alert.alert('you cannot set your old password as a new password')
      }
      const res = await API.put(`/users/change-password`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setIsEditingPassword(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      Toast.show({
        type: 'success',
        text1: 'Successfully Changed Password'
      });
      console.log(res.data.message);
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
  <ScrollView keyboardShouldPersistTaps='always' contentContainerStyle={{ flexGrow: 1 }} >
    <LinearGradient colors={['#020617', '#0f172a', '#020617']} style={{flex: 1}}>
        <View className='flex flex-col py-6 px-4 gap-10 w-full h-full'>
          <View className='flex flex-row items-center justify-between'>
            <View className='flex flex-row items-center gap-1'>
              <LinearGradient colors={['#8d27db', '#272ddb']} start={{x: 0, y: 1}} end={{x:1, y: 0}} style={{borderRadius: 999}}>
                <View className='rounded-full bg-transparent w-14 h-14 flex justify-center items-center'><Text className='text-white font-bold text-2xl'>{user.fullname.charAt(0)}</Text></View>
              </LinearGradient>
              <Text className='text-white text-3xl'>{user.fullname}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} className='bg-slate-950 px-5 py-2 rounded-lg'><Text className='text-red-600 text-xl'>logout</Text></TouchableOpacity>
          </View>
          <View className='flex flex-col gap-5'>
            <View className='flex flex-col gap-1'>
              <View className='flex flex-row'>
                <Calendar size={26} color='#ffffff'/>
                <Text className='text-2xl font-bold text-white'>My Reservations</Text>
              </View>
              <Text className='text-slate-400 ml-1'>View Your Reservations</Text>
            </View>
            {reservations.length === 0 ? (
              <Text className="text-white bg-slate-800 border border-slate-700 rounded-xl flex text-center py-3">No reservations made.</Text>
            )
              :
              (
              reservations.map((reservation) => {
                return (
                  <View key={reservation._id} className='bg-slate-800 border border-slate-700 flex flex-col p-5 rounded-xl gap-4'>
                    <View className='flex flex-row justify-between items-center'>
                      <View className='flex flex-col'>
                        <Text className='text-white text-xl font-semibold'>{reservation.user}</Text>
                        <View className='flex flex-row gap-2'>
                          <Text className={`rounded-full text-sm px-2 font-semibold border bg-slate-800 ${reservation.status == "pending" ? "text-orange-400 border-yellow-600" : "text-green-500 border-green-500"}`}>{reservation.status}</Text>
                          <Text className='rounded-full text-sm px-2 font-semibold border bg-slate-800 text-slate-200 border-slate-300'>at venue</Text>
                        </View>
                      </View>
                      <Text className='text-purple-400 bg-slate-900 px-5 py-3 rounded-lg'># {reservation.tableNumber}</Text>
                    </View>
                    <View className="bg-slate-900 flex flex-row items-center p-4 gap-3 rounded-xl">
                      <Calendar size={22} color='#4c87e6'/>
                      <View className="flex flex-col">
                        <Text className="text-sm text-slate-500">Date</Text>
                        <Text className="text-white">{formatDate(new Date(reservation.start))}</Text>
                      </View>
                    </View>
                    <View className="bg-slate-900 flex flex-row items-center p-4 gap-3 rounded-xl">
                      <Clock size={22} color='#05ff48'/>
                      <View className="flex flex-col">
                        <Text className="text-sm text-slate-500">Start</Text>
                        <Text className="text-white">{formatTime(new Date(reservation.start))}</Text>
                      </View>
                    </View>
                    <View className="bg-slate-900 flex flex-row items-center p-4 gap-3 rounded-xl">
                      <Clock size={22} color='#ff8904'/>
                      <View className="flex flex-col">
                        <Text className="text-sm text-slate-500">End</Text>
                        <Text className="text-white">{formatTime(new Date(reservation.end))}</Text>
                      </View>
                    </View>
                    <View className="bg-slate-700 w-full" style={{ height: 1 }} />
                    <TouchableOpacity className="flex flex-row gap-2 w-full items-center justify-center" onPress={() => { handleModalOpen(reservation._id) }}>
                      <CircleX color='#ff0000'/>
                      <Text className="text-red-500">Cancel Reservation</Text>
                    </TouchableOpacity>
                  </View>
                ) 
              })
              )
            }
          </View> 
          <View className='bg-slate-800 border border-slate-700 flex flex-col p-5 rounded-xl gap-4'>
            <View className='flex flex-row justify-between items-center'>
                <View className="flex flex-row gap-2">
                  <User color='#ffffff'/>
                  <Text className='text-white text-xl font-semibold'>Profile Information</Text>
              </View>
              <TouchableOpacity className="" onPress={() => {setIsEditingInfo(true)}}>
                <Edit size={24} />
              </TouchableOpacity>
            </View>
            <View className="flex flex-col gap-2">
              <View className="flex flex-row gap-1 items-center">
                <User color='#ffffff' size={20} style={{opacity: isEditingInfo ? 1 : 0.5}}/>
                <Text className="text-white text-lg" style={{opacity: isEditingInfo ? 1 : 0.5}} >FullName</Text>
              </View>
              <TextInput
                className="bg-slate-900 text-white placeholder:text-slate-400 p-4 rounded-lg"
                placeholder="YourName"
                value={profileData.fullname}
                onChangeText={(text) => { setProfileData(prev => ({ ...prev, fullname: text })) }}
                editable={isEditingInfo}
                style={{opacity: isEditingInfo ? 1 : 0.5}}
              />
            </View>
            <View className="flex flex-col gap-2">
              <View className="flex flex-row gap-1 items-center">
                <Mail color='#ffffff' size={20} style={{opacity: isEditingInfo ? 1 : 0.5}}/>
                <Text className="text-white text-lg" style={{opacity: isEditingInfo ? 1 : 0.5}}>Email</Text>
              </View>
              <TextInput
                className="bg-slate-900 text-white placeholder:text-slate-400 rounded-lg p-4"
                placeholder="YourName"
                value={profileData.email}
                onChangeText={(text) => { setProfileData(prev => ({ ...prev, email: text })) }}
                editable={isEditingInfo}
                style={{opacity: isEditingInfo ? 1 : 0.5}}
              />
            </View>
            
            
            {isEditingInfo && (
              <View className="flex flex-row w-full justify-around">
                
                <TouchableOpacity className="px-8 py-2" onPress={() => { handleUpdateInfo() }}>
                  <Text className="text-blue-500">Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-8 py-2" onPress={() => { setIsEditingInfo(false) }}>
                  <Text className="text-red-500">Cancel Editing</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          
          <View className='bg-slate-800 border border-slate-700 flex flex-col p-5 rounded-xl gap-4'>
            <View className='flex flex-row justify-between items-center'>
                <View className="flex flex-row gap-2">
                  <Lock color='#ffffff'/>
                  <Text className='text-white text-xl font-semibold'>Change Password</Text>
              </View>
              <TouchableOpacity className="" onPress={() => {setIsEditingPassword(true)}}>
                <Edit size={24} />
              </TouchableOpacity>
            </View>
            <View className="flex flex-col gap-2">
              <View className="flex flex-row gap-1 items-center">
                <Lock color='#ffffff' size={20} style={{opacity: isEditingPassword ? 1 : 0.5}} />
                <Text className="text-white text-lg" style={{opacity: isEditingPassword ? 1 : 0.5}}>Old Password</Text>
              </View>
              <TextInput
                className="bg-slate-900 text-white placeholder:text-slate-400 p-4 rounded-lg"
                placeholder="********"
                value={passwordData.currentPassword}
                onChangeText={(text) => { setPasswordData(prev => ({ ...prev, currentPassword: text })) }}
                editable={isEditingPassword}
                style={{ opacity: isEditingPassword ? 1 : 0.5 }}
                secureTextEntry={true}
              />
            </View>
            {isEditingPassword && (
              <View className="flex flex-col gap-5">
                <View className="flex flex-col gap-2">
                  <View className="flex flex-row gap-1 items-center">
                    <LockKeyhole color='#ffffff' size={20} style={{opacity: isEditingPassword ? 1 : 0.5}} />
                    <Text className="text-white text-lg" style={{opacity: isEditingPassword ? 1 : 0.5}}>New Password</Text>
                  </View>
                  <TextInput
                    className="bg-slate-900 text-white placeholder:text-slate-400 rounded-lg p-4"
                    placeholder="********"
                    value={passwordData.newPassword}
                    onChangeText={(text) => { setPasswordData(prev => ({ ...prev, newPassword: text })) }}
                    editable={isEditingPassword}
                    style={{ opacity: isEditingPassword ? 1 : 0.5 }}
                    secureTextEntry={true}
                  />
                </View>
                <View className="flex flex-col gap-2">
                  <View className="flex flex-row gap-1 items-center">
                    <CheckCheck color='#ffffff' size={20} style={{opacity: isEditingPassword ? 1 : 0.5}} />
                    <Text className="text-white text-lg" style={{opacity: isEditingPassword ? 1 : 0.5}}>confirm Password</Text>
                  </View>
                  <TextInput
                    className="bg-slate-900 text-white placeholder:text-slate-400 rounded-lg p-4"
                    placeholder="********"
                    value={passwordData.confirmPassword}
                    onChangeText={(text) => { setPasswordData(prev => ({ ...prev, confirmPassword: text })) }}
                    editable={isEditingPassword}
                    style={{ opacity: isEditingPassword ? 1 : 0.5 }}
                    secureTextEntry={true}
                  />
                </View>
                <View className="flex flex-row w-full justify-around">
                  
                  <TouchableOpacity className="px-8 py-2" onPress={() => { handleUpdatePassword() }}>
                    <Text className="text-blue-500">Save Changes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="px-8 py-2" onPress={() => { setIsEditingPassword(false) }}>
                    <Text className="text-red-500">Cancel Editing</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          {cancelReservation && (
            <View className="absolute top-0 left-0 right-0 bottom-0  justify-center items-center bg-black/60 p-4">
              <View className="w-full bg-slate-800 border border-red-700 p-5 rounded-xl gap-3 z-10">
                <View className="flex flex-row items-center justify-center gap-2">
                  <CircleX color="#ff0000" size={36} />
                  <Text className="font-bold text-white text-2xl">
                    Cancel Reservation?
                  </Text>
                </View>
                <Text className="text-center text-slate-300 mx-5">
                  Are you sure you want to cancel this reservation? This action cannot be undone.
                </Text>
                <TouchableOpacity className="w-full bg-red-600 flex items-center justify-center p-3 rounded-lg" onPress={() => { handleCancelReservation() }}>
                  <Text className="text-white">Yes, Cancel it</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-full bg-slate-700 border border-slate-600 p-3 flex items-center justify-center rounded-lg" onPress={() => {setCancelReservation(false)}}>
                  <Text>No, Keep Reservation</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <Toast
            position='bottom'
            bottomOffset={20}
          />
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

export default UserProfile;