const express = require('express');
const axios = require('axios');
const router = express.Router();

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/naver/callback';

router.get('/naver/callback', async (req, res) => {
  const { code, state } = req.query;

  try {
    // 액세스 토큰 요청
    const tokenResponse = await axios.get('https://nid.naver.com/oauth2.0/token', {
      params: {
        grant_type: 'authorization_code',
        client_id: NAVER_CLIENT_ID,
        client_secret: NAVER_CLIENT_SECRET,
        code,
        state,
      },
    });

    const { access_token } = tokenResponse.data;

    // 사용자 정보 요청
    const userResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { id, nickname } = userResponse.data.response;

    // 사용자 정보 저장 또는 처리
    // 예: DB에 저장 또는 세션 생성

    res.redirect('/dashboard'); // 로그인 후 리디렉션할 경로
  } catch (error) {
    console.error('네이버 로그인 오류:', error);
    res.status(500).send('로그인 중 오류가 발생했습니다.');
  }
});

module.exports = router;
