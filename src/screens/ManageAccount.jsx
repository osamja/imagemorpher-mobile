import React, { useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator } from 'react-native';
import { getToken, deleteToken } from '../store';
import { morph_delete_account_endpoint, ID_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/index';
import { AuthContext } from '../contexts/AuthContext';

const ManageAccount = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = React.useContext(AuthContext);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await deleteToken(ID_TOKEN_KEY);
      await deleteToken(REFRESH_TOKEN_KEY);
      setIsLoggedIn(false);
      Alert.alert('Signed Out', 'You have been signed out successfully.');
    } catch (error) {
      console.error('Failed to sign out:', error);
      Alert.alert('Error', 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
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
            setIsLoading(true);
            try {
              const token = await getToken(ID_TOKEN_KEY);
              const refreshToken = await getToken(REFRESH_TOKEN_KEY);

              const response = await fetch(morph_delete_account_endpoint, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'X-REFRESH-TOKEN': refreshToken,
                },
              });

              if (response.ok) {
                Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
                await handleSignOut();
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
      { cancelable: false },
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Processing...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Delete Account"
        color="red"
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
