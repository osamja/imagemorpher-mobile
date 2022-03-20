import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { MorphImageButton } from './MorphImageButton'
import { ImageUploadButton } from './ImageUploadButton'

export function UploadImagesView ({firstImageRef, setFirstImageRef, secondImageRef, setSecondImageRef, morphImageResponse, setMorphImageResponse}) {

  return (
    <View>
      <View style={styles.uploadBtns}>
        <ImageUploadButton
          imageRef={firstImageRef}
          setImageRef={setFirstImageRef}
        />
        <ImageUploadButton
          imageRef={secondImageRef}
          setImageRef={setSecondImageRef}
        />
      </View>
      <View>
        <MorphImageButton
          firstImageRef={firstImageRef}
          secondImageRef={secondImageRef}
          morphImageResponse={morphImageResponse}

          setFirstImageRef={setFirstImageRef}
          setSecondImageRef={setSecondImageRef}
          setMorphImageResponse={setMorphImageResponse}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  uploadBtns: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  morphImgBtn: {
    marginTop: 0,
  },
  reset: {
    width: 40,
    height: 40,
    margin: 25
  }
})
