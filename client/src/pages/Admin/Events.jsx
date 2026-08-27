import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Plus, Eye, Edit2, Trash2, Loader } from 'lucide-react';
import api from '../../services/api';
import DataTable from '../../components/Admin/DataTable';
import FormModal from '../../components/Admin/FormModal';
import ConfirmDialog from '../../components/Admin/ConfirmDialog';
import StatusBadge from '../../components/Admin/StatusBadge';
import ImageUpload from '../../components/Admin/ImageUpload';
import SearchFilter from '../../components/Admin/SearchFilter';
import styles from './Events.module.css';

const schema = yup.object().shape({
  title: yup.string().required('Title is required').max(100),
  eventType: yup.string().required('Type is required'),
  description: yup.string().required('Description is required').max(500),
  status: yup.string().required('Status is required'),
  date: yup.string().required('Date is required'),
  time: yup.string().required('Time is required'),
  venue: yup.string().required('Venue is required'),
  address: yup.string(),
  city: yup.string().required('City is required').default('Orai'),
  expectedParticipants: yup.number().typeError('Must be a number').min(0).optional(),
  expectedVolunteers: yup.number().typeError('Must be a number').min(0).optional(),
  featured: yup.boolean(),
  visible: yup.boolean()
});

const EVENT_TYPES = [
  'Reward Ceremony', 'Play / Drama', 'Book Distribution', 
  'Clothes Drive', 'Door-to-Door Campaign', 'Other'
];

