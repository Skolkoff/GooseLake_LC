import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormValues {
  email: string;
  password: string;
}

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      const from = (location.state as any)?.from?.pathname || "/admin";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError('root', { 
        type: 'manual', 
        message: err.message || "Неверные данные" 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-neutral-200">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-bold text-xl mx-auto mb-4">
            GL
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Admin Access</h1>
          <p className="text-neutral-500 text-sm mt-2">Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-700">Email</label>
            <input 
              {...register('email', { required: 'Email is required' })}
              type="email" 
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="admin@goose.lake"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-700">Password</label>
            <input 
              {...register('password', { required: 'Password is required' })}
              type="password" 
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 font-medium">
              {errors.root.message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3 bg-neutral-900 text-white font-bold rounded-lg hover:bg-black transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
