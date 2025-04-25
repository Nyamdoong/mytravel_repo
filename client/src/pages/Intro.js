import React from 'react';
import { useNavigate } from 'react-router-dom';   // ← 페이지 이동을 위한 useNavigate!
import './Intro.css';                            // ← CSS 파일 (원래 App.css였던 거 이름 바꿔도 OK)

import earthImg from '../assets/earth.webp';
import googleImg from '../assets/google.webp';
import naverImg from '../assets/naver.png';

const Intro = () => {
  const navigate = useNavigate();                // ← 페이지 이동 기능 사용 준비

  const handleStart = () => {
    navigate('/quiz');                          // ← 버튼 누르면 /quiz 로 이동!
  };

  return (
    <div className="intro-container">
      <h1>여행용 MBTI가 따로 있다고?</h1>
      <h2>나의 여행은</h2>
      <img src={earthImg} alt="earth" width="300" />
      <div>
        <button className="kakao-button" onClick={handleStart}>
          카카오로 시작하기
        </button>
      </div>
      <p>## 명이 이미 참여했어요!</p>
      <div className="login-icons">
        <img src={googleImg} alt="Google Login" width="50" />
        <img src={naverImg} alt="Naver Login" width="50" />
      </div>
    </div>
  );
};

export default Intro;
