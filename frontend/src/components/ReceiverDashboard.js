import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ReceiverDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Панель приемосдатчика</h1>
      
      <div style={{ 
        marginTop: '30px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px',
        alignItems: 'center'
      }}>
        <Link to="/receive" style={{ 
          display: 'inline-block', 
          padding: '15px 30px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '5px',
          fontSize: '18px',
          width: '250px'
        }}>
          Создать новый акт приёмки
        </Link>
        
        <Link to="/receive-by-scan" style={{ 
          display: 'inline-block', 
          padding: '15px 30px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '5px',
          fontSize: '18px',
          width: '250px'
        }}>
          Прием по QR-коду
        </Link>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Выйти
        </button>
      </div>
    </div>
  );
}