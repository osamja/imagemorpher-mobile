// https://docs.expo.io/versions/latest/sdk/imagepicker/

import React, { useState, useEffect, Fragment } from 'react';
import {  Text, Image, View, Platform, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';
import {LinearGradient} from 'expo-linear-gradient'

export default function FaceMorpher({

}) {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [morphResponse, setMorphResponse] = useState(null);

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

  function setInitialStates() {
    setImage1(null)
    setImage2(null)
    setMorphResponse(null)
    setIsFailure(false)
    setIsLoading(false)
    setIsSuccess(false)
  }

  function MorphStateButton({
    isLoading,
    isSuccess,
    isFailure,
    morphResponse,
    image1,
    image2,
  }) {


    if (isLoading) {
      return (
        <TouchableOpacity style={styles.morphArea}>
          <Text style={styles.morphBtn}>
            MORPHING IMAGES
            <ActivityIndicator size="small"/>
          </Text>
        </TouchableOpacity>
      )
    }

    if (isSuccess && morphResponse) {
      return (
        <TouchableOpacity onPress={() => setInitialStates()} style={styles.morphArea}>
            <Image source={require('./test-images/reset-update.png')} style={styles.reset}></Image>
        </TouchableOpacity>
      ) 
    }

    if (isFailure) {
      return (
        <TouchableOpacity onPress={() => setInitialStates()} style={styles.morphArea}> 
          <Text style={styles.morphAreaTxt}>MORPH FAILED
            <Image source={require('./test-images/reset-update.png')} style={styles.reset}></Image>
          </Text>
      </TouchableOpacity>
      )

    }

    if (!image1 || !image2) {
      return (
        <TouchableOpacity style={styles.morphArea}>
          {!morphResponse && <TouchableOpacity style={styles.morphBtn} disabled>MORPH</TouchableOpacity>}
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity style={styles.morphArea}>
        {!morphResponse && <TouchableOpacity style={styles.morphBtn}  onPress={() => getMorph(image1, image2)}>MORPH</TouchableOpacity>}
      </TouchableOpacity>
    )
  }

  async function getMorph(image1, image2) {
    if (!image1 || !image2) {
      return;
    }

    try {
      let data = new FormData();
      data.append('Image-1', image1);
      data.append('Image-2', image2);
      data.append('isSequence', 'False');
      data.append('stepSize', '20');
      // Correct
      setIsLoading(true);
      setIsSuccess(false);
      setIsFailure(false);
      setMorphResponse(null);
      let response = await 
        fetch(
          'http://sammyjaved.com:8090/morph', {
            method: 'POST',
            headers: {
              'Authorization': 'ImageMorpherV1'
            },
            body: data,
          } 
        )
        .then(res => {
          try {
            if (res.ok) {
              return res.json()
            } else {
              throw new Error(res)
            }
          }
          catch (err) {
            console.log(err.message)
            setIsLoading(false);
            setIsSuccess(false);
            setIsFailure(true);
            setMorphResponse(null);
            throw err;
          }
        })
        .then (resJson => {
          // On success, hide the loading spinner
          setIsLoading(false);
          setIsSuccess(true);
          setIsFailure(false);
          setMorphResponse(resJson);
          return resJson.data
        })
        .catch(err => console.log(err))
    } catch (error) {
      console.error(error);
    }
  }


  const camera = <Image source={require('./test-images/camera.png')} style={styles.camera} />;
  const check_mark = <Image source={require('./test-images/success-green-check-mark.png')} style={styles.checkMark} />
  const defaultView = 
    <Fragment>
      <View style={styles.uploadArea} >
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          {camera}
          {image1 && check_mark}
        </TouchableOpacity>
      </View>
      <View style={styles.uploadArea} >
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          {camera}
          {image2 && check_mark}
        </TouchableOpacity>
      </View>
    </Fragment>

  function getMorphedImg(morphResponse) {
      setInitialStates()
      WebBrowser.openBrowserAsync(morphResponse.toString())
  } 

  return (
      <LinearGradient
        // Background Linear Gradient
        colors={['#09203f', '#537895']}
        style={styles.background}>
      <Text style={styles.title}>Face Morpher</Text>
      <View style={styles.container}>
        {!morphResponse && defaultView}
        {morphResponse && getMorphedImg(morphResponse)}
        <MorphStateButton 
          isLoading={isLoading}
          isSuccess={isSuccess}
          isFailure={isFailure} 
          morphResponse={morphResponse}
          image1={image1}
          image2={image2}
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
  uploadBtn: {
    flexDirection:'row', 
    backgroundColor: 'white',
    width: 200,
    height: 200,
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
