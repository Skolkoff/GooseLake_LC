
import { http, HttpResponse } from 'msw';
import { specialSandwiches, ingredients, extras } from '../data/catalog';

export const catalogHandlers = [
  http.get('*/catalog/special-sandwiches', () => {
    return HttpResponse.json(specialSandwiches);
  }),
  http.get('*/catalog/ingredients', () => {
    return HttpResponse.json(ingredients);
  }),
  http.get('*/catalog/extras', () => {
    return HttpResponse.json(extras);
  }),
];
