import React from 'react';
import AdminNav from '../AdminNav/AdminNav';
import { useAuth } from '../../../hooks/useAuth';
import './AdminLayout.css';

export const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <AdminNav />
      </aside>
      
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-content">
            <h1>Панель управления</h1>
            <div className="user-menu">
              <span>Добро пожаловать, {user?.name || user?.email}</span>
              <button onClick={handleLogout} className="logout-btn">
                Выйти
              </button>
            </div>
          </div>
        </header>
        
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;