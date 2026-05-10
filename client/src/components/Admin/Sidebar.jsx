import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, CalendarDays, Trophy, 
  HandCoins, Users, Images, MessageSquare, Settings, LogOut
} from 'lucide-react';
import useStore from '../../store/useStore';
import api from '../../services/api';
import toast from 'react-hot-toast';
import logo from '../../assets/icons/NGO_logo.png';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Server call failed — still clear local session below
    } finally {
      logout();                     // clears user state + localStorage token
      localStorage.removeItem('token');
      toast.success("Logged out successfully");
      navigate('/admin/login');
    }
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Events', path: '/admin/events', icon: CalendarDays },
    { name: 'Rewarded Children', path: '/admin/rewarded-children', icon: Trophy },
    { name: 'Donations', path: '/admin/donations', icon: HandCoins },
    { name: 'Volunteers', path: '/admin/volunteers', icon: Users },
    { name: 'Gallery', path: '/admin/gallery', icon: Images },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={`${styles.overlay} desktop-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.logoArea}>
          <img src={logo} alt="Logo" className={styles.logoIcon} style={{ width: 40, height: 40, objectFit: 'contain' }} />
          <div className={styles.logoText}>Hamari Ummeed<br/>Mission</div>
        </div>
        
        <div className={styles.divider} />

        <div className={styles.navMenu}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                onClick={() => {
                  if (window.innerWidth <= 1024) toggleSidebar();
                }}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <Icon size={20} className={styles.icon} />
                <span className={styles.navText}>{item.name}</span>
                {item.badge && <span className={styles.badge}>{item.badge}</span>}
              </NavLink>
            );
          })}
        </div>

        <div className={styles.bottomArea}>
          <div className={styles.adminInfo}>
            <img src={user?.avatar || 'https://ui-avatars.com/api/?name=Admin'} alt="Admin" className={styles.avatar} />
            <div className={styles.adminDetails}>
              <span className={styles.adminName}>{user?.name || 'Admin'}</span>
              <span className={styles.adminRole}>{user?.role || 'Administrator'}</span>
            </div>
          </div>
          
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} className={styles.icon} />
            <span>Logout</span>
          </button>
          
          <div className={styles.version}>v1.0.0</div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
