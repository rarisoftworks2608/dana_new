import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import danaAnandLogo from '../assets/logo-dana-anand.webp';

export default function AdminLogin() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!loading && isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || '/admin/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async ({ email, password }) => {
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-card w-full max-w-md p-8 sm:p-10">
        <div className="text-center mb-8">
          <img src={danaAnandLogo} alt="Dana | Anand" className="h-11 w-auto mx-auto mb-5 select-none" />
          <h1 className="font-heading font-bold text-2xl text-primary-dark">Admin Login</h1>
          <p className="text-slate-500 text-sm mt-1">Dana Supplier Technology Day 2026</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                className="w-full rounded-xl border border-slate-200 pl-11 pr-11 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
