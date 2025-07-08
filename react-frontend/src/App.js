import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext';

import './App.css';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import CompleteSignupPage from './pages/CompleteSignup';
import CafeSearchPage from './pages/CafeSearch';
import FeedPage from './pages/Feed';
import TestReaction from './pages/TempPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/complete-signup' element={<CompleteSignupPage />} />
          <Route path='/cafesearch' element={<CafeSearchPage />} />
          <Route path='/feed' element={<FeedPage />} />
          <Route path='/tempage' element={<TestReaction/>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;