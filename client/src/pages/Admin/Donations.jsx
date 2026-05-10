import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Printer, Download, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/Admin/DataTable';
import SearchFilter from '../../components/Admin/SearchFilter';
import StatusBadge from '../../components/Admin/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Donations.module.css';

const Donations = () => {
  const queryClient = useQueryClient();
  
  const [search, setSearch] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Queries
  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['adminDonations', search, filterPurpose, filterStatus],
    queryFn: async () => {
      let url = '/donations?limit=100';
      if (search) url += `&search=${search}`;
      if (filterPurpose !== 'all') url += `&purpose=${filterPurpose}`;
      if (filterStatus !== 'all') url += `&status=${filterStatus}`;
      
      const res = await api.get(url);
      return res.data.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await api.put(`/donations/${id}/status`, { status });
      return res.data.data;
    },
    onSuccess: (data) => {
      toast.success('Status updated successfully');
      queryClient.setQueryData(['adminDonations', search, filterPurpose, filterStatus], old => 
        old.map(d => d._id === data.id ? { ...d, status: data.status } : d)
      );
    }
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }) => {
      await api.put(`/donations/${id}`, { adminNotes: notes });
    },
    onSuccess: () => toast.success('Notes saved')
  });

  const handleStatusChange = (e, id) => {
    e.stopPropagation();
    updateStatusMutation.mutate({ id, status: e.target.value });
  };

  const handleRowClick = (row) => {
    if (expandedRow === row._id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(row._id);
      setAdminNotes(row.adminNotes || '');
    }
  };

  const handleNotesBlur = (id) => {
    const donation = donations.find(d => d._id === id);
    if (donation && donation.adminNotes !== adminNotes) {
      updateNotesMutation.mutate({ id, notes: adminNotes });
      // optimistic update
      queryClient.setQueryData(['adminDonations', search, filterPurpose, filterStatus], old => 
        old.map(d => d._id === id ? { ...d, adminNotes } : d)
      );
    }
  };

  const printReceipt = (e, donation) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt ${donation.receiptNo}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .receipt { max-width: 600px; margin: 0 auto; border: 2px solid #1B4332; padding: 30px; border-radius: 12px; }
            .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
            h1 { color: #1B4332; margin: 0 0 10px 0; }
            .row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px dashed #eee; padding-bottom: 8px; }
            .label { font-weight: bold; color: #666; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            .amount { font-size: 24px; font-weight: bold; color: #28a745; text-align: right; margin: 20px 0; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h1>Hamari Ummeed Mission</h1>
              <p>Official Donation Receipt</p>
            </div>
            <div class="row"><span class="label">Receipt No:</span> <span>${donation.receiptNo}</span></div>
            <div class="row"><span class="label">Date:</span> <span>${new Date(donation.date).toLocaleDateString()}</span></div>
            <div class="row"><span class="label">Received From:</span> <span>${donation.name}</span></div>
            <div class="row"><span class="label">Payment Method:</span> <span>${donation.method}</span></div>
            <div class="row"><span class="label">Purpose:</span> <span>${donation.purpose}</span></div>
            
            <div class="amount">₹${donation.amount.toLocaleString()}</div>
            
            <div class="footer">
              <p>Thank you for your generous contribution to our mission.</p>
              <p>80G Registration No: HUM-12345678</p>
            </div>
          </div>
          <div style="text-align:center; margin-top: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #1B4332; color: white; border: none; cursor: pointer; font-size: 16px; border-radius: 6px;">Print Receipt</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const exportCSV = () => {
    // Basic CSV export logic
    const headers = ['Receipt No', 'Date', 'Name', 'Email', 'Amount', 'Purpose', 'Status'];
    const csvContent = [
      headers.join(','),
      ...donations.map(d => [
        d.receiptNo,
        new Date(d.date).toLocaleDateString(),
        `"${d.name}"`,
        d.email,
        d.amount,
        d.purpose,
        d.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `donations_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { header: '# Receipt', accessor: 'receiptNo' },
    { header: 'Donor Name', accessor: row => <span style={{ fontWeight: row.anonymous ? 400 : 600, color: row.anonymous ? 'var(--muted)' : 'inherit' }}>{row.name}</span> },
    { header: 'Date', accessor: row => new Date(row.date).toLocaleDateString() },
    { header: 'Amount', accessor: row => <span className={styles.amount}>₹{row.amount.toLocaleString()}</span> },
    { header: 'Purpose', accessor: 'purpose' },
    { header: 'Status', accessor: row => (
        <select 
          value={row.status} 
          onChange={(e) => handleStatusChange(e, row._id)}
          onClick={(e) => e.stopPropagation()}
          className={`${styles.statusSelect} ${styles[row.status]}`}
        >
          <option value="pending">Pending</option>
          <option value="received">Received</option>
          <option value="confirmed">Confirmed</option>
        </select>
      ) 
    },
    { header: 'Actions', accessor: row => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`${styles.actionBtn} ${styles.printBtn}`} onClick={(e) => printReceipt(e, row)} title="Print Receipt"><Printer size={16} /></button>
          <button className={`${styles.actionBtn} ${styles.viewBtn}`} title="View Details">
            {expandedRow === row._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      ) 
    }
  ];

  // Stats calculation
  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const confirmedCount = donations.filter(d => d.status === 'confirmed').length;
  const pendingCount = donations.filter(d => d.status === 'pending').length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthTotal = donations
    .filter(d => {
      const dDate = new Date(d.date);
      return dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear;
    })
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 24px 0' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', color: 'var(--dark)', margin: 0 }}>Donations</h1>
        <button className={styles.exportBtn} onClick={exportCSV}>
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <p className={styles.statTitle}>Total Received (All Time)</p>
          <p className={styles.statValue}>₹{totalAmount.toLocaleString()}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statTitle}>This Month</p>
          <p className={`${styles.statValue} ${styles.green}`}>₹{thisMonthTotal.toLocaleString()}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statTitle}>Number of Donations</p>
          <p className={styles.statValue}>{donations.length}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statTitle}>Pending Confirmations</p>
          <p className={`${styles.statValue} ${pendingCount > 0 ? styles.red : ''}`}>{pendingCount}</p>
        </div>
      </div>

      <SearchFilter 
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search by donor name or email..."
        filters={[
          { key: 'purpose', value: filterPurpose, options: [
              {value:'all', label:'All Purposes'},
              {value:'Education', label:'Education'},
              {value:'Elder Care', label:'Elder Care'},
              {value:'General', label:'General'}
            ], default: 'all' 
          },
          { key: 'status', value: filterStatus, options: [
              {value:'all', label:'All Status'},
              {value:'pending', label:'Pending'},
              {value:'received', label:'Received'},
              {value:'confirmed', label:'Confirmed'}
            ], default: 'all' 
          }
        ]}
        onFilterChange={(key, val) => {
          if (key === 'purpose') setFilterPurpose(val);
          if (key === 'status') setFilterStatus(val);
        }}
      />

      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee', background: '#f8f9fa' }}>
              {columns.map((col, idx) => (
                <th key={idx} style={{ padding: '16px', textAlign: 'left', color: 'var(--muted)', fontSize: '13px', textTransform: 'uppercase', fontWeight: 600 }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {donations.map((row) => (
              <React.Fragment key={row._id}>
                <tr 
                  onClick={() => handleRowClick(row)}
                  style={{ 
                    borderBottom: expandedRow === row._id ? 'none' : '1px solid #eee',
                    cursor: 'pointer',
                    background: expandedRow === row._id ? '#f8f9fa' : 'white',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => { if (expandedRow !== row._id) e.currentTarget.style.backgroundColor = '#fbfcfd' }}
                  onMouseLeave={(e) => { if (expandedRow !== row._id) e.currentTarget.style.backgroundColor = 'white' }}
                >
                  {columns.map((col, j) => (
                    <td key={j} style={{ padding: '16px', fontSize: '14px', color: 'var(--text)' }}>
                      {typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
                {/* Expanded Details Row */}
                <AnimatePresence>
                  {expandedRow === row._id && (
                    <tr>
                      <td colSpan={columns.length} style={{ padding: 0 }}>
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className={styles.expandedRow}
                        >
                          <div className={styles.expandedContent}>
                            <div>
                              <div className={styles.detailGroup}>
                                <span className={styles.detailLabel}>Contact Info</span>
                                <div className={styles.detailValue}>
                                  {row.email}<br/>
                                  {row.phone}
                                </div>
                              </div>
                              <div className={styles.detailGroup}>
                                <span className={styles.detailLabel}>Transaction Details</span>
                                <div className={styles.detailValue}>
                                  Method: {row.method}<br/>
                                  Ref ID: <span style={{ fontFamily: 'monospace' }}>{row.txId}</span>
                                </div>
                              </div>
                              {row.message && (
                                <div className={styles.detailGroup}>
                                  <span className={styles.detailLabel}>Message from Donor</span>
                                  <div className={styles.detailValue} style={{ fontStyle: 'italic', background: '#fff', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--secondary)' }}>
                                    "{row.message}"
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <div className={styles.detailGroup}>
                                <span className={styles.detailLabel}>Admin Notes (Private)</span>
                                <textarea 
                                  className={styles.notesArea}
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  onBlur={() => handleNotesBlur(row._id)}
                                  placeholder="Add internal notes about this donation..."
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              {row.status !== 'confirmed' && (
                                <button 
                                  className={styles.quickActionBtn}
                                  onClick={(e) => handleStatusChange({ target: { value: 'confirmed' }, stopPropagation: () => {} }, row._id)}
                                >
                                  Mark as Confirmed
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Donations;
