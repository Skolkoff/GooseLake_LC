import { http, HttpResponse } from 'msw';
import { adminUsers } from '../data/adminUsers';
import { getAuthenticatedUser } from '../utils';

export const adminAuthHandlers = [
  http.post('*/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as any;
    
    const user = adminUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return HttpResponse.json(
        { code: "UNAUTHORIZED", message: "Invalid credentials" }, 
        { status: 401 }
      );
    }
    
    // Create a fake token
    const token = btoa(JSON.stringify({ id: user.id }));
    
    return HttpResponse.json({ accessToken: token });
  }),

  http.get('*/auth/me', ({ request }) => {
    const user = getAuthenticatedUser(request);
    
    if (!user) {
      return HttpResponse.json(
        { code: "UNAUTHORIZED", message: "Invalid session" }, 
        { status: 401 }
      );
    }
    
    // Return user without password
    const { password, ...safeUser } = user as any;
    return HttpResponse.json(safeUser);
  }),
];
