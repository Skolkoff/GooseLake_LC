import { http, HttpResponse } from 'msw';
import { ServiceStatusResponse } from '../../shared/api/mockTypes';
import { maintenanceSettings } from '../data/adminSettings';

export const serviceHandlers = [
  http.get('*/service/status', () => {
    // If maintenance is enabled, override status
    if (maintenanceSettings.isEnabled) {
      return HttpResponse.json({
        isOpen: false,
        message: maintenanceSettings.message || "The service is currently under maintenance."
      });
    }

    const response: ServiceStatusResponse = {
      isOpen: true,
      message: null
    };
    return HttpResponse.json(response);
  }),
];
