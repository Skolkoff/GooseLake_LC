import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import { TimeSettings, MaintenanceSettings } from '../../shared/api/adminTypes';

export const Settings: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-2">System Settings</h1>
      <p className="text-neutral-500 mb-8">Configure operational hours and maintenance mode.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <TimeSettingsForm />
        </div>
        <div className="space-y-8">
          <MaintenanceSettingsForm />
        </div>
      </div>
    </div>
  );
};

// --- Time Settings Form ---

const TimeSettingsForm: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'settings', 'time'],
    queryFn: api.getTimeSettings
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TimeSettings>();

  React.useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: api.updateTimeSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings', 'time'] });
      alert('Time settings saved successfully.');
    }
  });

  const onSubmit = (formData: TimeSettings) => {
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8 bg-white rounded-2xl border animate-pulse h-96"></div>;

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-neutral-100 bg-neutral-50">
        <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-primary rounded-full"></span>
          Operational Hours
        </h2>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-neutral-400">General Order Window</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600">Opens At</label>
              <input 
                type="time" 
                {...register('orderWindowFrom', { required: true })}
                className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-600">Closes At</label>
              <input 
                type="time" 
                {...register('orderWindowTo', { 
                  required: true,
                  validate: (val, formValues) => val > formValues.orderWindowFrom || 'Must be after opening time'
                })}
                className={`w-full px-4 py-2 bg-neutral-50 border ${errors.orderWindowTo ? 'border-red-500' : 'border-neutral-200'} rounded-lg focus:ring-2 focus:ring-primary outline-none`}
              />
            </div>
          </div>
          {errors.orderWindowTo && <p className="text-xs text-red-500">{errors.orderWindowTo.message}</p>}
        </div>

        <div className="space-y-4 pt-4 border-t border-neutral-100">
           <h3 className="text-sm font-extrabold uppercase tracking-widest text-neutral-400">Day Shift</h3>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-xs font-bold text-neutral-600">From</label>
               <input 
                 type="time" 
                 {...register('dayShiftFrom', { required: true })}
                 className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
               />
             </div>
             <div className="space-y-1">
               <label className="text-xs font-bold text-neutral-600">To</label>
               <input 
                 type="time" 
                 {...register('dayShiftTo', { 
                   required: true,
                   validate: (val, formValues) => val > formValues.dayShiftFrom || 'Must be after start time'
                 })}
                 className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
               />
             </div>
           </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-neutral-100">
           <h3 className="text-sm font-extrabold uppercase tracking-widest text-neutral-400">Night Shift</h3>
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-xs font-bold text-neutral-600">From</label>
               <input 
                 type="time" 
                 {...register('nightShiftFrom', { required: true })}
                 className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
               />
             </div>
             <div className="space-y-1">
               <label className="text-xs font-bold text-neutral-600">To</label>
               <input 
                 type="time" 
                 {...register('nightShiftTo', { required: true })}
                 className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
               />
               <p className="text-[10px] text-neutral-400">Can be next day (e.g., 02:00)</p>
             </div>
           </div>
        </div>

        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full py-3 bg-neutral-900 text-white font-bold rounded-lg hover:bg-black transition-all"
        >
          {mutation.isPending ? 'Saving...' : 'Save Time Settings'}
        </button>
      </form>
    </div>
  );
};

// --- Maintenance Settings Form ---

const MaintenanceSettingsForm: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'settings', 'maintenance'],
    queryFn: api.getMaintenanceSettings
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<MaintenanceSettings>();
  const isEnabled = watch('isEnabled');

  React.useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: api.updateMaintenanceSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings', 'maintenance'] });
      alert('Maintenance settings updated.');
    }
  });

  const onSubmit = (formData: MaintenanceSettings) => {
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8 bg-white rounded-2xl border animate-pulse h-64"></div>;

  return (
    <div className={`border rounded-2xl shadow-sm overflow-hidden transition-colors ${isEnabled ? 'bg-red-50 border-red-200' : 'bg-white border-neutral-200'}`}>
      <div className={`p-6 border-b flex items-center justify-between ${isEnabled ? 'border-red-100 bg-red-50' : 'border-neutral-100 bg-neutral-50'}`}>
        <h2 className={`text-lg font-bold flex items-center gap-2 ${isEnabled ? 'text-red-900' : 'text-neutral-900'}`}>
          <span className={`w-1.5 h-5 rounded-full ${isEnabled ? 'bg-red-500' : 'bg-green-500'}`}></span>
          Maintenance Mode
        </h2>
        {isEnabled && <span className="text-xs font-bold bg-red-200 text-red-800 px-2 py-1 rounded">ACTIVE</span>}
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-200">
           <input 
              type="checkbox" 
              id="maintEnabled"
              {...register('isEnabled')}
              className="w-5 h-5 accent-red-600 rounded cursor-pointer"
           />
           <label htmlFor="maintEnabled" className="text-sm font-bold text-neutral-900 cursor-pointer select-none">
              Enable Maintenance Mode
           </label>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-neutral-700">Display Message</label>
          <textarea 
            {...register('message')}
            placeholder="e.g. We are performing scheduled upgrades..."
            className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary outline-none h-24 resize-none"
            disabled={!isEnabled}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-bold text-neutral-700">Estimated Completion (Until)</label>
          <input 
            type="datetime-local" 
            {...register('untilIso', { required: isEnabled ? 'Completion time is required when enabled' : false })}
            className={`w-full px-4 py-2 bg-white border ${errors.untilIso ? 'border-red-500' : 'border-neutral-200'} rounded-lg focus:ring-2 focus:ring-primary outline-none`}
            disabled={!isEnabled}
          />
          {errors.untilIso && <p className="text-xs text-red-500">{errors.untilIso.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={mutation.isPending}
          className={`w-full py-3 font-bold rounded-lg transition-all text-white ${isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-neutral-900 hover:bg-black'}`}
        >
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};
