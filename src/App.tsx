import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ScorecardApp from './pages/ScorecardApp';
import PreLoader from './components/layout/PreLoader';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show preloader for 1.5s to load resources and set theme
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <PreLoader />}
      
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<ScorecardApp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
