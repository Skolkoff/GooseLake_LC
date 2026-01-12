import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../shared/api/adminTypes';

interface RequireRoleProps {
  allowedRoles: Role[];
}

export const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles }) => {
  const { user } = useAuth();

  // If user is not present, RequireAuth should have handled it, but safety check:
  if (!user) return null;

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">403 - Access Denied</h1>
        <p className="text-neutral-500 mt-2 max-w-md">
          You do not have permission to view this page.
        </p>
        <div className="mt-6 px-4 py-2 bg-neutral-100 rounded-lg text-xs text-neutral-500 font-mono border border-neutral-200">
          Current Role: <span className="font-bold text-neutral-900">{user.role}</span>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
