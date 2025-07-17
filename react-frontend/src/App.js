import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext';

import './App.css';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import CompleteSignupPage from './pages/CompleteSignup';
import CafeSearchPage from './pages/CafeSearch';
import BlendPage from './pages/BlendPage';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/complete-signup' element={<CompleteSignupPage />} />
          <Route path='/cafesearch' element={<CafeSearchPage />} />
          <Route path='/blend' element={<BlendPage />} />
      </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;