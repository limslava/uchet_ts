import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout/AdminLayout';
import UserManagement from '../../components/admin/Users/UserManagement';

const UserManagementPage = () => {
  return (
    <AdminLayout>
      <UserManagement />
    </AdminLayout>
  );
};

export default UserManagementPage;