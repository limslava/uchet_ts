import React, { useState, useEffect } from 'react';
import { DataTable } from '../../common/DataTable/DataTable';
import { Pagination } from '../../common/Pagination/Pagination';
import { Button } from '../../common/Button/Button';
import { Input } from '../../common/Input/Input';
import { UserModal } from '../UserModal/UserModal';
import { adminApi } from '../../../services/adminApi';
import { useAdmin } from '../../../hooks/useAdmin';
import './UserManagement.css';

export const UserManagement = () => {
  const { canManageUsers } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    isActive: ''
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const columns = [
    {
      key: 'email',
      title: 'Email',
      width: '25%'
    },
    {
      key: 'name',
      title: 'Имя',
      width: '20%'
    },
    {
      key: 'role',
      title: 'Роль',
      width: '15%',
      render: (value) => (
        <span className={`role-badge role-${value.toLowerCase()}`}>
          {getRoleLabel(value)}
        </span>
      )
    },
    {
      key: 'isActive',
      title: 'Статус',
      width: '15%',
      render: (value) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? 'Активен' : 'Неактивен'}
        </span>
      )
    },
    {
      key: '_count',
      title: 'Актов',
      width: '10%',
      render: (value) => value?.vehicleActs || 0
    },
    {
      key: 'createdAt',
      title: 'Создан',
      width: '15%',
      render: (value) => new Date(value).toLocaleDateString('ru-RU')
    }
  ];

  const getRoleLabel = (role) => {
    const roles = {
      ADMIN: 'Администратор',
      MANAGER: 'Менеджер',
      RECEIVER: 'Приёмщик'
    };
    return roles[role] || role;
  };

  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        ...filters
      };

      // Очищаем пустые фильтры
      Object.keys(params).forEach(key => {
        if (params[key] === '') delete params[key];
      });

      const response = await adminApi.getUsers(params);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManageUsers) {
      loadUsers();
    }
  }, [canManageUsers, filters]);

  const handlePageChange = (newPage) => {
    loadUsers(newPage);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSubmitUser = async (userData) => {
    try {
      setModalLoading(true);
      
      if (editingUser) {
        await adminApi.updateUser(editingUser.id, userData);
      } else {
        await adminApi.createUser(userData);
      }

      setModalOpen(false);
      loadUsers(pagination.page);
      alert(editingUser ? 'Пользователь обновлен' : 'Пользователь создан');
    } catch (error) {
      console.error('Error saving user:', error);
      alert(error.response?.data?.error || 'Ошибка при сохранении пользователя');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Вы уверены, что хотите удалить пользователя ${user.email}?`)) {
      return;
    }

    try {
      await adminApi.deleteUser(user.id);
      loadUsers(pagination.page);
      alert('Пользователь удален');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.error || 'Ошибка при удалении пользователя');
    }
  };

  if (!canManageUsers) {
    return (
      <div className="access-denied">
        <h2>Доступ запрещен</h2>
        <p>Требуются права администратора для управления пользователями</p>
      </div>
    );
  }

  return (
    <div className="user-management-content"> {/* Убрали обертку user-management */}
      <div className="user-management-header">
        <h1>Управление пользователями</h1>
        <Button onClick={handleCreateUser}>
          + Создать пользователя
        </Button>
      </div>

      <div className="filters">
        <Input
          placeholder="Поиск по email или имени..."
          value={filters.search}
          onChange={(value) => handleFilterChange('search', value)}
          style={{ width: '300px' }}
        />
        
        <select
          value={filters.role}
          onChange={(e) => handleFilterChange('role', e.target.value)}
          className="filter-select"
        >
          <option value="">Все роли</option>
          <option value="ADMIN">Администратор</option>
          <option value="MANAGER">Менеджер</option>
          <option value="RECEIVER">Приёмщик</option>
        </select>

        <select
          value={filters.isActive}
          onChange={(e) => handleFilterChange('isActive', e.target.value)}
          className="filter-select"
        >
          <option value="">Все статусы</option>
          <option value="true">Активные</option>
          <option value="false">Неактивные</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        onRowClick={handleEditUser}
        emptyMessage="Пользователи не найдены"
      />

      {pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
        />
      )}

      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitUser}
        user={editingUser}
        loading={modalLoading}
      />
    </div>
  );
};

export default UserManagement;