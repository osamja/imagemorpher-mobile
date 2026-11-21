import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Button, IconButton, ActivityIndicator, ProgressBar } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import { getToken } from '../../store';
import {
  morph_endpoint,
  morph_status_endpoint,
  ID_TOKEN_KEY,
  QUALITY_PRESETS,
  SPEED_PRESETS,
} from '../../constants/index';
import { QualityPicker } from '../QualityPicker';
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
  progressContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBar: {
    width: '80%',
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  intermediateContainer: {
    maxHeight: 100,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  intermediateImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#eee',
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
  morphSettings,
  setMorphSettings,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);
  const [morphStatus, setMorphStatus] = useState('pending'); // New state for morph status
  const [morphProgress, setMorphProgress] = useState(0); // Progress 0-100
  const [intermediateImages, setIntermediateImages] = useState([]); // Intermediate frame URLs
  const [isFetchingStatus, setIsFetchingStatus] = useState(false); // To disable refresh during status fetch
  const pollingRef = useRef(null);

  async function fetchMorphStatus(morphId) {
    if (!morphId) return;

    setIsFetchingStatus(true);

    try {
      const response = await fetch(`${morph_status_endpoint}/${morphId}`);
      const statusData = await response.json();

      if (response.ok) {
        setMorphStatus(statusData.status);
        if (statusData.progress != null) {
          setMorphProgress(statusData.progress);
        }
        if (statusData.intermediateImages) {
          setIntermediateImages(statusData.intermediateImages);
        }
        if (statusData.status === 'complete' || statusData.status === 'completed') {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
          try {
            await WebBrowser.openBrowserAsync(statusData.morphUri);
          } catch (browserError) {
            console.error('Failed to open browser:', browserError);
            Alert.alert('Error', 'Failed to open morph result. Please try again.');
          }
        }
      } else {
        throw new Error('Failed to fetch morph status');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingStatus(false);
    }
  }

  // Auto-poll morph status every 3 seconds while processing
  useEffect(() => {
    const morphId = morphResponse?.morphId;
    if (!morphId) return;
    fetchMorphStatus(morphId);
    pollingRef.current = setInterval(() => {
      fetchMorphStatus(morphId);
    }, 3000);
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [morphResponse?.morphId]);

  function setInitialMorphState() {
    setFirstImageRef(null);
    setSecondImageRef(null);
    setMorphResponse(null);
    setMorphStatus('pending');
    setMorphProgress(0);
    setIntermediateImages([]);
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
      const qualityPreset = QUALITY_PRESETS.find((p) => p.label === morphSettings.quality);
      const speedPreset = SPEED_PRESETS.find((p) => p.label === morphSettings.speed);
      data.append("stepSize", String(qualityPreset.stepSize));
      data.append("duration", String(speedPreset.duration));

      setIsLoading(true);
      setIsSuccess(false);
      setIsFailure(false);
      setMorphResponse(null);

      const response = await fetch(morph_endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
            <Text style={styles.statusText}>Status: {morphStatus}</Text>
            <IconButton
              icon="refresh"
              mode="contained"
              disabled={isFetchingStatus}
              onPress={() => fetchMorphStatus(morph_id)} // Refresh button to fetch the latest status
            />
            {isFetchingStatus && <ActivityIndicator animating={true} size="small" />}
          </View>
          {morphStatus === 'processing' && (
            <View style={styles.progressContainer}>
              <ProgressBar progress={morphProgress / 100} style={styles.progressBar} />
              <Text style={styles.progressText}>{morphProgress}%</Text>
            </View>
          )}
          {intermediateImages.length > 0 && (
            <ScrollView horizontal style={styles.intermediateContainer} showsHorizontalScrollIndicator={false}>
              {intermediateImages.map((url, index) => (
                <Image key={index} source={{ uri: url }} style={styles.intermediateImage} />
              ))}
            </ScrollView>
          )}
        </View>
      );
    }

    if (firstImageRef && secondImageRef) {
      return (
        <View>
          <QualityPicker
            morphSettings={morphSettings}
            setMorphSettings={setMorphSettings}
          />
          <StyledButton
            mode="outlined"
            onPress={() => getMorph(firstImageRef, secondImageRef)}
          >
            Morph
          </StyledButton>
        </View>
      );
    }
  };

  return getMorphButton();
}
