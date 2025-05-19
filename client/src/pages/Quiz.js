// src/pages/Quiz.js
import React, { useState } from 'react';
import './Quiz.css';
import { useNavigate } from 'react-router-dom';

const questions = [
  { question: '여행을 준비할 때 나는...', option1: '계획을 세우고 미리 알아봐야 마음이 편해', option2: '계획보단 그때그때 흐름에 맡기는 게 좋아', type1: 'J', type2: 'P' },
  { question: '여행 스케줄을 세울 때 나는...', option1: '하루를 시간대별로 정리해두고 싶어', option2: '즉흥적으로 움직이고 싶은 순간을 따라가고 싶어', type1: 'J', type2: 'P' },
  { question: '여행 중 예상치 못한 상황이 생기면...', option1: '대비책을 세우는 게 좋아', option2: '계획에 없던 상황도 즐기면 돼', type1: 'J', type2: 'P' },
  { question: '여행의 성격을 선택하세요.', option1: '활동적인 이벤트가 있으면 좋겠어', option2: '좀 쉬어가는 차분한 컨셉이 좋아', type1: 'A', type2: 'R' },
  { question: '액티비티 참여 기회가 있다면?', option1: '바로 도전! 신나는 경험이 좋아', option2: '편하게 구경하거나 쉬고 싶어', type1: 'A', type2: 'R' },
  { question: '나만의 여행 스타일은?', option1: '스릴 있고 도전적인 여행이 좋아', option2: '느긋하고 편안한 여행이 좋아', type1: 'A', type2: 'R' },
  { question: '여행 장소를 고를 때 나는...', option1: '도심 속 감성 카페나 쇼핑, 핫플레이스가 좋아', option2: '사람 적은 자연 속 풍경이 더 좋아', type1: 'U', type2: 'N' },
  { question: '여행 중 가장 기대하는 순간은?', option1: '화려한 야경과 도시의 활기', option2: '자연 속 힐링 타임', type1: 'U', type2: 'N' },
  { question: '인생 사진 찍는다면?', option1: '트렌디한 장소, 감성 넘치는 배경', option2: '자연 속 여유로운 풍경', type1: 'U', type2: 'N' },
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);              // ✅ 선택 결과 저장
  const navigate = useNavigate();

  const handleAnswerClick = (answer) => {
    const selectedType = answer === 1 ? questions[currentQuestion].type1 : questions[currentQuestion].type2;
    const newAnswers = [...answers, selectedType];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      console.log('모든 답변:', newAnswers);
      navigate('/location', { state: { answers: newAnswers } });
    }
  };

  const current = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="progress">
        {currentQuestion + 1} / {questions.length}
      </div>
      <h2>{current.question}</h2>
      <div className="options">
        <button onClick={() => handleAnswerClick(1)}>{current.option1}</button>
        <button onClick={() => handleAnswerClick(2)}>{current.option2}</button>
      </div>
    </div>
  );
};

export default Quiz;
