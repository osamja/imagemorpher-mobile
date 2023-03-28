import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { ImageUploadButton } from '../buttons/ImageUploadButton'
import { MorphButton } from '../buttons/MorphButton'

export function UploadImagesView ({morphResponse, setMorphResponse}) {

  const [firstImageRef, setFirstImageRef] = useState(null)
  const [secondImageRef, setSecondImageRef] = useState(null)
  const [uploadedFirstImage, setUploadedFirstImage] = useState(false)

  const isFirstImageSuccessfullyUploaded = (firstImageRef) => {
    if (uploadedFirstImage && firstImageRef
      && (firstImageRef instanceof Error === false)) {
      return true
    } else {
      return false
    }
  };


  const handleFirstImageUpload = (imageRef) => {
    setFirstImageRef(imageRef)
    setUploadedFirstImage(true)
  }

  const handleSecondImageUpload = (imageRef) => {
    setSecondImageRef(imageRef)
  }

  // UploadImagesView is a view that contains two ImageUploadButtons and a MorphButton.
  // We are going to show the user one ImageUploadButton at a time, once they have 
  // successfully uploaded the first image, we will show them the second ImageUploadButton.
  // @TODO: Let user swipe between the ImageUploadButton views
  return (
    <View style={styles.container}>
      {isFirstImageSuccessfullyUploaded(firstImageRef) ?
        // Second image upload view
        <View style={styles.uploadImgArea}>
          <ImageUploadButton
            imageRef={secondImageRef}
            setImageRef={handleSecondImageUpload}
          />
          <View style={styles.divider}></View>
          <View style={styles.morphBtnArea}>
            <View style={styles.morphBtn}>
              <MorphButton
                style={styles.morphBtn}
                firstImageRef={firstImageRef}
                secondImageRef={secondImageRef}
                morphResponse={morphResponse}

                setFirstImageRef={setFirstImageRef}
                setSecondImageRef={setSecondImageRef}
                setMorphResponse={setMorphResponse}
              />
            </View>
          </View>
        </View>
        :
        // First image upload view
        <View style={styles.uploadImgArea}>
          <ImageUploadButton
            imageRef={firstImageRef}
            setImageRef={handleFirstImageUpload}
          />
          <View style={styles.divider}></View>
          <View style={styles.morphBtnArea}>
            <View style={styles.morphBtn}>
              <MorphButton
                style={styles.morphBtn}
                firstImageRef={firstImageRef}
                secondImageRef={secondImageRef}
                morphResponse={morphResponse}

                setFirstImageRef={setFirstImageRef}
                setSecondImageRef={setSecondImageRef}
                setMorphResponse={setMorphResponse}
              />
            </View>
          </View>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  divider: {
    height: 50,
  },
  uploadImgArea: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 500,
    height: 500,
    marginTop: 50,
  },
  morphBtnArea: {
    margin: 50,
  },
  morphBtn: {
    width: 300,
  },
})
