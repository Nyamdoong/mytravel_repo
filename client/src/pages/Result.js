// src/pages/Result.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Result.css';
import schedules from '../data/schedules';
import MapView from '../components/MapView';

// 캐릭터 이미지 리스트
import goofy from '../assets/goofy.png';
import elsa from '../assets/elsa.jpg';
import jerry from '../assets/jerry.jpg';
import miki from '../assets/miki.jpg';
import olaf from '../assets/olaf.jpg';
import spongebob from '../assets/spongebob.jpg';
import stch from '../assets/stch.jpg';
import tom from '../assets/tom.jpg';

const characterImages = [goofy, elsa, jerry, miki, olaf, spongebob, stch, tom];

const calculateMBTI = (answers) => {
  if (!answers || answers.length !== 9) return null;
  const count = { J: 0, P: 0, A: 0, R: 0, U: 0, N: 0 };
  answers.forEach((type) => { count[type]++; });

  return (count.J >= count.P ? 'J' : 'P') +
         (count.A >= count.R ? 'A' : 'R') +
         (count.U >= count.N ? 'U' : 'N');
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers;
  const region = location.state?.location;

  const [selectedPlan, setSelectedPlan] = useState(0);
  const [randomCharacter] = useState(() => {
    const randomIndex = Math.floor(Math.random() * characterImages.length);
    return characterImages[randomIndex];
  });

  if (!answers) {
    return <div>잘못된 접근입니다. 다시 시도해주세요!</div>;
  }

  const mbti = calculateMBTI(answers);
  const matchedSchedules = schedules[mbti];

  return (
    <div className="result-container">
      <h1>당신의 여행 MBTI는?</h1>
      <h2 className="mbti-type">{mbti}</h2>

      <img src={randomCharacter} alt="랜덤 캐릭터" width="200" />

      <p className="description">이 유형에 딱 맞는 여행 스타일이에요!</p>
      <p className="explanation">
        {mbti[0]}: {mbti[0] === 'J' ? '계획형 (Judging)' : '즉흥형 (Perceiving)'} /&nbsp;
        {mbti[1]}: {mbti[1] === 'A' ? '활동적인 타입 (Adventurous)' : '휴식형 (Relaxed)'} /&nbsp;
        {mbti[2]}: {mbti[2] === 'U' ? '도시 선호 (Urban)' : '자연 선호 (Nature)'}
      </p>

      <h3>추천 일정</h3>
      {matchedSchedules ? (
        <>
          <div className="plan-buttons">
            {matchedSchedules.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPlan(idx)}
                className={selectedPlan === idx ? 'active' : ''}
              >
                추천 {idx + 1}
              </button>
            ))}
          </div>
          <div className="schedule-box">
            <h4>{matchedSchedules[selectedPlan].title}</h4>
            <ul>
              {matchedSchedules[selectedPlan].schedule.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <button
            className="ai-button"
            onClick={() => navigate('/ai-recommend', { state: { mbti, region } })}
          >
            ✨ AI 추천 보기
          </button>

          {/* ✅ 선택한 일정만 넘기도록 수정 */}
          <MapView schedule={matchedSchedules[selectedPlan].schedule} />
        </>
      ) : (
        <p>아직 이 유형에 대한 추천 일정이 준비되지 않았어요!</p>
      )}

      <button onClick={() => navigate('/')}>처음으로 돌아가기</button>
    </div>
  );
};

export default Result;
