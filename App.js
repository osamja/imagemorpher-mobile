import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import * as AppleAuthentication from 'expo-apple-authentication';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  morph_user_endpoint,
  morph_exchange_authcode_endpoint,
} from './src/constants/index';
import { AuthContext } from './src/contexts/AuthContext';
import Login from './src/screens/Login';
import Morph from './src/screens/Morph';
import Profile from './src/screens/Profile';
import ManageAccount from './src/screens/ManageAccount';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      // const access_token = ''      // uncomment this line to mock login with a token
      // await SecureStore.setItemAsync('token', access_token);
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        try {
          const response = await fetch(morph_user_endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setIsLoggedIn(true);
          } else {
            await SecureStore.deleteItemAsync('token');
            setIsLoggedIn(false);
          }
        } catch (error) {
          await SecureStore.deleteItemAsync('token');
          setIsLoggedIn(false);
        }
      } else {
        await SecureStore.deleteItemAsync('token');
        setIsLoggedIn(false);
      }
    };

    checkToken();
  }, []);

  const handleLogin = async () => {
    try {
      const csrf = Math.random().toString(36).substring(2, 15);
      const nonce = Math.random().toString(36).substring(2, 10);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce
      );
  
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        state: csrf,
        nonce: hashedNonce,
      });
  
      // Exchange authorization code for access token
      const response = await fetch(morph_exchange_authcode_endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorizationCode: appleCredential.authorizationCode,
        }),
      });
  
      if (response.ok) {
        const json = await response.json();
        const id_token = json.id_token;
        await SecureStore.setItemAsync('token', id_token);
        setIsLoggedIn(true);
      } else {
        alert('Apple SignIn Error: ' + response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
    } catch (e) {
      alert('Apple SignIn Error: ' + response.status);
      if (e.code === 'ERR_CANCELED') {
        console.log('User canceled the authentication');
      } else {
        console.error('Apple SignIn Error:', e);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Login onLogin={handleLogin} />
      </View>
    );
  }

  const StackScreen = isLoggedIn ? (
    <Stack.Navigator>
      <Stack.Screen name="Morph" options={{ headerShown: false }}>
        {props => 
          <Morph 
            {...props} 
            isLoggedIn={isLoggedIn}
          />
        }
      </Stack.Screen>
      <Stack.Screen name="Profile">
        {props => <Profile {...props} />}
      </Stack.Screen>
      <Stack.Screen
        name="ManageAccount"
        component={ManageAccount} 
        options={{ title: 'Manage Account' }}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <NavigationContainer>
        {StackScreen}
      </NavigationContainer>
    </AuthContext.Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
