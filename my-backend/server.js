const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs'); // fs 모듈 불러오기
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType,
    },
  };
}

app.post('/analyze-photo', upload.single('photo'), async (req, res) => {
  const photoPath = req.file.path;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = "이 사진을 분석해줘. :";
    const imageParts = [fileToGenerativePart(photoPath, req.file.mimetype)];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = await response.text();

    // 서버 콘솔에 분석 결과 출력
    console.log('분석 결과:', text);

    // 클라이언트에 결과 전송
    res.json({ text });

    // 분석 후 파일 삭제
    fs.unlinkSync(photoPath);
  } catch (error) {
    console.error('사진 분석 오류:', error);
    res.status(500).json({ error: '사진 분석에 실패했습니다.' });
  }
});

app.post('/color-photo', upload.single('photo'), async (req, res) => {
  const photoPath = req.file.path;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = "이 사진에 있는 사물의 색상을 분석해줘. :";
    const imageParts = [fileToGenerativePart(photoPath, req.file.mimetype)];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = await response.text();

    // 서버 콘솔에 분석 결과 출력
    console.log('분석 결과:', text);

    // 클라이언트에 결과 전송
    res.json({ text });

    // 분석 후 파일 삭제
    fs.unlinkSync(photoPath);
  } catch (error) {
    console.error('사진 분석 오류:', error);
    res.status(500).json({ error: '사진 분석에 실패했습니다.' });
  }
});

app.post('/text-photo', upload.single('photo'), async (req, res) => {
  const photoPath = req.file.path;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = "이 사진에 있는 문자를 인식해서 읽어줘. :";
    const imageParts = [fileToGenerativePart(photoPath, req.file.mimetype)];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = await response.text();

    // 서버 콘솔에 분석 결과 출력
    console.log('분석 결과:', text);

    // 클라이언트에 결과 전송
    res.json({ text });

    // 분석 후 파일 삭제
    fs.unlinkSync(photoPath);
  } catch (error) {
    console.error('사진 분석 오류:', error);
    res.status(500).json({ error: '사진 분석에 실패했습니다.' });
  }
});

app.listen(3000, () => {
  console.log('서버가 3000번 포트에서 실행 중입니다.');
});
