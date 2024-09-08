import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Crypto from 'expo-crypto';
import {
  getToken,
  storeToken,
  deleteToken,
} from './src/store/index'
import * as AppleAuthentication from 'expo-apple-authentication';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  morph_user_endpoint,
  morph_exchange_authcode_endpoint,
  morph_refresh_token_endpoint,
  ID_TOKEN_KEY,
  REFRESH_TOKEN_KEY
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
      const idToken = await getToken(ID_TOKEN_KEY);

      if (idToken) {
        try {
          const response = await fetch(morph_user_endpoint, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (response.ok) {
            setIsLoggedIn(true);
          } else if (response.status === 401) {
            const refresh_token = await getToken(REFRESH_TOKEN_KEY);
            const new_id_token = await refreshToken(refresh_token);

            if (new_id_token) {
              await storeToken(ID_TOKEN_KEY, new_id_token);
              setIsLoggedIn(true);
            } else {
              await deleteToken(ID_TOKEN_KEY);
              await deleteToken(REFRESH_TOKEN_KEY);
              setIsLoggedIn(false);
            }
          } else {
            await deleteToken(ID_TOKEN_KEY);
            setIsLoggedIn(false);
          }
        } catch (error) {
          await deleteToken(ID_TOKEN_KEY);
          setIsLoggedIn(false);
        }
      } else {
        await deleteToken(ID_TOKEN_KEY);
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
        const jwt = await response.json();
        const id_token = jwt.id_token;
        const refresh_token = jwt.refresh_token;
        await storeToken(ID_TOKEN_KEY, id_token);
        await storeToken(REFRESH_TOKEN_KEY, refresh_token);
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

  const refreshToken = async (refresh_token) => {
    try {
      const response = await fetch(morph_refresh_token_endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: refresh_token,
        }),
      });

      if (response.ok) {
        const jwt = await response.json();
        const new_id_token = jwt.id_token;
        return new_id_token;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Morph" options={{ headerShown: false }}>
            {props => <Morph {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen
            name="ManageAccount"
            component={ManageAccount}
            options={{ title: 'Manage Account' }}
          />
          <Stack.Screen name="Login">
            {props => <Login {...props} onLogin={handleLogin} />}
          </Stack.Screen>
        </Stack.Navigator>
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
