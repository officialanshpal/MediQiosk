import React from 'react';

export const CommonBadge = ({ variant = 'info', children, className = '' }) => {
  const variantStyles = {
    info: 'bg-blue-900/60 text-blue-300 border-blue-700/80',
    success: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/80',
    warning: 'bg-amber-900/60 text-amber-300 border-amber-700/80',
    danger: 'bg-rose-900/60 text-rose-300 border-rose-700/80',
    ayush: 'bg-emerald-950 text-emerald-400 border-emerald-600'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs md:text-sm font-bold border ${variantStyles[variant] || variantStyles.info} ${className}`}
    >
      {children}
    </span>
  );
};
