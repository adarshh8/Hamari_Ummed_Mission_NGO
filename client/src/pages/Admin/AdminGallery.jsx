import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Star, CheckSquare, X, UploadCloud, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import api from '../../services/api';
import ConfirmDialog from '../../components/Admin/ConfirmDialog';
import ImageUpload from '../../components/Admin/ImageUpload';
import FormModal from '../../components/Admin/FormModal';
import styles from './AdminGallery.module.css';

const TABS = ['All', 'Children', 'Events', 'Volunteers', 'Awards', 'Elder Care'];

// Maps display tab name → DB category enum value
const TAB_TO_CATEGORY = {
  'Children': 'children',
  'Events': 'events',
  'Volunteers': 'volunteers',
  'Awards': 'awards',
  'Elder Care': 'elderly'
};

const AdminGallery = () => {
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [deleteId, setDeleteId] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(null);
  
  // Upload State
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadCategory, setUploadCategory] = useState('Children');
  const [uploadEvent, setUploadEvent] = useState('');
  const [uploadLocation, setUploadLocation] = useState('');

  // Queries
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['adminGallery', activeTab],
    queryFn: async () => {
      let url = '/gallery?limit=200';
      if (activeTab !== 'All') url += `&category=${TAB_TO_CATEGORY[activeTab] || activeTab.toLowerCase()}`;
      const res = await api.get(url);
      return res.data.data || [];
    }
  });

  const { data: events = [] } = useQuery({
    queryKey: ['adminEventsList'],
    queryFn: async () => {
      const res = await api.get('/events?limit=50');
      return res.data.data;
    }
  });

  // Mutations
  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ id, featured }) => {
      const res = await api.put(`/gallery/${id}`, { featured });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGallery'] });
    },
    onError: () => toast.error('Failed to update')
  });

  const updateCaptionMutation = useMutation({
    mutationFn: async ({ id, caption }) => {
      await api.put(`/gallery/${id}`, { caption });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGallery'] });
      toast.success('Caption updated');
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ files, category, event, location }) => {
      // Upload each image URL as a separate gallery entry
      const dbCategory = TAB_TO_CATEGORY[category] || category.toLowerCase();
      const uploadPromises = (Array.isArray(files) ? files : [files]).map(imageUrl => {
        const payload = {
          title: location || category || 'Gallery Photo',
          imageUrl,
          category: dbCategory,
          location: location || 'Orai',
          featured: false
        };
        if (event) payload.event = event;
        return api.post('/gallery/url', payload);
      });
      await Promise.all(uploadPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGallery'] });
      toast.success('Photos uploaded successfully');
      setIsUploadOpen(false);
      setUploadFiles([]);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Upload failed')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGallery'] });
      toast.success('Photo deleted');
      setDeleteId(null);
      if (viewPhoto) setViewPhoto(null);
      setSelectedIds(prev => prev.filter(i => i !== deleteId));
    },
    onError: () => toast.error('Failed to delete photo')
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(ids.map(id => api.delete(`/gallery/${id}`)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGallery'] });
      toast.success('Selected photos deleted');
      setSelectedIds([]);
      setBulkDeleteConfirm(false);
      setIsSelectMode(false);
    },
    onError: () => toast.error('Failed to delete selected photos')
  });

  // Handlers
  const handleToggleSelect = (e, id) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(photos.map(p => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleFeature = (e, photo) => {
    e.stopPropagation();
    toggleFeatureMutation.mutate({ id: photo._id, featured: !photo.featured });
  };

  const handleUploadSubmit = () => {
    if (uploadFiles.length === 0) {
      toast.error('Select at least one photo');
      return;
    }
    uploadMutation.mutate({
      files: uploadFiles,
      category: uploadCategory,
      event: uploadEvent,
      location: uploadLocation
    });
  };

  // Navigating through viewed photos
  const navigatePhoto = (direction) => {
    if (!viewPhoto) return;
    const currentIndex = photos.findIndex(p => p._id === viewPhoto._id);
    if (direction === 'next' && currentIndex < photos.length - 1) {
      setViewPhoto(photos[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setViewPhoto(photos[currentIndex - 1]);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Gallery</h1>
          <span className={styles.countBadge}>{photos.length} Photos</span>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={`${styles.selectModeBtn} ${isSelectMode ? styles.active : ''}`}
            onClick={() => {
              setIsSelectMode(!isSelectMode);
              if (isSelectMode) setSelectedIds([]);
            }}
          >
            <CheckSquare size={18} /> {isSelectMode ? 'Cancel Selection' : 'Select Mode'}
          </button>
          <button className={styles.uploadBtn} onClick={() => setIsUploadOpen(!isUploadOpen)}>
            {isUploadOpen ? <X size={20} /> : <Plus size={20} />} 
            {isUploadOpen ? 'Close Upload' : 'Upload Photos'}
          </button>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        {TABS.map(tab => (
          <button 
            key={tab} 
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Upload Zone */}
      <AnimatePresence>
        {isUploadOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className={styles.uploadZonePanel}>
              <ImageUpload 
                value={uploadFiles} 
                onChange={setUploadFiles} 
                multiple={true} 
                maxFiles={10} 
              />
              
              {uploadFiles.length > 0 && (
                <div className={styles.uploadMetadata}>
                  <div className={styles.uploadFormGroup}>
                    <label className={styles.uploadLabel}>Category *</label>
                    <select className={styles.uploadSelect} value={uploadCategory} onChange={e => setUploadCategory(e.target.value)}>
                      {TABS.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className={styles.uploadFormGroup}>
                    <label className={styles.uploadLabel}>Linked Event (Optional)</label>
                    <select className={styles.uploadSelect} value={uploadEvent} onChange={e => setUploadEvent(e.target.value)}>
                      <option value="">None</option>
                      {events.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
                    </select>
                  </div>
                  <div className={styles.uploadFormGroup}>
                    <label className={styles.uploadLabel}>Location / Area (Optional)</label>
                    <input type="text" className={styles.uploadInput} value={uploadLocation} onChange={e => setUploadLocation(e.target.value)} placeholder="e.g. Sector 4, Orai" />
                  </div>
                  <button className={styles.uploadSubmitBtn} onClick={handleUploadSubmit} disabled={uploadMutation.isPending}>
                    {uploadMutation.isPending ? <Loader size={20} className="spin" /> : <UploadCloud size={20} />}
                    {uploadMutation.isPending ? 'Uploading...' : `Upload ${uploadFiles.length} Photos`}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar for Bulk Actions */}
      {isSelectMode && (
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={styles.toolbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <input 
              type="checkbox" 
              className={styles.checkbox} 
              checked={selectedIds.length === photos.length && photos.length > 0}
              onChange={handleSelectAll}
            />
            <span style={{ fontWeight: 600 }}>{selectedIds.length} photos selected</span>
          </div>
          {selectedIds.length > 0 && (
            <button 
              style={{ background: 'rgba(220,53,69,0.1)', color: 'var(--error)', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => setBulkDeleteConfirm(true)}
            >
              <Trash2 size={16} /> Delete Selected
            </button>
          )}
        </motion.div>
      )}

      {/* Grid */}
      <div className={styles.grid}>
        {photos.map((photo) => (
          <div 
            key={photo._id} 
            className={`${styles.photoTile} ${isSelectMode ? styles.selectedMode : ''}`}
            onClick={() => {
              if (isSelectMode) {
                toggleSelection(photo._id);
              } else {
                setViewPhoto(photo);
              }
            }}
          >
            <img src={photo.imageUrl || photo.url} alt={photo.caption || 'Gallery image'} className={styles.image} />
            
            <div className={styles.overlay}>
              <div className={styles.topRow}>
                {isSelectMode ? (
                  <input 
                    type="checkbox" 
                    className={styles.checkbox} 
                    checked={selectedIds.includes(photo._id)}
                    onChange={(e) => handleToggleSelect(e, photo._id)}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <button className={`${styles.iconBtn} ${styles.star} ${photo.featured ? styles.featured : ''}`} onClick={(e) => handleToggleFeature(e, photo)}>
                    <Star size={20} fill={photo.featured ? 'currentColor' : 'none'} />
                  </button>
                )}
                
                {!isSelectMode && (
                  <button className={`${styles.iconBtn} ${styles.delete}`} onClick={(e) => { e.stopPropagation(); setDeleteId(photo._id); }}>
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              <div className={styles.bottomRow}>
                <span className={styles.categoryPill}>{photo.category}</span>
                {photo.caption && <p className={styles.caption}>{photo.caption}</p>}
                {photo.location && <span className={styles.locationText}>{photo.location}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      <FormModal isOpen={!!viewPhoto} onClose={() => setViewPhoto(null)} title="Photo Details" size="lg">
        {viewPhoto && (
          <div style={{ position: 'relative' }}>
            <img src={viewPhoto.imageUrl || viewPhoto.url} alt="view" className={styles.modalImage} />
            
            <div style={{ position: 'absolute', top: '50%', left: '-20px', right: '-20px', display: 'flex', justifyContent: 'space-between', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <button 
                onClick={() => navigatePhoto('prev')} 
                style={{ pointerEvents: 'auto', background: 'white', border: 'none', borderRadius: '50%', padding: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', cursor: 'pointer', visibility: photos.findIndex(p => p._id === viewPhoto._id) > 0 ? 'visible' : 'hidden' }}
              ><ChevronLeft size={24} /></button>
              <button 
                onClick={() => navigatePhoto('next')} 
                style={{ pointerEvents: 'auto', background: 'white', border: 'none', borderRadius: '50%', padding: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', cursor: 'pointer', visibility: photos.findIndex(p => p._id === viewPhoto._id) < photos.length - 1 ? 'visible' : 'hidden' }}
              ><ChevronRight size={24} /></button>
            </div>

            <div className={styles.modalInfo}>
              <input 
                type="text" 
                className={styles.modalCaptionInput}
                defaultValue={viewPhoto.caption}
                placeholder="Add a caption..."
                onBlur={(e) => {
                  if (e.target.value !== viewPhoto.caption) {
                    updateCaptionMutation.mutate({ id: viewPhoto._id, caption: e.target.value });
                  }
                }}
              />
              
              <div className={styles.modalMetaRow}>
                <div className={styles.modalMetaItem}>
                  <span className={styles.modalMetaLabel}>Category</span>
                  <span className={styles.modalMetaValue}>{viewPhoto.category}</span>
                </div>
                <div className={styles.modalMetaItem}>
                  <span className={styles.modalMetaLabel}>Location</span>
                  <span className={styles.modalMetaValue}>{viewPhoto.location || 'N/A'}</span>
                </div>
                <div className={styles.modalMetaItem}>
                  <span className={styles.modalMetaLabel}>Date Uploaded</span>
                  <span className={styles.modalMetaValue}>{new Date(viewPhoto.date).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                    <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} checked={viewPhoto.featured} onChange={(e) => handleToggleFeature(e, viewPhoto)} />
                    <span className="slider" style={{ position: 'absolute', cursor: 'pointer', inset: 0, backgroundColor: viewPhoto.featured ? '#0ca678' : '#ccc', transition: '.4s', borderRadius: '34px' }}></span>
                    <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: viewPhoto.featured ? '23px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                  </label>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Featured on Homepage</span>
                </div>
                
                <button 
                  onClick={() => setDeleteId(viewPhoto._id)}
                  style={{ background: 'transparent', color: 'var(--error)', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  <Trash2 size={18} /> Delete Photo
                </button>
              </div>
            </div>
          </div>
        )}
      </FormModal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        title="Delete Photo?"
        message="This will permanently delete this photo. This cannot be undone."
        confirmLabel="Delete"
        isDangerous={true}
      />

      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        onClose={() => setBulkDeleteConfirm(false)}
        onConfirm={() => bulkDeleteMutation.mutate(selectedIds)}
        title="Delete Selected Photos?"
        message={`You are about to delete ${selectedIds.length} photos permanently. This cannot be undone.`}
        confirmLabel="Delete All"
        isDangerous={true}
      />
      <style>{`.spin { animation: spin 1s linear infinite; }`}</style>
    </div>
  );
};

export default AdminGallery;

