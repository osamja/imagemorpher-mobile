import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'

// views
import { UploadImagesView }from './src/components/UploadImagesView'
import { MorphResponseView } from './src/components/MorphResponseView'

import { LinearGradient } from 'expo-linear-gradient'
import { MorphImageButton } from './src/components/MorphImageButton'
import { MorphSequenceButton } from './src/components/MorphSequenceButton'
import { ImageUploadButton } from './src/components/ImageUploadButton'
import { useFonts } from 'expo-font'

export default function App () {
  const [loaded] = useFonts({
    Roboto: require('./assets/fonts/Roboto_Slab/RobotoSlab-VariableFont_wght.ttf')
  })

  const [firstImageRef, setFirstImageRef] = useState(null)
  const [secondImageRef, setSecondImageRef] = useState(null)
  const [morphImageResponse, setMorphImageResponse] = useState(null)

  const getView = () => {
    if (morphImageResponse) {
      return (
        <MorphResponseView
          firstImageRef={firstImageRef}
          secondImageRef={secondImageRef}
          morphImageResponse={morphImageResponse}
    
          setFirstImageRef={setFirstImageRef}
          setSecondImageRef={setSecondImageRef}
          setMorphImageResponse={setMorphImageResponse}
      />
      )
    }
    return (
      <UploadImagesView
        firstImageRef={firstImageRef}
        secondImageRef={secondImageRef}
        morphImageResponse={morphImageResponse}
  
        setFirstImageRef={setFirstImageRef}
        setSecondImageRef={setSecondImageRef}
        setMorphImageResponse={setMorphImageResponse}
      />
    )
  }

  return (
    <LinearGradient
      colors={['#c2e9fb', '#a1c4fd']}
      style={styles.background}
      start={[0, 0]}
      end={[1, 1]}
    >
      <Text style={styles.title}>Face Morpher</Text>
      {getView()}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  background: {
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
  reset: {
    width: 40,
    height: 40,
    margin: 25
  }
})
