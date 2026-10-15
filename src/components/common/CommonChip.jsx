import React from 'react';

export const CommonChip = ({ label, selected = false, onClick, icon = null, colorScheme = 'blue' }) => {
  const activeClass = colorScheme === 'ayush'
    ? 'bg-emerald-600 border-emerald-400 text-white ring-4 ring-emerald-500/30 shadow-emerald-900/50'
    : 'bg-blue-600 border-blue-400 text-white ring-4 ring-blue-500/30 shadow-blue-900/50';

  const inactiveClass = 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/80 hover:border-slate-500';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`kiosk-chip py-4 px-6 rounded-2xl font-bold text-lg md:text-xl border-2 transition-all cursor-pointer flex items-center justify-center gap-3 shadow-lg ${
        selected ? activeClass : inactiveClass
      }`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};
