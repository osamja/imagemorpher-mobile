import React from 'react'
import { 
  View,
  StyleSheet,
  Image,
} from 'react-native'
import { Button } from 'react-native-paper'
import * as WebBrowser from 'expo-web-browser'
import * as Analytics from 'expo-firebase-analytics'
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

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

    Analytics.logEvent('ButtonTapped',
      {
        name: ('Restart'),
        screen: 'main',
        purpose: 'Restart Morph'
      }
    );
  }

  function saveMorphResponse() {
    Analytics.logEvent('ButtonTapped',
      {
        name: ('SaveMorph'),
        screen: 'main',
        purpose: 'Save Morph'
      }
    );

    // Save the morph response to the device

    console.log(CameraRoll);
    CameraRoll.saveToCameraRoll("https://sammyjaved.com/facemorphs/2023-01-06-07-22-47-506112-f80c2456f0f14b2fa5d95cc590fc5ec6.gif")

    // CameraRoll.save("https://sammyjaved.com/facemorphs/2023-01-06-07-22-47-506112-f80c2456f0f14b2fa5d95cc590fc5ec6.gif")
    //   .then((uri) => {
    //     console.log("Image saved to", uri);
    //   })
    //   .catch((error) => {
    //     console.log("err", error);
    //   });

    // WebBrowser.openBrowserAsync(morphResponse.toString())
  }
  

  return (
    <View style={styles.morphBtnArea}>
      {/* 
        Oh wow linking dynamic sources does not seem supported without some hacks..
        https://stackoverflow.com/questions/33907218/react-native-use-variable-for-image-file 
      */}
      <Image
        style= {{width: 200, height: 200}}
        source={{
          uri: "https://sammyjaved.com/facemorphs/2023-01-06-07-22-47-506112-f80c2456f0f14b2fa5d95cc590fc5ec6.gif",
        }}
      />
      <View style={styles.button}>
        <Button mode="outlined" onPress={() => saveMorphResponse()}>
          Save
        </Button>
      </View>
      <View style={styles.button}>
        <Button mode="outlined" onPress={() => setInitialMorphState()}>
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
    marginTop: 20,
    width: 200,
  }
})
