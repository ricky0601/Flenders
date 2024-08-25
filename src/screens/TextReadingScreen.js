import React, { useRef, useState, useEffect } from 'react';
import { View, Alert, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useFocusEffect } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import styles from '../styles/Vision_Camera_Style';
import Tts from 'react-native-tts';

export default function TextReadingScreen() {
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true); // 카메라 활성화 상태 관리

  useFocusEffect(
    React.useCallback(() => {
      setIsActive(true); // 화면이 포커스될 때 카메라 활성화
      return () => {
        setIsActive(false); // 화면 포커스 해제 시 카메라 비활성화
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

  // 분석 결과를 음성으로 안내
const analyzePhoto = async (photoPath) => {
  try {
    const formData = new FormData();
    formData.append('photo', {
      uri: 'file://' + photoPath,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    const response = await fetch('http://172.30.1.72:3000/text-photo', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = await response.json();
    Alert.alert('분석 결과', result.text);
    Tts.speak(result.text);  // 분석 결과를 음성으로 출력
  } catch (error) {
    console.error('사진 분석 실패:', error);
    Alert.alert('오류', '사진을 분석하지 못했습니다.');
    Tts.speak('사진 분석에 실패했습니다.');
  }
};

  if (device == null || !isActive) return <View><Text>로딩 중...</Text></View>;

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={takePhoto} accessibilityLabel="카메라 버튼">
          <Text style={styles.buttonText}>사진 촬영</Text>
        </TouchableOpacity>
        <Text style={styles.label}>버튼을 눌러 사진을 촬영하세요</Text>
      </View>
      {loading && <ActivityIndicator size="large" color="#FFD700" />}
    </View>
  );
}
