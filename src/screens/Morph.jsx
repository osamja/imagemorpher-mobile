import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
    swiperRef.current.slideTo(0); // Reset to the first slide
  };

  const handleSuccessfulImageUpload = () => {
    swiperRef.current.swiper.slideNext();
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
        spaceBetween={50}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        onSlideChange={() => console.log('slide change')}
        style={{ width: '100%', height: '100%' }}  // Ensure Swiper takes up full width and height
      >
        <SwiperSlide>
          <View style={styles.slide}>
            {console.log('Slide 1 rendered')}
            <ImageUploadButton
              imageRef={firstImageRef}
              setImageRef={setFirstImageRef}
              swiperRef={swiperRef}
              handleSuccessfulImageUpload={handleSuccessfulImageUpload}
            />
          </View>
        </SwiperSlide>
        <SwiperSlide>
          <View style={styles.slide}>
            {console.log('Slide 2 rendered')}
            <ImageUploadButton
              imageRef={secondImageRef}
              setImageRef={setSecondImageRef}
              swiperRef={swiperRef}
              handleSuccessfulImageUpload={handleSuccessfulImageUpload}
            />
          </View>
        </SwiperSlide>
        <SwiperSlide>
          <View style={styles.slide}>
            {console.log('Slide 3 rendered')}
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
        </SwiperSlide>
      </Swiper>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
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
