import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { MorphImageButton } from './MorphImageButton'
import { ImageUploadButton } from './ImageUploadButton'

export function UploadImagesView ({firstImageRef, setFirstImageRef, secondImageRef, setSecondImageRef, morphImageResponse, setMorphImageResponse}) {

  return (
    <View styles={styles.container}>
      <ImageUploadButton
        imageRef={firstImageRef}
        setImageRef={setFirstImageRef}
      />
      <ImageUploadButton
        imageRef={secondImageRef}
        setImageRef={setSecondImageRef}
      />
      <MorphImageButton
        firstImageRef={firstImageRef}
        secondImageRef={secondImageRef}
        morphImageResponse={morphImageResponse}

        setFirstImageRef={setFirstImageRef}
        setSecondImageRef={setSecondImageRef}
        setMorphImageResponse={setMorphImageResponse}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  morphArea: {
    bottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  reset: {
    width: 40,
    height: 40,
    margin: 25
  }
})
