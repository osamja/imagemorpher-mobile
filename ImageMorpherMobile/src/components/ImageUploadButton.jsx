import React, { useState} from 'react';
import {  View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

export function ImageUploadButton({
    image,
    setImage
}) {
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          // Quality of compression: [0, 1]
          quality: 0.2,
          base64: true,
        });
    
        if (!result.cancelled) {
            if (image == null) {
                // image picker on iphone works different than web browser
              if (result.base64) {
                setImage(result.base64)
              } else {
                setImage(result.uri);
              }
            }
          }
      }

    // const check_mark = <Image source={require('../../test-images/success-green-check-mark.png')} style={styles.checkMark} />
    
    const uploadBtn = <Image source={require('../../test-images/avatar.png')} style={styles.uploadBtn} />;
    const isUploadedBtn = <Image source={require('../../test-images/avatar-green.png')} style={styles.uploadBtn} />;

    return (
        <View style={styles.uploadArea} >
            <TouchableOpacity onPress={pickImage}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={['#e0c3fc', '#8ec5fc']}
                    style={styles.background}
                >
                    <View style={styles.uploadImgArea}>
                        {!image && uploadBtn}
                        {image && isUploadedBtn}
                    </View>
                </LinearGradient>
            </TouchableOpacity>
      </View>
      );
  }

  const styles = StyleSheet.create({
    uploadArea:  {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      padding: 10
    },
    uploadImgArea: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 150,
      height: 150,
      borderRadius: 10,
    },
    uploadBtn: {
      width: '90%',
      height: '100%',
      resizeMode: 'contain'
    },
    checkMark: {
      width: 30,
      height: 30,
      marginLeft: 20,
    },  
  });



