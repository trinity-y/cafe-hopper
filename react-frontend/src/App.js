import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';

function App() {
  return (
    <Router>
        <Routes>
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/signup' element={<SignupPage/>} />
        </Routes>
    </Router>
  );
}

export default App;