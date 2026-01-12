import { referenceHandlers } from './reference.handlers';
import { catalogHandlers } from './catalog.handlers';
import { serviceHandlers } from './service.handlers';
import { configHandlers } from './config.handlers';
import { orderHandlers } from './order.handlers';
import { adminAuthHandlers } from './admin.auth';
import { adminUserHandlers } from './admin.users';
import { adminCatalogHandlers } from './admin.catalog';
import { adminSettingsHandlers } from './admin.settings';
import { adminQrHandlers } from './admin.qr';

export const handlers = [
  ...referenceHandlers,
  ...catalogHandlers,
  ...serviceHandlers,
  ...configHandlers,
  ...orderHandlers,
  ...adminAuthHandlers,
  ...adminUserHandlers,
  ...adminCatalogHandlers,
  ...adminSettingsHandlers,
  ...adminQrHandlers,
];
