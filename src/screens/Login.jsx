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
          onPress={onLogin}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  logo: {
    width: 500,
    height: 500,
    marginBottom: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 100,
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  appleAuthButton: {
    width: 200,
    height: 45,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
});

export default Login;
