import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  GraduationCap, BookOpen, IndianRupee, Users, 
  CalendarDays, Bell, ArrowRight, X, Check, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '../../components/Admin/StatCard';
import DataTable from '../../components/Admin/DataTable';
import StatusBadge from '../../components/Admin/StatusBadge';
import api from '../../services/api';
import styles from './Overview.module.css';

// Empty Data for Recharts (Pending Real Data Integration)
const donationData = [];
const activityData = [];

const Overview = () => {
  const [showAlert, setShowAlert] = useState(true);

  // Real Queries
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await api.get('/stats');
      return res.data.data;
    }
  });

  const { data: recentDonationsData, isLoading: isDonationsLoading } = useQuery({
    queryKey: ['recentDonations'],
    queryFn: async () => {
      const res = await api.get('/donations?limit=5');
      return res.data.data;
    }
  });

  const { data: pendingVolunteersData, isLoading: isVolunteersLoading } = useQuery({
    queryKey: ['pendingVolunteers'],
    queryFn: async () => {
      const res = await api.get('/volunteers?status=pending&limit=5');
      return res.data.data;
    }
  });

  // Fallback to real data or empty defaults
  const stats = statsData || {
    childrenHelped: 0,
    booksDistributed: 0,
    donationsThisMonth: 0,
    activeVolunteers: 0,
    upcomingEvents: 0,
    pendingActions: 0
  };

  const recentDonations = (recentDonationsData || []).map(d => ({
    id: d._id,
    donor: d.donor?.name || (d.donor?.isAnonymous ? 'Anonymous' : 'Unknown'),
    amount: d.amount,
    purpose: d.purpose,
    date: new Date(d.createdAt).toISOString().split('T')[0],
    status: d.status
  }));

  const pendingVolunteers = (pendingVolunteersData || []).map(v => ({
    id: v._id,
    name: v.name,
    area: v.areasOfInterest?.join(', ') || 'General',
    applied: new Date(v.createdAt).toLocaleDateString()
  }));

  const donationColumns = [
    { header: 'Donor', accessor: 'donor' },
    { header: 'Amount', accessor: row => `₹${row.amount}` },
    { header: 'Purpose', accessor: 'purpose' },
    { header: 'Status', accessor: row => <StatusBadge status={row.status} /> }
  ];

  const volunteerColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Area of Interest', accessor: 'area' },
    { header: 'Applied', accessor: 'applied' },
    { header: 'Action', accessor: row => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ background: '#e6fcfa', color: '#0ca678', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex' }}><Check size={16} /></button>
        <button style={{ background: '#ffe3e3', color: '#e03131', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex' }}><XCircle size={16} /></button>
      </div>
    )}
  ];

  return (
    <motion.div 
      className={styles.overviewContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Alert Panel */}
      {showAlert && stats.pendingActions > 0 && (
        <motion.div 
          className={styles.alertPanel}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className={styles.alertContent}>
            <Bell size={24} />
            You have {stats.pendingActions} items needing your attention (unread messages, pending volunteers).
          </div>
          <div className={styles.alertLinks}>
            <Link to="/admin/messages" className={styles.alertLink}>View Messages</Link>
            <Link to="/admin/volunteers" className={styles.alertLink}>View Volunteers</Link>
            <button onClick={() => setShowAlert(false)} className={styles.dismissBtn}>
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Row 1: Stat Cards */}
      <div className={styles.statsGrid}>
        <StatCard title="Total Children Helped" value={stats.childrenHelped} icon={GraduationCap} color="#28a745" />
        <StatCard title="Books Distributed" value={stats.booksDistributed} icon={BookOpen} color="#0056b3" />
        <StatCard title="Donations This Month" value={stats.donationsThisMonth} icon={IndianRupee} color="#b45014" />
        <StatCard title="Active Volunteers" value={stats.activeVolunteers} icon={Users} color="#6f42c1" link="/admin/volunteers" />
        <StatCard title="Upcoming Events" value={stats.upcomingEvents} icon={CalendarDays} trend={stats.upcomingEvents > 0 ? "in next 30 days" : null} color="#fd7e14" link="/admin/events" />
        <StatCard 
          title="Pending Actions" 
          value={stats.pendingActions} 
          icon={Bell} 
          trend={stats.pendingActions > 0 ? "needs attention" : null} 
          color="#dc3545" 
          link="/admin/messages" 
        />
      </div>

      {/* Row 2: Charts */}
      <div className={styles.chartsRow}>
        <div className={`${styles.chartCard} ${styles.leftChart}`}>
          <h3 className={styles.chartTitle}>Donations — Last 6 Months</h3>
          <div className={styles.chartBody}>
            {donationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={donationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, 'Amount']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                Insufficient data to display chart.
              </div>
            )}
          </div>
        </div>

        <div className={`${styles.chartCard} ${styles.rightChart}`}>
          <h3 className={styles.chartTitle}>Activity Distribution</h3>
          <div className={styles.chartBody}>
            {activityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                Insufficient data to display chart.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Quick Action Tables */}
      <div className={styles.tablesRow}>
        <div className={styles.tableSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent Donations</h3>
            <Link to="/admin/donations" className={styles.viewAllLink}>View All <ArrowRight size={16} /></Link>
          </div>
          <DataTable columns={donationColumns} data={recentDonations} isLoading={isDonationsLoading} />
        </div>

        <div className={styles.tableSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Pending Volunteers</h3>
            <Link to="/admin/volunteers" className={styles.viewAllLink}>View All <ArrowRight size={16} /></Link>
          </div>
          <DataTable columns={volunteerColumns} data={pendingVolunteers} isLoading={isVolunteersLoading} />
        </div>
      </div>

    </motion.div>
  );
};

export default Overview;
