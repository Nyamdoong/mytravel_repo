import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AiRecommend = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mbti, region } = location.state || {};
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mbti || !region) return;

    const fetchAI = async () => {
      setLoading(true);
      try {
        // 🔇 실제 요청은 임시 주석 처리
        /*
        const res = await fetch('http://localhost:3000/api/recommend-course', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mbti, region })
        });
        const data = await res.json();
        setRecommendation(data.course);
        */

        // ✅ 임시로 더미 텍스트 넣기
        setRecommendation(`🔧 AI 추천은 현재 비활성화 상태입니다.
MBTI: ${mbti}, 지역: ${region}에 맞는 여행 코스는 곧 제공될 예정이에요!`);
      } catch (err) {
        setRecommendation('AI 추천을 불러오는데 실패했어요 😢');
      }
      setLoading(false);
    };

    fetchAI();
  }, [mbti, region]);

  if (!mbti || !region) {
    return <div>잘못된 접근입니다.</div>;
  }

  return (
    <div className="ai-recommend-container">
      <h1>🧠 AI가 추천한 여행 코스</h1>
      <p>MBTI: <strong>{mbti}</strong>, 지역: <strong>{region}</strong></p>
      {loading ? (
        <p>추천 코스를 생성 중입니다... 잠시만 기다려주세요 ⏳</p>
      ) : (
        <pre className="recommend-text">{recommendation}</pre>
      )}
      <button onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
};

export default AiRecommend;
