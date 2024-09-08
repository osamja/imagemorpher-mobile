import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export async function getToken(key) {
    if (Platform.OS === 'web') {
        // Use localStorage for web
        return localStorage.getItem(key);
    } else {
        // Use SecureStore for mobile
        return await SecureStore.getItemAsync(key);
    }
}

export async function storeToken(key, token) {
    if (Platform.OS === 'web') {
        localStorage.setItem(key, token);
    } else {
        await SecureStore.setItemAsync(key, token);
    }
}

export async function deleteToken(key) {
    if (Platform.OS === 'web') {
        localStorage.removeItem(key);
    } else {
        await SecureStore.deleteItemAsync(key);
    }
}
