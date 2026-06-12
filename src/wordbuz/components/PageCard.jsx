import React from 'react';

/**
 * Simple wrapper component that applies the global glass‑card style.
 * It now forwards any additional props (e.g., style) to the underlying div.
 */
export const PageCard = ({ children, className = '', ...rest }) => {
  return (
    <div className={`glass-card ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default PageCard;
