import React from 'react';
import '../App.css';  // 이제 경로 문제 없음!
import earthImg from '../assets/지구.webp';
import googleImg from '../assets/google.webp';
import naverImg from '../assets/naver.png';

function Intro() {
  return (
    <div className="intro">
      <h1>여행용 MBTI가 따로 있다고?</h1>
      <h2>나의 여행은</h2>
      <img src={earthImg} alt="지구" style={{ width: '200px' }} />
      <button className="start-btn">카카오로 시작하기</button>
      <p>## 명이 이미 참여했어요!</p>
      <div className="social-icons">
        <img src={googleImg} alt="Google" style={{ width: '40px' }} />
        <img src={naverImg} alt="Naver" style={{ width: '40px' }} />
      </div>
    </div>
  );
}

export default Intro;
