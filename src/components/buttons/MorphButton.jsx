import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import * as WebBrowser from 'expo-web-browser'
import { morph_endpoint } from '../../constants/index'
import styled from 'styled-components/native'

const StyledButton = styled(Button)`
  align-self: center;
  margin: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 10px;
  border: 1px solid #f5f5f5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 80%;
`

const styles = {
  restartStyle : {
    marginBottom: 100,
  }
}


export function MorphButton({
  firstImageRef,
  secondImageRef,
  morphResponse,
  setFirstImageRef,
  setSecondImageRef,
  setMorphResponse,
  handleMorphResetButtonClick,
}) {
  // for testing
  // firstImageRef = "2022-04-10-17-31-29-969295-d98ca6dccb2f4113861168ee0e6e0c42.jpg";
  // secondImageRef = "2022-04-10-17-31-47-544901-b38412bf90f942d0a31035bca93080e5.jpg";

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFailure, setIsFailure] = useState(false)

  async function getMorphResponse() {
      WebBrowser.openBrowserAsync(morphResponse.toString())
  }

  function setInitialMorphState () {
    setFirstImageRef(null)
    setSecondImageRef(null)
    setMorphResponse(null)
    setIsFailure(false)
    setIsSuccess(false)
    setIsLoading(false)
    handleMorphResetButtonClick()
  }

  async function getMorph (firstImageRef, secondImageRef) {
    if (!firstImageRef || !secondImageRef) {
      return
    }
   
    try {
      const data = new FormData()
      data.append('firstImageRef', firstImageRef)
      data.append('secondImageRef', secondImageRef)
      data.append('isSequence', ('False'))  // See Readme TODO section for more info
      data.append('stepSize', '10')   // 5 looks incredible, 20 looks bad, isSequence must be set to True

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

          return resJson.data
        })
        .catch((error) => {
          console.error(error)
        })
    } catch (error) {
      console.error(error)
    }
  }

  const getMorphButton = () => {
    if (isLoading) {
      return (
        <StyledButton
          mode='outlined'
          disabled
          loading
        >
          Loading..
        </StyledButton>
      )
    }

    if (isFailure) {
      return (
        <View>
          <StyledButton
            mode='outlined'
            onPress={() => setInitialMorphState()}
            style={styles.restartStyle}
          >
            Restart
          </StyledButton>
          <StyledButton
            mode='outlined'
            disabled
          >
            Morph Failed
          </StyledButton>
        </View>

      )
    }

    if (!firstImageRef && !secondImageRef) {
      return (
        <StyledButton
          mode='outlined'
          disabled
        >
          Upload first face to morph
        </StyledButton>
      )
    }
    
    if (firstImageRef instanceof Error) {
      return (
        <StyledButton
          mode='outlined'
          disabled
        >
          Re-upload first image
        </StyledButton>
      )
    }
    if (secondImageRef instanceof Error) {
      return (
        <StyledButton
          mode='outlined'
          disabled
        >
          Re-upload second image
        </StyledButton>
      )

    }

    if (!firstImageRef && secondImageRef) {
      return (
        <View>
          <StyledButton
            mode='outlined'
            disabled
          >
            Upload the first image
          </StyledButton>
        </View>
      )
    }

    if (firstImageRef && !secondImageRef) {
      return (
        <View>
          <StyledButton
            mode='outlined'
            disabled
          >
            Upload the second image
          </StyledButton>
        </View>
      )
    }

    if (firstImageRef && secondImageRef && morphResponse) {
      return (
        <View>
          <StyledButton
            mode='outlined'
            onPress={() => setInitialMorphState()}
            style={styles.restartStyle}
          >
            Restart
          </StyledButton>
          <StyledButton
            mode='outlined'
            onPress={() => getMorphResponse()}
          >
            View Morph
          </StyledButton>
        </View>
      )
    }

    if (firstImageRef && secondImageRef) {
      return (
        <View>
          <StyledButton
            mode='outlined'
            onPress={() => getMorph(firstImageRef, secondImageRef)}
          >
            Morph
          </StyledButton>
        </View>
      )
    }
  }

  const morphButton = getMorphButton();

  return (
    morphButton
  )
}
