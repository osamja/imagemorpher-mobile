import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ImageUploadButton } from '../buttons/ImageUploadButton'
import { MorphButton } from '../buttons/MorphButton'

export function UploadImagesView ({firstImageRef, setFirstImageRef, secondImageRef, setSecondImageRef, morphResponse, setMorphResponse, isGif}) {

  return (
    <View style={styles.container}>
      <View style={styles.uploadImgArea}>
        <ImageUploadButton
          imageRef={firstImageRef}
          setImageRef={setFirstImageRef}
        />
        <View style={styles.divider}></View>
        <ImageUploadButton
          imageRef={secondImageRef}
          setImageRef={setSecondImageRef}
        />
      </View>
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

            isGif={isGif}
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
  divider: {
    width: 60,
  },
  uploadImgArea: {
    flexDirection: 'row',
  },
  morphBtnArea: {
    marginTop: 100,
  },
  morphBtn: {
    width: 300,
  },
})
