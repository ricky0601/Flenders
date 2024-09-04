import { Camera, useCameraDevices } from 'react-native-vision-camera';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Animated, TouchableOpacity, Text, Alert } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import styles from '../styles/Vision_Camera_Style';
import Tts from 'react-native-tts';

export default function VisionCamera({ mode, onCapture }) {
  const cameraRef = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const [zoom, setZoom] = useState(0);  // 줌 상태
  const [tapCoords, setTapCoords] = useState({ x: 0, y: 0 });  // 포커스 위치
  const [showFocusRing, setShowFocusRing] = useState(false);  // 포커스 링 표시 여부
  const baseZoom = useRef(0);  // 줌 초기 상태

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      if (permission === 'denied') {
        Alert.alert('카메라 권한이 필요합니다.');
      }
    };
    requestPermission();
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

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({ qualityPrioritization: 'speed' });
      if (onCapture) onCapture(photo.path);
    }
  };

  if (device == null) return <Text>로딩 중...</Text>;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={tapGesture}>
        <GestureDetector gesture={handlePinchGesture}>
          <View style={{ flex: 1 }}>
            <Camera
              ref={cameraRef}
              style={{ flex: 1 }}
              device={device}
              isActive={true}
              photo={true}
              zoom={zoom}  // 카메라 줌 상태 반영
            />
            {showFocusRing && (
              <Animated.View
                style={[
                  styles.focusRing,  // 스타일 파일에서 가져온 focusRing 스타일 사용
                  {
                    left: tapCoords.x - 25,  // 중심점을 계산해 원 위치 설정
                    top: tapCoords.y - 25,
                    opacity: fadeAnim,
                  },
                ]}
              />
            )}
          </View>
        </GestureDetector>
      </GestureDetector>
      <TouchableOpacity onPress={takePhoto} style={styles.cameraButton} accessibilityLabel="사진 촬영" accessibilityRole="button">
        <Text style={styles.buttonText}>사진 촬영</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.cameraButtonText}>위 버튼을 눌러 사진을 촬영하세요</Text>
      </View>
    </GestureHandlerRootView>
  );
}
