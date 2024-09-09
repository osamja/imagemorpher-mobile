import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedGestureHandler, withSpring, runOnJS, clamp } from 'react-native-reanimated';

// Other imports
import { ImageUploadButton } from '../components/buttons/ImageUploadButton';
import { MorphButton } from '../components/buttons/MorphButton';

import profileIcon from '../../assets/profile-icon.png';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Morph({ navigation, isLoggedIn }) {
  const [activeSlide, setActiveSlide] = useState(0); // Track the current slide
  const [firstImageRef, setFirstImageRef] = useState(null);
  const [secondImageRef, setSecondImageRef] = useState(null);
  const [morphResponse, setMorphResponse] = useState(null);

  const translateX = useSharedValue(0);

  const maxTranslateX = -screenWidth * 2; // For 3 slides (0, 1, 2)

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = clamp(ctx.startX + event.translationX, maxTranslateX, 0); // Prevent overflow
    },
    onEnd: (event) => {
      const threshold = screenWidth / 10; // Trigger slide change more easily
      const velocityThreshold = 800; // Detect fast swipes

      let nextSlide = activeSlide;

      // Fast swipe detection
      if (event.velocityX > velocityThreshold) {
        nextSlide = Math.max(0, activeSlide - 1); // Swipe to the previous slide
      } else if (event.velocityX < -velocityThreshold) {
        nextSlide = Math.min(2, activeSlide + 1); // Swipe to the next slide
      } else {
        // If swipe is not fast, check the position and move to the closest slide
        if (translateX.value > -screenWidth * activeSlide + threshold) {
          nextSlide = Math.max(0, activeSlide - 1); // Move to the previous slide
        } else if (translateX.value < -screenWidth * activeSlide - threshold) {
          nextSlide = Math.min(2, activeSlide + 1); // Move to the next slide
        }
      }

      // Snap to the closest slide
      translateX.value = withSpring(-screenWidth * nextSlide, { damping: 15, stiffness: 90 });
      runOnJS(setActiveSlide)(nextSlide);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleMorphResetButtonClick = () => {
    translateX.value = withSpring(0, { damping: 15, stiffness: 90 }); // Reset to the first slide
    setActiveSlide(0);
  };

  const handleSuccessfulImageUpload = () => {
    translateX.value = withSpring(-screenWidth, { damping: 15, stiffness: 90 }); // Move to next slide
    setActiveSlide(1);
  };

  const handleSuccessfulSecondUpload = () => {
    translateX.value = withSpring(-screenWidth * 2, { damping: 15, stiffness: 90 }); // Move to morph screen after second upload
    setActiveSlide(2);
  };

  const renderProfileIcon = () => {
    return (
      <TouchableOpacity
        style={styles.profileIconContainer}
        onPress={() => navigation.navigate('Profile')}
      >
        <Image source={profileIcon} style={styles.profileIcon} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoggedIn && renderProfileIcon()}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.swiperContainer, animatedStyle]}>
          <View style={styles.slide}>
            <ImageUploadButton
              imageRef={firstImageRef}
              setImageRef={setFirstImageRef}
              handleSuccessfulImageUpload={handleSuccessfulImageUpload}
            />
          </View>
          <View style={styles.slide}>
            <ImageUploadButton
              imageRef={secondImageRef}
              setImageRef={setSecondImageRef}
              handleSuccessfulImageUpload={handleSuccessfulSecondUpload} // Trigger navigation after second upload
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
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  swiperContainer: {
    flexDirection: 'row',
    width: screenWidth * 3, // Enough space for 3 slides
    height: screenHeight, // Full height of the screen
    overflow: 'hidden', // Hide overflow to prevent seeing partial slides
  },
  slide: {
    width: screenWidth, // Each slide takes up the full width
    height: screenHeight, // Full height for each slide
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  profileIconContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  profileIcon: {
    width: 40,
    height: 40,
  },
});
