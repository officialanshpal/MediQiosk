import React from 'react';

export const CommonTable = ({ columns, data, emptyMessage = 'No data available', onRowClick = null }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/60 shadow-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-800/90 text-slate-300 uppercase text-xs md:text-sm tracking-wider border-b border-slate-700">
            {columns.map((col, idx) => (
              <th key={idx} className="p-4 font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-200">
          {data && data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr
                key={row.id || row.sessionId || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`hover:bg-slate-800/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="p-4 text-sm md:text-base font-medium">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-slate-400 font-medium">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
