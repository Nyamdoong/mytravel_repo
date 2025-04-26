import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Result.css';
import goofyImg from '../assets/goofy.png'; // 결과 이미지 (원하는 걸로 변경 OK)
import schedules from '../data/schedules'; // ✅ 일정 데이터 불러오기

const calculateMBTI = (answers) => {
  if (!answers || answers.length !== 9) return null;

  const count = { J: 0, P: 0, A: 0, R: 0, U: 0, N: 0 };

  answers.forEach((type) => {
    count[type]++;
  });

  const mbti =
    (count.J >= count.P ? 'J' : 'P') +
    (count.A >= count.R ? 'A' : 'R') +
    (count.U >= count.N ? 'U' : 'N');

  return mbti;
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers;

  if (!answers) {
    return <div>잘못된 접근입니다. 다시 시도해주세요!</div>;
  }

  const mbti = calculateMBTI(answers);
  const matchedSchedules = schedules[mbti]; // ✅ MBTI 결과로 일정 찾기

  return (
    <div className="result-container">
      <h1>당신의 여행 MBTI는?</h1>
      <h2 className="mbti-type">{mbti}</h2>

      <img src={goofyImg} alt="MBTI 캐릭터" width="200" />

      <p className="description">이 유형에 딱 맞는 여행 스타일이에요!</p>
      <p className="explanation">
        {mbti[0]}: {mbti[0] === 'J' ? '계획형 (Judging)' : '즉흥형 (Perceiving)'} /&nbsp;
        {mbti[1]}: {mbti[1] === 'A' ? '활동적인 타입 (Adventurous)' : '휴식형 (Relaxed)'} /&nbsp;
        {mbti[2]}: {mbti[2] === 'U' ? '도시 선호 (Urban)' : '자연 선호 (Nature)'}
      </p>

      {/* ✅ 추천 일정 출력 부분 */}
      <h3>추천 일정</h3>
      {matchedSchedules ? (
        matchedSchedules.map((schedule, index) => (
          <div key={index} className="schedule-box">
            <h4>{schedule.title}</h4>
            <ul>
              {schedule.schedule.map((item, idx) => (
                <li key={idx}>
                  <strong>{item}</strong>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>아직 이 유형에 대한 추천 일정이 준비되지 않았어요!</p>
      )}

      <button onClick={() => navigate('/')}>처음으로 돌아가기</button>
    </div>
  );
};

export default Result;
