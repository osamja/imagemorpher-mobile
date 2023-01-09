import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'

// Views
import { UploadImagesView }from './src/components/views/UploadImagesView'
import { MorphResponseView } from './src/components/views/MorphResponseView'
import LoginScreen from './src/components/views/Login'


// UI library
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


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
  const [morphResponse, setMorphResponse] = useState(null)

  

  const Stack = createNativeStackNavigator();

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
        <View style={styles.view}>
          {getView()}
        </View>
    </PaperProvider>
  )

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Upload">
        {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        <Stack.Screen name="Upload" component={UploadImagesView}>
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

  return (
    <PaperProvider theme={theme}>
        <View style={styles.view}>
          {getView()}
        </View>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  view: {
    marginTop: '15%',
  },
})
