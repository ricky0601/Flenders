import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Alert, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useFocusEffect } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import styles from '../styles/Vision_Camera_Style';
import Tts from 'react-native-tts';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';

export default function TextReadingScreen() {
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [zoom, setZoom] = useState(0);
  const [tapCoords, setTapCoords] = useState({ x: 0, y: 0 });
  const [showFocusRing, setShowFocusRing] = useState(false);
  const baseZoom = useRef(0);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    React.useCallback(() => {
      setIsActive(true);
      return () => {
        setIsActive(false);
      };
    }, [])
  );

  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      if (permission === 'denied') await Linking.openSettings();
    };

    requestCameraPermission();
  }, []);

  const handlePinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      const newZoom = Math.max(0, Math.min(baseZoom.current + (event.scale - 1) * 1.8, device.maxZoom ?? 1));
      setZoom(newZoom);
    })
    .onEnd(() => {
      baseZoom.current = zoom;
    });

  const handleTapToFocus = useCallback(({ x, y }) => {
    setTapCoords({ x, y });
    setShowFocusRing(true);

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setShowFocusRing(false));

    const camera = cameraRef.current;
    if (camera) {
      camera.focus({ x, y });
    }
  }, [fadeAnim]);

  const tapGesture = Gesture.Tap().onEnd((event) => {
    const { x, y } = event;
    handleTapToFocus({ x, y });
  });

  const saveToGallery = async (filePath) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: '저장소 권한 필요',
            message: '이 앱이 사진을 갤러리에 저장하려면 저장소 권한이 필요합니다.',
            buttonNeutral: '나중에 묻기',
            buttonNegative: '취소',
            buttonPositive: '확인',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const fileName = `IMG_${Date.now()}.jpg`;
          const destPath = `${RNFS.PicturesDirectoryPath}/${fileName}`;

          await RNFS.moveFile(filePath, destPath);
          await RNFS.scanFile(destPath);
          Alert.alert('성공', '사진이 갤러리에 저장되었습니다!');
          
          return destPath;
        } else {
          Alert.alert('오류', '저장소 권한이 거부되었습니다.');
          return null;
        }
      }
    } catch (error) {
      console.error('갤러리에 사진 저장 중 오류 발생:', error);
      Alert.alert('오류', '사진을 갤러리에 저장하지 못했습니다.');
      return null;
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'speed',
      });
      setLoading(true);
      const savedPath = await saveToGallery(photo.path);
      if (savedPath) {
        const resizedPhoto = await ImageResizer.createResizedImage(savedPath, 800, 600, 'JPEG', 80);
        await analyzePhoto(resizedPhoto.uri);
        console.log('사진이 성공적으로 촬영 및 저장되었습니다.');
      }
      setLoading(false);
    }
  };

  const analyzePhoto = async (photoPath) => {
    try {
      const formData = new FormData();
      formData.append('photo', {
        uri: 'file://' + photoPath,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await fetch('http://34.105.81.56:3000/text-photo', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      Alert.alert('분석 결과', result.text);
      Tts.speak(result.text);
    } catch (error) {
      console.error('사진 분석 실패:', error);
      Alert.alert('오류', '사진을 분석하지 못했습니다.');
      Tts.speak('사진 분석에 실패했습니다.');
    }
  };

  if (device == null || !isActive) return <View><Text>로딩 중...</Text></View>;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={tapGesture}>
        <GestureDetector gesture={handlePinchGesture}>
          <View style={{ flex: 1 }}>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              device={device}
              isActive={isActive}
              photo={true}
              zoom={zoom}
            />
            {showFocusRing && (
              <Animated.View
                style={{
                  position: 'absolute',
                  left: tapCoords.x - 25,
                  top: tapCoords.y - 25,
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: 'white',
                  opacity: fadeAnim,
                }}
              />
            )}
          </View>
        </GestureDetector>
      </GestureDetector>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={takePhoto} accessibilityLabel="카메라 버튼">
          <Text style={styles.buttonText}>사진 촬영</Text>
        </TouchableOpacity>
        <Text style={styles.label}>버튼을 눌러 사진을 촬영하세요</Text>
      </View>
      {loading && <ActivityIndicator size="large" color="#FFD700" />}
    </GestureHandlerRootView>
  );
}
