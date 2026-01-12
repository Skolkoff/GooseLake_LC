import { http, HttpResponse } from 'msw';
import { specialSandwiches, ingredients, extras } from '../data/catalog';
import { requireAuth } from '../utils';
import { SpecialSandwich, Ingredient, Extra } from '../../shared/api/adminTypes';

const ALLOWED_ROLES: ("ADMIN" | "CHEF")[] = ['ADMIN', 'CHEF'];

export const adminCatalogHandlers = [
  // --- Special Sandwiches ---
  http.get('*/admin/special-sandwiches', ({ request }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;
    // Admin sees all
    return HttpResponse.json(specialSandwiches);
  }),

  http.post('*/admin/special-sandwiches', async ({ request }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;
    
    const body = await request.json() as Omit<SpecialSandwich, 'id'>;
    const newItem: SpecialSandwich = {
      ...body,
      id: `spec-${Date.now()}`,
    };
    
    specialSandwiches.push(newItem);
    return HttpResponse.json(newItem);
  }),

  http.patch('*/admin/special-sandwiches/:id', async ({ request, params }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;
    
    const { id } = params;
    const body = await request.json() as Partial<SpecialSandwich>;
    
    const index = specialSandwiches.findIndex(s => s.id === id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    
    specialSandwiches[index] = { ...specialSandwiches[index], ...body };
    return HttpResponse.json(specialSandwiches[index]);
  }),

  http.delete('*/admin/special-sandwiches/:id', ({ request, params }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;
    
    const { id } = params;
    const index = specialSandwiches.findIndex(s => s.id === id);
    
    if (index !== -1) {
      specialSandwiches.splice(index, 1);
    }
    
    return HttpResponse.json({ success: true });
  }),

  // --- Ingredients ---
  http.get('*/admin/ingredients', ({ request }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;

    const url = new URL(request.url);
    const query = url.searchParams.get('query')?.toLowerCase();
    const category = url.searchParams.get('category');

    let filtered = ingredients;

    if (category && category !== 'ALL') {
      filtered = filtered.filter(i => i.category === category);
    }

    if (query) {
      filtered = filtered.filter(i => i.name.toLowerCase().includes(query));
    }

    return HttpResponse.json(filtered);
  }),

  http.post('*/admin/ingredients', async ({ request }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;

    const body = await request.json() as Omit<Ingredient, 'id'>;
    const newItem: Ingredient = {
      ...body,
      id: `ing-${Date.now()}`,
    };

    ingredients.push(newItem);
    return HttpResponse.json(newItem);
  }),

  http.patch('*/admin/ingredients/:id', async ({ request, params }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;

    const { id } = params;
    const body = await request.json() as Partial<Ingredient>;

    const index = ingredients.findIndex(i => i.id === id);
    if (index === -1) return new HttpResponse(null, { status: 404 });

    ingredients[index] = { ...ingredients[index], ...body };
    return HttpResponse.json(ingredients[index]);
  }),

  http.delete('*/admin/ingredients/:id', ({ request, params }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;

    const { id } = params;
    const index = ingredients.findIndex(i => i.id === id);

    if (index !== -1) {
      ingredients.splice(index, 1);
    }

    return HttpResponse.json({ success: true });
  }),

  // --- Extras ---
  http.get('*/admin/extras', ({ request }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;
    return HttpResponse.json(extras);
  }),

  http.post('*/admin/extras', async ({ request }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;

    const body = await request.json() as Omit<Extra, 'id'>;
    const newItem: Extra = {
      ...body,
      id: `ext-${Date.now()}`,
    };

    extras.push(newItem);
    return HttpResponse.json(newItem);
  }),

  http.patch('*/admin/extras/:id', async ({ request, params }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;

    const { id } = params;
    const body = await request.json() as Partial<Extra>;

    const index = extras.findIndex(e => e.id === id);
    if (index === -1) return new HttpResponse(null, { status: 404 });

    extras[index] = { ...extras[index], ...body };
    return HttpResponse.json(extras[index]);
  }),

  http.delete('*/admin/extras/:id', ({ request, params }) => {
    const { error } = requireAuth(request, ALLOWED_ROLES);
    if (error) return error;

    const { id } = params;
    const index = extras.findIndex(e => e.id === id);

    if (index !== -1) {
      extras.splice(index, 1);
    }

    return HttpResponse.json({ success: true });
  }),
];
