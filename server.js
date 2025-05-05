require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // 모든 도메인 허용
app.use(express.json()); // JSON 파싱 허용
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 서빙

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

// ✅ 첫 화면 (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ 서버 실행
app.listen(port, '0.0.0.0', () => {
  console.log(`서버가 포트 ${port}번에서 외부 접속 가능하게 실행 중!`);
});

// 전체 사용자 수 가져오기
app.get('/user-count', (req, res) => {
  const countQuery = 'SELECT COUNT(*) AS count FROM users';
  db.query(countQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'DB 오류 (user-count)' });  // ✅ 문자열 대신 JSON 응답!
    }
    res.json({ count: results[0].count });
  });
});

