import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Intro.css';

import earthImg from '../assets/earth.webp';
import googleImg from '../assets/google.webp';
import naverImg from '../assets/naver.png';

const Intro = () => {
  const navigate = useNavigate();
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('67695b4f0cc321dc89daa86034682e80'); // ✅ 너의 앱 키
      console.log('✅ Kakao SDK initialized');
    }

    if (window.Kakao) {
      setSdkLoaded(true);
    } else {
      console.error('❌ Kakao SDK is not loaded yet.');
    }
  }, []);

  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      alert('카카오 SDK가 아직 로드되지 않았습니다.');
      return;
    }

    window.Kakao.Auth.login({
      scope: 'profile_nickname',
      success: function (authObj) {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: function (res) {
            const kakaoAccount = res.kakao_account;
            const userData = {
              id: res.id,
              nickname: kakaoAccount.profile.nickname,
            };

            // 서버에 사용자 정보 전달 (원한다면)
            fetch('http://localhost:3000/kakao-login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userData),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log(`✅ 로그인 성공: ${data.nickname || userData.nickname}`);
                navigate('/quiz');
              });
          },
          fail: function (error) {
            console.error('❌ 사용자 정보 요청 실패:', error);
          },
        });
      },
      fail: function (err) {
        console.error('❌ 로그인 실패:', err);
      },
    });
  };

  return (
    <div className="intro-container">
      <h1>여행용 MBTI가 따로 있다고?</h1>
      <h2>나의 여행은</h2>
      <img src={earthImg} alt="earth" width="300" />
      <div>
        <button className="kakao-button" onClick={handleKakaoLogin} disabled={!sdkLoaded}>
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
