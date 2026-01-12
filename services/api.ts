import { 
  ServiceStatusResponse, 
  OrderWindowsResponse, 
  ReferenceItem, 
  CatalogItem, 
  Ingredient,
  CreateOrderResponse,
  OrderStatusResponse
} from '../shared/api/mockTypes';
import { 
  AdminUser, 
  LoginResponse, 
  SpecialSandwich, 
  Ingredient as AdminIngredient,
  Extra,
  TimeSettings,
  MaintenanceSettings,
  Role
} from '../shared/api/adminTypes';

const getToken = () => localStorage.getItem('gl_admin_token');

async function fetchWithError(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Use relative paths to ensure requests are caught correctly by MSW
  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  getServiceStatus: (): Promise<ServiceStatusResponse> => fetchWithError('service/status'),
  getOrderWindows: (): Promise<OrderWindowsResponse> => fetchWithError('config/order-windows'),
  getDepartments: (): Promise<ReferenceItem[]> => fetchWithError('reference/departments'),
  getWings: (): Promise<ReferenceItem[]> => fetchWithError('reference/wings'),
  getSpecialSandwiches: (): Promise<CatalogItem[]> => fetchWithError('catalog/special-sandwiches'),
  getIngredients: (): Promise<Ingredient[]> => fetchWithError('catalog/ingredients'),
  getExtras: (): Promise<CatalogItem[]> => fetchWithError('catalog/extras'),
  
  createOrder: (orderData: any): Promise<CreateOrderResponse> => 
    fetchWithError('orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),
    
  getOrderStatus: (orderId: string): Promise<OrderStatusResponse> => 
    fetchWithError(`orders/${orderId}/status`),

  // Admin Auth
  adminLogin: (creds: { email: string; password: string }): Promise<LoginResponse> => 
    fetchWithError('auth/login', {
      method: 'POST',
      body: JSON.stringify(creds)
    }),
  getMe: (): Promise<AdminUser> => fetchWithError('auth/me'),

  // Admin Catalog - Special Sandwiches
  getAdminSpecialSandwiches: (): Promise<SpecialSandwich[]> => fetchWithError('admin/special-sandwiches'),
  
  createSpecialSandwich: (data: Omit<SpecialSandwich, 'id'>): Promise<SpecialSandwich> => 
    fetchWithError('admin/special-sandwiches', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  updateSpecialSandwich: (id: string, data: Partial<SpecialSandwich>): Promise<SpecialSandwich> => 
    fetchWithError(`admin/special-sandwiches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
    
  deleteSpecialSandwich: (id: string): Promise<void> => 
    fetchWithError(`admin/special-sandwiches/${id}`, {
      method: 'DELETE'
    }),

  // Admin Catalog - Ingredients
  getAdminIngredients: (params?: { query?: string; category?: string }): Promise<AdminIngredient[]> => {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.append('query', params.query);
    if (params?.category && params.category !== 'ALL') searchParams.append('category', params.category);
    return fetchWithError(`admin/ingredients?${searchParams.toString()}`);
  },

  createIngredient: (data: Omit<AdminIngredient, 'id'>): Promise<AdminIngredient> => 
    fetchWithError('admin/ingredients', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateIngredient: (id: string, data: Partial<AdminIngredient>): Promise<AdminIngredient> => 
    fetchWithError(`admin/ingredients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),

  deleteIngredient: (id: string): Promise<void> => 
    fetchWithError(`admin/ingredients/${id}`, {
      method: 'DELETE'
    }),

  // Admin Catalog - Extras
  getAdminExtras: (): Promise<Extra[]> => fetchWithError('admin/extras'),

  createExtra: (data: Omit<Extra, 'id'>): Promise<Extra> => 
    fetchWithError('admin/extras', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateExtra: (id: string, data: Partial<Extra>): Promise<Extra> => 
    fetchWithError(`admin/extras/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),

  deleteExtra: (id: string): Promise<void> => 
    fetchWithError(`admin/extras/${id}`, {
      method: 'DELETE'
    }),

  // Admin Settings
  getTimeSettings: (): Promise<TimeSettings> => fetchWithError('admin/settings/time'),
  
  updateTimeSettings: (settings: TimeSettings): Promise<TimeSettings> => 
    fetchWithError('admin/settings/time', {
      method: 'PUT',
      body: JSON.stringify(settings)
    }),
  
  getMaintenanceSettings: (): Promise<MaintenanceSettings> => fetchWithError('admin/settings/maintenance'),
  
  updateMaintenanceSettings: (settings: MaintenanceSettings): Promise<MaintenanceSettings> => 
    fetchWithError('admin/settings/maintenance', {
      method: 'PUT',
      body: JSON.stringify(settings)
    }),

  // Admin QR
  generateQrPdf: (data: { targetUrl: string; commentText?: string }): Promise<{ pdfUrl: string }> => 
    fetchWithError('admin/qr/pdf', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Admin Users
  getAdminUsers: (): Promise<{ items: AdminUser[], total: number }> => 
    fetchWithError('admin/users'),

  createAdminUser: (data: Partial<AdminUser> & { password: string }): Promise<AdminUser> => 
    fetchWithError('admin/users', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  resetAdminUserPassword: (id: string, password: string): Promise<void> => 
    fetchWithError(`admin/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ password })
    }),
};
