import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Loader, Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../../services/api';
import FormModal from '../../components/Admin/FormModal';
import ImageUpload from '../../components/Admin/ImageUpload';
import ConfirmDialog from '../../components/Admin/ConfirmDialog';
import styles from './Activities.module.css';

const schema = yup.object().shape({
  title: yup.string().required('Title is required').max(100),
  category: yup.string().required('Category is required'),
  shortDescription: yup.string().max(500, 'Max 500 characters').required('Short description is required'),
  fullDescription: yup.string().required('Full description is required'),
  childrenHelped: yup.number().typeError('Must be a number').min(0).optional(),
  familiesReached: yup.number().typeError('Must be a number').min(0).optional(),
  featured: yup.boolean(),
  visible: yup.boolean()
});

const CATEGORIES = [
  { value: 'education', label: 'Education' },
  { value: 'elderly', label: 'Elderly Care' },
  { value: 'awareness', label: 'Awareness' },
  { value: 'cultural', label: 'Cultural' },
];

const Activities = () => {
  const queryClient = useQueryClient();
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [editingActivity, setEditingActivity] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['adminActivities'],
    queryFn: async () => {
      const res = await api.get('/activities?limit=100');
      return res.data.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/activities', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminActivities']);
      toast.success('Activity created successfully!');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to create activity');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/activities/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminActivities']);
      toast.success('Activity updated successfully');
      closeModal();
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to update activity');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/activities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminActivities']);
      toast.success('Activity deleted');
      setDeleteId(null);
    },
    onError: () => toast.error('Failed to delete activity')
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isActive }) => {
      const res = await api.put(`/activities/${id}`, { isActive });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminActivities']);
    },
    onError: () => {
      toast.error('Failed to update visibility');
      queryClient.invalidateQueries(['adminActivities']);
    }
  });

  const { register, handleSubmit, formState: { errors, isDirty }, reset, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { featured: false, visible: true }
  });

  const shortDescWatch = watch('shortDescription', '');
  const fullDescWatch = watch('fullDescription', '');

  const openCreateModal = () => {
    setEditingActivity(null);
    setCoverImage(null);
    reset({
      title: '', category: '', shortDescription: '', fullDescription: '',
      childrenHelped: 0, familiesReached: 0, featured: false, visible: true
    });
    setModalMode('create');
  };

  const openEditModal = (activity) => {
    reset({
      title: activity.title,
      category: activity.category || 'education',
      shortDescription: activity.shortDescription,
      fullDescription: activity.fullDescription,
      childrenHelped: activity.stats?.childrenHelped || 0,
      familiesReached: activity.stats?.familiesReached || 0,
      featured: activity.featured || false,
      visible: activity.isActive !== false
    });
    setCoverImage(activity.coverImage);
    setEditingActivity(activity);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingActivity(null);
    setCoverImage(null);
  };

  const handleCloseModal = () => {
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      closeModal();
    }
  };

  const onSubmit = (data) => {
    if (!coverImage) {
      toast.error('Please upload a cover image');
      return;
    }
    const payload = {
      title: data.title,
      category: data.category,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      coverImage,
      featured: data.featured,
      isActive: data.visible !== false,
      stats: {
        childrenHelped: String(data.childrenHelped || 0),
        familiesReached: String(data.familiesReached || 0)
      }
    };

    if (modalMode === 'edit') {
      updateMutation.mutate({ id: editingActivity._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const visibleCount = activities.filter(a => a.isActive !== false).length;
  const hiddenCount = activities.length - visibleCount;
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={styles.statsRow} style={{ margin: 0 }}>
          <div className={styles.statPill}>Total: {activities.length}</div>
          <div className={styles.statPill}>Visible: {visibleCount}</div>
          <div className={styles.statPill}>Hidden: {hiddenCount}</div>
        </div>
        <button
          className={styles.saveBtn}
          onClick={openCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
        >
          <Plus size={18} /> Create Activity
        </button>
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.card} style={{ animation: 'pulse 1.5s infinite', background: '#eee' }} />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)', background: 'white', borderRadius: '16px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ margin: '0 0 8px 0' }}>No Activities Yet</h3>
          <p style={{ margin: '0 0 20px 0' }}>Create your first activity to get started.</p>
          <button className={styles.saveBtn} onClick={openCreateModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Create Activity
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {activities.map((act) => (
            <div key={act._id} className={styles.card}>
              <div className={styles.cardImgWrapper}>
                <img src={act.coverImage || 'https://via.placeholder.com/150'} alt={act.title} className={styles.cardImg} />
                <div className={styles.categoryBadge}>{act.category || 'Activity'}</div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.title}>{act.title}</h3>
                </div>
                <p className={styles.desc}>{act.shortDescription}</p>

                <div className={styles.statsGrid}>
                  <div className={styles.smallStat}>
                    Helped
                    <strong>{act.stats?.childrenHelped || 0}</strong>
                  </div>
                  <div className={styles.smallStat}>
                    Families
                    <strong>{act.stats?.familiesReached || 0}</strong>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div className={styles.toggleWrapper}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={act.isActive !== false}
                        onChange={(e) => {
                          toggleVisibilityMutation.mutate({ id: act._id, isActive: e.target.checked });
                        }}
                      />
                      <span className={styles.slider}></span>
                    </label>
                    Visible
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className={styles.editBtn} onClick={() => openEditModal(act)} title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button
                      className={styles.editBtn}
                      onClick={() => setDeleteId(act._id)}
                      style={{ color: '#e03131', borderColor: '#ffc9c9' }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <FormModal
        isOpen={!!modalMode}
        onClose={handleCloseModal}
        title={modalMode === 'edit' ? 'Edit Activity' : 'Create New Activity'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid}>
            {/* Title */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Activity Title *</label>
              <input
                type="text"
                className={styles.input}
                {...register('title')}
                readOnly={modalMode === 'edit'}
                style={modalMode === 'edit' ? { background: '#f5f5f5', cursor: 'not-allowed' } : {}}
              />
              {modalMode === 'edit' && <span className={styles.charCount}>Title cannot be changed</span>}
              {errors.title && <span style={{ color: 'red', fontSize: '12px' }}>{errors.title.message}</span>}
            </div>

            {/* Category */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Category *</label>
              <select className={styles.input} {...register('category')}>
                <option value="">Select Category</option>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              {errors.category && <span style={{ color: 'red', fontSize: '12px' }}>{errors.category.message}</span>}
            </div>

            {/* Short Description */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Short Description * (shown on cards)</label>
              <textarea className={styles.textarea} style={{ minHeight: '80px' }} {...register('shortDescription')} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {errors.shortDescription
                  ? <span style={{ color: 'red', fontSize: '12px' }}>{errors.shortDescription.message}</span>
                  : <span />}
                <span className={styles.charCount}>{shortDescWatch?.length || 0}/500</span>
              </div>
            </div>

            {/* Full Description */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Full Description *</label>
              <textarea className={styles.textarea} {...register('fullDescription')} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {errors.fullDescription
                  ? <span style={{ color: 'red', fontSize: '12px' }}>{errors.fullDescription.message}</span>
                  : <span />}
                <span className={styles.charCount}>{fullDescWatch?.length || 0} chars</span>
              </div>
            </div>

            {/* Cover Image */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Cover Image *</label>
              <ImageUpload value={coverImage} onChange={setCoverImage} />
            </div>

            {/* Stats */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Children Helped</label>
              <input type="number" className={styles.input} {...register('childrenHelped')} min="0" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Families Reached</label>
              <input type="number" className={styles.input} {...register('familiesReached')} min="0" />
            </div>

            {/* Toggles */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Featured on Homepage</label>
              <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                <label className={styles.switch}>
                  <input type="checkbox" {...register('featured')} />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Visible on Website</label>
              <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                <label className={styles.switch}>
                  <input type="checkbox" {...register('visible')} defaultChecked />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={isPending}>
              {isPending && <Loader size={16} className="spin" />}
              {modalMode === 'edit' ? 'Save Changes' : 'Create Activity'}
            </button>
          </div>
          <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
        </form>
      </FormModal>

      {/* Discard confirm */}
      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={() => {
          setShowCancelConfirm(false);
          closeModal();
        }}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmLabel="Discard Changes"
        isDangerous={true}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        title="Delete Activity?"
        message="This will permanently delete this activity. This cannot be undone."
        confirmLabel="Yes, Delete"
        isDangerous={true}
      />
    </div>
  );
};

export default Activities;
