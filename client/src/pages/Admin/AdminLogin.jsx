import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import useStore from '../../store/useStore';
import logo from '../../assets/icons/NGO_logo.png';
import styles from './AdminLogin.module.css';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
});

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/auth/login', data);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      return res.data.data; // authController sends { data: user }
    },
    onSuccess: (userData) => {
      if (userData.role !== 'admin' && userData.role !== 'superadmin') {
        toast.error("Access denied. Admin only.");
        return;
      }
      setUser(userData);
      toast.success("Welcome back, Admin!");
      navigate('/admin');
    },
    onError: (error) => {
      const msg = error?.response?.data?.error || error?.response?.data?.message || "Login failed. Check your credentials.";
      toast.error(msg);
    }
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Admin Portal | Hamari Ummeed Mission</title>
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
            <h2 className={styles.welcomeHeading}>Welcome Back</h2>
            <p className={styles.welcomeSubtext}>Sign in to manage your NGO operations.</p>

            {loginMutation.isError && (
              <div className={styles.alertBox}>
                <AlertCircle size={20} />
                <span>{loginMutation.error.response?.data?.error || "Invalid email or password. Please try again."}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
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

              <div className={styles.optionsRow}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" style={{ accentColor: 'var(--primary)' }} />
                  Remember me
                </label>
                <a href="#" className={styles.forgotLink} onClick={(e) => {
                  e.preventDefault();
                  toast("Forgot password flow not yet implemented", { icon: 'ℹ️' });
                }}>
                  Forgot Password?
                </a>
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn} 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader size={20} className="spin" />
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
              <style>{`.spin { animation: spin 1s linear infinite; }`}</style>
              

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
