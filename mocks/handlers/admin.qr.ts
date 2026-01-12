import { http, HttpResponse } from 'msw';
import { requireAuth } from '../utils';

const ALLOWED_ROLES: ("ADMIN" | "MANAGER")[] = ['ADMIN', 'MANAGER'];

export const adminQrHandlers = [
  http.post('*/admin/qr/pdf', ({ request }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;
    
    // Simulate PDF generation delay
    return HttpResponse.json({ pdfUrl: '/mock/qr/latest.pdf' });
  }),
];
