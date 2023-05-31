import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import {
    morph_delete_account_endpoint,
    ID_TOKEN_KEY,
    REFRESH_TOKEN_KEY
  } from '../constants/index';

import { AuthContext } from '../contexts/AuthContext';

const ManageAccount = ({
    navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = React.useContext(AuthContext);

  const handleSignOut = async () => {
    await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    setIsLoggedIn(false);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Confirm Deletion', 
      'Are you sure you want to delete your account? This action is irreversible and all your data will be lost.', 
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes, Delete My Account', 
          onPress: async () => {
            const token = await SecureStore.getItemAsync(ID_TOKEN_KEY);
            const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    
            setIsLoading(true);
            
            try {
              const response = await fetch(morph_delete_account_endpoint, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'X-REFRESH-TOKEN': refreshToken,
                },
              });

              if (response.ok) {
                Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
                handleSignOut();
              } else {
                throw new Error('Failed to delete account');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
              console.error('Failed to delete account:', error);
            } finally {
              setIsLoading(false);
            }
          }
        },
      ],
      {cancelable: false},
    );
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Delete Account"
        color="red"
        disabled={isLoading}
        onPress={handleDeleteAccount}
      />
      <Button
        title="Sign Out"
        onPress={handleSignOut}
      />
    </View>
  );
};

export default ManageAccount;
