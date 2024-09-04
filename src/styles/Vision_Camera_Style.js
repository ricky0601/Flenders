import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  button: {
    backgroundColor: '#FFD700',
    activeBackgroundColor: '#FF8C00',  // 클릭 시 더 진한 색상
    padding: 20,  // 버튼 패딩을 크게 설정
    borderRadius: 15,  // 더 둥근 모서리
    alignSelf: 'center',
    marginBottom: 30,
    width: '30%',  // 버튼 너비를 넓게 설정하여 터치 영역을 증가
  },
  cameraButton: {
    backgroundColor: '#FFD700',
    padding: 20,  // 버튼 패딩을 크게 설정
    //borderRadius: 15,  // 더 둥근 모서리
    alignSelf: 'center',
    marginBottom: 30,
    width: '100%',  // 버튼 너비를 넓게 설정하여 터치 영역을 증가
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,  // 텍스트 크기 증가
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    top: 5,  // 상단으로 간격 증가
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cameraButtonContainer: {
    position: 'absolute',
    bottom: 0, // 화면 하단에 위치
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cameraButtonText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  focusRing: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },
  selectedButton: {
    backgroundColor: '#FF8C00',  // 선택된 버튼의 진한 배경색
  },
});
