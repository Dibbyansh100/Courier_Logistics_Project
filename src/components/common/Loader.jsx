import React from 'react';

export const Loader = ({ message = 'Loading data...' }) => {
  return (
    <div className="loader-container" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{message}</p>
    </div>
  );
};

export default Loader;
