// https://docs.expo.io/versions/latest/sdk/imagepicker/

import React, { useState, useEffect, Fragment } from 'react';
import {  Text, Image, View, Platform, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';
import {LinearGradient} from 'expo-linear-gradient';
import { MorphStateButton } from './src/components/MorphStateButton';

export default function FaceMorpher() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      // Quality of compression. (0 - 1.0).
      quality: 0.2,
      base64: true,
    });

    if (!result.cancelled) {
        if (image1 == null) {
          if (result.base64) {
            setImage1(result.base64)
          } else {
            setImage1(result.uri);
            // console.log(result.uri);
          }
        }
        else {
          if (result.base64) {
            setImage2(result.base64)
          } else {
            setImage2(result.uri);
            // console.log(result.uri);
          }
        }
      }
  }

  function setInitialImageState() {
    setImage1(null);
    setImage2(null);
  }

  const camera = <Image source={require('./test-images/camera.png')} style={styles.camera} />;
  const check_mark = <Image source={require('./test-images/success-green-check-mark.png')} style={styles.checkMark} />
  const defaultView = 
    <Fragment>
      <View style={styles.uploadArea} >
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.uploadImgArea}>
            {camera}
            {image1 && check_mark}
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.uploadArea} >
        <TouchableOpacity onPress={pickImage}>
        <View style={styles.uploadImgArea}>
          {camera}
          {image2 && check_mark}
        </View>
        </TouchableOpacity>
      </View>
    </Fragment>

  return (
      <LinearGradient
        // Background Linear Gradient
        colors={['#fbc2eb', '#a6c1ee']}
        style={styles.background}
      >
        <Text style={styles.title}>Face Morpher</Text>
        <View style={styles.container}>
          {defaultView}
          <MorphStateButton 
            image1={image1}
            image2={image2}
            setInitialImageState={setInitialImageState}
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
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    marginTop: 50,
    flexDirection: 'column',
    flex: 1,
  },
  uploadArea:  {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  uploadImgArea: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    backgroundColor: 'white',
  },
  reset: {
    width: 40,
    height: 40,
  },
  camera: {
    width: 75,
    height: 50,
  },
  checkMark: {
    width: 30,
    height: 30,
    marginLeft: 20,
  },  
  morphArea: {
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  morphBtn: {
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'System',
  }
});
