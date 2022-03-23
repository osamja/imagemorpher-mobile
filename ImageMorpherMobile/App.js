import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'

// UI library - React Native Paper
import { Provider as PaperProvider } from 'react-native-paper'
import { Title } from './src/components/Title'
import { UploadImagesView }from './src/components/views/UploadImagesView'
import { MorphResponseView } from './src/components/views/MorphResponseView'
import { LinearGradient } from 'expo-linear-gradient'
import { Button } from 'react-native-paper'

export default function App () {

  const [firstImageRef, setFirstImageRef] = useState(null)
  const [secondImageRef, setSecondImageRef] = useState(null)
  const [morphResponse, setMorphResponse] = useState(null)
  const [isGif, setIsGif] = useState(false)

  const getView = () => {
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
            mode='outlined'
            style={styles.tab}
            color={'white'}
            onPress={() => setIsGif(true)}
          >
            GIF
          </Button>
          <Button 
            mode="outlined"
            style={styles.tab}
            color={'white'}
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
    height: 60,
    color: 'white',
    justifyContent: 'center',
  },
  view: {
    marginTop: '20vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
