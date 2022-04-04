import React, { useState } from 'react'
import { StyleSheet, ActivityIndicator } from 'react-native'
import { Button } from 'react-native-paper'
import * as WebBrowser from 'expo-web-browser'
import * as Analytics from 'expo-firebase-analytics'
import { View } from 'react-native-web'
import { Text } from 'react-native-paper'

import { morph_endpoint } from '../../constants/index'

export function MorphButton({
  isGif,
  firstImageRef,
  secondImageRef,
  morphResponse,
  setMorphResponse
}) {
    
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFailure, setIsFailure] = useState(false)


  function getMorphResponse() {
    Analytics.logEvent('ButtonTapped', {
        name: (isGif ? 'GetMorphSequence' : 'GetMorph'),
        screen: 'main',
        purpose: 'Begin the morph'
      })
      WebBrowser.openBrowserAsync(morphResponse.toString())
  }

  async function getMorph (firstImageRef, secondImageRef) {
    if (!firstImageRef || !secondImageRef) {
      return
    }
   
    try {
      await Analytics.logEvent('ButtonTapped', {
        name: (isGif ? 'StartMorphSequence' : 'StartMorph'),
        screen: 'main',
        purpose: (isGif ? 'Start the morph sequence' : 'Start the morph'),
      })

      const data = new FormData()
      data.append('firstImageRef', firstImageRef)
      data.append('secondImageRef', secondImageRef)
      data.append('isSequence', (isGif ? 'True' : 'False'))
      data.append('stepSize', '20')
      // Correct
      setIsLoading(true)
      setIsSuccess(false)
      setIsFailure(false)
      setMorphResponse(null)

      const response = await
      fetch(
        morph_endpoint, {
          method: 'POST',
          headers: {
            Authorization: 'ImageMorpherV1'
          },
          body: data
        }
      )
        .then(res => {
          try {
            if (res.ok) {
              return res.json()
            } else {
              throw new Error(res)
            }
          } catch (err) {
            console.log(err.message)
            setIsLoading(false)
            setIsSuccess(false)
            setIsFailure(true)
            setMorphResponse(null)
            throw err
          }
        })
        .then(resJson => {
          // On success, hide the loading spinner
          setIsLoading(false)
          setIsSuccess(true)
          setIsFailure(false)
          setMorphResponse(resJson)

          Analytics.logEvent('ButtonTapped', {
            name: (isGif ? 'MorphSequenceSuccess' : 'MorphSuccess'),
            screen: 'main',
            purpose: 'Morph was successful'
          })

          return resJson.data
        })
        .catch((error) => {
          console.error(error)
          Analytics.logEvent('ButtonTapped', {
            name: (isGif ? 'MorphSequenceFailure' : 'MorphFailure'),
            screen: 'main',
            purpose: error.message
          })
        })
    } catch (error) {
      console.error(error)
    }
  }

  const type = (isGif ? 'GIF' : 'Image')

  const getState = () => {
    if (isLoading) {
      return(
        <View style={{flexDirection: 'row'}}>
          <ActivityIndicator style={styles.spinner} size="small" />
          <Text>Creating {type}</Text>
        </View>
      )
    }
    if (morphResponse) {
      getMorphResponse()
      return (
          <View>
            <Text>View {type}</Text>
          </View>
      )
    }

    if (isFailure) {
      return (
        <View>
          <Text>Morph sequence failed. Try again</Text>
        </View>
      )
    }

    if (!firstImageRef && !secondImageRef) {
      return <Text>Upload two images to morph</Text>
    }
    if (firstImageRef instanceof Error) {
      return (
        <Text>Re-upload first image</Text>
      )
    }

    if (secondImageRef instanceof Error) {
      return (<Text>Re-upload second image</Text>)
    }
    if (!firstImageRef && secondImageRef) {
      return <Text>Upload the first image</Text>
    }

    if (firstImageRef && !secondImageRef) {
      return <Text>Upload the second image</Text>
    }
    if (firstImageRef && secondImageRef) {
      return <Text>Morph {isGif ? 'GIF' : 'Image'}</Text>
    }
  }

  return (
    <Button 
    mode='outlined'
    color='white'
    disabled={!firstImageRef || !secondImageRef}
    onPress={() => getMorph(firstImageRef, secondImageRef)}
    >
      {getState()}
    </Button>
  )

  return (
    <Button 
     mode='outlined'
     disabled={!firstImageRef || !secondImageRef}
     color='#e5a823'
     onPress={() => getMorph(firstImageRef, secondImageRef)} 
    >
      Morph {type}
    </Button>
  )
}

const styles = StyleSheet.create({ 
  spinner: {
    paddingRight: 5,
  }
})
