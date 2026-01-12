import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { OrderForm } from '../components/OrderForm';

const Order: React.FC = () => {
  const { data: status, isLoading } = useQuery({
    queryKey: ['serviceStatus'],
    queryFn: api.getServiceStatus,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If service is closed (e.g. maintenance or manually closed), show blocking message
  if (status && !status.isOpen) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-in fade-in zoom-in-95">
        <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M16.338 3.031l-1.54 1.538-1.023-.482a2.292 2.292 0 00-2.404.94l-.391.683a2.292 2.292 0 01-1.92 1.136h-.738a2.292 2.292 0 00-2.152 1.54l-.195.666a2.292 2.292 0 01-1.378 1.458l-.666.195a2.292 2.292 0 00-1.54 2.152v.738c0 .769.412 1.474 1.074 1.841l.745.428c.86.495 1.196 1.574.745 2.433l-.538.944c-.722 1.266-.27 2.879.992 3.606l1.206.696c1.265.728 2.882.268 3.605-.996l.538-.943c.451-.86 1.53-1.196 2.433-.745l.944.538c1.265.723 2.879.27 3.606-.991l.696-1.206c.728-1.265.268-2.882-.996-3.605l-.943-.538a1.988 1.988 0 01-.745-2.433l.538-.944c.723-1.265.27-2.879-.991-3.606l-1.206-.696c-1.266-.728-2.882-.268-3.605.996l-.538.943a1.988 1.988 0 01-2.433.745l-.944-.538c-1.265-.723-2.879-.27-3.606.991l-.696 1.206z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-4">Service Unavailable</h1>
        <p className="text-xl text-neutral-500 max-w-xl mx-auto mb-8">
          {status.message || "We are currently undergoing scheduled maintenance. Please check back later."}
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-2 tracking-tight">Оформление заказа</h1>
        <p className="text-neutral-500">Пожалуйста, заполните данные сотрудника и выберите время получения.</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        <OrderForm />
      </div>
    </div>
  );
};

export default Order;
