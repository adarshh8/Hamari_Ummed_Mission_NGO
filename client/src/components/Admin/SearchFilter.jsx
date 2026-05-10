import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const SearchFilter = ({ searchValue, onSearchChange, placeholder = "Search...", filters = [], onFilterChange }) => {
  const [localSearch, setLocalSearch] = useState(searchValue || '');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange && localSearch !== searchValue) {
        onSearchChange(localSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchValue]);

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '24px', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      
      {/* Search Bar */}
      <div style={{ flex: '1 1 300px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex', pointerEvents: 'none' }}>
          <Search size={18} />
        </div>
        <input 
          type="text" 
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder={placeholder}
          style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
      </div>

      {/* Filters */}
      {filters.map((filter, idx) => (
        <div key={idx} style={{ flex: '0 1 auto' }}>
          <select
            value={filter.value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white', cursor: 'pointer', outline: 'none' }}
          >
            {filter.options.map((opt, i) => (
              <option key={i} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      ))}

      {/* Clear Filters Button */}
      {((localSearch !== '') || filters.some(f => f.value !== 'all' && f.value !== '')) && (
        <button 
          onClick={() => {
            setLocalSearch('');
            if (onSearchChange) onSearchChange('');
            filters.forEach(f => onFilterChange(f.key, f.default || 'all'));
          }}
          style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '13px', cursor: 'pointer', fontWeight: 600, padding: '10px' }}
        >
          Clear All
        </button>
      )}

    </div>
  );
};

export default SearchFilter;
