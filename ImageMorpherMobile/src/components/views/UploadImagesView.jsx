import React from 'react'
import { View, StyleSheet } from 'react-native'

import { ImageUploadButton } from '../buttons/ImageUploadButton'
import { Switch } from 'react-native-paper'
import { MorphButton } from '../buttons/MorphButton'

export function UploadImagesView ({firstImageRef, setFirstImageRef, secondImageRef, setSecondImageRef, morphResponse, setMorphResponse, isGif, setIsGif}) {

  return (
    <View style={styles.container}>
      <View style={styles.uploadImgBtns}>
        <View style={styles.firstUploadImgBtn}>
          <ImageUploadButton
            imageRef={firstImageRef}
            setImageRef={setFirstImageRef}
          />
        </View>
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
        <Switch
          style={styles.switch}
          value={isGif}
          onValueChange={() => setIsGif(!isGif)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  firstUploadImgBtn: {
    marginRight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadImgBtns: {
    flexDirection: 'row',
  },
  morphBtnArea: {
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  morphBtn: {
    width: 200,
  },
  switch: {
    marginLeft: 20,
  },
})
