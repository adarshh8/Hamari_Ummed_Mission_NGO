import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import api from '../services/api';
import useStore from '../store/useStore';
import logo from '../assets/icons/NGO_logo.png';

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
});

const AdminAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const res = await api.post('/auth/login', formData);
      const { token, data: userData } = res.data;

      if (userData.role !== 'admin' && userData.role !== 'superadmin') {
        toast.error('Access denied. Admin only.');
        return;
      }

      if (token) {
        localStorage.setItem('token', token);
      }

      setUser(userData);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Login failed. Check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Humari Umeed Mission</title>
      </Helmet>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--light)',
        padding: '20px'
      }}>
        <div style={{
          background: 'var(--white)',
          padding: '48px',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          width: '100%',
          maxWidth: '450px',
          textAlign: 'center'
        }}>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'rgba(27,67,50,0.1)',
            borderRadius: '50%',
            marginBottom: '24px'
          }}>
            <img src={logo} alt="Logo" style={{ width: 40, height: 40, objectFit: 'contain' }} />
          </div>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '8px' }}>
            Admin Portal
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>
            Authorized personnel only.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Email Address
              </label>
              <input
                type="email"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd' }}
                {...register('email')}
              />
              {errors.email && (
                <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '4px' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Password
              </label>
              <input
                type="password"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd' }}
                {...register('password')}
              />
              {errors.password && (
                <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '4px' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}
            >
              {isLoading ? 'Signing in...' : 'Secure Login'}
            </button>
          </form>

        </div>
      </div>
    </>
  );
};

export default AdminAuth;
