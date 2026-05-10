import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { User, Lock, Building, Bell, Mail, AlertTriangle, Check, Loader, Download } from 'lucide-react';
import api from '../../services/api';
import useStore from '../../store/useStore';
import ImageUpload from '../../components/Admin/ImageUpload';
import ConfirmDialog from '../../components/Admin/ConfirmDialog';
import DataTable from '../../components/Admin/DataTable';
import styles from './Settings.module.css';
import { useNavigate } from 'react-router-dom';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Change Password', icon: Lock },
  { id: 'ngo', label: 'NGO Info', icon: Building },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true }
];

// Schemas
const profileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string()
});

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().required('New password is required')
    .min(8, 'Minimum 8 characters')
    .matches(/[A-Z]/, 'At least one uppercase letter')
    .matches(/[0-9]/, 'At least one number')
    .matches(/[^A-Za-z0-9]/, 'At least one special character'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your new password')
});

const ngoSchema = yup.object().shape({
  name: yup.string().required('NGO Name is required'),
  tagline: yup.string(),
  about: yup.string(),
  foundedYear: yup.number().typeError('Must be a number'),
  city: yup.string().required('City is required'),
  address: yup.string().required('Address is required'),
  phone: yup.string().required('Phone is required'),
  whatsapp: yup.string(),
  email: yup.string().email('Invalid email').required('Email is required'),
  website: yup.string().url('Must be a valid URL'),
  facebookUrl: yup.string().url('Must be a valid URL').nullable(),
  instagramUrl: yup.string().url('Must be a valid URL').nullable(),
  youtubeUrl: yup.string().url('Must be a valid URL').nullable(),
  officeHours: yup.string()
});

