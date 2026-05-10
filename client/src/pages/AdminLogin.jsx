import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Shield, UserPlus } from 'lucide-react';
import api from '../services/api';
import useStore from '../store/useStore';
import logo from '../assets/icons/NGO_logo.png';

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
});

const signupSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useStore();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(isLogin ? loginSchema : signupSchema)
  });

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await api.post(endpoint, formData);
      
      const { token, data: userData } = res.data; // authController sends { token, data: user }

      if (userData.role !== 'admin' && userData.role !== 'superadmin') {
        toast.error("Access denied. Admin only.");
        return;
      }

      // ✅ Save token to localStorage so api.js interceptor sends it on every request
      if (token) {
        localStorage.setItem('token', token);
      }

      setUser(userData);
      toast.success(isLogin ? "Welcome back, Admin!" : "Admin account created successfully!");
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || (isLogin ? "Login failed. Check credentials." : "Signup failed."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? "Admin Login" : "Admin Signup"} | HopeRise Foundation</title>
      </Helmet>
      
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--light)', padding: '20px' }}>
        <div style={{ background: 'var(--white)', padding: '48px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '450px', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: 'rgba(27,67,50,0.1)', borderRadius: '50%', marginBottom: '24px' }}>
            {isLogin ? <img src={logo} alt="Logo" style={{ width: 40, height: 40, objectFit: 'contain' }} /> : <UserPlus size={40} color="var(--primary)" />}
          </div>
          
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '8px' }}>
            {isLogin ? "Admin Portal" : "Create Admin"}
          </h1>
          <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>
            {isLogin ? "Authorized personnel only." : "Register a new administrator."}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ textAlign: 'left' }}>
            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Full Name</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd' }} 
                  {...register('name')} 
                />
                {errors.name && <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '4px' }}>{errors.name.message}</p>}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email Address</label>
              <input 
                type="email" 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd' }} 
                {...register('email')} 
              />
              {errors.email && <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '4px' }}>{errors.email.message}</p>}
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Password</label>
              <input 
                type="password" 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd' }} 
                {...register('password')} 
              />
              {errors.password && <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: '4px' }}>{errors.password.message}</p>}
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoading} style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}>
              {isLoading ? 'Processing...' : (isLogin ? 'Secure Login' : 'Create Account')}
            </button>
          </form>

          <div style={{ marginTop: '24px', fontSize: '0.95rem', color: 'var(--muted)' }}>
            {isLogin ? "Don't have an admin account? " : "Already have an account? "}
            <button 
              onClick={toggleMode} 
              type="button" 
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminAuth;
