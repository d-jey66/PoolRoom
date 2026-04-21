import { View, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Text, Platform } from "react-native";
import { useState } from 'react'
import { useAuth } from '../../context/authContext'
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Mail } from 'lucide-react-native'
import { Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";


function Signup() {
  const { signup } = useAuth()
  const navigation = useNavigation()
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async () => {
    try{     
      const data = { fullname: fullName.trim(), email: email.trim(), password: password.trim() }
      
      if (!data.fullname || !data.email || !data.password) {
        Alert.alert("Error","all fields are required")
        return
      }
      
      setIsLoading(true)
      
      await signup(data)
      
      setUsername('')
      setEmail('')
      setPassword('')
      
    } catch (error) {
      Alert.alert("Error", error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const handleNavigation = () => {
    navigation.navigate('login')
  }
  
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={20}>
      <ScrollView keyboardShouldPersistTaps='always' contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient colors={['#020617', '#0f172a', '#020617']} style={{flex: 1}}>
          <View className="w-full h-full border flex flex-col px-5 py-12 gap-5 items-center justify-center">    
            <View className='flex flex-col items-center'>
              <Image  source={require('../../../assets/Logo.png')} className='w-32 h-32'/>
              <Text className='text-purple-400 font-bold text-[33px]'>Welcome To PoolRoom</Text>
            </View>
            <View className='border border-gray-800 w-full h-auto rounded-2xl py-6 px-6 gap-5'>
              <View className='w-full flex flex-col items-center justify-center gap-5'>
                <Text className='font-bold text-4xl text-purple-400'>Signup</Text>
                <Text className='text-gray-500'>Create A New account</Text>
              </View> 
              <View className='flex flex-col gap-5'>
                <View>
                  <View className='flex flex-row gap-1 items-center mb-1'>
                    <Lock color='#ffffff' size={16} /> 
                    <Text className='font-semibold text-white'>Full Name</Text>
                  </View>
                  <TextInput placeholder="FullName" value={fullName} onChangeText={setFullName} className='border-gray-700 border bg-gray-800 text-white rounded-lg placeholder:text-gray-500 px-5' />
                </View>
                <View>
                  <View className='flex flex-row gap-1 items-center mb-1'>
                    <Mail color='#ffffff' size={16}/> 
                    <Text className='font-semibold text-white'>Email</Text>
                  </View>
                  <TextInput placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" className='border-gray-700 border bg-gray-800 text-white rounded-lg placeholder:text-gray-500 px-5' />
                </View>
                <View>
                  <View className='flex flex-row gap-1 items-center mb-1'>
                    <Lock color='#ffffff' size={16} /> 
                    <Text className='font-semibold text-white'>Password</Text>
                  </View>
                  <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} className='border-gray-700 border bg-gray-800 text-white rounded-lg placeholder:text-gray-500 px-5' />
                </View>
                <TouchableOpacity onPress={handleSubmit} disabled={isLoading} className='w-full overflow-hidden mt-2'>
                  <LinearGradient className='w-full py-3 rounded-lg overflow-hidden flex items-center justify-center' colors={["#3b82f6", "#a855f7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text className='text-white font-bold'>{isLoading ? "Signing Up..." : "Signup"}</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <View className='flex flex-row gap-2 items-center justify-center'>
                  <Text className='font-bold text-gray-500'>Already Have An Account?</Text>
                  <TouchableOpacity onPress={handleNavigation}><Text className='font-bold text-blue-800'>Log In</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Signup;