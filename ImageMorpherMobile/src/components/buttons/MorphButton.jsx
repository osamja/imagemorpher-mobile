import React, { useState } from 'react'
import { StyleSheet, ActivityIndicator } from 'react-native'
import { Button } from 'react-native-paper'
import * as Analytics from 'expo-firebase-analytics'
import { View } from 'react-native-web'
import { Text } from 'react-native-paper'

import { morph_endpoint } from '../../constants/index'

export function MorphButton({
  firstImageRef,
  secondImageRef,
  morphResponse,
  setMorphResponse
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFailure, setIsFailure] = useState(false)

  async function getMorph (firstImageRef, secondImageRef) {
    if (!firstImageRef || !secondImageRef) {
      return
    }
   
    try {
      await Analytics.logEvent('ButtonTapped', {
        name: ('StartMorph'),
        screen: 'main',
        purpose: ('Start the morph'),
      })

      const data = new FormData()
      data.append('firstImageRef', firstImageRef)
      data.append('secondImageRef', secondImageRef)
      data.append('isSequence', ('True'))
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
            name: ('MorphSequenceSuccess'),
            screen: 'main',
            purpose: 'Morph was successful'
          })

          return resJson.data
        })
        .catch((error) => {
          console.error(error)
          Analytics.logEvent('ButtonTapped', {
            name: ('MorphSequenceFailure'),
            screen: 'main',
            purpose: error.message
          })
        })
    } catch (error) {
      console.error(error)
    }
  }

  const getMorphButtonText = () => {
    if (isLoading) {
      return(
        <View style={{flexDirection: 'row'}}>
          <ActivityIndicator style={styles.spinner} size="small" />
          <Text>Creating Morph</Text>
        </View>
      )
    }
    if (morphResponse) {
      getMorphResponse()
      return ('View Morph')
    }

    if (isFailure) {
      return ('Morph sequence failed. Try again')
    }
    if (!firstImageRef && !secondImageRef) {
      return ('Upload two images to morph')
    }
    if (firstImageRef instanceof Error) {
      return ('Re-upload first image')
    }
    if (secondImageRef instanceof Error) {
      return 'Re-upload second image'
    }
    if (!firstImageRef && secondImageRef) {
      return 'Upload the first image'
    }
    if (firstImageRef && !secondImageRef) {
      return 'Upload the second image'
    }
    if (firstImageRef && secondImageRef) {
      return 'Morph'
    }
  }

  return (
    // button styling sucks
    <Button 
      mode='outlined'
      labelStyle={{ color: "white" }}
      disabled={!firstImageRef || !secondImageRef}
      onPress={() => getMorph(firstImageRef, secondImageRef)}
    >
      {getMorphButtonText()}
    </Button>
  )
}

const styles = StyleSheet.create({ 
  spinner: {
    paddingRight: 5,
  }
})
