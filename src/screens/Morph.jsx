// src/screens/Morph.js
import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import Swiper from 'react-native-swiper';

// ... other imports ...
import { ImageUploadButton } from '../components/buttons/ImageUploadButton';
import { MorphButton } from '../components/buttons/MorphButton';

import profileIcon from '../../assets/profile-icon.png';

export default function Morph({
  navigation,
  isLoggedIn,
}) {
  const [firstImageRef, setFirstImageRef] = useState(null);
  const [secondImageRef, setSecondImageRef] = useState(null);
  const [morphResponse, setMorphResponse] = useState(null);

  const swiperRef = useRef(null);

  const handleMorphResetButtonClick = () => {
    swiperRef.current.scrollBy(-2);
  };

  const handleSuccessfulImageUpload = () => {
    swiperRef.current.scrollBy(1);
  };

  const renderProfileIcon = () => {
    return (
      <TouchableOpacity
        style={styles.profileIconContainer}
        onPress={() => {
          navigation.navigate('Profile');
        }}
      >
        <Image source={profileIcon} style={styles.profileIcon} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoggedIn && renderProfileIcon()}
      <Swiper
          ref={swiperRef}
          style={styles.wrapper}
          showsButtons={false}
          loop={false}
        >
          <View style={styles.slide}>
            <ImageUploadButton
              imageRef={firstImageRef}
              setImageRef={setFirstImageRef}
              swiperRef={swiperRef}
              handleSuccessfulImageUpload={handleSuccessfulImageUpload}
            />
          </View>
          <View style={styles.slide}>
            <ImageUploadButton
              imageRef={secondImageRef}
              setImageRef={setSecondImageRef}
              swiperRef={swiperRef}
              handleSuccessfulImageUpload={handleSuccessfulImageUpload}
            />
          </View>
          <View style={styles.slide}>
            <MorphButton
              firstImageRef={firstImageRef}
              secondImageRef={secondImageRef}
              morphResponse={morphResponse}
              setFirstImageRef={setFirstImageRef}
              setSecondImageRef={setSecondImageRef}
              setMorphResponse={setMorphResponse}
              handleMorphResetButtonClick={handleMorphResetButtonClick}
            />
          </View>
        </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  profileIconContainer: {
    position: 'absolute',
    top: 50, // Adjust this value to move the icon up or down
    right: 20, // Adjust this value to move the icon left or right
    zIndex: 1,
  },
  profileIcon: {
    width: 40, // Adjust this value to resize the icon
    height: 40, // Adjust this value to resize the icon
  },
});
