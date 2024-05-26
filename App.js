import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, SafeAreaView} from 'react-native';
import AppNavigator from './src/navigation/navigator';
import SplashScreen from 'react-native-splash-screen';

export default function App() {
  
  // 첫 실행 화면 종료
  useEffect(() => {

    SplashScreen.hide();
  
    //1초 후에 첫 실행 화면 종료
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  
  }, []);
 
  return (
   <>
     <SafeAreaView />
    <View
      style={{
        justifyContent: 'center',
        backgroundColor:'white',
        alignItems: 'center',
        paddingTop: 20,
      }}>
      <Text style={{color: 'black', fontSize: 20, fontWeight: 'bold'}}>Flenders</Text>
    </View>
     <AppNavigator />
   </>
 );
}