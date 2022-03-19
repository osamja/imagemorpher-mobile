import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { MorphImageButton } from './MorphImageButton'
import { MorphSequenceButton } from './MorphSequenceButton'
import { ImageUploadButton } from './ImageUploadButton'

export function MorphResponseView({firstImageRef, setFirstImageRef, secondImageRef, setSecondImageRef, morphImageResponse, setMorphImageResponse}) {
  
    function setInitialMorphState () {
    setFirstImageRef(null)
    setSecondImageRef(null)
    setMorphImageResponse(null)
  }

    return (
      <View style={styles.container}>
        <MorphImageButton
          firstImageRef={firstImageRef}
          secondImageRef={secondImageRef}
          morphImageResponse={morphImageResponse}

          setFirstImageRef={setFirstImageRef}
          setSecondImageRef={setSecondImageRef}
          setMorphImageResponse={setMorphImageResponse}
        />
        <MorphSequenceButton
          firstImageRef={firstImageRef}
          secondImageRef={secondImageRef}
        />
        <TouchableOpacity onPress={() => setInitialMorphState()} style={styles.morphArea}>
              <Image source={require('./../../assets/redo-arrow.png')} style={styles.reset}></Image>
        </TouchableOpacity>
      </View>
    )
}
const styles = StyleSheet.create({
  morphArea: {
    bottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  reset: {
    width: 40,
    height: 40,
    margin: 25
  }
})
