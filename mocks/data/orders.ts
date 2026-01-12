
export const orderStatusStore = new Map<string, { calls: number }>();

let orderCounter = 0;

export const generateDeterministicOrderId = () => {
  orderCounter++;
  return `99999999-0000-0000-0000-${orderCounter.toString().padStart(12, '0')}`;
};
