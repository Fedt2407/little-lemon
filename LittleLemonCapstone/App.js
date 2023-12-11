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
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const result = await AsyncStorage.getItem('isOnboardingCompleted');
      setIsLoading(false);
      setIsOnboardingCompleted(JSON.parse(result));
      console.log('isOnboardingCompleted:', result);
    };
    checkOnboarding();
  }, []);

  const updateOnboardingStatus = async (value) => {
    setIsOnboardingCompleted(value);
    await AsyncStorage.setItem('isOnboardingCompleted', JSON.stringify(value));
  };

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator>
        {isOnboardingCompleted ? (
          <Stack.Screen
            name="Profile"
            options={{ headerShown: false }}
          >
            {props => <ProfileScreen {...props} updateOnboardingStatus={updateOnboardingStatus} />}
          </Stack.Screen>

        ) : (
          <Stack.Screen
            name="Onboarding"
            options={{ headerShown: false }}
          >
            {props => <Onboarding {...props} updateOnboardingStatus={updateOnboardingStatus} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}