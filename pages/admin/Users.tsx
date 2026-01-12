import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { AdminUser, Role } from '../../shared/api/adminTypes';
import { Modal } from '../../components/Modal';

// --- Types ---

interface CreateUserFormValues {
  fullName: string;
  email: string;
  role: Role;
  password: string;
}

interface ResetPasswordFormValues {
  password: string;
}

// --- Utils ---

const generatePassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  let pass = "";
  for (let i = 0; i < 12; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

// --- Component ---

export const Users: React.FC = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [resetTargetUser, setResetTargetUser] = useState<AdminUser | null>(null);

  // Queries
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: api.getAdminUsers,
  });

  // RBAC Helpers
  const canManageUser = (targetUser: AdminUser) => {
    if (!currentUser) return false;
    if (currentUser.role === 'ADMIN') return true;
    if (currentUser.role === 'MANAGER') return targetUser.role === 'CHEF';
    return false;
  };

  const getAvailableRoles = (): Role[] => {
    if (!currentUser) return [];
    if (currentUser.role === 'ADMIN') return ['ADMIN', 'MANAGER', 'CHEF'];
    if (currentUser.role === 'MANAGER') return ['CHEF'];
    return [];
  };

  // --- Create User Form ---
  const { 
    register: registerCreate, 
    handleSubmit: handleCreateSubmit, 
    setValue: setCreateValue,
    reset: resetCreateForm,
    formState: { errors: createErrors } 
  } = useForm<CreateUserFormValues>({
    defaultValues: {
      role: currentUser?.role === 'MANAGER' ? 'CHEF' : 'CHEF'
    }
  });

  const createMutation = useMutation({
    mutationFn: api.createAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setIsCreateModalOpen(false);
      resetCreateForm();
    },
    onError: (err: any) => {
      alert(`Error creating user: ${err.message}`);
    }
  });

  const onCreateSubmit = (data: CreateUserFormValues) => {
    createMutation.mutate(data);
  };

  // --- Reset Password Form ---
  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    setValue: setResetValue,
    reset: resetResetForm,
    formState: { errors: resetErrors }
  } = useForm<ResetPasswordFormValues>();

  const resetMutation = useMutation({
    mutationFn: (data: { id: string; password: string }) => api.resetAdminUserPassword(data.id, data.password),
    onSuccess: () => {
      setResetTargetUser(null);
      resetResetForm();
      alert("Password reset successfully.");
    },
    onError: (err: any) => {
      alert(`Error resetting password: ${err.message}`);
    }
  });

  const onResetSubmit = (data: ResetPasswordFormValues) => {
    if (resetTargetUser) {
      resetMutation.mutate({ id: resetTargetUser.id, password: data.password });
    }
  };

  if (isLoading) return <div className="text-center py-10 text-neutral-500">Loading users...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load users. Access Denied?</div>;

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">User Management</h1>
          <p className="text-neutral-500">Manage access for Admins, Managers, and Chefs.</p>
        </div>
        <button 
          onClick={() => {
            resetCreateForm({ role: currentUser?.role === 'MANAGER' ? 'CHEF' : 'CHEF' });
            setIsCreateModalOpen(true);
          }}
          className="px-6 py-3 bg-neutral-900 text-white font-bold rounded-lg hover:bg-black transition-colors shadow-lg"
        >
          + Create User
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-6 py-4 font-semibold text-neutral-500">Full Name</th>
                <th className="px-6 py-4 font-semibold text-neutral-500">Email</th>
                <th className="px-6 py-4 font-semibold text-neutral-500">Role</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 text-center">Active</th>
                <th className="px-6 py-4 font-semibold text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {data?.items.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500">
                      {user.fullName.charAt(0)}
                    </div>
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4 text-neutral-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'MANAGER' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.isActive ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" title="Active"></span>
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 inline-block" title="Inactive"></span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {canManageUser(user) && (
                      <button 
                        onClick={() => {
                          setResetTargetUser(user);
                          resetResetForm();
                        }}
                        className="text-primary hover:text-[#c9a305] font-bold text-xs uppercase tracking-wide px-3 py-1.5 bg-primary/5 hover:bg-primary/10 rounded transition-colors"
                      >
                        Reset Password
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Create User Modal --- */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New User"
      >
        <form onSubmit={handleCreateSubmit(onCreateSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-700">Full Name</label>
            <input 
              {...registerCreate('fullName', { required: 'Name is required' })}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g. John Doe"
            />
            {createErrors.fullName && <p className="text-xs text-red-500">{createErrors.fullName.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-700">Email</label>
            <input 
              {...registerCreate('email', { required: 'Email is required' })}
              type="email"
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="user@goose.lake"
            />
            {createErrors.email && <p className="text-xs text-red-500">{createErrors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-700">Role</label>
            <select 
              {...registerCreate('role', { required: true })}
              disabled={currentUser?.role === 'MANAGER'}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none disabled:opacity-60"
            >
              {getAvailableRoles().map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-700">Password</label>
            <div className="flex gap-2">
              <input 
                {...registerCreate('password', { required: 'Password is required' })}
                className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none font-mono text-sm"
                placeholder="Secure Password"
              />
              <button 
                type="button"
                onClick={() => setCreateValue('password', generatePassword())}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold rounded-lg text-sm transition-colors"
              >
                Generate
              </button>
            </div>
            {createErrors.password && <p className="text-xs text-red-500">{createErrors.password.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1 py-2 bg-neutral-100 text-neutral-700 font-bold rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 py-2 bg-neutral-900 text-white font-bold rounded-lg hover:bg-black transition-colors"
            >
              {createMutation.isPending ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* --- Reset Password Modal --- */}
      <Modal
        isOpen={!!resetTargetUser}
        onClose={() => setResetTargetUser(null)}
        title={`Reset Password: ${resetTargetUser?.fullName}`}
      >
        <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-4">
          <p className="text-sm text-neutral-500">
            This will invalidate the user's current session. Please share the new password with them securely.
          </p>

          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-700">New Password</label>
            <div className="flex gap-2">
              <input 
                {...registerReset('password', { required: 'Password is required' })}
                className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none font-mono text-sm"
                placeholder="New Password"
              />
              <button 
                type="button"
                onClick={() => setResetValue('password', generatePassword())}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold rounded-lg text-sm transition-colors"
              >
                Generate
              </button>
            </div>
            {resetErrors.password && <p className="text-xs text-red-500">{resetErrors.password.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setResetTargetUser(null)}
              className="flex-1 py-2 bg-neutral-100 text-neutral-700 font-bold rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={resetMutation.isPending}
              className="flex-1 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              {resetMutation.isPending ? 'Resetting...' : 'Confirm Reset'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
