import React from 'react';
import { Text, View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native';

const VoiceScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}
    >
      <TouchableOpacity
        accessibilityLabel="음성검색 버튼"
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: 'dodgerblue',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          // Add your voice recording logic here
          console.log('Voice recording started');
        }}
      >
        <Image
          source={require('../images/microphone.png')} // Replace with your microphone image source
          style={{ width: 50, height: 50 }}
        />
      </TouchableOpacity>
      <Text style={{ color: 'white', fontSize: 20 , marginTop: 30}}>
        음성 검색을 하기위해
      </Text>
      <Text style={{ color: 'white', fontSize: 20}}>
        위 버튼을 눌러주세요.
      </Text>
    </View>
  );
};

export default VoiceScreen;
