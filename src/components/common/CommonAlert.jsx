import React from 'react';
import { AlertTriangle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

export const CommonAlert = ({ variant = 'danger', title, children, action = null }) => {
  const styles = {
    danger: {
      bg: 'bg-rose-950/90 border-rose-600 text-rose-100',
      icon: <ShieldAlert className="w-8 h-8 text-rose-400 shrink-0 animate-pulse" />
    },
    warning: {
      bg: 'bg-amber-950/90 border-amber-600 text-amber-100',
      icon: <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
    },
    success: {
      bg: 'bg-emerald-950/90 border-emerald-600 text-emerald-100',
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
    },
    info: {
      bg: 'bg-blue-950/90 border-blue-600 text-blue-100',
      icon: <Info className="w-8 h-8 text-blue-400 shrink-0" />
    }
  };

  const current = styles[variant] || styles.danger;

  return (
    <div className={`p-5 md:p-6 rounded-2xl border-2 shadow-2xl flex items-start gap-4 ${current.bg}`}>
      {current.icon}
      <div className="flex-1">
        {title && <h3 className="text-xl md:text-2xl font-bold tracking-wide">{title}</h3>}
        <div className="text-base md:text-lg mt-1 text-slate-200">{children}</div>
      </div>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
};
