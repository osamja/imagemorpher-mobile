// https://docs.expo.io/versions/latest/sdk/imagepicker/

import React, { useState, useEffect, Fragment } from 'react';
import {  Text, Image, View, Platform, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';

export default function FaceMorpher({

}) {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [morphResponse, setMorphResponse] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      // Quality of compression. (0 - 1.0).
      quality: 1,
      base64: false,
    });

    if (!result.cancelled) {
        if (image1 == null) {
          setImage1(result.uri)
        }
        else {
          setImage2(result.uri)
        }
      }
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
        <TouchableOpacity style={styles.morphBtn}>
          <Text style={styles.morphBtnTxt}>
            MORPHING IMAGES
            <ActivityIndicator size="small"/>
          </Text>
        </TouchableOpacity>
      )
    }

    if (isSuccess && morphResponse) {
      return (
        <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(morphResponse.toString()) } style={styles.morphBtn}>
        <Text style={styles.morphBtnTxt}>GET MORPHED IMAGE</Text>
        </TouchableOpacity>
      )
    }

    if (isFailure) {
      return <Text>MORPH FAILED</Text>
    }

    return (
      <TouchableOpacity onPress={() => getMorph(image1, image2)} style={styles.morphBtn}>
          {!morphResponse && <Text style={styles.morphBtnTxt}>MORPH</Text>}
      </TouchableOpacity>
    )
  }

  async function getMorph(image1, image2) {
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
            return 'MORPH FAILED'
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
      // const text = await response.text();
      // await response.text() && 
      
      //text && Linking.openURL(text);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={{flex: 1}}>
      <Text style={styles.title}>Face Morpher</Text>
      <View style={styles.container}>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          {!image1 && <Image source={require('./test-images/camera.svg')} style={styles.camera} />}
          {image1 && <Image source={{ uri: image1 }} style={styles.img} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          {!image2 && <Image source={require('./test-images/camera.svg')} style={styles.camera} />}
          {image2 && <Image source={{ uri: image2 }} style={styles.img} />}
        </TouchableOpacity>
        <MorphStateButton 
          isLoading={isLoading}
          isSuccess={isSuccess}
          isFailure={isFailure} 
          morphResponse={morphResponse}
          image1={image1}
          image2={image2}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 30,
    fontSize: 30,
    textAlign: 'center',
  },
  container: {
    marginTop: 50,
    flexDirection: 'column',
    flex: 1,
  },
  uploadBtn:  {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderColor: 'black',
    borderWidth: 1,
  },
  morphBtnTxt: {
    fontSize: 30,
    marginBottom: 20,
  },  
  img: {
    width: 200,
    height: 200,
  },
  camera: {
    width: 150,
    height: 100,
  },
  morphBtn: {
    bottom: 0,
    justifyContent: 'center',
    textAlign: 'center',
    flex: 1,
  },
});