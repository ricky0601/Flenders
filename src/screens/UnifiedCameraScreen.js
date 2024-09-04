import React from 'react';
import { SafeAreaView } from 'react-native';
import CameraComponent from '../components/CameraComponent';
import styles from '../styles/Vision_Camera_Style';

export default function UnifiedCameraScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <CameraComponent />
    </SafeAreaView>
  );
}
