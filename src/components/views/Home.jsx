import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

// Views
import { UploadImagesView }from './UploadImagesView'
import { MorphResponseView } from './MorphResponseView'
import SettingsScreen from './Settings'


// UI library
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'

const Tab = createMaterialBottomTabNavigator();

export default function HomeScreen () {

  console.log('the image references have been reset')

  const [firstImageRef, setFirstImageRef] = useState(null)
  const [secondImageRef, setSecondImageRef] = useState(null)
  const [morphResponse, setMorphResponse] = useState(null)

  
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

  const styles = StyleSheet.create({
    // view: {
    //   marginTop: '15%',
    // },
  })

  if (morphResponse) {
    return (
      <View>
        <MorphResponseView
          firstImageRef={firstImageRef}
          secondImageRef={secondImageRef}
          morphResponse={morphResponse}

          setFirstImageRef={setFirstImageRef}
          setSecondImageRef={setSecondImageRef}
          setMorphResponse={setMorphResponse}
        />
        <Tab.Navigator>
          <Tab.Screen name="Morph" component={MorphResponseView} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </View>
    )
  } else {
      return (
        <PaperProvider theme={theme}>
            <View>
              <UploadImagesView
                firstImageRef={firstImageRef}
                secondImageRef={secondImageRef}
                morphResponse={morphResponse}

                setFirstImageRef={setFirstImageRef}
                setSecondImageRef={setSecondImageRef}
                setMorphResponse={setMorphResponse}
              />
            </View>
        </PaperProvider>
      )
  }
}
