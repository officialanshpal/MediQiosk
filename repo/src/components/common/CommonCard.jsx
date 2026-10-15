import React from 'react';

export const CommonCard = ({ children, title, subtitle, className = '', headerAction = null }) => {
  return (
    <div className={`bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-sm ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/60">
          <div>
            {title && <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">{title}</h2>}
            {subtitle && <p className="text-slate-400 text-sm md:text-base mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
