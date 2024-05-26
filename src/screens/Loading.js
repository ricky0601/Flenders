import React from 'react';
import {View, Text} from 'react-native';

const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor:'black',
        alignItems: 'center',
      }}>
      <Text>Loading ...</Text>
    </View>
  );
};
export default Loading;