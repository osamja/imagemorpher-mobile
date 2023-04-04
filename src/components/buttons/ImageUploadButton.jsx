import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Button, Text, IconButton } from 'react-native-paper'
import { morph_upload_endpoint } from '../../constants/index'
import styled from 'styled-components/native'
import * as FaceDetector from 'expo-face-detector';

const styles = StyleSheet.create({
  btnSize: {
    fontSize: 250,  // increase the font size to make the button bigger
  },
  loadingIcon: {
    marginTop: 20,
  },
  errorMessageContainer: {
    backgroundColor: '#f8d7da', // You can choose a suitable background color for the error box
    borderColor: '#f5c6cb', // You can choose a suitable border color for the error box
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginTop: 50, // Add margin around the error container
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorMessage: {
    color: '#721c24', // You can choose a suitable text color for the error message
    fontSize: 14,
  },
  messageContainer: {
    flexDirection: 'column',
  },
});

export function ImageUploadButton ({
  imageRef,
  setImageRef,
  handleSuccessfulImageUpload,
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFailure, setIsFailure] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleAlertIconPress = () => {
    setShowErrorMessage(!showErrorMessage);
  };

  const handleSuccess = () => {
    setIsSuccess(true)
  }

  const isEligibleForUpload = async (imageRef) => {
    const faces = await detectFacialFeatures(imageRef)

    if (faces.length > 0) {
      console.log('Faces detected')
      return true;
    }

    console.log('No faces detected')
    return false;
  }

  const handleFailure = (error) => {
    setIsFailure(true)
    // See if error json is available
    try {
      error.json().then((errorJson) => {
        console.log('Error json: ')
        console.log(errorJson)
        const errorObject = new Error(errorJson)
        setImageRef(errorObject)
      })
    } catch (e) {
      console.log('Error json not available')
      const errorObject = new Error(error.message)
      setImageRef(errorObject)
    }
  }

  const detectFacialFeatures = async (imageUri) => {
    const options = {
      mode: FaceDetector.FaceDetectorMode.accurate,
      detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
      runClassifications: FaceDetector.FaceDetectorClassifications.none,
    };
    console.log('imageUri: ' + imageUri)
    const { faces } = await FaceDetector.detectFacesAsync(imageUri, options);
    console.log(faces);
    return faces;
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
        base64: true,
      });

      const asset = result.assets && result.assets[0];

      if (!asset) {
        throw new Error('No image selected');
      }

      const faces = await detectFacialFeatures(asset.uri)

      if (!faces.length) {
        console.log('No Faces detected')
        throw new Error('No Faces detected')
      }

      const firstFace = faces[0]
      console.log(firstFace)

      if (asset.base64) {
        await uploadImage(asset.base64, firstFace);
      } else if (asset.uri) {
        await uploadImage(asset.uri, firstFace);
      }

    } catch (e) {
      console.log('Error while picking image: ')
      console.log(e);
      const errorObject = new Error(e.message)
      setImageRef(errorObject)
      handleFailure(errorObject)
    }
  }

  const uploadImage = async (img, landmarks) => {
    const data = new FormData()
    data.append('firstImageRef', img)
    data.append('landmarks', JSON.stringify(landmarks))

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
        console.log('Image upload was successful')
        // On success, hide the loading spinner
        setIsLoading(false)
        setImageRef(resJson)
        handleSuccess()
        handleSuccessfulImageUpload()
        return resJson.data
      })
      .catch((error) => {
        console.log('Image upload failed')
        console.log(JSON.stringify(error))
        setIsLoading(false)
        handleFailure(error)
      })
  }

  if (isLoading) {
    return (
      <Button
        icon="face-recognition"
        disabled
        loading
      >
        Loading..
      </Button>
    )
  }

  if (isSuccess && imageRef && !(imageRef instanceof Error)) {
    return (
      <Button 
        icon="face-recognition"
        labelStyle={styles.btnSize}
        // Use a green color to indicate success that contrasts well with the background color
        color="#00b894"
      >
      </Button>
    )
  }
  if (isFailure) {
    return (
      <View>
        <Button icon="face-recognition" labelStyle={styles.btnSize} color="red" onPress={pickImage} ></Button>
        {(
          <View style={styles.errorMessageContainer}>
            <IconButton icon="alert-circle" color="#721c24" size={20} onPress={handleAlertIconPress} />
            <View style={styles.messageContainer}>
              <Text style={styles.errorMessage}>Error: Image is not compatible</Text>
              <Text style={styles.errorMessage}>Please ensure a face is visible</Text>
              {showErrorMessage && imageRef && <Text style={styles.errorMessage}>{imageRef.message}</Text>}
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <Button
      icon="face-recognition"
      style={styles.btnContainer}
      labelStyle={styles.btnSize}
      color="#e5a823"
      onPress={pickImage}
    />
  )
}
  


