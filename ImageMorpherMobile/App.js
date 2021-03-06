// https://docs.expo.io/versions/latest/sdk/imagepicker/

import React, { useState, Fragment } from 'react';
import {  Text, Image, View, StyleSheet, TouchableOpacity} from 'react-native';

import {LinearGradient} from 'expo-linear-gradient';
import { MorphStateButton } from './src/components/MorphStateButton';
import { ImageUploadButton } from './src/components/ImageUploadButton';
import { useFonts } from 'expo-font';

export default function FaceMorpher() {
  const [loaded] = useFonts({
    Montserrat: require('./assets/fonts/Stick/Stick-Regular.ttf'),
  });

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  if (!loaded) {
    return null;
  }

  return (
      <LinearGradient
        // Background Linear Gradient
        colors={['#e0c3fc', '#8ec5fc']}
        style={styles.background}
      >
        <Text style={styles.title}>Face Morpher</Text>
        <View style={styles.container}>
          <ImageUploadButton 
            image={image1}
            setImage={setImage1}
          />
          <ImageUploadButton
            image={image2}
            setImage={setImage2} 
          />
          <MorphStateButton
            image1={image1}
            image2={image2}
            setImage1={setImage1}
            setImage2={setImage2}
          />
        </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  title: {
    marginTop: 30,
    fontSize: 35,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Montserrat', 
    fontSize: 30,
  },
  container: {
    marginTop: 50,
    flexDirection: 'column',
    flex: 1,
  },
  reset: {
    width: 40,
    height: 40,
  }, 
});
