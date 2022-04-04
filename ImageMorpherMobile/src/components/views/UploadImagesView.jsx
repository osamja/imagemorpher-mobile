import React from 'react'
import { View, StyleSheet } from 'react-native'

import { ImageUploadButton } from '../buttons/ImageUploadButton'
import { MorphButton } from '../buttons/MorphButton'

export function UploadImagesView ({firstImageRef, setFirstImageRef, secondImageRef, setSecondImageRef, morphResponse, setMorphResponse, isGif, setIsGif}) {

  return (
    <View style={styles.container}>
      <View style={styles.uploadImgBtns}>
        <ImageUploadButton
          imageRef={firstImageRef}
          setImageRef={setFirstImageRef}
        />
        <ImageUploadButton
          imageRef={secondImageRef}
          setImageRef={setSecondImageRef}
        />
      </View>
      <View style={styles.morphBtnArea}>
        <View style={styles.morphBtn}>
          <MorphButton
            isGif={isGif}
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
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  uploadImgBtns: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  morphBtnArea: {
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  morphBtn: {
    width: 300,
  },
})
