import React from 'react'
import { View, StyleSheet } from 'react-native'

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
      <View style={styles.morphBtn}>
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
  },
  morphBtn: {
    marginTop: 100,
  },
  reset: {
    width: 40,
    height: 40,
    margin: 25,
    justifyContent: 'center',
  }
})
