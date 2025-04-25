import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intro from './pages/Intro';

const Quiz = () => {                      // ✅ 여기가 있어야 해요!
  return <div><h1>설문조사(퀴즈) 페이지입니다!</h1></div>;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/quiz" element={<Quiz />} />    // ✅ 이거!!
        </Routes>
      </div>
    </Router>
  );
}

export default App;
