// backend/src/middleware/validation/dictionaryValidation.js
export const validateCarBrand = (req, res, next) => {
  const { name } = req.body;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ 
      error: 'Название марки должно содержать минимум 2 символа' 
    });
  }
  
  if (name.length > 50) {
    return res.status(400).json({ 
      error: 'Название марки не должно превышать 50 символов' 
    });
  }
  
  next();
};