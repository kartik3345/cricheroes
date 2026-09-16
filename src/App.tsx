import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ScorecardApp from './pages/ScorecardApp';
import PreLoader from './components/layout/PreLoader';

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <PreLoader onFinish={() => setLoading(false)} />}
      
      {!loading && (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<ScorecardApp />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}
