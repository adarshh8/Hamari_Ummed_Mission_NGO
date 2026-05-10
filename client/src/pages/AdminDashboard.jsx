import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  LayoutDashboard, HeartHandshake, Users, Megaphone, Image as ImageIcon, 
  MessageSquare, Mail, Settings, LogOut, Menu, Bell, Search,
  TrendingUp, Activity, DollarSign, CheckCircle, Edit, Trash2, Eye
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import api from '../services/api';
import styles from '../styles/AdminDashboard.module.css';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'events', label: 'Events', icon: Megaphone },
  { id: 'rewardedChildren', label: 'Rewarded Children', icon: Users },
  { id: 'donations', label: 'Donations', icon: HeartHandshake },
  { id: 'volunteers', label: 'Volunteers', icon: Users },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'contacts', label: 'Messages', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const COLORS = ['#1B4332', '#D4A017', '#2A9D8F', '#E76F51', '#264653'];

const AdminDashboard = () => {
  const [activeModule, setActiveModule] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Server-side logout failed, but we still clear client state below
    } finally {
      logout();                        // clears user + localStorage token
      toast.success("Logged out successfully");
      navigate('/admin/login');
    }
  };

  if (!user) return null;

  // --- Subcomponents for Modules ---

  const OverviewModule = () => {
    const { data: stats } = useQuery({ queryKey: ['adminStats'], queryFn: async () => { const res = await api.get('/stats'); return res.data.data; } });
    
    const donationData = [];

    return (
      <div className="fade-in">
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(212, 175, 23, 0.1)', color: '#D4A017' }}><DollarSign size={24}/></div>
            <div className={styles.statInfo}><h4>Total Raised</h4><div className={styles.val}>₹{stats?.fundsRaised?.toLocaleString() || '0'}</div></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(42, 157, 143, 0.1)', color: '#2A9D8F' }}><Users size={24}/></div>
            <div className={styles.statInfo}><h4>Volunteers</h4><div className={styles.val}>{stats?.activeVolunteers || '0'}</div></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(27, 67, 50, 0.1)', color: '#1B4332' }}><Megaphone size={24}/></div>
            <div className={styles.statInfo}><h4>Upcoming Events</h4><div className={styles.val}>{stats?.upcomingEvents || '0'}</div></div>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3 style={{ marginBottom: '24px' }}>Donation Trends (Last 6 Months)</h3>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
              {donationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={donationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="val" stroke="var(--primary)" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p>Not enough data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };


  const EventsModule = () => {
    const { data: events, isLoading } = useQuery({ queryKey: ['adminEvents'], queryFn: async () => { const res = await api.get('/events'); return res.data.data; } });
    
    return (
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3>Manage Events</h3>
          <button className="btn btn-primary">Create New Event</button>
        </div>
        <div className={styles.tableCard}>
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? <tr><td colSpan="5">Loading...</td></tr> : events?.map(e => (
                  <tr key={e._id}>
                    <td style={{ fontWeight: '500' }}>{e.title}</td>
                    <td>{new Date(e.date).toLocaleDateString()}</td>
                    <td>{e.location}</td>
                    <td><span className={`${styles.statusBadge} ${styles[`status-${e.status}`]}`}>{e.status}</span></td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.actionBtn}><Edit size={16}/></button>
                        <button className={styles.actionBtn} style={{ color: 'var(--error)' }}><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const RewardedChildrenModule = () => {
    const { data: children, isLoading } = useQuery({ queryKey: ['adminRewardedChildren'], queryFn: async () => { const res = await api.get('/rewarded-children'); return res.data.data; } });
    
    return (
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3>Manage Rewarded Children</h3>
          <button className="btn btn-primary">Add Child Record</button>
        </div>
        <div className={styles.tableCard}>
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>School</th>
                  <th>Grade</th>
                  <th>Award</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? <tr><td colSpan="5">Loading...</td></tr> : children?.map(c => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: '500' }}>{c.name}</td>
                    <td>{c.school}</td>
                    <td>{c.grade}</td>
                    <td>{c.award} ({c.year})</td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.actionBtn}><Edit size={16}/></button>
                        <button className={styles.actionBtn} style={{ color: 'var(--error)' }}><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const VolunteersModule = () => {
    const { data: volunteers, isLoading } = useQuery({ queryKey: ['adminVolunteers'], queryFn: async () => { const res = await api.get('/volunteers'); return res.data.data; } });
    
    return (
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3>Volunteer Applications</h3>
        </div>
        <div className={styles.tableCard}>
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? <tr><td colSpan="5">Loading...</td></tr> : volunteers?.map(v => (
                  <tr key={v._id}>
                    <td style={{ fontWeight: '500' }}>{v.name}</td>
                    <td>{v.email}</td>
                    <td>{v.city}</td>
                    <td><span className={`${styles.statusBadge} ${styles[`status-${v.status || 'pending'}`]}`}>{v.status || 'Pending'}</span></td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.actionBtn}><Eye size={16}/></button>
                        <button className={styles.actionBtn} style={{ color: 'var(--error)' }}><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const ContactsModule = () => {
    const queryClient = useQueryClient();
    const { data: messages, isLoading } = useQuery({ queryKey: ['adminMessages'], queryFn: async () => { const res = await api.get('/contacts'); return res.data.data; } });
    
    const deleteMutation = useMutation({
      mutationFn: async (id) => {
        await api.delete(`/contacts/${id}`);
      },
      onSuccess: () => {
        toast.success('Message deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to delete message');
      }
    });

    const handleDelete = (id) => {
      if (window.confirm('Are you sure you want to delete this message?')) {
        deleteMutation.mutate(id);
      }
    };

    return (
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3>Contact Messages</h3>
        </div>
        <div className={styles.tableCard}>
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? <tr><td colSpan="5">Loading...</td></tr> : messages?.map(m => (
                  <tr key={m._id}>
                    <td style={{ fontWeight: '500' }}>{m.name}</td>
                    <td>{m.subject}</td>
                    <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td><span className={`${styles.statusBadge} ${styles[`status-${m.status || 'pending'}`]}`}>{m.status || 'Pending'}</span></td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.actionBtn}><Eye size={16}/></button>
                        <button className={styles.actionBtn} style={{ color: 'var(--error)' }} onClick={() => handleDelete(m._id)}><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const GalleryModule = () => {
    const { data: galleryItems, isLoading } = useQuery({ queryKey: ['adminGallery'], queryFn: async () => { const res = await api.get('/gallery'); return res.data.data; } });
    
    return (
      <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h3>Manage Gallery</h3>
          <button className="btn btn-primary">Add New Image</button>
        </div>
        <div className={styles.tableCard}>
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title / Caption</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? <tr><td colSpan="5">Loading...</td></tr> : galleryItems?.map(g => (
                  <tr key={g._id}>
                    <td>
                      <img src={g.imageUrl} alt={g.title || 'Gallery Image'} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td style={{ fontWeight: '500' }}>{g.title || g.caption}</td>
                    <td style={{ textTransform: 'capitalize' }}>{g.category}</td>
                    <td>{g.location}</td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.actionBtn}><Edit size={16}/></button>
                        <button className={styles.actionBtn} style={{ color: 'var(--error)' }}><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const PlaceholderModule = ({ name }) => (
    <div className="fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--muted)' }}>
      <h2>{name} Module - Coming Soon</h2>
    </div>
  );

  const renderModule = () => {
    switch (activeModule) {
      case 'overview': return <OverviewModule />;
      case 'events': return <EventsModule />;
      case 'rewardedChildren': return <RewardedChildrenModule />;
      case 'volunteers': return <VolunteersModule />;
      case 'contacts': return <ContactsModule />;
      case 'donations': return <PlaceholderModule name="Donations" />;
      case 'gallery': return <GalleryModule />;
      case 'settings': return <PlaceholderModule name="Settings" />;
      default: return <OverviewModule />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Hamari Ummeed</title>
      </Helmet>

      <div className={styles.adminLayout}>
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>Hamari Ummeed</div>
          </div>
          <div className={styles.navList}>
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <div 
                  key={item.id} 
                  className={`${styles.navItem} ${activeModule === item.id ? styles.active : ''}`}
                  onClick={() => { setActiveModule(item.id); setSidebarOpen(false); }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && <div className={styles.slidePanelOverlay} onClick={() => setSidebarOpen(false)} style={{ zIndex: 90 }} />}

        {/* Main Content */}
        <main className={styles.mainContent}>
          <header className={styles.topbar}>
            <div className={styles.topbarLeft}>
              <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}><Menu size={24}/></button>
              <h2 className={styles.pageTitle}>{navItems.find(i => i.id === activeModule)?.label}</h2>
            </div>
            <div className={styles.topbarRight}>
              <div className={styles.searchBox}>
                <Search size={18} className={styles.searchIcon} />
                <input type="text" placeholder="Search..." className={styles.searchInput} />
              </div>
              <button className={styles.iconBtn}>
                <Bell size={20} />
                <span className={styles.badge}>3</span>
              </button>
              <div className={styles.adminProfile}>
                <div className={styles.avatar}>{user.name.charAt(0)}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'capitalize' }}>{user.role}</span>
                </div>
              </div>
            </div>
          </header>

          <div className={styles.moduleContainer}>
            {renderModule()}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
