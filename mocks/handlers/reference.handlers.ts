
import { http, HttpResponse } from 'msw';
import { departments, wings } from '../data/reference';

export const referenceHandlers = [
  http.get('*/reference/departments', () => {
    return HttpResponse.json(departments);
  }),
  http.get('*/reference/wings', () => {
    return HttpResponse.json(wings);
  }),
];
