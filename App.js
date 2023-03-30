import React, {useState, useRef} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-swiper';

// Views
import { ImageUploadButton } from './src/components/buttons/ImageUploadButton'
import { MorphButton } from './src/components/buttons/MorphButton'

export default function App() {

  const [firstImageRef, setFirstImageRef] = useState(null)
  const [secondImageRef, setSecondImageRef] = useState(null)
  const [morphResponse, setMorphResponse] = useState(null)

  const swiperRef = useRef(null);

  const handleMorphResetButtonClick = () => {
    // This will auto swipe back two slides to the first image upload button
    swiperRef.current.scrollBy(-2);
  }

  const handleSuccessfulImageUpload = () => {
    // This will auto swipe to the next slide after an image is successfully uploaded
    swiperRef.current.scrollBy(1);
  }

  return (
    <View style={styles.container}>
      <Swiper ref={swiperRef} style={styles.wrapper} showsButtons={false} loop={false}>
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
}

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
});
