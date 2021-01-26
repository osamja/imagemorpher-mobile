// https://docs.expo.io/versions/latest/sdk/imagepicker/

import React, { useState, useEffect, Fragment } from 'react';
import {  Text, Image, View, Platform, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

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

  function MorphStateButton2({
    isLoading,
    isSuccess,
    isFailure,
    morphResponse,
    image1,
    image2,
  }) {
    if (isLoading) {
      return (
        <Fragment>
          <Text style={styles.mainText}>
            MORPHING IMAGES
            <ActivityIndicator size="small"/>
          </Text>
        </Fragment>
      )
    }

    if (isSuccess && morphResponse) {
      return (
        <Text onPress={() => Linking.openURL(morphResponse.toString())}>GET MORPHED IMAGE</Text>
      )
    }

    if (isFailure) {
      return <Text>MORPH FAILED</Text>
    }

    return (
      <Fragment>
        <Text style={styles.mainText}>
          {!morphResponse && <Text onPress={() => getMorph(image1, image2)}>MORPH</Text>}
        </Text>   
      </Fragment>
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
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          {!image1 && <Image source={require('./test-images/camera.svg')} style={styles.camera} />}
          {image1 && <Image source={{ uri: image1 }} style={styles.img} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          {!image2 && <Image source={require('./test-images/camera.svg')} style={styles.camera} />}
          {image2 && <Image source={{ uri: image2 }} style={styles.img} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.morphBtn}>
          <MorphStateButton2 
            isLoading={isLoading}
            isSuccess={isSuccess}
            isFailure={isFailure} 
            morphResponse={morphResponse}
            image1={image1}
            image2={image2}
          />
        </TouchableOpacity>
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
  button:  {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderBottomColor: 'white',
    borderBottomWidth: 5,
  },
  mainText: {
    fontSize: 20,
    marginBottom: 20,
  },  
  img: {
    width: 200,
    height: 200,
  },
  camera: {
    width: 200,
    height: 150,
  },
  morphBtn: {
    bottom: 0,
    justifyContent: 'center',
    textAlign: 'center',
  },
});