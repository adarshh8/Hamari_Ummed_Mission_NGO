import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Loader, Trophy, School, FileText } from 'lucide-react';
import api from '../../services/api';
import FormModal from '../../components/Admin/FormModal';
import ConfirmDialog from '../../components/Admin/ConfirmDialog';
import ImageUpload from '../../components/Admin/ImageUpload';
import SearchFilter from '../../components/Admin/SearchFilter';
import styles from './RewardedChildren.module.css';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  age: yup.number().typeError('Must be a number').min(5).max(18).required('Age is required'),
  class: yup.string().required('Class/Grade is required'),
  school: yup.string().required('School is required'),
  percentage: yup.string().required('Score/Percentage is required'),
  subject: yup.string().required('Subject/Exam is required'),
  award: yup.string().required('Award is required'),
  year: yup.number().required('Year is required'),
  story: yup.string().max(200, 'Max 200 characters'),
  eventRef: yup.string().nullable(),
  isPublic: yup.boolean()
});

const currentYear = 2026;
const YEARS = [currentYear];

const RewardedChildren = () => {
  const queryClient = useQueryClient();
  
  const [activeYear, setActiveYear] = useState(currentYear);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [photo, setPhoto] = useState(null);

  // Queries
  const { data: children = [], isLoading } = useQuery({
    queryKey: ['adminRewardedChildren', activeYear, search],
    queryFn: async () => {
      let url = '/rewarded-children?limit=200';
      const res = await api.get(url);
      let data = res.data.data || [];
      // Filter by year and search client-side
      data = data.filter(c => c.year === activeYear || c.year === String(activeYear));
      if (search) {
        const q = search.toLowerCase();
        data = data.filter(c =>
          c.name?.toLowerCase().includes(q) || c.school?.toLowerCase().includes(q)
        );
      }
      return data;
    }
  });

  const { data: events = [] } = useQuery({
    queryKey: ['adminEventsDropdown'],
    queryFn: async () => {
      const res = await api.get('/events?limit=50');
      return res.data.data || [];
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/rewarded-children', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRewardedChildren'] });
      toast.success('Child added successfully');
      handleCloseModal();
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to add child')
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/rewarded-children/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRewardedChildren'] });
      toast.success('Updated successfully');
      handleCloseModal();
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to update')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/rewarded-children/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRewardedChildren'] });
      toast.success('Deleted successfully');
      setDeleteId(null);
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== deleteId));
    },
    onError: () => toast.error('Failed to delete')
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, isPublic }) => {
      const res = await api.put(`/rewarded-children/${id}`, { isPublic });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRewardedChildren'] });
    },
    onError: () => toast.error('Failed to update visibility')
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => {
      // In a real scenario, you might have a bulk delete endpoint or Promise.all
      await Promise.all(ids.map(id => api.delete(`/rewarded-children/${id}`)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRewardedChildren'] });
      toast.success('Selected items deleted');
      setSelectedIds([]);
      setBulkDeleteConfirm(false);
    },
    onError: () => toast.error('Bulk delete failed')
  });

  // Form setup
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { awardYear: currentYear, visible: true }
  });

  // Handlers
  const openCreateModal = () => {
    setSelectedChild(null);
    setPhoto(null);
    reset({
      name: '', age: '', class: '', school: '', percentage: '', subject: '',
      award: '', year: currentYear, story: '', eventRef: '', isPublic: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (child) => {
    setSelectedChild(child);
    setPhoto(child.photo);
    reset({
      name: child.name,
      age: child.age,
      class: child.class,
      school: child.school,
      percentage: child.percentage,
      subject: child.subject,
      award: child.award,
      year: child.year,
      story: child.story || '',
      eventRef: child.eventRef?._id || child.eventRef || '',
      isPublic: child.isPublic !== false
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChild(null);
  };

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      age: data.age,
      class: data.class,
      school: data.school,
      percentage: data.percentage,
      subject: data.subject,
      award: data.award,
      year: Number(data.year),
      story: data.story || '',
      eventRef: data.eventRef || undefined,
      isPublic: data.isPublic !== false,
      photo: photo || ''
    };
    if (selectedChild) {
      updateMutation.mutate({ id: selectedChild._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleExportPdf = () => {
    toast('PDF Export would generate a certificate list for selected children.', { icon: '🖨️' });
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Rewarded Children</h1>
          <span className={styles.countBadge}>{children.length} in {activeYear}</span>
        </div>
        <button className={styles.createBtn} onClick={openCreateModal}>
          <Plus size={20} /> Add Child
        </button>
      </div>

      <div className={styles.tabsContainer}>
        {YEARS.map(year => (
          <button 
            key={year} 
            className={`${styles.tab} ${activeYear === year ? styles.active : ''}`}
            onClick={() => { setActiveYear(year); setSelectedIds([]); }}
          >
            {year}
          </button>
        ))}
      </div>

      <SearchFilter 
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search by name or school..."
      />

      {/* Bulk Actions Toolbar */}
      {selectedIds.length > 0 && (
        <div className={styles.toolbar}>
          <div className={styles.selectedCount}>{selectedIds.length} children selected</div>
          <div className={styles.bulkActions}>
            <button className={`${styles.bulkBtn} ${styles.export}`} onClick={handleExportPdf}>
              <FileText size={16} /> Export PDF
            </button>
            <button className={`${styles.bulkBtn} ${styles.delete}`} onClick={() => setBulkDeleteConfirm(true)}>
              <Trash2 size={16} /> Delete Selected
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className={styles.grid}>
          {[...Array(4)].map((_, i) => <div key={i} className={styles.card} style={{ height: '300px', background: '#eee', animation: 'pulse 1.5s infinite' }} />)}
        </div>
      ) : children.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px' }}>
          <Trophy size={48} color="#ddd" style={{ marginBottom: '16px' }} />
          <h3>No records found for {activeYear}</h3>
          <p style={{ color: 'var(--muted)' }}>Try adjusting your search or add a new record.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {children.map((child) => (
            <div key={child._id} className={`${styles.card} ${selectedIds.includes(child._id) ? styles.selected : ''}`}>
              <input 
                type="checkbox" 
                className={styles.checkbox} 
                checked={selectedIds.includes(child._id)}
                onChange={() => toggleSelection(child._id)}
              />
              <div className={styles.yearBadge}>{child.year}</div>
              
              <img src={child.photo || 'https://via.placeholder.com/150'} alt={child.name} className={styles.photo} />
              
              <h3 className={styles.name}>{child.name}</h3>
              <p className={styles.grade}>{child.age} yrs • {child.class}</p>
              
              <div className={styles.school}>
                <School size={14} />
                {child.school}
              </div>

              <div className={styles.score}>{child.percentage}</div>
              <div className={styles.award}><Trophy size={14} /> {child.award}</div>

              <div className={styles.cardActions}>
                <div className={styles.switchWrapper} style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}>
                  <label className={styles.switch}>
                    <input 
                      type="checkbox" 
                      checked={child.isPublic !== false}
                      onChange={(e) => toggleVisibilityMutation.mutate({ id: child._id, isPublic: e.target.checked })}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className={styles.iconBtn} onClick={() => openEditModal(child)}><Edit2 size={16} /></button>
                  <button className={`${styles.iconBtn} ${styles.delete}`} onClick={() => setDeleteId(child._id)}><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <FormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={selectedChild ? "Edit Details" : "Add Rewarded Child"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Child's Name *</label>
              <input type="text" className={styles.input} {...register('name')} />
              {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Age *</label>
              <input type="number" className={styles.input} {...register('age')} min="5" max="18" />
              {errors.age && <span className={styles.errorText}>{errors.age.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Class / Grade *</label>
              <input type="text" className={styles.input} {...register('class')} placeholder="e.g. Class 10th" />
              {errors.class && <span className={styles.errorText}>{errors.class.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>School Name *</label>
              <input type="text" className={styles.input} {...register('school')} />
              {errors.school && <span className={styles.errorText}>{errors.school.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Percentage / Score *</label>
              <input type="text" className={styles.input} {...register('percentage')} placeholder="e.g. 94.5% or A+" />
              {errors.percentage && <span className={styles.errorText}>{errors.percentage.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Subject / Exam *</label>
              <input type="text" className={styles.input} {...register('subject')} placeholder="e.g. Board Exams" />
              {errors.subject && <span className={styles.errorText}>{errors.subject.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Award Given *</label>
              <input type="text" className={styles.input} {...register('award')} placeholder="e.g. Star Student Award" />
              {errors.award && <span className={styles.errorText}>{errors.award.message}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Award Year *</label>
              <select className={styles.select} {...register('year')}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Photo (Optional)</label>
              <ImageUpload value={photo} onChange={setPhoto} circular={true} />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Short Story / Note (Optional)</label>
              <textarea className={styles.textarea} {...register('story')} placeholder="A brief note about the child's journey..." />
              {errors.story && <span className={styles.errorText}>{errors.story.message}</span>}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Linked Event (Optional)</label>
              <select className={styles.select} {...register('eventRef')}>
                <option value="">-- None --</option>
                {events.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
              </select>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.switchWrapper}>
                <label className={styles.switch}>
                  <input type="checkbox" {...register('isPublic')} defaultChecked />
                  <span className={styles.slider}></span>
                </label>
                <span className={styles.label} style={{ margin: 0 }}>Show on Public Website</span>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && <Loader size={18} className="spin" />}
              {selectedChild ? 'Save Changes' : 'Add Child'}
            </button>
          </div>
          <style>{`.spin { animation: spin 1s linear infinite; }`}</style>
        </form>
      </FormModal>

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        title="Delete Record?"
        message="This will permanently delete this child's record. This cannot be undone."
        confirmLabel="Yes, Delete"
        isDangerous={true}
      />

      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        onClose={() => setBulkDeleteConfirm(false)}
        onConfirm={() => bulkDeleteMutation.mutate(selectedIds)}
        title="Delete Selected Records?"
        message={`You are about to delete ${selectedIds.length} records permanently. This cannot be undone.`}
        confirmLabel="Yes, Delete All"
        isDangerous={true}
      />
    </div>
  );
};

export default RewardedChildren;

