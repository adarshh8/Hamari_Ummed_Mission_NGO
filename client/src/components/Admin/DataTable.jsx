import React from 'react';
import { motion } from 'framer-motion';

const DataTable = ({ columns, data, isLoading, emptyMessage, onRowClick }) => {
  if (isLoading) {
    return (
      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
              {columns.map((col, idx) => (
                <th key={idx} style={{ padding: '16px', textAlign: 'left', color: 'var(--muted)', fontSize: '13px', textTransform: 'uppercase' }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                {columns.map((_, j) => (
                  <td key={j} style={{ padding: '16px' }}>
                    <div style={{ height: '20px', background: '#eee', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
        <h3 style={{ color: 'var(--dark)', marginBottom: '8px' }}>No Data Found</h3>
        <p style={{ color: 'var(--muted)' }}>{emptyMessage || "There are no records to display here."}</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
              {columns.map((col, idx) => (
                <th key={idx} style={{ 
                  padding: '16px', 
                  textAlign: col.align || 'left', 
                  color: 'var(--muted)', 
                  fontSize: '13px', 
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <motion.tr 
                key={row.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ 
                  borderBottom: '1px solid #eee',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background 0.2s'
                }}
                onClick={(e) => {
                  // Prevent row click if clicking a button/link inside
                  if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A' && e.target.closest('button') === null) {
                    onRowClick && onRowClick(row);
                  }
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {columns.map((col, j) => (
                  <td key={j} style={{ padding: '16px', textAlign: col.align || 'left', fontSize: '14px', color: 'var(--text)' }}>
                    {col.accessor ? (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]) : null}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
