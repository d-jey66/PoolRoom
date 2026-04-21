import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { LogIn, UserPlus, User, House, Calendar } from 'lucide-react-native'
import { useAuth } from '../context/authContext'
import Login from '../screens/auth/Login'
import Signup from '../screens/auth/Signup'
import UserProfile from '../screens/UserProfile'
import Home from '../screens/Home'
import Reservation from '../screens/Reservation'

const Tab = createBottomTabNavigator()

function RootNavigator() {
  
  const { user } = useAuth()
  
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: {backgroundColor: '#0f172a', height: 60, borderTopWidth: 1, borderTopColor: "#000000"}, tabBarItemStyle: {paddingVertical: 4}, tabBarActiveTintColor: "#ffffff", tabBarInactivetTintColor: "#94a3b8" }}>
      {
        !user ? (
          <> 
            <Tab.Screen name='login' component={Login} options={{ tabBarIcon: ({color, size}) => <LogIn color={color} size={size}  /> }}/>
            <Tab.Screen name='signup' component={Signup} options={{ tabBarIcon: ({color, size}) => <UserPlus color={color} size={size} />}} />
          </>
        ) : (
            <>
              <Tab.Screen name='Home' component={Home} options={{ tabBarIcon: ({color, size}) => <House color={color} size={size} />}} />
              <Tab.Screen name='Reserve' component={Reservation} options={{ tabBarIcon: ({color, size}) => <Calendar color={color} size={size} />}} />
              <Tab.Screen name='profile' component={UserProfile} options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} />}} />
            </>
        )
      }
    </Tab.Navigator>
  );
}

export default RootNavigator;