import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const KakaoLogin = () => {
  const navigate = useNavigate();
  const [sdkLoaded, setSdkLoaded] = useState(false);

  const KAKAO_APP_KEY = process.env.REACT_APP_KAKAO_JS_KEY;

  useEffect(() => {
    console.log('🧪 현재 .env에서 불러온 Kakao JS 키:', KAKAO_APP_KEY); // ✅ 로그 추가

    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_APP_KEY);
      console.log('✅ Kakao SDK initialized');
    }

    if (window.Kakao) {
      setSdkLoaded(true);
    } else {
      console.error('❌ Kakao SDK is not loaded yet.');
    }
  }, [KAKAO_APP_KEY]);

  console.log('✅ 현재 사용 중인 JS 키:', KAKAO_APP_KEY);
  console.log('✅ 현재 REST API 키:', process.env.REACT_APP_KAKAO_REST_API_KEY);

  const handleKakaoLogin = () => {
    if (!window.Kakao) {
      alert('카카오 SDK가 아직 로드되지 않았습니다.');
      return;
    }
  
    console.log('🧪 로그인 시점 Kakao 객체 초기화 여부:', window.Kakao.isInitialized());
  
    window.Kakao.Auth.login({
      scope: 'profile_nickname',
      success: function (authObj) {
        console.log('✅ 로그인 성공:', authObj);
  
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: function (res) {
            const kakaoAccount = res.kakao_account;
            const userData = {
              id: res.id,
              nickname: kakaoAccount.profile.nickname,
            };
  
            console.log('📦 사용자 정보:', userData);
  
            fetch('http://localhost:3000/kakao-login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userData),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log(`✅ 최종 로그인 처리 완료: ${data.nickname || userData.nickname}`);
                navigate('/quiz');
              })
              .catch((err) => {
                console.error('❌ 백엔드 전송 오류:', err);
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
      // ✅ 명시적 redirectUri 추가
      redirectUri: `${window.location.origin}/kakao-login`
    });
  };
  

  return (
    <button className="kakao-button" onClick={handleKakaoLogin} disabled={!sdkLoaded}>
      카카오로 시작하기
    </button>
  );
};

export default KakaoLogin;
