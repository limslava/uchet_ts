import React from 'react';
import './Input.css';

export const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  style
}) => {
  return (
    <div className="input-group" style={style}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`input-field ${error ? 'error' : ''}`}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;