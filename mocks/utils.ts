import { HttpResponse, DefaultBodyType, StrictRequest } from 'msw';
import { adminUsers } from './data/adminUsers';
import { Role, AdminUser } from '../shared/api/adminTypes';

export const getAuthenticatedUser = (request: StrictRequest<DefaultBodyType>): AdminUser | null => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  try {
    const token = authHeader.split(' ')[1];
    // In a real app, verify signature. Here we just decode the base64 payload.
    // Token format: base64(JSON.stringify({ id: userId }))
    const payload = JSON.parse(atob(token));
    return adminUsers.find(u => u.id === payload.id) || null;
  } catch {
    return null;
  }
};

export const requireAuth = (request: StrictRequest<DefaultBodyType>, allowedRoles: Role[]) => {
  const user = getAuthenticatedUser(request);
  
  if (!user) {
    return { 
      error: HttpResponse.json({ code: "UNAUTHORIZED", message: "Invalid credentials" }, { status: 401 }),
      user: null
    };
  }

  if (!allowedRoles.includes(user.role)) {
    return {
      error: HttpResponse.json({ code: "FORBIDDEN", message: "Access denied" }, { status: 403 }),
      user
    };
  }

  return { error: null, user };
};
