import React, { useState, useRef, useEffect } from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-paper'
import * as WebBrowser from 'expo-web-browser'
import { morph_endpoint } from '../../constants/index'
import styled from 'styled-components/native'
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const StyledButton = styled(Button)`
  align-self: center;
  margin: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 10px;
  border: 1px solid #f5f5f5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 80%;
`

const styles = {
  restartStyle : {
    marginBottom: 100,
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log('Push token: ')
    // console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export function MorphButton({
  firstImageRef,
  secondImageRef,
  morphResponse,
  setFirstImageRef,
  setSecondImageRef,
  setMorphResponse,
  handleMorphResetButtonClick,
}) {
  // for testing
  // firstImageRef = "2022-04-10-17-31-29-969295-d98ca6dccb2f4113861168ee0e6e0c42.jpg";
  // secondImageRef = "2022-04-10-17-31-47-544901-b38412bf90f942d0a31035bca93080e5.jpg";

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFailure, setIsFailure] = useState(false)

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
    };
  }, []);

  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      // Add any action you want to perform when the notification is tapped
      // Clicking on the notification will open the browser to the morphed url
      const url = response.notification.request.content.data.url;
      if (url) {
        setMorphResponse(url)
        WebBrowser.openBrowserAsync(url);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function getMorphResponse() {
      WebBrowser.openBrowserAsync(morphResponse.toString())
  }

  function setInitialMorphState () {
    setFirstImageRef(null)
    setSecondImageRef(null)
    setMorphResponse(null)
    setIsFailure(false)
    setIsSuccess(false)
    setIsLoading(false)
    handleMorphResetButtonClick()
  }

  async function getMorph (firstImageRef, secondImageRef) {
    if (!firstImageRef || !secondImageRef) {
      return
    }
   
    try {
      const data = new FormData()
      data.append('firstImageRef', firstImageRef)
      data.append('secondImageRef', secondImageRef)
      data.append('isSequence', ('False'))  // See Readme TODO section for more info
      data.append('stepSize', '10')   // 5 looks incredible, 20 looks bad, isSequence must be set to True
      data.append('expoPushToken', expoPushToken)

      // Correct
      setIsLoading(true)
      setIsSuccess(false)
      setIsFailure(false)
      setMorphResponse(null)

      const response = await
      fetch(
        morph_endpoint, {
          method: 'POST',
          headers: {
            Authorization: 'ImageMorpherV1'
          },
          body: data
        }
      )
        .then(res => {
          try {
            if (res.ok) {
              return res.json()
            } else {
              throw new Error(res)
            }
          } catch (err) {
            console.log(err.message)
            setIsLoading(false)
            setIsSuccess(false)
            setIsFailure(true)
            setMorphResponse(null)
            throw err
          }
        })
        .then(resJson => {
          // On success, hide the loading spinner
          setIsLoading(false)
          setIsSuccess(true)
          setIsFailure(false)
          setMorphResponse(resJson)

          return resJson.data
        })
        .catch((error) => {
          console.error(error)
        })
    } catch (error) {
      console.error(error)
    }
  }

  const getMorphButton = () => {
    if (isLoading) {
      return (
        <StyledButton
          mode='outlined'
          disabled
          loading
        >
          Loading..
        </StyledButton>
      )
    }

    if (isFailure) {
      return (
        <View>
          <StyledButton
            mode='outlined'
            onPress={() => setInitialMorphState()}
            style={styles.restartStyle}
          >
            Restart
          </StyledButton>
          <StyledButton
            mode='outlined'
            disabled
          >
            Morph Failed
          </StyledButton>
        </View>

      )
    }

    if (!firstImageRef && !secondImageRef) {
      return (
        <StyledButton
          mode='outlined'
          disabled
        >
          Upload first face to morph
        </StyledButton>
      )
    }
    
    if (firstImageRef instanceof Error) {
      return (
        <StyledButton
          mode='outlined'
          disabled
        >
          Re-upload first image
        </StyledButton>
      )
    }
    if (secondImageRef instanceof Error) {
      return (
        <StyledButton
          mode='outlined'
          disabled
        >
          Re-upload second image
        </StyledButton>
      )

    }

    if (!firstImageRef && secondImageRef) {
      return (
        <View>
          <StyledButton
            mode='outlined'
            disabled
          >
            Upload the first image
          </StyledButton>
        </View>
      )
    }

    if (firstImageRef && !secondImageRef) {
      return (
        <View>
          <StyledButton
            mode='outlined'
            disabled
          >
            Upload the second image
          </StyledButton>
        </View>
      )
    }

    if (firstImageRef && secondImageRef && morphResponse) {

      isMorphProcessing = morphResponse.toString().includes('Processing')

      return (
        <View>
          <StyledButton
            mode='outlined'
            onPress={() => setInitialMorphState()}
            style={styles.restartStyle}
          >
            Restart
          </StyledButton>
          {!isMorphProcessing && <StyledButton
            mode='outlined'
            onPress={() => getMorphResponse()}
            >
              Get Morph
            </StyledButton>
          }

          {isMorphProcessing && <Text>We'll notify you when your morph is ready!</Text>}
        </View>
      )
    }

    if (firstImageRef && secondImageRef) {
      return (
        <View>
          <StyledButton
            mode='outlined'
            onPress={() => getMorph(firstImageRef, secondImageRef)}
          >
            Morph
          </StyledButton>
        </View>
      )
    }
  }

  const morphButton = getMorphButton();

  return (
    morphButton
  )
}
