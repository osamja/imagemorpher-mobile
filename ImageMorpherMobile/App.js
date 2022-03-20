import React, { useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'

// UI library - React Native Paper
import { Provider as PaperProvider } from 'react-native-paper'

import { Title } from './src/components/Title'
import { UploadImagesView }from './src/components/UploadImagesView'
import { MorphResponseView } from './src/components/MorphResponseView'
import { InfoMessage } from './src/components/InfoMessage'

import { LinearGradient } from 'expo-linear-gradient'

export default function App () {

  const [firstImageRef, setFirstImageRef] = useState(null)
  const [secondImageRef, setSecondImageRef] = useState(null)
  const [morphImageResponse, setMorphImageResponse] = useState(null)
  const [info, setInfo] = useState('Please upload two images to morph');

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
        <Title />
        <View style={styles.view}>
          {getView()}
          <InfoMessage 
            firstImageRef={firstImageRef}
            secondImageRef={secondImageRef}
          />
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
  view: {
    marginTop: '20vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
