import React from 'react';

export const CommonToggle = ({ label, description, checked, onChange, disabled = false }) => {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer select-none ${
        checked
          ? 'bg-slate-800 border-blue-500 shadow-lg ring-2 ring-blue-500/20'
          : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="pr-4">
        <span className="text-xl md:text-2xl font-bold text-white block">{label}</span>
        {description && <span className="text-slate-400 text-sm md:text-base mt-1 block">{description}</span>}
      </div>

      <div
        className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-200 shrink-0 ${
          checked ? 'bg-blue-600' : 'bg-slate-700'
        }`}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
};
