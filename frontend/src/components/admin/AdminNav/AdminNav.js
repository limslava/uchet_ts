import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../../../hooks/useAdmin';
import './AdminNav.css';

export const AdminNav = () => {
  const location = useLocation();
  const { isAdmin, isAdminOrManager, canManageUsers, canManageDictionaries } = useAdmin();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    {
      path: '/admin',
      label: 'Обзор',
      icon: '📊',
      show: true
    },
    {
      path: '/admin/transport',
      label: 'Перевозки',
      icon: '🚛',
      show: isAdminOrManager
    },
    {
      path: '/admin/users',
      label: 'Пользователи',
      icon: '👥',
      show: canManageUsers
    },
    {
      path: '/admin/dictionaries',
      label: 'Справочники',
      icon: '📚',
      show: canManageDictionaries
    },
    {
      path: '/admin/analytics',
      label: 'Аналитика',
      icon: '📈',
      show: true
    },
    {
      path: '/admin/settings',
      label: 'Настройки',
      icon: '⚙️',
      show: isAdmin
    }
  ];

  return (
    <nav className="admin-nav">
      <div className="admin-nav-header">
        <h3>Панель управления</h3>
      </div>
      
      <ul className="admin-nav-list">
        {navItems.map((item) => 
          item.show && (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`admin-nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          )
        )}
      </ul>
    </nav>
  );
};

export default AdminNav;