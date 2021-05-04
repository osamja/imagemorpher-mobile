import React, { useState} from 'react';
import {  View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Analytics from 'expo-firebase-analytics';

import { morph_upload_endpoint } from '../constants/index';

export function ImageUploadButton({
  imageRef,
  setImageRef
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);

  const pickImage = async () => {
    await Analytics.logEvent('ButtonTapped', {
      name: 'PickImage',
      screen: 'main',
      purpose: 'Image upload button',
    });

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      // Quality of compression: [0, 1]
      quality: 0.1,
      base64: true,
    });

    if (!result.cancelled) {
      if (imageRef === null || (imageRef instanceof Error)) {
        // image picker on iphone works different than web browser
        if (result.base64) {
          uploadImage(result.base64)
        } else {
          uploadImage(result.uri)
        }
      }
    }
  }

  const uploadImage = async(img) => {
    let data = new FormData();
    data.append('firstImageRef', img);

    setIsLoading(true);
    setIsSuccess(false);
    setIsFailure(false);

    fetch(
        morph_upload_endpoint, {
          method: 'POST',
          headers: {
              'Authorization': 'ImageMorpherV1'
          },
          body: data,
        }
      )
      .then(res => {
        if (!res.ok) {
          throw res;
        }

        return res.json()
      })
      .then(resJson => {
        // On success, hide the loading spinner
        setIsLoading(false);
        setIsSuccess(true);
        setIsFailure(false);
        setImageRef(resJson);
        return resJson.data
      })
      .catch((errorResponse) => {
        errorResponse.json().then(errorMessage => {
          console.log(errorMessage)
          setIsLoading(false);
          setIsSuccess(false);
          setIsFailure(true);
          const errorObject = new Error(errorMessage);
          setImageRef(errorObject);
        })
      });
  }
  
  const uploadBtn = <Image source={require('../../assets/avatar.png')} style={styles.uploadBtn} />;
  const uploadFailureButton = <Image source={require('../../assets/error-avatar.png')} style={styles.uploadBtn} />;
  const isUploadedBtn = <Image source={require('../../assets/avatar-green.png')} style={styles.uploadBtn} />;
  const redoButton = <Image source={require('../../assets/redo-arrow.png')} style={styles.largeReset}></Image>;

  if (isLoading) {
    return (
      <View style={styles.uploadArea} >
        <TouchableOpacity>
          <View style={styles.uploadImgArea}>
            <ActivityIndicator size="small"/>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  if (isSuccess && imageRef) {
    return (
      <View style={styles.uploadArea} >
        <TouchableOpacity>
          <View style={styles.uploadImgArea}>
            {isUploadedBtn}
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  if (isFailure) {
    return (
      <View style={styles.uploadArea} >
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.failedUploadImgArea}>
            <Text>{imageRef && imageRef.message}</Text>
            {imageRef && redoButton}
            {/* {uploadFailureButton} */}
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.uploadArea} >
      <TouchableOpacity onPress={pickImage}>
          <View style={styles.uploadImgArea}>
            {!imageRef && uploadBtn}
            {imageRef && isUploadedBtn}
          </View>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  uploadArea:  {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 10
  },
  uploadImgArea: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 125,
    height: 125,
    backgroundColor: '#fbfbfb',
    borderRadius: 20,
  },
  uploadBtn: {
    width: '90%',
    height: '100%',
    resizeMode: 'contain',
  },
  failMessage: {
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  failedUploadImgArea: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 125,
    height: 125,
    backgroundColor: 'red',
    borderRadius: 20,
    color: 'white',
  },
  checkMark: {
    width: 30,
    height: 30,
    marginLeft: 20,
  },  
  largeReset: {
    width: 40,
    height: 40,
  },
});
