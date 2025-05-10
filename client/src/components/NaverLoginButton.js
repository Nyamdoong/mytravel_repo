import React from 'react';

const NaverLoginButton = () => {
  const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
  const REDIRECT_URI = 'http://localhost:3000/naver/callback';

  const handleLogin = () => {
    const state = Math.random().toString(36).substr(2, 11);
    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;
    window.location.href = url;
  };

  return (
    <button onClick={handleLogin}>
      네이버로 로그인
    </button>
  );
};

export default NaverLoginButton;
