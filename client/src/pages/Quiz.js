import React, { useEffect, useState } from 'react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);

  // 백엔드에서 질문 받아오기
  useEffect(() => {
    fetch('http://서버-IP:포트/questions')   // 👉 여기 서버 주소 제대로 넣어줘야 해!
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  return (
    <div className="quiz-container">
      <h1>나의 여행 성격 알아보기 ✈️</h1>
      {questions.length === 0 ? (
        <p>질문을 불러오는 중입니다...</p>
      ) : (
        <ul>
          {questions.map((q) => (
            <li key={q.id}>
              <h3>{q.question}</h3>
              <button>{q.option1}</button>
              <button>{q.option2}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Quiz;
