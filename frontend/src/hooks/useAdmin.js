import { useState, useEffect } from 'react';
import { useAuth } from './useAuth.js';



export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminOrManager, setIsAdminOrManager] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAdmin(user.role === 'ADMIN');
      setIsAdminOrManager(['ADMIN', 'MANAGER'].includes(user.role));
    } else {
      setIsAdmin(false);
      setIsAdminOrManager(false);
    }
  }, [user]);

  return {
    isAdmin,
    isAdminOrManager,
    canManageUsers: isAdmin,
    canViewAnalytics: isAdminOrManager,
    canManageDictionaries: isAdminOrManager
  };
};