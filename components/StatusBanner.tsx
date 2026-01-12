
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export const StatusBanner: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['serviceStatus'],
    queryFn: api.getServiceStatus,
  });

  if (isLoading) {
    return (
      <div className="w-full bg-neutral-100 p-4 animate-pulse flex justify-center">
        <div className="h-6 w-48 bg-neutral-200 rounded"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="w-full bg-red-100 text-red-800 p-4 text-center font-medium">
        Unable to check service status.
      </div>
    );
  }

  return (
    <div className={`w-full p-4 text-center font-medium transition-colors ${
      data.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {data.isOpen ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
          We are currently open and taking orders!
        </span>
      ) : (
        <span>{data.message || 'The service is currently closed. Please check back later.'}</span>
      )}
    </div>
  );
};
