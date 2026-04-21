import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'
import "./global.css"
import { AuthProvider } from './src/context/authContext.js';
import RootNavigator from './src/navigation/RootNavigator.js';


export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <SafeAreaView className='flex-1 bg-black text-white'>
          <RootNavigator />
        </SafeAreaView>
      </AuthProvider>
    </NavigationContainer>
  );
};