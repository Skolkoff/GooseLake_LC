import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard</h1>
      <p className="text-neutral-500 mb-8">Overview of current operations.</p>
      
      <div className="p-8 bg-white border border-neutral-200 rounded-2xl border-dashed flex items-center justify-center min-h-[300px]">
        <p className="text-neutral-400 font-medium">Dashboard Widgets Placeholder</p>
      </div>
    </div>
  );
};
