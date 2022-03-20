import React, { useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'

// UI library - React Native Paper
import { Provider as PaperProvider } from 'react-native-paper'

import { UploadImagesView }from './src/components/UploadImagesView'
import { MorphResponseView } from './src/components/MorphResponseView'

import { LinearGradient } from 'expo-linear-gradient'
import { useFonts } from 'expo-font'

export default function App () {

  const [loaded] = useFonts({
    Roboto: require('./assets/fonts/Roboto_Slab/RobotoSlab-VariableFont_wght.ttf')
  })

  const [firstImageRef, setFirstImageRef] = useState(null)
  const [secondImageRef, setSecondImageRef] = useState(null)
  const [morphImageResponse, setMorphImageResponse] = useState(null)

  function setInitialMorphState() {
      setFirstImageRef(null)
      setSecondImageRef(null)
      setMorphImageResponse(null)
  }

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
    <PaperProvider>
      <LinearGradient
        colors={['#000428', '#004e92']}
        style={styles.background}
        start={[0, 0]}
        end={[1, 1]}
      >
        <Text style={styles.title}>Face Morpher</Text>
        <View style={styles.view}>
          {getView()}
        </View>
      </LinearGradient>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    marginTop: 70,
    fontSize: 35 ,
    color: 'whitesmoke',
    fontFamily: 'Roboto'
  },
  view: {
    marginTop: '20vh',
    flexDirection: 'column',
    justifyContent: 'center',
  },
})
