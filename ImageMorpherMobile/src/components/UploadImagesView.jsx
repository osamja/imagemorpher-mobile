import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { MorphImageButton } from './MorphImageButton'
import { ImageUploadButton } from './ImageUploadButton'

export function UploadImagesView ({firstImageRef, setFirstImageRef, secondImageRef, setSecondImageRef, morphImageResponse, setMorphImageResponse}) {

  return (
      <LinearGradient
        // Background Linear Gradient
        colors={['#c2e9fb', '#a1c4fd']}
        style={styles.background}
        start={[0, 0]}
        end={[1, 1]}
      >
        <Text style={styles.title}>Face Morpher</Text>
        <View style={styles.container}>
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
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1
  },
  morphArea: {
    bottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  title: {
    marginTop: 30,
    fontSize: 40,
    textAlign: 'center',
    color: '#2b2b2b',
    fontWeight: 'bold',
    fontFamily: 'Roboto'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  reset: {
    width: 40,
    height: 40,
    margin: 25
  }
})
