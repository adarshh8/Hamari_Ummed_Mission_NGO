import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader, User } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import useStore from '../../store/useStore';
import logo from '../../assets/icons/NGO_logo.png';
import styles from './AdminLogin.module.css';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required')
});

const AdminSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const signupMutation = useMutation({
    mutationFn: async (data) => {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...apiData } = data;
      const res = await api.post('/auth/register', apiData);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      return res.data.data; // authController sends { data: user }
    },
    onSuccess: (userData) => {
      setUser(userData);
      toast.success("Account created successfully!");
      navigate('/admin');
    },
    onError: (error) => {
      const msg = error?.response?.data?.error || error?.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
    }
  });

  const onSubmit = (data) => {
    signupMutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Admin Signup | Hamari Ummeed Mission</title>
      </Helmet>
      
      <div className={styles.loginLayout}>
        {/* Left Panel - Branding */}
        <div className={styles.leftPanel}>
          <div className={styles.bgPattern} />
          
          <div className={styles.brandContent}>
            <div className={styles.logoIcon}>
              <img src={logo} alt="Logo" style={{ width: 64, height: 64, objectFit: 'contain' }} />
            </div>
            
            <h1 className={styles.ngoName}>Hamari Ummeed<br/>Mission</h1>
            <p className={styles.ngoTagline}>Empowering children, caring for elders.</p>
            
            <div className={styles.portalLabel}>Admin Portal</div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className={styles.rightPanel}>
          <div className={styles.formContainer}>
            <h2 className={styles.welcomeHeading}>Create Account</h2>
            <p className={styles.welcomeSubtext}>Sign up to access the admin dashboard.</p>

            {signupMutation.isError && (
              <div className={styles.alertBox}>
                <AlertCircle size={20} />
                <span>{signupMutation.error.response?.data?.message || signupMutation.error.response?.data?.error || "Registration failed. Please try again."}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon} />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    className={styles.inputField}
                    {...register('name')} 
                  />
                </div>
                {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    className={styles.inputField}
                    {...register('email')} 
                  />
                </div>
                {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password"
                    className={styles.inputField}
                    {...register('password')} 
                  />
                  <button 
                    type="button" 
                    className={styles.togglePwdBtn}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Confirm Password"
                    className={styles.inputField}
                    {...register('confirmPassword')} 
                  />
                </div>
                {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword.message}</p>}
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn} 
                disabled={signupMutation.isPending}
                style={{ marginTop: '24px' }}
              >
                {signupMutation.isPending ? (
                  <>
                    <Loader size={20} className="spin" />
                    Creating Account...
                  </>
                ) : 'Sign Up'}
              </button>
              <style>{`.spin { animation: spin 1s linear infinite; }`}</style>
              
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
                  Already have an admin account? <Link to="/admin/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Sign in here</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSignup;