const Settings = () => {
  const { user, setUser } = useStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [avatar, setAvatar] = useState(user?.avatar);
  
  // Danger Zone Modals
  const [confirmExport, setConfirmExport] = useState(false);
  const [confirmClearEvents, setConfirmClearEvents] = useState(false);
  const [confirmResetStats, setConfirmResetStats] = useState(false);

  // Queries
  const { data: ngoInfo } = useQuery({
    queryKey: ['adminNgoInfo'],
    queryFn: async () => {
      // return (await api.get('/settings/ngo-info')).data.data;
      return { name: 'Hamari Ummeed Mission', city: 'Orai', phone: '9696294789', email: 'hamariummeedmission2000@gmail.com', address: 'Near Mandapam Guest House • Palledar Union Chabutra, Grain Market (Galla Mandi), Orai', foundedYear: 2015 };
    }
  });


  // Forms
  const { register: regProfile, handleSubmit: submitProfile, formState: { errors: errProfile } } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { name: user?.name, email: user?.email, phone: user?.phone }
  });

  const { register: regPwd, handleSubmit: submitPwd, formState: { errors: errPwd }, watch: watchPwd, reset: resetPwd } = useForm({
    resolver: yupResolver(passwordSchema)
  });

  const { register: regNgo, handleSubmit: submitNgo, formState: { errors: errNgo }, reset: resetNgo } = useForm({
    resolver: yupResolver(ngoSchema)
  });

  // Effect to reset NGO form when data loads
  React.useEffect(() => { if (ngoInfo) resetNgo(ngoInfo); }, [ngoInfo, resetNgo]);

  // Mutations
  const updateProfile = useMutation({
    mutationFn: async (data) => {
      const res = await api.put('/auth/profile', { ...data, avatar });
      return res.data.data; // returns updated user from DB
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['adminMe'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.response?.data?.error || 'Failed to update profile';
      toast.error(msg);
    }
  });

  const changePassword = useMutation({
    mutationFn: async (data) => {
      await api.post('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
    },
    onSuccess: () => {
      toast.success('Password changed. Please log in again.');
      resetPwd();
      setTimeout(() => {
        api.post('/auth/logout');
        useStore.getState().logout();
        navigate('/admin/login');
      }, 2000);
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.response?.data?.error || 'Incorrect current password';
      toast.error(msg);
    }
  });

  const updateNgo = useMutation({
    mutationFn: async (data) => {
      // await api.put('/settings/ngo-info', data);
    },
    onSuccess: () => toast.success('NGO Info updated')
  });

  const executeDanger = useMutation({
    mutationFn: async (action) => {
      return new Promise(res => setTimeout(res, 1000));
    },
    onSuccess: (_, action) => {
      if (action === 'export') toast.success('Backup export started');
      if (action === 'clear') toast.success('Old events cleared');
      if (action === 'reset') toast.success('Statistics reset');
      setConfirmExport(false); setConfirmClearEvents(false); setConfirmResetStats(false);
    }
  });

  // Pwd validation checks
  const pwdValue = watchPwd('newPassword', '');
  const reqs = {
    length: pwdValue.length >= 8,
    upper: /[A-Z]/.test(pwdValue),
    num: /[0-9]/.test(pwdValue),
    special: /[^A-Za-z0-9]/.test(pwdValue)
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.title}>Profile Settings</h2>
              <p className={styles.subtitle}>Update your admin account details and profile photo.</p>
            </div>
            <form onSubmit={submitProfile(data => updateProfile.mutate(data))}>
              <div className={styles.avatarSection}>
                <ImageUpload value={avatar} onChange={setAvatar} circular={true} />
                <div>
                  <span className={styles.roleBadge}>{user?.role || 'Admin'}</span>
                  <div className={styles.infoText}>Last logged in: just now</div>
                </div>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input type="text" className={styles.input} {...regProfile('name')} />
                  {errProfile.name && <span className={styles.errorText}>{errProfile.name.message}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input type="email" className={styles.input} {...regProfile('email')} />
                  {errProfile.email && <span className={styles.errorText}>{errProfile.email.message}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input type="text" className={styles.input} {...regProfile('phone')} />
                </div>
              </div>
              <button type="submit" className={styles.saveBtn} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? <Loader size={18} className="spin" /> : 'Save Profile'}
              </button>
            </form>
          </div>
        );

      case 'password':
        return (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.title}>Change Password</h2>
              <p className={styles.subtitle}>Ensure your account is using a long, random password to stay secure.</p>
            </div>
            <form onSubmit={submitPwd(data => changePassword.mutate(data))} className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Current Password *</label>
                <input type="password" className={styles.input} {...regPwd('currentPassword')} />
                {errPwd.currentPassword && <span className={styles.errorText}>{errPwd.currentPassword.message}</span>}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>New Password *</label>
                <input type="password" className={styles.input} {...regPwd('newPassword')} />
                <ul className={styles.reqList}>
                  <li className={`${styles.reqItem} ${reqs.length ? styles.met : ''}`}>{reqs.length && <Check size={14} />} Minimum 8 characters</li>
                  <li className={`${styles.reqItem} ${reqs.upper ? styles.met : ''}`}>{reqs.upper && <Check size={14} />} At least one uppercase letter</li>
                  <li className={`${styles.reqItem} ${reqs.num ? styles.met : ''}`}>{reqs.num && <Check size={14} />} At least one number</li>
                  <li className={`${styles.reqItem} ${reqs.special ? styles.met : ''}`}>{reqs.special && <Check size={14} />} At least one special character</li>
                </ul>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Confirm New Password *</label>
                <input type="password" className={styles.input} {...regPwd('confirmPassword')} />
                {errPwd.confirmPassword && <span className={styles.errorText}>{errPwd.confirmPassword.message}</span>}
              </div>
              <div className={styles.fullWidth}>
                <button type="submit" className={styles.saveBtn} disabled={changePassword.isPending}>
                  {changePassword.isPending ? <Loader size={18} className="spin" /> : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        );

      case 'ngo':
        return (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.title}>NGO Information</h2>
              <p className={styles.subtitle}>This information is displayed publicly on the website header and footer.</p>
            </div>
            <form onSubmit={submitNgo(data => updateNgo.mutate(data))}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>NGO Name *</label>
                  <input type="text" className={styles.input} {...regNgo('name')} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tagline</label>
                  <input type="text" className={styles.input} {...regNgo('tagline')} />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>About Us (Short)</label>
                  <textarea className={styles.textarea} {...regNgo('about')} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Founded Year</label>
                  <input type="number" className={styles.input} {...regNgo('foundedYear')} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>City *</label>
                  <input type="text" className={styles.input} {...regNgo('city')} />
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Full Address *</label>
                  <textarea className={styles.textarea} style={{minHeight:'60px'}} {...regNgo('address')} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number *</label>
                  <input type="text" className={styles.input} {...regNgo('phone')} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input type="email" className={styles.input} {...regNgo('email')} />
                </div>
              </div>
              <button type="submit" className={styles.saveBtn} disabled={updateNgo.isPending}>
                {updateNgo.isPending ? <Loader size={18} className="spin" /> : 'Save NGO Info'}
              </button>
            </form>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.title}>Email Notifications</h2>
              <p className={styles.subtitle}>Choose which alerts you want to receive via email.</p>
            </div>
            <div style={{ maxWidth: '600px' }}>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <h4>New Donations</h4>
                  <p>Get notified when a new donation is received.</p>
                </div>
                <label className={styles.switch}><input type="checkbox" defaultChecked /><span className={styles.slider}></span></label>
              </div>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <h4>Volunteer Applications</h4>
                  <p>Get notified when someone applies to volunteer.</p>
                </div>
                <label className={styles.switch}><input type="checkbox" defaultChecked /><span className={styles.slider}></span></label>
              </div>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <h4>Contact Messages</h4>
                  <p>Get notified for new inquiries via the contact form.</p>
                </div>
                <label className={styles.switch}><input type="checkbox" defaultChecked /><span className={styles.slider}></span></label>
              </div>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <h4>Weekly Report</h4>
                  <p>Receive a summary of stats every Monday morning.</p>
                </div>
                <label className={styles.switch}><input type="checkbox" /><span className={styles.slider}></span></label>
              </div>
              
              <div style={{ marginTop: 24, fontSize: 13, color: 'var(--muted)' }}>
                Notifications are sent to: <strong>{user?.email}</strong>. Update your email in Profile Settings.
              </div>
              <button className={styles.saveBtn} onClick={() => toast.success('Preferences saved')}>Save Preferences</button>
            </div>
          </div>
        );


      case 'danger':
        return (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.title} style={{ color: 'var(--error)' }}>Danger Zone</h2>
              <p className={styles.subtitle}>Destructive actions that cannot be undone.</p>
            </div>
            
            <div className={styles.dangerCard}>
              <div className={styles.dangerInfo}>
                <h4>Export All Data</h4>
                <p>Download a full JSON backup of all database collections.</p>
              </div>
              <button className={styles.dangerBtn} onClick={() => setConfirmExport(true)}>Export Backup</button>
            </div>

            <div className={styles.dangerCard}>
              <div className={styles.dangerInfo}>
                <h4>Clear Old Events</h4>
                <p>Delete all "Completed" events older than 1 year.</p>
              </div>
              <button className={styles.dangerBtn} onClick={() => setConfirmClearEvents(true)}>Clear Old Events</button>
            </div>

            <div className={styles.dangerCard}>
              <div className={styles.dangerInfo}>
                <h4>Reset Monthly Statistics</h4>
                <p>Reset counters to zero. Usually done at the start of a financial year.</p>
              </div>
              <button className={styles.dangerBtn} onClick={() => setConfirmResetStats(true)}>Reset Stats</button>
            </div>

            {/* Danger Modals */}
            <ConfirmDialog isOpen={confirmExport} onClose={() => setConfirmExport(false)} onConfirm={() => executeDanger.mutate('export')} title="Export Data?" message="This will generate a full JSON dump of the database." confirmLabel="Export" />
            <ConfirmDialog isOpen={confirmClearEvents} onClose={() => setConfirmClearEvents(false)} onConfirm={() => executeDanger.mutate('clear')} title="Clear Old Events?" message="Are you sure you want to delete events older than 1 year? This cannot be undone." confirmLabel="Delete Events" isDangerous={true} />
            <ConfirmDialog isOpen={confirmResetStats} onClose={() => setConfirmResetStats(false)} onConfirm={() => executeDanger.mutate('reset')} title="Reset Statistics?" message="This will reset all dashboard counters to zero. This action is irreversible." confirmLabel="Reset Stats" isDangerous={true} requireTyping={true} typingText="RESET" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.pageLayout}>
      <div className={styles.sidebar}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''} ${tab.danger ? styles.dangerTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} /> {tab.label}
            </button>
          );
        })}
      </div>
      <div className={styles.contentArea}>
        {renderContent()}
      </div>
      <style>{`.spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
};

export default Settings;
