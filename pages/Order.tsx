
import React from 'react';
import { OrderForm } from '../components/OrderForm';

const Order: React.FC = () => {
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
