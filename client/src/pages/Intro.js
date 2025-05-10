import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Intro.css';

import earthImg from '../assets/earth.webp';
import googleImg from '../assets/google.webp';
import naverImg from '../assets/naver.png';

const Intro = () => {
  const navigate = useNavigate();
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [userCount, setUserCount] = useState(null);

  console.log("✅ Intro 컴포넌트 진입");

  // ✅ 사용자 수 가져오기
  useEffect(() => {
    fetch('http://10.0.10.110:3000/user-count')
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ 사용자 수 불러오기 성공:', data.count);
        setUserCount(data.count);
      })
      .catch((err) => {
        console.error('❌ 사용자 수 불러오기 실패:', err);
      });
  }, []);

  // ✅ 카카오 SDK 초기화
  useEffect(() => {
    console.log('Kakao key:', process.env.REACT_APP_KAKAO_JS_KEY);

    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.REACT_APP_KAKAO_JS_KEY);
      console.log('✅ Kakao SDK initialized');
    }

    if (window.Kakao) {
      setSdkLoaded(true);
    } else {
      console.error('❌ Kakao SDK is not loaded yet.');
    }
  }, []);

  // ✅ 카카오 로그인
  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      alert('카카오 SDK가 아직 로드되지 않았습니다.');
      return;
    }

    window.Kakao.Auth.login({
      scope: 'profile_nickname',
      success: function () {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: function (res) {
            const kakaoAccount = res.kakao_account;
            const userData = {
              id: res.id,
              nickname: kakaoAccount.profile.nickname,
            };

            fetch('http://10.0.10.110:3000/kakao-login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userData),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log(`✅ 로그인 성공: ${data.nickname}`);
                navigate('/quiz');
              })
              .catch((err) => {
                console.error('❌ 로그인 처리 실패:', err);
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

  // ✅ 네이버 로그인
  const handleNaverLogin = () => {
    const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_NAVER_REDIRECT_URI;
    const state = "MYTRAVELSTATE";

    if (!clientId || !redirectUri) {
      console.error("❌ Naver Client ID 또는 Redirect URI가 없습니다.");
      return;
    }

    window.location.href = 
      `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
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
      <p style={{ marginTop: '10px', fontWeight: '500', color: '#555' }}>
        {userCount !== null ? `${userCount}명이 이미 참여했어요!` : '참여자 수 불러오는 중...'}
      </p>
      <div className="login-icons">
        <img src={googleImg} alt="Google Login" className="login-logo" />
        <img src={naverImg} alt="Naver Login" className="login-logo naver" onClick={handleNaverLogin} />
      </div>
    </div>
  );
};

export default Intro;
