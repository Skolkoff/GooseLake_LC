import { http, HttpResponse } from 'msw';
import { adminUsers } from '../data/adminUsers';
import { requireAuth } from '../utils';
import { Role } from '../../shared/api/adminTypes';

export const adminUserHandlers = [
  // GET /admin/users
  http.get('*/admin/users', ({ request }) => {
    // ADMIN can see all, MANAGER can see all (but can only edit CHEF)
    const { error } = requireAuth(request, ['ADMIN', 'MANAGER']);
    if (error) return error;

    // Filter out passwords
    const safeUsers = adminUsers.map(({ password, ...u }) => u);
    return HttpResponse.json({ items: safeUsers, total: safeUsers.length });
  }),

  // POST /admin/users
  http.post('*/admin/users', async ({ request }) => {
    const { error, user: currentUser } = requireAuth(request, ['ADMIN', 'MANAGER']);
    if (error) return error;
    if (!currentUser) return; // Should be handled by error check above

    const body = await request.json() as any;
    
    // RBAC: MANAGER can only create CHEF
    if (currentUser.role === 'MANAGER' && body.role !== 'CHEF') {
      return HttpResponse.json({ code: "FORBIDDEN", message: "Managers can only create Chefs" }, { status: 403 });
    }

    const newUser = {
      ...body,
      id: `user-${Date.now()}`,
      isActive: true,
      createdAtIso: new Date().toISOString()
    };
    
    // In a real app we would push to DB. For mocks, we just pretend.
    // adminUsers.push(newUser); 
    
    return HttpResponse.json(newUser);
  }),

  // POST /admin/users/:id/reset-password
  http.post('*/admin/users/:id/reset-password', ({ request, params }) => {
    const { error, user: currentUser } = requireAuth(request, ['ADMIN', 'MANAGER']);
    if (error) return error;
    if (!currentUser) return;

    const targetUser = adminUsers.find(u => u.id === params.id);
    if (!targetUser) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }

    // RBAC: MANAGER can only reset CHEF
    if (currentUser.role === 'MANAGER' && targetUser.role !== 'CHEF') {
      return HttpResponse.json({ code: "FORBIDDEN", message: "Managers can only reset Chefs" }, { status: 403 });
    }

    return HttpResponse.json({ ok: true });
  }),
];
