import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import CafeSearchPage from './pages/CafeSearch';

function App() {
  return (
    <Router>
        <Routes>
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/signup' element={<SignupPage/>} />
          <Route path='/cafesearch' element={<CafeSearchPage/>} />
        </Routes>
    </Router>
  );
}

export default App;