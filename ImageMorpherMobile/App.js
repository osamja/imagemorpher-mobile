// https://docs.expo.io/versions/latest/sdk/imagepicker/

import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { MorphImageButton } from './src/components/MorphImageButton'
import { MorphSequenceButton } from './src/components/MorphSequenceButton'
import { ImageUploadButton } from './src/components/ImageUploadButton'
import { UploadImagesView } from './src/components/UploadImagesView'
import { useFonts } from 'expo-font'

export default function App () {
  const [loaded] = useFonts({
    Roboto: require('./assets/fonts/Roboto_Slab/RobotoSlab-VariableFont_wght.ttf')
  })

  const [firstImageRef, setFirstImageRef] = useState(null)
  const [secondImageRef, setSecondImageRef] = useState(null)
  const [morphImageResponse, setMorphImageResponse] = useState(null)

  function setInitialMorphState () {
    setFirstImageRef(null)
    setSecondImageRef(null)
    setMorphImageResponse(null)
  }

  // If halfway morph image was successful, allow user to generate morph sequence
  if (morphImageResponse) {
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
          <MorphImageButton
            firstImageRef={firstImageRef}
            secondImageRef={secondImageRef}
            morphImageResponse={morphImageResponse}

            setFirstImageRef={setFirstImageRef}
            setSecondImageRef={setSecondImageRef}
            setMorphImageResponse={setMorphImageResponse}
          />
        </View>
        <View style={styles.container}>
          <MorphSequenceButton
            firstImageRef={firstImageRef}
            secondImageRef={secondImageRef}
          />
        </View>
        <View>
          <TouchableOpacity onPress={() => setInitialMorphState()} style={styles.morphArea}>
                <Image source={require('./assets/redo-arrow.png')} style={styles.reset}></Image>
          </TouchableOpacity>
        </View>
    </LinearGradient>
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
