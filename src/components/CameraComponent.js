import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import VisionCamera from '../assets/Vision_Camera';
import styles from '../styles/Vision_Camera_Style';
import Tts from 'react-native-tts';

// TTS 음성 출력 함수
const speakMode = (mode) => {
  Tts.stop();  // 기존 음성 중단
  Tts.speak(`${mode} 모드로 전환되었습니다.`);
};

export default function CameraComponent() {
  const [mode, setMode] = useState('AI 분석');  // 기본 모드

  const handleCapture = async (uri) => {

    console.log(`현재 모드: ${mode}`);
    
    let apiUrl;
    if (mode === 'AI 분석') {
      apiUrl = 'http://34.169.89.14:3000/analyze-photo';
    } else if (mode === '색상 인식') {
      apiUrl = 'http://34.169.89.14:3000/color-photo';
    } else if (mode === '글자 인식') {
      apiUrl = 'http://34.169.89.14:3000/text-photo';
    }

    const formData = new FormData();
    formData.append('photo', { uri, type: 'image/jpeg', name: 'photo.jpg' });

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const result = await response.json();
      Alert.alert('분석 결과', result.text);

      // 분석 결과를 음성으로 출력
      speakMode(result.text);
    } catch (error) {
      Alert.alert('오류', '사진 분석에 실패했습니다.');
      speakMode('사진 분석에 실패했습니다.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 카메라 뷰 */}
      <VisionCamera mode={mode} onCapture={handleCapture} />

      {/* 기능 전환 버튼들 */}
      <View style={styles.controls}>
        <TouchableOpacity  accessibilityLabel="AI 분석" accessibilityRole="button"
          onPress={() => { setMode('AI 분석'); speakMode('AI 분석'); }}
          style={[
            styles.button,
            mode === 'AI 분석' && styles.selectedButton,  // 선택된 버튼에 스타일 적용
          ]}
        >
          <Text style={styles.buttonText}>AI 분석</Text>
        </TouchableOpacity>

        <TouchableOpacity   accessibilityLabel="색상 인식" accessibilityRole="button"
          onPress={() => { setMode('색상 인식'); speakMode('색상 인식'); }}
          style={[
            styles.button,
            mode === '색상 인식' && styles.selectedButton,  // 선택된 버튼에 스타일 적용
          ]}
        >
          <Text style={styles.buttonText}>색상 인식</Text>
        </TouchableOpacity>

        <TouchableOpacity   accessibilityLabel="글자 인식" accessibilityRole="button"
          onPress={() => { setMode('글자 인식'); speakMode('글자 인식'); }}
          style={[
            styles.button,
            mode === '글자 인식' && styles.selectedButton,  // 선택된 버튼에 스타일 적용
          ]}
        >
          <Text style={styles.buttonText}>글자 인식</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
