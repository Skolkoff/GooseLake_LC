
import { 
  ServiceStatusResponse, 
  OrderWindowsResponse, 
  ReferenceItem, 
  CatalogItem, 
  Ingredient,
  CreateOrderResponse,
  OrderStatusResponse
} from '../shared/api/mockTypes';

async function fetchWithError(url: string, options?: RequestInit) {
  // Use relative paths to ensure requests are caught correctly by MSW
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    }),
    
  getOrderStatus: (orderId: string): Promise<OrderStatusResponse> => 
    fetchWithError(`orders/${orderId}/status`),
};
