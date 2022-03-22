import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Button } from 'react-native-paper'
import { MorphButton } from '../buttons/MorphButton'

export function MorphResponseView({firstImageRef, setFirstImageRef, secondImageRef, setSecondImageRef, morphResponse, setMorphResponse, isGif}) {
  
  function setInitialMorphState () {
    setFirstImageRef(null)
    setSecondImageRef(null)
    setMorphResponse(null)
  }

  return (
    <View style={styles.morphBtnArea}>
      <View style={styles.button}>
        <MorphButton
          isGif={isGif}
          
          firstImageRef={firstImageRef}
          secondImageRef={secondImageRef}
          morphResponse={morphResponse}
    
          setFirstImageRef={setFirstImageRef}
          setSecondImageRef={setSecondImageRef}
          setMorphResponse={setMorphResponse} 
        />
      </View>
      <View style={styles.button}>
        <Button mode="contained" onPress={() => setInitialMorphState()}>
          Restart
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({ 
  button: {
    marginTop: 50,
    marginBottom: 50,
    width: 200,
  }
})
