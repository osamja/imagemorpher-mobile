// https://docs.expo.io/versions/latest/sdk/imagepicker/

import React, { useState} from 'react';
import {  Text, View, StyleSheet} from 'react-native';

import {LinearGradient} from 'expo-linear-gradient';
import { MorphStateButton } from './src/components/MorphStateButton';
import { ImageUploadButton } from './src/components/ImageUploadButton';
import { useFonts } from 'expo-font';

export default function FaceMorpher() {
  const [loaded] = useFonts({
    Roboto: require('./assets/fonts/Roboto_Slab/RobotoSlab-VariableFont_wght.ttf'),
  });

  const [firstImageRef, setFirstImageRef] = useState(null);
  const [secondImageRef, setSecondImageRef] = useState(null);

  if (!loaded) {
    return null;
  }

  return (
      <LinearGradient
        // Background Linear Gradient
        colors={['#c2e9fb','#a1c4fd']}
        style={styles.background}
        start={[0,0]}
        end={[1,1]}
      >
        <Text style={styles.title}>Face Morpher</Text>
        <View style={styles.container}>
          <ImageUploadButton 
            imageRef={firstImageRef}
            setImageRef={setFirstImageRef}
          />
          <ImageUploadButton
            imageRef={secondImageRef}
            setImageRef={setSecondImageRef}
          />
          <MorphStateButton
            firstImageRef={firstImageRef}
            secondImageRef={secondImageRef}
            setFirstImageRef={setFirstImageRef}
            setSecondImageRef={setSecondImageRef}
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
    fontSize: 40,
    textAlign: 'center',
    color: '#2b2b2b',
    fontWeight: 'bold',
    fontFamily: 'Roboto', 
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
