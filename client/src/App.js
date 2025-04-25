import React from 'react';
import './App.css'; // App.css는 src/ 안에 있어야 함!

import earthImg from './assets/earth.webp';    // ✅ 수정된 부분 (파일명 바뀐 거 반영!)
import googleImg from './assets/google.webp';
import naverImg from './assets/naver.png';

function App() {
  return (
    <div className="App">
      <h1>여행용 MBTI가 따로 있다고?</h1>
      <h2>나의 여행은</h2>
      <img src={earthImg} alt="earth" width="300" />
      <div>
        <button className="kakao-button">카카오로 시작하기</button>
      </div>
      <p>## 명이 이미 참여했어요!</p>
      <div className="login-icons">
        <img src={googleImg} alt="Google Login" width="50" />
        <img src={naverImg} alt="Naver Login" width="50" />
      </div>
    </div>
  );
}

export default App;
