import React, { useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import UnifiedCameraScreen from './src/screens/UnifiedCameraScreen';

export default function App() {
  // 첫 실행 화면 종료
  useEffect(() => {
    SplashScreen.hide();

    // 1초 후에 첫 실행 화면 종료
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: 'black' }} />
      <View
        style={{
          justifyContent: 'center',
          backgroundColor: 'black',
          alignItems: 'center',
          paddingTop: 20,
          paddingBottom: 20,
        }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold' }}>Flenders</Text>
      </View>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        {/* 통합된 카메라 화면 */}
        <UnifiedCameraScreen />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
