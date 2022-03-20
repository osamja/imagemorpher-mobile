import React, { useState } from 'react'
import { Text, StyleSheet } from 'react-native'

export function InfoMessage({firstImageRef, secondImageRef}) {

  let text = ''

  if (!firstImageRef && !secondImageRef) {
    text = 'Upload two images to morph'
  }
  if (!firstImageRef && secondImageRef) {
    text = 'Upload the first image'
  }
  if (firstImageRef && !secondImageRef) {
    text = 'Upload the second image'
  }
  if (firstImageRef instanceof Error) {
    text = 'First image is invalid. Please upload again.'
  }
  if (secondImageRef instanceof Error) {
    text = 'Second image is invalid. Please upload again.'
  }
  
  return (
    <Text style={styles.text}>
      {text}
    </Text>
    )
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    marginTop: 100,
    fontSize: 20,
  }
});