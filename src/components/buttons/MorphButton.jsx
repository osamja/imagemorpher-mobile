import React, { useState, useRef, useEffect } from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-paper'
import * as WebBrowser from 'expo-web-browser'
import * as SecureStore from 'expo-secure-store';
import {
  morph_endpoint,
  morph_status_webpage,
  ID_TOKEN_KEY,
} from '../../constants/index'
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
`;

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
      // Add presentationOptions with a custom message
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
          provideAppNotificationSettings: true,
          presentationOptions: ['alert', 'sound'],
          customPrompt: {
            title: 'Allow notifications',
            message:
              'We will notify you when your morph is ready. To receive these notifications, please grant permission.',
          },
        },
      });
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
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
  // firstImageRef = "2023-04-27-00-00-33-702223-b1585a16bdd6452294419cc60dba26e2.jpg";
  // secondImageRef = "2023-04-27-00-02-05-133157-4e9f775ae6ca41d59289abc1c46f8eff.jpg";

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFailure, setIsFailure] = useState(false)

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      // Add any action you want to perform when the notification is tapped
      // Clicking on the notification will open the browser to the morphed url
      const url = response.notification.request.content.data.url;

      if (url) {
        WebBrowser.openBrowserAsync(url); // auto open morph when notification is clicked
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function getMorphResponse(morphUri) {
    if (!morphUri) {
      return
    }

    WebBrowser.openBrowserAsync(morphUri);
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

    // Call registerForPushNotificationsAsync here
    const pushToken = await registerForPushNotificationsAsync();

    if (pushToken) {
      setExpoPushToken(pushToken);
    } else {
      // If the user does not grant notification permissions, you can decide how to handle it (e.g., show an alert)
      // set expo push token to a string indicating that the user did not grant permissions
      console.log('User did not grant permissions for notifications')
    }

    try {
      const data = new FormData();
      const token = await SecureStore.getItemAsync(ID_TOKEN_KEY);
      data.append("firstImageRef", firstImageRef);
      data.append("secondImageRef", secondImageRef);
      data.append("isAsync", "True");
      data.append("clientId", "ios-MyMorph");
      data.append("isSequence", "True"); // See Readme TODO section for more info
      data.append("stepSize", "10"); // 5 looks incredible, 20 looks bad, isSequence must be set to True
      data.append("expoPushToken", expoPushToken);
    
      setIsLoading(true);
      setIsSuccess(false);
      setIsFailure(false);
      setMorphResponse(null);
    
      const response = await fetch(morph_endpoint, {
        method: "POST",
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: data,
      });
    
      if (response.ok) {
        const resJson = await response.json();
        console.log('resJson', resJson)
        // On success, hide the loading spinner
        setIsLoading(false);
        setIsSuccess(true);
        setIsFailure(false);
        setMorphResponse(resJson);
    
        return resJson.data;
      } else {
        throw new Error(response);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsSuccess(false);
      setIsFailure(true);
      setMorphResponse(null);
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
      morph_uri = morphResponse.morphUri;
      morph_id = morphResponse.morphId;

      const morph_status_link = `${morph_status_webpage}/${morph_id}`;

      return (
        <View>
          <StyledButton
            mode='outlined'
            onPress={() => setInitialMorphState()}
            labelStyle={{ color: 'red' }}
            style={styles.restartStyle}
          >
            Restart
          </StyledButton>
          {
            morph_uri &&
            <StyledButton
              mode='outlined'
              onPress={() => getMorphResponse(morph_status_link)}
              style={styles.restartStyle}
            >
              Morph Status
            </StyledButton>
          }
          {expoPushToken && <Text>We'll notify you when your morph is ready!</Text>}
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
