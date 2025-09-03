import React from 'react';
import { Link } from 'react-router-dom';

export default function ReceiverDashboard() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Панель приемосдатчика</h1>
      <div style={{ marginTop: '30px' }}>
        <Link to="/receive" style={{ 
          display: 'inline-block', 
          padding: '15px 30px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '5px',
          fontSize: '18px'
        }}>
          Создать новый акт приёмки
        </Link>
      </div>
    </div>
  );
}