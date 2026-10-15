import React from 'react';

export const CommonForm = ({ fields, values, onChange, onSubmit, submitLabel = 'Submit', submitIcon = null }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-2">
          <label className="text-lg md:text-xl font-bold text-slate-200 flex items-center gap-2">
            {field.icon && <span className="text-blue-400">{field.icon}</span>}
            {field.label}
          </label>
          {field.type === 'select' ? (
            <select
              name={field.name}
              value={values[field.name] || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="bg-slate-900 border-2 border-slate-700 text-white rounded-2xl p-4 text-xl focus:border-blue-500 focus:outline-none"
            >
              {field.options.map((opt) => (
                <option key={opt.value || opt} value={opt.value || opt}>
                  {opt.label || opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || 'text'}
              name={field.name}
              value={values[field.name] || ''}
              placeholder={field.placeholder || ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="bg-slate-900 border-2 border-slate-700 text-white rounded-2xl p-4 text-xl focus:border-blue-500 focus:outline-none placeholder-slate-500"
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white kiosk-btn py-5 rounded-2xl font-bold text-2xl shadow-xl mt-6 transition-all"
      >
        {submitIcon}
        {submitLabel}
      </button>
    </form>
  );
};
