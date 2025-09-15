import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './components/auth/Login/Login';
import ProtectedRoute from './components/auth/ProtectedRoute/ProtectedRoute';
import ReceiverDashboard from './components/vehicle/Dashboard/ReceiverDashboard';
import ReceivePage from './components/vehicle/ReceivePage/ReceivePage';
import ReceiveByScan from './pages/ReceiveByScan/ReceiveByScan';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DictionaryManagement from './pages/Admin/DictionaryManagement';
import UserManagement from './components/admin/Users/UserManagement';
import './App.css';
import { AdminLayout } from './components/admin/AdminLayout/AdminLayout';
import TransportManagement from './pages/Admin/TransportManagement';
import IssueByScan from './pages/IssueByScan/IssueByScan';
import TransportTypeSelection from './components/vehicle/TransportTypeSelection/TransportTypeSelection';
import ContainerStuffing from './components/vehicle/ContainerStuffing/ContainerStuffing';



// Компонент для проверки роли и перенаправления
const RoleBasedRoute = () => {
  const { user } = useAuth();
  
  // Если пользователь админ или менеджер - перенаправляем в админку
  if (user?.role === 'ADMIN' || user?.role === 'MANAGER') {
    return <Navigate to="/admin" replace />;
  }
  
  // Если пользователь приемосдатчик - показываем его панель
  return <ReceiverDashboard />;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Маршруты для приемосдатчиков */}
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
          
          <Route path="/admin/*" element={
  <ProtectedRoute>
    <Routes>
      <Route path="" element={<AdminDashboard />} />
      <Route path="users" element={<AdminLayout><UserManagement /></AdminLayout>} />
      <Route path="dictionaries" element={<AdminLayout><DictionaryManagement /></AdminLayout>} />
      <Route path="transport" element={
        <AdminLayout>
          <TransportManagement />
        </AdminLayout>
      } />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </ProtectedRoute>
} />

<Route path="/transport-type" element={
  <ProtectedRoute>
    <TransportTypeSelection />
  </ProtectedRoute>
} />
<Route path="/container-shipping" element={
  <ProtectedRoute>
    <ContainerStuffing />
  </ProtectedRoute>
} />

          {/* Маршруты для администраторов */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <Routes>
                <Route path="" element={<AdminDashboard />} />
                <Route path="users" element={<AdminLayout><UserManagement /></AdminLayout>} />
                <Route path="dictionaries" element={<DictionaryManagement />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          <Route path="/admin/transport" element={
  <ProtectedRoute requiredRole={['ADMIN', 'MANAGER']}>
    <TransportManagement />
  </ProtectedRoute>
} />

<Route path="/issue-by-scan" element={
  <ProtectedRoute>
    <IssueByScan />
  </ProtectedRoute>
} />
          
          {/* Главный маршрут с проверкой роли */}
          <Route path="/" element={
            <ProtectedRoute>
              <RoleBasedRoute />
            </ProtectedRoute>
          } />
          
          {/* Запасной маршрут */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;