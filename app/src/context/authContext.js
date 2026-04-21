import { useNavigation } from "@react-navigation/native";
import { createContext, useContext, useEffect, useState } from "react";
import API from '../utils/api'
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const autoLogin = async () => {
      try {

        const token = await AsyncStorage.getItem("token")
         

        if (!token) {
          console.log('there is no token in async storage');
          return
        }

        const res = await API.post(`/auth/auto-login`, {}, {
          headers: {
            Authorization: `Bearer ${token}` 
          } 
        })

            setUser(res.data.user);
        } catch(err) {
        Alert.alert(err.message);
        }
    };

    useEffect(() => {
        autoLogin();
    }, [])

  const signup = async (data) => {
      try {
        
        const res = await API.post(`/auth/signup`, data)
            
            console.log('successfully posted to signup');
            
        const token = res.data.token
        
        await AsyncStorage.setItem("token", token)
        
            Alert.alert(`Welcome ${res.data.user.fullname}!`);
            setUser(res.data.user)
      } catch (err) {
            const message = err.response?.data?.message || err.message
            Alert.alert("Error", message);
        }
    };

    const login = async (data) => {
        try {
            const res = await API.post(`/auth/login`, data)
            
          const token = res.data.token
          
          Alert.alert(res.data.token)
          
          await AsyncStorage.setItem("token", token)
          
          
            Alert.alert(`Welcome ${res.data.user.fullname}!`);
            setUser(res.data.user);
        } catch (err) {
            const message = err.response?.data?.message || err.message
            Alert.alert("Error", message);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("token")

            setUser(null);
        } catch(err) {
            console.log(err.message);
        }
    };

    return (
        <AuthContext.Provider value={{signup, login, logout, user}}>
            { children }
        </AuthContext.Provider>
    )
}; 