import React from 'react';

export const CommonCard = ({ children, title, subtitle, className = '', headerAction = null }) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-5 md:p-7 shadow-sm ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200">
          <div>
            {title && <h2 className="text-xl md:text-2xl font-semibold text-slate-900">{title}</h2>}
            {subtitle && <p className="text-slate-500 text-sm md:text-base mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
