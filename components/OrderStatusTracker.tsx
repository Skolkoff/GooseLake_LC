
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface OrderStatusTrackerProps {
  orderId: string;
}

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ orderId }) => {
  const [pollingTime, setPollingTime] = useState(0);
  const MAX_POLLING_SECONDS = 45;

  const { data, isError } = useQuery({
    queryKey: ['orderStatus', orderId],
    queryFn: () => api.getOrderStatus(orderId),
    refetchInterval: (query) => {
      // Stop polling if we reach PRINTED or timeout
      if (query.state.data?.status === 'PRINTED' || pollingTime >= MAX_POLLING_SECONDS) return false;
      return 3000;
    },
    enabled: !!orderId,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setPollingTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isPrinted = data?.status === 'PRINTED';
  const isTimedOut = !isPrinted && pollingTime >= MAX_POLLING_SECONDS;

  return (
    <div className="p-8 flex flex-col items-center text-center space-y-8 animate-in fade-in duration-500">
      <div className="relative">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 ${
          isPrinted ? 'bg-green-100 scale-110' : 'bg-primary/10'
        }`}>
          {isPrinted ? (
            <span className="text-4xl">✅</span>
          ) : (
            <span className="text-4xl animate-bounce">🖨️</span>
          )}
        </div>
        {!isPrinted && !isTimedOut && (
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          {isPrinted ? 'Заказ напечатан' : 'Заказ отправлен на печать'}
        </h2>
        
        <p className="text-neutral-500 max-w-sm">
          {isPrinted 
            ? 'Ваш заказ успешно передан на кухню. Ожидайте готовности к выбранному времени.' 
            : isTimedOut 
              ? 'Ожидаем подтверждение печати, проверьте позже.'
              : 'Мы передаем информацию о вашем заказе нашему принтеру чеков...'}
        </p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-neutral-400">
          <span>Статус</span>
          <span>{isPrinted ? '100%' : `${Math.min(Math.round((pollingTime / MAX_POLLING_SECONDS) * 100), 99)}%`}</span>
        </div>
        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${isPrinted ? 'bg-green-500 w-full' : 'bg-primary'}`}
            style={{ width: isPrinted ? '100%' : `${(pollingTime / MAX_POLLING_SECONDS) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-xs font-medium text-neutral-400">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${data?.status === 'SENT_TO_PRINT' ? 'bg-primary animate-pulse' : 'bg-neutral-200'}`}></div>
            SENT_TO_PRINT
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${isPrinted ? 'bg-green-500' : 'bg-neutral-200'}`}></div>
            PRINTED
          </div>
        </div>
      </div>

      {isTimedOut && (
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-neutral-900 text-white rounded-lg text-sm font-bold"
        >
          На главную
        </button>
      )}
    </div>
  );
};
