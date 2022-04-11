import React, { useState } from 'react'
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


  // for testing
  // firstImageRef = "2022-04-10-17-31-29-969295-d98ca6dccb2f4113861168ee0e6e0c42.jpg";
  // secondImageRef = "2022-04-10-17-31-47-544901-b38412bf90f942d0a31035bca93080e5.jpg";

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

  const getMorphButton = () => {
    if (isLoading) {
      return (
        <Button
          mode='outlined'
          labelStyle={{ color: "white" }}
          disabled
          loading
        >
          Loading..
        </Button>
      )
    }

    if (isFailure) {
      return (
        <Button
          mode='outlined'
          labelStyle={{ color: "white" }}
          disabled
        >
          Morph Failed
        </Button>
      )
    }

    if (!firstImageRef && !secondImageRef) {
      return (
        <Button
          mode='outlined'
          labelStyle={{ color: "white" }}
          disabled
        >
          Upload two images to morph
        </Button>
      )
    }
    
    if (firstImageRef instanceof Error) {
      return (
        <Button
          mode='outlined'
          labelStyle={{ color: "white" }}
          disabled
        >
          Re-upload first image
        </Button>
      )
    }
    if (secondImageRef instanceof Error) {
      return (
        <Button
          mode='outlined'
          labelStyle={{ color: "white" }}
          disabled
        >
          Re-upload second image
        </Button>
      )

    }

    if (!firstImageRef && secondImageRef) {
      return (
        <Button
          mode='outlined'
          labelStyle={{ color: "white" }}
          disabled
        >
          Upload the first image
        </Button>
      )
    }

    if (firstImageRef && !secondImageRef) {
      return (
        <Button
          mode='outlined'
          labelStyle={{ color: "white" }}
          disabled
        >
          Upload the second image
        </Button>
      )
    }

    if (firstImageRef && secondImageRef) {
      return (
        <Button
          mode='outlined'
          labelStyle={{ color: "white" }}
          onPress={() => getMorph(firstImageRef, secondImageRef)}
        >
          Morph
        </Button>
      )
    }
  }

  const morphButton = getMorphButton();

  return (
    morphButton
  )
}
