import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

// Views
import { UploadImagesView }from './src/components/views/UploadImagesView'
import { MorphResponseView } from './src/components/views/MorphResponseView'

// UI library
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'

const theme = {
  ...DefaultTheme,
  roundness: 2,
  mode: 'adaptive',
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

export default function App () {

  const [firstImageRef, setFirstImageRef] = useState(null)
  const [secondImageRef, setSecondImageRef] = useState(null)
  const [xxmorphResponse, setMorphResponse] = useState(null)

  const tempMorphResponse = "https://sammyjaved.com/facemorphs/2023-01-06-07-22-47-506112-f80c2456f0f14b2fa5d95cc590fc5ec6.gif";

  // DELETE!!!!!!!!!
  const morphResponse = tempMorphResponse;

  const getView = () => {
    // View after successful morph
    if (morphResponse) {
      return (
          <MorphResponseView
          firstImageRef={firstImageRef}
          secondImageRef={secondImageRef}
          morphResponse={morphResponse}

          setFirstImageRef={setFirstImageRef}
          setSecondImageRef={setSecondImageRef}
          setMorphResponse={setMorphResponse}
        />
      )
    }
    // Homepage view
    return (
      <UploadImagesView
        firstImageRef={firstImageRef}
        secondImageRef={secondImageRef}
        morphResponse={morphResponse}

        setFirstImageRef={setFirstImageRef}
        setSecondImageRef={setSecondImageRef}
        setMorphResponse={setMorphResponse}
      />
    )
  }

  return (
    <PaperProvider theme={theme}>
      {/* <LinearGradient
        colors={['#000428', '#004e92']}
        style={styles.background}
      > */}
        <View style={styles.view}>
          {getView()}
        </View>
      {/* </LinearGradient> */}
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  view: {
    marginTop: '50px',
  },
})
