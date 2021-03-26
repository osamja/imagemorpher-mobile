import { Image } from 'react-native';
import React from 'react';

import Onboarding from 'react-native-onboarding-swiper';

export function CustomButton() {
    return(
        <Onboarding
        onDone={() => console.log('done')}
        pages={[
        {
            backgroundColor: '#fff',
            image: <Image source={require('../../test-images/brady.jpg')} />,
            title: 'Onboarding',
            subtitle: 'Done with React Native Onboarding Swiper',
        },
        {
            backgroundColor: '#fe6e58',
            image: <Image source={require('../../test-images/brady.jpg')} />,
            title: 'The Title',
            subtitle: 'This is the subtitle that sumplements the title.',
        },
        {
            backgroundColor: '#999',
            image: <Image source={require('../../test-images/brady.jpg')} />,
            title: 'Triangle',
            subtitle: "Beautiful, isn't it?",
        },
        ]}/>
    )
}