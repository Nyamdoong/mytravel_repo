// src/pages/LocationInput.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LocationInput.css'; // 선택사항

const LocationInput = () => {
  const [locationInput, setLocationInput] = useState('');
  const navigate = useNavigate();
  const { state } = useLocation(); // 퀴즈 답변 가져오기

  const handleSubmit = () => {
    if (locationInput.trim()) {
      navigate('/result', {
        state: {
          answers: state.answers,
          location: locationInput,
        },
      });
    }
  };

  return (
    <div className="location-input-container">
      <h2>여행하고 싶은 지역을 입력해주세요</h2>
      <input
        type="text"
        value={locationInput}
        onChange={(e) => setLocationInput(e.target.value)}
        placeholder="예: 서울, 부산, 제주..."
      />
      <button onClick={handleSubmit}>결과 보기</button>
    </div>
  );
};

export default LocationInput;
