import React from 'react'

import LoginScreen from './src/components/views/Login/Login'
import HomeScreen from './src/components/views/Home'

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function App () {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen}>
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
