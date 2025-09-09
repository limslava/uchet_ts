import React from 'react';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false, // убедитесь, что есть значение по умолчанию
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const className = `btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''} ${disabled ? 'btn-disabled' : ''}`;

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
      // УДАЛИТЕ loading={loading} отсюда, если он передается как проп
    >
      {loading && <span className="btn-spinner"></span>}
      {children}
    </button>
  );
};