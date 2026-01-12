
import { referenceHandlers } from './reference.handlers';
import { catalogHandlers } from './catalog.handlers';
import { serviceHandlers } from './service.handlers';
import { configHandlers } from './config.handlers';
import { orderHandlers } from './order.handlers';

export const handlers = [
  ...referenceHandlers,
  ...catalogHandlers,
  ...serviceHandlers,
  ...configHandlers,
  ...orderHandlers,
];
