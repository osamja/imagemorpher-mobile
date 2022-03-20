import React, { Fragment, useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Button } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser'
import * as Analytics from 'expo-firebase-analytics'

import { morph_endpoint } from '../constants/index'

export function MorphImageButton ({
  firstImageRef,
  secondImageRef,
  morphImageResponse,
  setFirstImageRef,
  setSecondImageRef,
  setMorphImageResponse
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFailure, setIsFailure] = useState(false)

  function setInitialMorphState () {
    setFirstImageRef(null)
    setSecondImageRef(null)
    setMorphImageResponse(null)
    setIsLoading(false)
    setIsSuccess(false)
    setIsFailure(false)
  }

  function getMorphedImg () {
    Analytics.logEvent('ButtonTapped', {
      name: 'GetMorph',
      screen: 'main',
      purpose: 'Begin the morph'
    })
    WebBrowser.openBrowserAsync(morphImageResponse.toString())
  }

  async function getMorph (firstImageRef, secondImageRef) {
    if (!firstImageRef || !secondImageRef) {
      return
    }

    try {
      await Analytics.logEvent('ButtonTapped', {
        name: 'StartMorph',
        screen: 'main',
        purpose: 'Start the morph'
      })

      const data = new FormData()
      data.append('firstImageRef', firstImageRef)
      data.append('secondImageRef', secondImageRef)
      data.append('isSequence', 'False')
      data.append('stepSize', '20')
      // Correct
      setIsLoading(true)
      setIsSuccess(false)
      setIsFailure(false)
      setMorphImageResponse(null)

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
            setMorphImageResponse(null)
            throw err
          }
        })
        .then(resJson => {
          // On success, hide the loading spinner
          setIsLoading(false)
          setIsSuccess(true)
          setIsFailure(false)
          setMorphImageResponse(resJson)

          Analytics.logEvent('ButtonTapped', {
            name: 'MorphSuccess',
            screen: 'main',
            purpose: 'Morph was successful'
          })

          return resJson.data
        })
        .catch((error) => {
          console.error(error)
          Analytics.logEvent('ButtonTapped', {
            name: 'MorphFailure',
            screen: 'main',
            purpose: error.message
          })
        })
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <Button mode="outlined">
        <ActivityIndicator size="small" />
        Morphing 
      </Button>
    )
  }

  if (morphImageResponse) {
    return (
      <View>
        <Button mode="outlined" onPress={() => getMorphedImg()}>
          View Image
        </Button>
        <Button mode="outlined" onPress={() => setInitialMorphState()}>
          Restart
        </Button>
      </View>
    )
  }

  if (isFailure) {
    return (
      <Button mode="outlined" onPress={() => setInitialMorphState()}>
        Restart
      </Button>
    )
  }

  return (
    <View>
      <Button onPress={() => getMorph(firstImageRef, secondImageRef)} mode="outlined"> 
        Morph
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  morphArea: {
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  morphBtn: {
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: '#fbfbfb',
    width: 300,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  morphTxt: {
    fontFamily: 'System',
    fontSize: 18,
    color: '#2b2b2b',
    fontWeight: 'bold'
  }
})
