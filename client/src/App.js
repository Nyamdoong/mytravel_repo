// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intro from './pages/Intro';
import Quiz from './pages/Quiz';
import Result from './pages/Result';   // ✅ 추가
import AiRecommend from './pages/AiRecommend';
import LocationInput from './pages/LocationInput';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />   {/* ✅ 추가 */}
        <Route path="/ai-recommend" element={<AiRecommend />} />
        <Route path="/location" element={<LocationInput />} />
      </Routes>
    </Router>
  );
}

export default App;
