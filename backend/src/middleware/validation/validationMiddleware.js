export const validateVin = (vin) => {
  if (!vin || vin.trim().length === 0) {
    return 'VIN номер обязателен для заполнения';
  }
  if (vin.length !== 17) {
    return 'VIN номер должен содержать ровно 17 символов';
  }
  const invalidChars = /[IOQ]/i;
  if (invalidChars.test(vin)) {
    return 'VIN номер содержит недопустимые символы (I, O, Q)';
  }
  const validPattern = /^[A-HJ-NPR-Z0-9]{17}$/i;
  if (!validPattern.test(vin)) {
    return 'VIN номер содержит недопустимые символы';
  }
  return null;
};