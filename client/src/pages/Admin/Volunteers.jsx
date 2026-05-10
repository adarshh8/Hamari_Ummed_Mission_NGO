import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Check, X as CloseIcon, Loader, Trash2 } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/Admin/DataTable';
import SearchFilter from '../../components/Admin/SearchFilter';
import StatusBadge from '../../components/Admin/StatusBadge';
import ConfirmDialog from '../../components/Admin/ConfirmDialog';
import styles from './Volunteers.module.css';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'active', label: 'Active' }
];

const Volunteers = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [filterInterest, setFilterInterest] = useState('all');
  
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [rejectConfirmId, setRejectConfirmId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Queries
  const { data: volunteers = [], isLoading } = useQuery({
    queryKey: ['adminVolunteers', search, filterInterest, activeTab],
    queryFn: async () => {
      let url = '/volunteers?limit=100';
      if (search) url += `&search=${search}`;
      if (filterInterest !== 'all') url += `&interest=${filterInterest}`;
      if (activeTab !== 'all') url += `&status=${activeTab}`;
      
      const res = await api.get(url);
      return res.data.data;
    }
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['adminActivitiesDropdown'],
    queryFn: async () => {
      const res = await api.get('/activities?limit=20');
      return res.data.data;
    }
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await api.put(`/volunteers/${id}/status`, { status });
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['adminVolunteers', search, filterInterest, activeTab], old => 
        old.map(v => v._id === data.id ? { ...v, status: data.status } : v)
      );
      toast.success(data.status === 'approved' ? 'Volunteer approved! Email sent.' : 'Application rejected.');
      if (selectedVolunteer && selectedVolunteer._id === data.id) {
        setSelectedVolunteer(prev => ({ ...prev, status: data.status }));
      }
    }
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }) => {
      await api.put(`/volunteers/${id}`, { adminNotes: notes });
    },
    onSuccess: () => toast.success('Notes saved')
  });

  const assignProgramMutation = useMutation({
    mutationFn: async ({ id, programId }) => {
      await api.put(`/volunteers/${id}`, { assignedProgram: programId });
    },
    onSuccess: () => toast.success('Program assigned')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/volunteers/${id}`);
      return id;
    },
    onSuccess: (id) => {
      toast.success('Volunteer removed successfully');
      queryClient.setQueryData(['adminVolunteers', search, filterInterest, activeTab], old => 
        old.filter(v => v._id !== id)
      );
      if (selectedVolunteer && selectedVolunteer._id === id) {
        closePanel();
      }
    }
  });

  // Handlers
  const handleApprove = (id) => {
    updateStatusMutation.mutate({ id, status: 'approved' });
  };

  const handleReject = () => {
    updateStatusMutation.mutate({ id: rejectConfirmId, status: 'rejected' });
    setRejectConfirmId(null);
  };

  const handleDelete = () => {
    deleteMutation.mutate(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const openPanel = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setAdminNotes(volunteer.adminNotes || '');
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    if (selectedVolunteer && selectedVolunteer.adminNotes !== adminNotes) {
      updateNotesMutation.mutate({ id: selectedVolunteer._id, notes: adminNotes });
      queryClient.setQueryData(['adminVolunteers', search, filterInterest, activeTab], old => 
        old.map(v => v._id === selectedVolunteer._id ? { ...v, adminNotes } : v)
      );
    }
    setIsPanelOpen(false);
    setTimeout(() => setSelectedVolunteer(null), 300);
  };

  // Columns
  const columns = [
    { header: 'Photo', accessor: row => (
      row.photo ? <img src={row.photo} alt="avatar" className={styles.photo} /> : 
      <div className={styles.initials}>{row.name.charAt(0)}</div>
    )},
    { header: 'Name', accessor: row => <div style={{ fontWeight: 600 }}>{row.name}<div style={{fontSize:'12px', color:'var(--muted)', fontWeight:400}}>{row.phone}</div></div> },
    { header: 'Interest', accessor: row => row.areasOfInterest?.join(', ') || 'General' },
    { header: 'Availability', accessor: 'availability' },
    { header: 'Applied', accessor: row => new Date(row.appliedDate).toLocaleDateString() },
    { header: 'Status', accessor: row => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: row => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`${styles.actionBtn} ${styles.viewBtn}`} onClick={() => openPanel(row)} title="View Full Application"><Eye size={18} /></button>
          {row.status === 'pending' && (
            <>
              <button className={`${styles.actionBtn} ${styles.approveBtn}`} onClick={() => handleApprove(row._id)} title="Approve"><Check size={18} /></button>
              <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => setRejectConfirmId(row._id)} title="Reject"><CloseIcon size={18} /></button>
            </>
          )}
          <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => setDeleteConfirmId(row._id)} title="Remove"><Trash2 size={18} /></button>
        </div>
      ) 
    }
  ];

  const getTabCount = (tabId) => {
    if (tabId === 'all') return volunteers.length;
    return volunteers.filter(v => v.status === tabId).length;
  };

  return (
    <div className={styles.pageContainer}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', margin: '0 0 24px 0', color: 'var(--dark)' }}>Volunteers</h1>
      
      <div className={styles.tabsContainer}>
        {TABS.map(tab => (
          <button 
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''} ${tab.id === 'pending' ? styles.pending : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className={styles.tabBadge}>{getTabCount(tab.id)}</span>
          </button>
        ))}
      </div>

      <SearchFilter 
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search by name, email, phone..."
        filters={[
          { key: 'interest', value: filterInterest, options: [
              {value:'all', label:'All Interests'},
              {value:'Teaching', label:'Teaching'},
              {value:'Event Help', label:'Event Help'},
              {value:'Door-to-Door', label:'Door-to-Door'}
            ], default: 'all' 
          }
        ]}
        onFilterChange={(key, val) => {
          if (key === 'interest') setFilterInterest(val);
        }}
      />

      <DataTable 
        columns={columns} 
        data={activeTab === 'all' ? volunteers : volunteers.filter(v => v.status === activeTab)} 
        isLoading={isLoading} 
        onRowClick={openPanel}
      />

      {/* Slide-over Panel */}
      <AnimatePresence>
        {isPanelOpen && selectedVolunteer && (
          <>
            <motion.div 
              className={styles.panelOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
            />
            <motion.div 
              className={styles.panel}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className={styles.panelHeader}>
                <div className={styles.headerProfile}>
                  {selectedVolunteer.photo ? 
                    <img src={selectedVolunteer.photo} className={styles.panelPhoto} alt="profile" /> : 
                    <div className={styles.initials} style={{ width: 64, height: 64, fontSize: 24 }}>{selectedVolunteer.name.charAt(0)}</div>
                  }
                  <div>
                    <h2 className={styles.panelName}>{selectedVolunteer.name}</h2>
                    <StatusBadge status={selectedVolunteer.status} />
                  </div>
                </div>
                <button className={styles.closeBtn} onClick={closePanel}><CloseIcon size={24} /></button>
              </div>

              <div className={styles.panelBody}>
                <div className={styles.infoSection}>
                  <h4 className={styles.sectionTitle}>Contact Info</h4>
                  <div className={styles.infoRow}><span className={styles.infoLabel}>Email</span><span className={styles.infoValue}>{selectedVolunteer.email}</span></div>
                  <div className={styles.infoRow}><span className={styles.infoLabel}>Phone</span><span className={styles.infoValue}>{selectedVolunteer.phone}</span></div>
                  <div className={styles.infoRow}><span className={styles.infoLabel}>Age</span><span className={styles.infoValue}>{selectedVolunteer.age} years</span></div>
                  <div className={styles.infoRow}><span className={styles.infoLabel}>Address</span><span className={styles.infoValue}>{selectedVolunteer.address}</span></div>
                </div>

                <div className={styles.infoSection}>
                  <h4 className={styles.sectionTitle}>Interests & Availability</h4>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Interests</span>
                    <div className={styles.pillGroup}>
                      {selectedVolunteer.areasOfInterest?.map((area, i) => <span key={i} className={styles.pill}>{area}</span>)}
                    </div>
                  </div>
                  <div className={styles.infoRow}><span className={styles.infoLabel}>Availability</span><span className={styles.infoValue}>{selectedVolunteer.availability}</span></div>
                </div>

                <div className={styles.infoSection}>
                  <h4 className={styles.sectionTitle}>Motivation</h4>
                  <div className={styles.motivationBox}>
                    "{selectedVolunteer.motivation}"
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h4 className={styles.sectionTitle}>Admin Notes (Internal)</h4>
                  <textarea 
                    className={styles.notesArea} 
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add private notes about this applicant..."
                  />
                </div>

                {selectedVolunteer.status === 'approved' && (
                  <div className={styles.infoSection}>
                    <h4 className={styles.sectionTitle}>Assigned Program</h4>
                    <select 
                      className={styles.selectProgram}
                      value={selectedVolunteer.assignedProgram || ''}
                      onChange={(e) => assignProgramMutation.mutate({ id: selectedVolunteer._id, programId: e.target.value })}
                    >
                      <option value="">-- Assign to a program --</option>
                      {activities.map(a => <option key={a._id} value={a._id}>{a.title}</option>)}
                      <option value="Health Campaign">Health Campaign (Mock)</option>
                    </select>
                  </div>
                )}
              </div>

              <div className={styles.panelFooter}>
                {selectedVolunteer.status === 'pending' && (
                  <>
                    <button 
                      className={`${styles.btnFull} ${styles.btnApprove}`}
                      onClick={() => { handleApprove(selectedVolunteer._id); closePanel(); }}
                    >
                      <Check size={20} /> Approve Application
                    </button>
                    <button 
                      className={`${styles.btnFull} ${styles.btnReject}`}
                      onClick={() => { setRejectConfirmId(selectedVolunteer._id); closePanel(); }}
                    >
                      <CloseIcon size={20} /> Reject
                    </button>
                  </>
                )}
                {selectedVolunteer.status === 'approved' && (
                  <button 
                    className={`${styles.btnFull}`} style={{ background: '#0056b3', color: 'white' }}
                    onClick={() => updateStatusMutation.mutate({ id: selectedVolunteer._id, status: 'active' })}
                  >
                    Mark as Active
                  </button>
                )}
                {selectedVolunteer.status === 'active' && (
                  <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '14px' }}>
                    This volunteer is currently active.
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={!!rejectConfirmId}
        onClose={() => setRejectConfirmId(null)}
        onConfirm={handleReject}
        title="Reject Application?"
        message="Are you sure you want to reject this volunteer application? An email will be sent to notify them."
        confirmLabel="Confirm Reject"
        isDangerous={true}
      />
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Remove Volunteer?"
        message="Are you sure you want to permanently remove this volunteer? This action cannot be undone."
        confirmLabel="Delete Volunteer"
        isDangerous={true}
      />
    </div>
  );
};

export default Volunteers;
