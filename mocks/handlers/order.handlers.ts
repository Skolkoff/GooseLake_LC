
import { http, HttpResponse } from 'msw';
import { orderStatusStore, generateDeterministicOrderId } from '../data/orders';
import { CreateOrderResponse, OrderStatusResponse } from '../../shared/api/mockTypes';

export const orderHandlers = [
  http.post('*/orders', async () => {
    const orderId = generateDeterministicOrderId();
    orderStatusStore.set(orderId, { calls: 0 });
    
    const response: CreateOrderResponse = {
      orderId,
      status: "SENT_TO_PRINT"
    };
    
    return HttpResponse.json(response);
  }),

  http.get('*/orders/:orderId/status', ({ params }) => {
    const { orderId } = params;
    const order = orderStatusStore.get(orderId as string);
    
    if (!order) {
      return new HttpResponse(null, { status: 404 });
    }

    order.calls += 1;
    
    const status: OrderStatusResponse['status'] = order.calls >= 3 ? "PRINTED" : "SENT_TO_PRINT";
    
    const response: OrderStatusResponse = {
      status
    };

    return HttpResponse.json(response);
  }),
];
