import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import useStore from '../../store/useStore';
import styles from './TopBar.module.css';

const TopBar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useStore();
  const location = useLocation();

  // Convert path to readable title
  const getPageTitle = () => {
    const path = location.pathname.replace('/admin', '');
    if (path === '' || path === '/') return 'Overview';
    const cleanPath = path.replace('/', '').replace(/-/g, ' ');
    return cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1);
  };

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
        <button className={styles.iconBtn} onClick={() => toast('No new notifications', { icon: '🔔' })}>
          <Bell size={20} />
          <span className={styles.bellBadge}></span>
        </button>

        <img 
          src={user?.avatar || 'https://ui-avatars.com/api/?name=Admin'} 
          alt="Admin" 
          className={styles.avatar} 
        />
      </div>
    </div>
  );
};

export default TopBar;
