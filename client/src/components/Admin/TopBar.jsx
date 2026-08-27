import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Mail, Users, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import useStore from '../../store/useStore';
import styles from './TopBar.module.css';

const TopBar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const panelRef = useRef(null);

  // Convert path to readable title
  const getPageTitle = () => {
    const path = location.pathname.replace('/admin', '');
    if (path === '' || path === '/') return 'Overview';
    const cleanPath = path.replace('/', '').replace(/-/g, ' ');
    return cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1);
  };

  // Fetch new messages (status = 'new')
  const { data: newMessages = [] } = useQuery({
    queryKey: ['notifMessages'],
    queryFn: async () => {
      try {
        const res = await api.get('/contact?status=new&limit=5');
        const list = res.data.data || [];
        return list.filter(m => m.status === 'new');
      } catch (e) {
        return [];
      }
    },
    refetchInterval: 30000, // refetch every 30s
  });

  // Fetch pending volunteers
  const { data: pendingVolunteers = [] } = useQuery({
    queryKey: ['notifVolunteers'],
    queryFn: async () => {
      try {
        const res = await api.get('/volunteers?status=pending&limit=5');
        const list = res.data.data || [];
        return list.filter(v => v.status === 'pending');
      } catch (e) {
        return [];
      }
    },
    refetchInterval: 30000,
  });

  const totalCount = newMessages.length + pendingVolunteers.length;

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const title = getPageTitle();

  return (
    <div className={`${styles.topbar} ${!isSidebarOpen ? styles.topbarClosed : ''}`}>
      <div className={styles.leftSection}>
        <button className={styles.menuBtn} onClick={toggleSidebar} style={{ display: 'block' }}>
          <Menu size={24} color="var(--dark)" />
        </button>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <span className={styles.breadcrumb}>Admin &gt; {title}</span>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div style={{ position: 'relative' }} ref={panelRef}>
          <button
            className={styles.iconBtn}
            onClick={() => setShowNotifs(prev => !prev)}
            style={{ position: 'relative' }}
          >
            <Bell size={20} />
            {totalCount > 0 && (
              <span style={{
                position: 'absolute', top: 2, right: 2,
                background: 'var(--primary)', color: '#fff',
                fontSize: 10, fontWeight: 700,
                borderRadius: '50%', width: 16, height: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {totalCount > 9 ? '9+' : totalCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div style={{
              position: 'absolute', right: 0, top: 44,
              width: 320, background: '#fff',
              borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              zIndex: 1000, overflow: 'hidden', border: '1px solid #eee'
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: 14 }}>Notifications {totalCount > 0 && `(${totalCount})`}</strong>
                <button onClick={() => setShowNotifs(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                  <X size={16} />
                </button>
              </div>

              {totalCount === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#999', fontSize: 13 }}>
                  🎉 All caught up! No new notifications.
                </div>
              ) : (
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {newMessages.map(msg => (
                    <div
                      key={msg._id}
                      onClick={() => { navigate('/admin/messages'); setShowNotifs(false); }}
                      style={{
                        padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start',
                        cursor: 'pointer', borderBottom: '1px solid #f5f5f5',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ background: '#e8f4ff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Mail size={14} color="#2563eb" />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>New message from {msg.name}</div>
                        <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{msg.subject}</div>
                      </div>
                    </div>
                  ))}
                  {pendingVolunteers.map(vol => (
                    <div
                      key={vol._id}
                      onClick={() => { navigate('/admin/volunteers'); setShowNotifs(false); }}
                      style={{
                        padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start',
                        cursor: 'pointer', borderBottom: '1px solid #f5f5f5',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ background: '#e8fff0', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Users size={14} color="#16a34a" />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>New volunteer: {vol.name}</div>
                        <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Pending approval</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <img
          src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=1B4332&color=fff`}
          alt="Admin"
          className={styles.avatar}
        />
      </div>
    </div>
  );
};

export default TopBar;
