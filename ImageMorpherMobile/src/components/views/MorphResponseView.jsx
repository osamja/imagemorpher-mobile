import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import * as WebBrowser from 'expo-web-browser'
import * as Analytics from 'expo-firebase-analytics'

export function MorphResponseView({
  setFirstImageRef,
  setSecondImageRef,
  setMorphResponse,
  firstImageRef,
  secondImageRef,
  morphResponse,
}) {
  
  function setInitialMorphState () {
    setFirstImageRef(null)
    setSecondImageRef(null)
    setMorphResponse(null)
  }

  function getMorphResponse() {
    Analytics.logEvent('ButtonTapped', {
        name: ('GetMorphSequence'),
        screen: 'main',
        purpose: 'Begin the morph'
      })
      WebBrowser.openBrowserAsync(morphResponse.toString())
  }

  return (
    <View style={styles.morphBtnArea}>
      <View style={styles.button}>
        <Button mode="outlined" color="#e5a823" onPress={() => getMorphResponse()}>
          View Morph
        </Button>
      </View>
      <View style={styles.button}>
        <Button mode="outlined" color='white' onPress={() => setInitialMorphState()}>
          Restart
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({ 
  morphBtnArea: {
    alignItems: 'center',
  },  
  button: {
    marginTop: 40,
    marginBottom: 40,
    width: 200,
  }
})
