import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser'

import {
  mymorphs_endpoint,
  morph_status_webpage,
  morph_delete_account_endpoint,
} from '../constants/index';

const Profile = ({ navigation }) => {
  const [morphHistory, setMorphHistory] = useState(null);

  
  useEffect(() => {
    fetchMorphHistory();
  }, []);

  const fetchMorphHistory = async () => {
    const token = await SecureStore.getItemAsync('token');
    try {
      const response = await fetch(mymorphs_endpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.ok){
          const json = await response.json();
          setMorphHistory(json['morph_ids']);
      }else{
          console.log('Response status:', response.status);
          console.log('Response data:', await response.text());
      }
    } catch (error) {
      console.error('Failed to fetch morph history:', error);
    }
  };

  const openURL = (url) => {
    if (url) {
      WebBrowser.openBrowserAsync(url);
    }
  };

  const navigateToManageAccount = () => {
    navigation.navigate('ManageAccount');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Morph History</Text>
      <FlatList
        data={morphHistory}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.historyItem} onPress={() => openURL(`${morph_status_webpage}/${item}`)}>
            <Text>UUID: {item}</Text>
            <Text>Click to View Status</Text>
          </TouchableOpacity>
        )}
      />

      <Button
        title="Manage Account"
        onPress={navigateToManageAccount}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
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
