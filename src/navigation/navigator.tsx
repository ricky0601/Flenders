import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CameraScreen from '../screens/CameraScreen';
import VoiceScreen from '../screens/VoiceScreen';
import Third from '../screens/Third';

const Tab = createMaterialTopTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarLabelStyle: { fontSize: 16},
    }}>
      <Tab.Screen name="카메라" component={CameraScreen}/>
      <Tab.Screen name="음성 검색" component={VoiceScreen}/>
      <Tab.Screen name="HELP" component={Third}/>
    </Tab.Navigator>
  );
}

export default function AppNavigator () {
  return (
    <NavigationContainer>
        <Tabs />
    </NavigationContainer>
  );
}