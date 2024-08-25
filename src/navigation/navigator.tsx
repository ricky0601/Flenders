import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CameraScreen from '../screens/CameraScreen';
import ColorRecognitionScreen from '../screens/ColorRecognitionScreen';
import TextReadingScreen from '../screens/TextReadingScreen';

const Tab = createMaterialTopTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 18, fontWeight: 'bold' }, // 탭 라벨 스타일 (크기와 굵기)
        tabBarActiveTintColor: '#FFD700', // 활성화된 탭의 텍스트 색상 (금색)
        tabBarInactiveTintColor: '#FFF', // 비활성화된 탭의 텍스트 색상 (흰색)
        tabBarStyle: { backgroundColor: '#000' }, // 탭 바의 배경색 (검정색)
        tabBarIndicatorStyle: {
          backgroundColor: '#FFD700', // 활성화된 탭 아래의 인디케이터 색상 (금색)
          height: 4, // 인디케이터 높이
        },
      }}>
      <Tab.Screen name="AI 카메라" component={CameraScreen} />
      <Tab.Screen name="색상 인식" component={ColorRecognitionScreen} />
      <Tab.Screen name="글자 인식" component={TextReadingScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}
