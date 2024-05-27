import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Loading from '../screens/Loading';
import { useAppState } from '@react-native-community/hooks';
import { useIsFocused } from '@react-navigation/native';

function VisionCamera() {
  const isFocused = useIsFocused();
  const appState = useAppState();
  const isActive = isFocused && appState === 'active';
  const devices = useCameraDevices();
  const [cameraType, setCameraType] = useState('back');
  const device = devices[cameraType];
  const camera = useRef(null);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      if (status !== 'authorized') {
        Alert.alert('카메라 권한', '이 기능을 사용하려면 카메라 접근 권한이 필요합니다.', [
          { text: '확인' },
        ]);
      }
    })();
  }, []);

  const takePicture = async () => {
    try {
      if (camera.current) {
        const photo = await camera.current.takePhoto();
        const filePath = `file://${photo.path}`;
        await CameraRoll.save(filePath, { type: 'photo' });
        console.log('사진 촬영 완료:', photo);
        Alert.alert('성공', '사진이 성공적으로 촬영되었습니다!');
      }
    } catch (error) {
      console.error('사진 촬영 오류:', error);
      Alert.alert('오류', '사진 촬영에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // const toggleCameraType = () => {
  //   setCameraType((prev) => (prev === 'back' ? 'front' : 'back'));
  // }; 카메라 정면 후면 전환 버튼 아직 필요성 X

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
        <TouchableOpacity style={styles.captureButton} onPress={takePicture} accessibilityLabel="카메라 버튼" />
        {/* <TouchableOpacity style={styles.toggleButton} onPress={toggleCameraType}>
          <Text style={styles.buttonText}>카메라 전환</Text>
        </TouchableOpacity> */}
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
    alignItems: 'flex-end',
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
