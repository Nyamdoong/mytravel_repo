const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');
const fetch = require('node-fetch'); // ✅ GPT 요청 위해 필요
require('dotenv').config(); // ✅ .env에서 API 키 불러오기

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '3009',
  database: 'travel_mbti'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
    return;
  }
  console.log('MySQL 연결 성공!');
});



// app.post('/api/recommend-course', async (req, res) => {
//   const { mbti, region } = req.body;

//   const prompt = `당신은 여행 가이드입니다. 사용자의 MBTI는 ${mbti}이고 여행지는 ${region}입니다.
// 유형 설명에 맞는 1일 여행 코스를 추천해 주세요. 구성: 숙소, 카페, 산책로.`;

//   try {
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: prompt }],
//         temperature: 0.8
//       })
//     });

//     const data = await response.json();
    
//     // ✅ 추가된 부분: GPT 응답 전체 확인
//     console.log('GPT API 응답 전체:', JSON.stringify(data, null, 2));

//     if (data.choices && data.choices.length > 0) {
//       res.json({ course: data.choices[0].message.content }); // 성공적으로 응답 처리
//     } else {
//       res.status(500).json({ error: 'GPT 응답에서 코스를 찾을 수 없습니다.' });
//     }
//   } catch (err) {
//     console.error('GPT API 호출 실패:', err);
//     res.status(500).json({ error: 'GPT 추천 실패' });
//   }
// });

// server.js (또는 recommend-course 라우터 안)
app.post('/api/recommend-course', async (req, res) => {
  const { mbti, region } = req.body;

  const prompt = `당신은 여행 가이드입니다. 사용자의 MBTI는 ${mbti}이고 여행지는 ${region}입니다.
사용자에게 한국어로 친절하고 자세하게 1일 여행 코스를 추천해 주세요. 구성: 숙소, 카페, 산책로.`;


//   const prompt = `당신은 여행 가이드입니다. 사용자의 MBTI는 ${mbti}이고 여행지는 ${region}입니다.
// 유형 설명에 맞는 1일 여행 코스를 한국어로 추천해 주세요. 구성: 숙소, 카페, 산책로.`;

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


// 질문 리스트 GET
app.get('/questions', (req, res) => {
  db.query('SELECT * FROM questions', (err, results) => {
    if (err) {
      res.status(500).send('DB 오류');
      return;
    }
    res.json(results);
  });
});

// 결과 계산 POST
app.post('/result', (req, res) => {
  const answers = req.body.answers;
  if (!answers || answers.length !== 6) {
    return res.status(400).send('답변 6개가 필요합니다.');
  }

  const mbtiCount = { J: 0, P: 0, A: 0, R: 0, U: 0, N: 0 };

  db.query('SELECT * FROM questions', (err, questions) => {
    if (err) return res.status(500).send('DB 오류');

    questions.forEach((q, index) => {
      const selectedType = answers[index] === 1 ? q.type1 : q.type2;
      mbtiCount[selectedType]++;
    });

    const mbti = 
      (mbtiCount.J >= mbtiCount.P ? 'J' : 'P') +
      (mbtiCount.A >= mbtiCount.R ? 'A' : 'R') +
      (mbtiCount.U >= mbtiCount.N ? 'U' : 'N');

    db.query('SELECT * FROM results WHERE mbti = ?', [mbti], (err, resultData) => {
      if (err) return res.status(500).send('DB 오류');
      if (resultData.length === 0) return res.status(404).send('해당 MBTI 결과가 없습니다.');
      res.json({ mbti, result: resultData[0] });
    });
  });
});

// 카카오 로그인 처리
app.post('/kakao-login', (req, res) => {
  const { id, nickname } = req.body;

  const checkQuery = 'SELECT * FROM users WHERE kakao_id = ?';
  db.query(checkQuery, [id], (err, results) => {
    if (err) return res.status(500).send('DB 오류');

    if (results.length === 0) {
      const insertQuery = 'INSERT INTO users (kakao_id, nickname) VALUES (?, ?)';
      db.query(insertQuery, [id, nickname], (err) => {
        if (err) return res.status(500).send('삽입 실패');
        res.json({ message: '회원 등록 완료' });
      });
    } else {
      res.json({ message: '이미 등록된 사용자' });
    }
  });
});

// 첫 화면
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 실행
app.listen(port, '0.0.0.0', () => {
  console.log(`서버가 포트 ${port}번에서 외부 접속 가능하게 실행 중!`);
});



// const express = require('express');
// const mysql = require('mysql2');
// const path = require('path');

// const app = express();
// const port = 3000;
// const cors = require('cors');
// app.use(cors());  // 모든 도메인에서의 요청을 허용


// // POST로 JSON 받을 때 꼭 필요!
// app.use(express.json());

// // 프론트(static) 연결 (public 폴더에 index.html 있어야 함)
// app.use(express.static(path.join(__dirname, 'public')));

// // MySQL 연결 설정
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

// // 질문 리스트 GET (질문 가져오기)
// app.get('/questions', (req, res) => {
//   db.query('SELECT * FROM questions', (err, results) => {
//     if (err) {
//       res.status(500).send('DB 오류');
//       return;
//     }
//     res.json(results);
//   });
// });

// // 결과 계산 POST (MBTI 결과 계산)
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

//     // MBTI 계산 로직
//     const mbti = 
//       (mbtiCount.J >= mbtiCount.P ? 'J' : 'P') +
//       (mbtiCount.A >= mbtiCount.R ? 'A' : 'R') +
//       (mbtiCount.U >= mbtiCount.N ? 'U' : 'N');

//     // 결과 테이블에서 MBTI 결과 가져오기
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

// // 카카오 로그인 처리
// app.post('/kakao-login', (req, res) => {
//   const { id, nickname } = req.body;
//   console.log(req.body);

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

// // 첫 화면 index.html로 연결
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // 외부 접속 가능하게 listen
// app.listen(port, '0.0.0.0', () => {
//   console.log(`서버가 포트 ${port}번에서 외부 접속 가능하게 실행 중!`);
// });

