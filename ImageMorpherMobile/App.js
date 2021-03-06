// https://docs.expo.io/versions/latest/sdk/imagepicker/

import React, { useState, Fragment } from 'react';
import {  Text, Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {LinearGradient} from 'expo-linear-gradient';
import { MorphStateButton } from './src/components/MorphStateButton';
import { useFonts } from 'expo-font';

export default function FaceMorpher() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const [loaded] = useFonts({
    Montserrat: require('./assets/fonts/Stick/Stick-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }



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

  const check_mark = <Image source={require('./test-images/success-green-check-mark.png')} style={styles.checkMark} />
  
  const uploadBtn = <Image source={require('./test-images/avatar.svg')} style={styles.uploadBtn} />;
  const isUploadedBtn = <Image source={require('./test-images/green-avatar.svg')} style={styles.uploadBtn} />;

  const defaultView = 
    <Fragment>
      <View style={styles.uploadArea} >

        <TouchableOpacity onPress={pickImage}>
        <LinearGradient
        // Background Linear Gradient
        colors={['#e0c3fc', '#8ec5fc']}
        style={styles.background}
        >
          <View style={styles.uploadImgArea}>
            {!image1 && uploadBtn}
            {image1 && isUploadedBtn}
          </View>
        </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={styles.uploadArea} >
        <TouchableOpacity onPress={pickImage}>
        <LinearGradient
        // Background Linear Gradient
        colors={['#e0c3fc', '#8ec5fc']}
        style={styles.background}
        >
          <View style={styles.uploadImgArea}>
            {!image2 && uploadBtn}
            {image2 && isUploadedBtn}
          </View>
        </LinearGradient>
        </TouchableOpacity>
      </View>
    </Fragment>

  return (
      <LinearGradient
        // Background Linear Gradient
        colors={['#e0c3fc', '#8ec5fc']}
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
  uploadArea:  {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  uploadImgArea: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  reset: {
    width: 40,
    height: 40,
  },
  uploadBtn: {
    width: 100,
    height: 75,
  },
  checkMark: {
    width: 30,
    height: 30,
    marginLeft: 20,
  },  
});
