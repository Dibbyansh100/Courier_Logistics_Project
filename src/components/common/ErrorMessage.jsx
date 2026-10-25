import React from 'react';

export const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="error-box" role="alert">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span>⚠️</span>
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-secondary btn-sm"
          style={{ cursor: 'pointer' }}
        >
          🔄 Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