const Events = () => {
  const queryClient = useQueryClient();
  
  // State
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // Queries
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['adminEvents', search, filterType, filterStatus],
    queryFn: async () => {
      let url = '/events?limit=100';
      if (search) url += `&search=${search}`;
      if (filterType !== 'all') url += `&type=${filterType}`;
      if (filterStatus !== 'all') url += `&status=${filterStatus}`;
      const res = await api.get(url);
      return res.data.data;
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/events', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      toast.success('Event created successfully');
      handleCloseModal();
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to create event')
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/events/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      toast.success('Event updated successfully');
      handleCloseModal();
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Failed to update event')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminEvents'] });
      toast.success('Event deleted successfully');
      setDeleteId(null);
    },
    onError: (err) => toast.error('Failed to delete event')
  });

  // Form setup
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { city: 'Orai', status: 'upcoming', visible: true }
  });

  // Handlers
  const openCreateModal = () => {
    setSelectedEvent(null);
    setCoverImage(null);
    reset({
      title: '', eventType: '', description: '', status: 'upcoming',
      date: '', time: '', venue: '', address: '', city: 'Orai',
      expectedParticipants: 0, expectedVolunteers: 0, featured: false, visible: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setCoverImage(event.coverImage);
    const eventDate = new Date(event.date);
    reset({
      ...event,
      date: eventDate.toISOString().split('T')[0],
      expectedParticipants: event.stats?.expectedParticipants || 0,
      expectedVolunteers: event.stats?.expectedVolunteers || 0
    });
    setIsModalOpen(true);
  };

  const openViewModal = (event) => {
    setSelectedEvent(event);
    setIsViewOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      coverImage,
      stats: {
        expectedParticipants: data.expectedParticipants,
        expectedVolunteers: data.expectedVolunteers
      }
    };
    
    if (selectedEvent) {
      updateMutation.mutate({ id: selectedEvent._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Columns for DataTable
  const columns = [
    { 
      header: 'Image', 
      accessor: row => <img src={row.coverImage || 'https://via.placeholder.com/60'} alt={row.title} className={styles.thumbnail} />
    },
    { 
      header: 'Event Title', 
      accessor: row => <div style={{ fontWeight: 600 }}>{row.title}</div>
    },
    { 
      header: 'Type', 
      accessor: row => <span style={{ fontSize: '12px', background: '#f1f3f5', padding: '4px 8px', borderRadius: '4px' }}>{row.eventType || row.type || 'Event'}</span>
    },
    { 
      header: 'Date & Venue', 
      accessor: row => (
        <div>
          <div>{new Date(row.date).toLocaleDateString()} at {row.time}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{row.venue}</div>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: row => <StatusBadge status={row.status} />
    },
    { 
      header: 'Actions', 
      accessor: row => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`${styles.actionBtn} ${styles.viewBtn}`} onClick={(e) => { e.stopPropagation(); openViewModal(row); }}><Eye size={16} /></button>
          <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={(e) => { e.stopPropagation(); openEditModal(row); }}><Edit2 size={16} /></button>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={(e) => { e.stopPropagation(); setDeleteId(row._id); }}><Trash2 size={16} /></button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>Events</h1>
          <span className={styles.countBadge}>{events.length} Total</span>
        </div>
        <button className={styles.createBtn} onClick={openCreateModal}>
          <Plus size={20} /> Create New Event
        </button>
      </div>

      <SearchFilter 
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search events by title..."
        filters={[
          { key: 'type', value: filterType, options: [{value:'all', label:'All Types'}, ...EVENT_TYPES.map(t => ({value: t, label: t}))], default: 'all' },
          { key: 'status', value: filterStatus, options: [
              {value:'all', label:'All Status'},
              {value:'upcoming', label:'Upcoming'},
              {value:'ongoing', label:'Ongoing'},
              {value:'completed', label:'Completed'}
            ], default: 'all' 
          }
        ]}
        onFilterChange={(key, val) => {
          if (key === 'type') setFilterType(val);
          if (key === 'status') setFilterStatus(val);
        }}
      />

      <DataTable 
        columns={columns} 
        data={events} 
        isLoading={isLoading} 
        emptyMessage="No events found matching your criteria."
        onRowClick={openViewModal}
      />

      {/* CREATE / EDIT MODAL */}
      <FormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={selectedEvent ? "Edit Event" : "Create New Event"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formSection}>
            <h4 className={styles.sectionTitle}>Basic Info</h4>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Event Title *</label>
                <input type="text" className={styles.input} {...register('title')} />
                {errors.title && <span className={styles.errorText}>{errors.title.message}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Event Type *</label>
                <select className={styles.select} {...register('eventType')}>
                  <option value="">Select Type</option>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.eventType && <span className={styles.errorText}>{errors.eventType.message}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Status *</label>
                <select className={styles.select} {...register('status')}>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
                {errors.status && <span className={styles.errorText}>{errors.status.message}</span>}
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Description *</label>
                <textarea className={styles.textarea} {...register('description')} />
                {errors.description && <span className={styles.errorText}>{errors.description.message}</span>}
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h4 className={styles.sectionTitle}>Date & Location</h4>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Event Date *</label>
                <input type="date" className={styles.input} {...register('date')} />
                {errors.date && <span className={styles.errorText}>{errors.date.message}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Time *</label>
                <input type="time" className={styles.input} {...register('time')} />
                {errors.time && <span className={styles.errorText}>{errors.time.message}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Venue Name *</label>
                <input type="text" className={styles.input} {...register('venue')} placeholder="e.g. Town Hall" />
                {errors.venue && <span className={styles.errorText}>{errors.venue.message}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>City *</label>
                <input type="text" className={styles.input} {...register('city')} />
                {errors.city && <span className={styles.errorText}>{errors.city.message}</span>}
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Full Address</label>
                <textarea className={styles.textarea} style={{ minHeight: '60px' }} {...register('address')} />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h4 className={styles.sectionTitle}>Details & Media</h4>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Expected Participants</label>
                <input type="number" className={styles.input} {...register('expectedParticipants')} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Volunteers Needed</label>
                <input type="number" className={styles.input} {...register('expectedVolunteers')} />
              </div>
              
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Cover Image</label>
                <ImageUpload value={coverImage} onChange={setCoverImage} />
              </div>
            </div>
          </div>

          <div className={styles.formSection} style={{ borderBottom: 'none' }}>
            <h4 className={styles.sectionTitle}>Visibility</h4>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <div className={styles.switchWrapper}>
                  <label className={styles.switch}>
                    <input type="checkbox" {...register('featured')} />
                    <span className={styles.slider}></span>
                  </label>
                  <span className={styles.label} style={{ margin: 0 }}>Featured on Homepage</span>
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.switchWrapper}>
                  <label className={styles.switch}>
                    <input type="checkbox" {...register('visible')} />
                    <span className={styles.slider}></span>
                  </label>
                  <span className={styles.label} style={{ margin: 0 }}>Visible on Website</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={handleCloseModal}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && <Loader size={18} className="spin" />}
              {selectedEvent ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
          <style>{`.spin { animation: spin 1s linear infinite; }`}</style>
        </form>
      </FormModal>

      {/* VIEW MODAL (Read-only) */}
      <FormModal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        title="Event Details"
      >
        {selectedEvent && (
          <div>
            <img src={selectedEvent.coverImage || 'https://via.placeholder.com/800x400'} alt="Cover" style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', margin: '0 0 8px 0' }}>{selectedEvent.title}</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontSize: '12px', background: '#f1f3f5', padding: '4px 8px', borderRadius: '4px' }}>{selectedEvent.eventType || selectedEvent.type}</span>
                  <StatusBadge status={selectedEvent.status} />
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text)', lineHeight: 1.6, marginBottom: '24px' }}>{selectedEvent.description}</p>

            <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Date & Time</strong>
                  <span>{new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Venue</strong>
                  <span>{selectedEvent.venue}, {selectedEvent.city}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => { setIsViewOpen(false); openEditModal(selectedEvent); }}
              className={styles.saveBtn} 
              style={{ width: '100%' }}
            >
              <Edit2 size={18} /> Edit This Event
            </button>
          </div>
        )}
      </FormModal>

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        title="Delete Event?"
        message="This will permanently delete this event and all its details. This cannot be undone."
        confirmLabel="Yes, Delete"
        isDangerous={true}
      />
    </div>
  );
};

export default Events;

