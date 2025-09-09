import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout/AdminLayout';
import { useAdmin } from '../../hooks/useAdmin';
import './AdminDashboard.css';

export const AdminDashboard = () => {
  const { isAdmin, isAdminOrManager } = useAdmin();

  if (!isAdmin && !isAdminOrManager) {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>Доступ запрещен</h2>
          <p>Требуются права администратора или менеджера</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Обзор системы</h1>
          <p>Статистика и основные показатели</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>Всего актов</h3>
              <p className="stat-number">1,247</p>
              <p className="stat-change">+15 за сегодня</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Пользователи</h3>
              <p className="stat-number">23</p>
              <p className="stat-change">3 активных сейчас</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚗</div>
            <div className="stat-info">
              <h3>Транспортные средства</h3>
              <p className="stat-number">856</p>
              <p className="stat-change">+8 за сегодня</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Выполнено</h3>
              <p className="stat-number">92%</p>
              <p className="stat-change">+2% за неделю</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <section className="dashboard-section">
            <h2>Последняя активность</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">➕</div>
                <div className="activity-content">
                  <p>Иван Иванов создал новый акт #ДП2509-15-12</p>
                  <span className="activity-time">2 минуты назад</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📷</div>
                <div className="activity-content">
                  <p>Петр Петров добавил фотографии к акту #ДП2509-15-11</p>
                  <span className="activity-time">15 минут назад</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">✅</div>
                <div className="activity-content">
                  <p>Акт #ДП2509-15-10 был завершен</p>
                  <span className="activity-time">1 час назад</span>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Быстрые действия</h2>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <span className="action-icon">👥</span>
                <span>Управление пользователями</span>
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">📚</span>
                <span>Редактировать справочники</span>
              </button>
              <button className="quick-action-btn">
                <span className="action-icon">📊</span>
                <span>Смотреть отчеты</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;