import { http, HttpResponse } from 'msw';
import { OrderWindowsResponse } from '../../shared/api/mockTypes';
import { timeSettings } from '../data/adminSettings';

export const configHandlers = [
  http.get('*/config/order-windows', () => {
    // Use dynamic settings from admin store
    const response: OrderWindowsResponse = {
      orderWindow: { 
        from: timeSettings.orderWindowFrom, 
        to: timeSettings.orderWindowTo 
      },
      dayShift: { 
        from: timeSettings.dayShiftFrom, 
        to: timeSettings.dayShiftTo 
      }
    };
    return HttpResponse.json(response);
  }),
];
