// https://docs.expo.io/versions/latest/sdk/imagepicker/

import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

export default function FaceMorpher() {

  // State Hook
  // Allows to use state and features w/o making classes.
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  // True if first face button is clicked.
  // False if second face button is clicked.
  const [isFirstFace, setIsFirstFace] = useState(false)
 
  // Effect Hook
  // Allows side effects in function components.
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
    });

    console.log(result);

    if (!result.cancelled) {
      // Can't change first picture after selecting
      // Fix later.
        if (image1 == null) {
          setImage1(result.uri)
        }
        else {
          setImage2(result.uri)
        }
      }
  }

  const uploadImage = async (image1, image2) => {
    console.log('uploadImage called')
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button title="Pick the first face from camera roll" onPress={pickImage} />
      {image1 && <Image source={{ uri: image1 }} style={{ width: 200, height: 200 }} />}
      <Button title="Pick the second face from camera roll" onPress={pickImage} />
      {image2 && <Image source={{ uri: image2 }} style={{ width: 200, height: 200 }} />}
      <Button title="MORPH" onPress={uploadImage} />
    </View>
  );
}