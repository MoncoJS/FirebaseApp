import React, { useEffect } from 'react';
    import { NavigationContainer } from '@react-navigation/native';
    import { createStackNavigator } from '@react-navigation/stack';
    import LoginScreen from './components/LoginScreen';
    import RegisterScreen from './components/RegisterScreen';
    import ForgetScreen from './components/ForgetScreen';
    import MainScreen from './components/MainScreen';
    import { auth } from './firebase';

    const Stack = createStackNavigator();

    export default function App() {
      useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          console.log('Auth state:', user ? `Logged in as ${user.email}` : 'No user');
        });
        return () => unsubscribe();
      }, []);

      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
            <Stack.Screen name="Forget" component={ForgetScreen} options={{ title: 'Forgot Password' }} />
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }