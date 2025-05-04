import React from 'react';
import './Intro.css';
import KakaoLogin from '../components/KakaoLogin';
import earthImg from '../assets/earth.webp';

const Intro = () => {
  return (
    <div className="intro-container">
      <div className="intro-subtitle">나에게 딱 맞는 여행은?</div>
      <div className="intro-title">나의 여행은</div>
      <img src={earthImg} alt="earth" className="intro-image" />
      <KakaoLogin />
      <div className="participant-text">이미 10,000명이 참여했어요!</div>
      <div className="login-options">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2111/2111370.png"
          alt="Google Login"
          className="login-logo"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
          alt="Facebook Login"
          className="login-logo"
        />
      </div>
    </div>
  );
};

export default Intro;
