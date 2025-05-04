import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const KakaoLogin = () => {
  const navigate = useNavigate();
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // ✅ 윶니니 앱 키로 교체됨
  const KAKAO_APP_KEY = '67695b4f0cc321dc89daa86034682e80';

  // 1. SDK 로드 여부 확인
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_APP_KEY);
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

            fetch('http://localhost:3000/kakao-login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userData),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log(`✅ 로그인 성공: ${data.nickname || kakaoAccount.profile.nickname}`);
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
    <button className="kakao-button" onClick={handleKakaoLogin} disabled={!sdkLoaded}>
      카카오로 시작하기
    </button>
  );
};

export default KakaoLogin;
