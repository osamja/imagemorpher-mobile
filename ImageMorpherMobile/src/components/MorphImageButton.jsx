import React, { Fragment, useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
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
    setIsLoading(false)
    setIsSuccess(false)
    setIsFailure(false)
    setMorphImageResponse(null)
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
      <View style={styles.morphArea}>
        <View style={styles.morphBtn}>
          <Text style={styles.morphTxt}>
            Morphing Images
            <ActivityIndicator size="small"/>
          </Text>
        </View>
      </View>
    )
  }

  if (morphImageResponse) {
    getMorphedImg()
    return (
      <Fragment>
        <View style={styles.morphArea}>
          <View style={styles.morphBtn}>
            <TouchableOpacity onPress={() => getMorphedImg()} style={styles.morphArea}>
              <Text style={styles.morphTxt}>
                View Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </Fragment>
    )
  }

  if (isFailure) {
    return (
      <View style={styles.morphArea}>
        <TouchableOpacity onPress={() => setInitialMorphState()} style={styles.morphBtn}>
          <Text style={styles.morphTxt}>Morph Failed
          <View style={{ paddingLeft: 5 }}>
          <Image source={require('../../assets/redo-arrow.png')} style={styles.smallReset}></Image>
          </View>
          </Text>
        </TouchableOpacity>
    </View>
    )
  }

  if (!firstImageRef && !secondImageRef) {
    return (
      <View style={styles.morphArea} >
        <TouchableOpacity style={styles.morphBtn}>
            <Text style={styles.morphTxt}>Upload two faces to morph</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (firstImageRef instanceof Error) {
    return (
      <View style={styles.morphArea} >
        <TouchableOpacity style={styles.morphBtn}>
            <Text style={styles.morphTxt}>Re-Upload first image</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (secondImageRef instanceof Error) {
    return (
      <View style={styles.morphArea} >
        <TouchableOpacity style={styles.morphBtn}>
            <Text style={styles.morphTxt}>Re-Upload second image</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (firstImageRef && !secondImageRef) {
    return (
      <View style={styles.morphArea} >
        <TouchableOpacity style={styles.morphBtn}>
            <Text style={styles.morphTxt}>Upload the second face</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!firstImageRef && secondImageRef) {
    return (
      <View style={styles.morphArea} >
        <TouchableOpacity style={styles.morphBtn}>
            <Text style={styles.morphTxt}>Upload the first face</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!morphImageResponse) {
    return (
      <View style={styles.morphArea}>
        <TouchableOpacity style={styles.morphBtn} onPress={() => getMorph(firstImageRef, secondImageRef)}>
          <Text style={styles.morphTxt}>Let's morph</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (null)
}

const styles = StyleSheet.create({
  smallReset: {
    width: 20,
    height: 20
  },
  largeReset: {
    width: 40,
    height: 40
  },
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
