import React from 'react';

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();

  let bgColor = '#e2e8f0';
  let color = '#475569';

  switch (normalizedStatus) {
    case 'approved':
    case 'confirmed':
    case 'completed':
    case 'active':
      bgColor = 'rgba(40, 167, 69, 0.15)';
      color = '#1b5e20';
      break;
    case 'pending':
    case 'upcoming':
    case 'new':
      bgColor = 'rgba(255, 193, 7, 0.2)';
      color = '#b77904';
      break;
    case 'ongoing':
    case 'received':
    case 'replied':
      bgColor = 'rgba(0, 123, 255, 0.15)';
      color = '#0056b3';
      break;
    case 'rejected':
    case 'closed':
      bgColor = 'rgba(220, 53, 69, 0.15)';
      color = '#c62828';
      break;
    default:
      break;
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      borderRadius: '50px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'capitalize',
      backgroundColor: bgColor,
      color: color,
      whiteSpace: 'nowrap'
    }}>
      {(normalizedStatus === 'ongoing' || normalizedStatus === 'active') && (
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: color,
          animation: 'pulse 2s infinite'
        }} />
      )}
      {status}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 86, 179, 0.4); }
          70% { box-shadow: 0 0 0 4px rgba(0, 86, 179, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 86, 179, 0); }
        }
      `}</style>
    </span>
  );
};

export default StatusBadge;
