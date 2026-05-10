import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, trend, color = 'var(--primary)', link }) => {
  const isPositive = trend?.startsWith('+');
  
  const content = (
    <motion.div 
      whileHover={{ y: -2, boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }}
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: link ? 'pointer' : 'default',
        textDecoration: 'none'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ 
          background: `${color}15`, 
          padding: '12px', 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={24} color={color} />
        </div>
        
        {trend && (
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: isPositive ? 'var(--success, #28a745)' : 'var(--error, #dc3545)',
            background: isPositive ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
            padding: '4px 8px',
            borderRadius: '50px'
          }}>
            {trend}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: '32px', 
          fontWeight: '700', 
          color: 'var(--dark)',
          marginBottom: '4px'
        }}>
          {typeof value === 'number' ? (
            <CountUp end={value} duration={2} separator="," prefix={title.toLowerCase().includes('donations') ? '₹' : ''} />
          ) : (
            value
          )}
        </div>
        <div style={{ color: 'var(--muted)', fontSize: '14px', fontFamily: 'var(--font-body)' }}>
          {title}
        </div>
      </div>
    </motion.div>
  );

  return link ? <Link to={link} style={{ textDecoration: 'none' }}>{content}</Link> : content;
};

export default StatCard;
