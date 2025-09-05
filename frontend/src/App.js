import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReceivePage from './components/ReceivePage';
import ReceiverDashboard from './components/ReceiverDashboard';
import ReceiveByScan from './pages/ReceiveByScan';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <ReceiverDashboard />
            </ProtectedRoute>
          } />
          <Route path="/receive" element={
            <ProtectedRoute>
              <ReceivePage />
            </ProtectedRoute>
          } />
          <Route path="/receive-by-scan" element={
            <ProtectedRoute>
              <ReceiveByScan />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;