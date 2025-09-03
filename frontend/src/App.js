import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReceivePage from './components/ReceivePage';
import ReceiverDashboard from './components/ReceiverDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ReceiverDashboard />} />
          <Route path="/receive" element={<ReceivePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;