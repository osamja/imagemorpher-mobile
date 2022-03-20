import React, { useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Analytics from 'expo-firebase-analytics'
import { Button } from 'react-native-paper';

import { morph_upload_endpoint } from '../constants/index'

export function ImageUploadButton ({
  imageRef,
  setImageRef
}) {
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFailure, setIsFailure] = useState(false)

  const pickImage = async () => {
    await Analytics.logEvent('ButtonTapped', {
      name: 'PickImage',
      screen: 'main',
      purpose: 'Image upload button'
    })

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      // Quality of compression: [0, 1]
      quality: 0.1,
      base64: true
    })

    if (!result.cancelled) {
      if (imageRef === null || (imageRef instanceof Error)) {
        // image picker on iphone works different than web browser
        if (result.base64) {
          uploadImage(result.base64)
        } 
        else {
          uploadImage(result.uri)
        }
      }
    }
  }

  const uploadImage = async (img) => {
    const data = new FormData()
    data.append('firstImageRef', img)

    setIsLoading(true)
    setIsSuccess(false)
    setIsFailure(false)

    fetch(
      morph_upload_endpoint, {
        method: 'POST',
        headers: {
          Authorization: 'ImageMorpherV1'
        },
        body: data
      }
    )
      .then(res => {
        if (!res.ok) {
          throw res
        }

        return res.json()
      })
      .then(resJson => {
        Analytics.logEvent('ButtonTapped', {
          name: 'UploadSuccess',
          screen: 'main',
          purpose: 'Image upload was successful'
        })
        // On success, hide the loading spinner
        setIsLoading(false)
        setIsSuccess(true)
        setIsFailure(false)
        setImageRef(resJson)
        return resJson.data
      })
      .catch((errorResponse) => {
        errorResponse.json().then(errorMessage => {
          Analytics.logEvent('ButtonTapped', {
            name: 'UploadFailure',
            screen: 'main',
            purpose: 'Image upload failed'
          })
          console.log(errorMessage)
          setIsLoading(false)
          setIsSuccess(false)
          setIsFailure(true)
          const errorObject = new Error(errorMessage)
          setImageRef(errorObject)
        })
      })
  }

  const uploadImgBtn = <Button icon="face-recognition" labelStyle={styles.btnArea} onPress={pickImage}></Button>
  const uploadSuccessBtn = <Button icon="face-recognition" labelStyle={styles.btnArea} color="green" onPress={pickImage}></Button>
  const redoButton = <Image source={require('../../assets/redo-arrow.png')} style={styles.largeReset}></Image>

  const getState = () => {
    if (isLoading) {
      return <ActivityIndicator size="large"/>
    }
    if (isSuccess && imageRef) {
      return uploadSuccessBtn;
    }
    if (isFailure && imageRef) {
      {imageRef && imageRef.message && redoButton}
    }
    return uploadImgBtn;
  }

  return (
    <View style={styles.container}>
      {getState()}
    </View>
  )
}

const styles = StyleSheet.create({
  btnArea: {
    fontSize: 70,
  }
})
