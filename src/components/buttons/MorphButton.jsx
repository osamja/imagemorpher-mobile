import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import { getToken } from '../../store';
import {
  morph_endpoint,
  morph_status_endpoint,
  ID_TOKEN_KEY,
} from '../../constants/index';
import styled from 'styled-components/native';

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

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  restartStyle: {
    marginBottom: 100,
  },
  statusText: {
    fontSize: 16,
    marginRight: 10,
  },
});

export function MorphButton({
  firstImageRef,
  secondImageRef,
  morphResponse,
  setFirstImageRef,
  setSecondImageRef,
  setMorphResponse,
  handleMorphResetButtonClick,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [morphStatus, setMorphStatus] = useState('pending'); // New state for morph status

  async function fetchMorphStatus(morphId) {
    if (!morphId) return;

    try {
      const response = await fetch(`${morph_status_endpoint}/${morphId}`);
      const statusData = await response.json();

      if (response.ok) {
        setMorphStatus(statusData.status);
        if (statusData.status === 'complete') {
          WebBrowser.openBrowserAsync(statusData.morphUri);
        }
      } else {
        throw new Error('Failed to fetch morph status');
      }
    } catch (error) {
      console.error(error);
    }
  }

  function setInitialMorphState() {
    setFirstImageRef(null);
    setSecondImageRef(null);
    setMorphResponse(null);
    setMorphStatus('pending');
    setIsFailure(false);
    setIsSuccess(false);
    setIsLoading(false);
    handleMorphResetButtonClick();
  }

  async function getMorph(firstImageRef, secondImageRef) {
    if (!firstImageRef || !secondImageRef) {
      return;
    }

    try {
      const data = new FormData();
      const token = await getToken(ID_TOKEN_KEY);
      data.append("firstImageRef", firstImageRef);
      data.append("secondImageRef", secondImageRef);
      data.append("isAsync", "True");
      data.append("clientId", "ios-MyMorph");
      data.append("isSequence", "True");
      data.append("stepSize", "10");

      setIsLoading(true);
      setIsSuccess(false);
      setIsFailure(false);
      setMorphResponse(null);

      const response = await fetch(morph_endpoint, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const resJson = await response.json();
        setIsLoading(false);
        setIsSuccess(true);
        setIsFailure(false);
        setMorphResponse(resJson);

        setMorphStatus('pending'); // Set the status as pending when a morph is created
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
          mode="outlined"
          disabled
          loading
        >
          Loading..
        </StyledButton>
      );
    }

    if (isFailure) {
      return (
        <View>
          <StyledButton
            mode="outlined"
            onPress={() => setInitialMorphState()}
            style={styles.restartStyle}
          >
            Restart
          </StyledButton>
          <StyledButton
            mode="outlined"
            disabled
          >
            Morph Failed
          </StyledButton>
        </View>
      );
    }

    if (!firstImageRef && !secondImageRef) {
      return (
        <StyledButton
          mode="outlined"
          disabled
        >
          Upload first face to morph
        </StyledButton>
      );
    }

    if (firstImageRef instanceof Error) {
      return (
        <StyledButton
          mode="outlined"
          disabled
        >
          Re-upload first image
        </StyledButton>
      );
    }

    if (secondImageRef instanceof Error) {
      return (
        <StyledButton
          mode="outlined"
          disabled
        >
          Re-upload second image
        </StyledButton>
      );
    }

    if (!firstImageRef && secondImageRef) {
      return (
        <StyledButton
          mode="outlined"
          disabled
        >
          Upload the first image
        </StyledButton>
      );
    }

    if (firstImageRef && !secondImageRef) {
      return (
        <StyledButton
          mode="outlined"
          disabled
        >
          Upload the second image
        </StyledButton>
      );
    }

    if (firstImageRef && secondImageRef && morphResponse) {
      const morph_id = morphResponse.morphId;

      return (
        <View>
          <StyledButton
            mode="outlined"
            onPress={() => setInitialMorphState()}
            labelStyle={{ color: 'red' }}
            style={styles.restartStyle}
          >
            Restart
          </StyledButton>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>Morph Status: {morphStatus}</Text>
            <IconButton
              icon="refresh"
              mode="contained"
              onPress={() => fetchMorphStatus(morph_id)} // Refresh button to fetch the latest status
            />
          </View>
        </View>
      );
    }

    if (firstImageRef && secondImageRef) {
      return (
        <StyledButton
          mode="outlined"
          onPress={() => getMorph(firstImageRef, secondImageRef)}
        >
          Morph
        </StyledButton>
      );
    }
  };

  return getMorphButton();
}
