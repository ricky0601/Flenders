import React, {useState, useRef, useEffect} from 'react';
import {Text, View, Animated, TouchableOpacity, StyleSheet} from 'react-native';

const Third = () => {
  const [progress, setProgress] = useState(0); // 셋팅
  const [pressIn, setPressIn] = useState(false);
 
 
  let animation = useRef(new Animated.Value(0));
 
  const width = animation.current.interpolate({
    inputRange: [0, 10], // 셋팅
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });
 
  useEffect(() => {
    Animated.timing(animation.current, {
      toValue: progress,
      useNativeDriver: false,
      duration: pressIn ? 2000 : 0,
    }).start();
  }, [pressIn]);
 
  return (
    <>
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}
    >
      <TouchableOpacity
        style={{
          height: 100,
          backgroundColor: '#ffffff',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPressIn={() => [setPressIn(true), setProgress(10)]}
        onPressOut={() => [setPressIn(false), setProgress(0)]}
        delayLongPress={2000}
        onLongPress={() => console.log("성공")}
        activeOpacity={1}>
        <View style={[styles.progressBar, styles.absoluteFill]}>
          <Animated.View
            style={{backgroundColor: '#888888', width, opacity: 0.2}}>
            <Text
              style={{
                color: '#888888',
                height: 100,
              }}></Text>
          </Animated.View>
        </View>
        <Text style={{ color: '#888888'}}>
         꾹 누르면 게이지가 찹니다.
        </Text>
        <Text style={{ color: '#888888', marginTop: 10}}>
         꾹 누르면 게이지가 찹니다.
        </Text>
      </TouchableOpacity>
      </View>
    </>
  );
};
 
const styles = StyleSheet.create({
  absoluteFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  progressBar: {
    width: 100,
    zIndex: 1,
    backgroundColor: '#ffffff',
  },
});

export default Third;