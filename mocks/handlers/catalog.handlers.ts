import { http, HttpResponse } from 'msw';
import { specialSandwiches, ingredients, extras } from '../data/catalog';

export const catalogHandlers = [
  http.get('*/catalog/special-sandwiches', () => {
    // Public API only sees active items
    const activeItems = specialSandwiches
      .filter(i => i.isActive)
      .map(({ isActive, ...item }) => item);
    return HttpResponse.json(activeItems);
  }),
  
  http.get('*/catalog/ingredients', () => {
    const activeItems = ingredients
      .filter(i => i.isActive)
      .map(({ isActive, ...item }) => item);
    return HttpResponse.json(activeItems);
  }),
  
  http.get('*/catalog/extras', () => {
    const activeItems = extras
      .filter(i => i.isActive)
      .map(({ isActive, ...item }) => item);
    return HttpResponse.json(activeItems);
  }),
];
