require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());  // 모든 도메인에서의 요청을 허용


// POST로 JSON 받을 때 꼭 필요!
app.use(express.json());

// 프론트(static) 연결 (public 폴더에 index.html 있어야 함)
app.use(express.static(path.join(__dirname, 'public')));

// MySQL 연결 설정
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
    return;
  }
  console.log('MySQL 연결 성공!');
});

// 질문 리스트 GET (질문 가져오기)
app.get('/questions', (req, res) => {
  db.query('SELECT * FROM questions', (err, results) => {
    if (err) {
      res.status(500).send('DB 오류');
      return;
    }
    res.json(results);
  });
});

// 결과 계산 POST (MBTI 결과 계산)
app.post('/result', (req, res) => {
  const answers = req.body.answers; // 예: [1, 2, 1, 2, 1, 2]

  if (!answers || answers.length !== 6) {
    return res.status(400).send('답변 6개가 필요합니다.');
  }

  const mbtiCount = { J: 0, P: 0, A: 0, R: 0, U: 0, N: 0 };

  db.query('SELECT * FROM questions', (err, questions) => {
    if (err) {
      return res.status(500).send('DB 오류');
    }

    questions.forEach((q, index) => {
      const selectedType = answers[index] === 1 ? q.type1 : q.type2;
      mbtiCount[selectedType]++;
    });

    // MBTI 계산 로직
    const mbti = 
      (mbtiCount.J >= mbtiCount.P ? 'J' : 'P') +
      (mbtiCount.A >= mbtiCount.R ? 'A' : 'R') +
      (mbtiCount.U >= mbtiCount.N ? 'U' : 'N');

    // 결과 테이블에서 MBTI 결과 가져오기
    db.query('SELECT * FROM results WHERE mbti = ?', [mbti], (err, resultData) => {
      if (err) {
        return res.status(500).send('DB 오류');
      }
      if (resultData.length === 0) {
        return res.status(404).send('해당 MBTI 결과가 없습니다.');
      }
      res.json({ mbti, result: resultData[0] });
    });
  });
});

// 카카오 로그인 처리
app.post('/kakao-login', (req, res) => {
  const { id, nickname } = req.body;
  console.log(req.body);

  // 사용자 존재 여부 확인
  const checkQuery = 'SELECT * FROM users WHERE kakao_id = ?';
  db.query(checkQuery, [id], (err, results) => {
    if (err) return res.status(500).send('DB 오류');

    if (results.length === 0) {
      // 새로운 사용자라면 DB에 저장
      const insertQuery = 'INSERT INTO users (kakao_id, nickname) VALUES (?, ?)';
      db.query(insertQuery, [id, nickname], (err) => {
        if (err) return res.status(500).send('삽입 실패');
        res.json({ message: '회원 등록 완료' }); // 등록 완료 메시지
      });
    } else {
      // 이미 등록된 사용자라면
      res.json({ message: '이미 등록된 사용자' });
    }
  });
});

// 첫 화면 index.html로 연결
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 외부 접속 가능하게 listen
app.listen(port, '0.0.0.0', () => {
  console.log(`서버가 포트 ${port}번에서 외부 접속 가능하게 실행 중!`);
});



// const express = require('express');
// const mysql = require('mysql2');
// const path = require('path');

// const app = express();
// const port = 3000;

// // ⭐️ POST로 JSON 받을 때 꼭 필요!
// app.use(express.json());

// // ⭐️ 프론트(static) 연결 (public 폴더에 index.html 있어야 함)
// app.use(express.static(path.join(__dirname, 'public')));

// // ⭐️ MySQL 연결 설정
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '3009',
//   database: 'travel_mbti'
// });

// db.connect((err) => {
//   if (err) {
//     console.error('MySQL 연결 실패:', err);
//     return;
//   }
//   console.log('MySQL 연결 성공!');
// });

// // ✅ 질문 리스트 GET (질문 가져오기)
// app.get('/questions', (req, res) => {
//   db.query('SELECT * FROM questions', (err, results) => {
//     if (err) {
//       res.status(500).send('DB 오류');
//       return;
//     }
//     res.json(results);
//   });
// });

// // ✅ 결과 계산 POST (MBTI 결과 계산)
// app.post('/result', (req, res) => {
//   const answers = req.body.answers; // 예: [1, 2, 1, 2, 1, 2]

//   if (!answers || answers.length !== 6) {
//     return res.status(400).send('답변 6개가 필요합니다.');
//   }

//   const mbtiCount = { J: 0, P: 0, A: 0, R: 0, U: 0, N: 0 };

//   db.query('SELECT * FROM questions', (err, questions) => {
//     if (err) {
//       return res.status(500).send('DB 오류');
//     }

//     questions.forEach((q, index) => {
//       const selectedType = answers[index] === 1 ? q.type1 : q.type2;
//       mbtiCount[selectedType]++;
//     });

//     // ⭐️ MBTI 계산 로직
//     const mbti = 
//       (mbtiCount.J >= mbtiCount.P ? 'J' : 'P') +
//       (mbtiCount.A >= mbtiCount.R ? 'A' : 'R') +
//       (mbtiCount.U >= mbtiCount.N ? 'U' : 'N');

//     // ⭐️ 결과 테이블에서 MBTI 결과 가져오기
//     db.query('SELECT * FROM results WHERE mbti = ?', [mbti], (err, resultData) => {
//       if (err) {
//         return res.status(500).send('DB 오류');
//       }
//       if (resultData.length === 0) {
//         return res.status(404).send('해당 MBTI 결과가 없습니다.');
//       }
//       res.json({ mbti, result: resultData[0] });
//     });
//   });
// });

// app.post('/kakao-login', (req, res) => {
//   const { id, nickname } = req.body;

//   // 사용자 존재 여부 확인
//   const checkQuery = 'SELECT * FROM users WHERE kakao_id = ?';
//   db.query(checkQuery, [id], (err, results) => {
//     if (err) return res.status(500).send('DB 오류');

//     if (results.length === 0) {
//       // 새로운 사용자라면 DB에 저장
//       const insertQuery = 'INSERT INTO users (kakao_id, nickname) VALUES (?, ?)';
//       db.query(insertQuery, [id, nickname], (err) => {
//         if (err) return res.status(500).send('삽입 실패');
//         res.json({ message: '회원 등록 완료' }); // 등록 완료 메시지
//       });
//     } else {
//       // 이미 등록된 사용자라면
//       res.json({ message: '이미 등록된 사용자' });
//     }
//   });
// });


// // ✅ 첫 화면 index.html로 연결 (여기 중요!)
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // ⭐️ 외부 접속 가능하게 listen
// app.listen(port, '0.0.0.0', () => {
//   console.log(`서버가 포트 ${port}번에서 외부 접속 가능하게 실행 중!`);
// });
