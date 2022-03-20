import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { MorphImageButton } from './MorphImageButton'
import { MorphSequenceButton } from './MorphSequenceButton'

export function MorphResponseView({firstImageRef, setFirstImageRef, secondImageRef, setSecondImageRef, morphImageResponse, setMorphImageResponse}) {
  
  function setInitialMorphState () {
    setFirstImageRef(null)
    setSecondImageRef(null)
    setMorphImageResponse(null)
  }

    return (
      <View>
        <View style={styles.viewMorphBtn}>
          <MorphImageButton
            firstImageRef={firstImageRef}
            secondImageRef={secondImageRef}
            morphImageResponse={morphImageResponse}

            setFirstImageRef={setFirstImageRef}
            setSecondImageRef={setSecondImageRef}
            setMorphImageResponse={setMorphImageResponse}
          />
        </View>
        <View style={styles.viewGifBtn}>
        <MorphSequenceButton
          firstImageRef={firstImageRef}
          secondImageRef={secondImageRef}
        />
        </View>
        <TouchableOpacity onPress={() => setInitialMorphState()}>
          <Image source={require('./../../assets/redo-arrow.png')} style={styles.reset}></Image>
        </TouchableOpacity>
      </View>
    )
}

const styles = StyleSheet.create({ 
  viewMorphBtn: {
    marginTop: 50,
  },
  viewGifBtn: {
    marginTop: 50,
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
