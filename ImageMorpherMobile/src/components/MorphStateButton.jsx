import React, { Fragment, useState} from 'react';
import {  View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { morph_endpoint } from '../constants/index';

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
            data.append('isSequence', 'True');
            data.append('stepSize', '20');
            // Correct
            setIsLoading(true);
            setIsSuccess(false);
            setIsFailure(false);
            setMorphResponse(null);
            let response = await 
            fetch(
              morph_endpoint, {
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
                <Image source={require('../../assets/redo-arrow.png')} style={styles.largeReset}></Image>
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
            <View style={{paddingLeft: 5}}>
            <Image source={require('../../assets/redo-arrow.png')} style={styles.smallReset}></Image>
            </View>
            </Text>
          </TouchableOpacity>
      </View>
      )
    }

    if (!image1 && !image2) {
      return (
        <View style={styles.morphArea} >
          <TouchableOpacity style={styles.morphBtn}>
              <Text style={styles.morphTxt}>Upload two faces to morph</Text>
          </TouchableOpacity>
        </View>
      )
    }

    if (!image1 || !image2) {
      return (
        <View style={styles.morphArea} >
          <TouchableOpacity style={styles.morphBtn}>
              <Text style={styles.morphTxt}>Upload the second face</Text>
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
    smallReset: {
      width: 20,
      height: 20,
    },
    largeReset: {
      width: 40,
      height: 40,
    },
    morphArea: {
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    morphBtn: {
      borderRadius: 10,
      borderWidth: 2, 
      backgroundColor: '#fbfbfb',
      width: 300,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    morphTxt: {
      fontFamily: 'System',
      fontSize: 18,
      color: '#2b2b2b',
      fontWeight: 'bold',
    }
  });
