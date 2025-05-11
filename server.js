require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch'); // ✅ GPT 요청 위해 필요

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ MySQL 연결
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
    return;
  }
  console.log('MySQL 연결 성공!');
});

// ✅ GPT 추천 API (Groq)
app.post('/api/recommend-course', async (req, res) => {
  const { mbti, region } = req.body;

  const prompt = `당신은 여행 가이드입니다. 사용자의 MBTI는 ${mbti}이고 여행지는 ${region}입니다.
사용자에게 한국어로 친절하고 자세하게 1일 여행 코스를 추천해 주세요. 구성: 숙소, 카페, 산책로.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log('Groq 응답:', data);

    if (data.choices && data.choices.length > 0) {
      res.json({ course: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: '추천 결과가 없습니다.' });
    }
  } catch (err) {
    console.error('Groq API 호출 실패:', err);
    res.status(500).json({ error: '추천 생성 실패' });
  }
});

// ✅ 질문 리스트 GET
app.get('/questions', (req, res) => {
  db.query('SELECT * FROM questions', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'DB 오류 (questions)' });
    }
    res.json(results);
  });
});

// ✅ 결과 계산 POST
app.post('/result', (req, res) => {
  const answers = req.body.answers;

  if (!answers || answers.length !== 6) {
    return res.status(400).json({ error: '답변 6개가 필요합니다.' });
  }

  const mbtiCount = { J: 0, P: 0, A: 0, R: 0, U: 0, N: 0 };

  db.query('SELECT * FROM questions', (err, questions) => {
    if (err) {
      return res.status(500).json({ error: 'DB 오류 (questions 불러오기)' });
    }

    questions.forEach((q, index) => {
      const selectedType = answers[index] === 1 ? q.type1 : q.type2;
      mbtiCount[selectedType]++;
    });

    const mbti =
      (mbtiCount.J >= mbtiCount.P ? 'J' : 'P') +
      (mbtiCount.A >= mbtiCount.R ? 'A' : 'R') +
      (mbtiCount.U >= mbtiCount.N ? 'U' : 'N');

    db.query('SELECT * FROM results WHERE mbti = ?', [mbti], (err, resultData) => {
      if (err) {
        return res.status(500).json({ error: 'DB 오류 (results)' });
      }
      if (resultData.length === 0) {
        return res.status(404).json({ error: '해당 MBTI 결과가 없습니다.' });
      }

      res.json({ mbti, result: resultData[0] });
    });
  });
});

// ✅ 카카오 로그인 처리
app.post('/kakao-login', (req, res) => {
  const { id, nickname } = req.body;
  console.log('🔍 로그인 요청 받음:', req.body);
  if (!id || !nickname) {
    return res.status(400).json({ error: '필수 데이터 누락' });
  }

  const checkQuery = 'SELECT * FROM users WHERE kakao_id = ?';
  db.query(checkQuery, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB 오류 (조회)' });

    if (results.length === 0) {
      const insertQuery = 'INSERT INTO users (kakao_id, nickname) VALUES (?, ?)';
      db.query(insertQuery, [id, nickname], (err) => {
        if (err) return res.status(500).json({ error: 'DB 오류 (삽입)' });
        res.json({ message: '회원 등록 완료', nickname });
      });
    } else {
      res.json({ message: '이미 등록된 사용자', nickname: results[0].nickname });
    }
  });
});

// ✅ 사용자 수 조회
app.get('/user-count', (req, res) => {
  const countQuery = 'SELECT COUNT(*) AS count FROM users';
  db.query(countQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'DB 오류 (user-count)' });
    }
    res.json({ count: results[0].count });
  });
});

// ✅ 첫 화면
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ 서버 실행
app.listen(port, '0.0.0.0', () => {
  console.log(`서버가 포트 ${port}번에서 외부 접속 가능하게 실행 중!`);
});

// server.js 하단에 추가
app.post('/api/coords', async (req, res) => {
  const { place } = req.body;

  if (!place) {
    return res.status(400).json({ error: 'place 값이 필요합니다.' });
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(place)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (data.documents.length === 0) {
      return res.status(404).json({ error: '장소를 찾을 수 없습니다.' });
    }

    const { x, y } = data.documents[0]; // x = lng, y = lat
    res.json({ lat: parseFloat(y), lng: parseFloat(x), name: place });
  } catch (err) {
    console.error('좌표 변환 오류:', err);
    res.status(500).json({ error: '좌표 변환 실패' });
  }
});
