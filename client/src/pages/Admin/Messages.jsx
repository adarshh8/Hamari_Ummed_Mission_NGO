import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Mail, Search, Trash2, Archive, Reply, MoreVertical, Loader } from 'lucide-react';
import api from '../../services/api';
import StatusBadge from '../../components/Admin/StatusBadge';
import ConfirmDialog from '../../components/Admin/ConfirmDialog';
import styles from './Messages.module.css';

const TABS = ['All', 'New', 'Read', 'Replied', 'Closed'];

const Messages = () => {
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  
  const [replyText, setReplyText] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  // Queries
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['adminMessages', activeTab, search],
    queryFn: async () => {
      let url = '/contact?limit=100';
      if (search) url += `&search=${search}`;
      if (activeTab !== 'all') url += `&status=${activeTab}`;
      
      const res = await api.get(url);
      return res.data.data;
    }
  });

  const selectedMsg = messages.find(m => m._id === selectedMsgId);

  // When a message is selected, initialize notes
  useEffect(() => {
    if (selectedMsg) {
      setAdminNotes(selectedMsg.adminNotes || '');
      setReplyText('');
      
      // Auto-mark as read if it was new
      if (selectedMsg.status === 'new') {
        updateStatusMutation.mutate({ id: selectedMsg._id, status: 'read' });
      }
    }
  }, [selectedMsgId]);

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await api.put(`/contact/${id}`, { status });
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['adminMessages', activeTab, search], old => 
        old.map(m => m._id === data.id ? { ...m, status: data.status } : m)
      );
    }
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }) => {
      await api.put(`/contact/${id}`, { adminNotes: notes });
    },
    onSuccess: () => toast.success('Notes saved')
  });

  const replyMutation = useMutation({
    mutationFn: async ({ id, reply }) => {
      await api.post(`/contact/${id}/reply`, { reply });
    },
    onSuccess: () => {
      toast.success('Reply sent successfully via Email');
      updateStatusMutation.mutate({ id: selectedMsgId, status: 'replied' });
      setReplyText('');
    },
    onError: () => toast.error('Failed to send reply')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/contact/${id}`);
    },
    onSuccess: () => {
      toast.success('Message deleted');
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
      if (selectedMsgId === deleteId) setSelectedMsgId(null);
      setDeleteId(null);
    }
  });

  const handleNotesBlur = () => {
    if (selectedMsg && selectedMsg.adminNotes !== adminNotes) {
      updateNotesMutation.mutate({ id: selectedMsg._id, notes: adminNotes });
      queryClient.setQueryData(['adminMessages', activeTab, search], old => 
        old.map(m => m._id === selectedMsg._id ? { ...m, adminNotes } : m)
      );
    }
  };

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Stats
  const totalCount = messages.length;
  const newCount = messages.filter(m => m.status === 'new').length;
  const repliedCount = messages.filter(m => m.status === 'replied').length;
  const closedCount = messages.filter(m => m.status === 'closed').length;

  return (
    <div className={styles.pageContainer}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', margin: '0 0 16px 0', color: 'var(--dark)' }}>Messages</h1>
      
      <div className={styles.statsRow}>
        <div className={styles.statPill}>Total: {totalCount}</div>
        <div className={`${styles.statPill} ${newCount > 0 ? styles.new : ''}`}>New: {newCount}</div>
        <div className={styles.statPill}>Replied: {repliedCount}</div>
        <div className={styles.statPill}>Closed: {closedCount}</div>
      </div>

      <div className={styles.inboxLayout}>
        {/* Left Panel - Message List */}
        <div className={styles.listPanel}>
          <div className={styles.searchHeader}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--muted)' }} />
              <input 
                type="text" 
                className={styles.searchBox} 
                placeholder="Search messages..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 36, marginBottom: 12 }}
              />
            </div>
            <div className={styles.tabs}>
              {TABS.map(tab => (
                <button 
                  key={tab} 
                  className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
                  onClick={() => { setActiveTab(tab); setSelectedMsgId(null); }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.messageList}>
            {isLoading ? (
              <div style={{ padding: 20, textAlign: 'center' }}><Loader className="spin" /></div>
            ) : messages.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>No messages found.</div>
            ) : (
              messages.map(msg => (
                <div 
                  key={msg._id} 
                  className={`${styles.messageItem} ${selectedMsgId === msg._id ? styles.selected : ''} ${msg.status === 'new' ? styles.unread : ''}`}
                  onClick={() => setSelectedMsgId(msg._id)}
                >
                  {msg.status === 'new' && <div className={styles.unreadDot} style={{ position: 'absolute', left: 8, top: 22 }} />}
                  <div className={styles.itemHeader}>
                    <h4 className={`${styles.senderName} ${msg.status === 'new' ? styles.unread : ''}`}>{msg.name}</h4>
                    <span className={styles.time}>{getTimeAgo(msg.createdAt)}</span>
                  </div>
                  <p className={styles.subject}>{msg.subject}</p>
                  <span className={styles.categoryBadge}>{msg.category}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Message Detail */}
        <div className={styles.detailPanel}>
          {!selectedMsg ? (
            <div className={styles.emptyState}>
              <Mail size={48} color="#ddd" style={{ marginBottom: 16 }} />
              <p>Select a message to read</p>
            </div>
          ) : (
            <>
              <div className={styles.detailHeader}>
                <div className={styles.detailTopRow}>
                  <div>
                    <h2 className={styles.detailSender}>{selectedMsg.name}</h2>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className={styles.categoryBadge}>{selectedMsg.category}</span>
                      <StatusBadge status={selectedMsg.status} />
                      <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 8 }}>
                        {new Date(selectedMsg.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className={styles.quickActions}>
                    <button className={styles.iconBtn} title="Mark as Unread" onClick={() => updateStatusMutation.mutate({ id: selectedMsg._id, status: 'new' })}><Mail size={18} /></button>
                    <button className={styles.iconBtn} title="Archive/Close" onClick={() => updateStatusMutation.mutate({ id: selectedMsg._id, status: 'closed' })}><Archive size={18} /></button>
                    <button className={styles.iconBtn} style={{ color: 'var(--error)' }} title="Delete" onClick={() => setDeleteId(selectedMsg._id)}><Trash2 size={18} /></button>
                  </div>
                </div>

                <div className={styles.contactBox}>
                  <div className={styles.contactRow}>
                    <span className={styles.contactLabel}>Email:</span>
                    <a href={`mailto:${selectedMsg.email}`} className={styles.contactLink}>{selectedMsg.email}</a>
                  </div>
                  {selectedMsg.phone && (
                    <div className={styles.contactRow}>
                      <span className={styles.contactLabel}>Phone:</span>
                      <a href={`tel:${selectedMsg.phone}`} className={styles.contactLink}>{selectedMsg.phone}</a>
                    </div>
                  )}
                  <div className={styles.contactRow}>
                    <span className={styles.contactLabel}>Subject:</span>
                    <span className={styles.contactValue}>{selectedMsg.subject}</span>
                  </div>
                </div>
              </div>

              <div className={styles.detailBody}>
                <div className={styles.messageContent}>
                  {selectedMsg.message}
                </div>

                <div className={styles.adminNotesSection}>
                  <h4 className={styles.sectionTitle}>Private Notes (Not visible to sender)</h4>
                  <textarea 
                    className={styles.textarea}
                    placeholder="Add internal notes here..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    onBlur={handleNotesBlur}
                  />
                </div>

                <div className={styles.statusUpdateRow}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Update Status:</span>
                  <select 
                    className={styles.statusSelect} 
                    value={selectedMsg.status}
                    onChange={(e) => updateStatusMutation.mutate({ id: selectedMsg._id, status: e.target.value })}
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className={styles.replySection}>
                  <h4 className={styles.sectionTitle}>Send Reply via Email</h4>
                  <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--muted)' }}>
                    To: <strong>{selectedMsg.email}</strong>
                  </div>
                  <textarea 
                    className={styles.textarea}
                    placeholder={`Draft your reply to ${selectedMsg.name}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={{ minHeight: 120 }}
                  />
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                    A standard signature will be automatically appended to your message.
                  </div>
                  <button 
                    className={styles.replyBtn} 
                    disabled={!replyText.trim() || replyMutation.isPending}
                    onClick={() => replyMutation.mutate({ id: selectedMsg._id, reply: replyText })}
                  >
                    {replyMutation.isPending ? <Loader size={18} className="spin" /> : <Reply size={18} />}
                    Send Email Reply
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        title="Delete Message?"
        message="This will permanently delete this message. This cannot be undone."
        confirmLabel="Delete"
        isDangerous={true}
      />
      <style>{`.spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
};

export default Messages;

