// src/components/KakaoLogin.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const KakaoLogin = () => {
  const navigate = useNavigate();


  

  const handleKakaoLogin = () => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('9d4b026f1d1ee43003937064e3b1e8ed');
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
                //console.log('로그인 성공:', data);
                console.log(`로그인 성공: ${data.nickname || kakaoAccount.profile.nickname}`);
                //console.log('이동할 경로: /quiz');
                navigate('/quiz');
              });
          },
          fail: function (error) {
            console.error('사용자 정보 요청 실패:', error);
          },
        });
      },
      fail: function (err) {
        console.error('로그인 실패:', err);
      },
    });
  };

  return (
    <button className="kakao-button" onClick={handleKakaoLogin}>
      카카오로 시작하기
    </button>
  );
};

export default KakaoLogin;
