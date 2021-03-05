import React, { useState} from 'react';
import {  Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';

export function MorphStateButton({
    image1,
    image2,
    setInitialImageState
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailure, setIsFailure] = useState(false);
    const [morphResponse, setMorphResponse] = useState(null);

    function setInitialMorphState() {
        setInitialImageState();
        setIsLoading(false);
        setIsSuccess(false);
        setIsFailure(false);
        setMorphResponse(null);
    }

    function getMorphedImg() {
        setInitialMorphState()
        WebBrowser.openBrowserAsync(morphResponse.toString())
    }

    async function getMorph(image1, image2) {
        if (!image1 || !image2) {
            return;
        }
    
        try {
            let data = new FormData();
            data.append('Image-1', image1);
            data.append('Image-2', image2);
            data.append('isSequence', 'False');
            data.append('stepSize', '20');
            // Correct
            setIsLoading(true);
            setIsSuccess(false);
            setIsFailure(false);
            setMorphResponse(null);
            let response = await 
            fetch(
                'http://sammyjaved.com:8090/morph', {
                method: 'POST',
                headers: {
                    'Authorization': 'ImageMorpherV1'
                },
                body: data,
                } 
            )
            .then(res => {
                try {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error(res)
                }
                }
                catch (err) {
                console.log(err.message)
                setIsLoading(false);
                setIsSuccess(false);
                setIsFailure(true);
                setMorphResponse(null);
                throw err;
                }
            })
            .then (resJson => {
                // On success, hide the loading spinner
                setIsLoading(false);
                setIsSuccess(true);
                setIsFailure(false);
                setMorphResponse(resJson);
                return resJson.data
            })
            .catch(err => console.log(err))
        } catch (error) {
            console.error(error);
        }
    }

    if (isLoading) {
      return (
        <TouchableOpacity style={styles.morphArea}>
          <Text style={styles.morphBtn}>
            MORPHING IMAGES
            <ActivityIndicator size="small"/>
          </Text>
        </TouchableOpacity>
      )
    }

    if (isSuccess && morphResponse) {
        getMorphedImg();
        return (
        <TouchableOpacity onPress={() => setInitialMorphState()} style={styles.morphArea}>
            <Image source={require('../../test-images/reset-update.png')} style={styles.reset}></Image>
        </TouchableOpacity>
        ) 
    }

    if (isFailure) {
      return (
        <TouchableOpacity onPress={() => setInitialMorphState()} style={styles.morphArea}> 
          <Text style={styles.morphAreaTxt}>MORPH FAILED
            <Image source={require('../../test-images/reset-update.png')} style={styles.reset}></Image>
          </Text>
      </TouchableOpacity>
      )

    }

    if (!image1 || !image2) {
      return (
        <TouchableOpacity style={styles.morphArea}>
            <TouchableOpacity style={styles.morphBtn}>
              Upload 2 faces to morph
            </TouchableOpacity>
        </TouchableOpacity>
      )
    }

    if (!morphResponse) {
      return (
        <TouchableOpacity style={styles.morphArea}>
          <TouchableOpacity style={styles.morphBtn}  onPress={() => getMorph(image1, image2)}>
            <Text>Let's morph</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )
    }

    return (null);
  }

  const styles = StyleSheet.create({
    morphArea: {
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      border: "1px solid rgb(212, 212, 212)"
    },
    morphBtn: {
      fontSize: 30,
      textAlign: 'center',
      color: 'white',
      fontFamily: 'System',
    },
  });
