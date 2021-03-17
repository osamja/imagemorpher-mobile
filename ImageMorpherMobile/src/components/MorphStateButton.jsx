import React, { Fragment, useState} from 'react';
import {  View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import * as WebBrowser from 'expo-web-browser';

export function MorphStateButton({
    image1,
    image2,
    setImage1,
    setImage2,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailure, setIsFailure] = useState(false);
    const [morphResponse, setMorphResponse] = useState(null);

    function setInitialMorphState() {
        setImage1();  
        setImage2();
        setIsLoading(false);
        setIsSuccess(false);
        setIsFailure(false);
        setMorphResponse(null);
    }

    function getMorphedImg() {
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

    if (isSuccess && morphResponse) {
      getMorphedImg()

      return (
        <Fragment>
          <View style={styles.morphArea}>
            <View style={styles.morphBtn}>
              <TouchableOpacity onPress={() => getMorphedImg()} style={styles.morphArea}>
                <Text style={styles.morphTxt}>
                  Get Morphed Image
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setInitialMorphState()} style={styles.morphArea}>
                <Image source={require('../../test-images/reset-update.png')} style={styles.reset}></Image>
            </TouchableOpacity>
          </View>

        </Fragment>
      ) 
    }

    if (isFailure) {
      return (
        <View style={styles.morphArea}> 
          <TouchableOpacity onPress={() => setInitialMorphState()} style={styles.morphBtn}>
            <Text style={styles.morphTxt}>Morph Failed
              <Image source={require('../../test-images/reset-update.png')} style={styles.reset}></Image>
            </Text>
          </TouchableOpacity>
      </View>
      )
    }

    if (!image1 && !image2) {
      return (
        <View style={styles.morphArea} >
          <TouchableOpacity style={styles.morphBtn}>
              <Text style={styles.morphTxt}>Upload 2 images to morph</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (!image2) {
      return (
        <View style={styles.morphArea} >
          <TouchableOpacity style={styles.morphBtn}>
              <Text style={styles.morphTxt}>Upload the second image</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (!morphResponse) {
      return (
        <View style={styles.morphArea}>
          <TouchableOpacity style={styles.morphBtn}  onPress={() => getMorph(image1, image2)}>
            <Text style={styles.morphTxt}>Let's morph</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (null);
  }

  const styles = StyleSheet.create({
    reset: {
      width: 30,
      height: 30,
    },
    morphArea: {
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    morphBtn: {
      borderRadius: 10,
      borderWidth: 1, 
      backgroundColor: 'white',
      width: 300,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    morphTxt: {
      fontFamily: 'System',
      fontSize: 20,
      color: 'black',
    }
  });
