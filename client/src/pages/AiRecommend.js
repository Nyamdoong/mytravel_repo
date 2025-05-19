import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AiRecommend.css';


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
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/recommend-course`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mbti, region }),
        });
        const data = await res.json();

        if (data.course) {
          setRecommendation(data.course);
        } else {
          setRecommendation('🚧 AI 추천 결과가 없습니다.');
        }
      } catch (err) {
        console.error('AI 추천 요청 오류:', err);
        setRecommendation('❌ AI 추천을 불러오는 데 실패했어요 😢');
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
      <p>
        MBTI: <strong>{mbti}</strong>, 지역: <strong>{region}</strong>
      </p>
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
