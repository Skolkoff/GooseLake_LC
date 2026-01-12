
import { http, HttpResponse } from 'msw';
import { OrderWindowsResponse } from '../../shared/api/mockTypes';

export const configHandlers = [
  http.get('*/config/order-windows', () => {
    const response: OrderWindowsResponse = {
      orderWindow: { from: "06:00", to: "22:00" },
      dayShift: { from: "09:00", to: "17:00" }
    };
    return HttpResponse.json(response);
  }),
];
