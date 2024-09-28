import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Image, Text, Dimensions, Animated } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { LinearGradient } from 'expo-linear-gradient';

const Login = ({ onLogin }) => {
  const rotationAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotationAnimation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotationInterpolate = rotationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={['rgb(218, 195, 247)', 'rgb(154, 195, 247)']}
      style={styles.container}
    >
      <Text style={styles.title}>MyMorph</Text>
      <Animated.Image
        source={require('../../assets/logo/new-logo-yin-yang/yin-yang-no-bg.png')}
        style={[styles.logo, { transform: [{ rotate: rotationInterpolate }] }]}
      />
      <View style={styles.buttonContainer}>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={styles.appleAuthButton}
          onPress={onLogin} // Ensure this calls onLogin when pressed
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  logo: {
    width: 300, // Adjusted size to fit better on the screen
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20, // Adjust margin to move title closer to the logo
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  appleAuthButton: {
    width: 200,
    height: 45,
  },
  buttonContainer: {
    marginTop: 30, // Move the button higher
  },
});

export default Login;
