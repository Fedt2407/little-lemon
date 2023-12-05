import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './screens/Onboarding';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SplashScreen from './screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [state, setState] = useState({
    isLoading: true,
    isOnboardingCompleted: true,
  });

  useEffect(() => {
    const checkOnboarding = async () => {
      const result = await AsyncStorage.getItem('isOnboardingCompleted');
      setState({
        isLoading: false,
        isOnboardingCompleted: JSON.parse(result) || false,
      });
    };

    checkOnboarding();
  }, []);

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        {state.isOnboardingCompleted ? (
          <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}} />
        ) : (
          <Stack.Screen name="Onboarding" component={Onboarding} options={{headerShown: false}}/>
        )}
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}