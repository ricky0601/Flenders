/*
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import Loading from '../screens/Loading';
import { useAppState } from '@react-native-community/hooks';
import { useIsFocused } from '@react-navigation/native';

function VisionCamera() {
  const isFocused = useIsFocused();
  const appState = useAppState();
  const isActive = isFocused && appState === "active";
  const devices = useCameraDevices();
  const [cameraType, setCameraType] = useState('back');
  const device = devices[cameraType];
  const camera = useRef(null);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      if (status !== 'authorized') {
        Alert.alert('Camera Permission', 'Camera access is required to use this feature.', [
          { text: 'OK' },
        ]);
      }
    })();
  }, []);

  const takePicture = async () => {
    try {
      if (camera.current) {
        const photo = await camera.current.takePhoto({
          flash: 'auto',
        });
        console.log('Photo taken:', photo);
        Alert.alert('Success', 'Photo taken successfully!');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const toggleCameraType = () => {
    setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
  };    //카메라 전환 기능 아직은 필요성 못느낌

  if (device == null) return <Loading />;

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={true}
      />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture} accessibilityLabel="카메라 버튼"/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'gray',
    marginBottom: 20,
  },
  toggleButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default VisionCamera;
*/
