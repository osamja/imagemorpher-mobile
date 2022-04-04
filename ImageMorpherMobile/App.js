import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

// views
import { UploadImagesView }from './src/components/views/UploadImagesView'
import { MorphResponseView } from './src/components/views/MorphResponseView'

// UI library - React Native Paper
import { Provider as PaperProvider } from 'react-native-paper'
import { Button } from 'react-native-paper'

export default function App () {

  const [firstImageRef, setFirstImageRef] = useState(null)
  const [secondImageRef, setSecondImageRef] = useState(null)
  const [morphResponse, setMorphResponse] = useState(null)
  const [isGif, setIsGif] = useState(true)

  const getView = () => {
      // If halfway morph image was successful, allow user to view image.
    if (morphResponse) {
      return (
        <MorphResponseView
        firstImageRef={firstImageRef}
        secondImageRef={secondImageRef}
        morphResponse={morphResponse}

        setFirstImageRef={setFirstImageRef}
        setSecondImageRef={setSecondImageRef}
        setMorphResponse={setMorphResponse}

        isGif={isGif}
        setIsGif={setIsGif}
        />
      )
    }
    // Homepage
    return (
      <UploadImagesView
      firstImageRef={firstImageRef}
      secondImageRef={secondImageRef}
      morphResponse={morphResponse}

      setFirstImageRef={setFirstImageRef}
      setSecondImageRef={setSecondImageRef}
      setMorphResponse={setMorphResponse}

      isGif={isGif}
      setIsGif={setIsGif}
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
        <View style={styles.tabs}>
          <Button 
            mode={isGif ?  'contained' : 'outlined'}
            style={styles.tab}
            color={isGif ? '#FF4500' : 'white'}
            onPress={() => setIsGif(true)}
          >
            GIF
          </Button>
          <Button 
            mode={isGif ? 'outlined' : 'contained'}
            style={styles.tab}
            color={isGif ? 'white' : '#FF4500'}
            onPress={() => setIsGif(false)}
          >
            Image
          </Button>
        </View>
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
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    width: '50vw',
    height: 70,
    justifyContent: 'center',
  },
  view: {
    marginTop: '25vh',
  },
})
