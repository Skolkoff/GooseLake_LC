import { http, HttpResponse } from 'msw';
import { timeSettings, maintenanceSettings, updateTimeSettings, updateMaintenanceSettings } from '../data/adminSettings';
import { requireAuth } from '../utils';

const ALLOWED_ROLES: ("ADMIN" | "MANAGER")[] = ['ADMIN', 'MANAGER'];

export const adminSettingsHandlers = [
  // Time Settings
  http.get('*/admin/settings/time', ({ request }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;
    return HttpResponse.json(timeSettings);
  }),

  http.put('*/admin/settings/time', async ({ request }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;
    
    const body = await request.json() as any;
    const updated = updateTimeSettings(body);
    return HttpResponse.json(updated);
  }),

  // Maintenance Settings
  http.get('*/admin/settings/maintenance', ({ request }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;
    return HttpResponse.json(maintenanceSettings);
  }),

  http.put('*/admin/settings/maintenance', async ({ request }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;
    
    const body = await request.json() as any;
    const updated = updateMaintenanceSettings(body);
    return HttpResponse.json(updated);
  }),
];
