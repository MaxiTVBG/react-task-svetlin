import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import StartPage from './StartPage.jsx';
import QuestionPage from './QuestionPage.jsx';
import ResultsPage from './ResultsPage.jsx'; // Import ResultsPage

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/question/:id" element={<QuestionPage />} />
        <Route path="/results" element={<ResultsPage />} /> {/* Add ResultsPage route */}
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);