export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Требуются права администратора' 
    });
  }
  next();
};

export const requireAdminOrManager = (req, res, next) => {
  if (!['ADMIN', 'MANAGER'].includes(req.user.role)) {
    return res.status(403).json({ 
      error: 'Требуются права администратора или менеджера' 
    });
  }
  next();
};