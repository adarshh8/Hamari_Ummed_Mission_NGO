import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Admin/Sidebar';
import TopBar from '../../components/Admin/TopBar';
import styles from './AdminLayout.module.css';
import useStore from '../../store/useStore';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const location = useLocation();
  const { user } = useStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <TopBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <main className={`${styles.mainContent} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
        {/* Child routes like Overview, Activities, Events render here */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
