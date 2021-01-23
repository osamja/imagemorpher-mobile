// https://docs.expo.io/versions/latest/sdk/imagepicker/

import React, { useState, useEffect } from 'react';
import { Button, Image, Text, View, Platform, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

export default function FaceMorpher() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [morphResponse, setMorphResponse] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      // Quality of compression. (0 - 1.0).
      quality: 1,
      base64: false,
    });

    console.log(result);

    if (!result.cancelled) {
        if (image1 == null) {
          setImage1(result.uri)
        }
        else {
          setImage2(result.uri)
        }
      }
  }

  async function getMorph(image1, image2) {
    try {
      let data = new FormData();
      data.append('Image-1', image1);
      data.append('Image-2', image2);
      data.append('isSequence', 'True');
      data.append('stepSize', '20');

      let response = await fetch(
        'http://sammyjaved.com:8090/morph', {
          method: 'POST',
          headers: {
            'Authorization': 'ImageMorpherV1'
          },
          body: data,
        }
      );
      setMorphResponse(await response.text());
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={{flex: 1}}>
      <Text style={styles.title}>Face Morpher</Text>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.mainText}>Pick the first face from camera roll</Text>
          {image1 && <Image source={{ uri: image1 }} style={styles.img} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.mainText}>Pick the second face from camera roll</Text>
          {image2 && <Image source={{ uri: image2 }} style={styles.img} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.morphBtn} onPress={() => getMorph(image1, image2)}>
          <Text style={styles.mainText}>MORPH</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 30,
    fontSize: 30,
    textAlign: 'center',
  },
  container: {
    marginTop: 50,
    flexDirection: 'column',
    flex: 1,
  },
  button:  {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderBottomColor: 'white',
    borderBottomWidth: 5,
  },
  mainText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },  
  img: {
    width: 300,
    height: 200,
  },
  morphBtn: {
    backgroundColor: 'black',
    bottom: 0,
    justifyContent: 'center',
    textAlign: 'center',
  }
});