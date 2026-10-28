import React from 'react';

export const CommonCard = ({ children, title, subtitle, className = '', headerAction = null }) => {
  return (
    <div className={`min-w-0 overflow-hidden rounded-3xl border border-white/80 bg-white p-5 shadow-xl shadow-slate-900/[0.04] ring-1 ring-slate-200/70 md:p-8 ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-5 md:mb-8">
          <div className="min-w-0">
            {title && <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">{title}</h2>}
            {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-slate-500 md:text-base">{subtitle}</p>}
          </div>
          {headerAction && <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 [&>svg]:h-6 [&>svg]:w-6">{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
