// https://github.com/mattfrances/FirebaseExpoAuthentication/blob/main/screens/LoginScreen.js
// https://firebase.google.com/docs/auth/web/email-link-auth

import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAuth,
  createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import app from '../../../../firebaseConfig'

/**
 * 
 * Expectations:
 * As a user, when I click on the sign in link from the email, I should be authenticated in the app.
 * 
 * I got two questions regarding this email auth.
 * 1. Is the user clicking on the right link?
 * 2. Is the link suppose to 
 */

const storeEmail = async (value) => {
  try {
    await AsyncStorage.setItem('@email', value)
  } catch (e) {
    // saving error
	console.log(e)
  }
}

const LoginScreen = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [emailSent, setEmailSent] = useState(false)

	const navigation = useNavigation()

	const auth = getAuth(app) 

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			if (user) {
				console.log('We signed in!!')
				navigation.replace("Home")
			}
		})

		return unsubscribe
	}, [])

	const signUserInWithEmailAndPassword = () => {
		signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in 
			const user = userCredential.user;
			storeEmail(email)
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(errorMessage + errorCode)
		});
	}

	const registerUserWithEmailAndPassword = () => {
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in 
				const user = userCredential.user;
				console.log(user)
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode + errorMessage)
				// ..
			});
	}


	// console.log('Email: ', AsyncStorage.getItem('@email'))

	// TODO 78646: Setup textContentType so that password info can be autofilled from keychain
	// https://reactnative.dev/docs/textinput#textcontenttype-ios

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior="padding"
		>
			<View style={styles.inputContainer}>
				<TextInput
					placeholder="Email"
					value={email}
					onChangeText={text => setEmail(text)}
					style={styles.input}
				/>
				<TextInput
					placeholder="Password"
					secureTextEntry={true}
					// value=""
					value={password}
					onChangeText={text => setPassword(text)}
					style={styles.input}
				/>
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					onPress={signUserInWithEmailAndPassword}
					style={[styles.button, styles.buttonOutline]}
				>
					<Text style={styles.buttonOutlineText}>Login</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					onPress={registerUserWithEmailAndPassword}
					style={[styles.button, styles.buttonOutline]}
				>
					<Text style={styles.buttonOutlineText}>Register</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	)
}

export default LoginScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputContainer: {
		width: '80%'
	},
	input: {
		backgroundColor: 'white',
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10,
		marginTop: 5,
	},
	buttonContainer: {
		width: '60%',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 40,
	},
	button: {
		backgroundColor: '#0782F9',
		width: '100%',
		padding: 15,
		borderRadius: 10,
		alignItems: 'center',
	},
	buttonOutline: {
		backgroundColor: 'white',
		marginTop: 5,
		borderColor: '#0782F9',
		borderWidth: 2,
	},
	buttonText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16,
	},
	buttonOutlineText: {
		color: '#0782F9',
		fontWeight: '700',
		fontSize: 16,
	},
})
