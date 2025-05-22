import React from 'react';
import UserTable from './components/UserTable';
import CafeList from './components/CafeList';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>User and Cafe Management</h1>
      <UserTable />
      <CafeList />
    </div>
  );
}

export default App;