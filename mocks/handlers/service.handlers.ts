
import { http, HttpResponse } from 'msw';
import { ServiceStatusResponse } from '../../shared/api/mockTypes';

export const serviceHandlers = [
  http.get('*/service/status', () => {
    const response: ServiceStatusResponse = {
      isOpen: true,
      message: null
    };
    return HttpResponse.json(response);
  }),
];
