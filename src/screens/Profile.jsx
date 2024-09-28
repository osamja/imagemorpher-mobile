import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
  ActivityIndicator,
} from 'react-native';
import { getToken, storeToken, deleteToken } from '../store';
import * as WebBrowser from 'expo-web-browser';
import Login from './Login'; // Import Login component

import {
  mymorphs_endpoint,
  morph_status_webpage,
  morph_delete_account_endpoint,
  ID_TOKEN_KEY,
} from '../constants/index';

const Profile = ({ navigation }) => {
  const [morphHistory, setMorphHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [token, setTokenState] = useState(null); // Store the token

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = await getToken(ID_TOKEN_KEY);
    if (token) {
      setIsLoggedIn(true);
      setTokenState(token);
      fetchMorphHistory(token); // Fetch history if logged in
    } else {
      setIsLoggedIn(false);
    }
  };

  const MorphHistoryList = ({ isLoading, error, morphHistory }) => {
    return isLoading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : error ? (
      <Text>{error}</Text>
    ) : morphHistory && morphHistory.length === 0 ? (
      <Text>No morph history found</Text>
    ) : (
      <FlatList
        data={morphHistory}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.historyItem}
            onPress={() => openURL(`${morph_status_webpage}/${item}`)}
          >
            <Text>UUID: {item}</Text>
            <Text>Click to View Status</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  const fetchMorphHistory = async (token) => {
    setIsLoading(true);
    try {
      const response = await fetch(mymorphs_endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        setMorphHistory(json['morph_ids']);
      } else {
        setError('Failed to fetch morph history');
      }
    } catch (error) {
      setError('Failed to fetch morph history');
    } finally {
      setIsLoading(false);
    }
  };

  const openURL = (url) => {
    if (url) {
      WebBrowser.openBrowserAsync(url);
    }
  };

  const handleLogin = async (token) => {
    // Store token using storeToken instead of setToken
    await storeToken(ID_TOKEN_KEY, token);
    setIsLoggedIn(true);
    setTokenState(token);
    fetchMorphHistory(token);
  };

  const navigateToManageAccount = () => {
    navigation.navigate('ManageAccount');
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Login onLogin={handleLogin} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Morph History</Text>
      <MorphHistoryList
        isLoading={isLoading}
        error={error}
        morphHistory={morphHistory}
      />

      <Button title="Manage Account" onPress={navigateToManageAccount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  morphHistoryList: {
    marginBottom: 20,
  },
  manageAccountButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  manageAccountButtonText: {
    color: 'white',
    fontSize: 16,
  },
  signOutButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Profile;
